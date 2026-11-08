module("RoleModule", package.seeall)
require("Modules.Role.View.AutoGen.RoleBuffViewAutoGen")

-- 2026-10-13（一百七十四）判空补丁（明文重写，原为官方字节码；基底=ljd 反编译）。
--
-- ⚠️ 关键教训（本条第二次踩，见工作日志一百四十九 ActivityLTYRewardView 同款事故）：
-- ljd 反编译输出的 `uv0/uv1/uv2` 是**闭包捕获变量的占位符**，不是真变量名。
-- 明文重写若照抄，运行时会去查不存在的**全局** uv0 → nil → "attempt to index global 'uv0'"
-- （首页每帧 LoopManager 回调即崩，界面全灰）。本文件两处 uv0 的真实指向：
--   1) setActive 的秒回调 `uv0:onSecond()` —— 捕获的是外层参数 slot0（self）
--   2) checkActive 的 `uv0[slot1.buff_type]` —— 捕获的是下面的文件级分类表 BUFF_TYPE_IDS
-- 故一律**具名化**：回调显式 `local self = slot0` 后 `self:onSecond()`；分类表命名为
-- BUFF_TYPE_IDS 直接引用（module() 作用域内文件级局部，语义与官方上值等价）。
--
-- 补丁目的：放弃战斗时 CopyRewardPanel 建 RoleBuffView（isShort=true），onGUI 读
-- CopyMgr.getResult(FightMgr.getNowFightID())；若该 fight_id 从未收到 m_fight_result_toc
-- （服务端此前未注册放弃协议 → 走 fallback 空回包），resultVO 为 nil，
-- checkActive 里 pairs(slot0.resultVO.showRewards) 索引 nil 崩溃。
-- 服务端同轮已补注册 m_fight_give_up_tos 发 LOSE 结算包（根治），此处为跨战斗类型兜底
-- （一百三十六教训：CopyRewardPanel/RoleBuffView 是所有战斗类型共用的通用面板）。

-- 官方上值 uv0：按 buff_type 索引的"该类型下可展示的奖励 typeId 白名单"
-- （buff_type=1 恒展示，见 checkActive 早退分支）
-- local 而非模块级全局：避免与同 module() 作用域下其它文件的同名表互相覆盖
local BUFF_TYPE_IDS = {
	{},
	{
		30000003
	},
	{
		60000040,
		60000052,
		60000064,
		60000115
	}
}

function RoleBuffView.init(slot0, slot1)
	slot0.isShort = slot1.isShort

	slot0:loadPrefab(RoleBuffView.resUrl)
end

function RoleBuffView.initUI(slot0)
	slot0.items = {}
end

function RoleBuffView.onGUI(slot0, slot1)
	if slot0.isShort then
		slot0.resultVO = CopyMgr.getResult(FightMgr.getNowFightID())
	end

	slot0.showNum = #RoleMgr.buffHash.array

	printLxfTable(RoleMgr.buffHash.array)

	for slot5, slot6 in ipairs(RoleMgr.buffHash.array) do
		slot7 = slot0:getItem(slot5)

		slot7:setData(slot6)
		slot7:setActive(slot0:checkActive(slot6))
	end

	for slot5 = slot0.showNum + 1, #slot0.items do
		slot0.items[slot5]:setActive(false)
	end

	slot0:resetItemPos()
end

function RoleBuffView.getItem(slot0, slot1)
	if slot0.items[slot1] == nil then
		slot2 = slot0:create(RoleBuffItem, {
			isShort = slot0.isShort
		})

		slot2:setParent(slot0.tran)
		slot2:setScale()

		if slot0.isShort then
			slot2:setAnchorPosition(Vector2(190 * (slot1 - 1), 0))
		else
			slot2:setAnchorPosition(Vector2(0, -32 * (slot1 - 1)))
		end

		slot0.items[slot1] = slot2
	end

	return slot0.items[slot1]
end

function RoleBuffView.setActive(slot0, slot1)
	slot0.super.setActive(slot0, slot1)

	if slot1 then
		-- 具名化上值：官方字节码此处捕获的是外层 slot0（self）
		local self = slot0

		LoopManager.addToSecond(slot0, function ()
			self:onSecond()
		end)
	else
		LoopManager.removeFromSecond(slot0)
	end
end

function RoleBuffView.resetItemPos(slot0)
	-- 2026-10-19 修「主界面 buff 条目全部叠在一起」：
	-- 原明文重写把纵向步进写成了 `-32 * (-1 + 1)`，恒为 0 → 每个激活条目都被摆到 (0,0)，
	-- 多个 buff 时文字与图标原位重叠（真机 PS-RULE-DIAG 实证：6 个 lblDesc 同在屏幕 (517,1281)）。
	-- 原始字节码语义（rolebuff.asm 指令 1 / 22-28）：
	--   计数器初值 -1（KSHORT 65535），命中可显示条目时先 +1，再 setAnchorPosition(Vector2(0, -32 * 计数))。
	--   即第一个可见条目落在 y=0，第二个 y=-32，依此类推 —— 隐藏条目不计入序号。
	-- 这里用显式计数器还原同一语义（不能复用循环下标 slot5：隐藏条目不应占位）。
	local shown = -1

	for slot5, slot6 in ipairs(RoleMgr.buffHash.array) do
		local slot7 = slot0:getItem(slot5)

		slot7:setData(slot6)

		if slot0:checkActive(slot6) then
			shown = shown + 1
			slot7:setAnchorPosition(Vector2(0, -32 * shown))
		end
	end
end

function RoleBuffView.onSecond(slot0)
	if slot0.showNum then
		for slot5 = 1, slot0.showNum do
			slot1 = false or slot0.items[slot5]:updateTime()
		end

		if slot1 then
			slot0:setData(0)
		end
	end
end

function RoleBuffView.checkActive(slot0, slot1)
	if slot1:getShow() == false then
		return false
	end

	if slot0.isShort then
		-- 判空补丁：结算数据缺失（放弃战斗/战败且服务端未发 m_fight_result_toc）时
		-- resultVO 为 nil，原代码直接 pairs(slot0.resultVO.showRewards) 索引 nil 崩溃。
		-- 无结算数据：buff_type==1（通用增益）照常显示，其余无依据判定 → 不显示。
		if slot0.resultVO == nil or slot0.resultVO.showRewards == nil then
			return slot1.buff_type == 1
		end

		for slot5, slot6 in pairs(slot0.resultVO.showRewards) do
			if slot1.buff_type == 1 then
				return true
			end

			-- 具名化上值 BUFF_TYPE_IDS（官方为 uv0）
			local whitelist = BUFF_TYPE_IDS[slot1.buff_type]

			if whitelist ~= nil and table.find(whitelist, slot6.typeId) then
				return true
			end
		end

		return false
	else
		return true
	end
end

function RoleBuffView.onRelease(slot0)
	return
end
