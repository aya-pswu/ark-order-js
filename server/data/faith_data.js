// 信仰（Faith）系统配置与公式
//
// 数据源（全部为客户端真机热更包/反编译实证）：
//   tools/lua_src/CfgFaith.lua            —— cost / colorInfo / lvInfo / lineInfo / filter
//   tools/lua_src/ServantConst.lua        —— FAITH_LINK / FAITH_LINK_AROUND / FAITH_POS_ATTR /
//                                            FAITH_LINE_TO_ATTR / FAITH_ATTR / MAX_LEVEL(100)
//   tools/lua_src/FaithVO.lua             —— 单件信仰 getProp / getMaxLv / getDecomposeExp
//   tools/lua_src/ServantFaithMapVO.lua   —— 9 格棋盘汇总 + 同色链接乘区
//   tools/lua_src/ServantFaithLineVO.lua  —— 链接档位 val → 乘数 1 + val/100
//   tools/bc_cmp/vit_new/CfgItems.lua     —— 24 前缀 24 件信仰（8 属性 × 3 稀有度）
//
// 属性码口径（GameConst.BASE_PROP_CODE_*，与 CfgFaith.filter[1] 完全一致）：
//   1生命 2物攻 3魔攻 4物防 5魔防 6速度 26增伤 27减伤
// typeId：24000000 + color×100000 + 属性码（color 3=蓝 / 4=紫 / 5=金）
//
// 数值口径（FaithVO.getProp）：
//   prop = lvInfo[lv].prop[属性码]
//   增伤/减伤（26/27）不看誓灵等级 → 倍率恒 1 → 数值即 prop（20×lv）
//   其余属性 → 倍率 = 誓灵等级 / 100（ServantConst.MAX_LEVEL）
//   返回 math.ceil(prop × 倍率)
// 面板 tips 等价表述：生命 = 信仰等级×誓灵等级/6.25、其余 = /12.5、增伤减伤 = 信仰等级×0.2%

const SERVANT_MAX_LEVEL = 100;

// ---- 颜色（稀有度）表：CfgFaith.colorInfo ----
// maxLv 是"信仰自身等级上限"，与 item.color（3/4/5）区分
const COLOR_INFO = {
  3: { maxLv: 5, decomposeExp: 10, name: '蓝' },
  4: { maxLv: 10, decomposeExp: 20, name: '紫' },
  5: { maxLv: 15, decomposeExp: 40, name: '金' },
};

// ---- 等级表：CfgFaith.lvInfo（下标 1..15；exp 是"升到 lv+1 所需经验"，15 级为 0=满级）----
// prop[1..6] = 生命/物攻/魔攻/物防/魔防/速度；prop[26]/[27] = 增伤/减伤
const LV_INFO = (() => {
  const arr = [];
  const exps = [20, 40, 60, 80, 140, 200, 260, 320, 380, 480, 580, 680, 780, 880, 0];
  const hp = [16, 32, 48, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240];
  const other = [8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120];
  const sp = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
  for (let i = 0; i < 15; i++) {
    arr.push({
      lv: i + 1,
      exp: exps[i],
      prop: { 1: hp[i], 2: other[i], 3: other[i], 4: other[i], 5: other[i], 6: other[i], 26: sp[i], 27: sp[i] },
    });
  }
  return arr;
})();

// ---- 链接（洗练同色）表：CfgFaith.lineInfo（6 色，每色 16 档，val = 3/6/9/…/48）----
const LINE_INFO = {};
for (let c = 1; c <= 6; c++) {
  const numEff = [];
  for (let n = 1; n <= 16; n++) numEff.push({ val: 3 * n });
  LINE_INFO[c] = { color: c, numEff };
}

