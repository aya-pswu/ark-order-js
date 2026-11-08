// 自动生成，勿手改 —— 生成器 tools/bc_cmp/gen_echo_data.js（含断言）。
//
// 凭神回响（SummonEchoExchangePanel）：回响之契（CfgScoreItem 31000028 → role_scores id 28）
// 兑换指定誓灵。名单 = 凭神/限定召唤池内全部 UR（132 只），排除黄金史莱喵（tip 明示不可获回响）。
// 价锚 500：CfgActivity.constellation.tips「永久加入回响之契兑换(消耗500回响之契)」；
// 分解 UR 返 100 回响之契（CfgSummon.decompose[3].echo）→ 5 只换 1 只。
// ⚠️ 每个 type_id 必须同时满足：真机 CfgItems 有该誓灵道具 + CfgServant 有该 type，
//    否则客户端 ItemConfig.getItemVO(type_id) 返回 nil → SummonEchoExchangeItem.onGUI 崩。
const SERVANTS = [
  { type: 1042001, type_id: 31042001 }, // 洛基
  { type: 1043006, type_id: 31043006 }, // 托尔
  { type: 1043008, type_id: 31043008 }, // 维德佛尔尼尔
  { type: 1043020, type_id: 31043020 }, // 维达
  { type: 1044017, type_id: 31044017 }, // 耶梦加得
  { type: 1044022, type_id: 31044022 }, // 海姆达尔
  { type: 1044026, type_id: 31044026 }, // 希芙
  { type: 1044029, type_id: 31044029 },
  { type: 1045023, type_id: 31045023 }, // 弗雷
  { type: 1045028, type_id: 31045028 },
  { type: 1046002, type_id: 31046002 }, // 芬里尔
  { type: 1046015, type_id: 31046015 }, // 海拉
  { type: 1046021, type_id: 31046021 }, // 尼德霍格
  { type: 1141028, type_id: 31141028 }, // 加百列
  { type: 1141034, type_id: 31141034 }, // 白雪公主
  { type: 1141043, type_id: 31141043 },
  { type: 1142020, type_id: 31142020 }, // 米迦勒
  { type: 1142029, type_id: 31142029 }, // 卖火柴的少女
  { type: 1142035, type_id: 31142035 }, // 爱丽丝
  { type: 1143021, type_id: 31143021 }, // 拉斐尔
  { type: 1144042, type_id: 31144042 },
  { type: 1145030, type_id: 31145030 }, // 路西法
  { type: 1145033, type_id: 31145033 }, // 拉结尔
  { type: 1146023, type_id: 31146023 }, // 亚巴顿
  { type: 1146039, type_id: 31146039 },
  { type: 1241004, type_id: 31241004 }, // 薇薇安
  { type: 1241007, type_id: 31241007 }, // 玛纳诺
  { type: 1241018, type_id: 31241018 },
  { type: 1241021, type_id: 31241021 },
  { type: 1241022, type_id: 31241022 },
  { type: 1242006, type_id: 31242006 }, // 玛查
  { type: 1242013, type_id: 31242013 }, // 达格达
  { type: 1245005, type_id: 31245005 }, // 努阿达
  { type: 1245009, type_id: 31245009 }, // 鲁格
  { type: 1245017, type_id: 31245017 },
  { type: 1246003, type_id: 31246003 }, // 茉莉安
  { type: 1246008, type_id: 31246008 }, // 巴罗尔
  { type: 1341001, type_id: 31341001 }, // 伊邪那美
  { type: 1341020, type_id: 31341020 }, // 须佐
  { type: 1341033, type_id: 31341033 },
  { type: 1342029, type_id: 31342029 }, // 须世理姬
  { type: 1344026, type_id: 31344026 }, // 伊邪那岐
  { type: 1344028, type_id: 31344028 }, // 大国主
  { type: 1345012, type_id: 31345012 }, // 天照
  { type: 1346016, type_id: 31346016 }, // 月读
  { type: 1441016, type_id: 31441016 }, // 波塞冬
  { type: 1441026, type_id: 31441026 }, // 雅典娜
  { type: 1442021, type_id: 31442021 }, // 赫斯提亚
  { type: 1442025, type_id: 31442025 }, // 赫菲斯托斯
  { type: 1443001, type_id: 31443001 }, // 赫尔墨斯
  { type: 1444018, type_id: 31444018 }, // 阿瑞斯
  { type: 1444023, type_id: 31444023 }, // 德墨忒尔
  { type: 1445027, type_id: 31445027 }, // 阿尔忒弥斯
  { type: 1445040, type_id: 31445040 }, // 阿佛洛狄忒
  { type: 1445041, type_id: 31445041 },
  { type: 1446036, type_id: 31446036 }, // 赫拉
  { type: 1446037, type_id: 31446037 }, // 倪克斯
  { type: 1446044, type_id: 31446044 },
  { type: 1541019, type_id: 31541019 }, // 鲲
  { type: 1541033, type_id: 31541033 },
  { type: 1542013, type_id: 31542013 }, // 凤凰
  { type: 1542032, type_id: 31542032 },
  { type: 1543018, type_id: 31543018 }, // 华胥
  { type: 1543020, type_id: 31543020 }, // 年-新春异兽
  { type: 1543031, type_id: 31543031 },
  { type: 1544001, type_id: 31544001 }, // 女娲
  { type: 1544015, type_id: 31544015 }, // 应龙
  { type: 1544026, type_id: 31544026 }, // 后土
  { type: 1544027, type_id: 31544027 },
  { type: 1544034, type_id: 31544034 },
  { type: 1545002, type_id: 31545002 }, // 羲和
  { type: 1546035, type_id: 31546035 },
  { type: 1641020, type_id: 31641020 },
  { type: 1643004, type_id: 31643004 }, // 荷鲁斯
  { type: 1643017, type_id: 31643017 }, // 赛特
  { type: 1643019, type_id: 31643019 },
  { type: 1644010, type_id: 31644010 }, // 盖布
  { type: 1645001, type_id: 31645001 }, // 拉
  { type: 1646002, type_id: 31646002 }, // 奥西里斯
  { type: 1941001, type_id: 31941001 }, // 洛天依
  { type: 1942005, type_id: 31942005 }, // 乐正绫-蝶律
  { type: 1943004, type_id: 31943004 }, // 洛天依-杏辞
  { type: 1944002, type_id: 31944002 }, // 乐正绫
  { type: 1945006, type_id: 31945006 }, // 言和-兰序
  { type: 1946003, type_id: 31946003 }, // 言和
  { type: 2245001, type_id: 32245001 }, // 星野梦美
  { type: 2341005, type_id: 32341005 }, // 四糸乃
  { type: 2342002, type_id: 32342002 }, // 五河琴里
  { type: 2344004, type_id: 32344004 }, // 夜刀神十香
  { type: 2345003, type_id: 32345003 }, // 鸢一折纸
  { type: 2346001, type_id: 32346001 }, // 时崎狂三
  { type: 2443002, type_id: 32443002 }, // 吉普莉尔
  { type: 2444003, type_id: 32444003 }, // 初濑伊纲
  { type: 2445001, type_id: 32445001 }, // 白
  { type: 2541002, type_id: 32541002 }, // 高朱蒙
  { type: 2541003, type_id: 32541003 },
  { type: 2545001, type_id: 32545001 }, // 解慕漱
  { type: 2545004, type_id: 32545004 },
  { type: 2641002, type_id: 32641002 }, // 克苏鲁
  { type: 2641013, type_id: 32641013 },
  { type: 2642009, type_id: 32642009 }, // 加塔诺托亚
  { type: 2643008, type_id: 32643008 }, // 哈斯塔
  { type: 2648003, type_id: 32648003 }, // 奈亚拉托提普
  { type: 2648004, type_id: 32648004 }, // 犹格索托斯
  { type: 2648007, type_id: 32648007 }, // 奈奥格索希普
  { type: 2741003, type_id: 32741003 }, // 湊阿库娅
  { type: 2742002, type_id: 32742002 }, // 夏色祭
  { type: 2744001, type_id: 32744001 }, // 白上吹雪
  { type: 2845001, type_id: 32845001 }, // 虎儿
  { type: 3041001, type_id: 33041001 }, // 伐楼那
  { type: 3043005, type_id: 33043005 }, // 因陀罗
  { type: 3045006, type_id: 33045006 }, // 大吉祥天
  { type: 3046011, type_id: 33046011 }, // 阎摩
  { type: 3046014, type_id: 33046014 },
  { type: 3142003, type_id: 33142003 }, // 藤林杏
  { type: 3143004, type_id: 33143004 }, // 伊吹风子
  { type: 3144002, type_id: 33144002 }, // 坂上智代
  { type: 3145001, type_id: 33145001 }, // 古河渚
  { type: 3146005, type_id: 33146005 }, // 一之濑琴美
  { type: 3242002, type_id: 33242002 }, // 尤莉
  { type: 3245001, type_id: 33245001 }, // 千户
  { type: 3341001, type_id: 33341001 },
  { type: 3345002, type_id: 33345002 },
  { type: 3441001, type_id: 33441001 },
  { type: 3442002, type_id: 33442002 },
  { type: 3443004, type_id: 33443004 },
  { type: 3445005, type_id: 33445005 },
  { type: 3446003, type_id: 33446003 },
  { type: 3541002, type_id: 33541002 },
  { type: 3542001, type_id: 33542001 },
  { type: 3545004, type_id: 33545004 },
  { type: 3546003, type_id: 33546003 },
];

// 回响之契：CfgScoreItem[31000028] = 28；SummonConst.SUMMON_TYPE_ECHO_ITEM = 28
const SCORE_ID = 28;
const ITEM_ID = 31000028;
const PRICE = 500;          // 单只价格（回响之契）
const TOTAL_TIMES = 99;      // 单只限购（客户端不展示；仅防服务端数据异常）

// 可获回响的誓灵 type 集合（分解判定 + m_echo_servant_info_toc.ids）
// 客户端拿它和 feelingVO.servantType 比对，命中才把 decompose[color].echo 计入"预计获得"
const ECHO_TYPES = SERVANTS.map(s => s.type);
const BY_TYPE_ID = {};
const BY_TYPE = {};
for (const s of SERVANTS) { BY_TYPE_ID[s.type_id] = s; BY_TYPE[s.type] = s; }
function isEchoType(t) { return Object.prototype.hasOwnProperty.call(BY_TYPE, Number(t)); }
function goodsOf(typeId) { return BY_TYPE_ID[Number(typeId)] || null; }

module.exports = { SERVANTS, SCORE_ID, ITEM_ID, PRICE, TOTAL_TIMES, ECHO_TYPES, isEchoType, goodsOf };
