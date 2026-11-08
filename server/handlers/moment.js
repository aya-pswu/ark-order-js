// 言灵录（ServantMoment）：誓灵们的"留言墙"。
//
// 客户端实证（tools/bc_cmp/servantmoment_new/ = lua_remote/bc 反编译 + 伪汇编）：
//  - **没有** m_moments_num_tos：数量/未读是纯推送 m_moments_num_toc{num, unread_num}，
//    登录必须推（客户端的 allTrendsNum 靠它；入口红点靠 unread_num）；
//  - 列表 m_moments_page_toc{from,to,list:p_moment}。from/to 是 1-based 下标，**下标 1 = 最新**，
//    且服务端要把该窗口**按时间倒序（最新在前）**发出——客户端 updateMomentData 会 table.reverse
//    再切片成 3 页（每页 6 条），最终是"聊天式"阅读顺序：页内由旧到新、新的在最下面，
//    向上翻（btnPageUp → changeToLastPage）拉 to+1..to+6 的**更早**内容。
//    （伪汇编实证：page.from = (from-1)+n-stop+1、page.to = (from-1)+n-start+1，n=返回条数）
//  - p_moment.time=0 表示**未解锁**。未解锁条目**照样下发在列表里**（客户端 ServantMomentItem
//    隐藏日期/红点，点击走 MomentTipPanel 显示触发条件）。所以 list 含全部言灵录，num=总数；
//  - p_moment.close_condition = **已达成条件下标**（1/2/3）：MomentTipPanel 把下标命中的条件标"（达成）"。
//    1/2 是 2020-08-06 被删除的老条件（"誓灵进化到5星"/"等级75"）→ 恒达成；
//  - 详情 m_moments_detail_toc{m_id,servant_type,like_roles,comments}：主贴正文由客户端按 m_id
//    查本地配置，服务端只给 like_roles；comments 见下方 buildComments；
//  - 点赞 m_moments_like_tos{m_id,comment_id,author,op_type}（op_type 1=赞 0=取消）：toc 载荷客户端
//    忽略，收到后自动重拉详情；主贴的赞是 comment_id=0/author=0；
//  - 选项回复只能选一次；自定义回复只能发一次（删除后不可再发，WIKI 明示）——服务端据此拒绝。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log, roleId } = L;
const MD = require('../data/moment_data');

const DAY = 86400;
const MAX_CUSTOM_LEN = 120;      // 自定义回复长度上限（客户端输入框另有软限制）
const BACKDATE = 4 * DAY;        // 存量誓灵"获得时间"回填：视为早已获得（本地服口径，见 firstOwnOf）

function st() {
  if (!S.momentState) {
    S.momentState = {
      unlocked: {}, read: {}, reply: {}, custom: {}, customUsed: {},
      momentLikes: {}, commentLikes: {},
      dispatchGroups: [], wonWith: [], clearedWith: {},
      firstOwn: {}, backfilled: false,
    };
  }
  const s = S.momentState;
  for (const k of ['unlocked', 'read', 'reply', 'custom', 'customUsed', 'momentLikes', 'commentLikes', 'clearedWith', 'firstOwn']) {
    if (!s[k] || typeof s[k] !== 'object') s[k] = {};
  }
  for (const k of ['dispatchGroups', 'wonWith']) if (!Array.isArray(s[k])) s[k] = [];
  return s;
}
const now = () => Math.floor(Date.now() / 1000);

// ---------- 触发条件判定（全部是对存档的纯读取）----------
const typeOfInstance = id => { const b = S.servants.find(x => Number(x.id) === Number(id)); return b ? Number(b.type) : 0; };
const dormTypes = () => (S.dormState.servants || []).map(x => typeOfInstance(x.servant_id)).filter(Boolean);
const troopTypes = t => (t.servant_ids || []).map(typeOfInstance).filter(Boolean);
const owns = t => S.servants.some(b => Number(b.type) === Number(t));

function condMet(u) {
  const s = st();
  switch (u.kind) {
    case 'dorm': {                       // 将X（X、Y）放入协会（休息位）
      const d = dormTypes();
      return u.types.every(t => d.includes(t));
    }
    case 'dispatchJoin': {               // X参与一次派遣（在派出的队伍里）
      const groups = (S.dormState.troops || []).map(troopTypes);
      return u.types.every(t => groups.some(g => g.includes(t)));
    }
    case 'dispatchDone': {               // 使用X（X、Y同时）完成一次派遣（已领奖的那支队伍）
      return u.types.every(t => s.dispatchGroups.some(g => g.includes(t)));
    }
    case 'win':                          // 使用X获得一次副本胜利
      return u.types.every(t => s.wonWith.includes(t));
    case 'clear':                        // 使用X通关主线N-M
      return u.types.every(t => (s.clearedWith[t] || []).includes(u.stage));
    case 'level':                        // X达到N级
      return u.types.every(t => S.servants.some(b => Number(b.type) === Number(t) && (Number(b.level) || 1) >= u.level));
    case 'own':                          // 获得X
      return u.types.every(owns);
    case 'ownDays':                      // 获得X超过N天
      return u.types.every(t => s.firstOwn[t] && now() - s.firstOwn[t] >= u.days * DAY);
    default:
      return false;
  }
}

