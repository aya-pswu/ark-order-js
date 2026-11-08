// 御灵士（Grow）数据表。客户端配置真相源（真机 bc 反编译）：
//   CfgGrow.lua  → 星图节点（servantStarViewInfo.servantStarViewList，22 节点）
//   CfgAvatar.lua→ 部件染色区/初始部件/染剂颜色/姿态动画/partGroups
//   wiki 御灵士页 → 升级消耗数值（服务端权威，经 astrolabe_config/level_up 的 next_exp/need 下发）
//   CfgItems(真机 vit_new) → 部件 461xxxxx / 染剂 6400xxxx 的道具名与图标（客户端渲染用）
//
// 部件 typeID 编码：461ABNNN —— Util.indexNum(t,7,8)==46 即部件（GrowConst.isPartItem），
// partType = floor(t/1000)%100（1帽子 2脸饰 3眉毛 4眼睛 5嘴巴 6头饰 7衣服 8背饰 9尾巴 10发型）。
// 染剂 64000001~8：1=随机（randomColors 2~8），2黑 3蓝 4绿 5红 6粉 7橙 8白（CfgAvatar.colors）。

const fs = require('fs');
const path = require('path');

// 星云点：战斗结算按「当次所有誓灵实得经验的 1/750」转化（额外获得、不扣经验），每周上限 1000（wiki）
const NEBULA_DIV = 750;
const WEEK_LIMIT = 1000;

// 星图节点。cost = 升到第 1/2/…/N 级各需星云点（下标 0 = 升 lv1）；cost 为单值数组的 maxLv=0 节点
// 表示无限次购买型（随机染剂/魔术箱），每次消耗固定值、等级只累加计数。
// front = 解锁前置（客户端 isLockStar：**任一**前置 lv>0 即解锁——"或"关系，照抄 CfgGrow.frontIdList）。
const STARS = [
  { id: 1,  name: '装扮',       maxLv: 1, front: [],        cost: [0] },
  { id: 2,  name: '服饰染色',   maxLv: 1, front: [1],       cost: [100] },
  { id: 3,  name: '角色姿态',   maxLv: 1, front: [1],       cost: [100] },
  { id: 4,  name: '装扮福袋A',  maxLv: 2, front: [2],       cost: [200, 1000] },
  { id: 5,  name: '装扮福袋B',  maxLv: 2, front: [4],       cost: [200, 1000] },
  { id: 6,  name: '装扮福袋C',  maxLv: 2, front: [4],       cost: [200, 1000] },
  { id: 7,  name: '装扮福袋D',  maxLv: 2, front: [4],       cost: [200, 1000] },
  { id: 8,  name: '装扮福袋E',  maxLv: 2, front: [9, 10],   cost: [200, 1000] },
  { id: 9,  name: '站姿:叉会腰', maxLv: 1, front: [3],      cost: [200] },
  { id: 10, name: '站姿:招手',   maxLv: 1, front: [3],      cost: [200] },
  { id: 11, name: '随机染剂',   maxLv: 0, front: [7, 8],    cost: 500 },
  { id: 31, name: '基础建造',   maxLv: 1, front: [],        cost: [0] },
  { id: 32, name: '仓库扩建',   maxLv: 5, front: [31],      cost: [100, 300, 500, 700, 800] },
  { id: 33, name: '电容扩充',   maxLv: 5, front: [31],      cost: [100, 300, 500, 700, 800] },
  { id: 34, name: '信仰加倍',   maxLv: 5, front: [32],      cost: [100, 300, 500, 700, 800] },
  { id: 35, name: '加强电流',   maxLv: 5, front: [33],      cost: [100, 300, 500, 700, 800] },
  { id: 36, name: '电池包扩容', maxLv: 5, front: [34, 35],  cost: [100, 300, 500, 700, 800] },
  { id: 37, name: '钱包扩容',   maxLv: 5, front: [36],      cost: [100, 300, 500, 700, 800] },
  { id: 38, name: '画布拉伸',   maxLv: 5, front: [37],      cost: [100, 300, 500, 700, 800] },
  { id: 39, name: '房屋扩建',   maxLv: 5, front: [37],      cost: [100, 300, 500, 700, 800] },
  { id: 40, name: '背包扩建',   maxLv: 5, front: [37],      cost: [100, 300, 500, 700, 800] },
  { id: 41, name: '背包扩建II', maxLv: 5, front: [38],      cost: [100, 300, 500, 700, 800] },
  { id: 42, name: '幸运值UP',   maxLv: 5, front: [39, 40],  cost: [100, 300, 500, 700, 800] }, // 训练大成功率 +0.5pp/级，系数见 train_data.TRAIN_LUCK_PCT_PER_LV
  { id: 43, name: '专注加倍',   maxLv: 5, front: [41],      cost: [100, 300, 500, 700, 800] },
  { id: 44, name: '效率提升',   maxLv: 5, front: [43],      cost: [100, 300, 500, 700, 800] },
  { id: 45, name: '加速消化',   maxLv: 5, front: [39],      cost: [100, 300, 500, 700, 800] },
  { id: 46, name: '魔术箱',     maxLv: 0, front: [42, 45],  cost: 200 },
];
const STAR_BY_ID = {};
for (const s of STARS) STAR_BY_ID[s.id] = s;

