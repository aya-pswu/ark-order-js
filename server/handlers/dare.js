// 唤灵殿堂（Dare/羁绊副本；副本页签 DareBanner，功能 ID 10 = FUNC_ID_AFFINITY，通关 3-1 开启）。
//
// ── 客户端事实（tools/bc_cmp/dare_* 反编译实证）──
// · 结构：chapter 0 = 活动挑战（13 个轮换 BOSS）+ chapter 1-8 = 挑战等级 Lv40~Lv120（27 个 BOSS），
//   每 BOSS 一场固定战斗（copyID 100001xx/1001xx00 段），消耗参战誓灵"元气"（spirit=10/只）。
// · 战斗链 = 标准 m_copy_fight_prepare_tos{copy_id} → CopyPlanPanel → m_copy_fight_tos{copy_id}
//   （同曜日，无小地图）；奖励 = 首通（m_dare_pass_reward_tos 领取）+ 每周奖励
//   （按每章战胜 BOSS 数分档，m_dare_store_reward_tos 一次领取全部已达档）。
// · m_dare_info_toc{chapter_list, store_rewards, got_rewards}：chapter_list **只含已解锁章**
//   （客户端 updateDareInfo 对在列表里的章 setChapterOpen，不在的保持锁）；
//   p_dare_boss = {boss_id, servant_type, skin_id, status(0锁/1可挑/2可领首通/3已领), is_new}。
// · 元气（spirit）：每誓灵独立，上限 100（DARE_SPIRIT_MAX）、每 3 分钟回 1（DARE_SPRITE_REGAIN），
//   m_servant_pl_info_toc{list:[p_kvi{id:誓灵id, val:元气}]}。
// · 官方错误码（CfgErrorCode 685/1721/1723 段）：685001 要先开启对应章节 / 685002 誓灵元气值不足 /
//   685003 boss还没达到开启条件 / 1721001 要先通关对应的关卡 / 1721002 奖励已领取过了 /
//   1721003 这一关没有配置通关奖励 / 1723001 没有可领取的奖励。
// · CfgCopyDetail 的 dare 条目没有敌阵 → 敌阵按曜日模式服务端生成（data/dare_data.js DARE_MAP_CONFIGS）。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log } = L;
const D = require('../data/dare_data');
const MF = require('./map_fight');
const { buildFormation } = require('./servant');

const ERR_CHAPTER = 685001;   // 要先开启对应章节
const ERR_SPIRIT = 685002;    // 誓灵元气值不足
const ERR_BOSS_COND = 685003; // boss还没达到开启条件
const ERR_NOT_CLEAR = 1721001;// 要先通关对应的关卡
const ERR_CLAIMED = 1721002;  // 奖励已领取过了
const ERR_NO_REWARD = 1721003;// 这一关没有配置通关奖励
const ERR_WEEK_EMPTY = 1723001; // 没有可领取的奖励

const SPIRIT_MAX = 100;       // CopyConst.DARE_SPIRIT_MAX
const SPIRIT_REGAIN = 1;      // CopyConst.DARE_SPRITE_REGAIN（每 3 分钟）
const SPIRIT_PERIOD = 180;
const FUNC_ID_DARE = 10;      // GuideConst.FUNC_ID_AFFINITY

const nowSec = () => Math.floor(Date.now() / 1000);
const weekKey = () => {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // 周一=0
  d.setDate(d.getDate() - day);
  return d.toLocaleDateString('sv'); // 本周一日期
};

function st() {
  if (!S.dareState) S.dareState = {};
  const s = S.dareState;
  if (!s.weekKey) s.weekKey = weekKey();
  if (!Array.isArray(s.defeated)) s.defeated = [];   // 已战胜 bossID
  if (!Array.isArray(s.claimedFirst)) s.claimedFirst = []; // 已领首通 bossID
  if (!s.claimedTiers) s.claimedTiers = {};          // {chapter: [已领 bossKill 档]}
  if (!Array.isArray(s.gotItems)) s.gotItems = [];   // 本周已领的每周奖励 [{id, val}]
  if (!s.spirit) s.spirit = {};                      // {誓灵id: {val, at}}
  if (s.weekKey !== weekKey()) {                     // 每周一重置每周奖励
    s.weekKey = weekKey();
    s.claimedTiers = {};
    s.gotItems = [];
    log(`[dare] 每周奖励重置（${s.weekKey}）`);
  }
  return s;
}

const isFuncOpen = () => L.buildOpenFunctions().includes(FUNC_ID_DARE);
const bossOf = bid => D.BOSS_LIST[bid];
const chapterOf = bid => D.CHAPTER_OF[bid];

