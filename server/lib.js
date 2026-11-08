// 共享工具与跨域推送函数（重构自 start.js）
const fs = require('fs');
const path = require('path');
const proto = require('./proto');
const KEY_LUA = path.join(__dirname, '..', 'tools', 'key_lua');
const { protos } = proto.load(KEY_LUA);
const { S } = require('./state');
const stateMod = require('./state'); // 多账号：account_name 取当前账号名
const { MAP_CONFIGS } = require('./data/map_configs');
const TRAIN = require('./data/train_data');
const ROLE_LEVEL = require('./data/role_level_data');
const GD = require('./data/guide_data');

// 誓灵字段变更推送（ServantConst key：1=exp 2=level 3=status 4=star 5=overstep 6=skin 7=feeling…）
// 客户端 m_servants_change_toc 逐条 set VO 字段（level 变更自动记 lastLevel 供升级动画），
// 顺序约定：先 exp 后 level（lastExp/lastLevel 都能正确记到旧值）
const CHANGE_ID_EXP = 1, CHANGE_ID_LEVEL = 2, CHANGE_ID_STATUS = 3, CHANGE_ID_OVERSTEP = 5;
function pushServantChanges(conn, changes) {
  conn.sendToc('m_servants_change_toc', { changes });
  // 誓灵培养面变化（等级/星级/突破）→ 名气可能变化，diff 推祭坛 fame update
  //（延迟 require：lib ↔ handlers/altar 经 state 循环依赖，调用时模块已加载完成）
  try {
    const altar = require('./handlers/altar');
    if (altar && altar.pushFameUpdates) altar.pushFameUpdates(conn);
  } catch (e) { /* 祭坛模块未就绪时不阻塞誓灵推送 */ }
  // 誓灵等级/星级变化 → 言灵录的"X达到N级"类触发条件可能达成（延迟 require 同上）
  try {
    const moment = require('./handlers/moment');
    if (moment && moment.checkUnlocks) moment.checkUnlocks(conn);
  } catch (e) { /* 言灵录未就绪时不阻塞誓灵推送 */ }
}

const { log } = require('./log');

// 看板娘组（更换助手勾选的 ≤5 只）顺序 id：最后切换的排首位（客户端登录显示 groupList[helpIndex=1]）。
// 官方组上限 = RoleConst.HELP_GROUP_MAX(5)，客户端"更换助手"UI 勾选即发 m_role_profile_helper_tos；
// 主页切换按钮只在组内循环（MainFunctionPanel.onChangeHelp）——组必须只含勾选的助手，
// 从未勾选时组=当前看板娘单元素（不能回落全量，否则切换会在所有誓灵之间循环）
function helperOrderIds() {
  let ids = (S.helperIdList || []).filter(id => S.servants.some(s => s.id === id)).slice(0, 5);
  const lh = S.helperState && S.helperState.lastHelper;
  if (lh && ids.includes(lh)) ids = [lh, ...ids.filter(i => i !== lh)];
  if (ids.length === 0) {
    const first = (lh && S.servants.some(s => s.id === lh)) ? lh : (S.servants[0] && S.servants[0].id);
    if (first) ids = [first];
  }
  return ids;
}

// ---- 按类型生成默认值 ----
function defaultFill(name, depth = 0) {
  const schema = protos[name];
  if (!schema || depth > 6) return {};
  const obj = {};
  for (const [f, t, sub] of schema.fields) {
    if (t === 'array') obj[f] = [];
    else if (t === 'String' || t === 'string') obj[f] = '';
    else if (t === 'bool' || t === 'boolean') obj[f] = false;
    else if (t === 'long') obj[f] = 0;
    else if (t === 'int' || t === 'number') obj[f] = 0;
    else if (t && t.startsWith('p_')) obj[f] = defaultFill(t, depth + 1);
    else obj[f] = 0;
  }
  return obj;
}

// ---- 玩家数据（初始角色）----
const now = Math.floor(Date.now() / 1000);
const roleId = 6000355922n;


function buildRoleData() {
  return {
    role_id: roleId,
    // attr / asset 是 schema 里的 array of p_，但官方服务端单个时按嵌套对象(104)下发
    attr: Object.assign(defaultFill('p_role_attr'), {
      role_id: roleId,
      agreement: 1, // 已同意协议：跳过登录页协议弹窗
      role_name: S.roleName,
      account_name: stateMod.currentAccountName() || 'fzzl',
      create_time: now,
      level: S.roleAsset.level || 1,
      exp: S.roleAsset.exp || 0,
      next_level_exp: ROLE_LEVEL.needExpOf(S.roleAsset.level || 1),
      family_id: S.familyState.familyId,      // 客户端 GlobalData 登录时读它 → FamilyMgr.myFamilyID（0=无结社，点结社开创建面板）
      family_name: S.familyState.name,
      family_ban_time: S.familyState.banTime, // FamilyMgr.hasBan()：退社冷却内禁止再创建/加入
      last_login_ip: '127.0.0.1',
      last_login_time: now,
      last_offline_time: now,
      // 头像/头像框佩戴态（二百九十七）：use.{head,face,border,useType}，handlers/avatar.js stOf 归一
      ...(() => { try { return require('./handlers/avatar').attrHead(); } catch (e) { return { head: 0, servant_face: 0, avatar_border: 0, use_avatar: 0 }; } })(),
      // 看板娘组（GlobalData.initData → RoleMgr.updateHelpGroup）；元素形状 p_helper_brief。
      // 与 brief 时的 pushHelperGroup 同源（helperOrderIds），不能只发首只——
      // 否则登录后到 brief 到达前的窗口期内组不完整
      helper_list: helperOrderIds().map(id => {
        const s = S.servants.find(x => x.id === id);
        return { id: s.id, gain_time: s.gain_time, feeling: s.feeling };
      }),
    }),
    asset: Object.assign(defaultFill('p_role_asset'), {
      role_id: roleId,
      silver: S.roleAsset.silver,
      gold: S.roleAsset.gold,
      gold_given: S.roleAsset.gold_given,
      total_pay_gold: 0,
      total_consume_money: 0,
      // 角色积分（GlobalData.scoreDic）；id=8 是结社积分/本周贡献，结社商店拿它当货币
      role_scores: Object.entries({ ...(S.roleAsset.scores || {}), 2136: getScore(2136), 2250: getScore(2250) }).map(([id, val]) => ({ id: Number(id), val: Number(val) || 0 })),
    }),
    fight: [],
    // guide 客户端按对象访问（ipairs(guide.guide_groups)、guide.last_guide_id）——schema 标 array 但官方按单 104 对象下发。
    // guide_groups 语义 = **未完成引导组列表**（客户端 initGuideData"收到未完成引导列表"）：
    // · 引导档（S.guideState 有值，新建账号）→ 下发剩余未完成组，客户端跑新手链；
    //   last_guide_id=0 时客户端走 tryDoGroup(1) 从开场视频起手。
    // · 老档（null，全部完成口径）→ 空列表，但 last 必须非 0（FINISHED_LAST_ID=53 空壳组）：
    //   openGuide=true 后 last=0 + 空列表会让客户端既不进主城也不播引导（黑屏挂死）。
    guide: S.guideState
      ? {
        guide_groups: GD.FRESH_UNFINISHED.filter(id => !(S.guideState.done || []).includes(id)),
        last_guide_id: Number(S.guideState.last) || 0,
      }
      : { guide_groups: [], last_guide_id: GD.FINISHED_LAST_ID },
    last_reset_time: now,
  };
}

