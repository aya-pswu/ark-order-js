// 天外来客（1742 活动主线副本）关卡配置与敌方数据
// 覆盖天使阵营 5 关与恶魔阵营 5 关共 30 个关卡节点（含 10 关底与道中/BOSS 战斗点）。
// 等级与掉落依据官方 stage_drop_data.js 与 CfgCopy.lua。

const NATURE_POOL = {
  1: [1112012, 1112015, 1412013, 1523009, 1033004], // 水
  2: [1122014, 1421005, 1421006, 1522007, 1226002], // 火
  3: [1131006, 1231010, 1032013, 1332013, 1131009], // 风
  4: [1142020, 1242006, 1342029, 1442021, 1146023], // 土
  5: [1042001, 1335004, 1445041, 1043006, 1533005], // 光
  6: [1043006, 1335004, 1533005, 1131009, 2011001], // 暗
};

const natureOf = t => Math.floor(Number(t) / 1000) % 10;
const pick = (arr, i) => arr[((i % arr.length) + arr.length) % arr.length];

function makeWave(lv, natureList, bossType) {
  return natureList.map((nat, i) => {
    if (bossType && i === 0) {
      return { type: bossType, level: lv, nature: natureOf(bossType), boss: 1 };
    }
    const pool = NATURE_POOL[nat] || NATURE_POOL[3];
    const type = pick(pool, i * 2 + 1);
    return { type, level: lv, nature: natureOf(type) };
  });
}

// 关卡列表定义（天使 5 关 + 恶魔 5 关，每关含 3 个小节）
const FANTASY_STAGES = [
  // ---- 天使阵营 (camp = 1) ----
  { base: 1742010100, name: '愤怒之罪 1-1', lv: 50, boss: 1135024, camp: 1, stageId: 1 },
  { base: 1742010200, name: '愤怒之罪 1-2', lv: 50, boss: 1135024, camp: 1, stageId: 1 },
  { base: 1742010300, name: '愤怒之罪 1-3', lv: 50, boss: 1135024, camp: 1, stageId: 1, firstReward: 30000003 },
  { base: 1742010400, name: '慵懒的贝尔芬格 2-1', lv: 50, boss: 1136025, camp: 1, stageId: 2 },
  { base: 1742010500, name: '慵懒的贝尔芬格 2-2', lv: 50, boss: 1136025, camp: 1, stageId: 2 },
  { base: 1742010600, name: '慵懒的贝尔芬格 2-3', lv: 50, boss: 1136025, camp: 1, stageId: 2 },
  { base: 1742010700, name: '贪婪的玛门 3-1', lv: 65, boss: 1133026, camp: 1, stageId: 3 },
  { base: 1742010800, name: '贪婪的玛门 3-2', lv: 65, boss: 1133026, camp: 1, stageId: 3 },
  { base: 1742010900, name: '贪婪的玛门 3-3', lv: 65, boss: 1133026, camp: 1, stageId: 3 },
  { base: 1742011000, name: '欲望的阿斯莫德 4-1', lv: 70, boss: 1131027, camp: 1, stageId: 4 },
  { base: 1742011100, name: '欲望的阿斯莫德 4-2', lv: 70, boss: 1131027, camp: 1, stageId: 4 },
  { base: 1742011200, name: '欲望的阿斯莫德 4-3', lv: 70, boss: 1131027, camp: 1, stageId: 4 },
  { base: 1742011300, name: '破坏神亚巴顿 5-1', lv: 80, boss: 1146023, camp: 1, stageId: 5 },
  { base: 1742011400, name: '破坏神亚巴顿 5-2', lv: 80, boss: 1146023, camp: 1, stageId: 5 },
  { base: 1742011500, name: '破坏神亚巴顿 5-3', lv: 80, boss: 1143021, camp: 1, stageId: 5, firstReward: 31143021 },

  // ---- 恶魔阵营 (camp = 2) ----
  { base: 1742011600, name: '智天使乌列尔 1-1', lv: 50, boss: 2011004, camp: 2, stageId: 1 },
  { base: 1742011700, name: '智天使乌列尔 1-2', lv: 50, boss: 2011004, camp: 2, stageId: 1 },
  { base: 1742011800, name: '智天使乌列尔 1-3', lv: 50, boss: 2011004, camp: 2, stageId: 1, firstReward: 30000003 },
  { base: 1742011900, name: '魂之雷米尔 2-1', lv: 50, boss: 2011001, camp: 2, stageId: 2 },
  { base: 1742012000, name: '魂之雷米尔 2-2', lv: 50, boss: 2011001, camp: 2, stageId: 2 },
  { base: 1742012100, name: '魂之雷米尔 2-3', lv: 50, boss: 2011001, camp: 2, stageId: 2 },
  { base: 1742012200, name: '大地之拉贵尔 3-1', lv: 65, boss: 2011002, camp: 2, stageId: 3 },
  { base: 1742012300, name: '大地之拉贵尔 3-2', lv: 65, boss: 2011002, camp: 2, stageId: 3 },
  { base: 1742012400, name: '大地之拉贵尔 3-3', lv: 65, boss: 2011002, camp: 2, stageId: 3 },
  { base: 1742012500, name: '神之戒律沙利尔 4-1', lv: 70, boss: 2011003, camp: 2, stageId: 4 },
  { base: 1742012600, name: '神之戒律沙利尔 4-2', lv: 70, boss: 2011003, camp: 2, stageId: 4 },
  { base: 1742012700, name: '神之戒律沙利尔 4-3', lv: 70, boss: 2011003, camp: 2, stageId: 4 },
  { base: 1742012800, name: '极乐之拉斐尔 5-1', lv: 80, boss: 1143021, camp: 2, stageId: 5 },
  { base: 1742012900, name: '极乐之拉斐尔 5-2', lv: 80, boss: 1143021, camp: 2, stageId: 5 },
  { base: 1742013000, name: '极乐之拉斐尔 5-3', lv: 80, boss: 1143021, camp: 2, stageId: 5, firstReward: 31143021 },
];

