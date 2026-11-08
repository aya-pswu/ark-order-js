// 本地服入口（装配 + 启动）。
// 【交接重点】代码已按域拆分（2026-08-22 重构，逻辑未变）：
//   state.js                全部玩家状态（S 容器）+ loadState/saveState —— 新增状态只改这一处
//   accounts.js             账号库（注册/登录/token/按账号存档路由；存档在 saves/<账号>.json）
//   lib.js                  共享工具（log/defaultFill/buildRoleData）+ 跨域推送（物品/货币）
//   data/map_configs.js     关卡地图配置（MAP_CONFIGS + rollDropTier）
//   handlers/role.js        登录/角色/货币/GM/功能解锁
//   handlers/servant.js     誓灵/皮肤/编队/看板娘
//   handlers/bag.js         背包/物品
//   handlers/map_fight.js   关卡/地图/战斗/结算
//   handlers/dorm.js        协会/家具/建筑/派遣
//   handlers/activity.js    活动/小游戏/任务/图鉴
//   handlers/relic.js       圣器/能力核心装备（装备/卸下/核心升级/分解）
//   handlers/family.js      结社（创建/成员/签到/公告/申请审批/职位/退社/搜索/宝箱来袭/结社商店）
//   handlers/shop.js        主页通用商店（限时特惠轮换/角色换装/优惠礼盒/辅助道具/买金币；结社商店委托 family）
//   handlers/vit.js         体力（顶栏数值与上限/研究所产出领取/买体力/道具使用/出击扣体力）
//   handlers/ark.js         天空方舟（协会入口：科研树/燃料跃迁/探索队/地图事件/指令战）
//   handlers/altar.js       祭坛（协会入口：阵营名气/供奉/祭坛 buff——通关 3-4 功能 26）
//   handlers/handbook.js    图鉴（正式/联动/皮肤/灵契/狂化 + 羁绊剧情奖励 + 点赞；剧情图鉴在 activity.js m_theatre_*）
//   handlers/summon.js      召唤（主页"召唤"：卡池列表/概率详情/抽卡结算/卡池关闭/灵契召唤）
//   handlers/dream.js       银匙之门/幻梦战（主线页 btnDream，功能16 通关5-4）：130 关 + 布阵 + 怒气/机制战斗引擎
// 各域 handler 通过 Object.assign 合并；fallbackHandler 兜底任何未注册的 *_tos
//（无同名 toc schema 的回 m_common_reply_toc，防客户端 1 秒等待弹 loading）。
const path = require('path');
const proto = require('./proto');
const { startGameServer } = require('./game_server');
const { startHttpRouter } = require('./http_router');
const NET = require('./net_check');
const { useAccount, flushSave } = require('./state');
const ACC = require('./accounts');
const L = require('./lib');

const KEY_LUA = path.join(__dirname, '..', 'tools', 'key_lua');

// ---- 启动横幅（Ark Order JS 艺术字 + 版本行；日志里也会留一份） ----
L.log.banner();

const tProto = Date.now();
const { protos, alias, byId } = proto.load(KEY_LUA);
L.log.db(`协议表载入 ${Object.keys(protos).length} 个消息 + ${Object.keys(alias).length} 个别名（${Date.now() - tProto}ms）`);

const argOf = p => { const a = process.argv.find(x => x.startsWith(p + '=')); return a ? a.split('=')[1] : undefined; };
const HTTP_PORT = parseInt(argOf('--port') || process.env.HTTP_PORT || '8081');
const GAME_PORT = parseInt(argOf('--game-port') || process.env.GAME_PORT || '9021');
const HOST_IP = argOf('--host') || process.env.HOST_IP || '127.0.0.1';

