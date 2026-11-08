// 祭坛（ServantAltar）：主页-协会-Banner06 入口，通关 3-4（1030400）后功能 26 解锁。
//
// 客户端机制（tools/bc_cmp/altar_new/ 反编译实证）：
//  - 主面板 onOpen **不发任何请求**——数据全靠登录推送（先 m_servant_type_fame_list_toc 建
//    fameDic，再 m_altar_info_toc；info 的供奉位 updateServant 要查 fameDic，顺序不能反）；
//  - m_altar_info_toc.camp_list（array p_altar_camp{camp, slot_list:p_kvi{id=slotID,val=誓灵type}}）：
//    **阵营出现在 camp_list 里 = 已解锁**（EntryVO.updateByProto 无参直接置 UNLOCKED）；
//    slot_list 只放已解锁供奉位（不在列表 = 仍锁定）；
//  - m_altar_unlock_camp_toc.camp 声明是 array p_altar_camp，**实际客户端按单对象消费**
//    （字节码实证：`local t={msg.camp} for _,v in pairs(t) do v.camp ... end` 后再
//    updateAltarDetailVODic(t)）——发单对象（etf.js !Array.isArray → encodeNested 分支）；
//  - 名气（fame）：官方为服务端累积计数不可考，本地服按誓灵培养面快照推导（altar_data.fameOfServant）；
//    客户端口径：阵营基础名气 = Σ ceil(名气×0.2)（含未解锁阵营）；供奉位 = 本阵营全额 /
//    跨阵营 ×0.6；阵营总名气 = 基础 + 供奉位；"全阵营总名气" = Σ 全部阵营总名气；
//  - buff：客户端按名气等级本地激活（gradeFame 前 N 档 × buffDic.val 累加），服务端零推送；
//    战斗侧 proIDToBuffIDDic：属性码 2-6 → buff1-5（×(100+val)/100），26/27 → 伤害/减伤；
//  - 主供奉位（slotID=1）选人只允许本阵营 100 级 5 星誓灵（servantFameRankListMain）；
//  - 换供/转移全部走 out_tos + in_tos 序列（客户端总是先 out 再 in），in 时已在别处供奉 → 拒绝；
//  - p_kvt.type 必须是名气最高实例的 servant id（客户端 ServantMgr.getServant 反查 VO）。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log, pushAssetChange } = L;
const A = require('../data/altar_data');

// ---------- altarState ----------
function st() {
  if (!S.altarState) {
    S.altarState = {
      unlockedCamps: [],      // 已解锁阵营（camp id）
      unlockedSlots: {},      // 额外解锁的供奉位 {camp: [slotID]}（配置 cost [0,0] 的不算）
      enshrined: {},          // 供奉 {typeId: {camp, slot}}——每类型全局只能供奉一处
      fameSynced: {},         // 已推送名气快照 {typeId: fame}（diff 推 update 用）
    };
  }
  if (!Array.isArray(S.altarState.unlockedCamps)) S.altarState.unlockedCamps = [];
  if (!S.altarState.unlockedSlots) S.altarState.unlockedSlots = {};
  if (!S.altarState.enshrined) S.altarState.enshrined = {};
  if (!S.altarState.fameSynced) S.altarState.fameSynced = {};
  return S.altarState;
}

// 白名单：只有客户端 CfgServant 里真实存在的 type 才能进名气表。
// 客户端 ServantMgr.addServant 对「类型计数表」无条件 +1，却只在 getServantConfigVO ~= nil 时
// 建 VO（bc asm 实证）。一旦某 type 在配置里不存在，计数表与实例列表就会永久错位，
// 之后任何 m_servant_type_fame_update_toc → ServantAltarDetailVO.updateRankList 都会
// 对计数>0 的类型取 getTopLevelServant(type).level → 索引 nil → 崩溃（真机 2026-09-23）。
// 服务端因此在两个出口都做过滤：fame 表本身 + 更新包。
const { isValidServantType } = require('../data/servant_types');

// ---------- 名气与阵营总量 ----------
const fameLsRaw = () => A.fameList(S.servants);
const fameLs = () => fameLsRaw().filter(f => isValidServantType(f.id));
const fameByType = () => Object.fromEntries(fameLs().map(f => [f.id, f.val]));

