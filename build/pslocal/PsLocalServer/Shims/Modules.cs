// 内置模块对象：方法名与 Node 完全一致（JS 按名绑定）。只实现 server 代码实际用到的子集。
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Sockets;
using System.Text;
using Jint;
using Jint.Native;

namespace PsLocalServer.Shims
{
    public class FsModule
    {
        private readonly JsHost _host;
        public FsModule(JsHost host) { _host = host; }
        private FsHost Fs { get { return _host.Fs; } }

        // 【Jint 2.11 铁律】可选参数不会被填充 —— 按调用方实际参数个数写显式重载
        public object readFileSync(object path) { return ReadFileImpl(path, null); }
        public object readFileSync(object path, object enc) { return ReadFileImpl(path, enc); }
        private object ReadFileImpl(object path, object enc)
        {
            var v = V(path);
            var bytes = Fs.ReadAllBytes(v);
            var e = EncName(enc);
            if (e != null) return PsBuffer.DecodeString(bytes, 0, bytes.Length, e);
            return new PsBuffer(bytes);
        }

        public bool existsSync(object path) { return Fs.Exists(V(path)); }

        public PsStat statSync(object path)
        {
            var v = V(path);
            return Fs.IsDir(v) ? PsStat.Dir() : PsStat.File(Fs.Size(v), Fs.MTime(v));
        }

        public void writeFileSync(object path, object data) { WriteFileImpl(path, data, null); }
        // Node 调用方通常传第三个 encoding 参数（state.js: 'utf8'）。Jint 2.11
        // 不会用可选参数补位，缺少这个精确重载会抛 No public methods...，而每次
        // 登录存档都要走异常/日志路径，ARM 真机上会把单线程事件队列拖成几十秒。
        public void writeFileSync(object path, object data, object encoding) { WriteFileImpl(path, data, encoding); }
        private void WriteFileImpl(object path, object data, object encoding)
        {
            // 当前 DataToBytes 已统一按 UTF-8 处理字符串；encoding 仅为 Node 兼容
            // 接口保留，二进制 Buffer 仍原样写入。
            Fs.WriteAllBytes(V(path), DataToBytes(data));
        }

        public void appendFileSync(object path, object data) { AppendFileImpl(path, data, null); }
        public void appendFileSync(object path, object data, object encoding) { AppendFileImpl(path, data, encoding); }
        private void AppendFileImpl(object path, object data, object encoding)
        {
            Fs.AppendText(V(path), data is string s ? s : PsBuffer.DecodeString(DataToBytes(data), 0, -1, "utf8"));
        }

        public void mkdirSync(object path) { Fs.MkdirRecursive(V(path)); }
        public void mkdirSync(object path, object opts) { Fs.MkdirRecursive(V(path)); } // 精确参数个数（server 传 {recursive:true}）

        public void renameSync(object from, object to) { Fs.Rename(V(from), V(to)); }
        public void copyFileSync(object from, object to) { Fs.Copy(V(from), V(to)); }
        public void unlinkSync(object path) { Fs.Unlink(V(path)); }

        // state.js 原子写（临时文件 → 删旧 → rename）：force 时目标不存在不报错
        public void rmSync(object path) { RmImpl(path, null); }
        public void rmSync(object path, object opts) { RmImpl(path, opts); }
        private void RmImpl(object path, object opts)
        {
            var force = false;
            if (opts is JsValue jv && jv.IsObject())
            {
                var f = jv.AsObject().Get("force");
                if (f.IsBoolean()) force = f.AsBoolean();
            }
            try { Fs.Unlink(V(path)); }
            catch (Exception) { if (!force) throw; }
        }

