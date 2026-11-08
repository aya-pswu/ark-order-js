-- 本地服修改（2026-08-28 多账号登录链）：在「点击屏幕开始游戏」那一屏加上账号显示与切换入口。
-- 基底 = tools/lua_remote/bc/Modules/login/LoginBgPanel.lua 的 ljd 反编译（tools/bc_cmp/LoginBgPanel_acc.lua）。
--
-- 改了三处，其余逐行照原样：
--   ① initUI / onGUI("showContinue") 末尾调 psSetupAccountUI()：把本包里恒被隐藏的
--      lblUID 与 btnLogout 两个空闲控件征用成「账号：xxx」标签和「切换账号」按钮
--      （韩服专用件，isDncMedia()=false 时官方就是隐藏的，零 AB 改动）。
--   ② onClickBtnLogout 从 SDKModule.logoutSDK() 改成弹确认 → RE_LOGIN（销毁重建 Lua VM
--      回到登录界面，账号面板会再弹一次）。走 logoutSDK 也能到 RE_LOGIN，但要绕一趟
--      被 smali 改成空实现的 SDK 回调，不如直接派事件。
--   ③ initUI 开头调 LoginModule.psPatchLoginMgr()：LoginBgPanel.initUI 比 LoginPanel.initUI
--      先跑，而 onReceiveUID 要用打过补丁的 LoginMgr.getLoginAccount()，不然这里显示的是
--      APK 写死的 29311205。
module("LoginModule", package.seeall)
require("Modules.Login.View.AutoGen.LoginBgPanelAutoGen")

function LoginBgPanel.open(self)
	self:setActive(true)

	self.panelBgmOnlyID = AudioManager.playBgmByOpenPanel(self.__cname) or self.panelBgmOnlyID
end

function LoginBgPanel.close(self)
	self:stopFadeEffect()
	self:closeConnect()
	self:setActive(false)
	AudioManager.stopAudio(self.panelBgmOnlyID)
end

function LoginBgPanel.initUI(self)
	if LoginModule.psPatchLoginMgr then
		LoginModule.psPatchLoginMgr()
	end

	self:setParent(LayerManager.uiHighLayer, true)

	self.texMainBg.Path = self:getSprineResPath()

	UIEventListener.AddClick(self.spMainBg.gameObject, selfHandler(self, "onClickMainBg"))
	Util.setActive(self.spIcon12, SDKMgr.isDncMedia() and not SDKMgr.isDncMedia18R())
	Util.setActive(self.spIcon18R, SDKMgr.isDncMedia18R())
	Util.setActive(self.spIcon18RR, SDKMgr.isDncMedia18R())
	Util.setActive(self.lblUID, AccountMgr.isUseInherit())
	Util.setActive(self.btnHelp, AccountMgr.isUseInherit())
	Util.setActive(self.btnInherit, AccountMgr.isUseInherit())
	self:setKrBtns(false)
	self:addMessageListener(ModuleCommand.ON_RECEIVE_UID, selfHandler(self, "onReceiveUID"))
	Dispatcher.dispatch(ModuleCommand.ON_RECEIVE_UID)

	if SystemConfigLua.isSimple() then
		Util.setActive(self.spLogo, false)
		Util.setActive(self.btnUserProtoSimple, true)
	else
		Util.setActive(self.spLogo, not SystemConfigLua.isJapanese())

		if SystemConfigLua.isKorean() then
			Util.setActive(self.spLogo, true)

			self.spLogo.Width = 316
			self.spLogo.Height = 190
		else
			self.spLogo:SetNativeSize()
		end
	end

	self:psSetupAccountUI()

	-- 诊断（find player）：把本面板树里所有 InputField 与所有非空 Text 打出来
	pcall(function ()
		local root = self.transform
		local ni, nt = 0, 0
		local function walk(node, depth)
			if depth > 6 then return end
			for i = 0, node.childCount - 1 do
				local c = node:GetChild(i)
				pcall(function ()
					local inf = c:GetComponent(typeof(UnityEngine.UI.InputField))
					if inf ~= nil then
						ni = ni + 1
						local disp = "?"
						pcall(function ()
							if inf.textComponent ~= nil then disp = tostring(inf.textComponent.text) end
						end)
						print(string.format("PS-BG-INPUT #%d d%d name=%q text=%q display=%q",
							ni, depth, tostring(c.name), tostring(inf.text), disp))
					end
				end)
				pcall(function ()
					local txt = c:GetComponent(typeof(UnityEngine.UI.Text))
					if txt ~= nil and tostring(txt.text) ~= "" then
						nt = nt + 1
						if nt <= 40 then
							print(string.format("PS-BG-TEXT d%d name=%q = %q", depth, tostring(c.name), tostring(txt.text)))
						end
					end
				end)
				walk(c, depth + 1)
			end
		end
		walk(root, 0)
		print(string.format("PS-BG total inputs=%d texts=%d", ni, nt))
	end)
