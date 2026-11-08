// 方舟指令 客户端定制版 Erlang External Term Format 编解码
// 标记: 97=small_int 98=int 100=atom 104=small_tuple 105=large_tuple 106=nil 107=string 108=list 109=binary 110=small_big 111=large_big 131=version

class Reader {
  constructor(buf) { this.buf = buf; this.pos = 0; }
  u8() { return this.buf.readUInt8(this.pos++); }
  i8() { return this.buf.readInt8(this.pos++); }
  u16() { const v = this.buf.readUInt16BE(this.pos); this.pos += 2; return v; }
  i32() { const v = this.buf.readInt32BE(this.pos); this.pos += 4; return v; }
  u32() { const v = this.buf.readUInt32BE(this.pos); this.pos += 4; return v; }
  bytes(n) { const b = this.buf.slice(this.pos, this.pos + n); this.pos += n; return b; }
  utf() { const n = this.u16(); return this.bytes(n).toString('utf8'); }
  get rest() { return this.buf.length - this.pos; }
}

class Writer {
  // 旧实现每写 1 字节就 Buffer.alloc(1)，一个普通背包包会产生数万次
  // CLR/JS 边界调用和小对象分配。PC Node 能扛住，ARM 上的 Jint 会把同一
  // 批登录同步放大到十几秒。使用固定小块并直接写入，保持 ETF 字节流完全一致。
  constructor() { this.list = []; this.cur = []; this.total = 0; }
  ensure(n) {
    if (this.cur.length + n <= 16384) return;
    this.flush();
  }
  flush() { if (this.cur.length) { const b = Buffer.from(this.cur); this.list.push(b); this.cur = []; } }
  byte(b) { this.ensure(1); this.cur.push(b & 0xff); this.total++; return this; }
  u16(v) { this.ensure(2); this.cur.push((v >>> 8) & 0xff, v & 0xff); this.total += 2; return this; }
  i32(v) { this.ensure(4); this.cur.push((v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff); this.total += 4; return this; }
  u32(v) { this.ensure(4); this.cur.push((v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff); this.total += 4; return this; }
  buf(b) {
    if (!b || b.length === 0) return this;
    this.flush();
    this.list.push(b); this.total += b.length;
    return this;
  }
  utf(s) { const b = Buffer.from(String(s), 'utf8'); this.u16(b.length); return this.buf(b); }
  get length() { return this.total; }
  toBuffer() {
    this.flush();
    return Buffer.concat(this.list, this.total);
  }
}

const SMALL_INT = 97, INT = 98, ATOM = 100, SMALL_TUPLE = 104, LARGE_TUPLE = 105, NIL = 106, STRING = 107, LIST = 108, BINARY = 109, SMALL_BIG = 110, LARGE_BIG = 111, VERSION = 131;

// ---------- 解码（客户端发来的 tos，pack 顺序: [131][104|105][arity][alias元素][字段...]） ----------
function decodeTos(buf, protos, aliasByName, byId) {
  const r = new Reader(buf);
  // 容错：寻找开头（正常应是 131 开头）
  if (r.u8() !== VERSION) return null;
  const marker = r.u8();
  if (marker !== SMALL_TUPLE && marker !== LARGE_TUPLE) return null;
  let arity;
  if (marker === SMALL_TUPLE) arity = r.u8();
  else arity = r.i32();
  // alias 元素
  let aliasId = null, name = null;
  const am = r.u8();
  if (am === SMALL_INT) aliasId = r.i8();
  else if (am === INT) aliasId = r.i32();
  else if (am === ATOM) { name = r.utf(); }
  if (aliasId !== null) name = byId[aliasId];
  if (!name || !protos[name]) return { name: name || String(aliasId), arity, obj: null };
  const obj = decodeVo(r, name, protos, byId);
  return { name, arity, obj };
}

function decodeVo(r, name, protos, byId) {
  const schema = protos[name];
  const obj = {};
  if (!schema) return obj;
  for (const [fname, ftype, fsub] of schema.fields) {
    try {
      obj[fname] = decodeValue(r, ftype, fsub, protos, byId);
    } catch (e) {
      obj[fname] = null;
      break; // 流损坏，剩余字段置空
    }
  }
  return obj;
}

function decodeValue(r, ftype, fsub, protos, byId) {
  const marker = r.u8();
  switch (marker) {
    case SMALL_INT: return r.u8();
    case INT: return r.i32();
    case ATOM: {
      const s = r.utf();
      if (s === 'true') return true;
      if (s === 'false') return false;
      if (s === 'undefined') return null;
      return s;
    }
    case STRING: {
      const n = r.u16();
      if (n === 0) return null;
      // String 类型 → 字符串；否则按字节数组
      const b = r.bytes(n);
      if (ftype === 'String' || ftype === 'string') return b.toString('utf8');
      return Array.from(b);
    }
    case NIL:
      if (ftype === 'String' || ftype === 'string') return '';
      return [];
    case LIST: {
      const n = r.u32();
      const arr = [];
      for (let i = 0; i < n; i++) {
        if (fsub && fsub.startsWith('p_')) {
          // pack 嵌套: [104][arity][98][alias int][fields]
          const m2 = r.u8(); // 104
          if (m2 === SMALL_TUPLE || m2 === LARGE_TUPLE) {
            if (m2 === SMALL_TUPLE) r.u8(); else r.i32();
            const am = r.u8();
            let aliasId = null;
            if (am === SMALL_INT) aliasId = r.i8();
            else if (am === INT) aliasId = r.i32();
            arr.push(decodeVo(r, fsub, protos, byId));
          } else {
            arr.push(null);
          }
        } else if (fsub === 'int' || fsub === 'number') {
          const m2 = r.u8();
          arr.push(m2 === SMALL_INT ? r.u8() : r.i32());
        } else if (fsub === 'String' || fsub === 'string') {
          arr.push(decodeValue(r, fsub, null, protos, byId));
        } else if (fsub === 'long') {
          const m2 = r.u8();
          arr.push(decodeLong(r, m2 === LARGE_BIG));
        } else if (fsub === 'binary') {
          // array binary 的"按类型分发"字段（如 m_unmapped_copy_info_toc.spec_data → p_unmap_barrier）：
          // 元素是嵌套 tuple+alias（encodeNested 产物），按头 alias 反查 proto 名解码（同客户端 decodeOther）
          const m2 = r.u8();
          if (m2 === SMALL_TUPLE || m2 === LARGE_TUPLE) {
            if (m2 === SMALL_TUPLE) r.u8(); else r.i32();
            const am = r.u8();
            let aliasId = null;
            if (am === SMALL_INT) aliasId = r.i8();
            else if (am === INT) aliasId = r.i32();
            const name = aliasId != null ? byId[aliasId] : null;
            if (name && protos[name]) arr.push(decodeVo(r, name, protos, byId));
            else arr.push(null);
          } else {
            arr.push(null);
          }
        } else {
          arr.push(decodeValue(r, fsub, null, protos, byId));
        }
      }
      if (r.rest > 0) r.u8(); // 尾部 106
      return arr;
    }
    case SMALL_TUPLE: {
      // 嵌套对象: [arity][98][alias][fields]；fsub 非 p_（binary 按类型分发，如 spec_data）按 alias 反查
      r.u8(); // arity
      const am = r.u8();
      let aliasId = null;
      if (am === SMALL_INT) aliasId = r.i8();
      else if (am === INT) aliasId = r.i32();
      const name1 = (!fsub || !fsub.startsWith('p_')) && aliasId != null && byId[aliasId] ? byId[aliasId] : fsub;
      return decodeVo(r, name1, protos, byId);
    }
    case LARGE_TUPLE: {
      r.i32(); r.u8();
      const am = r.u8();
      let aliasId = null;
      if (am === SMALL_INT) aliasId = r.i8();
      else if (am === INT) aliasId = r.i32();
      const name2 = (!fsub || !fsub.startsWith('p_')) && aliasId != null && byId[aliasId] ? byId[aliasId] : fsub;
      return decodeVo(r, name2, protos, byId);
    }
    case SMALL_BIG: return decodeLong(r, false);
    case LARGE_BIG: return decodeLong(r, true);
    case BINARY: {
      const n = r.u32();
      return r.bytes(n).toString('utf8');
    }
    default:
      return null;
  }
}

function decodeLong(r, large) {
  const count = large ? r.i32() : r.u8();
  const sign = r.u8();
  let v = 0n;
  for (let i = 0; i < count; i++) v |= BigInt(r.u8()) << BigInt(8 * i);
  if (sign === 1) v = -v;
  return v;
}

// ---------- 编码（服务端发 toc，unpackdate 顺序: [131][104][arity][98][alias int][字段...]） ----------
let nativeEtfReady = false;
function encodeToc(name, obj, protos, aliasByName) {
  // 安卓宿主整包在 CLR 中遍历/写字节；PCJS 使用相同语义的 JS 实现。
  if (typeof __psEtf !== 'undefined') {
    if (!nativeEtfReady) { __psEtf.configure(protos, aliasByName); nativeEtfReady = true; }
    return __psEtf.encode(name, obj);
  }
  return encodeTocJs(name, obj, protos, aliasByName);
}

function encodeTocJs(name, obj, protos, aliasByName) {
  const schema = protos[name];
  if (!schema) throw new Error('unknown proto ' + name);
  const w = new Writer();
  // 顶层顺序必须是 [131][104][arity]——客户端 unpackdate 先读 131 再读 104/105（asm 实证）
  w.byte(VERSION).byte(SMALL_TUPLE).byte(schema.fields.length + 1);
  const aliasId = aliasByName[name] || 0;
  w.byte(INT).i32(aliasId);
  encodeFields(w, schema, obj, protos, aliasByName);
  return w.toBuffer();
}

// 嵌套对象: [104][arity][98][alias][fields]
function encodeNested(w, name, obj, protos, aliasByName) {
  const schema = protos[name];
  if (!schema) throw new Error('unknown nested proto ' + name);
  w.byte(SMALL_TUPLE).byte(schema.fields.length + 1);
  w.byte(INT).i32(aliasByName[name] || 0);
  encodeFields(w, schema, obj || {}, protos, aliasByName);
}

function encodeFields(w, schema, obj, protos, aliasByName) {
  for (const [fname, ftype, fsub] of schema.fields) {
    const v = obj ? obj[fname] : undefined;
    encodeField(w, ftype, fsub, v, protos, aliasByName);
  }
}

function encodeField(w, ftype, fsub, v, protos, aliasByName) {
  switch (ftype) {
    case 'int': case 'number': {
      const n = (v === undefined || v === null) ? 0 : Math.trunc(Number(v));
      if (n >= 0 && n <= 255 && (ftype !== 'number')) w.byte(SMALL_INT).byte(n);
      else w.byte(INT).i32(n);
      break;
    }
    case 'String': case 'string': {
      if (v === undefined || v === null || v === '') { w.byte(STRING).u16(0); }
      else w.byte(STRING).utf(v);
      break;
    }
    case 'bool': case 'boolean': {
      w.byte(ATOM).utf(v === true ? 'true' : 'false');
      break;
    }
    case 'long': {
      encodeLong(w, v === undefined || v === null ? 0n : BigInt(v));
      break;
    }
    case 'array': {
      // 客户端 Message.decode 权威行为：空数组/nil 必须编码为 NIL(106)→解成{}；
      // LIST(108) 的 count==0 分支直接 return nil 且不读尾字节（会流错位），绝不能用
      if (v === undefined || v === null) {
        w.byte(NIL);
      } else if (!Array.isArray(v)) {
        // 单个 p_ 对象：官方服务端按嵌套对象(104)发送，客户端直接按字段名访问
        if (v.__nestedProto) {
          // schema 声明为 array binary 的"按类型分发"字段（如 p_ark_event.spec_data）：
          // 客户端 decodeOther 对 104 项按 tuple 头 alias 反查 proto 名解码——
          // 必须显式带 proto 名（__nestedProto 标记，见 handlers/ark.js）
          encodeNested(w, v.__nestedProto, v, protos, aliasByName);
        } else if (fsub && fsub.startsWith('p_')) {
          encodeNested(w, fsub, v, protos, aliasByName);
        } else {
          w.byte(NIL);
        }
      } else if (v.length === 0) {
        w.byte(NIL);
      } else {
        w.byte(LIST).u32(v.length);
        for (const item of v) {
          if (item && item.__nestedProto) {
            // array binary 的"按类型分发"元素（如 m_unmapped_copy_info_toc.spec_data → p_unmap_barrier）：
            // 元素带显式 proto 名（__nestedProto，见 handlers/act_extra.js），按嵌套 tuple+alias 编码
            encodeNested(w, item.__nestedProto, item, protos, aliasByName);
          } else if (fsub && fsub.startsWith('p_')) {
            encodeNested(w, fsub, item, protos, aliasByName);
          } else if (fsub === 'int' || fsub === 'number') {
            const n = Math.trunc(Number(item) || 0);
            // 客户端 LIST 分支：97(SMALL_INT)→读 1 字节；98(INT)→读 4 字节。
            // id 类大数（如 90000004）必须走 98，&0xff 截断会让 getServant 找不到 → nil 崩
            if (n >= 0 && n <= 255) w.byte(SMALL_INT).byte(n);
            else w.byte(INT).i32(n);
          } else if (fsub === 'String' || fsub === 'string') {
            if (item === undefined || item === null || item === '') w.byte(STRING).u16(0);
            else w.byte(STRING).utf(item);
          } else if (fsub === 'long') {
            encodeLong(w, BigInt(item) || 0n);
          } else {
            encodeField(w, fsub || 'int', null, item, protos, aliasByName);
          }
        }
        w.byte(NIL);
      }
      break;
    }
    case 'bytes': {
      const b = Buffer.from(String(v || ''), 'utf8');
      w.byte(BINARY).i32(b.length).buf(b);
      break;
    }
    default: {
      // 嵌套对象类型
      if (ftype && ftype.startsWith('p_')) {
        encodeNested(w, ftype, v || {}, protos, aliasByName);
      } else {
        w.byte(ATOM).utf('undefined');
      }
    }
  }
}

function encodeLong(w, v) {
  // 小值必须发 SMALL_INT/INT（客户端解成 number）：无条件发 bignum(SMALL_BIG) 会解成
  // userdata（LuaJIT int64），m_goods_update_toc 的 p_goods.role_id=0 曾因此触发
  // BitUtil "compare number with userdata" 崩溃。仅超 int32 范围才走 bignum
  if (v >= -2147483648n && v <= 2147483647n) {
    const n = Number(v);
    if (n >= 0 && n <= 255) { w.byte(SMALL_INT).byte(n); return; }
    w.byte(INT).i32(n);
    return;
  }
  const neg = v < 0n;
  let abs = neg ? -v : v;
  const bytes = [];
  while (abs > 0n) { bytes.push(Number(abs & 0xffn)); abs >>= 8n; }
  if (bytes.length <= 255) {
    w.byte(SMALL_BIG).byte(bytes.length).byte(neg ? 1 : 0);
    for (const b of bytes) w.byte(b);
  } else {
    w.byte(LARGE_BIG).i32(bytes.length).byte(neg ? 1 : 0);
    for (const b of bytes) w.byte(b);
  }
}

module.exports = { encodeToc, encodeTocJs, decodeTos, Reader, Writer, VERSION };
