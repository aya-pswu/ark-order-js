// 祭坛（ServantAltar，功能 id 26，通关 3-4 开启）静态数据与纯函数
// 生成：tools/bc_cmp/extract_altar.js（源：CfgServantAltar 反编译），勿手改。
// 本地服自定：FAME_WEIGHTS 名气公式（官方名气为不可考的累积计数，本地服按誓灵培养面快照推导）。

const ENTRIES = [
  {
    "camp": 13,
    "state": 1,
    "icon": "IconJapanOn",
    "unlockCost": [
      0,
      0
    ]
  },
  {
    "camp": 16,
    "state": 1,
    "icon": "IconEgyptOn",
    "unlockCost": [
      950,
      35000
    ]
  },
  {
    "camp": 15,
    "state": 1,
    "icon": "IconChinaOn",
    "unlockCost": [
      1900,
      40000
    ]
  },
  {
    "camp": 10,
    "state": 1,
    "icon": "IconAsgardOn",
    "unlockCost": [
      2850,
      45000
    ]
  },
  {
    "camp": 14,
    "state": 0,
    "icon": "IconOlympusOn",
    "unlockCost": [
      3800,
      50000
    ]
  },
  {
    "camp": 11,
    "state": 0,
    "icon": "IconFantasyOn",
    "unlockCost": [
      4750,
      50000
    ]
  },
  {
    "camp": 12,
    "state": 0,
    "icon": "IconAvalonOn",
    "unlockCost": [
      5700,
      50000
    ]
  },
  {
    "camp": 30,
    "state": 0,
    "icon": "IconIndiaOn",
    "unlockCost": [
      6650,
      50000
    ]
  },
  {
    "camp": 17,
    "state": 0,
    "icon": "IconStarsOn",
    "unlockCost": [
      7600,
      50000
    ]
  },
  {
    "camp": 29,
    "state": 0,
    "icon": "IconLunarOn",
    "unlockCost": [
      8550,
      50000
    ]
  },
  {
    "camp": 26,
    "state": 0,
    "icon": "IconLunarOn",
    "unlockCost": [
      8550,
      50000
    ]
  },
  {
    "camp": 99,
    "state": 0,
    "icon": "IconLunarOn",
    "unlockCost": [
      8550,
      50000
    ]
  }
];

