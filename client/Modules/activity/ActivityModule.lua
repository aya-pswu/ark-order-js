module("ActivityModule", package.seeall)
require("Modules.Activity2.Activity2Module")
require("Modules.HoloLive.HoloLiveModule")
require("Modules.Activity.ActivityModuleAutoGen")
require("Modules.Activity.View.ActivityWorldTreeRankItem")
require("Modules.Activity.View.ActivityBili2233RankItem")
require("Modules.Activity.View.ActivityBili2233RankPopupPanel")
require("Modules.Activity.View.ActivityFantasyRewardsView")
require("Modules.Activity.View.ActivityPuzzleRewardChoicePanel")
require("Modules.Activity.View.ActivityTotalRechargeItem")
require("Modules.Activity.View.ActivityTotalRechargeView")
require("Modules.Activity.ActivityConst")
require("Modules.Activity.ActivityConfig")
require("Modules.Activity.ActivityMgr")
require("Modules.Activity.VO.ActivityPlanetarianStarVO")
require("Modules.Activity.VO.ActivityGreeceArenaVO")
require("Modules.Activity.VO.ActivityAssistantVO")
createModulePanelFunc("ActivityModule", "bili2233RankPopupPanel", ActivityBili2233RankPopupPanel)
createModulePanelFunc("ActivityModule", "puzzleRewardChoicePanel", ActivityPuzzleRewardChoicePanel)

function initModule()
	registerModuleSocket("ActivityModule")
	addMessageListener(ModuleCommand.ENTER_GAME, onEnterGame)
	addMessageListener(ModuleCommand.OPEN_SIGN_PANEL, openSelectActivity, ActivityConst.ACT_SIGN)
	addMessageListener(ModuleCommand.OPEN_ACTIVITY_PANEL, openSelectActivity)
	addMessageListener(ModuleCommand.OPEN_ACTIVITY_PANEL_BY_KIND, openSelectActivityByKind)
	addMessageListener(ModuleCommand.OPEN_ACTIVITY_VOTE_PANEL, openChristmasVotePanel)
	addMessageListener(ModuleCommand.OPEN_INVITE_SHARE_PANEL, openInviteSharePanel)
	addMessageListener(ModuleCommand.ON_MUSICGAME_RANK_UPDATE, updateMusicGameRankPanel)
	addMessageListener(ModuleCommand.ON_UPDATE_MUSICGAME_INFO, updatePanel)
	addMessageListener(ModuleCommand.OPEN_ACTIVITY_PLANETARIAN_PANEL, openPlanetarianPanel)
	addMessageListener(ModuleCommand.OPEN_GREECE_ARENA_PANEL, openGreeceArenaPanel)
	addMessageListener(ModuleCommand.ON_ADVENTURE_MAP_ENTER, updatePlanetarianPanel)
	addMessageListener(ModuleCommand.ACTIVITY_PLANETARIAN_CHAPTER_REWARD, m_planetarian_chapter_reward_tos)
	addMessageListener(ModuleCommand.ACTIVITY_GREECE_TRAINING_PANEL_OPEN, openGreeceTrainingPanel)
	addMessageListener(ModuleCommand.OPEN_GREECE_EXPLORE_PANEL, onOpenGreeceCopyInfoPanel)
	addMessageListener(ModuleCommand.ROLE_SCORE_CHANGE, updateScore)
	addMessageListener(ModuleCommand.ACT_SCORE_EXCHANGE_INFO_TOS, m_act_score_exchange_info_tos)
	addMessageListener(ModuleCommand.ACR_MISSION_EXCHANGE_INFO_TOS, m_act_mission_info_tos)
	addMessageListener("OPEN_MEMOIRS_PANEL", openSecAnniversaryMemoirsPanel)
	addMessageListener(ModuleCommand.ACT_TIME_UPDATE, setEndActTime)
end

function onEnterGame()
	return
end

function updateScore(slot0)
	if slot0 == GameConst.SCORE_CHILDRENS_DAY then
		RedPointManager.changePointState(RedPointConst.ACTIVITY_CHILDRENS_DAY, GlobalData.getScore(GameConst.SCORE_CHILDRENS_DAY) >= 10)
	end
end

function m_role_acts_tos()
	Net.sendProto(Message.createProto("m_role_acts_tos"))
end

slot0 = nil

function m_role_acts_toc(slot0)
	ActivityMgr.updateAllActs(slot0.acts)

	if GuideMgr.isGuiding() == false and PENDING_ACTS == nil then
		PENDING_ACTS = {}

		for slot4, slot5 in ipairs(slot0.acts) do
			if slot5.val == ActivityConst.ACT_STATE_REWARD then
				PENDING_ACTS[slot5.id] = true
			end
		end

		if NoticeModule.checkTodayIsFirstLogin() then
			NoticeModule.firstLoginAndShowNotice()
		else
			dealwithNextAct()
		end
	end
end

slot1 = false

function dealwithNextAct()
	if PENDING_ACTS then
		slot0, slot1 = isLoginAct()

		if PENDING_ACTS[ActivityConst.ACT_LOGIN] then
			dealwithLogin()
		elseif slot0 then
			dealWithLoginAct(slot1)
		elseif PENDING_ACTS[ActivityConst.ACT_SIGN] then
			dealwithSign()
		elseif PENDING_ACTS[ActivityConst.ACT_BILI_2233] then
			dealwithBili2233()
		elseif PENDING_ACTS[ActivityConst.ACT_DEAL_ELEMENT] then
			PENDING_ACTS[ActivityConst.ACT_DEAL_ELEMENT] = false

			ElementModule.openHelpInfoPanel()
		elseif BagMgr.needShowExchange() then
			BagModule.openExchangePanel()
		elseif ShopMgr.hasMessage() then
			ShopModule.dealwithShopMessage()
		else
			ShopModule.dealwithNextPayOrder()

			if not PREDEAL_ENDED then
				PREDEAL_ENDED = true
				MainMgr.isPreActEnd = true

				Dispatcher.dispatch(ModuleCommand.ON_ACTIVITY_PREDEAL_END)
			end
		end
	else
		ShopModule.dealwithNextPayOrder()

		if not PREDEAL_ENDED then
			PREDEAL_ENDED = true
			MainMgr.isPreActEnd = true

			Dispatcher.dispatch(ModuleCommand.ON_ACTIVITY_PREDEAL_END)
		end
	end
