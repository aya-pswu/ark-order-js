// 贴纸涂鸦板（个人主页 RoleArtworkView，二百八十，2026-10-31）。
//
// 用户反馈：道具贴纸这一类使用不了——获得后只能放在背包，没有任何反应；
// 正常应能自由粘贴在个人主页。
//
// 根因（三层叠满，与二百七十八死箱同族）：
//   ① 贴纸素材（CfgItems 26100001~118，form=2 + link=0 只有展示壳）被任何发放路径
//      （关卡掉落 others 池 / 唤灵殿堂 7003 赫拉 / 活动积分榜 / GM）直接塞进背包
//      ⇒ 客户端材料页里点不开的死道具（canUse=link~=0=false，「使用」按钮恒关闭）；
//   ② 贴纸道具（21500xxx，30 个，CfgItems.data 产出全是 261 段素材）走 vit.js 通用
//      使用产出 ⇒ 又把 261xxx 发进背包（更多死道具）；
//   ③ 涂鸦板四协议（m_artwork_info / m_graffiti_material / m_place_artwork_material /
//      m_unlock_artwork_page）服务端 0 实现 ⇒ 就算素材到账也没有粘贴入口
//      （兜底 size=0 ⇒ 编辑模式点任何素材弹「贴纸数已达上限」）。
//
// 修法：素材库存收口在 grantGoods（261 分支 → 本模块 grantMat，一处覆盖全部发放面）；
//       贴纸道具使用走 vit 通用产出自然命中该分支（零专用表）；四协议按客户端
//       RoleArtworkView / RoleMgr / RoleModule 反编译契约实现。
//
// ⚠️ 键语义（二百八十真机事故，2026-10-31 晚定型）：**协议里的 id / material_id 是
//    typeID（1~118），不是 itemType（261xxxxx）**——
//    客户端 `RoleConfig.getArtwork(slot0)` 直查 `artwork.materials[slot0]`（原始数组下标，
//    initConfig = ConfigMgr.getConfig 直通无键化），且客户端自己 onMatSelect 传
//    `slot2.typeID`、`getChangeToServer` 发 `material_id = slot0.typeID`。
//    服务端发 261xxxxx 的实测后果：客户端逐条刷「涂鸦前端配置不存在，涂鸦typeID=26100018」
//    → getArtwork 返回 nil → VO 无 itemType → ItemConfig concat nil（真机 19:58 报错）。
//    261xxxxx 只是 CfgItems 道具形态（发放入口），进协议前 ART.typeIdOf() 转换。
//
// 客户端契约（bc 反编译实证）：
//   - m_artwork_info_toc{to_role, paint:[p_artwork{page, list:[p_place_material]}], size}：
//     客户端 `RoleMgr.openPage = max(1, #paint)` ⇒ **paint 必须每解锁页一条（含空页）**；
//     size = 每页贴纸上限（CfgRole.artwork.maxNum=30）。打开个人主页即发 tos（page=0）。
//   - m_graffiti_material_toc{list:[p_kvt{id, val, type}]}：RoleArtworkMatVO 里
//     **remainNum = type、totalNum = val**（字段名错位，别按直觉发）。进编辑模式即发 tos。
//   - m_place_artwork_material_tos{page, opts}：opts 每项 {id, material_id, transform, tier}；
//     **id<0 = 删除**（客户端 getChangeToServer 对 isDel 发 -id）、id=0 = 新增、id>0 = 移动/旋转。
//     transform 是客户端 BitUtil 位包（x:1-12, y:13-24, flip:25, angleIndex-1:26-32），服务端透传。
//     回包 m_place_artwork_material_toc{page, updates, deletes}：updates 带服务端分配的真实 id
//     （新放置 VO 由客户端按 material_id 重建），deletes 是**正 id** 数组。
//   - m_unlock_artwork_page_toc{sum_page}：开新页成本 OPEN_PAGE_COST[新页号]（第 2 页 50、
//     第 3 页 100 水晶），客户端不校验只展示 ⇒ 服务端自校验（扣费口径 D24②：判 gold+gold_given、
//     先扣赠送）。
//
// 记账口径（D20 教训：客户端本地计数只增不减，服务端必须单一真相源）：
//   素材 remain **不落盘**，由 mats[total] − 各页已放置数推导——使用 +total、放置 −、删除 +，
//   全部自动对账，永不漂移。mats 键与 placements.mat 统一存 **typeID**。放置上限（30/页）、
//   素材归属、页号合法性服务端全镜像。
const { S, saveState } = require('../state');
const L = require('../lib');
const { log } = L;
const ART = require('../data/artwork_data');