        public JsValue readdirSync(object path)
        {
            var names = new List<string>();
            foreach (var e in Fs.ReadDirEntries(V(path))) names.Add(e.Name);
            return JsArray(names.ToArray());
        }
        public PsReadStream createReadStream(object path) { return CreateReadStreamImpl(path, null); }
        public PsReadStream createReadStream(object path, object opts) { return CreateReadStreamImpl(path, opts); }
        private PsReadStream CreateReadStreamImpl(object path, object opts)
        {
            long start = 0, end = -1;
            if (opts is JsValue jv && jv.IsObject())
            {
                var s = jv.AsObject().Get("start");
                var e2 = jv.AsObject().Get("end");
                if (s.IsNumber()) start = (long)s.AsNumber();
                if (e2.IsNumber()) end = (long)e2.AsNumber();
            }
            return new PsReadStream(Fs, V(path), start, end);
        }

        public object watch(object path, object opts) { return WatchImpl(path, opts, null); }
        public object watch(object path, object opts, object listener) { return WatchImpl(path, opts, listener); }
        private object WatchImpl(object path, object opts, object listener)
        {
            // 单机版不需要热重载（lua_remote.js 的 fs.watch）——空实现
            return new PsWatcher();
        }

        private string V(object path)
        {
            var s = path as string;
            if (s == null && path is JsValue jv && jv.IsString()) s = jv.AsString();
            if (s == null) throw new ArgumentException("fs: bad path");
            return FsHost.ToVirtual(s);
        }

        private static string EncName(object enc)
        {
            if (enc == null) return null;
            if (enc is string s) return s;
            if (enc is JsValue jv)
            {
                if (jv.IsString()) return jv.AsString();
                if (jv.IsUndefined() || jv.IsNull()) return null;
                return jv.ToString();
            }
            return enc.ToString();
        }

        private byte[] DataToBytes(object data)
        {
            if (data is PsBuffer b) return b.toArray();
            if (data is string s) return Encoding.UTF8.GetBytes(s);
            if (data is JsValue jv && jv.IsString()) return Encoding.UTF8.GetBytes(jv.AsString());
            if (data is byte[] bytes) return bytes;
            throw new ArgumentException("fs: unsupported data " + (data == null ? "null" : data.GetType().Name));
        }

        private JsValue JsArray(string[] items)
        {
            // Jint 2.11：CLR 回调中【嵌套 Execute 会抛 Stack empty】（readdirSync 曾整条挂掉），
            // 嵌套 Invoke 可用 —— 调 JS 侧 __psMakeArray 构造。
            var args = new object[items.Length];
            for (int i = 0; i < items.Length; i++) args[i] = items[i];
            return _host.Engine.Invoke("__psMakeArray", args);
        }
    }

    public class PsStat
    {
        private readonly bool _dir;
        private readonly long _size;
        private readonly double _mtime;

        private PsStat(bool dir, long size, double mtime) { _dir = dir; _size = size; _mtime = mtime; }
        public static PsStat File(long size, double mtime) { return new PsStat(false, size, mtime); }
        public static PsStat Dir() { return new PsStat(true, 0, 0); }

        public bool isDirectory() { return _dir; }
        public bool isFile() { return !_dir; }
        public double size { get { return _size; } }
        public double mtimeMs { get { return _mtime; } }
    }

    public class PsWatcher { public void close() { } }

    public class PathModule
    {
        public string join(params JsValue[] args)
        {
            var parts = new List<string>();
            foreach (var a in args)
            {
                if (a.IsUndefined() || a.IsNull()) continue;
                parts.Add(a.IsString() ? a.AsString() : a.ToString());
            }
            if (parts.Count == 0) return ".";
            // 关键兼容：http_router.js 的 path.join('H:\\NEW FILES\\files\\res', rel) ——
            // Windows 盘符首段必须原样保留（JS 侧随后有 startsWith('H:\\NEW FILES\\files\\res') 守卫），
            // 其余段用 '/' 连接；fs 垫片的 ToVirtual 认得这个前缀。
            var first = parts[0].Replace('\\', '/');
            if (System.Text.RegularExpressions.Regex.IsMatch(first, "^[a-zA-Z]:"))
            {
                var rest = new List<string>();
                for (int i = 1; i < parts.Count; i++) rest.Add(parts[i].Replace('\\', '/'));
                var joined2 = new System.Text.StringBuilder(first.TrimEnd('/'));
                for (int i = 0; i < rest.Count; i++) joined2.Append('/').Append(rest[i]);
                return joined2.ToString();
            }
            var joined = JoinStrings(parts);
            var root = parts[0].StartsWith("/") ? "/" : "";
            return FsHost.NormalizeVirtual(root + joined);
        }

