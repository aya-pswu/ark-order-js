module("Activity2Module", package.seeall)
require("Modules.Activity2.View.AutoGen.Activity2ChitosDiaryViewAutoGen")

function Activity2ChitosDiaryView.initUI(slot0)
	slot0:addMessageListener(ModuleCommand.ACT_MISSION_EXCHANGE_INFO, selfHandler(slot0, "updateChitosDiaryView"))
	UIEventListener.AddClick(slot0.spUnlockMask.gameObject, selfHandler(slot0, "onClickUnlock"))

	slot0.listMissions.LuaItemRender = ActivityChitosDiaryItem
	slot1 = slot0:create(ShopModule.ShopGoodsItem, {
		needLoadPrefab = false,
		isShowNum = false,
		notClickOpen = true
	})
	slot3 = ItemConfig.getItemVO(ActivityConfig.getChitosFinalRewardID())
	slot1.data = slot3

	slot1:setObj(slot0.goGoodsItem)
	slot1:addClick(luaHandler(slot0, "OnClickItemToShowPopup", slot0))

	slot0.finalItemVO = slot3
end

function Activity2ChitosDiaryView.onOpen(slot0)
	ActivityModule.m_act_mission_info_tos(slot0.actID)

	slot1 = RedPointConst.ACTIVITY_CHITOS_DIARY_FIRST

	if RedPointManager.getPointState(slot1) then
		MainModule.m_red_point_hide_tos(RedPointConst.getKeyByConst(slot1))
	end
end

function Activity2ChitosDiaryView.onGUI(slot0, slot1)
	return
end

function Activity2ChitosDiaryView.onRelease(slot0)
	return
end

function Activity2ChitosDiaryView.updateChitosDiaryView(slot0, slot1, slot2)
	if slot1 == slot0.actID then
		if slot2 == "info" then
			missionListVO = ActivityMgr.getActMissionInfo(slot0.actID)

			if missionListVO then
				if missionListVO:isNeedUnlock() then
					Util.setActive(slot0.spUnlockMask, true)
				else
					Util.setActive(slot0.spUnlockMask, false)
					slot0:playTheater(missionListVO)
				end

				slot0.lblCount.text = missionListVO:getFullMissionProgress()

				Util.setActive(slot0.spSelect, missionListVO:isHasGetFinalReward())

				slot0.listMissions.LuaDataProvider = missionListVO:getShowMissionVO()
				slot0.listMissions.LuaItemRenderOption = {
					actID = slot0.actID
				}

				slot0:registerRedPoint(RedPointConst.ACTIVITY_CHITOS_DIARY, luaHandler(slot0, "onRedPoint", slot0, missionListVO:isCanGetFinalReward()))

				slot0.missionListVO = missionListVO
			end
		elseif slot2 == "get" then
			ActivityModule.m_act_mission_info_tos(slot0.actID)
		end
	end
end

function Activity2ChitosDiaryView.onClickUnlock(slot0)
	Util.setActive(slot0.spUnlockMask, false)
	slot0:playTheater(slot0.missionListVO)
	slot0.missionListVO:updateShowMission()

	slot0.listMissions.LuaDataProvider = slot0.missionListVO:getShowMissionVO()
end

function Activity2ChitosDiaryView.onRedPoint(slot0, slot1, slot2)
	if slot1 and slot2 then
		Util.setActive(slot0.spRedTip, true)
	else
		Util.setActive(slot0.spRedTip, false)
	end
end

function Activity2ChitosDiaryView.OnClickItemToShowPopup(slot0)
	if GuideModule.notFinish(GuideConst.GUIDE_RELIC_3) then
		if SystemConfig.IsDebug then
			Tips.addTips("走完新手引导开启")
		end
	elseif slot0.missionListVO:isCanGetFinalReward() then
		ActivityModule.m_get_act_mission_reward_tos(slot0.actID, #slot0.missionListVO.missionList)
	else
		slot0.finalItemVO.showGetWay = true

		BagModule.openItemOperaPanel(slot0.finalItemVO)
	end
end

function Activity2ChitosDiaryView.playTheater(slot0, slot1)
	chapter = slot1:getCurrentChapter()

	TheaterModule.start(slot1:getCurrentTheaterID(chapter))
end
