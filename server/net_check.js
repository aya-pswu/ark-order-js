// 端口预检与监听错误诊断（零依赖）。
//
// 【为什么需要】2026-09-13 事故：游戏服固定用 80 端口（start.ps1 里 `node start.js --port=80`），
// 而 Windows 上 80 常被内核 HTTP.sys 代持 —— IIS（W3SVC/WAS 服务 + w3wp.exe）一启动，
// `HTTP://*:80/` 就注册进 HTTP.sys，此时 Node 的 listen() 收到的是 **EACCES**（不是 EADDRINUSE），
// netstat 上显示持有者是 PID 4（System 内核进程），常规"按 PID 杀进程"根本无效。
// 更糟的是 http_router.js 原先没挂 server.on('error')，异常直接冒泡成未捕获异常
// → 整个进程退出 → 连已监听成功的 9021 游戏服一起被带走（玩家侧表现：全部掉线）。
//
// 本模块提供两件事：
//   1) preflight(port)  —— listen 之前先探一下端口是否可绑，把"能不能"变成启动时就说得清的事；
//   2) makeListenErrorHandler(role, port, ctx) —— listen 失败的语义化报错 + 三选一修复指引，
//      而不是甩一段裸栈。
'use strict';

const net = require('net');

// 无权绑定（HTTP.sys/IIS 代持）时 Windows 的典型 errno，出现即提示提权
const EACCES_ERRNOS = [-4092, -13, 13, 10013];

/**
 * 探测端口可绑定性与持有进程（同步、尽力而为，绝不抛异常）。
 * 只做 bind 探测，不做 accept，不改变系统状态。
 * @param {number} port
 * @returns {{port:number, bindable:boolean, code:string|null, isInUse:boolean,
 *            listenPids:number[], systemPid:boolean, likelyHttpSys:boolean}}
 */
function preflight(port) {
  const r = {
    port: Number(port),
    bindable: true,
    code: null,
    isInUse: false,
    listenPids: [],
    systemPid: false,
    likelyHttpSys: false,
  };

  // 1) 能否 bind。Windows 上同端口 bind 冲突时给出 EADDRINUSE(10048)；
  //    被 HTTP.sys 代持时给 EACCES(10013) —— 这里只记录，真正的判定走 listen 时的错误码。
  r.listenPids = listenPids(r.port);
  r.systemPid = r.listenPids.indexOf(4) !== -1; // 4 = Windows System（内核 HTTP.sys 的宿主）

  // 2) 找监听者（netstat）
  if (r.listenPids.length) {
    r.isInUse = true;
    r.likelyHttpSys = r.systemPid;
  }

  // 3) HTTP.sys 服务态（netsh）—— 只在国内 80 端口场景多跑一步，失败静默
  if (r.port === 80) {
    const st = httpServiceState(r.port);
    if (st && st.registered) {
      r.isInUse = true;
      r.likelyHttpSys = true;
      r.httpService = st;
    }
  }
  return r;
}

// ---------------------------------------------------------------- 持有进程查询
function listenPids(port, timeoutMs) {
  const out = execSync(`netstat -ano -p TCP`, timeoutMs);
  if (!out) return [];
  const pids = [];
  for (const line of out.split(/\r?\n/)) {
    // Proto  Local Address          Foreign Address        State           PID
    // TCP    0.0.0.0:80             0.0.0.0:0              LISTENING       4
    const m = /^\s*TCP\s+(\S+):(\d+)\s+\S+\s+LISTENING\s+(\d+)\s*$/i.exec(line.trim());
    if (!m) continue;
    if (Number(m[2]) !== Number(port)) continue;
    const pid = Number(m[3]);
    if (!Number.isNaN(pid) && pids.indexOf(pid) === -1) pids.push(pid);
  }
  return pids;
}

