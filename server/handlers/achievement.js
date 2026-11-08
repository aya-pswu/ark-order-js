// 成就系统（Achievement，主页→成就）：3 条协议 + 进度引擎 + 各业务钩子。
//
// ── 客户端事实（tools/bc_cmp/Achievement* 反编译实证）──
// · 进度完全由服务端算：m_achievement_info_toc{list:[p_achievement]}，
//   p_achievement = {id, state(1可领/2已领/3未达成), time, cur_progress, total_progress}。
//   客户端 AchievementMgr 按 id 建 VO 字典（kind = id 首位 1收集/2战斗/3养成/4其他），
//   **发给 kind 5/6（结社贡献/信仰）会触发"后端传了一个不存在的成就id"** → 只发 1-4。
// · m_achievement_get_toc 客户端 handler 是空函数 → 领奖后必须另推
//   m_achievement_update_toc{update:[p_achievement]} 刷新状态（否则按钮不变灰）。
// · state 语义：达成未领=1(CAN_GET)、已领=2(HAS_GET)、未达成=3(NOT_GET)。
// · 官方配置 id 2000 有两条（伤害+头像框共用）→ 数据层已去重为 397 条（客户端同款折叠）。
// · 进度规则见 data/achievement_data.js（生成期从 title 解析）+ data/achievement_rules.js（取数）。
//   规则 'none'（无限领域/神迹演武/信仰/爵位/主题场景/活动）进度恒 0。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log } = L;
const AD = require('../data/achievement_data');
const R = require('../data/achievement_rules');

const nowSec = () => Math.floor(Date.now() / 1000);

function st() {
  if (!S.achvState) S.achvState = { claimed: [], counters: {} };
  const s = S.achvState;
  if (!Array.isArray(s.claimed)) s.claimed = [];
  if (!s.counters) s.counters = {};
  const C = s.counters;
  if (!C.killsNature) C.killsNature = {};
  if (!C.barrierClears) C.barrierClears = {};
  if (!C.slimeClears) C.slimeClears = {};
  if (!C.dareDamage) C.dareDamage = {};
  return s;
}

// ---- 计数器钩子（各业务调用）----
function bumpCounter(key, delta) {
  const C = st().counters;
  C[key] = (Number(C[key]) || 0) + Number(delta || 0);
  return C[key];
}
function onBattleStats(st2, cfg) {
  // 战斗胜利统计：击杀（总/按属性）、最大单 Hit、关卡通关次数、史莱喵通关。
  // map_fight.onBattleWon 在类型分支前调用（主线/曜日/唤灵殿堂通用；银匙之门引擎独立不计）。
  const s = st();
  const C = s.counters;
  const kills = Number(st2.killsTotal) || (st2.enemies || []).filter(e => e.hp <= 0).length;
  if (kills > 0) C.kills = (Number(C.kills) || 0) + kills;
  for (const [n, v] of Object.entries(st2.killNature || {})) {
    C.killsNature[n] = (Number(C.killsNature[n]) || 0) + Number(v);
  }
  if (st2.maxHit) C.maxHit = Math.max(Number(C.maxHit) || 0, Number(st2.maxHit));
  // 通关 N-4 计数（24xxx；仅主线章节的 BOSS 关）
  const barrierId = st2.barrierId || 0;
  if (barrierId >= 1010400 && barrierId <= 1100400 && barrierId % 10000 === 400) {
    C.barrierClears = C.barrierClears || {};
    C.barrierClears[barrierId] = (Number(C.barrierClears[barrierId]) || 0) + 1;
    // 25xxx：编队含史莱喵/黄金史莱喵通关 N-4（一次性）
    const slime = (st2.allies || []).some(a => R.SLIME_TYPES.includes(Number(a.type)));
    if (slime) {
      C.slimeClears = C.slimeClears || {};
      if (!C.slimeClears[barrierId]) C.slimeClears[barrierId] = 1;
    }
  }
  void cfg;
}
function addDispatch() { bumpCounter('dispatch', 1); }
function addMissionClaim(group) {
  // group 2=日常 3=周常（missions_data 的 group 字段）
  if (Number(group) === 2) bumpCounter('dailyMission', 1);
  else if (Number(group) === 3) bumpCounter('weeklyMission', 1);
}
function addSummon(times, hasUR, urCount, isTen) {
  const C = st().counters;
  C.summons = (Number(C.summons) || 0) + Number(times || 0);
  if (hasUR) C.urlessStreak = 0;
  else C.urlessStreak = (Number(C.urlessStreak) || 0) + Number(times || 0);
  if (isTen) C.tenPullURMax = Math.max(Number(C.tenPullURMax) || 0, Number(urCount || 0));
}
function addFriendPoints(n) { if (Number(n) > 0) bumpCounter('friendPoints', n); }
function addFamilyContribution(n) { if (Number(n) > 0) bumpCounter('familyContribution', n); }
function addDareDamage(slot, dmg) {
  if (!(Number(dmg) > 0)) return;
  const C = st().counters;
  C.dareDamage = C.dareDamage || {};
  C.dareDamage[slot] = (Number(C.dareDamage[slot]) || 0) + Number(dmg);
}

