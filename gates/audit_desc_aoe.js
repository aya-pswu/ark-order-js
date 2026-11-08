// 审计：desc-AOE 族 —— 「技能描述承诺敌方全体、effType 却是单体」的技能必须有实现
// （调研-敌方AOE只打一人.md；玩家反馈「敌人的 aoe 只会打到一个人」的真实根因族）
//
// ── 机制 ────────────────────────────────────────────────────────────────────
//   CfgSkillDetail 里有少量攻击技，官方把"攻击敌方全体"写在 desc/fightDesc 里、
//   effType 却是单体 1xxx —— 官方服务器靠技能特判实现。服务端若只按 effType 展开，
//   这些技能永远只命中 1 人，且完全静默（不报错）。
//
// ── 已知成员（2026-10-28）────────────────────────────────────────────────────
//   10243 天国复仇   击败后下次全体      → rule.heavenVengeance（targetsOfEff 武装分支 + settleSkill 清标）
//   10272 伏行之混沌 伏行状态全体        → fight_core 原生分支（actor.crawling，21900）
//   10274 空间箭     幻梦战全体禁锢      → rule.buffs[].dreamAll（伤害本体按官方就是单体）
//   10326 雾隐之惧   无条件全体/人数均摊 → ⚠️ 未实现；当前无任何敌人可施放（玩家侧 latent），允许但点名
//
// ── 判据 ────────────────────────────────────────────────────────────────────
//   ERROR   敌人可施放（全内容敌种 × 技能书 lv 门）∧ 无实现标记 → 玩家必然遇到，禁止出包
//   LATENT  无人可施放 ∧ 未实现 → 玩家侧技能，保留提示不失败
//   基线漂移 已知 4 条必须都能被本扫描找到（措辞/正则退化即失败）
//
// ── 用法 ────────────────────────────────────────────────────────────────────
//   node tools/audit_desc_aoe.js          # 概览
//   node tools/audit_desc_aoe.js --fail   # 有 ERROR 即 exit 1（挂 make.py ①e 前置）
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const failMode = process.argv.includes('--fail');

