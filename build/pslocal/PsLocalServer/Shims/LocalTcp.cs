// net 垫片：PsTcpServer 支持两种来源——
//   · Bootstrap.Init 经 PsPortHub 预绑定（无引擎，毫秒级占住端口，连接先挂起）
//   · JS net.createServer(cb).listen(...) attach 到预绑定对象（连接/数据随后进 JS）
// 方法名与 Node 完全一致。PsEmitter 的 Engine 允许为 null（预绑定阶段无引擎）。
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using Jint;
using Jint.Native;

namespace PsLocalServer.Shims
{
    public class PsEmitter
    {
        protected Engine Engine;
        private readonly Dictionary<string, List<JsValue>> _handlers = new Dictionary<string, List<JsValue>>();

        public PsEmitter(Engine engine) { Engine = engine; }

        public void on(string ev, JsValue fn)
        {
            if (!_handlers.TryGetValue(ev, out var l)) { l = new List<JsValue>(); _handlers[ev] = l; }
            l.Add(fn);
        }

        public void removeListener(string ev, JsValue fn)
        {
            if (_handlers.TryGetValue(ev, out var l)) l.Remove(fn);
        }

        public void Emit(string ev, params JsValue[] args)
        {
            if (Engine == null) return; // 预绑定阶段无 JS 回调
            if (!_handlers.TryGetValue(ev, out var l)) return;
            foreach (var fn in l.ToArray())
            {
                try { Engine.Invoke(fn, args); }
                catch (System.Exception e) { PsLog.Sink("emit " + ev + " handler error: " + Describe(e)); }
            }
        }

        /// <summary>异常详情（含 Jint JavaScriptException 的 JS 调用栈 + CLR TargetSite，定位用）。</summary>
        internal static string Describe(System.Exception e)
        {
            var s = e.GetType().FullName + ": " + e.Message;
            try
            {
                if (e.TargetSite != null)
                    s += "\n  TargetSite = " + (e.TargetSite.DeclaringType != null ? e.TargetSite.DeclaringType.FullName + "." : "") + e.TargetSite.Name;
            }
            catch { }
            try
            {
                if (!string.IsNullOrEmpty(e.StackTrace))
                {
                    var lines = e.StackTrace.Split('\n');
                    var head = new System.Text.StringBuilder();
                    for (int i = 0; i < lines.Length && i < 4; i++) head.Append(lines[i].Trim()).Append(" | ");
                    s += "\n  CLR-Stack: " + head;
                }
            }
            catch { }
            try
            {
                foreach (var prop in e.GetType().GetProperties())
                {
                    if (prop.Name != "Message" && prop.Name != "StackTrace" && prop.Name != "InnerException" && prop.Name != "Data" && prop.Name != "TargetSite" && prop.Name != "Source" && prop.Name != "HResult" && prop.Name != "HelpLink")
                    {
                        var v = prop.GetValue(e, null);
                        if (v != null && v.ToString().Length > 0) s += "\n  " + prop.Name + " = " + v;
                    }
                }
            }
            catch { }
            if (e.InnerException != null) s += "\nINNER: " + e.InnerException.GetType().FullName + ": " + e.InnerException.Message;
            return s;
        }
    }

    public class PsTcpSocket : PsEmitter
    {
        public readonly long SessionId;
        private JsHost _host;
        private TcpClient _client;
        private NetworkStream _stream;
        private volatile bool _closed;
        private readonly string _remoteAddress;
        private readonly object _writeLock = new object();