// 存量誓灵"获得时间"回填：本功能上线前就持有的誓灵没有时间戳，
// 首次判定时统一回填为「4 天前」（当作早就获得）——否则 ownDays 类条件还要再等 3 天。
// 回填之后新获得的誓灵在下次判定时记「当下」（ownDays 从获得那一刻起算）。
function backfillFirstOwn() {
  const s = st();
  let changed = false;
  if (!s.backfilled) {
    let n = 0;
    for (const b of S.servants) {
      const t = Number(b.type);
      if (t && !s.firstOwn[t]) { s.firstOwn[t] = now() - BACKDATE; n++; }
    }
    s.backfilled = true;
    changed = true;
    if (n) log(`[moment] 获得时间回填：${n} 个誓灵类型记为 ${BACKDATE / DAY} 天前（存量档口径）`);
  } else {
    const t = now();
    for (const b of S.servants) {
      const ty = Number(b.type);
      if (ty && !s.firstOwn[ty]) { s.firstOwn[ty] = t; changed = true; }
    }
  }
  return changed;
}

// 重新判定全部条件 → 解锁新条目。conn 存在时推数量包。返回是否有变化。
function checkUnlocks(conn) {
  const s = st();
  let changed = backfillFirstOwn();
  const t = now();
  for (const m of MD.MOMENTS) {
    if (s.unlocked[m.m_id]) continue;
    if (condMet(m.unlock)) {
      s.unlocked[m.m_id] = t;
      changed = true;
      log(`[moment] 解锁言灵录 ${m.m_id}（${m.condText}）`);
    }
  }
  if (changed) { saveState(); if (conn) pushNum(conn); }
  return changed;
}

// 新获得誓灵 → 记获得时间（ownDays 条件用）
function onServantObtained(types) {
  const s = st();
  const t = now();
  let changed = false;
  for (const ty of [].concat(types || [])) {
    const n = Number(ty);
    if (n && !s.firstOwn[n]) { s.firstOwn[n] = s.backfilled ? t : t - BACKDATE; changed = true; }
  }
  if (changed) saveState();
}

// ---------- 事件钩子（由各玩法调用）----------
// 副本胜利：记录"用过哪些誓灵赢过"+ 通关的关卡（win / clear 条件）
function onBattleWin(types, stageKey) {
  const s = st();
  for (const ty of [].concat(types || [])) {
    const n = Number(ty);
    if (!n) continue;
    if (!s.wonWith.includes(n)) s.wonWith.push(n);
    if (stageKey) {
      if (!s.clearedWith[n]) s.clearedWith[n] = [];
      if (!s.clearedWith[n].includes(stageKey)) s.clearedWith[n].push(stageKey);
    }
  }
}
// 派遣领奖：记录该队誓灵类型组（dispatchDone 条件）
function onDispatchDone(types) {
  const s = st();
  const g = [].concat(types || []).map(Number).filter(Boolean);
  if (g.length) s.dispatchGroups.push(g);
}

// ---------- 推送 ----------
const unreadNum = () => MD.MOMENTS.filter(m => st().unlocked[m.m_id] && !st().read[m.m_id]).length;
function pushNum(conn) {
  conn.sendToc('m_moments_num_toc', { num: MD.TOTAL, unread_num: unreadNum() });
}

// ---------- 列表组装 ----------
// 顺序：下标 1 = 最新 → 按 m_id 降序（配置里 m_id 递增即上线顺序）
const ORDER = MD.MOMENTS.map(m => m.m_id).sort((a, b) => b - a);
function momentP(m) {
  const s = st();
  const unlocked = !!s.unlocked[m.m_id];
  const always = m.satisfiedAlways || [];
  return {
    m_id: m.m_id,
    servant_type: m.servant_type,
    time: unlocked ? s.unlocked[m.m_id] : 0,     // 0 = 未解锁 → 客户端开条件提示面板
    read: unlocked ? (s.read[m.m_id] ? 1 : 0) : 0,
    close_condition: unlocked ? always.concat([3]) : always.slice(),
  };
}
function pageList(ids, from, to) {
  const out = [];
  for (let i = from; i <= to && i <= ids.length; i++) if (i >= 1) out.push(ids[i - 1]);
  return out;
}

