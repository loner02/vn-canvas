///////////////////////////////////////////////////////////////////////////////
//  This is a set of TEMPLATE FORMS for RPG Mod Pack of VN-CANVAS            //
//  Requires vnmod-rpg-0.6+.                                                 //
//                                                                           //
//  Note that while these forms are part of the RPG Mod Pack, these are      //
//  optional and also user-customizable. Should the user require a different //
//  set of forms, or simply want a different UI appearance, the user is free //
//  to modify, or even not include, this file as he/she sees fit. These are  //
//  added to the engine to serve as sample forms.                            //  
///////////////////////////////////////////////////////////////////////////////

require(["app/vnmod-rpg-data"], function() {

///////////////////////////////////////////////////////////////////////////////
//  !! RPG Forms here !!                                                     //
//  Includes cform custom and cform elements                                 //
///////////////////////////////////////////////////////////////////////////////
RPG_forms = [
	label, "RPG_forms",
	
	//  This is the form that displays the actor stats.
	label, "show_stats",
	set, {_rpg_panel:"stats"},
	box, {show:false},		// hide box if shown
	overlay, {src:"rgba(0,0,0,0.75)", effect:"dissolve"},
	label, "show_stats_window",
	cform, ["stats_window", true,
		button, {name:"Character Stats", x:130, y:20, w:120, h:46, base:"transparent", align:"left"},
		cfelement, {type:"actorPanel", name:"Panel", x:70, y:0},
		button, {name:"Name", x:130, y:60, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"Class", x:130, y:80, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"Level", x:130, y:100, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"Experience", x:130, y:120, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"HP", x:130, y:160, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"SP", x:130, y:180, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"ATK", x:130, y:200, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"DEF", x:130, y:220, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"STR", x:130, y:240, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"AGI", x:130, y:260, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"Physical", x:130, y:300, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"Magical", x:130, y:320, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"Elemental", x:130, y:340, w:360, h:46, base:"transparent", align:"left"},
		
		button, {name:"Equipment", x:360, y:20, w:90, h:46, base:"transparent", align:"left"},
		button, {name:"Weapon", x:360, y:60, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"Shield", x:360, y:80, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"Head", x:360, y:100, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"Body", x:360, y:120, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"Feet", x:360, y:140, w:360, h:46, base:"transparent", align:"left"},
		button, {name:"Accessory", x:360, y:160, w:360, h:46, base:"transparent", align:"left"},
	],
	jump, "$show_stats_window",
	
	//  This is the form that displays the actor equipment
	label, "show_equipment",
	set, {_rpg_panel:"equipment"},
	box, {show:false},		// hide box if shown
	overlay, {src:"rgba(0,0,0,0.75)", effect:"dissolve"},
	label, "show_equipment_window",
	cform, ["equipment_window", true,
		button, {name:"Character Equipment", x:130, y:20, w:160, h:40, base:"transparent", align:"left"},
		cfelement, {type:"actorPanel", name:"Panel", x:70, y:0},
		cfelement, {type:"equipmentPanel", name:"select0", label:"Weapon", eqptype:RPG.vars.RPG_WEAPON, x:130, y:60, showText:true},
		cfelement, {type:"equipmentPanel", name:"select1", label:"Shield", eqptype:RPG.vars.RPG_SHIELD, x:130, y:95, showText:true},
		cfelement, {type:"equipmentPanel", name:"select2", label:"Head", eqptype:RPG.vars.RPG_HEAD, x:130, y:130, showText:true},
		cfelement, {type:"equipmentPanel", name:"select3", label:"Body", eqptype:RPG.vars.RPG_BODY, x:130, y:165, showText:true},
		cfelement, {type:"equipmentPanel", name:"select5", label:"Feet", eqptype:RPG.vars.RPG_FEET, x:130, y:200, showText:true},
		cfelement, {type:"equipmentPanel", name:"select4", label:"Accessory", eqptype:RPG.vars.RPG_ACCESSORY, x:130, y:235, showText:true},
		button, {name:"Equipped items enhance character stats by:", x:130, y:280, w:480, h:40, base:"transparent", align:"left"},
		notepad, {name:"eqpStats", x:130, y:320, w:160, h:150, offset:5, base:"rgba(0,0,0,0.5)", align:"left"},
		notepad, {name:"eqpRes", x:290, y:320, w:160, h:150, offset:5, base:"rgba(0,0,0,0.5)", align:"left"},
	],
	jump, "$show_equipment_window",

	//  This is the form that displays the actor inventory
	label, "show_items",
	set, {_rpg_panel:"items"},
	box, {show:false},		// hide box if shown
	overlay, {src:"rgba(0,0,0,0.75)", effect:"dissolve"},
	label, "show_items_window",
	cform, ["items_window", true,
		cfelement, {type:"inventoryPanel", name:"weapons", x:70, y:20},
		button, {name:"wItem0", x:72, y:60, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_weapon_desc":0}]},
		button, {name:"wItem1", x:72, y:90, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_weapon_desc":1}]},
		button, {name:"wItem2", x:72, y:120, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_weapon_desc":2}]},
		button, {name:"wItem3", x:72, y:150, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_weapon_desc":3}]},
		button, {name:"wItem4", x:72, y:180, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_weapon_desc":4}]},
		button, {name:"wItem5", x:72, y:210, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_weapon_desc":5}]},
		notepad, {name:"wDesc", x:472, y:60, w:226, h:178, offset:24, text:" ", base:"rgba(0,0,0,0.5)", align:"left"},
		//cfelement, {type:"inventoryDesc", name:"wDesc", x:472, y:60, offset:24},
		cfelement, {type:"inventoryPanel", name:"items", x:70, y:240},
		button, {name:"rb_iItem0", x:72, y:280, w:308, h:28, base:"rgba(0,0,0,0.5)", hover:"border", click:"border", align:"left", link:[macro, {"RPG.macro.show_item_desc":0}]},
		button, {name:"rb_iItem1", x:72, y:310, w:308, h:28, base:"rgba(0,0,0,0.5)", hover:"border", click:"border", align:"left", link:[macro, {"RPG.macro.show_item_desc":1}]},
		button, {name:"rb_iItem2", x:72, y:340, w:308, h:28, base:"rgba(0,0,0,0.5)", hover:"border", click:"border", align:"left", link:[macro, {"RPG.macro.show_item_desc":2}]},
		button, {name:"rb_iItem3", x:72, y:370, w:308, h:28, base:"rgba(0,0,0,0.5)", hover:"border", click:"border", align:"left", link:[macro, {"RPG.macro.show_item_desc":3}]},
		button, {name:"rb_iItem4", x:72, y:400, w:308, h:28, base:"rgba(0,0,0,0.5)", hover:"border", click:"border", align:"left", link:[macro, {"RPG.macro.show_item_desc":4}]},
		button, {name:"rb_iItem5", x:72, y:430, w:308, h:28, base:"rgba(0,0,0,0.5)", hover:"border", click:"border", align:"left", link:[macro, {"RPG.macro.show_item_desc":5}]},
		cfelement, {type:"actorPanel", name:"panel0", x:385, y:280, hidden:false},
		cfelement, {type:"actorPanel", name:"panel1", x:425, y:280, hidden:false},
		notepad, {name:"iDesc", x:472, y:280, w:226, h:178, offset:24, text:" ", base:"rgba(0,0,0,0.5)", align:"left"},
		//cfelement, {type:"inventoryDesc", name:"iDesc", x:472, y:280, offset:24},
	],
	jump, "$show_items_window",
	
	//  This is the form that displays the store or inn
	label, "show_store",
	set, {_rpg_store_variance:"random", _rpg_in_store:true},
	box, {show:false},		// hide box if shown
	overlay, {src:"rgba(0,0,0,0.75)", effect:"dissolve"},
	label, "show_store_window",
	cform, ["store_window", true,
		cfelement, {type:"storePanel", name:"store", label:"Vina's Store", x:70, y:20},
		cfelement, {type:"storeItem", name:"str0", x:72, y:100, showText:true, align:"left"},
		cfelement, {type:"storeItem", name:"str1", x:72, y:135, showText:true, align:"left"},
		cfelement, {type:"storeItem", name:"str2", x:72, y:170, showText:true, align:"left"},
		cfelement, {type:"storeItem", name:"str3", x:72, y:205, showText:true, align:"left"},
		cfelement, {type:"storeItem", name:"str4", x:72, y:240, showText:true, align:"left"},
		cfelement, {type:"storeItem", name:"str5", x:72, y:275, showText:true, align:"left"},
		cfelement, {type:"storeItem", name:"str6", x:72, y:310, showText:true, align:"left"},
		cfelement, {type:"storeItem", name:"str7", x:72, y:345, showText:true, align:"left"},
		cfelement, {type:"storeSum", name:"Total:", x:72, y:390, showText:true, align:"left"},
	],
	jump, "$show_store_window",
	
	//  This is the form that displays the actor skill tree	
	label, "show_skills",
	set, {_rpg_panel:"skills"},
	box, {show:false},		// hide box if shown
	overlay, {src:"rgba(0,0,0,0.75)", effect:"dissolve"},
	label, "show_skills_window",
	cform, ["skills_window", true,
		button, {name:"Skills Tree", x:130, y:50, w:480, h:40, base:"transparent", align:"left"},
		button, {name:"points", x:500, y:50, w:40, h:40, base:"rgba(0,0,0,0.5)"},
		button, {name:"Learn?", x:600, y:50, w:100, h:40, base:"rgba(0,0,0,0.5)", hover:"border", link:[macro, "RPG.macro.set_skill"]},
		cfelement, {type:"actorPanel", name:"Panel", x:70, y:0},
		cfelement, {type:"skillsGrid", name:"Grid", x:120, y:90},
		notepad, {name:"Skills", x:500, y:100, w:200, h:360, offset:5, base:"rgba(0,0,0,0.5)", align:"left"},
	],
	jump, "$show_skills_window",

	//  This is the form that displays the quests
	label, "show_quests",
	set, {_rpg_panel:"quests"},
	box, {show:false},		// hide box if shown
	overlay, {src:"rgba(0,0,0,0.75)", effect:"dissolve"},
	label, "show_quests_window",
	cform, ["quests_window", true,
		// we'll be reusing the inventory window to display quests
		cfelement, {type:"inventoryPanel", name:"quests", x:70, y:20},
		button, {name:"qItem0", x:72, y:60, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_quest_desc":0}]},
		button, {name:"qItem1", x:72, y:90, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_quest_desc":1}]},
		button, {name:"qItem2", x:72, y:120, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_quest_desc":2}]},
		button, {name:"qItem3", x:72, y:150, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_quest_desc":3}]},
		button, {name:"qItem4", x:72, y:180, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_quest_desc":4}]},
		button, {name:"qItem5", x:72, y:210, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_quest_desc":5}]},
		button, {name:"qItem6", x:72, y:240, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_quest_desc":6}]},
		button, {name:"qItem7", x:72, y:270, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_quest_desc":7}]},
		button, {name:"qItem8", x:72, y:300, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_quest_desc":8}]},
		button, {name:"qItem9", x:72, y:330, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_quest_desc":9}]},
		button, {name:"qItem10", x:72, y:360, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_quest_desc":10}]},
		button, {name:"qItem11", x:72, y:390, w:398, h:28, base:"rgba(0,0,0,0.5)", hover:"border", align:"left", link:[macro, {"RPG.macro.show_quest_desc":11}]},
		//cfelement, {type:"inventoryDesc", name:"qDesc", x:472, y:60, offset:24},
		notepad, {name:"qDesc", x:472, y:60, w:226, h:358, offset:24, text:" ", base:"rgba(0,0,0,0.5)", align:"left"},
	],
	jump, "$show_quests_window",

	//  This is the form for battle
	label, "show_battle",
	set, {_rpg_panel:"battle", _rpg_in_battle:true},
	box, {show:false},		// hide box if shown
	overlay, {src:"_rpg_battle_back", effect:"fade"},
	label, "show_battle_window",
	cform, ["battle_window", true,
		cfelement, {type:"actorPanel", name:"Panel", x:70, y:0},
		cfelement, {type:"battlerIcon", name:"pBattler0", x:130, y:100},
		cfelement, {type:"battlerIcon", name:"pBattler1", x:180, y:150},
		cfelement, {type:"battlerIcon", name:"pBattler2", x:130, y:200},
		cfelement, {type:"battlerIcon", name:"pBattler3", x:180, y:250},
		cfelement, {type:"battlerIcon", name:"pBattler4", x:130, y:300},
		cfelement, {type:"battlerIcon", name:"eBattler0", x:640, y:100},
		cfelement, {type:"battlerIcon", name:"eBattler1", x:590, y:150},
		cfelement, {type:"battlerIcon", name:"eBattler2", x:640, y:200},
		cfelement, {type:"battlerIcon", name:"eBattler3", x:590, y:250},
		cfelement, {type:"battlerIcon", name:"eBattler4", x:640, y:300},
		button, {name:"pSprite", x:240, y:100, base:"demo/dummy.png", scale:[0.6,0.6], showText:false},
		button, {name:"eSprite", x:420, y:100, base:"demo/dummy.png", scale:[0.6,0.6], showText:false},
		cfelement, {type:"alertBox", name:"pHP", x:320, y:100, w:80, h:30, base:"rgba(255,0,0,0.5)"},
		cfelement, {type:"alertBox", name:"pSP", x:320, y:130, w:80, h:30, base:"rgba(0,0,255,0.5)"},
		cfelement, {type:"alertBox", name:"pStatus", x:320, y:160, w:80, h:30, base:"rgba(255,0,255,0.5)"},
		cfelement, {type:"alertBox", name:"eHP", x:420, y:100, w:80, h:30, base:"rgba(255,0,0,0.5)"},
		cfelement, {type:"alertBox", name:"eSP", x:420, y:130, w:80, h:30, base:"rgba(0,0,255,0.5)"},
		cfelement, {type:"alertBox", name:"eStatus", x:420, y:160, w:80, h:30, base:"rgba(255,0,255,0.5)"},
		cfelement, {type:"alertBox", name:"btlMsg", x:180, y:10, w:360, h:40, base:"rgba(0,96,0,0.5)"},
		cfelement, {type:"itemSelector", name:"selector", x:370, y:215, hidden:true},
		button, {name:"bOrder", x:130, y:430, w:560, h:40, base:"rgba(0,0,0,0.5)", align:"left", hidden:true},
		button, {name:"radio_pSkill", x:300, y:300, w:40, h:40, base:"demo/icon_skl.png", hover:"demo/icon_skl_back.png", click:"demo/icon_skl_back.png",
			showText:false, link:[macro, {"RPG.macro.do_battler_action":RPG.vars.RPG_ACTION_SKL}], tip:"Attack with skills", hidden:true},
		button, {name:"radio_pAttack", x:240, y:300, w:40, h:40, base:"demo/icon_atk.png", hover:"demo/icon_atk_back.png", click:"demo/icon_atk_back.png",
			showText:false, link:[macro, {"RPG.macro.do_battler_action":RPG.vars.RPG_ACTION_ATK}], tip:"Attack with weapons", hidden:true},
		button, {name:"radio_pDefend", x:300, y:360, w:40, h:40, base:"demo/icon_def.png", hover:"demo/icon_def_back.png", click:"demo/icon_def_back.png",
			showText:false, link:[macro, {"RPG.macro.do_battler_action":RPG.vars.RPG_ACTION_DEF}], tip:"Defend", hidden:true},
		button, {name:"radio_pItem", x:240, y:360, w:40, h:40, base:"demo/icon_itm.png", hover:"demo/icon_itm_back.png", click:"demo/icon_itm_back.png",
			showText:false, link:[macro, {"RPG.macro.do_battler_action":RPG.vars.RPG_ACTION_ITM}], tip:"Use items in inventory", hidden:true},
		button, {name:"fight", x:360, y:200, base:"demo/btn_fight.png", hover:"demo/btn_fight_back.png", click:"demo/btn_fight_back.png",
			showText:false, link:[macro, "RPG.macro.init_battle"], tip:"Are you ready to fight?"},
		button, {name:"action", x:411, y:200, base:"demo/btn_action.png", hover:"demo/btn_action_back.png", click:"demo/btn_action_back.png",
			showText:false, link:[macro, "RPG.macro.do_selected_action"], tip:"Do selected action", hidden:true},	
		button, {name:"again", x:359, y:200, base:"demo/btn_again.png", hover:"demo/btn_again_back.png", click:"demo/btn_again_back.png",
			showText:false, link:[macro, "RPG.macro.unselect_action"], tip:"Choose another action", hidden:true},	
		button, {name:"win", x:360, y:200, base:"demo/btn_win.png", hover:"demo/btn_win_back.png", click:"demo/btn_win_back.png",
			showText:false, link:[macro, "RPG.macro.end_battle"], tip:"Congratulations! You won!", hidden:true},
		button, {name:"lose", x:360, y:200, base:"demo/btn_lose.png", hover:"demo/btn_lose_back.png", click:"demo/btn_lose_back.png",
			showText:false, link:[macro, "RPG.macro.end_battle"], tip:"Pathetic! You lost!", hidden:true},
	],
	jump, "$show_battle_window",

	label, "hide_forms",
	cform, "close",
	overlay, {show:false, effect:"fade"},
	macro, "RPG.macro.rpg_return",
];

//  This is the alert box, which displays messages at the top of the screen
//  for 3 seconds. This was instantiated on the HUD.
CformElements.alertBox = {
  _init: (obj, param) => {
	let rect = new Rect(param.x, param.y, param.w, param.h);
	let sprites = ["transparent", (param.base) ? param.base : "rgba(0,0,0,0.75)"];	// hidden, shown
	obj.Create(param.name, rect, sprites);
	obj.showText = false;
	obj.aTimerOn = false;
	obj.aTimer = null;
	//if (param.align) obj.align = param.align;
  },
  _update: (obj, elapsed) => {
	let startTimer = false;
	if ((!obj.aTimerOn) && (obj.showText)) {
		startTimer = true;
	}
	else if ((obj.aTimerOn) && (obj.oldText != obj.text)) {
		clearTimeout(obj.aTimer);
		startTimer = true;
	}
	if (startTimer) {
		obj.oldText = obj.text;
		obj.aTimer = setTimeout(() => {
			obj.redraw = true;
			obj.text = "";
			obj.oldText = "";
			obj.showText = false;
			if (obj.visible) obj.aTimerOn = false;
		}, RPG.vars.RPG_TIMEOUT);	// show dialog for 2.5 sec
		obj.aTimerOn = true;
	}
  },
  _draw: (obj) => {
	obj.drawImageOrFill(obj.showText?obj.sprites[1]:obj.sprites[0]);
  },
};

// This is the watchdog object, that monitors Stage 'hang' status
CformElements.watchDog = {
  _init: (obj, param) => {
	// TODO: is creating a dummy object needed?
	let rect = new Rect(-10, -10, 1, 1);
	let sprites = ["transparent"];
	obj.Create(param.name, rect, sprites);
	obj.showText = false;
  },
  _update: (obj, elapsed) => {
	let hud = Stage.layers.gui.get('hud_menu');
	let popup = Stage.layers.gui.get('hud_popup');
	// TODO: what other cases, eg. store, battle
	if (!hud.hidden && popup.hidden && Stage.capture)
		Stage.capture = false;
  },
  _draw: (obj) => {
	// do nothing
  },
};
  
// This is a cform element to create multiple floating dialog boxes
// TODO: Currently unused, fix this
CformElements.floating_dialog = {
  _init: (obj, param) => {
	// define the avatar box
	let rect = new Rect(param.pos=="left"? param.x:param.x+param.w-20, param.y, 100, 100);
	let sprites = ["gray"];
	obj.Create(param.name, rect, sprites);
	obj.showText = false;
	obj.show = param.show;
	obj.pos = param.pos;
	
	// define the dialog box
	//notepad, {name:"Skills", x:500, y:100, w:200, h:360, offset:5, base:"rgba(0,0,0,0.5)", align:"left"},
	let bparam = {name:"box_"+param.name, 
					x:(param.pos=="left"?param.x+120:Stage.canvas.width-param.w-20), 
					y:param.y, w:param.w-120, h:param.h,
					offset:24, text:" ",					
					base:"transparent", align:"left"};	// change base if you want different color or image for dialog back
	obj.box = new Textarea(bparam);
	obj.box.group = "HUD";
	obj.box.showText = false;
	obj.autotype = Config.boxAutotype;
	obj.autotypeCount = 0;
	obj.autotypeMax = 65536;
	obj.autotypeLength = obj.autoypeMax;
	obj.box.textChanged = false;
	Stage.layers.gui.set(bparam.name, obj.box);
  },
  _update: (obj, elapsed) => {
	/*  
	if (obj.box.textChanged) {
		if (obj.autotypeCount >= obj.autotypeLength) {
			obj.autotypeCount = 0;
			obj.autotypeLength = obj.autotypeMax;
			obj.box.textChanged = false;
		}
		else {
			obj.autotypeCount += Config.boxAutotypeSpeed*elapsed/16;
			obj.redraw = true;
		}
	}
	*/ 
  },
  _createBalloon: function (obj, x, y, w, h, r, ptr) {
	let colback = w3color("#000000"), colline = w3color("#FFFFFF");
	var r_offset = (ptr=="right")?20:0;
	var l_offset = (ptr=="left")?20:0;
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	obj.glBack.beginFill(colback.toVal(), 0.5);
	obj.glBack.lineStyle(2,colline.toVal(),1);
	obj.glBack.moveTo(x+r, y);
	obj.glBack.lineTo(w-r, y);
	obj.glBack.quadraticCurveTo(w, y, w, y+r);
	if (ptr == "right") {
		obj.glBack.lineTo(w, h/4);
		obj.glBack.lineTo(w+r_offset, 3*h/8);
		obj.glBack.lineTo(w, h/2);
	}
	obj.glBack.lineTo(w, h-r);
	obj.glBack.quadraticCurveTo(w, h, w-r, h);
	obj.glBack.lineTo(x+r, h);
	obj.glBack.quadraticCurveTo(x, h, x, h-r);
	if (ptr == "left") {
		obj.glBack.lineTo(x, h/2);
		obj.glBack.lineTo(x-l_offset, 3*h/8);
		obj.glBack.lineTo(x, h/4);		
	}
	obj.glBack.lineTo(x, y+r);
	obj.glBack.quadraticCurveTo(x, y, x+r, y);
	obj.glBack.endFill();
  },  
  _draw: function(obj) {	// do not use fat-arrow
	if (!obj.show) {
		obj.box.glBack.clear();
		obj.glSprite.alpha = 0;
		obj.glBack.alpha = 0;
		return;
	}
	// draw avatar
	obj.drawImageOrFill(obj.sprites[0]);
	this._createBalloon(obj.box, 0, 0, obj.box.rect.w, obj.box.rect.h, 10, obj.pos);
  },
};

//  This is the custom actor panel display. It dynamically adds clickable
//  buttons according to active actors, and updates the stats display
//  depending on which actor was selected.
CformElements.actorPanel = {
  _init: (obj, param) => {
	let activeList = RPG.methods.getActive();
	let panel = Helper.getValue("_rpg_panel");
	let items_panel = (panel == "items");
	let battle_panel = (panel == "battle");
	let frames = (items_panel) ? ["demo/rpgback2.png"] : ["demo/rpgback.png"];
	for (let i in activeList) {
		if (items_panel && (param.name=="panel0") && (i>=4)) break;
		if (items_panel && (param.name=="panel1") && (i<4)) break;
		// add active actors to frames
		frames.push(activeList[i].avatars["base"].src);
	}
	obj.Create(param.name, 
			   {x:param.x, y:param.y, w:param.w, h:param.h},
			   frames);
	obj.showText = false;
	obj.inputFocus = true;
	obj.selected = -1;
	obj.hidden = (param.hidden !== undefined)?param.hidden:false;
	obj.added = false;
	obj.addLinks = false;	
  },
  _update: function(obj, elapsed) {	// do not use fat-arrow
	if (!obj.added) {
		obj.added = obj.addObjectsToFrames();
		if (!obj.added) return;

		// dynamically add actor links after panel has been created
		if (!obj.addLinks) {
			let activeList = RPG.methods.getActive();
			let panel = Helper.getValue("_rpg_panel");
			let items_panel = (panel == "items");
			let battle_panel = (panel == "battle");
			for (let i in activeList) {
				if (items_panel && (obj.id=="panel0") && (i>=4)) break;
				if (items_panel && (obj.id=="panel1") && (i<4)) break;
		
				let bparam = {name:"btn"+activeList[i].id, 
							 x:obj.rect.x, 
							 y:(!items_panel)?obj.rect.y+58+38*i:obj.rect.y+38*i, 
							 w:40, h:38,
							 showText:false, base:"transparent", hover:"border",
							 hidden:obj.hidden,
							 link:[macro, {"RPG.macro.rpg_actor_select":i}]};
				let bt = new Button(bparam);
				if (panel == "stats")
					bt.group = "stats_window";
				else if (panel == "equipment") 
					bt.group = "equipment_window";
				else if (panel == "items")
					bt.group = "items_window";
				else if (panel == "skills")
					bt.group = "skills_window";
				else if (panel == "battle")
					bt.group = "battle_window";
				Stage.layers.gui.set("btn"+activeList[i].id, bt);
			}
			obj.addLinks = true;
		}
	}
    // Update stats display depending on actor thumbnail selected
	let current_actor = RPG.vars.RPG_ACTOR_SELECT;
	if (obj.selected != current_actor) {
		// update displayed stats one at a time
		let actor = RPG.methods.getActorFromIndex(current_actor);
		let panel = Helper.getValue("_rpg_panel");
		if (panel == "stats") {
			this._displayAttr("Name", actor.id);
			this._displayAttr("Class", actor.stats.class.name);
			this._displayAttr("Level", actor.stats.level);
			this._displayAttr("Experience", actor.stats.exp+" / "+actor.stats.class.cls_exp);
			this._displayAttr("HP", actor.stats.battle.cls_hp+" / "+actor.stats.class.cls_hp);
			this._displayAttr("SP", actor.stats.battle.cls_sp+" / "+actor.stats.class.cls_sp);
			this._displayAttr("ATK", actor.stats.battle.cls_atk+" / "+actor.stats.class.cls_atk);
			this._displayAttr("DEF", actor.stats.battle.cls_def+" / "+actor.stats.class.cls_def);
			this._displayAttr("AGI", actor.stats.battle.cls_agi+" / "+actor.stats.class.cls_agi);
			this._displayAttr("STR", actor.stats.battle.cls_str+" / "+actor.stats.class.cls_str);
			this._displayAttr("Physical", this._classifyAttr(actor.stats.battle.res_phy));
			this._displayAttr("Magical", this._classifyAttr(actor.stats.battle.res_magic));
			this._displayAttr("Elemental", this._classifyAttr(actor.stats.battle.res_elem));
			
			this._displayAttr("Weapon", RPG.Equipment[actor.stats.eqp[0]].name);
			this._displayAttr("Shield", RPG.Equipment[actor.stats.eqp[1]].name);
			this._displayAttr("Head", RPG.Equipment[actor.stats.eqp[2]].name);
			this._displayAttr("Body", RPG.Equipment[actor.stats.eqp[3]].name);
			this._displayAttr("Feet", RPG.Equipment[actor.stats.eqp[5]].name);
			this._displayAttr("Accessory", RPG.Equipment[actor.stats.eqp[4]].name);
		}
		if (panel == "equipment") {
			this._displayEquipment("select0", RPG.Equipment[actor.stats.eqp[0]].name);
			this._displayEquipment("select1", RPG.Equipment[actor.stats.eqp[1]].name);
			this._displayEquipment("select2", RPG.Equipment[actor.stats.eqp[2]].name);
			this._displayEquipment("select3", RPG.Equipment[actor.stats.eqp[3]].name);
			this._displayEquipment("select4", RPG.Equipment[actor.stats.eqp[4]].name);
			this._displayEquipment("select5", RPG.Equipment[actor.stats.eqp[5]].name);
			this._showEquipmentStats(actor.stats.eqp);	
		}
		if (panel == "items") {
			RPG.macro.show_item_desc(RPG.vars.RPG_SELECTED);
			if (RPG.vars.RPG_SELECTED < 1) {	// none or gold selected
				let activeList = RPG.methods.getActive();
				for (let i in activeList) {
					Helper.getControl("btn"+activeList[i].id).hidden = true;
					Helper.getControl("btn"+activeList[i].id).redraw = true;
				}	
			}
		}
		if (panel == "skills") {
			// hide all grid first
			for (let i=0; i<RPG.vars.RPG_SKILLS_Y; i++)
				for (let j=0; j<RPG.vars.RPG_SKILLS_X; j++) {
					Helper.getControl("i_"+i+"_"+j).icon = 0;
				}
			let skill_tree = RPG.methods.getClassSkills(actor.stats.class.id);
			RPG.vars.RPG_SKILL_SELECT = null;
			
			for (let i in skill_tree) {
				for (let j in skill_tree[i]) {
					let active = RPG.methods.checkSkillActive(actor.stats.skill, skill_tree[i][j].id);
					let unlocked = RPG.methods.checkSkillUnlocked(actor.stats.skill, skill_tree[i][j].id);
					let button = Helper.getControl("g_"+i+"_"+j);
					let icon = Helper.getControl("i_"+i+"_"+j);
					button.tooltip = skill_tree[i][j].name;
					button.hidden = (unlocked) ? false : true;
					icon.icon = (skill_tree[i][j].icon) ? skill_tree[i][j].icon : 0;
					icon.active = active;
					icon.lock = !unlocked;
					if (icon.icon != 0)
						icon.hidden = false;
				}
			}
			
			let label = "Skills Tree for "+actor.id;
			let pad = 32 - label.length;
			for (let i=0; i<pad; i++) label += " ";
			label += "Skill points:";
			Helper.getControl("Skills").text = "Description";		
			Helper.getControl("Skills Tree").text = label;
			Helper.getControl("Skills Tree").redraw = true;
			Helper.getControl("points").text = actor.stats.skillpts.toString();
			Helper.getControl("points").redraw = true;
			//Helper.getControl("Grid").redraw = true;
		}
		obj.selected = current_actor;
		this.redraw = true;
	}
  },
  // two custom functions for attribute display
  _displayAttr: (ctrl, attr) => { 
	let c = Stage.layers.gui.get(ctrl);
	if (c.group == "stats_window") {
		c.text = ctrl+" : "+attr;
		c.redraw = true;
	}
  },
  _classifyAttr: (attr) => {
	if (attr > 75) return "Extreme";	// Immune
	if (attr > 50) return "Strong";		// Resist
	if (attr > 25) return "Normal";		// Normal
	return "Weak";						// Weak
  },
  // custom function for equipment display
  _displayEquipment: (ctrl, eqp) => {
	let c = Stage.layers.gui.get(ctrl);
	if (c.group == "equipment_window") {
		c.text = eqp;
		c.redraw = true;
	}
  },
  _pp: (i) => { //pretty-print to a 4-character string
	let str = "";
	if (i === undefined) str = "----";
	else {
		str = (i>0) ? ("+"+i.toString()) : i.toString();
		let pad = 4 - str.length;
		let strpad = "";
		for (let i=0; i<pad; i++)
			strpad += " ";
		str = strpad + str;
	}
	return str;
  },
  _showEquipmentStats: function(equipment) {	// do not use fat-arrow
	let estats = RPG.methods.getEquipmentStats(equipment);
	//let stat_str = "STATS               RESISTANCES\n";
	let stat_str = "STATS\n";
	stat_str += "HP:  "+ this._pp(estats.cls_hp)+"\n";
	stat_str += "SP:  "+ this._pp(estats.cls_sp)+"\n";
	stat_str += "ATK: "+ this._pp(estats.cls_atk)+"\n";
	stat_str += "DEF: "+ this._pp(estats.cls_def) + "\n";
	stat_str += "STR: "+ this._pp(estats.cls_str) + "\n";
	stat_str += "AGI: "+ this._pp(estats.cls_agi) + "\n";
	let res_str = "RESISTANCES\n";
	res_str +=    "Physical:  "+ this._pp(estats.res_phy)+"\n";
	res_str +=    "Magical:   "+ this._pp(estats.res_magic)+"\n";
	res_str +=    "Elemental: "+ this._pp(estats.res_elem)+"\n";

	let ctrl = Helper.getControl("eqpStats");
	if (ctrl) {
		ctrl.text = stat_str;
		ctrl.redraw = true;
	}
	ctrl = Helper.getControl("eqpRes");
	if (ctrl) {
		ctrl.text = res_str;
		ctrl.redraw = true;
	}
	return stat_str;		
  },
  _createBorder: (obj, x, y, w, h, color="#FFFFFF") => {
	let col = w3color(color), r=5;
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	obj.glBack.beginFill(col.toVal(), 0);
	obj.glBack.lineStyle(2,col.toVal(),col.opacity);
	obj.glBack.moveTo(x+r, y);
	obj.glBack.lineTo(w-r, y);
	obj.glBack.quadraticCurveTo(w, y, w, y+r);
	obj.glBack.lineTo(w, h-r);
	obj.glBack.quadraticCurveTo(w, h, w-r, h);
	obj.glBack.lineTo(x+r, h);
	obj.glBack.quadraticCurveTo(x, h, x, h-r);
	obj.glBack.lineTo(x, y+r);
	obj.glBack.quadraticCurveTo(x, y, x+r, y);
	obj.glBack.endFill();
  },
  _draw: function (obj) { // do not use fat-arrow
    // Place draw code here
	let items_panel = (Helper.getValue("_rpg_panel") == "items");
	let battle_panel = (Helper.getValue("_rpg_panel") == "battle");
	for (let i in obj.sprites) {
		if (i==0)
			//obj.drawImageOrFill(obj.sprites[i]);
			obj.drawObject(0, obj.rect);
		else {
			if (!obj.hidden) {
				let thumbnail = obj.getObject(i).texture;
				let ht = thumbnail.height * (obj.rect.w-4)/thumbnail.width;
				let y = (!items_panel)?i*(ht+2)+20:(i-1)*(ht+2)+obj.rect.y;
				let wd = (obj.rect.w-8); 
                let tRect = new Rect(obj.rect.x, y, wd, ht);
				obj.drawObject(i, tRect);
				if (!battle_panel) {
					if (RPG.vars.RPG_ACTOR_SELECT != i-1) {
						// dim unselected thumbnail
						let f = new PIXI.filters.ColorMatrixFilter();
						f.greyscale(0.15, false);
						let o = obj.getObject(i);
						obj.getObject(i).filters = [f];	
					}
					else {
						obj.getObject(i).filters = null;
					}
				}
				else {
					if (RPG.vars.RPG_ACTOR_SELECT == i-1)
						this._createBorder(obj, tRect.x, y, tRect.x+obj.rect.w, y+tRect.h, "#FFFFFF");
					else
						this._createBorder(obj, tRect.x, y, tRect.x+obj.rect.w, y+tRect.h, "#000000");
				}
			}
		}
	}
  },
};

// This is the custom equipment panel. It shows the equipment for current actor,
// and allows selection of available/usable equipment. This is tied to current
// inventory, which is composed of items and equipment
CformElements.equipmentPanel = {
  _init: (obj, param) => {
	obj.Create(param.name, 
			   {x:param.x+90, y:param.y, w:240, h:33},
			   ["rgba(0,0,0,0.5)"]);
	// dynamically add selector label and button 
	let bparam = {name:"btn_"+param.name, 
					x:param.x+340, y:param.y, w:40, h:33,
					base:"rgba(0,0,0,0.5)", //hover:"border",
					link:[macro, {"RPG.macro.set_equipment":param.eqptype}]};
	let bt = new Button(bparam);
	bt.group = "equipment_window";
	bt.text = ">>";
	Stage.layers.gui.set("btn"+param.name, bt);

	bparam = {name:param.label,
					 x:param.x, y:param.y, w:360, h:35, 
					 base:"transparent", align:"left"};
	let lbl = new Button(bparam);
	lbl.group = "equipment_window";
	Stage.layers.gui.set(param.label, lbl);
  },
  _update: (obj, elapsed) => {
	//if (obj.text != obj.glText.text) {
	//	obj.glText.text = obj.text;
	//	obj.redraw = true;
	//}
  },
  _draw: (obj) => {
	obj.drawImageOrFill(obj.sprites[0]);
  },
};

//  This is the inventory panel which displays both equipment and items
CformElements.inventoryPanel = {
  _init: (obj, param) => {
	let panel = Helper.getValue("_rpg_panel");
	obj.Create(param.name, 
			   {x:param.x, y:param.y, w:630, h:(panel == "quests")?400:220},
			   ["transparent"]);
	obj.showText = false;
	obj.reset = false;
	// dynamically add prev and next button 
	let bparam = {name:"btn_"+param.name+"_prev", 
					x:param.x, y:param.y, w:50, h:38,
					base:"rgba(32,32,32,0.5)", hover:"border",
					link:[macro, {"RPG.macro.get_prev_inventory":param.name}]};
	let bt = new Button(bparam);
	let btgroup = (panel == "quests") ? "quests_window" : "items_window";
	bt.group = btgroup;
	bt.text = "<<";
	Stage.layers.gui.set("btn_"+param.name+"_prev", bt);
	
	bparam = {name:"btn_"+param.name+"_next", 
					x:param.x+580, y:param.y, w:50, h:38,
					base:"rgba(32,32,32,0.5)", hover:"border",
					link:[macro, {"RPG.macro.get_next_inventory":param.name}]};
	bt = new Button(bparam);
	bt.group = btgroup;
	bt.text = ">>";
	Stage.layers.gui.set("btn_"+param.name+"_next", bt);
	
	// add header
	bparam = {name:"btn_"+param.name+"_header", 
					x:param.x+50, y:param.y, w:530, h:38,
					base:"rgba(32,32,32,0.5)", align:"left"};
	bt = new Button(bparam);
	bt.group = btgroup;
	if (panel == "quests" ) {
		bt.text = " Quest Journal              Status            Description";
		RPG.vars.RPG_QUEST_SELECT = 0;		
	}
	else {
		if (param.name == "weapons") {
			bt.text = " Equipment                  Type  Qty  Eqpd   Description";
			RPG.vars.RPG_WEAPON_SELECT = 0;		
		}
		else {
			bt.text = " Item                       Qty               Description";		
			bparam = {name:"Use?", hover:"border",  
							x:param.x+320, y:param.y, w:70, h:35};
			bparam.link = [macro, "RPG.macro.use_item"];
			let btuse = new Button(bparam);
			btuse.group = "items_window";
			Stage.layers.gui.set("Use?", btuse);
			RPG.vars.RPG_ITEM_SELECT = 0;
			RPG.vars.RPG_SELECTED = -1;
		}
	}
	Stage.layers.gui.set("btn_"+param.name+"_header", bt);
  },
  _pp: (inventory, item) => {	// pretty-print inventory list
	  let str = " ";
	  if ((inventory === undefined) || (inventory[0] === undefined)) return str;
	  str += inventory[0].name;
	  let pad = 34 - str.length;
	  if (pad < 0)
	  	 str = str.substr(0,34);
	  else
	  	for (let i=0; i<pad; i++) str += " ";
	  if (!item) {
		switch (inventory[0].type) {
			case 0: str += "WPN"; break;
			case 1: str += "SHD"; break;
			case 2: str += "HD"; break;
			case 3: str += "BDY"; break;
			case 4: str += "ACC"; break;
			case 5: str += "FT"; break;
			default: str += ""; break;
		}
		pad = 40 - str.length;
		for (let i=0; i<pad; i++) str += " ";
		str += inventory[1];
		pad = 45 - str.length;
		for (let i=0; i<pad; i++) str += " ";
		str += inventory[2];
	  }
	  else {
		str+= inventory[1];  
	  }	  
	  return str;
  },
  _pp2: (quest) => {	// pretty-print quests
	  let str = " ";
	  if ((quest === undefined) || (quest[0] === undefined)) return str;
	  str += quest[0].name;
	  let pad = 34 - str.length;
	  if (pad < 0)
	  	str = str.substr(0,34);
	  else
	  	for (let i=0; i<pad; i++) str += " ";
	  if (quest[2])
	  	str += "Done!";
	  else if (!quest[1])
	  	str += "????";
	  return str;
  },
  _createBorder: (obj, x, y, w, h, r) => {
	let col = w3color("#FFFFFF");
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	obj.glBack.beginFill(col.toVal(), 0);
	obj.glBack.lineStyle(2,col.toVal(),0.5);
	obj.glBack.moveTo(x+r, y);
	obj.glBack.lineTo(w-r, y);
	obj.glBack.quadraticCurveTo(w, y, w, y+r);
	obj.glBack.lineTo(w, h-r);
	obj.glBack.quadraticCurveTo(w, h, w-r, h);
	obj.glBack.lineTo(x+r, h);
	obj.glBack.quadraticCurveTo(x, h, x, h-r);
	obj.glBack.lineTo(x, y+r);
	obj.glBack.quadraticCurveTo(x, y, x+r, y);
	obj.glBack.endFill();
  },    
  _clear: (obj) => {
	if (obj.id == "quests") {
	}
	else if (obj.id == "weapons") {
	}
	else {
		let c = 0;
		for (let i=0; i<RPG.vars.RPG_INVENTORY_ITEMS; i++) {
			c = Helper.getControl("iItem"+i);
			c.reset = true;
			c.redraw = true;
		}
		c = Helper.getControl("iDesc");
		c.text = " ";
		c.redraw = true;
		RPG.vars.RPG_SELECTED = -1;
		let activeList = RPG.methods.getActive();
		for (let i in activeList) {
			c = Helper.getControl("btn"+activeList[i].id);
			c.hidden = true;
			c.redraw = true;
		}	
	}
  },
  _update: function(obj, elapsed) {	// do not use fat-arrow
	if (obj.id == "quests") {
		let i = RPG.vars.RPG_QUEST_SELECT;
		let list = RPG.methods.getQuestList();
		for (let j=i; j<i+RPG.vars.RPG_QUEST_ITEMS; j++) {
			let c = Helper.getControl("qItem"+(j-i));
			c.text = this._pp2(list[j]);
			c.redraw = true;
		}
	}
	else if (obj.id == "weapons") {
		let i = RPG.vars.RPG_WEAPON_SELECT;
		let list = RPG.methods.getInventoryList(RPG.vars.RPG_INVENTORY_TYPE_EQUIP);
		for (let j=i; j<i+RPG.vars.RPG_INVENTORY_ITEMS; j++) {
			let c = Helper.getControl("wItem"+(j-i));
			c.text = this._pp(list[j], false);
			c.redraw = true;
		}	
	}
	else {
		let i = RPG.vars.RPG_ITEM_SELECT;			
		let list = RPG.methods.getInventoryList(RPG.vars.RPG_INVENTORY_TYPE_ITEMS);
		for (let j=i; j<i+RPG.vars.RPG_INVENTORY_ITEMS; j++) {
			let c = Helper.getControl("iItem"+(j-i));
			c.text = this._pp(list[j], true);
			c.redraw = true;
		}
		if (obj.reset) {
			this._clear(obj);
			obj.reset = false;
		}
	}
  },
  _draw: function(obj) { // do not use fat-arrow
	obj.drawImageOrFill(obj.sprites[0]);
	this._createBorder(obj, 0, 0, obj.rect.w, obj.rect.h, 10);
  },
};

//  This is the store panel display. It supports a buy/sell store, an
//  inn or a combination. Note that stores are called from the script lines
//  and not from the dropdown panel.
CformElements.storePanel = {
  _init: (obj, param) => {	  
	obj.Create(param.name, 
			   {x:param.x, y:param.y+40, w:375, h:370},
			   ["transparent"]);
	obj.align = "left";
	obj.store_type = Helper.getValue("_rpg_store_type");
	obj.label = param.label;
	obj.variance = Helper.getValue("_rpg_store_variance")/10;
	obj.sign = (Math.random()>0.5) ? (1) : (-1);
	obj.showText = false;
	RPG.vars.RPG_ITEM_SELECT = 0;

	// add label 
	let bparam = {name:"btn_store_label", 
					x:param.x, y:param.y+40, w:600, h:35,
					base:"transparent", align:"left"};
	let bt = new Button(bparam);
	bt.group = "store_window";
	Stage.layers.gui.set(bparam.name, bt);
	obj.labelbtn = 	Stage.layers.gui.get(bparam.name);
		
	// dynamically add tab buttons
	if (obj.store_type < 2) {
		bparam = {name:"BUY", 
						x:param.x, y:param.y, w:70, h:35,
						base:"rgba(32,32,32,0.5)", hover:"border",						
						link:[macro, {"RPG.macro.show_store_panel":"BUY"}]};
		bt = new Button(bparam);
		bt.group = "store_window";
		bt.on = true;
		Stage.layers.gui.set(bparam.name, bt);
		bparam = {name:"hl_"+bparam.name,
						x:param.x, y:param.y, w:70, h:35, base:"border"};
		bt = new Button(bparam);
		bt.group = "store_window";
		bt.showText = false;
		bt.hidden = false;
		Stage.layers.gui.set(bparam.name, bt);
	
		bparam = {name:"SELL", 
						x:param.x+90, y:param.y, w:70, h:35,
						base:"rgba(32,32,32,0.5)", hover:"border",
						link:[macro, {"RPG.macro.show_store_panel":"SELL"}]};
		bt = new Button(bparam);
		bt.group = "store_window";
		bt.on = false;
		Stage.layers.gui.set(bparam.name, bt);
		bparam = {name:"hl_"+bparam.name,
						x:param.x+90, y:param.y, w:70, h:35, base:"border"};
		bt = new Button(bparam);
		bt.group = "store_window";
		bt.showText = false;
		bt.hidden = true;
		Stage.layers.gui.set(bparam.name, bt);
	}	
	if (obj.store_type > 0) {
		bparam = {name:"RENT a room", 
						x:((obj.store_type == 2)? param.x : param.x+180), y:param.y, w:100, h:35,
						base:"rgba(32,32,32,0.5)", hover:"border",
						link:[macro, {"RPG.macro.show_store_panel":"RENT a room"}]};
		bt = new Button(bparam);
		bt.group = "store_window";
		bt.on = (obj.store_type == 2)? true:false;
		Stage.layers.gui.set(bparam.name, bt);
		bparam = {name:"hl_"+bparam.name,
						x:((obj.store_type == 2)? param.x : param.x+180), y:param.y, w:100, h:35, base:"border"};
		bt = new Button(bparam);
		bt.group = "store_window";
		bt.showText = false;
		bt.hidden = true;
		Stage.layers.gui.set(bparam.name, bt);
	}
	bparam = {name:"LEAVE", 
					x:((obj.store_type == 2)? param.x+120 : param.x+300), y:param.y, w:70, h:35,
					base:"rgba(32,32,32,0.5)", hover:"border",
					link:[macro, {"RPG.macro.show_store_panel":"LEAVE"}]};
	bt = new Button(bparam);
	bt.group = "store_window";
	bt.on = true;
	Stage.layers.gui.set(bparam.name, bt);
				
	// add money button
	bparam = {name:"GOLD", 
					x:param.x+450, y:param.y+40, w:70, h:35,
					base:"rgba(32,32,32,0.5)", align:"right"};
	bt = new Button(bparam);
	bt.group = "store_window";
	Stage.layers.gui.set(bparam.name, bt);
	
	// add action and message button
	bparam = {name:"store_message", 
					x:param.x+400, y:param.y+120, w:240, h:35,
					base:"transparent", align:"left"};
	bt = new Button(bparam);
	bt.group = "store_window";
	Stage.layers.gui.set(bparam.name, bt);
	bparam = {name:"store_action", 
					x:param.x+400, y:param.y+160, w:120, h:35,
					base:Config.activeTheme.menuBase, hover:"border",
					link:[macro, "RPG.macro.store_action"]};
	bt = new Button(bparam);
	bt.group = "store_window";
	Stage.layers.gui.set(bparam.name, bt);
  },
  _pp: (str) => {
	let s = " "+str;
	let pad = 28 - str.length;
	if (pad < 0)
	  	s = s.substr(0,28);
	else
		for (let i=0; i<pad; i++) s += " ";
	return s;
  },
  _pp2:(inventory, index) => {	// pretty-print inventory list
	  let str = " ";
	  if ((inventory === undefined) || (inventory[0] === undefined)) return str;
	  if (inventory[1] - inventory[2] <= 0) return str;
	  if (index >= RPG.vars.RPG_STORE_QTY.length) return str;
	  str += inventory[0].name;
	  let pad = 29 - str.length;
	  if (pad < 0)
	  	 str = str.substr(0,29);
	  else
	  	for (let i=0; i<pad; i++) str += " ";
	  str += RPG.vars.RPG_STORE_QTY[index][0];
	  //pad = 34 - str.length;
  	  //for (var i=0; i<pad; i++) str += " ";
	  //str += RPG.vars.RPG_STORE_QTY[index][1];
	  return str;
  },
  _createBorder: (obj, x, y, w, h, r) => {
	let col = w3color("#FFFFFF");
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	obj.glBack.beginFill(col.toVal(), 0);
	obj.glBack.lineStyle(2,col.toVal(),0.5);
	obj.glBack.moveTo(x+r, y);
	obj.glBack.lineTo(w-r, y);
	obj.glBack.quadraticCurveTo(w, y, w, y+r);
	obj.glBack.lineTo(w, h);
	obj.glBack.lineTo(x, h);
	obj.glBack.lineTo(x, y+r);
	obj.glBack.quadraticCurveTo(x, y, x+r, y);
	obj.glBack.moveTo(x, y+38);
	obj.glBack.lineTo(w, y+38);
	obj.glBack.moveTo(x, h-42);
	obj.glBack.lineTo(w, h-42);
	obj.glBack.endFill();
  },      
  _update: function(obj, elapsed) {		// do not use fat-arrow
	  if (Helper.getControl("BUY").on) {
		obj.labelbtn.text = this._pp(obj.label)+"Cost       Qty     You have          G";
		let i = RPG.vars.RPG_ITEM_SELECT;
		if (RPG.vars.RPG_STORE_QTY.length == 0) {
			let list = Helper.getValue("_rpg_store_equip");
			for (let j in list) {
				RPG.vars.RPG_STORE_QTY.push([Math.floor(RPG.Equipment[list[j]].cost * (1+obj.variance)), 0,
												 list[j], 0, 9999]);	// store has unlimited stocks
			}
			list = Helper.getValue("_rpg_store_items");
			for (let j in list) {
				RPG.vars.RPG_STORE_QTY.push([Math.floor(RPG.Items[list[j]].cost * (1+obj.variance)), 0,
												 list[j], 1, 9999]);	// store has unlimited stocks
			}
		}  
		for (let j=i; j<i+RPG.vars.RPG_STORE_ITEMS; j++) {
			let item;
			if (j < RPG.vars.RPG_STORE_QTY.length) 
				item = RPG.methods.getBaseItem(RPG.vars.RPG_STORE_QTY[j][3],RPG.vars.RPG_STORE_QTY[j][2]);
			let c = Helper.getControl("str"+(j-i));
			c.text = this._pp2(item, j);
			c.redraw = true;
		}	
		Helper.getControl("GOLD").text = RPG.methods.updateGold(0);
		Helper.getControl("GOLD").redraw = true;
		Helper.getControl("store_message").text = RPG.vars.RPG_STORE_MSG;
		Helper.getControl("store_message").redraw = true;
		Helper.getControl("store_action").text = "Buy now!";
		Helper.getControl("store_action").redraw = true;
	  }
	  else if (Helper.getControl("SELL").on) {
		obj.labelbtn.text = this._pp("Inventory")+"Price      Qty     You have          G";  
		let i = RPG.vars.RPG_ITEM_SELECT;
		let list = RPG.methods.getInventoryList(RPG.vars.RPG_INVENTORY_TYPE_EQUIP).concat(RPG.methods.getInventoryList(1, true));
		let eqp_count = RPG.methods.getInventoryList(RPG.vars.RPG_INVENTORY_TYPE_EQUIP).length;
		if (RPG.vars.RPG_STORE_QTY.length == 0) { // initialize it once
			for (let j in list) {
				let count = list[j][1] - list[j][2];
				if (count > 0)
					RPG.vars.RPG_STORE_QTY.push([Math.floor((list[j][0].cost * (1-obj.variance))), 0,
												list[j][0].id, (j<eqp_count)?0:1, list[j][1] - list[j][2], ]);
			}
		}
		for (let j=i; j<i+RPG.vars.RPG_STORE_ITEMS; j++) {
			let item;
			if (j < RPG.vars.RPG_STORE_QTY.length) 
				item = RPG.methods.getInventoryItem(RPG.vars.RPG_STORE_QTY[j][3],RPG.vars.RPG_STORE_QTY[j][2]);
			let c = Helper.getControl("str"+(j-i));
			c.text = this._pp2(item, j);
			c.redraw = true;
		}	
		Helper.getControl("GOLD").text = RPG.methods.updateGold(0);
		Helper.getControl("GOLD").redraw = true;
		Helper.getControl("store_message").text = RPG.vars.RPG_STORE_MSG;
		Helper.getControl("store_message").redraw = true;
		Helper.getControl("store_action").text = "Sell it!";
		Helper.getControl("store_action").redraw = true;
	  }
	  else if (Helper.getControl("RENT a room").on) {
		obj.labelbtn.text = this._pp("Room Type")+"Rates      Qty     You have          G";  
		let i = RPG.vars.RPG_ITEM_SELECT;
		if (RPG.vars.RPG_STORE_QTY.length == 0) {
			let list = Helper.getValue("_rpg_store_rooms");
			for (let j in list) {
				RPG.vars.RPG_STORE_QTY.push([Math.floor(RPG.Inn[list[j]].cost * (1+obj.sign*obj.variance)), 0,
												 list[j], 0, 9999]);	// inn has unlimited rooms
			}
		}
		for (let j=i; j<i+RPG.vars.RPG_STORE_ITEMS; j++) {
			let item = [];
			if (j < RPG.vars.RPG_STORE_QTY.length) 
				item = [RPG.Inn[RPG.vars.RPG_STORE_QTY[j][2]], 0, -1];
			let c = Helper.getControl("str"+(j-i));
			c.text = this._pp2(item, j);
			c.redraw = true;
		}	
		Helper.getControl("GOLD").text = RPG.methods.updateGold(0);
		Helper.getControl("GOLD").redraw = true;
		Helper.getControl("store_message").text = RPG.vars.RPG_STORE_MSG;
		Helper.getControl("store_message").redraw = true;
		Helper.getControl("store_action").text = "Rent room!";
		Helper.getControl("store_action").redraw = true;
	  }
  },
  _draw: function(obj) {	// do not use fat-arrow
	obj.drawImageOrFill(obj.sprites[0]);
	this._createBorder(obj, 0, 0, obj.rect.w, obj.rect.h, 10);	
	/*
	// add border
	obj.context.globalAlpha = 0.5;
	obj.context.lineWidth = 2;
	obj.context.strokeStyle = "#FFFFFF";	
	this._createBorder(obj.context, 0, 0, obj.rect.w, obj.rect.h, 10);
	obj.context.stroke();
	*/
  },
};

//  This displays the store item, including quantity, as well as cart items.
CformElements.storeItem = {
  _init: (obj, param) => { 
	obj.Create(param.name, 
			   {x:param.x, y:param.y, w:278, h:33},
			   ["rgba(0,0,0,0.5)"]);
	obj.align = "left";
	obj.showText = true;

	let bparam = {name:"btn_"+param.name+"_num", 
					x:param.x+310, y:param.y, w:40, h:33,
					base:"rgba(32,32,32,0.5)"};
	let bt = new Button(bparam);
	bt.group = "store_window";
	bt.text = "0";
	Stage.layers.gui.set(bparam.name, bt);

	bparam = {name:"btn_"+param.name+"_dec", 
					x:param.x+290, y:param.y, w:20, h:33,
					base:"rgba(32,32,32,0.5)", hover:"border",
					link:[macro, {"RPG.macro.store_dec_item":param.name}]};
	bt = new Button(bparam);
	bt.group = "store_window";
	bt.text = "-";
	Stage.layers.gui.set(bparam.name, bt);
	
	bparam = {name:"btn_"+param.name+"_inc", 
					x:param.x+350, y:param.y, w:20, h:33,
					base:"rgba(32,32,32,0.5)", hover:"border",
					link:[macro, {"RPG.macro.store_inc_item":param.name}]};
	bt = new Button(bparam);
	bt.group = "store_window";
	bt.text = "+";
	Stage.layers.gui.set(bparam.name, bt);
  },
  _update: (obj, elapsed) => {
	  if (obj.text == " ") {
		  Helper.getControl("btn_"+obj.id+"_dec").hidden = true;
		  Helper.getControl("btn_"+obj.id+"_inc").hidden = true;
		  Helper.getControl("btn_"+obj.id+"_num").hidden = true;
	  }
	  else {
		  let i = RPG.vars.RPG_ITEM_SELECT;
		  //var list = RPG.methods.getInventoryList(0).concat(RPG.methods.getInventoryList(1, true));
		  let offset = parseInt(obj.id.replace(/str/g,""));
		  if ((RPG.vars.RPG_STORE_QTY.length > 0) && (i+offset < RPG.vars.RPG_STORE_QTY.length))
		  	Helper.getControl("btn_"+obj.id+"_num").text = RPG.vars.RPG_STORE_QTY[i+offset][1].toString();
		  
		  Helper.getControl("btn_"+obj.id+"_dec").hidden = false;
		  Helper.getControl("btn_"+obj.id+"_inc").hidden = false;
		  Helper.getControl("btn_"+obj.id+"_num").hidden = false;		  
	  }
	  Helper.getControl("btn_"+obj.id+"_dec").redraw = true;
	  Helper.getControl("btn_"+obj.id+"_inc").redraw = true;
	  Helper.getControl("btn_"+obj.id+"_num").redraw = true;
  },
  _draw: (obj) => {
	obj.drawImageOrFill(obj.sprites[0]);
  },
};

// This displays the total value in store
CformElements.storeSum = {
  _init: (obj, param) => {
	obj.Create(param.name, 
			   {x:param.x+50, y:param.y, w:278, h:35},
			   ["rgba(0,0,0,0.5)"]);
	obj.align = "left";
	// dynamically add prev and next button 
	let bparam = {name:"btn_"+param.name+"_prev", 
					x:param.x, y:param.y, w:40, h:35,
					base:"rgba(32,32,32,0.5)", hover:"border",
					link:[macro, {"RPG.macro.get_prev_store":param.name}]};
	let bt = new Button(bparam);
	bt.group = "store_window";
	bt.text = "<<";
	Stage.layers.gui.set(bparam.name, bt);
	
	bparam = {name:"btn_"+param.name+"_next", 
					x:param.x+330, y:param.y, w:40, h:35,
					base:"rgba(32,32,32,0.5)", hover:"border",
					link:[macro, {"RPG.macro.get_next_store":param.name}]};
	bt = new Button(bparam);
	bt.group = "store_window";
	bt.text = ">>";
	Stage.layers.gui.set(bparam.name, bt);
  },
  _update: (obj, elapsed) => {
	let total = 0;
	for (let i in RPG.vars.RPG_STORE_QTY) {
		total += (RPG.vars.RPG_STORE_QTY[i][0] * RPG.vars.RPG_STORE_QTY[i][1]);
	}
	obj.text = "Total:                 "+ total;
  },
  _draw: (obj) => {
	obj.drawImageOrFill(obj.sprites[0]);
  },
};

// This is the Skills tree grid. It dynamically adds a X by Y (currently 6x6)
// grid of skills. Each row represents a skill level, up to Y number of skills per level.
CformElements.skillsGrid = {
  _init: (obj, param) => {
	obj.iconset = "demo/IconSet_vxa.png";
	obj.Create(param.name, 
			   {x:param.x, y:param.y, w:400, h:400},
			   ["transparent" , obj.iconset]);
	obj.showText = false;
	// dynamically add grid elements
	let bt, bparam;
	for (let i=0; i<RPG.vars.RPG_SKILLS_Y; i++)
		for (let j=0; j<RPG.vars.RPG_SKILLS_X; j++) {
			bparam = {name:"i_"+i+"_"+j, type:"grid",
					x:param.x+j*60, y:param.y+i*60, w:60, h:60,
					hidden:true,
					link:[macro, {"RPG.macro.show_skill_desc":[i,j]}]};
			bt = new Element(bparam);
			bt.saveparam = bparam;
			bt.iconset = obj.iconset;
			bt.icon = 0;
			bt.active = false;
			bt.lock = false;
			bt.text = "";
			bt.group = "skills_window";
			Stage.layers.gui.set(bparam.name, bt);
		}  
  },
  _update: (obj, elapsed) => {
	// get actor class and skills
	//var index = Helper.getValue("_rpg_actor_select");
	//var actor = RPG.methods.getActorFromIndex(index);	
	//var skills_tree = RPG.methods.getClassSkills(actor.stats.class.id);	
  },
  _draw: (obj) => {
	obj.drawImageOrFill(obj.sprites[0]);
	// update the grid
	for (let i=0; i<RPG.vars.RPG_SKILLS_Y; i++)
		for (let j=0; j<RPG.vars.RPG_SKILLS_X; j++) {
			Helper.getControl("i_"+i+"_"+j).redraw = true;
			Helper.getControl("g_"+i+"_"+j).redraw = true;
		}
	// TODO: draw dependencies
  },
};
// This is the grid element. It adds a clickable button to select the skill
// and an icon to display the skill.
CformElements.grid = {
  _init: (obj, param) => {
	obj.Create(param.name, 
		{x:param.x+10, y:param.y+10, w:param.w-20, h:param.h-20},
		["transparent"]);
	if (param.hidden != null) obj.hidden = param.hidden;
	if (obj.hidden) obj.visible = false;
	// add grid button
	let bparam = {name:param.name.replace("i_", "g_"),
			x:param.x+5, y:param.y+5, w:param.w-10, h:param.h-10,
			base:"transparent", hover:"border", click:Config.activeTheme.menuClick,
			hidden:obj.hidden, showText:false};
	let bt = new Button(bparam);
	bt.group = "skills_window";
	if (param.link != null) bt.link = param.link;
	if (param.tooltip != null) bt.tooltip = param.tip;
	Stage.layers.gui.set(bparam.name, bt);
  },
  _update: (obj, elapsed) => {
	if (obj.icon == 0)
		obj.hidden = true;
	if (obj.hidden || obj.lock )
		Helper.getControl(obj.id.replace("i_", "g_")).hidden = true;
},
  _draw: (obj) => {
	//obj.drawImageOrFill(obj.sprites[0]);
	let texture = Stage.glManager.getTexture(obj.iconset);
	if ((texture != null) && (obj.icon!=0) && !obj.hidden) {
		obj.glSprite.texture = texture.clone();
		obj.glSprite.position.set(obj.rect.x, obj.rect.y);
		obj.glSprite.texture.frame = new PIXI.Rectangle(40*(obj.icon % 16), 40*(Math.floor(obj.icon / 16)), 40, 40)
		obj.glSprite.alpha = 1;
		//obj.glBack.alpha = 0;
		// dim locked skills
		if (obj.lock) {
			let f = new PIXI.filters.ColorMatrixFilter();
			f.greyscale(0.15, false);
			let o = obj.glSprite;
			obj.glSprite.filters = [f];	
		}
		else {
			obj.glSprite.filters = null;	
		}

		let x=obj.rect.x, y=obj.rect.y, r=5, w=obj.rect.w, h=obj.rect.h;
		let col = w3color((!obj.active) ? "#FFFFFF" : "#00FF00");
		//if (obj.lock) obj.glBack.beginFill(w3color("#808080").toVal(), 0.5);
		obj.glBack.lineStyle(2,col.toVal(),1);
		//this.glBack.drawRoundedRect(0, 0, this.rect.w, this.rect.h);
		obj.glBack.moveTo(x+r, y);
		obj.glBack.lineTo(x+w-r, y);
		obj.glBack.quadraticCurveTo(x+w, y, x+w, y+r);
		obj.glBack.lineTo(x+w, y+h-r);
		obj.glBack.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
		obj.glBack.lineTo(x+r, y+h);
		obj.glBack.quadraticCurveTo(x, y+h, x, y+h-r);
		obj.glBack.lineTo(x, y+r);
		obj.glBack.quadraticCurveTo(x, y, x+r, y);
		obj.glBack.endFill();
		obj.glBack.alpha = 1;

	}
  },
};  
// This is the battler icon which shows HP/SP status
CformElements.battlerIcon = {
  _init: (obj, param) => {
	obj.pIndex = (param.name.indexOf("pBattler") != -1) ? param.name.replace("pBattler", "") : -1;
	obj.eIndex = (param.name.indexOf("eBattler") != -1) ? param.name.replace("eBattler", "") : -1;
	obj.Create(param.name, 
		{x:param.x, y:param.y, w:RPG.vars.RPG_BATTLER_ICON, h:RPG.vars.RPG_BATTLER_ICON},
		["rgba(0,0,0,0.5)"]);
	obj.init = true;
	obj.showText = false;
	obj.hpstat = 1.0;
	obj.spstat = 1.0;
	obj.selected = false;
	obj.target = false;
	obj.inactive = false;
	obj.defensive = false;
	// add button
	let bparam = {name:"b_"+param.name,
			x:param.x, y:param.y, w:RPG.vars.RPG_BATTLER_ICON, h:RPG.vars.RPG_BATTLER_ICON,
			base:"transparent", hover:"border", /*click:Config.activeTheme.menuClick,*/
			showText:false};
	let bt = new Button(bparam);
	bt.group = "battle_window";
	if (obj.pIndex != -1)
		bt.link = [macro, {"RPG.macro.battler_select":obj.pIndex}];
	else if (obj.eIndex != -1)
		bt.link = [macro, {"RPG.macro.enemy_select":obj.eIndex}];
	Stage.layers.gui.set(bparam.name, bt);
  },
  _update: (obj, elapsed) => {
	  if (obj.pIndex != -1) {
		  let battler = RPG.methods.getBattlerAtPosition(obj.pIndex);
		  if (battler[0] != -1) {
			  let actor = RPG.methods.getActorFromIndex(battler[0]);
			  obj.hpstat = actor.stats.battle.cls_hp/actor.stats.class.cls_hp;
			  obj.spstat = actor.stats.battle.cls_sp/actor.stats.class.cls_sp;			  
		  }
	  }
	  if (obj.eIndex != -1) {
		  if (obj.init) {
			if (RPG.callback && RPG.callback.updateEnemyIcons)
				RPG.callback.updateEnemyIcons(obj.eIndex);
			obj.init = false;
		  }
		  let enemy = RPG.EBattlers[obj.eIndex];
		  if (enemy[0] != -1) {
			  if (enemy[1] != RPG.vars.RPG_ENEMY_BOSS) {
				  obj.hpstat = enemy[3]/RPG.Enemies[enemy[0]].stats.cls_hp;
				  obj.spstat = enemy[4]/RPG.Enemies[enemy[0]].stats.cls_sp;
			  }
			  else {
				  let boss = RPG.methods.getActorFromId(RPG.Actors[enemy[0]][0]);
				  obj.hpstat = boss.stats.battle.cls_hp/boss.stats.class.cls_hp;
				  obj.spstat = boss.stats.battle.cls_sp/boss.stats.class.cls_sp;
			  }
		  }
	  }
  },
  _createBorder: (obj, x, y, w, h, color="#FFFFFF", cross, shield) => {
	let col = w3color(color);
	let r = 10;
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	obj.glBack.beginFill(col.toVal(), 0);
	obj.glBack.lineStyle(2,col.toVal(),1);
	obj.glBack.moveTo(x+r, y);
	obj.glBack.lineTo(x+w-r, y);
	obj.glBack.quadraticCurveTo(x+w, y, x+w, y+r);
	obj.glBack.lineTo(x+w, y+h-r);
	obj.glBack.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
	obj.glBack.lineTo(x+r, y+h);
	obj.glBack.quadraticCurveTo(x, y+h, x, y+h-r);
	obj.glBack.lineTo(x, y+r);
	obj.glBack.quadraticCurveTo(x, y, x+r, y);
	if (cross) {
		obj.glBack.moveTo(x, y);
		obj.glBack.lineTo(w+x, h+y);
		obj.glBack.moveTo(w+x, y);
		obj.glBack.lineTo(x, h+y);
	}
	else if (shield) {
		obj.glBack.moveTo(x+w/2,y+5);
		obj.glBack.lineTo(x+w-7,y+10);
		obj.glBack.quadraticCurveTo(x+w-7, y+h-7, x+w/2, y+h-7);
		obj.glBack.quadraticCurveTo(x+7, y+h-7, x+7, y+10);
		obj.glBack.lineTo(x+w/2,y+5);		
	}
	obj.glBack.endFill();
	obj.glBack.alpha = 1;
  },
  _createStatLine: (obj, x, y, w, color="#FFFFFF") => {
	let col = w3color(color);
	obj.glBack.beginFill(col.toVal(), 0);
	obj.glBack.lineStyle(4,col.toVal(),1);
	obj.glBack.moveTo(x, y);
	obj.glBack.lineTo(x+w, y);
	obj.glBack.endFill();
	obj.glBack.alpha = 1;
  },
  _overlayIcon: (obj) => {
	if (obj.inactive) {
		// dim inactive
		let f = new PIXI.filters.ColorMatrixFilter();
		let a = new PIXI.filters.AlphaFilter(0.5);
		f.greyscale(0.15, false);
		obj.glSprite.filters = [f, a];	
	}
	else if (obj.defensive) {
		// dim inactive
		let f = new PIXI.filters.ColorMatrixFilter();
		let a = new PIXI.filters.AlphaFilter(0.75);
		f.blackAndWhite(false);
		obj.glSprite.filters = [f, a];	
	}
	else {
		obj.glSprite.filters = null;
	}
  },
  _draw: function(obj) {	// do not use fat-arrow
	// TODO: avatars are 100x100, battler icons are defined by RPG.vars.RPG_BATTLER_ICON 
	if (Helper.checkIfImage(obj.sprites[0])) {
		obj.glBack.clear();
		//let scale = (obj.pIndex != -1) ? 1: RPG.vars.RPG_BATTLER_ICON/100;
		obj.drawImageOrFill(obj.sprites[0], 1);
		let color = "#FFFFFF";
		if (obj.selected) color = "#00FF00";
		else if (obj.target) color = "#FF00FF";
		// TODO: don't know why battler and enemy have different coordinates
		let x=0, y=0
		if (obj.eIndex != -1) {
			x=obj.rect.x;
			y=obj.rect.y;
		}
		this._createBorder(obj,x,y,RPG.vars.RPG_BATTLER_ICON,RPG.vars.RPG_BATTLER_ICON,color,obj.inactive,obj.defensive);
		// HP/SP status
		this._createStatLine(obj,x+2,y+RPG.vars.RPG_BATTLER_ICON+2,obj.hpstat*(RPG.vars.RPG_BATTLER_ICON-4),"#FF0000");
		this._createStatLine(obj,x+2,y+RPG.vars.RPG_BATTLER_ICON+6,obj.spstat*(RPG.vars.RPG_BATTLER_ICON-4),"#0000FF");
		// color overlay depending on status
		this._overlayIcon(obj);
	}
	else 
		obj.drawImageOrFill(obj.sprites[0]);
  },
};

CformElements.itemSelector = {
  _init: (obj, param) => {
	obj.Create(param.name, 
			   {x:param.x, y:param.y, w:160, h:210},
			   ["transparent"]);
	obj.showText = false;
	obj.hidden = param.hidden
	obj.mode = RPG.vars.RPG_CHOOSE_SKILLS;
	// dynamically add prev and next button 
	let bparam = {name:"btn_"+param.name+"_prev", 
					x:param.x, y:param.y, w:38, h:28,
					base:"rgba(32,32,32,0.5)", hover:"border",
					link:[macro, "RPG.macro.get_prev_battle_item"]};
	let bt = new Button(bparam);
	bt.group = "battle_window";
	bt.text = "<<";
	Stage.layers.gui.set(bparam.name, bt);

	bparam = {name:"btn_"+param.name+"_next", 
					x:param.x+122, y:param.y, w:38, h:28,
					base:"rgba(32,32,32,0.5)", hover:"border",
					link:[macro, "RPG.macro.get_next_battle_item"]};
	bt = new Button(bparam);
	bt.group = "battle_window";
	bt.text = ">>";
	Stage.layers.gui.set(bparam.name, bt);
				
	bparam = {name:"btn_"+param.name+"_select", 
					x:param.x+40, y:param.y, w:80, h:28,
					base:"rgba(0,0,0,0.5)"};
	bt = new Button(bparam);
	bt.group = "battle_window";
	bt.text = "Select";
	Stage.layers.gui.set(bparam.name, bt);
				
	// add select items
	for (let i=0; i<RPG.vars.RPG_BATTLE_ITEMS; i++) {
		bparam = {name:"btn_"+param.name+i, 
						x:param.x, y:param.y+(i+1)*30, w:160, h:28,
						base:"rgba(0,0,0,0.5)", align:"left", hover:"border",
						link:[macro, {"RPG.macro.select_battle_item":i}]};
		bt = new Button(bparam);
		bt.group = "battle_window";
		Stage.layers.gui.set(bparam.name, bt);
	}
  },
  _update: (obj, elapsed) => {
	  Helper.getControl("btn_"+obj.id+"_next").hidden = obj.hidden;
	  Helper.getControl("btn_"+obj.id+"_prev").hidden = obj.hidden;
	  Helper.getControl("btn_"+obj.id+"_select").hidden = obj.hidden;
	  for (let i=0; i<RPG.vars.RPG_BATTLE_ITEMS; i++) {
		  Helper.getControl("btn_"+obj.id+i).hidden = obj.hidden;
 	  }
	  if (!obj.hidden) {
		  if (obj.mode == RPG.vars.RPG_CHOOSE_SKILLS) {
			  let list = RPG.methods.getBattlerNonpassiveSkills(RPG.Battlers[RPG.vars.RPG_ATTACKER][0], RPG.vars.RPG_PARTY);
			  let i = RPG.vars.RPG_BSKILL_SELECT;
			  for (let j=i; j<i+RPG.vars.RPG_BATTLE_ITEMS; j++) {
				let item = " ";
				if (j < list.length) item += list[j].name;
				let c = Helper.getControl("btn_"+obj.id+(j-i));
				c.text = item;
				c.redraw = true;
			 } 	 
		  }
		  else { // RPG_CHOOSE_ITEMS
			  let list = RPG.methods.getInventoryList(RPG.vars.RPG_INVENTORY_TYPE_ITEMS, true);
			  let i = RPG.vars.RPG_ITEM_SELECT;
			  for (let j=i; j<i+RPG.vars.RPG_BATTLE_ITEMS; j++) {
				let item = " ";
				if (j < list.length) item += list[j][0].name;
				let c = Helper.getControl("btn_"+obj.id+(j-i));
				c.text = item;
				c.redraw = true;
			 } 	 
		  }
	  }
  },
  _createBorder: (obj, x, y, w, h) => {
	let col = w3color("#FFFFFF"), r=5;
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	obj.glBack.beginFill(col.toVal(), 0);
	obj.glBack.lineStyle(2,col.toVal(),1);
	obj.glBack.moveTo(x+r, y);
	obj.glBack.lineTo(w-r, y);
	obj.glBack.quadraticCurveTo(w, y, w, y+r);
	obj.glBack.lineTo(w, h-r);
	obj.glBack.quadraticCurveTo(w, h, w-r, h);
	obj.glBack.lineTo(x+r, h);
	obj.glBack.quadraticCurveTo(x, h, x, h-r);
	obj.glBack.lineTo(x, y+r);
	obj.glBack.quadraticCurveTo(x, y, x+r, y);
	obj.glBack.endFill();
  },
  _draw: function(obj) { // do not use fat-arrow
	obj.drawImageOrFill(obj.sprites[0]);
	this._createBorder(obj,0,0,160,210);
  },
};

}); //require