// 生成：tools/bc_cmp/extract_shop.js（勿手改）。
// 主页商店（ShopModule）商品表：官方商品表不可考（客户端只有页签/货币表 CfgShop），
// 商品 100% 由服务端 m_shop_detail_toc 下发，本表为本地服自定价——价格锚点见 extract_shop.js 头注。
// tag 是十进制位串（客户端 ShopUtil.getDecodeNum 从右数位）：
//   末3位=折扣角标(如 020→"-20% OFF")，第6-7位=商品类型(1=皮肤 2=礼盒 0=普通)，第8位=已拥有(皮肤用)。
//   普通道具 tag=0；皮肤未拥有=100000、已拥有=10100000；礼盒=200000；折扣=折扣百分点数(如 20)。
const CRYSTAL = 200; // ShopConst.COST_TYPE_Crystal
const GOLD = 100;    // ShopConst.COST_TYPE_Gold（金币）
const SCORE_ID = 3;  // 兑换商店组货币：破碎之契（role_scores id 3，CfgShop.exchangeScoreMap[11].scoreType，誓约破除产出）

// 开启的商店列表（m_shop_shops_toc.shops；4=购买水晶 走 SDK 真钱支付不开；11/12=兑换商店组，货币=破碎之契 score3，
// 由誓约破除获得；其余兑换商店（13 集樱/14 演武/15 试炼/16+ 活动）货币来源系统未实现，不开）
const OPEN_SHOPS = [1, 2, 3, 5, 11, 12, 50];

