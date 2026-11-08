// 体力（vit）：顶栏数值/上限、宿舍研究所产出领取、买体力、道具使用、出击扣体力。
//
// 依据真机新版客户端（tools/bc_cmp/vit_new/ 是 tools/lua_remote/bc 的反编译产物）：
//  - 体力 = role_scores[id=5]，但顶栏读 GlobalData.vit，而 initData 不会把 scoreDic[5] 同步过去
//    → **登录必须推 m_vit_update_toc{vit, buy_time}**，否则顶栏恒 0；
//  - 上限只能靠服务端推 m_dynamic_limit_toc{silver, vit}（客户端的 tos 是空存根）；
//  - m_vit_buy_toc / m_item_use_toc 客户端都不更新 GlobalData → 变化后必须补推 m_vit_update_toc；
//  - 出击消耗 = 出战誓灵 costVit 之和（客户端只把文字染红，不拦截），不足回 m_common_error_toc{262006}。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log, getScore, pushAssetChange, pushGoodsUpdate, grantGoods, normSlots,
  bagTypeOf, bagSizeOf } = L;
const V = require('../data/vit_data');
const GD = require('../data/guide_data');
const BD = require('../data/relic_box_data');

const now = () => Math.floor(Date.now() / 1000);
const dayKey = () => new Date().toLocaleDateString('sv');
const vs = () => S.vitState;

// ---- 体力读写与下发 ----
function getVit() { return getScore(V.SCORE_VIT); }
function setVit(v) {
  if (!S.roleAsset.scores) S.roleAsset.scores = {};
  S.roleAsset.scores[V.SCORE_VIT] = Math.max(0, Math.floor(Number(v) || 0));
}
function pushVit(conn) {
  conn.sendToc('m_vit_update_toc', { vit: getVit(), buy_time: vs().buyTime || 0 });
}
// 上限：两个字段必须同时给（客户端 updateVitAndMoneyMax 会拼字符串，任一为 nil 就崩）。
// 星图基建加成：36 电池包扩容 +100/级、37 钱包扩容 +500/级（CfgGrow/vit_data 头注预告的接入点）
function pushLimit(conn) {
  const GROW = require('../data/grow_data').EFFECT;
  const GR = require('./grow'); // 延迟 require 解 vit↔grow 循环依赖
  conn.sendToc('m_dynamic_limit_toc', {
    silver: V.SILVER_MAX + GR.starLv(37) * GROW.SILVER_STORE_PER_LV,
    vit: V.VIT_MAX + GR.starLv(36) * GROW.VIT_STORE_PER_LV,
  });
}
function addVit(conn, delta) {
  setVit(getVit() + Number(delta || 0));
  saveState();
  if (conn) pushVit(conn);
  return getVit();
}

// 每日重置买体力次数
function checkVitReset(conn) {
  const st = vs();
  if (st.buyDay !== dayKey()) {
    st.buyDay = dayKey();
    st.buyTime = 0;
    saveState();
    if (conn) pushVit(conn);
    log('[vit] 跨天重置买体力次数');
  }
}