// ---- 9 格棋盘：pos 1..9（3×3 行优先，1-based；pos5 为中心无属性限制）----
// FAITH_LINK[pos] = 该格 4 条边（第 i 条边）指向的相邻格号（0 = 该边无邻居）
// 方向约定：1=左 2=上 3=右 4=下（与 FAITH_LINK_AROUND / getLinkDir 一致）
const FAITH_LINK = {
  1: [3, 2, 4, 7], 2: [0, 3, 5, 1], 3: [1, 9, 6, 2],
  4: [1, 5, 7, 0], 5: [2, 6, 8, 4], 6: [3, 0, 9, 5],
  7: [4, 8, 9, 1], 8: [5, 9, 0, 7], 9: [6, 3, 7, 8],
};
// 四角绕回时方向不取反（key=pos，value={dir: dirAtNeighbor}）
const FAITH_LINK_AROUND = {
  1: { 1: 1, 4: 4 },
  3: { 1: 1, 2: 2 },
  7: { 4: 4, 3: 3 },
  9: { 2: 2, 3: 3 },
};
// 格子属性限制（FAITH_POS_ATTR；0 = 无限制，中心格）
const FAITH_POS_ATTR = [2, 6, 4, 26, 0, 27, 3, 1, 5]; // pos1..9
// 链接色 → 受加成的属性码（FAITH_LINE_TO_ATTR）
const FAITH_LINE_TO_ATTR = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };

// ---- 属性码 ↔ 服务端六维键（与 relic_data.PROP_KEYS 同源）----
// 26/27（增伤/减伤）战斗模型里没有对应机制 → 只在面板展示，不入 calcAttrs
const PROP_KEYS = { 1: 'hp', 2: 'phy_atk', 3: 'mag_atk', 4: 'phy_def', 5: 'mag_def', 6: 'speed' };
// 26 增伤 → 我方伤害倍率、27 减伤 → 受击减免（本服战斗模型的口径，见 fight_core/map_fight）
const PROP_DMG = 26, PROP_MIT = 27;

// ---- 道具/积分常量 ----
const SUMMON_COST = 1000;              // CfgFaith.cost：每抽银币（抵扣券可抵）
const ITEM_SUMMON_CARD = 31000023;     // 许愿卡（每抽 1 张）
const ITEM_SUMMON_CLIP = 31000024;     // 抵扣券（每张抵 1000 银币，最多 times 张）
// ---- 通用洗练材料（ServantFaithRefreshSelPanel.lua:44 + CfgItems 31000025/31000026 官方 desc 实证）----
// 选材料面板的来源②：目标信仰 color==5（金）给 31000026「通用型信仰-改」，否则给 31000025「通用型信仰」。
// 品质严格配对、互相不兼容（25 只管 3/4、26 只管 5）。canPile=true 堆叠道具，消耗时扣 cur_num。
const UNIVERSAL_REFRESH_ITEM = { 31000025: [3, 4], 31000026: [5] };
const SCORE_FAITH_EXP = 23;            // GameConst.SCORE_FAITH_EXP = 23 信仰灵光（升级材料）
const SCORE_FAITH_STONE = 24;          // GameConst.SCORE_FAITH_STONE = 24 祈愿石
// 方案数量：客户端两个方案列表（弹窗内嵌 listPlan + 装备方案面板）纯数据驱动、零硬编码、无"新增方案"
// 协议（save_plan 是往已有 id 覆盖写入），服务端发几条显示几条。官方终版口径 = 32 套
// （2019-04-25 公告增至 16 套 → 2019-12-19 公告"从 16 套增加到 32 套"；证据见 调研-信仰方案数量.md）。
const MAX_PLAN = 32;

// ---- typeId 解析 ----
const isFaithType = typeId => Math.floor(Number(typeId) / 1000000) % 100 === 24;
const faithTypeId = (color, prop) => 24000000 + Number(color) * 100000 + Number(prop);
function infoOfType(typeId) {
  if (!isFaithType(typeId)) return null;
  const n = Number(typeId);
  const color = Math.floor(n / 100000) % 10;  // 3/4/5
  const prop = n % 1000;                      // 1..6, 26, 27
  const ci = COLOR_INFO[color];
  if (!ci || !LV_INFO[0].prop[prop]) return null;
  return { color, prop, maxLv: ci.maxLv, decomposeExp: ci.decomposeExp, colorName: ci.name };
}

// 每件信仰的 4 条边颜色（1..6）——服务端生成实例时随机；刷新时改指定边且保证与旧值不同
function rollSideColors() {
  const out = [];
  for (let i = 0; i < 4; i++) out.push(1 + Math.floor(Math.random() * 6));
  return out;
}

