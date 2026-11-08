module("ErrorModule", package.seeall)

NetWaitPanel = class("NetWaitPanel", PopupPanel)
NetWaitPanel.resUrl = GameConfig.NET_WAIT_PANEL

function NetWaitPanel.init(slot0)
	slot0.maskLerp = 0

	NetWaitPanel.super.init(slot0)

	slot0.__autoDispose = false
	slot0.leftHandle = nil
	slot0.rightHandle = nil
	slot0.initOK = false
	slot0.isAlert = true
	slot0.__openSound = nil
	slot0.__closeSound = nil

	slot0:loadPrefab(GameConfig.NET_WAIT_PANEL)
end

function NetWaitPanel.initUI(slot0)
	slot0.eff1 = EffectMgr.showUISpineKeep("P_ui_loading.a", slot0.tran, {
		localPosition = Vector2(0, 0, 0)
	}, true)
end

function NetWaitPanel.open(slot0)
	-- 来源标记由 Net2 的 PS-NETWAIT-SOURCE 在调用栈内设置：
	-- "timeout" = ErrorMgr.checkSendBack（发出 tos 后 3 秒无任何 toc）
	-- nil       = SHOW_NET_WAIT（重连中）或 SDKMgr 直接打开
	slot0.psWaitSource = Net.psNetWaitSource

	slot0.super.open(slot0)
	slot0:setSortingOrder(LayerManager.getLayerSortingOrder(LayerManager.alertLayer) + 2)
	LoopManager.clearTimeout(slot0.keepTimeKey)

	slot0.keepTimeKey = LoopManager.setTimeout(function ()
		slot0:onTimeout()
	end, 10)
end

function NetWaitPanel.onOpen(slot0)
	Alert.close()
end

function NetWaitPanel.onTimeout(slot0)
	-- 单机服没有弱网（回环 TCP），面板出现 = 服务端没回包。判据不能只看 socket/心跳：
	-- 本地 TCP 下 hasSocket/stateIsConnecting 恒为真，而心跳是 C# shim 直答、不经过 node，
	-- 所以"心跳新鲜"完全不能说明业务面没卡住。
	--   · 来源=timeout ⇒ 一定是某个 tos 发出去 3 秒没等到任何 toc ⇒ 必须提示，不能静默吞掉；
	--   · 其它来源 ⇒ 保留原来的"连接已恢复就静默关闭"，防面板 prefab 异步打开导致的关闭竞态。
	local fromTimeout = (slot0.psWaitSource == "timeout")

	local healthy = false
	pcall(function()
		healthy = Net.hasSocket() and Net.stateIsConnecting()
			and (Time.GetTimestamp() - (NetHeartBeat.recieveHBTimestamp or 0)) < 15
	end)

	if healthy and not fromTimeout then
		print("<<<< NetWaitPanel.onTimeout 但连接健康（重连竞态），静默关闭 >>>>")
		closeNetWaitPanel()
		return
	end

	print("<<<< NetWaitPanel.onTimeout（来源=" .. tostring(slot0.psWaitSource)
		.. "，服务端未回包，socket=" .. tostring(Net.hasSocket()) .. "） >>>>")
	Alert.show(Alert.AlertVO.new({
		leftLabel = "返回登录",
		msg = "服务端未响应（本地服务没有回包）。请重启服务端后重试；若反复出现请上传日志。",
		showCloseBtn = false,
		isMaskClick = false,
		rightHandle = function ()
			Dispatcher.dispatch(ModuleCommand.SHOW_NET_WAIT)
			LoginModule.queryLoginServer(true)
		end,
		leftHandle = function ()
			Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
		end
	}))
end

function NetWaitPanel.onClose(slot0)
	LoopManager.clearTimeout(slot0.keepTimeKey)
end

-- ↓ 以下三个函数原先在明文重写时被漏掉（2026-10-22 由 lua_surface_diff.py 发现，
--   官方 bc 里存在）。缺 onMaskClick 的后果最严重：会继承 BasePanel.onMaskClick 的
--   `slot0:close()`，玩家点一下遮罩就把"网络等待"面板关掉，而 onClose 会清掉
--   keepTimeKey ⇒ 10 秒超时提示永不弹出，玩家停在"不转圈也没提示"的状态。

function NetWaitPanel.onPrerelease(slot0)
	LoopManager.clearTimeout(slot0.keepTimeKey)
	slot0:removeEff()
end

function NetWaitPanel.removeEff(slot0)
	if slot0.eff1 then
		slot0.eff1:remove()
	end

	if slot0.eff2 then
		slot0.eff2:remove()
	end

	slot0.eff1 = nil
	slot0.eff2 = nil
end

-- 官方是空实现：本面板用于"请求长时间无返回"，不允许点遮罩关闭（点了会误判为操作成功）
function NetWaitPanel.onMaskClick(slot0)
	return
end
