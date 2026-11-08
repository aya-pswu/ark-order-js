function printTrace(...)
end

_G.printTrace = printTrace

function printWarning(...)
	GLog.Warning("<b><color=#FFFF00FF>" .. getPrintStr(...) .. "</color></b>\n\n" .. debug.traceback() .. "\n\n")
end

_G.printWarning = printWarning

function printError(...)
	GLog.LuaError(csformat([[
<b><color=#B02F2FFF>{0}</color></b>
<color=#aa2222FF>报错函数局部变量:
{1}</color>

{2}]], getPrintStr(...), getLocalVars(3), debug.traceback()))
end

_G.printError = printError

function getLocalVars(slot0)
	if debug.getinfo(slot0 or 3) == nil then
		return ""
	end

	local slot1 = 1
	local slot2 = {}

	while true do
		local slot3, slot4 = debug.getlocal(slot0, slot1)

		if not slot3 then
			break
		end

		if string.find(slot3, "%(") ~= 1 then
			table.insert(slot2, slot3)
			table.insert(slot2, " = ")
			table.insert(slot2, tostring(slot4))
			table.insert(slot2, csformat(" （类型：{0}）", type(slot4)))
			table.insert(slot2, "\n")
		end

		slot1 = slot1 + 1
	end

	return table.concat(slot2)
end

function printFight(...)
end

_G.printFight = printFight

function getPrintStr(...)
	local t = { ... }
	local n = select("#", ...)
	local res = {}
	for i = 1, n do
		local v = t[i]
		res[i] = (v == nil and "nil" or tostring(v))
	end
	return table.concat(res, " ")
end

function printXmm(...)
end

_G.printXmm = printXmm

function printLxfTable(...)
end

_G.printLxfTable = printLxfTable

function printLxf(...)
end

_G.printLxf = printLxf

function printLbz(...)
end

_G.printLbz = printLbz

function printZst(...)
end

_G.printZst = printZst

function printGxh(...)
end

_G.printGxh = printGxh

GLogUtil.SetLogLevelByLua(LogShowType.Editor, {
	LogLevel.All
})
GLogUtil.SetLogLevelByLua(LogShowType.GameConsole, {
	LogLevel.None
})
GLogUtil.SetLogLevelByLua(LogShowType.Editor, {
	LogLevel.Warning,
	LogLevel.Error,
	LogLevel.Except,
	LogLevel.Lua,
	LogLevel.LuaError,
	LogLevel.UserGxh
})

-- 运行时动态补全 CfgBuff 缺失的图标与特殊 Buff 展示
local _old_require = require
_G.require = function(modname)
	local res = _old_require(modname)
	if modname == "Config.ConfigMgr" or modname == "ConfigMgr" then
		if ConfigMgr and ConfigMgr.initConfig and not ConfigMgr._patched_buff then
			ConfigMgr._patched_buff = true
			local rawInit = ConfigMgr.initConfig
			ConfigMgr.initConfig = function(cfgName, cfgData)
				if cfgName == "CfgBuff" and cfgData and cfgData.buff then
					if cfgData.buff[10690] then
						cfgData.buff[10690].icon = "UI/Fight/Textures/TalentSkillIcom01"
					end
				end
				return rawInit(cfgName, cfgData)
			end
		end
	end
	if modname == "Modules.Fight.FightConfig" or modname == "FightConfig" then
		if FightConfig and FightConfig.getBuffVO and not FightConfig._patched_buff then
			FightConfig._patched_buff = true
			local rawGetBuff = FightConfig.getBuffVO
			FightConfig.getBuffVO = function(buffId)
				local vo = rawGetBuff(buffId)
				if buffId == 10690 and vo and not vo.icon then
					vo.icon = "UI/Fight/Textures/TalentSkillIcom01"
				end
				return vo
			end
		end
	end
	return res
end

