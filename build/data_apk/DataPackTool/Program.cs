// 手写 ZIP(STORE) 打包器：aapt 骨架(manifest) 条目 + res/** → 数据包 APK 主体。
// 为什么不用 python zipfile：Python 3.14 把 ZIP64 阈值收紧到 2^31-1（2GB），3.37GB 必触发；
// 而本包总偏移 < 4GB、单文件 < 4GB、条目数 < 65535，标准非 zip64 的 APK 完全合法
// （Android libziparchive 直接支持）。全 STORE：.ab 本身已压缩，解压=纯拷贝最快。
// 用法:
//   DataPackTool <skeletonApk> <resSourceDir> <outApk>                       （数据包形态）
//   DataPackTool --repack <mainApk> <embedListFile> <resSourceDir> <outApk> [--version N]
//     一体包形态（三百二十）：主包未签名 APK 的全部条目【raw 透传】（保留各自压缩方式，
//     不重压不膨胀），再按 embedListFile（相对 resSourceDir 的 rel 路径清单，一行一个）
//     把出货 res 增量以 STORE 追加为 assets/<rel>，最后写内嵌标记
//     assets/psboot_res_embedded（DataPackage.HasEmbeddedRes 的判据，--version 记入内容）。
//     断言：总量/最大偏移 < 4GB（越界 exit 2，绝不静默写 zip64）、条目数 < 65535、
//           追加名与主包现有条目重复即失败（防上游跳过逻辑回归）。
//     ⚠️ 2026-11-08 定论（三百二十）：出货 res 全量 27,871 条/4.90GB + 基座独有（BGM 等）
//     1.39GB 合计 ~4.98GB —— 经典 ZIP 上限 4.294GB 装不下（deflate 后 4.47GB 仍超 ~180MB）；
//     ZIP64 安装支持 Android 15+ 被用户否决（真机兼容不可赌）。**本模式目前无调用方**
//     （build_standalone_apk.py 的 embed 管线已回退），留作数据包形态演进备用——
//     再动这块前先重读工作日志三百二十的测算。
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;

class Program
{
    const uint LFH_SIG = 0x04034b50;
    const uint CDH_SIG = 0x02014b50;
    const uint EOCD_SIG = 0x06054b50;

    static uint[] _crcTable;

    static void InitCrcTable()
    {
        _crcTable = new uint[256];
        for (uint i = 0; i < 256; i++)
        {
            uint c = i;
            for (int k = 0; k < 8; k++) c = (c & 1) != 0 ? 0xEDB88320u ^ (c >> 1) : c >> 1;
            _crcTable[i] = c;
        }
    }

    static uint Crc32Update(uint prevFinal, byte[] buf, int len)
    {
        uint c = prevFinal ^ 0xFFFFFFFFu;
        for (int i = 0; i < len; i++) c = _crcTable[(c ^ buf[i]) & 0xFF] ^ (c >> 8);
        return c ^ 0xFFFFFFFFu;
    }

    static ushort DosTime(DateTime t) { return (ushort)(((t.Second / 2) & 0x1f) | ((t.Minute & 0x3f) << 5) | ((t.Hour & 0x1f) << 11)); }
    static ushort DosDate(DateTime t) { return (ushort)((t.Day & 0x1f) | (((uint)t.Month & 0x0f) << 5) | ((((uint)t.Year - 1980) & 0x7f) << 9)); }

    struct Entry { public string Name; public byte[] Data; public long Size; public uint Crc; public DateTime Mtime; }

