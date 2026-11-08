// 主线首通奖励 + 主线双倍（CfgCopy.copy[].firstReward / CfgShop.double）——**自动生成，勿手改**
// 生成器：tools/bc_cmp/gen_story_reward_data.py（源：CfgCopy_re.lua / CfgShop_re.lua / CfgItems_ljd.lua）
//
// 客户端口径：
//   CopyBarrierItem.updateFirstReward  itemTimes=getCopyPassTimes(id)（p_copy_barrier.pass_times）
//                                     itemState=isHasFirstReward(id)（p_copy_barrier.first_reward，0=未领）
//                                     objReward 显示条件 = itemState==0 且配置有 firstReward 且非 EX 模式；
//                                     spRed（红点）= 上面成立且 itemTimes>0（即已通关）
//   CopyBarrierItem.onOpenItemVO      itemTimes==0 → 只弹道具详情（预览）；>0 → 发 m_copy_story_first_reward_tos
//   ItemConfig.isToBag               form 1(FORM_TO_BAG) 与 3(FORM_NOT_BAG_SHOW) 都入背包，
//                                     form 3 只是不在"获得道具"弹窗/结算面板里展示；form 2(FORM_SHOW)=货币类

// 首通奖励：barrierId → {id 道具, num, name 关卡名, simple 关号}
// 30000000 水晶 / 30000001 御灵士经验 / 30000002 体力 / 30000003 金币 是 form=2 货币，必须走资产而非入包
const FIRST_REWARD = {
  1010100: {"id":30000003,"num":500,"name":"剧情1-1","simple":"1-1"},
  1010200: {"id":30000003,"num":1000,"name":"剧情1-2","simple":"1-2"},
  1010300: {"id":30000003,"num":1000,"name":"剧情1-3","simple":"1-3"},
  1010400: {"id":31525008,"num":1,"name":"剧情1-4","simple":"1-4"},
  1020100: {"id":26000000,"num":10,"name":"剧情2-1","simple":"2-1"},
  1020200: {"id":27000000,"num":10,"name":"剧情2-2","simple":"2-2"},
  1020300: {"id":30000002,"num":200,"name":"剧情2-3","simple":"2-3"},
  1020400: {"id":60000160,"num":1,"name":"剧情2-4","simple":"2-4"},
  1030100: {"id":26000001,"num":5,"name":"剧情3-1","simple":"3-1"},
  1030200: {"id":27000001,"num":5,"name":"剧情3-2","simple":"3-2"},
  1030300: {"id":21103000,"num":1,"name":"剧情3-3","simple":"3-3"},
  1030400: {"id":72000014,"num":1,"name":"剧情3-4","simple":"3-4"},
  1040100: {"id":26000002,"num":5,"name":"剧情4-1","simple":"4-1"},
  1040200: {"id":27000002,"num":5,"name":"剧情4-2","simple":"4-2"},
  1040300: {"id":21003000,"num":1,"name":"剧情4-3","simple":"4-3"},
  1040400: {"id":72000014,"num":1,"name":"剧情4-4","simple":"4-4"},
  1050100: {"id":26000002,"num":5,"name":"剧情5-1","simple":"5-1"},
  1050200: {"id":27000002,"num":5,"name":"剧情5-2","simple":"5-2"},
  1050300: {"id":30000002,"num":500,"name":"剧情5-3","simple":"5-3"},
  1050400: {"id":21007000,"num":1,"name":"剧情5-4","simple":"5-4"},
  1060100: {"id":20000903,"num":10,"name":"剧情6-1","simple":"6-1"},
  1060200: {"id":30000003,"num":3000,"name":"剧情6-2","simple":"6-2"},
  1060300: {"id":30000002,"num":500,"name":"剧情6-3","simple":"6-3"},
  1060400: {"id":21104000,"num":1,"name":"剧情6-4","simple":"6-4"},
  1070100: {"id":20000904,"num":5,"name":"剧情7-1","simple":"7-1"},
  1070200: {"id":30000003,"num":3000,"name":"剧情7-2","simple":"7-2"},
  1070300: {"id":30000002,"num":500,"name":"剧情7-3","simple":"7-3"},
  1070400: {"id":21007000,"num":1,"name":"剧情7-4","simple":"7-4"},
  1080100: {"id":71000001,"num":1,"name":"剧情8-1","simple":"8-1"},
  1080200: {"id":30000003,"num":5000,"name":"剧情8-2","simple":"8-2"},
  1080300: {"id":30000002,"num":500,"name":"剧情8-3","simple":"8-3"},
  1080400: {"id":72000015,"num":1,"name":"剧情8-4","simple":"8-4"},
  1090100: {"id":20000905,"num":5,"name":"剧情9-1","simple":"9-1"},
  1090200: {"id":30000003,"num":5000,"name":"剧情9-2","simple":"9-2"},
  1090300: {"id":30000002,"num":500,"name":"剧情9-3","simple":"9-3"},
  1090400: {"id":72000015,"num":1,"name":"剧情9-4","simple":"9-4"},
  1100100: {"id":20000905,"num":5,"name":"剧情10-1","simple":"10-1"},
  1100200: {"id":30000003,"num":5000,"name":"剧情10-2","simple":"10-2"},
  1100300: {"id":30000002,"num":500,"name":"剧情10-3","simple":"10-3"},
  1100400: {"id":71000001,"num":1,"name":"剧情10-4","simple":"10-4"},
  1110100: {"id":20000905,"num":5,"name":"剧情11-1","simple":"11-1"},
  1110200: {"id":30000003,"num":5000,"name":"剧情11-2","simple":"11-2"},
  1110300: {"id":30000002,"num":500,"name":"剧情11-3","simple":"11-3"},
  1110400: {"id":71000001,"num":2,"name":"剧情11-4","simple":"11-4"},
};

