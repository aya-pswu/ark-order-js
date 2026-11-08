// 远程 Lua 分发服务（LuaRemoteSocket 协议，端口 44587）
// 客户端连接后服务端推送整包：[int32LE 总长][zlib(数据区)]
// 数据区 = [int32LE 总长] + N * [byte 名长][3字节 内容长][名 ASCII][内容]
// 键：文件相对路径（src 优先，bc 兜底） + keymap.json 别名（require 点分路径 -> bc 相对路径）
const net = require('net');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'tools', 'lua_remote');
const SRC_ROOT = path.join(ROOT, 'src');
const BC_ROOT = path.join(ROOT, 'bc');
const KEYMAP = path.join(ROOT, 'keymap.json');
const AUTO = path.join(ROOT, 'auto_aliases.json');
const PORT = parseInt(process.env.LUA_REMOTE_PORT || '44587', 10);

// 双写日志文件（bat 启动时窗口给用户看，文件给协作方看）
const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'lua_remote.log');
function log(...a) {
  const line = new Date().toISOString().slice(11, 23) + ' ' + a.join(' ');
  console.log(line);
  try { fs.mkdirSync(LOG_DIR, { recursive: true }); fs.appendFileSync(LOG_FILE, line + '\n'); } catch (e) {}
}

let cachedFrame = null;

function readContent(rel) {
  // keymap 的 value 不带 .lua 后缀，源/字节码文件都带，两种都试
  for (const base of [SRC_ROOT, BC_ROOT]) {
    for (const suffix of ['', '.lua']) {
      const p = path.join(base, rel + suffix);
      if (fs.existsSync(p)) return fs.readFileSync(p);
    }
  }
  return null;
}

function buildData() {
  const items = new Map(); // key -> content（去重）
  const add = (key, content) => {
    if (key.length > 255 || !content || content.length >= 0xFFFFFF) return;
    items.set(key, content);
  };
  // 1) src 全量（编辑态优先）
  const walk = (dir, rel) => {
    for (const f of fs.readdirSync(dir)) {
      const fp = path.join(dir, f);
      const r = rel ? rel + '/' + f : f;
      if (fs.statSync(fp).isDirectory()) { walk(fp, r); continue; }
      if (!f.endsWith('.lua')) continue;
      add(r.slice(0, -4), fs.readFileSync(fp));
    }
  };
  walk(SRC_ROOT, '');
  const srcCount = items.size;
  // 2) bc 补充（src 没有的）
  const walkBc = (dir, rel) => {
    for (const f of fs.readdirSync(dir)) {
      const fp = path.join(dir, f);
      const r = rel ? rel + '/' + f : f;
      if (fs.statSync(fp).isDirectory()) { walkBc(fp, r); continue; }
      if (!f.endsWith('.lua')) continue;
      const key = r.slice(0, -4);
      if (!items.has(key)) add(key, fs.readFileSync(fp));
    }
  };
  walkBc(BC_ROOT, '');
  // 3) keymap 别名
  let aliasN = 0;
  if (fs.existsSync(KEYMAP)) {
    const km = JSON.parse(fs.readFileSync(KEYMAP, 'utf-8'));
    for (const [alias, rel] of Object.entries(km)) {
      if (!items.has(alias)) {
        const c = readContent(rel);
        if (c) { add(alias, c); aliasN++; }
      }
    }
  }
  // 4) 从 auto_aliases.json（dump_lua_strings.py 用 ljd 从全部字节码字符串常量提取的点分模块名）补全别名
  //    AB 文件布局规则：Modules/A/B/C -> Modules/<a小写>/C.lua（中间段丢弃）；其他根 ToLua/A/B -> ToLua/B.lua
  let autoN = 0;
  const lowerMap = new Map(); // key 小写 -> 原 key
  for (const k of items.keys()) {
    const lk = k.toLowerCase();
    if (!lowerMap.has(lk)) lowerMap.set(lk, k);
  }
  const tryAdd = (slash) => {
    if (items.has(slash)) return false;
    let hit = lowerMap.get(slash.toLowerCase());
    if (hit === undefined) {
      const parts = slash.split('/');
      if (parts.length >= 3) {
        // Modules 根：第二段小写 + 尾段；通用：首段 + 尾段
        const cands = [];
        if (parts[0] === 'Modules') cands.push('Modules/' + parts[1].toLowerCase() + '/' + parts[parts.length - 1]);
        cands.push(parts[0] + '/' + parts[parts.length - 1]);
        for (const c of cands) {
          hit = lowerMap.get(c.toLowerCase());
          if (hit !== undefined) break;
        }
      }
    }
    if (hit !== undefined) { add(slash, items.get(hit)); autoN++; return true; }
    return false;
  };
  if (fs.existsSync(AUTO)) {
    const auto = JSON.parse(fs.readFileSync(AUTO, 'utf-8'));
    const autoNames = Array.isArray(auto) ? auto : (auto.names || []);
    for (const name of autoNames) {
      tryAdd(name.replace(/\./g, '/'));
    }
    // 前缀合成：require(前缀 .. 名) 的运行时拼接（如 ConfigMgr.getConfig 的 "Config/Data/"..name）
    if (auto.prefixes && auto.idents) {
      for (const p of auto.prefixes) {
        for (const id of auto.idents) {
          tryAdd(p + id);
        }
      }
    }
  }
  const chunks = [];
  let total = 4;
  for (const [name, content] of items) {
    const nameBuf = Buffer.from(name, 'ascii');
    const head = Buffer.alloc(4);
    head.writeUInt8(nameBuf.length, 0);
    head.writeUIntLE(content.length, 1, 3);
    chunks.push(head, nameBuf, content);
    total += 4 + nameBuf.length + content.length;
  }
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeInt32LE(total, 0);
  const data = Buffer.concat([lenBuf, ...chunks], total);
  log(`[lua-remote] 打包 src=${srcCount} 总=${items.size} 别名=${aliasN} 自动补全=${autoN} 数据区=${data.length}B`);
  // ⚠️ 偏移上限（2026-10-21 二百零四）：客户端 LuaRemoteSocket 把 (偏移, 长度) 塞进一个 long
  //   —— `pos = len * 100000000 + offset`，读侧 `pos % 1e8` / `pos / 1e8`。
  //   ⇒ **偏移必须 < 1e8**。越界时不会抛异常，而是把帧尾部文件读成"帧开头那份内容、长度 +1"
  //   （静默错位 → 随机语法错 / 模块行为诡异，报错完全指不到这里）。
  //   而且 LuaEngineFileUtils 是 `if (_isReadRemote) … else if …`，**远程模式没有 AB 回落**，
  //   帧里缺名字就是 require 直接失败 —— 所以既不能靠删别名瘦身，也不能靠兜底。
  //   构建期闸门见 tools/lua_frame_audit.py（make.py 步骤 ①b，越界即禁止出包）。
  const OFFSET_LIMIT = 100000000;
  if (data.length >= OFFSET_LIMIT) {
    log(`[lua-remote] ✗✗ 帧数据区 ${data.length}B 已越 1e8 偏移上限 —— 客户端读这份帧会错位！`
      + ` 必须减小帧或改客户端打包算术（tools/lua_frame_audit.py 会拦构建）`);
  } else if (data.length >= OFFSET_LIMIT * 0.9) {
    log(`[lua-remote] ⚠ 帧数据区 ${data.length}B 已用 ${(100 * data.length / OFFSET_LIMIT).toFixed(1)}%`
      + `（上限 ${OFFSET_LIMIT}B，余量 ${((OFFSET_LIMIT - data.length) / 1048576).toFixed(2)}MB）`);
  }
  return data;
}

