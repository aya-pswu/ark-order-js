// 活动/小游戏/任务/图鉴（重构自 start.js）
const { MISSIONS, S, saveState } = require('../state');
const L = require('../lib');
const { log, defaultFill, bagTypeOf, pushGoodsUpdate, pushAssetChange, progressOf } = L; // 解构导入，域内裸调用与单文件时代一致
const { MAP_CONFIGS } = require('../data/map_configs');
const GD = require('../data/guide_data');
// collab 三活动任务（60000-60017 苍色 / 55000-55007 星象馆）：并入任务表统一下发/推进/领取
//（文本/展示奖励在客户端 CfgMission 本地；服务端数据与其一致，来源 cfgmission_ljd 提取）
{
  const C = require('../data/collab_data');
  for (const m of C.BILI_MISSIONS.concat(C.PLAN_MISSIONS)) {
    if (!MISSIONS.some(x => x.id === m.id)) MISSIONS.push(m);
  }
}

// 开放的活动清单（m_role_acts_toc 下发）。ID 必须在客户端 CfgActivity 里存在，
// 否则 ActivityMgr.addAct 走"后端推了一个不存在的活动"报错分支；且 viewClass 必须非空
// （ActivityPanel.onActivitySelect 对选中项 create(viewClass)，nil 会崩——1083"能量晶石"
// viewClass 为空不能下发）。
// banner 显示（MainFunctionPanel.updateActs）：CfgActivity.showActvitys 每个 banner 的
// allActs 里任一活动被下发即点亮；福利大厅 banner(actKind=1) 由 1001/1002/1004/1005 点亮。
// state 语义：0未开/1可访问/2进行中/3可领奖/4结束。默认 2(ACTION) 满足 isOpenAct；1001 每日签到
// 下发时在 pushRoleActs 按签到状态动态取值：未签=3(REWARD) 触发登录弹签链，已签=2 避开
// dealwithSign 死胡同（见 pushRoleActs 内注释，2026-10-13）
const ACT_OPEN = [
  { id: 1001, state: 3 }, // 每日签到（福利大厅列表项；state=3 → 登录未签自动弹签到窗）
  { id: 1002, state: 2 }, // 登录福利
  { id: 1004, state: 2 }, // 等级奖励
  { id: 1005, state: 2 }, // 通关奖励
  // ⚠️ 1311 与 1107 是**同一活动「动荡的时空」的两个不同期**（CfgActivity 里同名、同 actKind=27、
  // 同 viewClass=ActivityStarDreamPermitView、同货币 scoreId=2250），只能在 ACT_OPEN 里留一个：
  // 两个同时下发会让 ActivityPanel 左侧列表出现两条同名项，且 rewards 领取状态各存一份
  // （actExtraState.sd1311 / sd1107），同一份时间晶体余额被两个面板各画一遍，状态互相矛盾。
  // 保留 1107 的依据（代码级，非视觉）：
  //   ① 只有 CfgActivity[1107] 有 objRule="objRule1"，即只有它会显示 prefab 里的规则文字块；
  //   ② 玩家存档里只有 sd1107.claimedR 有领取记录（sd1311 恒为空），说明实际使用的是 1107；
  //   ③ 1107 的 rewardsInfo 23 档 > 1311 的 19 档，与官方该期配置一致。
  // 1311 的专属 banner 与加速引擎商品（shop3 id=3010）一并下线，见 data/shop_data.js。
  // { id: 1311, state: 2 }, // ✗ 已移除：与 1107 重复
  { id: 1325, state: 2 }, // 冬日补给站（actKind=28，星梦通行证，专属 banner=1325）
  { id: 1327, state: 2 }, // 萌新补给站（actKind=28，星梦通行证，专属 banner=1327）
  { id: 1056, state: 2 }, // 音乐教室（actKind=21，专属 banner=1056；本身就是洛天依联动期，m_lty_* 协议族由此得名）
  { id: 1054, state: 2 }, // 洛天依汇总（actKind=19，专属 banner=1054；视图纯本地配置零协议）
  { id: 1053, state: 2 }, // 乐之旅途（actKind=18，好感度任务；洛天依汇总页按钮 isOpenAct(1053) 放行需要它）
  { id: 1052, state: 2 }, // 达拉崩吧（actKind=0，洛天依地图；主页 banner 1052 点亮与活动开放）
  { id: 1090, state: 2 }, // 糖果大作战（actKind=28，专属 banner=1090）
  { id: 1520, state: 2 }, // 糖果大作战（actKind=54，专属 banner=1520）
  { id: 1202, state: 2 }, // 勇者史莱喵（actKind=39，客户端 ActivityConst.ACT_JUMP_GAME=1202 硬编码）
  { id: 1012, state: 2 }, // 御灵士装扮（actKind=0 **不进主页 banner**，只作协会"养成"banner 的
  // DormChoiceItem.isOpenAct(1012) 开关——不下发则点击弹"唔喵~该活动还在搭建中~"（真机 2026-09-06）。
  // CfgActivity[1012] 无 viewClass 字段、无面板可开，不触发 1083 类 create(nil) 崩溃；
  // 引导组 62（GuideConfig.getGroupVO）也按 isOpenAct(1012) 放行御灵士功能引导
  // ⭐ 1009「召唤回响」= 纯开关，**不是**活动面板条目：CfgActivity[1009].actKind=0（无 viewClass），
  //    ActivityMgr.addAct 对 actKind==0 只建 VO、不 insert 进 getAllActList() ⇒ 左侧列表不会多一条
  //    点不开的项（这也是它敢不下发 viewClass 的原因）。它只喂 ActivityMgr.isOpenAct(ACT_ECHO)：
  //    ① SummonPanel.initUI → 主页"召唤"面板的"凭神回响"按钮显隐；
  //    ② SummonDecomposeSelectPanel.initUI → 誓约破除面板的"回响之契"列显隐。
  //    不下发 → 两处入口全部隐藏，回响商店在客户端任何路径都不可达（道具 form=2 不进背包）。
  { id: 1009, state: 2 }, // 召唤回响（凭神回响开关；actKind=0 纯开关，见上）
  // ⭐ 1013「银匙之门」= 同 1009 款的 actKind=0 纯开关（CfgActivity[1013] 无 viewClass）。
  //    全客户端唯一消费点：CopyMainLineView.onOpenMainView → Util.setActive(btnDream, isOpenAct(1013))
  //    ——主线页左侧「银匙之门」入口按钮的显隐唯一判据。不下发 → 按钮永久隐藏（二百九十九，
  //    与 1041 信仰开关同族 H7）。5-4 进度门由按钮自身的 spDreamLock 锁标承担，与活动开关无关。
  { id: 1013, state: 2 }, // 银匙之门（幻梦战入口开关；actKind=0 纯开关，见上）
  // ---- 2026-09-12 活动批量扩展（handlers/act_extra.js；入口机制见工作日志：
  //      主页 banner=showActvitys.allActs 任一下发即亮；活动面板左侧列表=全部已下发活动，不按 kind 过滤）----
  // 注：仍不下发——1077 星象馆/1674 刮刮乐（CookDimension VO 链深）/邀请族/hololive 1151（调研成本高，待后续）；1361 见下方说明
  { id: 1034, state: 2 }, // 圣诞活动（投票/兑换，act_extra 圣诞族）
  { id: 1046, state: 2 }, // 恋爱×告白（m_valentines_*）
  { id: 1057, state: 2 }, // 花咲樱月-誓（任务族）
  { id: 1058, state: 2 }, // 花咲樱月（m_white_valentine_* 积分兑换）
  { id: 1070, state: 2 }, // 绫音沁曲-愿（每日任务）
  { id: 1071, state: 2 }, // 绫音沁曲（积分兑换 70 档）
  { id: 1361, state: 2 }, // 小千日记（按天解锁任务 15 条）。⚠️ 本版客户端视图部分腐坏（2026-09-12 真机实证），
  // 但按用户拍板"能跑一半也行"保留下发：
  //  - 可用：面板打开（initUI 的 GoodsItem spOut 崩溃被 xpcall 吞掉仅报 LuaError，终奖图标缺失）、
  //    任务文字/进度/状态全显示（这些在渲染崩溃点之前已执行）、任务列表文本、登录天数推进；
  //  - 不可用：列表项奖励图标（setDbInfo 缺 status 字段 → BitUtil 崩，onGUI 中断在 missionVO 赋值前）
  //    → 点击列表按钮报 missionVO nil；终奖点击绑定也在崩溃点之后未挂上。
  //  - 领奖兜底：GM `m21_act_claim=1361=<任务id>`（15=最终奖），领后面板文字状态即时刷新。
  { id: 1415, state: 2 }, // 新春抽奖（复读机周年，m_repeater_anniversary_*）
  { id: 1417, state: 2 }, // 新春每日任务（任务族）
  { id: 1421, state: 2 }, // 爱神的季节小铺（score shop 55 + 1422 累计签到）
  { id: 1422, state: 2 }, // 爱神累计签到（D.ACCUM 会下发 1422 签到表；不下发则签到回包
  // 客户端 getActVO(1422) 索引 nil 崩——2026-10-12 真机实证。CfgActivity[1422] 存在且
  // actKind=0 不进 banner，形态同 1012 安全
  { id: 1490, state: 2 }, // 羲和的节日小屋（score shop 59）
  { id: 1624, state: 2 }, // 乞巧佳节（祈福 m_act_prize_*，最新期；灵巧=score 55）
  { id: 1630, state: 2 }, // 世界树计划（任务+积分奖励，专属 banner 已被官方移除，从活动面板列表进）
  { id: 1646, state: 2 }, // 巫山神女（积分兑换 39 档，瑶草=战斗掉落）
  { id: 1652, state: 2 }, // 希腊探索/誓灵频道（星座签到，最新期 1652）
  { id: 1694, state: 2 }, // 每日集结（建造点 2231 + 任务）
  { id: 1701, state: 2 }, // 古籍转译（无限池抽奖，诗文断章=score 2230）
  { id: 1711, state: 2 }, // 圣诞往事（人气票兑换 + 最小投票面板）
  { id: 1735, state: 2 }, // 元旦拼图（m_act_puzzle_*）
  { id: 1737, state: 2 }, // 薄明的圣夜（score shop 71；圣诞袜=2237/2238）
  { id: 1741, state: 2 }, // 天外来客（兑换 + 上贡祭坛 m_fantasy_casino_*）
  { id: 1742, state: 2 }, // 天外来客主线关卡（ACT_FANTASY / copyType 1742，愤怒之罪等）
  { id: 1743, state: 2 }, // 无限炼狱（ACT_FANTASY_AUTO）
  { id: 1744, state: 2 }, // 梭哈 / 上贡（ACT_FANTASY_DARE）
  { id: 1746, state: 2 }, // 光影交织第一期
  { id: 1747, state: 2 }, // 光影交织第二期
  { id: 1431, state: 2 }, // 兼容旧版常数
  { id: 1432, state: 2 },
  { id: 1433, state: 2 },
  { id: 1114, state: 2 },
  { id: 1782, state: 2 }, // 海神彼岸（Activity2LoginView 累计签到，banner kind=71）
  // ---- 2026-09-12 晚补齐（用户拍板"能跑一半也行"）：未调研完/半可用活动一并开放 ----
  { id: 1003, state: 2 }, // 首充奖励（本地服白送：打开→领取→奖励入包；面板尾部按钮显隐有 nil 比较瑕疵仅报错不致命）
  { id: 1008, state: 2 }, // 尘封的高塔（登录 60 天解锁→奖励发放；任务链显示为已领取态）
  { id: 1026, state: 2 }, // 苍色的试炼（Bili2233 累计签到走 accum 族；究极试炼副本/74 号兑换为入口保留未实装）
  { id: 1649, state: 2 }, // 二周年抽奖（每日任务→参与奖 14 天；客户端按 2020 年日期可能显示"已结束"，以真机为准）
  { id: 1706, state: 2 }, // 挑战关卡（七日面板+首通奖励；战斗复用当前地图点，见 map_fight m_copy_fight_tos 捕获）
  { id: 1360, state: 2 }, // 少女终末旅行主界面（banner kind=0 → OPEN_COPY_ACTIVITY_PANEL,1360；
  // 21 主线关逐关解锁 + 3 周回连战 + 4 剧场节点，全链路见 act_extra.js glasttour 段）
  // ---- 2026-09-12 三联动全链路（handlers/collab.js + data/collab_data.js；见工作日志 六十四）----
  { id: 1077, state: 2 }, // 星象馆通讯（banner actKind=26 → OPEN_ACTIVITY_PLANETARIAN_PANEL；星图21星+
  // SideStory1-3（剧场×2+战斗1079010100）+ 潘多拉的决意1080010101 + 任务55000-55007）
  { id: 1104, state: 2 }, // 约战主界面（banner kind=31 → OPEN_COPY_ACTIVITY_PANEL,1104；15关主线+
  // 剧场1104001-1104016 + 挑战1106 + 高难1109/1119 + 精灵信赖/加速引擎/勇者之路功能入口）
  { id: 1105, state: 2 }, // 精灵信赖（Activity2DataALivePanel，act_extra 五十五已实装；本轮校正官方阈值）
  { id: 1106, state: 2 }, // 约战周回（五河琴里的小礼物：1106010101/102 每日10次，掉联动圣器碎片）
  { id: 1107, state: 2 }, // 动荡的时空（StarDreamPermitView：时间晶体累计 20 档双轨，引擎轨需 buff 1108）
  { id: 1109, state: 2 }, // 约战一期高难（1109010101「食时之城」头像框，需通关 1-8）
  { id: 1119, state: 2 }, // 约战二期高难（1119010101「绝灭天使」头像框，需通关 2-7）
  { id: 1765, state: 2 }, // 苍色的试炼·复刻期（accum 签到 ACT_BILI_2233_RENOVATE=1765）
  { id: 1027, state: 2 }, // 究极试炼·一期战斗 act（Bili2233VO.FIGHT_ACT_ID；一期口径历史保留）
  { id: 1769, state: 2 }, // 究极试炼·复刻期战斗 act（Bili2233VO.FIGHT_ACT_ID_RENOVATE=1769）——
  // ActivityBili2233View.onOpen 仅当 isOpenAct(1769) 才发 m_copy_ultima_test_info_tos，
  // isOpenFight 也查它（2026-10-04 一百三十九：此前漏下发 → 按钮恒"稍后才开放"；actKind=0
  // 不进活动面板列表，与 1027 同理不会触发 viewClass=nil 崩溃）
];

