# -*- coding: utf-8 -*-
"""
B1 · node 侧资产树（第三棵树）

产出：`../assets_staging/psnode/`
    ├── ps_server/**            原始 `server/` 副本 + **只保留行为变换**（见下）
    └── tools/
        ├── key_lua/**          协议表
        ├── lua_remote_frame.bin  构建期预生成的 19 MB Lua 整帧
        └── bc_cmp/**           lib.js / grow_data.js 运行期读的 3 个数据表

为什么不能直接拷 `server/`（工作计划.md §0 的 B1 修正、风险 R9b）：
  `prepare_assets.py` 的 7 个机械变换里，有 4 个是**行为/环境适配**，源码里没有，
  直接拷会静默丢掉：
      变换 4  lua_remote.js  → getFrame 优先读预生成帧（否则现场遍历 6860 文件重建，
                               客户端"卡启动中"整族回归）
      变换 5  guide.js       → 组 51 补推 m_goods_bag_info_toc{bag_type:4}（否则引导卡死）
      变换 6  relic_data.js  → 圣器/核心表改读 relic_types_parsed.json（否则运行期正则解析）
      变换 10 vit.js         → 开箱 rid 有效性守卫（否则吞箱 / 发 type_id=0）
  另有 4 个是 **Jint 专用**，node 下带上会直接崩（`__psXor`/`__psLong` 未定义）：
      变换 1 game_server.js（XOR 下沉 C#）、变换 2 etf.js（long → 十进制串）、
      变换 3 act_extra.js（`??` → 三元）、变换 7 BigInt 字面量清理、以及 Babel ES5 转译。

设计取舍：本脚本**不改 prepare_assets.py**（那条流水线在真机上跑着，不动它），
只 import 它的 transform 函数，保证两棵树的补丁口径永远同源。

用法：
    python prepare_node_assets.py                # 构建 + 校验
    python prepare_node_assets.py --no-frame     # 跳过 19 MB 帧生成（快速迭代）
"""
import hashlib
import io
import json
import os
import shutil
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import prepare_assets as PA          # noqa: E402  复用 transform/生成器，口径同源

ROOT = PA.ROOT
SERVER = PA.SERVER
PSLOCAL = PA.PSLOCAL
OUT_ROOT = os.path.join(PSLOCAL, 'assets_staging', 'psnode')
PS_SERVER = os.path.join(OUT_ROOT, 'ps_server')
SKIP_DIRS = ('logs', 'node_modules', 'saves')
EXTRA_FILES = ('accounts.json', 'missions_data.json', 'skin_config.json')

# 只保留这 4 个（行为变换），其余一概不施加
NODE_TRANSFORMS = (
    ('lua_remote.js', PA.transform_lua_remote, '使用预生成帧'),
    (os.path.join('handlers', 'guide.js'), PA.transform_guide, '补推能力核心背包'),
    (os.path.join('data', 'relic_data.js'), PA.transform_relic_data, 'relic_types_parsed.json'),
    (os.path.join('handlers', 'vit.js'), PA.transform_vit, '开箱异常：箱子'),
)

# Jint 桥：出现在 node 树里说明变换方向搞反了，直接崩。
# 允许"守卫形态"：原件里 `if (typeof __psEtf !== 'undefined') { __psEtf.encode(...) }` 是设计好的
# 双引擎分支（有原生加速就用），node 下 typeof 为 undefined 走 JS 分支，安全。
# `__ps_prelude` / `__psBuiltins` 不列：它们只出现在注释与 Jint 专用文件里，不是运行期依赖。
JINT_BRIDGES = ('__psXor', '__psLong', '__psEtf', '__psRun')


def md5(p, n=8):
    h = hashlib.md5()
    with open(p, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()[:n]


def read(p):
    return io.open(p, encoding='utf-8').read()


def write(p, s):
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)


