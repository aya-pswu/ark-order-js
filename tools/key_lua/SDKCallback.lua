module("SDKCallback", package.seeall)

ACT_LOGIN = "ACT_LOGIN"
ACT_LOGOUT = "ACT_LOGOUT"
ACT_SWITCH_USER = "ACT_SWITCH_USER"
ACT_EXIT = "ACT_EXIT"
ACT_RE_LOGIN = "ACT_RE_LOGIN"
ACT_RE_START = "ACT_RE_START"
ACT_AUTH_LOGIN = "ACT_AUTH_LOGIN"
ACT_REMOVE_AUTH_LOGIN = "ACT_REMOVE_AUTH_LOGIN"
ACT_CHECK_LOGIN = "ACT_CHECK_LOGIN"
ACT_QUERY_PAY_ORDER = "ACT_QUERY_PAY_ORDER"
ACT_LOG = "ACT_LOG"
ACT_BIND = "ACT_BIND"
ACT_UNBIND = "ACT_UNBIND"
ACT_DELETE = "ACT_DELETE"
ACT_OPEN_AGREEMENT = "ACT_OPEN_AGREEMENT"
ACT_OPEN_NATIVE = "ACT_OPEN_NATIVE"
ACT_PAY = "ACT_PAY"
ACT_CONSUME = "ACT_CONSUME"
ACT_SHARE = "ACT_SHARE"
ACT_RATE = "ACT_RATE"
ACT_EVENT = "ACT_EVENT"
ACT_CREATEROLE = "ACT_CREATEROLE"
ACT_ENTERGAME = "ACT_ENTERGAME"
ACT_ROLE_LV_UP = "ACT_ROLE_LV_UP"
ACT_STOP_DATA_UPDATE = "ACT_STOP_DATA_UPDATE"
ACT_ENTER_BACKGROUND = "ACT_ENTER_BACKGROUND"
ACT_ENTER_FOREGROUND = "ACT_ENTER_FOREGROUND"
ON_BACK_PRESS = "ON_BACK_PRESS"
ON_ENTER_BACKGROUND = "ON_ENTER_BACKGROUND"
ON_ENTER_FOREGROUND = "ON_ENTER_FOREGROUND"
GET_IS_3TH_PF = "GET_IS_3TH_PF"
GET_IS_TENCENT = "GET_IS_TENCENT"
GET_IS_LOGIN = "GET_IS_LOGIN"
GET_USER_ID = "GET_USER_ID"
GET_USER_NAME = "GET_USER_NAME"
GET_SESSION_ID = "GET_SESSION_ID"
GET_TOKEN_SECRET = "GET_TOKEN_SECRET"
GET_CLIENT_ID = "GET_CLIENT_ID"
GET_MEMBER_ID = "GET_MEMBER_ID"
GET_CHANNEL_ID = "GET_CHANNEL_ID"
GET_PUSH_DEVICE_TOKEN = "GET_PUSH_DEVICE_TOKEN"
GET_IS_INSTALL_WEIXIN = "GET_IS_INSTALL_WEIXIN"
GET_IS_INSTALL_WEIBO = "GET_IS_INSTALL_WEIBO"
GET_HAS_PERMISSION = "GET_HAS_PERMISSION"
GET_SHOW_PERMISSION = "GET_SHOW_PERMISSION"
GET_NOT_HAS_PERMISSION = "GET_NOT_HAS_PERMISSION"
ACT_REQUEST_PERMISSION = "ACT_REQUEST_PERMISSION"
GET_CAN_NOTIFICATION = "GET_CAN_NOTIFICATION"
ACT_MOD_NOTIFICATION = "ACT_MOD_NOTIFICATION"
GET_PRODUCE_PHONE = "GET_PRODUCE_PHONE"
GET_DISPLAY_CUTOUT_INFO = "GET_DISPLAY_CUTOUT_INFO"
GET_IS_BIND = "GET_IS_BIND"
GET_LAST_LOGIN_PF = "GET_LAST_LOGIN_PF"
GET_NIGHT_PUSH_ENABLE = "GET_NIGHT_PUSH_ENABLE"
CODE_FAIL = 0
CODE_SUCC = 1
CODE_CANL = 2
slot0 = nil

function initCallBack()
	if uv0 then
		return
	end

	uv0 = {
		[ACT_LOGIN] = onLogin,
		[ACT_LOGOUT] = onLogout,
		[ACT_AUTH_LOGIN] = onAuthLogin,
		[ACT_SWITCH_USER] = onSwitchUser,
		[ACT_PAY] = onPay,
		[ACT_EXIT] = onExit,
		[ON_BACK_PRESS] = onBackPressByAndroid,
		[ACT_SHARE] = onShare,
		[ACT_RATE] = onRate,
		[ACT_BIND] = onBind,
		[ACT_UNBIND] = onUnBind,
		[ACT_DELETE] = onDelete,
		[ACT_OPEN_AGREEMENT] = onOpenAgreement,
		[ACT_MOD_NOTIFICATION] = onModNotification,
		[ACT_REQUEST_PERMISSION] = onRequestPermission,
		[ON_ENTER_BACKGROUND] = onEnterBackground,
		[ON_ENTER_FOREGROUND] = onEnterForeground
	}
