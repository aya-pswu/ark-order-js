// ProfileFixer：把 net40 编译的托管 DLL 修补到【Unity 2017.4 老 mono（mscorlib 2.0 / System.Core 3.5）】
// 可加载的形态。设备实测（2026-09-14，模拟器 mono 日志 + dnlib ProfileAudit 定位）：
//   1. 类型搬家：非泛型 Action / Action`2 / Func`2..5 / TimeZoneInfo 在设备上位于 System.Core 3.5，
//      而 net40 编译引用 [mscorlib 4.0] → TypeLoadException（PsLocalServer.Bootstrap 整类加载失败）。
//      对策：TypeRef 作用域重定向 mscorlib→System.Core（只重定向设备 mscorlib 确实没有的类型）。
//   2. 设备完全没有的类型（Unity 链接器剥离）：
//      System.Dynamic.ExpandoObject → Dictionary<string,object>（实现同一 IDictionary<string,object> 接口）
//      System.Linq.Expressions.DefaultExpression/BlockExpression → ldnull/pop 等价序列
//      （仅 Jint DefaultTypeConverter.Convert 的委托分支用；我们运行时该分支不执行，保证可加载即可）
//   3. 设备 mscorlib 缺失的成员：
//      反射类型 op_Equality/op_Inequality → Object.Equals(±取反)
//      Enum.HasFlag → (Convert.ToUInt64(v) & Convert.ToUInt64(f)) == Convert.ToUInt64(f)
//   4. 去掉 TargetFrameworkAttribute（设备 mscorlib 无此类型；纯元数据，安全剥离）
// 用法: ProfileFixer <inputDll> [outputDll]
using System;
using System.Collections.Generic;
using System.Linq;
using dnlib.DotNet;
using dnlib.DotNet.Emit;

class ProfileFixer
{
    static int fixCount;
    static TypeDefUser helperType;
    static MethodDefUser helper4, helper5, helperJoin;
    static TypeSig exprSig;
    static TypeSig miSig;
    static ModuleDefMD mod;
    static AssemblyRef corlibRef;     // 现有 mscorlib 引用（mono 运行时按名匹配，版本不敏感）
    static AssemblyRef systemCoreRef; // 现有或新建的 System.Core 引用

    // 设备 mscorlib 确实没有、但 System.Core 3.5 有的类型（只列这些；Action`1/Func`1 设备 mscorlib 有，不动）
    static readonly HashSet<string> MovedTypes = new HashSet<string>
    {
        "System.Action",
        "System.Action`2", "System.Action`3", "System.Action`4",
        "System.Func`2", "System.Func`3", "System.Func`4", "System.Func`5",
        "System.TimeZoneInfo",
    };

    static bool tzOnly;
    static bool noDate;

