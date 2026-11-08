// 遗物箱（圣器遗物箱 / 核心遗物箱 / 原初圣器遗物箱）开箱产出表
//
// 背景：这批箱子在客户端 CfgItems 里 **data = {}（官方服务端产出，客户端不存概率）**，
// 服务端此前没有对应产出表 → m_item_use_tos 走「无使用产出，不消耗」分支 → 点了完全没反应
// （2026-09-12 真机日志：21007000/21003000/21002000/21103000/21102000 全部静默）。
//
// 箱名（CfgItems，短描述即官方产出口径）：
//   21001000 旧式圣器遗物箱   → Lv.1 圣器
//   21002000 制式圣器遗物箱   → Lv.1—Lv.2 圣器
//   21003000 新制圣器遗物箱   → Lv.2—Lv.3 圣器
//   21007000 原初圣器遗物箱   → 随机一个「原初级圣器遗物箱」（21007001~08）
//   21007999 薛定谔原初圣器   → 随机一件原初圣器
//   21007001~08 ××遗物箱      → 大概率同神系 Lv.3 圣器，小概率同神系原初圣器
//   21000000 制式核心遗物箱   → Lv.1—Lv.2 能力核心（新手引导组 40/51 专用，见 guide_data）
//   21101000 旧式核心遗物箱   → Lv.1 能力核心
//   21102000 制式核心遗物箱   → Lv.1—Lv.2 能力核心
//   21103000 新制核心遗物箱   → Lv.2—Lv.3 能力核心
//   21104000 原初核心遗物箱   → Lv.3 或原初（满级）能力核心
//
// 品阶口径（CfgItems.color 实证）：
//   圣器 Lv = color - 1（color2=Lv1、3=Lv2、4=Lv3、5=原初）；
//   核心 Lv = color - 2（color3=Lv1、4=Lv2、5=Lv3），typeId = 19000000 + 属性码×100000 + Lv。
//   核心「等级」= 物品实例上的 level（m_relic_upgrade_info_toc.power_relic_list 下发），
//   与 Lv 同名同义：Lv.3 核心 level=3；原初核心 = 满级（coreMaxLevel(color5)=15）。
const RD = require('./relic_data');
const GD = require('./guide_data');

// ---- 圣器池：按 Lv 分组（1=Lv1 … 4=原初）----
const RELIC_BY_LV = { 1: [], 2: [], 3: [], 4: [] };
for (const [idStr, info] of Object.entries(RD.RELIC_CORE_TYPES)) {
  if (!info || info.kind !== 'relic') continue;
  const lv = Math.min(4, Math.max(1, (Number(info.color) || 2) - 1));
  RELIC_BY_LV[lv].push(Number(idStr));
}
for (const k of Object.keys(RELIC_BY_LV)) RELIC_BY_LV[k].sort((a, b) => a - b);

// 神系（typeId 第 7-8 位：10 阿斯加德 11 幻想 12 阿瓦隆 13 高天原 14 奥林匹斯 15 九霄 16 赫里奥波里斯 18 婆罗多）
const godOf = typeId => Math.floor(Number(typeId) / 1000000) % 100;

// 原初级圣器遗物箱 → 神系；以及官方 CfgItems.data 里指定的「小概率原初圣器」
const GOD_BOXES = {
  21007001: 10, 21007002: 11, 21007003: 12, 21007004: 13,
  21007005: 14, 21007006: 15, 21007007: 16, 21007008: 18,
};
// 值取自 CfgItems.lua 各箱 data 的第一项（= 该神系原初圣器）
const GOD_PRIZE = {
  21007001: 10000004, 21007002: 11000004, 21007003: 12000004, 21007004: 13000004,
  21007005: 14000004, 21007006: 15000004, 21007007: 16003004, 21007008: 18000004,
};
const GOD_PRIZE_RATE = 20; // 小概率原初圣器：20%（剩下的 80% 给同神系 Lv.3）