// 通用兜底：任何未处理的 *_tos 若存在同名 *_toc 则回默认填充；
// 否则回 m_common_reply_toc {proto_id:0}（客户端静默忽略但会重置 1 秒网络等待计时器）
// ⚠️ 毒包防线（2026-10-17 azhi 真机暗噬崩溃实证）：defaultFill 把"单实体 id"字段填 0，
// 客户端 ServantMgr.getServant(0)=nil → `attempt to index a nil value` 崩（D1"回包只有一个 id"类，
// 正中 m_servant_chaos_upgrade_toc 本次与首通奖励/break_item 历史 2 例）。凡 toc 含 servant_id/id
// 实体字段的，兜底一律回 m_common_reply_toc：客户端静默忽略 + 1 秒等待复位，绝不写坏状态。
function fallbackHandler(name) {
  const toc = name.replace(/_tos$/, '_toc');
  if (!fallbackHandler.seen) fallbackHandler.seen = new Set();
  if (!fallbackHandler.seen.has(name)) {
    fallbackHandler.seen.add(name);
    L.log.warn(`[proto] 未注册 handler: ${name} → ${toc}`);
  }
  if (process.env.STRICT_PROTO_FALLBACK === '1') {
    return conn => conn.sendToc('m_common_reply_toc', { proto_id: 0 });
  }
  if (toc !== name && protos[toc]) {
    const fields = (protos[toc].fields || []).map(f => f[0]);
    const entityField = fields.includes('servant_id') ? 'servant_id' : (fields.includes('id') ? 'id' : null);
    if (entityField) {
      L.log.warn(`[proto] ${toc} 含实体字段 ${entityField}，兜底拒绝 defaultFill（防 getServant(0)/index 0 崩）→ m_common_reply_toc`);
      return conn => conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    }
    return conn => conn.sendToc(toc, L.defaultFill(toc));
  }
  return conn => conn.sendToc('m_common_reply_toc', { proto_id: 0 });
}

