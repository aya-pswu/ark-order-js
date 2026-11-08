// 信仰（Faith）系统 —— 装备 / 卸下 / 升级 / 洗练 / 分解 / 召唤 / 方案
//
// 客户端数据流实证（tools/lua_src 反编译，真机在跑的是 tools/lua_remote 同版）：
// - 装备态在誓灵字段上：p_servant_detail.faith / p_team_servant.faith = array p_kvi，
//   **id = 槽位 pos(1..9)、val = 物品 gid**（ServantConfigVO.initByDetail 走
//   table.toDic(faith,"id","val") 建 faithDic，再 initFaithMap → 9 格棋盘）。
//   ServantModule 分派：team_id == 0 → 改誓灵本体（ServantMgr.getServant）；
//   team_id != 0 → 改该编队的 FormationServantVO（FormationMgr.getNewFormationServantVO）。
// - 信仰实例数据在物品上：p_goods.spec_data（p_goods_faith：level / exp / color[{id:1..4, val:颜色}]）。
//   **spec_data 声明是 array binary，客户端按单个嵌套对象读**（FaithVO.setDbInfo 读 .level/.exp、
//   pairs(.color) 取 {id,val}）→ 必须用 __nestedProto 编成嵌套对象（见 lib.goodsPGoods）。
//   缺 spec_data：lv 恒 0（面板 Lv 0/5）、四边颜色全 0（无任何链接加成）。
// - 9 格棋盘 pos 1..9（3×3 行优先）+ 四角绕回（ServantConst.FAITH_LINK/FAITH_LINK_AROUND）、
//   pos5 为中心无属性限制（FAITH_POS_ATTR）——同色相邻成"链接"，n 条 → 该色属性 ×(1+0.03n)。
// - 升/降级：m_faith_upgrade_tos{id, opt}，opt=1 升 1 级、opt=2 一键升到满(按顺序连升，
//   受信仰灵光 material 限制)；消耗 GameConst.SCORE_FAITH_EXP=23「信仰灵光」
//   （升级面板 lblHasExp = GlobalData.getScore(23)）。toc 带 old_level 供客户端弹"升级成功"提示。
// - 洗练：m_faith_refresh_tos{id, item_id(消耗的信仰 gid), border(要刷的边 0..3), color}；
//   消耗**同属性同品质**信仰，新颜色必定与旧值不同（面板 tips 明写），
//   被消耗的信仰返还其投入的信仰灵光。
// - 分解返还 = colorInfo.decomposeExp + Σ_{i=1}^{lv-1} lvInfo[i].exp + 当前 exp（FaithVO.getDecomposeExp）。
//   客户端开关"已装备的信仰不占用容量"（ServantFaithBagView）→ 已装备的分解应跳过。
// - 召唤：CfgFaith.cost=1000 银币/抽；每抽消耗 1 张许愿卡 31000023，
//   抵扣券 31000024 每张抵 1000 银币（最多 times 张）；信仰背包满须拒（客户端自己也会先拦）。
// - 方案（plan）：p_faith_plan{id, name, detail=array p_kvi(pos→gid)}；32 条（官方终版口径，MAX_PLAN）。
//   plan_update_toc.update 的 p_kvt 是 **{id=方案id, val=pos, type=gid}**（ServantMgr.updateFaithPlanPosItem）。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log, defaultFill, pushGoodsUpdate, pushAssetChange, grantGoods, goodsPGoods } = L;
const FD = require('../data/faith_data');

const goodsOfGid = gid => S.bagGoods.find(x => Number(x.id) === Number(gid));

// ---- p_goods.servant_ids 打包（与 handlers/relic.js 同口径）----
const packedServantIds = gids => gids.map(gid => {
  const owners = L.equipOwnersOfGid(gid);
  return owners.map(sid => BigInt(sid) * 100000n);
}).flat();
function pushGoodsEquip(conn, gid) {
  conn.sendToc('m_goods_equip_toc', {
    goods_id: Number(gid),
    equip_servants: packedServantIds([gid]),
  });
}

