// 自律派遣（tab6）数据表 —— 生成物，**不要手改数值**。
//
// 来源：真机字节码 `tools/lua_remote/bc/Config/CfgAutoDispatch.lua`（2026-10-27 反编译）
//   EnemiesCount[1] = { num = 6, special = { ...19 条... } }
//   —— key 1 = CopyUtil.getCopyType(copyId) 的主线档；special[copyId] 覆盖默认 num。
// 语义（客户端 DormConfig.getAutoDispatchEnemiesCount / MopUpSettingPanel）：
//   n = special[copyId] || num  = "一次派遣要打几场"（每场按一次出击扣体力）
// ⚠️ 与本地 `data/map_configs.js` 的 waves 数量**不总是相等**：40 张主线图里 21 张本地多 2 个
//    战斗点（wiki 道中数与官方战斗点数互有出入，见 `调研-10-4多余敌人.md`）。选点规则见
//    `handlers/auto_fight.js` 的 battlePoints()：场次恒取 n，多余时丢尾部道中、保 BOSS。
//
// 重新生成：`python tools/bc_cmp/gen_auto_dispatch.py`（换客户端版本时重跑，带条数断言）
const AUTO_ID = 101;          // CfgDorm.dispatchs[101]，type=2（DormConst.DISPATCH_AUTO）
const TAB = 6;                // DormConst.DISPATCH_TAB_AUTO
const TIME_PER_RUN = 240;     // CfgDorm.dispatchs[101].time —— 每次（整本）4 分钟
const TICKET_ID = 60000175;   // DormConst.DISPATCH_TICKET_ID（派遣券，只在自律派遣消耗）
const MAX_TIMES = 100;        // 客户端 MopUpSettingPanel: SetMinMaxValue(1, 100, 1)
const DEFAULT_N = 6;          // EnemiesCount[1].num

// EnemiesCount[1].special（19 条，官方覆盖值）
const SPECIAL_N = {
  1010100: 3, 1010200: 3, 1010300: 4, 1010400: 4,
  1020100: 4, 1020200: 4, 1020300: 4, 1020400: 5,
  1030100: 4, 1030200: 4, 1030300: 4, 1030400: 5, 1031400: 5,
  1040100: 5, 1040200: 5, 1040300: 5,
  1050100: 5, 1050200: 5, 1050300: 5,
};

// 一次派遣打几场（= 客户端算体力消耗用的乘数）。未知副本回默认 6（客户端会 printError 但不崩）
function enemiesCountOf(copyId) {
  const n = SPECIAL_N[Number(copyId)];
  return Number(n) > 0 ? Number(n) : DEFAULT_N;
}

module.exports = { AUTO_ID, TAB, TIME_PER_RUN, TICKET_ID, MAX_TIMES, DEFAULT_N, SPECIAL_N, enemiesCountOf };