// 双倍（CfgShop.double）：maxTimes 同时是「可持有次数上限」与「每日可购买次数上限」
// （ShopConfig.getDoubleMaxTimes 被 CopyDoubleBuyPanel.checkBuy 的 doubleUseTimes>=10 与
//   getOneCost/getAllCost 的下标换算两处共用）；cost[i] = 今日第 i 次购买的**体力**价格
// （CopyDoubleBuyPanel.checkBuy 拿 GlobalData.vit 比价，不足弹"体力不足"）
const DOUBLE_MAX_TIMES = 10;
const DOUBLE_COST = [150,150,150,150,150,150,150,150,150,150];
// 双倍功能解锁：CopyMainLineView 的 texDouble 点击提示"通关主线6-4后可开启该功能"，
// 判据 CopyMgr.getCurChapter(TYPE_MAIN) >= 7（cur_chapter 由 m_copy_barrier_info_toc 下发）
const DOUBLE_UNLOCK_CHAPTER = 7;

// 奖励道具名（仅日志可读性，非协议字段）；form 用于区分货币/背包
const REWARD_NAMES = {"20000903":"百变素材模型","20000904":"百变素材模型","20000905":"百变素材模型","21003000":"新制圣器遗物箱","21007000":"原初圣器遗物箱","21103000":"新制核心遗物箱","21104000":"原初核心遗物箱","26000000":"技能模组Lv1","26000001":"技能模组Lv2","26000002":"技能模组Lv3","27000000":"核心晶组Lv1","27000001":"核心晶组Lv2","27000002":"核心晶组Lv3","30000002":"体力","30000003":"金币","31525008":"玄女","60000160":"雪见大福","71000001":"泛用型元素精灵","72000014":"元素晶石[雪女]","72000015":"元素晶石[女娲]"};
const REWARD_FORMS = {"20000903":1,"20000904":1,"20000905":1,"21003000":1,"21007000":3,"21103000":1,"21104000":1,"26000000":1,"26000001":1,"26000002":1,"27000000":1,"27000001":1,"27000002":1,"30000002":2,"30000003":2,"31525008":3,"60000160":1,"71000001":1,"72000014":1,"72000015":1};

module.exports = { FIRST_REWARD, DOUBLE_MAX_TIMES, DOUBLE_COST, DOUBLE_UNLOCK_CHAPTER, REWARD_NAMES, REWARD_FORMS };
