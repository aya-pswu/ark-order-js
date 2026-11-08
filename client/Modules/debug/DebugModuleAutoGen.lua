module("DebugModule", package.seeall)
require("Modules.Debug.View.DebugIcon")
require("Modules.Debug.View.DebugMainPanel")
require("Modules.Debug.View.DebugMainView")
require("Modules.Debug.View.DebugSubView")
require("Modules.Debug.View.LogDetailPanel")
require("Modules.Debug.View.SubViewCommand")
require("Modules.Debug.View.SubViewCommandItem")
require("Modules.Debug.View.SubViewFight")
require("Modules.Debug.View.SubViewFightItem")
require("Modules.Debug.View.SubViewInfo")
require("Modules.Debug.View.SubViewInfoItem")
require("Modules.Debug.View.SubViewLog")
require("Modules.Debug.View.SubViewLogItem")
require("Modules.Debug.View.SubViewServant")
require("Modules.Debug.View.SubViewServantItem")
require("Modules.Debug.View.SubViewShop")
require("Modules.Debug.View.SubViewShopItem")
require("Modules.Debug.View.SubViewSpine")
createModulePanelFunc("DebugModule", "mainPanel", DebugMainPanel)
createModulePanelFunc("DebugModule", "logDetailPanel", LogDetailPanel)

__msgList = {}
__netList = {}

function addMessageListener(slot0, slot1, slot2)
	ModuleFactory.addMessageListener(DebugModule, slot0, slot1, slot2)
end

function removeMessageListener(slot0, slot1)
	ModuleFactory.removeMessageListener(DebugModule, slot0, slot1)
end

function removeAllListener()
	ModuleFactory.removeAllListener(DebugModule)
end

function registerSocketHandler(slot0, slot1)
	ModuleFactory.registerSocketHandler(DebugModule, slot0, slot1)
end

function removeSocketHandler(slot0, slot1)
	ModuleFactory.removeSocketHandler(DebugModule, slot0, slot1)
end

function removeAllSocketHandler()
	ModuleFactory.removeAllSocketHandler(DebugModule)
end

function onDispose()
	DebugMgr.onDispose()
	removeAllListener()
	removeAllSocketHandler()
end

-- ============================================================
-- 本地服补丁（2026-10-11 一百六十）：GM 面板「上传运行日志」按钮（仅手动触发，无自动上报）
-- ① 监听注册：CfgDebug 指令条目 gmCode 非 m21_ 开头时 SubViewCommandItem 走
--    Dispatcher.dispatch(gmCode) 本地事件——与官方 TEST_SHARE_* 条目完全同构。
-- ② 按钮条目不改 CfgDebug 配置数据，改为运行时注入：本文件上方
--    createModulePanelFunc 生成的 openMainPanel 在此包一层，首次打开面板前
--    调 LogUploader.injectButtonEntry 往 _params_SubViewCommand[1]（指令/常用）
--    头部插条目；重复打开有一次性标记，ConfigMgr.getConfig 懒加载保证安全。
-- 注意 require 用小写 debug：新模块没有 auto_aliases 别名，客户端点分转斜杠后
-- 按大小写敏感字典查帧，必须与磁盘目录（src/Modules/debug/）完全一致。
-- ============================================================
require("Modules.debug.LogUploader")

addMessageListener("GM_UPLOAD_LOG", function ()
	LogUploader.upload()
end)

local rawOpenMainPanel = openMainPanel

openMainPanel = function (...)
	pcall(LogUploader.injectButtonEntry)

	return rawOpenMainPanel(...)
end