// ---------- 详情组装 ----------
const likeKey = (mId, cid, author) => `${mId}:${cid}:${author || 0}`;
const momentLiked = mId => !!st().momentLikes[mId];
const commentLiked = (mId, cid, author) => !!st().commentLikes[likeKey(mId, cid, author)];

function buildComments(mId) {
  const m = MD.BY_ID[mId];
  const s = st();
  const out = [];
  // 1) 初始留言串（誓灵们的对话）
  for (const t of m.thread) {
    out.push({
      role_id: 0, servant_type: t.type, comment_id: t.cid, content: '',
      like_roles: commentLiked(mId, t.cid, 0) ? [roleId] : [],
    });
  }
  // 2) 玩家的选项回复 + 誓灵对它的回复（WIKI：只能选一次）
  const r = s.reply[mId];
  if (r) {
    out.push({
      role_id: roleId, servant_type: 0, comment_id: r.choice, content: '',
      like_roles: commentLiked(mId, r.choice, 0) ? [roleId] : [],
    });
    out.push({
      role_id: 0, servant_type: m.servant_type, comment_id: r.reply, content: '',
      like_roles: commentLiked(mId, r.reply, 0) ? [roleId] : [],
    });
  }
  // 3) 玩家的自定义回复（comment_id=0 → 客户端用 content 直显）
  const c = s.custom[mId];
  if (c) {
    out.push({
      role_id: roleId, servant_type: 0, comment_id: 0, content: c.content,
      like_roles: commentLiked(mId, 0, 0) ? [roleId] : [],
    });
  }
  return out;
}

