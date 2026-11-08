// 三活动全链路（2026-09-12 六十四）：约会大作战（1104 族）+ 苍色的试炼（1026/1765/1027）+ 星象馆通讯（1077）。
//
// 模块定位（与 dream/daily_copy/dare 同构的"借引擎"先例）：
//   - 关卡合成配置在 data/collab_data.js（COLLAB_MAP_CONFIGS，collab meta 标记），map_configs.js 合并注册；
//   - 战斗入口两条（客户端双路径都要接，最终都汇聚到 m_copy_fight_tos）：
//       ① CopyInfoPanel→CopySortiePanel→ m_team_template_init_barrier_tos（星象馆 SideStory3 / 究极试炼
//          经 CopyInfoPanel 的路径）→ map_fight init_barrier 的 collab 分支（init_barrier_toc + fight_prepare）
//       ② CopyActivityPanel 节点 / BossInfoPanel → OPEN_COPY_PLAN_PANEL → CopyPlanPanel 出击 → m_copy_fight_tos
//     本模块装配在链最后：m_copy_fight_tos / m_copy_fight_prepare_tos 拦截 collab copy_id，
//     其余显式回落 guide（→tower→dare→daily_copy→dream→map_fight）。
//   - 体力/费用扣一次口径：init_barrier 路径在 map_fight 里扣 vit 并标 S.mapState.collabPaid；
//     enterFight 看到 collabPaid 就不再扣（直接 toFight 的新 mapState 才扣）。settle 后清标志允许再战。
//   - 结算：onBattleWon 认 cfg.collab → settleCollab（掉落/次数/评级/章节联动/任务推进）。
//   - 任务：BILI_MISSIONS/PLAN_MISSIONS 并入 activity.js 的 MISSIONS 下发；cond 语义见 collabMissionEvent。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log } = require('../log');
const C = require('../data/collab_data');
const LTY = require('../data/lty_map_data');

const ERR_VIT = 262006;   // 体力不足（也借给"哔哩芯片不足"）
const ERR_TIMES = 262014; // 副本次数不足

// ---- 状态 ----
function st() {
  if (!S.collabState) {
    S.collabState = {
      day: '',
      plan: { stars: {}, chapters: {}, claimedCh: {}, daily: {}, dailyDay: '' }, // 星象馆
      bili: { fights: 0, kills: 0, grade: 0, lastKill: 0 },                      // 究极试炼
      dal: { times: {}, cleared: [] },                                           // 约战关卡进度
      selTeam: {},                                                               // copyType → team_id
      engine: {},                                                                // engineActId → 1
      lty: {
        map_id: LTY.LTY_MAP_ID,
        pos: LTY.LTY_SPAWN_POS,
        step: 1,
        claimed: {},
        cleared: false,
        daily_step6: 0,
        move_path: [],
      },
    };
  }
  const s = S.collabState;
  if (!s.lty) {
    s.lty = {
      map_id: LTY.LTY_MAP_ID,
      pos: LTY.LTY_SPAWN_POS,
      step: 1,
      claimed: {},
      cleared: false,
      daily_step6: 0,
      move_path: [],
    };
  }
  const today = new Date().toLocaleDateString('sv');
  if (s.day !== today) {
    s.day = today;
    s.bili.fights = 0;
    s.dal.times = {};
    if (s.lty) s.lty.daily_step6 = 0;
    log(`[collab] 每日计数重置（${today}）`);
  }
  return s;
}
function planDaily() {
  const p = st().plan;
  if (p.dailyDay !== st().day) { p.dailyDay = st().day; p.daily = {}; }
  return p.daily;
}
function ltyState() {
  const l = st().lty;
  if (!l.pos || l.pos === 18015) l.pos = LTY.LTY_SPAWN_POS;
  return l;
}

