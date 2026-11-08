module("LuotianyiModule", package.seeall)
require("Modules.Adventure.View.MapScene")

LuotianyiRole = class("LuotianyiRole", AdventureModule.MyRole)

function LuotianyiRole.onInit(slot0)
	LuotianyiRole.super.onInit(slot0)
	if slot0.texShadow then
		Util.setAnchorPosition(slot0.texShadow, Vector2(0, -50))
	end
end

function LuotianyiRole.setSkin(slot0, slot1)
	slot0.skinId = tonumber(slot1) or 194100101
	if slot0.skinId < 99999999 then
		slot0.skinId = 194100101
	end
	
	LuotianyiRole.super.setSkin(slot0, slot0.skinId)
	
	if slot0.avatar then
		slot0.avatar:setActive(true)
		slot0.avatar:setAnchorPosition(Vector2(0, 0))
		slot0.avatar:setScale(Vector3(0.6, 0.6, 0.6))
		if slot0.avatar.skeletonGraphic then
			slot0.avatar.skeletonGraphic.color = Color.New(1, 1, 1, 1)
			slot0.avatar.skeletonGraphic:DoFadeGraphic(1, 0.05)
		end
		slot0:playAct("stand", true)
	end
end

function LuotianyiRole.onEnter(slot0)
	LuotianyiRole.super.onEnter(slot0)
	if slot0.avatar then
		slot0.avatar:setActive(true)
		if slot0.avatar.skeletonGraphic then
			slot0.avatar.skeletonGraphic.color = Color.New(1, 1, 1, 1)
			slot0.avatar.skeletonGraphic:DoFadeGraphic(1, 0.05)
		end
		slot0:playAct("stand", true)
	end
end

function LuotianyiRole.onMoveEnd(slot0)
	LuotianyiModule.m_theater_map_move_dst_tos()
end

function LuotianyiRole.getMapID(slot0)
	return LuotianyiConst.MAP_ID
end