end

function isLoginAct()
	slot2 = 0
	slot3 = false

	for slot7, slot8 in ipairs(table.keys(PENDING_ACTS)) do
		if table.index(Activity2Config.getPopLogin(), slot8) ~= nil then
			slot2 = slot8
			slot3 = true
		end
	end

	return slot3, slot2
end

function addDealEvent(slot0)
	PENDING_ACTS = PENDING_ACTS or {}
	PENDING_ACTS[slot0] = true
end

function openSelectActivity(slot0)
	openPanel("actID", slot0 or 0)
end

function openSelectActivityByKind(slot0)
	for slot7, slot8 in pairs(ActivityMgr.getAllActList()) do
		if slot8.actKind == (slot0 or 1) then
			slot2 = nil or slot8.id

			if RedPointManager.getPointStateByArray(slot8.redPoint) then
				slot1 = slot8.id

				break
			end
		end
	end

	openPanel("actID", slot1 or slot2)
end

function m_role_act_update_toc(slot0)
	m_role_act_update_one(slot0.act_id, slot0.state)
end

function m_role_act_update_list_toc(slot0)
	for slot4, slot5 in pairs(slot0.lsit) do
		m_role_act_update_one(slot5.id, slot5.val)
	end

	ItemConfig.checkElementItemReplaceName()
	ShopConfig.checkShopMessageBgReplace()
	MissionConfig.checkMissionReplaceArgs()
	ServantConfig.checkServantReplaceName()
	SummonConfig.checkSummonReplaceBgName()
end

function m_role_act_update_one(slot0, slot1)
	if slot1 == ActivityConst.ACT_STATE_END or slot1 == ActivityConst.ACT_STATE_NOT_OPEN then
		ActivityMgr.delAct(slot0)
	elseif ActivityMgr.hasAct(slot0) then
		ActivityMgr.updateAct(slot0, slot1)
	else
		ActivityMgr.addAct(slot0, slot1)
	end

	Dispatcher.dispatch(ModuleCommand.ACTIVITY_UPDATE, slot0)
end

function m_act_reg_notify_tos(slot0, slot1)
	Net.createAndSendProto("m_act_reg_notify_tos", {
		act_id = slot0,
		bool_int = slot1
	})
end

function m_act_reg_notify_toc(slot0)
	printTable(slot0)

	if slot0.bool_int == 1 then
		ActivityMgr.registyActNotice(slot0.act_id)
	else
		ActivityMgr.removeregistyActNotice(slot0.act_id)
	end
end

function m_act_notify_toc(slot0)
	printTable(slot0)
	Dispatcher.dispatch(ModuleCommand.ACT_NOTIFY, slot0.act_id)
end

function m_act_notify_registry_toc(slot0)
	printTable(slot0)

	for slot4, slot5 in ipairs(slot0.id_list) do
		ActivityMgr.registyActNotice(slot5)
	end
end

function dealwithLogin()
	PENDING_ACTS[ActivityConst.ACT_LOGIN] = nil

	openSelectActivity(ActivityConst.ACT_LOGIN)
end

function m_role_newcomer_info_tos()
	Net.sendProto(Message.createProto("m_role_newcomer_info_tos"))
end

function m_role_newcomer_info_toc(slot0)
	ActivityMgr.updateLoginData(slot0)
end

function m_role_newcomer_sign_tos()
	Net.sendProto(Message.createProto("m_role_newcomer_sign_tos"))
end

function m_role_newcomer_sign_toc(slot0)
	ActivityMgr.clearPendingReward()
	RedPointManager.changePointState(RedPointConst.ACTIVITY_LOGIN, false)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_LOGIN_UPDATE)
end

slot2 = nil

function isAutoOpen()
	return AUTO_OPEN_SIGN
end

function clearAutoOpen()
	AUTO_OPEN_SIGN = nil
end

function dealwithSign()
	PENDING_ACTS[ActivityConst.ACT_SIGN] = nil

	ActivityModule.m_role_sign_info_tos(true)
end

function m_role_sign_info_tos(slot0)
	-- ⚠️ 自动弹窗标志必须独立于 uv0（活动预处理表）：一百七十二明文重写曾把两者合并在
	-- uv0 上，dealwithSign→m_role_sign_info_tos(true) 用布尔覆写预处理表，此后任何
	-- dealwithNextAct→isLoginAct→table.keys(uv0) 即 pairs(boolean) 崩（2026-10-12 真机
	-- 23:33/23:37 连续复现）。原版字节码两者是不同的模块级变量，此处用 uv2 分离。
	AUTO_OPEN_SIGN = slot0
	slot1 = Message.createProto("m_role_sign_info_tos")
	slot1.reward_list_id = ActivityMgr.getSignKey()

	Net.sendProto(slot1)
end

function m_role_sign_info_toc(slot0)
	ActivityMgr.updateSignData(slot0)

	if slot0.today_sign == ActivityConst.SIGN_SATE_NONE then
		if AUTO_OPEN_SIGN then
			openSignPopPanel()
		end

		LoopManager.setTimeout(ActivityModule.m_role_sign_tos, 0.25)
	end
end

function m_role_sign_tos()
	Net.sendProto(Message.createProto("m_role_sign_tos"))
end

