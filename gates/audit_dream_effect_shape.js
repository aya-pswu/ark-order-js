// 全 130 关动态形态扫描（银匙之门）：每关打到分出胜负，检查所有下发的
// 顶层 effect_list 是否满足不变量：
//   ① change_value 为空 ⇒ tar 必须为空（纯演出型不得携带目标）
//   ② change_value 非空 ⇒ 与 tar 等长，且全部是有限数值
//   ③ 所有 wire id < 4001（无内部 id 透传）
// 用法: node tools/bc_cmp/audit_dream_effect_shape.js [--verbose]
//
// 【出厂闸门】三百·续：「第四关/第六关打着打着报错卡死」的根因是服务端下发形态与客户端消费
// 契约不符。客户端 FeatureLoop 的 rage(200003)/HP(200000)/SKILL(200002) 分支**直接拿
// change_value[下标] 做算术**（DreamAngerSkillBar.onGUI 是 `slot1/200*80`），change_value 缺项即崩。
// 本闸门跑全 130 关实战，断言四条不变量：
//   ① change_value 为空 ⇒ tar 必须为空（纯演出型不得携带目标）
//   ② change_value 非空 ⇒ 与 tar 等长
//   ③ change_value 全为有限数值
//   ④ 所有 wire id < 4001（无内部 id 透传）
// 另统计「多值单目标」（ct=100000, tar=1, val>1）——客户端只取第 1 项，多值必须拆条。
// 故障注入：把 fight_core.sanitizeEffectTargets 改成恒等 → ① 必红；去掉 splitEffectByTarget
// 的 singleTarget 分支 → 多值单目标计数 > 0。
'use strict';
const state = require('../server/state');
const { S } = state;
state.saveState = () => {};

const L = require('../server/lib');
const { MAP_CONFIGS } = require('../server/data/map_configs');
const DM = require('../server/handlers/dream');
const prog = L.progressOf(1050400);
const bp = MAP_CONFIGS[1050400].bossPoint;
if (!prog.cleared.includes(bp)) prog.cleared.push(bp);

const verbose = process.argv.includes('--verbose');
const TYPES = [1331003, 1432003, 1033004, 1131003, 1246003, 1336015, 1442021, 1524006];

function makeServants(level) {
  S.servants = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
    id: i, type: TYPES[i - 1], level, star: 5, exp: 0, status: 0, status2: 0,
    chaos: [], learned_skills: [], energy_points: {}, cores: {},
    faiths: {}, faithTeams: {}, relic_gid: 0, skin_id: 0, using_skills: [],
  }));
}

const problems = [];
const stats = { rounds: 0, effects: 0, byType: {}, stages: 0, done: 0, stuck: [], pureFxHits: 0 };