// ---- 单件信仰属性值（照抄 FaithVO.getProp / getPropMsg）----
// g = 物品实例 { level, type_id }；servantLevel = 装备者誓灵等级
// 增伤/减伤不看誓灵等级（FaithVO 里把传入等级强行置为 MAX_LEVEL → 倍率 1）
function propValueOf(g, typeId, servantLevel) {
  const info = infoOfType(typeId != null ? typeId : (g && g.type_id));
  if (!info) return 0;
  const lv = Math.max(1, Math.min(info.maxLv, Number(g && g.level) || 1));
  const base = LV_INFO[lv - 1].prop[info.prop] || 0;
  if (info.prop === PROP_DMG || info.prop === PROP_MIT) return base; // 20×lv，不随誓灵等级缩放
  const sl = Math.max(1, Number(servantLevel) || 1);
  return Math.ceil(base * sl / SERVANT_MAX_LEVEL);
}

// 该信仰当前等级升到下一级所需经验（满级返回 0）
function needExpOf(level, color) {
  const ci = COLOR_INFO[Number(color)];
  const maxLv = ci ? ci.maxLv : 15;
  const lv = Number(level) || 1;
  if (lv >= maxLv) return 0;
  return LV_INFO[lv - 1].exp; // lvInfo[lv].exp = 升到 lv+1 所需
}
const maxLvOf = color => (COLOR_INFO[Number(color)] || COLOR_INFO[5]).maxLv;

// ---- 分解返还信仰灵光（FaithVO.getDecomposeExp）----
// = colorInfo.decomposeExp + Σ_{i=1}^{lv-1} lvInfo[i].exp + 当前 exp
function decomposeExpOf(g, typeId) {
  const info = infoOfType(typeId != null ? typeId : (g && g.type_id));
  if (!info) return 0;
  const lv = Math.max(1, Math.min(info.maxLv, Number(g && g.level) || 1));
  let sum = info.decomposeExp + (Number(g && g.exp) || 0);
  for (let i = 1; i <= lv - 1; i++) sum += LV_INFO[i - 1].exp;
  return sum;
}

// ---- 链接方向（ServantFaithMapVO.getLinkDir）----
// 从 pos 的第 dir 条边看过去，邻居那一侧对应的边号；四角绕回时不取反
function linkDir(dir, pos) {
  const around = FAITH_LINK_AROUND[pos];
  if (around && around[dir]) return around[dir];
  return dir + 2 > 4 ? dir - 2 : dir + 2;
}

// ---- 套装归属（唯一口径，lib.js / handlers/faith.js / map_fight.js / tower* 共用）----
// 老编队 1~4 与「本体」共用 servants[].faiths；只有新编队（CfgFormation.formationInfo 组 2~15：
// 501~534 自由编队 / 551~560 唤灵殿堂+信仰对决）才有 faithTeams[teamId]。
//
// 依据（真机字节码实证）：
//  ① 老编队页**没有**信仰入口（FormationTeamItem.updatePropChoice 的 spProFaith 只在
//     FormationConfig.isNewFormation() 为真时显示）；
//  ② 老编队选中时 FormationPanel.onTabSelect 把 FormationMgr.curSelectNewFormationIndex 置 **0**，
//     而 ServantModule.m_faith_equip_tos 的第 4 参（team_id）缺省取它 ⇒ 详情页装备写到 faiths；
//  ③ FormationServantVO.initByFormation 无差别读 p_team_servant.faith ⇒ 老编队应下发本体套装。
// ⚠️ 历史 bug：map_fight 传 teamId=S.mapState.lastId（1~4）读 faithTeams[1]（永远空）→ 主线加成恒 0；
//    见 调研-信仰.md §3.1。
const NEW_FORMATION_MIN = 501; // CfgFormation.formationInfo 组 2 的首个 formationId
function faithSlotsOf(servant, teamId) {
  if (!servant) return {};
  const tid = Number(teamId) || 0;
  if (tid >= NEW_FORMATION_MIN) return (servant.faithTeams || {})[tid] || {};
  return servant.faiths || {};
}

