# -*- coding: utf-8 -*-
"""
准备嵌入式服务端资产（只读引用工作文件，产出落在本目录）：
  ../testroot/psroot/            PC 测试宿主用的虚拟根（与设备播种后的 <persist>/psroot 同构）
  ../assets_staging/psroot/      打 APK 时塞进 assets/ 的同一棵树

对 server JS 副本的机械变换（原件不动）：
  1) etf.js          decodeLong/encodeLong → 十进制字符串表示（Jint 2.x 无 BigInt；精度无损）
  2) game_server.js  decryptXor → C# 下沉（__psXor.decrypt）；plain[0] → plain.at(0)
  3) act_extra.js    唯一一处 `??` 空值合并 → 三元表达式
  4) act_extra.js    登录时先下发 m_role_acts_toc（活动状态表）再推积分信息
  5) guide.js        组51 上报时补推 m_goods_bag_info_toc{bag_type:4}（能力核心面板数据兜底）
  9) relic_data.js   预解析圣器与核心表 → relic_types_parsed.json（消除运行期缺失外部源码导致的圣器池为空）
  10) vit.js         openRelicBox 道具合法性校验（防 roll 出无效道具导致吞箱或向客户端发 type_id=0）
"""
import os
import re
import shutil
import io
import time
import json
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PSLOCAL = os.path.dirname(HERE)
ROOT = os.path.dirname(os.path.dirname(PSLOCAL))  # H:\ARK NEW

SERVER = os.path.join(ROOT, 'server')
KEY_LUA = os.path.join(ROOT, 'tools', 'key_lua')
LUA_REMOTE = os.path.join(ROOT, 'tools', 'lua_remote')

TARGETS = {
    'testroot': os.path.join(PSLOCAL, 'testroot', 'psroot'),
    'assets': os.path.join(PSLOCAL, 'assets_staging', 'psroot'),
}


def _scan_bigint_literals(text):
    """扫描真正的 BigInt 字面量（形如 数字+n），用"引号奇偶"启发式跳过字符串内的文本。

    Jint 2.11 无 BigInt：漏一个就模块加载即崩，所以必须 fail-fast；
    但 PCJS 代码里出现的 '12n' 这类**字符串**不是字面量，不能误报挡住同步。
    """
    import re as _re2
    hits = []
    for ln, line in enumerate(text.split("\n"), 1):
        for m in _re2.finditer(r'(?<![\w.$])\d+n(?![\w])', line):
            pre = line[:m.start()]
            if pre.count("'") % 2 or pre.count('"') % 2:
                continue   # 在引号内 → 是字符串内容，不是字面量
            hits.append('%d:%s' % (ln, m.group()))
    return hits


def _must_replace(text, old, new, expect, tag):
    """P0-1 变换断言：锚点命中数不符即构建失败。

    为什么必须断言：这些变换是为了让 PCJS 的代码能在 Jint 2.11 上跑而做的机械改写。
    一旦 PCJS 侧改动了被打锚点的那段代码，静默失配会让单机版带着**原始 PCJS 代码**跑
    （或半截变换），症状是"某个流程莫名卡住/崩"，而日志可能完全干净 —— 属于最难查的一类。
    失配就报错并指向 PCJS同步方案.md §2.1 的差异契约表。
    """
    got = text.count(old)
    if got != expect:
        raise SystemExit(
            'prepare_assets: 变换[%s] 锚点命中 %d 次（期望 %d）' % (tag, got, expect) + "\n" +
            '  => PCJS 侧这段代码变了。请更新该变换的锚点，并把新差异登记到 ' + "\n" +
            '     apkbuild/PCJS同步方案.md §2.1 差异契约表。' + "\n" +
            '  锚点首行: ' + old.strip().splitlines()[0][:100])
    return text.replace(old, new)


def copy_tree(src, dst, skip_dirs=('logs',)):
    if not os.path.isdir(dst):
        shutil.copytree(src, dst, ignore=shutil.ignore_patterns(*skip_dirs))
    return dst


# ---- 二百九十三：出厂只带 player 一个已知账号/存档，且不预填账号名 ----
# 开发机 server/ 下的账号库是"活库"（探针/GM 测试随时建新账号），不能直接进包；
# 这里在打包侧统一过滤，开发机怎么脏都出干净的包。设备侧语义（BootPipeline）：
# 升级重播种不覆盖设备 accounts.json 与玩家自建存档 ⇒ 过滤只影响全新安装。
SHIP_ACCOUNT = 'player'          # 出厂唯一已知账号（开发主测试存档）
SHIP_LAST_ACCOUNT = ''           # 出厂不预填账号名：玩家必须手动输入，登录/注册一次后记住


