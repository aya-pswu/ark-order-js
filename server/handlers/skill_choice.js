// 作战策略（SkillChoice 模块 / m_servant_ai_* 五条协议，2026-10-25 用户反馈"战斗预设不生效+自行页签点不了"接通）
// 客户端机制（tmp/ljd_skillchoice/ 反编译实证，详见 调研-作战策略.md）：
//   - 模式：ai_id 4=自动（ai_value 0 最优策略/1 单体至上/2 群体优先，CfgSkillChoice.modeArr）、
//           6=自行（按誓灵 ai_skills 循环出技）。客户端 _currMode 唯一写入口是 info_toc/type_toc 回包——
//           此前兜底回 {0,0}（非法态）导致面板卡死在自行侧、开关弹回。
//   - 方案：固定 6 槽（saveMaxNum=6，槽 id 1..6），p_fight_tactics{id,name≤7字,servants:[p_dkl{id:誓灵id,list:循环}]}；
//           sort=6 槽显示顺序。保存/删除后 set_toc 必须回全量（客户端 updateSaveArrOne 按 id 逐个回填）。
//   - 应用：m_servant_ai_use_tos{tactic_id, team_id(1..4)} → 把快照写回各誓灵 ai_skills
//           （客户端每誓灵只有一个全局循环 aiSkills，面板/保存/编辑全围绕它——应用即恢复快照）。
//   - 编辑：m_servant_ai_change_tos{id:誓灵id, list:循环} 直接落盘该誓灵 ai_skills（客户端本地已写，仅等回包）。
// 战斗消费在 fight_core.allyChoose（三条战线共用），本文件只管数据面。
const { S, saveState } = require('../state');
const { log } = require('../lib');

const SLOT_MIN = 1, SLOT_MAX = 6;          // SkillChoiceMgr.saveMaxNum
const NAME_MAX_CHARS = 7;                  // SkillChoiceSaveNamePanel.onInputChange utf8 上限
const CYCLE_MAX = 9;                       // SkillChoiceConst.skillMaxNum
const MODE_AUTO = 4, MODE_MANUAL = 6;      // SkillChoiceConst
const TEAM_MIN = 1, TEAM_MAX = 4;          // SkillChoiceTeamMainView 队伍1..4

function ai() {
  // loadState 已补形状；运行期兜底（PS_STATE_FILE 指空档等极端态）
  if (!S.aiState) {
    S.aiState = { modeId: 4, modeValue: 0, tactics: {}, sort: [1, 2, 3, 4, 5, 6], applied: {} };
  }
  return S.aiState;
}

// 已存方案 → p_fight_tactics 数组（按 sort 顺序；空槽不下发，客户端 fillData(nil) 分支不受影响）
function tacticsWire() {
  const a = ai();
  return (a.sort || []).map(id => a.tactics[id]).filter(t => t && t.name);
}

// AI 上下文（fight_core.allyChoose 入参；延迟 require 由调用方做，避免 data→handlers 反向依赖）
function aiCtxOf() {
  const a = ai();
  return { modeId: a.modeId, modeValue: a.modeValue };
}

// 客户端传入的 tactics 原形（含 name/servants）净化：id 限 1..6、name 截 7 字、循环逐元素 Number 截 9
function sanitizeTactic(t) {
  const id = Number(t && t.id);
  if (!(id >= SLOT_MIN && id <= SLOT_MAX)) return null;
  const name = String((t && t.name) || '').slice(0, NAME_MAX_CHARS);
  if (!name) return null;
  const servants = [];
  const seen = new Set();
  for (const s of (Array.isArray(t && t.servants) ? t.servants : [])) {
    const sid = Number(s && s.id);
    if (!(sid > 0) || seen.has(sid)) continue;
    seen.add(sid);
    const list = (Array.isArray(s.list) ? s.list : []).map(Number).filter(n => n >= 0).slice(0, CYCLE_MAX);
    servants.push({ id: sid, list });
  }
  return { id, name, servants };
}

