// 三活动全链路数据（2026-09-12 六十四）：约会大作战联动（1104 族）+ 苍色的试炼（1026/1765/1027）+ 星象馆通讯（1077）。
// 来源：
//   - BWIKI 攻略专题页 ×3（玩法结构/奖励表/等级）；
//   - 客户端反编译（tools/bc_cmp）：CfgActivity.planetarian（星图 21 星/3 章/needScore[灯泡,旧式部件]）、
//     CfgActivity2.dataALiveInfo（信赖 5 精灵 scoreId 46-50/rewardId 1-25）、CfgCopy/CfgCopyDetail
//     （关卡等级 round=3/掉落池）、cfgmission group4（60000-60017 苍色任务 / 55000-55007 星象馆任务）、
//     CfgActivity.starDreamPermit[1107]（动荡的时空 20 档双轨）。
// 战斗合成口径与 glasttour_data 相同（官方敌人阵容 wiki 即"随机"→ 从合法誓灵池按等级合成）。

// ---- 敌人池（合法誓灵 id，色 2/3/4/5 分档 + UR 段；glasttour/daily_copy 同口径）----
const NATURE_POOL = {
  1: [1112012, 1112015, 1412013, 1523009, 1033004],   // 水
  2: [1122014, 1421005, 1421006, 1522007, 1226002],   // 火
  3: [1131006, 1231010, 1032013, 1332013, 1131009],   // 风
  4: [1142020, 1242006, 1342029, 1442021, 1146023],   // 土
  5: [1042001, 1335004, 1445041, 1043006, 1533005],   // 光
  6: [1043006, 1335004, 1533005, 1131009, 2011001],   // 暗
};
const natureOf = t => Math.floor(Number(t) / 1000) % 10;
const pick = (arr, i) => arr[((i % arr.length) + arr.length) % arr.length];

// 三波敌人（每波 3 只；boss=true 的单位 hp 加成由关卡层指定）
function waves3(lv, opts) {
  const o = opts || {};
  const nats = o.natures || [1, 2, 3];
  return nats.map((nat, w) => {
    const pool = NATURE_POOL[nat] || NATURE_POOL[3];
    const wlv = o.lvFn ? o.lvFn(lv, w) : lv;
    return [0, 1, 2].map(i => ({ type: pick(pool, w * 3 + i), level: wlv, nature: natureOf(pick(pool, w * 3 + i)) }));
  });
}

// ==================================================================
// 一、星象馆通讯（1077 面板 / 1079 SideStory3 / 1080 潘多拉的决意）
// ==================================================================
// 星图 21 星（CfgActivity.planetarian.starMap）：needScore = [灯泡(score 40), 旧式部件(score 41)]
// （ActivityPlanetarianStarPanel.onLight 实证：needScore[1]↔LAMP、needScore[2]↔BATTERY）。
// type: 1/2/3=星体（对应三档消耗），4=不知名黑洞。
const PLAN_STARS = [
  { id: 1,  name: '大熊座α / Dubhe',   type: 1, lamp: 2, battery: 300, rewards: [[31141007, 1]] },
  { id: 2,  name: '大熊座β / Merak',   type: 1, lamp: 2, battery: 300, rewards: [[21500038, 1]] },
  { id: 3,  name: '大熊座γ / Phekda',  type: 1, lamp: 2, battery: 300, rewards: [[31000013, 1]] },
  { id: 4,  name: '大熊座ε / Alioth',  type: 1, lamp: 2, battery: 300, rewards: [[45050064, 1]] },
  { collab: 1, id: 5,  name: '大熊座ζ / Mizar',   type: 1, lamp: 2, battery: 300, rewards: [[21007000, 5]] },
  { collab: 1, id: 6,  name: '大熊座η / Alkaid',  type: 1, lamp: 2, battery: 300, rewards: [[21104000, 5]] },
  { id: 7,  name: '大熊座δ / Megrez',  type: 2, lamp: 2, battery: 150, rewards: [[31131006, 1]] },
  { id: 8,  name: '大熊座ο / 熊嘴',    type: 2, lamp: 2, battery: 150, rewards: [[28000025, 10]] },
  { id: 9,  name: '大熊座κ / 前爪',    type: 2, lamp: 2, battery: 150, rewards: [[20000904, 20], [20016002, 25]] },
  { id: 10, name: '大熊座μ / 熊掌',    type: 2, lamp: 2, battery: 150, rewards: [[20000905, 10], [20016002, 25]] },
  { id: 11, name: '大熊座ν / 肘子',    type: 2, lamp: 2, battery: 150, rewards: [[31000023, 5], [31000021, 50]] },
  { id: 12, name: '大熊座ψ / 肘子',    type: 2, lamp: 2, battery: 150, rewards: [[31000024, 5], [31000021, 50]] },
  { id: 13, name: '大熊座χ / 屁股',    type: 2, lamp: 2, battery: 150, rewards: [[25001062, 1], [30000003, 2500]] },
  { id: 14, name: '大熊座θ / 肘子',    type: 2, lamp: 2, battery: 150, rewards: [[25001235, 1], [30000003, 2500]] },
  { id: 15, name: '大熊座ξ / 脚趾',    type: 3, lamp: 0, battery: 500, rewards: [[31000023, 5], [31000024, 5]] },
  { id: 16, name: '大熊座λ / 脚趾',    type: 3, lamp: 0, battery: 500, rewards: [[26000002, 50], [26000001, 100]] },
  { id: 17, name: '大熊座υ / 脖子',    type: 3, lamp: 0, battery: 500, rewards: [[27000002, 50], [27000001, 100]] },
  { id: 18, name: '大熊座φ / 下巴',    type: 3, lamp: 0, battery: 500, rewards: [[20016002, 100], [20000903, 30]] },
  { id: 19, name: '大熊座Z1 / 额头',   type: 3, lamp: 0, battery: 500, rewards: [[31000021, 200], [60000038, 1]] },
  { id: 20, name: '大熊座Z2 / 脖子',   type: 3, lamp: 0, battery: 500, rewards: [[30000003, 15000], [60000038, 1]] },
  { id: 21, name: '不知名黑洞',        type: 4, lamp: 0, battery: 10,  rewards: [[30000000, 1]] },
];
// 章（CfgActivity.planetarian.chapter）：1/2=剧情剧场（theaterID），3=战斗副本（copyID）。
// needStar = 解锁所需点亮星数；章奖励 = BWIKI「废墟都市」（SideStory1 灯泡x2+旧式部件x150 /
// SideStory2 花束 / SideStory3 星野梦美+灯泡x1）。
const PLAN_CHAPTERS = [
  { id: 1, name: 'SideStory1', needStar: 0, theaterID: 1077001, copyID: 0,   rewards: [[60000038, 2], [60000039, 150]] },
  { id: 2, name: 'SideStory2', needStar: 3, theaterID: 1077002, copyID: 0,   rewards: [[28000024, 1]] },
  { id: 3, name: 'SideStory3', needStar: 5, theaterID: 0, copyID: 1079010100, rewards: [[2245001, 1], [60000038, 1]] },
];
const PLAN_LAMP_SCORE = 40;    // 灯泡（60000038→40，score_items.js）
const PLAN_BATTERY_SCORE = 41; // 旧式部件（60000039→41）

