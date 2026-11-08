#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""lua_frame_audit.py —— Lua 远程帧体积审计（构建闸门）

为什么要有这个脚本
==================
`tools/LuaRemoteSocket.cs`（游戏本体的 C#，**本仓无源码/无编译链**）把
「偏移」和「长度」塞进同一个 long：

    _luaFilePosDic[name] = (long)len * 100000000L + offset     // L136 写
    sourceIndex = pos % 100000000;  num = pos / 100000000      // L61-62 读

⇒ **偏移必须 < 100,000,000（1e8）**。越界时代价不是报错而是**静默读错文件**：

    偏移 100,000,000 + 长度 1234  →  读回「偏移 0、长度 1235」
    即拿到帧开头那份内容，多一个字节 —— 不抛异常、不越界，只是内容错了。

而且 `LuaEngineFileUtils.ReadFile` 是 `if (_isReadRemote) {...} else if (...)`，
**远程模式下没有 AB 回落**：帧里缺名字 → 返回 null → require 直接失败。
所以这个上限既不能靠"少放点文件"绕（砍错一个名就必崩），也不能靠兜底。
唯一根治是改上面那两行算术（需要能重编 Assembly-CSharp.dll，目前做不到）。

本脚本做的是**把悬崖变成闸门**：数据区一旦逼近 1e8 就让构建失败，
而不是让它带着一个"上线就随机语法错、且报错指不到原因"的包出厂。

用法
====
    python -S tools/lua_frame_audit.py                # 审 prepare_assets 产出的两棵树
    python -S tools/lua_frame_audit.py --frame X.bin  # 审指定帧
    python -S tools/lua_frame_audit.py --quiet        # 只输出结论行

退出码
======
    0  通过（含 90%~100% 的 WARN 区间，只警告不拦）
    1  参数/文件错误
    2  **数据区 ≥ 1e8**：这份帧客户端读不了，禁止出包
