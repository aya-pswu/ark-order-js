module("LuotianyiModule", package.seeall)
require("Modules.Luotianyi.LuotianyiModuleAutoGen")
require("Modules.Luotianyi.LuotianyiConst")
require("Modules.Luotianyi.LuotianyiConfig")
require("Modules.Luotianyi.LuotianyiMgr")

function initModule()
	registerModuleSocket("LuotianyiModule")
	addMessageListener(ModuleCommand.OPEN_LUOTIANYI_PANEL, onOpenMapPanel)

	-- 动态注入 Adventure 模块对达拉崩吧地图（1052010100）的兼容支持
	if AdventureMgr and AdventureMgr.setTheaterMapData then
		local oldSetTheaterMapData = AdventureMgr.setTheaterMapData
		AdventureMgr.setTheaterMapData = function(slot0)
			if slot0 and slot0.map_id == LuotianyiConst.MAP_ID then
				LuotianyiMgr.setMapData(slot0)
				-- 官方 AdventureModule.m_theater_map_enter_toc 也会走到这里（同协议双模块注册）；
				-- 无论哪个 handler 先跑，保持 LuotianyiMgr.step 与服务端阶段一致（面板 tip 栏数据源）
				LuotianyiMgr.step = slot0.step or LuotianyiMgr.step or 1
				local mvo = LuotianyiMgr.getMapVO()
				if mvo then
					mvo.monster_id = 0
					if AdventureMgr.setMapVO then
						AdventureMgr.setMapVO(mvo)
					end
				end
				return
			end
			return oldSetTheaterMapData(slot0)
		end
	end

	if AdventureModule and AdventureModule.theaterPanelDic then
		AdventureModule.theaterPanelDic[LuotianyiConst.MAP_ID] = {
			LuotianyiModule.openMapPanel,
			function (slot0, slot1)
				if slot0 == "setUpMap" then
					slot0 = "setUp"
				end
				LuotianyiModule.updateMapPanel(slot0, slot1)
			end,
			function ()
				LuotianyiModule.closeMapPanel()
			end
		}
	end

	-- 核心修复：修补 MapScene.createObj 对 type=7 传送门 (OBJECT_TYPE_SPINE_EFFECT) 的实例化缺失 parent 崩溃
	if AdventureModule and AdventureModule.MapScene and AdventureModule.MapScene.createObj then
		-- SpineEffectUnit 在 AdventureModule.lua 的 module 环境中注册为
		-- AdventureModule.SpineEffectUnit，不是 LuotianyiModule 环境下的全局变量。
		-- 旧代码直接引用 SpineEffectUnit，进入含 type=7 物件的地图时会立刻报 nil。
		local spineEffectClass = AdventureModule.SpineEffectUnit
		if not spineEffectClass then
			pcall(require, "Modules.Adventure.Unit.SpineEffectUnit")
			spineEffectClass = AdventureModule.SpineEffectUnit
		end
		local oldCreateObj = AdventureModule.MapScene.createObj
		AdventureModule.MapScene.createObj = function(slot0, slot1)
			if slot1 == AdventureConst.OBJECT_TYPE_SPINE_EFFECT then
				if spineEffectClass and spineEffectClass.new then
					return spineEffectClass.new(slot0:getLayerByType(slot1) or slot0.layerEnv)
				end
				-- 资源包缺少 Spine 类时跳过该装饰物，不能阻断整张地图和玩家队伍初始化。
				print("[Luotianyi] SpineEffectUnit unavailable; skip spine effect object")
				return nil
			end
			return oldCreateObj(slot0, slot1)
		end
	end

	-- 核心修复：修补站在 BOSS/公主/恶龙/管家 面前点击无反应的问题
	if AdventureModule and AdventureModule.MapScene and AdventureModule.MapScene.onMonsterClick then
		local oldOnMonsterClick = AdventureModule.MapScene.onMonsterClick
		AdventureModule.MapScene.onMonsterClick = function(slot0, slot1)
			if slot1 and (slot1.id == 95090 or slot1.id == 81075 or slot1.id == 87086 or slot1.id == 85080) then
				if slot0.myRole and slot0.myRole.node then
					local dist = math.abs(slot0.myRole.node.x - slot1.x) + math.abs(slot0.myRole.node.y - slot1.y)
					if dist <= 3 then
						local targetCopy = (slot1.id == 81075) and 1052010100 or 1052010174
						CopyModule.m_copy_fight_prepare_tos(targetCopy)
						return
					end
				end
			end
			return oldOnMonsterClick(slot0, slot1)
		end
	end
end

function disposeModule()
	onDispose()
end

function onOpenMapPanel(slot0)
	print("<<<< [LuotianyiModule] 进入达拉崩吧地图: " .. tostring(LuotianyiConst.MAP_ID) .. " >>>>")
	local msg = Message.createProto("m_theater_map_enter_tos")
	msg.map_id = LuotianyiConst.MAP_ID
	msg.op_type = 0
	Net.sendProto(msg)
end