// ---- 星象馆：星图/章节 ----
function openStarNum(p) {
  return C.PLAN_STARS.filter(x => p.stars[x.id] === 1).length;
}
function chapterVal(p, ch) {
  if (p.chapters[ch.id] === 2) return 2;
  return openStarNum(p) >= ch.needStar ? 1 : 0;
}
function chapterListP(p) {
  return C.PLAN_CHAPTERS.map(ch => ({ id: ch.id, val: chapterVal(p, ch) }));
}
function starListP(p) {
  return C.PLAN_STARS.map(x => ({ id: x.id, val: p.stars[x.id] === 1 ? 1 : 0 }));
}
function sendPlanetarianInfo(conn) {
  const p = st().plan;
  conn.sendToc('m_planetarian_info_toc', { act_id: 1077, stars: starListP(p), chapter_list: chapterListP(p) });
}
// 发一件奖励（灯泡/旧式部件等 form=2 积分走 grantItemRewards→role_scores；其余入包）
function grantPair(conn, id, num) {
  return require('./vit').grantItemRewards(conn, [{ type: id, num }], 1);
}
// 发一只誓灵（入队 + 3 秒卡片动画，与主线掉落同时序——结算面板播完才播获取动画）
function grantServant(conn, type) {
  // 先判后建卡：makeServantBrief 内部会激活图鉴，判定必须发生在它之前
  const first = require('./handbook').isUnlocked(type) ? 0 : 1;
  const brief = require('./servant').makeServantBrief(type);
  // 非法 type：makeServantBrief 已拒绝并记日志。绝不入列——否则 brief/fame 推送会把它带给
  // 客户端，毒化 ServantMgr 类型计数表 → 祭坛名气榜 updateRankList 索引 nil 崩
  if (!brief) return null;
  require('./servant').grantServantBrief(brief);
  const b = brief;
  // 实例 3s 后才告知客户端：期间任何 fame diff（签到/领奖链后续推送、玩家即时操作）
  // 若带上它会建出 configVO=nil 的祭坛选人 VO，此后每次 m_servant_type_fame_update_toc
  // 排序即崩（2026-10-12 真机 35 连报错根因，同 map_fight/dream 的防护口径）
  require('./altar').markPendingAnnounce([b.id]);
  setTimeout(() => {
    // conn 可为 null（grantGoods 誓灵代币兜底等无连接上下文的调用）：入档已落，但**不宣告、
    // 也不清 pendingAnnounce 标记**——清除标记的前提是"客户端已见到该实例"，而这里的实例
    // 客户端从未见过。旧实现清标后 fame diff 会把 {type:未宣告sid} 推给客户端 → 建 configVO=nil
    // 的祭坛选人 VO → 首条 val=0 移除 diff 时 table.find2 谓词读 configVO.typeId 崩
    // （ServantAltarMgr:302，2026-10-16 设备 ec2421 真机 5 连报错根因，D7 家族第四变体）。
    // 标记保留至：① 重登 pushFameList（全量 brief 宣告全部后 clear，前提成立）；
    // ② 同 id 走了带 conn 的宣告路径。期间该类型 fame diff 跳过、保留旧基线——正是客户端的真实视野。
    if (conn) {
      conn.sendToc('m_servant_update_toc', { new: [{ servant: b, is_first: first }], update: [], del: [], reward_type: 2 });
      try {
        require('./altar').clearPendingAnnounce([b.id]); // 先宣告实例，再补推名气
        require('./altar').pushFameUpdates(conn);
        require('./handbook').pushRedPoints(conn);
      } catch (e) { /* 忽略 */ }
    } else {
      log(`[collab] 誓灵 id=${b.id} type=${b.type} 无连接上下文入档（不宣告）——保留 pendingAnnounce，重登 brief 宣告后 fame 才可见`);
    }
  }, 3000);
  // 成功必须返回真值：shop.js 事务分支用 `if (!grantServant(...)) throw` 判发放成败，
  // 此前成功路径返回 undefined ⇒ "发放成功"被误判为失败并全量回滚（兑换 22/33 点了没反应，
  // 2026-10-28 实锤；非法 type 已在 makeServantBrief 判空时 return null）。
  return b;
}
// 章通关（自动发放："首次通过剧情章节后可获得额外奖励"）
function clearChapter(conn, chId) {
  const p = st().plan;
  const ch = C.PLAN_CHAPTERS.find(x => x.id === chId);
  if (!ch || p.chapters[chId] === 2) return;
  for (const [id, num] of ch.rewards) {
    if (id === 2245001) grantServant(conn, 2245001); // 星野梦美
    else grantPair(conn, id, num);
  }
  // 章进度只有在奖励全部处理完成后才提交，避免奖励异常导致永久跳过首通奖励。
  p.chapters[chId] = 2;
  saveState();
  sendPlanetarianInfo(conn);
  log(`[collab] SideStory${chId} 通关 → 章奖励已发（${JSON.stringify(ch.rewards)}）`);
}

// ---- 达拉崩吧剧场地图（1052010100）----
function getLtyObjList(lty) {
  const list = [];
  for (const [idStr, defaultVis] of Object.entries(LTY.LTY_MAP_OBJS)) {
    const id = Number(idStr);
    let val = defaultVis;
    // 可见性按官方事件表语义（CfgMapEvent 101 showName：95090=摸鱼的公主、85080=管家的训练）：
    // 蓝门 46040 在主图（x=46），红门 87086/公主 95090/管家 85080 都在右侧城堡岛——
    // 该岛节点与主图不连通，玩家必须经蓝门传送上岛（见 move_dst 的 transfer 分支）
    if (id === 46040 && lty.step >= 5) val = 1; // 蓝色传送门（主岛）Step 5 激活
    if (id === 87086 && lty.step >= 5) val = 1; // 红色传送门（城堡岛）Step 5 激活
    if (id === 95090 && lty.step >= 5) val = 1; // 摸鱼的公主 Step 5 现身
    if (id === 85080 && lty.step >= 6) val = 1; // 城堡管家 Step 6 现身（每日训练）
    if (id === 73068 && lty.step >= 3) val = 1; // 贝希摩斯 Step 3 出现
    if (id === 81075 && lty.step >= 3) val = 0; // 恶龙 Step 3 起被击退
    list.push({ id, val });
  }
  return list;
}

// 达拉崩吧接敌通用：装配 mapState 并直接推布阵面板（客户端 m_copy_fight_prepare_toc →
// preloadOpenPlanPanel → CopyPlanPanel；载荷走 map_fight.buildFormation 的防御性编队，勿再手搓）
function ltyFightPrepare(conn, copyId, fighting) {
  const lty = ltyState();
  const lastId = selTeamOf(copyId) || 1;
  S.mapState = {
    barrierId: copyId,
    fighting,
    pos: lty.pos,
    lastId,
    use_team_ids: [lastId],
    collabPaid: 1,
    ltyFight: true,
  };
  saveState();
  require('./map_fight').pushFightPrepare(conn, copyId, lastId);
}

