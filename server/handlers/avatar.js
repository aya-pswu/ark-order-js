// 头像/头像框（二百九十七，2026-11-04）。
//
// 用户反馈：头像和头像框功能不可用——头像框面板 36 个框全部"未获得"、点选无反应；
// 名片"头像"列表里特殊头像全锁；获得的头像框道具（41000xxx）发放即死。
//
// 根因（与二百八十涂鸦板同形状的系统级缺口，当时记为遗留工单）：
//   ① 头像框道具 41000xxx（CfgItems form=2 + link=0 展示壳）被 dare 首通/成就/联动高难/
//      关卡 others 掉落/活动积分/环游 直接塞 grantGoods ⇒ form=2 客户端 m_goods_update_toc
//      isToBag=false 整条丢弃（"获得"弹窗可见、背包没有、框也不解锁）；真实存档曾躺 41000007×1；
//   ② 七条协议服务端 0 实现，兜底回包全是静默失败：
//      - m_avatar_border_detail_tos → 兜底 {borders:[]} ⇒ 36 框 ownState 恒 0（全"未获得"）；
//      - m_change_avatar_border_tos / m_change_head_tos / m_buy_head_tos → 兜底含实体字段 id
//        被拒回 common_reply ⇒ 点选无提示无变化（"点了没反应"）；
//      - m_check_head_tos → 兜底 {heads:[],faces:[]} ⇒ 特殊头像全锁。
//
// 客户端契约（tools/lua_src 反编译 + rolemgr_asm 双源核对）：
//   链A 头像框（RoleHeadPanel，名片"头像框"按钮 / RolePanel"头像"按钮 openHeadPanel）：
//     - m_avatar_border_detail_toc{borders:[p_kvi{id,val}]}：**只发已拥有**的框；
//       RoleHeadVO.copy ⇒ ownState=1、isNew=(val==1) ⇒ val=1 新获得、val=0 已查看。
//       RoleHeadPanel.onOpen 直接渲染 RoleMgr.getHeadList(true)，detail 没到过就开面板
//       会 getHeadList 读 uv0.array 的 nil（uv0 只由 initHeadInfo 赋值）⇒ **本协议必须永远回包**。
//     - m_change_avatar_border_tos{id}：客户端列表 onSelect 对**任意行**（含未拥有）都发
//       ⇒ 服务端必须校验拥有；回包 m_change_avatar_border_toc{id} → Tips"头像框切换成功"
//       + GlobalData.updateRoleHead(id)（borderID 落客户端）。
//     - m_check_avatar_border_tos：打开面板即发；**协议表里没有对应 toc**（alias 只有 tos=720）
//       ⇒ 官方语义=清"新"角标，服务端转已查看后回 common_reply 复位 1s 等待（D2），别发明 toc。
//     - m_activate_avatar_border_toc{id}：**纯推送**（无 tos）——获得新框时推，客户端
//       activeNewHead 置 ownState=1/newState=1（发放当场可见，不等重登）。
//   链B 头像（RoleIDCardPanel"头像"按钮 → m_check_head_tos）：
//     - m_check_head_toc{heads:[p_head{id,unlock,currency,price}], faces:[p_kvi]}：
//       heads 按 id 对入 CfgRole.head（1~5，特殊头像 hand1~hand5）后再全量插入列表，
//       unlock=(unlock==1)、currency 9999=金币/9998=水晶（购买按钮开关）；faces 按
//       faceGroup.groupID 匹配、isNew=(val~=1)（与链A val 语义**相反**）。
//       ⚠️ 处理器第一行就 ServantMgr.getServant(RoleMgr.helper).color——helper=0（引导档
//       0 誓灵）时收到任何回包都客户端 nil 崩 ⇒ **无誓灵时本协议只回 common_reply**（D1 防崩）。
//     - m_change_head_tos{id,opt}：opt=1 表情(id=faceGroupID)/2 特殊头像(id=1~5)/3 化身(id=0)；
//       回包原样回显 {id,opt}，客户端写 GlobalData.headID/faceGroupID/useType 并弹
//       "已成功切换头像"。仅已解锁条目会发到这（未解锁走商店面板）。
//     - m_buy_head_tos{id} → m_buy_head_toc{id} 本地解锁（updateHeadsListLock，仅非表情）。
//     - m_buy_servant_face_tos / m_check_servant_face_tos：**本版不实现**（faces 恒 []，见下），
//       兜底 common_reply 与修复前行为一致，无回归。
//
// 本地服口径（二百九十七·同日拍板，可一处翻转）：
//   - 头像框：**36 框全量默认下发（已查看态），无任何限制**——佩戴/切换/重复获得折 3000
//     金币（CfgItems.desc 明文）全部照旧；borders 拥有校验保留为非法 id 防线（合法框全在
//     种子里，永远不会拒）。历史口径"获得解锁"见 git（要翻回改 stOf 种子一行）。
//   - 特殊头像 1~5：默认全解锁（无任何获取源，同场景主题"全量默认解锁"先例）；如要改回
//     锁定+购买，翻转 seedAvatarState 的 heads 种子即可，buy_head 已实现免费解锁兜底。
//   - faces 恒 []：本版客户端已把表情子页剪掉（RoleHeadPanel spFace 恒 false、listFaces 从不
//     填充；RoleFaceItem 引用的 m_change_servant_face_tos 协议在 Proto/ProtoAlias 里根本不存在），
//     表情条目保持锁定态与修复前一致，零回归。faces 的解锁态需要 CfgServant 表情分组数据，
//     留待表情系统立项时一并做。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log } = L;
const HD = require('../data/head_data');

