// 自律派遣（tab6 / m_copy_auto_*）的离线战斗引擎 —— **纯逻辑**：
//   只读存档（S.servants / S.bagGoods / S.formations），不碰 conn、不推 toc、不写盘、不发奖。
// 这样 reward 时可以先算完全部结果再一次性发奖，中途崩溃不会留下"发了一半"的存档。
//
// 复用（不重造战斗规则，避免与主线漂移）：
//   · 我方单位 = map_fight.mkAllyUnit（主线口径：核心/信仰/圣器/祭坛/元素/阵型全在）
//   · 敌方单位 = map_fight.mkEnemyUnit（直接用关卡 waves 原始数值）
//   · 逐回合   = tower_fight.resolveRound（唯一已是纯函数的回合解析器，塔里已跑通）
//   · 录像条目 = tower_fight.unitToc（与塔回放同形状，客户端 FightRecordInfoVO 直接播）
//
// ⚠️ 刻意**不**用"假 conn 驱动真 map_fight handler"（smoke_stage 那套）：结算路径会
//    saveState / grantServantBrief（D7 fame 毒化源）/ advanceMissions / 写 mapProgress /
//    二次扣体力 —— 600 场等于把主线结算跑 600 遍。详见 调研-自律派遣.md §5.2。
const { S } = require('../state');
const { log, ROLE_LEVEL, TRAIN } = require('../lib');
const { MAP_CONFIGS } = require('../data/map_configs');
const { getStageDetail, rollStageDrops } = require('../data/stage_drop_data');
const { relicBonusOf } = require('../data/relic_data');
const FC = require('../data/fight_core');
const { buildFormation } = require('./servant');
const { effectOfSlot } = require('../data/lineup_data');
const T = require('./tower_fight');   // resolveRound / unitToc
const MF = require('./map_fight');    // mkAllyUnit / mkEnemyUnit

const FIGHT_MAX_ROUND = 30; // 与主线 map_fight.FIGHT_MAX_ROUND 同口径（超回合判负）

// 我方站位（与 map_fight.TILE_OF_POS 同源；阵型 positions 1..6）
const TILE_OF_POS = { 1: [-2, -1], 2: [-2, 0], 3: [-2, 1], 4: [-3, -1], 5: [-3, 0], 6: [-3, 1] };
// 敌方站位按"这一波几只"取（与 map_fight.pushFightRound 同源，镜像到 x>0）
const ENEMY_TILES_BY_COUNT = {
  1: [[2, 0]],
  2: [[2, -1], [2, 1]],
  3: [[2, -1], [2, 1], [3, 0]],
  4: [[2, -1], [2, 1], [3, 0], [3, 1]],
  5: [[2, -1], [2, 0], [2, 1], [3, -1], [3, 1]],
  6: [[2, -1], [2, 0], [2, 1], [3, -1], [3, 0], [3, 1]],
};

// ---- 战斗点选择 ----
// n = CfgAutoDispatch.EnemiesCount（客户端算体力用的场次）。
// 本地 40 张主线图里 21 张的 waves 比 n 多 2 个点（wiki 道中数与官方战斗点数不一致，
// 见 调研-10-4多余敌人.md）⇒ 场次恒取 n：多余时**丢尾部道中、保 BOSS**。
// 反过来 waves 比 n 少时不该发生（会让体力与实际场次错位），记日志后按实际打。
function battlePointsOf(barrierId, n) {
  const cfg = MAP_CONFIGS[barrierId];
  if (!cfg || !cfg.waves) return [];
  const all = Object.keys(cfg.waves).map(Number);
  if (!all.length) return [];
  // 挑战顺序以 monsterChain 为准（BFS 序），不在链上的点追加在后
  const seq = [];
  for (const node of (cfg.monsterChain || [])) {
    const fid = Number((cfg.monsterFight || {})[node]);
    if (fid && all.includes(fid) && !seq.includes(fid)) seq.push(fid);
  }
  for (const fid of all) if (!seq.includes(fid)) seq.push(fid);
  if (seq.length <= n) {
    if (seq.length < n) log(`[auto] 战斗点数 ${seq.length} < 配置场次 ${n}（barrier=${barrierId}）：按实际 ${seq.length} 场打`);
    return seq;
  }
  const boss = Number(cfg.bossPoint) || 0;
  const rest = seq.filter(f => f !== boss);
  const out = rest.slice(0, Math.max(0, n - 1));
  if (boss && seq.includes(boss)) out.push(boss);
  return out;
}