const handlers = Object.assign({},
  require('./handlers/role').handlers,
  require('./handlers/servant').handlers,
  require('./handlers/chaos').handlers,
  require('./handlers/bag').handlers,
  require('./handlers/element').handlers, // 元素精灵（装备/融合/转化/外形/还原）：无覆盖协议，装配顺序无关
  require('./handlers/map_fight').handlers,
  require('./handlers/dorm').handlers,
  require('./handlers/activity').handlers,
  require('./handlers/act_extra').handlers, // 活动扩展（2026-09-12 批量落地 23 个活动；无覆盖协议，仅新增）
  require('./handlers/relic').handlers,
  require('./handlers/family').handlers,
  require('./handlers/shop').handlers,   // 通用商店：在 family 之后装配（覆盖 m_shop_*，结社商店按 shopId 委托回 family）
  require('./handlers/vit').handlers,
  require('./handlers/ark').handlers,
  require('./handlers/altar').handlers,
  require('./handlers/handbook').handlers, // 图鉴（正式/联动/皮肤/灵契/狂化；剧情图鉴在 activity/role 的 m_theatre_*）
  require('./handlers/story_reward').handlers, // 主线首通奖励 + 主线双倍（无覆盖协议，装配顺序无关）
  require('./handlers/feeling').handlers,   // 羁绊（宿舍送礼/心愿/灵契/寄语/昵称）——同样无覆盖协议
  require('./handlers/skill_choice').handlers, // 作战策略（m_servant_ai_*：模式/方案/循环/应用）——无覆盖协议
  require('./handlers/summon').handlers,   // 召唤（卡池列表/概率详情/抽卡/卡池关闭/灵契召唤）——无覆盖协议
  require('./handlers/dream').handlers,    // 银匙之门（幻梦战）：**必须在 map_fight 之后装配**——
  // 它覆盖 m_copy_fight_tos/m_fight_servant_start_tos/m_fight_skill_select_tos，
  // 非幻梦 copy_id 一律回落 map_fight.handlers（见 handlers/dream.js 战斗链段）
  require('./handlers/achievement').handlers, // 成就（主页→成就）：info/get + 各业务计数器钩子
  require('./handlers/daily_copy').handlers, // 曜日副本（每日材料本，功能4 通关2-3）
  require('./handlers/dare').handlers,    // 唤灵殿堂（功能10 通关3-1）：**在 daily_copy 之后装配**——
  // 它拦截 m_copy_fight_tos/m_copy_fight_prepare_tos 的 dare copyID（100001xx/1001xx00），
  // 非 dare 一律显式回落 daily_copy（再回落 dream → map_fight），同曜日的回落链；
  // 若装配在 daily_copy 之前，其 m_copy_fight_tos 会被曜日的同名 handler 覆盖导致永不生效
  // 它覆盖 m_copy_barrier_info_tos（copy≠2 回落 map_fight）与 m_copy_fight_tos
  //（非曜日 copy_id 回落 **dream**，dream 再回落 map_fight —— 三者串成一条链，顺序反了会丢中间环节）。
  // 回合链/结算链原样复用 map_fight 引擎：曜日 9 关以合成 MAP_CONFIG 注册（见 data/daily_copy_data.js）
  require('./handlers/tower').handlers,   // 无尽冒险（功能8 通关2-4）：**最后装配**——
  // 拦截 m_tower_* 全族 + 塔战会话的 m_fight_servant_start_tos/m_fight_skill_select_tos
  //（非塔会话显式回落 map_fight）；m_copy_fight_prepare_tos 客户端塔战走 m_tower_prepare_tos
  // 所以不与 dare/map_fight 冲突
  require('./handlers/guide').handlers,   // 新手引导（进度跟踪/自设名/选灵/引导二战）：**塔之后装配**——
  // 覆盖 role.js 的 m_role_guide_do_tos 旧空实现；拦截 m_copy_fight_tos 的 9000001（引导二战，
  // 设合成 mapState 后回落 map_fight 引擎），非引导 copy 回落 tower（→dare→daily_copy→dream→map_fight）。
  // start_tos/select_tos 无需拦截：会话标记（S.towerFight 等）为空时链路天然放行到 map_fight，
  // mapCfg() 按 S.mapState.barrierId=9000001 命中 guide_data.GUIDE_MAP_CONFIGS
  require('./handlers/grow').handlers,    // 御灵士（协会"养成"）：星图 astrolabe + 化身装扮 costume。
  // 无覆盖协议（m_role_costume_tos 客户端定义未调用，化身数据登录时服务端主动推），装配顺序无关；
  // 效果接入点：vit.pushLimit（36/37）、lib.bagSizeOf（40/41）、map_fight 结算（43 专注加倍 + 星云点）、
  // dorm 派遣奖励（44 效率提升）、vit.studyPending（32/33/34/35 研究所产量与储存）
  require('./handlers/moment').handlers,  // 言灵录（ServantMoment，主界面左侧栏）：列表/详情/点赞/选项回复/
  // 自定义回复/按誓灵筛选。无覆盖协议，装配顺序无关；解锁判定见 handlers/moment.js 的 checkUnlocks，
  // 由登录 + 协会入住/派遣/map_fight 胜利/summon 获得誓灵等勾子触发
  require('./handlers/letter').handlers,  // 信件（邮件面板）：page/read/accept/delete/lock。
  // 无覆盖协议（死协议 m_letter_open/get_receive 留给兜底），装配顺序无关；
  // onLogin 由 role.js triggerLoginPushes 挂（欢迎信/72h 公益信判定 + m_letter_light_toc 红点）
  require('./handlers/title').handlers,   // 称号（前缀/后缀佩戴）：list/active/select。
  // 无覆盖协议，装配顺序无关；附件称号盒由 letter.js 领取路径调用 grantTitle
  require('./handlers/artwork').handlers, // 贴纸涂鸦板（个人主页 RoleArtworkView）：info/graffiti/place/unlock 四协议。
  require('./handlers/avatar').handlers,  // 头像/头像框（二百九十七）：border detail/change/check + head check/change/buy。装配顺序无关（无覆盖协议）
  // 无覆盖协议，装配顺序无关；素材发放收口在 lib.grantGoods 261 分支（关卡掉落/活动/赫拉/GM/贴纸道具使用全覆盖）
  require('./handlers/collab').handlers,  // 三联动（约会大作战/苍色的试炼/星象馆通讯）：**必须最后装配**——
  // 覆盖 m_copy_fight_tos/m_copy_fight_prepare_tos/m_team_template_select_tos，非 collab copy_id
  // 显式回落 guide（→tower→dare→daily_copy→dream→map_fight），保持整条回落链完整
  require('./handlers/faith').handlers,   // 信仰（功能12 通关6-4）：装备/卸下/全卸/升级/洗练/分解/召唤/方案全13协议。
  // 无覆盖协议（m_faith_* 全族仅此一处实现），装配顺序无关
  require('./handlers/rank').handlers,    // 排行榜（主页右下"排名"）：m_rank_get_info/rank 两协议 + NPC 陪跑。
  // 无覆盖协议，装配顺序无关（2026-09-17 修：此前未注册 → fallback 空壳 self_row 导致打开即崩）
  require('./handlers/auto_dispatch').handlers, // 协会派遣·自律派遣（tab6，m_copy_auto_* 8 条）。
  // 无覆盖协议，装配顺序无关。⚠️ 它与 dorm.sendCrusadeDetail 里的 101 是**一对**：
  // 只发 101 不实现 → 卡片可点、点派遣毫无反应；只实现不发 → 卡片空白 + 剩余自律队列恒 0
);
const arkMod = require('./handlers/ark');
const towerMod = require('./handlers/tower');

