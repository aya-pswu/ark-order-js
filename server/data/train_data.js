// 训练系统数据（提取自客户端 bc：CfgServant.servantExp 曲线 + CfgItems 结晶系列 train 字段）
// 经验语义（ServantConfigVO.getUpgradeExp）：升到 level+1 需要本级别内攒满 servantExp[level+1] 经验，
// exp 是"当前级别内进度"，升级时扣除后余量进下一级（客户端 lblNextExp = getUpgradeExp() - exp 可证）。
const SERVANT_EXP = [0,100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1600,1800,2000,2200,2400,2600,2800,3000,3200,3400,3600,3800,4000,4200,4400,4600,4800,5000,5200,5400,6000,6300,6600,6900,7200,7500,7800,8100,8400,8700,9000,9300,9600,9900,10200,10500,10800,11100,11400,11700,12400,12800,13200,13600,14000,14400,14800,15200,15600,16000,16400,16800,17200,17600,18000,18400,18800,19200,19600,20000,21000,22000,23000,24000,25000,26000,27000,28000,29000,30000,32000,34000,36000,38000,40000,42000,44000,46000,48000,50000,55000,60000,65000,70000,150000,80000,90000,100000,110000,120000,140000,160000,180000,200000,220000,245000,270000,295000,320000,345000,370000,395000,420000,450000,490000];
// ↑ JS 下标 i 对应 Lua servantExp[i+1]：needOf(level)（level→level+1 所需）= SERVANT_EXP[level]

// 训练材料（CfgItems.data.train；nature 0=无属性加成，1水2火3风4土5光6暗；
// 同属性材料经验 ×1.5——客户端 getSelectItemsExpAndMoney：exp*num + exp*0.5*num）
//
// ⚠️ 真机 CfgItems 共 **24** 个 train 块，本表只有 22 条——**另外两条是故意排除的**：
//   60000045「试炼的传承」  exp=0, servantTypeId=1434028（赫拉克勒斯）
//   60000131「试炼的传承·伪」exp=0, servantCamp=14（奥林匹斯）
//   两者 desc 都写「使用后为该誓灵增加**活动期间通过助战获得的等量经验值**」⇒ 经验是活动累计量，
//   配置里 exp 恒 0。当普通材料登记会「吃材料给 0 经验」（阶段二照扣），比不实现更糟。
//   客户端 `getSelectItemsExpAndMoney` 对它们同样算 0 ⇒ btnTrain 恒灰，正常玩家根本发不出去。
//   ⇒ 保持不登记（handler 里 `!mat → continue`，不消耗不入账），是有意为之，别"补齐"。
const TRAIN_ITEMS = {
  20010000: { name: '暗淡的水结晶', exp: 100, cost: 4, nature: 1 },
  20011000: { name: '暗淡的火结晶', exp: 100, cost: 4, nature: 2 },
  20012000: { name: '暗淡的风结晶', exp: 100, cost: 4, nature: 3 },
  20013000: { name: '暗淡的土结晶', exp: 100, cost: 4, nature: 4 },
  20014000: { name: '暗淡的光结晶', exp: 100, cost: 4, nature: 5 },
  20015000: { name: '暗淡的暗结晶', exp: 100, cost: 4, nature: 6 },
  20016000: { name: '暗淡的自然结晶', exp: 150, cost: 4, nature: 0 },
  20010001: { name: '明亮的水结晶', exp: 500, cost: 20, nature: 1 },
  20011001: { name: '明亮的火结晶', exp: 500, cost: 20, nature: 2 },
  20012001: { name: '明亮的风结晶', exp: 500, cost: 20, nature: 3 },
  20013001: { name: '明亮的土结晶', exp: 500, cost: 20, nature: 4 },
  20014001: { name: '明亮的光结晶', exp: 500, cost: 20, nature: 5 },
  20015001: { name: '明亮的暗结晶', exp: 500, cost: 20, nature: 6 },
  20016001: { name: '明亮的自然结晶', exp: 750, cost: 20, nature: 0 },
  20010002: { name: '闪耀的水结晶', exp: 1500, cost: 60, nature: 1 },
  20011002: { name: '闪耀的火结晶', exp: 1500, cost: 60, nature: 2 },
  20012002: { name: '闪耀的风结晶', exp: 1500, cost: 60, nature: 3 },
  20013002: { name: '闪耀的土结晶', exp: 1500, cost: 60, nature: 4 },
  20014002: { name: '闪耀的光结晶', exp: 1500, cost: 60, nature: 5 },
  20015002: { name: '闪耀的暗结晶', exp: 1500, cost: 60, nature: 6 },
  20016002: { name: '闪耀的自然结晶', exp: 2250, cost: 60, nature: 0 },
  // 限定材料：客户端 ServantTrainSelectItemPanel.filter 用 servantTypeId / servantCamp 过滤可选列表，
  // 服务端必须同口径校验（否则改包客户端能把 113550 经验喂给任意誓灵）
  60000160: { name: '雪见大福', exp: 113550, cost: 0, nature: 0, servantTypeId: 1331006 }, // 仅雪女
};

// ---- 誓灵属性推导（客户端 ServantConfigVO.ctor 同口径）----
//   nature = Util.indexNum(typeId, 4, 4)  = floor(t/1000) % 10
//   camp   = Util.indexNum(typeId, 6, 7)  = floor(t/100000) % 100
// （Util.indexNum(v,a,b) = floor(v / 10^(a-1)) % 10^(b-a+1)，从**低位**起数）
function natureOf(typeId) { return Math.floor(Number(typeId) / 1000) % 10; }
function campOf(typeId) { return Math.floor(Number(typeId) / 100000) % 100; }

