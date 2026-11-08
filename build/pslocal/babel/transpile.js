// 批量 ES5 转译（Node API，避开 babel.cmd 在含空格路径下的引号问题）
// 用法: node transpile.js <ps_server 目录>
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const root = process.argv[2];
if (!root) { console.error('usage: node transpile.js <dir>'); process.exit(1); }

const opts = {
  presets: [[require.resolve('@babel/preset-env'), { targets: { ie: '9' }, modules: false }]],
  sourceType: 'script',
  parserOpts: { allowReturnOutsideFunction: true },
  babelrc: false,
  configFile: false,
  compact: false,
};

let count = 0, failed = 0;
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name);
    const st = fs.statSync(fp);
    if (st.isDirectory()) { walk(fp); continue; }
    if (!name.endsWith('.js')) continue;
    try {
      const src = fs.readFileSync(fp, 'utf8');
      const out = babel.transformSync(src, Object.assign({ filename: fp }, opts));
      fs.writeFileSync(fp, out.code, 'utf8');
      count++;
    } catch (e) {
      failed++;
      console.error('FAIL ' + fp + ': ' + e.message);
      if (failed > 5) process.exit(1);
    }
  }
}
walk(root);
console.log('transpiled ' + count + ' files, failed ' + failed);
if (failed > 0) process.exit(1);