// SideStory3「废墟城市」（CfgCopy 1079010100 round=3）：BWIKI 道中 lv45-50、BOSS lv55
const PLAN_SIDE_COPY = 1079010100;
const PLAN_SIDE_WAVES = [
  [[{ type: 1242006, level: 45 }, { type: 1112012, level: 45 }, { type: 1421005, level: 45 }],
   [{ type: 1131006, level: 45 }, { type: 1043006, level: 45 }, { type: 1042001, level: 45 }],
   [{ type: 1042001, level: 50 }, { type: 1112012, level: 50 }, { type: 1131006, level: 50 }],
   [{ type: 1445041, level: 55, boss: 1 }, { type: 1335004, level: 55, boss: 1 }, { type: 1042001, level: 55, boss: 1 }]],
];
// 潘多拉的决意（CfgCopy 1080010101「星之梦高难」lv100；BWIKI BOSS lv120 九血条 → 单波高血量）
const PLAN_DARE_COPY = 1080010101;
const PLAN_DARE_WAVES = [
  [[{ type: 1533005, level: 100, boss: 1 }, { type: 1335004, level: 100 }, { type: 1131009, level: 100 }],
   [{ type: 1335004, level: 110, boss: 1 }, { type: 1533005, level: 110 }, { type: 2011004, level: 100 }],
   [{ type: 1043006, level: 120, boss: 1 }, { type: 2011001, level: 100 }, { type: 2011003, level: 100 }]],
];

// ==================================================================
// 二、苍色的试炼（1026 面板 / 1765 签到期 / 1027 究极试炼）
// ==================================================================
const BILI_EX_COPY = 1027020100;   // CopyConst.COPY_BILI；Bili2233VO.FIGHT_COPY_ID
const BILI_ACT_VIEW = 1765;        // ActivityConst.ACT_BILI_2233_RENOVATE（签到 accum 期 id；
                                   // 注意战斗 act 是 FIGHT_ACT_ID_RENOVATE=1769，见 activity.js ACT_OPEN）
const BILI_TICKET = 10;            // 每日挑战次数（BWIKI：每日有挑战次数上限；一期口径）
const BILI_COST_CHIP = 30;         // 每场消耗哔哩芯片 30（score 11）
const BILI_CHIP_SCORE = 11;        // Bili2233VO.SCORE_ID；60000004→11
// 评级（BWIKI 击败数→评级）：累计击杀达阈值即达评级
const BILI_GRADES = [
  { rank: 1, name: 'C', kills: 21 }, { rank: 2, name: 'B', kills: 41 }, { rank: 3, name: 'A', kills: 66 },
  { rank: 4, name: 'S', kills: 91 }, { rank: 5, name: 'SS', kills: 121 }, { rank: 6, name: 'SSS', kills: 151 },
];
// 训练员敌人（击杀任务 args 三类 + 究极双 BOSS）：用合法誓灵 id 模拟（kind 名驱动任务）
const BILI_TRAINERS = {
  筋力的训练员: { pool: NATURE_POOL[2], lv: 55 },
  熟虑的训练员: { pool: NATURE_POOL[1], lv: 55 },
  暴走的训练器: { pool: NATURE_POOL[3], lv: 60 },
};
// ⚠️ 波数上限 = 客户端 CfgCopy[1027020100].round（2026-10-13 一百七十四实证）：
// SceneUnitManager.updateMap 铺 `round+2` 段（段 j 中心 -20+20*(j-1)，半宽 10 → 覆盖 [-30, 20*round+10]）；
// 每波推进 near 层平移 -20*batch → 第 k 波需局部 20k 被覆盖 → **k <= round**。
// 本副本 round=3 → 最多 3 波；此前配 6 波，第 4 波（需 80）起地图已铺完（-30..70），
// 表现=「打着打着地板消失」+ 宽屏设备左侧露出段外空白。
// 单波敌方上限 6（map_fight pushFightRound 的 slice(0,6) 硬限）→ 3 波容量 18。
// 故：3 波 × 6 只 = 18 只（原 6 波 20 只，末波双究极 BOSS 保留，舍弃 2 只普通训练员怪）。
// 评级不受影响：18/场 → 累计 126 杀达 SS（原 20/场需 7 场，现 7 场 126 同样达标）。
const BILI_EX_WAVES = (() => {
  const kinds = Object.keys(BILI_TRAINERS);
  const waves = [];
  for (let w = 0; w < 3; w++) { // 3 波（= round 上限）× 6 只 = 单场 18 击杀
    const k = kinds[w % kinds.length];
    const t = BILI_TRAINERS[k];
    const wave = [0, 1, 2, 3, 4, 5].map(i => {
      const type = pick(t.pool, w * 6 + i);
      return { type, level: t.lv, nature: natureOf(type), trainer: k };
    });
    waves.push(wave);
  }
  // 最后一波末尾两位替换为双究极（光社畜 + 暗筋肉，BWIKI：光高魔抗/暗高物抗 → 用高星段表现）
  waves[2][4] = { type: 1445041, level: 70, nature: 5, boss: 1, trainer: '任意训练员' };
  waves[2][5] = { type: 1335004, level: 70, nature: 6, boss: 1, trainer: '任意训练员' };
  return waves;
})();
// 签到（ACT_BILI_2233_RENOVATE=1765 走 accum 族，7 天奖励表在 act_extra_data.ACCUM[1765]）