// ---- 状态（freshState 置 null → 这里惰性补默认 → state.js 载入归一）----
// borders: {frameId: val}（val=1 新获得 / 0 已查看，即客户端 wire 值，语义见文件头）
// heads:   {headId: 1}（拥有即解锁；特殊头像无 val 语义）
// use:     {border, head, face, useType}——登录 attr (avatar_border/head/servant_face/use_avatar) 的唯一来源
function stOf() {
  if (!S.headState || typeof S.headState !== 'object') S.headState = {};
  const st = S.headState;
  if (!st.borders || typeof st.borders !== 'object' || Array.isArray(st.borders)) st.borders = {};
  if (!st.heads || typeof st.heads !== 'object' || Array.isArray(st.heads)) st.heads = {};
  if (!st.use || typeof st.use !== 'object') st.use = {};
  // 出包口径（二百九十七·同日拍板）：**36 框全量默认下发，无任何限制**——全按已查看态
  // 种子（不亮"新"角标），佩戴不再有解锁门槛；奖励表里的 41000xxx 道具发放自然全部走
  // "重复→折 3000 金币"路径（desc 明文），奖励仍有价值。要改回"获得解锁"口径：把本段
  // 种子改回仅 DEFAULT_FRAME 即可，其余逻辑（change 校验/重复折币/activate 推送）零改动。
  for (const id of HD.FRAME_IDS) if (st.borders[id] === undefined) st.borders[id] = 0;
  for (const id of Object.keys(st.borders)) if (!HD.isFrameItem(id)) delete st.borders[id];
  for (const id of HD.HEAD_IDS) if (st.heads[id] === undefined) st.heads[id] = 1; // 默认全解锁
  for (const k of ['border', 'head', 'face', 'useType']) {
    const v = Math.floor(Number(st.use[k]) || 0);
    st.use[k] = v;
  }
  // ⚠️ 佩戴态自愈判"拥有"必须用 === undefined：borders 的 val=0（已查看）是 falsy，
  //    用 !st.borders[id] 会把已查看框误判成未拥有、错误清掉佩戴态（首跑冒烟实锤）。
  if (st.use.border !== 0 && st.borders[st.use.border] === undefined) st.use.border = 0;
  if (st.use.head !== 0 && st.heads[st.use.head] === undefined) st.use.head = 0;
  if (![0, 1, 2, 3].includes(st.use.useType)) st.use.useType = 0;
  return st;
}

