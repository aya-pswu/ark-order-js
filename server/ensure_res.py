# -*- coding: utf-8 -*-
"""
PCJS 数据包自动注入 —— 对齐安卓单机管线 DataPackage.Ensure 的能力（2026-10-11）。

场景：设备上装了基座客户端（com.bilibili.fzzl.guopan，PCJS 测试端 = fzzl_lua_signed.apk），
但 <files>/res/ 缺失（新模拟器 / 清过数据 / 换机）。此时若
  ① 同设备已安装数据包 APK（com.bilibili.fzzl.guopan.data，pm path 可查）；
  ② 或本机存在 fzzl_data.apk（--data-apk 指定，默认 <repo>/apkbuild/out/fzzl_data.apk）；
则自动把完整资源（3.2GB / 1.4 万+ 文件）解包进 <files>/res/，PCJS 即可在该设备直接开玩。
两个来源都没有 → 给出明确指引后退出（不阻塞 start.ps1，游戏侧反正进不去）。

做法（全部在设备端完成，免 3.2GB 经 adb 来回传输）：
  unzip -o -q <src.apk> 'assets/res/*' -d <files>/res    # 解到 res/assets/res/**
  cd <files>/res && mv assets/res/* . && rm -rf assets    # 同一文件系统，瞬时 rename 归位
已就绪（res/resInfo.json 在位）时秒过；脚本幂等，中断重跑即可续传（unzip -o 覆盖同名）。

需要 root（adb root；start.ps1 已做）：写 /storage/emulated 与读已安装数据包 APK 都要它。

用法（start.ps1 已接线，也可手动）：
  python server/ensure_res.py --adb "C:\\Program Files\\Netease\\MuMu\\nx_main\\adb.exe" \
      --serial 127.0.0.1:16480 [--data-apk <fzzl_data.apk 路径>]

退出码：0=就绪或注入成功；2=基座未安装；3=找不到数据包来源；4=设备空间/工具不满足；
        5=注入后校验失败。
"""
import argparse
import os
import subprocess
import sys
import time
import zipfile

PKG = 'com.bilibili.fzzl.guopan'
DATA_PKG = PKG + '.data'
TMP_APK = '/data/local/tmp/pcjs_fzzl_data.apk'
NEED_FREE_MB = 4200          # 设备 /sdcard 至少需要的空闲（3.2GB 数据 + 余量）
MIN_FILES = 10000            # 注入后 res 内文件数下限（实际 ~1.4 万），防"解了个空包"


def adb_out(a, serial, cmd, timeout=120):
    """adb shell 执行并返回 (返回码, stdout)。设备端命令以 echo RC=$? 收尾取返回码。"""
    p = subprocess.run([a, '-s', serial, 'shell', cmd + ' ; echo __RC__=$?'],
                       capture_output=True, text=True, encoding='utf-8',
                       errors='replace', timeout=timeout)
    out = p.stdout or ''
    rc = 0
    if '__RC__=' in out:
        head, _, tail = out.rpartition('__RC__=')
        rc_txt = tail.strip().splitlines()[0].strip() if tail.strip() else '0'
        try:
            rc = int(rc_txt)
        except ValueError:
            rc = 0
        out = head.rstrip()
    return rc, out


def adb_run(a, serial, cmd, timeout=3600):
    """长任务：不捕获输出（进度直通控制台），只等结束。"""
    return subprocess.run([a, '-s', serial, 'shell', cmd], timeout=timeout)


def die(code, msg):
    print('  [FAIL] ' + msg)
    sys.exit(code)