// ==================================================================
// 三、约会大作战（1104 主线 15 关 / 1106 挑战 / 1109·1119 高难 / 1105 信赖 / 1107 动荡的时空）
// ==================================================================
const DAL_ACT = 1104;
// CfgCopy：1104010100~1104011500，round=3，suggestLv 曲线（name 约战主线1-1..2-7）
const DAL_STAGES = [
  { copyId: 1104010100, name: '约战主线1-1', lv: 10 },
  { copyId: 1104010200, name: '约战主线1-2', lv: 20 },
  { copyId: 1104010300, name: '约战主线1-3', lv: 25 },
  { copyId: 1104010400, name: '约战主线1-4', lv: 30 },
  { copyId: 1104010500, name: '约战主线1-5', lv: 35 },
  { copyId: 1104010600, name: '约战主线1-6', lv: 40 },
  { copyId: 1104010700, name: '约战主线1-7', lv: 45 },
  { copyId: 1104010800, name: '约战主线1-8', lv: 45 },
  { copyId: 1104010900, name: '约战主线2-1', lv: 45 },
  { copyId: 1104011000, name: '约战主线2-2', lv: 45 },
  { copyId: 1104011100, name: '约战主线2-3', lv: 50 },
  { copyId: 1104011200, name: '约战主线2-4', lv: 50 },
  { copyId: 1104011300, name: '约战主线2-5', lv: 50 },
  { copyId: 1104011400, name: '约战主线2-6', lv: 50 },
  { copyId: 1104011500, name: '约战主线2-7', lv: 50 },
];
const DAL_WEEKLY = [
  { copyId: 1106010101, name: '约战周回简单', lv: 30, times: 10, fragments: 1 },
  { copyId: 1106010102, name: '约战周回困难', lv: 80, times: 10, fragments: 2 },
];
// 联动圣器碎片（CfgItems：40 碎片合成一圣器）：刻刻帝/灼烂歼鬼/冰结傀儡/鏖杀公/绝灭天使
const DAL_FRAGMENTS = [31000035, 31000036, 31000037, 31000039, 31000038];
// 高难（BWIKI：首通=联动头像框+原初遗物箱+金币；1109 一期=时崎狂三「食时之城」/ 1119 二期=折纸「绝灭天使」）
const DAL_HARD = [
  { copyId: 1109010101, name: '约战一期高难', lv: 100, frame: 41000014, gold: 5000, need: 1104010800 },
  { copyId: 1119010101, name: '约战二期高难', lv: 100, frame: 41000015, gold: 5000, need: 1104011500 },
];
const DAL_HARD_BOXES = [[21007000, 1], [21104000, 1]]; // 原初圣器遗物箱 + 原初核心遗物箱
// 主线首通（沿用 BWIKI 活动奖励口径：联动圣器箱/芯片；单次关 copyTimes=1）
const DAL_MAIN_FIRST = [[21007000, 1]];
// 剧情剧场（CfgCopyActivity[1104].actEnterItems：1104001 开场 + 每关前一段，本地播放走已实现 theatre 链）
const DAL_THEATERS = [1104001, 1104002, 1104003, 1104004, 1104005, 1104006, 1104007, 1104008, 1104009, 1104010, 1104011, 1104012, 1104013, 1104014, 1104015, 1104016];

// 1105 精灵信赖（CfgActivity2.dataALiveInfo）：官方阈值 300/600/1000/1500/2000（BWIKI 精灵们的信赖）
const DAL_TRUST_THRESHOLDS = [300, 600, 1000, 1500, 2000];

