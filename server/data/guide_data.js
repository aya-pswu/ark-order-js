// 新手引导（Guide）数据 —— 2026-09-04（三十九）
//
// 客户端机制（tools/bc_cmp/GuideModule_re.lua + CfgGuide_ljd.lua + lua_src 反编译实证）：
// · p_role_data.guide = p_role_guide { guide_groups, last_guide_id }，guide_groups 语义是
//   **未完成引导组列表**（GuideModule.initGuideData"收到未完成引导列表"），客户端据此决定
//   哪些引导组会触发（GuideMgr.tryDoGroup 前置 notFinish 检查）。下发空列表 = 全部视为完成。
// · 组链（CfgGuide.groups）：1 开场视频 → 2 剧情10000 → 3 首战教学（copy 9000000，
//   **客户端本地脚本驱动**，CfgFirstFight 逐条调自家 toc handler，服务端零参与）→
//   4 剧情10001+自设名（m_role_rename_tos）→ 5 选灵（OPEN_CASTING_PANEL →
//   m_servant_select_tos，等 m_servant_select_toc）→ 6 剧情10003+二战（copy 9000001，
//   **真实服务端战斗**：m_copy_fight_tos → m_fight_servant_start_tos → skill_select →
//   m_fight_scene_result_toc）→ 7 技能学习 → 8/9 召唤 → 10/11/12 编队 → 20~25 主线1-1
//   走图战斗 → 30 任务 → 40 背包（用引导箱 21000000）→ 50/51/52 圣器/核心装备 → 53(空壳)。
//   服务端依赖点只有三处协议：m_role_guide_do_tos / m_role_rename_tos /
//   m_servant_select_tos，外加二战合成关（本文件 GUIDE_MAP_CONFIGS）。
// · 每组在 saveStep 完成时上报 (组id*1000, state=2)；doGroup 时 (组id*1000, state=1)；
//   每步 (组id*1000+step, state=0)。服务端对 state=2 记"已完成"并更新 last_guide_id。
//   ⚠️ 客户端 m_role_guide_info_toc 会用回包**重建**未完成表 → 回包必须准确反映当前
//   未完成集合，回空会把进行中的引导组标成已完成、后续组全部不再触发。
//
// 功能开启引导（60~125，funcOpenGuide）**有意不放进初始未完成列表**：
// 2026-08-23（十三）真机事故实证该类引导会吞点击（方舟组 123 把地图事件全部锁死），
// 且本服各面板与官方流程存在差异。新用户核心链 = 本文件 FRESH_UNFINISHED，
// 真机验证通过后可按需逐组放开（把组 id 加回 FRESH_UNFINISHED 即可）。

// 新账号初始未完成引导组（CfgGuide 全部 49 组的子集，见上）：
// 1~52 = 新手主线链；100 自动战斗提示（1-3 首战）/101 自动搜寻提示 /102 能源面板提示
// ——后三组是单步战斗帮助，触发点在已实装的主线地图/战斗/能源 UI 上，低风险。
// 排除：53/105/106/107/109/110/122（CfgGuide 里 steps={} 的空壳组，官方仅用于直接标记完成，
// 放进未完成列表若被 tryDoGroup 会 doStep(nil) 崩）；60~125 的功能开启引导（事故史）；
// 121 回归玩家引导（m_role_come_back 玩法未实装）；999（组 62 的活动期替代配置）。
const FRESH_UNFINISHED = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  20, 21, 22, 23, 24, 25, 30, 40, 50, 51, 52,
  100, 101, 102,
];

// 主线链最后一组 = 客户端 GuideConst.GUIDE_RELIC_3(52)："教程结束"的唯一判据点。
// GuideModule.enterMainPanel / onFinishGuide 都以 isFinish(52) 决定是否重拉 m_role_acts_tos
// ⇒ 服务端按同一组做"教程期签到押后"的门（handlers/activity.js guideSignDeferred），
// 两端同时放开，不会出现"服务端还在押后、客户端已经在弹"的错位。
const GUIDE_MAIN_CHAIN_LAST = 52;