def copy_server_js():
    """与 prepare_assets.py 的同名步骤保持一致的跳过规则。

    注意：**增量覆盖，不整体删目录**。之前用 rmtree 重建，被"批量删除 >50 文件需确认"的
    安全闸门挡住（一次 120 个文件），而且每次全量重拷也没必要。改为 dirs_exist_ok 覆盖 +
    末尾报告"源里已删除但树里还在"的残留，让它们显式暴露而不是悄悄留着。
    """
    copied = []
    for name in os.listdir(SERVER):
        s = os.path.join(SERVER, name)
        if os.path.isdir(s):
            if name in SKIP_DIRS:
                continue
            shutil.copytree(s, os.path.join(PS_SERVER, name), dirs_exist_ok=True)
        elif name == 'accounts.json':
            # 出厂过滤（二百九十三）：只剩 player 账号、lastAccount 清空（与 psroot 树同源）
            PA.ship_accounts_json(os.path.join(PS_SERVER, 'accounts.json'))
            copied.append(name)
        elif name.endswith('.js') or name in EXTRA_FILES:
            shutil.copy2(s, os.path.join(PS_SERVER, name))
            copied.append(name)
    for name in copied:                     # Windows rmtree/重建竞态兜底（同 prepare_assets 注释）
        if name == 'accounts.json':
            continue                        # ship_accounts_json 生成物，与源文件字节数必然不同
        s, d = os.path.join(SERVER, name), os.path.join(PS_SERVER, name)
        for _ in range(3):
            if os.path.getsize(d) == os.path.getsize(s):
                break
            time.sleep(0.4)
            shutil.copy2(s, d)
        assert os.path.getsize(d) == os.path.getsize(s), 'copy size mismatch: ' + name
    os.makedirs(os.path.join(PS_SERVER, 'saves'), exist_ok=True)   # 设备上空存档起步
    return len(copied)


def stale_in_tree():
    """源 server/ 里已删、但树里还留着的 js（构建垃圾，出现就说明需要清理）"""
    src = set()
    for dp, dns, fs in os.walk(SERVER):
        dns[:] = [d for d in dns if d not in SKIP_DIRS]
        for f in fs:
            src.add(os.path.relpath(os.path.join(dp, f), SERVER).replace('\\', '/'))
    dst = set()
    for dp, _, fs in os.walk(PS_SERVER):
        for f in fs:
            dst.add(os.path.relpath(os.path.join(dp, f), PS_SERVER).replace('\\', '/'))
    # 构建期生成物不算残留
    keep = {'data/relic_types_parsed.json'}
    return sorted(dst - src - keep)


def apply_node_transforms():
    """只打 4 个行为变换；每个都做前后断言（锚点漂了要当场炸）"""
    done = []
    for rel, fn, marker in NODE_TRANSFORMS:
        fp = os.path.join(PS_SERVER, rel)
        before = read(fp)
        assert marker not in before, '变换[%s] 标记已存在，锚点重复施加' % rel
        after = fn(before)
        assert marker in after, '变换[%s] 施加后找不到标记 %r —— 函数静默失效' % (rel, marker)
        assert after != before, '变换[%s] 无字节变化' % rel
        write(fp, after)
        done.append(rel)
    return done


def assert_no_jint_bridges():
    """Jint 桥只能以 `typeof __psX !== 'undefined'` 的**守卫形式**出现在原件里
    （etf.js 就这么写的：有原生加速就用，没有就走 JS）。直接调用才是变换方向搞反了。"""
    import re
    hits = []
    for dp, _, fs in os.walk(PS_SERVER):
        for f in fs:
            if not f.endswith('.js'):
                continue
            p = os.path.join(dp, f)
            txt = read(p)
            for b in JINT_BRIDGES:
                if ("typeof %s !== 'undefined'" % b) in txt or ('typeof %s === "undefined"' % b) in txt:
                    continue        # 该文件是"双引擎分支"，node 下自动走 JS 分支
                for m in re.finditer(re.escape(b), txt):
                    head = txt[max(0, m.start() - 9):m.start()]
                    if 'typeof ' in head:
                        continue
                    hits.append('%s:%s' % (os.path.relpath(p, PS_SERVER), b))
                    break
    if hits:
        raise SystemExit('node 树里出现 Jint 桥的直接调用（变换方向搞反了）：\n  ' + '\n  '.join(hits[:10]))
    # 反向断言：etf.js 必须还是 BigInt 版（说明没被变换 2 改成十进制串）
    etf = read(os.path.join(PS_SERVER, 'etf.js'))
    assert '0n' in etf and '__psLong.' not in etf, 'etf.js 不像原始 node 版（BigInt 缺失）'
    return True