const DETAILS = [
  {
    "camp": 13,
    "slots": [
      {
        "slot": 1,
        "unlockCost": [
          0,
          0
        ]
      },
      {
        "slot": 2,
        "unlockCost": [
          0,
          0
        ]
      },
      {
        "slot": 3,
        "unlockCost": [
          0,
          0
        ]
      },
      {
        "slot": 4,
        "unlockCost": [
          470,
          10000
        ]
      },
      {
        "slot": 5,
        "unlockCost": [
          620,
          15000
        ]
      },
      {
        "slot": 6,
        "unlockCost": [
          790,
          20000
        ]
      },
      {
        "slot": 7,
        "unlockCost": [
          940,
          25000
        ]
      },
      {
        "slot": 8,
        "unlockCost": [
          1110,
          30000
        ]
      },
      {
        "slot": 9,
        "unlockCost": [
          1260,
          35000
        ]
      },
      {
        "slot": 10,
        "unlockCost": [
          1430,
          40000
        ]
      },
      {
        "slot": 11,
        "unlockCost": [
          1580,
          45000
        ]
      },
      {
        "slot": 12,
        "unlockCost": [
          1750,
          50000
        ]
      }
    ],
    "grades": [
      {
        "buff": 1,
        "fame": 80,
        "level": 1
      },
      {
        "buff": 8,
        "fame": 160,
        "level": 2
      },
      {
        "buff": 3,
        "fame": 240,
        "level": 3
      },
      {
        "buff": 6,
        "fame": 320,
        "level": 4
      },
      {
        "buff": 1,
        "fame": 400,
        "level": 5
      },
      {
        "buff": 5,
        "fame": 480,
        "level": 6
      },
      {
        "buff": 3,
        "fame": 560,
        "level": 7
      },
      {
        "buff": 14,
        "fame": 640,
        "level": 8
      },
      {
        "buff": 1,
        "fame": 720,
        "level": 9
      },
      {
        "buff": 8,
        "fame": 800,
        "level": 10
      },
      {
        "buff": 3,
        "fame": 880,
        "level": 11
      },
      {
        "buff": 10,
        "fame": 960,
        "level": 12
      },
      {
        "buff": 1,
        "fame": 1040,
        "level": 13
      },
      {
        "buff": 5,
        "fame": 1120,
        "level": 14
      },
      {
        "buff": 3,
        "fame": 1200,
        "level": 15
      },
      {
        "buff": 6,
        "fame": 1280,
        "level": 16
      },
      {
        "buff": 1,
        "fame": 1360,
        "level": 17
      },
      {
        "buff": 12,
        "fame": 1440,
        "level": 18
      },
      {
        "buff": 3,
        "fame": 1520,
        "level": 19
      },
      {
        "buff": 10,
        "fame": 1600,
        "level": 20
      },
      {
        "buff": 1,
        "fame": 1680,
        "level": 21
      },
      {
        "buff": 8,
        "fame": 1760,
        "level": 22
      },
      {
        "buff": 3,
        "fame": 1840,
        "level": 23
      },
      {
        "buff": 6,
        "fame": 1920,
        "level": 24
      },
      {
        "buff": 1,
        "fame": 2000,
        "level": 25
      },
      {
        "buff": 5,
        "fame": 2080,
        "level": 26
      },
      {
        "buff": 3,
        "fame": 2160,
        "level": 27
      },
      {
        "buff": 14,
        "fame": 2240,
        "level": 28
      },
      {
        "buff": 1,
        "fame": 2320,
        "level": 29
      },
      {
        "buff": 8,
        "fame": 2400,
        "level": 30
      },
      {
        "buff": 3,
        "fame": 2480,
        "level": 31
      },
      {
        "buff": 10,
        "fame": 2560,
        "level": 32
      },
      {
        "buff": 1,
        "fame": 2640,
        "level": 33
      },
      {
        "buff": 5,
        "fame": 2720,
        "level": 34
      },
      {
        "buff": 3,
        "fame": 2800,
        "level": 35
      },
      {
        "buff": 6,
        "fame": 2880,
        "level": 36
      },
      {
        "buff": 1,
        "fame": 2960,
        "level": 37
      },
      {
        "buff": 12,
        "fame": 3040,
        "level": 38
      },
      {
        "buff": 3,
        "fame": 3120,
        "level": 39
      },
      {
        "buff": 10,
        "fame": 3200,
        "level": 40
      }
    ]
  },
  {
    "camp": 16,
    "slots": [
      {
        "slot": 1,
        "unlockCost": [
          0,
          0
        ]
      },
      {
        "slot": 2,
        "unlockCost": [
          0,
          0
        ]
      },
      {
        "slot": 3,
        "unlockCost": [
          0,
          0
        ]
      },
      {
        "slot": 4,
        "unlockCost": [
          470,
          10000
        ]
      },
      {
        "slot": 5,
        "unlockCost": [
          620,
          15000
        ]
      },
      {
        "slot": 6,
        "unlockCost": [
          790,
          20000
        ]
      },
      {
        "slot": 7,
        "unlockCost": [
          940,
          25000
        ]
      },
      {
        "slot": 8,
        "unlockCost": [
          1110,
          30000
        ]
      },
      {
        "slot": 9,
        "unlockCost": [
          1260,
          35000
        ]
      },
      {
        "slot": 10,
        "unlockCost": [
          1430,
          40000
        ]
      },
      {
        "slot": 11,
        "unlockCost": [
          1580,
          45000
        ]
      },
      {
        "slot": 12,
        "unlockCost": [
          1750,
          50000
        ]
      }
    ],
    "grades": [
      {
        "buff": 2,
        "fame": 80,
        "level": 1
      },
      {
        "buff": 9,
        "fame": 160,
        "level": 2
      },
      {
        "buff": 4,
        "fame": 240,
        "level": 3
      },
      {
        "buff": 7,
        "fame": 320,
        "level": 4
      },
      {
        "buff": 2,
        "fame": 400,
        "level": 5
      },
      {
        "buff": 5,
        "fame": 480,
        "level": 6
      },
      {
        "buff": 4,
        "fame": 560,
        "level": 7
      },
      {
        "buff": 15,
        "fame": 640,
        "level": 8
      },
      {
        "buff": 2,
        "fame": 720,
        "level": 9
      },
      {
        "buff": 9,
        "fame": 800,
        "level": 10
      },
      {
        "buff": 4,
        "fame": 880,
        "level": 11
      },
      {
        "buff": 11,
        "fame": 960,
        "level": 12
      },
      {
        "buff": 2,
        "fame": 1040,
        "level": 13
      },
      {
        "buff": 5,
        "fame": 1120,
        "level": 14
      },
      {
        "buff": 4,
        "fame": 1200,
        "level": 15
      },
      {
        "buff": 7,
        "fame": 1280,
        "level": 16
      },
      {
        "buff": 2,
        "fame": 1360,
        "level": 17
      },
      {
        "buff": 13,
        "fame": 1440,
        "level": 18
      },
      {
        "buff": 4,
        "fame": 1520,
        "level": 19
      },
      {
        "buff": 11,
        "fame": 1600,
        "level": 20
      },
      {
        "buff": 2,
        "fame": 1680,
        "level": 21
      },
      {
        "buff": 9,
        "fame": 1760,
        "level": 22
      },
      {
        "buff": 4,
        "fame": 1840,
        "level": 23
      },
      {
        "buff": 7,
        "fame": 1920,
        "level": 24
      },
      {
        "buff": 2,
        "fame": 2000,
        "level": 25
      },
      {
        "buff": 5,
        "fame": 2080,
        "level": 26
      },
      {
        "buff": 4,
        "fame": 2160,
        "level": 27
      },
      {
        "buff": 15,
        "fame": 2240,
        "level": 28
      },
      {
        "buff": 2,
        "fame": 2320,
        "level": 29
      },
      {
        "buff": 9,
        "fame": 2400,
        "level": 30
      },
      {
        "buff": 4,
        "fame": 2480,
        "level": 31
      },
      {
        "buff": 11,
        "fame": 2560,
        "level": 32
      },
      {
        "buff": 2,
        "fame": 2640,
        "level": 33
      },
      {
        "buff": 5,
        "fame": 2720,
        "level": 34
      },
      {
        "buff": 4,
        "fame": 2800,
        "level": 35
      },
      {
        "buff": 7,
        "fame": 2880,
        "level": 36
      },
      {
        "buff": 2,
        "fame": 2960,
        "level": 37
      },
      {
        "buff": 13,
        "fame": 3040,
        "level": 38
      },
      {
        "buff": 4,
        "fame": 3120,
        "level": 39
      },
      {
        "buff": 11,
        "fame": 3200,
        "level": 40
      }
    ]
  },
  {
    "camp": 15,
    "slots": [
      {
        "slot": 1,
        "unlockCost": [
          0,
          0
        ]
      },
      {
        "slot": 2,
        "unlockCost": [
          0,
          0
        ]
      },
      {
        "slot": 3,
        "unlockCost": [
          0,
          0
        ]
      },
      {
        "slot": 4,
        "unlockCost": [
          470,
          10000
        ]
      },
      {
        "slot": 5,
        "unlockCost": [
          620,
          15000
        ]
      },
      {
        "slot": 6,
        "unlockCost": [
          790,
          20000
        ]
      },
      {
        "slot": 7,
        "unlockCost": [
          940,
          25000
        ]
      },
      {
        "slot": 8,
        "unlockCost": [
          1110,
          30000
        ]
      },
      {
        "slot": 9,
        "unlockCost": [
          1260,
          35000
        ]
      },
      {
        "slot": 10,
        "unlockCost": [
          1430,
          40000
        ]
      },
      {
        "slot": 11,
        "unlockCost": [
          1580,
          45000
        ]
      },
      {
        "slot": 12,
        "unlockCost": [
          1750,
          50000
        ]
      }
    ],
    "grades": [
      {
        "buff": 1,
        "fame": 80,
        "level": 1
      },
      {
        "buff": 8,
        "fame": 160,
        "level": 2
      },
      {
        "buff": 3,
        "fame": 240,
        "level": 3
      },
      {
        "buff": 6,
        "fame": 320,
        "level": 4
      },
      {
        "buff": 1,
        "fame": 400,
        "level": 5
      },
      {
        "buff": 5,
        "fame": 480,
        "level": 6
      },
      {
        "buff": 3,
        "fame": 560,
        "level": 7
      },
      {
        "buff": 14,
        "fame": 640,
        "level": 8
      },
      {
        "buff": 1,
        "fame": 720,
        "level": 9
      },
      {
        "buff": 8,
        "fame": 800,
        "level": 10
      },
      {
        "buff": 3,
        "fame": 880,
        "level": 11
      },
      {
        "buff": 10,
        "fame": 960,
        "level": 12
      },
      {
        "buff": 1,
        "fame": 1040,
        "level": 13
      },
      {
        "buff": 5,
        "fame": 1120,
        "level": 14
      },
      {
        "buff": 3,
        "fame": 1200,
        "level": 15
      },
      {
        "buff": 6,
        "fame": 1280,
        "level": 16
      },
      {
        "buff": 1,
        "fame": 1360,
        "level": 17
      },
      {
        "buff": 12,
        "fame": 1440,
        "level": 18
      },
      {
        "buff": 3,
        "fame": 1520,
        "level": 19
      },
      {
        "buff": 10,
        "fame": 1600,
        "level": 20
      },
      {
        "buff": 1,
        "fame": 1680,
        "level": 21
      },
      {
        "buff": 8,
        "fame": 1760,
        "level": 22
      },
      {
        "buff": 3,
        "fame": 1840,
        "level": 23
      },
      {
        "buff": 6,
        "fame": 1920,
        "level": 24
      },
      {
        "buff": 1,
        "fame": 2000,
        "level": 25
      },
      {
        "buff": 5,
        "fame": 2080,
        "level": 26
      },
      {
        "buff": 3,
        "fame": 2160,
        "level": 27
      },
      {
        "buff": 14,
        "fame": 2240,
        "level": 28
      },
      {
        "buff": 1,
        "fame": 2320,
        "level": 29
      },
      {
        "buff": 8,
        "fame": 2400,
        "level": 30
      },
      {
        "buff": 3,
        "fame": 2480,
        "level": 31
      },
      {
        "buff": 10,
        "fame": 2560,
        "level": 32
      },
      {
        "buff": 1,
        "fame": 2640,
        "level": 33
      },
      {
        "buff": 5,
        "fame": 2720,
        "level": 34
      },
      {
        "buff": 3,
        "fame": 2800,
        "level": 35
      },
      {
        "buff": 6,
        "fame": 2880,
        "level": 36
      },
      {
        "buff": 1,
        "fame": 2960,
        "level": 37
      },
      {
        "buff": 12,
        "fame": 3040,
        "level": 38
      },
      {
        "buff": 3,
        "fame": 3120,
        "level": 39
      },
      {
        "buff": 10,
        "fame": 3200,
        "level": 40
      }
    ]
  },
  {
    "camp": 10,
    "slots": [
      {
        "slot": 1,
        "unlockCost": [
          0,
          0
        ]
      },
      {
        "slot": 2,
        "unlockCost": [
          0,
          0
        ]
      },
      {
        "slot": 3,
        "unlockCost": [
          0,
          0
        ]
      },
      {
        "slot": 4,
        "unlockCost": [
          470,
          10000
        ]
      },
      {
        "slot": 5,
        "unlockCost": [
          620,
          15000
        ]
      },
      {
        "slot": 6,
        "unlockCost": [
          790,
          20000
        ]
      },
      {
        "slot": 7,
        "unlockCost": [
          940,
          25000
        ]
      },
      {
        "slot": 8,
        "unlockCost": [
          1110,
          30000
        ]
      },
      {
        "slot": 9,
        "unlockCost": [
          1260,
          35000
        ]
      },
      {
        "slot": 10,
        "unlockCost": [
          1430,
          40000
        ]
      },
      {
        "slot": 11,
        "unlockCost": [
          1580,
          45000
        ]
      },
      {
        "slot": 12,
        "unlockCost": [
          1750,
          50000
        ]
      }
    ],
    "grades": [
      {
        "buff": 2,
        "fame": 80,
        "level": 1
      },
      {
        "buff": 9,
        "fame": 160,
        "level": 2
      },
      {
        "buff": 4,
        "fame": 240,
        "level": 3
      },
      {
        "buff": 7,
        "fame": 320,
        "level": 4
      },
      {
        "buff": 2,
        "fame": 400,
        "level": 5
      },
      {
        "buff": 5,
        "fame": 480,
        "level": 6
      },
      {
        "buff": 4,
        "fame": 560,
        "level": 7
      },
      {
        "buff": 15,
        "fame": 640,
        "level": 8
      },
      {
        "buff": 2,
        "fame": 720,
        "level": 9
      },
      {
        "buff": 9,
        "fame": 800,
        "level": 10
      },
      {
        "buff": 4,
        "fame": 880,
        "level": 11
      },
      {
        "buff": 11,
        "fame": 960,
        "level": 12
      },
      {
        "buff": 2,
        "fame": 1040,
        "level": 13
      },
      {
        "buff": 5,
        "fame": 1120,
        "level": 14
      },
      {
        "buff": 4,
        "fame": 1200,
        "level": 15
      },
      {
        "buff": 7,
        "fame": 1280,
        "level": 16
      },
      {
        "buff": 2,
        "fame": 1360,
        "level": 17
      },
      {
        "buff": 13,
        "fame": 1440,
        "level": 18
      },
      {
        "buff": 4,
        "fame": 1520,
        "level": 19
      },
      {
        "buff": 11,
        "fame": 1600,
        "level": 20
      },
      {
        "buff": 2,
        "fame": 1680,
        "level": 21
      },
      {
        "buff": 9,
        "fame": 1760,
        "level": 22
      },
      {
        "buff": 4,
        "fame": 1840,
        "level": 23
      },
      {
        "buff": 7,
        "fame": 1920,
        "level": 24
      },
      {
        "buff": 2,
        "fame": 2000,
        "level": 25
      },
      {
        "buff": 5,
        "fame": 2080,
        "level": 26
      },
      {
        "buff": 4,
        "fame": 2160,
        "level": 27
      },
      {
        "buff": 15,
        "fame": 2240,
        "level": 28
      },
      {
        "buff": 2,
        "fame": 2320,
        "level": 29
      },
      {
        "buff": 9,
        "fame": 2400,
        "level": 30
      },
      {
        "buff": 4,
        "fame": 2480,
        "level": 31
      },
      {
        "buff": 11,
        "fame": 2560,
        "level": 32
      },
      {
        "buff": 2,
        "fame": 2640,
        "level": 33
      },
      {
        "buff": 5,
        "fame": 2720,
        "level": 34
      },
      {
        "buff": 4,
        "fame": 2800,
        "level": 35
      },
      {
        "buff": 7,
        "fame": 2880,
        "level": 36
      },
      {
        "buff": 2,
        "fame": 2960,
        "level": 37
      },
      {
        "buff": 13,
        "fame": 3040,
        "level": 38
      },
      {
        "buff": 4,
        "fame": 3120,
        "level": 39
      },
      {
        "buff": 11,
        "fame": 3200,
        "level": 40
      }
    ]
  },
  {
    "camp": 14,
    "slots": [
      {
        "slot": 1,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 2,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 3,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 4,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 5,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 6,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 7,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 8,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 9,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 10,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 11,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 12,
        "unlockCost": [
          -1,
          -1
        ]
      }
    ],
    "grades": [
      {
        "buff": 1,
        "fame": 0,
        "level": 1
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 2
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 3
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 4
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 5
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 6
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 7
      },
      {
        "buff": 1,
        "fame": 0,
        "level": 8
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 9
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 10
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 11
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 12
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 13
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 14
      }
    ]
  },
  {
    "camp": 11,
    "slots": [
      {
        "slot": 1,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 2,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 3,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 4,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 5,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 6,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 7,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 8,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 9,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 10,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 11,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 12,
        "unlockCost": [
          -1,
          -1
        ]
      }
    ],
    "grades": [
      {
        "buff": 1,
        "fame": 0,
        "level": 1
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 2
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 3
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 4
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 5
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 6
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 7
      },
      {
        "buff": 1,
        "fame": 0,
        "level": 8
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 9
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 10
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 11
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 12
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 13
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 14
      }
    ]
  },
  {
    "camp": 12,
    "slots": [
      {
        "slot": 1,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 2,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 3,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 4,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 5,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 6,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 7,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 8,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 9,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 10,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 11,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 12,
        "unlockCost": [
          -1,
          -1
        ]
      }
    ],
    "grades": [
      {
        "buff": 1,
        "fame": 0,
        "level": 1
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 2
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 3
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 4
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 5
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 6
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 7
      },
      {
        "buff": 1,
        "fame": 0,
        "level": 8
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 9
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 10
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 11
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 12
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 13
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 14
      }
    ]
  },
  {
    "camp": 30,
    "slots": [
      {
        "slot": 1,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 2,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 3,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 4,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 5,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 6,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 7,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 8,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 9,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 10,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 11,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 12,
        "unlockCost": [
          -1,
          -1
        ]
      }
    ],
    "grades": [
      {
        "buff": 1,
        "fame": 0,
        "level": 1
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 2
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 3
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 4
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 5
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 6
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 7
      },
      {
        "buff": 1,
        "fame": 0,
        "level": 8
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 9
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 10
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 11
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 12
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 13
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 14
      }
    ]
  },
  {
    "camp": 17,
    "slots": [
      {
        "slot": 1,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 2,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 3,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 4,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 5,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 6,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 7,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 8,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 9,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 10,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 11,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 12,
        "unlockCost": [
          -1,
          -1
        ]
      }
    ],
    "grades": [
      {
        "buff": 1,
        "fame": 0,
        "level": 1
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 2
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 3
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 4
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 5
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 6
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 7
      },
      {
        "buff": 1,
        "fame": 0,
        "level": 8
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 9
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 10
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 11
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 12
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 13
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 14
      }
    ]
  },
  {
    "camp": 29,
    "slots": [
      {
        "slot": 1,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 2,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 3,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 4,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 5,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 6,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 7,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 8,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 9,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 10,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 11,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 12,
        "unlockCost": [
          -1,
          -1
        ]
      }
    ],
    "grades": [
      {
        "buff": 1,
        "fame": 0,
        "level": 1
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 2
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 3
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 4
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 5
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 6
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 7
      },
      {
        "buff": 1,
        "fame": 0,
        "level": 8
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 9
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 10
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 11
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 12
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 13
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 14
      }
    ]
  },
  {
    "camp": 26,
    "slots": [
      {
        "slot": 1,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 2,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 3,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 4,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 5,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 6,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 7,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 8,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 9,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 10,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 11,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 12,
        "unlockCost": [
          -1,
          -1
        ]
      }
    ],
    "grades": [
      {
        "buff": 1,
        "fame": 0,
        "level": 1
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 2
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 3
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 4
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 5
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 6
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 7
      },
      {
        "buff": 1,
        "fame": 0,
        "level": 8
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 9
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 10
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 11
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 12
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 13
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 14
      }
    ]
  },
  {
    "camp": 99,
    "slots": [
      {
        "slot": 1,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 2,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 3,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 4,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 5,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 6,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 7,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 8,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 9,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 10,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 11,
        "unlockCost": [
          -1,
          -1
        ]
      },
      {
        "slot": 12,
        "unlockCost": [
          -1,
          -1
        ]
      }
    ],
    "grades": [
      {
        "buff": 1,
        "fame": 0,
        "level": 1
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 2
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 3
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 4
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 5
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 6
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 7
      },
      {
        "buff": 1,
        "fame": 0,
        "level": 8
      },
      {
        "buff": 2,
        "fame": 10,
        "level": 9
      },
      {
        "buff": 3,
        "fame": 600,
        "level": 10
      },
      {
        "buff": 1,
        "fame": 700,
        "level": 11
      },
      {
        "buff": 1,
        "fame": 800,
        "level": 12
      },
      {
        "buff": 1,
        "fame": 900,
        "level": 13
      },
      {
        "buff": 1,
        "fame": 1000,
        "level": 14
      }
    ]
  }
];

