// 召唤（Summon/卡池）规则：客户端硬口径与本地服设计值分区。
// 客户端事实全部来自 tools/bc_cmp/summon_new/ 反编译（SummonModule/SummonMgr/SummonPanel/
// SummonTipPanel/SummonVO/OutCard* 反编译实证），数据镜像在 summon_data.js（生成，勿手改）。
'use strict';
const { POOLS, POOL_CONTENTS, SUMMON_DEFAULT_ITEM } = require('./summon_data');

// ───────────────────────── 客户端硬口径（反编译实证，不可自造） ─────────────────────────

// 召唤次数只有 1 / 10 两档（SummonPanel 只有两个按钮）；新手池只能十连（错误码 455010"新手卡池只能十连抽"）
const SUMMON_TIMES_ONE = 1;
const SUMMON_TIMES_TEN = 10;

// 约定之契（凭神/限定/新手池通用召唤券，CfgSummon.summons[*].cost type=3 id=31000004）
const TICKET_ITEM = SUMMON_DEFAULT_ITEM;

// 新手卡池（typeId=4）规则（SummonPanel.updateSumonTimes 面板原文）：
//   1.每次十连召唤必定获得一名UR誓灵；2.最多可进行2次十连召唤（剩余N次）后续将关闭卡池；
//   3.首次十连召唤仅需5张约定之契；4.卡池中维达、赫斯提亚、须佐、德墨忒尔、海拉出现机率提高。
// 总次数 = CfgSummon.summons[4].maxSummon = 20；抽满 20 次客户端本地把卡池从列表移除
//（SummonMgr.setTimes → clearSummonVO），服务端再补 close_time（+72h 展示，见 close 协议）。
const NEWBIE_POOL_ID = 4;
const NEWBIE_TOTAL_LIMIT = 20;          // = maxSummon（也是每日上限口径，客户端 getMaxSummonTimes-day_times）
const NEWBIE_FIRST_TEN_COST = 5;        // 首次十连 5 张（getTimes<10 时 getTenCostVo ×5）
const NEWBIE_TEN_GUARANTEE_UR = true;   // 每轮十连必出 ≥1 UR

// 概率详情页（m_role_summon_pool_toc）的 val 口径：rateTip = val/1000 → "N%"。
// 客户端按 typeId 第 3 位（= 右起第 5 位 color）把服务器列表分进 UR/SR/R/N 四个桶。
// 友情池(2)不请求 pool_toc（SummonTipPanel typeId~=2 才发）。

// 卡池关闭协议：m_role_summon_close_toc.close_time + 259200 = 展示用的关闭倒计时（客户端 +72h）
const CLOSE_DISPLAY_DELAY = 259200;

// 灵契召唤（typeId=12，SUMMON_TYPE_AFFINITY）：不在普通卡池列表里下发（客户端 initSummonList
// 显式跳过 id=12），走 select_list{act_id:12} 挂进列表 + 独立 SummonAffinityView；
// 材料是 role_scores（affinityMats：31000018→score 15、31000020→score 17）。
const AFFINITY_POOL_ID = 12;

// 官方错误码（CfgErrorCode 按 toc protoId 编号）
const ERR = {
  COND: 455001,            // 条件不足
  NO_CFG: 455002,          // 找不到配置
  FRIEND_NOT_ENOUGH: 455003, // 友情点数不足
  MEDAL_NOT_ENOUGH: 455004,  // 勋章不足
  GUIDE_ONCE: 455005,      // 新手引导只能抽一次
  ACT_POOL_CLOSED: 455006, // 活动卡池未开放
  TOO_FAST: 455007,        // 抽卡太频繁
  SELECT_TYPE: 455008,     // 活动选择的卡池类型错误
  DAY_LIMIT: 455009,       // 当天达到最大次数
  NEWBIE_TEN_ONLY: 455010, // 新手卡池只能十连抽
  GOLD_SHORT: 1059003,     // 水晶不足（自动补购约定之契时）
};
const ERR_AFFINITY = { MATERIAL: 698001, NO_CFG: 698002 };

// ───────────────────────── 本地服设计值（官方数据不可考，集中在这里调） ─────────────────────────

