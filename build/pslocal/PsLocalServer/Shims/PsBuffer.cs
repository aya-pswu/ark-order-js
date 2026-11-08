// Buffer 垫片：Node Buffer 的 CLR 实现。
// 命名铁律：暴露给 JS 的方法名与 Node 完全一致（JS 大小写敏感，Jint 按名绑定）。
// 所有 JS 侧访问都走「方法调用」；不暴露索引器 —— game_server 的逐字节 XOR 循环
// 由 PsXor.Decrypt 下沉到 C#（解释器跑不起逐字节循环，索引器写入也不保证支持）。
using System;
using System.Globalization;
using System.Text;
using Jint;
using Jint.Native;

namespace PsLocalServer.Shims
{
    public class PsBuffer
    {
        public readonly byte[] Data;
        public int Length { get; private set; }

        // JS 侧统一读小写 .length（Jint 按名绑定，大小写敏感）
        public int length { get { return Length; } }

        public PsBuffer(int size) { Data = new byte[Math.Max(size, 0)]; Length = Data.Length; }
        public PsBuffer(byte[] bytes, int len = -1)
        {
            Data = bytes ?? new byte[0];
            Length = len >= 0 ? Math.Min(len, bytes.Length) : bytes.Length;
        }

        // ================= 工厂（global.Buffer） =================
        // 【Jint 2.11 铁律】CLR 方法必须按【精确参数个数】匹配：可选参数不会被填充，
        // 少传/多传都抛 "No public methods with the specified arguments"。凡 Node 侧
        // 可能用不同参数个数调用的方法，一律写显式重载（不能用 = null 默认值）。
        public sealed class Factory
        {
            public PsBuffer alloc(object size) { return alloc(size, null); }
            public PsBuffer alloc(object size, object fill)
            {
                int n = (int)Num(size);
                var b = new PsBuffer(n);
                if (fill != null)
                {
                    if (fill is PsBuffer) { var fb = ((PsBuffer)fill).Data; for (int i = 0; i < n; i++) b.Data[i] = fb[fb.Length == 0 ? 0 : i % fb.Length]; }
                    else if (fill is string) { var fb = Encoding.UTF8.GetBytes((string)fill); for (int i = 0; i < n; i++) b.Data[i] = fb[fb.Length == 0 ? 0 : i % fb.Length]; }
                    else { var v = (byte)((long)Num(fill) & 0xff); for (int i = 0; i < n; i++) b.Data[i] = v; }
                }
                return b;
            }

            public PsBuffer from(object value) { return from(value, null); }
            public PsBuffer from(object value, object enc)
            {
                if (value is JsValue jv)
                {
                    if (jv.IsString()) return new PsBuffer(PsBuffer.EncodeString(jv.AsString(), enc as string ?? "utf8"));
                    if (jv.IsArray()) return new PsBuffer(JsArrayToBytes(jv));
                    if (jv.IsObject()) { var unwrapped = jv.ToObject(); if (unwrapped is PsBuffer pb2) return FromPsBuffer(pb2); }
                }
                if (value is PsBuffer) return FromPsBuffer((PsBuffer)value);
                if (value is string s) return new PsBuffer(EncodeString(s, enc as string ?? "utf8"));
                if (value is byte[] raw) return new PsBuffer((byte[])raw.Clone());
                if (value is object[] arr)
                {
                    var nb = new byte[arr.Length];
                    for (int i = 0; i < arr.Length; i++) nb[i] = (byte)((long)Num(arr[i]) & 0xff);
                    return new PsBuffer(nb);
                }
                if (value is System.Collections.IEnumerable en)
                {
                    var list = new System.Collections.Generic.List<byte>();
                    foreach (var item in en) list.Add((byte)((long)Num(item) & 0xff));
                    return new PsBuffer(list.ToArray());
                }
                throw new ArgumentException("Buffer.from: unsupported source " + (value == null ? "null" : value.GetType().Name));
            }

            public PsBuffer concat(object listObj) { return concat(listObj, null); }
            public PsBuffer concat(object listObj, object totalLen)
            {
                var list = AsBufferList(listObj);
                int total = totalLen == null ? 0 : (int)Num(totalLen);
                if (total <= 0) { total = 0; foreach (var b in list) total += b.Length; }
                var buf = new PsBuffer(total);
                int off = 0;
                foreach (var b in list)
                {
                    int n = Math.Min(b.Length, total - off);
                    if (n <= 0) continue; // 空元素跳过（Node 语义；break 会丢掉后续非空缓冲）
                    Array.Copy(b.Data, 0, buf.Data, off, n);
                    off += n;
                }
                return buf;
            }