// 信仰开关活动 1041「信仰灵光掉落」（CfgActivity[1041].actKind=0 纯开关，不进活动面板列表）。
// 按**进度**下发而不是常开，理由（2026-10-23 调研-信仰.md §3.2）：
//   ① 它控制誓灵详情「信仰」按钮显隐（ServantInfoPanel.lua:456 isOpenAct(1041)）；
//   ② 它控制关卡预览是否过滤 31000021（CopyConfig.getCopyDetail：关闭时 filter 掉信仰灵光）；
//   ③ 官方口径「通关剧情6-4后才可使用」（31000021/31000023 的 desc + CfgGuide funcOpenGuide 12）。
//   ⇒ 若常开，未通关 6-4 的玩家也能打开信仰面板并用信仰灵光/许愿卡，与文案冲突。
// GM `m21_faith=1` 走 S.faithOpenOverride 强制开启（当轮即时重推 m_role_acts_toc）。
const FAITH_UNLOCK_BARRIER = 1060400; // 主线 6-4
function faithGateOpen() {
  if (S.faithOpenOverride) return true;
  if (S.gmAllFunctions) return true;
  const prog = (S.mapProgress.maps || {})[FAITH_UNLOCK_BARRIER];
  const cfg = require('../data/map_configs').MAP_CONFIGS[FAITH_UNLOCK_BARRIER];
  return !!(prog && cfg && (prog.cleared || []).includes(cfg.bossPoint));
}

// ---- 糖果大作战（活动 1520 / 1090）配置与辅助 ----
// 稀有池与官方 CfgActivity.childrensDay 逐条一致（ljd 实证）。
// ⚠️ 池里 31235016 = 鲁格-雏光、31532022 = 凤凰-稚羽，都是**誓灵凭证**（id=3e7+type，form=3），
// 发放必须转誓灵（见 m_act_children_day_reward_tos 的分流注释），当普通道具入包就是死道具。
const SERVANT_TOKENS = require('../data/servant_token_data');
const TITLE_DATA = require('../data/title_data');
const CANDY_RARE_CONFIGS = {
  1520: [
    { id: 31235016, maxNum: 3, val: 1 }, // 鲁格-雏光（誓灵凭证 → 发誓灵）
    { id: 72000034, maxNum: 2, val: 1 }, // 元素晶石[鲁格-雏光]（canPile=false，逐实例）
    { id: 25001999, maxNum: 1, val: 1 }, // 称号盒「长不大的」
    { id: 31000026, maxNum: 1, val: 1 }, // 通用型信仰-改（洗练材料）
    { id: 21500038, maxNum: 1, val: 1 }, // 原初信仰遗物箱
    { id: 21007000, maxNum: 2, val: 1 }, // 原初圣器遗物箱
    { id: 21104000, maxNum: 2, val: 1 }, // 原初核心遗物箱
  ],
  1090: [
    { id: 31532022, maxNum: 3, val: 1 }, // 凤凰-稚羽（誓灵凭证 → 发誓灵）
    { id: 21007000, maxNum: 2, val: 1 },
    { id: 21104000, maxNum: 2, val: 1 },
    { id: 31000026, maxNum: 1, val: 1 },
  ],
};
const CANDY_COMMON_POOL = [
  { id: 30000000, val: 20 },   // 水晶x20
  { id: 20000000, val: 2 },    // 秩序之契x2
  { id: 20000001, val: 2 },    // 中立之契x2
  { id: 20000002, val: 2 },    // 混乱之契x2
  { id: 21001000, val: 1 },    // 旧式圣器遗物箱
  { id: 21002000, val: 1 },    // 制式圣器遗物箱
  { id: 31000016, val: 3 },    // 唤灵碎块x3
  { id: 31000032, val: 3 },    // 先祖之血x3
];

function checkDailyCandy() {
  if (!S.candyState) S.candyState = { remain: 200, buff_times: 0, protect_times: 20, rare: [], day: '', vitRem: 0 };
  const d = new Date();
  const today = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  if (S.candyState.day !== today) {
    if (!S.candyState.day) {
      S.candyState.day = today;
    } else {
      S.candyState.day = today;
      S.candyState.remain = Math.min(1400, (S.candyState.remain || 0) + 200);
    }
  }
}

function pushChildrenDayInfo(conn, actId) {
  if (!conn) return;
  const aid = (actId && Number(actId)) || 1520;
  conn.sendToc('m_act_children_day_info_toc', {
    act_id: aid,
    remain: S.candyState.remain || 0,
    rare_reward: S.candyState.rare || [],
    protect_times: S.candyState.protect_times != null ? S.candyState.protect_times : 20,
    buff_times: S.candyState.buff_times || 0,
  });
}

// 主线每关的「前置剧情」theater id（CfgCopy[节点].theater，按官方表逐关抽取）。
// **只列 theater，不能列 theaterEnd**：theaterEnd 是「通关后的收尾剧场」，
// 由 FightNavModule.quitFightCallback 在胜利结算后现场播放（START_THEATER_NOW）。
// 若服务端把 theaterEnd 也算进「已播放」下发，TheaterModule.startWithOutLoad 里
// `TheaterMgr.hasPlayed(tid) == false` 不成立 → 收尾剧场被静默跳过（40 关全中）。
// 生成：tools/bc_cmp/assert_boss_point.js 的同源抽取（CfgCopy_re.lua 的 theater 字段）。
const THEATER_PRE_BY_COPY = {
  1010100: [10006], 1010200: [10008, 10009], 1010300: [10011, 10012], 1010400: [10014, 10015],
  1020100: [10017], 1020200: [10019], 1020300: [10021], 1020400: [10023],
  1030100: [10025], 1030200: [10027], 1030300: [10029], 1030400: [10031],
  1040100: [10033], 1040200: [10035], 1040300: [10037], 1040400: [10039],
  1050100: [10041], 1050200: [10043], 1050300: [10045], 1050400: [10047],
  1060100: [10049], 1060200: [10051], 1060300: [10053], 1060400: [10055],
  1070100: [10057], 1070200: [10059], 1070300: [10061], 1070400: [10063],
  1080100: [10065, 10066], 1080200: [10068, 10069], 1080300: [10071, 10072], 1080400: [10074, 10075],
  1090100: [10151], 1090200: [10152], 1090300: [10154], 1090400: [10156],
  1100100: [10158], 1100200: [10160], 1100300: [10162], 1100400: [10164],
  1110100: [10174], 1110200: [10168], 1110300: [10170], 1110400: [10172], // ch11 theater 序（CfgCopy theater 字段原样；无 theaterEnd）
};

// 已播放剧情集合 = 客户端上报过的（S.theaterState.played） + 通关关卡的前置剧情推导。
//
// 为什么不推导 theaterEnd：见上表注释。另注意 9-1 的 theater 与 theaterEnd 是同一个 id(10151)——
// 若把 theaterEnd 也推导进来，该关收尾剧场同样永不播放。收尾剧场一律以客户端
// m_theatre_play_tos 上报为准（TheaterModule.toPlay → TheaterMgr.updatePlayed + 上报）。
//
// 前置剧情的推导条件用「本关已通关」：官方前置剧情都挂在关卡入口/道中节点上，
// 玩家实际是在进入关卡时触发；用通关状态兜底可保证重登后图鉴不回退（早期版本即如此）。
function playedTheaters() {
  const set = new Set(S.theaterState.played);
  for (const [barrierId, tids] of Object.entries(THEATER_PRE_BY_COPY)) {
    const cfg = MAP_CONFIGS[barrierId];
    if (cfg && (progressOf(Number(barrierId)).cleared || []).includes(cfg.bossPoint)) {
      tids.forEach(t => set.add(t));
    }
  }
  return [...set];
}

// p_mission 下发构造（客户端 Core/Proto.lua 7 字段版）。
// 关键：客户端 MissionVO.fillData 里 state = reward_times > 0 and STATE_FINISH or STATE_DOING，
// 按钮文案/红点只认 state——不下发 reward_times（编码成 0）时即使 counter 达标也恒显"前往"。
// reward_times=待领取次数（达标未领→1）；finish_times=已完成次数（领奖后客户端
// needShow() 按 finishTimes < maxFinish 决定移除，主线/日常/周常 maxFinish 均为 1）
function missionP(m) {
  const c = S.missionState.counters[m.id] || 0;
  const done = c >= m.num ? 1 : 0;
  return { id: m.id, counter: c, end_time: 0, daily_counter: 0, finish_times: done, reward_times: done, extra_reward: [] };
}

