module("Activity2Module", package.seeall)
require("Modules.Activity2.View.AutoGen.ActivityChitosDiaryItemAutoGen")

-- [本地服补丁 2026-09-12] 原版 onGUI 传给 BaseItemVO.setDbInfo 的字面量缺 status 字段，
-- BitUtil.getIntNBit(nil,1) 必崩（data32[i] <= nil），onGUI 中断在 missionVO 赋值前
-- → 列表项奖励图标不渲染 + 点击 missionVO nil 二次崩。补 status=0（未锁定）修复。
-- 另见 工作日志 2026-09-12（五十七）。

function ActivityChitosDiaryItem.init(slot0, slot1)
	slot0.actID = slot1.actID
end

function ActivityChitosDiaryItem.initUI(slot0)
	slot0:registerRedPoint(RedPointConst.ACTIVITY_CHITOS_DIARY, luaHandler(slot0, "onRedPoint", slot0))
	slot0.btnGetReward:AddClick(selfHandler(slot0, "onClickGetReward"))

	slot0.shopGoodsItem = slot0:create(ShopModule.ShopGoodsItem, {
		needLoadPrefab = false
	})

	slot0.shopGoodsItem:setObj(slot0.goShopGoodsItem)
end

function ActivityChitosDiaryItem.onGUI(slot0, slot1)
	slot0.lblMissionId.text = slot1.id
	slot0.lblDesc.text = slot1:getMissionDesc()
	slot0.lblProgress.text = slot1:getMissionProgress()
	slot0.lblState.text = slot1:getMissionState()
	slot0.btnGetReward.IsEnabled = slot1:getRewardBtnState()
	slot2 = slot1:getMissionDetail().rewardItem

	if slot0.itemVO == nil or slot0.itemVO.typeId ~= slot2 then
		slot4 = ItemConfig.getItemVO(slot2)

		slot4:setDbInfo({
			servant_id = 0,
			status = 0,
			cur_num = slot1:getMissionDetail().itemNum
		})
		slot0.shopGoodsItem:setData(slot4)

		slot0.itemVO = slot4
	end

	slot0.missionVO = slot1
end

function ActivityChitosDiaryItem.onRelease(slot0)
	return
end

function ActivityChitosDiaryItem.onRedPoint(slot0, slot1)
	if slot0.missionVO and slot0.missionVO.type == 2 then
		Util.setActive(slot0.spRedTip, slot1)
	else
		Util.setActive(slot0.spRedTip, false)
	end
end

function ActivityChitosDiaryItem.onClickGetReward(slot0)
	if slot0.missionVO.type == 1 then
		Dispatcher.dispatch(ModuleCommand.OPEN_COPY_ACTIVITY_PANEL, 1360)
	elseif slot0.missionVO.type == 2 then
		ActivityModule.m_get_act_mission_reward_tos(slot0.actID, slot0.missionVO.id)
	end
end