            public bool isBuffer(object v) { return v is PsBuffer; }
        }

        internal static PsBuffer FromPsBuffer(PsBuffer src)
        {
            var nb = new byte[src.Length];
            Array.Copy(src.Data, nb, src.Length);
            return new PsBuffer(nb);
        }

        internal static byte[] JsArrayToBytes(JsValue jv)
        {
            var arr = jv.AsObject();
            uint len = ArrLen(arr);
            var nb = new byte[len];
            for (uint i = 0; i < len; i++) nb[i] = (byte)((long)Num(arr.Get(ArrKey(i))) & 0xff);
            return nb;
        }

        internal static System.Collections.Generic.List<PsBuffer> AsBufferList(object o)
        {
            var list = new System.Collections.Generic.List<PsBuffer>();
            if (o is JsValue jv)
            {
                if (jv.IsArray())
                {
                    var arr = jv.AsObject();
                    uint len = ArrLen(arr);
                    for (uint i = 0; i < len; i++)
                    {
                        var el = arr.Get(ArrKey(i));
                        if (el.IsNull() || el.IsUndefined()) continue;
                        var unwrapped = el.ToObject();
                        if (unwrapped is PsBuffer pb) { list.Add(pb); continue; }
                        list.Add(FromPsBuffer(new PsBuffer(Encoding.UTF8.GetBytes(el.ToString()))));
                    }
                    return list;
                }
                if (jv.IsObject()) return AsBufferList(jv.ToObject());
            }
            if (o is System.Collections.IEnumerable en)
            {
                foreach (var el in en)
                {
                    if (el is PsBuffer pb) list.Add(pb);
                    else if (el is JsValue j2)
                    {
                        var unwrapped2 = j2.ToObject();
                        if (unwrapped2 is PsBuffer pb2) list.Add(pb2);
                    }
                    else if (el != null) list.Add(new PsBuffer((byte[])FromPsBuffer(new PsBuffer(Encoding.UTF8.GetBytes(el.ToString()))).Data));
                }
            }
            return list;
        }

        // ================= 编码/解码 =================
        public static byte[] EncodeString(string s, string enc)
        {
            enc = (enc ?? "utf8").ToLowerInvariant();
            switch (enc)
            {
                case "utf8": case "utf-8": return Encoding.UTF8.GetBytes(s);
                case "latin1": case "binary": case "ascii":
                    var ab = new byte[s.Length];
                    for (int i = 0; i < s.Length; i++) ab[i] = (byte)(((int)s[i]) & 0xff);
                    return ab;
                case "hex":
                    var hb = new byte[s.Length / 2];
                    for (int i = 0; i < hb.Length; i++)
                        hb[i] = byte.Parse(s.Substring(i * 2, 2), NumberStyles.HexNumber, CultureInfo.InvariantCulture);
                    return hb;
                case "base64": return Convert.FromBase64String(s);
                default: throw new NotSupportedException("encoding " + enc);
            }
        }

        public static string DecodeString(byte[] data, int offset, int len, string enc)
        {
            enc = (enc ?? "utf8").ToLowerInvariant();
            if (offset < 0) offset = 0;
            if (offset > data.Length) offset = data.Length;
            if (len < 0 || offset + len > data.Length) len = data.Length - offset;
            switch (enc)
            {
                case "utf8": case "utf-8": return Encoding.UTF8.GetString(data, offset, len);
                case "latin1": case "binary": case "ascii":
                    var sb = new StringBuilder(len);
                    for (int i = 0; i < len; i++) sb.Append((char)data[offset + i]);
                    return sb.ToString();
                case "hex":
                    var hs = new StringBuilder(len * 2);
                    for (int i = 0; i < len; i++) hs.Append(data[offset + i].ToString("x2", CultureInfo.InvariantCulture));
                    return hs.ToString();
                case "base64": return Convert.ToBase64String(data, offset, len);
                default: throw new NotSupportedException("encoding " + enc);
            }
        }

        // ================= 实例方法（Node Buffer API 被用子集） =================
        // 同样按【精确参数个数】重载（Jint 2.11 不填可选参数；见 Factory 注释）。
        public string toString() { return toString(null, null, null); }
        public string toString(object enc) { return toString(enc, null, null); }
        public string toString(object enc, object start) { return toString(enc, start, null); }
        public string toString(object enc, object start, object end)
        {
            int s = start == null ? 0 : (int)Num(start);
            int e = end == null ? Length : (int)Num(end);
            if (s < 0) s = Math.Max(Length + s, 0);
            if (e > Length) e = Length;
            if (e < s) e = s;
            return DecodeString(Data, s, e - s, enc as string ?? "utf8");
        }