    static void WriteEntry(BinaryWriter w, Entry e, ref long offset, BinaryWriter cw, List<long> cdStarts)
    {
        var nameBytes = System.Text.Encoding.UTF8.GetBytes(e.Name);
        var lfhOff = offset;
        w.Write(LFH_SIG);
        w.Write((ushort)20);
        w.Write((ushort)0);
        w.Write((ushort)0);                 // STORE
        w.Write(DosTime(e.Mtime));
        w.Write(DosDate(e.Mtime));
        w.Write(e.Crc);
        w.Write((uint)e.Size);
        w.Write((uint)e.Size);
        w.Write((ushort)nameBytes.Length);
        w.Write((ushort)0);
        w.Write(nameBytes);
        w.Write(e.Data);
        w.Flush();

        cdStarts.Add(offset);
        cw.Write(CDH_SIG);
        cw.Write((ushort)20);
        cw.Write((ushort)20);
        cw.Write((ushort)0);
        cw.Write((ushort)0);
        cw.Write(DosTime(e.Mtime));
        cw.Write(DosDate(e.Mtime));
        cw.Write(e.Crc);
        cw.Write((uint)e.Size);
        cw.Write((uint)e.Size);
        cw.Write((ushort)nameBytes.Length);
        cw.Write((ushort)0);
        cw.Write((ushort)0);
        cw.Write((ushort)0);
        cw.Write((ushort)0);    // internal attrs（标准 CDH=46B：漏了这 2 字节会整体错位）
        cw.Write(0u);
        cw.Write((uint)lfhOff);
        cw.Write(nameBytes);

        offset += 30 + nameBytes.Length + e.Size;
    }

    static int Main(string[] args)
    {
        if (args.Length >= 1 && args[0] == "--repack")
        {
            if (args.Length < 5)
            {
                Console.WriteLine("usage: DataPackTool --repack <mainApk> <embedListFile> <resSourceDir> <outApk> [--version N]");
                return 1;
            }
            return RepackMain(args);
        }
        if (args.Length < 3)
        {
            Console.WriteLine("usage: DataPackTool <skeletonApk> <resSourceDir> <outApk>");
            return 1;
        }
        InitCrcTable();
        var skeleton = Path.GetFullPath(args[0]);
        var resSrc = Path.GetFullPath(args[1]);
        var outApk = Path.GetFullPath(args[2]);

        using (var fs = new FileStream(outApk, FileMode.Create, FileAccess.Write, FileShare.None, 1024 * 1024))
        using (var w = new BinaryWriter(fs))
        using (var central = new MemoryStream())
        using (var cw = new BinaryWriter(central))
        {
            long offset = 0;
            var cdStarts = new List<long>();
            var epoch = new DateTime(1980, 1, 1);
            int count = 0;

            // 1) 骨架条目（AndroidManifest.xml / resources.arsc）原样转 STORE 搬运
            using (var sk = new FileStream(skeleton, FileMode.Open, FileAccess.Read, FileShare.Read))
            using (var za = new ZipArchive(sk, ZipArchiveMode.Read))
            {
                foreach (var ze in za.Entries)
                {
                    if (ze.Length == 0) continue;
                    byte[] data = new byte[ze.Length];
                    using (var es = ze.Open()) { int off = 0, n; while ((n = es.Read(data, off, data.Length - off)) > 0) off += n; }
                    WriteEntry(w, new Entry { Name = ze.FullName, Data = data, Size = data.Length, Crc = Crc32Update(0, data, data.Length), Mtime = DateTime.Now }, ref offset, cw, cdStarts);
                    count++;
                }
            }

            // 2) assets/res/**（逐文件：读→CRC→写；断点外置由调用方管理）
            var files = new List<string>();
            foreach (var f in Directory.EnumerateFiles(resSrc, "*", SearchOption.AllDirectories)) files.Add(f);
            files.Sort(StringComparer.Ordinal);
            Console.WriteLine("res files: " + files.Count);

            var readBuf = new byte[1024 * 1024];
            long done = 0;
            long lastReport = 0;
            foreach (var fp in files)
            {
                var rel = Path.GetRelativePath(resSrc, fp).Replace('\\', '/');
                var fi = new FileInfo(fp);
                var data = new byte[fi.Length];
                uint crc = 0;
                using (var rs = new FileStream(fp, FileMode.Open, FileAccess.Read, FileShare.Read, 1024 * 1024))
                {
                    int n; long filled = 0;
                    while ((n = rs.Read(readBuf, 0, readBuf.Length)) > 0) { Array.Copy(readBuf, 0, data, filled, n); filled += n; crc = Crc32Update(crc, readBuf, n); }
                }
                var mtime = fi.LastWriteTime < epoch ? epoch : fi.LastWriteTime;
                WriteEntry(w, new Entry { Name = "assets/res/" + rel, Data = data, Size = data.Length, Crc = crc, Mtime = mtime }, ref offset, cw, cdStarts);
                done += fi.Length; count++;
                if (done - lastReport >= 256L * 1024 * 1024 || done >= 3_400_000_000)
                {
                    lastReport = done;
                    w.Flush();
                    Console.WriteLine("  {0} files, {1:F2} GB", count, fs.Position / 1e9);
                }
            }

            // 3) 中央目录 + EOCD（全部偏移 < 4GB，无需 zip64）
            w.Flush(); // 关键：BinaryWriter 缓冲里有最后一个条目的尾巴，先落盘再取 cdStart
            long cdStart = fs.Position;
            central.Position = 0;
            central.CopyTo(fs);
            long cdSize = fs.Position - cdStart;

            w.Write(EOCD_SIG);
            w.Write((ushort)0);
            w.Write((ushort)0);
            w.Write((ushort)count);
            w.Write((ushort)count);
            w.Write((uint)cdSize);
            w.Write((uint)cdStart);
            w.Write((ushort)0);
            w.Flush();
        }

        Console.WriteLine("OK: " + outApk + " (" + new FileInfo(outApk).Length + " bytes)");
        return 0;
    }

