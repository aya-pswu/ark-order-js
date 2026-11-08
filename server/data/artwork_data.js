//
// ⚠️ 本文件由 tools/bc_cmp/gen_artwork_data.py 自动生成——手改无效。
// 数据源：tools/bc_cmp/CfgRole_ljd.lua artwork 段（真机 bc 权威源，H5 口径）
//        + CfgItems_ljd.lua（贴纸道具=使用产出全部落在 261 段的道具）。
// 重新生成：python tools/bc_cmp/gen_artwork_data.py
//
// 贴纸涂鸦板（个人主页 RoleArtworkView，二百八十）：获得贴纸 → 涂鸦素材库存
// （m_graffiti_material_toc，p_kvt{id, val=total, type=remain}）→ 编辑模式拖放
// → m_place_artwork_material_tos 保存。素材本身 form=2+link=0（CfgItems 只有展示壳），
// 严禁入包——入包=点不开的死道具（二百七十八同族）。
// lua_src/CfgRole.lua 快照只有 96 条（缺 26100097~118），禁止改读 lua_src。

const MATS = [
  { id: 26100001, name: "进击的兔兔", path: "UI/Role/Textures/Artworks/Mat1", typeID: 1 },
  { id: 26100002, name: "太空熊猫", path: "UI/Role/Textures/Artworks/Mat2", typeID: 2 },
  { id: 26100003, name: "水晶去哪了", path: "UI/Role/Textures/Artworks/Mat3", typeID: 3 },
  { id: 26100004, name: "破碎的奇迹", path: "UI/Role/Textures/Artworks/Mat4", typeID: 4 },
  { id: 26100005, name: "BOOM", path: "UI/Role/Textures/Artworks/Mat5", typeID: 5 },
  { id: 26100006, name: "贝希摩斯Alter", path: "UI/Role/Textures/Artworks/Mat6", typeID: 6 },
  { id: 26100007, name: "肉包", path: "UI/Role/Textures/Artworks/Mat7", typeID: 7 },
  { id: 26100008, name: "幺鸡", path: "UI/Role/Textures/Artworks/Mat8", typeID: 8 },
  { id: 26100009, name: "立直棒", path: "UI/Role/Textures/Artworks/Mat9", typeID: 9 },
  { id: 26100010, name: "可爱的便便", path: "UI/Role/Textures/Artworks/Mat10", typeID: 10 },
  { id: 26100011, name: "喵！", path: "UI/Role/Textures/Artworks/Mat11", typeID: 11 },
  { id: 26100012, name: "汪？", path: "UI/Role/Textures/Artworks/Mat12", typeID: 12 },
  { id: 26100013, name: "Ark Order", path: "UI/Role/Textures/Artworks/Mat13", typeID: 13 },
  { id: 26100014, name: "犹豫", path: "UI/Role/Textures_Lang/Artworks/Mat14", typeID: 14 },
  { id: 26100015, name: "给力", path: "UI/Role/Textures_Lang/Artworks/Mat15", typeID: 15 },
  { id: 26100016, name: "岭上开花", path: "UI/Role/Textures_Lang/Artworks/Mat16", typeID: 16 },
  { id: 26100017, name: "拉斯", path: "UI/Role/Textures_Lang/Artworks/Mat17", typeID: 17 },
  { id: 26100018, name: "立直！", path: "UI/Role/Textures_Lang/Artworks/Mat18", typeID: 18 },
  { id: 26100019, name: "YHJOK", path: "UI/Role/Textures_Lang/Artworks/Mat19", typeID: 19 },
  { id: 26100020, name: "哎唷", path: "UI/Role/Textures_Lang/Artworks/Mat20", typeID: 20 },
  { id: 26100021, name: "你脸红啦", path: "UI/Role/Textures_Lang/Artworks/Mat21", typeID: 21 },
  { id: 26100022, name: "喵身喵面像", path: "UI/Role/Textures/Artworks/Mat22", typeID: 22 },
  { id: 26100023, name: "潜入", path: "UI/Role/Textures/Artworks/Mat23", typeID: 23 },
  { id: 26100024, name: "金字塔", path: "UI/Role/Textures/Artworks/Mat24", typeID: 24 },
  { id: 26100025, name: "时崎狂三", path: "UI/Role/Textures/Artworks/Mat25", typeID: 25 },
  { id: 26100026, name: "五河琴里", path: "UI/Role/Textures/Artworks/Mat26", typeID: 26 },
  { id: 26100027, name: "四糸乃", path: "UI/Role/Textures/Artworks/Mat27", typeID: 27 },
  { id: 26100028, name: "干杯", path: "UI/Role/Textures/Artworks/Mat28", typeID: 28 },
  { id: 26100029, name: "电波系", path: "UI/Role/Textures/Artworks/Mat29", typeID: 29 },
  { id: 26100030, name: "求收留", path: "UI/Role/Textures/Artworks/Mat30", typeID: 30 },
  { id: 26100031, name: "天使", path: "UI/Role/Textures/Artworks/Mat31", typeID: 31 },
  { id: 26100032, name: "恶魔", path: "UI/Role/Textures/Artworks/Mat32", typeID: 32 },
  { id: 26100033, name: "五星法阵", path: "UI/Role/Textures/Artworks/Mat33", typeID: 33 },
  { id: 26100034, name: "光圈", path: "UI/Role/Textures/Artworks/Mat34", typeID: 34 },
  { id: 26100035, name: "角", path: "UI/Role/Textures/Artworks/Mat35", typeID: 35 },
  { id: 26100036, name: "夜刀神十香", path: "UI/Role/Textures/Artworks/Mat36", typeID: 36 },
  { id: 26100037, name: "鸢一折纸", path: "UI/Role/Textures/Artworks/Mat37", typeID: 37 },
  { id: 26100038, name: "鹊桥", path: "UI/Role/Textures/Artworks/Mat38", typeID: 38 },
  { id: 26100039, name: "喜鹊", path: "UI/Role/Textures/Artworks/Mat39", typeID: 39 },
  { id: 26100040, name: "白", path: "UI/Role/Textures/Artworks/Mat40", typeID: 40 },
  { id: 26100041, name: "吉普莉尔", path: "UI/Role/Textures/Artworks/Mat41", typeID: 41 },
  { id: 26100042, name: "史蒂芬妮", path: "UI/Role/Textures/Artworks/Mat42", typeID: 42 },
  { id: 26100043, name: "初濑伊纲", path: "UI/Role/Textures/Artworks/Mat43", typeID: 43 },
  { id: 26100044, name: "白上吹雪", path: "UI/Role/Textures/Artworks/Mat44", typeID: 44 },
  { id: 26100045, name: "夏色祭", path: "UI/Role/Textures/Artworks/Mat45", typeID: 45 },
  { id: 26100046, name: "湊阿库娅", path: "UI/Role/Textures/Artworks/Mat46", typeID: 46 },
  { id: 26100047, name: "白上吹雪-配件", path: "UI/Role/Textures/Artworks/Mat47", typeID: 47 },
  { id: 26100048, name: "夏色祭-配件", path: "UI/Role/Textures/Artworks/Mat48", typeID: 48 },
  { id: 26100049, name: "湊阿库娅-配件", path: "UI/Role/Textures/Artworks/Mat49", typeID: 49 },
  { id: 26100050, name: "虎儿", path: "UI/Role/Textures/Artworks/Mat50", typeID: 50 },
  { id: 26100051, name: "鹊儿", path: "UI/Role/Textures/Artworks/Mat51", typeID: 51 },
  { id: 26100052, name: "老虎联动贴纸1", path: "UI/Role/Textures/Artworks/Mat52", typeID: 52 },
  { id: 26100053, name: "老虎联动贴纸2", path: "UI/Role/Textures/Artworks/Mat53", typeID: 53 },
  { id: 26100054, name: "老虎联动贴纸3", path: "UI/Role/Textures/Artworks/Mat54", typeID: 54 },
  { id: 26100055, name: "老虎联动贴纸4", path: "UI/Role/Textures/Artworks/Mat55", typeID: 55 },
  { id: 26100056, name: "老虎联动贴纸5", path: "UI/Role/Textures/Artworks/Mat56", typeID: 56 },
  { id: 26100057, name: "老虎联动贴纸6", path: "UI/Role/Textures/Artworks/Mat57", typeID: 57 },
  { id: 26100058, name: "老虎联动贴纸7", path: "UI/Role/Textures/Artworks/Mat58", typeID: 58 },
  { id: 26100059, name: "老虎联动贴纸8", path: "UI/Role/Textures/Artworks/Mat59", typeID: 59 },
  { id: 26100060, name: "老虎联动贴纸9", path: "UI/Role/Textures/Artworks/Mat60", typeID: 60 },
  { id: 26100061, name: "老虎联动贴纸10", path: "UI/Role/Textures/Artworks/Mat61", typeID: 61 },
  { id: 26100062, name: "星野梦美", path: "UI/Role/Textures/Artworks/Mat62", typeID: 62 },
  { id: 26100063, name: "南瓜头贴纸", path: "UI/Role/Textures/Artworks/Mat63", typeID: 63 },
  { id: 26100064, name: "鬼魂贴纸", path: "UI/Role/Textures/Artworks/Mat64", typeID: 64 },
  { id: 26100065, name: "蝙蝠贴纸", path: "UI/Role/Textures/Artworks/Mat65", typeID: 65 },
  { id: 26100066, name: "墓碑贴纸", path: "UI/Role/Textures/Artworks/Mat66", typeID: 66 },
  { id: 26100067, name: "枯树贴纸", path: "UI/Role/Textures/Artworks/Mat67", typeID: 67 },
  { id: 26100068, name: "万圣节糖果贴纸", path: "UI/Role/Textures/Artworks/Mat68", typeID: 68 },
  { id: 26100069, name: "骷髅贴纸", path: "UI/Role/Textures/Artworks/Mat69", typeID: 69 },
  { id: 26100070, name: "僵尸贴纸", path: "UI/Role/Textures/Artworks/Mat70", typeID: 70 },
  { id: 26100071, name: "Trick or Treat", path: "UI/Role/Textures/Artworks/Mat71", typeID: 71 },
  { id: 26100072, name: "咖喱", path: "UI/Role/Textures/Artworks/Mat72", typeID: 72 },
  { id: 26100073, name: "宝莲", path: "UI/Role/Textures/Artworks/Mat73", typeID: 73 },
  { id: 26100074, name: "眼镜蛇", path: "UI/Role/Textures/Artworks/Mat74", typeID: 74 },
  { id: 26100075, name: "象头神", path: "UI/Role/Textures/Artworks/Mat75", typeID: 75 },
  { id: 26100076, name: "古河渚", path: "UI/Role/Textures/Artworks/Mat76", typeID: 76 },
  { id: 26100077, name: "坂上智代", path: "UI/Role/Textures/Artworks/Mat77", typeID: 77 },
  { id: 26100078, name: "藤林杏", path: "UI/Role/Textures/Artworks/Mat78", typeID: 78 },
  { id: 26100079, name: "一之濑琴美", path: "UI/Role/Textures/Artworks/Mat79", typeID: 79 },
  { id: 26100080, name: "伊吹风子", path: "UI/Role/Textures/Artworks/Mat80", typeID: 80 },
  { id: 26100081, name: "鲲", path: "UI/Role/Textures/Artworks/Mat81", typeID: 81 },
  { id: 26100082, name: "鲁格", path: "UI/Role/Textures/Artworks/Mat82", typeID: 82 },
  { id: 26100083, name: "海拉", path: "UI/Role/Textures/Artworks/Mat83", typeID: 83 },
  { id: 26100084, name: "凤凰", path: "UI/Role/Textures/Artworks/Mat84", typeID: 84 },
  { id: 26100085, name: "竖琴", path: "UI/Role/Textures/Artworks/Mat85", typeID: 85 },
  { id: 26100086, name: "三叉戟", path: "UI/Role/Textures/Artworks/Mat86", typeID: 86 },
  { id: 26100087, name: "千户", path: "UI/Role/Textures/Artworks/Mat87", typeID: 87 },
  { id: 26100088, name: "尤莉", path: "UI/Role/Textures/Artworks/Mat88", typeID: 88 },
  { id: 26100089, name: "望远镜", path: "UI/Role/Textures/Artworks/Mat89", typeID: 89 },
  { id: 26100090, name: "相机", path: "UI/Role/Textures/Artworks/Mat90", typeID: 90 },
  { id: 26100091, name: "小白", path: "UI/Role/Textures/Artworks/Mat91", typeID: 91 },
  { id: 26100092, name: "小刀", path: "UI/Role/Textures/Artworks/Mat92", typeID: 92 },
  { id: 26100093, name: "圣杯", path: "UI/Role/Textures/Artworks/Mat93", typeID: 93 },
  { id: 26100094, name: "路西法", path: "UI/Role/Textures/Artworks/Mat94", typeID: 94 },
  { id: 26100095, name: "大国主", path: "UI/Role/Textures/Artworks/Mat95", typeID: 95 },
  { id: 26100096, name: "大国主的翅膀", path: "UI/Role/Textures/Artworks/Mat96", typeID: 96 },
  { id: 26100097, name: "神楽Mea", path: "UI/Role/Textures/Artworks/Mat97", typeID: 97 },
  { id: 26100098, name: "草莓果酱", path: "UI/Role/Textures/Artworks/Mat98", typeID: 98 },
  { id: 26100099, name: "神楽Meu", path: "UI/Role/Textures/Artworks/Mat99", typeID: 99 },
  { id: 26100100, name: "尼特候补役", path: "UI/Role/Textures/Artworks/Mat100", typeID: 100 },
  { id: 26100101, name: "女仆玩偶", path: "UI/Role/Textures/Artworks/Mat101", typeID: 101 },
  { id: 26100102, name: "咩玩偶", path: "UI/Role/Textures/Artworks/Mat102", typeID: 102 },
  { id: 26100103, name: "法国军帽", path: "UI/Role/Textures/Artworks/Mat103", typeID: 103 },
  { id: 26100104, name: "保登心爱", path: "UI/Role/Textures/Artworks/Mat104", typeID: 104 },
  { id: 26100105, name: "香风智乃", path: "UI/Role/Textures/Artworks/Mat105", typeID: 105 },
  { id: 26100106, name: "天天座理世", path: "UI/Role/Textures/Artworks/Mat106", typeID: 106 },
  { id: 26100107, name: "宇治松千夜", path: "UI/Role/Textures/Artworks/Mat107", typeID: 107 },
  { id: 26100108, name: "桐间纱路", path: "UI/Role/Textures/Artworks/Mat108", typeID: 108 },
  { id: 26100109, name: "樱华密话", path: "UI/Role/Textures/Artworks/Mat109", typeID: 109 },
  { id: 26100110, name: "箱庭之巡", path: "UI/Role/Textures/Artworks/Mat110", typeID: 110 },
  { id: 26100111, name: "心狙一击", path: "UI/Role/Textures/Artworks/Mat111", typeID: 111 },
  { id: 26100112, name: "霏雨紫阳", path: "UI/Role/Textures/Artworks/Mat112", typeID: 112 },
  { id: 26100113, name: "逐愿森语", path: "UI/Role/Textures/Artworks/Mat113", typeID: 113 },
  { id: 26100114, name: "路西法贴纸2", path: "UI/Role/Textures/Artworks/Mat114", typeID: 114 },
  { id: 26100115, name: "白雪公主", path: "UI/Role/Textures/Artworks/Mat115", typeID: 115 },
  { id: 26100116, name: "后土", path: "UI/Role/Textures/Artworks/Mat116", typeID: 116 },
  { id: 26100117, name: "犹格索托斯", path: "UI/Role/Textures/Artworks/Mat117", typeID: 117 },
  { id: 26100118, name: "睡美人", path: "UI/Role/Textures/Artworks/Mat118", typeID: 118 },
];

