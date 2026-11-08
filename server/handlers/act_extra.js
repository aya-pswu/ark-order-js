// 活动扩展（活动系统批量落地）：
//   1782 海神彼岸/1422 情人签到（累计签到族）  1630 世界树  1070/1071 绫音沁曲  1652 希腊探索（星座）
//   1046 恋爱×告白  1057/1058 花咲樱月  1624 乞巧佳节  1034 圣诞活动  1737 薄明的圣夜（商店走 shop.js）
//   1417 新春每日任务  1694 每日集结  1361 小千日记  1735 元旦拼图  1701 古籍转译（无限池）
//   1646 巫山神女  1741 天外来客（兑换+上贡）  1164 信赖培养  1711 圣诞往事（兑换+最小投票）
// 调研要点（工作日志 2026-09-12）：
//  - 任务 p_kvt.type 统一 1=进行中 2=可领取 3=已领取（1630 REWARDS_* 与 1070/1057/1417 MISSION_* 数字恰对齐）
//  - 小千日记 type=4(未激活) 只允许出现在偶数位（客户端 getCurrentChapter=missionInPrg/2 需整数）
//  - 积分奖励 p_kvi.val 1=未达成 2=可领取 3=已领取；信赖培养面板写死 act 1105（rewards 按 rewardId 匹配）
//  - 1046 告白 servant_id 必须是玩家拥有的誓灵；1034 投票 rows 的 servant_type_id 必须是 CfgServant 正常誓灵
const { S, saveState } = require('../state');
const L = require('../lib');
const { log } = L;
const { grantMissionRewards } = require('./activity');
const D = require('../data/act_extra_data');
const { SERVANT_PHYLE } = require('../data/skill_data');
const G = require('../data/glasttour_data'); // 少女终末旅行（1360/1365）活动关数据（合成 waves 已注册进 MAP_CONFIGS）
const C2 = require('../data/collab_data'); // 三联动数据（星梦通行证 STAR_DREAM/任务表/合成关卡 meta）

