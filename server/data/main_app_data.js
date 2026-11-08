// 主城快捷面板（MainAppPanel，主城左侧"平板桌面"式应用页）的 app 全集。
// 来源：客户端 CfgMain.mainApps（2021 静态配置；运行时解析，同 relic_data.js 家规）。
//
// 数据链（调研-主城快捷面板空白.md）：
//   服务端 m_main_app_info_toc{pages:[{page, positions:[{id,val}]}]}
//   → 客户端 MainMgr.initAppInfo → updateAppPositions 走 getApp(id,true) **强制通道**
//     （不查 MainMgr.app 缓存、不做 isAppFuncOpen 判定），逐格重建页面 —— 与缓存冷热无关，
//     这是本协议能治"重连后快捷面板空白"的根本原因（initByConfig 兜底路径会被热缓存吞掉）。
//   val 编码 = tileX + tileY*1000（1-based；客户端 MainAppPageVO.convertToServerData 同款，
//   updateAppPositions 以 val%1000 / floor(val/1000) 解码）。格子规模 MainConst：7×5。
const fs = require('fs');
const path = require('path');

const MAIN_APPS = (() => {
  const txt = fs.readFileSync(path.join(__dirname, '..', '..', 'tools', 'lua_src', 'CfgMain.lua'), 'utf8');
  const at = txt.indexOf('mainApps = {');
  if (at < 0) throw new Error('CfgMain.lua 里找不到 mainApps');
  let depth = 0, end = -1;
  for (let i = txt.indexOf('{', at); i < txt.length; i++) {
    if (txt[i] === '{') depth++;
    else if (txt[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end < 0) throw new Error('mainApps 块未闭合');

  // 按顶层条目切分：条目闭合（depth 2→1）即一条
  const entries = [];
  let cur = '';
  depth = 0;
  for (const ch of txt.slice(at, end + 1)) {
    cur += ch;
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 1) { entries.push(cur); cur = ''; }
    }
  }

  const apps = [];
  for (const e of entries) {
    const idM = e.match(/typeID\s*=\s*(\d+)/);
    const itemNameM = e.match(/itemName\s*=\s*"([^"]*)"/);
    const posM = e.match(/pos\s*=\s*Vector2\((\d+),\s*(\d+)\)/);
    if (!idM || !itemNameM || !posM) continue;
    const num = (re, dft) => { const m = e.match(re); return m ? parseInt(m[1]) : dft; };
    apps.push({
      typeID: parseInt(idM[1]),
      name: (e.match(/\bname\s*=\s*"([^"]*)"/) || [])[1] || '',
      itemName: itemNameM[1],
      pos: { x: parseInt(posM[1]), y: parseInt(posM[2]) },
      width: num(/width\s*=\s*(\d+)/, 1),
      height: num(/height\s*=\s*(\d+)/, 1),
      shelfID: num(/shelfID\s*=\s*(\d+)/, 0),   // MainSupplyAppIcon 专属（data.shelfID 1~4）
      tabIndex: num(/tabIndex\s*=\s*(\d+)/, -1), // MainAutoDispatchAppIcon 专属（data.tabIndex）
    });
  }

  // ---- 出厂断言（解析即校验，CfgMain 漂移时启动即炸而非静默发错布局）----
  if (apps.length !== 10) throw new Error(`mainApps 解析出 ${apps.length} 条，预期 10 条（CfgMain 漂移？）`);
  const ids = apps.map(a => a.typeID);
  if (new Set(ids).size !== ids.length) throw new Error('mainApps typeID 重复: ' + ids.join(','));
  const occ = new Set();
  for (const a of apps) {
    if (a.pos.x < 1 || a.pos.x > 7 || a.pos.y < 1 || a.pos.y > 5 ||
        a.pos.x + a.width - 1 > 7 || a.pos.y + a.height - 1 > 5) {
      throw new Error(`app ${a.typeID}(${a.name}) 占格越界 7x5: pos=${a.pos.x},${a.pos.y} ${a.width}x${a.height}`);
    }
    if (a.itemName === 'MainSupplyAppIcon' && !(a.shelfID >= 1 && a.shelfID <= 4)) {
      throw new Error(`补给 app ${a.typeID}(${a.name}) 缺合法 shelfID`);
    }
    for (let x = a.pos.x; x < a.pos.x + a.width; x++) {
      for (let y = a.pos.y; y < a.pos.y + a.height; y++) {
        const k = `${x},${y}`;
        if (occ.has(k)) throw new Error(`mainApps 默认布局在格子 ${k} 重叠（app ${a.typeID}）`);
        occ.add(k);
      }
    }
  }
  return apps;
})();

// 消费端谓词表（客户端 MainConfig.isAppFuncOpen 的服务端镜像，判据缺一不可）：
//   MainSupplyAppIcon(1~4)：DormMgr.isShelfUnlock(shelfID) —— 服务端权威 shelfUnlocked（dorm.js）
//   其余：GuideMgr.isFuncOpen(FUNC_ID_DORM=1) —— 服务端权威 buildOpenFunctions().includes(1)
//   MainAutoDispatchAppIcon(10) 追加：DormConfig.tabUnlockLogic[1](3,4) = 通关主线 3-4
//     —— 与 dorm.js autoDispatchUnlocked() 同判据（图标可点 ⇔ tab6 有 101 卡，必须同批一致）
function appPredicate(app, { funcDormOpen, dispatchUnlocked, shelfUnlocked }) {
  if (app.itemName === 'MainSupplyAppIcon') return shelfUnlocked(app.shelfID);
  if (!funcDormOpen) return false;
  if (app.itemName === 'MainAutoDispatchAppIcon') return dispatchUnlocked();
  return true;
}

module.exports = { MAIN_APPS, appPredicate };
