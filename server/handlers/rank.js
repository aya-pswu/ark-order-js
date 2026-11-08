// 排行榜（Rank，主页右下 functionsV "排名" → OPEN_RANK_PANEL）。
//
// ── 崩溃根因（2026-09-17 修，tools/bc_cmp/RankVO_ljd.lua 实证）──
// 本族协议此前**从未注册**，走 start.js 的 fallbackHandler → `defaultFill('m_rank_get_info_toc')`
// 发空壳：`self_row=[]`（etf 编成 NIL → 客户端 `{}`）。客户端 RankMgr.initInfo 拿它直接
// `RankVO:setDbInfo(self_row)` → 读 `self_row.avatar.skin` → **attempt to index field 'avatar'
// (a nil value)** → toc 协议报错（`registerModuleSocket` 的 pcall 吞掉异常，面板空着不渲染）。
//
// ── 客户端机制（RankMgr / RankPanel / RankItem / RankVO 反编译实证）──
// · 开面板 → 每个页签切换：`m_rank_get_info_tos{rank_id}` → toc{rank_id,row_num,self_row,threshold}
//   → 客户端**立刻**发 `m_rank_get_rank_tos{rank_id,from=1,to=GET_MAX_NUM(12)}` 拉首页列表
//   → toc{rank_id,rows}。滚动到第 6/12/18... 条时按 12 条一页续拉（RankItem.onGUI 的
//   `(index+6)%12==0` 分支），所以 get_rank 必须支持任意 from/to 窗口。
// · `row_num` = 榜单总人数（RankPanel.onGUI 用它生成列表项数量 1..row_num；
//   RankMgr.getRankNum 亦读它）。发 0 → 列表空 + objNone 亮（"暂无数据"）。
// · `threshold` = 分数门槛数组（RankMgr.getThreshold 用 `threshold[i] <= 我的分数` 反推段位；
//   空数组会走 `#threshold+1` 兜底，不崩。本地服无段位奖励，发空即可）。
// · p_rank_row 字段（**缺一个就崩**，见 rank_data.js 头注释）：index/ranking/key/elements/
//   int_list/titles/medals/scores/avatar。
//   - `elements[1]` = 名字（RankVO 读完立刻 `table.remove(elements,1)`，剩下的是后缀元素）
//   - `int_list[1]` = job 贴图号（RankItem：`texJob.Path = "UI/Rank/Textures_Lang/" .. job`）
//   - `titles` = {前称号id, 后称号id}（RoleMgr.getFullTitleName 查 CfgRole.title 表，查不到返回空串）
//   - `scores[1]` = 显示值（type=1 原样；type=2 服务端须发**万分比整数**，客户端
//     `math.digit(v/100,1).."%"` → 5000 显示 "50%"）
//   - `avatar` = p_avatar **单对象**（RankVO 读 `.skin` 当头像；空数组编成 NIL → 崩）
// · 行点击（RankItem.onClick）：非自己 → `m_friend_info_tos{role_id,type=INFO_TYPE_LOOK(0)}`
//   → 服务端回 `m_friend_info_toc{info,type}` → 客户端 `OPEN_ROLE_INFORMATION_PANEL(roleID)`
//   打开 **OtherRolePanel**（资料页）。这条链原来也没实现（fallback 空壳 info → 客户端
//   `Util.int64ToNumber(nil)` 报 `attempt to compare userdata with nil`），本文件一并补上，
//   且**与榜单同源**：点谁就是谁的头像/名字/分数（NPC 与玩家都自洽）。
//   type=INFO_TYPE_FIND(1) 是"查找玩家"路径（FriendFindView 用），本地服无查找功能 → 同口径回。
//
// ── 单机口径（无其他玩家）──
// 与圣诞/投票活动同思路：NPC 陪跑名单（rank_data.js 的 NPC_NAMES/NPC_SKINS）+ 玩家真实分数。
// 分数基准 = 玩家自己的分数，NPC 分数围绕它做确定性偏移（h32 散列，重启不变），
// 保证：① 玩家永远在前 12 名内可见；② 名次稳定不闪；③ 榜首会随玩家分数变化。
'use strict';
const { S } = require('../state');
const L = require('../lib');
const { log } = L;
const RD = require('../data/rank_data');