def node_check_all():
    bad = []
    files = []
    for dp, _, fs in os.walk(PS_SERVER):
        for f in fs:
            if f.endswith('.js'):
                files.append(os.path.join(dp, f))
    for p in files:
        r = subprocess.run(['node', '--check', p], capture_output=True, text=True)
        if r.returncode != 0:
            bad.append('%s\n%s' % (os.path.relpath(p, PS_SERVER), (r.stderr or '')[:300]))
    if bad:
        raise SystemExit('node --check 失败：\n' + '\n\n'.join(bad[:5]))
    return len(files)


def gen_frame():
    """复用 prepare_assets.py 的同一条 driver（截到 net.createServer 之前，只取 getFrame()）"""
    frame_out = os.path.join(OUT_ROOT, 'tools', 'lua_remote_frame.bin')
    gen = os.path.join(OUT_ROOT, '__gen_frame.js')
    driver = '''
const fs = require('fs');
const path = require('path');
const SRC = %r;
const OUT = %r;
const src = fs.readFileSync(SRC, 'utf8');
const m = src.match(/^.*net\\.createServer/m);
if (!m) throw new Error('marker not found');
const body = src.slice(0, m.index) + '\\nreturn getFrame();\\n';
const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', 'process', 'console', body);
const moduleObj = { exports: {} };
const frame = fn(require, moduleObj, moduleObj.exports, SRC, path.dirname(SRC), process, console);
fs.writeFileSync(OUT, frame);
console.log('frame bytes:', frame.length);
''' % (os.path.join(SERVER, 'lua_remote.js').replace('\\', '/'), frame_out.replace('\\', '/'))
    write(gen, driver)
    r = subprocess.run(['node', gen], capture_output=True, text=True, encoding='utf-8', errors='replace')
    os.remove(gen)
    if r.returncode != 0:
        raise SystemExit('lua frame pregen failed: ' + (r.stderr or r.stdout)[-800:])
    print('   ' + r.stdout.strip())
    return frame_out


def copy_tools():
    """与 psroot 同构：key_lua + bc_cmp 数据表 + 帧。
    注意：**不拷 tools/lua_remote（61 MB）**——预生成帧存在时 getFrame 走 early-return，
    buildData 永不执行；模块顶层只有 `existsSync` 守卫的 fs.watch，目录缺失不报错。"""
    kl = os.path.join(OUT_ROOT, 'tools', 'key_lua')
    shutil.copytree(PA.KEY_LUA, kl, dirs_exist_ok=True)   # 增量覆盖（rmtree 会被安全闸门拦）
    n_kl = sum(len(f) for _, _, f in os.walk(kl))

    n_data = 0
    for rel in (os.path.join('bc_cmp', 'vit_new', 'CfgItems.lua'),
                os.path.join('bc_cmp', 'CfgItems_ljd.lua'),
                os.path.join('bc_cmp', 'grow_parts.json')):
        s = os.path.join(ROOT, 'tools', rel)
        if os.path.isfile(s):
            d = os.path.join(OUT_ROOT, 'tools', rel)
            os.makedirs(os.path.dirname(d), exist_ok=True)
            shutil.copy2(s, d)
            n_data += 1
    # relic_data 的兜底分支要读它（正常情况下走变换 6 的 JSON，读不到才回落）
    src = os.path.join(ROOT, 'tools', 'lua_src', 'CfgItems.lua')
    if os.path.isfile(src):
        d = os.path.join(OUT_ROOT, 'tools', 'lua_src', 'CfgItems.lua')
        os.makedirs(os.path.dirname(d), exist_ok=True)
        shutil.copy2(src, d)
        n_data += 1
    # main_app_data.js（二百七十五）**模块顶层 IIFE** 读 tools/lua_src/CfgMain.lua ——
    # 设备树没带 = node 启动即 ENOENT 静默崩（2026-11-01 pad7 事故：协议表载入后无声死、
    # supervise 反复重启、"未就绪 15s"→回退；Jint 线同点 FATAL）。
    src = os.path.join(ROOT, 'tools', 'lua_src', 'CfgMain.lua')
    if os.path.isfile(src):
        d = os.path.join(OUT_ROOT, 'tools', 'lua_src', 'CfgMain.lua')
        os.makedirs(os.path.dirname(d), exist_ok=True)
        shutil.copy2(src, d)
        n_data += 1
    # 构建期审计：ps_server 运行期读的 tools/ 文件必须都在树里（防同类"PCJS 正常、设备启动即崩"）
    bad = PA.audit_runtime_tool_reads(PS_SERVER, os.path.join(OUT_ROOT, 'tools'))
    if bad:
        raise SystemExit('设备树(node)缺运行期 tools 依赖：\n  ' + '\n  '.join(bad))
    return n_kl, n_data


