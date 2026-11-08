// 指挥官（玩家）等级成长数据。
// 官方曲线已随停服不可考，客户端也无等级表（CfgRole 只有称号/buff，next_level_exp 纯服务端下发，
// GlobalData.isMaxLevel 硬编码满级 200）——本表为本地服数值基线（与 family/ark 基线同性质）。
// exp 语义 = 本级内进度（与 family_exp / 誓灵 exp 同口径）：客户端进度条 exp/next_level_exp。

const ROLE_MAX_LEVEL = 200;

// 从 level 升到 level+1 所需经验（本级内累计）
function needExpOf(level) {
  if (level >= ROLE_MAX_LEVEL) return 1; // 满级兜底：客户端 max(next,1) 防除零，isMaxLevel 时条恒满
  const d = level - 1;
  return 100 + 50 * d + 15 * d * d;
}

// 经验落账（纯函数）：可连升多级，满级丢弃溢出。
// 入参 level/exp 为当前值，gained 为本次获得；返回 {oldLevel, level, oldExp, exp, gained, leveledUp}
function applyRoleExp(level, exp, gained) {
  const oldLevel = level, oldExp = exp;
  let lv = Math.max(1, level || 1), e = Math.max(0, exp || 0);
  let remain = Math.floor(gained || 0);
  if (remain <= 0) return { oldLevel, level: lv, oldExp, exp: e, gained: 0, leveledUp: false };
  if (lv >= ROLE_MAX_LEVEL) return { oldLevel, level: lv, oldExp, exp: e, gained: 0, leveledUp: false };
  while (remain > 0 && lv < ROLE_MAX_LEVEL) {
    const need = needExpOf(lv);
    if (e + remain < need) { e += remain; remain = 0; }
    else {
      remain -= need - e;
      e = 0;
      lv++;
    }
  }
  if (lv >= ROLE_MAX_LEVEL) e = 0; // 满级清零（进度条走 isMaxLevel 分支恒满）
  return { oldLevel, level: lv, oldExp, exp: e, gained: Math.floor(gained), leveledUp: lv !== oldLevel };
}

// 主线战斗的指挥官经验：随章节难度递增 + 按击杀数加成
//（1-1 约 43、3 章 90~110、5 章 130+；全通 20 关约 lv10-11，刷本可继续缓升）
function battleRoleExp(copyId, kills) {
  const chapter = Math.floor((copyId || 1010100) / 10000) % 10; // 10<章>0<关>00 → 第 3 位
  return 25 + Math.max(0, chapter - 1) * 20 + Math.max(0, kills || 0) * 6;
}

module.exports = { ROLE_MAX_LEVEL, needExpOf, applyRoleExp, battleRoleExp };
