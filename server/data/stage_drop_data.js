// 官方关卡权威掉落数据与掉落抽取（逆向自 CfgCopyDetail, CfgCopy, CfgItems 实装）
// 完整解析 2434 个关卡掉落槽位：契约材料、属性结晶、遗物箱、核心晶组、技能模组、稀有品

const STAGE_DROPS = {
  "1010100": {
    "suggestLv": 3,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1010101": {
    "suggestLv": 3,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010102": {
    "suggestLv": 3,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010103": {
    "suggestLv": 3,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010200": {
    "suggestLv": 4,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1010201": {
    "suggestLv": 4,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010202": {
    "suggestLv": 4,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010203": {
    "suggestLv": 4,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010204": {
    "suggestLv": 4,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010300": {
    "suggestLv": 6,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1010301": {
    "suggestLv": 6,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010302": {
    "suggestLv": 6,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010303": {
    "suggestLv": 6,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010304": {
    "suggestLv": 6,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010305": {
    "suggestLv": 6,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010400": {
    "suggestLv": 9,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1010401": {
    "suggestLv": 9,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010402": {
    "suggestLv": 9,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010403": {
    "suggestLv": 9,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010404": {
    "suggestLv": 9,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010405": {
    "suggestLv": 9,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1010406": {
    "suggestLv": 9,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000005,
      20000009
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020100": {
    "suggestLv": 12,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000017
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1020101": {
    "suggestLv": 12,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000017
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020102": {
    "suggestLv": 12,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000017
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020103": {
    "suggestLv": 12,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000017
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020104": {
    "suggestLv": 12,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000017
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020105": {
    "suggestLv": 12,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000017
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020106": {
    "suggestLv": 12,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000007,
      20000017
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020200": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000012
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1020201": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000012
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020202": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000012
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020203": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000012
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020204": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000012
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020205": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000012
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020206": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000008,
      20000012
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020300": {
    "suggestLv": 19,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000010
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1020301": {
    "suggestLv": 19,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000010
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020302": {
    "suggestLv": 19,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000010
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020303": {
    "suggestLv": 19,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000010
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020304": {
    "suggestLv": 19,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000010
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020305": {
    "suggestLv": 19,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000010
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020306": {
    "suggestLv": 19,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000004,
      20000010
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020400": {
    "suggestLv": 23,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000014
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1020401": {
    "suggestLv": 23,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000014
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020402": {
    "suggestLv": 23,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000014
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020403": {
    "suggestLv": 23,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000014
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020404": {
    "suggestLv": 23,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000014
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020405": {
    "suggestLv": 23,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000014
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020406": {
    "suggestLv": 23,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000014
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1020407": {
    "suggestLv": 23,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000005,
      20000014
    ],
    "crystalTier": 0,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030100": {
    "suggestLv": 26,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000015
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1030101": {
    "suggestLv": 26,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000015
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030102": {
    "suggestLv": 26,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000015
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030103": {
    "suggestLv": 26,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000015
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030104": {
    "suggestLv": 26,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000015
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030105": {
    "suggestLv": 26,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000015
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030106": {
    "suggestLv": 26,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000007,
      20000015
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030200": {
    "suggestLv": 29,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000011
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1030201": {
    "suggestLv": 29,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000011
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030202": {
    "suggestLv": 29,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000011
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030203": {
    "suggestLv": 29,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000011
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030204": {
    "suggestLv": 29,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000011
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030205": {
    "suggestLv": 29,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000011
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030206": {
    "suggestLv": 29,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000003,
      20000011
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030300": {
    "suggestLv": 33,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000018
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1030301": {
    "suggestLv": 33,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000018
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030302": {
    "suggestLv": 33,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000018
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030303": {
    "suggestLv": 33,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000018
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030304": {
    "suggestLv": 33,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000018
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030305": {
    "suggestLv": 33,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000018
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030306": {
    "suggestLv": 33,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000006,
      20000018
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030400": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1030401": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030402": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030403": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030404": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030405": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030406": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1030407": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1031400": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1031401": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1031402": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1031403": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1031404": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1031405": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1031406": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1031407": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1031408": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000003,
      20000013,
      20000020,
      20000024
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1040100": {
    "suggestLv": 41,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000016,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1040101": {
    "suggestLv": 41,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000016,
      20000022
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040102": {
    "suggestLv": 41,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000016,
      20000022
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040103": {
    "suggestLv": 41,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000016,
      20000022
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040104": {
    "suggestLv": 41,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000016,
      20000022
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040105": {
    "suggestLv": 41,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000016,
      20000022
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040106": {
    "suggestLv": 41,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000016,
      20000022
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040107": {
    "suggestLv": 41,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000016,
      20000022
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040200": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000012,
      20000024
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1040201": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000012,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040202": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000012,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040203": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000012,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040204": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000012,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040205": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000012,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040206": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000012,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040207": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000004,
      20000012,
      20000024
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040300": {
    "suggestLv": 48,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000010,
      20000019
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1040301": {
    "suggestLv": 48,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000010,
      20000019
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040302": {
    "suggestLv": 48,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000010,
      20000019
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040303": {
    "suggestLv": 48,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000010,
      20000019
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040304": {
    "suggestLv": 48,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000010,
      20000019
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040305": {
    "suggestLv": 48,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000010,
      20000019
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040306": {
    "suggestLv": 48,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000010,
      20000019
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040307": {
    "suggestLv": 48,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000010,
      20000019
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040400": {
    "suggestLv": 53,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1040401": {
    "suggestLv": 53,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040402": {
    "suggestLv": 53,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040403": {
    "suggestLv": 53,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040404": {
    "suggestLv": 53,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040405": {
    "suggestLv": 53,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040406": {
    "suggestLv": 53,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040407": {
    "suggestLv": 53,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1040408": {
    "suggestLv": 53,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1041400": {
    "suggestLv": 74,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1041401": {
    "suggestLv": 74,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1041402": {
    "suggestLv": 74,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1041403": {
    "suggestLv": 74,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1041404": {
    "suggestLv": 74,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1041405": {
    "suggestLv": 74,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1041406": {
    "suggestLv": 74,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1041407": {
    "suggestLv": 74,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1041408": {
    "suggestLv": 74,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1041409": {
    "suggestLv": 74,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000006,
      20000015,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1050100": {
    "suggestLv": 55,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000013,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1050101": {
    "suggestLv": 55,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000013,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050102": {
    "suggestLv": 55,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000013,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050103": {
    "suggestLv": 55,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000013,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050104": {
    "suggestLv": 55,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000013,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050105": {
    "suggestLv": 55,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000013,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050106": {
    "suggestLv": 55,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000013,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050107": {
    "suggestLv": 55,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000008,
      20000013,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050200": {
    "suggestLv": 58,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000011,
      20000019
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1050201": {
    "suggestLv": 58,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000011,
      20000019
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050202": {
    "suggestLv": 58,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000011,
      20000019
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050203": {
    "suggestLv": 58,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000011,
      20000019
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050204": {
    "suggestLv": 58,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000011,
      20000019
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050205": {
    "suggestLv": 58,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000011,
      20000019
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050206": {
    "suggestLv": 58,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000011,
      20000019
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050207": {
    "suggestLv": 58,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000011,
      20000019
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050300": {
    "suggestLv": 61,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000017,
      20000021
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1050301": {
    "suggestLv": 61,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000017,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050302": {
    "suggestLv": 61,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000017,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050303": {
    "suggestLv": 61,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000017,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050304": {
    "suggestLv": 61,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000017,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050305": {
    "suggestLv": 61,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000017,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050306": {
    "suggestLv": 61,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000017,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050307": {
    "suggestLv": 61,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000006,
      20000017,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050400": {
    "suggestLv": 64,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1050401": {
    "suggestLv": 64,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050402": {
    "suggestLv": 64,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050403": {
    "suggestLv": 64,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050404": {
    "suggestLv": 64,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050405": {
    "suggestLv": 64,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050406": {
    "suggestLv": 64,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050407": {
    "suggestLv": 64,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1050408": {
    "suggestLv": 64,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1051400": {
    "suggestLv": 78,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1051401": {
    "suggestLv": 78,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1051402": {
    "suggestLv": 78,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1051403": {
    "suggestLv": 78,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1051404": {
    "suggestLv": 78,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1051405": {
    "suggestLv": 78,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1051406": {
    "suggestLv": 78,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1051407": {
    "suggestLv": 78,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1051408": {
    "suggestLv": 78,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1051409": {
    "suggestLv": 78,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000008,
      20000014,
      20000024
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1060100": {
    "suggestLv": 67,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1060101": {
    "suggestLv": 67,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060102": {
    "suggestLv": 67,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060103": {
    "suggestLv": 67,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060104": {
    "suggestLv": 67,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060105": {
    "suggestLv": 67,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060106": {
    "suggestLv": 67,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060107": {
    "suggestLv": 67,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060108": {
    "suggestLv": 67,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060200": {
    "suggestLv": 69,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1060201": {
    "suggestLv": 69,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060202": {
    "suggestLv": 69,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060203": {
    "suggestLv": 69,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060204": {
    "suggestLv": 69,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060205": {
    "suggestLv": 69,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060206": {
    "suggestLv": 69,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060207": {
    "suggestLv": 69,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060208": {
    "suggestLv": 69,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060300": {
    "suggestLv": 71,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1060301": {
    "suggestLv": 71,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060302": {
    "suggestLv": 71,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060303": {
    "suggestLv": 71,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060304": {
    "suggestLv": 71,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060305": {
    "suggestLv": 71,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060306": {
    "suggestLv": 71,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060307": {
    "suggestLv": 71,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060308": {
    "suggestLv": 71,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060400": {
    "suggestLv": 73,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1060401": {
    "suggestLv": 73,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060402": {
    "suggestLv": 73,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060403": {
    "suggestLv": 73,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060404": {
    "suggestLv": 73,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060405": {
    "suggestLv": 73,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060406": {
    "suggestLv": 73,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060407": {
    "suggestLv": 73,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1060408": {
    "suggestLv": 73,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1061101": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061102": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061103": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061104": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061105": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061106": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061107": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061108": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061109": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000003,
      20000018,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1061200": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1061201": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061202": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061203": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061204": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061205": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061206": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061207": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061208": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061209": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000004,
      20000016,
      20000021
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1061300": {
    "suggestLv": 84,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1061301": {
    "suggestLv": 84,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061302": {
    "suggestLv": 84,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061303": {
    "suggestLv": 84,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061304": {
    "suggestLv": 84,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061305": {
    "suggestLv": 84,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061306": {
    "suggestLv": 84,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061307": {
    "suggestLv": 84,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061308": {
    "suggestLv": 84,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061309": {
    "suggestLv": 84,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000005,
      20000009,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1061400": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1061401": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061402": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061403": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061404": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061405": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061406": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061407": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061408": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1061409": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000007,
      20000014,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070101": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070102": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070103": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070104": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070105": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070106": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070107": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070108": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070200": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070201": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070202": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070203": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070204": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070205": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070206": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070207": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070208": {
    "suggestLv": 82,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070300": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070301": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070302": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070303": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070304": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070305": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070306": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070307": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070308": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070400": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070401": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070402": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070403": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070404": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070405": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070406": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070407": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1070408": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1071300": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1071301": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071302": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071303": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071304": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071305": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071306": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071307": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071308": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071309": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1071400": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1071401": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071402": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071403": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071404": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071405": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071406": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071407": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071408": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1071409": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080100": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000026,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080101": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000026,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080102": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000026,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080103": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000026,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080104": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000026,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080105": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000026,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080106": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000026,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080107": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000008,
      20000026,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080108": {
    "suggestLv": 86,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000008,
      20000026,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080200": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080201": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080202": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080203": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080204": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080205": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080206": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080207": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080208": {
    "suggestLv": 88,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080300": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080301": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080302": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080303": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080304": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080305": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080306": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080307": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080308": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080400": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080401": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080402": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080403": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080404": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080405": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080406": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080407": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080408": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1081200": {
    "suggestLv": 94,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1081201": {
    "suggestLv": 94,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081202": {
    "suggestLv": 94,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081203": {
    "suggestLv": 94,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081204": {
    "suggestLv": 94,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081205": {
    "suggestLv": 94,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081206": {
    "suggestLv": 94,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081207": {
    "suggestLv": 94,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081208": {
    "suggestLv": 94,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081209": {
    "suggestLv": 94,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000006,
      20000015,
      20000027
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1081300": {
    "suggestLv": 96,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1081301": {
    "suggestLv": 96,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081302": {
    "suggestLv": 96,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081303": {
    "suggestLv": 96,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081304": {
    "suggestLv": 96,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081305": {
    "suggestLv": 96,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081306": {
    "suggestLv": 96,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081307": {
    "suggestLv": 96,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081308": {
    "suggestLv": 96,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081309": {
    "suggestLv": 96,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000007,
      20000018,
      20000028
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1081400": {
    "suggestLv": 98,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1081401": {
    "suggestLv": 98,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081402": {
    "suggestLv": 98,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081403": {
    "suggestLv": 98,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081404": {
    "suggestLv": 98,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081405": {
    "suggestLv": 98,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081406": {
    "suggestLv": 98,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081407": {
    "suggestLv": 98,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081408": {
    "suggestLv": 98,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1081409": {
    "suggestLv": 98,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090100": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000026,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090101": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000026,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090102": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000026,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090103": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000026,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090104": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000026,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090105": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000026,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090106": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000026,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090107": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000026,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090108": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000026,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090200": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090201": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090202": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090203": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090204": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090205": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090206": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090207": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090208": {
    "suggestLv": 92,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090300": {
    "suggestLv": 95,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090301": {
    "suggestLv": 95,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090302": {
    "suggestLv": 95,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090303": {
    "suggestLv": 95,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090304": {
    "suggestLv": 95,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090305": {
    "suggestLv": 95,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090306": {
    "suggestLv": 95,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090307": {
    "suggestLv": 95,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090308": {
    "suggestLv": 95,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090400": {
    "suggestLv": 99,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090401": {
    "suggestLv": 99,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090402": {
    "suggestLv": 99,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090403": {
    "suggestLv": 99,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090404": {
    "suggestLv": 99,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090405": {
    "suggestLv": 99,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090406": {
    "suggestLv": 99,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090407": {
    "suggestLv": 99,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1090408": {
    "suggestLv": 99,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091300": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091301": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091302": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091303": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091304": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091305": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091306": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091307": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091308": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000028,
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091309": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091400": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091401": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091402": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091403": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091404": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091405": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091406": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091407": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091408": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000029,
      20000019,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1091409": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000004,
      20000013,
      20000020,
      20000029
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000023,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100100": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000023,
      20000026,
      20000003,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100101": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000023,
      20000026,
      20000003,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100102": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000023,
      20000026,
      20000003,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100103": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000023,
      20000026,
      20000003,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100104": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000023,
      20000026,
      20000003,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100105": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000023,
      20000026,
      20000003,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100106": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000023,
      20000026,
      20000003,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100107": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000023,
      20000026,
      20000003,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100108": {
    "suggestLv": 102,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000026,
      20000003,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100200": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100201": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100202": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100203": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100204": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100205": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100206": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100207": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100208": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000027,
      20000010,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100300": {
    "suggestLv": 105,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000012,
      20000017,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100301": {
    "suggestLv": 105,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000012,
      20000017,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100302": {
    "suggestLv": 105,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000012,
      20000017,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100303": {
    "suggestLv": 105,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000012,
      20000017,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100304": {
    "suggestLv": 105,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000012,
      20000017,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100305": {
    "suggestLv": 105,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000012,
      20000017,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100306": {
    "suggestLv": 105,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000012,
      20000017,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100307": {
    "suggestLv": 105,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000028,
      20000012,
      20000017,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100308": {
    "suggestLv": 105,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000028,
      20000012,
      20000017,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100400": {
    "suggestLv": 108,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000011,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100401": {
    "suggestLv": 108,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000011,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100402": {
    "suggestLv": 108,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000011,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100403": {
    "suggestLv": 108,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000011,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100404": {
    "suggestLv": 108,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000011,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100405": {
    "suggestLv": 108,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000011,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100406": {
    "suggestLv": 108,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000011,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100407": {
    "suggestLv": 108,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000029,
      20000019,
      20000011,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1100408": {
    "suggestLv": 108,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000029,
      20000019,
      20000011,
      20000014,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110100": {
    "suggestLv": 111,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110101": {
    "suggestLv": 111,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110102": {
    "suggestLv": 111,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110103": {
    "suggestLv": 111,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110104": {
    "suggestLv": 111,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110105": {
    "suggestLv": 111,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110106": {
    "suggestLv": 111,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110107": {
    "suggestLv": 111,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110108": {
    "suggestLv": 111,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110109": {
    "suggestLv": 111,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110110": {
    "suggestLv": 111,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110111": {
    "suggestLv": 111,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110112": {
    "suggestLv": 111,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000011,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110200": {
    "suggestLv": 114,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110201": {
    "suggestLv": 114,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110202": {
    "suggestLv": 114,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110203": {
    "suggestLv": 114,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110204": {
    "suggestLv": 114,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110205": {
    "suggestLv": 114,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110206": {
    "suggestLv": 114,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110207": {
    "suggestLv": 114,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110208": {
    "suggestLv": 114,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110209": {
    "suggestLv": 114,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110210": {
    "suggestLv": 114,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000027,
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110211": {
    "suggestLv": 114,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000027,
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110212": {
    "suggestLv": 114,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000027,
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110300": {
    "suggestLv": 117,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000010,
      20000017,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110301": {
    "suggestLv": 117,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000010,
      20000017,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110302": {
    "suggestLv": 117,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000010,
      20000017,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110303": {
    "suggestLv": 117,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000010,
      20000017,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110304": {
    "suggestLv": 117,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000010,
      20000017,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110305": {
    "suggestLv": 117,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000010,
      20000017,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110306": {
    "suggestLv": 117,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000010,
      20000017,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110307": {
    "suggestLv": 117,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000010,
      20000017,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110308": {
    "suggestLv": 117,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000010,
      20000017,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110309": {
    "suggestLv": 117,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000010,
      20000017,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110310": {
    "suggestLv": 117,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000010,
      20000017,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110311": {
    "suggestLv": 117,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000010,
      20000017,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110312": {
    "suggestLv": 117,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000010,
      20000017,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110400": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000012,
      20000014,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110401": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000012,
      20000014,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110402": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000012,
      20000014,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110403": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000012,
      20000014,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110404": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000012,
      20000014,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110405": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000012,
      20000014,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110406": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000012,
      20000014,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110407": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000012,
      20000014,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110408": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000012,
      20000014,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110409": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000012,
      20000014,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110410": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000012,
      20000014,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110411": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000012,
      20000014,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1110412": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000012,
      20000014,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "2010101": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 0,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "2010201": {
    "suggestLv": 45,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 0,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "2010301": {
    "suggestLv": 80,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "2020101": {
    "suggestLv": 15,
    "enemyNature": [
      2
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000004,
      20000005,
      20000006,
      20000007,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "2020201": {
    "suggestLv": 45,
    "enemyNature": [
      2
    ],
    "materials": [
      20000009,
      20000010,
      20000011,
      20000012,
      20000013,
      20000014,
      20000015,
      20000016,
      20000017,
      20000018,
      20000000,
      20000001,
      20000002,
      20000003,
      20000004,
      20000005,
      20000006,
      20000007,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "2020301": {
    "suggestLv": 80,
    "enemyNature": [
      2
    ],
    "materials": [
      20000019,
      20000020,
      20000021,
      20000022,
      20000023,
      20000024,
      20000025,
      20000009,
      20000010,
      20000011,
      20000012,
      20000013,
      20000014,
      20000015,
      20000016,
      20000017,
      20000018
    ],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "2030101": {
    "suggestLv": 15,
    "enemyNature": [
      1
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "2030201": {
    "suggestLv": 45,
    "enemyNature": [
      1
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "2030301": {
    "suggestLv": 80,
    "enemyNature": [
      1
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000,
      21104000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "4001001": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5000036": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5000037": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5000038": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5000069": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5000070": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5000071": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5000114": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5000115": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5000116": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5000153": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5000154": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5000155": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5001001": {
    "suggestLv": -5,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5001002": {
    "suggestLv": -5,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5001003": {
    "suggestLv": -5,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5002001": {
    "suggestLv": -5,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "5003001": {
    "suggestLv": -5,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "6010100": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000009,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6010200": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000016,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6010300": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000013,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6010400": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6010500": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000017,
      20000000
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6010600": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6010700": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000015,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6010800": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000009,
      20000000
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6010900": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000020,
      20000011,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6011000": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6020100": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000018,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6020200": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000010,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6020300": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000015,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6020400": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000018,
      20000001
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6020500": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000014,
      20000007
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6020600": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000018,
      20000001
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6020700": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000013,
      20000001
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6020800": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000016,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6020900": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000022,
      20000016,
      20000007
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6021000": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000024,
      20000013,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6030100": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000010,
      20000000
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6030200": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000017,
      20000007
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6030300": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000014,
      20000001
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6030400": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000012,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6030500": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000010,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6030600": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000014,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6030700": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000012,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6030800": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6030900": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000023,
      20000017,
      20000000
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "6031000": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000025,
      20000015,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "7010100": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "7010200": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "7010300": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000003,
      60000002
    ],
    "rare": [],
    "boss": []
  },
  "8000001": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "9000000": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "9000001": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "11000001": {
    "suggestLv": -5,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "12000000": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "1027020100": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21104000,
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000040,
      26100028,
      26100029,
      26100030,
      45045010,
      45045011,
      45050047,
      45030009,
      45030010,
      45040027,
      45030012,
      45030013,
      45040024,
      45040026,
      45040028,
      45040029,
      45040030,
      45040031,
      45040032,
      45050054,
      45050055,
      45050056,
      45050049
    ],
    "rare": [],
    "boss": []
  },
  "1031000000": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1031000001": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1031000002": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1031010001": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1031010002": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1031010003": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1031010004": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1031010005": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1031010006": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1031010007": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1031010008": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1031010009": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31646002,
      31631005,
      31623007,
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1031010010": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31646002,
      31631005,
      31623007,
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1031010011": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31646002,
      31631005,
      31623007,
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1031010012": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31646002,
      31631005,
      31623007,
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1031030000": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1031040000": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1032000000": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1032000001": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1032000002": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1032010001": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1032020100": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31646002,
      31631005,
      31623007,
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1043010100": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010101": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010102": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010191": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010192": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010193": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010194": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010199": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010200": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010201": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010202": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010209": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010291": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010292": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010293": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010294": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010295": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010299": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010301": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010302": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010303": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010304": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010305": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010306": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010309": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010391": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010392": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010393": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010394": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010395": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1043010399": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000020,
      60000021,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1047020100": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000021,
      31000025,
      60000022,
      60000020
    ],
    "rare": [],
    "boss": []
  },
  "1047020200": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000006,
      21500038,
      60000020
    ],
    "rare": [],
    "boss": []
  },
  "1052010100": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21007000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1052010101": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21007000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1052010102": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000903,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1052010103": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000903,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1052010104": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000904,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1052010105": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000904,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1052010106": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000905,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1052010107": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000029,
      21500038,
      21500037,
      21500036,
      45040066,
      45040065,
      45030021,
      31000024,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1052010171": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1052010172": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1052010173": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000007,
      21500038
    ],
    "rare": [],
    "boss": []
  },
  "1052010174": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      45000018
    ],
    "rare": [],
    "boss": []
  },
  "1052010175": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      45000017
    ],
    "rare": [],
    "boss": []
  },
  "1052010176": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      17000004,
      21500038,
      31000026
    ],
    "rare": [],
    "boss": []
  },
  "1061010100": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000009,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061010200": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000016,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061010300": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000013,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061010400": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061010500": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000017,
      20000000
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061010600": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000012,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061010700": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000020,
      20000015,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061010800": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000009,
      20000000
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061010900": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000011,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061011000": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061020100": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000018,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061020200": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000010,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061020300": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000015,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061020400": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000018,
      20000001
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061020500": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000014,
      20000007
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061020600": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000018,
      20000001
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061020700": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000013,
      20000001
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061020800": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000022,
      20000016,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061020900": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000016,
      20000007
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061021000": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000024,
      20000013,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061030100": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000010,
      20000000
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061030200": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000020,
      20000017,
      20000007
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061030300": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000014,
      20000001
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061030400": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061030500": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000010,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061030600": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000023,
      20000014,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061030700": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000012,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061030800": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061030900": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000017,
      20000000
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061031000": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000025,
      20000015,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061040100": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000011,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061040200": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061040300": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000016,
      20000007
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1061040400": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [
      20000024,
      20000013,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1062010100": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1062010200": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1062010300": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000031,
      60000030
    ],
    "rare": [],
    "boss": []
  },
  "1064010100": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000009,
      21500038,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1064010200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000009,
      21500038,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1072010100": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010101": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010102": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010103": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010104": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010105": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010200": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010201": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010202": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010203": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010204": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010205": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010300": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000037,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010301": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010302": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010303": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010304": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010305": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000037,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000036,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010401": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010402": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010403": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010404": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010405": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000036,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010500": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000035,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010501": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010502": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010503": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010504": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010505": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000035,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010600": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000037,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010601": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010602": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010603": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010604": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010605": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000037,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010700": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000036,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010701": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010702": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010703": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010704": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010705": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000036,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000035,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010801": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010802": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010803": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010804": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1072010805": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000035,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1073010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000011,
      21500038,
      21500037,
      60000034
    ],
    "rare": [],
    "boss": []
  },
  "1075010101": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000033,
      60000034
    ],
    "rare": [],
    "boss": []
  },
  "1079010100": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1079010101": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1079010102": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1079010103": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1079010104": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1080010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000,
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1085000001": {
    "suggestLv": 1,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000042
    ],
    "rare": [],
    "boss": []
  },
  "1085000003": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000903
    ],
    "rare": [],
    "boss": []
  },
  "1085000004": {
    "suggestLv": 42,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      28000001
    ],
    "rare": [],
    "boss": []
  },
  "1085000005": {
    "suggestLv": 47,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31434028
    ],
    "rare": [],
    "boss": []
  },
  "1085000006": {
    "suggestLv": 52,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000904
    ],
    "rare": [],
    "boss": []
  },
  "1085000007": {
    "suggestLv": 57,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1085000008": {
    "suggestLv": 61,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31434028
    ],
    "rare": [],
    "boss": []
  },
  "1085000010": {
    "suggestLv": 69,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31434028
    ],
    "rare": [],
    "boss": []
  },
  "1087010101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1087010102": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1087010111": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1087010112": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1087010201": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1087010202": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1087010211": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1087010212": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1087010301": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1087010302": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1087010311": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1087010312": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1088010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000013,
      60000045,
      21500038,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1099999999": {
    "suggestLv": 15,
    "enemyNature": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000000,
      31000001
    ],
    "rare": [],
    "boss": []
  },
  "1104010100": {
    "suggestLv": 10,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000009,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104010200": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000016,
      20000008
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104010300": {
    "suggestLv": 25,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104010400": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104010500": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000017,
      20000000
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104010600": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000011,
      20000003
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104010700": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000015,
      20000006
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104010800": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000009,
      20000000
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104010900": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000009,
      20000000
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104011000": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000009,
      20000000
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104011100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000011,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104011200": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000011,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104011300": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000016,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104011400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000016,
      20000004
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1104011500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000011,
      20000005
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1106010101": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000037,
      31000038,
      31000039
    ],
    "rare": [],
    "boss": []
  },
  "1106010102": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000037,
      31000038,
      31000039
    ],
    "rare": [],
    "boss": []
  },
  "1109010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000014,
      21500038,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1114010100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010200": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010201": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010205": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010300": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010301": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010305": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114010401": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114010405": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114010500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114010501": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114010505": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114010600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114010601": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114010605": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114010700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010701": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010705": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010801": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010805": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010900": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010901": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114010905": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1114011000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114011001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114011005": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114011100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114011101": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114011105": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114011200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114011201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114011205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114011300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114011301": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114011305": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114011400": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114011401": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114011405": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114011500": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114011501": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114011505": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114011600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114011601": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114011605": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114011700": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114011701": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114011705": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114011800": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114011801": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114011805": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114011900": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114011901": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114011905": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012000": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012005": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114012201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114012205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114012300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114012301": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114012305": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114012400": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114012401": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114012405": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1114012500": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012501": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012505": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012601": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012605": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012701": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012705": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025
    ]
  },
  "1114012800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114012801": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114012805": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114012900": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114012901": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114012905": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114013000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114013001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1114013005": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1115010101": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000056
    ],
    "rare": [],
    "boss": []
  },
  "1119010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000015,
      21500038,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1123010102": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25100002
    ],
    "rare": [],
    "boss": []
  },
  "1124010100": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1124010101": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1124010102": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057
    ],
    "rare": [],
    "boss": []
  },
  "1124010191": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1124010192": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1124010193": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1124010194": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1124010199": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1124010200": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010201": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010202": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010209": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      45040055,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010291": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010292": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010293": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010294": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010295": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010299": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010301": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010302": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010303": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010304": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010305": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010306": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010309": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010391": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010392": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010393": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010394": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010395": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1124010399": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1128020100": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000021,
      31000025,
      60000058,
      60000057,
      45030016,
      45030017,
      45040046,
      45040047,
      45040048
    ],
    "rare": [],
    "boss": []
  },
  "1128020200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000006,
      21500038
    ],
    "rare": [],
    "boss": []
  },
  "1128020300": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25100002
    ],
    "rare": [],
    "boss": []
  },
  "1140010201": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000000,
      27000001,
      27000002
    ],
    "skillModules": [
      26000000,
      26000001,
      26000002
    ],
    "others": [
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140010299": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21103000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000063
    ],
    "rare": [],
    "boss": []
  },
  "1140010301": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000000,
      27000001,
      27000002
    ],
    "skillModules": [
      26000000,
      26000001,
      26000002
    ],
    "others": [
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140010399": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000063
    ],
    "rare": [],
    "boss": []
  },
  "1140010499": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000063
    ],
    "rare": [],
    "boss": []
  },
  "1140010501": {
    "suggestLv": 23,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000000,
      27000001,
      27000002
    ],
    "skillModules": [
      26000000,
      26000001,
      26000002
    ],
    "others": [
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140010599": {
    "suggestLv": 23,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000063
    ],
    "rare": [],
    "boss": []
  },
  "1140010698": {
    "suggestLv": 25,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000041,
      31000042,
      31000043,
      31000044,
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140010699": {
    "suggestLv": 25,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000041,
      31000042,
      31000043,
      31000044,
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140010701": {
    "suggestLv": 26,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000000,
      27000001,
      27000002
    ],
    "skillModules": [
      26000000,
      26000001,
      26000002
    ],
    "others": [
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140010799": {
    "suggestLv": 26,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000063
    ],
    "rare": [],
    "boss": []
  },
  "1140010801": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000000,
      27000001,
      27000002
    ],
    "skillModules": [
      26000000,
      26000001,
      26000002
    ],
    "others": [
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140010899": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000063
    ],
    "rare": [],
    "boss": []
  },
  "1140010998": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000041,
      17009004,
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140010999": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000041,
      17009004,
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140011099": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000063
    ],
    "rare": [],
    "boss": []
  },
  "1140011101": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000000,
      27000001,
      27000002
    ],
    "skillModules": [
      26000000,
      26000001,
      26000002
    ],
    "others": [
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140011199": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000063
    ],
    "rare": [],
    "boss": []
  },
  "1140011298": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000042,
      17010004,
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140011299": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000042,
      17010004,
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140011301": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000000,
      27000001,
      27000002
    ],
    "skillModules": [
      26000000,
      26000001,
      26000002
    ],
    "others": [
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140011399": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000063
    ],
    "rare": [],
    "boss": []
  },
  "1140011498": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000043,
      17011004,
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140011499": {
    "suggestLv": 45,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000043,
      17011004,
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140011501": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000000,
      27000001,
      27000002
    ],
    "skillModules": [
      26000000,
      26000001,
      26000002
    ],
    "others": [
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140011599": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000063
    ],
    "rare": [],
    "boss": []
  },
  "1140011698": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000044,
      17012004,
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140011699": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000044,
      17012004,
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140011701": {
    "suggestLv": 55,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000000,
      27000001,
      27000002
    ],
    "skillModules": [
      26000000,
      26000001,
      26000002
    ],
    "others": [
      60000062
    ],
    "rare": [],
    "boss": []
  },
  "1140011799": {
    "suggestLv": 55,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000063
    ],
    "rare": [],
    "boss": []
  },
  "1140011801": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21102000,
      21103000,
      21002000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1140011802": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21102000,
      21103000,
      21002000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1140011803": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21102000,
      21103000,
      21002000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1140011804": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21102000,
      21103000,
      21002000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1140011805": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21102000,
      21103000,
      21002000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1140011806": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21102000,
      21103000,
      21002000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1140011807": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21102000,
      21103000,
      21002000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1140011808": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21102000,
      21103000,
      21002000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1140011809": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21102000,
      21103000,
      21002000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1140011899": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21104000,
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25001084,
      60000063
    ],
    "rare": [],
    "boss": []
  },
  "1141010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25001280,
      21500038,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1151010101": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1151010102": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000074,
      60000075,
      60000076,
      60000077,
      60000078,
      60000079,
      60000080,
      60000081,
      60000082
    ],
    "rare": [],
    "boss": []
  },
  "1151010103": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1151010104": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000071,
      60000072,
      60000073,
      60000074,
      60000075,
      60000076,
      60000077,
      60000078,
      60000079,
      60000080,
      60000081,
      60000082
    ],
    "rare": [],
    "boss": []
  },
  "1205010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25100002
    ],
    "rare": [],
    "boss": []
  },
  "1206010100": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010101": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010102": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010103": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010104": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010105": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010200": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010201": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010202": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010203": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010204": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010205": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010300": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000095,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010301": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010302": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010303": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010304": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010305": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000095,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000096,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010401": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010402": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010403": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010404": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010405": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000096,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010500": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000035,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010501": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010502": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010503": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010504": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010505": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000035,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010600": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000095,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010601": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010602": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010603": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010604": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010605": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000095,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010700": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000096,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010701": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010702": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010703": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010704": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010705": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000096,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000094,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010801": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010802": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010803": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010804": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010805": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000094,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010900": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000035,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010901": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010902": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010903": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010904": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206010905": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000035,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206011000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000094,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206011001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206011002": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206011003": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206011004": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1206011005": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000094,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1207010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000011,
      21500038,
      21500037,
      60000034
    ],
    "rare": [],
    "boss": []
  },
  "1208010101": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000033,
      60000034
    ],
    "rare": [],
    "boss": []
  },
  "1250010100": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250010200": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250010300": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250010400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250010500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233011,
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250010600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250010700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250010800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233011,
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250010900": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250011000": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31231010,
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250011100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250011200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250011300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31231010,
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250011400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250011500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31246008,
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250011600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250011700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250011800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31246008,
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250011900": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000097
    ],
    "rare": [],
    "boss": []
  },
  "1250012000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      17020003
    ],
    "rare": [],
    "boss": []
  },
  "1250012100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1250012200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000097
    ],
    "rare": [],
    "boss": []
  },
  "1250012300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      17018003
    ],
    "rare": [],
    "boss": []
  },
  "1250012400": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000097
    ],
    "rare": [],
    "boss": []
  },
  "1250012500": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      17019003
    ],
    "rare": [],
    "boss": []
  },
  "1250012600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1250012700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000097
    ],
    "rare": [],
    "boss": []
  },
  "1250020101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250020102": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31231010,
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250020103": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250020104": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31231010,
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250020105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250020106": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233011,
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250020107": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250020108": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233011,
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250020109": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250020110": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31246008,
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250020111": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1250020112": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31246008,
      60000097,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1252010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000021,
      21500038,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1254010101": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1254010102": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1270010100": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010101": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000900,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010105": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000900,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010200": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010201": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000900,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010205": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000900,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010300": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010301": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000900,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010305": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000900,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010400": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      33026009,
      60000099,
      60000100,
      60000101,
      60000102,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010401": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010405": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33026009,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010500": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010501": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010505": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010600": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010601": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010605": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010700": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010701": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010705": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010800": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33021004,
      60000099,
      60000100,
      60000101,
      60000102,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010801": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010805": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33021004,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010900": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33026009,
      33021004,
      60000099,
      60000100,
      60000101,
      60000102,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010901": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270010905": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33026009,
      33021004,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011000": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000099,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011001": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000099,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011005": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000099,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011006": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000099,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011100": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000100,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011101": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000100,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011105": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000100,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011106": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000100,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011200": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000101,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011201": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000101,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011205": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000101,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011206": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000101,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011300": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000102,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011301": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000102,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011305": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000102,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011306": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000102,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011400": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000099,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011401": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000099,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011405": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000099,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011406": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000099,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011500": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000100,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011501": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000100,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011505": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000100,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011506": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000100,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011600": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000101,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011601": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000101,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011605": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000101,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011606": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000101,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011700": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000102,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011701": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000102,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011705": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000102,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011706": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000102,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011800": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1270011801": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270011805": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1270011901": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270012000": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1270012001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270012005": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1270012100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000904
    ],
    "rare": [],
    "boss": []
  },
  "1270012101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270012105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000904
    ],
    "rare": [],
    "boss": []
  },
  "1270012200": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1270012201": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270012205": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1270012300": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1270012301": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270012305": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1270012400": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000905
    ],
    "rare": [],
    "boss": []
  },
  "1270012401": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270012405": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000905
    ],
    "rare": [],
    "boss": []
  },
  "1270012500": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25001088
    ],
    "rare": [],
    "boss": []
  },
  "1270012501": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1270012505": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25001088
    ],
    "rare": [],
    "boss": []
  },
  "1310010100": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000117,
      20000900
    ],
    "rare": [],
    "boss": []
  },
  "1310010101": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900
    ],
    "rare": [],
    "boss": []
  },
  "1310010105": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900
    ],
    "rare": [],
    "boss": []
  },
  "1310010200": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000117,
      20000900
    ],
    "rare": [],
    "boss": []
  },
  "1310010201": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900
    ],
    "rare": [],
    "boss": []
  },
  "1310010205": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900
    ],
    "rare": [],
    "boss": []
  },
  "1310010300": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000117,
      20000900
    ],
    "rare": [],
    "boss": []
  },
  "1310010301": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900
    ],
    "rare": [],
    "boss": []
  },
  "1310010305": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900
    ],
    "rare": [],
    "boss": []
  },
  "1310010400": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000117,
      20000900
    ],
    "rare": [],
    "boss": []
  },
  "1310010401": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900
    ],
    "rare": [],
    "boss": []
  },
  "1310010405": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900
    ],
    "rare": [],
    "boss": []
  },
  "1310010500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310010501": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310010505": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310010600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310010601": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310010605": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310010700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310010701": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310010705": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310010800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310010801": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310010805": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310010900": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310010901": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310010905": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011000": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310011001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011005": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310011101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011200": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310011201": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011205": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310011301": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011305": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310011401": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011405": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011500": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310011501": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011505": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310011601": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011605": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011700": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310011701": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011705": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011800": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310011801": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011805": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011900": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310011901": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310011905": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310012000": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310012001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310012005": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310012100": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310012101": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310012105": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310012200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310012201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310012205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310012300": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310012301": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310012305": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310012400": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310012401": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310012405": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310012500": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000117
    ],
    "rare": [],
    "boss": []
  },
  "1310012501": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1310012505": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1315010100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000059,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1315010200": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000060,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1315010300": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000061,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1315010400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000062,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1315010500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000063,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1315010600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000059,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1315010700": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000060,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1315010800": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000061,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1315010900": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000062,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1315011000": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000063,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1315020100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17021004,
      31000059,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1315020200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17022004,
      31000060,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1315020300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17023004,
      31000061,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1315020400": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17024004,
      31000062,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1315020500": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17025004,
      31000063,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1315020600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17021004,
      31000059,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1315020700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17022004,
      31000060,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1315020800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17023004,
      31000061,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1315020900": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17024004,
      31000062,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1315021000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17025004,
      31000063,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1316010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000023,
      21500038,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1331000001": {
    "suggestLv": 1,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000042
    ],
    "rare": [],
    "boss": []
  },
  "1331000003": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000903
    ],
    "rare": [],
    "boss": []
  },
  "1331000004": {
    "suggestLv": 42,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      28000001
    ],
    "rare": [],
    "boss": []
  },
  "1331000005": {
    "suggestLv": 47,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31434028
    ],
    "rare": [],
    "boss": []
  },
  "1331000006": {
    "suggestLv": 52,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000904
    ],
    "rare": [],
    "boss": []
  },
  "1331000007": {
    "suggestLv": 57,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1331000008": {
    "suggestLv": 61,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31434028
    ],
    "rare": [],
    "boss": []
  },
  "1331000010": {
    "suggestLv": 69,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31434028
    ],
    "rare": [],
    "boss": []
  },
  "1332010101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010102": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010111": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010112": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010201": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010202": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010211": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010212": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010301": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010302": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010311": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010312": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010401": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000004,
      20000005,
      20000006,
      20000007,
      20000008,
      20000009,
      20000010,
      20000011,
      20000012,
      20000013,
      20000014,
      20000015,
      20000016,
      20000017,
      20000018,
      20000019,
      20000020,
      20000021,
      20000022,
      20000023,
      20000024,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010402": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000004,
      20000005,
      20000006,
      20000007,
      20000008,
      20000009,
      20000010,
      20000011,
      20000012,
      20000013,
      20000014,
      20000015,
      20000016,
      20000017,
      20000018,
      20000019,
      20000020,
      20000021,
      20000022,
      20000023,
      20000024,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010411": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000004,
      20000005,
      20000006,
      20000007,
      20000008,
      20000009,
      20000010,
      20000011,
      20000012,
      20000013,
      20000014,
      20000015,
      20000016,
      20000017,
      20000018,
      20000019,
      20000020,
      20000021,
      20000022,
      20000023,
      20000024,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1332010412": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000004,
      20000005,
      20000006,
      20000007,
      20000008,
      20000009,
      20000010,
      20000011,
      20000012,
      20000013,
      20000014,
      20000015,
      20000016,
      20000017,
      20000018,
      20000019,
      20000020,
      20000021,
      20000022,
      20000023,
      20000024,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1333010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000013,
      60000131,
      21500038,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1333010102": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25001290,
      26100085,
      26100086
    ],
    "rare": [],
    "boss": []
  },
  "1360010100": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010101": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010105": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010200": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010201": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010205": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010300": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010301": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010305": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010400": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010401": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010405": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010500": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010501": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010505": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010601": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010605": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010700": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010701": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010705": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010800": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010801": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010805": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010900": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010901": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360010905": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360011000": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360011001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360011005": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1360011100": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011101": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011105": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011200": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011201": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011205": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011300": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011301": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011305": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011400": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011401": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011405": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011500": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011501": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011505": {
    "suggestLv": 65,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011600": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011601": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011605": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011700": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011701": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011705": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011800": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011801": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011805": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011900": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011901": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360011905": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012000": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012001": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012005": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012101": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012105": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012301": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012305": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012400": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012401": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012405": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012500": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012501": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1360012505": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1365010100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      17026004,
      17027004,
      31000065,
      31000066,
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1365010200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      17026004,
      17027004,
      31000065,
      31000066,
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1365010300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      17026004,
      17027004,
      31000065,
      31000066,
      60000134,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1410001001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000145,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1410001002": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000145,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1410001003": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000145,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1410001004": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000145,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1410001005": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000145,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1410001006": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000145,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1410001007": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000141,
      60000145,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1410001008": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000141,
      60000145,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1410001009": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000142,
      60000145,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1410001010": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000142,
      60000145,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1410001011": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000143,
      60000145,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1410001012": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000143,
      60000145,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1410001013": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000143,
      60000145,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1410001014": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000143,
      60000145,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1410001015": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000144,
      60000145,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1410001016": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000144,
      60000145,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1410001017": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000144,
      60000145,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1410001018": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [],
    "others": [
      60000144,
      60000145,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1410001019": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000144,
      60000145,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1410001020": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      60000144,
      60000145,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1411001001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31331027,
      71000001,
      60000144,
      60000145,
      20000902
    ],
    "rare": [
      31331027,
      71000001,
      60000144,
      60000145
    ],
    "boss": []
  },
  "1411001002": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31331027,
      71000001,
      60000144,
      60000145,
      20000902
    ],
    "rare": [
      31331027,
      71000001,
      60000144,
      60000145
    ],
    "boss": []
  },
  "1411001003": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31331027,
      71000001,
      60000144,
      60000145,
      20000902
    ],
    "rare": [
      31331027,
      71000001,
      60000144,
      60000145
    ],
    "boss": []
  },
  "1412001001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31436039,
      71000001,
      60000141,
      60000145,
      20000902
    ],
    "rare": [
      31436039,
      71000001,
      60000141,
      60000145
    ],
    "boss": []
  },
  "1412001002": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31436039,
      71000001,
      60000141,
      60000145,
      20000902
    ],
    "rare": [
      31436039,
      71000001,
      60000141,
      60000145
    ],
    "boss": []
  },
  "1412001003": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31436039,
      71000001,
      60000141,
      60000145,
      20000902
    ],
    "rare": [
      31436039,
      71000001,
      60000141,
      60000145
    ],
    "boss": []
  },
  "1412001004": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      33031010,
      71000001,
      60000142,
      60000145,
      20000902
    ],
    "rare": [
      33031010,
      71000001,
      60000142,
      60000145
    ],
    "boss": []
  },
  "1412001005": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      33031010,
      71000001,
      60000142,
      60000145,
      20000902
    ],
    "rare": [
      33031010,
      71000001,
      60000142,
      60000145
    ],
    "boss": []
  },
  "1412001006": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      33031010,
      71000001,
      60000142,
      60000145,
      20000902
    ],
    "rare": [
      33031010,
      71000001,
      60000142,
      60000145
    ],
    "boss": []
  },
  "1412001007": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31446037,
      31436038,
      71000001,
      60000143,
      60000145,
      20000902
    ],
    "rare": [
      31446037,
      31436038,
      71000001,
      60000143,
      60000145
    ],
    "boss": []
  },
  "1412001008": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31446037,
      31436038,
      71000001,
      60000143,
      60000145,
      20000902
    ],
    "rare": [
      31446037,
      31436038,
      71000001,
      60000143,
      60000145
    ],
    "boss": []
  },
  "1412001009": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31446037,
      31436038,
      71000001,
      60000143,
      60000145,
      20000902
    ],
    "rare": [
      31446037,
      31436038,
      71000001,
      60000143,
      60000145
    ],
    "boss": []
  },
  "1413001001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31446037,
      41000025,
      71000001
    ],
    "rare": [],
    "boss": []
  },
  "1431010100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010200": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010201": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010205": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010300": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010301": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010305": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431010401": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431010405": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431010500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431010501": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431010505": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431010600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431010601": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431010605": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431010700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010701": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010705": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010801": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010805": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010900": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010901": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431010905": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1431011000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431011001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431011005": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431011100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431011101": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431011105": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431011200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431011201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431011205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431011300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431011301": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431011305": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431011400": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431011401": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431011405": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431011500": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431011501": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431011505": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431011600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431011601": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431011605": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431011700": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431011701": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431011705": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431011800": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431011801": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431011805": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431011900": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431011901": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431011905": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012000": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012005": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431012201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431012205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431012300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431012301": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431012305": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431012400": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431012401": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431012405": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1431012500": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012501": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012505": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012601": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012605": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012701": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012705": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1431012800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431012801": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431012805": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431012900": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431012901": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431012905": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431013000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431013001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1431013005": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1432010101": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000056
    ],
    "rare": [],
    "boss": []
  },
  "1435010102": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25100002
    ],
    "rare": [],
    "boss": []
  },
  "1436010102": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25001296,
      26100093,
      26100094
    ],
    "rare": [],
    "boss": []
  },
  "1450010100": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450010200": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450010300": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450010400": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450010500": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450010600": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450010700": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450010800": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450010900": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450011000": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450020100": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450020200": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450020300": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450020400": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450020500": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450020600": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450020700": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450020800": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450020900": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450021000": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21101000,
      21001000,
      21002000,
      21102000
    ],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450030100": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450030200": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450030300": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450030400": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450030500": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450030600": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450030700": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450030800": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450030900": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450031000": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450040100": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450040200": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450040300": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450040400": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450050100": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450050200": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450050300": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1450050400": {
    "suggestLv": 15,
    "enemyNature": [
      6
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1451010100": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1451010200": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1451010300": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21101000,
      21001000,
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000164,
      60000163,
      21901002,
      21901001,
      21901000
    ],
    "rare": [],
    "boss": []
  },
  "1453010100": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000009,
      21500038,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1453010200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000009,
      21500038,
      21500037
    ],
    "rare": [],
    "boss": []
  },
  "1456010100": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      26100095,
      26100096,
      71000001
    ],
    "rare": [],
    "boss": []
  },
  "1460010100": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460010200": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460010300": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460010400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460010500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233011,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460010600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460010700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460010800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233011,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460010900": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460011000": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31231010,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460011100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460011200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460011300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31231010,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460011400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460011500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31246008,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460011600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460011700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460011800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31246008,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460011900": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000167
    ],
    "rare": [],
    "boss": []
  },
  "1460012000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      17020003
    ],
    "rare": [],
    "boss": []
  },
  "1460012100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1460012200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000167
    ],
    "rare": [],
    "boss": []
  },
  "1460012300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      17018003
    ],
    "rare": [],
    "boss": []
  },
  "1460012400": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1460012500": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      17019003
    ],
    "rare": [],
    "boss": []
  },
  "1460012600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1460012700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1460020101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460020102": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31231010,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460020103": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460020104": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31231010,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460020105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460020106": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233011,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460020107": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460020108": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233011,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460020109": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460020110": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31246008,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460020111": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1460020112": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31246008,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1462010101": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000021,
      20000909,
      71000001
    ],
    "rare": [],
    "boss": []
  },
  "1462010102": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000027,
      20000909,
      71000001
    ],
    "rare": [],
    "boss": []
  },
  "1464010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31235014,
      71000001,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1464010102": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31233015,
      71000001,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1464010103": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31235014,
      71000001,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1464010104": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31233015,
      71000001,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480010100": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1480010200": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1480010300": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1480010400": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31334032,
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1480010500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480010600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480010700": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480010800": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31034027,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480010900": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480011000": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480011100": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480011200": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480011300": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480011400": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480011500": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480011600": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480011700": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480011800": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480011900": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480012000": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480012100": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480012200": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480012300": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480012400": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31334032,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480012500": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31034027,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480020101": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1480020102": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480020103": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480020104": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480020201": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31334032,
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1480020202": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31034027,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480020203": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31334032,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1480020204": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31034027,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1481010101": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000169
    ],
    "rare": [],
    "boss": []
  },
  "1482010101": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000024,
      25001299,
      71000001
    ],
    "rare": [],
    "boss": []
  },
  "1483010101": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25100002,
      25001300
    ],
    "rare": [],
    "boss": []
  },
  "1500010100": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500010200": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500010300": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000900,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500010400": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      33026009,
      60000099,
      60000100,
      60000101,
      60000102,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500010500": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500010600": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500010700": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500010800": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33021004,
      60000099,
      60000100,
      60000101,
      60000102,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500010900": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33026009,
      33021004,
      60000099,
      60000100,
      60000101,
      60000102,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500011000": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000099,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500011100": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000100,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500011200": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000101,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500011300": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000102,
      20000901,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500011400": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000099,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500011500": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000100,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500011600": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000101,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500011700": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000102,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500011800": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1500012000": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1500012100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000904
    ],
    "rare": [],
    "boss": []
  },
  "1500012200": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000029
    ],
    "rare": [],
    "boss": []
  },
  "1500012300": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000029
    ],
    "rare": [],
    "boss": []
  },
  "1500012400": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000031
    ],
    "rare": [],
    "boss": []
  },
  "1500012500": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000031
    ],
    "rare": [],
    "boss": []
  },
  "1500012600": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33036012,
      60000099,
      60000100,
      60000101,
      60000102,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500012700": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33033013,
      60000099,
      60000100,
      60000101,
      60000102,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500012800": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33036012,
      60000099,
      60000100,
      60000101,
      60000102,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1500012900": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33033013,
      60000099,
      60000100,
      60000101,
      60000102,
      20000902,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1510001001": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000173,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1510001002": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000173,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1510001003": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000173,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1510001004": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000173,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1510001005": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000173,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1510001006": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000173,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1510002001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510002002": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510002003": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510002004": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510002005": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510002006": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510003001": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510003002": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510003003": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510003004": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510003005": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510003006": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510004001": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510004002": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510004003": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510004004": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510004005": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510004006": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510005001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510005002": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510005003": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510005004": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510005005": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510005006": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510005007": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510005008": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1510005009": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1511001001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000173
    ],
    "rare": [],
    "boss": []
  },
  "1512001001": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31136036,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1512001002": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31136036,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1512010100": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31136036,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1512010200": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31136036,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1513001001": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000028,
      25001998,
      71000001
    ],
    "rare": [],
    "boss": []
  },
  "1515001001": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31133037,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1515001002": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31133037,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1515010100": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31133037,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1515010200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31133037,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560010100": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1560010101": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1560010200": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1560010300": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1560010400": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1560010500": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560010501": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560010600": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560010700": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560010800": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560010900": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560010901": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560011000": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560011100": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560011200": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560011300": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560011301": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560011400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560011500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560011600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560011700": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560011701": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560011800": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560011900": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560012000": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560012100": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560012101": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560012200": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560012300": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560012400": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560012500": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560012501": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560012600": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560012700": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560012800": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560012900": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1560012901": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000070,
      17028004,
      31000071,
      17029004,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1561010100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000178,
      60000180,
      31000070,
      17028004,
      31000071,
      17029004,
      71000001,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1564010100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000177,
      60000179,
      31000070,
      17028004,
      31000071,
      17029004,
      71000001,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1569001001": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000,
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      42000013,
      60000178
    ],
    "rare": [],
    "boss": []
  },
  "1569001002": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000,
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31141007,
      60000177
    ],
    "rare": [],
    "boss": []
  },
  "1571000000": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1571000001": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1571000002": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1571010001": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571010002": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571010003": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571010004": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571010005": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1571010006": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1571010007": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1571010008": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1571010009": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31646002,
      31631005,
      31623007,
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1571010010": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31646002,
      31631005,
      31623007,
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1571010011": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31646002,
      31631005,
      31623007,
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1571010012": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31646002,
      31631005,
      31623007,
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1571030000": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1571040000": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002
    ],
    "crystalTier": null,
    "relicBoxes": [
      21002000,
      21102000
    ],
    "coreModules": [
      27000000
    ],
    "skillModules": [
      26000000
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1571110000": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31635021,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571110001": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31635021,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571110002": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31635021,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571120000": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31632018,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571120001": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31632018,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571120002": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31632018,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571130000": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31626006,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571130001": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31626006,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571130002": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31626006,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571140000": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31643019,
      31621015,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571140001": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31643019,
      31621015,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571140002": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31643019,
      31621015,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571150000": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31634012,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571150001": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31634012,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571150002": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31634012,
      32000059,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571160000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31634016,
      32000059,
      60000017,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571160001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31634016,
      32000059,
      60000017,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571160002": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31634016,
      32000059,
      60000017,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571170000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31646002,
      32000059,
      60000017,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571170001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31646002,
      32000059,
      60000017,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571170002": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31646002,
      32000059,
      60000017,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571180000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31623007,
      32000059,
      60000017,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571180001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31623007,
      32000059,
      60000017,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571180002": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31623007,
      32000059,
      60000017,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571190000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31631005,
      32000059,
      60000017,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571190001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31631005,
      32000059,
      60000017,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1571190002": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31631005,
      32000059,
      60000017,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1572000000": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1572000001": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1572000002": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1572010001": {
    "suggestLv": 15,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015,
      31000016,
      31000018
    ],
    "rare": [],
    "boss": []
  },
  "1574020100": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31646002,
      31631005,
      31623007,
      32000059
    ],
    "rare": [],
    "boss": []
  },
  "1591010101": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000187,
      60000188,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1591010102": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010103": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010104": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010105": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010106": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010201": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000187,
      60000188,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1591010202": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010203": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010204": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010205": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010206": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010301": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000187,
      60000188,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1591010302": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010303": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010304": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010305": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010306": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010401": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000187,
      60000188,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1591010402": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010403": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010404": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010405": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010406": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010501": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000187,
      60000188,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1591010502": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010503": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010504": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010505": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1591010506": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592010100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17031004,
      31000073,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592010101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000073,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592010105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17031004,
      31000073,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592010200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17031004,
      31000073,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592010201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000073,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592010205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17031004,
      31000073,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592020100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17030004,
      31000072,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592020101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000072,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592020105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17030004,
      31000072,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592020200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17030004,
      31000072,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592020201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000072,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592020205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17030004,
      31000072,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592030100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17032004,
      31000074,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592030101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000074,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592030105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17032004,
      31000074,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592030200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17032004,
      31000074,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592030201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000074,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592030205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17032004,
      31000074,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592040100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17033004,
      31000075,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592040101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000075,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592040105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17033004,
      31000075,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592040200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17033004,
      31000075,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592040201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000075,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592040205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17033004,
      31000075,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592050100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17034004,
      31000076,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592050101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000076,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592050105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17034004,
      31000076,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592050200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17034004,
      31000076,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592050201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000076,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1592050205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      17034004,
      31000076,
      60000187,
      60000188,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1593001001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000187,
      71000001
    ],
    "rare": [],
    "boss": []
  },
  "1594001001": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000,
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000030,
      71000001
    ],
    "rare": [],
    "boss": []
  },
  "1600001001": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000,
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000031,
      71000001
    ],
    "rare": [],
    "boss": []
  },
  "1620010100": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000057,
      31000021,
      21901001
    ],
    "rare": [],
    "boss": []
  },
  "1620010101": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000057,
      31000021,
      21901001
    ],
    "rare": [],
    "boss": []
  },
  "1620010102": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057
    ],
    "rare": [],
    "boss": []
  },
  "1620010191": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000057,
      31000021,
      21901001
    ],
    "rare": [],
    "boss": []
  },
  "1620010192": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000057,
      31000021,
      21901001
    ],
    "rare": [],
    "boss": []
  },
  "1620010193": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000057,
      31000021,
      21901001
    ],
    "rare": [],
    "boss": []
  },
  "1620010194": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000057,
      31000021,
      21901001
    ],
    "rare": [],
    "boss": []
  },
  "1620010199": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000057,
      31000021,
      21901001
    ],
    "rare": [],
    "boss": []
  },
  "1620010200": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010201": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010202": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010209": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      45040055,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1620010291": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010292": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010293": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010294": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010295": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010299": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [
      21103000,
      21003000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040055,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010301": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010302": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010303": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010304": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010305": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010306": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010309": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000057,
      45040056,
      45040057
    ],
    "rare": [],
    "boss": []
  },
  "1620010391": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010392": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010393": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010394": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010395": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1620010399": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000057,
      31000021,
      45040056,
      45040057,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1621020100": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000021,
      31000025,
      60000058,
      60000057,
      45030016,
      45030017,
      45040046,
      45040047,
      45040048,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1621020200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000006,
      21500038
    ],
    "rare": [],
    "boss": []
  },
  "1621020300": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25100002
    ],
    "rare": [],
    "boss": []
  },
  "1625001001": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000,
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000032,
      71000001
    ],
    "rare": [],
    "boss": []
  },
  "1626010100": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010101": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010102": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010103": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010104": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010105": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000013,
      20000017,
      20000001
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010200": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010201": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010202": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010203": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010204": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010205": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000020,
      20000014,
      20000000
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010300": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000204,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010301": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010302": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010303": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010304": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010305": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000022,
      20000012,
      20000005
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000204,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000205,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010401": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010402": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010403": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010404": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010405": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000023,
      20000010,
      20000002
    ],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000001
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000205,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010500": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000035,
      60000095,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010501": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010502": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010503": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010504": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010505": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000011,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000035,
      60000095,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010600": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000204,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010601": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010602": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010603": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010604": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010605": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000025,
      20000015,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000204,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010700": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000205,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010701": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010702": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010703": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010704": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010705": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000009,
      20000008
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000205,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000094,
      60000096,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010801": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010802": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010803": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010804": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010805": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000094,
      60000096,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010900": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000035,
      60000036,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010901": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010902": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010903": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010904": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626010905": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000035,
      60000036,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626011000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000094,
      60000037,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626011001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626011002": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626011003": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626011004": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1626011005": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000016,
      20000007
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000094,
      60000037,
      60000034,
      60000033,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1627001001": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000049
    ],
    "rare": [],
    "boss": []
  },
  "1628010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000011,
      21500038,
      21500037,
      60000034
    ],
    "rare": [],
    "boss": []
  },
  "1629010101": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000077,
      60000033,
      60000034
    ],
    "rare": [],
    "boss": []
  },
  "1640010101": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000208,
      60000209,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1640010102": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000208,
      60000209,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1640010103": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000208,
      60000209,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1640010104": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000208,
      60000209,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1640010105": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000208,
      60000209,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1640010106": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000208,
      60000209,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1640010201": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000208,
      60000209,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1640010202": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000208,
      60000209,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1640010203": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000208,
      60000209,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1640010204": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000208,
      60000209,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1640010205": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000208,
      60000209,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1640010206": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000208,
      60000209,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1640010301": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010302": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010303": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010304": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010305": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010306": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010307": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010308": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010309": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010401": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010402": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010403": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010404": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010405": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010406": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010407": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010408": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010409": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010501": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010502": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010503": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010504": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010505": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010506": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010601": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010602": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010603": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010604": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010605": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1640010606": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1641010100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31135038,
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1641010101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1641010105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31135038,
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1641010200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31135038,
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1641010201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1641010205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31135038,
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1642010100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233019,
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1642010101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1642010105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233019,
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1642010200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233019,
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1642010201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1642010205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233019,
      60000208,
      60000209,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1643010100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000,
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      41000033,
      71000001
    ],
    "rare": [],
    "boss": []
  },
  "1644010100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000208
    ],
    "rare": [],
    "boss": []
  },
  "1650000001": {
    "suggestLv": 1,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000042
    ],
    "rare": [],
    "boss": []
  },
  "1650000003": {
    "suggestLv": 12,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000903
    ],
    "rare": [],
    "boss": []
  },
  "1650000004": {
    "suggestLv": 18,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31434028
    ],
    "rare": [],
    "boss": []
  },
  "1650000005": {
    "suggestLv": 24,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      28000001
    ],
    "rare": [],
    "boss": []
  },
  "1650000006": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000904
    ],
    "rare": [],
    "boss": []
  },
  "1650000007": {
    "suggestLv": 36,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1650000008": {
    "suggestLv": 42,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31434028
    ],
    "rare": [],
    "boss": []
  },
  "1650000009": {
    "suggestLv": 49,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000905
    ],
    "rare": [],
    "boss": []
  },
  "1650000010": {
    "suggestLv": 56,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      28000001
    ],
    "rare": [],
    "boss": []
  },
  "1650000012": {
    "suggestLv": 69,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31434028
    ],
    "rare": [],
    "boss": []
  },
  "1652010101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010102": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010111": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010112": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010201": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010202": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010211": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010212": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010301": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010302": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010311": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010312": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010401": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000004,
      20000005,
      20000006,
      20000007,
      20000008,
      20000009,
      20000010,
      20000011,
      20000012,
      20000013,
      20000014,
      20000015,
      20000016,
      20000017,
      20000018,
      20000019,
      20000020,
      20000021,
      20000022,
      20000023,
      20000024,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010402": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000004,
      20000005,
      20000006,
      20000007,
      20000008,
      20000009,
      20000010,
      20000011,
      20000012,
      20000013,
      20000014,
      20000015,
      20000016,
      20000017,
      20000018,
      20000019,
      20000020,
      20000021,
      20000022,
      20000023,
      20000024,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010411": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000004,
      20000005,
      20000006,
      20000007,
      20000008,
      20000009,
      20000010,
      20000011,
      20000012,
      20000013,
      20000014,
      20000015,
      20000016,
      20000017,
      20000018,
      20000019,
      20000020,
      20000021,
      20000022,
      20000023,
      20000024,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010412": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000004,
      20000005,
      20000006,
      20000007,
      20000008,
      20000009,
      20000010,
      20000011,
      20000012,
      20000013,
      20000014,
      20000015,
      20000016,
      20000017,
      20000018,
      20000019,
      20000020,
      20000021,
      20000022,
      20000023,
      20000024,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652010600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652011600": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000001,
      20000003,
      20000008,
      20000009,
      20000012,
      20000016,
      20000021,
      20000022
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652020600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652021600": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000006,
      20000004,
      20000010,
      20000014,
      20000015,
      20000019,
      20000023
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652030600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652031600": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000002,
      20000007,
      20000005,
      20000011,
      20000013,
      20000017,
      20000018,
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652040600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000004,
      20000005,
      20000006,
      20000007,
      20000008,
      20000009,
      20000010,
      20000011,
      20000012,
      20000013,
      20000014,
      20000015,
      20000016,
      20000017,
      20000018,
      20000019,
      20000020,
      20000021,
      20000022,
      20000023,
      20000024,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1652041600": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000003,
      20000004,
      20000005,
      20000006,
      20000007,
      20000008,
      20000009,
      20000010,
      20000011,
      20000012,
      20000013,
      20000014,
      20000015,
      20000016,
      20000017,
      20000018,
      20000019,
      20000020,
      20000021,
      20000022,
      20000023,
      20000024,
      20000025
    ],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1670001001": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000213,
      60000214,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1670001002": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000213,
      60000214,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1670001003": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000213,
      60000214,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1670001004": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000213,
      60000214,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1670001005": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000213,
      60000214,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1670001006": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000213,
      60000214,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1670002001": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670002002": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670002003": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670002004": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670002005": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670002006": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670003001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670003002": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670003003": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670003004": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670003005": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670003006": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670004001": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670004002": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670004003": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670004004": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670004005": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670004006": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670005001": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670005002": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670005003": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670005004": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670005005": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670005006": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670006001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670006002": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670006003": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670006004": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670006005": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670006006": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670007001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670007002": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670007003": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670007004": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670007005": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670007006": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670008001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670008002": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670008003": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670008004": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670008005": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1670008006": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000213,
      60000214,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1671001001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000215,
      71000001,
      60000213
    ],
    "rare": [],
    "boss": []
  },
  "1672001001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      33514005
    ],
    "rare": [],
    "boss": []
  },
  "1672001002": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      33514005
    ],
    "rare": [],
    "boss": []
  },
  "1672001100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      33514005
    ],
    "rare": [],
    "boss": []
  },
  "1672001200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      33514005
    ],
    "rare": [],
    "boss": []
  },
  "1672002001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000078,
      17035004
    ],
    "rare": [],
    "boss": []
  },
  "1672002002": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000078,
      17035004
    ],
    "rare": [],
    "boss": []
  },
  "1672002100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000078,
      17035004
    ],
    "rare": [],
    "boss": []
  },
  "1672002200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000078,
      17035004
    ],
    "rare": [],
    "boss": []
  },
  "1672003001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000079,
      17036004
    ],
    "rare": [],
    "boss": []
  },
  "1672003002": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000079,
      17036004
    ],
    "rare": [],
    "boss": []
  },
  "1672003100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000079,
      17036004
    ],
    "rare": [],
    "boss": []
  },
  "1672003200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000079,
      17036004
    ],
    "rare": [],
    "boss": []
  },
  "1672004001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000080,
      17037004
    ],
    "rare": [],
    "boss": []
  },
  "1672004002": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000080,
      17037004
    ],
    "rare": [],
    "boss": []
  },
  "1672004100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000080,
      17037004
    ],
    "rare": [],
    "boss": []
  },
  "1672004200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000080,
      17037004
    ],
    "rare": [],
    "boss": []
  },
  "1672005001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000081,
      17038004
    ],
    "rare": [],
    "boss": []
  },
  "1672005002": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000081,
      17038004
    ],
    "rare": [],
    "boss": []
  },
  "1672005100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000081,
      17038004
    ],
    "rare": [],
    "boss": []
  },
  "1672005200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000081,
      17038004
    ],
    "rare": [],
    "boss": []
  },
  "1672006001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000082,
      17039004
    ],
    "rare": [],
    "boss": []
  },
  "1672006002": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000082,
      17039004
    ],
    "rare": [],
    "boss": []
  },
  "1672006100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000082,
      17039004
    ],
    "rare": [],
    "boss": []
  },
  "1672006200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000082,
      17039004
    ],
    "rare": [],
    "boss": []
  },
  "1681010100": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1681010200": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1681010300": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1681010400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31334032,
      31234020,
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1681010500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681010600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681010700": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681010800": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31034027,
      33032015,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681010900": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681011000": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681011100": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681011200": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681011300": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681011400": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681011500": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681011600": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681011700": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681011800": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681011900": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681012000": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681012100": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681012200": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681012300": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681012400": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31334032,
      31234020,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681012500": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31034027,
      33032015,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681020101": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1681020102": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681020103": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681020104": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681020201": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31334032,
      31234020,
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1681020202": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31034027,
      33032015,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681020203": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31334032,
      31234020,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1681020204": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31034027,
      33032015,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1682010101": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000169
    ],
    "rare": [],
    "boss": []
  },
  "1683010101": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000024,
      25001299,
      71000001
    ],
    "rare": [],
    "boss": []
  },
  "1684010101": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25100002,
      25001300
    ],
    "rare": [],
    "boss": []
  },
  "1691000001": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1691001001": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1691001002": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1691001003": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1691001004": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1691002001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1691002002": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1691002003": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1691002004": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1691003001": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1691003002": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1691003003": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1691003004": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1692001005": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33035016,
      31531025,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1692002005": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33035016,
      33031010,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1692003005": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33035016,
      31634012,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1692010100": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33035016,
      31531025,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1692010200": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33035016,
      33031010,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1692010300": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21003000,
      21103000
    ],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      33035016,
      31634012,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1693001001": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1693001002": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [
      26000002
    ],
    "others": [
      31000015
    ],
    "rare": [],
    "boss": []
  },
  "1693001003": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31000015
    ],
    "rare": [],
    "boss": []
  },
  "1693001004": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20011002,
      31000015
    ],
    "rare": [],
    "boss": []
  },
  "1693001005": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20010002,
      31000015
    ],
    "rare": [],
    "boss": []
  },
  "1693001006": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015
    ],
    "rare": [],
    "boss": []
  },
  "1693001007": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      31000015
    ],
    "rare": [],
    "boss": []
  },
  "1699010100": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699010200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699010300": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699010400": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699010500": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699020100": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699020200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699020300": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699020400": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699020500": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699030100": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699030200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699030300": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699030400": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699030500": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699040100": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699040200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699040300": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699040400": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1699040500": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1700010100": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700010200": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700010300": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700010400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700010500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233011,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700010600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700010700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700010800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233011,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700010900": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700011000": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31231010,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700011100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700011200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700011300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31231010,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700011400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700011500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31246008,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700011600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700011700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700011800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31246008,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700011900": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000167
    ],
    "rare": [],
    "boss": []
  },
  "1700012000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      17020003
    ],
    "rare": [],
    "boss": []
  },
  "1700012100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1700012200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000167
    ],
    "rare": [],
    "boss": []
  },
  "1700012300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      17018003
    ],
    "rare": [],
    "boss": []
  },
  "1700012400": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1700012500": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      17019003
    ],
    "rare": [],
    "boss": []
  },
  "1700012600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1700012700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1700020101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700020102": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31231010,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700020103": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700020104": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31231010,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700020105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700020106": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000022,
      20000010,
      20000006
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233011,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700020107": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700020108": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000024,
      20000017,
      20000005
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31233011,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700020109": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700020110": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000019,
      20000011,
      20000004
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31246008,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700020111": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1700020112": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000000,
      20000001,
      20000002,
      20000025,
      20000021,
      20000009,
      20000003
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31246008,
      60000167,
      31000021
    ],
    "rare": [],
    "boss": []
  },
  "1704010101": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31235014,
      71000001,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1704010102": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31233015,
      71000001,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1704010103": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31235014,
      71000001,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1704010104": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31233015,
      71000001,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1704010105": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31235012,
      71000001,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1704010106": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [],
    "others": [
      31235012,
      71000001,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1706001001": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20013002
    ],
    "rare": [],
    "boss": []
  },
  "1706001002": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20013002
    ],
    "rare": [],
    "boss": []
  },
  "1706001003": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20013002
    ],
    "rare": [],
    "boss": []
  },
  "1706001004": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      20013002
    ],
    "rare": [],
    "boss": []
  },
  "1706001005": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1706001006": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [],
    "rare": [],
    "boss": []
  },
  "1706001007": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000059
    ],
    "rare": [],
    "boss": []
  },
  "1708001001": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32136001,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1708001002": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32136001,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1708001003": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32136001,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1708001004": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32136001,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1708001005": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32136001,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1708001006": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32136001,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1708001007": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32136001,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1708001008": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32136001,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1708001009": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32136001,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1709001001": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32136001,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1709001002": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32136001,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1709001003": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32136001,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1742010100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010200": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010201": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010205": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010300": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010301": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010305": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742010401": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742010405": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742010500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742010501": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742010505": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742010600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742010601": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742010605": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742010700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010701": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010705": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010801": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010805": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010900": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010901": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742010905": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31135024
    ]
  },
  "1742011000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742011001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742011005": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742011100": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742011101": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742011105": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742011200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742011201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742011205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742011300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742011301": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742011305": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742011400": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742011401": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742011405": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742011500": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742011501": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742011505": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742011600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742011601": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742011605": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742011700": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742011701": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742011705": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742011800": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742011801": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742011805": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742011900": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742011901": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742011905": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012000": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012005": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012100": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012101": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012105": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012200": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742012201": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742012205": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742012300": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742012301": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742012305": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742012400": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742012401": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742012405": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000021,
      20000022
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31131027
    ]
  },
  "1742012500": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012501": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012505": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012600": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012601": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012605": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012700": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012701": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012705": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000019,
      20000023
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31136025,
      31136031
    ]
  },
  "1742012800": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742012801": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742012805": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742012900": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742012901": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742012905": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742013000": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742013001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1742013005": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [
      20000024,
      20000020,
      20000025
    ],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000055,
      60000056,
      31000021
    ],
    "rare": [],
    "boss": [
      31143021
    ]
  },
  "1743010101": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000056
    ],
    "rare": [],
    "boss": []
  },
  "1746010102": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25100002
    ],
    "rare": [],
    "boss": []
  },
  "1747010102": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25001296,
      26100093,
      26100094
    ],
    "rare": [],
    "boss": []
  },
  "1750001001": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000173,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1750001002": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000173,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1750001003": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000173,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1750001004": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000173,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1750001005": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000173,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1750001006": {
    "suggestLv": 35,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000173,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1750002001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750002002": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750002003": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750002004": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750002005": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750002006": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750003001": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750003002": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750003003": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750003004": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750003005": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750003006": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750004001": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750004002": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750004003": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750004004": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750004005": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750004006": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750005001": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750005002": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750005003": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750005004": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750005005": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750005006": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750005007": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750005008": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1750005009": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1751001001": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000173
    ],
    "rare": [],
    "boss": []
  },
  "1754001001": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31136036,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1754001002": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31136036,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1755001001": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31133037,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1755001002": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31133037,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1756010100": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756010200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756010300": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756010400": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756010500": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756020100": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756020200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756020300": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756020400": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756020500": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756030100": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756030200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756030300": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756030400": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756030500": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756040100": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756040200": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756040300": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756040400": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1756040500": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      72000021
    ],
    "rare": [],
    "boss": []
  },
  "1758001001": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31135041,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1758001002": {
    "suggestLv": 100,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31135041,
      60000173,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1760001001": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000243,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1760001002": {
    "suggestLv": 40,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000243,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1760001003": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000243,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1760001004": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000243,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1760001005": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000244,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1760001006": {
    "suggestLv": 80,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000244,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1760001007": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000244,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1761001001": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000243,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1761001002": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000243,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1761001003": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000243,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1761001004": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000243,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1761001005": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000244,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1761001006": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000244,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1761001007": {
    "suggestLv": 60,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000244,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1761001008": {
    "suggestLv": 110,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000244,
      60000245,
      21901006,
      21901002
    ],
    "rare": [],
    "boss": []
  },
  "1776010100": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1776010200": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1776010300": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1776010400": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000083,
      31334032,
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1776010500": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776010600": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776010700": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776010800": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000083,
      31234020,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776010900": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776011000": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776011100": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776011200": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776011300": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776011400": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776011500": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776011600": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776011700": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776011800": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776011900": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776012000": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776012100": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776012200": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776012300": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776012400": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32541002,
      31034027,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776012500": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000084,
      33032015,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776020101": {
    "suggestLv": 30,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1776020102": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776020103": {
    "suggestLv": 70,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776020104": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776020201": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 1,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000001
    ],
    "others": [
      31000083,
      31334032,
      60000169,
      20000901
    ],
    "rare": [],
    "boss": []
  },
  "1776020202": {
    "suggestLv": 50,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000083,
      31234020,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776020203": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      32541002,
      31034027,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1776020204": {
    "suggestLv": 90,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [
      27000002
    ],
    "skillModules": [
      26000002
    ],
    "others": [
      31000084,
      33032015,
      60000169,
      20000902
    ],
    "rare": [],
    "boss": []
  },
  "1777010101": {
    "suggestLv": 20,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": 2,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      60000169
    ],
    "rare": [],
    "boss": []
  },
  "1778010101": {
    "suggestLv": 75,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [
      21104000,
      21007000
    ],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25001299,
      71000001
    ],
    "rare": [],
    "boss": []
  },
  "1779010101": {
    "suggestLv": 120,
    "enemyNature": [
      3,
      2,
      3
    ],
    "materials": [],
    "crystalTier": null,
    "relicBoxes": [],
    "coreModules": [],
    "skillModules": [],
    "others": [
      25100002,
      25001300,
      25001985
    ],
    "rare": [],
    "boss": []
  }
};

