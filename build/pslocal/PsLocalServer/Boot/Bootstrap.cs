// 设备侧自举入口。两个钩子（都由 dnlib 注入 Assembly-CSharp.dll）：
//   · <Module>::.cctor → Bootstrap.Init()   —— 确定性最早托管入口（任何游戏代码前），
//     此时 Unity 场景未加载、禁止碰任何 Unity API（UI 延迟到同步上下文开始泵之后）。
//   · PsLocalBoot.Boot() → Bootstrap.Main() —— [RuntimeInitializeOnLoadMethod] 兜底（实测部分
//     场景不触发，故以 cctor 为主）。两者幂等。
// 首启管线在后台线程跑；进度通过 SynchronizationContext.Post 搬到主线程建 UI/刷进度条。
using System;
using System.Collections.Generic;
using System.Threading;
using UnityEngine;

namespace PsLocalServer
{
    public static class Bootstrap
    {
        public const string PackageName = "com.bilibili.fzzl.guopan";

        private static readonly object _qLock = new object();
        private static readonly Queue<Action> MainActions = new Queue<Action>();
        private static BootUi _ui;
        private static bool _uiBuilt;
        private static bool _started;
        private static BootPipeline _pipe;
        private static System.Threading.SynchronizationContext _mainCtx;

        // ★ 2026-10-10 v5（进度条前置 + logo 后置）：v4 的闸门挂在 Main.PrepareEnv（两个 logo 播完
        //   之后），实测时序是：logo 播完 → 游戏进入「正在检查更新」→ 进度条才出现且管线已跑到
        //   0.80（暖启动播种/数据包都是毫秒级）→ 用户只看到 80%→100% 跳变 → 更新检查不等服务端
        //   就绪、超时弹「连接不到服务器，是否重新连接」（UpdateManager.CheckError），点重连才能进登录。
        //   v5 改为：闸门挂 Main.OnSysCfgComplete（syscfg 读完、logo 尚未开始播）——服务端未就绪时
        //   跳过 OnSysCfgComplete（不发 logo），uGUI 进度条首帧即建、全程实时显示管线进度；管线
        //   READY 且进度条淡出完成后由 Bootstrap.SendMessage("OnSysCfgComplete") 补调放行，
        //   之后的检查更新/Lua/登录全部打在已就绪的服务端上，重连弹窗结构上不可能出现。
        //   闸门是"跳过 + 补调"，不是冻结主线程——uGUI 渲染不受影响（v3 冻结方案作废的教训保留）。
        private static volatile bool _splashResumed;  // 已放行（补调完成或闸门直接放行）
        private static UnityEngine.MonoBehaviour _splashMain; // 闸门时捕获的 Main 实例（SendMessage 用）
        private static volatile bool _fatal;          // 管线失败（失败也放行游戏流程）
        private static DateTime _lastProgressUtc = DateTime.UtcNow;
        private static string _lastStage = "启动内置服务端";
        private static double _lastPct;

        /// <summary>
        /// 要不要预绑定端口。Jint 模式必须绑（游戏最早的 HTTP 请求靠它兜底）；
        /// node 模式必须不绑（否则 psnode EADDRINUSE）。
        /// 判据优先级：extcfg 的 PsServerEngine > 打包期 DefaultEngine。
        /// Init 时机 extcfg 可能还不存在，所以这里只做最朴素的字符串判定，不引入 ExtCfg 依赖。
        /// </summary>
        private static bool ShouldPreBind()
        {
            try
            {
                if (SeedStamp.DefaultEngine != "node") return true;
                var cfg = "/sdcard/Android/data/" + PackageName + "/files/extcfg.json";
                if (System.IO.File.Exists(cfg))
                {
                    var s = System.IO.File.ReadAllText(cfg);
                    if (s.IndexOf("\"PsServerEngine\":\"jint\"", StringComparison.Ordinal) >= 0) return true;
                }
                return false;
            }
            catch { return true; }   // 判定失败就退回 Jint 行为（保守）
        }

