module("Net", package.seeall)

STATE_CONNECT_FAIL = 0
STATE_CONNECTED = 1
STATE_CONNECT_TIMEOUT = 2
STATE_SEND_FAIL = 3
STATE_SERVER_CLOSE = 4
STATE_CLIENT_CLOSE = 5
STATE2STRING = {
	"STATE_CONNECT_FAIL",
	"STATE_CONNECTED",
	"STATE_CONNECT_TIMEOUT",
	"STATE_SEND_FAIL",
	"STATE_SERVER_CLOSE",
	"STATE_CLIENT_CLOSE"
}
hasLogin = false

-- 顶层 local（与字节码 slot0..slot16 一一对应，upvalue 映射已从 UV 表实证）
local socket = nil               -- slot0
local curStatus = nil            -- slot1
local canReconnect = false       -- slot2
local isConnecting = false       -- slot3
local isBGP = false              -- slot4
local loginMaxReconnTime = 20     -- slot5
local guestMaxReconnTime = 15     -- slot6
local maxReconnCount = 4         -- slot7
local reconnStateNormal = 1      -- slot8
local reconnStateWait = 2        -- slot9
local unused3 = 3                -- slot10（未被本文件函数引用，保留初始化）
local unused4 = 4                -- slot11
local reconnStatePending = 5     -- slot12
local reconnStateManual = 6      -- slot13
local reconnCount = 0            -- slot14
local alwaysTrue = true          -- slot15
local reconnState = reconnStateNormal -- slot16
isReconnect = false

function hasSocket()
	return socket ~= nil
end

function initSocket()
	canReconnect = true

	if socket == nil then
		socket = NetSocket()

		socket:InitFuncs(unpackdate, onChangeNetStatus)
	end
end

function start(ip, port)
	initSocket()

	isConnecting = true

	socket:Connect(ip, tonumber(port))
end

function getSocketConnectID()
	if socket then
		return socket.connectID
	end

	return 0
end

function onChangeNetStatus(statusArg)
	if Util.isNil(socket) or LoginModule.isRelogin then
		return
	end

	local newStatus = tonumber(statusArg:ToInt())

	printWarning("Lua收到Socket状态:" .. STATE2STRING[newStatus + 1])

	if curStatus == newStatus then
		printWarning("网络状态未改变")

		return
	end

	curStatus = newStatus

	if isConnecting then
		if newStatus == STATE_CONNECTED then
			isConnecting = false

			socket:StartRecive()
			startGameLogic()
			startCount()

			NetHeartBeat.recieveHBTimestamp = Time.GetTimestamp()
		elseif newStatus == STATE_CONNECT_FAIL then
			onDisconnect()
		elseif newStatus == STATE_CONNECT_TIMEOUT then
			onDisconnect()
		else
			printWarning("Socket当前的连接尚未返回，忽略此次处理")
		end
	elseif newStatus == STATE_SERVER_CLOSE then
		LoginMgr.canReQueryLoginServer = true

		onDisconnect()
	elseif newStatus == STATE_SEND_FAIL then
		onDisconnect()
	else
		printWarning("Socket尚未建立连接,无法处理")
	end
end

function stateIsConnecting()
	return curStatus == STATE_CONNECTED
end

function offReconnect()
	Dispatcher.dispatch(ModuleCommand.OFF_RECONNECT)

	canReconnect = false
end

function recoverReconnect()
	canReconnect = true
end

function getCanReconnect()
	return canReconnect
end

function close(showTip)
	if showTip then
		canReconnect = false

		Dispatcher.dispatch(ModuleCommand.HIDE_NET_WAIT)
	end

	curStatus = nil
	reconnState = reconnStateNormal

	if socket ~= nil then
		socket:Close()
	end

	NetHeartBeat.closeHB()

	loginCom = false
end

function startGameLogic()
	Alert.close()
	Dispatcher.dispatch(ModuleCommand.HIDE_NET_WAIT)

	if isBGP then
		sendBGP()
	end

	LoginMgr.resetIPIndex(true)
	Dispatcher.dispatch(ModuleCommand.CONNECT_SUCCESS, hasLogin)
	reSetReconn()
end

function onDisconnect()
	isConnecting = false

	onReconn()
end

function startCount()
	NetHeartBeat.openHB()
	LoopManager.addToSecond("Net.checkIsNeedReConn", checkIsNeedReConn)
end

function send(data)
	if socket ~= nil then
		socket:Send(data)
	end
end

function encryptAndSend(comp, data, encrypt)
	if encrypt == nil then
		encrypt = true
	end

	if socket ~= nil then
		socket:EncryptAndSend(comp, data, encrypt)
	end
end

function sendHB()
	if socket and reconnState == reconnStateNormal then
		socket:SendHB()
	end
end

function recieveHB(serverTime)
	NetHeartBeat.updataHBTimestamp(true)

	GlobalData.serverTime = serverTime
end

function onInitReconn()
	reconnState = reconnStateNormal
end

function checkOnSendProto()
	psInstallHelperGroupPatch()
	psInstallFightSidePatch()
	psInstallAutoMovePatch()
	psInstallAutoBattlePatch()
	psInstallServantRemovePatch()
	psInstallFameCountResetPatch()
	psInstallHandbookDialoguePatch()
	psInstallHandbookLangUnlockPatch()
	psInstallBreakAutoFilterPatch()
	psInstallBagServantLockPatch()
	psInstallTowerRecoverBoolPatch()
	psInstallNetWaitSourcePatch()
	psInstallPlanPanelRefreshPatch()
	psInstallUrielTalentNoticePatch()
	psInstallNoticeOncePatch()
	psInstallRelicEnchantUnitsPatch()
	psInstallExCopyTimesPatch()
	psInstallMysteryGiftCanUsePatch()
	psInstallSkinLive2dSetPatch()

	if curStatus ~= STATE_CONNECTED and canReconnect and alwaysTrue then
		reconnState = reconnStateManual

		Dispatcher.dispatch(ModuleCommand.SHOW_NET_WAIT)
		close()
		reStart()
	end
end

function getMaxReconnTime()
	if loginCom then
		return loginMaxReconnTime
	else
		return guestMaxReconnTime
	end
end

function checkIsNeedReConn()
	if canReconnect and alwaysTrue and reconnState ~= reconnStatePending and getMaxReconnTime() < Time.GetTimestamp() - NetHeartBeat.recieveHBTimestamp then
		if reconnCount < maxReconnCount then
			reconnState = reconnStatePending

			if reconnCount == 0 then
				onReconn(true)
			else
				Alert.show(Alert.AlertVO.new({
					leftLabel = "返回登录",
					msg = "当前网络较差，长时间无响应，请检查网络状态，点击确定尝试重新连接",
					showCloseBtn = false,
					isMaskClick = false,
					rightHandle = function ()
						onReconn(true)
					end,
					leftHandle = function ()
						Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
					end
				}))
			end
		else
			reconnState = reconnStateManual

			onReconn(true)
		end
	end
end

function onReconn(manual)
	if canReconnect == false or manual ~= true and reconnState == reconnStatePending then
		return
	end

	close()

	if reconnCount < maxReconnCount then
		reconnState = reconnStateWait

		if manual then
			if reconnCount ~= 0 then
				Dispatcher.dispatch(ModuleCommand.SHOW_NET_WAIT)
			end

			reconnState = reconnStateManual
			reconnCount = reconnCount + 1
			NetHeartBeat.recieveHBTimestamp = Time.GetTimestamp() - loginMaxReconnTime + 5
		end

		reStart()
	else
		close(true)
		Alert.show(Alert.AlertVO.new({
			showLeftBtn = false,
			showCloseBtn = false,
			rightLabel = "返回登录",
			msg = "亲，你暂时与服务器失去了连接……\n请返回重新登录",
			isMaskClick = false,
			rightHandle = function ()
				Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
			end
		}))

		LoginMgr.canReQueryLoginServer = true

		GameSendLose.SendHttpLog("", "1")
	end
end

function reStart()
	canReconnect = true

	if LoginMgr.hasFindIPIndex() then
		canReconnect = false

		LoopManager.removeFromSecond("Net.checkIsNeedReConn")
		LoginModule.queryLoginServer(true)
	elseif LoginMgr.isOverRound() and isReconnect == false then
		Alert.show(Alert.AlertVO.new({
			leftLabel = "返回登录",
			msg = "当前网络较差，尝试连接服务器失败，请检查网络状态，点击确定尝试重新连接",
			showCloseBtn = false,
			isMaskClick = false,
			rightHandle = function ()
				LoginModule.queryLoginServer()
			end,
			leftHandle = function ()
				Dispatcher.dispatch(ModuleCommand.RE_LOGIN)
			end
		}))
	else
		local ip, port, bgp = LoginMgr.changeIP()
		isBGP = bgp

		printWarning("[登录]再次连接服务器：" .. ip .. ":" .. port .. "   isBGP = " .. tostring(bgp))
		start(ip, port)
	end
end

function sendBGP()
	local proto = Message.createProto("m_bgp_login_tos")
	proto.id = 10501
	proto.host = LoginMgr.ip
	proto.port = LoginMgr.port

	Net.sendProto(proto, false, true)
end

function reSetReconn()
	reconnState = reconnStateNormal
	reconnCount = 0
end

-- ============================================================
-- 本地服修改（2026-09-13 七十）：助手（看板娘）组系统修复。
-- 现网客户端 RoleMgr.updateHelpGroup 是空函数（bc 原件即被 28 个 RET0 填充），
-- 组表（getHelpGroup/getGroupList 的 upvalue，文件局部 TNEW 空表）永远无人写入：
--   "更换助手"恒显 0/5、勾选/取消勾选无反应、主页切换按钮失灵。
-- 这里在 RoleMgr 模块表上**整体接管**组状态（自带存储 psGroup，不依赖被打空的 upvalue）：
--   updateHelpGroup(help_list)  存组 + helper=组首位/helperHandBookTime/helperFeeling（官方语义照抄）
--   getHelpGroup/getGroupList/getNewGroupList  读自有存储（语义照抄 lua_src 反编译）
-- 服务器按"更换助手勾选 ≤5 只、当前看板娘排首位"下发（server/lib.js helperOrderIds）。
-- 安装时机：checkOnSendProto 每次发包时懒安装（此时强制 require RoleMgr，必然已就绪）；
-- 首次发包在登录 auth 之前，早于 m_role_detail_toc（GlobalData.initData 会用它建组）。
local psHelperInstalled = false

function psInstallHelperGroupPatch()
	if psHelperInstalled then
		return
	end

	pcall(require, "Modules.Role.RoleMgr")

	if type(RoleMgr) ~= "table" or type(RoleMgr.getHelpGroup) ~= "function" then
		return
	end

	psHelperInstalled = true

	local psGroup = {}

	function RoleMgr.updateHelpGroup(slot0)
		psGroup = {}
		local n = 0

		for _, v in ipairs(slot0 or {}) do
			n = n + 1
			psGroup[n] = v
		end

		RoleMgr.helper = (psGroup[1] and psGroup[1].id) or RoleMgr.helper or 0
		RoleMgr.helperHandBookTime = (psGroup[1] and psGroup[1].gain_time) or -1
		RoleMgr.helperFeeling = (psGroup[1] and psGroup[1].feeling) or 0
		print("PS-HELPER-GROUP n=" .. tostring(n) .. " helper=" .. tostring(RoleMgr.helper))
	end

	function RoleMgr.getHelpGroup()
		return psGroup
	end

	function RoleMgr.getGroupList()
		local t = {}

		for _, v in ipairs(psGroup) do
			table.insert(t, v.id)
		end

		return t
	end

	function RoleMgr.getNewGroupList(slot0, slot1)
		local t = RoleMgr.getGroupList()

		if slot1 then
			if not table.isExist(t, slot0) then
				table.insert(t, slot0)
			end
		elseif table.isExist(t, slot0) then
			table.removeItem(t, slot0)
		end

		return t
	end

	print("PS-HELPER-PATCH-INSTALLED")