// ---------------------------------------------------------------- HTTP.sys 注册态
// 解析 `netsh http show servicestate`，看目标端口的 URL 是否已被注册（谁注册的不重要，
// 只要能确认"这块地被 HTTP.sys 占了"，就能把 EACCES 讲清楚）。
function httpServiceState(port) {
  const out = execSync('netsh http show servicestate view=requestq', 15000);
  if (!out) return null;
  const lines = out.split(/\r?\n/);
  const res = { port: port, registered: false, urls: [], appPools: [], processIds: [] };
  const portRe = new RegExp(`:${port}(/|\\s|$)`);
  for (const line of lines) {
    let m = /^\s*(URL[^:]*|Registered URL)\s*:\s*(\S+)/i.exec(line);
    if (m) {
      if (portRe.test(m[2])) { res.registered = true; res.urls.push(m[2]); }
      continue;
    }
    m = /^\s*Request queue name\s*:\s*(.+?)\s*$/i.exec(line);
    if (m && /DefaultAppPool|W3SVC/i.test(m[1])) res.appPools.push(m[1]);
    m = /^\s*Process ID\s*:\s*(\d+)/i.exec(line);
    if (m) {
      const pid = Number(m[1]);
      if (pid && res.processIds.indexOf(pid) === -1) res.processIds.push(pid);
    }
  }
  if (res.appPools.length || res.processIds.length) res.registered = true;
  return res;
}

