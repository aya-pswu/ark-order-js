// 背包/物品（重构自 start.js）
const { S, saveState } = require('../state');
const L = require('../lib');
const { log, defaultFill, bagSizeOf, pushAssetChange, goodsPGoods, pushGoodsUpdate, grantGoods, bagTypeOf, stripGoodsFromServants } = L; // 解构导入，域内裸调用与单文件时代一致
const ED = require('../data/item_exchange_data');
const ISD = require('../data/item_sell_data');
const MD = require('../data/item_merge_data');

// 某分页剩余格数（圣器/核心/信仰/元素每实例占 1 格；合成产物不可堆叠时要先算它）
// 与 vit.js openRelicBox 的 freeSlots 同口径（bagSizeOf 含星图扩容）
function freeSlotsOf(bt) {
  const used = S.bagGoods.filter(x => Number(x.bag_type) === Number(bt)).length;
  return Math.max(0, bagSizeOf(bt) - used);
}

function bagTxSnapshot() {
  return { bagGoods: S.bagGoods.map(g => ({ ...g })), nextGoodsId: S.nextGoodsId, roleAsset: JSON.parse(JSON.stringify(S.roleAsset)), skinState: S.skinState ? JSON.parse(JSON.stringify(S.skinState)) : null, servants: S.servants.map(s => ({ ...s })) };
}
function restoreBagTx(snap) {
  S.bagGoods = snap.bagGoods; S.nextGoodsId = snap.nextGoodsId; S.roleAsset = snap.roleAsset; S.servants = snap.servants; if (snap.skinState) S.skinState = snap.skinState;
}

// 礼物分页纠正（打开背包时顺手修，热更新后不必等重启）。
// ⚠️ 口径必须与 state.js 的 giftBagType6Real 迁移、lib.bagTypeOf 一致：
//   bag_type=6 是**隐藏背包**（BagConst.ALL_BAG 不含 6），客户端只在宿舍/协会「休息→送礼」
//   面板读它，且排序时逐件查 `CfgGift.preference`，查不到就 pairs(nil) 崩。
//   所以「28 前缀」不等于礼物 —— 28000024/28000025（神秘的礼物 Lv1/Lv2，开箱类）必须留在材料页。
//   （2026-10-21 苏芸曦真机：此处旧实现会把它们改回 6，覆盖掉存档迁移的效果）
function normalizeGiftBagTypes() {
  let toGift = 0, toMat = 0;
  for (const g of S.bagGoods) {
    if (!String(g.type_id || '').startsWith('28')) continue;
    const want = L.isRealGift(g.type_id) ? 6 : 1;
    if (Number(g.bag_type) !== want) {
      g.bag_type = want;
      if (want === 6) toGift++; else toMat++;
    }
  }
  if (toGift || toMat) {
    saveState();
    log(`[bag] 纠正礼物分页：${toGift} 项 → bag_type=6，${toMat} 项 28xxxxxx 开箱类 → bag_type=1`);
  }
}

function unlockSkin(itemId) {
  const HD = require('../data/handbook_data');
  const th = HD.THEME_SKINS.find(s => s.item === Number(itemId));
  let skinId = th ? th.skin : 0;
  if (!skinId) {
    try {
      const cfg = require('../skin_config.json');
      for (const list of Object.values(cfg.types || {})) {
        const it = list.find(x => Number(x.actItemID) === Number(itemId));
        if (it) { skinId = it.skinID; break; }
      }
    } catch (e) {}
  }
  if (skinId) {
    if (!S.skinState) S.skinState = { owned: [] };
    if (!S.skinState.owned) S.skinState.owned = [];
    if (!S.skinState.owned.includes(skinId)) {
      S.skinState.owned.push(skinId);
      log(`[skin] 解锁皮肤 skinId=${skinId} (itemId=${itemId})`);
    }
  }
  return skinId;
}