"""
import io
import os
import struct
import sys
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGING = os.path.join(ROOT, 'build', 'pslocal', 'assets_staging')
DEFAULT_FRAMES = [
    os.path.join(STAGING, 'psroot', 'tools', 'lua_remote_frame.bin'),
    os.path.join(STAGING, 'psnode', 'tools', 'lua_remote_frame.bin'),
]
FALLBACK = os.path.join(ROOT, 'build', 'out', 'lua_remote_frame.bin')

OFFSET_LIMIT = 100000000          # LuaRemoteSocket 的 1e8 分隔刻度
WARN_RATIO = 0.90                 # ≥90% 只警告
RECV_BUF = 33554432               # LuaRemoteSocket._receiveBuff = new byte[33554432]（压缩帧）
MAX_CONTENT = 0xFFFFFF            # 帧里内容长度只有 3 字节；buildData 会静默跳过 ≥ 0xFFFFFF 的
MAX_NAME = 255                    # 名字长度只有 1 字节


def rel(p):
    """跨盘符时 relpath 会抛 ValueError（Windows），退回绝对路径。"""
    try:
        return os.path.relpath(p, ROOT)
    except ValueError:
        return p


def parse_frame(path):
    """→ (compressed, data_area, entries[(name, offset, length)], header)"""
    raw = open(path, 'rb').read()
    if len(raw) < 5:
        raise ValueError('帧文件过短：%d B' % len(raw))
    header = struct.unpack('<i', raw[:4])[0]
    data = zlib.decompress(raw[4:])
    total = struct.unpack('<i', data[:4])[0]
    entries, pos = [], 4
    while pos < total:
        nlen = data[pos]
        pos += 1
        clen = int.from_bytes(data[pos:pos + 3], 'little')
        pos += 3
        name = data[pos:pos + nlen].decode('ascii', 'replace')
        pos += nlen
        entries.append((name, pos, clen))
        pos += clen
    return len(raw), total, entries, header, pos, len(raw)


def scan_sources():
    """扫源树里会被 `buildData()` **静默丢掉**的文件。

    `buildData` 的 `add()` 是：`if (key.length > 255 || !content || content.length >= 0xFFFFFF) return;`
    —— 超长名字 / ≥16.7MB 的文件**既不报错也不进帧**，表现为运行期 require 直接失败，
    而帧里根本查不到它的痕迹。所以必须在源树这一侧查。
    → (lua 文件数, [(相对名, 字节)], [超长相对名])
    """
    bad_size, bad_path, n = [], [], 0
    for base in (os.path.join(ROOT, 'tools', 'lua_remote', 'src'),
                 os.path.join(ROOT, 'tools', 'lua_remote', 'bc')):
        if not os.path.isdir(base):
            continue
        for dp, _dns, fns in os.walk(base):
            for fn in fns:
                if not fn.endswith('.lua'):
                    continue
                n += 1
                fp = os.path.join(dp, fn)
                relp = os.path.relpath(fp, base)[:-4].replace('\\', '/')
                if len(relp) > MAX_NAME:
                    bad_path.append(relp)
                sz = os.path.getsize(fp)
                if sz >= MAX_CONTENT:
                    bad_size.append((relp, sz))
    return n, bad_size, bad_path


def audit(path, quiet=False):
    if not os.path.isfile(path):
        print('  MISS 帧文件：%s' % path)
        return 1
    comp, total, entries, header, endpos, rawlen = parse_frame(path)

    ratio = total / OFFSET_LIMIT
    margin = OFFSET_LIMIT - total

    if not quiet:
        print('   帧文件        : %s' % rel(path))
        print('   压缩帧        : {:,} B ({:.2f} MB) / 接收缓冲 {:,} B → {:5.1f}%'
              .format(comp, comp / 1048576, RECV_BUF, 100.0 * comp / RECV_BUF))
        print('   数据区        : {:,} B ({:.2f} MB) / 上限 {:,} B → {:5.1f}%'
              .format(total, total / 1048576, OFFSET_LIMIT, 100 * ratio))
        if margin >= 0:
            print('   距上限余量    : {:,} B ({:.2f} MB, {:.1f}%)'
                  .format(margin, margin / 1048576, 100.0 * margin / total))
        else:
            print('   距上限余量    : 已越界 {:,} B ({:.2f} MB)'.format(-margin, -margin / 1048576))
        print('   条目数        : {:,}（最后一个文件结束于 {:,}）'.format(len(entries), endpos))

        # 重复内容：别名把同一份文件复制成多份（Config 三前缀是主要来源）
        seen, waste, groups = {}, 0, {}
        for name, _off, clen in entries:
            key = (name.rsplit('/', 1)[-1], clen)   # 轻量指纹：同 basename + 同长度
            if key in seen:
                waste += clen
                groups[key] = groups.get(key, 1) + 1
            else:
                seen[key] = 1
        if waste:
            print('   重复内容      : {:,} B ({:.2f} MB, 占数据区 {:.1f}%, {} 组)'
                  .format(waste, waste / 1048576, 100.0 * waste / total, len(groups)))
        top = {}
        for name, _off, clen in entries:
            k0 = name.split('/', 1)[0]
            top[k0] = top.get(k0, 0) + clen
        for k, v in sorted(top.items(), key=lambda kv: -kv[1])[:3]:
            print('     %-12s %6.2f MB' % (k, v / 1048576))

    # 一致性检查（这些是**服务端**的静默坑，不查就没人知道）
    problems = []
    # 外层头 = zip.length + 4（getFrame 里 Buffer.concat([head, zip])）⇒ 应等于整帧文件长度
    if header != rawlen:
        problems.append('外层头 %d ≠ 帧文件长度 %d（getFrame 约定是 zip.length+4）'
                        % (header, rawlen))
    if endpos != total:
        problems.append('解析结束位 %d ≠ 数据区长度 %d（帧结构被写坏）' % (endpos, total))
    big = [e for e in entries if e[2] >= MAX_CONTENT]
    if big:
        problems.append('{} 个文件 ≥ 0xFFFFFF，buildData 会静默丢弃：{}'
                        .format(len(big), ', '.join(e[0] for e in big[:3])))
    longname = [e for e in entries if len(e[0]) > MAX_NAME]
    if longname:
        problems.append('%d 个名字超过 255 字节（会被静默丢弃）' % len(longname))
    if comp >= RECV_BUF:
        problems.append('压缩帧 {:,} B ≥ 接收缓冲 {:,} B（客户端 Receive 必失败）'
                        .format(comp, RECV_BUF))

    for p in problems:
        print('   ✗ %s' % p)

    if total >= OFFSET_LIMIT:
        print('   结论：**禁止出包** —— 数据区已越 1e8，客户端会把帧尾文件读成错误内容'
              '（不报错、随机语法错、报错指不到这里）')
        return 2
    if ratio >= WARN_RATIO:
        print('   结论：WARN 已用 %.1f%%，余量仅 %.2f MB —— 再加约 %d 个平均大小的文件就越界'
              % (100 * ratio, margin / 1048576, margin // max(1, total // len(entries))))
        return 0
    print('   结论：OK 已用 %.1f%%，余量 %.2f MB' % (100 * ratio, margin / 1048576))
    return 0


def main(argv):
    quiet = '--quiet' in argv
    frames = []
    if '--frame' in argv:
        i = argv.index('--frame')
        frames = [argv[i + 1]] if i + 1 < len(argv) else []
        if not frames:
            print('--frame 需要一个路径')
            return 1
    else:
        frames = [p for p in DEFAULT_FRAMES if os.path.isfile(p)]
        if not frames and os.path.isfile(FALLBACK):
            print('   提示：staging 里没有帧，回退审 %s（可能是上次出包的旧帧）'
                  % rel(FALLBACK))
            frames = [FALLBACK]
        if not frames:
            print('  MISS 找不到任何 lua_remote_frame.bin（先跑 prepare_assets.py）')
            return 1

    print('== Lua 帧体积审计（LuaRemoteSocket 偏移上限 = %d）' % OFFSET_LIMIT)
    worst = 0
    for p in frames:
        print('  · %s' % rel(p))
        rc = audit(p, quiet=quiet)
        worst = max(worst, rc)
        if rc == 2:
            break   # 已经判死，不必再审另一棵

    # 源树侧：会被 buildData 静默丢弃的文件（帧里查不到，必须单独查）
    n, bad_size, bad_path = scan_sources()
    if not quiet:
        print('  · 源树自检（tools/lua_remote/{src,bc}）')
        print('   lua 文件数    : {:,}'.format(n))
    if bad_size:
        for relp, sz in bad_size[:5]:
            print('   ✗ %s = {:,} B ≥ 0xFFFFFF，buildData 会**静默丢弃**'.format(relp, sz))
        worst = max(worst, 2)
    if bad_path:
        for relp in bad_path[:5]:
            print('   ✗ 名字 %d 字节 > 255，buildData 会**静默丢弃**：%s' % (len(relp), relp))
        worst = max(worst, 2)
    if not quiet and not bad_size and not bad_path:
        print('   结论：源树无“会被静默丢弃”的文件')

    if worst == 2:
        print('\n  修法只有两条：① 改 LuaRemoteSocket 的打包算术（需重编 Assembly-CSharp.dll）；'
              '② 减小帧（但**不能**靠删别名——远程模式没有 AB 回落，删错一个名就必崩）')
    return worst


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
