///////////////////////////////////////////////////////////////////////////////
//  This is a set of MACROS for RPG Mod Pack of VN-CANVAS                    //
//  Requires vnmod-rpg-0.6+.                                                 //
//                                                                           //
//  These macros are used in conjunction with the RPG forms.                 //
///////////////////////////////////////////////////////////////////////////////

require(["app/vnmod-rpg-data", "app/vnmod-rpg-forms"], function() {

///////////////////////////////////////////////////////////////////////////////
//  !! Macro/callbacks !!                                                    //
///////////////////////////////////////////////////////////////////////////////
RPG.callback = {
	// callback functions are called by rpg core script, usually game dependent,
	// so that's why it's here. However, these are completely optional and if
	// it doesn't exist, will not be called
	showMsg: (msg) => {
		// find alert box
		let alertBox = Stage.layers.gui.get('aBox');
		if (alertBox && (alertBox.group == 'HUD')) {
			alertBox.text = msg;
			alertBox.showText = true;
			alertBox.redraw = true;
		}
	},
	showBattleMsg: (msg) => {
		let c = Helper.getControl("btlMsg");
		c.text = msg;
		c.showText = true; 
		c.redraw = true; 			
	},
	updateBattlerIcons: () => {
		for (let i=0; i<5; i++) {
			let bIcon = Helper.getControl("pBattler"+i)
			let battler = RPG.methods.getBattlerAtPosition(i);
			if (battler[0] == -1) {
				bIcon.sprites[0] = "rgba(0,0,0,0.5)";
				bIcon.redraw = true;
			}
			else {
				let actor = RPG.methods.getActorFromIndex(battler[0]);
				bIcon.sprites[0] = actor.avatars.base.src;
				bIcon.redraw = true;
			}
		}
	},
	updateEnemyIcons: (i) => {
		//for (let i=0; i<5; i++) {
			let eIcon = Helper.getControl("eBattler"+i)
			let enemy = RPG.EBattlers[i];
			if (enemy[0] == -1) {
				eIcon.sprites[0] = "rgba(0,0,0,0.5)";
				eIcon.redraw = true;
			}
			else {
				if (enemy[1] != RPG.vars.RPG_ENEMY_BOSS) {
					eIcon.sprites[0] = RPG.Enemies[enemy[0]].avatar;
					eIcon.redraw = true;
				}
				else {
					let boss = RPG.methods.getActorFromId(RPG.Actors[enemy[0]][0]);
					eIcon.sprites[0] = boss.avatars.base.src;
					eIcon.redraw = true;
				}
			}
		//}
	},
	showEnemySprite: (pos, target) => {
		// load new sprite into loader
		let src = (target) ? RPG.methods.getBattlerSpriteFromIndex(RPG.EBattlers[pos][0], RPG.EBattlers[pos][1]) :
							 RPG.methods.getBattlerSpriteFromIndex(RPG.Order[0][1], RPG.EBattlers[pos][1]);
		Stage.glManager.addQueue([src], true, 
			(resources, init) => {
				let c = Helper.getControl("eSprite");
				c.sprites.base = src;
				c.setTexture(c.sprites.base);
				c.hidden = false;
				c.redraw = true;
			}	
		);
		for (let i=0; i<5; i++) {
			let s = Helper.getControl("eBattler"+i);
			s.target = (target && (pos==i)) ? true : false;
			s.selected = (!target && (pos==i)) ? true : false
			s.redraw = true;
		}
	},
	showBattlerSprite: (pos, target) => {
		let src = (target) ? RPG.methods.getBattlerSpriteFromIndex(RPG.Battlers[pos][0], RPG.vars.RPG_PARTY) :
							 RPG.methods.getBattlerSpriteFromIndex(RPG.Order[0][1], RPG.vars.RPG_PARTY);
		Stage.glManager.addQueue([src], true, 
			(resources, init) => {
				let c = Helper.getControl("pSprite");
				c.sprites.base = src;
				c.setTexture(c.sprites.base);
				c.hidden = false;
				c.redraw = true;
			}	
		);
		for (let i=0; i<5; i++) {
			let s = Helper.getControl("pBattler"+i);
			s.target = (target && (pos==i)) ? true : false;
			s.selected = (!target && (pos==i)) ? true : false
			s.redraw = true;
		}
	},
	showBattlerControls: (pos) => {
		if (RPG.methods.canBattlerAttackAtPosition(pos)) {
			Helper.getControl("radio_pAttack").hidden = false;
			Helper.getControl("radio_pAttack").redraw = true;
		}
		let skills = RPG.methods.getBattlerNonpassiveSkills(RPG.Order[0][1], RPG.vars.RPG_PARTY);
		if (skills.length > 0) {
			Helper.getControl("radio_pSkill").hidden = false;
			Helper.getControl("radio_pSkill").redraw = true;
		}
		let items = RPG.methods.getInventoryList(RPG.vars.RPG_INVENTORY_TYPE_ITEMS, true);
		if (items.length > 0) {
			Helper.getControl("radio_pItem").hidden = false;
			Helper.getControl("radio_pItem").redraw = true;
		}
		Helper.getControl("radio_pDefend").hidden = false;
		Helper.getControl("radio_pDefend").redraw = true;
	},
	showBattlerDefense: (index, on) => {
		if (on) {
			let pos = RPG.methods.getBattlerPosition(index, RPG.vars.RPG_PARTY);
			let c = Helper.getControl("pStatus");
			c.text = RPG.methods.getStatusText(RPG.vars.RPG_DEFENSE);
			c.showText = true;
			c.redraw = true;
			c = Helper.getControl("pBattler"+pos);
			c.defensive = true;
			c.redraw = true;   
		}
		else {
			let pos = RPG.methods.getBattlerPosition(index, RPG.vars.RPG_PARTY);
			let c = Helper.getControl("pBattler"+pos);
			c.defensive = false;
			c.redraw = true;   
		}
	},
	showEnemyDefense: (index, on) => {
		if (on) {
			let pos = RPG.methods.getBattlerPosition(index, RPG.vars.RPG_ENEMY);
			let c = Helper.getControl("eStatus");
			c.text = RPG.methods.getStatusText(RPG.vars.RPG_DEFENSE);
			c.showText = true;
			c.redraw = true;
			c = Helper.getControl("eBattler"+pos);
			c.defensive = true;
			c.redraw = true;   
		}
		else {
			let pos = RPG.methods.getBattlerPosition(index, RPG.vars.RPG_ENEMY);
			c = Helper.getControl("eBattler"+pos);
			c.defensive = false;
			c.redraw = true;   
		}
	},
	showBattlerDamage: (index, damage, status) => {
		if (damage[0] != 0) {
			let c = Helper.getControl("pHP");
			c.text = ((parseInt(damage[0]) > 0) ? "" : "+") + (-1*parseInt(damage[0]));
			c.showText = true; 
			c.redraw = true; 			
		}
		if (damage[1] != 0) {
			let c = Helper.getControl("pSP");
			c.text = ((parseInt(damage[1]) > 0) ? "" : "+") + (-1*parseInt(damage[1]));
			c.showText = true; 
			c.redraw = true; 			
		}
		if (status != RPG.vars.RPG_ACTIVE) {
			let c = Helper.getControl("pStatus");
			c.text = RPG.methods.getStatusText(status);
			c.showText = true;
			c.redraw = true;
			if (status == RPG.vars.RPG_INACTIVE) {
				c = Helper.getControl("pBattler"+index);
				c.inactive = true;
				c.redraw = true; 	
			}		
		}
	},
	showEnemyDamage: (index, damage, status) => {
		if (damage[0] != 0) {
			let c = Helper.getControl("eHP");
			c.text = ((parseInt(damage[0]) > 0) ? "" : "+") + (-1*parseInt(damage[0]));
			c.showText = true; 
			c.redraw = true; 
		}
		if (damage[1] != 0) {
			let c = Helper.getControl("eSP");
			c.text = ((parseInt(damage[1]) > 0) ? "" : "+") + (-1*parseInt(damage[1]));
			c.showText = true; 
			c.redraw = true; 
		}
		if (status != RPG.vars.RPG_ACTIVE) {
			let c = Helper.getControl("eStatus");
			c.text = RPG.methods.getStatusText(status);
			c.showText = true;
			c.redraw = true;
			if (status == RPG.vars.RPG_INACTIVE) {
				c = Helper.getControl("eBattler"+index);
				c.inactive = true;
				c.redraw = true; 	
			}		
		}
	},
	resumeBattle: (timeout) => {
		setTimeout(() => {
			RPG.macro.cleanup_battleground(true);
			RPG.macro.build_battle_order(false);  	  	  			  
			RPG.methods.startBattleLoop();  
		}, timeout);		
	},
	showEnd: (win) => {
		RPG.macro.cleanup_battleground(true);
		let c = Helper.getControl("bOrder");
		c.text = "";
		c.hidden = true;
		c.redraw = true;

		if (win) {
			c = Helper.getControl("win");
			c.hidden = false;
			c.redraw = true;
		}
		else {
			c = Helper.getControl("lose");
			c.hidden = false;
			c.redraw = true;
		}
	}
};

RPG.macro = {  
  rpg_init: () => {
	// didn't want to create a new config file, so just modified it here
	Helper.setValue("actorPerspective", false);
	Helper.setValue("boxAppendOverride", true);
	Helper.setValue("boxAutotype", false);
	Config.activeTheme.formFontStyle = "normal 14px MTR #C0C0C0";
	//Config.activeTheme.formFontStyle = "normal 16px M1m #C0C0C0";
	//Config.activeTheme.formFontStyle = "normal 16px Verdana #C0C0C0";
	Config.activeTheme.menuPrompt = "rgba(96,96,96,0.8)",
	Config.activeTheme.menuBase = "rgba(64,64,64,0.8)",
	
	Helper.updateConfig("activeTheme");
	// as a cheat to preload fontface, an invisible <div> was added in demo-rpg.html

	// BUGFIX: This flag was added here to fix asynchronous loading, where the base Config
	// was created after the RPG flag was set, thereby overwriting the flag.
	Config.modRPG = true;
  },
  rpg_return: () => {
	let in_store = Helper.getValue("_rpg_in_store");
	let in_battle = Helper.getValue("_rpg_in_battle") 
	if (!in_store && !in_battle)
    	Stage.capture = true;
	else {
		if (in_store) Helper.setValue("_rpg_in_store", false);
		if (in_battle) Helper.setValue("_rpg_in_battle", false);
		Stage.capture = false;
	}
    Stage.script.frame -= 2;
    jump('return');
  },
  rpg_actor_select: (param) => {
	RPG.vars.RPG_ACTOR_SELECT = param;
  },
  set_actor_active: (id) => {
	RPG.methods.setActive(id, true);
  },
  set_actor_inactiv: (id) => {
	RPG.methods.setActive(id, false);
  },
  show_menu: () => {
    let c = Helper.getControl("hud_popup");
    if (c.hidden) {
        c.hidden = false;
        Helper.getControl("toggle_stats").hidden = false;
        Helper.getControl("toggle_equipment").hidden = false;
        Helper.getControl("toggle_items").hidden = false;
        Helper.getControl("toggle_skills").hidden = false;
        Helper.getControl("toggle_quests").hidden = false;
        Stage.capture = true;
    }
    else {
        c.hidden = true;
        Helper.getControl("toggle_stats").hidden = true;
        Helper.getControl("toggle_equipment").hidden = true;
        Helper.getControl("toggle_items").hidden = true;
        Helper.getControl("toggle_skills").hidden = true;
        Helper.getControl("toggle_quests").hidden = true;
        Stage.capture = false; 
    }
    c.redraw = true;   
    Helper.getControl("toggle_stats").redraw = true;
    Helper.getControl("toggle_equipment").redraw = true;
    Helper.getControl("toggle_items").redraw = true;
    Helper.getControl("toggle_skills").redraw = true;
    Helper.getControl("toggle_quests").redraw = true;
	
	if (!Stage.capture) return true;
  },
  enable_toggles: (current, enable) => {
	let toggle_list = ["toggle_menu", "toggle_stats", "toggle_equipment", "toggle_items", "toggle_skills", "toggle_quests"];
	let ctrl;
	for (let i in toggle_list) {
		if (toggle_list[i] != current) {
			ctrl = Helper.getControl(toggle_list[i]);
			if (!enable) {
				ctrl.hidden = true;
				ctrl.redraw = true;
			}
			else {
				ctrl.hidden = false;
				ctrl.redraw = true;
			}
		}
	}
  },
  show_stats: () => {
	if (RPG.methods.getActive().length == 0) {
	    if (!Helper.getControl("toggle_stats").on) {
			RPG.callback.showMsg(RPG.vars.RPG_CONST_MSGS[3]);
			Helper.getControl("toggle_stats").reset = true;	
			// reset is undocumented toggle button function
			// use only when we do not want want to set the toggle
			// do not use to unset a toggle button that is ON 
		}
		return;
	}	  
    Stage.capture = false;
    // TODO: hack frames because executing jump here will cause frameStack to point to 
    //      'macro' call, instead of the 'jump' call; 'return' must point to after the 'macro'
    Stage.script.frame -= 2;
    if (!Helper.getControl("toggle_stats").on) {
		RPG.macro.enable_toggles("toggle_stats", false);
        jump("RPG_forms#show_stats");
	}
	else {
		RPG.macro.enable_toggles("toggle_stats", true);
        jump("$RPG_forms#hide_forms");
	}
  },
  show_equipment: () => {
	if (RPG.methods.getActive().length == 0) {
	    if (!Helper.getControl("toggle_equipment").on) {
			RPG.callback.showMsg(RPG.vars.RPG_CONST_MSGS[3]);
			Helper.getControl("toggle_equipment").reset = true;
		}
		return;
	}	  
    Stage.capture = false;
    // TODO: hack frames because executing jump here will cause frameStack to point to 
    //      'macro' call, instead of the 'jump' call; 'return' must point to after the 'macro'
    Stage.script.frame -= 2;
    if (!Helper.getControl("toggle_equipment").on) {
		RPG.macro.enable_toggles("toggle_equipment", false);
        jump("RPG_forms#show_equipment");
	}
    else {
		RPG.macro.enable_toggles("toggle_equipment", true);
        jump("$RPG_forms#hide_forms");	// Not a bug, use same label as stats to jump to
	}
  },
  show_items: () => {
    Stage.capture = false;
    // TODO: hack frames because executing jump here will cause frameStack to point to 
    //      'macro' call, instead of the 'jump' call; 'return' must point to after the 'macro'
    Stage.script.frame -= 2;
    if (!Helper.getControl("toggle_items").on) {
		RPG.macro.enable_toggles("toggle_items", false);
        jump("RPG_forms#show_items");
	}
    else {
		RPG.macro.enable_toggles("toggle_items", true);
        jump("$RPG_forms#hide_forms");	// Not a bug, use same label as stats to jump to
	}
  },
  show_skills: () => {
    Stage.capture = false;
    // TODO: hack frames because executing jump here will cause frameStack to point to 
    //      'macro' call, instead of the 'jump' call; 'return' must point to after the 'macro'
    Stage.script.frame -= 2;
    if (!Helper.getControl("toggle_skills").on) {
		RPG.macro.enable_toggles("toggle_skills", false);
        jump("RPG_forms#show_skills");
	}
    else {
		RPG.macro.enable_toggles("toggle_skills", true);
        jump("$RPG_forms#hide_forms");	// Not a bug, use same label as stats to jump to
	}
  },
  show_quests: () => {
    Stage.capture = false;
    // TODO: hack frames because executing jump here will cause frameStack to point to 
    //      'macro' call, instead of the 'jump' call; 'return' must point to after the 'macro'
    Stage.script.frame -= 2;
    if (!Helper.getControl("toggle_quests").on) {
		RPG.macro.enable_toggles("toggle_quests", false);
        jump("RPG_forms#show_quests");
	}
    else {
		RPG.macro.enable_toggles("toggle_quests", true);
        jump("$RPG_forms#hide_forms");	// Not a bug, use same label as stats to jump to
	}
  },
  set_equipment: (type) => {
	// get actor usable equipment
	let current_actor = RPG.vars.RPG_ACTOR_SELECT;
	let equip_list = RPG.methods.getActorEquipment(current_actor, type);
	
	// get currently equipped
	let equipped = RPG.methods.getActorEquipped(current_actor, type);
	
	// select new equipment 
	let i;
	for (i in equip_list) {
		if (equip_list[i].name == equipped.name) break;
	}
	i = (i < equip_list.length-1) ? parseInt(i)+1 : 0;
	
	// set new equipment
	let new_equipped = RPG.methods.setActorEquipped(current_actor, type, i);
	
	// update equipment display
    let ctrl = Helper.getControl("select"+type);
	ctrl.text = new_equipped.name;
	ctrl.redraw = true;
	// update equipment stats
	ctrl = Helper.getControl("Panel");
	ctrl.selected = -1; //force a character update
	ctrl.redraw = true;	
  },
  get_prev_inventory: (type) => {
	if (type == "quests") {
		let i = RPG.vars.RPG_QUEST_SELECT;
		if (i > 0) {
			RPG.vars.RPG_QUEST_SELECT = i-1;
			Helper.getControl("quests").redraw = true;
		}
	}
	else if (type == "weapons") {
		let i = RPG.vars.RPG_WEAPON_SELECT;
		if (i > 0) {
			RPG.vars.RPG_WEAPON_SELECT = i-1;
			Helper.getControl("weapons").redraw = true;
		}
	}
	else {
		let i = RPG.vars.RPG_ITEM_SELECT;
		if (i > 0) {
			RPG.vars.RPG_ITEM_SELECT = i-1;
			Helper.getControl("items").reset = true;
			Helper.getControl("items").redraw = true;
		}
	}
  },
  get_next_inventory: (type) => {
	if (type == "quests") {
		let i = RPG.vars.RPG_QUEST_SELECT;
		let list = RPG.methods.getQuestList();
		if (i < list.length-RPG.vars.RPG_QUEST_ITEMS) {
			RPG.vars.RPG_QUEST_SELECT = i+1;
			Helper.getControl("quests").redraw = true;
		}
	}
	else if (type == "weapons") {
		let i = RPG.vars.RPG_WEAPON_SELECT;
		let list = RPG.methods.getInventoryList(0);
		if (i < list.length-RPG.vars.RPG_INVENTORY_ITEMS) {
			RPG.vars.RPG_WEAPON_SELECT = i+1;
			Helper.getControl("weapons").redraw = true;
		}
	}
	else {
		let i = RPG.vars.RPG_ITEM_SELECT;
		let list = RPG.methods.getInventoryList(1);
		if (i < list.length-RPG.vars.RPG_INVENTORY_ITEMS) {
			RPG.vars.RPG_ITEM_SELECT = i+1;
			Helper.getControl("items").reset = true;
			Helper.getControl("items").redraw = true;
		}	
	}
  },
  get_next_store: (type) => {
	let i = RPG.vars.RPG_ITEM_SELECT;
	if (i < RPG.vars.RPG_STORE_QTY.length-RPG.vars.RPG_STORE_ITEMS) {
		RPG.vars.RPG_ITEM_SELECT = i+1;
		Helper.getControl("store").redraw = true;
	}
  },
  get_prev_store: (type) => {
	let i = RPG.vars.RPG_ITEM_SELECT;
	if (i > 0) {
		RPG.vars.RPG_ITEM_SELECT = i-1;
		Helper.getControl("store").redraw = true;
	}
  },
  show_weapon_desc: (index) => {
	let list = RPG.methods.getInventoryList(0);
	let i = RPG.vars.RPG_WEAPON_SELECT;
	let c = Helper.getControl("wDesc");
	if (index+i < list.length) {
		c.text = list[index+i][0].name+":\n";
		//Stage.layers[4][c].text += "---------------------------\n";
		c.text += list[index+i][0].description;
	}
	else {
		c.text = " ";
	}
	c.redraw = true;
},
  show_quest_desc: (index) => {
	  let list = RPG.methods.getQuestList();
	  let i = RPG.vars.RPG_QUEST_SELECT;
	  if (index+i < list.length) {
		  let c = Helper.getControl("qDesc");
		  c.text = list[index+i][0].name+":\n";
		  c.text += list[index+i][0].description+"\n";
		  if (list[index+i][0].hint) {
			c.text += "---------------------------\n";
			c.text += "Hint: "+list[index+i][0].hint+"\n";
		  }
		  c.redraw = true;
	  }
  },
  show_item_desc: (index) => {
	if (index < 0) return;
	let list = RPG.methods.getInventoryList(1);
	let i = RPG.vars.RPG_ITEM_SELECT;
	RPG.vars.RPG_SELECTED = index;
	let c = Helper.getControl("iDesc");
	if (index+i < list.length) {
		// show Item
		c.text = list[index+i][0].name+":\n";
		c.text += list[index+i][0].description+"\n";		
		// show Actor stats
		if (index > 0) {	// except GOLD
			c.text += "---------------------------\n";
			let actor = RPG.methods.getActorFromIndex(RPG.vars.RPG_ACTOR_SELECT);
			c.text += "Actor: "+actor.id+"\n";
			for (let j in list[index+i][0]) {
				if (list[index+i][0].hasOwnProperty(j)) {
					if (j.search(/(btl_)/g) != -1) {
						c.text += j.replace("btl_", "").toUpperCase()+": "+
							actor.stats.battle[j.replace("btl", "cls")]+" / "+actor.stats.class[j.replace("btl", "cls")]+"\n";
					}
				}
			}
		}
		c.redraw = true;
		
		// show item actorPanel if cap == 1
		let activeList = RPG.methods.getActive();
		if (list[index+i][0].cap > 0) {
			//Helper.getControl("panel0").hidden = false;
			//Helper.getControl("panel1").hidden = false;
			//Helper.getControl("panel0").redraw = true;
			//Helper.getControl("panel1").redraw = true;			
			for (let i in activeList) {
				Helper.getControl("btn"+activeList[i].id).hidden = false;
				Helper.getControl("btn"+activeList[i].id).redraw = true;
			}
		}
		else {
			//Helper.getControl("panel0").hidden = true;
			//Helper.getControl("panel1").hidden = true;
			//Helper.getControl("panel0").redraw = true;
			//Helper.getControl("panel1").redraw = true;			
			for (let i in activeList) {
				Helper.getControl("btn"+activeList[i].id).hidden = true;
				Helper.getControl("btn"+activeList[i].id).redraw = true;
			}
		}
	}
	else {
		c.text = " ";
		c.redraw = true;
	}
  },
  use_item: () => {
	let i = RPG.vars.RPG_ITEM_SELECT;
	let index = RPG.vars.RPG_SELECTED;
	if (index < 0) return;
	if (index+i <= 0) return;
	
	// TODO: do we have apply-to-all items? 
	let list = RPG.methods.getInventoryList(1);
	let qty = RPG.methods.updateInventory(1, list[index+i][0].id, -1);
	for (let j in list[index+i][0]) {
		if (list[index+i][0].hasOwnProperty(j)) {
			if (j.search(/(btl)/g) != -1) {
				RPG.methods.updateActorBattleStats(RPG.vars.RPG_ACTOR_SELECT, j, -1*list[index+i][0][j]);
				// Note: positive value is a damage, negative is restoration
			}
		}
	}
	if (qty <= 0) {
		RPG.vars.RPG_SELECTED = -1;
		RPG.macro.show_item_desc(0);
	}
	else
		RPG.macro.show_item_desc(index);	  
  },
  show_store: () => {
	// disable dropdown
	let cMenu = Helper.getControl("toggle_menu");
	cMenu.hidden = true;
	cMenu.redraw = true;	
	
    jump("RPG_forms#show_store");
  },
  show_store_panel: (type) => {
	let c = Helper.getControl("store");
	let store_type = c.store_type;
	RPG.vars.RPG_ITEM_SELECT = 0;
	if (type == "BUY") {
		RPG.vars.RPG_STORE_QTY = [];
		RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[4];
		c = Helper.getControl(type);
		c.on = true;
		c.redraw = true;
		Helper.getControl("hl_"+c.id).hidden = false;
		c = Helper.getControl("SELL");
		c.on = false;
		c.redraw = true;
		Helper.getControl("hl_"+c.id).hidden = true;
		if (store_type > 0) {
			c = Helper.getControl("RENT a room");
			c.on = false;
			c.redraw = true;
			Helper.getControl("hl_"+c.id).hidden = true;
		}		
		c = Helper.getControl("store");
		c.redraw = true;
	}
	else if (type == "SELL") {
		RPG.vars.RPG_STORE_QTY = [];
		RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[1];
		c = Helper.getControl(type);
		c.on = true;
		c.redraw = true;
		Helper.getControl("hl_"+c.id).hidden = false;
		c = Helper.getControl("BUY");
		c.on = false;
		c.redraw = true;
		Helper.getControl("hl_"+c.id).hidden = true;
		if (store_type > 0) {
			c = Helper.getControl("RENT a room");
			c.on = false;
			c.redraw = true;
			Helper.getControl("hl_"+c.id).hidden = true;
		}		
		c = Helper.getControl("store");
		c.redraw = true;
	}
	else if (type == "RENT a room") {
		RPG.vars.RPG_STORE_QTY = [];
		RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[6];
		c = Helper.getControl(type);
		c.on = true;
		c.redraw = true;
		Helper.getControl("hl_"+c.id).hidden = false;
		if (store_type < 2) {
			c = Helper.getControl("SELL");
			c.on = false;
			c.redraw = true;
			Helper.getControl("hl_"+c.id).hidden = true;
			c = Helper.getControl("BUY");
			c.on = false;
			c.redraw = true;
			Helper.getControl("hl_"+c.id).hidden = true;
		}		
		c = Helper.getControl("store");
		c.redraw = true;
	}
	else {
		// enable dropdown
		let cMenu = Helper.getControl("toggle_menu");
		cMenu.hidden = false;
		cMenu.redraw = true;	
		
        jump("$RPG_forms#hide_forms");	// Not a bug, use same label as stats to jump to
	}
  },
  store_inc_item: (id) => {
	let i = RPG.vars.RPG_ITEM_SELECT;
    //var list = RPG.methods.getInventoryList(0).concat(RPG.methods.getInventoryList(1, true));
	let offset = parseInt(id.replace(/str/g,""));
	let qty = RPG.vars.RPG_STORE_QTY[i+offset][1];
	let avail = RPG.vars.RPG_STORE_QTY[i+offset][4];
	//if (qty < list[i+offset][1] - list[i+offset][2]) {
	if (qty < avail) {
		if (Helper.getControl("BUY").on)
			RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[4];
		else if (Helper.getControl("SELL").on)
			RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[1];
		RPG.vars.RPG_STORE_QTY[i+offset][1] += 1;
		Helper.getControl("store").redraw = true;
	}
  },
  store_dec_item: (id) => {
	let i = RPG.vars.RPG_ITEM_SELECT;
	let offset = parseInt(id.replace(/str/g,""));
	let qty = RPG.vars.RPG_STORE_QTY[i+offset][1];
	if (qty > 0) {
		if (Helper.getControl("BUY").on)
			RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[4];
		else if (Helper.getControl("SELL").on)
			RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[1];
		RPG.vars.RPG_STORE_QTY[i+offset][1] -= 1;
		Helper.getControl("store").redraw = true;
	}
  },
  store_action: () => {
	if (Helper.getControl("BUY").on) {
		let total = 0;
		let cash = RPG.methods.updateGold(0);
		for (let q of RPG.vars.RPG_STORE_QTY) {
			if (q[1] > 0) {
				total += q[0] * q[1];
			}
		}
		if (total > cash) {
			RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[5];
		}
		else if (total == 0) {
			RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[8];
		}
		else {
			for (let q of RPG.vars.RPG_STORE_QTY) {
				if (q[1] > 0) {
					RPG.methods.updateInventory(q[3], 		// type
												q[2], 		// id
												q[1]);	
				}
			}
			RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[0];
			RPG.methods.updateGold( -1*total);
			RPG.vars.RPG_STORE_QTY = [];
			Helper.getControl("store").redraw = true;			
		}
	}
	else if (Helper.getControl("SELL").on) {
		let total = 0;
	    let list = RPG.methods.getInventoryList(0).concat(RPG.methods.getInventoryList(1, true));
		let eqp_count = RPG.methods.getInventoryList(0).length;
		for (let q of RPG.vars.RPG_STORE_QTY) {
			if (q[1] > 0) {
				total += q[0] * q[1];
				RPG.methods.updateInventory(q[3], 		// type
											q[2], 		// id
											-1 * q[1]);	
			}
		}
		if (total == 0) {
			RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[2];
		}
		else {
			RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[0];
			RPG.methods.updateGold(total);
			RPG.vars.RPG_STORE_QTY = [];
			Helper.getControl("store").redraw = true;
		}
	}
	else if (Helper.getControl("RENT a room").on) {
		let total = 0;
		let cap = 0;
		let cash = RPG.methods.updateGold(0);
		let rooms = [];
		for (let q of RPG.vars.RPG_STORE_QTY) {
			if (q[1] > 0) {
				total += q[0] * q[1];
				cap += q[1] * RPG.Inn[q[2]].cap;
				rooms.push(q[1]);
			}
			else {
				rooms.push(0);
			}
		}
		if (total > cash)
			RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[5];
		else if (total == 0)
			RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[9];
		else {
			// TODO check if enough rooms, for now use getActive to get list of people
			let num = RPG.methods.getActive().length;
			if (num > cap)
				RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[10];
			else {
				RPG.vars.RPG_STORE_MSG = RPG.vars.RPG_CONST_MSGS[7];
				RPG.methods.updateGold( -1*total);
				RPG.vars.RPG_STORE_QTY = [];
				Helper.getControl("store").redraw = true;
				// TODO: indicate back into main script that room/s have been rented
				Helper.setValue("_rpg_rooms", rooms);
			}			
		}
	}
  },
  show_skill_desc: (grid) => {
	let c = Helper.getControl("Skills");
	if (!c) return;	// TODO: Textarea not available to display skill description

	let actor = RPG.methods.getActorFromIndex(RPG.vars.RPG_ACTOR_SELECT);
	let skill_tree = RPG.methods.getClassSkills(actor.stats.class.id);
	let skill = skill_tree[grid[0]][grid[1]];
	RPG.vars.RPG_SKILL_SELECT = skill;
	c.text = skill.name+"\n";
	c.text += "------------------------\n";
	c.text += skill.description+"\n";
	c.text += "- Requirements: ";
	for (let i in skill.tree) {
		if (i>0) c.text += ", ";
		c.text += RPG.Skills[skill.tree[i]].name;
	}
	c.text += "\n- Type: ";
	switch (skill.type) {
		case 0: c.text += "Passive\n"; break; 
		case 1: c.text += "Beginner\n"; break; 
		case 2: c.text += "Novice\n"; break; 
		case 3: c.text += "Intermediate\n"; break; 
		case 4: c.text += "Expert\n"; break; 
		case 5: c.text += "Master\n"; break; 
	}
	// display actor skill enhancements
	let cls_text = "- Class: ", btl_text = "- Battle: ", pty_text = "- Party: ", nmy_text = "- Enemy: ";
	for (let prop in skill) {
		if ((skill.hasOwnProperty(prop)) && (prop.search(/(cls|res)/g) != -1)) {
			if (cls_text.length > 9) cls_text += ", ";
			if (prop.search(/(cls)/g) != -1)
				cls_text += prop.replace("cls_","").toUpperCase();					
			if (prop.search(/(res)/g) != -1)
				cls_text += prop.replace("res_","").toUpperCase();
			if (typeof skill[prop] == "string") {
				cls_text += "+"+RPG.methods.parseStats(skill[prop], actor.stats);
			}
			else {
				if (skill[prop] > 0)
					cls_text += "+"+skill[prop];
				else
					cls_text += skill[prop];
			}
		}
		if ((skill.hasOwnProperty(prop)) && (prop.search(/(btl)/g) != -1)) {
			if (btl_text.length > 10) btl_text += ", ";
			btl_text += prop.replace("btl_","").toUpperCase();
			if (typeof skill[prop] == "string") {
				btl_text += "+"+RPG.methods.parseStats(skill[prop], actor.stats);
			}
			else {
				if (skill[prop] > 0)
					btl_text += "+"+skill[prop];
				else
					btl_text += skill[prop];
			}
		}
	}
	if (cls_text.length > 9) c.text += cls_text+"\n";
	if (btl_text.length > 10) c.text += btl_text+"\n";
	/*		if (prop.search(/(pty)/g) != -1) {
				// TODO:
			}
			if (prop.search(/(nmy)/g) != -1) {
				// TODO:
			}
	*/
	// display status
	let active = RPG.methods.checkSkillActive(actor.stats.skill, skill.id);
	c.text += "------------------------\n";
	c.text += "Status: ";
	c.text += (active) ? "Learned" : "Available";
	//c.redraw = true;
  },
  set_skill: () => {
	/* if none selected, echo choose a skill
	   if chosen is learned, choose another skill
	   else learn skill */
	let actor = RPG.methods.getActorFromIndex(RPG.vars.RPG_ACTOR_SELECT);
	if (actor.stats.skillpts <= 0)
		RPG.callback.showMsg(actor.id+RPG.vars.RPG_CONST_MSGS[13]);  
	else if (RPG.vars.RPG_SKILL_SELECT === null)
		RPG.callback.showMsg(RPG.vars.RPG_CONST_MSGS[11]);
	else {
		let active = RPG.methods.checkSkillActive(actor.stats.skill, RPG.vars.RPG_SKILL_SELECT.id);
		if (active)
			RPG.callback.showMsg(actor.id+RPG.vars.RPG_CONST_MSGS[12]);
		else {
			// update actor skills
			RPG.methods.updateActorSkills(actor, RPG.vars.RPG_SKILL_SELECT.id);
			// update skill points
			Helper.getControl("points").text = actor.stats.skillpts.toString();
			Helper.getControl("points").redraw = true;
			RPG.callback.showMsg(actor.id+RPG.vars.RPG_CONST_MSGS[14]+RPG.vars.RPG_SKILL_SELECT.name);
			// update skill description and grid
			let skill_tree = RPG.methods.getClassSkills(actor.stats.class.id);
			for (let i in skill_tree) {
				for (let j in skill_tree[i]) {
					if (skill_tree[i][j].id == RPG.vars.RPG_SKILL_SELECT.id)
						RPG.macro.show_skill_desc([i,j]);
					let actv = RPG.methods.checkSkillActive(actor.stats.skill, skill_tree[i][j].id);
					let unlkd = RPG.methods.checkSkillUnlocked(actor.stats.skill, skill_tree[i][j].id);
					let button = Helper.getControl("g_"+i+"_"+j);
					let icon = Helper.getControl("i_"+i+"_"+j);
					button.hidden = (unlkd) ? false : true;
					button.redraw = true;
					icon.active = actv;
					icon.lock = !unlkd;
					icon.hidden = false;
					icon.redraw = true;
				}
			}
			RPG.vars.RPG_SKILL_SELECT = null;
		}  
	}  
  },
  add_quest: (index) => {
	  RPG.methods.enableQuest(index);
  },
  solve_quest: (index) => {
	  RPG.methods.completeQuest(index);
  },

  // Battle window macros
  show_battle: () => {
	// disable dropdown
	let cMenu = Helper.getControl("toggle_menu");
	cMenu.hidden = true;
	cMenu.redraw = true;	
	
    jump("RPG_forms#show_battle");
  },
  end_battle: () => {
	// enable dropdown
	let cMenu = Helper.getControl("toggle_menu");
	cMenu.hidden = false;
	cMenu.redraw = true;
	Stage.capture = false;	
	
	jump("$RPG_forms#hide_forms");	// Not a bug, use same label as stats to jump to	
  },
  battler_select: (position) => {
	  let pos = parseInt(position);
	  if (RPG.methods.selectBattlers(pos)) {
		RPG.callback.showBattlerSprite(pos, true);
		Helper.getControl("action").hidden = false;	
		Helper.getControl("again").hidden = false;	
	  }
  },
  enemy_select: (position) => {
	let pos = parseInt(position);	  
	if (RPG.methods.selectEnemy(pos)) {
		RPG.callback.showEnemySprite(pos, true);
		Helper.getControl("action").hidden = false;	
		Helper.getControl("again").hidden = false;	
	}
  },
  reset_battlers: () => {
	  RPG.methods.resetBattlers();
  },
  set_enemies: (param) => {
	  RPG.methods.setEnemies(param);
  },
  init_battle: () => {
	  Helper.getControl("fight").hidden = true;
	  if (RPG.methods.checkPartyEmpty()) {
		  RPG.callback.showMsg(RPG.vars.RPG_CONST_MSGS[15]);
		  RPG.macro.end_battle();
		  return;
	  }	
	  RPG.macro.build_battle_order(true);  	  	  
	  RPG.methods.startBattleLoop();	  
  },
  build_battle_order: (init) => {
	  let cOrder = Helper.getControl("bOrder")
	  cOrder.hidden = false;
	  let list = RPG.methods.buildBattlerOrder(init);
	  let order = " Turns: ";
	  for (let i in list) {
		  order += list[i][2] + " << ";
	  }
	  cOrder.text = order;
	  cOrder.hidden = false;
	  cOrder.redraw = true;
  },
  //start_battle_loop: function() {
  //	  RPG.methods.startBattleLoop();
  //},
  do_battler_action: (action) => {
	  let ret = RPG.methods.doBattlerAction(action);
	  let c = null;
	  if (ret == RPG.vars.RPG_ACTION_CANCEL) {
		  RPG.macro.unselect_action();
		  return;
	  }
	  else if (ret == RPG.vars.RPG_ACTION_SKL) {
		  c = Helper.getControl("selector");
		  c.mode = RPG.vars.RPG_CHOOSE_SKILLS;
		  c.hidden = false;
	  }
	  else if (ret == RPG.vars.RPG_ACTION_ITM) {
		  c = Helper.getControl("selector");
		  c.mode = RPG.vars.RPG_CHOOSE_ITEMS;
		  c.hidden = false;
	  }
	  else if (ret == RPG.vars.RPG_ACTION_DEF) {
		  Helper.getControl("action").hidden = false;	
		  Helper.getControl("again").hidden = false;	
	  }

	  // disable and hide action buttons
	  c = Helper.getControl("radio_pAttack");
	  c.hidden = (action != RPG.vars.RPG_ACTION_ATK) ? true : false;
	  c = Helper.getControl("radio_pSkill");
	  c.hidden = (action != RPG.vars.RPG_ACTION_SKL) ? true : false;
	  c = Helper.getControl("radio_pItem");
	  c.hidden = (action != RPG.vars.RPG_ACTION_ITM) ? true : false;
	  c = Helper.getControl("radio_pDefend")	
	  c.hidden = (action != RPG.vars.RPG_ACTION_DEF) ? true : false;
  },
  do_selected_action: () => {
	if (RPG.methods.doSelectedAction()) {
		Helper.getControl("action").hidden = true;
		Helper.getControl("again").hidden = true;
	}
  },
  unselect_action: () => {
	  RPG.macro.cleanup_battleground(false);
	  Helper.getControl("selector").hidden = true;
	  Helper.getControl("action").hidden = true;	
	  Helper.getControl("again").hidden = true;
	  setTimeout(() => {
		RPG.vars.RPG_STATE = RPG.vars.RPG_BATTLE_START	  	
		RPG.methods.startBattleLoop();  
	  }, 100);
  },
  cleanup_battleground: (clearBattler) => {
	// hide battle sprites
	let c = null;
	// TODO: fix texture clear
	if (clearBattler) {
		c = Helper.getControl("pSprite");
		c.hidden = true;
		c.redraw = true;
	}
	c = Helper.getControl("eSprite");
	c.hidden = true;
	c.redraw = true;
	// disable and hide action buttons
	c = Helper.getControl("radio_pAttack");
	if (c.on == true) 
		c.reset = true;
	c.hidden = true;
	c = Helper.getControl("radio_pSkill");
	if (c.on == true) 
		c.reset = true;
	c.hidden = true;
	c = Helper.getControl("radio_pItem");
	if (c.on == true) 
		c.reset = true;
	c.hidden = true;
	c = Helper.getControl("radio_pDefend")	
	if (c.on == true) 
		c.reset = true;
	c.hidden = true;
	// unselect attacker and target
	for (let i=0; i<5; i++) {
		Helper.getControl("pBattler"+i).selected = false;
		Helper.getControl("pBattler"+i).target = false;
		Helper.getControl("pBattler"+i).redraw = true;
		Helper.getControl("eBattler"+i).selected = false;
		Helper.getControl("eBattler"+i).target = false;
		Helper.getControl("eBattler"+i).redraw = true;
	}
  },
  get_prev_battle_item: () => {
	  let c = Helper.getControl("selector");
	  let type = c.mode;
	  if (type == RPG.vars.RPG_CHOOSE_SKILLS) {
		  let i = RPG.vars.RPG_BSKILL_SELECT;
		  if (i>0) {
			  RPG.vars.RPG_BSKILL_SELECT = i-1;
			  c.redraw = true;
		  }
	  }
	  else {
		  let i = RPG.vars.RPG_ITEM_SELECT;
		  if (i>0) {
			  RPG.vars.RPG_ITEM_SELECT = i-1;
			  c.redraw = true;
		  }
	  }
  },
  get_next_battle_item: () => {
	  let c = Helper.getControl("selector");
	  let type = c.mode;
	  if (type == RPG.vars.RPG_CHOOSE_SKILLS) {
		  let list = RPG.methods.getBattlerNonpassiveSkills(RPG.Battlers[RPG.vars.RPG_ATTACKER][0], RPG.vars.RPG_PARTY);
		  let i = RPG.vars.RPG_BSKILL_SELECT;
		  if (i<list.length-RPG.vars.RPG_BATTLE_ITEMS) {
			  RPG.vars.RPG_BSKILL_SELECT = i+1;
			  c.redraw = true;
		  }
	  }
	  else {
		  let list = RPG.methods.getInventoryList(RPG.vars.RPG_INVENTORY_TYPE_ITEMS, true);
		  let i = RPG.vars.RPG_ITEM_SELECT;
		  if (i<list.length-RPG.vars.RPG_BATTLE_ITEMS) {
			  RPG.vars.RPG_ITEM_SELECT = i+1;
			  c.redraw = true;
		  }
	  }
  },
  select_battle_item: (index) => {
	  if (index < 0) return;
	  if (RPG.vars.RPG_STATE == RPG.vars.RPG_CHOOSE_SKILLS)
		RPG.vars.RPG_SELECTED = index + RPG.vars.RPG_BSKILL_SELECT;
	  else if (RPG.vars.RPG_STATE == RPG.vars.RPG_CHOOSE_ITEMS)
		RPG.vars.RPG_SELECTED = index + RPG.vars.RPG_ITEM_SELECT;
	  
	  if (RPG.methods.selectBattleItem(RPG.vars.RPG_SELECTED)) {
		  Helper.getControl("selector").hidden = true;
	  }
  },
};

}); // require