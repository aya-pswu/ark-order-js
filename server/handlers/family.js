// 结社（Family/公会）。功能 id 7，通关 2-1 解锁（CfgGuide.funcOpenGuide "通关2-1后开启"）。
//
// ⚠️ 客户端有两份代码：`tools/lua_src`（旧版，无光环/贡献奖励/合并）与 `tools/lua_remote/src`
// （**真机在跑的新版**，反编译产物在 `tools/bc_cmp/family_new/`）。以新版为准，两版差异会直接崩：
//  - **职位常量新版是 0/10/20/30**（组员/理事/副执行官/执行官），旧版是 0/1/2；
//  - **`contribution_reward` 是 6 槽位定长 int 数组**（FamilyVO.updateContribution 按下标取：
//    1 今日社总贡献 2 昨日社总贡献 3 我今日 4 我昨日 5 我昨日排名 6 领奖状态），
//    发空数组 → contToday=nil → 主面板 `pbCur.value = nil` → **"bad argument #2 to '?' (number expected, got nil)"**
//    （用户实测：创建后进结社直接报这个错，返回主页也报）；
//  - 新版还有光环（m_family_halo_set）、昨日贡献领奖（m_family_contribution_reward/info）、
//    结社合并（m_family_*merge*）三套协议，客户端会主动发。
//
// 其余客户端要点（bc/lua 反编译实证）：
//  - m_family_info_toc 的 notice / auto_exchange / halo / merge_request 等 array 字段**必须发空数组**（NIL→{}），
//    nil 会让 ipairs/# 直接崩；logo 必须 ∈10~15、style ∈1~3、lv ∈1~15。
//  - family_exp 是"本级内经验"，分母取 CfgFamily.levels[lv].exp（增量制），Lv15 显示 MAX。
//  - 创建成功只回空的 m_family_create_toc，必须紧接着推 m_family_info_toc 才会切到主面板。
//  - p_family_member.avatar / m_chat_in_channel_toc.role_info 声明是 array，客户端却当单对象用。
//  - 结社频道（ChatConst.CHANNEL_FAMILY=2）由服务端 m_chat_room_update_toc 开关。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log, roleId, grantGoods, getScore, addScore, pushScoreChange, pushFamilyBanTime, pushFunctionList, VALID_ITEM_TYPES } = L;
const F = require('../data/family_data');

const now = () => Math.floor(Date.now() / 1000);
const dayKey = () => new Date().toLocaleDateString('sv');            // 本地日期 YYYY-MM-DD
const weekKey = () => { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.toLocaleDateString('sv'); };
const fs_ = () => S.familyState;
const hasFamily = () => fs_().familyId > 0;
const utf8Len = s => [...String(s || '')].length;

function familyTxSnapshot() {
  return {
    roleAsset: JSON.parse(JSON.stringify(S.roleAsset)),
    bagGoods: S.bagGoods.map(g => ({ ...g })),
    nextGoodsId: S.nextGoodsId,
    familyState: JSON.parse(JSON.stringify(S.familyState)),
  };
}
function restoreFamilyTx(snap) {
  S.roleAsset = snap.roleAsset;
  S.bagGoods = snap.bagGoods;
  S.nextGoodsId = snap.nextGoodsId;
  S.familyState = snap.familyState;
}

// ---- 结社等级/经验 ----
function addFamilyExp(delta) {
  const st = fs_();
  st.exp = Math.max(0, (st.exp || 0) + Number(delta || 0));
  // 增量制升级：满一级扣掉本级所需，满级丢弃溢出
  while (st.lv < F.MAX_LV && st.exp >= F.levelOf(st.lv).exp) {
    st.exp -= F.levelOf(st.lv).exp;
    st.lv++;
    log(`[family] 结社升级 → Lv${st.lv}`);
  }
  if (st.lv >= F.MAX_LV) st.exp = Math.min(st.exp, 0) || st.exp; // Lv15 exp 仅作展示
}

// 本周贡献（结社积分 id=8）+ 今日贡献 + 成员贡献 + 结社经验（官方 100:1 的说法，这里 1:1 简化）
function addContribution(conn, delta) {
  if (!hasFamily() || !delta) return;
  const st = fs_();
  checkFamilyReset(conn);
  addScore(conn, F.SCORE_FAMILY, delta);
  st.myContribution = (st.myContribution || 0) + delta;   // 本周
  st.myHistory = (st.myHistory || 0) + delta;             // 历史
  try { require('./achievement').addFamilyContribution(delta); } catch (e) { /* 忽略 */ } // 成就 50xxx
  st.myToday = (st.myToday || 0) + delta;                 // 今日（主面板进度条 + 昨日结算）
  st.contToday = (st.contToday || 0) + delta;             // 结社今日总贡献（本地服只有我 + NPC 静态值）
  addFamilyExp(delta);
  saveState();
}

// m_family_info_toc.contribution_reward：**6 槽位定长 int 数组**，FamilyVO.updateContribution 按下标取。
// 发空数组会让 contToday/rewardState 全 nil → 主面板 pbCur.value=nil 直接 LuaError（实测报错根因）
function contributionArr() {
  const st = fs_();
  const npcToday = st.members.reduce((s, m) => s + (m.today || 0), 0);
  const npcYesterday = st.members.reduce((s, m) => s + (m.yesterday || 0), 0);
  const arr = [];
  arr[F.CONTRI_SLOT.TOTAL_TODAY - 1] = (st.contToday || 0) + npcToday;
  arr[F.CONTRI_SLOT.TOTAL_YESTERDAY - 1] = (st.contYesterday || 0) + npcYesterday;
  arr[F.CONTRI_SLOT.MY_TODAY - 1] = st.myToday || 0;
  arr[F.CONTRI_SLOT.MY_YESTERDAY - 1] = st.myYesterday || 0;
  arr[F.CONTRI_SLOT.MY_RANK_YESTERDAY - 1] = st.rankYesterday || 0;
  arr[F.CONTRI_SLOT.HAS_GET_RANK_REWARD - 1] = st.rewardState || F.CONTRI_REFUSE;
  return arr.map(v => Number(v) || 0);
}