// ---- 研究所产出（bd 1 用爱发电=体力、bd 2 信仰充值=金币）----
// 官方模型：按小时产出、有储存上限、玩家点气泡领取（没有"体力每 N 分钟自动回 1 点"这种机制）
// 星图基建加成（CfgGrow）：bd1 → 33 电容扩充（储存 +50/级）+ 35 加强电流（产量 +2/级）；
// bd2 → 32 仓库扩建（储存 +150/级）+ 34 信仰加倍（产量 +5/级）
function studyPending(bdId) {
  const cfg = V.studyEffect(bdId, (S.dormState.buildings && S.dormState.buildings[bdId]) || 1);
  if (!cfg) return null;
  const GE = require('../data/grow_data').EFFECT;
  const GR = require('./grow'); // 延迟 require 解 vit↔grow 循环依赖
  if (bdId === 1) {
    cfg.maxStore += GR.starLv(33) * GE.VIT_STORE_ADD_PER_LV;
    cfg.perHour += GR.starLv(35) * GE.VIT_GEN_PER_LV;
  } else if (bdId === 2) {
    cfg.maxStore += GR.starLv(32) * GE.SILVER_STORE_ADD_PER_LV;
    cfg.perHour += GR.starLv(34) * GE.SILVER_GEN_PER_LV;
  }
  const st = vs();
  if (!st.studyAt) st.studyAt = {};
  if (!st.studyAt[bdId]) { st.studyAt[bdId] = now(); saveState(); }
  const elapsed = Math.max(0, now() - st.studyAt[bdId]);
  const num = Math.min(cfg.maxStore, Math.floor(elapsed * cfg.perHour / 3600));
  return { num, cfg, elapsed };
}
// 家具头顶气泡（客户端 HouseMgr.updateBuildingReward 按 id 存，体力必须是 bd_id=1）
function pushStudyNotify(conn, bdId) {
  const p = studyPending(bdId);
  if (!p) return;
  conn.sendToc('m_building_reward_notify_toc', {
    id: bdId,
    reward: p.num > 0 ? [{ id: p.cfg.item, val: p.num }] : [],
  });
}

// 登录同步：体力值 + 上限 + 两个产出气泡（不推的话顶栏体力恒 0、MAX 恒 0）
function onLogin(conn) {
  checkVitReset(conn);
  pushVit(conn);
  pushLimit(conn);
  pushStudyNotify(conn, 1);
  pushStudyNotify(conn, 2);
  log(`[vit] 登录同步：体力 ${getVit()}/${V.VIT_MAX}，今日已买 ${vs().buyTime || 0} 次`);
}

// ---- 出击扣体力 ----
// 消耗 = 出战队伍（主队 field + 副队 bench）中誓灵 costVit 之和（客户端 FormationMgr.getTeamCost 同口径，
// 它还会跳过 hp=0 的誓灵，本地服誓灵不带残血状态 → 全算）
function sortieCost(lastId) {
  const f = S.formations[lastId] || S.formations[1] || {};
  const ids = normSlots(f.field).concat(normSlots(f.bench)).filter(id => id > 0);
  let cost = 0;
  for (const id of ids) {
    const b = S.servants.find(s => Number(s.id) === Number(id));
    if (b) cost += V.costVitOf(b.type);
  }
  return cost;
}
// 出击前扣体力：不足 → 回 m_common_error_toc{262006}（客户端 ErrorConfig 弹"体力不足"）并返回 false
// teamIds：单队号或队伍号数组（二百八十二·续 D：多队出击 CopySortiePanel maxTeam=2，扣全部
// 出战队伍之和——官方口径"出战誓灵 costVit 之和"按队扩展；只扣 firstId 会让第二队白进关）。
// 不足时**整单拒绝不扣**（不部分扣费）。
function spendSortieVit(conn, teamIds) {
  const list = (Array.isArray(teamIds) ? teamIds : [teamIds]).map(Number).filter(n => n > 0);
  const seen = new Set();
  let cost = 0;
  for (const t of list) {
    if (seen.has(t)) continue;
    seen.add(t);
    cost += sortieCost(t);
  }
  if (cost <= 0) return true;
  if (getVit() < cost) {
    conn.sendToc('m_common_error_toc', { code: V.ERR_VIT_NOT_ENOUGH });
    log(`[vit] 出击被拒：体力不足（需 ${cost}，有 ${getVit()}）`);
    return false;
  }
  addVit(conn, -cost);
  // 官方口径：每消耗 1 点体力 = 1 点结社本周贡献
  require('./family').addContribution(conn, cost);
  // 活动扩展：体力消耗派生货币（乞巧灵巧/圣诞袜/便当/巧克力/诗文断章，各 10:1）
  try { require('./act_extra').actEvent(conn, 'vit', cost, null); } catch (e) { /* 忽略 */ }
  log(`[vit] 出击扣体力 ${cost}（队伍 [${list.join(',') || '无'}]）→ 余 ${getVit()}`);
  return true;
}