// ---- 日常/周常周期重置 ----
// dailyKey=本地日期；weeklyKey=本周一的本地日期。存档里为空/过期时检查即触发一次重置
//（group=2 日常：清计数+claimed+活跃度+宝箱领取记录；group=3 周常：清计数+claimed）
function localDay(t) {
  const d = new Date(t);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function weekKey(t) {
  const d = new Date(t);
  d.setDate(d.getDate() - (d.getDay() + 6) % 7); // 回到本周一
  return localDay(d);
}
function checkMissionReset() {
  const st = S.missionState;
  const dk = localDay(Date.now()), wk = weekKey(Date.now());
  const groups = [];
  if (st.dailyKey !== dk) { groups.push(2); st.dailyKey = dk; st.dailyActivity = 0; st.activityReward = []; }
  if (st.weeklyKey !== wk) { groups.push(3); st.weeklyKey = wk; }
  if (!groups.length) return;
  for (const g of groups) {
    for (const m of MISSIONS.filter(x => x.group === g)) {
      delete st.counters[m.id];
      const i = st.claimed.indexOf(m.id);
      if (i >= 0) st.claimed.splice(i, 1);
    }
  }
  saveState();
  log(`[mission] 周期重置：${groups.includes(2) ? '日常 ' : ''}${groups.includes(3) ? '周常' : ''}（计数/领取/活跃度已清）`);
}

// ---- 日常活跃度宝箱（客户端 CfgMission.activity，按下标 1-based 领取：m_mission_activity_tos {id:下标}）----
const ACTIVITY_CHESTS = [
  { num: 20, rewards: [[20016001, 1], [30000003, 200]] },
  { num: 40, rewards: [[20000900, 2], [30000003, 200]] },
  { num: 70, rewards: [[21003000, 1], [30000003, 200], [28000025, 1]] },
  { num: 100, rewards: [[30000000, 10], [30000002, 50], [30000003, 200]] },
];

// 任务进度推进。事件→condType 映射（CfgMission.conditionTip，**1 基**，MissionVO 直接用 condType 索引）：
//   passLevel="X-X"/任意通关→51/52（通关指定关卡，args 精确匹配）/12（通关N次）
//   dailyCopy="修炼|进化|圣器"→13（通关曜日关卡N次；args 为 "曜日"=任意章 或 "曜日修炼" 指定章）
//   login=true→20（累计登录天数，按日去重）；dispatch=true→8（远征派遣）；
//   trainCount=n→16（进行 N 次誓灵训练）；breakCount=n→17（进行 N 次誓灵突破）；
//   kill=n→5/25（击败誓灵）。
//
// ⚠️ 16/17 曾经接反（突破被记成 16）。conditionTip 原文：
//   [16]="进行{0}次誓灵训练" / [17]="进行{0}次誓灵突破" ⇒ 训练=16、突破=17。
//   受影响任务：日常 10013（训练 2 次）、周常 20008（训练 20 次）、周常 20009（突破 1 次，此前永远拿不到）。
//   另注：cond 16 还有 collab 侧任务（60005/55005），它们带 `collab:1` 标记，只走下方 collab 分支，
//   通用分支排除，避免一次训练被计两遍。
//   变更后推 m_mission_update_toc（客户端按 p_mission 形状消费）
function advanceMissions(conn, ev) {
  checkMissionReset(); // 登录/事件入口顺带做周期重置（幂等）
  const changed = [];
  const today = new Date().toISOString().slice(0, 10);
  const bump = (m, val) => {
    const cur = Math.min(m.num, Math.max(S.missionState.counters[m.id] || 0, val));
    if (cur !== (S.missionState.counters[m.id] || 0)) {
      S.missionState.counters[m.id] = cur;
      changed.push(m);
    }
  };
  for (const m of MISSIONS) {
    if (S.missionState.claimed.includes(m.id)) continue;
    if (ev.passLevel != null) {
      if ((m.cond === 51 || m.cond === 52) && (m.args === ev.passLevel || m.args === '任意')) {
        bump(m, m.num);
      } else if (m.cond === 12) {
        bump(m, (S.missionState.counters[m.id] || 0) + 1);
      }
    }
    if (ev.exPassLevel != null) {
      // 主线 EX 挑战关（挑战模式X-X）：cond52 args 精确匹配（missions_data 33000~33006"挑战模式3-4"…）；
      // cond55"任意挑战模式"（20014/20015，num=9 次）按参与次数 +1；cond12 通关 N 次同步 +1
      if ((m.cond === 51 || m.cond === 52) && (m.args === ev.exPassLevel || m.args === '任意')) {
        bump(m, m.num);
      } else if (m.cond === 55 && m.args === '任意挑战模式') {
        bump(m, (S.missionState.counters[m.id] || 0) + 1);
      } else if (m.cond === 12) {
        bump(m, (S.missionState.counters[m.id] || 0) + 1);
      }
    }
    if (ev.dailyCopy && m.cond === 13 && (m.args === '曜日' || m.args === '曜日' + ev.dailyCopy)) {
      bump(m, (S.missionState.counters[m.id] || 0) + 1);
    }
    if (ev.login && m.cond === 20 && S.missionState.lastLoginDay !== today) {
      bump(m, (S.missionState.counters[m.id] || 0) + 1);
    }
    if (ev.dispatch && m.cond === 8) {
      bump(m, (S.missionState.counters[m.id] || 0) + 1);
    }
    if (ev.breakCount && m.cond === 17 && !m.collab) {
      // 进行 N 次誓灵突破（CfgMission.conditionTip[17]）——日常 20009 周常
      bump(m, (S.missionState.counters[m.id] || 0) + ev.breakCount);
    }
    if (ev.trainCount && m.cond === 16 && !m.collab) {
      // 进行 N 次誓灵训练（CfgMission.conditionTip[16]）——日常 10013 / 周常 20008。
      // 排除活动任务 60005/55005（`!m.collab`），它们由 collab 分支单独推进。
      bump(m, (S.missionState.counters[m.id] || 0) + ev.trainCount);
    }
    if (ev.gainServant && m.cond === 66) {
      // 通过战斗或召唤获得誓灵N名（CfgMission.conditionTip[66]）
      bump(m, (S.missionState.counters[m.id] || 0) + ev.gainServant);
    }
    if (ev.summonCount && m.cond === 7) {
      // 进行N次誓灵召唤（友情池亦可）——日常 10006 / 周常 20002（CfgMission.conditionTip[7]）
      bump(m, (S.missionState.counters[m.id] || 0) + ev.summonCount);
    }
    if (ev.kill && (m.cond === 5 || (m.cond === 25 && !m.collab))) {
      // cond 25 通用语义=击败誓灵（193 张旧表无此 cond）；collab 的 25=训练员击杀走下方专用分支，
      // 必须排除（普通关击杀不该推进"击败N名训练员"）
      bump(m, (S.missionState.counters[m.id] || 0) + ev.kill);
    }
    // ---- collab 三活动任务扩展（data/collab_data.js：60000-60017 苍色 / 55000-55007 星象馆）----
    // cond 语义（按 CfgMission group4 各期 args 反推）：25=击杀训练员(args 精确/任意)、26=究极试炼评级、
    // 68=活动签到、69=完成4个活动日常、70=消耗金币、16=誓灵训练、14=誓约破除、8=神迹演武、9=远征派遣、
    // 7=召唤（与通用分支的 7/16 语义不冲突：collab 事件只进本分支，不传 kill/passLevel 等通用键）
    //
    // ⚠️ cond16 是本族里**唯一同时存在通用任务和活动任务**的编号（通用：日常 10013 / 周常 20008；
    //   活动：60005 苍色 / 55005 星象馆）。所以这一条必须加 `&& m.collab`——否则一次训练会把
    //   通用任务也一起 +1，再叠加训练 handler 新推的 trainCount 就是**一次训练计两遍**
    //   （2026-10-23 冒烟实测 10013=2/2，改后 1/2）。其余 cond 在通用表里没有同号任务，保持原样。
    if (ev.collab) {
      if (ev.collabKillTrainers && m.cond === 25) {
        const kinds = ev.collabKillTrainers;
        const n = m.args === '任意训练员'
          ? Object.values(kinds).reduce((a, b) => a + b, 0)
          : (kinds[m.args] || 0);
        if (n) bump(m, (S.missionState.counters[m.id] || 0) + n);
      }
      if (ev.ultimaGrade != null && m.cond === 26) {
        const need = { C: 1, B: 2, A: 3, S: 4, SS: 5, SSS: 6 }[m.args];
        if (need && ev.ultimaGrade >= need) bump(m, 1);
      }
      if (ev.planSign && m.cond === 68) bump(m, 1);
      if (ev.planDailyDone && m.cond === 69) bump(m, (S.missionState.counters[m.id] || 0) + 1);
      if (ev.silverSpent && m.cond === 70) bump(m, (S.missionState.counters[m.id] || 0) + ev.silverSpent);
      if (ev.collabTrain && m.cond === 16 && m.collab) bump(m, (S.missionState.counters[m.id] || 0) + ev.collabTrain);
      if (ev.collabOathbreak && m.cond === 14) bump(m, (S.missionState.counters[m.id] || 0) + ev.collabOathbreak);
      if (ev.collabMiracle && m.cond === 8) bump(m, (S.missionState.counters[m.id] || 0) + ev.collabMiracle);
      if (ev.collabDispatch && m.cond === 9) bump(m, (S.missionState.counters[m.id] || 0) + ev.collabDispatch);
      if (ev.collabSummon && m.cond === 7) bump(m, (S.missionState.counters[m.id] || 0) + ev.collabSummon);
      // 通关主线 N 次（60010/55002 args=主线）：只认主线关（通用分支的 passLevel 事件在 collab 结算不发）
      if (ev.collabMainPass && m.cond === 12 && m.args === '主线') bump(m, (S.missionState.counters[m.id] || 0) + 1);
    }
  }
  if (ev.login && S.missionState.lastLoginDay !== today) {
    S.missionState.lastLoginDay = today;
  }
  if (changed.length) {
    saveState();
    conn.sendToc('m_mission_update_toc', {
      list: changed.map(missionP),
    });
    log(`[mission] 进度更新 ${changed.length} 项：${changed.slice(0, 5).map(m => `${m.id}=${S.missionState.counters[m.id]}/${m.num}`).join(' ')}${changed.length > 5 ? ' …' : ''}`);
  }
}

// 任务奖励发放：30000003 金币/30000000 水晶/30000002 体力走资产，其余入背包。
// 例外：**道具形态的积分**（data/score_items.js = 客户端 CfgScoreItem ∩ CfgItems.form=2，
// 例：31000002 友情点→score2、31000009 协会点数→score4）发放直接落 role_scores——
// 客户端这类道具的持有数读 GlobalData.getScore(scoreId)，且 form=2 不在背包显示，
// 入包会导致"看不到 + 功能判定永远不足"（协会点解锁休息位/制作家具就卡在这）。
//
// ⚠️ 二百八十四（2026-10-31）：此前漏了 30000002 体力分支——CfgItems[30000002].form=2，
// 掉进 grantGoods 变成 bagGoods 幽灵条目，客户端 m_goods_update_toc 的 isToBag(form=2)=false
// 闸门把 op=3 静默丢弃 ⇒ "体力领了不增加"。同文件 grantRewardItems（等级奖励）一直有该分支
//（vit.addVit），同一坑两通道两表现。体力=role_scores[5]，顶栏 GlobalData.vit 由
// m_vit_update_toc 喂（GlobalData.updateScore 对 id=5 也会同步，但推送口径统一走 addVit）。
// 货币/积分同时补进弹窗列表（grantRewardItems 同款 {id:0, type_id, cur_num, bag_type:1}，
// BagGetItemVO.setData 只读 type_id/cur_num）：此前任务弹窗只列入包物品，金币/体力/积分
// "领了看不见"，用户侧就是"很多东西领了不进背包"。
// opts.noPopup=true：不推弹窗包、只返回弹窗条目——id=0「全部领取」整组合并成一次弹窗用
//（此前每个任务各推一次 type=1 → openGetItemsPanel 一次 = 领 44 个任务弹 44 个窗）。
function grantMissionRewards(conn, rewards, opts) {
  const popupGoods = [];
  const updated = [];
  let assetChanged = false;
  const TK = require('../data/servant_token_data');
  for (const [typeId, num] of rewards) {
    if (typeId === 30000003) {
      S.roleAsset.silver += num;
      assetChanged = true;
      popupGoods.push({ id: 0, type_id: typeId, cur_num: num, bag_type: 1 });
    } else if (typeId === 30000000) {
      S.roleAsset.gold += num;
      S.roleAsset.gold_given += num;
      assetChanged = true;
      popupGoods.push({ id: 0, type_id: typeId, cur_num: num, bag_type: 1 });
    } else if (typeId === 30000002) {
      try { require('./vit').addVit(conn, num); } catch (e) { log('[mission] 发放体力失败: ' + (e && e.message)); }
      popupGoods.push({ id: 0, type_id: typeId, cur_num: num, bag_type: 1 });
    } else if (L.grantScoreItem(conn, typeId, num)) {
      // 已落 role_scores 并推送 m_role_score_change_toc，不入包
      popupGoods.push({ id: 0, type_id: typeId, cur_num: num, bag_type: 1 });
    } else if (TK.isServantToken(typeId)) {
      // 誓灵代币（3+7 位，icon=UI/Servant/...，如 31836002=33/31131006=史莱喵）＝"获得该誓灵"：
      // 转 grantServant 入誓灵栏（3s 后 m_servant_update_toc 宣告），严禁入包——bag 后落在
      // 材料页，不可使用无效果（官方兑换/签到表语义同此）。num>1 = 发多只（重复誓灵合法）
      const st = TK.servantTypeOfToken(typeId);
      for (let i = 0; i < Math.max(1, num); i++) require('./collab').grantServant(conn, st);
    } else {
      // 统一走 grantGoods（2026-10-25）：元素晶石（72 前缀）等 canPile=false 实例类必须逐实例带
      // spec_data，手写堆叠会造出 D17 崩溃族的坏实例（巫山 1646 积分 #13/#28 的 71000001 曾命中）；
      // 称号盒同理由 grantGoods 的称号分支处理。UPDATE 用返回的 changed（实例类是 N 条）。
      const got = L.grantGoods(typeId, num, conn);
      if (got && got.length) {
        updated.push(...got);
        // ⚠️ 2026-10-14（一百七十九）弹窗包 cur_num 必须是【本次获得量】，不能传背包对象：
        // 客户端 m_goods_update_toc 的 type=1 分支把 goods[i].cur_num 原样塞进 BagGetItemVO
        // （BagModule 反编译：openGetItemsPanel 的列表项 curNum = slot7.cur_num），得到物品
        // "获得道具"弹窗显示的就是这个数——此前误传背包对象引用（背包总量）→ 领 10 个显示
        // "仓库总量+10"（如仓库 1365 + 得 10 → 弹 1375），仓库数据本身正确，纯显示错误。
        // grantRewardItems（1004/1005 页签奖励）一直传本次量故从未异常——同一坑两通道两表现。
        // 弹窗用实收道具的 type_id（got[0]）：grantGoods 的死箱转换分支（二百七十八）会把
        // 进化素材Lv1/2/3 转成百变素材模型——弹窗若仍按请求的 typeId 报，会弹一个包里没有的道具。
        const gotType = got && got[0] ? Number(got[0].type_id) : typeId;
        popupGoods.push({ id: got && got[0] ? got[0].id : 0, type_id: gotType, cur_num: num, bag_type: bagTypeOf(gotType) });
      }
    }
  }
  if (assetChanged) pushAssetChange(conn);
  // 奖励数据落包（op=3 UPDATE：不存在则 addItem，存在则覆盖）必须先于弹窗包。
  if (updated.length) pushGoodsUpdate(conn, updated, 3);
  // 奖励弹窗载体（组30 步3/组40 步4 等 ON_BAG_GET_ITEMS_CLOSE，缺它引导卡死——2026-09-05 真机实证）：
  // 客户端 m_goods_update_toc 只在 type=1(GOODS_OP_NEW) 且 needShowReward(reward_type) 时
  // openGetItemsPanel（BagModule 反编译实证）；UPDATE 分支只改背包数据不弹窗。
  // noPopup 模式（id=0 整组领取）只收集不推，由调用方合并成一条后统一推。
  if (!(opts && opts.noPopup) && popupGoods.length) pushGoodsUpdate(conn, popupGoods, 1);
  return popupGoods;
}



// 音乐教室结算（正式版/lty 版 end_toc 字段一致：id/max_score/point/sum_point）
function settleMusicGame(obj) {
  const id = (obj && obj.id) || 0;
  const active = S.musicState.playing;
  if (!active) return { id, max_score: ((S.musicState.scores || {})[id] || {}).max_score || 0, point: 0, sum_point: S.musicState.today };
  const elapsed = Math.floor(Date.now() / 1000) - Number(active.at || 0);
  if (elapsed < 2 || elapsed > 30 * 60) {
    S.musicState.playing = null;
    return { id, max_score: ((S.musicState.scores || {})[id] || {}).max_score || 0, point: 0, sum_point: S.musicState.today };
  }
  // 兼容旧客户端未发 start 的情况；若已有进行中的曲目，禁止用另一首曲目的 end 包覆盖它。
  if (active && Number(active.id) !== Number(id)) {
    const old = S.musicState.scores[id] || { max_score: 0, max_combo: 0 };
    return { id, max_score: old.max_score, point: 0, sum_point: S.musicState.today };
  }
  const rawScore = Number(obj && obj.score);
  const rawCombo = Number(obj && obj.combo);
  const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(1000000, Math.floor(rawScore))) : 0;
  const combo = Number.isFinite(rawCombo) ? Math.max(0, Math.min(100000, Math.floor(rawCombo))) : 0;
  const maxByTime = Math.max(0, Math.floor((elapsed - 2) * 5000));
  const acceptedScore = Math.min(score, maxByTime);
  const st = S.musicState.scores[id] || (S.musicState.scores[id] = { max_score: 0, max_combo: 0 });
  if (acceptedScore > st.max_score) st.max_score = acceptedScore;
  if (combo > st.max_combo) st.max_combo = combo;
  S.musicState.today = Math.min(100, S.musicState.today + acceptedScore);
  S.musicState.playing = null;
  saveState();
  return { id, max_score: st.max_score, point: acceptedScore, sum_point: S.musicState.today };
}

