module("LoginModule", package.seeall)
require("Modules.Login.View.AutoGen.LoginBgPanelAutoGen")

function LoginBgPanel.open(slot0)
	slot0:setActive(true)

	slot0.panelBgmOnlyID = AudioManager.playBgmByOpenPanel(slot0.__cname) or slot0.panelBgmOnlyID
end

function LoginBgPanel.close(slot0)
	slot0:stopFadeEffect()
	slot0:closeConnect()
	slot0:setActive(false)
	AudioManager.stopAudio(slot0.panelBgmOnlyID)
end

function LoginBgPanel.initUI(slot0)
	slot0:setParent(LayerManager.uiHighLayer, true)

	slot0.texMainBg.Path = slot0:getSprineResPath()

	UIEventListener.AddClick(slot0.spMainBg.gameObject, selfHandler(slot0, "onClickMainBg"))
	Util.setActive(slot0.spIcon12, SDKMgr.isDncMedia() and not SDKMgr.isDncMedia18R())
	Util.setActive(slot0.spIcon18R, SDKMgr.isDncMedia18R())
	Util.setActive(slot0.spIcon18RR, SDKMgr.isDncMedia18R())
	Util.setActive(slot0.lblUID, AccountMgr.isUseInherit())
	Util.setActive(slot0.btnHelp, AccountMgr.isUseInherit())
	Util.setActive(slot0.btnInherit, AccountMgr.isUseInherit())
	slot0:setKrBtns(false)
	slot0:addMessageListener(ModuleCommand.ON_RECEIVE_UID, selfHandler(slot0, "onReceiveUID"))
	Dispatcher.dispatch(ModuleCommand.ON_RECEIVE_UID)

	if SystemConfigLua.isSimple() then
		Util.setActive(slot0.spLogo, false)
		Util.setActive(slot0.btnUserProtoSimple, true)
	else
		Util.setActive(slot0.spLogo, not SystemConfigLua.isJapanese())

		if SystemConfigLua.isKorean() then
			Util.setActive(slot0.spLogo, true)

			slot0.spLogo.Width = 316
			slot0.spLogo.Height = 190
		else
			slot0.spLogo:SetNativeSize()
		end
	end
end

function LoginBgPanel.setKrBtns(slot0, slot1)
	Util.setActive(slot0.btnNotice, slot1)
	Util.setActive(slot0.btnCustom, slot1)
	Util.setActive(slot0.btnLogout, slot1)
end

function LoginBgPanel.getSprineResPath(slot0)
	return "UI/Login/Textures/login_bg"
end

function LoginBgPanel.onOpen(slot0)
	C_ApkLoading:Hide()
	slot0:showLoginPfBtns(SDKMgr.isDncMedia())
	slot0:showTencentBtns(SDKMgr.isTencent())

	if SDKMgr.isTencent() then
		if string.isNotEmpty(SystemConfig.GetExtCfg("TencentLogin")) and SystemConfig.GetExtCfg("IsReLoginLogout") ~= "true" then
			if slot1 == "WeiXin" then
				slot0:onClickBtnWX()
			else
				slot0:onClickBtnQQ()
			end
		end
	end

	SystemConfig.SaveExtCfg("IsReLoginLogout", "false")
	SystemConfig.SaveExtCfg()
	MingUIUtil.SetGroupAlpha(slot0.spGameStart.gameObject, 0)

	slot0.lblVersion.text = string.csformat("v{0}.{1}", SystemConfig.AppVersion, SystemConfig.ResVersion)
end

slot0 = {
	"",
	".",
	"..",
	"..."
}
slot1 = 1

function LoginBgPanel.onGUI(slot0, slot1, slot2)
	if slot1 == "showContinue" then
		slot0.fadeIndex = 0
		slot0.isLoopFade = true

		slot0:starFadeEffect()
		slot0:closeConnect()
		slot0:showTencentBtns(false)
		slot0:showLoginPfBtns(false)
		slot0:setKrBtns(SDKMgr.isDncMedia())

		slot3 = LoginModule.isCanEnterGame()

		if slot0 then
			WindowsManager.initPanelMask()
			Util.setActive(WindowsManager.alertPanelMask, false)
			slot0:setParent(LayerManager.alertLayer, true)
			slot0:setSortingOrder(WindowsManager.alertPanelMaskCanvas.sortingOrder - 1)
		end
	elseif slot1 == "connect" then
		slot0:addConnectEff()
	end