    static void Main(string[] args)
    {
        var argv = new List<string>(args);
        // --tzonly：只做【时区】相关补丁，跳过其余 profile 修正。
        // 用途：把时区补丁打到 PC 可运行的 net8/netstandard Jint 上，用 TzTest 在 PC 直接跑语义断言
        // （完整补丁后的 net40 Jint 在 PC 上跑不起来 —— mscorlib facade 为空）。
        tzOnly = argv.Remove("--tzonly");
        noDate = argv.Remove("--nodate");
        args = argv.ToArray();

        var input = args[0];
        var output = args.Length > 1 ? args[1] : input + ".fixed";
        mod = ModuleDefMD.Load(input);

        corlibRef = mod.GetAssemblyRefs().FirstOrDefault(r => r.Name == "mscorlib");
        if (corlibRef == null) throw new Exception("no mscorlib ref in " + input);

        systemCoreRef = mod.GetAssemblyRefs().FirstOrDefault(r => r.Name == "System.Core");
        if (systemCoreRef == null)
        {
            systemCoreRef = new AssemblyRefUser(new AssemblyNameInfo(
                "System.Core, Version=3.5.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089"));
            // dnlib writer 自动收集 TypeRef.ResolutionScope 用到的 AssemblyRef —— 无需手动 Add
        }

        if (tzOnly)
        {
            // 只跑 IL 修复（其中时区分支生效），不做类型重定向/属性剥离
            var tzTypes = mod.GetTypes().ToList();
            foreach (var t in tzTypes)
                foreach (var m in t.Methods.ToList())
                    if (m.HasBody) FixMethod(m);
            foreach (var t2 in mod.GetTypes().ToList())
                foreach (var m2 in t2.Methods.ToList())
                    if (m2.HasBody)
                    {
                        m2.Body.SimplifyBranches();
                        m2.Body.OptimizeBranches();
                    }
            mod.Write(output);
            Console.WriteLine("ProfileFixer[tzonly]: " + System.IO.Path.GetFileName(input) + " -> " + System.IO.Path.GetFileName(output) + "  fixes=" + fixCount);
            return;
        }

        // ---- 1) 类型作用域重定向 ----
        foreach (var tr in mod.GetTypeRefs().ToList())
        {
            if (tr.ResolutionScope is AssemblyRef ar && ar.Name == "mscorlib" && MovedTypes.Contains(tr.FullName))
            {
                tr.ResolutionScope = systemCoreRef;
                fixCount++;
            }
        }

        // ---- 2) 成员级 IL 替换 ----
        // 先物化类型列表（FixMethod 里可能注入新类型 ProfileShims，不能边迭代边改）
        var allTypes = mod.GetTypes().ToList();
        foreach (var t in allTypes)
            foreach (var m in t.Methods.ToList())
                if (m.HasBody) FixMethod(m);

        // ---- 3) 去掉 TargetFrameworkAttribute（Module 级 + Assembly 级）----
        var attrs = mod.CustomAttributes;
        for (int i = attrs.Count - 1; i >= 0; i--)
        {
            if (attrs[i].TypeFullName == "System.Runtime.Versioning.TargetFrameworkAttribute")
            {
                attrs.RemoveAt(i);
                fixCount++;
            }
        }
        var asmAttrs = mod.Assembly.CustomAttributes;
        for (int i = asmAttrs.Count - 1; i >= 0; i--)
        {
            if (asmAttrs[i].TypeFullName == "System.Runtime.Versioning.TargetFrameworkAttribute")
            {
                asmAttrs.RemoveAt(i);
                fixCount++;
            }
        }

        // IL 修改后短分支可能越界（dnlib 写盘会报 "Target instruction is too far away for a short branch"）
        foreach (var t2 in mod.GetTypes().ToList())
            foreach (var m2 in t2.Methods.ToList())
                if (m2.HasBody)
                {
                    m2.Body.SimplifyBranches();   // 短分支 → 长分支
                    m2.Body.OptimizeBranches();   // 能短则短（含新增指令后的重算）
                }

        mod.Write(output);
        Console.WriteLine("ProfileFixer: " + System.IO.Path.GetFileName(input) + " -> " + System.IO.Path.GetFileName(output) + "  fixes=" + fixCount);
    }

    // ---- 手动构造 MemberRef（不能用 Importer：会指向 net8 的 System.Private.CoreLib）----
    static IMethodDefOrRef CorlibMethod(string ns, string typeName, string methodName, TypeSig retType, params TypeSig[] paramTypes)
    {
        var tr = new TypeRefUser(mod, ns, typeName, corlibRef);
        var sig = MethodSig.CreateStatic(retType, paramTypes);
        return new MemberRefUser(mod, methodName, sig, tr);
    }