    // ==================== 一体包 repack 模式（三百二十） ====================
    // 主包条目 raw 透传（保留原压缩方式）；增量 res 追加（--deflate 时 DEFLATE，否则 STORE）；
    // 总量 >4GB 时自动写 ZIP64（CDH zip64 extra + zip64 EOCD/locator）——设备要求 Android 15+
    // （libziparchive/libandroidfw 的 zip64 支持；2026-11-08 实测机 = Android 15/16）。

    struct RawEntry
    {
        public string Name;
        public ushort Flags, Method, DosTime, DosDate;
        public uint Crc, CompSize, UncompSize;
        public long LfhOff;
    }

    static void AppendCentral(BinaryWriter cw, List<long> cdStarts, string name, ushort flags, ushort method,
        ushort dosTime, ushort dosDate, uint crc, long compSize, long uncompSize, long lfhOff)
    {
        var nameBytes = System.Text.Encoding.UTF8.GetBytes(name);
        bool z64Off = lfhOff > 0xFFFFFFFEL;
        bool z64Size = uncompSize > 0xFFFFFFFEL || compSize > 0xFFFFFFFEL;
        byte[] extra = null;
        if (z64Off || z64Size)
        {
            var ms = new MemoryStream();
            using (var xw = new BinaryWriter(ms, System.Text.Encoding.UTF8, true))
            {
                if (z64Size) { xw.Write(uncompSize); xw.Write(compSize); }
                if (z64Off) xw.Write(lfhOff);
            }
            extra = ms.ToArray();
        }
        cdStarts.Add(lfhOff);
        cw.Write(CDH_SIG);
        cw.Write((ushort)20);
        cw.Write((ushort)((z64Off || z64Size) ? 45 : 20));
        cw.Write(flags);
        cw.Write(method);
        cw.Write(dosTime);
        cw.Write(dosDate);
        cw.Write(crc);
        cw.Write((uint)(z64Size ? 0xFFFFFFFFu : compSize));
        cw.Write((uint)(z64Size ? 0xFFFFFFFFu : uncompSize));
        cw.Write((ushort)nameBytes.Length);
        cw.Write((ushort)(extra == null ? 0 : extra.Length));
        cw.Write((ushort)0);
        cw.Write((ushort)0);
        cw.Write((ushort)0);
        cw.Write(0u);
        cw.Write((uint)(z64Off ? 0xFFFFFFFFu : lfhOff));
        cw.Write(nameBytes);
        if (extra != null) cw.Write(extra);
    }

