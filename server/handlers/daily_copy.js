// 曜日副本（每日材料本；副本→每日副本→曜日副本，功能 ID 4，通关 2-3 开启）。
//
// 定位：三章 × 3 关 = 9 关，按星期轮换开放（修炼 周一/四/日 / 进化 周二/五/日 / 圣器 周三/六/日），
// 每章 2 次/天。**进化章是誓灵进化（升星）材料的唯一产出口**——本模块与 handlers/servant.js 的
// m_servant_evolution_upgrade_tos 一起构成「打材料本 → 攒材料 → 升星 → 解锁进化皮肤/更高种族值档位」闭环。
//
// 与其他副本模块的分工（关键设计决策）：
//   银匙之门（dream.js）自带一整套战斗引擎，因为它有九宫格站位、怒气、替补增援、特殊机制，与主线差异太大。
//   曜日副本**没有任何战斗规则差异**（同 6 格站位、同技能/PP、同结算），差异只在
//   「入口/开放星期/次数/掉落」——所以这里**不写引擎**：给 MAP_CONFIGS 注册 9 条合成关卡配置
//   （data/daily_copy_data.js 的 DAILY_MAP_CONFIGS，monsterChain/fogAfter 留空即绕过全部地图分支），
//   m_copy_fight_tos 校验+扣次数后直接委托 map_fight，回合链/结算链原样复用。
//   结算奖励差异由 map_fight 认 cfg.dailyCopy 标记后回调本模块（settleRewards）。
//
// 客户端不走小地图：CopyConst.COPY_TYPE_MAP 不含 TYPE_DROP，Config 下也不存在 CfgMap_2*。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log, grantGoods, pushGoodsUpdate, pushAssetChange } = L;
const D = require('../data/daily_copy_data');
const MF = require('./map_fight');

// 官方错误码（CfgErrorCode）：曜日副本没有专属码段，借语义精确的通用码——
//   64「功能还未开启」= 未通关 2-3 / 该章今日不开放
//   19「角色等级不足」= 未达 minLv（0/25/40）
//   262014「副本次数不足」= 今日 2 次用完（262xxx 正是副本/体力码段）
const ERR_NOT_OPEN = 64;
const ERR_LEVEL = 19;
const ERR_TIMES = 262014;

function st() {
  if (!S.dailyCopyState) S.dailyCopyState = { day: '', times: {}, cleared: [], forceOpen: 0 };
  const s = S.dailyCopyState;
  if (!s.times) s.times = {};
  if (!Array.isArray(s.cleared)) s.cleared = [];
  // 跨天重置：次数按服务器本地日期（与体力/任务重置同口径）
  const today = new Date().toLocaleDateString('sv');  // YYYY-MM-DD（本地时区）
  if (s.day !== today) {
    s.day = today;
    s.times = {};
    log(`[daily] 曜日副本每日次数重置（${today}）`);
  }
  return s;
}

function isFuncOpen() {
  return L.buildOpenFunctions().includes(D.FUNC_ID_COPY_DROP);
}

// 今日开放章节：forceOpen=1（GM）时三章全开，便于任意一天自测
function openChapters() {
  const s = st();
  return s.forceOpen ? Object.keys(D.DAILY_CHAPTERS).map(Number) : D.openChaptersAt();
}

function usedTimes(chapter) {
  return Number(st().times[chapter]) || 0;
}
function remainTimes(chapter) {
  return Math.max(0, D.DAILY_TIMES_MAX - usedTimes(chapter));
}

// 指挥官等级门槛（CfgCopy.copy.minLv 0/25/40）：客户端只用它渲染"25级开启"文案，
// 真正的可进入判定是 barrierCanEnter = barrier 是否在 m_copy_barrier_info_toc.barriers 里
function roleLevel() {
  return Number(S.roleAsset.level) || 1;
}