const nowSec = () => Math.floor(Date.now() / 1000);

// 确定性散列（与 handbook.js 同款）：单机陪跑数据不落盘，用 id 散列保证稳定
function h32(x) {
  let n = (Number(x) ^ 0x9e3779b9) >>> 0;
  n = Math.imul(n ^ (n >>> 16), 2246822507) >>> 0;
  n = Math.imul(n ^ (n >>> 13), 3266489909) >>> 0;
  return (n ^ (n >>> 16)) >>> 0;
}

// ---- 玩家自己在各榜的真实分数 ----
// 3 图鉴收集 / 5 成就收集 = 万分比（客户端 type=2 按 v/100 加 %）。
let HANDBOOK_TOTAL = 0;
let ACHV_LIST = [];
try { HANDBOOK_TOTAL = require('../data/handbook_data').COUNT_NORMAL || 0; } catch (e) { /* 忽略 */ }
try { ACHV_LIST = require('../data/achievement_data').ACHIEVEMENTS || []; } catch (e) { /* 忽略 */ }

function handbookPct() {
  const hs = S.handbookState || {};
  const owned = Object.keys(hs.actives || {}).length;
  return Math.min(10000, Math.round(owned * 10000 / Math.max(1, HANDBOOK_TOTAL)));
}

function achievementPct() {
  if (!ACHV_LIST.length) return 0;
  const claimed = (S.achvState && S.achvState.claimed) || [];
  const done = ACHV_LIST.filter(a => claimed.includes(a.id)).length;
  return Math.min(10000, Math.round(done * 10000 / ACHV_LIST.length));
}

function playerScore(rankId) {
  switch (Number(rankId)) {
    case RD.RANK_ARENA_CUR:
    case RD.RANK_ARENA_LAST:
      // 演武积分：本地服无独立 PVP 玩法（功能5 仅点亮）→ 用神迹演武积分（role_scores id=1）
      // 同口径（collab.js 已按"演武任务按战斗计"备注过）。没打过则为 0。
      return L.getScore(1);
    case RD.RANK_HANDBOOK:
      return handbookPct();
    case RD.RANK_ROLE_LEVEL:
      return Number(S.roleAsset.level) || 1;
    case RD.RANK_ACHIEVEMENT:
      return achievementPct();
    default:
      return 0;
  }
}

// 玩家自己的 job 贴图号：客户端 RankItem 的 texJob 走 UI/Rank/Textures_Lang/<job>（assets 有 1..11）。
// 玩家无结社职位 → 用 1（"无职位"档，贴图存在）。
const MY_JOB = 1;

// ---- p_avatar（单对象！）----
// 头像贴图 = ServantUtil.getPathFightHead(avatar.skin) = UI/Servant/Textures/FightHeads/<skin>。
// 玩家取看板娘皮肤（helperOrderIds 首位 → 对应 servant 的 skin_id），保证真实存在。
function myAvatar() {
  const ids = L.helperOrderIds();
  const helper = S.servants.find(x => x.id === ids[0]) || S.servants[0];
  const skin = (helper && helper.skin_id) || 0;
  // 三百零一：叠加头像/头像框佩戴态（useType=0 时只生效 border，其余保持原样）
  return Object.assign({ use: 1, face: 1, head: 0, skin, border: 0, costume: [] },
    require('./avatar').selfAvatarFields());
}
function npcAvatar(i) {
  return { use: 1, face: 1, head: 0, skin: RD.NPC_SKINS[i % RD.NPC_SKINS.length], border: 0, costume: [] };
}

// ---- p_rank_row ----
// key = role_id（long）。NPC 用 9xxx 段避开真实 roleId（6000355922）与誓灵 id（90000xxx）——
// 90000xxx 段已被誓灵占用，这里用 9100001+i。
const NPC_ID_BASE = 9100001;

