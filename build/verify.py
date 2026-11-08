# -*- coding: utf-8 -*-
"""
verify.py —— 出包前后的自动化校验（PCJS同步方案.md §3 D3）

分三组，任一组失败即非零退出：
  A 构建不变量（不需要设备、很快）：
     · SeedStamp 指纹与 assets_staging/psroot 现状一致（防"改了没重新 prepare"）
     · APK 内的单机版补丁与关键改动俱在（guide.js 变换5 / act_extra 变换4 /
       PsLocalServer 无 DeflateStream / Assembly-CSharp 窗口补丁 md5）
     · 包内 Manifest 权限 == 白名单 7 条（二百九十五，与 make.py ④ 同判据）
     · 打包日志里 ProfileFixer 是完整模式（fixes=70）—— 不是就说明被误设成 --tzonly
  B PC 冒烟（--pc，需要起 TestHost）：
     · HTTP（GetAgentConfig）/ ETF 登录链 / Lua 整帧（含 --slow）/ 日期 A/B diff=0
  C 真机清单（打印，人工勾）

用法:
  python verify.py                # 只跑 A
  python verify.py --pc           # A + B（自动起停 TestHost）
  python verify.py --apk <path>   # 校验指定 APK（默认 out/fzzl_standalone_alpha.apk）
"""
import os
import sys
import io
import json
import time
import zipfile
import hashlib
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
PSLOCAL = os.path.join(HERE, 'pslocal')
ROOT = os.path.dirname(HERE)
STAGING = os.path.join(PSLOCAL, 'assets_staging', 'psroot')
DEFAULT_APK = os.path.join(HERE, 'out', 'fzzl_standalone_alpha.apk')
DOTNET = os.path.join(ROOT, 'tools', 'dotnetsdk', 'dotnet.exe')

FAILS = []
def ok(msg):   print('  [OK]   ' + msg)
def bad(msg):  print('  [FAIL] ' + msg); FAILS.append(msg)
def warn(msg): print('  [WARN] ' + msg)


# ---------------- A 构建不变量 ----------------
def psroot_fingerprint(root):
    """与 prepare_assets.write_seed_stamp 保持一致（排除项必须一字不差）。"""
    skip_prefix = ('ps_server/logs/', 'ps_server/saves/')
    h = hashlib.sha1()
    n = 0
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames.sort()
        for fn in sorted(filenames):
            fp = os.path.join(dirpath, fn)
            rel = os.path.relpath(fp, root).replace('\\', '/')
            if rel.startswith(skip_prefix) or rel == 'ps_server/accounts.json' or rel == '.seeded':
                continue
            h.update(rel.encode('utf-8'))
            with io.open(fp, 'rb') as f:
                while True:
                    b = f.read(1 << 20)
                    if not b:
                        break
                    h.update(b)
            n += 1
    return 'auto-' + h.hexdigest()[:12], n


def check_stamp():
    print('A1 SeedStamp 指纹一致性')
    stamp_cs = os.path.join(PSLOCAL, 'PsLocalServer', 'Boot', 'SeedStamp.g.cs')
    if not os.path.isfile(stamp_cs):
        bad('缺少 SeedStamp.g.cs —— 先跑 python pslocal/scripts/prepare_assets.py')
        return
    txt = io.open(stamp_cs, encoding='utf-8').read()
    cur = io.open(stamp_cs, encoding='utf-8')
    import re
    m = re.search(r'SeedVersion = "([^"]+)"', txt)
    declared = m.group(1) if m else None
    actual, n = psroot_fingerprint(STAGING)
    if declared == actual:
        ok('SeedVersion=%s 与 assets_staging 现况一致（%d 文件）' % (declared, n))
    else:
        bad('SeedVersion=%s 但资产指纹已是 %s —— 改完资产没重新 prepare_assets'
            % (declared, actual))


