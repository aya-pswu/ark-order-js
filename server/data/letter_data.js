// 固定邮件数据（调研-固定邮件两封.md）
//
// 两封系统信共用 letter_code=10000（CfgLetter 通配模板：title/sender/content 全是 ~str，
// 服务端下发的字符串参数即最终显示文本；⚠️ 参数里的 ~mine 不会被替换——那个替换只发生在
// 模板层，code 10000 的模板没有它）。富文本支持 \n 与 <color=#e68302ff>…</color>。
//
// 第②封（公益声明信）正文必须防明文扫描：密文存 server/data/letter_post.bin
//   （base64( utf8(正文) XOR KEY )），decodePostText() 只在组包瞬间解码。
//   存档里该信只落 fixed:2 引用，不落正文（见 handlers/letter.js）。
//   改文案：改明文 txt → node tools/bc_cmp/encode_letter_post.js <txt> → 提交新 .bin。
const fs = require('fs');
const path = require('path');

const CODE_GENERIC = 10000;   // CfgLetter.letter[10000]：title/sender/content 全 ~str
const SENDER_FUNKY = 'From : Funky社';
const MAX_LETTERS = 500;      // 客户端面板「邮件：{0}/500」

// 测试贡献者名单（单一数据源，与公告欢迎页共用，见 contributor_names.js）
const CONTRIBUTORS = require('./contributor_names');

// 第②封 XOR 密钥：按字节拼装，避免在源码里形成可读词（防扫描口径见调研文档 §4）
const POST_KEY = Buffer.from([0x46, 0x75, 0x6e, 0x6b, 0x79, 0x5f, 0x1f, 0x33, 0x7c, 0x0a]);

// 第①封：注册欢迎信（正文不敏感，明文即可）。附件：称号盒「正在摸鱼的」+ 黄金史莱喵礼包
// （21500127 使用产出走 vit ITEM_USE 已有链路：代币 31141007 → 誓灵 1141007 + 约定之契×10 + 水晶×1200）
const WELCOME = {
  fixed: 1,
  title: ['欢迎来到方舟指令JS'],
  sender: SENDER_FUNKY,
  text: [
    '月有圆缺阴晴，风会穿梭来去。\n' +
    '时光一去永不回，往事只能回味。\n' +
    '\n' +
    '欢迎来到方舟指令JS，各位御灵士游戏愉快。\n' +
    '\n' +
    '谨向以下参与测试的贡献者致谢：\n' +
    CONTRIBUTORS.join('、') + '\n' +
    '\n' +
    '—— Funky社',
  ],
  goods: [
    { id: 25001015, val: 1 },   // 称号盒「正在摸鱼的」（titleID 15，前缀）
    { id: 21500127, val: 1 },   // 黄金史莱喵礼包
  ],
};

// 第②封：注册满 72h 后首次登录的公益声明信。正文只存在于 letter_post.bin（密文）。
const POST = {
  fixed: 2,
  title: ['致御灵士：关于方舟指令JS'],
  sender: SENDER_FUNKY,
  goods: [
    { id: 25001131, val: 1 },   // 称号盒「名侦探」（titleID 131，后缀）
  ],
};

const POST_BIN = path.join(__dirname, 'letter_post.bin');

let postCache = null; // 进程内解码一次（.bin 只读）
function decodePostText() {
  if (postCache !== null) return postCache;
  const raw = fs.readFileSync(POST_BIN);
  const body = Buffer.from(raw.toString('utf8').trim(), 'base64');
  const out = Buffer.alloc(body.length);
  for (let i = 0; i < body.length; i++) out[i] = body[i] ^ POST_KEY[i % POST_KEY.length];
  postCache = out.toString('utf8');
  return postCache;
}

module.exports = { CODE_GENERIC, SENDER_FUNKY, MAX_LETTERS, WELCOME, POST, decodePostText, POST_BIN };
