#!/usr/bin/env python3
# -*- coding: utf-8 -*-
r"""导出面 diff —— 明文补丁是否漏了原文件的顶层函数（闸门二期唯一值得做的一项）。

为什么只做这一项
----------------
`调研-闸门二期.md` 实测排除了另外三条路：
  · `debug.getupvalue` 数量比对：明文把 upvalue 改写成全局后，函数只剩 `_ENV`，前提不成立；
  · 函数级自由变量比对：172 那种「三个变量合并成一个」数量不变，抓不住；
  · 原 bc / 补丁 差分执行：需要 LuaJIT 二进制 + 每个函数构造输入，UI 类函数不可行。

而「顶层函数集合」是**确定可得**的：
  · 原 bc：chunk proto 里 FNEW→GSET/TSETS 的字段名（= 这个文件导出了哪些函数）；
  · 明文：`function X.y(` / `X.y = function` 两种写法。
漏一个函数通常不报语法错，只在调用到它时 `attempt to call a nil value`（A2 / 七十五）。

用法
----
    python tools/bc_cmp/lua_surface_diff.py            # 扫全部明文补丁
    python tools/bc_cmp/lua_surface_diff.py --file Modules/error/NetWaitPanel
退出码 1 = 存在缺失（可挂进出包前置）。
"""
import argparse
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(ROOT, 'tools', 'ljd'))

SRC = os.path.join(ROOT, 'tools', 'lua_remote', 'src')
BC = os.path.join(ROOT, 'tools', 'lua_remote', 'bc')

# 只统计"导出面"：模块表上的具名函数。以下前缀不是导出（构造期临时函数）
SKIP_PREFIX = ('(anon', )


def plaintext_files():
    out = []
    for dp, _, fn in os.walk(SRC):
        for f in fn:
            if not f.endswith('.lua'):
                continue
            p = os.path.join(dp, f)
            with open(p, 'rb') as fh:
                if fh.read(2) == b'mo':       # 首两字节 'mo' = module( → 明文
                    out.append(p)
    return sorted(out)


def bc_exported_funcs(bc_path):
    """chunk proto 上被赋给模块表的函数名（FNEW → GSET/GSETV/TSETS/TSETV）。"""
    import uv_provenance as U
    U.ensure_version(bc_path)
    _, root = U.ljd.rawdump.parser.parse(bc_path)
    if root is None:
        return set()
    return set(U.owner_funcs(root).values())


def plain_exported_funcs(path):
    s = open(path, encoding='utf-8', errors='replace').read()
    names = set()
    for m in re.finditer(r'^function\s+([\w.:]+)\s*\(', s, re.M):
        names.add(m.group(1))
    for m in re.finditer(r'^([\w.:]+)\s*=\s*function\s*\(', s, re.M):
        names.add(m.group(1))
    return {n.split('.')[-1].split(':')[-1] for n in names}


def check_one(rel):
    bcp = os.path.join(BC, rel)
    srcp = os.path.join(SRC, rel)
    if not os.path.exists(bcp):
        return None
    want = bc_exported_funcs(bcp)
    have = plain_exported_funcs(srcp)
    missing = sorted(n for n in (want - have) if n and not n.startswith(SKIP_PREFIX))
    extra = sorted(have - want)
    return want, have, missing, extra


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--file', help='只查一个（模块名或相对路径）')
    ap.add_argument('--quiet', action='store_true')
    a = ap.parse_args()

    files = plaintext_files()
    if a.file:
        key = a.file.replace('\\', '/').replace('.lua', '')
        files = [p for p in files if key.replace('/', os.sep) in p or key.split('/')[-1] in p]
        if not files:
            raise SystemExit('未找到：%s' % a.file)

    bad = 0
    print('%-52s %5s %5s  %s' % ('明文补丁', 'bc', '明文', '缺失的导出函数'))
    for p in files:
        rel = os.path.relpath(p, SRC)
        r = check_one(rel)
        if r is None:
            continue
        want, have, missing, extra = r
        if missing:
            bad += 1
        if a.quiet and not missing:
            continue
        mark = ('  ← 缺 %d' % len(missing)) if missing else ''
        print('%-52s %5d %5d%s' % (rel, len(want), len(have), mark))
        if missing:
            print('       缺：%s' % ', '.join(missing))
        if extra and not a.quiet:
            print('       多（补丁新增，需人工确认是刻意的）：%s' % ', '.join(extra[:8]))

    print('\n结论：%d 个文件存在导出面缺口' % bad)
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
