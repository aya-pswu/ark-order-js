-- 本地服修改（2026-08-28 多账号登录链；2026-11-01 二百九十三去密码）：
-- 把官方「内网调试登录面板」改造成自建账号面板。
--
-- 【为什么是这个面板】官方 LoginPanel 本来就是内网用的账号输入面板：预制体里现成有
--   Input_Account（CTextInput）+ cbAccount（历史账号下拉）+ btnLogin + btnTestPanel，
--   一个 AB 都不用改。
--
-- 【二百九十三：单机服只校验账号，没有密码】密码行整体移除（预制体本来也没有密码框，
--   旧版是运行期克隆出来的）。服务端 register/login 不再校验口令，新名字点登录即注册。
--
-- 【二百九十三：账号名不预填官方档】出厂 accounts.json 的 lastAccount 为空 ⇒ 服务端
--   list 接口的 last 也是空 ⇒ 全新安装登录框是空的，必须手动输入；登录/注册成功一次后
--   客户端把名字写进 extcfg（PsAccount，设备本地、升级不丢）、服务端把 lastAccount 记进
--   账号库 ⇒ 下次启动默认填上次输入的那个。
--
-- 【为什么必须在这一步而不是"点击屏幕开始游戏"那一步】账号（uid）是在 TCP 握手的
--   m_auth_key_tos 里定死的，而"点击屏幕"（LoginBgPanel.onClickMainBg → touchToContinue）
--   发生在 m_role_detail_toc 之后 —— 那时早就以某个账号登录完了，只是把登录背景层销毁。
--   所以账号 UI 只能插在连服务器之前；"点击屏幕"那一屏另外挂了个「切换账号」按钮
--   （见 LoginBgPanel.lua），点它走 RE_LOGIN 回到这里。
--
-- 【停住登录链的门】SDKMgr.isNeedLoginPanel() 为真时 LoginModule.secondLogin() 只
--   openLoginPanel() 而**不会**自己 queryServerState()，登录链正好停在我们手上；
--   isUseLoginLocal() 看的是 isThirdPlatform()（仍为 false），所以登录服 URL 还是官方那条，
--   不会被带去内网调试地址。这两个判断的全部消费者只有 SDKMgr / LoginMgr / LoginModule 三个文件。
module("LoginModule", package.seeall)
require("Modules.Login.View.AutoGen.LoginPanelAutoGen")

print("PS-LOGIN-ACCOUNT-PANEL-LOADED")

if SDKMgr then
	SDKMgr.isNeedLoginPanel = function ()
		return true
	end
end

local EXT_ACCOUNT = "PsAccount"
local EXT_TOKEN = "PsToken"
-- 预制体实测坐标（真机 PS-LAYOUT 取证，见 tools/bc_cmp/log_layout2.txt）：
--   LoginPanel/Img_AccountBg (0,-148.8) 404x68，里面只有 Input_Account (64.3,2.7)，
--     「帳號」字样和小人图标是烤进背景图的，没有独立 label 子物体；
--   LoginPanel/btnLogin (0,-256) 256x84；
--   LoginPanel/objDebug (0,0)，**cbAccount(20,-150) / cbServer(20,-50) / btnTestPanel 都是它的子物体**
--     —— 所以不能整块隐藏 objDebug，否则账号下拉一起没了（第一版就踩了这个）。
local Y_BTN_LOGIN = -256
local Y_CB_ACCOUNT = 40

local function psTrim(s)
	return (string.gsub(tostring(s or ""), "^%s*(.-)%s*$", "%1"))
end

-- 账号名要塞进 URL query，非字母数字一律百分号转义（按字节转，UTF-8 也安全）
local function psUrlEncode(s)
	return (string.gsub(tostring(s or ""), "[^%w%-%._~]", function (c)
		return string.format("%%%02X", string.byte(c))
	end))
end

local function psApiUrl(action, name)
	return SystemConfigLua.getRouter() .. "/ps_account?action=" .. action
		.. "&name=" .. psUrlEncode(name or "")
end