function myRow(rankId, ranking, score) {
  return {
    index: ranking,
    ranking,
    key: L.roleId,
    elements: [S.roleName || '指挥官'],   // elements[1] = 名字，客户端读完 remove(1)
    int_list: [MY_JOB],
    titles: [0, 0],                       // 未佩戴称号（CfgRole.title 查不到 → 空串，不崩）
    medals: [],                           // 勋章（客户端按佩戴列表渲染，空=NPC 无勋章）
    scores: [score],
    avatar: myAvatar(),
  };
}
function npcRow(i, rankId, ranking, score) {
  return {
    index: ranking,
    ranking,
    key: NPC_ID_BASE + i,
    elements: [RD.NPC_NAMES[i % RD.NPC_NAMES.length]],
    int_list: [RD.NPC_JOBS[i % RD.NPC_JOBS.length]],
    titles: [0, 0],
    medals: [],
    scores: [score],
    avatar: npcAvatar(i),
  };
}

// ---- 榜单生成（确定性：同一分数下名次稳定）----
// 玩家 + 12 NPC 一起按分数降序。NPC 分两带构造（偏移由 h32 固定，重启不变）：
//   · 上位带（4 人）：分数 = 玩家分 × 1.02~1.30 → 玩家前面始终有几个人可追
//   · 下位带（8 人）：分数 = 玩家分 × 0.18~0.92 → 玩家后面始终有人
// 于是玩家稳定落在第 5 名附近，**永远在前 12 名列表里**（客户端列表只显示前 row_num，
// 玩家若排到 12 名开外，榜单页上就看不到自己那行——只有底部"我的排名"能看见）。
// 玩家分数为 0（新号，如从未打过演武）时下位带全为 0、与玩家同分——此时靠 tie 让玩家
// 排在所有 0 分 NPC 之前（否则玩家会掉到第 13 名）。这也是**不**给 0 分玩家垫虚拟分的
// 原因：列表里显示的就是玩家真实分数，不造假。
// 下限（floor）只作用于**上位带**的基准：玩家 0 分时上位带仍要有像样的分数，
// 否则 0×1.3 还是 0，整榜全 0 看不出名次。
const BASE_FLOOR = { arena: 500, level: 3, pct: 800 };
function floorOf(meta) {
  if (meta.type === 2) return BASE_FLOOR.pct;
  return meta.kind === 'level' ? BASE_FLOOR.level : BASE_FLOOR.arena;
}

const PLAYER_TIE = 999;   // 同分时玩家排最前（NPC tie 上限 996）

// 分数下限：等级榜的等级从 1 起（发 0 会显示"Lv.0"，客户端不崩但不像话）；其余榜 0 合法
function minValOf(meta) { return meta.kind === 'level' ? 1 : 0; }

function buildBoard(rankId) {
  const rid = Number(rankId) || 1;
  const meta = RD.RANK_META[rid] || RD.RANK_META[RD.RANK_ARENA_CUR];
  const pScore = playerScore(rid);
  const floor = floorOf(meta);
  const minVal = minValOf(meta);
  const topBase = Math.max(pScore, floor);   // 上位带基准（0 分玩家的"看起来像样"下限）
  const clampSc = v => {
    let sc = Math.max(minVal, Math.round(v));
    if (meta.type === 2) sc = Math.min(10000, sc);
    return sc;
  };

  const npcs = RD.NPC_NAMES.map((_, i) => {
    const r = h32(rid * 1000 + i);
    const above = i < 4;   // 前 4 个 NPC 在玩家之上
    const score = above
      ? clampSc(topBase * (1.02 + (r % 29) / 100))       // 1.02~1.30
      : clampSc(pScore * (0.18 + (r % 75) / 100));       // 0.18~0.92
    return { i, score, tie: r % 997 };
  });

  const all = npcs.map(n => ({ npc: true, i: n.i, score: n.score, tie: n.tie }));
  all.push({ npc: false, score: pScore, tie: PLAYER_TIE });
  // 分数降序；同分按 tie 降序 —— 玩家 tie=PLAYER_TIE(999) 最大，
  // 所以 0 分新号在"一票 0 分 NPC"里排最前，不会掉出前 12
  all.sort((a, b) => (b.score - a.score) || (b.tie - a.tie));

  const rows = [];
  all.forEach((e, idx) => {
    const ranking = idx + 1;
    if (e.npc) rows.push(npcRow(e.i, rid, ranking, e.score));
    else rows.push(myRow(rid, ranking, e.score));
  });
  const my = rows.find(r => r.key === L.roleId);
  return { rows, my, total: rows.length, meta };
}

