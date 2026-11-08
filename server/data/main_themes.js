// 场景主题清单（个人信息页"场景主题"/主页背景，handlers/role.js 的 m_background_theme_* 族）。
//
// 证据链（客户端反编译实证，tools/lua_src + bc_cmp/CfgMain_re.lua）：
//  - 主题全集来自客户端配置 CfgMain.themes（MainConfig.getThemeList → MainMgr.initThemeList 建表），
//    共 19 个，id 连续 1..19（1=默认主题）。
//  - 解锁状态完全由服务端下发决定：客户端开主题面板发 m_background_theme_tos{del_red_point}，
//    收 m_background_theme_toc{ids, new_ids} 后 MainMgr.activeThemes 只把 ids 里的主题置 isActive=true；
//    点未解锁主题只提示"该主题尚未获得哦"并弹回——官方按成就/活动逐个解锁。
//  - 本地服口径：**全量默认解锁**（新号同）→ ids 恒等本表全集、new_ids 恒空（无"新"红点）。
//  - 当前使用哪个主题：登录进主界面客户端发 m_background_use_now_tos（GuideModule.enterMainPanel），
//    服务端回 m_background_use_now_toc{id, use_effect}；切换走 m_change_background_theme_tos/toc。
//    use_state 落在存档 S.themeState（state.js），越界 id 在 loadState 回落 1。
//
// 与客户端 CfgMain 漂移的后果仅是"多解锁不存在的 id"（客户端 getThemeVO 找不到会报错并回落主题 1），
// 本表静态（2021 客户端，配置不再更新），无需像 skin_config 那样配漂移校验。

const THEME_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const THEME_NAMES = {
  1: '默认主题', 2: '圣夜巡游', 3: '樱曳风华', 4: '星雨夜华', 5: '滨海夏日',
  6: '星耀剧场', 7: '梦幻王国', 8: '女仆咖啡厅', 9: '花聆·萤影', 10: '梦色之厅',
  11: '灵渡之域', 12: '世纪大道', 13: '樱之坂', 14: '甜睡魔法', 15: 'Mea的房间',
  16: '门前小憩', 17: '夜市风情', 18: '圣诞邀约', 19: '春日山城',
};

module.exports = { THEME_IDS, THEME_NAMES };