// 等级奖励配置（官方 CfgActivity[1004] 对应 6 档）
const LEVEL_REWARDS = {
  5: [
    { id: 21102000, num: 2 }, // 制式核心遗物箱x2
    { id: 21002000, num: 2 }, // 制式圣器遗物箱x2
  ],
  10: [
    { id: 31000009, num: 50 },  // 协会点数x50
    { id: 30000002, num: 500 }, // 体力x500
    { id: 30000003, num: 2000 },// 金币x2000
  ],
  20: [
    { id: 31131006, num: 1 }, // 灵契契约书x1
    { id: 31000004, num: 1 }, // 约定之契x1
    { id: 21103000, num: 1 }, // 精锐核心遗物箱x1
    { id: 21003000, num: 1 }, // 精锐圣器遗物箱x1
  ],
  30: [
    { id: 31131006, num: 1 },  // 灵契契约书x1
    { id: 21103000, num: 2 },  // 精锐核心遗物箱x2
    { id: 21003000, num: 2 },  // 精锐圣器遗物箱x2
    { id: 31000009, num: 100 },// 协会点数x100
  ],
  40: [
    { id: 31141007, num: 1 },   // 突破材料x1
    { id: 31000004, num: 2 },   // 约定之契x2
    { id: 30000002, num: 2000 },// 体力x2000
    { id: 30000003, num: 10000 },// 金币x10000
  ],
  50: [
    { id: 31141007, num: 1 }, // 突破材料x1
    { id: 21104000, num: 2 }, // 史诗核心遗物箱x2
    { id: 21007000, num: 2 }, // 史诗圣器遗物箱x2
    { id: 31000004, num: 2 }, // 约定之契x2
  ],
};

function lrState() {
  if (!S.levelRewardState) S.levelRewardState = { claimed: [] };
  if (!Array.isArray(S.levelRewardState.claimed)) S.levelRewardState.claimed = [];
  return S.levelRewardState;
}

// 统一发奖辅助（支持银币/水晶/体力/道具形态积分/誓灵代币/背包道具与圣器核心/弹窗）
function grantRewardItems(conn, rewards, opts) {
  let assetChanged = false;
  const grantedGoods = [];
  const popupGoods = [];
  const TK = require('../data/servant_token_data');

  for (const item of (rewards || [])) {
    const tid = Number(item.id);
    const count = Number(item.num) || 0;
    if (tid === 30000003) {
      S.roleAsset.silver = (Number(S.roleAsset.silver) || 0) + count;
      assetChanged = true;
      popupGoods.push({ id: 0, type_id: tid, cur_num: count, bag_type: 1 });
    } else if (tid === 30000000) {
      S.roleAsset.gold = (Number(S.roleAsset.gold) || 0) + count;
      S.roleAsset.gold_given = (Number(S.roleAsset.gold_given) || 0) + count;
      assetChanged = true;
      popupGoods.push({ id: 0, type_id: tid, cur_num: count, bag_type: 1 });
    } else if (tid === 30000002) {
      try {
        require('./vit').addVit(conn, count);
      } catch (e) {
        log('[reward] 发放体力失败: ' + (e && e.message));
      }
      popupGoods.push({ id: 0, type_id: tid, cur_num: count, bag_type: 1 });
    } else if (L.grantScoreItem(conn, tid, count)) {
      popupGoods.push({ id: 0, type_id: tid, cur_num: count, bag_type: 1 });
    } else if (TK.isServantToken(tid)) {
      // 誓灵代币（3+7 位凭证）＝"获得该誓灵"：与 grantMissionRewards 同口径转 grantServant
      // （conn 透传 ⇒ 3s 延迟宣告）。消费方实锤：LEVEL_REWARDS Lv40/50 的 31141007（黄金史莱喵，
      // 旧注释误标"突破材料"）、FB_REWARDS 6 条里程碑誓灵凭证。漏分支+漏 conn 会变成静默入档，
      // 玩家"领了没到账"（重登才补见）。popup 不列凭证——出卡动画由 m_servant_update_toc 承担。
      const st = TK.servantTypeOfToken(tid);
      for (let i = 0; i < Math.max(1, count); i++) require('./collab').grantServant(conn, st);
    } else {
      const got = L.grantGoods(tid, count, conn);
      if (got && got.length) {
        for (const g of got) grantedGoods.push(g);
        // 弹窗用实收 type_id（死箱转换后 got[0] 是百变素材模型，不是请求的进化素材箱）
        const gotType = Number(got[0].type_id) || tid;
        popupGoods.push({ id: got[0] ? got[0].id : 0, type_id: gotType, cur_num: count, bag_type: bagTypeOf(gotType) });
      }
    }
  }

  if (!opts || opts.persist !== false) saveState();

  if (assetChanged) pushAssetChange(conn);
  if (grantedGoods.length) pushGoodsUpdate(conn, grantedGoods, 3);
  if (popupGoods.length) pushGoodsUpdate(conn, popupGoods, 1);
}

// ---- 乐之旅途（活动 1053，ActivityLTYFavorableView 好感度任务配置）----
const LTY_FAVOR_REWARDS = {
  1: { id: 30000003, num: 2000 },
  2: { id: 30000002, num: 500 },
  3: { id: 20016002, num: 10 },
  4: { id: 20000904, num: 10 },
  5: { id: 20000905, num: 10 },
  6: { id: 45040064, num: 1 },
  7: { id: 21007000, num: 1 },
  8: { id: 21104000, num: 1 },
  9: { id: 31000004, num: 1 },
  10: { id: 17000004, num: 1 },
};

const LTY_FAVOR_ARGS = {
  1: 1,
  2: 20,
  3: 6,
  4: 5,
  5: 30,
  6: 20,
  7: 10,
  8: 1,
  9: 1,
  10: 9,
};

function getFavorState() {
  if (!S.actFavorState) S.actFavorState = { favor: 0, claimed: [], is_helper: 0, counters: {} };
  if (!Array.isArray(S.actFavorState.claimed)) S.actFavorState.claimed = [];
  if (!S.actFavorState.counters) S.actFavorState.counters = {};
  if (typeof S.actFavorState.favor !== 'number') S.actFavorState.favor = 0;
  return S.actFavorState;
}

function getFavorMissionVal(id, st) {
  const clearedCount = Object.values(S.mapProgress.maps)
    .reduce((n, p) => n + (p.cleared || []).length, 0);
  switch (id) {
    case 1:
      return Math.min(1, Math.max(clearedCount, (st.counters && st.counters[1]) || 0));
    case 2: {
      const disp = (S.achvState && S.achvState.counters && S.achvState.counters.dispatch) || 0;
      return Math.min(20, Math.max(disp, (st.counters && st.counters[2]) || 0));
    }
    case 3: {
      const daily = Object.values((S.dailyCopyState && S.dailyCopyState.times) || {}).reduce((a, b) => a + b, 0)
        + ((S.dailyCopyState && S.dailyCopyState.cleared) || []).length;
      return Math.min(6, Math.max(daily, (st.counters && st.counters[3]) || 0));
    }
    case 4:
      return Math.min(5, Math.max(clearedCount, (st.counters && st.counters[4]) || 0));
    case 5: {
      return Math.min(30, (st.counters && st.counters[5]) || 0);
    }
    case 6: {
      const boss = (S.familyState && S.familyState.bossUseTimes) || 0;
      return Math.min(20, Math.max(boss, (st.counters && st.counters[6]) || 0));
    }
    case 7:
      return Math.min(10, Math.max(clearedCount, (st.counters && st.counters[7]) || 0));
    case 8: {
      const towerMax = Math.max(
        (S.towerState && S.towerState.historyMax) || 0,
        (S.towerState && S.towerState.weekMax) || 0
      );
      return (towerMax >= 25 || ((st.counters && st.counters[8]) || 0) >= 1) ? 1 : 0;
    }
    case 9: {
      const dareDef = (S.dareState && S.dareState.defeated) || [];
      return (dareDef.length >= 1 || ((st.counters && st.counters[9]) || 0) >= 1) ? 1 : 0;
    }
    case 10: {
      return st.claimed.filter(x => x >= 1 && x <= 9).length;
    }
    default:
      return 0;
  }
}

function getFavorScore(st) {
  const claimedCount = st.claimed.filter(x => x >= 1 && x <= 9).length;
  if (st.claimed.includes(10) || claimedCount >= 9) return 100;
  return claimedCount * 10;
}

// ---- 通关奖励（活动 1005，ActivityFbRewardView）----
const FB_REWARDS = [
  { id: 1, copyID: 1010200, rewards: [{ id: 31114013, num: 1 }, { id: 21103000, num: 1 }, { id: 21003000, num: 1 }, { id: 31000009, num: 100 }] },
  { id: 2, copyID: 1010400, rewards: [{ id: 31324005, num: 1 }, { id: 21103000, num: 2 }, { id: 21003000, num: 2 }, { id: 31000009, num: 200 }, { id: 32000029, num: 1 }] },
  { id: 3, copyID: 1020400, rewards: [{ id: 31533005, num: 1 }, { id: 21103000, num: 5 }, { id: 21003000, num: 5 }, { id: 31000009, num: 500 }, { id: 32000030, num: 1 }] },
  { id: 4, copyID: 1030200, rewards: [{ id: 31434017, num: 1 }, { id: 21104000, num: 2 }, { id: 21007000, num: 2 }, { id: 31000009, num: 800 }] },
  { id: 5, copyID: 1030400, rewards: [{ id: 31046002, num: 1 }, { id: 21104000, num: 5 }, { id: 21007000, num: 5 }, { id: 31000009, num: 1000 }] },
  { id: 6, copyID: 1040400, rewards: [{ id: 31545002, num: 1 }, { id: 21104000, num: 10 }, { id: 21007000, num: 10 }, { id: 31000009, num: 1500 }] },
];

