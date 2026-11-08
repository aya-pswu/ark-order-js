// 主线首通奖励 + 主线双倍（章节地图上每个关卡图标右下角那个奖励小图标）。
//
// ── 首通奖励 ──
// 客户端 `CopyBarrierItem`：
//   itemTimes = CopyMgr.getCopyPassTimes(id)   ← p_copy_barrier.pass_times
//   itemState = CopyMgr.isHasFirstReward(id)   ← p_copy_barrier.first_reward（**0=未领取**，1=已领）
//   objReward 显示 = itemState==0 且 CfgCopy.copy[id].firstReward 存在 且非 EX 模式
//   spRed（红点）= 上面成立 且 itemTimes>0（= 已通关 → 可领）
//   onOpenItemVO：itemTimes==0 → 只弹道具详情预览；**>0 → 发 m_copy_story_first_reward_tos{barrier_id}**
//   收到 toc 后 updateCopyFirstReward(barrier_id, 1) 把图标收掉。
// ⇒ 「点击无反应」的根因：本协议此前没实现，start.js 的 fallbackHandler 按同名 toc 的 schema
//   回了一个 defaultFill（barrier_id=0），客户端把"已领取"标记打到 0 号关卡上，
//   真关卡的 itemState 永远是 0 → 图标不消失、奖励也没发。
// ⇒ 服务端职责：校验（已通关 + 未领过 + 配置里有奖励）→ 发奖 → 回 toc{barrier_id} 回显真实 id。
// 客户端 toc handler **不显示任何奖励飘窗**，所以入包/货币变更必须由服务端另外推
//（m_goods_update_toc / m_role_attr_change_toc / m_vit_update_toc）。
//
// ── 双倍 ──
// 三条 tos（info/switch/buy）**共用同一个回包** m_copy_story_double_info_toc
//   {times 持有次数, has_buy_times 今日剩余可购买次数, switch 开关, is_double 本次是否双倍, push_type}
//   push_type==1 时客户端弹"购买成功"。
// CopyDoubleBuyPanel：op_type=1 买 1 次、op_type=0 买满今日剩余；单价 CfgShop.double.cost[已买次数+1]
//   （**体力**：checkBuy 拿 GlobalData.vit 比价，不足弹"体力不足"）；
//   持有次数 >= maxTimes(10) 时禁止再买。
// CopyMainLineView：togDouble/lblDoubleTimes 仅在 CopyMgr.getCurChapter(TYPE_MAIN) >= 7 时可见
//   （点 texDouble 提示"通关主线6-4后可开启该功能"），显示 "times/10"；
//   开关切换时若 doubleUseTimes==0 直接回弹并提示"当前没有剩余双倍次数"。
// CopyPlanPanel：spDouble（出击面板的双倍角标）= isUseDouble && isMainCopy(copyId)。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log, grantGoods, pushGoodsUpdate, pushAssetChange, progressOf } = L;
const SR = require('../data/story_reward_data');
const V = require('../data/vit_data');

// 主线章节表（与 map_fight 的 MAIN_CHAPTERS 同源；这里只需要"章 → 四关"用于红点与解锁判定）
const MAIN_CHAPTERS = {};
for (let ch = 1; ch <= 10; ch++) {
  MAIN_CHAPTERS[ch] = [1, 2, 3, 4].map(st => 1000000 + ch * 10000 + st * 100);
}

// 官方错误码（CfgErrorCode）：首通/双倍都没有专属码段，借语义精确的通用码
const ERR_NOT_OPEN = 64;      // 功能还未开启（双倍未到第 7 章）
const ERR_TIMES = 257001;     // 次数不足（今日购买次数用完 / 无剩余双倍次数）
const ERR_VIT = V.ERR_VIT_NOT_ENOUGH; // 262006 体力不足
const ERR_PARAM = 156001;     // 参数错误（未通关 / 已领过 / 无该关配置）

function st() {
  if (!S.storyState) S.storyState = { claimed: [], doubleTimes: 0, buyDay: '', buyUsed: 0, switchOn: 0 };
  const s = S.storyState;
  if (!Array.isArray(s.claimed)) s.claimed = [];
  if (typeof s.doubleTimes !== 'number') s.doubleTimes = 0;
  if (typeof s.buyUsed !== 'number') s.buyUsed = 0;
  // 每日购买次数按服务器本地日期重置（与体力/曜日副本同口径）；**持有次数不重置**（买了就一直在）
  const today = new Date().toLocaleDateString('sv');
  if (s.buyDay !== today) {
    s.buyDay = today;
    s.buyUsed = 0;
    log(`[story] 双倍每日购买次数重置（${today}）`);
  }
  return s;
}

function isCleared(barrierId) {
  const { MAP_CONFIGS } = require('../data/map_configs');
  const cfg = MAP_CONFIGS[barrierId];
  return cfg ? (progressOf(barrierId).cleared || []).includes(cfg.bossPoint) : false;
}