// ---- 遗物箱直接破碎规则表（CfgRelic.lua / CfgItems.lua 产出对照）----
// 核心遗物箱：option 1 = 核心晶组, option 2 = 金币（售卖核心等价金额）
// 圣器遗物箱：固定 option 2 = 金币（售卖圣器等价金额）
const RELIC_BOX_DECOMPOSE = {
  // 核心遗物箱
  21101000: { kind: 'core', color: 2, crystal: { id: 27000000, num: 1 }, silver: 5, name: '旧式核心遗物箱' },
  21102000: { kind: 'core', color: 3, crystal: { id: 27000001, num: 1 }, silver: 50, name: '制式核心遗物箱' },
  21103000: { kind: 'core', color: 4, crystal: { id: 27000002, num: 1 }, silver: 100, name: '新制核心遗物箱' },
  21104000: { kind: 'core', color: 5, crystal: { id: 27000002, num: 5 }, silver: 250, name: '原初核心遗物箱' },
  21000000: { kind: 'core', color: 3, crystal: { id: 27000001, num: 1 }, silver: 50, name: '制式核心遗物箱(引导)' },

  // 圣器遗物箱
  21001000: { kind: 'relic', color: 2, silver: 10, name: '旧式圣器遗物箱' },
  21002000: { kind: 'relic', color: 3, silver: 100, name: '制式圣器遗物箱' },
  21003000: { kind: 'relic', color: 4, silver: 200, name: '新制圣器遗物箱' },
  21007000: { kind: 'relic', color: 5, silver: 500, name: '原初圣器遗物箱' },
  21007001: { kind: 'relic', color: 5, silver: 500, name: '阿斯加德遗物箱' },
  21007002: { kind: 'relic', color: 5, silver: 500, name: '幻想遗物箱' },
  21007003: { kind: 'relic', color: 5, silver: 500, name: '阿瓦隆遗物箱' },
  21007004: { kind: 'relic', color: 5, silver: 500, name: '高天原遗物箱' },
  21007005: { kind: 'relic', color: 5, silver: 500, name: '奥林匹斯遗物箱' },
  21007006: { kind: 'relic', color: 5, silver: 500, name: '九霄遗物箱' },
  21007007: { kind: 'relic', color: 5, silver: 500, name: '赫里奥波里斯遗物箱' },
  21007008: { kind: 'relic', color: 5, silver: 500, name: '婆罗多遗物箱' },
};

