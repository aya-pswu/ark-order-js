// 首启管线：播种内置文件 → extcfg 自举 → 数据包检测/解压 → JsHost/NodeHost 起三服务。
// progress(stage, pct) 由 UI（设备）或控制台（PC 测试）消费。
using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading;
using PsLocalServer.Shims;

namespace PsLocalServer
{
    public class BootPipeline
    {
        public readonly HostEnvironment Env;
        public readonly string LogFile;
        public Action<string, double> Progress;   // (stageText, 0..1 总进度)
        public Action<string> Fatal;
        public Action Ready;                      // 三端口全部就绪（notifyReady）后回调（放行 logo 等）
        public Action<string> Halt;               // 三百二十：缺数据包拒启（与 Fatal 不同——绝不放行游戏流程）
        public volatile bool Halted;              // true = 闸门已拦（Bootstrap 看门狗据此停止强放）
        public JsHost Host;
        public NodeHost Node;               // node 引擎（B-I）时非空
        public string Engine = "jint";      // "jint" | "node"，构造管线时按 extcfg/资产自动判定
        public string EngineReason = "";    // 为什么选了这个引擎（写状态文件 + 回退时弹 Toast）
        public bool FellBack;               // true = node 启动失败、被动落到 Jint
        public Exception Error;

        private volatile bool _serverUp;
        public bool IsReady { get { return _serverUp; } }

        private Thread _supervisor;
        private volatile bool _stopping;

        public int HttpPort = 8081;
        public int GamePort = 9021;
        public int LuaPort = 44587;
        public string HostIp = "127.0.0.1";

        public BootPipeline(HostEnvironment env, string logFile)
        {
            Env = env;
            LogFile = logFile;
        }

        public void RunAsync()
        {
            var t = new Thread(Run) { IsBackground = true, Name = "PsBoot" };
            t.Start();
        }

        void Report(string stage, double pct)
        {
            var p = Progress;
            if (p != null) p(stage, pct);
        }

        void Run()
        {
            try
            {
                Report("初始化目录", 0.04);
                Directory.CreateDirectory(Env.RootDir);
                Diag("run: start, root=" + Env.RootDir);

                SeedFromApkIfDevice();
                Diag("run: seed done");

                Report("写入自举配置", 0.10);
                ExtCfg.Ensure(Env);
                Diag("run: extcfg done");

                Report("检查数据包", 0.14);
                DataPackage.Ensure(Env, (s, local) => Report(s, 0.14 + local * 0.62));
                Diag("run: datapackage done");
                if (DataPackage.MissingData)
                {
                    // 三百二十闸门：缺数据包（无覆盖层、无数据包 APK、无 psdata.zip）。
                    // 拒绝启动服务端：不推进到引擎分支、不触发 Ready/Fatal——SplashGate 永不放行，
                    // 进度条停在提示文案上；Fatal 是"失败也放行游戏"，这里语义相反，绝不混用。
                    Halted = true;
                    const string haltMsg = "未检测到数据包：请先安装 fzzl_data.apk 后重启游戏";
                    Diag("halt: " + haltMsg);
                    Report(haltMsg, 0.14);
                    if (Halt != null) Halt(haltMsg);
                    return;
                }

                Report("启动内置服务端", 0.80);
                Engine = SelectEngine();
                Diag("run: engine=" + Engine);
                if (Engine == "node")
                {
                    try
                    {
                        SeedNodeIfDevice();   // psbin + psnode 树 → 内部存储（sdcard 是 noexec）
                        StartNode();
                        Diag("run: psnode ready in " + Node.ReadyMs + "ms");
                        StartNodeSupervisor();    // B6 正向：psnode 之后崩了要有人接管
                    }
                    catch (Exception ne)
                    {
                        // B8 的最后一道：node 起不来（16 KB 页 / 权限策略 / 树损坏）不能让游戏死，
                        // 自动回退 Jint —— 这才是"保留 Jint"这件事真正兑现价值的地方。
                        // ★ 但**绝不能静默**：回退意味着性能掉一个数量级，如果玩家只看到"有点卡"
                        //   却查不到原因，那比不兜底更糟。所以三处同时留痕（见 AnnounceFallback）。
                        Diag("engine node failed: " + ne.Message + " → fallback jint");
                        try { if (Node != null) Node.Stop(); } catch { }
                        Node = null;
                        Engine = "jint";
                        FellBack = true;
                        EngineReason = "node 启动失败：" + ne.Message;
                        AnnounceFallback(ne.Message);
                        Report("内置服务端回退中", 0.85);
                    }
                }
                if (Engine == "jint")
                {
                    Host = new JsHost { OnServerReady = () => _serverUp = true, HttpPort = HttpPort, GamePort = GamePort, LuaPort = LuaPort, HostIp = HostIp };
                    Host.Progress = (s, p) => Report(s, p); // Jint 模块逐个上报（0.80→0.96，见 JsHost.Initialize）
                    Host.Start(Env, LogFile);
                    Diag("run: js host started");

                    // boot.js 内部依次 listen 8081/9021/44587；就绪回调置 _serverUp
                    var deadline = DateTime.UtcNow.AddSeconds(1800);
                    while (!_serverUp && DateTime.UtcNow < deadline && Host.Error == null) Thread.Sleep(100);
                    if (Host.Error != null) throw new Exception("JS boot failed: " + Host.Error);
                    if (!_serverUp) throw new Exception("server not ready in 1800s");
                }

                WriteEngineStatus();
                Report(FellBack ? "就绪 · 兼容模式（较慢）" : "就绪", 1.0);
                Diag("run: READY engine=" + Engine + (FellBack ? " (FALLBACK)" : ""));
                var r = Ready;
                if (r != null) r();
            }
            catch (Exception e)
            {
                Error = e;
                Diag("run: FATAL " + e);
                var f = Fatal;
                if (f != null) f(e.Message); else Report("启动失败: " + e.Message, 1.0);
            }
        }