function execSync(cmd, timeoutMs) {
  try {
    const { execSync: run } = require('child_process');
    return run(cmd, { encoding: 'utf8', timeout: timeoutMs || 8000, windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e) {
    // netstat/netsh 某些参数组合在旧系统上会返回非 0，但 stdout 仍有效
    if (e && typeof e.stdout === 'string' && e.stdout) return e.stdout;
    return '';
  }
}

// ---------------------------------------------------------------- 人话诊断
/**
 * 把 listen 失败的 errno 翻译成「什么原因 + 三条出路」。
 * @param {NodeJS.ErrnoException} err
 * @param {string} role  'HTTP' | 'GAME'，用于措辞
 * @param {number} port
 */
function explainListenError(err, role, port) {
  const code = String((err && err.code) || '');
  const errno = Number(err && err.errno);
  const pre = preflight(port);
  const roleName = role === 'GAME' ? '游戏服' : 'HTTP 路由服';

  // ---- EACCES：Windows 上 90% 是内核 HTTP.sys（IIS/Go http.sys/某些"网络加速器"）代持端口
  if (code === 'EACCES' || EACCES_ERRNOS.indexOf(errno) !== -1) {
    const sys = pre.systemPid || pre.likelyHttpSys;
    const is80 = Number(port) === 80;
    return {
      title: `${roleName}无法绑定 ${port} 端口：EACCES 权限被拒`,
      why: sys
        ? `端口被 **HTTP.sys（Windows 内核驱动）代持**，netstat 里持有者是 PID 4（System 进程）。`
          + `这是 IIS / W3SVC 之类的服务注册了 URL 前缀后的典型表现 —— 它不是"某个进程占着端口"，`
          + `而是内核替你占着，所以按 PID 杀进程没有用。`
        : `当前用户没有绑定 ${port} 端口的权限（${port} < 1024 属于特权端口，`
          + `或该端口已被系统服务保留）。`,
      fixes: is80 ? [
        `【推荐 A】以管理员身份运行 start.bat（Windows 上提权即可绑定低位端口；IIS 真在监听时会转为 EADDRINUSE，见下）`,
        `【推荐 B】停掉 IIS 的 HTTP 代持（管理员 PowerShell）：
       Stop-Service W3SVC -Force; Stop-Service WAS -Force
     若要永久生效：Set-Service W3SVC -StartupType Disabled`,
        `【应急 C】换个高位端口启动，再让客户端走这个端口：
       node start.js --port=8081   （同时调 extcfg_dev.json / hosts 侧的端口约定）`,
      ] : [
        `以管理员身份运行 start.bat；或改用 1024 以上的端口。`,
      ],
      detail: pre,
    };
  }

  // ---- EADDRINUSE：真的有人在监听（IIS 在跑、上一次的服务没退干净、或另一个 start.js 在跑）
  if (code === 'EADDRINUSE') {
    const pids = pre.listenPids || [];
    const has4 = pids.indexOf(4) !== -1;
    return {
      title: `${roleName}无法绑定 ${port} 端口：已被占用（EADDRINUSE）`,
      why: has4
        ? `端口持有者是 PID 4（System / 内核 HTTP.sys），即 IIS 或同类 HTTP 服务正在监听。`
        : (pids.length
          ? `端口已被进程 PID ${pids.join(', ')} 监听。`
          : `端口已被其他进程监听（netstat 未取到 PID）。`),
      fixes: [
        `查看占用者：netstat -ano | findstr ":${port} "`,
        has4
          ? `停掉 IIS：管理员 PowerShell 执行  Stop-Service W3SVC -Force; Stop-Service WAS -Force`
          : `结束占用进程（谨慎）：taskkill /PID ${pids[0] || '<PID>'} /F；或先跑 stop.bat 停掉本项目的旧服务`,
        `或换端口：node start.js --port=${Number(port) === 80 ? 8081 : Number(port) + 1}`,
      ],
      detail: pre,
    };
  }

  // ---- 其他
  return {
    title: `${roleName}启动失败：${code || (err && err.message) || '未知错误'}`,
    why: String((err && err.message) || ''),
    fixes: [`检查端口 ${port} 是否被占用、是否有权限绑定；完整栈见 server/logs/server.log`],
    detail: pre,
  };
}

// ---------------------------------------------------------------- listen 兜底
/**
 * 包一层 server.listen：先预检，再挂 error 处理器。
 * 关键价值有二：
 *   ① 监听失败时打印「原因 + 出路」而不是裸栈；
 *   ② **监听失败不再连累另一个服务** —— 本进程里另一个端口（如 9021 游戏服）已经正常服务，
 *      以非 0 码退出会让 cmd 窗口一闪而过，玩家什么提示都看不到。这里统一按"致命启动错误"
 *      汇报，但把决定权留给调用方（start.js 可选择继续跑或退出）。
 *
 * @param {import('net').Server} server
 * @param {number} port
 * @param {string} role 'HTTP' | 'GAME'
 * @param {{log:Function}} ctx
 * @param {Function} onReady
 * @param {(info:object)=>void} [onFatal] 致命错误回调（默认抛异常）
 */
function listenGuarded(server, port, role, ctx, onReady, onFatal) {
  let settled = false;
  const log = ctx && ctx.log ? ctx.log : () => {};

  server.on('error', err => {
    if (settled) { log.err && log.err(`[net] ${role} 后续 socket 错误`, err.message); return; }
    settled = true;
    const info = explainListenError(err, role, port);
    reportFatal(info, log);
    if (onFatal) { onFatal(info); return; }
    // 默认：把信息挂到 error 上抛出去，让启动脚本/入口决定
    const e = new Error(`${info.title}`);
    e.listenInfo = info;
    e.cause = err;
    throw e;
  });

  server.listen(port, '0.0.0.0', () => {
    settled = true;
    log.ok && log.ok(`[net] ${role === 'GAME' ? '游戏服' : 'HTTP 路由服'}监听 0.0.0.0:${port}`);
    if (onReady) onReady();
  });
  return server;
}

function reportFatal(info, log) {
  const out = (s) => (log.err ? log.err(s) : console.error(s));
  out(`[net] ${info.title}`);
  out(`[net] 原因：${info.why}`);
  info.fixes.forEach((f, i) => out(`[net] 修复 ${i + 1}：${f}`));
  const d = info.detail || {};
  if (d.listenPids && d.listenPids.length) out(`[net] netstat 持有 PID：${d.listenPids.join(', ')}${d.systemPid ? '（PID 4 = 内核 HTTP.sys）' : ''}`);
  if (d.httpService && d.httpService.urls && d.httpService.urls.length) out(`[net] HTTP.sys 已注册 URL：${d.httpService.urls.slice(0, 3).join(' | ')}`);
}

/**
 * 打印一段启动前的端口体检结论（供启动横幅后调用，人话版）。
 */
function reportPreflight(port, role, log) {
  const p = preflight(port);
  if (!p.isInUse) return p;
  const tag = role === 'GAME' ? '游戏服' : 'HTTP 路由服';
  log.warn && log.warn(`[net] ${tag}端口 ${port} 已被占用`
    + (p.systemPid ? '（持有者 PID 4 = 内核 HTTP.sys / IIS）' : `（PID ${p.listenPids.join(', ')}）`)
    + '，监听大概率会失败 —— 见下方修复指引');
  return p;
}

module.exports = { preflight, explainListenError, listenGuarded, reportPreflight, listenPids };
