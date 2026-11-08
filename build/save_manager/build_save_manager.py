# -*- coding: utf-8 -*-
"""
存档管理器 APK 打包（极简、零 gradle）：
  AndroidManifest.xml + src/**（纯 Java，无资源文件，UI 纯代码）
  → aapt2 link（骨架 APK）→ javac(--release 8) → d8 → zip 内追加 classes.dex
  → zipalign + apksigner（tools/fzzl.keystore，口令环境变量 FZZL_KS_PASS）
  → out/fzzl_savemgr.apk

签名/工具链复用 build_standalone_apk.py 的既有约定（BT=build-tools 34.0.0、同一 keystore）。
"""
import os
import shutil
import subprocess
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))  # H:\ARK NEW
BT = os.path.join(os.environ['LOCALAPPDATA'], 'Android', 'Sdk', 'build-tools', '34.0.0')
# d8 专用：34.0.0 的 R8 8.2.2-dev 对本项目 class 抛 NPE（String.length(<null>)），36.1.0 正常
BT_D8 = os.path.join(os.environ['LOCALAPPDATA'], 'Android', 'Sdk', 'build-tools', '36.1.0')
PLATFORMS = os.path.join(os.environ['LOCALAPPDATA'], 'Android', 'Sdk', 'platforms')
ANDROID_JAR = os.path.join(PLATFORMS, 'android-35', 'android.jar')
KEYSTORE = os.path.join(ROOT, 'tools', 'fzzl.keystore')
OUT_DIR = os.path.join(HERE, 'out')
BUILD_DIR = os.path.join(HERE, 'build')

APK_UNSIGNED = os.path.join(BUILD_DIR, 'savemgr_unsigned.apk')
APK_ALIGNED = os.path.join(BUILD_DIR, 'savemgr_unsigned.aligned.apk')
APK_OUT = os.path.join(OUT_DIR, 'fzzl_savemgr.apk')


def ks_pass():
    v = os.environ.get('FZZL_KS_PASS')
    if not v:
        sys.exit('缺少环境变量 FZZL_KS_PASS（APK 签名口令）。'
                 '  PowerShell: $env:FZZL_KS_PASS = "…"')
    return v


def find_javac():
    r"""JDK21 在本机 H:\G-0_X_0\...\jdk-21（PATH 里的 java 是 JRE 8，无编译器）。"""
    cands = [os.path.join(os.environ.get('JAVA_HOME', ''), 'bin', 'javac.exe')]
    cands += [
        r'H:\G-0_X_0\261010-morluto\tools\jdk-21\bin\javac.exe',
        r'C:\Program Files\Java\jdk-21\bin\javac.exe',
        r'C:\Program Files\Java\jdk-17\bin\javac.exe',
    ]
    for c in cands:
        if c and os.path.isfile(c):
            return c
    return 'javac'  # 最后指望 PATH


def find_java21():
    jc = find_javac()
    if os.path.isfile(jc):
        return os.path.join(os.path.dirname(jc), 'java.exe')
    return 'java'


def run(cmd, label):
    print('==', label)
    p = subprocess.run(cmd, capture_output=True, text=True, errors='replace')
    if p.returncode != 0:
        print(p.stdout[-4000:])
        print(p.stderr[-4000:])
        sys.exit('%s 失败（exit %d）' % (label, p.returncode))
    if p.stdout.strip():
        print(p.stdout.strip()[-1500:])


def main():
    for f in (ANDROID_JAR, KEYSTORE):
        if not os.path.isfile(f):
            sys.exit('缺少前置文件: ' + f)

    if os.path.isdir(BUILD_DIR):
        shutil.rmtree(BUILD_DIR)
    os.makedirs(BUILD_DIR)
    os.makedirs(OUT_DIR, exist_ok=True)

    # 1) aapt2 link：manifest → 骨架 APK（无 res；图标用系统默认，省资源编译链）
    run([os.path.join(BT, 'aapt2.exe'), 'link',
         '--manifest', os.path.join(HERE, 'AndroidManifest.xml'),
         '-I', ANDROID_JAR,
         '--min-sdk-version', '21', '--target-sdk-version', '29',
         '-o', APK_UNSIGNED], 'aapt2 link')

    # 2) javac（--release 8：运行时是设备上的 ART，字节码 8 由 d8 desugar）
    srcs = []
    for dirpath, _, files in os.walk(os.path.join(HERE, 'src')):
        for fn in files:
            if fn.endswith('.java'):
                srcs.append(os.path.join(dirpath, fn))
    run([find_javac(), '--release', '8', '-encoding', 'UTF-8',
         '-classpath', ANDROID_JAR,
         '-d', os.path.join(BUILD_DIR, 'classes')] + srcs, 'javac')

    # 3) d8 → classes.dex（用 JDK21 的 java 跑，绕开 PATH 里 java 8 的不确定）
    d8jar = os.path.join(BT_D8, 'lib', 'd8.jar')
    run([find_java21(), '-cp', d8jar, 'com.android.tools.r8.D8',
         '--release', '--min-api', '21', '--lib', ANDROID_JAR,
         '--output', BUILD_DIR] +
        [os.path.join(dp, fn)
         for dp, _, fns in os.walk(os.path.join(BUILD_DIR, 'classes'))
         for fn in fns if fn.endswith('.class')], 'd8')
    classes_dex = os.path.join(BUILD_DIR, 'classes.dex')
    if not os.path.isfile(classes_dex):
        sys.exit('d8 未产出 classes.dex')

    # 4) 把 classes.dex 追加进骨架 APK（python zipfile；arsc 保持 aapt2 原样）
    with zipfile.ZipFile(APK_UNSIGNED, 'a') as z:
        z.write(classes_dex, 'classes.dex', compress_type=zipfile.ZIP_DEFLATED)

    # 5) zipalign + apksigner
    run([os.path.join(BT, 'zipalign.exe'), '-f', '4', APK_UNSIGNED, APK_ALIGNED], 'zipalign 4')
    env_pass = ks_pass()
    run([os.path.join(BT, 'apksigner.bat'), 'sign',
         '--ks', KEYSTORE, '--ks-pass', 'pass:' + env_pass, '--ks-key-alias', 'fzzl',
         '--out', APK_OUT, APK_ALIGNED], 'apksigner sign')
    run([os.path.join(BT, 'apksigner.bat'), 'verify', APK_OUT], 'apksigner verify')

    print()
    print('产物: ' + APK_OUT)
    print('体积: {:,} bytes'.format(os.path.getsize(APK_OUT)))


if __name__ == '__main__':
    main()
