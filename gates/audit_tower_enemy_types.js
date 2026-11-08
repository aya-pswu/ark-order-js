// ①i 闸门：无限领域（塔）下发的敌方 type 必须存在于**真机客户端 CfgServant**。
//
// 背景（2026-11-05 真机实锤）：
//   `m_tower_barrier_detail_toc.monster = [{id:type, val:level}]` → 客户端
//   `TowerEnemyInfoVO.fillData` 第一件事就是 `ServantConfig.getFieldByTypeId(type, "talent")`。
//   该 type 不存在时它 `printError("不存在的誓灵ID：X")` 返回 nil → `getTalentVO(nil)` 也 nil →
//   下一行 `TalentVO:0: attempt to index a nil value`，整条 toc 抛错
//   （`toc协议报错：m_tower_barrier_detail_toc`）。玩家点"关卡信息/战斗结果"看到的就是崩溃。
//
//   当时的 `ENEMY_POOL` 写了 `1431012` —— 真机 CfgServant **没有**这个 type
//   （CfgServantSkin 也没有），且它第 4 位=1（水系）与所在行的「土」注释矛盾。
//   受影响层：18/23/28/48/53/58/78/83/88… 共 74 层。
//
// 数据源：`server/data/servant_types.js` 的 `VALID_SERVANT_TYPES`
//   —— 该表由 `tools/bc_cmp/CfgServant_ljd.lua`（真机字节码反编译）生成并已入库 336 条。
//   ⚠️ **不要**用 `tools/lua_src/CfgServant.lua`（滞后快照，只有 282 条，本次会把合法的
//   `1341033` 误判成非法），也不要在运行时反编译字节码（`tools/lua_sym/` 被 gitignore，
//   出包机/CI 上未必有）。
//
// 判据：枚举 `makeWave(1..MAX_FLOOR)` **实际会下发**的全部 type（不是只查 ENEMY_POOL 字面量，
//   这样将来改生成逻辑也拦得住），逐个过 `isValidServantType`。
//   `talent` 字段紧随其后被 `getTalentVO` 消费，但客户端对"有 type 无 talent"只会 Tips
//   （`天赋id有错`）不崩，故只报 WARN。
//
// 用法：
//   node tools/bc_cmp/audit_tower_enemy_types.js            # 报告
//   node tools/bc_cmp/audit_tower_enemy_types.js --fail     # 有违规退出 1（make.py ①i）
//   node tools/bc_cmp/audit_tower_enemy_types.js --selftest # 故障注入自检
'use strict';
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAX_FLOOR = 600; // 塔层数上限（更高层沿用同一池子；600 已覆盖全部 ENEMY_POOL 下标组合）

const FAIL_MODE = process.argv.includes('--fail');

const ST = require(path.join(ROOT, 'server', 'data', 'servant_types'));
const T = require(path.join(ROOT, 'server', 'data', 'tower_data'));

// 收集 [1..MAX_FLOOR] 实际下发的 type（含 bossSkinOf 的本体 type）
function collectTypes(maxFloor) {
  const types = new Map(); // type -> 首个出现的层
  for (let floor = 1; floor <= maxFloor; floor++) {
    for (const e of T.makeWave(floor)) {
      if (!types.has(e.type)) types.set(e.type, floor);
    }
  }
  return types;
}

function main() {
  const types = collectTypes(MAX_FLOOR);
  const bad = [...types.entries()].filter(([t]) => !ST.isValidServantType(t));

  console.log(`[①i] 无限领域敌方 type 闸门：${MAX_FLOOR} 层 / 实际下发 ${types.size} 种 type / `
    + `真机 CfgServant ${ST.VALID_SERVANT_TYPE_LIST.length} 条`);

  // bossSkinOf（面板 BOSS 展示皮肤）：不存在只影响模型，不崩 → WARN
  const bossMissing = new Set();
  for (let floor = 1; floor <= MAX_FLOOR; floor++) {
    const baseType = Math.floor(Number(T.bossSkinOf(floor)) / 100);
    if (!ST.isValidServantType(baseType)) bossMissing.add(baseType);
  }
  if (bossMissing.size) {
    console.log(`  WARN bossSkinOf 本体 type 不在账（${[...bossMissing].join(',')}）`
      + `——客户端只 setSkin 缺模型，不崩，不判失败`);
  }

  if (!bad.length) {
    console.log('  ✓ 全部敌方 type 都是真机 CfgServant 内的合法誓灵');
    return 0;
  }

  for (const [type, floor] of bad) {
    // 同属性（第 4 位）+ 同稀有度（第 5 位）的合法候选，直接给修复建议
    const s = String(type);
    const sameNature = ST.VALID_SERVANT_TYPE_LIST
      .filter(t => String(t).length === 7 && String(t)[3] === s[3] && String(t)[4] === s[4])
      .slice(0, 6);
    console.log(`  ✗ type=${type}（首次出现于第 ${floor} 层）不在真机 CfgServant`
      + `｜属性位=${s[3]} 稀有度位=${s[4]}`
      + `｜同属性同稀有度候选：${sameNature.join(', ') || '（无）'}`);
  }
  console.log(`  合计 ${bad.length} 个非法 type。修法：ENEMY_POOL 换成同属性（第 4 位）同稀有度（第 5 位）的合法 type。`);
  return FAIL_MODE ? 1 : 0;
}

// 故障注入自检：把「真机确认不存在」的 1431012 塞回池子，断言闸门能抓到。
function selfTest() {
  const orig = T.makeWave;
  T.makeWave = () => [{ type: 1431012, level: 1 }];
  let caught = false;
  try {
    for (const [t] of collectTypes(1)) {
      if (!ST.isValidServantType(t)) caught = true;
    }
  } finally {
    T.makeWave = orig;
  }
  // 对照组：换成合法 type 必须判为通过
  T.makeWave = () => [{ type: 1434017, level: 1 }];
  let falsePositive = false;
  try {
    for (const [t] of collectTypes(1)) {
      if (!ST.isValidServantType(t)) falsePositive = true;
    }
  } finally {
    T.makeWave = orig;
  }
  const ok = caught && !falsePositive;
  console.log(`  自检：注入 1431012 → ${caught ? '已抓到' : '未抓到'}；`
    + `注入合法 1434017 → ${falsePositive ? '误报' : '通过'}`);
  return ok ? 0 : 1;
}

if (process.argv.includes('--selftest')) process.exit(selfTest());
process.exit(main());