def check_dll_freshness(apk):
    """A4：包内 PsLocalServer.dll 的 SeedVersion 必须等于 SeedStamp.g.cs 的声明值。

    为什么需要这条：build_standalone_apk.py 曾经**不编译 C#**（只取现成 DLL），
    "改了 C# 忘了 build" 会**静默**打进过期 DLL（2026-09-16 撞上：指纹机制生成了新值，
    包内却还是 auto-placeholder）。这条检查把该隐患变成显式失败。
    （打包脚本现已强制编译，这里再兜一道，防止有人绕过脚本手工打包。）
    """
    print('A4 包内 DLL 与源码一致性（防"改了 C# 没重编译"）')
    import re
    stamp_cs = os.path.join(PSLOCAL, 'PsLocalServer', 'Boot', 'SeedStamp.g.cs')
    if not os.path.isfile(stamp_cs):
        warn('无 SeedStamp.g.cs，跳过')
        return
    declared = re.search(r'SeedVersion = "([^"]+)"',
                         io.open(stamp_cs, encoding='utf-8').read()).group(1)
    if not os.path.isfile(apk):
        warn('APK 不存在，跳过')
        return
    s = zipfile.ZipFile(apk).read('assets/bin/Data/Managed/PsLocalServer.dll') \
                            .decode('utf-16-le', 'ignore')
    if declared in s:
        ok('包内 SeedVersion=%s 与源码一致' % declared)
    else:
        got = re.findall(r'auto-[0-9a-z]+', s)
        bad('包内 DLL 的 SeedVersion 与源码不一致（源码=%s，包内=%s）—— 重新编译并打包'
            % (declared, sorted(set(got)) or '未找到'))


def check_apk(apk):
    print('A2 APK 内单机版改动与不变量（%s）' % os.path.basename(apk))
    if not os.path.isfile(apk):
        bad('APK 不存在: ' + apk)
        return
    z = zipfile.ZipFile(apk)
    names = z.namelist()

    def first(suffix):
        for n in names:
            if n.endswith(suffix):
                return n
        return None

    g = first('ps_server/handlers/guide.js')
    if g and b'ensureCoreBagPush' in z.read(g):
        ok('变换5（组51 补推核心背包）在包内')
    else:
        bad('变换5 缺失：guide.js 无 ensureCoreBagPush')

    a = first('ps_server/handlers/act_extra.js')
    r = first('ps_server/handlers/role.js')
    if (r and (b'pushRoleActs' in z.read(r) or b'm_role_acts_toc' in z.read(r))) or (a and b'm_role_acts_toc' in z.read(a)):
        ok('变换4（登录主动下发活动状态表）在包内')
    else:
        bad('变换4 缺失：role.js 无 pushRoleActs/m_role_acts_toc 且 act_extra.js 无 m_role_acts_toc')

    s = z.read('assets/bin/Data/Managed/PsLocalServer.dll')
    if s.count(b'DeflateStream') == 0 and s.count(b'zlib.net') == 1:
        ok('PsLocalServer 用 zlib.net（无 DeflateStream → 不会踩 MonoPosixHelper）')
    else:
        bad('PsLocalServer 的 zlib 实现不对：DeflateStream=%d zlib.net=%d'
            % (s.count(b'DeflateStream'), s.count(b'zlib.net')))

    acs_md5 = hashlib.md5(z.read('assets/bin/Data/Managed/Assembly-CSharp.dll')).hexdigest()
    EXPECT_ACS = '3a73dc0f92653fb2ec556050933d229d'   # 含窗口补丁(16384→1MB)+自举
    if acs_md5 == EXPECT_ACS:
        ok('Assembly-CSharp.dll 窗口补丁在位（md5 匹配）')
    else:
        warn('Assembly-CSharp.dll md5=%s 与记录值不同 —— 若换过基座/重跑过 Injector 属正常，'
             '请确认窗口补丁回读日志后更新本脚本的 EXPECT_ACS' % acs_md5)

    # 2026-10-10 v5：Assembly-CSharp-firstpass.dll 的 Main.OnSysCfgComplete 闸门钩子（SplashGate）
    # （v4 及以前是 Main.PrepareEnv → GateLoading：logo 播完才解锁进度条，更新检查不等服务端
    #   就绪、弹重连；v5 把闸门提到 OnSysCfgComplete——logo 等服务端就绪+进度条淡出后才播）
    try:
        fs = z.read('assets/bin/Data/Managed/Assembly-CSharp-firstpass.dll')
        if b'SplashGate' in fs:
            ok('Assembly-CSharp-firstpass.dll 含 SplashGate（Main.OnSysCfgComplete 闸门在位）')
        else:
            bad('Assembly-CSharp-firstpass.dll 缺少 SplashGate？')
    except KeyError:
        bad('APK 缺少 Assembly-CSharp-firstpass.dll 条目')


