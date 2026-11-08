// 存档管理端点（/saveadm/*）—— 供同设备的「存档管理器 APK」经 HTTP 回环调用。
//
// 【为什么走 HTTP 而不是让 APK 直接读文件】psroot（含 saves/）在设备内部存储
//   /data/user/0/<pkg>/files/psroot/ps_server/（Bootstrap.cs 用 Application.persistentDataPath；
//   psnode 因 FUSE noexec 必须内部存储），第三方 APK 无 root 不可达 —— 而服务端 HTTP 回环
//   127.0.0.1:8081 天然可达（/ps_savefile、/ps_account 同款先例，见 http_router.js）。
//
// 【使用流程】备份（export）→ 整包删除重装游戏 → 首启播种服务端 → 恢复（import）→ 原账号重登。
//   bundle 必须含 accounts.json：psnode 重播种会用包内 accounts.json 覆盖设备侧（二百九十三），
//   自建账号条目只存在于备份里。
//
// 【安全】两道：① 仅接受本机回环来源（局域网设备一律 403，对齐 ①h"单机服不暴露面"纪律）；
//   ② 共享 key 常量校验（防设备上其他 app 误扫误调；key 双端同源，随仓库分发，非机密）。
//
// 【测试隔离】PS_ADMIN_ROOT 环境变量把根目录（accounts.json + saves/）指到临时树，
//   沿 PS_STATE_FILE 先例 —— 冒烟测试绝不写真实存档（E1 家族纪律）。
//
// 【Jint 兜底线】本模块只在 HTTP 路由层调用；写法保持朴素 ES6，与 http_router.js 同档。
'use strict';
const fs = require('fs');
const path = require('path');

// 双端共享 key（APK 侧同名常量；防误调的软闸门，真正的面隔离靠 localhost-only）
const ADMIN_KEY = 'fzzl-saveadm-v1';
// 单请求体积上限：bundle = N 份存档（单份 ~236KB 量级）+ accounts.json，64MB 足够宽裕
const MAX_BODY = 64 * 1024 * 1024;
// 账号名白名单（与 accounts.js NAME_RE 同标准；import 目标文件名由它消毒，防路径穿越）
const NAME_RE = /^[A-Za-z0-9_]{2,16}$/;

// 根目录：含 accounts.json 与 saves/（默认 = server/ 本目录）
const ROOT = process.env.PS_ADMIN_ROOT ? path.resolve(process.env.PS_ADMIN_ROOT) : __dirname;
const ACCOUNTS_FILE = path.join(ROOT, 'accounts.json');
const SAVE_DIR = path.join(ROOT, 'saves');

// 主线 mapId 生成式：（100+章）+ "0" + 关号 + "00"（1-1=1010100 … 10-1=1100100 … 11-4=1110400，
// 与 map_fight.js MAIN_CHAPTERS 一致）。不直接 require map_fight（handler 巨兽，避免拉起整条
// 战斗依赖链）；编辑时用 MAP_CONFIGS 做存在性自检，规律漂移即拒绝盲写。
function mainMapId(ch, idx) {
  return Number(String(100 + ch) + '0' + idx + '00');
}

function keyOf(name) { return String(name || '').toLowerCase(); }
function nowSec() { return Math.floor(Date.now() / 1000); }

function localhostOnly(req) {
  const ra = String((req.socket && req.socket.remoteAddress) || '');
  return ra === '127.0.0.1' || ra === '::1' || ra === '::ffff:127.0.0.1';
}