// 1107 动荡的时空（CfgActivity.starDreamPermit[1107]）：
//  - 时间晶体走 m_act_score_exchange 的 score（客户端 getTimeStar=scoreList 首项）；
//    score id 用 2250（role_scores 空闲位，客户端按 id 读推送值，无配置依赖）
//  - rewardsList（46 项，含物品）在客户端本地 → 服务端只推 {id, val:状态}；
//  - 20 档双轨：idList[0]=免费轨 id 1..20，idList[1]=加速引擎轨 id 24..43（购买引擎= buff 1108 才可领）。
const STAR_CRYSTAL_SCORE = 2250;
// CfgActivity.starDreamPermit 提取（tools/bc_cmp/tmp_act_lookup.py 生成）：rewards=客户端 rewardsList
// （物品内容本地展示+服务端发放同源），tiers=rewardsInfo（score 阈值 / free=免费轨 rewardId / engine=加速引擎轨 rewardId）
const STAR_DREAM = {"1083": {"engineAct": 1082, "rewards": [{"id": 1, "rw": [[26000000, 50], [27000000, 50]]}, {"id": 2, "rw": [[30000003, 3000]]}, {"id": 3, "rw": [[20016002, 100]]}, {"id": 4, "rw": [[20000903, 30]]}, {"id": 5, "rw": [[26000001, 25], [27000001, 25]]}, {"id": 6, "rw": [[31131006, 1]]}, {"id": 7, "rw": [[30000002, 1000], [20000026, 10]]}, {"id": 8, "rw": [[30000003, 5000], [20000027, 5]]}, {"id": 9, "rw": [[32245001, 1]]}, {"id": 10, "rw": [[26000002, 30], [27000002, 30]]}, {"id": 11, "rw": [[20000904, 10], [20000905, 10]]}, {"id": 12, "rw": [[21007000, 3], [21104000, 3]]}, {"id": 13, "rw": [[30000003, 10000], [20000028, 5]]}, {"id": 14, "rw": [[31000023, 5], [20000029, 5]]}, {"id": 15, "rw": [[20016002, 200]]}, {"id": 16, "rw": [[31000021, 200]]}, {"id": 17, "rw": [[21500038, 1]]}, {"id": 18, "rw": [[26000000, 50], [27000000, 50]]}, {"id": 19, "rw": [[30000003, 3000], [20016002, 50]]}, {"id": 20, "rw": [[32245001, 1]]}, {"id": 21, "rw": [[20000903, 30], [20000904, 15]]}, {"id": 22, "rw": [[31131006, 1], [27000001, 25]]}, {"id": 23, "rw": [[32245001, 1]]}, {"id": 24, "rw": [[30000002, 2000], [20000026, 10]]}, {"id": 25, "rw": [[31131006, 1], [20000027, 5]]}, {"id": 26, "rw": [[32245001, 1]]}, {"id": 27, "rw": [[26000002, 30], [27000002, 30]]}, {"id": 28, "rw": [[20000904, 15], [20000905, 15]]}, {"id": 29, "rw": [[32245001, 1], [20000028, 5]]}, {"id": 30, "rw": [[30000003, 15000], [20016002, 100]]}, {"id": 31, "rw": [[31000023, 5], [31000024, 5]]}, {"id": 32, "rw": [[32245001, 1], [20000029, 5]]}, {"id": 33, "rw": [[31000021, 250], [31000025, 10]]}, {"id": 34, "rw": [[31000026, 1], [32245001, 1]]}], "tiers": [{"score": 2500, "free": 1, "engine": 18}, {"score": 5000, "free": 2, "engine": 19}, {"score": 7500, "free": 3, "engine": 20}, {"score": 10000, "free": 4, "engine": 21}, {"score": 15000, "free": 5, "engine": 22}, {"score": 20000, "free": 6, "engine": 23}, {"score": 25000, "free": 7, "engine": 24}, {"score": 30000, "free": 8, "engine": 25}, {"score": 35000, "free": 9, "engine": 26}, {"score": 40000, "free": 10, "engine": 27}, {"score": 45000, "free": 11, "engine": 28}, {"score": 50000, "free": 12, "engine": 29}, {"score": 55000, "free": 13, "engine": 30}, {"score": 60000, "free": 14, "engine": 31}, {"score": 65000, "free": 15, "engine": 32}, {"score": 70000, "free": 16, "engine": 33}, {"score": 80000, "free": 17, "engine": 34}], "scoreId": 2250}, "1107": {"engineAct": 1108, "rewards": [{"id": 1, "rw": [[30000003, 1000]]}, {"id": 2, "rw": [[26000000, 50], [27000000, 50]]}, {"id": 3, "rw": [[31000009, 150]]}, {"id": 4, "rw": [[20000903, 30], [20016002, 20]]}, {"id": 5, "rw": [[30000002, 1000]]}, {"id": 6, "rw": [[26000001, 40], [27000001, 40]]}, {"id": 7, "rw": [[21104000, 2]]}, {"id": 8, "rw": [[20000904, 30], [20016002, 30]]}, {"id": 9, "rw": [[30000002, 1000], [30000003, 3000]]}, {"id": 10, "rw": [[26000002, 30], [27000002, 30]]}, {"id": 11, "rw": [[21007000, 2]]}, {"id": 12, "rw": [[20000905, 15], [20016002, 50]]}, {"id": 13, "rw": [[31131006, 1]]}, {"id": 14, "rw": [[30000002, 1000], [30000003, 5000]]}, {"id": 15, "rw": [[31000023, 5], [31000024, 5]]}, {"id": 16, "rw": [[30000003, 5000], [28000025, 5]]}, {"id": 17, "rw": [[31000021, 200], [20016002, 50]]}, {"id": 18, "rw": [[21104000, 3]]}, {"id": 19, "rw": [[21007000, 3]]}, {"id": 20, "rw": [[32341005, 1]]}, {"id": 21, "rw": [[31000023, 5], [31000024, 5]]}, {"id": 22, "rw": [[21500038, 1]]}, {"id": 23, "rw": [[31131006, 1]]}, {"id": 24, "rw": [[30000003, 2000]]}, {"id": 25, "rw": [[26000000, 50], [27000000, 50]]}, {"id": 26, "rw": [[31000009, 300]]}, {"id": 27, "rw": [[20000903, 30], [20016002, 40]]}, {"id": 28, "rw": [[32341005, 1]]}, {"id": 29, "rw": [[26000001, 40], [27000001, 40]]}, {"id": 30, "rw": [[32341005, 1]]}, {"id": 31, "rw": [[20000904, 30], [20016002, 60]]}, {"id": 32, "rw": [[32341005, 1]]}, {"id": 33, "rw": [[26000002, 30], [27000002, 30]]}, {"id": 34, "rw": [[32341005, 1]]}, {"id": 35, "rw": [[20000905, 15], [20016002, 100]]}, {"id": 36, "rw": [[20000026, 10], [20000027, 5]]}, {"id": 37, "rw": [[32341005, 1], [31000023, 10]]}, {"id": 38, "rw": [[20000028, 5], [20000029, 5]]}, {"id": 39, "rw": [[30000003, 10000], [28000025, 10]]}, {"id": 40, "rw": [[32341005, 1], [31000024, 10]]}, {"id": 41, "rw": [[21104000, 5]]}, {"id": 42, "rw": [[21007000, 5]]}, {"id": 43, "rw": [[32341005, 1]]}, {"id": 44, "rw": [[31000013, 1]]}, {"id": 45, "rw": [[31000026, 1]]}, {"id": 46, "rw": [[31141007, 1]]}], "tiers": [{"score": 2500, "free": 1, "engine": 24}, {"score": 5000, "free": 2, "engine": 25}, {"score": 7500, "free": 3, "engine": 26}, {"score": 10000, "free": 4, "engine": 27}, {"score": 15000, "free": 5, "engine": 28}, {"score": 20000, "free": 6, "engine": 29}, {"score": 25000, "free": 7, "engine": 30}, {"score": 30000, "free": 8, "engine": 31}, {"score": 35000, "free": 9, "engine": 32}, {"score": 40000, "free": 10, "engine": 33}, {"score": 45000, "free": 11, "engine": 34}, {"score": 50000, "free": 12, "engine": 35}, {"score": 55000, "free": 13, "engine": 36}, {"score": 60000, "free": 14, "engine": 37}, {"score": 65000, "free": 15, "engine": 38}, {"score": 70000, "free": 16, "engine": 39}, {"score": 75000, "free": 17, "engine": 40}, {"score": 80000, "free": 18, "engine": 41}, {"score": 90000, "free": 19, "engine": 42}, {"score": 100000, "free": 20, "engine": 43}, {"score": 110000, "free": 21, "engine": 44}, {"score": 120000, "free": 22, "engine": 45}, {"score": 130000, "free": 23, "engine": 46}], "scoreId": 2250}, "1311": {"engineAct": 1314, "rewards": [{"id": 1, "rw": [[26000000, 50], [27000000, 50]]}, {"id": 2, "rw": [[30000002, 1000], [30000003, 5000]]}, {"id": 3, "rw": [[20016002, 50]]}, {"id": 4, "rw": [[30000003, 7000]]}, {"id": 5, "rw": [[26000001, 40], [27000001, 40]]}, {"id": 6, "rw": [[20000903, 30], [20000904, 20]]}, {"id": 7, "rw": [[31131006, 1]]}, {"id": 8, "rw": [[26000002, 30], [27000002, 30]]}, {"id": 9, "rw": [[33143004, 1]]}, {"id": 10, "rw": [[20016002, 50], [20000026, 20]]}, {"id": 11, "rw": [[33146005, 1]]}, {"id": 12, "rw": [[20016002, 50], [20000027, 10]]}, {"id": 13, "rw": [[21104000, 3]]}, {"id": 14, "rw": [[20016002, 50], [20000028, 10]]}, {"id": 15, "rw": [[21007000, 3]]}, {"id": 16, "rw": [[20016002, 50], [20000029, 10]]}, {"id": 17, "rw": [[31000021, 300], [31000023, 10]]}, {"id": 18, "rw": [[20016002, 100], [30000003, 10000]]}, {"id": 19, "rw": [[21500038, 1]]}, {"id": 20, "rw": [[26000000, 50], [27000000, 50]]}, {"id": 21, "rw": [[30000002, 2000], [30000003, 10000]]}, {"id": 22, "rw": [[20016002, 100]]}, {"id": 23, "rw": [[33143004, 1], [33146005, 1]]}, {"id": 24, "rw": [[26000001, 40], [27000001, 40]]}, {"id": 25, "rw": [[20000903, 30], [20000904, 20]]}, {"id": 26, "rw": [[33143004, 1], [33146005, 1]]}, {"id": 27, "rw": [[26000002, 30], [27000002, 30]]}, {"id": 28, "rw": [[20000905, 10], [30000003, 10000]]}, {"id": 29, "rw": [[33143004, 1], [33146005, 1]]}, {"id": 30, "rw": [[20016002, 100], [30000003, 10000]]}, {"id": 31, "rw": [[33143004, 1], [33146005, 1]]}, {"id": 32, "rw": [[21104000, 3]]}, {"id": 33, "rw": [[33143004, 1], [33146005, 1]]}, {"id": 34, "rw": [[21007000, 3]]}, {"id": 35, "rw": [[33143004, 1], [33146005, 1]]}, {"id": 36, "rw": [[31000021, 300], [31000024, 10]]}, {"id": 37, "rw": [[33143004, 1], [33146005, 1]]}, {"id": 38, "rw": [[21500038, 1], [31000026, 1]]}], "tiers": [{"score": 2500, "free": 1, "engine": 20}, {"score": 5000, "free": 2, "engine": 21}, {"score": 7500, "free": 3, "engine": 22}, {"score": 10000, "free": 4, "engine": 23}, {"score": 15000, "free": 5, "engine": 24}, {"score": 20000, "free": 6, "engine": 25}, {"score": 25000, "free": 7, "engine": 26}, {"score": 30000, "free": 8, "engine": 27}, {"score": 35000, "free": 9, "engine": 28}, {"score": 40000, "free": 10, "engine": 29}, {"score": 45000, "free": 11, "engine": 30}, {"score": 50000, "free": 12, "engine": 31}, {"score": 55000, "free": 13, "engine": 32}, {"score": 60000, "free": 14, "engine": 33}, {"score": 65000, "free": 15, "engine": 34}, {"score": 70000, "free": 16, "engine": 35}, {"score": 80000, "free": 17, "engine": 36}, {"score": 90000, "free": 18, "engine": 37}, {"score": 100000, "free": 19, "engine": 38}], "scoreId": 2250}, "1325": {"engineAct": 1326, "scoreId": 2128, "rewards": [{"id": 1, "rw": [[30000003, 1000]]}, {"id": 2, "rw": [[26000000, 50], [27000000, 50]]}, {"id": 3, "rw": [[31000009, 150]]}, {"id": 4, "rw": [[20016002, 50]]}, {"id": 5, "rw": [[20000903, 30], [20000904, 30]]}, {"id": 6, "rw": [[21007000, 2]]}, {"id": 7, "rw": [[30000002, 1000], [30000003, 5000]]}, {"id": 8, "rw": [[26000001, 40], [27000001, 40]]}, {"id": 9, "rw": [[21104000, 2]]}, {"id": 10, "rw": [[20000905, 15], [30000003, 5000]]}, {"id": 11, "rw": [[31131006, 1]]}, {"id": 12, "rw": [[26000002, 30], [27000002, 30]]}, {"id": 13, "rw": [[30000003, 5000], [28000025, 5]]}, {"id": 14, "rw": [[20016002, 50]]}, {"id": 15, "rw": [[30000002, 1000], [30000003, 5000]]}, {"id": 16, "rw": [[31131006, 1]]}, {"id": 17, "rw": [[31000013, 1]]}, {"id": 18, "rw": [[30000003, 2000]]}, {"id": 19, "rw": [[26000000, 50], [27000000, 50]]}, {"id": 20, "rw": [[31000009, 300]]}, {"id": 21, "rw": [[31131006, 1], [20016002, 100]]}, {"id": 22, "rw": [[20000903, 30], [20000904, 30]]}, {"id": 23, "rw": [[31131006, 1], [21007000, 5]]}, {"id": 24, "rw": [[30000002, 2000], [30000003, 10000]]}, {"id": 25, "rw": [[26000001, 40], [27000001, 40]]}, {"id": 26, "rw": [[31131006, 1], [21104000, 5]]}, {"id": 27, "rw": [[20000905, 15], [30000003, 5000]]}, {"id": 28, "rw": [[31141007, 1]]}, {"id": 29, "rw": [[26000002, 30], [27000002, 30]]}, {"id": 30, "rw": [[30000003, 10000], [28000025, 10]]}, {"id": 31, "rw": [[31131006, 1], [20016002, 100]]}, {"id": 32, "rw": [[30000002, 2000], [30000003, 10000]]}, {"id": 33, "rw": [[31141007, 1]]}, {"id": 34, "rw": [[31000013, 1]]}], "tiers": [{"score": 2500, "free": 1, "engine": 18}, {"score": 5000, "free": 2, "engine": 19}, {"score": 7500, "free": 3, "engine": 20}, {"score": 10000, "free": 4, "engine": 21}, {"score": 15000, "free": 5, "engine": 22}, {"score": 20000, "free": 6, "engine": 23}, {"score": 25000, "free": 7, "engine": 24}, {"score": 30000, "free": 8, "engine": 25}, {"score": 35000, "free": 9, "engine": 26}, {"score": 40000, "free": 10, "engine": 27}, {"score": 45000, "free": 11, "engine": 28}, {"score": 50000, "free": 12, "engine": 29}, {"score": 55000, "free": 13, "engine": 30}, {"score": 60000, "free": 14, "engine": 31}, {"score": 65000, "free": 15, "engine": 32}, {"score": 70000, "free": 16, "engine": 33}, {"score": 80000, "free": 17, "engine": 34}]}, "1327": {"engineAct": 1328, "scoreId": 75, "rewards": [{"id": 1, "rw": [[30000003, 1000]]}, {"id": 2, "rw": [[26000000, 50], [27000000, 50]]}, {"id": 3, "rw": [[31000009, 150]]}, {"id": 4, "rw": [[20016002, 50]]}, {"id": 5, "rw": [[20000903, 30], [20000904, 30]]}, {"id": 6, "rw": [[21007000, 2]]}, {"id": 7, "rw": [[30000002, 1000], [30000003, 5000]]}, {"id": 8, "rw": [[26000001, 40], [27000001, 40]]}, {"id": 9, "rw": [[21104000, 2]]}, {"id": 10, "rw": [[20000905, 15], [30000003, 5000]]}, {"id": 11, "rw": [[31131006, 1]]}, {"id": 12, "rw": [[26000002, 30], [27000002, 30]]}, {"id": 13, "rw": [[30000003, 5000], [28000025, 5]]}, {"id": 14, "rw": [[20016002, 50]]}, {"id": 15, "rw": [[30000002, 1000], [30000003, 5000]]}, {"id": 16, "rw": [[31131006, 1]]}, {"id": 17, "rw": [[31000013, 1]]}, {"id": 18, "rw": [[30000003, 2000]]}, {"id": 19, "rw": [[26000000, 50], [27000000, 50]]}, {"id": 20, "rw": [[31000009, 300]]}, {"id": 21, "rw": [[31131006, 1], [20016002, 100]]}, {"id": 22, "rw": [[20000903, 30], [20000904, 30]]}, {"id": 23, "rw": [[31131006, 1], [21007000, 5]]}, {"id": 24, "rw": [[30000002, 2000], [30000003, 10000]]}, {"id": 25, "rw": [[26000001, 40], [27000001, 40]]}, {"id": 26, "rw": [[31131006, 1], [21104000, 5]]}, {"id": 27, "rw": [[20000905, 15], [30000003, 5000]]}, {"id": 28, "rw": [[31141007, 1]]}, {"id": 29, "rw": [[26000002, 30], [27000002, 30]]}, {"id": 30, "rw": [[30000003, 10000], [28000025, 10]]}, {"id": 31, "rw": [[31131006, 1], [20016002, 100]]}, {"id": 32, "rw": [[30000002, 2000], [30000003, 10000]]}, {"id": 33, "rw": [[31141007, 1]]}, {"id": 34, "rw": [[31000013, 1]]}], "tiers": [{"score": 2500, "free": 1, "engine": 18}, {"score": 5000, "free": 2, "engine": 19}, {"score": 7500, "free": 3, "engine": 20}, {"score": 10000, "free": 4, "engine": 21}, {"score": 15000, "free": 5, "engine": 22}, {"score": 20000, "free": 6, "engine": 23}, {"score": 25000, "free": 7, "engine": 24}, {"score": 30000, "free": 8, "engine": 25}, {"score": 35000, "free": 9, "engine": 26}, {"score": 40000, "free": 10, "engine": 27}, {"score": 45000, "free": 11, "engine": 28}, {"score": 50000, "free": 12, "engine": 29}, {"score": 55000, "free": 13, "engine": 30}, {"score": 60000, "free": 14, "engine": 31}, {"score": 65000, "free": 15, "engine": 32}, {"score": 70000, "free": 16, "engine": 33}, {"score": 80000, "free": 17, "engine": 34}]}};

