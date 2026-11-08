// 无尽冒险（Tower/无限领域；副本页签 TowerBanner，功能 ID 8 = FUNC_ID_TOWER，通关 2-4 开启）。
//
// ── 客户端事实（tools/bc_cmp/tower_* 反编译实证 + wiki 数值锚定）──
// · 战斗 copy_id = 8000000 + 层数（TowerInfoVO.gotoFight；getCopyType=indexNum(id,7,10)=8=TYPE_TOWER），
//   标准链 m_copy_fight_prepare_tos → m_tower_prepare_toc{field,bench} → m_tower_fight_tos →
//   m_tower_fight_toc{fight_id} → m_fight_servant_start_tos（同主线引擎）。
// · 队伍 = **12 个独立誓灵槽**（TEAM_NUM=6 主力 + 6 替补，SlotVo p_tower_servant{id:槽,servant_id,
//   owner_id,type,skin_id,hp,max_hp,level}），**HP 跨层冻结**直到 reset（回恢复点重编队）；
//   选择走 m_tower_select_tos{servants:[p_kvlt{id:槽,val:誓灵id,type:主人id}], op_type:1保存/0取消}。
// · 恢复：每胜利 10 关 +1 次存量（上限 3），m_tower_recover_tos 恢复全队状态（HP/PP 拉满）；
//   m_tower_reset_tos 重置回最后一个恢复点并清空编队。
// · 奖励：每周每关首次胜利扣 10 体力得结晶（客户端 46xxx 成就友情点无关）；里程碑 50/150/250/350/500
//   （CfgTower.towerRewardArr 原样）；m_tower_box_reward_tos{id:里程碑层} → toc{id} 后客户端置已领。
// · 排名：m_tower_rank_info_tos{rank_id 1本周/2上周/3历史} → toc{rank_id, all_rows, my_rows, time}
//   （本地服无其他玩家 → 只列自己）。
// · 自动战斗：m_tower_begin_auto_tos{recover} → 每 30 秒一场直到失败/体力不足/取消；
//   m_tower_auto_status_toc{barrier, fight_time, is_auto, has_fail_log}（服务端主动推）。
// · CfgCopy/CfgCopyDetail 里没有任何 800xxxx 条目（客户端不查表）→ 敌阵/奖励全服务端生成。
// · 官方错误码（CfgErrorCode 613/615/625/627/635 段）：见 data/tower_data.js。
'use strict';
const { S, saveState } = require('../state');
const CH = require('../data/chaos_data');
const L = require('../lib');
const { log, pushGoodsUpdate, pushAssetChange } = L;
const T = require('../data/tower_data');
const MF = require('./map_fight');
const FC = T.FC;
const { buildFormation } = require('./servant');

const FUNC_ID_TOWER = 8;      // GuideConst.FUNC_ID_TOWER
const ERR = {
  COND: 455001,          // 条件不足（通用兜底）
  LEVEL: 19,             // 等级不足
  VIT: 262006,           // 体力不足
  TIMES: 262014,         // 次数不足
};
const nowSec = () => Math.floor(Date.now() / 1000);
const weekKey = () => {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // 周一=0
  d.setDate(d.getDate() - day);
  return d.toLocaleDateString('sv');
};

function st() {
  if (!S.towerState) S.towerState = {};
  const s = S.towerState;
  let weekRolled = false;
  // 首次建档只补 weekKey 占位，**不 roll 词条**（交给下面的长度校验决定）：
  // 否则 offline 冒烟/首启时刚设好的 buffs 会被这里静默换掉。
  if (!s.weekKey) s.weekKey = weekKey();
  if (!s.claimed) s.claimed = {};        // {层: 1} 本周已首胜（结晶已发）
  if (!s.milestones) s.milestones = [];  // 已领里程碑层
  if (!s.floorRecords) s.floorRecords = {}; // {层: 录像id}（该层最近一场胜利，回放/战果用）
  if (s.weekKey !== weekKey()) {         // 每周一重置：周进度/首胜/里程碑
    s.weekKey = weekKey();
    s.weekMax = 0;
    s.claimed = {};
    s.milestones = [];
    s.recoverUsed = 0;
    s.team = null;                       // 编队一并失效（官方每周重置回第 1 关）
    s.barrier = 1;
    weekRolled = true;                   // 词条每周重roll（官方：每周一组限定 buff）
    log(`[tower] 每周重置（${s.weekKey}）`);
  }
  // ⚠️ 词条重 roll 只在**真发生周重置**（或本档词条数量非法）时做，且一次调用至多一次。
  // 原实现把「长度不对就重 roll」写在周重置之前、周重置分支里再 roll 一次——两次都可能在
  // 玩家已看过面板（buffToc）之后、进战斗（activeEffects）之前把 s.buffs 换掉，
  // 表现为"面板写生效、实战没吃到"或反过来（2026-11-05 无限领域词条排查实测命中）。
  // 现在：面板与实战都从同一份 s.buffs 派生，roll 只在周切换时发生。
  if (weekRolled || !Array.isArray(s.buffs) || s.buffs.length !== T.BUFF_NUM) {
    s.buffs = T.rollBuffs();
  }
  return s;
}

// 重roll 本周词条；或读取（不足 3 条 / 非法 id 时自动补齐）
function rollBuffs() {
  const s = st();
  s.buffs = T.rollBuffs();
  saveState();
  return s.buffs;
}

