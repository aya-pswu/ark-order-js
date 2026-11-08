// 元素精灵（Element）协议族 —— 2026-10-23 接通。
//
// 六条协议（Proto.lua:4740-4900，别名 1507-1516 / 1572-1573）：
//   m_element_equip_tos     装备/替换（servant_id + goods_id + team_id，回包必须原样回显三字段）
//   m_element_unload_tos    卸下（servant_id + team_id）
//   m_element_merge_tos     融合（目标 gid + 材料 gid[]，金币 500/材料）
//   m_element_translate_tos 转化（目标 gid + **晶石 type_id**，泛用→专属①，同誓灵专属①→②）
//   m_element_change_tos    外形（目标 gid + 被吃掉的泛用 gid）
//   m_element_restore_tos   还原（专属 gid[] → 返还同名晶石 × translate_times）
//
// 三条铁律（都来自真机客户端代码）：
//  1. **toc 一到就会弹提示**（"成功融合/成功转化/外形变化成功/成功携带"），所以失败**绝不回**同名 toc，
//     一律 m_common_tips_toc{官方错误码} 或 m_common_reply_toc（D2/D11）。
//  2. 融合/转化的客户端刷新是 `BagMgr.getItem(goods_id)` 读**本地背包** ⇒ 必须先推
//     m_goods_update_toc（op=3）再回 toc，否则面板显示的还是旧等级。
//  3. 元素实例**不堆叠**：每次发放都是独立 gid（level/translate_type/face 都在实例上）。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log, pushGoodsUpdate, pushAssetChange, grantGoods } = L;
const EL = require('../data/element_data');

// 官方错误码（CfgErrorCode 实证）
const ERR = {
  BAG_FULL: 77,             // 元素精灵背包不足，请先扩充或者整理背包
  EQUIPPED: 1512002,        // 誓灵已装备这个元素精灵
  NOT_EQUIPPED: 1514001,    // 誓灵没有装备元素精灵
  BAD_SERVANT: 1514002,     // 元素精灵的誓灵数据有误
  EMPTY_SELECT: 1573001,    // 至少选择一个元素精灵
  NO_GOLD: 1059002,         // 金币不足
  NO_ITEM: 31034,           // 物品数量不足
};

function tips(conn, code) { conn.sendToc('m_common_tips_toc', { code }); }
function reply(conn) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); }

const goodsById = gid => S.bagGoods.find(g => Number(g.id) === Number(gid));
const isElem = g => !!g && Number(g.bag_type) === 9 && EL.isElementItem(g.type_id);
const equippedBy = gid => {
  const s = S.servants.find(o => Number(o.element_gid) === Number(gid));
  return s ? s.id : 0;
};
function freeSlots() {
  const used = S.bagGoods.filter(g => Number(g.bag_type) === 9).length;
  return Math.max(0, L.bagSizeOf(9) - used);
}

// 元素实例 → 客户端 UI 需要的"专属"判定
const isExclusive = g => Number(g.translate_type) > 0;

// 下发变化：deleted = 被消耗/还原掉的实例（op=2），changed = 新建或改过字段的实例（op=3）
function pushGoods(conn, changed, deleted) {
  if (deleted && deleted.length) {
    pushGoodsUpdate(conn, deleted.map(g => ({ id: g.id, type_id: g.type_id, cur_num: 0, bag_type: g.bag_type })), 2);
  }
  if (changed && changed.length) pushGoodsUpdate(conn, changed, 3);
}