-- LoginMgr.lua 在本文件**之后**加载（LoginModule.lua 先 require AutoGen 链、再 require LoginMgr），
-- 所以不能在文件作用域改它的函数——只能等到运行期（面板 initUI / LoginBgPanel initUI）再打。
function psPatchLoginMgr()
	if LoginMgr == nil or LoginMgr.psPatched then
		return
	end

	LoginMgr.psPatched = true

	-- uid：m_auth_key_tos.uid，服务端按它选存档（server/handlers/role.js → accounts.resolveLogin）
	LoginMgr.getLoginAccount = function ()
		local n = LoginMgr.account

		if n == nil or n == "" then
			n = SystemConfig.GetExtCfg(EXT_ACCOUNT)
		end

		return n or ""
	end

	-- session_id：送 HTTP 登录换回来的 token（与密码无关，服务端每次登录轮换）
	LoginMgr.getLoginSession = function ()
		local t = LoginMgr.psToken

		if t == nil or t == "" then
			t = SystemConfig.GetExtCfg(EXT_TOKEN)
		end

		return t or ""
	end
end

ServerRender = class("ServerRender", BaseRender)

function ServerRender.onGUI(slot0, slot1)
	slot0.lblContent.text = slot1
end

-- CButton.Text 的 setter 直接写 label.text，而这个预制体的 btnLogin **没挂 label**
-- （真机实证：写 .Text 抛 "Object reference not set"，initUI 被 xpcall 吞掉后半段全不执行）。
-- 所以改文案必须先确认 label 在，且整体 pcall 兜住。
local function psSetBtnText(btn, txt)
	if btn == nil then
		return false
	end

	local ok = pcall(function ()
		if btn.label == nil or Util.isNil(btn.label) then
			error("no label")
		end

		btn.Text = txt
	end)

	return ok
end

-- 挪控件（RectTransform 的 localPosition 就够，不用碰 anchoredPosition）
local function psMoveTo(comp, x, y)
	pcall(function ()
		local t = comp.transform or comp
		t.localPosition = Vector3(x, y, t.localPosition.z)
	end)
end

function LoginPanel.initUI(self)
	psPatchLoginMgr()

	-- objDebug 本身要**打开**（cbAccount 账号下拉在它里面，预制体默认是关的，
	-- 官方靠 Util.setActive(objDebug, SystemConfig.IsDebug) 打开），只关里面的内网调试件
	Util.setActive(self.objDebug, true)
	Util.setActive(self.cbServer, false)
	Util.setActive(self.chbOpenGuide, false)
	Util.setActive(self.chbAccelerate, false)
	Util.setActive(self.chbFightAccelerate, false)
	Util.setActive(self.cbgPlatform, false)
	Util.setActive(self.chbDebugRelease, false)

	-- 只留一个按钮：btnLogin 既登录也（首次）自动注册（action=auto）。
	-- 原因见 psSetBtnText —— 这个预制体的按钮改不了文案，两个改不了文案的按钮比一个更难懂。
	Util.setActive(self.btnTestPanel, false)
	psSetBtnText(self.btnLogin, "登 录")
	psMoveTo(self.btnLogin, 0, Y_BTN_LOGIN)
	psMoveTo(self.cbAccount, 0, Y_CB_ACCOUNT)

	self.inputAccount = self:getChildComponent("Input_Account", "CTextInput")
	-- 预填只认"上次成功登录的名字"（extcfg 是设备本地、升级不丢；服务端 lastAccount 兜 PCJS
	-- 部署会覆盖 extcfg 的场景）。出厂/全新安装两处都为空 ⇒ 输入框为空，必须手动输入。
	--
	-- ⚠️ 出厂态仍预填 "player" 的**真根因**（2026-11-05 真机定位）：
	--   psRefreshAccountList 的异步回调里有 `cbAccount.SelectIndex = 0`（程序化选中下拉第一项），
	--   这会回调 onSelectAccount → 把第一项账号名（出厂包只有 player）写进 inputAccount.text。
	--   于是"initUI 清空成功 → 列表回来 → SelectIndex=0 → player 又被写回"。
	--   排查时所有清空探针读到的都是空串（清空确实成功了），屏幕却仍是 player —— 就是这个回写。
	-- 修法：① onSelectAccount 对程序化选择加 psSuppressSelect 抑制（只有玩家真点选才填）；
	--       ② 该回调末尾再按"是否记住名字"兜一次清空（见 psRefreshAccountList）。
	-- 这里不再做任何清空动作：留给上面两处，避免和它们打架。
	local remembered = SystemConfig.GetExtCfg(EXT_ACCOUNT) or ""
	self.inputAccount.characterLimit = 16
	self.inputAccount:SetPlaceholder("请输入账号")
	self.accountNames = {}
	self.cbAccount.LuaItemRender = ServerRender

	self.cbAccount:AddSelect(selfHandler(self, "onSelectAccount"))

	self.cbAccount.LuaDataProvider = self.accountNames

	self:psRefreshAccountList()
	-- 出厂/未记住账号 ⇒ 输入框留空（显示 Placeholder）。真正的"预填"只在 extcfg 记着名字时做。
	-- ⚠️ 真正的根因不在这里，而是 psRefreshAccountList 里程序化 `cbAccount.SelectIndex = 0`
	--    会回调 onSelectAccount 把下拉第一项写进输入框（见该函数内注释与 onSelectAccount）。
	--    这里只做"记住的名字回填"，不再重复清空（清空由选择回调的抑制 + 该函数末尾兜底完成）。
	if remembered ~= "" then
		pcall(function () self.inputAccount.text = remembered end)
	end
	self:psDumpLayout()