        public PsBuffer slice() { return slice(null, null); }
        public PsBuffer slice(object start) { return slice(start, null); }
        public PsBuffer slice(object start, object end)
        {
            int s = start == null ? 0 : (int)Num(start);
            int e = end == null ? Length : (int)Num(end);
            if (s < 0) s = Math.Max(Length + s, 0);
            if (e < 0) e = Math.Max(Length + e, 0);
            if (s > Length) s = Length;
            if (e > Length) e = Length;
            if (e < s) e = s;
            int n = e - s;
            var nb = new byte[n];
            if (n > 0) Array.Copy(Data, s, nb, 0, n);
            return new PsBuffer(nb);
        }

        public int writeUInt8(object v) { return WriteU8(v, null); }
        public int writeUInt8(object v, object off) { return WriteU8(v, off); }
        private int WriteU8(object v, object off) { var o = (int)Num(off, 0); Data[o] = (byte)((long)Num(v) & 0xff); return o + 1; }
        public int writeInt8(object v) { return WriteU8(v, null); }
        public int writeInt8(object v, object off) { return WriteU8(v, off); }
        public int writeUInt16BE(object v) { return WriteU16BE(v, null); }
        public int writeUInt16BE(object v, object off) { return WriteU16BE(v, off); }
        private int WriteU16BE(object v, object off) { var o = (int)Num(off, 0); ushort x = (ushort)((long)Num(v) & 0xffff); Data[o] = (byte)(x >> 8); Data[o + 1] = (byte)x; return o + 2; }
        public int writeUInt16LE(object v) { return WriteU16LE(v, null); }
        public int writeUInt16LE(object v, object off) { return WriteU16LE(v, off); }
        private int WriteU16LE(object v, object off) { var o = (int)Num(off, 0); ushort x = (ushort)((long)Num(v) & 0xffff); Data[o] = (byte)x; Data[o + 1] = (byte)(x >> 8); return o + 2; }
        public int writeUInt32BE(object v) { return WriteU32BE(v, null); }
        public int writeUInt32BE(object v, object off) { return WriteU32BE(v, off); }
        private int WriteU32BE(object v, object off) { var o = (int)Num(off, 0); uint x = (uint)((long)Num(v) & 0xffffffffL); Data[o] = (byte)(x >> 24); Data[o + 1] = (byte)(x >> 16); Data[o + 2] = (byte)(x >> 8); Data[o + 3] = (byte)x; return o + 4; }
        public int writeUInt32LE(object v) { return WriteU32LE(v, null); }
        public int writeUInt32LE(object v, object off) { return WriteU32LE(v, off); }
        private int WriteU32LE(object v, object off) { var o = (int)Num(off, 0); uint x = (uint)((long)Num(v) & 0xffffffffL); Data[o] = (byte)x; Data[o + 1] = (byte)(x >> 8); Data[o + 2] = (byte)(x >> 16); Data[o + 3] = (byte)(x >> 24); return o + 4; }
        public int writeInt32BE(object v) { return WriteU32BE((uint)(int)Num(v), null); }
        public int writeInt32BE(object v, object off) { return WriteU32BE((uint)(int)Num(v), off); }
        public int writeInt32LE(object v) { return WriteU32LE((uint)(int)Num(v), null); }
        public int writeInt32LE(object v, object off) { return WriteU32LE((uint)(int)Num(v), off); }
        public int writeUIntLE(object v, object off, object len) { var o = (int)Num(off); var l = (int)Num(len); long x = (long)Num(v); for (int i = 0; i < l; i++) { Data[o + i] = (byte)(x & 0xff); x >>= 8; } return o + l; }

        public int readUInt8() { return ReadU8(null); }
        public int readUInt8(object off) { return ReadU8(off); }
        private int ReadU8(object off) { return Data[(int)Num(off, 0)]; }
        public int readInt8() { return ReadI8(null); }
        public int readInt8(object off) { return ReadI8(off); }
        private int ReadI8(object off) { return (sbyte)Data[(int)Num(off, 0)]; }
        public int readUInt16BE() { return ReadU16BE(null); }
        public int readUInt16BE(object off) { return ReadU16BE(off); }
        private int ReadU16BE(object off) { var o = (int)Num(off, 0); return (Data[o] << 8) | Data[o + 1]; }
        public int readUInt16LE() { return ReadU16LE(null); }
        public int readUInt16LE(object off) { return ReadU16LE(off); }
        private int ReadU16LE(object off) { var o = (int)Num(off, 0); return Data[o] | (Data[o + 1] << 8); }
        public uint readUInt32BE() { return ReadU32BE(null); }
        public uint readUInt32BE(object off) { return ReadU32BE(off); }
        private uint ReadU32BE(object off) { var o = (int)Num(off, 0); return ((uint)Data[o] << 24) | ((uint)Data[o + 1] << 16) | ((uint)Data[o + 2] << 8) | Data[o + 3]; }
        public uint readUInt32LE() { return ReadU32LE(null); }
        public uint readUInt32LE(object off) { return ReadU32LE(off); }
        private uint ReadU32LE(object off) { var o = (int)Num(off, 0); return Data[o] | ((uint)Data[o + 1] << 8) | ((uint)Data[o + 2] << 16) | ((uint)Data[o + 3] << 24); }
        public int readInt32BE() { return unchecked((int)ReadU32BE(null)); }
        public int readInt32BE(object off) { return unchecked((int)ReadU32BE(off)); }
        public int readInt32LE() { return unchecked((int)ReadU32LE(null)); }
        public int readInt32LE(object off) { return unchecked((int)ReadU32LE(off)); }