end

-- ============================================================
-- 本地服修改（2026-10-18）：战斗中特性飘字/特效显示在错误一侧。
--
-- 现象（真机 + 用户反馈）：布里欧纳克、狼人「野性克制」等受击触发的被动，
--   属性确实加到己方（战斗情报倍率会变），但**飘字与特效出现在敌方身上**。
--
-- 根因（bc 实证 FeatureLoop.showFeature:88）：
--   slot3 = SceneUnitManager.GetUnit(src_servant_id) ~= nil and FightMgr.isLeftID(unit.id)
--   slot3 为真 → leftTips（左侧/我方），否则 → rightTips（右侧/敌方）。
-- 而 FightMgr.isLeftID 只认官方小 id 段：
--   TAR_LEFT_ASSIST(5001)=true / TAR_RIGHT_ASSIST(7001)=false /
--   1~1999=true(左) / 2001~3999=false(右)，其余**无 return（nil）**。
-- 本服战斗单位 id 是我方 90000001+、敌方 60000001+，**都不在任何区间** → 恒 nil → 恒右侧。
--
-- 修法：覆盖 isLeftID，在原有语义之后补 9 位 id 判定：
--   我方 90000000~99999999 → true；敌方 60000000~69999999 → false。
--   其余仍按原实现（含末尾 nil），保证官方 id 段行为不变。
local psFightSidePatched = false

function psInstallFightSidePatch()
	if psFightSidePatched then
		return
	end

	pcall(require, "Modules.Fight.FightMgr")

	if type(FightMgr) ~= "table" or type(FightMgr.isLeftID) ~= "function" then
		return
	end

	psFightSidePatched = true

	local psOrigIsLeftID = FightMgr.isLeftID

	function FightMgr.isLeftID(id)
		local v = psOrigIsLeftID(id)

		if v ~= nil then
			return v
		end

		-- 本服扩展段：我方 9 位 / 敌方 6 位（见 server/handlers/map_fight.js mkAllyUnit/mkEnemyUnit）
		local n = tonumber(id)

		if not n then
			return nil
		end

		if n >= 90000000 and n <= 99999999 then
			return true
		end

		if n >= 60000000 and n <= 69999999 then
			return false
		end

		return nil
	end

	print("PS-FIGHT-SIDE-PATCH-INSTALLED")
end

-- ============================================================
-- 本地服修改（2026-10-20）：战斗收尾 vs 特性致死延时 Remove 的「同一对象二次入池」。
--
-- 现象（用户 `孤灯长夜` 真机日志 23:36:55:259）：
--   `SceneUnitPool.servantPool对象池重复加了东西:未知url(它是userdata)`
--   调用栈 ObjectPool.release ← SceneUnitPool.RecycleServant ← Servant.onRemove
--          ← SceneUnit.Remove ← Servant.Remove ← FeatureLoop 匿名回调 ← LoopManager 定时器
--
-- 根因（纯时序，与掉落/资源无关；FeatureLoop.lua:321-334 实证）：
--   特性伤害（change_type=HP）打死单位时走
--     `Die() → dieRemove() → Util.autoTimeout(self, function() self:Remove() end, 0.5/FightMgr.speed)`
--   `Util.autoTimeout` 只在**以同一 key 再次调用时**取消上一个定时器，**`Servant.Remove`
--   自己从不取消**（Util 的 uv0 是文件局部弱键表，只有 autoTimeout/clearAutoTimeout 能写）。
--   于是：
--     ① 55.238s 定时器到点 → Remove → RecycleServant → 入池（此时已 SetVisible(false)）
--     ② 同一帧或更早，`FightModule.m_fight_batch_end` 已把 `servantDic` 全员 Remove 过一遍
--     ③ 第二次 Remove 再走 RecycleServant → ObjectPool.release 命中 m_Items 重复项 → printError
--   `未知url(它是userdata)` 是 ObjectPool.lua:94 的老文案：Servant 没有 url 字段，
--   `type(slot1)=="table" and slot1.url` 取到 nil → 落到字符串后半句，与 userdata 无关。
--   真危害不是这行日志，而是：池容量 10、跨战斗复用；若第二次 Remove 落在对象已被下一场
--   战斗取回之后，会把**活着的**单位回收走（表现为单位消失/打空气）。
--
-- 修法（替换面最小，两道一起上）：
--   A. `Servant.Remove` 入口先 `Util.clearAutoTimeout(self)` —— 把还挂着的死亡延时 Remove 取消掉。
--      **只对 class==Servant 的实例**生效：OutServant/RoomDieServant 是「场外誓灵」，
--      走各自的 Remove 链（RoomDieServant.super.Remove 也是本表函数），
--      它们的 onRemove 不回收进 servantPool；但同一实例会被反复出场复用，
--      在这里取消定时器属于无意义副作用，故按 class 精确排除。
--   B. 入池口幂等：`SceneUnitPool.RecycleServant` 对同一实例只放行一次（`__psRecycled`），
--      `GetServant` 取回时清标记。A 挡不住的反向顺序（定时器先到、批次收尾后到）
--      由 B 兜底；FightLoop.dieRemoveTrue 里另有一条 `setTimeout → slot1:Remove()`
--      同类路径也被 B 覆盖。
--   ⚠️ 不能只做 A：`FeatureLoop.stop` 清的是自己的 `timeOutDic`，清不到 Util 里那张表；
--      也不能只做 B：只拦日志不拦「对象已被下一场取回后又被回收」的实质破坏（池容量 10、跨战斗复用）。
--   安装时机：与既有补丁同点（checkOnSendProto 懒安装，此时 ModuleFactory.initModule 已跑完，
--   SceneModule 必然已加载；require 命中缓存，无重复副作用）。
local psServantRemovePatched = false

function psInstallServantRemovePatch()
	if psServantRemovePatched then
		return
	end

	pcall(require, "Modules.Scene.SceneModule")
	pcall(require, "Core.Utils.Util")
	pcall(require, "Modules.Scene.Mgr.SceneUnitPool")

	local SM = rawget(_G, "SceneModule")
	local P = rawget(_G, "SceneUnitPool")

	if type(SM) ~= "table" or type(SM.Servant) ~= "table" then
		return
	end

	local S = SM.Servant

	if type(S.Remove) ~= "function" then
		return
	end

	if type(Util) ~= "table" or type(Util.clearAutoTimeout) ~= "function" then
		return
	end

	if type(P) ~= "table" or type(P.RecycleServant) ~= "function" or type(P.GetServant) ~= "function" then
		return
	end

	psServantRemovePatched = true

	local psOrigRemove = S.Remove
	local psOrigRecycle = P.RecycleServant
	local psOrigGetServant = P.GetServant

	-- 只认战斗单位实例（OutServant / RoomDieServant 的 class 不是 S）
	local function isBattleServant(u)
		return type(u) == "table" and rawget(u, "class") == S
	end

	-- A：Remove 入口取消死亡延时 Remove
	function S.Remove(self, ...)
		if isBattleServant(self) then
			-- Util 的 uv0 是文件局部弱键表，clearAutoTimeout 是唯一合法取消口
			pcall(Util.clearAutoTimeout, self)
		end

		return psOrigRemove(self, ...)
	end

	-- B1：入池幂等（同一实例只入池一次；已被回收过就直接返回）
	function P.RecycleServant(unit)
		if isBattleServant(unit) then
			if rawget(unit, "__psRecycled") then
				print("PS-SERVANT-DUP-RECYCLE-SKIP id=" .. tostring(rawget(unit, "id")))
				return
			end

			rawset(unit, "__psRecycled", true)
		end

		return psOrigRecycle(unit)
	end

	-- B2：从池里取回时清标记（同一实例会被下一场战斗复用）
	function P.GetServant()
		local obj = psOrigGetServant()

		if isBattleServant(obj) then
			rawset(obj, "__psRecycled", nil)
		end

		return obj
	end

	print("PS-SERVANT-REMOVE-PATCH-INSTALLED")
end

	-- ============================================================
	-- 本地服修改（2026-10-18 一百九十复盘）：「放弃战斗」回小地图后自动寻敌被重新打开。
	--
	-- 现象（真机 + 用户反馈）：自动寻敌接敌 → 暂停 → 放弃战斗 → 回到小地图，
	--   自动寻敌仍然开着，立刻又扑向下一只怪，陷入"打→放弃→再打"的死循环。
	--
	-- ⚠️ 本函数的上一版（psQuitFightReturn 包装 m_fight_cancel_toc）是**死补丁**，已删除：
	--   FightModule.m_fight_cancel_toc 在模块初始化时已被 Net.registerSocketHandler
	--   按函数值捕获（指南 A3：m_*_toc handler 运行期换模块表字段静默无效），包装层
	--   永远不会被执行。当年"探针证明 pause_toc 的 uv0 与 onMapEnterToc 的 uv0 不是
	--   同一变量"的结论同样因此作废——探针对 pause_toc 的包装也没跑（设备日志
	--   PS-AUTOMOVE pause_toc 出现 0 次），它根本没观测到。2026-10-18 反汇编复核：
	--   onMapEnterToc（proto99）与 m_map_pause_toc（proto63）捕获的是 main 块同一个
	--   slot0，就是同一变量。
	--
	-- 修复改为**服务端三连包**（map_fight.js m_fight_cancel_tos）：
	--   pause_toc(1) → enter_toc → pause_toc(0)。TCP 有序性保证这三包排在客户端自己
	--   发的 pause(0) 回包之前（客户端只能收到 cancel_toc 后才发 pause(0)），因此
	--   onMapEnterToc 处理 enter_toc 时 uv0==1，走"从战斗进入的地图"分支，
	--   isInAutoMove 保持 FightModule.m_fight_cancel_toc 已置的 false。客户端无需补丁。
	--
	-- 这里保留一道**可验证性**防线：懒安装时 hook Net.registerAckHand 的注册点
	-- （ErrorModule.sendTos 是每个 tos 发送前的真实回调，按函数值捕获，re-register
	-- 是唯一合法写入口），打一条一次性日志，用于真机确认补丁包版本与 pause 链路。
	local psAutoMoveProbeInstalled = false

	function psInstallAutoMovePatch()
		if psAutoMoveProbeInstalled then
			return
		end

		pcall(require, "Modules.Error.ErrorModule")
		pcall(require, "Core.Net.Net")

		local EM, N = ErrorModule, Net

		if type(EM) ~= "table" or type(EM.sendTos) ~= "function"
			or type(N) ~= "table" or type(N.registerAckHand) ~= "function" then
			return
		end

		psAutoMoveProbeInstalled = true

		local origSendTos = EM.sendTos

		-- registerAckHand 写的是 sendProto/resultHandler 捕获的那对 upvalue（bc 实证：
		-- registerAckHand(slot0, slot1) → uv0=slot0, uv1=slot1），重新注册是合法写入口。
		N.registerAckHand(function(proto, data)
			if proto and proto.classname == "m_fight_cancel_tos" then
				print("PS-CANCEL-SENT auto=" .. tostring(AdventureMgr.isInAutoMove))
			end

			return origSendTos(proto, data)
		end, function(toc, ack)
			-- recieveToc 原样透传（ErrorMgr.updateLastSendTos(0) 语义保持）
			return EM.recieveToc(toc, ack)
		end)

		print("PS-AUTOMOVE-PATCH-INSTALLED")
	end