// ===================== 第二批：信仰箱 / 神迹箱 / 神秘箱子 / 填充箱 =====================
// 同样都是 CfgItems.data = {}（产出只在官方服务端）→ 此前点了全没反应。

// ---- 信仰（BAG_TYPE_FAITH=7；typeId = 24000000 + color×100000 + 属性码）----
// CfgItems 实证：24 前缀 100% 是信仰，8 种属性 × 3 稀有度 = 24 件
//   243000XX 蓝(color3) / 244000XX 紫(color4) / 245000XX 金(color5)
//   desc：「携带后能提升誓灵的…」→ 装备品，canPile=false，每实例 1 格
const FAITH_PROPS = [
  { p: 1, n: '生命' }, { p: 2, n: '狂野' }, { p: 3, n: '智慧' }, { p: 4, n: '强固' },
  { p: 5, n: '精神' }, { p: 6, n: '疾风' }, { p: 26, n: '专注' }, { p: 27, n: '坚韧' },
];
const faithTypeId = (color, prop) => 24000000 + color * 100000 + prop;
const faithNameOf = typeId => {
  const c = Math.floor(Number(typeId) / 100000) % 10;
  const p = Number(typeId) % 1000;
  const f = FAITH_PROPS.find(x => x.p === p);
  return `${f ? f.n : p}信仰·${['', '', '蓝', '紫', '金'][c] || c}`;
};

// ---- 神迹（21050001~04）：官方文案（CfgArk.lua:23）----
//   「『神迹』开启后有概率获得 **阵营圣器箱子** / **往期阵营活动限定誓灵**」
// ⇒ 大概率给对应阵营的「原初级圣器遗物箱」(21007001~08)，小概率给 desc 列出的誓灵。
// 阵营对应关系（desc 首句 = 阵营名，与神系箱 21007001~08 一一对应）：
//   万邦=奥林匹斯→21007005  沙漠=赫里奥波里斯→21007007  巨木=阿斯加德→21007001  龙纹=九霄→21007006
// 誓灵 type = 客户端道具 id - 30000000（OutCardVO.itemTypeID = servantType + 30000000，summon.js 同口径）
const SERVANT_OF_ITEM = id => Number(id) - 30000000;
const MIRACLE_BOXES = {
  21050001: {
    name: '万邦神迹', godBox: 21007005,
    servants: [1445027, 1434028, 1435029, 1436024, 1424030, 1421031],
    names: ['阿尔忒弥斯', '赫拉克勒斯', '阿斯特赖亚', '珀耳塞福涅', '基克洛普斯', '琉喀忒亚'],
  },
  21050002: {
    name: '沙漠神迹', godBox: 21007007,
    servants: [1634012, 1631005, 1625013, 1626006, 1623007],
    names: ['塞赫美特', '索贝克', '卡', '贝斯特', '斯芬克斯'],
  },
  21050003: {
    name: '巨木神迹', godBox: 21007001,
    servants: [1031018, 1032013, 1035012, 1031011],
    names: ['密米尔', '诗寇蒂', '薇儿丹蒂', '兀尔德'],
  },
  21050004: {
    name: '龙纹神迹', godBox: 21007006,
    servants: [1533017, 1535021, 1543020],
    names: ['白泽', '嫦娥', '年·新春异兽'],
  },
};
const MIRACLE_SERVANT_RATE = 20; // desc「小概率获得…」→ 20%；其余 80% 给阵营圣器箱

