// 日志门面（独立于 lib，避免 state↔lib 循环依赖）
//
// 【兼容层】全项目有 539 处 log(...) / L.log(...) 调用，形如：
//   log(`[ark] 登录同步：燃料 ...`)
//   log('!! handler 异常', name, e.message)
//   log('[*] 本地服启动完成')
// 这些一行都不用改：log() 会根据消息内容推断等级（见 inferLevel）并自动着色。
// 新代码建议直接用语义方法：L.log.ok/db/info/warn/err/pkt。
//
// 【双写】控制台（彩色 ANSI） + logs/server.log（纯文本，已剥离转义）。
//   日志超过 8MB 自动轮转成 server-<时间戳>.log，启动超限也会先轮转一次。
const fs = require('fs');
const path = require('path');
const L = require('./logger');

const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'server.log');
const MAX_LOG_SIZE = 8 * 1024 * 1024;

const logs = [];

// ---------------------------------------------------------------- 轮转
function rotateIfNeeded() {
  try {
    if (!fs.existsSync(LOG_FILE)) return;
    if (fs.statSync(LOG_FILE).size < MAX_LOG_SIZE) return;
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    fs.renameSync(LOG_FILE, path.join(LOG_DIR, `server-${stamp}.log`));
  } catch (e) { /* 轮转失败不阻塞启动 */ }
}

// ---------------------------------------------------------------- 等级推断
// 顺序即优先级，命中即返回。
const RULES = [
  [/^!!/, 'ERROR'],
  [/^\?\?/, 'WARN'],
  [/^\[\*\]/, 'OK'],
  [/^\[(state|account|db|save)\]/i, 'DB'],
  [/(失败|异常|崩溃|错误|Error|ERROR|!!|throw|ReferenceError|TypeError)/, 'ERROR'],
  [/(警告|超时|重试|不足|上限|不合法|非法|已封|丢弃)/, 'WARN'],
  [/(存档|载入|落盘|迁移|saveState|loadState)/, 'DB'],
];

function inferLevel(text) {
  for (const [re, level] of RULES) if (re.test(text)) return level;
  return 'INFO';
}

// ---------------------------------------------------------------- 核心
function serialize(a) {
  return a.map(x => (typeof x === 'string'
    ? x
    : JSON.stringify(x, (k, v) => (typeof v === 'bigint' ? v.toString() : v)))).join(' ');
}

/**
 * 写一条日志。
 * @param {string} [level] 显式等级（OK/DB/INFO/WARN/ERROR/PKT/NET）；省略则自动推断
 * @param {...any} rest 消息片段
 */
function log(level, ...rest) {
  const KNOWN = ['OK', 'DB', 'INFO', 'WARN', 'ERROR', 'PKT', 'NET'];
  let lv;
  let parts;
  if (typeof level === 'string' && KNOWN.indexOf(level) !== -1 && rest.length) {
    lv = level;
    parts = rest;
  } else {
    parts = level === undefined ? rest : [level, ...rest];
    lv = inferLevel(serialize(parts));
  }
  return emit(lv, parts);
}

function emit(lv, parts) {
  const text = serialize(parts);
  const colored = L.fmt(lv, text);
  const plain = `${L.clock()} ${String(lv).padEnd(5, ' ')} ${L.strip(text)}`;

  process.stdout.write(colored + '\n');
  logs.push(plain);
  if (logs.length > 5000) logs.splice(0, 1000);
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    fs.appendFileSync(LOG_FILE, plain + '\n');
  } catch (e) { /* 日志写盘失败不影响主流程 */ }
  return text;
}

// ---------------------------------------------------------------- 语义方法
const at = lv => (...a) => emit(lv, a);

log.ok = at('OK');
log.db = at('DB');
log.info = at('INFO');
log.warn = at('WARN');
log.err = at('ERROR');
log.error = log.err;
log.pkt = at('PKT');
log.net = at('NET');

// 排版件
log.line = () => L.line();
log.blank = () => L.blank();
log.raw = s => L.raw(s);
log.section = (title, rows) => L.section(title, rows);
log.banner = () => L.banner();
log.strip = L.strip;
log.rotate = rotateIfNeeded;

module.exports = { log, logs, LOG_FILE, LOG_DIR };

// 启动即轮转一次（当前 server.log 已 70MB+，归档保留不删）
try {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  rotateIfNeeded();
} catch (e) { /* ignore */ }
