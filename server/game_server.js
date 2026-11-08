// 方舟指令 TCP 游戏服：TGW 握手 + 帧协议 + XOR 解密 + 消息分发
const net = require('net');
const zlib = require('zlib');
const { encodeToc, decodeTos } = require('./etf');
const NET = require('./net_check');

// 包级噪声开关：默认只打「收到/发送」一行（hex 截断 + 暗色），
// ARK_VERBOSE=1 时补打原始帧全量 hex 与每秒心跳（排查协议问题时再开）。
const VERBOSE = !!process.env.ARK_VERBOSE && String(process.env.ARK_VERBOSE) !== '0';
const HEX_MAX = VERBOSE ? 64 : 24; // 默认只留前 12 字节，够认包型就行

// ---- C# NetSocket.CalculateInterval 的逆运算 ----
function calcInterval(seq) {
  if (seq % 10 === 0) return 3;
  if (seq % 9 === 0) return 7;
  if (seq % 8 === 0) return 6;
  if (seq % 7 === 0) return 2;
  if (seq % 6 === 0) return 5;
  if (seq % 5 === 0) return 6;
  if (seq % 4 === 0) return 3;
  if (seq % 3 === 0) return 7;
  if (seq % 2 === 0) return 4;
  return 2;
}

function decryptXor(payload, seq) {
  const b = calcInterval(seq);
  let b2 = (b ^ 0xab) & 0xff;
  const out = Buffer.from(payload);
  for (let i = 0; i < out.length; i++) {
    if (i % b === 0) {
      out[i] = (b2 ^ out[i]) & 0xff;
      b2 = (b ^ ((b2 + i) & 0xff)) & 0xff;
    }
  }
  return out;
}

// 服务端 -> 客户端帧: [int32 长度(含compress字节)][compress][payload]
function frame(payload, compress) {
  const head = Buffer.alloc(5);
  head.writeInt32BE(payload.length + 1, 0);
  head.writeUInt8(compress, 4);
  return Buffer.concat([head, payload]);
}

function hbFrame() {
  const b = Buffer.alloc(9);
  b.writeInt32BE(5, 0);
  b.writeUInt8(0xff, 4);
  b.writeUInt32BE(Math.floor(Date.now() / 1000), 5);
  return b;
}

// ---------------------------------------------------------------- 事件循环停顿探测（二百二十一）
// 起因：客户端 13 秒弹「服务端未响应」（3 秒无任何 toc → 面板 → 面板再等 10 秒）。
// 单机服是回环 TCP，客户端那侧唯一的证据就是"没收到字节"；而 server/ 全库没有任何
// 周期推送 ⇒「服务端被同步 IO 按住」和「报文根本没进 node」在客户端日志里完全同形。
//
// 这里用 250ms 一次的递归 setTimeout 记「期望触发时刻 vs 实际触发时刻」：阻塞期间定时器
// 不可能触发，恢复后立刻补触发 ⇒ 差值就是停顿时长。
// 采样间隔取 250ms 而不是 1s：间隔 = 最大漏报窗口。1s 采样下，"刚好在一次 tick 之后开始
// 的 1.3s 阻塞"只会测出 300ms（实测踩过）⇒ 必须让 tick 远小于要抓的停顿。
//   · 有 [stall] ⇒ A 类：同步 IO（saveState 全同步写盘 / log 每行 appendFileSync）按住事件循环
//   · 无 [stall] 而客户端仍弹面板 ⇒ B 类：报文没到服务端（或死在解码层，见 [no-reply]）
const STALL_MIN_MS = Number(process.env.ARK_STALL_MS) || 500;
const STALL_TICK_MS = 250;
let stallTimer = null;
let stallExpect = 0;

function startStallWatch(log) {
  if (stallTimer || !log) return null;
  const warn = (typeof log.warn === 'function')
    ? m => log.warn(m)
    : (typeof log === 'function' ? m => log(m) : () => {});
  stallExpect = Date.now() + STALL_TICK_MS;
  const tick = () => {
    const now = Date.now();
    const late = now - stallExpect;
    if (late >= STALL_MIN_MS) {
      warn(`[stall] 事件循环停顿 ${late}ms —— 期间收发全停（客户端此刻会弹「服务端未响应」）。`
        + '同一次故障里若客户端也弹了面板，根因就是同步 IO（写盘/日志），不是网络');
    }
    stallExpect = now + STALL_TICK_MS;
    stallTimer = setTimeout(tick, STALL_TICK_MS);
    if (stallTimer && typeof stallTimer.unref === 'function') stallTimer.unref();
  };
  stallTimer = setTimeout(tick, STALL_TICK_MS);
  if (stallTimer && typeof stallTimer.unref === 'function') stallTimer.unref();
  return stallTimer;
}