// 贴纸道具（使用后转为涂鸦素材；data 产出与 vit_data.ITEM_USE 同源）：
const STICKER_ITEMS = [
  { typeId: 21500051, name: "联动贴纸礼包", outputs: [[26100025, 1], [26100026, 1], [26100027, 1]] },
  { typeId: 21500052, name: "时崎狂三贴纸", outputs: [[26100025, 1]] },
  { typeId: 21500053, name: "五河琴里贴纸", outputs: [[26100026, 1]] },
  { typeId: 21500054, name: "四糸乃贴纸", outputs: [[26100027, 1]] },
  { typeId: 21500063, name: "夜刀神十香贴纸", outputs: [[26100036, 1]] },
  { typeId: 21500064, name: "鸢一折纸贴纸", outputs: [[26100037, 1]] },
  { typeId: 21500074, name: "联动贴纸礼包", outputs: [[26100040, 1], [26100041, 1], [26100042, 1], [26100043, 1]] },
  { typeId: 21500075, name: "白贴纸", outputs: [[26100040, 1]] },
  { typeId: 21500076, name: "吉普莉尔贴纸", outputs: [[26100041, 1]] },
  { typeId: 21500077, name: "史蒂芬妮贴纸", outputs: [[26100042, 1]] },
  { typeId: 21500078, name: "初濑伊纲贴纸", outputs: [[26100043, 1]] },
  { typeId: 21500086, name: "白上吹雪贴纸", outputs: [[26100044, 1]] },
  { typeId: 21500087, name: "夏色祭贴纸", outputs: [[26100045, 1]] },
  { typeId: 21500088, name: "湊阿库娅贴纸", outputs: [[26100046, 1]] },
  { typeId: 21500089, name: "联动贴纸礼包", outputs: [[26100044, 1], [26100045, 1], [26100046, 1]] },
  { typeId: 21500099, name: "虎儿贴纸", outputs: [[26100050, 1]] },
  { typeId: 21500100, name: "鹊儿贴纸", outputs: [[26100051, 1]] },
  { typeId: 21500102, name: "联动贴纸礼包", outputs: [[26100052, 1], [26100053, 1], [26100054, 1], [26100055, 1], [26100056, 1], [26100057, 1], [26100058, 1], [26100059, 1], [26100060, 1], [26100061, 1]] },
  { typeId: 21500111, name: "万圣节贴纸礼包", outputs: [[26100063, 1], [26100066, 1], [26100067, 1], [26100068, 2], [26100064, 2], [26100065, 2], [26100069, 2], [26100070, 2], [26100071, 1]] },
  { typeId: 21500112, name: "万圣节礼包", outputs: [[26100063, 1], [26100064, 1], [26100065, 1]] },
  { typeId: 21500122, name: "星野梦美贴纸", outputs: [[26100062, 1]] },
  { typeId: 21500138, name: "联动贴纸礼包", outputs: [[26100076, 1], [26100077, 1], [26100078, 1], [26100079, 1], [26100080, 1]] },
  { typeId: 21500139, name: "古河渚贴纸", outputs: [[26100076, 1]] },
  { typeId: 21500140, name: "坂上智代贴纸", outputs: [[26100077, 1]] },
  { typeId: 21500141, name: "藤林杏贴纸", outputs: [[26100078, 1]] },
  { typeId: 21500142, name: "一之濑琴美贴纸", outputs: [[26100079, 1]] },
  { typeId: 21500143, name: "伊吹风子贴纸", outputs: [[26100080, 1]] },
  { typeId: 21500240, name: "Mea贴纸礼包", outputs: [[26100097, 1], [26100098, 1], [26100099, 1], [26100100, 1]] },
  { typeId: 21500252, name: "点兔贴纸礼包", outputs: [[26100104, 1], [26100105, 1], [26100106, 1], [26100107, 1], [26100108, 1]] },
  { typeId: 21500253, name: "点兔贴纸礼包Ⅱ", outputs: [[26100109, 1], [26100110, 1], [26100112, 1], [26100113, 1]] },
];

