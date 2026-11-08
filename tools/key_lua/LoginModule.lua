module("LoginModule", package.seeall)
require("Modules.Login.LoginModuleAutoGen")
require("Modules.Login.LoginMgr")
require("Modules.Login.LoginConst")

function initModule()
	registerModuleSocket("LoginModule")
	addMessageListener(ModuleCommand.RE_LOGIN, pre_reLogin)
end

slot0 = nil
slot1 = false
slot2 = false
slot3 = true
slot4 = 0

function startLogin()
	GameSendLose.SendLose(Main.LOSE_SHOW_LOGIN)

	slot0 = {
		LoginBgPanel.resUrl,
		LoginBgPanel.getSprineResPath()
	}
	slot1 = 0
	slot2 = #slot0

	for slot6, slot7 in ipairs(slot0) do
		AssetLoader.LoadNormal(slot7, ResType.UI, function (slot0)
			uv0 = uv0 + 1

			if uv1 <= uv0 then
				secondLogin()
			end
		end, 10, function ()
			printError("[登录]登录资源缺失:" .. uv0 .. " 暂时忽略")

			uv1 = uv1 + 1

			if uv2 <= uv1 then
				secondLogin()
			end
		end)
	end

	if AccountMgr.isUseInherit() then
		SDKModule.checkLoginSDK(SDKConst.PF_TWITTER)
	end
end

function secondLogin()
	openLoginBgPanel()

	slot0 = SystemConfig.GetExtCfg(LoginConst.KEY_ACCEPT_PROTO) == "1"
	slot2 = true

	if SystemConfigLua.isSimple() then
		slot2 = SystemConfig.GetExtCfg(LoginConst.KEY_ACCEPT_PROTO_NEW) == "1"
	end

	if (slot0 or SystemConfigLua.isUseProtoRule()) and slot2 then
		if SDKMgr.isNeedLoginPanel() then
			openLoginPanel()
		else
			queryServerState()
		end
	elseif SDKMgr.isDncMedia() then
		SDKModule.openAgreement()
	elseif SystemConfigLua.isSimple() then
		openProtoPanel()
	end
end

function pre_reLogin()
	C_ApkLoading:SetBgPath(PreloadModule.getLoadingPath())
	C_ApkLoading:ShowProgress(0.2, "返回登录")
	reLogin()
end

function reLogin()
	printWarning("【重新登录】.reLogin()")
	LoopManager.clearTimeout(uv0)

	isRelogin = true
	Net.hasLogin = false

	ApkLoadingExt.clear()
	C_ApkLoading:ShowProgress(0.3, "返回登录")
	ErrorModule.clearImportProto()
	Net.close(true)
	LoopManager.pause()
	Dispatcher.clearEvent()
	ModuleFactory.disposeModule()
	SceneModule.onClearScene()
	GameScene.dispose()
	CameraModule.dispose()
	AudioManager.dispose()
	LayerManager.dispose()
	VideoManager.dispose()
	SDKModule.reLoginSDK()
	C_LuaEngine:Reload()
end

function getLoginLocal(slot0, slot1, slot2)
	return csformat("http://{0}:{1}/?action=account_node_debug&accountName={2}&pf={3}&agentId={4}", slot0, slot1, slot2, SystemConfigLua.getPfNum(), SystemConfigLua.getAgentID())
end

function getLoginOfficial(slot0)
	return UrlUtil.FormatGetUrl(SystemConfigLua.getRouter() .. "/client_api/GetAccountNode.php", csformat("agentName={0}&pfName={1}&accountName={2}&channelID={3}&oid={4}&deviceID={5}&apkVersion={6}&resVersion={7}", SystemConfigLua.getAgentName(), SystemConfigLua.getPfName(), slot0, SDKMgr.getChannelID(), SystemConfig.GetSysCfg("OID"), SystemConfigLua.getDeviceID(), SystemConfig.AppVersion, SystemConfig.ResVersion))
end

function getServerStateUrl()
	return UrlUtil.FormatGetUrl(SystemConfigLua.getRouter() .. "/client_api/GetServerNotice.php", csformat("agentName={0}&pfName={1}&deviceID={2}&channelID={3}&oid={4}", SystemConfigLua.getAgentName(), SystemConfigLua.getPfName(), SystemConfigLua.getDeviceID(), SDKMgr.getChannelID(), SystemConfig.GetSysCfg("OID")))
end