function getFrame() {
  if (cachedFrame) return cachedFrame;
  const zip = zlib.deflateSync(buildData());
  const head = Buffer.alloc(4);
  head.writeInt32LE(zip.length + 4, 0);
  cachedFrame = Buffer.concat([head, zip]);
  log(`[lua-remote] 帧总长 ${cachedFrame.length}B`);
  return cachedFrame;
}

const server = net.createServer(sock => {
  log(`[lua-remote] 客户端 ${sock.remoteAddress} 连接，推送 Lua 包`);
  // 推完即半关闭：客户端读完包后还会继续 Receive 等下文，
  // 不关连接会一直阻塞到 socket 超时（表现为游戏重启后拉 Lua 长时间卡死）
  try { sock.end(getFrame()); } catch (e) { log('[lua-remote] send err', e.message); }
  sock.on('error', e => log('[lua-remote] sock err', e.message));
  sock.on('close', () => log('[lua-remote] 连接关闭'));
});
server.listen(PORT, '0.0.0.0', () => log(`[lua-remote] 监听 0.0.0.0:${PORT}`));

// 源变化时原子重建缓存
let fsWait = null;
let lastRebuildAt = 0;
const MIN_REBUILD_INTERVAL = 3000;
const watchRoots = [SRC_ROOT, KEYMAP, AUTO];
for (const w of watchRoots) {
  if (!fs.existsSync(w)) continue;
  fs.watch(w, { recursive: true }, () => {
    clearTimeout(fsWait);
    const delay = Math.max(1500, MIN_REBUILD_INTERVAL - (Date.now() - lastRebuildAt));
    fsWait = setTimeout(() => {
      log('[lua-remote] 源变更，重建包');
      try { cachedFrame = null; getFrame(); lastRebuildAt = Date.now(); } catch (e) { log('rebuild err', e.message); }
    }, delay);
  });
}
