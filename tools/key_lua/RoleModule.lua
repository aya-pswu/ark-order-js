module("RoleModule", package.seeall)
require("Modules.Role.RoleConst")
require("Modules.Role.RoleMgr")
require("Modules.Role.RoleConfig")
require("Modules.Formation.FormationModule")
require("Modules.Copy.CopyModule")
require("Modules.Role.RoleModuleAutoGen")
require("Modules.Role.VO.RoleVO")
require("Modules.Role.VO.RoleArtworkVO")
require("Modules.Role.VO.RoleArtworkMatVO")
require("Modules.Role.VO.RoleCommonHeadVO")
require("Modules.Role.VO.RoleHeadSetVO")
require("Modules.Role.VO.RoleBuffVO")
require("Modules.Role.View.RoleAssistantRenamePanel")
createModulePanelFunc("RoleModule", "assistantRenamePanel", RoleAssistantRenamePanel)

function initModule()
	registerModuleSocket("RoleModule")
	addMessageListener(ModuleCommand.OPEN_ROLE_PANEL, openPanel)
	addMessageListener(ModuleCommand.ENTER_GAME, onEnterGame)
	addMessageListener(ModuleCommand.OPEN_ROLE_INFORMATION_PANEL, onOpenInformationPanel)
end

function onEnterGame()
	m_avatar_border_detail_tos()
	m_role_buff_info_tos()
end

function m_role_buff_info_tos()
	Net.createAndSendProto("m_role_buff_info_tos")
end

function m_role_buff_info_toc(slot0)
	RoleMgr.updateBuffs(slot0.buffs, true)
end

function m_role_buff_update_toc(slot0)
	RoleMgr.updateBuffs(slot0.buffs)
end

function m_count_buff_info_toc(slot0)
	RoleMgr.initCountBuff(slot0.list)
end

function m_count_buff_update_toc(slot0)
	for slot4, slot5 in ipairs(slot0.update) do
		if slot5.val > 0 then
			RoleMgr.updateCountBuff(slot5.id, slot5)
		else
			RoleMgr.removeCountBuff(slot5.id)
		end
	end
end

function m_role_score_change_toc(slot0)
	for slot4, slot5 in ipairs(slot0.role_scores) do
		GlobalData.updateScore(slot5.id, slot5.val)
		Dispatcher.dispatch(ModuleCommand.ROLE_SCORE_CHANGE, slot5.id)
	end
end

function m_role_attr_change_toc(slot0)
	for slot4, slot5 in ipairs(slot0.changes) do
		if RoleConst.getFieldByChangeType(slot5.change_type) then
			slot7 = GlobalData.gold
			slot8 = GlobalData.silver
			GlobalData[slot6] = slot5.new_value

			if slot5.change_type == 3 or slot5.change_type == 7 then
				GlobalData.updateGold()
				Dispatcher.dispatch(ModuleCommand.GOLD_CHANGE)
			end

			if slot5.change_type == 1 then
				Dispatcher.dispatch(ModuleCommand.SILVER_CHANGE)
			end

			if slot5.change_type == 4 then
				Dispatcher.dispatch(ModuleCommand.TOTAL_PAY_MONEY_CHANGE)
			end

			if slot5.change_type == 6 then
				Dispatcher.dispatch(ModuleCommand.TOTAL_PAY_GOLD_CHANGE)
			end
		end
	end

	Dispatcher.dispatch(ModuleCommand.ROLE_ATTR_CHANGE)
end

function m_vit_update_toc(slot0)
	GlobalData.vit = slot0.vit
	GlobalData.vitBuyTime = slot0.buy_time

	Dispatcher.dispatch(ModuleCommand.ROLE_ATTR_CHANGE)
end

function m_role_exp_change_toc(slot0)
	GlobalData.exp = slot0.new_exp

	Dispatcher.dispatch(ModuleCommand.ROLE_ATTR_CHANGE)
end