function queryServerState()
	WebHttp.AsynGet(getServerStateUrl(), function (slot0)
		slot1 = nil

		if toint(Util.jsonStrToTable(slot0:ToJson()).ret) == 1 then
			if AccountMgr.isUseInherit() then
				AccountModule.loginInherit()
			else
				SDKModule.loginSDK()
			end
		elseif slot3 == 2 or slot3 == 3 then
			GameSendLose.SendLose(Main.LOSE_SERVER_CLOSE)

			queryLoginServerCount = 0
			LoginMgr.canReQueryLoginServer = true
			slot1 = slot2.data.content

			SDKModule.stopDataUpdate()
		else
			slot1 = "服务器维护中..."

			SDKModule.stopDataUpdate()
		end

		if slot1 then
			Alert.show({
				showLeftBtn = true,
				height = 410,
				showCloseBtn = false,
				msg = "",
				leftLabel = "确定",
				rightHandleAndClose = false,
				rightLabel = "查看公告",
				width = 705,
				msgColor = "898B95",
				msgRoll = slot1,
				leftHandle = function ()
					Application.Quit()
				end,
				rightHandle = function ()
					NoticeModule.gotoOpenMainPanel()
				end
			})
		end
	end, function (slot0)
		Alert.show({
			msg = "查询服务器状态失败,请重试",
			rightLabel = "确定",
			showCloseBtn = false,
			rightHandle = function ()
				if SDKMgr.isThirdPlatform() then
					queryServerState()
				end
			end
		})
	end)
end

slot5 = {
	msg = "后台出错",
	ret = "0",
	data = {
		port = "443",
		bgp_host = "",
		bgp_port = "",
		agent_name = "",
		time = "",
		ip = "192.168.8.185",
		content = "",
		agent_id = "",
		title = "",
		platform_id = "",
		sign = "",
		platform_name = "",
		server_id = "1",
		is_test = "0"
	}
}
slot6 = 0
slot7 = 0
slot8 = nil

function queryLoginServer(slot0)
	GameSendLose.SendLose(Main.LOSE_QUERRY_SERVER)
	LoginMgr.resetIPIndex()
	LoopManager.clearTimeout(uv0)

	slot1 = nil
	uv1.ret = "0"
	Net.isReconnect = slot0 or false

	BuglyAgent.SetUserId(LoginMgr.getLoginAccount())

	slot1 = SDKMgr.isUseLoginLocal() and getLoginLocal(LoginMgr.query_ip, LoginMgr.query_port, slot2) or getLoginOfficial(slot2)

	printWarning("[登录]查询登录服务器：" .. slot1)

	uv2 = slot1

	WebHttp.AsynGet(slot1, queryReturn, queryError)
	updateLoginBgPanel("connect")
end

function queryReturn(slot0)
	GameSendLose.SendHttpLog(uv0, slot0:ToJson())
	xpcall(function ()
		Util.fillTableByJson(uv0, uv1)
	end, function ()
		uv0.msg = LuaUtil.GetJsonString(uv1, "msg")
	end)
	printTable(uv1, "[登录]登录服务器返回：")

	if uv1.ret == "1" then
		GameSendLose.SendLose(Main.LOSE_SERVER_SUCCESS)

		uv2 = 0

		Net.recoverReconnect()

		if uv1.data.is_test == "1" then
			LoginMgr.isTestServer = true

			DebugModule.showDebugIcon()
		end

		LoginMgr.ip = slot1.ip
		LoginMgr.port = slot1.port

		LoginMgr.saveBGP(slot1.bgp_host, slot1.bgp_port)

		LoginMgr.sign = slot1.sign
		LoginMgr.time = slot1.time
		LoginMgr.server_id = slot1.server_id
		LoginMgr.in_verify_server = slot1.incheck == 1
		LoginMgr.agent_id = string.isNotEmpty(slot1.agent_id) and slot1.agent_id or SystemConfigLua.getAgentID()
		LoginMgr.platform_id = string.isNotEmpty(slot1.platform_id) and slot1.platform_id or SystemConfigLua.getPfNum()

		if GlobalDataManager.IsUnityEditor() then
			Net.isReconnect = true

			Dispatcher.addMessageListener(ModuleCommand.CONNECT_SUCCESS, onConnectSuccess)
			LoginMgr.changeIP()
			Net.reStart()

			Net.isReconnect = false

			return
		end

		startConnect()
	elseif uv1.ret == "2" or uv1.ret == "3" then
		GameSendLose.SendLose(Main.LOSE_SERVER_CLOSE)

		uv2 = 0
		LoginMgr.canReQueryLoginServer = true

		Alert.show({
			showLeftBtn = true,
			height = 410,
			showCloseBtn = false,
			msg = "",
			leftLabel = "确定",
			rightHandleAndClose = false,
			rightLabel = "查看公告",
			width = 705,
			msgColor = "898B95",
			msgRoll = uv1.data.content,
			leftHandle = function ()
				Application.Quit()
			end,
			rightHandle = function ()
				NoticeModule.gotoOpenMainPanel()
			end
		})
		SDKModule.stopDataUpdate()
	else
		queryError(uv1.msg)
		SDKModule.stopDataUpdate()
	end