// 卡池美术资源可用性（2026-09-03 adb 实测设备 /sdcard/Android/data/com.bilibili.fzzl.guopan/files/res
// + APK assets 双向核对，快照 tools/bc_cmp/device_summon_lang.txt）：
//   主界面立绘 = UI/Summon/Textures_Lang/<bg>.ab、列表横幅 = Textures_Lang/<bg>Item.ab
//   （LoaderUtil.GetABName 小写+.ab；GetLocalFullPath 先查 PackOut 设备下载目录、再查 PackIn APK）。
//   停服版资源快照清掉了 15 个过期活动池的美术（APK 只有 01/02，设备 res 覆盖其余），
//   缺资源的池会"白横幅/黑主界面"（41/42/43 只缺横幅、其余连主界面立绘都没有）→ 不开放。
//   【2026-11-04 韩服资源回填】H:\1103megafiles（KR 快照，resInfo.json 官方清单佐证）补回 10 个池的
//   主图+横幅全套（39/46/57/61/62/66/68/71/83/84，已逐池视觉验证 KR 池 id = CN 同一活动、
//   UP 誓灵与 CN 卡面同款；文件烤死韩文活动名/UP 名牌/历史档期，属既定反和谐口径），
//   已复制进 res 源目录并重出数据包；开放池 80 → 90。41/42/43 横幅、78/79 整池 KR 也没有，维持关闭。
//   ⚠️ device_summon_lang.txt 已重建为"res 源目录 ∪ APK 基座"部署真相（200 文件），不再是纯设备快照。
const ART_MISSING_POOLS = [41, 42, 43, 78, 79];

// 结构性关闭：12 灵契召唤 —— 走 select_list{act_id:12} 挂载 + 独立 SummonAffinityView；
// 1159/1301/1645 "自选复刻" —— 配置无 cost（官方按活动 select 池驱动）。
const CLOSED_POOL_IDS = [12, 1159, 1301, 1645, ...ART_MISSING_POOLS];
const OPEN_POOL_IDS = POOLS.map(p => p.id).filter(id => !CLOSED_POOL_IDS.includes(id));

// 每日免费十连（凭神召唤）：daily_free_times>0 时客户端显示"十连召唤(免费)"按钮直发 summon_times=10。
const DAILY_FREE_TEN = { 1: 1 };

// 友情池材料桶（tip 文案：R 8% / 蓝色材料 10% / N 40% / 绿色材料 42%）：
// 每抽先按 48%/52% 分流誓灵/材料，材料再按 蓝:绿 = 10:42 抽暗淡/明亮结晶（随机属性）。
// 结晶 id 规则（CfgItems）：20010<N><0 暗1 明2>，N=0水 1火 2风 3土 4光 5暗 6自然。
const FRIEND_MATS_RATE = 52000;          // ×1000 口径，与 val 同单位
const FRIEND_MAT_BLUE = { rate: 10000, ids: [20010001, 20011001, 20012001, 20013001, 20014001, 20015001, 20016001] };
const FRIEND_MAT_GREEN = { rate: 42000, ids: [20010000, 20011000, 20012000, 20013000, 20014000, 20015000, 20016000] };

// 保底（CfgSummon.minServantNum，官方口径见活动 wiki："连续 150 次召唤未获得对应 UR 时，
// 将在第 150 次召唤后自动获得 1 只"）：计数 = 连续未获得 UP 的抽数；自然获得 UP 或保底发放
// 都会清零重计（"获得"即链条中断），已拥有不妨碍攒下一次保底。protect_times 原样下发给面板 "x/150"。
// 旧口径（"已拥有停表"，计数冻结在 150）的存档计数由 pityVersion 迁移作废，见 handlers/summon.js st()。
const PITY_AT = 150;
const PITY_POOLS = POOLS.filter(p => p.special.length && p.id !== NEWBIE_POOL_ID)
  .map(p => ({ poolId: p.id, at: PITY_AT, servantType: p.special[0] }));

// 概率详情内容版本（m_role_summon_pool_toc.last_modified；内容变了手动 +1）
const CONTENT_VERSION = 2; // 2026-11-04 韩服美术回填重开 10 池（39/46/57/61/62/66/68/71/83/84），+1

// ───────────────────────── 纯函数 ─────────────────────────

// 按权重表抽 1 个 typeId（weighted: Map/obj {typeId: val}）
function pickWeighted(weighted, rng) {
  const entries = weighted instanceof Map ? [...weighted.entries()] : Object.entries(weighted);
  let total = 0;
  for (const [, w] of entries) total += w;
  let roll = (rng || Math.random)() * total;
  for (const [t, w] of entries) {
    roll -= w;
    if (roll < 0) return Number(t);
  }
  return Number(entries[entries.length - 1][0]);
}

// 池内容 → {typeId: val}（POOL_CONTENTS 是 [{id: 30000000+type, val}]）
function poolWeights(poolId) {
  const list = POOL_CONTENTS[poolId];
  if (!list) return null;
  const w = {};
  for (const e of list) w[e.id - 30000000] = e.val;
  return w;
}