// ==================================================================
// 任务表（cfgmission group=4；服务端下发 id+进度，文本/奖励展示在客户端本地）
// ==================================================================
// 苍色的试炼（60000-60017；奖励从 CfgMission 提取，[id,num]）
const BILI_MISSIONS = [
  { collab: 1, id: 60004, group: 2, cond: 14, num: 1, args: '', rewards: [[60000004, 20]], activity: 0 },          // 每日：进行1次誓约破除
  { collab: 1, id: 60005, group: 2, cond: 16, num: 1, args: '', rewards: [[60000004, 20]], activity: 0 },          // 每日：进行1次誓灵训练
  { collab: 1, id: 60006, group: 2, cond: 8, num: 1, args: '', rewards: [[60000004, 20]], activity: 0 },           // 每日：进行1次神迹演武
  { collab: 1, id: 60007, group: 2, cond: 25, num: 3, args: '筋力的训练员', rewards: [[60000004, 20]], activity: 0 },
  { collab: 1, id: 60008, group: 2, cond: 25, num: 3, args: '熟虑的训练员', rewards: [[60000004, 20]], activity: 0 },
  { collab: 1, id: 60009, group: 2, cond: 25, num: 5, args: '暴走的训练器', rewards: [[60000004, 20]], activity: 0 },
  { collab: 1, id: 60010, group: 2, cond: 12, num: 5, args: '主线', rewards: [[60000004, 40]], activity: 0 },
  { collab: 1, id: 60011, group: 2, cond: 25, num: 15, args: '任意训练员', rewards: [[60000004, 40]], activity: 0 },
  { collab: 1, id: 60000, group: 4, cond: 25, num: 20, args: '任意训练员', rewards: [[60000004, 100], [30000003, 1000]], activity: 0 },
  { collab: 1, id: 60001, group: 4, cond: 25, num: 40, args: '任意训练员', rewards: [[60000004, 150], [30000003, 1000], [21104000, 1]], activity: 0 },
  { collab: 1, id: 60002, group: 4, cond: 25, num: 60, args: '任意训练员', rewards: [[60000004, 200], [30000003, 2000], [31131006, 1]], activity: 0 },
  { collab: 1, id: 60003, group: 4, cond: 25, num: 100, args: '任意训练员', rewards: [[60000004, 300], [30000003, 3000], [25001192, 1]], activity: 0 },
  { collab: 1, id: 60017, group: 4, cond: 26, num: 1, args: 'C', rewards: [[30000003, 1000]], activity: 0 },
  { collab: 1, id: 60016, group: 4, cond: 26, num: 1, args: 'B', rewards: [[20016002, 5]], activity: 0 },
  { collab: 1, id: 60015, group: 4, cond: 26, num: 1, args: 'A', rewards: [[45000004, 1]], activity: 0 },
  { collab: 1, id: 60014, group: 4, cond: 26, num: 1, args: 'S', rewards: [[31131006, 1]], activity: 0 },
  { collab: 1, id: 60013, group: 4, cond: 26, num: 1, args: 'SS', rewards: [[21007000, 1]], activity: 0 },
  { collab: 1, id: 60012, group: 4, cond: 26, num: 1, args: 'SSS', rewards: [[25001035, 1]], activity: 0 },
];
// 星象馆通讯（55000-55007；每日=签到/4日常 + 各日常给旧式部件）
const PLAN_MISSIONS = [
  { collab: 1, id: 55000, group: 2, cond: 68, num: 1, args: '', rewards: [[60000038, 1]], activity: 0 },   // 每日签到
  { collab: 1, id: 55001, group: 2, cond: 69, num: 4, args: '', rewards: [[60000038, 1]], activity: 0 },   // 完成4个活动日常
  { collab: 1, id: 55002, group: 2, cond: 12, num: 10, args: '主线', rewards: [[60000039, 20]], activity: 0 },
  { collab: 1, id: 55003, group: 2, cond: 8, num: 5, args: '', rewards: [[60000039, 20]], activity: 0 },   // 演武5次
  { collab: 1, id: 55004, group: 2, cond: 9, num: 3, args: '', rewards: [[60000039, 20]], activity: 0 },   // 派遣3次
  { collab: 1, id: 55005, group: 2, cond: 16, num: 2, args: '', rewards: [[60000039, 20]], activity: 0 },  // 训练2次
  { collab: 1, id: 55006, group: 2, cond: 7, num: 1, args: '', rewards: [[60000039, 20]], activity: 0 },   // 召唤1次
  { collab: 1, id: 55007, group: 2, cond: 70, num: 2000, args: '', rewards: [[60000039, 20]], activity: 0 }, // 消耗2000金币
];