// ---- 状态（三步走：freshState 置 null → 这里惰性补默认 → state.js 载入归一）----
function stOf() {
  if (!S.artworkState || typeof S.artworkState !== 'object') S.artworkState = {};
  const st = S.artworkState;
  st.openPage = Math.min(ART.MAX_PAGE_NUM, Math.max(1, Math.floor(Number(st.openPage) || 1)));
  if (!st.pages || typeof st.pages !== 'object' || Array.isArray(st.pages)) st.pages = {};
  if (!st.mats || typeof st.mats !== 'object' || Array.isArray(st.mats)) st.mats = {};
  if (!Number.isInteger(st.nextId) || st.nextId < 1) st.nextId = 1;
  return st;
}

// 某素材的剩余可用数 = 累计获得 − 各页已放置（放置中的贴纸删掉即自动退回）；键=typeID
function remainOf(st, typeId) {
  let placed = 0;
  for (const k of Object.keys(st.pages)) {
    for (const pl of (st.pages[k] || [])) if (Number(pl.mat) === Number(typeId)) placed++;
  }
  return Math.max(0, (Number(st.mats[typeId]) || 0) - placed);
}

// 发放入口（lib.grantGoods 261 分支专用，覆盖全部发放面）：素材只进涂鸦库存，绝不入包。
// 入参是 **261xxxxx 道具形态**（CfgItems.data 产出/奖励表原样），内部转 typeID 入账。
function grantMat(matItemOrTypeId, num) {
  const tid = ART.typeIdOf(matItemOrTypeId);
  if (!tid) return 0;
  const n = Math.max(1, Math.floor(Number(num) || 1));
  const st = stOf();
  st.mats[tid] = (Number(st.mats[tid]) || 0) + n;
  saveState();
  const cfg = ART.matOf(tid) || {};
  log(`[artwork] 贴纸素材 typeID=${tid}(${cfg.name || '?'}, 道具形态 ${Number(matItemOrTypeId) === tid ? tid : cfg.id}) ×${n} → 涂鸦库存（累计 ${st.mats[tid]}）`);
  return n;
}

