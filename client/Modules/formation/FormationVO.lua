module("FormationMgr", package.seeall)

FormationVO = class("FormationVO")

-- 2026-10-12 判空补丁（明文重写，原为官方字节码）：
-- 重登后 75ms 内点活动关出击（如约会大作战第2图）：花名册 brief（m_servants_brief_toc）已到而
-- detail（m_servant_list_detail_toc）未到，FormationVO.isAllDie 里 `slot6.attr.hp` 对
-- ServantConfigVO.attr（initByFormation 由 detail 包填充）索引 nil →
-- "Modules/Formation/VO/FormationVO:0: attempt to index field 'attr' (a nil value)"
-- （用户日志 16:09:08 实证：.793 收 brief，.274 崩，.349 detail 才回）。
-- 修复：isAllDie 对 unit.attr/unit 处处判空——attr 缺失视为"未力尽"（放行出击，
-- 服务端是最终裁决方，不会因跳过预检产生逻辑漏洞）。isAll3Skill 同族防御。

function FormationVO.ctor(slot0, slot1)
	setMateTable(slot0, slot1)
end

function FormationVO.getFieldServants(slot0, slot1, slot2)
	slot3 = {}

	for slot9, slot10 in ipairs(slot2 and slot0.fight_field or slot0.field) do
		if slot10 ~= 0 then
			if slot1 then
				if FormationConfig.isNewFormation(slot0.index) then
					table.insert(slot3, FormationMgr.getNewFormationServantVO(slot0.index, slot10))
				elseif FormationConst.MAX_NORMAL_TEAM_NUM < slot0.index then
					slot11 = FormationMgr.getTeamServant(slot0.index, slot10)
					slot12 = ServantConfig.getServantConfigVO(slot11.type)

					slot12:initByFormation(slot11)
					table.insert(slot3, slot12)
				else
					table.insert(slot3, ServantMgr.getServant(slot10))
				end
			else
				table.insert(slot3, FormationMgr.getTeamServant(slot0.index, slot10))
			end
		end
	end

	return slot3
end

function FormationVO.getBenchServants(slot0, slot1, slot2)
	slot3 = {}

	for slot9, slot10 in ipairs(slot2 and slot0.fight_bench or slot0.bench) do
		if slot10 ~= 0 then
			if slot1 then
				if FormationConfig.isNewFormation(slot0.index) then
					table.insert(slot3, FormationMgr.getNewFormationServantVO(slot0.index, slot10))
				elseif FormationConst.MAX_NORMAL_TEAM_NUM < slot0.index then
					slot11 = FormationMgr.getTeamServant(slot0.index, slot10)
					slot12 = ServantConfig.getServantConfigVO(slot11.type)

					slot12:initByFormation(slot11)
					table.insert(slot3, slot12)
				else
					table.insert(slot3, ServantMgr.getServant(slot10))
				end
			else
				table.insert(slot3, FormationMgr.getTeamServant(slot0.index, slot10))
			end
		end
	end

	return slot3
end

function FormationVO.getServant(slot0, slot1)
	slot3 = nil

	return FormationConfig.isNewFormation(slot0.index) and FormationMgr.getNewFormationServantVO(slot0.index, slot1) or ServantMgr.getServant(slot1)
end

function FormationVO.isAllDie(slot0)
	slot1 = slot0:getFieldServants(true, true)

	for slot5, slot6 in ipairs(slot1) do
		-- 判空补丁：官方语义 = "有任何存活(hp>0) → 不是全灭"。attr 未填充（detail 包未到）时
		-- 无法断定该单位死亡 → 视同存活放行（return false），交由服务端最终裁决；
		-- 否则整队 attr 缺失会漏到最后 `#队伍>0 → return true`，把满编活队误判"全部力尽"拦死开战
		--（PCJS E2E 新号 1-1 接敌开战实测：教程后 3 秒内点开始战斗必中）。
		if slot6 == nil or slot6.attr == nil or slot6.attr.hp == nil then
			return false
		end

		if slot6.attr.hp > 0 then
			return false
		end
	end

	slot2 = slot0:getBenchServants(true, true)

	for slot6, slot7 in ipairs(slot2) do
		if slot7 == nil or slot7.attr == nil or slot7.attr.hp == nil then
			return false
		end

		if slot7.attr.hp > 0 then
			return false
		end
	end

	if #slot1 > 0 or #slot2 > 0 then
		return true
	else
		return false
	end
end

function FormationVO.isAll3Skill(slot0)
	for slot5, slot6 in ipairs(slot0:getFieldServants(true, true)) do
		if table.getItem(slot0:getServant(slot6.id, true).fightSkills, "skill_id", 0) or #slot7.fightSkills < 3 then
			return false
		end
	end

	slot5 = true

	for slot5, slot6 in ipairs(slot0:getBenchServants(true, slot5)) do
		if table.getItem(slot0:getServant(slot6.id, true).fightSkills, "skill_id", 0) or #slot7.fightSkills < 3 then
			return false
		end
	end

	return true
end

function FormationVO.getTeamMemberNum(slot0)
	for slot5, slot6 in ipairs(slot0.fight_field) do
		if slot6 ~= 0 then
			slot1 = 0 + 1
		end
	end

	for slot5, slot6 in ipairs(slot0.fight_bench) do
		if slot6 ~= 0 then
			slot1 = slot1 + 1
		end
	end

	return slot1
end

function FormationVO.hasServant(slot0, slot1, slot2)
	for slot6, slot7 in ipairs(slot2 and slot0.fight_field or slot0.field) do
		if slot7 ~= 0 and slot7 == slot1 then
			return true
		end
	end

	for slot6, slot7 in ipairs(slot2 and slot0.fight_bench or slot0.bench) do
		if slot7 ~= 0 and slot7 == slot1 then
			return true
		end
	end

	return false
end

function FormationVO.hasServantInFight(slot0)
	slot2 = slot0:getBenchServants(true)

	for slot6, slot7 in pairs(slot0:getFieldServants(true)) do
		if BitUtil.op_and(slot7.status, 8) == 8 then
			return true
		end
	end

	for slot6, slot7 in pairs(slot2) do
		if BitUtil.op_and(slot7.status, 8) == 8 then
			return true
		end
	end

	return false
end

function FormationVO.isInUsing(slot0)
	return slot0.status == 1
end
