module("ErrorMgr", package.seeall)

importProtoDic = {}
generalProtoDic = {}
backTimeoutKey = 0
quitLaterMsg = nil
slot0 = 0

function addImportProto(slot0, slot1)
	table.insert(importProtoDic, {
		slot0,
		slot1
	})
end

function removeImportProto(slot0)
	slot1 = -1

	for slot5, slot6 in ipairs(importProtoDic) do
		if slot0 == slot6[1].classname then
			slot1 = slot5

			break
		end
	end

	if slot1 ~= -1 then
		table.remove(importProtoDic, slot1)
	end
end

function updateLastSendTos(slot0)
	lastSendTosId = slot0

	checkSendBack()
end

function checkSendBack()
	if lastSendTosId == 0 or Net.hasSocket() == false then
		stopCheckSendBack(true)
	elseif backTimeoutKey == 0 then
		stopCheckSendBack()

		backTimeoutKey = LoopManager.setTimeout(function ()
			ErrorModule.openNetWaitPanel()

			backTimeoutKey = 0
		end, 3)
	end
end

function stopCheckSendBack(slot0)
	if slot0 then
		ErrorModule.closeNetWaitPanel()
	end

	LoopManager.clearTimeout(backTimeoutKey)

	backTimeoutKey = 0
	lastSendTosId = 0
end

function checkBanWord(slot0)
	for slot5, slot6 in pairs(ErrorConfig.getBanWord()) do
		if string.find(slot0, slot6) ~= nil then
			return true
		end
	end

	return false
end