end

function onSdkCallback(slot0)
	printWarning(csformat("[SDK]收到SDK回调：{0}", slot0))
	initCallBack()

	if Util.jsonStrToTable(slot0) == nil then
		printWarning("收到SDK的Json解释出错：\n" .. tostring(slot0))

		return
	end

	slot2 = slot1.type
	slot3 = toint(slot1.code)
	slot4 = slot1.data

	if SystemConfigLua.isAndroid() then
		if Util.jsonStrToTable(slot4) == nil then
			printWarning("收到SDK的Json.data解释出错：\n" .. tostring(slot4))
		end

		slot4 = slot5 or slot4
	end

	if uv0[slot2] then
		slot5(slot3, slot4)
	end
end

slot1 = nil

function onLogin(slot0, slot1)
	if slot0 == CODE_SUCC then
		slot2 = LoginMgr.getLoginAccount()

		if uv0 == nil or uv0 and uv0 ~= slot2 then
			SDKMgr.setSdkState(SDKMgr.LOGIN_SUCC)
			GameSendLose.SendLose(Main.LOSE_LOGIN_SDK_SUCCESS)

			if SDKMgr.isThirdPlatform() then
				LoginModule.queryLoginServer()
			end

			if SDKMgr.isDncMedia() then
				if SDKModule.getLastLoginPF() == SDKConst.PF_GUEST then
					SDKModule.trackEvent(37)
				elseif slot3 == SDKConst.PF_GOOGLE then
					SDKModule.trackEvent(36)
				elseif slot3 == SDKConst.PF_FACEBOOK then
					SDKModule.trackEvent(35)
				end
			end

			uv0 = slot2
			SystemConfig.Account = LoginMgr.getLoginAccount()

			SystemConfig.SaveExtCfg()
		end
	else
		SDKMgr.setSdkState(SDKMgr.LOGIN_FAIL)
		GameSendLose.SendLose(Main.LOSE_LOGIN_SDK_FAIL)

		if SDKMgr.isDncMedia() then
			if slot0 == CODE_FAIL then
				Tips.addTips("SDK登录失败:" .. (slot1.error or "unknown"))
			else
				Tips.addTips("SDK登录取消")
			end
		end
	end

	SDKMgr.clearCheckLogin()
	Dispatcher.dispatch(ModuleCommand.ON_RECEIVE_UID)
end

function onAuthLogin(slot0, slot1)
	if slot0 == CODE_SUCC then
		SDKMgr.setSdkState(SDKMgr.LOGIN_SUCC)
		GameSendLose.SendLose(Main.LOSE_LOGIN_SDK_SUCCESS)
		printWarning("___________________________________________________________[onAuthLogin]" .. ("" .. "\n.AccountMgr.authAct. --->" .. tostring(AccountMgr.authAct) .. "\n.AccountConst.AUTH_ACT_BIND. --->" .. tostring(AccountConst.AUTH_ACT_BIND) .. "\n.AccountConst.AUTH_ACT_CHECK. --->" .. tostring(AccountConst.AUTH_ACT_CHECK) .. "\n.traceback.  --->\n" .. tostring(debug.traceback())))

		if AccountMgr.authAct == AccountConst.AUTH_ACT_BIND then
			AccountModule.setTwitterBindAccount()
		elseif AccountMgr.authAct == AccountConst.AUTH_ACT_CHECK then
			AccountModule.checkTwitterBindAccount()
		end
	else
		Tips.addTips("Twitter授权失败")
	end
end

function onLogout(slot0, slot1)
	if slot0 == CODE_SUCC then
		SDKMgr.setSdkState(SDKMgr.LOGOUT_SUCC)
		Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
	else
		SDKMgr.setSdkState(SDKMgr.LOGOUT_FAIL)
		Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
	end
end

function onSwitchUser(slot0, slot1)
	SDKMgr.setSdkState(SDKMgr.LOGOUT_SUCC)
	Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
	SDKMgr.setSdkState(SDKMgr.LOGOUT_SW_ING)
end

