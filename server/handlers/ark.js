// 天空方舟（Ark）：主页-协会-Banner05 入口，通关 3-2（1030200）后功能 21 解锁。
//
// 客户端机制（tools/bc_cmp/ark_new/ 反编译实证，详见工作日志 2026-08-23（十二））：
//  - 主面板 onOpen → m_tech_tree_info_tos + m_ark_info_tos(curMapId) + m_ark_card_list_tos
//    （还会 m_role_subscribe_tos 订阅科研/资源点推送——通用 handler 回 toc 即可）；
//  - 三货币走 role_scores：2138 科研点 / 2139 火种 / 2140 燃料（GlobalData.getScore 显示）；
//    燃料上限/时产走 m_ark_fuel_detail_toc{ceil,velocity}（服务端主动推）；
//  - 探索队：m_ark_team_info_toc{teams:p_kvl[], vol}（服务端主动推，teamID=属性 1-6，
//    list=誓灵 id；总容量 vol 跨全部队）；选人面板只允许本属性或虚（nature 8）誓灵；
//  - 科研（m_tech_tree_*）：121 条 CfgArk.scienceInfo（已提取 ark_data.js），效果按官方文案
//    归类（燃产/燃储/编队容量/扫描器/队列上限/火种/超物质/遗物箱/指令卡解锁）；
//    材料与奖励里的 30000000水晶/30000003金币/30000002体力/6000013[89]/60000140 直接映射资产；
//  - 地图事件（m_ark_info_toc.event: p_ark_event[]）：type2 资源点（spec p_ark_resource，按小时
//    累积 can_gain）、type3 指令战（spec p_ark_copy：tier/batch 敌方编制，mop=可扫荡）、
//    type4 宝藏（spec p_ark_reward）。**事件 oid = serial*1000 + 显示id**——客户端
//    ArkMapEventVO.fillData 用 Util.indexNum(id,1,3) 取末 3 位当显示 id（CfgArk.mapEventInfo 查名）；
//    spec_data 声明 array binary，实际按嵌套 tuple+alias 解码（etf.js __nestedProto）；
//  - 跃迁（m_ark_go_tos）：扣 10000 燃料、地图+1、事件全刷新（旧事件不可再访问）；
//  - 指令战（m_war_*）：m_copy_war_tos{copy_id} 建 war → m_war_enter_war_tos 拉
//    m_war_round_info_toc（batch/batch_num/war_servants/self_cards）→ 出指令卡
//    （m_war_use_card/drop）→ m_war_start_round_tos → m_war_round_process_toc
//    （pk_list：effect_list[1]=左方/[2]=右方 {id=克制标记, val=剩余战力, type=伤害}，
//    final_power<=0 进 fall_list）→ 敌全灭进下一 batch（客户端自动再 enter_war）→
//    最后一波胜利推 m_war_fight_result_show_toc{result,item_reward}（结算面板）。
//    清完当前 tier 推进 p_ark_copy.now；通关 L+1 级事件解锁低级事件扫荡（mop=1）。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log, getScore, addScore, pushScoreChange, grantGoods, pushGoodsUpdate } = L;
const A = require('../data/ark_data');

const now = () => Math.floor(Date.now() / 1000);
const rnd = n => Math.floor(Math.random() * n);
const NATURE_VOID = 8;
// natureRelate（倍率制）：水1克火2 / 火克风3 / 风克土4 / 土克水 / 光5↔暗6 互克；
// 7("无")与一切无关；8(虚无)↔四元素互克、↔光暗互抵抗、8 对 8 无关（与 fight_core.natureRelate 同口径）
function natureRelate(a, d) {
  a = Number(a); d = Number(d);
  if (!a || !d) return 1;
  if (a === 7 || d === 7) return 1;
  if (a === 8 || d === 8) {
    if (a === d) return 1;
    const other = a === 8 ? d : a;
    return (other >= 1 && other <= 4) ? 1.75 : 0.57;
  }
  const BEATS = { 1: 2, 2: 3, 3: 4, 4: 1, 5: 6, 6: 5 };
  if (BEATS[a] === d) return 1.75;       // 克制
  if (BEATS[d] === a) return 0.57;       // 被抵抗
  return 1;
}

// ---------- arkState ----------
function st() {
  if (!S.arkState) {
    S.arkState = {
      mapId: 1, nextEvent: 1, events: [],
      scienceDone: [10000],            // 科学核心一阶 time=0 无材料 → 初始即完成
      queue: [],
      cards: {},                       // 指令卡收藏 {cardTypeId: isNew}
      teams: {},                       // {属性1-6: [誓灵id]}
      autoOpt: { powerFirst: 0, isAuto: 0, natures: [] },
      war: null,
      fuelAt: now(),
      nextWarId: 10001, nextUnitId: 1, nextCardOid: 1,
    };
    S.roleAsset.scores[A.SCORE_SCIENCE] = A.BASE.SCIENCE_INIT;
    S.roleAsset.scores[A.SCORE_FUEL] = A.BASE.FUEL_INIT;
  }
  // 旧档迁移：进行中的 war 可能持旧口径 copyId（裸显示 id / 十四前的 9000000+serial），
  // 统一重 derive 成复合口径——否则续战时 copy_war_toc 回显旧值，客户端仍显示"不存在事件"
  const _war = S.arkState.war;
  if (_war && !_war.copyNormalized) {
    _war.copyNormalized = true;
    const _ev = S.arkState.events.find(e => e.oid === _war.eventOid);
    if (_ev) _war.copyId = copyIdOf(_ev);
  }
  return S.arkState;
}

// ---------- 科技效果推导 ----------
const doneSet = () => new Set(st().scienceDone);
function fuelCeil() {
  let v = A.BASE.FUEL_CEIL;
  for (const s of A.SCIENCES) if (s.fuelCeil && doneSet().has(s.id)) v += s.fuelCeil;
  return v;
}
function fuelVel() {
  let v = A.BASE.FUEL_VEL;
  for (const s of A.SCIENCES) if (s.fuelVel && doneSet().has(s.id)) v += s.fuelVel;
  return v;
}
function teamCap() {
  let v = A.BASE.TEAM_CAP;
  for (const s of A.SCIENCES) if (s.teamCap && doneSet().has(s.id)) v += 1;
  return v;
}
function queueNum() {
  let v = A.BASE.QUEUE_NUM;
  for (const s of A.SCIENCES) if (s.queueCap && doneSet().has(s.id)) v += 1;
  return Math.min(v, 8); // ArkConst.SCIENCE_QUEUE_MAX
}
function scannerLv() {
  let v = 1;
  for (const s of A.SCIENCES) if (s.scanner && doneSet().has(s.id)) v = Math.max(v, s.scanner + 1);
  return v; // 可发现的最高事件等级
}
function pushFuelDetail(conn) {
  conn.sendToc('m_ark_fuel_detail_toc', { ceil: fuelCeil(), velocity: fuelVel() });
}