const handlers = {
  // 个人主页打开即拉（RoleInformationPanel / OtherRolePanel，page 恒 0）：回全部已解锁页
  m_artwork_info_tos(conn, obj) {
    const st = stOf();
    const paint = [];
    for (let p = 1; p <= st.openPage; p++) {
      const arr = st.pages[p] || [];
      paint.push({
        page: p,
        list: arr.map(pl => ({ id: pl.id, material_id: pl.mat, transform: pl.transform, tier: pl.tier })),
      });
    }
    conn.sendToc('m_artwork_info_toc', {
      to_role: (obj && obj.to_role) || L.roleId,
      paint,
      size: ART.MAX_NUM,
    });
  },

  // 进编辑模式即拉：只发累计 >0 的素材（remain 推导，含已全部贴完的条目=置灰）。id=typeID
  m_graffiti_material_tos(conn) {
    const st = stOf();
    const list = Object.keys(st.mats)
      .map(id => ({ id: Number(id), val: Number(st.mats[id]) || 0, type: remainOf(st, Number(id)) }))
      .filter(e => e.val > 0)
      .sort((a, b) => a.id - b.id);
    conn.sendToc('m_graffiti_material_toc', { list });
  },

  // 保存摆放（编辑页「保存」/退出确认）：新增 / 移动旋转 / 删除三态合一。material_id=typeID
  m_place_artwork_material_tos(conn, obj) {
    const st = stOf();
    const page = Math.floor(Number(obj && obj.page) || 0);
    if (page < 1 || page > st.openPage) {
      log(`[artwork] 摆放被拒：page=${page} 超出已解锁页（openPage=${st.openPage}）`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    const updates = [], deletes = [];
    for (const o of ((obj && obj.opts) || [])) {
      const id = Math.floor(Number(o && o.id) || 0);
      const mat = ART.typeIdOf(o && o.material_id); // 容错：客户端正常发 typeID，261 形态也转
      const transform = Math.floor(Number(o && o.transform) || 0);
      const tier = Math.floor(Number(o && o.tier) || 0);
      if (id < 0) {
        // 删除（客户端发 -id）：全页查找（客户端只在当前页编辑，跨页删除视为容错）
        const target = -id;
        let hit = null;
        for (const k of Object.keys(st.pages)) {
          const arr = st.pages[k] || [];
          const i = arr.findIndex(x => Number(x.id) === target);
          if (i >= 0) { hit = arr.splice(i, 1)[0]; break; }
        }
        if (hit) deletes.push(target);
        else log(`[artwork] 删除跳过：id=${target} 不在任何页`);
        continue;
      }
      if (!ART.isArtworkMatTypeId(mat)) { log(`[artwork] 摆放跳过：未知素材 typeID=${o && o.material_id}`); continue; }
      if (id === 0) {
        // 新增：镜像客户端两道门（素材剩余 >0 / 每页 ≤ maxNum），改包绕过时服务端兜住
        const arr = st.pages[page] || (st.pages[page] = []);
        if (arr.length >= ART.MAX_NUM) { log(`[artwork] 新增跳过：第 ${page} 页已满 ${ART.MAX_NUM}`); continue; }
        if (remainOf(st, mat) <= 0) { log(`[artwork] 新增跳过：素材 ${mat} 剩余不足`); continue; }
        const nid = st.nextId++;
        arr.push({ id: nid, mat, transform, tier });
        updates.push({ id: nid, material_id: mat, transform, tier });
      } else {
        // 移动/旋转：不校验素材归属（id 已绑定素材），更新 transform/tier
        let hit = null;
        for (const k of Object.keys(st.pages)) {
          const f = (st.pages[k] || []).find(x => Number(x.id) === id);
          if (f) { hit = f; break; }
        }
        if (!hit) { log(`[artwork] 更新跳过：id=${id} 不存在`); continue; }
        hit.transform = transform;
        hit.tier = tier;
        updates.push({ id, material_id: hit.mat, transform, tier });
      }
    }
    saveState();
    conn.sendToc('m_place_artwork_material_toc', { page, updates, deletes });
    log(`[artwork] 保存第 ${page} 页：新增/更新 ${updates.length}，删除 ${deletes.length}`
      + (updates.length ? `（新 id ${updates.map(u => u.id).join(',')}）` : ''));
  },

  // 开新页（涂鸦板点未解锁页签 → 确认）：成本按新页号取 OPEN_PAGE_COST
  m_unlock_artwork_page_tos(conn) {
    const st = stOf();
    const next = st.openPage + 1;
    if (next > ART.MAX_PAGE_NUM) {
      log(`[artwork] 开页被拒：已达上限 ${ART.MAX_PAGE_NUM} 页`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    const cost = ART.OPEN_PAGE_COST[next - 1] || 0;
    if (S.roleAsset.gold + S.roleAsset.gold_given < cost) {
      log(`[artwork] 开页被拒：水晶不足（需 ${cost}，持有 ${S.roleAsset.gold + S.roleAsset.gold_given}）`);
      conn.sendToc('m_common_reply_toc', { proto_id: 0 });
      return;
    }
    let rest = cost;
    const useGiven = Math.min(S.roleAsset.gold_given, rest);
    S.roleAsset.gold_given -= useGiven; rest -= useGiven;
    S.roleAsset.gold -= rest;
    st.openPage = next;
    saveState();
    if (cost > 0) L.pushAssetChange(conn);
    conn.sendToc('m_unlock_artwork_page_toc', { sum_page: next });
    log(`[artwork] 开启第 ${next} 页（水晶 -${cost}）→ sum_page=${next}`);
  },
};

module.exports = { handlers, grantMat, remainOf, stOf };