// 队伍成员快照（给 buff 判定用）：towerState.team.slots 1..12
//
// ⚠️ 口径必须与 tower_fight.buildFight **逐字段同源**（2026-11-05 修）：
//   · skills = buildUsingPool(type, using_skills, learned_skills) —— 引擎 mkUnit 的实际技能池
//     （装备 3 槽 + 三百零二的空攻池补已学最强攻击技）。用全技能书会把"携带 X 系技能 N 个"
//     判成几乎恒真，导致面板显示已激活而实战没吃到 bff。
//   · attrs  = CH.normalAttrsOf(b, extra) —— 含核心/圣器/信仰。用裸 calcAttrs 会让
//     condition 17~20（物攻>900 / 魔防>800）在带装备的誓灵上判反。
//   · slot   = 槽位号 1..12（servant_ids 的协议语义，见 tower_data.evalBuff）
// 一处口径改动必须两边同改；smoke_tower §11.6 有对拍断言（buffToc 与 buildFight 结论一致）。
function teamMembers() {
  const t = teamOf();
  const out = [];
  if (!t || !t.slots) return out;
  const { equipBonusOf } = require('../data/relic_data');
  const FD = require('../data/faith_data');
  const { usingSkillsOf } = require('./servant');
  for (let slot = 1; slot <= 12; slot++) {
    const sid = Number(t.slots[slot]) || 0;
    if (!sid) continue;
    const b = S.servants.find(x => x.id === sid);
    if (!b) continue;
    // 与 buildFight.mkUnit 完全相同的三件套（装备核心 + 信仰 + 技能池）
    const extra = equipBonusOf(b, S.bagGoods);
    const fb = FD.faithAttrBonusOf(b, S.bagGoods, 0);
    for (const k of Object.keys(fb)) extra[k] = (extra[k] || 0) + fb[k];
    out.push({
      id: b.id, slot, type: b.type, level: b.level, star: Number(b.star) || 2,
      skills: FC.buildUsingPool(b.type, usingSkillsOf(b),
        Array.isArray(b.learned_skills) ? b.learned_skills : null),
      attrs: CH.normalAttrsOf(b, extra),
    });
  }
  return out;
}

// info.buff：**必须恒 3 项**（客户端 TowerMgr.updateTowerBuffVOArr 按下标取 toc.buff[i]，
// 少一项就 updateBuff(nil) → TowerBuffVO:0 attempt to index a nil value）
function buffToc() {
  const members = teamMembers();
  const list = (st().buffs || []).slice(0, T.BUFF_NUM);
  const out = [];
  for (let i = 0; i < T.BUFF_NUM; i++) {
    const b = list[i] || { condition_id: 1, effect_id: 1 };
    const e = T.evalBuff(b.condition_id, members);
    out.push({
      condition_id: Number(b.condition_id) || 1,
      effect_id: Number(b.effect_id) || 1,
      is_active: e.is_active,
      servant_ids: e.servant_ids,
    });
  }
  return out;
}

// 当前激活（队伍满足条件）的效果 id —— 战斗建单位时据此上 buff
function activeEffects() {
  const members = teamMembers();
  return (st().buffs || []).filter(b => T.evalBuff(b.condition_id, members).is_active)
    .map(b => Number(b.effect_id)).filter(id => id > 0);
}

const isFuncOpen = () => L.buildOpenFunctions().includes(FUNC_ID_TOWER);

// 暂存奖励库（自动战斗的结晶先攒这里，战报面板点"领取"走 m_tower_get_store_items_tos 一次发放）
function storeAdd(s, typeId, num) {
  if (!Array.isArray(s.autoStore)) s.autoStore = [];
  const hit = s.autoStore.find(x => Number(x.id) === Number(typeId));
  if (hit) hit.val = Number(hit.val) + Number(num);
  else s.autoStore.push({ id: Number(typeId), val: Number(num) });
}

// 编队：{slots: {1..12: servantId}, savedHp: {servantId: {hp, skillsState}}, fromBarrier}
function teamOf() { return st().team; }

function pushInfo(conn, extra) {
  const s = st();
  const t = teamOf();
  const floor = Number(extra && extra.barrier) || Number(s.barrier) || 1;
  // 12 槽 p_tower_servant（HP 用冻结值）
  const servants = [];
  for (let slot = 1; slot <= 12; slot++) {
    const sid = t && t.slots ? t.slots[slot] : 0;
    if (!sid) continue;
    const b = S.servants.find(x => x.id === Number(sid));
    if (!b) continue;
    const saved = t.savedHp && t.savedHp[sid];
    const extra = require('../data/relic_data').equipBonusOf(b, S.bagGoods);
    const faith = require('../data/faith_data').faithAttrBonusOf(b, S.bagGoods, 0);
    for (const k of Object.keys(faith)) extra[k] = (extra[k] || 0) + faith[k];
    const maxHp = CH.normalAttrsOf(b, extra).hp;
    servants.push({
      id: slot,
      servant_id: b.id,
      owner_id: L.roleId,
      type: b.type,
      skin_id: b.skin_id,
      hp: saved ? Math.max(0, Math.min(saved.hp, maxHp)) : maxHp,
      max_hp: maxHp,
      level: b.level,
    });
  }
  const milestoneItems = [];
  for (const m of T.MILESTONES) {
    if (s.weekMax >= m.barrier) {
      for (const [id, num] of m.rewards) milestoneItems.push({ id, val: num });
    }
  }
  const preview = T.crystalPreviewOf(floor);
  const buffArr = buffToc();
  conn.sendToc('m_tower_info_toc', Object.assign({
    servants,
    barrier: floor,
    history_max: Number(s.historyMax) || 0,
    week_max: Number(s.weekMax) || 0,
    buff: buffArr,              // 固定 3 项（缺项会让客户端 TowerBuffVO 索引 nil 崩）
    recover_used: Number(s.recoverUsed) || 0,
    recover_max: T.RECOVER_MAX,
    rewards: [],
    monster: T.bossSkinOf(floor),
    rank: 1,
    rank_type: 1,
    op_type: extra && extra.op_type ? extra.op_type : 1,
    from: Number(extra && extra.from) || 1,
    to: Number(extra && extra.to) || Math.max(10, floor + 9),
    helper_id: 0,
    // 协议虽声明 array p_kvi，但客户端 TowerInfoVO.fillData 直取 slot1.item.id / .val
    // （TowerAttackView.onGUI 拿它喂 ItemConfig.getItemByPos({id,num})）——
    // 官方按**单个 p_kvi 结构体**发送；发数组会让 id=nil → "ID="..nil 崩溃
    item: { id: preview.id, val: preview.num },
    is_ready: t ? 1 : 0,
  }, extra && extra.raw ? extra.raw : {}));
  const act = activeEffects();
  log(`[tower] info：当前 ${floor} 关（周 ${s.weekMax || 0}/史 ${s.historyMax || 0}），`
    + `编队 ${servants.length}/12，恢复 ${s.recoverUsed || 0}/${T.RECOVER_MAX}，`
    + `词条 ${buffArr.map(b => `${b.condition_id}→${b.effect_id}${b.is_active ? '✓' : '×'}`).join(' ')}`
    + `${act.length ? `（生效 [${act.join(' ')}]）` : '（未生效）'}`);
}

