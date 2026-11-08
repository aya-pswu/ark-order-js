// 誓灵突破（overstep / 界限突破）客户端配置镜像——**自动生成，勿手改**
// 生成器：tools/bc_cmp/gen_break_data.py（源：CfgServant_ljd.lua / ServantConst_re.lua / CfgItems_ljd.lua）
//
// 客户端口径（ServantConfigVO.canOverstep / ServantTrainBreakView / ServantTrainBreakSelectPanel）：
//   等级上限 getMaxLv = 75 + overstep*5 → 0 突 75 级、5 突 100 级、11 突 130 级（满）
//   **前 5 突（overstep 0→5）**：等级 >= OVER_STEP_LVS[overstep+1]、
//     选中 nums[overstep+1] 只"同 typeId 或 commons 里的通用素材誓灵"、金币 >= costs[overstep+1]；
//     可选素材过滤 = canUse()（status==0 且不在任何编队）且 id != 自己
//   **界限突破（overstep 5→11）**：不吃誓灵（nums 恒 0），改吃 BREAK_MATERIALS；
//     前置 isCanDoOverstepMission = overstep<11 且 star==5 且 feeling>=100 且 100<=level<130
const BREAKS = {
  1: {"costs":[1000,2000,3000,4000,5000,6000,8000,10000,12000,15000,20000],"nums":[1,2,3,4,5,0,0,0,0],"commons":[1131006],"hurts":[3,4,5,6,7,7,7,7,7,7,7],"defs":[1,1,5,2,2,5,3,3,3,3,3,3,3]},
  2: {"costs":[1000,2000,3000,4000,5000,6000,8000,10000,12000,15000,20000],"nums":[1,2,2,3,3,0,0,0,0],"commons":[1131006],"hurts":[3,4,5,6,7,7,7,7,7,7,7],"defs":[1,1,5,2,2,5,3,3,3,3,3,3,3]},
  3: {"costs":[1000,2000,3000,4000,5000,6000,8000,10000,12000,15000,20000],"nums":[1,1,2,2,3,0,0,0,0],"commons":[1131006],"hurts":[3,4,5,6,7,7,7,7,7,7,7],"defs":[1,1,5,2,2,5,3,3,3,3,3,3,3]},
  4: {"costs":[1000,2000,3000,4000,5000,6000,8000,10000,12000,15000,20000],"nums":[1,1,1,2,2,0,0,0,0],"commons":[1141007],"hurts":[3,4,5,6,7,7,7,7,7,7,7],"defs":[1,1,5,2,2,5,3,3,3,3,3,3,3]},
};

// 界限突破材料：BREAK_MATERIALS[目标 overstep - 6] （overstep 5→6 用第 0 项 … 10→11 用第 5 项）
// 取值口径与 ServantConfig.getBreakMat(typeId, step)=(breakMaterials[typeId] or default)[max(step-5,1)] 一致
const BREAK_MATERIALS = [
  [{"id":26000000,"num":50},{"id":27000000,"num":50},{"id":20000031,"num":1}],
  [{"id":26000000,"num":80},{"id":27000000,"num":80},{"id":20000031,"num":10}],
  [{"id":26000001,"num":80},{"id":27000001,"num":50},{"id":20000031,"num":20}],
  [{"id":26000002,"num":80},{"id":27000002,"num":50},{"id":20000031,"num":25}],
  [{"id":26000002,"num":100},{"id":27000002,"num":80},{"id":20000031,"num":20},{"id":20000032,"num":1}],
  [{"id":26000002,"num":120},{"id":27000002,"num":100},{"id":20000031,"num":25},{"id":20000032,"num":1}],
];

// ServantConst.OVER_STEP_LVS：突破所需等级（按**当前** overstep 查，>=5 时客户端回落 25 但走界限突破分支）
const OVER_STEP_LVS = [15,25,25,25,25];
const MAX_OVERSTEP = 11;        // ServantConfigVO：overstep==11 面板显示"界限突破"满态
const NORMAL_OVERSTEP = 5;      // 前 5 突吃誓灵，之后吃材料
const LIMIT_NEED_LEVEL = 100;   // isCanDoOverstepMission 的 level >= 100
const LIMIT_NEED_STAR = 5;      // 需要进化到 5 星（官方错误码 173010）
const LIMIT_NEED_FEELING = 100; // 需要羁绊达到 100（官方错误码 173011）

// 官方错误码（CfgErrorCode，按 m_servant_break_toc 的 protoId=173 编号）——本身就是需求文档
const ERR = {
  COST_NUM: 173001,      // 选择消耗的誓灵数量不足
  COST_TYPE: 173002,     // 选择消耗的誓灵的类型错误
  NEED_LEVEL: 173003,    // 突破等级不足
  MAX_TIMES: 173004,     // 突破次数已达到上限
  COST_IN_TEAM: 173005,  // 誓灵正在编队中，无法被消耗
  NEED_LV100: 173009,    // 等级不足100
  NEED_STAR5: 173010,    // 需要进化到5星
  NEED_FEELING: 173011,  // 需要羁绊达到100
  FULL: 173012,          // 已经突破满了
  NEED_BREAK5: 173013,   // 需要先突破到5级
  NOT_SILVER: 1059002,   // 金币不足（173 段没有金币码，借通用码）
  NOT_MATERIAL: 221001,  // 材料不足（同上）
};

const MAT_NAMES = {"20000031":"能量芯片","20000032":"灵核芯片","26000000":"技能模组Lv1","26000001":"技能模组Lv2","26000002":"技能模组Lv3","27000000":"核心晶组Lv1","27000001":"核心晶组Lv2","27000002":"核心晶组Lv3"};

module.exports = { BREAKS, BREAK_MATERIALS, OVER_STEP_LVS, MAX_OVERSTEP, NORMAL_OVERSTEP,
  LIMIT_NEED_LEVEL, LIMIT_NEED_STAR, LIMIT_NEED_FEELING, ERR, MAT_NAMES };