const BUFFS = {
  "1": {
    "id": 1,
    "val": 1,
    "name": "物攻",
    "unit": "+{0}%",
    "calc": 1
  },
  "2": {
    "id": 2,
    "val": 1,
    "name": "魔攻",
    "unit": "+{0}%",
    "calc": 1
  },
  "3": {
    "id": 3,
    "val": 1,
    "name": "物防",
    "unit": "+{0}%",
    "calc": 1
  },
  "4": {
    "id": 4,
    "val": 1,
    "name": "魔防",
    "unit": "+{0}%",
    "calc": 1
  },
  "5": {
    "id": 5,
    "val": 1,
    "name": "速度",
    "unit": "+{0}%",
    "calc": 1
  },
  "6": {
    "id": 6,
    "val": 0.5,
    "name": "伤害",
    "unit": "+{0}%",
    "calc": 2
  },
  "7": {
    "id": 7,
    "val": 0.5,
    "name": "减伤",
    "unit": "+{0}%",
    "calc": 2
  },
  "8": {
    "id": 8,
    "val": 100,
    "name": "体力上限",
    "unit": "+{0}",
    "calc": 2
  },
  "9": {
    "id": 9,
    "val": 100,
    "name": "金币上限",
    "unit": "+{0}",
    "calc": 2
  },
  "10": {
    "id": 10,
    "val": 1,
    "name": "获得经验",
    "unit": "+{0}%",
    "calc": 1
  },
  "11": {
    "id": 11,
    "val": 1,
    "name": "获得金币",
    "unit": "+{0}%",
    "calc": 1
  },
  "12": {
    "id": 12,
    "val": 1,
    "name": "材料背包容量",
    "unit": "+{0}",
    "calc": 2
  },
  "13": {
    "id": 13,
    "val": 1,
    "name": "圣器背包容量",
    "unit": "+{0}",
    "calc": 2
  },
  "14": {
    "id": 14,
    "val": 1,
    "name": "核心背包容量",
    "unit": "+{0}",
    "calc": 2
  },
  "15": {
    "id": 15,
    "val": 1,
    "name": "精灵背包容量",
    "unit": "+{0}",
    "calc": 2
  }
};