function sendRoleDetail(conn) {
  conn.sendToc('m_role_detail_toc', {
    role_details: buildRoleData(),
    vip_level: 0,
    server_time: Math.floor(Date.now() / 1000),
    queue_num: 0,
    wait_sec: 0,
    full_version: '',
  });
}

// ---- 指挥官经验/等级（RoleModule 反编译实证的推送语义）----
// m_role_exp_change_toc：客户端只读 new_exp（GlobalData.exp = new_exp + ROLE_ATTR_CHANGE 顶栏刷新）
// m_role_levelup_toc：level/exp/next_level_exp 三值齐发（ROLE_LV_CHANGE；无独立弹窗，maxhp/msg 客户端不消费）
// 时序约定（CopyRewardPanel.updateExpInfo 动画）：结算场景先推 exp_change（面板打开时 GlobalData.exp
// 必须已是新值，条形动画以它为终点），结算包之后再推 levelup（面板 "Lv" 标签显示升级前等级）
function applyRoleExpGain(gained) {
  const r = ROLE_LEVEL.applyRoleExp(S.roleAsset.level || 1, S.roleAsset.exp || 0, gained);
  S.roleAsset.level = r.level;
  S.roleAsset.exp = r.exp;
  return r;
}
function pushRoleExpChange(conn) {
  conn.sendToc('m_role_exp_change_toc', { role_id: roleId, new_exp: S.roleAsset.exp || 0, exp_type: 0 });
}
function pushRoleLevelup(conn) {
  conn.sendToc('m_role_levelup_toc', {
    level: S.roleAsset.level || 1,
    maxhp: 0, msg: '',
    exp: S.roleAsset.exp || 0,
    next_level_exp: ROLE_LEVEL.needExpOf(S.roleAsset.level || 1),
    total_add_exp: 0, exp_type: 0,
  });
}
// GM/通用发放：落账 + 按是否升级推对应 toc（非战斗场景直接用，战斗场景按结算时序拆开调）
function grantRoleExp(conn, gained, source) {
  const r = applyRoleExpGain(gained);
  if (r.gained <= 0 && !r.leveledUp) return r;
  if (r.leveledUp) pushRoleLevelup(conn); else pushRoleExpChange(conn);
  log(`[role] 指挥官经验 +${r.gained}${source ? `（${source}）` : ''}：Lv${r.oldLevel}(${r.oldExp}) → Lv${r.level}(${r.exp}/${ROLE_LEVEL.needExpOf(r.level)})`);
  return r;
}

