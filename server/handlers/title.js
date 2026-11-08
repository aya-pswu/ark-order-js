// 称号系统（前缀/后缀称号的拥有/激活/佩戴）—— 调研-固定邮件两封.md §3.2
//
// 客户端链路（bc 反编译实证，全部齐备）：个人名片 RoleIDCardPanel → RoleTitleSelectPanel；
// 状态机 RoleConst：0=未拥有 → 1=拥有未激活（点击发 active）→ 2=已激活可佩戴。
// 配置表 server/data/title_data.js（gen_title_data.js 自 CfgRole.roleConfigTitleArr 生成）。
//
// 注意：称号盒（CfgItems 25001001~，form=2）不进背包（ItemConfig.isToBag 只认 form 1/3），
// 邮件领取时由 letter.js 直接调 grantTitle 置状态——所以本模块不需要处理任何道具。
const { S, saveState } = require('../state');
const { log } = require('../lib');
const TD = require('../data/title_data');

function ownedOf() {
  if (!S.titleState || typeof S.titleState !== 'object') S.titleState = {};
  if (!S.titleState.owned || typeof S.titleState.owned !== 'object') S.titleState.owned = {};
  if (!Number.isInteger(S.titleState.usePre)) S.titleState.usePre = 0;
  if (!Number.isInteger(S.titleState.useSuf)) S.titleState.useSuf = 0;
  return S.titleState;
}

// 领取称号盒：未拥有 → 置 1（拥有未激活，玩家在面板里亲手点亮）；已拥有 → 按盒子描述
// 「重复获得将自动转化为1500金币」折算银币。返回 {val, dup}。
function grantTitle(typeId) {
  const st = ownedOf();
  const tid = TD.titleIdOfBox(typeId);
  const cfg = TD.titleOf(tid);
  if (!cfg) { log(`[title] 称号盒 ${typeId} 无对应 titleID，忽略`); return null; }
  if (st.owned[tid]) {
    st.owned[tid] = 2; // 拿到重复盒时把"未激活"的旧账一并补成已激活（对齐官方转化语义）
    S.roleAsset.silver = Number(S.roleAsset.silver || 0) + 1500;
    saveState();
    log(`[title] 称号 ${tid}(${cfg.name}) 重复获得 → 转化 1500 银币`);
    return { val: 2, dup: true };
  }
  st.owned[tid] = 1;
  saveState();
  log(`[title] 称号 ${tid}(${cfg.name}) 已入册（待激活）`);
  return { val: 1, dup: false };
}

// 推送称号入册/佩戴变化（客户端 updateOwnTitles 增量入册 + 刷新面板）
function pushTitleUpdate(conn, entries) {
  if (!conn || !conn.sendToc || !entries || !entries.length) return;
  conn.sendToc('m_role_title_update_toc', { update: entries });
}

// 登录推送：佩戴中的称号（聊天/名片的 getFullTitleName 数据源）
function pushTitleInfo(conn) {
  const st = ownedOf();
  conn.sendToc('m_role_title_info_toc', { use_titles: [st.usePre, st.useSuf].filter(x => x > 0) });
}

function useTitles() {
  const st = ownedOf();
  return [st.usePre, st.useSuf];
}

const handlers = {
  m_role_title_list_tos(conn) {
    const st = ownedOf();
    const list = Object.entries(st.owned).map(([id, val]) => ({ id: Number(id), val }));
    conn.sendToc('m_role_title_list_toc', { title_list: list });
  },

  m_role_title_active_tos(conn, obj) {
    const id = Number(obj && obj.id);
    const st = ownedOf();
    const cfg = TD.titleOf(id);
    if (!cfg || !st.owned[id]) {
      log(`[title] 激活被拒：titleID=${id} 未拥有或不存在`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    if (st.owned[id] === 1) { st.owned[id] = 2; saveState(); }
    // ⚠️ 必须推 update：客户端 m_role_title_active_toc 只弹 toast，**VO 状态只认
    // m_role_title_update_toc（updateOwnTitles → setTitleState）**——不推则条目永远停在
    // 「点击激活」，再点再弹「激活成功」死循环（真机 2026-10-24 实证）。幂等重点击也推，
    // 让已被旧实现卡住的客户端自纠。
    pushTitleUpdate(conn, [{ id, val: st.owned[id] }]);
    conn.sendToc('m_role_title_active_toc', { id }); // 客户端弹「称号激活成功」
  },

  m_role_title_select_tos(conn, obj) {
    const titleId = Number(obj && obj.title_id);
    const op = Number(obj && obj.op_type);
    const st = ownedOf();
    const cfg = TD.titleOf(titleId);
    if (!cfg) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
    if (op === 1) {
      // 佩戴：必须已激活（客户端只对 state=2 开放选择，改包可绕）
      if (st.owned[titleId] !== 2) {
        log(`[title] 佩戴被拒：titleID=${titleId} 未激活`);
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      if (cfg.prefix) st.usePre = titleId; else st.useSuf = titleId;
    } else {
      // 取下：客户端只对当前佩戴位发 op=0，按前/后缀归类清槽
      if (cfg.prefix) { if (st.usePre === titleId) st.usePre = 0; }
      else if (st.useSuf === titleId) st.useSuf = 0;
    }
    saveState();
    conn.sendToc('m_role_title_select_toc', { title_id: titleId, op_type: op, use_titles: useTitles() });
    log(`[title] 佩戴更新：前缀=${st.usePre || '无'} 后缀=${st.useSuf || '无'}`);
  },
};

module.exports = { handlers, grantTitle, pushTitleUpdate, pushTitleInfo, ownedOf, useTitles };
