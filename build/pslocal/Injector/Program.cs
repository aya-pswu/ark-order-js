// PsLocalServer 注入器（dnlib）：
//   1) Assembly-CSharp.dll：新增静态类 PsLocalBoot（Boot/Pump 两个方法），
//      Boot() 打上 [RuntimeInitializeOnLoadMethod(BeforeSceneLoad)] 调 Bootstrap.Main()；
//   2) UnityEngine.CoreModule.dll：Time.get_deltaTime 入口插入 Pump() 调用（每帧驱动进度条 UI）。
// 输出 <dll>.patched，由 build_apk.py 塞回 APK。
using dnlib.DotNet;
using dnlib.DotNet.Emit;
using dnlib.DotNet.Writer;
using System.Linq;

class Program
{
    static int Main(string[] args)
    {
        if (args.Length > 0 && args[0] == "--dump-awake") { StringFind.DumpAwake(args[1]); return 0; }
        if (args.Length > 0 && args[0] == "--find") return StringFind.Run(args.Skip(1).ToArray());
        if (args.Length > 3 && args[0] == "--dump-il") { DumpIL(args[1], args[2], args[3]); return 0; }
        if (args.Length < 2)
        {
            System.Console.WriteLine("usage: injector [--find <dll> <substr>] [--dump-il <dll> <type> <method>] | <Assembly-CSharp.dll> <UnityEngine.CoreModule.dll> [Assembly-CSharp-firstpass.dll]");
            return 1;
        }
        var acsPath = args[0];
        var corePath = args[1];
        var firstpassPath = args.Length > 2 ? args[2] : null;

        // ---- 1) Assembly-CSharp：PsLocalBoot ----
        var acs = ModuleDefMD.Load(acsPath);

        // 先读 CoreModule 拿 RuntimeInitializeLoadType.BeforeSceneLoad 的数值
        var core = ModuleDefMD.Load(corePath);
        var enumType = core.Find("UnityEngine.RuntimeInitializeLoadType", false);
        int beforeSceneLoad = 4;
        if (enumType != null)
        {
            foreach (var f in enumType.Fields)
                if (f.Name == "BeforeSceneLoad" && f.HasConstant)
                    beforeSceneLoad = (int)f.Constant.Value;
        }
        System.Console.WriteLine($"BeforeSceneLoad = {beforeSceneLoad}");

        var asmRef = new AssemblyRefUser("PsLocalServer"); // 引用必须指向 PsLocalServer.dll（此前错指自身，Mono 报 Missing method）
        var nsTypeRef = new TypeRefUser(acs, "PsLocalServer", "Bootstrap", asmRef);
        var mainRef = (IMethod)new MemberRefUser(acs, "Main", MethodSig.CreateStatic(acs.CorLibTypes.Void), nsTypeRef);
        var pumpRef = (IMethod)new MemberRefUser(acs, "Pump", MethodSig.CreateStatic(acs.CorLibTypes.Void), nsTypeRef);

        var boot = new MethodDefUser("Boot", MethodSig.CreateStatic(acs.CorLibTypes.Void),
            MethodImplAttributes.IL,
            MethodAttributes.Public | MethodAttributes.Static | MethodAttributes.HideBySig);
        boot.Body = new CilBody();
        boot.Body.Instructions.Add(Instruction.Create(OpCodes.Call, mainRef));
        boot.Body.Instructions.Add(Instruction.Create(OpCodes.Ret));

        var pump = new MethodDefUser("Pump", MethodSig.CreateStatic(acs.CorLibTypes.Void),
            MethodImplAttributes.IL,
            MethodAttributes.Public | MethodAttributes.Static | MethodAttributes.HideBySig);
        pump.Body = new CilBody();
        pump.Body.Instructions.Add(Instruction.Create(OpCodes.Call, pumpRef));
        pump.Body.Instructions.Add(Instruction.Create(OpCodes.Ret));

        var bootType = new TypeDefUser("", "PsLocalBoot", acs.CorLibTypes.Object.TypeDefOrRef)
        {
            Attributes = TypeAttributes.Public | TypeAttributes.Class | TypeAttributes.Abstract | TypeAttributes.Sealed | TypeAttributes.BeforeFieldInit,
        };
        bootType.Methods.Add(boot);
        bootType.Methods.Add(pump);
        acs.Types.Add(bootType);

        // [RuntimeInitializeOnLoadMethod(BeforeSceneLoad)]
        var coreAsmRef = new AssemblyRefUser(core.Assembly.Name);
        var attrTypeRef = new TypeRefUser(acs, "UnityEngine", "RuntimeInitializeOnLoadMethodAttribute", coreAsmRef);
        IMethod attrCtor = new MemberRefUser(acs, ".ctor",
            MethodSig.CreateInstance(acs.CorLibTypes.Void, new ClassSig(acs.CorLibTypes.IntPtr.TypeDefOrRef)), attrTypeRef);
        // 用 enum 类型签名修正 ctor 参数
        var enumTypeRef = new TypeRefUser(acs, "UnityEngine", "RuntimeInitializeLoadType", coreAsmRef);
        attrCtor = new MemberRefUser(acs, ".ctor",
            MethodSig.CreateInstance(acs.CorLibTypes.Void, new ValueTypeSig(enumTypeRef)), attrTypeRef);

        var attr = new CustomAttribute((ICustomAttributeType)attrCtor);
        attr.ConstructorArguments.Add(new CAArgument(new ValueTypeSig(enumTypeRef), beforeSceneLoad));
        boot.CustomAttributes.Add(attr);

        // ---- PocoManager.Awake 钩子（ilpatch 已验证的手法）：首场景生命周期，必然执行、
        // ---- 且早于游戏第一个 HTTP 请求。插在 Awake 体最前（不扰动后续栈）。
        try
        {
            var pocoType = acs.GetTypes().First(t => t.FullName == "PocoManager");
            var awake = pocoType.Methods.First(m => m.Name == "Awake");
            var initRef2 = (IMethod)new MemberRefUser(acs, "Init", MethodSig.CreateStatic(acs.CorLibTypes.Void), nsTypeRef);
            awake.Body.Instructions.Insert(0, Instruction.Create(OpCodes.Call, initRef2));
            awake.Body.MaxStack = (ushort)System.Math.Max((int)awake.Body.MaxStack, 8);
            System.Console.WriteLine("inject: PocoManager.Awake -> Bootstrap.Init");
        }
        catch (System.Exception ex) { System.Console.WriteLine("WARN: PocoManager.Awake patch skipped: " + ex.Message); }

        // ---- <Module>::.cctor（Mono 实测不执行，仅作多保险保留）
        var globalType = acs.GlobalType;
        var initRef = (IMethod)new MemberRefUser(acs, "Init", MethodSig.CreateStatic(acs.CorLibTypes.Void), nsTypeRef);
        var existingCctor = globalType.FindStaticConstructor();
        if (existingCctor == null)
        {
            var cctor = new MethodDefUser(".cctor", MethodSig.CreateStatic(acs.CorLibTypes.Void),
                MethodImplAttributes.IL,
                MethodAttributes.Private | MethodAttributes.Static | MethodAttributes.SpecialName | MethodAttributes.RTSpecialName);
            cctor.Body = new CilBody();
            cctor.Body.Instructions.Add(Instruction.Create(OpCodes.Call, initRef));
            cctor.Body.Instructions.Add(Instruction.Create(OpCodes.Ret));
            globalType.Methods.Add(cctor);
            System.Console.WriteLine("inject: <Module>::.cctor -> Bootstrap.Init");
        }
        else
        {
            existingCctor.Body.Instructions.Insert(0, Instruction.Create(OpCodes.Call, initRef));
            existingCctor.Body.MaxStack = (ushort)System.Math.Max((int)existingCctor.Body.MaxStack, 8);
            System.Console.WriteLine("inject: existing <Module>::.cctor patched");
        }

        // ---- 客户端 Lua 远程通道的接收窗口补丁（2026-09-15「卡启动中十几分钟」根因）----
        // LuaRemoteSocket.ReadRemoteLuaFile 里那句 `_client.ReceiveBufferSize = 16384;` 同时决定两件事：
        //   ① 内核 SO_RCVBUF，也就是 TCP 接收窗口；② ReceiveLuaFile 每次 Receive 的读取长度。
        // 16KB 窗口把 19MB 整帧逼成 ~1162 次窗口往返，设备实测每个窗口要等 ~0.3s
        // （延迟 ACK / 窗口更新顿挫；/proc/net/tcp 上表现为发送队列压满 ~900KB 而客户端接收队列恒为 0），
        // 整帧 6 分钟才传完 —— 玩家看到的就是「卡启动中」；PC 端正常窗口下同一帧 0.06s。
        // 改成 1MB：窗口足够大 → 发送端可连续灌；读取长度同源变成 1MB → 循环 ~19 次。
        const int LuaRecvWindow = 1024 * 1024;
        int patchedWin = 0;
        foreach (var t in acs.GetTypes())
        {
            if (t.Name != "LuaRemoteSocket") continue;
            foreach (var m in t.Methods)
            {
                if (!m.HasBody) continue;
                var ins = m.Body.Instructions;
                for (int i = 0; i < ins.Count; i++)
                {
                    if (ins[i].OpCode != OpCodes.Ldc_I4) continue;
                    if (!(ins[i].Operand is int v) || v != 16384) continue;
                    // 只有紧跟 set_ReceiveBufferSize 的那个 16384 才是窗口常量（别误伤同类型其他常量）
                    bool hit = false;
                    for (int j = i + 1; j < ins.Count && j <= i + 4; j++)
                    {
                        var mi = ins[j].Operand as IMethod;
                        if (mi != null && mi.Name == "set_ReceiveBufferSize") { hit = true; break; }
                    }
                    if (!hit) continue;
                    ins[i].Operand = LuaRecvWindow;
                    patchedWin++;
                    System.Console.WriteLine("patch: " + t.FullName + "::" + m.Name +
                                             "  ReceiveBufferSize 16384 -> " + LuaRecvWindow);
                }
            }
        }
        if (patchedWin == 0)
        {
            System.Console.WriteLine("VERIFY-FAIL: 未找到 LuaRemoteSocket 的 ReceiveBufferSize 常量（客户端版本变了？）");
            return 1;
        }

        var optsA = new ModuleWriterOptions(acs) { Logger = DummyLogger.NoThrowInstance };
        acs.Write(acsPath + ".patched", optsA);
        System.Console.WriteLine("OK: " + acsPath + ".patched");

        // 回读校验：确认属性可被解析（Unity 对解析失败的 attribute 会静默忽略）
        using (var chk = ModuleDefMD.Load(acsPath + ".patched"))
        {
            var t = chk.Find("PsLocalBoot", false);
            if (t == null) { System.Console.WriteLine("VERIFY-FAIL: PsLocalBoot missing"); return 1; }
            var b = t.Methods.First(m => m.Name == "Boot");
            System.Console.WriteLine("VERIFY: Boot exists, attrs=" + b.CustomAttributes.Count);
            foreach (var ca in b.CustomAttributes)
                System.Console.WriteLine("  attr " + ca.TypeFullName + " args=" +
                    string.Join(",", ca.ConstructorArguments.Select(a => a.Value)));

            // 回读校验窗口补丁（IL 写盘不报错，必须回读确认）
            var lr = chk.GetTypes().FirstOrDefault(x => x.Name == "LuaRemoteSocket");
            if (lr == null) { System.Console.WriteLine("VERIFY-FAIL: LuaRemoteSocket missing"); return 1; }
            int seen = 0;
            foreach (var m in lr.Methods)
            {
                if (!m.HasBody) continue;
                var ins = m.Body.Instructions;
                for (int i = 0; i < ins.Count; i++)
                {
                    if (ins[i].OpCode != OpCodes.Ldc_I4) continue;
                    if (ins[i].Operand is int v && (v == 16384 || v == LuaRecvWindow))
                    {
                        seen++;
                        System.Console.WriteLine("  verify " + m.Name + " @IL_" + ins[i].Offset.ToString("X4") +
                                                 " ldc.i4 " + v);
                    }
                }
            }
            System.Console.WriteLine("VERIFY: LuaRemoteSocket 窗口常量出现 " + seen + " 处（应全为 " + LuaRecvWindow + "）");
            if (seen == 0) return 1;
        }

        // CoreModule 的 Time.get_deltaTime 是 icall（无 IL 体）不可插 —— UI 驱动改用
        // UnitySynchronizationContext.Post（引擎每帧自动泵），见 Bootstrap.EnqueueUi。

        // ---- 2) Assembly-CSharp-firstpass：Main.OnSysCfgComplete → SplashGate（v5 闸门，2026-10-10）----
        if (firstpassPath != null)
        {
            if (!PatchSplashGate(firstpassPath)) return 1;
        }
        return 0;
    }