// ---- 协议实现 ----
function handleGetInfo(conn, obj) {
  const rankId = Number(obj && obj.rank_id) || RD.RANK_ARENA_CUR;
  const board = buildBoard(rankId);
  conn.sendToc('m_rank_get_info_toc', {
    rank_id: rankId,
    row_num: board.total,
    self_row: board.my,
    threshold: [],   // 本地服无段位门槛（客户端有 #threshold+1 兜底，不崩）
  });
  log(`[rank] info rank_id=${rankId}(${board.meta.name}) 榜单 ${board.total} 人，我第 ${board.my.ranking} 名（${board.my.scores[1]}）`);
}

function handleGetRank(conn, obj) {
  const rankId = Number(obj && obj.rank_id) || RD.RANK_ARENA_CUR;
  const from = Math.max(1, Number(obj && obj.from) || 1);
  const to = Math.max(from, Number(obj && obj.to) || from);
  const board = buildBoard(rankId);
  // 1 基切片 [from, to]（客户端按 12 条一页续拉；越界返回空数组，客户端列表停更但不清空）
  const rows = board.rows.slice(from - 1, to).map((r, i) => Object.assign({}, r, { index: from + i }));
  conn.sendToc('m_rank_get_rank_toc', { rank_id: rankId, rows });
  log(`[rank] rows rank_id=${rankId} from=${from} to=${to} → ${rows.length} 条`);
}

// ---- 排行行点击 → 资料页（m_friend_info_tos）----
// 客户端 FriendMainVO.resetFriendData 逐字段读取（tools/bc_cmp/FriendMainVO_ljd.lua 实证）：
//   role_id/role_name/role_level/login_time/offline_time/is_online/titles/intro/
//   type(助手誓灵 type)/star/level/prosperity/dorm_lv/medals/avatar(p_avatar 单对象)/extra
// 其中 `avatar.skin` 被读成 skinID、`type` 被 `ServantConfig.getServantConfigVO(type)` 查表
// （查不到会 printError 并返回 nil → 紧接着 `servantVO.skinID = ...` 崩），
// 所以 **type 必须是 CfgServant 里真实存在的誓灵 type**（NPC 皮肤 id // 100 即可）。
// intro 空串安全（OtherRolePanel.lblDesc 直接赋值）。
const FRIEND_INFO_TYPE_LOOK = 0;   // FriendConst.INFO_TYPE_LOOK

// NPC 皮肤 id → 誓灵 type（皮肤 id = type*100 + 序号，与 skin_id 命名规则一致）
function typeOfSkin(skin) { return Math.floor(Number(skin) / 100); }

// 在榜单里找 key（NPC 用 9100001+i 段，玩家用真实 roleId）
function findRowByKey(rankId, key) {
  const board = buildBoard(rankId);
  const k = String(key);
  return board.rows.find(r => String(r.key) === k) || null;
}