// 登录 attr 四字段（lib.buildRoleData 消费；零值 = 客户端原生默认）
function attrHead() {
  const st = stOf();
  return { head: st.use.head, servant_face: st.use.face, avatar_border: st.use.border, use_avatar: st.use.useType };
}

// 佩戴中的框（rank/family/chat 的 p_avatar.border 自视行消费；0=无框）
function equippedBorder() { return stOf().use.border; }

// 自视行 p_avatar 覆盖字段（rank.myAvatar / family.avatarOf(self) / 聊天回显消费）：
// 只覆盖有意义的位——useType=0（原生默认）时仅 border 生效，其余保持调用方原样，避免
// 改变既有显示（此前 rank 自视行恒 use:1/face:1）。边界：佩備态在 stOf 已自愈归零。
function selfAvatarFields() {
  const st = stOf();
  const f = { border: st.use.border || 0 };
  if (st.use.useType === 2) { f.use = 2; f.head = st.use.head; f.face = 0; }
  else if (st.use.useType === 1) { f.use = 1; f.face = st.use.face || 0; }
  else if (st.use.useType === 3) { f.use = 3; }
  return f;
}

// 发放入口（lib.grantGoods 41xxxxxx 分支专用，覆盖全部发放面 + GM m21_goods）：
// 头像框道具（id==框 id）只进解锁账，绝不入包。首获 → 记新(val=1)+推 activate；
// 重复 → 折 3000 金币（CfgItems.desc 明文「重复获得将自动转化为3000金币」；silver 即金币）。
function grantFrame(conn, typeId, num) {
  const id = Number(typeId);
  if (!HD.isFrameItem(id)) return 0;
  const n = Math.max(1, Math.floor(Number(num) || 1));
  const st = stOf();
  if (st.borders[id] === undefined) {
    st.borders[id] = 1; // 新获得（亮"新"角标，开面板/重登后转已查看）
    saveState();
    if (conn) pushActivate(conn, id);
    log(`[avatar] 头像框 ${id}(${HD.frameName(id)}) ×${n} → 解锁（新获得${conn ? '，已推 activate' : '，无连接不推'}）`);
  } else {
    S.roleAsset.silver += 3000 * n;
    saveState();
    if (conn) L.pushAssetChange(conn);
    log(`[avatar] 头像框 ${id}(${HD.frameName(id)}) 重复获得 ×${n} → 折 ${3000 * n} 金币`);
  }
  return n;
}

// 新框解锁推送（纯推送，无 tos）：客户端 activeNewHead 置 ownState=1/newState=1
function pushActivate(conn, id) {
  if (!conn || !conn.sendToc) return;
  conn.sendToc('m_activate_avatar_border_toc', { id: Number(id) });
}