-- ═══════════════════════════════════════════════════════════════════════════
-- PS-AUTOBATTLE（2026-10-22 二百一十）：自动寻敌开战时默认开启自动战斗
--
-- 症状（真机 2026-10-22 05:01，本关是已通关重进的 1-3）：
--   进图 → 自动寻敌走到第一只怪 → 计划面板自动倒计时开战；
--   但战斗里"自动"是**关**的，第一次必须手点，点过之后本关后续战斗才会自动。
--   日志侧证：第一场 `m_fight_servant_start_tos 05:01:08` → 第一次
--   `m_fight_skill_select_tos 05:03:28`（140 秒）；手点之后第 2/3/4 场都是 2~5 秒。
--
-- 根因（bc 实证）：`FightMgr.autoFight` 是**纯客户端会话级变量**，初值 false；
--   只有两处会写它：
--     · `FightNavView.OnAuto`（战斗 UI 的"自动"开关，dispatch ON_FIGHT_AUTO）
--     · `CopyPlanPanel.onAuto`（布阵面板 togAuto，dispatch ON_FIGHT_AUTO_STATE）
--   自动寻敌的"自动开战"分支 `CopyPlanPanel.checkCountDown`
--   （`if AdventureMgr.isInAutoMove and table.isExist(白名单, copyType)`）
--   只调 `CopyMgr.setAutoSkip(true)` 跳过倒计时，**完全不碰 autoFight**。
--   官服的"便捷设置" `CfgCopyActivity.isAutoFight` 只覆盖活动副本，主线没有默认值。
--   ⇒ 每次客户端重启后第一次进图，即便自动寻敌替你开战，战斗仍是手动。
--
-- 修法：包 `CopyMgr.setAutoSkip`（唯一的"自动开战"信号，仅 CopyPlanPanel 调用；
--   调用点是 `CopyMgr.setAutoSkip(...)` 按名解析 → 运行期可包，A3 不适用）。
--   `setAutoSkip(true)` 且 `AdventureMgr.isInAutoMove` 为真时，把
--   `FightMgr.autoFight` 置 true；随后 `onFightLoopEnd2` 走 `autoSelSkill()`。
--   门控：`GuideModule.isFinish(GUIDE_AUTO_FIGHT)`（1-3 才开放自动战斗），
--   未完成时保持原样，避免打断新手引导。
--
-- 取舍：自动寻敌 = 自动刷，玩家若在战斗里手动关掉自动，下一场"自动开战"仍会再打开；
--   想全程手动请先取消小地图上的"搜寻敌人"（那是 autoFight 的上游开关）。
-- ═══════════════════════════════════════════════════════════════════════════
local psAutoBattleInstalled = false

function psInstallAutoBattlePatch()
	if psAutoBattleInstalled then
		return
	end

	pcall(require, "Modules.Copy.CopyMgr")
	pcall(require, "Modules.Fight.FightMgr")
	pcall(require, "Modules.Adventure.AdventureMgr")

	local CM, FM, AM = CopyMgr, FightMgr, AdventureMgr

	if type(CM) ~= "table" or type(CM.setAutoSkip) ~= "function"
		or type(FM) ~= "table" or type(AM) ~= "table" then
		return
	end

	psAutoBattleInstalled = true

	local origSetAutoSkip = CM.setAutoSkip

	CM.setAutoSkip = function(v)
		origSetAutoSkip(v)

		-- 只认"自动寻敌决定替你开战"这条路径；false（每次 checkCountDown 开头）直接忽略
		if v and AM.isInAutoMove and FM.autoFight ~= true then
			local ok, ready = pcall(function()
				return GuideModule.isFinish(GuideConst.GUIDE_AUTO_FIGHT)
			end)
			if ok and ready then
				FM.autoFight = true
				print("PS-AUTOBATTLE-ON")
			end
		end
	end

	print("PS-AUTOBATTLE-PATCH-INSTALLED")
end



-- ═══════════════════════════════════════════════════════════════════════════
-- PS-FAME-COUNT-RESET（2026-10-19 一百九十六）
--
-- 症状：拆卡/破除/能源转换后弹
--   `toc协议报错：m_servant_type_fame_update_toc
--    Modules/ServantAltar/VO/ServantAltarDetailVO:0: attempt to index a nil value`
-- 根因不在祭坛，在 ServantMgr 的「类型计数表」被全量 brief 反复累加：
--   · `initServantInfo` 的 3 个 upvalue 是 [slot3=size, slot0=实例列表, slot2=实例字典]
--     —— 只 TNEW 了列表和字典，**类型计数表 slot1 原样保留**（UV 表实证）；
--   · `addServant` 末尾 `uv2[type] = uv2[type] + 1` 是**无条件**的（uv2 → slot1）；
--   · `removeServant` 只减 1（且仅当实例存在）。
--   ⇒ 每多收到一次全量 m_servants_brief_toc，每个 type 的计数就再 +N（N=该 type 实例数），
--     实例列表却只有 1 份。删掉某 type 的最后一只后，计数仍 >0 →
--     `ServantAltarDetailVO.updateRankList` 里 `getTopLevelServant(type).level` 索引 nil 崩，
--     此后每条 fame 推送都崩（重登才自愈）。
--
-- 为什么会反复收到全量 brief：客户端**切后台回前台**时 SettingModule → Net2.onReconn 会主动
-- 重连（日志里 [SDK]enterForegroundSDK 紧跟 connectID+1），服务端 conn 是新的
-- （servantsBriefSent 是连接级状态）→ 再发一次全量。一次会话 4 次连接 = 计数 ×4。
--
-- 修法：在 initServantInfo 重建之前把计数表清零（键保留、值归零），随后 addServant
-- 按真实实例数重建。`getServantTypeDic()` 返回的就是这张表（0 参 UGET slot1，与
-- addServant 的 uv2 同槽），消费方 `if slot6 > 0` 不会看到清零残留。
--
-- ⚠️ 2026-10-21 改：**从文件顶层 `do` 块改为懒安装**（`checkOnSendProto` 调用）。
--   原因（真机实证）：10-20 02:35 的包帧里已含本段（解压核对 12 处），但 10-21 00:27
--   日志里既没有 `clear=` 也没有 `FAILED` —— 顶层块在 Lua 模块加载早期执行，那时
--   `require("Modules.Servant.ServantMgr")` 未必就绪 / module() 语义未必如预期，
--   而**加载期的 print 在客户端日志里根本抓不到**（日志系统还没起来），失败是完全静默的。
--   同文件其余三个补丁都由 checkOnSendProto 懒安装，日志里 `PS-*-INSTALLED` 稳定出现
--   —— 跟着它们的时机装，才可观测、可验证。
--   另：`require` 取不到模块时回落全局 `ServantMgr`（`module()` 注册的就是全局名）。
-- ═══════════════════════════════════════════════════════════════════════════
-- ---- PS-NETWAIT-SOURCE：区分「请求超时」与「重连等待」两种面板来源 --------------
-- 单机服没有弱网：面板弹出来 = 发出去的 tos 3 秒内没收到**任何** toc（服务端没回包）。
-- 但 SHOW_NET_WAIT（重连中）和 SDKMgr 也会开同一个面板，那时不该报"服务端未响应"。
-- 三个入口里只有 ErrorMgr.checkSendBack 是**按名解析** ErrorModule.openNetWaitPanel，
-- 另两个走注册时捕获的旧函数值（A3 死钩子）⇒ 在模块表上包一层就能精确区分。
-- 标记必须挂 Net 模块表（module() 的 setfenv 让裸名写的是模块表，不是 _G）。
local psNetWaitSourceInstalled = false

function psInstallNetWaitSourcePatch()
	if psNetWaitSourceInstalled then
		return
	end

	local EM = nil
	local okReq, mod = pcall(require, "Modules.Error.ErrorModule")
	if okReq and type(mod) == "table" and type(mod.openNetWaitPanel) == "function" then
		EM = mod
	elseif type(ErrorModule) == "table" and type(ErrorModule.openNetWaitPanel) == "function" then
		EM = ErrorModule
	end

	if EM == nil then
		print("PS-NETWAIT-SOURCE skip: ErrorModule.openNetWaitPanel 不可用（req=" .. tostring(okReq) .. "）")
		return
	end

	if EM.__psNetWaitSource then
		psNetWaitSourceInstalled = true
		return
	end

	local origOpen = EM.openNetWaitPanel
	EM.openNetWaitPanel = function(...)
		local prev = Net.psNetWaitSource
		Net.psNetWaitSource = "timeout"
		local ok, err = pcall(origOpen, ...)
		Net.psNetWaitSource = prev          -- 保存/恢复，保证可重入
		if not ok then
			error(err, 0)
		end
	end
	EM.__psNetWaitSource = true
	psNetWaitSourceInstalled = true
	print("PS-NETWAIT-SOURCE-INSTALLED")
end



-- ═══════════════════════════════════════════════════════════════════════════
-- PS-PLAN-REFRESH（2026-11-01 二百八十八）：布阵面板整帧刷新防崩
--
-- 症状（真机 2026-11-01 10:57:14，附日志 b7b4251969fa2a1b_…_2026_11_01_10_43_09.txt）：
--   切后台重连后首次接敌，m_servant_lineup_info_toc 到达 5ms 后报
--   `toc协议报错：m_servant_lineup_info_toc  Object reference not set to an instance
--   of an object`（.NET NRE，非 Lua 错）。随后 45 秒里主城 MainPanel 的
--   onClickBtnReturn/onClickBtnHome 与 DebugIcon.onClickBtnDebug 连环 NRE（点击落进了
--   半开的 UI 栈）→ 用户"点返回没反应"；最终点「出击」后战斗场景初始化异常，
--   客户端再没发过 m_fight_skill_select_tos（健康对照 3.0~4.5s 内必发）→ 战斗停滞
--   = 玩家描述的"入战一瞬间点返回卡到无限技能"。
--
-- 机制：m_servant_lineup_info_toc → CopyModule.m_servant_lineup_info_toc =
--   { CopyMgr.initLineUp(msg); updatePlanPanel(); Dispatcher(UPDATE_LINE_UP_INFO) }。
--   updatePlanPanel 是 createModulePanelFunc 生成的面板三件套：CopyPlanPanel 不是
--   TabNavPanel（super=FullPanel）也没有 update 方法 ⇒ 走 `elseif panel then
--   panel:setData(...)` 分支 —— **无 isActive 守卫的全量 onGUI 刷新**，面板/场景
--   半初始化（重连后场景重建 × 布阵面板 preload 竞态）时触 .NET NRE。中断把
--   UPDATE_LINE_UP_INFO 派发一起带走（阵型格首渲依赖它），UI 栈从此半开。
--   同会话健康开面板（10:47/10:49/10:54/10:55）回包 65~390ms 均正常 ⇒ 时延不是
--   分歧点，**重连后的面板/场景态**才是；服务端数据形状已被 7 次开面板证伪排除。
--
-- 修法（不改官方文件；A3 三问：① CopyModule 模块表字段、toc handler 体内按名解析
--   ⇒ 运行期可覆盖；② 安装点 checkOnSendProto 在模块加载后、面板首开前；③ PS- 标记）：
--   ① 包 CopyModule.updatePlanPanel：pcall 原函数；失败打点 + 按 0.4s 步长延迟重试 4 次
--     （重试前校验面板 isActive），不把错误抛回 toc 链 ⇒ 派发不被跳过、UI 栈不再半开；
--   ② append 一条 pcall 版 UPDATE_LINE_UP_INFO 派发兜底：原始 handler 若在派发前中断
--     （或派发本体 NRE），阵型格刷新仍能补上（updateLineupView 是幂等纯刷新）。
-- ═══════════════════════════════════════════════════════════════════════════
local psPlanRefreshInstalled = false