// ---- 誓灵状态（GM 面板添加）----
// 客户端誓灵列表面板不主动拉取，全靠服务端推 m_servants_brief_toc（登录同步 + GM 增加后）
// 主城 MainFunctionPanel 在无誓灵时走 else 分支，但 chatView/hoop/触摸等仍无保护读 slot0.servant → 必须保证至少有一只
// 合法物品 ID 集合（下发 CfgItems 里没有的 type_id 会让客户端 getItemVO 崩）。
// **必须用真机版 CfgItems**：旧的 tools/lua_src/CfgItems.lua 只有 2533 条，真机热更包有 3092 条，
// 差的 560 条（含突破材料 20000031 能量芯片 / 20000032 灵核芯片、20000912~922 等）会被误判为非法道具
// 而拒发。候选顺序与 data/vit_data.js 的 ITEM_USE 解析保持一致，旧版只作缺文件兜底。
const VALID_ITEM_TYPES = new Set();
{
  const cands = [
    path.join(__dirname, '..', 'tools', 'bc_cmp', 'vit_new', 'CfgItems.lua'),
    path.join(__dirname, '..', 'tools', 'bc_cmp', 'CfgItems_ljd.lua'),
    path.join(__dirname, '..', 'tools', 'lua_src', 'CfgItems.lua'),
  ];
  for (const p of cands) {
    try {
      const cfgItems = fs.readFileSync(p, 'utf8');
      for (const m of cfgItems.matchAll(/\[(\d+)\]\s*=\s*\{/g)) VALID_ITEM_TYPES.add(parseInt(m[1]));
      break;
    } catch (e) { /* 试下一个候选 */ }
  }
}

// type_id 前两位 → bag_type（照抄 CfgBag.tabs 顺序，先到先得；72 材料tab在前归 1）
//
// ⚠️ 礼物（bag_type 6）不能用「28 前缀」一刀切 —— 2026-10-21 真机事故（苏芸曦反馈）：
//   bag_type 6 是**隐藏背包**（BagConst.ALL_BAG 里没有 6），客户端只在
//   `DormMgr.getWishItems() = BagMgr.getItems(6)`（协会/宿舍休息室送礼面板）读取它，
//   而该面板排序时逐件调 `DormConfig.getItemPreference(typeId) = CfgGift.preference[typeId]`，
//   返回值直接喂给 `table.isExist(pref, wish.val)` → `pairs(nil)` 抛异常 → 面板 open 即崩。
//   ⇒ **不变量：bag_type=6 里只能出现 CfgGift.preference 有键的道具**。
//   `28000024 神秘的礼物Lv1 / 28000025 神秘的礼物Lv2` 是"可随机获得一种蓝/紫礼物"的
//   开箱类道具（CfgItems.form=3），**不在** CfgGift.preference 里（24 条，见
//   feeling_data.GIFT_PREFERENCE）——旧实现把它们塞进 6，导致送礼面板必崩。
//   注意白名单必须取 GIFT_PREFERENCE（24 条），**不能取 feeling_data.GIFTS**（26 条，含这两个）。
let _realGifts = null;
function realGifts() {
  if (!_realGifts) {
    const pref = require('./data/feeling_data').GIFT_PREFERENCE || {};
    _realGifts = new Set(Object.keys(pref).map(Number));
  }
  return _realGifts;
}

const BAG_TYPE_PREFIXES = [
  [1, ['20', '26', '27', '31', '21', '61', '65']],         // 材料
  [2, ['10', '11', '12', '13', '14', '15', '16', '17', '18']], // 圣器
  [4, ['19']],                                             // 核心圣器
  [5, ['60', '62']],                                       // 活动
  [7, ['24']],                                             // 信仰（BagConst.BAG_TYPE_FAITH；
                                                           //   CfgItems 实证 24 前缀 100% 是信仰：8 属性×3 稀有度）
  // 元素（bag_type 9）：71=泛用型元素精灵、72=元素晶石。
  // ⚠️ 72 必须放这里，不能留在材料页：客户端的三个元素选人面板（融合材料 / 转化晶石 / 外形素材）
  //   全部只读 `BagMgr.getItems(BagConst.BAG_TYPE_ELEMENT)`（ElementMergeSelectItemPanel.onGUI），
  //   晶石留在 bag 1 时转化功能**永远选不到材料**（2026-10-23 调研实证）。
  //   CfgBag 材料页签的 types 里仍写着 72，是官方遗留配置（页签按 bag_type 取数，bags 里没有就看不到）。
  [9, ['71', '72']],
];
// 礼物（协会休息室送礼，不在材料页）——白名单判定，见上方注释
function isRealGift(typeId) {
  return String(Number(typeId)).slice(0, 2) === '28' && realGifts().has(Number(typeId));
}
function bagTypeOf(typeId) {
  if (isRealGift(typeId)) return 6;
  const prefix = String(typeId).slice(0, 2);
  for (const [bt, arr] of BAG_TYPE_PREFIXES) {
    if (arr.includes(prefix)) return bt;
  }
  return 1;
}

// 圣器/能力核心/信仰装备态（唯一权威在 S.servants：
//   relic_gid + cores{属性码:gid} + faiths{pos:gid} + faithTeams{teamId:{pos:gid}}）。
// equipOwnersOfGid：持有某物品的誓灵 id 列表（物品侧 servant_ids 打包用）
function equipOwnersOfGid(gid) {
  const owners = [];
  for (const o of S.servants) {
    if (Number(o.relic_gid) === Number(gid)) { owners.push(o.id); continue; }
    // 元素精灵（bag_type 9）：一只誓灵最多一个，装备态存 element_gid
    if (Number(o.element_gid) === Number(gid) && Number(gid) > 0) { owners.push(o.id); continue; }
    let hit = false;
    for (const v of Object.values(o.cores || {})) {
      if (Number(v) === Number(gid)) { hit = true; break; }
    }
    if (!hit && Number(o.gidFaiths && o.gidFaiths[gid])) hit = true;
    if (hit) { owners.push(o.id); continue; }
    // 信仰：本体套装 faiths 与各编队套装 faithTeams 都算持有（客户端"已装备"角标不分队）
    if (Object.values(o.faiths || {}).some(v => Number(v) === Number(gid))) { owners.push(o.id); continue; }
    let inTeam = false;
    for (const t of Object.values(o.faithTeams || {})) {
      if (t && Object.values(t).some(v => Number(v) === Number(gid))) { inTeam = true; break; }
    }
    if (inTeam) owners.push(o.id);
  }
  return owners;
}

// 批量背包快照：每个装备槽只访问一次，避免每件物品重扫全部誓灵。
// 索引只活在本次响应中；换账号/装备修改无需维护跨请求缓存的失效状态。
function buildEquipOwnersIndex() {
  const index = Object.create(null);
  for (const o of S.servants) {
    const seen = Object.create(null);
    const add = gid => {
      const n = Number(gid);
      if (!(n > 0) || seen[n]) return;
      seen[n] = true;
      if (!index[n]) index[n] = [];
      index[n].push(o.id);
    };
    add(o.relic_gid);
    add(o.element_gid); // 元素精灵（bag_type 9）
    for (const key of Object.keys(o.cores || {})) add(o.cores[key]);
    for (const gid of Object.keys(o.gidFaiths || {})) if (Number(o.gidFaiths[gid])) add(gid);
    for (const key of Object.keys(o.faiths || {})) add(o.faiths[key]);
    for (const key of Object.keys(o.faithTeams || {})) {
      const team = o.faithTeams[key];
      for (const pos of Object.keys(team || {})) add(team[pos]);
    }
  }
  return index;
}

// 从所有誓灵身上卸下某物品（圣器/能力核心），返回受影响誓灵 id 列表
function stripGoodsFromServants(gid, keepSid) {
  const affected = [];
  const numGid = Number(gid);
  for (const o of S.servants) {
    if (o.id === keepSid) continue;
    let changed = false;
    if (Number(o.relic_gid) === numGid) { o.relic_gid = 0; changed = true; }
    if (Number(o.element_gid) === numGid) { o.element_gid = 0; changed = true; }
    for (const k of Object.keys(o.cores || {})) {
      if (Number(o.cores[k]) === numGid) { delete o.cores[k]; changed = true; }
    }
    if (changed) affected.push(o.id);
  }
  return affected;
}

// 信仰装备字段（p_servant_detail.faith / p_team_servant.faith）：
// array p_kvi，id = 槽位 pos(1..9)、val = 物品 gid（ServantConfigVO.initByDetail 走
// table.toDic(faith,"id","val") 建 faithDic，再 initFaithMap → 9 格棋盘）。
// 套装归属唯一口径见 data/faith_data.js 的 faithSlotsOf()：
//   老编队 1~4 与本体（teamId=0）共用 b.faiths；新编队 501+ 才用 b.faithTeams[teamId]。
function faithFieldsOf(b, teamId) {
  if (!b) return { faith: [] };
  const slots = FAITH_PG.faithSlotsOf(b, teamId);
  const arr = [];
  for (const [pos, gid] of Object.entries(slots)) {
    const g = S.bagGoods.find(x => Number(x.id) === Number(gid));
    if (g) arr.push({ id: Number(pos), val: g.id });
  }
  arr.sort((x, y) => x.id - y.id);
  return { faith: arr };
}

// p_goods 完整形状（cur_color 等留默认：客户端 VO 的 color 取自 CfgItems 配置）
// 装备中的圣器/核心要带 servant_ids（打包 long = servantID*10^5；客户端 updateEquipServant
// 按 digits 1-3=team 4-5=group(0→1) 6+=servantID 解包，isEquip/已装备角标全靠它）。
// 信仰（bag_type 7）同理：不打包 servant_ids 则背包里永远不显示"已装备"。
// 信仰实例数据走 spec_data（p_goods_faith：level/exp/color[{id:1..4,val:颜色}]）——
// FaithVO.setDbInfo 读 slot1.spec_data.level / .exp / 遍历 .color，缺了 lv 恒 0、四边颜色全 0。
const FAITH_PG = require('./data/faith_data');
const EL = require('./data/element_data');
// 元素实例 → p_goods_element（spec_data 单对象，客户端 ElementItemVO.setDbInfo 直取）
// level 必须 ≥1：0 会让客户端融合页 `getMergeLvVO(0)=nil` → `currMergeLv.mergeLv` 崩。
function elementSpecOf(g) {
  const face = Array.isArray(g.face) && g.face.length
    ? g.face.map(kv => ({ id: Number(kv.id), val: Number(kv.val) }))
    : [{ id: 1, val: 1 }, { id: 2, val: 1 }, { id: 3, val: 1 }];
  return {
    __nestedProto: 'p_goods_element',
    level: EL.normLevel(g.level),
    translate_type: Number(g.translate_type) || 0,
    translate_times: Number(g.translate_times) || 0,
    face,
  };
}
function goodsPGoods(g, ownersByGid) {
  const indexed = ownersByGid && typeof ownersByGid === 'object';
  // bag 9（元素）也带装备者：客户端 isEquip/isEquipAll 靠它，且 BagUtil.unloadAll 按它反解卸下
  const owners = (g.bag_type === 2 || g.bag_type === 4 || g.bag_type === 7 || g.bag_type === 9) ?
    (indexed ? (ownersByGid[Number(g.id)] || []) : equipOwnersOfGid(g.id)) : [];
  // encodeField 对缺省字段已有协议默认值；逐件 defaultFill('p_goods') 会在
  // ARM/Jint 上重复创建整棵对象，登录 9 个背包包时放大成秒级开销。
  const out = {
    id: g.id,
    bag_type: g.bag_type,
    type_id: g.type_id,
    cur_num: g.cur_num,
    servant_ids: owners.map(sid => BigInt(sid) * 100000n),
  };
  if (g.bag_type === 9 || EL.isElementItem(g.type_id)) {
    // cur_color：ElementItemVO.setDbInfo 用 slot0.color = slot1.cur_color 覆盖 CfgItems.color
    // （泛用=4、专属=5），不发则色框恒默认、专属精灵看不出区别
    out.cur_color = Number(g.color) || (Number(g.translate_type) > 0 ? EL.CRYSTAL_COLOR : EL.NORMAL_ITEM_COLOR);
    out.spec_data = elementSpecOf(g);
  } else if (g.bag_type === 7 || FAITH_PG.isFaithType(g.type_id)) {
    const sc = Array.isArray(g.sideColor) && g.sideColor.length === 4 ? g.sideColor : [0, 0, 0, 0];
    // spec_data schema 标 array binary，客户端按单个嵌套对象读 → 用 __nestedProto 编成 104 对象
    out.spec_data = {
      __nestedProto: 'p_goods_faith',
      level: Number(g.level) || 1,
      color: [1, 2, 3, 4].map(i => ({ id: i, val: Number(sc[i - 1]) || 0 })),
      exp: Number(g.exp) || 0,
    };
  }
  return out;
}

// 发物品入包：圣器/核心/信仰（CfgItems canPile=false）每个一实例（装备引用的是实例 gid，
// 不能堆叠），其余按 type_id 堆叠。返回新建/变更的 goods 数组（用于 pushGoodsUpdate）。
// conn 可选：誓灵代币分支有活连接时走 collab 延迟宣告（3s 后 m_servant_update_toc 入列 +
// 清 pendingAnnounce + 补推名气）——不传则保持旧口径（入档不宣告，重登 brief 才可见）。
// 客户端死箱（link=0 无消费口）的发放侧转换表——键=官方奖励表写的死箱 id，值=同档可用品。
// 弹窗构造点（activity.js grantMissionRewards/grantRewardItems）用 got[0].type_id 取实收 id。
const DEAD_BOX_SUBSTITUTE = { 20000900: 20000903, 20000901: 20000904, 20000902: 20000905 };
function substituteBoxTypeId(typeId) {
  return DEAD_BOX_SUBSTITUTE[Number(typeId)] || Number(typeId);
}
function grantGoods(typeId, num, conn) {
  const tid = Number(typeId);
  if (!tid || tid <= 0 || isNaN(tid)) {
    log(`[bag] grantGoods 被拒：非法 typeId=${typeId}`);
    return [];
  }
  typeId = tid;
  const changed = [];
  const rawNum = num == null ? 1 : Number(num);
  if (!Number.isFinite(rawNum) || rawNum <= 0) {
    log(`[bag] grantGoods 被拒：非法数量 typeId=${typeId} num=${num}`);
    return [];
  }
  const n = Math.floor(rawNum);
  // 誓灵代币（3+7 位物品形态，icon=UI/Servant/...）→ 转 grantServant 入誓灵栏。
  // 严禁入包：bag 后落在材料页，不可使用无效果（data 空 maxUse=0，客户端点击仅图鉴入口）。
  const TK = require('./data/servant_token_data');
  if (TK.isServantToken(typeId)) {
    const st = TK.servantTypeOfToken(typeId);
    for (let i = 0; i < n; i++) require('./handlers/collab').grantServant(conn || null, st); // 有连接 → 3s 延迟宣告；否则入档不宣告
    log(`[bag] 誓灵代币 ${typeId} → 誓灵 ${st}×${n} 入誓灵栏${conn ? '（延迟宣告）' : '（不落包，无连接不宣告）'}`);
    return [];
  }
  // 称号盒（CfgItems 25001001~25001999，form=2 不进背包）：转 title.grantTitle 置称号状态。
  // 同誓灵代币一类：入包 = 材料页死道具（不可使用），称号永不激活。212 条成就奖励就是这类盒子
  // （achievement.js → grantGoods），此前全部发错；letter.js 邮件路径 2026-10-24 已单独修对。
  const TDB = require('./data/title_data');
  if (TDB.isTitleBox(typeId)) {
    const TITLE = require('./handlers/title');
    const tid = TDB.titleIdOfBox(typeId);
    let last = null;
    for (let i = 0; i < n; i++) last = TITLE.grantTitle(typeId) || last; // 重复盒自动折 1500 银币
    if (last && conn) TITLE.pushTitleUpdate(conn, [{ id: tid, val: last.val }]);
    log(`[bag] 称号盒 ${typeId} → 称号 ${tid}${last && last.dup ? '（重复 → 折银币）' : ''}`);
    return [];
  }
  // 进化素材箱死箱转换（二百七十八，2026-10-31）：进化素材Lv1/2/3（20000900~902）是官方奖励表
  // 遗留的死箱——真机 CfgItems：link=0（BaseItemVO.canUse=link~=0 ⇒ 使用按钮恒「关闭」）+
  // form=3（获得弹窗剔除）+ data={}（V.ITEM_USE 无解析）+ 不在 bagMatExchangeArr/进化替代/合成表
  // ⇒ 本版客户端没有任何打开方式，唯一出路是出售 300 银币。客户端全库唯一 m_item_use_tos 发送口
  // BagModule.toUseItem 的调用链全部被 canUse 闸住，服务端补使用表也够不着。
  // 转换为同档「百变素材模型」（官方 link=2 自选道具：使用 → OPEN_MAT_EXCHANGE_PANEL 自选任一
  // 同档素材 1:1，服务端 m_item_exchange_goods_tos + item_exchange_data.EXCHANGE_BOXES 全链路已实现）：
  //   Lv1 档=20000000~08 / Lv2 档=20000009~18 / Lv3 档=20000019~25（与聚合展示道具 31000006/7/8 同口径）。
  // 奖励表保持官方原样（CfgMission.activity/派遣/663 活动关掉落/成就/环游/塔都写着 2000090x），
  // 转换在统一出口做一处覆盖全部发放面。已知代价：成就/派遣/掉落预览读客户端官方配置，
  // 图标仍显示进化素材LvX，实收为百变素材模型（自选优于随机，只赚不亏）。
  const SUB = DEAD_BOX_SUBSTITUTE[typeId];
  if (SUB) {
    log(`[bag] 死箱转换：进化素材Lv${typeId - 20000899}(${typeId}) → 百变素材模型(${SUB})×${n}`);
    return grantGoods(SUB, n, conn);
  }
  // 贴纸素材（26100001~118，二百八十）：CfgItems form=2+link=0 只有展示壳——唯一消费口是
  // 个人主页涂鸦板（m_graffiti_material_toc 素材列表），入包=点不开的死道具（二百七十八同族）。
  // 一处收口覆盖全部发放面：关卡掉落 others 池（26100028-30/85/86/93-96）/ 唤灵殿堂 7003
  // 赫拉（26100085/86）/ 活动积分榜（26100033/38）/ GM m21_goods / 贴纸道具使用
  //（21500xxx 的 CfgItems.data 产出全是 261 段，走 vit 通用产出自然命中本分支，无需专用表）。
  if (require('./data/artwork_data').isArtworkMat(typeId)) {
    require('./handlers/artwork').grantMat(typeId, n);
    return [];
  }
  // 道具形态积分（form=2 + CfgScoreItem，二百八十收口进统一出口）：此前只有部分调用方
  // 先查 grantScoreItem 再落 grantGoods——GM m21_goods / 未来新发放面漏查就会把
  // 瑞旦贺霄信物这类积分道具塞进包（form=2 客户端 isToBag=false ⇒ 读数恒 0）。
  // 先查的调用方（vit.grantItemRewards/activity/handbook/achievement/dorm）不受影响
  //（积分 id 到不了这里）；本分支只兜"没查"的调用方，零双计风险。
  if (scoreIdOfItem(typeId)) {
    grantScoreItem(conn, typeId, n);
    return [];
  }
  // 头像框（41xxxxxx，二百九十七）：CfgItems form=2+link=0 展示壳——唯一消费口是头像框面板
  // （m_avatar_border_detail_toc borders），入包=客户端 isToBag=false 整条丢弃的死道具
  //（dare 首通/成就/联动高难/关卡掉落/活动/环游都在发；真实存档曾躺 41000007×1）。
  // 一处收口覆盖全部发放面（含 GM m21_goods）：首获解锁+推 activate，重复折 3000 金币。
  // 道具 id == 框 id（与涂鸦板不同，本链无需 typeID 转换，见 data/head_data.js 头注释）。
  if (require('./data/head_data').isFrameItem(typeId)) {
    require('./handlers/avatar').grantFrame(conn, typeId, n);
    return [];
  }
  const RD = require('./data/relic_data');
  const FD = require('./data/faith_data');
  if (RD.isRelicType(typeId) || RD.isCoreType(typeId)) {
    // 核心实例等级 = 物品 Lv（color3=Lv1 … color5=Lv3；原初/满级由开箱方覆盖）。
    // 此前恒为 1：Lv.2/Lv.3 核心开出来仍按 Lv1 算加成，与面板/描述不符（2026-09-12 修）
    const lv = RD.isCoreType(typeId) ? Math.max(1, (RD.infoOfType(typeId).color || 3) - 2) : 1;
    for (let i = 0; i < n; i++) {
      const g = { id: S.nextGoodsId++, type_id: typeId, cur_num: 1, bag_type: bagTypeOf(typeId), level: lv };
      S.bagGoods.push(g);
      changed.push(g);
    }
  } else if (EL.isElementItem(typeId) || (EL.isCrystal(typeId) && bagTypeOf(typeId) === 9)) {
    // 元素实例（71000001 / 7200000x）：**绝不堆叠** —— 每个实例自带 level/translate_type/face，
    // 堆成一个会让融合页拿到 level=0 的怪实例（getMergeLvVO(0)=nil → 崩），
    // 且专属/泛用、不同等级无法区分（2026-10-23 调研：71000001 已在活动积分/掉落/兑换表里）。
    for (let i = 0; i < n; i++) {
      const isCrystal = Number(typeId) !== EL.NORMAL_ITEM_ID;
      const g = {
        id: S.nextGoodsId++, type_id: typeId, cur_num: 1, bag_type: 9,
        level: 1, translate_type: 0, translate_times: 0,
        face: [{ id: 1, val: 1 }, { id: 2, val: 1 }, { id: 3, val: 1 }],
        color: isCrystal ? EL.CRYSTAL_COLOR : EL.NORMAL_ITEM_COLOR,
      };
      S.bagGoods.push(g);
      changed.push(g);
    }
  } else if (FD.isFaithType(typeId)) {
    // 信仰实例：level 从 1 起、exp 0、四边随机颜色（1..6）。旧数据可能是 color-2 的"开箱档位"，
    // 这里统一以"信仰自身等级"为准（Level 语义 = FaithVO.lv = spec_data.level）
    for (let i = 0; i < n; i++) {
      const g = {
        id: S.nextGoodsId++, type_id: typeId, cur_num: 1, bag_type: 7,
        level: 1, exp: 0, sideColor: FD.rollSideColors(),
      };
      S.bagGoods.push(g);
      changed.push(g);
    }
  } else {
    let g = S.bagGoods.find(x => x.type_id === typeId);
    if (g) {
      // 旧版本把 28xxxxxx 礼物误归到材料包；发放时顺手纠正，避免同一物品继续留在错误分页。
      g.bag_type = bagTypeOf(typeId);
      g.cur_num += n;
    }
    else { g = { id: S.nextGoodsId++, type_id: typeId, cur_num: n, bag_type: bagTypeOf(typeId) }; S.bagGoods.push(g); }
    changed.push(g);
  }
  return changed;
}

// 誓灵装备字段（p_servant_detail / p_team_servant 的 relic/relic_id/power_relic）：
// relic=圣器typeId、relic_id=物品gid、power_relic=[{id:属性码, val:物品gid}]
// （ServantConfigVO.initByDetail / FormationServantVO.initByFormation 都按 toDic(power_relic,"id","val")
//   建 coreDic，键是属性码——别发成 gid，否则 getPropRelic(属性码) 全取 0）
function relicFieldsOf(b) {
  if (!b) return { relic: 0, relic_id: 0, power_relic: [] };
  const g = S.bagGoods.find(x => Number(x.id) === Number(b.relic_gid));
  const cores = [];
  for (const [prop, gid] of Object.entries(b.cores || {})) {
    const cg = S.bagGoods.find(x => Number(x.id) === Number(gid));
    if (cg) cores.push({ id: Number(prop), val: cg.id });
  }
  return { relic: g ? g.type_id : 0, relic_id: g ? g.id : 0, power_relic: cores };
}

// 推送物品变更。opType 必须用 3(GOODS_OP_UPDATE)：客户端 BagVO.updateItem 对不存在
// 的物品走 addItem 入包、存在的覆盖 setDbInfo——是唯一安全的入包/改数路径。
// 1(NEW) 只弹"获得道具"面板不入包；2(DEL) 是 delGoods 移除
// ⚠️ 含核心实例的 op=3 推送必须紧随 m_relic_upgrade_info_toc：p_goods 无等级字段，
// 客户端 CoreItemVO.ctor 读的全局 allExp 恒 nil → VO 出生恒 Lv.1，而服务端核心
// 天生 color-2（原初箱满级 15）。缺这条，升级面板显示 Lv.1，首次升级回包把显示
// 一次性拉到真实等级（"生命核心直升15/其他直升4"，见 调研-核心升级直升15.md），
// 且费用预览按 Lv2 算、实扣按真实档位——发放路径一律走这里，不再各自补推。
function pushGoodsUpdate(conn, goods, opType) {
  const valid = (goods || []).filter(g => g && (opType === 2 || Number(g.type_id) > 0));
  if (!valid.length) return;
  conn.sendToc('m_goods_update_toc', {
    goods: valid.map(goodsPGoods),
    type: opType,
    reward_type: 0,
    replace_list: [],
  });
  // op=1 全部有前置 op=3 数据推送配对（弹窗载体，条目 id 可能是 0）；op=2 是删除，
  // 核心移除不涉及等级显示。只钩 op=3，一次发放恰好一条补推。
  if (opType === 3) {
    const RD = require('./data/relic_data');
    if (valid.some(g => RD.isCoreType(g.type_id))) {
      conn.sendToc('m_relic_upgrade_info_toc', { power_relic_list: powerRelicList() });
    }
  }
}

// 核心等级旁路包：核心等级唯一权威 S.bagGoods[].level（客户端 p_goods 无此字段）。
// m_relic_upgrade_info_tos 与 pushGoodsUpdate 的补推共用，保证两处永不分叉。
function powerRelicList() {
  const RD = require('./data/relic_data');
  return S.bagGoods.filter(g => RD.isCoreType(g.type_id))
    .map(g => ({ id: g.id, val: Number(g.level) || 1 }));
}

// 编队槽位规整：主力/备战恒 3 槽（0=空位）
// 客户端 updateFormationInfo 按 #field 填 getMainTeam，超 3 元素会触发"主力队伍誓灵数量超过3个"报错并崩编队界面
function normSlots(arr) {
  const a = Array.isArray(arr) ? arr.filter(id => Number(id) >= 0).map(Number).slice(0, 3) : [];
  while (a.length < 3) a.push(0);
  return a;
}

// 背包容量：扩容过的用存档值，其余初始 60。
// 星图基建加成：40 背包扩建（材料 bag_type 1）+5 格/级、41 背包扩建II（圣器/核心 bag_type 2/4）+5 格/级
function bagSizeOf(type) {
  const base = Number(S.bagSizes[type]) > 0 ? Number(S.bagSizes[type]) : 60;
  try {
    const GR = require('./handlers/grow'); // 延迟 require 解 lib↔grow 循环依赖
    if (type === 1) return base + GR.starLv(40) * 5;
    if (type === 2 || type === 4) return base + GR.starLv(41) * 5;
  } catch (e) { /* 循环依赖窗口期按无加成计 */ }
  return base;
}

// 战斗点 id：地图级 id（*100）→ 首个道中战斗（*101）。
// 客户端 prepare 后 CopyMgr.nowCopyPointID=copy_id，点开战查 CfgCopyDetail[该id].noHelp：
// 道中/round id 带 noHelp=1 直接开战；发地图头 id（无 noHelp）会弹助战选择（本地服无好友列表 → 空面板死路）
// 货币变更推送：客户端 RoleModule.m_role_attr_change_toc 按 change_type 更新 GlobalData
// 并 dispatch GOLD/SILVER_CHANGE 刷新 UI。type 映射（RoleConst）：1=金币 3=水晶总量 7=赠送水晶
function pushAssetChange(conn) {
  conn.sendToc('m_role_attr_change_toc', {
    role_id: roleId,
    changes: [
      { change_type: 1, new_value: S.roleAsset.silver, new_string: '' },
      { change_type: 3, new_value: S.roleAsset.gold, new_string: '' },
      { change_type: 7, new_value: S.roleAsset.gold_given, new_string: '' },
    ],
  });
}



// ---- 灵契（婚姻）type 级派生判定（通用，皮肤/图鉴/GM 三处共用）----
// 灵契皮肤（CfgServantSkin actItemID==1 / getWayID=20"缔结灵契"）的归属是派生值：
// 客户端 addNewOwnSkinID 本身就按 type 更新该类型全部皮肤 VO（type 级心智），
// 且从不从 pledge_time 本地推导归属（setCurrSkinInfo 只认服务端 com_skin/priv_skin 列表），
// 故同 type 多实例时任一誓灵 pledge_time>0 即视为该 type 已缔结。不写 S.skinState.owned，
// 历史（修复上线前）已缔结档免迁移即生效；GM m21_skin 的静态解锁与其取并集。
function isTypeMarried(type) {
  return S.servants.some(b => Number(b.type) === Number(type) && Number(b.pledge_time) > 0);
}

// ---- 关卡进度/功能解锁（通用，上移至 lib 以解开 role↔map_fight 循环依赖）----
function progressOf(barrierId) {
  if (!S.mapProgress.maps[barrierId]) {
    S.mapProgress.maps[barrierId] = { defeated: [], cleared: [], dropped: [] };
  }
  return S.mapProgress.maps[barrierId];
}

// ---- 功能开启列表 ----
// 客户端 CfgGuide.funcOpenGuide：功能1(协会)=通关1-2、2=通关1-3、3=通关1-4…
// GuideMgr.isFuncOpen 只认 m_function_info_toc / m_function_update_toc 下发的 functions 列表，
// 不在列表里就弹"通关X-X后开启"提示（提示文案正是 funcOpenGuide 第三列）
const FUNC_UNLOCK = {
  1010200: [1], // 通关1-2 → 协会（宿舍）
  1010300: [2], // 通关1-3 → 协会派遣
  1010400: [3], // 通关1-4 → 协会学习
  1020100: [7], // 通关2-1 → 结社（GuideConst.FUNC_ID_FAMILY，CfgGuide.funcOpenGuide "通关2-1后开启"）
  1020400: [8, 19, 20], // 通关2-4 → 无尽冒险（GuideConst.FUNC_ID_TOWER=8，CfgGuide.funcOpenGuide"通关2-4解锁"；
  // CfgCopy.copySelectTabs TowerBanner"通关2-4解锁"；入口=副本→每日副本→无尽冒险 TowerBanner）
  //                + **元素精灵**（FUNC_ID_ELEMENT=19 开放使用、FUNC_ID_SEE_ELEMENT=20 显示页签）。
  // 解锁文案是客户端硬编码的 ElementConst.NOT_OPEN_TXT"通关主线2-4后可激活"；CfgGuide.funcOpenGuide
  // **没有** 19/20/22 三条 ⇒ 不发这三条时所有入口静默隐藏、连"通关X-X后开启"提示都不会弹。
  // 22（FUNC_ID_ACT_ELEMENT=「已激活」）不由通关触发：客户端点元素槽时发 guide_do(122,2,true)，
  // 服务端在 handlers/guide.js 记完成后补推（2026-10-23 元素精灵接通）。
  1020200: [5], // 通关2-2 → 神迹演武（FUNC_ID_COPY_MIRACLES=5；copySelectTabs ArenaBanner，PVP 未实现但功能点亮）
  1020300: [4], // 通关2-3 → 曜日副本（每日材料本；GuideConst.FUNC_ID_COPY_DROP=4，
  // CfgCopy.copySelectTabs[1][1] 的 tipstr"通关2-3解锁" + funcID=FUNC_ID_COPY_DROP；
  // 入口=副本→每日副本→曜日副本 MaterialsBanner，CopyPvpEnterItem 按 isFuncOpen(4) 判定。
  // 进化章是誓灵进化材料的产出口，见 handlers/daily_copy.js）
  1030200: [21], // 通关3-2 → 天空方舟（GuideConst.FUNC_ID_ARK=21，funcOpenGuide 三条均"通关3-2后开启"；入口=协会主页 Banner05）
  1030100: [10], // 通关3-1 → 灵契召唤（GuideConst.FUNC_ID_AFFINITY=10，funcOpenGuide"通关3-1后开启"；
  // SummonModule.gotoOpenPanel 按 isFuncOpen(10) 拦"未开启灵契召唤~"；玩家当前进度已达标）
  1030400: [26], // 通关3-4 → 祭坛（CfgDorm.choiceInfo Banner06 funcID=26 notOpenTip"通关主线3-4后开启"；
  // 解锁条件不在 CfgGuide.funcOpenGuide 里，直接写在 banner 配置上，DormChoiceItem 按 isFuncOpen(26) 判定）
  1050400: [16, 17], // 通关5-4 → 银匙之门与暗噬（功能16/17）
  // 入口=主线页左侧 btnDream，DreamModule.onOpenDreamEnterPanel 按 isFuncOpen(FUNC_ID_DREAM=16) 判定）
  1060400: [12], // 通关6-4 → 信仰（GuideConst.FUNC_ID_FAITH=12，CfgGuide.funcOpenGuide {12,1,"通关主线6-4后可开启"}；
  // ServantModule.onOpenServantFaith 与 31000021/31000023 的 desc 都写"通关剧情6-4后才可使用"。
  // 无此条 → isFuncOpen(12) 恒 false，信仰面板点开即弹"通关6-4后开启"）
};



// 元素精灵「已激活」（FUNC_ID_ACT_ELEMENT=22）：唯一权威是引导组 122 的完成记录
// （客户端点元素槽位 → m_role_guide_do_tos(122,2,true)；guide_data.js 注明 122 是
//  "steps={} 的空壳组，官方仅用于直接标记完成"）。不落新字段，旧档只要 122 在 done 里就生效。
const GUIDE_ELEMENT_ACT = 122;
function elementActivated() {
  if (Number(S.elementActivated) === 1) return true;
  const done = (S.guideState && S.guideState.done) || [];
  return done.map(Number).includes(GUIDE_ELEMENT_ACT);
}

function buildOpenFunctions() {
  const funcs = [];
  // GM「开启所有功能」（m21_function=1，二百零二）：进度驱动的解锁对调试不友好
  // （要打到 6-4 才开双倍，客户端还会直接隐藏开关）。S.gmAllFunctions 置位时返回全集，
  // 仅内存态、不落盘以外的副作用；=0 恢复按进度。
  if (S.gmAllFunctions) {
    for (const ids of Object.values(FUNC_UNLOCK)) funcs.push(...ids);
    funcs.push(22); // 元素精灵激活位不在 FUNC_UNLOCK 里（由引导 122 驱动），GM 全开时也要给
    return [...new Set(funcs)];
  }
  for (const [barrierId, ids] of Object.entries(FUNC_UNLOCK)) {
    const cfg = MAP_CONFIGS[barrierId];
    if (cfg && (progressOf(Number(barrierId)).cleared || []).includes(cfg.bossPoint)) {
      funcs.push(...ids);
    }
  }
  if (elementActivated()) funcs.push(22);
  return funcs;
}

function pushFunctionList(conn) {
  const funcs = buildOpenFunctions();
  conn.sendToc('m_function_info_toc', { functions: funcs });
  log(`[func] 推送功能列表: [${funcs.join(',') || '空'}]`);
}

// 增量解锁推送（客户端 GuideMgr.updateFuncOpenList 合并进开启表 + 派发 FUNCTION_UPDATE_STATE）
function pushFunctionUpdate(conn, extra) {
  const funcs = [...new Set(buildOpenFunctions().concat(extra || []))];
  conn.sendToc('m_function_update_toc', { functions: funcs });
  log(`[func] 增量解锁: [${funcs.join(',') || '空'}]`);
}

// 角色积分（GlobalData.scoreDic）读写与推送：客户端 RoleModule.m_role_score_change_toc → setScore
// + dispatch ROLE_SCORE_CHANGE（结社模块监听 id=8 刷新商店页"我的本周贡献"）
function getScore(id) {
  const scores = S.roleAsset.scores || {};
  // 小千日记读 2136，动荡的时空旧补丁读 2250；两者是同一份时间晶体。
  // 2250 是已有存档的余额来源，优先保留；兼容仅有官方 2136 的存档。
  if (Number(id) === 2136 || Number(id) === 2250) {
    return Number(scores[2250] == null ? scores[2136] : scores[2250]) || 0;
  }
  return Number(scores[id]) || 0;
}
function pushScoreChange(conn, id) {
  conn.sendToc('m_role_score_change_toc', {
    role_scores: [{ id: Number(id), val: getScore(id), give_type: 0 }],
  });
}
function addScore(conn, id, delta) {
  if (!S.roleAsset.scores) S.roleAsset.scores = {};
  const numId = Number(id);
  const newScore = Math.max(0, getScore(numId) + Number(delta || 0));
  S.roleAsset.scores[numId] = newScore;
  if (numId === 2136 || numId === 2250) {
    const otherId = numId === 2136 ? 2250 : 2136;
    S.roleAsset.scores[otherId] = newScore;
    if (conn) pushScoreChange(conn, otherId);
  }
  if (numId === 2174) {
    S.roleAsset.scores[45] = newScore;
    if (conn) pushScoreChange(conn, 45);
  } else if (numId === 45) {
    S.roleAsset.scores[2174] = newScore;
    if (conn) pushScoreChange(conn, 2174);
  }
  if (conn) pushScoreChange(conn, numId);
  _achvFriendPoints(numId, delta);
  return S.roleAsset.scores[numId];
}

// ---- 「道具形态的积分」（data/score_items.js 的 ITEM_TO_SCORE，来源客户端 CfgScoreItem ∩ form=2）----
// 客户端对该类道具的持有数一律读 GlobalData.getScore(scoreId)，且 form=2 意味着它不在背包页签显示
// （ItemConst.TYPE_ID_BUILDING_SCORE=31000009 → BagMgr.getItemNum 返回 getScore(SCORE_DORM=4)）。
// 所以发放必须落积分、不能入包——入包 = 玩家看不到 + 功能判定永远不足。
const SCORE_ITEMS = require('./data/score_items');
function scoreIdOfItem(typeId) { return SCORE_ITEMS.scoreIdOfItem(typeId); }
// 命中则落积分并推送（m_role_score_change_toc），返回 true；否则返回 false 由调用方按背包物品处理
function grantScoreItem(conn, typeId, num) {
  const sid = scoreIdOfItem(typeId);
  if (!sid) return false;
  const amount = Number(num);
  if (!Number.isFinite(amount) || amount <= 0) {
    log(`[score] grantScoreItem 被拒：非法数量 typeId=${typeId} num=${num}`);
    return true;
  }
  addScore(conn, sid, amount);
  return true;
}

// 友情点获得即记入成就累计（46xxx；任务奖励 31000002 与后续任何来源都走这里）
// 延迟 require 解 lib↔achievement 循环依赖
function _achvFriendPoints(scoreId, delta) {
  if (Number(scoreId) === 2 && Number(delta) > 0) {
    try { require('./handlers/achievement').addFriendPoints(Number(delta)); } catch (e) { /* 忽略 */ }
  }
}

// 退社冷却下发（change_type 10 = familyBanTime，客户端 RoleConst 映射表实证；
// 不推的话 FamilyMgr.hasBan() 读的还是登录时的旧值）
function pushFamilyBanTime(conn) {
  conn.sendToc('m_role_attr_change_toc', {
    role_id: roleId,
    changes: [{ change_type: 10, new_value: S.familyState.banTime, new_string: '' }],
  });
}

module.exports = { log, defaultFill, roleId, buildRoleData, sendRoleDetail,
  VALID_ITEM_TYPES, bagTypeOf, isRealGift, goodsPGoods, pushGoodsUpdate, normSlots, bagSizeOf, pushAssetChange,
  pushServantChanges, CHANGE_ID_EXP, CHANGE_ID_LEVEL, CHANGE_ID_STATUS, CHANGE_ID_OVERSTEP, TRAIN, isTypeMarried,
  ROLE_LEVEL, applyRoleExpGain, pushRoleExpChange, pushRoleLevelup, grantRoleExp,
  progressOf, buildOpenFunctions, pushFunctionList, pushFunctionUpdate, elementActivated,
  GUIDE_ELEMENT_ACT, elementSpecOf,
  getScore, addScore, pushScoreChange, pushFamilyBanTime,
  scoreIdOfItem, grantScoreItem,
  equipOwnersOfGid, buildEquipOwnersIndex, grantGoods, relicFieldsOf, faithFieldsOf, helperOrderIds,
  powerRelicList, DEAD_BOX_SUBSTITUTE, substituteBoxTypeId,
  stripGoodsFromServants };