// ---- 信仰装备槽读写 ----
// 套装归属唯一口径 = FD.faithSlotsOf：
//   teamId ∈ {0..4}（详情页 / 老编队）→ 誓灵本体套装 b.faiths；
//   teamId >= 501（新编队 501~534 自由编队 / 551~560 唤灵殿堂+信仰对决）→ b.faithTeams[teamId]。
// ⚠️ 旧实现在此用 `tid === 0 ? faiths : faithTeams[tid]`，与 map_fight 读套装的口径分叉，
//    导致"详情页装备、主线战斗读到空套装"（加成恒 0）。见 调研-信仰.md §3.1。
function slotsOf(b, teamId, create) {
  const tid = Number(teamId) || 0;
  if (tid >= FD.NEW_FORMATION_MIN) {
    if (!b.faithTeams) b.faithTeams = {};
    if (!b.faithTeams[tid] && create) b.faithTeams[tid] = {};
    return b.faithTeams[tid] || {};
  }
  if (!b.faiths && create) b.faiths = {};
  return b.faiths || {};
}
// 依赖 b.faiths/b.faithTeams（loadState 已补默认，此处再兜一层防 GM/测试直接构造）
function servantOf(sid) {
  const b = S.servants.find(s => s.id === Number(sid));
  if (b) { if (!b.faiths) b.faiths = {}; if (!b.faithTeams) b.faithTeams = {}; }
  return b;
}

// 某 gid 当前装在谁身上、哪个槽（跨本体/编队套装全局唯一持有人）
function findHolder(gid) {
  for (const b of S.servants) {
    for (const [pos, g] of Object.entries(b.faiths || {})) {
      if (Number(g) === Number(gid)) return { sid: b.id, teamId: 0, pos: Number(pos) };
    }
    for (const [tid, slots] of Object.entries(b.faithTeams || {})) {
      for (const [pos, g] of Object.entries(slots || {})) {
        if (Number(g) === Number(gid)) return { sid: b.id, teamId: Number(tid), pos: Number(pos) };
      }
    }
  }
  return null;
}
// 把某 gid 从所有人身上摘掉（返回受影响的 gid 之外的誓灵+队伍，供回包/推送）
function stripGid(gid) {
  const hit = [];
  for (const b of S.servants) {
    for (const [pos, g] of Object.entries(b.faiths || {})) {
      if (Number(g) === Number(gid)) { delete b.faiths[pos]; hit.push({ sid: b.id, teamId: 0 }); }
    }
    for (const [tid, slots] of Object.entries(b.faithTeams || {})) {
      for (const [pos, g] of Object.entries(slots || {})) {
        if (Number(g) === Number(gid)) { delete slots[pos]; hit.push({ sid: b.id, teamId: Number(tid) }); }
      }
    }
  }
  return hit;
}
const isEquippedAnywhere = gid => !!findHolder(gid);

// m_faith_equip_info_toc {servant_id, team_id, faiths}：某誓灵某队的完整配装（客户端 initFaithMap）
//
// ⚠️ 必须带"该编队 VO 在客户端确实存在"这道闸（2026-10-23 调研 §3.7）：
//    客户端 m_faith_equip_info_toc 的写法是
//      slot1 = team_id ~= 0 and FormationMgr.getNewFormationServantVO(team_id, servant_id)
//              or ServantMgr.getServant(servant_id)
//    Lua 的 `a and b or c` 在 **b 为 nil 时退化成 c**。
//    ① 老编队 1~4：`getNewFormationServantVO` 只认新编队（501+）的字典 → 恒 nil → **必然**回退到
//       本体 VO，而本体 VO 正是老编队读取的套装（faithSlotsOf 同口径）⇒ 推 team_id=1~4 安全。
//    ② 新编队 501+：VO 存在时正常写编队副本；**不存在时会被写到本体 VO**（详情页 9 格显示成编队套装）。
//       ⇒ 只在 S.formations[teamId] 的 field/bench 里确实有这名誓灵时才推
//         （此时客户端必然有该 VO——卡片就是用同一份数据渲染的）。
function pushEquipInfo(conn, sid, teamId) {
  const b = servantOf(sid);
  if (!b) return;
  const tid = Number(teamId) || 0;
  if (tid >= FD.NEW_FORMATION_MIN) {
    const f = S.formations && S.formations[tid];
    const inTeam = !!f && ['field', 'bench', 'fight_field', 'fight_bench'].some(k =>
      Array.isArray(f[k]) && f[k].some(id => Number(id) === Number(sid)));
    if (!inTeam) {
      log(`[faith] 跳过 equip_info（新编队 ${tid} 里没有誓灵 ${sid}，推了会污染本体 VO）`);
      return;
    }
  }
  conn.sendToc('m_faith_equip_info_toc', {
    servant_id: Number(sid),
    team_id: tid,
    faiths: L.faithFieldsOf(b, tid).faith,
  });
}