const FANTASY_MAP_CONFIGS = {};

for (const s of FANTASY_STAGES) {
  const p1 = s.base + 1;
  const p5 = s.base + 5;
  const cfg = {
    mapId: 0,
    bornPos: 0,
    monsterChain: [],
    monsterFight: {},
    waves: {
      [s.base]: [makeWave(s.lv, [3, 2, 3], null)],
      [p1]: [makeWave(s.lv, [3, 2, 3], null)],
      [p5]: [makeWave(s.lv + 2, [3, 2, 1], s.boss)],
    },
    bossPoint: p5,
    fogAfter: {},
    rewardServant: [],
    actCopy: {
      actId: 1742,
      copyId: s.base,
      stageId: s.stageId,
      name: s.name,
      firstReward: s.firstReward || 0,
      batch: false,
    },
  };
  FANTASY_MAP_CONFIGS[s.base] = cfg;
  FANTASY_MAP_CONFIGS[p1] = cfg;
  FANTASY_MAP_CONFIGS[p5] = cfg;

  // 兼容旧版 copyID 映射 (1114/1431)
  const old1114 = s.base - 1742000000 + 1114000000;
  const old1431 = s.base - 1742000000 + 1431000000;
  FANTASY_MAP_CONFIGS[old1114] = cfg;
  FANTASY_MAP_CONFIGS[old1431] = cfg;
}

// 天使阵营与恶魔阵营的主线 5 个大关关底 ID
const ANGEL_STAGE_IDS = [1742010100, 1742010400, 1742010700, 1742011000, 1742011300];
const DEMON_STAGE_IDS = [1742011600, 1742011900, 1742012200, 1742012500, 1742012800];

module.exports = {
  FANTASY_STAGES,
  FANTASY_MAP_CONFIGS,
  ANGEL_STAGE_IDS,
  DEMON_STAGE_IDS,
};
