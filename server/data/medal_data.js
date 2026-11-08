// 勋章（个人信息页"勋章佩戴"装饰，handlers/role.js 的 m_check_medal_* / m_equip_medal_* /
// m_discharge_medal_* 族）。
//
// 证据链（客户端反编译 + 资源实证，2026-09-13（七十三））：
//  - 勋章全集在客户端配置 CfgRole.medal，共 8 个（id 连续 1..8）；iconPaths 按 num（val）分段换图，
//    所有段起点都是 1 → val=1 恒有合法图标（挑战者勋章分段到 60，val=1 显示第 1 段）。
//  - 官方语义：勋章由成就/高难首通投放；本地服口径 = **全量默认拥有**（同场景主题，新号同），
//    list 恒等本表全集、val 恒 1；佩戴位 use 共 4 个（官方底图 MeadalBg 就是 4 槽），0=空位。
//  - 佩戴位动态 item 由 m_check_medal_toc{use[]} 驱动（id=0 → 客户端渲染透明占位，
//    静态底图加号照常透出；装备后图标盖在对应槽位上）。
//  - 客户端点槽位/抽屉里的勋章发 m_equip_medal_tos{nth(1基), id}、点已戴的发
//    m_discharge_medal_tos{nth}；toc 同名回显（equip 带 num）。
//  - p_chat_role.medals（聊天侧展示佩戴勋章）= use 过滤空位后的 {id, val} 列表。

const MEDAL_IDS = [1, 2, 3, 4, 5, 6, 7, 8];
const MEDAL_NAMES = {
  1: '初心者勋章', 2: '挑战者勋章', 3: '周年庆勋章', 4: '喵喵狐',
  5: '祭丝', 6: '铁夸团', 7: '财布', 8: '二周年庆勋章',
};
// 拥有态统一 val=1（CfgRole.medal 全部 iconPaths 段起点 1，val=1 恒有合法图标；
// 挑战者勋章 60 段按高难通关数升档，本地服恒给第 1 段，想改段位调这里）
const MEDAL_VAL = 1;
const MEDAL_SLOTS = 4; // 佩戴位数（MeadalBg 底图 4 槽）

module.exports = { MEDAL_IDS, MEDAL_NAMES, MEDAL_VAL, MEDAL_SLOTS };