        /// <summary>文件级诊断（logcat 不可靠时用；写 <persist>/psboot_diag.log）。</summary>
        void Diag(string msg)
        {
            try
            {
                var f = Path.Combine(Env.PersistDir ?? Env.RootDir, "psboot_diag.log");
                File.AppendAllText(f, DateTime.UtcNow.AddHours(8).ToString("HH:mm:ss.fff") + " " + msg + "\n");
            }
            catch { }
        }

        /// <summary>
        /// 内置资产版本 —— **由 psroot 内容指纹自动派生**（prepare_assets.py 生成 SeedGenerator，
        /// 见 PCJS同步方案.md §3 D2）。不要再手改：手工常量忘记更新会让设备继续跑旧 JS，
        /// 而日志一切正常、行为却是旧的（2026-09-16 踩过）。
        /// </summary>
        public const string SeedVersion = SeedStamp.SeedVersion;

        /// <summary>设备侧：把 APK assets/psroot 播种到持久目录（版本化标记；版本不符重播种）。</summary>
        void SeedFromApkIfDevice()
        {
            if (Env.PersistDir == null) return; // PC 环境：testroot 已备好
            var marker = Path.Combine(Env.RootDir, ".seeded");
            if (File.Exists(marker) && File.ReadAllText(marker).Trim() == SeedVersion) return;

            var apkPath = UnityEnginePath;
            if (string.IsNullOrEmpty(apkPath) || !File.Exists(apkPath))
                throw new Exception("cannot locate APK file for seeding: " + apkPath);

            long total = 0, done = 0;
            bool upgrading = File.Exists(marker); // 版本升级重播种：不覆盖玩家存档
            using (var zip = new Shims.PsZipReader(apkPath)) // 游戏托管层无压缩组件，ZIP 只能 STORE + 手写解析
            {
                var names = zip.NamesByPrefix("assets/psroot/");
                foreach (var name in names) total += zip.EntrySize(name);
                foreach (var name in names)
                {
                    var rel = name.Substring("assets/".Length);
                    // 升级重播种时保护玩家数据：
                    // accounts.json 与除 player.json 外的其它存档（如玩家自建账号）已存在则不覆盖；
                    // player.json 为开发主测试存档（PCJS 同步源）：
                    //   默认同步 APK 内最新的 player.json（并对旧档保留 .device_bak 备份），
                    //   除非 extcfg.json 显式声明 KeepDevicePlayerSave=true。
                    bool isPlayerSave = rel == "psroot/ps_server/saves/player.json";
                    if (upgrading)
                    {
                        if (rel == "psroot/ps_server/accounts.json")
                        {
                            done += zip.EntrySize(name);
                            continue;
                        }
                        if (rel.StartsWith("psroot/ps_server/saves/", StringComparison.Ordinal))
                        {
                            if (!isPlayerSave)
                            {
                                done += zip.EntrySize(name);
                                continue;
                            }
                            if (ExtCfg.GetBool(Env, "KeepDevicePlayerSave", false))
                            {
                                done += zip.EntrySize(name);
                                continue;
                            }
                            // 即将同步 player.json：先对设备上的旧档做备份
                            try
                            {
                                var oldPlayer = Path.Combine(Env.PersistDir, rel.Replace('/', Path.DirectorySeparatorChar));
                                if (File.Exists(oldPlayer))
                                {
                                    var bak = oldPlayer + ".device_bak";
                                    File.Copy(oldPlayer, bak, true);
                                }
                            }
                            catch { }
                        }
                    }
                    var target = Path.Combine(Env.PersistDir, rel.Replace('/', Path.DirectorySeparatorChar));
                    Directory.CreateDirectory(Path.GetDirectoryName(target));
                    var size = zip.EntrySize(name);
                    if (size > 0)
                    {
                        using (var fs = new FileStream(target, FileMode.Create, FileAccess.Write))
                        {
                            zip.ReadTo(name, fs);
                            done += size;
                            if (total > 0)
                                Report("展开内置文件", 0.04 + 0.06 * ((double)done / total));
                        }
                    }
                    else
                    {
                        if (!Directory.Exists(target)) Directory.CreateDirectory(target);
                    }
                }
            }
            File.WriteAllText(marker, SeedVersion);
        }