function m_role_sign_toc(slot0)
	ActivityMgr.addSign()
	updateSignPopPanel("update", 1)
	RedPointManager.changePointState(RedPointConst.ACTIVITY_SIGN, false)
end

function m_level_reward_info_tos()
	Net.createAndSendProto("m_level_reward_info_tos")
end

function m_level_reward_info_toc(slot0)
	ActivityMgr.initGetLevelDic(slot0)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_LOGIN_LEVEL)
end

function m_level_reward_get_tos(slot0)
	Net.createAndSendProto("m_level_reward_get_tos", {
		lv = slot0
	})
end

function m_level_reward_get_toc(slot0)
	ActivityMgr.addGetLevel(slot0.lv)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_LOGIN_LEVEL)
end

function m_copy_reward_list_tos()
	Net.createAndSendProto("m_copy_reward_list_tos")
end

function m_copy_reward_list_toc(slot0)
	ActivityMgr.updateFbRewardByArr(slot0.list)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_FB_REWARD)
end

function m_copy_reward_get_tos(slot0)
	Net.createAndSendProto("m_copy_reward_get_tos", {
		id = slot0
	})
end

function m_copy_reward_get_toc(slot0)
	ActivityMgr.updateFbRewardByOne({
		id = slot0.id,
		val = ActivityConst.FB_REWARD_STATE_GOT
	})
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_FB_REWARD)
end

function m_vivian_info_tos()
	Net.sendProto(Message.createProto("m_vivian_info_tos"))
end

function m_vivian_info_toc(slot0)
	ActivityMgr.updateViViAnVO(slot0)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_VI_VI_AN)
end

function m_vivian_unlock_tos()
	Net.sendProto(Message.createProto("m_vivian_unlock_tos"))
end

function m_first_pay_info_tos()
	Net.createAndSendProto("m_first_pay_info_tos")
end

function m_first_pay_info_toc(slot0)
	ActivityMgr.firstPayState = slot0.state

	Dispatcher.dispatch(ModuleCommand.ACTIVITY_FIRST_PAY)
end

function m_first_pay_get_tos()
	Net.createAndSendProto("m_first_pay_get_tos")
end

function m_first_pay_get_toc()
	ActivityMgr.firstPayState = ActivityConst.FIRST_PAY_STATE_GOT

	Dispatcher.dispatch(ModuleCommand.ACTIVITY_FIRST_PAY)
end

function m_act_medal_info_tos(slot0)
	Net.createAndSendProto("m_act_medal_info_tos", {
		act_id = slot0
	})
end

function m_act_medal_info_toc(slot0)
	ActivityMgr.setMedalActVO(slot0)
end

function m_act_medal_get_tos(slot0, slot1)
	Net.createAndSendProto("m_act_medal_get_tos", {
		act_id = slot0,
		id = slot1
	})
end

function m_act_medal_get_toc()
	return
end

function m_act_puzzle_info_tos(slot0)
	Net.createAndSendProto("m_act_puzzle_info_tos", {
		act_id = slot0
	})
end

function m_act_puzzle_info_toc(slot0)
	ActivityMgr.setPuzzleActVO(slot0)
end

function m_act_puzzle_active_tos(slot0, slot1)
	Net.createAndSendProto("m_act_puzzle_active_tos", {
		act_id = slot0,
		id = slot1
	})
end

function m_act_puzzle_active_toc(slot0)
	return
end

function m_act_puzzle_get_tos(slot0, slot1, slot2)
	Net.createAndSendProto("m_act_puzzle_get_tos", {
		act_id = slot0,
		id = slot1,
		nth = slot2 ~= nil and slot2 or 1
	})
end

function m_act_puzzle_get_toc(slot0)
	return
end

function dealwithBili2233()
	PENDING_ACTS[ActivityConst.ACT_BILI_2233] = nil

	openSelectActivity(ActivityConst.ACT_BILI_2233)
end

function dealWithLoginAct(slot0)
	PENDING_ACTS[slot0] = nil

	openSelectActivity(slot0)
end

function m_role_accumulative_info_tos()
	Net.createAndSendProto("m_role_accumulative_info_tos", {
		id = 0
	})
end

function m_role_accumulative_info_toc(slot0)
	ActivityMgr.initSigns(slot0.sign_tables)

	if isOpenPanel() then
		updatePanel()
	end
end

function m_role_accumulative_sign_tos(slot0)
	Net.createAndSendProto("m_role_accumulative_sign_tos", {
		id = slot0
	})
end

function m_role_accumulative_sign_toc(slot0)
	slot1 = ActivityMgr.getActSignVO(slot0.id)
	slot1.signedDay = slot0.days
	slot1.isTodayCanSign = false
	ActivityMgr.getActVO(slot0.id).state = ActivityConst.ACT_STATE_VISIT
end

function m_copy_ultima_test_info_tos()
	Net.createAndSendProto("m_copy_ultima_test_info_tos", {
		act_id = Bili2233VO.FIGHT_ACT_ID_RENOVATE
	})
end

function m_copy_ultima_test_info_toc(slot0)
	ActivityMgr.getBili2233VO():initByInfo(slot0)
	CopyMgr.updataBarriers({
		{
			first_reward = 0,
			barrier_id = Bili2233VO.FIGHT_COPY_ID,
			stars = {},
			servant_types = slot0.servant_types,
			drop_rate_up = {},
			servant_rate_up = {},
			pass_times = {}
		}
	})
	updateCopyInfoPanel(Bili2233VO.FIGHT_COPY_ID)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_2233_FIRST_FIGHT)
end

function m_christmas_banner_tos()
	Net.createAndSendProto("m_christmas_banner_tos")
end

function m_christmas_banner_toc(slot0)
	ActivityMgr.updateMyChristmasBox(slot0.christmas_box)
	ActivityMgr.updateMySnow(slot0.snowball)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_CHRISTMAS)
end

function m_christmas_servant_rank_tos()
	Net.createAndSendProto("m_christmas_servant_rank_tos")
