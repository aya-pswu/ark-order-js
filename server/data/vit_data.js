// 体力（vit）系统数据。**依据真机在跑的新版客户端**（tools/lua_remote/bc，反编译产物在 tools/bc_cmp/vit_new/）。
//
// 客户端要点（实证）：
//  - 体力值存在角色积分 role_scores 的 id=5（RoleConst.SCORE_VIT）；顶栏读的是 GlobalData.vit，
//    而 GlobalData.initData **不会**把 scoreDic[5] 同步给 vit → **登录必须补推 m_vit_update_toc**，否则顶栏恒 0。
//  - 上限走 m_dynamic_limit_toc{silver, vit}（客户端 m_dynamic_limit_tos 是空存根，从不主动请求，只能服务端推）；
//    两个字段必须同时给（另一个为 nil 时 updateVitAndMoneyMax 拼字符串会崩）。
//  - m_vit_buy_toc / m_item_use_toc 的 handler **都不写 GlobalData**，任何体力变化后都要补推 m_vit_update_toc。
//  - m_role_power_update_toc 在本版客户端没有 handler（死协议），别用。
//  - 出击消耗 = 出战队伍（主队+副队）中存活誓灵 CfgServant.costVit 之和，客户端只染红不拦截，
//    体力不足由服务端回错误码 262006（CfgErrorCode "体力不足"，type=TIP）。
const fs = require('fs');
const path = require('path');
const { log } = require('../log');

const SCORE_VIT = 5;              // RoleConst.SCORE_VIT
const ITEM_GOLD = 30000000;       // ItemConst.TYPE_ID_GOLD（水晶）
const ITEM_ROLE_EXP = 30000001;   // 御灵士经验
const ITEM_VIT = 30000002;        // 体力（宿舍气泡/道具奖励都用这个 type_id）
const ITEM_SILVER = 30000003;     // 金币
const ERR_VIT_NOT_ENOUGH = 262006; // CfgErrorCode：体力不足（m_common_error_toc.code）

// 上限：官方 = 基础值 + CfgGrow 技能36「电池包扩容」(0/100/…/500)，基础值只在官方服务端 → 本地服自定。
// 金币上限同理（CfgGrow 技能37「钱包扩容」）。体力可超上限持有（官方错误码提到 3 倍上限）
const VIT_MAX = 1000;
const SILVER_MAX = 999999;

// 誓灵出击体力消耗：CfgServant.costVit —— color[稀有度] = 7/8/9/10，另有两个单卡覆盖。
// 稀有度 = typeId 左起第 3 位（客户端 Util.indexNum(typeId,5,5) 即从右数第 5 位，7 位 id 下等价）
const COST_BY_RARITY = [7, 8, 9, 10];
const COST_OVERRIDE = { 1141007: 8, 1131006: 7 };
function costVitOf(typeId) {
  const t = Number(typeId) || 0;
  if (COST_OVERRIDE[t]) return COST_OVERRIDE[t];
  const rarity = Math.floor(t / 10000) % 10; // 7 位 id 的左起第 3 位
  return COST_BY_RARITY[Math.min(Math.max(rarity, 1), 4) - 1];
}

// 研究所产出建筑（CfgDorm.study）：effect[等级] = [每小时产出, 最大储存]
// bd 1「用爱发电」产体力、bd 2「信仰充值」产金币；建筑等级 1~10
const STUDY = {
  1: { name: '用爱发电', item: ITEM_VIT, effect: [[100, 1200], [104, 1300], [108, 1400], [112, 1500], [116, 1600], [120, 1800], [124, 2000], [128, 2200], [132, 2600], [140, 3000]] },
  2: { name: '信仰充值', item: ITEM_SILVER, effect: [[150, 3000], [165, 3375], [180, 3750], [195, 4125], [210, 4500], [225, 5100], [240, 5700], [255, 6300], [270, 7500], [300, 9000]] },
};
function studyEffect(bdId, level) {
  const cfg = STUDY[bdId];
  if (!cfg) return null;
  const row = cfg.effect[Math.min(Math.max(Number(level) || 1, 1), cfg.effect.length) - 1];
  return { perHour: row[0], maxStore: row[1], item: cfg.item, name: cfg.name };
}

// 买体力（CfgShop.vit）：每次 +400，每日 15 次，水晶价格按今日已买次数取
const VIT_BUY = {
  add: 400,
  maxTimes: 15,
  cost: [50, 50, 100, 100, 100, 100, 200, 200, 200, 200, 400, 400, 400, 400, 400],
};

// 道具使用产出（CfgItems.data = {{type_id, num}, ...}）。解析真机版 CfgItems 反编译产物；
// 缺文件时退回旧版（只影响道具使用，不影响体力主链路）
const ITEM_USE = {};   // type_id → [{type, num}]
const ITEM_MAX_USE = {}; // type_id → 单次最多使用个数
(function parseItems() {
  const cands = [
    path.join(__dirname, '..', '..', 'tools', 'bc_cmp', 'vit_new', 'CfgItems.lua'),
    path.join(__dirname, '..', '..', 'tools', 'lua_src', 'CfgItems.lua'),
  ];
  const file = cands.find(p => fs.existsSync(p));
  if (!file) { log('[vit] 未找到 CfgItems，道具使用产出表为空'); return; }
  try {
    const txt = fs.readFileSync(file, 'utf8');
    // 逐条 [id] = { ... }（条目一级缩进，内部 data = {{type_id, num}, ...} 二级缩进）
    const re = /\n\t\[(\d+)(?:\.0)?\] = \{([\s\S]*?)\n\t\},/g;
    let m, n = 0;
    while ((m = re.exec(txt)) !== null) {
      const id = Number(m[1]), body = m[2];
      const mu = /maxUse = (\d+)/.exec(body);
      if (mu) ITEM_MAX_USE[id] = Number(mu[1]);
      const dm = /\n\t\tdata = \{([\s\S]*?)\n\t\t\}/.exec(body);
      if (!dm) continue;
      const pairs = [];
      const pre = /\{\s*(\d{6,9}),\s*(\d+),?\s*\}/g; // {type_id, num}（跨行）
      let p;
      while ((p = pre.exec(dm[1])) !== null) pairs.push({ type: Number(p[1]), num: Number(p[2]) });
      if (pairs.length) { ITEM_USE[id] = pairs; n++; }
    }
    log(`[vit] CfgItems 道具产出表：${n} 项（源 ${path.basename(path.dirname(file))}/CfgItems.lua）`);
  } catch (e) {
    log('[vit] CfgItems 解析失败：' + e.message);
  }
})();

module.exports = {
  SCORE_VIT, ITEM_GOLD, ITEM_ROLE_EXP, ITEM_VIT, ITEM_SILVER, ERR_VIT_NOT_ENOUGH,
  VIT_MAX, SILVER_MAX, costVitOf, STUDY, studyEffect, VIT_BUY, ITEM_USE, ITEM_MAX_USE,
};