const ENTRY_BY_CAMP = Object.fromEntries(ENTRIES.map(e => [e.camp, e]));
const DETAIL_BY_CAMP = Object.fromEntries(DETAILS.map(d => [d.camp, d]));

// 阵营归属（ServantAltarConst.getCampID）：typeId 从右第 6~7 位，不在阵营表 → 99 联动
const CAMP_IDS = new Set(ENTRIES.filter(e => e.state === 1 || e.state === 0).map(e => e.camp));
function campOf(typeId) {
  const c = Math.floor(Number(typeId) / 100000) % 100;
  return CAMP_IDS.has(c) && c !== 99 ? c : 99;
}

// ---- 名气（本地服公式）：拥有即有基础分，培养面（等级/星级/突破/技能/能源/装备）线性叠加 ----
const FAME_WEIGHTS = { own: 10, level: 1, star: 25, overstep: 30, skill: 5, energy: 1, relic: 10, core: 3 };
function fameOfServant(b) {
  const w = FAME_WEIGHTS;
  const star = Number(b.star) || 2;
  const energy = Object.values(b.energy_points || {}).reduce((a, c) => a + Number(c || 0), 0);
  const cores = Object.values(b.cores || {}).filter(g => Number(g) > 0).length;
  return w.own
    + (Number(b.level) || 1) * w.level
    + Math.max(0, star - 2) * w.star
    + (Number(b.overstep) || 0) * w.overstep
    + ((b.learned_skills || []).length) * w.skill
    + energy * w.energy
    + (Number(b.relic_gid) > 0 ? w.relic : 0)
    + cores * w.core;
}