end

function m_christmas_servant_rank_toc(slot0)
	printXmm("誓灵总榜", slot0.christmas_box, slot0.can_vote)
	ActivityMgr.updateOpenVote(slot0.can_vote)
	ActivityMgr.updateServantVoteList(slot0.rows)
	ActivityMgr.updateMyChristmasBox(slot0.christmas_box)
	updateChristmasVotePanel("updateCurrentTabView")
end

function m_christmas_servant_support_tos(slot0)
	Net.createAndSendProto("m_christmas_servant_support_tos", {
		servant_type_id = slot0
	})
end

function m_christmas_servant_support_toc(slot0)
	printXmm("我的数据", slot0.rank, slot0.ticket_num)
	ActivityMgr.updateServantPeopleVoteList(slot0.rows)
	ActivityMgr.updateServantMyVoteData(slot0.rank, slot0.ticket_num)
end

function m_christmas_my_vote_tos()
	Net.createAndSendProto("m_christmas_my_vote_tos")
end

function m_christmas_my_vote_toc(slot0)
	printXmm("我的投票", slot0.ticket_num)
	ActivityMgr.updateMyVoteNum(slot0.ticket_num)
	ActivityMgr.updateMyVoteList(slot0.rows)
	ActivityModule.openMyVotePopupPanel({
		id = 123
	})
end

function m_christmas_role_tos(slot0)
	Net.createAndSendProto("m_christmas_role_tos", {
		index = slot0
	})
end

function m_christmas_role_toc(slot0)
	printXmm("第几个奖励", slot0.reward_type, slot0.rank, slot0.my_ticket)
	ActivityMgr.updatePeopleVoteList(slot0.rows)
	ActivityMgr.updateRewardIndex(slot0.reward_type)
	ActivityMgr.updateMyVoteData({
		rank = slot0.rank,
		voteNum = slot0.my_ticket
	})
	LoopManager.setTimeout(function ()
		updateChristmasVotePanel("updateCurrentTabView")
	end, 0.05)
end

function m_christmas_vote_tos(slot0, slot1)
	Net.createAndSendProto("m_christmas_vote_tos", {
		servant_type_id = slot0,
		ticket_num = slot1
	})
end

function m_christmas_vote_toc(slot0)
	printXmm("我的票数", slot0.christmas_box)
	ActivityMgr.updateMyChristmasBox(slot0.christmas_box)
	updateChristmasVotePanel("updateCurrentTabView")

	slot1 = nil

	Tips.addTips(csformat("投票成功，已累计给{0}投了{1}票", slot0.servant_type_id == 9999998 and "小舟酱" or slot0.servant_type_id == 9999999 and "杂鱼光" or ServantConfig.getServantConfigVO(slot0.servant_type_id).name, slot0.ticket_num))
end

function m_invite_info_tos(slot0)
	Net.createAndSendProto("m_invite_info_tos", {
		act_id = slot0
	})
end

function m_invite_info_toc(slot0)
	ActivityMgr.initInviteRewardVO(slot0.act_id)
	ActivityMgr.updateInviteData(slot0)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_INVITE_UPDATE)
end

function m_invite_code_use_tos(slot0, slot1)
	Net.createAndSendProto("m_invite_code_use_tos", {
		act_id = slot0,
		code = slot1
	})
end

function m_invite_code_use_toc()
	Tips.addTips("绑定成功，快告诉你的好友吧~")
	Dispatcher.dispatch(ModuleCommand.UPDATE_INVITE_PANEL_INFO, ActivityMgr.actID)
end

function m_invite_code_query_tos(slot0, slot1)
	Net.createAndSendProto("m_invite_code_query_tos", {
		act_id = slot0,
		code = slot1
	})
end

function m_invite_code_query_toc(slot0)
	ActivityMgr.otherRoleID = slot0.role_id
	ActivityMgr.myInviteCode[slot0.act_id] = slot0.code
	ActivityMgr.whoInviteMe[slot0.act_id] = slot0.role_name

	openInviteInputCodeTipPanel()
end

function m_invite_get_reward_tos(slot0, slot1)
	Net.createAndSendProto("m_invite_get_reward_tos", {
		act_id = slot0,
		reward_id = slot1
	})
end

function m_invite_get_reward_toc(slot0)
	ActivityMgr.updateInviteItemVO(slot0)
	ActivityMgr.updateInviteSingleItemVO(slot0.act_id, slot0.reward)
	Dispatcher.dispatch(ModuleCommand.UPDATE_INVITE_GOODS_ITEM_SHOW)
end

function m_invite_list_tos(slot0)
	Net.createAndSendProto("m_invite_list_tos", {
		act_id = slot0
	})
end

function m_invite_list_toc(slot0)
	ActivityMgr.updateHasInviteList(slot0)
	updateInviteViewListPopupPanel()
end

function m_invite_view_task_tos(slot0, slot1)
	Net.createAndSendProto("m_invite_view_task_tos", {
		act_id = slot0,
		ids = slot1
	})
end

function m_invite_view_task_toc(slot0)
	ActivityMgr.updateNoCompleteTaskList(slot0)

	if table.nums(ActivityMgr.noCompleteList) == 0 then
		Tips.addTips("当前没有未完成任务的御灵士")
	else
		openInviteNoCompletePopupPanel()
		updateInviteNoCompletePopupPanel()
	end
end

function m_act_prize_info_tos(slot0)
	Net.createAndSendProto("m_act_prize_info_tos", {
		act_id = slot0
	})
end

function m_act_prize_info_toc(slot0)
	ActivityMgr.setSpringActivity(slot0.activity_flag)
	ActivityMgr.setSpringSignDay(slot0.days)

	for slot4, slot5 in ipairs(slot0.got_list) do
		ActivityMgr.setSpringActivityRewardState(slot5, ActivityConst.SPRING_REWARDS_GET)
	end

	for slot4, slot5 in ipairs(slot0.pending_rewards) do
		ActivityMgr.setPendingReward(slot5)
	end

	Dispatcher.dispatch(ModuleCommand.ACTIVITY_SPRING_VIEW_UPDATE)
