# -*- coding: utf-8 -*-
"""
B1 · 打包 psbin（arm64）：psnode launcher + libnode.so + libc++_shared.so

产物：
    ../psbin/arm64/psnode            自编译（绑核 + 孤儿看门狗）
    ../psbin/arm64/libnode.so        nodejs-mobile v18.4（62.5 MB）
    ../psbin/arm64/libc++_shared.so  libnode 的运行时依赖（6.4 MB）
    ../psbin/PSBIN.json              尺寸/md5/ELF 校验结果

校验项（任一不过即失败）：
  · psnode 的 ELF machine = AArch64（0xB7）
  · psnode 动态依赖里含 libnode.so
  · LOAD 段对齐：记录 min align 与各段 off%16k —— **不是**失败条件，
    16 KB 页设备本来就要回退（工作计划 B8/R7），这里只是把事实固化进清单
用法：
    python build_psbin.py
"""
import hashlib
import io
import json
import os
import struct
import subprocess
import time
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PSLOCAL = os.path.dirname(HERE)
ROOT = os.path.dirname(os.path.dirname(PSLOCAL))
NDK = os.path.join(os.environ['LOCALAPPDATA'], 'Android', 'Sdk', 'ndk', '24.0.8215888')
CLANGXX = os.path.join(NDK, 'toolchains', 'llvm', 'prebuilt', 'windows-x86_64', 'bin',
                       'aarch64-linux-android26-clang++.cmd')
SRC = os.path.join(HERE, 'psnode.cc')
DEPS = os.path.join(ROOT, '_diag', 'perf1018', 'nodeprobe')      # 已归档到 _backup/perf1018_probe_20261018
OUT = os.path.join(HERE, 'arm64')

EM_AARCH64 = 0xB7


def md5(p):
    h = hashlib.md5()
    with open(p, 'rb') as f:
        for c in iter(lambda: f.read(1 << 20), b''):
            h.update(c)
    return h.hexdigest()[:12]


def elf_info(path):
    with open(path, 'rb') as f:
        head = f.read(64)
        assert head[:4] == b'\x7fELF', path + ' 不是 ELF'
        is64 = head[4] == 2
        machine = struct.unpack_from('<H', head, 0x12)[0]
        e_phoff = struct.unpack_from('<Q', head, 0x20)[0] if is64 else struct.unpack_from('<I', head, 0x1C)[0]
        e_phentsize, e_phnum = struct.unpack_from('<HH', head, 0x36)
        f.seek(e_phoff)
        loads = []
        for _ in range(e_phnum):
            ph = f.read(e_phentsize)
            if is64:
                p_type = struct.unpack_from('<I', ph, 0)[0]
                p_off, p_va, _, p_fs, _, p_al = struct.unpack_from('<QQQQQQ', ph, 8)
            else:
                p_type, p_off, p_va, _, p_fs, _, _, p_al = struct.unpack_from('<IIIIIIII', ph, 0)
            if p_type == 1:
                loads.append((p_off, p_va, p_al))
    return {
        'elf64': is64,
        'machine': hex(machine),
        'is_aarch64': machine == EM_AARCH64,
        'min_align': hex(min(a for _, _, a in loads)) if loads else None,
        'load_off_mod_16k': [o % 16384 for o, _, _ in loads],
        'load_va_mod_16k': [v % 16384 for _, v, _ in loads],
    }


def main():
    for p, what in ((CLANGXX, 'NDK clang++'), (SRC, 'psnode.cc'),
                    (os.path.join(DEPS, 'libnode.so'), 'libnode.so'),
                    (os.path.join(DEPS, 'libc++_shared.so'), 'libc++_shared.so')):
        if not os.path.exists(p):
            raise SystemExit('缺少 %s：%s' % (what, p))
    os.makedirs(OUT, exist_ok=True)

    bin_out = os.path.join(OUT, 'psnode')
    inc = os.path.join(DEPS, 'include', 'node')
    print('== 1) 编译 psnode.cc（arm64, min-api 26）')
    cmd = [CLANGXX, '-O2', '-fPIE', '-pie', '-std=c++14',
           '-I', inc, SRC,
           '-L', DEPS, '-lnode', '-lc++_shared',
           "-Wl,-rpath,$ORIGIN", '-Wl,--no-undefined',
           '-o', bin_out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print((r.stdout or '')[-2000:])
        print((r.stderr or '')[-3000:])
        raise SystemExit('编译失败')
    print('   ok：%s（%d 字节）' % (bin_out, os.path.getsize(bin_out)))

    print('== 2) 拷贝运行时依赖')
    for name in ('libnode.so', 'libc++_shared.so'):
        dst = os.path.join(OUT, name)
        need = (not os.path.exists(dst)) or os.path.getsize(dst) != os.path.getsize(os.path.join(DEPS, name))
        if need:
            print('   copy ' + name)
            with open(os.path.join(DEPS, name), 'rb') as fi, open(dst, 'wb') as fo:
                for c in iter(lambda: fi.read(4 << 20), b''):
                    fo.write(c)
        else:
            print('   命中缓存 ' + name)

    print('== 3) ELF 校验')
    info = elf_info(bin_out)
    print('   machine=%s  is_aarch64=%s  min_align=%s' % (info['machine'], info['is_aarch64'], info['min_align']))
    if not info['is_aarch64']:
        raise SystemExit('psnode 不是 AArch64')
    # DT_NEEDED 粗检（不引 readelf）
    with open(bin_out, 'rb') as f:
        blob = f.read()
    if b'libnode.so' not in blob:
        raise SystemExit('psnode 的动态依赖里没有 libnode.so（rpath/link 参数有问题）')

    lib = elf_info(os.path.join(OUT, 'libnode.so'))
    print('   libnode.so  min_align=%s  LOAD off%%16k=%s' % (lib['min_align'], lib['load_off_mod_16k']))
    if lib['min_align'] == '0x1000' and any(x % 16384 for x in lib['load_off_mod_16k']):
        print('   ⚠️ libnode.so 未 16 KB 对齐 —— 16 KB 页设备会加载失败（B8/R7：启动时回退 Jint）')

    manifest = {
        'abi': 'arm64',
        'built_at': time.strftime('%Y-%m-%d %H:%M:%S'),
        'psnode': {'bytes': os.path.getsize(bin_out), 'md5': md5(bin_out)},
        'libnode': dict(bytes=os.path.getsize(os.path.join(OUT, 'libnode.so')),
                        md5=md5(os.path.join(OUT, 'libnode.so')), **lib),
        'libc++_shared': dict(bytes=os.path.getsize(os.path.join(OUT, 'libc++_shared.so')),
                              md5=md5(os.path.join(OUT, 'libc++_shared.so'))),
        'psnode_elf': info,
        'total_bytes': sum(os.path.getsize(os.path.join(OUT, n)) for n in os.listdir(OUT) if os.path.isfile(os.path.join(OUT, n))),
    }
    with io.open(os.path.join(HERE, 'PSBIN.json'), 'w', encoding='utf-8', newline='\n') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print('\n产物：%s' % OUT)
    print('   合计 %.1f MB（psnode %.0f KB + libnode %.1f MB + libc++ %.1f MB）' % (
        manifest['total_bytes'] / 1048576.0,
        manifest['psnode']['bytes'] / 1024.0,
        manifest['libnode']['bytes'] / 1048576.0,
        manifest['libc++_shared']['bytes'] / 1048576.0))
    return 0


if __name__ == '__main__':
    sys.exit(main())
