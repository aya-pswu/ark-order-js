// Outgoing ETF codec: traverse JS data on the owning engine thread, write bytes in CLR.
// One bridge call per message, no interpreted per-field writer/Buffer interop.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using Jint.Native;
using Jint.Runtime;

namespace PsLocalServer.Shims
{
    public sealed class PsEtf
    {
        sealed class Field { public string Name, Type, Sub; }
        sealed class Schema { public Field[] Fields; public int Alias; }
        readonly Dictionary<string, Schema> _schemas = new Dictionary<string, Schema>();
        JsValue _protos, _aliases;

        static JsValue Get(JsValue obj, string key)
        {
            return obj != null && obj.IsObject() ? obj.AsObject().Get(key) : JsValue.Undefined;
        }
        static bool Missing(JsValue v) { return v == null || v.IsUndefined() || v.IsNull(); }
        static string Str(JsValue v) { return Missing(v) ? "" : TypeConverter.ToString(v); }
        static double Num(JsValue v) { return Missing(v) ? 0 : TypeConverter.ToNumber(v); }
        static uint Length(JsValue v) { return (uint)Num(Get(v, "length")); }
        static JsValue At(JsValue v, uint i) { return Get(v, i.ToString(CultureInfo.InvariantCulture)); }

        void Bind(JsValue protos, JsValue aliases)
        {
            // Protocols are immutable for the lifetime of one JsHost. Jint CLR binding
            // may wrap the same argument again; wrapper identity is not a cache key.
            if (_schemas.Count != 0) return;
            _schemas.Clear(); _protos = protos; _aliases = aliases;
            foreach (var entry in protos.AsObject().GetOwnProperties())
            {
                var fields = Get(Get(protos, entry.Key), "fields");
                var compiled = new Field[Length(fields)];
                for (uint i = 0; i < compiled.Length; i++)
                {
                    var f = At(fields, i);
                    compiled[i] = new Field { Name = Str(At(f, 0)), Type = Str(At(f, 1)), Sub = Str(At(f, 2)) };
                }
                _schemas[entry.Key] = new Schema { Fields = compiled, Alias = (int)Num(Get(aliases, entry.Key)) };
            }
        }

        public void configure(JsValue protos, JsValue aliases)
        {
            Bind(protos, aliases);
        }

        public PsBuffer encode(JsValue name, JsValue obj)
        {
            if (_schemas.Count == 0) throw new InvalidOperationException("ETF protocol table not configured");
            using (var w = new MemoryStream(4096))
            {
                w.WriteByte(131);
                Nested(w, Str(name), obj);
                return new PsBuffer(w.ToArray());
            }
        }

        void Nested(MemoryStream w, string name, JsValue obj)
        {
            Schema s;
            if (!_schemas.TryGetValue(name, out s)) throw new ArgumentException("unknown proto " + name);
            w.WriteByte(104); w.WriteByte(unchecked((byte)(s.Fields.Length + 1)));
            w.WriteByte(98); I32(w, s.Alias);
            foreach (var f in s.Fields) Value(w, f.Type, f.Sub, Get(obj, f.Name));
        }

        static void I32(MemoryStream w, int n)
        {
            w.WriteByte((byte)((uint)n >> 24)); w.WriteByte((byte)((uint)n >> 16));
            w.WriteByte((byte)((uint)n >> 8)); w.WriteByte((byte)n);
        }
        static int Int(JsValue v)
        {
            var n = Num(v);
            if (double.IsNaN(n) || double.IsInfinity(n)) return 0;
            n = Math.Truncate(n) % 4294967296.0;
            if (n < 0) n += 4294967296.0;
            return unchecked((int)(uint)n);
        }
        static void Integer(MemoryStream w, JsValue v, bool small)
        {
            var n = Num(v);
            if (small && n >= 0 && n < 256) { w.WriteByte(97); w.WriteByte((byte)Math.Truncate(n)); }
            else { w.WriteByte(98); I32(w, Int(v)); }
        }
        static void Text(MemoryStream w, byte tag, string s)
        {
            var data = Encoding.UTF8.GetBytes(s);
            w.WriteByte(tag);
            if (tag == 109) I32(w, data.Length);
            else { w.WriteByte((byte)(data.Length >> 8)); w.WriteByte((byte)data.Length); }
            w.Write(data, 0, data.Length);
        }
        static void Long(MemoryStream w, JsValue value)
        {
            // Same decimal-string long contract as __psLong (signed 64-bit protocol values).
            long n;
            if (!long.TryParse(Str(value), NumberStyles.Integer, CultureInfo.InvariantCulture, out n)) n = 0;
            if (n >= int.MinValue && n <= int.MaxValue)
            {
                if (n >= 0 && n <= 255) { w.WriteByte(97); w.WriteByte((byte)n); }
                else { w.WriteByte(98); I32(w, (int)n); }
                return;
            }
            bool neg = n < 0;
            ulong u = neg ? unchecked((ulong)(-n)) : (ulong)n;
            var bytes = new byte[8]; int count = 0;
            do { bytes[count++] = (byte)u; u >>= 8; } while (u != 0);
            w.WriteByte(110); w.WriteByte((byte)count); w.WriteByte(neg ? (byte)1 : (byte)0);
            w.Write(bytes, 0, count);
        }

        void Value(MemoryStream w, string type, string sub, JsValue v)
        {
            switch (type)
            {
                case "int": Integer(w, v, true); return;
                case "number": Integer(w, v, false); return;
                case "String": case "string": Text(w, 107, Str(v)); return;
                case "bool": case "boolean": Text(w, 100, v != null && v.IsBoolean() && v.AsBoolean() ? "true" : "false"); return;
                case "long": Long(w, v); return;
                case "bytes": Text(w, 109, Missing(v) || !TypeConverter.ToBoolean(v) ? "" : Str(v)); return;
                case "array":
                    if (Missing(v)) { w.WriteByte(106); return; }
                    if (!v.IsArray())
                    {
                        var nested = Str(Get(v, "__nestedProto"));
                        if (nested.Length > 0) Nested(w, nested, v);
                        else if (sub.StartsWith("p_", StringComparison.Ordinal)) Nested(w, sub, v);
                        else w.WriteByte(106);
                        return;
                    }
                    uint count = Length(v);
                    if (count == 0) { w.WriteByte(106); return; }
                    w.WriteByte(108); I32(w, unchecked((int)count));
                    for (uint i = 0; i < count; i++)
                    {
                        var item = At(v, i);
                        var nested = Str(Get(item, "__nestedProto"));
                        if (nested.Length > 0) Nested(w, nested, item);
                        else if (sub.StartsWith("p_", StringComparison.Ordinal)) Nested(w, sub, item);
                        else if (sub == "int" || sub == "number") Integer(w, item, true);
                        else Value(w, sub.Length == 0 ? "int" : sub, "", item);
                    }
                    w.WriteByte(106); return;
                default:
                    if (type.StartsWith("p_", StringComparison.Ordinal)) Nested(w, type, v);
                    else Text(w, 100, "undefined");
                    return;
            }
        }
    }
}
