// 结社（Family/公会）静态数据。等级/信仰/风格/职位/贡献奖励等表与**运行中客户端**的 CfgFamily 对齐。
// ⚠️ 客户端有两个版本：tools/lua_src（旧，无光环/贡献奖励/合并）与 tools/lua_remote/src（**当前真机在跑的新版**）。
// 以新版为准（tools/bc_cmp/family_new/ 是它的反编译产物）：职位是 0/10/20/30，
// contribution_reward 是 6 槽位定长 int 数组（发空数组会让主面板 pbCur.value=nil 直接报错）。
const { TRAIN } = require('../lib');

// CfgFamily.levels：exp = 本级升下一级所需（增量，Lv15 为 0=MAX），memberNum/managerNum = 成员/理事名额
const LEVELS = [
  { lv: 1, exp: 3500, memberNum: 60, managerNum: 3 },
  { lv: 2, exp: 5000, memberNum: 62, managerNum: 3 },
  { lv: 3, exp: 7000, memberNum: 64, managerNum: 3 },
  { lv: 4, exp: 12000, memberNum: 66, managerNum: 3 },
  { lv: 5, exp: 25000, memberNum: 68, managerNum: 4 },
  { lv: 6, exp: 50000, memberNum: 70, managerNum: 4 },
  { lv: 7, exp: 100000, memberNum: 72, managerNum: 4 },
  { lv: 8, exp: 200000, memberNum: 74, managerNum: 5 },
  { lv: 9, exp: 300000, memberNum: 76, managerNum: 5 },
  { lv: 10, exp: 400000, memberNum: 80, managerNum: 6 },
  { lv: 11, exp: 500000, memberNum: 82, managerNum: 6 },
  { lv: 12, exp: 600000, memberNum: 84, managerNum: 6 },
  { lv: 13, exp: 700000, memberNum: 86, managerNum: 7 },
  { lv: 14, exp: 800000, memberNum: 88, managerNum: 7 },
  { lv: 15, exp: 0, memberNum: 90, managerNum: 8 },
];
const MAX_LV = LEVELS.length;
const levelOf = lv => LEVELS[Math.min(Math.max(Number(lv) || 1, 1), MAX_LV) - 1];

const CREATE_COST = 200;          // CfgFamily.createCost（水晶）
const BELIEFS = [10, 11, 12, 13, 14, 15]; // 阿斯加德/幻想/阿瓦隆/高天原/奥林匹斯/九霄
const STYLES = [1, 2, 3];         // 随意参与/休闲养老/目标最强
// 职位（新版 FamilyConst：组员 0 / 理事 10 / 副执行官 20 / 执行官 30）——旧版是 0/1/2，别用错
const JOB_MEMBER = 0, JOB_MANAGER = 10, JOB_DEPUTY = 20, JOB_OWNER = 30;
const JOBS = [JOB_MEMBER, JOB_MANAGER, JOB_DEPUTY, JOB_OWNER];
const DEPUTY_MAX = 2;             // 副执行官名额（CfgFamily 只配了 managerNum=理事名额，副执行官自定）
// 权限（CfgFamily.jobsAbility）：公告/审批/开除/光环 = 理事以上；改职位/改信息 = 副执行官以上
const canEditNotice = job => job >= JOB_MANAGER;
const canApply = job => job >= JOB_MANAGER;
const canExpel = job => job >= JOB_MANAGER;
const canChangeJob = job => job >= JOB_DEPUTY;
const canChangeInfo = job => job >= JOB_DEPUTY;
const NAME_MAX = 8;               // 客户端 inputName 截断到 8 个 utf8 字符
const NOTICE_MAX = 3;             // 主界面只渲染 spNotice1..3
const AUTO_EXCHANGE_MAX = 4;      // FamilyShopView 上限 (n/4)
const RENAME_CARD = 31000064;     // 结社改名卡（CfgItems）
const RENAME_SHOP = { shopId: 5, goodsId: 5004, gold: 680 }; // CfgFamily.reNameBuy + 客户端提示价
const SCORE_FAMILY = 8;           // GameConst.SCORE_FAMILY：结社积分（本周贡献）= 商店货币
const BAN_SECONDS = 300;          // 退社冷却。官方是"明天再操作"，本地服取 5 分钟便于自测（有意偏离）