end

function m_act_prize_get_tos(slot0, slot1)
	Net.createAndSendProto("m_act_prize_get_tos", {
		act_id = slot0,
		prize_id = slot1
	})
end

function m_act_prize_get_toc(slot0)
	ActivityMgr.setSpringActivityRewardState(slot0.prize_id, ActivityConst.SPRING_REWARDS_GET)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_SPRING_VIEW_UPDATE)
end

function m_act_prize_sign_tos(slot0)
	Net.createAndSendProto("m_act_prize_sign_tos", {
		act_id = slot0
	})
end

function m_act_prize_sign_toc(slot0)
	ActivityMgr.cleanSpringPendingRewards()
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_SPRING_VIEW_UPDATE)
end

function m_act_repeater_toc(slot0)
	slot1 = ChatModule.ChatVO.new()
	slot2 = ActivityConfig.getSpringBless(slot0.msg_id)
	slot1.channel = ChatConst.CHANNEL_SYS
	slot1.msg = slot2.msg
	slot1.time = slot0.end_time
	slot1:getRoleVO().roleName = slot2.name
	ChatMgr.actChatVO = slot1
	ChatMgr.chatDataChange = true

	Util.autoTimeout("m_act_repeater_toc", function ()
		ChatMgr.actChatVO = nil
		ChatMgr.chatDataChange = true
	end, slot0.end_time - GlobalData.serverTime)
end

function m_valentines_info_tos(slot0)
	Net.createAndSendProto("m_valentines_info_tos", {
		is_guide = slot0
	})
end

function m_valentines_info_toc(slot0)
	ActivityMgr.setValentineServant(slot0.servant_id)
	ActivityMgr.setHeartNum(slot0.hearts)
	ActivityMgr.setValentineServantList(slot0.maxed_servant_types)
	ActivityMgr.setGuide(slot0.is_guide)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_VALENTINE_VIEW_UPDATE, 2)
end

function m_valentines_choose_tos(slot0)
	Net.createAndSendProto("m_valentines_choose_tos", {
		servant_id = slot0
	})
end

function m_valentines_choose_toc(slot0)
	ActivityMgr.setHeartNum(0)
	ActivityMgr.setValentineServant(slot0.servant_id)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_VALENTINE_VIEW_UPDATE, 2)
end

function m_valentines_gift_tos(slot0)
	Net.createAndSendProto("m_valentines_gift_tos", {
		amount = slot0
	})
end

function m_valentines_gift_toc(slot0)
	ActivityMgr.setHeartNum(slot0.hearts)

	if slot0.hearts >= 100 then
		RedPointManager.changePointState(RedPointConst.BAG_REPORT_POINT, true)
	end

	ActivityMgr.setValentineServantList(slot0.maxed_servant_types)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_VALENTINE_VIEW_UPDATE, 1)
end

function m_act_favor_info_tos()
	Net.createAndSendProto("m_act_favor_info_tos", {
		act_id = 1053
	})
end

function m_act_favor_info_toc(slot0)
	ActivityMgr.setRewardFavorableList(slot0.mission_list)
	ActivityMgr.setFavorable(slot0.favor)
	ActivityMgr.setHelpState(slot0.is_helper == 1)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_LTY_FAVORABLE_VIEW_UPDATE)
end

function m_act_favor_get_tos(slot0)
	Net.createAndSendProto("m_act_favor_get_tos", {
		act_id = 1053,
		id = slot0
	})
end

function m_act_favor_get_toc(slot0)
	ActivityMgr.setRewardFavorableListState(slot0.id)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_LTY_FAVORABLE_VIEW_UPDATE)
end

function m_act_favor_score_toc(slot0)
	ActivityMgr.setFavorable(slot0.favor)
end

function m_client_info_get_tos(slot0)
	Net.createAndSendProto("m_client_info_get_tos", {
		id = slot0
	})
end

function m_client_info_get_toc(slot0)
	if slot0.id == 1053 then
		ActivityMgr.setOpenFavorable(slot0.val == 1)
		Dispatcher.dispatch(ModuleCommand.ACTIVITY_FAVORABLE_SP_GUID_STATE, slot0.val == 0)
	end
end

function m_client_info_set_tos(slot0, slot1)
	Net.createAndSendProto("m_client_info_set_tos", {
		id = slot0,
		val = slot1
	})
end

function m_client_info_set_toc(slot0)
	return
end

function m_white_valentine_score_tos()
	Net.createAndSendProto("m_white_valentine_score_tos")
end

function m_white_valentine_score_toc(slot0)
	ActivityMgr.setWhiteValentineActiveNum(slot0.score)

	for slot4, slot5 in ipairs(slot0.rewards) do
		ActivityMgr.setWhiteValentineRewardList(slot5.id, slot5.val)
	end

	Dispatcher.dispatch(ModuleCommand.ACTIVITY_WHITE_VALENTINE_UPDATE_REWARD)
end

function m_get_white_valentine_tos(slot0)
	Net.createAndSendProto("m_get_white_valentine_tos", {
		id = slot0
	})
end

function m_get_white_valentine_toc(slot0)
	ActivityMgr.setWhiteValentineRewardList(slot0.id, ActivityConst.MISSION_GET)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_WHITE_VALENTINE_UPDATE_REWARD)
end

function m_act_mission_info_tos(slot0)
	Net.createAndSendProto("m_act_mission_info_tos", {
		act_id = slot0
	})
end

function m_act_mission_info_toc(slot0)
	ActivityMgr.initActMissionInfo(slot0)
	Dispatcher.dispatch(ModuleCommand.ACT_MISSION_EXCHANGE_INFO, slot0.act_id, "info")
	ActivityMgr.doActMissionToc(slot0.act_id, "info")