    /// <summary>诊断：打印某方法的 IL（含偏移、异常子句、maxstack）。</summary>
    static void DumpIL(string dllPath, string typeName, string methodName)
    {
        var module = ModuleDefMD.Load(dllPath);
        var type = module.GetTypes().First(t => t.FullName == typeName);
        var method = type.Methods.First(m => m.Name == methodName);
        System.Console.WriteLine("maxstack=" + method.Body.MaxStack + " initLocals=" + method.Body.InitLocals +
                                 " locals=" + method.Body.Variables.Count + " eh=" + method.Body.ExceptionHandlers.Count);
        foreach (var v in method.Body.Variables)
            System.Console.WriteLine("  local[" + v.Index + "] " + v.Type.TypeName);
        foreach (var eh in method.Body.ExceptionHandlers)
            System.Console.WriteLine("  EH " + eh.HandlerType + " try=" + (eh.TryStart?.Offset.ToString("X4") ?? "-") +
                                     ".." + (eh.TryEnd?.Offset.ToString("X4") ?? "-") +
                                     " handler=" + (eh.HandlerStart?.Offset.ToString("X4") ?? "-") +
                                     ".." + (eh.HandlerEnd?.Offset.ToString("X4") ?? "-"));
        foreach (var ins in method.Body.Instructions)
            System.Console.WriteLine("  IL_" + ins.Offset.ToString("X4") + ": " + ins.OpCode + " " +
                                     (ins.Operand == null ? "" : ins.Operand.ToString()));
    }

