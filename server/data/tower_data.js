// 无尽冒险（Tower/无限领域）数据与设计值。
// 客户端硬口径来自 CfgTower（tools/bc_cmp/tower_CfgTower_ljd.lua）与 TowerModule/TowerMgr 反编译：
//   - 每周每关首次胜利扣 10 体力得结晶；胜利 10 关 +1 恢复（存量上限 3）；50/150/250/350/500 里程碑；
//   - 150/300/500 关敌人被"病毒感染"（额外被动）；队伍状态跨层冻结直到重新编队；
//   - copy_id = 8000000 + 层数（TowerInfoVO.gotoFight；getCopyType=indexNum(id,7,10)=8=TYPE_TOWER）。
// 敌方数值官方在服务端生成，客户端无表 → 等级/数量曲线按 wiki 数值锚定（见下），为设计值。
'use strict';
const FC = require('./fight_core');

const VIT_COST = 10;          // 每周每关首次胜利扣体力
const RECOVER_MAX = 3;        // 恢复次数存量上限
const RECOVER_EVERY = 10;     // 每胜利 N 关 +1 恢复
const AUTO_FIGHT_TIME = 30;   // CfgTower.autoFightTime：自动战斗每场 30 秒（客户端据此倒计时）
const CRYSTAL_ITEM = 20016002; // 结晶（明亮自然结晶，训练材料；20016000/1/2 档位）

// 里程碑（CfgTower.towerRewardArr 原样）
const MILESTONES = [
  { barrier: 50, rewards: [[21500069, 1], [30000003, 5000]] },
  { barrier: 150, rewards: [[21500070, 1], [20000902, 5]] },
  { barrier: 250, rewards: [[21500071, 1], [21104000, 1]] },
  { barrier: 350, rewards: [[21500072, 1], [31000004, 1]] },
  { barrier: 500, rewards: [[21500073, 1], [31000023, 3]] },
];

// 病毒感染阈值（150/300/500）：设计值 = 敌方全体攻击/防御 +15% 每档（客户端 buff 仅为文案展示）
const DEBUFF_TIERS = [150, 300, 500];

// 敌方等级曲线（wiki 锚点：1 关 25 级、53-57 关 51 级、143-147 关 69 级、495-499 关 105 级）
// 锚点差分：25→51 用了 26 关（+1/关），51→69 用 88 关（+0.2/关），69→105 用 348 关（+0.1/关）
// → 分三段线性；600 关后放缓（+0.1/关）封顶 200
function enemyLevelOf(floor) {
  let lv;
  if (floor <= 52) lv = 25 + Math.floor((floor - 1));
  else if (floor <= 140) lv = 51 + Math.floor((floor - 52) / 5);
  else if (floor <= 490) lv = 69 + Math.floor((floor - 140) / 10);
  else lv = 105 + Math.floor((floor - 490) / 10);
  return Math.min(200, lv);
}

// 敌方数量曲线（wiki：1-149 3只、150-299 4只、300-449 5只、450-499 6只、500+ 7只）
function enemyCountOf(floor) {
  if (floor < 150) return 3;
  if (floor < 300) return 4;
  if (floor < 450) return 5;
  if (floor < 500) return 6;
  return 7;
}

// 结晶奖励（wiki：1-140 明亮×2、141-280 明亮×3、281-490 闪耀×3、491+ 明亮×4；属性随机）
const CRYSTAL_BRIGHT = [20010001, 20011001, 20012001, 20013001, 20014001, 20015001, 20016001];
const CRYSTAL_SHINE = [20010002, 20011002, 20012002, 20013002, 20014002, 20015002, 20016002];
function crystalRewardOf(floor, rng) {
  const r = rng || Math.random;
  let pool = CRYSTAL_BRIGHT, num = 2;
  if (floor > 140 && floor <= 280) num = 3;
  else if (floor > 280 && floor <= 490) { pool = CRYSTAL_SHINE; num = 3; }
  else if (floor > 490) num = 4;
  const id = pool[Math.floor(r() * pool.length) % pool.length];
  return { id, num };
}