// 玩家已解锁到的最新章节（= map_fight 下发的 cur_chapter：第 N 章开启 = 第 N-1 章四关全通）
function curChapter() {
  let max = 1;
  for (let ch = 2; ch <= 10; ch++) {
    if (MAIN_CHAPTERS[ch - 1].every(isCleared)) max = ch; else break;
  }
  return max;
}

// ---- 首通奖励 ----
function rewardOf(barrierId) {
  return SR.FIRST_REWARD[String(barrierId)] || SR.FIRST_REWARD[Number(barrierId)] || null;
}
function isClaimed(barrierId) {
  return st().claimed.includes(Number(barrierId));
}
// p_copy_barrier.first_reward：0=未领取（客户端才显示图标）1=已领取
function firstRewardState(barrierId) {
  return isClaimed(barrierId) ? 1 : 0;
}
// 可领取 = 有配置 + 已通关 + 未领过
function canClaim(barrierId) {
  return !!rewardOf(barrierId) && isCleared(barrierId) && !isClaimed(barrierId);
}

// 红点：m_copy_story_red_point_toc{can_reward} 是**章节号列表**
// （CopyChapterItem.updateRed 按 hasCopyStoryRed(chapter) 亮章节页签红点），纯推送无 tos
function redChapters() {
  return Object.keys(MAIN_CHAPTERS).map(Number)
    .filter(ch => MAIN_CHAPTERS[ch].some(canClaim));
}
function pushRedPoint(conn) {
  const list = redChapters();
  conn.sendToc('m_copy_story_red_point_toc', { can_reward: list });
  log(`[story] 首通奖励红点章节 [${list.join(',') || '无'}]`);
}

// 发一份奖励：form=2 的 30000000/1/2/3 是货币（水晶/御灵士经验/体力/金币），其余入背包。
// 直接复用 vit.grantItemRewards（它已经处理货币分流 + 推 goods/asset/vit 三种变更包）
function grantReward(conn, item, num) {
  return require('./vit').grantItemRewards(conn, [{ type: Number(item), num: Number(num) }], 1);
}

// ---- 双倍 ----
function doubleUnlocked() {
  return curChapter() >= SR.DOUBLE_UNLOCK_CHAPTER;
}
function remainBuyTimes() {
  return Math.max(0, SR.DOUBLE_MAX_TIMES - st().buyUsed);
}
// 单价：ShopConfig.getDoubleCost(getDoubleMaxTimes() - has_buy_times + 1) = cost[今日已买次数+1]
// （客户端与服务端必须同一个下标口径，否则面板报价与实扣不一致）
function costOfNext(nth) {
  const i = Math.max(1, Math.min(SR.DOUBLE_COST.length, nth));
  return SR.DOUBLE_COST[i - 1];
}
// 本次出击是否走双倍：开关打开且还有持有次数
function isDoubleActive() {
  const s = st();
  return doubleUnlocked() && s.switchOn === 1 && s.doubleTimes > 0 ? 1 : 0;
}
function pushDoubleInfo(conn, pushType) {
  const s = st();
  conn.sendToc('m_copy_story_double_info_toc', {
    times: s.doubleTimes,
    has_buy_times: remainBuyTimes(),
    switch: s.switchOn ? 1 : 0,
    is_double: isDoubleActive(),
    push_type: pushType || 0, // 1 = 客户端弹"购买成功"
  });
}

// 结算钩子（map_fight.onBattleWon 在主线 BOSS 点通关时调用）：
// 消耗 1 次持有次数并返回倍率。**本地服口径：按"整关通关"扣 1 次，不是每场道中战都扣**——
// 主线一关有 5~6 个战斗点，按场扣会让 10 次双倍两关就烧完；官方文案只说"双倍奖励"未界定粒度。
function consumeDouble(conn) {
  const s = st();
  if (!isDoubleActive()) return 1;
  s.doubleTimes = Math.max(0, s.doubleTimes - 1);
  if (s.doubleTimes === 0) s.switchOn = 0; // 次数用尽自动关开关（否则面板开着但恒不生效）
  saveState();
  pushDoubleInfo(conn);
  log(`[story] 双倍生效：本关奖励 ×2，剩余次数 ${s.doubleTimes}/${SR.DOUBLE_MAX_TIMES}`);
  return 2;
}

function onLogin(conn) {
  st();
  saveState();
  pushRedPoint(conn);
  pushDoubleInfo(conn);
}

