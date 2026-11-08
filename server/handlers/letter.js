// 信件系统（邮件面板全链路）—— 调研-固定邮件两封.md
//
// 客户端契约（LetterModule/LetterPanel/LetterVO bc 反编译实证）：
//   · page：开面板发 (1,8)，滚动按 8 条补页；letterNum 只来自 m_letter_light_toc 推送，
//     同时驱动面板空态（letterNum==0 → 显示"暂无信件"）与分页 ⇒ **登录必须推 light**。
//   · read：schema 标 array、客户端 `slot0.letter.id` 按单对象消费（C1 家族）——回单对象。
//   · accept：「领取附件」发信件 id，「全部领取」发 **id=0**（D12 批量语义：服务端必须整批真发）。
//   · delete：id=0 删全部"已读且未锁定"；toc.num = 剩余总数，客户端直接采用。
//   · 死协议 m_letter_open_tos / m_letter_get_receive_tos：客户端全库 0 调用方、toc 无 handler
//     （D13 意识）——不实现，留给 Proxy 兜底。
// 附件分流：称号盒（form=2 不进背包）→ title.grantTitle 置称号状态；其余走 grantGoods
//   （库函数已兜住 誓灵代币→誓灵 / 圣器 / 核心 / 信仰 / 元素实例 / 普通堆叠）。
// 第②封正文防扫描：存档只落 fixed:2 引用，组包瞬间才从 letter_post.bin 解码（letter_data）。
const { S, saveState } = require('../state');
const { log, grantGoods, pushGoodsUpdate, pushAssetChange } = require('../lib');
const LD = require('../data/letter_data');
const TD = require('../data/title_data');
const TITLE = require('./title');

const HOUR = 3600 * 1000;
const DUE_72H = 72 * HOUR;

function stOf() {
  if (!S.letterState || typeof S.letterState !== 'object') S.letterState = {};
  const st = S.letterState;
  if (!Array.isArray(st.letters)) st.letters = [];
  if (!Number.isInteger(st.nextId) || st.nextId < 1) st.nextId = 1;
  if (!st.createTime) st.createTime = 0;
  // 自愈：二百三十一初版曾把"阅读"误实现为翻状态（官方语义「已读」标记 = 附件已领取），
  // 带附件的信被点开看过就 state=2 → 领取按钮永久"已领取"。把这类脏记录修回未领取；
  // 真领取过的信 claimed=1 不受影响。
  for (const l of st.letters) {
    if (l.state === 2 && !l.claimed && Array.isArray(l.goods) && l.goods.length > 0) {
      l.state = 1;
      log(`[letter] 自愈：信 #${l.id} 曾被误标已读（附件未领取）→ 还原未领取`);
    }
  }
  return st;
}

function sortedLetters() {
  return stOf().letters.slice().sort((a, b) => (b.time - a.time) || (a.id - b.id));
}
const unreadCount = () => stOf().letters.filter(l => l.state === 1).length;

// 组包正文：fixed=2 的公益信只在发送瞬间解码（存档/日志/冒烟全程无明文）
function textFor(rec) {
  if (rec.fixed === 2) return [LD.decodePostText()];
  return Array.isArray(rec.text) ? rec.text : [];
}
function goodsFor(rec) {
  return (rec.claimed || !Array.isArray(rec.goods)) ? [] : rec.goods.map(g => ({ id: Number(g.id), val: Number(g.val) }));
}
function briefOf(rec) {
  return {
    id: rec.id,
    letter_code: LD.CODE_GENERIC,
    title: Array.isArray(rec.title) ? rec.title : [],
    title_num: [],
    send_time: rec.time,
    attachment_num: goodsFor(rec).length,
    goods_list: goodsFor(rec),
    state: rec.state,
    is_lock: rec.lock,
  };
}
function infoOf(rec) {
  return Object.assign(briefOf(rec), {
    send_id: 1,
    sender: [rec.sender || LD.SENDER_FUNKY],
    receiver: S.roleName || '',
    text: textFor(rec),
    text_num: [],
    type: 0,
  });
}

// 投递一封信（GM / 登录判定共用）。满 500 封拒收，返回记录或 null。
function insertLetter({ title, text, sender, goods, fixed = 0 }) {
  const st = stOf();
  if (st.letters.length >= LD.MAX_LETTERS) { log('[letter] 信箱已满 500，拒收新信'); return null; }
  const rec = {
    id: st.nextId++,
    code: LD.CODE_GENERIC,
    state: 1,
    lock: 0,
    claimed: 0,
    time: Math.floor(Date.now() / 1000),
    sender: sender || LD.SENDER_FUNKY,
    title: Array.isArray(title) ? title : [String(title || '')],
    text: Array.isArray(text) ? text : [String(text || '')],
    fixed,
    goods: Array.isArray(goods) ? goods.map(g => ({ id: Number(g.id), val: Number(g.val) })) : [],
  };
  st.letters.push(rec);
  saveState();
  return rec;
}

function pushLight(conn) {
  if (!conn || !conn.sendToc) return;
  conn.sendToc('m_letter_light_toc', { num: unreadCount(), letter_num: stOf().letters.length });
}