// 敌方阵容（设计值）：属性轮转 + 每 10 关 BOSS 层（全部同名精英+1 级）。
//
// ⚠️ 池子里每个 type 都必须是**真机 CfgServant 里存在的誓灵 type**：
// `m_tower_barrier_detail_toc.monster` 下发的是 `{id:type, val:level}`，客户端
// `TowerEnemyInfoVO.fillData` 立刻 `ServantConfig.getFieldByTypeId(type, "talent")`——
// 不存在就 `printError("不存在的誓灵ID：X")` 返回 nil ⇒ `getTalentVO(nil)` 返回 nil ⇒
// 下一行 `TalentVO:0: attempt to index a nil value`（`toc协议报错: m_tower_barrier_detail_toc`）。
// 2026-11-05 真机实锤：原第 4 行写了 `1431012`（真机 CfgServant **没有**这个 type，
// 连 CfgServantSkin 也没有；且它第 4 位=1 是水系，本来就与"土"那行注释矛盾），
// 让 18/23/28/48/53/58… 共 74 层点"关卡信息"必崩。
// 构建期闸门：`make.py ①i`（`node tools/audit_tower_enemy_types.js`）比对真机 CfgServant。
// 替换项按「同 143 段 + 土系（第 4 位 4）+ N/R 稀有度（第 5 位 0/1）」选取。
const ENEMY_POOL = [
  1015007, 1421005, 1331003, 1042001, 1116008,          // 水/暗/火/水/土 混编
  1331006, 1332013, 1432003, 1043006, 1242006,          // 火
  1036010, 1136017, 1336015, 1436004, 1446036,          // 风/暗
  1134010, 1434017, 1233011, 1331031, 1344028,          // 土（1434017 喀戎：原 1431012 不存在，2026-11-05 换）
  1415020, 1316019, 1445027, 1341033, 1141034,          // 光
  1126002, 1226002, 1426010, 1626006, 1126011,          // 暗
];
// 敌方站位（主线 map_fight 同款：右半场 x=2..3、y=-1..1；7 敌补第 4 列 [4,0]）。
// 客户端按 brief_pos 符号分边（x>0=右），站位出界会渲染成"飘在场外"
const ENEMY_TILES = {
  1: [[2, 0]],
  2: [[2, -1], [2, 1]],
  3: [[2, -1], [2, 1], [3, 0]],
  4: [[2, -1], [2, 1], [3, 0], [3, 1]],
  5: [[2, -1], [2, 0], [2, 1], [3, -1], [3, 1]],
  6: [[2, -1], [2, 0], [2, 1], [3, -1], [3, 0], [3, 1]],
  7: [[2, -1], [2, 0], [2, 1], [3, -1], [3, 0], [3, 1], [4, 0]],
};
function makeWave(floor) {
  const lv = enemyLevelOf(floor);
  const count = enemyCountOf(floor);
  const bossFloor = floor % 10 === 0;
  const scale = 1 + DEBUFF_TIERS.filter(t => floor >= t).length * 0.15; // 病毒感染档：敌方数值 +15%/档
  const tiles = ENEMY_TILES[count] || ENEMY_TILES[3];
  const wave = [];
  for (let i = 0; i < count; i++) {
    const type = ENEMY_POOL[(floor * 7 + i * 5) % ENEMY_POOL.length];
    wave.push({
      type,
      level: bossFloor ? lv + 1 : lv,
      scale,
      boss: bossFloor,
      pos: tiles[i].slice(), // 敌方 x 正区（右半场）
    });
  }
  return wave;
}

// 结晶奖励预览（info.item）：按当前层的档位给一个代表性结晶
function crystalPreviewOf(floor) {
  let pool = CRYSTAL_BRIGHT, num = 2;
  if (floor > 140 && floor <= 280) num = 3;
  else if (floor > 280 && floor <= 490) { pool = CRYSTAL_SHINE; num = 3; }
  else if (floor > 490) num = 4;
  return { id: pool[floor % pool.length], num };
}

// 面板 BOSS 展示皮肤（monster 字段）：每 10 关轮换一个种族值表内皮肤
const BOSS_SKINS = [133100301, 104200101, 143200301, 134601601, 114602301, 133100301];
function bossSkinOf(floor) {
  return BOSS_SKINS[Math.floor(floor / 10) % BOSS_SKINS.length];
}

