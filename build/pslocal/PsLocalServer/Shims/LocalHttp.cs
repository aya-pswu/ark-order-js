// http 垫片：PsHttpServer 支持两种来源——
//   · Bootstrap.Init 经 PsPortHub 预绑定（无引擎，毫秒级占住 8081，内建 responder 秒回配置接口，
//     其余请求挂起等 JS 就绪后派发）
//   · JS http.createServer(cb).listen(...) attach 到预绑定对象（ps_account、/res 等转给 http_router.js）
// 另含 url 垫片（PsUrl / PsSearchParams）与 createReadStream().pipe(res) 的读流实现。
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using Jint;
using Jint.Native;

namespace PsLocalServer.Shims
{
    public class PsSearchParams
    {
        private readonly Dictionary<string, string> _q;
        public PsSearchParams(string query)
        {
            _q = new Dictionary<string, string>(StringComparer.Ordinal);
            if (string.IsNullOrEmpty(query)) return;
            if (query[0] == '?') query = query.Substring(1);
            foreach (var kv in query.Split('&'))
            {
                if (kv.Length == 0) continue;
                var eq = kv.IndexOf('=');
                var k = eq < 0 ? kv : kv.Substring(0, eq);
                var v = eq < 0 ? "" : kv.Substring(eq + 1);
                _q[Uri.UnescapeDataString(k)] = Uri.UnescapeDataString(v);
            }
        }
        public string get(string k) { return _q.TryGetValue(k, out var v) ? v : null; }
        public bool has(string k) { return _q.ContainsKey(k); }
        public string[] keys() { var a = new string[_q.Keys.Count]; _q.Keys.CopyTo(a, 0); return a; }
    }

    public class PsUrl
    {
        public string href;
        public string pathname;
        public string search;
        public PsSearchParams searchParams;

        public PsUrl(string url, string baseUri = null)
        {
            href = url ?? "";
            var u = href;
            int scheme = u.IndexOf("://", StringComparison.Ordinal);
            if (scheme >= 0)
            {
                int slash = u.IndexOf('/', scheme + 3);
                u = slash >= 0 ? u.Substring(slash) : "/";
            }
            int qm = u.IndexOf('?');
            int hash = u.IndexOf('#');
            if (hash >= 0) u = u.Substring(0, hash);
            if (qm >= 0) { search = u.Substring(qm); pathname = u.Substring(0, qm); }
            else { search = ""; pathname = u; }
            if (pathname.Length == 0) pathname = "/";
            searchParams = new PsSearchParams(search);
        }
    }

    public class PsHttpRequest
    {
        public string method;
        public string url;
        public object headers;      // JS plain object（string→string）
        public string body;
    }

    public class PsHttpResponse
    {
        private readonly Socket _sock;
        private readonly NetworkStream _stream;
        private int _status = 200;
        private List<KeyValuePair<string, string>> _headers;
        private bool _headSent;
        private bool _streamed;

        public PsHttpResponse(Socket sock)
        {
            _sock = sock;
            _stream = new NetworkStream(sock, false);
        }

        public void writeHead(object status) { WriteHeadImpl(status, null); }
        public void writeHead(object status, object headersObj) { WriteHeadImpl(status, headersObj); }

        // Jint 2.11 重载绑定实测会丢第二个参数（writeHead(200, {…}) 到达 C# 时 headersObj 为 null，
        // 2026-10-12 公告路由 Content-Type 落到 JSON 兜底、WebView 进"查看源码"模式）。
        // 专设无歧义重载、参数钉死 JsValue（同 createServer(JsValue) 先例）；JS 侧特性检测调用。
        public void writeHeadEx(object status, JsValue headersObj) { WriteHeadImpl(status, headersObj); }

        private void WriteHeadImpl(object status, object headersObj)
        {
            _status = (int)PsBuffer.Num(status);
            _headers = new List<KeyValuePair<string, string>>();
            if (headersObj != null)
                foreach (var kv in JsHost.EnumerateStringMap(headersObj))
                    _headers.Add(kv);
        }