const MAX_PAGE_NUM = 3;   // CfgRole.artwork.maxPageNum：涂鸦板页数上限
const MAX_NUM = 30;        // CfgRole.artwork.maxNum：每页贴纸数上限（m_artwork_info_toc.size）
const ANGLES = [0, -90, -180, -270];       // 旋转档位（angleIndex 1 基）
const OPEN_PAGE_COST = [0, 50, 100]; // 开新页水晶成本，按"新页号"1 基取（第 2 页 50、第 3 页 100）

// ⚠️ 键语义（二百八十真机事故定型）：涂鸦板四协议里的 id / material_id 是 **typeID（1~118）**，
// 不是 itemType（261xxxxx）。客户端 RoleConfig.getArtwork 直查 materials 原始数组下标
// （initConfig = ConfigMgr.getConfig 直通、无键化），且客户端自己 onMatSelect 传 typeID、
// getChangeToServer 发 material_id=typeID；261xxxxx 只是 CfgItems 道具形态（发放入口），
// 进协议前必须 typeIdOf() 转换——发 itemType 客户端必报「涂鸦前端配置不存在」。
const MATERIAL_IDS = new Set(MATS.map(m => m.typeID));   // typeID 1~118（协议键）
const ITEM_FORM_IDS = new Set(MATS.map(m => m.id));      // itemType 261xxxxx（CfgItems 道具形态）
function isArtworkMat(typeId) { return ITEM_FORM_IDS.has(Number(typeId)); } // 261xxxxx（发放入口判定）
function isArtworkMatTypeId(tid) { return MATERIAL_IDS.has(Number(tid)); }  // typeID（协议面判定）
function typeIdOf(v) {
  const n = Number(v);
  if (ITEM_FORM_IDS.has(n)) return n - 26100000;  // 261xxxxx → typeID
  if (MATERIAL_IDS.has(n)) return n;              // 已是 typeID（幂等）
  return 0;
}
function matOf(typeId) { return MATS.find(m => m.typeID === Number(typeId)) || null; }

