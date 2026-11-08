module("GlobalData", package.seeall)

silver = 0
gold = 0
payGold = 0
givenGold = 0
level = 1
vit = 0
roleName = ""
exp = 0
nextLevelExp = 1
vitBuyTime = 0
user = nil
MyRoleID = 0
myRoleIDNum = 0
serverTime = 0
serverOnlineTime = 0
serverTimezone = 28800
familyBanTime = 0
totalConsumeMoney = 0
roleCreateTime = 0
borderID = 0
headID = 0
faceGroupID = 0
useType = 0
vitMax = 0
moneyMax = 0
scoreDic = {}

function initData(slot0)
	user = slot0
	MyRoleID = user.role_id
	myRoleIDNum = Util.int64ToNumber(MyRoleID)
	silver = user.asset.silver
	payGold = user.asset.gold
	givenGold = user.asset.gold_given
	totalPayGold = user.asset.total_pay_gold
	totalConsumeMoney = user.asset.total_consume_money
	scoreDic = table.toDic(user.asset.role_scores, "id", "val")
	level = user.attr.level
	roleName = user.attr.role_name
	exp = user.attr.exp
	roleCreateTime = user.attr.create_time
	nextLevelExp = math.max(user.attr.next_level_exp, 1)

	updateGold()
	printTable(user.attr.helper_list, 45567)
	RoleMgr.updateHelpGroup(user.attr.helper_list)

	RoleMgr.helperFace = user.attr.servant_face
	familyBanTime = user.attr.family_ban_time
	FamilyMgr.myFamilyID = user.attr.family_id
	borderID = user.attr.avatar_border
	headID = user.attr.head
	faceGroupID = user.attr.servant_face
	useType = user.attr.use_avatar
end

function resetLastFight()
	if user then
		user.fight = nil
	end
end

function updateGold()
	gold = payGold + givenGold
end

function isMaxLevel()
	return level == 200
end

function updateScore(slot0, slot1)
	scoreDic[slot0] = slot1

	if slot0 == RoleConst.SCORE_VIT then
		vit = slot1
	end
end

function getScore(slot0)
	return scoreDic[slot0] or 0
end

function updateRoleName(slot0)
	roleName = slot0

	Dispatcher.dispatch(ModuleCommand.ON_ROLE_RENAME, slot0)
end

function updateRoleHead(slot0)
	borderID = slot0

	Dispatcher.dispatch(ModuleCommand.ON_ROLE_HEAD_CHANGE)
end

function setTimezone(slot0)
	serverTimezone = slot0 or serverTimezone
end