        private void SendHead(long? contentLength)
        {
            if (_headSent) return;
            var sb = new StringBuilder();
            sb.Append("HTTP/1.1 ").Append(_status).Append(' ').Append(Reason(_status)).Append("\r\n");
            bool hasContentType = false;
            if (_headers != null)
            {
                foreach (var kv in _headers)
                {
                    if (string.Equals(kv.Key, "Content-Type", StringComparison.OrdinalIgnoreCase)) hasContentType = true;
                    sb.Append(kv.Key).Append(": ").Append(kv.Value).Append("\r\n");
                }
            }
            if (!hasContentType) sb.Append("Content-Type: application/json; charset=utf-8\r\n");
            if (contentLength.HasValue) sb.Append("Content-Length: ").Append(contentLength.Value).Append("\r\n");
            sb.Append("Connection: close\r\n\r\n");
            var head = Encoding.UTF8.GetBytes(sb.ToString());
            _stream.Write(head, 0, head.Length);
            _headSent = true;
        }

        private static string Reason(int code)
        {
            switch (code)
            {
                case 200: return "OK";
                case 206: return "Partial Content";
                case 301: return "Moved Permanently";
                case 403: return "Forbidden";
                case 404: return "Not Found";
                case 416: return "Range Not Satisfiable";
                case 503: return "Service Unavailable";
                default: return "OK";
            }
        }

        public void write(object data)
        {
            SendHead(null); // 流式模式：靠 close 收尾
            _streamed = true;
            WriteBody(data);
        }

        public void end() { EndImpl(null); }
        public void end(object data) { EndImpl(data); }
        private void EndImpl(object data)
        {
            if (!_streamed)
            {
                long len = DataLength(data);
                SendHead(len);
                if (data != null) WriteBody(data);
            }
            else if (data != null)
            {
                WriteBody(data);
            }
            _stream.Flush();
            try { _sock.Close(); } catch { }
        }

        private static long DataLength(object data)
        {
            if (data == null) return 0;
            if (data is PsBuffer b) return b.Length;
            if (data is string s) return Encoding.UTF8.GetByteCount(s);
            if (data is byte[] bytes) return bytes.Length;
            if (data is JsValue jv && jv.IsString()) return Encoding.UTF8.GetByteCount(jv.AsString());
            if (data is JsValue jv2)
            {
                var unwrapped = jv2.ToObject();
                if (unwrapped is PsBuffer pb) return pb.Length;
            }
            return 0;
        }

        private void WriteBody(object data)
        {
            if (data == null) return;
            byte[] arr = null;
            if (data is PsBuffer b) arr = b.toArray();
            else if (data is string s) arr = Encoding.UTF8.GetBytes(s);
            else if (data is byte[] bytes) arr = bytes;
            else if (data is JsValue jv)
            {
                if (jv.IsString()) arr = Encoding.UTF8.GetBytes(jv.AsString());
                else
                {
                    var unwrapped = jv.ToObject();
                    if (unwrapped is PsBuffer pb) arr = pb.toArray();
                }
            }
            if (arr == null) throw new ArgumentException("res body: unsupported " + data.GetType().Name);
            _stream.Write(arr, 0, arr.Length);
        }
    }

    /// <summary>fs.createReadStream 返回值：只实现 server 代码用到的 .pipe(res)。</summary>
    public class PsReadStream
    {
        private readonly FsHost _fs;
        private readonly string _vpath;
        private readonly long _start, _end; // 闭区间

        public PsReadStream(FsHost fs, string vpath, long start, long end)
        {
            _fs = fs; _vpath = vpath; _start = start; _end = end;
        }

