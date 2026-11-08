// 排行榜（Rank）静态配置：榜单口径 + NPC 陪跑数据。
//
// ── 客户端事实（tools/bc_cmp/Rank*_ljd.lua 反编译实证，2026-09-17）──
// · 面板 = RankPanel（主页右下 functionsV "排名" → OPEN_RANK_PANEL），页签来自
//   `RankConfig.rankShowTab()` = CfgRank.ranks 里 `isShow=true` 且按 rankId 升序（客户端自己排，
//   服务端不管）。当前版本 **只有 1~5 五个页签**：
//     1 本赛季演武(type1 积分) / 2 上赛季演武(type1 积分) / 3 图鉴收集(type2 收集率)
//     4 玩家等级(type1 等级) / 5 成就收集(type2 完成率)
//   （6/7 天梯、36 誓灵养成等 isShow=false，只有活动面板单独用，不进本页签）
// · `type=1` → 客户端 RankVO 把 scores[1] 原样当字符串显示；`type=2` → 服务端须发**万分比整数**
//   （RankVO：`math.digit(v/100,1).."%"`，即 5000 → "50%"）。
// · 协议：`m_rank_get_info_tos{rank_id}` → toc{rank_id,row_num,self_row,threshold}；
//   随后客户端立刻发 `m_rank_get_rank_tos{rank_id,from,to}` 拉列表（RankConst.GET_MAX_NUM=12，
//   滚动时按 12 条一页续拉）→ toc{rank_id,rows}。
// · **p_rank_row 三个必填**（缺一个客户端 RankVO.setDbInfo 直接崩，这是"打开排行榜报错"的根因）：
//     avatar（p_avatar 单对象，读 `.skin`）、elements（数组，`elements[1]` = 名字，之后 remove(1) 剩后缀）、
//     int_list（数组，`int_list[1]` = job 贴图号）、titles（数组，[1]前[2]后，用于 RoleMgr.getFullTitleName）。
//   空数组会被 etf 编成 NIL→`{}`，`{}.skin` = nil → 崩，所以**永远不能发空**。
// · 头像贴图：`ServantUtil.getPathFightHead(skinId)` = `UI/Servant/Textures/FightHeads/<skinId>`，
//   所以 avatar.skin 必须是**真实存在的皮肤 id**（否则贴图 404 空白，不崩）。
//   job 贴图：`UI/Rank/Textures_Lang/<job>`（assets 里 1..11 共 11 张，即 job ∈ 1..11）。
// · 行点击（RankItem.onClick）：非自己 → `m_friend_info_tos{role_id,type=INFO_TYPE_LOOK}` 看资料；
//   自己 → 打开个人信息页。NPC 行点了会走前者（服务端按"查无此人"回空即可，见 rank.js）。

// ---- 榜单 id（对齐 CfgRank.ranks 的 isShow=true 子集）----
const RANK_ARENA_CUR = 1;   // 本赛季演武（type=1，积分）
const RANK_ARENA_LAST = 2;  // 上赛季演武（type=1，积分）
const RANK_HANDBOOK = 3;    // 图鉴收集（type=2，收集率，万分比）
const RANK_ROLE_LEVEL = 4;  // 玩家等级（type=1，等级）
const RANK_ACHIEVEMENT = 5; // 成就收集（type=2，完成率，万分比）
const SHOW_RANKS = [RANK_ARENA_CUR, RANK_ARENA_LAST, RANK_HANDBOOK, RANK_ROLE_LEVEL, RANK_ACHIEVEMENT];

// 页签口径表：type 决定分数编码（1=原值 / 2=万分比），name 用于日志与冒烟断言
const RANK_META = {
  [RANK_ARENA_CUR]:   { type: 1, name: '本赛季演武', kind: 'arena' },
  [RANK_ARENA_LAST]:  { type: 1, name: '上赛季演武', kind: 'arena_last' },
  [RANK_HANDBOOK]:    { type: 2, name: '图鉴收集',   kind: 'handbook' },
  [RANK_ROLE_LEVEL]:  { type: 1, name: '玩家等级',   kind: 'level' },
  [RANK_ACHIEVEMENT]: { type: 2, name: '成就收集',   kind: 'achievement' },
};

// ---- NPC 陪跑（单机本地服无其他玩家；与圣诞/投票活动同口径：固定名单 + 确定性分数）----
// 分数以"当前玩家分数"为基准做偏移，保证玩家始终能进前 12、且榜首不是恒定某个人
// （分数计算见 rank.js：playerScore 参与排序，NPC 分数 = base 值 + 名次扰动）。
// 名字取自官方活动 NPC 名单（act_extra_data.CHRISTMAS.voters）风格，避免与真实玩家重名。
const NPC_NAMES = [
  '誓灵之友', '星命学者', '夜刀十香', '白面鸮', '御坂美琴', '初音未来',
  '洛水天依', '阿比盖尔', '苍蓝之刃', '银翼骑士', '雾岛观测者', '月下孤狼',
];

// NPC 头像/资料用的皮肤 id：必须是**资源真实存在**的皮肤。
// 客户端两处读不同贴图：
//   · 榜单行 RankItem → ServantUtil.getPathFightHead(skin) = UI/Servant/Textures/FightHeads/<skin>
//   · 点行进的资料页（RoleCommonHeadVO.getServantHeadPath / getFaceHeadPath）→ SmallHeads/<skin>、FaceHeads/<type>_<face>
// 因此本名单只取 **fightheads ∩ smallheads 都齐全**的皮肤（贴图缺失不崩，但会显示空白头像）。
// 这 12 个已逐一核对：设备 /sdcard/.../files/res 双侧存在（2026-09-17 实测，
// 名单见 tools/bc_cmp 的资产交集核对）。
const NPC_SKINS = [
  103203001, 103503101, 104402901, 104502801, 111500301, 113404001,
  113503801, 113504101, 114104301, 114202001, 114404201, 114603901,
];

// NPC 的 job 贴图号（UI/Rank/Textures_Lang/1..11；1~4 是官方职位风格）
const NPC_JOBS = [3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 4, 2];

module.exports = {
  RANK_ARENA_CUR, RANK_ARENA_LAST, RANK_HANDBOOK, RANK_ROLE_LEVEL, RANK_ACHIEVEMENT,
  SHOW_RANKS, RANK_META, NPC_NAMES, NPC_SKINS, NPC_JOBS,
};