end

function m_get_act_mission_reward_tos(slot0, slot1)
	printXmm(slot0, slot1)
	Net.createAndSendProto("m_get_act_mission_reward_tos", {
		act_id = slot0,
		id = slot1
	})
end

function m_get_act_mission_reward_toc(slot0)
	-- ⚠️ 同 m_get_act_score_exchange_toc：ljd 丢失寄存器赋值、自由名 slot1 撞文件级局部（一百七十三扫描发现）
	local info = ActivityMgr.getActMissionInfo(slot0.act_id)
	if info ~= nil then
		info:setMission(slot0.id, ActivityConst.MISSION_GET)
	end

	Dispatcher.dispatch(ModuleCommand.ACT_MISSION_EXCHANGE_INFO, slot0.act_id, "get")
	ActivityMgr.doActMissionToc(slot0.act_id, "get")
end

function m_act_score_exchange_info_tos(slot0)
	Net.createAndSendProto("m_act_score_exchange_info_tos", {
		act_id = slot0
	})
end

function test_act_score_exchange_info_tos(slot0)
	for slot5 = 1, 5 do
		({
			act_id = slot0,
			score = {
				{
					id = 1,
					val = 250
				}
			},
			rewards = {}
		}).rewards[slot5] = {
			id = slot5,
			val = 2
		}
	end

	for slot5 = 6, 8 do
		slot1.rewards[slot5] = {
			id = slot5,
			val = 1
		}
	end

	m_act_score_exchange_info_toc(slot1)
end

function test_m_get_act_score_exchange_tos(slot0, slot1, slot2)
	m_get_act_score_exchange_toc({
		act_id = slot0,
		id = slot1
	})
end

function m_act_score_exchange_info_toc(slot0)
	ActivityMgr.initActScoreInfo(slot0)
	Dispatcher.dispatch(ModuleCommand.ACT_SCORE_EXCHANGE_INFO, slot0.act_id, "info")
	ActivityMgr.doActScoreToc(slot0.act_id, "info")
end

function m_act_login_info_tos(slot0)
	Net.createAndSendProto("m_act_login_info_tos", {
		act_id = slot0
	})
end

function m_act_login_info_toc(slot0)
	return
end

function m_get_act_score_exchange_tos(slot0, slot1, slot2)
	printXmm(slot0, slot1)
	Net.createAndSendProto("m_get_act_score_exchange_tos", {
		act_id = slot0,
		id = slot1,
		select_item = slot2 or 0
	})
end

function m_get_act_score_exchange_toc(slot0)
	-- ⚠️ 原版字节码此处寄存器= getActScoreInfo 返回的 VO，ljd 反编译丢失赋值、重写版曾逐字保留
	-- → 自由名 slot1 解析到文件级局部（预处理标志布尔）→ "attempt to call method 'setReward'"
	-- （2026-10-13 天外来客领奖实机复现）。用显式局部取 VO。
	local info = ActivityMgr.getActScoreInfo(slot0.act_id)
	if info ~= nil then
		info:setReward(slot0.id, ActivityConst.REWARDS_GET)
	end

	Dispatcher.dispatch(ModuleCommand.ACT_SCORE_EXCHANGE_INFO, slot0.act_id, "get")
	ActivityMgr.doActScoreToc(slot0.act_id, "get")
end

function m_get_all_exchange_tos(slot0)
	Net.createAndSendProto("m_get_all_exchange_tos", {
		act_id = slot0
	})
end

function m_get_all_exchange_toc(slot0)
	local info = ActivityMgr.getActScoreInfo(slot0.act_id)
	if info ~= nil then
		for slot5, slot6 in ipairs(slot0.ids) do
			info:setReward(slot6, ActivityConst.REWARDS_GET)
		end
	end

	Dispatcher.dispatch(ModuleCommand.ACT_SCORE_EXCHANGE_INFO, slot0.act_id, "get")
	ActivityMgr.doActScoreToc(slot0.act_id, "get")
end

function m_planetarian_info_tos(slot0)
	Net.createAndSendProto("m_planetarian_info_tos", {
		act_id = slot0 or 1077
	})
end

function m_planetarian_info_toc(slot0)
	ActivityMgr.initPlaneTarianInfo(slot0)
	updatePlanetarianPanel()
end

function m_planetarian_light_tos(slot0, slot1)
	Net.createAndSendProto("m_planetarian_light_tos", {
		id = slot0,
		act_id = slot1 or 1077
	})
end

function m_planetarian_light_toc(slot0)
	ActivityMgr.updatePlaneTarianInfo(slot0)
	updatePlanetarianPanel()
end

function m_planetarian_chapter_reward_tos(slot0, slot1)
	Net.createAndSendProto("m_planetarian_chapter_reward_tos", {
		act_id = slot1 or 1077,
		chapter_id = slot0
	})
end

function m_planetarian_chapter_reward_toc(slot0)
	ActivityMgr.updatePlaneTarianChapter(slot0.chapter)
	updatePlanetarianPanel()
end

function m_constellation_mission_info_tos()
	Net.createAndSendProto("m_constellation_mission_info_tos")
end

function m_constellation_mission_info_toc(slot0)
	printLxfTable(slot0)
	ActivityMgr.initConstellationMission(slot0)

	if isOpenPanel() then
		updatePanel()
	end
end

function m_get_constellation_mission_reward_tos(slot0, slot1)
	Net.createAndSendProto("m_get_constellation_mission_reward_tos", {
		id = slot0,
		choice = slot1 or 0
	})
end

function m_get_constellation_mission_reward_toc(slot0)
	ActivityMgr.updateConstellationMission(slot0)

	if isOpenPanel() then
		updatePanel()
	end
end