// ---- 基础工具 ----
function localDay(t) {
  const d = new Date(t || Date.now());
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function st() {
  if (!S.actExtraState) S.actExtraState = {};
  return S.actExtraState;
}
function sub(name, def) {
  const s = st();
  if (!s[name]) s[name] = def();
  return s[name];
}
function ensureDaily(stObj, key) {
  const dk = localDay();
  if (stObj[key] !== dk) { stObj[key] = dk; return true; }
  return false;
}
// 统一发奖（复用任务发奖通道：货币/道具形态积分/背包+奖励弹窗）
function grant(conn, rwList) {
  if (!rwList || !rwList.length) return;
  // 活动配置同时存在 {id,num} 与签到族 {type,num} 两种形状；统一到发奖通道前
  // 必须显式取 type 兜底，否则会生成 type_id=undefined 的坏背包对象。
  const rewards = rwList
    .map(r => [Number(r && (r.id != null ? r.id : r.type)) || 0, Number(r && r.num) || 0])
    .filter(([id, num]) => id > 0 && num > 0);
  if (rewards.length) grantMissionRewards(conn, rewards);
}
// 特例：建造点 60000231 是 form=2 无 CfgScoreItem 映射 → 客户端读 role_scores[2231]
function grantRW(conn, rw) {
  if (rw && rw.id === 60000231) { L.addScore(conn, D.BUILDING.scoreId, rw.num); return; }
  grant(conn, [rw]);
}

// ---- 任务定义（des → 事件名，顺序敏感：先具体后一般）----
function evOf(des) {
  const s = String(des || '');
  if (/神迹演武/.test(s)) return 'miracle';
  if (/誓约破除/.test(s)) return 'oathbreak';
  if (/获得.*(UR|角色|誓灵)/.test(s)) return 'gain';
  if (/召唤/.test(s)) return 'summon';
  if (/派遣/.test(s)) return 'dispatch';
  if (/训练/.test(s)) return 'train';
  if (/日常/.test(s)) return 'daily';
  if (/曜日/.test(s)) return 'dailyCopy';
  if (/击败/.test(s)) return 'kill';
  if (/战斗|副本|关卡/.test(s)) return 'battle';
  if (/体力/.test(s)) return 'vit';
  if (/金币/.test(s)) return 'silver';
  if (/登陆|登录/.test(s)) return 'login';
  return null;
}
const WT_M = D.WORLD_TREE.missions.map(m => ({ ...m, ev: evOf(m.des) }));
const LTY_M = D.LTY.missions.map(m => ({ ...m, ev: evOf(m.des) }));
const WV_M = D.WHITE_VALENTINE.groups.reduce((a, g) => a.concat(g.missions.map(m => ({ ...m, ev: evOf(m.des) }))), []);
const HAPPY_M = D.HAPPY.missions.map(m => ({ ...m, ev: evOf(m.des) }));
const BUILD_M = D.BUILDING.missions.map(m => ({ ...m, ev: m.kind === 1 ? 'login' : 'battle' }));
const CHITOS_M = D.CHITOS.tasks.map(m => ({ ...m, ev: evOf(m.des) }));
const CON_EV = { 1: 'battle', 2: 'silver', 3: 'vit', 4: 'dispatch', 5: 'gain', 6: 'miracle', 7: 'daily', 8: 'summon', 9: 'gainUR', 10: 'allTasks' };

// 任务集注册表
const MISSION_SETS = {
  1630: { defs: WT_M, name: 'wt' },
  1070: { defs: LTY_M, name: 'lty', daily: true },
  1057: { defs: WV_M, name: 'wv' },
  1417: { defs: HAPPY_M, name: 'happy', daily: true },
  1694: { defs: BUILD_M, name: 'building', dailyIds: [1] },
  1361: { defs: CHITOS_M, name: 'chitos', special: 'chitos' },
};
function msDef() { return { counters: {}, claimedM: {}, claimedR: {} }; }
const EXTRA_DEFS = {
  wt: () => ({ score: 0, counters: {}, claimedM: {}, claimedR: {}, m1Day: '' }),
  lty: () => ({ score: 0, counters: {}, claimedM: {}, claimedR: {}, day: '' }),
};

function bump(stObj, ev, n, extra) {
  if (!ev) return;
  stObj.counters[ev] = (stObj.counters[ev] || 0) + (n || 1);
  if (ev === 'gain' && extra && extra.ur) stObj.counters.gainUR = (stObj.counters.gainUR || 0) + extra.ur;
}
// 任务进度（val）
function missionVal(act, m, stObj) {
  if (act === 1630 && m.id === 1) return stObj.m1Day === localDay() ? 1 : 0;
  if (act === 1652 && m.id === 10) {
    return D.CONSTELLATION.missions.filter(x => x.id <= 9 && (stObj.counters[CON_EV[x.id]] || 0) >= x.val).length;
  }
  return stObj.counters[m.ev] || 0;
}
function missionType(m, stObj, val, unlocked) {
  if (stObj.claimedM[m.id]) return 3;
  if (unlocked === false) return 4; // 仅 1361 使用
  return val >= m.arg ? 2 : 1;
}
function getSet(act) {
  const set = MISSION_SETS[act];
  if (!set) return null;
  set.stObj = sub(set.name, EXTRA_DEFS[set.name] || msDef);
  if (set.daily) {
    // 只清每日计数与领取记录；claimedR/score 是活动累计（1070 任务每日 ↔ 1071 兑换累计共用状态）
    if (ensureDaily(set.stObj, 'day')) { set.stObj.counters = {}; set.stObj.claimedM = {}; }
  }
  return set;
}

// ---- 积分兑换注册表（ tiersFrom: 从子状态取档位表；scoreOf: 当前分数；scoreState: 档位状态）----
function pushScoreInfo(conn, act) {
  let score, rewards;
  if (act === 1630) {
    const w = sub('wt', EXTRA_DEFS.wt);
    score = [{ id: 1, val: w.score }];
    rewards = D.WORLD_TREE.rewards.concat(D.WORLD_TREE.hideRewards)
      .map(r => ({ id: r.id, val: w.claimedR[r.id] ? 3 : (w.score >= r.score ? 2 : 1) }));
  } else if (act === 1071) {
    const l = sub('lty', EXTRA_DEFS.lty);
    score = [{ id: 1, val: l.score }];
    rewards = D.LTY.rewards.map(r => ({ id: r.id, val: l.claimedR[r.id] ? 3 : (l.score >= r.score ? 2 : 1) }));
  } else if (act === 1646) {
    const ws = sub('wushan', () => ({ score: 0, claimedR: {} }));
    score = [{ id: 1, val: ws.score }];
    rewards = D.WUSHAN.rewards.map(r => ({ id: r.id, val: ws.claimedR[r.id] ? 3 : (ws.score >= r.score ? 2 : 1) }));
  } else if (act === 1741) {
    const fa = sub('fantasy', () => ({ score: 0, claimedR: {}, history: [] }));
    score = [{ id: 1, val: fa.score }];
    rewards = D.FANTASY.rewards.map(r => ({ id: r.id, val: fa.claimedR[r.id] ? 3 : (fa.score >= r.score ? 2 : 1) }));
  } else if (act === 1711) {
    const tk = L.getScore(D.POPULARITY.ticketScore), vw = L.getScore(D.POPULARITY.vowScore);
    score = [{ id: D.POPULARITY.ticketScore, val: tk }, { id: D.POPULARITY.vowScore, val: vw }];
    const p = sub('popularity', () => ({ claimedR: {} }));
    rewards = D.POPULARITY.rewards.map(r => ({ id: r.id, val: p.claimedR[r.id] ? 3 : (tk >= r.score ? 2 : 1) }));
  } else if (act === 1694) {
    const bp = L.getScore(D.BUILDING.scoreId);
    const bd = sub('building', msDef);
    score = [{ id: D.BUILDING.scoreId, val: bp }];
    rewards = D.BUILDING.rewards.map(r => ({ id: r.id, val: bd.claimedR[r.id] ? 3 : (bp >= r.score ? 2 : 1) }));
  } else if (act === 1105) {
    const da = sub('dalive', () => ({ scores: {}, select: 0, claimedR: {} }));
    score = D.DATA_ALIVE.servants.map(s => ({ id: s.scoreId, val: da.scores[s.scoreId] || 0 }));
    rewards = D.DATA_ALIVE.rewards.map(r => {
      const sv = D.DATA_ALIVE.servants.find(s => s.rewardIds.includes(r.rewardId));
      const idx = sv ? sv.rewardIds.indexOf(r.rewardId) : -1;
      const need = idx >= 0 ? D.DATA_ALIVE.thresholds[idx] : 999999;
      const val = sv ? (da.scores[sv.scoreId] || 0) : 0;
      return { id: r.rewardId, val: da.claimedR[r.rewardId] ? 3 : (val >= need ? 2 : 1) };
    });
  } else if (C2.STAR_DREAM && C2.STAR_DREAM[String(act)] && require('./activity').ACT_OPEN.some(a => a.id === act)) {
    // 动荡的时空/冬日补给站/萌新补给站（星梦通行证）：客户端 getTimeStar=scoreList 首项 → 发送 sd.scoreId；
    // rewards 物品内容在客户端 rewardsList 本地，服务端只推 {id, val:1未达成/2可领/3已领}；
    // 引擎轨（idList[1]）需已激活加速引擎（buff）才置可领，客户端领取按钮另有 getIsBuyEngine 拦截
    const sd = C2.STAR_DREAM[String(act)];
    const co = require('./collab').st();
    const eng = (co.engine && (co.engine[sd.engineAct] || co.engine[act])) ? 1 : 0;
    const sdSt = sub('sd' + act, () => ({ claimedR: {} }));
    const scoreId = sd.scoreId || 2250;
    const cr = L.getScore(scoreId);
    score = [{ id: scoreId, val: cr }];
    rewards = [];
    for (const t of sd.tiers) {
      const freeOk = cr >= t.score;
      rewards.push({ id: t.free, val: sdSt.claimedR[t.free] ? 3 : (freeOk ? 2 : 1) });
      rewards.push({ id: t.engine, val: sdSt.claimedR[t.engine] ? 3 : (eng && freeOk ? 2 : 1) });
    }
  } else {
    score = []; rewards = []; // 未映射期：客户端对空表有 nil 保护
  }
  conn.sendToc('m_act_score_exchange_info_toc', { act_id: act, score, rewards });
}
// 领取积分档通用路径：返回 {tiers, claimed, scoreOf} 或 null
function scoreSetOf(act) {
  if (act === 1630) {
    const w = sub('wt', EXTRA_DEFS.wt);
    return { tiers: D.WORLD_TREE.rewards.concat(D.WORLD_TREE.hideRewards), claimed: w.claimedR, scoreOf: () => w.score, after: () => pushScoreInfo(null, 1630) };
  }
  if (act === 1071) {
    const l = sub('lty', EXTRA_DEFS.lty);
    return { tiers: D.LTY.rewards, claimed: l.claimedR, scoreOf: () => l.score };
  }
  if (act === 1646) {
    const ws = sub('wushan', () => ({ score: 0, claimedR: {} }));
    return { tiers: D.WUSHAN.rewards, claimed: ws.claimedR, scoreOf: () => ws.score };
  }
  if (act === 1741) {
    const fa = sub('fantasy', () => ({ score: 0, claimedR: {}, history: [] }));
    return { tiers: D.FANTASY.rewards, claimed: fa.claimedR, scoreOf: () => fa.score };
  }
  if (act === 1711) {
    const p = sub('popularity', () => ({ claimedR: {} }));
    return { tiers: D.POPULARITY.rewards, claimed: p.claimedR, scoreOf: () => L.getScore(D.POPULARITY.ticketScore) };
  }
  if (act === 1694) {
    const bd = sub('building', msDef);
    return { tiers: D.BUILDING.rewards, claimed: bd.claimedR, scoreOf: () => L.getScore(D.BUILDING.scoreId) };
  }
  if (act === 1105) {
    const da = sub('dalive', () => ({ scores: {}, select: 0, claimedR: {} }));
    return {
      tiers: D.DATA_ALIVE.rewards.map(r => {
        const sv = D.DATA_ALIVE.servants.find(s => s.rewardIds.includes(r.rewardId));
        const idx = sv ? sv.rewardIds.indexOf(r.rewardId) : -1;
        return { id: r.rewardId, score: idx >= 0 ? D.DATA_ALIVE.thresholds[idx] : 999999, rw: r.rw };
      }),
      claimed: da.claimedR,
      scoreOf: r => {
        const sv = D.DATA_ALIVE.servants.find(s => s.rewardIds.includes(r.id));
        return sv ? (da.scores[sv.scoreId] || 0) : 0;
      },
    };
  }
  if (C2.STAR_DREAM && C2.STAR_DREAM[String(act)]) {
    const sd = C2.STAR_DREAM[String(act)];
    const sdSt = sub('sd' + act, () => ({ claimedR: {} }));
    const rwOf = {};
    for (const r of sd.rewards) rwOf[r.id] = r.rw;
    const tiers = [];
    for (const t of sd.tiers) {
      tiers.push({ id: t.free, score: t.score, rw: { id: rwOf[t.free][0][0], num: rwOf[t.free][0][1] }, rwList: rwOf[t.free] });
      tiers.push({ id: t.engine, score: t.score, rw: { id: rwOf[t.engine][0][0], num: rwOf[t.engine][0][1] }, rwList: rwOf[t.engine], needEngine: 1, engineAct: sd.engineAct });
    }
    const scoreId = sd.scoreId || 2250;
    return { tiers, claimed: sdSt.claimedR, scoreOf: () => L.getScore(scoreId), starDream: sd };
  }
  return null;
}

function pushMissionInfo(conn, act) {
  // 1652 星座走独立协议与配置（不在任务族注册表）
  if (act === 1652) {
    const c = sub('con', () => ({ loginDays: 0, lastDay: '', counters: {}, claimedM: {} }));
    const list = D.CONSTELLATION.missions.map(m => {
      const val = m.id === 10 ? missionVal(1652, { id: 10 }, c) : (c.counters[CON_EV[m.id]] || 0);
      const type = c.claimedM[m.id] ? 3 : (c.loginDays < m.openDay ? 0 : (val >= m.val ? 2 : 1));
      return { id: m.id, val, type };
    });
    conn.sendToc('m_constellation_mission_info_toc', {
      login: c.loginDays,
      servant: D.CONSTELLATION.servant,
      end_time: Math.floor(Date.now() / 1000) + 365 * 86400,
      list,
    });
    return;
  }
  const set = getSet(act);
  if (!set) return;
  let list;
  if (act === 1361) {
    list = chitosList();
  } else {
    list = set.defs.map(m => ({
      id: m.id,
      val: missionVal(act, m, set.stObj),
      type: missionType(m, set.stObj, missionVal(act, m, set.stObj)),
    }));
  }
  conn.sendToc('m_act_mission_info_toc', { act_id: act, mission_list: list });
}
// 小千日记：解锁数 = min(14, 2*loginDays)，且 ≥2。推导（Activity2ChitosDiaryVO.updateMission 实证）：
//  - missionInPrg = 第一个 type=4 之前的下标 = unlocked；客户端 getCurrentChapter()=missionInPrg/2
//    必须为整数（否则 getChitosTheaterID 取 chapter[x.5]=nil → 整个 toc 处理崩溃、面板永久空壳）→ unlocked 为偶数；
//  - unlocked≥2：全锁定时 showMission={missionList[-2],[-1]} → pairs(nil) 崩；
//  - 解锁遮罩分支读 missionList[missionInPrg-3]：missionInPrg≥4 时才可能进该分支，-3≥1 恒成立。
function chitosUnlockCount(ch) {
  return Math.max(2, Math.min(14, 2 * (ch.loginDays || 0)));
}
function chitosList() {
  const ch = sub('chitos', () => ({ counters: {}, claimedM: {}, loginDays: 0, lastDay: '' }));
  const unlocked = chitosUnlockCount(ch);
  const list = CHITOS_M.map(m => {
    const val = ch.counters[m.ev] || 0;
    const type = ch.claimedM[m.id] ? 3 : (m.id > unlocked ? 4 : (val >= m.arg ? 2 : 1));
    return { id: m.id, val, type };
  });
  const finalDone = CHITOS_M.every(m => ch.claimedM[m.id]);
  list.push({ id: 15, val: finalDone ? 1 : 0, type: ch.claimedM[15] ? 3 : (finalDone ? 2 : 1) });
  return list;
}

// ---- 体力消耗派生货币（每满 10 体力 +1，余数留存）----
const VIT_CURRENCIES = [
  { score: D.SPRING.scoreId, name: '灵巧' },
  { score: D.XMAS19.sockScore, name: '圣诞袜', also: D.XMAS19.sockTotal },
  { score: 2172, name: '便当' },
  { score: 2152, name: '情人节巧克力' },
  { score: 2134, name: '饼干' },
  { score: D.INFINITE_POOL.scoreId, name: '诗文断章' },
  { score: 11, name: '哔哩芯片' },   // 苍色的试炼（CfgShop[74].getWayStr：主线关卡每耗 10 体力得 1）
];
function grantVitCurrencies(conn, n) {
  const v = sub('vit', () => ({ rem: {} }));
  for (const c of VIT_CURRENCIES) {
    v.rem[c.score] = (v.rem[c.score] || 0) + n;
    const whole = Math.floor(v.rem[c.score] / 10);
    if (whole > 0) {
      v.rem[c.score] -= whole * 10;
      L.addScore(conn, c.score, whole);
      if (c.also) L.addScore(conn, c.also, whole);
    }
  }
}

// ---- 事件入口（各业务钩子调用）----
function actEvent(conn, ev, n, extra) {
  try {
    n = n || 1;
    for (const act of [1630, 1070, 1057, 1417]) {
      const set = getSet(act);
      if (ev === 'login') {
        if (act === 1630) set.stObj.m1Day = localDay();
        else bump(set.stObj, 'login', 1);
      } else bump(set.stObj, ev, n, extra);
    }
    // 每日集结 1694（id1 每日登录；EX 条目按战斗累计）
    const bd = sub('building', msDef);
    if (ev === 'login') {
      if (ensureDaily(bd, 'day')) delete bd.claimedM[1];
      bd.counters.login = (bd.counters.login || 0) + 1;
    } else if (ev === 'battle') bd.counters.battle = (bd.counters.battle || 0) + n;
    // 星座 1652（登录天数 + 累计计数）
    const c = sub('con', () => ({ loginDays: 0, lastDay: '', counters: {}, claimedM: {} }));
    if (ev === 'login') {
      if (c.lastDay !== localDay()) { c.lastDay = localDay(); c.loginDays += 1; }
    } else bump(c, ev, n, extra);
    // 小千日记 1361
    const ch = sub('chitos', () => ({ counters: {}, claimedM: {}, loginDays: 0, lastDay: '' }));
    if (ev === 'login') {
      if (ch.lastDay !== localDay()) { ch.lastDay = localDay(); ch.loginDays += 1; }
    } else bump(ch, ev, n, extra);
    // 战斗派生：巫山瑶草 / 信赖度 / 灵魂之火 2239 / 应援券 2234 / 建造点 2231
    if (ev === 'battle') {
      sub('wushan', () => ({ score: 0, claimedR: {} })).score += 10 * n;
      const da = sub('dalive', () => ({ scores: {}, select: 0, claimedR: {} }));
      // 开关关（helperSwitch=0）= 助战没参战 → 不涨信赖（与 activeAssist 同一门控）
      if (da.select && Number(da.helperSwitch) !== 0) {
        const sv = D.DATA_ALIVE.servants.find(s => s.id === da.select);
        if (sv) da.scores[sv.scoreId] = Math.min(sv.max, (da.scores[sv.scoreId] || 0) + 30 * n);
      }
      L.addScore(conn, D.FANTASY.currencyScore, 2 * n);
      L.addScore(conn, D.POPULARITY.ticketScore, 1 * n);
      L.addScore(conn, D.BUILDING.scoreId, 10 * n);
    }
    // 乐之旅途 1053 好感度任务推进（战斗推进任务5神迹演武；派遣推进任务2；曜日推进任务3）
    if (S.actFavorState) {
      if (!S.actFavorState.counters) S.actFavorState.counters = {};
      if (ev === 'battle') S.actFavorState.counters[5] = (S.actFavorState.counters[5] || 0) + n;
      if (ev === 'dispatch') S.actFavorState.counters[2] = (S.actFavorState.counters[2] || 0) + n;
      if (ev === 'dailyCopy') S.actFavorState.counters[3] = (S.actFavorState.counters[3] || 0) + n;
    }
    if (ev === 'kill') {
      const pz = sub('pz', () => ({ pieces: [], kills: 0, activeTimes: 0, actDay: '', claimedR: {} }));
      pz.kills += n;
    }
    if (ev === 'vit') {
      grantVitCurrencies(conn, n);
      // 天外来客 1741：消耗体力累计陨铁进度（fa.score），并产出活动货币 2240（陨铁）与 2239（灵魂之火）
      const fa = sub('fantasy', () => ({ score: 0, claimedR: {}, history: [], camp: 1, barrier: {} }));
      fa.score += n;
      L.addScore(conn, 2240, n);
      L.addScore(conn, 2239, n);
      // 星梦通行证 / 补给站活动（1311 动荡的时空、1325 冬日补给站、1327 萌新补给站等）：
      // 战斗中消耗体力获取对应晶石/晶体。按货币 scoreId 去重产出，激活加速引擎则享受 20%（1.2x）加成。
      const openActs = require('./activity').ACT_OPEN.map(a => a.id);
      const co = require('./collab').st();
      const scoreGroups = {}; // scoreId -> [{ actId, engineAct }]
      for (const [actStr, sd] of Object.entries(C2.STAR_DREAM || {})) {
        const actId = Number(actStr);
        if (!openActs.includes(actId)) continue;
        const sid = sd.scoreId || 2250;
        if (!scoreGroups[sid]) scoreGroups[sid] = [];
        scoreGroups[sid].push({ actId, engineAct: sd.engineAct });
      }
      for (const [sidStr, acts] of Object.entries(scoreGroups)) {
        const sid = Number(sidStr);
        const hasEngine = acts.some(a => co.engine && (co.engine[a.engineAct] || co.engine[a.actId]));
        const gain = hasEngine ? Math.round(n * 1.2) : n;
        L.addScore(conn, sid, gain);
      }
      // 糖果大作战（活动 1520 / 1090）：主线/曜日等消耗体力，每 10 体力产出 1 糖果（score 2174 / 45）；
      // 每日0点增加 200 上限，最大 1400；拥有 buff 时按 200% 效率获取并扣除 buff 次数；remain=0 时不扣 buff。
      if (S.candyState) {
        const today = localDay();
        if (S.candyState.day !== today) {
          if (!S.candyState.day) {
            S.candyState.day = today;
          } else {
            S.candyState.day = today;
            S.candyState.remain = Math.min(1400, (S.candyState.remain || 0) + 200);
          }
        }
        if (S.candyState.remain > 0) {
          S.candyState.vitRem = (S.candyState.vitRem || 0) + n;
          const baseCandy = Math.floor(S.candyState.vitRem / 10);
          if (baseCandy > 0) {
            S.candyState.vitRem -= baseCandy * 10;
            const buffAvail = S.candyState.buff_times || 0;
            const buffUsed = Math.min(buffAvail, baseCandy);
            let earned = baseCandy + buffUsed;
            earned = Math.min(earned, S.candyState.remain);
            S.candyState.remain -= earned;
            S.candyState.buff_times = Math.max(0, buffAvail - buffUsed);
            L.addScore(conn, 2174, earned);
            if (conn) {
              const aids = [1520, 1090];
              for (let i = 0; i < aids.length; i++) {
                conn.sendToc('m_act_children_day_info_toc', {
                  act_id: aids[i],
                  remain: S.candyState.remain,
                  rare_reward: S.candyState.rare || [],
                  protect_times: S.candyState.protect_times || 0,
                  buff_times: S.candyState.buff_times || 0,
                });
              }
            }
          }
        }
      }
    }
    // collab 三活动任务桥（cond 8/9/14/16/7/68/69/70 → activity.advanceMissions collab 分支）
    require('./collab').collabMissionEvent(conn, ev, n);
    // 尘封的高塔 1008：登录天数（上限 60，解锁门槛 60）
    if (ev === 'login') {
      const vv = sub('vivian', () => ({ days: 59, unlocked: false, claimed: true }));
      if (!vv.unlocked) vv.days = Math.min(60, vv.days + 1);
    }
    // 二周年抽奖 1649：每日任务计数（战斗 20 / 金币 5000）
    {
      const tw = sub('twann', twannDef);
      if (tw.counterDay !== localDay()) { tw.counters = {}; tw.counterDay = localDay(); }
      if (ev === 'battle') tw.counters.battle = (tw.counters.battle || 0) + n;
      else if (ev === 'silver') tw.counters.silver = (tw.counters.silver || 0) + n;
    }
    saveState();
    if (conn) {
      pushMissionInfo(conn, 1630); pushMissionInfo(conn, 1070); pushMissionInfo(conn, 1057);
      pushMissionInfo(conn, 1417); pushMissionInfo(conn, 1694); pushMissionInfo(conn, 1361);
      pushMissionInfo(conn, 1652);
      // ⚠️ 星梦通行证（1107/1311/1325/1327）由体力消耗（L.addScore）驱动，
      // 详情数据由客户端打开面板按需拉取（m_act_score_exchange_info_tos），不在此处盲发广播
    }
  } catch (e) {
    log('!! actEvent 失败', e.message);
  }
}

// 登录主动推送（信赖培养助手列表：Activity2DataALivePanel 读死 act 1105）
function pushDailyLuckDrawInfo(conn, actId) {
  if (!conn) return;
  conn.sendToc('m_daily_luck_draw_info_toc', { act_id: Number(actId) || 1649, ...twannInfo() });
}

function onLoginPushes(conn) {
  // 累计签到族（1782 海神彼岸/1422 情人/1026/1765）：客户端永不请求 info_tos，VO 只靠本推送填充
  try {
    pushAccumInfo(conn);
  } catch (e) { /* 忽略 */ }
  // 加速引擎 buff（shop 3 购买/GM 激活）：客户端 updateBuyEngine 读 buffHash（buff_type=3, type=engineActID）
  try {
    const buffs = require('./collab').engineBuffs();
    if (buffs.length) conn.sendToc('m_role_buff_update_toc', { buffs });
  } catch (e) { /* 忽略 */ }
  // 二周年抽奖 1649：登录即推送参与奖与任务状态，防止客户端冷启动打开时 TwoAnnLuDrawVO 为空崩溃
  try {
    pushDailyLuckDrawInfo(conn, 1649);
  } catch (e) { /* 忽略 */ }
  const da = sub('dalive', () => ({ scores: {}, select: 0, claimedR: {} }));
  conn.sendToc('m_act_helper_info_toc', {
    act_id: 1105,
    // 布阵面板助战开关的真实状态（m_act_favor_helper_tos 落盘）；缺省（老档/从未切过）=1 开。
    // 客户端 CopyPlanPanel.togHelp.IsOn 与小地图头像都以此为准——发 1 会把玩家关掉的开关"复活"。
    switch: Number(da.helperSwitch) === 0 ? 0 : 1,
    list: D.DATA_ALIVE.servants.map(s => ({ id: s.id, skin_id: s.skinId, lv: 1, exp: 0, pl: 1 })),
    select: da.select,
  });
}

// ---- 累计签到族（1782 海神彼岸 / 1422 情人 / 1026 苍色 / 1765）----
// 客户端链路（Activity2LoginView/ActivitySignVO 反编译实证）：
//   info_toc → ActivityMgr.initSigns 填 VO → 面板 onGUI 读 getActSignVO(actID)：
//   todayCanSign()=VO.isTodayCanSign=(status==SIGN_SATE_NONE=0) 为真才自动发 sign_tos。
// ⚠️ 客户端从不发送 m_role_accumulative_info_tos（全量字节码零调用点，仅 ActivityModule 里有定义），
//    VO 只能由服务端推送填充——不推则签到面板空列表、todayCanSign() 恒 false、永不自动签到
//    （2026-10-07 用户报障"海神彼岸无法正常完成签到"的根因）。推送点：登录 onLoginPushes +
//    activity.js m_role_acts_tos（ActivityPanel.onOpen 每次打开面板都发它，顺带刷新跨天会话的过期 VO）。
function accumSignTables() {
  const s = st();
  return Object.keys(D.ACCUM).map(id => {
    const a = (s.accum && s.accum[id]) || { days: 0, lastDay: '' };
    return {
      id: Number(id),
      days: a.days,
      rewards: D.ACCUM[id].map((r, i) => ({ id: i + 1, val: r.num, type: r.type })),
      // status: SIGN_SATE_NONE=0 → 客户端打开面板时自动补签（官方行为）；表已签满也报 1，
      // 防客户端每天开面板对已完成的表空转补签
      status: (a.lastDay === localDay() || a.days >= D.ACCUM[id].length) ? 1 : 0,
      remain_day: 0,
    };
  });
}
function pushAccumInfo(conn) {
  if (!conn) return;
  conn.sendToc('m_role_accumulative_info_toc', { sign_tables: accumSignTables() });
}

module.exports = {
  pushDailyLuckDrawInfo,
  pushAccumInfo,
  handlers: {
    m_role_accumulative_info_tos(conn) {
      pushAccumInfo(conn);
    },
    m_role_accumulative_sign_tos(conn, obj) {
      const id = Number(obj && obj.id) || 0;
      const conf = D.ACCUM[id];
      if (!conf) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
      const s = st();
      if (!s.accum) s.accum = {};
      const a = s.accum[id] || (s.accum[id] = { days: 0, lastDay: '' });
      if (a.lastDay !== localDay() && a.days < conf.length) {
        a.days += 1;
        a.lastDay = localDay();
        const r = conf[a.days - 1];
        // 誓灵大奖显示用物品形态 31836002（=30000000+1836002，CfgItems 在册可渲染；裸 1836002
        // 不在 CfgItems，ActivitySignItemVO→getItemVO 返回 nil 配置 VO，列表渲染到该格即崩），
        // 发放按真身 1836002 走 grantServant 入队
        if (r.type === 31836002) require('./collab').grantServant(conn, 1836002); // 签到第 7 天=33（SR 誓灵）
        else grant(conn, [r]);
        saveState();
        log(`[act] 累计签到 ${id} 第 ${a.days} 天：${r.type}×${r.num}`);
      }
      conn.sendToc('m_role_accumulative_sign_toc', { id, days: a.days });
    },

    // ==== 通用活动任务族（1630/1070/1057/1417/1694/1361）====
    m_act_mission_info_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      pushMissionInfo(conn, act);
    },
    m_get_act_mission_reward_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      const id = Number(obj && obj.id) || 0;
      const set = getSet(act);
      if (!set) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
      // 小千日记：最终奖（id15）与解锁校验
      if (act === 1361) {
        const ch = set.stObj;
        const unlocked = chitosUnlockCount(ch);
        const m = CHITOS_M.find(x => x.id === id);
        if (id === 15) {
          const finalDone = CHITOS_M.every(x => ch.claimedM[x.id]);
          if (!finalDone || ch.claimedM[15]) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
          grant(conn, [{ id: D.CHITOS.finalReward, num: 1 }]);
          ch.claimedM[15] = 1;
          saveState();
          conn.sendToc('m_get_act_mission_reward_toc', { act_id: act, id });
          pushMissionInfo(conn, act);
          return;
        }
        if (!m || ch.claimedM[id] || id > unlocked || (ch.counters[m.ev] || 0) < m.arg) {
          log(`[act] 小千日记领取被拒 id=${id} unlocked=${unlocked}`);
          conn.sendToc('m_common_reply_toc', { proto_id: 0 });
          return;
        }
        grant(conn, [{ id: m.rwItem, num: m.rwNum }]);
        ch.claimedM[id] = 1;
        saveState();
        conn.sendToc('m_get_act_mission_reward_toc', { act_id: act, id });
        pushMissionInfo(conn, act);
        return;
      }
      const m = set.defs.find(x => x.id === id);
      if (!m || !m.rw || set.stObj.claimedM[id] || missionVal(act, m, set.stObj) < m.arg) {
        log(`[act] 任务领取被拒 act=${act} id=${id}`);
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      grantRW(conn, m.rw);
      set.stObj.claimedM[id] = 1;
      // 任务奖励即积分货币的活动：同步入账
      if (act === 1630 && m.rw.id === 60000033) set.stObj.score += m.rw.num;
      if (act === 1070 && m.rw.id === 60000032) set.stObj.score += m.rw.num;
      saveState();
      conn.sendToc('m_get_act_mission_reward_toc', { act_id: act, id });
      pushMissionInfo(conn, act);
      if (act === 1630) pushScoreInfo(conn, 1630);
      if (act === 1070) pushScoreInfo(conn, 1071);
      log(`[act] 任务领取 act=${act} id=${id} → ${m.rw.id}×${m.rw.num}`);
    },

    // ==== 积分兑换族（1630/1071/1646/1741/1711/1694/1105）====
    m_act_score_exchange_info_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      // ⚠️ 未下发的星梦通行证族 act 绝不能回本 toc：客户端 initActScoreInfo 对 actIdList 内的 act
      // 无条件调 getStarDreamPermitInfoReward → isOpenAct=false 时返回 nil → 取 .rewardsList 崩
      //（真机 2026-09-13 登录报错实证）。只回静默 common_reply（重置 1 秒网络计时器）
      if (C2.STAR_DREAM && C2.STAR_DREAM[String(act)] && !require('./activity').ACT_OPEN.some(a => a.id === act)) {
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      pushScoreInfo(conn, act);
    },
    m_get_act_score_exchange_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      const id = Number(obj && obj.id) || 0;
      const set = scoreSetOf(act);
      if (!set) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
      const t = set.tiers.find(x => x.id === id);
      const cur = t ? (typeof set.scoreOf === 'function' && set.scoreOf.length ? set.scoreOf(t) : set.scoreOf()) : 0;
      if (!t || set.claimed[id] || cur < t.score) {
        log(`[act] 积分领取被拒 act=${act} id=${id} score=${cur} need=${t ? t.score : '?'}`);
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      const coEng = require('./collab').st().engine;
      if (t.needEngine && !(coEng && (coEng[t.engineAct] || coEng[act]))) {
        log(`[act] 积分领取被拒（加速引擎未激活）act=${act} id=${id}`);
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      if (t.rwList && t.rwList.length > 1) grant(conn, t.rwList.map(x => ({ id: x[0], num: x[1] })));
      else grantRW(conn, t.rw);
      set.claimed[id] = 1;
      saveState();
      conn.sendToc('m_get_act_score_exchange_toc', { act_id: act, id });
      pushScoreInfo(conn, act);
      log(`[act] 积分领取 act=${act} id=${id}（${cur}/${t.score}）`);
    },
    m_get_all_exchange_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      const set = scoreSetOf(act);
      if (!set) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
      const ids = [];
      const co = require('./collab').st();
      for (const t of set.tiers) {
        const cur = set.scoreOf.length ? set.scoreOf(t) : set.scoreOf();
        if (!set.claimed[t.id] && cur >= t.score) {
          if (t.needEngine && !(co.engine && (co.engine[t.engineAct] || co.engine[act]))) continue;
          if (t.rwList && t.rwList.length > 1) grant(conn, t.rwList.map(x => ({ id: x[0], num: x[1] })));
          else grantRW(conn, t.rw);
          set.claimed[t.id] = 1;
          ids.push(t.id);
        }
      }
      if (ids.length) saveState();
      conn.sendToc('m_get_all_exchange_toc', { act_id: act, ids });
      pushScoreInfo(conn, act);
    },

    // ==== 希腊探索/誓灵频道 1652（星座任务；客户端面板实际发送本协议）====
    m_constellation_mission_info_tos(conn) {
      pushMissionInfo(conn, 1652);
    },
    m_get_constellation_mission_reward_tos(conn, obj) {
      const id = Number(obj && obj.id) || 0;
      const choice = Number(obj && obj.choice) || 0;
      const c = sub('con', () => ({ loginDays: 0, lastDay: '', counters: {}, claimedM: {} }));
      const m = D.CONSTELLATION.missions.find(x => x.id === id);
      if (!m || c.claimedM[id] || c.loginDays < m.openDay) {
        log(`[act] 星座领取被拒 id=${id} login=${c.loginDays}`);
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      if (id === 10) {
        // 第 10 天二选一：1=看板誓灵（阿波罗） 2=史莱喵道具；要求 9 个日常任务全部达标
        if (missionVal(1652, { id: 10 }, c) < 9 || ![1, 2].includes(choice)) {
          conn.sendToc('m_common_reply_toc', { proto_id: 0 });
          return;
        }
        if (choice === 1) {
          const sv = require('./servant');
          const csBrief = sv.makeServantBrief(D.CONSTELLATION.servant);
          // 非法 type（已记日志）：不入列不推送，避免毒化客户端类型计数表 → 祭坛名气榜崩
          if (!csBrief) {
            log(`[act] 星座第10天选择：誓灵 type=${D.CONSTELLATION.servant} 非法，改为发放道具`);
            grant(conn, [{ id: D.CONSTELLATION.choice2Item, num: 1 }]);
          } else {
            require('./servant').grantServantBrief(csBrief);
            sv.pushServantsBrief(conn);
            log(`[act] 星座第10天选择：获得誓灵 ${D.CONSTELLATION.servant}`);
          }
        } else {
          grant(conn, [{ id: D.CONSTELLATION.choice2Item, num: 1 }]);
          log('[act] 星座第10天选择：获得史莱喵道具');
        }
      } else {
        if ((c.counters[CON_EV[id]] || 0) < m.val) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
        grant(conn, [{ id: m.rwItem, num: m.rwNum }]);
      }
      c.claimedM[id] = 1;
      saveState();
      conn.sendToc('m_get_constellation_mission_reward_toc', { id, choice });
    },

    // ==== 恋爱×告白 1046（巧克力=score 27；1 心动=20 巧克力；100 满档发告白信）====
    m_valentines_info_tos(conn, obj) {
      const v = sub('valentine', () => ({ servant: 0, hearts: 0, tiers: {}, maxed: [] }));
      conn.sendToc('m_valentines_info_toc', {
        servant_id: v.servant,
        hearts: v.hearts,
        maxed_servant_types: v.maxed,
        is_guide: (obj && obj.is_guide) || 0,
      });
    },
    m_valentines_choose_tos(conn, obj) {
      const sid = Number(obj && obj.servant_id) || 0;
      const v = sub('valentine', () => ({ servant: 0, hearts: 0, tiers: {}, maxed: [] }));
      // 客户端 getServant(id).skinID 无保护：只接受自己拥有的誓灵
      if (!sid || !S.servants.find(x => x.id === sid)) {
        log(`[act] 告白选人被拒 id=${sid}`);
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      v.servant = sid;
      v.hearts = 0;
      v.tiers = {}; // 换人重来，档位奖励重置（每只誓灵独立拿一轮）
      saveState();
      conn.sendToc('m_valentines_choose_toc', { servant_id: sid });
    },
    m_valentines_gift_tos(conn, obj) {
      const amount = Math.max(0, Number(obj && obj.amount) || 0);
      const v = sub('valentine', () => ({ servant: 0, hearts: 0, tiers: {}, maxed: [] }));
      if (!v.servant || amount < 1) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
      const cost = amount * D.VALENTINE.heartsPerGift;
      if (L.getScore(D.VALENTINE.chocScore) < cost) {
        log(`[act] 巧克力不足：需 ${cost} 有 ${L.getScore(D.VALENTINE.chocScore)}`);
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      L.addScore(conn, D.VALENTINE.chocScore, -cost);
      v.hearts = Math.min(D.VALENTINE.maxHearts, v.hearts + amount);
      for (const t of D.VALENTINE.rewards) {
        if (!v.tiers[t.id] && v.hearts >= t.active) {
          v.tiers[t.id] = 1;
          grant(conn, [t.rw]);
        }
      }
      if (v.hearts >= D.VALENTINE.maxHearts && !v.maxed.includes(v.servant)) v.maxed.push(v.servant);
      saveState();
      conn.sendToc('m_valentines_gift_toc', { hearts: v.hearts, maxed_servant_types: v.maxed });
      log(`[act] 告白送礼 ×${amount} → 心动 ${v.hearts}，扣巧克力 ${cost}`);
    },

    // ==== 花咲樱月 1058（曲奇=score 34；任务在 1057 走任务族）====
    m_white_valentine_score_tos(conn) {
      const w = sub('wv', msDef);
      const score = L.getScore(D.WHITE_VALENTINE.cookieScore);
      conn.sendToc('m_white_valentine_score_toc', {
        score,
        rewards: D.WHITE_VALENTINE.rewards.map(r => ({ id: r.id, val: w.claimedR ? w.claimedR[r.id] ? 3 : (score >= r.score ? 2 : 1) : (score >= r.score ? 2 : 1) })),
      });
    },
    m_get_white_valentine_tos(conn, obj) {
      const id = Number(obj && obj.id) || 0;
      const w = sub('wv', () => ({ counters: {}, claimedM: {}, claimedR: {} }));
      const t = D.WHITE_VALENTINE.rewards.find(x => x.id === id);
      const score = L.getScore(D.WHITE_VALENTINE.cookieScore);
      if (!t || w.claimedR[id] || score < t.score) {
        log(`[act] 白情领取被拒 id=${id} score=${score}`);
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      grant(conn, t.rw);
      w.claimedR[id] = 1;
      saveState();
      conn.sendToc('m_get_white_valentine_toc', { id });
      log(`[act] 白情兑换 id=${id}（曲奇 ${score}/${t.score}）`);
    },

    // ==== 乞巧佳节 1624（灵巧=score 55；签到里程碑自动补领）====
    m_act_prize_info_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      const sp = sub('spring', () => ({ days: 0, lastDay: '', pending: [], claimedSign: {}, got: {} }));
      if (sp.lastDay !== localDay()) {
        sp.lastDay = localDay();
        sp.days += 1;
        for (const s of D.SPRING.signList) {
          if (sp.days === s.day && !sp.claimedSign[s.day]) sp.pending.push(s.day);
        }
        saveState();
      }
      conn.sendToc('m_act_prize_info_toc', {
        act_id: act,
        got_list: Object.keys(sp.got).map(Number),
        activity_flag: 1,
        days: sp.days,
        pending_rewards: sp.pending,
      });
    },
    m_act_prize_get_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      const pid = Number(obj && obj.prize_id) || 0;
      const sp = sub('spring', () => ({ days: 0, lastDay: '', pending: [], claimedSign: {}, got: {} }));
      const t = D.SPRING.prizes.find(x => x.id === pid);
      const score = L.getScore(D.SPRING.scoreId);
      if (!t || sp.got[pid] || score < t.score) {
        log(`[act] 祈福领取被拒 prize=${pid} 灵巧=${score}`);
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      grant(conn, t.rw);
      sp.got[pid] = 1;
      saveState();
      conn.sendToc('m_act_prize_get_toc', { act_id: act, prize_id: pid });
      log(`[act] 祈福领取 prize=${pid}（灵巧 ${score}/${t.score}）`);
    },
    m_act_prize_sign_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      const sp = sub('spring', () => ({ days: 0, lastDay: '', pending: [], claimedSign: {}, got: {} }));
      const days = sp.pending.slice();
      for (const d of days) {
        const s = D.SPRING.signList.find(x => x.day === d);
        if (s && !sp.claimedSign[d]) {
          grant(conn, [s.rw]);
          sp.claimedSign[d] = 1;
        }
      }
      sp.pending = [];
      saveState();
      conn.sendToc('m_act_prize_sign_toc', { act_id: act, reward_days: days });
      if (days.length) log(`[act] 祈福签到里程碑发放：${days.join(',')}`);
    },

    // ==== 圣诞活动 1034（礼盒=score 22 / 雪球=score 21；每票 2 礼盒；单机 NPC 榜）====
    m_christmas_banner_tos(conn) {
      conn.sendToc('m_christmas_banner_toc', {
        christmas_box: L.getScore(D.CHRISTMAS.boxScore),
        snowball: L.getScore(D.CHRISTMAS.snowScore),
      });
    },
    m_christmas_servant_rank_tos(conn) {
      const rows = xmasRows().slice(0, 20).map((r, i) => ({ ranking: i + 1, servant_type_id: r.id, ticket_num: r.votes }));
      conn.sendToc('m_christmas_servant_rank_toc', { can_vote: 1, rows, christmas_box: L.getScore(D.CHRISTMAS.boxScore) });
    },
    m_christmas_servant_support_tos(conn, obj) {
      const sid = Number(obj && obj.servant_type_id) || 0;
      const x = sub('xmas', () => ({ votes: {}, myVotes: {} }));
      const mine = x.myVotes[sid] || 0;
      const rows = [
        { ranking: 1, role_id: L.roleId, role_name: S.roleName, ticket_num: mine },
        ...D.CHRISTMAS.voters.slice(0, 4).map((n, i) => ({ ranking: i + 2, role_id: 9000000 + i, role_name: n, ticket_num: Math.max(0, (x.votes[sid] || 0) - mine) })),
      ];
      conn.sendToc('m_christmas_servant_support_toc', { ticket_num: mine, rank: 1, rows });
    },
    m_christmas_my_vote_tos(conn) {
      const x = sub('xmas', () => ({ votes: {}, myVotes: {} }));
      const total = Object.values(x.myVotes).reduce((a, b) => a + b, 0);
      const rows = Object.entries(x.myVotes)
        .sort((a, b) => b[1] - a[1])
        .map(([id, v], i) => ({ ranking: i + 1, servant_type_id: Number(id), ticket_num: v, percentage: Math.floor(v * 10000 / Math.max(1, total)) }));
      conn.sendToc('m_christmas_my_vote_toc', { ticket_num: total, rows });
    },
    m_christmas_role_tos(conn) {
      const x = sub('xmas', () => ({ votes: {}, myVotes: {} }));
      conn.sendToc('m_christmas_role_toc', {
        rows: [], // p_rank_row 渲染字段不完整会崩，本地服只报自己的汇总
        reward_type: 1,
        rank: 1,
        my_ticket: Object.values(x.myVotes).reduce((a, b) => a + b, 0),
      });
    },
    m_christmas_vote_tos(conn, obj) {
      const sid = Number(obj && obj.servant_type_id) || 0;
      const n = Math.max(0, Number(obj && obj.ticket_num) || 0);
      const reply = () => conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      if (!n || n > 100 || !SERVANT_PHYLE[sid]) { log(`[act] 圣诞投票被拒 sid=${sid} n=${n}`); return reply(); }
      const cost = n * D.CHRISTMAS.voteCost;
      if (L.getScore(D.CHRISTMAS.boxScore) < cost) { log(`[act] 圣诞礼盒不足：需 ${cost}`); return reply(); }
      L.addScore(conn, D.CHRISTMAS.boxScore, -cost);
      const x = sub('xmas', () => ({ votes: {}, myVotes: {} }));
      x.votes[sid] = (x.votes[sid] || 0) + n;
      x.myVotes[sid] = (x.myVotes[sid] || 0) + n;
      saveState();
      conn.sendToc('m_christmas_vote_toc', { christmas_box: L.getScore(D.CHRISTMAS.boxScore), servant_type_id: sid, ticket_num: n });
      log(`[act] 圣诞投票 ${sid} ×${n}，扣礼盒 ${cost}`);
    },

    // ==== 元旦拼图 1735（碎片=活跃达标 1/日 + 击杀 100/个）====
    m_act_puzzle_info_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      conn.sendToc('m_act_puzzle_info_toc', puzzleInfo(act));
    },
    m_act_puzzle_active_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      const id = Number(obj && obj.id) || 0;
      const pz = puzzleState();
      if (id >= 1 && id <= D.PUZZLE.grids && !pz.pieces.includes(id) && puzzleNum(pz) > 0) {
        pz.pieces.push(id);
        saveState();
        log(`[act] 拼图激活格 ${id}（已激活 ${pz.pieces.length}/${D.PUZZLE.grids}）`);
      } else {
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      conn.sendToc('m_act_puzzle_active_toc', { act_id: act });
      conn.sendToc('m_act_puzzle_info_toc', puzzleInfo(act));
    },
    m_act_puzzle_get_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      const id = Number(obj && obj.id) || 0;
      const pz = puzzleState();
      const t = D.PUZZLE.rewards.find(x => x.id === id);
      if (!t || pz.claimedR[id] || pz.pieces.length < t.need) {
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      grant(conn, t.rw);
      pz.claimedR[id] = 1;
      saveState();
      conn.sendToc('m_act_puzzle_get_toc', { act_id: act, id, nth: Number(obj && obj.nth) || 1 });
      conn.sendToc('m_act_puzzle_info_toc', puzzleInfo(act));
      log(`[act] 拼图奖励 id=${id}`);
    },

    // ==== 新春抽奖 1415（复读机周年：展示 + 每日 19 点后首查开奖）====
    m_repeater_anniversary_info_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      const rp = sub('repeater', () => ({ startDay: '', days: [], notify: 1 }));
      const today = localDay();
      if (!rp.startDay) rp.startDay = today;
      // 开奖：每天 19 点后首次查询结算一次（本地服单人：自己中奖领红包）
      const hour = new Date().getHours();
      if (hour >= 19 && (!rp.lastDraw || rp.lastDraw !== today)) {
        rp.lastDraw = today;
        rp.days.push({ timestamp: Math.floor(Date.now() / 1000), role_names: [S.roleName] });
        grant(conn, [{ id: 30000000, num: 50 }]); // 红包水晶×50
        log('[act] 复读机开奖：水晶×50');
      }
      const nth = Math.max(1, Math.min(8, Math.round((Date.now() - new Date(rp.startDay + 'T00:00:00')) / 86400000) + 1));
      const next = new Date(); next.setHours(hour >= 21 ? 19 : 19, 0, 0, 0);
      if (hour >= 19) next.setDate(next.getDate() + 1);
      conn.sendToc('m_repeater_anniversary_info_toc', {
        act_id: act,
        date_nth: nth,
        next_time: Math.floor(next.getTime() / 1000),
        is_notify: rp.notify,
        list: rp.days.slice(-8),
      });
      saveState();
    },
    m_repeater_anniversary_remind_tos(conn, obj) {
      const rp = sub('repeater', () => ({ startDay: '', days: [], notify: 1 }));
      rp.notify = Number(obj && obj.boolint) || 0;
      saveState();
      conn.sendToc('m_repeater_anniversary_remind_toc', { act_id: Number(obj && obj.act_id) || 0, boolint: rp.notify });
    },

    // ==== 古籍转译 1701（无限池；诗文断章=score 2230；每池 8 种物品，抽完/过池进下一池）====
    m_infinite_pool_info_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      conn.sendToc('m_infinite_pool_info_toc', poolInfo(act));
    },
    m_infinite_pool_reward_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      const times = Math.max(1, Math.min(10, Number(obj && obj.times) || 1));
      const pl = sub('pool', () => ({ pool: 0, items: {}, drawn: {}, drawnByPool: {} }));
      if (!pl.drawnByPool) pl.drawnByPool = {}; // 旧存档补默认
      const def = D.INFINITE_POOL.pools[pl.pool];
      const cost = times * D.INFINITE_POOL.price;
      const remain = Object.values(pl.items).reduce((a, b) => a + b, 0);
      if (!def || remain <= 0 || L.getScore(D.INFINITE_POOL.scoreId) < cost) {
        log(`[act] 无限池抽取被拒 times=${times}`);
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      const real = Math.min(times, remain);
      L.addScore(conn, D.INFINITE_POOL.scoreId, -real * D.INFINITE_POOL.price);
      const items = [];
      for (let i = 0; i < real; i++) {
        // 按剩余量加权随机
        const bag = [];
        for (const g of def.items) {
          const left = (pl.items[g.id] ?? g.num) - (pl.drawn[g.id] || 0);
          for (let k = 0; k < left; k++) bag.push(g.id);
        }
        if (!bag.length) break;
        const pick = bag[Math.floor(Math.random() * bag.length)];
        pl.drawn[pick] = (pl.drawn[pick] || 0) + 1;
        items.push(pick);
        grant(conn, [{ id: pick, num: 1 }]);
      }
      saveState();
      conn.sendToc('m_infinite_pool_reward_toc', { act_id: act, items });
      log(`[act] 无限池抽取 ${real} 次：${items.join(',')}`);
      conn.sendToc('m_infinite_pool_info_toc', poolInfo(act));
    },
    m_infinite_pool_next_tos(conn, obj) {
      const act = Number(obj && obj.act_id) || 0;
      const pl = sub('pool', () => ({ pool: 0, items: {}, drawn: {}, drawnByPool: {} }));
      if (!pl.drawnByPool) pl.drawnByPool = {}; // 旧存档补默认
      if (pl.pool < D.INFINITE_POOL.pools.length - 1) {
        // 离池前留存该池大奖已抽数：sp_detail 改为全池下发后需要每池历史（poolInfo 只读）
        pl.drawnByPool[pl.pool] = pl.drawn[D.INFINITE_POOL.pools[pl.pool].sp_items[0]] || 0;
        pl.pool += 1;
        pl.items = {};
        pl.drawn = {};
        saveState();
        log(`[act] 无限池进入第 ${pl.pool + 1} 池`);
      }
      // next_toc 必须回声 act_id：客户端收到后会拿它重发 info_tos，回 0 会多出一条 act_id=0 的
      // info_toc（修复后无害，但属脏数据）
      conn.sendToc('m_infinite_pool_next_toc', { act_id: act });
      conn.sendToc('m_infinite_pool_info_toc', poolInfo(act));
    },

    // ==== 天外来客 1741/1742（活动主线地图 + 上贡：灵魂之火 score 2239 → 陨铁（兑换积分））====
    m_fantasy_info_tos(conn, obj) {
      const fa = sub('fantasy', () => ({ score: 0, claimedR: {}, history: [], camp: 1, barrier: {} }));
      const FD = require('../data/fantasy_data');
      if (!fa.barrier) fa.barrier = {};
      // 确保天使与恶魔两方全部 10 关卡均注册在 barrier 中（解除日期与首关灰锁限制）
      for (const bid of FD.ANGEL_STAGE_IDS.concat(FD.DEMON_STAGE_IDS)) {
        if (fa.barrier[bid] == null) fa.barrier[bid] = 0;
      }
      const barrier = Object.entries(fa.barrier).map(([id, val]) => ({ id: Number(id), val: Number(val) }));
      const camp = fa.camp === 2 ? 2 : 1;
      const firstStage = camp === 1 ? 1742010100 : 1742011600;
      const nowCopy = (S.mapState && S.mapState.barrierId && fa.barrier[S.mapState.barrierId] != null)
        ? S.mapState.barrierId + 1
        : firstStage + 1;
      conn.sendToc('m_fantasy_info_toc', {
        angel: 50000,
        demon: 50000,
        win_side: 0,
        camp: camp,
        opt: 1,
        barrier,
        now_copy: nowCopy,
        change_time: 99, // 解除每日 1 次切换阵营限制，随时可换
        win_time: 0,
      });
      log(`[act] 下发天外来客信息 camp=${camp} barriers=${barrier.length}`);
    },
    m_fantasy_change_camp_tos(conn, obj) {
      const camp = Number(obj && obj.camp) || 1;
      const fa = sub('fantasy', () => ({ score: 0, claimedR: {}, history: [], camp: 1, barrier: {} }));
      fa.camp = (camp === 2 ? 2 : 1);
      saveState();
      conn.sendToc('m_fantasy_change_camp_toc', { camp: fa.camp });
      log(`[act] 天外来客阵营切换为 ${fa.camp === 1 ? '天使' : '恶魔'}`);
    },
    m_fantasy_casino_info_tos(conn) {
      conn.sendToc('m_fantasy_casino_info_toc', { limit: 10, history: fantasyHistory() });
    },
    m_fantasy_casino_invest_tos(conn, obj) {
      const camp = Number(obj && obj.camp) || 0;
      const num = Math.max(0, Number(obj && obj.num) || 0);
      const fa = sub('fantasy', () => ({ score: 0, claimedR: {}, history: [] }));
      const today = fantasyToday(fa);
      if (!camp || camp > D.FANTASY.altars.length || num < 1 || L.getScore(D.FANTASY.currencyScore) < num || today.vote + num > 10) {
        log(`[act] 上贡被拒 camp=${camp} num=${num}`);
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      L.addScore(conn, D.FANTASY.currencyScore, -num);
      today.camp = camp;
      today.vote += num;
      today.score[camp - 1] += num;
      const back = Math.floor(num * 0.5);
      today.give_back += back;
      fa.score += back;
      saveState();
      conn.sendToc('m_fantasy_casino_invest_toc', { camp, num });
      log(`[act] 上贡 camp=${camp} ×${num} → 陨铁 +${back}`);
      conn.sendToc('m_fantasy_casino_info_toc', { limit: 10, history: fantasyHistory() });
    },

    // ==== 信赖培养 1164（面板写死 act 1105）====
    m_act_helper_select_tos(conn, obj) {
      const da = sub('dalive', () => ({ scores: {}, select: 0, claimedR: {} }));
      da.select = Number(obj && obj.select) || 0;
      saveState();
      conn.sendToc('m_act_helper_select_toc', { act_id: Number(obj && obj.act_id) || 1105, select: da.select });
    },

    // ==== 圣诞往事 1711 投票面板（最小可用：静态榜 + 回显投票）====
    m_love_vote_info_tos(conn, obj) {
      conn.sendToc('m_love_vote_info_toc', {
        act_id: Number(obj && obj.act_id) || 0,
        vote_servants: xmasRows().slice(0, 5).map(r => ({ id: r.id, val: r.votes })),
        end_time: Math.floor(Date.now() / 1000) + 30 * 86400,
      });
    },
    m_love_vote_vote_tos(conn, obj) {
      const sid = Number(obj && obj.servant_type) || 0;
      const n = Math.max(1, Number(obj && obj.num) || 1);
      if (!SERVANT_PHYLE[sid]) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
      const x = sub('xmas', () => ({ votes: {}, myVotes: {} }));
      x.votes[sid] = (x.votes[sid] || 0) + n;
      x.myVotes[sid] = (x.myVotes[sid] || 0) + n;
      saveState();
      conn.sendToc('m_love_vote_vote_toc', { act_id: Number(obj && obj.act_id) || 0, servant_type: sid, num: n });
    },
    m_love_vote_rank_info_tos(conn, obj) {
      conn.sendToc('m_love_vote_rank_info_toc', {
        act_id: Number(obj && obj.act_id) || 0,
        rows: xmasRows().slice(0, 20).map((r, i) => ({ ranking: i + 1, servant_type: r.id, ticket: r.votes })),
        refresh_time: Math.floor(Date.now() / 1000),
      });
    },
    m_love_vote_self_vote_tos(conn, obj) {
      const sid = Number(obj && obj.servant_type) || 0;
      const x = sub('xmas', () => ({ votes: {}, myVotes: {} }));
      const mine = x.myVotes[sid] || 0;
      const endRanks = xmasRows().slice(0, 10).map((r, i) => ({ id: i + 1, val: r.id, type: r.votes }));
      conn.sendToc('m_love_vote_self_vote_toc', { act_id: Number(obj && obj.act_id) || 0, servant_type: sid, ticket: mine, end_ranks: endRanks });
    },

    // ==== 首充奖励 1003（本地服白送：state 1=可领 → 领取 → 2=已领）====
    m_first_pay_info_tos(conn) {
      const fp = sub('firstpay', () => ({ claimed: false }));
      conn.sendToc('m_first_pay_info_toc', { state: fp.claimed ? 2 : 1 });
    },
    m_first_pay_get_tos(conn) {
      const fp = sub('firstpay', () => ({ claimed: false }));
      if (!fp.claimed) {
        grant(conn, [{ id: 30000000, num: 300 }, { id: 20000000, num: 5 }, { id: 21001000, num: 1 }]);
        fp.claimed = true;
        saveState();
        log('[act] 首充奖励发放（水晶300/秩序之契5/遗物箱1）');
      }
      conn.sendToc('m_first_pay_get_toc', {});
    },

    // ==== 尘封的高塔 1008（登录 60 天解锁 → 任务链；解锁奖励发放时已含任务奖）====
    m_vivian_info_tos(conn) {
      const vv = sub('vivian', () => ({ days: 59, unlocked: false, claimed: true }));
      conn.sendToc('m_vivian_info_toc', {
        status: vv.unlocked ? 2 : 1,
        days: vv.days,
        mission_num: 1,
        mission_id: vv.unlocked ? 30000 : 0,
        counter: vv.unlocked ? 1 : 0,
        mission_status: vv.unlocked ? 1 : 0, // 1=HAS_GET（解锁奖励已在解锁时发放）
      });
    },
    m_vivian_unlock_tos(conn) {
      const vv = sub('vivian', () => ({ days: 59, unlocked: false, claimed: true }));
      if (!vv.unlocked && vv.days >= 60) {
        grant(conn, [{ id: 21002000, num: 2 }, { id: 30000000, num: 100 }]);
        vv.unlocked = true;
        saveState();
        log('[act] 尘封的高塔解锁：遗物箱×2 + 水晶×100');
      }
      // m_vivian_unlock_toc 无 schema（fire-and-forget），靠重推 info 刷新
      this.m_vivian_info_tos(conn);
    },

    // ==== 二周年抽奖 1649（每日任务 → 每日参与奖；14 天封顶）====
    m_daily_luck_draw_info_tos(conn, obj) {
      pushDailyLuckDrawInfo(conn, obj && obj.act_id);
    },
    m_daily_luck_draw_result_tos(conn, obj) {
      const tw = twannState();
      const base = Math.floor(new Date(tw.lastDay + 'T00:00:00').getTime() / 1000) - (tw.days - 1) * 86400;
      const result = [];
      for (let d = 1; d <= tw.days; d++) {
        result.push({ timestamp: base + (d - 1) * 86400, list: [{ type: 2, roles: [{ id: L.roleId, val: S.roleName }] }] });
      }
      conn.sendToc('m_daily_luck_draw_result_toc', { act_id: Number(obj && obj.act_id) || 0, result });
    },
    m_daily_luck_draw_reward_tos(conn) {
      const tw = twannState();
      const rewards = tw.rewards.map(r => {
        if (r.type === 0) { grant(conn, [{ id: r.id, num: r.val }]); return { id: r.id, val: r.val, type: 1 }; }
        return { ...r };
      });
      tw.rewards = rewards;
      saveState();
      conn.sendToc('m_daily_luck_draw_reward_toc', { rewards });
      log(`[act] 二周年抽奖领取 ${rewards.filter(r => r.type === 1).length} 项`);
    },

    // ==== 挑战关卡 1706（七日挑战：面板 + 战斗接入，战斗复用当前地图点，胜利记通关）====
    m_copy_straight_info_tos(conn, obj) {
      const sv = sub('seventh', () => ({ pass: {} }));
      const barrier = [];
      for (let day = 1; day <= 7; day++) {
        const id = 1706001000 + day;
        barrier.push({
          id,
          pass: sv.pass[id] || 0,
          first_reward: sv.pass[id] ? 1 : 0,
          open_time: Math.floor(Date.now() / 1000) - 86400 * 7, // 全部已开放（本地服不等 7 天）
          open: 1,
        });
      }
      conn.sendToc('m_copy_straight_info_toc', { act_id: Number(obj && obj.act_id) || 0, barrier });
    },
    // ==== 少女终末旅行 1360/1365 ====
    m_unmapped_copy_info_tos(conn, obj) {
      const actId = Number(obj && obj.act_id) || 0;
      if (actId !== 1360) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
      pushGlastInfo(conn);
    },
    m_unmapped_copy_unlock_tos(conn, obj) {
      const g = glastState();
      const id = Number(obj && obj.id) || 0;
      if (id && !g.theaters.includes(id)) g.theaters.push(id);
      saveState();
      conn.sendToc('m_unmapped_copy_unlock_toc', { act_id: Number(obj && obj.act_id) || 1360, id });
      pushGlastInfo(conn);
      log('[glast] 剧场节点解锁 ' + id);
    },
    // lever 面板 onOpen 必发；**必须实现**——此前落到通用兜底回 {now_copy:0}，
    // 客户端 CopyMgr.europeNowCopyPoint 被冲成 0（curPoint=0）→ 每次开面板都只显示"选择队伍"、进度永远不动
    m_unmapped_copy_state_tos(conn, obj) {
      const actId = Number(obj && obj.act_id) || 0;
      if (actId === 1742 || actId === 1431) {
        const fa = sub('fantasy', () => ({ score: 0, claimedR: {}, history: [], camp: 1, barrier: {} }));
        const camp = fa.camp === 2 ? 2 : 1;
        const firstStage = camp === 1 ? 1742010100 : 1742011600;
        const base = (S.mapState && S.mapState.barrierId && fa.barrier && fa.barrier[S.mapState.barrierId] != null)
          ? S.mapState.barrierId
          : firstStage;
        const nowCopy = base + 1; // 1742010101 (第 1 战斗点，curPoint = nowCopy % 10 = 1，显示"开始探索")
        conn.sendToc('m_unmapped_copy_state_toc', { act_id: actId, now_copy: nowCopy, skin: 0 });
        log(`[act] 天外来客 lever 状态 actId=${actId} now_copy=${nowCopy}`);
        return;
      }
      if (actId !== 1360) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
      conn.sendToc('m_unmapped_copy_state_toc', { act_id: 1360, now_copy: glastNowCopy(glastState()), skin: 0 });
    },
    m_copy_act_batch_info_tos(conn, obj) {
      const actId = Number(obj && obj.act_id) || 0;
      if (actId !== 1365) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
      pushGlastBatch(conn);
    },
    // 撤退（lever 面板"撤退"）：释放出战队伍 + 清该关战斗进度（"后续再次进入将会重新开启"）；
    // 首通记录 g.main 保留
    m_unmapped_copy_quit_tos(conn, obj) {
      const actId = Number(obj && obj.act_id) || 1360;
      if (actId === 1742 || actId === 1431) {
        if (S.mapState) {
          try { require('./servant').pushTeamReset(conn); } catch (e) { /* 忽略 */ }
          S.mapState = null;
          saveState();
        }
        conn.sendToc('m_unmapped_copy_quit_toc', { act_id: actId, barrier_id: 0 });
        log('[act] 天外来客撤退探索');
        return;
      }
      const MF = require('./map_fight');
      const base = (S.mapState && G.MAPS[S.mapState.barrierId]) ? S.mapState.barrierId : 0;
      if (base) {
        const meta = G.MAPS[String(base)].actCopy;
        // 释放队伍必须在清 mapState 之前（pushTeamReset 读 S.mapState.use_team_ids）
        try { require('./servant').pushTeamReset(conn); } catch (e) { /* 忽略 */ }
        // 按"关底同组"清（含旧版写入的 base 战斗点，避免陈旧记录被当成已清步数）
        const prog = MF.progressOf(base);
        prog.cleared = (prog.cleared || []).filter(id => Math.floor(Number(id) / 10) * 10 !== Number(base));
        S.mapState = null;
        saveState();
      }
      conn.sendToc('m_unmapped_copy_quit_toc', { act_id: actId, barrier_id: base || glastNowCopy(glastState()) });
      log('[glast] 撤退探索（act=' + actId + ' stage=' + base + '）');
    },
  },
  actEvent: actEvent,
  onLoginPushes: onLoginPushes,
  pushScoreInfo: pushScoreInfo,
  pushMissionInfo: pushMissionInfo,
  pushGlastInfo: pushGlastInfo,
  pushGlastBatch: pushGlastBatch,
  settleGlastTour: settleGlastTour,
  settleFantasy: settleFantasy,
  glastNormalRemain: glastNormalRemain,
  glastMainEntryOk: glastMainEntryOk,
  glastStageOf: glastStageOf,
  glastNextFight: glastNextFight,
  glastPushEnter: glastPushEnter,
  gmGive: gmGive,
  actReset: actReset,
};
    // ==== 少女终末旅行 1360/1365（**非探索小地图**：lever 面板「选择队伍→出击」→ init_barrier_toc +
    // m_copy_fight_prepare_toc 直接进布阵；**绝不推 m_map_enter_toc** —— 1360 不在 CopyConst.COPY_TYPE_MAP，
    // CfgCopy.mapID="10020" 只是战斗背景层 key，客户端没有 CfgMap_10020，
    // AdventureMgr.setMapData 索引 nil 会卡死；见工作日志 2026-09-12 六十二）====
