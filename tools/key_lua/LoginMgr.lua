module("LoginMgr", package.seeall)

query_ip = "10.10.10.77"
query_port = "9021"
ip = nil
port = nil
account = nil
server_id = 1
agent_id = 0
platform_id = 0
in_verify_server = false
sign = ""
time = ""
canReQueryLoginServer = true
queueNum = 0
isTestServer = false
cate = 0
roleName = nil

function getLoginAccount()
	slot0 = nil

	return SDKMgr.isNeedLoginPanel() and account or AccountMgr.isUseInherit() and AccountMgr.getInheritName() or SDKMgr.isDncMedia() and SDKMgr.getMemberID() or SDKMgr.getUserID() or ""
end

function getLoginSession()
	slot0 = nil

	return SDKMgr.isNeedLoginPanel() and "" or AccountMgr.isUseInherit() and AccountMgr.session_id or SDKMgr.getSessionID() or ""
end

function getLoginType()
	slot0 = 0

	if SDKMgr.isDncMedia() then
		if SDKModule.getLastLoginPF() == SDKConst.PF_GUEST then
			slot0 = 3
		elseif slot1 == SDKConst.PF_GOOGLE then
			slot0 = 2
		elseif slot1 == SDKConst.PF_FACEBOOK then
			slot0 = 1
		end
	end

	return slot0
end

slot0 = nil

function saveBGP(slot0, slot1)
	uv0 = {}

	table.insert(uv0, {
		isBgp = false,
		ip = ip,
		port = port
	})

	for slot6, slot7 in pairs(string.split(slot1, ",")) do
		if string.isNotEmpty(slot0) and string.isNotEmpty(slot7) then
			table.insert(uv0, {
				isBgp = true,
				ip = slot0,
				port = slot7
			})
		end
	end
end

slot1 = 1
slot2 = false
slot3 = false

function changeIP()
	if uv0 and #uv0 > 0 then
		vo = uv0[uv1]
		uv1 = uv1 + 1

		if uv1 > #uv0 then
			uv1 = 1
			uv2 = true
		end

		return vo.ip, vo.port, vo.isBgp
	end

	return ip, port, false
end

function resetIPIndex(slot0)
	uv0 = 1
	uv1 = false
	uv2 = slot0 or false
end

function hasFindIPIndex()
	return uv0
end

function isOverRound()
	return uv0
end

slot4 = {}
slot5 = nil

function initConfig()
	if uv0 == nil then
		uv0 = ConfigMgr.getConfig("CfgUserProto")
		proto = uv0.proto
		uv1 = string.split(proto, [[



]])
	end
end

function getProtoTexts()
	initConfig()

	return uv0
end

function onDispose()
	return
end