        // ------------------------------------------------------------------ B 线（node 引擎）

        /// <summary>
        /// 引擎选择（B7 的可回退开关）：
        ///   extcfg `PsServerEngine=node|jint` 显式指定优先；未配置时"装得上就用 node"——
        ///   有 psbin/psnode 就用（B 线包），没有就回 Jint（旧包 / PC 测试树）。
        ///   之所以不硬编码默认 node：老包没有 psbin，硬默认会让启动直接 FATAL。
        /// </summary>
        string SelectEngine()
        {
            var cfg = ExtCfg.GetString(Env, "PsServerEngine", "");
            if (string.Equals(cfg, "jint", StringComparison.OrdinalIgnoreCase)) { EngineReason = "extcfg: jint"; return "jint"; }
            if (string.Equals(cfg, "node", StringComparison.OrdinalIgnoreCase)) { EngineReason = "extcfg: node"; return "node"; }
            var bin = Environment.GetEnvironmentVariable("PSNODE_BIN");
            if (!string.IsNullOrEmpty(bin) && File.Exists(bin)) { EngineReason = "PSNODE_BIN"; return "node"; }
            // 打包时是否带 assets/psnode 决定（见 prepare_assets.write_seed_stamp）
            if (SeedStamp.DefaultEngine != "node") { EngineReason = "包内无 psnode 树（DefaultEngine=jint）"; return "jint"; }
            // B8：libnode.so 的 LOAD 段 align=0x1000 且偏移未 16 KB 对齐（实测 off%16k=0/1792/10416/3976），
            // 16 KB 页设备上 dlopen 必失败。与其等它 FATAL 再回退，不如一开始就选 Jint。
            if (SystemPageSize() >= 16384)
            {
                Diag("engine: pagesize=" + SystemPageSize() + " ≥16KB，libnode 不兼容 → jint");
                EngineReason = "pagesize=" + SystemPageSize() + "（libnode 需 4KB/16KB 对齐）";
                return "jint";
            }
            EngineReason = "默认 node（包内带 psnode 树，pagesize=" + SystemPageSize() + "）";
            return "node";
        }

        static int SystemPageSize()
        {
            // 设备 profile 的 mscorlib 是 2.0/3.5 世代，没有 Environment.SystemPageSize（net40 才加），
            // 所以直接问 libc；PC 上没有 "libc" 这个模块名，落到 catch 返回 4096。
            try { return SysGetPageSize(); }
            catch { return 4096; }
        }

        [System.Runtime.InteropServices.DllImport("libc", EntryPoint = "getpagesize")]
        static extern int SysGetPageSize();

        /// <summary>
        /// 设备侧：把 APK 里的 `assets/psbin/**` + `assets/psnode/**` 播到**内部存储**
        /// `<data>/psbin` 与 `<data>/psnode_root`。
        ///
        /// 为什么不复用 SeedFromApkIfDevice：那条线落 `<persist>`（/sdcard，FUSE）。
        /// FUSE 是 **noexec** → psnode 根本 exec 不了；而且 FUSE 上单次 saveState 148 ms，
        /// 是 B 线 `<50 ms` 验收线的硬伤。node 树的 saves/logs 跟着树走（__dirname 相对），
        /// 所以整棵搬到内部存储一并解决写盘成本。
        /// </summary>
        void SeedNodeIfDevice()
        {
            if (Env.PersistDir == null) return;                 // PC：树已就位，不播种
            var apkPath = UnityEnginePath;
            if (string.IsNullOrEmpty(apkPath) || !File.Exists(apkPath))
                throw new Exception("cannot locate APK for node seeding: " + apkPath);

            string ver;
            using (var zip = new Shims.PsZipReader(apkPath))
                ver = NodeSeeder.Version(zip) ?? ("node-" + SeedVersion);

            var marker = Path.Combine(Env.DataDir, ".node_seeded");
            if (File.Exists(marker) && File.ReadAllText(marker).Trim() == ver)
            {
                Diag("seed-node: up to date (" + ver + ")");
                return;
            }
            // 升级 vs 首装：判据 = 设备上是否已有 node 树（不只看 marker，marker 可能被删而树还在）。
            // 升级时必须保护玩家数据（saves/ + accounts.json），否则装新包会清掉玩家自建账号，
            // 并让登录框退回出厂预填 player（2026-11-04 真机实证，见 NodeSeeder.Seed 注释）。
            var nodeRootDir = Path.Combine(Env.DataDir, "psnode_root");
            bool upgrading = File.Exists(marker) || Directory.Exists(nodeRootDir);
            Diag("seed-node: seeding (" + ver + ")" + (upgrading ? " [upgrade: keep player data]" : " [first install]"));

            var done = NodeSeeder.Seed(apkPath, Env.DataDir,
                p2 => Report("展开内置服务端", 0.80 * p2),
                s2 => Diag(s2),
                upgrading);

            MigrateSavesToInternal();
            Directory.CreateDirectory(Env.DataDir);
            File.WriteAllText(marker, ver);
            Diag("seed-node: done " + done + " bytes");
        }