    static void WriteLFH(BinaryWriter w, string name, ushort flags, ushort method, ushort dosTime, ushort dosDate,
        uint crc, long compSize, long uncompSize, long lfhOff)
    {
        bool z64 = lfhOff > 0xFFFFFFFEL;
        var nameBytes = System.Text.Encoding.UTF8.GetBytes(name);
        w.Write(LFH_SIG);
        w.Write((ushort)(z64 ? 45 : 20));
        w.Write(flags);
        w.Write(method);
        w.Write(dosTime);
        w.Write(dosDate);
        w.Write(crc);
        w.Write((uint)compSize);
        w.Write((uint)uncompSize);
        w.Write((ushort)nameBytes.Length);
        w.Write((ushort)0);
        w.Write(nameBytes);
    }

    /// <summary>解析主包中央目录（python zipfile 产物；>2GB 时可能带 zip64——一并支持读）。</summary>
    static List<RawEntry> ReadCentral(string apk)
    {
        var list = new List<RawEntry>();
        using (var fs = new FileStream(apk, FileMode.Open, FileAccess.Read, FileShare.Read, 1024 * 1024))
        {
            long len = fs.Length;
            int scanLen = (int)Math.Min(len, 128 * 1024);
            var tail = new byte[scanLen];
            fs.Seek(len - scanLen, SeekOrigin.Begin);
            int got = 0;
            while (got < scanLen) { int n = fs.Read(tail, got, scanLen - got); if (n <= 0) break; got += n; }
            int eocd = -1;
            for (int i = tail.Length - 22; i >= 0; i--)
            {
                if (tail[i] == 0x50 && tail[i + 1] == 0x4b && tail[i + 2] == 0x05 && tail[i + 3] == 0x06) { eocd = i; break; }
            }
            if (eocd < 0) throw new IOException("EOCD not found: " + apk);
            uint count = (ushort)(tail[eocd + 10] | (tail[eocd + 11] << 8));
            long cdOff = (uint)(tail[eocd + 16] | (tail[eocd + 17] << 8) | (tail[eocd + 18] << 16) | (tail[eocd + 19] << 24));
            long cdSize = (uint)(tail[eocd + 12] | (tail[eocd + 13] << 8) | (tail[eocd + 14] << 16) | (tail[eocd + 15] << 24));
            bool needZip64 = cdOff == 0xFFFFFFFFL || cdSize == 0xFFFFFFFFL || count == 0xFFFFu;
            if (needZip64)
            {
                // zip64 locator 紧贴经典 EOCD 之前（20B）
                int li = eocd - 20;
                if (li < 0 || !(tail[li] == 0x50 && tail[li + 1] == 0x4b && tail[li + 2] == 0x06 && tail[li + 3] == 0x07))
                    throw new IOException("zip64 locator not found: " + apk);
                long z64 = 0;
                for (int i = 0; i < 8; i++) z64 |= (long)tail[li + 8 + i] << (8 * i);
                var rec = new byte[56];
                if (ReadExactAt(fs, z64, rec) != 56 || !(rec[0] == 0x50 && rec[1] == 0x4b && rec[2] == 0x06 && rec[3] == 0x06))
                    throw new IOException("bad zip64 EOCD: " + apk);
                count = 0; for (int i = 0; i < 8; i++) count |= (uint)rec[32 + i] << (8 * i);
                cdSize = 0; for (int i = 0; i < 8; i++) cdSize |= (long)rec[40 + i] << (8 * i);
                cdOff = 0; for (int i = 0; i < 8; i++) cdOff |= (long)rec[48 + i] << (8 * i);
            }

            var hdr = new byte[46];
            long cur = cdOff;
            var nameBuf = new byte[512];
            for (uint i = 0; i < count; i++)
            {
                if (ReadExactAt(fs, cur, hdr) != 46) throw new IOException("CDH read short @" + cur);
                if (hdr[0] != 0x50 || hdr[1] != 0x4b || hdr[2] != 0x01 || hdr[3] != 0x02) throw new IOException("bad CDH sig @" + cur);
                var e = new RawEntry();
                e.Flags = (ushort)(hdr[8] | (hdr[9] << 8));
                e.Method = (ushort)(hdr[10] | (hdr[11] << 8));
                e.DosTime = (ushort)(hdr[12] | (hdr[13] << 8));
                e.DosDate = (ushort)(hdr[14] | (hdr[15] << 8));
                e.Crc = (uint)(hdr[16] | (hdr[17] << 8) | (hdr[18] << 16) | (hdr[19] << 24));
                e.CompSize = (uint)(hdr[20] | (hdr[21] << 8) | (hdr[22] << 16) | (hdr[23] << 24));
                e.UncompSize = (uint)(hdr[24] | (hdr[25] << 8) | (hdr[26] << 16) | (hdr[27] << 24));
                ushort nl = (ushort)(hdr[28] | (hdr[29] << 8));
                ushort el = (ushort)(hdr[30] | (hdr[31] << 8));
                ushort cl = (ushort)(hdr[32] | (hdr[33] << 8));
                e.LfhOff = (uint)(hdr[42] | (hdr[43] << 8) | (hdr[44] << 16) | (hdr[45] << 24));
                if (nl > nameBuf.Length) nameBuf = new byte[nl];
                if (ReadExactAt(fs, cur + 46, nameBuf, nl) != nl) throw new IOException("CDH name read short @" + cur);
                e.Name = System.Text.Encoding.UTF8.GetString(nameBuf, 0, nl);
                if (el > 0)
                {
                    var ex = new byte[el];
                    if (ReadExactAt(fs, cur + 46 + nl, ex) != el) throw new IOException("CDH extra read short @" + cur);
                    // zip64 extra（0x0001）：uncomp(8) comp(8) lfhOff(8) 按需排列
                    int p = 0;
                    while (p + 4 <= el)
                    {
                        ushort id = (ushort)(ex[p] | (ex[p + 1] << 8));
                        ushort sz = (ushort)(ex[p + 2] | (ex[p + 3] << 8));
                        if (id == 0x0001)
                        {
                            int q = p + 4;
                            if (e.UncompSize == 0xFFFFFFFFu && q + 8 <= el) { ulong v = 0; for (int k = 0; k < 8; k++) v |= (ulong)ex[q + k] << (8 * k); e.UncompSize = (uint)v; q += 8; }
                            if (e.CompSize == 0xFFFFFFFFu && q + 8 <= el) { ulong v = 0; for (int k = 0; k < 8; k++) v |= (ulong)ex[q + k] << (8 * k); e.CompSize = (uint)v; q += 8; }
                            if (e.LfhOff == 0xFFFFFFFFL && q + 8 <= el) { ulong v = 0; for (int k = 0; k < 8; k++) v |= (ulong)ex[q + k] << (8 * k); e.LfhOff = (long)v; q += 8; }
                        }
                        p += 4 + sz;
                    }
                }
                list.Add(e);
                cur += 46 + nl + el + cl;
            }
        }
        return list;
    }

