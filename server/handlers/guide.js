// 新手引导（Guide，2026-09-04 三十九）：引导进度跟踪 + 自设名 + 选灵 + 引导二战。
// 客户端机制与协议语义见 data/guide_data.js 头注释。
// ⚠️ 装配顺序：本模块必须在 start.js **最后**装配——
//   · m_role_guide_do_tos 覆盖 role.js 的旧空实现（那边只回空列表 = 关引导口径）；
//   · m_copy_fight_tos 拦截 9000001（引导二战），非引导 copy 回落 tower（→dare→daily_copy→dream→map_fight 链）。
const stateMod = require('../state');
const { S, saveState } = stateMod;
const L = require('../lib');
const { log } = L;
const GD = require('../data/guide_data');
const { makeServantBrief, buildFormation, teamServantOf, pushServantsBrief, sendFormationBriefs } = require('./servant');
const MF = require('./map_fight');
const FC = require('../data/fight_core');

// ---- 引导状态 ----
const st = () => S.guideState; // null = 老档/全部完成（登录口径见 lib.buildRoleData）
function isGuideFresh() { return !!st(); }
// 当前未完成组列表（仅引导档有内容；老档恒 []）
function unfinishedGroups() {
  const s = st();
  if (!s) return [];
  const done = new Set((s.done || []).map(Number));
  return GD.FRESH_UNFINISHED.filter(id => !done.has(id));
}
// p_role_guide 单对象（schema 标 array 但客户端按对象访问，见 role.js 旧注释）
function guidePayload() {
  const s = st();
  return {
    guide_groups: unfinishedGroups(),
    last_guide_id: s ? (Number(s.last) || 0) : GD.FINISHED_LAST_ID,
  };
}
function pushGuideInfo(conn) {
  conn.sendToc('m_role_guide_info_toc', { guide: guidePayload() });
}
// GM 用（m21_guide_reset=1 重置 / =0 跳过）
function resetGuide() { S.guideState = { done: [], last: 0 }; saveState(); }
// 跳过引导 = 切回老档口径。若此时还没选灵（0 誓灵），必须补发初始誓灵：
// 主城 MainFunctionPanel 的 chatView/hoop/触摸等无保护读 servant（见 lib.js 注释），
// 0 誓灵进主城会崩 —— 引导中途卡住时这条 GM 是唯一逃生口，不能留个崩溃态。
function skipGuide() {
  S.guideState = null;
  if (!S.servants.length) {
    for (const t of stateMod.STARTER_TYPES) { const b = makeServantBrief(t); if (b) require("./servant").grantServantBrief(b); }
    const f = S.formations[1] = S.formations[1] || {};
    if (!Array.isArray(f.field) || !f.field.some(id => Number(id) > 0)) {
      f.field = [S.servants[0].id, S.servants[1] ? S.servants[1].id : 0, S.servants[2] ? S.servants[2].id : 0];
      f.bench = [0, 0, 0];
      f.servants = f.field.filter(id => id > 0).map(id => teamServantOf(id, 1, 1));
    }
    log(`[guide] 跳过引导：补发初始誓灵 ${S.servants.length} 只并编入队伍 1（0 誓灵进主城会崩）`);
  }
  saveState();
}

// ---- 组 7 学技能材料兜底 ----
// 组7 步6（lightClick checkFun="canStudy"）与步7（学习按钮 btnOper.IsEnabled）都受客户端
// 材料门禁（技能模组持有数 ≥ 技能档位 lv，见 guide_data.GUIDE_SKILL_ITEM 注释），模组为零
// 整组卡死。挂"组7 任意上报"上：新档首跑 / 老档重置重看 / 卡死重登（last=6 → 客户端
// tryDoGroup(7) 重入，CfgGuide 组7 onlineCheck=true）三条路都会踩到；按持有数补齐，幂等。
function ensureSkillMaterial(conn) {
  const ITEM = GD.GUIDE_SKILL_ITEM, NUM = GD.GUIDE_SKILL_ITEM_NUM;
  const owned = S.bagGoods.filter(g => g.type_id === ITEM).reduce((a, g) => a + (Number(g.cur_num) || 0), 0);
  if (owned >= NUM) return;
  const changed = L.grantGoods(ITEM, NUM - owned, conn);
  saveState();
  L.pushGoodsUpdate(conn, changed, 3);
  log(`[guide] 组7 补发学习材料 技能模组Lv1(${ITEM}) ×${NUM - owned}（原持有 ${owned}，补到 ${NUM}）`);
}

