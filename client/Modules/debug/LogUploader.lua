module("LogUploader", package.seeall)

-- 本地服补丁（2026-10-11 一百六十~一百六十二）：GM 面板手动上传运行日志到云端（仅手动触发，无任何自动上报）。
-- 入口：GM 调试面板"指令/常用"第一个按钮「上传运行日志」（DebugModuleAutoGen 补丁注入）。
--
-- 增量模型（一百六十二，替代"每次全量打包当天会话"的批次模型——旧模型跨批次重复上传同文件）：
--   * 采集枚举 persistentDataPath/logs/ 全部日期目录的全部会话 .txt（CLogWiter 跨午夜不换目录），
--     排序后只取最近 MAX_LOG_FILES=10 个（二百一十二：不再打包全部历史日志）；
--   * 每文件记住已传字节偏移（extcfg "LogUploaderOffsets"，JSON {存储名: offset}）；
--   * 只传 offset 起的增量；无任何新增 → Tips"暂无新增日志"并跳过 POST；
--   * 服务端扁平存储 <deviceId>/<存储名>.txt，offset 处原地追加；响应逐文件 ack {name, ok, size|needFull}；
--     ok → offset=ack.size；needFull（服务端文件被 TTL 清掉/失配）→ offset=0，下次全量重传。
-- 上传地址不再存储（二百九十一，2026-11-01）：客户端/服务端/仓库一律不存公网 IP——
--   点按钮先弹「输入日志服务器地址（IP:端口）」，本轮上传的全部分块用它拼
--   http://<host:port>/upload?key=<DEFAULT_KEY>；输入只在 Lua 模块变量里预填（会话内存，
--   重启即失），绝不写 extcfg/存档。key 是接收器共享校验值（非地址），留作常量见 DEFAULT_KEY。
-- 配额：服务端按设备 150MB/自然周（周一 00:00 重置）计费（落盘字节），429 拒收时给友好提示。
-- WebHttp.HttpPostReturn 同步阻塞：先 setTimeout 让 Tips 渲染。

-- 脱敏沿革：2026-10-12 撤掉写死的公网地址改两档取值（当时兜底回环）；一百七十五补 extcfg 下发；
--   二百九十一 起**彻底去存储化**——上传地址只由上传者当场输入，本文件不再读取旧上传地址/键两
--   extcfg 键（BootPipeline 启动时把设备存量抹成空串），全源码不得再出现任何公网地址字面量
--   （出厂闸门 ①h audit_no_hardcoded_addr.js 拦截）。
DEFAULT_KEY = "fzzl2026"   -- 接收器 ?key= 共享校验值（非地址；历史上已随旧包公开，二百九十一 决策留常量）
MAX_DELTA_BYTES = 2 * 1024 * 1024      -- 单文件单次增量上限，超出部分下次继续传
MAX_LOG_FILES = 10                     -- 最多只上传最近 10 个会话日志（不打包全部历史日志）
OFFSETS_KEY = "LogUploaderOffsets"

-- 字节数 → 人类可读（进度提示用）
function fmtBytes(n)
	if n >= 1048576 then
		return string.format("%.1fMB", n / 1048576)
	elseif n >= 1024 then
		return string.format("%.0fKB", n / 1024)
	end

	return tostring(n) .. "B"
end

local function sv(fn, ...)
	if fn == nil then
		return "nil"
	end

	local ok, v = pcall(fn, ...)

	if ok and v ~= nil then
		return tostring(v)
	end

	return "nil"
end

local function sysCfg(key)
	-- GetAllCfg = syscfg（服务器推送）优先、extcfg.json（start.ps1 推的设备配置）兜底；
	-- 只用 GetSysCfg 读不到 extcfg 键（真机踩过：POST 打去了默认云地址）。
	local ok, v = pcall(SystemConfig.GetAllCfg, key)

	if ok and v ~= nil and v ~= "" then
		return tostring(v)
	end

	return nil
end

