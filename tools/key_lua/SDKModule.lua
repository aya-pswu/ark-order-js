module("SDKModule", package.seeall)
require("Core.SDK.SDKConst")
require("Core.SDK.SDKCallback")
require("Core.SDK.SDKMgr")

function initModule()
	registerModuleSocket("SDKModule")
	Dispatcher.addMessageListener(ModuleCommand.ENTER_GAME, onEnterGame)
	Dispatcher.addMessageListener(ModuleCommand.ROLE_LV_CHANGE, roleLevelUp)
	Dispatcher.addMessageListener(ModuleCommand.ON_APPLICATION_PAUSE, onApplicationPause)

	if SDKMgr.isDncMedia() then
		openNative("1")
	end
end

function onEnterGame()
	if not SDKMgr.isDncMedia() and not SDKMgr.isBgGames() then
		return
	end

	slot0 = tostring(SystemConfig.ResVersion)

	if string.isEmpty(SystemConfig.GetExtCfg("lastResVersion")) then
		if SDKMgr.isDncMedia() then
			SDKModule.trackEvent(1)
		end

		if SDKMgr.isBgGames() then
			SDKModule.trackEvent(1001)
		end
	elseif slot0 ~= slot1 then
		-- Nothing
	end

	SystemConfig.SaveExtCfg("lastResVersion", slot0)
	SystemConfig.SaveExtCfg()
end

function m_adjust_log_tos(slot0)
	slot1 = Message.createProto("m_adjust_log_tos")
	slot1.id = slot0

	Net.sendProto(slot1)
end

function m_adjust_log_toc(slot0)
	printTable(slot0, "_______________________________________________________________.m_adjust_log_toc")
	trackEvent(slot0.id)
end

function onApplicationPause(slot0)
	if slot0 then
		printWarning(csformat("[SDK]enterBackgroundSDK"))
		C_SDKInterface:DoAction(SDKCallback.ACT_ENTER_BACKGROUND)

		if FightNavModule.isFightNavBtnPauseShow() then
			Dispatcher.dispatch(ModuleCommand.CLICK_FIGHT_PAUSE)
		end
	else
		printWarning(csformat("[SDK]enterForegroundSDK"))
		C_SDKInterface:DoAction(SDKCallback.ACT_ENTER_FOREGROUND)
	end
end

function loginSDK()
	if isAlreadyLogin() and SDKMgr.is360() then
		GameSendLose.SendLose(Main.LOSE_LOGIN_SDK)
		SDKCallback.onLogin(SDKCallback.ACT_LOGIN, {})

		return
	end

	if SDKMgr.isSdkState(SDKMgr.LOGOUT_SW_ING) then
		GameSendLose.SendLose(Main.LOSE_LOGIN_SDK)
		SDKCallback.onLogin(SDKCallback.ACT_LOGIN, {})

		return
	end

	if SDKMgr.isSelectLogin() then
		if SDKMgr.isDncMedia() then
			slot0 = getLastLoginPF()

			printWarning(csformat("[SDK]loginSDK auto last login:" .. slot0))

			if slot0 ~= "" then
				loginKoreanSDK(slot0)
			end
		end
	else
		printWarning(csformat("[SDK]loginSDK without select"))
		GameSendLose.SendLose(Main.LOSE_LOGIN_SDK)
		SDKMgr.setSdkState(SDKMgr.LOGIN_ING)
		SDKMgr.checkNoCallBackLogin()
		C_SDKInterface:DoAction(SDKCallback.ACT_LOGIN)
	end
end

function loginKoreanSDK(slot0)
	GameSendLose.SendLose(Main.LOSE_LOGIN_SDK)
	SDKMgr.setSdkState(SDKMgr.LOGIN_ING)
	SDKMgr.checkNoCallBackLogin()
	loginPfSDK(slot0)
end

