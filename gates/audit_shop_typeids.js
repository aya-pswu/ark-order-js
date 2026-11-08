// 全商店商品可用性审计（二百七十二扩展，2026-10-28）
//
// 目的：找出所有"下发的 type_id 客户端查不到"的商品——即「道具不存在：ID=xxx」的潜在来源。
// 判定口径严格照客户端（tools/lua_src 反编译）：
//
//   ShopItemCommonVO.fillCommonData:
//     type_ID_kind = ShopUtil.getDecodeNum(tag, 6, 7)     -- string.sub(tag,-7,-6)
//     type_ID_kind == SHOP_ITEM_GIFTS(2) or isGiftBagKind → fillDetailGifts → fillCommonItemVO(typeID) → getItemVO
//     type_ID_kind == SHOP_ITEM_GOODS(0)                 → fillDetailGoods → fillCommonItemVO(typeID) → getItemVO
//     type_ID_kind == SHOP_ITEM_SKIN(1)                  → fillDetailSkin → getServantSkinItemVO(skin)（不查 CfgItems）
//     type_ID_kind == SHOP_ITEM_SERVANT(3)               → fillDetailServant → **fillCommonItemVO(typeID)** → getItemVO
//                                                          ＋ getServantConfigVO(typeID % 10^7)
//     type_ID_kind == SHOP_ITEM_RECHARGE(4)              → 什么都不查
//
// 关键结论（本轮实锤）：**只有 SKIN(1) 与 RECHARGE(4) 不查 CfgItems**，其余三种分支都查。
// 所以誓灵商品必须用"誓灵凭证"（30000000+type）——凭证本身在 CfgItems，取模后命中 CfgServant。
//
// 用法：node tools/bc_cmp/audit_shop_typeids.js [--verbose] [--json]
//   退出码 1 = 存在违规（可挂出包闸门）
// 只读：loadState 但全程不写盘（PS_STATE_FILE 指到临时文件，E2）。
const fs = require('fs');
const os = require('os');
const path = require('path');
const ROOT = path.join(__dirname, '..');
process.env.PS_STATE_FILE = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'audit_shop_')), 'state.json');

const { loadState, S } = require(path.join(ROOT, 'server', 'state'));
loadState();
const SHOP = require(path.join(ROOT, 'server', 'handlers', 'shop'));
const GROW = require(path.join(ROOT, 'server', 'data', 'grow_data'));
const COLLAB = require(path.join(ROOT, 'server', 'data', 'collab_data'));
const FAM = require(path.join(ROOT, 'server', 'handlers', 'family'));