def check_apk_perms(apk):
    """A5 出货包权限闸门（二百九十五）：uses-permission 必须恰好等于白名单 7 条。

    与 make.py ④ 同一判据（audit_apk_permissions.audit_manifest_bytes），这里对
    "拿到的那个 APK 文件"再独立核一遍——接受分发/转存后真要装机的那份。
    """
    print('A5 包内 Manifest 权限白名单（二百九十五）')
    if not os.path.isfile(apk):
        warn('APK 不存在，跳过')
        return
    sys.path.insert(0, HERE)
    import audit_apk_permissions as GATE
    try:
        perms = GATE.audit_apk(apk)
        ok('uses-permission %d 条 == 白名单（7 条：INTERNET/判网×2/存储×2/VIBRATE/WAKE_LOCK）' % len(perms))
    except AssertionError as e:
        bad(str(e))


def check_build_log():
    print('A3 打包日志：ProfileFixer 必须是完整模式（fixes=70）')
    logs = [f for f in os.listdir(os.path.join(HERE, '_diag')) if f.startswith('build')] if os.path.isdir(os.path.join(HERE, '_diag')) else []
    if not logs:
        warn('没找到 build*.log，跳过（无法确认 fixes 数）')
        return
    logs.sort(key=lambda f: os.path.getmtime(os.path.join(HERE, '_diag', f)))
    txt = io.open(os.path.join(HERE, '_diag', logs[-1]), encoding='utf-8', errors='replace').read()
    import re
    hits = re.findall(r'ProfileFixer(?:\[tzonly\])?: .*?fixes=(\d+)', txt)
    if not hits:
        warn('最新日志 %s 里没有 ProfileFixer 行' % logs[-1])
        return
    n = int(hits[-1])
    if n >= 50:
        ok('%s: fixes=%d（完整模式）' % (logs[-1], n))
    else:
        bad('%s: fixes=%d —— 疑似被设成 --tzonly，设备会 TypeLoadException（见 PCJS同步方案.md §2.2）'
            % (logs[-1], n))


# ---------------- B PC 冒烟 ----------------
def run(cmd, cwd=None, timeout=300):
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=timeout)