// ─────────────────────────────────────────────────────────────────────────────
// 塔 buff（每周词条）：condition（队伍满足条件）+ expression（达成的团队效果）
//
// 客户端事实（tools/bc_cmp/tower_* 与 lua_remote/src/Modules/tower/TowerBuffVO.lua 反编译）：
//   · TowerMgr.initTowerBuffVOArr 固定建 **3 个** TowerBuffVO（for i=1,3），
//     updateTowerBuffVOArr(toc.buff) 按下标喂 `vo:updateBuff(buff[i])`——
//     **buff 少于 3 项 → updateBuff(nil) → "TowerBuffVO:0: attempt to index a nil value"**（本次崩溃点）。
//   · TowerBuffVO.updateBuff 直接读 slot1.condition_id / effect_id / is_active / servant_ids；
//     Condition/Expression 再拿 condition_id / effect_id 去 `CfgTower.BuffCondition[i]` /
//     `BuffExpression[i]` 取表（都是 1-based 数组）→ **0 或越界同样取到 nil 崩**。
//   · servant_ids 是"本队中满足该条件的誓灵实例 id"（CheckCount 用它列名字），
//     is_active=1 表示服务端判定已达成（CharacterCount 分支不再本地重算）。
//
// 数据结构照抄客户端 CfgTower.BuffCondition（21 条）/ BuffExpression（24 条，见 tools/bc_cmp/CfgTower_ljd.lua）。
// ─────────────────────────────────────────────────────────────────────────────
const BUFF_NUM = 3;                  // 面板 buff 槽数（TowerConst 未定义，写死 TowerMgr）
const SKILL_TYPE_ASSIST = 3;         // GameConst.SKILL_TYPE_ASSIST
const colorOf = type => Math.floor(Number(type) / 10000) % 10;

// conditionid → 判定（下标即 condition_id，必须与客户端表逐条对齐）
const BUFF_CONDITIONS = [
  null,
  { kind: 'nature', limit: 1, count: 4 },                            // 1  上阵水系誓灵 4 个
  { kind: 'nature', limit: 2, count: 4 },                            // 2  火
  { kind: 'nature', limit: 3, count: 4 },                            // 3  风
  { kind: 'nature', limit: 4, count: 4 },                            // 4  土
  { kind: 'nature', limit: 5, count: 4 },                            // 5  光
  { kind: 'nature', limit: 6, count: 4 },                            // 6  暗
  { kind: 'color', limit: 1, count: 4 },                             // 7  上阵 N 稀有度 4 个
  { kind: 'color', limit: 2, count: 3 },                             // 8  R 3 个
  { kind: 'color', limit: 3, count: 4 },                             // 9  SR 4 个
  { kind: 'levelAbove', limit: 80, count: 8 },                       // 10 上阵大于 80 级 8 个
  { kind: 'skillNature', limit: 1, count: 10 },                      // 11 携带水系技能 10 个
  { kind: 'skillNature', limit: 2, count: 10 },                      // 12 火
  { kind: 'skillNature', limit: 3, count: 10 },                      // 13 风
  { kind: 'skillNature', limit: 4, count: 10 },                      // 14 土
  { kind: 'skillNature', limit: 5, count: 10 },                      // 15 光
  { kind: 'skillNature', limit: 6, count: 10 },                      // 16 暗
  { kind: 'powerAbove', prop: 'phy_atk', limit: 900, count: 3 },     // 17 物攻 > 900 的 3 个
  { kind: 'powerAbove', prop: 'mag_atk', limit: 900, count: 3 },     // 18 魔攻 > 900 的 3 个
  { kind: 'powerAbove', prop: 'phy_def', limit: 800, count: 2 },     // 19 物防 > 800 的 2 个
  { kind: 'powerAbove', prop: 'mag_def', limit: 800, count: 2 },     // 20 魔防 > 800 的 2 个
  { kind: 'skillType', limit: SKILL_TYPE_ASSIST, count: 5 },         // 21 携带辅助技能 5 个
];