const handlers = {
  // ==== 达拉崩吧剧场地图（1052010100）====
  m_theater_map_init_tos(conn, obj) {
    conn.sendToc('m_theater_map_init_toc', {});
  },
  m_theater_map_last_diff_tos(conn, obj) {
    const mapId = Number(obj && obj.map_id) || LTY.LTY_MAP_ID;
    conn.sendToc('m_theater_map_last_diff_toc', { map_id: mapId, diff: 1 });
  },
  m_theater_map_enter_tos(conn, obj) {
    const mapId = Number(obj && obj.map_id) || LTY.LTY_MAP_ID;
    const lty = st().lty;
    log(`[collab] 玩家进入达拉崩吧地图 mapId=${mapId} step=${lty.step} pos=${lty.pos}`);
    conn.sendToc('m_theater_map_enter_toc', {
      map_id: mapId,
      pos: lty.pos || LTY.LTY_SPAWN_POS,
      areas: [{ id: 0, val: 1 }],
      obj_list: getLtyObjList(lty),
      skin_list: [194100101], // 洛天依
      step: lty.step || 1,
      diff: 1,
      dyn_obj: [],
      buff: [],
    });
  },
  m_theater_map_move_path_tos(conn, obj) {
    const lty = st().lty;
    const path = Array.isArray(obj && obj.path) ? obj.path : [];
    lty.move_path = path;

    // 路径途经交互点检测与阻挡截断：
    // 若路径穿过了宝箱、恶龙、未募集伙伴等点，将其截断在交互点坐标，避免穿模。
    // ⚠️ 从下标 1 开始扫：path[0] 是玩家当前节点，截断它没有意义，且会让站在蓝门上的
    //    玩家任何移动都被截断在原地并立刻触发传送。
    // ⚠️ 城堡岛交互点必须用精确节点：岛上全部节点 id 都 ≥87080，曾用 p>=87080 粗判
    //    导致传送上岛后每一步都被截断在起点（角色冻结、无法移动）
    if (path.length > 0) {
      for (let i = 1; i < path.length; i++) {
        const p = path[i];
        let isHit = false;
        // 1. 恶龙（Step 1-2 存活时阻挡截断）
        if (lty.step <= 2 && (p === 81075 || p === 79075)) {
          isHit = true;
        }
        // 2. 宝箱（未开启时阻挡截断）
        if (p === 28025 && !lty.chest_opened) {
          isHit = true;
        }
        // 3. 乐正绫伙伴（未募集时阻挡截断）
        if (p === 34029 && !lty.partner_34029) {
          isHit = true;
        }
        // 4. 贝希摩斯（Step 3/4 目标点阻挡截断）
        if ((lty.step === 3 || lty.step === 4) && (p === 73068 || p === 72068)) {
          isHit = true;
        }
        // 5. 蓝色传送门（主岛，Step 5 踩上即停，到达后服务端传送）
        if (lty.step >= 5 && p === 46040) {
          isHit = true;
        }
        // 6. 城堡岛：红色传送门 / 摸鱼公主（Step 5 起）、城堡管家（Step 6 起）
        if (lty.step >= 5 && (p === 87086 || p === 95090)) {
          isHit = true;
        }
        if (lty.step >= 6 && p === 85080) {
          isHit = true;
        }

        if (isHit) {
          lty.move_path = path.slice(0, i + 1);
          conn.sendToc('m_theater_map_move_path_toc', { pos: p });
          log(`[collab] 达拉崩吧路径截断到交互点 pos=${p}`);
          return;
        }
      }
    }

    conn.sendToc('m_theater_map_move_path_ack_toc', {});
  },
  m_theater_map_move_dst_tos(conn, obj) {
    const lty = st().lty;
    if (lty.move_path && lty.move_path.length > 0) {
      lty.pos = lty.move_path[lty.move_path.length - 1];
    }
    log(`[collab] 达拉崩吧角色到达坐标 pos=${lty.pos}`);

    let hasSent = false;
    // 1. 检查节点事件（CfgMapEvent[1052010100]）
    const eventId = LTY.LTY_NODE_EVENTS[lty.pos];
    if (eventId) {
      conn.sendToc('m_theater_map_event_toc', { event_id: eventId });
      log(`[collab] 触发达拉崩吧节点事件 event_id=${eventId} (pos=${lty.pos})`);
      hasSent = true;
    }

    // 2. 宝箱交互（28025）
    if (lty.pos === 28025 && !lty.chest_opened) {
      lty.chest_opened = true;
      grantPair(conn, 30000000, 200); // 200 水晶
      grantPair(conn, 20000905, 2);   // 2 包子道具
      L.addScore(conn, 29, 50);       // 50 包子积分
      conn.sendToc('m_theater_map_obj_update_toc', { objs: [{ id: 28025, val: 0 }] });
      log('[collab] 开启达拉崩吧宝箱！获得 200 水晶 + 2 包子道具 + 50 包子积分');
      hasSent = true;
    }

    // 3. 伙伴募集（乐正绫 34029 等）
    if (lty.pos === 34029 && !lty.partner_34029) {
      lty.partner_34029 = true;
      conn.sendToc('m_theater_map_follow_update_toc', { skin_id: 194400201 });
      log('[collab] 募集到伙伴乐正绫！伴随入队');
      hasSent = true;
    }

    // 4. 双向传送门（Step 5 起）：右侧城堡岛与主图节点不连通，传送是唯一通路。
    //    蓝门 46040（主岛）→ 城堡岛 88086（红门 87086 旁）；红门 87086 → 蓝门 46040。
    //    客户端 m_theater_map_transfer_toc → AdventureModule.onTransfer → ON_MAP_TRANSFER
    //    → MapScene.onMapTransfer（角色消失-镜头平移-在落点重现），服务端同步 lty.pos
    if (lty.step >= 5 && lty.pos === 46040) {
      lty.pos = 88086;
      lty.move_path = [lty.pos];
      saveState();
      conn.sendToc('m_theater_map_transfer_toc', { pos: lty.pos });
      log('[collab] 蓝色传送门启动，传送到城堡岛 88086（摸鱼的公主处）');
      hasSent = true;
    } else if (lty.step >= 5 && lty.pos === 87086) {
      lty.pos = 46040;
      lty.move_path = [lty.pos];
      saveState();
      conn.sendToc('m_theater_map_transfer_toc', { pos: lty.pos });
      log('[collab] 红色传送门启动，传送回主岛 46040');
      hasSent = true;
    }

    // 5. 恶龙接敌战斗（Step 1 首战 / Step 2 复战，节点 81075 或其面前 79075；
    //    靠近恶龙的气泡 13 节点也拉敌）
    if (lty.step <= 2 && (lty.pos === 81075 || lty.pos === 79075 || (lty.step === 1 && eventId === 13))) {
      ltyFightPrepare(conn, C.LTY_DRAGON_COPY, 81075);
      log('[collab] 恶龙接敌，成功拉起战斗准备面板 copy_id=1052010100');
      hasSent = true;
    }

    // 6. 摸鱼公主高难接敌战斗（Step 5：城堡岛上走到公主 95090 面前）
    if (lty.step === 5 && lty.pos === 95090) {
      ltyFightPrepare(conn, C.LTY_PRINCESS_COPY, 95090);
      log('[collab] 摸鱼公主(高难)接敌，成功拉起战斗准备面板 copy_id=1052010174');
      hasSent = true;
    }

    // 7. 城堡管家的训练（Step 6：每日 10 次，重复挑战公主副本）
    if (lty.step === 6 && lty.pos === 85080) {
      if ((lty.daily_step6 || 0) >= 10) {
        conn.sendToc('m_common_error_toc', { code: ERR_TIMES });
        log(`[collab] 管家训练今日 ${lty.daily_step6}/10 次，已用尽`);
        hasSent = true;
      } else {
        ltyFightPrepare(conn, C.LTY_PRINCESS_COPY, 85080);
        S.mapState.ltyTrain = 1;
        saveState();
        log(`[collab] 管家的训练接敌（第 ${(lty.daily_step6 || 0) + 1}/10 次），拉起布阵 copy_id=1052010174`);
        hasSent = true;
      }
    }

    // 6. 其他阶段目标推进（Step 2/3/4/6）
    const stepCfg = LTY.LTY_STEPS[lty.step];
    if (stepCfg && lty.step > 1 && lty.step !== 5) {
      let reached = false;
      if (lty.step === 2 && (lty.pos === 25017 || lty.pos === 34029 || eventId === 4)) {
        reached = true;
      } else if (lty.step === 3 && (lty.pos === 73068 || lty.pos === 72068 || eventId === 11)) {
        reached = true;
      } else if (lty.step === 4 && (lty.pos === 73068 || eventId === 11)) {
        reached = true;
      } else if (lty.step === 6 && (lty.pos === 71068 || eventId === 11)) {
        if (lty.daily_step6 < 10) {
          reached = true;
          lty.daily_step6++;
        }
      }

      if (reached && !lty.claimed[lty.step]) {
        const completedStep = lty.step;
        for (const rw of stepCfg.rewards) {
          grantPair(conn, rw.id, rw.num);
        }
        L.addScore(conn, 29, 100);

        if (lty.step < 6) {
          lty.step++;
        }
        lty.claimed[completedStep] = true;
        saveState();

        conn.sendToc('m_theater_map_step_update_toc', { step: lty.step });
        conn.sendToc('m_theater_map_obj_update_toc', { objs: getLtyObjList(lty) });
        log(`[collab] 达拉崩吧阶段完成，推进到 step=${lty.step}`);
        hasSent = true;
      }
    }
    saveState();

    // 关键加固：走空格子时回包 common_reply，立刻解除客户端 checkSendBack 3秒超时，彻底杜绝 Loading 遮罩弹窗
    if (!hasSent) {
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    }
  },
  m_theater_map_quit_tos(conn, obj) {
    conn.sendToc('m_theater_map_quit_toc', { result: 0 });
    conn.sendToc('m_theater_map_close_toc', { map_id: LTY.LTY_MAP_ID, op_type: 0 });
    log(`[collab] 玩家退出达拉崩吧剧场地图`);
  },
  // ==== 星象馆通讯 1077（ActivityPlanetarianPanel.open → m_planetarian_info_tos）====
  m_planetarian_info_tos(conn, obj) {
    const act = Number(obj && obj.act_id) || 1077;
    if (act !== 1077) return conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    sendPlanetarianInfo(conn);
  },
  // 点亮星体（ActivityPlanetarianStarPanel.onLight 客户端已本地校验 [灯泡,旧式部件]，服务端复检）
  m_planetarian_light_tos(conn, obj) {
    const id = Number(obj && obj.id) || 0;
    const p = st().plan;
    const star = C.PLAN_STARS.find(x => x.id === id);
    if (!star || p.stars[id] === 1) return conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    if (L.getScore(C.PLAN_LAMP_SCORE) < star.lamp || L.getScore(C.PLAN_BATTERY_SCORE) < star.battery) {
      return conn.sendToc('m_common_error_toc', { code: ERR_VIT });
    }
    L.addScore(conn, C.PLAN_LAMP_SCORE, -star.lamp);
    L.addScore(conn, C.PLAN_BATTERY_SCORE, -star.battery);
    p.stars[id] = 1;
    for (const [gid, num] of star.rewards) grantPair(conn, gid, num);
    saveState();
    // ⚠️ 客户端 updatePlaneTarianInfo 读 slot0.star.id（单对象，schema 虽标 array）——发数组会
    // "table index is nil"（真机 2026-09-13 实证）；chapter 仍为数组（客户端 pairs 迭代）
    conn.sendToc('m_planetarian_light_toc', { act_id: 1077, star: { id, val: 1 }, chapter: chapterListP(p) });
    log(`[collab] 点亮星体 ${id}（${star.name}）：灯泡-${star.lamp} 部件-${star.battery}，点亮 ${openStarNum(p)}/21`);
  },
  // 章完成上报（剧场播完/战斗通关后客户端发 chapter_id）：解锁且未通关 → 置通关+发章奖励（幂等）。
  // ⚠️ 回包 chapter 必须是**单对象** {id,val}：客户端 m_planetarian_chapter_reward_toc 直接
  // updatePlaneTarianChapter(slot0.chapter)，发数组 = slot0.chapter.id 为 nil → "table index is nil"
  // （真机 2026-09-13 实证，schema 标 array 但客户端按对象访问）
  m_planetarian_chapter_reward_tos(conn, obj) {
    const chId = Number(obj && obj.chapter_id) || 0;
    const ch = C.PLAN_CHAPTERS.find(x => x.id === chId);
    const p = st().plan;
    if (ch && chapterVal(p, ch) === 1) clearChapter(conn, chId);
    const val = ch ? chapterVal(st().plan, ch) : 0;
    conn.sendToc('m_planetarian_chapter_reward_toc', { act_id: 1077, chapter: { id: chId, val } });
    log(`[collab] 章完成上报 chapter=${chId} → val=${val}${val === 2 ? '（奖励已发）' : ''}`);
  },

  // ==== 苍色的试炼：究极试炼 info（ActivityBili2233View.onOpen；客户端 act_id 请求值=
  // Bili2233VO.FIGHT_ACT_ID_RENOVATE=1769，回包原样 echo——VO.actID 必须是 1027/1769 之一
  // isOpenFight 才为真，见 activity.js ACT_OPEN 的 1769 条目）====
  m_copy_ultima_test_info_tos(conn, obj) {
    const act = Number(obj && obj.act_id) || C.BILI_ACT_VIEW;
    const b = st().bili;
    const owned = [1835001, 1836002].filter(t => S.servants.some(x => Number(x.type) === t));
    conn.sendToc('m_copy_ultima_test_info_toc', {
      act_id: act,
      today_fight: b.fights,
      ticket: C.BILI_TICKET,
      servant_types: owned,
      last_kill: b.lastKill,
    });
  },

  // ==== 约战挑战/高难：每日次数（BossInfoPanel.dailyTimes = daily_times - getDailyTimes(act)）====
  m_copy_boss_info_tos(conn, obj) {
    const act = Number(obj && obj.act_id) || 0;
    const s = st();
    const max = { 1106: 10, 1109: 1, 1119: 1 }[act] || 0;
    const used = act === 1106 ? Object.values(s.dal.times).reduce((a, b2) => a + b2, 0) : (s.dal.cleared.some(id => C.DAL_HARD.find(h => h.copyId === id)) ? 1 : 0);
    conn.sendToc('m_copy_boss_info_toc', {
      act_id: act, ticket: 0, ticket_charge: 0,
      daily_times: Math.max(0, max - used),
      barriers: [], reward: 0, max: 0, is_fight: 0, fail_times: 0, add_times: 0,
    });
  },

  // ==== 编队选择记忆（CopyPlanPanel 选择队伍后必发；daily_copy echo 基础上记 team_id）====
  m_team_template_select_tos(conn, obj) {
    const copyType = Number((obj && obj.copy_type) || 0);
    const copyKey = Number((obj && obj.copy_key) || 0);
    const teamId = Number((obj && obj.team_id) || 1);
    st().selTeam[copyType || copyKey || 'def'] = teamId;
    // 主线存活会话的中途换队跟随（二百八十二·续 C）：地图「更换队伍」按钮循环 nowTeamList 发本
    // 协议（AdventureMapPanel.onClickBtnChange），此前只回显——S.mapState.lastId 不更新 ⇒ 后续
    // 体力/战斗/结算全读旧队。仅当：会话存活（locked=init_barrier 出击的会话）∧ copy_type=1
    // （主线/EX 同链）∧ 目标队 ∈ use_team_ids（合法的会话内换队）才跟随；其余（曜日/殿堂/布阵
    // 面板的队伍记忆）维持原样。mapState 不落盘，无需 saveState。
    if (S.mapState && S.mapState.locked && copyType === 1
        && (S.mapState.use_team_ids || []).map(Number).includes(teamId)
        && Number(S.mapState.lastId) !== teamId) {
      S.mapState.lastId = teamId;
      log(`[map] 会话内换队：barrier=${S.mapState.barrierId} → team ${teamId}`);
    }
    saveState();
    conn.sendToc('m_team_template_select_toc', { copy_type: copyType, copy_key: copyKey, team_id: teamId });
  },

  // ==== 战斗入口（装配链最后；非 collab copy 回落 guide→tower→dare→daily_copy→dream→map_fight）====
  m_copy_fight_tos(conn, obj) {
    const copyId = Number((obj && obj.copy_id) || 0);
    const cfg = C.COLLAB_MAP_CONFIGS[copyId];
    if (!cfg) return require('./guide').handlers.m_copy_fight_tos(conn, obj);
    return enterFight(conn, copyId, cfg, obj);
  },
  // ⚠️ 回落目标**必须是真正导出该方法的模块**（2026-11-05 无限领域「卡在战场生成中」实锤）：
  // 这里原写 guide.handlers.m_copy_fight_prepare_tos，而 guide 只导出 4 个 handler
  // （m_role_guide_do_tos / m_role_rename_tos / m_servant_select_tos / m_copy_fight_tos），
  // **没有 prepare** ⇒ 非联动副本（主线点击接敌 / 无限领域 / 幻梦 / 曜日 / 唤灵殿堂）一律
  // TypeError，game_server 只补一条 m_common_reply_toc，客户端 m_copy_fight_prepare_toc 永不到
  // ⇒ CopyModule.checkPreladComplete 不推进 ⇒ 布阵面板不出现、转场卡在「战场生成中…」。
  // 正确回落 = tower（→dare→map_fight 整条 prepare 链；dream/daily_copy 本就不导出 prepare）。
  // 自查：`grep "handler 异常 m_copy_fight_prepare_tos" server/logs/server.log` 应为 0。
  m_copy_fight_prepare_tos(conn, obj) {
    const copyId = Number((obj && obj.copy_id) || 0);
    const cfg = C.COLLAB_MAP_CONFIGS[copyId];
    if (!cfg) return require('./tower').handlers.m_copy_fight_prepare_tos(conn, obj);
    if (!entryOk(conn, copyId, cfg)) return;
    const teamId = selTeamOf(copyId) || 1;
    const isLty = cfg.collab.family === 'lty-dragon' || cfg.collab.family === 'lty-princess';
    if (!isLty && !require('./vit').spendSortieVit(conn, teamId)) return; // BossInfoPanel 直 prepare 路径在此扣体力；达拉崩吧地图内接敌免费
    S.mapState = { barrierId: copyId, lastId: teamId, pos: 0, fighting: 0, zone: 0, defeated: [], use_team_ids: [teamId], collabPaid: 1 };
    saveState();
    require('./map_fight').pushFightPrepare(conn, copyId, teamId);
    log(`[collab] prepare ${cfg.collab.name}（${copyId}）team=${teamId}`);
  },
};