function m_greek_jjc_info_tos(slot0)
	Net.createAndSendProto("m_greek_jjc_info_tos", {
		act_id = slot0 or ActivityConst.ACT_ID_GREECE_ARENA
	})
end

function m_greek_jjc_info_toc(slot0)
	ActivityMgr.greeceArenaNth = slot0.nth

	updateGreeceArenaPanel()
end

function m_act_helper_servant_detail_toc(slot0)
	printTable(slot0)
	ActivityMgr.updateGreeceArenaInfo(slot0)
end

function onOpenGreeceCopyInfoPanel(slot0)
	if CopyMgr.getNowProgressCopyID(CopyConst.TYPE_GREECE) == slot0 then
		AdventureModule.m_theater_map_enter_tos(slot0, 0, false)
	else
		AdventureModule.m_theater_map_last_diff_tos(slot0)
		openGreeceCopyInfoPanel(slot0)
	end
end

function m_act_archer_shoot_tos(slot0, slot1)
	Net.createAndSendProto("m_act_archer_shoot_tos", {
		act_id = slot0,
		target = slot1
	})
end

function m_act_archer_shoot_toc(slot0)
	if slot0.target ~= 1 then
		printXmm(789789)
		ActivityMgr.subGreeceTrainingHP(slot0.reduce)
	end

	ActivityMgr.updateArrow(slot0.arrow)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_GREECE_TRAINING_PANEL_UPDATE_HP, slot0.reduce, slot0.target)
end

function m_act_archer_info_tos(slot0, slot1)
	Net.createAndSendProto("m_act_archer_info_tos", {
		act_id = slot0,
		op_type = slot1
	})
end

function m_act_archer_info_toc(slot0)
	printTable(slot0)
	ActivityMgr.updateGreeceTrainingInfo(slot0)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_GREECE_TRAINING_PANEL_UPDATE, "toc")
end

function m_act_children_day_info_tos(slot0)
	Net.createAndSendProto("m_act_children_day_info_tos", {
		act_id = slot0 or 1090
	})
end

function m_act_children_day_info_toc(slot0)
	ActivityMgr.updateChildrenDayInfo(slot0)
	updatePanel()
end

function m_act_children_day_reward_tos(slot0, slot1)
	Net.createAndSendProto("m_act_children_day_reward_tos", {
		act_id = slot1 or 1090,
		times = slot0
	})
end

function m_act_children_day_reward_toc(slot0)
	openChildrensDayGetPanel(slot0.items)
end

function m_act_children_buff_tos(slot0)
	Net.createAndSendProto("m_act_children_buff_tos", {
		act_id = slot0 or 1090
	})
end

function m_act_children_buff_toc(slot0)
	if ActivityMgr.childrenDayInfo then
		ActivityMgr.childrenDayInfo.buff_times = slot0.times
	end

	updatePanel()
end

function m_act_favor_helper_tos(slot0, slot1)
	-- 2026-10-12 判空补丁（原为官方字节码）：LTY 助战开关 ActivityLTYFavorableView.onHelp
	-- 只传一个参数（slot0=nil, slot1=1/0），官方编码器把 nil 写进 act_id 的 WriteInt →
	-- "bad argument #1 to 'WriteInt' (number expected, got nil)"（用户日志 16:18:50/16:20:58 两次实证；
	-- onGUI 里 togHelp.IsOn 赋值也会经 AddChange 同步触发 onHelp，故刷新页即崩）。
	-- 修复：act_id 兜底 1053（乐之旅途），value 对调——原语义 (act_id, value)，调用方实参 (value)；
	-- 服务端 activity.js m_act_favor_helper_tos 已兼容单参（act_id=0/1 视为旧单参调用）。
	if slot1 == nil then
		slot1 = slot0
		slot0 = 1053
	end
	if slot0 == nil then
		slot0 = 1053
	end
	Net.createAndSendProto("m_act_favor_helper_tos", {
		act_id = slot0,
		value = slot1
	})
end

function m_act_favor_helper_toc(slot0)
	ActivityMgr.setHelpState(slot0.value == 1)

	-- 2026-10-12 补丁：ljd 反编译里 slot1 是寄存器别名丢失（原字节码应为 getAssistActID 的返回值，
	-- 即 ActivityAssistantVO 实例；MothersDay/CookPanel 的 .showTog/.switch/.selectId 用法可证）。
	-- 原样保留会在回包 act_id 命中助手列表时索引未定义局部变量；改为显式取 VO 再调 setSwitch。
	local vo = ActivityMgr.getAssistActID(slot0.act_id)

	if vo then
		vo:setSwitch(slot0.value)
	end

	Dispatcher.dispatch(ModuleCommand.ACTIVITY_ASSISTANT_UPDATE)
end

function m_act_helper_info_toc(slot0)
	printTable(slot0)
	ActivityMgr.updateHelpList(slot0)

	if slot0.act_id == ActivityConst.ACT_ID_GREECE_ARENA then
		ActivityMgr.updateGreeceArenaInfo(slot0)
	end
end

function m_act_helper_select_tos(slot0, slot1)
	Net.createAndSendProto("m_act_helper_select_tos", {
		act_id = slot0,
		select = slot1
	})
end

function m_act_helper_select_toc(slot0)
	ActivityMgr.updateSetHelpList(slot0.act_id, slot0.select, true)
	Dispatcher.dispatch(ModuleCommand.ACTIVITY_ASSISTANT_SELECT_UPDATE)
end

function m_daily_luck_draw_info_tos(slot0)
	Net.createAndSendProto("m_daily_luck_draw_info_tos", {
		act_id = slot0
	})
end

function m_daily_luck_draw_result_tos(slot0)
	Net.createAndSendProto("m_daily_luck_draw_result_tos", {
		act_id = slot0
	})
end

function m_daily_luck_draw_reward_tos(slot0)
	Net.createAndSendProto("m_daily_luck_draw_reward_tos", {
		act_id = slot0
	})
