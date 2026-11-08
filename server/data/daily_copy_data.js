// 曜日副本（每日材料本，客户端 TYPE_DROP=2 / 功能 ID 4 / 通关 2-3 开启）配置。
//
// 客户端侧全部实证（tools/bc_cmp 反编译）：
//   CfgCopy.chapter          type=2 三章：1 修炼(openTimes{1,4,7}) / 2 进化({2,5,7}) / 3 圣器({3,6,7})
//                            openTimes 1=周一…7=周日。**bc 全目录只有 CfgCopy.lua 出现 openTimes，
//                            没有任何 Lua 模块读它** → 今日开放章节 100% 由服务端 m_copy_daily_info_toc 决定
//   CfgCopy.copy             9 关：2010101/2010201/2010301、2020101/…、2030101/…
//                            带 name/simpleName/suggestLv(15/45/80)/minLv(0/25/40)/round(3/4)
//   CfgCopyDetail            cost=10、enemyNature（修炼{6}暗 / 进化{2}火 / 圣器{1}水）、
//                            extraCondition 三条恒为 8/9/10 = "获得胜利"/"见敌必杀，一击致命"/"祝武运方昌"
//                            （后两条**无判定语义**，纯占位文案）、reward 预览、无 noHelp、无 firstReward
//   CopyDropView             章节页签靠 isDailyCopyChapterOpen(=服务端 chapters) 置灰；
//                            按钮 enable = barrierCanEnter(id)（= barrier 在 m_copy_barrier_info_toc 里）
//                            → **等级门槛靠"够等级才把 barrier 放进 barriers 数组"实现**；
//                            剩余次数 = 2 - RoleMgr.getDailyTimes(20000 + chapter)（**按章共用 2 次/天**）
//   进入链                    m_team_template_select_tos{copy_type=2} → m_copy_barrier_info_tos{copy=2,chapter=0}
//                            → m_servant_helper_info_tos → m_copy_fight_tos{copy_id} → 标准战斗链。
//                            **不走小地图**（CopyConst.COPY_TYPE_MAP 不含 TYPE_DROP，也不存在 CfgMap_2*）
//   奖励                     CfgCopyDetail.reward 里的 31000006/7/8「进化材料1/2/3」是**展示聚合道具**
//                            （CfgItems.data.showItems 分别列 20000000~08 / 09~18 / 19~25，本身不能用于进化），
//                            结算必须下发真实材料 ID。另注意 CopyResultVO 只过滤 form=3(FORM_NOT_BAG_SHOW) 的项，
//                            form=1/3 都会入背包（ItemConfig.isToBag），form=2 才是货币类
//
// 【本地服设计值】客户端完全没有的部分（怪物阵容/等级曲线/掉落权重与数量/星2星3判定/每日重置点）
// 集中在本文件下半段，都标了「设计」。
const FC = require('./fight_core');

// ---- 客户端硬口径 ----
const DAILY_TIMES_MAX = 2;          // CopyDropView.remainTimes = 2 - getDailyTimes(20000+chapter)
const DAILY_TIMES_KEY_BASE = 20000; // 计数 key = 20000 + 章号（20001/20002/20003）
const FUNC_ID_COPY_DROP = 4;        // GuideConst.FUNC_ID_COPY_DROP

const DAILY_CHAPTERS = {
  1: { name: '修炼副本', short: '修炼', openDays: [1, 4, 7], nature: 6, barriers: [2010101, 2010201, 2010301] },
  2: { name: '进化副本', short: '进化', openDays: [2, 5, 7], nature: 2, barriers: [2020101, 2020201, 2020301] },
  3: { name: '圣器副本', short: '圣器', openDays: [3, 6, 7], nature: 1, barriers: [2030101, 2030201, 2030301] },
};

// CfgCopy.copy 的三档门槛/建议等级/波数（tier 1/2/3 = 每章第几关）
const TIERS = {
  1: { minLv: 0, suggestLv: 15, rounds: 3 },
  2: { minLv: 25, suggestLv: 45, rounds: 4 },
  3: { minLv: 40, suggestLv: 80, rounds: 4 },
};