// 登录判定：欢迎信（!welcome1Sent 即发——新档首登即中，老档下次登录补收，用户已确认）
// → 老档回填 createTime=now-72h-1min（收公益信）→ 满 72h 投公益信（均恰好一次）
// → 推未读红点 + 佩戴称号。先投欢迎信后投公益信：同秒落箱时 id 升序排序让欢迎信排前面。
function onLogin(conn) {
  const st = stOf();
  const now = Date.now();
  let dirty = false;
  if (!st.createTime) { st.createTime = now - DUE_72H - 60 * 1000; dirty = true; }
  if (!st.welcome1Sent) {
    if (insertLetter(LD.WELCOME)) { st.welcome1Sent = 1; log('[letter] 欢迎信已投递'); }
    dirty = true;
  }
  if (!st.welcome2Sent && now - st.createTime >= DUE_72H) {
    if (insertLetter(LD.POST)) { st.welcome2Sent = 1; log('[letter] 公益声明信已投递（72h）'); }
    dirty = true;
  }
  if (dirty) saveState();
  pushLight(conn);
  try { TITLE.pushTitleInfo(conn); } catch (e) { /* 称号推送失败不阻塞登录链 */ }
}

// 附件发放：称号盒走称号系统（不进背包），其余走 grantGoods。返回 {bagChanged, titleEntries, dup}。
function grantAttachment(conn, goods) {
  const bagChanged = [];
  const titleEntries = [];
  let dup = false;
  for (const g of goods) {
    if (TD.isTitleBox(g.id)) {
      const r = TITLE.grantTitle(g.id);
      if (r) {
        titleEntries.push({ id: TD.titleIdOfBox(g.id), val: r.val });
        if (r.dup) dup = true;
      }
    } else {
      bagChanged.push(...grantGoods(g.id, g.val, conn)); // conn 透传：代币类附件当场宣告
    }
  }
  return { bagChanged, titleEntries, dup };
}

const handlers = {
  m_letter_page_tos(conn, obj) {
    const from = Math.max(1, Number(obj && obj.from) || 1);
    const to = Math.max(from, Number(obj && obj.to) || from);
    const letters = sortedLetters().slice(from - 1, to).map(briefOf);
    conn.sendToc('m_letter_page_toc', { from, to, letters });
  },

  m_letter_read_tos(conn, obj) {
    const id = Number(obj && obj.letter_id);
    const rec = stOf().letters.find(l => l.id === id);
    if (!rec) { log(`[letter] 读取被拒：id=${id} 不存在`); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
    // 官方语义：带未领取附件的信**阅读不翻状态**——「已读/已领取」标记只在领取时置位
    // （LetterSubView 的按钮文案/可用性与 isRead 绑定，翻早了领取按钮就死）；无附件的信
    // 阅读即已读（红点靠紧随其后的 light 绝对值重推收敛）。
    let flipped = false;
    if (rec.state === 1 && goodsFor(rec).length === 0) { rec.state = 2; flipped = true; saveState(); }
    conn.sendToc('m_letter_read_toc', { letter: infoOf(rec) }); // ⚠️ 单对象（C1）
    if (flipped) pushLight(conn);
  },

  m_letter_accept_goods_tos(conn, obj) {
    const id = Number(obj && obj.id);
    const st = stOf();
    let targets;
    if (id === 0) {
      targets = st.letters.filter(l => !l.claimed && Array.isArray(l.goods) && l.goods.length > 0);
    } else {
      const rec = st.letters.find(l => l.id === id);
      if (!rec) { log(`[letter] 领取被拒：id=${id} 不存在`); conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
      targets = rec.claimed ? [] : [rec];
    }
    const ids = [];
    let bagChanged = [], titleEntries = [], dup = false;
    for (const rec of targets) {
      const r = grantAttachment(conn, rec.goods);
      bagChanged = bagChanged.concat(r.bagChanged);
      titleEntries = titleEntries.concat(r.titleEntries);
      dup = dup || r.dup;
      rec.claimed = 1;
      rec.state = 2;      // 领取即已读（客户端 updateAccept 同语义）
      rec.goods = [];     // 清空附件：重登 brief 不再显示"包含 N 个附件"
      ids.push(rec.id);
    }
    if (ids.length) saveState();
    if (bagChanged.length) pushGoodsUpdate(conn, bagChanged, 3);
    if (titleEntries.length) TITLE.pushTitleUpdate(conn, titleEntries);
    if (dup) pushAssetChange(conn); // 重复称号盒折算的 1500 银币
    conn.sendToc('m_letter_accept_goods_toc', { ids });
    if (ids.length) pushLight(conn); // 未读信被顺带领取时同步红点
    log(`[letter] 领取附件：ids=[${ids}] 物品${bagChanged.length}项 称号${titleEntries.length}个`);
  },

  m_letter_delete_tos(conn, obj) {
    const id = Number(obj && obj.id);
    const st = stOf();
    let delIds;
    if (id === 0) {
      delIds = st.letters.filter(l => l.state === 2 && !l.lock).map(l => l.id);
    } else {
      const rec = st.letters.find(l => l.id === id);
      if (!rec || rec.state !== 2 || rec.lock) {
        log(`[letter] 删除被拒：id=${id} 不存在/未读/已锁`);
        conn.sendToc('m_common_reply_toc', { proto_id: 0 });
        return;
      }
      delIds = [rec.id];
    }
    if (delIds.length) {
      const del = new Set(delIds);
      st.letters = st.letters.filter(l => !del.has(l.id));
      saveState();
    }
    conn.sendToc('m_letter_delete_toc', { del_ids: delIds, num: st.letters.length });
    log(`[letter] 删除 ${delIds.length} 封，剩余 ${st.letters.length}`);
  },

  m_letter_lock_tos(conn, obj) {
    const id = Number(obj && obj.id);
    const rec = stOf().letters.find(l => l.id === id);
    if (!rec) { conn.sendToc('m_common_reply_toc', { proto_id: 0 }); return; }
    rec.lock = Number(obj && obj.opt) ? 1 : 0;
    saveState();
    conn.sendToc('m_letter_lock_toc', { id });
  },
};

module.exports = { handlers, onLogin, insertLetter, pushLight, stOf };