// 商店5 辅助道具（常驻）。goodsId 5004 = 客户端 FamilyMgr 硬编码的改名卡档位，勿改。
const SHOP5_GOODS = [
  { id: 5001, type_id: 20010000, num: 1, price: 5, currency: CRYSTAL, total_times: 999 }, // 暗淡的水结晶
  { id: 5002, type_id: 20010001, num: 1, price: 18, currency: CRYSTAL, total_times: 999 }, // 明亮的水结晶
  { id: 5003, type_id: 20010002, num: 1, price: 55, currency: CRYSTAL, total_times: 999 }, // 闪耀的水结晶
  { id: 5005, type_id: 20011000, num: 1, price: 5, currency: CRYSTAL, total_times: 999 }, // 暗淡的火结晶
  { id: 5006, type_id: 20011001, num: 1, price: 18, currency: CRYSTAL, total_times: 999 }, // 明亮的火结晶
  { id: 5007, type_id: 20011002, num: 1, price: 55, currency: CRYSTAL, total_times: 999 }, // 闪耀的火结晶
  { id: 5008, type_id: 20012000, num: 1, price: 5, currency: CRYSTAL, total_times: 999 }, // 暗淡的风结晶
  { id: 5009, type_id: 20012001, num: 1, price: 18, currency: CRYSTAL, total_times: 999 }, // 明亮的风结晶
  { id: 5010, type_id: 20012002, num: 1, price: 55, currency: CRYSTAL, total_times: 999 }, // 闪耀的风结晶
  { id: 5011, type_id: 20013000, num: 1, price: 5, currency: CRYSTAL, total_times: 999 }, // 暗淡的土结晶
  { id: 5012, type_id: 20013001, num: 1, price: 18, currency: CRYSTAL, total_times: 999 }, // 明亮的土结晶
  { id: 5013, type_id: 20013002, num: 1, price: 55, currency: CRYSTAL, total_times: 999 }, // 闪耀的土结晶
  { id: 5014, type_id: 20014000, num: 1, price: 5, currency: CRYSTAL, total_times: 999 }, // 暗淡的光结晶
  { id: 5015, type_id: 20014001, num: 1, price: 18, currency: CRYSTAL, total_times: 999 }, // 明亮的光结晶
  { id: 5016, type_id: 20014002, num: 1, price: 55, currency: CRYSTAL, total_times: 999 }, // 闪耀的光结晶
  { id: 5017, type_id: 20015000, num: 1, price: 5, currency: CRYSTAL, total_times: 999 }, // 暗淡的暗结晶
  { id: 5018, type_id: 20015001, num: 1, price: 18, currency: CRYSTAL, total_times: 999 }, // 明亮的暗结晶
  { id: 5019, type_id: 20015002, num: 1, price: 55, currency: CRYSTAL, total_times: 999 }, // 闪耀的暗结晶
  { id: 5020, type_id: 20016000, num: 1, price: 18, currency: CRYSTAL, total_times: 999 }, // 暗淡的自然结晶
  { id: 5021, type_id: 20016001, num: 1, price: 18, currency: CRYSTAL, total_times: 999 }, // 明亮的自然结晶
  { id: 5022, type_id: 20016002, num: 1, price: 18, currency: CRYSTAL, total_times: 999 }, // 闪耀的自然结晶
  { id: 5023, type_id: 60000160, num: 1, price: 800, currency: CRYSTAL, total_times: 999 }, // 雪见大福
  { id: 5024, type_id: 27000000, num: 1, price: 12, currency: CRYSTAL, total_times: 999 }, // 核心晶组Lv1
  { id: 5025, type_id: 27000001, num: 1, price: 35, currency: CRYSTAL, total_times: 999 }, // 核心晶组Lv2
  { id: 5026, type_id: 27000002, num: 1, price: 90, currency: CRYSTAL, total_times: 999 }, // 核心晶组Lv3
  { id: 5027, type_id: 21500010, num: 1, price: 50, currency: CRYSTAL, total_times: 99 }, // 体力特惠宝箱(500体)
  { id: 5028, type_id: 21500011, num: 1, price: 150, currency: CRYSTAL, total_times: 30 }, // 体力超值宝箱(1600体)
  { id: 5029, type_id: 21500012, num: 1, price: 300, currency: CRYSTAL, total_times: 10 }, // 体力豪华宝箱(3500体)
  { id: 5030, type_id: 21007001, num: 1, price: 160, currency: CRYSTAL, total_times: 20 }, // 阿斯加德遗物箱
  { id: 5031, type_id: 21007002, num: 1, price: 160, currency: CRYSTAL, total_times: 20 }, // 幻想遗物箱
  { id: 5032, type_id: 21007003, num: 1, price: 160, currency: CRYSTAL, total_times: 20 }, // 阿瓦隆遗物箱
  { id: 5033, type_id: 21007004, num: 1, price: 160, currency: CRYSTAL, total_times: 20 }, // 高天原遗物箱
  { id: 5034, type_id: 21007005, num: 1, price: 160, currency: CRYSTAL, total_times: 20 }, // 奥林匹斯遗物箱
  { id: 5035, type_id: 21007006, num: 1, price: 160, currency: CRYSTAL, total_times: 20 }, // 九霄遗物箱
  { id: 5036, type_id: 21007007, num: 1, price: 160, currency: CRYSTAL, total_times: 20 }, // 赫里奥波里斯遗物箱
  { id: 5037, type_id: 21007008, num: 1, price: 160, currency: CRYSTAL, total_times: 20 }, // 婆罗多遗物箱
  { id: 5038, type_id: 21104000, num: 1, price: 180, currency: CRYSTAL, total_times: 20 }, // 原初核心遗物箱
  { id: 5004, type_id: 31000064, num: 1, price: 680, currency: CRYSTAL, total_times: 99 }, // 结社改名卡
  // ---- 羁绊（送礼）道具：**官方 CfgShop 里一件都没上架**，礼物只在活动奖励里零星出现
  // （日常活跃度 70 宝箱给 1 个神秘的礼物Lv2），不补出处羁绊系统就没法玩 → 本地服在这里开常驻售卖。
  // 28001xxx = 紫(color4) 档、28000000/01 = 万能礼物盒（CfgGift.preference=[0]，命中任何心愿）。
  // 定价锚：紫礼物 60 水晶 ≈ 命中心愿 300 satisfaction = 3 点羁绊；万能盒贵一档换"必中"
  { id: 5040, type_id: 28001000, num: 1, price: 60, currency: CRYSTAL, total_times: 999 }, // 箱庭盆栽（传统/日常/鲜艳/正经）
  { id: 5041, type_id: 28001001, num: 1, price: 60, currency: CRYSTAL, total_times: 999 }, // 猫耳发箍（日常/萌/鲜艳/决战/喵喵）
  { id: 5042, type_id: 28001002, num: 1, price: 60, currency: CRYSTAL, total_times: 999 }, // 等身大抱枕（萌/可爱/危险/不能带进商店）
  { id: 5043, type_id: 28001003, num: 1, price: 60, currency: CRYSTAL, total_times: 999 }, // 慕斯蛋糕（可爱/能吃/鲜艳/正经/香甜）
  { id: 5044, type_id: 28001004, num: 1, price: 60, currency: CRYSTAL, total_times: 999 }, // 鲱鱼罐头（能吃/诡异/危险/决战/生化）
  { id: 5045, type_id: 28001005, num: 1, price: 60, currency: CRYSTAL, total_times: 999 }, // 埃尔特顿破片（诡异/珍贵/低调/危险/降SAN）
  { id: 5046, type_id: 28001006, num: 1, price: 60, currency: CRYSTAL, total_times: 999 }, // 蓝钻（珍贵/闪亮/正经/又硬又脆）
  { id: 5047, type_id: 28001007, num: 1, price: 60, currency: CRYSTAL, total_times: 999 }, // 白银匕首（闪亮/战场/低调/辟邪）
  { id: 5048, type_id: 28001008, num: 1, price: 60, currency: CRYSTAL, total_times: 999 }, // 手持粒子炮（战场/黑科技/决战/探照灯）
  { id: 5049, type_id: 28001009, num: 1, price: 60, currency: CRYSTAL, total_times: 999 }, // 全息资料集（黑科技/学术/正经/摸鱼）
  { id: 5050, type_id: 28001010, num: 1, price: 60, currency: CRYSTAL, total_times: 999 }, // 故事书（学术/传统/低调/治疗失眠）
  { id: 5051, type_id: 28000001, num: 1, price: 150, currency: CRYSTAL, total_times: 999 }, // 熊猫礼物盒（万能·紫）
  { id: 5052, type_id: 28000000, num: 1, price: 320, currency: CRYSTAL, total_times: 999 }, // 雪兔礼物盒（万能·金）
  // 缔结灵契道具（CfgMarry.proposalItem）：羁绊满 100 后才用得上，官方同样无售卖出处
  { id: 5053, type_id: 31000014, num: 1, price: 600, currency: CRYSTAL, total_times: 99 }, // 结缔灵契道具
  // PS 补充（2026-10-24）：元素晶石礼包（选 1 个专属晶石 / 或泛用型 ×2）。
  // 原版这个礼包没有任何投放口，63 个晶石只有 8 个能从关卡掉落拿到；此处按水晶常驻售卖。
  { id: 5054, type_id: 20000916, num: 1, price: 300, currency: CRYSTAL, total_times: 999 }, // 元素晶石礼包
];

