// 誓灵进化（升星）规则纯函数——客户端口径逐条镜像，无副作用。
//
// 客户端链路（tools/bc_cmp 反编译实证）：
//   ServantTrainEvolutionView.onGUI      面板：星星条 / 所需等级 / 材料列表 / 金币 / 按钮可用性
//   ServantConfigVO.canEvolution         按钮可用性判定（本文件 evaluate 逐条对齐）
//   ServantTrainModule.toevolution       只发 m_servant_evolution_upgrade_tos{servant_id}
//   ServantTrainModule.m_servant_evolution_upgrade_toc
//                                        star = star + 1（客户端**自己加**）；
//                                        getServantSkinVO(id).dataIsOK = false（进化皮肤重新拉取）；
//                                        openUpgradeResultPanel(EVOLUTION)（面板数据全取本地 VO，回包无字段）
// ⇒ 服务端职责只有三件：校验（星级/等级/金币/材料）→ 扣料 → star+1，回包只回显 servant_id。
//
// 「材料不足可用道具补充」（ServantTrainEvolutionView 的 showExchange 分支）也在服务端算：
// tos 里没有任何替代品字段，客户端只是弹个确认框，真正决定消耗什么的必须是服务端。
const E = require('./evolution_data');

const { MAX_STAR, BASE_STAR, STAR_LV, STAR_ITEMS, REPLACE_EVOLUTION, MAT_NAMES } = E;

// ServantUtil.getStarLv：**按当前星级**查进化所需等级（star<=2→15 / 3→35 / 4→55 / 5→75）
function starLvOf(star) {
  const s = Number(star) || 0;
  return STAR_LV[s] != null ? STAR_LV[s] : (s <= 2 ? STAR_LV[2] : 0);
}

// ServantConfig.getServantStarUpgradeInfo(typeId, star)：本次进化的金币+材料需求
function upgradeInfoOf(type, star) {
  const per = STAR_ITEMS[String(type)] || STAR_ITEMS[Number(type)];
  if (!per) return null;
  return per[Number(star)] || null;
}

// 星级合法化：存档里的 star 只允许 BASE_STAR..MAX_STAR（旧档占位值 / 脏数据都夹回来）
function normStar(star) {
  const s = Math.floor(Number(star) || 0);
  if (s < BASE_STAR) return BASE_STAR;
  if (s > MAX_STAR) return MAX_STAR;
  return s;
}

const NO_MATS = 'NOT_MATERIAL';

// 结算一次进化的消耗计划。
// bagNum(typeId) → 背包现有数量；silver → 当前金币。
// 返回 {ok, reason, star, next, cost, spend:[{id,num,replaceFor}], info}
//   spend 是最终要扣的物品（缺口部分已换成替代品「百变素材模型」）；
//   reason: MAX_STAR / NO_CONFIG / NEED_LEVEL / NOT_SILVER / NOT_MATERIAL
function evaluate(brief, bagNum, silver) {
  const star = normStar(brief && brief.star);
  const level = Math.max(1, Number(brief && brief.level) || 1);
  const out = { ok: false, reason: '', star, next: star + 1, cost: 0, spend: [], info: null };
  if (star >= MAX_STAR) { out.reason = 'MAX_STAR'; return out; }
  const info = upgradeInfoOf(brief && brief.type, star);
  if (!info) { out.reason = 'NO_CONFIG'; return out; }
  out.info = info;
  out.cost = info.cost;
  const needLv = starLvOf(star);
  if (level < needLv) { out.reason = 'NEED_LEVEL'; out.needLevel = needLv; return out; }
  if ((Number(silver) || 0) < info.cost) { out.reason = 'NOT_SILVER'; return out; }

  // 材料：先扣本体，缺口按 REPLACE_EVOLUTION 折算替代品。
  // reserved 累计已被占用的替代品数量——多个缺口材料共用同一件「百变素材模型」时不能重复计数
  //（ReplaceEvolutionItemVO.isEnough(need, reserved) 的第二个入参就是干这个的）
  const reserved = {};
  const spend = [];
  for (const it of info.items) {
    const have = Math.max(0, Number(bagNum(it.id)) || 0);
    const useSelf = Math.min(have, it.num);
    if (useSelf > 0) spend.push({ id: it.id, num: useSelf });
    let lack = it.num - useSelf;
    if (lack <= 0) continue;
    for (const rep of REPLACE_EVOLUTION[it.id] || []) {
      if (lack <= 0) break;
      const avail = Math.max(0, (Number(bagNum(rep.src)) || 0) - (reserved[rep.src] || 0));
      // 一次兑换 dstNum 个缺口材料 / 消耗 srcNum 个替代品
      const wantTimes = Math.ceil(lack / rep.dstNum);
      const canTimes = Math.floor(avail / rep.srcNum);
      const times = Math.min(wantTimes, canTimes);
      if (times <= 0) continue;
      reserved[rep.src] = (reserved[rep.src] || 0) + times * rep.srcNum;
      spend.push({ id: rep.src, num: times * rep.srcNum, replaceFor: it.id });
      lack -= times * rep.dstNum;
    }
    if (lack > 0) { out.reason = NO_MATS; out.lack = { id: it.id, num: lack }; return out; }
  }
  // 合并同物品（多个缺口共用同一件替代品时会出现重复行；扣料按 type_id 汇总）
  const merged = [];
  for (const s of spend) {
    const hit = merged.find(m => m.id === s.id);
    if (hit) hit.num += s.num;
    else merged.push(Object.assign({}, s));
  }
  out.spend = merged;
  out.ok = true;
  return out;
}

function matName(id) {
  return MAT_NAMES[String(id)] || String(id);
}

module.exports = { MAX_STAR, BASE_STAR, STAR_LV, starLvOf, upgradeInfoOf, normStar, evaluate, matName };
