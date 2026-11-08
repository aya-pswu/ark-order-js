// 圣器 / 能力核心装备系统
// 客户端数据流（bc 反编译实证，见 ServantModule/ServantConfigVO/CoreItemVO/BaseItemVO）：
// - 誓灵侧装备态经 p_servant_detail / p_team_servant 下发：relic(圣器typeId) relic_id(物品gid)
//   power_relic=[{id:属性码1-6, val:物品gid}]（ServantConfigVO.coreDic 按属性码索引）
// - 物品侧装备态经 p_goods.servant_ids 下发（打包 long：servantID*10^5 + group*10^3 + team，
//   group=0→键1；BaseItemVO.updateEquipServant 解包）；装备/卸下后必须推 m_goods_equip_toc 刷新
// - 核心等级经 m_relic_upgrade_info_toc.power_relic_list=[{id:gid, val:等级}]（打开核心背包页签时拉取）
// - 圣器附魔（m_relic_enchant_*）：按实例保存五条属性等级，活动属性进入主线/塔战计算
const { S, saveState } = require('../state');
const L = require('../lib');
const { log, defaultFill, pushGoodsUpdate, relicFieldsOf, equipOwnersOfGid, grantGoods, stripGoodsFromServants, powerRelicList } = L;
const RD = require('../data/relic_data');
const CH = require('../data/chaos_data');

const goodsOfGid = gid => S.bagGoods.find(x => Number(x.id) === Number(gid));

// p_goods.servant_ids 打包（long）：servantID*10^5（group/team 全 0；客户端 group 0→1 = 誓灵列表）
const packedServantIds = gids => gids.map(gid => {
  const owners = equipOwnersOfGid(gid);
  return owners.map(sid => BigInt(sid) * 100000n);
}).flat();

// 推送物品装备标记（m_goods_equip_toc：客户端 BagMgr.getItem(gid):updateEquipServant(equip_servants)）
function pushGoodsEquip(conn, gid) {
  conn.sendToc('m_goods_equip_toc', {
    goods_id: Number(gid),
    equip_servants: packedServantIds([gid]),
  });
}

const isEquippedAnywhere = gid => equipOwnersOfGid(gid).length > 0;

function enchantTargetOf(gid) {
  if (!Number.isSafeInteger(gid) || gid <= 0) return null;
  const g = goodsOfGid(gid);
  if (!g || !RD.isRelicType(g.type_id) || g.cur_num !== 1) return null;
  // 已装备的圣器可培养，正在战斗/派遣的持有者不可改动装备属性。
  if (equipOwnersOfGid(gid).some(sid => {
    const b = S.servants.find(x => x.id === sid);
    return b && CH.isBusy(S, b);
  })) return null;
  return g;
}

