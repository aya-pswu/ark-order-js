// 圣器 / 能力核心配置（客户端 CfgItems.lua + CfgRelic.lua 快照）
// 类型规则（ItemConst.isRelic/isCore → BagConfig）：typeId 第 7-8 位（十进制，右起）：
//   10~18 = 圣器（不可堆叠，每誓灵最多携带 1 个）
//   19    = 能力核心（不可堆叠，第 6 位 = 属性码 1-6，每属性槽 1 个）
// 属性码（GameConst.BASE_PROP_CODE_*）：1生命 2物攻 3魔攻 4物防 5魔防 6速度
const fs = require('fs');
const path = require('path');

// typeId → { kind: 'relic'|'core', color, propCode(核心) }
// 从 CfgItems.lua 提取（color 用配置值，别用末位数字猜：19100000 color=2、19100003 color=5）
const RELIC_CORE_TYPES = (() => {
  const map = {};
  try {
    const txt = fs.readFileSync(path.join(__dirname, '..', '..', 'tools', 'lua_src', 'CfgItems.lua'), 'utf8');
    const re = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\n\s*\}/g;
    let m;
    while ((m = re.exec(txt))) {
      const typeId = parseInt(m[1]);
      const d78 = Math.floor(typeId / 1000000) % 100;
      if (d78 < 10 || d78 > 19) continue;
      const colorM = m[2].match(/color\s*=\s*(\d+)/);
      const nameM = m[2].match(/name\s*=\s*"([^"]*)"/);
      map[typeId] = {
        kind: d78 === 19 ? 'core' : 'relic',
        color: colorM ? parseInt(colorM[1]) : 2,
        propCode: d78 === 19 ? Math.floor(typeId / 100000) % 10 : 0,
        name: nameM ? nameM[1] : '',
      };
    }
  } catch (e) { /* 宽松模式：缺配置时按类型规则兜底 */ }
  return map;
})();

function infoOfType(typeId) {
  const t = Number(typeId) || 0;
  const d78 = Math.floor(t / 1000000) % 100;
  if (RELIC_CORE_TYPES[t]) return RELIC_CORE_TYPES[t];
  if (d78 >= 10 && d78 <= 18) return { kind: 'relic', color: 2, propCode: 0, name: '' };
  if (d78 === 19) return { kind: 'core', color: 2, propCode: Math.floor(t / 100000) % 10, name: '' };
  return null;
}
const isRelicType = t => { const i = infoOfType(t); return i && i.kind === 'relic'; };
const isCoreType = t => { const i = infoOfType(t); return i && i.kind === 'core'; };

// ---- CfgRelic.propRelic 快照（升到 Lv=n 的消耗 / 按颜色的等级上限与分解产物）----
// needExp 恒 1：核心"经验"就是等级数（客户端 CoreItemVO.setAllExp 直接 level=allExp）
const LV_MAX = [0, 0, 5, 8, 11, 15];          // color 2→5 3→8 4→11 5→15（lua 1-based 转过来）
const ENCHANT = require('./chaos_enchant_config.json').enchant;
const ENCHANT_PROPS = [17, 18, 19, 20, 21];
function colorOf(g) { return Number((infoOfType(g && g.type_id) || {}).color) || 0; }
function enchantConfigOf(g) { return g && isRelicType(g.type_id) ? ENCHANT[colorOf(g)] || null : null; }
function normalizeEnchant(g) {
  if (!g || !isRelicType(g.type_id)) return g;
  const lv = {};
  for (const p of ENCHANT_PROPS) { const n = Number(g.enchant_levels && g.enchant_levels[p]); lv[p] = Number.isSafeInteger(n) ? Math.max(0, Math.min(5, n)) : 0; }
  g.enchant_levels = lv; g.enchant_type = ENCHANT_PROPS.includes(Number(g.enchant_type)) ? Number(g.enchant_type) : 0; return g;
}
function enchantInfoOf(g) {
  if (!g || !isRelicType(g.type_id)) return null;
  normalizeEnchant(g);
  return { relic_id: g.id, cur_enchant_type: g.enchant_type, enchant_level_list: ENCHANT_PROPS.map(id => ({ id, val: g.enchant_levels[id] })) };
}
function enchantBonusOf(g) {
  if (!g || !isRelicType(g.type_id)) return { type: 0, level: 0, percent: 0 };
  normalizeEnchant(g);
  const c = enchantConfigOf(g), p = Number(g.enchant_type), lv = g.enchant_levels[p] || 0;
  return { type: p, level: lv, percent: c && c.percent[lv] || 0 };
}
function applyEnchant(attrs, g, base) {
  const b = enchantBonusOf(g);
  if (!b.type || !b.percent) return attrs;
  const src = base || attrs;
  const key = { 17: 'phy_atk', 18: 'mag_atk', 19: 'phy_def', 20: 'mag_def', 21: 'speed' }[b.type];
  if (key) attrs[key] = Math.ceil(attrs[key] + src[key] * b.percent / 100);
  return attrs;
}
const UPGRADE_ITEMS = {                        // 升到目标等级：材料 id→数量（银币 30000003 num=0 免费）
  2: { 27000000: 10 }, 3: { 27000000: 15 }, 4: { 27000000: 20 }, 5: { 27000000: 25 },
  6: { 27000001: 10 }, 7: { 27000001: 15 }, 8: { 27000001: 20 }, 9: { 27000001: 25 }, 10: { 27000001: 30 },
  11: { 27000002: 10 }, 12: { 27000002: 15 }, 13: { 27000002: 20 }, 14: { 27000002: 25 }, 15: { 27000002: 30 },
};
const DECOMPOSE_ITEM = {                       // 按颜色分解产物
  2: { 27000000: 1 }, 3: { 27000001: 1 }, 4: { 27000002: 1 }, 5: { 27000002: 5 },
};
const coreMaxLevel = color => LV_MAX[Number(color)] || LV_MAX[2];
const upgradeCost = targetLv => UPGRADE_ITEMS[Number(targetLv)] || {};
const decomposeItems = color => DECOMPOSE_ITEM[Number(color)] || {};

