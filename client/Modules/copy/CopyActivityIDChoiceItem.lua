module("CopyModule", package.seeall)
require("Modules.Copy.View.AutoGen.CopyActivityIDChoiceItemAutoGen")

-- 明文覆写（2026-10-05 一百四十五）：
-- 1. getPath 兜底：客户端 CfgActivity.showActvitys 没有 1052（达拉崩吧）的 banner 条目，
--    原版 onGUI 里 "UI/Main/Textures_Lang/Act/" .. getPath() 会因 nil 拼接直接 LuaException，
--    导致关卡选择页「限时活动」图标条整体无法渲染。1052 借用洛天依汇总(1054)横幅渲染。
-- 2. onGUI 对 getPath 返回 nil 做防御（不再拼接崩溃），其余行为与原版一致。
--    copyActIcons[1052].link = {"OPEN_LUOTIANYI_PANEL"}：条目点击即打开达拉崩吧地图。

function CopyActivityIDChoiceItem.initUI(slot0)
	slot0:addClick(selfHandler(slot0, "onClick"))
end

function CopyActivityIDChoiceItem.onClick(slot0)
	local tip = slot0:getStateData().tip

	if string.isNotEmpty(tip) then
		Tips.addTips(tip)

		return
	end

	CopyModule.closeActivityIDChoicePanel()
	Dispatcher.dispatch(unpack(slot0:getLink()))
end

function CopyActivityIDChoiceItem.onGUI(slot0, slot1)
	slot0.actID = slot1
	local icons = ActivityConfig.getCopyActIcons()
	local pathId = slot0.actID

	if ActivityConfig.getIconActMap_Opposite(slot0.actID) and not ActivityMgr.isActionAct(slot0.actID) then
		pathId = ActivityConfig.getIconActMap_Opposite(slot0.actID)
	end

	slot0.info = table.getItem(icons, "actID", pathId)

	local banner = slot0:getPath()

	if banner then
		slot0.texChapter.Path = "UI/Main/Textures_Lang/Act/" .. banner
	end
end

function CopyActivityIDChoiceItem.getPath(slot0)
	for slot5, slot6 in ipairs(ActivityConfig.getShowActs()) do
		if table.isExist(slot6.allActs, slot0.actID) then
			return slot6.bannerPath
		end
	end

	if slot0.actID == 1052 then
		return 1054
	end

	return nil
end

function CopyActivityIDChoiceItem.getLink(slot0)
	return slot0:getStateData().link
end

function CopyActivityIDChoiceItem.getStateData(slot0)
	local vo = ActivityMgr.getActVO(slot0.info.actID)

	if vo ~= nil and slot0.info.states ~= nil and #slot0.info.states > 0 then
		for slot5, slot6 in ipairs(slot0.info.states) do
			if slot6.state == vo.state then
				return slot6
			end
		end
	end

	return slot0.info
end