def human(n):
    return ('%.1fGB' % (n / 1e9)) if n >= 1e9 else ('%dMB' % (n // 1e6))


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser(description='PCJS 数据包自动注入')
    ap.add_argument('--adb', default='adb')
    ap.add_argument('--serial', required=True)
    ap.add_argument('--data-apk', default=os.path.normpath(os.path.join(here, '..', 'apkbuild', 'out', 'fzzl_data.apk')))
    args = ap.parse_args()
    a, serial = args.adb, args.serial
    t0 = time.time()
    files_dir = '/sdcard/Android/data/%s/files' % PKG
    res_dir = files_dir + '/res'

    def shell(cmd, timeout=120):
        return adb_out(a, serial, cmd, timeout)

    # 0) 设备连通 + root
    rc, out = shell('id -u')
    uid = out.strip().splitlines()[-1] if out.strip() else '?'
    if uid not in ('0', '2000'):  # adb root 后 shell 是 0；未 root 是 2000
        die(4, '设备未 root（adb root 失败？）。读数据包 APK / 写 /sdcard 都需要 root。')
    print('  adb: %s（uid=%s）' % (serial, uid))

    # 1) 基座在不在
    rc, out = shell('pm path %s' % PKG)
    if rc != 0 or 'package:' not in out:
        die(2, '设备上没有基座客户端 %s —— 先安装 fzzl_lua_signed.apk（PCJS 测试端）。' % PKG)

    # 2) 就绪检查（每次启动都会走到这里，必须秒回）
    rc, out = shell('test -f %s/res/resInfo.json && echo YES' % files_dir)
    if 'YES' in out:
        print('  数据包就绪（%s/res/resInfo.json 在位，%d 秒）' % (files_dir, time.time() - t0))
        return
    print('  缺少数据包（%s/res 不完整），开始自动注入…' % files_dir)

    # 3) 数据来源：已安装的 <pkg>.data 优先（零传输），否则推送本地 fzzl_data.apk
    rc, out = shell('pm path %s 2>/dev/null' % DATA_PKG)
    src = None
    pushed = False
    expected_files = None
    for line in out.splitlines():
        line = line.strip()
        if line.startswith('package:'):
            src = line[len('package:'):].split(':')[-1]  # base.apk 路径（取最后一行 base）
    if src and shell('test -f "%s" && echo YES' % src)[1].find('YES') >= 0:
        print('  数据来源：设备上已安装的数据包 APK（%s）' % src)
    else:
        local = os.path.abspath(args.data_apk)
        if not os.path.isfile(local):
            die(3, '找不到数据包来源：设备未安装 %s，且本地没有 %s。\n'
                   '  处置：① 在该设备上安装 fzzl_data.apk（com.bilibili.fzzl.guopan.data）；'
                   '或 ② 构建产物放到 apkbuild/out/fzzl_data.apk（build_data_apk.py）；'
                   '或 ③ --data-apk 指定路径。' % (DATA_PKG, local))
        with zipfile.ZipFile(local) as z:
            expected_files = sum(1 for n in z.namelist() if n.startswith('assets/res/'))
        print('  数据来源：本地 %s（%s，%d 条 res 条目），推送到设备…' %
              (local, human(os.path.getsize(local)), expected_files))
        r = subprocess.run([a, '-s', serial, 'push', local, TMP_APK])
        if r.returncode != 0:
            die(4, 'adb push 数据包失败')
        src = TMP_APK
        pushed = True

    # 4) 空间与工具
    rc, out = shell('df -k /storage/emulated 2>/dev/null | tail -1')
    try:
        avail_kb = int(out.split()[3])
        if avail_kb < NEED_FREE_MB * 1024:
            die(4, '设备空间不足：/sdcard 仅剩 %dMB，需要约 %dMB' % (avail_kb // 1024, NEED_FREE_MB))
        print('  设备空间充足（剩余 %.1fGB）' % (avail_kb / 1e6))
    except (IndexError, ValueError):
        print('  [WARN] 无法解析 df 输出，跳过空间检查')
    rc, _ = shell('command -v unzip')
    if rc != 0:
        die(4, '设备上没有 unzip（toybox）——本脚本依赖设备端解包')

    # 5) 解包（设备端 unzip，直写 res/assets/res/**）+ 轮询进度
    print('  解包 %s → %s（约 3.2GB，预计 2~5 分钟）…' % (src, res_dir))
    p = subprocess.Popen([a, '-s', serial, 'shell',
                          'unzip -o -q "%s" \'assets/res/*\' -d %s ; echo __RC__=$?' % (src, res_dir)],
                         stdout=subprocess.PIPE, text=True, encoding='utf-8', errors='replace')
    last = 0
    while p.poll() is None:
        time.sleep(8)
        _, du = shell('du -sk %s 2>/dev/null | cut -f1' % res_dir, timeout=60)
        try:
            kb = int(du.strip().splitlines()[-1])
        except (IndexError, ValueError):
            continue
        if kb > 0 and (kb - last) > 200 * 1024:  # 每 200MB 报一次
            last = kb
            print('    已解包 %.1fGB …' % (kb / 1e6))
    out = p.stdout.read() if p.stdout else ''
    if '__RC__=0' not in out:
        die(5, '设备端 unzip 失败（RC 行：%s）' % out.strip()[-120:])

    # 6) 归位：res/assets/res/** → res/**（同文件系统 rename，瞬时）
    rc, out = shell('cd %s && mv assets/res/* . && rm -rf assets && echo MOVED' % res_dir, timeout=300)
    if 'MOVED' not in out:
        die(5, '归位失败（mv/rm assets）：' + out.strip()[-200:])

    # 7) 校验：resInfo.json + 文件数
    rc, out = shell('test -f %s/resInfo.json && echo YES' % res_dir)
    if 'YES' not in out:
        die(5, '注入后仍缺少 res/resInfo.json —— 数据包内容不完整？')
    _, cnt_out = shell('find %s -type f | wc -l' % res_dir, timeout=300)
    try:
        cnt = int(cnt_out.strip().splitlines()[-1])
    except (IndexError, ValueError):
        cnt = -1
    print('  注入完成：%s 内 %d 个文件（耗时 %d 秒）' % (res_dir, cnt, time.time() - t0))
    if cnt < MIN_FILES:
        die(5, '文件数异常（%d < %d）—— 数据包不完整，删除 %s/res 后重跑可重来' % (cnt, MIN_FILES, files_dir))
    if expected_files is not None and abs(cnt - expected_files) > 64:
        print('  [WARN] 文件数与本地数据包不一致（包内 %d / 设备 %d），请人工复核' % (expected_files, cnt))

    # 8) 清理
    if pushed:
        shell('rm -f %s' % TMP_APK)
    print('  OK（总耗时 %d 秒）' % (time.time() - t0))


if __name__ == '__main__':
    main()