// ---- 信仰背包容量（已装备的不占容量，与客户端文案一致）----
function faithFreeSlots() {
  const equipped = new Set();
  for (const b of S.servants) {
    Object.values(b.faiths || {}).forEach(g => equipped.add(Number(g)));
    Object.values(b.faithTeams || {}).forEach(t => Object.values(t || {}).forEach(g => equipped.add(Number(g))));
  }
  const used = S.bagGoods.filter(x => Number(x.bag_type) === 7 && !equipped.has(Number(x.id))).length;
  return Math.max(0, L.bagSizeOf(7) - used);
}

// ---- 方案（plan）----
function plans() {
  if (!S.faithState) S.faithState = { plans: [] };
  if (!Array.isArray(S.faithState.plans)) S.faithState.plans = [];
  // 懒初始化 3 条空方案（客户端无硬编码条数，但 int 语义要求 id 从 1 起连续）
  if (S.faithState.plans.length < FD.MAX_PLAN) {
    const have = new Set(S.faithState.plans.map(p => Number(p.id)));
    for (let i = 1; i <= FD.MAX_PLAN; i++) {
      if (!have.has(i)) S.faithState.plans.push({ id: i, name: `方案${i}`, detail: [] });
    }
    S.faithState.plans.sort((a, b) => a.id - b.id);
    S.faithState.plans.forEach(p => { if (!Array.isArray(p.detail)) p.detail = []; });
  }
  return S.faithState.plans;
}
function planOf(id) {
  const list = plans();
  return list.find(p => Number(p.id) === Number(id)) || null;
}
function planP(p) {
  return { id: Number(p.id), name: String(p.name || `方案${p.id}`), detail: (p.detail || []).map(d => ({ id: Number(d.id), val: Number(d.val) })) };
}

// 升级/降级落账：灵光（score 23）增减 + 信仰本身 level/exp
function pushFaithGoods(conn, g) { pushGoodsUpdate(conn, [g], 3); }

