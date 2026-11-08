// NodeSeeder：把 APK 里的 `assets/psbin/**` 与 `assets/psnode/**` 播到**内部存储**。
//
// 单独成类（而不是塞在 BootPipeline 里的私有方法）的唯一目的：**能在 PC 上验**。
// 1.5 GB 的包 + 缺签名口令的组合意味着"每次验证都要等一次完整出包"，代价太高；
// 抽出静态方法后，TestHost 可以拿一个只含这两个前缀的小 zip 直接跑播种逻辑，
// 把"漏文件 / 路径拼错 / 版本判定错"这类问题提前暴露。
//
// 三个必须守住的点（都有实测依据）：
//   1. 目标目录必须是 `/data/user/0/<pkg>/files`（内部存储）。`/sdcard` 是 FUSE **noexec**，
//      psnode 放那儿 exec 不了（B0 闸门已实测：同一文件在 sdcard 上 `error=13 Permission denied`）。
//   2. 落盘后要 chmod 755：net40 没有 File.SetUnixFileMode，用 /system/bin/chmod。
//      zip 里的 entry 权限位 Android 不认，不 chmod 就是 `-rw-r--r--`，exec 直接 EACCES。
//   3. 版本判定用 NODE_TREE.json 的内容指纹：它随 node 树变化，而 SeedVersion 只覆盖 psroot。
//      两者混用会导致"改了 node 树但设备不重播"，症状是改了代码行为没变（最难查的一类）。
using System;
using System.Diagnostics;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace PsLocalServer
{
    public static class NodeSeeder
    {
        public const string BinPrefix = "assets/psbin/";
        public const string TreePrefix = "assets/psnode/";
        public const string MetaEntry = "assets/psnode/NODE_TREE.json";

        /// <summary>树的版本指纹（NODE_TREE.json 的 md5 前 6 字节）；缺失时返回 null。</summary>
        public static string Version(Shims.PsZipReader zip)
        {
            try
            {
                using (var ms = new MemoryStream())
                {
                    zip.ReadTo(MetaEntry, ms);
                    using (var md5 = MD5.Create())
                    {
                        var h = md5.ComputeHash(ms.ToArray());
                        var sb = new StringBuilder("node-");
                        for (int i = 0; i < 6; i++) sb.Append(h[i].ToString("x2"));
                        return sb.ToString();
                    }
                }
            }
            catch { return null; }
        }

        /// <summary>播种到 dataDir；返回写出的字节数。report 收到 0..1。</summary>
        /// <param name="preserveUserData">
        /// 升级重播种（设备上已有 node 树）时为 true：玩家数据**一律不覆盖**。
        /// 为什么必须保护（2026-11-04 真机实证）：
        ///   node 树的 saves/ 与 accounts.json 跟着树走（__dirname 相对），重播种会整棵重写；
        ///   而包内 accounts.json 只带 player 一个账号（ship_accounts_json 出厂精简）⇒
        ///   不保护就会删掉玩家自建账号条目、清空 lastAccount；客户端 extcfg 里的 PsAccount
        ///   还记着上次登录名，于是登录框又把 player 预填回来（"装带档新包仍预填 player"的真根因）。
        ///   语义对齐 Jint 线 BootPipeline.SeedFromApkIfDevice 的 upgrading 分支（那边早就保护了）。
        /// </param>
        public static long Seed(string apkPath, string dataDir, Action<double> report, Action<string> diag,
                                bool preserveUserData = false)
        {
            using (var zip = new Shims.PsZipReader(apkPath))
            {
                var binNames = zip.NamesByPrefix(BinPrefix);
                var treeNames = zip.NamesByPrefix(TreePrefix);
                if (binNames.Count == 0 && treeNames.Count == 0)
                    throw new Exception("APK 里没有 assets/psbin 或 assets/psnode —— 这不是 B 线包");

                long total = 0, done = 0;
                foreach (var n in binNames) total += zip.EntrySize(n);
                foreach (var n in treeNames) total += zip.EntrySize(n);
                if (diag != null) diag("seed-node: " + binNames.Count + " bin + " + treeNames.Count
                                       + " tree entries, " + total + " bytes"
                                       + (preserveUserData ? "（升级：保护玩家数据）" : ""));

                foreach (var n in binNames) done = Extract(zip, n, BinPrefix, "psbin", dataDir, done, total, report, false);
                foreach (var n in treeNames) done = Extract(zip, n, TreePrefix, "psnode_root", dataDir, done, total, report, preserveUserData);

                // 可执行位：三个都 chmod（.so 不需要 exec，但统一处理省得以后漏）
                foreach (var f in new[] { "psnode", "libnode.so", "libc++_shared.so" })
                    Chmod755(Path.Combine(Path.Combine(dataDir, "psbin"), f), diag);
                return done;
            }
        }

        static long Extract(Shims.PsZipReader zip, string entry, string prefix, string dstSub,
                            string dataDir, long done, long total, Action<double> report,
                            bool preserveUserData)
        {
            var rel = entry.Substring(prefix.Length);
            var size = zip.EntrySize(entry);

            // 玩家数据白名单（仅 psnode 树、仅升级时）：saves/ 全部 + accounts.json 不覆盖。
            // rel 形如 "ps_server/saves/player.json"、"ps_server/accounts.json"。
            if (preserveUserData && dstSub == "psnode_root")
            {
                var relSlash = rel.Replace('\\', '/');
                bool isUserData = relSlash == "ps_server/accounts.json"
                                  || relSlash.StartsWith("ps_server/saves/", StringComparison.Ordinal);
                if (isUserData)
                {
                    // 记账但**不写盘**：保持进度条推进，也让"跳过了多少字节"可诊断
                    if (size > 0) done += size;
                    if (report != null && total > 0) report((double)done / total);
                    return done;
                }
            }

            var target = Path.Combine(Path.Combine(dataDir, dstSub),
                                      rel.Replace('/', Path.DirectorySeparatorChar));
            if (size <= 0)
            {
                if (!Directory.Exists(target)) Directory.CreateDirectory(target);
                return done;
            }
            Directory.CreateDirectory(Path.GetDirectoryName(target));
            using (var fs = new FileStream(target, FileMode.Create, FileAccess.Write))
            {
                zip.ReadTo(entry, fs);
                done += size;
                if (report != null && total > 0) report((double)done / total);
            }
            return done;
        }

        /// <summary>net40 无 File.SetUnixFileMode；Android 上 chmod 是系统二进制，任何 app 都能 exec。</summary>
        public static bool Chmod755(string path, Action<string> diag)
        {
            try
            {
                if (!File.Exists(path)) { if (diag != null) diag("chmod: missing " + path); return false; }
                if (Environment.OSVersion.Platform != PlatformID.Unix &&
                    Directory.Exists("/system/bin") == false)
                    return true;                      // PC（Windows）：无 chmod，视作成功
                var psi = new ProcessStartInfo("/system/bin/chmod", "755 '" + path.Replace("'", "'\\''") + "'");
                psi.UseShellExecute = false;
                psi.CreateNoWindow = true;
                var p = Process.Start(psi);
                p.WaitForExit(3000);
                return p.ExitCode == 0;
            }
            catch (Exception e)
            {
                if (diag != null) diag("chmod fail " + path + ": " + e.Message);
                return false;
            }
        }
    }
}