function m_role_levelup_toc(slot0)
	GlobalData.level = slot0.level
	GlobalData.exp = slot0.exp
	GlobalData.nextLevelExp = slot0.next_level_exp

	Dispatcher.dispatch(ModuleCommand.ROLE_ATTR_CHANGE)
	Dispatcher.dispatch(ModuleCommand.ROLE_LV_CHANGE)

	if SDKMgr.isDncMedia() then
		if slot0.level == 5 then
			SDKModule.trackEvent(59)
		elseif slot0.level == 8 then
			SDKModule.trackEvent(60)
		elseif slot0.level == 10 then
			SDKModule.trackEvent(61)
		elseif slot0.level == 20 then
			SDKModule.trackEvent(62)
		end
	elseif SDKMgr.isBgGames() then
		if slot0.level == 5 then
			SDKModule.trackEvent(1016)
		elseif slot0.level == 8 then
			SDKModule.trackEvent(1017)
		elseif slot0.level == 10 then
			SDKModule.trackEvent(1018)
		elseif slot0.level == 50 then
			SDKModule.trackEvent(1019)
		elseif slot0.level == 100 then
			SDKModule.trackEvent(1020)
		end
	elseif SDKMgr.isKomoe() and slot0.level == 10 then
		SDKModule.trackEvent(3)
	end
end

function toProfileInfo()
	Net.createAndSendProto("m_role_profile_info_tos")
end

function m_role_profile_info_toc(slot0)
	RoleMgr.helper = slot0.helper
	RoleMgr.intro = slot0.intro

	updateInformationPanel()
end

slot0 = false

function toHelper(slot0, slot1)
	uv0 = slot1 or false

	Net.createAndSendProto("m_role_profile_helper_tos", {
		help_id_list = slot0
	})
end

function m_role_profile_helper_toc(slot0)
	RoleMgr.updateHelpGroup(slot0.help_list)

	GlobalData.faceGroupID = 0
	RoleMgr.isWaitGroupToc = false

	if uv0 then
		Dispatcher.dispatch(ModuleCommand.ROLE_ASSISTANT_RIGHT_CHANGE)
	else
		updateInformationPanel()
	end
end

function toIntro(slot0)
	Net.createAndSendProto("m_role_profile_intro_tos", {
		intro = slot0
	})
end

function m_role_profile_intro_toc(slot0)
	Tips.addTips("修改成功")

	RoleMgr.intro = slot0.intro

	updateInformationPanel()
end

function m_role_title_info_toc(slot0)
	RoleMgr.updateRoleTitleVO(slot0.use_titles)
end

function m_role_title_list_tos()
	Net.createAndSendProto("m_role_title_list_tos")
end

function m_role_title_list_toc(slot0)
	RoleMgr.updateOwnTitles(slot0.title_list)
	updateTitleSelectPanel("updateView")
end

function m_role_title_update_toc(slot0)
	RoleMgr.updateOwnTitles(slot0.update)
	updateTitleSelectPanel("updateView")
end

function m_role_title_active_tos(slot0)
	Net.createAndSendProto("m_role_title_active_tos", {
		id = slot0
	})
end

function m_role_title_active_toc(slot0)
	Tips.addTips("称号激活成功")
	updateTitleSelectPanel("updateView")
end

function m_role_title_select_tos(slot0, slot1)
	Net.createAndSendProto("m_role_title_select_tos", {
		title_id = slot0,
		op_type = slot1
	})
end

function m_role_title_select_toc(slot0)
	Tips.addTips("称号更换成功")
	RoleMgr.updateRoleTitleVO(slot0.use_titles)
	updateInformationPanel()
	updateIDCardPanel()
	Dispatcher.dispatch(ModuleCommand.ROLE_TITLE_CHANGE)
end

function m_role_daily_update_toc(slot0)
	RoleMgr.updateDailyTimes(slot0)
	Dispatcher.dispatch(ModuleCommand.DAILY_UPDATE, slot0)
end

function m_activity_daily_toc(slot0)
	RoleMgr.initDailyTimes(slot0)
	Dispatcher.dispatch(ModuleCommand.DAILY_UPDATE, slot0)
end

function toSubscribe(slot0, slot1)
	Net.createAndSendProto("m_role_subscribe_tos", {
		subject_id = slot0,
		op_type = slot1
	})
end

function m_role_rename_time_toc(slot0)
	RoleMgr.renameEndTime = slot0.time
end

function m_role_rename_tos(slot0)
	Net.createAndSendProto("m_role_rename_tos", {
		op_type = 3,
		new_name = slot0
	})