// 星图效果系数（宿主模块读 starLv(id) 后乘/加，见各接入点注释）
const EFFECT = {
  VIT_STORE_PER_LV: 100,    // 36 电池包扩容：主角体力上限 +100/级（vit.js pushLimit）
  SILVER_STORE_PER_LV: 500, // 37 钱包扩容：主角金币上限 +500/级（vit.js pushLimit）
  BAG_MAT_PER_LV: 5,        // 40 背包扩建：材料背包(bag_type 1) +5 格/级（lib.bagSizeOf）
  BAG_RELIC_PER_LV: 5,      // 41 背包扩建II：圣器/核心背包(bag_type 2/4) +5 格/级（lib.bagSizeOf）
  EXP_MULT_PER_LV: 0.01,    // 43 专注加倍：主线/活动副本战斗誓灵经验 +1%/级（map_fight.js 结算）
  ROOM_PER_LV: 1,           // 39 房屋扩建：誓灵小屋 +1 格/级（dorm.js）
  POWER_PER_LV: 0.02,       // 44 效率提升：派遣资源 +2%/级（dorm.js 派遣奖励）
  VIT_GEN_PER_LV: 2,        // 35 加强电流：用爱发电每小时产量 +2/级（vit_data.studyEffect）
  VIT_STORE_ADD_PER_LV: 50, // 33 电容扩充：用爱发电最大储存 +50/级
  SILVER_GEN_PER_LV: 5,     // 34 信仰加倍：信仰充值每小时产量 +5/级
  SILVER_STORE_ADD_PER_LV: 150, // 32 仓库扩建：信仰充值最大储存 +150/级
};

// 创建化身时赠予的初始部件（CfgAvatar.inits：五类可选部件全集；客户端创建面板默认各穿第一个）
const INIT_PARTS = [
  46103001, 46103002, 46103003, 46103004,       // 眉毛
  46104001, 46104002,                            // 眼睛
  46105001, 46105002, 46105003,                  // 嘴巴
  46107009, 46107010, 46107011, 46107012,        // 衣服
  46110001, 46110002,                            // 发型
];

// 性别转变价格（客户端 GrowCostumeView.switchSex 提示文案硬编码 2000 金币）
const CHANGE_SEX_COST = 2000;

// 换装部件商城（shopId 34~43 = 部件 partType 1~10，44 = 染剂；GrowShopPanel.onPartSelect: shopID=index+34）。
// 官方价签只可考部分（wiki 服装商城），全部上架、按部位统一定价（本地服自定价模式，同 shop_data.js 先例）。
const SHOP_PRICE = {
  1: 10000, 2: 8000, 3: 8000, 4: 8000, 5: 8000, 6: 1500,
  7: 30000, 8: 10000, 9: 15000, 10: 28000,
};
const DYE_PRICE = 100; // 染剂（64000002~8）100 水晶（wiki 染剂表）