// 光环等级（p_kvi{id: haloId, val: 等级}）；客户端本地已按 CfgFamily.haloInfo 建好条目，只用 val 覆盖等级
function haloArr() {
  const halos = fs_().halos || {};
  return F.HALOS.filter(h => halos[h.haloId]).map(h => ({ id: h.haloId, val: halos[h.haloId] }));
}


// ---- 每日/每周重置 ----
function checkFamilyReset(conn) {
  const st = fs_();
  let changed = false;
  if (st.signDay !== dayKey()) { st.signDay = dayKey(); st.sign = 0; changed = true; }   // 签到
  if (st.bossDay !== dayKey()) { st.bossDay = dayKey(); st.bossUseTimes = 0; changed = true; } // 宝箱来袭次数
  if (st.contDay !== dayKey()) {                                                          // 今日贡献结算 → 昨日
    if (st.contDay) { // 首次初始化不结算（避免把 0 当昨日）
      st.contYesterday = st.contToday || 0;
      st.myYesterday = st.myToday || 0;
      st.rankYesterday = st.myYesterday > 0 ? 1 : 0; // 本地服只有我一个真实成员，有贡献就是第 1
      // 昨日结社总贡献达第一档才可领（rewardState：0 不可领 / 1 可领 / 2 已领）
      const total = (st.contYesterday || 0) + st.members.reduce((s, m) => s + (m.yesterday || 0), 0);
      st.rewardState = total >= F.CONTRIBUTION_REWARD[0].needCont ? F.CONTRI_GET : F.CONTRI_REFUSE;
    }
    st.contDay = dayKey();
    st.contToday = 0;
    st.myToday = 0;
    changed = true;
  }
  if (st.shopWeekKey !== weekKey()) {                                                     // 商店兑换次数 + 本周贡献
    st.shopWeekKey = weekKey();
    st.shopBought = {};
    st.myContribution = 0;
    if (conn && getScore(F.SCORE_FAMILY)) { S.roleAsset.scores[F.SCORE_FAMILY] = 0; pushScoreChange(conn, F.SCORE_FAMILY); }
    changed = true;
  }
  if (changed) { saveState(); log(`[family] 周期重置 sign=${st.sign} boss=${st.bossUseTimes} 今日贡献=${st.contToday} 昨日=${st.contYesterday} 领奖态=${st.rewardState}`); }
}

// ---- 头像（p_avatar 单对象；skin/head/face 全 0 客户端会 printWarning 但不崩）----
function avatarOf(servantType, self) {
  const base = { use: 1, face: 1, head: 0, skin: (servantType || 1124001) * 100 + 1, border: 0, costume: [] };
  // 三百零一：自己那行叠加头像/头像框佩戴态（NPC 行保持原样）
  return self ? Object.assign(base, require('./avatar').selfAvatarFields()) : base;
}

// ---- p_family_member ----
function memberP(m) {
  return {
    role_id: m.roleId, role_name: m.name, lv: m.lv || 1, job: m.job || 0,
    medals: [], title: [],
    contribution: m.contribution || 0,            // 本周总贡献
    history_contribution: m.history || 0,         // 历史总贡献
    login_time: m.online ? now() : now() - (m.offlineDays || 0) * 86400,
    offline_time: m.online ? now() : now() - (m.offlineDays || 1) * 86400,
    is_online: m.online ? 1 : 0,
    avatar: avatarOf(m.servantType, m.roleId === roleId),
    last_contribution: m.yesterday || 0,   // 新版成员页"昨日总贡献"
    cur_contribution: m.today || 0,        // 新版成员页"今日总贡献"
  };
}

// 我自己那条成员数据（job/贡献取 familyState）
function myMember() {
  const st = fs_();
  const helper = S.servants[0] || {};
  return {
    roleId, name: S.roleName, lv: 1, job: st.job, contribution: st.myContribution || 0,
    history: st.myHistory || 0, today: st.myToday || 0, yesterday: st.myYesterday || 0,
    servantType: helper.type || 1124001, online: 1,
  };
}

function allMembers() {
  return [myMember()].concat(fs_().members.map(m => Object.assign({}, m)));
}

// ---- m_family_info_toc ----
function pushFamilyInfo(conn) {
  const st = fs_();
  checkFamilyReset(conn);
  conn.sendToc('m_family_info_toc', {
    family_id: st.familyId,
    family_name: st.name,
    family_lv: Math.min(Math.max(st.lv || 1, 1), F.MAX_LV),
    family_exp: st.exp || 0,
    notice: st.notices.map(n => ({ id: n.id, str: n.str, color: n.color || 1 })),
    intro: st.intro || '',
    style: F.STYLES.includes(st.style) ? st.style : 1,
    logo: F.BELIEFS.includes(st.logo) ? st.logo : 10,
    owner_name: st.ownerName || S.roleName,
    member_num: 1 + st.members.length,
    request_num: st.applies.length,
    job: st.job,
    sign: st.sign ? 1 : 0,
    auto_accept: st.autoAccept ? 1 : 0,
    auto_exchange: st.autoExchange.map(e => ({ id: e.id, val: e.val })),
    contribution_reward: contributionArr(), // 6 槽位定长数组，空数组会崩主面板（见文件头注释）
    halo: haloArr(),
    merge_request: [],                     // 结社合并：本地服无对手社，恒空
  });
}