        public PsTcpSocket(JsHost host, long sessionId, TcpClient client) : base(host?.Engine)
        {
            _host = host; SessionId = sessionId; _client = client;
            _stream = client.GetStream();
            // 发送超时兜底：客户端不读时，阻塞写不能无限期占着写线程（19MB 正常 <1s）。
            try
            {
                client.Client.SendTimeout = 20000;
                // Android Mono 的 NetworkStream 对大量小块 Write 会在每块边界重新进入
                // 回环流控，19MB 帧因此退化为约 1 秒/MB。发送缓冲给足，配合下方
                // 专用线程的单次 Write，让内核一次性推进整帧。
                client.Client.SendBufferSize = 4 * 1024 * 1024;
            }
            catch { }
            var ep = (IPEndPoint)client.Client.RemoteEndPoint;
            _remoteAddress = ep != null ? ep.Address.ToString() : "127.0.0.1";
        }

        public string remoteAddress { get { return _remoteAddress; } }

        public void write(object data)
        {
            if (_closed) return;
            var buf = data as PsBuffer;
            if (buf == null && data is JsValue jv)
            {
                var unwrapped = jv.ToObject();
                if (unwrapped is PsBuffer pbU) buf = pbU;
            }
            if (buf == null && data is string s) buf = new PsBuffer(PsBuffer.EncodeString(s, "utf8"));
            if (buf == null) throw new ArgumentException("sock.write: unsupported " + (data == null ? "null" : data.GetType().Name));
            // ★ 2026-09-15 真机教训：19MB 的 Lua 帧【同步写】会把 Jint 单工作线程永久堵死。
            //   设备实测：lua_remote 推帧后，HTTP(8081) 与游戏服(9021) 全部停止响应
            //   （端口仍在 LISTEN，但 Jint 工作线程卡在 _stream.Write 的 TCP 流控上），
            //   客户端因此一直停在「资源下载中」死等 —— 这就是"每次进游戏等待严重"的主因。
            //   对策：超过阈值的写入走【异步分片】，用 BeginWrite 链式推进，
            //   每片完成由 IOCP 回调驱动，绝不占住工作线程。
            if (buf.Length > LARGE_WRITE_THRESHOLD)
            {
                WriteOnOwnThread(buf);
                return;
            }
            lock (_writeLock)
            {
                try { _stream.Write(buf.Data, 0, buf.Length); _stream.Flush(); }
                catch (Exception e) { _host?.NotifySocketError(this, e); }
            }
        }

        private const int LARGE_WRITE_THRESHOLD = 256 * 1024;   // >256KB 交给专用写线程
        private volatile bool _writeInFlight;                   // 有专用写线程在跑
        private volatile bool _endRequested;                    // end() 已请求半关闭（写线程完成后补做）

        /// <summary>
        /// 大块写（Lua 热更 19MB 整帧）在【专用线程】上做阻塞写，写完整帧再半关闭。
        ///
        /// ★ 2026-09-15 二次返工（血泪结论，别再改回 BeginWrite 链）：
        ///   1) 最初用同步 `_stream.Write(19MB)` —— 设备实测**能完整送达**（客户端日志
        ///      `接收到包体大小:19025377`）。
        ///   2) 后来改成 `BeginWrite` 分片链 + 60s 回收看门狗 —— 设备上再没成功过，
        ///      日志固定在推送开始后 **整 60 秒**报 `EndWrite failure`：那是看门狗到点
        ///      强制 `Shutdown(Send)`，把还在途中的写片**截断**了（异步链在设备 mono 上
        ///      根本没推进）。客户端 `ReceiveLuaFile()` 于是永远等不到剩余字节 → 卡「启动中」。
        ///   3) 现在这版取两者之长：Jint 工作线程**不阻塞**（只起线程就返回），
        ///      数据用**阻塞写**交给内核做流控（与 PC 端 node libuv 的最终效果一致），
        ///      半关闭**只由写线程在最后一字节写完后**发起 —— 结构上不可能截断。
        /// </summary>
        private void WriteOnOwnThread(PsBuffer buf)
        {
            if (_writeInFlight)
            {
                // 同一连接上并发大块写在本项目里不存在；真出现就直接同步写完（正确性优先）
                try { WriteAll(buf.Data, buf.Length); } catch (Exception e) { _host?.NotifySocketError(this, e); }
                return;
            }
            _writeInFlight = true;
            var data = buf.Data;
            int len = buf.Length;
            var th = new System.Threading.Thread(() =>
            {
                try { WriteAll(data, len); _stream.Flush(); }
                catch (Exception e) { _host?.NotifySocketError(this, e); }
                finally
                {
                    _writeInFlight = false;
                    if (_endRequested) DoShutdownSend();
                }
            });
            th.IsBackground = true;
            th.Name = "psSockWriter";
            th.Start();
        }

