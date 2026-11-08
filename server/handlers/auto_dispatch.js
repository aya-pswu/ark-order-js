// 协会派遣 · **自律派遣**（tab6 / `m_copy_auto_*` 8 条）
//
// 客户端契约见 `调研-自律派遣.md`；本文件只做协议与状态机，战斗在 `auto_fight.js`（纯逻辑）。
//
// 关键不变量（踩过就炸，别改）：
//  ① 101（CfgDorm.dispatchs[101]）必须出现在 `m_building_crusade_detail_toc.crusade_list` 里，
//     否则客户端 `DormMgr.getDispatchVO(101)` 为 nil → 本文件的 info_toc 灌不进卡片，
//     表现为「卡片空白 + 剩余可自律队列恒 0」。发 101 与注册这 8 条 handler 必须同批上线。
//  ② `m_copy_auto_reward_toc.finish_times` 必须 ≥ 1：客户端结算面板 `results[#results]` 在
//     mopTimes=0 时取 nil 直接崩（DormDispatchSettlementPanel.onOpen 的 else 分支）。
//  ③ `m_copy_auto_result_page_toc.copy_result` 必须**从 1 打包**：客户端首次填充用
//     `copy_result[i-(from-1)]`（相对下标），只有"已存在再刷新"才用绝对下标。
//  ④ 结算必须分页逐条答（`from=to=i`），且一帧连发也不许有状态假设。
//  ⑤ 所有投递型 toc 之后补推 detail（与普通派遣同一个 S0 理由：客户端计数只在 detail 里对账）。
const { S, saveState } = require('../state');
const {
  log, progressOf, pushGoodsUpdate, pushServantChanges, grantGoods,
  pushRoleExpChange, CHANGE_ID_EXP, CHANGE_ID_LEVEL, TRAIN,
} = require('../lib');
const AD = require('../data/auto_dispatch_data');
const AF = require('./auto_fight');

const now = () => Math.floor(Date.now() / 1000);
const N = AD.AUTO_ID;
const autoState = () => (S.dormState && S.dormState.auto) || null;
const setAuto = v => { if (!S.dormState) S.dormState = {}; S.dormState.auto = v; };

function tips(conn, code) { conn.sendToc('m_common_tips_toc', { code }); }
function pushDetail(conn) {
  try { require('./dorm').handlers.m_building_crusade_detail_tos(conn, { bd_id: 3 }); } catch (e) { log('[auto] 补推 detail 失败：' + e.message); }
}

// 背包里 60000175 的总数（可能分散多格）
function ticketNum() {
  let n = 0;
  for (const g of (S.bagGoods || [])) if (Number(g.type_id) === AD.TICKET_ID) n += Number(g.cur_num) || 0;
  return n;
}
// 扣券（跨格），返回受影响条目用于推送
function spendTicket(num) {
  let left = Math.max(0, Math.floor(Number(num) || 0));
  const updated = [], removed = [];
  if (!left) return { updated, removed };
  for (const g of S.bagGoods) {
    if (left <= 0 || Number(g.type_id) !== AD.TICKET_ID) continue;
    const take = Math.min(left, Number(g.cur_num) || 0);
    if (take <= 0) continue;
    g.cur_num -= take;
    left -= take;
    (g.cur_num <= 0 ? removed : updated).push(g);
  }
  if (left !== 0) log(`[auto] 扣券异常：还差 ${left} 张（已校验够数，不应发生）`);
  S.bagGoods = S.bagGoods.filter(g => Number(g.cur_num || 0) > 0);
  return { updated, removed };
}

// 主线下发过 stars=[1,2,3] 的关（map_fight:81），这里用同一判据：BOSS 点在 cleared 里即三星
function isClearedCopy(barrierId) {
  const cfg = require('../data/map_configs').MAP_CONFIGS[barrierId];
  if (!cfg || !cfg.bossPoint) return false;
  const prog = progressOf(barrierId) || {};
  return (prog.cleared || []).map(Number).includes(Number(cfg.bossPoint));
}

