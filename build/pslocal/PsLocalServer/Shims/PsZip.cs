// 极简 ZIP 读取器（STORE 专用）：游戏托管层没有任何压缩组件（无 System.IO.Compression、
// mscorlib 也不含 DeflateStream），设备上的 zip 读取只能自己实现。
// 覆盖两个场景：读主 APK 自身的 assets/psroot/**（构建时以 STORE 写入）、读数据包 APK 的 assets/res/**（STORE）。
// 不支持：DEFLATE（遇到即跳过该条目）、ZIP64（总偏移 <4GB 不需要）、加密、data descriptor。
//
// 2026-09-14 真机修复：Unity 2017.4 mono 是 32 位进程（APK 仅 armeabi-v7a/x86），
// 其 FileStream.Seek/Position 对 >2GB 偏移抛 IOException("Win32 IO returned 25"/ERROR_SEEK)——
// 数据包 APK 3.37GB，连 EOCD（文件尾）都读不到，首启卡在"检查数据包"。
// 对策：设备上改用 libc pread64 做随机读（无 seek 状态、64 位偏移）；PC（无 libc）回退 FileStream。
using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;

namespace PsLocalServer.Shims
{
    public class PsZipReader : IDisposable
    {
        // ---------------- 随机读 I/O 抽象 ----------------
        private interface IRandomIo : IDisposable
        {
            long Length { get; }
            void ReadAt(long offset, byte[] buf, int count);
        }

        /// <summary>libc pread64（设备）：64 位偏移，绕开 32 位 mono FileStream 的 >2GB seek 限制。</summary>
        private sealed class LibcIo : IRandomIo
        {
            private int _fd = -1;
            public LibcIo(string path)
            {
                _fd = Native.open(path, 0 /* O_RDONLY */);
                if (_fd < 0) throw new IOException("open failed (errno=" + Marshal.GetLastWin32Error() + "): " + path);
                long len = GetLength(path);
                if (len < 0) { Native.close(_fd); _fd = -1; throw new IOException("cannot determine file length: " + path); }
                Length = len;
            }

            /// <summary>
            /// 2026-10-14：极少数设备（十中无一的个例）open() 成功但 lseek64(fd,0,SEEK_END) 返回 -1
            /// （首启"从数据包 APK 导入资源"阶段 Fatal，进度条跳 100% 报错、服务端永不就绪、
            /// 游戏卡"检查更新"；errno 当时未采集、原因未知）。审慎对策：**正常路径行为不变**
            /// ——仍先走 lseek64；仅当它失败时，才落回 pread64 二分探测取长（pread64 已在
            /// ARM32 真机大量验证可用，只依赖 32 位 ssize_t 返回值，不依赖 64 位返回值封送），
            /// 并把 errno 写进 zip 日志，下次复现可直接定位。
            /// </summary>
            private long GetLength(string path)
            {
                // 1) lseek64（历史路径；失败时带 errno 进日志）
                try
                {
                    long len = Native.lseek64(_fd, 0, 2 /* SEEK_END */);
                    if (len >= 0) return len;
                    PsLog.Sink("zip: lseek64(END) failed (errno=" + Marshal.GetLastWin32Error() + "), probing via pread64: " + path);
                }
                catch (EntryPointNotFoundException)
                {
                    PsLog.Sink("zip: lseek64 missing, probing via pread64: " + path);
                }
                // 2) pread64 二分探测 EOF 边界：pread 越过文件尾返回 0，未越过返回 1。
                //    上限 64GB，~36 次探测，只依赖已验证可用的 pread64。
                if (!ProbeLength(out long size)) return -1;
                PsLog.Sink("zip: length via pread64 probe = " + size + "B: " + path);
                return size;
            }

            /// <summary>二分探测：最大 lo 使 pread(lo,1)>=1；文件长度即 lo+1（0 字节文件返回 0）。</summary>
            private bool ProbeLength(out long size)
            {
                size = 0;
                var one = new byte[1];
                if (Native.pread64(_fd, one, 1, 0) <= 0) return true; // 空文件
                long lo = 0, hi = 1L << 36; // 64GB 上界
                while (lo + 1 < hi)
                {
                    long mid = lo + ((hi - lo) >> 1);
                    if (Native.pread64(_fd, one, 1, mid) > 0) lo = mid; else hi = mid;
                }
                size = lo + 1;
                return true;
            }
            public long Length { get; private set; }
            public void ReadAt(long offset, byte[] buf, int count)
            {
                int got = 0;
                while (got < count)
                {
                    // 32 位 ABI：size_t/ssize_t 为 32 位，off64_t 为 64 位 —— 声明必须精确匹配
                    int n = Native.pread64(_fd, buf, (uint)(count - got), offset + got);
                    if (n <= 0) throw new EndOfStreamException("pread64 short read @" + (offset + got));
                    got += n;
                }
            }
            public void Dispose() { if (_fd >= 0) { Native.close(_fd); _fd = -1; } }
        }

        /// <summary>FileStream 回退（PC/无 libc；<2GB 文件均可用）。</summary>
        private sealed class StreamIo : IRandomIo
        {
            private readonly FileStream _fs;
            public StreamIo(string path)
            {
                _fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 256 * 1024);
                Length = _fs.Length;
            }
            public long Length { get; private set; }
            public void ReadAt(long offset, byte[] buf, int count)
            {
                _fs.Position = offset;
                int got = 0;
                while (got < count)
                {
                    int n = _fs.Read(buf, got, count - got);
                    if (n <= 0) throw new EndOfStreamException("short read @" + offset);
                    got += n;
                }
            }
            public void Dispose() { _fs.Dispose(); }
        }