        /// 首次切到 node 引擎时把 Jint 线的存档接过来（否则玩家进游戏发现"号没了"）。
        /// 单向：sdcard → 内部存储；node 线的后续存档只写内部存储。
        /// 反向（node → jint）不在本轮范围，见工作计划 B7。
        /// </summary>
        void MigrateSavesToInternal()
        {
            try
            {
                var srcDir = Path.Combine(Path.Combine(Env.RootDir, "ps_server"), "saves");
                var dstDir = Path.Combine(Path.Combine(Path.Combine(Env.DataDir, "psnode_root"), "ps_server"), "saves");
                if (!Directory.Exists(srcDir)) return;
                Directory.CreateDirectory(dstDir);
                int n = 0;
                foreach (var f in Directory.GetFiles(srcDir))
                {
                    var dst = Path.Combine(dstDir, Path.GetFileName(f));
                    if (File.Exists(dst)) continue;              // 已有则不动（不覆盖 node 线的进度）
                    File.Copy(f, dst);
                    n++;
                }
                var accSrc = Path.Combine(Path.Combine(Env.RootDir, "ps_server"), "accounts.json");
                var accDst = Path.Combine(Path.Combine(Path.Combine(Env.DataDir, "psnode_root"), "ps_server"), "accounts.json");
                if (File.Exists(accSrc) && !File.Exists(accDst)) { File.Copy(accSrc, accDst); n++; }
                Diag("seed-node: migrated " + n + " save files to internal");
            }
            catch (Exception e) { Diag("seed-node: migrate fail " + e.Message); }
        }

        /// <summary>拉起 psnode 并等 HTTP 就绪。失败抛异常 → 走 Fatal → 游戏弹自己的报错 UI。</summary>
        void StartNode()
        {
            var nodeRoot = Path.Combine(Env.DataDir, "psnode_root");
            var binDir = Path.Combine(Env.DataDir, "psbin");
            var bin = Environment.GetEnvironmentVariable("PSNODE_BIN");   // PC 自测用：指向 node
            if (string.IsNullOrEmpty(bin)) bin = Path.Combine(binDir, "psnode");

            Node = new NodeHost
            {
                BinPath = bin,
                LibDir = Env.PersistDir == null ? null : binDir,          // PC 不需要 LD_LIBRARY_PATH
                AndroidMode = Env.PersistDir != null,                     // 设备才有 /system/bin/sh、kill
                ScriptDir = Path.Combine(nodeRoot, "ps_server"),
                HttpPort = HttpPort,
                GamePort = GamePort,
                LuaPort = LuaPort,
                StdoutLog = Path.Combine(Env.PersistDir ?? Env.RootDir, "psnode_stdout.log"),
            };
            if (!File.Exists(Node.BinPath))
                throw new Exception("psnode 不存在：" + Node.BinPath);
            if (!File.Exists(Path.Combine(Node.ScriptDir, "start.js")))
                throw new Exception("node 树缺失：" + Node.ScriptDir);
            // 测试钩子：<persist>/force_engine_fail.flag 存在时故意抛错，用来在真机上验"回退是否可见"。
            // 只认这个文件名（不读 extcfg），用完删掉即恢复；触发时 engine_fallback.log 会写明是钩子。
            var hook = Env.PersistDir == null ? null : Path.Combine(Env.PersistDir, "force_engine_fail.flag");
            if (hook != null && File.Exists(hook))
                throw new Exception("TEST HOOK: force_engine_fail.flag");

            if (!Node.Start()) throw new Exception("psnode 拉起失败：" + Node.LastError);
            Diag("run: psnode spawned");
            Report("等待服务端就绪", 0.90);
            if (!Node.WaitReady(15000))
                throw new Exception("psnode 未就绪（15s）：" + Node.LastError);
            _serverUp = true;
        }

