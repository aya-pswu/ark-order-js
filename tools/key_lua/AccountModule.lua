module("AccountModule", package.seeall)
require("Modules.Account.AccountModuleAutoGen")
require("Modules.Account.AccountConst")
require("Modules.Account.AccountConfig")
require("Modules.Account.AccountMgr")

function initModule()
	registerModuleSocket("AccountModule")
	addMessageListener(ModuleCommand.OPEN_BIND_MAIN_PANEL, openBindMainPanel)
end

function continueLoginFlow(slot0)
	AccountMgr.setInheritName(slot0)

	SystemConfig.Account = LoginMgr.getLoginAccount()

	SystemConfig.SaveExtCfg()
	LoginModule.queryLoginServer()
end

function loginInherit()
	SDKMgr.setSdkState(SDKMgr.LOGIN_ING)
	SDKMgr.checkNoCallBackLogin()
	GameSendLose.SendLose(Main.LOSE_ACCOUNT_QUERRY)
	printWarning("___________________________________________________________[AccountModule.loginInherit()]" .. ("" .. "\n.AccountMgr.getBindUID(). --->" .. tostring(AccountMgr.getBindUID()) .. "\n.AccountMgr.isBindAccount(). --->" .. tostring(AccountMgr.isBindAccount()) .. "\n.AccountMgr.getBindUserName(). --->" .. tostring(AccountMgr.getBindUserName()) .. "\n.SDKMgr.getUserID(). --->" .. tostring(SDKMgr.getUserID()) .. "\n.SDKMgr.getUserName(). --->" .. tostring(SDKMgr.getUserName()) .. "\n.SDKMgr.getSessionID(). --->" .. tostring(SDKMgr.getSessionID()) .. "\n.SDKMgr.getTokenSecret(). --->" .. tostring(SDKMgr.getTokenSecret())))
	requireInheritName({
		uid = SDKMgr.getUserID(),
		token = SDKMgr.getSessionID(),
		tokenSecret = SDKMgr.getTokenSecret()
	})
end

function requireInheritName(slot0)
	WebHttp.AsynGet(AccountMgr.getUrl_GetAccount(slot0), function (slot0)
		print("___________________________________________________________[requireInheritName.111]" .. ("" .. "\n.jsonStr. --->" .. tostring(slot0) .. "\n.jsonStr:ToJson(). --->" .. tostring(slot0:ToJson())))

		slot0 = string.gsub(slot0:ToJson(), "null", "\"\"")

		print("___________________________________________________________[requireInheritName.222]" .. ("" .. "\n.jsonStr. --->" .. tostring(slot0)))

		slot3 = Util.jsonStrToTable(slot0)

		printTable(slot3, "_______________________________________________________________.requireInheritName.ttt")

		if slot3.ret == 1 then
			slot4 = slot3.data or {}
			AccountMgr.session_id = slot4.session_id

			AccountMgr.setInheritBindInfo(slot4.uid, slot4.user_name)
			AccountMgr.setInheritPassword(toint(slot4.set_password) > 0, slot4.set_password)
			continueLoginFlow(slot4.account_name)
			SDKMgr.setSdkState(SDKMgr.LOGIN_SUCC)
		elseif slot3.ret == 2 then
			-- Nothing
		elseif slot3.ret == 3 then
			openBindMainPanel("has_bind_finish")
		end

		if slot3.ret ~= 1 then
			SDKMgr.setSdkState(SDKMgr.LOGIN_FAIL)
		end

		if slot3.ret == 1 then
			GameSendLose.SendLose(Main.LOSE_ACCOUNT_LOGIN_SUCCESS)
		else
			GameSendLose.SendLose(Main.LOSE_ACCOUNT_LOGIN_NOT_SUCCESS)
		end
	end, function (slot0)
		print("___________________________________________________________[requireInheritName]" .. ("" .. "\n.jsonStr. --->" .. tostring(slot0) .. "\n.traceback.  --->\n" .. tostring(debug.traceback())))
		SDKMgr.setSdkState(SDKMgr.LOGIN_FAIL)
		GameSendLose.SendLose(Main.LOSE_ACCOUNT_QUERRY_FAIL)
	end)
end

function setBindPassword(slot0)
	GameSendLose.SendLose(Main.LOSE_ACCOUNT_PW_SET)
	WebHttp.AsynGet(AccountMgr.getUrl_SetBindAccount({
		bindCode = Md5Util.CreateMd5(slot0),
		bindCodeLen = #slot0
	}), function (slot0)
		slot1 = Util.jsonStrToTable(slot0:ToJson())

		printTable(slot1, "_______________________________________________________________.setBindPassword")

		if slot1.ret == 1 then
			AccountMgr.setInheritPassword(true, nil)
			AccountMgr.saveInheritPassword(uv0)
			Dispatcher.dispatch(ModuleCommand.ON_CHANGE_ACCOUNT_VIEW)
		elseif slot1.ret == 2 then
			-- Nothing
		elseif slot1.ret == 3 then
			-- Nothing
		end

		if string.isNotEmpty(slot1.msg) then
			Tips.addTips(slot2)
		end

		if slot1.ret == 1 then
			GameSendLose.SendLose(Main.LOSE_ACCOUNT_PW_SET_SUCCESS)
		else
			GameSendLose.SendLose(Main.LOSE_ACCOUNT_PW_SET_NOT_SUCCESS)
		end
	end, function (slot0)
		print("___________________________________________________________[setBindPassword]" .. ("" .. "\n.jsonStr. --->" .. tostring(slot0) .. "\n.traceback.  --->\n" .. tostring(debug.traceback())))
		GameSendLose.SendLose(Main.LOSE_ACCOUNT_PW_SET_FAIL)
	end)
