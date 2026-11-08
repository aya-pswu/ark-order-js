# -*- coding: utf-8 -*-
"""
patch_manifest_perms.py —— 出货 APK 的 AndroidManifest.xml 二进制权限手术（二百九十五）。

背景：打包是"基座 + 文件替换"管线（build_standalone_apk.py 逐条搬运 fzzl_lua_signed.apk），
Manifest 从未被处理 → 单机包原样继承官方在线包全套 33 条 uses-permission，其中
短信×2 / 通话记录 / 联系人 / 相机 / 精确定位×2 / 电话状态等高危条目全部裸奔在安装列表里。
这些全是官方渠道 SDK 栈（友盟推送 taobao ACCS/Agoo、B站 bsgamesdk、百度定位 service、
flamingo 插件框架）在 2016 年代抄模板留下的声明：
  · RECEIVE_SMS/READ_SMS/READ_CALL_LOG/READ_CONTACTS/CAMERA 在全库 smali 零引用（死声明）；
  · READ_PHONE_STATE 的运行时申请点 NeedPermissionUnit 无任何调用方（死代码）；
  · 定位两条全库无一处 requestPermissions，只有百度定位/友盟的"有权限才读"检查；
  · 活跃启动链（Launcher=MainActivity extends UnityPlayerActivity → 补丁版 Bootstrap）
    不申请任何 dangerous 权限（targetSdk 26 下不申请 = 永远拿不到 = 声明纯属摆设）。
结论：单机包只需要 7 条（见 KEEP_PERMISSIONS），其余 26 条在出包时删掉。

实现：直接对二进制 AXML 做手术——删除白名单外 <uses-permission>（含 uses-permission-sdk-23
等前缀族）的整个节点区间（START_ELEMENT..匹配的 END_ELEMENT），修正顶层 chunk size。
不重写字符串池（孤儿串留在池里无害，且 resource map 按"字符串下标→资源 id"索引属性名，
压缩字符串池会错位）；行号不连续平台解析器不关心。改动是幂等的：没有可删项时原样返回。

白名单口径（为什么保留这 7 条）：
  · INTERNET：连 127.0.0.1:8081 本地服务器的 socket 在 Android 上也必须它；
  · ACCESS_NETWORK_STATE / ACCESS_WIFI_STATE：引擎与 SDK 判网逻辑读取（普通权限，装即授）；
  · VIBRATE / WAKE_LOCK：游戏反馈与引擎持锁（普通权限）；
  · READ/WRITE_EXTERNAL_STORAGE：minSdk=17，4.1~4.3 上写自目录仍需它；现代设备上
    自目录（/sdcard/Android/data/<pkg>）本就不需要，但游戏日志落在自目录，留着两条
    "存储"观感远好于"短信/通话记录"，且删了会让 4.x 老设备彻底没法写日志。可争论项。

用法：
  python patch_manifest_perms.py --apk tools/fzzl_lua_signed.apk --print   # 看现状与手术计划
  python patch_manifest_perms.py --selftest                                # 内置故障注入自检
  库调用：patch_manifest(data) -> (new_bytes, removed_list)；list_permissions(data) -> [str]
"""
import os
import struct
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# ---------------------------------------------------------------------------
# 白名单（单一真相源：闸门 audit_apk_permissions.py / verify.py A5 都从这里 import）
# ---------------------------------------------------------------------------
KEEP_PERMISSIONS = [
    # —— 单机包确实需要（普通权限，装即授、无弹窗、无隐私敏感）——
    'android.permission.INTERNET',              # 本地 loopback socket 也必须
    'android.permission.ACCESS_NETWORK_STATE',  # 引擎/SDK 判网
    'android.permission.ACCESS_WIFI_STATE',
    'android.permission.VIBRATE',
    'android.permission.WAKE_LOCK',
    # —— 存储两条：minSdk 17 的 4.1~4.3 老设备自目录写入仍需要（可争论项，见文件头）——
    'android.permission.READ_EXTERNAL_STORAGE',
    'android.permission.WRITE_EXTERNAL_STORAGE',
]

# 认得哪些元素名算"权限声明"（uses-permission-sdk-23 / -sdk-m 是同一东西的版本变体）
PERM_ELEMENT_PREFIX = 'uses-permission'