// 章节解锁：ch0/ch1 = 功能开启；ch N>1 = 前一章 BOSS 全部战胜（lockTip"挑战LvX成功后解锁"）
function chapterUnlocked(chapter) {
  if (!isFuncOpen()) return false;
  if (chapter <= 1) return true;
  const prev = D.CHAPTERS.find(c => c.chapter === chapter - 1);
  return prev.bossArr.every(b => st().defeated.includes(b));
}

// 章内已战胜数（含状态非 OPEN 的）
function killedIn(chapter) {
  const ch = D.CHAPTERS.find(c => c.chapter === chapter);
  return ch.bossArr.filter(b => st().defeated.includes(b)).length;
}

// p_dare_boss.status
function statusOf(bossID) {
  const ch = chapterOf(bossID);
  if (!chapterUnlocked(ch)) return D.STATUS_LOCK;
  const s = st();
  if (s.claimedFirst.includes(bossID)) return D.STATUS_FINISH;
  if (s.defeated.includes(bossID)) return D.STATUS_REWARD;
  return D.STATUS_OPEN;
}

// ---- 元气（每誓灵）----
function spiritOf(servantId) {
  const s = st();
  const rec = s.spirit[servantId];
  if (!rec) return SPIRIT_MAX;
  const regained = Math.floor((nowSec() - rec.at) / SPIRIT_PERIOD) * SPIRIT_REGAIN;
  return Math.min(SPIRIT_MAX, rec.val + regained);
}
function consumeSpirit(servantId, cost) {
  const s = st();
  const cur = spiritOf(servantId);
  if (cur < cost) return false;
  s.spirit[servantId] = { val: cur - cost, at: nowSec() };
  return true;
}
function pushPlInfo(conn) {
  const list = S.servants.map(b => ({ id: b.id, val: spiritOf(b.id) }));
  conn.sendToc('m_servant_pl_info_toc', { list });
}

// ---- 每周奖励 ----
// 各章当前可领档（最高未领且 bossKill <= 战胜数）
function claimableTiers() {
  const s = st();
  const out = [];
  for (let ch = 1; ch <= 8; ch++) {
    const tiers = (D.WEEK_REWARD[ch] || []).slice().sort((a, b) => a.bossKill - b.bossKill);
    const killed = killedIn(ch);
    const claimed = s.claimedTiers[ch] || [];
    const tier = tiers.filter(t => t.bossKill <= killed && !claimed.includes(t.bossKill)).pop();
    if (tier) out.push({ chapter: ch, tier });
  }
  return out;
}

function handleInfo(conn) {
  st();
  const chapterList = D.CHAPTERS.filter(c => chapterUnlocked(c.chapter)).map(c => ({
    chapter_id: c.chapter,
    boss_list: c.bossArr.map(bid => {
      const b = bossOf(bid);
      return {
        boss_id: bid,
        servant_type: b.servantType,
        skin_id: b.skinID,
        status: statusOf(bid),
        is_new: 0,
      };
    }),
  }));
  const store = claimableTiers().flatMap(t => t.tier.reward.map(([id, val]) => ({ id, val })));
  conn.sendToc('m_dare_info_toc', {
    chapter_list: chapterList,
    store_rewards: store,
    got_rewards: st().gotItems,
  });
  log(`[dare] 信息下发：开放章 [${chapterList.map(c => c.chapter_id).join(',')}]，`
    + `已战胜 ${st().defeated.length}/40，每周可领 ${store.length} 项`);
}

// 首通奖励
function handlePassReward(conn, obj) {
  const chapterId = Number(obj && obj.chapter_id) || 0;
  const bossId = Number(obj && obj.boss_id) || 0;
  const b = bossOf(bossId);
  const err = (code, why) => { conn.sendToc('m_common_error_toc', { code }); log(`[dare] 首通拒绝（${code}）：${why}`); };
  if (!b || chapterOf(bossId) !== chapterId) return err(ERR_NO_REWARD, 'boss 不存在');
  if (!st().defeated.includes(bossId)) return err(ERR_NOT_CLEAR, '尚未通关');
  if (st().claimedFirst.includes(bossId)) return err(ERR_CLAIMED, '已领取');
  if (!b.reward.length) return err(ERR_NO_REWARD, '无首通配置');
  const rewards = b.reward.map(([id, val]) => ({ id, val }));
  // 发奖：货币/道具形态积分/材料分流（与任务奖励同口径）。
  // conn 必须透传给 grantGoods：首通表 BOSS_LIST 多个称号盒（3004→25001991、7003→25001290、
  // 99007/99008/99010/99012/99013 等），漏传 = 称号入册但客户端收不到 m_role_title_update_toc，
  // 重登才可见（二百七十七同族）。
  for (const [typeId, num] of b.reward) {
    if (typeId === 30000003) S.roleAsset.silver += num;
    else if (typeId === 30000000) { S.roleAsset.gold += num; S.roleAsset.gold_given += num; }
    else if (L.grantScoreItem(conn, typeId, num)) { /* 道具形态积分（31000016/18/20…）落 role_scores */ }
    else L.grantGoods(typeId, num, conn);
  }
  // 只有所有奖励发放成功后才写入领取标记，避免异常时奖励永久丢失。
  st().claimedFirst.push(bossId);
  L.pushAssetChange(conn);
  const changed = [];
  for (const [typeId, num] of b.reward) {
    if (typeId !== 30000003 && typeId !== 30000000 && !L.scoreIdOfItem(typeId)) {
      const g = S.bagGoods.find(x => x.type_id === typeId);
      if (g) changed.push(g);
    }
  }
  if (changed.length) L.pushGoodsUpdate(conn, changed, 3);
  saveState();
  conn.sendToc('m_dare_pass_reward_toc', { rewards });
  handleInfo(conn); // 客户端 toc handler 只做重新拉取（CopyModule.m_dare_pass_reward_toc → m_dare_info_tos）
  log(`[dare] 首通 ${bossId}「${b.title}」→ ${b.reward.map(([i, n]) => `${i}x${n}`).join(' ')}`);
}