const BARRIER_NAMES = {
  2010101: '深层魔法-雨之束缚', 2010201: '深层魔法-风之束缚', 2010301: '深层魔法-光之束缚',
  2020101: '意志检定-临时疯狂', 2020201: '意志检定-不定疯狂', 2020301: '意志检定-永久疯狂',
  2030101: '精神分析-残酷献祭', 2030201: '精神分析-狂热献祭', 2030301: '精神分析-暴虐献祭',
};

// ---- 【设计】掉落表 ----
// pool = 本关材料池（结算随机抽 pick 种，每种 num 个）；fixed = 必给项。
// 进化章的池就是 CfgItems[31000006/7/8].showItems 三档原样；
// **20000026~20000030 五种稀有材料客户端在任何副本配置里都没有出处**（starItems 里有 6/3/3/4/3 只誓灵要用），
// 不补就永久卡进化 → 本地服把它们并进进化章第 3 关的池（数量少、只在最高档出）。
// 百变素材模型（20000903/904/905，1:1 替代对应档材料）官方也不从曜日出，
// 本地服每关必给 1 个，让「材料不足可消耗道具补充」这条客户端分支真正可达。
const MAT_TIER1 = [20000000, 20000001, 20000002, 20000003, 20000004, 20000005, 20000006, 20000007, 20000008];
const MAT_TIER2 = [20000009, 20000010, 20000011, 20000012, 20000013, 20000014, 20000015, 20000016, 20000017, 20000018];
const MAT_TIER3 = [20000019, 20000020, 20000021, 20000022, 20000023, 20000024, 20000025,
  20000026, 20000027, 20000028, 20000029, 20000030];

const DROPS = {
  // 修炼章：自然结晶（训练经验材料，data/train_data.js 的 TRAIN_ITEMS）
  2010101: { silver: 3000, pool: [20016000], pick: 1, num: 8, fixed: [] },
  2010201: { silver: 8000, pool: [20016001], pick: 1, num: 6, fixed: [[20016000, 6]] },
  2010301: { silver: 20000, pool: [20016002], pick: 1, num: 4, fixed: [[20016001, 6]] },
  // 进化章：进化材料三档（本次进化系统的材料闭环出处）
  2020101: { silver: 3000, pool: MAT_TIER1, pick: 3, num: 6, fixed: [[20000903, 1]] },
  2020201: { silver: 8000, pool: MAT_TIER2, pick: 3, num: 6, fixed: [[20000904, 1]] },
  2020301: { silver: 20000, pool: MAT_TIER3, pick: 3, num: 6, fixed: [[20000905, 1]] },
  // 圣器章：圣器/核心遗物箱 + 核心晶组（核心升级材料，data/relic_data.js）
  2030101: { silver: 3000, pool: [21002000, 21102000], pick: 1, num: 1, fixed: [[27000000, 4]] },
  2030201: { silver: 8000, pool: [21003000, 21103000], pick: 1, num: 1, fixed: [[27000001, 4]] },
  2030301: { silver: 20000, pool: [21007000, 21104000], pick: 1, num: 1, fixed: [[27000002, 4]] },
};

// ---- 【设计】敌方阵容 ----
// 客户端只给了 enemyNature（章属性）/ suggestLv（15/45/80）/ round（3 或 4 波），没有任何怪物表。
// 按「同属性 + 档位随关次抬升（色 2/3/4）+ 等级 = suggestLv + 波次微增」生成，
// HP 不覆盖（无 wiki 数值可考）→ 走 fight_core 官方公式，与主线口径一致。
const NATURE_POOL = {
  // nature: {color: [typeId...]}（取自 skill_data.SERVANT_PHYLE，均为有技能书的合法誓灵 id）
  6: { 2: [1126002, 1226002, 1426010, 1626006, 1126011], 3: [1036010, 1136017, 1336015, 1436004, 1336030], 4: [1046002, 1246003, 1346016, 1146023, 1446036] },
  2: { 2: [1422007, 1122014, 1522007, 1412013, 1112012], 3: [1032013, 1332013, 1432003, 1532004, 1032025], 4: [1042001, 1242006, 1342029, 1442021, 1142020] },
  1: { 2: [1421005, 1021014, 1521014, 1621015, 1421006], 3: [1331003, 1031011, 1131006, 1231010, 1331021], 4: [1141007, 1241004, 1341001, 1141028, 1241018] },
};
const COLOR_OF_TIER = { 1: 2, 2: 3, 3: 4 };