# AXML 常量（ResourceTypes.h）
RES_XML_TYPE = 0x0003
RES_STRING_POOL_TYPE = 0x0001
RES_XML_RESOURCE_MAP_TYPE = 0x0180
NODE_START_NAMESPACE = 0x0100
NODE_END_NAMESPACE = 0x0101
NODE_START_ELEMENT = 0x0102
NODE_END_ELEMENT = 0x0103
NODE_CDATA = 0x0104
TYPE_STRING = 0x03

VALID_NODE_TYPES = (NODE_START_NAMESPACE, NODE_END_NAMESPACE,
                    NODE_START_ELEMENT, NODE_END_ELEMENT, NODE_CDATA)


def _u16(b, o):
    return struct.unpack_from('<H', b, o)[0]


def _u32(b, o):
    return struct.unpack_from('<I', b, o)[0]


def _i32(b, o):
    return struct.unpack_from('<i', b, o)[0]


def _chunk_header(data, off):
    typ, hdr_size, size = struct.unpack_from('<HHI', data, off)
    return typ, hdr_size, size


# ---------------------------------------------------------------------------
# 字符串池（只读解码；手术不重写池，见文件头说明）
# ---------------------------------------------------------------------------
def _read_len_utf8(data, p):
    """UTF-8 池条目的长度变体：首字节 <0x80 即长度；否则 (首&0x7f)<<8 | 次字节。"""
    b = data[p]
    if b < 0x80:
        return b, 1
    return ((b & 0x7f) << 8) | data[p + 1], 2


def _read_len_utf16(data, p):
    """UTF-16 池条目的长度：u16；最高位为 1 时再读一个 u16 拼高 15 位。"""
    v = _u16(data, p)
    if v & 0x8000:
        return ((v & 0x7fff) << 16) | _u16(data, p + 2), 4
    return v, 2


def _decode_pool_string(data, base, utf8):
    if utf8:
        _, n1 = _read_len_utf8(data, base)          # 字符数（我们只解码，不校验）
        n_bytes, n2 = _read_len_utf8(data, base + n1)
        raw = bytes(data[base + n1 + n2: base + n1 + n2 + n_bytes])
        return raw.decode('utf-8', 'replace')
    n_chars, n1 = _read_len_utf16(data, base)
    raw = data[base + n1: base + n1 + n_chars * 2]
    return raw.decode('utf-16-le', 'replace')


def parse_string_pool(data, off):
    typ, hdr_size, size = _chunk_header(data, off)
    if typ != RES_STRING_POOL_TYPE:
        raise ValueError('0x%x 处不是字符串池（type=0x%04x）' % (off, typ))
    string_count = _u32(data, off + 8)
    flags = _u32(data, off + 16)
    strings_start = _u32(data, off + 20)
    utf8 = bool(flags & 0x100)
    offsets_off = off + 28
    strings = []
    for i in range(string_count):
        so = _u32(data, offsets_off + 4 * i)
        strings.append(_decode_pool_string(data, off + strings_start + so, utf8))
    return size, strings


# ---------------------------------------------------------------------------
# Manifest 解析（结构严格校验：一切 chunk 必须恰好消费到文件尾）
# ---------------------------------------------------------------------------
def parse_manifest(data):
    if len(data) < 8:
        raise ValueError('manifest 太短')
    typ, hdr_size, size = _chunk_header(data, 0)
    if typ != RES_XML_TYPE:
        raise ValueError('不是 AXML（type=0x%04x）' % typ)
    if hdr_size != 8:
        raise ValueError('XML chunk headerSize=%d != 8' % hdr_size)
    if size != len(data):
        raise ValueError('顶层 size=%d != 文件长度 %d' % (size, len(data)))

    strings = None
    pos = hdr_size
    while pos < size:
        ctyp, chs, csz = _chunk_header(data, pos)
        if csz <= 0 or pos + csz > size:
            raise ValueError('chunk 越界（type=0x%04x @%d size=%d）' % (ctyp, pos, csz))
        if ctyp == RES_STRING_POOL_TYPE:
            _, strings = parse_string_pool(data, pos)
        elif ctyp == RES_XML_RESOURCE_MAP_TYPE:
            pass
        elif ctyp in VALID_NODE_TYPES:
            break
        else:
            raise ValueError('未知 chunk type 0x%04x @%d' % (ctyp, pos))
        pos += csz
    if strings is None:
        raise ValueError('manifest 无字符串池')
    if pos >= size:
        raise ValueError('manifest 无节点区')

    permissions = []
    stack = []
    node_pos = pos
    while node_pos < size:
        ctyp, chs, csz = _chunk_header(data, node_pos)
        if ctyp not in VALID_NODE_TYPES:
            raise ValueError('未知节点 type 0x%04x @%d' % (ctyp, node_pos))
        if csz <= 0 or node_pos + csz > size:
            raise ValueError('节点越界（type=0x%04x @%d size=%d）' % (ctyp, node_pos, csz))
        if ctyp == NODE_START_ELEMENT:
            stack.append((_element_name(data, node_pos, strings), node_pos))
        elif ctyp == NODE_END_ELEMENT:
            if not stack:
                raise ValueError('END_ELEMENT 无匹配 START @%d' % node_pos)
            name, start_pos = stack.pop()
            if name.startswith(PERM_ELEMENT_PREFIX):
                perm = _name_attr(data, start_pos, strings)
                permissions.append(perm)
        node_pos += csz
    if node_pos != size:
        raise ValueError('节点区未消费完（@%d / %d）' % (node_pos, size))
    if stack:
        raise ValueError('START_ELEMENT 未闭合：%s' % [n for n, _ in stack])
    return {'strings': strings, 'permissions': permissions}