const handlers = {
  // 分页列表：from/to 是 1-based 下标（1 = 最新），服务端按"最新在前"发该窗口
  m_moments_page_tos(conn, obj) {
    checkUnlocks(conn);
    const n = ORDER.length;
    let from = Math.max(1, Math.floor(Number(obj && obj.from) || 1));
    let to = Math.floor(Number(obj && obj.to) || from);
    if (to > n) to = n;
    if (to < from) { from = 1; to = Math.min(n, 1); }
    conn.sendToc('m_moments_page_toc', {
      from, to,
      list: pageList(ORDER, from, to).map(id => momentP(MD.BY_ID[id])),
    });
    log(`[moment] 列表下发 [${from},${to}]（共 ${n} 条，已解锁 ${Object.keys(st().unlocked).length}）`);
  },

  // 已解锁誓灵列表（按誓灵筛选用）：id=servant_type val=该誓灵已解锁条数
  m_moments_servants_tos(conn) {
    checkUnlocks(conn);
    const s = st();
    const cnt = {};
    for (const m of MD.MOMENTS) if (s.unlocked[m.m_id]) cnt[m.servant_type] = (cnt[m.servant_type] || 0) + 1;
    conn.sendToc('m_moments_servants_toc', {
      servants: Object.entries(cnt).map(([id, val]) => ({ id: Number(id), val })),
    });
  },

  // 按誓灵查（只给该誓灵**已解锁**的条目，与 servants 列表的 val 同口径）
  m_moments_query_servant_tos(conn, obj) {
    checkUnlocks(conn);
    const s = st();
    const ty = Number((obj && obj.servant) || 0);
    const ids = ORDER.filter(id => MD.BY_ID[id].servant_type === ty && s.unlocked[id]);
    let from = Math.max(1, Math.floor(Number(obj && obj.from) || 1));
    let to = Math.floor(Number(obj && obj.to) || from);
    if (to > ids.length) to = ids.length;
    if (to < from) { from = 1; to = ids.length; }
    conn.sendToc('m_moments_query_servant_toc', {
      from, to,
      list: pageList(ids, from, to).map(id => momentP(MD.BY_ID[id])),
    });
  },

  // 详情：主贴 like_roles + 留言串；顺带置已读（红点）
  m_moments_detail_tos(conn, obj) {
    const mId = Number((obj && obj.m_id) || 0);
    const m = MD.BY_ID[mId];
    if (!m) { log(`[moment] 详情请求了不存在的言灵录 ${mId}`); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
    const s = st();
    const wasUnread = !!s.unlocked[mId] && !s.read[mId];
    if (s.unlocked[mId]) s.read[mId] = 1;
    conn.sendToc('m_moments_detail_toc', {
      m_id: mId,
      servant_type: m.servant_type,
      like_roles: momentLiked(mId) ? [roleId] : [],
      comments: buildComments(mId),
    });
    if (wasUnread) { saveState(); pushNum(conn); }
  },

  // 点赞/取消：主贴 comment_id=0；留言用 (comment_id, author) 定位
  m_moments_like_tos(conn, obj) {
    const mId = Number((obj && obj.m_id) || 0);
    const cid = Number((obj && obj.comment_id) || 0);
    const author = Number((obj && obj.author) || 0);
    const op = Number((obj && obj.op_type) || 0);
    const m = MD.BY_ID[mId];
    if (!m || !st().unlocked[mId]) {
      log(`[moment] 点赞被拒：m_id=${mId} 未解锁/不存在`);
      conn.sendToc('m_moments_like_toc', { m_id: mId, comment_id: cid, author, op_type: op });
      return;
    }
    const s = st();
    if (cid === 0 && author === 0) {
      if (op) s.momentLikes[mId] = 1; else delete s.momentLikes[mId];
    } else {
      const k = likeKey(mId, cid, author);
      if (op) s.commentLikes[k] = 1; else delete s.commentLikes[k];
    }
    saveState();
    // 载荷客户端不用（收到后自动 m_moments_detail_tos 重拉），原样回显
    conn.sendToc('m_moments_like_toc', { m_id: mId, comment_id: cid, author, op_type: op });
    log(`[moment] ${op ? '点赞' : '取消赞'} m=${mId} cid=${cid} author=${author}`);
  },

  // 回复：comment_id>0 = 选择回复（对应玩家选项 id，只能选一次）；
  //       comment_id=0 + content = 自定义回复（只能发一次，删除后不可再发）
  m_moments_comment_tos(conn, obj) {
    const mId = Number((obj && obj.m_id) || 0);
    const cid = Number((obj && obj.comment_id) || 0);
    const content = String((obj && obj.content) || '');
    const m = MD.BY_ID[mId];
    const deny = why => {
      log(`[moment] 回复被拒 m=${mId} cid=${cid}：${why}`);
      conn.sendToc('m_moments_comment_toc', { m_id: mId, comment_id: cid, content: 0 });
    };
    if (!m) return deny('言灵录不存在');
    const s = st();
    if (!s.unlocked[mId]) return deny('未解锁');
    if (cid > 0) {
      if (s.reply[mId]) return deny('已选过选项回复（只能选一次）');
      if (!m.choices.some(c => c.choice === cid)) return deny('不是本条的选项');
      const c = m.choices.find(c => c.choice === cid);
      s.reply[mId] = { choice: c.choice, reply: c.reply, time: now() };
    } else {
      // 自定义回复同样**只有一次机会**：删除后不可再发（WIKI 明示）→ 用 customUsed 记住"发过"
      if (s.customUsed[mId]) return deny('已发过自定义回复（删除后也不可再发）');
      const txt = content.trim();
      if (!txt) return deny('自定义回复为空');
      s.custom[mId] = { content: txt.slice(0, MAX_CUSTOM_LEN), time: now() };
      s.customUsed[mId] = 1;
    }
    saveState();
    conn.sendToc('m_moments_comment_toc', { m_id: mId, comment_id: cid, content: 0 });
    log(`[moment] 回复 m=${mId} ${cid > 0 ? `选项 ${cid}` : `自定义「${s.custom[mId].content}」`}`);
  },

  // 删除自定义回复（只有 comment_id=0 那一条可删；删了也不能再发）
  m_moments_del_comment_tos(conn, obj) {
    const mId = Number((obj && obj.m_id) || 0);
    const cid = Number((obj && obj.comment_id) || 0);
    const s = st();
    if (cid === 0 && s.custom[mId]) {
      delete s.custom[mId];
      saveState();
      log(`[moment] 删除自定义回复 m=${mId}`);
    } else {
      log(`[moment] 删除被拒/无内容 m=${mId} cid=${cid}`);
    }
    conn.sendToc('m_moments_del_comment_toc', { m_id: mId, comment_id: cid });
  },
};

// 登录：回填获得时间 → 判定解锁 → 推数量（入口红点）
function onLogin(conn) {
  checkUnlocks(conn);
  pushNum(conn);
  log(`[moment] 登录同步：言灵录 ${Object.keys(st().unlocked).length}/${MD.TOTAL} 已解锁，未读 ${unreadNum()}`);
}

module.exports = {
  handlers, onLogin, st, checkUnlocks, pushNum,
  onBattleWin, onDispatchDone, onServantObtained, unreadNum,
};