// ---- 进度下发 ----
function itemOf(a, s) {
  const cur = R.progressOf(a);
  const claimed = s.claimed.includes(a.id);
  return {
    id: a.id,
    state: claimed ? 2 : (cur >= a.total ? 1 : 3),
    time: claimed ? (s.claimTime && s.claimTime[a.id]) || 0 : 0,
    cur_progress: Math.min(cur, a.total),
    total_progress: a.total,
  };
}

function pushUpdates(conn, force) {
  const s = st();
  const changed = [];
  const snapshot = s.snapshot || (s.snapshot = {});
  for (const a of AD.ACHIEVEMENTS) {
    const it = itemOf(a, s);
    const key = `${it.state}:${it.cur_progress}`;
    if (force || snapshot[a.id] !== key) {
      snapshot[a.id] = key;
      changed.push(it);
    }
  }
  if (changed.length) conn.sendToc('m_achievement_update_toc', { update: changed });
  return changed.length;
}

function handleInfo(conn) {
  const s = st();
  const list = AD.ACHIEVEMENTS.map(a => itemOf(a, s));
  conn.sendToc('m_achievement_info_toc', { list });
  // 同步快照（info 即权威全量）
  s.snapshot = {};
  for (const it of list) s.snapshot[it.id] = `${it.state}:${it.cur_progress}`;
  saveState();
  const canGet = list.filter(i => i.state === 1).length;
  log(`[achv] 成就下发 ${list.length} 条（可领 ${canGet}，已领 ${s.claimed.length}）`);
}

// ---- 领奖 ----
function handleGet(conn, obj) {
  const id = Number(obj && obj.id) || 0;
  const a = AD.ACHIEVEMENTS.find(x => x.id === id);
  const s = st();
  if (!a || s.claimed.includes(id)) {
    conn.sendToc('m_achievement_get_toc', { id, reward: [] });
    return;
  }
  const cur = R.progressOf(a);
  if (cur < a.total) {
    conn.sendToc('m_achievement_get_toc', { id, reward: [] });
    log(`[achv] 拒绝领奖 ${id}（进度 ${cur}/${a.total}）`);
    return;
  }
  // 发奖：30000003 金币 / 30000000 水晶走货币，**道具形态积分**落 role_scores，其余入包（与任务奖励同口径）
  const rw = a.reward;
  if (rw.id === 30000003) {
    S.roleAsset.silver += rw.num;
    L.pushAssetChange(conn);
  } else if (rw.id === 30000000) {
    S.roleAsset.gold += rw.num;
    S.roleAsset.gold_given += rw.num;
    L.pushAssetChange(conn);
  } else if (L.grantScoreItem(conn, rw.id, rw.num)) {
    // 已落 role_scores 并推送 m_role_score_change_toc
  } else {
    // conn 必须透传：212 条成就奖励是称号盒（25001001~25001999，form=2 不进背包），
    // grantGoods 的称号分支靠 conn 即时推 m_role_title_update_toc（2026-10-25 前 212 条全发成死道具）
    const changed = L.grantGoods(rw.id, rw.num, conn);
    if (changed && changed.length) L.pushGoodsUpdate(conn, changed, 3);
  }
  s.claimed.push(id);
  s.claimTime = s.claimTime || {};
  s.claimTime[id] = nowSec();
  saveState();
  conn.sendToc('m_achievement_get_toc', { id, reward: [{ type: rw.id, num: rw.num }] });
  pushUpdates(conn);
  log(`[achv] 领奖 ${id}「${a.title}」→ ${rw.id}x${rw.num}`);
}

module.exports = {
  st, handleInfo, handleGet, pushUpdates,
  onBattleStats, addDispatch, addMissionClaim, addSummon,
  addFriendPoints, addFamilyContribution, addDareDamage, bumpCounter,
  handlers: {
    m_achievement_info_tos: handleInfo,
    m_achievement_get_tos: handleGet,
  },
};