// ---- m_copy_barrier_info_tos 的活动副本屏障表（CopyActivityPanel.toBarrierInfo(copyType, chapter)）----
// CopyMgr.barrierCanEnter(copyId)=getBarrierInfo!=nil → 不下发屏障表节点会被判锁定；cur_chapter 恒 1（单章）
function barrierSetOf(copyType) {
  const s = st();
  const mk = (id, cleared) => ({
    barrier_id: id,
    stars: cleared ? [1, 2, 3] : [],
    servant_types: [], drop_rate_up: [], servant_rate_up: [],
    pass_times: cleared ? 1 : 0,
    first_reward: 0,
  });
  if (Number(copyType) === C.DAL_ACT) {
    return { barriers: C.DAL_STAGES.map(x => mk(x.copyId, s.dal.cleared.includes(x.copyId))), cur_chapter: 1, max_chapter: 1 };
  }
  if (Number(copyType) === 1106) {
    return { barriers: C.DAL_WEEKLY.map(x => mk(x.copyId, false)), cur_chapter: 1, max_chapter: 1 };
  }
  if (Number(copyType) === 1109 || Number(copyType) === 1119) {
    const h = C.DAL_HARD.find(x => Math.floor(x.copyId / 1000000) === Number(copyType));
    return { barriers: [mk(h.copyId, s.dal.cleared.includes(h.copyId))], cur_chapter: 1, max_chapter: 1 };
  }
  if (Number(copyType) === 1027) {
    return { barriers: [mk(C.BILI_EX_COPY, false)], cur_chapter: 1, max_chapter: 1 };
  }
  if (Number(copyType) === 1079 || Number(copyType) === 1080) {
    const ids = Number(copyType) === 1079 ? [C.PLAN_SIDE_COPY] : [C.PLAN_DARE_COPY];
    return { barriers: ids.map(id => mk(id, false)), cur_chapter: 1, max_chapter: 1 };
  }
  return null;
}