// 抽一次：返回 [{kind:'servant'|'mat', type}]（友情池可能出材料，其余池恒誓灵）
function rollOne(poolId, rng) {
  if (poolId === 2) {
    const r = (rng || Math.random)() * 100000;
    if (r < FRIEND_MATS_RATE) {
      const blue = (rng || Math.random)() * (FRIEND_MAT_BLUE.rate + FRIEND_MAT_GREEN.rate) < FRIEND_MAT_BLUE.rate;
      const bucket = blue ? FRIEND_MAT_BLUE : FRIEND_MAT_GREEN;
      return [{ kind: 'mat', type: bucket.ids[Math.floor((rng || Math.random)() * bucket.ids.length)] }];
    }
    return [{ kind: 'servant', type: pickWeighted(poolWeights(poolId), rng) }];
  }
  return [{ kind: 'servant', type: pickWeighted(poolWeights(poolId), rng) }];
}

// 抽 times 次（1 或 10）。opts.isNewbieTen：新手池十连保底 ≥1 UR（直接重掷一个 N/R 结果替换）。
function rollPool(poolId, times, rng) {
  const out = [];
  for (let i = 0; i < times; i++) out.push(...rollOne(poolId, rng));
  if (poolId === NEWBIE_POOL_ID && times === SUMMON_TIMES_TEN && NEWBIE_TEN_GUARANTEE_UR) {
    const hasUR = out.some(x => x.kind === 'servant' && Math.floor(x.type / 10000) % 10 === 4);
    if (!hasUR) {
      const w = poolWeights(poolId);
      const urs = Object.keys(w).map(Number).filter(t => Math.floor(t / 10000) % 10 === 4);
      const idx = out.findIndex(x => x.kind === 'servant' && Math.floor(x.type / 10000) % 10 <= 2);
      if (urs.length && idx >= 0) out[idx] = { kind: 'servant', type: pickWeightedLimited(w, rng, urs) };
    }
  }
  return out;
}

function pickWeightedLimited(weighted, rng, allowed) {
  const sub = {};
  for (const t of allowed) sub[t] = weighted[t];
  return pickWeighted(sub, rng);
}

// 花费计划：消耗召唤券 need 张，缺口按 buyPrice 水晶/张自动补购（SummonAlertPanel 同口径：
// "约定之契不足，将花费 水晶×missing"，isAutoBuy 池才有补购）。新手池首次十连 5 张
//（getTenCostVo：getTimes<10 时 ×5，之后 ×10）；perPull = cost.num（恒 1）。
function ticketPlan(poolId, times, ticketHave, totalPulls, perPull) {
  const unit = perPull || 1;
  let need = times * unit;
  if (poolId === NEWBIE_POOL_ID && times === SUMMON_TIMES_TEN && totalPulls < 10) need = NEWBIE_FIRST_TEN_COST * unit;
  const useTickets = Math.min(ticketHave, need);
  return { need, useTickets, buyCount: need - useTickets };
}

// 保底判定（"连续 150 次未获得 UP"口径，逐抽结算）：
//   本抽自然出 UP → 链条中断清零（该抽已"获得"，保底不触发，绝不双发）；
//   数满 150 抽仍未获得 → 当抽发 UP 并清零（保底获得同样是"获得"，链条重新起算）。
// servantTypes = 本轮结果的誓灵 type 序列（按抽出顺序）；一轮内保底至多触发一次（150 > 单轮上限 10）。
function pityStep(poolId, servantTypes, prevPity) {
  const cfg = PITY_POOLS.find(p => p.poolId === poolId);
  if (!cfg) return { pity: prevPity, grant: 0 };
  let pity = prevPity;
  let grant = 0;
  for (const t of servantTypes) {
    pity += 1;
    if (t === cfg.servantType) { pity = 0; continue; }
    if (pity >= cfg.at) { grant = cfg.servantType; pity = 0; }
  }
  return { pity, grant };
}

// 该池是否开放（关闭后 72h 展示期内仍可见）
function isPoolOpen(poolId, closedMap, nowSec) {
  if (!OPEN_POOL_IDS.includes(poolId)) return false;
  const closedAt = closedMap[poolId];
  if (!closedAt) return true;
  return nowSec < closedAt + CLOSE_DISPLAY_DELAY;
}

module.exports = {
  ERR, ERR_AFFINITY, TICKET_ITEM, SUMMON_TIMES_ONE, SUMMON_TIMES_TEN,
  NEWBIE_POOL_ID, NEWBIE_TOTAL_LIMIT, NEWBIE_FIRST_TEN_COST,
  AFFINITY_POOL_ID, CLOSE_DISPLAY_DELAY, OPEN_POOL_IDS, CLOSED_POOL_IDS, ART_MISSING_POOLS,
  DAILY_FREE_TEN,
  FRIEND_MATS_RATE, FRIEND_MAT_BLUE, FRIEND_MAT_GREEN, PITY_AT, PITY_POOLS, CONTENT_VERSION,
  pickWeighted, pickWeightedLimited, poolWeights, rollOne, rollPool, ticketPlan, pityStep, isPoolOpen,
};