def main():
    no_frame = '--no-frame' in sys.argv
    os.makedirs(PS_SERVER, exist_ok=True)

    print('== 1) 拷 server/（增量覆盖，跳过 logs/saves/node_modules）')
    n_js = copy_server_js()
    print('   顶层文件 %d 个' % n_js)
    stale = stale_in_tree()
    if stale:
        print('   ⚠️ 树里残留 %d 个源中已删除的文件：%s' % (len(stale), ', '.join(stale[:6])))

    print('== 2) 只施加 4 个行为变换')
    for rel in apply_node_transforms():
        print('   ✓ ' + rel)

    print('== 3) 预生成圣器/核心表')
    PA.generate_relic_types_json(os.path.join(PS_SERVER, 'data', 'relic_types_parsed.json'))

    print('== 4) 反向校验：不得有 Jint 桥')
    assert_no_jint_bridges()
    print('   ✓ 无 __psXor/__psLong/__psEtf 等；etf.js 仍为 BigInt 版')

    print('== 5) 语法校验（node --check）')
    n_checked = node_check_all()
    print('   ✓ %d 个 js 全过' % n_checked)

    # 帧必须先于 copy_tools 的运行期审计生成——审计把 lua_remote_frame.bin 当必带依赖
    # （旧环境靠持久 staging 掩盖了次序问题，全新目录首跑即报缺，2026-11-08 新仓首跑实证）
    frame = None
    frame_path = os.path.join(OUT_ROOT, 'tools', 'lua_remote_frame.bin')
    if no_frame:
        if os.path.isfile(frame_path):
            frame = frame_path      # 复用上一轮产物（manifest 要如实记录，否则 B1 验收无从核对）
            print('   --no-frame：复用已有帧 %d B' % os.path.getsize(frame))
        else:
            print('   --no-frame：无帧，运行期会回退到现场构建')
    else:
        frame = gen_frame()

    print('== 6) tools/')
    n_kl, n_data = copy_tools()
    print('   key_lua %d 文件，数据表 %d 个' % (n_kl, n_data))

    print('== 7) 写 manifest')
    total = sum(len(f) for _, _, f in os.walk(OUT_ROOT))
    size = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(OUT_ROOT) for f in fs)
    manifest = {
        'built_at': time.strftime('%Y-%m-%d %H:%M:%S'),
        'source_head': subprocess.run(['git', 'rev-parse', '--short', 'HEAD'],
                                      cwd=ROOT, capture_output=True, text=True).stdout.strip(),
        'transforms': [r for r, _, _ in NODE_TRANSFORMS],
        'skipped_transforms': ['1 xor', '2 etf-long', '3 act_extra-??', '7 bigint', 'babel-es5'],
        'js_files': n_checked,
        'frame': os.path.basename(frame) if frame else None,
        'frame_md5': md5(frame) if frame else None,
        'lua_remote_tree': False,
        'files': total,
        'bytes': size,
        'key_md5': {
            'ps_server/etf.js': md5(os.path.join(PS_SERVER, 'etf.js')),
            'ps_server/lua_remote.js': md5(os.path.join(PS_SERVER, 'lua_remote.js')),
            'ps_server/handlers/guide.js': md5(os.path.join(PS_SERVER, 'handlers', 'guide.js')),
            'ps_server/data/relic_data.js': md5(os.path.join(PS_SERVER, 'data', 'relic_data.js')),
            'ps_server/handlers/vit.js': md5(os.path.join(PS_SERVER, 'handlers', 'vit.js')),
        },
    }
    with io.open(os.path.join(OUT_ROOT, 'NODE_TREE.json'), 'w', encoding='utf-8', newline='\n') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print('\n产物：%s' % OUT_ROOT)
    print('   文件 %d 个，%.1f MB（psbin 另计）' % (total, size / 1048576.0))
    print('   manifest：NODE_TREE.json')
    return 0


if __name__ == '__main__':
    sys.exit(main())
