module("CopyModule", package.seeall)

CopyRewardServantVO = class("CopyRewardServantVO")

-- 本地服补丁（结算面板 LuaError 修复，2026-10-01）：
--   原版 getServantVO() 三条取数路径在"客户端 roster 查无该 id"时返回 nil，
--   CopyRewardServantItem.onGUI 里 getServantVO().skinID 直接 nil 索引崩溃
--   （报错：Modules/Copy/View/CopyRewardServantItem: attempt to index a nil value）。
--   触发面：喂食/分解残留的悬空编队 id、空 servant_exp 面板（指令战/塔战回放）全量放行编队等。
--   本补丁：① 每条路径都做 nil 防御；② roster 查无时回落编队快照（按 id 取临时编队成员
--   重建 config VO），能把"悬空但在队"的卡片救回来正常展示；实在取不到仍返回 nil，
--   由 CopyRewardServantItem 补丁的 onGUI 守卫整体隐藏该卡片。
--   原始字节码：bc/Modules/copy/CopyRewardServantVO.lua（本文件同名覆盖下发）。

function CopyRewardServantVO.ctor(slot0)
	slot0.teamIndex = 0
	slot0.id = 0
	slot0.servantVO = nil
	slot0.isMVP = false
	slot0.exp = 0
	slot0.expType = 0
	slot0.isWin = false
	slot0.typeID = 0
end

function CopyRewardServantVO.isUp(slot0)
	local sv = ServantMgr.getServant(slot0.id)
	if slot0:hasExpReward() and sv ~= nil then
		return sv.exp < slot0.exp
	end

	return false
end

-- 从编队快照（FormationMgr 按 [teamIndex][id] 存成员 brief）重建 config VO
local function buildFromTeamBrief(slot0)
	local brief = FormationMgr.getTeamServant(slot0.teamIndex, slot0.id)
	if brief == nil then
		return nil
	end

	local vo = ServantConfig.getServantConfigVO(brief.type)
	if vo == nil then
		return nil
	end

	vo.skinID = brief.skin_id
	vo.level = brief.level

	return vo
end

function CopyRewardServantVO.getServantVO(slot0)
	if slot0.servantVO == nil then
		if slot0.typeID ~= 0 then
			slot0.servantVO = ServantConfig.getServantConfigVO(slot0.typeID)
			if slot0.servantVO ~= nil then
				slot0.servantVO.level = 75
			end
		elseif slot0:hasExpReward() then
			slot0.servantVO = ServantMgr.getServant(slot0.id)
			if slot0.servantVO == nil then
				slot0.servantVO = buildFromTeamBrief(slot0)
			end
		else
			slot0.servantVO = buildFromTeamBrief(slot0)
		end
	end

	return slot0.servantVO
end

function CopyRewardServantVO.hasExpReward(slot0)
	return not CopyMgr.isFeelingCopy() and not CopyMgr.isTowerCopy() and not CopyMgr.isCopyType(CopyConst.TYPE_GREECE_ARENA) and not CopyMgr.isCopyPhantom()
end

function CopyRewardServantVO.hasStoredInTimeBank(slot0)
	return slot0.expType == CopyConst.TYPE_EXP_TIME_BANK
end

function CopyRewardServantVO.isTimeBankFull(slot0)
	return slot0.expType == CopyConst.TYPE_EXP_TIME_BANK_FULL
end