// 道具产出发放（CfgItems.data）：体力/金币/水晶/御灵士经验直接进资产，**道具形态积分**
// （data/score_items.js：CfgScoreItem∩form=2，如礼包里的协会点数 31000009）落 role_scores，
// 其余按物品入包
// times 省略按 1（首通奖励等单份发放路径直接传一条 reward）
function grantItemRewards(conn, rewards, times) {
  const changed = [];
  const mul = Number(times) > 0 ? Number(times) : 1;
  let vitAdd = 0, silverAdd = 0, goldAdd = 0, roleExpAdd = 0;
  const scoreAdd = {}; // {scoreId: num}——同一批合并推送
  for (const r of rewards) {
    const num = r.num * mul;
    if (r.type === V.ITEM_VIT) vitAdd += num;
    else if (r.type === V.ITEM_SILVER) silverAdd += num;
    else if (r.type === V.ITEM_GOLD) goldAdd += num;
    else if (r.type === V.ITEM_ROLE_EXP) roleExpAdd += num; // 指挥官经验（2026-08-24 起等级系统已实装）
    else {
      const sid = L.scoreIdOfItem(r.type);
      if (sid) scoreAdd[sid] = (scoreAdd[sid] || 0) + num;
      else changed.push(...grantGoods(r.type, num, conn)); // conn 透传：誓灵代币类产出当场宣告（黄金史莱喵礼包等）
    }
  }
  if (silverAdd) S.roleAsset.silver += silverAdd;
  if (goldAdd) { S.roleAsset.gold += goldAdd; S.roleAsset.gold_given += goldAdd; }
  if (vitAdd) setVit(getVit() + vitAdd);
  // 道具形态积分：落 role_scores（客户端读 getScore，入包会看不到也用不了）
  for (const [sid, num] of Object.entries(scoreAdd)) L.addScore(conn, Number(sid), num);
  // 指挥官经验：推送时序与战斗结算一致（exp_change 先、levelup 后）
  let roleR = null;
  if (roleExpAdd) {
    roleR = L.applyRoleExpGain(roleExpAdd);
    L.pushRoleExpChange(conn);
  }
  saveState();
  if (changed.length) pushGoodsUpdate(conn, changed, 3);
  if (silverAdd || goldAdd) pushAssetChange(conn);
  if (vitAdd) pushVit(conn);
  if (roleR && roleR.leveledUp) L.pushRoleLevelup(conn);
  return { vitAdd, silverAdd, goldAdd, roleExpAdd, changed, scoreAdd };
}