function checkKey(u, req) {
  const k = (u.searchParams && u.searchParams.get('key')) || req.headers['x-save-admin-key'] || '';
  return String(k) === ADMIN_KEY;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error('body 过大')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// ---- 存档摘要 / 文件枚举 ----

// 当前加载账号的存档文件（flushSave 后读它必然是最新的）
function currentStateFile() {
  const state = require('./state');
  state.flushSave();
  return state.getStateFile();
}

function summarizeSaveFile(fp) {
  const st = fs.statSync(fp);
  let d = null;
  try { d = JSON.parse(fs.readFileSync(fp, 'utf8')); } catch (e) { return { file: path.basename(fp), error: 'JSON 解析失败: ' + e.message, mtime: Math.floor(st.mtimeMs / 1000), size: st.size }; }
  const ra = d.roleAsset || {};
  const scores = ra.scores || {};
  return {
    file: path.basename(fp),
    roleName: d.roleName || '',
    level: ra.level || 1,
    exp: ra.exp || 0,
    gold: ra.gold || 0,          // 付费水晶
    gold_given: ra.gold_given || 0, // 赠送水晶（客户端显示两者相加，D24②）
    silver: ra.silver || 0,      // 金币
    vit: scores[5] || 0,         // 体力 = role_scores[5]
    servants: Array.isArray(d.servants) ? d.servants.length : 0,
    mtime: Math.floor(st.mtimeMs / 1000),
    size: st.size,
  };
}

// 枚举 saves/*.json（_auto_backup_* 备份目录在子目录里不会扫到；`.json` 后缀之外忽略）
function listSaveFiles() {
  if (!fs.existsSync(SAVE_DIR)) return [];
  return fs.readdirSync(SAVE_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(SAVE_DIR, f))
    .filter(f => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } });
}

// ---- 编辑 ----

// 把 ≤ch-idx 的主线各关 cleared 补上 bossPoint（幂等；三星是推导制，见 map_fight.js isCleared/stars）。
// 传 null 表示"不改关卡进度"。越界章号一律钳制。
function applyStageProgress(obj, ch, idx) {
  if (!ch || !idx) return false;
  const { MAP_CONFIGS } = require('./data/map_configs');
  // 生成式存在性自检：每章 4 关都必须在 MAP_CONFIGS 里，否则说明章节编号规律漂移，拒绝盲写
  const missing = [];
  for (let c = 1; c <= 11; c++) for (let i = 1; i <= 4; i++) if (!MAP_CONFIGS[mainMapId(c, i)]) missing.push(mainMapId(c, i));
  if (missing.length) throw new Error('主线 mapId 规律漂移，MAP_CONFIGS 缺 ' + missing.slice(0, 5).join(',') + '（拒绝编辑关卡进度）');

  ch = Math.max(1, Math.min(11, Math.floor(Number(ch) || 0)));
  idx = Math.max(1, Math.min(4, Math.floor(Number(idx) || 0)));
  if (!obj.mapProgress || typeof obj.mapProgress !== 'object') obj.mapProgress = { maps: {} };
  if (!obj.mapProgress.maps || typeof obj.mapProgress.maps !== 'object') obj.mapProgress.maps = {};
  const maps = obj.mapProgress.maps;
  let touched = 0;
  for (let c = 1; c <= ch; c++) {
    for (let i = 1; i <= (c < ch ? 4 : idx); i++) {
      const mapId = mainMapId(c, i);
      const cfg = MAP_CONFIGS[mapId];
      if (!cfg || !cfg.bossPoint) continue;
      let prog = maps[mapId];
      if (!prog || typeof prog !== 'object') { prog = { defeated: [], cleared: [], dropped: [] }; maps[mapId] = prog; }
      if (!Array.isArray(prog.cleared)) prog.cleared = [];
      if (!prog.cleared.includes(cfg.bossPoint)) { prog.cleared.push(cfg.bossPoint); touched++; }
    }
  }
  return touched > 0;
}

// 非负整数钳制（null/undefined/非数 → null = 不改该项）
function clampNum(v, cap) {
  if (v === null || v === undefined || v === '') return null;
  const n = Math.floor(Number(v));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.min(n, cap || 1000000000000);
}

