module("Net", package.seeall)
require("Core.Net.Message")
require("Core.Net.ProtoAlias")
require("Core.Net.Proto")
require("Core.Net.Net2")
require("Core.Net.NetHeartBeat")

slot0 = {}
CONNECTED = 0
CONNECTING = 1
CLOSE = 2
state = 0
handlerSuccess = nil
lastAliasId = 0
loginCom = false
slot1, slot2 = nil

function registerAckHand(slot0, slot1)
	uv0 = slot0
	uv1 = slot1
end

slot3 = {}

function registerSocketHandler(slot0, slot1)
	if slot0 == nil then
		printError("---> registerSocketHandler Error")

		return
	end

	slot2 = uv0[slot0] or {}

	for slot6 = 1, #slot2 do
		if slot1 == slot2[slot6] then
			return
		end
	end

	table.insert(slot2, slot1)

	uv0[slot0] = slot2
end

function removeSocketHandler(slot0, slot1)
	if slot1 == nil then
		uv0[slot0] = nil

		return
	end

	if uv0[slot0] == nil then
		return
	end

	for slot6 = 1, #slot2 do
		if slot2[slot6] == slot1 then
			table.remove(slot2, slot6)

			return
		end
	end
end

function resultHandler(slot0)
	if uv0[slot0.proto] ~= nil then
		for slot5 = #slot1, 1, -1 do
			xpcall(function ()
				uv0[uv1](uv2)
			end, printError)
		end
	end
end

function unpackdate(slot0)
	if not LoginModule.isRelogin then
		slot2 = slot0:ReadUnsignedByte()

		if slot0:ReadUnsignedByte() == 131 and (slot2 == 104 or slot2 == 105) then
			slot3 = slot0:ReadUnsignedByte()
			slot5 = nil

			if slot0:ReadUnsignedByte() == 97 then
				slot5 = slot0:ReadByte()
			elseif slot4 == 98 then
				slot5 = slot0:ReadInt()
			else
				print("协议号解码错误，FirstEleFlag=" .. slot4)
				print("上一条协议号：" .. lastAliasId)

				return
			end

			if ProtoAlias.getAliasByClassName(slot5) == nil then
				print("协议错误：检测协议是否存在：aliasID is ----------------------- > " .. slot5)

				return
			end

			slot7 = nil

			xpcall(function ()
				printProtoLog(not SystemConfigLua.isUnityEditor(), uv0)

				uv1 = Message.decode(uv2, uv0)

				printProtoLog(SystemConfigLua.isUnityEditor(), uv0, uv1)
			end, printError)

			if uv0 ~= nil then
				uv0(slot6)
			end

			resultHandler(slot7)

			lastAliasId = slot5
		end
	end

	slot0:Clear()
	C_LuaEngine:DisposeObject(slot0)
end

function printProtoLog(slot0, slot1, slot2)
	if not slot0 then
		return
	end

	if not table.index(doNotPrintToc, slot1) then
		vo_str = slot2 and PrintUtil.getString(slot2) or ""

		print(string.csformat([[
收到协议↓：{0}


{1}]], slot1, vo_str))
	end
end

doNotPrintToc = {
	"m_system_hb_toc",
	"m_role_act_info_toc",
	"m_system_time_toc",
	"m_building_info_toc",
	"m_common_reply_toc",
	"m_role_act_update_toc"
}

function onStart()
	if state == CONNECTED and handlerSuccess ~= nil then
		handlerSuccess()
	end
end

function updateState(slot0)
	state = slot0
end

function startHandshark()
	send("tgw_l7_forward\r\n" .. "Host: " .. GameParameters.host .. ":" .. GameParameters.port .. "\r\n\r\n")
	Debug.Log("握手host" .. GameParameters.host .. "port" .. GameParameters.port)
end

function createAndSendProto(slot0, ...)
	slot1 = Message.createProto(slot0)

	if #{
		...
	} == 1 and type(slot2[1]) == "table" then
		for slot7, slot8 in pairs(slot2[1]) do
			slot1[slot7] = slot8
		end

		sendProto(slot1)
	else
		for slot7 = 1, slot3, 2 do
			slot1[slot2[slot7]] = slot2[slot7 + 1]
		end

		sendProto(slot1)
	end
end

function sendProto(slot0, slot1, slot2, slot3)
	slot3 = slot3 or false
	slot2 = slot2 or false

	if slot0 == nil then
		return
	end

	if uv0 ~= nil and slot3 == false then
		uv0(slot0, slot1)
	end

	checkOnSendProto()

	if loginCom == false and slot2 == false then
		return
	end

	slot4, slot5, slot6 = nil

	if Message.encode(slot0).Length > 512 then
		slot6:Compress()

		slot5 = 1
	else
		slot5 = 0
	end

	if SystemConfigLua.isDebug() then
		if SystemConfigLua.isUnityEditor() then
			print(string.csformat([[
发送协议↑：{0}


{1}]], slot0.classname, PrintUtil.getString(slot0)))
		else
			print("发送协议↑：" .. slot0.classname)
		end
	end

	Dispatcher.dispatch(ModuleCommand.APPEND_PROTO, slot0)
	encryptAndSend(slot5, slot6, slot1)
	slot6:Clear()
	C_LuaEngine:DisposeObject(slot6)
end