// ---- 入场门 ----
function entryOk(conn, copyId, cfg) {
  const meta = cfg.collab;
  const s = st();
  if (meta.family === 'dal-main' || meta.family === 'dal-hard') {
    if (s.dal.cleared.includes(copyId)) {
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      log(`[collab] 拒绝：${meta.name} 已通关`);
      return false;
    }
    if (meta.family === 'dal-hard' && !s.dal.cleared.includes(meta.need)) {
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      log(`[collab] 拒绝：${meta.name} 需先通关 ${meta.need}`);
      return false;
    }
  } else if (meta.family === 'dal-weekly') {
    const used = s.dal.times[copyId] || 0;
    if (used >= meta.times) {
      conn.sendToc('m_common_error_toc', { code: ERR_TIMES });
      log(`[collab] 拒绝：${meta.name} 今日 ${used}/${meta.times}`);
      return false;
    }
  } else if (meta.family === 'bili-ex') {
    if (s.bili.fights >= C.BILI_TICKET) {
      conn.sendToc('m_common_error_toc', { code: ERR_TIMES });
      log(`[collab] 拒绝：究极试炼今日 ${s.bili.fights}/${C.BILI_TICKET}`);
      return false;
    }
    if (L.getScore(C.BILI_CHIP_SCORE) < C.BILI_COST_CHIP) {
      conn.sendToc('m_common_error_toc', { code: ERR_VIT });
      log(`[collab] 拒绝：哔哩芯片不足（需 ${C.BILI_COST_CHIP}，有 ${L.getScore(C.BILI_CHIP_SCORE)}）`);
      return false;
    }
  } else if (meta.family === 'plan-side') {
    const ch = C.PLAN_CHAPTERS.find(x => x.copyID === C.PLAN_SIDE_COPY);
    const p = st().plan;
    if (chapterVal(p, ch) === 0) {
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      log(`[collab] 拒绝：SideStory3 未解锁（点亮 ${openStarNum(p)}/${ch.needStar}）`);
      return false;
    }
  }
  return true;
}
function selTeamOf(copyId) {
  const s = st();
  return Number(s.selTeam[Math.floor(Number(copyId) / 1000000)] || s.selTeam.def || 0) || 0;
}

