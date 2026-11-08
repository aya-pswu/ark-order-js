// 虚拟文件系统：JS 侧一律使用『/』开头的虚拟路径（如 /ps_server/state.js），
// FsHost 负责映射到宿主真实路径。两套宿主：
//   · PcEnvironment   —— 虚拟 / 直接映射到某个磁盘目录（测试宿主）
//   · HostEnvironment —— 映射到设备持久目录（首启已从 APK assets 播种），并兼容
//                        server 代码里写死的 Windows 路径（H:\NEW FILES\files\res → <persist>/res）
using System;
using System.IO;
using System.Text;

namespace PsLocalServer.Shims
{
    /// <summary>宿主环境抽象（PC 测试 / Android 设备）。</summary>
    public abstract class HostEnvironment
    {
        /// <summary>虚拟 / 对应的真实根目录（必须已存在）。</summary>
        public abstract string RootDir { get; }
        /// <summary>资源数据包目录（files/res），供 H:\NEW FILES\files\res 兼容映射。</summary>
        public abstract string ResDir { get; }
        /// <summary>真机才有的持久目录（extcfg 所在）；PC 模式返回 null。</summary>
        public virtual string PersistDir { get { return null; } }
        /// <summary>
        /// 内部存储应用私有目录（`/data/user/0/&lt;pkg&gt;/files`）。
        /// 为什么单独一个：外部存储（/storage/emulated）是 FUSE **noexec**，psbin 放那儿 exec 不了；
        /// 而且 FUSE 上 saveState 要 150 ms（/data 只要 5 ms）。所以 node 形态的 bin + 树都落这里。
        /// PC 模式返回 RootDir（测试用同一套路径拼接）。
        /// </summary>
        public virtual string DataDir { get { return RootDir; } }

        public virtual string Map(string vpath)
        {
            vpath = FsHost.NormalizeVirtual(vpath);
            if (vpath.StartsWith("/psdata/res/", StringComparison.Ordinal))
                return Path.Combine(ResDir, vpath.Substring("/psdata/res/".Length).Replace('/', Path.DirectorySeparatorChar));
            if (vpath == "/psdata/res") return ResDir;
            var rel = vpath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            return Path.Combine(RootDir, rel);
        }

    }

    public sealed class PcEnvironment : HostEnvironment
    {
        private readonly string _root;
        private readonly string _res;
        public PcEnvironment(string root, string res = null) { _root = Path.GetFullPath(root); _res = res; }
        public override string RootDir { get { return _root; } }
        public override string ResDir { get { return _res ?? Path.Combine(Path.Combine(_root, "psdata"), "res"); } }
    }

    public sealed class DeviceEnvironment : HostEnvironment
    {
        private readonly string _root;     // <persist>/psroot
        private readonly string _res;      // <persist>/res
        private readonly string _persist;  // <persist>
        private readonly string _data;     // /data/user/0/<pkg>/files
        public DeviceEnvironment(string persist) : this(persist, null) { }
        public DeviceEnvironment(string persist, string dataDir)
        {
            _persist = persist;
            _root = Path.Combine(persist, "psroot");
            _res = Path.Combine(persist, "res");
            _data = string.IsNullOrEmpty(dataDir)
                ? Path.Combine(Path.Combine("/data/user/0", Bootstrap.PackageName), "files")
                : dataDir;
        }
        public override string RootDir { get { return _root; } }
        public override string ResDir { get { return _res; } }
        public override string PersistDir { get { return _persist; } }
        public override string DataDir { get { return _data; } }
    }

    /// <summary>fs 垫片的实现宿主（全部同步 API；流式读仅 /res 静态用）。</summary>
    public class FsHost
    {
      /// <summary>server 代码里出现的任意路径（含 Windows 绝对路径）→ 虚拟路径。静态：path 垫片也要用。</summary>
      public static string ToVirtual(string p)
      {
          if (string.IsNullOrEmpty(p)) return "/";
          var norm = p.Replace('\\', '/');
          // 写死的资源目录（http_router.js）：H:\NEW FILES\files\res → /psdata/res
          var idx = norm.IndexOf("NEW FILES/files/res", StringComparison.OrdinalIgnoreCase);
          if (idx >= 0)
          {
              var fIdx = norm.IndexOf("files/res", idx, StringComparison.OrdinalIgnoreCase);
              return "/psdata/res" + norm.Substring(fIdx + "files/res".Length);
          }
          if (norm.StartsWith("/")) return FsHost.NormalizeVirtual(norm);
          if (System.Text.RegularExpressions.Regex.IsMatch(norm, "^[a-zA-Z]:"))
          {
              // 其他 Windows 绝对路径：按根相对处理（server 代码未用，兜底）
              return FsHost.NormalizeVirtual("/" + norm.Substring(2));
          }
          // 相对路径一律相对虚拟根
          return FsHost.NormalizeVirtual("/" + norm);
      }