end

-- 排版取证：各控件的父物体与局部坐标（真机日志 grep PS-LAYOUT 就能看排版对不对）
function LoginPanel.psDumpLayout(self)
	pcall(function ()
		local function one(tag, comp)
			if comp == nil or Util.isNil(comp) then
				print("PS-LAYOUT " .. tag .. " = nil")

				return
			end

			local t = comp.transform or comp
			local p = t.localPosition

			print(string.format("PS-LAYOUT %s parent=%s pos=(%.1f,%.1f)", tag,
				tostring(t.parent and t.parent.name or "?"), p.x, p.y))
		end

		one("inputAccount", self.inputAccount)
		one("cbAccount", self.cbAccount)
		one("btnLogin", self.btnLogin)
	end)
end

function LoginPanel.psRefreshAccountList(self)
	WebHttp.AsynGet(psApiUrl("list"), function (data)
		local t = Util.jsonStrToTable(data:ToJson())
		local names = {}

		if t and tostring(t.ret) == "1" and t.data and t.data.accounts then
			for _, a in ipairs(t.data.accounts) do
				table.insert(names, a.name)
			end

			-- 「记住上次账号」双通道：extcfg（设备本地）为主，服务端 lastAccount 兜底——
			-- PCJS 的 start.ps1 每次部署都会把 extcfg_dev.json 覆盖回设备，本地记的
			-- PsAccount 会被抹掉，服务端这份不会。lastAccount 只在真实登录/注册后更新，
			-- 出厂包里恒为空 ⇒ 全新安装不会预填 player 档。
			if self.inputAccount and self.inputAccount.text == "" and t.data.last and t.data.last ~= "" then
				self.inputAccount.text = t.data.last
			end
			-- 异步回调回来后再兜一次清空（initUI 末尾那次可能早于本回调）。
			-- 只在"没有记住的账号名"时清：有记住的名字就该预填，这是设计。
			if (SystemConfig.GetExtCfg(EXT_ACCOUNT) or "") == "" then
				pcall(function () self.inputAccount.text = " " end)
				pcall(function () self.inputAccount.text = "" end)
				pcall(function () self.inputAccount:ForceLabelUpdate() end)
			end
		end

		if #names == 0 then
			table.insert(names, "（还没有账号，填名字点登录即注册）")
		end

		self.accountNames = names
		self.cbAccount.LuaDataProvider = names

		-- 程序化选中第一项时不触发"填写输入框"（见 onSelectAccount 顶部注释）
		pcall(function () self.psSuppressSelect = true end)
		pcall(function ()
			self.cbAccount.SelectIndex = 0
			self.cbAccount.Text = "切换账号 ▼"
		end)
		-- 恢复必须在下一帧（SelectIndex 的回调可能是延迟派发的），用 setTimeout
		pcall(function ()
			setTimeout(function ()
				if self then self.psSuppressSelect = false end
			end, 0.2)
		end)
		-- ⚠️ 真机根因（2026-11-05）：上面这句 `SelectIndex = 0` 会**触发下拉的选择回调**
		-- onSelectAccount，把第一项账号名（出厂档就是 "player"）写进 inputAccount.text。
		-- 于是"initUI 里清空成功 → 异步列表回来 → SelectIndex=0 → player 又被写回"，
		-- 表现为"全新安装仍然预填 player"，且我们所有清空探针读到的都是空（清空确实成功了，
		-- 是之后又被写回来的）。这里在下拉初始化之后再清一次，作为终态兜底。
		if (SystemConfig.GetExtCfg(EXT_ACCOUNT) or "") == "" then
			pcall(function () self.inputAccount.text = " " end)
			pcall(function () self.inputAccount.text = "" end)
			pcall(function ()
				local tc = self.inputAccount.textComponent
				if tc ~= nil then tc.text = "" end
			end)
			pcall(function () self.inputAccount:ForceLabelUpdate() end)
		end

		-- 下拉控件在这个内网面板里不一定渲染得出来（预制体没给它背景图），
		-- 所以账号清单再用飘字兜一遍，保证"我有哪些账号"这件事一定看得见
		if t and t.data and t.data.accounts and #t.data.accounts > 0 then
			local plain = {}

			for _, a in ipairs(t.data.accounts) do
				table.insert(plain, a.name)
			end

			Tips.addTips("已有账号：" .. table.concat(plain, "、"))
		end
	end, function ()
		Tips.addTips("拉取账号列表失败，仍可直接输入账号名登录")
	end)