// ---- 装备加成（照抄客户端 CoreItemVO.propAdd，服务端战斗属性用同一公式保证面板=实战）----
// 已装备：生命 ceil(max(核心等级*誓灵等级/5, 核心等级))，其余属性 /10
// 核心属性名：1生命 2狂野(物攻) 3智慧(魔攻) 4强固(物防) 5精神(魔防) 6疾风(速度)
const PROP_KEYS = { 1: 'hp', 2: 'phy_atk', 3: 'mag_atk', 4: 'phy_def', 5: 'mag_def', 6: 'speed' };
function coreBonusOf(goods, servantLevel) {
  const lv = Number(goods && goods.level) || 1;
  const info = infoOfType(goods && goods.type_id);
  const propCode = info ? info.propCode : 0;
  if (!PROP_KEYS[propCode]) return null;
  const div = propCode === 1 ? 5 : 10;
  const add = Math.ceil(Math.max(lv * (Number(servantLevel) || 1) / div, lv));
  return { propCode, key: PROP_KEYS[propCode], add };
}

// 汇总一只誓灵全部已装备核心的加成 { hp, phy_atk, mag_atk, phy_def, mag_def, speed }（未装备项为 0）
function equipBonusOf(servant, bagGoods) {
  const bonus = { hp: 0, phy_atk: 0, mag_atk: 0, phy_def: 0, mag_def: 0, speed: 0 };
  const cores = (servant && servant.cores) || {};
  for (const gid of Object.values(cores)) {
    const g = (bagGoods || []).find(x => Number(x.id) === Number(gid));
    if (!g) continue;
    const b = coreBonusOf(g, servant.level);
    if (b) bonus[b.key] += b.add;
  }
  return bonus;
}

