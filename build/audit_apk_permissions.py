# -*- coding: utf-8 -*-
"""
audit_apk_permissions.py —— 出货包权限闸门（二百九十五，make.py ④）。

出厂不变量：出货 APK 的 AndroidManifest.xml 里声明的 uses-permission 必须
**恰好等于** patch_manifest_perms.KEEP_PERMISSIONS 白名单（7 条，口径见该文件头）。
多一条（比如换基座后又带进来 READ_PHONE_STATE）或白名单某条丢了，都直接失败——
宁可构建失败，也不出一个"安装列表里有短信/通话记录/定位"的包。

为什么做成闸门而不是只在打包时改一次：权限是"声明面"问题——基座一换、管线一绕
（手工 zip 重打），33 条全套就会静默回来。参照 ①h 的哲学：闸门拦在出货口，双向注入自检内置。

用法：
  python audit_apk_permissions.py                     # 审 out/fzzl_standalone_alpha.apk
  python audit_apk_permissions.py --apk <path>        # 审指定 APK（签名前后均可审）
  python audit_apk_permissions.py --selftest          # 故障注入自检（审基座必须红）

退出码：0 通过；2 失败（make.py 只看非零）。
"""
import os
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import patch_manifest_perms as PMP   # 白名单单一真相源 + AXML 读法

DEFAULT_APK = os.path.join(HERE, 'out', 'fzzl_standalone_alpha.apk')

GATE_OK = 0
GATE_FAIL = 2


def audit_manifest_bytes(data, source_name, keep=None):
    """白名单比对核心（verify.py A5 / 打包 fail-fast / 本 CLI 共用）。失败抛 AssertionError。"""
    got = sorted(PMP.list_permissions(data))
    want = sorted(PMP.KEEP_PERMISSIONS if keep is None else keep)
    extra = sorted(set(got) - set(want))
    missing = sorted(set(want) - set(got))
    if extra or missing:
        raise AssertionError('%s 权限集 ≠ 白名单：多 %s / 缺 %s（现 %d 条）'
                             % (source_name, extra or '无', missing or '无', len(got)))
    return got


def audit_apk(apk_path):
    if not os.path.isfile(apk_path):
        raise AssertionError('APK 不存在：%s' % apk_path)
    with zipfile.ZipFile(apk_path) as z:
        names = [n for n in z.namelist() if n == 'AndroidManifest.xml']
        if len(names) != 1:
            raise AssertionError('APK 内 AndroidManifest.xml 条目数=%d（应为 1）' % len(names))
        data = z.read('AndroidManifest.xml')
    perms = audit_manifest_bytes(data, os.path.basename(apk_path))
    return perms


def _selftest():
    base_apk = os.path.join(PMP.ROOT, 'tools', 'fzzl_lua_signed.apk')
    if not os.path.isfile(base_apk):
        raise SystemExit('缺基座：' + base_apk)

    # 注入①（真阳）：未手术的基座 manifest → 闸门必须红
    with zipfile.ZipFile(base_apk) as z:
        base_manifest = z.read('AndroidManifest.xml')
    try:
        audit_manifest_bytes(base_manifest, '基座(未手术)')
        raise SystemExit('注入①未生效：基座 manifest 竟通过闸门')
    except AssertionError:
        pass

    # 注入②（真阴）：手术后的 manifest → 闸门必须绿
    patched, removed = PMP.patch_manifest(base_manifest)
    got = audit_manifest_bytes(patched, '基座(手术后)')
    assert len(got) == len(PMP.KEEP_PERMISSIONS)

    # 注入③（变体）：包内权限比期望白名单多出任何一条 → 必须红。
    # 用"手术后的 manifest × 故意收窄的白名单"走同一条比对路径（往 AXML 里真插一个
    # 元素需要重建字符串池，不值得；extra 非空报红的分支与真实场景完全一致）。
    shrunk = sorted(PMP.KEEP_PERMISSIONS)[:-1]
    try:
        audit_manifest_bytes(patched, '白名单漂移模拟', keep=shrunk)
        raise SystemExit('注入③未生效：多出的权限竟通过闸门')
    except AssertionError:
        pass

    print('selftest 3/3 通过（基座红 / 手术后绿 / 白名单漂移红）')


def main():
    args = sys.argv[1:]
    if '--selftest' in args:
        _selftest()
        return
    apk = DEFAULT_APK
    if '--apk' in args:
        apk = args[args.index('--apk') + 1]
    try:
        perms = audit_apk(apk)
    except AssertionError as e:
        print('[权限闸门] FAIL  %s' % e)
        sys.exit(GATE_FAIL)
    print('[权限闸门] OK  %s：uses-permission 共 %d 条，与白名单完全一致' % (os.path.basename(apk), len(perms)))
    for p in perms:
        print('   ' + p)
    sys.exit(GATE_OK)


if __name__ == '__main__':
    main()