function stopStallWatch() {
  if (stallTimer) clearTimeout(stallTimer);
  stallTimer = null;
  stallExpect = 0;
}

class GameConnection {
  constructor(sock, ctx) {
    this.sock = sock;
    this.ctx = ctx; // { protos, alias, byId, handlers, log }
    this.buf = Buffer.alloc(0);
    this.handshakeDone = false;
    this.seq = 0;
    this.remote = sock.remoteAddress;
    // Jint 编码 162 项皮肤商店在 ARM 上很贵，但同一连接翻页会重复请求
    // 完全相同的帧。只缓存明确可失效的 shop2 响应，购买时由 handler 清掉。
    this._tocCache = Object.create(null);
    // 出站计数：只为 [no-reply] 探测服务（判断"这条 tos 处理完 2 秒内有没有任何出站"）
    this._out = 0;
  }

  log(...a) { this.ctx.log(`[${this.remote}]`, ...a); }

  // 收发包：统一走 PKT 等级（暗青色），方向箭头 + 协议名 + 尺寸 + 截断 hex
  pkt(dir, name, size, extra) {
    const parts = [`${dir} ${name}`];
    if (size != null) parts.push(`${size}B`);
    if (extra) parts.push(extra);
    this.ctx.log.pkt(`[${this.remote}]`, parts.join(' '));
  }

  invalidateTocCache(key) {
    if (key) delete this._tocCache[key];
    else this._tocCache = Object.create(null);
  }

  sendToc(name, obj) {
    try {
      let cacheKey = null;
      if (name === 'm_shop_detail_toc' && obj && obj.details && obj.details.length === 1 &&
          obj.details[0] && obj.details[0].shop_goods && obj.details[0].shop_goods.length > 100) {
        cacheKey = 'shop2';
      }
      if (cacheKey && this._tocCache[cacheKey]) {
        const cached = this._tocCache[cacheKey];
        this.sock.write(cached);
        this._out++;
        const hex = cached.slice(0, HEX_MAX).toString('hex');
        const tail = cached.length > HEX_MAX * 2 ? '…' : '';
        this.pkt('=>', name, cached.length, `cache: ${hex}${tail}`);
        return;
      }
      let payload = encodeToc(name, obj, this.ctx.protos, this.ctx.alias);
      let compress = 0;
      // 设备端 zlib.net 是纯托管实现，ARM 上压缩几 KB 的登录包反而会独占
      // Jint 工作线程数秒；本地回环链路不需要为 1~15KB 节省几十字节。
      // 只压缩真正的大型战斗/资源包，避免登录阶段固定掉帧窗口。
      if (payload.length > 16 * 1024) {
        payload = zlib.deflateSync(payload);
        compress = 1;
      }
      const buf = frame(payload, compress);
      if (cacheKey) this._tocCache[cacheKey] = buf;
      this.sock.write(buf);
      this._out++;
      const hex = buf.slice(0, HEX_MAX).toString('hex');
      const tail = buf.length > HEX_MAX * 2 ? '…' : '';
      this.pkt('=>', name, buf.length, `hex: ${hex}${tail}`);
    } catch (e) {
      this.log('!! 编码失败', name, e.message);
      // 编码失败 = 客户端永远等不到这条包（3 秒后弹「服务端未响应」）。
      // 兜底回一条通用应答把计时器打掉，避免"服务端明明活着却让玩家看到未响应"。
      if (name !== 'm_common_reply_toc') {
        try { this.sendToc('m_common_reply_toc', { proto_id: 0 }); } catch (e2) { /* 忽略 */ }
      }
    }
  }

  // 发送原始载荷探针帧（可指定 compress）
  probe(payload, compress) {
    this.sock.write(frame(payload, compress === undefined ? 0 : compress));
    this.log('=> 探针帧 comp=' + (compress === undefined ? 0 : compress), payload.toString('hex'));
  }

