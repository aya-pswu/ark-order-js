ConfigMgr.initConfig("CfgSummon", {
	defealtMaxSummon = 50000,
	summonBgReplaceBg = {
		[88] = {
			actID = 1640,
			theaterID = 164000701,
			originBgName = "88",
			replaceBgName = "88_00"
		},
		[89] = {
			actID = 1640,
			theaterID = 164000501,
			originBgName = "89",
			replaceBgName = "89_00"
		}
	},
	summons = {
		{
			name = "凭神召唤",
			bg = "01",
			hasItem = false,
			tip = [[
凭神召唤概率分布：
<color=#FFD700ff>UR级誓灵</color>  5%
<color=#F584FF>SR级誓灵</color>  15%
<color=#4169E1ff>R级誓灵</color>  80%]],
			typeId = 1,
			resultTitle = "Sendfor01",
			effect = "",
			isShowState = true,
			tipWidth = 350,
			showLuckyTip = true,
			itemBg = "01Item",
			order = 301,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "50%",
					title = "R级誓灵",
					servants = {}
				},
				{
					icon = "NMini",
					iconScale = 0.6,
					rate = "30%",
					title = "N级誓灵",
					servants = {}
				}
			}
		},
		{
			hasItem = true,
			name = "友情召唤",
			bg = "02",
			effect = "",
			typeId = 2,
			resultTitle = "Sendfor02",
			isShowState = true,
			tipWidth = 350,
			itemBg = "02Item",
			order = 302,
			cost = {
				{
					sliver = 10,
					type = 2,
					id = 2,
					num = 100,
					isShow = true
				}
			},
			tips = {
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "8%",
					title = "R级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "10%",
					title = "蓝色材料",
					servants = {}
				},
				{
					icon = "NMini",
					iconScale = 0.6,
					rate = "40%",
					title = "N级誓灵",
					servants = {}
				},
				{
					icon = "NMini",
					iconScale = 0.6,
					rate = "42%",
					title = "绿色材料",
					servants = {}
				}
			}
		},
		[4] = {
			name = "新手卡池",
			bg = "04",
			hasItem = false,
			tip = [[
凭神召唤概率分布：
<color=#FFD700ff>UR级誓灵</color>  5%
<color=#F584FF>SR级誓灵</color>  15%
<color=#4169E1ff>R级誓灵</color>  80%]],
			typeId = 4,
			resultTitle = "Sendfor01",
			effect = "",
			maxSummon = 20,
			tipWidth = 350,
			showLuckyTip = true,
			itemBg = "04Item",
			order = 300,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1442021,
				1341020,
				1046015,
				1444023,
				1043020
			},
			specialJapaneseList = {
				1443001,
				1544001,
				1442021,
				1341020,
				1046015
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[10] = {
			hasItem = false,
			name = "迅雷霁月限定召唤",
			timeBgColor = "980019",
			bg = "10",
			tip = [[
【迅雷霁月】限定召唤概率分布：
<color=#FFD700ff>月读</color>　2.5%　　<color=#FFD700ff>其他UR级誓灵</color>　2.5%
       <color=#F584FF> 建御雷</color>　5%　　<color=#F584FF>其他SR级誓灵</color>　  10%        
<color=#6189FFff>R级誓灵</color>  80%]],
			isShowState = true,
			showLuckyTip = true,
			itemBg = "10Item",
			order = 250,
			effect = "",
			typeId = 10,
			resultTitle = "Sendfor010",
			tipWidth = 500,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1346016,
				1333017
			},
			timePos = Vector2(-33, -298),
			timeAngle = Vector3(0, 0, 6),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[11] = {
			hasItem = false,
			name = "限定召唤",
			timeBgColor = "410000",
			bg = "11",
			tip = "",
			showLuckyTip = true,
			itemBg = "11Item",
			order = 250,
			effect = "",
			typeId = 11,
			resultTitle = "Sendfor01",
			tipWidth = 500,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1442021,
				1245005
			},
			timePos = Vector2(-9, -197),
			timeAngle = Vector3(0, 0, 12),
			tips = {
				{
					title = "<img src=Common.AttributeLightMini scale=1 size=24 click=  />努阿达和<img src=Common.AttributeFireMini scale=1 size=24 click=  />赫斯提亚将在活动结束一段时间后加入凭神召唤",
					icon = "",
					iconScale = 0.4,
					servants = {}
				},
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[12] = {
			name = "灵契召唤",
			bg = "12",
			hasItem = false,
			tip = "",
			typeId = 12,
			resultTitle = "Sendfor01",
			effect = "",
			tipWidth = 500,
			showLuckyTip = true,
			itemBg = "12Item",
			order = 250,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			tips = {
				{
					title = "<img src=Common.AttributeLightMini scale=1 size=24 click=  />灵契A和<img src=Common.AttributeFireMini scale=1 size=24 click=  />灵契B通过高难本获得",
					icon = "",
					iconScale = 0.4,
					servants = {}
				},
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[13] = {
			hasItem = false,
			name = "沧海戋鸣限定召唤",
			timeBgColor = "592a54",
			bg = "13",
			tip = "",
			isShowState = true,
			showLuckyTip = true,
			itemBg = "13Item",
			order = 250,
			effect = "",
			typeId = 13,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1341020
			},
			timePos = Vector2(-21, -239),
			tips = {
				{
					title = "　　　<img src=Common.AttributeWaterMini scale=1 size=24 click=  />须佐将在活动结束一段时间后加入凭神召唤",
					icon = "",
					iconScale = 0.4,
					servants = {}
				},
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[14] = {
			hasItem = false,
			name = "日轮之径限定召唤",
			timeBgColor = "270303",
			bg = "14",
			tip = "",
			isShowState = true,
			showLuckyTip = true,
			itemBg = "14Item",
			order = 250,
			effect = "",
			typeId = 14,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1645001,
				1643004
			},
			timePos = Vector2(-33, -211),
			timeAngle = Vector3(0, 0, 9),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[15] = {
			hasItem = false,
			name = "永生殿堂限定召唤",
			tip = "",
			timeBgColor = "3f0349",
			bg = "15",
			isShowState = true,
			showLuckyTip = true,
			itemBg = "15Item",
			order = 250,
			effect = "",
			typeId = 15,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1646002
			},
			specialTraditionalList = {
				1646002,
				1634012
			},
			timePos = Vector2(-33, -230),
			timeAngle = Vector3(0, 0, 9),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[16] = {
			hasItem = false,
			name = "夜契残翼限定召唤",
			timeBgColor = "322443",
			bg = "16",
			tip = "",
			isShowState = true,
			showLuckyTip = true,
			itemBg = "16Item",
			order = 250,
			effect = "",
			typeId = 16,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1046015
			},
			timePos = Vector2(-21, -295),
			tips = {
				{
					title = "　　　<img src=Common.AttributeDarknessMini scale=1 size=24 click=  />海拉将在活动结束一段时间后加入凭神召唤",
					icon = "",
					iconScale = 0.4,
					servants = {}
				},
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[17] = {
			hasItem = false,
			name = "限定召唤",
			timeBgColor = "540c49",
			bg = "17",
			tip = "",
			isShowState = true,
			showLuckyTip = true,
			itemBg = "17Item",
			order = 250,
			effect = "",
			typeId = 17,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1242006,
				1444023
			},
			timePos = Vector2(-11, -252),
			timeAngle = Vector3(0, 0, 7),
			tips = {
				{
					title = "<img src=Common.AttributeFireMini scale=1 size=24 click=  />玛查和<img src=Common.AttributeSoilMini scale=1 size=24 click=  />德墨忒尔将在活动结束一段时间后加入凭神召唤",
					icon = "",
					iconScale = 0.4,
					servants = {}
				},
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[18] = {
			hasItem = false,
			name = "限定召唤",
			timeBgColor = "85161c",
			bg = "18",
			tip = "",
			isShowState = true,
			showLuckyTip = true,
			itemBg = "18Item",
			order = 250,
			effect = "",
			typeId = 18,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1543018,
				1541019
			},
			timePos = Vector2(-21, -239),
			timeAngle = Vector3(0, 0, 8),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[19] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/19",
			bg = "19",
			name = "洛水天依",
			minServantTypeId = 194100101,
			showLuckyTip = true,
			itemBg = "19Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 19,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1941001
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[20] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/20",
			bg = "20",
			name = "兰谦婉序",
			minServantTypeId = 194500601,
			showLuckyTip = true,
			itemBg = "20Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 20,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1945006
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[21] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/21",
			bg = "21",
			name = "蝶灼司律",
			minServantTypeId = 194200501,
			showLuckyTip = true,
			itemBg = "21Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 21,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1942005
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[22] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/22",
			bg = "22",
			name = "婉语奏曲",
			minServantTypeId = 194600301,
			showLuckyTip = true,
			itemBg = "22Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 22,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1946003
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[23] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/23",
			bg = "23",
			name = "杏赋乐辞",
			minServantTypeId = 194300401,
			showLuckyTip = true,
			itemBg = "23Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 23,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1943004
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[24] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/24",
			bg = "24",
			name = "赤曜绫音",
			minServantTypeId = 194400201,
			showLuckyTip = true,
			itemBg = "24Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 24,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1944002
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[25] = {
			hasItem = false,
			name = "潜噬蛇影",
			timeBgColor = "1f5a86",
			bg = "25",
			tip = "",
			isShowState = true,
			showLuckyTip = true,
			itemBg = "25Item",
			order = 250,
			effect = "",
			typeId = 25,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1044017
			},
			timePos = Vector2(-33, -270),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[26] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/26",
			bg = "26",
			name = "森维万象",
			timeBgColor = "16304e",
			isShowState = true,
			minServantTypeId = -1,
			showLuckyTip = true,
			itemBg = "26Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 26,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1043020
			},
			timePos = Vector2(-21, -239),
			tips = {
				{
					title = "　　　<img src=Common.AttributeWindMini scale=1 size=24 click=  />维达将在活动结束一段时间后加入凭神召唤",
					icon = "",
					iconScale = 0.4,
					servants = {}
				},
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[27] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/27",
			bg = "27",
			name = "明眸睿武",
			timeBgColor = "23547d",
			isShowState = true,
			minServantTypeId = 144102601,
			showLuckyTip = true,
			itemBg = "27Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 27,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1441026
			},
			timePos = Vector2(-33, -232),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[28] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/28",
			bg = "28",
			name = "锻火冶光",
			timeBgColor = "60232b",
			isShowState = true,
			minServantTypeId = 144202501,
			showLuckyTip = true,
			itemBg = "28Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 28,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1442025
			},
			timePos = Vector2(-33, -260),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[29] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/29",
			bg = "29",
			name = "沙暴之谕",
			timeBgColor = "940a08",
			isShowState = true,
			minServantTypeId = 164301604,
			showLuckyTip = true,
			itemBg = "29Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 29,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1643017
			},
			timePos = Vector2(-33, -236),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[30] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/30",
			bg = "30",
			name = "梦魔之魅",
			timeBgColor = "2e213b",
			minServantTypeId = 234600101,
			showLuckyTip = true,
			itemBg = "30Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 30,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2346001
			},
			timePos = Vector2(-33, -279),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[31] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/31",
			bg = "31",
			name = "绛炎绯瞳",
			timeBgColor = "711b38",
			minServantTypeId = 234200201,
			showLuckyTip = true,
			itemBg = "31Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 31,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2342002
			},
			timePos = Vector2(-33, -268),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[32] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/32",
			bg = "32",
			name = "钥之契，罪之婪",
			timeBgColor = "7e0001",
			isShowState = true,
			extraServant = 1133026,
			minServantTypeId = 114602301,
			showLuckyTip = true,
			itemBg = "32Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 32,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1146023,
				1133026
			},
			timePos = Vector2(-33, -236),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[33] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/33",
			bg = "33",
			name = "鏖杀公主",
			timeBgColor = "4b4488",
			minServantTypeId = 234400401,
			showLuckyTip = true,
			itemBg = "33Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 33,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2344004
			},
			timePos = Vector2(-33, -260),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[34] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/34",
			bg = "34",
			name = "堕光圣使",
			timeBgColor = "123a75",
			minServantTypeId = 234500301,
			showLuckyTip = true,
			itemBg = "34Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 34,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2345003
			},
			timePos = Vector2(-33, -260),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[35] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/35",
			bg = "35",
			name = "履雷覆世",
			timeBgColor = "900101",
			minServantTypeId = 154301801,
			showLuckyTip = true,
			itemBg = "35Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 35,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1543018
			},
			timePos = Vector2(-33, -236),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[36] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/36",
			bg = "36",
			name = "溟海渡苍",
			timeBgColor = "3a2975",
			minServantTypeId = 154101901,
			showLuckyTip = true,
			itemBg = "36Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 36,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1541019
			},
			timePos = Vector2(-33, -274),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[37] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/37",
			bg = "37",
			name = "艾尔奇亚的女王",
			minServantTypeId = 244500101,
			showLuckyTip = true,
			itemBg = "37Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 37,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2445001
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[38] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/38",
			bg = "38",
			name = "天翼之遗",
			minServantTypeId = 244300201,
			showLuckyTip = true,
			itemBg = "38Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 38,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2443002
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[39] = {
			name = "天耀东明",
			bg = "39",
			hasItem = false,
			tip = "",
			typeId = 39,
			resultTitle = "Sendfor010",
			effect = "",
			tipWidth = 350,
			showLuckyTip = true,
			itemBg = "39Item",
			order = 250,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2545001,
				2541002
			},
			tips = {
				{
					title = "<img src=Common.AttributeLightMini scale=1 size=24 click=  />解慕漱和<img src=Common.AttributeWaterMini scale=1 size=24 click=  />高朱蒙在当前卡池结束后加入凭神召唤",
					icon = "",
					iconScale = 0.4,
					servants = {}
				},
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[40] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/40",
			bg = "40",
			name = "理智检定",
			timeBgColor = "5d1712",
			isShowState = true,
			minServantTypeId = -1,
			showLuckyTip = true,
			itemBg = "40Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 40,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2648003
			},
			timePos = Vector2(-33, -274),
			tips = {
				{
					title = "　　　<img src=Common.AttributeVoidMini scale=1 size=24 click=  />奈亚拉托提普将在活动结束一段时间后加入凭神召唤",
					icon = "",
					iconScale = 0.4,
					servants = {}
				},
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[41] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/41",
			bg = "41",
			name = "日轮之径",
			timeBgColor = "270303",
			minServantTypeId = 164500101,
			showLuckyTip = true,
			itemBg = "41Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 41,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1645001
			},
			timePos = Vector2(-11, -208),
			timeAngle = Vector3(0, 0, 9),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[42] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/42",
			bg = "42",
			name = "日轮之径",
			timeBgColor = "270303",
			minServantTypeId = 164300401,
			showLuckyTip = true,
			itemBg = "42Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 42,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1643004
			},
			timePos = Vector2(-11, -208),
			timeAngle = Vector3(0, 0, 9),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[43] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/43",
			bg = "43",
			name = "星象馆通讯",
			minServantTypeId = 224500101,
			showLuckyTip = true,
			itemBg = "43Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 43,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2245001
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[44] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/44",
			bg = "44",
			name = "界限之夏",
			timeBgColor = "cd4400",
			minServantTypeId = 274200201,
			showLuckyTip = true,
			itemBg = "44Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 44,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2742002
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[45] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/45",
			bg = "45",
			name = "余裕突破",
			timeBgColor = "6749b2",
			minServantTypeId = 274100301,
			showLuckyTip = true,
			itemBg = "45Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 45,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2741003
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[46] = {
			name = "拥花的稚虎",
			bg = "46",
			hasItem = false,
			tip = "",
			typeId = 46,
			resultTitle = "Sendfor010",
			effect = "",
			tipWidth = 350,
			showLuckyTip = true,
			itemBg = "46Item",
			order = 250,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2845001
			},
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[47] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/47",
			bg = "47",
			name = "丰穰之耀",
			timeBgColor = "0e4f79",
			isShowState = true,
			minServantTypeId = 104502301,
			showLuckyTip = true,
			itemBg = "47Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 47,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1045023
			},
			timePos = Vector2(-33, -239),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[48] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/48",
			bg = "48",
			name = "海怒潮鸣",
			timeBgColor = "184c74",
			isShowState = true,
			minServantTypeId = 124100701,
			showLuckyTip = true,
			itemBg = "48Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 48,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1241007
			},
			timePos = Vector2(-33, -233),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[49] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/49",
			bg = "49",
			name = "百艺之光",
			timeBgColor = "551c2f",
			isShowState = true,
			minServantTypeId = 124500901,
			showLuckyTip = true,
			itemBg = "49Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 49,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1245009
			},
			timePos = Vector2(-33, -233),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[50] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/50",
			bg = "50",
			name = "空界之主",
			timeBgColor = "01608c",
			isShowState = true,
			minServantTypeId = 304300501,
			showLuckyTip = true,
			itemBg = "50Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 50,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3043005
			},
			timePos = Vector2(-33, -233),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[51] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/51",
			bg = "51",
			name = "光坂武帝",
			timeBgColor = "16797f",
			minServantTypeId = 314400201,
			showLuckyTip = true,
			itemBg = "51Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 51,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3144002
			},
			timePos = Vector2(-33, -242),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[52] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/52",
			bg = "52",
			name = "水晶之誓",
			timeBgColor = "723492",
			minServantTypeId = 314200301,
			showLuckyTip = true,
			itemBg = "52Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 52,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3142003
			},
			timePos = Vector2(-33, -242),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[53] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/53",
			bg = "53",
			name = "天后之座",
			timeBgColor = "a1427e",
			isShowState = true,
			minServantTypeId = 144603601,
			showLuckyTip = true,
			itemBg = "53Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 53,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1446036
			},
			timePos = Vector2(-33, -242),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[54] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/54",
			bg = "54",
			name = "隐雾之秘",
			timeBgColor = "a1427e",
			isShowState = true,
			minServantTypeId = 264800701,
			showLuckyTip = true,
			itemBg = "54Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 54,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2648007
			},
			timePos = Vector2(-33, -242),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[55] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/55",
			bg = "55",
			name = "黄衣之王",
			timeBgColor = "a1427e",
			isShowState = true,
			minServantTypeId = 264300801,
			showLuckyTip = true,
			itemBg = "55Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 55,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2643008
			},
			timePos = Vector2(-33, -242),
			tips = {
				{
					title = "　　　<img src=Common.AttributeVoidMini scale=1 size=24 click=  />哈斯塔将在活动结束一段时间后加入凭神召唤",
					icon = "",
					iconScale = 0.4,
					servants = {}
				},
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[56] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/56",
			bg = "56",
			name = "记录之扉",
			timeBgColor = "144F4DFF",
			minServantTypeId = 324500101,
			showLuckyTip = true,
			itemBg = "56Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 56,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3245001
			},
			timePos = Vector2(-33, -246.5),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[57] = {
			hasItem = false,
			name = "幻想打捞池",
			timeBgColor = "7e0000",
			bg = "57",
			tip = "",
			isShowState = true,
			showLuckyTip = true,
			itemBg = "57Item",
			order = 250,
			effect = "",
			typeId = 57,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1143021,
				1141028
			},
			timePos = Vector2(-33, -270),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[58] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/58",
			bg = "58",
			name = "创世之初",
			timeBgColor = "1f5a86",
			isShowState = true,
			minServantTypeId = 134402601,
			showLuckyTip = true,
			itemBg = "58Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 58,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1344026
			},
			timePos = Vector2(-33, -270),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[59] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/59",
			bg = "59",
			name = "水司密探",
			timeBgColor = "1f5a86",
			isShowState = true,
			minServantTypeId = 304100101,
			showLuckyTip = true,
			itemBg = "59Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 59,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3041001
			},
			timePos = Vector2(-33, -270),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[60] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/60",
			bg = "60",
			name = "金星之契",
			timeBgColor = "b97547",
			minServantTypeId = 144504001,
			showLuckyTip = true,
			itemBg = "60Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 60,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1445040
			},
			timePos = Vector2(-33, -270),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[61] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/61",
			bg = "61",
			name = "春祈新岁",
			timeBgColor = "9d3652",
			minServantTypeId = 154302001,
			showLuckyTip = true,
			itemBg = "61Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 61,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1543020
			},
			timePos = Vector2(-33, -235),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[62] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/62",
			bg = "62",
			name = "盈恶之眼",
			timeBgColor = "10334C",
			minServantTypeId = 124600801,
			showLuckyTip = true,
			itemBg = "62Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 62,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1246008
			},
			timePos = Vector2(-27, -225.5),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[63] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/63",
			bg = "63",
			name = "黎明之子",
			timeBgColor = "612473",
			isShowState = true,
			minServantTypeId = 114503001,
			showLuckyTip = true,
			itemBg = "63Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 63,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1145030
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[64] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/64",
			bg = "64",
			name = "八千牟迟",
			timeBgColor = "c66633",
			isShowState = true,
			minServantTypeId = 134402801,
			showLuckyTip = true,
			itemBg = "64Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 64,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1344028
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[65] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/65",
			bg = "65",
			name = "须势理毘",
			timeBgColor = "e45cbe",
			isShowState = true,
			minServantTypeId = 134202901,
			showLuckyTip = true,
			itemBg = "65Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 65,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1342029
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[66] = {
			name = "北欧复刻打捞池",
			bg = "66",
			hasItem = false,
			tip = "",
			typeId = 66,
			resultTitle = "Sendfor010",
			effect = "",
			timeBgColor = "900101",
			tipWidth = 350,
			showLuckyTip = true,
			itemBg = "66Item",
			order = 250,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1046021,
				1044022
			},
			timePos = Vector2(-33, -270),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[67] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/67",
			bg = "67",
			name = "达格达",
			timeBgColor = "850e4c",
			isShowState = true,
			minServantTypeId = 124201301,
			showLuckyTip = true,
			itemBg = "67Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 67,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1242013
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[68] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/68",
			bg = "68",
			name = "印度打捞池",
			timeBgColor = "0d3a62",
			minServantTypeId = 304500601,
			showLuckyTip = true,
			itemBg = "68Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 68,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3045006
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[69] = {
			hasItem = false,
			name = "四御之尊",
			bg = "69",
			timeBgColor = "7c102a",
			isShowState = true,
			minServantTypeId = 154402601,
			showLuckyTip = true,
			itemBg = "69Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 69,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1544026
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[70] = {
			hasItem = false,
			name = "幻金之穗",
			bg = "70",
			timeBgColor = "6b051d",
			isShowState = true,
			minServantTypeId = 104402601,
			showLuckyTip = true,
			itemBg = "70Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 70,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1044026
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[71] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/71",
			bg = "71",
			name = "春节打捞池",
			timeBgColor = "5f42a1",
			isShowState = true,
			minServantTypeId = 144603701,
			showLuckyTip = true,
			itemBg = "71Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 71,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1446037
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[72] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/71",
			bg = "72",
			name = "夜摩罗阇",
			timeBgColor = "6b3290",
			isShowState = true,
			minServantTypeId = 304601101,
			showLuckyTip = true,
			itemBg = "72Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 72,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3046011
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[73] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/73",
			bg = "73",
			name = "冰魂雪魄",
			timeBgColor = "332970",
			isShowState = true,
			minServantTypeId = 114103401,
			showLuckyTip = true,
			itemBg = "73Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 73,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1141034
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[74] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/74",
			bg = "74",
			name = "如梦似幻",
			timeBgColor = "742650",
			isShowState = true,
			minServantTypeId = 114203501,
			showLuckyTip = true,
			itemBg = "74Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 74,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1142035
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[75] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/75",
			bg = "75",
			name = "幻溺之梦",
			timeBgColor = "4245a2",
			minServantTypeId = 264101301,
			showLuckyTip = true,
			itemBg = "75Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 75,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2641013
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					title = "　　　<img src=Common.AttributeVoidMini scale=1 size=24 click=  />克塔亚特将在活动结束一段时间后加入凭神召唤",
					icon = "",
					iconScale = 0.4,
					servants = {}
				},
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[76] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/76",
			bg = "76",
			name = "清楚偶像",
			timeBgColor = "3aaacc",
			minServantTypeId = 334100101,
			showLuckyTip = true,
			itemBg = "76Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 76,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3341001
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[77] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/77",
			bg = "77",
			name = "碧色轻羽",
			timeBgColor = "4c3cb1",
			minServantTypeId = 164102001,
			showLuckyTip = true,
			itemBg = "77Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 77,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1641020
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[78] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/78",
			bg = "78",
			name = "踞世恶龙",
			timeBgColor = "742650",
			isShowState = true,
			minServantTypeId = 104602101,
			showLuckyTip = true,
			itemBg = "78Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 78,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1046021
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[79] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/79",
			bg = "79",
			name = "青溟少羽",
			timeBgColor = "7e0001",
			isShowState = true,
			extraServant = 1532022,
			minServantTypeId = 154101901,
			showLuckyTip = true,
			itemBg = "79Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 79,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1541019,
				1532022
			},
			timePos = Vector2(-33, -236),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[80] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/80",
			bg = "80",
			name = "夏日香气",
			timeBgColor = "8f2413",
			minServantTypeId = 344600301,
			showLuckyTip = true,
			itemBg = "80Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 80,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3446003
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[81] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/81",
			bg = "81",
			name = "香甜可可",
			timeBgColor = "5b2650",
			minServantTypeId = 344200201,
			showLuckyTip = true,
			itemBg = "81Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 81,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3442002
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[82] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/82",
			bg = "82",
			name = "宇治抹茶",
			timeBgColor = "463b4b",
			minServantTypeId = 344300401,
			showLuckyTip = true,
			itemBg = "82Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 82,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3443004
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[83] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/83",
			bg = "83",
			name = "河水之源",
			timeBgColor = "463b4b",
			minServantTypeId = 254100301,
			showLuckyTip = true,
			itemBg = "83Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 83,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2541003
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[84] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/84",
			bg = "84",
			name = "神市之主",
			timeBgColor = "6e3885",
			minServantTypeId = 254500401,
			showLuckyTip = true,
			itemBg = "84Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 84,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2545004
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[85] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/85",
			bg = "85",
			name = "龙之归礼",
			timeBgColor = "992e26",
			minServantTypeId = 154402701,
			showLuckyTip = true,
			itemBg = "85Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 85,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1544027
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[86] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/86",
			bg = "86",
			name = "苍鹭之羽",
			timeBgColor = "7e3948",
			minServantTypeId = 104402901,
			showLuckyTip = true,
			itemBg = "86Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 86,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1044029
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[87] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/87",
			bg = "87",
			name = "光耀永存",
			timeBgColor = "7e0000",
			minServantTypeId = 104502801,
			showLuckyTip = true,
			itemBg = "87Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 87,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1045028
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[88] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/88",
			bg = "88",
			name = "王赐之剑",
			timeBgColor = "7f4148",
			minServantTypeId = 124501701,
			showLuckyTip = true,
			itemBg = "88Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 88,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1245017
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[89] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/89",
			bg = "89",
			name = "碧光微熹",
			timeBgColor = "463ea6",
			minServantTypeId = 124101801,
			showLuckyTip = true,
			itemBg = "89Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 89,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1241018
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[90] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/90",
			bg = "90",
			name = "光耀加冕",
			timeBgColor = "a1427e",
			minServantTypeId = 144504101,
			showLuckyTip = true,
			itemBg = "90Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 90,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1445041
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[91] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/91",
			bg = "91",
			name = "深秋甘味",
			timeBgColor = "ac474f",
			minServantTypeId = 354100201,
			showLuckyTip = true,
			itemBg = "91Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 91,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3541002
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[92] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/92",
			bg = "92",
			name = "果木金泽",
			timeBgColor = "db3d7c",
			minServantTypeId = 354200101,
			showLuckyTip = true,
			itemBg = "92Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 92,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3542001
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[93] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/93",
			bg = "93",
			name = "伪装之酒",
			timeBgColor = "900101",
			minServantTypeId = 304601401,
			showLuckyTip = true,
			itemBg = "93Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 93,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				3046014
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[94] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/94",
			bg = "94",
			name = "暗鸦低诉",
			timeBgColor = "2e3e60",
			minServantTypeId = 124102101,
			showLuckyTip = true,
			itemBg = "94Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 94,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1241021
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[95] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/95",
			bg = "95",
			name = "神启隐者",
			timeBgColor = "2e3e60",
			minServantTypeId = 124102201,
			showLuckyTip = true,
			itemBg = "95Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 95,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1241022
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[96] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/96",
			bg = "96",
			name = "暮雪樱归",
			timeBgColor = "9e568f",
			minServantTypeId = 134103301,
			showLuckyTip = true,
			itemBg = "96Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 96,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1341033
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[97] = {
			hasItem = false,
			name = "长夜深眠",
			bg = "97",
			minServantPath = "UI/Summon/Textures/97",
			timeBgColor = "742650",
			minServantTypeId = 114603901,
			showSpecialTip = true,
			showLuckyTip = false,
			itemBg = "97Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 97,
			resultTitle = "Sendfor010",
			specialTip = "『长夜深眠』使用<color=#ffcf4c>约定之契</color>进行召唤\n规则与其他限定召唤相同",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1146039
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[98] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/98",
			bg = "98",
			name = "纯白正义",
			timeBgColor = "51a0ac",
			minServantTypeId = 114202001,
			showLuckyTip = true,
			itemBg = "98Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 98,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1142020
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[99] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/99",
			bg = "99",
			name = "冰镜心音",
			timeBgColor = "4585b2",
			minServantTypeId = 114104301,
			showLuckyTip = true,
			itemBg = "99Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 99,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1141043
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[100] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/100",
			bg = "100",
			name = "绀碧若风",
			timeBgColor = "4585b2",
			minServantTypeId = 154303101,
			showLuckyTip = true,
			itemBg = "100Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 100,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1543031
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[101] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/101",
			bg = "101",
			name = "赤朱流火",
			timeBgColor = "4585b2",
			minServantTypeId = 154203201,
			showLuckyTip = true,
			itemBg = "101Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 101,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				1542032
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[102] = {
			hasItem = false,
			minServantPath = "UI/Summon/Textures/102",
			bg = "102",
			name = "神息光耀",
			timeBgColor = "4585b2",
			minServantTypeId = 254500101,
			showLuckyTip = true,
			itemBg = "102Item",
			order = 250,
			effect = "",
			tip = "",
			typeId = 102,
			resultTitle = "Sendfor010",
			tipWidth = 350,
			color = 5,
			minServantNum = 150,
			cost = {
				{
					icon = "01Icon",
					sliver = 50,
					isAutoBuy = true,
					type = 3,
					id = 31000004,
					num = 1,
					isShow = true
				}
			},
			specialList = {
				2545001
			},
			timePos = Vector2(-27, -240),
			tips = {
				{
					icon = "UrMini",
					iconScale = 0.6,
					rate = "5%",
					title = "UR级誓灵",
					servants = {}
				},
				{
					icon = "SrMini",
					iconScale = 0.6,
					rate = "15%",
					title = "SR级誓灵",
					servants = {}
				},
				{
					icon = "RMini",
					iconScale = 0.6,
					rate = "80%",
					title = "R级誓灵",
					servants = {}
				}
			}
		},
		[1159] = {
			isSelect = true,
			name = "自选复刻",
			tip = [[
1.活动期间，可以从列表中选择誓灵，作为自选卡池的概率UP誓灵
2.自选卡池中概率UP誓灵的出现概率为：UR 2.5%，SR：5%
3.自选卡池中概率UP的UR誓灵均为150次保底
4.自选卡池中除UP誓灵外，其他出现誓灵与常驻卡池相同
5.选择誓灵后，可以更换UP誓灵，更换后当前卡池内容将替换为新的UP卡池。
6.首次更换卡池免费，之后每次更换需要消耗100水晶，共4次更换机会
7.更换卡池后，UP誓灵的保底次数不会重置]],
			hasItem = false,
			bg = "01",
			isShowChange = true,
			timeBgColor = "23547d",
			showLuckyTip = true,
			itemBg = "1159Item",
			order = 100,
			effect = "",
			typeId = 1159,
			resultTitle = "Sendfor010",
			tipWidth = 700,
			cost = {},
			specialList = {},
			timePos = Vector2(-33, -232),
			tips = {}
		},
		[1301] = {
			isSelect = true,
			name = "自选复刻",
			hasItem = false,
			bg = "01",
			isShowChange = false,
			timeBgColor = "23547d",
			summonTip = "自选卡池（需消耗100水晶，选择后不能更换卡池）",
			showLuckyTip = true,
			itemBg = "1159Item",
			order = 100,
			effect = "",
			tip = [[
1.活动期间，可以从列表中选择誓灵，作为自选卡池的概率UP誓灵
2.开启自选召唤需消耗100水晶，开启后，不能更换自选卡池
3.自选卡池中，单UP誓灵的出现概率为：UR 2.5%，双UP誓灵的出现概率为：UR共3%
4.自选卡池中除UP誓灵外，其他出现的誓灵与常驻卡池相同]],
			typeId = 1301,
			resultTitle = "Sendfor010",
			tipWidth = 700,
			cost = {},
			specialList = {},
			timePos = Vector2(-33, -232),
			tips = {}
		},
		[1645] = {
			isSelect = true,
			name = "自选复刻",
			tip = [[
1.活动期间，可以从列表中选择誓灵，作为自选卡池的概率UP誓灵
2.自选卡池中概率UP誓灵的出现概率为：<color=#FFFF88FF>UR 2.5%，SR：5%</color>
3.自选卡池中概率UP的UR誓灵均为<color=#FFFF88FF>150</color>次保底
4.自选卡池中除UP誓灵外，其他出现誓灵与常驻卡池相同
5.选择誓灵后，可以更换UP誓灵，更换后当前卡池内容将替换为新的UP卡池。
6.首次选择卡池及前<color=#FFFF88FF>2</color>次更换卡池免费，之后每次更换需要消耗<color=#FFFF88FF>50</color>水晶，共<color=#FFFF88FF>6</color>次更换机会
7.更换卡池后，UP誓灵的保底次数不会重置]],
			hasItem = false,
			bg = "01",
			isShowChange = true,
			timeBgColor = "23547d",
			showLuckyTip = true,
			itemBg = "1159Item",
			order = 100,
			effect = "",
			typeId = 1645,
			resultTitle = "Sendfor010",
			tipWidth = 1000,
			cost = {},
			specialList = {},
			timePos = Vector2(-33, -232),
			tips = {}
		}
	},
	specialSummon = {
		[1022] = {
			isOpenExchangePanel = false,
			tip = [[

神降 - 樱日和
科技再造信仰——高天原主神<color=#FFD700ff>天照(UR)</color>等待被召唤
（期限： <color=#FFD700ff>2018年10月24日23:59</color>　一共可召唤<color=#FFD700ff>2</color>次）

所需材料
<color=#6189FFff>【古籍残章】</color>（活动关卡掉落）
<color=#F584FF>【太阳宝玉】</color>（活动期间登录奖励 / 兑换）
<color=#F584FF>【尘封的天照文档】</color>（活动关卡通关任务奖励）
]],
			tipWidth = 750,
			actID = 1022,
			panel = "TianZhaoPanel",
			costScore = 10,
			servantType = 1345012,
			bgUrl = "",
			timesItems = {
				{
					{
						id = 60000000,
						num = 1
					},
					{
						id = 60000001,
						num = 1
					},
					{
						id = 60000002,
						num = 250,
						isCharge = true
					}
				},
				{
					{
						id = 60000000,
						num = 1
					},
					{
						id = 60000001,
						num = 1
					},
					{
						id = 60000002,
						num = 1000,
						isCharge = true
					}
				}
			}
		},
		[1063] = {
			isOpenExchangePanel = true,
			tip = [[

神降 - 樱日和
科技再造信仰——高天原主神<color=#FFD700ff>天照(UR)</color>等待被召唤
（材料获取时间： <color=#FFD700ff>2019年3月21日 — 4月4日09:00</color>
召唤截止： <color=#FFD700ff>2019年4月11日09:00</color>　一共可召唤<color=#FFD700ff>2</color>次）

所需材料
<color=#6189FFff>【古籍残章】</color>（活动关卡掉落）
<color=#F584FF>【太阳宝玉】</color>（活动期间登录奖励 / 兑换）
<color=#F584FF>【尘封的天照文档】</color>（活动关卡通关任务奖励）
]],
			tipWidth = 750,
			exchangeDes = "请选择获得需要的奖励",
			actID = 1063,
			panel = "TianZhaoPanel",
			costScore = 37,
			servantType = 1345012,
			bgUrl = "",
			timesItems = {
				{
					{
						id = 60000028,
						num = 1
					},
					{
						id = 60000029,
						num = 1
					},
					{
						id = 60000030,
						num = 250,
						isCharge = true
					}
				},
				{
					{
						id = 60000028,
						num = 1
					},
					{
						id = 60000029,
						num = 1
					},
					{
						id = 60000030,
						num = 1000,
						isCharge = true
					}
				}
			},
			exchangeItems = {
				{
					id = 1,
					des = "天照*1",
					item = {
						id = 31345012,
						num = 1
					}
				},
				{
					id = 2,
					des = "回响之契*50",
					item = {
						id = 31000028,
						num = 50
					}
				}
			}
		},
		[1452] = {
			isOpenExchangePanel = true,
			tip = [[

神降 - 樱日和
科技再造信仰——高天原主神<color=#FFD700ff>天照(UR)</color>等待被召唤
（材料获取时间： <color=#FFD700ff>2020年3月26日 — 4月9日09:00</color>
召唤截止： <color=#FFD700ff>2020年4月16日09:00</color>　一共可召唤<color=#FFD700ff>2</color>次）

所需材料
<color=#6189FFff>【古籍残章】</color>（活动关卡掉落）
<color=#F584FF>【太阳宝玉】</color>（活动期间登录奖励 / 兑换）
<color=#F584FF>【尘封的天照文档】</color>（活动关卡通关任务奖励）
]],
			tipWidth = 750,
			exchangeDes = "请选择获得需要的奖励",
			actID = 1452,
			panel = "TianZhaoPanel",
			costScore = 60000163,
			servantType = 1345012,
			bgUrl = "",
			timesItems = {
				{
					{
						id = 60000161,
						num = 1
					},
					{
						id = 60000162,
						num = 1
					},
					{
						id = 60000163,
						num = 250,
						isCharge = true
					}
				},
				{
					{
						id = 60000161,
						num = 1
					},
					{
						id = 60000162,
						num = 1
					},
					{
						id = 60000163,
						num = 1000,
						isCharge = true
					}
				}
			},
			exchangeItems = {
				{
					id = 1,
					des = "天照*1",
					item = {
						id = 31345012,
						num = 1
					}
				},
				{
					id = 2,
					des = "回响之契*50",
					item = {
						id = 31000028,
						num = 50
					}
				}
			}
		}
	},
	decompose = {
		{
			score = 0,
			echo = 0,
			sliver = 2
		},
		{
			score = 2,
			echo = 2,
			sliver = 4
		},
		{
			score = 5,
			echo = 5,
			sliver = 10
		},
		{
			score = 10,
			echo = 100,
			sliver = 20
		}
	},
	affinityServants = {
		{
			id = 1,
			des = "第一期",
			arr = {
				{
					skinID = 113501604,
					bigServantPath = "UI/Summon/Textures_Lang/Langren",
					servantTypeID = 1135016,
					needMat = {
						{
							31000018,
							16
						},
						{
							31000020,
							90
						}
					}
				},
				{
					skinID = 133102104,
					bigServantPath = "UI/Summon/Textures_Lang/yiji",
					servantTypeID = 1331021,
					needMat = {
						{
							31000018,
							16
						},
						{
							31000020,
							90
						}
					}
				},
				{
					skinID = 151201604,
					bigServantPath = "UI/Summon/Textures_Lang/huoshu",
					servantTypeID = 1512016,
					needMat = {
						{
							31000018,
							5
						},
						{
							31000020,
							27
						}
					}
				},
				{
					skinID = 113601704,
					bigServantPath = "UI/Summon/Textures_Lang/Langren2",
					servantTypeID = 1136017,
					needMat = {
						{
							31000018,
							16
						},
						{
							31000020,
							90
						}
					}
				},
				{
					skinID = 113301804,
					bigServantPath = "UI/Summon/Textures_Lang/Xizi",
					servantTypeID = 1133018,
					needMat = {
						{
							31000018,
							16
						},
						{
							31000020,
							90
						}
					}
				},
				{
					skinID = 162600804,
					bigServantPath = "UI/Summon/Textures_Lang/Ba",
					servantTypeID = 1626008,
					needMat = {
						{
							31000018,
							6
						},
						{
							31000020,
							29
						}
					}
				}
			}
		}
	},
	affinityMats = {
		[31000018] = {
			15,
			"Common.Darecopyint"
		},
		[31000017] = {
			14,
			"Common.Darecopyint3"
		},
		[31000019] = {
			16,
			"Common.Darecopyint4"
		},
		[31000020] = {
			17,
			"Common.Darecopyint2"
		},
		[31000030] = {
			30,
			"Common.Darecopyint5"
		},
		[31000031] = {
			31,
			"Common.Darecopyint6"
		},
		[31000032] = {
			32,
			"Common.Darecopyint7"
		},
		[31000033] = {
			33,
			"Common.Darecopyint8"
		}
	},
	shieldServant = {
		3514005,
		2628011,
		3026009,
		3021004,
		1423032,
		1621015,
		1131006,
		1141007,
		1424030,
		1421031,
		1313024,
		1024019,
		1326025,
		1126002,
		1325007,
		1116008,
		1024005,
		1114013,
		1415020,
		1021014,
		1512016,
		1324005,
		1626006,
		1623007,
		1626008,
		1625013,
		1626008,
		1042001,
		1043006,
		1046002,
		1544015,
		1345012,
		1646002,
		1543020,
		1044017,
		1445027,
		1346016,
		1316019,
		2628011
	},
	SummonExchangeItems = {
		[20000032] = {
			itemID = 20000032,
			shopID = 11
		}
	},
	firstRewardPools = {
		97
	}
})
