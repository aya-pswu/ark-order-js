// 审计：服务端战斗 effect 的 **src_id** 能否被客户端安全消费（2026-10-27 真机工单：
// 「元素精灵仍然报错」[LuaError] 不存在的特性ID：10382 / 10378）。
//
// ── 两条查表通道，第二参不同，后果完全不同（asm + 反编译双证）──────────────────
//   FeatureLoop.showFeature:97
//     GetFeature(effect[1].src_id, effect[1].src_type == FightConst.FIGHT_EFF_FEATURE)
//     ⇒ **只有 src_type=1 才 printError**；src_type=3/5 缺表只返回 nil（官方正常形态）
//   FeatureLoop.dealFeatureEff:145
//     GetFeature(effect.id, true)   -- 无条件 true
//     ⇒ **任何 src_type** 下 id 缺表都报错（已由 test_effect_id_semantics 覆盖）
//
// ── 分类 ────────────────────────────────────────────────────────────────────
//   OK         src_id 命中客户端表
//   SILENT     src_type≠1 且缺表 —— 允许（技能源无展示条目）
//   ERROR      src_type=1 且缺表 —— 真机 printError，必须修（改 src_type 或换表内 id）
//   COLLIDE    src_type∉{1,2,3} 且 src_id 命中表 —— 真风险：这类 src_type 会进「横幅」分支，
//              客户端拿**别的机制**的名字弹横幅（如 10021 腐蚀毒素 → 「心灵暗示生效」）。
//              src_type=3 命中表是**无害**的（showFeature:104 短路到 dealFeatureEff，
//              永远不进横幅分支），单列为 INFO 档，只提示不失败。
//   UNKNOWN    src_id 是表达式，静态不可判（都走 gainStat 默认值或表内常量，人工确认）
//
// ── 用法 ────────────────────────────────────────────────────────────────────
//   node tools/audit_feature_src_ids.js            # 概览 + ERROR/MISMATCH 明细
//   node tools/audit_feature_src_ids.js --fail     # 有 ERROR 即 exit 1（挂 make.py 前置）
//   node tools/audit_feature_src_ids.js --strict   # ERROR 或 MISMATCH 都 exit 1
//   node tools/audit_feature_src_ids.js --json     # 机器可读
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FF = path.join(ROOT, 'tools', 'lua_remote', 'src', 'Config', 'FightFeature.lua');
const FILES = [
  path.join(ROOT, 'server', 'data', 'fight_core.js'),
  path.join(ROOT, 'server', 'handlers', 'map_fight.js'),
];

