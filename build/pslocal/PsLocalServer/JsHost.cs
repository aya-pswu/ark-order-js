// JsHost：Jint 引擎宿主。单工作线程串行处理所有 JS 事件（socket 数据 / HTTP 请求 /
// 定时器回调），server 代码零改动跑在解释器里。C# 网络线程只做字节搬运，全部经
// Enqueue() 进派发队列。
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using Jint;
using Jint.Native;
using PsLocalServer.Shims;

namespace PsLocalServer
{
    public class PsLog : IDisposable
    {
        /// <summary>静态日志口（引擎外的垫片层用；JsHost.Start 时挂上）。</summary>
        public static Action<string> Sink = s => { };

        private readonly object _lock = new object();
        private readonly string _file;
        private readonly Action<string> _mirror;
        private StreamWriter _writer;

        public PsLog(string file, Action<string> mirror = null)
        {
            _file = file;
            _mirror = mirror;
            try
            {
                Directory.CreateDirectory(Path.GetDirectoryName(_file));
                var fs = new FileStream(_file, FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
                _writer = new StreamWriter(fs, Encoding.UTF8) { AutoFlush = true };
            }
            catch { }
        }

        public static Action<string> ConsoleMirror = null;

        public void W(string line)
        {
            var stamp = DateTime.UtcNow.AddHours(8).ToString("HH:mm:ss.fff");
            var full = stamp + " " + line;
            lock (_lock)
            {
                try
                {
                    if (_writer == null)
                    {
                        Directory.CreateDirectory(Path.GetDirectoryName(_file));
                        var fs = new FileStream(_file, FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
                        _writer = new StreamWriter(fs, Encoding.UTF8) { AutoFlush = true };
                    }
                    _writer.WriteLine(full);
                }
                catch { }
            }
            if (_mirror != null) { try { _mirror(full); } catch { } }
        }

        public void I(string line) { W("[js] " + line); }

        public void Dispose()
        {
            lock (_lock)
            {
                try { _writer?.Dispose(); } catch { }
                _writer = null;
            }
        }
    }

    public class JsHost : IDisposable
    {
        private Engine _engine;
        private Thread _worker;
        private BlockingQueue<Action> _queue = new BlockingQueue<Action>();
        private FsHost _fs;
        private PsLog _log;
        private volatile bool _running;
        private long _nextSession = 1;
        private readonly Dictionary<long, PsTcpSocket> _sockets = new Dictionary<long, PsTcpSocket>();
        private readonly Dictionary<string, JsValue> _moduleCache = new Dictionary<string, JsValue>();
        private readonly List<TimerEntry> _timers = new List<TimerEntry>();
        private int _nextTimerId = 1;
        private readonly List<JsValue> _processExitHandlers = new List<JsValue>();
        public Action OnServerReady;   // boot.js 在两个服务 listening 后调用（进度条推进用）
        public Action<string, double> Progress; // 启动期进度上报（模块逐个，v5 精确进度条用）

        public Engine Engine { get { return _engine; } }
        public FsHost Fs { get { return _fs; } }
        public PsLog Log { get { return _log; } }

        class TimerEntry { public long Due; public int Interval; public JsValue Fn; public bool Repeat; public bool Cancelled; public int Id; }

        public int HttpPort = 8081;
        public int GamePort = 9021;
        public int LuaPort = 44587;
        public string HostIp = "127.0.0.1";

        public void Start(HostEnvironment env, string logFile)
        {
            PsLog.Sink = s => _log.W("[shim] " + s);
            _fs = new FsHost(env);
            _log = new PsLog(logFile, PsLog.ConsoleMirror);
            _running = true;
            // Jint 解释器递归深，默认 1MB 栈会静默 StackOverflow（进程直接消失）
            _worker = new Thread(WorkerLoop, 256 * 1024 * 1024) { IsBackground = true, Name = "JsHost" };
            _worker.Start();
            Enqueue(Initialize);
        }

        void Initialize()
        {
            try
            {
                _engine = new Engine(o =>
                {
                    o.Strict(false);
                    o.LimitRecursion(10000);
                    // CLR 异常包装成 JS Error（server 代码大量 try/catch 依赖此语义，
                    // 如 lib.js 的 CfgItems 候选路径逐个尝试）
                    o.CatchClrExceptions();
                });
                RegisterGlobals();
                _engine.Execute(Polyfill.Source);
                _engine.Execute("global.__psRepeatCheck = typeof String.prototype.repeat + '|' + '='.repeat(3);");
                _log.I("polyfill check: " + _engine.GetValue("__psRepeatCheck"));
                // 模块清单：prelude + 每模块小脚本 + 启动行（单文件 Execute 过大会栈溢出）
                _log.I("about-to-exec prelude");
                _engine.Execute(_fs.ReadAllText("/ps_server/__ps_prelude.js"));
                _log.I("prelude ok");
                var modlistText = _fs.ReadAllText("/ps_server/__ps_modlist.txt");
                var mods = new List<string>();
                foreach (var line in modlistText.Replace("\r", "").Split('\n'))
                {
                    var f = line.Trim();
                    if (f.Length > 0) mods.Add(f);
                }
                // v5 精确进度：模块逐个上报（占 0.80→0.96 带）。模块执行是 Jint 冷启动的主要耗时，
                // 之前只有首尾两点，进度条表现为"80% 长时间停顿后跳 100%"。
                for (int mi = 0; mi < mods.Count; mi++)
                {
                    var p = Progress;
                    if (p != null)
                        p("启动内置服务端 " + (mi + 1) + "/" + mods.Count,
                          0.80 + 0.16 * ((double)mi / Math.Max(mods.Count, 1)));
                    _log.I("exec " + mods[mi]);
                    _engine.Execute(_fs.ReadAllText(mods[mi]));
                }
                // bootrun（最后一个模块）内部的懒执行装配由 prelude 的 __psBootTick 经 PS.progress
                // 逐模块上报（0.96→0.99，见 prepare_assets.py prelude）——ARM 上该段约 15s，
                // 之前是"80%→100% 跳变"的最大平台期。不再在此追加收尾上报，避免百分比回退。
                _log.I("modules loaded, boot.js done (handlers wired)");
            }
            catch (Exception e)
            {
                var dump = e.GetType().FullName + ": " + e.Message;
                foreach (var prop in e.GetType().GetProperties())
                {
                    try
                    {
                        var v = prop.GetValue(e, null);
                        if (v != null && v.ToString().Length > 0 && prop.Name != "Message" && prop.Name != "StackTrace" && prop.Name != "InnerException" && prop.Name != "Data")
                            dump += "\n  " + prop.Name + " = " + v;
                    }
                    catch { }
                }
                try { dump += "\nINNER:\n" + (e.InnerException == null ? "(none)" : e.InnerException.GetType().FullName + ": " + e.InnerException.Message); } catch { }
                _log.I(dump + "\nCLR:\n" + e.StackTrace);
                Error = e; // v5：上抛给 BootPipeline（原先只记日志，管线要白等 1800s 才超时）
            }
        }

        public Action<string> BootFailed;
        public volatile Exception Error; // 工作线程写、管线线程读（v5 起启动失败快速上抛）

        // ---------------- 派发队列 ----------------
        public void Enqueue(Action act)
        {
            _queue.Push(act);
        }

        void WorkerLoop()
        {
            while (_running)
            {
                int waitMs = 50;
                lock (_timers)
                {
                    long now = Now();
                    foreach (var t in _timers.ToArray())
                    {
                        if (t.Cancelled) { _timers.Remove(t); continue; }
                        if (t.Due <= now)
                        {
                            var t1 = t;
                            if (t.Repeat) t.Due = now + t.Interval;
                            else _timers.Remove(t);
                            _queue.Push(() => RunTimer(t1));
                        }
                    }
                    // 下一个定时器的等待时长
                    long? next = null;
                    foreach (var t in _timers)
                        if (!t.Cancelled && (next == null || t.Due < next)) next = t.Due;
                    if (next != null)
                    {
                        var w = (int)Math.Min(Math.Max(next.Value - Now(), 1), 200);
                        waitMs = Math.Min(waitMs, w);
                    }
                }
                Action act;
                if (_queue.TryTake(out act, waitMs))
                {
                    try
                    {
                        act();
                    }
                    catch (Exception e)
                    {
                        _log.I("!! dispatch error: " + e.Message + "\n" + e.StackTrace);
                    }
                }
            }
        }

        void RunTimer(TimerEntry t)
        {
            try { Engine.Invoke(t.Fn); }
            catch (Exception e) { _log.I("!! timer error: " + e.Message); }
        }

        internal static long Now() { return DateTime.UtcNow.Ticks / TimeSpan.TicksPerMillisecond; }

        // ---------------- 定时器 ----------------
        // 【Jint 2.11 铁律】`Func<JsValue[],JsValue>` 委托从 JS 侧调用必然失败：
        // 参数封送抛 "Value of object[] type is expected"（探针实证，连纯数字都炸）。
        // 定时器一律走【精确参数个数】的普通方法（Node 侧全是 setTimeout(fn, ms) 2 参）。
        JsValue SetTimeout2(JsValue fn, JsValue ms)
        {
            return AddTimer(fn, ms, false);
        }

        JsValue SetInterval2(JsValue fn, JsValue ms)
        {
            return AddTimer(fn, ms, true);
        }

        JsValue AddTimer(JsValue fn, JsValue msVal, bool repeat)
        {
            int ms = msVal == null || msVal.IsUndefined() || msVal.IsNull() ? 0 : (int)PsBuffer.Num(msVal);
            var entry = new TimerEntry
            {
                Due = Now() + Math.Max(ms, repeat ? 1 : 0),
                Interval = repeat ? Math.Max(ms, 1) : 0,
                Fn = fn,
                Repeat = repeat,
                Id = _nextTimerId++
            };
            lock (_timers) _timers.Add(entry);
            return JsValue.FromObject(_engine, entry.Id);
        }

        void ClearTimer1(JsValue idVal)
        {
            if (idVal == null || !idVal.IsNumber()) return;
            int id = (int)idVal.AsNumber();
            lock (_timers)
            {
                foreach (var t in _timers)
                    if (t.Id == id) { t.Cancelled = true; break; }
            }
        }

        // ---------------- 全局注册 ----------------
        void RegisterGlobals()
        {
            var e = _engine;
            e.SetValue("Buffer", new PsBuffer.Factory());
            e.SetValue("PS", new PsHelpers(this));
            e.SetValue("__psLong", new PsLongHelpers());
            e.SetValue("__psXor", new PsXorBridge());
            e.SetValue("__psEtf", new PsEtf());
            // 【Jint 2.11】第二参声明 JsValue 而非 object[]：JS 函数混在参数数组里时
            // object[] 封送会抛 "Value of object[] type is expected, but actual type is Func`3"，
            // 表现为日志调用把整个事件处理器炸掉（"emit data handler error"）
            e.SetValue("__log", new Action<JsValue, JsValue>((a, rest) => _log.I(Format(a, rest))));
            e.SetValue("__psHost", this);

            e.Execute(@"
global = this;
// console 垫片
var __console = {};
['log','info','warn','error','debug'].forEach(function(k){
  __console[k] = function(){ var s = []; for (var i=0;i<arguments.length;i++) s.push(__fmt(arguments[i])); __log(s.join(' '), Array.prototype.slice.call(arguments,1)); };
});
function __fmt(v){
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'object' && v.__inner) return String(v.__inner);
  try { return JSON.stringify(v); } catch(e) { return String(v); }
}
global.console = __console;
global.__fmt = __fmt;
");

            // 定时器（精确参数个数；见 SetTimeout2 注释）
            e.SetValue("__setTimeout", new Func<JsValue, JsValue, JsValue>(SetTimeout2));
            e.SetValue("__setInterval", new Func<JsValue, JsValue, JsValue>(SetInterval2));
            e.SetValue("__clearTimeout", new Action<JsValue>(ClearTimer1));
            e.Execute(@"
global.setTimeout = function(fn, ms){ return __setTimeout(fn, ms); };
global.setInterval = function(fn, ms){ return __setInterval(fn, ms); };
global.clearTimeout = function(id){ return __clearTimeout(id); };
global.clearInterval = function(id){ return __clearTimeout(id); };
global.setImmediate = function(fn){ return __setTimeout(fn, 0); };
");

            // process
            var envJson = "{\"HOST_IP\":\"" + HostIp + "\",\"HTTP_PORT\":\"" + HttpPort + "\",\"GAME_PORT\":\"" + GamePort + "\",\"LUA_REMOTE_PORT\":\"" + LuaPort + "\",\"ARK_NO_COLOR\":\"1\",\"ARK_VERBOSE\":\"0\",\"FORCE_COLOR\":\"0\"}";
            e.Execute("global.process = { env: JSON.parse('" + envJson + "'), argv: [], cwd: function(){ return '/ps_server'; }, exit: function(code){ __psHost.ProcessExit(code); }, on: function(ev, fn){ if (ev === 'exit') __psHost.OnProcessExit(fn); }, stdout: { write: function(s){ __log(String(s), []); return true; }, isTTY: false } };");
            
            // 内置模块表
            e.Execute(@"
global.__psMods = {};
global.__psModFactory = function(name, obj){ __psMods[name] = obj; };
// 供 CLR 垫片在【引擎执行中】构造 JS 数组用：Jint 2.11 嵌套 Execute 会抛 Stack empty，
// 但嵌套 Invoke 可用（探针实证）——readdirSync 等热路径必须走这里
global.__psMakeArray = function(){ var a = []; for (var i = 0; i < arguments.length; i++) a.push(arguments[i]); return a; };
");
            e.SetValue("__fs", new FsModule(this));
            e.SetValue("__path", new PathModule());
            e.SetValue("__net", new NetModule(this));
            e.SetValue("__http", new HttpModule(this));
            e.SetValue("__zlib", new ZlibModule());
            e.SetValue("__crypto", new CryptoModule());
            e.SetValue("__psUrlCreate", new Func<object, object, object>((u, b) =>
            {
                var us = u as string ?? (u as JsValue)?.AsString() ?? "";
                var bs = b as string ?? (b as JsValue)?.AsString();
                return new Shims.PsUrl(us, bs);
            }));
            e.SetValue("__cpmod", new ChildProcessModule());
            e.Execute(@"
__psModFactory('fs', __fs);
__psModFactory('path', __path);
__psModFactory('net', __net);
__psModFactory('http', __http);
__psModFactory('zlib', __zlib);
__psModFactory('crypto', __crypto);
__psModFactory('url', { URL: function(u, b){ return __psUrlCreate(u, b); } });
__psModFactory('child_process', __cpmod);
__psModFactory('events', {});
__psModFactory('os', {});
__psModFactory('util', {});
");

            // Buffer.from(str, 'hex') 等已由 CLR 承担；补 Buffer 原型别名（均为 CLR 方法名一致，无需桥）
        }

        private int _evalCounter;

        /// <summary>表达式求值（var 全局赋值 + GetValue；2.11 实测可用）。</summary>
        internal JsValue Eval(string expr)
        {
            var name = "__psEval" + (_evalCounter++);
            _engine.Execute("var " + name + " = (" + expr + ");");
            return _engine.GetValue(name);
        }

        internal string Format(JsValue a, JsValue rest)
        {
            if (a == null || a.IsUndefined() || a.IsNull()) return "";
            return a.IsString() ? a.AsString() : a.ToString();
        }

        // ---------------- net 桥 ----------------
        internal PsTcpSocket CreateSocket(TcpClient client)
        {
            var sock = new PsTcpSocket(this, _nextSession++, client);
            lock (_sockets) _sockets[sock.SessionId] = sock;
            return sock;
        }

        internal void OnSocketData(PsTcpSocket sock, byte[] data)
        {
            Enqueue(() =>
            {
                if (data == null)
                {
                    lock (_sockets) _sockets.Remove(sock.SessionId);
                    sock.Emit("close");
                    sock.CloseQuietly();
                    return;
                }
                sock.Emit("data", JsValue.FromObject(Engine, new PsBuffer(data)));
            });
        }

        internal void NotifySocketError(PsTcpSocket sock, Exception e)
        {
            Enqueue(() => sock.Emit("error", MakeError(e, 0)));
        }

        internal void NotifySocketClosed(PsTcpSocket sock)
        {
            Enqueue(() =>
            {
                lock (_sockets) _sockets.Remove(sock.SessionId);
                sock.Emit("close");
            });
        }

        // ---------------- http 桥 ----------------
        internal void HandleHttpSocket(Socket sock, PsHttpServer server)
        {
            try
            {
                var req = HttpReader.Read(sock);
                if (req == null) { try { sock.Close(); } catch { } return; }
                var res = new PsHttpResponse(sock);
                Enqueue(() =>
                {
                    try
                    {
                        var reqObj = new PsHttpRequest
                        {
                            method = req.Method,
                            url = req.Url,
                            headers = HeadersToJs(req.Headers), // 引擎相关，必须在工作线程构建
                            body = req.Body,
                        };
                        // Node IncomingMessage.socket / .connection 垫片：save_admin 的
                        // localhost-only 校验读 req.socket.remoteAddress（2026-11-08：此前缺失导致 /saveadm 恒 403）
                        var sockInfo = new PsHttpSocketInfo(req.RemoteAddress, req.RemotePort, req.RemoteIsIpv6);
                        reqObj.socket = sockInfo;
                        reqObj.connection = sockInfo;
                        server.InvokeRequest(JsValue.FromObject(_engine, reqObj), JsValue.FromObject(_engine, res));
                    }
                    catch (Exception e)
                    {
                        _log.I("!! http handler error: " + e.Message + "\n" + e.StackTrace);
                        try { sock.Close(); } catch { }
                    }
                });
            }
            catch (Exception)
            {
                try { sock.Close(); } catch { }
            }
        }

        JsValue HeadersToJs(Dictionary<string, string> headers)
        {
            var sb = new StringBuilder("{");
            bool first = true;
            foreach (var kv in headers)
            {
                if (!first) sb.Append(',');
                first = false;
                sb.Append(EscapeJson(kv.Key.ToLowerInvariant())).Append(':').Append(EscapeJson(kv.Value));
            }
            sb.Append('}');
            return Eval("JSON.parse(" + EscapeJson(sb.ToString()) + ")");
        }

        internal static string EscapeJson(string s)
        {
            var sb = new StringBuilder(s.Length + 8);
            foreach (var c in s)
            {
                switch (c)
                {
                    case '"': sb.Append("\\\""); break;
                    case '\\': sb.Append("\\\\"); break;
                    case '\n': sb.Append("\\n"); break;
                    case '\r': sb.Append("\\r"); break;
                    case '\t': sb.Append("\\t"); break;
                    default:
                        if (c < 32) sb.Append("\\u").Append(((int)c).ToString("x4"));
                        else sb.Append(c);
                        break;
                }
            }
            return "\"" + sb + "\"";
        }

        internal static IEnumerable<KeyValuePair<string, string>> EnumerateStringMap(object obj)
        {
            var jv = obj as JsValue;
            if (jv == null) yield break;
            if (!jv.IsObject()) yield break;
            var oi = jv.AsObject();
            foreach (var kv in oi.GetOwnProperties())
            {
                var k = kv.Key;
                var v = kv.Value != null ? kv.Value.Value : JsValue.Undefined;
                yield return new KeyValuePair<string, string>(k, v.IsString() ? v.AsString() : v.ToString());
            }
        }

        internal JsValue MakeError(Exception e, int port)
        {
            string code = "EUNKNOWN";
            var se = e.InnerException as System.Net.Sockets.SocketException ?? e as System.Net.Sockets.SocketException;
            if (se != null)
            {
                if (se.SocketErrorCode == SocketError.AddressAlreadyInUse) code = "EADDRINUSE";
                else if (se.SocketErrorCode == SocketError.AccessDenied) code = "EACCES";
                else code = se.SocketErrorCode.ToString();
            }
            // Mono 的 NetworkStream.EndWrite/EndRead 把真实原因包成 IOException("EndWrite failure")，
            // 真正的 SocketException 只在 InnerException 里。只报外层消息时，日志中的
            // 「sock err EndWrite failure」无法区分"对端不要了(EPIPE/ECONNRESET)"还是"我们发不动"。
            // 补上内层，外层消息保留在最前（既有日志匹配不受影响）。
            var msg = e.Message;
            if (e.InnerException != null && !string.IsNullOrEmpty(e.InnerException.Message))
                msg = msg + " <- " + e.InnerException.GetType().Name + ": " + e.InnerException.Message;
            var json = "{\"code\":\"" + code + "\",\"errno\":0,\"port\":" + port +
                       ",\"message\":" + EscapeJson(msg) + "}";
            return Eval("JSON.parse(" + EscapeJson(json) + ")");
        }

        // ---------------- 生命周期 ----------------
        public void ProcessExit(object code)
        {
            _log.I("process.exit(" + (code ?? "") + ") requested");
            foreach (var fn in _processExitHandlers.ToArray())
            {
                try { Engine.Invoke(fn); } catch { }
            }
        }

        public void OnProcessExit(JsValue fn)
        {
            _processExitHandlers.Add(fn);
        }

        public void Shutdown()
        {
            _running = false;
            _queue.Close();
            try { _log?.Dispose(); } catch { }
        }

        public void Dispose() { Shutdown(); }
    }

    // ---------------- 阻塞队列 ----------------
    public class BlockingQueue<T>
    {
        private readonly Queue<T> _q = new Queue<T>();
        private readonly object _lock = new object();
        private bool _closed;

        public int Count { get { lock (_lock) return _q.Count; } }

        public void Push(T item)
        {
            lock (_lock)
            {
                if (_closed) return;
                _q.Enqueue(item);
                Monitor.Pulse(_lock);
            }
        }

        public bool TryTake(out T item, int waitMs)
        {
            lock (_lock)
            {
                var deadline = Environment.TickCount + waitMs;
                while (_q.Count == 0 && !_closed)
                {
                    var left = deadline - Environment.TickCount;
                    if (left <= 0) { item = default(T); return false; }
                    Monitor.Wait(_lock, left);
                }
                if (_q.Count == 0) { item = default(T); return false; }
                item = _q.Dequeue();
                return true;
            }
        }

        public void Close()
        {
            lock (_lock) { _closed = true; Monitor.PulseAll(_lock); }
        }
    }

    // etf.js 单机版 long 桥：十进制字符串 <-> ETF bignum 字节
    // 【2026-10-14（一百七十八）】JS 数组实参经 Jint 2.11 封送进 object 形参时会转成
    // object[]（元素 double/long），并非 JsValue —— `as JsValue` 得 null，bytes 恒空 →
    // fromBytes 恒回 "0"。真机实锤：客户端 m_dorm_detail_tos.role_id=6000355922
    // （ETF 110 SMALL_BIG，字节 52 2a a6 65 01）被解成 "0" 回显 → DormMgr.isMyDorm()
    // 恒 false → 协会 UI 整体落入"拜访他人"分支（休息位隐藏/总览标题变"X的协会"）。
    // 修复：补 object[]/IEnumerable 封送形态兜底（与 PsBuffer.Factory 同款防御）。
    // etf.js 的 decodeLong 现已改为纯 JS 手算不再走本桥，此处修复是防其他桥复用再踩。
    public class PsLongHelpers
    {
        public string fromBytes(object bytesObj, object sign)
        {
            byte[] bytes;
            if (bytesObj is JsValue jv && jv.IsArray()) bytes = PsBuffer.JsArrayToBytes(jv);
            else if (bytesObj is object[] arr)
            {
                bytes = new byte[arr.Length];
                for (int i = 0; i < arr.Length && i < 8; i++) bytes[i] = unchecked((byte)((long)PsBuffer.Num(arr[i]) & 0xff));
            }
            else if (bytesObj is System.Collections.IEnumerable en && !(bytesObj is string))
            {
                var list = new System.Collections.Generic.List<byte>();
                foreach (var item in en) { list.Add(unchecked((byte)((long)PsBuffer.Num(item) & 0xff))); if (list.Count >= 8) break; }
                bytes = list.ToArray();
            }
            else bytes = new byte[0];
            ulong v = 0;
            for (int i = 0; i < bytes.Length && i < 8; i++) v |= (ulong)bytes[i] << (8 * i);
            long sv = unchecked((long)v);
            if (PsBuffer.Num(sign) == 1) sv = unchecked(-sv);
            return sv.ToString(System.Globalization.CultureInfo.InvariantCulture);
        }

        public bool inInt32(object s)
        {
            long v;
            var str = s as string ?? (s is JsValue js && js.IsString() ? js.AsString() : null);
            if (str == null || !long.TryParse(str, out v)) return false;
            return v >= int.MinValue && v <= int.MaxValue;
        }

        public bool isNeg(object s)
        {
            var str = s as string ?? (s is JsValue js && js.IsString() ? js.AsString() : "");
            return str.TrimStart().StartsWith("-");
        }

        public byte[] bytesLE(object s)
        {
            var str = s as string ?? (s is JsValue js && js.IsString() ? js.AsString() : "0");
            long v;
            if (!long.TryParse(str, out v)) v = 0;
            ulong uv = v < 0 ? (ulong)(-v) : (ulong)v;
            var bytes = new List<byte>();
            do { bytes.Add((byte)(uv & 0xff)); uv >>= 8; } while (uv > 0);
            return bytes.ToArray();
        }
    }

    // boot.js 用的宿主桥（就绪上报等）
    public class PsHelpers
    {
        private readonly JsHost _host;
        public PsHelpers(JsHost host) { _host = host; }
        public void notifyReady(object info) { _host.Log.I("READY " + (info == null ? "" : info.ToString())); if (_host.OnServerReady != null) _host.OnServerReady(); }
        public void log(object s) { _host.Log.I(s == null ? "" : s.ToString()); }
        /// <summary>v5 精确进度：JS 侧（__ps_prelude 的 require 钩子）在 bootrun 装配期逐模块上报。
        /// 该阶段（懒执行各模块体 + handler 装配）在 ARM 上约 15s，是启动进度条最大的平台期来源。</summary>
        public void progress(JsValue stage, JsValue pct)
        {
            var act = _host.Progress;
            if (act == null) return;
            var s = stage.IsString() ? stage.AsString() : (stage.IsNull() || stage.IsUndefined() ? "" : stage.ToString());
            act(s, PsBuffer.Num(pct));
        }
        //【Jint 2.11 铁律】变长/可选参数不可用（可选参数不填充），progress 必须恰好 2 参；pct 走
        // PsBuffer.Num(object)（内部兼容 JsValue/number），避免再写一套取数逻辑。
    }

    public class PsXorBridge
    {
        public PsBuffer decrypt(object payload, object seq)
        {
            // Jint 2.11：CLR 对象回传可能被 JsValue 包装 —— 先解包
            var pb = payload as PsBuffer;
            if (pb == null && payload is JsValue jv) pb = jv.ToObject() as PsBuffer;
            if (pb == null) throw new ArgumentException("xor: not a buffer");
            return PsXor.Decrypt(pb, (int)PsBuffer.Num(seq));
        }
    }
}
