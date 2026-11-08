// 道具合成配方（客户端 CfgItemsExtra.merge 全量 42 条 → 服务端 m_item_compound_tos）
//
// 生成器：tools/bc_cmp/gen_item_merge_data.py（改配置后重跑，别手改本文件）
// 数据源：tools/lua_remote/bc/Config/CfgItemsExtra.lua（真机字节码）
//         + tools/bc_cmp/vit_new/CfgItems.lua（物品名/是否可堆叠）
//
// 客户端语义（BagMergePanel.lua 实证）：
//   nsNum.Max = floor(持有数 / costNum)，请求 m_item_compound_tos{type_id=材料, num=合成次数}
//   → 每次合成消耗 costNum 个材料、产出 1 个 target；m_item_compound_toc.material = 材料 typeId
//     （客户端只拿 material 判 ItemConst.isCallServant：6500000x 碎片合成誓灵时不弹「合成成功」，
//      改由誓灵获取动画展示）。
//
// ⚠ tools/lua_src/CfgItemsExtra.lua 是旧快照，只有 27 条（缺 31000070~31000084 等 15 条），
//   不要拿它当基底重建本表（H1：枚举表必须标数据来源版本）。

const MERGE_RECIPES = {
  21001000: { target: 21002000, cost: 5, name: "旧式圣器遗物箱", targetName: "制式圣器遗物箱", targetPile: true },
  21002000: { target: 21003000, cost: 5, name: "制式圣器遗物箱", targetName: "新制圣器遗物箱", targetPile: true },
  31000015: { target: 21007999, cost: 60, name: "薛定谔的圣器块", targetName: "薛定谔原初圣器", targetPile: true },
  31000029: { target: 17000004, cost: 30, name: "天钿碎片", targetName: "天钿", targetPile: false },
  31000035: { target: 17005004, cost: 40, name: "刻刻帝碎片", targetName: "刻刻帝", targetPile: false },
  31000036: { target: 17007004, cost: 40, name: "灼烂歼鬼碎片", targetName: "灼烂歼鬼", targetPile: false },
  31000037: { target: 17006004, cost: 40, name: "冰结傀儡碎片", targetName: "冰结傀儡", targetPile: false },
  31000038: { target: 17004004, cost: 40, name: "绝灭天使碎片", targetName: "绝灭天使", targetPile: false },
  31000039: { target: 17003004, cost: 40, name: "鏖杀公碎片", targetName: "鏖杀公", targetPile: false },
  31000040: { target: 17008003, cost: 30, name: "小电视碎片", targetName: "小电视", targetPile: false },
  31000041: { target: 17009004, cost: 30, name: "宝石碎片", targetName: "多拉家族宝石", targetPile: false },
  31000042: { target: 17010004, cost: 30, name: "大蝴蝶结碎片", targetName: "大蝴蝶结", targetPile: false },
  31000043: { target: 17011004, cost: 30, name: "记忆的碎片", targetName: "记忆的笔记本", targetPile: false },
  31000044: { target: 17012004, cost: 30, name: "平板电脑碎片", targetName: "平板电脑", targetPile: false },
  31000056: { target: 17016004, cost: 30, name: "虎儿圣器碎片", targetName: "虎儿圣器", targetPile: false },
  31000057: { target: 17017004, cost: 30, name: "鹊儿圣器碎片", targetName: "鹊儿圣器", targetPile: false },
  31000059: { target: 17021004, cost: 30, name: "团子碎片", targetName: "团子", targetPile: false },
  31000060: { target: 17022004, cost: 30, name: "字典碎片", targetName: "字典", targetPile: false },
  31000061: { target: 17023004, cost: 30, name: "小熊外套碎片", targetName: "小熊外套", targetPile: false },
  31000062: { target: 17024004, cost: 30, name: "小提琴碎片", targetName: "小提琴", targetPile: false },
  31000063: { target: 17025004, cost: 30, name: "木刻海星碎片", targetName: "木刻海星", targetPile: false },
  31000065: { target: 17026004, cost: 30, name: "步兵铳碎片", targetName: "尤莉的步兵铳", targetPile: false },
  31000066: { target: 17027004, cost: 30, name: "日记本碎片", targetName: "千户的日记本", targetPile: false },
  31000070: { target: 17028004, cost: 40, name: "法国军帽碎片", targetName: "法国军帽", targetPile: false },
  31000071: { target: 17029004, cost: 40, name: " Mea羊碎片", targetName: " Mea羊", targetPile: false },
  31000072: { target: 17030004, cost: 40, name: "提比碎片", targetName: "提比", targetPile: false },
  31000073: { target: 17031004, cost: 40, name: "面包碎片", targetName: "送给妹妹的面包", targetPile: false },
  31000074: { target: 17032004, cost: 40, name: "狂野小子碎片", targetName: "狂野小子", targetPile: false },
  31000075: { target: 17033004, cost: 40, name: "豆馅碎片", targetName: "豆馅", targetPile: false },
  31000076: { target: 17034004, cost: 40, name: "咖啡碎片", targetName: "理世特调咖啡", targetPile: false },
  31000077: { target: 72000048, cost: 50, name: "弗丽嘉元素晶石碎片", targetName: "元素晶石[弗丽嘉]", targetPile: false },
  31000078: { target: 17035004, cost: 40, name: "白米饭原料", targetName: "白米饭", targetPile: false },
  31000079: { target: 17036004, cost: 40, name: "冰糖燕窝原料", targetName: "冰糖燕窝", targetPile: false },
  31000080: { target: 17037004, cost: 40, name: "玉子烧原料", targetName: "玉子烧", targetPile: false },
  31000081: { target: 17038004, cost: 40, name: "北京烤鸭原料", targetName: "北京烤鸭", targetPile: false },
  31000082: { target: 17039004, cost: 40, name: "鲷鱼烧原料", targetName: "鲷鱼烧", targetPile: false },
  31000083: { target: 72000061, cost: 3, name: "解慕漱元素晶石碎片", targetName: "元素晶石[解慕漱]", targetPile: false },
  31000084: { target: 72000062, cost: 3, name: "高朱蒙元素晶石碎片", targetName: "元素晶石[高朱蒙]", targetPile: false },
  65000001: { target: 32633005, cost: 60, name: "伊塔库亚碎片", targetName: "伊塔库亚", targetPile: true },
  65000002: { target: 32632006, cost: 60, name: "克图格亚碎片", targetName: "克图格亚", targetPile: true },
  65000003: { target: 32648004, cost: 100, name: "犹格索托斯碎片", targetName: "犹格索托斯", targetPile: true },
  65000004: { target: 32636010, cost: 60, name: "诺登斯碎片", targetName: "诺登斯", targetPile: true },
};

const recipeOf = typeId => MERGE_RECIPES[Number(typeId)] || null;
const isMergeItem = typeId => !!MERGE_RECIPES[Number(typeId)];
const allSources = () => Object.keys(MERGE_RECIPES).map(Number);

module.exports = { MERGE_RECIPES, recipeOf, isMergeItem, allSources };