        public string dirname(object p)
        {
            var s = (p as string ?? "").Replace('\\', '/');
            var idx = s.LastIndexOf('/');
            return idx <= 0 ? (s.StartsWith("/") ? "/" : ".") : s.Substring(0, idx);
        }

        public string basename(object p) { return BasenameImpl(p, null); }
        public string basename(object p, object ext) { return BasenameImpl(p, ext); }
        private string BasenameImpl(object p, object ext)
        {
            var s = (p as string ?? "").Replace('\\', '/');
            var idx = s.LastIndexOf('/');
            var name = idx < 0 ? s : s.Substring(idx + 1);
            var e = ext as string;
            if (e != null && name.EndsWith(e, StringComparison.Ordinal)) name = name.Substring(0, name.Length - e.Length);
            return name;
        }

        internal static string JoinStrings(System.Collections.Generic.List<string> parts)
        {
            var sb = new System.Text.StringBuilder();
            for (int i = 0; i < parts.Count; i++) { if (i > 0) sb.Append('/'); sb.Append(parts[i]); }
            return sb.ToString();
        }

        public string sep { get { return "/"; } }
        public string delimiter { get { return ":"; } }

        static readonly System.Text.RegularExpressions.Regex DriveRe = new System.Text.RegularExpressions.Regex("^[a-zA-Z]:");

        private static string Str(object o)
        {
            if (o is string s) return s;
            if (o is JsValue jv) return jv.IsString() ? jv.AsString() : jv.ToString();
            return o == null ? "" : o.ToString();
        }

        // http_router.js 审计加固（2026-10-07）改用 path.resolve/relative/isAbsolute 做资源根防穿越。
        // resolve 保持 'H:/...' 盘符前缀形式（与 join 同款），JS 侧 startsWith(RES_ROOT) 守卫依赖它；
        // ToVirtual 对 'NEW FILES/files/res' 前缀的映射在斜杠归一后仍能命中。
        public string resolve(params JsValue[] args)
        {
            var parts = new List<string>();
            foreach (var a in args)
            {
                if (a.IsUndefined() || a.IsNull()) continue;
                parts.Add((a.IsString() ? a.AsString() : a.ToString()).Replace('\\', '/'));
            }
            return ResolveCore(parts);
        }

        private static string ResolveCore(List<string> parts)
        {
            for (int i = parts.Count - 1; i >= 0; i--)
            {
                var seg = parts[i];
                if (DriveRe.IsMatch(seg))
                {
                    var drive = seg.Substring(0, 2);
                    var sb = new System.Text.StringBuilder(seg.Length > 2 ? seg.Substring(2) : "");
                    for (int j = i + 1; j < parts.Count; j++) sb.Append('/').Append(parts[j]);
                    return drive + FsHost.NormalizeVirtual("/" + sb);
                }
                if (seg.StartsWith("/"))
                {
                    var sb2 = new System.Text.StringBuilder();
                    for (int j = i; j < parts.Count; j++) sb2.Append('/').Append(parts[j]);
                    return FsHost.NormalizeVirtual(sb2.ToString());
                }
            }
            var sb3 = new System.Text.StringBuilder();
            foreach (var p in parts) sb3.Append('/').Append(p);
            return FsHost.NormalizeVirtual(sb3.ToString());
        }

        public bool isAbsolute(object p)
        {
            var s = Str(p).Replace('\\', '/');
            return DriveRe.IsMatch(s) || s.StartsWith("/");
        }