def ship_accounts_json(dst):
    """server/accounts.json → 过滤成只剩 player 账号、lastAccount 清空的出厂账号库。

    player 账号缺失 = 出厂包没有已知存档可带，直接构建失败（宁可炸也别静默出空包）。
    salt/hash 字段剥掉（二百九十三去密码：出厂账号不携带口令字段）。
    """
    src = os.path.join(SERVER, 'accounts.json')
    with io.open(src, encoding='utf-8') as f:
        d = json.load(f)
    accounts = d.get('accounts') or {}
    if SHIP_ACCOUNT not in accounts:
        raise SystemExit(
            'ship_accounts_json: server/accounts.json 里没有 "%s" 账号 —— '
            '出厂唯一已知存档缺失，拒绝出包（先恢复账号库或改 SHIP_ACCOUNT）' % SHIP_ACCOUNT)
    acc = dict(accounts[SHIP_ACCOUNT])
    acc.pop('salt', None)
    acc.pop('hash', None)
    out = {
        'version': d.get('version', 1),
        'lastAccount': SHIP_LAST_ACCOUNT,
        'accounts': {SHIP_ACCOUNT: acc},
    }
    with io.open(dst, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    return out


def ship_player_save(dst_dir):
    """只带 saves/player.json 一个存档（其余测试/探针档不出厂）。"""
    src = os.path.join(SERVER, 'saves', 'player.json')
    if not os.path.isfile(src):
        raise SystemExit(
            'ship_player_save: server/saves/player.json 不存在 —— '
            '出厂唯一已知存档缺失，拒绝出包')
    os.makedirs(dst_dir, exist_ok=True)
    dst = os.path.join(dst_dir, 'player.json')
    shutil.copy2(src, dst)
    return dst


def audit_runtime_tool_reads(ps_server_dir, tools_dir):
    """扫描树内 ps_server/**/*.js 里 `path.join(__dirname, '..'[,'..'], 'tools', ...)` 形态的
    运行期文件读取，断言目标在 <root>/tools/ 下存在；返回缺失清单（空 = 通过）。
    起因（2026-11-01 pad7 事故）：main_app_data.js **模块顶层 IIFE** 读 tools/lua_src/CfgMain.lua，
    设备树没带 ⇒ node/Jint 启动即 ENOENT 静默崩（node 的 stderr 不进 psnode_stdout.log，
    表现为"未就绪 15s"→回退→Jint 同点 FATAL；PCJS 永不复现，仓库里文件在）。
    豁免：'lua_remote' 前缀（预生成帧 early-return，源树按设计不带，见 4.0 注）。"""
    bad = []
    call = re.compile(r"path\.join\(__dirname,([^)]*)\)", re.S)
    for dirpath, _, files in os.walk(ps_server_dir):
        for fn in files:
            if not fn.endswith('.js'):
                continue
            p = os.path.join(dirpath, fn)
            try:
                txt = io.open(p, encoding='utf-8', errors='replace').read()
            except OSError:
                continue
            for m in call.finditer(txt):
                segs = re.findall(r"'([^']+)'", m.group(1))
                if 'tools' not in segs:
                    continue
                tail = segs[segs.index('tools') + 1:]
                if not tail or tail[0] == 'lua_remote':
                    continue
                cand = os.path.join(tools_dir, *tail)
                if not os.path.exists(cand):
                    bad.append('%s -> tools/%s' % (os.path.relpath(p, ps_server_dir), '/'.join(tail)))
    return bad


def transform_game_server(text):
    # 1) XOR 解密下沉
    old_fn = re.search(r'function decryptXor\(payload, seq\) \{.*?\n\}', text, re.S).group(0)
    new_fn = ('function decryptXor(payload, seq) {\n'
              '  // 单机版：XOR 循环下沉到 C#（Jint 解释器跑逐字节循环太慢）\n'
              '  return __psXor.decrypt(payload, seq);\n'
              '}')
    text = _must_replace(text, old_fn, new_fn, 1, '1a game_server.decryptXor')
    # 2) 索引读取 → 方法
    text = _must_replace(text, "if (plain.length < 2 || plain[0] !== 131) plain = payload;",
                         "if (plain.length < 2 || plain.at(0) !== 131) plain = payload;",
                         1, '1b game_server.plain.at(0)')
    return text


def transform_etf(text):
    # decodeLong / encodeLong → 十进制字符串表示
    old_decode = re.search(r'function decodeLong\(r, large\) \{.*?\n\}', text, re.S).group(0)
    new_decode = '''function decodeLong(r, large) {
  const count = large ? r.i32() : r.u8();
  const sign = r.u8();
  const bytes = [];
  for (let i = 0; i < count; i++) bytes.push(r.u8());
  // 单机版：long 以十进制字符串表示（Jint 无 BigInt；uid 精度无损）
  return __psLong.fromBytes(bytes, sign);
}'''
    text = _must_replace(text, old_decode, new_decode, 1, '2a etf.decodeLong')

    old_encode = re.search(r'function encodeLong\(w, v\) \{.*?\n\}(?=\n\nmodule\.exports)', text, re.S).group(0)
    new_encode = '''function encodeLong(w, v) {
  // 单机版：接受 string/number（十进制字符串为规范表示）
  if (v === undefined || v === null) v = 0;
  const s = typeof v === 'string' ? v : String(v);
  if (__psLong.inInt32(s)) {
    const n = Number(s);
    if (n >= 0 && n <= 255) { w.byte(SMALL_INT).byte(n); return; }
    w.byte(INT).i32(n);
    return;
  }
  const neg = __psLong.isNeg(s);
  const bytes = __psLong.bytesLE(s);
  if (bytes.length <= 255) {
    w.byte(SMALL_BIG).byte(bytes.length).byte(neg ? 1 : 0);
    for (const b of bytes) w.byte(b);
  } else {
    w.byte(LARGE_BIG).i32(bytes.length).byte(neg ? 1 : 0);
    for (const b of bytes) w.byte(b);
  }
}'''
    text = _must_replace(text, old_encode, new_encode, 1, '2b etf.encodeLong')

    # 两处 BigInt() 调用点
    text = _must_replace(text, "encodeLong(w, v === undefined || v === null ? 0n : BigInt(v));",
                         "encodeLong(w, v === undefined || v === null ? 0 : v);", 1, '2c etf.encodeLong-调用点1')
    text = _must_replace(text, "encodeLong(w, BigInt(item) || 0n);",
                         "encodeLong(w, item || 0);", 1, '2d etf.encodeLong-调用点2')
    return text


def transform_act_extra(text):
    text = _must_replace(text,
                         "const left = (pl.items[g.id] ?? g.num) - (pl.drawn[g.id] || 0);",
                         "const left = ((pl.items[g.id] !== undefined && pl.items[g.id] !== null) ? pl.items[g.id] : g.num) - (pl.drawn[g.id] || 0);",
                         1, '3 act_extra.?? 空值合并')
    # ★ 变换 4（2026-09-23 规范化）：活动状态表 m_role_acts_toc 已由 role.js 登录链路统一推齐，
    #   原 act_extra.js 中盲推星梦积分的循环彻底移除，避免新手引导期刷屏报错及频繁事件广播。
    return text


def transform_guide(text):
    """变换 5（2026-09-16）：组51 主动补推能力核心背包（见 patches/guide_core_bag_push.js 注释）。"""
    patch = io.open(os.path.join(PSLOCAL, 'patches', 'guide_core_bag_push.js'), encoding='utf-8').read()
    fn_anchor = "function handleGuideDo(conn, obj) {"
    if fn_anchor not in text:
        raise SystemExit('prepare_assets: 变换 5 锚点未命中（handleGuideDo 被改过？）')
    text = text.replace(fn_anchor, patch, 1)
    call_anchor = "  if (group === 40 && st()) ensureGuideBox(conn);"
    if call_anchor not in text:
        raise SystemExit('prepare_assets: 变换 5 调用点锚点未命中')
    text = text.replace(call_anchor,
                        call_anchor + "\n  if (group === 51 && st()) ensureCoreBagPush(conn); // 变换 5",
                        1)
    return text


def transform_lua_remote(text):
    # 4) Lua 帧构建下沉：getFrame 优先读构建期预生成帧
    #    （Jint 2.11 解释执行 buildData 的 6860 文件遍历 + 290 万次前缀合成 ≈ 90s+，真机更慢
    #     会把客户端拉包卡在启动画面；node 构建期只要 ~9s，产物与运行期逐字节等价）
    old = "function getFrame() {\n  if (cachedFrame) return cachedFrame;\n"
    new = ("function getFrame() {\n"
           "  if (cachedFrame) return cachedFrame;\n"
           "  // 单机版：构建期预生成帧优先（见 prepare_assets.py 步骤 4.1；缺文件时回退运行期构建）\n"
           "  const pre = path.join(__dirname, '..', 'tools', 'lua_remote_frame.bin');\n"
           "  if (fs.existsSync(pre)) {\n"
           "    cachedFrame = fs.readFileSync(pre);\n"
           "    log(`[lua-remote] 使用预生成帧 ${cachedFrame.length}B`);\n"
           "    return cachedFrame;\n"
           "  }\n")
    assert old in text, 'lua_remote getFrame pattern not found'
    return text.replace(old, new)


def transform_relic_data(text):
    # 变换 9：单机版预解析圣器与核心表（消除运行期缺失外部源码导致的圣器池为空）
    old_block = re.search(r'const RELIC_CORE_TYPES = \(\(\) => \{.*?\n\}\)\(\);', text, re.S).group(0)
    new_block = ('// 单机版：预解析圣器与核心表（构建期由 prepare_assets.py 从 CfgItems.lua 提好，避免运行期读外部文件与正则卡顿）\n'
                 'const RELIC_CORE_TYPES = (() => {\n'
                 '  try {\n'
                 "    const p = path.join(__dirname, 'relic_types_parsed.json');\n"
                 "    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));\n"
                 '  } catch (e) {}\n'
                 '  return {};\n'
                 '})();')
    return _must_replace(text, old_block, new_block, 1, '9 relic_data.RELIC_CORE_TYPES')


def transform_vit(text):
    # 变换 10：开箱有效性防护，避免 roll 出无效道具导致吞箱或向客户端发 type_id=0
    old = "    const rid = guideFixed || r.typeId;\n    const bt = bagTypeOf(rid);"
    new = ("    const rid = guideFixed || r.typeId;\n"
           "    if (!rid || !Number(rid)) {\n"
           "      log(`[bag] 开箱异常：箱子 ${typeId} roll 出无效道具 rid=${rid}，停止且不吞箱`);\n"
           "      break;\n"
           "    }\n"
           "    const bt = bagTypeOf(rid);")
    return _must_replace(text, old, new, 1, '10 vit.openRelicBox-rid-guard')


def generate_relic_types_json(out_path):
    driver = (
        'const fs = require("fs");\n'
        'const rd = require("%s");\n'
        'const keys = Object.keys(rd.RELIC_CORE_TYPES);\n'
        'if (keys.length < 170) { console.error("RELIC_CORE_TYPES too small:", keys.length); process.exit(1); }\n'
        'fs.writeFileSync("%s", JSON.stringify(rd.RELIC_CORE_TYPES, null, 2));\n'
        'console.log("   relic types parsed: " + keys.length + " items");\n'
    ) % (
        os.path.join(SERVER, 'data', 'relic_data.js').replace('\\', '/'),
        out_path.replace('\\', '/')
    )
    r = subprocess.run(['node', '-e', driver], capture_output=True, text=True, encoding='utf-8', errors='replace')
    if r.returncode != 0:
        raise SystemExit('generate_relic_types_json failed: ' + (r.stderr or r.stdout))
    print(r.stdout.strip())



BOOT_JS = r'''// 嵌入式单机服务端启动脚本（apkbuild/pslocal/scripts/boot.js）
// 装配逻辑与 start.js 完全一致；端口/地址固定为设备回环，三个服务同进程。
// 与 start.js 的差异：不依赖 Proxy（把兜底 handler 预填充到每个 *_tos），不跑端口预检。
const { startGameServer } = require('./game_server');
const { startHttpRouter } = require('./http_router');
const { useAccount } = require('./state');
const ACC = require('./accounts');
const L = require('./lib');

L.log.banner();

const tBoot = Date.now();
const tMark = function (s) { L.log.db('[boot-t] ' + s + ' @' + (Date.now() - tBoot) + 'ms'); };
tMark('boot start');
// 协议表由 prepare_assets 在构建期解析为 JSON（Jint 2.11 解释执行 lua 正则解析太慢）
var __parsed = JSON.parse(__fs.readFileSync('/ps_server/protos_parsed.json', 'utf8'));
var protos = __parsed.protos, alias = __parsed.alias, byId = __parsed.byId;
tMark('协议表载入 ' + Object.keys(protos).length + ' 个消息');

const HTTP_PORT = parseInt(process.env.HTTP_PORT || '8081', 10);
const GAME_PORT = parseInt(process.env.GAME_PORT || '9021', 10);
const HOST_IP = process.env.HOST_IP || '127.0.0.1';

// 通用兜底：任何未处理的 *_tos 若存在同名 *_toc 则回默认填充；否则 m_common_reply_toc。
function fallbackHandler(name) {
  const toc = name.replace(/_tos$/, '_toc');
  if (toc !== name && protos[toc]) {
    return conn => conn.sendToc(toc, L.defaultFill(toc));
  }
  return conn => conn.sendToc('m_common_reply_toc', { proto_id: 0 });
}

const handlers = Object.assign({},
  require('./handlers/role').handlers,
  require('./handlers/servant').handlers,
  require('./handlers/bag').handlers,
  require('./handlers/map_fight').handlers,
  require('./handlers/dorm').handlers,
  require('./handlers/activity').handlers,
  require('./handlers/act_extra').handlers,
  require('./handlers/relic').handlers,
  require('./handlers/family').handlers,
  require('./handlers/shop').handlers,
  require('./handlers/vit').handlers,
  require('./handlers/ark').handlers,
  require('./handlers/altar').handlers,
  require('./handlers/handbook').handlers,
  require('./handlers/story_reward').handlers,
  require('./handlers/feeling').handlers,
  require('./handlers/summon').handlers,
  require('./handlers/dream').handlers,
  require('./handlers/achievement').handlers,
  require('./handlers/daily_copy').handlers,
  require('./handlers/dare').handlers,
  require('./handlers/tower').handlers,
  require('./handlers/guide').handlers,
  require('./handlers/grow').handlers,
  require('./handlers/moment').handlers,
  require('./handlers/collab').handlers,
  require('./handlers/faith').handlers,
  require('./handlers/rank').handlers, // 排行榜（工作日志 2026-09-17（七十六））：m_rank_get_info/rank + friend_info；start.js 也是 faith 后装配
);

// 预填充兜底（替代 start.js 的 Proxy）：任何能解析出来的 *_tos 都有 handler
let fallbackN = 0;
for (const name in protos) {
  if (!name.endsWith('_tos')) continue;
  if (handlers[name]) continue;
  handlers[name] = fallbackHandler(name);
  fallbackN++;
}

const arkMod = require('./handlers/ark');
const towerMod = require('./handlers/tower');

const ctx = {
  protos, alias, byId, log: L.log,
  hostIp: HOST_IP,
  gamePort: GAME_PORT,
  onHeartbeat: conn => {
    arkMod.settleExpiredQueue(conn);
    try { towerMod.autoFightTick(conn); } catch (e) { L.log('!! 塔自动战斗 tick 失败', e.message); }
  },
  handlers,
};

tMark('handlers 装配完成');
L.log.ok('注册 ' + Object.keys(handlers).length + ' 个 handler（其中兜底 ' + fallbackN + ' 个）');

tMark('ACC 前');
ACC.bootstrap();
tMark('ACC bootstrap 完成');
const bootAcc = ACC.bootAccount();
tMark('bootAccount 完成');
useAccount(bootAcc);
L.log.db('账号库 ' + ACC.list().length + ' 个账号，当前存档 ' + (bootAcc ? bootAcc.name : '(无)'));

let readyCount = 0;
const t0 = Date.now();
const onReady = () => {
  if (++readyCount < 2) return;
  L.log.ok('单机服务端就绪（HTTP ' + HTTP_PORT + ' + GAME ' + GAME_PORT + ' + LUA 44587）');
  PS.notifyReady({ http: HTTP_PORT, game: GAME_PORT, handlers: Object.keys(handlers).length, ms: Date.now() - t0 });
};
const onListenError = (role, info) => {
  L.log.err('[net] ' + role + ' 启动失败: ' + (info && info.title ? info.title : '未知'));
};

startHttpRouter(HTTP_PORT, ctx, onReady, info => onListenError('HTTP', info));
startGameServer(GAME_PORT, ctx, onReady, info => onListenError('GAME', info));

// ★ 2026-09-17 v4：启动顺序铁律——44587（Lua 通道）必须在 HTTP 与 GAME 都 attach 之后才 attach。
//   客户端 Lua 只有收到 19MB 帧才会启动（LuaLoadComplete → 登录链），启动期最早被 44587 的
//   attach 卡住；若 lua_remote 先起来，客户端 Lua 会在 boot.js 的 http/game 还没就绪时提前
//   boot，登录链（ps_account / GetServerNotice / GetAccountNode → 9021）打到 prebind 挂起队列，
//   超过客户端 10s 守卫（NetWaitPanel）→ 启动期弹"网络较差/重新连接"（2026-09-17 根治的竞态）。
//   挪到最后一行：客户端最早能拿到帧的时刻，http/game 早已 attach，登录链零等待、弹窗不可能出现。
require('./lua_remote'); // 顶层执行即启动 44587（fs.watch 为空实现，无热重建）
'''


def main():
    for tag, psroot in TARGETS.items():
        print('== building', tag, '->', psroot)
        ps_server = os.path.join(psroot, 'ps_server')
        if os.path.isdir(ps_server):
            shutil.rmtree(ps_server)
            time.sleep(0.5)  # Windows：rmtree 异步删除 + 立即重建会出现 delete-pending 竞态（0 字节文件）
        os.makedirs(ps_server, exist_ok=True)

        # 1) server JS（含 data/handlers 子目录；跳过 logs/saves）
        copied = []
        for name in os.listdir(SERVER):
            s = os.path.join(SERVER, name)
            if os.path.isdir(s):
                if name in ('logs', 'node_modules', 'saves'):
                    continue
                shutil.copytree(s, os.path.join(ps_server, name))
            elif name.endswith('.js'):
                shutil.copy2(s, os.path.join(ps_server, name))
                copied.append((s, os.path.join(ps_server, name)))
            elif name in ('missions_data.json', 'skin_config.json'):
                # accounts.json 不在这里拷：走下面的 ship_accounts_json 过滤（二百九十三）
                shutil.copy2(s, os.path.join(ps_server, name))
                copied.append((s, os.path.join(ps_server, name)))
        # 拷贝完整性校验（防 delete-pending 竞态复发）
        for s, d in copied:
            for attempt in range(3):
                if os.path.getsize(d) == os.path.getsize(s):
                    break
                time.sleep(0.5)
                shutil.copy2(s, d)
            assert os.path.getsize(d) == os.path.getsize(s), 'copy size mismatch: ' + d
        # 账号库与存档：打包侧过滤（二百九十三）——出厂只带 player 一个已知账号/存档，
        # lastAccount 清空 ⇒ 全新安装登录框不预填。开发机的测试账号/探针档一律不进包。
        ship_accounts_json(os.path.join(ps_server, 'accounts.json'))
        ship_player_save(os.path.join(ps_server, 'saves'))

        # 2) 变换（先读后写两步分开 —— 一行式求值顺序是先截断再读，读到空文件）
        def rewrite(rel, fn):
            fp = os.path.join(ps_server, rel)
            text = io.open(fp, encoding='utf-8').read()
            io.open(fp, 'w', encoding='utf-8', newline='\n').write(fn(text))
        rewrite('game_server.js', transform_game_server)
        rewrite('etf.js', transform_etf)
        rewrite(os.path.join('handlers', 'act_extra.js'), transform_act_extra)
        rewrite(os.path.join('handlers', 'guide.js'), transform_guide)
        rewrite('lua_remote.js', transform_lua_remote)
        rewrite(os.path.join('data', 'relic_data.js'), transform_relic_data)
        rewrite(os.path.join('handlers', 'vit.js'), transform_vit)

        # 2.3) 预生成圣器与核心表（构建期提取 CfgItems.lua，供 relic_data.js 秒级加载）
        generate_relic_types_json(os.path.join(ps_server, 'data', 'relic_types_parsed.json'))

        # 2.2) BigInt 字面量清理（Jint 2.11/Babel ES5 均不支持 n 后缀）
        #      lib.js:69 roleId → 字符串（与 long-字符串规范一致）；:269 精度安全的 Number 运算
        def bigint_map(t):
            # 变换 7：BigInt 字面量清理（Jint 无 BigInt）。命中数 0 是允许的（该文件可能没有这两处），
            # 但**一旦出现新的 `\d+n` 字面量就必须显式登记**（见 PCJS同步方案.md §5.4 扫描）。
            for old_, new_, tag in (('const roleId = 6000355922n;', "const roleId = '6000355922';", '7a roleId'),
                                    ('BigInt(sid) * 100000n', 'Number(sid) * 100000', '7b BigInt(sid)')):
                n = t.count(old_)
                if n > 1:
                    raise SystemExit('prepare_assets: 变换[%s] 锚点出现 %d 次（应为 0 或 1）' % (tag, n))
                t = t.replace(old_, new_)
            leftover = _scan_bigint_literals(t)
            if leftover:
                raise SystemExit('prepare_assets: 变换[7] 仍残留 BigInt 字面量 %s —— '
                                 'Jint 无 BigInt，模块会加载即崩；请加进变换 7 并登记到 '
                                 'PCJS同步方案.md §2.1' % (leftover[:5],))
            return t
        rewrite('lib.js', bigint_map)
        rewrite(os.path.join('handlers', 'relic.js'), bigint_map)
        rewrite(os.path.join('handlers', 'faith.js'), bigint_map)

        # 2.4) boot.js 必须在 Babel 之前落盘（它本身也是 ES6 源码，要一起转译）
        io.open(os.path.join(ps_server, 'boot.js'), 'w', encoding='utf-8', newline='\n').write(BOOT_JS)

        # 2.5) Babel 转译 ES5（Jint 2.11 只认 ES5；游戏托管层是 .NET 2.0/3.5 世代 profile）
        #      输出到临时目录再整体覆盖 —— 原地转译时 babel 会因 mtime 相同跳过部分文件
        import subprocess
        node = 'node'
        transpile_js = os.path.join(PSLOCAL, 'babel', 'transpile.js')
        r = subprocess.run([node, transpile_js, ps_server], capture_output=True, text=True, encoding='utf-8', errors='replace')
        print(r.stdout[-500:] if r.stdout else '')
        if r.returncode != 0:
            print(r.stderr[-2000:])
            raise SystemExit('babel failed')
        print('   babel es5 ok')

        # 2.6) 模块注册文件（Jint 2.11 的 Engine.Invoke 不支持 CLR 回调中再入引擎，
        #      C# CommonJS 加载器不可用；且 4MB 单文件 Execute 会栈溢出 —— 拆成
        #      prelude + 每模块一个小脚本 + 启动行，由 JsHost 按清单逐个 Execute）
        import json as _json
        count = 0
        modlist = ['/ps_server/__ps_prelude.js']
        for dirpath, _, files in os.walk(ps_server):
            for fn in sorted(files):
                if not fn.endswith('.js'):
                    continue
                fp = os.path.join(dirpath, fn)
                rel = os.path.relpath(fp, ps_server).replace('\\', '/')
                name = '/ps_server/' + rel
                src_code = io.open(fp, encoding='utf-8').read()
                def_js = "__psDef(" + _json.dumps(name) + ", function (exports, require, module, __filename, __dirname) {\n" + src_code + "\n});"
                def_name = '__ps_m%04d.js' % count
                io.open(os.path.join(ps_server, def_name), 'w', encoding='utf-8', newline='\n').write(def_js)
                modlist.append('/ps_server/' + def_name)
                count += 1
        io.open(os.path.join(ps_server, '__ps_bootrun.js'), 'w', encoding='utf-8', newline='\n').write("__psRun('/ps_server/boot.js');")
        modlist.append('/ps_server/__ps_bootrun.js')
        io.open(os.path.join(ps_server, '__ps_modlist.txt'), 'w', encoding='utf-8', newline='\n').write('\n'.join(modlist))

        # 4) tools/key_lua + lib.js 运行时读取的 bc_cmp 数据表
        kl = os.path.join(psroot, 'tools', 'key_lua')
        if os.path.isdir(kl):
            shutil.rmtree(kl)
        shutil.copytree(KEY_LUA, kl)

        # 2.6.5) key_lua 必须先于 2.7 就位——proto 预解析（lib.js 同理）读 psroot/tools/key_lua；
        #        旧环境靠持久 staging 掩盖了次序问题，全新目录首跑即 ENOENT（2026-11-08 新仓首跑实证）
        # 2.7) 构建期预解析协议表（Jint 2.11 解释执行 lua 正则解析 >5 分钟 → JSON.parse 秒级）
        proto_gen_parts = [
            'const fs = require("fs"); ',
            'const __pp = require("' + os.path.join(ps_server, "proto.js").replace(chr(92), "/") + '"); ',
            'const r = __pp.load("' + os.path.join(psroot, "tools", "key_lua").replace(chr(92), "/") + '"); ',
            'fs.writeFileSync("' + os.path.join(ps_server, "protos_parsed.json").replace(chr(92), "/") + '", JSON.stringify(r)); ',
            'console.log("protos:", Object.keys(r.protos).length);',
        ]
        proto_gen = ''.join(proto_gen_parts)
        gen_fp = os.path.join(psroot, '__gen_proto.js')
        io.open(gen_fp, 'w', encoding='utf-8', newline='\n').write(proto_gen)
        pr = subprocess.run(['node', gen_fp], capture_output=True, text=True, encoding='utf-8', errors='replace')
        print('   proto parse: ' + (pr.stdout.strip() or pr.stderr.strip()[-200:]))
        if pr.returncode != 0:
            raise SystemExit('proto pregen failed')

        # prelude：注册表 + 纯 JS require + builtins 表 + ES5 迭代辅助
        prelude = r"""var __psRegistry = {};
var __psLoaded = {};
var __psBuiltins = { fs: __fs, path: __path, net: __net, http: __http, zlib: __zlib, crypto: __crypto, url: { URL: function (u, b) { return __psUrlCreate(u, b); } }, child_process: __cpmod, events: {}, os: {} };
function __psDef(name, fn) { __psRegistry[name] = fn; }
function __psJoin(dir, spec) {
  var parts = (dir + spec).split('/');
  var out = [];
  for (var i = 0; i < parts.length; i++) {
    var seg = parts[i];
    if (seg === '' || seg === '.') continue;
    if (seg === '..') { if (out.length > 0) out.pop(); continue; }
    out.push(seg);
  }
  return '/' + out.join('/');
}
function __psResolve(p) {
  if (__psRegistry[p] !== undefined) return p;
  if (__psRegistry[p + '.js'] !== undefined) return p + '.js';
  if (__psRegistry[p + '/index.js'] !== undefined) return p + '/index.js';
  return null;
}
var __psBootCount = 0;
var __psBootTotal = 0;
function __psBootTick(name) {
  // v5 精确进度：懒执行（bootrun 的 require 链逐个跑模块体 + handler 装配）在 ARM 上约 15s，
  // 是"启动内置服务端"段最大的平台期。每次真实执行一个模块体就上报一次（0.96→0.99）。
  __psBootCount++;
  if (__psBootTotal === 0) { try { __psBootTotal = Object.keys(__psRegistry).length; } catch (e) { __psBootTotal = 1; } }
  if (typeof PS !== 'undefined' && PS.progress) {
    try { PS.progress('装配 server 模块 ' + __psBootCount + '/' + __psBootTotal,
      Math.min(0.99, 0.96 + 0.03 * (__psBootCount / (__psBootTotal > 0 ? __psBootTotal : 1)))); } catch (e) { }
  }
}
function __psRun(name) {
  if (__psLoaded[name] !== undefined) return __psLoaded[name].exports;
  var fn = __psRegistry[name];
  if (fn === undefined) throw new Error('Cannot find module ' + name);
  __psBootTick(name);
  var mod = { exports: {} };
  __psLoaded[name] = mod;
  var dir = name.slice(0, name.lastIndexOf('/') + 1) || '/';
  var req = function (spec) {
    if (spec.charAt(0) === '.') {
      var targetPath = __psJoin(dir, spec);
      var t = __psResolve(targetPath);
      if (t === null) {
        if (spec.slice(-5) === '.json') {
          return JSON.parse(__fs.readFileSync(targetPath, 'utf8'));
        }
        throw new Error("Cannot find module '" + spec + "' (from " + name + ")");
      }
      return __psRun(t);
    }
    var b = __psBuiltins[spec];
    if (b === undefined) throw new Error('Unknown builtin module ' + spec);
    return b;
  };
  var t0 = Date.now();
  req.main = null; // Node 语义：非入口模块；防 require.main === module 自测块误执行
  fn.call(mod.exports, mod.exports, req, mod, name, dir);
  __psLoaded[name] = mod;
  if (Date.now() - t0 > 300) console.log('[slow-mod] ' + name + ' ' + (Date.now() - t0) + 'ms');
  return mod.exports;
}"""
        io.open(os.path.join(ps_server, '__ps_prelude.js'), 'w', encoding='utf-8', newline='\n').write(prelude)
        print('   modules: %d' % count)

        # 4.0) **不再打包 tools/lua_remote 源树（61 MB）**。
        #      运行期只有 server/lua_remote.js 读它，且只走 buildData()/readContent() ——
        #      预生成帧命中时 getFrame() 直接 early-return，buildData 永不执行；
        #      模块顶层的 fs.watch 被 existsSync 守卫（Jint 侧 fs.watch 本身也是空实现）。
        #      帧由下面的 4.1 从**源码树**生成，不依赖这份副本。
        #      ⚠️ 清理老构建的副本用 **改名移出**，不要 rmtree：本机删 7000 个小文件要 40 分钟
        #      （实测 ~4 个/秒），而同一分区 rename 是瞬时的。移出的目录在 _trash/ 下，不进包。
        lr = os.path.join(psroot, 'tools', 'lua_remote')
        if os.path.isdir(lr):
            trash_dir = os.path.join(PSLOCAL, '_trash')
            os.makedirs(trash_dir, exist_ok=True)
            dst = os.path.join(trash_dir, 'lua_remote_%s_%d' % (tag, int(time.time())))
            shutil.move(lr, dst)
            print('   移出旧 lua_remote 源树 → ' + dst)
        # 4.1) Lua 帧构建期预生成（Jint 2.11 跑 buildData 要 90s+，node 只要 ~9s）
        #      用 server/lua_remote.js 原件的 buildData/getFrame（与运行期逐字节等价；
        #      运行期 getFrame 已由 transform_lua_remote 改为优先读这个文件）
        frame_out = os.path.join(psroot, 'tools', 'lua_remote_frame.bin')
        gen = os.path.join(psroot, '__gen_frame.js')
        driver = '''
const fs = require('fs');
const path = require('path');
const SRC = %r;
const OUT = %r;
const src = fs.readFileSync(SRC, 'utf8');
// 截到 net.createServer 之前（去掉 listen/watch 段；__dirname 传 server/ 使 ROOT 指向真 lua_remote 源）
const m = src.match(/^.*net\\.createServer/m);
if (!m) throw new Error('marker not found');
const body = src.slice(0, m.index) + '\\nreturn getFrame();\\n';
const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', 'process', 'console', body);
const moduleObj = { exports: {} };
const frame = fn(require, moduleObj, moduleObj.exports, SRC, path.dirname(SRC), process, console);
fs.writeFileSync(OUT, frame);
console.log('frame bytes:', frame.length);
''' % (os.path.join(SERVER, 'lua_remote.js').replace('\\', '/'), frame_out.replace('\\', '/'))
        io.open(gen, 'w', encoding='utf-8', newline='\n').write(driver)
        fr = subprocess.run(['node', gen], capture_output=True, text=True, encoding='utf-8', errors='replace')
        print('   lua frame: ' + (fr.stdout.strip() or fr.stderr.strip()[-300:]))
        if fr.returncode != 0:
            raise SystemExit('lua frame pregen failed')
        os.remove(gen)
        # lib.js:183-184 —— 道具产出表（vit 扣体力/研究所产出用）+ 换装部件表（grow_data.js 商城部件）
        # （lua_src/CfgItems.lua = lib.js 兜底链第三候选，psnode 树本来就带，psroot 对齐——审计要求全带）
        for rel in (os.path.join('bc_cmp', 'vit_new', 'CfgItems.lua'),
                    os.path.join('bc_cmp', 'CfgItems_ljd.lua'),
                    os.path.join('bc_cmp', 'grow_parts.json'),
                    os.path.join('lua_src', 'CfgItems.lua')):
            s = os.path.join(ROOT, 'tools', rel)
            d = os.path.join(psroot, 'tools', rel)
            if os.path.isfile(s):
                os.makedirs(os.path.dirname(d), exist_ok=True)
                shutil.copy2(s, d)
        # main_app_data.js（二百七十五）**模块顶层** 读 tools/lua_src/CfgMain.lua ——
        # 设备树没带 = Jint/node 启动即 ENOENT（2026-11-01 pad7 事故），与 CfgItems.lua 同规格补带
        s = os.path.join(ROOT, 'tools', 'lua_src', 'CfgMain.lua')
        d = os.path.join(psroot, 'tools', 'lua_src', 'CfgMain.lua')
        if os.path.isfile(s):
            os.makedirs(os.path.dirname(d), exist_ok=True)
            shutil.copy2(s, d)

        # 构建期审计：ps_server 运行期读的 tools/ 文件必须都在树里（防同类"PCJS 正常、设备启动即崩"）
        bad = audit_runtime_tool_reads(os.path.join(psroot, 'ps_server'), os.path.join(psroot, 'tools'))
        if bad:
            raise SystemExit('设备树(Jint)缺运行期 tools 依赖：\n  ' + '\n  '.join(bad))

        print('   files:', sum(len(f) for _, _, f in os.walk(psroot)))

    # 3) node 树（B 线）：必须在 write_seed_stamp 之前——
    #    SeedStamp.DefaultEngine 是按"有没有 assets_staging/psnode"判定的，
    #    先生成指纹再生成树，会让 B7 的默认引擎永远停在 jint。
    #    这一步同时堵住一个静默坑：只跑 prepare_assets 不跑 node 树时，
    #    server/ 改了但设备仍在跑旧 node 代码（症状=改了没效果）。
    if '--skip-node' not in sys.argv:
        import prepare_node_assets as PNA     # 惰性导入：本模块已加载完，不构成循环
        print('== building node tree ->', PNA.OUT_ROOT)
        PNA.main()
    else:
        print('   （--skip-node：跳过 node 树）')

    write_seed_stamp()
    print('done')


def write_seed_stamp():
    """P0-2：由 psroot 内容指纹自动派生 SeedVersion（消除"忘记 bump"这个静默坑）。

    SeedVersion 决定设备是否重新播种 67MB 内置资产。手工常量一旦忘记更新，
    设备会继续跑**旧 JS**：日志一切正常、行为却是旧的 —— 排查时会怀疑人生
    （2026-09-16 就差点栽在这）。改为内容指纹后：
      · PCJS 改了任何影响资产的代码 → 指纹必变 → 设备自动重播种；
      · 没改 → 指纹不变 → 不会白播种。
    排除项：logs/（运行期产物）、saves/ 与 accounts.json（设备侧受保护、不覆盖）、.seeded。
    """
    import hashlib
    root = TARGETS['assets']
    skip_prefix = ('ps_server/logs/', 'ps_server/saves/')
    h = hashlib.sha1()
    n_files = 0
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
            n_files += 1
    ver = 'auto-' + h.hexdigest()[:12]
    # 默认引擎：有 psnode 树就默认 node（B 线包），否则 jint。**必须编译期定死**——
    # Bootstrap.Init 在最早时机要决定"要不要预绑定 8081/9021/44587"，那时 extcfg 还没生成、
    # APK 也还没播种，唯一可靠的信号就是打包时到底有没有放 psnode。
    psnode_tree = os.path.join(PSLOCAL, 'assets_staging', 'psnode', 'ps_server', 'start.js')
    default_engine = 'node' if os.path.isfile(psnode_tree) else 'jint'
    out = os.path.join(PSLOCAL, 'PsLocalServer', 'Boot', 'SeedStamp.g.cs')
    io.open(out, 'w', encoding='utf-8', newline='\n').write(
        '// 自动生成：prepare_assets.py（P0-2 内容指纹 → SeedVersion）。请勿手改。\n'
        '// 指纹覆盖 assets_staging/psroot 下 %d 个文件（排除 logs/、saves/、accounts.json）。\n'
        '// DefaultEngine 由"打包时是否带 assets/psnode"决定（B 线包=node，旧包=jint）。\n'
        'namespace PsLocalServer\n{\n'
        '    public static class SeedStamp\n    {\n'
        '        public const string SeedVersion = "%s";\n'
        '        public const string DefaultEngine = "%s";\n'
        '    }\n}\n' % (n_files, ver, default_engine))
    print('   seed stamp: %s（覆盖 %d 个资产文件，DefaultEngine=%s）' % (ver, n_files, default_engine))
    return ver


if __name__ == '__main__':
    main()