function getCopyRewardState() {
  if (!S.copyRewardState) S.copyRewardState = { claimed: [] };
  if (!Array.isArray(S.copyRewardState.claimed)) S.copyRewardState.claimed = [];
  return S.copyRewardState;
}

function isCopyCleared(copyID) {
  const cfg = MAP_CONFIGS[copyID];
  const prog = progressOf(Number(copyID));
  if (cfg && cfg.bossPoint) {
    return (prog.cleared || []).includes(cfg.bossPoint);
  }
  return !!(prog && prog.cleared && prog.cleared.length > 0);
}

// ---- 每日签到（活动 1001）数据与周期 ----
// 官服为整月签到（prefab 反序列化实测）：主视图 ActivitySignView 与签到弹窗 ActivitySignPopPanel
// 的奖励列表都是 CList.columns=8 × 4 行=32 格月历底板，右上角文案"刷新时间：每月1号 00:00"；
// CfgActivity[1001].startShowServantItemDay=23——BagModule.openItemOperaPanel 拦截签到表里
// UI/Servant/ 图标的奖励，当月日期≥23 才允许点开誓灵图鉴（之前点只弹"暂时无法查看誓灵的详细
// 情报"）→ 官服把誓灵大奖放 23 日位。故奖励表按当月天数生成 28~31 项：誓灵大奖固定 23 日位、
// 月末最后一天水晶×500 大奖；列表全由服务端下发，客户端零改动自动铺满 4 行。
const SIGN_SERVANT_DAY = 23;        // 誓灵大奖位（≥startShowServantItemDay=23 客户端才可点开图鉴）
const SIGN_SERVANT_TYPE = 1836002;  // SR 誓灵 33 的**誓灵类型**（grantServant 入队用）
const SIGN_SERVANT_ITEM = 31836002; // 33 的**物品形态** type_id = 30000000+1836002（CfgItems 在册、
// icon=UI/Servant/...183600201。签到表显示必须用它：SignGoodsVO.copy→getItemVO(type_id) 查无此 id
// 会返回 nil 配置 VO → SignGoodsItem.onGUI 读 icon 即崩；裸 1836002 不在 CfgItems）
const SIGN_BASE = [                 // 1~28 日位 [type_id, num]（全部为 CfgItems 可查 id）
  [30000000, 50],   // 1 水晶
  [20000000, 2],    // 2 秩序之契
  [21001000, 1],    // 3 旧式圣器遗物箱
  [20000001, 2],    // 4 中立之契
  [30000000, 100],  // 5 水晶
  [21002000, 1],    // 6 制式圣器遗物箱
  [30000000, 150],  // 7 周大奖
  [20000002, 2],    // 8 混乱之契
  [31000016, 3],    // 9 唤灵碎块
  [30000000, 100],  // 10 水晶
  [31000032, 3],    // 11 先祖之血
  [31000026, 1],    // 12 召唤契约券
  [21007000, 1],    // 13 圣器遗物箱
  [30000000, 200],  // 14 周大奖
  [20000000, 3],    // 15 秩序之契
  [31000016, 5],    // 16 唤灵碎块
  [30000000, 150],  // 17 水晶
  [31000032, 5],    // 18 先祖之血
  [31000026, 2],    // 19 召唤契约券
  [21104000, 1],    // 20 核心遗物箱
  [30000000, 250],  // 21 周大奖
  [20000001, 3],    // 22 中立之契
  [SIGN_SERVANT_ITEM, 1], // 23 誓灵大奖（显示=物品形态 33；发放走 grantServant 入队，见 sign handler）
  [30000000, 200],  // 24 水晶
  [31000026, 3],    // 25 召唤契约券
  [21104000, 2],    // 26 核心遗物箱
  [21007000, 2],    // 27 圣器遗物箱
  [21500038, 1],    // 28 高级圣器盒
];
const SIGN_EXT = [                  // 29/30/31 日位
  [21003000, 1],    // 新制圣器遗物箱
  [31000026, 3],    // 召唤契约券
  [30000000, 500],  // 水晶（31 天月的月末大奖）
];
function signDaysInMonth(ym) {
  const y = Math.floor(ym / 100), m = ym % 100;
  return new Date(y, m, 0).getDate(); // day=0 → 当月最后一天（m 为 1-based 月）
}
function signRewardsFor(ym) {
  const n = signDaysInMonth(ym);
  const list = [];
  for (let d = 1; d <= n; d++) {
    const pair = d <= 28 ? SIGN_BASE[d - 1] : SIGN_EXT[d - 29];
    list.push({ day: d, type_id: pair[0], num: pair[1], effect: 0 });
  }
  const last = list[list.length - 1];
  last.type_id = 30000000; last.num = 500; // 月末大奖：28/30 天月覆盖到当月最后一位
  return list;
}
function signTodayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
// 换月（或首签）重开周期：listId=当前 YYYYMM，days/lastDay 归零
function ensureSignCycle() {
  if (!S.signState) S.signState = { listId: 0, days: 0, lastDay: '' };
  const d = new Date();
  const ym = d.getFullYear() * 100 + d.getMonth() + 1;
  if (S.signState.listId !== ym) {
    S.signState = { listId: ym, days: 0, lastDay: '' };
  }
  return S.signState;
}

// ---- 教程期签到押后（2026-11-02 二百九十四）----
// 判据 = 引导档（S.guideState 非空）且主线链最后组 52 未完成。老档 guideState=null
// （引导全完成口径）恒 false ⇒ 老存档零行为变化。
// 之所以要服务端门而不是只改 1001 的 act 状态：客户端 m_role_sign_info_toc 的
// 自动签链**不看 AUTO_OPEN_SIGN**（只有"开不开面板"受它控制），任何一条 info 回包
// 只要 today_sign=0 就会 0.25s 后无条件发 m_role_sign_tos。教程期只要还有人在中途
// 触发 info（登录链 role.js:1172 / 开面板 / GM），签到奖励还是会带弹窗落到教程里。
function guideSignDeferred() {
  const gs = S.guideState;
  if (!gs) return false;
  return !(gs.done || []).map(Number).includes(GD.GUIDE_MAIN_CHAIN_LAST);
}

function pushRoleActs(conn) {
  if (!conn) return;
  // 2026-10-13 暗幕修复：1001 不再恒报 3(REWARD)。已签日仍报 3 会让客户端
  // ActivityModule 的预结算 pending 表每次登录都塞入 1001 → dealwithSign →
  // today_sign=1/3 时既不自动签也不弹窗、链路就地中断 → ON_ACTIVITY_PREDEAL_END
  // 永不派发 → MainFunctionPanel 登录 Live2D 暗幕(spLoginMask Alpha=0.8)永不清除
  // （时序竞态：m_skin_live_state_toc 在真机晚 ~5s 到达恰逢卡片重建时挂幕，重启
  // 只是重掷骰子）。已签/周期签满改报 2(ACTION)：isOpenAct 仍满足、不进 pending 表。
  //
  // 2026-11-02（二百九十四）新手教程期整体押后签到：教程档仍报 3 会让客户端
  // dealwithSign → info_toc(today_sign=0) → **0.25s 后无条件自动 m_role_sign_tos**
  //（客户端 ActivityModule.m_role_sign_info_toc 的自动签链不看 AUTO_OPEN_SIGN）
  // → 首日奖励 水晶×50 走 m_goods_update_toc type=1 ⇒ openGetItemsPanel 弹「获得道具」，
  // 而该弹窗要玩家点 Touch 才关、教程流程不会去点 ⇒ 一直压在引导战斗上面（真机实证）。
  // 教程期报 2(ACTION)：既进不了 pending 表（不触发 dealwithSign）、也不会被
  // dealwithNextAct 的 1001 分支截住 ⇒ ON_ACTIVITY_PREDEAL_END 照常派发（暗幕正常淡出）。
  // 教程结束客户端 enterMainPanel 会自拉 m_role_acts_tos（GuideModule:268/331），
  // 那时状态自然回到 3，官方弹签链当轮恢复。
  const s = ensureSignCycle();
  const signedToday = s.lastDay === signTodayStr() || s.days >= signDaysInMonth(s.listId);
  // 教程期（未走完 FRESH_UNFINISHED 主线链）1001 一并报 2：见函数头 2026-11-02 注释
  const guidePending = guideSignDeferred();
  // 1041 信仰开关：按 6-4 进度（或 GM 强制）动态附加，不进静态 ACT_OPEN 表
  const acts = ACT_OPEN.map(a => ({ id: a.id, val: a.id === 1001 && (signedToday || guidePending) ? 2 : a.state }));
  if (faithGateOpen()) acts.push({ id: 1041, val: 2 });
  conn.sendToc('m_role_acts_toc', { acts });
}