// expressionid → 效果（下标即 effect_id）
const BUFF_EXPRESSIONS = [
  null,
  { kind: 'natDmg', nature: 1, pct: 0.30 },                          // 1  水属性技能伤害 +30%
  { kind: 'natDmg', nature: 2, pct: 0.30 },                          // 2  火
  { kind: 'natDmg', nature: 3, pct: 0.30 },                          // 3  风
  { kind: 'natDmg', nature: 4, pct: 0.30 },                          // 4  土
  { kind: 'natDmg', nature: 5, pct: 0.30 },                          // 5  光
  { kind: 'natDmg', nature: 6, pct: 0.30 },                          // 6  暗
  { kind: 'dmg', pct: 0.25 },                                        // 7  技能伤害 +25%
  { kind: 'regen', pct: 0.05 },                                      // 8  每回合自动恢复 5% 血量
  { kind: 'atkLv', prop: 'phy_atk', lv: 1 },                         // 9  开场物攻等级 +1
  { kind: 'atkLv', prop: 'mag_atk', lv: 1 },                         // 10 开场魔攻等级 +1
  { kind: 'natWeek', nature: 1, pct: 0.40 },                         // 11 水系技能克制伤害 +40%
  { kind: 'natWeek', nature: 2, pct: 0.40 },                         // 12 火
  { kind: 'natWeek', nature: 3, pct: 0.40 },                         // 13 风
  { kind: 'natWeek', nature: 4, pct: 0.40 },                         // 14 土
  { kind: 'natWeek', nature: 5, pct: 0.40 },                         // 15 光
  { kind: 'natWeek', nature: 6, pct: 0.40 },                         // 16 暗
  { kind: 'shield', pct: 0.20 },                                     // 17 开场获得 20% 血护盾
  { kind: 'mit', pct: 0.20 },                                        // 18 降低受到的伤害 20%
  { kind: 'lifesteal', pct: 0.08 },                                  // 19 造成伤害时恢复伤害值 8%
  { kind: 'critDmg', pct: 0.50 },                                    // 20 暴击伤害 +50%
  { kind: 'atkMul', prop: 'phy_atk', pct: 0.30 },                    // 21 物攻 +30%
  { kind: 'atkMul', prop: 'mag_atk', pct: 0.30 },                    // 22 魔攻 +30%
  { kind: 'weekDmg', pct: 0.30 },                                    // 23 克制伤害 +30%
  { kind: 'antiWeek', pct: 0.20 },                                   // 24 被克制伤害 -20%
];

const BUFF_CONDITION_IDS = BUFF_CONDITIONS.map((c, i) => (c ? i : 0)).filter(Boolean);
const BUFF_EXPRESSION_IDS = BUFF_EXPRESSIONS.map((e, i) => (e ? i : 0)).filter(Boolean);

// 抽 3 组「条件 + 效果」（条件与效果各自不重复，避免三条一样的词条）
function rollBuffs(rng) {
  const r = rng || Math.random;
  const pick = (arr, n) => {
    const pool = arr.slice(), out = [];
    while (out.length < n && pool.length) out.push(pool.splice(Math.floor(r() * pool.length) % pool.length, 1)[0]);
    return out;
  };
  const conds = pick(BUFF_CONDITION_IDS, BUFF_NUM);
  const effs = pick(BUFF_EXPRESSION_IDS, BUFF_NUM);
  return conds.map((condition_id, i) => ({ condition_id, effect_id: effs[i] || 1 }));
}

// 队伍成员快照（tower.js 组装）：{id, type, level, star}
//
// ⚠️ 口径必须与塔战引擎**完全相同**（2026-11-05 修，本条原注释"与引擎同源"已过期）：
//   · 技能 —— 引擎 mkUnit 用 `buildUsingPool(type, using_skills, learned_skills)`（**装备 3 槽**
//     + 三百零二的空攻池补技），不是 `buildSkillPool`（全技能书）。原实现数技能书会把
//     condition 11~16（携×系技能 N 个）/ 21（携辅助技能 5 个）判成"几乎恒真"，
//     而实战按装备槽数经常不满 ⇒ 面板说生效、实战没生效。
//   · 属性 —— 引擎用 `CH.normalAttrsOf(servant, extra)`（含装备核心/圣器/信仰），
//     原实现用 `calcAttrs(type, level, ..., {})`（**裸属性**）⇒ condition 17~20 的
//     800/900 门槛在"裸属性 662 / 含装备 800+" 的誓灵上会判反。
// 因此优先吃调用方注入的 `m.skills` / `m.attrs`（tower.js teamMembers 按引擎同口径算好）；
// 只在缺失时用裸属性近似回落（仅供离线冒烟/无 S 上下文的调用）。
function memberStats(m) {
  const level = Math.max(1, Number(m.level) || 1);
  if (Array.isArray(m.skills) && m.attrs) {
    return { id: m.id, skills: m.skills, attrs: m.attrs };
  }
  return {
    id: m.id,
    skills: Array.isArray(m.skills) ? m.skills : FC.buildSkillPool(m.type, level, null),
    attrs: m.attrs || FC.calcAttrs(m.type, level, null, 0, {}, FC.stepOfStar(m.star)),
  };
}

