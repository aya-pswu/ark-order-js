// HTTP 路由服（GetAgentConfig / GetServerNotice / GetAccountNode / 账号 API / 资源静态服务）
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const ACC = require('./accounts');
const NET = require('./net_check');
const RES_ROOT = path.resolve(process.env.FZZL_RES_ROOT || 'H:\\NEW FILES\\files\\res');

function startHttpRouter(port, ctx, onReady, onListenError) {
  const server = http.createServer((req, res) => {
    let u, p;
    try {
      u = new URL(req.url, 'http://x');
      p = decodeURIComponent(u.pathname);
    } catch (e) {
      ctx.log(`[HTTP] 400 malformed URL: ${e.message}`);
      res.writeHead(400); res.end(); return;
    }
    // 账号 API 的 query 里旧客户端可能带 pass=（密码输入已移除，服务端忽略），日志里打星号防泄漏
    ctx.log(`[HTTP] ${req.method} ${req.url.replace(/([?&]pass=)[^&]*/, '$1***')}`);

    // ---- 游戏内「公告」本地站点（主城公告按钮 → UniWebView 加载本页）----
    // 路径与官方 CMS 同构（CfgNotice 页签 link = /<tab>/1.html，拼在 getHomeURL() 之后），
    // 客户端面板原生页签按钮无需任何改动即可工作。必须放在 /res 静态兜底之前：
    // /notice/activity/1.html 以 .html 结尾，否则会被下面的 catch-all 误当资源文件去 RES_ROOT 找。
    if (p === '/notice' || p === '/notice/' || p.startsWith('/notice/')) {
      const NOTICE = require('./data/notice_site');
      const m = /^\/notice\/(activity|update|announcement|introduce|comics)\/\d+\.html$/.exec(p);
      const html = m ? NOTICE.renderTab(m[1]) : (p === '/notice' || p === '/notice/') ? NOTICE.renderHome() : null;
      ctx.log(`[HTTP] => notice ${html ? '200' : '404'} ${p}`);
      // 单机 Jint 垫片的 writeHead(status, headers) 重载绑定丢第二参（LocalHttp.cs writeHeadEx 注释），
      // 必须走 writeHeadEx；node 无此方法走标准 writeHead。
      const status = html ? 200 : 404;
      const head = { 'Content-Type': 'text/html; charset=utf-8' };
      if (typeof res.writeHeadEx === 'function') res.writeHeadEx(status, head);
      else res.writeHead(status, head);
      res.end(html || '<!DOCTYPE html><html><body style="background:#171a29;color:#dfe3f2">404 Not Found</body></html>');
      return;
    }

    // 全量资源静态服务：/res/** → H:\NEW FILES\files\res\**（HttpLoader 带 Range 请求测大小）
    if (p.startsWith('/res/') || (!p.startsWith('/client_api') && !p.startsWith('/metl') && /\.[a-z0-9]{2,4}$/i.test(p))) {
      let rel = p.replace(/^\/res\//, '').replace(/^\//, '');
      if (!/^[\w\-./]+$/.test(rel)) { res.writeHead(403); res.end(); return; }
      const fp = path.resolve(RES_ROOT, rel);
      const relative = path.relative(RES_ROOT, fp);
      if (relative.startsWith('..' + path.sep) || path.isAbsolute(relative) || !fs.existsSync(fp) || !fs.statSync(fp).isFile()) {
        ctx.log(`[HTTP] 404 ${rel}`);
        res.writeHead(404); res.end(); return;
      }
      const st = fs.statSync(fp);
      const range = req.headers.range;
      if (range) {
        const m = /^bytes=(\d*)-(\d*)$/.exec(range);
        if (!m || (!m[1] && !m[2]) || st.size <= 0) { res.writeHead(416); res.end(); return; }
        let s, e;
        if (!m[1]) {
          const suffix = parseInt(m[2], 10);
          if (!Number.isFinite(suffix) || suffix <= 0) { res.writeHead(416); res.end(); return; }
          s = Math.max(0, st.size - suffix); e = st.size - 1;
        } else {
          s = parseInt(m[1], 10);
          e = m[2] ? parseInt(m[2], 10) : st.size - 1;
          if (!Number.isFinite(s) || !Number.isFinite(e) || s >= st.size || s > e) { res.writeHead(416); res.end(); return; }
          e = Math.min(e, st.size - 1);
        }
        res.writeHead(206, {
          'Content-Range': `bytes ${s}-${e}/${st.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': e - s + 1,
          'Content-Type': 'application/octet-stream',
        });
        fs.createReadStream(fp, { start: s, end: e }).pipe(res);
      } else {
        res.writeHead(200, { 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Content-Type': 'application/octet-stream' });
        fs.createReadStream(fp).pipe(res);
      }
      return;
    }

    const send = obj => {
      const body = JSON.stringify(obj);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(body);
      ctx.log(`[HTTP] => ${body.slice(0, 400)}`);
    };

    // ---- 存档管理端点（/saveadm/*，同设备存档管理器 APK 经 HTTP 回环调用；见 save_admin.js）----
    // 必须放在 /res 静态兜底之前：/saveadm/xxx 不带文件后缀本不会进 catch-all，但显式前置更清晰。
    if (p.startsWith('/saveadm/')) {
      return require('./save_admin').handle(req, res, p, u, ctx, send);
    }

    // ---- 账号 API（本地服自建，客户端登录面板用 WebHttp.AsynGet 调；见 tools/lua_remote/src/Modules/login/LoginPanel.lua）----
    // 走 HTTP 而不是游戏协议：ETF 协议表是官方固定的，没有能装"注册/登录"的 tos；
    // 而账号操作发生在 TCP 连接建立之前（uid 要在 m_auth_key_tos 里就定下来），HTTP 是唯一时机。
    // /ps_savefile（一百八十二）：游戏内「上传运行日志」连带存档——客户端 WebHttp 同步取当前
    // 存档原文。最初走 GM 通道（m21_savefile → m_debugger_info_toc），但 toc 分发在注册时
    // 持有 handler 引用，客户端运行时替换拦不住 → 236KB 存档被官方详情面板渲染（Unity Text
    // 爆 65k 顶点）。HTTP 回环 <200ms 且无任何面板副作用。
    if (p === '/ps_savefile') {
      try {
        const stateMod = require('./state');
        stateMod.flushSave();
        const file = stateMod.getStateFile();
        const json = require('fs').readFileSync(file, 'utf8');
        ctx.log('[savefile] 回传 ' + require('path').basename(file) + '（' + json.length + 'B）');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
        return res.end(json);
      } catch (e) {
        ctx.log('[savefile] 失败：' + e.message);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('save error: ' + e.message);
      }
    }
    if (p === '/ps_account') {
      const action = u.searchParams.get('action') || '';
      const name = u.searchParams.get('name') || '';
      const pass = u.searchParams.get('pass') || '';
      if (action === 'list') {
        // last 只发"上次真实登录/注册"的账号（二百九十三）：不回落 player，
        // 否则全新安装会默认把出厂 player 档填进登录框（要求：不预填、手动输入）。
        return send({ ret: '1', msg: '', data: { accounts: ACC.list(), last: ACC.lastAccountName() } });
      }
      if (action === 'register' || action === 'login' || action === 'auto') {
        const r = action === 'register' ? ACC.register(name, pass)
          : action === 'login' ? ACC.login(name, pass)
            : ACC.loginOrRegister(name, pass);
        if (!r.ok) { ctx.log(`[account] ${action} 失败 ${name}：${r.err}`); return send({ ret: '0', msg: r.err, data: {} }); }
        ctx.log(`[account] ${action} 成功 ${r.acc.name}${r.created ? '（新注册）' : ''}`);
        return send({ ret: '1', msg: '', data: { name: r.acc.name, token: r.token, hasPass: !!r.acc.hash, created: !!r.created } });
      }
      return send({ ret: '0', msg: '未知 action', data: {} });
    }

    if (p.endsWith('/client_api/GetAgentConfig.php')) {
      // UpdateManager.CheckReturn 消费：code=300 无更新直接进游戏；字段平铺在顶层。
      // isSecondZipDone='2'：分包 APK 的 needSetupSecondZip() = isMultiZip() and GetExtCfg
      // ("isSecondZipDone")~="2"——缺这个字段时客户端认为完整资源包未下载，主页活动
      // banner 轮播（MainFunctionPanel.updateActs）会全部过滤（只留新手引导类）
      return send({
        code: '300',
        downloadRemoteRes: '0',
        isSecondZipDone: '2',
        upf: '',
        srcIp: ctx.hostIp,
        resStatic: 'http://' + ((req.headers && req.headers.host) || ctx.hostIp) + '/res',
        resStatic2: '',
        appResourceUrl: '',
        UpdateList: [],
      });
    }
    if (p.endsWith('/client_api/GetServerNotice.php')) {
      return send({ msg: '', ret: '1', data: { port: '443', bgp_host: '', bgp_port: '', agent_name: 'biliandly', time: String(Math.floor(Date.now() / 1000)), ip: ctx.hostIp, content: '', agent_id: '8', title: '', platform_id: '5', sign: '1', platform_name: 'biliandly', server_id: '1', is_test: '0' } });
    }
    if (p.endsWith('/client_api/GetAccountNode.php')) {
      return send({
        msg: '', ret: '1',
        data: {
          ip: ctx.hostIp, port: String(ctx.gamePort),
          bgp_host: '', bgp_port: '',
          agent_name: 'biliandly', agent_id: '8',
          platform_id: '5', platform_name: 'biliandly',
          time: String(Math.floor(Date.now() / 1000)),
          sign: 'fzzl', server_id: '1',
          incheck: 0, is_test: '0',
          content: '', title: '',
        },
      });
    }
    // 通用空响应
    return send({ ret: '1', msg: '', data: {} });
  });
  // 2026-09-13 事故：80 端口被内核 HTTP.sys（IIS/W3SVC）代持 → listen 抛 EACCES，
  // 而这里原先没有 error 处理器，异常直接冒泡成未捕获异常，把同一进程里已正常服务的
  // 9021 游戏服一起带走。改走 NET.listenGuarded：失败时打「原因 + 三条出路」，并回调 onListenError。
  NET.listenGuarded(server, port, 'HTTP', ctx, onReady, onListenError);
  return server;
}

module.exports = { startHttpRouter };