function psInstallPlanPanelRefreshPatch()
	if psPlanRefreshInstalled then
		return
	end

	local CM = _G.CopyModule
	if type(CM) ~= "table" or type(CM.updatePlanPanel) ~= "function" then
		return
	end
	if type(_G.Net) ~= "table" or type(_G.Net.registerSocketHandler) ~= "function"
		or _G.Net.m_servant_lineup_info_toc == nil then
		return
	end

	psPlanRefreshInstalled = true

	local origUpdate = CM.updatePlanPanel
	-- 设备是 LuaJIT（ver20100）有裸 unpack；lupa 5.4 环境只有 table.unpack——两态兼容
	local psUnpack = unpack or table.unpack

	-- 复制 varargs（闭包捕获 {…} 不可变，重试复用同一份实参）
	CM.updatePlanPanel = function(...)
		local args = { n = select("#", ...) }
		for i = 1, args.n do
			args[i] = select(i, ...)
		end

		local ok, err = pcall(origUpdate, psUnpack(args, 1, args.n))
		if ok then
			return
		end

		print("PS-PLAN-REFRESH-ERR " .. tostring(err))
		for i = 1, 4 do
			LoopManager.setTimeout(function()
				local p = CM.planPanel
				if not (type(p) == "table" and p.isActive and p:isActive()) then
					return
				end
				local ok2, err2 = pcall(origUpdate, psUnpack(args, 1, args.n))
				if not ok2 then
					print("PS-PLAN-REFRESH-RETRY-FAIL " .. tostring(err2))
				end
			end, 0.4 * i)
		end
	end

	-- 兜底补手：registerSocketHandler 是 table.insert 追加语义（Net.lua:25-40），
	-- 原始 handler 的注册期闭包不受影响；本补手在其后跑，幂等。
	pcall(_G.Net.registerSocketHandler, _G.Net.m_servant_lineup_info_toc, function()
		local ok, err = pcall(function()
			Dispatcher.dispatch(ModuleCommand.UPDATE_LINE_UP_INFO)
		end)
		if not ok then
			print("PS-PLAN-REFRESH-DISP-ERR " .. tostring(err))
		end
	end)

	print("PS-PLAN-REFRESH-INSTALLED")
end

local psFameCountResetInstalled = false

function psInstallFameCountResetPatch()
	if psFameCountResetInstalled then
		return
	end

	local SM = nil
	local okReq, mod = pcall(require, "Modules.Servant.ServantMgr")
	if okReq and type(mod) == "table" and type(mod.initServantInfo) == "function" then
		SM = mod
	elseif type(ServantMgr) == "table" and type(ServantMgr.initServantInfo) == "function" then
		SM = ServantMgr
	end

	if SM == nil then
		print("PS-FAME-COUNT-RESET skip: ServantMgr 不可用（req=" .. tostring(okReq) .. " type=" .. type(mod) .. "）")
		return
	end

	if SM.__psFameCountReset then
		psFameCountResetInstalled = true
		print("PS-FAME-COUNT-RESET already installed")
		return
	end
	SM.__psFameCountReset = true
	psFameCountResetInstalled = true

	local psOrigInit = SM.initServantInfo

	SM.initServantInfo = function(info)
		local dic = nil
		pcall(function() dic = SM.getServantTypeDic() end)
		if type(dic) == "table" then
			local n = 0
			for k, v in pairs(dic) do
				if type(v) == "number" and v ~= 0 then
					dic[k] = 0
					n = n + 1
				end
			end
			print("PS-FAME-COUNT-RESET clear=" .. tostring(n)
				.. " size=" .. tostring(info and info.size))
		else
			print("PS-FAME-COUNT-RESET skip dic=" .. type(dic))
		end
		return psOrigInit(info)
	end

	print("PS-FAME-COUNT-RESET-INSTALLED")
end

-- ═══════════════════════════════════════════════════════════════════════════
-- PS-HANDBOOK-DIALOGUE（2026-10-21 二百零六）
--
-- 症状（用户 `星陨若尘` 真机 08:37:59，誓灵界面左右切换查看）：
--   `[LuaError] 回调函数出错:onHandBookDetail
--    Modules/Handbook/VO/HandbookVO:0: attempt to index a nil value`
--   调用栈：HandbookModule.m_role_handbook_detail_toc → Dispatcher(HAND_BOOK_DETAIL_TOC)
--          → ServantInfoPanel.onHandBookDetail → playServantCv
--
-- 根因**不在服务端**：客户端配置 `CfgHandbook.dialogue` 里**整段缺 1636003（阿努比斯）**。
--   · `HandbookVO.ctor`（bc 实证）：`slot0.dialogue = HandbookConfig.getServantDialogue(servantType)`
--     这次取到 nil，**但 ctor 只对 servantVo==nil 报错返回，dialogue 为 nil 照样建 VO**；
--   · `HandbookVO.isDialogueUnlock` / `getRandDialogueId` 第一句就是
--     `table.getItem(slot0.dialogue, ...)` / `ipairs` 之外的 `slot0:isDialogueUnlock`，
--     对 nil 取字段 → `attempt to index a nil value`（行号恒 0，因为字节码无调试行表）。
--   · `ServantInfoPanel.playServantCv` 拿到 detail 后 `slot2:getRandDialogueId()` 即崩，
--     且 `hasGetHandbookDetail` 已经置 true，**下一次 detail_toc 再进同一函数** —— 所以玩家
--     每切一次页就重报一次（日志 08:37:29 / 37 / 42 / 43 / 47 / 51 / 59 共 7 次 detail 请求，
--     只有最后一次落在这个誓灵上时爆错）。
--
-- 证据（四份独立快照 + 原始字节码，结论一致）：
--   1. 真机 res 包 `files/res/luascript/config.ab`（tmp/cfgab）—— `handbooks` 334 条，
--      `dialogue` 333 条，**唯一缺 1636003**；
--   2. 基座 APK `assets/luascript/config.ab`（tmp/cfgab_apk）—— `handbooks` 278 条，
--      `dialogue` 275 条，缺 1636003 / 1643009 / 1644010（后两只本服不可获得）；
--   3. `tools/lua_remote/bc/Config/CfgHandbook.lua`（随包字节码）原始字节串检索：
--      `1636003_01` / `1636003_25` **零命中**，而同表 `1042001_01` 命中 ——
--      台词文本与 voice 名在包体里根本不存在，不是反编译失真；
--   4. 存档 `save_1191022913_*.json`：玩家**确实持有** 1636003（id 90000315，gain 1791998674），
--      且 `handbookState.actives["1636003"]` 已激活 → 图鉴里该条目可点、可切。
--   ⭐ 关键：`CfgAudioLength` 里 `1636003_01..25` **25 条齐全**，设备 `res/audio/servant/`
--      也 25 个 `.ab` 全在 —— **有语音、没台词表**，属官方配置半成品（与 2845001 虎儿
--      "配置在、音频没打包"互为镜像）。所以**台词文本无法从任何官方产物恢复**。
--
-- 修法（不动 CfgHandbook 字节码 —— 那是 2.1MB 官方配置，重建风险远大于收益，见指南 B/174）：
--   运行时给 `HandbookConfig.getServantDialogue` 加一层**只补缺失**的兜底：
--     · 配置里有的 typeId → 原样返回（**零行为变化**，这是本补丁最重要的一条）；
--     · 配置里没有的 → 返回 25 条结构壳（id/lockType/type/triger/lockTip/time 全部取
--       全表**通用模板**：实测 333 个类型这五个字段 100% 一致，逐 id 断言过），
--       `text` 用占位文案、`voice` 留空串。
--   为什么占位是安全的：
--     · `playServantCV` 拿到 `voice=""` → `AudioConfig.getAudioLength("")` 返回默认 2 秒
--       （`uv0[slot0] or 2`）→ 不播音频、气泡 2 秒自动收，**不再崩**；
--     · 图鉴「语音」页签（HandbookDialogueView）只读 `text/type/triger/lockTip/id`，
--       都不会 nil；
--     · `isDialogueUnlock` 读 `table.getItem(dialogue,"id",n).lockType`，壳里有；
--       其它 22 条 lockType=3（要 cv_list 放行），而我们壳只给 id 1/3/20 = lockType 0，
--       其余保持 3 → 未解锁的仍显示为锁定，符合"本来就没有台词"的事实。
--     · **绝不写入 CfgHandbook 本体**（`configDatas` 里的表），只在返回值上做包装：
--       否则一旦有别的路径 `pairs(dialogue)` 统计条数会看到伪造数据。
--
-- 安装时机：与同文件其余补丁一致（`checkOnSendProto` 懒安装）。此时
-- `ModuleFactory.initModule` 早已跑完、`HandbookConfig` 必定已 require；且
-- `getServantDialogue` 是**模块表函数 + 调用方按名解析**（A3 可覆盖性三问全过），
-- 运行期覆盖有效（与 `m_*_toc` handler 不同）。
-- ⚠️ apkbuild 需要重出包才进包；PCJS 侧改完 `src` 重启游戏即生效。
-- ═══════════════════════════════════════════════════════════════════════════
local psHandbookDialogueInstalled = false

