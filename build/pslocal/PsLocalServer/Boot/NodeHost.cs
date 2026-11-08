// NodeHost：B-I 形态（arm64 独立进程）的服务端宿主。
//
// 与 JsHost 的分工：
//   JsHost   —— 在游戏进程内用 Jint 解释执行 ps_server/boot.js（现有单机线）
//   NodeHost —— 拉起 /data/user/0/<pkg>/files/psbin/psnode 跑 ps_server/start.js（B 线）
//
// 三条硬约束（都有实测依据）：
//   1. **端口必须由 node 自己 bind**：node 模式下 PsPortHub 不预绑定，否则 node listen 得到
//      EADDRINUSE，start.js:220 直接 process.exit(1)，表现为"游戏一直连不上、也没日志"。
//   2. **就绪判据 = HTTP 应答**，不是 stdout 关键字：`L.log.ok('本地服启动完成')` 与三个 listen
//      的先后关系不严格（44587 是在 onReady 里才 require 的）。这里连 8081 发一个最小 GET，
//      读到 `"code":"300"` 才算就绪；15 s 未就绪 → 交给 BootPipeline.Fatal 放行游戏自己的报错 UI。
//   3. **孤儿必须自杀**：游戏被 LMK SIGKILL 时 C# 没有机会 Kill，psnode 会继续占着三端口。
//      psnode 侧已实现 getppid() 看门狗；这里再补一层：进程 Exited 时置 IsAlive=false。
//
// 另外：环境变量不走 ProcessStartInfo.EnvironmentVariables —— 老 mono（设备 profile）上该属性
// 支持不一致，而是直接写进 shell 命令行（`LD_LIBRARY_PATH=... PS_LUA_REMOTE_INPROC=1 exec ...`），
// 行为确定且可读。
using System;
using System.Diagnostics;
using System.IO;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace PsLocalServer
{
    public class NodeHost
    {
        public string BinPath;          // 设备: <data>/psbin/psnode；PC: node 可执行文件
        public string LibDir;           // 设备: <data>/psbin（LD_LIBRARY_PATH）；PC: null
        public string ScriptDir;        // <nodeRoot>/ps_server
        public string ScriptName = "start.js";
        public int HttpPort = 8081;
        public int GamePort = 9021;
        public int LuaPort = 44587;
        public string StdoutLog;        // 子进程 stdout/stderr 落盘位置
        // 设备模式由调用方注入：PC 上没有 UnityEngine 程序集，直接摸 Application.platform 会
        // FileNotFoundException（TestHost 实测）。判据用 Env.PersistDir != null 更可靠。
        public bool AndroidMode;

        public volatile bool IsAlive;
        public string LastError;
        public int ExitCode = int.MinValue;
        public long ReadyMs = -1;

        private Process _proc;
        private readonly StringBuilder _tail = new StringBuilder(8192);
        private readonly object _lock = new object();
        private bool _stopping;

        /// <summary>拉起子进程（不等就绪）。失败返回 false 并置 LastError。</summary>
        public bool Start()
        {
            try
            {
                var psi = new ProcessStartInfo();
                if (AndroidMode)
                {
                    // 不在命令行里拼 env/引号：Mono 对 Arguments 的引号解析与 sh 不同，
                    // 实测 `sh -c 'cd ... && ...'` 会被拆坏（真机报 `cd: no home directory (HOME not set)`，
                    // 即 cd 收到了空参数）。改为**落一个 run.sh 再让 sh 执行它**，零引号嵌套。
                    var script = Path.Combine(Path.GetDirectoryName(BinPath) ?? ".", "run.sh");
                    WriteRunScript(script);
                    psi.FileName = "/system/bin/sh";
                    psi.Arguments = script;          // 内部存储路径，无空格，无需引号
                }
                else
                {
                    psi.FileName = BinPath;
                    psi.Arguments = QuoteArgs();
                }
                psi.WorkingDirectory = ScriptDir;
                psi.UseShellExecute = false;
                psi.CreateNoWindow = true;
                psi.RedirectStandardOutput = true;
                psi.RedirectStandardError = true;

                var p = new Process();
                p.StartInfo = psi;
                p.EnableRaisingEvents = true;
                p.Exited += (s, e) =>
                {
                    IsAlive = false;
                    try { ExitCode = p.ExitCode; } catch { }
                };
                p.OutputDataReceived += (s, e) => Append(e.Data);
                p.ErrorDataReceived += (s, e) => Append(e.Data);
                if (!p.Start()) { LastError = "Process.Start returned false"; return false; }
                p.BeginOutputReadLine();
                p.BeginErrorReadLine();
                _proc = p;
                IsAlive = true;
                return true;
            }
            catch (Exception e)
            {
                LastError = e.GetType().Name + ": " + e.Message;
                IsAlive = false;
                return false;
            }
        }

        /// <summary>等 HTTP 就绪。返回 true = 可服务。</summary>
        public bool WaitReady(int timeoutMs)
        {
            var sw = Stopwatch.StartNew();
            while (sw.ElapsedMilliseconds < timeoutMs)
            {
                if (!IsAlive)
                {
                    LastError = "psnode exited early (code=" + ExitCode + ")" + Tail();
                    return false;
                }
                if (ProbeHttp(800))
                {
                    ReadyMs = sw.ElapsedMilliseconds;
                    return true;
                }
                Thread.Sleep(150);
            }
            LastError = "not ready in " + timeoutMs + "ms" + Tail();
            return false;
        }

        /// <summary>最小 HTTP 探活：GET /client_api/GetAgentConfig.php，读到 code:300 即通。
        /// 不用 HttpWebRequest —— 它会读系统代理设置，在回环上偶发绕路。</summary>
        public bool ProbeHttp(int timeoutMs)
        {
            try
            {
                using (var c = new TcpClient())
                {
                    var ar = c.BeginConnect("127.0.0.1", HttpPort, null, null);
                    if (!ar.AsyncWaitHandle.WaitOne(timeoutMs)) return false;
                    c.EndConnect(ar);
                    c.ReceiveTimeout = timeoutMs;
                    var req = Encoding.ASCII.GetBytes(
                        "GET /client_api/GetAgentConfig.php HTTP/1.0\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n");
                    using (var ns = c.GetStream())
                    {
                        ns.Write(req, 0, req.Length);
                        ns.Flush();
                        var buf = new byte[2048];
                        int n = ns.Read(buf, 0, buf.Length);
                        if (n <= 0) return false;
                        var s = Encoding.UTF8.GetString(buf, 0, n);
                        return s.IndexOf("\"code\":\"300\"", StringComparison.Ordinal) >= 0
                            || s.IndexOf("300", StringComparison.Ordinal) >= 0 && s.StartsWith("HTTP/");
                    }
                }
            }
            catch { return false; }
        }

        /// <summary>停服：优先 SIGTERM（start.js 会 flushSave 再退出），1.5 s 后强杀。</summary>
        public void Stop()
        {
            _stopping = true;
            var p = _proc;
            if (p == null) return;
            try
            {
                if (!p.HasExited)
                {
                    if (!AndroidMode) { try { p.Kill(); } catch { } }
                    else
                    {
                        // 托管层在 Android 上没有 kill 信号 API；用 /system/bin/kill 发 TERM
                        var pid = p.Id;
                        try
                        {
                            var k = Process.Start(new ProcessStartInfo("/system/bin/kill", "-TERM " + pid)
                            { UseShellExecute = false, CreateNoWindow = true });
                            k.WaitForExit(800);
                        }
                        catch { }
                        if (!p.WaitForExit(1500)) { try { p.Kill(); } catch { } }
                    }
                }
            }
            catch { }
            finally { IsAlive = false; }
        }

        // ---------------------------------------------------------------- 内部

        string BuildShellCommand()
        {
            var sb = new StringBuilder();
            sb.Append("cd ").Append(Quote(ScriptDir)).Append(" && ");
            if (!string.IsNullOrEmpty(LibDir)) sb.Append("LD_LIBRARY_PATH=").Append(Quote(LibDir)).Append(' ');
            sb.Append("LUA_REMOTE_PORT=").Append(LuaPort).Append(' ');
            sb.Append("PS_LUA_REMOTE_INPROC=1 ");   // 44587 随本进程起（见 start.js onReady）
            sb.Append("exec ").Append(Quote(BinPath)).Append(' ').Append(ScriptName)
              .Append(" --port=").Append(HttpPort)
              .Append(" --game-port=").Append(GamePort);
            if (!string.IsNullOrEmpty(StdoutLog))
                sb.Append(" >> ").Append(Quote(StdoutLog)).Append(" 2>&1");
            return sb.ToString();
        }

        /// <summary>把拉起命令写成脚本（LF 行尾；不用 shebang，由 /system/bin/sh 显式执行）。</summary>
        void WriteRunScript(string path)
        {
            var sb = new StringBuilder();
            sb.Append("export LUA_REMOTE_PORT=").Append(LuaPort).Append('\n');
            sb.Append("export PS_LUA_REMOTE_INPROC=1\n");
            if (!string.IsNullOrEmpty(LibDir))
                sb.Append("export LD_LIBRARY_PATH='").Append(LibDir).Append("'\n");
            sb.Append("cd '").Append(ScriptDir).Append("' || exit 90\n");
            sb.Append("exec '").Append(BinPath).Append("' ").Append(ScriptName)
              .Append(" --port=").Append(HttpPort)
              .Append(" --game-port=").Append(GamePort);
            if (!string.IsNullOrEmpty(StdoutLog))
                sb.Append(" >> '").Append(StdoutLog).Append("' 2>&1");
            sb.Append('\n');
            // ★ 必须无 BOM：File.WriteAllText 默认 UTF8 **带 BOM**，脚本首行会变成
            //   "\uFEFFexport ..." → sh 报 "export: not found"，环境变量静默丢失。
            using (var w = new StreamWriter(path, false, new UTF8Encoding(false)))
                w.Write(sb.ToString());
            NodeSeeder.Chmod755(path, null);
        }

        string QuoteArgs()
        {
            // 非 shell 形态：参数**不能**带引号（Process.Start 不做 shell 解析，'start.js' 会被
            // 当成文件名带引号去 require → MODULE_NOT_FOUND）。工作目录已设在 ScriptDir。
            return ScriptName + " --port=" + HttpPort + " --game-port=" + GamePort;
        }

        static string Quote(string s) { return "'" + (s ?? "").Replace("'", "'\\''") + "'"; }

        void Append(string line)
        {
            if (line == null) return;
            lock (_lock)
            {
                _tail.AppendLine(line);
                if (_tail.Length > 6000) _tail.Remove(0, _tail.Length - 4000);
            }
            if (string.IsNullOrEmpty(StdoutLog) || AndroidMode) return; // Android 侧已由 shell 重定向落盘
            try { File.AppendAllText(StdoutLog, line + "\n"); } catch { }
        }

        string Tail()
        {
            lock (_lock)
            {
                var t = _tail.ToString().Trim();
                if (t.Length > 700) t = t.Substring(t.Length - 700);
                return t.Length == 0 ? "" : "\n--- psnode tail ---\n" + t;
            }
        }
    }
}