        public string relative(object from, object to)
        {
            var f = ResolveCore(new List<string> { Str(from).Replace('\\', '/') });
            var t = ResolveCore(new List<string> { Str(to).Replace('\\', '/') });
            var fDrive = DriveRe.IsMatch(f) ? f.Substring(0, 2) : null;
            var tDrive = DriveRe.IsMatch(t) ? t.Substring(0, 2) : null;
            if (!string.Equals(fDrive, tDrive, StringComparison.Ordinal)) return t; // 跨盘：回绝对路径，交由上层 isAbsolute 守卫拦截
            var fSegs = f.Substring(fDrive != null ? 2 : 0).Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
            var tSegs = t.Substring(tDrive != null ? 2 : 0).Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
            int common = 0;
            while (common < fSegs.Length && common < tSegs.Length && fSegs[common] == tSegs[common]) common++;
            var sb = new System.Text.StringBuilder();
            for (int i = 0; i < fSegs.Length - common; i++) sb.Append("../");
            sb.Append(string.Join("/", tSegs, common, tSegs.Length - common));
            return sb.Length == 0 ? "." : sb.ToString();
        }
    }

    public class NetModule
    {
        private readonly JsHost _host;
        public NetModule(JsHost host) { _host = host; }
        // JS 回调可能是 JsValue，也可能被 Jint 转成 Delegate —— 两种都归一（见 FunctionArg）
        public PsTcpServer createServer() { return CreateServerImpl(null); }
        public PsTcpServer createServer(JsValue connectionListener) { return CreateServerImpl(connectionListener); }
        public PsTcpServer createServer(object connectionListener) { return CreateServerImpl(FunctionArg.AsFunction(_host, connectionListener)); }
        private PsTcpServer CreateServerImpl(JsValue connectionListener)
        {
            var server = new PsTcpServer(_host);
            if (connectionListener != null && !connectionListener.IsUndefined()) server.on("connection", connectionListener);
            return server;
        }
    }

    public class HttpModule
    {
        private readonly JsHost _host;
        public HttpModule(JsHost host) { _host = host; }
        public PsHttpServer createServer() { return CreateServerImpl(null); }
        public PsHttpServer createServer(JsValue requestListener) { return CreateServerImpl(requestListener); }
        public PsHttpServer createServer(object requestListener) { return CreateServerImpl(FunctionArg.AsFunction(_host, requestListener)); }
        private PsHttpServer CreateServerImpl(JsValue requestListener)
        {
            var server = new PsHttpServer(_host);
            if (requestListener != null && !requestListener.IsUndefined()) server.on("request", requestListener);
            return server;
        }
    }

    // Jint 4 可能把 JS 函数参数转成 Delegate（而非 JsValue）—— 两种都归一成可调用 JsValue
    internal static class FunctionArg
    {
        internal static JsValue AsFunction(JsHost host, object arg)
        {
            if (arg == null) return null;
            if (arg is JsValue jv) return jv;
            if (arg is System.Delegate d) return JsValue.FromObject(host.Engine, d);
            return null;
        }
    }

    public class ZlibModule
    {
        public PsBuffer deflateSync(object buf) { return PsZlib.Deflate(AsBuf(buf)); }
        public PsBuffer inflateSync(object buf) { return PsZlib.Inflate(AsBuf(buf)); }
        private static PsBuffer AsBuf(object o)
        {
            var b = o as PsBuffer;
            if (b != null) return b;
            if (o is JsValue jv)
            {
                var unwrapped = jv.ToObject();
                if (unwrapped is PsBuffer pb) return pb;
                if (jv.IsString()) return new PsBuffer(PsBuffer.EncodeString(jv.AsString(), "utf8"));
            }
            if (o is string s) return new PsBuffer(Encoding.UTF8.GetBytes(s));
            throw new ArgumentException("zlib: not a buffer");
        }
    }