        /// <summary>在专用线程中一次性写完整帧。不要切 256KB 小块：Pad 7 的 Mono
        /// 回环 TCP 在每个小块边界都会重新等待窗口，19MB 帧会退化到一分钟级。</summary>
        private void WriteAll(byte[] data, int len)
        {
            if (_closed || len <= 0) return;
            lock (_writeLock)
            {
                _stream.Write(data, 0, len);
            }
        }

        private void DoShutdownSend()
        {
            if (_closed) return;
            try { _client.Client.Shutdown(SocketShutdown.Send); } catch { }
        }

        // 半关闭：Node sock.end([chunk]) —— 可带最后一块数据
        // 【Jint 2.11】按精确参数个数重载（可选参数不填充）
        public void end() { EndImpl(null); }
        public void end(object data) { EndImpl(data); }
        private void EndImpl(object data)
        {
            if (data != null) write(data);   // 大块写走专用线程，见 WriteOnOwnThread()
            if (_closed) return;

            // ★ 2026-09-15 真机教训：只 Shutdown(Send) 从不 Close 会【泄漏连接】。
            //   设备实测：每次启动游戏在 44587（Lua 端口）留下一个 CLOSE_WAIT，
            //   累积几个之后 accept 队列被占满 → 新连接进不来 → 客户端"资源下载中"死等
            //   （首次启动能进游戏、之后越等越久）。Node 语义：end() 半关闭写端，
            //   对端 FIN 后 socket 自动销毁 —— 这里补上回收（读到 EOF 立即 Close，
            //   对端始终不发 FIN 也有超时兜底），否则每次调用泄漏一个 fd。
            //
            // ★ 半关闭的时机：若专用写线程仍在推大块数据，【绝不能】此刻 Shutdown(Send)——
            //   会截断未发完的整帧（客户端一直等剩余字节 = 卡「启动中」）。
            //   置位 _endRequested，由写线程写完最后一字节后补做（结构上不会截断）。
            if (_writeInFlight)
            {
                _endRequested = true;
                StartCloseWatcher(_host);
                return;
            }
            DoShutdownSend();
            if (_host != null) StartCloseWatcher(_host);
        }

        /// <summary>
        /// 半关闭后的回收：等读到 EOF 立即 Close；超时也强制 Close（防 CLOSE_WAIT 累积）。
        /// 注意这里【不再】有"等写片完成再 Shutdown"的第一阶段 —— 半关闭归写线程，见 EndImpl。
        /// </summary>
        private void StartCloseWatcher(JsHost host)
        {
            var th = new System.Threading.Thread(() =>
            {
                try
                {
                    // 阶段一：等专用写线程把帧推完再开始计空闲。
                    //   ★ 这里【绝不做 Shutdown】—— 半关闭归写线程（老代码在看门狗里抢着 Shutdown，
                    //     把在途的 19MB 截断成半帧，客户端就永远卡在「启动中」）。
                    //   SendTimeout=20s 已给写线程兜底上界，这里再给 300s 余量（慢客户端也不误杀）。
                    for (int i = 0; i < 3000 && _writeInFlight && !_closed; i++)
                        System.Threading.Thread.Sleep(100);

                    // 阶段二：等读循环给出 EOF（OnSocketData(null) 会 CloseQuietly）；客户端读完不关连接时兜底。
                    for (int i = 0; i < 600; i++)
                    {
                        if (_closed) return;
                        System.Threading.Thread.Sleep(100);
                    }
                    if (!_closed)
                    {
                        CloseQuietly();
                        // 强制关闭路径不走读循环，需自己把 socket 从 JsHost 表里摘掉并发 close 事件，
                        // 否则 _sockets 字典会残留条目（与读循环 EOF 路径的行为保持一致）。
                        try { host.NotifySocketClosed(this); } catch { }
                    }
                }
                catch { }
            });
            th.IsBackground = true;
            th.Name = "psSockReaper";
            th.Start();
        }