const handlers = {

  // 全量查询：出击面板每次打开发一次（CopyEnterPanel.onOpenPanel，引导组100 后）+ 打开作战策略面板时
  'm_servant_ai_info_tos'(conn) {
    const a = ai();
    conn.sendToc('m_servant_ai_info_toc', {
      ai_id: a.modeId, ai_value: a.modeValue,
      tactics: tacticsWire(), sort: (a.sort || []).slice(),
    });
  },

  // 切模式：回显真值是「自行/自动开关不再弹回」的唯一修复点（type_toc → setCurrMode → 重绘）
  'm_servant_ai_type_tos'(conn, obj) {
    const id = Number(obj && obj.ai_id);
    const val = Number(obj && obj.ai_value) || 0;
    if (id !== MODE_AUTO && id !== MODE_MANUAL) {
      log(`[ai] 拒绝非法模式 ai_id=${id}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    if (id === MODE_AUTO && ![0, 1, 2].includes(val)) {
      log(`[ai] 拒绝非法自动档 ai_value=${val}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    const a = ai();
    a.modeId = id;
    a.modeValue = id === MODE_AUTO ? val : 0;
    saveState();
    conn.sendToc('m_servant_ai_type_toc', { ai_id: a.modeId, ai_value: a.modeValue });
    log(`[ai] 模式切换 → ${a.modeId === MODE_MANUAL ? '自行' : `自动(${['最优策略', '单体至上', '群体优先'][a.modeValue]})`}`);
  },

  // 保存/删除/排序方案：回全量 tactics + sort + delete（客户端 set_toc 三个都消费）
  'm_servant_ai_set_tos'(conn, obj) {
    const a = ai();
    const del = (Array.isArray(obj && obj.delete) ? obj.delete : []).map(Number)
      .filter(id => id >= SLOT_MIN && id <= SLOT_MAX);
    del.forEach(id => { delete a.tactics[id]; });
    const savedIds = [];
    for (const t of (Array.isArray(obj && obj.tactics) ? obj.tactics : [])) {
      const st = sanitizeTactic(t);
      if (!st) { log(`[ai] 跳过非法方案槽 ${t && t.id}`); continue; }
      a.tactics[st.id] = st;
      savedIds.push(st.id);
    }
    if (Array.isArray(obj && obj.sort) && obj.sort.length === SLOT_MAX) {
      const s = obj.sort.map(Number).filter(id => id >= SLOT_MIN && id <= SLOT_MAX);
      if (s.length === SLOT_MAX) a.sort = s;
    }
    // 悬空槽号从 sort 里清掉并补齐缺号（6 槽顺序不变量）
    const have = new Set(Object.keys(a.tactics));
    const order = (a.sort || []).filter(id => have.has(id));
    for (let i = SLOT_MIN; i <= SLOT_MAX; i++) if (!order.includes(i)) order.push(i);
    a.sort = order;
    saveState();
    conn.sendToc('m_servant_ai_set_toc', {
      delete: del, tactics: tacticsWire(), sort: (a.sort || []).slice(),
    });
    log(`[ai] 方案保存：槽 ${savedIds.join(',') || '无'}${del.length ? ` 删除 ${del.join(',')}` : ''}（现有 ${tacticsWire().length} 槽）`);
  },

  // 应用方案到编队：写回各誓灵 ai_skills（客户端每誓灵一个全局循环，应用即恢复快照）+ 记录 applied 备查
  'm_servant_ai_use_tos'(conn, obj) {
    const tid = Number(obj && obj.tactic_id);
    const teamId = Number(obj && obj.team_id);
    const a = ai();
    const t = a.tactics[tid];
    if (!(tid >= SLOT_MIN && tid <= SLOT_MAX) || !t || !t.name) {
      log(`[ai] 拒绝应用：槽 ${tid} 无方案`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    if (!(teamId >= TEAM_MIN && teamId <= TEAM_MAX)) {
      log(`[ai] 拒绝应用：编队 ${teamId} 越界`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    let applied = 0, missing = 0;
    for (const sv of (t.servants || [])) {
      const b = S.servants.find(x => Number(x.id) === Number(sv.id));
      if (!b) { missing++; continue; }
      b.ai_skills = (sv.list || []).slice();
      applied++;
    }
    a.applied[teamId] = tid;
    saveState();
    conn.sendToc('m_servant_ai_use_toc', {});
    log(`[ai] 方案「${t.name}」应用到编队 ${teamId}：${applied} 只誓灵循环已写回${missing ? `（${missing} 只已不在档跳过）` : ''}`);
  },

  // 编辑单誓灵循环：客户端本地已写 VO，服务端只落盘 + 回显（change_toc 字段客户端不读，回显保语义）
  'm_servant_ai_change_tos'(conn, obj) {
    const sid = Number(obj && obj.id);
    const b = S.servants.find(x => Number(x.id) === sid);
    if (!b) {
      log(`[ai] 拒绝循环编辑：誓灵 ${sid} 不存在`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    const list = (Array.isArray(obj && obj.list) ? obj.list : []).map(Number)
      .filter(n => n >= 0).slice(0, CYCLE_MAX);
    b.ai_skills = list;
    saveState();
    conn.sendToc('m_servant_ai_change_toc', { id: sid, list: list.slice() });
  },

};

module.exports = { handlers, ai, aiCtxOf, tacticsWire, sanitizeTactic };