// m_copy_fight_tos 的 collab 分支：校验 → 扣费 → 合成 mapState → 委托 map_fight 建会话
function enterFight(conn, copyId, cfg, obj) {
  const meta = cfg.collab;
  const s = st();
  if (!entryOk(conn, copyId, cfg)) return;
  const teamId = selTeamOf(copyId) || 1;
  // 体力只扣一次：init_barrier/prepare 路径已付（collabPaid），直接 toFight 的新会话在这里付；
  // 达拉崩吧（lty-*）地图内接敌官方不扣体力
  const isLty = meta.family === 'lty-dragon' || meta.family === 'lty-princess';
  const reuse = (S.mapState && S.mapState.barrierId === copyId && S.mapState.collabPaid) || isLty;
  if (!reuse && !require('./vit').spendSortieVit(conn, teamId)) return;
  if (meta.family === 'bili-ex') {
    if (L.getScore(C.BILI_CHIP_SCORE) < C.BILI_COST_CHIP) {
      return conn.sendToc('m_common_error_toc', { code: ERR_VIT });
    }
    L.addScore(conn, C.BILI_CHIP_SCORE, -C.BILI_COST_CHIP);
  }
  S.mapState = { barrierId: copyId, lastId: teamId, pos: 0, fighting: 0, zone: 0, defeated: [], use_team_ids: [teamId], collabPaid: 1 };
  saveState();
  require('./map_fight').handlers.m_copy_fight_tos(conn, obj); // waves[copyId] 命中合成配置 → 建 fight 会话
  log(`[collab] 开战 ${meta.name}（${copyId}）family=${meta.family} team=${teamId}${meta.family === 'bili-ex' ? ' 芯片-' + C.BILI_COST_CHIP : ''}`);
}

