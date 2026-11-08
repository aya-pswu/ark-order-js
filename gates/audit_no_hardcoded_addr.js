#!/usr/bin/env node
// ①h 出厂闸门（二百九十一，2026-11-01）：出货源树不得内嵌公网 IP 字面量。
//
// 背景：运行日志上传已"去公网 IP 存储化"——地址只应存在于管理员嘴里与上传者当场输入，
// 接收器地址一旦回到仓库（源码/extcfg 底稿/文档默认值），随包/随仓库分发出去就等于把
// 接收器（弱 key + 玩家日志）暴露给所有拿到它的人。本闸门在出厂前静态拦截。
//
// 口径：
//   * 扫描树：tools/lua_remote/src/**、server/**、apkbuild/pslocal/**、cloud/log_receiver/**
//   * 排除目录：node_modules/.git/received/obj/bin/out/_trash/__pycache__；排除 *.log（运行日志）
//   * 只认两种**地址形态**：https?://<公网IP>(:port)? 与 <公网IP>:<端口>；裸 IP 无端口不拦
//    （版本号 3.5.0.0 / 对白编号 1.2.1.2. / 数据段 4.1.5.0 都是真实误报源，且要内嵌地址
//     必然带协议或端口才可用）。私保网段豁免：127/10/192.168/172.16-31/169.254/100.64-127/0/224+
//    （10.0.2.2、127.0.0.1 这类本地拓扑写法合法）
//   * 命中 → 逐条打印 file:line → exit 1（禁止出包）
//
// 自检：--inject-test 走四通道故障注入（lua / cs / json / md 各植入一个 TEST-NET 假公网地址到
// 临时目录再扫描），必须全部被抓住，否则自检失败 exit 1——与 ①e/①f/①g 同款验收。
// 平时不带参数跑 = 注入自检 + 全树扫描两段都做。

'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FAKE_IP = '203.0.113.7';   // RFC 5737 TEST-NET-3，专用于文档/测试的假公网地址

const SCAN_TREES = [
  path.join(ROOT, 'tools', 'lua_remote', 'src'),
  path.join(ROOT, 'server'),
  path.join(ROOT, 'build', 'pslocal'),
  path.join(ROOT, 'cloud', 'log_receiver'),
];
const SKIP_DIRS = new Set(['node_modules', '.git', 'received', 'obj', 'bin', 'out', '_trash', '__pycache__', '.zcode']);
const SCAN_EXT = new Set(['.lua', '.js', '.cs', '.json', '.html', '.htm', '.ps1', '.bat', '.cmd', '.xml', '.md', '.txt', '.py', '.sh']);

// 点分四段 → 公网（非私保）判定；非法段（>255）返回 false 顺带滤掉版本号样误报
function isPublicIp(o) {
  const n = o.map(Number);
  if (n.some((x) => !Number.isInteger(x) || x < 0 || x > 255)) return false;
  const [a, b] = n;
  if (a === 0 || a === 10 || a === 127) return false;                       // 0/8 10/8 127/8
  if (a === 169 && b === 254) return false;                                 // 链路本地
  if (a === 172 && b >= 16 && b <= 31) return false;                        // 172.16/12
  if (a === 192 && b === 168) return false;                                 // 192.168/16
  if (a === 100 && b >= 64 && b <= 127) return false;                       // CGNAT
  if (a >= 224) return false;                                               // 组播/保留
  return true;
}

// 只认两种"地址形态"，裸 IP 不拦（版本号 3.5.0.0 / 对白编号 1.2.1.2. / 数据段 4.1.5.0
// 都是真实误报源，且真要内嵌地址必然带协议或端口才可用）：
//   T1  https?://<公网IP>(:port)?     —— URL 字面量（extcfg 底稿/常量/文档 curl 全是这种）
//   T2  <公网IP>:<端口>               —— 裸 host:port（README 标题/server.js 注释这种）
const T1_RE = /https?:\/\/(\d{1,3}(?:\.\d{1,3}){3})(:\d{1,5})?/gi;
const T2_RE = /\b(\d{1,3}(?:\.\d{1,3}){3}):(\d{1,5})\b/g;

