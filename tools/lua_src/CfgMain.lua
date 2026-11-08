ConfigMgr.initConfig("CfgMain", {
	littleActInfo = {
		{
			name = "回归专属",
			path = "UI/Main/Textures/mianBackBtn",
			itemRender = MainModule.MainPlayerBackButton,
			func = MainMgr.isPlayerBackAct
		},
		{
			name = "离海鸣潮",
			path = "UI/Main/Textures/NewYear20Btn",
			itemRender = MainModule.MainActDefaultButton,
			func = MainMgr.isNewYear20Act
		},
		{
			name = "新人活动",
			actId = 1440,
			path = "UI/Main/Textures/GrowBtn",
			itemRender = MainModule.MainPlayerGrowButton
		}
	},
	mainApps = {
		{
			name = "零食",
			height = 1,
			itemName = "MainSupplyAppIcon",
			typeID = 1,
			icon = "App04",
			width = 1,
			pos = Vector2(1, 2),
			data = {
				shelfID = 1
			},
			link = {
				"OPEN_DORM_SUPPLY_PANEL"
			}
		},
		{
			name = "饮料",
			height = 1,
			itemName = "MainSupplyAppIcon",
			typeID = 2,
			icon = "App05",
			width = 1,
			pos = Vector2(2, 2),
			data = {
				shelfID = 2
			},
			link = {
				"OPEN_DORM_SUPPLY_PANEL"
			}
		},
		{
			name = "速食",
			height = 1,
			itemName = "MainSupplyAppIcon",
			typeID = 3,
			icon = "App06",
			width = 1,
			pos = Vector2(3, 2),
			data = {
				shelfID = 3
			},
			link = {
				"OPEN_DORM_SUPPLY_PANEL"
			}
		},
		{
			name = "能量块",
			height = 1,
			itemName = "MainSupplyAppIcon",
			typeID = 4,
			icon = "App07",
			width = 1,
			pos = Vector2(4, 2),
			data = {
				shelfID = 4
			},
			link = {
				"OPEN_DORM_SUPPLY_PANEL"
			}
		},
		{
			name = "协会金币",
			height = 1,
			itemName = "MainDormAppIcon",
			typeID = 5,
			icon = "App01",
			width = 1,
			pos = Vector2(1, 1),
			data = {
				kind = 10,
				id = 2
			},
			link = {}
		},
		{
			name = "协会体力",
			height = 1,
			itemName = "MainDormAppIcon",
			typeID = 6,
			icon = "App02",
			width = 1,
			pos = Vector2(2, 1),
			data = {
				kind = 9,
				id = 1
			},
			link = {}
		},
		{
			width = 1,
			name = "领取物品",
			itemName = "MainItemAppIcon",
			typeID = 7,
			height = 1,
			icon = "App03",
			pos = Vector2(7, 1),
			link = {}
		},
		{
			width = 7,
			name = "前往派遣",
			itemName = "MainDispatcherApp",
			typeID = 8,
			height = 2,
			icon = "",
			pos = Vector2(1, 4),
			link = {}
		},
		{
			width = 1,
			name = "言灵录",
			itemName = "MainMomentAppIcon",
			typeID = 9,
			height = 1,
			icon = "App08",
			pos = Vector2(7, 2),
			link = {
				"OPEN_MOMENT_PANEL"
			}
		},
		{
			ticketItemID = 60000175,
			height = 1,
			itemName = "MainAutoDispatchAppIcon",
			typeID = 10,
			name = "自律派遣",
			icon = "App09",
			width = 1,
			pos = Vector2(6, 1),
			data = {
				tabIndex = 5
			},
			link = {
				"OPEN_BUILDING_DISPATCH_PANEL",
				6
			}
		}
	},
	loginLive2d = {
		[133100611] = {
			delayTime = 2,
			motion = "login",
			playTime = 1
		},
		[154500211] = {
			delayTime = 0,
			motion = "login",
			playTime = 4
		},
		[234600111] = {
			delayTime = 1,
			motion = "login",
			playTime = 3
		},
		[234200211] = {
			delayTime = 0,
			motion = "login",
			playTime = 3
		},
		[234400411] = {
			delayTime = 0,
			motion = "login",
			playTime = 3
		},
		[234400412] = {
			delayTime = 0,
			motion = "login",
			playTime = 3
		},
		[234500311] = {
			delayTime = 0,
			motion = "login",
			playTime = 3
		},
		[234100511] = {
			delayTime = 0,
			motion = "login",
			playTime = 3
		},
		[134100111] = {
			delayTime = 0,
			motion = "login",
			playTime = 7
		},
		[144402311] = {
			delayTime = 0,
			motion = "login",
			playTime = 5
		},
		[114202911] = {
			delayTime = 0,
			motion = "login",
			playTime = 5
		}
	},
	functionsH = {
		{
			name = "协会",
			url = "BuildingIcon",
			link = "OPEN_DORM_CHOICE_PANEL",
			enName = "Association",
			redPoint = {
				"BUILDING_MAIN",
				"Red_Shop_34",
				"Red_Shop_35",
				"Red_Shop_36",
				"Red_Shop_37",
				"Red_Shop_38",
				"Red_Shop_39",
				"Red_Shop_40",
				"Red_Shop_41",
				"Red_Shop_42",
				"Red_Shop_43",
				"Red_Shop_44"
			}
		},
		{
			name = "召唤",
			url = "SendForIcon",
			link = "OPEN_SUMMON_PANEL",
			enName = "Conjure",
			redPoint = {
				"SUMMON_ACT"
			}
		},
		{
			name = "任务",
			url = "TasksIcon",
			link = "OPEN_MISSION_PANEL",
			enName = "Quests",
			redPoint = {
				"MISSION_FINISH_MAIN",
				"MISSION_OVERSTEP_FIRST",
				"MISSION_OVERSTEP"
			}
		},
		{
			name = "结社",
			url = "GuildIcon",
			link = "OPEN_FAMILY_PANEL",
			enName = "Guild",
			redPoint = {
				"FAMILY_MAIN",
				"FAMILY_REQUEST_FULL"
			}
		},
		{
			name = "商店",
			url = "StoreIcon",
			link = "OPEN_SHOP_PANEL",
			enName = "Shop",
			redPoint = ShopConfig.getAllTabRedPoints()
		}
	},
	functionsV = {
		{
			name = "图鉴",
			link = "OPEN_HAND_BOOK_PANEL",
			url = "HandbookIcon",
			redPoint = {
				"HAND_BOOK_MAIN"
			}
		},
		{
			name = "排名",
			link = "OPEN_RANK_PANEL",
			url = "TopIcon"
		},
		{
			name = "成就",
			link = "OPEN_ACHIEVEMENT_PANEL",
			url = "AchievementIcon",
			redPoint = {
				"ACHIEVEMENT_GET_REWARD"
			}
		},
		{
			name = "好友",
			link = "OPEN_FRIEND_MAIN_PANEL",
			url = "FriendIcon",
			redPoint = {
				"FRIEND_REQUEST"
			}
		},
		{
			name = "邮件",
			link = "OPEN_LETTER_PANEL",
			url = "MailIcon",
			redPoint = {
				"LETTER_UNREAD"
			}
		},
		{
			name = "公告",
			link = "OPEN_NOTICE_PANEL",
			url = "NoticeIcon",
			redPoint = {
				"NEW_NOTICE"
			}
		},
		{
			name = "设置",
			link = "OPEN_SETTING_PANEL",
			url = "SettingsIcon"
		}
	},
	themes = {
		{
			downTouchEffect = "Prefab/P_UI_cp",
			name = "默认主题",
			moveTouchEffect = "Prefab/P_UI_cp2",
			id = 1,
			preview = "SceneItem01",
			getTip = "默认解锁",
			bgs = {
				{
					time = "6-17",
					url = "Day"
				},
				{
					time = "17-20",
					url = "Dusk"
				},
				{
					time = "20-24",
					url = "Night"
				},
				{
					time = "0-6",
					url = "MidNight"
				}
			}
		},
		{
			downTouchEffect = "Prefab/P_ui_cp3_snow1",
			name = "圣夜巡游",
			moveTouchEffect = "Prefab/P_ui_cp3_snow2",
			id = 2,
			preview = "SceneItem02",
			getTip = "获得成就后解锁：\n【场景主题解锁：圣夜巡游】",
			bgs = {
				{
					time = "19-24",
					url = "ChristmasNight"
				},
				{
					time = "0-6",
					url = "ChristmasNight"
				},
				{
					time = "6-16",
					url = "ChristmasDay"
				},
				{
					time = "16-19",
					url = "ChristmasDusk"
				}
			},
			effects = {
				{
					parent = "texBg",
					url = "Prefab/P_ui_scene_snow1",
					pos = {
						-193,
						309
					}
				},
				{
					parent = "transform",
					url = "Prefab/P_ui_scene_snow2",
					pos = {
						1,
						2
					}
				}
			}
		},
		{
			downTouchEffect = "Prefab/P_UI_cp_flower1",
			name = "樱曳风华",
			moveTouchEffect = "Prefab/P_UI_cp_flower2",
			id = 3,
			preview = "SceneItem03",
			getTip = "参加活动解锁：\n【圣夜祭商店】限时兑换",
			bgs = {
				{
					time = "6-16",
					url = "ShrineDay"
				},
				{
					time = "16-19",
					url = "ShrineDusk"
				},
				{
					time = "19-24",
					url = "ShrineNight"
				},
				{
					time = "0-6",
					url = "ShrineNight"
				}
			},
			effects = {
				{
					parent = "texBg",
					url = "Prefab/P_ui_merry_flower1",
					pos = {
						-748,
						350
					}
				},
				{
					parent = "transform",
					url = "Prefab/P_ui_merry_flower2",
					pos = {
						-748,
						350
					}
				}
			}
		},
		{
			downTouchEffect = "Prefab/P_ui_cp4_newyear1",
			name = "星雨夜华",
			moveTouchEffect = "Prefab/P_ui_cp4_newyear2",
			id = 4,
			preview = "SceneItem04",
			getTip = "获得成就后解锁：\n【场景主题解锁：星雨夜华】",
			bgs = {
				{
					time = "6-18",
					url = "PigyearDay"
				},
				{
					time = "18-24",
					url = "PigyearDusk"
				},
				{
					time = "0-6",
					url = "PigyearNight"
				}
			},
			effects = {
				{
					parent = "texBg",
					url = "Prefab/P_ui_newyear1",
					pos = {
						-748,
						350
					}
				},
				{
					parent = "transform",
					url = "Prefab/P_ui_newyear2",
					pos = {
						-748,
						350
					}
				}
			}
		},
		{
			downTouchEffect = "Prefab/P_ui_cp5_st1",
			name = "滨海夏日",
			moveTouchEffect = "Prefab/P_ui_cp5_st2",
			id = 5,
			preview = "SceneItem05",
			getTip = "获得成就后解锁：\n【场景主题解锁：滨海夏日】",
			bgs = {
				{
					time = "6-16",
					url = "SummerDay"
				},
				{
					time = "16-20",
					url = "SummerDusk"
				},
				{
					time = "20-24",
					url = "SummerNight"
				},
				{
					time = "0-6",
					url = "SummerNight"
				}
			},
			effects = {
				{
					parent = "texBg",
					time = "6-20",
					url = "P_ui_ddt_1.guangyun",
					flipX = true,
					pos = {
						-576,
						350
					}
				}
			}
		},
		{
			downTouchEffect = "Prefab/P_ui_cp_ouxiang2",
			name = "星耀剧场",
			moveTouchEffect = "Prefab/P_ui_cp_ouxiang1",
			id = 6,
			preview = "SceneItem06",
			getTip = "获得成就后解锁：\n【场景主题解锁：星耀剧场】",
			bgs = {
				{
					time = "0-24",
					url = "IdolRoomDay"
				}
			},
			effects = {
				{
					parent = "texBg",
					time = "0-24",
					url = "P_wt_light.animation",
					flipX = true,
					pos = {
						25,
						-17
					}
				}
			}
		},
		{
			downTouchEffect = "Prefab/P_cp_ylc2",
			name = "梦幻王国",
			moveTouchEffect = "Prefab/P_cp_ylc1",
			id = 7,
			preview = "SceneItem07",
			getTip = "获得成就后解锁：\n【场景主题解锁：梦幻王国】",
			bgs = {
				{
					time = "6-16",
					url = "AmuparkDay"
				},
				{
					time = "16-20",
					url = "AmuparkDusk"
				},
				{
					time = "20-24",
					url = "AmuparkNight"
				},
				{
					time = "0-6",
					url = "AmuparkNight"
				}
			},
			effects = {
				{
					parent = "texBg",
					time = "6-20",
					url = "P_ylccj.a",
					flipX = false,
					pos = {
						-3,
						-9
					}
				},
				{
					parent = "texBg",
					time = "0-6",
					url = "P_ylccj.a",
					flipX = false,
					pos = {
						-3,
						-9
					}
				}
			}
		},
		{
			downTouchEffect = "Prefab/P_ui_cp6_coffee1",
			name = "女仆咖啡厅",
			moveTouchEffect = "Prefab/P_ui_cp6_coffee2",
			id = 8,
			preview = "SceneItem08",
			getTip = "获得成就后解锁：\n【场景主题解锁：女仆咖啡厅】",
			bgs = {
				{
					time = "6-16",
					url = "CoffeeHouseDay"
				},
				{
					time = "16-24",
					url = "CoffeeHouseNight"
				},
				{
					time = "0-6",
					url = "CoffeeHouseNight"
				}
			}
		},
		{
			downTouchEffect = "Prefab/P_ui_cp9_qixi1",
			name = "花聆·萤影",
			moveTouchEffect = "Prefab/P_ui_cp9_qixi2",
			id = 9,
			preview = "SceneItem09",
			getTip = "获得成就后解锁：\n【场景主题解锁：花聆·萤影】",
			bgs = {
				{
					time = "6-16",
					url = "TanabataDusk"
				},
				{
					time = "16-24",
					url = "TanabataNight"
				},
				{
					time = "0-6",
					url = "TanabataNight"
				}
			}
		},
		{
			downTouchEffect = "Prefab/P_ui_cp_yanhui1",
			name = "梦色之厅",
			moveTouchEffect = "Prefab/P_ui_cp_yanhui2",
			id = 10,
			preview = "SceneItem10",
			getTip = "获得成就后解锁：\n【场景主题解锁：梦色之厅】",
			bgs = {
				{
					time = "6-18",
					url = "EveningDressRoomDay"
				},
				{
					time = "18-24",
					url = "EveningDressRoomNight"
				},
				{
					time = "0-6",
					url = "EveningDressRoomNight"
				}
			}
		},
		{
			downTouchEffect = "Prefab/P_ui_cp_yanhui1",
			name = "灵渡之域",
			moveTouchEffect = "Prefab/P_ui_cp_yanhui2",
			id = 11,
			preview = "SceneItem11",
			getTip = "获得成就后解锁：\n【场景主题解锁：灵渡之域】",
			bgs = {
				{
					time = "6-16",
					url = "HalloweenDay"
				},
				{
					time = "16-20",
					url = "HalloweenDusk"
				},
				{
					time = "20-24",
					url = "HalloweenNight"
				},
				{
					time = "0-6",
					url = "HalloweenNight"
				}
			}
		},
		{
			downTouchEffect = "Prefab/P_ui_cp_yanhui1",
			name = "世纪大道",
			moveTouchEffect = "Prefab/P_ui_cp_yanhui2",
			id = 12,
			preview = "SceneItem12",
			getTip = "获得成就后解锁：\n【场景主题解锁：世纪大道】",
			bgs = {
				{
					time = "6-16",
					url = "ShoppingRoomDay"
				},
				{
					time = "16-19",
					url = "ShoppingRoomDusk"
				},
				{
					time = "19-24",
					url = "ShoppingRoomNight"
				},
				{
					time = "0-6",
					url = "ShoppingRoomNight"
				}
			}
		},
		{
			downTouchEffect = "Prefab/P_UI_cp_flower1",
			name = "樱之坂",
			moveTouchEffect = "Prefab/P_UI_cp_flower2",
			id = 13,
			preview = "SceneItem13",
			getTip = "获得成就后解锁：\n【场景主题解锁：樱之坂】",
			bgs = {
				{
					time = "6-16",
					url = "CLDay"
				},
				{
					time = "16-19",
					url = "CLDusk"
				},
				{
					time = "19-24",
					url = "CLNight"
				},
				{
					time = "0-6",
					url = "CLNight"
				}
			}
		},
		{
			downTouchEffect = "Prefab/P_ui_cp_ouxiang2",
			name = "甜睡魔法",
			moveTouchEffect = "Prefab/P_ui_cp_ouxiang1",
			id = 14,
			preview = "SceneItem14",
			getTip = "获得成就后解锁：\n【场景主题解锁：甜睡魔法】",
			bgs = {
				{
					time = "6-16",
					url = "SleepDay"
				},
				{
					time = "16-19",
					url = "SleepDusk"
				},
				{
					time = "19-24",
					url = "SleepNight"
				},
				{
					time = "0-6",
					url = "SleepNight"
				}
			}
		}
	},
	loadPanels = {},
	cardSet = {
		highFeeling = 50,
		times = {
			"6-17",
			"17-20",
			"20-24",
			"0-6"
		},
		default = {
			actions = {
				[4.0] = 1,
				[5.0] = 2
			},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7
			},
			times = {
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					10,
					11
				},
				{
					12
				}
			}
		},
		[1042001] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-17,
						293.5,
						132.9,
						82.6
					},
					cvs = {
						4
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						-74,
						34,
						200,
						167.7
					},
					cvs = {
						4
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					5
				},
				{
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1046002] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-22,
						133.2,
						144.9,
						81.4
					},
					cvs = {
						5
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1033003] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-117,
						243,
						170.6,
						184.4
					},
					cvs = {
						7
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1124001] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-139,
						202,
						208.7,
						113.8
					},
					cvs = {
						5,
						9
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						-186,
						-123,
						167.5,
						208.6
					},
					cvs = {
						5,
						9
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					8
				},
				{
					12,
					8
				}
			}
		},
		[1126002] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-18.5,
						73,
						139.6,
						89.9
					},
					cvs = {
						8,
						9
					}
				},
				{
					name = "head",
					feel = 2,
					rect = {
						-10,
						193,
						97,
						80.1
					},
					cvs = {
						8,
						9
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					12,
					4,
					5
				}
			}
		},
		[1115003] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1113004] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1116005] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-78,
						-341.4,
						176.3,
						135.1
					},
					cvs = {
						4,
						11
					}
				},
				{
					name = "head",
					feel = 2,
					rect = {
						-199,
						81,
						98.4,
						80.1
					},
					cvs = {
						4,
						11
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10
			},
			times = {
				{
					5
				},
				{
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1226001] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1226002] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1341001] = {
			faces = {
				nil,
				4,
				1,
				1,
				2,
				4,
				3,
				3,
				3,
				4,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1334002] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1331003] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-71,
						48.6,
						187.6,
						122.3
					},
					cvs = {
						4
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					5
				},
				{
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			},
			live2d = {
				touchs = {
					{
						name = "head",
						feel = 2,
						rect = {
							-114,
							428,
							181.9,
							97.8
						},
						cvs = {
							4
						}
					}
				}
			}
		},
		[1335004] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1324005] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1331006] = {
			touchs = {
				{
					name = "1",
					feel = 2,
					rect = {
						-340,
						-195.1,
						180.5,
						130.8
					},
					cvs = {
						7
					}
				},
				{
					name = "2",
					feel = 2,
					rect = {
						-51,
						185,
						63.8,
						83.6
					},
					cvs = {
						5
					}
				},
				{
					name = "3",
					feel = 2,
					rect = {
						-82,
						285,
						177.5,
						115.3
					},
					cvs = {
						8
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				10,
				11
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					9
				},
				{
					12,
					9
				}
			},
			live2d = {
				touchs = {
					{
						name = "head",
						feel = 2,
						rect = {
							-134,
							170.9,
							153.4,
							89.7
						},
						cvs = {
							8
						}
					},
					{
						name = "mune",
						feel = 2,
						rect = {
							-157.3,
							-43.30001,
							176.7,
							86.6
						},
						cvs = {
							5
						}
					},
					{
						name = "momo",
						feel = 2,
						rect = {
							-151.8,
							-258,
							151.8,
							77.3
						},
						cvs = {
							7
						}
					}
				}
			}
		},
		[1325007] = {
			touchs = {
				{
					name = "head",
					feel = 2,
					rect = {
						-164,
						31,
						142.6,
						99.2
					},
					cvs = {
						8
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						-185,
						-173,
						184.6,
						90.9
					},
					cvs = {
						8
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					9
				},
				{
					12,
					9
				}
			}
		},
		[1323008] = {
			touchs = {
				{
					name = "head",
					feel = 2,
					rect = {
						-137,
						145,
						207.1,
						130
					},
					cvs = {
						9
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8
				},
				{
					12,
					8
				}
			}
		},
		[1311009] = {
			touchs = {
				{
					name = "head",
					feel = 2,
					rect = {
						-291,
						102.5,
						182.9,
						122.5
					},
					cvs = {
						4
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						26,
						134.1,
						184.6,
						90.9
					},
					cvs = {
						4
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					5
				},
				{
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1316010] = {
			touchs = {
				{
					name = "head",
					feel = 2,
					rect = {
						-107,
						145,
						157.2,
						60.5
					},
					cvs = {
						6
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						-43,
						-59.1,
						137.8,
						115
					},
					cvs = {
						6
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1313011] = {
			touchs = {
				{
					name = "head",
					feel = 2,
					rect = {
						-199,
						133,
						136.1,
						81.6
					},
					cvs = {
						5,
						7
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						-139,
						-63,
						180,
						99.9
					},
					cvs = {
						5,
						7
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				10,
				11
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1443001] = {
			touchs = {
				{
					name = "head",
					feel = 2,
					rect = {
						-147,
						139,
						139.9,
						93.7
					},
					cvs = {
						5
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						-110,
						-76,
						192,
						134.6
					},
					cvs = {
						5
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1431002] = {
			touchs = {
				{
					name = "head",
					feel = 2,
					rect = {
						-153,
						188,
						139.9,
						83.1
					},
					cvs = {
						6,
						9
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						-106,
						-46,
						173.9,
						112
					},
					cvs = {
						6,
						9
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8
				},
				{
					12,
					8
				}
			}
		},
		[1432003] = {
			touchs = {
				{
					name = "head",
					feel = 2,
					rect = {
						-194,
						327,
						139.9,
						83.1
					},
					cvs = {
						6
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			},
			live2d = {
				touchs = {
					{
						name = "head",
						feel = 2,
						rect = {
							-148,
							504,
							228.2,
							108.8
						},
						cvs = {
							6
						}
					}
				}
			}
		},
		[1436004] = {
			touchs = {
				{
					name = "head",
					feel = 2,
					rect = {
						-63,
						350,
						139.9,
						83.1
					},
					cvs = {
						10
					}
				},
				{
					name = "mune",
					feel = 2,
					rect = {
						-27,
						205,
						145.1,
						60.6
					},
					cvs = {
						10
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1421005] = {
			touchs = {
				{
					name = "head",
					feel = 2,
					rect = {
						-78,
						279,
						96,
						51.4
					},
					cvs = {
						9
					}
				},
				{
					name = "mune",
					feel = 2,
					rect = {
						18,
						-70.9,
						152,
						99.2
					},
					cvs = {
						9
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8
				},
				{
					12,
					8
				}
			}
		},
		[1421006] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1422007] = {
			touchs = {
				{
					name = "head",
					feel = 2,
					rect = {
						-24,
						125,
						97.4,
						43.1
					},
					cvs = {
						9
					}
				},
				{
					name = "mune",
					feel = 2,
					rect = {
						7,
						10,
						129.9,
						63.4
					},
					cvs = {
						9
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8
				},
				{
					12,
					8
				}
			}
		},
		[1425008] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-101,
						-79,
						172.6,
						118.5
					},
					cvs = {
						5
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1423009] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						65,
						-277,
						127.2,
						159.7
					},
					cvs = {
						7
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1426010] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						50,
						252,
						76.2,
						72.9
					},
					cvs = {
						4
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					5
				},
				{
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1414011] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1411012] = {
			touchs = {
				{
					name = "head",
					feel = 2,
					rect = {
						-94,
						324,
						164.9,
						97.9
					},
					cvs = {
						8
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						-41,
						151,
						119.9,
						60.6
					},
					cvs = {
						9
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					12,
					4,
					5
				}
			}
		},
		[1412013] = {
			touchs = {
				{
					name = "head",
					feel = 2,
					rect = {
						-240,
						71.5,
						162.7,
						83.6
					},
					cvs = {
						8
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						-225,
						-140.4,
						101.8,
						79.4
					},
					cvs = {
						9
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					12,
					4,
					5
				}
			}
		},
		[1413014] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-140.4,
						170,
						131,
						74.7
					},
					cvs = {
						5
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						-119,
						-38.75,
						127.1,
						77.5
					},
					cvs = {
						5
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1413015] = {
			touchs = {
				{
					name = "3",
					feel = 2,
					rect = {
						-38.75002,
						74.75002,
						113.2,
						69.2
					},
					cvs = {
						8
					}
				},
				{
					name = "mune",
					feel = 2,
					rect = {
						45,
						319,
						76,
						91.3
					},
					cvs = {
						5
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						121,
						264.9,
						88.5,
						54.1
					},
					cvs = {
						5
					}
				},
				{
					name = "4",
					feel = 2,
					rect = {
						-109,
						-80,
						165,
						106.4
					},
					cvs = {
						8
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					9
				},
				{
					12,
					9
				}
			}
		},
		[1544001] = {
			faces = {
				nil,
				4,
				3,
				1,
				2,
				4,
				3,
				4,
				1,
				4,
				3,
				4
			},
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-62,
						156.3,
						117.3,
						72
					},
					cvs = {
						9
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						-132,
						-37,
						138.1,
						120.2
					},
					cvs = {
						9
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8
				},
				{
					12,
					8
				}
			}
		},
		[1545002] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-62,
						157.7,
						143.5,
						70.6
					},
					cvs = {
						11
					}
				},
				{
					name = "momo",
					feel = 2,
					rect = {
						-98,
						-45,
						138.1,
						120.2
					},
					cvs = {
						7
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				10
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			},
			live2d = {
				touchs = {
					{
						name = "mune",
						feel = 2,
						rect = {
							-36,
							107.3,
							200,
							97
						},
						cvs = {
							11
						}
					},
					{
						name = "momo",
						feel = 2,
						rect = {
							-104,
							-163,
							144.9,
							177.7
						},
						cvs = {
							7
						}
					}
				}
			}
		},
		[1534003] = {
			faces = {
				nil,
				4,
				3,
				4,
				2,
				4,
				3,
				4,
				1,
				1,
				3,
				4
			},
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-153,
						247,
						160.3,
						115.3
					},
					cvs = {
						5
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			},
			live2d = {
				touchs = {
					{
						name = "mune",
						feel = 2,
						rect = {
							-108,
							311,
							200,
							132.7
						},
						cvs = {
							5
						}
					}
				}
			}
		},
		[1532004] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1533005] = {
			faces = {
				nil,
				4,
				3,
				4,
				1,
				4,
				4,
				2,
				4,
				2,
				1,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1524006] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1522007] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1525008] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-133,
						88.8,
						111.4,
						105.5
					},
					cvs = {
						9
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8
				},
				{
					12,
					8
				}
			}
		},
		[1523009] = {
			touchs = {
				{
					name = "bird",
					feel = 2,
					rect = {
						12,
						194,
						283.6,
						234.1
					},
					cvs = {
						5
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1514010] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-73,
						361.2,
						212,
						134.8
					},
					cvs = {
						7
					}
				},
				{
					name = "3",
					feel = 2,
					rect = {
						-56,
						92.8,
						195,
						159.5
					},
					cvs = {
						7
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1511011] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-140,
						339,
						212,
						118
					},
					cvs = {
						4
					}
				},
				{
					name = "2",
					feel = 2,
					rect = {
						-140,
						-192,
						84,
						142.7
					},
					cvs = {
						8
					}
				},
				{
					name = "3",
					feel = 2,
					rect = {
						-7,
						-225.6,
						110.6,
						176.3
					},
					cvs = {
						8
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					5
				},
				{
					5
				},
				{
					9
				},
				{
					12,
					9
				}
			}
		},
		[1513012] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1131006] = {
			faces = {
				nil,
				1,
				3,
				2,
				3,
				4,
				1,
				3,
				2,
				3,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1141007] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-129,
						177,
						212,
						187.9
					},
					cvs = {
						5
					}
				},
				{
					name = "3",
					feel = 2,
					rect = {
						-112,
						-88.9,
						195,
						123.2
					},
					cvs = {
						7
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				10,
				11
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1116008] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-129,
						177,
						212,
						187.9
					},
					cvs = {
						5
					}
				},
				{
					name = "3",
					feel = 2,
					rect = {
						-60.5,
						0,
						121,
						61.6
					},
					cvs = {
						5
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1033004] = {
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-66.2,
						128,
						132.4,
						74.8
					},
					cvs = {
						7
					}
				},
				{
					name = "3",
					feel = 2,
					rect = {
						-66.2,
						-103,
						140.65,
						70
					},
					cvs = {
						7
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			},
			live2d = {
				touchs = {
					{
						name = "bra",
						feel = 2,
						rect = {
							-91.6,
							115.6,
							177,
							110.7
						},
						cvs = {
							7
						}
					}
				}
			}
		},
		[1024005] = {
			faces = {
				nil,
				1,
				4,
				3,
				2,
				4,
				2,
				3,
				2,
				3,
				2,
				4
			},
			touchs = {
				{
					name = "mune",
					feel = 2,
					rect = {
						-144,
						377,
						161.7,
						74.8
					},
					cvs = {
						4
					}
				},
				{
					name = "3",
					feel = 2,
					rect = {
						-94,
						145.4,
						130.9,
						75.6
					},
					cvs = {
						9
					}
				},
				{
					name = "2",
					feel = 2,
					rect = {
						239.4,
						131,
						272.6,
						267
					},
					cvs = {
						8
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					5
				},
				{
					5
				},
				{
					5
				},
				{
					12,
					5
				}
			}
		},
		[1131009] = {
			faces = {
				nil,
				nil,
				1,
				4,
				4,
				2,
				nil,
				3,
				4,
				2,
				4,
				1
			},
			touchs = {
				{
					name = "1",
					feel = 2,
					rect = {
						-85,
						262.1,
						149,
						115.7
					},
					cvs = {
						5
					}
				},
				{
					name = "2",
					feel = 2,
					rect = {
						-63,
						217,
						58,
						38.6
					},
					cvs = {
						6
					}
				},
				{
					name = "3",
					feel = 2,
					rect = {
						136,
						75.4,
						136,
						98.9
					},
					cvs = {
						7
					}
				},
				{
					name = "4",
					feel = 2,
					rect = {
						-168,
						-94,
						191.8,
						100
					},
					cvs = {
						11
					}
				},
				{
					name = "5",
					feel = 2,
					rect = {
						39,
						-331,
						312.4,
						337
					},
					cvs = {
						8
					}
				},
				{
					name = "6",
					feel = 2,
					rect = {
						-389,
						-50.8,
						215.1,
						106.8
					},
					cvs = {
						8
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				10
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					9
				},
				{
					12,
					9
				}
			},
			live2d = {
				touchs = {
					{
						name = "别碰我！",
						feel = 2,
						rect = {
							-96,
							302,
							145.6,
							125.14
						},
						cvs = {
							5
						}
					},
					{
						name = "宣示所有权以后可是要好好负起责任哦？",
						feel = 2,
						rect = {
							-50,
							229,
							104.9,
							65.8
						},
						cvs = {
							6
						}
					},
					{
						name = "不行的哦，没有我的允许可是不能随意触摸的。",
						feel = 2,
						rect = {
							91,
							-21,
							163.7,
							168
						},
						cvs = {
							7
						}
					},
					{
						name = "还真是大胆呢。",
						feel = 2,
						rect = {
							-75,
							78,
							150,
							129.3
						},
						cvs = {
							8
						}
					},
					{
						name = "到此为止吧。",
						feel = 2,
						rect = {
							-24,
							-147,
							101.8,
							200
						},
						cvs = {
							11
						}
					}
				}
			}
		},
		[1246003] = {
			touchs = {
				{
					name = "1",
					feel = 2,
					rect = {
						-31,
						290,
						131.6,
						80.2
					},
					cvs = {
						5,
						9
					}
				},
				{
					name = "2",
					feel = 2,
					rect = {
						124,
						-83,
						88.3,
						141.7
					},
					cvs = {
						5,
						9
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4
				},
				{
					4
				},
				{
					8
				},
				{
					12,
					8
				}
			}
		},
		[1345012] = {
			faces = {
				nil,
				3,
				1,
				2,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1332013] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1311014] = {
			touchs = {
				{
					name = "1",
					feel = 2,
					rect = {
						-196,
						209.6,
						418.3,
						201.6
					},
					cvs = {
						4
					}
				},
				{
					name = "2",
					feel = 2,
					rect = {
						-28,
						-50,
						145.6,
						87
					},
					cvs = {
						11
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10
			},
			times = {
				{
					5
				},
				{
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1441016] = {
			touchs = {
				{
					name = "1",
					feel = 2,
					rect = {
						-119,
						85.7,
						136.9,
						106.9
					},
					cvs = {
						10
					}
				}
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1434017] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1241004] = {
			faces = {
				nil,
				2,
				2,
				1,
				1,
				2,
				4,
				3,
				3,
				2,
				1,
				3
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1542013] = {
			faces = {
				nil,
				1,
				1,
				1,
				4,
				2,
				3,
				1,
				4,
				1,
				1,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1043006] = {
			faces = {
				nil,
				3,
				2,
				1,
				2,
				4,
				3,
				4,
				2,
				1,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1444018] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1336015] = {
			faces = {
				nil,
				1,
				2,
				1,
				1,
				3,
				4,
				4,
				2,
				1,
				3,
				3
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1435019] = {
			faces = {
				nil,
				4,
				4,
				1,
				1,
				1,
				4,
				4,
				2,
				4,
				4,
				3
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1134010] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1126011] = {
			faces = {
				nil,
				2,
				3,
				4,
				1,
				2,
				4,
				1,
				2,
				4,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1112012] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1114013] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1015007] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1245005] = {
			faces = {
				nil,
				1,
				3,
				2,
				2,
				4,
				3,
				3,
				2,
				3,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1346016] = {
			faces = {
				nil,
				3,
				3,
				4,
				2,
				2,
				1,
				1,
				1,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1043008] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1035009] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1036010] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1333017] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1521014] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1122014] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1112015] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1415020] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1544015] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1442021] = {
			faces = {
				nil,
				4,
				4,
				3,
				2,
				1,
				1,
				3,
				2,
				4,
				2,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1031011] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1035012] = {
			faces = {
				nil,
				nil,
				2,
				1,
				3,
				nil,
				1,
				4,
				nil,
				nil,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1032013] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1135016] = {
			faces = {
				nil,
				1,
				3,
				3,
				4,
				2,
				3,
				4,
				3,
				1,
				3,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1324018] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1021014] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1512016] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1316019] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1645001] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1646002] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1636003] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1643004] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1631005] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1626006] = {
			faces = {
				nil,
				nil,
				1,
				3,
				4,
				2,
				1,
				4,
				2,
				4,
				4,
				3
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1623007] = {
			faces = {
				nil,
				nil,
				3,
				3,
				3,
				4,
				3,
				1,
				3,
				3,
				1,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1626008] = {
			faces = {
				nil,
				2,
				2,
				nil,
				1,
				3,
				3,
				3,
				3,
				3,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1734001] = {
			faces = {
				nil,
				1,
				2,
				3,
				2,
				3,
				4,
				4,
				2,
				4,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1733002] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1731003] = {
			faces = {
				nil,
				2,
				2,
				3,
				1,
				4,
				1,
				1,
				1,
				4,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1732004] = {
			faces = {
				nil,
				4,
				1,
				3,
				4,
				3,
				2,
				2,
				3,
				4,
				2,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1734005] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1733006] = {
			faces = {
				nil,
				1,
				2,
				3,
				4,
				1,
				2,
				3,
				4,
				1,
				2,
				3
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1731007] = {
			faces = {
				nil,
				4,
				3,
				4,
				3,
				4,
				1,
				1,
				2,
				2,
				1,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1732008] = {
			faces = {
				nil,
				2,
				3,
				1,
				2,
				3,
				1,
				2,
				3,
				4,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1734009] = {
			faces = {
				nil,
				4,
				4,
				3,
				3,
				4,
				2,
				4,
				4,
				3,
				1,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1733010] = {
			faces = {
				nil,
				4,
				4,
				4,
				2,
				4,
				1,
				4,
				2,
				4,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1731011] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1732012] = {
			faces = {
				nil,
				3,
				3,
				3,
				4,
				4,
				3,
				1,
				2,
				1,
				3,
				3
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1835001] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1836002] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1341020] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1331021] = {
			faces = {
				nil,
				2,
				nil,
				4,
				2,
				nil,
				1,
				nil,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1643009] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1644010] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1635011] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1634012] = {
			faces = {
				nil,
				4,
				3,
				4,
				4,
				4,
				1,
				1,
				4,
				2,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1625013] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1046015] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1032016] = {
			faces = {
				nil,
				3,
				4,
				nil,
				2,
				nil,
				nil,
				2,
				3,
				1,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1436022] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1242006] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1444023] = {
			faces = {
				nil,
				3,
				1,
				4,
				1,
				4,
				4,
				1,
				3,
				1,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1533017] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1543018] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1541019] = {
			faces = {
				nil,
				3,
				2,
				2,
				1,
				4,
				1,
				1,
				3,
				1,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1543020] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1535021] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1941001] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1944002] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1946003] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1943004] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1942005] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1945006] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1136017] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1133018] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1332022] = {
			faces = {
				nil,
				1,
				1,
				3,
				2,
				4,
				2,
				2,
				2,
				4,
				2,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1336023] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1313024] = {
			faces = {
				nil,
				1,
				nil,
				4,
				3,
				1,
				1,
				4,
				2,
				nil,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2136001] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1044017] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1031018] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1024019] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1133019] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1631014] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1326025] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2245001] = {
			faces = {
				nil,
				4,
				4,
				4,
				1,
				4,
				2,
				1,
				4,
				4,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1043020] = {
			faces = {
				nil,
				4,
				4,
				4,
				1,
				4,
				2,
				1,
				4,
				4,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1436024] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1442025] = {
			faces = {
				nil,
				4,
				3,
				1,
				2,
				4,
				3,
				4,
				1,
				4,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1441026] = {
			faces = {
				nil,
				3,
				4,
				1,
				3,
				4,
				4,
				4,
				2,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1445027] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1434028] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1435029] = {
			faces = {
				nil,
				4,
				2,
				2,
				4,
				3,
				1,
				2,
				4,
				1,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1424030] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1421031] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1423032] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1532022] = {
			faces = {
				nil,
				3,
				4,
				1,
				3,
				4,
				4,
				4,
				2,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1621015] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1634016] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1643017] = {
			faces = {
				nil,
				3,
				4,
				1,
				3,
				4,
				4,
				4,
				2,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1632018] = {
			faces = {
				nil,
				2,
				2,
				nil,
				4,
				2,
				nil,
				2,
				3,
				3,
				1,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2346001] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2342002] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2345003] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2344004] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2341005] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1142020] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1143021] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1144022] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1146023] = {
			faces = {
				nil,
				4,
				3,
				2,
				4,
				1,
				3,
				3,
				2,
				4,
				3,
				3
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1135024] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1136025] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1133026] = {
			faces = {
				nil,
				1,
				2,
				1,
				3,
				1,
				2,
				1,
				3,
				1,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1131027] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1141028] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1532023] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1531024] = {
			faces = {
				nil,
				4,
				2,
				1,
				1,
				3,
				4,
				4,
				4,
				3,
				2,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1531025] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2445001] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2443002] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2444003] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2432004] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2545001] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2541002] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2634001] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2641002] = {
			faces = {
				nil,
				1,
				4,
				4,
				3,
				4,
				3,
				4,
				3,
				4,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2648003] = {
			faces = {
				nil,
				3,
				4,
				1,
				3,
				4,
				4,
				4,
				2,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2648004] = {
			faces = {
				nil,
				3,
				4,
				1,
				3,
				4,
				4,
				4,
				2,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2633005] = {
			faces = {
				nil,
				2,
				2,
				4,
				3,
				4,
				4,
				1,
				1,
				1,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2632006] = {
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2744001] = {
			faces = {
				nil,
				2,
				1,
				3,
				4,
				2,
				3,
				4,
				4,
				4,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2742002] = {
			faces = {
				nil,
				4,
				4,
				1,
				1,
				3,
				4,
				4,
				2,
				4,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2741003] = {
			faces = {
				nil,
				3,
				3,
				1,
				1,
				4,
				4,
				4,
				2,
				2,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2845001] = {
			faces = {
				nil,
				4,
				1,
				4,
				2,
				4,
				4,
				4,
				2,
				3,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2843002] = {
			faces = {
				nil,
				1,
				3,
				2,
				2,
				4,
				3,
				3,
				2,
				3,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1046021] = {
			faces = {
				nil,
				1,
				3,
				2,
				2,
				4,
				3,
				3,
				2,
				3,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1044022] = {
			faces = {
				nil,
				4,
				4,
				4,
				1,
				3,
				4,
				3,
				2,
				1,
				4,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1045023] = {
			faces = {
				nil,
				4,
				2,
				4,
				1,
				4,
				4,
				4,
				1,
				4,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1033024] = {
			faces = {
				nil,
				1,
				3,
				2,
				2,
				4,
				3,
				3,
				2,
				3,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1032025] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1241007] = {
			faces = {
				nil,
				4,
				2,
				4,
				1,
				4,
				4,
				4,
				1,
				4,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1246008] = {
			faces = {
				nil,
				1,
				3,
				2,
				2,
				4,
				3,
				3,
				2,
				3,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1245009] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1231010] = {
			faces = {
				nil,
				4,
				2,
				4,
				1,
				4,
				4,
				4,
				1,
				4,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1233011] = {
			faces = {
				nil,
				1,
				3,
				2,
				2,
				4,
				3,
				3,
				2,
				3,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1235012] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2931012] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3041001] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3033002] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3032003] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3021004] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3043005] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3045006] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3034007] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3031008] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3026009] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2936001] = {
			faces = {
				nil,
				1,
				1,
				2,
				4,
				4,
				3,
				4,
				1,
				2,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3145001] = {
			faces = {
				nil,
				4,
				4,
				4,
				1,
				4,
				4,
				4,
				3,
				4,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3144002] = {
			faces = {
				nil,
				2,
				3,
				4,
				4,
				2,
				4,
				4,
				1,
				4,
				4,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3142003] = {
			faces = {
				nil,
				2,
				2,
				4,
				2,
				1,
				1,
				2,
				2,
				2,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3143004] = {
			faces = {
				nil,
				1,
				3,
				4,
				4,
				4,
				4,
				2,
				2,
				4,
				2,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3146005] = {
			faces = {
				nil,
				3,
				nil,
				4,
				4,
				nil,
				4,
				1,
				3,
				3,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1431033] = {
			faces = {
				nil,
				3,
				nil,
				4,
				4,
				nil,
				4,
				1,
				3,
				3,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1432034] = {
			faces = {
				nil,
				3,
				nil,
				4,
				4,
				nil,
				4,
				1,
				3,
				3,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1434035] = {
			faces = {
				nil,
				3,
				nil,
				4,
				4,
				nil,
				4,
				1,
				3,
				3,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1446036] = {
			faces = {
				nil,
				3,
				nil,
				4,
				4,
				nil,
				4,
				1,
				3,
				3,
				4,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1142029] = {
			faces = {
				nil,
				1,
				3,
				4,
				4,
				4,
				4,
				4,
				2,
				4,
				4,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2934002] = {
			faces = {
				nil,
				1,
				3,
				4,
				4,
				4,
				4,
				4,
				2,
				4,
				4,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2648007] = {
			faces = {
				nil,
				1,
				3,
				4,
				4,
				4,
				4,
				4,
				2,
				4,
				4,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2643008] = {
			faces = {
				nil,
				1,
				3,
				4,
				4,
				4,
				4,
				4,
				2,
				4,
				4,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2642009] = {
			faces = {
				nil,
				1,
				3,
				4,
				4,
				4,
				4,
				4,
				2,
				4,
				4,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2636010] = {
			faces = {
				nil,
				1,
				3,
				3,
				4,
				2,
				3,
				4,
				3,
				1,
				3,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1344026] = {
			faces = {
				nil,
				1,
				3,
				3,
				4,
				2,
				3,
				4,
				3,
				1,
				3,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1331027] = {
			faces = {
				nil,
				1,
				3,
				3,
				4,
				2,
				3,
				4,
				3,
				1,
				3,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1446037] = {
			faces = {
				nil,
				1,
				3,
				3,
				4,
				2,
				3,
				4,
				3,
				1,
				3,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1436038] = {
			faces = {
				nil,
				1,
				3,
				3,
				4,
				2,
				3,
				4,
				3,
				1,
				3,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1436039] = {
			faces = {
				nil,
				1,
				3,
				3,
				4,
				2,
				3,
				4,
				3,
				1,
				3,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3031010] = {
			faces = {
				nil,
				1,
				3,
				3,
				4,
				2,
				3,
				4,
				3,
				1,
				3,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2933003] = {
			faces = {
				nil,
				1,
				3,
				3,
				4,
				2,
				3,
				4,
				3,
				1,
				3,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1445040] = {
			faces = {
				nil,
				4,
				3,
				1,
				2,
				4,
				3,
				4,
				1,
				4,
				3,
				4
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2935004] = {
			faces = {
				nil,
				1,
				3,
				3,
				4,
				2,
				3,
				4,
				3,
				1,
				3,
				2
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3245001] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3242002] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1145030] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1136031] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1136032] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2932005] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2628011] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2638012] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1145033] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1344028] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1342029] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1336030] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1331031] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1242013] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1235014] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1233015] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2931006] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1544026] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1044026] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1034027] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1334032] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3046011] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3036012] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[3033013] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[2935007] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1141034] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1142035] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1136036] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1133037] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		},
		[1235016] = {
			faces = {
				nil,
				2,
				4,
				4,
				1,
				4,
				3,
				1,
				3,
				1,
				3,
				1
			},
			actions = {},
			cvs = {
				2,
				3
			},
			highCvs = {
				6,
				7,
				10,
				11
			},
			times = {
				{
					4,
					5
				},
				{
					4,
					5
				},
				{
					8,
					9
				},
				{
					12,
					8,
					9
				}
			}
		}
	}
})
