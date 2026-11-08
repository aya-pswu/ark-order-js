module("AccountMgr", package.seeall)

session_id = ""
currView = AccountConst.AccountSwitchView

function resetView()
	currView = AccountConst.AccountSwitchView
end

authAct = nil
_baseApiKeys = {
	"gameName",
	"agentName",
	"pfName",
	"deviceID",
	"channelID",
	"oid",
	"utid"
}

function getUrl_GetAccount(slot0)
	return getHttpUrl_GET("/client_api/account/GetAccount.php", table.add2(_baseApiKeys, {
		"resVersion",
		"apkVersion",
		"accountName",
		"uid",
		"token",
		"tokenSecret"
	}), slot0)
end

function getUrl_SetBindAccount(slot0)
	return getHttpUrl_GET("/client_api/account/SetBindAccount.php", table.add2(_baseApiKeys, {
		"accountName",
		"bindCode",
		"bindCodeLen"
	}), slot0)
end

function getUrl_BindAccount(slot0)
	return getHttpUrl_GET("/client_api/account/BindAccount.php", table.add2(_baseApiKeys, {
		"accountName",
		"bindCode"
	}), slot0)
end

function getUrl_ThirdBindAccount(slot0)
	return getHttpUrl_GET("/client_api/account/ThirdBindAccount.php", table.add2(_baseApiKeys, {
		"accountName",
		"uid",
		"userName"
	}), slot0)
end

function getUrl_ThirdUnBindAccount(slot0)
	return getHttpUrl_GET("/client_api/account/ThirdUnBindAccount.php", table.add2(_baseApiKeys, {
		"accountName",
		"uid"
	}), slot0)
end

function getUrl_CheckThirdBind(slot0)
	return getHttpUrl_GET("/client_api/account/CheckThirdBind.php", table.add2(_baseApiKeys, {
		"uid"
	}), slot0)
end

function getHttpUrl_GET(slot0, slot1, slot2)
	slot4 = getWebParams_String(slot1, slot2)
	slot5 = UrlUtil.FormatGetUrl(SystemConfigLua.getRouter() .. slot0, slot4)

	print("AccountMgr.getHttpUrl_GET = \n\n" .. slot5 .. "\n\n" .. slot4)

	return slot5
end

function getHttpUrl_POST(slot0, slot1, slot2)
	slot3 = SystemConfigLua.getRouter() .. slot0
	slot4 = getWebParams_Table(slot1, slot2)

	print("AccountMgr.getHttpUrl_POST = \n" .. slot3 .. "\n" .. PrintUtil.getString(slot4))

	return slot3, Util.tableToJsonStr(slot4)
end

function getWebParams_String(slot0, slot1)
	slot2 = ""

	for slot7, slot8 in ipairs(slot0) do
		slot9 = slot7 == #slot0 and "" or "&"
		slot10 = getParamValue(slot8)

		if slot1 and slot1[slot8] ~= nil then
			slot10 = slot1[slot8]
		end

		slot2 = slot2 .. string.csformat("{0}={1}{2}", slot8, slot10, slot9)
	end

	return slot2
end

function getWebParams_Table(slot0, slot1)
	for slot6, slot7 in ipairs(slot0) do
		if slot1 and slot1[slot7] ~= nil then
			-- Nothing
		else
			slot2[slot7] = getParamValue(slot7)
		end
	end

	return {
		[slot7] = slot1[slot7]
	}
end

function getParamValue(slot0)
	if slot0 == "gameName" then
		return SystemConfigLua.getGameNameEn()
	elseif slot0 == "agentName" then
		return SystemConfigLua.getAgentName()
	elseif slot0 == "pfName" then
		return SystemConfigLua.getPfName()
	elseif slot0 == "channelID" then
		return SDKMgr.getChannelID()
	elseif slot0 == "deviceID" then
		return SystemConfigLua.getDeviceID()
	elseif slot0 == "utid" then
		if SystemConfigLua.isAndroid() then
			return SystemConfigLua.getUnityUniqueID()
		else
			return ""
		end
	elseif slot0 == "oid" then
		return SystemConfig.GetSysCfg("OID")
	elseif slot0 == "resVersion" then
		return SystemConfig.ResVersion
	elseif slot0 == "apkVersion" then
		return SystemConfig.AppVersion
	elseif slot0 == "accountName" then
		return getInheritName()
	elseif slot0 == "uid" then
		-- Nothing
	elseif slot0 == "bindCode" then
		-- Nothing
	end

	return ""
end

slot0 = nil

function isUseInherit()
	return SystemConfigLua.isJapanese()
end

slot1 = ""

function getInheritName()
	return uv0
end

function setInheritName(slot0)
	uv0 = slot0

	Dispatcher.dispatch(ModuleCommand.ON_RECEIVE_UID)
end

function getSaveMainKey()
	return "InheritAccount"
end

function getSaveSubKey()
	return getInheritName()
end

function getSaveCurKey()
	return "__##@current@##__"
end

function syncInherit()
	if uv0 == nil then
		uv0 = string.isNotEmpty(SystemConfig.GetExtCfg(getSaveMainKey())) and Util.jsonStrToTable(slot0) or {}
	end
end

function getSaveInheritName()
	syncInherit()

	return uv0[getSaveCurKey()]
end

function saveCurrInheritName(slot0)
	if not isUseInherit() then
		return
	end

	syncInherit()

	uv0[getSaveCurKey()] = slot0 or uv1

	SystemConfig.SaveExtCfg(getSaveMainKey(), Util.tableToJsonStr(uv0 or {}))
	SystemConfig.SaveExtCfg()
end

function hasSaveInheritName()
	return string.isNotEmpty(getSaveInheritName())
end

slot2 = false
slot3 = 0
slot4, slot5 = nil

function setInheritPassword(slot0, slot1)
	uv0 = slot0

	if slot1 then
		uv1 = toint(slot1)
	end
end

function isSetInheritPassword()
	return uv0
end

function getPasswordLen()
	return uv0
end

function setInheritBindInfo(slot0, slot1)
	uv0 = slot0
	uv1 = slot1
end

function isBindAccount()
	return string.isNotEmpty(uv0)
end

function getBindUID()
	return uv0
end

function getBindUserName()
	return uv0
end

function getShowInViewPassword()
	slot1 = uv0 > 0 and uv0 or 8

	if getInheritPassword() == nil then
		for slot6 = 1, uv0 > 0 and uv0 or 8 do
			slot0 = "" .. "*"
		end
	end

	return slot0
end

function isSaveInheritPassword()
	return getInheritPassword() ~= nil
end

function getInheritPassword()
	syncInherit()

	return uv0[getSaveSubKey()]
end

function saveInheritPassword(slot0)
	syncInherit()

	uv0[getSaveSubKey()] = tostring(slot0)
	slot1 = {
		[slot5] = slot6
	}

	for slot5, slot6 in pairs(uv0) do
		if slot5 == getSaveSubKey() or slot5 == getSaveSubKey() then
			-- Nothing
		end
	end

	SystemConfig.SaveExtCfg(getSaveMainKey(), Util.tableToJsonStr(uv0 or {}))
	SystemConfig.SaveExtCfg()
end

function onDispose()
	return
end