// 全阵营名气表（客户端 fameDic 语义：每类型取名气最高的实例，p_kvt.type=该实例 id）
function fameList(servants) {
  const best = {};
  for (const b of servants || []) {
    const f = fameOfServant(b);
    if (!best[b.type] || f > best[b.type].val) best[b.type] = { val: f, sid: b.id };
  }
  return Object.entries(best).map(([type, v]) => ({ id: Number(type), val: v.val, type: v.sid }));
}

// 各阵营基础名气 = Σ ceil(该阵营全部类型名气 × 0.2)（BASE_FAME_ATTRIBUTE，含未解锁阵营）
function campBaseTotals(fameLs) {
  const base = {};
  for (const camp of Object.keys(DETAIL_BY_CAMP)) base[camp] = 0;
  for (const f of fameLs || []) {
    const camp = campOf(f.id);
    base[camp] = (base[camp] || 0) + Math.ceil(f.val * 0.2);
  }
  return base;
}

// 供奉位名气：本阵营誓灵全额，跨阵营 ×0.6（EXTRA_FAME_ATTRIBUTE_IN_OTHER_CAMP）
function slotFameOf(fameByType, enshrined, camp) {
  let sum = 0;
  for (const [type, at] of Object.entries(enshrined || {})) {
    if (at.camp !== camp) continue;
    const f = fameByType[Number(type)] || 0;
    sum += campOf(Number(type)) === camp ? f : Math.ceil(f * 0.6);
  }
  return sum;
}