// 每周奖励（一次领全部已达档）
function handleStoreReward(conn) {
  const s = st();
  const tiers = claimableTiers();
  if (!tiers.length) {
    conn.sendToc('m_common_error_toc', { code: ERR_WEEK_EMPTY });
    log('[dare] 每周奖励拒绝（1723001）：没有可领取的档位');
    return;
  }
  const granted = [];
  for (const { chapter, tier } of tiers) {
    for (const [id, val] of tier.reward) {
      granted.push([id, val]);
    }
  }
  const changed = [];
  for (const [typeId, num] of granted) {
    if (typeId === 30000003) S.roleAsset.silver += num;
    else if (typeId === 30000000) { S.roleAsset.gold += num; S.roleAsset.gold_given += num; }
    else if (L.grantScoreItem(conn, typeId, num)) { /* 道具形态积分落 role_scores（与首通同口径） */ }
    else changed.push(...L.grantGoods(typeId, num, conn)); // conn 透传：每周奖励同吃称号盒/代币宣告链
  }
  // 奖励全部成功后再落领取档位与奖励历史，保持发奖和状态更新的事务顺序。
  for (const { chapter, tier } of tiers) {
    s.claimedTiers[chapter] = (s.claimedTiers[chapter] || []).concat(tier.bossKill);
    for (const [id, val] of tier.reward) s.gotItems.push({ id, val });
  }
  L.pushAssetChange(conn);
  if (changed.length) L.pushGoodsUpdate(conn, changed, 3);
  saveState();
  conn.sendToc('m_dare_store_reward_toc', { rewards: granted.map(([id, val]) => ({ id, val })) });
  handleInfo(conn); // changeDareInfo 只更新已领列表，补一次全量刷新状态
  require('./achievement').pushUpdates(conn); // 29000+ 唤灵殿堂成就进度
  log(`[dare] 每周奖励领取 ${granted.length} 项：${granted.map(([i, n]) => `${i}x${n}`).join(' ')}`);
}

// 新 BOSS 已读（无 toc schema，静默记账）
function handleReadNew(conn, obj) {
  const bossId = Number(obj && obj.boss_id) || 0;
  log(`[dare] read_new boss=${bossId}`);
  // 无同名 toc，客户端不消费 ⇒ 回通用应答（D2 / 二百二十二：空壳 handler 不许静默）
  conn.sendToc('m_common_reply_toc', { proto_id: 0 });
}

// ---- 战斗接入 ----
const dareTeamId = () => (S.dareState && S.dareState.lastTeam) || (S.mapState && S.mapState.lastId) || 1;

// m_copy_fight_prepare_tos：dare copyID 用 dare 编队；其余回落 map_fight（主线/曜日）
function handlePrepare(conn, obj) {
  const copyId = Number(obj && obj.copy_id) || 0;
  if (!D.DARE_MAP_CONFIGS[copyId]) return MF.handlers.m_copy_fight_prepare_tos(conn, obj);
  const teamId = dareTeamId();
  const team = S.formations[teamId] || S.formations[(S.mapState && S.mapState.lastId) || 1];
  conn.sendToc('m_copy_fight_prepare_toc', {
    copy_id: copyId,
    team: [buildFormation(teamId, team)],
    last_id: teamId,
  });
  log(`[dare] prepare copy=${copyId}（编队 ${teamId}）`);
}