        private static class Native
        {
            [DllImport("libc", EntryPoint = "open", SetLastError = true)]
            public static extern int open(string pathname, int flags);
            [DllImport("libc", EntryPoint = "close", SetLastError = true)]
            public static extern int close(int fd);
            // 32 位 ABI：size_t 32 位、ssize_t 32 位、off64_t 64 位
            [DllImport("libc", EntryPoint = "pread64", SetLastError = true)]
            public static extern int pread64(int fd, byte[] buf, uint count, long offset);
            [DllImport("libc", EntryPoint = "lseek64", SetLastError = true)]
            public static extern long lseek64(int fd, long offset, int whence);        }

        private static IRandomIo CreateIo(string path)
        {
            try
            {
                var io = new LibcIo(path);
                PsLog.Sink("zip: libc pread64 (" + io.Length + "B) " + path);
                return io;
            }
            catch (DllNotFoundException)
            {
                return new StreamIo(path); // PC：无 libc
            }
            catch (EntryPointNotFoundException)
            {
                return new StreamIo(path);
            }
        }

        private readonly IRandomIo _io;
        private readonly Dictionary<string, PsZipEntry> _entries = new Dictionary<string, PsZipEntry>(StringComparer.Ordinal);

        public class PsZipEntry
        {
            public string Name;
            public long LocalHeaderOffset;
            public uint Size;
            public uint Crc;
            public bool Stored;
        }

        public PsZipReader(string apkPath)
        {
            _io = CreateIo(apkPath);

            // 从尾部读 EOCD（APK 无注释，64KB 足够）
            long scanLen = Math.Min(_io.Length, 64 * 1024);
            var tail = new byte[scanLen];
            _io.ReadAt(_io.Length - scanLen, tail, (int)scanLen);
            int eocd = -1;
            for (int i = tail.Length - 22; i >= 0; i--)
            {
                if (tail[i] == 0x50 && tail[i + 1] == 0x4b && tail[i + 2] == 0x05 && tail[i + 3] == 0x06)
                {
                    eocd = i;
                    break;
                }
            }
            if (eocd < 0) throw new IOException("EOCD not found: " + apkPath);

            ushort count = (ushort)(tail[eocd + 10] | (tail[eocd + 11] << 8));
            long cdOff = (uint)(tail[eocd + 16] | (tail[eocd + 17] << 8) | (tail[eocd + 18] << 16) | (tail[eocd + 19] << 24));

            var hdr = new byte[46];
            long cur = cdOff;
            for (int i = 0; i < count; i++)
            {
                _io.ReadAt(cur, hdr, 46);
                if (hdr[0] != 0x50 || hdr[1] != 0x4b || hdr[2] != 0x01 || hdr[3] != 0x02)
                    throw new IOException("bad CDH at " + i);
                ushort method = (ushort)(hdr[10] | (hdr[11] << 8));
                uint crc = (uint)(hdr[16] | (hdr[17] << 8) | (hdr[18] << 16) | (hdr[19] << 24));
                uint size = (uint)(hdr[24] | (hdr[25] << 8) | (hdr[26] << 16) | (hdr[27] << 24));
                ushort nl = (ushort)(hdr[28] | (hdr[29] << 8));
                ushort el = (ushort)(hdr[30] | (hdr[31] << 8));
                ushort cl = (ushort)(hdr[32] | (hdr[33] << 8));
                long lfh = (uint)(hdr[42] | (hdr[43] << 8) | (hdr[44] << 16) | (hdr[45] << 24));
                cur += 46;

                var nameBuf = new byte[nl];
                if (nl > 0) _io.ReadAt(cur, nameBuf, nl);
                cur += nl + el + cl;

                var name = System.Text.Encoding.UTF8.GetString(nameBuf, 0, nl);
                if (!_entries.ContainsKey(name))
                    _entries[name] = new PsZipEntry { Name = name, LocalHeaderOffset = lfh, Size = size, Crc = crc, Stored = method == 0 };
            }
        }

        /// <summary>按前缀列出条目名。</summary>
        public List<string> NamesByPrefix(string prefix)
        {
            var r = new List<string>();
            foreach (var kv in _entries)
                if (kv.Key.StartsWith(prefix, StringComparison.Ordinal)) r.Add(kv.Key);
            return r;
        }

        public bool Has(string name) { return _entries.ContainsKey(name); }

        public uint EntrySize(string name) { return _entries.TryGetValue(name, out var e) ? e.Size : 0; }

        /// <summary>读条目（仅 STORE；DEFLATE 抛异常）。写目标流，返回字节数。</summary>
        public long ReadTo(string name, Stream dst)
        {
            var e = _entries[name];
            if (!e.Stored) throw new NotSupportedException("deflate entry not supported: " + name);
            var lfh = new byte[30];
            _io.ReadAt(e.LocalHeaderOffset, lfh, 30);
            if (lfh[0] != 0x50 || lfh[1] != 0x4b || lfh[2] != 0x03 || lfh[3] != 0x04)
                throw new IOException("bad LFH: " + name);
            ushort nl = (ushort)(lfh[26] | (lfh[27] << 8));
            ushort el = (ushort)(lfh[28] | (lfh[29] << 8));
            long dataOff = e.LocalHeaderOffset + 30 + nl + el;

            var buf = new byte[256 * 1024];
            long left = e.Size, total = 0;
            while (left > 0)
            {
                int want = (int)Math.Min(buf.Length, left);
                _io.ReadAt(dataOff + total, buf, want);
                dst.Write(buf, 0, want);
                total += want;
                left -= want;
            }
            return total;
        }

        public byte[] ReadAllBytes(string name)
        {
            using (var ms = new MemoryStream())
            {
                ReadTo(name, ms);
                return ms.ToArray();
            }
        }

        public void Dispose() { _io.Dispose(); }
    }
}