-- 手动输入地址 → 规范化 base（http://<host:port>）。合法返回 base；非法返回 nil + 原因。
-- 兼容粘贴完整地址：可选 http:// 前缀、结尾 / 与 /upload、?query 一律剥掉（二百九十一）。
-- https 直接拒：WebHttp 是明文 HTTP，接收器也无 TLS。
function normalizeAddress(input)
	local s = string.lower(tostring(input or ""))
	s = string.gsub(s, "^%s+", "")
	s = string.gsub(s, "%s+$", "")

	if string.sub(s, 1, 8) == "https://" then
		return nil, "仅支持 http 地址（接收器无 TLS）"
	end

	s = string.gsub(s, "^http://", "")
	s = string.gsub(s, "%?.*$", "")
	s = string.gsub(s, "/+$", "")
	s = string.gsub(s, "/upload$", "")

	local host, port = string.match(s, "^([%w%.%-]+):(%d+)$")

	if host == nil or host == "" then
		return nil, "地址格式应为 IP:端口"
	end

	port = tonumber(port)

	if port < 1 or port > 65535 then
		return nil, "端口应在 1~65535"
	end

	return "http://" .. host .. ":" .. port
end

function buildUploadUrl(base)
	return base .. "/upload?key=" .. DEFAULT_KEY
end

function collectDeviceInfo()
	local role = "nil"

	if SystemConfig.IsDebug and GlobalData and GlobalData.myRoleIDNum then
		role = tostring(GlobalData.myRoleIDNum)
	else
		role = tostring(SystemConfig.RoleId)
	end

	return {
		IsDebug = tostring(SystemConfig.IsDebug),
		AppVersion = tostring(SystemConfig.AppVersion),
		ResVersion = tostring(SystemConfig.ResVersion),
		ServerID = tostring(SystemConfig.ServerID),
		AgentID = tostring(SystemConfig.AgentID),
		RoleId = role,
		Account = tostring(SystemConfig.Account),
		deviceId = tostring(SystemConfig.deviceId),
		mMachine = tostring(SystemConfig.mMachine),
		ipAddress = tostring(SystemConfig.ipAddress),
		deviceName = tostring(SystemConfig.deviceName),
		operatingSystem = tostring(SystemConfig.operatingSystem),
		systemMemorySize = tostring(SystemConfig.systemMemorySize),
		resolution = tostring(SystemConfig.resolution),
		macAddress = tostring(SystemConfig.macAddress),
		clientIp = tostring(SystemConfig.clientIp),
		ssVersion = tostring(SystemConfig.ssVersion),
		SessionID = sv(SDKMgr and SDKMgr.getSessionID),
		ClientID = sv(SDKMgr and SDKMgr.getPushDeviceToken),
		OID = tostring(sysCfg("OID")),
		NetworkType = sv(PlatFormInfo and PlatFormInfo.GetNetworkType),
		OperatorName = sv(PlatFormInfo and PlatFormInfo.GetOperatorName),
		LuaRemoteIP = tostring(sysCfg("LuaRemoteIP")),
		uploadTime = os.date("%Y-%m-%d %H:%M:%S")
	}
end

function getLogRoot()
	return Application.persistentDataPath .. "/logs/"
end

-- 枚举全部日期目录的会话文件：{{path, name(存储名=日期目录_文件名)}...}，按名排序（即按时间）
function collectLogFiles()
	local root = getLogRoot()
	local out = {}
	local dirs = Directory.GetDirectories(root)

	for i = 0, dirs.Length - 1 do
		local dateDir = tostring(dirs[i])
		local dateName = string.match(dateDir, "[^/\\]+$")

		if dateName and string.len(dateName) == 10 and string.sub(dateName, 5, 5) == "_" then
			local paths = Directory.GetFiles(dateDir)

			for j = 0, paths.Length - 1 do
				local full = tostring(paths[j])
				local fileName = string.match(full, "[^/\\]+$")

				if fileName and string.len(fileName) > 4 and string.sub(fileName, -4) == ".txt" then
					table.insert(out, {
						path = full,
						name = dateName .. "_" .. fileName
					})
				end
			end
		end
	end

	table.sort(out, function (a, b)
		return a.name < b.name
	end)

	-- 只保留最近 MAX_LOG_FILES 个：name = 日期目录_会话名，两段都是零填充 ⇒ 字典序即时间序。
	-- 更早的历史会话一律不再上传，避免"点一次就把全部历史日志打包"（时间/流量/配额）。
	if #out > MAX_LOG_FILES then
		local total = #out

		while #out > MAX_LOG_FILES do
			table.remove(out, 1)
		end

		GLog.Info("[LogUploader] 日志文件 " .. tostring(total) .. " 个，仅保留最近 " .. tostring(MAX_LOG_FILES) .. " 个")
	end

	return out
