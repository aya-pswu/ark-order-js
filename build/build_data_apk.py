# -*- coding: utf-8 -*-
"""
数据包 APK（fzzl_data.apk）构建：
  1) aapt package -F —— 最小 manifest（hasCode=false，包名 <主包>.data）出骨架 APK
  2) DataPackTool（.NET 手写 ZIP STORE 打包器）—— 骨架条目 + assets/res/** 合成完整包
     （不用 python zipfile：Python 3.14 的 ZIP64 阈值收紧到 2^31-1，3.37GB 必触发）
  3) zipalign 4 + apksigner（同 fzzl.keystore）→ out/fzzl_data.apk

主包首启通过 PackageManager 查 <pkg>.data 的 sourceDir（或 Download/fzzl_data.apk）
读取本 APK 内 assets/res/**，拷贝到 <persist>/res（带进度条、断点续传）。
重打数据包：删除 out/fzzl_data.apk 后重跑本脚本。
"""
import os
import sys
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
RES_SRC = r'H:\NEW FILES\files\res'
ANDROID_JAR = os.path.join(os.environ['LOCALAPPDATA'], 'Android', 'Sdk', 'platforms', 'android-35', 'android.jar')
BT = os.path.join(os.environ['LOCALAPPDATA'], 'Android', 'Sdk', 'build-tools', '34.0.0')
DOTNET = os.path.join(ROOT, 'tools', 'dotnetsdk', 'dotnet.exe')
MANIFEST = os.path.join(HERE, 'data_apk', 'AndroidManifest.xml')
RES_DIR = os.path.join(HERE, 'data_apk', 'res')      # 从主包提取的 app_icon.png（桌面图标）
KEYSTORE = os.path.join(ROOT, 'tools', 'fzzl.keystore')
MAIN_APK = os.path.join(ROOT, 'tools', 'fzzl_lua_signed.apk')
OUT_DIR = os.path.join(HERE, 'out')
SKELETON = os.path.join(OUT_DIR, 'fzzl_data_skeleton.apk')
APK_UNSIGNED = os.path.join(OUT_DIR, 'fzzl_data_unsigned.apk')
APK_OUT = os.path.join(OUT_DIR, 'fzzl_data.apk')
TOOL_PROJECT = os.path.join(HERE, 'data_apk', 'DataPackTool', 'DataPackTool.csproj')


def run(cmd, desc):
    print('== ' + desc, flush=True)
    r = subprocess.run(cmd, env=dict(os.environ, PATH=os.path.join(r'C:\Program Files\Java\jre1.8.0_501\bin') + os.pathsep + os.environ['PATH']))
    if r.returncode != 0:
        sys.exit('FAILED: ' + desc)


def ks_pass():
    """签名口令取自环境变量 FZZL_KS_PASS（2026-09-30：密钥文件不入库，口令也不再硬编码）。"""
    v = os.environ.get('FZZL_KS_PASS')
    if not v:
        sys.exit('缺少环境变量 FZZL_KS_PASS（APK 签名口令）。\n'
                 '  PowerShell: $env:FZZL_KS_PASS = "…"\n'
                 '  cmd:        set FZZL_KS_PASS=…')
    return v


def extract_icons():
    """从主包 APK 提取 app_icon.png（各 dpi）到 data_apk/res/，让数据包与主包同图标。

    做法：`aapt list -v` 输出每条的【逻辑名】+ CRC32；再用 CRC 反查 zip 里的实际条目名
    （本 APK 恰好未被重命名，但按 CRC 反查更稳 —— 换基座后资源名可能被混淆）。
    """
    import zipfile
    import re
    if os.path.isdir(RES_DIR) and any(f == 'app_icon.png'
                                      for _, _, fs in os.walk(RES_DIR) for f in fs):
        print('== 图标已存在，跳过提取')
        return
    out = subprocess.run([os.path.join(BT, 'aapt.exe'), 'list', '-v', MAIN_APK],
                         capture_output=True, text=True, errors='replace').stdout
    targets = {}
    for line in out.split('\n'):
        m = re.search(r'\s([0-9a-f]{8})\s+(res/\S*app_icon\.png)\s*$', line)
        if m:
            targets[int(m.group(1), 16)] = m.group(2)
    if not targets:
        sys.exit('未能从主包找到 app_icon.png —— 换图标资源名了？改 extract_icons 的匹配规则')
    z = zipfile.ZipFile(MAIN_APK)
    bycrc = {zi.CRC: zi.filename for zi in z.infolist() if zi.CRC in targets}
    n = 0
    for crc, logical in targets.items():
        real = bycrc.get(crc)
        if not real:
            print('  [跳过] 未在 zip 中找到 %s' % logical)
            continue
        d = os.path.join(RES_DIR, logical.split('/')[1])
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, 'app_icon.png'), 'wb') as f:
            f.write(z.read(real))
        n += 1
    print('== 从主包提取 %d 个 app_icon.png -> data_apk/res' % n)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    if os.path.exists(APK_OUT):
        print('已存在 ' + APK_OUT + '，删除后重跑可重打。')
        return

    # fail-fast：签名凭据在**开头**就查。本脚本要合成 ~3.4GB 数据包，
    # 签名那一步才失败意味着前面十几分钟白跑。
    _pass = ks_pass()
    if not os.path.isfile(KEYSTORE):
        sys.exit('缺少密钥文件：' + KEYSTORE)

    # 0) DataPackTool
    tool_exe = os.path.join(HERE, 'data_apk', 'DataPackTool', 'bin', 'Debug', 'net8.0', 'DataPackTool.exe')
    if not os.path.isfile(tool_exe):
        run([DOTNET, 'build', TOOL_PROJECT], 'build DataPackTool')

    # 0.1) 桌面图标：与主包一致（从主包 APK 提取）
    extract_icons()

    # 1) 骨架（manifest + 图标资源）
    #    -S 带上 data_apk/res，manifest 里 @drawable/app_icon 才能解析
    run([os.path.join(BT, 'aapt.exe'), 'package', '-f', '-F', SKELETON,
         '-M', MANIFEST, '-S', RES_DIR, '-I', ANDROID_JAR,
         '--min-sdk-version', '17', '--target-sdk-version', '26'],
        'aapt 骨架 APK')

    # 2) 合入 assets/res/**
    print('== 合入 assets/res/**（3.37GB，约 5~15 分钟）', flush=True)
    run([tool_exe, SKELETON, RES_SRC, APK_UNSIGNED], 'DataPackTool 合成')

    # 3) 对齐 + 签名
    run([os.path.join(BT, 'zipalign.exe'), '-f', '4', APK_UNSIGNED, APK_UNSIGNED + '.aligned'], 'zipalign 4')
    run([os.path.join(BT, 'apksigner.bat'), 'sign',
         '--ks', KEYSTORE, '--ks-pass', 'pass:' + _pass, '--ks-key-alias', 'fzzl',
         '--out', APK_OUT, APK_UNSIGNED + '.aligned'], 'apksigner sign')
    run([os.path.join(BT, 'apksigner.bat'), 'verify', APK_OUT], 'apksigner verify')

    for f in (SKELETON, APK_UNSIGNED, APK_UNSIGNED + '.aligned'):
        if os.path.isfile(f):
            os.remove(f)
    print('产物: ' + APK_OUT + ' ({:,} bytes)'.format(os.path.getsize(APK_OUT)))


if __name__ == '__main__':
    main()