for (let barrier = 1; barrier <= 130; barrier++) {
  // 等级给足，保证能推进；深层关卡敌人强，靠属性压制跑完
  makeServants(120);
  const s = DM.st();
  // COST：主队上限 38 / 替补 15。本档 7 只誓灵 cost 8~9 ⇒ 主队取 4 只（32），替补 1 只（8/7）
  s.embattle = { 1: 1, 2: 2, 3: 3, 4: 4, 10: 8 };
  s.isFight = 1;
  s.now = barrier;
  s.max = Math.max(s.max || 0, barrier);
  s.dailyLeft = 99;

  const sent = [];
  const conn = { sendToc: (n, o) => sent.push([n, o]) };
  DM.handlers.m_copy_fight_tos(conn, { copy_id: 11000000 + barrier });
  const ft = sent.find((x) => x[0] === 'm_copy_fight_toc');
  if (!ft) {
    const errToc = sent.find((x) => x[0] === 'm_common_error_toc');
    problems.push({ barrier, kind: 'copy_fight 无回包', detail: errToc ? 'code=' + errToc[1].code : '无 toc' });
    S.dreamFight = null;
    continue;
  }
  stats.stages++;
  DM.handlers.m_fight_servant_start_tos(conn, { fight_id: ft[1].fight_id });

  let finished = false;
  for (let r = 0; r < 40; r++) {
    const before = sent.length;
    DM.handlers.m_fight_skill_select_tos(conn, { fight_id: ft[1].fight_id, select_list: [] });
    stats.rounds++;
    for (const [n, o] of sent.slice(before)) {
      if (n !== 'm_fight_servant_fight_toc') continue;
      for (const e of (o.effect_list || [])) {
        stats.effects++;
        const ct = e.change_type;
        stats.byType[ct] = (stats.byType[ct] || 0) + 1;
        const nt = (e.tar_servant_ids || []).length;
        const nv = (e.change_value || []).length;
        // 记录纯演出型命中（用于验证 51 个产生点是否被真实触发过）
        if (nv === 0) stats.pureFxHits = (stats.pureFxHits || 0) + 1;
        if (nv === 0 && nt > 0) {
          problems.push({ barrier, round: r, kind: '空值带目标', detail: `ct=${ct} id=${e.id} tar=${nt} val=0` });
        }
        if (nv > 0 && nv !== nt) {
          problems.push({ barrier, round: r, kind: '长度不匹配', detail: `ct=${ct} id=${e.id} tar=${nt} val=${nv}` });
        }
        // 多值单目标：D9 拆条器不处理（只拆 values.length>1 且 tar 有多个时按值展开），
        // 客户端 change_value[下标] 只取第 1 个 ⇒ 其余静默丢失（功能性 bug，非崩溃）
        if (ct === 100000 && nt === 1 && nv > 1) {
          stats.multiValSingleTar = (stats.multiValSingleTar || 0) + 1;
          const key = 'id=' + e.id;
          stats.mvsList = stats.mvsList || {};
          stats.mvsList[key] = (stats.mvsList[key] || 0) + 1;
        }
        if ((e.change_value || []).some((v) => v != null && (typeof v !== 'number' || !isFinite(v)))) {
          problems.push({ barrier, round: r, kind: '非法数值', detail: `ct=${ct} id=${e.id} ${JSON.stringify(e.change_value)}` });
        }
        for (const t of [e.atk_servant_id, e.src_servant_id, ...(e.tar_servant_ids || [])]) {
          if (t != null && t > 4001) {
            problems.push({ barrier, round: r, kind: '内部id透传', detail: `ct=${ct} id=${e.id} id=${t}` });
          }
        }
      }
    }
    if (sent.slice(before).some((x) => x[0] === 'm_fight_scene_result_toc')) { finished = true; break; }
  }
  if (!finished) stats.stuck.push(barrier);
  stats.done++;
  S.dreamFight = null;
  if (verbose && barrier % 10 === 0) console.log(`  ...已扫到第 ${barrier} 关`);
}

console.log('\n================ 全 130 关形态扫描结果 ================');
console.log(`关卡副本建立成功: ${stats.stages}/130   完整打完: ${stats.done}   未在 40 回合内结束: ${stats.stuck.length}${stats.stuck.length ? '（' + stats.stuck.join(',') + '）' : ''}`);
console.log(`累计回合: ${stats.rounds}   累计 effect: ${stats.effects}`);
console.log('change_type 分布:', JSON.stringify(stats.byType));
console.log(`纯演出型 effect（change_value 为空）命中次数: ${stats.pureFxHits}（这些条目已被 sanitize 清空 tar，客户端不进气数值分支）`);
console.log(`多值单目标（ct=100000, tar=1, val>1，客户端只取第 1 项）: ${stats.multiValSingleTar || 0} 次`, stats.mvsList ? JSON.stringify(stats.mvsList) : '');
if (!problems.length) {
  console.log('\n✅ 零违规：所有 130 关的顶层 effect 均满足「空值⇔空tar / 非空等长 / 有限数值 / wire id<4001」');
} else {
  console.log(`\n❌ 发现 ${problems.length} 条违规：`);
  const byKind = {};
  for (const p of problems) (byKind[p.kind] = byKind[p.kind] || []).push(p);
  for (const [kind, list] of Object.entries(byKind)) {
    console.log(`\n--- ${kind}（${list.length}）---`);
    const stagesSeen = [...new Set(list.map((x) => x.barrier))];
    console.log(`  涉及关卡(${stagesSeen.length}): ${stagesSeen.slice(0, 30).join(',')}${stagesSeen.length > 30 ? ' …' : ''}`);
    for (const p of list.slice(0, 12)) console.log(`  关${p.barrier} r${p.round} ${p.detail}`);
  }
}
process.exit(problems.length ? 1 : 0);