// 玩家自己的资料（type/star/level 取看板娘，与榜单头像同源）
function myProfile() {
  const ids = L.helperOrderIds();
  const helper = S.servants.find(x => x.id === ids[0]) || S.servants[0] || {};
  const now = nowSec();
  return {
    role_id: L.roleId,
    role_name: S.roleName || '指挥官',
    role_level: Number(S.roleAsset.level) || 1,
    login_time: now,
    offline_time: 0,          // 在线：offline_time=0 → 客户端显示"1小时内"
    is_online: 1,
    titles: [0, 0],
    intro: '',
    type: Number(helper.type) || 0,
    star: Number(helper.star) || 2,
    level: Number(helper.level) || 1,
    // 协会榜"我"的繁荣度 = 家具 point 合计（与协会 detail/成就 4001 同源，dorm.furnitureProsperity）。
    // 旧值恒 0 = 协会清单 E-3（榜单上"我"的繁荣度恒 0）；NPC 行保持 0 属正常（NPC 没有协会）。
    prosperity: require('./dorm').furnitureProsperity() || 0,
    dorm_lv: Math.min(3, Math.max(1, Number(S.dormState && S.dormState.lv) || 1)),
    medals: [],
    avatar: myAvatar(),
    extra: [],
  };
}

function npcProfile(i) {
  const skin = RD.NPC_SKINS[i % RD.NPC_SKINS.length];
  const now = nowSec();
  return {
    role_id: NPC_ID_BASE + i,
    role_name: RD.NPC_NAMES[i % RD.NPC_NAMES.length],
    role_level: 60 + (h32(i * 31 + 7) % 40),   // 60~99 级（确定性）
    login_time: now - 3600,
    offline_time: 1800 + (h32(i * 17 + 3) % 86400),  // 半小时~一天前
    is_online: h32(i * 7 + 5) % 2,                   // 一半在线一半离线（确定性）
    titles: [0, 0],
    intro: '',
    type: typeOfSkin(skin),
    star: 3 + (h32(i * 11 + 9) % 3),   // 3~5 星
    level: 60 + (h32(i * 13 + 11) % 40),
    prosperity: 0,
    dorm_lv: 1 + (h32(i * 19 + 13) % 3),
    medals: [],
    avatar: npcAvatar(i),
    extra: [],
  };
}

function handleFriendInfo(conn, obj) {
  const roleId = obj && obj.role_id;
  const infoType = Number(obj && obj.type) || 0;
  const k = String(roleId);
  const info = (k === String(L.roleId)) ? myProfile() : (() => {
    // NPC：key 落在 9.1M 段 → 反解索引；否则从榜单反查（防御：任意 key 都能给出一份自洽资料）
    const n = Number(roleId) - NPC_ID_BASE;
    if (Number.isFinite(n) && n >= 0 && n < RD.NPC_NAMES.length) return npcProfile(n);
    const row = findRowByKey(RD.RANK_ARENA_CUR, roleId);
    if (row && row.avatar) {
      const idx = RD.NPC_SKINS.indexOf(Number(row.avatar.skin));
      if (idx >= 0) return npcProfile(idx);
    }
    // 查无此人：回一份空资料（role_id 回显，客户端 int64ToNumber 不崩）
    return Object.assign(myProfile(), {
      role_id: roleId || 0, role_name: '', role_level: 0, is_online: 0,
      type: 0, star: 0, level: 0, avatar: { use: 1, face: 1, head: 0, skin: 0, border: 0, costume: [] },
    });
  })();
  conn.sendToc('m_friend_info_toc', { info, type: infoType });
  log(`[rank] friend_info role_id=${roleId} type=${infoType} → ${info.role_name || '(空)'}（type=${info.type} skin=${info.avatar.skin}）`);
}

module.exports = {
  buildBoard, playerScore, handleGetInfo, handleGetRank, handleFriendInfo,
  RANK_META: RD.RANK_META, SHOW_RANKS: RD.SHOW_RANKS,
  handlers: {
    m_rank_get_info_tos: handleGetInfo,
    m_rank_get_rank_tos: handleGetRank,
    // 排行行点击 → 资料页（榜单下游；顺带覆盖好友/聊天里同协议的"看资料"入口）
    m_friend_info_tos: handleFriendInfo,
  },
};