function psInstallHandbookDialoguePatch()
	if psHandbookDialogueInstalled then
		return
	end

	local HC = nil
	local okReq, mod = pcall(require, "Modules.Handbook.HandbookConfig")
	if okReq and type(mod) == "table" and type(mod.getServantDialogue) == "function" then
		HC = mod
	elseif type(HandbookConfig) == "table" and type(HandbookConfig.getServantDialogue) == "function" then
		HC = HandbookConfig
	end

	if HC == nil then
		print("PS-HANDBOOK-DIALOGUE skip: HandbookConfig 不可用（req=" .. tostring(okReq) .. " type=" .. type(mod) .. "）")
		return
	end

	if HC.__psDialogueShell then
		psHandbookDialogueInstalled = true
		print("PS-HANDBOOK-DIALOGUE already installed")
		return
	end

	-- 通用模板：id → {lockType, type, triger, lockTip}
	-- 数据来源 = 真机 CfgHandbook 全表实测（333 个类型逐字段一致，工具核对见
	-- tools/bc_cmp/check_handbook_dialogue.py 的 §2 断言）。lockType: 0=默认可播 / 3=需解锁。
	local PS_DIALOGUE_TEMPLATE = {
		{ id = 1,  lockType = 0, type = "收集", triger = "召唤语音",   lockTip = "？？" },
		{ id = 2,  lockType = 3, type = "通用", triger = "触摸语音1",  lockTip = "触摸誓灵" },
		{ id = 3,  lockType = 0, type = "通用", triger = "触摸语音2",  lockTip = "触摸誓灵" },
		{ id = 4,  lockType = 3, type = "通用", triger = "触摸语音3",  lockTip = "在白天时间触摸誓灵" },
		{ id = 5,  lockType = 3, type = "通用", triger = "触摸语音4",  lockTip = "在白天时间触摸誓灵" },
		{ id = 6,  lockType = 3, type = "通用", triger = "触摸语音5",  lockTip = "达到50羁绊后触摸誓灵" },
		{ id = 7,  lockType = 3, type = "通用", triger = "触摸语音6",  lockTip = "达到50羁绊后触摸誓灵" },
		{ id = 8,  lockType = 3, type = "通用", triger = "触摸语音7",  lockTip = "在夜晚时间触摸誓灵" },
		{ id = 9,  lockType = 3, type = "通用", triger = "触摸语音8",  lockTip = "在夜晚时间触摸誓灵" },
		{ id = 10, lockType = 3, type = "通用", triger = "触摸语音9",  lockTip = "达到50羁绊后触摸誓灵" },
		{ id = 11, lockType = 3, type = "通用", triger = "触摸语音10", lockTip = "达到50羁绊后触摸誓灵" },
		{ id = 12, lockType = 3, type = "通用", triger = "触摸语音11", lockTip = "在深夜时间触摸誓灵" },
		{ id = 13, lockType = 3, type = "战斗", triger = "开战（队长）", lockTip = "作为队长开战" },
		{ id = 14, lockType = 3, type = "战斗", triger = "技能使用1", lockTip = "使用攻击技能" },
		{ id = 15, lockType = 3, type = "战斗", triger = "技能使用2", lockTip = "使用辅助技能" },
		{ id = 16, lockType = 3, type = "战斗", triger = "技能使用3", lockTip = "使用攻击技能" },
		{ id = 17, lockType = 3, type = "战斗", triger = "失败",       lockTip = "战斗失败" },
		{ id = 18, lockType = 3, type = "战斗", triger = "MVP",        lockTip = "获得MVP" },
		{ id = 19, lockType = 3, type = "战斗", triger = "战斗联动",   lockTip = "暂无" },
		{ id = 20, lockType = 0, type = "其他", triger = "登录",       lockTip = "作为助手时登录游戏" },
		{ id = 21, lockType = 3, type = "其他", triger = "强化",       lockTip = "训练一次" },
		{ id = 22, lockType = 3, type = "其他", triger = "进化",       lockTip = "进化一次" },
		{ id = 23, lockType = 3, type = "其他", triger = "突破",       lockTip = "突破一次" },
		{ id = 24, lockType = 3, type = "其他", triger = "派遣",       lockTip = "成功派遣" },
		{ id = 25, lockType = 3, type = "其他", triger = "百日纪念",   lockTip = "相遇百日后解锁" },
	}

	-- 占位文案：明确告诉玩家"官方没配台词"，而不是空白或别的角色的台词
	local PS_DIALOGUE_PLACEHOLDER = "……（该誓灵的语音台词官方未配置）"

	-- 每个缺失 typeId 一份壳（缓存：同一 typeId 反复取要拿到同一张表，
	-- 否则 HandbookVO 之间互相比较 / 客户端二次索引会不一致）
	local psShellCache = {}

	local function psBuildShell(typeId)
		local shell = psShellCache[typeId]
		if shell ~= nil then
			return shell
		end

		local tname = string.format("%d", typeId)
		shell = {}
		for i = 1, #PS_DIALOGUE_TEMPLATE do
			local t = PS_DIALOGUE_TEMPLATE[i]
			-- voice 名**不能留空**：`AudioManager.playServantAudio("")` 会先
			-- `initServantAudioVO("")` 往 AudioConfig 的缓存表里塞一个 resUrl="Audio/Servant/"
			-- 的垃圾 VO（键是空串，永远清不掉），再拿它去加载**目录** → 每次播报一条
			-- `ab加载失败 .../audio/servant/` 警告。
			-- 而官方语音命名是 `<typeId>_<两位 id>`（实测 333 个类型里 332 个严格符合，
			-- 只有 1035012 有 4 条 id 与 voice 互换，属官方笔误）；1636003 的 25 条音频
			-- `CfgAudioLength` 与设备 `res/audio/servant/` **都在** —— 所以这里给真实 voice 名：
			-- 玩家能听到阿努比斯本人的语音，字幕显示下方占位文案（"台词官方未配置"）。
			local voice = tname .. "_" .. string.format("%02d", t.id)
			shell[i] = {
				id = t.id,
				lockType = t.lockType,
				type = t.type,
				triger = t.triger,
				lockTip = t.lockTip,
				time = 0,
				text = PS_DIALOGUE_PLACEHOLDER,
				voice = voice,
			}
		end

		psShellCache[typeId] = shell
		return shell
	end

	local psOrigGetDialogue = HC.getServantDialogue
	local psShellHits = 0

	function HC.getServantDialogue(typeId)
		-- 客户端里 typeId 偶尔以字符串形态流转（`tonumber` 兜底写法散见各处），
		-- 统一按数值查表：都不命中时省一次无效索引，也不改变任何既有返回值。
		if type(typeId) == "string" then
			local n = tonumber(typeId)
			if n ~= nil then
				typeId = n
			end
		end

		local real = psOrigGetDialogue(typeId)
		if real ~= nil then
			return real
		end

		-- 只对**图鉴里确实有条目**的 typeId 补壳：配置表外的 typeId（含 nil/0）
		-- 维持 nil，让 isWaitHandbook / 图鉴排除逻辑保持原判据。
		if type(typeId) ~= "number" then
			return nil
		end

		local byType = nil
		local okBy, errBy = pcall(function() byType = HC.getHandbookByType(typeId) end)
		if not okBy then
			-- 极端兜底（getHandbookByType 被别的补丁换掉/删除时）：直接扫全长名单。
			-- 只走一次 miss 分支，不影响命中路径的性能。
			pcall(function()
				for _, h in pairs(HC.getHandbookList() or {}) do
					if h and h.servantType == typeId then
						byType = h
						break
					end
				end
			end)
		end
		if byType == nil then
			return nil
		end

		psShellHits = psShellHits + 1
		if psShellHits <= 5 then
			print("PS-HANDBOOK-DIALOGUE shell type=" .. tostring(typeId)
				.. " (官方 CfgHandbook.dialogue 缺此段，已补结构壳，text 为占位)")
		end
		return psBuildShell(typeId)
	end

	HC.__psDialogueShell = true
	psHandbookDialogueInstalled = true
	print("PS-HANDBOOK-DIALOGUE-INSTALLED")
end

-- ═══════════════════════════════════════════════════════════════════════════
-- PS-BREAK-AUTO-FILTER（2026-10-25 二百四十七）
--
-- 症状（用户反馈）：誓约破除选人面板「自动勾选」部分誓灵不勾，手动可以选。
--
-- 根因**不在服务端**（level 字段全量正确下发，存档 0 缺失）：官方自动勾选过滤器
-- 硬编码 `level == 1`，练过级的 N/R 一律跳过；另有保护名单 CfgSummon.shieldServant
-- （37 只，其中 N/R 色 25 只）同样不自动勾（手动选择无这两道闸门，照选不误）。
-- 详见 调研-破除自动勾选遗漏.md。
--
-- 修法（运行期覆盖，A3 三问全过：实例方法晚绑定 + checkOnSendProto 懒安装 + PS 标记）。
-- 覆盖两个模块表函数，**仅去掉 level==1 闸门**，其余逐句保持原语义：
--   1) ServantModule.ServantSelectView.onServantFilterFunc（chbN/chbR 资格判定）
--      原条件：color==色号 and level==1 and 非保护名单 and 未选中
--      新条件：color==色号 and 非保护名单 and 未选中
--   2) SummonModule.SummonDecomposeSelectPanel.onServantFilter（chbFullStep 满破框）
--      闭包谓词去掉 `sv.level == 1` 一层；同卡判定仍扫 ServantMgr.getList() 全表
--      （满破本体即使上阵/锁定也成立，照抄官方）；0 基索引换算与
--      addSelectIndexs/removeSelectIndexs 分支保持原样。
--
-- 不动：保护名单（官方防误破联动/纪念卡）、DECOMPOSE_MAX=50 上限（截断在外层
-- onServantFilter，未覆盖）、selectListN/R 分存、spFullStepTip 角标、能源喂养
-- 快捷"+"的官方启发式（九十条已定性不碰）。
--
-- 安全网：破除确认面板对 `SR+ 或 level>10` 本就弹「确认是否破除以下稀有誓灵」
-- （SummonDecomposePanel.lua:44），练过级的卡被自动勾进后仍过二次确认。
--
-- 安装时机：checkOnSendProto 懒安装（同文件其余补丁一致）。两个 View 类都在
-- ModuleFactory → 模块根 → AutoGen 启动链上（ServantModuleAutoGen.lua:63 /
-- SummonModuleAutoGen.lua:8），首个协议发出时类表必已就绪——只查全局**不 require**：
-- 文件内 module("XxxModule", package.seeall) 硬编码注册名，require 键下的
-- package.loaded 是被强制置为 true 的布尔，require 的返回值不是模块表。
-- ⚠️ apkbuild 需要重出包才进包；PCJS 侧改完 src 重启游戏即生效。
-- ═══════════════════════════════════════════════════════════════════════════
local psBreakAutoFilterInstalled = false

function psInstallBreakAutoFilterPatch()
	if psBreakAutoFilterInstalled then
		return
	end

	-- 目标 1：ServantSelectView（chbN/chbR 资格判定）
	local SSV = nil
	if type(ServantModule) == "table" and type(ServantModule.ServantSelectView) == "table"
		and type(ServantModule.ServantSelectView.onServantFilterFunc) == "function" then
		SSV = ServantModule.ServantSelectView
	end

	-- 目标 2：SummonDecomposeSelectPanel（chbFullStep 满破框）
	local SDP = nil
	if type(SummonModule) == "table" and type(SummonModule.SummonDecomposeSelectPanel) == "table"
		and type(SummonModule.SummonDecomposeSelectPanel.onServantFilter) == "function" then
		SDP = SummonModule.SummonDecomposeSelectPanel
	end

	if SSV == nil and SDP == nil then
		print("PS-BREAK-AUTO-FILTER skip: ServantSelectView / SummonDecomposeSelectPanel 均不可用")
		return
	end

	if SSV ~= nil then
		if SSV.__psBreakAutoFilter then
			print("PS-BREAK-AUTO-FILTER view already installed")
		else
			SSV.__psBreakAutoFilter = true
			-- 原函数（bc 符号化逐句对照）：slot1=候选誓灵, slot2=色号(1=N/2=R),
			-- slot3=已选集合（上游闭包变量，供去重；原样透传，与官方同一容错面）。
			SSV.onServantFilterFunc = function(self, servant, color, selected)
				if servant.color == color
					and not table.isExist(SummonConfig.getShieldServant(), servant.typeId)
					and not table.isExist2(selected, function(s)
						if s.id == servant.id then return true else return false end
					end) then
					return true
				end
				return false
			end
			print("PS-BREAK-AUTO-FILTER view installed")
		end
	end

	if SDP ~= nil then
		if SDP.__psBreakAutoFilter then
			print("PS-BREAK-AUTO-FILTER panel already installed")
		else
			SDP.__psBreakAutoFilter = true
			-- 原实现：filter(self.allServants, 谓词) → 收集 selectView.allServants 中的
			-- 0 基索引 → checked 时 addSelectIndexs，否则 removeSelectIndexs。
			-- 谓词原为「level==1 且 有同 typeId overstep>=5 本体 且 非保护名单」。
			-- （filter/table.isExist/table.find 是框架全局，官方同函数在用，直接复用。）
			SDP.onServantFilter = function(self, checked)
				local shield = SummonConfig.getShieldServant()
				local allServants = self.allServants
				local idxs = {}
				if type(allServants) == "table" then
					local roster = ServantMgr.getList()
					for _, sv in ipairs(allServants) do
						local hasFullStep = false
						for _, s in ipairs(roster) do
							if s.typeId == sv.typeId and s.overstep >= 5 then
								hasFullStep = true
								break
							end
						end
						if hasFullStep and not table.isExist(shield, sv.typeId) then
							local pos = table.find(self.selectView.allServants, sv)
							if pos then  -- 真值判断：框架 table.find 未命中返回 nil 或 false 都兜住
								table.insert(idxs, pos - 1)
							end
						end
					end
				end
				if checked then
					self.selectView:addSelectIndexs(idxs)
				else
					self.selectView:removeSelectIndexs(idxs)
				end
			end
			print("PS-BREAK-AUTO-FILTER panel installed")
		end
	end

	psBreakAutoFilterInstalled = true
	print("PS-BREAK-AUTO-FILTER-INSTALLED")
end

-- PS-URIEL-TALENT-NOTICE（2026-11-01）：防盗卖声明藏位。
-- 乌列尔（1144022）是无任何投放途径的卫星誓灵（CfgHandbook.waitHandbooks 挡图鉴点击，正常游玩不可达，
-- 仅 GM 发放持有后能进详情页）；她的天赋「神之光」= CfgTalent[21730]，全库仅她一人携带
-- （CfgServant 只有 1144022 一处 talent = 21730）。把该天赋的 desc 改为公益声明：
--   · 只改 desc 字符串字段——天赋效果（嘲讽引仇恨）在服务端 fight_core.js，客户端配置零改动；
--   · 显示链：ServantAttrView 渲染时实时读 ServantConfig.getTalentVO(id).desc（TalentVO 用 setMateTable
--     直接包配置原行，无拷贝），>60 字走 objScrollText 滚动分支（官方 21740 同路径，已产线验证）；
--   · CfgTalent 是懒加载配置：ConfigMgr.getConfig 首调时 require+initConfig，之后拿到的始终是同一张表，
--     此处改表字段对所有后续读取方可见。
local psUrielNoticeInstalled = false