const handlers = {
  // 链A：登录 ENTER_GAME（RoleModule.onEnterGame）必发；打开头像框面板也依赖本包先到。
  // 只发已拥有的框（未拥有发了会被客户端 copy 成 ownState=1 = 白送）。
  m_avatar_border_detail_tos(conn) {
    const st = stOf();
    const borders = Object.keys(st.borders)
      .map(id => ({ id: Number(id), val: Math.floor(Number(st.borders[id]) || 0) }))
      .sort((a, b) => a.id - b.id);
    conn.sendToc('m_avatar_border_detail_toc', { borders });
  },

  // 佩戴头像框。客户端列表对锁定行也发 change ⇒ 必须校验拥有（防白嫖）；id=0 = 卸下（容错）。
  m_change_avatar_border_tos(conn, obj) {
    const st = stOf();
    const id = Math.floor(Number(obj && obj.id) || 0);
    if (id !== 0 && st.borders[id] === undefined) {
      log(`[avatar] 佩戴被拒：头像框 ${id} 未拥有`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    st.use.border = id;
    saveState();
    conn.sendToc('m_change_avatar_border_toc', { id });
    log(`[avatar] 佩戴头像框 → ${id}${id ? `(${HD.frameName(id)})` : '（卸下）'}`);
  },

  // 打开头像框面板即发（无 toc 的单向协议）：全部转已查看（val 1→0），回 common_reply 复位等待。
  m_check_avatar_border_tos(conn) {
    const st = stOf();
    let n = 0;
    for (const id of Object.keys(st.borders)) {
      if (Number(st.borders[id]) === 1) { st.borders[id] = 0; n++; }
    }
    if (n) saveState();
    conn.sendToc('m_common_reply_toc', { proto_id: 0 });
    if (n) log(`[avatar] 头像框查看已确认：${n} 个新框转已查看`);
  },

  // 链B：名片"头像"按钮。⚠️ 无誓灵（helper=0）时客户端 updateHeadsList 对任何回包都 nil 崩
  // （getServant(0)=nil → .color）——只回 common_reply 让按钮静默（D1 防崩，见文件头契约）。
  m_check_head_tos(conn) {
    if (!S.servants || S.servants.length === 0) {
      log('[avatar] check_head 被拒：无看板娘（0 誓灵），回 common_reply 防客户端崩');
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    const st = stOf();
    const heads = HD.HEAD_IDS.map(id => ({
      id,
      unlock: st.heads[id] ? 1 : 0,
      currency: 0, // 0=无购买按钮（本地服特殊头像默认全解锁，购买链路用不到）
      price: 0,
    }));
    conn.sendToc('m_check_head_toc', { heads, faces: [] }); // faces=[]：表情子页本版已被客户端剪掉
  },

  // 换头像（opt：1=表情 / 2=特殊头像 / 3=化身）。客户端只认原样回显后本地写 GlobalData。
  m_change_head_tos(conn, obj) {
    const st = stOf();
    const id = Math.floor(Number(obj && obj.id) || 0);
    const opt = Math.floor(Number(obj && obj.opt) || 0);
    if (opt === 1) {
      if (id !== 0) { log(`[avatar] 换表情被拒：faces 未实装（id=${id}）`); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
      st.use.face = 0;
    } else if (opt === 2) {
      if (!HD.isHeadId(id) || !st.heads[id]) { log(`[avatar] 换头像被拒：特殊头像 ${id} 未拥有`); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
      st.use.head = id;
    } else if (opt === 3) {
      if (id !== 0) { log(`[avatar] 换化身被拒：id 必须 0（收到 ${id}）`); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
    } else {
      log(`[avatar] 换头像被拒：未知 opt=${opt}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    st.use.useType = opt;
    saveState();
    conn.sendToc('m_change_head_toc', { id, opt });
    const what = opt === 1 ? '默认表情' : opt === 2 ? `特殊头像 ${id}(${HD.HEAD_NAMES[id]})` : '御灵士化身';
    log(`[avatar] 换头像 → ${what}（useType=${opt}）`);
  },

  // 购买特殊头像（当前默认全解锁 ⇒ 客户端不可达；保险起见实现为免费解锁，策略翻转后仍可用）
  m_buy_head_tos(conn, obj) {
    const st = stOf();
    const id = Math.floor(Number(obj && obj.id) || 0);
    if (!HD.isHeadId(id)) {
      log(`[avatar] 购买被拒：未知特殊头像 id=${id}`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    const first = st.heads[id] ? 0 : 1;
    st.heads[id] = 1;
    saveState();
    conn.sendToc('m_buy_head_toc', { id });
    log(`[avatar] 特殊头像 ${id}(${HD.HEAD_NAMES[id]}) ${first ? '免费解锁（本地服口径）' : '重复购买幂等'}`);
  },
};

module.exports = { handlers, grantFrame, attrHead, equippedBorder, selfAvatarFields, pushActivate, stOf };