module.exports = {
  handlers: {
// ===================== 装备 / 卸下 =====================
// m_faith_equip_tos {id(信仰 gid), servant_id, pos(1..9), team_id}
m_faith_equip_tos(conn, obj) {
  const gid = Number((obj && obj.id) || 0);
  const sid = Number((obj && obj.servant_id) || 0);
  const pos = Number((obj && obj.pos) || 0);
  const teamId = Number((obj && obj.team_id) || 0);
  const b = servantOf(sid);
  const g = goodsOfGid(gid);
  // 异常一律不直接回 toc（客户端 m_faith_equip_toc 会去 getServant/faithDic 索引 → 崩）
  if (!b || !g || !FD.isFaithType(g.type_id) || pos < 1 || pos > 9) {
    log(`[faith] 装备被拒 servant=${sid} goods=${gid} pos=${pos} team=${teamId}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  // 槽位属性限制（FAITH_POS_ATTR；pos5=0 无限制）。客户端背包会按槽位过滤，这里是服务端兜底
  const info = FD.infoOfType(g.type_id);
  if (!FD.posAllowsProp(pos, info.prop)) {
    log(`[faith] 装备被拒（槽位属性不符）pos=${pos} prop=${info.prop}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  const slots = slotsOf(b, teamId, true);
  const old = Number(slots[pos]) || 0;
  const touched = [];
  if (old && old !== gid) touched.push(old);              // 被顶掉的信仰 → 变未装备
  stripGid(gid);                                          // 全局唯一持有人兜底
  slots[pos] = gid;
  touched.push(gid);
  saveState();
  // 回包（客户端 updateFaith(id=pos→gid, pos)）：id=信仰 gid、pos=槽位
  conn.sendToc('m_faith_equip_toc', {
    id: gid, servant_id: sid, pos, team_id: teamId,
    line: [], // p_kvi 数组字段：留空数组（客户端 onEquipChange 会本地重算链接）
  });
  // 同步该誓灵该队的完整配装（面板/详情即时刷新）
  pushEquipInfo(conn, sid, teamId);
  for (const g2 of [...new Set(touched)]) pushGoodsEquip(conn, g2);
  log(`[faith] 装备 servant=${sid} pos=${pos} goods=${gid} type=${g.type_id} team=${teamId}`);
},
// m_faith_unload_tos {id(信仰 gid), team_id} —— **不带 servant_id**，必须反查持有人并回填
m_faith_unload_tos(conn, obj) {
  const gid = Number((obj && obj.id) || 0);
  const teamId = Number((obj && obj.team_id) || 0);
  const holder = findHolder(gid);
  if (!holder) {
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  const b = servantOf(holder.sid);
  if (b) delete slotsOf(b, holder.teamId, true)[holder.pos];
  saveState();
  conn.sendToc('m_faith_unload_toc', {
    id: gid, servant_id: holder.sid, pos: holder.pos, team_id: holder.teamId, line: [],
  });
  if (goodsOfGid(gid)) pushGoodsEquip(conn, gid);
  log(`[faith] 卸下 goods=${gid} servant=${holder.sid} pos=${holder.pos} team=${holder.teamId}（请求 team=${teamId}）`);
},
// m_faith_unload_all_tos {servant_id, team_id}
m_faith_unload_all_tos(conn, obj) {
  const sid = Number((obj && obj.servant_id) || 0);
  const teamId = Number((obj && obj.team_id) || 0);
  const b = servantOf(sid);
  if (!b) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const slots = slotsOf(b, teamId, true);
  const removed = Object.values(slots).map(Number).filter(n => n > 0);
  for (const pos of Object.keys(slots)) delete slots[pos];
  saveState();
  conn.sendToc('m_faith_unload_all_toc', { servant_id: sid, team_id: teamId });
  for (const g of removed) pushGoodsEquip(conn, g);
  log(`[faith] 全卸 servant=${sid} team=${teamId} 共 ${removed.length} 个`);
},
// ===================== 升级 =====================
// m_faith_upgrade_tos {id(信仰 gid), opt}：opt=1 升 1 级；opt=2 一键连升（受灵光数量限制）
m_faith_upgrade_tos(conn, obj) {
  const gid = Number((obj && obj.id) || 0);
  const opt = Number((obj && obj.opt) || 1);
  const g = goodsOfGid(gid);
  if (!g || !FD.isFaithType(g.type_id)) {
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  const info = FD.infoOfType(g.type_id);
  const oldLevel = Number(g.level) || 1;
  let lv = oldLevel;
  let exp = Number(g.exp) || 0;
  const maxLv = info.maxLv;
  const steps = opt === 2 ? 99 : 1; // opt=2 = 一键（客户端"全部升级"按钮）
  let gained = 0;
  for (let i = 0; i < steps && lv < maxLv; i++) {
    const need = FD.needExpOf(lv, info.color);
    if (need <= 0) break;
    const have = L.getScore(FD.SCORE_FAITH_EXP) - gained;
    if (have < need) break;               // 灵光不足：停在当前级（已升的级保留）
    gained += need;
    lv += 1;
    exp = 0;
  }
  if (gained > 0) {
    L.addScore(conn, FD.SCORE_FAITH_EXP, -gained);
    g.level = lv;
    g.exp = exp;
    saveState();
    pushFaithGoods(conn, g);
    log(`[faith] 升级 goods=${gid} Lv${oldLevel}→${lv} 消耗灵光 ${gained}（剩余 ${L.getScore(FD.SCORE_FAITH_EXP)}）`);
  } else {
    log(`[faith] 升级未生效 goods=${gid} lv=${lv}/${maxLv} 灵光=${L.getScore(FD.SCORE_FAITH_EXP)}（需要 ${FD.needExpOf(lv, info.color)}）`);
  }
  // toc：old_level 与 level 不同时客户端弹"升级成功,信仰从X级提升到Y级"；exp = 升级后当前经验
  conn.sendToc('m_faith_upgrade_toc', { id: gid, level: lv, exp, old_level: oldLevel });
},
// ===================== 洗练（刷新四周颜色）=====================
// m_faith_refresh_tos {id(目标 gid), item_id(材料 gid：信仰 或 通用型信仰 31000025/26),
//                     border(1..4), color}
// 材料两态：信仰=同属性同品质+整件消耗+返灵光；通用型信仰=品质配对+堆叠扣1+不返灵光。
//
// ⚠️ border 是 **1~4**（第几条边），不是 0-based 下标。客户端证据（真机字节码）：
//   · ServantFaithRefreshPanel.onGUI 用 `ipairs(sideColor)` 遍历 spSideMark1..4（边号 1..4）；
//   · 同函数 `btnRefresh.IsEnabled = tab.SelectIndex ~= 0` ⇒ **0 是"未选择"哨兵**，
//     只有选中 1..4 才允许点刷新；`onClickBtnRefresh` 把 `tab.SelectIndex` 原样作为第 3 参发出。
//   旧实现接受 0..3 并写 `sc[border]`（0-based）⇒ 传 1 会刷到第 **2** 条边、传 4 直接判非法。
//   见 调研-信仰.md §3.5。
m_faith_refresh_tos(conn, obj) {
  const gid = Number((obj && obj.id) || 0);
  const itemId = Number((obj && obj.item_id) || 0);
  const border = Number((obj && obj.border) || 0);
  const g = goodsOfGid(gid);
  const mat = goodsOfGid(itemId);
  if (!g || !FD.isFaithType(g.type_id) || !mat
      || border < 1 || border > 4 || Number(gid) === Number(itemId)) {
    log(`[faith] 洗练被拒（形状非法）target=${g && g.type_id} mat=${mat && mat.type_id} border=${border}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  const gi = FD.infoOfType(g.type_id);
  // 材料两态（ServantFaithRefreshSelPanel.lua:38-46 实证：选材列表 = 同 typeId 信仰 + 通用洗练道具）：
  //   ① 信仰 → 同属性同品质（面板 tips 主路径）；
  //   ② 通用型信仰 31000025（蓝/紫）/ 31000026「-改」（金）→ 品质严格配对，互相不兼容。
  // 目标仍必须 isFaithType（上面守卫），通用道具当目标进不来。
  const uniColors = FD.UNIVERSAL_REFRESH_ITEM[Number(mat.type_id)];
  let matIsUniversal = false;
  if (uniColors) {
    matIsUniversal = true;
    if (!uniColors.includes(gi.color)) {
      log(`[faith] 洗练被拒（通用材料品质不配对）target color=${gi.color} mat=${mat.type_id}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
  } else if (FD.isFaithType(mat.type_id)) {
    const mi = FD.infoOfType(mat.type_id);
    // 面板 tips：消耗**同属性同品质**信仰
    if (gi.prop !== mi.prop || gi.color !== mi.color) {
      log(`[faith] 洗练被拒（非同属性同品质）target=${g.type_id} mat=${mat.type_id}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    if (isEquippedAnywhere(itemId)) {
      log(`[faith] 洗练被拒（材料信仰已装备）mat=${itemId}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
  } else {
    log(`[faith] 洗练被拒（材料既非信仰也非通用洗练材料）mat=${mat.type_id}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  // 1) 新颜色必定与旧值不同（面板 tips 明写）
  const idx = border - 1; // 1..4 → sideColor 下标 0..3
  const sc = Array.isArray(g.sideColor) && g.sideColor.length === 4 ? g.sideColor.slice() : [0, 0, 0, 0];
  const cur = Number(sc[idx]) || 0;
  let next = cur;
  let guard = 0;
  while (next === cur && guard++ < 64) next = 1 + Math.floor(Math.random() * 6);
  sc[idx] = next;
  g.sideColor = sc;
  // 2) 消耗材料：
  //    信仰（canPile=false 逐实例）→ 整件移除并返还其投入的信仰灵光（tips 第 3 条）；
  //    通用型信仰（canPile=true 堆叠）→ 扣 cur_num 1 个、扣空才删档（D11），无灵光可返
  //    （它不是信仰、无投入；decomposeExpOf 对非 24 前缀恒 0，这里显式分流避免误读）。
  let refund = 0;
  let matOp = 2; // 材料推送形态：2=条目删除 / 3=堆叠余量更新
  if (matIsUniversal) {
    mat.cur_num = (Number(mat.cur_num) || 0) - 1;
    if (mat.cur_num <= 0) S.bagGoods.splice(S.bagGoods.indexOf(mat), 1); // 扣空才删档（D11）
    else matOp = 3;
  } else {
    refund = FD.decomposeExpOf(mat, mat.type_id);
    S.bagGoods.splice(S.bagGoods.indexOf(mat), 1);
    if (refund > 0) L.addScore(conn, FD.SCORE_FAITH_EXP, refund);
  }
  saveState();
  pushGoodsUpdate(conn, [mat], matOp);
  pushFaithGoods(conn, g);          // 目标颜色更新
  // toc：line（p_kvi 数组）留空、color（p_kvi 数组）= 更新后的四条边颜色
  conn.sendToc('m_faith_refresh_toc', {
    id: gid,
    line: [],
    color: [1, 2, 3, 4].map(i => ({ id: i, val: sc[i - 1] || 0 })),
  });
  log(`[faith] 洗练 goods=${gid} 边${border} ${cur}→${next} 耗 ${itemId}(type=${mat.type_id}${matIsUniversal ? ' 通用' : ''}) 返灵光 ${refund}`);
},
// ===================== 分解 =====================
// m_faith_decompose_tos {ids: [gid...]}
m_faith_decompose_tos(conn, obj) {
  const ids = (Array.isArray(obj && obj.ids) ? obj.ids : []).map(Number).filter(n => n > 0);
  const done = [];
  const removedGoods = [];
  let total = 0;
  for (const gid of ids) {
    const g = goodsOfGid(gid);
    if (!g || !FD.isFaithType(g.type_id)) continue;
    if (isEquippedAnywhere(gid)) { log(`[faith] 分解跳过已装备 goods=${gid}`); continue; }
    total += FD.decomposeExpOf(g, g.type_id);
    S.bagGoods.splice(S.bagGoods.indexOf(g), 1);
    removedGoods.push(g);
    done.push(gid);
  }
  if (done.length) {
    if (total > 0) L.addScore(conn, FD.SCORE_FAITH_EXP, total);
    saveState();
    pushGoodsUpdate(conn, removedGoods, 2);
    log(`[faith] 分解 ${done.length} 个 → 灵光 +${total}`);
  }
  // toc 只带 ids（客户端 updateFaithPopupPanel("updateBag") 重刷背包）
  conn.sendToc('m_faith_decompose_toc', { ids: done });
},
// ===================== 召唤 =====================
// m_faith_summon_tos {times}：每抽 1 张许愿卡 31000023 + 1000 银币（抵扣券 31000024 每张抵 1000）
// toc 是空包（客户端只当信号重刷面板），产出全靠 m_goods_update_toc
m_faith_summon_tos(conn, obj) {
  const want = Math.max(1, Number((obj && obj.times) || 1));
  const card = S.bagGoods.find(x => Number(x.type_id) === FD.ITEM_SUMMON_CARD);
  const haveCard = card ? Number(card.cur_num) || 0 : 0;
  const clip = S.bagGoods.find(x => Number(x.type_id) === FD.ITEM_SUMMON_CLIP);
  const haveClip = clip ? Number(clip.cur_num) || 0 : 0;
  // 许愿卡不足 → 客户端本应先弹购买框；服务端兜底按最大可抽数执行
  const times = Math.min(want, haveCard);
  if (times <= 0) {
    log(`[faith] 召唤被拒（许愿卡不足）want=${want} have=${haveCard}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  // 信仰背包余量（每实例占 1 格）
  const free = faithFreeSlots();
  const n = Math.min(times, free);
  if (n <= 0) {
    conn.sendToc('m_common_error_toc', { code: 31045 }); // 背包已满，不能使用道具
    log('[faith] 召唤被拒：信仰背包已满');
    return;
  }
  const useClip = Math.min(n, haveClip);              // 抵扣券按实际抽数抵扣
  const silver = FD.SUMMON_COST * (n - useClip);
  if (Number(S.roleAsset.silver) < silver) {
    log(`[faith] 召唤被拒（银币不足）需要=${silver} 有=${S.roleAsset.silver}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  const bagBefore = S.bagGoods.map(g => ({ ...g }));
  const nextGoodsBefore = S.nextGoodsId;
  const silverBefore = S.roleAsset.silver;
  // 扣费
  const changed = [];
  let got = [];
  try {
    card.cur_num -= n;
    if (card.cur_num <= 0) { S.bagGoods.splice(S.bagGoods.indexOf(card), 1); changed.push({ g: card, op: 2 }); }
    else changed.push({ g: card, op: 3 });
    if (useClip > 0 && clip) {
      clip.cur_num -= useClip;
      if (clip.cur_num <= 0) { S.bagGoods.splice(S.bagGoods.indexOf(clip), 1); changed.push({ g: clip, op: 2 }); }
      else changed.push({ g: clip, op: 3 });
    }
    if (silver > 0) S.roleAsset.silver = Number(S.roleAsset.silver) - silver;
    // 产出：8 属性随机（与信仰箱同口径），品质随机 3/4/5（金概率最低）
    const props = [1, 2, 3, 4, 5, 6, 26, 27];
    const rollColor = () => { const r = Math.random() * 100; return r < 55 ? 3 : (r < 88 ? 4 : 5); };
    for (let i = 0; i < n; i++) {
      const p = props[Math.floor(Math.random() * props.length)];
      const t = FD.faithTypeId(rollColor(), p);
      got.push(...grantGoods(t, 1, conn));
    }
  } catch (e) {
    // 发奖失败时恢复扣费和已生成的物品，避免“资源已扣但信仰未到账”。
    S.bagGoods = bagBefore;
    S.nextGoodsId = nextGoodsBefore;
    S.roleAsset.silver = silverBefore;
    log(`[faith] 召唤发奖失败，已回滚扣费：${e.message}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  saveState();
  for (const c of changed) pushGoodsUpdate(conn, [c.g], c.op);
  if (silver > 0) pushAssetChange(conn);
  if (got.length) pushGoodsUpdate(conn, got, 3);
  conn.sendToc('m_faith_summon_toc', {});
  log(`[faith] 召唤 x${n}（许愿卡 -${n} 抵扣券 -${Math.min(useClip, n)} 银币 -${silver}）产出 ${got.map(g => g.type_id).join(',')}`);
},
// ===================== 方案（plan）=====================
// m_faith_plan_info_tos {} → plans
m_faith_plan_info_tos(conn) {
  conn.sendToc('m_faith_plan_info_toc', { plans: plans().map(planP) });
},
// m_faith_save_plan_tos {id, servant_id, team_id}：把当前配装存进第 id 号方案
m_faith_save_plan_tos(conn, obj) {
  const id = Number((obj && obj.id) || 0);
  const sid = Number((obj && obj.servant_id) || 0);
  const teamId = Number((obj && obj.team_id) || 0);
  const b = servantOf(sid);
  const p = planOf(id);
  if (!b || !p) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const slots = slotsOf(b, teamId, false);
  p.detail = Object.entries(slots)
    .filter(([, g]) => Number(g) > 0)
    .map(([pos, g]) => ({ id: Number(pos), val: Number(g) }))
    .sort((x, y) => x.id - y.id);
  saveState();
  // ⚠️ schema 声明 plan 为 array p_faith_plan，但客户端是**按单个对象消费**：
  //    m_faith_save_plan_toc{plan} → ServantMgr.updateFaithPlan(plan) → VO:setData(plan)
  //    直接读 plan.id / plan.name / plan.detail。若发数组会解成 list → id 为 nil → VO 崩。
  //    etf.js 的 array 分支对"非数组单对象"会按 104 嵌套对象编码（见 etf.js L232），正是所需。
  conn.sendToc('m_faith_save_plan_toc', { plan: planP(p) });
  log(`[faith] 方案保存 plan=${id} servant=${sid} team=${teamId} 共 ${p.detail.length} 件`);
},
// m_faith_change_plan_name_tos {id, name}
m_faith_change_plan_name_tos(conn, obj) {
  const id = Number((obj && obj.id) || 0);
  const name = String((obj && obj.name) || '');
  const p = planOf(id);
  if (!p) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  p.name = name || `方案${id}`;
  saveState();
  conn.sendToc('m_faith_change_plan_name_toc', { id, name: p.name });
  log(`[faith] 方案改名 plan=${id} name=${p.name}`);
},
// m_faith_plan_use_tos {id, servant_id, opt, team_id}
// opt=1 仅替换未被占用的；opt=2 全部替换（把冲突信仰从其他誓灵身上摘下来）
m_faith_plan_use_tos(conn, obj) {
  const id = Number((obj && obj.id) || 0);
  const sid = Number((obj && obj.servant_id) || 0);
  const opt = Number((obj && obj.opt) || 1);
  const teamId = Number((obj && obj.team_id) || 0);
  const b = servantOf(sid);
  const p = planOf(id);
  if (!b || !p) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const slots = slotsOf(b, teamId, true);
  const touched = new Set();
  const done = [];
  const updates = [];  // p_kvt：{id=方案id, val=pos, type=gid}
  for (const d of p.detail) {
    const gid = Number(d.val);
    const pos = Number(d.id);
    const g = goodsOfGid(gid);
    if (!g || !FD.isFaithType(g.type_id) || pos < 1 || pos > 9) continue; // 信仰已不在包内：跳过
    const holder = findHolder(gid);
    if (holder && holder.sid !== sid) {
      if (opt === 1) continue;              // 仅替换其他 → 冲突的跳过
      for (const h of stripGid(gid)) { touched.add(gid); }
    }
    const old = Number(slots[pos]) || 0;
    if (old && old !== gid) touched.add(old);
    slots[pos] = gid;
    touched.add(gid);
    done.push(pos);
    updates.push({ id: Number(p.id), val: pos, type: gid });
  }
  saveState();
  conn.sendToc('m_faith_plan_use_toc', { id });
  // 方案内容变了 → plan_update_toc 让客户端同步方案内的 pos→gid
  if (updates.length) conn.sendToc('m_faith_plan_update_toc', { update: updates });
  pushEquipInfo(conn, sid, teamId);
  for (const g of touched) pushGoodsEquip(conn, g);
  log(`[faith] 方案套用 plan=${id} servant=${sid} team=${teamId} opt=${opt} 生效 ${done.length} 件`);
},
  },
};