// 对一个存档对象（内存 S 或文件 JSON）应用编辑字段；返回 {changed:bool}
function applyEditFields(obj, body) {
  const ra = obj.roleAsset || (obj.roleAsset = {});
  let changed = false;
  const set = (k, v) => { if (v !== null && ra[k] !== v) { ra[k] = v; changed = true; } };
  set('level', clampNum(body.level, 9999));
  set('exp', clampNum(body.exp, 1000000000000));
  set('silver', clampNum(body.silver, 1000000000000));
  set('gold', clampNum(body.gold, 1000000000000));
  set('gold_given', clampNum(body.gold_given, 1000000000000));
  if (body.vit !== null && body.vit !== undefined && body.vit !== '') {
    const v = clampNum(body.vit, 100000000);
    if (v !== null) {
      if (!ra.scores || typeof ra.scores !== 'object') ra.scores = {};
      if (ra.scores[5] !== v) { ra.scores[5] = v; changed = true; }
    }
  }
  const stg = body.stage;
  if (stg && typeof stg === 'object' && (stg.ch || stg.idx)) {
    if (applyStageProgress(obj, stg.ch, stg.idx)) changed = true;
  }
  return { changed };
}

// 把当前加载账号的内存态换成磁盘上的最新内容（导入当前账号后的重载；useAccount 同名重入会短路，
// 所以这里用 resetState()+loadState() —— 两者都是 state.js 的公开导出）。
function reloadCurrentState() {
  const state = require('./state');
  state.flushSave();
  state.resetState();
  state.loadState();
}

// ---- 端点 ----

async function handle(req, res, p, u, ctx, send) {
  const log = ctx.log;
  // ⚠️ 一律用本文件的 sendJson，**不要用 http_router 传进来的 send**：
  // 那个只写 Content-Type（⇒ Transfer-Encoding: chunked），而 Android HttpURLConnection
  // 复用一条对端已按 Keep-Alive:timeout=5 关闭的连接时会报 "Connection reset"，
  // 服务端日志却显示 200 + 完整 body（2026-11-04 真机实证，排查了两轮）。
  // 保留 send 形参只为兼容 http_router 的调用签名。
  void send;
  if (!localhostOnly(req)) {
    log(`[saveadm] 403 非localhost来源 ${req.socket && req.socket.remoteAddress}`);
    return sendJson(res, 403, { ret: 0, msg: '仅允许本机调用', data: {} });
  }
  if (!checkKey(u, req)) {
    log('[saveadm] 403 key 不符');
    return sendJson(res, 403, { ret: 0, msg: 'key 不符', data: {} });
  }

  try {
    if (p === '/saveadm/status') return handleStatus(req, res, ctx);
    if (p === '/saveadm/export') return handleExport(req, res, ctx);
    if (p === '/saveadm/import') return await handleImport(req, res, ctx);
    if (p === '/saveadm/edit') return await handleEdit(req, res, ctx);
    return sendJson(res, 404, { ret: 0, msg: '未知 saveadm 端点', data: {} });
  } catch (e) {
    log('[saveadm] 失败: ' + (e && e.message));
    return sendJson(res, 200, { ret: 0, msg: '操作失败: ' + (e && e.message), data: {} });
  }
}

// ⚠️ 必须显式写 Content-Length（2026-11-04 真机实证）：
// 只写 Content-Type 时 node 走 Transfer-Encoding: chunked，而 Android HttpURLConnection
// 在 keep-alive 复用一条服务端已按 Keep-Alive:timeout=5 关闭的连接时，会读成
// "Connection reset"——服务端日志明明 200+完整 body，App 却报连接重置。
// 本文件的响应都是**小的完整 JSON**，定长最稳（同时省一次 chunked 分帧）。
function sendJson(res, status, obj) {
  const body = Buffer.from(JSON.stringify(obj), 'utf8');
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
  });
  return res.end(body);
}

function handleStatus(req, res, ctx) {
  const state = require('./state');
  const accounts = listSaveFiles().map(summarizeSaveFile).sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
  return sendJson(res, 200, { ret: 1, msg: '', data: { current: state.currentAccountName(), accounts } });
}