module.exports = {
  RELIC_BOX_DECOMPOSE,
  handlers: {
// bag 客户端按单对象访问（updateBags 直接 ipairs(bag.goods_list)）——空表 {} 会让 goods_list 为 nil
// size=容量：客户端 BagMgr.isFull 按 size<=useSize 判满（战斗掉落前校验材料包），发 0 会让全类型恒满
m_goods_bag_info_tos(conn, obj) {
  // 兼容热更新前已经在线的旧存档；不必等进程重启，礼物请求本身即可修正分页。
  normalizeGiftBagTypes();
  const type = obj.type == null ? 1 : obj.type;
  const owners = (type === 2 || type === 4 || type === 7) ? L.buildEquipOwnersIndex() : null;
  const goods = S.bagGoods.filter(g => g && g.bag_type === type && Number(g.type_id) > 0)
    .sort((a, b) => a.type_id - b.type_id)
    .map(g => goodsPGoods(g, owners));
  conn.sendToc('m_goods_bag_info_toc', {
    bag: {
      bag_type: type,
      size: bagSizeOf(type),
      goods_list: goods,
    },
  });
},
// 背包扩容：客户端确认框花 50 水晶 +5 上限；content=新容量（BagMgr.setBagSize 直接写入）
m_extend_bag_tos(conn, obj) {
  const type = obj.bag_type == null ? 1 : obj.bag_type;
  // 消耗：客户端确认框标价 50 水晶。口径 = GlobalData.gold = payGold + givenGold
  // （roleAsset.gold 只是**付费**那部分，赠送在 gold_given）⇒ 余额判定必须两者相加，
  // 扣费先扣赠送再扣付费（与 shop.costCrystal / vit 买体力 / 协会家具同口径）。
  // ⚠️ 旧实现 `if (roleAsset.gold < cost)` 只看付费，且随后 `gold -= cost` **又把赠送那份再扣一遍**：
  // 玩家把水晶全捐给赠送档（本档 gold_given 常占大头）时会误判"水晶不足"；
  // 而 gold 恰好够时又被多扣 50（gold_given 已扣、gold 再扣）。
  const cost = 50;
  const payGold = Number(S.roleAsset.gold) || 0;
  const givenGold = Number(S.roleAsset.gold_given) || 0;
  if (payGold + givenGold < cost) {
    conn.sendToc('m_common_tips_toc', defaultFill('m_common_tips_toc'));
    log(`[bag] 扩容失败：水晶不足（${payGold}+${givenGold} < ${cost}）`);
    return;
  }
  const fromGiven = Math.min(givenGold, cost);
  S.roleAsset.gold_given = givenGold - fromGiven;
  S.roleAsset.gold = payGold - (cost - fromGiven);
  const newSize = bagSizeOf(type) + 5;
  S.bagSizes[type] = newSize;
  saveState();
  pushAssetChange(conn);
  log(`[bag] 扩容 type=${type} size=${newSize}（水晶 -${cost}〔赠送 ${fromGiven}〕余 ${S.roleAsset.gold}+${S.roleAsset.gold_given}）`);
  conn.sendToc('m_extend_bag_toc', { bag_type: type, content: newSize });
},
// 自选兑换道具：通过 BagMatExchangePanel / BagServantOutPanel 选择兑换
// 请求：{ item_id: gid, goods: [{ id: targetId, val: count }] }
// 响应：m_item_exchange_goods_toc { item_id: g.id, rest: g.cur_num }
m_item_exchange_goods_tos(conn, obj) {
  const gid = Number(obj && obj.item_id);
  const g = S.bagGoods.find(x => Number(x.id) === gid);
  if (!g) {
    log(`[bag] 自选兑换失败：背包中无道具 gid=${gid}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }

  const boxTypeId = Number(g.type_id);
  if (!ED.isExchangeBox(boxTypeId)) {
    log(`[bag] 自选兑换失败：道具 type_id=${boxTypeId} 不是自选兑换箱`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }

  const reqGoods = Array.isArray(obj && obj.goods) ? obj.goods : [];
  if (!reqGoods.length) {
    log(`[bag] 自选兑换失败：未指定兑换目标物品`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }

  const ruleOptions = ED.getExchangeBox(boxTypeId) || [];
  let totalCost = 0;
  const toGrant = [];

  for (const item of reqGoods) {
    const tid = Number(item && item.id);
    const count = Math.max(1, Number(item && item.val) || 1);
    if (!tid || count <= 0) continue;

    if (boxTypeId === 21400000) {
      // 神降契约：UR 誓灵自选，消耗 1:1
      const servantType = ED.servantTypeOfCard(tid);
      const cost = count * 1;
      totalCost += cost;
      toGrant.push({ targetId: tid, servantType, count, kind: 'servant' });
    } else {
      const option = ruleOptions.find(x => Number(x.targetId) === tid);
      if (!option) {
        log(`[bag] 自选兑换被拒：目标物品 ${tid} 不在箱子 ${boxTypeId} 的可选列表中`);
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      const targetPerUnit = Number(option.targetNum) || 1;
      const costPerUnit = Number(option.costNum) || 1;
      const units = Math.ceil(count / targetPerUnit);
      const cost = units * costPerUnit;
      totalCost += cost;

      let kind = 'item';
      if (ED.isServantCardItem(tid)) {
        kind = 'servant';
      } else if (ED.isSkinItem(tid)) {
        kind = 'skin';
      }
      toGrant.push({ targetId: tid, servantType: ED.servantTypeOfCard(tid), count, kind });
    }
  }

  if (totalCost <= 0 || !toGrant.length) {
    log(`[bag] 自选兑换失败：有效消耗为 0`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }

  if (Number(g.cur_num) < totalCost) {
    log(`[bag] 自选兑换失败：箱子数量不足（持有 ${g.cur_num}，需消耗 ${totalCost}）`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }

  const tx = bagTxSnapshot();
  // 扣除源箱子
  g.cur_num = Number(g.cur_num) - totalCost;
  const delBox = g.cur_num <= 0;
  if (delBox) S.bagGoods = S.bagGoods.filter(x => x !== g);
  // 发放目标物品
  const grantedGoods = [];
  const popupGoods = [];
  const grantDesc = [];

  try { for (const item of toGrant) {
    if (item.kind === 'servant') {
      const grantServant = require('./vit').grantServant;
      for (let i = 0; i < item.count; i++) {
        grantServant(conn, item.servantType);
      }
      popupGoods.push({ id: 0, type_id: item.targetId, cur_num: item.count, bag_type: bagTypeOf(item.targetId) });
      grantDesc.push(`誓灵(${item.servantType})×${item.count}`);
    } else if (item.kind === 'skin') {
      unlockSkin(item.targetId);
      const got = L.grantGoods(item.targetId, item.count, conn);
      grantedGoods.push(...got);
      popupGoods.push({ id: got[0] ? got[0].id : 0, type_id: item.targetId, cur_num: item.count, bag_type: bagTypeOf(item.targetId) });
      grantDesc.push(`皮肤(${item.targetId})×${item.count}`);
    } else {
      const got = L.grantGoods(item.targetId, item.count, conn);
      grantedGoods.push(...got);
      popupGoods.push({ id: got[0] ? got[0].id : 0, type_id: item.targetId, cur_num: item.count, bag_type: bagTypeOf(item.targetId) });
      grantDesc.push(`物品(${item.targetId})×${item.count}`);
    }
  } } catch (e) {
    restoreBagTx(tx);
    log(`[bag] 自选兑换发奖失败，已回滚源箱子：${e.message}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }
  pushGoodsUpdate(conn, [g], delBox ? 2 : 3);

  // 同步背包数据（type=3）
  if (grantedGoods.length) pushGoodsUpdate(conn, grantedGoods, 3);
  // 弹出获得物品窗口（type=1）
  if (popupGoods.length) pushGoodsUpdate(conn, popupGoods, 1);

  saveState();

  // 回复协议，关闭客户端自选面板
  conn.sendToc('m_item_exchange_goods_toc', {
    item_id: g.id,
    rest: delBox ? 0 : g.cur_num,
  });

  log(`[bag] 自选兑换成功：道具 ${boxTypeId}×${totalCost} 换得 [${grantDesc.join(', ')}]，剩余 ${delBox ? 0 : g.cur_num}`);
},
// 道具合成（CfgItemsExtra.merge 全 42 条：遗物箱升阶 / 碎片换圣器 / 碎片召誓灵 / 碎片换元素晶石）
// 请求：{ type_id: 材料 typeId, num: 合成次数 }（BagMergePanel 的 nsNum 就是次数，不是材料个数）
// 响应：m_item_compound_toc { type_id: 产物, num: 实际合成次数, material: 材料 typeId }
//
// 客户端链路（反编译实证）：
//   BagMergePanel.update → ItemConfig.getItemMergeVO(材料 typeId) → {target, costNum}
//   → nsNum.Max = floor(curNum / costNum)；点合成 → toItemCompound(材料 typeId, 次数)
//   → m_item_compound_toc：**material 是誓灵调用类（65 前缀）时直接 return 不弹提示**，
//     其余弹「合成成功」——所以成功路径必须回真实 material，失败路径不能回本协议（回 m_common_error_toc）。
//
// 为什么此前「提示成功但没变化」：服务端没注册该 tos → fallbackHandler 的 defaultFill
// 回了 {type_id:0,num:0,material:0}，客户端照旧弹「合成成功」（2026-10-18 真机实测）。
m_item_compound_tos(conn, obj) {
  const typeId = Number(obj && obj.type_id);
  // num = 合成次数（BagMergePanel 的 nsNum.Value，上限 = floor(持有数 / costNum)）；
  // 客户端按钮在 Value<=0 时禁用，非正数一律按非法请求拒（不要替它补成 1）
  const times = Number(obj && obj.num);
  const recipe = MD.recipeOf(typeId);
  if (!recipe) {
    log(`[bag] 合成失败：道具 ${typeId} 不在 CfgItemsExtra.merge 配方表`);
    conn.sendToc('m_common_error_toc', { code: 31034 });
    return;
  }
  if (!Number.isSafeInteger(times) || times <= 0 || times > 999) {
    log(`[bag] 合成失败：非法次数 num=${obj && obj.num}（材料 ${typeId}）`);
    conn.sendToc('m_common_error_toc', { code: 31034 });
    return;
  }

  // 材料可能分散在多格（历史上分页/合堆会留下多格同 type_id），按 type_id 跨格汇总
  const stacks = S.bagGoods.filter(g => Number(g.type_id) === typeId && Number(g.cur_num) > 0);
  if (stacks.some(g => g.lock === 1 || g.isLock)) {
    log(`[bag] 合成失败：材料 ${typeId} 已被锁定`);
    conn.sendToc('m_common_error_toc', { code: 31064 });
    return;
  }
  const owned = stacks.reduce((n, g) => n + Number(g.cur_num), 0);
  const need = recipe.cost * times;
  if (owned < need) {
    log(`[bag] 合成失败：${recipe.name}(${typeId}) 数量不足（持有 ${owned}，需 ${need}）`);
    conn.sendToc('m_common_error_toc', { code: 31034 });
    return;
  }

  // 背包容量：产物按实例占格（圣器/能力核心）时每件 1 格，先按剩余格数截断次数。
  // 其余产物（遗物箱/元素晶石等）在 grantGoods 里按 type_id 堆叠，不额外占格（与开箱同口径）。
  const RD = require('../data/relic_data');
  const perInstance = RD.isRelicType(recipe.target) || RD.isCoreType(recipe.target);
  const targetBag = bagTypeOf(recipe.target);
  let actual = times;
  if (perInstance) {
    const free = freeSlotsOf(targetBag);
    if (free <= 0) {
      // 按分页给对应错误码（客户端 handleError 会弹对应分页的"扩容/整理"面板）
      const CODE = { 1: 20, 2: 58, 4: 61, 7: 71, 9: 77 };
      const code = CODE[targetBag] || 31045;
      log(`[bag] 合成失败：产物 ${recipe.targetName}(${recipe.target}×${times}) 所需背包(${targetBag})已满`);
      conn.sendToc('m_common_error_toc', { code });
      return;
    }
    actual = Math.min(times, free);
  }

  const tx = bagTxSnapshot();
  // 扣料：按格顺序扣，扣空的格子移除并推 DEL
  let left = recipe.cost * actual;
  const changed = [];
  const removed = [];
  for (const g of stacks) {
    if (left <= 0) break;
    const take = Math.min(left, Number(g.cur_num) || 0);
    g.cur_num = Number(g.cur_num) - take;
    left -= take;
    (g.cur_num <= 0 ? removed : changed).push(g);
  }
  if (left > 0) { // 理论上到不了（前面已汇总校验）；到了就是并发/脏数据，整体回滚
    restoreBagTx(tx);
    log(`[bag] 合成失败：扣料后仍差 ${left} 个 ${typeId}（状态异常，已回滚）`);
    conn.sendToc('m_common_error_toc', { code: 31034 });
    return;
  }
  // 扣空的格子必须真的从存档移除（否则留下 cur_num=0 的僵尸格：客户端 delGoods 后重登又"长回来"，
  // 且合成面板 floor(持有/cost) 仍按 0 算，背包格数也被白占）
  if (removed.length) {
    const dead = new Set(removed.map(g => g.id));
    S.bagGoods = S.bagGoods.filter(g => !dead.has(g.id));
  }

  // 发产物：誓灵调用类走 grantServant（不进背包），其余走 grantGoods
  const TK = require('../data/servant_token_data');
  const granted = [];
  let servantType = 0;
  let grantedServants = 0;
  try {
    if (TK.isServantToken(recipe.target)) {
      servantType = TK.servantTypeOfToken(recipe.target);
      // 复用 vit.grantServant（开箱同款）：makeServantBrief 白名单校验 + 立即推 m_servant_update_toc
      // reward_type=6（自动弹获取动画）。**同 tick 宣告**，不存在 D7 的"已入档未宣告"窗口，
      // 因此不需要 markPendingAnnounce。
      const VIT = require('./vit');
      for (let i = 0; i < actual; i++) {
        if (VIT.grantServant(conn, servantType)) grantedServants++;
      }
    } else {
      granted.push(...grantGoods(recipe.target, actual, conn));
    }
  } catch (e) {
    restoreBagTx(tx);
    log(`[bag] 合成发奖失败，已回滚材料：${e.message}`);
    conn.sendToc('m_common_error_toc', { code: 31034 });
    return;
  }

  // 推送：先回包（客户端 m_item_compound_toc 只弹提示，不推进状态机），再推背包变更
  conn.sendToc('m_item_compound_toc', { type_id: recipe.target, num: actual, material: typeId });

  if (removed.length) pushGoodsUpdate(conn, removed.map(g => ({ id: g.id, type_id: g.type_id, cur_num: 0, bag_type: g.bag_type })), 2);
  if (changed.length) pushGoodsUpdate(conn, changed, 3);
  if (granted.length) pushGoodsUpdate(conn, granted, 3);

  saveState();
  log(`[bag] 合成成功：${recipe.name}(${typeId})×${recipe.cost * actual} → `
    + `${recipe.targetName}(${recipe.target})×${actual}`
    + (servantType ? `（誓灵 type=${servantType}）` : '')
    + (actual < times ? `，次数被背包格数限制（请求 ${times}）` : ''));
},
// 背包直接破碎核心/圣器遗物箱：通过 BagItemUsePanel 选择产出
// 请求：{ item_id: typeId, num: count, option: 1/2 }
// 响应：m_item_decompose_toc { item_id: typeId, rest: remaining }
m_item_decompose_tos(conn, obj) {
  const reqId = Number(obj && obj.item_id);
  const num = Math.max(1, Number(obj && obj.num) || 1);
  const option = Number(obj && obj.option) || 1;

  // 匹配背包中的物品（优先按 type_id 查找，备选按 id 查找）
  let g = S.bagGoods.find(x => Number(x.type_id) === reqId);
  if (!g) {
    g = S.bagGoods.find(x => Number(x.id) === reqId);
  }
  if (!g) {
    log(`[bag] 破碎失败：背包中无道具 item_id=${reqId}`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }

  const typeId = Number(g.type_id);
  const rule = RELIC_BOX_DECOMPOSE[typeId];
  if (!rule) {
    log(`[bag] 破碎失败：道具 type_id=${typeId} 不支持破碎`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }

  const curNum = Number(g.cur_num) || 0;
  if (curNum < num) {
    log(`[bag] 破碎失败：道具数量不足（持有 ${curNum}，需破碎 ${num}）`);
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    return;
  }

  const tx = bagTxSnapshot();
  // 1. 扣除背包中的箱子
  g.cur_num = curNum - num;
  const delBox = g.cur_num <= 0;
  if (delBox) {
    S.bagGoods = S.bagGoods.filter(x => x !== g);
  }
  // 2. 发放破碎产物
  const grantedGoods = [];
  const popupGoods = [];
  let grantDesc = '';

  if (option === 1 && rule.kind === 'core' && rule.crystal) {
    // Option 1：核心晶组
    const crystalId = rule.crystal.id;
    const count = rule.crystal.num * num;
    let got;
    try { got = L.grantGoods(crystalId, count, conn); } catch (e) { restoreBagTx(tx); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
    grantedGoods.push(...got);
    popupGoods.push({
      id: got[0] ? got[0].id : 0,
      type_id: crystalId,
      cur_num: count,
      bag_type: bagTypeOf(crystalId),
    });
    grantDesc = `核心晶组(${crystalId})×${count}`;
  } else {
    // Option 2（或圣器箱）：金币
    const silverAdd = (rule.silver || 0) * num;
    S.roleAsset.silver = (Number(S.roleAsset.silver) || 0) + silverAdd;
    pushAssetChange(conn);
    if (silverAdd > 0) {
      popupGoods.push({
        id: 0,
        type_id: 30000003,
        cur_num: silverAdd,
        bag_type: 1,
      });
    }
    grantDesc = `金币+${silverAdd}`;
  }

  pushGoodsUpdate(conn, [g], delBox ? 2 : 3);

  // 3. 推送产物数据（type=3）与弹窗展示（type=1）
  if (grantedGoods.length) pushGoodsUpdate(conn, grantedGoods, 3);
  if (popupGoods.length) pushGoodsUpdate(conn, popupGoods, 1);

  saveState();

  // 4. 回复协议关闭面板
  conn.sendToc('m_item_decompose_toc', {
    item_id: typeId,
    rest: delBox ? 0 : g.cur_num,
  });

  log(`[bag] 破碎成功：${rule.name}(${typeId})×${num} → ${grantDesc}，剩余 ${delBox ? 0 : g.cur_num}`);
},
// 物品锁定/解锁（BagModule.toGoodsLock → m_goods_lock_tos{id=gid, lock=BagConst.STATE_LOCK}）
// 客户端 m_goods_lock_toc 直接 `BagMgr.getItem(slot0.id)` 后写 dbInfo.lock 并弹"锁定/解锁成功"——
// **item 不存在会 nil 索引崩**，所以本协议不存在"兜底"空间：找不到必须走 tips，不能回同名 toc。
// 元素/信仰/核心面板都有这个锁开关（CfgItems.canLock），此前全库无 handler（拨了没反应）。
m_goods_lock_tos(conn, obj) {
  const gid = Number(obj && obj.id) || 0;
  const lock = Number(obj && obj.lock) ? 1 : 0;
  const g = S.bagGoods.find(x => Number(x.id) === gid);
  if (!g) {
    log(`[bag] 锁定失败：物品不存在 gid=${gid}`);
    conn.sendToc('m_common_tips_toc', { code: 31034 }); // 物品数量不足/不存在
    return;
  }
  g.lock = lock;
  saveState();
  conn.sendToc('m_goods_lock_toc', { id: gid, lock });
  log(`[bag] ${lock ? '锁定' : '解锁'} gid=${gid} type=${g.type_id}`);
},
// 背包出售道具（材料、圣器、能力核心等）：
// 请求：{ list: [{ id: gid, val: count }] }
// 响应：m_goods_sell_toc { add_silver: totalSilver }
// 刷新：pushGoodsUpdate(type=2/3) + pushAssetChange(增加银币)
m_goods_sell_tos(conn, obj) {
  const list = Array.isArray(obj && obj.list) ? obj.list : [];
  if (!list.length) {
    conn.sendToc('m_goods_sell_toc', { add_silver: 0 });
    return;
  }

  let totalSilver = 0;
  const deletedGoods = [];
  const updatedGoods = [];

  for (const item of list) {
    const gid = Number(item && item.id);
    const count = Math.max(1, Number(item && item.val) || 1);
    if (!gid) continue;

    const gIdx = S.bagGoods.findIndex(x => Number(x.id) === gid);
    if (gIdx === -1) {
      log(`[bag] 出售物品未找到 gid=${gid}`);
      continue;
    }
    const g = S.bagGoods[gIdx];

    // 锁定检查（安全防线）
    if (g.lock === 1 || g.isLock) {
      log(`[bag] 出售被拒：物品 gid=${gid} 已被锁定`);
      continue;
    }

    const typeId = Number(g.type_id);
    if (!ISD.canSellItem(typeId)) {
      log(`[bag] 出售被拒：物品 type_id=${typeId} 不可出售`);
      continue;
    }

    const unitPrice = ISD.getSellPrice(typeId);
    const curNum = Number(g.cur_num) || 1;
    const actualSellCount = Math.min(count, curNum);
    if (actualSellCount <= 0) continue;

    totalSilver += unitPrice * actualSellCount;

    if (actualSellCount >= curNum) {
      // 全量卖出：从背包移除
      S.bagGoods.splice(gIdx, 1);
      deletedGoods.push(g);
      // 若该物品曾被誓灵装备（圣器/能力核心），解绑对应槽位
      stripGoodsFromServants(gid);
    } else {
      // 堆叠道具部分卖出：更新数量
      g.cur_num = curNum - actualSellCount;
      updatedGoods.push(g);
    }
    log(`[bag] 出售物品 gid=${gid} type_id=${typeId} ×${actualSellCount} (单价=${unitPrice}银币)`);
  }

  if (totalSilver > 0) {
    S.roleAsset.silver = (Number(S.roleAsset.silver) || 0) + totalSilver;
  }

  saveState();

  // 1. 先回复出售成功 toc（客户端 BagModule.m_goods_sell_toc 会执行 BagMgr.clearSell() 清理已选单）
  conn.sendToc('m_goods_sell_toc', {
    add_silver: totalSilver,
  });

  // 2. 推送背包物品删除/更新（客户端 updateBagPanel 刷新列表）
  if (deletedGoods.length > 0) {
    pushGoodsUpdate(conn, deletedGoods, 2);
  }
  if (updatedGoods.length > 0) {
    pushGoodsUpdate(conn, updatedGoods, 3);
  }

  // 3. 推送银币资产变更（客户端顶栏刷新）
  if (totalSilver > 0) {
    pushAssetChange(conn);
  }

  log(`[bag] 出售完成：获得银币 ${totalSilver}，删除 ${deletedGoods.length} 件，更新 ${updatedGoods.length} 件`);
},
  },
};