end

-- 本地服新增：把两个空闲控件改成账号 UI。initUI 与 showContinue 都要调一次——
-- showContinue 里官方会 setKrBtns(isDncMedia())=false 把 btnLogout 又藏回去。
function LoginBgPanel.psSetupAccountUI(self)
	Util.setActive(self.lblUID, true)
	Util.setActive(self.btnLogout, true)

	self.btnLogout.Text = "切换账号"

	self:onReceiveUID()
end

function LoginBgPanel.setKrBtns(self, show)
	Util.setActive(self.btnNotice, show)
	Util.setActive(self.btnCustom, show)
	Util.setActive(self.btnLogout, show)
end

function LoginBgPanel.getSprineResPath(self)
	return "UI/Login/Textures/login_bg"
end

function LoginBgPanel.onOpen(self, param)
	C_ApkLoading:Hide()
	self:showLoginPfBtns(SDKMgr.isDncMedia())
	self:showTencentBtns(SDKMgr.isTencent())

	if SDKMgr.isTencent() then
		if string.isNotEmpty(SystemConfig.GetExtCfg("TencentLogin")) and SystemConfig.GetExtCfg("IsReLoginLogout") ~= "true" then
			if SystemConfig.GetExtCfg("TencentLogin") == "WeiXin" then
				self:onClickBtnWX()
			else
				self:onClickBtnQQ()
			end
		end
	end

	SystemConfig.SaveExtCfg("IsReLoginLogout", "false")
	SystemConfig.SaveExtCfg()
	MingUIUtil.SetGroupAlpha(self.spGameStart.gameObject, 0)

	self.lblVersion.text = string.csformat("v{0}.{1}", SystemConfig.AppVersion, SystemConfig.ResVersion)
end

function LoginBgPanel.onGUI(self, cmd, param)
	if cmd == "showContinue" then
		self.fadeIndex = 0
		self.isLoopFade = true

		self:starFadeEffect()
		self:closeConnect()
		self:showTencentBtns(false)
		self:showLoginPfBtns(false)
		self:setKrBtns(SDKMgr.isDncMedia())

		if LoginModule.isCanEnterGame() then
			WindowsManager.initPanelMask()
			Util.setActive(WindowsManager.alertPanelMask, false)
			self:setParent(LayerManager.alertLayer, true)
			self:setSortingOrder(WindowsManager.alertPanelMaskCanvas.sortingOrder - 1)
		end

		self:psSetupAccountUI()
	elseif cmd == "connect" then
		self:addConnectEff()
	end
end

function LoginBgPanel.onReceiveUID(self)
	local acc = LoginMgr.getLoginAccount()

	if acc == nil or acc == "" then
		acc = "未登录"
	end

	self.lblUID.text = "账号：" .. acc
end

function LoginBgPanel.addConnectEff(self)
	if self.connectEff == nil then
		self.connectEff = EffectMgr.showUISpineKeep("P_ui_loading.a", self.tran, {
			localPosition = Vector2(0, 0, 0)
		}, true)
	end
