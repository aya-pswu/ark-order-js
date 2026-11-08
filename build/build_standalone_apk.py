# -*- coding: utf-8 -*-
"""
单机版 APK（alpha）打包：
  基座 ../tools/fzzl_lua_signed.apk
  + Assembly-CSharp.dll → 注入 PsLocalBoot 的补丁版（RuntimeInitializeOnLoadMethod 自举）
  + assets/bin/Data/Managed/{PsLocalServer,Jint,System.Memory,System.Runtime.CompilerServices.Unsafe}.dll
  + assets/psroot/**（内嵌服务端 JS + 协议表 + lua 树，首启播种到设备持久目录）
  + assets/syscfg.json → Router/NLog/Log → http://127.0.0.1:8081/（设备内置服务端）
  + AndroidManifest.xml → 权限手术：33 条官方在线包声明裁到 7 条白名单（二百九十五，
    patch_manifest_perms.py；签名前 fail-fast 复审，make.py ④ 签名后再审）
  → zipalign + apksigner（tools/fzzl.keystore）→ out/fzzl_standalone_alpha.apk

前置：prepare_assets.py 已跑过；PsLocalServer/TestHost 已 build（bin/Debug/net40 有产物）；
      Injector 已跑过（Assembly-CSharp.dll.patched 与 Assembly-CSharp-firstpass.dll.patched 存在；
      2026-10-10 v5 起 injector 第三参数补丁 firstpass 的 Main.OnSysCfgComplete → Bootstrap.SplashGate
      （logo 前闸门：服务端就绪+进度条淡出后才播 logo；v3/v4 的 PrepareEnv→GateLoading 已废弃）。
"""
import os
import sys
import zipfile
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import patch_manifest_perms as PMP        # 二百九十五：Manifest 权限手术
import audit_apk_permissions as PERM_GATE  # 出包权限闸门（白名单比对核心共用）

PSLOCAL = os.path.join(HERE, 'pslocal')
ROOT = os.path.dirname(os.path.dirname(PSLOCAL))

BASE_APK = os.path.join(ROOT, 'tools', 'fzzl_lua_signed.apk')
MANAGED = os.path.join(ROOT, 'fzzl', 'assets', 'bin', 'Data', 'Managed')
KEYSTORE = os.path.join(ROOT, 'tools', 'fzzl.keystore')
OUT_DIR = os.path.join(HERE, 'out')
STAGING = os.path.join(PSLOCAL, 'assets_staging')
NET462 = os.path.join(PSLOCAL, 'PsLocalServer', 'bin', 'Debug', 'net40device')  # 设备 profile 编译（2026-09-14：引用游戏自带 mscorlib/System/System.Core）
BT = os.path.join(os.environ['LOCALAPPDATA'], 'Android', 'Sdk', 'build-tools', '34.0.0')

APK_UNSIGNED = os.path.join(OUT_DIR, 'fzzl_standalone_unsigned.apk')
APK_SIGNED = os.path.join(OUT_DIR, 'fzzl_standalone_alpha.apk')

def ks_pass():
    """签名口令取自环境变量 FZZL_KS_PASS，不再硬编码（2026-09-30：仓库公开准备）。

    为什么必须从环境变量取：密钥文件 tools/fzzl.keystore 已排除入库（凭据原因），
    口令若留在脚本里，会让"clone 下来不能直接构建"退化成一次只会报 wrong password 的
    沉默失败——报错信息不会告诉你"你没设环境变量"。
    """
    v = os.environ.get('FZZL_KS_PASS')
    if not v:
        sys.exit('缺少环境变量 FZZL_KS_PASS（APK 签名口令）。\n'
                 '  PowerShell: $env:FZZL_KS_PASS = "…"\n'
                 '  cmd:        set FZZL_KS_PASS=…\n'
                 '密钥文件本身需自备并放到 tools/fzzl.keystore（见 README "构建前置"）。')
    return v


REPLACES = [
    ('"Router": "http://web-fzzly.mingchaoyouxi.com/"', '"Router": "http://127.0.0.1:8081/"'),
    ('"NLog": "http://cdh-log.mingchao.com/metl/v1"', '"NLog": "http://127.0.0.1:8081/metl/v1"'),
    ('"Log": "http://cdh-log.mingchaoyouxi.com/metl/v1"', '"Log": "http://127.0.0.1:8081/metl/v1"'),
]