function onPay(slot0, slot1)
	SDKMgr.setPayState(false)

	if slot0 == CODE_SUCC then
		if SDKMgr.isUC() then
			Tips.addTips("正在创建订单，如已付款请耐心等候发货")
		elseif ShopModule.isNeedSendPayOrder() then
			Tips.addTips("购买成功！")
			ShopModule.m_create_pay_order_tos(slot1.productId, slot1.receipt, slot1.signature, slot1.token, true)
		else
			Tips.addTips("购买成功！")
		end

		Dispatcher.dispatch(ModuleCommand.ON_PAY_SUCCESS)
	elseif slot0 == CODE_FAIL then
		if SDKMgr.isLaoYueGou() or SDKMgr.isTxCat() then
			if string.isEmpty(slot1) then
				Tips.addTips("支付进行中，如已支付请耐心等待")
			else
				Tips.addTips(slot1)
			end
		elseif SDKMgr.isUseSelfPaySDK() then
			Tips.addTips("支付失败!错误：" .. (slot1.error or "unknown"))
		else
			Tips.addTips("支付失败！")
		end

		Dispatcher.dispatch(ModuleCommand.ON_PAY_FAIL)
	else
		Dispatcher.dispatch(ModuleCommand.ON_PAY_CANCEL)
	end
end

function onExit(slot0, slot1)
	if slot0 == CODE_SUCC then
		Application.Quit()
	else
		Alert.show(Alert.AlertVO.new({
			msg = "确定退出游戏？",
			rightHandle = function ()
				Application.Quit()
			end
		}))
	end
end

function onShare(slot0, slot1)
	if slot0 == CODE_SUCC then
		-- Nothing
	elseif slot0 == CODE_FAIL then
		-- Nothing
	end
end

function onRate(slot0, slot1)
	if slot0 == CODE_SUCC then
		GuideModule.m_role_rating_guide_tos()
	elseif slot0 == CODE_FAIL then
		-- Nothing
	end
end

function onBind(slot0, slot1)
	if slot0 == CODE_SUCC then
		Tips.addTips("账号绑定成功！")
	elseif slot0 == CODE_FAIL then
		Tips.addTips("账号绑定失败！")
	else
		Tips.addTips("账号取消绑定")
	end

	Dispatcher.dispatch(ModuleCommand.UPDATE_SETTING_PANEL)
end

function onUnBind(slot0, slot1)
	if slot0 == CODE_SUCC then
		Tips.addTips("账号解绑成功！")
	elseif slot0 == CODE_FAIL then
		Tips.addTips("账号解绑失败！")
	else
		Tips.addTips("账号取消解绑")
	end

	Dispatcher.dispatch(ModuleCommand.UPDATE_SETTING_PANEL)
end

function onDelete(slot0, slot1)
	if slot0 == CODE_SUCC then
		Tips.addTips("账号注销成功！")
		Alert.show(Alert.AlertVO.new({
			showLeftBtn = false,
			showCloseBtn = false,
			msg = "账号注销成功，请重新登录游戏",
			isMaskClick = false,
			rightHandle = function ()
				Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
			end
		}))
	elseif slot0 == CODE_FAIL then
		Tips.addTips("账号注销失败！")
	else
		Tips.addTips("账号取消注销")
	end
end

function onOpenAgreement()
	if SDKMgr.isDncMedia() then
		SDKModule.trackEvent(2)
	end

	SystemConfig.SaveExtCfg(LoginConst.KEY_ACCEPT_PROTO, "1")
	SystemConfig.SaveExtCfg()
	SettingModule.m_setting_put_one(24, SDKModule.getNightPushEnable() and 0 or 1)
	LoginModule.secondLogin()
end

function onModNotification(slot0, slot1)
	Dispatcher.dispatchOne(SDKCallback.ACT_MOD_NOTIFICATION, slot0 == CODE_SUCC)
end

function onRequestPermission(slot0, slot1)
	if Util.jsonStrToTable(slot1) == nil then
		printWarning("收到SDK的Json解释出错：\n" .. tostring(slot1))

		return
	end

	Dispatcher.dispatchOne(slot2[SDKConst.PERMISSION_REQUEST_ID], slot2[SDKConst.PERMISSION_REQUEST_PASS] == "1")
end

function onEnterBackground(slot0, slot1)
	changeXiaoMiVolume(false)
end

function onEnterForeground(slot0, slot1)
	changeXiaoMiVolume(true)
end

function changeXiaoMiVolume(slot0)
	if SDKMgr.getProducePhone() == "sys_miui" then
		AudioManager.updateGlobalVolumeRate(slot0 and 1 or 0)
	end
end

function onBackPressByAndroid()
	if NoticeModule.isShowingWebView() and not NoticeModule.canGoBackUniWebView() then
		NoticeModule.closeUniWebView()
	end
end

