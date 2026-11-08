module("NetHeartBeat", package.seeall)

slot0 = 0
slot1 = 0
slot2 = 0
slot3 = 0
sendHBTimestamp = 0
recieveHBTimestamp = 0
isOnHB = false

function onStartHB(slot0)
	uv0 = Time.GetTimestamp()
	uv1 = slot0
	GlobalData.serverTime = slot0

	openHB()
end

function openHB()
	print("openHB")
	LoopManager.addToSecond("NetHeartBeat1", onSecondLoop)
	LoopManager.setInterval("NetHeartBeat2", sendHB, 1)

	isOnHB = true

	sendHB()
end

function sendHB()
	Net.sendHB()
end

function onSecondLoop()
	checkSendHB()
end

function checkSendHB()
	uv0 = uv0 + 1

	if uv1 < uv0 then
		updataHBTimestamp()

		uv0 = 0
	end
end

function updataHBTimestamp(slot0)
	if slot0 then
		recieveHBTimestamp = Time.GetTimestamp()
	end

	sendHBTimestamp = Time.GetTimestamp()
end

function closeHB()
	print("closeHB")
	LoopManager.removeFromSecond("NetHeartBeat1")
	LoopManager.reomveFromInterval("NetHeartBeat2")

	isOnHB = false
end