// ---- 遗物箱开箱（圣器遗物箱 / 核心遗物箱 / 原初圣器遗物箱）----
// 这批箱子 CfgItems.data = {}（产出在官方服务端），此前服务端没有产出表 → 点开箱后只回
// m_common_reply_toc，客户端毫无反应（2026-09-12 真机日志实证）。
// 产出表见 data/relic_box_data.js（按箱子短描述还原：Lv 档位 + 权重）。
const BAG_FULL_CODE = 31045; // CfgErrorCode「背包已满，不能使用道具」（type=TIP → 客户端弹 Tips）
// 圣器(2)/核心(4)/信仰(7) 每个实例占 1 格，开箱前先算剩余空间
function freeSlots(bt) {
  const used = S.bagGoods.filter(x => Number(x.bag_type) === Number(bt)).length;
  return Math.max(0, bagSizeOf(bt) - used);
}
// 誓灵产出（神迹箱 / 神秘箱子的「概率获得誓灵」）：与 summon.js 同口径
//   makeServantBrief 建卡 → 入 S.servants → m_servant_update_toc{new, reward_type=5}
//   （reward_type=5 = ServantConst.REWARD_TYPE_SUMMON → 客户端 ServantMgr.addServant + OutCardMgr 展示队列）
function grantServant(conn, type) {
  const t = Number(type);
  // is_first=图鉴未激活（先判后建卡：makeServantBrief 会激活图鉴）。不再叠加稀有度条件——
  // NEW 角标语义就是"首次获得"，与客户端图鉴列表同源
  const first = require('./handbook').isUnlocked(t) ? 0 : 1;
  const brief = require('./servant').makeServantBrief(t);
  // 非法 type：makeServantBrief 已拒绝并记日志。绝不入列也绝不推送（毒化客户端类型计数表 →
  // 祭坛 updateRankList 索引 nil 崩）；返回 null 让调用方当作"本次未产出誓灵"处理
  if (!brief) return null;
  require('./servant').grantServantBrief(brief);
  // reward_type 选择（客户端 ServantModule.m_servant_update_toc 实证）：
  //   · 5 = REWARD_TYPE_SUMMON（抽卡）在 ServantConst.isShowRewardType 的**排除表 {2,5,7,8,9}** 里
  //     → 不会自动弹 OutCard 面板（抽卡是由 SummonResultPanel 显式唤起的），开箱用会变成"静默发誓灵"。
  //   · 2 = REWARD_TYPE_COPY（本服 collab/dream/map_fight 在用）同样不自动弹，且还要 is_first/5星 才入队。
  //   · 取 6：落到 else 分支 → 无条件 addNewServants，且 isShowRewardType(6)=true
  //     → OutCardModule.preloadThenOpenPanel() 自动弹出获得动画。
  conn.sendToc('m_servant_update_toc', {
    new: [{ servant: brief, is_first: first }],
    update: [], del: [], reward_type: 6,
  });
  return brief;
}
// 返回 true = 已处理并回包（调用方直接 return）；false = 数量非法，交给通用分支
function openRelicBox(conn, g, want) {
  const typeId = Number(g.type_id);
  const maxUse = V.ITEM_MAX_USE[typeId] || 99;
  const times = Math.min(want, Number(g.cur_num) || 0, maxUse);
  if (times <= 0) return false;
  // 引导箱（组 40 背包引导必用 21000000）：组 51「装备生命核心」未完成前**固定给生命核心**，
  // 否则随机给成其他属性会让引导停在组 51 反复教（见 guide_data.js）
  const gs = S.guideState;
  const guideFixed = (gs && Number(typeId) === 21000000
    && !(gs.done || []).includes(GD.GUIDE_BOX_FIXED_UNTIL_GROUP)) ? GD.GUIDE_BOX_FIXED_CORE : 0;
  const opened = [];
  const servants = [];
  let totalVit = 0, totalSilver = 0, totalGold = 0, totalRoleExp = 0;
  const aggregatedItems = {}; // { typeId: num }
  let used = 0;

  for (let i = 0; i < times; i++) {
    const r = BD.rollBox(typeId);
    if (!r) break;

    // 誓灵产出（不走背包，无格子限制）
    if (r.kind === 'servant') {
      grantServant(conn, r.servantType);
      servants.push(r.name || String(r.servantType));
      aggregatedItems[r.servantType + 30000000] = (aggregatedItems[r.servantType + 30000000] || 0) + 1;
      used++;
      continue;
    }

    // 皮肤产出
    if (r.kind === 'skin') {
      if (r.skinId) {
        if (!S.skinState) S.skinState = { owned: [] };
        if (!S.skinState.owned) S.skinState.owned = [];
        if (!S.skinState.owned.includes(r.skinId)) S.skinState.owned.push(r.skinId);
      }
      if (r.itemId) {
        const got = grantGoods(r.itemId, 1, conn);
        opened.push(...got);
        aggregatedItems[r.itemId] = (aggregatedItems[r.itemId] || 0) + 1;
      }
      used++;
      continue;
    }

    // 复合奖励产出（红包/礼包/体力/金币/水晶等）
    if (r.kind === 'multi' || Array.isArray(r.rewards)) {
      const res = grantItemRewards(conn, r.rewards, 1);
      totalVit += res.vitAdd;
      totalSilver += res.silverAdd;
      totalGold += res.goldAdd;
      totalRoleExp += res.roleExpAdd;
      opened.push(...res.changed);
      for (const rw of r.rewards) {
        if (rw.type !== V.ITEM_VIT && rw.type !== V.ITEM_SILVER && rw.type !== V.ITEM_GOLD && rw.type !== V.ITEM_ROLE_EXP) {
          aggregatedItems[rw.type] = (aggregatedItems[rw.type] || 0) + (Number(rw.num) || 1);
        }
      }
      used++;
      continue;
    }

    // 单个物品/圣器/核心/信仰
    const rid = guideFixed || r.typeId;
    const bt = bagTypeOf(rid);
    if ((bt === 2 || bt === 4 || bt === 7) && freeSlots(bt) <= 0) break; // 圣器/核心/信仰背包满：停止，不吞箱
    const got = grantGoods(rid, r.count || 1, conn);
    // level 覆盖只用于核心（color-2 = 核心初始 Lv）；信仰有自身的等级表（FaithVO.lv = spec_data.level，
    // 一律从 Lv1 起），若沿用 color-2 会让紫箱开出 Lv2、金箱开出 Lv3 信仰，与描述"稀有度"不符。
    if (r.level && bagTypeOf(rid) !== 7) got.forEach(x => { x.level = r.level; });
    opened.push(...got);
    aggregatedItems[rid] = (aggregatedItems[rid] || 0) + (r.count || 1);
    used++;
  }

  if (used <= 0) {
    conn.sendToc('m_common_error_toc', { code: BAG_FULL_CODE });
    log(`[bag] 开箱 ${typeId} 被拒：圣器/核心/信仰背包已满（剩余 0 格）`);
    return true; // 已回包，别再走通用分支
  }

  g.cur_num = Number(g.cur_num) - used;
  const delBox = g.cur_num <= 0;
  if (delBox) S.bagGoods = S.bagGoods.filter(x => x !== g);
  pushGoodsUpdate(conn, [g], delBox ? 2 : 3);

  // 资产与体力变更推送
  if (totalVit > 0) pushVit(conn);
  if (totalSilver > 0 || totalGold > 0) pushAssetChange(conn);

  // 产出**数据包**（type=3）：grantGoods 只进服务端存档，客户端 BagMgr 全靠推送同步——
  // 缺这条则背包/核心选择列表里永远没有刚开出的圣器/核心。
  if (opened.length) pushGoodsUpdate(conn, opened, 3);

  // 奖励弹窗载体：客户端 m_goods_update_toc 仅 type=1(GOODS_OP_NEW) 才 openGetItemsPanel
  // （UPDATE 分支只改背包数据），不弹窗"开箱"看起来就像没反应。先落数据再补 type=1 弹窗。
  const popupGoods = [];
  if (totalGold > 0) popupGoods.push({ id: 0, type_id: V.ITEM_GOLD, cur_num: totalGold, bag_type: 1 });
  if (totalSilver > 0) popupGoods.push({ id: 0, type_id: V.ITEM_SILVER, cur_num: totalSilver, bag_type: 1 });
  if (totalVit > 0) popupGoods.push({ id: 0, type_id: V.ITEM_VIT, cur_num: totalVit, bag_type: 1 });
  for (const [tid, cnt] of Object.entries(aggregatedItems)) {
    const numId = Number(tid);
    const found = opened.find(x => x.type_id === numId);
    popupGoods.push({
      id: found ? found.id : 0,
      type_id: numId,
      cur_num: cnt,
      bag_type: bagTypeOf(numId),
    });
  }
  if (popupGoods.length) pushGoodsUpdate(conn, popupGoods, 1);

  saveState();
  conn.sendToc('m_item_use_toc', {
    gid: g.id, rest: delBox ? 0 : g.cur_num, usenum: used,
    type_id: typeId, op_type: 0,
  });

  const goodsDesc = opened.map(x => `${BD.nameOf(x.type_id)}${x.level > 1 ? `(Lv${x.level})` : ''}`);
  if (servants.length) servants.forEach(n => goodsDesc.push(`誓灵·${n}`));
  if (totalGold) goodsDesc.push(`水晶+${totalGold}`);
  if (totalSilver) goodsDesc.push(`金币+${totalSilver}`);
  if (totalVit) goodsDesc.push(`体力+${totalVit}`);
  log(`[bag] 开箱 ${typeId}×${used}：获得 ${goodsDesc.join(' ') || '(无)'}`
    + (guideFixed ? '（引导期固定生命核心）' : ''));
  return true;
}