function getStageDetail(copyId, barrierId) {
  if (STAGE_DROPS[copyId]) return STAGE_DROPS[copyId];
  if (barrierId && STAGE_DROPS[barrierId]) return STAGE_DROPS[barrierId];
  return null;
}

/**
 * 按官方多槽位规则抽取关卡掉落道具
 * @param {number} copyId 战斗点ID
 * @param {number} barrierId 大关ID
 * @param {number} [enemyNature] 敌方属性（1水 2火 3风 4土 5光 6暗）
 * @param {boolean} [isBoss] 是否BOSS战
 * @param {number} [dblMul] 双倍掉落倍率
 * @returns {Array<{type: number, num: number}>}
 */
function rollStageDrops(copyId, barrierId, enemyNature, isBoss, dblMul) {
  var cfg = getStageDetail(copyId, barrierId);
  if (!cfg) return [];

  var mul = Math.max(1, Number(dblMul) || 1);
  var dropsMap = {};

  function add(type, count) {
    if (!type) return;
    var c = count == null ? 1 : count;
    dropsMap[type] = (dropsMap[type] || 0) + c * mul;
  }

  // 1. 核心晶组槽位（1~2 个）
  if (cfg.coreModules && cfg.coreModules.length > 0) {
    var mod = cfg.coreModules[0];
    var cCore = Math.random() < 0.5 ? 2 : 1;
    add(mod, cCore);
  }

  // 2. 技能模组槽位（1~2 个）
  if (cfg.skillModules && cfg.skillModules.length > 0) {
    var smod = cfg.skillModules[0];
    var cSkill = Math.random() < 0.5 ? 2 : 1;
    add(smod, cSkill);
  }

  // 3. 遗物箱槽位（旧式/制式/新制圣器与核心遗物箱，1 个）
  if (cfg.relicBoxes && cfg.relicBoxes.length > 0) {
    var box = cfg.relicBoxes[Math.floor(Math.random() * cfg.relicBoxes.length)];
    add(box, 1);
  }

  // 4. 属性结晶槽位（根据被击败敌方属性掉落对应属性结晶，1~3 个）
  if (cfg.crystalTier != null) {
    var nat = Number(enemyNature);
    if (!nat || nat < 1 || nat > 6) {
      if (cfg.enemyNature && cfg.enemyNature.length > 0) {
        nat = cfg.enemyNature[Math.floor(Math.random() * cfg.enemyNature.length)];
      } else {
        nat = 6;
      }
    }
    var cid = (nat >= 1 && nat <= 6) ? (20010000 + (nat - 1) * 1000 + cfg.crystalTier) : (20016000 + cfg.crystalTier);
    var cCrys = isBoss ? (Math.random() < 0.5 ? 3 : 2) : (Math.random() < 0.5 ? 2 : 1);
    add(cid, cCrys);
  }

  // 5. 进化材料/契约槽位（1~2 个）
  if (cfg.materials && cfg.materials.length > 0) {
    var mat = cfg.materials[Math.floor(Math.random() * cfg.materials.length)];
    var cMat = Math.random() < 0.3 ? 2 : 1;
    add(mat, cMat);
  }

  // 6. 其它特定展示掉落（如 31000021 信仰灵光等）
  if (cfg.others && cfg.others.length > 0) {
    for (var i = 0; i < cfg.others.length; i++) {
      var otherId = cfg.others[i];
      if (isBoss || Math.random() < 0.35) {
        add(otherId, 1);
      }
    }
  }

  // 7. 稀有掉落项（BOSS 30%, 道中 10%）
  if (cfg.rare && cfg.rare.length > 0) {
    var rareRate = isBoss ? 0.3 : 0.1;
    if (Math.random() < rareRate) {
      var rItem = cfg.rare[Math.floor(Math.random() * cfg.rare.length)];
      add(rItem, 1);
    }
  }

  // 8. BOSS 专属掉落（80% 掉落）
  if (isBoss && cfg.boss && cfg.boss.length > 0 && Math.random() < 0.8) {
    var bItem = cfg.boss[Math.floor(Math.random() * cfg.boss.length)];
    add(bItem, 1);
  }

  return Object.entries(dropsMap).map(([type, num]) => ({ type: Number(type), num }));
}

module.exports = {
  STAGE_DROPS,
  getStageDetail,
  rollStageDrops,
};
