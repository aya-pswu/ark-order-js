// 羁绊（feeling）系统客户端配置镜像——**自动生成，勿手改**
// 生成器：tools/bc_cmp/gen_feeling_data.py
//   源：CfgServant_ljd.lua(feelingStep/feelingCommon) / ServantConst_re.lua(FEELING_MAX)
//       CfgGift_re.lua(preference/tag) / CfgItems_ljd.lua(28xxxxxx) / CfgMarry_re.lua(proposalItem)
//
// 口径（客户端实证，见 tools/bc_cmp/ServantFeelVO_re.lua）：
//   feeling      = **当前羁绊值**（不是累计经验）；上限未婚 100 / 已缔结灵契 200
//   satisfaction = **升下一点羁绊的进度条 0~100**，满 100 → feeling+1 且 satisfaction-=100
//   feeling_record = 里程碑解锁时间戳 [{id: 里程碑羁绊值, val: unix秒}]
//                    id=0 走 type_gain_time、id=101 走 pledge_time，这两格不进 record
//   pledge_time > 0 才是"已缔结灵契"的判据（客户端从不读 pledge 字段）

const FEELING_MAX = 100;          // ServantConst.FEELING_MAX（未婚上限）
const FEELING_MAX_MARRY = 200;    // ServantFeelVO.getMaxFeel：isMarry() 时 200
const SATISFACTION_PER_POINT = 100; // satisfaction 进度条满值
const PROPOSAL_ITEM = 31000014;   // CfgMarry.proposalItem：缔结灵契消耗道具（结缔灵契道具）

// 4 格里程碑（CfgServant.feelingStep）：服务端只用 feeling 门槛决定 feeling_record 写哪几条
const STEPS = {"notMarry":[{"feeling":0,"title":"相遇"},{"feeling":50,"title":"相处"},{"feeling":100,"title":"相知"},{"feeling":100,"title":"相守"}],"marry":[{"feeling":0,"title":"相遇"},{"feeling":50,"title":"相处"},{"feeling":100,"title":"相知"},{"feeling":101,"title":"相守"}]};
// 需要写进 feeling_record 的里程碑值（去掉 0 与 101：那两格客户端读 type_gain_time / pledge_time）
const RECORD_MILESTONES = [50, 100];

// 6 段心情段位（CfgServant.feelingCommon）：纯客户端图标/台词，服务端仅日志用
const MOODS = [{"from":0,"to":10,"title":"不要靠近我！"},{"from":10,"to":20,"title":"感受宁静"},{"from":20,"to":50,"title":"有点点可爱。。大概。。"},{"from":50,"to":99,"title":"只要有爱就没问题"},{"from":100,"to":100,"title":"只要有爱就没问题"},{"from":101,"to":10000,"title":"只要有爱就没问题"}];

// 礼物标签偏好（CfgGift.preference）：giftId → [tagId…]，**[0] = 万能匹配（命中任何心愿）**
const GIFT_PREFERENCE = {"28000000":[0],"28000001":[0],"28001000":[1,2,12,16],"28001001":[2,3,12,15,19],"28001002":[3,4,14,18],"28001003":[4,5,12,16,26],"28001004":[5,6,14,15,20],"28001005":[6,7,13,14,17],"28001006":[7,8,16,25],"28001007":[8,9,13,23],"28001008":[9,10,15,25,24],"28001009":[10,11,16,22],"28001010":[11,1,13,21],"28002000":[1,2,12,16],"28002001":[2,3,12,15,19],"28002002":[3,4,14,18],"28002003":[4,5,12,16,26],"28002004":[5,6,14,15,20],"28002005":[6,7,13,14,17],"28002006":[7,8,16,25],"28002007":[8,9,13,23],"28002008":[9,10,15,25,24],"28002009":[10,11,16,22],"28002010":[11,1,13,21]};
// 26 条标签文案（CfgGift.tag，已去 html 色标；心愿的 val 就是这里的下标 1~26）
const GIFT_TAGS = ["传统的东西","日常的东西","有点萌的东西","可爱的东西","能吃的东西","诡异的东西","珍贵的东西","闪亮的东西","战场风格的东西","黑科技的东西","学术的东西","颜色鲜艳的东西","低调内敛的东西","危险的东西","决战用的东西","正经的东西","降SAN的东西","不能带进商店的东西","喵喵喵喵的东西","引起生化污染的东西","治疗失眠的东西","自动战斗摸鱼用的东西","辟邪防身的东西","能当探照灯用的东西","又硬又脆的东西","香甜可口的东西"];
// 礼物道具（CfgItems 28xxxxxx）：color 3 蓝 / 4 紫 / 5 金 —— satisfaction 增量按它分档
const GIFTS = {"28000000":{"name":"雪兔礼物盒","color":5},"28000001":{"name":"熊猫礼物盒","color":4},"28000024":{"name":"神秘的礼物Lv1","color":3},"28000025":{"name":"神秘的礼物Lv2","color":4},"28001000":{"name":"箱庭盆栽","color":4},"28001001":{"name":"猫耳发箍","color":4},"28001002":{"name":"等身大抱枕","color":4},"28001003":{"name":"慕斯蛋糕","color":4},"28001004":{"name":"鲱鱼罐头","color":4},"28001005":{"name":"埃尔特顿破片","color":4},"28001006":{"name":"蓝钻","color":4},"28001007":{"name":"白银匕首","color":4},"28001008":{"name":"手持粒子炮","color":4},"28001009":{"name":"全息资料集","color":4},"28001010":{"name":"故事书","color":4},"28002000":{"name":"箱庭盆栽","color":3},"28002001":{"name":"猫耳发箍","color":3},"28002002":{"name":"等身大抱枕","color":3},"28002003":{"name":"慕斯蛋糕","color":3},"28002004":{"name":"鲱鱼罐头","color":3},"28002005":{"name":"埃尔特顿破片","color":3},"28002006":{"name":"蓝钻","color":3},"28002007":{"name":"白银匕首","color":3},"28002008":{"name":"手持粒子炮","color":3},"28002009":{"name":"全息资料集","color":3},"28002010":{"name":"故事书","color":3}};

module.exports = { FEELING_MAX, FEELING_MAX_MARRY, SATISFACTION_PER_POINT, PROPOSAL_ITEM,
  STEPS, RECORD_MILESTONES, MOODS, GIFT_PREFERENCE, GIFT_TAGS, GIFTS };