// ---------- 材料 / 奖励的资产映射 ----------
// CfgItems：30000000 水晶(gold) / 30000003 金币(silver) / 30000002 体力(score5) /
// 60000138 科研点 / 60000139 火种 / 60000140 燃料 —— 都不是背包物品，直接映射资产
function itemToAsset(typeId) {
  if (typeId === 30000000) return { kind: 'gold' };
  if (typeId === 30000003) return { kind: 'silver' };
  if (typeId === 30000002) return { kind: 'score', id: 5 };
  if (typeId === A.ITEM_SCIENCE) return { kind: 'score', id: A.SCORE_SCIENCE };
  if (typeId === A.ITEM_FIRE) return { kind: 'score', id: A.SCORE_FIRE };
  if (typeId === A.ITEM_FUEL) return { kind: 'score', id: A.SCORE_FUEL };
  return null;
}
function countOf(typeId) {
  const a = itemToAsset(typeId);
  if (!a) return S.bagGoods.filter(g => g.type_id === typeId).reduce((s, g) => s + Number(g.cur_num || 0), 0);
  if (a.kind === 'gold') return S.roleAsset.gold;
  if (a.kind === 'silver') return S.roleAsset.silver;
  return getScore(a.id);
}
// 扣材料/资产 —— **必须把变化推给客户端**（见 pushSpend）。扣完不推时客户端背包永远停在
// 扣之前，表现成"面板显示材料够了，点下去服务端说材料不足"，而且除了重登/打开对应背包页签
// 无法自愈。典型现场：方舟科研 24003/24004 静默吃掉 核心晶组Lv1×100 / 技能模组Lv1×100
// （正是界限突破 105→110 那一档的两种主料）→ 突破面板显示 100/80 可点、服务端回 221001。
// 详见 工作日志 二百六十九 / 调研-界限突破材料不足.md。
// 收集到 out（newSpendOut()），由调用方在**写完档之后**统一 pushSpend（先落盘再推送）。
function spend(typeId, num, out) {
  const a = itemToAsset(typeId);
  if (a) {
    if (a.kind === 'gold') S.roleAsset.gold = Math.max(0, S.roleAsset.gold - num);
    else if (a.kind === 'silver') S.roleAsset.silver = Math.max(0, S.roleAsset.silver - num);
    else S.roleAsset.scores[a.id] = Math.max(0, getScore(a.id) - num);
    if (out) out.assets.add(a.kind === 'score' ? `score:${a.id}` : a.kind);
    return true;
  }
  // 背包物品：按数量扣（跨多格）——扣空的格子推 DEL、部分扣的推 UPDATE
  let left = num;
  for (const g of S.bagGoods) {
    if (Number(g.type_id) !== Number(typeId) || left <= 0) continue;
    const take = Math.min(left, Number(g.cur_num || 0));
    if (take <= 0) continue;
    g.cur_num -= take; left -= take;
    if (out) (g.cur_num <= 0 ? out.removed : out.updated).push(g);
  }
  S.bagGoods = S.bagGoods.filter(g => Number(g.cur_num || 0) > 0);
  return left <= 0;
}
// spend 的收集器 + 统一推送（货币/积分/物品三类各推各的协议）
function newSpendOut() { return { updated: [], removed: [], assets: new Set() }; }
function pushSpend(conn, out) {
  if (!conn || !out) return;
  if (out.assets.has('gold') || out.assets.has('silver')) L.pushAssetChange(conn);
  for (const k of out.assets) {
    if (typeof k === 'string' && k.startsWith('score:')) pushScoreChange(conn, Number(k.slice(6)));
  }
  if (out.updated.length) pushGoodsUpdate(conn, out.updated, 3);
  if (out.removed.length) pushGoodsUpdate(conn, out.removed, 2);
}
// 发奖：资产类推 score/asset change，物品类入包；返回 p_reward[]（结算面板显示用）
function grantReward(conn, typeId, num) {
  const a = itemToAsset(typeId);
  if (a) {
    if (a.kind === 'gold') { S.roleAsset.gold += num; L.pushAssetChange(conn); }
    else if (a.kind === 'silver') { S.roleAsset.silver += num; L.pushAssetChange(conn); }
    else addScore(conn, a.id, num);
  } else {
    // conn 必须透传：奖励里的誓灵代币（54004 特殊召唤：加塔诺托亚=32642009、74000 记录·七=31141007）
    // 走 grantGoods 代币分支时靠它 3s 后宣告 m_servant_update_toc；称号盒（104001 天空纪念碑
    // 25001092/25001292）靠它同步推 m_role_title_update_toc。漏传 = 静默入档，玩家"研究完成后
    // 不给"（重登全量 brief 才补见）。详见 工作日志 二百七十七 / smoke_ark_token_announce.js。
    const changed = grantGoods(typeId, num, conn);
    if (changed.length) pushGoodsUpdate(conn, changed, 3);
  }
  return { type: typeId, num };
}

// ---------- 燃料 / 资源点的懒结算 ----------
function tickFuel(conn) {
  const s = st();
  const elapsed = Math.max(0, now() - (s.fuelAt || now()));
  const gain = Math.floor(fuelVel() * elapsed / 3600);
  if (gain > 0) {
    const cur = getScore(A.SCORE_FUEL);
    if (cur < fuelCeil()) {
      addScore(conn, A.SCORE_FUEL, Math.min(gain, fuelCeil() - cur));
      log(`[ark] 燃料自然恢复 +${Math.min(gain, fuelCeil() - cur)}`);
    }
    s.fuelAt = now(); saveState();
  }
}
function tickResEvent(ev) {
  if (ev.type !== 2) return;
  const elapsed = Math.max(0, now() - (ev.lastTick || now()));
  const room = ev.limit - ev.gain - ev.canGain;
  if (room > 0 && elapsed > 0) {
    ev.canGain += Math.min(room, Math.floor(ev.speed * elapsed / 3600));
    ev.lastTick = now();
  }
}
function tickAllRes() { for (const ev of st().events) tickResEvent(ev); }