// ---- 编队选择：m_tower_select_tos{servants:[p_kvlt], op_type} ----
function handleSelect(conn, obj) {
  const s = st();
  if (!isFuncOpen()) { conn.sendToc('m_common_error_toc', { code: ERR.COND }); return; }
  const list = (obj && obj.servants) || [];
  const opType = Number(obj && obj.op_type) || 0;
  if (opType === 1) {
    // 保存编队：slots 重置（换编队即刷新队伍状态——HP 冻结解除，官方语义"重新编辑队伍时才更新誓灵状态"）
    const slots = {};
    for (const e of list) {
      const slot = Number(e.id) || 0;
      const sid = Number(e.val) || 0;
      if (slot >= 1 && slot <= 12 && sid > 0 && S.servants.some(x => x.id === sid)) slots[slot] = sid;
    }
    s.team = { slots, savedHp: {}, fromBarrier: Number(s.barrier) || 1 };
    // 换队伍同步重roll 词条（服务端设计：词条跟随本周+当前队伍，避免抽到永远达不到的条件时无解）
    s.buffs = T.rollBuffs();
    saveState();
    const eff = activeEffects();
    log(`[tower] 保存编队 ${Object.keys(slots).length}/12；词条重roll`
      + ` [${s.buffs.map(b => `${b.condition_id}→${b.effect_id}`).join(' ')}]，已激活效果 [${eff.join(' ')}]`);
  }
  // toc 原样回显（客户端 handler 为空函数，状态靠 info 刷新）
  conn.sendToc('m_tower_select_toc', { servants: list, op_type: opType });
  pushInfo(conn, { op_type: 2 });
}

// ---- prepare：回双方阵容预览（field/bench p_servant_battle_brief 是**敌方**）
function handlePrepare(conn) {
  const s = st();
  const floor = Number(s.barrier) || 1;
  const wave = T.makeWave(floor);
  const brief = e => ({
    id: 8000000 + floor,
    type: e.type,
    star: 4,
    name: '',
    level: e.level,
    skin_id: e.type * 100 + 1,
  });
  conn.sendToc('m_tower_prepare_toc', {
    field: wave.slice(0, 6).map(brief),
    bench: wave.slice(6).map(brief),
  });
  log(`[tower] prepare 第${floor}关：敌 ${wave.length} 只（lv${wave[0].level}${wave[0].boss ? ' BOSS' : ''}）`);
}

// ---- 出战：m_tower_fight_tos → {fight_id} → 建塔战会话（引擎见 tower_fight.js）----
function handleFight(conn) {
  const s = st();
  if (!isFuncOpen()) { conn.sendToc('m_common_error_toc', { code: ERR.COND }); return; }
  const floor = Number(s.barrier) || 1;
  const t = teamOf();
  if (!t || !Object.keys(t.slots || {}).length) { conn.sendToc('m_common_error_toc', { code: ERR.COND }); return; }
  // 本周已首胜的关卡不扣体力（官方规则 3）
  const firstWeekly = !s.claimed[floor];
  if (firstWeekly) {
    // 塔不按编队 costVit 扣（编队口径走 formation 1~N 主线槽，塔的 12 槽不在其中）：
    // 固定 10 体力（CfgTower.vitCost），不足 262006
    const VIT = require('./vit');
    if (VIT.getVit() < T.VIT_COST) {
      conn.sendToc('m_common_error_toc', { code: ERR.VIT });
      log(`[tower] 出击被拒：体力不足（需 ${T.VIT_COST}，有 ${VIT.getVit()}）`);
      return;
    }
    VIT.addVit(conn, -T.VIT_COST);
  }
  const TF = require('./tower_fight');
  const fightId = S.nextFightId++;
  TF.buildFight(fightId, floor);
  S.towerFight.ownerConn = conn;
  S.fightState = null; // 塔战独立状态，避免主线残留态串味
  conn.sendToc('m_tower_fight_toc', { fight_id: fightId });
  saveState();
  log(`[tower] 出战第${floor}关（fight=${fightId}，${firstWeekly ? '本周首胜扣 10 体力' : '已首胜不扣'}）`);
}

// ---- m_copy_fight_prepare_tos：塔 copyID（800xxxx）回塔编队（TowerInfoVO.gotoFight 直发它）；
// 非塔 copyID 回落 dare（→daily_copy 链）----
function handlePrepareCopy(conn, obj) {
  const copyId = Number(obj && obj.copy_id) || 0;
  if (!T.isTowerCopy(copyId)) return require('./dare').handlers.m_copy_fight_prepare_tos(conn, obj);
  const s = st();
  const floor = Number(s.barrier) || 1;
  const t = teamOf();
  conn.sendToc('m_copy_fight_prepare_toc', {
    copy_id: copyId,
    team: [buildFormation((S.towerState && S.towerState.lastTeam) || (S.mapState && S.mapState.lastId) || 1, S.formations[(S.towerState && S.towerState.lastTeam) || 1])],
    last_id: (S.towerState && S.towerState.lastTeam) || 1,
  });
  void t; void floor;
  log(`[tower] prepare(copy_id) copy=${copyId} → 塔编队布阵面板`);
}

