// 由 tools/bc_cmp/gen_dispatch_data.js 生成（勿手改；重跑脚本再生成）。
// 来源：真机热更包客户端配置 CfgDorm.dispatchs + CfgDorm.study[3]（tools/cfgdorm_new.lua）。
// TASKS：27 条派遣任务。conds[].kind = 1等级 / 2属性 / 3体力（DormConst.DISPATCH_COND_*）；
//        conds[].count 仅等级/属性有（体力条件官方配置只有两列）；
//        rewards = [typeId, min, max]，[min,max] 为随机区间。
// BUILDING：bd=3「使命必达」派遣室——cap=各级队列上限 / lvReq=主角等级门槛 / lvCost=升级金币 / maxLevel=effect 行数。
// ⚠️ maxLevel = 5（effect 只有 5 行）；服务端建筑升级上限必须用它，不能再用常量 10。

const TASKS = {
  1: {id:1, name:"MO前线支援", tab:5, type:1, time:28800, conds:[{kind:3, val:1000}, {kind:1, val:20, count:1}], rewards:[[30000001, 15000, 15000], [30000003, 2000, 2000], [31000010, 1, 1]]},
  2: {id:2, name:"补给扩充I", tab:1, type:1, time:3600, conds:[{kind:1, val:1, count:1}], rewards:[[30000001, 540, 540], [30000003, 270, 290], [30000002, 85, 95], [31000009, 2, 4]]},
  3: {id:3, name:"补给扩充II", tab:1, type:1, time:3600, conds:[{kind:1, val:1, count:1}], rewards:[[30000001, 540, 540], [30000003, 190, 230], [30000002, 90, 110], [31000009, 3, 4]]},
  4: {id:4, name:"兵器再造I", tab:1, type:1, time:3600, conds:[{kind:1, val:1, count:1}], rewards:[[30000001, 540, 540], [30000003, 100, 200], [30000002, 130, 170], [31000009, 2, 4]]},
  5: {id:5, name:"兵器再造II", tab:1, type:1, time:3600, conds:[{kind:1, val:1, count:1}], rewards:[[30000001, 540, 540], [30000003, 300, 360], [30000002, 85, 115], [31000009, 2, 4]]},
  6: {id:6, name:"资源运输作战I", tab:1, type:1, time:5400, conds:[{kind:1, val:1, count:1}], rewards:[[30000001, 810, 810], [30000003, 540, 600], [30000002, 80, 120], [31000009, 3, 6]]},
  7: {id:7, name:"资源运输作战II", tab:1, type:1, time:5400, conds:[{kind:1, val:1, count:1}], rewards:[[30000001, 810, 810], [30000003, 400, 440], [30000002, 70, 130], [31000009, 3, 6]]},
  8: {id:8, name:"敌情侦查I", tab:1, type:1, time:3600, conds:[{kind:1, val:1, count:1}], rewards:[[30000001, 540, 540], [30000003, 200, 260], [30000002, 90, 110], [31000009, 2, 4]]},
  9: {id:9, name:"敌情侦查II", tab:1, type:1, time:3600, conds:[{kind:1, val:1, count:1}], rewards:[[30000001, 540, 540], [30000003, 310, 330], [30000002, 70, 90], [31000009, 4, 5]]},
  10: {id:10, name:"基地建设I", tab:1, type:1, time:3600, conds:[{kind:1, val:1, count:1}], rewards:[[30000001, 540, 540], [30000003, 280, 300], [30000002, 75, 125], [31000009, 2, 4]]},
  11: {id:11, name:"基地建设II", tab:1, type:1, time:3600, conds:[{kind:1, val:1, count:1}], rewards:[[30000001, 540, 540], [30000003, 150, 350], [30000002, 60, 100], [31000009, 2, 3]]},
  12: {id:12, name:"通商侦查作战", tab:2, type:1, time:5400, conds:[{kind:1, val:5, count:1}], rewards:[[30000001, 90, 90], [30000003, 110, 130], [31000009, 0, 1]]},
  13: {id:13, name:"基础设施强化", tab:2, type:1, time:5400, conds:[{kind:1, val:5, count:1}], rewards:[[30000001, 90, 90], [30000002, 35, 45], [31000009, 0, 1]]},
  14: {id:14, name:"警戒线搭建", tab:2, type:1, time:5400, conds:[{kind:1, val:5, count:1}], rewards:[[30000001, 90, 90], [30000003, 60, 80], [30000002, 15, 20], [31000009, 0, 1]]},
  15: {id:15, name:"誓灵基础训练I", tab:3, type:1, time:14400, conds:[{kind:1, val:10, count:2}], rewards:[[30000001, 240, 240], [30000003, 60, 80], [30000002, 15, 20], [20016000, 6, 10]]},
  16: {id:16, name:"长距离打击作战", tab:3, type:1, time:14400, conds:[{kind:2, val:4, count:1}], rewards:[[30000001, 240, 240], [30000003, 240, 320], [31000009, 1, 2]]},
  17: {id:17, name:"演武预热练习", tab:3, type:1, time:14400, conds:[{kind:1, val:10, count:2}], rewards:[[30000001, 240, 240], [30000002, 76, 100], [31000009, 1, 2]]},
  18: {id:18, name:"对外通商", tab:4, type:1, time:36000, conds:[{kind:2, val:1, count:1}], rewards:[[30000001, 600, 600], [30000003, 550, 650], [31000009, 4, 8]]},
  19: {id:19, name:"温泉浴作战", tab:4, type:1, time:36000, conds:[{kind:2, val:3, count:1}], rewards:[[30000001, 600, 600], [30000002, 160, 200], [31000009, 4, 8]]},
  20: {id:20, name:"圣物发掘I", tab:4, type:1, time:36000, conds:[{kind:1, val:15, count:2}], rewards:[[30000001, 600, 600], [30000003, 100, 120], [30000002, 50, 70], [20000900, 2, 3]]},
  21: {id:21, name:"誓灵强化训练I", tab:3, type:1, time:7200, conds:[{kind:1, val:25, count:1}], rewards:[[30000001, 120, 120], [30000003, 36, 40], [30000002, 10, 14], [20016001, 2, 4]]},
  22: {id:22, name:"誓灵强化训练II", tab:4, type:1, time:18000, conds:[{kind:1, val:25, count:3}], rewards:[[30000001, 300, 300], [30000003, 90, 100], [30000002, 25, 35], [20016001, 5, 6]]},
  23: {id:23, name:"AN作战", tab:4, type:1, time:28800, conds:[{kind:1, val:40, count:2}], rewards:[[30000001, 1200, 1200], [30000003, 1000, 1000], [30000002, 260, 300], [20016001, 8, 10], [20000901, 2, 3]]},
  24: {id:24, name:"摸鱼作战I", tab:5, type:1, time:5400, conds:[{kind:3, val:300}, {kind:1, val:1, count:1}], rewards:[[30000001, 3600, 3600], [30000003, 120, 120], [20000900, 1, 1]]},
  25: {id:25, name:"咸鱼计划I", tab:5, type:1, time:10800, conds:[{kind:3, val:500}, {kind:1, val:1, count:1}], rewards:[[30000001, 6000, 6000], [30000003, 200, 200], [20000901, 1, 1]]},
  26: {id:26, name:"鲈鱼指令I", tab:5, type:1, time:18000, conds:[{kind:3, val:800}, {kind:1, val:10, count:1}], rewards:[[30000001, 10000, 10000], [30000003, 400, 400], [20000901, 1, 2]]},
  101: {id:101, name:"自律派遣", tab:6, type:2, time:240, conds:[], rewards:[]},
};

const BUILDING = {cap:[1, 2, 3, 4, 4], lvReq:[1, 5, 15, 25, 40], lvCost:[0, 500, 2000, 10000, 20000], maxLevel:5};

const NORMAL_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
const AUTO_ID = 101;

module.exports = { TASKS, BUILDING, NORMAL_IDS, AUTO_ID };
