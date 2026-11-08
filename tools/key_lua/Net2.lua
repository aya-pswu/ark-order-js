module("Net", package.seeall)

STATE_CONNECT_FAIL = 0
STATE_CONNECTED = 1
STATE_CONNECT_TIMEOUT = 2
STATE_SEND_FAIL = 3
STATE_SERVER_CLOSE = 4
STATE_CLIENT_CLOSE = 5
STATE2STRING = {
	"STATE_CONNECT_FAIL",
	"STATE_CONNECTED",
	"STATE_CONNECT_TIMEOUT",
	"STATE_SEND_FAIL",
	"STATE_SERVER_CLOSE",
	"STATE_CLIENT_CLOSE"
}
hasLogin = false
slot0, slot1 = nil
slot2 = false
slot3 = false
slot4 = false
slot5 = 5
slot6 = 3
slot7 = 4
slot8 = 1
slot9 = 2
slot10 = 3
slot11 = 4
slot12 = 5
slot13 = 6
slot14 = 0
slot15 = true
slot16 = 1
isReconnect = false

function hasSocket()
	return uv0 ~= nil
end

function initSocket()
	uv0 = true

	if uv1 == nil then
		uv1 = NetSocket()

		uv1:InitFuncs(unpackdate, onChangeNetStatus)
	end
end

function start(slot0, slot1)
	initSocket()

	uv0 = true

	uv1:Connect(slot0, tonumber(slot1))
end

function getSocketConnectID()
	if uv0 then
		return uv0.connectID
	end

	return 0
end

function onChangeNetStatus(slot0)
	if Util.isNil(uv0) or LoginModule.isRelogin then
		return
	end

	slot1 = tonumber(slot0:ToInt())

	printWarning("Lua收到Socket状态:" .. STATE2STRING[slot1 + 1])

	if uv1 == slot1 then
		printWarning("网络状态未改变")

		return
	end

	uv1 = slot1

	if uv2 then
		if slot1 == STATE_CONNECTED then
			uv2 = false

			uv0:StartRecive()
			startGameLogic()
			startCount()

			NetHeartBeat.recieveHBTimestamp = Time.GetTimestamp()
		elseif slot1 == STATE_CONNECT_FAIL then
			onDisconnect()
		elseif slot1 == STATE_CONNECT_TIMEOUT then
			onDisconnect()
		else
			printWarning("Socket当前的连接尚未返回，忽略此次处理")
		end
	elseif slot1 == STATE_SERVER_CLOSE then
		LoginMgr.canReQueryLoginServer = true

		onDisconnect()
	elseif slot1 == STATE_SEND_FAIL then
		onDisconnect()
	else
		printWarning("Socket尚未建立连接,无法处理")
	end
end

function stateIsConnecting()
	return uv0 == STATE_CONNECTED
end

function offReconnect()
	Dispatcher.dispatch(ModuleCommand.OFF_RECONNECT)

	uv0 = false
end

function recoverReconnect()
	uv0 = true
end

function getCanReconnect()
	return uv0
end

function close(slot0)
	if slot0 then
		uv0 = false

		Dispatcher.dispatch(ModuleCommand.HIDE_NET_WAIT)
	end

	uv1 = nil
	uv2 = uv3

	if uv4 ~= nil then
		uv4:Close()
	end

	NetHeartBeat.closeHB()

	loginCom = false
end

function startGameLogic()
	Alert.close()
	Dispatcher.dispatch(ModuleCommand.HIDE_NET_WAIT)

	if uv0 then
		sendBGP()
	end

	LoginMgr.resetIPIndex(true)
	Dispatcher.dispatch(ModuleCommand.CONNECT_SUCCESS, hasLogin)
	reSetReconn()
end

function onDisconnect()
	uv0 = false

	onReconn()
end

function startCount()
	NetHeartBeat.openHB()
	LoopManager.addToSecond("Net.checkIsNeedReConn", checkIsNeedReConn)
end