        /// <summary>
        /// B6 正向看门狗：psnode 在运行期崩掉（OOM / V8 fatal / 被系统杀）时自动重启，最多 3 次。
        /// 反向（游戏被 LMK 杀 → psnode 变孤儿）由 psnode 自己的 getppid 看门狗兜住（已真机实测 6 s 内自退）。
        /// 3 次还起不来就不再纠缠：走 Fatal 让游戏弹自己的报错 UI，而不是无限重启把日志刷爆。
        /// </summary>
        void StartNodeSupervisor()
        {
            _supervisor = new Thread(SuperviseNode) { IsBackground = true, Name = "PsNodeSup" };
            _supervisor.Start();
            Diag("supervise: started");
        }

        void SuperviseNode()
        {
            int restarts = 0;
            while (!_stopping)
            {
                Thread.Sleep(1000);
                if (_stopping) return;
                var n = Node;
                if (n == null || n.IsAlive) continue;

                if (restarts >= 3)
                {
                    Diag("supervise: psnode 连续退出 3 次，放弃重启");
                    var f = Fatal;
                    if (f != null) f("内置服务端反复退出（已重启 3 次）");
                    return;
                }
                restarts++;
                Diag("supervise: psnode 已退出（code=" + n.ExitCode + "），第 " + restarts + " 次重启");
                if (!n.Start()) { Diag("supervise: 重启失败 " + n.LastError); continue; }
                if (n.WaitReady(10000)) Diag("supervise: 重启就绪 " + n.ReadyMs + "ms");
                else Diag("supervise: 重启未就绪 " + n.LastError);
            }
        }

        /// <summary>
        /// 回退必须"响"——静默降级比不降级更糟：玩家只觉得卡，查不到原因，最后还不如删掉 Jint。
        /// 三处同时留痕：① `engine_fallback.log`（可回溯，含原因）② Toast（进游戏立即可见）
        /// ③ 启动进度条文案（READY 时显示"兼容模式"）。
        /// </summary>
        void AnnounceFallback(string reason)
        {
            try
            {
                if (Env.PersistDir != null)
                {
                    var f = Path.Combine(Env.PersistDir, "engine_fallback.log");
                    File.AppendAllText(f,
                        DateTime.UtcNow.AddHours(8).ToString("yyyy-MM-dd HH:mm:ss")
                        + "  node → jint  " + reason + "\n");
                }
            }
            catch { }
            try
            {
                Bootstrap.Toast("内置服务端已回退兼容模式（较慢）\n详见 engine_fallback.log");
            }
            catch { }
            Diag("engine FALLBACK announced: " + reason);
        }

        /// <summary>每次启动都写一份当前引擎状态，让"我现在跑的是哪个引擎"变成一次读文件就能回答的问题。</summary>
        void WriteEngineStatus()
        {
            try
            {
                if (Env.PersistDir == null) return;
                var reason = (EngineReason ?? "").Replace("\\", "\\\\").Replace("\"", "\\\"");
                var json = "{\"engine\":\"" + Engine + "\",\"fallback\":" + (FellBack ? "true" : "false")
                         + ",\"reason\":\"" + reason + "\""
                         + ",\"pagesize\":" + SystemPageSize()
                         + ",\"nodeReadyMs\":" + (Node != null ? Node.ReadyMs : -1)
                         + ",\"ts\":\"" + DateTime.UtcNow.AddHours(8).ToString("yyyy-MM-dd HH:mm:ss") + "\"}";
                File.WriteAllText(Path.Combine(Env.PersistDir, "engine_status.json"), json);
            }
            catch { }
        }

        /// <summary>停机（目前只有 PC 测试宿主会调；设备上进程退出即销毁）。</summary>
        public void Stop()
        {
            _stopping = true;
            try { if (Node != null) Node.Stop(); } catch { }
        }

        private static string _unityPath;
        private static string UnityEnginePath
        {
            get
            {
                if (_unityPath != null) return _unityPath;
                // Application.dataPath 在 Android 指向 APK 文件路径
                var dp = UnityEngine.Application.dataPath;
                _unityPath = dp;
                return dp;
            }
        }
    }