// 商店3 优惠礼盒（tag 类型=礼盒，客户端按 CfgItems.data 预览内容；等级礼包一次性）
const SHOP3_GOODS = [
  { id: 3001, type_id: 21500090, num: 1, price: 240, currency: CRYSTAL, total_times: 10, tag: 200000 }, // 核心限时礼包
  { id: 3002, type_id: 21500091, num: 1, price: 240, currency: CRYSTAL, total_times: 10, tag: 200000 }, // 圣器限时礼包
  { id: 3003, type_id: 21500085, num: 1, price: 220, currency: CRYSTAL, total_times: 10, tag: 200000 }, // 协会约定礼包(含水晶200)
  { id: 3004, type_id: 21500002, num: 1, price: 60, currency: CRYSTAL, total_times: 1, tag: 200000 }, // 10级补给礼包
  { id: 3005, type_id: 21500003, num: 1, price: 80, currency: CRYSTAL, total_times: 1, tag: 200000 }, // 20级补给礼包
  { id: 3006, type_id: 21500004, num: 1, price: 100, currency: CRYSTAL, total_times: 1, tag: 200000 }, // 30级补给礼包
  { id: 3007, type_id: 21500005, num: 1, price: 120, currency: CRYSTAL, total_times: 1, tag: 200000 }, // 40级补给礼包
  { id: 3008, type_id: 21500006, num: 1, price: 150, currency: CRYSTAL, total_times: 1, tag: 200000 }, // 50级补给礼包
  { id: 3009, type_id: 21500007, num: 1, price: 180, currency: CRYSTAL, total_times: 1, tag: 200000 }, // 60级补给礼包
  // 通行证/补给站加速礼包（水晶直购，购买即激活对应活动的加速引擎/超能加速器并获得 10000+20% 晶石）
  // ⚠️ 动荡的时空只保留一个加速引擎（1107/1108），3010（1311/1314）已随活动 1311 一起下线。
  //    理由见 handlers/activity.js ACT_OPEN 处注释：1311 与 1107 是同一活动的两个期，
  //    两者同时存在会让同一份时间晶体余额被两个面板各画一遍、领取状态互相矛盾。
  //    —— 3010 的购买记录（存档 shopState.bought["3010"]）不回滚，只为历史数据留痕。
  { id: 3011, type_id: 21500169, num: 1, price: 680, currency: CRYSTAL, total_times: 1, tag: 200000, buff: { type: 1326, buff_type: 3, actId: 1325, scoreId: 2128 } }, // 超能加速器（冬日补给站 1325）
  { id: 3012, type_id: 21500136, num: 1, price: 680, currency: CRYSTAL, total_times: 1, tag: 200000, buff: { type: 1328, buff_type: 3, actId: 1327, scoreId: 75 } },   // 超能加速器（萌新补给站 1327）
  { id: 3013, type_id: 21500050, num: 1, price: 680, currency: CRYSTAL, total_times: 1, tag: 200000, buff: { type: 1108, buff_type: 3, actId: 1107, scoreId: 2250 } }, // 加速引擎（动荡的时空 1107）
];