// 老档（guideState=null）下发的 last_guide_id 必须非 0：
// openGuide=true 后 initGuideData 对 last=0 走 tryDoGroup(1)（未完成才触发），
// 空未完成列表 + last=0 会导致客户端**既不进主城也不播引导**（黑屏挂死）。
// 53 = GUIDE_FINAL（空壳组，nextGroup=0），语义"引导已全部结束"。
const FINISHED_LAST_ID = 53;

// 组 5 选灵面板（CfgCasting）：index 1~4 → handBookID 24/39/13/52 →
// HandbookMgr.getHandbookVOByIndex = CfgHandbook.handbooks 数组下标 → servantType：
// 24=1432003 苍炎的先知者(火) / 39=1534003 上古武神(土) / 13=1331003 倾杯戮杀者(水) / 52=1033004 永不落幕的青春(风)
const STARTER_BY_INDEX = { 1: 1432003, 2: 1534003, 3: 1331003, 4: 1033004 };

// 选灵实际发放：**玩家选中的那只 + 另外两只兜底**，共 3 只（老档 STARTER_TYPES 同口径）。
// 只发 1 只会让后面两组引导走不完（客户端实证）：
// · 组 11/12 编队引导的推进条件是 `FormationMgr.getMainTeam(1)[3] ~= 0`
//   （GuideModule.onUpdateFormation）——主力 3 槽填满才会 tryDoGroup(GUIDE_FORMATION_3=12)，
//   而组 12 的 nextGroup=20 是通往主线战斗引导（20~25）的唯一链节；
// · 组 8 召唤只给 1 只（单抽），凑不满 3 槽。
// 兜底两只取 STARTER_BY_INDEX 里属性与所选互补的（按 index 顺序轮转，去重）。
const STARTER_FILL_COUNT = 3;

// 选灵发放等级：**必须 ≥3**。四只初始誓灵的技能书第二档门槛都是 lv3
//（skill_data.SERVANT_SKILLBOOK：10030@lv0 → 10095@lv3 …），Lv1 时"可学技能"列表为空 →
// 组 7 技能学习引导的第 6 步（点可学技能）无目标可点，引导链直接卡死。
// 取 5 是留一档余量（Lv3 刚好解锁 1 个可学技能，Lv5 时誓灵列表红点也已亮起），
// 同时 1-1 敌方 Lv1~2 仍有基本挑战（不至于一刀清场）。
const STARTER_LEVEL = 5;


// 组 6 二战胜利奖励：小精灵（CfgServant 1115003，N 稀有度光系）。
// 官方新手流程第 3 步：二战结算赠送小精灵并自动编入第一队——结算面板 servant_reward
// 展示奖励卡 + m_servant_update_toc 入手 + 编队 1 自动入队（主力 3 槽已被初始誓灵占满
// → 进替补席）。发放逻辑见 handlers/guide.js grantSecondFightPet（onBattleWon 的
// guideCopy 分支调用），幂等键 = 是否已持有该 type（GM 重置重看引导不重复发）。
const GUIDE_PET_TYPE = 1115003;
// 发放等级与引导队基准（STARTER_LEVEL）一致：替补增援进 1-1 引导战（敌 Lv1~2）不白给。
const GUIDE_PET_LEVEL = 5;

// 组 6 二战（CfgCopy[9000001]"新手第二场"，客户端 mapID=10005 场景自带）。
// 首战 9000000 是客户端 CfgFirstFight 本地脚本，不经过网络；二战走真实战斗引擎：
// guide.js 拦截 m_copy_fight_tos 设好 mapState 后回落 map_fight（dare 同款模式）。
// 敌方 = 1 只量产型尤格（1-1 道中同款，hp 40 低于道中的 60）：Lv1 出战誓灵单挑可胜。
const GUIDE_MAP_CONFIGS = {
  9000001: {
    mapId: 9000001, bornPos: 0, monsterChain: [], fogAfter: {}, monsterFight: {},
    waves: { 9000001: [[{ type: 2011001, nature: 6, hp: 40 }]] },
    bossPoint: 9000001, rewardServant: [],
    guideCopy: true, // onBattleWon 按此分支跳过掉落/银币/任务/成就记账（新手引导战非正式关卡）
  },
};