// ---- 出厂断言（生成器同款；require 时跑一遍，配置漂移即启动失败）----
(function assertFactory() {
  if (MATS.length !== 118) throw new Error(`[artwork] 素材 ${MATS.length} ≠ 118`);
  MATS.forEach((m, i) => { if (m.id !== 26100001 + i || m.typeID !== i + 1)
    throw new Error(`[artwork] 素材 typeID/itemType 与数组下标不齐 @${i}`); });
  if (typeIdOf(26100025) !== 25 || typeIdOf(25) !== 25 || typeIdOf(999) !== 0)
    throw new Error('[artwork] typeIdOf 映射破坏');
  if (MAX_PAGE_NUM !== 3 || MAX_NUM !== 30) throw new Error('[artwork] maxPageNum/maxNum 漂移');
  if (OPEN_PAGE_COST.length !== MAX_PAGE_NUM) throw new Error('[artwork] openPageCost 长度 ≠ maxPageNum');
  const byId = new Map(STICKER_ITEMS.map(it => [it.typeId, it]));
  for (const it of STICKER_ITEMS) {
    if (!it.outputs.length || !it.outputs.every(([t]) => isArtworkMat(t)))
      throw new Error(`[artwork] 贴纸道具 ${it.typeId} 产出含未知素材`);
  }
  for (const tid of [21500051, 21500052, 21500074, 21500102, 21500240]) {
    if (!byId.has(tid)) throw new Error(`[artwork] 锚点贴纸道具 ${tid} 缺失`);
  }
})();

module.exports = { MATS, STICKER_ITEMS, MATERIAL_IDS, ITEM_FORM_IDS, isArtworkMat, isArtworkMatTypeId, typeIdOf, matOf,
  MAX_PAGE_NUM, MAX_NUM, ANGLES, OPEN_PAGE_COST };