// 商品 id 规则（稳定、可反解回 type_id）：
//   部件： (partType+33)*1e6 + (typeID-46100000)   如 46101001 → 34001001
//   染剂： 44*1e6 + (typeID-64000000)              如 64000002 → 44000002
function goodsIdOf(typeId) {
  const t = Number(typeId);
  const pt = Math.floor(t / 1000) % 100;
  if (t >= 64000001 && t <= 64000008) return 44000000 + (t - 64000000);
  return (pt + 33) * 1000000 + (t - 46100000);
}

// 部件清单来自真机版 CfgItems（与 lib.js VALID_ITEM_TYPES 同源），生成时内联固化，运行期零解析。
// 生成脚本见 tools/bc_cmp/grow_parts.json（extract 2026-09-06）。
let PART_TYPES = [];
try {
  const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'tools', 'bc_cmp', 'grow_parts.json'), 'utf8'));
  PART_TYPES = raw.parts.filter(t => Math.floor(t / 1000) % 100 >= 1 && Math.floor(t / 1000) % 100 <= 10);
} catch (e) { /* 无清单则商城为空（不影响星图/换装主链路） */ }

// 染剂颜色索引 → 染剂道具 typeID（CfgAvatar.colors 下标即 dyeColorType：2黑…8白；1=随机不进商城）
const DYE_COLOR_TO_ITEM = { 2: 64000002, 3: 64000003, 4: 64000004, 5: 64000005, 6: 64000006, 7: 64000007, 8: 64000008 };
const DYE_ITEM_TO_COLOR = {};
for (const [c, t] of Object.entries(DYE_COLOR_TO_ITEM)) DYE_ITEM_TO_COLOR[t] = Number(c);
const RANDOM_DYE_ITEM = 64000001;
const DYE_RANDOM_COLORS = [2, 3, 4, 5, 6, 7, 8]; // CfgAvatar.colors[64000001].randomColors

// 魔术箱奖励池（wiki 魔术箱条目；金币走 roleAsset.silver 直加，其余入包）
const MAGIC_BOX_POOL = [
  { w: 20, kind: 'goods', type_id: 64000001, min: 1, max: 1 },   // 随机染剂
  { w: 15, kind: 'goods', type_id: 31000015, min: 2, max: 3 },   // 薛定谔的圣器块 ×2~3
  { w: 15, kind: 'goods', type_id: 20016002, min: 5, max: 8 },   // 闪耀的自然结晶 ×5~8
  { w: 15, kind: 'silver', min: 500, max: 1000 },                // 金币 500~1000
  { w: 10, kind: 'goods', type_id: 20000026, min: 1, max: 1 },   // 巨人指环（进化素材Lv3）
  { w: 10, kind: 'goods', type_id: 31000004, min: 1, max: 1 },   // 约定之契
];

// 御灵士商城商品表（shopId → goods[]）。部件不可堆叠（CfgItems canPile=false）但拥有判定按 type_id，
// grantGoods 普通堆叠不影响衣柜展示（衣柜按 type_id 去重下发）。
function shopDefsOf(shopId) {
  const defs = [];
  if (shopId >= 34 && shopId <= 43) {
    const pt = shopId - 33;
    for (const t of PART_TYPES) {
      if (Math.floor(t / 1000) % 100 !== pt) continue;
      defs.push({ id: goodsIdOf(t), type_id: t, num: 1, price: SHOP_PRICE[pt], currency: 100, total_times: 1, part: true });
    }
  } else if (shopId === 44) {
    for (const t of Object.values(DYE_COLOR_TO_ITEM)) {
      defs.push({ id: goodsIdOf(t), type_id: t, num: 1, price: DYE_PRICE, currency: 200, total_times: 999 });
    }
  }
  return defs;
}

// 商城 shopId 列表（御灵士商城不做 m_shop_shops_toc 开关——它不走主页商店入口，页签固定创建）
const GROW_SHOP_IDS = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];

module.exports = {
  NEBULA_DIV, WEEK_LIMIT, STARS, STAR_BY_ID, EFFECT, INIT_PARTS, CHANGE_SEX_COST,
  SHOP_PRICE, DYE_PRICE, PART_TYPES, DYE_COLOR_TO_ITEM, DYE_ITEM_TO_COLOR,
  RANDOM_DYE_ITEM, DYE_RANDOM_COLORS, MAGIC_BOX_POOL, shopDefsOf, GROW_SHOP_IDS, goodsIdOf,
};