// 判定单条 buff → { is_active, servant_ids, hit }
// servant_ids 的语义 = **队伍槽位号（1..12）**，不是誓灵实例 id：
//   客户端 TowerBuffVO.CheckCount 拿它逐个喂 `TowerMgr.getTowerTeambyId(id)`，而
//   `TowerTeamVO.towerId` 来自 `p_tower_servant.id`（= 槽位号）。发实例 id 会全部查不到
//   ⇒ 名字列表恒「无」（截图里「[当前符合誓灵] 无」就是这个）。
//   hit（每个槽位命中的技能个数）用于调用方汇总/调试，不参与 is_active 计算之外的语义。
function evalBuff(condId, rawMembers) {
  const c = BUFF_CONDITIONS[Number(condId)];
  const members = rawMembers || [];
  if (!c) return { servant_ids: [], is_active: 0, hit: 0 };
  let total = 0;
  const servant_ids = [];
  const slotOf = m => Number(m.slot) || 0;
  for (const src of members) {
    const st = memberStats(src);
    let hit = 0;
    switch (c.kind) {
      case 'nature': hit = FC.natureOf(src.type) === c.limit ? 1 : 0; break;
      case 'color': hit = colorOf(src.type) === c.limit ? 1 : 0; break;
      case 'levelAbove': hit = Number(src.level) > c.limit ? 1 : 0; break;
      case 'powerAbove': hit = Number(st.attrs[c.prop]) > c.limit ? 1 : 0; break;
      // 技能类按"技能个数"计数（客户端 CheckAchieve 内层计数），命中的誓灵同样进 servant_ids
      case 'skillNature':
        hit = st.skills.filter(id => Number((FC.skillCfg(id) || {}).nature) === c.limit).length;
        break;
      case 'skillType':
        hit = st.skills.filter(id => Number((FC.skillCfg(id) || {}).type) === c.limit).length;
        break;
      default: break;
    }
    if (hit > 0) {
      total += hit;
      const slot = slotOf(src);
      if (slot > 0) servant_ids.push(slot);
      else servant_ids.push(src.id); // 无 slot 的调用方（离线冒烟）回落实例 id
    }
  }
  return { servant_ids, is_active: total >= c.count ? 1 : 0, hit: total };
}

// 能力等级 → 乘区（客户端 Servant_ljd.lua 的等级换算：(2+min(6,lv))/2，+1 级 = ×1.5）
const lvRate = lv => (lv >= 0 ? (2 + Math.min(6, lv)) / 2 : 2 / (2 + Math.min(6, -lv)));

// 已激活的效果 id → 战斗 Modifier（tower_fight 建单位时套用到我方全体）
function modsOf(effectIds) {
  const m = {
    dmgMul: 0, selfMit: 0, critAdd: 0, weekMul: 0, antiWeek: 0,
    regenPct: 0, lifestealPct: 0, shieldPct: 0,
    natMul: {}, natWeekMul: {}, atkMul: { phy_atk: 1, mag_atk: 1 },
  };
  for (const id of (effectIds || [])) {
    const e = BUFF_EXPRESSIONS[Number(id)];
    if (!e) continue;
    switch (e.kind) {
      case 'natDmg': m.natMul[e.nature] = (m.natMul[e.nature] || 0) + e.pct; break;
      case 'natWeek': m.natWeekMul[e.nature] = (m.natWeekMul[e.nature] || 0) + e.pct; break;
      case 'dmg': m.dmgMul += e.pct; break;
      case 'regen': m.regenPct += e.pct; break;
      case 'shield': m.shieldPct += e.pct; break;
      case 'mit': m.selfMit += e.pct; break;
      case 'lifesteal': m.lifestealPct += e.pct; break;
      case 'critDmg': m.critAdd += e.pct; break;
      case 'atkLv': m.atkMul[e.prop] *= lvRate(e.lv); break;
      case 'atkMul': m.atkMul[e.prop] *= (1 + e.pct); break;
      case 'weekDmg': m.weekMul += e.pct; break;
      case 'antiWeek': m.antiWeek += e.pct; break;
      default: break;
    }
  }
  m.selfMit = Math.min(0.9, m.selfMit);
  m.antiWeek = Math.min(0.9, m.antiWeek);
  return m;
}

const isTowerCopy = copyId => copyId >= 8000001 && copyId < 9000000;

module.exports = {
  VIT_COST, RECOVER_MAX, RECOVER_EVERY, AUTO_FIGHT_TIME, CRYSTAL_ITEM, MILESTONES, DEBUFF_TIERS,
  enemyLevelOf, enemyCountOf, crystalRewardOf, makeWave, crystalPreviewOf, bossSkinOf,
  isTowerCopy, FC,
  // buff（每周词条）
  BUFF_NUM, BUFF_CONDITIONS, BUFF_EXPRESSIONS, BUFF_CONDITION_IDS, BUFF_EXPRESSION_IDS,
  rollBuffs, evalBuff, modsOf, lvRate, colorOf, SKILL_TYPE_ASSIST,
};