// ---- 单位构建 ----
function buildAllies(teamId, alloc) {
  const f = buildFormation(teamId, S.formations[teamId]);
  const fieldIds = (f.field || []).filter(id => id > 0);
  const out = [];
  fieldIds.forEach((sid, i) => {
    const b = S.servants.find(s => Number(s.id) === Number(sid));
    if (!b) return;
    const eff = effectOfSlot(f.lineup, f.positions[i]) || { dmg: 0, selfMit: 0, teamMit: 0, dodge: 0 };
    const u = MF.mkAllyUnit(b, TILE_OF_POS[f.positions[i]] || [-2, 0], eff, teamId);
    u.bid = alloc.next(0);
    // 引擎单位不带 skin：tower.unitToc（录像条目）读 u.skin，缺了就发出 skin_id:0 →
    // 客户端 Servant.SetSkin(0) 无立绘。与 map_fight.fightServantOf 同口径（真实皮肤优先）。
    u.skin = Number(b.skin_id) || (Number(b.type) * 100 + 1);
    out.push({ unit: u, servant: b });
  });
  return out;
}

function buildEnemies(wave, idxBase, alloc) {
  const w = (wave || []).slice(0, 6);
  const tiles = ENEMY_TILES_BY_COUNT[w.length] || ENEMY_TILES_BY_COUNT[3];
  return w.map((e, i) => {
    const u = MF.mkEnemyUnit(e, idxBase + i, tiles[i]);
    u.bid = alloc.next(1);
    // 敌方皮肤固定 type*100+1（与 map_fight.fightServantOf 的默认口径、smoke_stage 断言一致）
    u.skin = Number(e.type) * 100 + 1;
    return u;
  });
}

// 出战消耗（= 客户端 FormationMgr.getTeamCost / 服务端 sortieCost 同口径：主力 + 替补 costVit 之和）
function teamCostOf(teamId) {
  return require('./vit').sortieCost(teamId);
}