# ---- 应用图标（launcher icon）：基座 10 个 app_icon.png 档位 ← 方舟指令3.webp 重采样 ----
# 基座 manifest 的 application icon/banner 都指向 res/drawable-mdpi-v4/app_icon.png，
# 资源路径不变、只换文件内容 ⇒ resources.arsc 无需动。档位清单来自
# aapt dump badging 的 application-icon-*（6 档密度）+ 包内实测的 sw360dp 四档。
# 档位 PNG 由 make_icon_set.py 预生成到 out/icons/（webp 解码要 Pillow，不能进 -S
# 步骤——与 out/logoFirst.asset.patched 同模式：预生成产物，打包脚本只读）。
ICONS_OUT = os.path.join(OUT_DIR, 'icons')
ICON_DENSITY_SIZES = {
    'drawable-ldpi-v4': 36,
    'drawable-mdpi-v4': 48,
    'drawable-hdpi-v4': 72,
    'drawable-xhdpi-v4': 96,
    'drawable-xxhdpi-v4': 144,
    'drawable-xxxhdpi-v4': 192,
    'drawable-sw360dp-hdpi': 192,
    'drawable-sw360dp-xhdpi': 256,
    'drawable-sw360dp-xxhdpi': 384,
    'drawable-sw360dp-xxxhdpi': 512,
}


def load_icon_replacements():
    """读 out/icons/<bucket>.png（make_icon_set.py 产物）。缺档 fail-fast 不静默跳过。"""
    if not os.path.isdir(ICONS_OUT):
        sys.exit('缺少应用图标档位目录：%s\n  先跑：python apkbuild/make_icon_set.py（需 Pillow，无 -S）' % ICONS_OUT)
    out = {}
    for bucket in ICON_DENSITY_SIZES:
        fp = os.path.join(ICONS_OUT, bucket + '.png')
        if not os.path.isfile(fp) or os.path.getsize(fp) == 0:
            sys.exit('缺少应用图标档位：%s\n  先跑：python apkbuild/make_icon_set.py' % fp)
        with open(fp, 'rb') as f:
            out['res/%s/app_icon.png' % bucket] = f.read()
    return out


def run(cmd, desc):
    print('== ' + desc)
    r = subprocess.run(cmd, env=dict(os.environ, PATH=os.path.join(r'C:\Program Files\Java\jre1.8.0_501\bin') + os.pathsep + os.environ['PATH']))
    if r.returncode != 0:
        sys.exit('FAILED: ' + desc)