    static int ReadExactAt(FileStream fs, long pos, byte[] buf) { return ReadExactAt(fs, pos, buf, buf.Length); }

    static int ReadExactAt(FileStream fs, long pos, byte[] buf, int len)
    {
        fs.Seek(pos, SeekOrigin.Begin);
        int off = 0;
        while (off < len) { int n = fs.Read(buf, off, len - off); if (n <= 0) break; off += n; }
        return off;
    }

    /// <summary>raw 透传一个条目：按 LFH 实际布局拷压缩字节，保留原 method/flags/crc/时间。</summary>
    static void CopyRawEntry(FileStream src, BinaryWriter w, RawEntry e, ref long offset, BinaryWriter cw, List<long> cdStarts)
    {
        if ((e.Flags & 0x8) != 0) throw new IOException("data-descriptor entry unsupported: " + e.Name);
        if (e.Method != 0 && e.Method != 8) throw new IOException("unexpected method " + e.Method + ": " + e.Name);
        var lfh = new byte[30];
        if (ReadExactAt(src, e.LfhOff, lfh) != 30) throw new IOException("LFH read short: " + e.Name);
        if (lfh[0] != 0x50 || lfh[1] != 0x4b || lfh[2] != 0x03 || lfh[3] != 0x04) throw new IOException("bad LFH sig: " + e.Name);
        ushort nl = (ushort)(lfh[26] | (lfh[27] << 8));
        ushort el = (ushort)(lfh[28] | (lfh[29] << 8));
        long dataOff = e.LfhOff + 30 + nl + el;

        var lfhOff = offset;
        WriteLFH(w, e.Name, e.Flags, e.Method, e.DosTime, e.DosDate, e.Crc, e.CompSize, e.UncompSize, lfhOff);
        src.Seek(dataOff, SeekOrigin.Begin);
        var buf = new byte[1024 * 1024];
        long left = e.CompSize;
        while (left > 0)
        {
            int want = (int)Math.Min(buf.Length, left);
            int n = src.Read(buf, 0, want);
            if (n <= 0) throw new IOException("entry data short: " + e.Name);
            w.Write(buf, 0, n);
            left -= n;
        }
        w.Flush();
        AppendCentral(cw, cdStarts, e.Name, e.Flags, e.Method, e.DosTime, e.DosDate, e.Crc, e.CompSize, e.UncompSize, lfhOff);
        offset += 30 + System.Text.Encoding.UTF8.GetBytes(e.Name).Length + e.CompSize;
    }