// ---- 客户端权威数据 ----
// CfgItems：真机版（与 server/lib.js VALID_ITEM_TYPES 同源顺序）
const ITEM_PATHS = [
  path.join(ROOT, 'tools', 'bc_cmp', 'vit_new', 'CfgItems.lua'),
  path.join(ROOT, 'tools', 'bc_cmp', 'CfgItems_ljd.lua'),
  path.join(ROOT, 'tools', 'lua_src', 'CfgItems.lua'),
];
let cfgItemsText = null, cfgItemsSrc = null;
for (const p of ITEM_PATHS) { if (fs.existsSync(p)) { cfgItemsText = fs.readFileSync(p, 'utf8'); cfgItemsSrc = p; break; } }
if (!cfgItemsText) { console.error('找不到 CfgItems'); process.exit(2); }
const CLIENT_ITEMS = new Set();
for (const m of cfgItemsText.matchAll(/\[(\d+)\]\s*=\s*\{/g)) CLIENT_ITEMS.add(parseInt(m[1]));

// CfgServant：合法誓灵 type（皮肤/凭证还原后的目标）
const SERVANT_PATHS = [
  path.join(ROOT, 'tools', 'bc_cmp', 'vit_new', 'CfgServant.lua'),
  path.join(ROOT, 'server', 'data', 'servant_types.js'),
];
let CLIENT_SERVANTS = new Set();
for (const p of SERVANT_PATHS) {
  if (!fs.existsSync(p)) continue;
  const t = fs.readFileSync(p, 'utf8');
  if (p.endsWith('.js')) {
    const arr = t.match(/[\d]{5,8}/g) || [];
    for (const x of arr) CLIENT_SERVANTS.add(parseInt(x));
  } else {
    for (const m of t.matchAll(/\[(\d+)\]\s*=\s*\{/g)) CLIENT_SERVANTS.add(parseInt(m[1]));
  }
  if (CLIENT_SERVANTS.size > 100) break;
}

// ---- tag 解码：完全照 ShopUtil.getDecodeNum = toint(string.sub(tostring(tag), -b, -a)) ----
// string.sub(s, -B, -A)：从末尾数第 B 位到第 A 位（1 基、含两端）。tag 不足位时 Lua 会自动截断。
function getDecodeNum(tag, a, b) {
  const s = String(Math.trunc(Number(tag) || 0));
  const n = s.length;
  const from = n - b + 1;               // 1 基
  const to = n - a + 1;                 // 1 基
  const lo = Math.max(0, from - 1);
  const hi = Math.min(n, to);
  if (hi <= lo) return 0;               // 越界 → 空串 → toint("") = 0
  return parseInt(s.slice(lo, hi), 10) || 0;
}

// CfgServantSkin：真实皮肤 id 集合（SKIN 分支 fillDetailSkin 直接拿 type_id 查这张表）
const SKIN_PATHS = [
  path.join(ROOT, 'tools', 'bc_cmp', 'CfgServantSkin_ljd.lua'),
  path.join(ROOT, 'tools', 'lua_src', 'CfgServantSkin.lua'),
];
let CLIENT_SKINS = new Set();
for (const p of SKIN_PATHS) {
  if (!fs.existsSync(p)) continue;
  const t = fs.readFileSync(p, 'utf8');
  for (const m of t.matchAll(/skinID\s*=\s*(\d+)/g)) CLIENT_SKINS.add(parseInt(m[1]));
  if (CLIENT_SKINS.size > 100) break;
}

const KIND_GOODS = 0, KIND_SKIN = 1, KIND_GIFTS = 2, KIND_SERVANT = 3, KIND_RECHARGE = 4;
const KIND_NAME = { 0: 'GOODS', 1: 'SKIN', 2: 'GIFTS', 3: 'SERVANT', 4: 'RECHARGE' };

// ---- 收集所有商店（用服务端真出口 itemP，保证与线上下发一致）----
// shopDefs 覆盖：1/2/3/5/11/12/34-44/50/55/59/71/74/99
const SHOP_IDS = [1, 2, 3, 5, 11, 12, 50, 55, 59, 71, 74, 99]
  .concat(Array.from({ length: 11 }, (_, i) => 34 + i));   // 34..44

const rows = [];
for (const shopId of SHOP_IDS) {
  const defs = (() => {
    try { return SHOP.detailP(shopId).shop_goods || []; } catch (e) { return null; }
  })();
  if (defs == null) { rows.push({ shopId, error: 'detailP 抛异常' }); continue; }
  for (const g of defs) {
    const tag = Number(g.tag) || 0;
    const kind = getDecodeNum(tag, 6, 7);
    rows.push({
      shopId,
      goodsId: g.id,
      typeId: Number(g.type_id),
      num: g.num,
      tag,
      kind,
      kindName: KIND_NAME[kind] ?? ('UNKNOWN_' + kind),
      currency: g.currency,
      price: g.price && g.price[0] ? g.price[0].val : undefined,
    });
  }
}
// 快速购买（shop 99）若 detailP 未覆盖，也单独取 FAST（detailP 已覆盖则重复无妨，按 goodsId 去重）
// 结社商店（family.shopDetailP）
try {
  const fam = FAM.shopDetailP(8);
  for (const g of (fam && fam.shop_goods) || []) {
    const tag = Number(g.tag) || 0;
    const kind = getDecodeNum(tag, 6, 7);
    rows.push({
      shopId: 8, goodsId: g.id, typeId: Number(g.type_id), num: g.num, tag, kind,
      kindName: KIND_NAME[kind] ?? ('UNKNOWN_' + kind),
      currency: g.currency, price: g.price && g.price[0] ? g.price[0].val : undefined,
    });
  }
} catch (e) { rows.push({ shopId: 8, error: 'family.shopDetailP 抛异常: ' + e.message }); }

// ---- 其它独立商店族（不走 shopDefs/itemP，但同样把 type_id 交给客户端 getItemVO）----
// ① 凭神回响（m_echo_shop_info_toc.items[].type_id；SummonEchoExchangeItem.onGUI 直接 getItemVO）
// ② 皮肤商店（m_skin_shop_detail_toc.detail，走 itemP → SKIN 分支）
// ③ pay 商店（m_pay_shop_info_toc）只有 pay_shop_list，无 type_id，跳过
try {
  const ECHO = require(path.join(ROOT, 'server', 'data', 'echo_shop_data'));
  for (const s of ECHO.SERVANTS) {
    // 回响店 type_id 是誓灵道具（30000000+type），客户端直接 getItemVO，不需要 SERVANT 分支语义
    rows.push({ shopId: 'echo', goodsId: s.type, typeId: Number(s.type_id), num: 1, tag: 0, kind: KIND_GOODS, kindName: 'ECHO-ITEM', currency: 28 });
  }
} catch (e) { rows.push({ shopId: 'echo', error: 'echo_shop_data 读取失败: ' + e.message }); }
try {
  const SD = require(path.join(ROOT, 'server', 'data', 'shop_data'));
  for (const def of SD.SKIN_GOODS) {
    const p = SHOP.itemP(def, null);
    const kind = getDecodeNum(p.tag, 6, 7);
    rows.push({ shopId: 'skin-shop', goodsId: p.id, typeId: Number(p.type_id), num: p.num, tag: p.tag, kind, kindName: KIND_NAME[kind] ?? ('UNKNOWN_' + kind), currency: p.currency });
  }
} catch (e) { rows.push({ shopId: 'skin-shop', error: 'SKIN_GOODS 读取失败: ' + e.message }); }

// ---- 逐条判定 ----
const violations = [];
const warnings = [];
const seen = new Set();
const uniq = [];
for (const r of rows) {
  if (r.error) { violations.push({ ...r, reason: r.error }); continue; }
  const k = r.shopId + ':' + r.goodsId + ':' + r.typeId;
  if (seen.has(k)) continue;
  seen.add(k);
  uniq.push(r);
}

for (const r of uniq) {
  const inItems = CLIENT_ITEMS.has(r.typeId);
  let ok = true, reason = '';

  if (r.kind === KIND_SKIN) {
    // fillDetailSkin：getServantSkinItemVO(skin) + getServantConfigVO(skinToType(skin))
    // skinToType 找不到会回落 floor(skinID/100)，不崩；但 getServantConfigVO 为 nil 时 `.skinID = slot1` 崩
    const st = Math.floor(r.typeId / 100);
    if (!CLIENT_SERVANTS.has(st)) { ok = false; reason = `SKIN 分支 skinToType(${r.typeId})=${st} 不在 CfgServant（getServantConfigVO 返回 nil → .skinID 赋值崩）`; }
    else if (CLIENT_SKINS.size > 100 && !CLIENT_SKINS.has(r.typeId)) { ok = false; reason = `SKIN 分支 ${r.typeId} 不在 CfgServantSkin（换装头像/立绘查不到，skinItemVO=nil）`; }
  } else if (r.kind === KIND_RECHARGE) {
    ok = true;   // 客户端该分支什么都不做
  } else if (r.kind === KIND_SERVANT) {
    // fillDetailServant：先 getItemVO(typeID)（必须 ∈ CfgItems），再 getServantConfigVO(typeID % 10^7)
    const sid = r.typeId % 10000000;
    if (!inItems) { ok = false; reason = `SERVANT 分支 getItemVO(${r.typeId}) 不在 CfgItems（第一步就报"道具不存在"）`; }
    else if (!CLIENT_SERVANTS.has(sid)) { ok = false; reason = `SERVANT 分支 ${r.typeId}%10^7=${sid} 不在 CfgServant（卡面建不出来）`; }
  } else {
    // GOODS(0) / GIFTS(2)：fillCommonItemVO(typeID) → getItemVO(typeID)
    if (!inItems) { ok = false; reason = `${r.kindName} 分支 getItemVO(${r.typeId}) 不在 CfgItems`; }
  }

  // 交叉校验：形态与分支是否匹配（不匹配不一定是 bug，但值得记 WARN）
  if (ok && r.kind === KIND_GOODS && r.typeId >= 30000000 && r.typeId < 32000000 && !inItems) {
    warnings.push({ ...r, reason: '疑似誓灵凭证但 tag 未标记 SERVANT' });
  }
  if (!ok) violations.push({ ...r, reason });
}

// ---- 输出 ----
const verbose = process.argv.includes('--verbose');
const asJson = process.argv.includes('--json');
if (asJson) {
  console.log(JSON.stringify({ cfgItems: cfgItemsSrc, itemCount: CLIENT_ITEMS.size, servantCount: CLIENT_SERVANTS.size, total: uniq.length, violations, warnings }, null, 2));
} else {
  console.log(`CfgItems 来源：${path.relative(ROOT, cfgItemsSrc)}（${CLIENT_ITEMS.size} 条）`);
  console.log(`CfgServant/合法誓灵 type：${CLIENT_SERVANTS.size} 个；CfgServantSkin 皮肤：${CLIENT_SKINS.size} 个`);
  const byShop = {};
  for (const r of uniq) { (byShop[r.shopId] = byShop[r.shopId] || []).push(r); }
  console.log(`\n共审计 ${SHOP_IDS.length + 1} 家商店 / ${uniq.length} 件商品：`);
  for (const sid of Object.keys(byShop).sort((a, b) => a - b)) {
    const list = byShop[sid];
    const bad = violations.filter(v => v.shopId === Number(sid)).length;
    const kinds = [...new Set(list.map(x => x.kindName))].join(',');
    console.log(`  shop ${String(sid).padStart(2)}: ${String(list.length).padStart(3)} 件  分支=[${kinds}]  ${bad ? '❌ ' + bad + ' 违规' : '✓'}`);
  }
  if (verbose) {
    console.log('\n明细（shop/goods/type_id/tag/分支）：');
    for (const r of uniq) console.log(`  ${r.shopId}\t${r.goodsId}\t${r.typeId}\ttag=${r.tag}\t${r.kindName}`);
  }
  if (warnings.length) {
    console.log(`\n⚠ WARN ×${warnings.length}：`);
    for (const w of warnings) console.log(`  shop ${w.shopId} goods ${w.goodsId} type ${w.typeId}：${w.reason}`);
  }
  if (violations.length) {
    console.log(`\n❌ 违规 ×${violations.length}（客户端会报"道具不存在"）：`);
    for (const v of violations) console.log(`  shop ${v.shopId} goods ${v.goodsId} type ${v.typeId} tag=${v.tag} [${v.kindName}]：${v.reason}`);
  } else {
    console.log('\n✓ 全部商品 type_id 均可被客户端解析');
  }
}
process.exit(violations.length ? 1 : 0);