// ==================================================================
// 商店（shop 74 兑换屋，货币=哔哩芯片 score 11；BWIKI 兑换列表）
// ==================================================================
// ⚠️ 誓灵类商品的 type_id 必须用 **CfgItems 誓灵凭证**（30000000+誓灵type，form=3），
// 不能用裸誓灵 type——客户端两条分支（fillDetailGoods/fillDetailServant）第一步都是
// fillCommonItemVO(typeID) → ItemConfig.getItemVO：裸 type 不在 CfgItems ⇒
// "道具不存在：ID=1835001" 刷屏 + 空壳 VO（BaseItemVO 类默认 typeId=0）⇒
// ShopItemSmall.onGUI 再拿 typeId=0 查一次 ⇒ "道具不存在：ID=0" 跟着刷（10-17/10-28 两轮真机实证）。
// tag 第 6-7 位=3（ShopConst.SHOP_ITEM_SERVANT）只决定走 fillDetailServant：第二步
// getServantConfigVO(getServandTypeID_by_TypeID(typeID))，该函数 = typeID % 10^7，
// 凭证 31835001 取模正好还原 22 的誓灵 type 1835001（CfgServant 命中）。tag=300000：位6=3、位7=0、位8=0（未拥有）。
// 购买侧 shop.js 用同式 `% 10^7` 把凭证还原成誓灵 type 再 grantServant（对 7 位裸 type 幂等）。
const BILI_SHOP_GOODS = [
  { id: 7401, type_id: 31835001, num: 1, price: 400, total_times: 1, currency: 11, servant: 1, tag: 300000 }, // 22（SR 誓灵，type_id=誓灵凭证）
  { id: 7402, type_id: 31131006, num: 1, price: 300, total_times: 1, currency: 11 }, // 黄金史莱喵
  { id: 7403, type_id: 31836002, num: 1, price: 400, total_times: 1, currency: 11, servant: 1, tag: 300000 }, // 33（SR 誓灵，type_id=誓灵凭证）
  { id: 7404, type_id: 21007000, num: 1, price: 50, total_times: 5, currency: 11 },  // 原初圣器遗物箱
  { id: 7405, type_id: 21104000, num: 1, price: 50, total_times: 5, currency: 11 },  // 原初核心遗物箱
  { id: 7406, type_id: 20016002, num: 1, price: 15, total_times: 30, currency: 11 }, // 百变素材模型R
  { id: 7407, type_id: 20000904, num: 1, price: 30, total_times: 15, currency: 11 }, // 百变素材模型SR
  { id: 7408, type_id: 30000003, num: 1000, price: 100, total_times: 25, currency: 11 }, // 金币x1000
];
// 加速引擎（shop 3 水晶直购；官方为付费礼包，本地服水晶化：激活 buff 1108）
const ENGINE_GOODS = { id: 3010, type_id: 62000002, num: 1, price: 600, total_times: 1, currency: 200, buff: { type: 1108, buff_type: 3, buff_value: 1 } };