end

local function loadOffsets()
	local raw = sysCfg(OFFSETS_KEY)

	if raw then
		local ok, t = pcall(cjson.decode, raw)

		if ok and type(t) == "table" then
			return t
		end
	end

	return {}
end

local function saveOffsets(offsets)
	local ok, raw = pcall(cjson.encode, offsets)

	if ok then
		pcall(SystemConfig.SaveExtCfg, OFFSETS_KEY, tostring(raw))
		pcall(SystemConfig.SaveExtCfg)
	end
end

-- 组增量包：无任何新增 → 返回 nil（调用方跳过 POST）
function buildPayload()
	local offsets = loadOffsets()
	local files = collectLogFiles()
	local payloadFiles = {}

	for _, f in ipairs(files) do
		local fh, err = io.open(f.path, "rb")

		if not fh then
			GLog.Warning("[LogUploader] 打不开日志文件 " .. f.path .. ": " .. tostring(err))
		else
			local fullSize = fh:seek("end")
			local off = tonumber(offsets[f.name]) or 0

			if off > fullSize then
				off = 0
			end

			if off < fullSize then
				-- 一百八十五：每文件每轮最多读 MAX_DELTA_BYTES（2MB）增量——10 个大文件一次打包
				-- 40MB 会生成几十个串行 POST、跑一分多钟；按 2MB 分批，点一次传一部分，
				-- 其余下次点击自动续传（offset 已持久化）。
				local avail = fullSize - off
				local take = math.min(avail, MAX_DELTA_BYTES)

				fh:seek("set", off)

				local text = fh:read(take)

				table.insert(payloadFiles, {
					name = f.name,
					size = fullSize,
					offset = off,
					text = text
				})
			end

			fh:close()
		end
	end

	if #payloadFiles == 0 then
		return nil
	end

	-- noteFor（183）：本次实际有增量的文件名——服务端把备注写到这些文件的侧车 .note，
	-- 查看器在文件行旁显示"与他同期上传的备注"。同名多次上传以最新为准（服务端覆盖写）。
	local noteFor = {}

	for _, f in ipairs(payloadFiles) do
		table.insert(noteFor, f.name)
	end

	return {
		device = collectDeviceInfo(),
		logDir = getLogRoot(),
		files = payloadFiles,
		noteFor = noteFor
	}
end

-- 会话内地址记忆（二百九十一）：纯 Lua 模块变量，重启即失，绝不写 extcfg/存档/磁盘。
local lastAddrInput, pendingAddrBase

-- 备注弹窗（一百八十二）：AlertInputPanel 现役组件（ServantFeelItem 同款用法）。
-- 备注（≤120 字）随 payload.note 上报；取消也继续上传（note 缺省）。
-- 二百九十一起由 upload() 的地址弹窗通过 showNoteAndUpload() 进入。
function showNoteAndUpload()
	AlertInputPanel.show({
		height = 418,
		charLimit = 120,
		tip = "上传运行日志（连带当前存档）",
		placeholder = "描述遇到的情况/复现步骤（可留空）",
		rightLabel = "上 传",
		width = 635,
		alignment = TextAnchor.UpperLeft,
		rightHandle = function (note)
			pcall(function () AlertInputPanel.hide() end)
			Tips.addTips("正在收集日志与存档…")
			LoopManager.setTimeout(function () doUpload(tostring(note or "")) end, 0.1)
		end
	})
end

