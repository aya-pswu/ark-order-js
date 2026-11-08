// 战斗结算统计（m_fight_result_toc.mvp_stats / mvp）：伤害、承伤、治疗按人累计 + MVP 推选。
// 口径与设计依据：调研-结算详情页.md（2026-10-24，含客户端 CopyRewardPanel/CopyRewardDetailItem
// 逐行反编译结论）。原则：
//   1. 只依赖战斗循环传入的数据（settleSkill 的 results / 引擎单位对象），不改 fight_core；
//   2. wire 演出 effect（p_fight_effect change_type=200000）符号语义不统一（特性演出约定负数、
//      加拉哈德等传的是"复活后 HP 值"），一律不作为统计源——绕过 results 的 HP 突变
//      （回合末毒/燃烧/诅咒、受创反应回血/反伤、进场伤害、复活）由 settleRoundDiff 的
//      回合级 HP 差分兜底；
//   3. 护盾吸收量（shield_hurt）不算承伤（承伤=实际掉血，与血条守恒），也不算伤害
//      （与战斗飘字口径一致）；
//   4. 治疗记施术者（治疗技/元素唤醒回血/吸血在 results 里都是 hurt<0 且 actor=施术者）；
//      绕过 results 的被动自回（亚瑟王、圣器回合回血）经差分记受疗者自己。
//
// 反击/荆棘对敌伤害（checkTalentsAfterSkill 内直接改敌方 HP + 推演出 effect）Phase 1 不进
// "伤害"统计：归因需读演出 effect 且敌方侧不做差分（明确取舍，见调研 §5 D3）。

// MVP 经验加成（BWIKI 官方口径：「每个出战誓灵(包括替补)所获得的经验值是相等的，
// 除非拥有MVP加成(1.2倍)或受装备圣器」）。乘在圣器经验加成之后，最后一次取整。
const MVP_EXP_MUL = 1.2;

// 详情卡片固定 6 张（CopyRewardPanel.initUI），超出的条目客户端直接忽略，这里同步截断
const MAX_ROWS = 6;

function newStats() {
  return {};
}

function bucketOf(stats, id) {
  let b = stats[id];
  if (!b) {
    b = stats[id] = { atk: 0, hp_recover: 0, hp_reduce: 0 };
  }
  return b;
}

// 一次技能结算的按人归因。results = FC.settleSkill 返回数组（applyElementSupport 会向同一数组
// 追加治疗条目，故必须在它之后调用）。hurt>0：atk 记攻击方（我方→敌方）、hp_reduce 记掉血的我方
// 目标；hurt<0：hp_recover 记施术者（仅我方施术者——敌方治疗技不进统计）。
// MISS/纯增益为 hurt=0，天然跳过。
function accumulateResults(stats, actor, results, units) {
  if (!stats || !results || !results.length || !units) return;
  const actorAlly = !!(actor && actor.side === 0);
  for (const e of results) {
    const h = Number(e && e.hurt) || 0;
    if (h === 0) continue;
    const victim = units.find(u => u && u.id === (e && e.target));
    if (!victim) continue;
    if (h > 0) {
      if (actorAlly && victim.side === 1) bucketOf(stats, actor.id).atk += h;
      if (victim.side === 0) bucketOf(stats, victim.id).hp_reduce += h;
    } else if (actorAlly && victim.side === 0) {
      bucketOf(stats, actor.id).hp_recover += -h;
    }
  }
}

// 混乱自伤（map_fight 的 checkUnitCanAct.selfHit 分支）：攻击者=受害者=自己
function accumulateSelfHit(stats, unit, dmg) {
  if (!stats || !(dmg > 0) || !unit || unit.side !== 0) return;
  bucketOf(stats, unit.id).hp_reduce += dmg;
}

// 回合收口（在 settleRoundEndTicks 之后、胜负分支之前调用一次）。
// roundLog = 本回合每个行动者的 {actor, results}（与 accumulateResults 消费的同批数据，
// 按行动序）。对我方单位：实际 HP 变化 − results 已解释的变化 = 绕过 results 的突变。
//   差额 <0 → 承伤（记受击者）；差额 >0 → 治疗（记受疗者自己）。
// 死亡/复活天然自洽：致死伤害已在 results 里全额计入承伤，复活补回的血经差额记治疗。
function settleRoundDiff(stats, units, hpBegin, roundLog) {
  if (!stats || !units || !hpBegin) return;
  const dmgTaken = {};
  const healRecv = {};
  for (const rec of roundLog || []) {
    for (const e of (rec && rec.results) || []) {
      const h = Number(e && e.hurt) || 0;
      if (h === 0) continue;
      const victim = units.find(u => u && u.id === (e && e.target));
      if (!victim || victim.side !== 0) continue;
      if (h > 0) dmgTaken[victim.id] = (dmgTaken[victim.id] || 0) + h;
      else healRecv[victim.id] = (healRecv[victim.id] || 0) - h;
    }
  }
  for (const u of units) {
    if (!u || u.side !== 0) continue;
    const begin = hpBegin[u.id] != null ? hpBegin[u.id] : u.hp;
    const residual = (u.hp - begin) - ((healRecv[u.id] || 0) - (dmgTaken[u.id] || 0));
    if (residual < 0) bucketOf(stats, u.id).hp_reduce += -residual;
    else if (residual > 0) bucketOf(stats, u.id).hp_recover += residual;
  }
}

// 结算行组装：参战我方按场上顺序（=详情卡片从左到右），p_fight_stats 7 字段全量显式发
// （客户端 show() 用 max 字段做分母，缺字段=Lua nil 算术崩，0 也必须编码——
// 服务端 etf 对 int undefined 才回 0，这里自己兜死非负整数）。
// score = 伤害 + 治疗（调研 §5 D1 拍板口径），只影响"评分%"显示与 MVP 排序。
function buildRows(stats, allies, servants) {
  const rows = [];
  for (const a of allies || []) {
    if (!a || !(a.id > 0)) continue;
    const b = (servants || []).find(s => s && s.id === a.id) || null;
    const s = (stats && stats[a.id]) || {};
    const atk = Math.max(0, Math.round(Number(s.atk) || 0));
    const rec = Math.max(0, Math.round(Number(s.hp_recover) || 0));
    const red = Math.max(0, Math.round(Number(s.hp_reduce) || 0));
    rows.push({
      id: a.id,
      skin_id: (b && Number(b.skin_id)) || ((b ? b.type : a.type) * 100 + 1),
      name: (b && b.name) || '',
      atk,
      hp_recover: rec,
      hp_reduce: red,
      score: atk + rec,
    });
  }
  return rows.slice(0, MAX_ROWS);
}

// MVP = score 最高，并列取数组靠前（rows 保持场上顺序）；全 0 返回 0（调用方走原回退链：
// 存活等级最高 → allies[0] → field[0]）。客户端 MVP 星标只认 toc 的 mvp 字段
//（CopyResultVO.maxMvpStats.id = slot1.mvp），与 score 排序天然一致。
function pickMvp(rows) {
  let mvp = 0;
  let best = 0;
  for (const r of rows || []) {
    if (r && r.score > best) {
      best = r.score;
      mvp = r.id;
    }
  }
  return mvp;
}

module.exports = {
  MVP_EXP_MUL,
  MAX_ROWS,
  newStats,
  accumulateResults,
  accumulateSelfHit,
  settleRoundDiff,
  buildRows,
  pickMvp,
};