function pushMembers(conn) {
  conn.sendToc('m_family_member_toc', {
    list: allMembers().map(memberP),
    delete_list: [],
    op_type: 0, // 客户端恒发 0，回全量（FamilyMgr.updateMembers 末尾按列表长度重算 memberNum）
  });
}

// 结社聊天频道开关（客户端本地没有结社频道默认项，不推就没有这个频道页签）
function pushChatRoom(conn, open) {
  conn.sendToc('m_chat_room_update_toc', {
    channel: 2, // ChatConst.CHANNEL_FAMILY
    room_id: fs_().familyId || 0,
    op_type: open ? 1 : 0,
  });
}

// 登录同步：有结社才推频道（无结社时推 op_type=1 会出现一个空频道）
function onLogin(conn) {
  checkFamilyReset(conn);
  if (hasFamily()) pushChatRoom(conn, true);
}

// ---- 创建/加入/退出 ----
function seedOwnFamily(st, name, intro, style, logo, autoAccept) {
  st.familyId = 20001;          // 本地服固定 id（客户端只当展示 "ID:%08d"）
  st.name = name;
  st.intro = intro;
  st.style = style;
  st.logo = logo;
  st.autoAccept = autoAccept ? 1 : 0;
  st.lv = 1; st.exp = 0;
  st.job = F.JOB_OWNER;
  st.ownerName = S.roleName;
  st.isNpcFamily = 0;
  st.sign = 0; st.signDay = dayKey();
  st.notices = [{ id: 1, str: '欢迎加入' + name + '，每日记得签到！', color: 1 }];
  st.members = F.NPC_MEMBERS.map(m => Object.assign({}, m));
  st.applies = F.NPC_APPLIES.map(a => Object.assign({}, a));
  st.myContribution = 0; st.myHistory = 0;
  st.appliedTo = [];
}

function joinNpcFamily(st, npc) {
  st.familyId = npc.familyId;
  st.name = npc.name;
  st.intro = npc.intro;
  st.style = npc.style;
  st.logo = npc.logo;
  st.lv = npc.lv; st.exp = npc.exp;
  st.job = F.JOB_MEMBER;        // 加入他人结社是组员（管理按钮按 job 隐藏，与官方一致）
  st.ownerName = npc.ownerName;
  st.isNpcFamily = 1;
  st.autoAccept = 1;
  st.sign = 0; st.signDay = dayKey();
  st.notices = [{ id: 1, str: '本结社由 ' + npc.ownerName + ' 创建，欢迎新成员！', color: 2 }];
  // NPC 结社的成员：取 NPC 名单 + 补足到公示人数（只发前 12 条，客户端列表够用）
  st.members = F.NPC_MEMBERS.map(m => Object.assign({}, m, { job: m.job }));
  st.applies = [];
  st.myContribution = 0; st.myHistory = 0;
}

function clearFamily(st) {
  st.familyId = 0; st.name = ''; st.intro = ''; st.job = F.JOB_OWNER;
  st.members = []; st.applies = []; st.notices = []; st.autoExchange = [];
  st.lv = 1; st.exp = 0; st.sign = 0; st.isNpcFamily = 0;
  st.myContribution = 0; st.myHistory = 0;
  st.banTime = now() + F.BAN_SECONDS; // 官方"明天再操作"，本地服 5 分钟
}

// ---- 结社商店（shop_id=8，走通用 shop 协议）----
function shopItemP(g) {
  const bought = Number(fs_().shopBought[g.id] || 0);
  return {
    id: g.id, type_id: g.type_id, num: g.num, tag: 0,
    price: [{ id: F.SCORE_FAMILY, val: g.price }], // ShopItemCommonVO.initPrice 取 price[1]
    currency: F.SCORE_FAMILY,
    buy_times: bought, total_times: g.total_times, // 客户端 remain = total - buy
    end_time: 0, seq: g.id, discount_end: 0, origin_price: g.price,
    spec_type: '', spec_data: [],
  };
}

function shopDetailP(shopId) {
  if (shopId === 8) {
    return { shop_id: 8, shop_goods: F.SHOP_GOODS.map(shopItemP), next_refresh_time: 0, open_time: 0, end_time: 0 };
  }
  if (shopId === F.RENAME_SHOP.shopId) {
    // 改名卡（客户端 FamilyMgr 买不到卡时会发 shop 5 / goods 5004）
    return {
      shop_id: shopId,
      shop_goods: [{
        id: F.RENAME_SHOP.goodsId, type_id: F.RENAME_CARD, num: 1, tag: 0,
        price: [{ id: 3, val: F.RENAME_SHOP.gold }], currency: 3, // id=3 水晶
        buy_times: 0, total_times: 99, end_time: 0, seq: 1, discount_end: 0,
        origin_price: F.RENAME_SHOP.gold, spec_type: '', spec_data: [],
      }],
      next_refresh_time: 0, open_time: 0, end_time: 0,
    };
  }
  // 其他商店未实现：回空商品（details 必须非空，客户端 m_shop_detail_toc 直接取 details[1].shop_id）
  return { shop_id: shopId, shop_goods: [], next_refresh_time: 0, open_time: 0, end_time: 0 };
}

