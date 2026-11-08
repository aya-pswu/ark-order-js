module("NoticeModule", package.seeall)
require("Modules.NoticeNew.NoticeModuleAutoGen")
require("Modules.NoticeNew.NoticeConst")
require("Modules.NoticeNew.NoticeConfig")
require("Modules.NoticeNew.NoticeMgr")
require("Modules.NoticeNew.View.UniWebView")

-- 本地服公告实现（2026-10-12，接替早先"跳过公告 WebView"的引导期补丁）：
--   公告按钮（CfgMain link=OPEN_NOTICE_PANEL）→ gotoOpenMainPanel → openUniWebView(getHomeURL())
--   → openUniWebViewPanel("openUrl", url) → 面板内嵌 UniWebView 加载游戏服本地公告站
--   （server/http_router.js 的 /notice/**，内容源 server/data/notice_data.js，五个页签路径与官方 CMS 同构）。
--   getHomeURL 由客户端收到的 GetAgentConfig.resStatic 推导（PCJS=http://<服IP>，单机=http://127.0.0.1:8081），
--   双管线同一段补丁。基座 targetSdk=26，WebView 加载明文 http 不受 cleartext 限制。
--   首次登录当日的自动弹公告 = 官方原行为（m_role_acts_toc → checkTodayIsFirstLogin → firstLoginAndShowNotice）。
--   以下官方函数体均按 bc 反编译（tools/bc_cmp/NoticeModule_decompiled.lua）逐行还原，仅 getHomeURL 换本地实现。
-- 另含既有存续修复：RoleMgr.getGroupList 字节码损坏补丁、ServantUtil.isTeam 加固（见 initModule 内，勿删）。

function initModule()
	registerModuleSocket("NoticeModule")
	addMessageListener("OPEN_NOTICE_PANEL_BH", gotoOpenMainPanel_BH)
	addMessageListener(ModuleCommand.OPEN_NOTICE_PANEL, gotoOpenMainPanel)
	print("PS-NOTICE-LOCAL-SITE-INSTALLED")

	-- 本地服补丁：RoleMgr.updateHelpGroup 的 prototype 损坏（全是 RET0 死指令），helpGroup 永远为空，
	-- 主城 MainFunctionPanel.onChangeHelp 里 getServant(nil) → index field 'servant' 崩溃无法进主城。
	-- initModule 时机所有模块文件已加载（RoleMgr/ServantMgr 全局必就绪），此处同步覆盖 getGroupList。
	if RoleMgr ~= nil and ServantMgr ~= nil then
		RoleMgr.getGroupList = function()
			-- getServantTypeDic 返回的是 类型→计数 字典（值是 number），不能遍历取 VO；
			-- 正确姿势：indexServantWithSort(i) 返回排序后列表第 i 个 VO
			local list = {}
			local n = ServantMgr.getUseSize and ServantMgr.getUseSize() or 0
			for i = 1, n do
				local vo = ServantMgr.indexServantWithSort(i)
				if vo ~= nil then
					table.insert(list, vo.id)
				end
			end
			return list
		end
		print("<<<< 本地服补丁: RoleMgr.getGroupList 已修复 >>>>")
		-- 本地服补丁2：ServantUtil.getStateTip 里 isTeam(vo) → vo:getTeamId() 在部分数据状态下
		-- 会触发 attempt to index a nil value（编队选择列表 onGUI 崩，列表渲染中断）。
		-- isTeam 的语义是"编队中"，用 vo.teamIdList 是否非空等效替代，规避索引崩溃。
		if ServantUtil ~= nil then
			ServantUtil.isTeam = function(vo)
				if vo == nil then return false end
				if type(vo) == "table" and vo.getTeamId ~= nil then
					local ok, tid = pcall(vo.getTeamId, vo)
					if ok then return tid > 0 end
				end
				local tl = type(vo) == "table" and vo.teamIdList
				return tl ~= nil and #tl > 0
			end
			print("<<<< 本地服补丁: ServantUtil.isTeam 已加固 >>>>")
		end
	else
		print("<<<< 本地服补丁警告: initModule 时 RoleMgr/ServantMgr 未就绪 >>>>")
	end
end

noticeShown = false
homeURL = nil

function firstLoginAndShowNotice()
	if noticeShown then
		ActivityModule.dealwithNextAct()

		return
	end

	noticeShown = true

	SystemConfig.SaveExtCfg("lastShowNoticeDay", DateFormatUtil.formatPassDate1(GlobalData.serverTime))
	SystemConfig.SaveExtCfg()

	if GlobalDataManager.IsUnityEditor() then
		ActivityModule.dealwithNextAct()
	else
		gotoOpenMainPanel()
	end
end

function checkTodayIsFirstLogin()
	return SystemConfig.GetExtCfg("lastShowNoticeDay") ~= DateFormatUtil.formatPassDate1(GlobalData.serverTime)
end

function gotoOpenMainPanel()
	openUniWebView(getHomeURL(), true)
	RedPointManager.changePointState(RedPointConst.NEW_NOTICE, false)
	MainModule.m_red_point_hide_tos(62)
end

-- 本地公告站地址（官方此处返回分区域 CMS 域名，本地服换成游戏服自带的 HTTP 端点）。
-- 首选 SystemConfig.resStaticAddr（客户端更新检查时从 GetAgentConfig.php 的 resStatic 字段取得，
-- 天然带对的主机与端口：PCJS=http://<服IP>，安卓单机=http://127.0.0.1:8081），剥掉结尾 "/res" 即基址；
-- 兜底用 LuaRemoteIP（单机恒 127.0.0.1 → HTTP 8081；PCJS=服务器 IP → HTTP 80）。
function getHomeURL()
	if homeURL == nil then
		local base = nil

		local ok, resStatic = pcall(function()
			return SystemConfig.resStaticAddr
		end)

		if ok and type(resStatic) == "string" and resStatic ~= "" then
			base = string.match(resStatic, "^(.*)/res$")
			-- 防线：若未来单机端在 JS 就绪后重拉 GetAgentConfig，会拿到无端口的 http://127.0.0.1/res，
			-- 此时 HTTP 实际在 8081（JS 路由同端口），补回端口。
			if base == "http://127.0.0.1" then
				base = "http://127.0.0.1:8081"
			end
		end

		if base == nil or base == "" then
			local ok2, ip = pcall(function()
				return SystemConfig.LuaRemoteIP()
			end)

			if ok2 and type(ip) == "string" and ip ~= "" then
				if ip == "127.0.0.1" then
					base = "http://127.0.0.1:8081"
				else
					base = "http://" .. ip
				end
			end
		end

		if base == nil or base == "" then
			base = "http://127.0.0.1:8081"
		end

		homeURL = base .. "/notice"
		print("<<<< NoticeModule.getHomeURL = " .. homeURL .. " >>>>")
	end

	return homeURL
end

function gotoOpenMainPanel_BH()
	openUniWebView(getHomeURL(), true)
end

function openUniWebView(slot0, slot1)
	if GlobalDataManager.IsUnityEditor() then
		Tips.addTips("在Unity编辑器，无法查看公告")

		return
	end

	openUniWebViewPanel("openUrl", slot0)
end

-- SDKCallback 返回键链路依赖（onBackPress / onBackPressByAndroid），一个都不能缺：
--   onBackPress:          isShowingWebView → closeUniWebViewPanel → disposeWebView
--   onBackPressByAndroid: isShowingWebView → canGoBackUniWebView → closeUniWebView
-- closeUniWebViewPanel 用 AutoGen 生成的框架版（会走 UniWebViewPanel.close → dealwithNextAct 续主面板链），
-- 本文件不要同名覆盖它。
function isShowingWebView()
	return isOpenUniWebViewPanel()
end

function canGoBackUniWebView()
	return false
end

function closeUniWebView()
	closeUniWebViewPanel()
end

function disposeWebView()
end

function disposeModule()
	return
end