end

function LoginBgPanel.onReceiveUID(slot0)
	slot0.lblUID.text = "UID：" .. LoginMgr.getLoginAccount()
end

function LoginBgPanel.addConnectEff(slot0)
	if slot0.connectEff == nil then
		slot0.connectEff = EffectMgr.showUISpineKeep("P_ui_loading.a", slot0.tran, {
			localPosition = Vector2(0, 0, 0)
		}, true)
	end
end

function LoginBgPanel.removeConnectEff(slot0)
	if slot0.connectEff then
		slot0.connectEff:remove()

		slot0.connectEff = nil
	end
end

function LoginBgPanel.closeConnect(slot0)
	slot0:removeConnectEff()
end

function LoginBgPanel.starFadeEffect(slot0)
	if not slot0.isLoopFade then
		return
	end

	slot0.fadeIndex = slot0.fadeIndex + 1

	MingUIUtil.SetGroupAlphaInTime(slot0.spGameStart.gameObject, slot0.fadeIndex % 2 == 1 and 1 or 0, 1, Ease.Linear, function ()
		uv0:starFadeEffect()
	end)
end

function LoginBgPanel.stopFadeEffect(slot0)
	slot0.isLoopFade = false

	DOTween.Kill(slot0.spGameStart.transform, false)
end

function LoginBgPanel.showTencentBtns(slot0, slot1)
	Util.setActive(slot0.goTencent, slot1)
end

function LoginBgPanel.showLoginPfBtns(slot0, slot1)
	Util.setActive(slot0.goLoginPf, slot1)
end

function LoginBgPanel.onClickMainBg(slot0)
	LoginModule.touchToContinue()
end

function LoginBgPanel.onClickBtnInherit(slot0)
	Dispatcher.dispatch(ModuleCommand.OPEN_BIND_MAIN_PANEL)
end

function LoginBgPanel.onClickBtnWX(slot0)
	SDKModule.loginTencentSDK("WeiXin")
	slot0:saveTencentLastLoginMode("WeiXin")
end

function LoginBgPanel.onClickBtnQQ(slot0)
	SDKModule.loginTencentSDK("QQ")
	slot0:saveTencentLastLoginMode("QQ")
end

function LoginBgPanel.onClickBtnGoogle(slot0)
	SDKModule.loginKoreanSDK(SDKConst.PF_GOOGLE)
end

function LoginBgPanel.onClickBtnFacebook(slot0)
	SDKModule.loginKoreanSDK(SDKConst.PF_FACEBOOK)
end

function LoginBgPanel.onClickBtnGuest(slot0)
	openLoginGusetPanel()
end

function LoginBgPanel.onClickBtnCustom(slot0)
	SDKModule.openKrCustom()
end

function LoginBgPanel.onClickBtnNotice(slot0)
	NoticeModule.gotoOpenMainPanel()
end

function LoginBgPanel.onClickBtnLogout(slot0)
	SDKModule.logoutSDK()
end

function LoginBgPanel.onClickBtnHelp(slot0)
	Dispatcher.dispatch(ModuleCommand.OPEN_SETTING_PANEL, SettingConst.TAB_HELP, true)
end

function LoginBgPanel.onClickUserProtoSimple(slot0)
	touchToContinue.LoginModule()
end

function LoginBgPanel.saveTencentLastLoginMode(slot0, slot1)
	SystemConfig.SaveExtCfg("TencentLogin", slot1)
	SystemConfig.SaveExtCfg()
end

function LoginBgPanel.onRelease(slot0)
	if ResPool.GetAssetVO(slot0:getSprineResPath()) then
		slot1:Destroy()
	end
end