// ---- 组 40 背包引导的引导箱兜底 ----
// 组 30 的 saveStep=2：步 2 领取 30999（引导箱入包）后整组即保存。若旧会话在组 30 步 3
// 卡死后靠重登跳到组 40，并把箱子开掉仍未完成组 40（真机 2026-09-05 实证），
// 重登续跑组 40 步 2 的 lightClick(checkFun="isGuideBox") 找不到目标会再次卡死。
// 组 40 任意上报时补一个引导箱，幂等（包里还有就不补）。
function ensureGuideBox(conn) {
  const ITEM = GD.GUIDE_BOX_TYPEID;
  const owned = S.bagGoods.filter(g => g.type_id === ITEM).reduce((a, g) => a + (Number(g.cur_num) || 0), 0);
  if (owned > 0) return;
  const changed = L.grantGoods(ITEM, 1, conn);
  saveState();
  L.pushGoodsUpdate(conn, changed, 3); // 静默入包（引导道具，无需弹窗）
  log(`[guide] 组40 补发引导箱 ${ITEM} ×1（包内已无，续跑步 2 需要 isGuideBox 目标）`);
}

// ---- 走图收尾的出战队伍释放兜底（组 30 起）----
// 1-1 走图组（20~25）的出图走的是组25步3引导的**主页按钮**（MainPanel/objTop/btnHome →
// WindowsManager.closeAll），客户端不发 m_map_quit_tos；m_map_pause_tos(1) 释放钩子
// （map_fight.js）正常会兜住，这里再按"引导已推进到组30+"兜底一次：任何组≥30 的上报都意味着
// 玩家已回主城，若走图遗留的 mapState（use_team_ids 非空）还在，说明队伍标记未释放 →
// 客户端 CopyMgr.nowTeamList 残留会让组50/51 装圣器/核心时被"该誓灵正在战斗中"拦死
//（ServantUtil.isBattleNow：出战队伍列表含该誓灵，无需 status 位；2026-09-30 真机卡死实证）。
// 【2026-10-12 修正】"组≥30 = 已回主城"的假设不成立：引导组 100（自动战斗提示，战斗界面弹出）、
// 101（搜寻敌人提示，地图中弹出）乃至后续任何战斗/地图内引导都是 ≥30——原实现会在战斗进行中
// 把 mapState+fightState 整个释放（推 reset_barrier_toc + m_map_quit_toc），之后所有
// m_fight_skill_select_tos 一律 err_code:1，客户端 nowActSarvant 回到队首 → 无限重选技能/
// 自动战斗失效/取消后地图会话已死必须重进副本（用户日志 16:05:15 与 15:55:14 两次实证）。
// 修正：战斗**真进行中**（fighting 气泡挂起 或 fightState 存在且未终局 over）绝不释放；
// 但战斗胜利终局（map_fight 置 st.over=1）后必须允许释放——组51"装生命核心"引导前
// 客户端 CopyMgr.nowTeamList 还挂着开战队伍（isBattleNow 弹"该誓灵正在战斗中"拦死），
// 本兜底是唯一释放口（2026-10-12 E2E 新号 1-1 通关后实证；此前终局不清 over 导致守卫
// 永远挡住 → 一百二十五卡死复发）。
function releaseWalkthroughTeam(conn, group) {
  if (group < 30) return;
  const ms = S.mapState;
  if (!ms || !(ms.use_team_ids || []).some(id => Number(id) > 0)) return;
  if (ms.fighting || (S.fightState && !S.fightState.over)) return; // 战斗进行中/会话未终局：不是残留，绝不释放
  MF.releaseMapSession(conn, `引导组${group} 回主城（主页按钮出图未发 quit）`, { quitToc: ms.barrierId });
}

