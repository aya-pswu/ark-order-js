// ★ 单机版补丁（prepare_assets.py 变换 5）：组51 主动补推能力核心背包（bag_type=4）。
//
// 组51 要求把刚获得的「生命核心」(19100001) 装到誓灵上；而客户端「能力核心」面板的候选列表
// 来自**登录时的全量快照**（m_goods_bag_info_tos{type:N} 只在登录拉一次，会话内不再刷新），
// 组40 开箱得到的核心只经 m_goods_update_toc 增量下发，**不重建该列表**
// → 面板空、点「+」无反应、引导卡在组51（真机 2026-09-16 实证；重进游戏即恢复）。
//
// 客户端 BagModule.m_goods_bag_info_toc 收到 bag_type=4 会执行
//   BagMgr.updateBags(slot0.bag)
//   + ServantModule.toPropRelicInfo()   ← 主动刷新能力核心面板
// 所以这里补推一次全量即可让该步可操作。字段口径与 handlers/bag.js 的 m_goods_bag_info_tos 一致。
function ensureCoreBagPush(conn) {
  const TYPE = 4; // BagConst.BAG_TYPE_CORE_RELIC
  try {
    conn.sendToc('m_goods_bag_info_toc', {
      bag: {
        bag_type: TYPE,
        size: L.bagSizeOf(TYPE),
        goods_list: S.bagGoods.filter(g => Number(g.bag_type) === TYPE && Number(g.type_id) > 0)
          .sort((a, b) => a.type_id - b.type_id)
          .map(L.goodsPGoods),
      },
    });
    log('[guide] 组51 补推能力核心背包（bag_type=' + TYPE + '）');
  } catch (e) {
    log('!! 组51 补推核心背包失败', e.message);
  }
}

function handleGuideDo(conn, obj) {