// ---- 神秘箱子（21500069~73，无限领域 50/150/250/350/500 层，CfgTower.towerRewardArr 实证）----
// desc：「使用后可随机获得奖励 / 有极低概率可能获得誓灵 X、Y、Z」
// ⚠️ 常规奖励官方未在任何客户端表里给出（data={}），下列池为**按层数递增的推断值**，可调。
const MYSTERY_SERVANT_RATE = 3; // 「极低概率」
const MYSTERY_BOXES = {
  21500069: {
    name: '神秘箱子Ⅰ', pool: [21001000, 21101000, 21500036],
    servants: [1043006, 1126002, 1431002], names: ['托尔', '巫妖', '狄俄尼索斯'],
  },
  21500070: {
    name: '神秘箱子Ⅱ', pool: [21002000, 21102000, 21500036],
    servants: [1042001, 1024005, 1533005], names: ['洛基', '拉塔托斯克', '嫘祖'],
  },
  21500071: {
    name: '神秘箱子Ⅲ', pool: [21002000, 21103000, 21500037],
    servants: [1046002, 1434017, 1324005], names: ['芬里尔', '喀戎', '茨木童子'],
  },
  21500072: {
    name: '神秘箱子IV', pool: [21003000, 21103000, 21500037],
    servants: [1544015, 1435019], names: ['应龙', '厄洛斯'],
  },
  21500073: {
    name: '神秘箱子V', pool: [21003000, 21104000, 21500038],
    servants: [1032016, 1635011, 1436022], names: ['史尔特尔', '塞勒凯特', '塞勒涅'],
  },
};

// ---- 填充核心/圣器箱（21901010~12）：desc 为空，按名字推断 ----
// 「低阶/中阶/高阶 填充核心/圣器箱」→ 对应该 Lv 的圣器或能力核心各半。
// ⚠️ 客户端无任何产出依据（desc 空、form=3 疑似 GM/内部道具），下列为**按名推断值**，可调。
const FILL_BOXES = { 21901010: 1, 21901011: 2, 21901012: 3, 21902000: 1, 21902001: 2, 21902002: 3 };

// ---- SP 誓灵补偿箱（21050005~07）----
const SP_BOXES = {
  21050005: {
    name: 'SP-1誓灵补偿',
    servants: [1115003, 1116005, 1311009, 1412013, 1414011, 1413014],
    names: ['塞壬', '哥布林', '伊登', '奇美拉', '阿耳戈斯', '塞勒涅'],
  },
  21050006: {
    name: 'SP-2誓灵补偿',
    servants: [1514010, 1511011, 1323008, 1432003, 1534003],
    names: ['毕方', '精卫', '座敷童子', '阿波罗', '祸斗'],
  },
  21050007: {
    name: 'SP-3誓灵补偿',
    servants: [1033004, 1331003, 1432003, 1043006, 1445027, 1941001],
    names: ['洛基', '雪女', '阿波罗', '托尔', '雅典娜', '维纳斯'],
  },
};

// ---- 随机皮肤箱（主题皮肤库）----
const RANDOM_SKIN_BOXES = [
  21500044, 21500093, 21500116, 21500156, 21500185, 21500195,
  21500199, 21500200, 21500204, 21500208, 21500213, 21500217,
  21500226, 21500231, 21500236, 21500238, 21500261,
];

