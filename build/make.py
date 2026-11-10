#!/usr/bin/env python3
"""make.py —— apkbuild 的唯一构建入口（跨引擎：Jint + node）。

为什么要有这个脚本：四步的**顺序不能错**，而错法都是"静默失败"。

  1) prepare_assets.py   → 生成/刷新两棵资产树 + SeedStamp.g.cs（含 DefaultEngine）
  1b) lua_frame_audit.py → **帧体积闸门**：数据区 ≥ 1e8 直接失败（客户端读不了，见脚本头注释）
  1c) lua_surface_diff.py→ **导出面闸门**：明文补丁漏掉原 bc 的导出函数即失败
  2) dotnet build         → 把 SeedStamp 编进 PsLocalServer.dll
  3) build_standalone_apk → 打包（含 Manifest 权限手术）+ 签名
  4) audit_apk_permissions.py → **权限闸门**：成品 uses-permission 必须 == 白名单 7 条

经典错法：
  · 先 build 再 prepare → DLL 里是**旧 SeedVersion**，设备不重播种，改了 JS 却跑旧代码；
  · 只跑 prepare 不跑 node 树 → node 线跑旧代码（现已由 prepare_assets 内部自动修复）；
  · 忘了 FZZL_KS_PASS → 打包到最后一步才报错，白等 5 分钟解压。

用法：
  python make.py                # 全量：两棵树 + DLL + 出包（需 FZZL_KS_PASS）
  python make.py --dry-run      # 只检查前置并打印将要执行的命令
  python make.py --skip-node    # 只重建 Jint 树（改客户端 Lua 补丁时够用，快 ~2 分钟）
  python make.py --no-package   # 只到 DLL，不出包（PC 测试/改 C# 时用）
  python make.py --testhost     # 额外编译 PC 测试宿主 TestHost
"""
import os
import subprocess
import sys

# Windows 中文控制台（cp936/GBK）无法编码 '⓪' 等符号：print 会直接抛
# UnicodeEncodeError，构建入口在打印步骤清单时就崩，还没开始编译。
# 保留控制台原编码，只把不可编码字符替换成 '?'（不影响任何构建行为）。
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(errors='replace')
    except Exception:
        pass

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)                 # 工作区根 H:\ARK NEW
PY = sys.executable
# 两个 python 步骤都加 -S：本仓脚本**只用标准库**，跳过 site 初始化可以绕开
# 某些环境里 sitecustomize 注入的"批量删除确认"钩子（它会卡住 prepare_assets 的 rmtree）。


STEPS = []          # (标题, cwd, argv, 是否必需)


def need(path, what):
    return (path, what, os.path.exists(path))


def preflight(do_package):
    print('== 前置检查')
    checks = [
        need(os.path.join(ROOT, 'tools', 'fzzl_lua_signed.apk'), '基座 APK'),
        need(os.path.join(ROOT, 'fzzl', 'assets', 'bin', 'Data', 'Managed', 'Assembly-CSharp.dll'), '游戏托管 DLL'),
        need(os.path.join(HERE, 'out', 'logoFirst.asset.patched'), 'logo 替换资产（out/）'),
        need(os.path.join(ROOT, 'tools', 'fzzl.keystore'), '签名 keystore'),
    ]
    bad = []
    for path, what, ok in checks:
        print('   %s %s  %s' % ('OK  ' if ok else 'MISS', what, path))
        if not ok:
            bad.append(what)
    if do_package and not os.environ.get('FZZL_KS_PASS'):
        print('   MISS 环境变量 FZZL_KS_PASS（签名口令）')
        bad.append('FZZL_KS_PASS')
    return bad


