module("CopyModule", package.seeall)

CopyActivityIDChoicePanel = class("CopyActivityIDChoicePanel", CopyModule.CopyDareSelectDifficultyPanel)

-- 本地服补丁（2026-10-04 一百三十七）：限时活动多选面板横幅单行铺开。
-- 原版 prefab（CopyDareSelectDifficultyPanel）的 list 组件序列化 columns=5（每行 5 个），
-- 本地服同时开放的活动数 > 5 时溢出到第二行，而列表视口只有 150 高（单行），
-- 第二行被 Mask 裁切且不可纵向滚动，表现为"两个活动卡在下面看不清"。
-- CList.columns=0 是引擎原生分支：全部 item 单行横向排列、内容加宽、横向拖动、
-- 数量少时 autoCenter 居中——即"加入左右滑动能显示的范围内"。
-- 仅覆写本面板（各方法均为本类自有），基类 CopyDareSelectDifficultyPanel 不受影响。
function CopyActivityIDChoicePanel.initUI(slot0)
	slot0.showMask = false
	slot1 = slot0.objMask:GetComponent("CBoxCollider")

	Util.addGaussian(slot1)
	slot1.material:SetFloat("_Lerp", 0)

	slot0.list.LuaItemRender = CopyActivityIDChoiceItem
	slot0.list.columns = 0

	slot0:addClick(selfHandler(slot0, "close"))
	print("<<<< 本地服补丁: CopyActivityIDChoicePanel 活动横幅单行铺开 (columns=0) >>>>")
end

function CopyActivityIDChoicePanel.onOpen(slot0)
	slot0.list.LuaDataProvider = CopyMgr.getCopyActivityIDList()
end

function CopyActivityIDChoicePanel.onRelease(slot0)
	return
end
