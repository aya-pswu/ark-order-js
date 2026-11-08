// 暗噬：协议、扣料、路线开关和客户端同步。材料校验完成后才进入事务。
'use strict';
const { S, saveState } = require('../state');
const L = require('../lib');
const CH = require('../data/chaos_data');
const reject = (conn, why) => {
  L.log('[chaos] 拒绝：' + why);
  conn.sendToc('m_common_reply_toc', { proto_id: 0 });
};
function eligible(b) { return b && L.buildOpenFunctions().includes(17) && !CH.isBusy(S, b); }
function pushDetail(conn, b) {
  L.pushServantChanges(conn, [{ servant_id: b.id, key: 13, val: Number(b.status2) || 0 },
    { servant_id: b.id, key: 14, val: CH.fantasyGrowthOf(b) },
    { servant_id: b.id, key: 15, val: require('../data/ark_data').servantPower(b) }]);
  conn.sendToc('m_servant_detail_toc', { servant: require('./servant').servantDetailOf(b) });
}
function spendPlan(cost) {
  const plan = [];
  for (const [key, qty] of Object.entries(cost)) {
    const type = Number(key);
    if (!Number.isSafeInteger(qty) || qty < 0) return null;
    if (type === 30000003 || type === 30000000) {
      const balance = Number(S.roleAsset[type === 30000003 ? 'silver' : 'gold']);
      if (!Number.isSafeInteger(balance) || balance < qty) return null;
      continue;
    }
    let left = qty;
    for (const g of S.bagGoods) {
      if (Number(g.type_id) !== type || g.lock === 1 || g.isLock || L.equipOwnersOfGid(g.id).length) continue;
      if (!Number.isSafeInteger(g.cur_num) || g.cur_num <= 0) continue;
      const num = Math.min(g.cur_num, left);
      if (num) plan.push({ g, num });
      left -= num;
      if (!left) break;
    }
    if (left) return null;
  }
  return plan;
}
function select(conn, obj, node, mask, toc) {
  const sid = Number(obj && obj.servant_id), choice = Number(obj && obj.chaos_id);
  const b = S.servants.find(x => x.id === sid);
  if (!eligible(b) || !CH.berserkOf(b) || ![0, node].includes(choice) || (choice && !CH.levelOf(b, node))) return reject(conn, '路线未解锁或誓灵忙碌');
  const prev = Number(b.status2) || 0;
  b.status2 = choice ? prev | mask : prev & ~mask;
  try { saveState({ throwOnError: true }); } catch (e) { b.status2 = prev; return reject(conn, '存档失败，已回滚'); }
  conn.sendToc(toc, { servant_id: sid, chaos_id: choice });
  pushDetail(conn, b);
}
module.exports = { spendPlan, handlers: {
  m_servant_chaos_upgrade_tos(conn, obj) {
    const sid = Number(obj && obj.servant_id), id = Number(obj && obj.chaos_id);
    const b = S.servants.find(x => x.id === sid);
    if (!Number.isSafeInteger(sid) || !Number.isSafeInteger(id) || !eligible(b)) return reject(conn, '入口未开放、参数错误或誓灵忙碌');
    const result = CH.canUpgrade(b, id);
    if (!result.ok) return reject(conn, result.reason);
    const plan = spendPlan(result.cost);
    if (!plan) return reject(conn, '材料或货币不足');
    const snap = JSON.parse(JSON.stringify({ bagGoods: S.bagGoods, roleAsset: S.roleAsset, skinState: S.skinState, b }));
    const removed = [], updated = [];
    try {
      for (const { g, num } of plan) {
        g.cur_num -= num;
        if (g.cur_num === 0) { S.bagGoods.splice(S.bagGoods.indexOf(g), 1); removed.push(g); }
        else updated.push(g);
      }
      const cost = result.cost;
      S.roleAsset.silver -= cost[30000003] || 0;
      const gold = cost[30000000] || 0;
      S.roleAsset.gold -= gold;
      S.roleAsset.gold_given = Math.max(0, (Number(S.roleAsset.gold_given) || 0) - gold);
      const levels = CH.levelsOf(b); levels[id] = result.next;
      b.chaos = Object.entries(levels).map(([id, val]) => ({ id: Number(id), val }));
      b.dream_lv = CH.fantasyGrowthOf(b);
      const berserk = CH.berserkOf(b);
      if (id === 2004 || id === 2005) {
        if (!S.skinState) S.skinState = { owned: [], l2dOwned: [] };
        if (!Array.isArray(S.skinState.owned)) S.skinState.owned = [];
        if (!Array.isArray(S.skinState.l2dOwned)) S.skinState.l2dOwned = [];
        const list = id === 2004 ? S.skinState.owned : S.skinState.l2dOwned;
        if (!list.includes(berserk.skin)) list.push(berserk.skin);
      }
      saveState({ throwOnError: true });
    } catch (e) {
      S.bagGoods = snap.bagGoods; S.roleAsset = snap.roleAsset; S.skinState = snap.skinState;
      for (const key of Object.keys(b)) delete b[key]; Object.assign(b, snap.b);
      return reject(conn, '事务失败，已回滚：' + e.message);
    }
    if (removed.length) L.pushGoodsUpdate(conn, removed, 2);
    if (updated.length) L.pushGoodsUpdate(conn, updated, 3);
    if (result.cost[30000003] || result.cost[30000000]) L.pushAssetChange(conn);
    conn.sendToc('m_servant_chaos_upgrade_toc', { servant_id: sid, chaos_id: id, level: result.next });
    pushDetail(conn, b);
    if (id === 2004) require('./servant').handlers.m_servant_skin_tos(conn, { servant_id: sid });
    if (id === 2005) conn.sendToc('m_skin_live_state_toc', { id: CH.berserkOf(b).skin, state: 1 });
    L.log('[chaos] servant=' + sid + ' node=' + id + ' level=' + result.next);
  },
  m_chaos_select_talent_tos(conn, obj) { select(conn, obj, 2003, 1, 'm_chaos_select_talent_toc'); },
  m_chaos_select_racial_plan_tos(conn, obj) { select(conn, obj, 2001, 2, 'm_chaos_select_racial_plan_toc'); },
} };