function loginTencentSDK(slot0)
	printWarning(csformat("[SDK]loginTencentSDK"))
	GameSendLose.SendLose(Main.LOSE_LOGIN_SDK)
	SDKMgr.setSdkState(SDKMgr.LOGIN_ING)
	SDKMgr.checkNoCallBackLogin()
	C_SDKInterface:DoAction(SDKCallback.ACT_LOGIN, Util.tableToJsonStr({
		[SDKConst.LOGIN_TENCENT] = slot0
	}))
end

function loginPfSDK(slot0)
	printWarning(csformat("[SDK]loginPfSDK = " .. tostring(slot0)))
	SDKMgr.setSdkState(SDKMgr.LOGIN_ING)
	SDKMgr.checkNoCallBackLogin()
	C_SDKInterface:DoAction(SDKCallback.ACT_LOGIN, Util.tableToJsonStr({
		[SDKConst.PF_TYPE] = slot0
	}))
end

function reLoginSDK()
	printWarning("[SDK]reLoginSDK")
	C_SDKInterface:DoAction(SDKCallback.ACT_RE_LOGIN, Util.tableToJsonStr({
		IsReLoginLogout = SystemConfig.GetExtCfg("IsReLoginLogout")
	}))
end

function logoutSDK()
	printWarning("[SDK]logoutSDK")

	if TimerUtil.isInInterval("logoutSDK", 1.5) then
		printWarning("[SDK]logoutSDK.isInInterval")

		return
	end

	C_SDKInterface:DoAction(SDKCallback.ACT_LOGOUT, Util.tableToJsonStr({}))
end

function exitSDK()
	printWarning("[SDK]exitSDK")
	C_SDKInterface:DoAction(SDKCallback.ACT_EXIT, Util.tableToJsonStr({}))
end

function checkLoginSDK(slot0)
	printWarning(csformat("[SDK]checkLoginSDK"))
	C_SDKInterface:DoAction(SDKCallback.ACT_CHECK_LOGIN, Util.tableToJsonStr({
		[SDKConst.PF_TYPE] = slot0
	}))
end

function queryPayOrder()
	printWarning(csformat("[SDK]queryPayOrder"))
	C_SDKInterface:DoAction(SDKCallback.ACT_QUERY_PAY_ORDER, Util.tableToJsonStr({}))
end

function authLoginSDK(slot0)
	printWarning(csformat("[SDK]authLoginSDK"))
	SDKMgr.setSdkState(SDKMgr.LOGIN_ING)
	SDKMgr.checkNoCallBackLogin()
	C_SDKInterface:DoAction(SDKCallback.ACT_AUTH_LOGIN, Util.tableToJsonStr({
		[SDKConst.PF_TYPE] = slot0
	}))
end

function cancelAuthLogin(slot0)
	printWarning(csformat("[SDK]cancelAuthLogin"))
	C_SDKInterface:DoAction(SDKCallback.ACT_REMOVE_AUTH_LOGIN, Util.tableToJsonStr({
		[SDKConst.PF_TYPE] = slot0
	}))
end

slot0 = {
	SDKConst.ROLE_ID,
	SDKConst.ROLE_NAME,
	SDKConst.ROLE_CREATE_TIME,
	SDKConst.SERVER_ID,
	SDKConst.SERVER_NAME,
	SDKConst.UID,
	SDKConst.USER_NAME,
	SDKConst.AGENT_ID,
	SDKConst.AGENT_NAME,
	SDKConst.PF_ID,
	SDKConst.PF_NAME,
	SDKConst.ROLE_LEVEL,
	SDKConst.VIP_LEVEL,
	SDKConst.SERVER_TIME
}

function createRoleSDK()
	GameSendLose.SendLose(Main.LOSE_CREATE_ROLE)

	slot0 = SDKConst.getJsonStr(uv0)

	printGxh(csformat("[SDK]createRoleSDK：{0}", slot0))
	C_SDKInterface:DoAction(SDKCallback.ACT_CREATEROLE, slot0)