function psInstallUrielTalentNoticePatch()
	if psUrielNoticeInstalled then
		return
	end

	if ConfigMgr == nil or type(ConfigMgr.getConfig) ~= "function" then
		print("PS-URIEL-TALENT-NOTICE skip: ConfigMgr 未就绪")
		return
	end

	local okCfg, cfg = pcall(ConfigMgr.getConfig, "CfgTalent")
	if not okCfg or type(cfg) ~= "table" or type(cfg[21730]) ~= "table" then
		print("PS-URIEL-TALENT-NOTICE skip: CfgTalent[21730] 不可用（ok=" .. tostring(okCfg) .. " cfg=" .. type(cfg) .. "）")
		return
	end

	psUrielNoticeInstalled = true

	cfg[21730].desc = "方舟指令JS是免费开源的公益学习项目，没有任何盈利和变相盈利形式。若您通过付费渠道获得了本游戏，请立即申请退款并向平台投诉。祝各位御灵士游戏愉快。——Funky社"
	print("PS-URIEL-TALENT-NOTICE-INSTALLED")
end

-- PS-NOTICE-ONCE（2026-11-01）：公告"每日首登自动弹"改为"每账号只弹一次"。
-- 官方链（ActivityModule.lua:72-73）：`if NoticeModule.checkTodayIsFirstLogin() then
-- NoticeModule.firstLoginAndShowNotice() end`——两处调用都按 NoticeModule 表名晚绑定 ⇒ 运行期包装可行
-- （A3 三问全过：模块表按名解析 / checkOnSendProto 首包前安装 / PS- 标记）。官方节流粒度是"每天一次"
-- （firstLoginAndShowNotice 存 lastShowNoticeDay=当天日期串），玩家每天首登都会弹。改法：新增设备
-- ExtCfg 键 psNoticeShownEver：
--   · 安装时迁移：lastShowNoticeDay 已有值的老玩家视为"已读"，直接置位（升级后不再自动弹）；
--   · 包装 firstLoginAndShowNotice：已置位 → 只走 ActivityModule.dealwithNextAct()（活动链不断，
--     与官方"本会话已弹过"早退分支同款行为）；未置位 → 置位后调原函数（新玩家首次登录照常弹一次）。
-- 主城「公告」按钮手动打开不受影响（走 gotoOpenMainPanel，不经过本函数）；拦截范围仅"自动弹"。
local psNoticeOnceInstalled = false

function psInstallNoticeOncePatch()
	if psNoticeOnceInstalled then
		return
	end

	local NM = nil
	if type(NoticeModule) == "table" and type(NoticeModule.firstLoginAndShowNotice) == "function" then
		NM = NoticeModule
	else
		local okReq, mod = pcall(require, "Modules.NoticeNew.NoticeModule")
		if okReq and type(mod) == "table" and type(mod.firstLoginAndShowNotice) == "function" then
			NM = mod
		end
	end

	if NM == nil then
		print("PS-NOTICE-ONCE skip: NoticeModule 不可用")
		return
	end

	if NM.__psNoticeOnce then
		psNoticeOnceInstalled = true
		print("PS-NOTICE-ONCE already installed")
		return
	end
	NM.__psNoticeOnce = true
	psNoticeOnceInstalled = true

	-- 老玩家迁移：官方键 lastShowNoticeDay 有值 = 至少自动弹过一次 = 已读（新装设备无此键 → 照常首弹）
	if type(SystemConfig) == "table" or type(SystemConfig) == "userdata" then
		local seen = SystemConfig.GetExtCfg("lastShowNoticeDay")
		if seen ~= nil and seen ~= "" then
			SystemConfig.SaveExtCfg("psNoticeShownEver", 1)
			SystemConfig.SaveExtCfg()
			print("PS-NOTICE-ONCE migrate: lastShowNoticeDay=" .. tostring(seen))
		end
	end

	local psOrigShow = NM.firstLoginAndShowNotice

	NM.firstLoginAndShowNotice = function()
		local ever = nil
		if type(SystemConfig) == "table" or type(SystemConfig) == "userdata" then
			ever = SystemConfig.GetExtCfg("psNoticeShownEver")
		end
		if ever == 1 or ever == "1" then
			-- 已弹过：静默走活动链（对应官方原函数里 noticeShown 早退分支的行为）
			if ActivityModule ~= nil and type(ActivityModule.dealwithNextAct) == "function" then
				ActivityModule.dealwithNextAct()
			end
			return
		end
		-- 先置位再弹：即使原函数抛异常也保证"只弹一次"
		if type(SystemConfig) == "table" or type(SystemConfig) == "userdata" then
			SystemConfig.SaveExtCfg("psNoticeShownEver", 1)
			SystemConfig.SaveExtCfg()
		end
		print("PS-NOTICE-ONCE first show (won't auto-show again)")
		return psOrigShow()
	end

	print("PS-NOTICE-ONCE-INSTALLED")
end


-- ═══════════════════════════════════════════════════════════════════════════
-- PS-HANDBOOK-LANGUNLOCK：解除韩服限定誓灵的图鉴语言锁（2026-11-03）
--
-- 背景：国服 CfgHandbook 里 河伯 2541003（No.291）、桓雄 2545004（No.292）、
--       虎儿 2845001（No.197）、雀儿 2843002（No.198）四条带 `limit_lang = {"korean"}`，
--       而 HandbookConfig.initConfig 的收录条件是：
--           bookType == TYPE_NORMAL and (limit_lang 为空 or 含 getLang())
--       国服 getLang() = "chinese_s" ⇒ 这四只永远进不了图鉴列表。
--       它们的 CfgServant / CfgHandbook 条目、立绘、spine 在国服**都是齐的**，
--       唯独被这一行语言锁挡住。
--       （雀儿 2026-11-06 补入：二百九十四当时未能确认她的 typeId 而漏在补丁外，
--         实证 CfgHandbook[198].servantType=2843002 + CfgServant[2843002].name="雀儿"，
--         资源与虎儿同构齐全：cards/heads/faces/spine + 语音 25 条全在。）
--
-- 做法：包装 HandbookConfig.initConfig —— 每次进列表前先把这四条的 limit_lang
--       置为 nil（等价于"全语言可用"），其余条目一律不碰；原函数逻辑零改动。
--       用包装而非改 config.ab：不动 4.6MB 字节码，可随 lua_remote 热更回滚。
--
-- 注意：initConfig 有 `if uv0 == nil then` 幂等闸门（uv0 是 upvalue，外部改不到），
--       所以必须在**它第一次跑之前**就把表改掉。本函数在 checkOnSendProto 早期
--       调用，早于任何图鉴面板打开；同时包装一次后可重复安全调用。
--
-- ⚠️ apkbuild 需要重出包才进包；PCJS 侧改完 `src` 重启游戏即生效。
-- ═══════════════════════════════════════════════════════════════════════════
local psLangUnlockInstalled = false

-- 语言锁被解除的誓灵（typeId → 图鉴序号，仅作日志可读性）
local PS_LANG_UNLOCK_TYPES = {
	[2541003] = 291,   -- 河伯     高朱蒙传道士
	[2545004] = 292,   -- 桓雄     熊女之守
	[2845001] = 197,   -- 虎儿     妖怪之王
	[2843002] = 198,   -- 雀儿     啊呜呜（KR 限定第 4 条，2026-11-06 补入）
}

