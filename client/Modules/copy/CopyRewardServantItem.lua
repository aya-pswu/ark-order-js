module("CopyModule", package.seeall)
require("Modules.Copy.View.AutoGen.CopyRewardServantItemAutoGen")

-- 本地服补丁（结算面板 LuaError 修复，2026-10-01）：
--   原版 onGUI 在"该卡片 id 在客户端 roster 查无"时（getServantVO() 返回 nil），
--   第一句 CopyConfig.getServantSkinOff(slot1:getServantVO().skinID) 就 nil 索引崩溃。
--   触发面：喂食/分解残留的悬空编队 id、空 servant_exp 面板（指令战/塔战回放会全量放行编队
--   含补零空位）。本补丁：onGUI 入口先取 servantVO，取不到时走原 else 分支整体隐藏该卡片
--   （setActive(false)），其余展示逻辑与原版一致；MVP 台词查不到配置时不再崩溃（跳过台词）。
--   doAnimation 的 setTimeout 回调显式捕获 self（原字节码为 upvalue）。
--   原始字节码：bc/Modules/copy/CopyRewardServantItem.lua（本文件同名覆盖下发）。

function CopyRewardServantItem.initUI(slot0)
	slot0.servant = UICommonModule.createServantInUI(slot0)

	slot0.servant:setParent(slot0.objSpine)
	slot0.servant:setAnchorPosition(Vector2(0, -75))
	slot0.servant:setScale(Vector3(0.7, 0.7, 0.7))

	slot0.pbExp.value = 0

	Util.setActive(slot0.spExpFull, false)
end

function CopyRewardServantItem.onGUI(slot0, slot1)
	local sv = nil

	if slot1 ~= nil and slot1.id ~= nil then
		sv = slot1:getServantVO()
	end

	if slot1 ~= nil and slot1.id ~= nil and sv ~= nil then
		slot0:setActive(true)
		Util.setActive(slot0.spExpFull, false)

		local noExpBar = CopyMgr.isFeelingCopy() or CopyMgr.isAreaBattle() or CopyMgr.isTowerCopy() or CopyMgr.isLadderBattle()

		local off = nil

		if CopyConfig.getServantSkinOff(sv.skinID) == nil then
			off = CopyConfig.getServantOff(sv.typeId)
		end

		if off ~= nil then
			slot0.servant:setAnchorPosition(Vector2(off[1], off[2]))
		else
			slot0.servant:setAnchorPosition(Vector2(0, -75))
		end

		slot0.servant:setData(sv)
		slot0.servant:play(slot1.isWin and AvatarUtil.ACT_WIN or AvatarUtil.ACT_IDLE)
		Util.setActive(slot0.pbExp, not noExpBar)
		Util.setActive(slot0.lblExp.transform.parent, not noExpBar)

		if slot1.id == 0 or not slot1:hasExpReward() then
			slot0.pbExp.value = 1
			slot0.lblExp.text = "经验+0"
		else
			if not slot1:hasStoredInTimeBank() and not slot1:isTimeBankFull() then
				-- SetValueByTween(目标值, 是否回绕:boolean, 时长, 回调)——签名见 DormRestPopupItem_re/
				-- ServantTrainResultView 同款进度条。原版 slot8 = "本次经验是否回绕（战斗中升级，
				-- sv.exp < 获得经验）"：升级时条从升级前进度推到满格回绕续走（true），普通时直接推到战后进度（false）
				local isLevelUp = sv.exp < slot1.exp

				if isLevelUp then
					slot0.pbExp.value = (sv:getUpgradeExp() - (slot1.exp - sv.exp)) / sv:getUpgradeExp()
				else
					slot0.pbExp.value = (sv.exp - slot1.exp) / sv:getUpgradeExp()
				end

				slot0.pbExp:SetValueByTween(sv.exp / sv:getUpgradeExp(), isLevelUp, 1, nil)

				slot0.lblExp.text = "经验+" .. slot1.exp
			elseif slot1:isTimeBankFull() then
				slot0.lblExp.text = "储存经验+0"

				Util.setActive(slot0.spExpFull, true)
			else
				slot0.lblExp.text = "储存经验+" .. slot1.exp
			end
		end

		if CopyMgr.isDream() then
			slot0.lblLv.text = HtmlUtil.Color("Lv.", "ffcc1c") .. sv:getLevelinFantasy() + sv.fantasyLevel
		else
			slot0.lblLv.text = HtmlUtil.Color("Lv.", "ffcc1c") .. sv.level
		end

		Util.setActive(slot0.spMvpBg, slot1.isMVP)

		if slot1.isMVP then
			local dlg = HandbookConfig.getServantCopyEndDialog(sv.typeId, slot1.isWin)

			if dlg ~= nil then
				slot0.lblTalk.text = dlg.text
			end
		end

		slot0.spMvpBg.Height = math.max(slot0.lblTalk.preferredHeight + 35, 75)

		slot0.goNoPower:SetActive(false)
		MingUIUtil.SetGroupAlpha(slot0.objBot.gameObject, 0)

		slot0.objBot.anchoredPosition = Vector2(0, -10)
		slot0.spMvpBg.transform.anchoredPosition = Vector2(0, -150)

		MingUIUtil.SetGroupAlpha(slot0.spMvpBg.gameObject, 0)
		slot0.servant:setAlpha(0)
		slot0:doAnimation()
	else
		slot0:setActive(false)
	end
end

function CopyRewardServantItem.doAnimation(slot0)
	slot0.objBot:DOAnchorPosY(51, 0.5)
	MingUIUtil.SetGroupAlphaInTime(slot0.objBot.gameObject, 1, 0.5, Ease.Linear, nil)

	local self = slot0

	LoopManager.setTimeout(function ()
		self.spMvpBg.transform:DOAnchorPosY(-18, 0.5)
		MingUIUtil.SetGroupAlphaInTime(self.spMvpBg.gameObject, 1, 0.5, Ease.Linear, nil)

		if self.servant.skeletonGraphic then
			self.servant.skeletonGraphic:DoFadeGraphic(1, 0.5)
		end
	end, 0.3)
	LoopManager.setTimeout(function ()
		if p_team_servant and p_team_servant.attr.hp == 0 then
			self.goNoPower:SetActive(true)
		else
			self.goNoPower:SetActive(false)
		end
	end, 0.5)
end

function CopyRewardServantItem.onRelease(slot0)
	return
end