module.exports = {
  st, firstRewardState, canClaim, isCleared, curChapter, redChapters, pushRedPoint,
  doubleUnlocked, remainBuyTimes, costOfNext, isDoubleActive, pushDoubleInfo, consumeDouble, onLogin,
  handlers: {
// 领首通奖励（点关卡图标右下角的奖励小图标；已通关才会走到这条协议）
m_copy_story_first_reward_tos(conn, obj) {
  const bid = Number((obj && obj.barrier_id) || 0);
  const s = st();
  const r = rewardOf(bid);
  const err = why => {
    conn.sendToc('m_common_error_toc', { code: ERR_PARAM });
    log(`[story] 首通领取被拒 barrier=${bid}：${why}`);
  };
  if (!r) return err('该关卡无首通奖励配置');
  if (!isCleared(bid)) return err('尚未通关');
  if (isClaimed(bid)) return err('已领取过');
  s.claimed.push(bid);
  const got = grantReward(conn, r.id, r.num);
  saveState();
  // 回显真实 barrier_id：客户端 updateCopyFirstReward(barrier_id, 1) 靠它把图标收掉，
  // 回 0（兜底 defaultFill 的行为）会把标记打到 0 号关卡，图标永远不消失
  conn.sendToc('m_copy_story_first_reward_toc', { barrier_id: bid });
  pushRedPoint(conn); // 领完重算章节红点
  const nm = SR.REWARD_NAMES[String(r.id)] || r.id;
  log(`[story] 首通奖励 ${r.simple || bid}（${bid}）→ ${nm} x${r.num}`
    + `（${got.silverAdd ? '金币+' + got.silverAdd : got.vitAdd ? '体力+' + got.vitAdd : got.goldAdd ? '水晶+' + got.goldAdd : '入包'}）`
    + ` 已领 ${s.claimed.length}/${Object.keys(SR.FIRST_REWARD).length}`);
},
// 双倍状态查询（主线页打开时拉）
m_copy_story_double_info_tos(conn) {
  pushDoubleInfo(conn);
},
// 双倍开关（主线页 togDouble）：客户端已挡"无剩余次数"，服务端兜底
m_copy_story_double_switch_tos(conn, obj) {
  const on = Number((obj && obj.switch) || 0) === 1 ? 1 : 0;
  const s = st();
  if (!doubleUnlocked()) {
    conn.sendToc('m_common_error_toc', { code: ERR_NOT_OPEN });
    log(`[story] 双倍开关被拒：功能未开启（需通关 6-4，当前章 ${curChapter()}）`);
    return;
  }
  if (on && s.doubleTimes <= 0) {
    conn.sendToc('m_common_error_toc', { code: ERR_TIMES });
    log('[story] 双倍开关被拒：没有剩余双倍次数');
    pushDoubleInfo(conn); // 回推让面板开关弹回
    return;
  }
  s.switchOn = on;
  saveState();
  pushDoubleInfo(conn);
  log(`[story] 双倍开关 → ${on ? '开' : '关'}（持有 ${s.doubleTimes}/${SR.DOUBLE_MAX_TIMES}）`);
},
// 买双倍次数（CopyDoubleBuyPanel）：op_type=1 买 1 次、0 买满今日剩余；单价按今日已买次数递推，扣**体力**
m_copy_story_double_buy_tos(conn, obj) {
  const opType = Number((obj && obj.op_type) == null ? 1 : obj.op_type);
  const s = st();
  const vitMod = require('./vit');
  const err = (code, why) => {
    conn.sendToc('m_common_error_toc', { code });
    log(`[story] 双倍购买被拒（${code}）：${why}`);
    pushDoubleInfo(conn);
  };
  if (!doubleUnlocked()) return err(ERR_NOT_OPEN, `功能未开启（需通关 6-4，当前章 ${curChapter()}）`);
  const remainBuy = remainBuyTimes();
  if (remainBuy <= 0) return err(ERR_TIMES, '今日购买次数已用完');
  const holdRoom = SR.DOUBLE_MAX_TIMES - s.doubleTimes;
  if (holdRoom <= 0) return err(ERR_TIMES, `持有次数已达上限 ${SR.DOUBLE_MAX_TIMES}`);
  // 买几次：op_type=0 买满（同时受"今日剩余"与"持有上限余量"两个限制）
  const want = opType === 0 ? Math.min(remainBuy, holdRoom) : 1;
  // 报价与客户端 getOneCost/getAllCost 同源：第 (已买+1) 次起连续 want 次
  let cost = 0;
  for (let i = 0; i < want; i++) cost += costOfNext(s.buyUsed + 1 + i);
  if (vitMod.getVit() < cost) return err(ERR_VIT, `体力不足（需 ${cost}，有 ${vitMod.getVit()}）`);
  vitMod.addVit(conn, -cost);
  s.buyUsed += want;
  s.doubleTimes += want;
  saveState();
  // push_type=1 让客户端弹"购买成功"
  pushDoubleInfo(conn, 1);
  log(`[story] 购买双倍 ${want} 次（${opType === 0 ? '买满' : '单次'}）体力-${cost}`
    + ` → 持有 ${s.doubleTimes}/${SR.DOUBLE_MAX_TIMES}，今日剩余可购买 ${remainBuyTimes()}`);
},
  },
};
