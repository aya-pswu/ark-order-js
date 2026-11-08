// 头像/头像框静态注册表（二百九十七，2026-11-04）。
//
// 来源：真机 CfgRole_ljd（tools/bc_cmp/CfgRole_ljd.lua）roleConfigHeadArr 36 条 + head 5 条。
// 逐条与出货包资源核对过（tools/apk_work/assets + 韩服 1103megafiles 补齐包）：
//   - 头像框（roleConfigHeadArr，id 41000xxx/41100xxx/41200xxx）：CfgItems 里**同 id** 的道具
//     （form=2 + link=0 展示壳）就是解锁载体——道具 id == 框 id，与涂鸦板（协议 id=typeID、
//     261xxx 只是道具形态）不同，这条链上两个 id 天然相等，无需转换。
//   - CfgRole.path 指向 ui/role/textures/NNNN（NNNN 与 id 不是同一序列，见 PATH 注释）；
//     41100000/41200000 是 spine（path 为 "<名>.animation"/"P_ui_txk2.a"，EffectSpineUI 按
//     "Model/Effect/{名}/{名}_SkeletonData" 解析 → model/effect/<名>/<名>_skeletondata.ab）。
//   - 特殊头像（CfgRole.head，id 1~5，道具形态 29100001~29100005）：客户端全库零消费点、
//     服务端零发放面（无任何奖励表产出），本地服口径 = 默认全解锁（同主城场景主题
//     "全量默认解锁"先例，role.js m_background_theme_tos 注释）。
//
// ⚠️ 客户端 val 语义（RoleHeadVO.copy/isNew 与 RoleMgr.updateHeadsList faces 分支**相反**，别统一）：
//   - m_avatar_border_detail_toc.borders（p_kvi）：ownState 恒 1、isNew = (val == 1)
//     ⇒ val=1 新获得（亮"新"角标）、val=0 已查看；
//   - m_check_head_toc.faces（p_kvi）：unlock=(条目存在)、isNew = (val ~= 1)
//     ⇒ val=1 已查看、val=0 新。本服 faces 恒 []（见 handlers/avatar.js 头注释）。

// 头像框 id 全集（CfgRole.roleConfigHeadArr 键，与 CfgItems 41xxxxxx 道具一一对应）
const FRAME_IDS = [
  41000000, 41000001, 41000002, 41000003, 41000004, 41000005, 41000006, 41000007,
  41000008, 41000009, 41000010, 41000011, 41000012, 41000013, 41000014, 41000015,
  41000016, 41000017, 41000018, 41000019, 41000020, 41000021, 41000022, 41000023,
  41000024, 41000025, 41000026, 41000027, 41000028, 41000029, 41000030, 41000031,
  41000032, 41000033, 41100000, 41200000,
];

const FRAME_NAMES = {
  41000000: '默认', 41000001: '力之冕', 41000002: '往昔的繁荣', 41000003: '沙上楼阁',
  41000004: '挑剔鸡', 41000005: '凤凰的守护者', 41000006: '新春大吉', 41000007: '飞翔之音',
  41000008: '激奏之誓', 41000009: '樱祭神事', 41000010: '婉语之律', 41000011: '黄昏之后',
  41000012: '星之人', 41000013: '英勋之章', 41000014: '食时之城', 41000015: '绝灭天使',
  41000016: '海拉的守护者', 41000017: '游戏魂', 41000018: '赫鲁晓狐', 41000019: '呼吸一夏',
  41000020: '锚之野望', 41000021: '吟游之诗', 41000022: '一片丹心', 41000023: '团子大家族',
  41000024: '绘图之忆', 41000025: '夜之女神', 41000026: '触之冠', 41000027: '颂诗歌者',
  41000028: '不思议世界', 41000029: '法国女仆', 41000030: '提比', 41000031: '豆馅',
  41000032: '花好月圆', 41000033: '王赐之剑', 41100000: '星梯之耀', 41200000: '武神',
};

// 初始头像框（CfgRole condition「初始头像框」）：建号自带，已查看态
const DEFAULT_FRAME = 41000000;

// 特殊头像 id 全集（CfgRole.head 数组序 = id）
const HEAD_IDS = [1, 2, 3, 4, 5];
const HEAD_NAMES = { 1: '贝希摩斯Alter', 2: '你再打我就报警', 3: '修炼中的史莱喵', 4: '小舟酱的笑容', 5: '性感杂鱼光' };

const FRAME_SET = new Set(FRAME_IDS);
// 41xxxxxx 道具形态 → 头像框（本链上道具 id == 框 id）
function isFrameItem(typeId) { return FRAME_SET.has(Number(typeId)); }
function frameName(id) { return FRAME_NAMES[Number(id)] || '?'; }
function isHeadId(id) { return HEAD_IDS.includes(Number(id)); }

module.exports = { FRAME_IDS, FRAME_NAMES, DEFAULT_FRAME, HEAD_IDS, HEAD_NAMES, isFrameItem, frameName, isHeadId };