    /// <summary>
    /// （2026-10-10 v5）补丁 Assembly-CSharp-firstpass.dll：客户端 Assets.Plugins.Scripts.Main.OnSysCfgComplete
    /// 开头插入 SplashGate(this) 分支——返回 false 就立即 ret（跳过 logo 播放）。事实依据
    /// （tools/csharp_out_fp/Assets.Plugins.Scripts/Main.cs + SystemConfig.cs）：
    /// Main.Start → SystemConfig.AsyncLoadCfg(OnSysCfgComplete)（读本地 syscfg.json，同步完成）
    /// → OnSysCfgComplete → PlaySplashQueue(PrepareEnv) 播 logoFirst/logoMingChao → PrepareEnv →
    /// LoadFirstRes → FisrtResLoadComplete（「正在检查更新」）→ CheckUpdata（UpdateManager，失败即弹
    /// 「连接不到服务器，是否重新连接」）。v4 的闸门挂在 PrepareEnv（logo 播完之后），实测用户先看
    /// logo/检查更新、进度条姗姗来迟且只剩 80%→100% 跳变，更新检查不等服务端就绪还弹重连。
    /// v5 把闸门提到 OnSysCfgComplete：服务端未就绪 → 跳过（logo 不播，进度条首帧即建、全程可见、
    /// 精确到模块）；就绪后 Bootstrap.SendMessage("OnSysCfgComplete") 补调，logo 与后续流程才开始。
    /// 输出 &lt;dll&gt;.patched 并回读校验。
    /// </summary>
    static bool PatchSplashGate(string dllPath)
    {
        var module = ModuleDefMD.Load(dllPath);
        var acsRef = new AssemblyRefUser("PsLocalServer");
        var nsTypeRef = new TypeRefUser(module, "PsLocalServer", "Bootstrap", acsRef);
        try
        {
            // 注意：dnlib 的 Method.Parameters 含隐式 this（实例方法恒 ≥1），故只按方法名匹配
            var mainType = module.GetTypes().First(t => t.FullName == "Assets.Plugins.Scripts.Main");
            var onCfg = mainType.Methods.First(m => m.Name == "OnSysCfgComplete");
            var gateRef = (IMethod)new MemberRefUser(module, "SplashGate",
                MethodSig.CreateStatic(module.CorLibTypes.Boolean, module.CorLibTypes.Object), nsTypeRef);
            var ins = onCfg.Body.Instructions;
            // 最终形态：ldarg.0; call SplashGate; brtrue.s 原第一条; ret; 原第一条...
            // （Insert(0,x) 每次都把 x 顶到最前，故按【逆序】插入——2026-10-10 首版按阅读顺序插入
            //   落成 call→ret→brtrue，fall-through 带 bool 撞 void ret，mono 抛 InvalidProgramException，
            //   客户端直接黑屏。教训：IL 补丁必须真机可跑才算数，静态回读只验形状不验语义。）
            var origFirst = ins[0];
            ins.Insert(0, Instruction.Create(OpCodes.Ret));
            ins.Insert(0, Instruction.Create(OpCodes.Brtrue_S, origFirst));
            ins.Insert(0, Instruction.Create(OpCodes.Call, gateRef));
            ins.Insert(0, Instruction.Create(OpCodes.Ldarg_0));
            onCfg.Body.MaxStack = (ushort)System.Math.Max((int)onCfg.Body.MaxStack, 8);
            System.Console.WriteLine("inject[firstpass]: Assets.Plugins.Scripts.Main.OnSysCfgComplete -> Bootstrap.SplashGate");
        }
        catch (System.Exception ex)
        {
            System.Console.WriteLine("VERIFY-FAIL: firstpass OnSysCfgComplete 补丁失败: " + ex.Message);
            return false;
        }
        var opts = new ModuleWriterOptions(module) { Logger = DummyLogger.NoThrowInstance };
        module.Write(dllPath + ".patched", opts);
        System.Console.WriteLine("OK: " + dllPath + ".patched");

        using (var chk = ModuleDefMD.Load(dllPath + ".patched"))
        {
            var mainT = chk.GetTypes().FirstOrDefault(x => x.FullName == "Assets.Plugins.Scripts.Main");
            if (mainT == null) { System.Console.WriteLine("VERIFY-FAIL: firstpass Main missing"); return false; }
            var onCfg = mainT.Methods.FirstOrDefault(m => m.Name == "OnSysCfgComplete");
            if (onCfg == null || !onCfg.HasBody || onCfg.Body.Instructions.Count < 4)
            { System.Console.WriteLine("VERIFY-FAIL: firstpass OnSysCfgComplete missing"); return false; }
            var ins = onCfg.Body.Instructions;
            var ok = ins[0].OpCode == OpCodes.Ldarg_0
                && ins[1].OpCode == OpCodes.Call && ins[1].Operand is IMethod gm && gm.Name == "SplashGate"
                && ins[2].OpCode == OpCodes.Brtrue_S
                && ins[3].OpCode == OpCodes.Ret;
            System.Console.WriteLine("VERIFY: firstpass Main.OnSysCfgComplete[0..3] = " +
                                     ins[0].OpCode + ", " + ins[1] + ", " + ins[2].OpCode + " → " + ins[2].Operand + ", " + ins[3].OpCode +
                                     (ok ? "  → OK（SplashGate 闸门已挂）" : "  → FAIL"));
            return ok;
        }
    }
}