end

function LoginBgPanel.removeConnectEff(self)
	if self.connectEff then
		self.connectEff:remove()

		self.connectEff = nil
	end
end

function LoginBgPanel.closeConnect(self)
	self:removeConnectEff()
end

function LoginBgPanel.starFadeEffect(self)
	if not self.isLoopFade then
		return
	end

	self.fadeIndex = self.fadeIndex + 1

	local this = self

	MingUIUtil.SetGroupAlphaInTime(self.spGameStart.gameObject, self.fadeIndex % 2 == 1 and 1 or 0, 1, Ease.Linear, function ()
		this:starFadeEffect()
	end)
end

function LoginBgPanel.stopFadeEffect(self)
	self.isLoopFade = false

	DOTween.Kill(self.spGameStart.transform, false)
end

function LoginBgPanel.showTencentBtns(self, show)
	Util.setActive(self.goTencent, show)
end

function LoginBgPanel.showLoginPfBtns(self, show)
	Util.setActive(self.goLoginPf, show)
end

function LoginBgPanel.onClickMainBg(self)
	-- 本地服修改：账号面板还开着（=还没选账号）时点背景什么都不做。
	-- 原逻辑会走 touchToContinue 的第一个分支 SDKModule.loginSDK()，而 smali 补丁让 SDK
	-- 立刻回调成功 → queryLoginServer → 带着空 uid 去握手，服务端只能回 succ=0（"uid 为空"），
	-- 客户端又不弹任何提示，表现成"点了没反应"。
	if LoginModule.isOpenLoginPanel and LoginModule.isOpenLoginPanel() then
		return
	end

	LoginModule.touchToContinue()
end

function LoginBgPanel.onClickBtnInherit(self)
	Dispatcher.dispatch(ModuleCommand.OPEN_BIND_MAIN_PANEL)
end

function LoginBgPanel.onClickBtnWX(self)
	SDKModule.loginTencentSDK("WeiXin")
	self:saveTencentLastLoginMode("WeiXin")
end

function LoginBgPanel.onClickBtnQQ(self)
	SDKModule.loginTencentSDK("QQ")
	self:saveTencentLastLoginMode("QQ")
end

function LoginBgPanel.onClickBtnGoogle(self)
	SDKModule.loginKoreanSDK(SDKConst.PF_GOOGLE)
end

function LoginBgPanel.onClickBtnFacebook(self)
	SDKModule.loginKoreanSDK(SDKConst.PF_FACEBOOK)
end

function LoginBgPanel.onClickBtnGuest(self)
	openLoginGusetPanel()
end

function LoginBgPanel.onClickBtnCustom(self)
	SDKModule.openKrCustom()
end

function LoginBgPanel.onClickBtnNotice(self)
	NoticeModule.gotoOpenMainPanel()
end

-- 本地服修改：原本是 SDKModule.logoutSDK()，改成「切换账号」
function LoginBgPanel.onClickBtnLogout(self)
	Alert.show(Alert.AlertVO.new({
		msg = "返回登录界面切换账号？\n当前进度已保存在服务器，随时可以再登回来。",
		showCloseBtn = false,
		isMaskClick = false,
		leftLabel = "取 消",
		rightLabel = "切换账号",
		rightHandle = function ()
			Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
		end
	}))
end

function LoginBgPanel.onClickBtnHelp(self)
	Dispatcher.dispatch(ModuleCommand.OPEN_SETTING_PANEL, SettingConst.TAB_HELP, true)
end

function LoginBgPanel.onClickUserProtoSimple(self)
	openProtoPanel()
end

function LoginBgPanel.saveTencentLastLoginMode(self, mode)
	SystemConfig.SaveExtCfg("TencentLogin", mode)
	SystemConfig.SaveExtCfg()
end

function LoginBgPanel.onRelease(self)
	local vo = ResPool.GetAssetVO(self:getSprineResPath())

	if vo then
		vo:Destroy()
	end
end