        /// <summary>模块静态构造器入口（最早托管时机，禁碰 Unity API）。</summary>
        public static void Init()
        {
            try
            {
                if (_started) return;
                _started = true;
                IsDeviceMode = true;
                try { System.IO.File.WriteAllText("/data/data/" + PackageName + "/files/psboot_started.txt", DateTime.UtcNow.ToString("o")); } catch { }
                _mainCtx = System.Threading.SynchronizationContext.Current; // 此时多半为 null，等 Post 时再取
                // 毫秒级预绑定三端口：Jint 模式下游戏最早的 HTTP 配置请求立即有 C# 应答，Jint 冷启动不受影响。
                // ⚠️ node 模式下**绝不能预绑定**：端口被 C# 占着，psnode listen 会 EADDRINUSE，
                //    start.js:220 直接 process.exit(1)，表现为"游戏一直连不上、日志也干净"。
                //    代价是失去"最早一次 HTTP 有应答"的兜底 → 由 SplashGate 拦着游戏流程补偿（见 §6.2 B4）。
                if (ShouldPreBind()) PsPortHub.PreBind(8081, 9021, 44587);
                else PsLog.Sink("prebind skipped: engine=node");
                // 主线程预缓存数据包 APK 源（管线后台线程稳定复用，避免冷路径 RunOnMain 等待）
                DataPackage.CacheDataApkSource();
                StartPipeline("/sdcard/Android/data/" + PackageName + "/files");
                // v5：进度条不再等 logo（首帧即建）；logo 等服务端（OnSysCfgComplete 闸门，见类头注释）
            }
            catch (Exception e)
            {
                BootFail("init exception", e);
            }
        }

        /// <summary>RuntimeInitializeOnLoadMethod 兜底入口（主线程）。</summary>
        public static void Main()
        {
            try
            {
                if (!_started)
                {
                    _started = true;
                    IsDeviceMode = true;
                    try { System.IO.File.WriteAllText("/data/data/" + PackageName + "/files/psboot_started.txt", DateTime.UtcNow.ToString("o")); } catch { }
                    _mainCtx = System.Threading.SynchronizationContext.Current;
                    StartPipeline(Application.persistentDataPath);
                    // v5：时机同 Init（进度条首帧即建，logo 由 OnSysCfgComplete 闸门放行）
                }
                if (_mainCtx == null) _mainCtx = System.Threading.SynchronizationContext.Current;
                DrainMainActions(); // Init 早于主线程上下文时排队的 UI 动作在这里补跑
            }
            catch (Exception e)
            {
                BootFail("main exception", e);
            }
        }

        /// <summary>排空 MainActions（仅主线程调用）。</summary>
        private static void DrainMainActions()
        {
            while (true)
            {
                Action a;
                lock (_qLock) { if (MainActions.Count == 0) return; a = MainActions.Dequeue(); }
                try { a(); } catch (Exception e) { UnityEngine.Debug.LogError("[PsLocal] drain: " + e); }
            }
        }

        private static void StartPipeline(string persist)
        {
            var env = new Shims.DeviceEnvironment(persist);
            var logFile = System.IO.Path.Combine(System.IO.Path.Combine(System.IO.Path.Combine(System.IO.Path.Combine(persist, "psroot"), "ps_server"), "logs"), "js.log");
            PsLog.ConsoleMirror = s => EnqueueUi(() => _ui?.SetStatus(s != null && s.Length > 90 ? s.Substring(0, 90) : s));

            _pipe = new BootPipeline(env, logFile);
            _pipe.Progress = (stage, pct) =>
            {
                _lastStage = stage; _lastPct = pct;
                _lastProgressUtc = DateTime.UtcNow;
                EnqueueUi(() => _ui?.Set(stage, pct));
            };
            _pipe.Fatal = msg =>
            {
                _fatal = true;
                EnqueueUi(() => _ui?.Set("启动失败: " + msg, 1f));
                EnqueueUi(TryResumeSplash); // 失败也放行游戏流程，让它走自己的报错 UI（进度条照常淡出）
            };
            _pipe.Halt = msg =>
            {
                // 三百二十：缺数据包拒启——与 Fatal 相反，绝不放行游戏（SplashGate 永不补调），
                // 进度条停在提示文案；Toast 再喊一遍（覆盖 boot UI 被切后台看不到的情况）。
                Toast(msg);
            };
            _pipe.Ready = () =>
            {
                // 先等进度条淡出完成（OnGone），再放行 logo——logo 不能从进度条底下"露"出来
                EnqueueUi(() =>
                {
                    if (_uiBuilt && _ui != null) _ui.OnGone = TryResumeSplash;
                    else TryResumeSplash(); // 条还没建就绪了（极快路径）：直接放行
                });
                // 兜底：淡出回调万一丢失（驱动异常等），4s 后强制放行
                var t = new Thread(() => { Thread.Sleep(4000); EnqueueUi(TryResumeSplash); }) { IsBackground = true, Name = "PsReadyFallback" };
                t.Start();
            };
            _pipe.RunAsync();
            // 进度长时间停滞兜底（数据包 I/O 卡死等）：放行游戏流程走它自己的报错 UI
            var wd = new Thread(Watchdog) { IsBackground = true, Name = "PsBootWatchdog" };
            wd.Start();
        }