  onData(data) {
    this.buf = Buffer.concat([this.buf, data]);
    if (!this.handshakeDone) {
      // TGW 握手检测（可能不存在）
      const idx = this.buf.indexOf('\r\n\r\n');
      if (this.buf.slice(0, 20).toString('latin1').startsWith('tgw')) {
        if (idx === -1) return; // 等待握手完成
        if (VERBOSE) this.log('<= TGW 握手', JSON.stringify(this.buf.slice(0, idx + 4).toString('latin1')));
        this.buf = this.buf.slice(idx + 4);
        this.handshakeDone = true;
      } else {
        this.handshakeDone = true;
      }
    }
    this.processFrames();
  }

  processFrames() {
    // 一次 TCP read 里经常同时带着登录后的 8 个背包请求和签到/商店请求。
    // ARM/Jint 编码背包响应会阻塞数秒；先把轻量、用户可见的交互请求解码出来，
    // 再按优先级分发，避免签到结果和商店点击被排在批量背包后面。
    const pending = [];
    while (this.buf.length >= 5) {
      const len = this.buf.readInt32BE(0);
      if (len < 0 || len > 10 * 1024 * 1024) { this.log('!! 帧长度异常', len, '断开'); this.sock.destroy(); return; }
      if (this.buf.length < 4 + len) break; // 不完整，保留到下一次 data
      const isZlib = this.buf.readUInt8(4);
      let body = this.buf.slice(5, 4 + len);
      this.buf = this.buf.slice(4 + len);

      if (isZlib === 0xff) {
        // 客户端心跳（body 为空）；科研到点自动结算挂在这里（≈1s 时延，到点即弹结算面板）
        if (this.ctx.onHeartbeat) {
          try { this.ctx.onHeartbeat(this); } catch (e) { this.log('!! 心跳结算失败', e.message); }
        }
        if (VERBOSE) this.ctx.log.pkt(`[${this.remote}] <= 心跳`);
        this.sock.write(hbFrame());
        continue;
      }
      // 原始帧：与紧随其后的「收到 xxx_tos」重复，默认不打；排查粘包/解压问题时开 ARK_VERBOSE=1
      if (VERBOSE) {
        this.log('<= 原始帧 len:', len, 'zlib:', isZlib, 'hex:', body.slice(0, HEX_MAX).toString('hex'));
      }
      if (body.length < 4) continue;
      const seq = body.readInt32BE(0);
      let payload = body.slice(4);
      // 尝试解密（isEncrypt 默认 true；未加密帧 seq=0 且 XOR 后 131,104 开头校验失败时回退）
      let plain = decryptXor(payload, seq);
      if (plain.length < 2 || plain[0] !== 131) plain = payload; // 未加密
      if (isZlib === 1 || isZlib === 3 || isZlib === 5) {
        try { plain = zlib.inflateSync(plain); }
        catch (e) {
          this.log('!! 解压失败', e.message);
          this.replySilentPath('解压失败');
          continue;
        }
      }
      let msg = null;
      const decodeStart = Date.now();
      try { msg = decodeTos(plain, this.ctx.protos, this.ctx.alias, this.ctx.byId); }
      catch (e) {
        this.log('!! 解码失败', e.message, plain.slice(0, 32).toString('hex'));
        this.replySilentPath('解码失败');
        continue;
      }
      const decodeMs = Date.now() - decodeStart;
      if (decodeMs >= 100) this.log(`[perf] incoming decode ${decodeMs}ms len=${plain.length}`);
      if (!msg || !msg.name) {
        this.log('?? 无法识别消息', plain.slice(0, 32).toString('hex'));
        this.replySilentPath('无法识别消息');
        continue;
      }
      pending.push({ msg, seq, order: pending.length });
    }
    if (!pending.length) return;
    const priority = name => {
      switch (name) {
        case 'm_role_sign_tos':
        case 'm_role_sign_info_tos': return 0;
        case 'm_shop_shops_tos':
        case 'm_shop_detail_tos':
        case 'm_servant_list_detail_tos': return 1;
        case 'm_role_acts_tos':
        case 'm_background_use_now_tos': return 2;
        case 'm_goods_bag_info_tos': return 10;
        default: return 5;
      }
    }
    pending.sort((a, b) => priority(a.msg.name) - priority(b.msg.name) || a.order - b.order);
    for (const item of pending) this.handleDecodedMessage(item.msg, item.seq);
  }

  handleMessage(buf, seq) {
    let msg = null;
    try { msg = decodeTos(buf, this.ctx.protos, this.ctx.alias, this.ctx.byId); }
    catch (e) {
      this.log('!! 解码失败', e.message, buf.slice(0, 32).toString('hex'));
      this.replySilentPath('解码失败');
      return;
    }
    if (!msg || !msg.name) {
      this.log('?? 无法识别消息', buf.slice(0, 32).toString('hex'));
      this.replySilentPath('无法识别消息');
      return;
    }
    this.handleDecodedMessage(msg, seq);
  }