// 每波 3 只，末波 4 只（主线道中普遍 4 只，末波加压）
function wavesOf(barrierId) {
  const chapter = Math.floor(barrierId / 10000) % 10;
  const tier = Math.floor(barrierId / 100) % 10;
  const t = TIERS[tier];
  const pool = NATURE_POOL[DAILY_CHAPTERS[chapter].nature][COLOR_OF_TIER[tier]];
  const waves = [];
  for (let w = 0; w < t.rounds; w++) {
    const count = w === t.rounds - 1 ? 4 : 3;
    const wave = [];
    for (let i = 0; i < count; i++) {
      const type = pool[(w * 3 + i) % pool.length];
      wave.push({ type, level: t.suggestLv + w, nature: FC.natureOf(type) });
    }
    waves.push(wave);
  }
  return waves;
}

// 合成 MAP_CONFIG：曜日副本没有小地图，但战斗完全复用 map_fight 的回合引擎——
// 引擎只需要 waves[copyId] 与 bossPoint，monsterChain/fogAfter 留空即跳过全部地图推进分支。
// dailyCopy 标记供 map_fight 在结算时改走曜日奖励（见 onBattleWon / pushFightResult）
const DAILY_MAP_CONFIGS = {};
for (const [chapter, ch] of Object.entries(DAILY_CHAPTERS)) {
  ch.barriers.forEach((bid, idx) => {
    DAILY_MAP_CONFIGS[bid] = {
      mapId: 0, bornPos: 0, monsterChain: [], fogAfter: {}, monsterFight: {},
      waves: { [bid]: wavesOf(bid) },
      bossPoint: bid,
      rewardServant: [],
      dailyCopy: { chapter: Number(chapter), tier: idx + 1, name: BARRIER_NAMES[bid], chapterName: ch.short },
    };
  });
}

const DAILY_BARRIERS = {};
for (const [chapter, ch] of Object.entries(DAILY_CHAPTERS)) {
  ch.barriers.forEach((bid, idx) => {
    DAILY_BARRIERS[bid] = Object.assign({
      chapter: Number(chapter), tier: idx + 1, name: BARRIER_NAMES[bid], nature: ch.nature,
    }, TIERS[idx + 1]);
  });
}

// 今日开放章节（服务器本地星期；JS getDay 0=周日 → 折成 CfgCopy 的 1..7）
function openChaptersAt(date) {
  const d = date || new Date();
  const wd = d.getDay() === 0 ? 7 : d.getDay();
  return Object.keys(DAILY_CHAPTERS).map(Number).filter(c => DAILY_CHAPTERS[c].openDays.includes(wd));
}

// 结算掉落（随机抽 pick 种，权重均等）。rng 可注入便于冒烟测试
function rollDrops(barrierId, rng) {
  const d = DROPS[barrierId];
  if (!d) return [];
  const r = rng || Math.random;
  const out = (d.fixed || []).map(([id, num]) => ({ type: id, num }));
  const pool = d.pool.slice();
  const pick = Math.min(d.pick, pool.length);
  for (let i = 0; i < pick; i++) {
    const j = Math.floor(r() * pool.length) % pool.length;
    const id = pool.splice(j, 1)[0];
    out.push({ type: id, num: d.num });
  }
  return out;
}

module.exports = {
  DAILY_TIMES_MAX, DAILY_TIMES_KEY_BASE, FUNC_ID_COPY_DROP,
  DAILY_CHAPTERS, DAILY_BARRIERS, DAILY_MAP_CONFIGS, DROPS, TIERS,
  openChaptersAt, rollDrops, wavesOf,
};