    /// <summary>注入 Jint.Runtime.ProfileShims.Call4/Call5（Expression.Call 数组形式转发）。</summary>
    static void EnsureHelpers()
    {
        if (helperType != null) return;
        var exprTr = new TypeRefUser(mod, "System.Linq.Expressions", "Expression", systemCoreRef);
        exprSig = exprTr.ToTypeSig();
        var miTr = new TypeRefUser(mod, "System.Reflection", "MethodInfo", corlibRef);
        miSig = miTr.ToTypeSig();
        var arrSig = new SZArraySig(exprSig);

        helperType = new TypeDefUser("Jint.Runtime", "ProfileShims", mod.CorLibTypes.Object.TypeDefOrRef)
        {
            Attributes = TypeAttributes.Public | TypeAttributes.Abstract | TypeAttributes.Sealed | TypeAttributes.BeforeFieldInit
        };
        mod.Types.Add(helperType);

        helper4 = MakeHelper("Call4", exprTr, arrSig, new[] { exprSig, miSig, exprSig, exprSig });
        helper5 = MakeHelper("Call5", exprTr, arrSig, new[] { exprSig, miSig, exprSig, exprSig, exprSig });

        // Join2(string, IEnumerable<string>) → 手写 StringBuilder 循环
        //   走【非泛型】System.Collections.IEnumerable/IEnumerator（mscorlib 里无需泛型实例化，
        //   避开 mono 对泛型 TypeSpec 的解析差异）。
        var strSig = mod.CorLibTypes.String;
        var ieStr = new GenericInstSig(new ClassSig(new TypeRefUser(mod, "System.Collections.Generic", "IEnumerable`1", corlibRef)), strSig);
        helperJoin = new MethodDefUser("Join2",
            MethodSig.CreateStatic(strSig, strSig, ieStr),
            MethodAttributes.Public | MethodAttributes.Static);
        var jb = new CilBody();
        helperJoin.Body = jb;
        var ieNumTr = new TypeRefUser(mod, "System.Collections", "IEnumerable", corlibRef);
        var ieNumEnumTr = new TypeRefUser(mod, "System.Collections", "IEnumerator", corlibRef);
        var sbTr = new TypeRefUser(mod, "System.Text", "StringBuilder", corlibRef);
        var sbCtor = new MemberRefUser(mod, ".ctor", MethodSig.CreateInstance(mod.CorLibTypes.Void), sbTr);
        var sbAppend = new MemberRefUser(mod, "Append", MethodSig.CreateInstance(sbTr.ToTypeSig(), strSig), sbTr);
        var sbToString = new MemberRefUser(mod, "ToString", MethodSig.CreateInstance(strSig), sbTr);
        var nonGenGetEnum = new MemberRefUser(mod, "GetEnumerator", MethodSig.CreateInstance(ieNumEnumTr.ToTypeSig()), ieNumTr);
        var moveNext = new MemberRefUser(mod, "MoveNext", MethodSig.CreateInstance(mod.CorLibTypes.Boolean), ieNumEnumTr);
        var getCurrent = new MemberRefUser(mod, "get_Current", MethodSig.CreateInstance(mod.CorLibTypes.Object), ieNumEnumTr);
        // 局部变量
        var vSb = new Local(sbTr.ToTypeSig());
        var vEnum = new Local(ieNumEnumTr.ToTypeSig());
        var vFirst = new Local(mod.CorLibTypes.Boolean);
        jb.Variables.Add(vSb); jb.Variables.Add(vEnum); jb.Variables.Add(vFirst);
        var il = jb.Instructions;
        // sb = new StringBuilder();
        il.Add(Instruction.Create(OpCodes.Newobj, sbCtor));
        il.Add(Instruction.Create(OpCodes.Stloc, vSb));
        // e = ((IEnumerable)arg1).GetEnumerator();
        il.Add(Instruction.Create(OpCodes.Ldarg_1));
        il.Add(Instruction.Create(OpCodes.Callvirt, nonGenGetEnum));
        il.Add(Instruction.Create(OpCodes.Stloc, vEnum));
        il.Add(Instruction.Create(OpCodes.Ldc_I4_1));
        il.Add(Instruction.Create(OpCodes.Stloc, vFirst));
        var lblCont = Instruction.Create(OpCodes.Nop);
        il.Add(Instruction.Create(OpCodes.Br, lblCont));
        // loop:
        var lblLoop2 = Instruction.Create(OpCodes.Nop);
        il.Add(lblLoop2);
        // if (!first) sb.Append(sep)
        il.Add(Instruction.Create(OpCodes.Ldloc, vFirst));
        var afterSep = Instruction.Create(OpCodes.Nop);
        il.Add(Instruction.Create(OpCodes.Brtrue, afterSep));
        il.Add(Instruction.Create(OpCodes.Ldloc, vSb));
        il.Add(Instruction.Create(OpCodes.Ldarg_0));
        il.Add(Instruction.Create(OpCodes.Callvirt, sbAppend));
        il.Add(Instruction.Create(OpCodes.Pop));
        il.Add(afterSep);
        // first = false
        il.Add(Instruction.Create(OpCodes.Ldc_I4_0));
        il.Add(Instruction.Create(OpCodes.Stloc, vFirst));
        // sb.Append((string)e.Current)
        il.Add(Instruction.Create(OpCodes.Ldloc, vSb));
        il.Add(Instruction.Create(OpCodes.Ldloc, vEnum));
        il.Add(Instruction.Create(OpCodes.Callvirt, getCurrent));
        il.Add(Instruction.Create(OpCodes.Castclass, new TypeRefUser(mod, "System", "String", corlibRef)));
        il.Add(Instruction.Create(OpCodes.Callvirt, sbAppend));
        il.Add(Instruction.Create(OpCodes.Pop));
        // cont: while (e.MoveNext()) goto loop
        il.Add(lblCont);
        il.Add(Instruction.Create(OpCodes.Ldloc, vEnum));
        il.Add(Instruction.Create(OpCodes.Callvirt, moveNext));
        il.Add(Instruction.Create(OpCodes.Brtrue, lblLoop2));
        // return sb.ToString()
        il.Add(Instruction.Create(OpCodes.Ldloc, vSb));
        il.Add(Instruction.Create(OpCodes.Callvirt, sbToString));
        il.Add(Instruction.Create(OpCodes.Ret));
        helperType.Methods.Add(helperJoin);

        // （Lambda 走「拆 ReadOnlyCollection 包装 + 数组重载」方案，见 FixMethod 2h）
    }