    static int RepackMain(string[] args)
    {
        // --repack <mainApk> <resSourceDir> <dataApk|-> <listFile> <outApk> [--version N] [--deflate]
        var mainApk = Path.GetFullPath(args[1]);
        var resSrc = Path.GetFullPath(args[2]);
        var dataApk = args[3] == "-" ? null : Path.GetFullPath(args[3]);
        var listFile = Path.GetFullPath(args[4]);
        var outApk = Path.GetFullPath(args[5]);
        string version = "0";
        bool deflate = false;
        for (int i = 6; i < args.Length; i++)
        {
            if (args[i] == "--version" && i + 1 < args.Length) { version = args[i + 1]; i++; }
            else if (args[i] == "--deflate") deflate = true;
        }
        InitCrcTable();

        // 清单：每行 "<src>\t<rel>"，src ∈ {d=磁盘, z=dataAPK}
        var items = new List<KeyValuePair<char, string>>();
        foreach (var line in File.ReadAllLines(listFile))
        {
            var t = line.Trim();
            if (t.Length < 3 || t[1] != '\t') continue;
            items.Add(new KeyValuePair<char, string>(t[0], t.Substring(2).Replace('\\', '/')));
        }
        Console.WriteLine("embed list: {0} (d={1}, z={2}, deflate={3})", items.Count,
            items.FindAll(x => x.Key == 'd').Count, items.FindAll(x => x.Key == 'z').Count, deflate);

        var baseEntries = ReadCentral(mainApk);
        Console.WriteLine("main entries: " + baseEntries.Count);
        var existing = new HashSet<string>(baseEntries.Select(x => x.Name));

        using (var zin = new FileStream(mainApk, FileMode.Open, FileAccess.Read, FileShare.Read, 1024 * 1024))
        using (var zdata = dataApk != null ? new FileStream(dataApk, FileMode.Open, FileAccess.Read, FileShare.Read, 1024 * 1024) : null)
        using (var zaData = dataApk != null ? new ZipArchive(zdata, ZipArchiveMode.Read, true) : null)
        using (var fs = new FileStream(outApk, FileMode.Create, FileAccess.Write, FileShare.None, 1024 * 1024))
        using (var w = new BinaryWriter(fs))
        using (var central = new MemoryStream())
        using (var cw = new BinaryWriter(central))
        {
            long offset = 0;
            var cdStarts = new List<long>();
            int count = 0;
            long lastReport = 0;

            // 1) 主包条目 raw 透传
            foreach (var e in baseEntries)
            {
                CopyRawEntry(zin, w, e, ref offset, cw, cdStarts);
                count++;
            }

            // 2) 增量 res：磁盘或 dataAPK → 追加 assets/<rel>（--deflate 时 DEFLATE L9，否则 STORE）
            var epoch = new DateTime(1980, 1, 1);
            var time = DosTime(DateTime.UtcNow);
            var date = DosDate(DateTime.UtcNow);
            long done = 0;
            foreach (var kv in items)
            {
                var arc = "assets/" + kv.Value;
                if (!existing.Add(arc))
                    throw new IOException("重复条目：" + arc + "（上游跳过逻辑回归，禁止双份同名——旧内容绝不能盖住新内容）");
                Stream dataStream;
                long size;
                if (kv.Key == 'd')
                {
                    var fp = Path.Combine(resSrc, kv.Value.Replace('/', Path.DirectorySeparatorChar));
                    var finfo = new FileInfo(fp);
                    size = finfo.Length;
                    dataStream = finfo.OpenRead();
                }
                else
                {
                    if (zaData == null) throw new IOException("清单要求 data 源但未给 dataApk：" + kv.Value);
                    var ze = zaData.GetEntry("assets/res/" + kv.Value);
                    if (ze == null) throw new IOException("dataAPK 缺条目：assets/res/" + kv.Value);
                    var ms = new MemoryStream();
                    using (var es = ze.Open()) es.CopyTo(ms);
                    size = ms.Length;
                    dataStream = new MemoryStream(ms.ToArray(), false);
                }

                var lfhOff = offset;
                uint crc = 0;
                if (deflate)
                {
                    // 先压到内存（单条目最大几十 MB），再落 LFH+数据（CDH 需要确切压缩大小）
                    var comp = new MemoryStream();
                    using (var ds = new System.IO.Compression.DeflateStream(comp, System.IO.Compression.CompressionLevel.Optimal, true))
                    using (dataStream)
                    {
                        var buf = new byte[1024 * 1024];
                        int n;
                        while ((n = dataStream.Read(buf, 0, buf.Length)) > 0)
                        {
                            crc = Crc32Update(crc, buf, n);
                            ds.Write(buf, 0, n);
                        }
                    }
                    var bytes = comp.ToArray();
                    WriteLFH(w, arc, 0, 8, time, date, crc, bytes.Length, size, lfhOff);
                    w.Write(bytes);
                    AppendCentral(cw, cdStarts, arc, 0, 8, time, date, crc, bytes.Length, size, lfhOff);
                    offset += 30 + System.Text.Encoding.UTF8.GetBytes(arc).Length + bytes.Length;
                }
                else
                {
                    WriteLFH(w, arc, 0, 0, time, date, 0, size, size, lfhOff);
                    var buf = new byte[1024 * 1024];
                    int n;
                    while ((n = dataStream.Read(buf, 0, buf.Length)) > 0)
                    {
                        crc = Crc32Update(crc, buf, n);
                        w.Write(buf, 0, n);
                    }
                    w.Flush();
                    // 回填 LFH 的 crc（LFH 先于数据落盘，crc 事后 seek 补写——中央目录才是权威，但别留不一致）
                    var nameLen = (ushort)System.Text.Encoding.UTF8.GetBytes(arc).Length;
                    var crcPos = lfhOff + 14;
                    w.BaseStream.Seek(crcPos, SeekOrigin.Begin);
                    w.Write(crc);
                    w.BaseStream.Seek(0, SeekOrigin.End);
                    AppendCentral(cw, cdStarts, arc, 0, 0, time, date, crc, size, size, lfhOff);
                    offset += 30 + nameLen + size;
                }
                dataStream.Dispose();
                count++;
                done += size;
                if (fs.Position - lastReport >= 512L * 1024 * 1024)
                {
                    lastReport = fs.Position;
                    w.Flush();
                    Console.WriteLine("  {0} entries, {1:F2} GB", count, fs.Position / 1e9);
                }
            }

            // 3) 内嵌标记（DataPackage.HasEmbeddedRes 判据；版本号供覆盖层过期比对）
            var marker = System.Text.Encoding.UTF8.GetBytes("embedded-res\tv=" + version + "\tbuilt=" + DateTime.UtcNow.ToString("o") + "\n");
            var mlfh = offset;
            WriteLFH(w, "assets/psboot_res_embedded", 0, 0, time, date, Crc32Update(0, marker, marker.Length), marker.Length, marker.Length, mlfh);
            w.Write(marker);
            AppendCentral(cw, cdStarts, "assets/psboot_res_embedded", 0, 0, time, date, Crc32Update(0, marker, marker.Length), marker.Length, marker.Length, mlfh);
            offset += 30 + System.Text.Encoding.UTF8.GetBytes("assets/psboot_res_embedded").Length + marker.Length;
            count++;

            // 4) 中央目录 + EOCD（>4GB 自动 zip64；>6GB 防呆拒绝）
            if (offset > 6L * 1024 * 1024 * 1024)
            {
                Console.WriteLine("FAIL: 总量 {0:F2} GB 超过 6GB 防呆线，疑似上游数据异常", offset / 1e9);
                return 2;
            }
            w.Flush();
            long cdStart = fs.Position;
            central.Position = 0;
            central.CopyTo(fs);
            long cdSize = fs.Position - cdStart;
            bool needZ64 = cdStart > 0xFFFFFFFEL || cdSize > 0xFFFFFFFEL || count > 65534;
            if (needZ64)
            {
                long z64 = fs.Position;
                w.Write(0x06064b50u);          // zip64 EOCD record
                w.Write(44L);
                w.Write((ushort)45); w.Write((ushort)45);
                w.Write(0u); w.Write(0u);
                w.Write((long)count); w.Write((long)count);
                w.Write(cdSize); w.Write(cdStart);
                w.Write(0x07064b50u);          // zip64 EOCD locator
                w.Write(0u); w.Write(z64); w.Write(1u);
                w.Write(EOCD_SIG);
                w.Write((ushort)0);
                w.Write((ushort)45);
                w.Write((ushort)(count > 65534 ? 0xFFFF : count));
                w.Write((ushort)(count > 65534 ? 0xFFFF : count));
                w.Write((uint)(cdSize > 0xFFFFFFFEL ? 0xFFFFFFFFu : cdSize));
                w.Write((uint)(cdStart > 0xFFFFFFFEL ? 0xFFFFFFFFu : cdStart));
                w.Write((ushort)0);
                Console.WriteLine("  zip64 EOCD: cdStart={0:F2} GB", cdStart / 1e9);
            }
            else
            {
                w.Write(EOCD_SIG);
                w.Write((ushort)0);
                w.Write((ushort)0);
                w.Write((ushort)count);
                w.Write((ushort)count);
                w.Write((uint)cdSize);
                w.Write((uint)cdStart);
                w.Write((ushort)0);
            }
            w.Flush();
        }

        Console.WriteLine("OK: {0} ({1:N0} bytes, {2:F2} GB)", outApk, new FileInfo(outApk).Length, new FileInfo(outApk).Length / 1e9);
        return 0;
    }
}
