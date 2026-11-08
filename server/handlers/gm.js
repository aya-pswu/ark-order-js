// GM 执行器（2026-10-21 二百零二 / P1）
//
// 职责单一：把一条已注册的 GM 指令跑起来，并保证三件事——
//   ① 参数解析统一（parts 由调用方 split 好传进来，与旧 if 链同一口径）；
//   ② 异常隔离：单条指令抛错只影响它自己，返回 ✗ 回执而不是让连接挂掉；
//   ③ 回执统一带中文名（`✓ 增加积分：演武铸币 → 50001`）。
//
// 未注册的指令返回 null，由 `role.js` 回落到旧 if 链（`gmDispatch`）——这就是"绞杀者模式"：
// 新指令走注册表，老分支按需迁移，任何时刻都不存在"两边都能跑同一条"的歧义。
const { S, saveState } = require('../state');
const L = require('../lib');

function run(conn, cmd, parts, extraNames) {
  const REG = require('../data/gm_commands');
  const entry = REG[cmd];
  if (!entry) return null;
  const ctx = {
    conn, S, L, parts,
    log: L.log,
    save: () => saveState(),
    extraNames: extraNames || {},
    ok: (msg) => ({ ok: true, msg: `✓ ${entry.name}：${msg}`.slice(0, 400) }),
    fail: (msg) => ({ ok: false, msg: `✗ ${msg}`.slice(0, 400) }),
  };
  try {
    const r = entry.run(ctx, parts);
    if (r && typeof r === 'object') return r;
    return { ok: true, msg: `✓ ${entry.name}` };
  } catch (e) {
    L.log(`!! [GM] 注册表指令执行异常 ${cmd}：${e.message}`);
    return { ok: false, msg: `✗ ${entry.name} 执行异常\n${String(e.message).slice(0, 100)}` };
  }
}

module.exports = { run };