end

function enterGameSDK()
	GameSendLose.SendLose(Main.LOSE_ENTER_GAME)

	slot0 = SDKConst.getJsonStr(uv0)

	printGxh(csformat("[SDK]enterGameSDK：{0}", slot0))
	C_SDKInterface:DoAction(SDKCallback.ACT_ENTERGAME, slot0)
end

function roleLevelUp()
	slot0 = SDKConst.getJsonStr(uv0)

	printGxh(csformat("[SDK]roleLevelUp：{0}", slot0))
	C_SDKInterface:DoAction(SDKCallback.ACT_ROLE_LV_UP, slot0)
end

function stopDataUpdate()
	C_SDKInterface:DoAction(SDKCallback.ACT_STOP_DATA_UPDATE, Util.tableToJsonStr({}))
end

function restartGame()
	C_SDKInterface:DoAction(SDKCallback.ACT_RE_START, SDKConst.getJsonStr({}))
end

function paySDK()
	if not SDKMgr.isThirdPlatform() then
		Tips.addTips("尚未接入支付功能~")

		return
	end

	if SystemConfigLua.isIOS() and SDKMgr.isInPayState() then
		return
	end

	SDKMgr.setPayState(true)

	slot1 = SDKConst.getJsonStr({
		SDKConst.ROLE_ID,
		SDKConst.ROLE_NAME,
		SDKConst.SERVER_ID,
		SDKConst.SERVER_NAME,
		SDKConst.UID,
		SDKConst.USER_NAME,
		SDKConst.PAY_TOTAL_FEE,
		SDKConst.PAY_GAME_MONEY,
		SDKConst.PAY_OUT_TRADE_NO,
		SDKConst.PAY_SUBJECT,
		SDKConst.PAY_PRODUCT_ID,
		SDKConst.PAY_PRODUCT_NAME,
		SDKConst.PAY_BODY,
		SDKConst.PAY_EXTENSION_INFO,
		SDKConst.PAY_NOTIFY_URL,
		SDKConst.PAY_ORDER_SIGN,
		SDKConst.PAY_EXTENSION
	})

	print(csformat("[SDK]paySDK：{0}", slot1))
	C_SDKInterface:DoAction(SDKCallback.ACT_PAY, slot1)
end

function consumeSDK(slot0)
	slot2 = Util.tableToJsonStr({
		[SDKConst.PURCHASE_TOKEN] = slot0
	})

	print(csformat("[SDK]consumeSDK：{0}", slot2))
	C_SDKInterface:DoAction(SDKCallback.ACT_CONSUME, slot2)
end

function shareSDK(slot0, slot1, slot2, slot3)
	if SettingModule.checkCantShareAndAlert() then
		return
	end

	slot5 = Util.tableToJsonStr({
		[SDKConst.SHARE_TYPE] = slot0,
		[SDKConst.SHARE_TITLE] = slot1,
		[SDKConst.SHARE_STR] = slot2,
		[SDKConst.SHARE_PATH] = slot3 or SDKConst.DEFAULT_SHARE_PATH
	})

	print(csformat("[SDK]shareSDK：{0}", slot5))
	C_SDKInterface:DoAction(SDKCallback.ACT_SHARE, slot5)
end

function rateSDK(slot0)
	json = Util.tableToJsonStr({
		[SDKConst.RATE_URL] = slot0
	})

	print(csformat("[SDK]shareSDK：{0}", json))
	C_SDKInterface:DoAction(SDKCallback.ACT_RATE, json)
end

function openNative(slot0)
	json = Util.tableToJsonStr({
		[SDKConst.TYPE] = tostring(slot0 or "0")
	})

	print(csformat("[SDK]openNative：{0}", json))
	C_SDKInterface:DoAction(SDKCallback.ACT_OPEN_NATIVE, json)
end

slot1 = nil

