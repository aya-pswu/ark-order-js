#!/usr/bin/env node
// 闸门：grantGoods 的 conn 透传审计（工作日志 二百七十七，"研究完成后不给"工单）。
//
// 不变量（一句话）：**grantGoods 只要有 conn 在手，就必须作为第 3 参透传**。
// grantGoods 的两个特殊分支靠 conn 面向客户端：
//   - 誓灵代币（30000000+type，form=3）→ collab.grantServant(conn)：3s 后 m_servant_update_toc
//     宣告 + 清 pendingAnnounce + 补推名气。漏传 = 静默入档，玩家"领了/研究完了不给"，
//     重登全量 brief 才补见（先例：vit.js 黄金史莱喵礼包；本案：ark 54004 加塔诺托亚）。
//   - 称号盒（25001xxx，form=2）→ TITLE.pushTitleUpdate(conn)：同步 m_role_title_update_toc。
//     漏传 = 称号入册但客户端不推（先例：dare 首通「从前那个」）。
// 两个分支对普通物品零影响（返回值/入库行为不变），所以"透传"永远安全，"不透传"只有
// 在数据表将来扩进代币/称号盒时才爆炸——而那种爆炸完全静默。故全库零豁免。
//
// 用法：node tools/audit_grant_goods_conn.js            → 违规即 exit 1（可挂闸门）
//       node tools/audit_grant_goods_conn.js --verbose  → 同时列出全部调用点
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIRS = [path.join(ROOT, 'server', 'handlers'), path.join(ROOT, 'server')];
const files = [];
for (const d of DIRS) {
  for (const f of fs.readdirSync(d)) {
    if (f.endsWith('.js') && !f.endsWith('.bak') && fs.statSync(path.join(d, f)).isFile()) {
      files.push(path.join(d, f));
    }
  }
}

// 取一行内可能的调用起点（跨行调用手数：全库现状 grantGoods 调用均为单行；跨行会被
// 括号扫描按"逗号不足"误报，届时先改写调用再上闸门——这里刻意不静默吞掉）。
// lookbehind 只排"单词字符"不排点号——`L.grantGoods(` / `arkMod.` 等命名空间调用必须计入
const CALL_RE = /(?<![\w])(?:L\.)?grantGoods\s*\(/g;

// 从 index 处做括号/字符串感知的实参提取，返回顶层逗号数（n 个实参 = n-1 个逗号）
function countTopLevelCommas(src, openIdx) {
  let depth = 0, commas = 0, i = openIdx;
  let inS = null; // ' " `
  while (i < src.length) {
    const c = src[i];
    if (inS) {
      if (c === '\\') { i += 2; continue; }
      if (c === inS) inS = null;
      i++; continue;
    }
    if (c === '\'' || c === '"' || c === '`') { inS = c; i++; continue; }
    if (c === '(' || c === '{' || c === '[') { depth++; }
    else if (c === ')' || c === '}' || c === ']') {
      depth--;
      if (depth === 0) return commas;
    } else if (c === ',' && depth === 1) commas++;
    i++;
  }
  return -1; // 括号不闭合（跨行调用）→ 由调用方按违规处理
}

let total = 0, bad = [];
const verbose = process.argv.includes('--verbose');
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  const lines = src.split('\n');
  let m;
  CALL_RE.lastIndex = 0;
  while ((m = CALL_RE.exec(src)) !== null) {
    const lineNo = src.slice(0, m.index).split('\n').length;
    const line = lines[lineNo - 1];
    // 函数定义/注释不是调用
    if (/function\s+grantGoods\s*\(/.test(line)) continue;
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;
    total++;
    const commas = countTopLevelCommas(src, m.index + m[0].length - 1);
    if (commas < 2) bad.push(`${rel}:${lineNo}  ${line.trim()}`);
  }
}

if (verbose) {
  console.log(`grantGoods 调用点共 ${total} 处：`);
}
if (bad.length) {
  console.error(`FAIL: ${bad.length}/${total} 处 grantGoods 未透传 conn（第 3 参）——`);
  for (const b of bad) console.error('  ' + b);
  console.error('口径见文件头注释：代币分支（3s 宣告）与称号盒分支（同步推送）都靠 conn 面向客户端，');
  console.error('漏传 = 静默入档（先例：二百七十七 ark 54004 加塔诺托亚 / dare「从前那个」称号盒）。');
  process.exit(1);
}
console.log(`OK: grantGoods 全部 ${total} 处调用均已透传 conn（零豁免，二百七十七口径）`);