        public void destroy()
        {
            _closed = true;
            try { _client.Close(); } catch { }
            _host?.NotifySocketClosed(this);
        }

        internal void StartReadLoop(JsHost host)
        {
            // ★ 每次读都用新 buffer：原实现共用同一个 buf，异步回调完成前若再次 BeginRead
            //   会把上一批数据覆盖（串包）。成本可忽略，正确性优先。
            Action readMore = null;
            readMore = () =>
            {
                if (_closed) return;
                var buf = new byte[64 * 1024];
                _stream.BeginRead(buf, 0, buf.Length, ar =>
                {
                    int n = 0;
                    try { n = _stream.EndRead(ar); }
                    catch { n = 0; }
                    if (n <= 0) { _closed = true; host.OnSocketData(this, null); return; }
                    var data = new byte[n];
                    Array.Copy(buf, data, n);
                    CheckAndFastReplyHeartbeat(data);
                    host.OnSocketData(this, data);
                    if (!_closed) readMore();
                }, null);
            };
            readMore();
        }

        private void CheckAndFastReplyHeartbeat(byte[] data)
        {
            if (data == null || data.Length < 5) return;
            // 游戏服心跳：客户端以 5 字节定长帧 [00 00 00 01 ff] 发送心跳包
            for (int i = 0; i <= data.Length - 5; i++)
            {
                if (data[i] == 0x00 && data[i + 1] == 0x00 && data[i + 2] == 0x00 && data[i + 3] == 0x01 && data[i + 4] == 0xff)
                {
                    try
                    {
                        var resp = new byte[9];
                        resp[0] = 0x00; resp[1] = 0x00; resp[2] = 0x00; resp[3] = 0x05;
                        resp[4] = 0xff;
                        uint now = (uint)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
                        resp[5] = (byte)((now >> 24) & 0xff);
                        resp[6] = (byte)((now >> 16) & 0xff);
                        resp[7] = (byte)((now >> 8) & 0xff);
                        resp[8] = (byte)(now & 0xff);
                        lock (_writeLock)
                        {
                            _stream.Write(resp, 0, 9);
                            _stream.Flush();
                        }
                    }
                    catch { }
                    break;
                }
            }
        }

        internal void CloseQuietly()
        {
            _closed = true;
            try { _client.Close(); } catch { }
        }
    }

    public class PsTcpServer : PsEmitter
    {
        private JsHost _host;           // JS attach 后可用；预绑定阶段为 null
        private TcpListener _listener;
        private string _bindAddress = "0.0.0.0";
        private readonly List<TcpClient> _held = new List<TcpClient>();
        private long _nextSession = 1;
        private volatile bool _stopped;
        private volatile PsTcpServer _delegateTo;   // 预绑定对象 → attach 后的 JS 对象（accept 委派）

        public int Port { get; private set; } = -1;
        public bool Taken { get; set; }

        public PsTcpServer(JsHost host) : base(host?.Engine) { _host = host; }

        // Bootstrap 预绑定：只绑 OS 端口，连接挂起，等 JS attach
        public void ListenBuiltin(int port)
        {
            Bind(port);
            BeginAccept();
        }

        internal TcpListener Listener { get { return _listener; } }
        internal List<TcpClient> TakeHeld() { lock (_held) { var h = new List<TcpClient>(_held); _held.Clear(); return h; } }
        internal void StopAccepting() { _stopped = true; }