function handleExport(req, res, ctx) {
  // flushSave 确保内存里的当前档已落盘，导出的必然是完整进度
  const state = require('./state');
  const curFile = currentStateFile();
  let accountsDb = null;
  try { accountsDb = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8')); } catch (e) { accountsDb = { version: 1, lastAccount: '', accounts: {} }; }
  const saves = {};
  for (const fp of listSaveFiles()) {
    const name = path.basename(fp, '.json');
    try { saves[name] = JSON.parse(fs.readFileSync(fp, 'utf8')); } catch (e) { ctx.log('[saveadm] export 跳过坏档 ' + name + ': ' + e.message); }
  }
  // 当前档若不在 saves/ 枚举里（legacy player_state.json / PS_STATE_FILE 测试路径），按当前账号名补进 bundle，
  // 否则"备份→重装→导入"会丢当前进度
  const curKey = keyOf(state.currentAccountName()) || 'player';
  if (curFile && !listSaveFiles().includes(curFile)) {
    try { saves[curKey] = JSON.parse(fs.readFileSync(curFile, 'utf8')); } catch (e) { ctx.log('[saveadm] export 当前档读取失败: ' + e.message); }
  }
  const bundle = { version: 1, exportedAt: nowSec(), accounts: accountsDb, saves };
  const body = JSON.stringify(bundle);
  ctx.log(`[saveadm] export ${Object.keys(saves).length} 份存档（${body.length}B）`);
  // export 也是完整 JSON（可能 200KB+）：同样定长下发，理由见 sendJson 注释
  const buf = Buffer.from(body, 'utf8');
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': buf.length,
    'Cache-Control': 'no-store',
  });
  return res.end(buf);
}

// 写前自动备份：被覆盖的文件复制进 saves/_auto_backup_<ts>/（只保最近一次，够回滚用）。
// '__accounts__' 是特判名：代表 accounts.json 本身（不在 saves/ 下）。
function autoBackup(names) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const dir = path.join(SAVE_DIR, '_auto_backup_' + stamp);
  let n = 0;
  for (const name of names) {
    const fp = name === '__accounts__' ? ACCOUNTS_FILE : path.join(SAVE_DIR, name + '.json');
    if (!fs.existsSync(fp)) continue;
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(fp, path.join(dir, path.basename(fp)));
    n++;
  }
  return { dir: fs.existsSync(dir) ? dir : null, count: n };
}

async function handleImport(req, res, ctx) {
  let bundle;
  try { bundle = JSON.parse(await readBody(req)); } catch (e) { return sendJson(res, 200, { ret: 0, msg: 'bundle 不是合法 JSON: ' + e.message, data: {} }); }
  if (!bundle || typeof bundle !== 'object' || !bundle.saves || typeof bundle.saves !== 'object') {
    return sendJson(res, 200, { ret: 0, msg: 'bundle 结构不对（缺 saves）', data: {} });
  }
  const state = require('./state');
  if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR, { recursive: true });

  const names = Object.keys(bundle.saves).filter(n => NAME_RE.test(n));
  const skipped = Object.keys(bundle.saves).filter(n => !NAME_RE.test(n));
  if (!names.length) return sendJson(res, 200, { ret: 0, msg: 'bundle 里没有合法账号名存档', data: {} });
  const hasAccounts = !!(bundle.accounts && bundle.accounts.accounts && typeof bundle.accounts.accounts === 'object');

  // 写前统一备份：将被覆盖的存档 +（若有）accounts.json 原样收进 _auto_backup_<ts>/
  const bk = autoBackup(hasAccounts ? names.concat(['__accounts__']) : names);

  // ① 合并账号库：bundle 内账号覆盖同名条目，设备上其余账号保留；lastAccount 不动（避免偷换默认登录档）
  let accountsMerged = 0;
  if (hasAccounts) {
    let db = null;
    try { db = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8')); } catch (e) { db = { version: 1, lastAccount: '', accounts: {} }; }
    if (!db.accounts || typeof db.accounts !== 'object') db.accounts = {};
    for (const k of Object.keys(bundle.accounts.accounts)) {
      db.accounts[k] = bundle.accounts.accounts[k];
      accountsMerged++;
    }
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(db, null, 2));
  }

  // ② 合并存档：同名覆盖（已备份），设备上其余档保留
  const reloaded = [];
  for (const name of names) {
    const saveObj = bundle.saves[name];
    if (!saveObj || typeof saveObj !== 'object' || Array.isArray(saveObj)) { skipped.push(name); continue; }
    const fp = path.join(SAVE_DIR, name + '.json');
    fs.writeFileSync(fp, JSON.stringify(saveObj));
    // 命中当前加载账号：写文件 + 同步写当前 stateFile（测试隔离下两者可能不同路径）+ 重载内存
    if (keyOf(name) === keyOf(state.currentAccountName())) {
      const sf = state.getStateFile();
      if (path.resolve(sf) !== path.resolve(fp)) { try { fs.writeFileSync(sf, JSON.stringify(saveObj)); } catch (e) { /* 测试树下只读时忽略 */ } }
      reloadCurrentState();
      reloaded.push(name);
    }
    ctx.log(`[saveadm] import 写入 saves/${name}.json`);
  }
  return sendJson(res, 200, {
    ret: 1, msg: `导入完成：${names.length} 份存档、${accountsMerged} 个账号条目`,
    data: { imported: names, skipped, accountsMerged, reload: reloaded, backupDir: bk.dir || '' },
  });
}

