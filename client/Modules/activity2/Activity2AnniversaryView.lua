module("Activity2Module", package.seeall)
require("Modules.Activity2.View.AutoGen.Activity2AnniversaryViewAutoGen")

-- 2026-10-12 判空补丁（明文重写，原为官方字节码）：
-- 首次打开时 m_repeater_anniversary_info_toc 尚未到达，Activity2Mgr.repeaterDay[actID] 为 nil，
-- 官方代码 `getBlessServant(actID, repeaterDay[actID] or 0)` 以 day=0 取 blessServants[0]（1-based 表，必为 nil），
-- 随后 slot3.skinItem 索引 nil 崩溃（真机报错 "attempt to index a nil value"，无字段名）。
-- 修复：day 兜底取 1、getBlessServant/getAnniversaryInfo/reward 条目全面判空；
-- getRewardStr 的 list[slot1] 判空同时修掉 onClickBtnReward 在 day > #list 时的同族崩溃。

function Activity2AnniversaryView.initUI(slot0)
	slot0.chbTip:AddChange(selfHandler(slot0, "onTipChange"))
end

function Activity2AnniversaryView.onTipChange(slot0)
	Activity2Module.m_repeater_anniversary_remind_tos(slot0.actID, slot0.chbTip.isOn and 1 or 0)
end

function Activity2AnniversaryView.onClickBtnServant(slot0)
	Activity2Module.openServantPreviewPanel(slot0.actID)
end

function Activity2AnniversaryView.onClickBtnReward(slot0)
	slot1 = {}

	for slot5 = 1, (Activity2Mgr.repeaterDay[slot0.actID] or 0) - 1 do
		table.insert(slot1, slot0:getRewardStr(slot5, "、", "："))
	end

	ClickTip.show({
		width = 700,
		tip = table.concat(slot1, "\n"),
		alignment = TextAnchor.UpperLeft
	})
end

function Activity2AnniversaryView.onOpen(slot0)
	Activity2Module.m_repeater_anniversary_info_tos(slot0.actID)
	LoopManager.addToSecond(slot0, selfHandler(slot0, "updateTime"))
end

function Activity2AnniversaryView.onClose(slot0)
	LoopManager.removeFromSecond(slot0)
end

function Activity2AnniversaryView.onGUI(slot0, slot1)
	slot0:updateTime()
	slot0.chbTip:SetSelect(Activity2Mgr.repeaterNotify[slot0.actID] or false)

	-- 判空补丁：活动配置缺项防御（原代码直接索引 getAnniversaryInfo 返回值）
	local info = Activity2Config.getAnniversaryInfo(slot0.actID)

	if info and info.tipInfo then
		slot0.lblTipInfo.text = info.tipInfo.tip
		slot0.lblTipHead.text = info.tipInfo.head
	end

	Util.setActive(slot0.spTipInfo, info ~= nil and info.tipInfo ~= nil)

	slot0.lblRule.text = Activity2Config.getAnniversaryRule(slot0.actID) or ""

	-- 判空补丁：首开数据未到时 repeaterDay[actID]=nil，day 由 0 改为 1 兜底；bless 判空后再取立绘
	local bless = Activity2Config.getBlessServant(slot0.actID, Activity2Mgr.repeaterDay[slot0.actID] or 1)

	if bless then
		local skinId = ServantConfig.itemIDToSkinID(bless.skinItem)
		slot0.texServant.Path = ServantUtil.getPathCard(skinId)
		slot0.lblSkinName.text = bless.title
		slot0.lblServantName.text = ServantConfig.getFieldByTypeId(ServantConfig.skinToType(skinId), "name")
	end

	slot0.lblRewardDay.text = (Activity2Mgr.repeaterDay[slot0.actID] or 0) == #(Activity2Mgr.repeaterRewardList[slot0.actID] or {}) and "【今日获奖名单】" or "【昨日获奖名单】"
	slot0.lblReward.text = slot0:getRewardStr(#(Activity2Mgr.repeaterRewardList[slot0.actID] or {}), "\n")
end

function Activity2AnniversaryView.updateTime(slot0)
	slot0.lblTime.text = "下次复读时间：" .. HtmlUtil.Color(DateFormatUtil.formatToDayAndSecondColon(math.max(0, (Activity2Mgr.repeaterNextTime[slot0.actID] or 0) - GlobalData.serverTime)), "FB436E") .. "后开启"
end

function Activity2AnniversaryView.getRewardStr(slot0, slot1, slot2, slot3)
	-- 判空补丁：原代码 (repeaterRewardList[actID] or {})[slot1] 越界（day > #list）时索引 nil 崩溃
	local bless = Activity2Config.getBlessServant(slot0.actID, slot1)
	local reward = (Activity2Mgr.repeaterRewardList[slot0.actID] or {})[slot1]

	if bless == nil or reward == nil or reward.role_names == nil then
		return ""
	end

	return csformat("{0}ㅡ{1}{2}{3}", bless.day, bless.title, slot3 or "\n", table.concat(reward.role_names, slot2))
end

function Activity2AnniversaryView.onRelease(slot0)
	return
end