// ---- 引导进度上报 ----
// 客户端 GuideModule.m_role_guide_do_tos(gid, state, isGroup)：isGroup=true 时 gid=组id*1000。
// state：1=组开始（doGroup）2=组保存/完成（saveStep 达到时）0=步骤进度（gid=组*1000+step）。
// 回包 m_role_guide_info_toc 必须是**当前准确**的未完成列表（客户端拿它重建未完成表）。
function handleGuideDo(conn, obj) {
  const gid = Number((obj && obj.guide_id) || 0);
  const state = Number((obj && obj.state) || 0);
  const group = Math.floor(gid / 1000);
  const step = gid % 1000;
  if (state === 2 && group > 0 && st()) {
    const s = st();
    if (!s.done.includes(group)) s.done.push(group);
    s.last = group; // 官方语义：last_guide_id = 最后保存到的组（断线续跑的锚点）
    saveState();
  }
  if (group === 7 && st()) ensureSkillMaterial(conn); // 学技能材料兜底（步6 之前必须到包）
  if (group === 40 && st()) ensureGuideBox(conn);     // 背包引导目标箱兜底（步2 isGuideBox 目标）
  // 元素精灵「激活」：组 122 是空壳组，客户端点元素槽位时发 guide_do(122,2,true) 然后 return
  //（ServantPropRelicView:65）。服务端只记完成不够 —— 必须补推 FUNC_ID_ACT_ELEMENT=22，
  // 客户端 GuideMgr 合并后 isActed() 才为真、并立即弹出元素精灵说明面板
  //（ActivityModule.dealwithNextAct → ElementModule.openHelpInfoPanel）。2026-10-23。
  if (group === L.GUIDE_ELEMENT_ACT) {
    // 老档 guideState 可能为 null（引导全部完成）→ 上面那段 `if (state === 2 && st())` 不会记 done，
    // 所以激活位必须单独落盘（S.elementActivated），否则重启后 22 丢失、元素装备槽又变回"未激活"。
    S.elementActivated = 1;
    saveState();
    L.pushFunctionUpdate(conn, [22]);
  }
  releaseWalkthroughTeam(conn, group);                // 组30+ 兜底释放走图出战队伍（防"正在战斗中"拦死装核心）
  pushGuideInfo(conn);
  log(`[guide] 上报 guide_id=${gid}${state !== 0 ? `（组 ${group}）` : `（组 ${group} 步 ${step}）`} state=${state}`
    + ` → 未完成 [${unfinishedGroups().join(',') || '无'}] last=${guidePayload().last_guide_id}`);
}

// ---- 自设名（组 4：剧情 10001 中段 TheaterNormalPanel 派发 OPEN_RENAME_PANEL）----
// GuideInputNamePanel.onClickBtnRename → m_role_rename_tos{op_type:0, new_name}。
// 成功后客户端自行发 guide_do(4,2,true) 关面板推进组 5；err_code≠0 → 面板 errorName 状态。
function handleRename(conn, obj) {
  const opType = Number((obj && obj.op_type) || 0);
  const name = String((obj && obj.new_name) || '').trim();
  // 客户端 onInputChange 截到 8 个字符（utf8.len>7 → sub(1,8)），服务端同口径兜底
  const CLAMP = 8;
  let chars = [...name];
  if (chars.length > CLAMP) chars = chars.slice(0, CLAMP);
  const finalName = chars.join('');
  if (!finalName) {
    conn.sendToc('m_role_rename_toc', { err_code: 1, op_type: opType, need_gold: 0, new_name: String((obj && obj.new_name) || '') });
    log(`[guide] 改名拒绝：名字为空`);
    return;
  }
  S.roleName = finalName;
  saveState();
  conn.sendToc('m_role_rename_toc', { err_code: 0, op_type: opType, need_gold: 0, new_name: finalName });
  log(`[guide] 改名成功：${S.roleName}（op_type=${opType}）`);
}