const ctx = {
  protos, alias, byId, log: L.log,
  hostIp: HOST_IP,
  gamePort: GAME_PORT,
  // 心跳钩子：科研到点自动结算（客户端没有"领取完成"按钮，官方语义是服务端到点推 finish_toc）
  // + 无尽冒险自动战斗（30 秒一场，到点在服务端离线结算整场并推状态）
  onHeartbeat: conn => {
    arkMod.settleExpiredQueue(conn);
    try { towerMod.autoFightTick(conn); } catch (e) { L.log('!! 塔自动战斗 tick 失败', e.message); }
  },
  handlers: new Proxy({}, {
    get(target, prop) {
      if (prop in handlers) return handlers[prop];
      return fallbackHandler(prop);
    },
  }),
};

const HANDLER_COUNT = Object.keys(handlers).length;
L.log.ok(`注册 ${HANDLER_COUNT} 个 handler（未命中者由 fallbackHandler 兜底）`);

// 账号库引导：建 saves/ 目录；首次运行把旧的单一存档 player_state.json 迁成 saves/player.json。
// 启动时先载入"上次登录的账号"的存档；真正的账号选择在 m_auth_key_tos（handlers/role.js）按
// 客户端上报的 uid 重新切档。
const tDb = Date.now();
ACC.bootstrap();
const bootAcc = ACC.bootAccount();
useAccount(bootAcc);
L.log.db(`账号库 ${ACC.list().length} 个账号，当前存档 ${bootAcc ? bootAcc.name : '(无)'}（${Date.now() - tDb}ms）`);

// 两个 listen 回调都到齐后再打就绪块（否则监听行会掉到分隔线外面）
let readyCount = 0;
const onReady = () => {
  if (++readyCount < 2) return;
  // 单机版（node 树）：44587 由**本进程**起。PCJS 不用这条路径——start.ps1 会另开一个窗口
  // 跑 `node lua_remote.js`；而 node 树只有一个进程，没有它客户端会卡在"启动中"等 Lua 整帧。
  // 顺序要求：必须在 HTTP/GAME 都 listen 之后 attach（否则客户端 Lua 会在 http/game 尚未就绪时
  // 提前拉包 → 启动慢 / "网络较差"重连弹窗，见 问题工作日志-启动慢.md 首启流程第 4 条）。
  // 默认关闭，PCJS 与 Jint 线行为不变。
  if (process.env.PS_LUA_REMOTE_INPROC === '1') {
    try {
      require('./lua_remote');
      L.log.db('[lua-remote] 44587 已随本进程启动（PS_LUA_REMOTE_INPROC=1）');
    } catch (e) {
      L.log.err('[lua-remote] 启动失败：' + (e && e.message ? e.message : e));
    }
  }
  L.log.section('Ark Order JS 就绪', [
    { label: 'HTTP', value: `${HOST_IP}:${HTTP_PORT}` },
    { label: 'GAME', value: `0.0.0.0:${GAME_PORT}（对外 ${HOST_IP}）` },
    { label: 'handlers', value: `${HANDLER_COUNT} 个` },
    { label: 'protos', value: `${Object.keys(protos).length} 条` },
    { label: 'account', value: bootAcc ? bootAcc.name : '(无)' },
    { label: 'logs', value: 'server/logs/server.log' },
  ]);
  L.log.ok('本地服启动完成 —— 关窗即停服，或用 stop.bat');
};