// ==================================================================
// 合成 MAP_CONFIGS（无小地图：mapId=0、monsterChain 空 → 绕过地图推进，glasttour/daily_copy 同模式）
// collab meta 由 handlers/collab.js 消费（入场门/结算/任务联动）
// ==================================================================
function stageCfg(meta, waves) {
  return {
    mapId: 0, bornPos: 0, monsterChain: [], monsterFight: {}, fogAfter: {},
    waves: { [String(meta.copyId)]: waves },
    bossPoint: meta.copyId,
    rewardServant: [],
    collab: meta,
  };
}

const COLLAB_MAP_CONFIGS = {};
// 约战主线 15 关（单次关：3 波）
for (const s of DAL_STAGES) {
  const nat = [1, 2, 3, 4][s.copyId % 4];
  COLLAB_MAP_CONFIGS[s.copyId] = stageCfg(
    { family: 'dal-main', copyId: s.copyId, name: s.name, times: 1, act: DAL_ACT },
    waves3(s.lv, { natures: [nat, (nat % 6) + 1, 5], lvFn: (lv, w) => lv + w * 2 })
  );
}
// 约战周回（每日 10 次；掉落联动圣器碎片）
for (const w of DAL_WEEKLY) {
  COLLAB_MAP_CONFIGS[w.copyId] = stageCfg(
    { family: 'dal-weekly', copyId: w.copyId, name: w.name, times: w.times, act: 1106, fragments: w.fragments },
    waves3(w.lv, { natures: [1, 3, 6], lvFn: (lv, i) => lv + i * 5 })
  );
}
// 约战高难（单次；头像框+遗物箱+金币）
for (const h of DAL_HARD) {
  COLLAB_MAP_CONFIGS[h.copyId] = stageCfg(
    { family: 'dal-hard', copyId: h.copyId, name: h.name, times: 1, act: h.copyId === 1109010101 ? 1109 : 1119, frame: h.frame, gold: h.gold, need: h.need },
    waves3(h.lv, { natures: [6, 2, 5], lvFn: lv => lv })
  );
}
// 究极试炼（6 波训练员；战斗点=copyId）
COLLAB_MAP_CONFIGS[BILI_EX_COPY] = stageCfg(
  { family: 'bili-ex', copyId: BILI_EX_COPY, name: '究级试炼', act: 1027 },
  BILI_EX_WAVES
);
// 星象馆 SideStory3 + 潘多拉的决意
COLLAB_MAP_CONFIGS[PLAN_SIDE_COPY] = stageCfg(
  { family: 'plan-side', copyId: PLAN_SIDE_COPY, name: '废墟城市', times: -1, act: 1077, chapter: 3 },
  PLAN_SIDE_WAVES
);
COLLAB_MAP_CONFIGS[PLAN_DARE_COPY] = stageCfg(
  { family: 'plan-dare', copyId: PLAN_DARE_COPY, name: '潘多拉的决意', times: -1, act: 1077 },
  PLAN_DARE_WAVES
);
// 达拉崩吧·恶龙副本（1052010100：Lv35 恶龙 BOSS，3波）
const LTY_DRAGON_COPY = 1052010100;
COLLAB_MAP_CONFIGS[LTY_DRAGON_COPY] = stageCfg(
  { family: 'lty-dragon', copyId: LTY_DRAGON_COPY, name: '恶龙BOSS', times: -1, act: 1052 },
  waves3(35, { natures: [3, 2, 6], lvFn: (lv, w) => lv + w * 2 })
);
// 达拉崩吧·摸鱼的公主高难副本（1052010174：Lv50 摸鱼公主高难，3波）
const LTY_PRINCESS_COPY = 1052010174;
COLLAB_MAP_CONFIGS[LTY_PRINCESS_COPY] = stageCfg(
  { family: 'lty-princess', copyId: LTY_PRINCESS_COPY, name: '摸鱼的公主(高难)', times: -1, act: 1052 },
  waves3(50, { natures: [1, 5, 6], lvFn: (lv, w) => lv + w * 5 })
);

module.exports = {
  NATURE_POOL, PLAN_STARS, PLAN_CHAPTERS, PLAN_LAMP_SCORE, PLAN_BATTERY_SCORE,
  PLAN_SIDE_COPY, PLAN_DARE_COPY, LTY_DRAGON_COPY, LTY_PRINCESS_COPY,
  BILI_EX_COPY, BILI_ACT_VIEW, BILI_TICKET, BILI_COST_CHIP, BILI_CHIP_SCORE,
  BILI_GRADES, BILI_TRAINERS,
  DAL_ACT, DAL_STAGES, DAL_WEEKLY, DAL_FRAGMENTS, DAL_HARD, DAL_HARD_BOXES, DAL_MAIN_FIRST, DAL_THEATERS,
  DAL_TRUST_THRESHOLDS,
  STAR_CRYSTAL_SCORE, STAR_DREAM,
  BILI_MISSIONS, PLAN_MISSIONS,
  BILI_SHOP_GOODS, ENGINE_GOODS,
  COLLAB_MAP_CONFIGS,
};