// 祭坛名气表用的名气列表：**只保留客户端已宣告实例的类型**。
//
// p_kvt.type 是"该类型名气最高实例的 servant id"，客户端 updateServantSelectVODicByType
// 拿它 ServantMgr.getServant(type) 反查 VO 建 ServantAltarSelectItemVO；实例没宣告过就
// 得到 configVO=nil，随后 m_altar_info_toc → DetailVO.updateRankList → 排序
// getFame() 索引 nil → 崩（ServantAltarSelectItemVO: attempt to index field 'configVO'）。
//
// briefedIds(conn) 现在覆盖全量/精简两种 brief 路径（2026-10-16 一百八十四）：集合 =
// 登录 brief 真正下发的实例 + 会话中途带 conn 宣告的实例；静默入档（token 发卡 conn=null）
// 的实例不在其中 → 其类型整体从 fame 表消失，客户端看不到就绝不推。重登 brief 全量
// 宣告后自然恢复。安卓精简包路径行为不变。
function fameLsFor(conn) {
  const briefed = require('./servant').briefedIds(conn);
  if (!briefed) return fameLs();
  return fameLs().filter(f => briefed.has(Number(f.type)));
}

// 供奉位已解锁判定：配置 cost [0,0] 或显式解锁过
function slotUnlocked(camp, slotID) {
  const d = A.DETAIL_BY_CAMP[camp];
  const cfg = d && d.slots.find(s => s.slot === slotID);
  if (!cfg) return false;
  if (cfg.unlockCost[0] === 0 && cfg.unlockCost[1] === 0) return true;
  return (st().unlockedSlots[camp] || []).includes(slotID);
}

function campSlotList(camp) {
  const d = A.DETAIL_BY_CAMP[camp];
  const out = [];
  for (const s of d.slots) {
    if (!slotUnlocked(camp, s.slot)) continue;
    const at = Object.entries(st().enshrined).find(([, v]) => v.camp === camp && v.slot === s.slot);
    out.push({ id: s.slot, val: at ? Number(at[0]) : 0 });
  }
  return out;
}

const campTotalsNow = () => A.campTotals(fameLs(), st().enshrined, st().unlockedCamps);

// 全阵营总名气（EntryVO 解锁条件口径）
function totalFameAllNow() { return A.totalFameAll(campTotalsNow()); }

// ---------- 推送 ----------
// 待宣告实例：已入服务端 roster/落盘，但 m_servant_update_toc 尚未发给客户端（战斗掉落、
// 幻梦掉落都延迟 3s 播获取动画）。这段窗口里任何 fame diff 若带上该实例，客户端
// ServantMgr.getServant(sid) 查不到 → ServantAltarSelectItemVO.configVO=nil →
// 名气榜排序 getFame 索引 nil 崩（2026-09-10 真机 m_servant_type_fame_update_toc 报错根因）。
const pendingAnnounce = new Set();
function markPendingAnnounce(ids) {
  for (const id of ids || []) pendingAnnounce.add(Number(id));
}
function clearPendingAnnounce(ids) {
  for (const id of ids || []) pendingAnnounce.delete(Number(id));
}

function pushFameList(conn) {
  pendingAnnounce.clear(); // 全量 fame 列表到达前客户端已收到全量誓灵，不再有"未宣告"实例
  const list = fameLsFor(conn);
  conn.sendToc('m_servant_type_fame_list_toc', { list });
  st().fameSynced = Object.fromEntries(list.map(f => [f.id, f.val]));
}