// ---- 会话拦截（客户端 start_tos/select_tos 直发；非塔会话回落 dream → map_fight）----
// ⚠️ 三百：本模块在 dream **之后**装配，start/select 的在册 handler 是这里的——
// 回落必须先进 dream（S.dreamFight 在时由幻梦接住，非幻梦 dream 再回落 map_fight），
// 直接回落 map_fight 会把幻梦战的 start/select 整条吞掉（1013 修好入口后真机首验即中：
// start 落 map_fight 闸门被拒 current=0 → 客户端"点挑战没反应"）。smoke_dream 直调
// DM.handlers 绕过装配链测不出这类吞并，装配链回归见 smoke_dream §13。
function handleStart(conn, obj) {
  const f = S.towerFight;
  const fightId = Number(obj && obj.fight_id) || 0;
  if (!f || (fightId && f.fightId !== fightId)) return require('./dream').handlers.m_fight_servant_start_tos(conn, obj);
  // 二百八十八：切后台重连后旧 owner 连接已关闭 → 新连接接管（同 map_fight select/start 接管）
  if (f.ownerConn && f.ownerConn !== conn && !MF.fightOwnerStale(f)) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
  f.ownerConn = conn;
  f.round = 1;
  f.over = 0;
  conn.sendToc('m_fight_servant_start_toc', { fight_id: f.fightId, side: 0, batch: 1, batch_num: 1 });
  // 三百一十三·续：入场天赋/天气/圣器共享随首包 effect_list 下发（客户端 onBatchEnd 的
  // TRIGGER_TIME_BORN 播放点=开局第一时间）。**顺序纪律**：先建进场包（入场前状态），再结算入场。
  const towerEnters = f.allies.concat(f.enemies).map(TF().unitToc);
  const towerStartFx = FC.settleBattleStartTalents(f.allies.concat(f.enemies), f);
  TF().pushRound(conn, f, [], towerEnters, towerStartFx);
}
function handleFightSelect(conn2, obj) {
  const f = S.towerFight;
  const fightId = Number(obj && obj.fight_id) || 0;
  if (!f || (fightId && f.fightId !== fightId)) return require('./dream').handlers.m_fight_skill_select_tos(conn2, obj);
  if (f.ownerConn && f.ownerConn !== conn2 && !MF.fightOwnerStale(f)) { conn2.sendToc('m_fight_skill_select_toc', { err_code: 1 }); return; }
  f.ownerConn = conn2;
  conn2.sendToc('m_fight_skill_select_toc', { err_code: 0 });
  if (f.over) { log(`[tower] 忽略重复 select（over=${f.over}）`); return; }
  f.round += 1;
  if (f.round > 30) { // 30 回合兜底判负（同主线）
    f.over = 1;
    TF().pushRound(conn2, f, [], []);
    onLoseWrapper(conn2, f, '超过 30 回合未分出胜负');
    return;
  }
  // select_list[].id 是客户端回传的战斗 id（bid）→ 反查回引擎内部 id（一百八十八 方案 A'）
  const selMap = {};
  const allUnits = f.allies.concat(f.allyBench || [], f.enemies);
  ((obj && obj.select_list) || []).forEach(x => {
    if (!x || !x.id || !(Number(x.val) > 0)) return;
    const u = allUnits.find(u => u && ((u.bid != null ? u.bid : u.id) === Number(x.id) || u.id === Number(x.id)));
    if (u) selMap[u.id] = { skillId: Number(x.val), targetPos: Number(x.type) || 0 };
  });
  const fightList = TF().resolveRound(f, selMap);
  const enters = TF().reinforce(f);
  pushRoundLog(f, fightList);
  TF().pushRound(conn2, f, fightList, enters);
  TF().checkEnd(conn2, f);
}
const TF = () => require('./tower_fight');
function pushRoundLog(f, fightList) {
  log(`[tower] 第${f.floor}关 回合${f.round} 动作 ${fightList.length} 条；敌方 [${f.enemies.map(e => e.hp).join(',')}] 我方 [${f.allies.map(a => a.hp).join(',')}]`);
}
function onLoseWrapper(conn2, f, reason) {
  // 超回合判负（等价 onLose 路径，避免环形 require tower_fight 的导出面）
  // 直接调 onLose 等价路径
  const s = S.towerState;
  const t = s && s.team;
  s.barrier = (t && t.fromBarrier) || 1;
  s.team = null;
  saveState();
  // 战败也要发 LOSE 结算包（2026-10-01，与 tower_fight.onLose 同款）：
  // 客户端 RESULT_LOSE 无条件开 CopyRewardPanel，缺包 → RoleBuffView resultVO nil 崩
  conn2.sendToc('m_fight_result_toc', {
    fight_id: f.fightId, copy_id: f.copyId, result: 0,
    mvp: 0, star: [], gold: 0, silver: 0, role_exp: 0,
    servant_reward: [], item_reward: [], servant_exp: [],
    kill_num: (f.enemies || []).length, mvp_stats: [], score: 0, add_score: 0, replace_list: [],
  });
  conn2.sendToc('m_fight_scene_result_toc', { fight_id: f.fightId, result: 0 });
  pushInfo(conn2);
  log(`[tower] 第${f.floor}关战败（${reason}）→ 回恢复点 ${s.barrier}，编队已清空`);
  S.towerFight = null;
  saveState();
}

// ---- 胜利结算（map_fight.onBattleWon tower 分支回调）----
// 返回结算奖励（p_reward[]）；HP 冻结写回 + 恢复次数 + 里程碑记账都在这里
// opts.toStore = 自动战斗：结晶不直接入包，进暂存库（战报面板"领取"统一发放，官方 get_store_items 语义）
function settleWin(conn, floor, fightSt, opts) {
  const s = st();
  const firstWeekly = !s.claimed[floor];
  const rewards = [];
  if (firstWeekly) {
    const c = T.crystalRewardOf(floor);
    if (opts && opts.toStore) {
      storeAdd(s, c.id, c.num);
    } else {
      const changed = L.grantGoods(c.id, c.num, conn);
      pushGoodsUpdate(conn, changed, 3);
      rewards.push({ type: c.id, num: c.num });
    }
    // 奖励/暂存成功后再写首胜标记，避免异常中断时出现“已首胜但结晶未到账”。
    s.claimed[floor] = 1;
  }
  // 恢复次数：每胜利 10 关 +1（存量上限 3）
  if (floor % T.RECOVER_EVERY === 0 && (s.recoverUsed || 0) < T.RECOVER_MAX) {
    s.recoverUsed = (s.recoverUsed || 0) + 1;
  }
  // 进度推进
  s.barrier = floor + 1;
  s.weekMax = Math.max(Number(s.weekMax) || 0, floor);
  s.historyMax = Math.max(Number(s.historyMax) || 0, floor);
  // HP/PP 冻结写回（引擎单位的剩余状态）
  const t = teamOf();
  if (t) {
    for (const u of fightSt.allies || []) {
      t.savedHp[u.id] = { hp: u.hp, skillsState: Object.fromEntries(u.skills.map(sk => [sk.id, sk.pp])) };
    }
  }
  saveState();
  require('./achievement').onBattleStats(fightSt, { barrierId: 8000000 + floor });
  require('./achievement').pushUpdates(conn);
  log(`[tower] 第${floor}关胜利：进度 → ${s.barrier}（周 ${s.weekMax}/史 ${s.historyMax}）`
    + `${firstWeekly ? '，结晶已发' : ''}，恢复 ${s.recoverUsed}/${T.RECOVER_MAX}`);
  return { rewards, silver: 0 };
}