// 关卡树 CfgActCopy.GLastTourInfo（21 主线+3 周回+4 剧场）；每关 3 个战斗点（客户端 CfgCopy 只有 base/+1/+5）。
// 面板数据：m_unmapped_copy_info_toc{act_id:1360, spec_data:单对象 p_unmap_barrier}（barriers.id=copyId，
// 剧场不发——copyId=0 不入客户端索引，完成态由本地 TheaterMgr 判定）；
// now_copy = 当前关下一个未击败战斗点 copy_id（lever 面板 curPoint=now_copy%10 → 0/1/5）；
// 连战数据 m_copy_act_batch_info_toc{act_id:1365}。
// 战斗：战斗点开战走标准 m_copy_fight_tos（战斗点 copy_id 命中 mapCfg().waves）→ onBattleWon 认 cfg.actCopy
// 走 settleGlastTour 钩子（不进地图推进分支）→ 小千日记任务由 actEvent('battle') 联动。
const GLAST_NORMAL_MAX = G.NORMAL_TIMES_MAX; // 30
function glastDef() {
  return { main: {}, normal: {}, normalTick: 0, theaters: [] };
}
function glastState() {
  const g = sub('glast', glastDef);
  if (!g.normalTick) { g.normalTick = Math.floor(Date.now() / 1000); }
  return g;
}
function normalRemain(g, copyId) {
  return g.normal[copyId] != null ? g.normal[copyId] : GLAST_NORMAL_MAX;
}
// 周回每小时 +1（封顶 30）
function refundNormal(g) {
  const now = Math.floor(Date.now() / 1000);
  const hours = Math.floor((now - g.normalTick) / 3600);
  if (hours > 0) {
    g.normalTick += hours * 3600;
    for (const st of G.STAGES) {
      if (st.type !== 'normal') continue;
      const r = normalRemain(g, st.copyId);
      g.normal[st.copyId] = Math.min(GLAST_NORMAL_MAX, r + hours);
    }
  }
}
// 主线 canFight：前置关全部已通关（g.main[前置copyId]>0）
function mainCanFight(g, stage) {
  for (const pre of stage.condition) {
    const preStage = G.STAGES.find(s => s.id === pre);
    if (preStage && !(g.main[preStage.copyId] > 0)) return false;
  }
  return true;
}
function glastBarriers(g) {
  // barriers[].id = copyId（客户端 getGLastTourVObyCopy 按 copyId 索引）；剧场不发（本地判定）
  const barriers = [];
  for (const st of G.STAGES) {
    if (st.type === 'main') {
      barriers.push({ id: st.copyId, val: g.main[st.copyId] || 0, type: mainCanFight(g, st) ? 1 : 0 });
    } else if (st.type === 'normal') {
      barriers.push({ id: st.copyId, val: normalRemain(g, st.copyId), type: 1 });
    }
  }
  return barriers;
}
// 关卡的战斗点 copy_id 归属：stageBase = 关底 copyId，战斗点 ∈ {base, base+1, base+5}
// （客户端 CfgCopy/CfgCopyDetail 每关只有这三项；-5 是 BOSS，bossInfos[base] 挂在第 5 根拉杆）
function glastStageOf(copyId) {
  const base = Math.floor(Number(copyId) / 100) * 100;
  const cfg = G.MAPS[String(base)];
  return cfg && cfg.actCopy ? { base, cfg, meta: cfg.actCopy } : null;
}
// 关卡进度：idx = 已清战斗点数（0..total，= lever 面板 curPoint），next = 下一个未击败战斗点
// justCleared = 结算钩子里刚打完、进度尚未落账的那个点
function glastStageProgress(meta, justCleared) {
  const progressOf = require('./map_fight').progressOf;
  const cleared = (progressOf(meta.copyId).cleared || []).map(Number);
  const fights = (meta.fights || []).map(Number);
  let idx = fights.findIndex(id => !cleared.includes(id));
  if (idx < 0) idx = fights.length;                       // 全清
  else if (justCleared && Number(justCleared) === fights[idx]) idx += 1;
  return { idx, total: fights.length, next: idx < fights.length ? fights[idx] : 0 };
}
// 下一个未击败战斗点（0 = 本关已全清）
function glastNextFight(meta, justCleared) {
  return glastStageProgress(meta, justCleared).next;
}
// 当前探索点（lever 面板 curPoint = now_copy % 10）：进行中（或首个未通关主线）关的 关底+已清步数。
// 0（未开始）→「选择队伍」；1..4 →「开始探索/继续探索」；5 → 打完 BOSS（客户端不再重开 lever 面板）。全通 → 0
function glastNowCopy(g, justCleared) {
  const inStage = S.mapState && G.MAPS[S.mapState.barrierId];
  if (inStage && inStage.actCopy && inStage.actCopy.type === 'main') {
    const p = glastStageProgress(inStage.actCopy, justCleared);
    if (p.idx < p.total) return inStage.actCopy.copyId + p.idx;
  }
  for (const st of G.STAGES) {
    if (st.type !== 'main') continue;
    if (g.main[st.copyId] > 0) continue;
    const p = glastStageProgress(G.MAPS[String(st.copyId)].actCopy, justCleared);
    if (p.idx < p.total) return st.copyId + p.idx;
  }
  return 0; // 全通
}
// 进入本关：推 m_unmapped_copy_enter_toc —— 客户端据此设置 CopyMgr.nowProgressCopyID(1360)
// （GLastTourMainItem.toMainBattale 靠它拦"已经进入其他活动副本"，否则中途开别的关的 lever 面板会串关）
// 与 europeNowCopyPoint（curPoint 立即刷新）。
function glastPushEnter(conn, base) {
  const stage = glastStageOf(base);
  if (!stage || stage.meta.type !== 'main') return;
  conn.sendToc('m_unmapped_copy_enter_toc', {
    act_id: 1360,
    barrier_id: stage.base,
    now_copy: glastNowCopy(glastState(), 0),
    skin: 0,
  });
}
// 结束本关探索（通关/撤退）：清客户端的 nowProgressCopyID + europeNowCopyPoint（quit_toc 客户端分支）
function glastPushQuit(conn, base) {
  conn.sendToc('m_unmapped_copy_quit_toc', { act_id: 1360, barrier_id: base });
}
function pushGlastInfo(conn, justCleared) {
  const g = glastState();
  refundNormal(g);
  conn.sendToc('m_unmapped_copy_info_toc', {
    act_id: 1360,
    opt: 0,
    now_copy: glastNowCopy(g, justCleared),
    spec_type: '',
    // spec_data 声明 array<binary> 但客户端 updateGLastTourVO 直取 spec_data.barriers（单对象，tag 104）
    spec_data: { __nestedProto: 'p_unmap_barrier', barriers: glastBarriers(g), multi: 1 },
  });
}
function pushGlastBatch(conn) {
  const g = glastState();
  refundNormal(g);
  const nextHour = (Math.floor(Date.now() / 3600000) + 1) * 3600;
  const copy = G.STAGES.filter(s => s.type === 'normal')
    .map(st => ({ id: st.copyId, val: normalRemain(g, st.copyId), type: nextHour }));
  conn.sendToc('m_copy_act_batch_info_toc', { act_id: 1365, copy });
}
// 周回入场门（map_fight init_barrier 调用）：剩余次数
function glastNormalRemain(copyId) {
  const g = glastState();
  refundNormal(g);
  return normalRemain(g, copyId);
}
// 主线入场门（map_fight init_barrier 调用）：解锁链 + 单次关已通
function glastMainEntryOk(copyId) {
  const g = glastState();
  const stage = G.STAGES.find(s => s.copyId === copyId);
  if (!stage) return false;
  if (!mainCanFight(g, stage)) return false;
  if (stage.times === 1 && (g.main[copyId] || 0) >= 1) return false;
  return true;
}
// 结算钩子（map_fight.onBattleWon 认 cfg.actCopy 调用，**不替换主流程**：地图推进/节点击败照常）
// st.copyId = 本节点 waveId；节点掉落 + 主线 boss 首清（计数/首通货）+ 周回次数扣减 + 推送 + 小千日记联动
function settleGlastTour(conn, st, cfg) {
  const meta = cfg.actCopy;
  const g = glastState();
  const batch = Math.max(1, Number(st.glastBatch) || 1); // 周回连战 N：奖励 ×N
  const pool = (meta.reward || []).slice();
  const drops = [];
  for (let i = 0; i < 3 * batch && pool.length; i++) {
    const j = Math.floor(Math.random() * pool.length) % pool.length;
    drops.push({ type: pool.splice(j, 1)[0], num: 1 });
  }
  st.itemRewards = drops; // pushFightResult 的 p_reward 下发（主流程不覆盖该字段）
  let stageCleared = false;
  if (meta.type === 'main') {
    // 战斗点 base+5 = BOSS：打完本关即通关（客户端 nowCopyId%10==5 → 不再重开 lever 面板）
    if (Number(st.copyId) === Number(cfg.bossPoint) && !(g.main[meta.copyId] > 0)) {
      g.main[meta.copyId] = 1;
      stageCleared = true;
      if (meta.firstReward) {
        grantMissionRewards(conn, [[meta.firstReward, 1]]);
        log('[glast] ' + meta.name + ' 首通奖励：' + meta.firstReward + 'x1');
      }
    }
  } else {
    g.normal[meta.copyId] = Math.max(0, normalRemain(g, meta.copyId) - batch);
  }
  saveState();
  // justCleared：本战斗点尚未落进 cleared（主流程在钩子返回后才记），推送时显式跳过
  pushGlastInfo(conn, st.copyId);
  if (meta.type === 'normal') pushGlastBatch(conn);
  // 释放出战队伍：该活动没有"小地图会话"来收尾，不主动释放客户端的 CopyMgr.nowTeamList 会残留
  // → 选队伍面板点谁都是"该队伍正在战斗中"（真机 2026-09-12 反馈）
  try { require('./servant').pushTeamReset(conn); } catch (e) { /* 忽略 */ }
  // 本关通关：清客户端 nowProgressCopyID(1360)，否则下一关的节点点击会被拦成"已经进入其他活动副本~"
  if (stageCleared) glastPushQuit(conn, meta.copyId);
  // 小千日记"通关任意活动关卡10次"任务联动（actEvent battle 会重推各任务族 info）
  actEvent(conn, 'battle', 1, null);
  log('[glast] 战斗点结算 ' + (meta.name || meta.copyId) + ' copy=' + st.copyId + ' 连战x' + batch + '：掉落 ' + drops.map(d => d.type).join(','));
}