// ---- 同色链接计数（ServantFaithMapVO.updateLineCount 的忠实翻译）----
// board = {pos: {level, type_id, sideColor:[4]}}（只含已装备且实例存在的格）
// 返回 {color: 计数}，计数 n → 该色属性乘区 = 1 + LINE_INFO[color].numEff[n].val / 100
//
// ⚠️ 2026-10-23 修正（真机 asm 逐条核对）：客户端是「**只看前 N 条边**」，不是「最多计 N 次命中」。
// 客户端源码（ServantFaithMapVO.updateLineCount）：
//     for dir, npos in ipairs(FAITH_LINK[pos]) do
//         if 同色 then lineCountDic:take(color):addOne() end
//         slot7 = slot7 + 1                                   -- 计数器每轮无条件 +1
//         if slot7 + 1 == 2 and pos ~= 7 then break end        -- +1 在 break 判断之前
//     end
// 即：第 1 条边处理完 slot7=1 → 1+1==2 成立 → 非 pos7 直接 break ⇒ 每格最多看 **2 条边**（pos7 看 4 条）。
// 旧实现用 `hit >= cap`（命中 2 次才停）会多算——同一盘服务端 {1:2,2:2} vs 客户端 {1:1,2:1}。
// 另外 pos3 被跳过是原实现的历史遗留（边序与方向表不匹配），保持不动。
function countLines(board) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const posStr of Object.keys(board)) {
    const pos = Number(posStr);
    if (pos === 3) continue; // 原实现跳过 pos3（其边序与方向表不匹配的历史遗留）
    const self = board[pos];
    if (!self || !self.sideColor) continue;
    const nbrs = FAITH_LINK[pos] || [];
    const maxEdges = pos === 7 ? 4 : 2;
    for (let i = 0; i < maxEdges; i++) {
      if (!nbrs[i]) continue;
      const dir = i + 1;
      const npos = nbrs[i];
      const col = self.sideColor[i]; // 本格第 dir 条边的颜色
      if (!board[npos]) continue;
      const nb = board[npos];
      if (nb.sideColor && nb.sideColor[linkDir(dir, pos) - 1] === col) {
        counts[col] = (counts[col] || 0) + 1;
      }
    }
  }
  return counts;
}

// 链接乘区（ServantFaithLineVO.getVal）：num 条同色 → 1 + numEff[min(num,16)].val/100；0 条 → 1
function lineMul(count) {
  if (!count) return 1;
  const n = Math.min(16, count);
  return 1 + LINE_INFO[1].numEff[n - 1].val / 100;
}

/**
 * 一只誓灵某套信仰配装的总加成。
 * @param servant  存档誓灵对象（含 faiths/faithTeams）
 * @param bagGoods S.bagGoods
 * @param teamId   0~4 = 本体套装 faiths（老编队与详情页共用）；>=501 = 该新编队的独立套装 faithTeams
 * @returns { hp, phy_atk, mag_atk, phy_def, mag_def, speed, dmg, mit, faithNum, propMap, lines }
 *          hp..speed 直接可并入 calcAttrs 的 extra；
 *          dmg/mit 是「面板百分数」（FaithVO.getPropMsg 显示的 raw/100 再 ×100，即 raw）。
 */
function faithBonusOf(servant, bagGoods, teamId) {
  const zero = { hp: 0, phy_atk: 0, mag_atk: 0, phy_def: 0, mag_def: 0, speed: 0, dmg: 0, mit: 0, faithNum: 0, propMap: {}, lines: {} };
  if (!servant) return zero;
  const slots = faithSlotsOf(servant, teamId);

  // 先取实例（装备态里引用的 gid 必须仍在背包，否则跳过）
  const board = {};
  const sl = Number(servant.level) || 1;
  const propMap = {}; // 属性码 → 累加值（未乘链接）
  for (const posStr of Object.keys(slots)) {
    const gid = Number(slots[posStr]);
    if (!gid) continue;
    const g = (bagGoods || []).find(x => Number(x.id) === gid);
    if (!g) continue;
    const info = infoOfType(g.type_id);
    if (!info) continue;
    const sideColor = Array.isArray(g.sideColor) && g.sideColor.length === 4
      ? g.sideColor.slice(0, 4)
      : [0, 0, 0, 0];
    board[Number(posStr)] = { level: Number(g.level) || 1, type_id: g.type_id, sideColor };
    propMap[info.prop] = (propMap[info.prop] || 0) + propValueOf(g, g.type_id, sl);
  }

  // 链接乘区（只作用于 1..6 号属性，26/27 不在 FAITH_LINE_TO_ATTR 内 → 不乘）
  const lines = countLines(board);
  const propFinal = Object.assign({}, propMap);
  for (const c of Object.keys(lines)) {
    const attr = FAITH_LINE_TO_ATTR[c];
    if (lines[c] > 0 && propFinal[attr] != null) {
      propFinal[attr] = Math.ceil(propFinal[attr] * lineMul(lines[c]));
    }
  }

  const out = Object.assign({}, zero, { propMap: propFinal, lines, faithNum: Object.keys(board).length });
  for (const [codeStr, val] of Object.entries(propFinal)) {
    const code = Number(codeStr);
    if (PROP_KEYS[code]) out[PROP_KEYS[code]] += val;
    // 26/27 的单位：lvInfo.prop[26/27] = 20×lv（15 级 = 300）。客户端面板
    // FaithVO.getPropMsg 显示的是 `getProp()/100` 的百分数（300/100 = +3%）。
    // 这里统一存「面板百分数」（raw），换算成战斗倍率只在一处做（faithFightModsOf）。
    else if (code === PROP_DMG) out.dmg += val;
    else if (code === PROP_MIT) out.mit += val;
  }
  return out;
}