def main():
    patched_acs = MANAGED + r'\Assembly-CSharp.dll.patched'
    patched_firstpass = MANAGED + r'\Assembly-CSharp-firstpass.dll.patched'
    logo_first_patched = os.path.join(OUT_DIR, 'logoFirst.asset.patched')  # 2026-09-17：bilibili logo → logo1.png
    dotnet = os.path.join(ROOT, 'tools', 'dotnetsdk', 'dotnet.exe')

    # fail-fast：签名凭据在**开头**就查（连同 C# 产物在位检查）。本脚本要写 ~1.5GB 中间包，
    # 放到签名那一步才报"口令不对"，等于让构建者先白等几分钟。
    _pass = ks_pass()
    if not os.path.isfile(KEYSTORE):
        sys.exit('缺少密钥文件：' + KEYSTORE)

    # ★ 2026-09-16 教训：本脚本原先**只取现成的 net40device/PsLocalServer.dll**，不编译 C#。
    #   于是"改了 C# 却忘了 dotnet build"会**静默**打过期的 DLL —— 本次就撞上一次：
    #   SeedStamp.g.cs 已生成新指纹，包内却还是占位值 auto-placeholder，机制形同虚设。
    #   现在打包前强制编译，DLL 必与源码一致。
    psproj = os.path.join(PSLOCAL, 'PsLocalServer', 'PsLocalServer.csproj')
    print('== build PsLocalServer（保证 DLL 与源码一致）')
    r = subprocess.run([dotnet, 'build', psproj, '-v', 'q'], capture_output=True, text=True, encoding='utf-8', errors='replace')
    if r.returncode != 0:
        sys.exit('PsLocalServer build failed:\n' + (r.stdout or '')[-1500:] + (r.stderr or '')[-1500:])

    for need in (patched_acs, patched_firstpass, logo_first_patched,
             os.path.join(NET462, 'PsLocalServer.dll'), os.path.join(NET462, 'Jint.dll'), STAGING):
        if not os.path.exists(need):
            sys.exit('missing: ' + need)

    # ProfileFixer：把 net40 编译的 DLL 修补到设备老 mono profile（mscorlib 2.0/System.Core 3.5）
    # 可加载的形态。必须先跑（PC 端 .NET 8 对修补后 DLL 前向兼容，TestHost 已验证）。
    fixer_dir = os.path.join(PSLOCAL, 'ProfileFixer')
    fixer_exe = os.path.join(fixer_dir, 'bin', 'Debug', 'net8.0', 'ProfileFixer.exe')
    if not os.path.isfile(fixer_exe):
        print('== build ProfileFixer')
        subprocess.run([dotnet, 'build', os.path.join(fixer_dir, 'ProfileFixer.csproj'), '-v', 'q'], check=True)
    fixed = {}
    fix_tmp = os.path.join(OUT_DIR, 'profilefixed')
    os.makedirs(fix_tmp, exist_ok=True)
    # ★ 设备包必须用【完整模式】（无开关）：fixes=70，含把类型重定向到 System.Core 等
    #   设备 profile（mscorlib 2.0/System.Core 3.5）必需的修正。
    #   ⚠️ 2026-09-16 事故：这里一度被改成 ['--tzonly']（那只是开发时在 PC 上测语义用的模式，
    #   只打 10 处时区补丁）→ 设备少 60 处类型修正 → 起服即 TypeLoadException、卡在自举，
    #   而 PC 侧一切正常（PC 不需要那些修正）。判断依据就看这行日志：
    #   **修完必须看到 fixes=70；看到 fixes=10 就是被改错了。**
    fixer_mode = []
    for name in ('Jint.dll',):  # PsLocalServer 已用设备 DLL 源码级编译，无需 IL 修补
        src = os.path.join(NET462, name)
        dst = os.path.join(fix_tmp, name)
        print('== ProfileFixer', name, ' '.join(fixer_mode))
        r = subprocess.run([fixer_exe, src, dst] + fixer_mode, capture_output=True, text=True, encoding='utf-8', errors='replace')
        print('   ' + (r.stdout.strip() or r.stderr.strip()[-300:]))
        if r.returncode != 0:
            sys.exit('ProfileFixer failed: ' + name)
        # ★ 硬校验（2026-09-16 事故防线）：设备包必须是【完整模式】，fixes 应为 70 左右。
        #   曾误用 --tzonly（fixes=10，那是 PC 测语义用的），设备少 60 处类型修正 →
        #   起服即 TypeLoadException、卡在自举，而 PC 侧完全正常，极难发现。
        import re as _re
        m = _re.search(r'fixes=(\d+)', r.stdout)
        n = int(m.group(1)) if m else -1
        if name == 'Jint.dll' and n < 50:
            sys.exit('ProfileFixer 补丁数异常：%s（fixes=%d）。设备包必须用完整模式（约 70），'
                     '检查 fixer_mode 是否被误设成 --tzonly' % (name, n))
        fixed[name] = dst

    os.makedirs(OUT_DIR, exist_ok=True)
    zin = zipfile.ZipFile(BASE_APK)
    syscfg = zin.read('assets/syscfg.json').decode('utf-8')
    for old, new in REPLACES:
        assert old in syscfg, old
        syscfg = syscfg.replace(old, new)
    assert '"DebugMode": "true"' in syscfg

    print('== 写未签名包（含 psroot 资产，约 1.5GB，需几分钟）')
    icon_map = load_icon_replacements()  # launcher icon：make_icon_set.py 预生成档位
    with zipfile.ZipFile(APK_UNSIGNED, 'w', zipfile.ZIP_DEFLATED) as zout:
        # 自动带齐全部依赖 DLL：bin 下所有 .dll，基座 Managed 里已有的跳过（避免覆盖游戏自带的）
        base_names = set(i.filename for i in zin.infolist())
        new_dlls = {}
        for fn in os.listdir(NET462):
            if not fn.lower().endswith('.dll'):
                continue
            arc = 'assets/bin/Data/Managed/' + fn
            if arc in base_names:
                continue  # 游戏自带同名程序集，不覆盖
            # 已修补的用修补版（fix_tmp 里的同名文件）
            new_dlls[arc] = fixed.get(fn, os.path.join(NET462, fn))
        print('   附加 DLL:', sorted(os.path.basename(v) for v in new_dlls.values()))
        psroot_root = os.path.join(STAGING, 'psroot')

        def add_asset_entry(zout, arcname, fp):
            zout.write(fp, arcname)

        for item in zin.infolist():
            if item.filename.endswith('/'):
                continue
            if item.filename.startswith('META-INF/'):
                continue
            if item.filename == 'assets/syscfg.json':
                zout.writestr(item.filename, syscfg)
            elif item.filename == 'AndroidManifest.xml':
                # 二百九十五：单机包不继承官方在线包的 33 条权限——二进制 AXML 手术，
                # 白名单 7 条（口径与原因见 patch_manifest_perms.py 文件头）。
                mdata, removed = PMP.patch_manifest(zin.read(item.filename))
                print('   AndroidManifest 权限手术: 删 %d 条（33→%d）' % (len(removed), len(PMP.KEEP_PERMISSIONS)))
                zout.writestr(item, mdata)
            elif item.filename == 'assets/bin/Data/Managed/Assembly-CSharp.dll':
                zout.write(patched_acs, item.filename)
            elif item.filename == 'assets/bin/Data/Managed/Assembly-CSharp-firstpass.dll':
                zout.write(patched_firstpass, item.filename)  # 2026-10-10 v5：Main.OnSysCfgComplete → SplashGate
            elif item.filename == 'assets/bin/Data/39a00730784cfb24984c276f8ea8bda5':
                zout.write(logo_first_patched, item.filename)  # 2026-09-17：logoFirst(bilibili) → logo1.png
            elif item.filename in icon_map:
                zout.writestr(item, icon_map.pop(item.filename))  # 应用图标：方舟指令3.webp 重采样版
            elif item.filename in new_dlls:
                add_asset_entry(zout, item.filename, new_dlls.pop(item.filename))
            else:
                zout.writestr(item, zin.read(item.filename))  # 原样搬运（保留原条目元数据）
        if icon_map:
            print('   ⚠ 图标档位在基座缺失（未替换）: %s' % ', '.join(sorted(icon_map)))
        else:
            print('   应用图标: %d 档全部替换（源 方舟指令3.webp）' % len(ICON_DENSITY_SIZES))
        # 新增 Managed dll（基座里没有的文件）
        for name, fp in new_dlls.items():
            add_asset_entry(zout, name, fp)
        new_dlls.clear()
        count = 0
        for dirpath, _, files in os.walk(psroot_root):
            for fn in files:
                fp = os.path.join(dirpath, fn)
                arc = 'assets/psroot/' + os.path.relpath(fp, psroot_root).replace('\\', '/')
                zout.write(fp, arc, compress_type=zipfile.ZIP_STORED)  # 设备端 PsZipReader 仅 STORE
                count += 1
        print('   psroot assets:', count)

        # ---- B 线（node 引擎）：psbin + psnode 树 ----
        # 与 psroot 不同，这两个**必须落内部存储**（/data/user/0/<pkg>/files）：
        #   · /sdcard 是 FUSE noexec → psnode 无法 exec；
        #   · FUSE 上 saveState 148 ms vs /data 5 ms。
        # 播种逻辑见 BootPipeline.SeedNodeIfDevice（前缀 assets/psbin/ 与 assets/psnode/）。
        for sub, label, root in (('psbin', 'psbin', os.path.join(PSLOCAL, 'psbin', 'arm64')),
                                 ('psnode', 'psnode', os.path.join(STAGING, 'psnode'))):
            if not os.path.isdir(root):
                print('   %s assets: 0（未构建，B 线包不完整）' % label)
                continue
            n = 0
            total = 0
            for dirpath, _, files in os.walk(root):
                for fn in files:
                    fp = os.path.join(dirpath, fn)
                    arc = 'assets/%s/' % sub + os.path.relpath(fp, root).replace('\\', '/')
                    zout.write(fp, arc, compress_type=zipfile.ZIP_STORED)
                    n += 1
                    total += os.path.getsize(fp)
            print('   %s assets: %d 个 / %.1f MB' % (label, n, total / 1048576.0))
    zin.close()

    # fail-fast：签 1.5GB 包要几分钟，权限不对就别浪费这段时间（二百九十五）。
    # make.py ④ 会在签名后的成品上再跑一次闸门，这里是同一判据的提前挡板。
    try:
        perms = PERM_GATE.audit_apk(APK_UNSIGNED)
        print('== 权限闸门（签名前 fail-fast）：%d 条 == 白名单' % len(perms))
    except AssertionError as e:
        sys.exit('权限闸门失败：%s' % e)

    run([os.path.join(BT, 'zipalign.exe'), '-f', '4', APK_UNSIGNED, APK_UNSIGNED + '.aligned'], 'zipalign 4')
    run([os.path.join(BT, 'apksigner.bat'), 'sign',
         '--ks', KEYSTORE, '--ks-pass', 'pass:' + _pass, '--ks-key-alias', 'fzzl',
         '--out', APK_SIGNED, APK_UNSIGNED + '.aligned'], 'apksigner sign')
    run([os.path.join(BT, 'apksigner.bat'), 'verify', '--print-certs', APK_SIGNED], 'apksigner verify')

    for f in (APK_UNSIGNED, APK_UNSIGNED + '.aligned'):
        if os.path.isfile(f):
            os.remove(f)
    size = os.path.getsize(APK_SIGNED)
    print()
    print('产物: ' + APK_SIGNED)
    print('体积: {:,} bytes ({:.2f} GB)'.format(size, size / 1e9))


if __name__ == '__main__':
    main()