// 阵营总名气（客户端 DetailVO.updateFame 口径：供奉位 + 基础；未解锁阵营只算基础）
function campTotals(fameLs, enshrined, unlockedCamps) {
  const base = campBaseTotals(fameLs);
  const fameByType = Object.fromEntries((fameLs || []).map(f => [f.id, f.val]));
  const unlocked = new Set(unlockedCamps || []);
  const totals = {};
  for (const camp of Object.keys(DETAIL_BY_CAMP)) {
    totals[camp] = base[camp] || 0;
    if (unlocked.has(Number(camp))) totals[camp] += slotFameOf(fameByType, enshrined, Number(camp));
  }
  return totals;
}

// 全阵营总名气（EntryVO.getUnlockDesc 的"全阵营总名气"：Σ 全部 DetailVO.totalFame，含未解锁阵营）
function totalFameAll(totals) {
  return Object.values(totals || {}).reduce((a, c) => a + c, 0);
}

// 名气等级（DetailVO.getGrade：totalFame < gradeFame[i].fame → i-1；全过 → 档数）
function gradeOf(camp, totalFame) {
  const d = DETAIL_BY_CAMP[camp];
  if (!d) return 0;
  for (let i = 0; i < d.grades.length; i++) {
    if (totalFame < d.grades[i].fame) return i;
  }
  return d.grades.length;
}