// 商店2 角色换装：非 live2d 皮肤 122 个。
// ⚠ type_id 必须发【皮肤 id】（CfgServantSkin.skinID，如 111600811），不是皮肤道具 id（22001001）——
// 客户端 fillDetailSkin 直接拿 type_id 查皮肤表并 skinToType(floor(id/100)) 反查誓灵，发道具 id 会报
// "不存在的誓灵ID"并连锁崩换装页签（真机实证 2026-08-24）。购买走"直接激活皮肤"官方语义
// （m_servant_shop_active_skin_toc），不发道具入包。item_id 仅服务端判定"已拥有"用。
const SKIN_GOODS = [
  { id: 2001, type_id: 111600811, item_id: 22001001, skin_id: 111600811, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 夜巡之凛火
  { id: 2002, type_id: 131101411, item_id: 22001002, skin_id: 131101411, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 黑喵的恶作剧
  { id: 2003, type_id: 132500711, item_id: 22001003, skin_id: 132500711, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 跃动于糖果之夜
  { id: 2004, type_id: 163401211, item_id: 22001005, skin_id: 163401211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 保健室的小恶魔
  { id: 2005, type_id: 164500111, item_id: 22001006, skin_id: 164500111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 巡纪的首席
  { id: 2006, type_id: 113401011, item_id: 22001007, skin_id: 113401011, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 晶簇圣夜祭
  { id: 2007, type_id: 144300111, item_id: 22001008, skin_id: 144300111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 圣诞协奏曲
  { id: 2008, type_id: 151401011, item_id: 22001010, skin_id: 151401011, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 墨·星夜
  { id: 2009, type_id: 151101111, item_id: 22001011, skin_id: 151101111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 苍·雪华
  { id: 2010, type_id: 104601511, item_id: 22001012, skin_id: 104601511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 蝠翼的祝福
  { id: 2011, type_id: 144401811, item_id: 22001013, skin_id: 144401811, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 雪地的狂战士
  { id: 2012, type_id: 104200111, item_id: 22001014, skin_id: 104200111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 春之宴
  { id: 2013, type_id: 154401511, item_id: 22001016, skin_id: 154401511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 春奏雨
  { id: 2014, type_id: 154302011, item_id: 22001017, skin_id: 154302011, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 春醉曲
  { id: 2015, type_id: 103300311, item_id: 22001018, skin_id: 103300311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 碧色假日
  { id: 2016, type_id: 114100711, item_id: 22001019, skin_id: 114100711, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 苍海星语
  { id: 2017, type_id: 134501211, item_id: 22001021, skin_id: 134501211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 海之巡
  { id: 2018, type_id: 124100411, item_id: 22001022, skin_id: 124100411, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 夏浪贝语
  { id: 2019, type_id: 134601611, item_id: 22001023, skin_id: 134601611, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 夏之憩
  { id: 2020, type_id: 103201611, item_id: 22001024, skin_id: 103201611, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 海风微醺
  { id: 2021, type_id: 113301811, item_id: 22001025, skin_id: 113301811, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 战浪序曲
  { id: 2022, type_id: 104401711, item_id: 22001026, skin_id: 104401711, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 夏时契
  { id: 2023, type_id: 103101111, item_id: 22001027, skin_id: 103101111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 夏时楔
  { id: 2024, type_id: 153502111, item_id: 22001029, skin_id: 153502111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 夏时槿
  { id: 2025, type_id: 133100311, item_id: 22001030, skin_id: 133100311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 夏时醺
  { id: 2026, type_id: 224500111, item_id: 22001031, skin_id: 224500111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 星野梦美-樱绽
  { id: 2027, type_id: 143600411, item_id: 22001032, skin_id: 143600411, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 幻乐之城
  { id: 2028, type_id: 143602211, item_id: 22001033, skin_id: 143602211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 夜幕星河
  { id: 2029, type_id: 142103111, item_id: 22001034, skin_id: 142103111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 惑彩变奏曲
  { id: 2030, type_id: 142200711, item_id: 22001035, skin_id: 142200711, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 布偶独幕剧
  { id: 2031, type_id: 163501111, item_id: 22001036, skin_id: 163501111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 玫色小夜曲
  { id: 2032, type_id: 143602411, item_id: 22001037, skin_id: 143602411, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 爱乐之奏
  { id: 2033, type_id: 134102011, item_id: 22001038, skin_id: 134102011, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 嬉园之夏
  { id: 2034, type_id: 133102111, item_id: 22001039, skin_id: 133102111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 绀碧色的制裁
  { id: 2035, type_id: 143402811, item_id: 22001040, skin_id: 143402811, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 仲夏攻略
  { id: 2036, type_id: 163401611, item_id: 22001041, skin_id: 163401611, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 和平的馈赠
  { id: 2037, type_id: 163201811, item_id: 22001042, skin_id: 163201811, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 悠然圆舞曲
  { id: 2038, type_id: 234200212, item_id: 22001045, skin_id: 234200212, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 灼炎绯焰
  { id: 2039, type_id: 234100512, item_id: 22001047, skin_id: 234100512, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 冰傀之偶
  { id: 2040, type_id: 183500111, item_id: 22001050, skin_id: 183500111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 强无敌
  { id: 2041, type_id: 183600211, item_id: 22001051, skin_id: 183600211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 迷宫壁
  { id: 2042, type_id: 114602311, item_id: 22001052, skin_id: 114602311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 熊熊咖啡厅
  { id: 2043, type_id: 113602511, item_id: 22001053, skin_id: 113602511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 喵喵下午茶
  { id: 2044, type_id: 143401711, item_id: 22001054, skin_id: 143401711, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 兔兔甜点屋
  { id: 2045, type_id: 102401911, item_id: 22001055, skin_id: 102401911, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 冰狼酒馆
  { id: 2046, type_id: 234500312, item_id: 22001057, skin_id: 234500312, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 救世魔王
  { id: 2047, type_id: 153400311, item_id: 22001058, skin_id: 153400311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 相思引
  { id: 2048, type_id: 154101911, item_id: 22001059, skin_id: 154101911, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 噬千辰
  { id: 2049, type_id: 153202311, item_id: 22001060, skin_id: 153202311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 鹊-曙红
  { id: 2050, type_id: 153102411, item_id: 22001061, skin_id: 153102411, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 鹊-霁蓝
  { id: 2051, type_id: 244500111, item_id: 22001062, skin_id: 244500111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 梦之茧
  { id: 2052, type_id: 243200411, item_id: 22001063, skin_id: 243200411, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 皇女秘辛
  { id: 2053, type_id: 244500112, item_id: 22001064, skin_id: 244500112, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 黑白之弈
  { id: 2054, type_id: 133100360, item_id: 22001065, skin_id: 133100360, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 八岐大蛇-暗噬
  { id: 2055, type_id: 104300811, item_id: 22001069, skin_id: 104300811, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 畅祝之宴
  { id: 2056, type_id: 112601111, item_id: 22001071, skin_id: 112601111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 夜巡之影
  { id: 2057, type_id: 143501911, item_id: 22001072, skin_id: 143501911, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 煌彩之希
  { id: 2058, type_id: 104300611, item_id: 22001073, skin_id: 104300611, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 凛宴之主
  { id: 2059, type_id: 263300511, item_id: 22001074, skin_id: 263300511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 夜视之慕
  { id: 2060, type_id: 133202211, item_id: 22001075, skin_id: 133202211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 玄羽之宴
  { id: 2061, type_id: 153202211, item_id: 22001076, skin_id: 153202211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 绮焰之逢
  { id: 2062, type_id: 274400111, item_id: 22001077, skin_id: 274400111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 藤攀月
  { id: 2063, type_id: 274200211, item_id: 22001078, skin_id: 274200211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 栖宵露
  { id: 2064, type_id: 274100311, item_id: 22001079, skin_id: 274100311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 花时雨
  { id: 2065, type_id: 154400111, item_id: 22001082, skin_id: 154400111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 暗翼之主
  { id: 2066, type_id: 104600211, item_id: 22001083, skin_id: 104600211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 血月獠牙
  { id: 2067, type_id: 133601511, item_id: 22001084, skin_id: 133601511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 磷火浪客
  { id: 2068, type_id: 124600311, item_id: 22001085, skin_id: 124600311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 萨温女王
  { id: 2069, type_id: 143502911, item_id: 22001086, skin_id: 143502911, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 幽墓魅影
  { id: 2070, type_id: 113302611, item_id: 22001087, skin_id: 113302611, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 诸闇相挟
  { id: 2071, type_id: 124100711, item_id: 22001088, skin_id: 124100711, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 凛冬将至
  { id: 2072, type_id: 124500911, item_id: 22001089, skin_id: 124500911, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 夏末之祭
  { id: 2073, type_id: 123501211, item_id: 22001090, skin_id: 123501211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 万灵之集
  { id: 2074, type_id: 302600911, item_id: 22001092, skin_id: 302600911, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 心跳回忆
  { id: 2075, type_id: 104502311, item_id: 22001093, skin_id: 104502311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 猎获之巡
  { id: 2076, type_id: 302100411, item_id: 22001094, skin_id: 302100411, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 限时游戏
  { id: 2077, type_id: 153300511, item_id: 22001095, skin_id: 153300511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 银杏之约
  { id: 2078, type_id: 314500111, item_id: 22001096, skin_id: 314500111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 风华神乐
  { id: 2079, type_id: 314400211, item_id: 22001097, skin_id: 314400211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 待春之候
  { id: 2080, type_id: 314200311, item_id: 22001098, skin_id: 314200311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 渺渺胧月
  { id: 2081, type_id: 314300411, item_id: 22001099, skin_id: 314300411, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 小春日和
  { id: 2082, type_id: 314600511, item_id: 22001100, skin_id: 314600511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 岁寒晚翠
  { id: 2083, type_id: 124500511, item_id: 22001101, skin_id: 124500511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 圣夜礼诞
  { id: 2084, type_id: 113100611, item_id: 22001103, skin_id: 113100611, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 绯想铃曲
  { id: 2085, type_id: 102400511, item_id: 22001104, skin_id: 102400511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 礼巡秘使
  { id: 2086, type_id: 254500111, item_id: 22001105, skin_id: 254500111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 璨夜雪华
  { id: 2087, type_id: 254100211, item_id: 22001106, skin_id: 254100211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 星巡夜想
  { id: 2088, type_id: 304300511, item_id: 22001107, skin_id: 304300511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 帝征圣夜
  { id: 2089, type_id: 304500611, item_id: 22001108, skin_id: 304500611, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 冬日颂曲
  { id: 2090, type_id: 303200311, item_id: 22001109, skin_id: 303200311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 明识之夜
  { id: 2091, type_id: 303100811, item_id: 22001110, skin_id: 303100811, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 指狮为鹿
  { id: 2092, type_id: 264100211, item_id: 22001111, skin_id: 264100211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 触手生春
  { id: 2093, type_id: 134402611, item_id: 22001112, skin_id: 134402611, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 龙惊春
  { id: 2094, type_id: 144102611, item_id: 22001113, skin_id: 144102611, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 花千树
  { id: 2095, type_id: 143603911, item_id: 22001114, skin_id: 143603911, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 辞旧年
  { id: 2096, type_id: 104602111, item_id: 22001115, skin_id: 104602111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 贺岁正
  { id: 2097, type_id: 164301711, item_id: 22001116, skin_id: 164301711, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 偎端月
  { id: 2098, type_id: 264300811, item_id: 22001117, skin_id: 264300811, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 茜芳岁
  { id: 2099, type_id: 264800411, item_id: 22001118, skin_id: 264800411, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 添罗绮
  { id: 2100, type_id: 113501611, item_id: 22001119, skin_id: 113501611, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 戏游狮
  { id: 2101, type_id: 144202511, item_id: 22001120, skin_id: 144202511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 胭脂畔
  { id: 2102, type_id: 324500111, item_id: 22001121, skin_id: 324500111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 待会之森
  { id: 2103, type_id: 324200211, item_id: 22001122, skin_id: 324200211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 再启之夏
  { id: 2104, type_id: 114503011, item_id: 22001123, skin_id: 114503011, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 闇羽之休
  { id: 2105, type_id: 104302011, item_id: 22001124, skin_id: 104302011, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 邀梦之森
  { id: 2106, type_id: 133102711, item_id: 22001125, skin_id: 133102711, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 闲憩之游
  { id: 2107, type_id: 264800711, item_id: 22001126, skin_id: 264800711, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 酣战之境
  { id: 2108, type_id: 134402811, item_id: 22001127, skin_id: 134402811, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 雀色时
  { id: 2109, type_id: 134202911, item_id: 22001128, skin_id: 134202911, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 小夜中
  { id: 2110, type_id: 133603011, item_id: 22001129, skin_id: 133603011, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 清光明
  { id: 2111, type_id: 133103111, item_id: 22001130, skin_id: 133103111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 初弦上
  { id: 2112, type_id: 154402611, item_id: 22001131, skin_id: 154402611, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 最高指令
  { id: 2113, type_id: 104402611, item_id: 22001132, skin_id: 104402611, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 落红狼藉
  { id: 2114, type_id: 133403211, item_id: 22001133, skin_id: 133403211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 甜憩茶会
  { id: 2115, type_id: 103402711, item_id: 22001134, skin_id: 103402711, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 鹰羽之契
  { id: 2116, type_id: 124600811, item_id: 22001135, skin_id: 124600811, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 小御家的龙女仆
  { id: 2117, type_id: 123101011, item_id: 22001136, skin_id: 123101011, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 瑚海之诗
  { id: 2118, type_id: 264800311, item_id: 22001137, skin_id: 264800311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 混沌之宴
  { id: 2119, type_id: 114203511, item_id: 22001138, skin_id: 114203511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 绀碧之冠
  { id: 2120, type_id: 114103411, item_id: 22001139, skin_id: 114103411, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 甜蜜滋味
  { id: 2121, type_id: 144603611, item_id: 22001140, skin_id: 144603611, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 恋慕权杖
  { id: 2122, type_id: 304100111, item_id: 22001141, skin_id: 304100111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 碧色辰星
  // Live2D 皮肤（2123~2142，两段计价：原画 360 + Live2D 升级 120 = 展示价 480 水晶）
  { id: 2123, type_id: 133100611, item_id: 22001009, skin_id: 133100611, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 胧雪星想曲
  { id: 2124, type_id: 154500211, item_id: 22001015, skin_id: 154500211, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 春巡茜
  { id: 2125, type_id: 113100911, item_id: 22001020, skin_id: 113100911, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 不速之客
  { id: 2126, type_id: 103501211, item_id: 22001028, skin_id: 103501211, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 夏时憩
  { id: 2127, type_id: 234600111, item_id: 22001043, skin_id: 234600111, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 神威灵装·三番
  { id: 2128, type_id: 234200211, item_id: 22001044, skin_id: 234200211, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 神威灵装·五番
  { id: 2129, type_id: 234100511, item_id: 22001046, skin_id: 234100511, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 神威灵装·四番
  { id: 2130, type_id: 234400411, item_id: 22001048, skin_id: 234400411, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 神威灵装·十番
  { id: 2131, type_id: 234500311, item_id: 22001049, skin_id: 234500311, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 神威灵装·一番
  { id: 2132, type_id: 234400412, item_id: 22001056, skin_id: 234400412, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 堕剑之暗
  { id: 2133, type_id: 143200360, item_id: 22001066, skin_id: 143200360, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 普罗米修斯-暗噬
  { id: 2134, type_id: 153400360, item_id: 22001067, skin_id: 153400360, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 蚩尤-暗噬
  { id: 2135, type_id: 103300460, item_id: 22001068, skin_id: 103300460, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 伊登-暗噬
  { id: 2136, type_id: 134100111, item_id: 22001070, skin_id: 134100111, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 靛青之谧
  { id: 2137, type_id: 284500111, item_id: 22001080, skin_id: 284500111, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 虎儿皮肤
  { id: 2138, type_id: 284300211, item_id: 22001081, skin_id: 284300211, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 鹊儿皮肤
  { id: 2139, type_id: 144402311, item_id: 22001091, skin_id: 144402311, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 鬼狩之夜
  { id: 2140, type_id: 114202911, item_id: 22001102, skin_id: 114202911, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 物语续曲
  { id: 2141, type_id: 354200111, item_id: 22001156, skin_id: 354200111, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 平安烤鸭
  { id: 2142, type_id: 354200112, item_id: 22001160, skin_id: 354200112, num: 1, price: 360, l2d_price: 120, currency: CRYSTAL, total_times: 1 }, // 平安烤鸭-重创
  // 新增非 live2d 皮肤（2143~2162，标准价 480 水晶）
  { id: 2143, type_id: 264101311, item_id: 22001142, skin_id: 264101311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 清凉一夏
  { id: 2144, type_id: 334100111, item_id: 22001143, skin_id: 334100111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 草莓果酱
  { id: 2145, type_id: 334500211, item_id: 22001144, skin_id: 334500211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 尼特候补役
  { id: 2146, type_id: 334100189, item_id: 22001145, skin_id: 334100189, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 军服女仆
  { id: 2147, type_id: 344100111, item_id: 22001146, skin_id: 344100111, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 箱庭之巡
  { id: 2148, type_id: 344200211, item_id: 22001147, skin_id: 344200211, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 樱华密话
  { id: 2149, type_id: 344600311, item_id: 22001148, skin_id: 344600311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 心狙一击
  { id: 2150, type_id: 344300411, item_id: 22001149, skin_id: 344300411, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 霏雨紫阳
  { id: 2151, type_id: 344500511, item_id: 22001150, skin_id: 344500511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 逐愿森语
  { id: 2152, type_id: 154402711, item_id: 22001151, skin_id: 154402711, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 民以食为天
  { id: 2153, type_id: 124501711, item_id: 22001152, skin_id: 124501711, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 酒不醉人
  { id: 2154, type_id: 124100712, item_id: 22001153, skin_id: 124100712, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 暮色降临
  { id: 2155, type_id: 354500411, item_id: 22001154, skin_id: 354500411, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 白无垢
  { id: 2156, type_id: 351400511, item_id: 22001155, skin_id: 351400511, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 黑米饭
  { id: 2157, type_id: 354600311, item_id: 22001157, skin_id: 354600311, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 童谣
  { id: 2158, type_id: 354500412, item_id: 22001158, skin_id: 354500412, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 白无垢-重创
  { id: 2159, type_id: 351400512, item_id: 22001159, skin_id: 351400512, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 黑米饭-重创
  { id: 2160, type_id: 354600312, item_id: 22001161, skin_id: 354600312, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 童谣-重创
  { id: 2161, type_id: 144604411, item_id: 22001162, skin_id: 144604411, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 圣诞缠绵
  { id: 2162, type_id: 114603911, item_id: 22001163, skin_id: 114603911, num: 1, price: 480, currency: CRYSTAL, total_times: 1 }, // 雪鸮巡礼
];

// 商店11 契约兑换（货币=破碎之契 SCORE_ID=3，誓约破除产出）。价锚：R分解=2/SR=5/UR=10 勋章。
const SHOP11_GOODS = [
  { id: 11001, type_id: 20000000, num: 1, price: 8, currency: SCORE_ID, total_times: 20 }, // 秩序之契
  { id: 11002, type_id: 20000001, num: 1, price: 8, currency: SCORE_ID, total_times: 20 }, // 中立之契
  { id: 11003, type_id: 20000002, num: 1, price: 8, currency: SCORE_ID, total_times: 20 }, // 混乱之契
  { id: 11004, type_id: 20010001, num: 3, price: 8, currency: SCORE_ID, total_times: 20 }, // 明亮的水结晶×3
  { id: 11005, type_id: 20011001, num: 3, price: 8, currency: SCORE_ID, total_times: 20 }, // 明亮的火结晶×3
  { id: 11006, type_id: 20012001, num: 3, price: 8, currency: SCORE_ID, total_times: 20 }, // 明亮的风结晶×3
  { id: 11007, type_id: 20013001, num: 3, price: 8, currency: SCORE_ID, total_times: 20 }, // 明亮的土结晶×3
  { id: 11008, type_id: 20014001, num: 3, price: 8, currency: SCORE_ID, total_times: 20 }, // 明亮的光结晶×3
  { id: 11009, type_id: 20015001, num: 3, price: 8, currency: SCORE_ID, total_times: 20 }, // 明亮的暗结晶×3
  { id: 11010, type_id: 20016001, num: 3, price: 8, currency: SCORE_ID, total_times: 20 }, // 明亮的自然结晶×3
  { id: 11011, type_id: 20010002, num: 1, price: 25, currency: SCORE_ID, total_times: 10 }, // 闪耀的水结晶
  { id: 11012, type_id: 20011002, num: 1, price: 25, currency: SCORE_ID, total_times: 10 }, // 闪耀的火结晶
  { id: 11013, type_id: 20012002, num: 1, price: 25, currency: SCORE_ID, total_times: 10 }, // 闪耀的风结晶
  { id: 11014, type_id: 20013002, num: 1, price: 25, currency: SCORE_ID, total_times: 10 }, // 闪耀的土结晶
  { id: 11015, type_id: 20014002, num: 1, price: 25, currency: SCORE_ID, total_times: 10 }, // 闪耀的光结晶
  { id: 11016, type_id: 20015002, num: 1, price: 25, currency: SCORE_ID, total_times: 10 }, // 闪耀的暗结晶
  { id: 11017, type_id: 20016002, num: 1, price: 25, currency: SCORE_ID, total_times: 10 }, // 闪耀的自然结晶
  { id: 11018, type_id: 27000000, num: 5, price: 10, currency: SCORE_ID, total_times: 20 }, // 核心晶组Lv1×5
  { id: 11019, type_id: 27000001, num: 2, price: 28, currency: SCORE_ID, total_times: 10 }, // 核心晶组Lv2×2
  { id: 11020, type_id: 27000002, num: 1, price: 70, currency: SCORE_ID, total_times: 5 }, // 核心晶组Lv3
  { id: 11021, type_id: 21500010, num: 1, price: 15, currency: SCORE_ID, total_times: 20 }, // 体力特惠宝箱
  { id: 11022, type_id: 21500011, num: 1, price: 45, currency: SCORE_ID, total_times: 10 }, // 体力超值宝箱
  { id: 11023, type_id: 21500012, num: 1, price: 90, currency: SCORE_ID, total_times: 5 }, // 体力豪华宝箱
];

// 商店12 祈神仪式（同货币，稀有档）
const SHOP12_GOODS = [
  { id: 12001, type_id: 21104000, num: 1, price: 40, currency: SCORE_ID, total_times: 10 }, // 原初核心遗物箱
  { id: 12002, type_id: 21500012, num: 1, price: 90, currency: SCORE_ID, total_times: 5 }, // 体力豪华宝箱
  { id: 12003, type_id: 20016002, num: 3, price: 70, currency: SCORE_ID, total_times: 5 }, // 闪耀的自然结晶×3
  { id: 12004, type_id: 60000160, num: 1, price: 100, currency: SCORE_ID, total_times: 5 }, // 雪见大福
  { id: 12005, type_id: 31000064, num: 1, price: 120, currency: SCORE_ID, total_times: 5 }, // 结社改名卡
];

// 商店50 军需商店（小千日记，1360；货币=饼干 score 2134）
// 1360 的客户端配置是 ExchangeScore2VO，必须走 m_score_shop_*，不能混入普通商店商品表。
const BISCUIT_ID = 2134;
const SHOP50_GOODS = [
  { id: 50001, type_id: 30000000, num: 50, price: 10, currency: BISCUIT_ID, total_times: 20 }, // 水晶
  { id: 50002, type_id: 30000003, num: 1000, price: 10, currency: BISCUIT_ID, total_times: 20 }, // 金币
  { id: 50003, type_id: 20000000, num: 2, price: 15, currency: BISCUIT_ID, total_times: 10 }, // 秩序之契
  { id: 50004, type_id: 31000021, num: 15, price: 12, currency: BISCUIT_ID, total_times: 15 }, // 信仰灵光
  { id: 50005, type_id: 20016002, num: 10, price: 20, currency: BISCUIT_ID, total_times: 10 }, // 闪耀的自然结晶
  { id: 50006, type_id: 27000000, num: 5, price: 10, currency: BISCUIT_ID, total_times: 20 }, // 核心晶组Lv1
  { id: 50007, type_id: 27000001, num: 2, price: 28, currency: BISCUIT_ID, total_times: 10 }, // 核心晶组Lv2
  { id: 50008, type_id: 21500010, num: 1, price: 15, currency: BISCUIT_ID, total_times: 20 }, // 体力特惠宝箱
  { id: 50009, type_id: 21001000, num: 1, price: 40, currency: BISCUIT_ID, total_times: 5 }, // 旧式圣器遗物箱
  { id: 50010, type_id: 21002000, num: 1, price: 60, currency: BISCUIT_ID, total_times: 3 }, // 制式圣器遗物箱
  { id: 50011, type_id: 28000001, num: 1, price: 45, currency: BISCUIT_ID, total_times: 3 }, // 熊猫礼物盒
];

// 商店55 爱神的季节小铺（1421，货币=情人节巧克力 score 2152；CfgShop.exchangeScoreMap[55]）
const CHOCO_ID = 2152;
const SHOP55_GOODS = [
  { id: 55001, type_id: 30000000, num: 30, price: 10, currency: CHOCO_ID, total_times: 20 },  // 水晶
  { id: 55002, type_id: 30000003, num: 800, price: 8, currency: CHOCO_ID, total_times: 20 },  // 金币
  { id: 55003, type_id: 20000000, num: 1, price: 12, currency: CHOCO_ID, total_times: 10 },   // 秩序之契
  { id: 55004, type_id: 31000021, num: 10, price: 10, currency: CHOCO_ID, total_times: 15 },  // 信仰灵光
  { id: 55005, type_id: 20016002, num: 5, price: 15, currency: CHOCO_ID, total_times: 10 },   // 闪耀的自然结晶
  { id: 55006, type_id: 21001000, num: 1, price: 35, currency: CHOCO_ID, total_times: 3 },    // 旧式圣器遗物箱
];
// 商店59 羲和的节日小屋（1490，货币=便当 score 2172；CfgShop.exchangeScoreMap[59]）
const LUNCH_ID = 2172;
const SHOP59_GOODS = [
  { id: 59001, type_id: 30000000, num: 30, price: 10, currency: LUNCH_ID, total_times: 20 },  // 水晶
  { id: 59002, type_id: 30000003, num: 800, price: 8, currency: LUNCH_ID, total_times: 20 },  // 金币
  { id: 59003, type_id: 20000001, num: 1, price: 12, currency: LUNCH_ID, total_times: 10 },   // 中立之契
  { id: 59004, type_id: 31000021, num: 10, price: 10, currency: LUNCH_ID, total_times: 15 },  // 信仰灵光
  { id: 59005, type_id: 21002000, num: 1, price: 45, currency: LUNCH_ID, total_times: 3 },    // 制式圣器遗物箱
];

// 商店1 限时特惠：每日 04:00 从池中轮换 4 件（可花 100 水晶手动刷新）。
// base=原价（origin_price），off=折扣百分点（tag 角标）。
const SPECIAL_POOL = [
  { type_id: 20010000, num: 5, base: 25, off: 20 }, // 暗淡的水结晶
  { type_id: 20011000, num: 5, base: 25, off: 20 }, // 暗淡的火结晶
  { type_id: 20012000, num: 5, base: 25, off: 20 }, // 暗淡的风结晶
  { type_id: 20013000, num: 5, base: 25, off: 20 }, // 暗淡的土结晶
  { type_id: 20010001, num: 3, base: 54, off: 25 }, // 明亮的水结晶
  { type_id: 20011001, num: 3, base: 54, off: 25 }, // 明亮的火结晶
  { type_id: 20012001, num: 3, base: 54, off: 25 }, // 明亮的风结晶
  { type_id: 20010002, num: 1, base: 55, off: 15 }, // 闪耀的水结晶
  { type_id: 20013002, num: 1, base: 55, off: 15 }, // 闪耀的土结晶
  { type_id: 27000000, num: 10, base: 120, off: 20 }, // 核心晶组Lv1
  { type_id: 21500010, num: 1, base: 50, off: 30 }, // 体力特惠宝箱
  { type_id: 21007005, num: 1, base: 160, off: 15 }, // 奥林匹斯遗物箱
  { type_id: 31000064, num: 1, base: 680, off: 10 }, // 结社改名卡
];
const SPECIAL_SIZE = 4;
const SPECIAL_BASE_ID = 1001;         // 轮换商品 goodsId 起点（1001~1099 段，与常驻段区分）
const REFRESH_COST = 100;             // CfgShop.refreshShopCost

// CfgShop.silvers（真实配置）：50 水晶 → 按御灵士等级档金币（本地服等级未实现，取第 1 档）
// 誓约破除奖励（CfgSummon.decompose 官方表；下标=颜色-1；sliver=金币 score=破碎之契）
const DECOMPOSE = [{"sliver":2,"score":0},{"sliver":4,"score":2},{"sliver":10,"score":5},{"sliver":20,"score":10}];
const SILVER_COST = 50;
const SILVERS = [
  [1, 10, 1000], [11, 20, 2000], [21, 30, 3000], [31, 40, 4000], [41, 50, 5000],
  [51, 60, 6000], [61, 70, 7000], [71, 80, 8000], [81, 90, 9000], [91, 100, 10000], [101, 999, 15000],
];

// 商店71 薄明的圣夜兑换（ActivityChristmas19View，货币=圣诞袜 score 2237；CfgShop.exchangeScoreMap[71]）
const SOCK_ID = 2237;
const SHOP71_GOODS = [
  { id: 71001, type_id: 30000000, num: 50, price: 10, currency: SOCK_ID, total_times: 20 },  // 水晶
  { id: 71002, type_id: 30000003, num: 1000, price: 10, currency: SOCK_ID, total_times: 20 }, // 金币
  { id: 71003, type_id: 20000000, num: 2, price: 15, currency: SOCK_ID, total_times: 10 },   // 秩序之契
  { id: 71004, type_id: 31000021, num: 15, price: 12, currency: SOCK_ID, total_times: 15 },  // 信仰灵光
  { id: 71005, type_id: 21001000, num: 1, price: 40, currency: SOCK_ID, total_times: 5 },    // 旧式圣器遗物箱
  { id: 71006, type_id: 21002000, num: 1, price: 60, currency: SOCK_ID, total_times: 3 },    // 制式圣器遗物箱
  { id: 71007, type_id: 20016002, num: 10, price: 20, currency: SOCK_ID, total_times: 10 },  // 闪耀的自然结晶
  { id: 71008, type_id: 28000001, num: 1, price: 45, currency: SOCK_ID, total_times: 3 },    // 熊猫礼物盒
];

module.exports = {
  CRYSTAL, GOLD, OPEN_SHOPS,
  SHOP5_GOODS, SHOP3_GOODS, SKIN_GOODS,
  SCORE_ID, SHOP11_GOODS, SHOP12_GOODS, BISCUIT_ID, SHOP50_GOODS, DECOMPOSE, SOCK_ID, SHOP71_GOODS, CHOCO_ID, SHOP55_GOODS, LUNCH_ID, SHOP59_GOODS,
  SPECIAL_POOL, SPECIAL_SIZE, SPECIAL_BASE_ID, REFRESH_COST,
  SILVER_COST, SILVERS,
};