// ---- 恢复（m_tower_recover_tos）：恢复次数-1，全队 HP/PP 拉满 ----
function handleRecover(conn) {
  const s = st();
  if ((s.recoverUsed || 0) <= 0) { conn.sendToc('m_common_error_toc', { code: ERR.TIMES }); return; }
  s.recoverUsed -= 1;
  const t = teamOf();
  if (t) t.savedHp = {};
  saveState();
  conn.sendToc('m_tower_recover_toc', { id: 0 });
  pushInfo(conn, { op_type: 1 });
  log(`[tower] 恢复全队状态（余 ${s.recoverUsed}/${T.RECOVER_MAX}）`);
}

// ---- 重置（m_tower_reset_tos）：回最后一个恢复点，清编队等重选 ----
function handleReset(conn) {
  const s = st();
  const t = teamOf();
  const lastCheckpoint = t ? t.fromBarrier : 1;
  s.barrier = lastCheckpoint;
  s.team = null;
  saveState();
  conn.sendToc('m_tower_reset_toc', { id: lastCheckpoint });
  pushInfo(conn, { barrier: lastCheckpoint, from: lastCheckpoint, to: Math.max(10, lastCheckpoint + 9) });
  log(`[tower] 重置回恢复点 ${lastCheckpoint}，编队已清空`);
}

// ---- 里程碑奖励 ----
function handleBoxReward(conn, obj) {
  const id = Number(obj && obj.id) || 0;
  const m = T.MILESTONES.find(x => x.barrier === id);
  const s = st();
  if (!m || (s.weekMax || 0) < id || s.milestones.includes(id)) {
    conn.sendToc('m_common_error_toc', { code: ERR.TIMES });
    log(`[tower] 里程碑拒绝：${id}`);
    return;
  }
  const changed = [];
  for (const [typeId, num] of m.rewards) {
    if (typeId === 30000003) S.roleAsset.silver += num;
    else if (L.grantScoreItem(conn, typeId, num)) { /* 道具形态积分落 role_scores，不入包 */ }
    else changed.push(...L.grantGoods(typeId, num, conn));
  }
  pushAssetChange(conn);
  if (changed.length) pushGoodsUpdate(conn, changed, 3);
  // 奖励处理完成后再写领取标记，避免异常中断时吞掉里程碑奖励。
  s.milestones.push(id);
  saveState();
  conn.sendToc('m_tower_box_reward_toc', { id });
  log(`[tower] 里程碑 ${id} 领取：${m.rewards.map(([i, n]) => `${i}x${n}`).join(' ')}`);
}

// ---- 排名（本地服只有自己）----
function handleRank(conn, obj) {
  const rankId = Number(obj && obj.rank_id) || 1;
  const s = st();
  const row = {
    ranking: 1,
    role_name: S.roleName || '指挥官',
    barrier: rankId === 2 ? Number(s.lastWeekMax) || 0 : (rankId === 3 ? Number(s.historyMax) || 0 : Number(s.weekMax) || 0),
    avatar: [],
  };
  conn.sendToc('m_tower_rank_info_toc', { rank_id: rankId, all_rows: [row], my_rows: [row], time: nowSec() });
}

// ---- 战报（barrier_page / detail）：本地服精简实现 ----
// talent 是**定长 3 项**的 debuff id（DeBuffVO.fillData 按下标取 talent[i]，
// ---- 誓灵详情（m_tower_servant_detail_tos）：塔编队/选人面板右侧的角色卡 ----
//
// 2026-11-05 新增（原为**零实现**：未注册 → fallback 回 defaultFill 的
// `{type:0, servants:[]}`，客户端 `TowerModule.m_tower_servant_detail_toc` 直接
// `TowerMgr.updateCurrChoiceDetail(slot0.servants[#slot0.servants])` ⇒ `servants[0]` = nil
// ⇒ `TowerDetailVO.servantVO` 恒 nil ⇒ `TowerDetailView.onGUI` 首行
// `if servantVO == nil then return end` ⇒ **角色面板整块空白**（玩家截图症状）。
// 历史实证（10-05 日志）：请求 `{"servants":[{"id":90000072,"val":"0"}]}` → 回包仅 16B `{type:0, servants:[]}`。
//
// 协议与消费端（tools/key_lua/Proto_new.lua + lua_src/TowerModule.lua/TowerDetailVO.lua）：
//   tos { type:int, servants:array<p_kv{id:誓灵实例id, val:主人roleId}> }
//   toc { type:int, servants:array<p_tower_servant_detail> }
//   p_tower_servant_detail = { id, owner_id, type, name, feature（**单个 int**）,
//     skin_id, star, overstep, relic, level, skill:array<p_skill>, attr:array<p_attr> }
// 客户端 `fillData_p_detail` 逐个读 star/overstep/relic/level/skin_id/feature/name/
//   skill[].skill_id+power_point/attr（TowerDetailVO.getAttrValue 按 6 维下标取，**单结构体**）。
//
// 三条硬约束（工作指南 C1/C5 + D2）：
//   ① `servants` **绝不能是空数组** —— 客户端取 `[#servants]`，空表等于 `servants[0]`=nil；
//   ② `id` 必须回显请求值（客户端用它对 `getCacheChoiceDetail(roleID, servantID)` 建缓存键）；
//   ③ `attr` 是**单结构体**（不是数组），形状同 `p_attr`。
function servantDetailOf(id) {
  const b = S.servants.find(x => Number(x.id) === Number(id));
  if (!b) return null;
  const { equipBonusOf } = require('../data/relic_data');
  const FD = require('../data/faith_data');
  const { usingSkillsOf } = require('./servant');
  const extra = equipBonusOf(b, S.bagGoods);
  const fb = FD.faithAttrBonusOf(b, S.bagGoods, 0);
  for (const k of Object.keys(fb)) extra[k] = (extra[k] || 0) + fb[k];
  const attrs = CH.normalAttrsOf(b, extra);
  // 圣器 typeId（客户端 ItemConfig.getItemVO(relicTypeID) 取名/描述；0=未携带）
  const relicGid = Number(b.relic_gid) || 0;
  const relicGoods = relicGid ? S.bagGoods.find(g => Number(g.id) === relicGid) : null;
  const relic = relicGoods ? Number(relicGoods.type_id) || 0 : 0;
  // 装备中的 3 槽技能（与战斗技能栏同源：客户端 TowerDetailView 列的就是它）
  const skill = usingSkillsOf(b).map(sid => {
    const cfg = FC.skillCfg(sid) || {};
    const pp = sid > 0 ? (cfg.pp || 30) : 0;
    return { skill_id: Number(sid) || 0, power_point: pp, max_power_point: pp };
  });
  return {
    id: Number(b.id),
    owner_id: 0,                       // 自己：客户端 fillData_p_detail 不用它判归属
    type: Number(b.type),
    name: String(b.name || ''),
    feature: Number(CH.talentOf(b)) || 0,  // 单个 int（不是数组）
    skin_id: Number(b.skin_id) || Number(b.type) * 100 + 1,
    star: Number(b.star) || 2,
    overstep: Number(b.overstep) || 0,
    relic,
    level: Number(b.level) || 1,
    skill,
    attr: {
      hp: attrs.hp, max_hp: attrs.hp,
      phy_atk: attrs.phy_atk, mag_atk: attrs.mag_atk,
      phy_def: attrs.phy_def, mag_def: attrs.mag_def,
      speed: attrs.speed,
      hit_fix: 0, crit_hit_lv: 0, hit_rate_lv: 0, dodge_lv: 0,
    },
  };
}