module.exports = {
  handlers: {
    // ---------------- 装备 / 替换 ----------------
    // 客户端：ServantBagPanel 选完 → ServantMgr.itemUseFunc(gid) → m_element_equip_tos(servantId, gid[, teamId])
    // 回包：m_element_equip_toc{servant_id, goods_id, team_id} → Tips("成功携带") + 把 elementID 写到
    //      team_id≠0 的编队副本 VO，否则写本体 VO（所以三字段必须回显）
    m_element_equip_tos(conn, obj) {
      const sid = Number(obj && obj.servant_id) || 0;
      const gid = Number(obj && obj.goods_id) || 0;
      const teamId = Number(obj && obj.team_id) || 0;
      const b = S.servants.find(x => Number(x.id) === sid);
      const g = goodsById(gid);
      if (!b) { tips(conn, ERR.BAD_SERVANT); return; }
      if (!isElem(g)) { tips(conn, ERR.NO_ITEM); return; }
      if (Number(b.element_gid) === gid) { tips(conn, ERR.EQUIPPED); return; }
      // 专属精灵只能装在本体上（客户端 ServantBagPanel.filter 同口径：泛用 || transTypeID == 誓灵 typeId）
      if (isExclusive(g) && Number(g.translate_type) !== Number(b.type)) { tips(conn, ERR.BAD_SERVANT); return; }
      // 已被别的誓灵占着（一只实例只能装一只）
      const holder = equippedBy(gid);
      if (holder && holder !== sid) { tips(conn, ERR.EQUIPPED); return; }

      const prevGid = Number(b.element_gid) || 0;
      b.element_gid = gid;
      saveState();
      conn.sendToc('m_element_equip_toc', { servant_id: sid, goods_id: gid, team_id: teamId });
      // 两件物品的 servant_ids 都变了 → 各推一次（客户端"已装备"角标 + 卸下反查）
      const changed = [g];
      const prev = prevGid ? goodsById(prevGid) : null;
      if (prev) changed.push(prev);
      pushGoods(conn, changed, null);
      log(`[element] 装备 sid=${sid}(${b.type}) gid=${gid}(Lv${EL.normLevel(g.level)}${isExclusive(g) ? ' 专属' : ' 泛用'})`
        + (prevGid ? `，替换原 gid=${prevGid}` : ''));
    },

    // ---------------- 卸下 ----------------
    m_element_unload_tos(conn, obj) {
      const sid = Number(obj && obj.servant_id) || 0;
      const teamId = Number(obj && obj.team_id) || 0;
      const b = S.servants.find(x => Number(x.id) === sid);
      if (!b) { tips(conn, ERR.BAD_SERVANT); return; }
      if (!Number(b.element_gid)) { tips(conn, ERR.NOT_EQUIPPED); return; } // 客户端只在玩家主动卸下时弹提示
      const gid = Number(b.element_gid);
      b.element_gid = 0;
      saveState();
      conn.sendToc('m_element_unload_toc', { servant_id: sid, team_id: teamId });
      const g = goodsById(gid);
      if (g) pushGoods(conn, [g], null);
      log(`[element] 卸下 sid=${sid} gid=${gid}`);
    },

    // ---------------- 融合（升级） ----------------
    // 客户端：m_element_merge_tos{goods_id=目标 gid, cost_ids=[材料 gid × ≤10]}
    // 材料门槛：Σ材料等级 ≥ MERGE_TIMES[下一级]（**绝对阈值**，Lv2→3 要 3 点，不是差值）
    // 花费：500 金币 × 材料数；溢出点数丢弃（客户端本身会弹"融合后会溢出"确认框）
    m_element_merge_tos(conn, obj) {
      const gid = Number(obj && obj.goods_id) || 0;
      const costIds = Array.isArray(obj && obj.cost_ids) ? obj.cost_ids.map(Number).filter(x => x > 0) : [];
      const target = goodsById(gid);
      if (!isElem(target)) { tips(conn, ERR.NO_ITEM); return; }
      const lv = EL.normLevel(target.level);
      if (lv >= EL.MAX_LV) { reply(conn); return; }             // 已满级：客户端本应拦住
      if (!costIds.length || costIds.length > 10) { tips(conn, ERR.EMPTY_SELECT); return; }
      if (costIds.includes(gid)) { reply(conn); return; }        // 不能吃自己

      const mats = [];
      for (const cid of costIds) {
        const g = goodsById(cid);
        if (!isElem(g)) { tips(conn, ERR.NO_ITEM); return; }
        if (gid === cid) { reply(conn); return; }
        if (isExclusive(g)) { reply(conn); return; }              // 材料只能是泛用型（客户端 filter）
        if (Number(g.lock) === 1) { reply(conn); return; }
        if (equippedBy(cid)) { tips(conn, ERR.EQUIPPED); return; }
        if (mats.some(m => Number(m.id) === cid)) { reply(conn); return; } // 去重
        mats.push(g);
      }
      const points = mats.reduce((n, g) => n + EL.normLevel(g.level), 0);
      const need = EL.MERGE_TIMES[lv + 1];
      if (points < need) { reply(conn); return; }                 // 点数不够：客户端 UI 会提示"需要满足升级要求"
      const gold = mats.length * EL.MERGE_COST;
      // 货币口径（GlobalData.gold = payGold + givenGold ⇒ 面板 lblMoney 是**水晶总量**，
      // 与协会家具制造的 costCrystal 同口径）：先扣赠送（gold_given）再扣付费（gold）。
      // ⚠️ 不能只看 roleAsset.gold —— 存档里 gold 常为 0、水晶全在 gold_given（本档实证）。
      const payGold = Number(S.roleAsset.gold) || 0;
      const givenGold = Number(S.roleAsset.gold_given) || 0;
      if (payGold + givenGold < gold) { tips(conn, ERR.NO_GOLD); return; }

      const useGiven = Math.min(givenGold, gold);
      S.roleAsset.gold_given = givenGold - useGiven;
      S.roleAsset.gold = payGold - (gold - useGiven);
      target.level = lv + 1;
      S.bagGoods = S.bagGoods.filter(g => !mats.some(m => m === g));
      saveState();

      // 先推包再回 toc：客户端的 m_element_merge_toc 会 BagMgr.getItem(goods_id) 读本地等级
      pushGoods(conn, [target], mats);
      pushAssetChange(conn);
      conn.sendToc('m_element_merge_toc', { goods_id: gid, cost_ids: costIds });
      log(`[element] 融合 gid=${gid} Lv${lv}→${lv + 1}（材料 ${mats.length} 个 点数 ${points}/${need}，`
        + `水晶 -${gold}〔赠送 ${useGiven}〕余 ${S.roleAsset.gold}+${S.roleAsset.gold_given}）`);
    },

    // ---------------- 转化（泛用 → 专属 / 专属①→②） ----------------
    // 客户端：m_element_translate_tos{goods_id=目标 gid, cost_type=**晶石 type_id**}
    // 客户端读包顺序同融合 → 先推 goods_update 再回 toc
    m_element_translate_tos(conn, obj) {
      const gid = Number(obj && obj.goods_id) || 0;
      const costType = Number(obj && obj.cost_type) || 0;
      const target = goodsById(gid);
      if (!isElem(target)) { tips(conn, ERR.NO_ITEM); return; }
      const servantType = EL.ITEM_TO_SERVANT[costType];
      if (!servantType) { tips(conn, ERR.NO_ITEM); return; }
      const times = Number(target.translate_times) || 0;
      const bound = Number(target.translate_type) || 0;
      if (times >= 2) { reply(conn); return; }                    // 已是最高阶（客户端也拦）
      if (bound && bound !== servantType) { tips(conn, ERR.BAD_SERVANT); return; } // 异誓灵晶石
      // 材料：背包里任意位置的该 type 晶石 1 个（转化消耗的是"同名元素晶石"）
      const crystal = S.bagGoods.find(g => Number(g.type_id) === costType && Number(g.cur_num) > 0);
      if (!crystal) { tips(conn, ERR.NO_ITEM); return; }

      crystal.cur_num -= 1;
      const crystalGone = Number(crystal.cur_num) <= 0;
      if (crystalGone) S.bagGoods = S.bagGoods.filter(g => g !== crystal);
      target.translate_type = servantType;
      target.translate_times = times + 1;
      target.color = EL.CRYSTAL_COLOR;
      saveState();

      pushGoods(conn, [target], crystalGone ? [crystal] : null);
      if (!crystalGone) pushGoods(conn, [crystal], null);
      conn.sendToc('m_element_translate_toc', { goods_id: gid, cost_type: costType });
      log(`[element] 转化 gid=${gid} → 誓灵 ${servantType} 第 ${times + 1} 次（消耗晶石 ${costType}×1）`);
    },

    // ---------------- 外形变化 ----------------
    // 客户端：m_element_change_tos{goods_id=目标 gid, cost_id=**被吃掉的 gid**}（两个都是 gid）
    // 语义：把目标的 face（头饰/眼/嘴）换成被吃掉的泛用精灵的，然后销毁它
    m_element_change_tos(conn, obj) {
      const gid = Number(obj && obj.goods_id) || 0;
      const costId = Number(obj && obj.cost_id) || 0;
      const target = goodsById(gid);
      const cost = goodsById(costId);
      if (!isElem(target) || !isElem(cost) || gid === costId) { tips(conn, ERR.NO_ITEM); return; }
      if (isExclusive(cost)) { reply(conn); return; }             // 素材只能泛用（客户端 filter）
      if (Number(cost.lock) === 1) { reply(conn); return; }
      if (equippedBy(costId)) { tips(conn, ERR.EQUIPPED); return; }

      target.face = (Array.isArray(cost.face) && cost.face.length === 3)
        ? cost.face.map(kv => ({ id: Number(kv.id), val: Number(kv.val) }))
        : [{ id: 1, val: 1 }, { id: 2, val: 1 }, { id: 3, val: 1 }];
      S.bagGoods = S.bagGoods.filter(g => g !== cost);
      saveState();

      pushGoods(conn, [target], [cost]);
      conn.sendToc('m_element_change_toc', { goods_id: gid, cost_id: costId });
      log(`[element] 外形变化 gid=${gid} ← 素材 gid=${costId}（face=${JSON.stringify(target.face)}）`);
    },

    // ---------------- 还原（专属 → 返还晶石） ----------------
    // 客户端确认文案：「是否消耗专属元素精灵，并根据已转化次数，返还对应数量的元素晶石？」
    // ⇒ 只收**专属**；返还 = SERVANT_TO_ITEM[translate_type] × translate_times（1~2 个）。
    // m_element_restore_toc 是空 schema，客户端 handler 直接 return ⇒ 全靠 goods_update 刷新。
    m_element_restore_tos(conn, obj) {
      const ids = Array.isArray(obj && obj.goods_ids) ? obj.goods_ids.map(Number).filter(x => x > 0) : [];
      if (!ids.length) { tips(conn, ERR.EMPTY_SELECT); return; }
      const picked = [];
      for (const id of ids) {
        const g = goodsById(id);
        if (!isElem(g)) { tips(conn, ERR.NO_ITEM); return; }
        if (!isExclusive(g)) { reply(conn); return; }             // 泛用不能还原（否则等于白嫖晶石）
        if (Number(g.lock) === 1) { reply(conn); return; }
        if (equippedBy(id)) { tips(conn, ERR.EQUIPPED); return; }
        picked.push(g);
      }
      // 背包格数：先删后加，净变化 ≤ +picked.length，够用即可
      const refunds = picked.map(g => ({
        type: EL.SERVANT_TO_ITEM[Number(g.translate_type)],
        num: Math.min(2, Math.max(1, Number(g.translate_times) || 1)),
      })).filter(r => Number(r.type) > 0);
      if (refunds.reduce((n, r) => n + r.num, 0) > freeSlots() + picked.length) { tips(conn, ERR.BAG_FULL); return; }

      S.bagGoods = S.bagGoods.filter(g => !picked.includes(g));
      const added = [];
      for (const r of refunds) added.push(...grantGoods(r.type, r.num, conn));
      saveState();

      pushGoods(conn, added, picked);
      conn.sendToc('m_element_restore_toc', {});
      log(`[element] 还原 ${picked.length} 个专属精灵 → ${refunds.map(r => `${r.type}×${r.num}`).join(' ')}`);
    },
  },
};