        /// <summary>
        /// ★ v5 启动闸门（由 dnlib 注入到客户端 Assets.Plugins.Scripts.Main.OnSysCfgComplete 开头）。
        /// 该方法是 syscfg 读完后的第一个游戏流程点（随后才是 PlaySplashQueue 播 logo → PrepareEnv →
        /// 检查更新）。返回 false = 服务端未就绪：调用方立即返回（logo 不播），Bootstrap 在管线
        /// READY + 进度条淡出后用 SendMessage("OnSysCfgComplete") 补调放行；返回 true = 正常执行。
        /// 形参是 Main 实例（IL 侧 ldarg.0 传入），捕获后供补调 SendMessage 用。
        /// </summary>
        public static bool SplashGate(object mainInstance)
        {
            try
            {
                if (!IsDeviceMode || _splashResumed) return true;
                _splashMain = mainInstance as UnityEngine.MonoBehaviour;
                if (_fatal || (_pipe != null && _pipe.IsReady))
                {
                    _splashResumed = true; // 服务端已就绪/已失败：直接放行，不耽误一帧
                    return true;
                }
                return false; // 跳过本次调用；就绪后 TryResumeSplash 补调
            }
            catch (Exception e)
            {
                BootFail("splashgate exception", e);
                return true; // 闸门自身出错必须放行，绝不因自举问题挡死游戏
            }
        }

        /// <summary>补调 OnSysCfgComplete（仅主线程调用；幂等）。</summary>
        private static void TryResumeSplash()
        {
            if (_splashResumed || !IsDeviceMode) return;
            _splashResumed = true;
            var m = _splashMain;
            if (m == null) return;
            try { m.SendMessage("OnSysCfgComplete"); }
            catch (Exception e) { BootFail("resume splash exception", e); }
        }

        /// <summary>进度停滞看门狗：120s 无任何进度上报则放行游戏（服务端可能卡死在 I/O），
        /// 并让进度条走"超时"文案正常淡出，避免盖住游戏自己的报错弹窗。
        /// 三百二十：缺数据包拒启（Halted）时看门狗直接退出——闸门就是终态，绝不强放。</summary>
        private static void Watchdog()
        {
            while (!_splashResumed)
            {
                Thread.Sleep(5000);
                if (_splashResumed) return;
                if (_pipe != null && _pipe.Halted) return;
                if ((DateTime.UtcNow - _lastProgressUtc).TotalSeconds > 120)
                {
                    EnqueueUi(() =>
                    {
                        _ui?.Set("服务端启动超时", 1f);
                        TryResumeSplash();
                    });
                    return;
                }
            }
        }

        /// <summary>把一段委托搬到主线程执行并等待结果（Unity JNI/AndroidJavaObject 必须主线程，
        /// 后台线程直调会崩 ReflectionHelper.getMethodID："! parseType; T is not known!"）。
        /// 设备上若主线程上下文尚未捕获则等待其就绪（最多 20s）；PC（无 Unity）直接本线程执行。</summary>
        public static bool IsDeviceMode; // Init/Main 置 true；RunForTest 保持 false

        public static T RunOnMain<T>(Func<T> fn)
        {
            var ctx = _mainCtx ?? System.Threading.SynchronizationContext.Current;
            if (ctx == null && IsDeviceMode)
            {
                // 主线程上下文可能尚未被 EnqueueUi 捕获 —— 轮询等待（引擎开始泵后即就绪）
                for (int i = 0; i < 200 && ctx == null; i++)
                {
                    System.Threading.Thread.Sleep(100);
                    ctx = _mainCtx;
                }
                // 设备模式仍拿不到主线程：绝不降级到本线程执行（JNI 跨线程 = 进程崩溃）
                if (ctx == null) throw new TimeoutException("RunOnMain: main thread context unavailable");
            }
            if (ctx == null) return fn(); // PC 或无 Unity：本线程执行
            T result = default(T);
            Exception err = null;
            using (var done = new System.Threading.ManualResetEvent(false))
            {
                ctx.Post(_ =>
                {
                    try { result = fn(); }
                    catch (Exception e) { err = e; }
                    finally { done.Set(); }
                }, null);
                // 主线程若卡在 loading 不泵（极端情况），最多等 15s 后放弃，避免死锁
                if (!done.WaitOne(15000)) throw new TimeoutException("RunOnMain timeout");
            }
            if (err != null) throw new Exception("RunOnMain: " + err.Message, err);
            return result;
        }