// 一次派遣要打几场 = 客户端算体力用的同一张表
function pointsOf(barrierId) {
  return AF.battlePointsOf(barrierId, AD.enemiesCountOf(barrierId));
}
function paidPerRun(teamIds, barrierId) {
  let max = 0;
  for (const t of teamIds) max = Math.max(max, AF.teamCostOf(t));
  return max * pointsOf(barrierId).length;
}

// info_toc 的投影：进行中 is_end=0；时间到（或已算完）is_end=1
function fightingOf(a) {
  if (!a || a.claimed) return [];
  const t = now();
  const ended = Number(a.finished) || t >= Number(a.end_time);
  const remain = ended ? 0 : Math.max(1, Math.ceil((Number(a.end_time) - t) / AD.TIME_PER_RUN));
  return [{
    crusade_id: N,
    barrier_id: Number(a.barrier_id),
    end_time: Number(a.end_time),
    is_end: ended ? 1 : 0,
    remain_times: remain,
  }];
}

// ---- 结果模拟（分块跑，一次 tick 最多 60 ms；[stall] 阈值 250 ms）----
const JOB = { conn: null, a: null, idx: 0, rows: [], done: false };

function sumItems(list) {
  const m = new Map();
  for (const it of list) {
    const k = Number(it.type);
    if (!k) continue;
    m.set(k, (m.get(k) || 0) + Number(it.num || 0));
  }
  return [...m.entries()].map(([type, num]) => ({ type, num })).filter(x => x.num > 0);
}

// 跑「一次」= 副本内全部战斗点（每场满血新队，队伍按 team_ids 轮换）
function simulateRun(a, runIdx) {
  const barrier = Number(a.barrier_id);
  const points = Array.isArray(a.points) && a.points.length ? a.points : pointsOf(a.barrier_id);
  const teamIds = a.team_ids;
  const paid = paidPerRun(teamIds, barrier);
  const items = [];
  const expMap = new Map();
  let aliveMap = new Map();
  let silver = 0, roleExp = 0, useVit = 0, rounds = 0;
  let win = true;
  let record = null;

  for (let i = 0; i < points.length; i++) {
    const teamId = teamIds[i % teamIds.length];
    const cost = AF.teamCostOf(teamId);
    // 录像一律录（失败的那一场才是官方文案里"最后一次派遣失败"的回放），只保留最后一场
    const r = AF.runBattle({ barrierId: barrier, fightId: points[i], teamId, captureRecord: true });
    if (!r) { win = false; break; }
    useVit += cost;
    rounds += r.rounds;
    const rw = AF.battleRewards(barrier, points[i], r.kills, r.enemyNature);
    silver += rw.silver;
    roleExp += rw.roleExp;
    for (const it of rw.items) if (Number(it.num) > 0) items.push({ type: Number(it.type), num: Number(it.num) });
    for (const e of r.servantExp) expMap.set(e.id, (expMap.get(e.id) || 0) + e.gained);
    aliveMap = new Map(r.servantExp.map(e => [e.id, e.alive]));
    if (r.record) record = r.record;
    if (!r.win) { win = false; break; }
  }

  // 金币 / 御灵士经验也进 items（结算面板逐条展示，发放走 grantItemRewards 单口）
  const V = require('../data/vit_data');
  if (silver > 0) items.push({ type: V.ITEM_SILVER, num: silver });
  if (roleExp > 0) items.push({ type: V.ITEM_ROLE_EXP, num: roleExp });

  // 誓灵经验：p_fight_result_servant_exp{id, skin_id, level, is_alive, exp, exp_type}
  // level 用"这一轮之后"的等级（虚拟推进，不写真档；真档在 finalize 一次性 apply）
  const servantsExp = [];
  for (const [id, gained] of expMap) {
    const b = S.servants.find(s => Number(s.id) === Number(id));
    const virt = Object.assign({}, b || {});
    let lv = Number(b && b.level) || 1;
    if (b) {
      const r = TRAIN.applyServantExp(virt, gained);
      lv = Number(r.level) || lv;
    }
    servantsExp.push({
      id: Number(id),
      skin_id: Number((b && b.skin_id) || 0) || (b ? Number(b.type) * 100 + 1 : 0),
      level: lv,
      is_alive: aliveMap.get(id) === false ? 0 : 1,
      exp: Number(gained) || 0,
      exp_type: 0,
    });
  }

  return {
    nth: runIdx + 1,
    use_vit: useVit,
    return_vit: Math.max(0, paid - useVit),
    items: sumItems(items),
    servants_exp: servantsExp,
    is_win: win ? 1 : 0,
    rounds,
    // 以下内部字段不发给客户端
    ran: points.length && useVit > 0,
    record,
  };
}