    static MethodDefUser MakeHelper(string name, TypeRef exprTr, SZArraySig arrSig, TypeSig[] paramSigs)
    {
        var sig = MethodSig.CreateStatic(exprSig, paramSigs);
        var md = new MethodDefUser(name, sig, MethodAttributes.Public | MethodAttributes.Static);
        var b = new CilBody();
        md.Body = b;
        // 栈：[inst, method, arg0..argN] → [inst, method, new[]{arg0..argN}]
        int extra = paramSigs.Length - 2;
        b.Instructions.Add(Instruction.Create(OpCodes.Ldarg_0));
        b.Instructions.Add(Instruction.Create(OpCodes.Ldarg_1));
        b.Instructions.Add(Instruction.Create(OpCodes.Ldc_I4, extra));
        b.Instructions.Add(Instruction.Create(OpCodes.Newarr, exprTr));
        for (int k = 0; k < extra; k++)
        {
            b.Instructions.Add(Instruction.Create(OpCodes.Dup));
            b.Instructions.Add(Instruction.Create(OpCodes.Ldc_I4, k));
            b.Instructions.Add(Instruction.Create(OpCodes.Ldarg, md.Parameters[k + 2]));
            b.Instructions.Add(Instruction.Create(OpCodes.Stelem_Ref));
        }
        var call3 = new MemberRefUser(mod, "Call",
            MethodSig.CreateStatic(exprSig, exprSig, miSig, arrSig), exprTr);
        b.Instructions.Add(Instruction.Create(OpCodes.Call, call3));
        b.Instructions.Add(Instruction.Create(OpCodes.Ret));
        helperType.Methods.Add(md);
        return md;
    }

