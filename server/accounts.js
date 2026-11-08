// 账号库（注册 / 登录 / token / 按账号存档路由）。
//
// 【为什么需要】客户端的 uid 原本是 APK smali 补丁里写死的 "29311205"（绕过 B 站 SDK 时硬编码的
// 假 UserID），服务端 m_auth_key_tos 只 log 不校验，全服共用一份 server/player_state.json。
// 要做多账号必须先有"账号 → 存档文件"的映射，这个文件就是那张映射表。
//
// 【存储布局】
//   server/accounts.json     账号库（明文 JSON）
//   server/saves/<save>.json 每账号一份存档（结构与旧 player_state.json 完全一致）
//   server/player_state.json 旧的单一存档 —— bootstrap() 首次运行时复制成 saves/player.json
//                            后即不再被读写（保留原文件当备份，勿删）
//
// 【二百九十三：单机服无密码】密码输入/校验整体移除，只校验账号名：这是每台设备跑一个
// 本地服务的单机架构，登录面板没有密码框，账号名就是唯一凭证。旧账号记录里残留的
// salt/hash 字段一律忽略（login 不再校验口令）；新注册的账号不再写这两个字段。
//
// 【账号名约束】^[A-Za-z0-9_]{2,16}$ —— 刻意只允许 ASCII：这个名字同时要走
//   ① HTTP query（?name=）②ETF String 字段 m_auth_key_tos.uid ③Windows 文件名。
//   限成 ASCII 一次性消掉三处的编码/转义/大小写问题。比较一律按小写（不区分大小写）。
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { log } = require('./log');

const ACCOUNTS_FILE = path.join(__dirname, 'accounts.json');
const SAVE_DIR = path.join(__dirname, 'saves');
const LEGACY_STATE = path.join(__dirname, 'player_state.json');

const NAME_RE = /^[A-Za-z0-9_]{2,16}$/;
// APK smali 补丁 JoinMainImpl.login() 写死的 SDK UserID。客户端 Lua 补丁没生效时
// m_auth_key_tos.uid 就是这个值 —— 回落到默认账号，保证"补丁失效也能进游戏"。
const LEGACY_UID = '29311205';
const DEFAULT_ACCOUNT = 'player';

let DB = { version: 1, lastAccount: '', accounts: {} };

const keyOf = name => String(name || '').toLowerCase();

function newToken() {
  return crypto.randomBytes(16).toString('hex');
}

function persist() {
  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(DB, null, 2));
  } catch (e) {
    log('[account] 账号库写盘失败', e.message);
  }
}

function readDb() {
  try {
    const d = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8'));
    DB = {
      version: d.version || 1,
      lastAccount: d.lastAccount || '',
      accounts: d.accounts || {},
    };
    return true;
  } catch (e) {
    return false;
  }
}

// ---- 校验 ----
function checkName(name) {
  if (!name) return '请输入账号名';
  if (!NAME_RE.test(name)) return '账号名只能用 2-16 位字母/数字/下划线';
  return null;
}

// ---- 查询 ----
function get(name) {
  return DB.accounts[keyOf(name)] || null;
}
function list() {
  return Object.values(DB.accounts)
    .map(a => ({ name: a.name, hasPass: !!a.hash, lastLoginAt: a.lastLoginAt || 0 }))
    .sort((x, y) => y.lastLoginAt - x.lastLoginAt);
}
// 「记住上次输入」的服务端通道（登录面板 last 为空时预填）：只在真实登录/注册后更新的
// lastAccount 原值，**不**回落到 DEFAULT_ACCOUNT —— 否则出厂包/全新安装会默认填进 player 档
// （二百九十三：出厂档不预填，必须手动输入）。
const lastAccountName = () => DB.lastAccount || '';
function saveFileOf(acc) {
  return path.join(SAVE_DIR, acc.save || `${keyOf(acc.name)}.json`);
}

