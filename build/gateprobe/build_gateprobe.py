# -*- coding: utf-8 -*-
"""
gateprobe APK 构建 —— 产出"能自测 exec 闸门"的最小可运行包（约 5 MB，主体是 isa64）。

流程：javac → d8 → aapt package(+assets) → aapt add classes.dex → zipalign → apksigner

为什么不用主包加 --debuggable：
  1) android:debuggable 在二进制 AXML 里，改文本无效；
  2) 主包 1.5 GB，每轮几分钟；
  3) 真正要测的是"应用自己的进程域"，用 run-as 反而测错域（见 AndroidManifest 注释）。

用法：python build_gateprobe.py
产物：out/gateprobe.apk
签名：~/.android/debug.keystore（口令 android），**不使用**游戏签名密钥
"""
import os
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SDK = os.path.join(os.environ['LOCALAPPDATA'], 'Android', 'Sdk')
BT = os.path.join(SDK, 'build-tools', '34.0.0')
JAR = os.path.join(SDK, 'platforms', 'android-35', 'android.jar')
KS = os.path.join(os.path.expanduser('~'), '.android', 'debug.keystore')
OUT = os.path.join(HERE, 'out')
MANIFEST = os.path.join(HERE, 'AndroidManifest.xml')
SRC = os.path.join(HERE, 'src')
ASSETS = os.path.join(HERE, 'assets')
ISA64 = os.path.join(ROOT, '_diag', 'perf1018', 'nativebench', 'isa64')

AAPT = os.path.join(BT, 'aapt.exe')
ZIPALIGN = os.path.join(BT, 'zipalign.exe')
APKSIGNER = os.path.join(BT, 'apksigner.bat')
D8 = os.path.join(BT, 'd8.bat')
JAVAC = shutil.which('javac') or 'javac'


def run(cmd, cwd=None):
    print('  $ ' + ' '.join(cmd if isinstance(cmd, list) else [cmd]))
    p = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)
    out = (p.stdout or '') + (p.stderr or '')
    if out.strip():
        print('    ' + out.strip().replace('\n', '\n    ')[:3000])
    if p.returncode != 0:
        raise SystemExit('命令失败（exit=%d）' % p.returncode)
    return out


def main():
    for p, what in ((AAPT, 'aapt'), (ZIPALIGN, 'zipalign'), (APKSIGNER, 'apksigner'),
                    (JAR, 'android.jar'), (KS, 'debug.keystore'), (D8, 'd8'), (ISA64, 'isa64')):
        if not os.path.exists(p):
            raise SystemExit('缺少 %s：%s' % (what, p))

    # 资产：把闸门要跑的二进制塞进包
    os.makedirs(ASSETS, exist_ok=True)
    shutil.copy2(ISA64, os.path.join(ASSETS, 'isa64'))
    print('== 0) assets/isa64 %d 字节' % os.path.getsize(os.path.join(ASSETS, 'isa64')))

    for d in ('classes', 'dex'):
        shutil.rmtree(os.path.join(OUT, d), ignore_errors=True)
    os.makedirs(os.path.join(OUT, 'classes'), exist_ok=True)
    os.makedirs(os.path.join(OUT, 'dex'), exist_ok=True)
    unsigned = os.path.join(OUT, 'gateprobe-unsigned.apk')
    aligned = os.path.join(OUT, 'gateprobe-aligned.apk')
    signed = os.path.join(OUT, 'gateprobe.apk')
    for f in (unsigned, aligned, signed):
        if os.path.exists(f):
            os.remove(f)

    print('== 1) javac（-source/-target 8，与 d8 匹配）')
    srcs = []
    for dp, _, fs in os.walk(SRC):
        for f in fs:
            if f.endswith('.java'):
                srcs.append(os.path.join(dp, f))
    run([JAVAC, '-source', '8', '-target', '8', '-encoding', 'UTF-8', '-Xlint:-options',
         '-classpath', JAR, '-d', os.path.join(OUT, 'classes')] + srcs)

    print('== 2) d8 → classes.dex')
    classes = []
    for dp, _, fs in os.walk(os.path.join(OUT, 'classes')):
        for f in fs:
            if f.endswith('.class'):
                classes.append(os.path.join(dp, f))
    run([D8, '--lib', JAR, '--min-api', '17',
         '--output', os.path.join(OUT, 'dex')] + classes)

    print('== 3) aapt package（manifest + assets）')
    run([AAPT, 'package', '-f', '-M', MANIFEST, '-I', JAR,
         '-A', ASSETS, '-F', unsigned])

    print('== 4) aapt add classes.dex')
    run([AAPT, 'add', '-f', unsigned, 'classes.dex'], cwd=os.path.join(OUT, 'dex'))

    print('== 5) zipalign')
    run([ZIPALIGN, '-f', '4', unsigned, aligned])

    print('== 6) apksigner（debug key，非游戏密钥）')
    run([APKSIGNER, 'sign',
         '--ks', KS, '--ks-key-alias', 'androiddebugkey',
         '--ks-pass', 'pass:android', '--key-pass', 'pass:android',
         '--out', signed, aligned])
    run([APKSIGNER, 'verify', signed])

    # 自检：dex 与 asset 都在包里
    import zipfile
    with zipfile.ZipFile(signed) as z:
        names = z.namelist()
    for must in ('classes.dex', 'assets/isa64', 'AndroidManifest.xml'):
        print('   %-22s %s' % (must, 'OK' if must in names else '**MISSING**'))
        if must not in names:
            raise SystemExit('产物缺 %s' % must)

    print('\n产物：%s（%.1f MB）' % (signed, os.path.getsize(signed) / 1048576.0))
    return 0


if __name__ == '__main__':
    sys.exit(main())