function openKrCustom()
	if uv0 == nil then
		slot6 = ""
		slot7 = UnityEngine.WWW.EscapeURL

		function slot8(slot0)
			return string.gsub(uv0(slot0), "%%", "%%%%")
		end

		slot7 = nil
		uv0 = string.csformat("http://helpdesk.qroad.net/?n=arkorder_kr&user_app_id={0}&user_nickname={1}&device_info={2}&game_ver={3}&os_ver={4}&platform={5}", GlobalData.MyRoleID, slot8(GlobalData.roleName), slot8(SystemConfig.mMachine), slot8(string.csformat("{0}.{1}", SystemConfig.AppVersion, SystemConfig.ResVersion)), slot8(SystemConfig.ssVersion), SystemConfigLua.isIOS() and "11" or string.find(SystemConfigLua.getPackageName(), "google") ~= nil and "12" or "13")

		printError(uv0)
	end

	if uv0 then
		Application.OpenURL(uv0)
	end
end

function popKrCustom()
	Alert.show(Alert.AlertVO.new({
		showLeftBtn = false,
		rightHandleAndClose = true,
		msg = [[
게임 관련 문의는 
<color=#e68306ff>ark_cshelp@tplanet.co.kr</color>
을 통해 문의 부탁드립니다.

※필수 기재 사항
1. 이용 마켓
2. 회원 UID
3. 닉네임]],
		lineSpacing = 1,
		width = 580
	}))
end

function openAgreement()
	json = Util.tableToJsonStr({})

	print(csformat("[SDK]openAgreement：{0}", json))
	C_SDKInterface:DoAction(SDKCallback.ACT_OPEN_AGREEMENT, json)
end

function trackEvent(slot0)
	slot3 = nil

	if 10000 < slot0 then
		slot3 = ShopConfig.getConfigRechargeVO(toint(slot0 % slot2 / slot2)) and slot5.rmbFen / 100 or nil
	end

	slot4 = nil

	if SDKMgr.isDncMedia() then
		slot4 = SDKConst.EVENT_KOREAN_DIC

		if SDKMgr.isDncMedia18R() then
			for slot8, slot9 in pairs(slot4) do
				slot9.code = slot9.cone_one
			end
		end
	elseif SDKMgr.isBgGames() then
		slot4 = SDKConst.EVENT_JAPAN_DIC
	elseif SDKMgr.isKomoe() then
		slot4 = SDKConst.EVENT_KOMOE_DIC
	end

	slot5 = nil

	if slot4 and slot4[slot0] and string.isNotEmpty(slot6.code) then
		if slot3 then
			-- Nothing
		end
	else
		printWarning("找不到记录的事件ID:" .. slot0)
	end

	if {
		[SDKConst.TYPE] = slot6.type,
		[SDKConst.CODE] = slot6.code,
		[SDKConst.PARAM] = slot6.param,
		[SDKConst.MEMBER_ID] = SDKMgr.getMemberID(),
		[SDKConst.ROLE_NAME] = GlobalData.roleName,
		[SDKConst.TYPE] = "2",
		[SDKConst.PARAM] = tostring(slot3)
	} then
		json = Util.tableToJsonStr(slot5)

		print(csformat("[SDK]trackEvent：{0}", json))
		C_SDKInterface:DoAction(SDKCallback.ACT_EVENT, json)
	end
end

function isHasPermission(slot0)
	return isHasAllPermission({
		slot0
	})
end

function isHasAllPermission(slot0)
	slot2 = Util.tableToJsonStr({
		[SDKConst.PERMISSION_NAME_LIST] = slot0
	})

	print(csformat("[SDK]isHasAllPermission：{0}", slot2))

	return C_SDKInterface:GetBool(SDKCallback.GET_HAS_PERMISSION, slot2)
end

function shouldShowPermission(slot0)
	slot2 = Util.tableToJsonStr({
		[SDKConst.PERMISSION_NAME_LIST] = slot0
	})

	print(csformat("[SDK]shouldShowPermission：{0}", slot2))

	return C_SDKInterface:GetBool(SDKCallback.GET_SHOW_PERMISSION, slot2)