// 宝箱来袭信息：nature 决定客户端加载哪套宝箱怪 spine（Furniture/S_baoxiangguai0<nature>），
// helper 的 servant_type 必须在 CfgServant 里存在（客户端 FamilyMgr.updateBossInfo 直接取 .nature，查不到就崩）
// is_family 按 is_family==1 / ~=1 分桶进两个文件级表（slot11/slot13）：
//   slot11 = 结社成员（getBossHelper，手动选人列表）；slot13 = NPC 援军（getRandomHelper，"随机召唤"池）。
// NPC 若也标 is_family:1，slot13 恒空 → 随机召唤必 nil 崩（FamilyBossHelperView.onClickBtnRandom，一百八十）。
function pushBossInfo(conn) {
  const st = fs_();
  checkFamilyReset(conn);
  const nature = F.BOSS_NATURES[new Date().getDay() % F.BOSS_NATURES.length];
  const mine = S.servants.slice(0, 6).map(s => ({
    role_id: s.id, role_name: S.roleName, servant_type: s.type,  // 存档里誓灵字段名是 type（不是 type_id）
    skin: s.type * 100 + 1, is_family: 1,
  }));
  const npc = st.members.map(m => ({
    role_id: m.roleId, role_name: m.name, servant_type: m.servantType,
    skin: (m.servantType || 1124001) * 100 + 1, is_family: 0,  // NPC=非结社援军，进"随机召唤"池（slot13）
  }));
  conn.sendToc('m_family_boss_info_toc', {
    nature,
    has_times: Math.max(0, F.BOSS_DAILY_TIMES - st.bossUseTimes), // 剩余"剧场入场券"
    use_times: st.bossUseTimes,                                   // 今日已用（客户端 ==10 显示"宝箱怪累了"）
    helper: mine.concat(npc),
  });
}