end

function m_daily_luck_draw_info_toc(slot0)
	ActivityMgr.initTwoAnnLuckyDraw(slot0)
	MainModule.m_act_time_tos(slot0.act_id)
	MainModule.m_red_point_hide_tos(194)

	if isOpenPanel() then
		updatePanel()
	end
end

function m_daily_luck_draw_result_toc(slot0)
	ActivityMgr.initTwoAnnLuckyDrawList(slot0)
	openAnniversaryAwardPanel(ActivityMgr.getLuckyDrawVO())
end

function m_daily_luck_draw_reward_toc(slot0)
	ActivityMgr.updateAwardInfo(slot0)
	updateAnniversaryAwardPanel(ActivityMgr.getLuckyDrawVO())
end

function setEndActTime(slot0)
	if slot0 == ActivityConst.ACT_TWO_ANN_ID then
		ActivityMgr.setEndTimeStamp(MainMgr.getActTimeInfo(slot0).endTime)
	end
end

function test_daily_luck_draw_info_tos(slot0)
	slot1 = {
		process = {
			{
				id = 1,
				val = 4
			},
			{
				id = 2,
				val = 10
			}
		},
		status = Util.random(0, 1),
		rewards = ZYData.todayAwards(ActivityMgr.getCurrentDay())
	}

	require("ZYTest.LuckyDrawTestData")
	printWarning("--------表已经配置完成，即将模拟发送---------")
	printTable(slot1)
	test_daily_luck_draw_info_toc(slot1)
end

function test_daily_luck_draw_info_toc(slot0)
	ActivityMgr.initTwoAnnLuckyDraw(slot0)

	if isOpenPanel() then
		updatePanel()
	end
end

function test_daily_luck_draw_result_tos(slot0)
	require("ZYTest.LuckyDrawTestData")

	slot1 = {
		act_id = 1647,
		result = ZYData.getTestData(ActivityMgr.getCurrentDay())
	}

	printWarning("-----抽奖名单已经配送---")
	printTable(slot1)
	test_daily_luck_draw_result_toc(slot1)
end

function test_daily_luck_draw_result_toc(slot0)
	ActivityMgr.initTwoAnnLuckyDrawList(slot0)

	slot1 = ActivityMgr.getLuckyDrawVO()

	printWarning("分发中奖数据")
	printTable(slot1)
	openAnniversaryAwardPanel(slot1)
end

function test_daily_luck_draw_reward_tos(slot0)
	require("ZYTest.LuckyDrawTestData")
	ZYData.setTestStatus(ActivityMgr.getCurrentDay())
	test_daily_luck_draw_reward_toc()
end

function test_daily_luck_draw_reward_toc()
	printWarning("奖品已经被领取")
	test_daily_luck_draw_result_tos()
end

function m_anniversary_data_tos()
	Net.createAndSendProto("m_anniversary_data_tos")
end

function m_anniversary_data_toc(slot0)
	ActivityMgr.setSelectedTagByProto(slot0.tags)
	ActivityMgr.updateFlagByProto(slot0.flag)
	ActivityMgr.setGameDays(slot0.day)
	ActivityMgr.setPlayerHandBooks(slot0.handbook)
end

function m_anniversary_tag_tos()
	Net.createAndSendProto("m_anniversary_tag_tos", {
		tags = ActivityMgr.getTagIDList()
	})
end

function m_anniversary_flag_tos()
	Net.createAndSendProto("m_anniversary_flag_tos", {
		flag = ActivityMgr.getPlayerFlag()
	})
end

function m_anniversary_flag_toc(slot0)
	Dispatcher.dispatch("ON_STORE_FLAG_SUCCESS")
end

function m_anniversary_log_click_tos(slot0, slot1)
	Net.createAndSendProto("m_anniversary_log_click_tos", {
		page = slot0,
		hold_time = slot1
	})
end

function m_anniversary_log_share_tos(slot0)
	Net.createAndSendProto("m_anniversary_log_share_tos", {
		type = slot0
	})
end

-- ===================== PS-STARDRULE-DEDUP（2026-10-19）=====================
-- 「动荡的时空」(1107) 规则文字画了两份，视觉重影：
--   ① 背景贴图 UI/Activity/Textures_Lang/PassCardBg 已把整段规则烤进图里
--      （与 StarDreamBg 逐像素相同；用这两个图的星梦活动占绝大多数，且都不配 objRule，
--      画面上只有贴图这一份 —— 那才是官方长相）；
--   ② CfgActivity[1107].objRule="objRule1" 让 onOpen 把 prefab 里的四段 Text 也打开，
--      两份纵向只差十几像素 → 重影（_diag/now_1107.png 与 ablate_clear3.png 对照实证）。
-- 处置：保留贴图那份（版式正常、所有星梦活动共用），隐藏 prefab 的四段 Text。
-- 不改配置、不改文案、不重打 .ab；只在本活动 objRule 被激活时生效，其余活动零影响。
local psDedupOrig = ActivityStarDreamPermitView.onOpen
function ActivityStarDreamPermitView.onOpen(self, ...)
	local ret = psDedupOrig(self, ...)
	if self.__psRuleDeduped ~= true then
		self.__psRuleDeduped = true
		local info = self.info
		if info ~= nil and info.objRule ~= nil then
			local n = 0
			for _, name in ipairs({ "lblRule455826", "lblRule455830", "lblRule", "lblRule455828" }) do
				local lbl = self[name]
				if lbl ~= nil then
					pcall(function () lbl.enabled = false end)
					pcall(function () lbl.gameObject:SetActive(false) end)
					n = n + 1
				end
			end
			print("PS-STARDRULE-DEDUP hid " .. tostring(n) .. " labels (texBg=" .. tostring(info.texBg) .. ")")
		end
	end
	return ret
end
