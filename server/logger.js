// 彩色日志内核（零依赖）。
//
// 【为什么独立成一个文件】log.js 被 state.js / accounts.js 直接依赖，而 lib.js 又依赖 log.js，
// 三者互相牵扯（历史上有过循环依赖事故）。配色/排版这种纯展示逻辑单独放这里，log.js 只做
// 「兼容旧调用 → 推断等级 → 转交内核」，业务代码（539 处 log(...) 调用点）一行都不用改。
//
// 【视觉规范】参考 G:\EVE\EveJS-v0.12.2\server\src\utils\logger —— 时间 + 等级徽章 + 消息：
//   15:17:06  INFO   [ClientEntityStandings] Loaded 7343 type thresholds.
//   OK = 绿底、DB = 绿字、INFO = 蓝底、WARN = 黄底、ERROR = 红底、PKT/NET = 暗色（降噪）
//
// 【环境变量】
//   ARK_NO_COLOR=1   强制关色（重定向到文件时自动关，无需手设）
//   ARK_COLOR=1      强制开色（非 TTY 也要颜色时用）
//   FORCE_COLOR=1    同上（通用约定，picocolors/chalk 都认）
'use strict';

const DIVIDER = '='.repeat(72);

// ---------------------------------------------------------------- 颜色开关
function detectColor() {
  if (process.env.ARK_NO_COLOR) return false;
  if (process.env.FORCE_COLOR) return String(process.env.FORCE_COLOR) !== '0';
  if (process.env.ARK_COLOR) return String(process.env.ARK_COLOR) !== '0';
  return !!(process.stdout && process.stdout.isTTY);
}

let ON = detectColor();

const ANSI = {
  reset: [0, 0], bold: [1, 22], dim: [2, 22], italic: [3, 23], underline: [4, 24],
  black: [30, 39], red: [31, 39], green: [32, 39], yellow: [33, 39],
  blue: [34, 39], magenta: [35, 39], cyan: [36, 39], white: [37, 39], gray: [90, 39],
  bgRed: [41, 49], bgGreen: [42, 49], bgYellow: [43, 49], bgBlue: [44, 49],
  bgMagenta: [45, 49], bgCyan: [46, 49], bgGray: [100, 49],
};

const C = {};
for (const k of Object.keys(ANSI)) {
  const [open, close] = ANSI[k];
  C[k] = s => (ON ? `\x1b[${open}m${s}\x1b[${close}m` : String(s));
}

// 剥掉 ANSI 转义（写日志文件 / 非 TTY 输出时用）
const strip = s => String(s).replace(/\x1b\[[0-9;]*m/g, '');

function setColor(on) { ON = !!on; }
function colorOn() { return ON; }

// ---------------------------------------------------------------- 等级
// pad 到 5 个字符（与 EveJS 的 padLevel 一致，OK→"OK   "），外面再包一层空格当徽章。
// 所有等级最终都渲染成 7 个字符宽，列才能对齐。
const LEVELS = {
  OK: { render: l => C.bgGreen(C.black(` ${l} `)) },
  DB: { render: l => C.green(C.bold(` ${l} `)) },
  INFO: { render: l => C.bgBlue(C.white(` ${l} `)) },
  WARN: { render: l => C.bgYellow(C.black(` ${l} `)) },
  ERROR: { render: l => C.bgRed(C.white(` ${l} `)) },
  PKT: { render: l => C.cyan(C.dim(` ${l} `)) },
  NET: { render: l => C.gray(` ${l} `) },
};

function clock(date = new Date()) {
  return date.toISOString().slice(11, 19); // HH:MM:SS
}

// 消息内高亮：领域标签 [ark]、IP、协议名、hex 尾巴
// 开头的 !! / ?? / [*] 是旧式调用的等级标记，已被徽章取代，去掉避免重复
function paint(msg) {
  return String(msg)
    .replace(/^(?:!!|\?\?|\[\*\])\s*/, '')
    .replace(/\[(\d+\.\d+\.\d+\.\d+)(:\d+)?\]/g, (m, ip, port) => C.dim(`[${ip}${port || ''}]`))
    .replace(/^\[([A-Za-z0-9_*]+)\]/, (m, tag) => C.cyan(`[${tag}]`))
    .replace(/(hex[:：]\s*)([0-9a-fA-F]*)/g, (m, p, h) => p + C.dim(h))
    .replace(/\b(m_[a-z0-9_]+)/g, m => C.bold(C.white(m)))
    .replace(/(!!\s*)/g, m => C.bold(C.red(m)))
    .replace(/(\?\?\s*)/g, m => C.bold(C.yellow(m)));
}

function fmt(level, msg) {
  const conf = LEVELS[level] || LEVELS.INFO;
  const badge = conf.render(String(level).padEnd(5, ' '));
  return `${C.dim(clock())} ${badge} ${paint(msg)}`;
}

// ---------------------------------------------------------------- 排版件
function raw(s) { process.stdout.write(s + '\n'); }

function line() { raw(C.dim(DIVIDER)); }
function blank() { raw(''); }

/**
 * 启动小节：一行标题 + 若干 label/value 行，上下各一条分隔线。
 * @param {string} title
 * @param {Array<{label:string, value:string}>} rows
 */
function section(title, rows = []) {
  line();
  raw(` ${C.bold(C.white(title))}`);
  for (const r of rows) {
    if (!r) continue;
    const label = String(r.label == null ? '' : r.label).padEnd(12, ' ');
    const value = String(r.value == null ? '' : r.value);
    if (!value) continue;
    raw(`   ${C.cyan(C.bold(label))} ${C.white(value)}`);
  }
  line();
}

// ---------------------------------------------------------------- Banner
// pyfiglet standard 字体。宽度 46，在 72 列分隔线里居中留白刚好。
const LOGO_TOP = [
  '    _    ____  _  __',
  '   / \\  |  _ \\| |/ /',
  '  / _ \\ | |_) | \' / ',
  ' / ___ \\|  _ <| . \\ ',
  '/_/   \\_\\_| \\_\\_|\\_\\',
];
const LOGO_BOTTOM = [
  '  ___  ____  ____  _____ ____        _ ____  ',
  ' / _ \\|  _ \\|  _ \\| ____|  _ \\      | / ___| ',
  '| | | | |_) | | | |  _| | |_) |  _  | \\___ \\ ',
  '| |_| |  _ <| |_| | |___|  _ <  | |_| |___) |',
  ' \\___/|_| \\_\\____/|_____|_| \\_\\  \\___/|____/ ',
];

function banner() {
  const width = DIVIDER.length - 2;
  const block = (rows, color) => {
    const w = rows.reduce((m, r) => Math.max(m, r.length), 0);
    const pad = ' '.repeat(Math.max(0, Math.floor((width - w) / 2)));
    for (const r of rows) raw(color(` ${pad}${r}`));
  };

  const caption = 'Ark Order JS  ·  方舟指令本地服 bootstrap';
  const pad = ' '.repeat(Math.max(0, Math.floor((width - caption.length) / 2)));

  line();
  block(LOGO_TOP, C.cyan);
  blank();
  block(LOGO_BOTTOM, C.white);
  blank();
  raw(` ${pad}${C.bold(C.white('Ark Order JS'))}${C.dim('  ·  方舟指令本地服 bootstrap')}`);
  line();
}

module.exports = {
  C, strip, setColor, colorOn,
  clock, fmt, paint,
  raw, line, blank, section, banner,
  DIVIDER,
};