// ---- 天外来客 1742 战斗胜利结算 ----
function settleFantasy(conn, st, cfg) {
  const meta = cfg.actCopy;
  const fa = sub('fantasy', () => ({ score: 0, claimedR: {}, history: [], camp: 1, barrier: {} }));
  if (!fa.barrier) fa.barrier = {};

  // 1. 掉落结算：从 stage_drop_data.js 读取真实掉落
  const drops = require('../data/stage_drop_data').rollStageDrops(st.copyId, true);
  st.itemRewards = drops;

  // 2. 推进该关卡进度：
  const baseId = meta.copyId;
  const oldVal = fa.barrier[baseId] || 0;
  const newVal = Math.min(100, oldVal + 100);
  fa.barrier[baseId] = newVal;

  // 首通奖励发放
  if (oldVal < 100 && newVal >= 100 && meta.firstReward) {
    grantMissionRewards(conn, [[meta.firstReward, 1]]);
    log(`[act] 天外来客 ${meta.name} 首通奖励：${meta.firstReward}x1`);
  }

  saveState();

  // 3. 释放出战队伍与清除战斗状态
  try { require('./servant').pushTeamReset(conn); } catch (e) { /* 忽略 */ }
  conn.sendToc('m_unmapped_copy_quit_toc', { act_id: 1742, barrier_id: baseId });

  // 4. 联动任务事件
  actEvent(conn, 'battle', 1, null);
  log(`[act] 天外来客关卡结算 base=${baseId} copy=${st.copyId} val=${newVal}`);
}