// ---- 选灵（组 5：OPEN_CASTING_PANEL → 玩家 4 选 1）----
// CastingMainPanel 点选 → m_servant_select_tos{index 1-4}；回 m_servant_select_toc{index} 后
// 客户端 closeMainPanel + ON_SERVANT_SELECT → tryDoGroup(GUIDE_SECOND_FIGHT=6) 进二战。
// 服务端职责：发放所选初始誓灵 + 设编队 1（二战 enter_list 从 buildFormation 取），
// 并把誓灵/编队推给客户端（二战结算面板 CopyRewardPanel 读 getTeamFormation(1)）。
function handleServantSelect(conn, obj) {
  const index = Number((obj && obj.index) || 0);
  const type = GD.STARTER_BY_INDEX[index];
  if (!type) {
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    log(`[guide] 选灵拒绝：非法 index=${index}`);
    return;
  }
  if (S.servants.length) { // 幂等：重复选灵（断线重发）不再发放
    conn.sendToc('m_servant_select_toc', { index });
    log(`[guide] 选灵重复请求 index=${index}，已有 ${S.servants.length} 只誓灵，仅回显`);
    return;
  }
  // 玩家选中的排第一（编队主力 1 位 + 看板娘），其余按 index 顺序补到 STARTER_FILL_COUNT 只
  const types = [type];
  for (const idx of Object.keys(GD.STARTER_BY_INDEX)) {
    if (types.length >= GD.STARTER_FILL_COUNT) break;
    const t = GD.STARTER_BY_INDEX[idx];
    if (!types.includes(t)) types.push(t);
  }
  const briefs = types.map(t => {
    const b = makeServantBrief(t);
    if (!b) return null; // 非法 type（已记日志）：不进编队、不推 brief，避免毒化客户端类型计数表
    b.level = GD.STARTER_LEVEL; // 组 7 学技能引导要求有可学技能（技能书第二档 lv3）
    require("./servant").grantServantBrief(b);
    return b;
  }).filter(b => b);
  // 编队 1：三只全部上主力（组 11/12 编队引导按"主力 3 槽填满"推进）
  const f = S.formations[1] = S.formations[1] || {};
  f.field = [briefs[0].id, briefs[1] ? briefs[1].id : 0, briefs[2] ? briefs[2].id : 0];
  f.bench = [0, 0, 0];
  f.servants = f.field.filter(id => id > 0).map(id => teamServantOf(id, 1, 1));
  S.helperState.lastHelper = briefs[0].id; // 看板娘 = 玩家亲手选的那只
  saveState();
  // 言灵录："获得X"（引导选灵发的誓灵同样要记获得时间）
  try {
    const MM = require('./moment');
    MM.onServantObtained(briefs.map(b => Number(b.type)));
    MM.checkUnlocks(conn);
  } catch (e) { /* 忽略 */ }
  // 数据先于 toc 到达：选灵面板关闭即进剧情/二战，结算面板要读编队 VO
  pushServantsBrief(conn);
  // 共享发送器（sendFormationBriefs 会记 formationBriefsSent，会话中途重推 servants brief 时才能正确重同步）
  sendFormationBriefs(conn);
  conn.sendToc('m_servant_select_toc', { index });
  const NATURES = ['', '水', '火', '风', '土', '光', '暗']; // fight_core nature 编码：1水 2火 3风 4土 5光 6暗
  log(`[guide] 选灵 index=${index} → 主选 type=${type}（${NATURES[FC.natureOf(type)] || '?'}）`
    + `+ 兜底 ${types.slice(1).join('/')}，共 ${briefs.length} 只 Lv${GD.STARTER_LEVEL}；`
    + `编队 1 field=[${f.field.join(',')}]，看板娘=${briefs[0].id}`);
}

// ---- 组 6 二战胜利奖励：小精灵（官方新手流程第 3 步，guide_data.GUIDE_PET_TYPE）----
// 由 map_fight.onBattleWon 的 guideCopy 分支调用（先于 pushFightResult，同步）：
// · 同步步：入 roster + 结算面板展示（st.dropServants → m_fight_result_toc.servant_reward）
//   + markPendingAnnounce（宣告前的 fame diff 必须跳过本实例，防 ServantMgr 查无此 sid 崩）
//   + 言灵录记账——与常规掉落同款。此时尚未入队，结算 servant_exp 不会带上它
//   （客户端 CopyRewardPanel 经验列表 = 编队 brief × servantExps 渲染，未宣告实例不进）。
// · 延迟 3s：m_servant_update_toc 宣告（同常规掉落，获取展示不盖战斗表现/剧情转场）+
//   自动加入编队 1（主力满员进替补席）+ formation briefs 重推——客户端 CopyMgr.formationBrief
//   是会话级缓存，不重推则编队面板要重登才见小精灵。
// 幂等键 = 是否已持有该 type：GM m21_guide_reset 重看引导时二战可重复打，不重复发/不重复展示。
function grantSecondFightPet(conn, st) {
  const TYPE = GD.GUIDE_PET_TYPE;
  if (S.servants.some(s => Number(s.type) === TYPE)) {
    log(`[guide] 二战奖励跳过：已持有小精灵（${TYPE}），不重复发放/展示`);
    return;
  }
  const brief = makeServantBrief(TYPE);
  if (!brief) return;
  brief.level = GD.GUIDE_PET_LEVEL;
  require("./servant").grantServantBrief(brief);
  // p_kvt{type:1 新获得}：结算面板奖励卡"小精灵"（pushFightResult 原样带进结算包）
  st.dropServants = [{ id: TYPE, val: 1, type: 1 }];
  st.dropServant = st.dropServants[0];
  require('./altar').markPendingAnnounce([brief.id]);
  try {
    const MM = require('./moment');
    MM.onServantObtained([TYPE]);
    MM.checkUnlocks(conn);
  } catch (e) { /* 言灵录异常不阻塞发放 */ }
  setTimeout(() => announceSecondFightPet(conn, brief), 3000);
  log(`[guide] 二战胜利 → 赠送小精灵 type=${TYPE}（Lv${brief.level} sid=${brief.id}），3s 后宣告并入队`);
}