module.exports = {
  handlers: {
// ---- 圣器装备/卸下（每誓灵 1 个；客户端选已装备圣器时会先发 unload 再 equip）----
m_servant_relic_equip_tos(conn, obj) {
  const sid = Number((obj && obj.servant_id) || 0);
  const gid = Number((obj && obj.goods_id) || 0);
  const teamId = Number((obj && obj.team_id) || 0);
  const b = S.servants.find(s => s.id === sid);
  const g = goodsOfGid(gid);
  if (!b || !g || !RD.isRelicType(g.type_id)) {
    // 物品不在包内等异常：不回 toc（客户端 m_servant_relic_equip_toc 会 getItem(nil).typeId 崩），common_reply 只解 loading
    log(`[relic] 圣器装备被拒 servant=${sid} goods=${gid}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  stripGoodsFromServants(gid, sid); // 兜底清旧持有者（正常流程客户端会先卸）
  b.relic_gid = gid;
  saveState();
  conn.sendToc('m_servant_relic_equip_toc', { servant_id: sid, goods_id: gid, team_id: teamId });
  pushGoodsEquip(conn, gid);
  log(`[relic] 圣器装备 servant=${sid} type=${g.type_id} goods=${gid}`);
},
m_servant_relic_unload_tos(conn, obj) {
  const sid = Number((obj && obj.servant_id) || 0);
  const teamId = Number((obj && obj.team_id) || 0);
  const b = S.servants.find(s => s.id === sid);
  const gid = b && Number(b.relic_gid) || 0;
  if (b && gid) {
    b.relic_gid = 0;
    saveState();
    if (goodsOfGid(gid)) pushGoodsEquip(conn, gid);
    log(`[relic] 圣器卸下 servant=${sid} goods=${gid}`);
  }
  conn.sendToc('m_servant_relic_unload_toc', { servant_id: sid, team_id: teamId });
},
// ---- 能力核心装备/卸下（每属性槽 1 个；goods_id=0 一键装备，opt=1 全卸）----
m_servant_power_relic_equip_tos(conn, obj) {
  const sid = Number((obj && obj.servant_id) || 0);
  const gid = Number((obj && obj.goods_id) || 0);
  const teamId = Number((obj && obj.team_id) || 0);
  const b = S.servants.find(s => s.id === sid);
  if (!b) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  if (!b.cores) b.cores = {};
  const touchedGids = [];   // 装备态变过的物品（要推 goods_equip）
  if (gid === 0) {
    // 一键装备：每个空槽选颜色最高、等级最高、未被任何人装备的核心
    const used = new Set();
    S.servants.forEach(o => {
      if (o.relic_gid) used.add(Number(o.relic_gid));
      Object.values(o.cores || {}).forEach(x => used.add(Number(x)));
    });
    const cores = S.bagGoods.filter(g => RD.isCoreType(g.type_id));
    for (let prop = 1; prop <= 6; prop++) {
      if (Number(b.cores[prop]) > 0) continue;
      const cand = cores
        .filter(g => RD.infoOfType(g.type_id).propCode === prop && !used.has(g.id))
        .sort((x, y) => (RD.infoOfType(y.type_id).color - RD.infoOfType(x.type_id).color)
          || (Number(y.level) || 1) - (Number(x.level) || 1) || x.id - y.id)[0];
      if (cand) { b.cores[prop] = cand.id; used.add(cand.id); touchedGids.push(cand.id); }
    }
  } else {
    const g = goodsOfGid(gid);
    if (!g || !RD.isCoreType(g.type_id)) {
      log(`[relic] 核心装备被拒 servant=${sid} goods=${gid}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    const prop = RD.infoOfType(g.type_id).propCode;
    const old = Number(b.cores[prop]) || 0;
    if (old && old !== gid) touchedGids.push(old);   // 被顶掉的核心 → 变未装备
    stripGoodsFromServants(gid, sid);                 // 从其他誓灵处兜底卸下
    b.cores[prop] = gid;
    touchedGids.push(gid);
  }
  saveState();
  // 回包 power_relic：该誓灵当前全部核心（客户端 updateServantPowerRelic 逐个 setPropRelic）
  conn.sendToc('m_servant_power_relic_equip_toc', {
    power_relic: [{ servant_id: sid, goods_id: Object.values(b.cores).map(Number) }],
    team_id: teamId,
  });
  for (const g2 of [...new Set(touchedGids)]) pushGoodsEquip(conn, g2);
  log(`[relic] 核心装备 servant=${sid} goods=${gid || '一键'} → [${Object.values(b.cores).join(',')}]`);
},
m_servant_power_relic_unload_tos(conn, obj) {
  const sid = Number((obj && obj.servant_id) || 0);
  const opt = Number((obj && obj.opt) || 0);
  const gid = Number((obj && obj.goods_id) || 0);
  const teamId = Number((obj && obj.team_id) || 0);
  const b = S.servants.find(s => s.id === sid);
  if (!b) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  let removed = [];
  if (gid > 0) {
    // 卸指定核心（该誓灵或任意持有人）
    stripGoodsFromServants(gid, 0);
    if (b.cores) for (const k of Object.keys(b.cores)) if (Number(b.cores[k]) === gid) delete b.cores[k];
    removed = [gid];
  } else {
    // goods_id=0：opt=1/2 一键全卸（面板两个选项，保守同语义）
    removed = Object.values(b.cores || {}).map(Number);
    b.cores = {};
  }
  saveState();
  // 回包携带"被卸下的核心列表"——客户端 isEquip=0 分支按 gid 反查属性码逐槽 clearPropRelic
  conn.sendToc('m_servant_power_relic_unload_toc', {
    opt,
    power_relic: [{ servant_id: sid, goods_id: removed }],
    team_id: teamId,
  });
  for (const g2 of removed) pushGoodsEquip(conn, g2);
  log(`[relic] 核心卸下 servant=${sid} goods=${gid || (opt === 2 ? '一键(低)' : '一键')} 共${removed.length}个`);
},
// ---- 核心等级信息（打开核心背包页签 / 登录拉包时请求）----
// powerRelicList 与 pushGoodsUpdate 的发放补推共用（唯一权威 S.bagGoods[].level）
m_relic_upgrade_info_tos(conn) {
  conn.sendToc('m_relic_upgrade_info_toc', { power_relic_list: powerRelicList() });
},
// ---- 核心升级（吃核心晶组 27000000 系列；needExp 恒 1 → toc.exp 就是新等级）----
m_relic_upgrade_tos(conn, obj) {
  const gid = Number((obj && obj.relic_id) || 0);
  const g = goodsOfGid(gid);
  const reply = exp => conn.sendToc('m_relic_upgrade_toc', { relic_id: gid, exp });
  if (!g || !RD.isCoreType(g.type_id)) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const info = RD.infoOfType(g.type_id);
  const curLv = Number(g.level) || 1;
  const maxLv = RD.coreMaxLevel(info.color);
  if (curLv >= maxLv) { reply(curLv); return; }
  // 扣材料（CfgRelic.propRelic.upgradeItems；30000003 银币 num=0 免费）
  const cost = RD.upgradeCost(curLv + 1);
  const updated = [], removed = [];
  let ok = true;
  for (const [matType, num] of Object.entries(cost)) {
    if (!num) continue;
    const mg = S.bagGoods.find(x => Number(x.type_id) === Number(matType));
    if (!mg || mg.cur_num < num) { ok = false; break; }
  }
  if (ok) {
    for (const [matType, num] of Object.entries(cost)) {
      if (!num) continue;
      const mg = S.bagGoods.find(x => Number(x.type_id) === Number(matType));
      mg.cur_num -= num;
      if (mg.cur_num <= 0) { S.bagGoods.splice(S.bagGoods.indexOf(mg), 1); removed.push(mg); }
      else updated.push(mg);
    }
    g.level = curLv + 1;
    saveState();
    if (updated.length) pushGoodsUpdate(conn, updated, 3);
    if (removed.length) pushGoodsUpdate(conn, removed, 2);
    log(`[relic] 核心升级 goods=${gid} Lv${curLv}→${g.level} 材料-${JSON.stringify(cost)}`);
  } else {
    log(`[relic] 核心升级被拒（材料不足）goods=${gid} 需要 ${JSON.stringify(cost)}`);
  }
  reply(Number(g.level) || 1);
},
// ---- 核心分解（回核心晶组；客户端面板按 decomposeItem[color] 预览）----
m_relic_decompose_tos(conn, obj) {
  const relics = (Array.isArray(obj && obj.relics) ? obj.relics : []).map(Number).filter(n => n > 0);
  const items = {};   // typeId → 数量
  const removedGoods = [];
  const done = [];
  for (const gid of relics) {
    const g = goodsOfGid(gid);
    if (!g) continue;
    if (isEquippedAnywhere(gid)) { log(`[relic] 分解跳过已装备物品 goods=${gid}`); continue; }
    const info = RD.infoOfType(g.type_id);
    if (!info) continue;
    for (const [matType, num] of Object.entries(RD.decomposeItems(info.color))) {
      items[matType] = (items[matType] || 0) + num;
    }
    S.bagGoods.splice(S.bagGoods.indexOf(g), 1);
    removedGoods.push(g);
    done.push(gid);
  }
  const granted = [];
  if (done.length) {
    for (const [typeId, num] of Object.entries(items)) granted.push(...grantGoods(Number(typeId), num, conn));
    saveState();
    if (removedGoods.length) pushGoodsUpdate(conn, removedGoods, 2);
    if (granted.length) pushGoodsUpdate(conn, granted, 3);
    log(`[relic] 分解 ${done.length} 个 → ${JSON.stringify(items)}`);
  }
  conn.sendToc('m_relic_decompose_toc', {
    relics: done,
    items: Object.entries(items).map(([id, val]) => ({ id: Number(id), val })),
  });
},
// ---- 圣器附魔信息（打开圣器背包页签时请求）----
m_relic_enchant_info_tos(conn) {
  const relicList = S.bagGoods.filter(g => RD.isRelicType(g.type_id)).map(RD.enchantInfoOf);
  conn.sendToc('m_relic_enchant_info_toc', { relic_list: relicList });
},
 m_relic_change_enchant_tos(conn, obj) {
  const g = enchantTargetOf(Number(obj && obj.relic_id)), type = Number(obj && obj.type);
  if (!g || (type !== 0 && !RD.ENCHANT_PROPS.includes(type))) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  RD.normalizeEnchant(g); if (type && !g.enchant_levels[type]) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const old = g.enchant_type; g.enchant_type = type;
  try { saveState({ throwOnError: true }); } catch (e) { g.enchant_type = old; conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  conn.sendToc('m_relic_change_enchant_toc', { relic_id: g.id, type }); conn.sendToc('m_relic_enchant_info_toc', { relic_list: [RD.enchantInfoOf(g)] });
 },
 m_relic_upgrade_enchant_tos(conn, obj) {
  const g = enchantTargetOf(Number(obj && obj.relic_id)), type = Number(obj && obj.type), mats = Array.isArray(obj && obj.relic_list) ? obj.relic_list.map(Number) : [];
  if (!g || !RD.ENCHANT_PROPS.includes(type)) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  RD.normalizeEnchant(g); const cfg = RD.enchantConfigOf(g), cur = g.enchant_levels[type] || 0;
  const need = cfg && cfg.nums[cur];
  if (!cfg || cur >= 5 || !Number.isInteger(need) || !mats.length || mats.length > need || mats.some(id => !Number.isSafeInteger(id) || id <= 0) || mats.includes(g.id) || new Set(mats).size !== mats.length) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const common = cfg.commonItems || [], goods = mats.map(goodsOfGid);
  if (goods.some(x => !x || !Number.isSafeInteger(x.cur_num) || x.cur_num <= 0 || x.lock === 1 || x.isLock || isEquippedAnywhere(x.id) || (common.includes(Number(x.type_id)) ? false : Number(x.type_id) !== Number(g.type_id) || x.cur_num !== 1))) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  // 普通同色圣器是单实例；通用圣器可堆叠，一个 gid 的 cur_num 可覆盖多个单位材料。
  const relicUnits = goods.filter(x => !common.includes(Number(x.type_id))).length;
  const commonGoods = goods.filter(x => common.includes(Number(x.type_id)));
  const commonUnits = commonGoods.reduce((n, x) => n + x.cur_num, 0);
  if (relicUnits > need || relicUnits + commonUnits < need) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  const oldGoods = S.bagGoods.slice(), oldCounts = goods.map(x => x.cur_num);
  const oldLevels = Object.assign({}, g.enchant_levels), oldType = g.enchant_type;
  const takes = new Map(goods.filter(x => !common.includes(Number(x.type_id))).map(x => [x, 1]));
  let left = need - relicUnits;
  commonGoods.forEach((m, i) => {
    // 为剩余每个已选择的通用材料至少保留一单位，避免出现零扣料的选中项。
    const take = Math.min(m.cur_num, left - (commonGoods.length - i - 1));
    takes.set(m, take); left -= take;
  });
  try {
    for (const m of goods) {
      m.cur_num -= takes.get(m);
      if (m.cur_num <= 0) S.bagGoods.splice(S.bagGoods.indexOf(m), 1);
    }
    g.enchant_levels[type] = cur + 1; if (!g.enchant_type) g.enchant_type = type; saveState({ throwOnError: true });
  }
  catch (e) { S.bagGoods = oldGoods; goods.forEach((x, i) => { x.cur_num = oldCounts[i]; }); g.enchant_levels = oldLevels; g.enchant_type = oldType; conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  conn.sendToc('m_relic_upgrade_enchant_toc', { relic_id: g.id, type });
  const removed = goods.filter(x => Number(x.cur_num) <= 0), updated = goods.filter(x => Number(x.cur_num) > 0);
  if (removed.length) pushGoodsUpdate(conn, removed, 2);
  if (updated.length) pushGoodsUpdate(conn, updated, 3);
  // 更新背包实例后再下发附魔权威信息，避免客户端物品刷新丢掉附魔缓存。
  conn.sendToc('m_relic_enchant_info_toc', { relic_list: [RD.enchantInfoOf(g)] });
 },
  },
};