// ---- 「神秘的礼物 Lv1/Lv2」开箱（28000024 / 28000025）----
// CfgItems.data 为空（官方由服务端随机），客户端描述「可随机获得一种蓝色/紫色礼物」。
// 此前既没有产出表、又被旧背包分页（28 前缀一刀切）塞进隐藏礼物包 → 既开不出东西，
// 又会让协会/宿舍送礼面板排序时 pairs(nil) 崩（2026-10-19 苏芸曦真机 5 次）。
// 分页已按白名单修正（lib.bagTypeOf），这里补上产出，避免变成"能在材料页看见但点了没反应"。
// 产出池 = CfgGift.preference 里同色那 11 件（28002xxx 蓝 / 28001xxx 紫）；
// 不含两件万能盒（28000000/28000001）——它们自带"命中任何心愿"语义，不该从随机礼物里出。
const MYSTERY_GIFT_BASE = { 28000024: 28002000, 28000025: 28001000 }; // 目标颜色档位起始 id（各 11 连号）
const MYSTERY_GIFT_SPAN = 11;
function openMysteryGift(conn, g, want) {
  const typeId = Number(g.type_id);
  const base = MYSTERY_GIFT_BASE[typeId];
  if (!base) return false;
  const maxUse = V.ITEM_MAX_USE[typeId] || 10; // 真机 bc maxUse=0 → ITEM_MAX_USE=0 falsy → 单次上限回退 10
  const times = Math.min(want, Number(g.cur_num) || 0, maxUse);
  if (times <= 0) return false;

  const agg = {}; // { typeId: 数量 }
  for (let i = 0; i < times; i++) {
    const pick = base + Math.floor(Math.random() * MYSTERY_GIFT_SPAN);
    agg[pick] = (agg[pick] || 0) + 1;
  }

  g.cur_num = Number(g.cur_num) - times;
  const del = g.cur_num <= 0;
  if (del) S.bagGoods = S.bagGoods.filter(x => x !== g);
  pushGoodsUpdate(conn, [g], del ? 2 : 3); // DEL 也要带 goods(id) 供客户端 delGoods

  const opened = [];
  for (const [tid, num] of Object.entries(agg)) opened.push(...grantGoods(Number(tid), Number(num), conn));
  // 产出数据包（type=3）：客户端 BagMgr 全靠推送同步，缺这条背包里看不到开出的礼物
  if (opened.length) pushGoodsUpdate(conn, opened, 3);
  // 弹窗载体（type=1 = GOODS_OP_NEW，客户端只有这个分支会 openGetItemsPanel）
  pushGoodsUpdate(conn, Object.entries(agg).map(([tid, num]) => {
    const f = opened.find(x => Number(x.type_id) === Number(tid));
    return { id: f ? f.id : 0, type_id: Number(tid), cur_num: Number(num), bag_type: bagTypeOf(Number(tid)) };
  }), 1);

  saveState();
  conn.sendToc('m_item_use_toc', {
    gid: g.id, rest: del ? 0 : g.cur_num, usenum: times, type_id: typeId, op_type: 0,
  });
  log(`[bag] 开礼物盒 ${typeId}×${times}：`
    + Object.entries(agg).map(([t, n]) => `${t}×${n}`).join(' '));
  return true;
}

