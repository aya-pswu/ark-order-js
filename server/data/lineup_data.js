// 阵型（Lineup）配置——真机热更包 CfgCopy.arrays 反编译实证（tools/bc_cmp/CfgCopy_ljd.lua）。
// 客户端渲染与选择全在本地（ServantLineupView/ItemVO），服务端只管：
//   ① m_servant_lineup_info_toc 下发已解锁列表（list 元素 = 阵型id*10 + new 标记，CopyMgr.initLineUp 按此解包）
//   ② m_servant_lineup_touch_tos 消 new 标记；③ p_formation.lineup/positions 随编队下发；④ 战斗数值加成
// 每阵型 6 格站位开关（array，1=可站）；效果文案按"第 j 个启用格"绑定（ServantLineupItemVO.posArr_EffStr 同规则）：
// 站在启用格上的第 j 个誓灵获得 effect[j]。
const LINEUPS = [
  { id: 1, name: '突击阵型', unlock: 0, slots: [1, 3, 5], effects: ['技能伤害+3%', '技能伤害+3%', '技能恢复量+5%'] },
  { id: 2, name: '护卫阵型', unlock: 1010400, slots: [2, 4, 6], effects: ['队友免伤+3%', '克制伤害+5%', '技能伤害+3%'] },
  { id: 3, name: '侧翼阵A型', unlock: 1020400, slots: [1, 3, 4], effects: ['队友免伤+3%', '技能恢复量+5%', '技能伤害+6%'] },
  { id: 4, name: '侧翼阵B型', unlock: 1030400, slots: [1, 4, 6], effects: ['技能命中率+5%', '自身免伤+5%', '效果追加率+5%'] },
  { id: 5, name: '单纵阵型', unlock: 1040400, slots: [1, 2, 3], effects: ['技能伤害+5%', '克制伤害+8%', '技能伤害+5%'] },
  { id: 6, name: '单纵阵型改', unlock: 1050400, slots: [4, 5, 6], effects: ['技能回避率+4%', '技能回避率+4%', '技能回避率+4%'] },
];

// 阵型 → 可站格子表（CfgCopy.arrays[].array 中非 0 下标；编队默认站位/效果归属共用）
const LINEUP_POS = LINEUPS.reduce((m, l) => { m[l.id] = l.slots; return m; }, {});

// 效果文案 → 数值。简化战斗模型可落地三类：
// - 技能伤害/克制伤害 → 伤害倍率（模型无属性克制，克制伤害并入伤害倍率）
// - 自身免伤/队友免伤 → 受击减免（队友免伤：提供者的其他存活队友享受）
// - 技能回避率 → 受击概率闪避（hurt=0 + extra bit1=MISS，客户端 FightUtil.HasMissExtra 播闪避）
// 其余（技能恢复量/命中率/效果追加率）模型无治疗技能、敌方不闪避、无追加效果——解析保留数值但不参与战斗。
function parseEffect(str) {
  const m = /([+＋])([\d.]+)%/.exec(String(str).replace(/\s/g, ''));
  const val = m ? parseFloat(m[2]) / 100 : 0;
  const kind = /技能伤害|克制伤害/.test(str) ? 'dmg'
    : /自身免伤/.test(str) ? 'selfMit'
    : /队友免伤/.test(str) ? 'teamMit'
    : /技能回避率/.test(str) ? 'dodge'
    : /技能恢复量/.test(str) ? 'heal'
    : /技能命中率/.test(str) ? 'hit'
    : /效果追加率/.test(str) ? 'append'
    : null;
  return { kind, val };
}

// 站在 lineup 阵型 slot 格上的誓灵获得的战斗加成（不在启用格 → 无加成）
function effectOfSlot(lineup, slot) {
  const l = LINEUPS.find(x => x.id === Number(lineup)) || LINEUPS[0];
  const idx = l.slots.indexOf(Number(slot));
  if (idx < 0 || !l.effects[idx]) return null;
  const e = parseEffect(l.effects[idx]);
  const out = { dmg: 0, selfMit: 0, teamMit: 0, dodge: 0, heal: 0, hit: 0, append: 0, label: l.effects[idx] };
  if (e.kind) out[e.kind] = e.val;
  return out;
}

module.exports = { LINEUPS, LINEUP_POS, parseEffect, effectOfSlot };