// p_daily_entry 列表（客户端 RoleMgr.dailyDic，CopyDropView 的"今日剩余次数"读它）
// ⚠️ 本函数是 m_activity_daily_toc 全量包的唯一出口（三百一十）：客户端消费是**整表替换**
//（RoleMgr_ljd.lua:41 dailyDic=table.toDic，指南 C-8），所以必须恒含 EX 挑战关的 20004 条目——
// 少了它，每次全量推送（登录/GM 重置）都会把 dailyDic 里的 20004 抹掉：显示回满、
// 进关仍被 262011 拒（"GM 刷新没用"的另一半根因）。懒加载防 require 环。
function dailyEntries() {
  const s = st();
  const entries = Object.keys(D.DAILY_CHAPTERS).map(Number).map(c => ({
    id: D.DAILY_TIMES_KEY_BASE + c,
    current_times: Number(s.times[c]) || 0,
  }));
  const MF = require('./map_fight');
  entries.push({ id: MF.EX_DAILY_ID, current_times: MF.exDaily().used });
  return entries;
}
// 登录全量（m_activity_daily_toc 无 tos，官方为服务端主动推；不推则剩余次数恒 2/2 且打完不减）
function pushDailyTimes(conn) {
  conn.sendToc('m_activity_daily_toc', { actives: dailyEntries() });
}
// 增量（战斗后必须推，否则面板剩余次数不刷新）
function pushDailyTimesUpdate(conn, chapter) {
  conn.sendToc('m_role_daily_update_toc', {
    updates: [{ id: D.DAILY_TIMES_KEY_BASE + chapter, current_times: usedTimes(chapter) }],
  });
}

function pushDailyInfo(conn) {
  const chapters = openChapters();
  conn.sendToc('m_copy_daily_info_toc', { chapters });
  log(`[daily] 今日开放章节 [${chapters.join(',') || '空'}]`
    + chapters.map(c => ` ${D.DAILY_CHAPTERS[c].name}(剩${remainTimes(c)}/${D.DAILY_TIMES_MAX})`).join(''));
}

function onLogin(conn) {
  st();
  saveState();
  pushDailyTimes(conn);
  pushDailyInfo(conn);
}

// ---- 结算奖励（由 map_fight 在 cfg.dailyCopy 关卡胜利时回调）----
// 返回 p_reward[]（结算面板 item_reward）。**必须是真实道具 ID**：
// CfgCopyDetail.reward 里的 31000006/7/8 是「进化材料1/2/3」展示聚合道具（CfgItems.data.showItems
// 才是真实材料列表），发它只会在背包里塞一个不能用于进化的聚合物品
function settleRewards(conn, barrierId, rng) {
  const cfg = D.DAILY_BARRIERS[barrierId];
  if (!cfg) return { rewards: [], silver: 0 };
  const s = st();
  const drops = D.rollDrops(barrierId, rng);
  const changed = [];
  for (const d of drops) changed.push(...grantGoods(d.type, d.num, conn));
  const silver = (D.DROPS[barrierId] || {}).silver || 0;
  S.roleAsset.silver = (S.roleAsset.silver || 0) + silver;
  if (!s.cleared.includes(barrierId)) s.cleared.push(barrierId);
  saveState();
  if (changed.length) pushGoodsUpdate(conn, changed, 3);
  pushAssetChange(conn);
  pushDailyTimesUpdate(conn, cfg.chapter);
  const EV = require('../data/evolution_rules');
  log(`[daily] ${cfg.name}（${barrierId}）通关掉落：`
    + drops.map(d => `${EV.matName(d.type)}x${d.num}`).join(' ') + ` 金币+${silver}`
    + ` 今日次数 ${usedTimes(cfg.chapter)}/${D.DAILY_TIMES_MAX}`);
  return { rewards: drops, silver };
}