// 引导箱（CfgItems 21000000 制式核心遗物箱，data={} 无官方使用产出）：
// 官方语义"打开可随机获得一件 Lv.1—Lv.2 的能力核心"（= 颜色 3/4 档）。
// 核心类型编码 19X0000Y（X=属性码 1~6，Y=颜色-2）：Lv1=Y1(色3)、Lv2=Y2(色4)。
// 组 40 背包引导必用此箱（m_item_use_tos），vit.js 按此表开箱。
const GUIDE_BOX_REWARDS = {
  21000000: [
    19100001, 19100002, 19200001, 19200002, 19300001, 19300002,
    19400001, 19400002, 19500001, 19500002, 19600001, 19600002,
  ],
};

// 组 7 学技能引导的学习材料兜底（真机 2026-09-04 卡死实证）：
// 客户端 SkillVO.canStudy 判据 = 等级达标 + 银币足够 + **技能模组持有数 ≥ 技能档位 lv**
//（isItemStudy: `getStudyLv() <= BagMgr.getItemNum(getStudyCostItem(lv))`；costItems 按档位
// 取通用道具：lv0~18→26000000 / 19~37→26000001 / 38+→26000002）。初始誓灵第二档技能书
//（lv3，如蚩尤 10094 肉体强化，花费银币150+模组×3）在新档/重置档是唯一"等级达标"的书，
// 模组为零时拥有技能列表全是红字（"材料不足"/"LvX 可习得"）→ 组7 步6 的
// lightClick(checkFun="canStudy") 找不到高亮目标、步7 详情面板"学习"按钮
// btnOper.IsEnabled=false —— 整组卡死，且材料在本服引导期无任何产出途径
//（26000000 本服产出只有 2-1 首通奖励，等不到）。
// 补发时机 = 组 7 的任意 guide_do 上报（handlers/guide.js ensureSkillMaterial）：
// 新档首跑 / 老档 m21_guide_reset 重看 / 卡死重登（last=6 → 客户端 tryDoGroup(7) 重入）全覆盖。
const GUIDE_SKILL_ITEM = 26000000; // 技能模组Lv1
// 补到 10 个：服务端学技能免收材料（客户端门禁只看持有数），10 够 lv3（×3）与 lv9（×9）
// 两档保持"可学习"亮绿；lv16 档（×16）起走正常产出（2-1 首通 +10 等）。
const GUIDE_SKILL_ITEM_NUM = 10;

const GUIDE_BOX_TYPEID = 21000000; // 组 40 背包引导的目标箱子（GUIDE_BOX_REWARDS 的键）
// 引导期间开箱**必须固定给生命核心**（属性码 1 = 19100001）：
// 组 51 的文案就是"点击空的生命核心栏位 / 选择刚获得的生命核心"，且推进判据是
// GuideModule.onOpenServantPropRelicView / onRelicEquip 里的
// `ServantMgr.selectServant:getPropRelic(GameConst.BASE_PROP_CODE_MAX_HP) ~= 0`
// —— 装了其他属性的核心不算，引导会一直停在组 51 反复教。
// 组 51 完成后开箱恢复随机（GUIDE_BOX_REWARDS）。
const GUIDE_BOX_FIXED_CORE = 19100001;
const GUIDE_BOX_FIXED_UNTIL_GROUP = 51;


module.exports = { FRESH_UNFINISHED, FINISHED_LAST_ID, GUIDE_MAIN_CHAIN_LAST, STARTER_BY_INDEX, STARTER_FILL_COUNT, STARTER_LEVEL,
  GUIDE_MAP_CONFIGS, GUIDE_BOX_REWARDS, GUIDE_BOX_TYPEID, GUIDE_BOX_FIXED_CORE, GUIDE_BOX_FIXED_UNTIL_GROUP,
  GUIDE_SKILL_ITEM, GUIDE_SKILL_ITEM_NUM, GUIDE_PET_TYPE, GUIDE_PET_LEVEL };