end

function setBindAccount(slot0, slot1)
	GameSendLose.SendLose(Main.LOSE_ACCOUNT_BIND)
	WebHttp.AsynGet(AccountMgr.getUrl_BindAccount({
		accountName = slot0,
		bindCode = Md5Util.CreateMd5(slot1)
	}), function (slot0)
		slot1 = Util.jsonStrToTable(slot0:ToJson())

		printTable(slot1, "_______________________________________________________________.setBindAccount")

		slot2 = nil

		openBindResultPanel(slot1.ret == 1 and {
			titleStr = "※账户已成功引继！",
			contentStr = "",
			btnStr = "重新登录",
			onColseHandler = function ()
				Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
			end
		} or {
			titleStr = "账户引继失败！",
			contentStr = "※" .. slot1.msg,
			onColseHandler = function ()
				updateBindMainPanel("switch_view", "bindInheritView")
			end
		})
		updateBindMainPanel("switch_view", "hide")

		if slot1.ret == 1 then
			GameSendLose.SendLose(Main.LOSE_ACCOUNT_BIND_SUCCESS)
		else
			GameSendLose.SendLose(Main.LOSE_ACCOUNT_BIND_NOT_SUCCESS)
		end
	end, function (slot0)
		print("___________________________________________________________[setBindAccount]" .. ("" .. "\n.jsonStr. --->" .. tostring(slot0) .. "\n.traceback.  --->\n" .. tostring(debug.traceback())))
		GameSendLose.SendLose(Main.LOSE_ACCOUNT_BIND_FAIL)
	end)
end

function checkTwitterBindAccount()
	GameSendLose.SendLose(Main.LOSE_ACCOUNT_BIND)
	WebHttp.AsynGet(AccountMgr.getUrl_CheckThirdBind({
		uid = SDKMgr.getUserID()
	}), function (slot0)
		slot1 = Util.jsonStrToTable(slot0:ToJson())

		printTable(slot1, "_______________________________________________________________.checkTwitterBindAccount")

		slot2 = nil

		if slot1.ret == 1 then
			slot2 = {
				titleStr = "※账户已成功引继！",
				contentStr = "",
				btnStr = "重新登录",
				onColseHandler = function ()
					Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
				end
			}
		else
			slot2 = {
				titleStr = "※Twitter引继账号失败!",
				contentStr = "※" .. slot1.msg,
				onColseHandler = function ()
					closeAllPopupPanel()
				end
			}

			SDKModule.cancelAuthLogin(SDKConst.PF_TWITTER)
		end

		openBindResultPanel(slot2)
		updateBindMainPanel("switch_view", "hide")
	end, function (slot0)
		print("___________________________________________________________[checkTwitterBindAccount]" .. ("" .. "\n.jsonStr. --->" .. tostring(slot0) .. "\n.traceback.  --->\n" .. tostring(debug.traceback())))
	end)
end

function setTwitterBindAccount()
	GameSendLose.SendLose(Main.LOSE_ACCOUNT_BIND)
	WebHttp.AsynGet(AccountMgr.getUrl_ThirdBindAccount({
		uid = SDKMgr.getUserID(),
		userName = SDKMgr.getUserName(),
		accountName = AccountMgr.getInheritName()
	}), function (slot0)
		slot1 = Util.jsonStrToTable(slot0:ToJson())

		printTable(slot1, "_______________________________________________________________.setTwitterBindAccount")

		if slot1.ret == 1 then
			Tips.addTips("成功绑定Twitter账号")
			AccountMgr.setInheritBindInfo(SDKMgr.getUserID(), SDKMgr.getUserName())
			Dispatcher.dispatch(ModuleCommand.ON_CHANGE_ACCOUNT_VIEW)
		end

		slot2 = slot1.msg

		if slot1.ret ~= 1 and string.isNotEmpty(slot2) then
			Tips.addTips(slot2)
		end
	end, function (slot0)
		print("___________________________________________________________[setTwitterBindAccount]" .. ("" .. "\n.jsonStr. --->" .. tostring(slot0) .. "\n.traceback.  --->\n" .. tostring(debug.traceback())))
		GameSendLose.SendLose(Main.LOSE_ACCOUNT_BIND_FAIL)
	end)
end

function removeTwitterBindAccount()
	WebHttp.AsynGet(AccountMgr.getUrl_ThirdUnBindAccount({
		uid = SDKMgr.getUserID(),
		accountName = AccountMgr.getInheritName()
	}), function (slot0)
		slot1 = Util.jsonStrToTable(slot0:ToJson())

		printTable(slot1, "_______________________________________________________________.removeTwitterBindAccount")

		if slot1.ret == 1 then
			Tips.addTips("成功解除Twitter账号")
			AccountMgr.setInheritBindInfo(nil, nil)
			SDKModule.cancelAuthLogin(SDKConst.PF_TWITTER)
			Dispatcher.dispatch(ModuleCommand.ON_CHANGE_ACCOUNT_VIEW)
		end

		slot2 = slot1.msg

		if slot1.ret ~= 1 and string.isNotEmpty(slot2) then
			Tips.addTips(slot2)
		end
	end, function (slot0)
		print("___________________________________________________________[removeTwitterBindAccount]" .. ("" .. "\n.jsonStr. --->" .. tostring(slot0) .. "\n.traceback.  --->\n" .. tostring(debug.traceback())))
		GameSendLose.SendLose(Main.LOSE_ACCOUNT_BIND_FAIL)
	end)
end

function closeAllPopupPanel()
	closeBindMainPanel()
	closeBindResultPanel()
end

function disposeModule()
	onDispose()
end