        /// <summary>无返回值版。</summary>
        public static void RunOnMainVoid(Action fn)
        {
            RunOnMain<bool>(() => { fn(); return true; });
        }

        /// <summary>
        /// Android Toast（主线程、**异步**）。用于"引擎回退"这类必须被玩家看见的事件。
        /// 刻意 fire-and-forget：Toast 不能阻塞启动管线——主线程上下文未就绪时 RunOnMain
        /// 会等最多 20 s，直接调用会把回退路径拖成更长的黑屏。
        /// PC / 无 Unity 环境静默返回。
        /// </summary>
        public static void Toast(string msg)
        {
            if (!IsDeviceMode) return;
            var th = new Thread(() =>
            {
                try
                {
                    RunOnMainVoid(() =>
                    {
                        try
                        {
                            using (var player = new UnityEngine.AndroidJavaClass("com.unity3d.player.UnityPlayer"))
                            using (var activity = player.GetStatic<UnityEngine.AndroidJavaObject>("currentActivity"))
                            using (var toast = new UnityEngine.AndroidJavaClass("android.widget.Toast"))
                            {
                                var boxed = toast.CallStatic<UnityEngine.AndroidJavaObject>(
                                    "makeText", activity, msg, 1);   // 1 = LENGTH_LONG
                                boxed.Call("show");
                            }
                        }
                        catch (Exception e) { UnityEngine.Debug.LogError("[PsLocal] toast: " + e.Message); }
                    });
                }
                catch { }
            }) { IsBackground = true, Name = "PsToast" };
            th.Start();
        }

        private static void BootFail(string tag, Exception e)
        {
            var dump = "[PsLocal] " + tag + ": " + e;
            try { UnityEngine.Debug.LogError(dump); } catch { }
            try { System.IO.File.WriteAllText("/data/data/" + PackageName + "/files/psboot_error.txt", e.ToString()); } catch { }
        }

        /// <summary>UI 动作统一走这里：主线程建 UI（延迟到同步上下文开始泵后），再刷进度。
        /// v5：进度条首帧即建（不再等 logo 播完——logo 被闸门挡在服务端就绪之后），首建时用
        /// _lastStage/_lastPct 直接显示当前服务端进度；放行 logo 后不再接受 UI 动作。</summary>
        private static void EnqueueUi(Action a)
        {
            Action wrapped = () =>
            {
                try
                {
                    if (_splashResumed) return; // 已放行 logo（进度条已淡出/在淡出），不再动 UI
                    if (!_uiBuilt)
                    {
                        if (System.Threading.SynchronizationContext.Current == null) return; // 引擎还没开始泵，下一帧再来
                        _ui = new BootUi();
                        _ui.Build();
                        _ui.Set(_lastStage, _lastPct); // 用已记录的最新进度起手（填充条从 0 平滑追上来）
                        _uiBuilt = true;
                    }
                    a();
                }
                catch (Exception e) { UnityEngine.Debug.LogError("[PsLocal] ui: " + e); }
            };
            var ctx = _mainCtx ?? System.Threading.SynchronizationContext.Current;
            if (ctx != null) { _mainCtx = ctx; ctx.Post(o => wrapped(), null); }
            else MainActions.Enqueue(wrapped);
        }

        /// <summary>PC 测试入口（控制台）：返回管线对象，调用方自行等待/保活。</summary>
        public static BootPipeline RunForTest(string rootDir, string resDir = null)
        {
            var env = new Shims.PcEnvironment(rootDir, resDir);
            var logFile = System.IO.Path.Combine(System.IO.Path.Combine(System.IO.Path.Combine(rootDir, "ps_server"), "logs"), "js.log");
            PsLog.ConsoleMirror = s => Console.WriteLine(s);
            var pipe = new BootPipeline(env, logFile);
            pipe.Progress = (stage, pct) => Console.Write("\r[" + (pct * 100).ToString("F0") + "%] " + stage + "        ");
            pipe.Fatal = msg => Console.WriteLine("\nFATAL: " + msg);
            pipe.RunAsync();
            return pipe;
        }
    }
}
