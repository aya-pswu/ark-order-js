// zlib 垫片：Node zlib.deflateSync/inflateSync 产出/消费的是 zlib 格式（RFC1950，
// 2 字节头 + raw deflate + adler32）。
//
// ★ 2026-09-16 真机教训（大战斗包编码失败 → 卡在战斗背景切不到主城）：
//   本文件原先用 System.IO.Compression.DeflateStream 手工包 zlib 壳。**PC 上没问题，设备上是地雷**：
//   mono 的 DeflateStream 底层走 libMonoPosixHelper.so，而设备 APK 里该 .so 被 Unity 链接器剥掉了
//   （与当年 toLocaleDateString / TimeZoneInfo 同一条根因）。一被调用就是
//   `!! 编码失败 <toc> MonoPosixHelper` —— 包发不出去，客户端空等。
//   为什么一直没暴露：小包不压缩（ETF frame(payload, compress) 只在包体大时才 deflate），
//   而**唯一**会压很大的正是战斗回合包 m_fight_servant_fight_toc（fight_list + enter_list），
//   所以直到新手引导那场战斗才第一次踩到。
//
//   修法：改用**游戏自带的纯托管 zlib**（zlib.net.dll，命名空间 zlib —— 客户端
//   LuaRemoteSocket 解 19MB 热更帧用的就是它），零 P/Invoke，设备上必然可用。
using System;
using System.IO;

namespace PsLocalServer.Shims
{
    public static class PsZlib
    {
        /// <summary>zlib 压缩（等价 Node zlib.deflateSync：RFC1950 头 + deflate + adler32）。</summary>
        public static PsBuffer Deflate(PsBuffer input)
        {
            var ms = new MemoryStream();
            // ZOutputStream 自己写 zlib 头与尾部 adler32。Node 的默认级别是 6；
            // 设备上的纯托管 zlib 若固定用级别 9，会让 162 件皮肤商店等中型
            // 协议包在 ARM 上占住唯一的 Jint 工作线程十几秒，收益却只有几十字节。
            var zos = new zlib.ZOutputStream(ms, zlib.zlibConst.Z_DEFAULT_COMPRESSION);
            try
            {
                zos.Write(input.Data, 0, input.Length);
                zos.finish();                 // 冲刷并写 zlib 尾
            }
            finally
            {
                try { zos.Close(); } catch { }
            }
            return new PsBuffer(ms.ToArray());
        }

        /// <summary>zlib 解压；兼容裸 deflate（无 zlib 头）的历史数据。</summary>
        public static PsBuffer Inflate(PsBuffer input)
        {
            var data = input.Data;
            if (data.Length < 6) throw new IOException("zlib stream too short");
            // 按头字节判别 zlib 格式与裸 deflate（原有启发式保留）
            bool hasHeader = data[0] == 0x78 || data[0] == 0x08 || data[0] == 0x18 || data[0] == 0x58
                          || data[0] == 0x68 || data[0] == 0x48 || data[0] == 0x38 || data[0] == 0x28;
            if (hasHeader) return InflateStream(new MemoryStream(data, 0, data.Length));
            // 裸 deflate：补一个 zlib 头 + 4 字节占位 adler32 尾巴再喂 ZInputStream
            var wrapped = new byte[data.Length + 6];
            wrapped[0] = 0x78; wrapped[1] = 0x9C;
            Array.Copy(data, 0, wrapped, 2, data.Length);
            return InflateStream(new MemoryStream(wrapped));
        }

        static PsBuffer InflateStream(Stream src)
        {
            var outMs = new MemoryStream();
            var zis = new zlib.ZInputStream(src);
            try
            {
                var buf = new byte[64 * 1024];
                int n;
                while ((n = zis.read(buf, 0, buf.Length)) > 0) outMs.Write(buf, 0, n);
            }
            catch (Exception e)
            {
                // 裸 deflate 补壳场景：数据读完后尾校验必然对不上。已解出的内容照常返回。
                if (outMs.Length == 0) throw;
                PsLog.Sink("zlib inflate: 尾部校验异常（已解出 " + outMs.Length + "B，忽略）: " + e.Message);
            }
            finally
            {
                try { zis.Close(); } catch { }
                try { src.Dispose(); } catch { }
            }
            return new PsBuffer(outMs.ToArray());
        }
    }
}