// GM 面板「背包」页「提升背包/誓灵格子上限500」的语义适配（二百三十）。
// 官方按钮发 m21_goods=50000000=100=50000001=100=50000002=100——三个扩容道具各 100 个；
// 但 CfgItems 里三者 link=0，客户端 BaseItemVO.canUse=link~=0 ⇒ 「使用」按钮永不出现，
// 道具发出来就是死物（role.js 按精确签名截胡到本函数，不再发道具）。
// 语义：材料/圣器/核心背包与誓灵小屋各 +500（对应 100 个 × 每个 +5），复用官方扩容回执实时刷新。
// 存的是 base（bagSizeOf 的星图活加成不吸收），推送/回执报有效值。
function applyPanelExpand500(conn) {
  const STEP = 500;
  const baseRaw = pg => (Number(S.bagSizes[pg]) > 0 ? Number(S.bagSizes[pg]) : 60);
  for (const pg of [1, 2, 4]) S.bagSizes[pg] = baseRaw(pg) + STEP;
  S.servantBagSize = (typeof S.servantBagSize === 'number' && S.servantBagSize > 0 ? S.servantBagSize : 100) + STEP;
  saveState();
  conn.sendToc('m_extend_bag_toc', { bag_type: 1, content: bagSizeOf(1) });
  conn.sendToc('m_extend_bag_toc', { bag_type: 2, content: bagSizeOf(2) });
  conn.sendToc('m_extend_bag_toc', { bag_type: 4, content: bagSizeOf(4) });
  conn.sendToc('m_servant_list_extend_toc', { size: S.servantBagSize });
  log(`[GM] 面板扩容500：材料→${bagSizeOf(1)} 圣器/核心→${bagSizeOf(2)} 誓灵小屋→${S.servantBagSize}`);
  return `材料/圣器/核心背包与誓灵小屋上限各 +500`
    + `（材料 → ${bagSizeOf(1)}，圣器/核心 → ${bagSizeOf(2)}，小屋 → ${S.servantBagSize}）`;
}