        private void Bind(int p)
        {
            Port = p;
            var addr = _bindAddress == "0.0.0.0" ? IPAddress.Any : IPAddress.Parse(_bindAddress);
            _listener = new TcpListener(addr, p);
            _listener.Server.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
            _listener.Start();
        }

        // 【Jint 2.11】回调形参必须声明 JsValue（object 形参下 JS 函数会变成 Delegate，Invoke 即 NRE）
        public void listen(object port) { ListenImpl(port, null, null); }
        public void listen(object port, object host) { ListenImpl(port, host, null); }
        public void listen(object port, object host, JsValue callback) { ListenImpl(port, host, callback); }
        private void ListenImpl(object port, object host, JsValue callback)
        {
            int p = (int)PsBuffer.Num(port);
            if (host is string h && h.Length > 0) _bindAddress = h;
            if (callback != null && !callback.IsUndefined() && !callback.IsNull()) on("listening", callback);

            // 预绑定端口：JS attach（连接事件补发给 JS），不重复 bind
            if (AttachToPrebound(p)) return;

            try
            {
                Bind(p);
                // 非预绑定（PC/直连）：此刻 JS 回调已注册（createServer→on('connection')），
                // 直接把连接派发给 JS —— 不置位会走"挂起"分支且永远无人接管
                lock (_jsLock) JsAttached = 1;
                _host.Enqueue(() => Emit("listening"));
                BeginAccept();
            }
            catch (Exception e)
            {
                _host.Enqueue(() => Emit("error", _host.MakeError(e, p)));
            }
        }

        internal bool AttachToPrebound(int port)
        {
            var pre = PsPortHub.TakeTcp(port);
            if (pre == null) return false;
            _listener = pre.Listener;
            Engine = _host.Engine; // 预绑定对象此刻获得引擎
            lock (_jsLock) JsAttached = 1;
            pre._delegateTo = this; // 先置委派：竞态窗口内 pre 的 in-flight accept 也由新对象派发
            pre.StopAccepting();
            var held = pre.TakeHeld();
            _host.Enqueue(() =>
            {
                Emit("listening");
                foreach (var client in held) HandleAcceptedClient(client);
            });
            // 后续新连接照常进 JS
            BeginAccept();
            return true;
        }

        /// <summary>把已接受的连接派发给 JS（connection 事件 + 读循环）。attach 竞态时预绑定对象也调用这里。</summary>
        internal void HandleAcceptedClient(TcpClient client)
        {
            if (_host == null) { try { client.Close(); } catch { } return; }
            var sock = _host.CreateSocket(client);
            _host.Enqueue(() => Emit("connection", JsValue.FromObject(Engine, sock)));
            sock.StartReadLoop(_host);
        }

        private void BeginAccept()
        {
            var listener = _listener;
            listener.BeginAcceptTcpClient(ar =>
            {
                TcpClient client = null;
                try { client = listener.EndAcceptTcpClient(ar); }
                catch (ObjectDisposedException) { return; }
                catch (Exception e) { if (_host != null) _host.Enqueue(() => Emit("error", _host.MakeError(e, 0))); return; }

                // attach 竞态：预绑定对象在途 accept → 委派给新主人（先于 _stopped 判断，别丢连接）
                var del = _delegateTo;
                if (del != null) { del.HandleAcceptedClient(client); return; }
                if (_stopped) { try { client.Close(); } catch { } return; }

                if (JsAttachedLocal() == 0 || _host == null)
                {
                    // JS 未就绪：挂起连接（读循环都不启动，数据由内核缓冲）
                    lock (_held) _held.Add(client);
                }
                else
                {
                    HandleAcceptedClient(client);
                }
                BeginAccept();
            }, null);
        }

        internal int JsAttached = 0;
        private readonly object _jsLock = new object();
        internal int JsAttachedLocal() { lock (_jsLock) return JsAttached; }

        public void close() { try { _listener.Stop(); } catch { } }
    }
}