-- 地址弹窗（二百九十一）：公网 IP 不入库，上传前手动输入（IP:端口，可粘完整 http 地址）。
-- 校验不过 → Tips 报原因、弹窗留着不关（输入还在框里，改完再点「下一步」）；
-- 校验通过 → 记会话预填 + pendingAddrBase，hide 后进备注弹窗。取消（左键）则整单不传。
function upload()
	AlertInputPanel.show({
		height = 330,
		charLimit = 100,
		tip = "输入日志服务器地址（IP:端口）",
		placeholder = "IP:端口，向管理员获取",
		text = lastAddrInput or "",
		rightLabel = "下一步",
		rightHandle = function (addrText)
			local base, why = normalizeAddress(addrText)

			if base == nil then
				Tips.addTips("地址没过：" .. tostring(why))

				return
			end

			lastAddrInput = tostring(addrText or "")
			pendingAddrBase = base

			pcall(function () AlertInputPanel.hide() end)
			LoopManager.setTimeout(showNoteAndUpload, 0.1)
		end
	})
end

-- 存档获取（一百八十二·改）：WebHttp 同步 GET 服务端 HTTP 路由 /ps_savefile（flushSave 后返回
-- 存档原文，PCJS=http://10.0.2.2:80 由 Router syscfg 派生；单机=http://127.0.0.1:8081 内置服）。
-- 最初走 GM 通道（m21_savefile → m_debugger_info_toc）已废弃：toc 分发在注册时持有 handler
-- 引用，运行时替换拦不住 → 236KB 存档被官方详情面板渲染（Unity Text 爆 65k 顶点，用户实拍）。
-- URL 派生：Router syscfg（两管线均预置）+ /ps_savefile；取不到（>15s 超时保护不适用——同步
-- 调用天然阻塞，WebHttp.TIME_OUT=300s 太长，靠回环速度保证）就 nil，本次无存档。
local function fetchSaveJson()
	local router = sysCfg("Router")

	if router == nil or router == "" then
		GLog.Warning("[LogUploader] 无 Router syscfg，跳过存档")

		return nil
	end

	local base = string.gsub(router, "/+$", "")
	local url = base .. "/ps_savefile"

	local ok, body = pcall(WebHttp.HttpPostReturn, url, "", false)

	if ok and body ~= nil and body ~= "" and string.sub(body, 1, 1) == "{" then
		GLog.Info("[LogUploader] savefile fetched: " .. tostring(#body) .. "B")

		return tostring(body)
	end

	GLog.Warning("[LogUploader] savefile 获取失败：url=" .. url .. " body=" .. tostring(string.sub(tostring(body), 1, 60)))

	return nil
end

-- 分块传输（一百六十五）：WebHttp.HttpPostReturn 是同步调用、阻塞 Unity 主线程，
-- 真机上单包过大（兆级）会卡死界面乃至 ANR 闪退（Pad 实测 1.1MB 单包）。
-- 改为：每个文件的增量切成 ≤512KB 的包，逐包顺序 POST，包间 setTimeout 让出主线程；
-- 逐包 ack 推进偏移，中途失败/配额拒收 → 停止，下次点击从已确认偏移自动续传。
local CHUNK_BYTES = 2 * 1024 * 1024   -- 一百八十五：512KB→2MB，慢链路下把串行 POST 次数降到 1/4
local upQueue, upQueueIdx, upDevice, upLogDir, upUrl, upMeta
local upTotalBytes, upDoneBytes

function buildUploadQueue(payloadFiles)
	local queue = {}

	for _, f in ipairs(payloadFiles) do
		local total = #f.text

		if total <= CHUNK_BYTES then
			table.insert(queue, { name = f.name, size = f.size, offset = f.offset, text = f.text })
		else
			local consumed = 0

			while consumed < total do
				local n = math.min(CHUNK_BYTES, total - consumed)

				table.insert(queue, {
					name = f.name,
					size = f.size,
					offset = f.offset + consumed,
					text = string.sub(f.text, consumed + 1, consumed + n)
				})

				consumed = consumed + n
			end
		end
	end

	return queue
end

function doUpload(userNote)
	doUploadCore(userNote)
end

function doUploadCore(userNote)
	local ok, payload = pcall(buildPayload)

	if not ok then
		Tips.addTips("收集日志失败：" .. tostring(payload))
		GLog.Warning("[LogUploader] buildPayload error: " .. tostring(payload))

		return
	end

	-- 无新增日志但带存档/备注时也允许上传（用户点按钮就是要交东西）
	if payload == nil then
		payload = {
			device = collectDeviceInfo(),
			logDir = getLogRoot(),
			files = {}
		}
	end

	payload.note = tostring(userNote or "")
	payload.save = fetchSaveJson()

	if payload.save then
		GLog.Info("[LogUploader] savefile attached: " .. tostring(#payload.save) .. "B")
	else
		Tips.addTips("存档获取超时，本次仅上传日志")
	end

	upQueue = buildUploadQueue(payload.files)
	upQueueIdx = 0
	upTotalBytes = 0
	upDoneBytes = 0

	for _, e in ipairs(upQueue) do
		upTotalBytes = upTotalBytes + #e.text
	end
	upDevice = payload.device
	upLogDir = payload.logDir

	-- 二百九十一：地址只能来自本次地址弹窗（防呆——doUpload 理论上不会在无地址时被调到）
	if pendingAddrBase == nil then
		Tips.addTips("未输入日志服务器地址")

		return
	end

	upUrl = buildUploadUrl(pendingAddrBase)
	upMeta = {
		note = payload.note,
		save = payload.save,
		noteFor = payload.noteFor or {}
	}

	GLog.Info("[LogUploader] upload start: " .. tostring(#upQueue) .. " chunk(s)" .. (upMeta.save and " +savefile" or ""))

	Tips.addTips("上传日志 0/" .. tostring(#upQueue) .. " …")
	LoopManager.setTimeout(uploadNext, 0.1)
end

function uploadNext()
	upQueueIdx = upQueueIdx + 1
	local entry = upQueue[upQueueIdx]

	if entry == nil then
		-- 日志块传完：若带存档/备注，追加一个 meta 包（服务端落 save_<账号>.json + note→noteFor 侧车）
		if upMeta and (upMeta.save or (upMeta.note and upMeta.note ~= "")) then
			local okMeta, metaBody = pcall(cjson.encode, {
				device = upDevice,
				logDir = upLogDir,
				note = upMeta.note,
				noteFor = upMeta.noteFor,
				save = upMeta.save,
				files = {}
			})

			upMeta = nil

			if okMeta then
				GLog.Info("[LogUploader] POST[meta] bytes=" .. tostring(#metaBody))

				local resp = WebHttp.HttpPostReturn(upUrl, metaBody, true)

				if resp ~= nil and string.find(resp, '"ok":true', 1, true) then
					Tips.addTips("日志与存档上传完成")
				else
					Tips.addTips("日志已传，存档/备注包失败：" .. tostring(WebHttp.errorMsg or "无响应"))
				end

				upQueue = nil

				return
			end
		end

		Tips.addTips("日志上传完成（" .. tostring(upQueueIdx - 1) .. " 包，仅增量）")
		GLog.Info("[LogUploader] upload all chunks done")

		upQueue = nil

		return
	end

	-- 一百八十五：进度按**字节**显示百分比，不再逐包跳数（用户看到的"1 跑到一百多"就是包数）
	local pct = upTotalBytes > 0 and math.floor((upDoneBytes + #entry.text) / upTotalBytes * 100) or 0
	Tips.addTips("上传日志 " .. tostring(math.min(pct, 100)) .. "%（" .. tostring(fmtBytes(upDoneBytes)) .. "/" .. tostring(fmtBytes(upTotalBytes)) .. "）")

	local okJson, body = pcall(cjson.encode, {
		device = upDevice,
		logDir = upLogDir,
		files = { entry }
	})

	if not okJson then
		Tips.addTips("日志编码失败（非 UTF-8 内容？）")
		GLog.Warning("[LogUploader] cjson.encode error: " .. tostring(body))

		upQueue = nil

		return
	end

	-- 二百九十一：**不打印完整 URL**——地址会随本会话日志再被传上云，接收器落盘内容里
	-- 不得残留公网 IP（自泄漏环）。
	GLog.Info("[LogUploader] POST[" .. tostring(upQueueIdx) .. "/" .. tostring(#upQueue) .. "] bytes=" .. tostring(#body))

	local resp = WebHttp.HttpPostReturn(upUrl, body, true)

	-- 网络抖动兜底（一百八十二）：真机 MuMu 实测偶发单包空响应（health 同刻 200），
	-- 单包重试一次；重试仍失败才走失败分支（偏移未确认，下次自动续传）。
	if (resp == nil or resp == "") and tonumber(upQueueIdx) then
		GLog.Warning("[LogUploader] empty resp, retry once in 1s")

		LoopManager.setTimeout(function ()
			local resp2 = WebHttp.HttpPostReturn(upUrl, body, true)

			if resp2 ~= nil and string.find(resp2, '"ok":true', 1, true) then
				applyAcks(resp2)

				LoopManager.setTimeout(uploadNext, 0.05)
			else
				Tips.addTips("日志上传失败（第 " .. tostring(upQueueIdx) .. "/" .. tostring(#upQueue) .. " 包，含重试）：" .. tostring(resp2 ~= nil and resp2 ~= "" and string.sub(resp2, 1, 80) or (WebHttp.errorMsg or "无响应")))
				GLog.Warning("[LogUploader] upload failed after retry at chunk " .. tostring(upQueueIdx))

				upQueue = nil
			end
		end, 1)

		return
	end

	if resp ~= nil and string.find(resp, '"ok":true', 1, true) then
		applyAcks(resp)

		upDoneBytes = upDoneBytes + #entry.text

		LoopManager.setTimeout(uploadNext, 0.05)
	elseif resp ~= nil and string.find(resp, '"error":"quota"', 1, true) then
		-- 服务器 7×24h 滚动窗口配额拒收（429）：停止队列，已传包的偏移已确认，放行后点击自动续传
		Tips.addTips("本周上传配额已满，服务器已拒收——请在日志检查工作台放行后再试")
		GLog.Warning("[LogUploader] upload rejected by quota at chunk " .. tostring(upQueueIdx) .. ": " .. tostring(string.sub(resp, 1, 200)))

		upQueue = nil
	else
		Tips.addTips("日志上传失败（第 " .. tostring(upQueueIdx) .. "/" .. tostring(#upQueue) .. " 包）：" .. tostring(resp ~= nil and resp ~= "" and string.sub(resp, 1, 80) or (WebHttp.errorMsg or "无响应")))
		GLog.Warning("[LogUploader] upload failed at chunk " .. tostring(upQueueIdx) .. ": resp=" .. tostring(resp) .. " errorMsg=" .. tostring(WebHttp.errorMsg))

		upQueue = nil
	end
end

-- 按服务端逐文件 ack 推进偏移量：ok → offset=ack.size；needFull → offset=0（下次全量重传）
function applyAcks(resp)
	local ok, data = pcall(cjson.decode, resp)

	if not ok or type(data) ~= "table" or type(data.results) ~= "table" then
		return
	end

	local offsets = loadOffsets()
	local changed = false

	for _, r in ipairs(data.results) do
		if type(r.name) == "string" then
			if r.ok and type(r.size) == "number" then
				offsets[r.name] = r.size
				changed = true
			elseif r.needFull then
				offsets[r.name] = 0
				changed = true
			end
		end
	end

	if changed then
		saveOffsets(offsets)
	end
end

-- 供 DebugModuleAutoGen 补丁在首次打开 GM 面板前调用：把按钮条目注入 CfgDebug 配置表
-- （ConfigMgr.getConfig 懒加载 require("Config/Data/CfgDebug")，别名链映射帧内 Config/CfgDebug）。
-- 注入的是配置表本体，无论 initGmConfig 先后拷贝引用都能看到；只注入一次。
function injectButtonEntry()
	if _G.__fzzlUploadEntryInjected then
		return
	end

	_G.__fzzlUploadEntryInjected = true

	local cfg = ConfigMgr.getConfig("CfgDebug")

	if cfg == nil or cfg._params_SubViewCommand == nil or cfg._params_SubViewCommand[1] == nil then
		GLog.Warning("[LogUploader] CfgDebug 未就绪，上传按钮注入跳过")

		_G.__fzzlUploadEntryInjected = false

		return
	end

	table.insert(cfg._params_SubViewCommand[1], 1, {
		name = "上传运行日志",
		gmCode = "GM_UPLOAD_LOG",
		codeParamVO = {}
	})

	GLog.Info("[LogUploader] GM 面板已注入「上传运行日志」按钮")
end