// ---- 结算（map_fight.onBattleWon 认 cfg.collab 调入）----
function settleCollab(conn, stFight, cfg) {
  const meta = cfg.collab;
  const s = st();
  const b = stFight;
  // 全波敌人 = 本场击杀数（引擎波次全清才算胜）
  const allWaves = (cfg.waves[String(meta.copyId)] || []).flat();
  const kills = allWaves.length;
  const firstClear = !s.dal.cleared.includes(meta.copyId);
  const rewards = [];      // [typeId, num]
  const servants = [];     // 誓灵掉落
  let silver = 0;
  const scoreAdds = [];
  const commits = [];
  let ltyProgressed = false;
  const trainers = {};
  for (const e of allWaves) if (e.trainer) trainers[e.trainer] = (trainers[e.trainer] || 0) + 1;

  if (meta.family === 'dal-main') {
    if (firstClear) {
      commits.push(() => s.dal.cleared.push(meta.copyId));
      rewards.push(...C.DAL_MAIN_FIRST);
      log(`[collab] ${meta.name} 首通`);
    }
  } else if (meta.family === 'dal-weekly') {
    commits.push(() => { s.dal.times[meta.copyId] = (s.dal.times[meta.copyId] || 0) + 1; }); // 胜利计次
    for (let i = 0; i < (meta.fragments || 1); i++) {
      rewards.push([C.DAL_FRAGMENTS[Math.floor(Math.random() * C.DAL_FRAGMENTS.length)], 1]);
    }
  } else if (meta.family === 'dal-hard') {
    if (firstClear) {
      commits.push(() => s.dal.cleared.push(meta.copyId));
      servants.push(meta.frame); // 联动头像框（form=2 道具，走 grantPair 积分/道具通道均可）
      rewards.push(...C.DAL_HARD_BOXES);
      silver = meta.gold || 0;
    }
  } else if (meta.family === 'bili-ex') {
    const nextBili = {
      fights: s.bili.fights + 1,
      kills: s.bili.kills + kills,
      lastKill: kills,
      grade: s.bili.grade,
    };
    let grade = 0;
    for (const g of C.BILI_GRADES) if (nextBili.kills >= g.kills) grade = g.rank;
    nextBili.grade = Math.max(s.bili.grade, grade);
    commits.push(() => Object.assign(s.bili, nextBili));
    // 掉落：22/33（评级越高概率越高，SSS 必掉其一）+ 遗物箱（BWIKI 掉率表按评级 5%~15%）
    const rate = [0, 0.05, 0.07, 0.08, 0.09, 0.10, 0.15][nextBili.grade] || 0.05;
    if (Math.random() < rate || nextBili.grade >= 6) servants.push([1835001, 1836002][Math.floor(Math.random() * 2)]);
    if (Math.random() < 0.5) rewards.push([21104000, 1]);
    if (Math.random() < 0.25) rewards.push([21007000, 1]);
    log(`[collab] 究极试炼结算：击杀 ${kills} 累计 ${nextBili.kills}（今日 ${nextBili.fights}/${C.BILI_TICKET}）评级 ${nextBili.grade}`);
  } else if (meta.family === 'plan-side') {
    clearChapter(conn, 3); // SideStory3 通关 → 章 3 奖励（星野梦美+灯泡）
  } else if (meta.family === 'plan-dare') {
    rewards.push([21007000, 2], [21104000, 2]);
    silver = 5000;
  } else if (meta.family === 'lty-dragon') {
    if (s.lty.step === 1) {
      commits.push(() => { s.lty.step = 2; s.lty.claimed[1] = true; });
      ltyProgressed = true;
      for (const rw of (LTY.LTY_STEPS[1].rewards || [])) {
        rewards.push([rw.id, rw.num]);
      }
      scoreAdds.push(100);
      log('[collab] 战胜恶龙！达拉崩吧推进到 Step 2，发放 Step 1 奖励！');
    } else {
      log('[collab] 战胜恶龙（Step 2 复战，仅结算掉落，不推进阶段）');
    }
  } else if (meta.family === 'lty-princess') {
    if (s.lty.step === 5) {
      commits.push(() => { s.lty.step = 6; s.lty.cleared = true; s.lty.claimed[5] = true; });
      ltyProgressed = true;
      for (const rw of (LTY.LTY_STEPS[5].rewards || [])) {
        rewards.push([rw.id, rw.num]);
      }
      scoreAdds.push(200);
      log('[collab] 战胜摸鱼的公主(高难)！达拉崩吧通关并推进到 Step 6，发放天钿与飞翔之音头像框！');
    } else if (s.lty.step === 6) {
      // Step 6 管家的训练（每日 10 次）：每次胜利计 1 次并发训练奖励
      commits.push(() => { s.lty.daily_step6 = (s.lty.daily_step6 || 0) + 1; });
      rewards.push([20000905, 2]);
      scoreAdds.push(20);
      log(`[collab] 管家的训练第 ${s.lty.daily_step6}/10 次胜利（+2 包子道具 +20 包子积分）`);
    }
  }
  // 发放：结算面板展示（st.itemRewards/silverReward/dropServants）+ 实发（与 daily_copy 同口径）
  b.itemRewards = rewards.map(([type, num]) => ({ type, num }));
  const r = rewards.length ? require('./vit').grantItemRewards(conn, b.itemRewards, 1) : null;
  if (silver) { S.roleAsset.silver += silver; L.pushAssetChange(conn); }
  b.silverReward = silver + ((r && r.silverAdd) || 0);
  // 头像框（4100001x form=2）/ 誓灵掉落 → 面板 servant_reward 位展示
  const dropTypes = [];
  for (const t of servants) {
    if (typeof t === 'number' && t >= 41000000 && t < 42000000) { grantPair(conn, t, 1); }
    else if (typeof t === 'number') { grantServant(conn, t); dropTypes.push(t); }
  }
  if (dropTypes.length) {
    b.dropServants = dropTypes.map(t => ({ id: t, val: 1, type: 1 }));
    b.dropServant = b.dropServants[0];
  }
  for (const amount of scoreAdds) L.addScore(conn, 29, amount);
  for (const commit of commits) commit();
  S.mapState && (S.mapState.collabPaid = 0); // 允许再战重新扣费
  saveState();
  // 释放出战队伍（六十三少女终末先例）：init_barrier 上锁后若结算不推释放包，
  // 客户端 CopyMgr.nowTeamList 残留该队，再出击任何副本选同队都被"该队伍正在战斗中"拦死
  //（纯客户端内存态，重登才恢复）；编队面板"战斗中"标记也一并清掉。pushTeamReset 读
  // S.mapState.use_team_ids 并只清 locked 标记，mapState 本体保留（下方 lty 推送还读它）。
  try { require('./servant').pushTeamReset(conn); } catch (e) { /* 忽略 */ }
  // 达拉崩吧阶段有推进时，向客户端同步阶段与物件可见性（必须在进度落盘后发送）。
  if (ltyProgressed || meta.family === 'lty-dragon' || meta.family === 'lty-princess') {
    const ltyNow = s.lty;
    conn.sendToc('m_theater_map_step_update_toc', { step: ltyNow.step });
    conn.sendToc('m_theater_map_obj_update_toc', { objs: getLtyObjList(ltyNow) });
  }
  // 任务联动（collab 专属 cond → activity.advanceMissions 的 collab 分支）
  require('./activity').advanceMissions(conn, {
    collab: 1,
    collabKillTrainers: Object.keys(trainers).length ? trainers : null,
    ultimaGrade: meta.family === 'bili-ex' ? s.bili.grade : null,
    collabMiracle: meta.family === 'bili-ex' ? 1 : 0, // 本地服无独立演武玩法：演武任务按战斗计（口径备注）
    collabMainPass: meta.family === 'dal-main' ? 1 : 0,
  });
  // 活动扩展事件（小千日记"通关任意活动关卡10次"等联动）
  try { require('./act_extra').actEvent(conn, 'battle', 1, null); require('./act_extra').actEvent(conn, 'kill', kills, null); } catch (e) { /* 忽略 */ }
}

