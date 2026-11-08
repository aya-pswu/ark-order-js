// 单机服「公告」站点渲染器：把 notice_data.js 的公告渲染成 UniWebView 页面。
// 路由（server/http_router.js）：
//   /notice                    公告主页（公告按钮打开的默认页，全部公告按页签分节）
//   /notice/<tab>/<n>.html     五个页签页（tab 同CfgNotice：activity/update/announcement/introduce/comics）
// 配色取客户端 UniWebView 官方便签色：maintain=金 f7c324 / activity=粉 f958ff / upgrade=绿 6bf056。
// 数据按请求现读（清 require 缓存）：PCJS 上编辑 notice_data.js 重开面板即见，无需重启服务端。
'use strict';

const TABS = [
  { key: 'announcement', name: '公告' },
  { key: 'update', name: '更新' },
  { key: 'activity', name: '活动' },
  { key: 'introduce', name: '誓灵' },
  { key: 'comics', name: '漫画' },
];

const TYPE_NAMES = { maintain: '维护', activity: '活动', upgrade: '更新' };

// 数据按请求现读（清 require 缓存）：PCJS 上编辑 notice_data.js 重开面板即见，无需重启服务端。
// ⚠️ 内嵌 Jint 垫片的 require 没有 .resolve/.cache（apkbuild pslocal __ps_prelude），必须运行时探测：
// node 走 cache-bust 现读；Jint 跳过 cache-bust 拿缓存实例（单机内容打进 APK，重启进程即首装内容）。
function loadData() {
  try {
    if (typeof require.resolve === 'function') {
      // notice_data 及其依赖的名单文件都要 bust（否则编辑 contributor_names.js 不重启读到旧名单）
      for (const dep of ['./notice_data', './contributor_names']) {
        const p = require.resolve(dep);
        delete require.cache[p];
      }
    }
  } catch (e) { /* Jint 等 shim：无 resolve，走下方 require 缓存实例 */ }
  return require('./notice_data');
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function typeColor(type) {
  if (type === 'activity') return '#f958ff';
  if (type === 'upgrade') return '#6bf056';
  return '#f7c324';
}

function cardOf(n) {
  const color = typeColor(n.type);
  const tag = esc(TYPE_NAMES[n.type] || '公告');
  return `<div class="card">
  <div class="head"><span class="tag" style="background:${color}">${tag}</span><span class="title">${esc(n.title)}</span></div>
  <div class="date">${esc(n.date || '')}</div>
  <div class="body">${n.body || ''}</div>
</div>`;
}

function pageCss() {
  return `body{margin:0;background:#171a29;color:#dfe3f2;font:15px/1.65 -apple-system,'Microsoft YaHei',Roboto,sans-serif;}
.wrap{max-width:760px;margin:0 auto;padding:18px 14px 40px;}
.site{font-size:22px;font-weight:700;color:#f7c324;letter-spacing:1px;}
.sub{color:#8a90ad;font-size:12px;margin:4px 0 18px;}
.sect{font-size:17px;font-weight:700;color:#aab1d0;margin:22px 0 10px;border-left:4px solid #f7c324;padding-left:9px;}
.card{background:#232741;border:1px solid #343a5e;border-radius:10px;padding:12px 14px;margin-bottom:12px;}
.head{display:flex;align-items:center;gap:8px;}
.tag{color:#171a29;font-size:12px;font-weight:700;border-radius:4px;padding:1px 7px;flex:none;}
.title{font-weight:700;font-size:16px;color:#fff;}
.date{color:#8a90ad;font-size:12px;margin:5px 0 8px;}
.body p{margin:6px 0;}
.body ul{margin:6px 0;padding-left:20px;}
.body li{margin:3px 0;}
.body code{background:#1b1e30;border:1px solid #343a5e;border-radius:4px;padding:0 5px;font-size:13px;color:#9fd0ff;}
.body a{color:#9fd0ff;}
.foot{color:#5d6280;font-size:11px;text-align:center;margin-top:26px;}`;
}

function pageShell(title, inner) {
  const data = loadData();
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>${pageCss()}</style>
</head>
<body><div class="wrap">
<div class="site">${esc(data.siteName || '方舟指令JS')}</div>
<div class="sub">${esc(data.subtitle || 'Funky Stars')}</div>
${inner}
<div class="foot">${esc(data.footer || '方舟指令JS · 本页面内容与官方无关')}</div>
</div></body></html>`;
}

function sortedOf(list) {
  return list.slice().sort((a, b) => {
    if (!!a.top !== !!b.top) return a.top ? -1 : 1;
    return String(b.date || '').localeCompare(String(a.date || ''));
  });
}

function renderHome() {
  const data = loadData();
  const parts = [];
  for (const t of TABS) {
    const items = sortedOf((data.notices || []).filter(n => n.tab === t.key));
    if (!items.length) continue;
    parts.push(`<div class="sect">${t.name}</div>`);
    for (const n of items) parts.push(cardOf(n));
  }
  if (!parts.length) parts.push('<div class="card"><div class="body"><p>暂无公告。</p></div></div>');
  return pageShell(data.siteName || '方舟指令JS', parts.join('\n'));
}

function renderTab(tab) {
  const t = TABS.find(x => x.key === tab);
  if (!t) return null;
  const data = loadData();
  const items = sortedOf((data.notices || []).filter(n => n.tab === tab));
  const inner = items.length
    ? items.map(cardOf).join('\n')
    : '<div class="card"><div class="body"><p>本栏目暂无内容。</p></div></div>';
  return pageShell(`${t.name} - ${data.siteName || '方舟指令JS'}`, inner);
}

module.exports = { renderHome, renderTab, TABS, esc };