// ---- 箱表 ----
// kind: relic=圣器 / core=能力核心 / god=神系原初箱 / raw=直接给列出的道具 / guide=引导箱
// w: [[Lv, 权重], ...]；origin: 核心「原初（满级）」概率 %
const BOXES = {
  21000000: { kind: 'guide' },
  21001000: { kind: 'relic', w: [[1, 100]] },
  21002000: { kind: 'relic', w: [[1, 70], [2, 30]] },
  21003000: { kind: 'relic', w: [[2, 70], [3, 30]] },
  21007000: { kind: 'raw', pool: Object.keys(GOD_BOXES).map(Number) },
  21007999: { kind: 'relic', w: [[4, 100]] },
  21101000: { kind: 'core', w: [[1, 100]] },
  21102000: { kind: 'core', w: [[1, 70], [2, 30]] },
  21103000: { kind: 'core', w: [[2, 70], [3, 30]] },
  21104000: { kind: 'core', w: [[3, 100]], origin: 25 },
  // 信仰遗物箱（desc：蓝/紫/金稀有度的信仰）
  21500036: { kind: 'faith', color: 3 },
  21500037: { kind: 'faith', color: 4 },
  21500038: { kind: 'faith', color: 5 },
  // 神迹 + 随机神迹
  21905016: { kind: 'random_miracle' },

  // 经验水晶箱（使用直接产出对应的自然结晶）
  21901004: { kind: 'raw', pool: [20016000] }, // 暗淡的自然结晶
  21901005: { kind: 'raw', pool: [20016001] }, // 明亮的自然结晶
  21901006: { kind: 'raw', pool: [20016002] }, // 闪耀的自然结晶

  // 随机进化材料箱（开出对应色阶材料）
  21901000: { kind: 'raw', pool: [20000000, 20000001, 20000002, 20000003, 20000004, 20000005, 20000006, 20000007, 20000008] },
  21999999: { kind: 'raw', pool: [20000000, 20000001, 20000002, 20000003, 20000004, 20000005, 20000006, 20000007, 20000008] },
  21901001: { kind: 'raw', pool: [20000009, 20000010, 20000011, 20000012, 20000013, 20000014, 20000015, 20000016, 20000017, 20000018] },
  21901002: { kind: 'raw', pool: [20000019, 20000020, 20000021, 20000022, 20000023, 20000024, 20000025] },
  21901003: { kind: 'raw', pool: [20000026, 20000027, 20000028, 20000029, 20000030] },

  // 技能模组 / 核心晶组箱
  21901007: { kind: 'raw', pool: [26000000, 27000000] },
  21901008: { kind: 'raw', pool: [26000001, 27000001] },
  21901009: { kind: 'raw', pool: [26000002, 27000002] },

  // 节日红包与礼包
  60000023: { kind: 'spring_red_packet', name: '新春红包' },
  60000059: { kind: 'qiqiao_gift', name: '乞巧礼包' },
  60000083: { kind: 'anniversary_gift', name: '周年庆礼包' },
  60000090: { kind: 'strange_baozi', name: '奇怪的包子' },

  // 杂项
  21903001: {
    kind: 'multi', name: '骑士团的馈赠',
    rewards: [{ type: 10001001, num: 1 }, { type: 11000001, num: 1 }, { type: 12000001, num: 1 }],
  },
  21903000: {
    kind: 'multi', name: '包子馅',
    rewards: [{ type: 30000003, num: 5000 }, { type: 30000002, num: 100 }],
  },
  // ⚠️ 21905000「初阶指令·基础」曾在这里被当成 multi 箱（核心晶组Lv1×5 + 金币×2000），
  //    与 CfgItems 描述「指令卡包」完全不符 —— 会把卡包当遗物箱开掉、永远开不出卡。
  //    21905000~21905016 / 70000000~70000067 全部属于「指令卡道具」，产出由
  //    `data/ark_card_item_data.js` + `handlers/ark.useCardItem` 负责，**不要**再加进任何开箱表。
};
for (const [idStr, def] of Object.entries(MIRACLE_BOXES)) {
  BOXES[Number(idStr)] = { kind: 'miracle', ...def };
}
for (const [idStr, def] of Object.entries(MYSTERY_BOXES)) {
  BOXES[Number(idStr)] = { kind: 'mystery', ...def };
}
for (const [idStr, def] of Object.entries(SP_BOXES)) {
  BOXES[Number(idStr)] = { kind: 'sp', ...def };
}
for (const bid of RANDOM_SKIN_BOXES) {
  BOXES[bid] = { kind: 'random_skin' };
}
for (const [idStr, lv] of Object.entries(FILL_BOXES)) {
  BOXES[Number(idStr)] = { kind: 'fill', lv };
}
for (const idStr of Object.keys(GOD_BOXES)) {
  BOXES[Number(idStr)] = { kind: 'god', god: GOD_BOXES[idStr], prize: GOD_PRIZE[idStr] };
}

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
function pickWeighted(w) {
  const total = w.reduce((s, x) => s + x[1], 0);
  let r = Math.random() * total;
  for (const [val, ww] of w) { if ((r -= ww) < 0) return val; }
  return w[w.length - 1][0];
}
// 核心实例等级：默认 = Lv（color-2）；原初 = 该颜色满级
const coreLevelOf = (typeId, lv, origin) => {
  const info = RD.infoOfType(typeId);
  if (!info || info.kind !== 'core') return 0;
  if (origin) return RD.coreMaxLevel(info.color);
  return Math.max(1, (Number(info.color) || 3) - 2);
};