  // 静默路径兜底（二百二十一）：解压/解码失败、无处理器这三条以前都是"记日志就 continue"，
  // 客户端拿不到任何 toc ⇒ 3 秒后弹「服务端未响应」，而服务端日志里只有一行轻描淡写的中文。
  // 统一回 m_common_reply_toc{proto_id:0}（D1/D2 的既定口径，客户端静默忽略但会打掉计时器）。
  replySilentPath(reason) {
    try {
      this.sendToc('m_common_reply_toc', { proto_id: 0 });
      this.log(`[no-reply] ${reason} → 已回 m_common_reply_toc 兜底（否则客户端 3 秒后弹「服务端未响应」）`);
    } catch (e) { /* 连兜底都编不出来就只能放弃，别让异常穿透 */ }
  }

  // 无回包兜底（二百二十二）：handler 跑完但**一个出站都没有**时自动补 m_common_reply_toc。
  // 客户端对每条 tos 起 3 秒计时器，收不到任何 toc 就弹「服务端未响应」+ 再等 10 秒。
  // 2026-10-23 真机复现的 `m_summon_touch_pool_tos`（点卡池）就是这种空壳 handler：
  // 只记日志不回包，连点三下必然弹面板（客户端日志实证：23:36:23.335 点击 → 23:36:36.333 弹框）。
  // 这里做成结构性兜底——以后任何新写的空壳 handler 都不会再变成 13 秒卡死，
  // 同时留一条 [no-reply] 日志点名，便于按 D2 补真正的回执。
  ensureReplied(name, outBefore) {
    if (this._out !== outBefore) return false;
    this.replySilentPath(`${name} handler 零出站`);
    return true;
  }

  handleDecodedMessage(msg, seq) {
    // BigInt 安全的 JSON 序列化（long 字段会解成 BigInt）
    let objStr;
    try { objStr = JSON.stringify(msg.obj, (k, v) => typeof v === 'bigint' ? v.toString() : v); }
    catch (e) { objStr = String(msg.obj); }
    const body = objStr && objStr !== '{}' ? ` ${objStr.slice(0, 200)}` : '';
    this.pkt('<=', msg.name + body);
    const handler = this.ctx.handlers[msg.name];
    const outBefore = this._out;
    if (handler) {
      // 2026-09-12 教训：handler 内未捕获异常会直接杀死整个服务进程（act_extra 的 sub() 默认值
      // 笔误在全新存档状态下首次被请求时触发）。统一兜底：handler 异常只记日志不断线。
      const handlerStart = Date.now();
      try {
        handler(this, msg.obj || {});
      } catch (e) {
        this.log('!! handler 异常', msg.name, e.message);
        try { this.sendToc('m_common_reply_toc', { proto_id: 0 }); } catch (e2) { /* 忽略 */ }
      }
      const handlerMs = Date.now() - handlerStart;
      if (handlerMs >= 100) this.log(`[perf] handler ${msg.name} ${handlerMs}ms`);
      this.ensureReplied(msg.name, outBefore);
    } else {
      // 生产环境走不到这里（start.js 的 handlers 是 Proxy，未注册协议由 fallbackHandler 兜底），
      // 但直连 ctx 的探针/冒烟会走到，必须回包。
      this.log('?? 无处理器:', msg.name);
      this.replySilentPath('无处理器');
    }
  }
}

function startGameServer(port, ctx, onReady, onListenError) {
  const server = net.createServer(sock => {
    const addr = sock.remoteAddress;
    const conn = new GameConnection(sock, ctx);
    ctx.log.ok('[net] 新连接', addr);
    sock.on('data', d => conn.onData(d));
    sock.on('error', e => ctx.log.warn('[net] 连接错误', addr, e.message));
    sock.on('close', () => {
      conn.isClosed = true;
      ctx.log.net('[net] 连接关闭', addr);
    });
  });
  // 监听失败（如 9021 被上次没退干净的 start.js 占着）同样走语义化报错，不再裸崩
  NET.listenGuarded(server, port, 'GAME', ctx, onReady, onListenError);
  // 事件循环停顿探测随游戏服一起起（Jint 兜底档也有该文件，setInterval/setTimeout 均在）
  startStallWatch(ctx && ctx.log);
  return server;
}

module.exports = { startGameServer, startStallWatch, stopStallWatch };