// 材料可用性：限定材料（servantTypeId / servantCamp）必须与目标誓灵匹配。
// 与客户端 ServantTrainSelectItemPanel.filter 同口径——那里两条是**覆盖式**赋值
// （先判 typeId 再判 camp，后者命中会覆盖前者），但配置里两者从不同时出现，故顺序无关。
// 返回 '' 表示可用，否则返回不可用原因（日志/调试用）。
function trainItemBanReason(mat, servant) {
  if (!mat || !servant) return '材料或誓灵不存在';
  const type = Number(servant.type) || 0;
  if (mat.servantTypeId != null && Number(mat.servantTypeId) !== type) {
    return `限定 ${mat.name} 只能喂给誓灵 ${mat.servantTypeId}（当前 ${type}）`;
  }
  if (mat.servantCamp != null && Number(mat.servantCamp) !== campOf(type)) {
    return `限定 ${mat.name} 只能喂给阵营 ${mat.servantCamp}（当前 ${campOf(type)}）`;
  }
  return '';
}

// ---- 训练结果档位（成功 / 大成功 / 超大成功）----
//
// 客户端只显示、不判定：`m_servant_train_toc.op_type` ∈ {0,1,2} →
//   ServantTrainResultView.onGUI 把 lblScale 写成 "100%"/"150%"/"200%"，
//   onEnd 再按 op_type 选标题特效 P_ui_sjxsjm1.{a,b,c}{1,2}。
// 官方 wiki 原文「一定几率触发训练大成功（获得150%经验）和超大成功（获得200%经验）」，
// **不给概率**；客户端 CfgItems.data.train 只有 exp/cost/nature，CfgServant/CfgMain 也无概率字段。
// ⇒ 基础概率官方不可考，按 data/feeling_rules.js 的同款口径自定基线，集中在这里便于调参。
//
// 星图 42「幸运值UP」是唯一有官方数值的挂点：CfgGrow[42].des = "训练大成功率提升{0}%"，
//   argsList[1..5] = 0.5 / 1 / 1.5 / 2 / 2.5（**百分点**，满级 +2.5pp）→ 只加"大成功"，不加"超大成功"。
const TRAIN_BIG_RATE = 0.10;          // 基础大成功率 10%
const TRAIN_SUPER_RATE = 0.03;        // 基础超大成功率 3%（期望倍率 1 + .10×.5 + .03×1 = 1.08×）
const TRAIN_LUCK_PCT_PER_LV = 0.005;  // 星图 42：每级 +0.5pp（0.005 = 0.5%）
const TRAIN_TIER_MUL = [1, 1.5, 2];   // 下标 = op_type

// 掷一次档位。luckLv = 星图 42 等级（0~5）。
// 返回 { opType, mul, bigRate }；opType 直接作为 m_servant_train_toc.op_type 下发。
// 边界口径：左闭右开 —— r < super 命中超大；super <= r < super+big 命中大成功。
// bigRate 被 (1 - super) 夹住，避免星图加成把两档概率加过 100%。
function rollTrainTier(luckLv, rng) {
  const r = (rng || Math.random)();
  const superRate = Math.min(1, TRAIN_SUPER_RATE);
  const bigRate = Math.min(1 - superRate,
    TRAIN_BIG_RATE + Math.max(0, Number(luckLv) || 0) * TRAIN_LUCK_PCT_PER_LV);
  if (r < superRate) return { opType: 2, mul: TRAIN_TIER_MUL[2], bigRate };
  if (r < superRate + bigRate) return { opType: 1, mul: TRAIN_TIER_MUL[1], bigRate };
  return { opType: 0, mul: TRAIN_TIER_MUL[0], bigRate };
}

// 等级上限（ServantConfigVO.getMaxLv = 75 + overstep*5；overstep=突破，上限 5 → 满 100 级）
function maxLevelOf(servant) {
  return 75 + (Number(servant.overstep) || 0) * 5;
}

// level → level+1 所需经验
function needOf(level) {
  return SERVANT_EXP[level] || 0;
}

// 给誓灵加经验（就地修改 servant.level/exp），返回 {oldLevel, oldExp, level, exp, gained, overflow}
// 满级：多余经验不进本体、exp 归 0（客户端满级经验条恒满：level==getMaxLv() and 1）
// ⚠️ overflow = 被本体丢弃的量（"本来就满级"的整份 + "中途升到满级后的余量"）。
//    协会时光银行（CfgDorm.study[4]，handlers/dorm.js 的 bankDeposit）按转化率吃这份溢出。
//    **gained 语义不变** —— 结算/训练面板仍然显示 +0，溢出只走银行。
function applyServantExp(servant, gained) {
  const oldLevel = Number(servant.level) || 1;
  const oldExp = Number(servant.exp) || 0;
  const max = maxLevelOf(servant);
  let level = oldLevel, exp = oldExp, remain = Math.max(0, Math.floor(gained));
  let used = 0;
  while (level < max) {
    const need = needOf(level);
    if (exp + remain < need) break;
    remain -= need - exp;
    used += need - exp;
    level++;
    exp = 0;
  }
  let overflow = 0;
  if (level >= max) {
    // 已满级：溢出经验不进本体（不计入 gained，结算/训练面板显示 0 得），回传给调用方
    overflow = remain;
    remain = 0;
    exp = 0;
  } else {
    used += remain;
    exp += remain;
    remain = 0;
  }
  servant.level = level;
  servant.exp = exp;
  return { oldLevel, oldExp, level, exp, gained: used, overflow };
}

module.exports = {
  SERVANT_EXP, TRAIN_ITEMS, maxLevelOf, needOf, applyServantExp,
  natureOf, campOf, trainItemBanReason,
  TRAIN_BIG_RATE, TRAIN_SUPER_RATE, TRAIN_LUCK_PCT_PER_LV, TRAIN_TIER_MUL, rollTrainTier,
};