end

function m_avatar_border_detail_tos()
	Net.createAndSendProto("m_avatar_border_detail_tos")
end

function m_avatar_border_detail_toc(slot0)
	RoleMgr.initHeadInfo(slot0)
end

function m_change_avatar_border_tos(slot0)
	Net.createAndSendProto("m_change_avatar_border_tos", {
		id = slot0
	})
end

function m_change_avatar_border_toc(slot0)
	Tips.addTips("头像框切换成功")
	GlobalData.updateRoleHead(slot0.id)
	updateHeadPanel()
end

function m_activate_avatar_border_toc(slot0)
	RoleMgr.activeNewHead(slot0.id)
end

function m_check_avatar_border_tos()
	Net.createAndSendProto("m_check_avatar_border_tos")
end

function m_check_head_tos()
	Net.createAndSendProto("m_check_head_tos")
end

function m_check_head_toc(slot0)
	RoleMgr.updateHeadsList(slot0)
	Dispatcher.dispatch(ModuleCommand.ROLE_ID_HEAD_UPDATE, true)
end

function m_buy_head_tos(slot0)
	Net.createAndSendProto("m_buy_head_tos", {
		id = slot0
	})
end

function m_buy_head_toc(slot0)
	RoleMgr.updateHeadsListLock(slot0.id)
	Dispatcher.dispatch(ModuleCommand.ROLE_ID_HEAD_UPDATE, true)
end

function m_change_head_tos(slot0, slot1)
	Net.createAndSendProto("m_change_head_tos", {
		id = slot0,
		opt = slot1
	})
end

function m_change_head_toc(slot0)
	Tips.addTips("已成功切换头像")

	if slot0.opt == RoleConst.USE_TYPE_HEAD then
		GlobalData.headID = slot0.id
	elseif slot0.opt == RoleConst.USE_TYPE_FACE then
		GlobalData.faceGroupID = slot0.id
	end

	GlobalData.useType = slot0.opt

	Dispatcher.dispatch(ModuleCommand.ROLE_ID_HEAD_UPDATE, true)
	RoleModule.updateInformationPanel()
	RoleModule.updateIDCardPanel()
end

function m_new_head_toc(slot0)
	RoleMgr.updateHeadsListNew(slot0.id)
	RedPointManager.changePointState(RedPointConst.ROLE_HEAD, true)
	Dispatcher.dispatch(ModuleCommand.ROLE_ID_HEAD_UPDATE, true)
end

function m_buy_servant_face_tos(slot0, slot1)
	printLbz(slot0, slot1)
	Net.createAndSendProto("m_buy_servant_face_tos", {
		servant_type = slot0,
		face_type = slot1
	})
end

function m_buy_servant_face_toc(slot0)
	if RoleMgr.getHeadSetVO(slot0.face_type, true) ~= nil then
		slot1.unlock = true
	end

	RoleModule.updateIDCardPanel()
	Dispatcher.dispatch(ModuleCommand.ROLE_ID_HEAD_UPDATE, true)
end

function m_check_medal_tos()
	Net.createAndSendProto("m_check_medal_tos")
end

function m_check_medal_toc(slot0)
	RoleMgr.updateMedalAllList(slot0.list)
	RoleMgr.updateMedalList(slot0.use)
end

function m_equip_medal_tos(slot0, slot1)
	Net.createAndSendProto("m_equip_medal_tos", {
		nth = slot0,
		id = slot1
	})
end

function m_equip_medal_toc(slot0)
	RoleMgr.addMedalList(slot0)
	Dispatcher.dispatch(ModuleCommand.ROLE_INFORMATION_LIST_UPDATE)
end

function m_discharge_medal_tos(slot0)
	Net.createAndSendProto("m_discharge_medal_tos", {
		nth = slot0
	})
end

function m_discharge_medal_toc(slot0)
	RoleMgr.subMedalList(slot0)
	Dispatcher.dispatch(ModuleCommand.ROLE_INFORMATION_LIST_UPDATE)
end

function m_role_show_team_info_tos(slot0)
	Net.createAndSendProto("m_role_show_team_info_tos", {
		to_role = slot0
	})
end