module.exports = {
  st, isFuncOpen, openChapters, remainTimes, usedTimes, dailyEntries,
  pushDailyTimes, pushDailyInfo, onLogin, settleRewards,
  handlers: {
// 打开曜日副本页时发（CopyDropView.onOpenMainView 末尾）：今日开放章节。
// 无副作用、可重复调用——客户端每次开面板都会发一次
m_copy_daily_info_tos(conn) {
  pushDailyInfo(conn);
},
// 关卡列表。曜日走 copy=2 且客户端强制 chapter=0（CopyModule.toBarrierInfo 对 isDropCopy 置 0）
// → 一次性回全部 9 关。非 copy=2 一律回落 map_fight（主线/材料页签旧兜底）
m_copy_barrier_info_tos(conn, obj) {
  if (Number(obj && obj.copy) !== 2) return MF.handlers.m_copy_barrier_info_tos(conn, obj);
  const s = st();
  const lv = roleLevel();
  // **等级不够的关卡不能放进 barriers**：客户端 barrierCanEnter 就是"barrier 在不在这个数组里"，
  // 放进来就能点，客户端不会用 minLv 拦（minLv 只决定按钮文案）
  const barriers = Object.keys(D.DAILY_BARRIERS).map(Number)
    .filter(bid => lv >= D.DAILY_BARRIERS[bid].minLv)
    .map(bid => ({
      barrier_id: bid,
      // 三星：extraCondition 后两条（"见敌必杀，一击致命"/"祝武运方昌"）客户端无判定语义 →
      // 本地服口径同主线：通关即三星
      stars: s.cleared.includes(bid) ? [1, 2, 3] : [],
      servant_types: [],
      drop_rate_up: [],
      servant_rate_up: [],
      pass_times: s.cleared.includes(bid) ? 1 : 0,
      first_reward: 0, // 曜日 9 关 CfgCopy 都没有 firstReward → 无首通奖励 UI
    }));
  conn.sendToc('m_copy_barrier_info_toc', {
    copy: 2,
    cur_chapter: 0,
    chapter: 0,
    barriers,
    act_end_time: [],
    max_chapter: 1, // 该字段客户端只在 copy==TYPE_MAIN 时采纳
  });
  log(`[daily] 关卡列表：${barriers.length}/9 关（指挥官 Lv${lv}，门槛 0/25/40）`
    + ` 已通关 [${s.cleared.join(',') || '无'}]`);
},
// 编队选择（进曜日副本前必发；不应答则永远开不了布阵面板）。
// 回显三字段即可——客户端 FormationModule 只用它做"已拉过该副本编队"的缓存标记
m_team_template_select_tos(conn, obj) {
  const copyType = Number((obj && obj.copy_type) || 0);
  const copyKey = Number((obj && obj.copy_key) || 0);
  const teamId = Number((obj && obj.team_id) || 1);
  conn.sendToc('m_team_template_select_toc', { copy_type: copyType, copy_key: copyKey, team_id: teamId });
  log(`[daily] 编队选择回显 copy_type=${copyType} copy_key=${copyKey} team=${teamId}`);
},
// 出战：曜日 copy_id → 本模块校验并扣次数/体力，然后**委托 map_fight** 建 fight 会话。
// 非曜日 copy_id 回落 dream（它再回落 map_fight）——三个模块在 start.js 里串成
// map_fight → dream → daily_copy 一条链，本模块装配在最后，所以回落必须显式点到 dream，
// 直接点 map_fight 会把银匙之门的分支整条吞掉
m_copy_fight_tos(conn, obj) {
  const copyId = Number((obj && obj.copy_id) || 0);
  const cfg = D.DAILY_BARRIERS[copyId];
  if (!cfg) return require('./dream').handlers.m_copy_fight_tos(conn, obj);
  const s = st();
  const err = (code, why) => { conn.sendToc('m_common_error_toc', { code }); log(`[daily] 拒绝（${code}）：${why}`); };
  if (!isFuncOpen()) return err(ERR_NOT_OPEN, '曜日副本未解锁（需通关 2-3）');
  if (!openChapters().includes(cfg.chapter)) {
    return err(ERR_NOT_OPEN, `${D.DAILY_CHAPTERS[cfg.chapter].name} 今日未开放（开放日 ${D.DAILY_CHAPTERS[cfg.chapter].openDays.join('/')}）`);
  }
  if (roleLevel() < cfg.minLv) return err(ERR_LEVEL, `${cfg.name} 需指挥官 Lv${cfg.minLv}（当前 Lv${roleLevel()}）`);
  if (remainTimes(cfg.chapter) <= 0) return err(ERR_TIMES, `${D.DAILY_CHAPTERS[cfg.chapter].name} 今日次数已用完`);
  // 体力：与主线出击同口径（出战队伍 costVit 之和；不足时 spendSortieVit 已回 262006"体力不足"）
  const lastId = Number((S.mapState && S.mapState.lastId)) || 1;
  if (!require('./vit').spendSortieVit(conn, lastId)) return;
  s.times[cfg.chapter] = usedTimes(cfg.chapter) + 1;
  // 战斗上下文：曜日无小地图，这里手工把 mapState 指到合成关卡配置上，
  // 让 map_fight 的 mapCfg()/waves[copyId] 命中 DAILY_MAP_CONFIGS（fighting=0 → 结算不走地图推进）
  S.mapState = { barrierId: copyId, lastId, pos: 0, fighting: 0, zone: 0, defeated: [], use_team_ids: [lastId] };
  saveState();
  pushDailyTimesUpdate(conn, cfg.chapter);
  log(`[daily] 进入 ${cfg.name}（${copyId}）：${D.DAILY_CHAPTERS[cfg.chapter].name} 第${cfg.tier}关`
    + ` 敌方 lv${cfg.suggestLv} × ${cfg.rounds} 波，本日次数 ${usedTimes(cfg.chapter)}/${D.DAILY_TIMES_MAX}`);
  MF.handlers.m_copy_fight_tos(conn, obj);
},
  },
};
