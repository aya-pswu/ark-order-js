# -*- coding: utf-8 -*-
"""
把 PCJS 测试客户端基座 tools/fzzl_lua_signed.apk 的第一个启动 logo（logoFirst = bilibili）
替换为 apkbuild/logo1.png —— 与安卓单机管线（build_standalone_apk.py 的 logo 替换）对齐。

事实依据（工作日志 2026-09-17 v4.1）：
  Main.PlaySplashQueue 里 Resources.Load<Texture>("logoFirst") 序列化在基座 APK 的
  assets/bin/Data/39a00730784cfb24984c276f8ea8bda5（Unity 单资源文件，593×150 RGBA32）。
  第二个 logo logoMingChao（明朝游戏）不动。

流程：
  1) 复用 out/logoFirst.asset.patched（replace_logo.py 的产物，已含回读校验；缺失则先跑它）；
  2) 重写基座 ZIP：仅替换该条目（其余条目逐字节搬运、压缩方式保留）；
     原版备份到 out/fzzl_lua_signed.apk.orig-logo.bak（只做一次）；
  3) zipalign 4 + apksigner 重签（改了 ZIP，原 v2 签名必然失效，不重签 adb install 拒装）；
     口令走环境变量 FZZL_KS_PASS（与 build_standalone_apk.py 同源）；
  4) apksigner verify + aapt 校验后原子替换 tools/fzzl_lua_signed.apk。

回滚：把 out/fzzl_lua_signed.apk.orig-logo.bak 复制回 tools/ 即可（原版 bilibili logo）；
     或从 H:\\ARK NEW\\fzzl\\assets\\bin\\Data\\39a00730784cfb24984c276f8ea8bda5（解包树原文件）重打。
"""
import os
import shutil
import subprocess
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BASE_APK = os.path.join(ROOT, 'tools', 'fzzl_lua_signed.apk')
BACKUP = os.path.join(HERE, 'out', 'fzzl_lua_signed.apk.orig-logo.bak')
PATCHED_ASSET = os.path.join(HERE, 'out', 'logoFirst.asset.patched')
LOGO_ASSET_ENTRY = 'assets/bin/Data/39a00730784cfb24984c276f8ea8bda5'
BT = os.path.join(os.environ['LOCALAPPDATA'], 'Android', 'Sdk', 'build-tools', '34.0.0')
KEYSTORE = os.path.join(ROOT, 'tools', 'fzzl.keystore')
JRE = r'C:\Program Files\Java\jre1.8.0_501\bin'


def run(cmd, desc, capture=False):
    print('== ' + desc)
    env = dict(os.environ, PATH=JRE + os.pathsep + os.environ['PATH'])
    r = subprocess.run(cmd, env=env, capture_output=capture, text=True,
                       encoding='utf-8', errors='replace')
    if capture and r.stdout.strip():
        print('   ' + r.stdout.strip()[:400])
    if r.returncode != 0:
        sys.exit('FAILED: %s\n%s' % (desc, (r.stderr or '')[-600:]))
    return r


def main():
    if not os.path.isfile(BASE_APK):
        sys.exit('缺少基座：' + BASE_APK)
    if not os.path.isfile(PATCHED_ASSET):
        print('out/logoFirst.asset.patched 不存在，先跑 replace_logo.py …')
        r = subprocess.run([sys.executable, os.path.join(HERE, 'replace_logo.py')])
        if r.returncode != 0:
            sys.exit('replace_logo.py 失败')

    # 1) 备份原版（只做一次；重复执行脚本不会覆盖备份）
    if not os.path.isfile(BACKUP):
        print('== 备份原基座 → ' + BACKUP)
        shutil.copy2(BASE_APK, BACKUP)

    # 2) 重写 ZIP，仅替换 logo 资产条目（其余条目原样搬运，压缩方式逐条目保留）
    with open(PATCHED_ASSET, 'rb') as f:
        new_asset = f.read()
    tmp = BASE_APK + '.tmp'
    replaced = 0
    print('== 重写 ZIP（替换 %s，其余条目逐字节搬运）…' % LOGO_ASSET_ENTRY)
    with zipfile.ZipFile(BASE_APK) as zin, \
         zipfile.ZipFile(tmp, 'w') as zout:
        for item in zin.infolist():
            if item.filename == LOGO_ASSET_ENTRY:
                zout.writestr(item, new_asset)  # compress_type 随 zinfo 保留
                replaced += 1
            else:
                zout.writestr(item, zin.read(item.filename))
    if replaced != 1:
        os.remove(tmp)
        sys.exit('VERIFY-FAIL: logo 资产条目出现 %d 次（应 1 次）' % replaced)

    # 3) zipalign + 重签（原子替换）
    aligned = BASE_APK + '.aligned'
    run([os.path.join(BT, 'zipalign.exe'), '-f', '4', tmp, aligned], 'zipalign 4')
    signed = BASE_APK + '.signed'
    kp = os.environ.get('FZZL_KS_PASS')
    if not kp:
        sys.exit('缺少环境变量 FZZL_KS_PASS（签名口令），见 build_standalone_apk.py 同款要求')
    run([os.path.join(BT, 'apksigner.bat'), 'sign',
         '--ks', KEYSTORE, '--ks-pass', 'pass:' + kp, '--ks-key-alias', 'fzzl',
         '--out', signed, aligned], 'apksigner sign')
    run([os.path.join(BT, 'apksigner.bat'), 'verify', '--print-certs', signed],
        'apksigner verify', capture=True)

    # 4) 回读校验：包内 logo 条目 == patched 资产
    with zipfile.ZipFile(signed) as z:
        got = z.read(LOGO_ASSET_ENTRY)
    if got != new_asset:
        sys.exit('VERIFY-FAIL: 包内 logo 条目与 patched 资产不一致')
    print('== 校验：包内 logo 条目 == out/logoFirst.asset.patched ✓')

    os.replace(signed, BASE_APK)
    for f in (tmp, aligned):
        if os.path.isfile(f):
            os.remove(f)
    print('OK: ' + BASE_APK)
    print('   （原版备份在 ' + BACKUP + '）')


if __name__ == '__main__':
    main()