module.exports = {
  handlers: {
// ---- 活动（主页轮播入口 + 活动列表）----
// 客户端机制：CfgActivity.showActvitys 的每个 banner 只要 allActs 里有任一活动被
// m_role_acts_toc 下发（且 ActivityConfig[id] 存在）就显示；点击 banner dispatch link
// （如 OPEN_ACTIVITY_PANEL_BY_KIND,27）打开 ActivityPanel，左侧列表 = ActivityMgr.getAllActList()。
// state 语义：0未开/1可访问/2进行中/3可领奖/4结束。用 2(ACTION)——满足 isOpenAct（Permit
// 配置读取条件）且避开 3(REWARD) 触发的登录弹窗链（dealwithNextAct 会自动弹签到/登录福利）；
// 例外见下方 ACT_OPEN 内 1001 注释（每日签到刻意用 3 走登录弹签链）
m_role_acts_tos(conn) {
  pushRoleActs(conn);
  // ActivityPanel.onOpen 每次打开面板都发本协议 → 顺带重推累计签到 VO（1782 海神彼岸等）。
  // 客户端无 info 请求协议，长会话跨天后 VO 过期（昨天已签 status=1 → 今天不能签），
  // 只有这里能在"打开面板"时机以服务端推送方式刷新（act_extra.pushAccumInfo，2026-10-07）
  try { require('./act_extra').pushAccumInfo(conn); } catch (e) { /* 忽略 */ }
},
// Permit 视图（动荡的时空/冬日补给站）updateTime → MainMgr.getActTimeInfo 发本协议
m_act_time_tos(conn, obj) {
  const now = Math.floor(Date.now() / 1000);
  conn.sendToc('m_act_time_toc', {
    act_id: (obj && obj.act_id) || 0,
    begin_time: now - 30 * 86400,
    end_time: now + 365 * 86400,
  });
},
// Permit 视图 onOpen 发本协议拉兑换信息；score/rewards 空表即可——
// getActScoreInfoOfScore/getActScoreInfoOfReward 对无数据有 nil 保护（回 0/空表）
m_act_score_exchange_info_tos(conn, obj) {
  conn.sendToc('m_act_score_exchange_info_toc', {
    act_id: (obj && obj.act_id) || 0,
    score: [],
    rewards: [],
  });
},
// ---- 每日签到（活动 1001，CfgActivity 名"每日签到"，视图 ActivitySignView）----
// 客户端协议链（ActivityModule/ActivitySignView/ActivityMgr 反编译实证）：
//   开面板 onOpen → m_role_sign_info_tos → toc{sign_days, reward_list_id, reward_list[p_daily_sign],
//   today_sign} → ActivityMgr.updateSignData 只在 reward_list_id 变化时重读 sign_days 重建列表
//   （同周期内以本地 addSign 推进为准）→ today_sign==SIGN_SATE_NONE(0) 时 0.25s 后自动发
//   m_role_sign_tos——视图无手动签到按钮，这条自动签链就是唯一签到入口 → 收 m_role_sign_toc 后
//   客户端本地 addSign() 天数+1 并刷列表（spGet 标记 day<=signDays、spSel 标记当天）+ 清红点。
//   登录自动弹签链 dealwithSign 当 m_role_acts_toc 里 1001 state=3(REWARD) 时在每次登录触发
//   （1001 现恒 state=3）：未签当天登录自动弹签到窗+0.25s 自动签；已签日 today_sign=1 不弹。
//   NoticeModule 明文补丁已把"当天首登公告 WebView"改道 dealwithNextAct，弹签链每次登录必达。
// today_sign 取值：0=今天可签 1=今天已签 3=SIGN_SATE_FINISH 本月已签满。
// 周期：reward_list_id=YYYYMM，服务端换月自动重置 days；奖励真实入包（grantMissionRewards 通道）。
m_role_sign_info_tos(conn) {
  const s = ensureSignCycle();
  const list = signRewardsFor(s.listId);
  // 签满优先报 FINISH(3)：客户端仅对 0(NONE) 触发自动签，1/3 都静默；FINISH 语义更准
  let todaySign = s.days >= list.length ? 3 : (s.lastDay === signTodayStr() ? 1 : 0);
  // 教程期押后：报 1（今天已签口径）而不是 0 —— 客户端对 0 会立刻自动签 + 弹窗。
  // 报 3(FINISH) 不行：本月没签满却报"已签满"，教程结束后客户端不会再自动签当月剩余奖励。
  // 报 1 的副作用只有"本月面板今天不打勾"，而面板这时打不开（教程未放出活动入口），
  // 教程结束当轮 pushRoleActs 把 1001 恢复成 3 后客户端重拉 info 即为真实状态。
  const deferred = guideSignDeferred();
  if (deferred && todaySign === 0) todaySign = 1;
  // 对账补偿：当天已签（含修复部署前签的——sign 动作同日幂等不会重放）即推进 cond 68 任务，
  // 玩家下次登录弹签链/开面板查询 info 时 55000 自动补成"可领取"
  if (s.lastDay === signTodayStr()) advanceMissions(conn, { collab: 1, planSign: 1 });
  conn.sendToc('m_role_sign_info_toc', {
    sign_days: s.days,
    reward_list_id: s.listId,
    reward_list: list,
    today_sign: todaySign,
  });
  if (deferred) log('[act] 教程期签到押后：info 报 today_sign=1（不自动签、不发奖、不弹窗）');
},
// 点签到（登录弹窗链/开面板自动链触发）：同日幂等；签满当月后只回包不再发奖，等下月重开
m_role_sign_tos(conn) {
  // 教程期兜底：客户端自动签链不看 AUTO_OPEN_SIGN，任何 today_sign=0 的 info 都会引来一次
  // sign_tos（旧包/重连/GM 探针都可能触发）。这里直接拒绝——奖励不能带弹窗落进教程战斗，
  // 天数也不能推进（否则教程结束后当月少一天奖励）。仍回 m_role_sign_toc（D2：tos 必须有 toc）。
  if (guideSignDeferred()) {
    log('[act] 教程期签到押后：拒绝 sign_tos（不推进天数、不发奖、不弹窗）');
    conn.sendToc('m_role_sign_toc', defaultFill('m_role_sign_toc'));
    return;
  }
  const s = ensureSignCycle();
  const list = signRewardsFor(s.listId);
  const today = signTodayStr();
  if (s.lastDay !== today && s.days < list.length) {
    s.days += 1;
    s.lastDay = today;
    const r = list[s.days - 1];
    if (r.type_id === SIGN_SERVANT_ITEM) {
      // 誓灵大奖：显示用物品形态 31836002，发放按真身 1836002 走 grantServant 入队
      //（严禁把 31836002 当普通物品入包，也严禁 grantMissionRewards 收誓灵类型 id）
      require('./collab').grantServant(conn, SIGN_SERVANT_TYPE);
    } else {
      grantMissionRewards(conn, [[r.type_id, r.num]]);
    }
    saveState();
    // cond 68"活动期间每日签到"（星象馆期 55000，唯一消费者；conditionTip 实证）：
    // 签到动作即推进。1001 登录弹签链/开面板自动链都汇聚到本 handler，此处发事件即覆盖全部签到路径
    advanceMissions(conn, { collab: 1, planSign: 1 });
    log(`[act] 每日签到 第${s.days}天（周期${s.listId}）：${r.type_id}×${r.num}`);
  }
  conn.sendToc('m_role_sign_toc', defaultFill('m_role_sign_toc'));
},
// 登录福利（新手 7 天）：p_kvt{id=第几天, val=数量, type=物品ID}（LoginGoodsVO.copy 的
// 映射：id→day、type→type_id、val→num）。days=7 全领取态——pending_rewards=0 时
// isFirstLogin()=false，避免 onGUI 1.1s 后自动发 m_role_newcomer_sign_tos 补签链
m_role_newcomer_info_tos(conn) {
  const rewards = [
    { id: 1, val: 60, type: 30000000 },   // 水晶x60
    { id: 2, val: 2, type: 20000000 },    // 秩序之契x2
    { id: 3, val: 1, type: 21001000 },    // 旧式圣器遗物箱
    { id: 4, val: 100, type: 30000000 },  // 水晶x100
    { id: 5, val: 2, type: 20000001 },    // 中立之契x2
    { id: 6, val: 1, type: 21002000 },    // 制式圣器遗物箱
    { id: 7, val: 200, type: 30000000 },  // 水晶x200
    { id: 8, val: 1, type: 21003000 },    // 第 8 项=7 天终极奖励（新制圣器遗物箱）
  ];
  conn.sendToc('m_role_newcomer_info_toc', {
    days: 7,
    rewards,
    pending_rewards: 0,
  });
},
m_role_newcomer_sign_tos(conn) {
  conn.sendToc('m_role_newcomer_sign_toc', defaultFill('m_role_newcomer_sign_toc'));
},
// ---- 音乐教室（活动 1056，ActivityMusicGameView → m_lty_* 协议族）----
// 注意：列表 onOpen 走 m_lty_music_info_tos，但点乐谱开局/放弃/结算走的是**正式版**
// m_music_play_* 协议族（ModuleCommand.START_MUSICGAME → m_music_play_start_tos）——
// 两族都要实现，缺正式版 start 会让兜底把 id 填 0，客户端 nowGameVO=nil 卡死在 setUp 面板
m_music_play_start_tos(conn, obj) {
  const id = Number(obj && obj.id) || 0;
  S.musicState.playing = { id, at: Math.floor(Date.now() / 1000) };
  conn.sendToc('m_music_play_start_toc', { id, times_left: 10 });
},
m_music_play_give_up_tos(conn, obj) {
  const id = Number(obj && obj.id) || 0;
  if (!S.musicState.playing || Number(S.musicState.playing.id) === id) S.musicState.playing = null;
  conn.sendToc('m_music_play_give_up_toc', { id, opt: (obj && obj.opt) || 0 });
},
m_music_play_end_tos(conn, obj) {
  const r = settleMusicGame(obj);
  conn.sendToc('m_music_play_end_toc', r);
},
// info 为 p_kvt 数组：MusicGameInfoVO.update 的映射 id→乐谱、val→max_score、type→max_combo；
// 乐谱配置全在客户端本地（MusicGameConfig），服务端只存最高分/最大连击
m_lty_music_info_tos(conn) {
  const info = Object.entries(S.musicState.scores).map(([id, s]) => ({
    id: Number(id), val: s.max_score, type: s.max_combo,
  }));
  conn.sendToc('m_lty_music_info_toc', { info, score_reward: S.musicState.today });
},
// 开始游玩：原样回 id（客户端自己拆 musicKey=id/10000 与乐谱 id=id%10000）
m_play_lty_start_tos(conn, obj) {
  const id = Number(obj && obj.id) || 0;
  S.musicState.playing = { id, at: Math.floor(Date.now() / 1000) };
  conn.sendToc('m_play_lty_start_toc', { id });
},
m_play_lty_give_up_tos(conn, obj) {
  const id = Number(obj && obj.id) || 0;
  if (!S.musicState.playing || Number(S.musicState.playing.id) === id) S.musicState.playing = null;
  conn.sendToc('m_play_lty_give_up_toc', { id, opt: (obj && obj.opt) || 0 });
},
// 结算：check 是客户端字符串拼接的防作弊字段，本地服直接信客户端分数。
// sum_point=本日累计（客户端 lblScoreToday 显示 "本日上限:{0}/100"）
m_play_lty_end_tos(conn, obj) {
  conn.sendToc('m_play_lty_end_toc', settleMusicGame(obj));
},
// 排行榜（音游）：本地服没有其他玩家，只把自己列进去。
// ⚠️ `self` 的 schema 标 `array<p_lty_rank_row>`，但**客户端按单对象访问**：
//   MusicGameRankVO.update → `slot0.my:update(slot1.self)` → 逐个读 slot1.role_id/role_name/title…
//   还会 RoleCommonHeadVO.create(slot1)。发 defaultFill 的空数组 → 全字段 nil，
//   title 变 nil 后头像/称号渲染再 ipairs 就崩（与 m_role_guide_info_toc.guide 同一个坑）。
// `rows` 才是真数组（updateRank 用 ipairs 遍历）。
m_lty_rank_info_tos(conn, obj) {
  const id = Number((obj && obj.id) || 0);
  const sc = (S.musicState.scores || {})[id] || { max_score: 0, max_combo: 0 };
  const me = {
    role_id: L.roleId,
    role_name: S.roleName,
    skin_id: S.servants.length ? (S.servants[0].skin_id || 0) : 0,
    border: 0,
    score: Number(sc.max_score) || 0,
    combo: Number(sc.max_combo) || 0,
    rank: 1,
    title: [],
  };
  conn.sendToc('m_lty_rank_info_toc', {
    id,
    rows: [me],   // 真数组
    self: me,     // 单对象（见上）
  });
},
// ---- 勇者史莱喵（活动 1202，ActivityJumpGameView → m_jump_game_* 协议族）----
// is_pvp_open=0 单人模式（match/multiplayer 系列不会触发）；daily_ten_reward=1 已领态
// 避免客户端提示领奖
m_jump_game_info_tos(conn, obj) {
  conn.sendToc('m_jump_game_info_toc', {
    act_id: (obj && obj.act_id) || 1202,
    max_score: S.jumpState.max_score,
    daily_score: S.jumpState.daily_score,
    top_times: S.jumpState.top_times,
    daily_ten_reward: 1,
    is_pvp_open: 0,
  });
},
// 开始：player_list 空 = 单人局（客户端 isMultiPlayer=false 直接 openPanel）
m_jump_game_start_tos(conn, obj) {
  S.jumpState.playing = { act_id: Number(obj && obj.act_id) || 1202, at: Math.floor(Date.now() / 1000) };
  S.jumpState.top_times += 1;
  saveState();
  conn.sendToc('m_jump_game_start_toc', {
    act_id: (obj && obj.act_id) || 1202,
    timestamp: Math.floor(Date.now() / 1000),
    player_list: [],
  });
},
// 结算：sp_rewards 空不发实物（回执式，与福利大厅领取一致）
m_jump_game_end_tos(conn, obj) {
  // 已经结算过的局不再重复累计；旧存档没有 playing 字段时保持兼容。
  const jp = S.jumpState.playing;
  if (!jp) {
    conn.sendToc('m_jump_game_end_toc', {
      act_id: (obj && obj.act_id) || 1202, score: 0, is_max: 0,
      height: 0, reward_num: 0, is_reward_ceil: 0, player_list: [], is_timeout: 0, sp_rewards: [],
    });
    return;
  }
  const elapsed = Math.floor(Date.now() / 1000) - Number(jp.at || 0);
  if (elapsed < 2 || elapsed > 30 * 60 || (obj && obj.act_id != null && Number(obj.act_id) !== Number(jp.act_id))) {
    S.jumpState.playing = null;
    conn.sendToc('m_jump_game_end_toc', { act_id: jp.act_id || 1202, score: 0, is_max: 0, height: 0, reward_num: 0, is_reward_ceil: 0, player_list: [], is_timeout: 1, sp_rewards: [] });
    return;
  }
  const rawScore = Number(obj && obj.score);
  const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(1000000, Math.floor(rawScore))) : 0;
  const maxByTime = Math.max(0, Math.floor((elapsed - 2) * 10000));
  const acceptedScore = Math.min(score, maxByTime);
  const isMax = acceptedScore > S.jumpState.max_score;
  if (isMax) S.jumpState.max_score = acceptedScore;
  S.jumpState.daily_score += acceptedScore;
  S.jumpState.playing = null;
  saveState();
  conn.sendToc('m_jump_game_end_toc', {
    act_id: (obj && obj.act_id) || 1202,
    score: acceptedScore,
    is_max: isMax ? 1 : 0,
    height: (obj && obj.height) || 0,
    reward_num: 0,
    is_reward_ceil: 0,
    player_list: [],
    is_timeout: 0,
    sp_rewards: [],
  });
},
// 游玩中分数同步：客户端 handler 收到后直接 return，字段无关紧要
m_jump_game_sync_score_tos(conn, obj) {
  conn.sendToc('m_jump_game_sync_score_toc', {
    act_id: (obj && obj.act_id) || 1202,
    score: 0,
  });
},
// ---- 糖果大作战（活动 1520 / 1090，ActivityChildrensDayView）----
// remain=剩余可得糖果上限；rare_reward=珍贵奖励累计统计（p_kvi，客户端显示"已获得"）
m_act_children_day_info_tos(conn, obj) {
  checkDailyCandy();
  const act_id = (obj && Number(obj.act_id)) || 1520;
  pushChildrenDayInfo(conn, act_id);
},
// 砸罐子（times=1 单抽 10 糖果 / times=10 十连 100 糖果）：从配表奖励池随机，保底20次必出珍贵奖励
m_act_children_day_reward_tos(conn, obj) {
  checkDailyCandy();
  const act_id = (obj && Number(obj.act_id)) || 1520;
  const reqTimes = (obj && Number(obj.times)) || 1;
  const times = reqTimes === 10 ? 10 : 1;
  const candyCost = times * 10;
  const currentCandy = L.getScore(2174);
  if (currentCandy < candyCost) {
    log(`[act] 糖果不足：拥有 ${currentCandy}，需 ${candyCost}`);
    pushChildrenDayInfo(conn, act_id);
    return;
  }
  // 扣除糖果积分（同步扣除 2174 与 45）
  L.addScore(conn, 2174, -candyCost);

  if (!S.candyState.rare) S.candyState.rare = [];
  if (S.candyState.protect_times == null || S.candyState.protect_times <= 0) S.candyState.protect_times = 20;

  const rareDefs = CANDY_RARE_CONFIGS[act_id] || CANDY_RARE_CONFIGS[1520];
  const items = [];
  const bagItems = [];
  // 发放用的模块在请求期再 require（handler 互相引用走延迟加载，避免顶层循环依赖）
  const SV = require('./servant');
  const HB = require('./handbook');
  const TITLE = require('./title');
  // 誓灵凭证（31235016 鲁格-雏光 / 31532022 凤凰-稚羽，form=3）循环内先判后建卡，
  // 循环后统一宣告——必须先于 reward_toc（客户端奖励面板关闭时查 OutCardMgr.hasServant() 播出卡）
  const servantGrants = [];
  let goldAdd = 0;
  const titleEntries = [];

  for (let i = 0; i < times; i++) {
    const availableRares = rareDefs.filter(r => {
      const entry = S.candyState.rare.find(x => x.id === r.id);
      return (entry ? entry.val : 0) < r.maxNum;
    });

    let awardedItem = null;

    if (availableRares.length > 0) {
      S.candyState.protect_times -= 1;
      if (S.candyState.protect_times <= 0 || Math.random() < 0.08) {
        // 触发保底或小概率命中珍贵奖励
        const picked = availableRares[Math.floor(Math.random() * availableRares.length)];
        awardedItem = { id: picked.id, val: picked.val || 1 };
        let entry = S.candyState.rare.find(x => x.id === picked.id);
        if (entry) entry.val += 1;
        else S.candyState.rare.push({ id: picked.id, val: 1 });

        // 重新检查剩余未拿满的珍贵奖励
        const remainingRares = rareDefs.filter(r => {
          const e = S.candyState.rare.find(x => x.id === r.id);
          return (e ? e.val : 0) < r.maxNum;
        });
        if (remainingRares.length > 0) {
          S.candyState.protect_times = 20;
        } else {
          S.candyState.protect_times = 0; // 全部珍贵奖励已领完
        }
      }
    } else {
      S.candyState.protect_times = 0; // 全部珍贵已拿满，不展示保底
    }

    if (!awardedItem) {
      const comm = CANDY_COMMON_POOL[Math.floor(Math.random() * CANDY_COMMON_POOL.length)];
      awardedItem = { id: comm.id, val: comm.val };
    }

    items.push({ id: awardedItem.id, val: awardedItem.val });
    // 发放分流（CfgItems form 语义；2026-10-25 前全部走手写 bagGoods.push，四类道具全发错）：
    //  · 30000000 水晶（form=2 货币）→ roleAsset；入包 = 玩家看不见、余额不动
    //  · 道具形态积分（form=2 + CfgScoreItem）→ grantScoreItem 落 role_scores
    //  · 誓灵凭证（3e7+type，form=3）→ makeServantBrief 入誓灵栏，严禁入包（servant_token_data 口径）
    //  · 称号盒（25001001~25001999，form=2）→ title.grantTitle 置称号状态
    //  · 其余（元素晶石 72 前缀逐实例带 spec_data / 圣器 / 信仰 / 普通堆叠）→ grantGoods 统一出口
    if (Number(awardedItem.id) === 30000000) {
      goldAdd += awardedItem.val;
    } else if (L.grantScoreItem(conn, awardedItem.id, awardedItem.val)) {
      // 已落 role_scores 并推送 m_role_score_change_toc
    } else if (SERVANT_TOKENS.isServantToken(awardedItem.id)) {
      const st = SERVANT_TOKENS.servantTypeOfToken(awardedItem.id);
      const isNew = !HB.isUnlocked(st); // 先判后建卡：makeServantBrief 会激活图鉴（is_first 唯一口径）
      const b = SV.makeServantBrief(st);
      if (b) { SV.grantServantBrief(b); servantGrants.push({ brief: b, isNew }); }
      else log(`[act] 糖果凭证 ${awardedItem.id} → 誓灵 ${st} 非法（CfgServant 无此 typeId），丢弃`);
    } else if (TITLE_DATA.isTitleBox(awardedItem.id)) {
      const r = TITLE.grantTitle(awardedItem.id);
      if (r) titleEntries.push({ id: TITLE_DATA.titleIdOfBox(awardedItem.id), val: r.val });
    } else {
      bagItems.push(...L.grantGoods(awardedItem.id, awardedItem.val, conn));
    }
  }

  if (goldAdd) {
    S.roleAsset.gold = Number(S.roleAsset.gold || 0) + goldAdd;
    S.roleAsset.gold_given = Number(S.roleAsset.gold_given || 0) + goldAdd;
    L.pushAssetChange(conn);
  }
  saveState();
  if (bagItems.length) L.pushGoodsUpdate(conn, bagItems, 3);
  // 誓灵到货：reward_type=8 = ServantConst.REWARD_TYPE_CHILDRENS_DAY（入 OutCard 队列但不自动弹卡，
  // 出卡动画由奖励面板关闭触发）⇒ 本包必须先于 reward_toc 到达，与 summon 的推送序同理
  if (servantGrants.length) {
    conn.sendToc('m_servant_update_toc', {
      new: servantGrants.map(x => ({ servant: x.brief, is_first: x.isNew ? 1 : 0 })),
      update: [], del: [],
      reward_type: 8,
    });
    try { HB.pushRedPoints(conn); } catch (e) { /* 忽略 */ }
    try { require('./altar').pushFameUpdates(conn); } catch (e) { /* 忽略 */ }
    try {
      const MM = require('./moment');
      MM.onServantObtained(servantGrants.filter(x => x.isNew).map(x => Number(x.brief.type)));
      MM.checkUnlocks(conn);
    } catch (e) { /* 忽略 */ }
    const newCount = servantGrants.filter(x => x.isNew).length;
    try { advanceMissions(conn, { gainServant: newCount }); } catch (e) { /* 任务未就绪不阻塞 */ }
  }
  if (titleEntries.length) TITLE.pushTitleUpdate(conn, titleEntries);

  conn.sendToc('m_act_children_day_reward_toc', {
    act_id: act_id,
    items: items,
    times: times,
  });
  pushChildrenDayInfo(conn, act_id);
  log(`[act] 糖果大作战抽取 times=${times}（消耗糖果 ${candyCost}，余 ${L.getScore(2174)}），保底余 ${S.candyState.protect_times} 次`
    + `${servantGrants.length ? `，誓灵×${servantGrants.length}` : ''}${titleEntries.length ? `，称号盒×${titleEntries.length}` : ''}${goldAdd ? `，水晶+${goldAdd}` : ''}`);
},
// 200% 效率 buff：花费 3000 金币增加 30 次战斗加成
m_act_children_buff_tos(conn, obj) {
  checkDailyCandy();
  const act_id = (obj && Number(obj.act_id)) || 1520;
  const BUFF_COST = 3000;
  if ((S.roleAsset.silver || 0) >= BUFF_COST) {
    S.roleAsset.silver -= BUFF_COST;
    S.candyState.buff_times = (S.candyState.buff_times || 0) + 30;
    L.pushAssetChange(conn);
    saveState();
  }
  conn.sendToc('m_act_children_buff_toc', {
    act_id: act_id,
    times: S.candyState.buff_times || 0,
  });
  pushChildrenDayInfo(conn, act_id);
},
// ---- 乐之旅途（活动 1053，ActivityLTYFavorableView 好感度任务）----
// 任务定义在客户端本地 LTYFavorableRewards（id 1~10，rewards/arg/好感度门槛 state）；
// mission_list(p_kvt) 必须覆盖全部任务 id（1~10）——Render.onGUI 对每个本地任务
// getRewardFavorableList(id) 找不到对应项会 rewardsVO=nil 直接崩。
// type 语义：0=锁定/1=未完成/2=可领/3=已领。
m_act_favor_info_tos(conn) {
  const st = getFavorState();
  st.favor = getFavorScore(st);
  const mission_list = [];
  for (let id = 1; id <= 10; id++) {
    const val = getFavorMissionVal(id, st);
    const arg = LTY_FAVOR_ARGS[id];
    let type = 1;
    if (st.claimed.includes(id)) {
      type = 3;
    } else if (val >= arg) {
      type = 2;
    }
    mission_list.push({ id, val, type });
  }
  conn.sendToc('m_act_favor_info_toc', {
    act_id: 1053,
    mission_list,
    favor: st.favor,
    is_helper: st.is_helper || 0,
  });
  // 客户端 getAssistActID(1053) 需要 helpList 里的 ActivityAssistantVO（否则开关回包 printError
  // 「没有改助战信息1053」弹窗）——顺带补推 1053 助手信息建 VO（list 空即可，1053 无助手位）
  conn.sendToc('m_act_helper_info_toc', {
    act_id: 1053,
    switch: st.is_helper || 0,
    select: 0,
    list: [],
  });
},
// 领任务奖励：校验达标、发奖励入包、累计好感度、推 score_toc 与 get_toc 并落盘
m_act_favor_get_tos(conn, obj) {
  const id = Number(obj && obj.id) || 0;
  const actId = Number(obj && obj.act_id) || 1053;
  const st = getFavorState();
  if (id < 1 || id > 10 || st.claimed.includes(id)) {
    log(`[act_favor] 领取被拒（非法id或已领过）: id=${id}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  const curVal = getFavorMissionVal(id, st);
  const arg = LTY_FAVOR_ARGS[id];
  if (curVal < arg) {
    log(`[act_favor] 领取被拒（进度未达标）: id=${id}, cur=${curVal}, need=${arg}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }

  const rw = LTY_FAVOR_REWARDS[id];
  if (rw) {
    // 先发奖励，成功后再写领取标记；避免崩溃时出现“已领但未到账”。
    grantRewardItems(conn, [rw], { persist: false });
  }
  st.claimed.push(id);
  st.favor = getFavorScore(st);
  saveState();

  // 先推 score_toc，再推 get_toc（保证客户端 dispatch 刷新时好感度已是最新值）
  conn.sendToc('m_act_favor_score_toc', {
    act_id: actId,
    favor: st.favor,
  });
  conn.sendToc('m_act_favor_get_toc', {
    act_id: actId,
    id: id,
  });
  log(`[act_favor] 领取任务 ${id} 成功，好感度更新为 ${st.favor}，奖励: ${JSON.stringify(rw)}`);
},
// 助战开关：保存并回传（兼容客户端单参/双参调用）。
// ⚠️ act_id 分流（2026-10-25「关掉仍生效」修复）：布阵面板 CopyPlanPanel.togHelp 发的是
// (assistAct.id, 0/1)——1105（约会大作战）等活动助战总开关走这条协议，与选哪只（select）正交。
// 1105 的开关必须落 actExtraState.dalive.helperSwitch（战斗侧 activeAssist 与登录 helper_info 都读它），
// 不能写 actFavorState.is_helper（那是 1053 乐之旅途的状态，两边互写会串味——调研 B4 预言过的坑）。
m_act_favor_helper_tos(conn, obj) {
  const st = getFavorState();
  const isLegacySingleArg = (obj && obj.value === undefined && (obj.act_id === 0 || obj.act_id === 1));
  const actId = isLegacySingleArg ? 1053 : (Number(obj && obj.act_id) || 1053);
  const value = isLegacySingleArg ? obj.act_id : (Number(obj && obj.value) || 0);
  if (actId === 1105) {
    const AED = require('../data/act_extra_data');
    S.actExtraState = S.actExtraState || {};
    const da = S.actExtraState.dalive || (S.actExtraState.dalive = { scores: {}, select: 0, claimedR: {} });
    da.helperSwitch = value ? 1 : 0;
    saveState();
    // 先补 helper_info 落 VO（VO 缺失时客户端 getAssistActID(1105) 会 printError 弹窗），
    // 再回 favor_helper_toc（其 handler 会对同一 VO 再 setSwitch 一次，幂等）。
    conn.sendToc('m_act_helper_info_toc', {
      act_id: 1105,
      switch: da.helperSwitch,
      list: AED.DATA_ALIVE.servants.map(s => ({ id: s.id, skin_id: s.skinId, lv: 1, exp: 0, pl: 1 })),
      select: da.select || 0,
    });
    conn.sendToc('m_act_favor_helper_toc', { act_id: 1105, value: da.helperSwitch });
    log(`[act_favor] 1105 助战开关: helperSwitch=${da.helperSwitch}（select=${da.select || 0} 不动，1053 is_helper 不动）`);
    return;
  }
  st.is_helper = value ? 1 : 0;
  saveState();
  conn.sendToc('m_act_favor_helper_toc', {
    act_id: actId,
    value: st.is_helper,
  });
  // 客户端 m_act_favor_helper_toc → getAssistActID(act_id)：helpList 里没有该活动的
  // ActivityAssistantVO 时官方字节码会 printError「没有改助战信息1053」弹窗（E2E 21:33:17 实证）。
  // helper_info 只在登录时推过 1105（act_extra.onLoginPushes），1053 的 VO 必须在此补推填充。
  // 顺序：helper_info 先落 VO，再让 favor_helper_toc 到达时 setSwitch 命中（toc 晚于 info 无所谓，
  // info 是补推的 VO 状态 = 本次的 is_helper）。
  conn.sendToc('m_act_helper_info_toc', {
    act_id: 1053,
    switch: st.is_helper,
    select: 0,
    list: [],
  });
  log(`[act_favor] 助战开关: act=${actId}, is_helper=${st.is_helper}（+补推 1053 helper_info）`);
},
// 等级奖励：拉取已领取列表
m_level_reward_info_tos(conn) {
  const st = lrState();
  conn.sendToc('m_level_reward_info_toc', { has_get: st.claimed });
},
// 等级奖励：领取指定等级奖励
m_level_reward_get_tos(conn, obj) {
  const lv = Number(obj && obj.lv) || 0;
  const rewards = LEVEL_REWARDS[lv];
  if (!rewards) {
    log('[level_reward] 未知等级奖励档位: lv=' + lv);
    return;
  }
  const curLv = Number(S.roleAsset && S.roleAsset.level) || 1;
  if (curLv < lv) {
    log('[level_reward] 等级不足无法领取: 当前等级=' + curLv + ', 需要等级=' + lv);
    return;
  }
  const st = lrState();
  if (st.claimed.includes(lv)) {
    log('[level_reward] 等级奖励已领取: lv=' + lv);
    return;
  }

  grantRewardItems(conn, rewards, { persist: false });
  st.claimed.push(lv);
  saveState();

  conn.sendToc('m_level_reward_get_toc', { lv: lv });
  log('[level_reward] 领取等级奖励 lv=' + lv + ' 成功，发放道具 ' + JSON.stringify(rewards));
},
// 通关奖励（活动 1005，ActivityFbRewardView）
m_copy_reward_list_tos(conn) {
  const st = getCopyRewardState();
  const list = FB_REWARDS.map(r => {
    let val = 0; // 0=未达到
    if (st.claimed.includes(r.id)) val = 2; // 2=已领取
    else if (isCopyCleared(r.copyID)) val = 1; // 1=可领取
    return { id: r.id, val };
  });
  conn.sendToc('m_copy_reward_list_toc', { list });
},
m_copy_reward_get_tos(conn, obj) {
  const id = Number(obj && obj.id) || 0;
  const r = FB_REWARDS.find(x => x.id === id);
  const st = getCopyRewardState();
  if (!r || st.claimed.includes(id) || !isCopyCleared(r.copyID)) {
    log('[copy_reward] 领奖被拒: id=' + id);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  grantRewardItems(conn, r.rewards, { persist: false });
  st.claimed.push(id);
  saveState();
  conn.sendToc('m_copy_reward_get_toc', { id });
  log('[copy_reward] 领取通关奖励 id=' + id + ' 成功');
},
// ---- 剧情图鉴（TheaterMgr 数据源）----
// m_theatre_info_toc {list: int[]} = 已播放 theaterID 列表（客户端 updateDic 建 hasPlayed 表）
m_theatre_info_tos(conn) {
  conn.sendToc('m_theatre_info_toc', { list: playedTheaters() });
},
// 剧情播放上报（战斗中/图鉴回看）：记录持久化（无同名 toc，兜底回 common_reply 解除网络等待）
m_theatre_play_tos(conn, obj) {
  const tid = (obj && obj.theatre_id) || 0;
  if (tid && !S.theaterState.played.includes(tid)) {
    S.theaterState.played.push(tid);
    saveState();
  }
  // 无同名 toc（Proto 里没有 m_theatre_play_toc），客户端也不消费 ⇒ 回通用应答把计时器打掉（D2）
  conn.sendToc('m_common_reply_toc', { proto_id: 0 });
},
// ---- 任务系统（主线/日常/周常；定义全在客户端 CfgMission，服务端只回 id+进度）----
m_mission_list_tos(conn) {
  checkMissionReset();
  conn.sendToc('m_mission_list_toc', {
    list: MISSIONS
      .filter(m => !S.missionState.claimed.includes(m.id))
      .map(missionP),
    activity: S.missionState.dailyActivity,
    activity_reward: S.missionState.activityReward,
  });
},
// 领任务奖励：标记已领（列表不再下发，客户端 removeMission 移除显示）+ 发放奖励；
// 日常任务（group=2）领取时累计当日活跃度（missions_data.json 每任务 activity 字段，合计 100）
//
// ★ id=0 = 面板「全部领取」（2026-10-19 一百九十六）。
//   客户端 MissionMainPanel.onClickBtnGetAll → MissionModule.toComplete(0, 组号)：
//   `Net.createAndSendProto("m_mission_complete_tos", {id=0, type=组})`，回包里 id=0 时
//   走 `MissionMgr.removeAllFinishMission(type)` —— 把该组**全部 reward_times>0** 的任务
//   本地 gainAllReward 并从列表移除（reward_times 由服务端 missionP 下发，恰好等于
//   `counter >= num`，所以两端"可领集合"天然一致）。
//   此前服务端只看 `MISSIONS.find(x => x.id === id)`，id=0 恒 miss → 一个奖都不发，
//   但回包照样是 id=0 → 客户端照样把整组清空。玩家看到的就是"点了没反应/什么都没领到，
//   重开面板任务又全回来"，而逐个点（id≠0）正常。修复必须把**同一批**全部发奖并记 claimed。
//
// 被拒（任务不存在/已领/进度不足）**不能**回本协议：客户端 `MissionMgr.getReward(id)`
// 会把它当成功本地移除 → "任务消失但奖励没到手"（D11 同类静默失败）。回通用包解除等待即可。
m_mission_complete_tos(conn, obj) {
  const id = Number((obj && obj.id) || 0);
  const type = Number((obj && obj.type) || 0);
  // opts.noPopup：批量领取时只收集弹窗条目，整组在循环外合并成一条 type=1 推送。
  // 客户端每收到一次 type=1 且 needShowReward 就 openGetItemsPanel 一次（BagModule 实证），
  // 而本地 removeAllFinishMission 自身不弹任何窗——逐任务推送 = 领 44 个任务弹 44 个窗
  //（二百八十四用户实测症状①）。合并按 type_id 累加 cur_num，弹窗一行一个道具。
  const claimOne = (m, opts) => {
    const pops = grantMissionRewards(conn, m.rewards || [], opts);
    S.missionState.claimed.push(m.id);
    if (m.group === 2) {
      S.missionState.dailyActivity += m.activity || 0;
      log(`[mission] 活跃度 +${m.activity || 0} → ${S.missionState.dailyActivity}`);
    }
    // cond 69"完成{0}个活动日常(签到除外)"——签到任务(55000,cond 68)的领取不推进 55001
    if (m.group === 2 && m.cond !== 68) { try { require('./act_extra').actEvent(conn, 'daily', 1, null); } catch (e) { /* 忽略 */ } }
    require('./achievement').addMissionClaim(m.group); // 成就 35xxx/36xxx 日常/周常完成次数
    return pops || [];
  };
  if (id === 0) {
    const batch = type > 0 ? MISSIONS.filter(m => m.group === type
      && !S.missionState.claimed.includes(m.id)
      && (S.missionState.counters[m.id] || 0) >= m.num) : [];
    const byType = new Map();
    for (const m of batch) {
      for (const p of claimOne(m, { noPopup: true })) {
        const k = Number(p.type_id);
        if (byType.has(k)) byType.get(k).cur_num += Number(p.cur_num) || 0;
        else byType.set(k, { id: 0, type_id: k, cur_num: Number(p.cur_num) || 0, bag_type: p.bag_type });
      }
    }
    if (batch.length) {
      // 奖励发放可能同时修改资产、积分和背包；必须在发奖之后落盘，避免重启后
      // 出现“任务已领取但奖励丢失”的状态。
      saveState();
      log(`[mission] 全部领取 group=${type} → ${batch.length} 个任务（弹窗合并 ${byType.size} 种道具）：${batch.map(x => x.id).join(',')}`);
    } else {
      log(`[mission] 全部领取 group=${type}：无可领任务`);
    }
    // 整组一次弹窗（ currencies/积分/体力条目也在内，见 grantMissionRewards 头注）
    if (byType.size) pushGoodsUpdate(conn, [...byType.values()], 1);
    conn.sendToc('m_mission_complete_toc', { id: 0, type, activity: S.missionState.dailyActivity });
    return;
  }
  const m = MISSIONS.find(x => x.id === id);
  const done = (S.missionState.counters[id] || 0) >= (m ? m.num : Infinity);
  if (m && !S.missionState.claimed.includes(id) && done) {
    claimOne(m);
    saveState();
    log(`[mission] 领取任务 ${id}（group=${m.group}），奖励 ${JSON.stringify(m.rewards)}`);
    conn.sendToc('m_mission_complete_toc', { id, type, activity: S.missionState.dailyActivity });
    return;
  }
  log(`[mission] 领取被拒 id=${id} type=${type}（${!m ? '任务不存在'
    : S.missionState.claimed.includes(id) ? '已领取' : `进度不足 ${S.missionState.counters[id] || 0}/${m.num}`}）`);
  conn.sendToc('m_common_reply_toc', { proto_id: 0 });
},
// 领活跃度宝箱：id=宝箱下标(1-based)。校验活跃度达标且未领过 → 发放并记录
m_mission_activity_tos(conn, obj) {
  const id = (obj && obj.id) || 0;
  const chest = ACTIVITY_CHESTS[id - 1];
  if (chest && !S.missionState.activityReward.includes(id) && S.missionState.dailyActivity >= chest.num) {
    grantMissionRewards(conn, chest.rewards);
    S.missionState.activityReward.push(id);
    saveState();
    log(`[mission] 领取活跃度宝箱 ${id}（活跃度 ${S.missionState.dailyActivity}/${chest.num}），奖励 ${JSON.stringify(chest.rewards)}`);
  }
  conn.sendToc('m_mission_activity_toc', { id });
},
// 客户端事件上报（分享类，type 70/75）：计数推进 condType 匹配的任务
m_trigger_mission_tos(conn, obj) {
  conn.sendToc('m_trigger_mission_toc', defaultFill('m_trigger_mission_toc'));
},
  },
  playedTheaters: playedTheaters, advanceMissions: advanceMissions, grantMissionRewards: grantMissionRewards, settleMusicGame: settleMusicGame,
  CANDY_RARE_CONFIGS: CANDY_RARE_CONFIGS, CANDY_COMMON_POOL: CANDY_COMMON_POOL, // 糖果池镜像（smoke_candy 配置断言）
  ACTIVITY_CHESTS, // 活跃度宝箱官方原样镜像（smoke_dead_box_substitute 断言转换收口在 grantGoods 而非表上）
  ACT_OPEN: ACT_OPEN, pushRoleActs: pushRoleActs, // 供 act_extra/collab 判断活动是否下发（客户端 isOpenAct=false 时 getStarDreamPermitInfo 返回 nil）
  faithGateOpen: faithGateOpen, FAITH_UNLOCK_BARRIER: FAITH_UNLOCK_BARRIER, // 信仰 1041 开启闸（调研-信仰.md §3.2）
  LTY_FAVOR_REWARDS: LTY_FAVOR_REWARDS, LTY_FAVOR_ARGS: LTY_FAVOR_ARGS, getFavorState: getFavorState,
  getFavorMissionVal: getFavorMissionVal, getFavorScore: getFavorScore, grantRewardItems: grantRewardItems,
};