end

function getNotHasPermission(slot0)
	slot2 = Util.tableToJsonStr({
		[SDKConst.PERMISSION_NAME_LIST] = slot0
	})

	print(csformat("[SDK]getNotHasPermission：{0}", slot2))

	return C_SDKInterface:GetString(SDKCallback.GET_NOT_HAS_PERMISSION, slot2)
end

function gotoRequestPermissions(slot0, slot1)
	slot3 = Util.tableToJsonStr({
		[SDKConst.PERMISSION_REQUEST_ID] = slot0,
		[SDKConst.PERMISSION_NAME_LIST] = slot1
	})

	print(csformat("[SDK]gotoRequestPermissions：{0}", slot3))

	return C_SDKInterface:DoAction(SDKCallback.ACT_REQUEST_PERMISSION, slot3)
end

function getCanNotification()
	slot1 = Util.tableToJsonStr({})

	print(csformat("[SDK]getCanNotification：{0}", slot1))

	return C_SDKInterface:GetBool(SDKCallback.GET_CAN_NOTIFICATION, slot1)
end

function gotoModNotification()
	slot1 = Util.tableToJsonStr({})

	print(csformat("[SDK]gotoModNotification：{0}", slot1))

	return C_SDKInterface:DoAction(SDKCallback.ACT_MOD_NOTIFICATION, slot1)
end

function getDisplayCutoutInfo()
	slot1 = Util.tableToJsonStr({})

	print(csformat("[SDK]gotoModNotification：{0}", slot1))

	return C_SDKInterface:GetString(SDKCallback.GET_DISPLAY_CUTOUT_INFO, slot1)
end

function getAccountIsBind(slot0)
	slot2 = Util.tableToJsonStr({
		[SDKConst.PF_TYPE] = slot0
	})

	print(csformat("[SDK]getAccountIsBind：{0}", slot2))

	return C_SDKInterface:GetBool(SDKCallback.GET_IS_BIND, slot2)
end

function isBindGoogle()
	return getAccountIsBind(SDKConst.PF_GOOGLE)
end

function isBindFacebook()
	return getAccountIsBind(SDKConst.PF_FACEBOOK)
end

function bindAccount(slot0)
	json = Util.tableToJsonStr({
		[SDKConst.PF_TYPE] = slot0
	})

	print(csformat("[SDK]bindAccount：{0}", json))
	C_SDKInterface:DoAction(SDKCallback.ACT_BIND, json)
end

function unbindAccount(slot0)
	json = Util.tableToJsonStr({
		[SDKConst.PF_TYPE] = slot0
	})

	print(csformat("[SDK]bindAccount：{0}", json))
	C_SDKInterface:DoAction(SDKCallback.ACT_UNBIND, json)
end

function deleteAccount()
	json = Util.tableToJsonStr({})

	print(csformat("[SDK]bindAccount：{0}", json))
	C_SDKInterface:DoAction(SDKCallback.ACT_DELETE, json)
end

function getLastLoginPF()
	slot1 = Util.tableToJsonStr({})

	print(csformat("[SDK]getLastLoginPF：{0}", slot1))

	return C_SDKInterface:GetString(SDKCallback.GET_LAST_LOGIN_PF, slot1)
end

function getNightPushEnable()
	slot1 = Util.tableToJsonStr({})

	print(csformat("[SDK]getNightPushEnable{0}", slot1))

	return C_SDKInterface:GetBool(SDKCallback.GET_NIGHT_PUSH_ENABLE, slot1)
end

function isAlreadyLogin()
	slot1 = Util.tableToJsonStr({})

	print(csformat("[SDK]isAlreadyLogin{0}", slot1))

	return C_SDKInterface:GetBool(SDKCallback.GET_IS_LOGIN, slot1)
end

initModule()
