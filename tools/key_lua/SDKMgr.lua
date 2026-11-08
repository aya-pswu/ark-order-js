module("SDKMgr", package.seeall)

LOGIN_NONE = "LOGIN_NONE"
LOGIN_ING = "LOGIN_ING"
LOGIN_SUCC = "LOGIN_SUCC"
LOGIN_FAIL = "LOGIN_FAIL"
LOGIN_TIMEOUT = "LOGIN_TIMEOUT"
LOGOUT_ING = "LOGOUT_ING"
LOGOUT_SUCC = "LOGOUT_SUCC"
LOGOUT_FAIL = "LOGOUT_FAIL"
LOGOUT_SW_ING = "LOGOUT_SW_ING"
slot0 = LOGIN_NONE

function getSdkState()
	return uv0
end

function setSdkState(slot0)
	uv0 = slot0
end

function isSdkState(slot0)
	return uv0 == slot0
end

function isSdkStateArr(slot0)
	for slot4, slot5 in pairs(slot0) do
		if slot5 == uv0 then
			return true
		end
	end

	return false
end

slot1 = nil

function checkNoCallBackLogin()
	clearCheckLogin()
	ErrorModule.openNetWaitPanel()

	uv0 = LoopManager.setTimeout(function ()
		if isSdkState(LOGIN_ING) then
			setSdkState(LOGIN_TIMEOUT)
		end
	end, 8)
end

function clearCheckLogin()
	if uv0 then
		LoopManager.clearTimeout(uv0)

		uv0 = nil

		ErrorModule.closeNetWaitPanel()
	end
end

slot2 = false

function isInPayState()
	return uv0
end

function setPayState(slot0)
	uv0 = slot0
end

function isSelectLogin()
	return isTencent() or isDncMedia()
end

slot3 = nil

function isThirdPlatform()
	if uv0 == nil then
		uv0 = C_SDKInterface:GetBool(SDKCallback.GET_IS_3TH_PF)
	end

	return uv0
end

slot4 = nil

function isTencent()
	if uv0 == nil then
		uv0 = C_SDKInterface:GetBool(SDKCallback.GET_IS_TENCENT)
	end

	return uv0
end

slot5 = nil

function getChannelID()
	if uv0 == nil then
		uv0 = C_SDKInterface:GetString(SDKCallback.GET_CHANNEL_ID)
	end

	return tostring(uv0)
end

function isSubChannel()
	return string.isNotEmpty(getChannelID())
end

function isCanShare()
	if SystemConfigLua.isIOS() then
		return true
	end

	if isSubChannel() or isPf_uo_uo() or isPf_uo_bili() or isPf_xy() then
		return false
	end

	return true
end

slot6 = nil

function getPushDeviceToken()
	uv0 = uv0 or C_SDKInterface:GetString(SDKCallback.GET_PUSH_DEVICE_TOKEN)

	if uv0 == "" then
		uv0 = "0"
	end

	return uv0
end

slot7 = nil

function getProducePhone()
	uv0 = uv0 or C_SDKInterface:GetString(SDKCallback.GET_PRODUCE_PHONE)

	return uv0
end

function isDncMedia()
	return SystemConfigLua.getAgentName() == "dncmedia" or SystemConfigLua.getAgentName() == "krcheck"
end

function isDncMediaGp()
	return SystemConfigLua.getPfName() == "dncandgp"
end

function isDncMedia18R()
	return SystemConfigLua.getPfName() == "dncandone"
end

function isDncMediaSamsung()
	return SystemConfigLua.getPfName() == "dncandss"
end

function isBgGames()
	return SystemConfigLua.getAgentName() == "bggames"
end

function isKomoe()
	return SystemConfigLua.getAgentName() == "komoe"
end

function isPf_and_bili()
	return SystemConfigLua.getPfName() == "biliand"
end

function isPf_uo_uo()
	return SystemConfigLua.getPfName() == "biliandly"
end

function isPf_uo_bili()
	return SystemConfigLua.getPfName() == "bili"
end

function isPf_xy()
	return SystemConfigLua.getPfName() == "biliandxy"
end

function isLenovo()
	return getChannelID() == "26"
end

function isUC()
	return getChannelID() == "1"
end

function isLaoYueGou()
	return getChannelID() == "57"
end

function isTxCat()
	return getChannelID() == "61"
end

function isGuoPan()
	return getChannelID() == "43"
end

function isHanFeng()
	return getChannelID() == "64"
end

function is360()
	return getChannelID() == "103"
end

function isDelaySendCreateRole()
	return isUC() or isLaoYueGou() or isTxCat()
end

function getUserID()
	return C_SDKInterface:GetString(SDKCallback.GET_USER_ID)
end

function getUserName()
	return C_SDKInterface:GetString(SDKCallback.GET_USER_NAME)
end

function getSessionID()
	return C_SDKInterface:GetString(SDKCallback.GET_SESSION_ID)
end

function getTokenSecret()
	return C_SDKInterface:GetString(SDKCallback.GET_TOKEN_SECRET)
end

function getMemberID()
	return C_SDKInterface:GetString(SDKCallback.GET_MEMBER_ID)
end

function isInstallWeixin()
	return C_SDKInterface:GetBool(SDKCallback.GET_IS_INSTALL_WEIXIN)
end

function isInstallWeiBo()
	return C_SDKInterface:GetBool(SDKCallback.GET_IS_INSTALL_WEIBO)
end

function isNeedLoginPanel()
	return not SDKMgr.isThirdPlatform() or SystemConfigLua.getAgentName() == "pingce"
end

function isUseLoginLocal()
	return not SDKMgr.isThirdPlatform() and SystemConfigLua.getAgentName() ~= "pingce"
end

function isUseSelfPaySDK()
	return SystemConfigLua.isJapanese()
end