end

function queryError(slot0)
	if slot0 then
		GameSendLose.SendLose(Main.LOSE_SERVER_ERROR)
	else
		GameSendLose.SendHttpLog(uv0, WebHttp.errorMsg)
		GameSendLose.SendLose(Main.LOSE_SERVER_FAIL)
	end

	uv1 = uv1 + 1
	slot0 = slot0 or WebHttp.errorMsg
	LoginMgr.canReQueryLoginServer = true

	LoopManager.clearTimeout(uv2)

	if Net.isReconnect and uv1 < 5 then
		uv2 = LoopManager.setTimeout(function ()
			queryLoginServer(true)
		end, 1)
	elseif Net.isReconnect then
		Alert.show(Alert.AlertVO.new({
			leftLabel = "返回登录",
			msg = "当前网络较差，查询服务器列表失败，请检查网络状态，点击确定尝试重新连接",
			showCloseBtn = false,
			isMaskClick = false,
			rightHandle = function ()
				uv0 = 0

				Dispatcher.dispatch(ModuleCommand.SHOW_NET_WAIT)
				queryLoginServer(Net.isReconnect)
			end,
			leftHandle = function ()
				Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
			end
		}))
	else
		Alert.show({
			rightLabel = "确定",
			showCloseBtn = false,
			msg = "查询登录服务器失败,原因：\n" .. slot0,
			rightHandle = function ()
				if SDKMgr.isThirdPlatform() then
					uv0 = 0

					queryLoginServer(Net.isReconnect)
				end
			end
		})
	end
end

function loginTimeOut()
	if Net.getCanReconnect() == true then
		printLxf("===================================================")
		Alert.show(Alert.AlertVO.new({
			msg = "当前网络较差，登录超时，请检查网络状态，点击确定尝试重新连接",
			showCloseBtn = false,
			showLeftBtn = false,
			isMaskClick = false,
			rightHandle = function ()
				Net.onReconn(true)
			end
		}))
	end
end

function startConnect()
	GameSendLose.SendLose(Main.LOSE_CONNECT_SERVER)
	Dispatcher.addMessageListener(ModuleCommand.CONNECT_SUCCESS, onConnectSuccess)
	Net.start(LoginMgr.ip, LoginMgr.port)
	LoginMgr.changeIP()
	print("[登录]开始连接服务器：" .. LoginMgr.ip .. ":" .. LoginMgr.port)
end

slot9 = nil

function onConnectSuccess()
	LoopManager.clearTimeout(uv0)

	if Net.isReconnect then
		m_auth_key_tos(1)
	else
		uv0 = LoopManager.setTimeout(function ()
			GameSendLose.SendHttpLog("", "2")
		end, 5)

		m_auth_key_tos(0)
	end
end

function m_auth_key_tos(slot0)
	GameSendLose.SendLose(Main.LOSE_SEND_AUTH_KEY)

	slot1 = Message.createProto("m_auth_key_tos")
	slot1.uid = LoginMgr.getLoginAccount()
	slot1.session_id = LoginMgr.getLoginSession()
	slot1.client_version = tostring(SystemConfig.AppVersion) .. "." .. tostring(SystemConfig.IsDebug and 100000 or SystemConfig.ResVersion)
	slot1.client_cid = SDKMgr.getPushDeviceToken()
	slot1.client_oid = SystemConfig.GetSysCfg("OID")
	slot1.network_type = PlatFormInfo.GetNetworkType()
	slot1.operator = PlatFormInfo.GetOperatorName()
	slot1.device = SystemConfig.IsEditor and "UnityEditor" or SystemConfig.mMachine
	slot1.extra_params = ""
	slot1.idfa = SystemConfig.idfa
	slot1.imei = SystemConfigLua.getDeviceID()
	slot1.is_reconnect = slot0 == 1 and Net:getSocketConnectID() or 0
	slot1.phone_os = SystemConfig.ssVersion
	slot1.key = LoginMgr.sign
	slot1.time = tonumber(LoginMgr.time)
	slot1.server_id = tonumber(LoginMgr.server_id)
	slot1.agent_id = tonumber(LoginMgr.agent_id)
	slot1.platform = tonumber(LoginMgr.platform_id)
	slot1.login_type = LoginMgr.getLoginType()

	Net.sendProto(slot1, nil, true)
	printWarning(PrintUtil.getString(slot1, "[登录]发送m_auth_key_tos："))
end

slot10 = false