function onBackPress()
	if GuideMgr.isGuiding() then
		return
	end

	if GuideModule.notFinish(52) then
		return
	end

	if C_ApkLoading:IsLoading() then
		return
	end

	if MarryMgr.servant then
		return
	end

	if TowerModule.isOpenMainPanel() and (TowerMgr.isMoving or TowerMgr.getIsAutoFight()) then
		return
	end

	if clickTip and clickTip:isActive() then
		ClickTip.hide()

		return
	end

	slot1 = WindowsManager.getTopPanel() and slot0.__cname or nil

	printXmm("$$$$$$$$$$$$$$$$$$$$" .. (slot1 or "nil"))

	if slot1 == "AlertPanel" then
		if slot0:isPopupBtnCloseShow() then
			slot0:close()
		else
			printXmm("不能关闭警告弹窗")
		end

		return
	end

	if ChatModule.isOpenPlayerInfoPanel() then
		ChatModule.closePlayerInfoPanel()

		return
	end

	if ChatModule.isOpenDetailPanel() then
		Dispatcher.dispatch(ModuleCommand.CLOSE_CHAT_PANEL)

		return
	end

	if BagModule.isOpenGetItemsPanel() then
		BagModule.closeGetItemsPanel()

		return
	end

	if FightNavModule.isOpenPausePanel() then
		FightNavModule.closePausePanel()

		return
	end

	if TheaterModule.isOpenNormalPanel() then
		TheaterModule.normalPanel:onClickBtnSkip()

		return
	end

	if NoticeModule.isShowingWebView() then
		NoticeModule.closeUniWebViewPanel()
		NoticeModule.disposeWebView()

		return
	end

	if SettingModule.isOpenMainPanel() then
		if SettingMgr.currHelperView == "SettingQuestionView" then
			SettingModule.changeHelpView("SettingQuestionListView")

			return
		elseif SettingMgr.currHelperView == "SettingQuestionListView" then
			SettingModule.changeHelpView("SettingHelpView")

			return
		end
	end

	if CopyModule.isOpenRewardPanel() then
		if CopyModule.rewardPanel.goDetail.gameObject.activeSelf then
			CopyModule.rewardPanel:onHideDetail()
		elseif CopyModule.rewardPanel.goClick1.gameObject.activeSelf then
			CopyModule.rewardPanel:onClick()
		elseif CopyModule.rewardPanel.goClick2.gameObject.activeSelf then
			CopyModule.rewardPanel:onOK()
		end

		return
	end

	if LoginModule.isOpenProtoPanel() then
		LoginModule.protoPanel:onClickBtnAccept()

		return
	end

	if OutCardModule.isOpenPanel() then
		OutCardModule.panel.togLock.IsOn = true

		OutCardModule.panel:onClickBtnSkip()
		printXmm("抽卡界面，直接下一步")

		return
	end

	if slot0 then
		if slot1 == "DormPanel" then
			if slot0.operateView:isActive() then
				slot0.operateView:quitFun()

				return
			end

			if slot0.planView:isActive() then
				slot0.planView:hideFunc()

				return
			end
		elseif slot1 == "ServantInfoPanel" then
			if not slot0.objHide.gameObject.activeSelf then
				slot0.cardView:onClick()

				return
			end
		elseif slot1 == "HandbookInfoPanel" then
			if not slot0.objOther.gameObject.activeSelf then
				slot0.cardView:onClick()

				return
			end
		elseif slot1 == "TowerMainPanel" then
			if slot0.rankView:isActive() then
				slot0.rankView:onClickMask()

				return
			end
		elseif slot1 == "AreaPromptPopupPanel" then
			slot0:onClickBtnCancel()

			return
		elseif slot1 == "LadderBanPanel" then
			printXmm("星梯匹配中，不处理")

			return
		elseif slot1 == "AccountBindMainPanel" then
			if not slot0.mainView:isActive() then
				slot0:switchView(slot0.mainView)

				return
			end
		elseif slot1 == "FamilyBossPanel" then
			if slot0.fightView:isActive() then
				slot0.fightView:fightEnd()
			else
				slot0:onClickBtnReturn()
			end

			return
		end

		if slot0.onClickBtnBack then
			slot0:onClickBtnBack()
		else
			WindowsManager.closeTop()
		end
	else
		if LoginModule.isOpenLoginBgPanel() then
			SDKModule.exitSDK()

			return
		end

		if not MainModule.functionPanel.objHide.gameObject.activeSelf then
			Dispatcher.dispatch(ModuleCommand.ModuleCommand.SHOW_MAIN_CARD)
		elseif FightNavModule.isFightNavShow() or FightMgr.isOnFight then
			if FightNavModule.isFightNavBtnPauseShow() then
				Dispatcher.dispatch(ModuleCommand.CLICK_FIGHT_PAUSE)
			else
				printXmm("进入战斗的过程中，不处理")
			end
		else
			printWarning("exitSDK")
			SDKModule.exitSDK()
		end
	end
end