        public void pipe(object dest)
        {
            var res = dest as PsHttpResponse;
            if (res == null && dest is JsValue jv) res = jv.ToObject() as PsHttpResponse; // Jint 2.11 包装解包
            if (res == null) throw new NotSupportedException("pipe target: " + (dest == null ? "null" : dest.GetType().Name));
            var path = _fs.Env.Map(_vpath);
            using (var stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 64 * 1024))
            {
                long len = _end >= 0 ? _end - _start + 1 : stream.Length - _start;
                stream.Seek(_start, SeekOrigin.Begin);
                var buf = new byte[64 * 1024];
                long left = len;
                while (left > 0)
                {
                    int want = (int)Math.Min(buf.Length, left);
                    int n = stream.Read(buf, 0, want);
                    if (n <= 0) break;
                    var chunk = new byte[n];
                    Array.Copy(buf, chunk, n);
                    res.write(new PsBuffer(chunk));
                    left -= n;
                }
            }
            res.end();
        }
    }

    public class PsHttpServer
    {
        private readonly JsHost _host;           // JS attach 后可用；预绑定阶段为 null
        private TcpListener _listener;
        private int _jsAttached;                 // 0=否 1=是
        private object _jsLock = new object();
        private int _jsAttachedRead() { lock (_jsLock) return _jsAttached; }
        private void _jsAttachedSet(int v) { lock (_jsLock) _jsAttached = v; }
        private JsValue _requestCb;
        private JsValue _listeningCb;
        private JsValue _errorCb;
        private Func<string, string, string> _builtin; // (method, url) → body 或 null
        private readonly List<Socket> _held = new List<Socket>();
        private volatile PsHttpServer _delegateTo;    // 预绑定对象 → attach 后的 JS 对象（accept 委派）
        public bool HasEngine { get { return _host != null; } }
        private volatile bool _stopped;

        public int Port { get; private set; } = -1;
        public bool Taken { get; set; }

        public PsHttpServer(JsHost host) { _host = host; }

        // Bootstrap 预绑定：绑端口 + 内建应答器，请求挂起等 JS
        public void ListenBuiltin(int port)
        {
            _builtin = PsPortHub.BuiltinHttpRespond;
            Bind(port);
            BeginAccept();
        }

        internal TcpListener Listener { get { return _listener; } }
        internal List<Socket> TakeHeld() { lock (_held) { var h = new List<Socket>(_held); _held.Clear(); return h; } }
        internal void StopAccepting() { _stopped = true; }

        private void Bind(int p)
        {
            Port = p;
            _listener = new TcpListener(IPAddress.Any, p);
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
            string bind = host is string h && h.Length > 0 ? h : "0.0.0.0";
            // 第 3 参是 listening 回调（Node 语义；net_check.listenGuarded 的 onReady 挂在这里）
            if (callback != null && !callback.IsUndefined() && !callback.IsNull()) on("listening", callback);

            if (AttachToPrebound(p, bind)) return;

            try
            {
                Bind(p);
                // 非预绑定（PC/直连）：此刻 JS 回调已注册（createServer→on('request')），
                // 直接把连接派发给 JS —— 不置位会走 HandlePreJsSocket 挂起 120s
                _jsAttachedSet(1);
                _host.Enqueue(FireListening);
                BeginAccept();
            }
            catch (Exception e)
            {
                _host.Enqueue(() => FireError(_host.MakeError(e, p)));
            }
        }

        private void FireListening()
        {
            if (_listeningCb != null)
            {
                try { _host.Engine.Invoke(_listeningCb); } catch (Exception e) { PsLog.Sink("listening err " + e.Message); }
            }
        }

        private void FireError(JsValue err)
        {
            if (_errorCb != null)
            {
                try { _host.Engine.Invoke(_errorCb, err); } catch (Exception e) { PsLog.Sink("error err " + e.Message); }
            }
        }

        // JS 请求回调入口（JsHost.HandleHttpSocket 调用）
        internal void InvokeRequest(JsValue req, JsValue res)
        {
            if (_requestCb == null) { PsLog.Sink("!! no http request callback"); return; }
            _host.Engine.Invoke(_requestCb, req, res);
        }

        public void on(string ev, JsValue fn)
        {
            if (ev == "listening") _listeningCb = fn;
            else if (ev == "error") _errorCb = fn;
            else if (ev == "request") _requestCb = fn;
        }

        internal bool AttachToPrebound(int port, string bind)
        {
            var pre = PsPortHub.TakeHttp(port);
            if (pre == null) return false;
            _jsAttachedSet(1);
            pre._delegateTo = this;   // 预绑定对象后续 accept 的连接也委派给 JS（两个 accept 循环共享同一 listener）
            pre._jsAttachedSet(1);    // 放行挂起线程的等待（避免 120s 后向已派发 socket 补写 503）
            _listener = pre.Listener;
            var held = pre.TakeHeld();
            foreach (var s in held) _host.HandleHttpSocket(s, this); // 挂起中的请求派发给 JS
            _host.Enqueue(FireListening);
            BeginAccept();
            return true;
        }

        private void BeginAccept()
        {
            var server = this;
            _listener.BeginAcceptSocket(ar =>
            {
                if (_stopped) return;
                try
                {
                    var sock = _listener.EndAcceptSocket(ar);
                    var del = _delegateTo;
                    if (del != null && del._host != null)
                        del._host.HandleHttpSocket(sock, del);          // 预绑定对象的循环：委派给 JS
                    else if (_jsAttachedRead() == 1 && _host != null)
                        _host.HandleHttpSocket(sock, server);
                    else
                        HandlePreJsSocket(sock, server);
                    BeginAccept();
                }
                catch (ObjectDisposedException) { return; }
                catch (Exception) { }
            }, null);
        }

        // JS 未就绪阶段的请求处理：内建 responder 秒回；其余挂起等 JS（超时 503）
        private void HandlePreJsSocket(Socket sock, PsHttpServer server)
        {
            try
            {
                var del0 = _delegateTo;   // attach 竞态：连接在委派置位前后到达
                if (del0 != null && del0._host != null) { del0._host.HandleHttpSocket(sock, del0); return; }
                var req = HttpReader.Read(sock);
                if (req == null) { try { sock.Close(); } catch { } return; }
                string body;
                body = _builtin != null ? _builtin(req.Method, req.Url) : null;
                if (body != null)
                {
                    var res = new PsHttpResponse(sock);
                    res.end(body);
                    return;
                }
                lock (_held) _held.Add(sock);
                System.Threading.ThreadPool.QueueUserWorkItem(_ =>
                {
                    var sw = System.Diagnostics.Stopwatch.StartNew();
                    while (_jsAttachedRead() == 0 && sw.ElapsedMilliseconds < 120000)
                        System.Threading.Thread.Sleep(250);
                    bool stillHeld;
                    lock (_held) stillHeld = _held.Remove(sock);
                    if (!stillHeld) return;   // attach 时已被 TakeHeld 派发给 JS —— 不能再写响应
                    var del = _delegateTo;
                    if (del != null && del._host != null) { del._host.HandleHttpSocket(sock, del); return; }
                    if (server.HasEngine) { _host.HandleHttpSocket(sock, server); return; }
                    try
                    {
                        var res = new PsHttpResponse(sock);
                        res.writeHead(503);
                        res.end("{\"ret\":\"0\",\"msg\":\"server starting\"}");
                    }
                    catch { }
                });
            }
            catch (Exception)
            {
                try { sock.Close(); } catch { }
            }
        }

        public void close() { try { _listener.Stop(); } catch { } }
    }

    /// <summary>最小 HTTP 请求解析（request line + headers + Content-Length body）。</summary>
    public class HttpReader
    {
        public string Method;
        public string Url;
        public Dictionary<string, string> Headers = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        public string Body;

        public static HttpReader Read(Socket sock)
        {
            sock.ReceiveTimeout = 15000;
            var buf = new byte[16 * 1024];
            var total = new MemoryStream();
            int headEnd = -1;
            while (headEnd < 0 && total.Length < buf.Length)
            {
                int n = sock.Receive(buf, 0, buf.Length, SocketFlags.None);
                if (n <= 0) break;
                total.Write(buf, 0, n);
                headEnd = FindHeadEnd(total);
            }
            if (headEnd < 0) return null;
            var all = total.ToArray();
            var headText = Encoding.UTF8.GetString(all, 0, headEnd);
            var lines = headText.Replace("\r\n", "\n").Split('\n');
            var first = lines[0].Split(' ');
            if (first.Length < 2) return null;
            var r = new HttpReader { Method = first[0], Url = first[1] };
            for (int i = 1; i < lines.Length; i++)
            {
                var line = lines[i];
                var c = line.IndexOf(':');
                if (c <= 0) continue;
                r.Headers[line.Substring(0, c).Trim()] = line.Substring(c + 1).Trim();
            }
            int bodyLen = 0;
            string cl;
            if (r.Headers.TryGetValue("Content-Length", out cl)) int.TryParse(cl.Trim(), out bodyLen);
            var body = new MemoryStream();
            body.Write(all, headEnd + 4, all.Length - headEnd - 4);
            var rb = new byte[16 * 1024];
            while (body.Length < bodyLen)
            {
                int n = sock.Receive(rb, 0, rb.Length, SocketFlags.None);
                if (n <= 0) break;
                body.Write(rb, 0, n);
            }
            r.Body = Encoding.UTF8.GetString(body.ToArray(), 0, (int)Math.Min(body.Length, bodyLen));
            return r;
        }

        private static int FindHeadEnd(MemoryStream ms)
        {
            var arr = ms.ToArray();
            for (int i = 0; i + 3 < arr.Length; i++)
                if (arr[i] == 13 && arr[i + 1] == 10 && arr[i + 2] == 13 && arr[i + 3] == 10) return i;
            return -1;
        }
    }
}
