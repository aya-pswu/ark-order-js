module("ActivityModule", package.seeall)
require("Modules.Activity.View.AutoGen.ActivityLTYRewardViewAutoGen")

-- 明文覆写（2026-10-06 一百四十七）：绫音沁曲(1071)打开显示为天外来客的修复。
--
-- 根因：本版客户端把本视图的 prefab（UI/Activity/Prefabs/ActivityLTYRewardView）默认内容
-- 整体换成了天外来客(1741)皮肤——texBg 直接烘焙 FantasyBg 纹理（含"天外来客"标题与陨铁
-- 活动规则大字）、btnRule/btnMission 按钮图为 FantasyBtnTask/FantasyBtnFight（前往活动
-- TASK/前往主线 FIGHT）、spScoreItem 烤成陨铁图标 FantasyIconScore、lblTime 烤着
-- "活动时间:4.4 维护后~4.18 9:00"、spSpeak 烤着"嗯...陨铁么"语音气泡、objGoodItem 烤着
-- "排行奖励"角标。而 ActivityLTYRewardView 类（1071 绫音沁曲）从不在代码里设置外观、
-- 全靠 prefab 默认值，于是页面壳子是天外来客、只有积分/70 档奖励列表是绫音沁曲数据。
--
-- 官方同 prefab 的 ActivityFantasyRewardsView(1741) 在 initUI 里逐项覆盖这些节点，说明
-- 节点绑定名可用；LTY03 美术资源仍在包里：textures_lang/lty03bg.ab 的 LTY03Bg（874x584
-- 与 texBg 完全同尺寸）与 activity 图集的 LTY03GoTask1 按钮图。此处照 ActivityFantasy
-- 的同款写法在运行时恢复绫音沁曲外观，其余函数与原版逐行一致。

function ActivityLTYRewardView.initUI(slot0)
	slot0.list.LuaItemRender = ActivityLTYRewardItem

	slot0:addMessageListener(ModuleCommand.ACT_SCORE_EXCHANGE_INFO, selfHandler(slot0, "onGUI"))

	slot0.info = ActivityConfig.getLTYThreeActivity().LTYInfo

	-- 背景：天外来客烘焙图 → 绫音沁曲原版背景（自带标题/看板娘/累计5000四合如意、5500婉语之律亮点）
	slot0.texBg.Path = "UI/Activity/Textures_Lang/LTY03Bg"
	-- 活动时间：陨铁期文案 → LTYInfo 配置的 4月4日维护后—4月18日9:00
	slot0.lblTime.text = slot0.info.timeDes

	-- 积分货币展示：陨铁 → 三球冰淇淋(60000032, color=3)。objGoodItem 组（背景框+图标+角标）。
	-- spScoreItem 是 prefab 中的 CSprite（不是可直接加载物品 icon 路径的 CTexture）。对它写入
	-- "UI/Bag/Textures/..." 会进入原生精灵数组查找并触发 Array index is out of range；积分图标
	-- 该节点的 atlas 中有绫音专用 Sprite，改 SpriteName 不会走 CTexture 的资源数组索引。
	slot0.itemVO = ItemConfig.getItemVO(60000032)
	slot0.spScoreItem.SpriteName = "LTY03ScoreIcon"

	slot0.texItem.Path = slot0.itemVO.icon
	slot0.spColor.Path = "Common.GoodsBg" .. slot0.itemVO.color
	slot0.spColorBg.Path = "Common.ShopBoxBagColor" .. slot0.itemVO.color
	UIEventListener.AddClick(slot0.texItem.gameObject, luaHandler(slot0, "onItemClick", slot0))
	if slot0.lbl6 then
		slot0.lbl6.text = "三球冰淇淋"
	end

	-- 天外来客专属件全部隐藏：陨铁语音气泡及其点击区、排行榜按钮、两个 Fantasy 美术按钮
	-- （btnRule 在本类语义是"规则说明"但图是"前往活动"，btnMission 图是"前往主线"）
	Util.setActive(slot0.spSpeak, false)
	Util.setActive(slot0.spServant, false)
	Util.setActive(slot0.spRank, false)
	Util.setActive(slot0.btnRule, false)
	Util.setActive(slot0.btnMission, false)

	-- 恢复原版"前往任务"入口：官方隐藏的 sp41034 节点（烤着 LTY03GoTask1 图、72x88 原尺寸），
	-- 挪到原 FIGHT 按钮位（bg 该处为空海面），点击 = 原版 btnMission 行为（打开绫音沁曲-愿任务页）
	if slot0.sp41034 then
		slot0.sp41034.SpriteName = "LTY03GoTask1"
		Util.setActive(slot0.sp41034, true)
		slot0.sp41034.gameObject.transform.localPosition = Vector3(-340, -81, 0)
		UIEventListener.AddClick(slot0.sp41034.gameObject, luaHandler(slot0, "onClickBtnMission", slot0))
	end
end

function ActivityLTYRewardView.onItemClick(slot0)
	BagModule.openItemOperaPanel(slot0.itemVO)
end

function ActivityLTYRewardView.onClickBtnRule(slot0)
	ClickTip.show({
		tip = slot0.info.actDesc,
		width = slot0.info.tipWidth,
		alignment = TextAnchor.MiddleLeft
	})
end

function ActivityLTYRewardView.onClickBtnMission(slot0)
	Dispatcher.dispatch(ModuleCommand.OPEN_ACTIVITY_PANEL_BY_KIND, 24)
end

function ActivityLTYRewardView.onOpen(slot0)
	ActivityModule.m_act_score_exchange_info_tos(1071)
end

function ActivityLTYRewardView.onGUI(slot0, slot1)
	slot0.lblScore.text = ActivityMgr.getActScoreInfoOfScore(slot0.actID)
	slot2 = ActivityMgr.getActScoreInfoOfReward(slot0.actID)
	slot0.list.LuaDataProvider = slot2
	slot3, slot4 = slot0:getIndexAndNum(slot2)

	LoopManager.setTimeout(function ()
		slot0.list:GotoIndex(slot3 <= 1 and slot4 == 0 and 0 or slot3 - 1)
	end, 0.1)
end

function ActivityLTYRewardView.getIndexAndNum(slot0, slot1)
	slot2 = 0
	slot3 = 0

	for slot7, slot8 in ipairs(slot1) do
		if slot8.state == 3 then
			slot2 = slot7 - 1
		elseif slot8.state == 2 then
			slot2 = slot7
			slot3 = slot3 + 1

			break
		end
	end

	return slot2, slot3
end

function ActivityLTYRewardView.onRelease(slot0)
	return
end
