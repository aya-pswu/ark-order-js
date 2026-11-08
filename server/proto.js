// 解析反编译的 Proto.lua / ProtoAlias.lua，生成消息 schema 表
const fs = require('fs');
const path = require('path');

function parseProto(luaSrc) {
  const protos = {};
  let cur = null;
  let fieldIdx = -1; // -1 期望字段名 0 期望类型 1 期望子类型
  let field = null;
  for (let line of luaSrc.split(/\r?\n/)) {
    line = line.trim();
    const m = line.match(/^([mp]_\w+)\s*=\s*\{/);
    if (m) {
      cur = { name: m[1], fields: [] };
      protos[m[1]] = cur;
      field = null;
      fieldIdx = -1;
      continue;
    }
    if (/^\}/.test(line)) { fieldIdx = -1; field = null; continue; }
    if (!cur) continue;
    const sm = line.match(/^"([^"]*)",?\s*$/);
    if (!sm) continue;
    if (fieldIdx === -1) {
      field = [sm[1], null, null];
      cur.fields.push(field);
      fieldIdx = 0;
    } else if (fieldIdx === 0) {
      field[1] = sm[1];
      fieldIdx = 1;
    } else if (fieldIdx === 1) {
      field[2] = sm[1] === 'null' ? null : sm[1];
      fieldIdx = -1;
      field = null;
    }
  }
  for (const name in protos) {
    protos[name].fields = protos[name].fields.filter(f => f[1]);
  }
  return protos;
}

function parseAlias(luaSrc) {
  const alias = {};
  const byId = {};
  const re = /^([mp]_\w+)\s*=\s*(\d+)\s*,?\s*$/;
  for (let line of luaSrc.split(/\r?\n/)) {
    const m = line.trim().match(re);
    if (m) {
      alias[m[1]] = parseInt(m[2]);
      byId[parseInt(m[2])] = m[1];
    }
  }
  return { alias, byId };
}

function load(keyLuaDir) {
  const protoSrc = fs.readFileSync(path.join(keyLuaDir, 'Proto_new.lua'), 'utf8');
  const aliasSrc = fs.readFileSync(path.join(keyLuaDir, 'ProtoAlias_new.lua'), 'utf8');
  const protos = parseProto(protoSrc);
  const { alias, byId } = parseAlias(aliasSrc);
  return { protos, alias, byId };
}

module.exports = { load };

if (require.main === module) {
  const { protos, alias, byId } = load(path.join(__dirname, '..', 'tools', 'key_lua'));
  console.log('protos:', Object.keys(protos).length, 'alias:', Object.keys(alias).length);
  console.log('m_auth_key_toc:', JSON.stringify(protos['m_auth_key_toc']));
  console.log('m_role_detail_toc:', JSON.stringify(protos['m_role_detail_toc']));
  console.log('p_role_data fields:', protos['p_role_data'].fields.map(f => f[0]).join(','));
  console.log('alias m_auth_key_toc =', alias['m_auth_key_toc']);
}