function m_auth_key_toc(slot0)
	printWarning(PrintUtil.getString(slot0, "[登录]收到m_auth_key_toc："))

	if slot0.succ == 1 then
		GameSendLose.SendSdkLog()
		GameSendLose.SendLose(Main.LOSE_AUTH_KEY_RETURN_SUCCESS)
		GlobalData.setTimezone(slot0.time_offset)
		VideoManager.stop()

		Net.hasLogin = true

		if slot0.is_reconnect == 1 then
			ErrorModule.recieveToc(nil, 0)
		else
			ErrorModule.clearImportProto()

			uv0 = slot0.is_new_role == 1

			m_role_detail_tos()
		end
	else
		GameSendLose.SendLose(Main.LOSE_AUTH_KEY_RETURN_FAIL)
	end
end

function m_role_detail_tos()
	GameSendLose.SendLose(Main.LOSE_SEND_ROLE_DETAIL)
	Net.sendProto(Message.createProto("m_role_detail_tos"), nil, true)
	print("[登录]发送m_role_detail_tos")
end

function m_role_create_tos()
	slot0 = Message.createProto("m_role_create_tos")
	slot0.category = LoginMgr.cate
	slot0.sex = tonumber(Util.random(1, 2))
	slot0.role_name = LoginMgr.roleName
	slot0.auto = 0
	slot0.faction_id = 1
	slot0.hair_color = 1
	slot0.hair_type = 1
	slot0.create_param = 0

	Net.sendProto(slot0)
	printTable(slot0, "[登录]发送m_role_create_tos：")
end

function m_role_create_toc(slot0)
	printTable(slot0, "[登录]收到m_role_create_toc：")
end

function m_role_detail_toc(slot0)
	LoopManager.clearTimeout(uv0)
	printTable(slot0, "[登录]收到m_role_detail_toc：")

	LoginMgr.queueNum = slot0.queue_num

	if slot0.queue_num > 0 then
		if isOpenQueuePanel() then
			updateQueuePanel()
		else
			openQueuePanel()
		end
	else
		closeQueuePanel()
		GameSendLose.SendLose(Main.LOSE_ROLE_DETAIL_RETURN)
		disposeLoginResource()

		slot1 = slot0.role_details

		GlobalData.initData(slot1)
		NetHeartBeat.onStartHB(slot0.server_time)

		Net.loginCom = true
		uv1 = slot1
		uv2 = true

		updateLoginBgPanel("showContinue")

		uv3 = slot1.attr and slot1.attr.agreement ~= 0

		if SystemConfigLua.isUseProtoRule() and not uv3 then
			LoginModule.openRulePanel()
		end

		if uv4 then
			if not SDKMgr.isDelaySendCreateRole() then
				SDKModule.createRoleSDK()
				SDKModule.enterGameSDK()
			end

			if SDKMgr.isDncMedia() then
				SDKModule.trackEvent(10)
			elseif SDKMgr.isKomoe() then
				SDKModule.trackEvent(1)
			end
		else
			SDKModule.enterGameSDK()
		end

		Dispatcher.dispatch(ModuleCommand.ENTER_GAME)
	end
end

function m_login_active_info_toc(slot0)
	printTable(slot0, "[登录]收到m_login_active_info_toc：")

	uv0 = slot0.is_active == 1

	if uv0 then
		closeLoginActivePanel()
		updateLoginBgPanel("showContinue")
	else
		openLoginActivePanel()
	end
end

function m_role_agreement_tos()
	Net.createAndSendProto("m_role_agreement_tos")
end

function m_role_agreement_toc()
	uv0 = true

	LoginModule.closeRulePanel()
end

function isCanEnterGame()
	return uv0 and uv1
end

function touchToContinue()
	if SDKMgr.isThirdPlatform() and not SDKMgr.isSdkStateArr({
		SDKMgr.LOGIN_ING,
		SDKMgr.LOGIN_SUCC
	}) then
		if AccountMgr.isUseInherit() then
			AccountModule.loginInherit()
		else
			SDKModule.loginSDK()
		end

		return
	end

	if not isCanEnterGame() then
		return
	end

	if SDKMgr.isDncMedia() then
		SDKModule.m_adjust_log_tos(4)
	end

	if SDKMgr.isBgGames() then
		SDKModule.trackEvent(1002)
	end

	if SystemConfigLua.isUseProtoRule() and not uv0 then
		LoginModule.openRulePanel()

		return
	end

	GuideModule.initGuideData(uv1.guide)
	disposeLoginBgResource()
	AccountMgr.saveCurrInheritName()
	AccountModule.closeAllPopupPanel()
end

function disposeLoginResource()
	closeLoginPanel()
	releaseLoginPanel()
end

function disposeLoginBgResource()
	CameraModule.ResetCam()

	uv0 = nil

	closeLoginBgPanel()
	releaseLoginBgPanel()
	closeLoginActivePanel()
	releaseLoginActivePanel()
end

function disposeModule()
	onDispose()
end