        public int indexOf(object needle) { return IndexOfImpl(needle, null); }
        public int indexOf(object needle, object byteOffset) { return IndexOfImpl(needle, byteOffset); }
        private int IndexOfImpl(object needle, object byteOffset)
        {
            int from = byteOffset == null ? 0 : (int)Num(byteOffset);
            byte[] pat;
            if (needle is string s) pat = Encoding.UTF8.GetBytes(s);
            else if (needle is PsBuffer pb) pat = pb.Data;
            else if (needle is byte[] ba) pat = ba;
            else pat = new[] { (byte)((long)Num(needle) & 0xff) };
            if (pat.Length == 0) return from;
            for (int i = from; i <= Length - pat.Length; i++)
            {
                bool ok = true;
                for (int j = 0; j < pat.Length; j++) { if (Data[i + j] != pat[j]) { ok = false; break; } }
                if (ok) return i;
            }
            return -1;
        }

        public int at(object i) { var idx = (int)Num(i); return idx >= 0 && idx < Length ? Data[idx] : 0; }
        public byte[] toArray() { if (Length == Data.Length) return Data; var nb = new byte[Length]; Array.Copy(Data, nb, Length); return nb; }
        public bool equals(object other) { var pb = other as PsBuffer; if (pb == null || pb.Length != Length) return false; for (int i = 0; i < Length; i++) if (Data[i] != pb.Data[i]) return false; return true; }

        public override string ToString() { return "Buffer(" + Length + ")"; }

        internal static uint ArrLen(JsValue obj) { return (uint)Num(obj.AsObject().Get("length")); }
        internal static string ArrKey(uint i) { return i.ToString(); }

        internal static double Num(object v, double dflt = 0)
        {
            if (v == null) return dflt;
            if (v is JsValue jv)
            {
                if (jv.IsNumber()) return jv.AsNumber();
                if (jv.IsUndefined() || jv.IsNull()) return dflt;
                if (jv.IsString()) return double.TryParse(jv.AsString(), NumberStyles.Any, CultureInfo.InvariantCulture, out var d2) ? d2 : dflt;
                if (jv.IsBoolean()) return jv.AsBoolean() ? 1 : 0;
                return dflt;
            }
            if (v is bool b) return b ? 1 : 0;
            try { return Convert.ToDouble(v, CultureInfo.InvariantCulture); } catch { return dflt; }
        }
    }

    // XOR 解密下沉（game_server.js decryptXor 的 C# 版本）：
    // 解释器跑不动逐字节循环，Jint 索引器写入也不保证支持 —— 一个包一次调用。
    public static class PsXor
    {
        public static int Interval(int seq)
        {
            if (seq % 10 == 0) return 3;
            if (seq % 9 == 0) return 7;
            if (seq % 8 == 0) return 6;
            if (seq % 7 == 0) return 2;
            if (seq % 6 == 0) return 5;
            if (seq % 5 == 0) return 6;
            if (seq % 4 == 0) return 3;
            if (seq % 3 == 0) return 7;
            if (seq % 2 == 0) return 4;
            return 2;
        }

        public static PsBuffer Decrypt(PsBuffer payload, int seq)
        {
            int b = Interval(seq);
            int b2 = (b ^ 0xab) & 0xff;
            var outBuf = new PsBuffer((byte[])payload.Data.Clone(), payload.Length);
            for (int i = 0; i < outBuf.Length; i++)
            {
                if (i % b == 0)
                {
                    outBuf.Data[i] = (byte)((b2 ^ outBuf.Data[i]) & 0xff);
                    b2 = (b ^ ((b2 + i) & 0xff)) & 0xff;
                }
            }
            return outBuf;
        }
    }
}