// 名气变化 diff 推送（训练/突破/战斗经验/掉落/能源/技能后调用；无变化不发）
function pushFameUpdates(conn) {
  const s = st();
  const cur = fameLsFor(conn);
  const curMap = Object.fromEntries(cur.map(f => [f.id, f.val]));
  const update = [];
  const nextSynced = {}; // 本次推送后客户端的名气基线
  for (const f of cur) {
    if (pendingAnnounce.has(Number(f.type))) {
      // 实例尚未告知客户端：本轮跳过并保留该类型旧基线，宣告后 diff 自然补上新值
      if (s.fameSynced[f.id] !== undefined) nextSynced[f.id] = s.fameSynced[f.id];
      continue;
    }
    if (s.fameSynced[f.id] !== f.val) update.push(f);
    nextSynced[f.id] = f.val;
  }
  // 已消失的类型（能源转换吃掉的誓灵）：推 val=0 让客户端移除选人 VO
  for (const t of Object.keys(s.fameSynced)) {
    if (curMap[t] === undefined) update.push({ id: Number(t), val: 0, type: 0 });
  }
  if (!update.length) return false;
  // 出口兜底（两层）：
  // ① 只推客户端能查到的 type，且 type 字段（实例 id）必须真实存在（服务端 roster 视野）；
  // ② val≠0 条目的实例 id 还必须在 briefedIds（客户端视野）里——服务端有但从未向该连接
  //    宣告过的实例（token 发卡 collab.grantServant(null) 等）推出去会建 configVO=nil 的
  //    选人 VO，之后任何排序/移除都会对 nil 索引崩（ServantAltarMgr:302，2026-10-16 设备
  //    ec2421 真机 D7 第四变体）。val=0 的移除条目（type:0）不受此约束：它清理的是客户端
  //    旧有基线里的 VO，不引用实例；客户端没见过该类型时 handler 走空分支，无害。
  const briefed = require('./servant').briefedIds(conn);
  const safe = update.filter(f => isValidServantType(f.id)
    && (Number(f.val) === 0 || S.servants.some(b => Number(b.id) === Number(f.type)))
    && (Number(f.val) === 0 || !briefed || briefed.has(Number(f.type))));
  if (safe.length !== update.length) {
    log(`[altar] 名气推送过滤脏数据 ${update.length - safe.length} 条（非法 type/未知实例/未宣告实例）：`
      + JSON.stringify(update.filter(f => !safe.includes(f))));
  }
  if (!safe.length) return false;
  conn.sendToc('m_servant_type_fame_update_toc', { update: safe });
  s.fameSynced = nextSynced;
  return true;
}

function campPayload(camp) {
  return { camp, slot_list: campSlotList(camp) };
}

function pushAltarInfo(conn) {
  conn.sendToc('m_altar_info_toc', { camp_list: st().unlockedCamps.map(campPayload) });
}

