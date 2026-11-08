# -*- coding: utf-8 -*-
"""client_assembly.py —— assemble the Lua remote tree (build step, make.py step 0).

Why this exists
===============
The repo carries only the *plaintext patch surface* (`client/`: 29 patched Lua files
plus the two hand-maintained frame configs `keymap.json` / `auto_aliases.json`).
The original game bytecode tree (`tools/lua_remote/bc`) is a **pinned, machine-local
game-derived artifact**: it was extracted from per-module `modules_*.ab` bundles of a
specific game build and then hand-curated (clean LoginModule from the base APK, KR
table swap for CfgServantFace), so it cannot be regenerated from today's asset
bundles (the bundle layout changed to a single `modules.ab`, and curated content
differs). It is gitignored and must be placed at `tools/lua_remote/bc` once
(`--bc-dir` does the copy).

Result (all downstream consumers read exactly these paths, unchanged):

    tools/lua_remote/bc              pinned game bytecode (gitignored, ~3,500 files)
    tools/lua_remote/src             the patch overlay — plaintext files from client/
                                     (src wins over bc in buildData's merge)
    tools/lua_remote/keymap.json     hand-maintained frame configs (from client/)
    tools/lua_remote/auto_aliases.json

Consumers:
  - server/lua_remote.js                      builds the Lua frame served on :44587
                                              (merge semantics: src first, bc fills the rest)
  - build/pslocal/scripts/prepare_assets.py   pre-generates lua_remote_frame.bin
  - gates/lua_frame_audit.py                  1e8 offset gate over {src,bc}
  - gates/lua_surface_diff.py                 export-surface gate over {src,bc}

Equivalence note: every bytecode copy once present in the legacy src tree is
byte-identical to its bc counterpart (verified 2026-11-08), so an overlay-only src
produces a byte-identical merged frame.

Usage:
    python build/client_assembly.py                    # assemble (bc must already exist)
    python build/client_assembly.py --bc-dir DIR       # install/refresh the pinned bc tree
    python build/client_assembly.py --verify-src DIR   # overlay-src byte-compare vs DIR
"""
import argparse
import os
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_LUA = os.path.join(ROOT, 'tools', 'lua_remote')
PATCH_DIR = os.path.join(ROOT, 'client')
FRAME_CONFIGS = ('keymap.json', 'auto_aliases.json')


def install_bc(src_dir):
    dst = os.path.join(OUT_LUA, 'bc')
    if os.path.abspath(src_dir) == os.path.abspath(dst):
        raise SystemExit('--bc-dir points at the destination itself')
    if not os.path.isdir(os.path.join(src_dir, 'Modules')):
        raise SystemExit('not a bc tree (no Modules/ subdir): ' + src_dir)
    if os.path.isdir(dst):
        shutil.rmtree(dst)
    shutil.copytree(src_dir, dst)
    n = sum(len(fs) for _, _, fs in os.walk(dst))
    print('bc installed: %d files <- %s' % (n, src_dir))


def check_bc():
    dst = os.path.join(OUT_LUA, 'bc')
    if not os.path.isdir(os.path.join(dst, 'Modules')):
        raise SystemExit(
            'pinned bc tree missing at %s\n'
            '  one-time setup: python build/client_assembly.py --bc-dir <archive>/tools/lua_remote/bc\n'
            '  (the bc tree is a pinned game-derived artifact; it is NOT in the repository)'
            % dst)
    n = sum(len(fs) for _, _, fs in os.walk(dst))
    print('bc present: %d files' % n)


def assemble_src():
    src = os.path.join(OUT_LUA, 'src')
    if os.path.isdir(src):
        shutil.rmtree(src)
    os.makedirs(src)
    n = 0
    for dp, _, files in os.walk(PATCH_DIR):
        for f in sorted(files):
            if not f.endswith('.lua'):
                continue
            sp = os.path.join(dp, f)
            rel = os.path.relpath(sp, PATCH_DIR)
            dp2 = os.path.join(src, rel)
            os.makedirs(os.path.dirname(dp2), exist_ok=True)
            shutil.copy2(sp, dp2)
            n += 1
    print('src assembled: %d plaintext patch files <- client/' % n)
    for cfg in FRAME_CONFIGS:
        sp = os.path.join(PATCH_DIR, cfg)
        dp = os.path.join(OUT_LUA, cfg)
        if os.path.isfile(sp):
            shutil.copy2(sp, dp)
            print('frame config placed: %s' % cfg)
        elif not os.path.isfile(dp):
            raise SystemExit('missing frame config in client/: ' + cfg)


def verify_src(against):
    a, diff = 0, []
    for dp, _, files in os.walk(os.path.join(OUT_LUA, 'src')):
        for f in sorted(files):
            fp = os.path.join(dp, f)
            rel = os.path.relpath(fp, os.path.join(OUT_LUA, 'src'))
            ref = os.path.join(against, rel)
            a += 1
            if not os.path.isfile(ref) or open(fp, 'rb').read() != open(ref, 'rb').read():
                diff.append(rel)
    print('overlay verify vs %s: %d files, %d mismatched' % (against, a, len(diff)))
    for r in diff[:10]:
        print('  !', r)
    if diff:
        raise SystemExit('overlay verification FAILED')
    print('overlay verification PASSED')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--bc-dir', metavar='DIR', help='install/refresh the pinned bc tree from DIR')
    ap.add_argument('--verify-src', metavar='DIR',
                    help='byte-compare the assembled overlay src against DIR')
    args = ap.parse_args()
    if args.bc_dir:
        install_bc(args.bc_dir)
    check_bc()
    assemble_src()
    if args.verify_src:
        verify_src(args.verify_src)


if __name__ == '__main__':
    main()