// ---- 圣器战斗词条规则库（源于 CfgItems.lua 官方配表描述）----
const RELIC_COMBAT_MODS = {
  // 「被克制后属性提升」族（CfgItems desc「受到克制伤害后，X上升N级」）。
  // onHurtByWeek：受击方在结算到 WEEK 关系伤害后，把自己的某项属性等级 +N。
  //   prop 用战斗属性码（101物攻 102魔攻 105速度），feature 是客户端 FightFeature.lua 的官方飘字 ID：
  //   30851 复仇之刃 / 30861 佛拉格拉克 / 30871 轰击之枪 / 30881 布里欧纳克 / 30891 勇者的战车 / 30901 太阳神的战车
  12003001: { onHurtByWeek: { prop: 101, delta: 1, feature: 30851 } }, // 复仇之刃
  12003002: { onHurtByWeek: { prop: 101, delta: 2, feature: 30861 } }, // 佛拉格拉克
  12004001: { onHurtByWeek: { prop: 102, delta: 1, feature: 30871 } }, // 轰击之枪
  12004002: { onHurtByWeek: { prop: 102, delta: 2, feature: 30881 } }, // 布里欧纳克
  14002003: { onHurtByWeek: { prop: 105, delta: 1, feature: 30891 } }, // 勇者的战车
  14002004: { onHurtByWeek: { prop: 105, delta: 2, feature: 30901 } }, // 太阳神的战车

  // 「濒死保命」族：受到技能伤害使生命归零时按概率留 1HP（CfgItems desc「有N%几率留下1HP」）。
  // 每场战斗每次受击独立判定（官方没有"一场一次"限制，与生命之符不同）。
  // 飘字用客户端官方条目：30491/30501/30511/30521（气息之石Lv1/2/3、命运之石 →「#tar保留了1点生命」）。
  12002001: { deathSaveChance: 0.06, deathSaveFeature: 30491 }, // 气息之石Lv1
  12002002: { deathSaveChance: 0.10, deathSaveFeature: 30501 }, // 气息之石Lv2
  12002003: { deathSaveChance: 0.14, deathSaveFeature: 30511 }, // 气息之石Lv3
  12002004: { deathSaveChance: 0.20, deathSaveFeature: 30521 }, // 命运之石

  // 「低血回血」族：生命值低于阈值时回一次血，一场战斗仅一次（CfgItems desc「一次战斗仅能生效一次」）。
  // 官方在己方回血类特性里没有专属 tips 条目，复用治疗展示特性 30531（回复的甘露，act=20015 回血动画）。
  16005001: { lowHpHeal: { threshold: 0.60, pct: 16, onceKey: 'ankh' } }, // 生命之符Lv1
  16005002: { lowHpHeal: { threshold: 0.60, pct: 19, onceKey: 'ankh' } }, // 生命之符Lv2
  16005003: { lowHpHeal: { threshold: 0.60, pct: 22, onceKey: 'ankh' } }, // 生命之符Lv3
  16005004: { lowHpHeal: { threshold: 0.60, pct: 25, onceKey: 'ankh' } }, // 安卡之符
  17021004: { lowHpHeal: { threshold: 0.50, pct: 30, onceKey: 'dango' }, specialNagisaHealMul: 1.0 }, // 团子：低于50%回30%一场一次；古河渚专属：自身回复量翻倍

  // 「防御/命中」族：
  //   defPct / mdefPct  → 进场时直接乘到对应防御（CfgItems「物防/魔防提升N%」）
  //   dodgeBonus        → 作为被瞄准目标时，命中率额外降低 N（「以其为目标的技能，命中率降低N%」）
  //   hitBonus          → 自身攻击技能命中率 +N（「攻击技能的命中率提升N%」）
  // 注意 dodgeBonus 是**加性百分点**，与引擎的 dodge 字段（0~1 概率）不同，用独立字段避免混用。
  11001001: { defPct: 0.05, mdefPct: 0.05, rOnly: true }, // 守护者之衣Lv1（R 及以下）
  11001002: { defPct: 0.09, mdefPct: 0.09, rOnly: true }, // 守护者之衣Lv2
  11001003: { defPct: 0.14, mdefPct: 0.14, rOnly: true }, // 守护者之衣Lv3
  11001004: { defPct: 0.20, mdefPct: 0.20, rOnly: true }, // 圣袍
  14003001: { defPct: 0.07, attackOnly: true }, // 突击盾-力Lv1（物防+7%，只能使用攻击技能）
  14003002: { defPct: 0.12, attackOnly: true }, // 突击盾-力Lv2
  14003003: { defPct: 0.17, attackOnly: true }, // 突击盾-力Lv3
  14003004: { defPct: 0.23, attackOnly: true }, // 埃癸斯-雅典娜
  14004001: { mdefPct: 0.07, attackOnly: true }, // 突击盾-智Lv1（魔防+7%）
  14004002: { mdefPct: 0.12, attackOnly: true }, // 突击盾-智Lv2
  14004003: { mdefPct: 0.17, attackOnly: true }, // 突击盾-智Lv3
  14004004: { mdefPct: 0.23, attackOnly: true }, // 埃癸斯-宙斯
  14001001: { dodgeBonus: 3 },  // 幻象帽Lv1
  14001002: { dodgeBonus: 5 },  // 幻象帽Lv2
  14001003: { dodgeBonus: 7 },  // 幻象帽Lv3
  14001004: { dodgeBonus: 10 }, // 隐身帽
  16000004: { hitBonus: 10 },   // 乌加特之眼

  // 「伤害乘区」族（CfgItems 各类「造成伤害提升N%」）。
  //   dmgMul        → 通用增伤（对所有技能）
  //   soundDmgMul   → 声音类技能增伤
  //   aoeDmgMul     → 群体技能增伤
  //   singlePhyMul  → 物理单体技能增伤
  //   natureDmgMul  → {属性码: 增伤}
  //   groupSkillDmg → 群体技能增伤（王者之冠族，与 aoeDmgMul 同义，保留各自入表便于对照 desc）
  13005004: { dmgMul: 0.15, vsPositiveStats: true },  // 十拳剑：攻击能力等级总和为正的目标
  16004001: { aoeDmgMul: 0.03 }, // 王者之冠Lv1
  16004002: { aoeDmgMul: 0.05 }, // 王者之冠Lv2
  16004003: { aoeDmgMul: 0.07 }, // 王者之冠Lv3
  16004004: { aoeDmgMul: 0.10 }, // 亚提夫王冠
  17000004: { soundDmgMul: 0.05, lifesteal: 0.12 },   // 天钿：声音+5% / 吸血12%
  17001004: { soundDmgMul: 0.05, hurtRandomStatUp: 1 }, // 释天：声音+5% / 受击随机能力+1
  17003004: { singlePhyMul: 0.10, specialTookaRepeatMul: 0.10 },       // 鏖杀公：物理单体+10%；十香专属：连续攻击同一单位 +10%
  17004004: { aoeDmgMul: 0.10, specialOrigamiWeekPer: 1.95 },          // 绝灭天使：群体+10%；折纸专属：克制倍率 1.75→1.95
  17034004: { dmgMul: 0.07, lifesteal: 0.05, specialSyaroOverflowShield: true }, // 理世特调咖啡：增伤7% + 吸血5%；纱路专属：溢出回复转护盾
  17038004: { natureDmgMul: { 2: 0.08 }, takenNatureMit: { 2: 0.05 }, specialDuckVsAbnormal: 0.03 }, // 北京烤鸭：火伤+8%，受火伤-5%；携带者(北京烤鸭)专属：对中毒/烧伤目标 +3%
  18003001: { dmgMul: 0.10, roundSelfDamage: 0.10 },   // 毁灭之戟Lv1：增伤10% / 回合末自伤10%
  18003002: { dmgMul: 0.12, roundSelfDamage: 0.10 },   // 毁灭之戟Lv2
  18003003: { dmgMul: 0.15, roundSelfDamage: 0.10 },   // 毁灭之戟Lv3
  18003004: { dmgMul: 0.20, roundSelfDamage: 0.10 },   // 阿贾伽瓦
  18002001: { phyAtkMul: 0.10, firstSkillOnly: true }, // 旋转之轮Lv1
  18002002: { phyAtkMul: 0.12, firstSkillOnly: true }, // 旋转之轮Lv2
  18002003: { phyAtkMul: 0.15, firstSkillOnly: true }, // 旋转之轮Lv3
  18002004: { phyAtkMul: 0.20, firstSkillOnly: true }, // 秒见飞轮
  17017004: { weekTakenMit: 0.20, specialSparrowCritAtkUp: 1 }, // 鹊儿圣器：受克制伤害 -20%；雀儿专属：受暴击时随机攻击 +1 级
  17037004: { critMul: 0.20 },                         // 玉子烧：暴击伤害 +20%
  // 平板电脑（17012004）：desc 通用段「延时类技能可在本回合结束时直接生效」——现行引擎的延时技
  // （DELAY_SKILL_IDS）本就即时结算，无系统可加速，空词条；白(2445001)专属「延时类技能伤害+6%」见 specialShiroDelayMul。
  // ⚠️ 原来这里错挂了 speedMul:0.08（记忆的笔记本的效果，2026-10-25 张冠李戴修正）。
  17012004: { specialShiroDelayMul: 0.06 },
  17013004: { magAtkMul: 0.06, specialFubukiHealMul: 0.20, specialFubukiRoundShield: 0.04 }, // 狐笋：魔攻+6%；白上吹雪专属：治疗+20%、每回合开始+4%护盾
  17022004: { phyAtkMul: 0.06 },                       // 字典：物攻+6%（杏专属「8%追加畏惧」——CfgBuff 无畏惧条目，整族未实装，见上方穿刺长矛注释）
  17026004: { phyAtkMul: 0.06, specialYuuriHealChito: 0.08 },  // 尤莉的步兵铳：物攻+6%；尤莉专属：每回合末使千户回复 8% 最大生命
  17015004: { phyAtkMul: 0.06, specialAquaLostHpMit: 0.005 },  // 纸巾盒：物攻+6%；湊阿库娅专属：每损失 1% 生命获得 0.5% 减伤（上限 50%）
  17031004: { openShieldPct: 0.20, specialKaedeShieldBoost: 0.30, specialKaedeShieldRegen: 0.05 }, // 面包：开场20%护盾；心爱专属：护盾升至30%、每回合恢复5%护盾
  17032004: { critLv: 3, specialRizeCritLv: 1, specialRizeTeamCritMul: 0.03 }, // 狂野小子：暴击+3；理世专属：自身再+1级、己方暴击伤害+3%
  17024004: { soundDmgMul: 0.10, specialKotomiAoeIgnoreShield: true }, // 小提琴：声音+10%；琴美专属：群体技能无视结界盾
  17035004: { roundRandomStatOrHeal: true, specialRiceBoth: true }, // 白米饭：回合末随机升属性或回 6%；白米饭(誓灵)专属：两种同时生效
  17036004: { hurtMitChance: { chance: 0.50, mul: 0.75 } }, // 冰糖燕窝：50% 概率受伤降至 75%
  17039004: { stackDmgPerHurt: { per: 0.035, max: 4 }, specialTaiyakiHealPerStack: 0.05 }, // 鲷鱼烧：每受击1次增伤3.5%叠4层；鲷鱼烧(誓灵)专属：每层治疗量+5%
  17006004: { takenMit: 0.10, specialYoshinoAtkDown: 1 },   // 冰结傀儡：所受伤害-10%；四糸乃专属：受击时攻击者物攻 -1 级
  17027004: { takenMit: 0.10, specialChitoHealYuuri: 0.08 }, // 千户的日记本：所受伤害-10%；千户专属：每回合末使尤莉回复 8% 最大生命
  17028004: { randomDmgRange: [0.01, 0.15], specialMeaRange: [0.05, 0.17] }, // 法国军帽：伤害随机+1~15%；Mea/Meu 专属：范围改 5~17%
  17029004: { foeTakenDmgUp: 0.03, specialMeaFoeUp: 0.04 }, // Mea羊：敌方全体受伤+3%；Mea/Meu 专属：提升至 4%
  17030004: { allyDmgUp: 0.05, specialChinoSelfDmgUp: 0.03 }, // 提比：其余己方伤害+5%；智乃专属：自身伤害+3%
  18000004: { breakBarrier: true },                     // 金刚杵：攻击破坏屏障；破除后较高攻击 +1
  18001004: { onKillRandomAtk: 1 },                     // 甘狄拔：击倒敌方后随机攻击 +1
  10002001: { repeatSkillDmg: { per: 0.01, max: 0.05 } }, // 破裂剑Lv1
  10002002: { repeatSkillDmg: { per: 0.02, max: 0.10 } }, // 破裂剑Lv2
  10002003: { repeatSkillDmg: { per: 0.03, max: 0.15 } }, // 破裂剑Lv3
  10002004: { repeatSkillDmg: { per: 0.04, max: 0.20 } }, // 提尔锋
  // ⚠️ 穿刺长矛族「造成直接伤害时N%追加畏惧状态」**暂未实现**：
  // CfgBuff 里没有「畏惧」条目（50001~50008 只有麻痹/烧伤/冻结/睡眠/中毒/激怒/混乱/暴怒），
  // FightFeature 也无对应 tips。官方很可能把畏惧做成技能自带的一次性效果（不在通用 buff 表）。
  // 在没有实证前不臆造 buff id——留空比错发一个状态更安全。
  15002001: { priorityChance: 0.04 },                    // 疾行轮Lv1
  15002002: { priorityChance: 0.09 },                    // 疾行轮Lv2
  15002003: { priorityChance: 0.14 },                    // 疾行轮Lv3
  15002004: { priorityChance: 0.20 },                    // 风火轮
  // 气象石族：使用对应天气召唤时持续 8 回合 + 该天气下技能伤害 +20%
  11002001: { weatherSummon: { nature: 3, extendTo: 8, dmg: 0.20 } }, // 晴（烈日）
  11002002: { weatherSummon: { nature: 2, extendTo: 8, dmg: 0.20 } }, // 雨（暴雨）
  11002003: { weatherSummon: { nature: 4, extendTo: 8, dmg: 0.20 } }, // 岚（乱流）
  11002004: { weatherSummon: { nature: 1, extendTo: 8, dmg: 0.20 } }, // 尘（沙尘）
  16002004: { weatherSummon: { nature: 5, extendTo: 8, dmg: 0.20 } }, // 曼杰特（圣光）
  16003004: { weatherSummon: { nature: 6, extendTo: 8, dmg: 0.20 } }, // 麦塞克泰特（夜幕）

  // ---- 批次 5 ----
  // 「非战斗」加成族（在结算/羁绊环节生效，不是战斗词条）：
  //   魅力之绳族：获得羁绊概率 +1/1.5/2/3%（红线额外：休息时每小时 +1 满足，休息逻辑另算）
  //   玄之书族：获得经验 +5/8/11/15%
  15003001: { feelChanceAdd: 0.010 }, // 魅力之绳Lv1
  15003002: { feelChanceAdd: 0.015 }, // 魅力之绳Lv2
  15003003: { feelChanceAdd: 0.020 }, // 魅力之绳Lv3
  15003004: { feelChanceAdd: 0.030, restSatisfaction: 1 }, // 红线
  15004001: { expMul: 0.05 }, // 玄之书Lv1
  15004002: { expMul: 0.08 }, // 玄之书Lv2
  15004003: { expMul: 0.11 }, // 玄之书Lv3
  15004004: { expMul: 0.15 }, // 河图洛书

  // 「解除异常」族（一场战斗一次，按 desc 列表清对应 buff）
  14000001: { cureOnce: { buffs: [50005] } },                              // 治愈之实Lv1：解中毒
  14000002: { cureOnce: { buffs: [50005, 50002] } },                       // Lv2：+烧伤
  14000003: { cureOnce: { buffs: [50005, 50001, 50002, 50007] } },         // Lv3：+麻痹/混乱
  14000004: { cureOnce: { buffs: [50005, 50001, 50002, 50004, 50003, 50007] } }, // 金苹果：全部
  16001004: { cureOnce: { buffs: [50006] } },                              // 提耶特：解激怒

  // 「无视抵抗」/「同属性视作克制」（豆馅族）
  // 千夜专属「会对与技能同属性的怪物造成克制伤害」由 specialChiyoSameNatureWeek 在
  // 下方"专属誓灵联动判定"解析成 sameNatureWeek，fight_core settleSkill 的 rel 段消费。
  17033004: { noResistDamage: true, specialChiyoSameNatureWeek: true },

  // 「弹幕类增伤」（小电视）
  17008003: { danmakuDmgMul: 0.15 },

  // 「物攻打魔防 / 魔攻打物防」（四合如意）
  17002004: { soundDmgMul: 0.05, swapDef: { chance: 0.20 } },

  // 「辅助技能命中 +10%」（刻刻帝，非攻击技也吃命中修正）
  17005004: { assistHitBonus: 10, specialKurumiHealMul: 0.50 }, // 刻刻帝：辅助技能命中+10%（引擎命中段消费）；狂三专属：自身回复量 +50%

  // 「物理单体溅射 10%」（灼烂歼鬼）
  17007004: { physSingleSplash: 0.10, specialKotoriSingleAoeMul: 0.50 }, // 灼烂歼鬼：物理单体溅射10%；琴里专属：对单体使用群体技能伤害 1.5 倍

  // 「致死抵挡一次 + 恢复到 20%」（炸虾狮：夏色祭专属部分另算）
  // 炸虾狮：致死抵挡+恢复20%是夏色祭专属（原 deathGuardPct 全员生效属过度生效，2026-10-25 修正）
  17014004: { natureDmgMul: { 1: 0.08, 2: 0.08 }, specialMatsuriDeathGuard: 0.20 },

  // 仿制品（阿瓦隆限定部分不实现，只做基础效果）
  17018003: { onHurtByWeek: { prop: 101, delta: 1, feature: 30851 } }, // 仿制逆光剑 = 复仇之刃
  17019003: {},                                                        // 仿制千棘刺：畏惧未实装
  17020003: { onHurtByWeek: { prop: 102, delta: 1, feature: 30871 } }, // 仿制贯雷枪 = 轰击之枪

  // 木刻海星：出场自带 1 颗海星（风子专属"解激怒"另算）
  17025004: { startStarfish: 1, specialFukoCureEnrage: 1 }, // 木刻海星：出场自带1颗海星；风子专属：可解除自身激怒（一场一次）

  // 记忆的笔记本的专属部分（吉普莉尔受击暴击+1）需要誓灵 type 联动，
  // 通用部分（速度+8%）已在批次 4；这里补专属钩子字段，引擎按 type 判定。
  17011004: { speedMul: 0.08, specialJibrilCritOnHurt: 1 },

  // 多拉家族宝石：被击倒时转移随机正向能力给随机友方
  17009004: { onDeathTransferStat: true },

  // 刻刻帝专属（狂三回复量 +50%）、炸虾狮专属（夏夏祭致死抵挡）等在引擎按 type 判定

  // 斩首剑族：暴击率上升 1~4 级（111 号属性阶段）
  13001001: { critLv: 1 },
  13001002: { critLv: 2 },
  13001003: { critLv: 3 },
  13001004: { critLv: 4 }, // 童子切安纲

  // 暴击减伤族：受到暴击时伤害降低 10%~33%
  18004001: { critMit: 0.10 }, // 庇护之舟Lv1
  18004002: { critMit: 0.15 }, // 庇护之舟Lv2
  18004003: { critMit: 0.20 }, // 庇护之舟Lv3
  18004004: { critMit: 0.30 }, // 维摩那
  17016004: { critMit: 0.33, specialTigerWeekDefUp: 1 }, // 虎儿圣器：受暴击伤害-33%；虎儿专属：造成克制伤害时随机防御 +1 级
  17023004: { critMit: 0.30, specialTomoyoCritLv: 2, specialTomoyoAllyExtra: 2 }, // 小熊外套：受暴击伤害-30%；智代专属：暴击+2级，存在CLANNAD队友时额外+2

  // 免疫暴击族
  17010004: { specialIzunaImmuneCrit: true }, // 大蝴蝶结：初濑伊纲装备时不会被敌方暴击

  // 攻击与伤害加成
  13002001: { phyAtkMul: 0.02 }, // 威严之剑Lv1
  13002002: { phyAtkMul: 0.04 }, // 威严之剑Lv2
  13002003: { phyAtkMul: 0.06 }, // 威严之剑Lv3
  13002004: { phyAtkMul: 0.08 }, // 天丛云剑
  13003001: { magAtkMul: 0.02 }, // 翠色勾玉Lv1
  13003002: { magAtkMul: 0.04 }, // 翠色勾玉Lv2
  13003003: { magAtkMul: 0.06 }, // 翠色勾玉Lv3
  13003004: { magAtkMul: 0.08 }, // 八尺琼勾玉

  // 属性伤害提升
  13000001: { natMul: { 1: 0.03 } }, // 沼之矛Lv1 (水伤+3%)
  13000002: { natMul: { 1: 0.05 } },
  13000003: { natMul: { 1: 0.07 } },
  13000004: { natMul: { 1: 0.10 } }, // 天之琼矛 (水伤+10%)
  15000001: { natMul: { 2: 0.03 } }, // 灼炎炉Lv1 (火伤+3%)
  15000002: { natMul: { 2: 0.05 } },
  15000003: { natMul: { 2: 0.07 } },
  15000004: { natMul: { 2: 0.10 } }, // 八卦炉 (火伤+10%)
  12000001: { natMul: { 3: 0.03 } }, // 气旋剑Lv1 (风伤+3%)
  12000002: { natMul: { 3: 0.05 } },
  12000003: { natMul: { 3: 0.07 } },
  12000004: { natMul: { 3: 0.10 } }, // 卡拉德波加 (风伤+10%)
  15001001: { natMul: { 4: 0.03 } }, // 大地楔石Lv1 (土伤+3%)
  15001002: { natMul: { 4: 0.05 } },
  15001003: { natMul: { 4: 0.07 } },
  15001004: { natMul: { 4: 0.10 } }, // 补天石 (土伤+10%)
  10000001: { natMul: { 5: 0.03 } }, // 光耀枪Lv1 (光伤+3%)
  10000002: { natMul: { 5: 0.05 } },
  10000003: { natMul: { 5: 0.07 } },
  10000004: { natMul: { 5: 0.10 } }, // 冈格尼尔 (光伤+10%)
  10001001: { natMul: { 6: 0.03 } }, // 暗堕剑Lv1 (暗伤+3%)
  10001002: { natMul: { 6: 0.05 } },
  10001003: { natMul: { 6: 0.07 } },
  10001004: { natMul: { 6: 0.10 } }, // 米斯特汀 (暗伤+10%)

  // 克制伤害倍率提升（映照之镜族）
  13004001: { weekMul: 0.05 },
  13004002: { weekMul: 0.10 },
  13004003: { weekMul: 0.15 },
  13004004: { weekMul: 0.20 }, // 八咫镜
};