function progress(conn, a, left) {
  try { conn.sendToc('m_copy_auto_update_remain_times_toc', { crusade_id: N, times: Math.max(0, left) }); } catch (e) { /* 连接已断 */ }
}

function pump() {
  const job = JOB;
  if (!job.a) return;
  const t0 = Date.now();
  while (!job.done && job.idx < job.a.times && Date.now() - t0 < 60) {
    let row;
    try {
      row = simulateRun(job.a, job.idx);
    } catch (e) {
      log('[auto] 模拟异常终止：' + (e && e.stack || e));
      row = { nth: job.idx + 1, use_vit: 0, return_vit: 0, items: [], servants_exp: [], is_win: 0, rounds: 0, ran: false, record: null };
    }
    job.idx++;
    job.rows.push(row);
    if (job.a.is_fail_stop && !row.is_win) job.done = true;
    if (!job.done) progress(job.conn, job.a, job.a.times - job.idx);
  }
  if (!job.done && job.idx < job.a.times) { setImmediate(pump); return; }
  finalize(job);
}

function finalize(job) {
  const conn = job.conn;
  const a = job.a;
  job.a = null; // 立刻释放，避免重入
  const rows = job.rows;
  // 极端情况：一次都没跑（首场就崩）也要给客户端一条，否则 mopTimes=0 崩面板
  if (!rows.length) rows.push({ nth: 1, use_vit: 0, return_vit: 0, items: [], servants_exp: [], is_win: 0, rounds: 0, ran: false, record: null });

  const finished = rows.length;
  const usedVit = rows.reduce((s, r) => s + (Number(r.use_vit) || 0), 0);
  const paidPer = paidPerRun(a.team_ids, Number(a.barrier_id));
  const useTotal = usedVit;
  const returnTotal = Math.max(0, Number(a.paid_vit) - usedVit);
  const items = sumItems(rows.flatMap(r => r.items || []));
  const lastRow = rows[rows.length - 1];
  const record = lastRow.record || null;
  if (record) {
    record.id = S.nextFightId++;          // 录像 id（m_fight_record_info/msg 用）
    record.fightId = S.nextFightId++;     // 回放用的战斗 id（客户端 CopyMgr.fightID，只要自洽）
    record.copyId = Number(a.barrier_id);  // ⚠️ 必须是真实 barrier_id：客户端靠它加载战斗场景
    record.ts = now();
  }

  // ---- 发奖（唯一出口：grantItemRewards 已收口 货币/积分/凭证/道具/称号盒）----
  try {
    if (items.length) require('./vit').grantItemRewards(conn, items, 1);
  } catch (e) { log('[auto] 发奖异常：' + (e && e.stack || e)); }

  // ---- 誓灵经验：按 id 汇总后一次性 apply ----
  const expTotal = new Map();
  for (const r of rows) for (const e of (r.servants_exp || [])) expTotal.set(e.id, (expTotal.get(e.id) || 0) + Number(e.exp || 0));
  const changes = [];
  for (const [id, gained] of expTotal) {
    const b = S.servants.find(s => Number(s.id) === Number(id));
    if (!b || gained <= 0) continue;
    const rr = TRAIN.applyServantExp(b, gained);
    if (rr.overflow > 0) { try { require('./dorm').bankDeposit(rr.overflow); } catch (e) { /* 银行异常不阻塞 */ } }
    changes.push({ servant_id: b.id, key: CHANGE_ID_EXP, val: b.exp });
    if (rr.level !== rr.oldLevel) changes.push({ servant_id: b.id, key: CHANGE_ID_LEVEL, val: b.level });
  }
  if (changes.length) { try { pushServantChanges(conn, changes); } catch (e) { /* 忽略 */ } }
  // 御灵士经验：grantItemRewards 已按 30000001 走了 applyRoleExpGain，这里只补推送
  if (items.some(it => Number(it.type) === require('../data/vit_data').ITEM_ROLE_EXP)) {
    try { pushRoleExpChange(conn); } catch (e) { /* 忽略 */ }
  }

  // ---- 券：未跑的「次」全额退 ----
  const refundTicket = Math.max(0, Number(a.times) - finished);
  if (refundTicket > 0) {
    const g = grantGoods(AD.TICKET_ID, refundTicket, conn);
    try { pushGoodsUpdate(conn, g || [], 3); } catch (e) { /* 忽略 */ }
  }

  // ---- 落档 + 回包 ----
  a.finished = 1;
  a.claimed = 1;
  a.claim_time = now();
  a.finish_times = finished;
  a.results = rows.map(r => ({
    nth: r.nth, use_vit: r.use_vit, return_vit: r.return_vit,
    items: r.items, servants_exp: r.servants_exp, is_win: r.is_win,
  }));
  a.record = record;
  a.record_nth = finished;
  setAuto(a);
  saveState();

  try {
    conn.sendToc('m_copy_auto_reward_toc', {
      crusade_id: N,
      barrier_id: Number(a.barrier_id),
      max_times: Number(a.times),
      finish_times: finished,
      items,
      use_vit: useTotal,
      return_vit: returnTotal,
      replace_list: [],
      record_nth: record ? finished : 0,
    });
  } catch (e) { log('[auto] 回包失败（连接已断？）：' + e.message); }
  pushDetail(conn);
  log(`[auto] 自律派遣结算 barrier=${a.barrier_id} 申请${a.times}次 实跑${finished}次`
    + ` 体力 用${useTotal}/预付${a.paid_vit} 退${returnTotal} 券退${refundTicket}`
    + ` 道具${items.length}类 誓灵经验${[...expTotal.values()].reduce((x, y) => x + y, 0)}`
    + ` 录像=${record ? '有' : '无'}${returnTotal ? '' : ''}`);
}