    public static class ExtCfg
    {
        /// <summary>
        /// 首启自举 extcfg.json：LuaRemoteIP=127.0.0.1 + isSecondZipDone=2（已存在的文件只改这两个键）。
        ///
        /// ⚠️ 2026-09-15 结论（试过关闭、不行，别再关）：LuaRemoteIP 非空 = 客户端走 44587 远程 Lua 通道，
        ///   而**私服对客户端 Lua 的补丁只存在于这条通道里**：
        ///   `tools/lua_remote/src/**` 是带 `-- 私服修改` 注释的补丁源码，数据包 res/luascript/*.ab 里
        ///   的 TextAsset 与 `tools/lua_remote/bc/**`（原版字节码）逐字节相同 —— 也就是说
        ///   LuaFromAB 读到的是**原版**逻辑，补丁（如 NetWaitPanel 对"网络较差"弹窗的竞态兜底）会全部丢失。
        ///   把 LuaRemoteIP 置空可以绕开 19MB 推送卡死，但代价是这些补丁失效，实测客户端会卡在
        ///   登录后「网络较差／请求长时间无返回」而进不去。所以卡死的正确修法是修**推送**
        ///   （见 Shims/LocalTcp.cs · WriteOnOwnThread：专用写线程 + 阻塞写 + 写完后半关闭），
        ///   而不是关掉这条通道。
        /// </summary>
        public static void Ensure(HostEnvironment env)
        {
            if (env.PersistDir == null) return; // PC 无 extcfg
            var path = Path.Combine(env.PersistDir, "extcfg.json");
            string json = File.Exists(path) ? File.ReadAllText(path) : "";
            json = SetKey(json, "LuaRemoteIP", "127.0.0.1");
            json = SetKey(json, "isSecondZipDone", "2");
            // 2026-11-01（二百九十一）去公网 IP 存储化：上传地址改为玩家在游戏内弹窗手动输入
            //（LogUploader.upload()，IP:端口），extcfg 不再下发地址/key；此处反而把设备上的
            // 存量旧值抹成空串（老设备一键清残留；全新安装走下方 minimal，不含这两键）。
            json = SetKey(json, "LogUploadUrl", "");
            json = SetKey(json, "LogUploadKey", "");
            if (!json.Contains("ResFromAB"))
            {
                // 全新安装：给最小可用集（资源走本地 AB/包，Lua 走远程补丁通道）。
                // 上面两条抹除键只对存量设备有意义，空 json 时被 minimal 整体替换（= 不含地址）。
                var minimal = "{\"ResFromAB\":\"true\",\"LuaFromAB\":\"true\",\"CfgFromAB\":\"true\"," +
                              "\"isSecondZipDone\":\"2\",\"ResVersion\":\"138723\",\"IsReLoginLogout\":\"false\"," +
                              "\"AcceptUserProto3\":\"1\",\"AcceptUserProto4\":\"1\",\"LuaRemoteIP\":\"127.0.0.1\"}";
                json = minimal;
            }
            File.WriteAllText(path, json);
        }

        /// <summary>极简 JSON 键改写（仅顶层字符串值；避免引 Newtonsoft/LitJson 依赖）。</summary>
        static string SetKey(string json, string key, string value)
        {
            var token = "\"" + key + "\":";
            var i = json.IndexOf(token, StringComparison.Ordinal);
            var pair = "\"" + key + "\":\"" + value + "\"";
            if (i < 0)
            {
                if (json.Trim().Length == 0) return "{" + pair + "}";
                var trimmed = json.TrimEnd();
                if (trimmed.EndsWith("}"))
                {
                    var head = trimmed.Substring(0, trimmed.Length - 1).TrimEnd();
                    return (head.Length > 1 ? head + "," : head) + pair + "}";
                }
                return json;
            }
            var start = i + token.Length;
            while (start < json.Length && json[start] != '"') start++;
            var end = json.IndexOf('"', start + 1);
            if (end < 0) return json;
            return json.Substring(0, start) + "\"" + value + "\"" + json.Substring(end + 1);
        }

        public static string GetString(HostEnvironment env, string key, string defVal)
        {
            if (env == null || env.PersistDir == null) return defVal;
            var path = Path.Combine(env.PersistDir, "extcfg.json");
            if (!File.Exists(path)) return defVal;
            try
            {
                var json = File.ReadAllText(path);
                var token = "\"" + key + "\":";
                var i = json.IndexOf(token, StringComparison.Ordinal);
                if (i < 0) return defVal;
                var start = i + token.Length;
                while (start < json.Length && json[start] != '"') start++;
                var end = json.IndexOf('"', start + 1);
                if (end < 0) return defVal;
                return json.Substring(start + 1, end - start - 1);
            }
            catch { return defVal; }
        }

        public static bool GetBool(HostEnvironment env, string key, bool defVal)
        {
            var s = GetString(env, key, null);
            if (string.IsNullOrEmpty(s)) return defVal;
            return string.Equals(s, "true", StringComparison.OrdinalIgnoreCase) || s == "1";
        }
    }

    public static class DataPackage
    {
        public const string DataPkgName = "com.bilibili.fzzl.guopan.data";

        /// <summary>
        /// 数据包 APK 源路径缓存。2026-09-17：主线程闸门（Bootstrap.EnsureGate）期间 Unity 主线程被
        /// 冻结，管线后台线程不能再用 RunOnMain 走 JNI（会等到 15s 超时）——改由 Bootstrap.Init 在
        /// 闸门前（主线程、场景 Awake）提前查好数据包源，管线直接读缓存。
        /// </summary>
        public static string CachedDataApkSource = null;

