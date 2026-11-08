module("SystemConfigLua", package.seeall)
setmetatable({}, {
	__mode = "kv"
})

function isUnityEditor()
	if uv0.IsEditor == nil then
		uv0.IsEditor = SystemConfig.IsEditor
	end

	return uv0.IsEditor
end

function isDebug()
	if uv0.IsDebug == nil then
		uv0.IsDebug = SystemConfig.IsDebug
	end

	return uv0.IsDebug
end

function getPackageName()
	uv0.PackageName = uv0.PackageName or SystemConfig.GetSysCfg("PackageName")

	return uv0.PackageName
end

function getApkUrl()
	uv0.ApkUrl = uv0.ApkUrl or SystemConfig.ApkUrl or ""

	return uv0.ApkUrl
end

function getGameNameEn()
	uv0.GameNameEn = uv0.GameNameEn or SystemConfig.GetSysCfg("GameNameEn")

	return uv0.GameNameEn
end

function getPfNum()
	uv0.PfNum = uv0.PfNum or SystemConfig.GetSysCfg("PfNum")

	return uv0.PfNum
end

function getPfName()
	uv0.PfName = uv0.PfName or SystemConfig.GetSysCfg("PfName")

	return uv0.PfName
end

function getAgentID()
	uv0.AgentID = uv0.AgentID or SystemConfig.GetSysCfg("AgentID")

	return uv0.AgentID
end

function getAgentName()
	uv0.AgentName = uv0.AgentName or SystemConfig.GetSysCfg("AgentName")

	return uv0.AgentName
end

function getDeviceID()
	uv0.deviceId = uv0.deviceId or SystemConfig.deviceId

	return uv0.deviceId or ""
end

function getUnityUniqueID()
	if uv0.deviceUniqueId == nil then
		uv0.deviceUniqueId = ""

		xpcall(function ()
			uv0.deviceUniqueId = SystemInfo.deviceUniqueIdentifier
		end, printWarning)
	end

	return uv0.deviceUniqueId
end

function getUnityUniqueID_Dynamic()
	if uv0.deviceUniqueId == nil then
		package.preload["tolua.reflection"]()

		slot1 = tolua.getproperty(tolua.findtype("UnityEngine.SystemInfo"), "deviceUniqueIdentifier")

		xpcall(function ()
			uv0.deviceUniqueId = uv1:Get(tolua.createinstance(uv2), nil)
		end, printError)

		slot0, slot1 = nil
	end

	return uv0.deviceUniqueId or ""
end

function getAgentDebug()
	return getAgentName() == "debug"
end

function getAgentRelease()
	return getAgentName() == "release"
end

function getRouter()
	uv0.Router = uv0.Router or SystemConfig.GetSysCfg("Router")

	return uv0.Router
end

function isIOS()
	uv0.isIOS = uv0.isIOS or SystemConfig.IsIOS

	return uv0.isIOS
end

function isAndroid()
	return not isIOS()
end

function getBranchVer()
	uv0.BranchVer = uv0.BranchVer or toint(SystemConfig.GetSysCfg("BranchVer"))

	return uv0.BranchVer
end

function canDownloadRemoteRes()
	return canAutoDownloadRemoteRes() or canManualDownloadRemoteRes()
end

slot1 = nil

function canAutoDownloadRemoteRes()
	if uv0 == nil then
		uv0 = false

		xpcall(function ()
			uv0 = SystemConfig.CanAutoDownloadRemoteRes
		end, printWarning)
	end

	return uv0
end

slot2 = nil

function canManualDownloadRemoteRes()
	if uv0 == nil then
		uv0 = false

		xpcall(function ()
			uv0 = SystemConfig.CanManualDownloadRemoteRes
		end, printWarning)
	end

	return uv0
end

function getAppType()
	uv0.AppType = uv0.AppType or SystemConfig.GetSysCfg("AppType")

	return uv0.AppType
end

PKG_TYPE_ALL = "1"
PKG_TYPE_HALF = "2"
PKG_TYPE_100 = "3"
PKG_TYPE_MULTI_LIT = "11"
PKG_TYPE_MULTI_BIG = "12"

function isMultiZip()
	return isMultiZipLittle() or isMultiZipBig()
end

function isMultiZipLittle()
	return getAppType() == PKG_TYPE_MULTI_LIT
end

function isMultiZipBig()
	return getAppType() == PKG_TYPE_MULTI_BIG
end

function isSecondZipDone()
	return SystemConfig.GetExtCfg("isSecondZipDone") == "2"
end

function needSetupSecondZip()
	return isMultiZip() and not isSecondZipDone()
end

function needSetupZipAndAlert(slot0)
	if needSetupSecondZip() then
		Alert.show(Alert.AlertVO.new({
			msg = slot0 or "更优的视觉体验\n请下载完整资源哦(๑•̀ㅂ•́)و✧",
			rightHandle = function ()
				SettingModule.gotoOpenMainPanel(SettingConst.TAB_DOWNLOAD)
			end
		}))

		return true
	end

	return false
end

function getLang()
	uv0.Lang = uv0.Lang or SystemConfig.GetSysCfg("Lang")

	if string.isEmpty(uv0.Lang) then
		return "chinese_s"
	end

	return uv0.Lang
end

slot3 = "chinese_s"
slot4 = "chinese_t"
slot5 = "japanese"
slot6 = "korean"
slot7 = "english"

function isOtherLang()
	return not isSimple()
end

function isSimple()
	return getLang() == uv0 or getLang() == ""
end

function isTraditional()
	return getLang() == uv0
end

function isJapanese()
	return getLang() == uv0
end

function isKorean()
	return getLang() == uv0
end

function isEnglish()
	return getLang() == uv0
end

function isNewKorean()
	return SystemConfig.GetSysCfg("OID") == "201-2002-1581094655" or slot0 == "201-2003-1581094655" or slot0 == "201-2004-1581094655" or slot0 == "201-2005-1581094655"
end

function isUseProtoRule()
	return isJapanese()
end

function setAgentNum(slot0)
	uv0.AgentID = slot0
end

function setAgentName(slot0)
	uv0.AgentName = slot0
end

function setPfNum(slot0)
	uv0.PfNum = slot0
end

function setPfName(slot0)
	uv0.PfName = slot0
end