async function handleEdit(req, res, ctx) {
  let body;
  try { body = JSON.parse(await readBody(req)); } catch (e) { return sendJson(res, 200, { ret: 0, msg: 'body 不是合法 JSON: ' + e.message, data: {} }); }
  if (!body || typeof body !== 'object') return sendJson(res, 200, { ret: 0, msg: 'body 结构不对', data: {} });

  const state = require('./state');
  const ACC = require('./accounts');
  const targetName = body.acc ? String(body.acc) : state.currentAccountName();
  if (!targetName || !NAME_RE.test(targetName)) return sendJson(res, 200, { ret: 0, msg: '账号名不合法', data: {} });

  const isCurrent = keyOf(targetName) === keyOf(state.currentAccountName());
  let result;
  if (isCurrent) {
    // 内存态是唯一真相源（退出/落盘会覆盖文件），必须改内存 + saveState
    result = applyEditFields(state.S, body);
    if (result.changed) state.saveState({ force: true });
    ctx.log(`[saveadm] edit 当前账号 ${targetName}${result.changed ? ' 已应用并落盘' : '（无变化）'}`);
  } else {
    const fp = path.join(SAVE_DIR, keyOf(targetName) + '.json');
    if (!fs.existsSync(fp)) return sendJson(res, 200, { ret: 0, msg: `saves/${keyOf(targetName)}.json 不存在`, data: {} });
    let obj;
    try { obj = JSON.parse(fs.readFileSync(fp, 'utf8')); } catch (e) { return sendJson(res, 200, { ret: 0, msg: '存档 JSON 解析失败: ' + e.message, data: {} }); }
    autoBackup([keyOf(targetName)]);
    result = applyEditFields(obj, body);
    if (result.changed) fs.writeFileSync(fp, JSON.stringify(obj));
    ctx.log(`[saveadm] edit 文件档 ${targetName}${result.changed ? ' 已应用' : '（无变化）'}`);
  }
  if (!result.changed) return sendJson(res, 200, { ret: 1, msg: '没有可应用的改动（数值未变或字段不在编辑范围）', data: { changed: false } });

  // 返回编辑后的摘要（isCurrent 读内存，否则重读文件）
  let sum;
  if (isCurrent) {
    const ra = state.S.roleAsset || {};
    sum = { roleName: state.S.roleName || '', level: ra.level || 1, gold: ra.gold || 0, gold_given: ra.gold_given || 0, silver: ra.silver || 0, vit: (ra.scores || {})[5] || 0 };
  } else {
    sum = summarizeSaveFile(path.join(SAVE_DIR, keyOf(targetName) + '.json'));
  }
  return sendJson(res, 200, { ret: 1, msg: isCurrent ? '已应用（回游戏重新登录生效）' : '已写入存档文件（下次登录该账号生效）', data: { changed: true, acc: targetName, summary: sum } });
}

module.exports = { handle, ADMIN_KEY, mainMapId };