// ---- 单场战斗（一个战斗点，可能多波）----
// 返回 { win, rounds, kills, enemyNature, servantExp:[{id,gained,alive}], record }
function runBattle(opts) {
  const barrierId = Number(opts.barrierId);
  const fightId = Number(opts.fightId);
  const teamId = Number(opts.teamId) || 1;
  const cfg = MAP_CONFIGS[barrierId];
  const batches = ((cfg && cfg.waves && cfg.waves[fightId]) || []).map(w => w);
  if (!batches.length) return null;

  const alloc = FC.newBidAllocator();
  const pairs = buildAllies(teamId, alloc);
  if (!pairs.length) return null;
  const allies = pairs.map(x => x.unit);
  const f = {
    allies, enemies: [], allAllies: allies, round: 1, mods: {},
    weather: { start_weather: 0, weather_end_round: 0 },
  };

  // 战报用的开打前快照（自律派遣每场都是满血新队 ⇒ hp0 就是 maxHp）
  allies.forEach(a => { a.hp0 = a.hp; a.pp0 = Object.fromEntries(a.skills.map(sk => [sk.id, sk.pp])); });

  const rounds = [];
  let units0 = allies.map(T.unitToc);
  const monsters = []; // 本场遇到的全部敌方（战报"怪物"页签）
  let kills = 0;
  let enemyNature = 6;
  let over = false, win = false;

  for (let w = 0; w < batches.length && !over; w++) {
    const enemies = buildEnemies(batches[w], w * 10, alloc);
    if (!enemies.length) continue;
    if (w === 0) {
      enemyNature = enemies[0].nature;
      units0 = units0.concat(enemies.map(T.unitToc)); // 首波敌方算「进场单位」，随 rec.units 一起下发
    }
    f.enemies = enemies;
    for (const e of enemies) {
      monsters.push({ id: Number(e.skin) || 0, val: Number(e.level) || 1, type: Number(e.talent) || 0 });
    }
    let first = true;
    while (true) {
      if (f.round > FIGHT_MAX_ROUND) { over = true; win = false; break; } // 超回合判负
      const fl = T.resolveRound(f, {});
      // 首波的首回合不带 enter_list（units 已含），后到波的首回合带新敌进场
      rounds.push({ fight_list: fl, enter_list: (w > 0 && first) ? enemies.map(T.unitToc) : [] });
      first = false;
      f.round++;
      if (enemies.every(e => e.hp <= 0)) { kills += enemies.length; break; }
      if (allies.every(a => a.hp <= 0)) { over = true; win = false; break; }
    }
    if (!over && w === batches.length - 1) win = true;
  }
  // 同归于尽按**负**算（与 map_fight.outcomeOf 同口径：我方全灭即 lose，不看对方）
  if (allies.every(a => a.hp <= 0)) win = false;

  // 誓灵经验（与主线同式）：expBase = 30 + 击杀数×20，阵亡减半，圣器 expMul 加成
  const expBase = Math.round(30 + kills * 20);
  const servantExp = pairs.map(({ unit, servant: b }) => {
    const dead = unit.hp <= 0;
    let gained = dead ? Math.floor(expBase / 2) : expBase;
    const mul = relicBonusOf(b, S.bagGoods).expMul || 0;
    if (mul > 0) gained = Math.round(gained * (1 + mul));
    return { id: Number(b.id), gained, alive: !dead };
  });

  const record = opts.captureRecord ? {
    units: units0,
    rounds: rounds.map(r => ({ fight_list: r.fight_list, enter_list: r.enter_list })),
    // 战报"怪物"页签：p_kvt{id=皮肤id, val=等级, type=天赋id}（DormEnemyInfoVO.fillData 口径）
    monster: monsters,
    // 战报"誓灵"页签：p_copy_auto_servant_change{skin_id, level, hp_change, skill_change}
    servant_change: allies.map(a => ({
      skin_id: Number(a.skin) || 0,
      level: Number(a.level) || 1,
      hp_change: { id: Math.max(0, Math.round(a.hp0 || 0)), type: a.maxHp, val: Math.max(0, Math.round(a.hp)) },
      skill_change: a.skills.map(sk => ({
        id: sk.id,
        val: (a.pp0 && a.pp0[sk.id] != null) ? a.pp0[sk.id] : sk.pp,
        type: sk.pp,
      })),
    })),
    results: [],
    resultToc: {
      fight_id: fightId, copy_id: barrierId, result: win ? 1 : 0,
      mvp: 0, star: [], gold: 0, silver: 0, role_exp: 0,
      servant_reward: [], item_reward: [], servant_exp: [],
      kill_num: kills, mvp_stats: [], score: 0, add_score: 0, replace_list: [],
    },
  } : null;

  return { win, rounds: rounds.length, kills, enemyNature, servantExp, record };
}

// ---- 单场奖励（与 map_fight.onBattleWon 同公式；不自造新口径）----
// 首通加成、誓灵掉落、双倍金币一律**不发**：自律派遣是周回，且结算面板没有收卡通道
// （见 调研-自律派遣 §5.6）。
function battleRewards(barrierId, fightId, kills, enemyNature) {
  const cfg = MAP_CONFIGS[barrierId];
  const isBoss = Number(cfg && cfg.bossPoint) === Number(fightId);
  const detail = getStageDetail(barrierId, fightId) || {};
  const chapter = Math.floor((Number(barrierId) % 1000000) / 10000) || 1;
  const suggestLv = detail.suggestLv || (chapter * 10 - 5);
  const silver = isBoss
    ? Math.round(30 + suggestLv * 6)
    : Math.max(10, Math.round(8 + (suggestLv - 1)));
  const items = rollStageDrops(barrierId, fightId, enemyNature, isBoss, 1) || [];
  const roleExp = ROLE_LEVEL.battleRoleExp(barrierId, kills);
  return { silver, items, roleExp, isBoss };
}

module.exports = { FIGHT_MAX_ROUND, battlePointsOf, teamCostOf, runBattle, battleRewards, buildAllies, buildEnemies };