def main():
    args = sys.argv[1:]
    dry = '--dry-run' in args
    skip_node = '--skip-node' in args
    no_pkg = '--no-package' in args
    with_th = '--testhost' in args

    steps = [
        ('⓪ 客户端 Lua 树装配（钉住 bc 校验 + client/ 补丁覆盖 → tools/lua_remote）',
         HERE, [PY, '-u', '-S', 'client_assembly.py']),
        ('① 资产树（Jint' + ('＋node' if not skip_node else '') + '）+ 播种指纹',
         os.path.join(HERE, 'pslocal', 'scripts'),
         [PY, '-u', '-S', 'prepare_assets.py'] + (['--skip-node'] if skip_node else [])),
        # ①b 闸门：帧数据区不能逼近 1e8 —— LuaRemoteSocket 把 (偏移, 长度) 塞进一个 long，
        #     偏移 ≥ 1e8 会把文件读成错位内容（不报错、随机语法错），且远程模式无 AB 回落。
        #     放在打包之前：宁可构建失败，也不出一个"上线才炸、报错指不到原因"的包。
        ('①b Lua frame size gate (LuaRemoteSocket 1e8 offset limit)',
         os.path.join(ROOT, 'gates'),
         [PY, '-u', '-S', 'lua_frame_audit.py']),
        # ①c 闸门：明文补丁不得漏掉原 bc 的导出函数。
        #     漏一个不报语法错，只在某条调用链走到它时 attempt to call a nil value，
        #     而且崩在别人的 require/回调链中间（132 / 七十五 / NetWaitPanel 三例）。
        #     口径：补丁可以多函数（新增补丁入口），不能少。
        ('①c Export-surface gate (patch vs original bc exports)',
         os.path.join(ROOT, 'gates'),
         [PY, '-u', '-S', 'lua_surface_diff.py', '--quiet']),
        # ①d 闸门：effect 的 src_id / id 必须在客户端 FightFeature 表内。
        #     客户端 showFeature:97 对 src_type=1 的 src_id 传第二参 true → 缺表就 printError
        #     「不存在的特性ID：N」（2026-10-27 元素精灵 10382/10378 刷屏真机工单）；
        #     dealFeatureEff:145 对每条 effect 的 id **无条件** true → 任何 src_type 下 id 缺表都报。
        #     服务端自造 effect 时极易把技能 id 当特性 id，静态拦住比等玩家截图快。
        ('①d Feature id gate (effect.src_id / effect.id must be in client table)',
         os.path.join(ROOT, 'gates'),
         ['node', 'audit_feature_src_ids.js', '--fail']),
        # ①e 闸门：desc-AOE 族 —— 描述承诺敌方全体、effType 单体的攻击技必须有实现。
        #     这类技能官方靠特判实现，服务端只按 effType 展开就永远只命中 1 人且完全静默
        #     （2026-10-28「敌人的 aoe 只会打到一个人」工单：米迦勒 10243 天国复仇，
        #     少女终末 13 图敌人可放）。判据：敌人可施放 ∧ 无实现标记 → ERROR。
        ('①e desc-AOE gate (single-target skill promising AoE must have impl)',
         os.path.join(ROOT, 'gates'),
         ['node', 'audit_desc_aoe.js', '--fail']),
        # ①f 闸门：商店下发的 type_id 必须能被客户端解析。
        #     客户端 ShopItemCommonVO 的 GOODS/GIFTS/SERVANT **三条分支第一步都是 fillCommonItemVO
        #     → ItemConfig.getItemVO(typeID)**（只有 SKIN/RECHARGE 不查）；裸誓灵 type 不在 CfgItems
        #     ⇒ 「道具不存在：ID=1835001」刷屏 + 空壳 VO(类默认 typeId=0) 连锁再报 ID=0。
        #     誓灵商品的官方形态是**誓灵凭证（30000000+type）**（二百七十二 苍色的试炼兑换屋真机工单）。
        ('①f Shop type_id gate (must be in client CfgItems / CfgServantSkin)',
         os.path.join(ROOT, 'gates'),
         ['node', 'audit_shop_typeids.js']),
        # ①g 闸门：grantGoods 必须透传 conn（第 3 参）。
        #     代币分支（30000000+type）靠 conn 3s 宣告 m_servant_update_toc，称号盒分支（25001xxx）
        #     靠 conn 同步推 m_role_title_update_toc——漏传即**静默入档**，玩家领了/研究完了不给，
        #     重登才补见（二百七十七：ark 54004 特殊召唤：加塔诺托亚 / dare 首通「从前那个」称号盒）。
        #     两个分支对普通物品零影响 ⇒ 透传永远安全，不透传只在数据表扩进代币/称号盒时爆炸。
        ('①g grantGoods conn gate (token announce / title push, no exemption)',
         os.path.join(ROOT, 'gates'),
         ['node', 'audit_grant_goods_conn.js']),
        # ①h 闸门：出货源树不得内嵌公网 IP 字面量（二百九十一）。
        #     日志上传已"去公网 IP 存储化"：地址只应存在于管理员嘴里与上传者当场输入；
        #     任何回到仓库的硬编码（源码/extcfg 底稿/查看器默认值）都等于把接收器
        #    （弱 key + 玩家日志）暴露给所有拿到包/仓库的人。只认两种地址形态
        #    （https?://IP 与 IP:端口；裸 IP 版本号样不拦），私保网段豁免（10.0.2.2/127.0.0.1
        #     合法），lua/cs/json/md 四通道故障注入自检内置，命中即禁止出包。
        ('①h Public-IP gate (no hardcoded public address in shipped trees)',
         os.path.join(ROOT, 'gates'),
         ['node', 'audit_no_hardcoded_addr.js']),
        # ①i 闸门：无限领域下发的敌方 type 必须 ∈ 真机 CfgServant。
        #     `m_tower_barrier_detail_toc.monster[{id=type}]` → 客户端 TowerEnemyInfoVO.fillData
        #     第一步就是 `ServantConfig.getFieldByTypeId(type,"talent")`：type 不存在则
        #     printError「不存在的誓灵ID：X」→ getTalentVO(nil) → 下一行
        #     `TalentVO:0: attempt to index a nil value` ⇒ 整条 toc 抛错，
        #     玩家点"关卡信息/战斗结果"直接吃崩溃日志（不进战斗，只在查看时炸）。
        #     2026-11-05 实锤：ENEMY_POOL 的 1431012 真机不存在，18/23/28… 共 74 层受影响。
        #     数据源 = 已入库的真机同步表 servant_types.js（**勿用滞后快照 lua_src**：
        #     它只有 282 条，会把合法的 1341033 误判成非法）。
        ('①i Tower enemy type gate (must be in device CfgServant)',
         os.path.join(ROOT, 'gates'),
         ['node', 'audit_tower_enemy_types.js', '--fail']),
        ('② 编译 PsLocalServer（把 SeedStamp 编进 DLL）',
         os.path.join(HERE, 'pslocal', 'PsLocalServer'),
         ['dotnet', 'build', '-v', 'q', '--nologo']),
    ]
    if with_th:
        steps.append(('②b 编译 TestHost（PC 测试宿主）',
                      os.path.join(HERE, 'pslocal', 'TestHost'),
                      ['dotnet', 'build', '-v', 'q', '--nologo']))
    if not no_pkg:
        # ②c 应用图标档位：webp 解码要 Pillow（site-packages），**必须无 -S**——
        #   打包步骤 ③ 在 -S 下跑，只读本步预生成的 out/icons/（见 make_icon_set.py 头注释）。
        steps.append(('②c 应用图标档位（方舟指令3.webp → out/icons/，需 Pillow 无 -S）',
                      HERE, [PY, '-u', 'make_icon_set.py']))
        # ③ 经典两件套形态（三百二十定论）：出货 res 全量 ~4.7GB 单 ZIP 装不下（经典 ZIP 上限
        #   4.294GB；deflate 后 4.47GB 仍超；ZIP64 安装支持 Android 15+ 被否；壳/尾部拼接同样
        #   撞墙）——保留 alpha + fzzl_data.apk 两包，配套"缺数据包拒启动"闸门（DataPackage）。
        steps.append(('③ 打包 + 签名',
                      HERE, [PY, '-u', '-S', 'build_standalone_apk.py']))
        # ④ 出货包权限闸门（二百九十五）：签名后成品的 uses-permission 必须恰好等于
        #     白名单 7 条（口径见 patch_manifest_perms.py）。打包脚本内部已在写盘后
        #     fail-fast 复审过一次；这里审的是最终签名产物——防 zipalign/签名环节被
        #     换包、防有人绕过打包脚本手工重打。多一条直接失败。
        steps.append(('④ 出货包权限闸门（Manifest 白名单 7 条）',
                      HERE, [PY, '-u', '-S', 'audit_apk_permissions.py']))

    bad = preflight(not no_pkg)
    print()
    for title, cwd, argv in steps:
        print('   %s' % title)
        print('     cd %s && %s' % (cwd, ' '.join(argv)))
    if bad:
        print('\n== 前置缺失：%s' % '、'.join(bad))
        return 2
    if dry:
        print('\n== --dry-run：未执行')
        return 0

    for title, cwd, argv in steps:
        print('\n== %s' % title, flush=True)
        r = subprocess.call(argv, cwd=cwd)
        if r != 0:
            print('\n== 失败（exit=%d）：%s' % (r, title))
            return r
    print('\n== 全部完成：%s' % os.path.join(HERE, 'out', 'fzzl_standalone_alpha.apk'))
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