module.exports = {
  handlers: {
// 买体力（顶栏点体力按钮 → 确认花水晶）：每次 +400，每日 15 次，价格按今日已买次数取
// 注意 m_vit_buy_toc 客户端只弹 Tips 不更新数值 → 必须补推 m_vit_update_toc
m_vit_buy_tos(conn) {
  checkVitReset(conn);
  const st = vs();
  const times = st.buyTime || 0;
  if (times >= V.VIT_BUY.maxTimes) {
    log(`[vit] 买体力次数已用尽 ${times}/${V.VIT_BUY.maxTimes}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  const cost = V.VIT_BUY.cost[times];
  if (S.roleAsset.gold + S.roleAsset.gold_given < cost) {
    log(`[vit] 买体力失败：水晶不足（需 ${cost}）`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  let rest = cost;
  const useGiven = Math.min(S.roleAsset.gold_given, rest);
  S.roleAsset.gold_given -= useGiven; rest -= useGiven;
  S.roleAsset.gold -= rest;
  st.buyTime = times + 1;
  setVit(getVit() + V.VIT_BUY.add);
  saveState();
  pushAssetChange(conn);
  conn.sendToc('m_vit_buy_toc', { vit: getVit(), buy_time: st.buyTime });
  pushVit(conn);
  log(`[vit] 买体力 +${V.VIT_BUY.add}（第 ${st.buyTime} 次，水晶 -${cost}）→ ${getVit()}`);
},
// 使用道具：按 CfgItems.data 发放（体力宝箱/金币袋等），扣包内数量；遗物箱走 openRelicBox
m_item_use_tos(conn, obj) {
  const gid = Number(obj && obj.gid);
  const g = S.bagGoods.find(x => Number(x.id) === gid);
  const want = Math.max(1, Number(obj && obj.usenum) || 1);
  if (!g) { log(`[bag] 使用道具失败：gid=${gid} 不在背包`); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  // 方舟指令卡道具（21905xxx 卡包 / 700000xx 单卡）：CfgItems.data 也是空的，
  // 但产出是**指令卡收藏**而不是背包道具 ⇒ 由 ark 侧按生成表发卡
  // （不实现就是"点了没反应"，玩家反馈「方舟研究后背包出现几个中阶指令，无法使用」）。
  // ⚠️ 必须排在 isBox 之前：历史上 relic_box_data 误把 21905000 当成 multi 箱
  //   （给 核心晶组Lv1×5 + 金币2000），会把卡包当遗物箱开掉。
  if (require('./ark').useCardItem(conn, g, want, Number(obj && obj.op_type) || 0)) return;
  // 遗物箱优先（21007001~08 / 21104000 的 CfgItems.data 只写了"小概率原初"那一项，
  // 直接走通用产出会变成必定给原初，与箱子描述不符 → 一律交给开箱表）
  if (BD.isBox(Number(g.type_id))) {
    if (openRelicBox(conn, g, want)) return;
  }
  // 神秘的礼物 Lv1/Lv2（CfgItems.data 为空，随机产出同色礼物）
  if (openMysteryGift(conn, g, want)) return;
  const rewards = V.ITEM_USE[Number(g.type_id)];
  const maxUse = V.ITEM_MAX_USE[Number(g.type_id)] || 99;
  const times = Math.min(want, Number(g.cur_num) || 0, maxUse);
  if (!rewards || times <= 0) {
    log(`[bag] 道具 ${g.type_id} 无使用产出（CfgItems.data 为空），不消耗`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  g.cur_num = Number(g.cur_num) - times;
  const del = g.cur_num <= 0;
  if (del) S.bagGoods = S.bagGoods.filter(x => x !== g);
  const res = grantItemRewards(conn, rewards, times);
  pushGoodsUpdate(conn, [g], del ? 2 : 3);   // DEL 也要带 goods(id) 供客户端 delGoods
  conn.sendToc('m_item_use_toc', {
    gid, rest: del ? 0 : g.cur_num, usenum: times,
    type_id: Number(g.type_id), op_type: Number(obj && obj.op_type) || 0,
  });
  log(`[bag] 使用道具 ${g.type_id}×${times}：体力+${res.vitAdd} 金币+${res.silverAdd} 水晶+${res.goldAdd} 物品${res.changed.length}项`
    + (Object.keys(res.scoreAdd).length ? ` 积分${Object.entries(res.scoreAdd).map(([k, v]) => `${k}+${v}`).join(',')}` : ''));
},
// 研究所产出领取（bd 1 体力 / bd 2 金币）：按上次领取时间累计，封顶储存上限
m_building_reward_tos(conn, obj) {
  const bdId = Number(obj && obj.bd_id) || 0;
  const p = studyPending(bdId);
  if (!p) { conn.sendToc('m_building_reward_toc', { bd_id: bdId, rewards: [] }); return; }
  if (p.num <= 0) {
    conn.sendToc('m_building_reward_toc', { bd_id: bdId, rewards: [] });
    pushStudyNotify(conn, bdId);
    return;
  }
  vs().studyAt[bdId] = now();
  if (p.cfg.item === V.ITEM_VIT) setVit(getVit() + p.num);
  else if (p.cfg.item === V.ITEM_SILVER) S.roleAsset.silver += p.num;
  saveState();
  conn.sendToc('m_building_reward_toc', { bd_id: bdId, rewards: [{ type: p.cfg.item, num: p.num }] });
  if (p.cfg.item === V.ITEM_VIT) pushVit(conn); else pushAssetChange(conn);
  pushStudyNotify(conn, bdId); // 领完气泡清空
  log(`[vit] 领取${p.cfg.name}产出 ${p.num}（${p.cfg.perHour}/时，上限 ${p.cfg.maxStore}，累计 ${Math.floor(p.elapsed / 60)} 分钟）`);
},
  },
  onLogin, getVit, setVit, addVit, pushVit, pushLimit, pushStudyNotify,
  sortieCost, spendSortieVit, checkVitReset, studyPending, grantItemRewards, grantServant, applyPanelExpand500,
};