// ---- collab 任务事件桥（actEvent 各业务点调用 → activity.advanceMissions collab 分支）----
function collabMissionEvent(conn, ev, n) {
  try {
    n = n || 1;
    const map = {
      train: { collabTrain: n },        // cond 16 誓灵训练（星象馆 2 次）
      dispatch: { collabDispatch: n },  // cond 9 远征派遣（3 次）
      summon: { collabSummon: n },      // cond 7 誓灵召唤（1 次）
      silver: { silverSpent: n },       // cond 70 消耗金币（2000）
      daily: { planDailyDone: 1 },      // cond 69 完成 4 个活动日常（日常领取时驱动）
    };
    const evObj = map[ev];
    if (evObj) require('./activity').advanceMissions(conn, Object.assign({ collab: 1 }, evObj));
  } catch (e) { log('!! collabMissionEvent 失败 ' + e.message); }
}

// 星梦通行证活动 ID 与对应引擎 ID 的双向映射（确保成对激活与下发 buff）
const ENGINE_PAIRS = {
  1082: 1083, 1083: 1082,
  1108: 1107, 1107: 1108,
  1314: 1311, 1311: 1314,
  1326: 1325, 1325: 1326,
  1328: 1327, 1327: 1328,
};
const ENGINE_BUFF_EXPIRY = 2147483647; // 永不过期（MAX_INT32，防客户端 updateTime 秒级清除）
const ENGINE_BUFF_VALUE = 12000;       // 官方 20% 加成公式 (12000 - 10000) / 100 = 20%

// ---- 加速引擎（shop 3 购买 / GM m21_act_engine）----
function engineBuy(conn, engineAct, actId, scoreId) {
  const s = st();
  if (!actId || !scoreId) {
    for (const [k, sd] of Object.entries(C.STAR_DREAM || {})) {
      if (sd.engineAct === engineAct || k === String(engineAct)) {
        actId = actId || Number(k);
        scoreId = scoreId || sd.scoreId;
        break;
      }
    }
  }
  engineAct = Number(engineAct);
  actId = actId ? Number(actId) : (ENGINE_PAIRS[engineAct] || engineAct);
  s.engine[engineAct] = 1;
  if (actId) s.engine[actId] = 1;
  if (ENGINE_PAIRS[engineAct]) s.engine[ENGINE_PAIRS[engineAct]] = 1;
  if (ENGINE_PAIRS[actId]) s.engine[ENGINE_PAIRS[actId]] = 1;
  saveState();

  // RoleMgr.updateBuyEngine 读 buffHash（buff_type=3, type=engineActID 或 actID）
  // 必须成对下发，且 end_time 必须有效未来的时间戳，buff_value 为 12000 (+20%)
  const idSet = new Set([engineAct, actId]);
  if (ENGINE_PAIRS[engineAct]) idSet.add(ENGINE_PAIRS[engineAct]);
  if (ENGINE_PAIRS[actId]) idSet.add(ENGINE_PAIRS[actId]);
  const buffs = Array.from(idSet).map(id => ({
    type: id,
    buff_type: 3,
    buff_value: ENGINE_BUFF_VALUE,
    end_time: ENGINE_BUFF_EXPIRY,
  }));
  conn.sendToc('m_role_buff_update_toc', { buffs });

  // 购买即刻获得奖励：10000 + floor(当前持有量 * 0.2) 晶石/晶体（按官方公式追溯加成）
  if (scoreId) {
    const cur = L.getScore(scoreId);
    const bonus = 10000 + Math.floor(cur * 0.2);
    L.addScore(conn, scoreId, bonus);
    log(`[collab] 加速引擎购买奖励：scoreId=${scoreId} +${bonus} (含10000基础+当前${cur}的20%)`);
    if (actId) {
      try {
        require('./act_extra').pushScoreInfo(conn, actId);
      } catch (e) {
        log('!! pushScoreInfo 失败: ' + e.message);
      }
    }
  }
  log(`[collab] 加速引擎激活 engineAct=${engineAct} actId=${actId || ''}`);
}
function engineBuffs() {
  const s = st();
  const idSet = new Set();
  for (const k of Object.keys(s.engine)) {
    if (s.engine[k]) {
      const id = Number(k);
      idSet.add(id);
      if (ENGINE_PAIRS[id]) idSet.add(ENGINE_PAIRS[id]);
    }
  }
  return Array.from(idSet).map(id => ({
    type: id,
    buff_type: 3,
    buff_value: ENGINE_BUFF_VALUE,
    end_time: ENGINE_BUFF_EXPIRY,
  }));
}

module.exports = {
  handlers, st, settleCollab, entryOk, barrierSetOf, clearChapter, chapterVal, openStarNum,
  sendPlanetarianInfo, collabMissionEvent, engineBuy, engineBuffs, grantServant, grantPair,
  ltyState, getLtyObjList,
};