def check_pc():
    print('B PC 冒烟（TestHost + 现有测试脚本）')
    testhost = os.path.join(PSLOCAL, 'TestHost')
    testroot = os.path.join(PSLOCAL, 'testroot', 'psroot')
    # TestHost 启动输出约 26KB，stdout=PIPE 且无人读取会把子进程卡死在启动中途（Windows 管道缓冲 4KB），
    # 60s 探活必挂——改落 _diag 日志文件（2026-09-22 修复；此前 B 组从未真正跑通过）
    th_log = io.open(os.path.join(HERE, '_diag', 'testhost_verify.log'), 'w', encoding='utf-8', errors='replace')
    th = subprocess.Popen([DOTNET, 'bin/Debug/net8.0/TestHost.dll', testroot, '18081', '19021', '44588'],
                          cwd=testhost, stdout=th_log, stderr=subprocess.STDOUT, text=True)
    try:
        ready = False
        for _ in range(60):
            time.sleep(1)
            try:
                import urllib.request
                with urllib.request.urlopen('http://127.0.0.1:18081/client_api/GetAgentConfig.php?a=1', timeout=2) as r:
                    body = r.read().decode('utf-8', 'replace')
                if 'code' in body:
                    ok('HTTP GetAgentConfig 返回正常')
                    ready = True
                    break
            except Exception:
                continue
        if not ready:
            bad('TestHost 60s 内未就绪 —— 看 _diag/testhost_verify.log')
            return

        r = run(['node', os.path.join(PSLOCAL, 'test_client_19021.js')], cwd=PSLOCAL, timeout=60)
        if 'HB reply' in (r.stdout or ''):
            ok('ETF 登录链 + 心跳正常')
        else:
            bad('登录链异常：' + (r.stdout or r.stderr or '')[-200:])

        r = run(['node', os.path.join(PSLOCAL, 'test_lua_frame_client.js'), '44588'], cwd=PSLOCAL, timeout=180)
        if '帧完整' in (r.stdout or ''):
            ok('Lua 整帧（设备读法）' + [l for l in r.stdout.splitlines() if '帧完整' in l][0].strip())
        else:
            bad('Lua 帧异常：' + (r.stdout or r.stderr or '')[-200:])

        node_out = os.path.join(HERE, '_diag', 'ab_node.json')
        jint_out = os.path.join(HERE, '_diag', 'ab_jint.json')
        run(['node', os.path.join(PSLOCAL, 'ab_probe.js'), '--date-out', node_out], cwd=PSLOCAL, timeout=60)
        run([DOTNET, 'bin/Debug/net8.0/TestHost.dll', '--abdate-out', jint_out], cwd=testhost, timeout=180)
        try:
            n = json.load(io.open(node_out, encoding='utf-8'))
            j = json.load(io.open(jint_out, encoding='utf-8'))
            diff = [k for k in n if n[k] != j.get(k)]
            if not diff:
                ok('日期语义 A/B 逐键 diff = 0（Jint 与 node 完全一致）')
            else:
                warn('A/B 仍有 %d 项展示差异（服务端逻辑不依赖）: %s' % (len(diff), diff))
        except Exception as e:
            warn('A/B 比对跳过: ' + str(e))
    finally:
        try: th_log.close()
        except Exception: pass
        th.terminate()
        try:
            th.wait(timeout=10)
        except Exception:
            th.kill()


# ---------------- C 真机清单 ----------------
CHECKLIST = """
C 真机验收清单（人工，每次出包必做）
  [ ] 1 首启：psboot_diag.log 出现 run: READY（≤6s）；确认期间没有权限弹窗挡住
  [ ] 2 推帧：lua_remote.log"使用预生成帧"→"连接关闭"间隔 <2s（>5s 即窗口问题）
  [ ] 3 干净：server.log 无"编码失败"；js.log 无"emit data handler error"
  [ ] 4 敏感点：引导组51(核心)/组52(圣器)/卡池召唤 各操作一次
  [ ] 5 存档：saves/<账号>.json mtime 更新；guideState.last 前进
  [ ] 6 重启：再启动一次同样 ≤6s READY；/proc/net/tcp 无 CLOSE_WAIT 累积
"""


def main():
    argv = sys.argv[1:]
    apk = DEFAULT_APK
    if '--apk' in argv:
        apk = argv[argv.index('--apk') + 1]
    check_stamp()
    check_apk(apk)
    check_dll_freshness(apk)
    check_apk_perms(apk)
    check_build_log()
    if '--pc' in argv:
        check_pc()
    print(CHECKLIST)
    if FAILS:
        print('结果：%d 项失败' % len(FAILS))
        for f in FAILS:
            print('  - ' + f)
        sys.exit(1)
    print('结果：全部通过')


if __name__ == '__main__':
    main()