function scanText(fp, text) {
  const hits = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const taken = [];                       // T1 命中的区间，T2 不重复计
    let m;
    T1_RE.lastIndex = 0;
    while ((m = T1_RE.exec(line)) !== null) {
      if (isPublicIp(m[1].split('.'))) {
        taken.push([m.index, m.index + m[0].length]);
        hits.push({ file: path.relative(ROOT, fp), line: i + 1, ip: m[1], text: line.trim().slice(0, 120) });
      }
    }
    T2_RE.lastIndex = 0;
    while ((m = T2_RE.exec(line)) !== null) {
      const s = m.index, e = m.index + m[0].length;
      if (taken.some(([a, b]) => s >= a && e <= b)) continue;
      if (isPublicIp(m[1].split('.'))) {
        hits.push({ file: path.relative(ROOT, fp), line: i + 1, ip: m[1], text: line.trim().slice(0, 120) });
      }
    }
  }
  return hits;
}

function scanDir(root) {
  const hits = [];
  const walk = (dir) => {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    for (const ent of entries) {
      const fp = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (!SKIP_DIRS.has(ent.name)) walk(fp);
        continue;
      }
      if (!SCAN_EXT.has(path.extname(ent.name).toLowerCase())) continue;
      let text;
      try { text = fs.readFileSync(fp, 'utf8'); } catch (e) { continue; }
      hits.push(...scanText(fp, text));
    }
  };
  walk(root);
  return hits;
}

function report(label, hits) {
  if (hits.length) {
    console.log('    ✗ %s：命中 %d 处公网 IP', label, hits.length);
    for (const h of hits) console.log('      %s:%d  [%s]  %s', h.file, h.line, h.ip, h.text);
  } else {
    console.log('    ✓ %s：零公网 IP', label);
  }
  return hits.length;
}

// 三通道故障注入自检：假公网地址必须 100% 被抓住（少抓一个都算失败）
function injectTest() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate_addr_'));
  const cases = [
    ['x.lua', 'local A = "http://%s:1011/upload"\nreturn A'],
    ['x.cs', 'const string U = "http://%s:1011/upload";'],
    ['x.json', '{"uploadUrl":"http://%s:1011/"}'],
    ['x.md', '上传地址填 %s:1011（裸 host:port 形态）'],
  ];
  try {
    for (const [name, tpl] of cases) fs.writeFileSync(path.join(dir, name), tpl.replace(/%s/g, FAKE_IP));
    const hits = scanDir(dir).filter((h) => h.ip === FAKE_IP);
    if (hits.length !== cases.length) {
      console.log('    ✗ 故障注入自检：%d 通道只抓住 %d 处', cases.length, hits.length);
      for (const h of hits) console.log('      %s  [%s]', h.file, h.ip);
      return 1;
    }
    console.log('    ✓ 故障注入自检：lua/cs/json/md 四通道假公网地址全部被拦（4/4）');
    return 0;
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {}
  }
}

function main() {
  let bad = 0;
  if (process.argv.includes('--inject-test') || process.argv.length === 2) {
    console.log('[①h] 故障注入自检（lua/cs/json/md 四通道）');
    bad += injectTest();
  }
  console.log('[①h] 出货源树公网 IP 扫描（tools/lua_remote/src · server · build/pslocal）');
  for (const tree of SCAN_TREES) {
    if (!fs.existsSync(tree)) continue;
    bad += report(path.relative(ROOT, tree), scanDir(tree));
  }
  if (bad) {
    console.log('[①h] 失败：%d 处——公网地址不得回仓库（二百九十一：上传地址只由上传者手输）', bad);
    process.exit(1);
  }
  console.log('[①h] 通过');
}

main();