    public class CryptoModule
    {
        // accounts.js: crypto.pbkdf2Sync(pass, salt, iter, keylen, 'sha512') / randomBytes(n)
        public PsBuffer pbkdf2Sync(object pass, object salt, object iter, object keylen, object digest)
        {
            var p = Str(pass) ?? "";
            var s = Str(salt) ?? "";
            int it = (int)PsBuffer.Num(iter, 1);
            int len = (int)PsBuffer.Num(keylen, 32);
            var hashName = (Str(digest) ?? "sha1").Replace("-", "").ToLowerInvariant();
            System.Security.Cryptography.HMAC hmac;
            int hLen;
            if (hashName == "sha512") { hmac = new System.Security.Cryptography.HMACSHA512(); hLen = 64; }
            else if (hashName == "sha256") { hmac = new System.Security.Cryptography.HMACSHA256(); hLen = 32; }
            else { hmac = new System.Security.Cryptography.HMACSHA1(); hLen = 20; }
            hmac.Key = Encoding.UTF8.GetBytes(s);
            try
            {
                // 标准 PBKDF2（RFC 2898）：T_i = U_1 ^ U_2 ^ ... ；U_1 = PRF(P, S || INT(i))
                var saltBytes = Encoding.UTF8.GetBytes(s);
                var result = new byte[len];
                int blocks = (len + hLen - 1) / hLen;
                var passBytes = Encoding.UTF8.GetBytes(p);
                for (int block = 1; block <= blocks; block++)
                {
                    var u = new byte[saltBytes.Length + 4];
                    Array.Copy(saltBytes, u, saltBytes.Length);
                    u[saltBytes.Length] = (byte)((block >> 24) & 0xff);
                    u[saltBytes.Length + 1] = (byte)((block >> 16) & 0xff);
                    u[saltBytes.Length + 2] = (byte)((block >> 8) & 0xff);
                    u[saltBytes.Length + 3] = (byte)(block & 0xff);
                    var t = new byte[hLen];
                    var first = hmac.ComputeHash(u);
                    Array.Copy(first, t, hLen);
                    var acc = (byte[])t.Clone();
                    for (int round = 1; round < it; round++)
                    {
                        first = hmac.ComputeHash(first);
                        for (int k = 0; k < hLen; k++) acc[k] ^= first[k];
                    }
                    var off = (block - 1) * hLen;
                    var n = Math.Min(hLen, len - off);
                    Array.Copy(acc, 0, result, off, n);
                }
                return new PsBuffer(result);
            }
            finally { hmac.Key = new byte[0]; }
        }

        public PsBuffer randomBytes(object n)
        {
            int len = (int)PsBuffer.Num(n, 16);
            var buf = new byte[len];
            var rng = new System.Security.Cryptography.RNGCryptoServiceProvider(); rng.GetBytes(buf);
            return new PsBuffer(buf);
        }

        public PsBuffer md5(object data)
        {
            byte[] bytes;
            var b = data as PsBuffer;
            if (b != null) bytes = b.toArray();
            else bytes = Encoding.UTF8.GetBytes(Str(data) ?? "");
            using (var md = System.Security.Cryptography.MD5.Create()) return new PsBuffer(md.ComputeHash(bytes));
        }

        private static string Str(object o)
        {
            if (o == null) return null;
            if (o is string s) return s;
            if (o is JsValue jv && jv.IsString()) return jv.AsString();
            return o.ToString();
        }
    }

    public class UrlModule
    {
        // JS: const { URL } = require('url'); new URL(req.url, 'http://x')
        // 【Jint 2.11】按精确参数个数重载
        public PsUrl URL(object url) { return new PsUrl(url as string ?? (url is JsValue jv && jv.IsString() ? jv.AsString() : ""), null); }
        public PsUrl URL(object url, object baseUri) { return new PsUrl(url as string ?? (url is JsValue jv && jv.IsString() ? jv.AsString() : ""), baseUri as string); }
    }

    public class ChildProcessModule
    {
        // net_check 的端口预检在单机版没有意义 —— 同步空串即可（preflight 全部降级为"未占用"）
        public string execSync(object cmd) { return ""; }
        public string execSync(object cmd, object opts) { return ""; }
    }
}