// m_family_info_toc.contribution_reward 的槽位（新版 FamilyConst，FamilyVO.updateContribution 按下标取）
const CONTRI_SLOT = {
  TOTAL_TODAY: 1, TOTAL_YESTERDAY: 2, MY_TODAY: 3, MY_YESTERDAY: 4,
  MY_RANK_YESTERDAY: 5, HAS_GET_RANK_REWARD: 6,
};
const CONTRI_REFUSE = 0, CONTRI_GET = 1, CONTRI_HAS_GOTTEN = 2; // rewardState

// CfgFamily.contributionReward：结社昨日总贡献达标档（客户端主面板 pbCur 的刻度 + 领奖）
const CONTRIBUTION_REWARD = [
  { lv: 1, needCont: 3000, reward: [{ id: 30000002, num: 100 }, { id: 30000003, num: 200 }] },
  { lv: 2, needCont: 6000, reward: [{ id: 30000002, num: 200 }, { id: 30000003, num: 400 }] },
  { lv: 3, needCont: 9000, reward: [{ id: 30000002, num: 300 }, { id: 30000003, num: 600 }] },
  { lv: 4, needCont: 12000, reward: [{ id: 30000002, num: 400 }, { id: 30000003, num: 800 }] },
  { lv: 5, needCont: 15000, reward: [{ id: 30000002, num: 500 }, { id: 30000003, num: 1000 }] },
];
// CfgFamily.rankReward：昨日个人贡献排名奖励
const RANK_REWARD = [
  { rank: 1, reward: [{ id: 30000002, num: 150 }] },
  { rank: 2, reward: [{ id: 30000002, num: 100 }] },
];


// CfgFamily.haloInfo：结社光环（id → 最大等级）；光环点数上限按结社等级（haloPointSet）
const HALOS = [
  { haloId: 101, name: '财富', maxLv: 10 },
  { haloId: 102, name: '成长', maxLv: 10 },
  { haloId: 51, name: '迅捷', maxLv: 5 },
  { haloId: 52, name: '守护', maxLv: 5 },
  { haloId: 53, name: '狂暴', maxLv: 5 },
  { haloId: 54, name: '洞察', maxLv: 5 },
];
const HALO_POINT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20]; // 下标 = 结社等级-1
const haloPointOf = lv => HALO_POINT[Math.min(Math.max(Number(lv) || 1, 1), HALO_POINT.length) - 1];

// 结社商店（shop_id=8）。客户端无本地商品表，全靠 m_shop_detail_toc 下发；
// price 用 p_kvi {id: SCORE_FAMILY, val: 单价}，total_times = 每周可兑次数
const SHOP_GOODS = [
  { id: 8001, type_id: 20010001, num: 3, price: 60, total_times: 10 },  // 明亮的水结晶
  { id: 8002, type_id: 20011001, num: 3, price: 60, total_times: 10 },  // 明亮的火结晶
  { id: 8003, type_id: 20012001, num: 3, price: 60, total_times: 10 },  // 明亮的风结晶
  { id: 8004, type_id: 20013001, num: 3, price: 60, total_times: 10 },  // 明亮的土结晶
  { id: 8005, type_id: 20010002, num: 1, price: 150, total_times: 5 },  // 闪耀的水结晶
  { id: 8006, type_id: 27000000, num: 5, price: 80, total_times: 20 },  // 核心晶组 Lv1
  { id: 8007, type_id: 27000001, num: 3, price: 200, total_times: 10 }, // 核心晶组 Lv2
  { id: 8008, type_id: 27000002, num: 1, price: 400, total_times: 5 },  // 核心晶组 Lv3
  { id: 8009, type_id: RENAME_CARD, num: 1, price: 500, total_times: 2 }, // 结社改名卡
];

