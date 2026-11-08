module("ActivityModule", package.seeall)
require("Modules.Activity.View.AutoGen.ActivityLTYFavorableRenderAutoGen")

-- 2026-10-12 判空补丁（明文重写，原为官方字节码）：
-- ① ActivityLTYFavorableView.onOpen 先发 m_act_favor_info_tos，toc 未到达时
--    ActivityMgr.getRewardFavorableList(id)（在 mission_list upvalue 里按 id 找）返回 nil，
--    官方 onGUI 第 4 行直接 `rewardsVO.val` 索引 nil → "attempt to index field 'rewardsVO'"
--    （用户日志 16:16:33 两次实证：.346 发 info_tos，.475 渲染崩，.780 toc 才到）。
--    修复：rewardsVO 判空，未就绪时整条渲染跳过（等 ACTIVITY_LTY_FAVORABLE_VIEW_UPDATE 广播重刷）。
-- ② ItemConfig.getItemVO(item id) 对未知道具返回值同样判空，防配置缺项连带崩。

function ActivityLTYFavorableRender.init(slot0, slot1)
	if slot1 then
		slot0.clist = slot1.clist
	end
end

function ActivityLTYFavorableRender.initUI(slot0)
	slot0.btnGo:AddClick(luaHandler(slot0, "onClickBtnGo", slot0))
	UIEventListener.AddClick(slot0.texIcon.gameObject, selfHandler(slot0, "onOpenItemVO"))
end

function ActivityLTYFavorableRender.onOpenItemVO(slot0)
	BagModule.openItemOperaPanel(slot0.itemVO)
end

function ActivityLTYFavorableRender.onGUI(slot0, slot1)
	slot0.cBaseRender.Width = slot0.clist.Width - 10
	slot0.data = slot1
	slot0.lblDes.text = slot1.des
	slot0.lblId.text = "任务" .. slot1.id
	slot0.rewardsVO = ActivityMgr.getRewardFavorableList(slot1.id)

	-- 判空补丁①：任务进度数据未就绪（活动信息 toc 未到）时跳过本条渲染
	if slot0.rewardsVO == nil then
		return
	end

	slot0.lblLock.text = csformat("好感度达到{0}解锁", slot1.state)
	slot0.pb.value = slot0.rewardsVO.val / slot1.arg
	slot0.lblNum.text = csformat("{0}/{1}", slot0.rewardsVO.val, slot1.arg)
	slot0.rewardsState = slot0.rewardsVO.type

	if slot0.rewardsState == 1 then
		if slot0.data.id ~= #ActivityConfig.getLTYRewards() then
			slot0.lblGo.text = HtmlUtil.Color("前往", "818D8E")
		else
			slot0.lblGo.text = HtmlUtil.Color("未完成", "818D8E")
		end
	elseif slot0.rewardsState == 2 then
		slot0.lblGo.text = HtmlUtil.Color("领取", "5C5A55")
	elseif slot0.rewardsState == 3 then
		slot0.lblState.text = HtmlUtil.Color("已领取", "28D19F")
	end

	slot0.btnGo:ShowRedTip(slot0.rewardsState == 2)
	Util.setActive(slot0.spLock, slot0.rewardsState == 0)
	Util.setActive(slot0.spNoLock, slot0.rewardsState == 0)
	Util.setActive(slot0.lblState, slot0.rewardsState ~= 0)
	Util.setActive(slot0.btnGo, slot0.rewardsState == 1 or slot0.rewardsState == 2)

	slot0.itemVO = ItemConfig.getItemVO(slot1.rewards.id)

	-- 判空补丁②：道具配置缺失防御
	if slot0.itemVO == nil then
		return
	end

	slot0.itemVO.curNum = slot1.rewards.num
	slot0.texIcon.Path = slot0.itemVO.icon
	slot0.spColor.Path = "Common.GoodsBg" .. slot0.itemVO.color
	slot0.ilblNum.Text = slot0.itemVO.curNum > 1 and slot0.itemVO.curNum or ""

	Util.setActive(slot0.spFinish, slot0.rewardsState == 3)
end

function ActivityLTYFavorableRender.onClickBtnGo(slot0)
	if slot0.rewardsState == 2 then
		ActivityModule.m_act_favor_get_tos(slot0.data.id)
	elseif slot0.rewardsState == 1 and slot0.data.id ~= #ActivityConfig.getLTYRewards() then
		Dispatcher.dispatch(unpack(slot0.data.link))
	end
end

function ActivityLTYFavorableRender.onRelease(slot0)
	return
end
