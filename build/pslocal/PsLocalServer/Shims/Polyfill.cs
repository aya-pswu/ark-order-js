// ES2017+ 常用 API 的 JS polyfill（Jint 2.11 为 ES6 基线；server 代码散用 includes/
// entries/padStart 等，启动前统一补齐）。Promise 仅作占位（全库零 async/await）。
namespace PsLocalServer.Shims
{
    public static class Polyfill
    {
        public const string Source = @"
(function(){
  var A = Array.prototype, S = String.prototype, O = Object, N = Number, M = Math;

  if (!O.entries) O.entries = function(o){ var r=[]; for (var k in o) if (O.prototype.hasOwnProperty.call(o,k)) r.push([k,o[k]]); return r; };

  // ---- 本地日期/时间：固定北京时间（UTC+8）纯 JS 实现 ----
  // ★ 2026-09-15 真机教训：Jint 的 Date.prototype.toLocaleDateString 会落到 CLR 的
  //   DateTimeOffset::ToString(format, provider) → mono 需要本地时区 → 设备无 tzdata
  //   且 APK 内无 libMonoPosixHelper.so → P/Invoke 失败，抛 MonoPosixHelper 异常。
  //   真机日志实证：`!! 编码失败 m_role_detail_toc MonoPosixHelper`（每次登录 5 条：
  //   role_detail / servants_brief / act_mission_info / servants_change / servant_type_fame_list），
  //   因为 server JS 在 10+ 处用 `new Date().toLocaleDateString('sv')` 生成日期键
  //   （family / collab / daily_copy / vit / feeling / summon / dare / tower / story_reward …）。
  //   对策：在 JS 层接管这些 toLocale* 方法，全程用 getUTC* 手工算北京时间，
  //   完全不碰 CLR 时区。'sv' 格式恰为 YYYY-MM-DD，正好满足服务端日期键需求。
  // ★★ 2026-09-16 二次教训（PCJS 贯通但单机卡引导的真正根因，改前务必读完）：
  //   下面原本只接管 toLocale*，其余 Date 方法仍走 Jint.DatePrototype → CLR DateTime。
  //   而 ProfileFixer 的时区补丁把 DateTime 改成了 UTC 语义 + 固定 +8h，Jint 内部于是拿
  //   Kind=Utc 的 DateTime 去构造 DateTimeOffset(utc, +8h) —— 运行时一律拒绝：
  //     · 设备：ArgumentException: dateTime.Kind equals Utc and offset does not equal zero
  //       （js.log 实证：每次 m_role_servant_summon_tos 都抛 → 抽卡 handler 中断 →
  //        不回 m_role_servant_summon_toc → 卡在卡池召唤；server.log 里完全无痕）
  //     · PC：MissingMethodException: DateTime.op_Addition（补丁签名与目标框架不符）
  //   判据：凡 服务端静默不回包 + server.log 干净，一律先看 js.log 的
  //   [shim] emit data handler error。也正因如此才加了 A/B 探针（ab_probe.js
  //   + --abdate-out）：同一套用例在 node 与 Jint 上各跑一遍逐键比对，而不是逐个流程猜。
  //
  //   对策（本次）：把所有会触达 CLR 时区的方法都在 JS 层接管 ——
  //   toString / toISOString / toJSON / toUTCString / toDateString / toTimeString /
  //   getTimezoneOffset。这样 Jint.DatePrototype 不再被调到，语义完全由 JS 决定，
  //   与 node 一致 —— 这也是 PCJS 能全链路贯通的原因。
  (function(){
    var D = Date.prototype;
    function pad(n, w){ var s = String(n); while (s.length < (w || 2)) s = '0' + s; return s; }

    // ★★★ 2026-09-16 最终定案：日期换算【完全不用 Date 对象】，纯整数运算。
    //   为什么不能用 new Date(ms)：Jint 的 DateConstructor.Construct(double) 会走
    //   FromDateTime → DateTime.ToUniversalTime（已被 ProfileFixer 改成 dt-8h，Kind 仍是 Utc）
    //   → 随后构造 DateTimeOffset(utcValue, +8h) → 设备抛
    //   ArgumentException: dateTime.Kind equals Utc and offset does not equal zero。
    //   我第一版接管函数里用 `new Date(getTime()+8h)` 做中间量 —— 等于把异常搬进自己的实现里，
    //   所以接管了却还抛。教训：这类问题要一路追到**是否还有任何路径触达 CLR**，
    //   而不是只看方法名是否被覆盖。
    //   下面用 Howard Hinnant 的民用历法算法从毫秒数直接算出北京时间分量，零 CLR 依赖。
    // 从毫秒数直接算日期分量（plus8=true 走北京时间，false 走 UTC）
    function partsOf(ms, plus8){
      if (isNaN(ms)) return null;
      var t = ms + (plus8 ? 8 * 3600 * 1000 : 0);
      var days = Math.floor(t / 86400000);
      var rem = t - days * 86400000;
      var hh = Math.floor(rem / 3600000); rem -= hh * 3600000;
      var mi = Math.floor(rem / 60000);   rem -= mi * 60000;
      var ss = Math.floor(rem / 1000);
      var msec = rem - ss * 1000;
      var z = days + 719468;
      var era = Math.floor(z / 146097);
      var doe = z - era * 146097;
      var yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
      var y = yoe + era * 400;
      var doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
      var mp = Math.floor((5 * doy + 2) / 153);
      var dd = doy - Math.floor((153 * mp + 2) / 5) + 1;
      var mo = mp + (mp < 10 ? 3 : -9);
      if (mo <= 2) y += 1;
      var wd = (days + 4) % 7; if (wd < 0) wd += 7;   // 1970-01-01 = Thursday
      return { y: y, mo: mo, dd: dd, hh: hh, mi: mi, ss: ss, ms: msec, wd: wd };
    }
    function parts(d){ return partsOf(d.getTime(), true); }
    function utcParts(d){ return partsOf(d.getTime(), false); }
    function isSV(loc){ return !loc || loc === 'sv' || String(loc).indexOf('sv') === 0; }

    // getter（本地 = 北京时间；UTC = 原始毫秒）
    var LOCALS = ['FullYear','Month','Date','Day','Hours','Minutes','Seconds','Milliseconds'];
    var UTCKEY = { FullYear:'y', Month:'mo', Date:'dd', Day:'wd', Hours:'hh', Minutes:'mi', Seconds:'ss', Milliseconds:'ms' };
    for (var li = 0; li < LOCALS.length; li++) {
      (function(name, key){
        D['get' + name] = function(){
          var p = parts(this); if (!p) return NaN;
          return key === 'mo' ? p[key] - 1 : p[key];      // getMonth 0-based
        };
      })(LOCALS[li], UTCKEY[LOCALS[li]]);
    }
    // UTC getter 同样接管：Jint 的实现也可能落到 CLR DateTime
    D.getUTCFullYear   = function(){ var p = parts(this); return p ? p.y : NaN; };
    D.getUTCMonth      = function(){ var p = parts(this); return p ? p.mo - 1 : NaN; };
    D.getUTCDate       = function(){ var p = parts(this); return p ? p.dd : NaN; };
    D.getUTCDay        = function(){ var p = parts(this); return p ? p.wd : NaN; };
    D.getUTCHours      = function(){ var p = parts(this); return p ? p.hh : NaN; };
    D.getUTCMinutes    = function(){ var p = parts(this); return p ? p.mi : NaN; };
    D.getUTCSeconds    = function(){ var p = parts(this); return p ? p.ss : NaN; };
    D.getUTCMilliseconds = function(){ var p = parts(this); return p ? p.ms : NaN; };
    D.getTimezoneOffset = function(){ return -480; };

    // ★ 2026-09-17（v4.3）：set* 家族同样必须纯整数接管——服务端在部分状态路径（如
    //   tower.autoFightTick/dare*/activity/grow/act_extra 的本周一分界、周年每日抽奖兜底）会调
    //   setDate/setHours/setMonth/setFullYear；若留成 Jint 原生 DatePrototype.SetDate，就会
    //   MonthFromTime → DateTimeOffset(utc,+8h) → InvalidOperationException（实测：活动页周年
    //   「每日幸运抽奖」fallback 回包链崩 → 客户端无 toc → TwoAnnLuDrawVO nil）。与上方 getter
    //   同口径：北京时间日历分量 ↔ UTC 毫秒，纯整数、零 CLR。
    function daysFromCivil(y, m, d){   // Howard Hinnant 逆算法（民用历 → 1970 起天数）
      y -= m <= 2 ? 1 : 0;
      var era = Math.floor(y / 400);
      var yoe = y - era * 400;
      var mp = m + (m > 2 ? -3 : 9);
      var doy = Math.floor((153 * mp + 2) / 5) + d - 1;
      var doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
      return era * 146097 + doe - 719468;
    }
    function msFromBeijing(y, mo, d, hh, mi, ss, ms){
      return daysFromCivil(y, mo, d) * 86400000 - 8 * 3600000 + hh * 3600000 + mi * 60000 + ss * 1000 + ms;
    }
    // ⚠️ 绝不要覆写 D.setTime 为 `Date.prototype.setTime.call(...)`：D 就是 Date.prototype，
    //    那会自己调自己 → Jint RecursionDepthOverflow（2026-09-17 实踩）。原生 setTime 只存毫秒、
    //    不做日历换算，直接用（下方各 setter 的 this.setTime(msFromBeijing(...)) 即原生）。
    D.setDate = function(d){ var p = parts(this); if (!p) return NaN; return this.setTime(msFromBeijing(p.y, p.mo, d >> 0, p.hh, p.mi, p.ss, p.ms)); };
    D.setHours = function(h, mi, ss, ms){
      var p = parts(this); if (!p) return NaN;
      if (mi === undefined) mi = p.mi; if (ss === undefined) ss = p.ss; if (ms === undefined) ms = p.ms;
      return this.setTime(msFromBeijing(p.y, p.mo, p.dd, h >> 0, mi >> 0, ss >> 0, ms >> 0));
    };
    D.setMinutes = function(mi, ss, ms){
      var p = parts(this); if (!p) return NaN;
      if (ss === undefined) ss = p.ss; if (ms === undefined) ms = p.ms;
      return this.setTime(msFromBeijing(p.y, p.mo, p.dd, p.hh, mi >> 0, ss >> 0, ms >> 0));
    };
    D.setSeconds = function(ss, ms){
      var p = parts(this); if (!p) return NaN;
      if (ms === undefined) ms = p.ms;
      return this.setTime(msFromBeijing(p.y, p.mo, p.dd, p.hh, p.mi, ss >> 0, ms >> 0));
    };
    D.setMilliseconds = function(ms){
      var p = parts(this); if (!p) return NaN;
      return this.setTime(msFromBeijing(p.y, p.mo, p.dd, p.hh, p.mi, p.ss, ms >> 0));
    };
    D.setMonth = function(mo, d){
      var p = parts(this); if (!p) return NaN;
      if (d === undefined) d = p.dd;
      return this.setTime(msFromBeijing(p.y, (mo >> 0) + 1, d >> 0, p.hh, p.mi, p.ss, p.ms));
    };
    D.setFullYear = function(y, mo, d){
      var p = parts(this); if (!p) return NaN;
      if (mo === undefined) mo = p.mo - 1; if (d === undefined) d = p.dd;
      return this.setTime(msFromBeijing(y >> 0, (mo >> 0) + 1, d >> 0, p.hh, p.mi, p.ss, p.ms));
    };

    // 格式化（全部基于 parts，零 Date 对象）
    var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var DAY = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    D.toLocaleDateString = function(loc){
      var p = parts(this); if (!p) return 'Invalid Date';
      var y = p.y, m = pad(p.mo), dd = pad(p.dd);
      return isSV(loc) ? (y + '-' + m + '-' + dd) : (y + '/' + p.mo + '/' + p.dd);
    };
    D.toLocaleTimeString = function(loc){
      var p = parts(this); if (!p) return 'Invalid Date';
      return pad(p.hh) + ':' + pad(p.mi) + ':' + pad(p.ss);
    };
    D.toLocaleString = function(loc){
      var p = parts(this); if (!p) return 'Invalid Date';
      return this.toLocaleDateString(loc) + ' ' + this.toLocaleTimeString(loc);
    };
    D.toISOString = function(){
      if (isNaN(this.getTime())) throw new RangeError('Invalid time value');
      // UTC 分量：直接用原始毫秒换算（不加 8h）
      var ms = this.getTime();
      var p = utcParts(this);
      return p.y + '-' + pad(p.mo) + '-' + pad(p.dd) + 'T' + pad(p.hh) + ':' + pad(p.mi) + ':' +
             pad(p.ss) + '.' + pad(p.ms, 3) + 'Z';
    };
    D.toJSON = D.toISOString;
    D.toUTCString = function(){
      var ms = this.getTime(); if (isNaN(ms)) return 'Invalid Date';
      var p = utcParts(this);
      return DAY[p.wd] + ', ' + pad(p.dd) + ' ' + MON[p.mo - 1] + ' ' + p.y + ' ' +
             pad(p.hh) + ':' + pad(p.mi) + ':' + pad(p.ss) + ' GMT';
    };
    D.toString = function(){
      var p = parts(this); if (!p) return 'Invalid Date';
      return DAY[p.wd] + ' ' + MON[p.mo - 1] + ' ' + pad(p.dd) + ' ' + p.y + ' ' +
             pad(p.hh) + ':' + pad(p.mi) + ':' + pad(p.ss) + ' GMT+0800 (China Standard Time)';
    };
    D.toDateString = function(){
      var p = parts(this); if (!p) return 'Invalid Date';
      return DAY[p.wd] + ' ' + MON[p.mo - 1] + ' ' + pad(p.dd) + ' ' + p.y;
    };
    D.toTimeString = function(){
      var p = parts(this); if (!p) return 'Invalid Date';
      return pad(p.hh) + ':' + pad(p.mi) + ':' + pad(p.ss) + ' GMT+0800 (China Standard Time)';
    };
  })();

  if (!O.values)  O.values  = function(o){ var r=[]; for (var k in o) if (O.prototype.hasOwnProperty.call(o,k)) r.push(o[k]); return r; };
  if (!O.assign)  O.assign  = function(t){ for (var i=1;i<arguments.length;i++){ var s=arguments[i]; if (s) for (var k in s) if (O.prototype.hasOwnProperty.call(s,k)) t[k]=s[k]; } return t; };

  if (!S.padStart) S.padStart = function(len, pad){ var s=String(this); len=len>>0; pad=(pad===undefined)?' ':String(pad); if (s.length>=len) return s; len-=s.length; if (pad.length>1) pad=pad.slice(0,len%pad.length||pad.length); while (len>pad.length) pad+=pad; return pad.slice(0,len)+s; };
  if (!S.padEnd)   S.padEnd   = function(len, pad){ var s=String(this); len=len>>0; pad=(pad===undefined)?' ':String(pad); if (s.length>=len) return s; len-=s.length; if (pad.length>1) pad=pad.slice(0,len%pad.length||pad.length); while (len>pad.length) pad+=pad; return s+pad.slice(0,len); };
  if (!S.startsWith) S.startsWith = function(s,p){ p=p||0; return this.slice(p,p+s.length)===s; };
  if (!S.endsWith) S.endsWith = function(s){ return this.slice(-s.length)===s; };
  if (!S.repeat) S.repeat = function(n){ n = n >> 0; if (n <= 0) return ''; var s = String(this), r = ''; for (;;) { if (n & 1) r += s; n >>= 1; if (!n) break; s += s; } return r; };
  if (!S.trimStart) S.trimStart = function(){ return this.replace(/^\s+/,''); };
  if (!S.trimEnd) S.trimEnd = function(){ return this.replace(/\s+$/,''); };

  if (!A.includes) A.includes = function(x){ for (var i=0;i<this.length;i++){ if (this[i]===x || (typeof x==='number' && typeof this[i]==='number' && isNaN(x) && isNaN(this[i]))) return true; } return false; };
  if (!S.includes) S.includes = function(x, p){ return String(this).indexOf(x, p === undefined ? 0 : p) >= 0; };
  if (!A.find) A.find = function(fn, th){ for (var i=0;i<this.length;i++){ if (fn.call(th,this[i],i,this)) return this[i]; } };
  if (!A.findIndex) A.findIndex = function(fn, th){ for (var i=0;i<this.length;i++){ if (fn.call(th,this[i],i,this)) return i; } return -1; };
  if (!A.fill) A.fill = function(v,s,e){ s=s===undefined?0:s>>0; e=e===undefined?this.length:e>>0; for (var i=Math.max(s,0);i<Math.min(e,this.length);i++) this[i]=v; return this; };
  if (!A.flat) A.flat = function(d){ d=arguments.length?d>>0:1; var r=[]; (function go(a,dep){ for (var i=0;i<a.length;i++){ if (Array.isArray(a[i])&&dep>0) go(a[i],dep-1); else r.push(a[i]); } })(this,d); return r; };
  if (!A.flatMap) A.flatMap = function(fn,th){ return Array.prototype.map.call(this,function(x,i,a){ return fn.call(th,x,i,a); }).flat(1); };

  // 注意：必须挂到构造函数静态位（Array.from / Array.of），不是 prototype ——
  // server 代码与 Babel 辅助器（_iterableToArray/_toConsumableArray）都按静态调用。
  if (!Array.from) Array.from = function (obj) {
    if (obj == null) throw new TypeError('Array.from: null');
    var list = [];
    if (typeof obj === 'string') { for (var i = 0; i < obj.length; i++) list.push(obj.charAt(i)); return list; }
    if (Array.isArray(obj)) { for (var a = 0; a < obj.length; a++) list.push(obj[a]); return list; }
    var itf = obj[global.Symbol.iterator];
    if (typeof itf === 'function') { var it = itf.call(obj), r; while (!(r = it.next()).done) list.push(r.value); return list; }
    if (typeof obj.length === 'number') { for (var j = 0; j < obj.length; j++) list.push(obj[j]); return list; }
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) list.push(obj[k]);
    return list;
  };
  if (!Array.of) Array.of = function(){ return Array.prototype.slice.call(arguments); };
  if (!N.isInteger) N.isInteger = function(v){ return typeof v === 'number' && isFinite(v) && Math.floor(v) === v; };
  if (!N.isFinite) N.isFinite = function(v){ return typeof v === 'number' && isFinite(v); };
  // ★ 2026-10-07：审计修复（relic_data normalizeEnchant / chaos 暗噬校验）用到 isSafeInteger/isNaN，
  //   Jint 2.11 缺 → loadState 即崩（testhost_verify.log 实证）。ES2015 标准实现。
  if (!N.isSafeInteger) N.isSafeInteger = function(v){ return typeof v === 'number' && isFinite(v) && Math.floor(v) === v && Math.abs(v) <= 9007199254740991; };
  if (!N.isNaN) N.isNaN = function(v){ return typeof v === 'number' && v !== v; };
  if (!N.parseFloat) N.parseFloat = parseFloat;
  if (!N.parseInt) N.parseInt = parseInt;
  if (!N.MAX_SAFE_INTEGER) N.MAX_SAFE_INTEGER = 9007199254740991;
  if (!N.MIN_SAFE_INTEGER) N.MIN_SAFE_INTEGER = -9007199254740991;
  if (!N.EPSILON) N.EPSILON = 2.220446049250313e-16;
  if (!M.sign) M.sign = function(v){ v = Number(v); return v === 0 || v !== v ? v : (v > 0 ? 1 : -1); };
  if (!M.trunc) M.trunc = function(v){ return v < 0 ? Math.ceil(v) : Math.floor(v); };
  // ★ 2026-09-17：设备实测 node 有、Jint 2.11 缺 → handbook/rank/shop/feeling_rules 的 hash 全崩
  //   （「handler 异常 … Object has no method 'imul'」→ 图鉴无回包/排名空/活动链路断），MDN 标准实现。
  if (!M.imul) M.imul = function(a, b){
    var ah = (a >>> 16) & 0xffff, al = a & 0xffff;
    var bh = (b >>> 16) & 0xffff, bl = b & 0xffff;
    return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
  };

  // ---- 假 Symbol（仅为 Babel for-of 辅助器/迭代协议提供 @@iterator 键）----
  if (typeof Symbol === 'undefined') {
    global.Symbol = function Symbol(d){ return '@@' + String(d); };
    global.Symbol.iterator = '@@iterator';
  }

  // ---- Set / Map（ES5 实现；迭代走 @@iterator 兼容 Babel 辅助器）----
  // 【铁律】next() 必须让游标前进（i++），且迭代器自身带 @@iterator（自返回）——
  // Jint 2.11 无原生迭代器，Babel for-of/spread 辅助器完全依赖这两点；漏掉即死循环。
  function __PsIter(arr) {
    var i = 0;
    var it = { next: function(){ return i < arr.length ? { value: arr[i++], done: false } : { value: undefined, done: true }; } };
    it[global.Symbol.iterator] = function(){ return it; };
    return it;
  }
  // 哈希键：基本类型 → 前缀字符串（避免与 Object.prototype 属性名撞车）；对象/函数 → null（恒等线性兜底）
  function __PsKey(k) {
    var t = typeof k;
    if (t === 'string') return 's' + k;
    if (t === 'number') return 'n' + k;      // NaN/-0 的 SameValueZero 语义天然正确
    if (t === 'boolean') return 'b' + k;
    if (k === null) return 'z';
    if (k === undefined) return 'u';
    return null;
  }
  // 删除用墓碑标记（O(1) 摊还；splice 重排索引在解释器里是 O(n)/次，大集合会挂起）
  var __PS_TOMB = { __psTomb: 1 };
  function __psCompact(map, isSet) {
    var keys = map._k, vals = map._v, liveK = [], liveV = [], h = {};
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] === __PS_TOMB) continue;
      var hk = __PsKey(keys[i]);
      if (hk !== null) h[hk] = liveK.length;
      liveK.push(keys[i]);
      if (!isSet) liveV.push(vals[i]);
    }
    map._k = liveK; map._h = h; map._tomb = 0;
    if (isSet) map._a = liveK;
    else map._v = liveV;
  }
  function __psMaybeCompact(map, isSet) {
    if (map._k.length > 16 && map.size * 2 < map._k.length) __psCompact(map, isSet);
  }
  if (typeof global.Set === 'undefined' || !global.Set.prototype.add) {
    global.Set = function (iter) {
      this._a = []; this._k = this._a; this._h = {}; this.size = 0;
      if (iter != null) {
        var itf = iter[global.Symbol.iterator];
        if (typeof itf === 'function') { var it = itf.call(iter), r; while (!(r = it.next()).done) this.add(r.value); }
      }
    };
    global.Set.prototype._idx = function (v) {
      var hk = __PsKey(v);
      if (hk !== null) {
        if (Object.prototype.hasOwnProperty.call(this._h, hk)) { var i = this._h[hk]; if (this._a[i] !== __PS_TOMB) return i; }
        return -1;
      }
      for (var j = 0; j < this._a.length; j++) if (this._a[j] === v) return j;
      return -1;
    };
    global.Set.prototype.add = function (v) {
      if (this._idx(v) >= 0) return this;
      var hk = __PsKey(v);
      if (hk !== null) this._h[hk] = this._a.length;
      this._a.push(v);
      this.size = this._a.length - (this._tomb || 0);
      return this;
    };
    global.Set.prototype.has = function (v) { return this._idx(v) >= 0; };
    global.Set.prototype.delete = function (v) {
      var i = this._idx(v);
      if (i < 0) return false;
      var hk = __PsKey(this._a[i]);
      if (hk !== null) delete this._h[hk];
      this._a[i] = __PS_TOMB;
      this._tomb = (this._tomb || 0) + 1;
      this.size--;
      __psMaybeCompact(this, true);
      return true;
    };
    global.Set.prototype.clear = function () { this._a = []; this._k = this._a; this._h = {}; this._tomb = 0; this.size = 0; };
    global.Set.prototype.forEach = function (fn, th) { var a = this._a; for (var i = 0; i < a.length; i++) { if (a[i] === __PS_TOMB) continue; fn.call(th, a[i], a[i], this); } };
    global.Set.prototype.values = function () { var r = []; for (var i = 0; i < this._a.length; i++) if (this._a[i] !== __PS_TOMB) r.push(this._a[i]); return __PsIter(r); };
    global.Set.prototype.keys = global.Set.prototype.values;
    global.Set.prototype.entries = function () { var r = []; for (var i = 0; i < this._a.length; i++) { if (this._a[i] === __PS_TOMB) continue; r.push([this._a[i], this._a[i]]); } return __PsIter(r); };
    global.Set.prototype[global.Symbol.iterator] = global.Set.prototype.values;
  }
  if (typeof global.Map === 'undefined' || !global.Map.prototype.set) {
    global.Map = function (iter) {
      this._k = []; this._v = []; this._h = {}; this.size = 0;
      if (iter != null) {
        var itf = iter[global.Symbol.iterator];
        if (typeof itf === 'function') { var it = itf.call(iter), r; while (!(r = it.next()).done) this.set(r.value[0], r.value[1]); }
      }
    };
    global.Map.prototype._idx = function (k) {
      var hk = __PsKey(k);
      if (hk !== null) {
        if (Object.prototype.hasOwnProperty.call(this._h, hk)) { var i = this._h[hk]; if (this._k[i] !== __PS_TOMB) return i; }
        return -1;
      }
      for (var j = 0; j < this._k.length; j++) if (this._k[j] === k) return j;
      return -1;
    };
    global.Map.prototype.set = function (k, v) {
      var i = this._idx(k);
      if (i >= 0) { this._v[i] = v; return this; }
      var hk = __PsKey(k);
      if (hk !== null) this._h[hk] = this._k.length;
      this._k.push(k); this._v.push(v);
      this.size = this._k.length - (this._tomb || 0);
      return this;
    };
    global.Map.prototype.get = function (k) { var i = this._idx(k); return i >= 0 ? this._v[i] : undefined; };
    global.Map.prototype.has = function (k) { return this._idx(k) >= 0; };
    global.Map.prototype.delete = function (k) {
      var i = this._idx(k);
      if (i < 0) return false;
      var hk = __PsKey(this._k[i]);
      if (hk !== null) delete this._h[hk];
      this._k[i] = __PS_TOMB;
      this._v[i] = undefined;
      this._tomb = (this._tomb || 0) + 1;
      this.size--;
      __psMaybeCompact(this, false);
      return true;
    };
    global.Map.prototype.clear = function () { this._k = []; this._v = []; this._h = {}; this._tomb = 0; this.size = 0; };
    global.Map.prototype.forEach = function (fn, th) { var ks = this._k, vs = this._v; for (var i = 0; i < ks.length; i++) { if (ks[i] === __PS_TOMB) continue; fn.call(th, vs[i], ks[i], this); } };
    global.Map.prototype.keys = function () { var r = []; for (var i = 0; i < this._k.length; i++) if (this._k[i] !== __PS_TOMB) r.push(this._k[i]); return __PsIter(r); };
    global.Map.prototype.values = function () { var r = []; for (var i = 0; i < this._k.length; i++) if (this._k[i] !== __PS_TOMB) r.push(this._v[i]); return __PsIter(r); };
    global.Map.prototype.entries = function () { var r = []; for (var i = 0; i < this._k.length; i++) { if (this._k[i] === __PS_TOMB) continue; r.push([this._k[i], this._v[i]]); } return __PsIter(r); };
    global.Map.prototype[global.Symbol.iterator] = global.Map.prototype.entries;
  }

  if (!O.fromEntries) O.fromEntries = function (entries) {
    var r = {};
    var it = (entries && entries[global.Symbol.iterator]) ? entries[global.Symbol.iterator]() : null;
    if (it) { var s; while (!(s = it.next()).done) { var e = s.value; if (e && e.length) r[e[0]] = e[1]; } }
    else if (entries) { for (var k in entries) if (O.prototype.hasOwnProperty.call(entries, k)) r[k] = entries[k]; }
    return r;
  };

  // String/Array @@iterator（Babel for-of 辅助器在无原生 Symbol 的引擎上走字符串键）
  if (!S[global.Symbol.iterator]) S[global.Symbol.iterator] = function () {
    var str = String(this), i = 0;
    var it = { next: function(){ return i < str.length ? { value: str.charAt(i++), done: false } : { value: undefined, done: true }; } };
    it[global.Symbol.iterator] = function(){ return it; };
    return it;
  };
  if (!A[global.Symbol.iterator]) A[global.Symbol.iterator] = function () {
    var arr = this, i = 0;
    var it = { next: function(){ return i < arr.length ? { value: arr[i++], done: false } : { value: undefined, done: true }; } };
    it[global.Symbol.iterator] = function(){ return it; };
    return it;
  };

  if (!S.matchAll) S.matchAll = function (re) {
    var str = String(this);
    var flags = 'g' + (re.ignoreCase ? 'i' : '') + (re.multiline ? 'm' : '') + (re.sticky ? 'y' : '');
    var rx = new RegExp(re.source, flags);
    var matches = [];
    var m;
    while ((m = rx.exec(str)) !== null) { matches.push(m); if (m[0].length === 0) rx.lastIndex++; }
    var i = 0;
    var it = { next: function(){ return i < matches.length ? { value: matches[i++], done: false } : { value: undefined, done: true }; } };
    it[global.Symbol.iterator] = function(){ return it; };
    return it;
  };

  if (typeof globalThis === 'undefined') globalThis = this;
  if (typeof Promise === 'undefined') {
    // 占位：仅支持构造即执行 + then/catch 记录；全库零 await，不会真正等待
    global.Promise = function(exec){ var self=this; self._v=undefined; self._t=[];
      function ok(v){ self._v=v; self._ok=true; for (var i=0;i<self._t.length;i++) try{ self._t[i][0](v); }catch(e){} }
      function bad(e){ self._v=e; self._bad=true; for (var i=0;i<self._t.length;i++) try{ self._t[i][1]&&self._t[i][1](e); }catch(x){} }
      try { exec(ok,bad); } catch(e){ bad(e); } };
    global.Promise.prototype.then = function(a,b){ this._t.push([a,b]); if (this._ok&&a) a(this._v); if (this._bad&&b) b(this._v); return this; };
    global.Promise.prototype.catch = function(b){ this._t.push([null,b]); if (this._bad&&b) b(this._v); return this; };
    global.Promise.resolve = function(v){ return new global.Promise(function(ok){ ok(v); }); };
    global.Promise.reject = function(e){ return new global.Promise(function(ok,bad){ bad(e); }); };
  }
})();
";
    }
}