// ---------- 协议 ----------
const handlers = {
  // 解锁阵营祭坛：条件 = 可见(state=1) + 全阵营总名气 + 金币；camp13 高天原 [0,0] 免费
  m_altar_unlock_camp_tos(conn, obj) {
    const camp = Number((obj && obj.camp) || 0);
    const e = A.ENTRY_BY_CAMP[camp];
    const s = st();
    const reject = why => {
      log(`[altar] 解锁阵营被拒 camp=${camp} ${why}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    };
    if (!e || e.state !== 1) return reject('不存在或未开放');
    if (s.unlockedCamps.includes(camp)) return reject('已解锁');
    const [needFame, needSilver] = e.unlockCost;
    if (totalFameAllNow() < needFame) return reject(`名气不足 ${totalFameAllNow()}/${needFame}`);
    if ((S.roleAsset.silver || 0) < needSilver) return reject(`金币不足 ${S.roleAsset.silver || 0}/${needSilver}`);
    S.roleAsset.silver = Math.max(0, (S.roleAsset.silver || 0) - needSilver);
    s.unlockedCamps.push(camp);
    saveState(); bustBuffCache();
    pushAssetChange(conn);
    // camp 字段声明 array 实际按单对象消费——发单个 p_altar_camp
    conn.sendToc('m_altar_unlock_camp_toc', { camp: campPayload(camp) });
    log(`[altar] 解锁阵营 camp=${camp} 名气${totalFameAllNow()}/${needFame} 金币-${needSilver}`);
  },

  // 解锁供奉位：条件 = 阵营已解锁 + 位未解锁 + 阵营总名气 + 金币
  m_altar_unlock_slot_tos(conn, obj) {
    const camp = Number((obj && obj.camp) || 0);
    const slot = Number((obj && obj.slot) || 0);
    const d = A.DETAIL_BY_CAMP[camp];
    const cfg = d && d.slots.find(x => x.slot === slot);
    const s = st();
    const reject = why => {
      log(`[altar] 解锁供奉位被拒 camp=${camp} slot=${slot} ${why}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    };
    if (!cfg) return reject('供奉位不存在');
    if (!s.unlockedCamps.includes(camp)) return reject('阵营未解锁');
    if (slotUnlocked(camp, slot)) return reject('已解锁');
    if (cfg.unlockCost[0] < 0) return reject('不可解锁（配置无费用）');
    const totals = campTotalsNow();
    const [needFame, needSilver] = cfg.unlockCost;
    if ((totals[camp] || 0) < needFame) return reject(`阵营名气不足 ${totals[camp] || 0}/${needFame}`);
    if ((S.roleAsset.silver || 0) < needSilver) return reject(`金币不足 ${S.roleAsset.silver || 0}/${needSilver}`);
    S.roleAsset.silver = Math.max(0, (S.roleAsset.silver || 0) - needSilver);
    (s.unlockedSlots[camp] = s.unlockedSlots[camp] || []).push(slot);
    saveState(); bustBuffCache();
    pushAssetChange(conn);
    conn.sendToc('m_altar_unlock_slot_toc', { camp, slot });
    log(`[altar] 解锁供奉位 camp=${camp} slot=${slot} 阵营名气${totals[camp]}/${needFame} 金币-${needSilver}`);
  },

  // 供奉：空位放置；已在别处供奉拒绝（客户端换供/转移都先发 out）
  m_altar_servant_in_tos(conn, obj) {
    const camp = Number((obj && obj.camp) || 0);
    const slot = Number((obj && obj.slot) || 0);
    const type = Number((obj && obj.servant_type) || 0);
    const s = st();
    const reject = why => {
      log(`[altar] 供奉被拒 camp=${camp} slot=${slot} type=${type} ${why}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    };
    const b = S.servants.find(x => x.type === type);
    if (!b) return reject('未持有该誓灵');
    if (!s.unlockedCamps.includes(camp)) return reject('阵营未解锁');
    if (!slotUnlocked(camp, slot)) return reject('供奉位未解锁');
    if (s.enshrined[type]) return reject('已在别处供奉（先撤下）');
    if (Object.values(s.enshrined).some(v => v.camp === camp && v.slot === slot)) return reject('位置已有誓灵');
    // 主供奉位（slot 1）：与选人面板同口径——本阵营 100 级 5 星
    if (slot === 1) {
      if (A.campOf(type) !== camp) return reject('主供奉位仅限本阵营誓灵');
      if ((Number(b.level) || 1) < 100 || (Number(b.star) || 0) !== 5) return reject('主供奉位需 100 级 5 星誓灵');
    }
    s.enshrined[type] = { camp, slot };
    saveState(); bustBuffCache();
    conn.sendToc('m_altar_servant_in_toc', { camp, slot, servant_type: type });
    log(`[altar] 供奉 camp=${camp} slot=${slot} type=${type}`);
  },

  // 撤下供奉
  m_altar_servant_out_tos(conn, obj) {
    const camp = Number((obj && obj.camp) || 0);
    const type = Number((obj && obj.servant_type) || 0);
    const s = st();
    const at = s.enshrined[type];
    if (!at || at.camp !== camp) {
      log(`[altar] 撤下被拒 camp=${camp} type=${type} 未在此供奉`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    delete s.enshrined[type];
    saveState(); bustBuffCache();
    conn.sendToc('m_altar_servant_out_toc', { camp, slot: at.slot, servant_type: type });
    log(`[altar] 撤下供奉 camp=${camp} slot=${at.slot} type=${type}`);
  },
};

// ---------- 战斗侧 ----------
// 祭坛 buff 总量（我方专用）。带 1s 缓存：单场战斗多次取值一致，且避免每单位重算全表；
// 四个写协议（解锁/供奉）会置 _buffAt=0 立即失效
let _buffCache = null, _buffAt = 0;
function allyBuffs() {
  const t = Date.now();
  if (_buffCache && t - _buffAt < 1000) return _buffCache;
  _buffCache = A.buffTotals(fameLs(), st().enshrined, st().unlockedCamps);
  _buffAt = t;
  return _buffCache;
}
const bustBuffCache = () => { _buffAt = 0; };

// 登录同步：fameDic 先建、camp_list 后到（顺序不能反，见文件头）
// 同时审计存档里已有的非法 type——它们是历史脏数据，过滤只保证"不再恶化"，
// 真要清干净得靠导出日志里的 id 手动处理（或 GM 删誓灵）
function onLogin(conn) {
  const bad = (S.servants || []).filter(b => !isValidServantType(b.type));
  if (bad.length) {
    log(`[altar] ⚠ 存档含 ${bad.length} 只非法誓灵（客户端 CfgServant 无此 typeId），已排除出名气表：`
      + bad.map(b => `id=${b.id} type=${b.type}`).join(' '));
  }
  pushFameList(conn);
  pushAltarInfo(conn);
  const s = st();
  log(`[altar] 登录同步：全阵营总名气 ${totalFameAllNow()} 已解锁阵营 [${s.unlockedCamps.join(',') || '无'}] 供奉 ${Object.keys(s.enshrined).length} 处`);
}

module.exports = {
  handlers, onLogin, st, fameLs, fameByType, campTotalsNow, totalFameAllNow,
  slotUnlocked, pushFameUpdates, pushFameList, pushAltarInfo, allyBuffs,
  markPendingAnnounce, clearPendingAnnounce,
};