        /// <summary>设备上既无覆盖层、也无数据包可用（三百二十闸门）：true = 拒绝启动服务端。
        /// 仅设备态置位（PersistDir == null 的 PC 测试环境不拦）。</summary>
        public static bool MissingData;

        /// <summary>主线程调用（场景 Awake，闸门前）：预查数据包 APK 源，供管线线程读缓存。</summary>
        public static void CacheDataApkSource()
        {
            if (!string.IsNullOrEmpty(CachedDataApkSource)) return;
            try
            {
                using (var up = new UnityEngine.AndroidJavaClass("com.unity3d.player.UnityPlayer"))
                using (var act = up.GetStatic<UnityEngine.AndroidJavaObject>("currentActivity"))
                using (var pm = act.Call<UnityEngine.AndroidJavaObject>("getPackageManager"))
                using (var info = pm.Call<UnityEngine.AndroidJavaObject>("getApplicationInfo", DataPkgName, 0))
                {
                    var src = info.Get<string>("sourceDir");
                    if (!string.IsNullOrEmpty(src) && File.Exists(src)) CachedDataApkSource = src;
                }
            }
            catch { /* 未安装数据包 APK：走下方 Download 兜底 */ }
            if (!string.IsNullOrEmpty(CachedDataApkSource)) return;
            foreach (var dir in new[] { "/sdcard/Download", "/storage/emulated/0/Download" })
            {
                try
                {
                    var p = Path.Combine(dir, "fzzl_data.apk");
                    if (File.Exists(p)) { CachedDataApkSource = p; return; }
                }
                catch { }
            }
        }

        /// <summary>
        /// 数据包就绪检查（按优先级）：
        ///   0. <persist>/res/resInfo.json 已就位 → 跳过；
        ///   1. 数据包 APK（已安装的 <pkg>.data，或 Download 目录里的 fzzl_data.apk 文件）→ 拷贝 assets/res/**；
        ///   2. psdata.zip（persist 或 Download）→ 解压；
        ///   3. 都没有 → 置 MissingData（三百二十闸门：设备上拒绝启动服务端，防止缺数据进游戏）。
        /// </summary>
        public static void Ensure(HostEnvironment env, Action<string, double> progress)
        {
            var resInfo = Path.Combine(env.ResDir, "resInfo.json");
            if (File.Exists(resInfo))
            {
                progress("数据包就绪", 1.0);
                return;
            }

            var apkSource = FindDataApkSource(env);
            if (apkSource != null)
            {
                ImportFromApk(env, apkSource, progress);
                if (File.Exists(resInfo)) { progress("数据包就绪", 1.0); return; }
                throw new Exception("数据包导入完成但缺少 resInfo.json: " + apkSource);
            }

            foreach (var zipPath in ZipCandidates(env))
            {
                if (!File.Exists(zipPath)) continue;
                try
                {
                    ExtractResZip(zipPath, env, progress);
                    if (File.Exists(resInfo)) { progress("数据包就绪", 1.0); return; }
                }
                catch (Exception e)
                {
                    progress("zip 导入失败(" + Path.GetFileName(zipPath) + "): " + e.Message, 0.0);
                }
            }
            // 三百二十闸门：设备上既无覆盖层、也无数据包可用 → 置 MissingData，
            // BootPipeline.Run 读到后拒绝启动服务端（PC 测试环境 PersistDir == null 不拦）。
            MissingData = env.PersistDir != null;
            progress(MissingData ? "未检测到数据包" : "未找到数据包（仅内置资源可玩）", 0.0);
        }

        /// <summary>数据包 APK 来源：a) 已安装的 &lt;pkg&gt;.data（PackageManager 查 sourceDir）；b) Download 目录的 fzzl_data.apk。
        /// PC 环境直接返回 null（Android 类型只允许在设备路径的独立方法里出现，避免 PC JIT 解析失败）。
        /// 优先用 Bootstrap.Init 在主线程预缓存的源（闸门期间不能回头 RunOnMain 走 JNI）。</summary>
        public static string FindDataApkSource(HostEnvironment env)
        {
            if (env.PersistDir == null) return null; // PC
            if (!string.IsNullOrEmpty(CachedDataApkSource)) return CachedDataApkSource;
            return FindDataApkSourceAndroid();
        }