function m_theater_map_enter_toc(slot0)
	print("<<<< [LuotianyiModule] 收到 m_theater_map_enter_toc: map_id=" .. tostring(slot0.map_id) .. " >>>>")
	if slot0.map_id ~= LuotianyiConst.MAP_ID then
		return
	end

	-- 消除网络等待与Loading弹窗
	if ErrorModule and ErrorModule.closeNetWaitPanel then
		ErrorModule.closeNetWaitPanel()
	end
	if ErrorMgr and ErrorMgr.stopCheckSendBack then
		ErrorMgr.stopCheckSendBack(true)
	end

	-- 深拷贝 skin_list，防止 table.remove 原地修改造成 roleSkin 为空
	local skinListCopy = {}
	if slot0.skin_list then
		for _, sid in ipairs(slot0.skin_list) do
			table.insert(skinListCopy, sid)
		end
	end
	if #skinListCopy == 0 then
		table.insert(skinListCopy, 194100101)
	end
	slot0.skin_list = skinListCopy

	LuotianyiMgr.setMapData(slot0)
	LuotianyiMgr.step = slot0.step or 1

	-- 核心加固：monster_id 必须显式为 0，防止 MapScene.updateMyRoleState 判定 nil == 0 为 false 把主角 setActive(false) 隐藏！
	local mapVO = LuotianyiMgr.getMapVO()
	if mapVO then
		mapVO.monster_id = 0
		if not mapVO.roleSkin or tonumber(mapVO.roleSkin) == 0 then
			mapVO.roleSkin = 194100101
		end
		if AdventureMgr and AdventureMgr.setMapVO then
			AdventureMgr.setMapVO(mapVO)
		end
	end

	-- 恢复地图运行并打开面板
	AdventureMgr.resume()
	if AdventureModule and AdventureModule.m_map_pause_toc then
		AdventureModule.m_map_pause_toc({ op_type = 0 })
	end

	LuotianyiModule.openMapPanel("setUp")
	LuotianyiModule.updateMapPanel("setUp")

	-- 确保主角模型立即可见并播放待机动作 (双重保障)
	LoopManager.setTimeout(function ()
		local panel = WindowsManager.getTopPanel()
		if panel and panel.mapScene and panel.mapScene.myRole then
			local r = panel.mapScene.myRole
			r:setActive(true)
			if r.avatar then
				r.avatar:setActive(true)
				if r.avatar.skeletonGraphic then
					r.avatar.skeletonGraphic.color = Color.New(1, 1, 1, 1)
					r.avatar.skeletonGraphic:DoFadeGraphic(1, 0.05)
				end
			end
			r:playAct("stand", true)
		end
	end, 0.1)

	-- 安全检查开场剧情
	if LuotianyiMgr.isFirstOpen() then
		if TheaterModule and TheaterModule.start then
			pcall(function()
				TheaterModule.start(1052100101)
			end)
		end
	end
end

function m_theater_map_move_path_tos(slot0, slot1)
	if AdventureModule and AdventureModule.m_theater_map_move_path_tos then
		AdventureModule.m_theater_map_move_path_tos(slot0, slot1)
	else
		local msg = Message.createProto("m_theater_map_move_path_tos")
		msg.path = {}
		if slot1 then
			table.insert(msg.path, AdventureUtil.getIDByXY(slot1.x, slot1.y))
		end
		if slot0 then
			for i = 0, slot0.Length - 1 do
				local pt = slot0:GetValue(i)
				table.insert(msg.path, AdventureUtil.getIDByXY(pt.x, pt.y))
			end
		end
		Net.sendProto(msg)
	end
end

function m_theater_map_move_dst_tos()
	if AdventureModule and AdventureModule.m_theater_map_move_dst_tos then
		AdventureModule.m_theater_map_move_dst_tos()
	else
		Net.createAndSendProto("m_theater_map_move_dst_tos")
	end
end

function m_theater_map_event_toc(slot0)
	print("<<<< [LuotianyiModule] 收到地图事件: event_id=" .. tostring(slot0.event_id) .. " >>>>")
	if ErrorModule and ErrorModule.closeNetWaitPanel then
		ErrorModule.closeNetWaitPanel()
	end
	LuotianyiModule.updateMapPanel("doEvent", slot0.event_id)
end

function m_theater_map_step_update_toc(slot0)
	print("<<<< [LuotianyiModule] 阶段更新: step=" .. tostring(slot0.step) .. " >>>>")
	if ErrorModule and ErrorModule.closeNetWaitPanel then
		ErrorModule.closeNetWaitPanel()
	end
	LuotianyiMgr.step = slot0.step
	LuotianyiModule.updateMapPanel("updateStep")
end

function m_theater_map_follow_update_toc(slot0)
	LuotianyiModule.updateMapPanel(AdventureConst.ACTION_ENTER_FOLLOW, slot0.skin_id)
end

function m_theater_map_obj_update_toc(slot0)
	if slot0 and slot0.objs then
		for _, obj in ipairs(slot0.objs) do
			if obj.val == 1 then
				AdventureMgr.enterObj(obj.id)
			elseif obj.val == 0 then
				AdventureMgr.exitObj(obj.id, AdventureConst.EXIT_TYPE_DEAD)
			elseif obj.val == 2 then
				AdventureMgr.exitObj(obj.id, AdventureConst.EXIT_TYPE_DISAPPEAR)
			end
		end
	end
end

function m_theater_map_dyn_obj_update_toc(slot0)
	AdventureMgr.dynObjUpdate(slot0)
end

function m_theater_map_close_toc(slot0)
	print("<<<< [LuotianyiModule] 收到地图关闭 >>>>")
	if ErrorModule and ErrorModule.closeNetWaitPanel then
		ErrorModule.closeNetWaitPanel()
	end
	LuotianyiModule.closeMapPanel()
end

function m_theater_map_quit_toc(slot0)
	print("<<<< [LuotianyiModule] 收到退出确认 >>>>")
	if ErrorModule and ErrorModule.closeNetWaitPanel then
		ErrorModule.closeNetWaitPanel()
	end
	LuotianyiModule.closeMapPanel()
end