function send(slot0)
	if uv0 ~= nil then
		uv0:Send(slot0)
	end
end

function encryptAndSend(slot0, slot1, slot2)
	if slot2 == nil then
		slot2 = true
	end

	if uv0 ~= nil then
		uv0:EncryptAndSend(slot0, slot1, slot2)
	end
end

function sendHB()
	if uv0 and uv1 == uv2 then
		uv0:SendHB()
	end
end

function recieveHB(slot0)
	NetHeartBeat.updataHBTimestamp(true)

	GlobalData.serverTime = slot0
end

function onInitReconn()
	uv0 = uv1
end

function checkOnSendProto()
	if uv0 ~= STATE_CONNECTED and uv1 and uv2 then
		uv3 = uv4

		Dispatcher.dispatch(ModuleCommand.SHOW_NET_WAIT)
		close()
		reStart()
	end
end

function getMaxReconnTime()
	if loginCom then
		return uv0
	else
		return uv1
	end
end

function checkIsNeedReConn()
	if uv0 and uv1 and uv2 ~= uv3 and getMaxReconnTime() < Time.GetTimestamp() - NetHeartBeat.recieveHBTimestamp then
		if uv4 < uv5 then
			uv2 = uv3

			if uv4 == 0 then
				onReconn(true)
			else
				Alert.show(Alert.AlertVO.new({
					leftLabel = "返回登录",
					msg = "当前网络较差，长时间无响应，请检查网络状态，点击确定尝试重新连接",
					showCloseBtn = false,
					isMaskClick = false,
					rightHandle = function ()
						onReconn(true)
					end,
					leftHandle = function ()
						Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
					end
				}))
			end
		else
			uv2 = uv6

			onReconn(true)
		end
	end
end

function onReconn(slot0)
	if uv0 == false or slot0 ~= true and uv1 == uv2 then
		return
	end

	close()

	if uv3 < uv4 then
		uv1 = uv5

		if slot0 then
			if uv3 ~= 0 then
				Dispatcher.dispatch(ModuleCommand.SHOW_NET_WAIT)
			end

			uv1 = uv6
			uv3 = uv3 + 1
			NetHeartBeat.recieveHBTimestamp = Time.GetTimestamp() - uv7 + 5
		end

		reStart()
	else
		close(true)
		Alert.show(Alert.AlertVO.new({
			showLeftBtn = false,
			showCloseBtn = false,
			rightLabel = "返回登录",
			msg = "亲，你暂时与服务器失去了连接……\n请返回重新登录",
			isMaskClick = false,
			rightHandle = function ()
				Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
			end
		}))

		LoginMgr.canReQueryLoginServer = true

		GameSendLose.SendHttpLog("", "1")
	end
end

function reStart()
	uv0 = true

	if LoginMgr.hasFindIPIndex() then
		uv0 = false

		LoopManager.removeFromSecond("Net.checkIsNeedReConn")
		LoginModule.queryLoginServer(true)
	elseif LoginMgr.isOverRound() and isReconnect == false then
		Alert.show(Alert.AlertVO.new({
			leftLabel = "返回登录",
			msg = "当前网络较差，尝试连接服务器失败，请检查网络状态，点击确定尝试重新连接",
			showCloseBtn = false,
			isMaskClick = false,
			rightHandle = function ()
				LoginModule.queryLoginServer()
			end,
			leftHandle = function ()
				Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
			end
		}))
	else
		slot0, slot1, slot2 = LoginMgr.changeIP()
		uv1 = slot2

		printWarning("[登录]再次连接服务器：" .. slot0 .. ":" .. slot1 .. "   isBGP = " .. tostring(slot2))
		start(slot0, slot1)
	end
end

function sendBGP()
	slot0 = Message.createProto("m_bgp_login_tos")
	slot0.id = 10501
	slot0.host = LoginMgr.ip
	slot0.port = LoginMgr.port

	Net.sendProto(slot0, false, true)
end

function reSetReconn()
	uv0 = uv1
	uv2 = 0
end