// NPC 结社（供"搜索结社"列表 + 申请加入；本地服无其他玩家）
const NPC_FAMILIES = [
  { familyId: 10001, name: '晨曦誓约', lv: 5, exp: 12000, intro: '欢迎所有指挥官，佛系日常，每日签到即可。', style: 1, logo: 10, ownerName: '芙蕾雅', memberNum: 42 },
  { familyId: 10002, name: '深空回响', lv: 8, exp: 88000, intro: '主攻高难副本，要求每周贡献 500 以上。', style: 3, logo: 14, ownerName: '普罗米修斯', memberNum: 58 },
  { familyId: 10003, name: '茶会', lv: 3, exp: 2100, intro: '休闲养老，聊天吹水，拒绝内卷。', style: 2, logo: 12, ownerName: '辉夜姬', memberNum: 17 },
  { familyId: 10004, name: '高天原分部', lv: 11, exp: 233000, intro: '老牌结社，人数已接近上限。', style: 3, logo: 13, ownerName: '天照', memberNum: 82 },
];

// 玩家自建结社的初始 NPC 成员（让成员管理/转让/开除有可操作对象；role_id 用 8xxx 段避开真实 role）
const NPC_MEMBERS = [
  { roleId: 8001, name: '艾莉丝', lv: 32, job: JOB_DEPUTY, contribution: 480, history: 12800, today: 60, yesterday: 120, servantType: 1033004, online: 1 },
  { roleId: 8002, name: '兰斯洛特', lv: 28, job: JOB_MANAGER, contribution: 260, history: 7400, today: 20, yesterday: 80, servantType: 1131009, online: 0, offlineDays: 2 },
  { roleId: 8003, name: '玛丽', lv: 21, job: JOB_MEMBER, contribution: 90, history: 1500, today: 0, yesterday: 30, servantType: 1331003, online: 0, offlineDays: 9 },
];

// 初始待审批申请（走 apply/accept/refuse 全链路）
const NPC_APPLIES = [
  { roleId: 8101, name: '流浪的旅人', lv: 19, servantType: 1432003 },
  { roleId: 8102, name: '拾荒者K', lv: 25, servantType: 1116005 },
];

// 宝箱来袭（结社 BOSS）：每日总额 10（客户端 FamilyBossPreparedView 硬编码 10 判定"累了"）
const BOSS_DAILY_TIMES = 10;
// 掉落档（p_reward {type: 物品 type_id, num}）；宝箱怪属性按天轮换（客户端按 nature 找 spine）
const BOSS_REWARDS = [
  { type_id: 27000000, num: 2 },
  { type_id: 20010000, num: 3 },
  { type_id: 20011000, num: 3 },
];
const BOSS_NATURES = [1, 2, 3, 4, 5, 6];

// 贡献产出（官方：每消耗 1 点体力 = 1 点本周贡献；本地服无体力，改为战斗/签到产出）
const CONTRIBUTION_PER_FIGHT = 10;
const CONTRIBUTION_PER_SIGN = 50;
const FAMILY_EXP_PER_SIGN = 100;

// 训练材料名（日志用）
const itemName = t => (TRAIN.TRAIN_ITEMS[t] && TRAIN.TRAIN_ITEMS[t].name) || String(t);

module.exports = {
  LEVELS, MAX_LV, levelOf, CREATE_COST, BELIEFS, STYLES,
  JOB_MEMBER, JOB_MANAGER, JOB_DEPUTY, JOB_OWNER, JOBS, DEPUTY_MAX,
  canEditNotice, canApply, canExpel, canChangeJob, canChangeInfo,
  NAME_MAX, NOTICE_MAX, AUTO_EXCHANGE_MAX,
  RENAME_CARD, RENAME_SHOP, SCORE_FAMILY, BAN_SECONDS,
  CONTRI_SLOT, CONTRI_REFUSE, CONTRI_GET, CONTRI_HAS_GOTTEN,
  CONTRIBUTION_REWARD, RANK_REWARD, HALOS, HALO_POINT, haloPointOf,
  SHOP_GOODS, NPC_FAMILIES, NPC_MEMBERS, NPC_APPLIES,
  BOSS_DAILY_TIMES, BOSS_REWARDS, BOSS_NATURES,
  CONTRIBUTION_PER_FIGHT, CONTRIBUTION_PER_SIGN, FAMILY_EXP_PER_SIGN, itemName,
};
