// 定位 Assembly-CSharp 里包含指定字符串的方法（找启动期钩子用）
// 用法: StringFind <dll> <substr>
using dnlib.DotNet;
using dnlib.DotNet.Emit;
using System;
using System.Linq;

class StringFind
{
    internal static void DumpAwake(string dll)
    {
        var mod = ModuleDefMD.Load(dll);
        var t = mod.GetTypes().First(x => x.FullName == "PocoManager");
        var m = t.Methods.First(x => x.Name == "Awake");
        Console.WriteLine("Awake body:");
        foreach (var i in m.Body.Instructions)
            Console.WriteLine("  " + i.OpCode + " " + (i.Operand == null ? "" : i.Operand.ToString()));
    }

    public static int Run(string[] args)
    {
        var dll = args[0];
        var needle = args[1];
        var mod = ModuleDefMD.Load(dll);
        // 遍历所有方法体，搜 IL 里的 Ldstr
        foreach (var td in mod.GetTypes())
        {
            foreach (var m in td.Methods)
            {
                if (m.Body == null) continue;
                foreach (var ins in m.Body.Instructions)
                {
                    if (ins.OpCode == OpCodes.Ldstr && ins.Operand != null &&
                        ((string)ins.Operand).IndexOf(needle, StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        Console.WriteLine($"{td.FullName} :: {m.Name} (static={m.IsStatic})");
                    }
                }
            }
        }
        return 0;
    }
}
