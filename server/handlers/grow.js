// 御灵士（Grow，协会"养成"入口）：星图（astrolabe）+ 化身装扮（costume）。
// 客户端真相源：tools/lua_src/Modules/Grow/*（GrowModule/GrowMgr/GrowServantStarItem/GrowCostumeView…），
// 协议 schema：tools/key_lua/Proto.lua 的 m_*astrolabe* / m_*costume* / m_*wardrobe* 段。
//
// 入口与解锁：协会选择面板"养成"banner（CfgDorm.choiceInfo Banner04）+ 主界面御灵士按钮
// （MainPlayerBackIndexItem.toDorm，主线第二章起）。打开主面板必发 m_role_astrolabe_info_tos；
// 化身数据只在登录时由服务端推 m_role_costume_toc（客户端 m_role_costume_tos 定义了但无人调用）——
// 未创建（S.growState.costume==null）时不推，客户端走创建面板（GrowCreatePanel → m_costume_init_tos）。
//
// 星图消耗数值是服务端权威：客户端"升级需要：X"读 m_astrolabe_config_toc.next_exp /
// m_astrolabe_level_up_star_toc.need（GrowServantStarItem.updateDes），配置表见 data/grow_data.js。
// 星云点入账：战斗结算按誓灵实得经验 1/750 转化（每周上限 1000），见 gainNebula（map_fight.js 调用）。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log } = L;
const GD = require('../data/grow_data');

// partGroups isUndress（CfgAvatar.partGroups）：false=部位必穿不可脱（客户端也会拦，服务端同口径拒绝）
const UNDRESSABLE = new Set([1, 2, 6, 8, 9]); // 帽子/脸饰/头饰/背饰/尾巴
// 姿态动画解锁星图（CfgAvatar.animations[].animations[].star；1=默认解锁，9/10=站姿节点）
const MOTION_STAR = { 1: 1, 2: 1, 3: 1 }; // [102=stand02 → star9, 103=stand03 → star10] 在 motionOf 里判
function motionStarOf(motion) {
  const pose = Math.floor(motion / 100), idx = motion % 100;
  if (pose === 1 && idx === 2) return 9;  // 叉会腰
  if (pose === 1 && idx === 3) return 10; // 招手
  return 1;
}

function st() {
  if (!S.growState) {
    S.growState = { stars: {}, exp: 0, weekExp: 0, weekKey: '', expFloat: 0, costume: null, seen: {} };
  }
  const g = S.growState;
  if (!g.stars) g.stars = {};
  if (!g.seen) g.seen = {};
  checkWeek(g);
  return g;
}