end

function LoginPanel.onSelectAccount(self, data)
	-- ⚠️ 真机根因（2026-11-05）：psRefreshAccountList 里 `cbAccount.SelectIndex = 0`
	-- 是**程序化**选择，会回调到这里，把第一项账号名（出厂档 "player"）写进输入框。
	-- 这不是玩家操作，绝不能当"预填"用 —— 否则全新安装/出厂态永远被填上 player。
	-- 判据：自增的 suppressSelect 计数，程序化设置前后置位；只有玩家真实点选才写。
	if self.psSuppressSelect then return end

	local name = (string.gsub(tostring(data or ""), "（.*$", ""))

	if name ~= "" then
		self.inputAccount.text = name
	end
end

function LoginPanel.onClickBtnLogin(self)
	self:psSubmit("auto")
end

-- btnTestPanel（原"进测试面板"）在本面板里已隐藏，留着接口以防 AutoGen 的点击绑定被触发
function LoginPanel.onClickBtnTestPanel(self)
	self:psSubmit("auto")
end

function LoginPanel.psSubmit(self, action)
	if self.psBusy then
		Tips.addTips("正在处理，请稍候")

		return
	end

	local name = psTrim(self.inputAccount.text)

	if name == "" then
		Tips.addTips("请输入账号名")

		return
	end

	self.psBusy = true

	WebHttp.AsynGet(psApiUrl(action, name), function (data)
		self.psBusy = false

		local t = Util.jsonStrToTable(data:ToJson())

		if t == nil or tostring(t.ret) ~= "1" or t.data == nil then
			Tips.addTips(t and t.msg or "账号服务器无响应")

			return
		end

		-- 记住账号与 token：LoginMgr.getLoginAccount/getLoginSession 就从这两处取，
		-- m_auth_key_tos 的 uid / session_id 于是带上正确的账号身份
		LoginMgr.account = t.data.name
		LoginMgr.psToken = t.data.token
		SystemConfig.Account = t.data.name

		SystemConfig.SaveExtCfg(EXT_ACCOUNT, t.data.name)
		SystemConfig.SaveExtCfg(EXT_TOKEN, t.data.token)
		SystemConfig.SaveExtCfg()
		Tips.addTips((t.data.created and "注册成功，正在进入：" or "登录中：") .. t.data.name)

		if LoginMgr.canReQueryLoginServer then
			LoginMgr.canReQueryLoginServer = false

			-- 走官方整条链：GetServerNotice → SDKModule.loginSDK() → SDKCallback.onLogin →
			-- queryLoginServer()。**不能直接调 queryLoginServer**：那样 SDK 状态停在未登录，
			-- 之后点屏幕会被 touchToContinue 的第一个分支吃掉去登 SDK 而不是进游戏。
			LoginModule.queryServerState()
		else
			Tips.addTips("正在连接服务器，请稍后")
		end
	end, function ()
		self.psBusy = false

		Tips.addTips("连不上账号服务器：" .. tostring(WebHttp.errorMsg))
	end)
end

function LoginPanel.onOpen(self)
	return
end

function LoginPanel.onRelease(self)
	print("LoginPanel:onRelease")
end