// m_copy_fight_tos：dare copyID 校验 + 扣元气 + 委托 map_fight；其余回落 daily_copy 链
function handleFight(conn, obj) {
  const copyId = Number(obj && obj.copy_id) || 0;
  const mapCfg = D.DARE_MAP_CONFIGS[copyId];
  if (!mapCfg) return require('./daily_copy').handlers.m_copy_fight_tos(conn, obj);
  const flag = mapCfg.dareCopy;
  const err = (code, why) => { conn.sendToc('m_common_error_toc', { code }); log(`[dare] 拒绝（${code}）：${why}`); };
  if (!isFuncOpen()) return err(ERR_CHAPTER, '唤灵殿堂未解锁（需通关 3-1）');
  if (!chapterUnlocked(flag.chapter)) return err(ERR_CHAPTER, '章节未解锁');
  const b = bossOf(flag.bossID);
  const teamId = dareTeamId();
  const team = S.formations[teamId] || S.formations[(S.mapState && S.mapState.lastId) || 1];
  const members = [
    ...((team && team.field) || []),
    ...((team && team.bench) || []),
  ].filter(id => Number(id) > 0);
  if (!members.length) return err(ERR_BOSS_COND, '编队为空');
  // 元气校验+扣减（客户端编队面板有前置拦截，服务端兜底）
  for (const sid of members) {
    if (spiritOf(Number(sid)) < b.spirit) return err(ERR_SPIRIT, `誓灵 ${sid} 元气不足（需 ${b.spirit}）`);
  }
  for (const sid of members) consumeSpirit(Number(sid), b.spirit);
  // 战斗上下文：无小地图，手工把 mapState 指到合成关卡（同曜日）
  const lastId = (S.mapState && S.mapState.lastId) || 1;
  S.mapState = { barrierId: copyId, lastId: teamId, pos: 0, fighting: 0, zone: 0, defeated: [], use_team_ids: [teamId] };
  saveState();
  pushPlInfo(conn);
  log(`[dare] 挑战 ${flag.name}（${copyId}，lv${flag.level}）：${members.length} 人 × 元气${b.spirit}`
    + (statusOf(flag.bossID) === D.STATUS_FINISH ? '（重复挑战无奖励）' : ''));
  MF.handlers.m_copy_fight_tos(conn, obj);
}

// m_team_template_copy_team_tos{from,to}：把选中编队复制到目标槽（唤灵殿堂编队保存路径），
// 记住目标槽为 dare 编队。原实现未处理（兜底空回会让客户端拿不到 update）
function handleCopyTeam(conn, obj) {
  const from = Number(obj && obj.from) || 0;
  const to = Number(obj && obj.to) || 0;
  const src = S.formations[from];
  if (src) {
    S.formations[to] = JSON.parse(JSON.stringify(src));
  }
  st().lastTeam = to || st().lastTeam;
  saveState();
  conn.sendToc('m_team_template_copy_team_toc', {
    update: [buildFormation(to, S.formations[to])],
  });
  log(`[dare] 编队复制 ${from} → ${to}（dare 编队 = ${to}）`);
}

// ---- 结算（map_fight.onBattleWon 认 cfg.dareCopy 后回调）----
function settleRewards(conn, copyId, fightSt) {
  const flag = D.DARE_MAP_CONFIGS[copyId] && D.DARE_MAP_CONFIGS[copyId].dareCopy;
  if (!flag) return { rewards: [], silver: 0 };
  const s = st();
  if (!s.defeated.includes(flag.bossID)) s.defeated.push(flag.bossID);
  // 28xxx：对单个 BOSS 的累计伤害（槽位 = 按 copyID 排序的 BOSS 序号）
  const order = Object.keys(D.BOSS_LIST).map(Number).sort((a, b) => D.BOSS_LIST[a].copyID - D.BOSS_LIST[b].copyID);
  const slot = order.indexOf(flag.bossID);
  if (slot >= 0) require('./achievement').addDareDamage(slot, Number(fightSt && fightSt.dmgDealt) || 0);
  saveState();
  pushPlInfo(conn);
  log(`[dare] 通关 ${flag.name}（${copyId}）：累计伤害 ${Number(fightSt && fightSt.dmgDealt) || 0}，`
    + `状态 → ${s.claimedFirst.includes(flag.bossID) ? 'FINISH' : 'REWARD(首通可领)'}`);
  return { rewards: [], silver: 0 }; // 奖励走首通/每周两条领取链，结算面板不掉落
}

module.exports = {
  st, isFuncOpen, chapterUnlocked, statusOf, settleRewards, spiritOf, pushPlInfo,
  handlers: {
    m_dare_info_tos: handleInfo,
    m_dare_pass_reward_tos: handlePassReward,
    m_dare_store_reward_tos: handleStoreReward,
    m_dare_read_new_tos: handleReadNew,
    m_servant_pl_info_tos: conn => { st(); pushPlInfo(conn); },
    m_team_template_copy_team_tos: handleCopyTeam,
    m_copy_fight_prepare_tos: handlePrepare,
    m_copy_fight_tos: handleFight,
  },
};
