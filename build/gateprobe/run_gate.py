# -*- coding: utf-8 -*-
"""
B0 闸门执行器（进程内自测版）—— 在真机上回答三个问题（工作计划.md §6.1）：

  Q1(域)    探针进程是否落在 untrusted_app_27（与游戏同域）——**必须由进程自己打印**
  Q2(B0-1)  untrusted_app 进程能否 execve 自己私有目录里的 64 位二进制
  Q3(对照)  同一文件在外部存储（FUSE noexec）上 execve 是否必然失败

⚠️ 不要用 `adb shell run-as <pkg> sh -c ...` 做这个判定：run-as 会把进程切到
   `u:r:runas_app:s0`，测的不是游戏域（2026-10-18 首轮已踩）。

用法：
  python run_gate.py              # 自动选第一台设备
  python run_gate.py b1f4e9f6     # 指定 serial

产物：out/GATE_REPORT.md（结论 + 原始输出），供回填 工作计划.md §6.1.3
"""
import os
import re
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
ADB = os.path.join(os.environ['LOCALAPPDATA'], 'Android', 'Sdk', 'platform-tools', 'adb.exe')
APK = os.path.join(HERE, 'out', 'gateprobe.apk')
PKG = 'com.bilibili.fzzl.gateprobe'
ACT = PKG + '/.GateActivity'
GAME = 'com.bilibili.fzzl.guopan'
OUT = os.path.join(HERE, 'out')


def adb(serial, *args, timeout=90):
    cmd = [ADB] + (['-s', serial] if serial else []) + list(args)
    p = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    return p.returncode, (p.stdout or '').strip(), (p.stderr or '').strip()


def sh(serial, cmdstr, timeout=90):
    return adb(serial, 'shell', cmdstr, timeout=timeout)


def pick_device(want=None):
    _, out, _ = adb(None, 'devices')
    devs = [l.split()[0] for l in out.splitlines()[1:] if l.strip() and l.strip().endswith('device')]
    if want:
        if want not in devs:
            raise SystemExit('设备 %s 不在线，当前：%s' % (want, devs))
        return want
    if not devs:
        raise SystemExit('没有在线设备')
    return devs[0]


def main():
    want = sys.argv[1] if len(sys.argv) > 1 else None
    if not os.path.exists(APK):
        raise SystemExit('先跑 build_gateprobe.py（缺 %s）' % APK)
    serial = pick_device(want)

    _, page, _ = sh(serial, 'getconf PAGE_SIZE')
    _, abi, _ = sh(serial, 'getprop ro.product.cpu.abilist')
    _, sdk, _ = sh(serial, 'getprop ro.build.version.sdk')
    print('== 设备 %s  PAGE_SIZE=%s  abilist=%s  sdk=%s' % (serial, page, abi, sdk))

    print('== 1) 安装')
    rc, out, err = adb(serial, 'install', '-r', '-t', '--no-incremental', APK, timeout=240)
    print('   ' + (out or err).replace('\n', '\n   '))
    if 'Success' not in out:
        raise SystemExit('安装失败：%s' % (err or out))

    print('== 2) 启动探针 Activity')
    sh(serial, 'am force-stop %s' % PKG)
    rc, out, err = sh(serial, 'am start -W -n %s' % ACT)
    print('   ' + (out or err).replace('\n', '\n   '))

    print('== 3) 等结果（最多 20 s）')
    text = ''
    for _ in range(20):
        time.sleep(1)
        _, t, _ = adb(serial, 'shell', 'run-as', PKG, 'cat', 'files/gate_result.txt')
        if 'GATEPROBE END' in t:
            text = t
            break
    if not text:
        _, t, _ = sh(serial, 'logcat -d -s GATEPROBE | tail -60')
        text = t
    print(text.replace('\n', '\n   '))
    if not text.strip():
        raise SystemExit('探针没有产出结果：看 logcat -s GATEPROBE 与 am start 的输出')

    def grab(key):
        m = re.search(r'^%s=(.*)$' % re.escape(key), text, re.M)
        return m.group(1).strip() if m else ''

    domain = grab('domain')
    priv = grab('PRIV_RESULT')
    ext = grab('EXT_RESULT')
    pagesize_seen = grab('pagesize')
    abis = grab('abis')

    ok_domain = 'untrusted_app_27' in domain
    ok_priv = ('exit=0' in priv) and ('AArch64' in priv)
    ok_ext = not (('exit=0' in ext) and ('AArch64' in ext))

    rows = [
        ('Q1 进程域 = untrusted_app_27（与游戏同域）', '包含 untrusted_app_27', domain or '<空>', ok_domain),
        ('Q2 私有目录 exec 64 位', 'exit=0 且输出 AArch64', priv or '<空>', ok_priv),
        ('Q3 外部存储（FUSE noexec）exec 被拒', '失败（非 exit=0/AArch64）', ext or '<空>', ok_ext),
    ]
    for it, ex, ac, ok in rows:
        print('[%s] %s\n       期望：%s\n       实际：%s' % ('PASS' if ok else 'FAIL', it, ex, ac))

    if ok_domain and ok_priv:
        verdict = 'B-I 通过（私有目录可 exec 64 位）→ 按 §6.2 实施'
    elif ok_domain and not ok_priv:
        verdict = 'B-I 否决 → 转 B-II（jniLibs dlopen）；先看 avc 取证'
    elif not ok_domain:
        verdict = '域不对（%s）→ 本结论无效，需换 targetSdk 或直接用主包重测' % (domain or '空')
    else:
        verdict = '证据矛盾 → 先修探针'

    avc = ''
    _, a, _ = sh(serial, 'logcat -d -b all | grep -i "avc.*execute" | tail -6')
    if a:
        avc = a

    lines = [
        '# B0 闸门报告（进程内自测）',
        '',
        '- 时间：%s' % time.strftime('%Y-%m-%d %H:%M:%S'),
        '- 设备：%s（PAGE_SIZE=%s，abilist=%s，sdk=%s，探针 abis=%s）' % (serial, page, abi, sdk, abis),
        '- 探针包：%s' % APK,
        '',
        '## 结论',
        '',
        '**%s**' % verdict,
        '',
        '| 项 | 期望 | 实际 | 判定 |',
        '|---|---|---|---|',
    ]
    for it, ex, ac, ok in rows:
        lines.append('| %s | %s | `%s` | **%s** |' % (it, ex, ac.replace('|', '\\|'), 'PASS' if ok else 'FAIL'))
    lines += ['', '## 完整输出', '', '```', text.strip(), '```', '',
              '## avc（execute 相关）', '', '```', avc or '<none>', '```', '']
    os.makedirs(OUT, exist_ok=True)
    rp = os.path.join(OUT, 'GATE_REPORT.md')
    with open(rp, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print('\n结论：%s\n报告：%s' % (verdict, rp))
    return 0 if (ok_domain and ok_priv) else 2


if __name__ == '__main__':
    sys.exit(main())