// 延迟宣告 + 自动入队（3s，与常规掉落的 m_servant_update_toc 延迟同款）
function announceSecondFightPet(conn, brief) {
  // 自动加入第一队：主力有空位优先上主力（正常引导流 3 槽已被初始誓灵占满 → 进替补席）；
  // 主力/替补全满则只入 roster 不入队（GM 重置撞上满编老档的兜底，组10~12 编队引导不受影响）
  const f = S.formations[1] = S.formations[1] || {};
  const field = L.normSlots(f.field), bench = L.normSlots(f.bench);
  const fi = field.findIndex(id => !Number(id));
  const bi = fi < 0 ? bench.findIndex(id => !Number(id)) : -1;
  if (fi >= 0) field[fi] = brief.id;
  else if (bi >= 0) bench[bi] = brief.id;
  f.field = field; f.bench = bench;
  f.servants = field.filter(id => id > 0).map(id => teamServantOf(id, 1, 1))
    .concat(bench.filter(id => id > 0).map(id => teamServantOf(id, 0, 1)));
  saveState();
  conn.sendToc('m_servant_update_toc', {
    new: [{ servant: brief, is_first: 0 }], // N 稀有度（<3）不触发获取动画，结算面板已展示奖励卡
    update: [],
    del: [],
    reward_type: 2, // ServantConst.REWARD_TYPE_COPY
  });
  const altarMod = require('./altar');
  altarMod.clearPendingAnnounce([brief.id]);
  altarMod.pushFameUpdates(conn);            // 宣告后补推名气 diff（阵营名气上涨）
  require('./handbook').pushRedPoints(conn); // 图鉴激活红点（makeServantBrief 已记账）
  if (fi >= 0 || bi >= 0) sendFormationBriefs(conn); // 编队变更重同步（会话级缓存）
  log(`[guide] 小精灵宣告完成，${fi >= 0 ? `上编队 1 主力槽 ${fi + 1}` : bi >= 0 ? `入编队 1 替补席 ${bi + 1}` : '未入队（主力/替补全满）'}`
    + `（field=[${field.join(',')}] bench=[${bench.join(',')}]）`);
}

// ---- 引导二战拦截（copy 9000001）----
// 客户端 toFight(9000001) 直接发 m_copy_fight_tos（不走 prepare）。这里把 mapState 指向
// 合成关卡（guide_data.GUIDE_MAP_CONFIGS，已在 map_configs.js 注册）后回落 map_fight：
// 之后 start_tos/skill_select 全部走主线引擎（tower→dare→…→map_fight 链天然放行，
// 因 S.towerFight/S.dreamFight 等会话标记为空）。
function handleCopyFight(conn, obj) {
  const copyId = Number((obj && obj.copy_id) || 0);
  if (copyId !== 9000001) return require('./dare').handlers.m_copy_fight_tos(conn, obj);
  if (!GD.GUIDE_MAP_CONFIGS[9000001]) return require('./dare').handlers.m_copy_fight_tos(conn, obj);
  S.mapState = { barrierId: 9000001, lastId: 1, pos: 0, fighting: 0, zone: 0, defeated: [] };
  log(`[guide] 引导二战开战（9000001），回落 map_fight 引擎`);
  return MF.handlers.m_copy_fight_tos(conn, obj);
}

module.exports = {
  st, isGuideFresh, unfinishedGroups, guidePayload, pushGuideInfo, resetGuide, skipGuide,
  grantSecondFightPet, announceSecondFightPet,
  handlers: {
    m_role_guide_do_tos: handleGuideDo,
    m_role_rename_tos: handleRename,
    m_servant_select_tos: handleServantSelect,
    m_copy_fight_tos: handleCopyFight,
  },
};