// ---- 监听失败时的编排（2026-09-13 事故加固）----
// 背景：80 被内核 HTTP.sys（IIS）代持 → EACCES；原先 http_router 没有 error 处理器，
// 这个异常把整个进程带走，连已经正常服务的 9021 游戏服一起死——玩家侧表现为"全部掉线"。
// 现在：失败方由 net_check 打印语义化诊断（原因 + 三条修复出路），然后在这里决定进程去留：
//   · HTTP 起不来、GAME 起来了 → 让游戏服继续跑（能进游戏，只是资源/账号 API 不通），
//     并明确提示"修好 IIS 后需重启本服务"，而不是静默退出把玩家全踢掉；
//   · GAME 起不来 → 玩家完全进不去，保留窗口让日志可读，退出码 1。
const startOrder = { HTTP: false, GAME: false };
const listenFailed = {};
process.on('exit', code => { if (code) L.log.err(`[net] 进程退出，code=${code}`); });
let shuttingDown = false;
function flushAndExit(signal, code) {
  if (shuttingDown) return;
  shuttingDown = true;
  try { flushSave(); } catch (e) { L.log.err(`[state] ${signal} 退出前落盘失败：${e.message}`); }
  L.log.warn(`[net] 收到 ${signal}，已完成退出前存档落盘`);
  if (typeof httpServer !== 'undefined' && httpServer) httpServer.close();
  if (typeof gameServer !== 'undefined' && gameServer) gameServer.close();
  process.exit(code);
}
process.once('SIGINT', () => flushAndExit('SIGINT', 0));
process.once('SIGTERM', () => flushAndExit('SIGTERM', 0));
process.once('SIGHUP', () => flushAndExit('SIGHUP', 0));
process.once('beforeExit', () => { try { flushSave(); } catch (e) { L.log.err(`[state] beforeExit 落盘失败：${e.message}`); } });
process.once('uncaughtException', err => {
  L.log.err(`[fatal] uncaughtException: ${err && err.stack ? err.stack : err}`);
  flushAndExit('uncaughtException', 1);
});
process.once('unhandledRejection', reason => {
  L.log.err(`[fatal] unhandledRejection: ${reason && reason.stack ? reason.stack : reason}`);
  flushAndExit('unhandledRejection', 1);
});

const onListenError = (role, info) => {
  listenFailed[role] = info;
  const other = role === 'HTTP' ? 'GAME' : 'HTTP';
  if (startOrder[other]) {
    // 另一个服务已经在跑 → 保留进程，避免"连坐"
    L.log.warn(`[net] ${role} 未启动，但 ${other} 已在正常服务；进程继续运行。`
      + `修好端口后请重启本服务使 ${role} 生效。`);
    if (Object.keys(listenFailed).length >= 2) {
      L.log.err('[net] 两个服务都没起来，本进程无事可做，退出。');
      setTimeout(() => process.exit(1), 300);
    }
    return;
  }
  L.log.err('[net] 关键服务启动失败，本进程退出。');
  setTimeout(() => process.exit(1), 300);
};

// 启动前先体检一次端口（人话提示，非阻塞）——把"能不能绑"提前讲清楚
NET.reportPreflight(HTTP_PORT, 'HTTP', L.log);
NET.reportPreflight(GAME_PORT, 'GAME', L.log);

const httpServer = startHttpRouter(HTTP_PORT, ctx, onReady, info => onListenError('HTTP', info));
const gameServer = startGameServer(GAME_PORT, ctx, onReady, info => onListenError('GAME', info));
// 标记"已发起启动"（listen 回调可能晚于错误回调，用 listening 状态判定更稳）
httpServer.on('listening', () => { startOrder.HTTP = true; });
gameServer.on('listening', () => { startOrder.GAME = true; });