const handlers = {
// 打开结社主面板（FamilyMainPanel.onOpenPanel）→ 回结社详情
m_family_info_tos(conn, obj) {
  if (!hasFamily()) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  pushFamilyInfo(conn);
},
// 创建结社：客户端已本地校验名字/简介非空、style/logo 已选、水晶足够；服务端兜底校验并扣水晶
// 注意 auto_accept 在创建包里客户端传的是 bool（改信息包才是 int）→ 两种都接
m_family_create_tos(conn, obj) {
  const st = fs_();
  const name = String((obj && obj.family_name) || '').trim();
  const intro = String((obj && obj.intro) || '').trim();
  const style = Number(obj && obj.style) || 0;
  const logo = Number(obj && obj.logo) || 0;
  const autoAccept = (obj && (obj.auto_accept === true || Number(obj.auto_accept) === 1)) ? 1 : 0;
  const bad = hasFamily() ? '已有结社'
    : st.banTime > now() ? '退社冷却中'
      : !name ? '结社名为空' : utf8Len(name) > F.NAME_MAX ? '结社名超长'
        : !intro ? '简介为空'
          : !F.STYLES.includes(style) ? 'style 非法'
            : !F.BELIEFS.includes(logo) ? 'logo 非法'
              : (S.roleAsset.gold + S.roleAsset.gold_given) < F.CREATE_COST ? '水晶不足' : '';
  if (bad) { log(`[family] 创建被拒：${bad}`); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  // 扣水晶：先扣赠送再扣充值（与商店/免费商店一致的口径）
  let cost = F.CREATE_COST;
  const useGiven = Math.min(S.roleAsset.gold_given, cost);
  S.roleAsset.gold_given -= useGiven; cost -= useGiven;
  S.roleAsset.gold -= cost;
  seedOwnFamily(st, name, intro, style, logo, autoAccept);
  saveState();
  L.pushAssetChange(conn);
  conn.sendToc('m_family_create_toc', {});      // 空包，仅弹"创建成功"
  pushFamilyInfo(conn);                          // 必须紧接着推：客户端据此把创建面板切成主面板
  pushMembers(conn);
  pushChatRoom(conn, true);                      // 开结社聊天频道
  log(`[family] 创建结社「${name}」style=${style} logo=${logo} 花费水晶 ${F.CREATE_COST}`);
},
// 成员页签打开（op_type 恒 0）→ 回全量成员
m_family_member_tos(conn, obj) {
  if (!hasFamily()) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  pushMembers(conn);
},
// 签到：客户端已签到时不发包；回包只带 lv/exp（奖励要另发积分/物品包）
m_family_sign_tos(conn, obj) {
  const st = fs_();
  if (!hasFamily()) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  checkFamilyReset(conn);
  if (st.sign) { conn.sendToc('m_family_sign_toc', { family_lv: st.lv, family_exp: st.exp }); return; }
  st.sign = 1;
  addFamilyExp(F.FAMILY_EXP_PER_SIGN);
  st.myContribution = (st.myContribution || 0) + F.CONTRIBUTION_PER_SIGN;
  st.myHistory = (st.myHistory || 0) + F.CONTRIBUTION_PER_SIGN;
  addScore(conn, F.SCORE_FAMILY, F.CONTRIBUTION_PER_SIGN);
  saveState();
  conn.sendToc('m_family_sign_toc', { family_lv: st.lv, family_exp: st.exp });
  pushMembers(conn); // 刷新我的贡献显示
  log(`[family] 签到：结社经验 +${F.FAMILY_EXP_PER_SIGN}（Lv${st.lv} ${st.exp}），贡献 +${F.CONTRIBUTION_PER_SIGN} → ${getScore(F.SCORE_FAMILY)}`);
},
// 编辑公告：客户端只发变更项（str 空串 = 删除该槽），回包也回显变更集（客户端用同一套 updateNotices 合并）
m_family_edit_notice_tos(conn, obj) {
  const st = fs_();
  if (!hasFamily() || !F.canEditNotice(st.job)) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const update = ((obj && obj.update) || []).map(n => ({
    id: Math.max(1, Math.min(F.NOTICE_MAX, Number(n.id) || 1)),
    str: String(n.str || '').slice(0, 100), // 客户端无长度校验，服务端兜底
    color: Math.max(1, Number(n.color) || 1),
  }));
  for (const u of update) {
    const idx = st.notices.findIndex(n => n.id === u.id);
    if (!u.str) { if (idx >= 0) st.notices.splice(idx, 1); continue; }
    if (idx >= 0) st.notices[idx] = u; else st.notices.push(u);
  }
  st.notices.sort((a, b) => a.id - b.id);
  saveState();
  conn.sendToc('m_family_edit_notice_toc', { update });
  log(`[family] 公告更新 ${update.length} 条，现有 ${st.notices.length} 条`);
},
// 编辑结社信息（含改名）：改名要消耗结社改名卡 31000064
m_family_edit_info_tos(conn, obj) {
  const st = fs_();
  if (!hasFamily() || !F.canChangeInfo(st.job)) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const name = String((obj && obj.family_name) || st.name).trim();
  const intro = String((obj && obj.intro) || '').trim() || st.intro;
  const style = F.STYLES.includes(Number(obj && obj.style)) ? Number(obj.style) : st.style;
  const logo = F.BELIEFS.includes(Number(obj && obj.logo)) ? Number(obj.logo) : st.logo;
  const autoAccept = (obj && (obj.auto_accept === true || Number(obj.auto_accept) === 1)) ? 1 : 0;
  if (name !== st.name) {
    if (utf8Len(name) > F.NAME_MAX || !name) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
    const card = S.bagGoods.find(g => Number(g.type_id) === F.RENAME_CARD && Number(g.cur_num) > 0);
    if (!card) { log('[family] 改名失败：无结社改名卡'); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
    card.cur_num = Number(card.cur_num) - 1;
    const del = card.cur_num <= 0;
    if (del) S.bagGoods = S.bagGoods.filter(g => g !== card);
    L.pushGoodsUpdate(conn, [card], del ? 2 : 3);   // DEL 也要带 goods(id) 供客户端 delGoods
    st.name = name;
    log(`[family] 改名 →「${name}」（消耗改名卡）`);
  }
  st.intro = intro; st.style = style; st.logo = logo; st.autoAccept = autoAccept;
  saveState();
  conn.sendToc('m_family_edit_info_toc', {
    family_name: st.name, intro: st.intro, style: st.style, logo: st.logo, auto_accept: st.autoAccept,
  });
  pushFamilyInfo(conn);
},
// 申请列表（打开审批面板）：p_family_request 用 skin 取头像，不用 p_avatar
m_family_apply_tos(conn) {
  const st = fs_();
  if (!hasFamily() || !F.canApply(st.job)) { conn.sendToc('m_family_apply_toc', { list: [] }); return; }
  conn.sendToc('m_family_apply_toc', {
    list: st.applies.map(a => ({
      role_id: a.roleId, role_name: a.name, lv: a.lv || 1,
      skin: (a.servantType || 1124001) * 100 + 1, title: [],
    })),
  });
},
// 通过申请：res 码照客户端 FamilyModule 的分支（0 成功 / 547001 权限 / 547004 人满 / 547002 过期…）
m_family_accept_tos(conn, obj) {
  const st = fs_();
  const rid = Number(obj && obj.role_id);
  let res = 0;
  if (!hasFamily() || !F.canApply(st.job)) res = 547001;
  else if (1 + st.members.length >= F.levelOf(st.lv).memberNum) res = 547004;
  else {
    const i = st.applies.findIndex(a => Number(a.roleId) === rid);
    if (i < 0) res = 547002;
    else {
      const a = st.applies.splice(i, 1)[0];
      st.members.push({ roleId: a.roleId, name: a.name, lv: a.lv, job: F.JOB_MEMBER, contribution: 0, history: 0, servantType: a.servantType, online: 1 });
      saveState();
    }
  }
  conn.sendToc('m_family_accept_toc', { role_id: rid, res });
  if (res === 0) { pushMembers(conn); pushFamilyInfo(conn); log(`[family] 通过申请 role=${rid}，成员 ${1 + st.members.length}`); }
},
// 拒绝申请（无 res 字段）
m_family_refuse_tos(conn, obj) {
  const st = fs_();
  const rid = Number(obj && obj.role_id);
  if (hasFamily() && F.canApply(st.job)) {
    st.applies = st.applies.filter(a => Number(a.roleId) !== rid);
    saveState();
  }
  conn.sendToc('m_family_refuse_toc', { role_id: rid });
  pushFamilyInfo(conn); // 刷新 request_num（申请数为 0 时客户端关面板）
},
// 升/降职（副执行官以上；理事名额受 CfgFamily.levels[lv].managerNum、副执行官名额自定 DEPUTY_MAX）
// 客户端按 CfgFamily.jobs[我的职位].button[目标职位] 决定显示升/降按钮，job 取值 0/10/20
m_family_job_tos(conn, obj) {
  const st = fs_();
  const rid = Number(obj && obj.role_id);
  const job = Number(obj && obj.job);
  const m = st.members.find(x => Number(x.roleId) === rid);
  const JOB_NAME = { [F.JOB_MEMBER]: '组员', [F.JOB_MANAGER]: '理事', [F.JOB_DEPUTY]: '副执行官' };
  if (!hasFamily() || !F.canChangeJob(st.job) || !m || job >= st.job || !JOB_NAME[job]) {
    conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return;
  }
  if (job === F.JOB_MANAGER && st.members.filter(x => x.job === F.JOB_MANAGER).length >= F.levelOf(st.lv).managerNum) {
    log('[family] 理事名额已满'); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return;
  }
  if (job === F.JOB_DEPUTY && st.members.filter(x => x.job === F.JOB_DEPUTY).length >= F.DEPUTY_MAX) {
    log('[family] 副执行官名额已满'); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return;
  }
  m.job = job;
  saveState();
  conn.sendToc('m_family_job_toc', { role_id: rid, job });
  log(`[family] ${m.name} 职位 → ${JOB_NAME[job]}`);
},
// 开除成员（执行官/理事，且目标职位低于自己——客户端按钮也是这个规则）
m_family_expel_tos(conn, obj) {
  const st = fs_();
  const rid = Number(obj && obj.role_id);
  const m = st.members.find(x => Number(x.roleId) === rid);
  if (!hasFamily() || !F.canExpel(st.job) || !m || m.job >= st.job) {
    conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return;
  }
  st.members = st.members.filter(x => x !== m);
  saveState();
  conn.sendToc('m_family_expel_toc', { role_id: rid });
  pushFamilyInfo(conn);
  log(`[family] 开除 ${m.name}，剩余成员 ${1 + st.members.length}`);
},
// 转让执行官（客户端只对**副执行官**显示转让按钮）：目标升执行官，我按 FamilyMgr.changeOwner 降为理事
m_family_give_tos(conn, obj) {
  const st = fs_();
  const rid = Number(obj && obj.role_id);
  const m = st.members.find(x => Number(x.roleId) === rid);
  if (!hasFamily() || st.job !== F.JOB_OWNER || !m || m.job !== F.JOB_DEPUTY) {
    conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return;
  }
  m.job = F.JOB_OWNER;
  st.job = F.JOB_MANAGER;   // 与客户端 FamilyMgr.changeOwner 一致（原社长降为理事，不是组员）
  st.ownerName = m.name;
  saveState();
  conn.sendToc('m_family_give_toc', { role_id: rid });
  pushMembers(conn);
  pushFamilyInfo(conn);
  log(`[family] 转让执行官 → ${m.name}，自己降为理事`);
},
// 退出结社：清空 + 进冷却 + 关聊天频道（客户端 quit_toc 后自己把 myFamilyID 置 0）
m_family_quit_tos(conn) {
  const st = fs_();
  if (!hasFamily()) { conn.sendToc('m_family_quit_toc', {}); return; }
  const oldName = st.name;
  clearFamily(st);
  if (S.roleAsset.scores) S.roleAsset.scores[F.SCORE_FAMILY] = 0; // 退社贡献清零（客户端退社确认文案明示）
  saveState();
  conn.sendToc('m_family_quit_toc', {});
  pushChatRoom(conn, false);
  pushScoreChange(conn, F.SCORE_FAMILY);
  pushFamilyBanTime(conn);
  log(`[family] 退出结社「${oldName}」，冷却至 ${st.banTime}`);
},
// 搜索结社：name 空 + style 0 = 推荐列表；纯数字按 ID 精确；否则按名字模糊。status=1 表示"已申请"
m_family_search_tos(conn, obj) {
  const st = fs_();
  const kw = String((obj && obj.family_name) || '').trim();
  const style = Number(obj && obj.style) || 0;
  let list = F.NPC_FAMILIES.slice();
  if (kw) list = /^\d+$/.test(kw) ? list.filter(f => f.familyId === Number(kw)) : list.filter(f => f.name.includes(kw));
  if (style) list = list.filter(f => f.style === style);
  conn.sendToc('m_family_search_toc', {
    list: list.map(f => ({
      family_id: f.familyId, family_name: f.name, family_lv: f.lv, exp: f.exp, // 注意这里字段名是 exp 不是 family_exp
      intro: f.intro, style: f.style, logo: f.logo, owner_name: f.ownerName,
      member_num: f.memberNum, request_num: 0,
      status: st.appliedTo.includes(f.familyId) ? 1 : 0,
    })),
  });
  log(`[family] 搜索结社 kw="${kw}" style=${style} → ${list.length} 条`);
},
// 申请加入 NPC 结社：本地服无人审批，按"自动同意"直接入社（回 request_toc 让客户端弹"申请成功"，
// 紧接着推 info_toc —— 客户端收到就把列表面板换成主面板，等价于秒过审）
m_family_request_tos(conn, obj) {
  const st = fs_();
  const fid = Number(obj && obj.family_id);
  const npc = F.NPC_FAMILIES.find(f => f.familyId === fid);
  if (hasFamily() || !npc || st.banTime > now()) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  conn.sendToc('m_family_request_toc', { family_id: fid });
  if (npc.memberNum >= F.levelOf(npc.lv).memberNum) { // 人满：只留"已申请"状态
    if (!st.appliedTo.includes(fid)) st.appliedTo.push(fid);
    saveState();
    log(`[family] 申请「${npc.name}」——人数已满，仅记录已申请`);
    return;
  }
  joinNpcFamily(st, npc);
  saveState();
  pushFamilyInfo(conn);
  pushMembers(conn);
  pushChatRoom(conn, true);
  log(`[family] 加入结社「${npc.name}」（自动同意），职位=组员`);
},
// 自动兑换名单：p_kvi{id: 商品 oid, val: 顺序 1~4}
m_family_change_auto_exchange_list_tos(conn, obj) {
  const st = fs_();
  const list = ((obj && obj.list) || [])
    .filter(e => F.SHOP_GOODS.some(g => g.id === Number(e.id)))
    .slice(0, F.AUTO_EXCHANGE_MAX)
    .map((e, i) => ({ id: Number(e.id), val: Number(e.val) || i + 1 }));
  st.autoExchange = list;
  saveState();
  conn.sendToc('m_family_change_auto_exchange_list_toc', {});
  log(`[family] 自动兑换名单 ${list.length} 项：[${list.map(e => e.id).join(',')}]`);
},
// 宝箱来袭（结社 BOSS）：nature 按天轮换；每日总额 10（客户端硬编码 10 判"宝箱怪累了"）
m_family_boss_info_tos(conn) {
  if (!hasFamily()) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  pushBossInfo(conn);
},
// 出战：list = 选中的援军 role_id；回包 list + reward，之后必须重推 boss_info 才会刷新次数
m_family_boss_fight_tos(conn, obj) {
  const st = fs_();
  if (!hasFamily()) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  checkFamilyReset(conn);
  const picked = ((obj && obj.list) || []).map(Number).filter(Boolean);
  const remain = F.BOSS_DAILY_TIMES - st.bossUseTimes;
  const used = Math.min(picked.length || 1, Math.max(0, remain));
  if (used <= 0) { conn.sendToc('m_family_boss_fight_toc', { list: [], reward: [] }); return; }
  const tx = familyTxSnapshot();
  st.bossUseTimes += used;
  // 奖励：按出战人数发（p_reward{type: 物品 type_id, num}），同时入包
  const reward = F.BOSS_REWARDS.map(r => ({ type: r.type_id, num: r.num * used }));
  const changed = [];
  try {
    for (const r of reward) changed.push(...L.grantGoods(r.type, r.num, conn));
  } catch (e) {
    restoreFamilyTx(tx);
    log(`[family] 宝箱来袭发奖失败，已回滚次数与奖励：${e.message}`);
    return conn.sendToc('m_common_reply_toc', { proto_id: 0 });
  }
  // 奖励成功后再增加贡献；贡献本身会落盘。
  addContribution(conn, F.CONTRIBUTION_PER_FIGHT * used); // 参与也给贡献
  saveState();
  if (changed.length) L.pushGoodsUpdate(conn, changed, 3);
  conn.sendToc('m_family_boss_fight_toc', { list: picked.slice(0, used), reward });
  pushBossInfo(conn); // 次数刷新（fight_toc 不带次数，客户端也不自减）
  log(`[family] 宝箱来袭：出战 ${used} 人，今日已用 ${st.bossUseTimes}/${F.BOSS_DAILY_TIMES}`);
},
// ---- 新版独有：昨日贡献奖励 / 光环 / 结社合并 ----
// 贡献信息（主面板刷新时客户端会主动拉）：回 6 槽位数组
m_family_contribution_info_tos(conn) {
  if (!hasFamily()) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  checkFamilyReset(conn);
  conn.sendToc('m_family_contribution_info_toc', { contribution_reward: contributionArr() });
},
// 领昨日贡献奖励（空包 tos/toc；客户端收到就把状态置为"已领取"）
m_family_contribution_reward_tos(conn) {
  const st = fs_();
  if (!hasFamily()) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  checkFamilyReset(conn);
  if (st.rewardState !== F.CONTRI_GET) { log(`[family] 贡献奖励不可领（state=${st.rewardState}）`); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  // 档位按"昨日结社总贡献"，另加个人昨日排名奖
  const total = (st.contYesterday || 0) + st.members.reduce((s, m) => s + (m.yesterday || 0), 0);
  const tier = F.CONTRIBUTION_REWARD.filter(t => total >= t.needCont).pop() || F.CONTRIBUTION_REWARD[0];
  const rank = F.RANK_REWARD.find(r => r.rank === st.rankYesterday);
  const changed = [];
  let assetChanged = false;
  // 货币先分流（二百八十四同族②）：CONTRIBUTION_REWARD 四档与 RANK_REWARD 1/2 名都含
  // 30000002 体力 / 30000003 金币（form=2 货币）——此前直接 grantGoods 全部变成 bagGoods
  // 幽灵条目，客户端 isToBag=false 静默丢弃，"贡献领了体力/金币不增加"。
  for (const r of tier.reward.concat(rank ? rank.reward : [])) {
    if (r.id === 30000003) { S.roleAsset.silver += r.num; assetChanged = true; }
    else if (r.id === 30000000) { S.roleAsset.gold += r.num; S.roleAsset.gold_given += r.num; assetChanged = true; }
    else if (r.id === 30000002) { try { require('./vit').addVit(conn, r.num); } catch (e) { log('[family] 发放体力失败: ' + (e && e.message)); } }
    else if (L.grantScoreItem(conn, r.id, r.num)) { /* 道具形态积分落 role_scores */ }
    else if (VALID_ITEM_TYPES.has(r.id)) changed.push(...grantGoods(r.id, r.num, conn));
  }
  st.rewardState = F.CONTRI_HAS_GOTTEN;
  saveState();
  if (assetChanged) L.pushAssetChange(conn);
  if (changed.length) L.pushGoodsUpdate(conn, changed, 3);
  conn.sendToc('m_family_contribution_reward_toc', { contribution_reward: contributionArr() });
  pushFamilyInfo(conn);
  log(`[family] 领取昨日贡献奖励：档位 Lv${tier.lv}（社昨日总贡献 ${total}）${rank ? ' + 排名' + rank.rank + '奖' : ''}`);
},
// 光环加点：change_list = p_kvi[{id: haloId, val: 目标等级}]；总点数受结社等级 haloPointSet 限制
m_family_halo_set_tos(conn, obj) {
  const st = fs_();
  if (!hasFamily() || !F.canEditNotice(st.job)) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  if (!st.halos) st.halos = {};
  const next = Object.assign({}, st.halos);
  for (const c of (obj && obj.change_list) || []) {
    const cfg = F.HALOS.find(h => h.haloId === Number(c.id));
    if (!cfg) continue;
    next[cfg.haloId] = Math.max(0, Math.min(cfg.maxLv, Number(c.val) || 0));
  }
  const used = Object.values(next).reduce((s, v) => s + v, 0);
  const maxPoint = F.haloPointOf(st.lv);
  if (used > maxPoint) { log(`[family] 光环点数超限：${used}/${maxPoint}`); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  st.halos = next;
  saveState();
  conn.sendToc('m_family_halo_set_toc', { change_list: haloArr() });
  log(`[family] 光环加点 ${used}/${maxPoint}：${JSON.stringify(st.halos)}`);
},
// 结社合并：本地服只有玩家一个真实结社，没有可合并对象。
// 必须显式回 common_reply —— 否则 start.js 的兜底会按 schema 发一个全 0 的 merge toc，
// 客户端 FamilyMgr.updateMergeVO 会拿它开合并面板（对方社名为空 → 后续必崩）
m_family_pre_merge_request_tos(conn) { log('[family] 结社合并未实现（本地服单结社）'); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); },
m_family_merge_request_tos(conn) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); },
m_family_merge_reject_tos(conn) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); },
m_family_pre_merge_response_tos(conn) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); },
m_family_merge_response_tos(conn) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); },
m_family_read_merge_apply_result_tos(conn) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); },