function handleServantDetail(conn, obj) {
  const list = Array.isArray(obj && obj.servants) ? obj.servants : [];
  const out = [];
  for (const kv of list) {
    const d = servantDetailOf(kv && kv.id);
    if (d) out.push(d);
  }
  // 空列表不回本协议（客户端 `[#servants]` 会拿 nil），改回通用应答打掉 3 秒计时器（D2）
  if (!out.length) {
    log(`[tower] servant_detail 请求无有效誓灵（${list.length} 条）→ 回 common_reply`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  conn.sendToc('m_tower_servant_detail_toc', {
    type: Number(obj && obj.type) || 0,
    servants: out,
  });
}

// 缺项时 configVO=nil，虽说 DeBuffVO 本身容错，配套的详情面板会拿 nil 取字段）
// now = **当前挑战层**（TowerRecordVO.getState：level<now→WIN、level==now→当前、
// level>week_max+1→UNOPEN，官方恒 ≥1）——发 0 会让 LevelToIndex(0)=0 →
// 页签表索引 -1 → array[0]=nil → 点"战斗回放"崩溃（TowerRecordPopupPanel）
function handleBarrierPage(conn) {
  const s = st();
  const now = Math.max(1, Number(s.barrier) || 1);
  conn.sendToc('m_tower_barrier_page_toc', {
    from: 1, to: Math.max(10, now + 9),
    now,
    fail_times: 0, fight_time: 0,
    week_max: Number(s.weekMax) || 0,
    talent: [61000, 61001, 61002],
    items: Array.isArray(s.autoStore) ? s.autoStore.map(x => ({ id: Number(x.id), val: Number(x.val) })) : [],
  });
}
function handleBarrierDetail(conn, obj) {
  const barrierId = Number(obj && obj.barrier_id) || 0;
  const wave = T.makeWave(barrierId);
  const preview = T.crystalPreviewOf(barrierId);
  // 战果页签 + 回放：取该层最近一场**胜利**的录像（floorRecords 只在 finishRecord 胜利时落）。
  // 旧进度（本次更新前通的关）没有录像 → result 空（客户端提示"本关还没挑战"）+ record_key=0
  const s = st();
  const recId = Number((s.floorRecords || {})[barrierId]) || 0;
  const rec = recId ? (S.towerRecords || {})[recId] : null;
  conn.sendToc('m_tower_barrier_detail_toc', {
    barrier_id: barrierId,
    monster: wave.map(e => ({ id: e.type, val: e.level })),
    result: rec ? rec.results : [],
    record_key: rec ? rec.id : 0,
    item: { id: preview.id, val: preview.num },
  });
}

// ---- 战斗回放（录像协议族）----
// info：客户端拿到 copy_id/fight_id/record_num 后自行进战斗场景，再逐条 msg 拉回合数据
// 录像库有两个来源：塔（S.towerRecords，LRU 10）与自律派遣（dormState.auto.record，只留最后一场）。
// 两边共用 m_fight_record_info_tos/msg_tos 这条全局通道，所以查询必须两处都找。
function recordOf(recId) {
  const id = Number(recId) || 0;
  if (!id) return null;
  const t = (S.towerRecords || {})[id];
  if (t) return t;
  try { return require('./auto_dispatch').recordOf(id); } catch (e) { return null; }
}
function handleRecordInfo(conn, obj) {
  const recId = Number(obj && obj.record_id) || 0;
  const rec = recordOf(recId);
  if (!rec) {
    // 录像不存在/已被 LRU 裁掉：给非 0 copy_id（防客户端 isHasDetail=false 死循环重拉）+
    // record_num=0 → 客户端 msg(1) → result=1 → 原生提示"战斗录像已过期，播放中止"
    conn.sendToc('m_fight_record_info_toc', {
      record_id: recId, op_type: Number(obj && obj.op_type) || 0,
      copy_id: 8000001, fight_id: 0, record_num: 0, result_index: [],
    });
    log(`[tower] 回放请求 record=${recId}：无录像（过期或非塔来源）→ 走过期中止`);
    return;
  }
  const settleIdx = rec.rounds.length + 2; // 1 条 start 头 + N 回合 + 1 条结算帧
  conn.sendToc('m_fight_record_info_toc', {
    record_id: recId,
    op_type: Number(obj && obj.op_type) || 0,
    copy_id: rec.copyId,
    fight_id: rec.fightId,
    record_num: settleIdx,
    result_index: [settleIdx], // 客户端"放弃观看"跳到结算帧（playResultRecord 取最后一项）
  });
  log(`[tower] 回放 record=${recId}（${rec.floor ? '第' + rec.floor + '关' : '自律派遣/非塔来源'}，${rec.rounds.length} 回合）开始下发`);
}
// msg：index=1 → start 头；index=i≥2 → 第 i-1 回合（第 1 回合进场单位用 rec.units）；
// index=rounds+2 = 结算帧（m_fight_result_toc + scene_result；"放弃观看"与自然播完共用）
function handleRecordMsg(conn, obj) {
  const recId = Number(obj && obj.record_id) || 0;
  const index = Number(obj && obj.index) || 0;
  const rec = recordOf(recId);
  const settleIdx = rec ? rec.rounds.length + 2 : 0;
  if (!rec || index < 1 || index > settleIdx) {
    conn.sendToc('m_fight_record_msg_toc', { record_id: recId, index, result: 1 });
    return;
  }
  if (index === 1) {
    conn.sendToc('m_fight_servant_start_toc', { fight_id: rec.fightId, side: 0, batch: 1, batch_num: 1 });
  } else if (index <= settleIdx - 1) {
    const r = rec.rounds[index - 2];
    const enterList = index === 2 ? rec.units.concat(r.enter_list || []) : (r.enter_list || []);
    conn.sendToc('m_fight_servant_fight_toc', {
      fight_id: rec.fightId,
      fight_type: 0,
      fight_round: index - 1,
      round_start: index === 2 ? 1 : 0,
      fight_list: r.fight_list,
      enter_list: enterList,
      summon_List: [],
      stand_list: [],
      remove_stand_list: [],
      effect_list: [],
      opp_servant_num: 0,
      update: [],
      weather: { start_weather: 0, weather_end_round: 0 },
      spec_type: '',
      spec_value: [],
      update_attr_list: [],
      element_wake_times: 0,
      select_time: Math.floor(Date.now() / 1000) + 30,
    });
  } else {
    // 结算帧：先奖励面板数据（OPEN_COPY_REWARD_PANEL 的数据源），再场景退场
    conn.sendToc('m_fight_result_toc', rec.resultToc);
    conn.sendToc('m_fight_scene_result_toc', { fight_id: rec.fightId, result: rec.resultToc.result });
  }
  conn.sendToc('m_fight_record_msg_toc', { record_id: recId, index, result: 0 });
}

// ---- 自动战斗 ----
// 官方语义（客户端反编译实证）：
//   · m_tower_begin_auto_tos{recover 0/1} → toc 回显 recover；recover=1 = 先消耗 1 次恢复并回满队伍状态；
//   · 之后**服务端每 AUTO_FIGHT_TIME(30) 秒自动打一场**（CfgTower.autoFightTime），客户端不进战斗场景，
//     只靠 m_tower_auto_status_toc{barrier, fight_time, is_auto, has_fail_log} 刷新——
//     fight_time 是**本场开始的服务器时间戳**（客户端倒计时 = fight_time + 30 - serverTime）；
//   · 胜利结晶进暂存库（战报 barrier_page.items），战报面板点"领取"→ m_tower_get_store_items_tos 发放；
//   · 失败/体力不足 → is_auto=0 停止（失败置 has_fail_log=1，客户端红点提示看战报）。
function pushAutoStatus(conn) {
  const s = st();
  const af = s.autoFight || {};
  conn.sendToc('m_tower_auto_status_toc', {
    barrier: Number(s.barrier) || 1, // 恒=当前挑战层（手动战斗推进后自动也能跟上）
    fight_time: af.on ? nowSec() : 0,
    is_auto: af.on ? 1 : 0,
    has_fail_log: Number(af.failLog) || 0,
  });
}

function handleBeginAuto(conn, obj) {
  const s = st();
  if (!isFuncOpen()) { conn.sendToc('m_common_error_toc', { code: ERR.COND }); return; }
  const t = teamOf();
  if (!t || !Object.keys(t.slots || {}).length) { conn.sendToc('m_common_error_toc', { code: ERR.COND }); return; }
  // ── recover 的协议语义 = 「**战斗失败时**自动恢复」策略开关，不是"现在立刻消耗一次恢复" ──
  // 2026-11-05 修（真机实锤）：面板勾选框文案是「战斗失败时，自动恢复」
  // （CfgPrefabLang.Tower_TowerAutoPopupPanel 的 lblBottom），`autoInfoDetail` 也只说
  // "直至战斗失败/体力不足/取消自动战斗"，全文没有"开启时立即恢复"。
  // 旧实现把 recover=1 当成"先消耗 1 次恢复再开"，且 recoverUsed=0 时直接回 262014
  // （"副本次数不足"）——玩家勾上就开不了自动，日志三次 `recover:1` 全部零出站到 handler 深处。
  // 「立即恢复」是另一条协议 `m_tower_recover_tos`（主界面"恢复"按钮），两条不能混。
  const recover = Number(obj && obj.recover) === 1 ? 1 : 0;
  const already = s.autoFight && s.autoFight.on;
  s.autoFight = {
    on: 1,
    barrier: Number(s.barrier) || 1,
    // 已在自动中重复开始（先保存编队再开自动的客户端流程会连发两条）：保留原节奏
    nextAt: already && s.autoFight.nextAt ? s.autoFight.nextAt : nowSec() + T.AUTO_FIGHT_TIME,
    failLog: 0,
    // 失败自动恢复策略：只在**本场打输**时消费恢复次数（见 autoFightTick 的 over!=='win' 分支）
    autoRecover: recover,
  };
  saveState();
  conn.sendToc('m_tower_begin_auto_toc', { recover });
  pushAutoStatus(conn);
  log(`[tower] 自动战斗开启（从第 ${s.autoFight.barrier} 关起，每 ${T.AUTO_FIGHT_TIME} 秒一场）`
    + `，失败自动恢复=${recover ? '开' : '关'}（现有恢复次数 ${s.recoverUsed || 0}/${T.RECOVER_MAX}）`);
}

function handleCancelAuto(conn) {
  const s = st();
  if (s.autoFight && s.autoFight.on) log('[tower] 自动战斗取消');
  s.autoFight = null;
  saveState();
  conn.sendToc('m_tower_cancel_auto_toc', { id: 0 });
  pushAutoStatus(conn); // is_auto=0：客户端按钮复位 + 战报页签同步
}

// 心跳驱动（start.js onHeartbeat）：到点打一场。整场战斗服务端离线结算——
// resolveRound(f, {}) 空选择 = 我方全员走 FC.aiChoose 自动选技能，与敌方同一 AI。
function autoFightTick(conn) {
  const s = S.towerState;
  if (!s || !s.autoFight || !s.autoFight.on) return;
  if (S.towerFight) return; // 手动战斗会话进行中，跳过本次 tick
  const af = s.autoFight;
  const now = nowSec();
  if (!af.nextAt) af.nextAt = now + T.AUTO_FIGHT_TIME; // 旧状态兼容
  if (now < af.nextAt) return;

  const floor = Number(s.barrier) || 1;
  const t = s.team;
  if (!t || !Object.keys(t.slots || {}).length) {
    af.on = 0; saveState();
    pushAutoStatus(conn);
    log(`[tower] 自动战斗停止：编队为空`);
    return;
  }
  const firstWeekly = !s.claimed[floor];
  if (firstWeekly) {
    const VIT = require('./vit');
    if (VIT.getVit() < T.VIT_COST) {
      af.on = 0; saveState();
      conn.sendToc('m_common_error_toc', { code: ERR.VIT });
      pushAutoStatus(conn);
      log(`[tower] 自动战斗停止：体力不足（第 ${floor} 关需 ${T.VIT_COST}，有 ${VIT.getVit()}）`);
      return;
    }
    VIT.addVit(conn, -T.VIT_COST);
  }
  const f = TF().buildFight(S.nextFightId++, floor);
  let over = null;
  while (!over && f.round < 30) {
    f.round += 1;
    const fightList = TF().resolveRound(f, {});
    const enters = TF().reinforce(f);
    // ⚠️ 录制必须走 recordRound（内部 id → wire bid），不能裸 push：
    // rec.units 是 unitToc 的 bid 形态，若 fight_list 存内部 id（9000007x/7500000x），
    // 回放时客户端查不到单位 ⇒ CheckAct 每帧 nil 崩、动作不推进 = 「回放看不了会卡死」。
    TF().recordRound(f, fightList, enters, fightList.roundEffects);
    over = TF().outcomeOf(f);
  }
  if (over === 'win') {
    af.barrier = floor + 1;             // 下一场打新层
    af.nextAt = nowSec() + T.AUTO_FIGHT_TIME;
    TF().onWin(conn, f, { silent: true });
  } else {
    // ── 「战斗失败时，自动恢复」策略（与 handleBeginAuto 的 recover 语义成对，2026-11-05）──
    // 官方面板文案就是这个含义：勾上 = 输了自动补满全队继续挂机，而不是开启时先扣一次。
    const canAutoRecover = !!(af.autoRecover) && (s.recoverUsed || 0) > 0;
    if (canAutoRecover) {
      s.recoverUsed -= 1;
      // 恢复 = 全队 HP/PP 拉满（同 m_tower_recover_tos）；编队与挑战层都保持不变
      const teamSnap = s.team;
      if (teamSnap) teamSnap.savedHp = {};
      // ⚠️ 不调 onLose：它会清 team + 把 barrier 拉回恢复点 + pushInfo（推 is_auto=0 的错状态），
      // 与"自动恢复后继续挂机"的语义相反。但**必须自己清会话标记**——否则下一轮 tick 的
      // 首行 `if (S.towerFight) return;` 会把挂机永久卡死（真机语义：恢复后应继续打同一层）。
      S.towerFight = null;
      s.autoFight = {
        on: 1, barrier: floor, failLog: 0,
        nextAt: nowSec() + T.AUTO_FIGHT_TIME,
        autoRecover: 1,
      };
      saveState();
      pushAutoStatus(conn);
      log(`[tower] 第${floor}关战败（${over === 'lose' ? '我方全灭' : '30 回合未分出胜负'}）`
        + ` → 自动恢复 1 次（余 ${s.recoverUsed}/${T.RECOVER_MAX}），全队状态回满，继续挂机`);
      return;
    }
    af.on = 0;
    af.failLog = 1;
    TF().onLose(conn, f, over === 'lose' ? '我方全灭' : '30 回合未分出胜负', { silent: true });
    if (af.autoRecover && (s.recoverUsed || 0) <= 0) {
      log(`[tower] 自动战斗停止：失败自动恢复已开启但没有可用恢复次数`);
    }
  }
  pushAutoStatus(conn); // is_auto/has_fail_log/fight_time 随结果刷新（win 时下一场倒计时同时启动）
  saveState();
}

// ---- 暂存奖励领取（战报面板"领取"按钮）----
function handleStoreItems(conn) {
  const s = st();
  const store = Array.isArray(s.autoStore) ? s.autoStore : [];
  const changed = [];
  for (const it of store) changed.push(...L.grantGoods(Number(it.id), Number(it.val) || 0, conn));
  conn.sendToc('m_tower_get_store_items_toc', { items: store });
  s.autoStore = [];
  if (changed.length) pushGoodsUpdate(conn, changed, 3);
  saveState();
  log(`[tower] 领取暂存奖励：${store.map(x => `${x.id}x${x.val}`).join(' ') || '（空）'}`);
}

function onLogin(conn) {
  st();
  pushInfo(conn);
  if (S.towerState.autoFight && S.towerState.autoFight.on) {
    pushAutoStatus(conn); // 掉线重连：自动战斗仍在挂机，同步客户端按钮/倒计时状态
  }
}

module.exports = {
  st, isFuncOpen, pushInfo, settleWin,
  teamMembers, buffToc, activeEffects, rollBuffs, autoFightTick,
  handlers: {
    m_tower_info_tos: conn => { st(); pushInfo(conn); },
    m_tower_select_tos: handleSelect,
    m_tower_prepare_tos: handlePrepare,
    m_copy_fight_prepare_tos: handlePrepareCopy,
    m_tower_fight_tos: handleFight,
    m_tower_reset_tos: handleReset,
    m_tower_recover_tos: handleRecover,
    m_tower_box_reward_tos: handleBoxReward,
    m_tower_rank_info_tos: handleRank,
    m_tower_barrier_page_tos: handleBarrierPage,
    m_tower_barrier_detail_tos: handleBarrierDetail,
    // 誓灵详情（塔编队/选人面板右侧角色卡）：2026-11-05 前为零实现 —— 面板空白根因
    m_tower_servant_detail_tos: handleServantDetail,
    m_tower_begin_auto_tos: handleBeginAuto,
    m_tower_cancel_auto_tos: handleCancelAuto,
    m_tower_get_store_items_tos: handleStoreItems,
    // 战斗回放录像族（塔战胜利场次；本服其它录像来源未实现，请求按"过期中止"处理）
    m_fight_record_info_tos: handleRecordInfo,
    m_fight_record_msg_tos: handleRecordMsg,
    // 塔战会话的战斗链（非塔会话显式回落 map_fight）
    m_fight_servant_start_tos: handleStart,
    m_fight_skill_select_tos: handleFightSelect,
  },
};