// buff 聚合：已解锁阵营按名气等级激活前 N 档，每档给 buffDic[buffID].val；
// 返回 { statMul: {属性码2-6: 倍率}, dmg: 伤害加成分数, mit: 减伤分数 }
function buffTotals(fameLs, enshrined, unlockedCamps) {
  const totals = campTotals(fameLs, enshrined, unlockedCamps);
  const sum = {};
  for (const camp of unlockedCamps || []) {
    const d = DETAIL_BY_CAMP[camp];
    if (!d) continue;
    const grade = gradeOf(camp, totals[camp] || 0);
    for (let i = 0; i < grade; i++) {
      const g = d.grades[i];
      sum[g.buff] = (sum[g.buff] || 0) + (BUFFS[g.buff] ? BUFFS[g.buff].val : 0);
    }
  }
  // proIDToBuffIDDic：属性码 2-6 → buff 1-5（百分比，×(100+val)/100）；26/27 → 伤害/减伤
  const statMul = { 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 };
  for (let code = 2; code <= 6; code++) statMul[code] = (100 + (sum[code - 1] || 0)) / 100;
  return { statMul, dmg: (sum[6] || 0) / 100, mit: (sum[7] || 0) / 100, raw: sum };
}

module.exports = {
  ENTRIES, DETAILS, BUFFS, ENTRY_BY_CAMP, DETAIL_BY_CAMP,
  campOf, fameOfServant, fameList, campBaseTotals, campTotals, totalFameAll, gradeOf, buffTotals, FAME_WEIGHTS,
};