def _element_name(data, node_pos, strings):
    idx = _i32(data, node_pos + 16 + 4)     # attrExt.name（+0 是 ns）
    return strings[idx] if 0 <= idx < len(strings) else ''


def _name_attr(data, start_pos, strings):
    """取该 START_ELEMENT 的 android:name 值（uses-permission 只认 name 一条）。"""
    attribute_start = _u16(data, start_pos + 16 + 8)
    attribute_size = _u16(data, start_pos + 16 + 10)
    attribute_count = _u16(data, start_pos + 16 + 12)
    base = start_pos + 16 + attribute_start
    for i in range(attribute_count):
        ao = base + i * attribute_size
        aname_idx = _i32(data, ao + 4)
        aname = strings[aname_idx] if 0 <= aname_idx < len(strings) else ''
        if aname != 'name':
            continue
        raw_value = _i32(data, ao + 8)
        data_type = data[ao + 15]           # Res_value: size(2) res0(1) dataType(1) data(4)
        data_val = _u32(data, ao + 16)
        if raw_value != -1:
            return strings[raw_value]
        if data_type == TYPE_STRING and 0 <= data_val < len(strings):
            return strings[data_val]
    return None


def list_permissions(data):
    """独立读法：只列 uses-permission* 元素上声明的 android:name。"""
    return list(parse_manifest(data)['permissions'])


# ---------------------------------------------------------------------------
# 手术
# ---------------------------------------------------------------------------
def _find_removal_spans(data, strings, keep):
    """返回 [(start_off, end_off_exclusive, perm), ...]；栈匹配 START/END，支持嵌套删除。"""
    spans = []
    stack = []          # [(name, start_pos)]
    pending = None      # (stack_depth_at_push, start_pos, perm)
    size_total = _u32(data, 4)
    pos = 8
    while pos < size_total:
        ctyp, chs, csz = _chunk_header(data, pos)
        if ctyp == NODE_START_ELEMENT:
            name = _element_name(data, pos, strings)
            if name.startswith(PERM_ELEMENT_PREFIX):
                perm = _name_attr(data, pos, strings)
                if perm is not None and perm not in keep:
                    pending = (len(stack), pos, perm)
            stack.append((name, pos))
        elif ctyp == NODE_END_ELEMENT:
            name, start_pos = stack.pop()
            if pending is not None and start_pos == pending[1] and len(stack) == pending[0]:
                spans.append((pending[1], pos + csz, pending[2]))
                pending = None
        pos += csz
    if pending is not None:
        raise ValueError('手术目标元素未闭合：' + pending[2])
    spans.sort()
    for (s1, e1, _), (s2, e2, _) in zip(spans, spans[1:]):
        if s2 < e1:
            raise ValueError('删除区间重叠（%d..%d 与 %d..%d）' % (s1, e1, s2, e2))
    return spans


