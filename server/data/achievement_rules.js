// 成就规则引擎：rule.kind → 进度值。快照类从 S 现算，累计类读 achvState.counters。
// 客户端事实：进度完全由服务端下发（p_achievement.cur_progress/total_progress/state），
// state 1=可领 2=已领 3=未达成（AchievementConst.STATE_*）。
'use strict';
const { S } = require('../state');
const FC = require('./fight_core');
const A = require('./altar_data');

// 组合收集名单（13002/13004 的"等"官方未列全 → 设计值，见工作日志成就条目）
const COMBO_LISTS = {
  13001: [1131006, 1141007],                     // 史莱喵 + 黄金史莱喵
  13002: [1436004, 1421006, 1436039],            // 哈迪斯 + 海德拉 + 塔纳托斯
  13003: [1514010, 1511011],                     // 魑魅 + 魍魉
  13004: [1046002, 1534003, 1331003, 1042001],   // 芬里尔 + 蚩尤 + 八岐大蛇 + 洛基
  13005: [1431002, 1331003],                     // 狄俄尼索斯 + 八岐大蛇
  13006: [1116008, 1331006],                     // 哥布林 + 雪女
  13007: [1116008],                              // 3 只哥布林（按持有实例数）
};
const SLIME_TYPES = [1131006, 1141007];

const ownedTypes = () => {
  const s = new Set();
  for (const b of S.servants) s.add(Number(b.type));
  return s;
};
// 收集口径 = 获得过的誓灵（图鉴 actives；狂化条目 = 1e8+本体，过滤）
const collectedTypes = () => {
  const s = new Set();
  const act = (S.handbookState && S.handbookState.actives) || {};
  for (const k of Object.keys(act)) {
    const t = Number(k);
    if (t < 100000000) s.add(t);
  }
  // 图鉴缺登的兜底：当前持有的也算
  for (const b of S.servants) s.add(Number(b.type));
  return s;
};

function progressOf(a) {
  const r = a.rule;
  const C = (S.achvState && S.achvState.counters) || {};
  switch (r.kind) {
    case 'collect':
      return collectedTypes().size;
    case 'collectNature': {
      let n = 0;
      for (const t of collectedTypes()) if (FC.natureOf(t) === r.nature) n++;
      return n;
    }
    case 'collectCamp': {
      let n = 0;
      for (const t of collectedTypes()) if (A.campOf(t) === r.camp) n++;
      return n;
    }
    case 'collectCombo': {
      const list = COMBO_LISTS[r.combo] || [];
      if (r.combo === 13007) {
        // "收集3只哥布林" = 持有 3 个实例
        return S.servants.filter(b => list.includes(Number(b.type))).length;
      }
      const own = ownedTypes();
      return list.filter(t => own.has(t)).length;
    }
    case 'maxHit':
      return Number(C.maxHit) || 0;
    case 'kills':
      return Number(C.kills) || 0;
    case 'killsNature':
      return Number((C.killsNature || {})[r.nature]) || 0;
    case 'stageClearTimes':
      return Number((C.barrierClears || {})[r.barrier]) || 0;
    case 'slimeClear':
      return Number((C.slimeClears || {})[r.barrier]) || 0;
    case 'dareDmg':
      return Number((C.dareDamage || {})[r.slot]) || 0;
    case 'dareChapter': {
      // 该章全部 BOSS 均已战胜
      const DD = require('./dare_data');
      const ch = DD.CHAPTERS.find(c => c.chapter === r.chapter);
      if (!ch) return 0;
      const def = new Set((S.dareState && S.dareState.defeated) || []);
      return ch.bossArr.every(b => def.has(b)) ? 1 : 0;
    }
    case 'evolve': {
      const own = ownedTypes();
      const hit = new Set();
      for (const b of S.servants) {
        if (Number(b.star) >= r.star) {
          if (a.title.includes('不同')) hit.add(Number(b.type));
          else hit.add(b.id);
        }
      }
      // 无"不同"字样的按类型去重更符合"收集"语义（1名誓灵进化X星 = 该类型当前星级≥X）
      if (!a.title.includes('不同')) {
        const types = new Set();
        for (const b of S.servants) if (Number(b.star) >= r.star) types.add(Number(b.type));
        return types.size;
      }
      void own;
      return hit.size;
    }
    case 'energyMax': {
      // 能源提升最大 = 六项上限全满（sum=90，面板"能源满"同口径）
      const ids = new Set();
      for (const b of S.servants) {
        const ceils = Object.values(b.energy_ceils || {});
        const sum = ceils.reduce((x, y) => x + Number(y), 0);
        if (sum >= 90) ids.add(Number(b.type));
      }
      return ids.size;
    }
    case 'break': {
      const ids = new Set();
      for (const b of S.servants) if (Number(b.overstep) >= r.times) ids.add(Number(b.type));
      return ids.size;
    }
    case 'level': {
      const ids = new Set();
      for (const b of S.servants) if (Number(b.level) >= r.level) ids.add(Number(b.type));
      return ids.size;
    }
    case 'dispatch':
      return Number(C.dispatch) || 0;
    case 'dailyMission':
      return Number(C.dailyMission) || 0;
    case 'weeklyMission':
      return Number(C.weeklyMission) || 0;
    case 'slimeLevel': {
      const ids = new Set();
      for (const b of S.servants) {
        if (SLIME_TYPES.includes(Number(b.type)) && Number(b.level) >= r.level) ids.add(Number(b.type));
      }
      return ids.size;
    }
    case 'building':
      // total_progress = 目标等级 → cur_progress 直接回当前建筑等级（itemOf 里 min 截断）
      return Number((S.dormState && S.dormState.buildings && S.dormState.buildings[r.building]) || 0);
    case 'roleLevel':
      return Number(S.roleAsset.level) || 1;
    case 'urlessStreak':
      return Number(C.urlessStreak) || 0;
    case 'tenPullUR':
      return Number(C.tenPullURMax) || 0;
    case 'summons':
      return Number(C.summons) || 0;
    case 'friendPoints':
      return Number(C.friendPoints) || 0;
    case 'familyContribution':
      return Number(C.familyContribution) || 0;
    case 'feelingCamp': {
      // 4000「将三个高天原的誓灵羁绊值提升到100点」→ 奖励主题道具 40000000 = 协会主题 2 唯一获取渠道
      //（协会清单 E-1，2026-11-07；口径=持有的该阵营实例按 per-instance feeling 计数，与羁绊页同源）
      let n = 0;
      for (const b of S.servants) {
        if (A.campOf(Number(b.type)) === r.camp && (Number(b.feeling) || 0) >= r.feeling) n++;
      }
      return n;
    }
    case 'prosperity':
      // 4001「将协会繁荣度提升至200」→ 头像框 41000002；与协会 detail/排行榜同源（单点：dorm.furnitureProsperity）
      return require('../handlers/dorm').furnitureProsperity() || 0;
    default:
      return 0; // 'none'：无限领域/神迹演武/信仰/爵位/主题场景/活动
  }
}

module.exports = { progressOf, COMBO_LISTS, SLIME_TYPES };