// 联动圣器专属段登记表（CfgItems desc「当XX携带时」，2026-10-25 家族批量落地）：
// mod 词条 flag → { types: 携带人 type id（真机 CfgServant_ljd 实证）, subs: 名字兜底子串, key: excl 输出键 }。
// 判定结果全部收进 res.excl（构建器 relicMisc.excl 一行透传），引擎按 key 消费；
// 改写既有聚合字段的少数项（meaRange/meaFoeUp/matsuriDeathGuard/kaedeShieldBoost/rizeCritLv）
// 在 relicBonusOf 尾部直接覆盖 res 对应字段。
const RELIC_EXCLUSIVE_MAP = {
  specialTookaRepeatMul:       { types: [2344004], subs: ['十香'],     key: 'tookaRepeatMul' },
  specialOrigamiWeekPer:       { types: [2345003], subs: ['折纸'],     key: 'origamiWeekPer' },
  specialKurumiHealMul:        { types: [2346001], subs: ['狂三'],     key: 'kurumiHealMul' },
  specialYoshinoAtkDown:       { types: [2341005], subs: ['四糸乃'],   key: 'yoshinoAtkDown' },
  specialKotoriSingleAoeMul:   { types: [2342002], subs: ['琴里'],     key: 'kotoriSingleAoeMul' },
  specialShiroDelayMul:        { types: [2445001], subs: [],           key: 'shiroDelayMul' }, // 「白」单字不做名字兜底（会误中白上吹雪等）
  specialJibrilCritOnHurt:     { types: [2443002], subs: ['吉普莉尔'], key: 'jibrilCritOnHurt' },
  specialFubukiHealMul:        { types: [2744001], subs: ['白上吹雪'], key: 'fubukiHealMul' },
  specialFubukiRoundShield:    { types: [2744001], subs: ['白上吹雪'], key: 'fubukiRoundShield' },
  specialAquaLostHpMit:        { types: [2741003], subs: ['阿库娅'],   key: 'aquaLostHpMit' },
  specialTigerWeekDefUp:       { types: [2845001], subs: ['虎儿'],     key: 'tigerWeekDefUp' },
  specialSparrowCritAtkUp:     { types: [2843002], subs: ['雀儿'],     key: 'sparrowCritAtkUp' },
  specialNagisaHealMul:        { types: [3145001], subs: ['古河渚'],   key: 'nagisaHealMul' },
  specialKotomiAoeIgnoreShield:{ types: [3146005], subs: ['琴美'],     key: 'kotomiAoeIgnoreShield' },
  specialFukoCureEnrage:       { types: [3143004], subs: ['风子'],     key: 'fukoCureEnrage' },
  specialYuuriHealChito:       { types: [3242002], subs: ['尤莉'],     key: 'yuuriHealChito' },
  specialChitoHealYuuri:       { types: [3245001], subs: ['千户'],     key: 'chitoHealYuuri' },
  specialMeaRange:             { types: [3341001, 3345002], subs: ['Mea', 'Meu'], key: 'meaRange' },
  specialChinoSelfDmgUp:       { types: [3441001], subs: ['智乃'],     key: 'chinoSelfDmgUp' },
  specialKaedeShieldRegen:     { types: [3442002], subs: ['心爱'],     key: 'kaedeShieldRegen' },
  specialRizeTeamCritMul:      { types: [3446003], subs: ['理世'],     key: 'rizeTeamCritMul' },
  specialSyaroOverflowShield:  { types: [3445005], subs: ['纱路'],     key: 'syaroOverflowShield' },
  specialRiceBoth:             { types: [3514005], subs: ['白米饭'],   key: 'riceBoth' },
  specialDuckVsAbnormal:       { types: [3542001], subs: ['北京烤鸭'], key: 'duckVsAbnormal' },
  specialTaiyakiHealPerStack:  { types: [3546003], subs: ['鲷鱼烧'],   key: 'taiyakiHealPerStack' },
  specialTomoyoAllyExtra:      { types: [3144002], subs: ['智代'],     key: 'tomoyoAllyExtraLv' }, // 引擎按"场上存在CLANNAD队友"动态消费
};