// ---- 战斗/属性接入辅助 ----
// 只返回可直接并入 FC.calcAttrs 的 extra 的六维（hp/phy_atk/...），与 relic_data.equipBonusOf 同形状，
// 便于两者逐项相加。增伤/减伤（26/27）不在此列，由 faithFightModsOf 单独返回。
function faithAttrBonusOf(servant, bagGoods, teamId) {
  const b = faithBonusOf(servant, bagGoods, teamId);
  return { hp: b.hp, phy_atk: b.phy_atk, mag_atk: b.mag_atk, phy_def: b.phy_def, mag_def: b.mag_def, speed: b.speed };
}
// 战斗内增伤/减伤（FaithVO 口径：26 增伤 → 我方伤害倍率、27 减伤 → 受击减免），
// 返回小数（0.03 = +3%），供 fight 单位 dmgMul/selfMit 使用；无信仰链接乘区（26/27 不参与链接）。
//
// ⚠️ 2026-10-23 修正量纲：raw = 20×lv（15 级 300），客户端面板显示 raw/100 = **+3%**。
//    旧实现 `/100` 得到 3.0（+300%）——**整整强 100 倍**，9 件金专注为 +2700%。
//    减伤那边被 fight_core 的 Math.min(0.9, …) 钳住，所以只有"增伤飞天"这一半会暴露。
//    正确换算：raw/100 = 百分数，再 /100 = 小数倍率 ⇒ raw/10000。
const FAITH_PCT_TO_RATIO = 10000;
function faithFightModsOf(servant, bagGoods, teamId) {
  const b = faithBonusOf(servant, bagGoods, teamId);
  return {
    dmg: (b.dmg || 0) / FAITH_PCT_TO_RATIO,
    mit: (b.mit || 0) / FAITH_PCT_TO_RATIO,
    faithNum: b.faithNum,
  };
}

// 装备某件信仰所需的 pos 是否与信仰属性匹配（FAITH_POS_ATTR；0=中心无限制）
function posAllowsProp(pos, prop) {
  const limit = FAITH_POS_ATTR[Number(pos) - 1];
  if (limit === undefined) return false;
  return limit === 0 || limit === Number(prop);
}

// 信仰名称（desc 实证：24300001 生命信仰 / 24300002 狂野信仰 …）
const PROP_NAME = { 1: '生命', 2: '狂野', 3: '智慧', 4: '强固', 5: '精神', 6: '疾风', 26: '专注', 27: '坚韧' };
const faithNameOf = typeId => {
  const info = infoOfType(typeId);
  if (!info) return '信仰';
  return `${PROP_NAME[info.prop] || info.prop}信仰·${info.colorName}`;
};

module.exports = {
  SERVANT_MAX_LEVEL, COLOR_INFO, LV_INFO, LINE_INFO,
  FAITH_LINK, FAITH_LINK_AROUND, FAITH_POS_ATTR, FAITH_LINE_TO_ATTR,
  PROP_KEYS, PROP_DMG, PROP_MIT, PROP_NAME,
  SUMMON_COST, ITEM_SUMMON_CARD, ITEM_SUMMON_CLIP, SCORE_FAITH_EXP, SCORE_FAITH_STONE, MAX_PLAN,
  UNIVERSAL_REFRESH_ITEM,
  NEW_FORMATION_MIN, faithSlotsOf, FAITH_PCT_TO_RATIO,
  isFaithType, faithTypeId, infoOfType, faithNameOf, rollSideColors,
  propValueOf, needExpOf, maxLvOf, decomposeExpOf,
  linkDir, countLines, lineMul, faithBonusOf, faithAttrBonusOf, faithFightModsOf, posAllowsProp,
};