// ---------- 地图 / 事件生成 ----------
function tierRewards(level, tier) {
  if (tier >= 3) return level >= 3 ? [A.ITEM_SCIENCE, A.ITEM_MATTER] : [A.ITEM_SCIENCE, 30000000];
  if (tier === 2) return [A.ITEM_SCIENCE, 30000003];
  return [A.ITEM_SCIENCE];
}
function genEvent(type, displayId, extra) {
  const s = st();
  const ev = { oid: s.nextEvent * 1000 + displayId, type, displayId, ...extra };
  s.nextEvent++;
  return ev;
}
function ensureMap(conn) {
  const s = st();
  // 客户端 ArkCommandEventItem 的 4 个固定槽位（uv0[Index+1]）——事件必须恰好 4 个，
  // 第 5 个 setAnchorPosition(nil) 会叠到画布原点（贴在背景云层上）。旧档 5 事件地图重新生成。
  if (s.events.length === 4) { tickAllRes(); return; }
  const maxLv = scannerLv();
  const events = [];
  // 1 个指令战事件：当前扫描等级（mapEventInfo[3] 显示 id 只有 2-9=敌对区域Lv1-8，钳 9）
  const lv = maxLv;
  events.push(genEvent(3, Math.min(lv + 1, 9), {
    level: lv, copyId: 0, now: 1, mop: 0, done: false, tierCount: 3,
    tierReward: [tierRewards(lv, 1), tierRewards(lv, 2), tierRewards(lv, 3)],
  }));
  // 2 个资源点（31-36 随机两个不同）
  const resIds = [31, 32, 33, 34, 35, 36].sort(() => Math.random() - 0.5).slice(0, 2);
  for (const rid of resIds) {
    const [speed, limit] = A.RES_PROFILE[rid];
    events.push(genEvent(2, rid, {
      speed, limit, gain: 0, canGain: 0, lastTick: now(), baseReward: A.ITEM_SCIENCE,
      reward: [A.ITEM_SCIENCE, 30000003],
    }));
  }
  // 1 个宝藏（领取后客户端 dealWithMapReward 会把它从列表移除，飞行拦截随之解除）
  const tid = 61 + rnd(5);
  events.push(genEvent(4, tid, { state: 0, rewards: A.TREASURE_POOLS[tid] || [30000000] }));
  s.war = null; // 旧图战斗进度随地图重置
  s.events = events;
  saveState();
  log(`[ark] 生成地图 M${s.mapId}：${events.map(e => `#${e.oid}(t${e.type})`).join(' ')}`);
}

// p_ark_event 载荷（spec_data 按 spec_type 选 proto，走 etf __nestedProto）
function eventPayload(ev) {
  const base = { id: ev.oid, type: ev.type, refresh: 0, spec_type: '', spec_data: {} };
  if (ev.type === 2) {
    base.spec_type = 'p_ark_resource';
    base.spec_data = {
      __nestedProto: 'p_ark_resource',
      base_reward: ev.baseReward, speed: ev.speed, gain: ev.gain,
      can_gain: ev.canGain, limit: ev.limit, state: ev.gain >= ev.limit ? 1 : 0, reward: ev.reward,
    };
  } else if (ev.type === 3) {
    const tiers = [];
    for (let t = 1; t <= ev.tierCount; t++) {
      const batches = [];
      for (let b = 1; b <= A.enemyBatchCount(t); b++) {
        batches.push({ batch_id: b, military: evUnitPowerSum(ev.level, t), strategy: b === A.enemyBatchCount(t) ? 4 : 1 + rnd(3), prop: 1 + rnd(6), state: t < ev.now ? 1 : 0 });
      }
      tiers.push({ tier_id: t, prop: 1 + rnd(6), state: t < ev.now ? 3 : (t === ev.now ? 2 : 1), reward: ev.tierReward[t - 1], batch: batches });
    }
    base.spec_type = 'p_ark_copy';
    base.spec_data = { __nestedProto: 'p_ark_copy', copy_id: copyIdOf(ev), tier: tiers, mop: ev.mop, now: ev.now };
  } else if (ev.type === 4) {
    base.spec_type = 'p_ark_reward';
    base.spec_data = { __nestedProto: 'p_ark_reward', state: ev.state, reward: ev.rewards };
  }
  return base;
}
function evUnitPowerSum(level, tier) {
  return A.enemyUnitPower(level, tier) * A.enemyUnitCount(level);
}
// copy_id 官方口径（bc 实证 ArkMgr.getEventCopyName）：客户端用
// Util.indexNum(curFightId, 6, 8) —— 从右数第 6~8 位（= floor(id/1e5)%1000）——查
// CfgArk.mapEventInfo 取名，查不到显示"不存在事件:<id>"。（十四）直接发裸显示 id
// （2-9 的小数字）取位恒为 0，必然显示"不存在事件:0/1/2"。
// 复合 id = 显示id×100000 + oid末5位：显示 id 落在十万位上（取位可解），
// 低位带事件 oid 保证唯一。eventByCopy 双口径兼容旧档（旧 war/客户端可能还持裸显示 id）。
function copyIdOf(ev) { return ev.displayId * 100000 + (ev.oid % 100000); }
function eventByCopy(copyId) {
  return st().events.find(e => e.type === 3 && copyIdOf(e) === copyId)
      || st().events.find(e => e.type === 3 && e.displayId === copyId);
}
function eventByOid(oid) { return st().events.find(e => e.oid === oid); }

// ---------- 探索队 ----------
function teamPayload() {
  const s = st();
  const teams = [];
  for (let n = 1; n <= 6; n++) {
    const list = (s.teams[n] || []).filter(id => S.servants.some(b => b.id === id));
    teams.push({ id: n, list });
  }
  return teams;
}
function pushTeamInfo(conn) {
  conn.sendToc('m_ark_team_info_toc', { teams: teamPayload(), vol: teamCap() });
  log(`[ark] 推送探索队 vol=${teamCap()} 共${teamPayload().reduce((s2, t) => s2 + t.list.length, 0)}人`);
}
// 兜底：从未编队时按战力自动填充（按属性分队，虚属性并入容量允许的队）
function autoFillTeams() {
  const s = st();
  const cap = teamCap();
  const total = Object.values(s.teams).reduce((sum, l) => sum + l.length, 0);
  if (total > 0) return;
  const byNature = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  const ranked = S.servants.slice().sort((a, b) => A.servantPower(b) - A.servantPower(a));
  for (const b of ranked) {
    if (total + 1 > cap) break;
    const n = Math.floor(b.type / 1000) % 10;
    if (n >= 1 && n <= 6) { byNature[n].push(b.id); }
  }
  // 按战力从高到低逐只入队（不超容量）
  const flat = ranked.slice(0, cap);
  s.teams = {};
  for (const b of flat) {
    const n = Math.floor(b.type / 1000) % 10;
    const team = (n >= 1 && n <= 6) ? n : 1;
    (s.teams[team] = s.teams[team] || []).push(b.id);
  }
  saveState();
  log(`[ark] 探索队自动编成 ${flat.length}/${cap} 人`);
}

// ---------- 指令卡道具（背包 → 收藏） ----------
// 背景：科研"指令卡解锁"节点的奖励是**道具**（21905xxx 卡包 / 700000xx 单卡），
// 而 `m_tech_tree_finish_toc.items` 只有 p_reward{type,num}，**没有卡 id 通道** ⇒ 卡只能由
// 「背包 → 使用」开出来。这些道具的 `CfgItems.data` 全为空 ⇒ `vit.m_item_use_tos` 的通用产出表
// （V.ITEM_USE）里没有它们，不实现就是"点了没反应"的死道具（玩家反馈：中阶指令无法使用）。
// 内容表见 `data/ark_card_item_data.js`（生成物），完整取证见 调研-中阶指令无法使用.md。
function pushCardList(conn) {
  const s = st();
  conn.sendToc('m_ark_card_list_toc', {
    list: Object.entries(s.cards).map(([id, isNew]) => ({ id: Number(id), val: isNew ? 1 : 0 })),
  });
}

// 内部：扣道具 + 发卡，**只改内存不推送**（调用方负责 saveState / push）。
// 返回 { times, cards, fresh }；不是指令卡道具时返回 null。
function applyCardItem(g, want) {
  const AKD = require('../data/ark_card_item_data');
  const tid = Number(g && g.type_id);
  if (!AKD.isCardItem(tid)) return null;
  const s = st();
  const times = Math.max(0, Math.min(Number(want) || 1, Number(g.cur_num) || 0, AKD.maxUseOf(tid)));
  const cards = [];
  for (let i = 0; i < times; i++) for (const cid of AKD.cardsOfItem(tid)) if (A.CARDS[cid]) cards.push(cid);
  const fresh = [];
  for (const cid of cards) if (s.cards[cid] === undefined) { s.cards[cid] = 1; fresh.push(cid); } // 只对新卡打 NEW
  if (times > 0) {
    g.cur_num = Number(g.cur_num) - times;
    if (g.cur_num <= 0) S.bagGoods = S.bagGoods.filter(x => x !== g);
  }
  return { times, cards, fresh, rest: Number(g.cur_num) || 0 };
}

// 使用 1 次（vit.js m_item_use_tos 的专项分支）。返回 false = 不是指令卡道具，调用方走通用产出表。
// 顺序：扣 → saveState → pushGoods → 推卡表 → 回执（先落盘后推送，工作指南 D22 口径）
function useCardItem(conn, g, want, opType) {
  const r = applyCardItem(g, want);
  if (!r) return false;
  saveState();
  if (r.times > 0) pushGoodsUpdate(conn, [g], r.rest > 0 ? 3 : 2);
  pushCardList(conn);
  conn.sendToc('m_item_use_toc', {
    gid: Number(g.id), rest: r.rest, usenum: r.times,
    type_id: Number(g.type_id), op_type: Number(opType) || 0,
  });
  log(`[ark] 使用指令卡道具 ${g.type_id}×${r.times} → 得卡 ${[...new Set(r.cards)].join(',') || '（无）'}`
    + `（新 ${r.fresh.length} 张，收藏 ${Object.keys(st().cards).length} 张）`);
  return true;
}

// 批量开包（不推 m_item_use_toc）。uselessOnly=true 时只开"开出来全是已拥有卡"的包 ——
// 用于登录自愈：旧实现把卡直发进收藏、包还留在背包，玩家开它只会得到"什么都没发生"。
function openCardItems(conn, uselessOnly) {
  const AKD = require('../data/ark_card_item_data');
  const s = st();
  const owned = new Set(Object.keys(s.cards).filter(id => A.CARDS[id]).map(Number));
  const touched = [];
  let total = 0, freshTotal = 0;
  for (const g of S.bagGoods.slice()) {
    if (!AKD.isCardItem(g.type_id)) continue;
    if (uselessOnly && !AKD.potentialCards(g.type_id).every(c => owned.has(c))) continue;
    for (let i = 0; i < 20 && Number(g.cur_num) > 0; i++) {
      const r = applyCardItem(g, Number(g.cur_num));
      if (!r || r.times <= 0) break;
      total += r.times; freshTotal += r.fresh.length;
      for (const cid of r.cards) owned.add(cid);
      if (!touched.includes(g)) touched.push(g);
    }
  }
  if (!total) return 0;
  saveState();
  for (const g of touched) pushGoodsUpdate(conn, [g], (Number(g.cur_num) || 0) > 0 ? 3 : 2);
  pushCardList(conn);
  log(`[ark] 批量使用指令卡道具 ${total} 个（新卡 ${freshTotal} 张，收藏 ${Object.keys(s.cards).length} 张）`
    + (uselessOnly ? ' —— 登录自愈：卡已在收藏、包留着也开不出东西' : ''));
  return total;
}

// 死角兜底：卡只能开包获得，若玩家一个包都没开就进指令战/看卡表，手牌恒 0（战斗必然打不动）。
// 只在"收藏为空 + 背包确有卡道具"时触发，且只消耗玩家自己的包 ⇒ 不会与开包通道重复。
function ensureSomeCards(conn) {
  const s = st();
  if (Object.keys(s.cards).some(id => A.CARDS[id])) return 0;
  const AKD = require('../data/ark_card_item_data');
  if (!S.bagGoods.some(g => AKD.isCardItem(g.type_id))) return 0;
  const n = openCardItems(conn, false);
  if (n) log('[ark] 收藏为 0 → 已自动开掉背包里的指令卡道具（兜底）');
  return n;
}

// ---------- 科研 ----------
function scienceById(id) { return A.SCIENCES.find(s => s.id === id); }
function scienceState(id) {
  const s = st(), done = doneSet();
  const sci = scienceById(id);
  if (!sci) return null;
  if (done.has(id)) return 'ALREADY';
  if (s.queue.some(q => q.id === id)) return 'DOING';
  if (sci.lock.some(l => !done.has(l))) return 'LOCK';
  // NOT_SHOW（主干未达阶的分支折叠）是纯客户端显示态——服务端校验只认锁链+材料，
  // 正常流程客户端根本不会把折叠项发上来
  if (!sci.mats.every(([iid, num]) => countOf(iid) >= num)) return 'NOT_MATERIAL';
  return 'CAN';
}
function pushScienceInfo(conn) {
  const s = st();
  conn.sendToc('m_tech_tree_info_toc', {
    id: s.scienceDone.slice(), queue: s.queue.map(q => ({ id: q.id, end_time: q.end_time })),
    queue_num: queueNum(),
  });
}
// 完成发放：效果进 done 集由推导承担；这里只发"实物"
function grantScience(conn, sci) {
  const rewards = []; // p_reward[]
  // 指令卡解锁：**不再直塞收藏**。官方口径是发道具（21905xxx 卡包 / 700000xx 单卡），
  // 卡只能由「背包 → 使用」开出来（`m_tech_tree_finish_toc.items` 只有 p_reward，没有卡 id 通道）。
  // 旧实现 `A.CARD_GRANTS` 直发 + 同批道具入包 = 双发，包里那张永远打不开（玩家反馈"中阶指令无法使用"）。
  // 明细与 11 处旧实现错配见 调研-中阶指令无法使用.md §7.4 / data/ark_card_item_data.js。
  // rewardInfo 奖励按物品/资产发（含"特殊召唤"32642009——实测是 CfgItems 道具而非誓灵 typeId）。
  // 火种/超物质/箱子类"10次"变体：flag 倍率 × rewardInfo 单条目（官方 rewardInfo 只列 1 个）
  const mult = sci.fireSeed || sci.matter || sci.relicChest || sci.mysteryChest || 1;
  for (const t of (sci.rewards || [])) {
    rewards.push(grantReward(conn, t, mult));
  }
  return rewards;
}

// 研发完成核心。客户端没有"领取完成"按钮——DOING 提示只有"点队列旁[x]取消"，
// m_tech_tree_finish_tos 在客户端无任何 UI 调用方（bc 实证）——官方语义是
// **服务端到点自动完成**并推 m_tech_tree_finish_toc（客户端 handler 清队列槽 +
// setScienceList + 自动弹结算面板 ArkCommandScienceResultPanel）
function finishResearch(conn, q) {
  const s = st();
  const sci = scienceById(q.id);
  s.queue = s.queue.filter(x => x.id !== q.id);
  s.scienceDone.push(q.id);
  const rewards = grantScience(conn, sci);
  // 重复科技（type 3，"允许多次研发"）发完即移出 done——客户端面板回到"可研发"
  if (sci.type === 3) s.scienceDone = s.scienceDone.filter(x => x !== q.id);
  conn.sendToc('m_tech_tree_finish_toc', { id: q.id, items: rewards, replace_list: [] });
  log(`[ark] 研发完成 ${sci.id} ${sci.name}（自动结算）`);
  return sci;
}
// 到点自动结算：心跳钩子驱动（≈1s 时延，到点即弹结算），协议入口再懒结算兜底。
// 返回是否有条目完成（调用方决定是否补推 info）
function settleExpiredQueue(conn) {
  const s = st();
  if (!s.queue.length) return false;
  const expired = s.queue.filter(q => q.end_time <= now());
  if (!expired.length) return false;
  let fuelEff = false, teamEff = false;
  for (const q of expired) {
    const sci = finishResearch(conn, q);
    if (sci.fuelVel || sci.fuelCeil) fuelEff = true;
    if (sci.teamCap) teamEff = true;
  }
  saveState();
  if (fuelEff) pushFuelDetail(conn); // 燃产/燃储科技即时生效
  if (teamEff) pushTeamInfo(conn);
  pushScienceInfo(conn); // 队列/科技树全量重建（等价重进面板；finish_toc 只清单槽）
  return true;
}

// ---------- 指令战 ----------
function servantOf(id) { return S.servants.find(b => b.id === id); }
function mkUnit(side, type, nature, power, x, y, skin) {
  const s = st();
  const u = {
    oid: s.nextUnitId++, side, type, nature,
    orig: power, power, x, y, alive: true,
    skin: Number(skin) || 0, // 我方探索队成员的真实皮肤（0 = 敌方/量产型，unitWar 回落公式皮）
  };
  return u;
}
function unitWar(u, name) {
  // skin_id：客户端战斗 spine 形态唯一来源（9 位尾数 1-4 = 骨架内星级形态）；见 map_fight fightServantOf 注
  const skin = u.skin || u.type * 100 + 1;
  return {
    id: u.oid, type: u.type, name: name || '', skin_id: skin, nature: u.nature,
    attr: { power: u.power, max_power: Math.floor(u.orig * 1.5), orig_power: u.orig },
    brief_pos: (500 + u.x) * 1000 + 500 + u.y,
    states: [],
  };
}
function handPayload(war) {
  const s = st();
  const owned = Object.keys(s.cards).map(Number).filter(id => A.CARDS[id]);
  while (war.hand.length < A.BASE.HAND_SIZE && owned.length) {
    war.hand.push({ oid: s.nextCardOid++, type: owned[rnd(owned.length)] });
  }
  return war.hand.map(c => ({ id: c.oid, type: c.type, from_id: 0 }));
}
function startWar(conn, ev) {
  const s = st();
  ensureSomeCards(conn);   // 收藏为空 → 先开掉背包里的卡包，否则 handPayload 抽不出任何牌（只能干看着）
  autoFillTeams();
  const war = {
    warId: s.nextWarId++, copyId: copyIdOf(ev), eventOid: ev.oid, level: ev.level,
    tier: ev.now, batchNum: A.enemyBatchCount(ev.now), batch: 1, round: 0,
    units: [], hand: [], spawnedBatch: 0,
  };
  s.war = war;
  spawnBatch(war, ev);
  saveState();
  log(`[ark] 指令战 war=${war.warId} copy=${war.copyId} Lv${ev.level} tier${war.tier}/${ev.tierCount} batch×${war.batchNum} 我方${war.units.filter(u => u.side === 0).length} 敌方${war.units.filter(u => u.side === 1).length}`);
  return war;
}
function spawnBatch(war, ev) {
  const s = st();
  war.spawnedBatch = war.batch;
  war.units = [];
  // 我方：探索队全体（每波重置满战力；容量内）。**站位 x 必须为负**——客户端
  // enterFightServant 按 brief_pos 的 x 正负分左右阵营（官方调试代码 m_war_servant_war_tos
  // 实证：奇数位 x 取负），全发正坐标会全员站进右侧敌方阵容（真机事故）
  const mine = [];
  for (let n = 1; n <= 6; n++) for (const id of (s.teams[n] || [])) mine.push(id);
  mine.slice(0, teamCap()).forEach((id, i) => {
    const b = servantOf(id);
    if (!b) return;
    const nat = Math.floor(b.type / 1000) % 10;
    war.units.push(mkUnit(0, b.type, (nat >= 1 && nat <= 6) ? nat : 1, A.servantPower(b), -(1 + Math.floor(i / 6)), 1 + (i % 6), b.skin_id));
  });
  // 敌方：等级/层位编制（x 正 1-6）
  const lv = ev.level, tier = war.tier;
  const count = A.enemyUnitCount(lv);
  const baseP = A.enemyUnitPower(lv, tier);
  const elite = A.ELITE_POOLS[lv] || [];
  for (let i = 0; i < count; i++) {
    const useElite = elite.length && Math.random() < 0.4;
    const type = useElite ? elite[rnd(elite.length)] : A.GRUNT_TYPES[rnd(4)];
    const nat = useElite ? (Math.floor(type / 1000) % 10) : (1 + rnd(6)); // 量产型按约定手写属性
    const p = Math.max(10, Math.round(baseP * (0.85 + Math.random() * 0.3)));
    war.units.push(mkUnit(1, type, nat, p, 1 + Math.floor(i / 6), 1 + (i % 6)));
  }
  war.hand = [];
}
function aliveOf(war, side) { return war.units.filter(u => u.alive && u.side === side); }

function pushRoundInfo(conn) {
  const war = st().war;
  if (!war) return;
  const ev = eventByOid(war.eventOid);
  conn.sendToc('m_war_round_info_toc', {
    war_id: war.warId, war_round: war.round,
    war_servants: war.units.map(u => unitWar(u)),
    other_buffs: [], copy_id: war.copyId,
    batch: war.batch, batch_num: war.batchNum,
    opp_servant_num: aliveOf(war, 1).length, side: 1,
    self_cards: handPayload(war),
  });
  log(`[ark] round_info war=${war.warId} batch ${war.batch}/${war.batchNum} 手牌${war.hand.length}`);
}

// 一回合结算：按行对撞（双方每行最前排），克制加成，同时交换伤害
function processRound(conn) {
  const s = st();
  const war = s.war;
  war.round++;
  const pkList = [];
  const fall = [];
  const pairs = [];
  const byRow = side => {
    const m = {};
    for (const u of aliveOf(war, side)) (m[u.y] = m[u.y] || []).push(u);
    return m;
  };
  const rowsL = byRow(0), rowsR = byRow(1);
  const rows = new Set([...Object.keys(rowsL), ...Object.keys(rowsR)].map(Number));
  for (const y of rows) {
    const Ls = (rowsL[y] || []).sort((a, b) => b.x - a.x); // 我方前排 = 大 x
    const Rs = (rowsR[y] || []).sort((a, b) => a.x - b.x); // 敌方前排 = 小 x
    if (Ls.length && Rs.length) pairs.push([Ls[0], Rs[0]]);
  }
  // 防呆：没有任何同行对撞时（错行对峙），按序号配对前 min(n) 只
  if (!pairs.length) {
    const Ls = aliveOf(war, 0), Rs = aliveOf(war, 1);
    for (let i = 0; i < Math.min(Ls.length, Rs.length); i++) pairs.push([Ls[i], Rs[i]]);
  }
  for (let i = 0; i < pairs.length; i++) {
    const [ul, ur] = pairs[i];
    const mulL = natureRelate(ul.nature, ur.nature);
    const mulR = natureRelate(ur.nature, ul.nature);
    const dmgToL = Math.max(1, Math.round(ur.power * mulR * (0.9 + Math.random() * 0.2)));
    const dmgToR = Math.max(1, Math.round(ul.power * mulL * (0.9 + Math.random() * 0.2)));
    ul.power = Math.max(0, ul.power - dmgToL);
    ur.power = Math.max(0, ur.power - dmgToR);
    if (ul.power <= 0) { ul.alive = false; fall.push(ul.oid); }
    if (ur.power <= 0) { ur.alive = false; fall.push(ur.oid); }
    pkList.push({
      index: i + 1, left_id: ul.oid, right_id: ur.oid, result: 0,
      effect_list: [
        { id: mulL > 1 ? 1 : 0, val: ul.power, type: dmgToL },
        { id: mulR > 1 ? 1 : 0, val: ur.power, type: dmgToR },
      ],
    });
  }
  const finals = aliveOf(war, 0).concat(aliveOf(war, 1)).map(u => ({
    id: u.oid, nature: u.nature,
    attr: { power: u.power, max_power: Math.floor(u.orig * 1.5), orig_power: u.orig },
    brief_pos: (500 + u.x) * 1000 + 500 + u.y, states: [],
  }));
  conn.sendToc('m_war_round_process_toc', {
    war_id: war.warId, war_round: war.round,
    pk_list: pkList, enter_list: [], fall_list: fall, final_list: finals,
    other_buffs: [], effect_list: [], opp_servant_num: aliveOf(war, 1).length,
    round_start: 1, self_cards: handPayload(war),
  });
  log(`[ark] round ${war.round}：${pairs.length} 组对撞，倒下 ${fall.length}`);

  // 胜负判定
  const mineAlive = aliveOf(war, 0).length, foeAlive = aliveOf(war, 1).length;
  if (foeAlive === 0) {
    if (war.batch < war.batchNum) {
      // result toc 必须带"刚打完的"波次号——客户端 onRoundEnd 用 curBatch < maxBatch 判断
      // 是否再发 enter_war 拉下一波；带新编号会让它以为打完了，直接跳过该波（真机事故实证）
      const cleared = war.batch;
      war.batch++;
      saveState();
      conn.sendToc('m_war_fight_result_toc', {
        war_id: war.warId, copy_id: war.copyId, batch: cleared, batch_num: war.batchNum,
      });
      log(`[ark] 战胜波次 ${cleared}/${war.batchNum}，待客户端 enter 拉第 ${war.batch} 波`);
    } else {
      winWar(conn, war);
    }
  } else if (mineAlive === 0 || war.round >= A.BASE.WAR_ROUND_MAX) {
    loseWar(conn, war);
  } else {
    saveState();
  }
}
function tierClearEffect(ev) {
  // 推进层；通关 L+1 级任意层 → 解锁全部更低级事件扫荡
  ev.now = Math.min(ev.tierCount + 1, ev.now + 1);
  if (ev.now > ev.tierCount) ev.done = true;
  for (const e of st().events) {
    if (e.type === 3 && e.level < ev.level) e.mop = 1;
  }
}
function winWar(conn, war) {
  const s = st();
  const ev = eventByOid(war.eventOid);
  const rewards = [];
  const sciGain = 30 * ev.level + 40 * war.tier;
  rewards.push(grantReward(conn, A.ITEM_SCIENCE, sciGain));
  // 通关层奖励池随机一件
  const pool = ev.tierReward[war.tier - 1] || [A.ITEM_SCIENCE];
  rewards.push(grantReward(conn, pool[rnd(pool.length)], 1));
  tierClearEffect(ev);
  conn.sendToc('m_war_fight_result_toc', {
    war_id: war.warId, copy_id: war.copyId, batch: war.batch, batch_num: war.batchNum,
  });
  conn.sendToc('m_war_fight_result_show_toc', {
    war_id: war.warId, copy_id: war.copyId, result: 1,
    item_reward: rewards, replace_list: [],
  });
  log(`[ark] 指令战胜利 war=${war.warId} 科研点+${sciGain} event now→${ev.now}`);
  s.war = null;
  saveState();
}
function loseWar(conn, war) {
  const s = st();
  conn.sendToc('m_war_fight_result_toc', {
    war_id: war.warId, copy_id: war.copyId, batch: war.batch, batch_num: war.batchNum,
  });
  conn.sendToc('m_war_fight_result_show_toc', {
    war_id: war.warId, copy_id: war.copyId, result: 0,
    item_reward: [], replace_list: [],
  });
  log(`[ark] 指令战战败 war=${war.warId}`);
  s.war = null;
  saveState();
}

// 指令卡效果（本地服简化：按家族生效于服务端数值，视觉走下回合同步）
function applyCard(war, cardType) {
  const fam = Math.floor(cardType / 1000);      // 1/2/3 = 一/二/三阶
  const own = aliveOf(war, 0);
  if (cardType === 1001 || cardType === 2001) {
    // 随机召唤：3 只量产型战力 10（我方 x 负）
    const s = st();
    for (let i = 0; i < 3; i++) {
      const spots = war.units.filter(u => u.side === 0).length;
      const u = mkUnit(0, A.GRUNT_TYPES[rnd(4)], 1 + rnd(6), 10, -(1 + Math.floor(spots / 6)), 1 + (spots % 6));
      war.units.push(u);
    }
    return true;
  }
  // 战力增益：一阶 +15% / 二阶 +25% / 三阶 +40%（上限 1.5×原生）
  const mult = 1 + (fam === 1 ? 0.15 : fam === 2 ? 0.25 : 0.40);
  for (const u of own) {
    const cap = Math.floor(u.orig * 1.5);
    u.power = Math.min(cap, Math.round(u.power * mult));
  }
  return true;
}

// ---------- handlers ----------
const handlers = {
  // —— 主面板三连请求 ——
  m_ark_info_tos(conn, obj) {
    const s = st();
    tickFuel(conn);
    ensureMap(conn);
    const war = s.war;
    conn.sendToc('m_ark_info_toc', {
      map_id: s.mapId,
      event: s.events.map(eventPayload),
      war: war ? war.warId : 0,
      war_event: war ? war.eventOid : 0,
    });
    // 资源点进度推送（面板倒计时依赖 refresh 字段，这里顺手刷新 can_gain）
    for (const ev of s.events) {
      if (ev.type === 2 && (ev.canGain > 0 || ev.gain < ev.limit)) {
        conn.sendToc('m_ark_resource_update_toc', {
          event_id: ev.oid, gain: ev.gain, can_gain: ev.canGain,
          next_refresh: now() + 3600,
        });
      }
    }
    log(`[ark] info map=${s.mapId} events=${s.events.length} war=${war ? war.warId : 0}`);
  },
  m_ark_go_tos(conn) {
    const s = st();
    tickFuel(conn);
    const fuel = getScore(A.SCORE_FUEL);
    if (fuel < A.BASE.FLY_COST) {
      conn.sendToc('m_common_error_toc', { code: 262006 });
      log('[ark] 跃迁燃料不足');
      return;
    }
    addScore(conn, A.SCORE_FUEL, -A.BASE.FLY_COST);
    s.mapId++;
    s.events = [];
    s.war = null; // 旧区域战斗作废
    ensureMap(conn);
    saveState();
    conn.sendToc('m_ark_go_toc', {});
    log(`[ark] 跃迁 → M${s.mapId}（燃料余 ${getScore(A.SCORE_FUEL)}）`);
  },
  m_ark_buy_fuel_tos(conn) {
    const s = st();
    const fire = getScore(A.SCORE_FIRE);
    if (fire <= 0) { conn.sendToc('m_common_error_toc', { code: 262006 }); return; }
    addScore(conn, A.SCORE_FIRE, -1);
    const add = Math.min(A.BASE.FIRE_PER_SEED, Math.max(0, fuelCeil() - getScore(A.SCORE_FUEL)));
    addScore(conn, A.SCORE_FUEL, add);
    saveState();
    conn.sendToc('m_ark_buy_fuel_toc', {});
    pushFuelDetail(conn);
    log(`[ark] 火种→燃料 +${add}`);
  },
  m_ark_get_reward_tos(conn, obj) {
    const s = st();
    const ev = eventByOid(obj.event_id);
    if (!ev) { conn.sendToc('m_ark_get_reward_toc', obj); return; }
    if (ev.type === 2) {
      tickResEvent(ev);
      const n = ev.canGain;
      if (n > 0) {
        grantReward(conn, ev.baseReward, n);
        ev.gain += n; ev.canGain = 0; ev.lastTick = now();
        saveState();
        log(`[ark] 资源点 #${ev.oid} 收集 ${n} 科研点（${ev.gain}/${ev.limit}）`);
      }
    } else if (ev.type === 4 && ev.state === 0) {
      ev.state = 1;
      for (const t of ev.rewards) grantReward(conn, t, 1);
      saveState();
      log(`[ark] 宝藏 #${ev.oid} 开启：${ev.rewards.join(',')}`);
    }
    conn.sendToc('m_ark_get_reward_toc', { map_id: obj.map_id, event_id: obj.event_id, nth: obj.nth || 0 });
  },
  m_ark_mop_up_tos(conn, obj) {
    const s = st();
    const ev = eventByOid(obj.event_id);
    if (!ev || ev.type !== 3 || !ev.mop || ev.done) { conn.sendToc('m_ark_mop_up_toc', obj); return; }
    if (s.war && s.war.copyId === copyIdOf(ev)) { conn.sendToc('m_ark_mop_up_toc', obj); return; }
    const rewards = [];
    const sciGain = 20 * ev.level + 20 * ev.now;
    rewards.push(grantReward(conn, A.ITEM_SCIENCE, sciGain));
    tierClearEffect(ev);
    saveState();
    conn.sendToc('m_ark_mop_up_toc', { map_id: obj.map_id, event_id: obj.event_id });
    // 界面刷新依赖 info 重推
    conn.sendToc('m_ark_info_toc', {
      map_id: s.mapId, event: s.events.map(eventPayload),
      war: s.war ? s.war.warId : 0, war_event: s.war ? s.war.eventOid : 0,
    });
    log(`[ark] 扫荡 #${ev.oid} 科研点+${sciGain} now→${ev.now}`);
  },
  // —— 指令卡收藏 ——
  m_ark_card_list_tos(conn) {
    // 收藏为 0 且背包有卡包 → 先兜底开包（否则一览空、手牌恒 0）；开过包时 openCardItems 已推过卡表
    if (!ensureSomeCards(conn)) pushCardList(conn);
  },
  m_ark_card_click_tos(conn, obj) {
    const s = st();
    if (s.cards[obj.id]) s.cards[obj.id] = 0;
    conn.sendToc('m_ark_card_click_toc', { id: obj.id });
  },
  // —— 探索队 ——
  m_ark_team_select_tos(conn, obj) {
    const s = st();
    const teams = Array.isArray(obj.teams) ? obj.teams : [];
    const cap = teamCap();
    let total = 0;
    const next = {};
    for (const t of teams) {
      const n = Number(t.id);
      if (!(n >= 1 && n <= 6)) continue;
      const list = (t.list || []).map(Number).filter(id => {
        const b = servantOf(id);
        if (!b) return false;
        const nat = Math.floor(b.type / 1000) % 10;
        return nat === n || nat === NATURE_VOID; // 选人面板同口径：本属性或虚
      });
      total += list.length;
      next[n] = list;
    }
    if (total > cap) {
      log(`[ark] 编队超容量 ${total}/${cap}，拒绝`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      pushTeamInfo(conn);
      return;
    }
    s.teams = next;
    s.autoOpt.isAuto = 0; // 手动编辑取消自动替换（teamDetailStr 官方文案）
    saveState();
    conn.sendToc('m_ark_team_select_toc', { op_type: 1, teams: teamPayload() });
    log(`[ark] 探索队保存 ${total}/${cap} 人`);
  },
  m_ark_team_auto_option_tos(conn, obj) {
    const s = st();
    s.autoOpt = {
      powerFirst: obj.power_first || 0,
      isAuto: obj.is_auto || 0,
      natures: (obj.nature || []).map(n => ({ id: Number(n.id), val: Number(n.val) })),
    };
    saveState();
    conn.sendToc('m_ark_team_auto_option_toc', {
      power_first: s.autoOpt.powerFirst, nature: s.autoOpt.natures, is_auto: s.autoOpt.isAuto,
    });
  },
  // —— 科研 ——
  m_tech_tree_info_tos(conn) {
    if (!settleExpiredQueue(conn)) pushScienceInfo(conn);
  },
  m_tech_tree_unlock_queue_tos(conn) {
    conn.sendToc('m_tech_tree_unlock_queue_toc', { queue_num: queueNum() });
  },
  m_tech_tree_add_tos(conn, obj) {
    const s = st();
    settleExpiredQueue(conn); // 先结算到点条目（腾队列位 + 完成的科技不再拦状态）
    const sci = scienceById(obj.id);
    const state = scienceState(obj.id);
    if (!sci || state !== 'CAN') {
      log(`[ark] 研发拒绝 id=${obj.id} state=${state}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      pushScienceInfo(conn);
      return;
    }
    if (s.queue.length >= queueNum()) {
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    // 材料/资产先扣（收集变化），**落盘之后再推**——顺序错成"先推后存"时，一旦 saveState 失败
    // 客户端就记住了服务端没有的数量（这正是"面板说够、系统说不够"的另一条成因）
    const spendOut = newSpendOut();
    for (const [iid, num] of sci.mats) spend(iid, num, spendOut);
    const item = { id: sci.id, end_time: now() + sci.time };
    s.queue.push(item);
    saveState();
    pushSpend(conn, spendOut);
    conn.sendToc('m_tech_tree_add_toc', { add: [item] });
    // 补推全量 info：科研树面板对 add_toc 的 dispatch 刷新不稳（真机"点研发无反应，
    // 退出重进才进队列"）——info_toc 让 scienceList/queue/红点全部重建，等价重进面板
    pushScienceInfo(conn);
    log(`[ark] 开始研发 ${sci.id} ${sci.name}（${sci.time}s）`);
  },
  m_tech_tree_cancel_tos(conn, obj) {
    const s = st();
    const idx = s.queue.findIndex(q => q.id === obj.id);
    if (idx < 0) { conn.sendToc('m_tech_tree_cancel_toc', { id: obj.id }); return; }
    const [q] = s.queue.splice(idx, 1);
    const sci = scienceById(q.id);
    if (sci) for (const [iid, num] of sci.mats) refund(conn, iid, num); // 官方文案：取消不消耗材料
    saveState();
    conn.sendToc('m_tech_tree_cancel_toc', { id: obj.id });
    log(`[ark] 取消研发 ${obj.id}（材料返还）`);
  },
  m_tech_tree_finish_tos(conn, obj) {
    // 客户端不会主动调（无 UI 调用方）；保留为兼容入口，语义与自动结算一致
    const s = st();
    const q = s.queue.find(x => x.id === obj.id);
    const sci = scienceById(obj.id);
    if (!q || !sci || q.end_time > now() + 5) {
      log(`[ark] 完成研发拒绝 id=${obj.id}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      pushScienceInfo(conn);
      return;
    }
    const done = finishResearch(conn, q);
    saveState();
    pushFuelDetail(conn); // 燃产/燃储科技即时生效
    if (done.teamCap) pushTeamInfo(conn);
  },
  m_tech_tree_speed_up_tos(conn, obj) {
    const s = st();
    const q = s.queue.find(x => x.id === obj.id);
    if (!q) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
    const remain = Math.max(0, q.end_time - now());
    const cost = Math.min(Math.ceil(remain / 3600) * 3600, 50000); // 客户端 getSpeedText 同式
    S.roleAsset.gold = Math.max(0, S.roleAsset.gold - cost);
    L.pushAssetChange(conn);
    q.end_time = now();
    saveState();
    conn.sendToc('m_tech_tree_speed_up_toc', { update: [q] });
    settleExpiredQueue(conn); // 加速即到期：立刻结算（不等下个心跳）
    log(`[ark] 加速研发 ${obj.id} 水晶-${cost}`);
  },
  // —— 指令战 ——
  m_copy_war_tos(conn, obj) {
    const s = st();
    const ev = eventByCopy(Number(obj.copy_id));
    if (!ev || ev.done) {
      log(`[ark] 开战拒绝 copy=${obj.copy_id}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    const war = s.war && s.war.copyId === copyIdOf(ev) ? s.war : startWar(conn, ev);
    conn.sendToc('m_copy_war_toc', { copy_id: war.copyId, war_id: war.warId });
  },
  m_war_enter_war_tos(conn, obj) {
    const s = st();
    if (!s.war || s.war.warId !== obj.war_id) {
      log(`[ark] enter_war 忽略 war=${obj.war_id}（无进行中战斗）`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    // 只有"新波次"才重置编成（每波我方满战力复活）；重进面板/断线续战不重置——
    // 否则重复 enter 会把敌方刷满，战斗永远打不完
    if (s.war.spawnedBatch !== s.war.batch) {
      const ev = eventByOid(s.war.eventOid);
      spawnBatch(s.war, ev);
    }
    pushRoundInfo(conn);
  },
  m_war_start_round_tos(conn) {
    const s = st();
    if (!s.war) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
    processRound(conn);
  },
  m_war_use_card_tos(conn, obj) {
    const s = st();
    const war = s.war;
    if (!war || war.warId !== obj.war_id) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
    const idx = war.hand.findIndex(c => c.oid === obj.use_card_id);
    if (idx < 0) {
      conn.sendToc('m_war_use_card_toc', {
        is_self: 1, war_id: obj.war_id, use_card_id: obj.use_card_id,
        brief_pos: obj.brief_pos || 0, change_list: [], effect_list: [],
      });
      return;
    }
    const [card] = war.hand.splice(idx, 1);
    applyCard(war, card.type);
    saveState();
    // change_list/effect_list 留空：数值变化随下一回合 process 同步（空数组客户端安全）
    conn.sendToc('m_war_use_card_toc', {
      is_self: 1, war_id: obj.war_id, use_card_id: obj.use_card_id,
      brief_pos: obj.brief_pos || 0, change_list: [], effect_list: [],
    });
    log(`[ark] 使用指令卡 ${card.type}`);
  },
  m_war_drop_card_tos(conn, obj) {
    const s = st();
    const war = s.war;
    if (war) {
      const idx = war.hand.findIndex(c => c.oid === obj.card_id);
      if (idx >= 0) war.hand.splice(idx, 1);
      saveState();
    }
    conn.sendToc('m_war_drop_card_toc', { war_id: obj.war_id, card_id: obj.card_id });
  },
  m_war_cancel_tos(conn, obj) {
    const s = st();
    if (s.war && s.war.warId === obj.war_id) {
      log(`[ark] 指令战取消 war=${obj.war_id}`);
      s.war = null; saveState();
    }
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
  },
  m_war_give_up_tos(conn, obj) {
    const s = st();
    if (s.war && s.war.warId === obj.war_id) {
      log(`[ark] 指令战放弃 war=${obj.war_id}`);
      s.war = null; saveState();
    }
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
  },
  m_restart_war_tos(conn, obj) {
    const s = st();
    if (s.war && s.war.warId === obj.war_id) {
      const ev = eventByOid(s.war.eventOid);
      s.war = null;
      if (ev) startWar(conn, ev); // 重新开始 = 原事件重开一场
      saveState();
    }
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
  },
};

// 材料返还（取消研发）：只回资产类（背包物品原样退回物品）。conn 同样透传——
// 当前 mats 全是资产/普通材料，但未来任何代币形态的材料也要走同一条宣告链（grantReward 同案）。
function refund(conn, typeId, num) {
  const a = itemToAsset(typeId);
  if (!a) {
    const changed = grantGoods(typeId, num, conn);
    if (changed.length) pushGoodsUpdate(conn, changed, 3);
  } else {
    grantReward(conn, typeId, num);
  }
}

// 登录同步：燃料面板数据 + 三货币 + 探索队 + 誓灵战力（Ark 队伍面板读 VO.power）
function onLogin(conn) {
  settleExpiredQueue(conn); // 离线期间到点的研发直接结算（finish_toc 弹结算面板）
  // 存量自愈：旧实现把指令卡直发进收藏、卡包还留在背包 ⇒ 那些包"开了也没东西"。
  // 只开"产出全部已拥有"的包（真正的无用到道具），玩家还没开过的新包原样留着。
  openCardItems(conn, true);
  tickFuel(conn);
  pushFuelDetail(conn);
  for (const sid of [A.SCORE_SCIENCE, A.SCORE_FIRE, A.SCORE_FUEL]) pushScoreChange(conn, sid);
  const s = st();
  autoFillTeams();
  pushTeamInfo(conn);
  // 誓灵战力（CHANGE_ID_POWER=15）：ArkTeamSelectPanel/编队战力读 VO.power，brief 不带需推
  const changes = S.servants.map(b => ({ servant_id: b.id, key: 15, val: A.servantPower(b) }));
  L.pushServantChanges(conn, changes);
  log(`[ark] 登录同步：燃料 ${getScore(A.SCORE_FUEL)}/${fuelCeil()}(+${fuelVel()}/h) 科研点 ${getScore(A.SCORE_SCIENCE)} 火 ${getScore(A.SCORE_FIRE)} 队容量 ${teamCap()}`);
}

module.exports = {
  handlers, onLogin, st, fuelCeil, fuelVel, teamCap, queueNum, scannerLv,
  pushFuelDetail, pushTeamInfo, pushScienceInfo, grantScience, tickFuel,
  settleExpiredQueue,
  // 指令卡道具（供 vit.js m_item_use_tos 惰性 require 调用）
  useCardItem, openCardItems, ensureSomeCards, pushCardList,
};