function relicBonusOf(servant, bagGoods) {
  const res = {
    critLv: 0,
    critMul: 0,
    critMit: 0,
    immuneCrit: false,
    dmgMul: 0,
    weekMul: 0,
    natMul: {},
    phyAtkMul: 0,
    magAtkMul: 0,
    onHurtByWeek: null, // {prop, delta, feature}：受到克制伤害后属性提升（无则 null）
    deathSaveChance: 0,  // 濒死留 1HP 概率（0 = 无）
    deathSaveFeature: 0, // 对应的官方飘字特性 ID
    lowHpHeal: null,     // {threshold, pct, onceKey}：低血回血（一场一次）
    defPct: 0,           // 物防百分比加成（进场乘算）
    mdefPct: 0,          // 魔防百分比加成
    dodgeBonus: 0,       // 作为目标时命中率额外降低的百分点
    hitBonus: 0,         // 自身攻击技能命中率增加的百分点
    attackOnly: false,   // 只能使用攻击技能（引擎侧尚未强制，仅记录）
    rOnly: false,        // 仅 R 及以下稀有度生效（按 star/颜色判定）
    // 伤害乘区族（CfgItems「造成伤害提升N%」各种限定）
    soundDmgMul: 0, aoeDmgMul: 0, singlePhyMul: 0,
    lifesteal: 0, weekTakenMit: 0, roundSelfDamage: 0,
    vsPositiveStats: false, firstSkillOnly: false, hurtRandomStatUp: 0,
    natureDmgMul: {}, takenNatureMit: {},
    // 批次 4
    speedMul: 0, openShieldPct: 0, takenMit: 0, foeTakenDmgUp: 0, allyDmgUp: 0,
    hurtMitChance: null, stackDmgPerHurt: null, randomDmgRange: null, repeatSkillDmg: null,
    fearChance: 0, fearFeature: 0, priorityChance: 0, weatherSummon: null,
    onKillRandomAtk: 0, roundRandomStatOrHeal: false, breakBarrier: false,
    // 批次 5
    feelChanceAdd: 0, expMul: 0, cureOnce: null, noResistDamage: false, sameNatureWeek: false,
    danmakuDmgMul: 0, swapDef: null, assistHitBonus: 0, physSingleSplash: 0,
    deathGuardPct: 0, startStarfish: 0, onDeathTransferStat: false,
  excl: null, // 联动圣器专属段打包（见 RELIC_EXCLUSIVE_MAP）
  };
  const rgid = servant && Number(servant.relic_gid);
  if (!rgid) return res;
  const g = (bagGoods || []).find(x => Number(x.id) === rgid);
  if (!g) return res;
  const tid = Number(g.type_id);
  const mod = RELIC_COMBAT_MODS[tid];
  if (!mod) return res;

  if (mod.critLv) res.critLv += mod.critLv;
  if (mod.critMul) res.critMul += mod.critMul;
  if (mod.critMit) res.critMit += mod.critMit;
  if (mod.immuneCrit) res.immuneCrit = true;
  if (mod.dmgMul) res.dmgMul += mod.dmgMul;
  if (mod.weekMul) res.weekMul += mod.weekMul;
  if (mod.phyAtkMul) res.phyAtkMul += mod.phyAtkMul;
  if (mod.magAtkMul) res.magAtkMul += mod.magAtkMul;
  if (mod.natMul) Object.assign(res.natMul, mod.natMul);
  if (mod.onHurtByWeek) res.onHurtByWeek = Object.assign({}, mod.onHurtByWeek);
  if (mod.deathSaveChance) { res.deathSaveChance = mod.deathSaveChance; res.deathSaveFeature = mod.deathSaveFeature; }
  if (mod.lowHpHeal) res.lowHpHeal = Object.assign({}, mod.lowHpHeal);
  if (mod.defPct) res.defPct += mod.defPct;
  if (mod.mdefPct) res.mdefPct += mod.mdefPct;
  if (mod.dodgeBonus) res.dodgeBonus += mod.dodgeBonus;
  if (mod.hitBonus) res.hitBonus += mod.hitBonus;
  res.attackOnly = !!mod.attackOnly;
  res.rOnly = !!mod.rOnly;
  // 伤害乘区族
  if (mod.soundDmgMul) res.soundDmgMul += mod.soundDmgMul;
  if (mod.aoeDmgMul) res.aoeDmgMul += mod.aoeDmgMul;
  if (mod.singlePhyMul) res.singlePhyMul += mod.singlePhyMul;
  if (mod.lifesteal) res.lifesteal += mod.lifesteal;
  if (mod.weekTakenMit) res.weekTakenMit += mod.weekTakenMit;
  if (mod.roundSelfDamage) res.roundSelfDamage += mod.roundSelfDamage;
  if (mod.vsPositiveStats) res.vsPositiveStats = true;
  if (mod.firstSkillOnly) res.firstSkillOnly = true;
  if (mod.hurtRandomStatUp) res.hurtRandomStatUp += mod.hurtRandomStatUp;
  if (mod.natureDmgMul) {
    for (const [n, v] of Object.entries(mod.natureDmgMul)) res.natureDmgMul[n] = (res.natureDmgMul[n] || 0) + v;
  }
  if (mod.takenNatureMit) {
    for (const [n, v] of Object.entries(mod.takenNatureMit)) res.takenNatureMit[n] = (res.takenNatureMit[n] || 0) + v;
  }
  // 批次 4：回合末/开场/暴击/受击特殊
  if (mod.speedMul) res.speedMul += mod.speedMul;
  if (mod.openShieldPct) res.openShieldPct += mod.openShieldPct;
  if (mod.takenMit) res.takenMit += mod.takenMit;
  if (mod.foeTakenDmgUp) res.foeTakenDmgUp += mod.foeTakenDmgUp;
  if (mod.allyDmgUp) res.allyDmgUp += mod.allyDmgUp;
  if (mod.hurtMitChance) res.hurtMitChance = Object.assign({}, mod.hurtMitChance);
  if (mod.stackDmgPerHurt) res.stackDmgPerHurt = Object.assign({}, mod.stackDmgPerHurt);
  if (mod.randomDmgRange) res.randomDmgRange = mod.randomDmgRange.slice();
  if (mod.repeatSkillDmg) res.repeatSkillDmg = Object.assign({}, mod.repeatSkillDmg);
  if (mod.fearChance) { res.fearChance = mod.fearChance; res.fearFeature = mod.fearFeature; }
  if (mod.priorityChance) res.priorityChance += mod.priorityChance;
  if (mod.weatherSummon) res.weatherSummon = Object.assign({}, mod.weatherSummon);
  if (mod.onKillRandomAtk) res.onKillRandomAtk += mod.onKillRandomAtk;
  if (mod.roundRandomStatOrHeal) res.roundRandomStatOrHeal = true;
  if (mod.breakBarrier) res.breakBarrier = true;
  // 批次 5
  if (mod.feelChanceAdd) res.feelChanceAdd += mod.feelChanceAdd;
  if (mod.expMul) res.expMul += mod.expMul;
  if (mod.cureOnce) res.cureOnce = { buffs: mod.cureOnce.buffs.slice() };
  if (mod.noResistDamage) res.noResistDamage = true;
  if (mod.danmakuDmgMul) res.danmakuDmgMul += mod.danmakuDmgMul;
  if (mod.swapDef) res.swapDef = Object.assign({}, mod.swapDef);
  if (mod.assistHitBonus) res.assistHitBonus += mod.assistHitBonus;
  if (mod.physSingleSplash) res.physSingleSplash += mod.physSingleSplash;
  if (mod.deathGuardPct) res.deathGuardPct += mod.deathGuardPct;
  if (mod.startStarfish) res.startStarfish += mod.startStarfish;
  if (mod.onDeathTransferStat) res.onDeathTransferStat = true;

  // 专属誓灵联动判定（type id 以真机 CfgServant_ljd 实证为准；名字兜底供换皮/变体防御）
  const stype = servant && Number(servant.type);
  const sname = (servant && servant.name) || '';
  const isCarrier = (types, subs) => types.includes(Number(stype)) || (subs || []).some(s => sname.includes(s));
  if (mod.specialTomoyoCritLv && isCarrier([3144002], ['智代'])) {
    res.critLv += mod.specialTomoyoCritLv;
  }
  if (mod.specialIzunaImmuneCrit && isCarrier([2444003], ['初濑伊纲'])) {
    res.immuneCrit = true;
  }
  if (mod.specialChiyoSameNatureWeek && isCarrier([3443004], ['千夜'])) {
    res.sameNatureWeek = true;
  }
  if (mod.specialRizeCritLv && isCarrier([3446003], ['理世'])) {
    res.critLv += mod.specialRizeCritLv;
  }
  // 专属段统一收进 excl（整体透传到战斗单位 relicMisc.excl，引擎按键消费）
  const excl = res.excl = {};
  for (const [flag, c] of Object.entries(RELIC_EXCLUSIVE_MAP)) {
    if (mod[flag] && isCarrier(c.types, c.subs)) excl[c.key] = mod[flag];
  }
  // 覆盖型：改写既有聚合字段
  if (excl.meaRange) res.randomDmgRange = excl.meaRange.slice();
  if (mod.specialMeaFoeUp && isCarrier([3341001, 3345002], ['Mea', 'Meu'])) res.foeTakenDmgUp = mod.specialMeaFoeUp;
  if (mod.specialMatsuriDeathGuard && isCarrier([2742002], ['夏色祭'])) res.deathGuardPct = mod.specialMatsuriDeathGuard;
  if (mod.specialKaedeShieldBoost && isCarrier([3442002], ['心爱'])) res.openShieldPct = mod.specialKaedeShieldBoost;

  return res;
}

module.exports = {
  RELIC_CORE_TYPES, infoOfType, isRelicType, isCoreType,
  LV_MAX, UPGRADE_ITEMS, DECOMPOSE_ITEM, coreMaxLevel, upgradeCost, decomposeItems,
  PROP_KEYS, coreBonusOf, equipBonusOf,
  RELIC_COMBAT_MODS, relicBonusOf, ENCHANT_PROPS, enchantConfigOf, normalizeEnchant, enchantInfoOf, enchantBonusOf, applyEnchant,
};