function m_role_show_team_info_toc(slot0)
	RoleMgr.currentInformationUID = slot1 == 0 and GlobalData.myRoleIDNum or slot1

	RoleMgr.setOutCardList(slot0.servants)
	RoleMgr.updateOutCardName(slot0.name)

	if Util.int64ToNumber(slot0.to_role) ~= 0 and slot1 ~= GlobalData.myRoleIDNum then
		FriendModule.updateOtherRolePanel()
	else
		updateInformationPanel()
	end
end

function m_change_show_team_tos(slot0, slot1)
	Net.createAndSendProto("m_change_show_team_tos", {
		servant = slot0,
		nth = slot1
	})
end

function m_change_show_team_toc(slot0)
	RoleMgr.setOutCardList(slot0.servants)
	Dispatcher.dispatch(ModuleCommand.ROLE_ASSISTANT_SERVANT_UPDATE)
	RoleModule.updateInformationPanel()
end

function m_life_achievement_info_tos(slot0)
	Net.createAndSendProto("m_life_achievement_info_tos", {
		to_role = slot0
	})
end

function m_life_achievement_info_toc(slot0)
	RoleMgr.currentInformationUID = slot1 == 0 and GlobalData.myRoleIDNum or slot1

	RoleMgr.updateAchievementList(slot0.list)

	if Util.int64ToNumber(slot0.to_role) ~= 0 and slot1 ~= GlobalData.myRoleIDNum then
		FriendModule.updateOtherRolePanel()
	else
		updateInformationPanel()
	end
end

function m_graffiti_material_tos()
	Net.createAndSendProto("m_graffiti_material_tos")
end

function m_graffiti_material_toc(slot0)
	RoleMgr.initArtworkMat(slot0)
	Dispatcher.dispatch(ModuleCommand.ROLE_ARTWORK_MAT_UPDATE)
end

function m_unlock_artwork_page_tos()
	Net.createAndSendProto("m_unlock_artwork_page_tos")
end

function m_unlock_artwork_page_toc(slot0)
	RoleMgr.openPage = slot0.sum_page

	updateInformationPanel()
end

function m_artwork_info_tos(slot0, slot1)
	Net.createAndSendProto("m_artwork_info_tos", {
		page = slot0,
		to_role = slot1 or GlobalData.myRoleIDNum
	})
end

function m_artwork_info_toc(slot0)
	for slot4, slot5 in ipairs(slot0.paint) do
		RoleMgr.initArtwork(slot5)
	end

	RoleMgr.openPage = math.max(1, #slot0.paint)

	Dispatcher.dispatch(ModuleCommand.ROLE_ARTWORK_PAGE_UPDATE)
	RoleMgr.setArtworkMaxSize(slot0.size)
end

function m_place_artwork_material_tos(slot0, slot1)
	Net.createAndSendProto("m_place_artwork_material_tos", {
		page = slot0,
		opts = slot1
	})
end

function m_place_artwork_material_toc(slot0)
	for slot4, slot5 in ipairs(slot0.deletes) do
		RoleMgr.removeArtwork(slot5)
	end

	for slot4, slot5 in ipairs(slot0.updates) do
		if RoleMgr.getArtwork(slot5.id) == nil then
			slot6 = RoleConfig.getArtworkVO(slot5.material_id)
			slot6.id = slot5.id

			RoleMgr.addArtwork(slot0.page, slot6)
		end

		slot6:init(slot5.id, slot5.transform, slot5.tier)
	end

	RoleMgr.sortPage(slot0.page)
	Dispatcher.dispatch(ModuleCommand.ROLE_ARTWORK_PAGE_UPDATE)
	Tips.addTips("已成功保存")
end

function m_change_show_team_name_tos(slot0)
	Net.createAndSendProto("m_change_show_team_name_tos", {
		name = slot0
	})
end

function m_change_show_team_name_toc(slot0)
	RoleMgr.updateOutCardName(slot0.name)
	Dispatcher.dispatch(ModuleCommand.ROLE_ASSISTANT_NAME_UPDATE)
end

function onOpenInformationPanel(slot0)
	if slot0 then
		RoleMgr.currentInformationUID = slot0

		FriendModule.openOtherRolePanel()
	else
		RoleMgr.currentInformationUID = GlobalData.myRoleIDNum

		openInformationPanel()
	end
end