/**
 * 开一个箱子 → { typeId, level, lv }
 * level 仅对核心有意义（圣器填 0，调用方忽略）；lv 是产出档位（日志用）
 */
function rollBox(typeId) {
  const def = BOXES[Number(typeId)];
  if (!def) return null;
  if (def.kind === 'guide') {
    const pool = GD.GUIDE_BOX_REWARDS[Number(typeId)] || [];
    if (!pool.length) return null;
    const t = pick(pool);
    return { typeId: t, level: coreLevelOf(t), lv: 0 };
  }
  if (def.kind === 'raw') {
    return { typeId: pick(def.pool), level: 0, lv: 0 };
  }
  if (def.kind === 'relic') {
    const lv = pickWeighted(def.w);
    const pool = RELIC_BY_LV[lv] && RELIC_BY_LV[lv].length ? RELIC_BY_LV[lv] : RELIC_BY_LV[1];
    return { typeId: pick(pool), level: 0, lv };
  }
  if (def.kind === 'god') {
    const origin = Math.random() * 100 < GOD_PRIZE_RATE;
    if (origin && def.prize) return { typeId: def.prize, level: 0, lv: 4 };
    const pool = RELIC_BY_LV[3].filter(id => godOf(id) === def.god);
    return { typeId: pick(pool.length ? pool : RELIC_BY_LV[3]), level: 0, lv: 3 };
  }
  if (def.kind === 'core') {
    const lv = pickWeighted(def.w);
    const origin = !!def.origin && Math.random() * 100 < def.origin;
    const prop = 1 + Math.floor(Math.random() * 6); // 属性码 1-6（生命/物攻/魔攻/物防/魔防/速度）
    const t = 19000000 + prop * 100000 + lv;
    return { typeId: t, level: coreLevelOf(t, lv, origin), lv, origin };
  }
  if (def.kind === 'faith') {
    const f = pick(FAITH_PROPS);
    const t = faithTypeId(def.color, f.p);
    return { kind: 'goods', typeId: t, level: 0, lv: def.color - 2, name: faithNameOf(t) };
  }
  if (def.kind === 'miracle') {
    if (Math.random() * 100 < MIRACLE_SERVANT_RATE && def.servants.length) {
      const i = Math.floor(Math.random() * def.servants.length);
      return { kind: 'servant', servantType: def.servants[i], name: def.names[i] || String(def.servants[i]) };
    }
    return { kind: 'goods', typeId: def.godBox, level: 0, lv: 3 };
  }
  if (def.kind === 'random_miracle') {
    return { kind: 'goods', typeId: pick(Object.keys(MIRACLE_BOXES).map(Number)), level: 0, lv: 0 };
  }
  if (def.kind === 'mystery') {
    if (Math.random() * 100 < MYSTERY_SERVANT_RATE && def.servants.length) {
      const i = Math.floor(Math.random() * def.servants.length);
      return { kind: 'servant', servantType: def.servants[i], name: def.names[i] || String(def.servants[i]) };
    }
    return { kind: 'goods', typeId: pick(def.pool), level: 0, lv: 0 };
  }
  if (def.kind === 'fill') {
    // 圣器 / 能力核心 各半（同 Lv）
    if (Math.random() < 0.5) {
      const pool = RELIC_BY_LV[def.lv] && RELIC_BY_LV[def.lv].length ? RELIC_BY_LV[def.lv] : RELIC_BY_LV[1];
      return { kind: 'goods', typeId: pick(pool), level: 0, lv: def.lv };
    }
    const prop = 1 + Math.floor(Math.random() * 6);
    const t = 19000000 + prop * 100000 + def.lv;
    return { kind: 'goods', typeId: t, level: coreLevelOf(t, def.lv, false), lv: def.lv };
  }
  if (def.kind === 'sp') {
    const i = Math.floor(Math.random() * def.servants.length);
    return { kind: 'servant', servantType: def.servants[i], name: def.names[i] || String(def.servants[i]) };
  }
  if (def.kind === 'spring_red_packet') {
    const silver = 10000 + Math.floor(Math.random() * 40001);
    const vit = 100 + Math.floor(Math.random() * 201);
    const item = pick([20016002, 26000001, 27000001, 31000000]);
    const rewards = [
      { type: 30000003, num: silver },
      { type: 30000002, num: vit },
      { type: item, num: item === 31000000 ? 1 : 2 },
    ];
    if (Math.random() < 0.25) {
      rewards.push({ type: 30000000, num: pick([88, 188, 666, 888]) });
    }
    return { kind: 'multi', rewards };
  }
  if (def.kind === 'qiqiao_gift') {
    const silver = 10000 + Math.floor(Math.random() * 30001);
    const vit = 100 + Math.floor(Math.random() * 151);
    const item = pick([20016002, 27000001]);
    const rewards = [
      { type: 30000003, num: silver },
      { type: 30000002, num: vit },
      { type: item, num: 2 },
    ];
    if (Math.random() < 0.20) {
      rewards.push({ type: 30000000, num: pick([77, 177, 520]) });
    }
    return { kind: 'multi', rewards };
  }
  if (def.kind === 'anniversary_gift') {
    const silver = 20000 + Math.floor(Math.random() * 30001);
    const rewards = [
      { type: 30000003, num: silver },
      { type: 30000002, num: 200 },
      { type: 31000000, num: 1 },
      { type: 20016002, num: 5 },
    ];
    if (Math.random() < 0.25) {
      rewards.push({ type: 30000000, num: pick([100, 200, 500, 1000]) });
    }
    return { kind: 'multi', rewards };
  }
  if (def.kind === 'strange_baozi') {
    const rewards = pick([
      [{ type: 30000002, num: 100 }],
      [{ type: 30000003, num: 5000 }],
      [{ type: 30000000, num: 50 }],
      [{ type: 20016002, num: 2 }],
      [{ type: 20000009, num: 3 }],
    ]);
    return { kind: 'multi', rewards };
  }
  if (def.kind === 'multi') {
    return { kind: 'multi', rewards: (def.rewards || []).map(r => ({ ...r })) };
  }
  if (def.kind === 'random_skin') {
    const HD = require('./handbook_data');
    const skins = HD.THEME_SKINS || [];
    if (!skins.length) return null;
    const S = require('../state').S;
    const owned = (S && S.skinState && S.skinState.owned) || [];
    const unowned = skins.filter(s => !owned.includes(s.skin));
    const target = unowned.length ? pick(unowned) : pick(skins);
    return { kind: 'skin', skinId: target.skin, itemId: target.item, typeId: target.item };
  }
  return null;
}

// 誓灵 type → 展示用道具 id（背包/结算展示形态；summon.js 的 OutCardVO 口径）
const itemOfServant = type => Number(type) + 30000000;

const boxOf = typeId => BOXES[Number(typeId)] || null;
const nameOf = typeId => {
  const i = RD.RELIC_CORE_TYPES[Number(typeId)];
  return i ? i.name : String(typeId);
};
const isBox = typeId => !!BOXES[Number(typeId)];

module.exports = {
  BOXES, RELIC_BY_LV, GOD_BOXES, GOD_PRIZE, GOD_PRIZE_RATE,
  FAITH_PROPS, MIRACLE_BOXES, MIRACLE_SERVANT_RATE, MYSTERY_BOXES, MYSTERY_SERVANT_RATE, FILL_BOXES,
  SERVANT_OF_ITEM, itemOfServant, faithTypeId, faithNameOf,
  boxOf, isBox, rollBox, nameOf, godOf, coreLevelOf,
};