// ---- 注册 / 登录 ----
// pass 参数保留但忽略（二百九十三去密码）：旧调用方（http_router / 旧探针带 pass=）零改动。
function register(name, pass) {
  const e1 = checkName(name); if (e1) return { ok: false, err: e1 };
  if (get(name)) return { ok: false, err: '账号已存在，请直接登录' };
  const now = Math.floor(Date.now() / 1000);
  const acc = {
    name: String(name),
    token: newToken(),
    save: `${keyOf(name)}.json`,
    createdAt: now,
    lastLoginAt: now,
  };
  DB.accounts[keyOf(name)] = acc;
  DB.lastAccount = acc.name;
  persist();
  log(`[account] 注册新账号 ${acc.name} → saves/${acc.save}`);
  return { ok: true, acc, token: acc.token };
}

function login(name, pass) {
  const e1 = checkName(name); if (e1) return { ok: false, err: e1 };
  const acc = get(name);
  if (!acc) return { ok: false, err: '账号不存在，请先注册' };
  // 单机服只校验账号名（二百九十三）：pass 一概忽略；旧档残留的 hash 也不再校验。
  // token 每次登录轮换：旧客户端残留的 token 自然失效（等于"顶号"）
  acc.token = newToken();
  acc.lastLoginAt = Math.floor(Date.now() / 1000);
  DB.lastAccount = acc.name;
  persist();
  return { ok: true, acc, token: acc.token };
}

// TCP 侧握手校验（m_auth_key_tos）。uid 是账号名，token 走 session_id 字段。
// 旧带密码时代的账号（残留 hash）仍要求 token 对得上；新注册的无 hash 账号不校验 token。
function resolveLogin(uid, token) {
  const u = String(uid || '');
  if (!u) return { ok: false, err: 'uid 为空' };
  if (u === LEGACY_UID) {
    const acc = get(DB.lastAccount) || get(DEFAULT_ACCOUNT) || Object.values(DB.accounts)[0];
    if (!acc) return { ok: false, err: '账号库为空' };
    return { ok: true, acc, legacy: true };
  }
  const acc = get(u);
  if (!acc) return { ok: false, err: '账号不存在' };
  if (acc.hash && String(token || '') !== acc.token) return { ok: false, err: 'token 失效，请重新登录' };
  DB.lastAccount = acc.name;
  persist();
  return { ok: true, acc };
}

// 客户端只有一个按钮（登录面板的 btnLogin 改不了文案，见 LoginPanel.lua psSetBtnText），
// 所以给它一个"有则登录、无则注册"的入口。created 让客户端能提示"注册成功"还是"登录中"。
function loginOrRegister(name, pass) {
  const e1 = checkName(name); if (e1) return { ok: false, err: e1 };
  if (get(name)) return login(name, pass);
  const r = register(name, pass);
  if (r.ok) r.created = true;
  return r;
}

// ---- 启动引导：建目录 + 迁移旧的单一存档 ----
function bootstrap() {
  if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR, { recursive: true });
  if (readDb() && Object.keys(DB.accounts).length) return;

  DB = { version: 1, lastAccount: '', accounts: {} };
  const r = register(DEFAULT_ACCOUNT, '');
  const acc = r.acc;
  const dst = saveFileOf(acc);
  if (fs.existsSync(LEGACY_STATE) && !fs.existsSync(dst)) {
    fs.copyFileSync(LEGACY_STATE, dst);
    log(`[account] 迁移旧存档 player_state.json → saves/${acc.save}（原文件保留作备份，之后不再读写）`);
  } else {
    log(`[account] 建立默认账号 ${acc.name}（无旧存档，首次登录发初始誓灵）`);
  }
}

// 服务端启动时该加载哪个账号的存档
function bootAccount() {
  return get(DB.lastAccount) || get(DEFAULT_ACCOUNT) || Object.values(DB.accounts)[0] || null;
}

module.exports = {
  ACCOUNTS_FILE, SAVE_DIR, LEGACY_STATE, LEGACY_UID, DEFAULT_ACCOUNT, NAME_RE,
  bootstrap, bootAccount, get, list, register, login, loginOrRegister, resolveLogin, saveFileOf,
  lastAccountName, checkName,
  // 测试用：把库指到临时目录 / 直接读写内存库
  _setDb: d => { DB = d; },
  _getDb: () => DB,
};