    static void FixMethod(MethodDef method)
    {
        var body = method.Body;
        var ins = body.Instructions;

        for (int i = 0; i < ins.Count; i++)
        {
            var op = ins[i].Operand;
            if (!(op is IMethodDefOrRef mr) || mr.DeclaringType == null) continue;
            var dt = mr.DeclaringType.FullName;

            // --tzonly 门控：只放行【时区】相关成员（2j/2k 分支 + DateTime.ToUniversalTime），
            // 其余 profile 修正（反射 op_Equality、HasFlag、Expression.*、Monitor、Join2 …）
            // 在 PC 上运行良好，若打到 net8 Jint 上反而会破坏它，必须跳过。
            if (tzOnly)
            {
                bool isTz =
                    dt == "System.TimeZoneInfo" ||
                    (dt == "System.DateTime" && mr.Name == "ToUniversalTime");
                if (!isTz) continue;
            }
            // 2026-09-16 新增 --nodate 门控（配合 --tzonly 使用）：跳过 DateTime::ToUniversalTime 的替换，
            // 即完全不动 Jint 的 Date 路径。
            //   那处替换把 ToUniversalTime 改写成 dt - 8h（DateTime::op_Subtraction），可 Jint
            //   DateConstructor.FromDateTime / DatePrototype.ToLocalTime 随后会把结果拿去构造
            //   DateTimeOffset(utcValue, +8h) —— 值已是 Utc 却配 +8 偏移，运行时一律拒绝：
            //     - 设备：ArgumentException: dateTime.Kind equals Utc and offset does not equal zero
            //       （js.log 实证：每次 m_role_servant_summon_tos 都抛 → 抽卡 handler 中断 →
            //        不回 m_role_servant_summon_toc → 引导卡在卡池召唤；server.log 完全无痕）
            //     - PC：MissingMethodException: DateTime.op_Subtraction（签名与目标框架不符）
            //   Polyfill 已接管全部 Date 格式化，且 Jint.Engine 构造只依赖 TimeZoneInfo 那支补丁，
            //   因此 ToUniversalTime 这处不再需要。
            if (tzOnly && noDate)
            {
                if (dt == "System.DateTime" && mr.Name == "ToUniversalTime") continue;
            }

            // 2a) 反射类型 op_Equality/op_Inequality → Object.Equals(±取反)
            if ((dt == "System.Type" || dt == "System.Reflection.MethodInfo" || dt == "System.Reflection.FieldInfo"
                 || dt == "System.Reflection.PropertyInfo" || dt == "System.Reflection.MethodBase"
                 || dt == "System.Reflection.MemberInfo")
                && (mr.Name == "op_Equality" || mr.Name == "op_Inequality"))
            {
                ins[i].OpCode = OpCodes.Call;
                ins[i].Operand = CorlibMethod("System", "Object", "Equals",
                    mod.CorLibTypes.Boolean, mod.CorLibTypes.Object, mod.CorLibTypes.Object);
                fixCount++;
                if (mr.Name == "op_Inequality")
                {
                    ins.Insert(i + 1, Instruction.Create(OpCodes.Ldc_I4_0));
                    ins.Insert(i + 2, Instruction.Create(OpCodes.Ceq));
                    i += 2;
                }
                continue;
            }

            // 2b) Enum.HasFlag → (ToUInt64(v) & ToUInt64(f)) == ToUInt64(f)
            if (dt == "System.Enum" && mr.Name == "HasFlag")
            {
                var toU64 = CorlibMethod("System", "Convert", "ToUInt64",
                    mod.CorLibTypes.UInt64, mod.CorLibTypes.Object);
                var lvFlag = new Local(mod.CorLibTypes.UInt64);
                var lvV = new Local(mod.CorLibTypes.UInt64);
                body.Variables.Add(lvFlag);
                body.Variables.Add(lvV);
                var repl = new List<Instruction>
                {
                    Instruction.Create(OpCodes.Call, toU64),     // [v, f] -> [v, f(u64)]
                    Instruction.Create(OpCodes.Stloc, lvFlag),   // [v]
                    Instruction.Create(OpCodes.Call, toU64),     // [v(u64)]
                    Instruction.Create(OpCodes.Stloc, lvV),      // []
                    Instruction.Create(OpCodes.Ldloc, lvV),
                    Instruction.Create(OpCodes.Ldloc, lvFlag),
                    Instruction.Create(OpCodes.And),
                    Instruction.Create(OpCodes.Ldloc, lvFlag),
                    Instruction.Create(OpCodes.Ceq),             // [(v&f)==f]
                };
                ins[i] = repl[0];
                for (int k = 1; k < repl.Count; k++) ins.Insert(i + k, repl[k]);
                i += repl.Count - 1;
                fixCount++;
                continue;
            }

            // 2c) ExpandoObject::.ctor → Dictionary<string,object>::.ctor
            //     用 TypeSpec（泛型实例）作 MemberRef 的 DeclaringType —— CLR 元数据里
            //     MemberRef 的父可以是 TypeSpec，dnlib 会正确写入（此前用裸 TypeRef 是错的）。
            if (dt == "System.Dynamic.ExpandoObject" && mr.Name == ".ctor")
            {
                var dictOpen = new TypeRefUser(mod, "System.Collections.Generic", "Dictionary`2", corlibRef);
                var dictInst = new GenericInstSig(new ClassSig(dictOpen),
                    mod.CorLibTypes.String, mod.CorLibTypes.Object);
                var ts = new TypeSpecUser(dictInst);
                var ctor = new MemberRefUser(mod, ".ctor",
                    MethodSig.CreateInstance(mod.CorLibTypes.Void), ts);
                ins[i].OpCode = OpCodes.Newobj;
                ins[i].Operand = ctor;
                fixCount++;
                continue;
            }

            // 2d) Expression.Empty() → ldnull（原：压入 DefaultExpression 占位）
            if (dt == "System.Linq.Expressions.Expression" && mr.Name == "Empty")
            {
                ins[i].OpCode = OpCodes.Ldnull;
                ins[i].Operand = null;
                fixCount++;
                continue;
            }

            // 2e) Expression.Block(a,b) → pop（弹掉 b，留 a 作为 Lambda body；净栈效应 0）
            if (dt == "System.Linq.Expressions.Expression" && mr.Name == "Block")
            {
                ins[i].OpCode = OpCodes.Pop;
                ins[i].Operand = null;
                fixCount++;
                continue;
            }

            // 2f) Monitor.Enter(object, ref bool) → Monitor.Enter(object)（4.0 lock 模式 → 2.0 模式）
            //     设备 mscorlib 只有单参 Enter；lockTaken 只是优化，语义可省。
            //     配套：把 finally 里的 `ldloc lockTaken; brfalse END` 守卫改为无条件 Exit。
            if (dt == "System.Threading.Monitor" && mr.Name == "Enter" && mr.MethodSig != null && mr.MethodSig.Params.Count == 2)
            {
                var monoType = new TypeRefUser(mod, "System.Threading", "Monitor", corlibRef);
                var enter1 = new MemberRefUser(mod, "Enter",
                    MethodSig.CreateStatic(mod.CorLibTypes.Void, mod.CorLibTypes.Object), monoType);
                // 前一条应为 ldloca.s lockTaken → nop（不再传 ref bool）
                var prev = ins[i - 1];
                if (prev.OpCode == OpCodes.Ldloca || prev.OpCode == OpCodes.Ldloca_S) { prev.OpCode = OpCodes.Nop; prev.Operand = null; }
                ins[i].OpCode = OpCodes.Call;
                ins[i].Operand = enter1;
                // 找配对的守卫：Exit 调用前的 `ldloc X; brfalse.s` → 两条都 nop（无条件 Exit）
                for (int j = i + 1; j < ins.Count && j < i + 200; j++)
                {
                    if (ins[j].Operand is IMethodDefOrRef ex && ex.Name == "Exit"
                        && ex.DeclaringType != null && ex.DeclaringType.FullName == "System.Threading.Monitor")
                    {
                        // 序列：ldloc lockTaken; brfalse END; ldloc lockObj; call Exit
                        //       → 把前两条（ldloc lockTaken + brfalse）nop，保留后两条（无条件 Exit）
                        int b = j - 2;
                        if (b >= 1 && (ins[b].OpCode == OpCodes.Brfalse || ins[b].OpCode == OpCodes.Brfalse_S))
                        {
                            ins[b].OpCode = OpCodes.Nop; ins[b].Operand = null;
                            ins[b - 1].OpCode = OpCodes.Nop; ins[b - 1].Operand = null;
                        }
                        break;
                    }
                }
                fixCount++;
                continue;
            }

            // 2g) Expression.Call 4/5 参（设备 System.Core 只有 2/3 参重载）
            //     策略：不改调用点栈形态 —— 把调用目标换成注入的辅助方法 Call4/Call5
            //     （内部用 3 参数组形式转发）。mono 在 JIT 时解析方法引用，缺重载即炸整个方法，
            //     所以必须让 Convert/b__7_0/b__7_2 里不再出现 4 参 Call 引用。
            if (dt == "System.Linq.Expressions.Expression" && mr.Name == "Call"
                && mr.MethodSig != null && mr.MethodSig.Params.Count >= 4)
            {
                EnsureHelpers();
                var target = mr.MethodSig.Params.Count == 4 ? helper4 : (mr.MethodSig.Params.Count == 5 ? helper5 : null);
                if (target == null) throw new NotSupportedException("Call with " + mr.MethodSig.Params.Count + " params not handled");
                ins[i].Operand = target;   // call Helper(...) —— 参数个数/栈形态与原来完全一致
                fixCount++;
                continue;
            }

            // 2h) Expression.Lambda(*, IEnumerable<ParameterExpression>) → 数组重载
            //     设备 mono 方法解析对 IEnumerable 重载不可达（mono 警告实锤）；
            //     调用点形态恒为 [.., ldloc paramsArray(ParameterExpression[]), newobj ReadOnlyCollection] →
            //     把 newobj 包装 NOP 掉（数组留在栈上），Lambda 改指 ParameterExpression[] 重载。
            if (dt == "System.Linq.Expressions.Expression" && mr.Name == "Lambda"
                && mr.MethodSig != null && mr.MethodSig.Params.Count >= 2
                && mr.MethodSig.Params[mr.MethodSig.Params.Count - 1].TypeName.Contains("IEnumerable"))
            {
                var peTr2 = new TypeRefUser(mod, "System.Linq.Expressions", "ParameterExpression", systemCoreRef);
                var peArr2 = new SZArraySig(peTr2.ToTypeSig());
                var exprTr2 = new TypeRefUser(mod, "System.Linq.Expressions", "Expression", systemCoreRef);
                var exprSig2 = exprTr2.ToTypeSig();
                // 返回类型必须是 LambdaExpression（原方法如此；后续 callvirt Compile() 依赖它）
                var lamRetTr = new TypeRefUser(mod, "System.Linq.Expressions", "LambdaExpression", systemCoreRef);
                var lamRetSig = lamRetTr.ToTypeSig();
                IMethodDefOrRef newTarget;
                if (mr.MethodSig.Params.Count == 2)
                    newTarget = new MemberRefUser(mod, "Lambda",
                        MethodSig.CreateStatic(lamRetSig, exprSig2, peArr2), exprTr2);
                else
                    newTarget = new MemberRefUser(mod, "Lambda",
                        MethodSig.CreateStatic(lamRetSig, new TypeRefUser(mod, "System", "Type", corlibRef).ToTypeSig(), exprSig2, peArr2), exprTr2);
                // 前一条 newobj ReadOnlyCollection → NOP（数组已在栈上）
                var prev2 = ins[i - 1];
                if (prev2.OpCode == OpCodes.Newobj) { prev2.OpCode = OpCodes.Nop; prev2.Operand = null; }
                ins[i].OpCode = OpCodes.Call;
                ins[i].Operand = newTarget;
                fixCount++;
                continue;
            }

            // 2i) String.Join(string, IEnumerable<string>) → ProfileShims.Join2（设备只有数组重载）
            if (dt == "System.String" && mr.Name == "Join"
                && mr.MethodSig != null && mr.MethodSig.Params.Count == 2
                && mr.MethodSig.Params[1].TypeName.Contains("IEnumerable"))
            {
                EnsureHelpers();
                ins[i].Operand = helperJoin;
                fixCount++;
                continue;
            }

            // 2j) Jint DatePrototype 的时区方法在无 tzdata 设备上抛 TimeZoneNotFoundException。
            //     对策：**固定北京时间（UTC+8）**——国内游戏，日常/周常重置口径按北京时间；
            //     设备与 PC 行为完全一致（PC 同样走这些补丁）。
            //     · get_BaseUtcOffset      → TimeSpan.FromHours(8)
            //     · IsDaylightSavingTime   → false（中国无夏令时）
            //     · ConvertTime(dt, tz)    → dt + 8h（输入恒为 UTC，见 Jint ToLocalTime）
            //     · GetUtcOffset(dt)       → TimeSpan.FromHours(8)
            //
            // 2j-bis) DateTime::ToUniversalTime() → 恒等（nop，只留 this 的 dt）
            //   ★ 2026-09-15 真机教训：设备 APK 里【没有 libMonoPosixHelper.so】（Unity 链接器剥离），
            //     而 mono 的 DateTime.ToUniversalTime()/ToLocalTime() 在无 tzdata 环境会走到 native
            //     tz 实现 → P/Invoke MonoPosixHelper 失败。真机日志实证：
            //       `!! 编码失败 m_act_mission_info_toc MonoPosixHelper`
            //     既然全链路已统一为「DateTime 一律按北京时间（UTC+8 固定偏移）」，
            //     ToUniversalTime 的输入在我们的语境里已经是"UTC 语义的墙钟"，恒等即可：
            //     它后面紧跟的 ConvertTime 补丁会 +8h 补回本地墙钟，两者抵消后语义自洽。
            if (dt == "System.DateTime" && mr.Name == "ToUniversalTime")
            {
                // 栈：DateTime&（托管指针，ldarga/ldloca 上来的）→ 解引用取值 → -8h → 值留在栈上
                // 语义：local→UTC 减 8h。它后面紧跟的 ConvertTime 补丁会 +8h，两者抵消 → 净得本地墙钟，
                // 正是"北京时间固定偏移"下 ToLocalTime 应有的结果。
                var dtTr0 = new TypeRefUser(mod, "System", "DateTime", corlibRef);
                var dtSig0 = dtTr0.ToTypeSig();
                var tsTr0 = new TypeRefUser(mod, "System", "TimeSpan", corlibRef);
                var tsCtor0 = new MemberRefUser(mod, ".ctor",
                    MethodSig.CreateInstance(mod.CorLibTypes.Void, mod.CorLibTypes.Int64), tsTr0);
                var opSub = new MemberRefUser(mod, "op_Subtraction",
                    MethodSig.CreateStatic(dtSig0, dtSig0, tsTr0.ToTypeSig()), dtTr0);
                var repl = new List<Instruction>
                {
                    new Instruction(OpCodes.Ldobj, dtTr0),                       // 指针 → 值
                    new Instruction(OpCodes.Ldc_I8, 8L * 3600L * 10000000L),     // TimeSpan(8h)
                    new Instruction(OpCodes.Newobj, tsCtor0),
                    new Instruction(OpCodes.Call, opSub),                        // dt - 8h
                };
                // 原地改写（不换对象）：保留可能被其它跳转指令引用的 Instruction 实例
                ins[i].OpCode = repl[0].OpCode;
                ins[i].Operand = repl[0].Operand;
                for (int k = 1; k < repl.Count; k++) ins.Insert(i + k, repl[k]);
                i += repl.Count - 1;
                fixCount++;
                continue;
            }
            if (dt == "System.TimeZoneInfo" && mr.Name == "get_BaseUtcOffset")
            {
                // 栈 [tz] → pop; new TimeSpan(8*3600*1e7 ticks)（ctor(long) 两平台均可用）
                var tsTr = new TypeRefUser(mod, "System", "TimeSpan", corlibRef);
                var tsCtor = new MemberRefUser(mod, ".ctor",
                    MethodSig.CreateInstance(mod.CorLibTypes.Void, mod.CorLibTypes.Int64), tsTr);
                var repl = new List<Instruction>
                {
                    Instruction.Create(OpCodes.Pop),
                    Instruction.Create(OpCodes.Ldc_I8, 8L * 3600L * 10000000L),
                    Instruction.Create(OpCodes.Newobj, tsCtor),
                };
                ins[i] = repl[0];
                for (int k = 1; k < repl.Count; k++) ins.Insert(i + k, repl[k]);
                i += repl.Count - 1;
                fixCount++;
                continue;
            }
            if (dt == "System.TimeZoneInfo" && mr.Name == "IsDaylightSavingTime")
            {
                // 栈 [tz, dt] → pop dt; pop tz; ldc.i4.0（bool false）
                var repl = new List<Instruction>
                {
                    Instruction.Create(OpCodes.Pop),
                    Instruction.Create(OpCodes.Pop),
                    Instruction.Create(OpCodes.Ldc_I4_0),
                };
                ins[i] = repl[0];
                for (int k = 1; k < repl.Count; k++) ins.Insert(i + k, repl[k]);
                i += repl.Count - 1;
                fixCount++;
                continue;
            }
            if (dt == "System.TimeZoneInfo" && mr.Name == "ConvertTime")
            {
                // ConvertTime(dt, tz) / ConvertTime(dt, src, dst)：输入恒为 UTC → dt + 8h
                // 栈：[dt, tz(, tz2)]（dt 先压，tz 在上）→ 弹出 tz 们，留 dt，再 + TimeSpan(8h)
                // ★ 2026-09-15 真机教训：这里原来生成 `call DateTime::AddTicks` 是【非法 IL】——
                //   值类型实例方法的 this 必须是托管指针（ldloca/ldarga），而栈顶是 ToUniversalTime() 返回的
                //   【值】，设备 mono 直接 InvalidProgramException("IL_0034: call 0x0a00024f")，
                //   导致所有 JS 日期操作（getHours/getDate…）抛异常 → 9 次 timer error + 包体编码失败。
                //   改用【静态运算符】op_Addition(DateTime, TimeSpan)：全程按值，无 this 约束。
                int extra2 = mr.MethodSig != null ? mr.MethodSig.Params.Count - 1 : 1;
                var dtTr = new TypeRefUser(mod, "System", "DateTime", corlibRef);
                var dtSig = dtTr.ToTypeSig();
                var tsTr3 = new TypeRefUser(mod, "System", "TimeSpan", corlibRef);
                var tsCtor3 = new MemberRefUser(mod, ".ctor",
                    MethodSig.CreateInstance(mod.CorLibTypes.Void, mod.CorLibTypes.Int64), tsTr3);
                var opAdd = new MemberRefUser(mod, "op_Addition",
                    MethodSig.CreateStatic(dtSig, dtSig, tsTr3.ToTypeSig()), dtTr);
                var repl = new List<Instruction>();
                for (int k = 0; k < extra2; k++) repl.Add(Instruction.Create(OpCodes.Pop)); // 弹 tz(s)，[dt] 留在栈上
                repl.Add(Instruction.Create(OpCodes.Ldc_I8, 8L * 3600L * 10000000L));
                repl.Add(Instruction.Create(OpCodes.Newobj, tsCtor3));  // [dt, ts]
                repl.Add(Instruction.Create(OpCodes.Call, opAdd));      // [dt+8h]
                // 原地改写（不换对象）：保留可能被其它跳转指令引用的 Instruction 实例
                ins[i].OpCode = repl[0].OpCode;
                ins[i].Operand = repl[0].Operand;
                for (int k = 1; k < repl.Count; k++) ins.Insert(i + k, repl[k]);
                i += repl.Count - 1;
                fixCount++;
                continue;
            }
            if (dt == "System.TimeZoneInfo" && mr.Name == "GetUtcOffset")
            {
                // 栈 [tz, dt(, dt2)] → 全 pop; TimeSpan.FromHours(8)
                int nArgs = mr.MethodSig != null ? mr.MethodSig.Params.Count : 1;
                var tsTr2 = new TypeRefUser(mod, "System", "TimeSpan", corlibRef);
                var tsCtor2 = new MemberRefUser(mod, ".ctor",
                    MethodSig.CreateInstance(mod.CorLibTypes.Void, mod.CorLibTypes.Int64), tsTr2);
                var repl = new List<Instruction>();
                for (int k = 0; k < nArgs + 1; k++) repl.Add(Instruction.Create(OpCodes.Pop));
                repl.Add(Instruction.Create(OpCodes.Ldc_I8, 8L * 3600L * 10000000L));
                repl.Add(Instruction.Create(OpCodes.Newobj, tsCtor2));
                ins[i] = repl[0];
                for (int k = 1; k < repl.Count; k++) ins.Insert(i + k, repl[k]);
                i += repl.Count - 1;
                fixCount++;
                continue;
            }

            // 2k) TimeZoneInfo.get_Local() → TimeZoneInfo.get_Utc()
            //     设备（模拟器）无 tzdata，get_Local 抛 TimeZoneNotFoundException，
            //     Jint.Options..ctor 无条件调用它 → Engine 构造失败。UTC 恒可用且语义等价
            //     （单机服务端不需要真实本地时区；游戏内时间走服务器时间戳）。
            if (dt == "System.TimeZoneInfo" && mr.Name == "get_Local")
            {
                ins[i].OpCode = OpCodes.Call;
                var tzType = new TypeRefUser(mod, "System", "TimeZoneInfo", systemCoreRef);
                ins[i].Operand = new MemberRefUser(mod, "get_Utc",
                    MethodSig.CreateStatic(tzType.ToTypeSig()), tzType);
                fixCount++;
                continue;
            }
        }
    }
}