// ── 1. 解析 CfgSkillDetail（真机 bc 反编译快照，md5 与 server 快照一致的来源）──
const raw = fs.readFileSync(path.join(ROOT, 'tools', 'bc_cmp', 'out_CfgSkillDetail.lua'), 'utf8');
const DESCS = {};
const RE = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\n\t\}/g;
let m;
while ((m = RE.exec(raw))) {
  const body = m[2];
  const pick = k => { const mm = body.match(new RegExp(k + '\\s*=\\s*"((?:[^"\\\\]|\\\\.)*)"')); return mm ? mm[1].replace(/\\"/g, '"') : ''; };
  DESCS[Number(m[1])] = { name: pick('skillName'), desc: pick('desc'), fdesc: pick('fightDesc') };
}

// ── 2. 服务端技能数值 + 规则表 ──
const { SKILLS } = require(path.join(ROOT, 'server', 'data', 'skill_data'));
const { getSkillRule } = require(path.join(ROOT, 'server', 'data', 'skill_effect_data'));

const SINGLE_FOE = new Set([1001, 1002, 1103, 1004, 1005, 1106, 1007, 1108, 1009, 1010, 1011, 1012]);
// 全体性措辞（放宽到当前官方用语的并集；新客户端版本引入新措辞时这里同步）
const ALL_RE = /(敌方全体|全体对手|所有敌人|全部敌人|全体敌人|所有对手|每个敌|全体敌方|攻击全体)/;

const candidates = [];
for (const [sidStr, d] of Object.entries(DESCS)) {
  const sid = Number(sidStr);
  const c = SKILLS[sidStr] || SKILLS[sid];
  if (!c || (Number(c.type) !== 1 && Number(c.type) !== 2) || !(Number(c.power) > 0)) continue;
  if (!SINGLE_FOE.has(Number(c.effType) || 0)) continue;
  if (!ALL_RE.test(d.desc || '')) continue;
  candidates.push({ sid, name: d.name, et: c.effType, text: (d.desc || '').slice(0, 66) });
}

// ── 3. 实现标记 ──
// NATIVE = fight_core 原生分支（加新成员时同步注释行号）；RULE_MARKER = skill_effect_data 落地标志。
const NATIVE_IMPLEMENTED = new Set([10272]); // targetsOfEff: skillId===10272 && actor.crawling → foes
const hasImpl = sid => {
  if (NATIVE_IMPLEMENTED.has(sid)) return true;
  const r = getSkillRule(sid);
  if (!r) return false;
  if (r.heavenVengeance) return true;
  if (Array.isArray(r.buffs) && r.buffs.some(b => b.dreamAll)) return true;
  if (r.attackAllSplit || r.attackAll) return true; // 为 10326 族预留的规则名
  return false;
};

// ── 4. 全内容敌人（主线 MAP_CONFIGS require 时已并活动关；其余数据源按记录正则）──
const enemies = new Map(); // type → { lv, src:Set }
const feed = (type, lv, src) => {
  if (!type || type < 1000000) return;
  const cur = enemies.get(type) || { lv: 0, src: new Set() };
  cur.lv = Math.max(cur.lv, lv || 1);
  cur.src.add(src);
  enemies.set(type, cur);
};
{
  const { MAP_CONFIGS } = require(path.join(ROOT, 'server', 'data', 'map_configs'));
  for (const cfg of Object.values(MAP_CONFIGS)) {
    for (const wave of Object.values(cfg.waves || {})) {
      (wave || []).forEach(batch => (batch || []).forEach(e => { if (e && e.type) feed(e.type, e.level || 1, 'MAP_CONFIGS'); }));
    }
  }
}
const RECORD = /"type":\s*(\d+)[^{}]*?"level":\s*(\d+)/g;
for (const [src, f] of [['glasttour', 'glasttour_data.js'], ['dream', 'dream_data.js'], ['fantasy', 'fantasy_data.js'], ['dare', 'dare_data.js']]) {
  const p = path.join(ROOT, 'server', 'data', f);
  if (!fs.existsSync(p)) continue;
  let mm;
  while ((mm = RECORD.exec(fs.readFileSync(p, 'utf8')))) feed(Number(mm[1]), Number(mm[2]), src);
}
{
  const tw = fs.readFileSync(path.join(ROOT, 'server', 'data', 'tower_data.js'), 'utf8');
  let mm;
  const R1 = /"type":\s*(\d+)[^{}]*?"level":\s*(\d+)/g;
  const R2 = /"type":\s*(\d+)[^{}]*?"hp":\s*(\d+)/g;
  while ((mm = R1.exec(tw))) feed(Number(mm[1]), Number(mm[2]), 'tower');
  while ((mm = R2.exec(tw))) feed(Number(mm[1]), 90, 'tower');
}

const castableBy = sid => {
  const out = [];
  for (const [type, info] of enemies) {
    const book = SKILLBOOK[String(type)] || SKILLBOOK[type] || [];
    const hit = book.find(b => Number(b.id) === Number(sid));
    if (hit && info.lv >= (hit.lv || 0)) out.push(`${[...info.src].join('/')}:${type}@lv${info.lv}`);
  }
  return out;
};
const { SERVANT_SKILLBOOK: SKILLBOOK } = require(path.join(ROOT, 'server', 'data', 'skill_data'));

// ── 5. 分级输出 ──
console.log(`desc-AOE 候选（攻击技 ∧ desc 全体 ∧ effType 单体）：${candidates.length} 条`);
let hasError = false;
for (const c of candidates) {
  const impl = hasImpl(c.sid);
  const casters = castableBy(c.sid);
  const tag = impl ? 'OK     ' : (casters.length ? 'ERROR  ' : 'LATENT ');
  if (!impl && casters.length) hasError = true;
  console.log(`  [${tag}] ${c.sid} ${c.name} effType=${c.et}${impl ? '（已实现）' : ''}` +
    (casters.length ? ` 敌人可放: ${casters.slice(0, 3).join(' | ')}${casters.length > 3 ? ` 等${casters.length}处` : ''}` : ' 敌人放不出') +
    ` :: ${c.text}…`);
}

// 基线漂移防护：已知 4 条必须仍在候选里（措辞变化/解析退化会静默漏检）
const KNOWN = [10243, 10272, 10274, 10326];
const missing = KNOWN.filter(id => !candidates.some(c => c.sid === id));
if (missing.length) {
  console.log(`  [WARN] 已知成员未被扫描命中：${missing.join(',')}（desc 措辞或解析退化，人工核查）`);
  if (failMode) hasError = true;
}

console.log(hasError ? '\n审计结果：ERROR（敌人可施放且未实现）' : '\n审计结果：PASS');
if (failMode && hasError) process.exit(1);