function mondayKey() {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // 本周一
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function checkWeek(g) {
  if (g.weekKey !== mondayKey()) { g.weekKey = mondayKey(); g.weekExp = 0; }
}

// ---- 星图等级查询（宿主模块效果接入点：vit.js/lib.js/dorm.js/map_fight.js）----
function starLv(id) { return Number(st().stars[id]) || 0; }

// 星图节点是否可升（前置"或"关系，见 grow_data.js STARS 注释）
function starUnlocked(id) {
  const def = GD.STAR_BY_ID[id];
  if (!def) return false;
  if (!def.front.length) return true;
  return def.front.some(f => starLv(f) > 0);
}
// 下一级消耗：普通节点满级=0；无限节点（maxLv=0）恒为固定值
function nextCostOf(id) {
  const def = GD.STAR_BY_ID[id];
  if (!def) return 0;
  const lv = starLv(id);
  if (def.maxLv === 0) return def.cost;
  return lv >= def.maxLv ? 0 : def.cost[lv];
}

function pushAstrolabeInfo(conn) {
  const g = st();
  conn.sendToc('m_role_astrolabe_info_toc', {
    exp: g.exp, week_exp: g.weekExp,
    stars: Object.keys(g.stars).map(k => ({ id: Number(k), val: g.stars[k] })),
    exp_limit: GD.WEEK_LIMIT,
  });
}

// 化身数据 → p_costume / m_role_costume_toc 形状
function costumePayload(g) {
  const c = g.costume;
  if (!c) return { sex: 1, motion: [], suit: [] };
  const suit = [];
  for (const [pt, typeId] of Object.entries(c.wear)) {
    const dyes = c.dyes[typeId] || {};
    suit.push({ id: typeId, parts: Object.keys(dyes).map(d => ({ id: Number(d), val: dyes[d] })) });
  }
  return { sex: c.sex, motion: c.motion.slice(), suit };
}

function pushCostume(conn) {
  conn.sendToc('m_role_costume_toc', costumePayload(st()));
}

// 登录推送（role.js m_role_detail_tos 挂载）：化身数据 + 星图快照。
// 未创建化身时不推 costume——客户端 isInitAvatar=false，主面板盖 mask 走创建流程。
function onLogin(conn) {
  if (st().costume) pushCostume(conn);
  pushAstrolabeInfo(conn);
}

// 拥有部件（按 type_id）：全部走背包（创建赠礼/福袋/商城统一 grantGoods 入包）
function ownedPartIds(partType) {
  const set = new Set();
  for (const g of S.bagGoods) {
    const t = Number(g.type_id);
    if (t >= 46100000 && t < 46200000 && Math.floor(t / 1000) % 100 === partType) set.add(t);
  }
  return [...set].sort((a, b) => a - b);
}
function ownedPartCount(typeId) {
  const g = S.bagGoods.find(x => Number(x.type_id) === Number(typeId));
  return g ? Number(g.cur_num) : 0;
}

// 星云点入账：expSum=当次战斗所有誓灵实得经验合计，1/750 转化（小数累积防恒 0），周上限截断。
// 结算面板不展示星云点，客户端下次打开星图时拉取——这里主动推一次保持多端一致。
function gainNebula(conn, expSum) {
  const g = st();
  g.expFloat = Number(g.expFloat || 0) + Math.max(0, Number(expSum) || 0) / GD.NEBULA_DIV;
  let gain = Math.floor(g.expFloat);
  if (gain <= 0) return 0;
  g.expFloat -= gain;
  const real = Math.min(gain, Math.max(0, GD.WEEK_LIMIT - g.weekExp));
  if (real <= 0) { log(`[grow] 星云点 ${gain} 被周上限截断（本周已 ${g.weekExp}/${GD.WEEK_LIMIT}）`); return 0; }
  g.exp += real; g.weekExp += real;
  saveState();
  if (conn) pushAstrolabeInfo(conn);
  log(`[grow] 星云点 +${real}（经验 ${expSum}/${GD.NEBULA_DIV}，余 ${g.exp}，本周 ${g.weekExp}/${GD.WEEK_LIMIT}）`);
  return real;
}

// 发奖统一出口：入包 + type=3 数据包 + type=1 弹窗包（奖励弹窗载体，工作日志（四十二）/（四十三）教训）
// ⚠️ 2026-10-14（一百七十九）：type=1 弹窗包的 cur_num 必须是【本次获得量】——客户端
// BagModule.m_goods_update_toc 的 GOODS_OP_NEW 分支把它原样塞进 BagGetItemVO 显示在
// "获得道具"弹窗上；传背包全量对象会把"仓库总量"当获得量显示（grantMissionRewards 同坑已修）。
function grantAndPush(conn, typeId, num) {
  const changed = L.grantGoods(typeId, num, conn);
  if (changed.length) {
    L.pushGoodsUpdate(conn, changed, 3);
    L.pushGoodsUpdate(conn, changed.map(g => ({ id: g.id, type_id: g.type_id, cur_num: Number(num) || 1, bag_type: g.bag_type })), 1);
  }
  return changed;
}

// 升级特殊节点的一次性产出（福袋/随机染剂/魔术箱）。返回描述（进日志）
function grantStarReward(conn, id) {
  if (id >= 4 && id <= 8) { // 装扮福袋：1 个不重复的初始部件（拥有判定按 type_id）
    const have = new Set(S.bagGoods.map(g => Number(g.type_id)));
    const pool = GD.INIT_PARTS.filter(t => !have.has(t));
    const pick = pool.length ? pool[Math.floor(Math.random() * pool.length)]
      : GD.INIT_PARTS[Math.floor(Math.random() * GD.INIT_PARTS.length)];
    grantAndPush(conn, pick, 1);
    return `福袋部件 ${pick}`;
  }
  if (id === 11) { grantAndPush(conn, GD.RANDOM_DYE_ITEM, 1); return '随机染剂'; }
  if (id === 46) { // 魔术箱：加权随机
    const total = GD.MAGIC_BOX_POOL.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    let pick = GD.MAGIC_BOX_POOL[0];
    for (const it of GD.MAGIC_BOX_POOL) { r -= it.w; if (r <= 0) { pick = it; break; } }
    if (pick.kind === 'silver') {
      S.roleAsset.silver = (Number(S.roleAsset.silver) || 0) + pick.min + Math.floor(Math.random() * (pick.max - pick.min + 1));
      L.pushAssetChange(conn);
      return `金币 ${pick.min}+`;
    }
    const n = pick.min + Math.floor(Math.random() * (pick.max - pick.min + 1));
    grantAndPush(conn, pick.type_id, n);
    return `道具 ${pick.type_id}×${n}`;
  }
  return null;
}

const handlers = {
// ---- 星图（astrolabe）----
m_role_astrolabe_info_tos(conn) {
  pushAstrolabeInfo(conn);
},

// 节点详情：next_exp=下一级消耗（客户端 btnUp 可点判定 + "升级需要：X"文案），goods 附带展示数据
m_astrolabe_config_tos(conn, obj) {
  const id = Number(obj && obj.id);
  if (!GD.STAR_BY_ID[id]) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  conn.sendToc('m_astrolabe_config_toc', { id, next_exp: nextCostOf(id), goods: [] });
},

m_astrolabe_level_up_star_tos(conn, obj) {
  const id = Number(obj && obj.id);
  const def = GD.STAR_BY_ID[id];
  const reply = () => conn.sendToc('m_common_reply_toc', { proto_id: 0 });
  if (!def) { reply(); return; }
  const g = st();
  const lv = starLv(id);
  if (def.maxLv > 0 && lv >= def.maxLv) { log(`[grow] 升级被拒：节点 ${id} 已满级`); reply(); return; }
  if (!starUnlocked(id)) { log(`[grow] 升级被拒：节点 ${id} 前置未解锁`); reply(); return; }
  const cost = nextCostOf(id);
  if (g.exp < cost) { log(`[grow] 升级被拒：星云点不足（需 ${cost} 有 ${g.exp}）`); reply(); return; }
  g.exp -= cost;
  g.stars[id] = lv + 1;
  const reward = grantStarReward(conn, id);
  saveState();
  conn.sendToc('m_astrolabe_level_up_star_toc', { id, lv: starLv(id), exp: g.exp, need: nextCostOf(id) });
  log(`[grow] 星图节点 ${id}(${def.name}) → Lv${starLv(id)}，星云点 -${cost} 余 ${g.exp}${reward ? `，产出 ${reward}` : ''}`);
  // 基建节点实时刷新宿主显示：主角上限（36/37）直接重推；背包/研究所/派遣由宿主下次读取生效
  if ([32, 33, 34, 35, 36, 37].includes(id)) require('./vit').pushLimit(conn);
},

// ---- 化身装扮（costume）----
// 客户端无主动调用点（GrowModule.m_role_costume_tos 定义未使用），登录时服务端主动推（onLogin）
m_role_costume_tos(conn) {
  pushCostume(conn);
},

// 创建化身（GrowCreatePanel 确认）：赠初始部件全集 + 落穿戴 + 染色记录（suit[].val>0）
m_costume_init_tos(conn, obj) {
  const g = st();
  const sex = Number(obj && obj.sex) === 2 ? 2 : 1;
  const motion = Array.isArray(obj && obj.motion) && obj.motion.length ? obj.motion.map(Number).slice(0, 3) : [101, 201, 301];
  const wear = {}, dyes = {};
  for (const it of ((obj && obj.suit) || [])) {
    const typeId = Number(it && it.id);
    const pt = Math.floor(typeId / 1000) % 100;
    if (pt < 1 || pt > 10) continue;
    wear[pt] = typeId;
    const val = Number(it && it.val) || 0;
    if (val > 0) dyes[typeId] = { 1: val }; // 创建面板染色只涉及"整体"区（dyeID=1）
  }
  const have = new Set(S.bagGoods.map(x => Number(x.type_id)));
  const granted = GD.INIT_PARTS.filter(t => !have.has(t));
  const changed = [];
  for (const t of granted) changed.push(...L.grantGoods(t, 1, conn));
  if (changed.length) L.pushGoodsUpdate(conn, changed, 3);
  g.costume = { sex, motion, wear, dyes };
  saveState();
  // costume 必须发**单个 p_costume 对象**（etf encodeNested 走 104 tuple）：客户端
  // m_costume_init_toc → GrowMgr.initAvatar(slot0.costume) → AvatarVO.init 直接读
  // .sex/.motion/.suit——发 LIST 数组会让 initAvatar 拿到数组，ipairs(motion=nil) 崩
  //（真机 2026-09-06 实证），且半初始化 VO.sex=nil 会连锁污染下一次 m_costume_init_tos 的
  // WriteInt。m_role_costume_toc 无此问题（它传整个 toc 对象）。
  conn.sendToc('m_costume_init_toc', { costume: costumePayload(g) });
  log(`[grow] 创建化身 sex=${sex} wear={${Object.entries(wear).map(([k, v]) => k + ':' + v).join(',')}} 初始部件 +${granted.length}`);
},

// 衣柜：partType 下拥有部件 + 染色记录（view=未查看标记，客户端 isNew）
m_role_wardrobe_info_tos(conn, obj) {
  const id = Number(obj && obj.id);
  if (id < 1 || id > 10) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const g = st();
  const clothes = ownedPartIds(id).map(typeId => {
    const dyes = (g.costume && g.costume.dyes[typeId]) || {};
    return {
      id: typeId,
      view: g.seen[typeId] ? 1 : 0,
      parts: Object.keys(dyes).map(d => ({ id: Number(d), val: dyes[d] })),
    };
  });
  conn.sendToc('m_role_wardrobe_info_toc', { id, clothes });
  log(`[grow] 衣柜 partType=${id} → ${clothes.length} 件`);
},

// 穿戴：客户端 onPartSelect 已判"未穿戴才发"，服务端校验拥有后落 wear
m_wear_costume_tos(conn, obj) {
  const g = st();
  if (!g.costume) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const typeId = Number(obj && obj.id);
  if (ownedPartCount(typeId) <= 0) { log(`[grow] 穿戴被拒：未拥有 ${typeId}`); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const pt = Math.floor(typeId / 1000) % 100;
  g.costume.wear[pt] = typeId;
  saveState();
  conn.sendToc('m_wear_costume_toc', { id: typeId });
  log(`[grow] 穿戴 ${typeId}（partType=${pt}）`);
},

// 脱下：isUndress=false 的部位拒绝（眉毛/眼睛/嘴巴/衣服/发型）
m_un_wear_costume_tos(conn, obj) {
  const g = st();
  if (!g.costume) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const typeId = Number(obj && obj.id);
  const pt = Math.floor(typeId / 1000) % 100;
  if (!UNDRESSABLE.has(pt)) { log(`[grow] 脱下被拒：partType=${pt} 不可脱`); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  delete g.costume.wear[pt];
  saveState();
  conn.sendToc('m_un_wear_costume_toc', { id: typeId });
  log(`[grow] 脱下 partType=${pt}`);
},

// 性别转变（2000 金币，客户端 switchSex 弹窗确认后发送）
m_change_sex_tos(conn, obj) {
  const g = st();
  if (!g.costume) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const sex = Number(obj && obj.sex) === 2 ? 2 : 1;
  if (sex !== g.costume.sex && (Number(S.roleAsset.silver) || 0) < GD.CHANGE_SEX_COST) {
    log(`[grow] 性别转变被拒：金币不足（需 ${GD.CHANGE_SEX_COST}）`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return;
  }
  if (sex !== g.costume.sex) {
    S.roleAsset.silver -= GD.CHANGE_SEX_COST;
    L.pushAssetChange(conn);
  }
  g.costume.sex = sex;
  saveState();
  conn.sendToc('m_change_sex_toc', { sex });
  log(`[grow] 性别 → ${sex === 2 ? '女' : '男'}`);
},

// 姿态：motion = pose*100 + 序号（101 站立 / 102 叉会腰[星图9] / 103 招手[星图10] / 201 / 301）
m_change_motion_tos(conn, obj) {
  const g = st();
  if (!g.costume) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const motion = Number(obj && obj.motion) || 0;
  const pose = Math.floor(motion / 100), idx = motion % 100;
  if (pose < 1 || pose > 3 || idx < 1 || idx > 3) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const needStar = motionStarOf(motion);
  if (starLv(needStar) <= 0) { log(`[grow] 姿态被拒：需星图节点 ${needStar}`); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  g.costume.motion[pose - 1] = motion;
  saveState();
  conn.sendToc('m_change_motion_toc', { motion: g.costume.motion.slice() });
  log(`[grow] 姿态 → ${motion}`);
},

// 染剂库存（背包 64000001~8 数量）
m_costume_dye_info_tos(conn) {
  const dye = [];
  for (let t = 64000001; t <= 64000008; t++) {
    const n = ownedPartCount(t);
    if (n > 0) dye.push({ id: t, val: n });
  }
  conn.sendToc('m_costume_dye_info_toc', { dye });
},

// 染色：dye=染剂 typeID（64000001=随机色 2~8；0=重置为默认色，免费）。
// suit=[p_kvl{id:部件typeID, list:[染色区dyeID…]}]，按区数扣染剂。
// 回 suit=[p_suit{id, parts:[{id:dyeID, val:colorIdx}]}]——客户端 setDyeColors 逐部件刷新。
m_costume_dye_tos(conn, obj) {
  const g = st();
  if (!g.costume) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const dyeItem = Number(obj && obj.dye) || 0;
  const req = Array.isArray(obj && obj.suit) ? obj.suit : [];
  if (!req.length) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const zones = req.reduce((s, x) => s + (((x && x.list) || []).length || 1), 0);
  if (dyeItem > 0) {
    if (ownedPartCount(dyeItem) < zones) {
      log(`[grow] 染色被拒：染剂 ${dyeItem} 不足（需 ${zones}）`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return;
    }
    const gg = S.bagGoods.find(x => Number(x.type_id) === dyeItem);
    gg.cur_num -= zones;
    const empty = gg.cur_num <= 0;
    if (empty) S.bagGoods = S.bagGoods.filter(x => x !== gg);
    L.pushGoodsUpdate(conn, [gg], empty ? 2 : 3); // DEL 也带 goods(id) 供客户端 delGoods（同 vit.js 口径）
  }
  const colorIdx = dyeItem === 0 ? 0
    : (dyeItem === GD.RANDOM_DYE_ITEM ? GD.DYE_RANDOM_COLORS[Math.floor(Math.random() * GD.DYE_RANDOM_COLORS.length)]
      : GD.DYE_ITEM_TO_COLOR[dyeItem] || 0);
  const suit = [];
  for (const it of req) {
    const typeId = Number(it && it.id);
    const list = Array.isArray(it && it.list) && it.list.length ? it.list.map(Number) : [1];
    const rec = g.costume.dyes[typeId] || (g.costume.dyes[typeId] = {});
    const parts = [];
    for (const zone of list) {
      if (colorIdx > 0) rec[zone] = colorIdx; else delete rec[zone];
      parts.push({ id: zone, val: colorIdx });
    }
    suit.push({ id: typeId, parts });
  }
  saveState();
  conn.sendToc('m_costume_dye_toc', { suit });
  log(`[grow] 染色 ${dyeItem === 0 ? '重置' : `染剂 ${dyeItem}×${zones}`} → ${suit.map(s => s.id).join(',')} 色=${colorIdx}`);
},
};

module.exports = { handlers, onLogin, starLv, gainNebula, pushAstrolabeInfo, pushCostume, nextCostOf, starUnlocked };