function psInstallHandbookLangUnlockPatch()
	if psLangUnlockInstalled then
		return
	end

	-- 过滤点在哪（2026-11-03 反编译实证，别改错对象）：
	--   CfgHandbook.handbooks 是原始表；两个消费者各自按 limit_lang 过滤：
	--     HandbookConfig.initConfig   —— 只填 uv1/uv2（筛选器用），条件含 bookType==TYPE_NORMAL
	--     HandbookMgr 的 uv0()        —— 真正建图鉴列表/分桶（TYPE_NORMAL/INTER/BERSERK 各一桶）
	--   HandbookMgr 那个是**模块内局部函数 + upvalue 幂等闸门**，外部既包装不到也改不了。
	--   ⇒ 唯一对所有消费者都生效的点是**配置表本身**：把 limit_lang 置 nil。
	--     置 nil 与"官方没写这个字段"完全等价（三处消费条件都写成 `limit_lang == nil or ...`）。
	local function psClearLangLock()
		local cfg = nil
		if type(ConfigMgr) == "table" and type(ConfigMgr.getConfig) == "function" then
			local ok, c = pcall(ConfigMgr.getConfig, "CfgHandbook")
			if ok then
				cfg = c
			end
		end
		if cfg == nil or type(cfg.handbooks) ~= "table" then
			return nil
		end
		local unlocked = {}
		for _, block in pairs(cfg.handbooks) do
			local st = block and block.servantType
			if st ~= nil and PS_LANG_UNLOCK_TYPES[st] ~= nil and block.limit_lang ~= nil then
				block.limit_lang = nil
				unlocked[#unlocked + 1] = tostring(st)
			end
		end
		return unlocked
	end

	-- 立刻清一次。本函数在 checkOnSendProto 里调用，早于任何图鉴面板打开
	-- （HandbookMgr 的 uv0() 是首次 getList 才跑），因此清好之后它读到就是解锁态。
	local got = psClearLangLock()
	psLangUnlockInstalled = true
	if got == nil then
		print("PS-HANDBOOK-LANGUNLOCK skip: CfgHandbook 不可用")
	elseif #got > 0 then
		print("PS-HANDBOOK-LANGUNLOCK unlocked: " .. table.concat(got, ","))
	else
		print("PS-HANDBOOK-LANGUNLOCK installed (no hit — 可能已解锁/已重建过列表/表结构变更)")
	end
end

-- ═══════════════════════════════════════════════════════════════════════════
-- PS-BAG-SERVANT-LOCK（2026-11-05）：背包誓灵卡「锁定」点了没反应。
--
-- 现象（用户反馈）：背包 → 某只 UR 誓灵道具 → 弹出的获得风格卡片，点右下角锁定开关
--   **完全没有任何反应**：不弹 Tips、不发协议、服务端日志零记录、出来后仍显示未锁定。
--
-- 根因（bc 实证）：该面板的 initUI 挂了
--   `slot0.togLock:AddChange(luaHandler(slot0, "onLockChange", slot0))`
-- 但 `BagServantOutPanel` 的导出函数集合里**根本没有 onLockChange**
-- （伪汇编枚举 24 个 `BagServantOutPanel.xxx =` 赋值：initUI/onClick/close/onOpen/
--  onClickBtnOk/onClickBtnCancel/onGUI/onCardLoad/... 无此项）。
-- luaHandler 内部是 pcall(u0_9_0[u0_9_1], ...)，取到 nil 即 "attempt to call a nil value"，
-- 被吞成一行 printError("回调函数出错:onLockChange") 后**什么都不做** ——
-- CToggle 的 _isOn 已在 IsOn setter 里改过（C# 侧先赋值再调 _changeFunc），
-- 所以视觉上开关动了，但没有对应协议，重开面板 SetSelect(false) 又弹回未锁定。
--
-- 同族对照（都自带 onLockChange）：OutCardPanel（抽卡获得）、ServantInfoPanel（详情）
-- 均正常；ServantNewSkinPanel 是**空实现**（皮肤卡本不该锁誓灵，属官方设计）。
-- 即只有 BagServantOutPanel 是漏写。
--
-- 为什么可以运行期补：luaHandler 是**运行期按名查表**
--   （functions.lua:220 `pcall(u0_9_0[u0_9_1], ...)`，u0_9_0 = 被捕获的类表），
-- 不是注册期捕获函数值，所以给类表补一个方法立即生效（指南 A3 的可晚绑定例外）。
-- 安装点：面板类由 BagModuleAutoGen 在 ModuleFactory 启动链上创建，
-- checkOnSendProto 时全局必已就绪；同一 toggle 的 AddChange 也早已在 initUI 里挂好。
--
-- 契约对齐 OutCardPanel.onLockChange（bc 逐句同构）：
--   slot0.servant 由 beforeStep1 从 BagMgr.getOutCardVO().servantVO 赋值，
--   即 OutCardVO.servantVO → ServantConfigVO，其 .id 就是服务端实例 id。
--   toLock(id, 1/0) → m_servant_lock_tos{servant_ids:{id}, op_type}。
-- ⚠️ 只能查全局，**不要 require 该文件**（指南 A4：View 类 module() 名与 require 键不同，
--    require 会二次执行把 AutoGen 建好的 class 表顶掉）。
-- ⚠️ apkbuild 需重出包才进包；PCJS 侧改完 src 重启游戏即生效。
-- ═══════════════════════════════════════════════════════════════════════════
local psBagServantLockInstalled = false
local psTowerRecoverBoolInstalled = false

function psInstallBagServantLockPatch()
	if psBagServantLockInstalled then
		return
	end

	-- View 类挂在 module("BagModule", package.seeall) 的作用域里，同时是 _G 上的全局
	-- （AutoGen 里裸写 `BagServantOutPanel = class(...)`）。两处都探，先全局后模块表。
	local P = rawget(_G, "BagServantOutPanel")
	if type(P) ~= "table" and type(BagModule) == "table" then
		P = rawget(BagModule, "BagServantOutPanel")
	end

	if type(P) ~= "table" then
		print("PS-BAG-SERVANT-LOCK skip: BagServantOutPanel 不可用（面板未加载）")
		return
	end

	if type(P.onLockChange) == "function" then
		psBagServantLockInstalled = true
		print("PS-BAG-SERVANT-LOCK already present（官方已实现，无需补）")
		return
	end

	if type(P.initUI) ~= "function" then
		print("PS-BAG-SERVANT-LOCK skip: 类表形状不符（initUI 缺失）")
		return
	end

	if type(ServantModule) ~= "table" or type(ServantModule.toLock) ~= "function" then
		print("PS-BAG-SERVANT-LOCK skip: ServantModule.toLock 不可用")
		return
	end

	psBagServantLockInstalled = true

	-- slot1 = CToggle.AddChange 传回的 BoolDelegate 参数（C# `_changeFunc(_isOn)`，bool）
	P.onLockChange = function(self, isOn)
		if self.servant == nil then
			return
		end

		ServantModule.toLock(self.servant.id, isOn and 1 or 0)
	end

	print("PS-BAG-SERVANT-LOCK installed")
end

-- ═══════════════════════════════════════════════════════════════════════════
-- PS-TOWER-RECOVER-BOOL（2026-11-05 三百零六）
--
-- 症状（真机）：
--   `[LuaError] 回调函数出错:onClickAutoFight
--    Core/Utils/Util:0: bad argument #1 to 'SetActive' (boolean expected, got number)`
--   —— 无限领域「自动」按钮点第一次正常，**取消后或打过一场再点就报这个**。
--
-- 根因（客户端类型污染，与 SetActive 本身无关）：
--   · `TowerAutoFightVO.isRecover` 在 ctor 里是 boolean `false`；
--   · 服务端 `m_tower_begin_auto_toc{recover:int}` 回包 → `TowerMgr.updateAutoFightRecover`
--     直接 `isRecover = slot0.recover` ⇒ 变成 **number 0/1**；
--   · `TowerAutoPopupPanel.onGUI:10` 每次都 `slot0.recover = getAutoFightVO().isRecover`
--     ⇒ number；`:12` `Util.setActive(slot0.spRecover, slot0.recover)`；
--   · `Util.setActive` 是 `obj.gameObject:SetActive(flag)` 的裸透传（Core/Util bc 实证），
--     tolua 严格类型检查 ⇒ `bad argument #1 to 'SetActive' (boolean expected, got number)`。
--   而 `onClickAutoFight` 就是 `openAutoPopupPanel(false)` 的唯一入口，报错栈自然指向它。
--
-- 判据（一条命令）：服务端日志里 `m_tower_begin_auto_toc` 出现过 → 该客户端此后必崩一次。
--
-- 修法：在 `getAutoFightVO()` 出口把 `isRecover` 归一成 boolean（**只改读不改造**，
-- 保留 number 兼容官方其它读取方；`Util.setActive` 的 tolua 检查不吃 number）。
--   ⚠️ 不重写 TowerMgr 整个模块（A3）：只包一个 getter，晚绑定安全；
--      且 TowerMgr 是纯模块表（module() 注册），按名解析可达。
function psInstallTowerRecoverBoolPatch()
	if psTowerRecoverBoolInstalled then
		return
	end

	local TM = rawget(_G, "TowerMgr")
	if type(TM) ~= "table" and type(TowerModule) == "table" then
		TM = rawget(TowerModule, "TowerMgr")
	end

	if type(TM) ~= "table" or type(TM.getAutoFightVO) ~= "function" then
		print("PS-TOWER-RECOVER-BOOL skip: TowerMgr.getAutoFightVO 不可用")
		return
	end

	psTowerRecoverBoolInstalled = true

	local origGet = TM.getAutoFightVO

	TM.getAutoFightVO = function(...)
		local vo = origGet(...)
		if vo ~= nil then
			-- 幂等归一：服务端回的是 int，ctor 初值是 boolean，两种都要收敛
			local v = vo.isRecover
			if type(v) ~= "boolean" then
				vo.isRecover = (tonumber(v) or 0) ~= 0
			end
		end
		return vo
	end

	print("PS-TOWER-RECOVER-BOOL installed")
end

-- ═══════════════════════════════════════════════════════════════════════════
-- PS-RELIC-ENCHANT-UNITS（2026-11-06 三百一十二）：圣器苏醒「通用材料只能放一次」。
--
-- 现象（用户反馈）：圣器苏醒选料面板显示「选择圣器 1/2」，995 个通用型圣器只能
--   占 1 个名额、确认键永远灰——「那样通用的意义都没有了」。
--
-- 根因（bc 字节码实证，官方原样行为、非本服引入）：
--   · 两道确认门都按「背包条目数」计数：
--     - 选料面板 ServantTrainSelectRelicPanel.onSelectChange 尾部
--       `btnOk.IsEnabled = listRelic.maxSelectNum <= SelectList.Count`；
--     - 升级面板 ServantTrainRelicUpgradePanel.onGUI 尾部
--       `btnOk.IsEnabled = nums[下一级] <= #selectRelics`。
--     字节码（pseudo-asm）：选料面板 onGUI 指令 18/25/43 —— maxSelectNum 与
--     「/2」显示读同一寄存器 = cfg.nums[curLv+1]；升级面板指令 16-18/132-141 ——
--     ISLE(nums, #selectRelics) 直接赋 btnOk.IsEnabled。
--   · 通用型圣器 31000012/13 `canPile=true` 全部堆叠成 1 条 ⇒ 永远只占 1 坑；
--     need≥2（Lv2→3 起，nums={1,1,2,2,3}）时只带通用材料永远凑不满条目数。
--   · 官方设计口径即如此（面板文案「本次提升需要消耗N个相同的圣器」+ BWIKI
--     「可当作同色圣器的通用苏醒材料」）——"通用"指类型通用，不是数量通用。
--   · 服务端 m_relic_upgrade_enchant_tos（一百五十一条）早已是「按单位扣料」：
--     选中条目里通用材料按 cur_num 覆盖多单位、精确扣 need 个
--     （smoke_enchant_regression 专项断言）。是 UI 门槛把它挡死了。
--
-- 修法（只改"点亮条件"；协议、服务端、选中语义零改动）：
--   · onSelectChange 整体替换：底部计数 lblNum 与 btnOk 按「有效单位数」——
--     同色圣器每条恒 1（服务端只收单实例，relic.js cur_num!==1 拒）；通用材料
--     （cfg.commonItems）一条按 min(curNum, 剩余 need) 计。
--   · UpgradePanel.onGUI 尾包一层：原 onGUI 照跑（3 槽展示/文案/特效全保留），
--     出口按同口径重算 btnOk.IsEnabled。
--   · 选中语义不动（每条目一次、C# maxSelectNum 封顶条目数）——1 条 995 堆叠
--     天然满足任意 need≤3；混选（同名圣器+堆叠）同样成立。
--
-- 判据：选中 1 条通用堆叠确认键即亮；升级后堆叠按 need 递减、权威附魔 info
--   照推（服务端既有链路）。真机路径：圣器背包→苏醒→选属性→选料→确定。
-- ⚠️ 安装点：两面板文件由 ServantTrainModuleAutoGen（ModuleFactory 启动链）
--    急切 require；guard 检查**原 onSelectChange 已存在**才动手——防"文件未加载
--    先占位、随后被文件定义覆盖"（与 PS-BAG-SERVANT-LOCK 的晚绑定前提不同，
--    这里替换的是文件内已有函数，必须装在其加载之后）。
-- ⚠️ RelicItemVO 数量字段是 curNum（BaseItemVO.setDbInfo），不是 wire 的 cur_num。
-- ⚠️ Lv5(MAX) 时 nums[lv+1]=nil——官方 onGUI 本就会崩（不可达路径，信息面板挡）；
--    本补丁对该形态保守禁用 btnOk，不模仿官方的 nil 比较。
-- ═══════════════════════════════════════════════════════════════════════════
local psRelicEnchantUnitsInstalled = false

function psInstallRelicEnchantUnitsPatch()
	if psRelicEnchantUnitsInstalled then
		return
	end

	local STM = rawget(_G, "ServantTrainModule")
	local SP = rawget(_G, "ServantTrainSelectRelicPanel")
	local UP = rawget(_G, "ServantTrainRelicUpgradePanel")
	if type(SP) ~= "table" and type(STM) == "table" then
		SP = rawget(STM, "ServantTrainSelectRelicPanel")
	end
	if type(UP) ~= "table" and type(STM) == "table" then
		UP = rawget(STM, "ServantTrainRelicUpgradePanel")
	end

	-- 全有才装（两类同出 ServantTrainModuleAutoGen 一条 require 链；避免半装后重试套娃）
	if type(SP) ~= "table" or type(SP.onSelectChange) ~= "function" or type(SP.onClickBtnOk) ~= "function" then
		print("PS-RELIC-ENCHANT-UNITS skip: SelectRelicPanel 未就绪")
		return
	end
	if type(UP) ~= "table" or type(UP.onGUI) ~= "function" or type(UP.onClickBtnOk) ~= "function" then
		print("PS-RELIC-ENCHANT-UNITS skip: RelicUpgradePanel 未就绪")
		return
	end

	psRelicEnchantUnitsInstalled = true

	-- 选中条目 → 有效材料单位数。同色圣器每条恒 1；通用材料按 min(curNum, 剩余 need)。
	-- 与服务端 relic.js 的扣料口径逐条对齐（relicUnits + commonUnits，精确扣 need）。
	local function psEnchantUnitsOf(sel, getItem, need, commons)
		local units = 0
		for i = 0, sel.Count - 1 do
			local d = getItem(sel[i])
			if d then
				local n = 1
				if commons and table.isExist(commons, d.typeId) then
					n = d.curNum or 1
					if n > need - units then
						n = need - units
					end
				end
				units = units + n
			end
		end
		return units
	end

	-- ① 选料面板：确认门 + 底部计数按单位数（官方语义：SelectList.Count）
	SP.onSelectChange = function(self)
		local list = self.listRelic
		local sel = list and list.SelectList
		if not sel then
			return
		end

		local need = list.maxSelectNum
		if type(need) ~= "number" then
			-- onGUI 未跑过（官方此处 nil 比较会崩；不可达路径保守禁用）
			self.btnOk.IsEnabled = false
			return
		end

		local commons = self.cfg and self.cfg.commonItems or nil
		local units = psEnchantUnitsOf(sel, function(idx)
			return list:GetItemData(idx)
		end, need, commons)

		self.lblNum.text = units
		self.btnOk.IsEnabled = units >= need
	end

	-- ② 升级面板：原 onGUI 全量照跑，出口按同口径重算 btnOk
	local origOnGUI = UP.onGUI
	UP.onGUI = function(self, prop)
		origOnGUI(self, prop)

		local ok, err = pcall(function()
			local relic = ServantTrainMgr.selectRelic
			if type(relic) ~= "table" or not relic.color then
				return
			end

			local cfg = ServantTrainConfig.getRelicVO(relic.color)
			local nums = cfg and cfg.nums or nil
			local need = nums and nums[(relic:getPropLv(prop) or 0) + 1] or nil
			if type(need) ~= "number" then
				self.btnOk.IsEnabled = false
				return
			end

			local commons = cfg.commonItems
			local units = 0
			for i = 1, #ServantTrainMgr.selectRelics do
				local d = ServantTrainMgr.selectRelics[i]
				if d then
					local n = 1
					if commons and table.isExist(commons, d.typeId) then
						n = d.curNum or 1
						if n > need - units then
							n = need - units
						end
					end
					units = units + n
				end
			end

			self.btnOk.IsEnabled = units >= need
		end)

		if not ok then
			print("PS-RELIC-ENCHANT-UNITS-ERR " .. tostring(err))
		end
	end

	print("PS-RELIC-ENCHANT-UNITS installed")
end

-- ═══════════════════════════════════════════════════════════════════════════
-- PS-EX-COPY-TIMES（2026-11-06 三百一十四）：EX 挑战关每日次数上限 3→10（服务端同步）。
--
-- 背景（用户反馈）：困难关（EX 挑战模式）每天 3 次太少，服务端已扩到 10
--   （server/handlers/map_fight.js EX_COPY_MAX_TIMES=10）。
--
-- 为什么客户端必须补一刀：官方 CopyConst.EX_COPY_MAX_TIMES=3 有两处**调用点现读**消费——
--   ① CopyMgr.getExCopyRemainTimes() = CopyConst.EX_COPY_MAX_TIMES - RoleMgr.getDailyTimes(20004)
--     （CopyMgr.lua:609-611）→ CopyMainLineView.lblExTimes "次数：x/N"（:376）与
--     EX 模式自动回落门控 changeExMode(isOpenExCopy() && remain>0)（:328）；
--   ② 同常量直接拼进 lblExTimes 的 "/N" 文案。
-- 服务端改 10 而客户端不改的话：打过 3 关后显示"次数：0/3"（实际服务端还剩 7 次）、
-- 通关后章节页自动回落 EX 模式的门控提前关闭——两处都在骗人。常量是调用点现读，
-- 运行期改表即全生效（A3：非注册期捕获）。
--
-- 安装：checkOnSendProto 懒安装（同文件其余补丁一致）；CopyConst 是 config 级模块
--   （module("CopyConst", package.seeall)，全局表），首个协议发出时必已加载。
-- ⚠️ 与服务端 EX_COPY_MAX_TIMES 必须同值——改一处必须同改另一处（map_fight.js:64 注释已钉）。
-- ═══════════════════════════════════════════════════════════════════════════
local psExCopyTimesInstalled = false

function psInstallExCopyTimesPatch()
	if psExCopyTimesInstalled then
		return
	end

	local CC = rawget(_G, "CopyConst")
	if type(CC) ~= "table" or CC.EX_COPY_MAX_TIMES == nil then
		return
	end

	psExCopyTimesInstalled = true
	CC.EX_COPY_MAX_TIMES = 10

	print("PS-EX-COPY-TIMES installed max=" .. tostring(CC.EX_COPY_MAX_TIMES))
end

-- ═══════════════════════════════════════════════════════════════════════════
-- PS-MYSTERY-GIFT-CANUSE（2026-11-07 三百一十七）：「神秘的礼物」Lv1/Lv2 使用闸放行。
--
-- 现象（二百七十八记遗留工单）：活跃度宝箱#3 等渠道发 28000024/28000025 到包后，
--   背包点开道具弹窗「使用」恒显示「关闭」——开不出东西，服务端 openMysteryGift
--   （vit.js，随机产出同色礼物 28002xxx/28001xxx 各 11 连号 + type=1 弹窗载体）
--   普通玩家永远够不着。
--
-- 根因（真机 bc 实证，官方配置缺口）：CfgItems 28000024/28000025 `link = 0`
--   ⇒ BaseItemVO.canUse() = (link ~= 0) = false（方法，不是字段）：
--   · BagItemOperaPanel.onGUI 尾部 `btnUse.Text = … and :canUse() and "使用" or "关闭"`；
--   · BagItemOperaPanel.onUseClick 首行 `if not :canUse() or onlyShow then close(true)`。
--   官方 desc「可随机获得一种蓝色/紫色礼物」即"服务端随机"语义（CfgItems.data={}）
--   —— link=0 是官方配置缺口，服务端语义早已按"可使用"实现。
--
-- 修法（两刀，均"原函数命中即原样返回"口径）：
--   刀1 · 包装 BaseItemVO.canUse：原函数为真照常 true；为假且 typeId ∈ {28000024,
--        28000025} 放行 true。一处同时修好按钮文案与 onUseClick 闸（两者都读同一方法）。
--        消费面已枚举（D10 纪律）：BagItemOperaPanel 为目标；ArkFight/ServantSelect 等
--        其余 :canUse() 是指令卡/材料选择面板，礼物 data={} 不会被那些面板的其它过滤
--        条件选中；指令卡/狂化 VO 自带 canUse 覆盖，不经本基类方法，零溅射。
--   刀2 · 包装 BagItemUsePanel.update（多选面板，curNum>1 时 onUseClick 走这里）：
--        官方 `nsUse.Max = math.min(curNum, itemVo.maxUse)` 而 CfgItems.maxUse=0
--        ⇒ Max=0、Value=1 被钳成 0，确定发送 usenum=0（服务端钳回 1，一次只开 1 个，
--        十件要点十次）。尾包按服务端 openMysteryGift 的单次上限改
--        `nsUse.Max = math.min(curNum, 10)`。lblMax 官方本就因 maxUse=0 隐藏，不动。
--
-- ⚠️ 安装 guard：两处替换的都是**文件内已有函数**——必须验原函数已存在才动手
--    （三百一十二口径，防占位被 AutoGen require 链覆盖回去）。BaseItemVO 是 Core VO
--    早加载；BagItemUsePanel 随 BagModule 链加载，未就绪时 skip 留待下个
--    checkOnSendProto tick 重试（背包打开必发 m_goods_bag_info_tos，先于渲染）。
-- ⚠️ 神秘物品 31000010（desc「诡异的物品…」）**不在本补丁范围**：无任何产出定义，
--    放行只会落 D11 假失败——需要先定产出表（另案）。
-- ═══════════════════════════════════════════════════════════════════════════
local psMysteryGiftCanUseInstalled = false
local psMysteryGiftUsePanelInstalled = false

function psInstallMysteryGiftCanUsePatch()
	-- 刀1：BaseItemVO.canUse 只对两件礼物放行（原函数为真恒原样返回）
	if not psMysteryGiftCanUseInstalled then
		local VO = rawget(_G, "BaseItemVO")
		if type(VO) == "table" and type(VO.canUse) == "function" then
			local origCanUse = VO.canUse
			VO.canUse = function(self)
				if origCanUse(self) then
					return true
				end
				return self ~= nil and (self.typeId == 28000024 or self.typeId == 28000025)
			end
			psMysteryGiftCanUseInstalled = true
			print("PS-MYSTERY-GIFT-CANUSE: BaseItemVO.canUse 放行 28000024/28000025")
		end
	end
	-- 刀2：BagItemUsePanel.update 尾包——多选滑条上限对齐服务端单次上限 10
	if not psMysteryGiftUsePanelInstalled then
		local UP = rawget(_G, "BagItemUsePanel")
		if type(UP) ~= "table" then
			local BM = rawget(_G, "BagModule")
			if type(BM) == "table" then
				UP = rawget(BM, "BagItemUsePanel")
			end
		end
		if type(UP) == "table" and type(UP.update) == "function" then
			local origUpdate = UP.update
			UP.update = function(self, ...)
				origUpdate(self, ...)
				if self.isUseAct and self.itemVo ~= nil
					and (self.itemVo.typeId == 28000024 or self.itemVo.typeId == 28000025) then
					self.nsUse.Max = math.min(self.itemVo.curNum or 1, 10)
				end
			end
			psMysteryGiftUsePanelInstalled = true
			print("PS-MYSTERY-GIFT-CANUSE: BagItemUsePanel.update 尾包（单次上限 10）")
		end
	end
end


-- ═══════════════════════════════════════════════════════════════════════════
-- PS-SKIN-L2D-SET（2026-11-08 三百二十一）：虎儿/雀儿时装 Live2D 预览定位补齐。
--
-- 背景：live2d/ 不在 merge_kr_res 首轮白名单 ⇒ 虎儿 284500111 / 雀儿 284300211 的
--   Live2D 模型（live2d/servant/l_284500111、l_284300211）三层来源全缺（出货树/
--   基座 APK 都没有——KR 限定内容本就不在 CN 包里），时装弹窗（FashionPopupPanel）
--   默认 togLive2d.IsOn=true → ServantCardView.SHOW_LIVE2D → 加载落空 ⇒ 预览空白。
--   资源已随 `merge_kr_res.py --only live2d` 补进出货树（97 文件，含 4 套进化链
--   Live2D 与基座 APK 逐字节同款的影子拷贝）。
--
-- 本补丁只补**预览定位配置**：ServantCardView.showLive2d 消费
--   ServantConfig.getLive2dSet(skinID)（= CfgServant.live2dSet[skinID]）取
--   size/pos；CN 配置没有这两只的条目（国服从未上架这对皮肤），回落默认
--   {size=1.32, pos={0,0}}——模型能显示但大小/位置偏离官方。KR 客户端
--   CfgServant（H:\1103megafiles\res\luascript\config.ab 反编译）官方值：
--     284500111 {maxScale=1, size=1.6, scale=1, minScale=0.7, pos={-312,-104}}
--     284300211 {maxScale=1, size=1.4, scale=1, minScale=0.7, pos={-240,-160}}
--
-- 修法：向 CfgServant.live2dSet **增量注入**两条（纯新增键，绝不覆盖既有条目；
--   已存在则跳过）。不改 getLive2dSet 函数本身（比包函数更窄，零行为溅射）。
--   ServantConfig.init 缓存的是表引用，先注后读都可见。ConfigMgr 未就绪时跳过，
--   留待下个 checkOnSendProto tick 重试。
-- ═══════════════════════════════════════════════════════════════════════════
local psSkinL2dSetInstalled = false

function psInstallSkinLive2dSetPatch()
	if psSkinL2dSetInstalled then
		return
	end
	local CM = rawget(_G, "ConfigMgr")
	if type(CM) ~= "table" or type(CM.getConfig) ~= "function" then
		return
	end
	local ok, cfg = pcall(CM.getConfig, "CfgServant")
	if not ok or type(cfg) ~= "table" or type(cfg.live2dSet) ~= "table" then
		return
	end
	if cfg.live2dSet[284500111] == nil then
		cfg.live2dSet[284500111] = { maxScale = 1, size = 1.6, scale = 1, minScale = 0.7, pos = { -312, -104 } }
	end
	if cfg.live2dSet[284300211] == nil then
		cfg.live2dSet[284300211] = { maxScale = 1, size = 1.4, scale = 1, minScale = 0.7, pos = { -240, -160 } }
	end
	psSkinL2dSetInstalled = true
	print("PS-SKIN-L2D-SET: live2dSet 注入 284500111/284300211（KR 官方定位）")
end