def patch_manifest(data, keep=None):
    """删除白名单外的 uses-permission*。返回 (new_bytes, removed_perm_list)。幂等。"""
    keep = set(KEEP_PERMISSIONS if keep is None else keep)
    info = parse_manifest(data)                 # 先验结构，顺便拿字符串池
    spans = _find_removal_spans(data, info['strings'], keep)
    if not spans:
        return bytes(data), []
    out = bytearray()
    last = 0
    removed = []
    for s, e, perm in spans:
        out += data[last:s]
        last = e
        removed.append(perm)
    out += data[last:]
    struct.pack_into('<I', out, 4, len(out))    # 顶层 chunk size 修正
    result = bytes(out)
    # 结构复核 + 白名单外清零断言（不靠调用方）
    reparsed = parse_manifest(result)
    leftover = sorted(set(reparsed['permissions']) - keep)
    if leftover:
        raise AssertionError('手术后仍有白名单外权限：%s' % leftover)
    return result, removed


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def _read_manifest_from_apk(apk_path):
    import zipfile
    with zipfile.ZipFile(apk_path) as z:
        names = [n for n in z.namelist() if n == 'AndroidManifest.xml']
        if len(names) != 1:
            raise SystemExit('APK 内 AndroidManifest.xml 条目数=%d（应为 1）' % len(names))
        return z.read('AndroidManifest.xml')


def _cmd_print(apk_path):
    data = _read_manifest_from_apk(apk_path)
    perms = list_permissions(data)
    keep = set(KEEP_PERMISSIONS)
    removed = [p for p in perms if p not in keep]
    print('当前 %d 条；保留 %d 条；拟删 %d 条：' % (len(perms), len(perms) - len(removed), len(removed)))
    for p in perms:
        print('  %s %s' % ('KEEP' if p in keep else 'CUT ', p))
    patched, gone = patch_manifest(data)
    print('手术演练：%d → %d 字节，删 %d 条，幂等复跑删 %d 条'
          % (len(data), len(patched), len(gone), len(patch_manifest(patched)[1])))


def _selftest():
    base_apk = os.path.join(ROOT, 'tools', 'fzzl_lua_signed.apk')
    if not os.path.isfile(base_apk):
        raise SystemExit('缺基座：' + base_apk)
    data = _read_manifest_from_apk(base_apk)
    base_perms = list_permissions(data)
    keep = set(KEEP_PERMISSIONS)

    # 1) 结构解析自洽：list_permissions 与 parse_manifest 一致
    assert sorted(base_perms) == sorted(parse_manifest(data)['permissions'])

    # 2) 手术结果 == 白名单（双向：删干净 + 没多删）
    patched, removed = patch_manifest(data)
    assert sorted(list_permissions(patched)) == sorted(keep), list_permissions(patched)
    assert set(removed) == set(base_perms) - keep
    assert len(base_perms) == len(removed) + len(keep), (len(base_perms), len(removed), len(keep))

    # 3) 幂等
    again, gone2 = patch_manifest(patched)
    assert gone2 == [] and again == patched

    # 4) 白名单 ⊆ 基座（换基座若丢了保留项，闸门会因"补后 != 白名单"失败，这里先明说）
    missing = keep - set(base_perms)
    assert not missing, '基座缺白名单权限：%s' % missing

    # 5) 故障注入①：喂未手术的基座 → 白名单比对必须失败
    try:
        assert set(list_permissions(data)) == keep
        raise SystemExit('故障注入①未生效：基座竟通过白名单比对')
    except AssertionError:
        pass

    # 6) 故障注入②：顶层 size 被改坏 → 解析必须报错
    corrupt = bytearray(patched)
    struct.pack_into('<I', corrupt, 4, len(corrupt) + 100)
    try:
        parse_manifest(bytes(corrupt))
        raise SystemExit('故障注入②未生效：坏 size 竟解析通过')
    except ValueError:
        pass

    # 7) 故障注入③：节点中间截断 → 解析必须报错
    try:
        parse_manifest(bytes(patched[:-8]))
        raise SystemExit('故障注入③未生效：截断竟解析通过')
    except ValueError:
        pass

    print('selftest 7/7 通过（基座 %d 条 → 白名单 %d 条，删 %d 条）'
          % (len(base_perms), len(keep), len(removed)))


def main():
    args = sys.argv[1:]
    if '--selftest' in args:
        _selftest()
        return
    if '--apk' in args:
        _cmd_print(args[args.index('--apk') + 1])
        return
    print(__doc__)


if __name__ == '__main__':
    main()
