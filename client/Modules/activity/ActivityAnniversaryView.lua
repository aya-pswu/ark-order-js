module("ActivityModule", package.seeall)
require("Modules.Activity.View.AutoGen.ActivityAnniversaryViewAutoGen")

function ActivityAnniversaryView.initUI(slot0)
	ClickTip.registerShow(slot0.spExplain, {
		width = 550,
		tip = ActivityConfig.getAwardTips(),
		alignment = TextAnchor.MiddleLeft
	})
	slot0.btnReward:AddClick(luaHandler(slot0, "onClickBtnReward", slot0))

	-- 关键修复：预取 VO 避免初期为 nil
	slot0.TwoAnnLuDrawVO = ActivityMgr.getTwoAnnLuckyDrawVO()

	slot0:registerOnClickEvents()
	LoopManager.addToSecond(slot0, slot0.countDown, slot0)
end

function ActivityAnniversaryView.onClickBtnReward(slot0)
	slot0.btnReward:ShowRedTip(false)
	m_daily_luck_draw_result_tos(ActivityConst.ACT_TWO_ANN_ID)
end

function ActivityAnniversaryView.onOpen(slot0)
	m_daily_luck_draw_info_tos(ActivityConst.ACT_TWO_ANN_ID)
end

function ActivityAnniversaryView.onGUI(slot0, slot1)
	slot0.btnReward:ShowRedTip(ActivityMgr.hasNotReceivedAwards())

	slot0.TwoAnnLuDrawVO = ActivityMgr.getTwoAnnLuckyDrawVO()

	if ActivityMgr.isAnnActOver() then
		slot0.lblActEnd.gameObject:SetActive(true)
		slot0.spTaskTwo.gameObject:SetActive(false)
		slot0.spTaskOne.gameObject:SetActive(false)
	else
		local taskIds = ActivityMgr.getTaskID() or {1, 2}
		local t1 = taskIds[1] or 1
		local t2 = taskIds[2] or 2
		slot0.lblOneState.text = ActivityConfig.getTaskDetails(t1) or ""
		slot0.lblTwoState.text = ActivityConfig.getTaskDetails(t2) or ""
		local progresses = ActivityMgr.getTaskProgress() or {0, 0}
		local p1 = progresses[1] or 0
		local c1 = ActivityConfig.getTaskCount(t1) or 1
		slot0.lblOneProcess.text = HtmlUtil.Color(p1 .. "/" .. c1, p1 < c1 and "FFE400" or "FF7251")
		local p2 = progresses[2] or 0
		local c2 = ActivityConfig.getTaskCount(t2) or 1
		slot0.lblTwoProcess.text = HtmlUtil.Color(p2 .. "/" .. c2, p2 < c2 and "FFE400" or "FF7251")
	end

	local vo = slot0.TwoAnnLuDrawVO
	if not vo then
		return
	end
	local sInfo = vo:getServantInfo()
	if sInfo then
		local sName = sInfo.servName or ""
		local skName = sInfo.servSkinName or ""
		slot0.lblServantName.text = sName
		slot0.lblSkinName.text = skName
		slot0.lblSvSkinName.text = sName .. " 【" .. skName .. "】"
		slot0.lblSvSkinNum.text = "【" .. tostring(vo:getAwardCount(ActivityConst.TYPE_TWOANN_LUCKY_DRAW_BIG) or 0) .. "】"
		slot0.texServant.Path = sInfo.tex or ""
		slot0.texIconA.Path = sInfo.icon or ""
	end
	slot0.lblSimAwardsNum.text = "【" .. tostring(vo:getAwardCount(ActivityConst.TYPE_TWOANN_LUCKY_DRAW_SMALL) or 0) .. "】"
	slot0.texIconB.Path = vo:getItemIconPath(ActivityConst.TYPE_TWOANN_LUCKY_DRAW_SMALL) or ""
	slot0.texIconC.Path = vo:getItemIconPath(ActivityConst.TYPE_TWOANN_LUCKY_DRAW_PARTP) or ""
	slot0.ilblNumC.Text = vo:getPartAwardNum() or 0

	if slot0.goodsItems and #slot0.goodsItems >= 3 then
		local id1 = vo:getItemID(ActivityConst.TYPE_TWOANN_LUCKY_DRAW_BIG)
		if id1 then slot0.goodsItems[1]:updateGoodsItem(vo:getItemVO(id1)) end
		local id2 = vo:getItemID(ActivityConst.TYPE_TWOANN_LUCKY_DRAW_SMALL)
		if id2 then slot0.goodsItems[2]:updateGoodsItem(vo:getItemVO(id2)) end
		local id3 = vo:getItemID(ActivityConst.TYPE_TWOANN_LUCKY_DRAW_PARTP)
		if id3 then slot0.goodsItems[3]:updateGoodsItem(vo:getItemVO(id3)) end
	end
end

function ActivityAnniversaryView.countDown(slot0)
	if slot0:checkNil() then
		LoopManager.removeFromSecond(slot0)
		return
	end

	if not slot0.TwoAnnLuDrawVO then
		slot0.TwoAnnLuDrawVO = ActivityMgr.getTwoAnnLuckyDrawVO()
	end

	if slot0.TwoAnnLuDrawVO and slot0.TwoAnnLuDrawVO.actTimeRem then
		slot0.lblRefreshTime.text = slot0.TwoAnnLuDrawVO.actTimeRem
	end
end

function ActivityAnniversaryView.registerOnClickEvents(slot0)
	slot0.goodsItems = {}
	slot0.comNames = {
		"A",
		"B",
		"C"
	}

	for slot4 = 1, 3 do
		local slot5 = slot0:create(ActivityAnniversaryAwardViewGoodsItem)
		slot5:setObj(slot0["goOut" .. slot0.comNames[slot4]])
		table.insert(slot0.goodsItems, slot5)
	end
end

function ActivityAnniversaryView.onRelease(slot0)
	return
end