const FEATURE_IDS = new Set([...fs.readFileSync(FF, 'utf8').matchAll(/^\s*\[(\d+)\]\s*=\s*\{/gm)].map(m => Number(m[1])));
const { SKILLS } = require(path.join(ROOT, 'server', 'data', 'skill_data.js'));
const TD = require(path.join(ROOT, 'server', 'data', 'talent_data.js'));
const EL = require(path.join(ROOT, 'server', 'data', 'element_data.js'));
const talentName = {};
for (const k of Object.keys(TD.TALENT_INFO || {})) talentName[k] = (TD.TALENT_INFO[k] || {}).name || '';
const elementSkill = new Set();
for (const tbl of Object.values(EL.SKILL_DETAILS || {})) for (const r of Object.values(tbl)) elementSkill.add(Number(r.skillId));
const nameOf = id => (SKILLS[id] && SKILLS[id].name) || talentName[id] || (elementSkill.has(id) ? '元素精灵专属技' : '');

function collectCalls(lines, name) {
  const out = [];
  const re = new RegExp('\\b' + name + '\\(');
  let i = 0;
  while (i < lines.length) {
    if (!re.test(lines[i])) { i++; continue; }
    let depth = 0, stmt = '', j = i;
    for (; j < lines.length; j++) {
      stmt += lines[j] + '\n';
      for (const ch of lines[j]) { if (ch === '(') depth++; else if (ch === ')') depth--; }
      if (depth <= 0) break;
    }
    out.push({ line: i + 1, stmt });
    i = j + 1;
  }
  return out;
}

const rows = [];
const push = (r) => { rows.push(r); };

for (const file of FILES) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const lines = fs.readFileSync(file, 'utf8').split('\n');

  // ── 1. gainStat({ srcId, srcType? })：srcType 缺省 = 1（函数内默认）
  for (const c of collectCalls(lines, 'gainStat')) {
    if (/^function gainStat/.test(c.stmt)) continue;
    const m = c.stmt.match(/srcId:\s*([^,\n]+)/);
    if (!m) continue;
    const srcType = /srcType:/.test(c.stmt) ? Number((c.stmt.match(/srcType:\s*(\d+)/) || [])[1]) : 1;
    const raw = m[1].trim();
    push({ file: rel, line: c.line, kind: 'gainStat', raw, srcType });
  }

  // ── 2. gs(u,p,d,sid) helper：**srcType=3**（applyExclusiveCastEffects 内定义）
  for (const c of collectCalls(lines, 'gs')) {
    const m = c.stmt.match(/,\s*(\d{4,})\s*\)/);   // 不能锚 '\);$'（语句以 ');' 结尾）
    if (!m) continue;
    push({ file: rel, line: c.line, kind: 'gs()', raw: m[1], srcType: 3 });
  }

  // ── 3. 字面量 effect 块：src_type 与 src_id 同块
  for (let i = 0; i < lines.length; i++) {
    const mt = lines[i].match(/src_type:\s*(\d+)/);
    if (!mt) continue;
    const win = lines.slice(Math.max(0, i - 6), Math.min(lines.length, i + 10)).join('\n');
    const m = win.match(/\bsrc_id:\s*([^,\n]+)/);
    if (!m) continue;
    push({ file: rel, line: i + 1, kind: 'literal', raw: m[1].trim(), srcType: Number(mt[1]) });
  }
}

// 分类
const byClass = { OK: [], SILENT: [], ERROR: [], COLLIDE: [], INFO: [], UNKNOWN: [] };
for (const r of rows) {
  if (!/^\d+$/.test(r.raw) && r.raw !== 'sid') { r.cls = 'UNKNOWN'; }
  else {
    const id = Number(/^\d+$/.test(r.raw) ? r.raw : NaN);
    if (!Number.isFinite(id)) { r.cls = 'UNKNOWN'; }
    else if (r.srcType === 1) r.cls = FEATURE_IDS.has(id) ? 'OK' : 'ERROR';
    else if (r.srcType === 3) r.cls = FEATURE_IDS.has(id) ? 'INFO' : 'SILENT';
    else r.cls = FEATURE_IDS.has(id) ? 'COLLIDE' : 'SILENT';
    if (Number.isFinite(id)) r.id = id;
  }
  byClass[r.cls].push(r);
}

const summarize = arr => {
  const m = new Map();
  for (const r of arr) {
    const k = r.id != null ? r.id : r.raw;
    if (!m.has(k)) m.set(k, { id: r.id, raw: r.raw, where: [] });
    m.get(k).where.push(`${r.file}:${r.line}`);
  }
  return [...m.entries()].sort((a, b) => (a[0] > b[0] ? 1 : -1));
};

// ── 第二条通道：effect.id（dealFeatureEff → GetFeature(id, true)，与 src_type 无关）──
// 主检仍是 tools/test_effect_id_semantics.js；这里并入同一命令，出包闸门一次拦两条通道。
const badEffectIds = [];
for (const file of FILES) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!/change_type:/.test(lines[i])) continue;
    const win = lines.slice(Math.max(0, i - 18), i + 1).join('\n');
    const m = win.match(/(?:^|[\s{])id:\s*(\d+)\s*,/m);
    if (!m) continue;
    const id = Number(m[1]);
    if (!FEATURE_IDS.has(id)) badEffectIds.push({ file: rel, line: i + 1, id });
  }
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ total: rows.length, counts: Object.fromEntries(Object.entries(byClass).map(([k, v]) => [k, v.length])) }, null, 2));
  process.exit(0);
}