        private static string FindDataApkSourceAndroid()
        {
            // a) 已安装数据包 —— Unity JNI（AndroidJavaObject）必须主线程，后台线程直调会崩
            //    ReflectionHelper.getMethodID（"! parseType; T is not known!"），故整体搬到主线程。
            try
            {
                var src = Bootstrap.RunOnMain(() =>
                {
                    using (var up = new UnityEngine.AndroidJavaClass("com.unity3d.player.UnityPlayer"))
                    using (var act = up.GetStatic<UnityEngine.AndroidJavaObject>("currentActivity"))
                    using (var pm = act.Call<UnityEngine.AndroidJavaObject>("getPackageManager"))
                    using (var info = pm.Call<UnityEngine.AndroidJavaObject>("getApplicationInfo", DataPkgName, 0))
                    {
                        return info.Get<string>("sourceDir");
                    }
                });
                if (!string.IsNullOrEmpty(src) && File.Exists(src)) return src;
            }
            catch { /* 未安装/主线程未就绪 */ }
            // b) Download 目录（用户用文件管理器装包后留下的文件，或手动放置）
            foreach (var dir in new[] { "/sdcard/Download", "/storage/emulated/0/Download" })
            {
                try
                {
                    var p = Path.Combine(dir, "fzzl_data.apk");
                    if (File.Exists(p)) return p;
                }
                catch { }
            }
            return null;
        }

        /// <summary>从数据包 APK 拷贝 assets/res/** → &lt;persist&gt;/res/**（断点续传：同大小已存在即跳过）。</summary>
        static void ImportFromApk(HostEnvironment env, string apkPath, Action<string, double> progress)
        {
            progress("从数据包 APK 导入资源", 0.0);
            using (var zip = new Shims.PsZipReader(apkPath)) // 手写 STORE 解析（托管层无压缩组件）
            {
                var names = zip.NamesByPrefix("assets/res/");
                long total = 0, done = 0;
                foreach (var n in names) total += zip.EntrySize(n);
                Directory.CreateDirectory(env.ResDir);
                long lastReport = 0;
                foreach (var name in names)
                {
                    var tail = MapResTail(name);
                    var size = zip.EntrySize(name);
                    var target = Path.Combine(env.ResDir, tail.Replace('/', Path.DirectorySeparatorChar));
                    if (size == 0)
                    {
                        Directory.CreateDirectory(Path.GetDirectoryName(target));
                        continue;
                    }
                    Directory.CreateDirectory(Path.GetDirectoryName(target));
                    if (File.Exists(target) && new FileInfo(target).Length == size)
                    {
                        done += size; // 断点续传
                    }
                    else
                    {
                        using (var fsOut = new FileStream(target, FileMode.Create, FileAccess.Write))
                        {
                            zip.ReadTo(name, fsOut);
                        }
                        done += size;
                    }
                    if (done - lastReport >= 16L * 1024 * 1024 || done >= total)
                    {
                        lastReport = done;
                        progress("从数据包 APK 导入资源", 0.14 + 0.62 * ((double)done / Math.Max(total, 1)));
                    }
                }
            }
        }

        static string MapResTail(string fullName)
        {
            var rel = fullName.Replace('\\', '/');
            const string p1 = "assets/res/";
            const string p2 = "res/";
            const string p3 = "files/res/";
            string tail = rel.StartsWith(p1) ? rel.Substring(p1.Length)
                : rel.StartsWith(p2) ? rel.Substring(p2.Length)
                : rel.StartsWith(p3) ? rel.Substring(p3.Length) : null;
            return string.IsNullOrEmpty(tail) ? null : tail;
        }

        static System.Collections.Generic.IEnumerable<string> ZipCandidates(HostEnvironment env)
        {
            var baseDir = env.PersistDir ?? env.RootDir;
            yield return Path.Combine(baseDir, "psdata.zip");
            yield return "/sdcard/Download/psdata.zip";
            yield return "/storage/emulated/0/Download/psdata.zip";
        }

        /// <summary>解压 res/** 形态的 zip（仅 STORE；psdata.zip 请用 build_data_apk 的 STORE 形态）。</summary>
        static void ExtractResZip(string zipPath, HostEnvironment env, Action<string, double> progress)
        {
            progress("解压数据包", 0.0);
            using (var zip = new Shims.PsZipReader(zipPath)) // 手写 STORE 解析（托管层无压缩组件）
            {
                var names = zip.NamesByPrefix("");
                long total = 0, done = 0;
                var wanted = new System.Collections.Generic.List<string>();
                foreach (var n in names)
                {
                    if (MapResTail(n) == null || zip.EntrySize(n) == 0) continue;
                    wanted.Add(n);
                    total += zip.EntrySize(n);
                }
                Directory.CreateDirectory(env.ResDir);
                foreach (var n in wanted)
                {
                    var target = Path.Combine(env.ResDir, MapResTail(n).Replace('/', Path.DirectorySeparatorChar));
                    Directory.CreateDirectory(Path.GetDirectoryName(target));
                    var size = zip.EntrySize(n);
                    if (File.Exists(target) && new FileInfo(target).Length == size) { done += size; continue; }
                    using (var fsOut = new FileStream(target, FileMode.Create, FileAccess.Write))
                    {
                        zip.ReadTo(n, fsOut);
                    }
                    done += size;
                    progress("解压数据包", (double)done / Math.Max(total, 1));
                }
            }
        }
    }
}