// ---- GM 测试指令 ----
const GM_KEYS = {
  choco: { kind: 'score', id: 27, name: '巧克力（告白）' },
  cookie: { kind: 'score', id: 34, name: '牛油花曲奇' },
  lingqiao: { kind: 'score', id: 55, name: '灵巧' },
  sock: { kind: 'score', id: () => D.XMAS19.sockScore, also: () => D.XMAS19.sockTotal, name: '圣诞袜' },
  box: { kind: 'score', id: 22, name: '圣诞礼盒' },
  snow: { kind: 'score', id: 21, name: '雪球' },
  fire: { kind: 'score', id: () => D.FANTASY.currencyScore, name: '灵魂之火' },
  ticket: { kind: 'score', id: () => D.POPULARITY.ticketScore, name: '应援券' },
  verse: { kind: 'score', id: () => D.INFINITE_POOL.scoreId, name: '诗文断章' },
  build: { kind: 'score', id: () => D.BUILDING.scoreId, name: '建造点' },
  choco2: { kind: 'score', id: 2152, name: '情人节巧克力' },
  lunch: { kind: 'score', id: 2172, name: '便当' },
  wushan: { kind: 'wushan', name: '瑶草' },
  meteor: { kind: 'meteor', name: '陨铁' },
  trust: { kind: 'trust', name: '信赖度' },
  puzzle: { kind: 'puzzle', name: '拼图碎片' },
  bili: { kind: 'score', id: 11, name: '哔哩芯片' },
  lamp: { kind: 'score', id: 40, name: '灯泡' },
  battery: { kind: 'score', id: 41, name: '旧式部件' },
  star: { kind: 'score', id: 2250, name: '时间晶体' },
};
function gmGive(conn, key, n) {
  const g = GM_KEYS[key];
  if (!g) { log('[GM] m21_act_give 未知货币 ' + key + '（可选：' + Object.keys(GM_KEYS).join('/') + '）'); return false; }
  if (g.kind === 'score') {
    const id = typeof g.id === 'function' ? g.id() : g.id;
    L.addScore(conn, id, n);
    if (g.also) L.addScore(conn, g.also(), n);
  } else if (g.kind === 'wushan') {
    sub('wushan', () => ({ score: 0, claimedR: {} })).score += n;
  } else if (g.kind === 'meteor') {
    sub('fantasy', () => ({ score: 0, claimedR: {}, history: [] })).score += n;
  } else if (g.kind === 'trust') {
    const da = sub('dalive', () => ({ scores: {}, select: 0, claimedR: {} }));
    for (const s of D.DATA_ALIVE.servants) da.scores[s.scoreId] = Math.min(s.max, (da.scores[s.scoreId] || 0) + n);
  } else if (g.kind === 'puzzle') {
    const pz = sub('pz', () => ({ pieces: [], kills: 0, activeTimes: 0, actDay: '', claimedR: {} }));
    pz.kills += 100 * n;
  }
  saveState();
  log('[GM] 活动货币 ' + g.name + ' +' + n);
  return true;
}
function actReset(conn) {
  st();
  S.actExtraState = {};
  saveState();
  log('[GM] 活动扩展状态已清空');
}
// ---- 二周年抽奖 1649 内部助手 ----
function twannDef() {
  return { days: 0, lastDay: '', startDay: '', rewards: [], counters: {}, counterDay: '' };
}
function twannState() {
  const tw = sub('twann', twannDef);
  const today = localDay();
  if (!tw.startDay) { tw.startDay = today; tw.lastDay = today; tw.days = 1; tw.rewards.push({ id: 20016002, val: 20, type: 0 }); }
  // 跨天结算：每天一笔参与奖（20016002×20），最多 14 天
  while (tw.lastDay !== today && tw.days < 14) {
    const d = new Date(tw.lastDay + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    tw.lastDay = localDay(d);
    tw.days += 1;
    tw.rewards.push({ id: 20016002, val: 20, type: 0 });
  }
  if (tw.counterDay !== today) { tw.counters = {}; tw.counterDay = today; }
  return tw;
}
function twannInfo() {
  const tw = twannState();
  return {
    process: [
      { id: 1, val: Math.min(20, tw.counters.battle || 0) },
      { id: 2, val: Math.min(5000, tw.counters.silver || 0) },
    ],
    status: 0,
    rewards: tw.rewards,
  };
}

// ---- 拼图/无限池/上贡的内部助手 ----
function puzzleState() {
  const pz = sub('pz', () => ({ pieces: [], kills: 0, activeTimes: 0, actDay: '', claimedR: {} }));
  // 每日活跃 ≥70 → 今日 1 块（借任务系统的当日活跃度）
  if (pz.actDay !== localDay() && (S.missionState.dailyActivity || 0) >= 70) {
    pz.actDay = localDay();
    pz.activeTimes += 1;
    saveState();
  }
  return pz;
}
function puzzleNum(pz) {
  return pz.activeTimes + Math.floor(pz.kills / 100) - pz.pieces.length;
}
function puzzleInfo(act) {
  const pz = puzzleState();
  return {
    act_id: act,
    puzzle_list: pz.pieces.slice(),
    reward_list: D.PUZZLE.rewards.map(r => ({
      id: r.id,
      items: r.rw.map(x => ({ id: x.id, val: x.num })),
      need_puzzle: r.need,
      state: pz.claimedR[r.id] ? 2 : (pz.pieces.length >= r.need ? 1 : 0),
    })),
    puzzle_num: Math.max(0, puzzleNum(pz)),
    kill_num: pz.kills,
    activity_times: pz.activeTimes,
  };
}
function xmasRows() {
  const x = sub('xmas', () => ({ votes: {}, myVotes: {} }));
  const merged = D.CHRISTMAS.rank.map(r => ({ id: r.id, votes: r.votes + (x.votes[r.id] || 0) }));
  for (const [id, v] of Object.entries(x.votes)) {
    if (!merged.find(r => r.id === Number(id))) merged.push({ id: Number(id), votes: v });
  }
  merged.sort((a, b) => b.votes - a.votes);
  return merged;
}
function poolInfo(act) {
  const pl = sub('pool', () => ({ pool: 0, items: {}, drawn: {}, drawnByPool: {} }));
  if (!pl.drawnByPool) pl.drawnByPool = {}; // 旧存档补默认
  const def = D.INFINITE_POOL.pools[pl.pool] || D.INFINITE_POOL.pools[0];
  if (!Object.keys(pl.items).length && !Object.keys(pl.drawn).length) {
    for (const g of def.items) pl.items[g.id] = g.num;
  }
  const list = def.items.map(g => {
    const drawn = pl.drawn[g.id] || 0;
    return { id: g.id, val: drawn, type: g.num };
  });
  // ★ sp_detail 必须全池下发（每池一条、pool 字段=1..N 密集），不能只发当前池：
  //   客户端 ActivityInfinitePoolVO.fillData 以 bigItems[sp_detail[].pool]=ItemVO 建表后
  //   Util.sortOn(bigItems)（比较器裸 a[key]，无 nil 保护）。LuaJIT 对"空表后赋 [2]=v"求 #t
  //   得 2（洞在下标 1），table.sort 会把 nil 喂进比较器 → "Core/Utils/Util:0: attempt to
  //   index a nil value"。一池 {[1]=v} #=1、三池 {[3]=v} #=0 均不触发，二池 info_toc 必崩
  //   （2026-10-29 真机日志星陨若尘 01:34:00 两连崩；lupa luajit21 实测复现）。
  const spDetail = D.INFINITE_POOL.pools.map((pdef, i) => {
    const spItem = pdef.sp_items[0];
    const total = (pdef.items.find(g => g.id === spItem) || {}).num || 1;
    const drawn = i === pl.pool ? (pl.drawn[spItem] || 0) : (pl.drawnByPool[i] || 0);
    return { item_id: spItem, num: drawn, total, pool: i + 1 };
  });
  return {
    act_id: act,
    pool_id: pl.pool + 1,
    score_id: D.INFINITE_POOL.scoreId,
    price: D.INFINITE_POOL.price,
    next_open: pl.pool < D.INFINITE_POOL.pools.length - 1 ? 1 : 0,
    sp_detail: spDetail,
    list,
    sp_items: def.sp_items,
    can_pass_after_sp: 0,
  };
}
function fantasyToday(fa) {
  const todayTs = Math.floor(new Date(localDay() + 'T00:00:00').getTime() / 1000);
  let t = fa.history.find(h => h.date === todayTs);
  if (!t) {
    t = { date: todayTs, score: [0, 0, 0], camp: 1, vote: 0, give_back: 0 };
    fa.history.push(t);
    if (fa.history.length > 14) fa.history.shift();
  }
  return t;
}
function fantasyHistory() {
  const fa = sub('fantasy', () => ({ score: 0, claimedR: {}, history: [] }));
  fantasyToday(fa); // 确保今日条目存在（客户端只从今日条目读占比，缺了会除零）
  return fa.history;
}