const quiet = process.argv.includes('--fail') || process.argv.includes('--strict');
const log = (...a) => { if (!quiet) console.log(...a); };

log(`FightFeature 表：${FEATURE_IDS.size} 条（${path.relative(ROOT, FF)}）`);
log(`扫描 ${rows.length} 处 src_id → OK ${byClass.OK.length} / SILENT ${byClass.SILENT.length} / ` +
  `ERROR ${byClass.ERROR.length} / COLLIDE ${byClass.COLLIDE.length} / ` +
  `INFO ${byClass.INFO.length} / UNKNOWN ${byClass.UNKNOWN.length}\n`);

if (byClass.ERROR.length) {
  console.error('🔴 ERROR：src_type=1 且 src_id 不在特性表 → 真机 printError「不存在的特性ID」');
  for (const [k, v] of summarize(byClass.ERROR)) {
    console.error(`  ${String(k).padEnd(6)} ${String(nameOf(v.id) || '?').padEnd(14)} ×${String(v.where.length).padEnd(2)} ${v.where.join(', ')}`);
  }
  console.log('');
}
if (badEffectIds.length) {
  console.error('🔴 ERROR（effect.id 通道）：dealFeatureEff 对每条 effect 无条件 GetFeature(id, true)');
  console.error('   → 与 src_type 无关，缺表必报错（主检：tools/test_effect_id_semantics.js）');
  const by = new Map();
  for (const b of badEffectIds) {
    if (!by.has(b.id)) by.set(b.id, []);
    by.get(b.id).push(`${b.file}:${b.line}`);
  }
  for (const [id, where] of [...by].sort((a, b) => a[0] - b[0])) {
    console.error(`  ${String(id).padEnd(8)} ${String(nameOf(id) || '?').padEnd(14)} ×${where.length} ${where.join(', ')}`);
  }
  console.log('');
}
if (byClass.COLLIDE.length) {
  console.error('🟡 COLLIDE：src_type∉{1,2,3} 且 src_id 命中表 → 会进横幅分支，弹「别的机制」的名字');
  for (const [k, v] of summarize(byClass.COLLIDE)) {
    console.log(`  ${String(k).padEnd(6)} ${String(nameOf(v.id) || '?').padEnd(14)} ×${v.where.length} ${v.where.join(', ')}`);
  }
  console.log('');
}
if (byClass.INFO.length) {
  log('ℹ INFO：src_type=3 且 src_id 命中表 —— 无害（showFeature:104 对 3 短路到 dealFeatureEff，',
    '永不进横幅分支；只是 id 空间撞号，注释里别误认作展示条目）');
  for (const [k, v] of summarize(byClass.INFO)) {
    log(`  ${String(k).padEnd(6)} ${String(nameOf(v.id) || '?').padEnd(14)} ×${String(v.where.length).padEnd(2)} ${v.where.join(', ')}`);
  }
  console.log('');
}
if (byClass.UNKNOWN.length) {
  const byRaw = new Map();
  for (const r of byClass.UNKNOWN) {
    if (!byRaw.has(r.raw)) byRaw.set(r.raw, { types: new Set(), where: [] });
    byRaw.get(r.raw).types.add(r.srcType);
    byRaw.get(r.raw).where.push(`${r.file}:${r.line}`);
  }
  log('⚪ UNKNOWN：src_id 是表达式（静态不可判）');
  for (const [raw, v] of byRaw) {
    log(`  ${raw.padEnd(40)} src_type=${[...v.types].join('/')} ×${v.where.length}`);
  }
  console.log('');
}

const hasError = byClass.ERROR.length > 0 || badEffectIds.length > 0;
const hasCollide = byClass.COLLIDE.length > 0;
if (process.argv.includes('--fail') && hasError) process.exit(1);
if (process.argv.includes('--strict') && (hasError || hasCollide)) process.exit(1);