module.exports = {
  handlers: {
    // 每次 detail_toc 之后客户端都会自动发这条（DormMgr.initDispatchDetail 末尾）
    m_copy_auto_info_tos(conn) {
      const a = autoState();
      conn.sendToc('m_copy_auto_info_toc', { fighting: fightingOf(a) });
    },

    m_copy_auto_begin_tos(conn, obj) {
      const crusadeId = Number((obj && obj.crusade_id) || 0);
      const barrierId = Number((obj && obj.barrier_id) || 0);
      const teamIds = ((obj && obj.team_ids) || []).map(Number).filter(x => Number.isInteger(x) && x > 0);
      const times = Math.floor(Number((obj && obj.times) || 0));
      const failStop = Number((obj && obj.is_fail_stop) || 0) ? 1 : 0;
      const reject = (code, why) => {
        log(`[auto] 派遣被拒(${code}) barrier=${barrierId} teams=[${teamIds.join(',')}] times=${times}：${why}`);
        tips(conn, code);
      };
      if (crusadeId !== N) return reject(206004, '不是自律派遣任务');
      const cur = autoState();
      if (cur && !cur.claimed) return reject(206003, '已有一个自律派遣在进行/待领取');
      const cfg = require('../data/map_configs').MAP_CONFIGS[barrierId];
      if (!cfg || !cfg.waves || !(barrierId >= 1000000 && barrierId < 2000000)) return reject(206004, '副本不存在或不是主线关');
      if (!isClearedCopy(barrierId)) return reject(206004, '该关尚未三星通关（客户端按钮本应隐藏）');
      if (!pointsOf(barrierId).length) return reject(206004, '该关没有可打的战斗点');
      if (!(times >= 1 && times <= AD.MAX_TIMES)) return reject(206005, `次数 ${times} 越界（1~${AD.MAX_TIMES}）`);
      if (!teamIds.length) return reject(206005, '没有选队伍');
      if (new Set(teamIds).size !== teamIds.length) return reject(206006, '队伍 id 重复');
      // 队伍必须存在且有人
      for (const tid of teamIds) {
        const f = require('./servant').buildFormation(tid, S.formations[tid]);
        if (!(f.field || []).some(id => id > 0)) return reject(206005, `队伍 ${tid} 是空的`);
      }
      // 券 / 体力
      const tNum = ticketNum();
      if (tNum < times) return reject(206005, `派遣券不足（需 ${times}，有 ${tNum}）`);
      const per = paidPerRun(teamIds, barrierId);
      const V = require('./vit');
      if (V.getVit() < per * times) return reject(206009, `体力不足（需 ${per * times}，有 ${V.getVit()}）`);

      // ---- 扣费（出发即扣；中止/失败按实际场次返还）----
      const sp = spendTicket(times);
      if (per > 0) V.addVit(conn, -(per * times));
      try {
        if ((sp.updated || []).length) pushGoodsUpdate(conn, sp.updated, 3);
        if ((sp.removed || []).length) pushGoodsUpdate(conn, sp.removed, 2);
      } catch (e) { /* 忽略 */ }

      const t0 = now();
      const a = {
        crusade_id: N,
        barrier_id: barrierId,
        team_ids: teamIds,
        times,
        is_fail_stop: failStop,
        start_time: t0,
        end_time: t0 + AD.TIME_PER_RUN * times,
        paid_ticket: times,
        paid_vit: per * times,
        points: pointsOf(barrierId),
        finished: 0,
        claimed: 0,
        results: null,
        record: null,
      };
      setAuto(a);
      saveState();
      conn.sendToc('m_copy_auto_begin_toc', {
        crusade_id: N, barrier_id: barrierId, team_ids: teamIds, times, is_fail_stop: failStop,
      });
      pushDetail(conn);
      log(`[auto] 自律派遣出发 barrier=${barrierId}(${cfg.waves ? Object.keys(cfg.waves).length + '点' : ''}) `
        + `队=[${teamIds.join(',')}] ${times}次 × ${a.points.length}场 券-${times} 体力-${per * times} `
        + `end=${a.end_time}（${AD.TIME_PER_RUN * times}s）`);
    },

    // 中止：未结算时全额退（券 + 体力），不发奖。官方文案承诺"按派遣情况发奖"，
    // 但那条要跑完才知道，v1 取"整单退"（对玩家更有利，且不会产生"白扣"投诉）
    m_copy_auto_cancel_tos(conn, obj) {
      const a = autoState();
      const crusadeId = Number((obj && obj.crusade_id) || 0);
      if (!a || crusadeId !== N) { log(`[auto] 中止被拒(208001) crusade=${crusadeId}：队列里没有`); tips(conn, 208001); return; }
      if (Number(a.finished) || now() >= Number(a.end_time)) {
        log('[auto] 中止被拒(208002)：已完成，请领奖（避免白丢奖励）');
        tips(conn, 208002);
        return;
      }
      const V = require('./vit');
      const backVit = Number(a.paid_vit) || 0;
      if (backVit > 0) V.addVit(conn, backVit);
      const backTicket = Number(a.paid_ticket) || 0;
      if (backTicket > 0) {
        const g = grantGoods(AD.TICKET_ID, backTicket, conn);
        try { pushGoodsUpdate(conn, g || [], 3); } catch (e) { /* 忽略 */ }
      }
      setAuto(null);
      saveState();
      conn.sendToc('m_copy_auto_cancel_toc', { crusade_id: N });
      pushDetail(conn);
      log(`[auto] 自律派遣中止 barrier=${a.barrier_id}：退券${backTicket} 退体力${backVit}`);
    },

    m_copy_auto_reward_tos(conn, obj) {
      const crusadeId = Number((obj && obj.crusade_id) || 0);
      const a = autoState();
      if (!a || crusadeId !== N) { log(`[auto] 领奖被拒(210001) crusade=${crusadeId}：队列里没有`); tips(conn, 210001); return; }
      if (!Number(a.finished) && now() < Number(a.end_time)) {
        log(`[auto] 领奖被拒(210002)：尚未完成 now=${now()} end=${a.end_time}`);
        tips(conn, 210002);
        return;
      }
      if (a.claimed) { // 重复领取：把上次结果再回一遍（面板可能被重开）
        conn.sendToc('m_copy_auto_reward_toc', {
          crusade_id: N, barrier_id: Number(a.barrier_id), max_times: Number(a.times),
          finish_times: Number(a.finish_times) || 1, items: [], use_vit: 0, return_vit: 0,
          replace_list: [], record_nth: Number(a.record_nth) || 0,
        });
        return;
      }
      if (JOB.a) { tips(conn, 206003); return; } // 正在算，别重入
      // 分块跑（一次 tick ≤60ms，进度 toc 兜 D2 的三秒探针）
      JOB.conn = conn; JOB.a = a; JOB.idx = 0; JOB.rows = []; JOB.done = false;
      progress(conn, a, a.times);
      setImmediate(pump);
    },

    m_copy_auto_result_page_tos(conn, obj) {
      const a = autoState();
      const crusadeId = Number((obj && obj.crusade_id) || 0);
      const from = Math.max(1, Number((obj && obj.from) || 0));
      const to = Math.max(from, Number((obj && obj.to) || 0));
      const rows = (a && Array.isArray(a.results)) ? a.results : [];
      const slice = [];
      for (let i = from; i <= to; i++) {
        const r = rows[i - 1];
        if (!r) continue;
        slice.push({
          nth: Number(r.nth) || i,
          use_vit: Number(r.use_vit) || 0,
          return_vit: Number(r.return_vit) || 0,
          items: r.items || [],
          servants_exp: r.servants_exp || [],
          is_win: Number(r.is_win) || 0,
        });
      }
      // ⚠️ copy_result 必须从 1 打包（见文件头 ③）；客户端 from=to=i 时读 copy_result[1]
      conn.sendToc('m_copy_auto_result_page_toc', {
        crusade_id: N,
        barrier_id: Number((a && a.barrier_id) || 0),
        from, to,
        copy_result: slice,
      });
    },

    m_copy_auto_record_tos(conn, obj) {
      const a = autoState();
      const crusadeId = Number((obj && obj.crusade_id) || 0);
      const rec = (a && a.record) || null;
      const list = [];
      if (a && rec) {
        list.push({
          nth: Number(a.record_nth) || 1,
          use_vit: Number((a.results && a.results[(Number(a.record_nth) || 1) - 1] || {}).use_vit) || 0,
          is_win: Number(rec.resultToc && rec.resultToc.result) || 0,
          monster: rec.monster || [],
          servant_change: rec.servant_change || [],
          record_key: Number(rec.id) || 0,
        });
      }
      conn.sendToc('m_copy_auto_record_toc', { crusade_id: N, barrier_id: Number((a && a.barrier_id) || 0), list });
    },
  },

  // 供 tower.js 的录像协议查（`m_fight_record_info_tos/msg_tos` 是全局通道，两个来源共用）
  recordOf(recId) {
    const a = autoState();
    const rec = a && a.record;
    if (!rec || Number(rec.id) !== Number(recId)) return null;
    return rec;
  },
  resetJob() { JOB.a = null; JOB.conn = null; JOB.rows = []; JOB.idx = 0; },
};
