// CfgServant 暗噬配置：由 extract_chaos_enchant.py 校对新旧客户端后生成。
'use strict';
const C = require('./chaos_enchant_config.json');
const NODES = C.nodes;
function levelsOf(b) {
  const out = {};
  for (const x of Array.isArray(b && b.chaos) ? b.chaos : []) {
    const id = Number(x && x.id), val = Number(x && x.val);
    if (NODES[id] && Number.isSafeInteger(val) && val > 0) out[id] = Math.min(val, NODES[id].max);
  }
  return out;
}
function chaosArrayOf(b) { return Object.entries(levelsOf(b)).map(([id, val]) => ({ id: Number(id), val })); }
function levelOf(b, id) { return levelsOf(b)[id] || 0; }
function totalOf(b, family) { return Object.entries(levelsOf(b)).filter(([id]) => family == null || id.startsWith(String(family))).reduce((n, [, v]) => n + v, 0); }
function nodeOf(id) { return NODES[id] || null; }
function prereqOf(id) { return (nodeOf(id) || {}).pre || []; }
function costOf(id, next) { const n = nodeOf(id); return n && n.steps[next - 1] ? n.steps[next - 1].cost : null; }
function berserkOf(b) { return C.berserk[b && b.type] || null; }
function canUpgrade(b, id) {
  const n = nodeOf(id), cur = levelOf(b, id);
  if (!n || cur >= n.max) return { ok: false, reason: '节点不存在或已满级' };
  if (id >= 2001 && id <= 2005 && !berserkOf(b)) return { ok: false, reason: '该誓灵没有狂化路线' };
  if (prereqOf(id).some(p => levelOf(b, p.id) < p.level)) return { ok: false, reason: '前置节点未达标' };
  return { ok: true, next: cur + 1, cost: costOf(id, cur + 1) };
}
function sumAdd(b, filter) {
  return Object.entries(levelsOf(b)).filter(([id]) => filter(Number(id))).reduce((sum, [id, lv]) =>
    sum + NODES[id].steps.slice(0, lv).reduce((n, s) => n + s.add, 0), 0);
}
const fantasyGrowthOf = b => sumAdd(b, id => id >= 1001 && id <= 1006);
const powerGrowthOf = b => sumAdd(b, id => id >= 3001 && id <= 3006);
const attackAddOf = b => sumAdd(b, id => id === 1101);
function phyleOf(b) {
  const c = berserkOf(b);
  if (!c || !(Number(b.status2) & 2) || !levelOf(b, 2001)) return undefined;
  return c.phyle[require('./fight_core').stepOfStar(b.star) - 1];
}
function talentOf(b) {
  const c = berserkOf(b);
  return c && (Number(b.status2) & 1) && levelOf(b, 2003) ? c.talent : Number(b.talent) || require('./fight_core').talentOf(b.type) || 0;
}
function normalAttrsOf(b, extra) {
  const FC = require('./fight_core');
  // 突破与混沌加成先相加再向上取整，避免两个 ceil 带来额外属性。
  return FC.calcAttrs(b.type, b.level, b.energy_points, (Number(b.overstep) || 0) + powerGrowthOf(b), extra, FC.stepOfStar(b.star), phyleOf(b));
}
function rageSkillsOf(b) {
  const D = require('./dream_data'), skills = D.SERVANT_RAGE_SKILLS[b.type] || [];
  const gates = C.rageUnlock[b.type] || [];
  return skills.map(Number).filter((_, i) => {
    const gate = gates.find(g => g.order === i + 1);
    return gate ? gate.node === -1 || levelOf(b, gate.node) === NODES[gate.node].max : i === 0;
  });
}
function rageSkillOf(b) { const list = rageSkillsOf(b); return list.includes(Number(b.rage_skill)) ? Number(b.rage_skill) : list[0] || 0; }
function isBusy(S, b) {
  if (Number(b.status) & 12) return true;
  const sid = Number(b.id);
  for (const f of [S.fightState, S.dreamFight, S.towerFight]) {
    if (f && !f.over && ['allies', 'allyBench', 'allAllies'].some(k => (f[k] || []).some(u => Number(u.id) === sid))) return true;
  }
  return false;
}
function normalize(b) {
  b.chaos = chaosArrayOf(b); b.dream_lv = fantasyGrowthOf(b);
  if (!berserkOf(b) || !levelOf(b, 2001)) b.status2 = (Number(b.status2) || 0) & ~2;
  if (!berserkOf(b) || !levelOf(b, 2003)) b.status2 = (Number(b.status2) || 0) & ~1;
  b.rage_skill = rageSkillOf(b);
}
module.exports = { C, NODES, levelsOf, chaosArrayOf, levelOf, totalOf, nodeOf, prereqOf, costOf, canUpgrade,
  berserkOf, fantasyGrowthOf, powerGrowthOf, attackAddOf, phyleOf, talentOf, normalAttrsOf, rageSkillsOf, rageSkillOf, isBusy, normalize };