// details 必须非空：客户端 m_shop_detail_toc 直接取 details[1].shop_id
m_shop_detail_tos(conn, obj) {
  const ids = ((obj && obj.shop_ids) || []).map(Number).filter(Boolean);
  const list = (ids.length ? ids : [8]).map(shopDetailP);
  conn.sendToc('m_shop_detail_toc', { details: list });
  log(`[shop] 商店详情 [${ids.join(',')}] → ${list.map(d => d.shop_id + ':' + d.shop_goods.length + '件').join(' ')}`);
},
// 购买：结社商店用结社积分（score 8），改名卡商店用水晶
m_shop_buy_tos(conn, obj) {
  const st = fs_();
  const shopId = Number(obj && obj.shop_id);
  const gid = Number(obj && obj.id);
  const num = Math.max(1, Number(obj && obj.num) || 1);
  const reply = () => conn.sendToc('m_common_reply_toc', { proto_id: 0 });
  if (shopId === 8) {
    const g = F.SHOP_GOODS.find(x => x.id === gid);
    if (!g || !hasFamily()) return reply();
    checkFamilyReset(conn);
    const bought = Number(st.shopBought[gid] || 0);
    if (bought + num > g.total_times) { log(`[shop] 结社兑换次数不足 ${bought}/${g.total_times}`); return reply(); }
    const cost = g.price * num;
    if (getScore(F.SCORE_FAMILY) < cost) { log(`[shop] 结社积分不足：需 ${cost} 有 ${getScore(F.SCORE_FAMILY)}`); return reply(); }
    const tx = familyTxSnapshot();
    addScore(conn, F.SCORE_FAMILY, -cost);
    st.shopBought[gid] = bought + num;
    let changed;
    try {
      changed = L.grantGoods(g.type_id, g.num * num, conn);
    } catch (e) {
      restoreFamilyTx(tx);
      log(`[shop] 结社兑换发奖失败，已回滚积分与次数：${e.message}`);
      return reply();
    }
    saveState();
    if (changed.length) L.pushGoodsUpdate(conn, changed, 3);
    conn.sendToc('m_shop_buy_toc', { shop_id: shopId, id: gid, num, opt: Number(obj && obj.opt) || 0 });
    log(`[shop] 结社兑换 ${F.itemName(g.type_id)}×${g.num * num}，扣贡献 ${cost} → 余 ${getScore(F.SCORE_FAMILY)}`);
    return;
  }
  if (shopId === F.RENAME_SHOP.shopId && gid === F.RENAME_SHOP.goodsId) {
    let cost = F.RENAME_SHOP.gold * num;
    if (S.roleAsset.gold + S.roleAsset.gold_given < cost) { log('[shop] 水晶不足，买不了改名卡'); return reply(); }
    const tx = familyTxSnapshot();
    const useGiven = Math.min(S.roleAsset.gold_given, cost);
    S.roleAsset.gold_given -= useGiven; cost -= useGiven;
    S.roleAsset.gold -= cost;
    let changed;
    try {
      changed = L.grantGoods(F.RENAME_CARD, num, conn);
    } catch (e) {
      restoreFamilyTx(tx);
      log(`[shop] 结社改名卡发放失败，已回滚水晶：${e.message}`);
      return reply();
    }
    saveState();
    L.pushAssetChange(conn);
    if (changed.length) L.pushGoodsUpdate(conn, changed, 3);
    conn.sendToc('m_shop_buy_toc', { shop_id: shopId, id: gid, num, opt: 0 });
    log(`[shop] 购买结社改名卡×${num}，扣水晶 ${F.RENAME_SHOP.gold * num}`);
    return;
  }
  log(`[shop] 未实现的商店 shop=${shopId} id=${gid}`);
  reply();
},
};

module.exports = {
  handlers,
  onLogin, pushFamilyInfo, pushMembers, pushChatRoom, addContribution, checkFamilyReset,
  hasFamily, shopDetailP, shopItemP, addFamilyExp, allMembers, memberP, avatarOf,
};