      public static string NormalizeVirtual(string p)
      {
          var parts = p.Replace('\\', '/').Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
          var stack = new System.Collections.Generic.Stack<string>();
          foreach (var seg in parts)
          {
              if (seg == ".") continue;
              if (seg == "..") { if (stack.Count > 0) stack.Pop(); continue; }
              stack.Push(seg);
          }
          var arr = stack.ToArray();
          Array.Reverse(arr);
          return "/" + string.Join("/", arr);
      }

        private readonly HostEnvironment _env;
        public FsHost(HostEnvironment env) { _env = env; }
        public HostEnvironment Env { get { return _env; } }

        public bool Exists(string vpath)
        {
            var p = _env.Map(vpath);
            return File.Exists(p) || Directory.Exists(p);
        }
        public bool IsFile(string vpath) { return File.Exists(_env.Map(vpath)); }
        public bool IsDir(string vpath) { return Directory.Exists(_env.Map(vpath)); }

        public byte[] ReadAllBytes(string vpath) { return File.ReadAllBytes(_env.Map(vpath)); }
        public string ReadAllText(string vpath) { return File.ReadAllText(_env.Map(vpath), Encoding.UTF8); }

        public void WriteAllBytes(string vpath, byte[] data)
        {
            EnsureDir(vpath);
            File.WriteAllBytes(_env.Map(vpath), data);
        }
        public void WriteAllText(string vpath, string text) { EnsureDir(vpath); File.WriteAllText(_env.Map(vpath), text, Encoding.UTF8); }
        public void AppendText(string vpath, string text) { EnsureDir(vpath); File.AppendAllText(_env.Map(vpath), text, Encoding.UTF8); }

        public void Mkdir(string vpath) { Directory.CreateDirectory(_env.Map(vpath)); }
        public void MkdirRecursive(string vpath) { Directory.CreateDirectory(_env.Map(vpath)); }

        public void Rename(string from, string to) { EnsureDir(to); File.Move(_env.Map(from), _env.Map(to)); }
        public void Copy(string from, string to) { EnsureDir(to); File.Copy(_env.Map(from), _env.Map(to), true); }
        public void Unlink(string vpath) { File.Delete(_env.Map(vpath)); }

        public long Size(string vpath) { return new FileInfo(_env.Map(vpath)).Length; }
        public double MTime(string vpath) { return (new FileInfo(_env.Map(vpath)).LastWriteTimeUtc - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds; }

        /// <summary>readdirSync：返回纯文件名数组（不含目录）。</summary>
        public string[] ReadDir(string vpath)
        {
            var p = _env.Map(vpath);
            if (!Directory.Exists(p)) throw new DirectoryNotFoundException(vpath);
            return Directory.GetFileSystemEntries(p);
        }

        /// <summary>readdirSync + withFileTypes 风格：名字 + isDirectory 标志。</summary>
        public FsEntry[] ReadDirEntries(string vpath)
        {
            var p = _env.Map(vpath);
            if (!Directory.Exists(p)) throw new DirectoryNotFoundException(vpath);
            var list = new System.Collections.Generic.List<FsEntry>();
            foreach (var full in Directory.GetFileSystemEntries(p))
            {
                var name = Path.GetFileName(full);
                bool isDir = Directory.Exists(full);
                long size = 0;
                try { if (!isDir) size = new FileInfo(full).Length; } catch { }
                list.Add(new FsEntry { Name = name, IsDir = isDir, Size = size });
            }
            return list.ToArray();
        }

        private void EnsureDir(string vpath)
        {
            var p = _env.Map(vpath);
            var dir = Path.GetDirectoryName(p);
            if (!string.IsNullOrEmpty(dir)) Directory.CreateDirectory(dir);
        }
    }

    public class FsEntry
    {
        public string Name;
        public bool IsDir;
        public long Size;
    }
}
