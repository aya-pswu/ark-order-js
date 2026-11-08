module("DormModule", package.seeall)
require("Modules.Dorm.View.BubbleItem")
require("Modules.Dorm.View.DormAddFriendPopupPanel")
require("Modules.Dorm.View.DormAlertPopPanel")
require("Modules.Dorm.View.DormChapterPanel")
require("Modules.Dorm.View.DormCopySelectPanel")
require("Modules.Dorm.View.DormDispatchAgentItem")
require("Modules.Dorm.View.DormDispatchItem")
require("Modules.Dorm.View.DormDispatchPanel")
require("Modules.Dorm.View.DormDispatchResultItem")
require("Modules.Dorm.View.DormDispatchResultPanel")
require("Modules.Dorm.View.DormDispatchSelectItem")
require("Modules.Dorm.View.DormDispatchSelectPanel")
require("Modules.Dorm.View.DormDispatchServantItem")
require("Modules.Dorm.View.DormDispatchSettlementPanel")
require("Modules.Dorm.View.DormExpBankPanel")
require("Modules.Dorm.View.DormFilterItem")
require("Modules.Dorm.View.DormFilterPanel")
require("Modules.Dorm.View.DormFurnitureMakeItem")
require("Modules.Dorm.View.DormFurnitureMakePanel")
require("Modules.Dorm.View.DormGiftItem")
require("Modules.Dorm.View.DormGiftView")
require("Modules.Dorm.View.DormGoodsItem")
require("Modules.Dorm.View.DormOperateItem")
require("Modules.Dorm.View.DormOperateView")
require("Modules.Dorm.View.DormPanel")
require("Modules.Dorm.View.DormPlanAddPanel")
require("Modules.Dorm.View.DormPlanItem")
require("Modules.Dorm.View.DormPlanPopPanelDel")
require("Modules.Dorm.View.DormPlanView")
require("Modules.Dorm.View.DormPointInfoItem")
require("Modules.Dorm.View.DormPointInfoPanel")
require("Modules.Dorm.View.DormPointRewardItem")
require("Modules.Dorm.View.DormRecordPopupPanel")
require("Modules.Dorm.View.DormRestPopupItem")
require("Modules.Dorm.View.DormRestPopupPanel")
require("Modules.Dorm.View.DormRoleInfoPopupPanel")
require("Modules.Dorm.View.DormScreenItem")
require("Modules.Dorm.View.DormScreenPopupPanel")
require("Modules.Dorm.View.DormSelectedPopupPanel")
require("Modules.Dorm.View.DormSelectedPopupPanelItem")
require("Modules.Dorm.View.DormStudyItem")
require("Modules.Dorm.View.DormStudyPanel")
require("Modules.Dorm.View.DormSupplyBuyPanel")
require("Modules.Dorm.View.DormSupplyItem")
require("Modules.Dorm.View.DormSupplyPanel")
require("Modules.Dorm.View.DormSupplyServantObj")
require("Modules.Dorm.View.DormThemeItem")
require("Modules.Dorm.View.DormVisitPopupPanel")
require("Modules.Dorm.View.DormVisitPopupPanelItem")
require("Modules.Dorm.View.FacilitiesItem")
require("Modules.Dorm.View.ModifyPopupPanel")
require("Modules.Dorm.View.PutItem")
require("Modules.Dorm.View.ServantHeadsItem")
require("Modules.Dorm.View.StreetItem")
createModulePanelFunc("DormModule", "addFriendPopupPanel", DormAddFriendPopupPanel)
createModulePanelFunc("DormModule", "alertPopPanel", DormAlertPopPanel)
createModulePanelFunc("DormModule", "chapterPanel", DormChapterPanel)
createModulePanelFunc("DormModule", "copySelectPanel", DormCopySelectPanel)
createModulePanelFunc("DormModule", "dispatchPanel", DormDispatchPanel)
createModulePanelFunc("DormModule", "dispatchResultPanel", DormDispatchResultPanel)
createModulePanelFunc("DormModule", "dispatchSelectPanel", DormDispatchSelectPanel)
createModulePanelFunc("DormModule", "dispatchSettlementPanel", DormDispatchSettlementPanel)
createModulePanelFunc("DormModule", "expBankPanel", DormExpBankPanel)
createModulePanelFunc("DormModule", "filterPanel", DormFilterPanel)
createModulePanelFunc("DormModule", "furnitureMakePanel", DormFurnitureMakePanel)
createModulePanelFunc("DormModule", "panel", DormPanel)
createModulePanelFunc("DormModule", "planAddPanel", DormPlanAddPanel)
createModulePanelFunc("DormModule", "planPopPanelDel", DormPlanPopPanelDel)
createModulePanelFunc("DormModule", "pointInfoPanel", DormPointInfoPanel)
createModulePanelFunc("DormModule", "recordPopupPanel", DormRecordPopupPanel)
createModulePanelFunc("DormModule", "restPopupPanel", DormRestPopupPanel)
createModulePanelFunc("DormModule", "roleInfoPopupPanel", DormRoleInfoPopupPanel)
createModulePanelFunc("DormModule", "screenPopupPanel", DormScreenPopupPanel)
createModulePanelFunc("DormModule", "selectedPopupPanel", DormSelectedPopupPanel)
createModulePanelFunc("DormModule", "studyPanel", DormStudyPanel)
createModulePanelFunc("DormModule", "supplyBuyPanel", DormSupplyBuyPanel)
createModulePanelFunc("DormModule", "supplyPanel", DormSupplyPanel)
createModulePanelFunc("DormModule", "visitPopupPanel", DormVisitPopupPanel)
createModulePanelFunc("DormModule", "modifyPopupPanel", ModifyPopupPanel)

-- 本地服修改：本构建未注册 RoomsPopupPanel（无 createModulePanelFunc），但
-- DormModule.m_dorm_list_toc / m_dorm_unlock_toc 仍调用 updateRoomsPopupPanel → nil 报错。
-- 该面板全工程无 open 调用点（死代码），补 no-op 桩即可
function updateRoomsPopupPanel()
	return
end

function openRoomsPopupPanel()
	return
end

function closeRoomsPopupPanel()
	return
end

function releaseRoomsPopupPanel()
	return
end

__msgList = {}
__netList = {}

function addMessageListener(slot0, slot1, slot2)
	ModuleFactory.addMessageListener(DormModule, slot0, slot1, slot2)
end

function removeMessageListener(slot0, slot1)
	ModuleFactory.removeMessageListener(DormModule, slot0, slot1)
end

function removeAllListener()
	ModuleFactory.removeAllListener(DormModule)
end

function registerSocketHandler(slot0, slot1)
	ModuleFactory.registerSocketHandler(DormModule, slot0, slot1)
end

function removeSocketHandler(slot0, slot1)
	ModuleFactory.removeSocketHandler(DormModule, slot0, slot1)
end

function removeAllSocketHandler()
	ModuleFactory.removeAllSocketHandler(DormModule)
end

function onDispose()
	DormMgr.onDispose()
	removeAllListener()
	removeAllSocketHandler()
end
