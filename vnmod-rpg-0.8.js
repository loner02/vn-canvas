///////////////////////////////////////////////////////////////////////////////
//  Visual Novel JAVASCRIPT Engine for HTML5 CANVAS by [lo'ner]              //
//  RPG Mod Pack for VN-CANVAS                                               //
//  Author: oclabbao@gmail.com                                               //
//  Reference:                                                               //
//      RPGMakerXP/VX/VX-ACE                                                 //
//      RPG Javascript Library by Samuel Ronce (rpgjs.com)                   //
//  Requires:                                                                //
//      VN-CANVAS v0.8+                                                    //
//  Description:                                                             //
//      This is a mod pack for vn-canvas to have some RPG elements. Note,    //
//      visual novels are not RPG, and most visual novel players are not     //
//      RPG players (or even hardcore gamers). This is sort of a lite RPG    //
//      addon that gives vn-canvas RPG gameplay.                             //
//                                                                           //
//      This mod pack is organized into several sections:                    //
//		  [vnmod-rpg-data.js]												 //
//          - initialization                                                 //
//          - game specific data (e.g. characters, items, etc.)              //
//          - user-modifiable section (e.g. stats, formulas, etc.)           //
//		  [vnmod-rpg-forms.js]												 //
//			- custom forms and elements used in-game						 //
//        [vnmod-rpg-macros.js]                                              //
//          - custom macros used in-game                                     //
//          - required by forms                                              //
//		  [vnmod-rpg-x.x.js]											     //
//          - RPG core script (do not modify)			                     //
//      Of course, nothing stops you from customizing the core script, if    //
//      you know what you're doing. :)                                       //
//  Usage:                                                                   //
//      1. To create an actor, use 'actor' with the names defined in         //
//         RPG.actors. Their class/stats will be automatically defined.      //
//      2. To modify an actor level/stat, modify his experience points.      //
//         Use 'set {actorname_exp:"+xxx"}' to increase the exp points of    //
//         actorname by xxx. The levels and stat points will be computed     //
//         based on the defined growth formulas.                             //
///////////////////////////////////////////////////////////////////////////////
/******************************************************************************
	Copyright © 2016-18 by OCLabbao a.k.a [lo'ner]

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to permit
    persons to whom the Software is furnished to do so, subject to the
    following conditions:

    The above copyright notice and this permission notice shall be included
    in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    USE OR OTHER DEALINGS IN THE SOFTWARE.

******************************************************************************/
/******************************************************************************
Revision history:
Version 0.8 Freja
11.01.18 - Demo ported to WebGL
05.17.18 - Start port to ES6 and WebGL via PixiJS
Version 0.6 Elsa
08.30.16 - Refactored into 3 files for better code structure
08.10.16 - Updated for v.0.6.x engine version
Version 0.4 Chelsea
12.29.12 - RPG mod first installment: actors and stats
12.01.12 - Initial version, to be consistent with vn-canvas version
         - Define actor attributes
******************************************************************************/

///////////////////////////////////////////////////////////////////////////////
// RPG Core Script
// CAUTION: DO NOT MODIFY beyond this line, unless you know what you're doing
///////////////////////////////////////////////////////////////////////////////
// API List
//
//	ACTOR API:
//	getActive()					- returns list of active actors
//  setActive(id, on)			- set active flag on actor with given id
//  getActorFromId(id)			- return actor class given ID
// 	getActorIndexFromId(id)		- retunr actor list index given ID
//	getActorFromIndex(index) 	- return actor class given active list index
//
//  EQUIPMENT API:
//	getClassEquipment(class, type)	- get equipment associated with class
//									- type: all, weapon, shield, head, body, accessory, feet
//	getEquipmentfromName(name)		- get equipment index from name
//	getEquipmentStats(list)			- return stats enhancement from the qiven list of equipped items
// 	getActorEquipment(index, type)	- get equipment for actor index of given type
//	getActorEquipped(index, type)	- get currently equipped for actor index with given type
//	setActorEquipped(index, type, eqp)	- set eqp to actor index with given type
//	assignEquipmenttoActor(index, equipment)	- assign equipment to actor index
//	unassignEquipmentfromActor(index, equipment)- unassign equipment from actor index
//
//  SKILLS API:
//	getClassSkills(class)			- get skills list associated with class
//	checkSkillActive(skills, id) 	- check if skill with id is active (learned)
//	checkSkillUnlocked(skills, id)	- check if skill with id is unlocked (can be learned)
//	updateActorSkills(actor, id)	- update actor skills with the given skill id
//  getSkillsSPRequirement(skill)	- get how much SP using skill requires
//  chooseRandomSkill(skillset, sp) - choose a random skill from given skillset and sp amount
//									- mostly used by enemies
//  getBattlerNonpassiveSkills(index, type)
//									- get non-passive skills given actor index and battler type
//
//	INVENTORY API:
//	checkIfActorOwns(index, eqp)	- check if actor of given index owns equipment eqp
//	checkInventory(index, list)		- check available inventory for actor index given list
//	assignInventorytoActor(index, equipment)	- assign equipment to actor index
//	getInventoryList(type, skipGold)- get list of inventory
//									- type: equipment, items
//									- skipGold: do not include gold/money in list
// 	getInventoryItem(type, id)		- get item class of given type and id
//	getInventoryItemByName(name)	- get item class of given name
//	getBaseItem(type, id)			- get item base class of given type and id
//	updateGold(value)				- update money with value
//	updateInventory(type, id, qty)	- update inventory of type and id with quantity qty
//
//	QUEST API:
//  getQuestList()					- gets all earned quests
//	enableQuest(index)				- enable or set active a quest index
//  completeQuest(index)			- finish a quest index
//  isQuestActive(index)			- check if quest dependencies have been met
//  
//	STATS API (private, use with caution):
//	parseStats(stat, base)
//	getInheritedClass(cls, stats, id)
//	updateAttr(id, attr, value)
//	buildStats(id)
//	updateActorBattleStats(index, stat, value)
//
//  BATTLE API
//  addActorToBattler(actor, position)	- adds the actor index to battler formation
//	getBattlerAtPosition(position)		- return the battler at given position
//  getBattlerFromIndex(index, type)	- return the battler with given index and type
//	getBattlerSpriteFromIndex(index, type)
//										- return the sprite of battler with given index and type
//  getBattlerPosition(battler, type)	- return the position of the given battler and type
//  canBattlerAttackAtPosition(position)- check if battler is able to attack at the given position
//  setEnemies(enemies)					- populate EBattler array
//  buildBattlerOrder(init)				- determine order of battlers
//										- init: start of battle (true/false)
//  doAttack(a_stats, t_stats, defsupp, type, item) - perform an attack
//										- a_stats: attacker stats
//										- t_stats: target stats
//										- defsupp: defense support from front row
//										- type: action type (ATK, SKL)
//										- item: skill used, if applicable
//  useItem: function(t_stats, item)	- use an item on the target
//										- t_stats: target stats
//										- item: item used
//  getDefenseSupport(position, side)	- defense support if at backrow
//										- position: of battler
//										- side: PARTY or enemy
//  enhanceDefense(index, side, on)		- perform defense action
//										- index: battler index
//										- side: PARTY or enemy
//										- on: defense on/off
//  checkBattleEnd()					- check if battle is over
//  checkPartyEmpty()					- check if party has no battlers
//  chooseTarget(side)					- choose a target
//  getStatusText(status)				- return a readable text of the given status
//  resetBattlers()						- initialize battler arrays
//  selectBattlers(pos)					- select battler at given pos
//  selectEnemy(pos)					- select enemy at given pos
//  startBattleLoop()					- start a battle loop
//  doBattlerAction(action)				- do a battler action
//  doSelectedAction()					- perform the selected action
//  doEnemyAction()						- do an enemy action
//  checkDamage(damage)					- check if damage is sustained
//  updateDamage(damage, party, enemy)	- update damage to stats
//										- party, enemy: position index
//  selectBattleItem(index)				- choose skills or item from selection
//  updateBattleExp()					- update EXP points	
//  clearBattlerStatus()				- clear status post-battle
///////////////////////////////////////////////////////////////////////////////

require(["app/vnmod-rpg-data"], function() {
	
RPG.methods = {
	// ACTOR API //
	getActive: () => {
		let list = new Array();
		for (let a of RPG.Actors) {
			let actor = RPG.methods.getActorFromId(a[0]);
			if (actor && actor.stats && actor.stats.active)
				list.push(actor);
		}
		return list;
	},
	setActive: (id, on) => {
		for (let a of RPG.Actors) {
			if (a[0] == id) {
				a[8] = on;
				break;
			}
		}
	},
	getActorFromId: (id) => {
		return Stage.layers.fg.get(id);
	},
	getActorIndexFromId: (id) => {
		for (let i in RPG.Actors) {
			if (RPG.Actors[i][0] == id)
				return i;
		}	
	},
	getActorFromIndex: (index) => {
		let list = RPG.methods.getActive();
		return list[index];
	},

	// EQUIPMENT API //
	getClassEquipment: (cls, type) => {
		let equip = new Array();
		for (let eq of RPG.Equipment) {
			if (eq.type == type) {
				for (let c of eq.class) {
					if (c == cls) {
						equip.push(eq);
						break;
					}
				}
			}
		}
		return equip;
	},
	getEquipmentfromName: (name) => {
		for (let i in RPG.Equipment) {
			if (RPG.Equipment[i].name == name)
				return i;
		}	
	},
	getEquipmentStats: (list) => {
		let estats = {};
		for (let l of list) {
			if (l != 0) {
				for (let prop in RPG.Equipment[l]) {
					if (RPG.Equipment[l].hasOwnProperty(prop)) {
						if (prop.includes("cls_") || prop.includes("res_")) {
							if (estats[prop])
								estats[prop] += RPG.Equipment[l][prop];
							else
								estats[prop] = RPG.Equipment[l][prop];
						}
					}
				}
			}
		}
		return estats;
	},
	getActorEquipment: (index, type) => {
		let actor = RPG.methods.getActorFromIndex(index);
		let equip_list = RPG.methods.getClassEquipment(actor.stats.class.id, type);
		equip_list = RPG.methods.checkInventory(index, equip_list);
		equip_list.unshift(RPG.Equipment[0]);
		return equip_list;
	},
	getActorEquipped: (index, type) => {
		let actor = RPG.methods.getActorFromIndex(index);
		let eqp = actor.stats.eqp[type];
		return RPG.Equipment[eqp];
	},
	setActorEquipped: (index, type, eqp) => {
		let list = RPG.methods.getActorEquipment(index, type);
		let actor = RPG.methods.getActorFromIndex(index)
		RPG.methods.unassignEquipmentfromActor(index, actor.stats.eqp[type]); 
		actor.stats.eqp[type] = parseInt(RPG.methods.getEquipmentfromName(list[eqp].name));
		RPG.Stats.eqp._update(actor, RPG.Equipment[actor.stats.eqp[type]]);
		if (actor.stats.eqp[type] != 0)
			RPG.methods.assignEquipmenttoActor(index, actor.stats.eqp[type]);
		
		return RPG.Equipment[actor.stats.eqp[type]];
	},
	assignEquipmenttoActor: (index, equipment) => {
		for (let inv of RPG.Inventory) {
			if ((inv[0]==0) && (inv[1]==equipment)) {
				if (inv[3].length==0) {
					inv[3][0] = index;
				} 
				else if (inv[2] > inv[3].length) {
					inv[3].push(index);
				}
				return true;
			}
		}
		return false;
	},
	unassignEquipmentfromActor: (index, equipment) => {
		let found = false;
		let inv;
		for (inv of RPG.Inventory) {
			if ((inv[0]==0) && (inv[1]==equipment)) {
				for (let owner of inv[3])
					if (owner == index)
						found = true;
				break;	
			}
		}
		if (found) {
			inv[3].splice(index,1);
			return true;
		}
		else
			return false;
	},
	
	// SKILLS API //
	getClassSkills: (cls) => {
		let skills = new Array();
		for (let sk of RPG.Skills) {
			if (sk.name == "None") continue;
			for (let c of sk.class) {
				if (c == cls) {
					skills.push(sk);
					break;
				}
			}
		}
		// 6 defined skill types: see above
		let skills_by_type = [[],[],[],[],[],[]];
		for (let sk of skills) {
			skills_by_type[sk.type].push(sk);
		}
		return skills_by_type;
	},
	checkSkillActive: (skills, id) => {
		for (let sk of skills) {
			if (sk == id)
				return true;
		}
		return false;
	},
	checkSkillUnlocked: (skills, id) => {
		for (let dep of RPG.Skills[id].tree) {
			if (dep == 0) continue;
			let active = false;
			for (let sk of skills) {
				if (dep == sk) active = true;
			}
			if (active == false)
				return false;
		}
		return true;
	},
	updateActorSkills: (actor, id) => {
		if (id != 0) {	// 0=none
			actor.stats.skillpts -= 1;
			let skills = actor.stats.skill;
			// cleanup and remove id=0
			if ((skills.length == 1) && (skills[0] == 0))
				skills.splice(0,1)
			skills.push(id);
			RPG.Stats.skill._update(actor, RPG.Skills[id]);
		}
	},
	getSkillsSPRequirement: (skill) => {
		return -1 * (RPG.Skills[skill].btl_sp);
	},
	chooseRandomSkill: (skillset, sp) => {
		// choose non-passive skill based on sp
		let skills = [];
		for (let sk of skillset) {
			if ((RPG.Skills[sk].type != RPG.vars.RPG_SKILL_PASSIVE) && (RPG.Skills[sk].btl_sp < sp))
				skills.push(sk);
		}
		// select skill or not
		if ((skills.length > 0) && (Math.random() > 0.5)) {
			return (skills[Math.round(Math.random()*(skills.length-1))]);
		}
		return -1;	// no skill selected 
	},
	getBattlerNonpassiveSkills: (index, type) => {
		if (type == RPG.vars.RPG_PARTY) {
			let list = [];
			let actor = RPG.methods.getBattlerFromIndex(index, type);
			for (let sk of actor.stats.skill) {
				if (RPG.Skills[sk].type != RPG.vars.RPG_SKILL_PASSIVE)
					list.push(RPG.Skills[sk]);
			}			
			return list;			
		}
	},

	// INVENTORY API //
	checkInventory: (index, list) => {
		let inv_list = [];
		for (let l of list) {
			for (let q in RPG.Inventory) {
				if (l.id == RPG.Inventory[q][1]) {
					if ((RPG.Inventory[q][2] > RPG.Inventory[q][3].length) ||	// more equipment than owners
						(RPG.methods.checkIfActorOwns(index, q))) {				// actor owns equipment
						inv_list.push(l);
						break;
					}	
				}			
			}
		}
		return inv_list;
	},
	checkIfActorOwns: (index, eqp) => {
		for (let owner of RPG.Inventory[eqp][3])
			if (owner == index)
				return true;
		return false;	
	},
	assignInventorytoActor: (index, equipment) => {
		for (let eq of equipment) {
			if (eq != 0) {
				RPG.methods.assignEquipmenttoActor(index, eq)
			}
		}	
	},
	getInventoryList: (type, skipGold) => {
		let list = [];
		let equip = [];
		for (let inv of RPG.Inventory) {
			if (inv[0] == type) {
				equip = [];
				if (type == 0)
					equip.push(RPG.Equipment[inv[1]]);	// equipment
				else {
					if ((RPG.Items[inv[1]].id == 0) && (skipGold == true))
						continue; 
					equip.push(RPG.Items[inv[1]]);		// item
				}
				equip.push(inv[2]);				// quantity
				equip.push(inv[3].length);			// used
				list.push(equip); 	
			}
		}
		return list;
	},
	getInventoryItem: (type, id) => {
		let item = [];
		for (let inv of RPG.Inventory) {
			if ((inv[0] == type) && (inv[1] == id)) {
				if (type == 0)
					item.push(RPG.Equipment[inv[1]]);
				else
					item.push(RPG.Items[inv[1]]);
				item.push(inv[2]);				
				item.push(inv[3].length);		
				break;
			}
		}		
		return item;	
	},
	getInventoryItemByName: (name) => {
		for (let inv of RPG.Inventory) {
			if (inv[0] == 0) { // equipment
				for (let eq of RPG.Equipment) {
					if (eq.name == name)
						return eq;
				}
			}
			else {	// items
				for (let item of RPG.Items) {
					if (item.name == name)
						return item;
				}
			}
		}	
		return null;
	},
	getBaseItem: (type, id) => {
		let item = [];
		if (type == 0)
			item.push(RPG.Equipment[id]);
		else
			item.push(RPG.Items[id]);
		item.push(0);	// quantity: don't care
		item.push(-1);	// used: don't care
		return item;
	},
	updateGold: (val) => {
		for (let inv of RPG.Inventory) {
			if ((inv[0] == 1) && (RPG.Items[inv[1]].id == 0)) {
				inv[2] += val;
				if (inv[2] < 0) inv[2] = 0;
				return inv[2];
			}
		}	
	},
	updateInventory: (type, id, qty) => {
		let found = false;
		for (var i in RPG.Inventory) {
			if (RPG.Inventory[i][0] == type) {
				if ((type == 0) && (RPG.Equipment[RPG.Inventory[i][1]].id == id)) {
					found = true;
					break;					
				}
				else if ((type == 1) && (RPG.Items[RPG.Inventory[i][1]].id == id)) {
					found = true;
					break;
				}
			}
		}
		if (found) {	// update quantity
			RPG.Inventory[i][2] += qty;
			if (RPG.Inventory[i][2] == 0) {
				RPG.Inventory.splice(i,1);
				return 0;
			}
			return RPG.Inventory[i][2];
		}
		else {			// new inventory
			let inv = [type, id, qty, []];
			RPG.Inventory.push(inv);
			return qty;
		}
		//return null;
	},
	
	// QUEST API //
	getQuestList: () => {
		let list = [];
		for (let quest of RPG.Quests) {
			let q = [];
			q.push(RPG.QuestList[quest[0]]);
			q.push(quest[1]);	// active
			q.push(quest[2]);	// completed
			list.push(q);
		}
		return list;
	},
	enableQuest: (index) => {
		for (let quest of RPG.Quests) {
			if (quest[0] == index) {
				// found existing quest, verify status
				quest[1] = (RPG.methods.isQuestActive(index) == true);
				return;
			}
		}
		// this is a new quest
		let q = [];
		q.push(index);
		q.push(RPG.methods.isQuestActive(index));
		q.push(false);
		RPG.Quests.push(q);
		if (RPG.callback && RPG.callback.showMsg) {
			RPG.callback.showMsg("You have earned a new quest: "+ RPG.QuestList[index].name);
		}
	},
	completeQuest: (index) => {
		let completed = false, i=-1;
		for (i in RPG.Quests) {
			if (RPG.Quests[i][0] == index) {
				// can only complete quests that are active
				completed = (RPG.Quests[i][1] == true)
				RPG.Quests[i][2] = completed;
				break;
			}
		}
		if (completed) {
			if (RPG.callback && RPG.callback.showMsg) {
				RPG.callback.showMsg("You have completed quest: "+ RPG.QuestList[index].name);
			}
			// enable other quests that depend on this
			for (i in RPG.Quests) {
				if (!RPG.Quests[i][2])
					RPG.Quests[i][1] = (RPG.methods.isQuestActive(i) == true);
			}
		}
	},
	isQuestActive: (index) => {
		let active = true;
		if (RPG.QuestList[index].requires != undefined) {
			let deps = RPG.QuestList[index].requires;
			for (let r in deps) {
				let found = false, i=-1;
				for (i in RPG.Quests) {
					if (RPG.Quests[i][0] == deps[r]) {
						found = true;
						break;
					}
				}
				if (found) {
					active = active && RPG.Quests[i][2];
				}
				else active = false;
			}
		}
		return active;
	},
	
	// STATS API //
	parseStats: (stat, base) => {
		if (typeof stat == 'string') {
			let match = stat.match(/#([^#|\s]+)#/g);
			if (match && match.length>0) {
				for (let i in match)
					stat = stat.replace(match[i],base[match[i].replace(/#/g,'')])
				return Math.round(eval(stat));
			}
		}
		return stat;
	},
	getInheritedClass: (cls, stats, id) => {
		let inherited_class = {};
		if (typeof cls == 'string') {
			let match = cls.match(/#([^#|\s]+)#/g);
			if (match.length>0) {
				let attr = match[0].replace(/#/g,'');
				if (RPG.Stats[attr]._reference) {
					// re-build/resolve the class from reference
					for (let stat of stats[attr]) {
						for (let ref in RPG.Stats[attr]._reference[stat]) {
							if (ref.match(/(cls|res)/g) != null) {	// inherit only cls_* and res_* stats
								if (inherited_class[ref])
									inherited_class[ref] += RPG.Stats[attr]._reference[stat][ref];
								else
									inherited_class[ref] = RPG.Stats[attr]._reference[stat][ref];
							}
						}
					}
				}
				else {
					inherited_class = stats[attr];
				}
			}
		}
		else {
			inherited_class = cls[id];
		}
		return inherited_class;
	},
	updateAttr: (id, attr, value) => {
		let obj = RPG.methods.getActorFromId(id);
		if ((typeof obj.stats[attr] == 'number') ||
			(typeof obj.stats[attr] == 'string') ||
			(typeof obj.stats[attr] == 'boolean'))
			Helper.setValue(id+'_'+attr, value);
		else {
			// this is an object that needs updating
			if (RPG.Stats[attr]._inherit) {
				let inherit = {};		// inheritable values are assumed objects
				for (let cls of RPG.Stats[attr]._inherit) {
					let inherited_class = RPG.methods.getInheritedClass(cls,obj.stats,value);
					for (let j in inherited_class) {
						if (inherited_class.hasOwnProperty(j))
							if (inherit[j])
								inherit[j] += RPG.methods.parseStats(inherited_class[j], obj.stats);
							else
								inherit[j] = RPG.methods.parseStats(inherited_class[j], obj.stats);
					}
				}
				Helper.setValue(id+'_'+attr, inherit);				
			}
		}
	},
	buildStats: (id) => {
		let newStats = {};
		//for (let i=0; i<RPG.Actors.length; i++) {
        for (let i in RPG.Actors) {
			if (RPG.Actors[i][0] == id) {
				let j=0;
				for (let prop in RPG.Stats) {
					if (RPG.Stats.hasOwnProperty(prop)) {
						j++;
						if (RPG.Stats[prop]._range) {
							if ((RPG.Actors[i][j] >= RPG.Stats[prop]._range[0]) && ((RPG.Actors[i][j] <= RPG.Stats[prop]._range[1]))) 
								newStats[prop] = RPG.Actors[i][j];
							else
								newStats[prop] = RPG.Stats[prop]._range[0];
                        }
						else if (RPG.Stats[prop]._value) {
							newStats[prop] = RPG.Stats[prop]._value[RPG.Actors[i][j]];
							if (prop == "eqp")
								RPG.methods.assignInventorytoActor(i, newStats[prop]);
						}
						else
							newStats[prop] = 0;
						if (RPG.Stats[prop]._inherit) {
							let select = newStats[prop];
							let inherit = {};		// inheritable values are assumed objects
							for (let cls of RPG.Stats[prop]._inherit) {
								let inherited_class = RPG.methods.getInheritedClass(cls, newStats, select);
								for (let attr in inherited_class) {
									if (inherited_class.hasOwnProperty(attr)) {
										if (inherit[attr])
											inherit[attr] += RPG.methods.parseStats(inherited_class[attr], newStats);
										else
											inherit[attr] = RPG.methods.parseStats(inherited_class[attr], newStats);
									}
								}
							}
							newStats[prop] = inherit;
						}
					}
				}
				break;
			}
		}
		return newStats;
	},
	updateActorBattleStats: (index, stat, value) => {
		let actor = RPG.methods.getActorFromIndex(index);
		// this can be a cls_ or a res_
		if (actor.stats.battle[stat.replace("btl", "cls")] !== undefined)
			actor.stats.battle[stat.replace("btl", "cls")] += value;
		else if (actor.stats.battle[stat.replace("btl", "res")] !== undefined)
			actor.stats.battle[stat.replace("btl", "res")] += value;
		RPG.Stats.battle._update(actor, actor.stats);
	},
	
	// BATTLE API //
	addActorToBattler: (index, position) => {
		// check if battler already active, remove if so
		let idx = parseInt(index);
		for (let b in RPG.Battlers) {
			if (RPG.Battlers[b][0] == idx) {
				RPG.Battlers[b] = [-1, -1];
			}
		}
		RPG.Battlers[position] = [idx, (idx != -1) ? 0 : -1];
	},
	getBattlerAtPosition: (position) => {
		if (position < 5)
			return RPG.Battlers[position];
		else
			return RPG.EBattlers[position%5];
	},
	getBattlerFromIndex: (index, type) => {
		if (type == RPG.vars.RPG_PARTY) {
			return RPG.methods.getActorFromIndex(index);
		}
		if (type == RPG.vars.RPG_ENEMY) {
			return RPG.Enemies[index];
		}
		if (type == RPG.vars.RPG_ENEMY_BOSS) {
			return RPG.methods.getActorFromId(RPG.Actors[index][0]);
		}
	},
	getFirstBattler: () => {
		return RPG.methods.getBattlerFromIndex(RPG.Order[0][1], RPG.Order[0][0]);	
	},
	getBattlerSpriteFromIndex: (index, type) => {
		//var battler = this.getBattlerFromIndex(index, type);
		if (type == RPG.vars.RPG_PARTY) return RPG.Actors[index][10];
		if (type == RPG.vars.RPG_ENEMY) return RPG.Enemies[index].sprite;
		if (type == RPG.vars.RPG_ENEMY_BOSS) return RPG.Actors[index][10];
	},
	getBattlerPosition: (battler, type) => {
		if (type == RPG.vars.RPG_PARTY) {
			for (let i in RPG.Battlers) {
				if ((typeof battler == "string") && (RPG.Battlers[i][0] != -1)) {
					if (RPG.Actors[RPG.Battlers[i][0]][0] == battler)
						return i;
				}
				else {
					if (RPG.Battlers[i][0] == battler)
						return i;
				}
			}
		}
		else {
			for (let i in RPG.EBattlers) {
				if ((typeof battler == "string") && (RPG.EBattlers[i][0] != -1)) {
					if (RPG.Actors[RPG.EBattlers[i][0]][0] == battler)
						return i;
				}
				else {
					if (RPG.EBattlers[i][0] == battler)
						return i;
				}
			}	
		}
		// party and boss not found, must be a minion
		if (type == RPG.vars.RPG_ENEMY) {
			if (typeof battler == "string")
				return parseInt(battler.substr(-1,1));
		}
		return -1;
	},
	canBattlerAttackAtPosition: (position) => {
		if (position < 5) {
			if (position % 2 == 1) return true;
			let battler = RPG.methods.getBattlerAtPosition(position);
			let weapon = RPG.methods.getActorEquipped(battler[0], RPG.vars.RPG_WEAPON);
			if ((weapon) && (weapon.attr == "ranged")) return true;
			if ((weapon) && (weapon.attr == "long")) return true;
			if (((RPG.Battlers[1][0]==-1) || (RPG.Battlers[1][1]==RPG.vars.RPG_INACTIVE)) &&
				((RPG.Battlers[3][0]==-1) || (RPG.Battlers[3][1]==RPG.vars.RPG_INACTIVE)) )
				return true;
			return false;
		}
		else {
			if (position %2 == 0) return true;
			let battler = RPG.methods.getBattlerAtPosition(position);
			if (battler[1] == RPG.vars.RPG_ENEMY) {
				for (let eqp of RPG.Enemies[battler[0]].eqp) {
					if (RPG.Equipment[eqp].attr == "ranged") return true;
					if (RPG.Equipment[eqp].attr == "long") return true;
				}
			}
			else {
				let boss = RPG.methods.getActorFromId(RPG.Actors[battler[0]][0]);
				let weapon = RPG.Equipment[boss.stats.eqp[RPG.vars.RPG_WEAPON]];
				if ((weapon) && (weapon.attr == "ranged")) return true;
				if ((weapon) && (weapon.attr == "long")) return true;
			}
			if (((RPG.EBattlers[1][0]==-1) || (RPG.EBattlers[1][2]==RPG.vars.RPG_INACTIVE)) &&
				((RPG.EBattlers[3][0]==-1) || (RPG.EBattlers[3][2]==RPG.vars.RPG_INACTIVE)) )
				return true;
			return false;
		}
	},
	setEnemies: (enemies) => {
	  for (let i in enemies) {
		  if (typeof enemies[i] == "number") {
			  if (enemies[i] == -1)	
			  	RPG.EBattlers[i] = [-1, -1, -1, -1, -1, -1, -1];
				  				// index, boss?, status, hp, sp, def, atk
			  else
			  	RPG.EBattlers[i] = [enemies[i], RPG.vars.RPG_ENEMY, 0, RPG.Enemies[enemies[i]].stats.cls_hp, 
				  													   RPG.Enemies[enemies[i]].stats.cls_sp,
																	   RPG.Enemies[enemies[i]].stats.cls_def,
																	   RPG.Enemies[enemies[i]].stats.cls_atk];
		  }
		  else {
			  let j = RPG.methods.getActorIndexFromId(enemies[i]);
			  RPG.EBattlers[i] = [parseInt(j), RPG.vars.RPG_ENEMY_BOSS, 0, -1, -1, -1, -1];
		  }
	  }
	},
	sortBattlers: (a, b) => {
		return b[3] - a[3];
	},
	sortTargets: (a, b) => {
		return a[1] - b[1];	
	},
	buildBattlerOrder: (init) => {
		if (init) {
			RPG.Order = [];
			let entry = [];
			for (let battler of RPG.Battlers) {
				if ((battler[0] != -1) && (battler[1] != RPG.vars.RPG_INCAPACITATED)) {
					let actor = RPG.methods.getBattlerFromIndex(battler[0], RPG.vars.RPG_PARTY); 
					entry = [0, battler[0], actor.id, Math.min(100,actor.stats.battle.cls_agi)];
					// add noise to speed +/-0.1
					entry[3] *= (0.9 + 0.2*Math.random());
					RPG.Order.push(entry);
				}
			}
			let i = 0;
			for (let battler of RPG.EBattlers) {
				if ((battler[0] != -1) && (battler[2] != RPG.vars.RPG_INCAPACITATED)) {
					if (battler[1] != RPG.vars.RPG_ENEMY_BOSS) {
						let minion = RPG.methods.getBattlerFromIndex(battler[0], RPG.vars.RPG_ENEMY);
						entry = [RPG.vars.RPG_ENEMY, battler[0], minion.name+i, Math.min(100, minion.stats.cls_agi)];
						entry[3] *= (0.9 + 0.2*Math.random());
						RPG.Order.push(entry);
					}
					else {
						let boss = RPG.methods.getBattlerFromIndex(battler[0], RPG.vars.RPG_ENEMY_BOSS);
						entry = [RPG.vars.RPG_ENEMY_BOSS, battler[0], boss.id, Math.min(100, boss.stats.battle.cls_agi)];
						entry[3] *= (0.9 + 0.2*Math.random());
						RPG.Order.push(entry);
					}
				}
				i++;
			}
			// sort the list by agi
			RPG.Order.sort(RPG.methods.sortBattlers);
		}
		else {
			// Reduce agi of battler based on strength
			// the higher the battler strength, the less effect of fatigue
			let endurance = -1;
			let battler = RPG.methods.getBattlerFromIndex(RPG.Order[0][1], RPG.Order[0][0]);
			if (RPG.Order[0][0] == RPG.vars.RPG_ENEMY)
				endurance = (10+ ((100-battler.stats.cls_str)/2) + 20*Math.random())/100;
			else
				endurance = (10+ ((100-battler.stats.battle.cls_str)/2) + 20*Math.random())/100;
 			RPG.Order[0][3] *= endurance;
			// purge list of incapacitated battlers 
			let list = [];
			for (let battler of RPG.Order) {
				var pos = RPG.methods.getBattlerPosition(battler[2], battler[0]);
				if (battler[0] == RPG.vars.RPG_PARTY) {
					if (RPG.Battlers[pos][1] != RPG.vars.RPG_INCAPACITATED)
						list.push(battler);
				}
				else {
					if (RPG.EBattlers[pos][2] != RPG.vars.RPG_INCAPACITATED)
						list.push(battler);
				}
			}
			// resort the list
			list.sort(RPG.methods.sortBattlers);
			RPG.Order = list;
		}
		// set a couple of state parameters
		RPG.vars.RPG_IN_BATTLE = true;
		RPG.vars.RPG_STATE = RPG.vars.RPG_BATTLE_START;	  
		return RPG.Order;	 
	},
	doAttack: (a_stats, t_stats, defsupp, type, item) => {
		// compute damage on hp and sp based on a_stats (attacker) and t_stats (target)
		let damage = [[0, 0, RPG.vars.RPG_ACTIVE],[0, 0, RPG.vars.RPG_ACTIVE]];
		// damge = [[attacker_hp, attacker_sp, attacker_status], [target_hp, target_sp, target_status]]
		// note: a negative damage means it is a positive effect
		
		if (type == RPG.vars.RPG_ACTION_ATK) {
			// this is battler normal physical attack
			// determine hit factor, based on agility ratio
			let agi_ratio = (t_stats.cls_agi/a_stats.cls_agi) - 0.5;
			let hit = false;
			if (agi_ratio <= 0) 		// always hit
				hit = true;
			else if (agi_ratio >= 1)  	// always miss, do nothing
				hit = false;
			else 						// the lower the ratio, the higher chance of hit
				hit = (Math.random() > agi_ratio);
			if (!hit) 
				return damage;

			// determine damage to enemy based on batk and edef
			let full_damage = a_stats.cls_atk*4 - t_stats.cls_def*2 - defsupp*Math.random();
			if (t_stats.res_phy != undefined)
				full_damage -= full_damage * 0.3 * (t_stats.res_phy/100);
			full_damage *= 0.5 * (1 + (0.4*Math.random() - 0.2));	// +-20% variance
			// hp-only damage
			damage[1][0] = Math.floor(full_damage);
			return damage;
		}
		else if (type == RPG.vars.RPG_ACTION_SKL) {
			// this is battler skilled attack
			damage[0][1] = Math.floor(item.btl_sp);	// cost of doing the skill, regardless of hit
			// get skills used; skills may enhance attacker def, agi, atk
			let agi_ratio = (t_stats.cls_agi/(a_stats.cls_agi + ((item.btl_agi) ? item.btl_agi : 0))) - 0.5;
			let hit = false;
			if (agi_ratio <= 0) hit = true;
			else if (agi_ratio >= 1) hit = false;
			else hit = (Math.random() > agi_ratio);
			if (!hit) return damage;

			// skill affects only hp; no skill that drains/absorbs hp or sp yet
			let full_damage = ((a_stats.cls_atk + (item.btl_atk ? item.btl_atk : 0))*4) - t_stats.cls_def*2 - defsupp*Math.random();
			if ((item.attr == "phy") && (t_stats.res_phy != undefined))
				full_damage -= full_damage * 0.3 * (t_stats.res_phy/100);
			if ((item.attr == "elem") && (t_stats.res_elem != undefined))
				full_damage -= full_damage * 0.3 * (t_stats.res_elem/100);
			if ((item.attr == "magic") && (t_stats.res_magic != undefined))
				full_damage -= full_damage * 0.3 * (t_stats.res_magic/100);
			full_damage *= 0.5 * (1 + 0.4*Math.random() - 0.2);
			damage[1][0] = Math.floor(full_damage);
			return damage;
		}		
	},
	useItem: (t_stats, item) => {
		let damage = [0, 0, RPG.vars.RPG_ACTIVE];	// TODO: change this for full party items
		if (item[0].btl_hp) damage[0] = Math.floor(item[0].btl_hp);
		if (item[0].btl_sp) damage[1] = Math.floor(item[0].btl_sp);
		// TODO: check for items that neutralizes status here, e.g. antidote for RPG_POISONED
		if (item[0].btl_status) damage[2] = item.btl_status;
		RPG.methods.updateInventory(RPG.vars.RPG_INVENTORY_TYPE_ITEMS, item[0].id,-1);
		return damage;
	},
	getDefenseSupport: (position, side) => {
		if (position % 2 == 1)	return 0;
		let def = 0;
		let support;
		if (side == RPG.vars.RPG_PARTY) {
			if ((position-1 > 0) && (RPG.Battlers[position-1][0] != -1) && (RPG.Battlers[position-1][1] != RPG.vars.RPG_INACTIVE)) {
				support = RPG.methods.getBattlerFromIndex(RPG.Battlers[position-1][0], side);
				def += support.stats.battle.cls_def;
			}
			if ((position+1 < 4) && (RPG.Battlers[position+1][0] != -1) && (RPG.Battlers[position+1][1] != RPG.vars.RPG_INACTIVE)) {
				support = RPG.methods.getBattlerFromIndex(RPG.Battlers[position+1][0], side);
				def += support.stats.battle.cls_def;
			}
			return def/2;
		}
		else {
			if ((position-1 > 0) && (RPG.EBattlers[position-1][0] != -1) && (RPG.EBattlers[position-1][2] != RPG.vars.RPG_INACTIVE)) {
				support = RPG.methods.getBattlerFromIndex(RPG.EBattlers[position-1][0], RPG.EBattlers[position-1][1]);
				def += (RPG.EBattlers[position-1][1] == RPG.vars.RPG_ENEMY) ? support.stats.cls_def : support.stats.battle.cls_def;
			}
			if ((position+1 < 4) && (RPG.EBattlers[position+1][0] != -1) && (RPG.EBattlers[position+1][2] != RPG.vars.RPG_INACTIVE)) {
				support = RPG.methods.getBattlerFromIndex(RPG.EBattlers[position+1][0], RPG.EBattlers[position+1][1]);
				def += (RPG.EBattlers[position+1][1] == RPG.vars.RPG_ENEMY) ? support.stats.cls_def : support.stats.battle.cls_def;
			}
			return def/2;
		}
	},
	enhanceDefense: (index, side, on) => {
		if (side == RPG.vars.RPG_PARTY) {
			let battler = RPG.methods.getBattlerFromIndex(index, side);
			let factor = (on) ? RPG.vars.RPG_EDEFENSE_FACTOR : 1/RPG.vars.RPG_EDEFENSE_FACTOR;
			battler.stats.battle.cls_def *= factor;
			if (RPG.callback && RPG.callback.showBattlerDefense) {
				RPG.callback.showBattlerDefense(index, on);
			} 	
		}
		else {
			// NB: minions have no unique index, use name instead
			let factor = (on) ? RPG.vars.RPG_EDEFENSE_FACTOR : 1/RPG.vars.RPG_EDEFENSE_FACTOR;
			let pos = RPG.methods.getBattlerPosition(index, side);
			if (RPG.EBattlers[pos][1] != RPG.vars.RPG_ENEMY_BOSS) {
				RPG.EBattlers[pos][5] *= factor;
			}
			else {
				let boss = RPG.methods.getBattlerFromIndex(RPG.EBattlers[pos][0], RPG.vars.RPG_ENEMY_BOSS);
				boss.stats.battle.cls_def *= factor;
			}
			if (RPG.callback && RPG.callback.showEnemyDefense) {
				RPG.callback.showEnemyDefense(index, on);
			}
		}
	},
	checkBattleEnd: () => {
		let end = true;
		for (let battler of RPG.Battlers) {
			if (battler[1] == -1) continue;
			if (battler[1] != RPG.vars.RPG_INACTIVE) {
				end = false;
				break;
			}
		}
		if (end) return RPG.vars.RPG_ENEMY;
		end = true;
		for (let battler of RPG.EBattlers) {
			if (battler[2] == -1) continue;
			if (battler[2] != RPG.vars.RPG_INACTIVE) {
				end = false;
				break;
			}
		}
		if (end) return RPG.vars.RPG_PARTY;
		return -1;
	},
	checkPartyEmpty: () => {
		for (let battler of RPG.Battlers) {
			if (battler[0] != -1) {
				return false;
			}
		}
		// can not do battle if party is empty
		RPG.vars.RPG_STATE = RPG.vars.RPG_BATTLE_SKIP;
		return true;
	},
	chooseTarget: (side) => {
		let targets = [];
		if (side == RPG.vars.RPG_PARTY) {
			for (let btlr of RPG.Battlers) {
				if ((btlr[0] != -1) && (btlr[1] != RPG.vars.RPG_INACTIVE)) {
					let battler = RPG.methods.getBattlerFromIndex(btlr[0], side);
					targets.push([btlr[0], battler.stats.battle.cls_hp/battler.stats.class.cls_hp]);
				}
			}
			if (targets.length > 0) {
				targets.sort(RPG.methods.sortTargets);
				if (Math.random() > 0.4)	// 60% probability to choose most damaged target
					return targets[0][0];
				return targets[Math.round(Math.random()*(targets.length-1))][0];
			}
			return -1;
		}
		else {
			// TODO
		}
	},
	getStatusText: (status) => {
		switch (status) {
			case RPG.vars.RPG_INCAPACITATED:
			case RPG.vars.RPG_INACTIVE:
				return "Inactive";
			case RPG.vars.RPG_POISONED:
				return "Poisoned";
			case RPG.vars.RPG_STUNNED:
				return "Stunned";
			case RPG.vars.RPG_DEFENSE:
				return "Defense++";
			case RPG.vars.RPG_ACTIVE:
			default:
				return "Active";
		}
		
	},
	resetBattlers: () => {
		for (let battler of RPG.Battlers) {
			battler = [-1, -1];
		}
		for (let battler of RPG.EBattlers) {
			battler = [-1, -1, -1, -1, -1, -1, -1];
		}
		RPG.vars.RPG_IN_BATTLE = false;
		RPG.vars.RPG_STATE = RPG.vars.RPG_BATTLE_END;
		RPG.vars.RPG_ATTACKER = -1;
		RPG.vars.RPG_TARGET = -1;
	},
	selectBattlers: (pos) => {
		// TODO: if not yet in battle, clicking on bIcons should add actor to party
		//       if in battle, clicking on bIcons will set target  
		if (!RPG.vars.RPG_IN_BATTLE) {
			if (RPG.vars.RPG_ACTOR_SELECT < 0) return;
			let battler = RPG.methods.getBattlerAtPosition(pos);
			// select actor then position
			// if position already has actor, clear it
			if (battler[0] == RPG.vars.RPG_ACTOR_SELECT)
				RPG.methods.addActorToBattler(-1, pos);
			else  	
				RPG.methods.addActorToBattler(RPG.vars.RPG_ACTOR_SELECT, pos)
			if (RPG.callback && RPG.callback.updateBattlerIcons) {
				RPG.callback.updateBattlerIcons();
			}
			return false;
		} 
		else {
			if ((RPG.vars.RPG_STATE != RPG.vars.RPG_CHOOSE_SKILL_TARGET) && 
				(RPG.vars.RPG_STATE != RPG.vars.RPG_CHOOSE_ITEM_TARGET))
				return false;
			if ((RPG.Battlers[pos][0] == -1) || (RPG.Battlers[pos][1] == RPG.vars.RPG_INACTIVE)) return false;

			// TODO:
			RPG.vars.RPG_STATE = RPG.vars.RPG_DO_ACTION;
			RPG.vars.RPG_TARGET = parseInt(pos); // party are pos[0..4]
			return true;
		}
	},
	selectEnemy: (pos) => {
		if ((RPG.vars.RPG_STATE != RPG.vars.RPG_CHOOSE_TARGET) &&
			(RPG.vars.RPG_STATE != RPG.vars.RPG_CHOOSE_SKILL_TARGET) &&
			(RPG.vars.RPG_STATE != RPG.vars.RPG_CHOOSE_ITEM_TARGET)) 
			return false;
		if ((RPG.EBattlers[pos][0] == -1) || (RPG.EBattlers[pos][2] == RPG.vars.RPG_INACTIVE)) return false;
		if (RPG.vars.RPG_STATE == RPG.vars.RPG_CHOOSE_TARGET) {
			// normal attack can not attack back row unless using ranged or long weapon
			// or enemy front row is missing/inactive
			let battler = RPG.methods.getBattlerAtPosition(RPG.vars.RPG_ATTACKER);
			let weapon = RPG.methods.getActorEquipped(battler[0], RPG.vars.RPG_WEAPON);
			if ((pos%2 == 0) && 
				(((RPG.EBattlers[1][0] != -1) && (RPG.EBattlers[1][2] != RPG.vars.RPG_INACTIVE)) ||
				 ((RPG.EBattlers[3][0] != -1) && (RPG.EBattlers[3][2] != RPG.vars.RPG_INACTIVE))) &&
				((weapon.attr != "long") && (weapon.attr != "ranged")))
				return false;
		}

		RPG.vars.RPG_STATE = RPG.vars.RPG_DO_ACTION;
		RPG.vars.RPG_TARGET = parseInt(pos)+5;	// enemy are pos[5..9]
		return true;
	},
	startBattleLoop: () => {
		// TODO: while not end (party or enemy defeated)
		// get battler at top of battle order
		//	if party, wait for action
		//	if enemy, autoselect party and perform action
		// determine damage and update battlers
		// check for win
		// repeat until battle end

		if (RPG.vars.RPG_STATE == RPG.vars.RPG_BATTLE_START) {
			//var battler = this.getFirstBattler();
			if (RPG.Order[0][0] == RPG.vars.RPG_PARTY) {
				let pos = RPG.methods.getBattlerPosition(RPG.Order[0][1], RPG.vars.RPG_PARTY);
				if (RPG.callback) {
					if (RPG.callback.showBattlerControls)
						RPG.callback.showBattlerControls(pos);
					if (RPG.callback.showBattlerSprite)
						RPG.callback.showBattlerSprite(pos, false)
				}
				RPG.vars.RPG_STATE = RPG.vars.RPG_CHOOSE_ACTION;
				RPG.vars.RPG_ATTACKER = parseInt(pos);
			}
			else if (RPG.Order[0][0] == RPG.vars.RPG_ENEMY) {
				// minions names are appended with their position index
				let pos = parseInt(RPG.Order[0][2].substr(-1,1));
				if (RPG.callback && RPG.callback.showEnemySprite)
					RPG.callback.showEnemySprite(pos, false);

				RPG.vars.RPG_STATE = RPG.vars.RPG_ENEMY_ACTION;
				RPG.vars.RPG_ATTACKER = pos+5;
				RPG.methods.doEnemyAction();
			}
			else if (RPG.Order[0][0] == RPG.vars.RPG_ENEMY_BOSS) {
				let pos = RPG.methods.getBattlerPosition(RPG.Order[0][1], RPG.vars.RPG_ENEMY_BOSS);
				if (RPG.callback && RPG.callback.showEnemySprite)
					RPG.callback.showEnemySprite(pos, false);
				RPG.vars.RPG_STATE = RPG.vars.RPG_ENEMY_ACTION;
				RPG.vars.RPG_ATTACKER = parseInt(pos)+5;
				RPG.methods.doEnemyAction();
			}
		}
	},
	doBattlerAction: (action) => {
		if (RPG.vars.RPG_STATE != RPG.vars.RPG_CHOOSE_ACTION) {
			// action icon clicked again while action in process, this is a cancel mode
			return RPG.vars.RPG_ACTION_CANCEL;
		}
		RPG.vars.RPG_ACTION = action;	  
		if (action == RPG.vars.RPG_ACTION_ATK) {
			let battler = RPG.methods.getBattlerFromIndex(RPG.Battlers[RPG.vars.RPG_ATTACKER%5][0], RPG.vars.RPG_PARTY);
			if (RPG.callback && RPG.callback.showBattleMsg)
				RPG.callback.showBattleMsg(battler.id+RPG.vars.RPG_CONST_MSGS[16]);
			RPG.vars.RPG_STATE = RPG.vars.RPG_CHOOSE_TARGET;
		}
		else if (action == RPG.vars.RPG_ACTION_SKL) {
			RPG.vars.RPG_BSKILL_SELECT = 0;
			RPG.vars.RPG_STATE = RPG.vars.RPG_CHOOSE_SKILLS;
		}
		else if (action == RPG.vars.RPG_ACTION_ITM) {
			RPG.vars.RPG_ITEM_SELECT = 0;		
			RPG.vars.RPG_STATE = RPG.vars.RPG_CHOOSE_ITEMS;
		}
		else { // if (action == RPG.vars.RPG_ACTION_DEF)
			let battler = RPG.methods.getBattlerFromIndex(RPG.Battlers[RPG.vars.RPG_ATTACKER%5][0], RPG.vars.RPG_PARTY);
			if (RPG.callback && RPG.callback.showBattleMsg)
				RPG.callback.showBattleMsg(battler.id+RPG.vars.RPG_CONST_MSGS[18]);
			RPG.vars.RPG_STATE = RPG.vars.RPG_DO_ACTION;		  
		}
		return action;		
	},
	doSelectedAction: () => {
		if (RPG.vars.RPG_STATE != RPG.vars.RPG_DO_ACTION) return false;

		if ((RPG.vars.RPG_ACTION == RPG.vars.RPG_ACTION_ATK) || 
		    (RPG.vars.RPG_ACTION == RPG.vars.RPG_ACTION_SKL)) {
			let attacker = RPG.methods.getBattlerFromIndex(RPG.Battlers[RPG.vars.RPG_ATTACKER%5][0], RPG.vars.RPG_PARTY);
			if (RPG.Battlers[RPG.vars.RPG_ATTACKER%5][1] == RPG.vars.RPG_DEFENSE) {
				// remove attacker defense status
				RPG.Battlers[RPG.vars.RPG_ATTACKER%5][1] = RPG.vars.RPG_ACTIVE;
				RPG.methods.enhanceDefense(RPG.Battlers[RPG.vars.RPG_ATTACKER%5][0], RPG.vars.RPG_PARTY, false);
			}
			let target = RPG.methods.getBattlerFromIndex(RPG.EBattlers[RPG.vars.RPG_TARGET%5][0], RPG.EBattlers[RPG.vars.RPG_TARGET%5][1]);
			// TODO: RPG.Enemies passed by reference and modified, create a copy instead
			let t_stats = {};
			if (RPG.EBattlers[RPG.vars.RPG_TARGET%5][1] == RPG.vars.RPG_ENEMY) {
				for (let prop in target.stats) {
					if (target.stats.hasOwnProperty(prop)) {
						t_stats[prop] = target.stats[prop];
					}
				}
				t_stats.cls_def = RPG.EBattlers[RPG.vars.RPG_TARGET%5][5];	// update battle def for minion
			}
			let defsupp = RPG.methods.getDefenseSupport(RPG.vars.RPG_TARGET%5, RPG.vars.RPG_ENEMY);
			let skill = null;
			if (RPG.vars.RPG_ACTION == RPG.vars.RPG_ACTION_SKL) {
				let list = RPG.methods.getBattlerNonpassiveSkills(RPG.Battlers[RPG.vars.RPG_ATTACKER%5][0], RPG.vars.RPG_PARTY);
				skill = list[RPG.vars.RPG_SELECTED];			
			}
			let damage = RPG.methods.doAttack(attacker.stats.battle, 
						(RPG.EBattlers[RPG.vars.RPG_TARGET%5][1] == RPG.vars.RPG_ENEMY) ? t_stats : target.stats.battle, 
						defsupp, RPG.vars.RPG_ACTION, skill);
			RPG.methods.updateDamage(damage, RPG.vars.RPG_ATTACKER%5, RPG.vars.RPG_TARGET%5);
			if ((RPG.EBattlers[RPG.vars.RPG_TARGET%5][2] == RPG.vars.RPG_DEFENSE) && 
				(RPG.methods.checkDamage(damage[1]))) {
				// remove target defense status if hit
				RPG.EBattlers[RPG.vars.RPG_TARGET%5][2] = RPG.vars.RPG_ACTIVE;
				RPG.methods.enhanceDefense((RPG.EBattlers[RPG.vars.RPG_TARGET%5][1] == RPG.vars.RPG_ENEMY)? target.name+RPG.vars.RPG_TARGET%5 : target.id, RPG.EBattlers[RPG.vars.RPG_TARGET%5][1], false);
			}
		}
		else if (RPG.vars.RPG_ACTION == RPG.vars.RPG_ACTION_DEF) {
			// defend takes effect when attacked once or until next turn
			if (RPG.Battlers[RPG.vars.RPG_ATTACKER%5][1] != RPG.vars.RPG_DEFENSE) {
				RPG.Battlers[RPG.vars.RPG_ATTACKER%5][1] = RPG.vars.RPG_DEFENSE;
				RPG.methods.enhanceDefense(RPG.Battlers[RPG.vars.RPG_ATTACKER%5][0], RPG.vars.RPG_PARTY, true);
			}
		}
		else if (RPG.vars.RPG_ACTION == RPG.vars.RPG_ACTION_ITM) {
			// TODO: for now, items just restore hp and sp, no attacking/damaging items yet
			//var attacker = this.getBattlerFromIndex(RPG.Battlers[RPG.vars.RPG_ATTACKER%5][0], RPG.vars.RPG_PARTY);
			let target = -1;
			let list = RPG.methods.getInventoryList(RPG.vars.RPG_INVENTORY_TYPE_ITEMS, true);
			let item = list[RPG.vars.RPG_SELECTED];
			if (RPG.vars.RPG_TARGET < 5) {
				target = RPG.methods.getBattlerFromIndex(RPG.Battlers[RPG.vars.RPG_TARGET][0], RPG.vars.RPG_PARTY);
				// to be consistent, restoration is a negative damage
				let damage = RPG.methods.useItem(target.stats.battle, item);
				RPG.methods.updateDamage(damage, RPG.vars.RPG_TARGET, null);	// damage to party
			}
			else {
				target = RPG.methods.getBattlerFromIndex(RPG.EBattlers[RPG.vars.RPG_TARGET%5][0], RPG.EBattlers[RPG.vars.RPG_TARGET%5][1]);
				// TODO: RPG.Enemies passed by reference and modified, create a copy instead
				if (RPG.EBattlers[RPG.vars.RPG_TARGET%5][1] == RPG.vars.RPG_ENEMY) {
					let t_stats = {};
					for (let prop in target.stats) {
						if (target.stats.hasOwnProperty(prop)) {
							t_stats[prop] = target.stats[prop];
						}
					}
					t_stats.cls_def = RPG.EBattlers[RPG.vars.RPG_TARGET%5][5];	// update battle def for minion
				}
				let damage = RPG.methods.useItem((RPG.EBattlers[RPG.vars.RPG_TARGET%5][1] == RPG.vars.RPG_ENEMY) ? t_stats : target.stats.battle,
												 item);
				RPG.methods.updateDamage(damage, null, RPG.vars.RPG_TARGET%5);
			}
		}
		// check if battle end
		let win = RPG.methods.checkBattleEnd();
		if (win == -1) {
			if (RPG.callback && RPG.callback.resumeBattle)
				RPG.callback.resumeBattle(RPG.vars.RPG_TIMEOUT);
		}
		else {
			// TODO: party last made a move, then party wins here
			if (win != RPG.vars.RPG_PARTY) return false;
			Helper.setValue("_rpg_battle_win", true);
			RPG.methods.updateBattleExp();
			RPG.methods.clearBattlerStatus();

			setTimeout(() => {
				if (RPG.callback && RPG.callback.showMsg)
					RPG.callback.showMsg(RPG.vars.RPG_CONST_MSGS[21]);
				if (RPG.callback && RPG.callback.showEnd)
					RPG.callback.showEnd(true);
			}, RPG.vars.RPG_TIMEOUT);

		}
		return true;
	},
	doEnemyAction: () => {
		if (RPG.vars.RPG_STATE != RPG.vars.RPG_ENEMY_ACTION) return;
		// enemy has only 3 actions: attack, skill, defend
		// attack and skill has equal probability unless sp < required
		// defend may occur when hp < 10%
		let attacker = RPG.methods.getBattlerFromIndex(RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][0], RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][1]);
		let hp, sp, basehp, def, skillset, name;
		if (RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][1] == RPG.vars.RPG_ENEMY) {
			basehp = RPG.Enemies[RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][0]].stats.cls_hp;
			hp = RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][3];
			sp = RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][4];
			def = RPG.Enemies[RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][0]].cls_def;
			skillset = RPG.Enemies[RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][0]].skill;
			name = attacker.name+(RPG.vars.RPG_ATTACKER%5);
		}
		else {
			basehp = attacker.stats.class.cls_hp;
			hp = attacker.stats.battle.cls_hp;
			sp = attacker.stats.battle.cls_sp;
			def = attacker.stats.battle.cls_def;
			skillset = attacker.stats.skill;
			name = attacker.id;
		}

		// choose what action to do
		let skill = RPG.methods.chooseRandomSkill(skillset, sp);
		let defend = (hp/basehp > 0.1) ? false : (Math.random() > 0.5);
		let doatk = RPG.methods.canBattlerAttackAtPosition(RPG.vars.RPG_ATTACKER);

		// choose target from battlers with preference to those with damage
		let target = RPG.methods.chooseTarget(RPG.vars.RPG_PARTY);
		if ((target >= 0) && (skill < 0)) {	// this will do normal attack
			let position = RPG.methods.getBattlerPosition(target, RPG.vars.RPG_PARTY);
			let battler = RPG.methods.getBattlerAtPosition(RPG.vars.RPG_ATTACKER);
			let ranged = false;
			if (battler[1] == RPG.vars.RPG_ENEMY) {
				for (let eqp of RPG.Enemies[battler[0]].eqp) {
					if ((RPG.Equipment[eqp].attr == "ranged") ||
						(RPG.Equipment[eqp].attr == "long"))
						ranged = true;
				}
			}
			if ((position%2 == 0) && !ranged &&
				(((RPG.Battlers[1][0] != -1) && (RPG.Battlers[1][1] != RPG.vars.RPG_INACTIVE)) ||
				 ((RPG.Battlers[3][0] != -1) && (RPG.Battlers[3][1] != RPG.vars.RPG_INACTIVE)))) 
				target = -1; //can not target backrow
		}

		//if (!defend) {
		if (!defend && (target>=0) && (doatk || (skill > 0))) { 
			// this is normal or skill attack
			RPG.vars.RPG_ACTION = (skill<0) ? RPG.vars.RPG_ACTION_ATK : RPG.vars.RPG_ACTION_SKL;
			if (RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][2] == RPG.vars.RPG_DEFENSE) {
				// remove attacker defense status
				RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][2] = RPG.vars.RPG_ACTIVE;
				RPG.methods.enhanceDefense(name, RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][1], false);
			}
			
			let position = RPG.methods.getBattlerPosition(target, RPG.vars.RPG_PARTY);
			if (RPG.callback && RPG.callback.showBattlerSprite) {
				RPG.callback.showBattlerSprite(position, true);
			}
			RPG.vars.RPG_TARGET = position;
			if (RPG.callback && RPG.callback.showBattleMsg) {
				if (skill < 0)
					RPG.callback.showBattleMsg(name+RPG.vars.RPG_CONST_MSGS[16]);
				else
					RPG.callback.showBattleMsg(name+RPG.vars.RPG_CONST_MSGS[19]+RPG.Skills[skill].name);
			}
		}
		else {
			// enemy chooses to defend
			RPG.vars.RPG_ACTION = RPG.vars.RPG_ACTION_DEF;
			if (RPG.callback && RPG.callback.showBattleMsg)
				RPG.callback.showBattleMsg(name+RPG.vars.RPG_CONST_MSGS[18]);
			if (RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][2] != RPG.vars.RPG_DEFENSE) {
				RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][2] = RPG.vars.RPG_DEFENSE;
				RPG.methods.enhanceDefense(name, RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][1], true);
			}
		}

		// continue enemy action
		setTimeout(() => {
			if ((RPG.vars.RPG_ACTION == RPG.vars.RPG_ACTION_ATK) || 
				(RPG.vars.RPG_ACTION == RPG.vars.RPG_ACTION_SKL)) {
				let attacker = RPG.methods.getBattlerFromIndex(RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][0], RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][1]); 
				let target = RPG.methods.getBattlerFromIndex(RPG.Battlers[RPG.vars.RPG_TARGET%5][0], RPG.vars.RPG_PARTY);
				let defsupp = RPG.methods.getDefenseSupport(RPG.vars.RPG_TARGET%5, RPG.vars.RPG_PARTY);
				let damage = RPG.methods.doAttack((RPG.EBattlers[RPG.vars.RPG_ATTACKER%5][1] == RPG.vars.RPG_ENEMY) ? attacker.stats : attacker.stats.battle, 
								target.stats.battle, defsupp, RPG.vars.RPG_ACTION, (skill<0) ? null : RPG.Skills[skill]);
				// hack to use same macro on enemy attacks
				let reverse_damage = [damage[1], damage[0]];
				RPG.methods.updateDamage(reverse_damage, RPG.vars.RPG_TARGET%5, RPG.vars.RPG_ATTACKER%5);
				if (RPG.callback && RPG.callback.updateBattlerIcons)
					RPG.callback.updateBattlerIcons();	
				if ((RPG.Battlers[RPG.vars.RPG_TARGET%5][1] == RPG.vars.RPG_DEFENSE) && 
					(RPG.methods.checkDamage(damage[1]))) {
					// remove target defense status if hit
					RPG.Battlers[RPG.vars.RPG_TARGET%5][1] = RPG.vars.RPG_ACTIVE;
					RPG.methods.enhanceDefense(RPG.Battlers[RPG.vars.RPG_TARGET%5][0], RPG.vars.RPG_PARTY, false);
				}
						
				// check if battle end
				let win = RPG.methods.checkBattleEnd();
				if (win == -1) {
					if (RPG.callback && RPG.callback.resumeBattle)
						RPG.callback.resumeBattle(RPG.vars.RPG_TIMEOUT);
				}
				else {
					// TODO: win here
					if (win != RPG.vars.RPG_ENEMY) return false;
					Helper.setValue("_rpg_battle_win", false);
					RPG.methods.clearBattlerStatus();

					setTimeout(() => {
						if (RPG.callback && RPG.callback.showMsg)
							RPG.callback.showMsg(RPG.vars.RPG_CONST_MSGS[22]);
						if (RPG.callback && RPG.callback.showEnd)
							RPG.callback.showEnd(false);
					}, RPG.vars.RPG_TIMEOUT);						
				}
			}
			else if (RPG.vars.RPG_ACTION == RPG.vars.RPG_ACTION_DEF) {
				if (RPG.callback && RPG.callback.resumeBattle)
					RPG.callback.resumeBattle(RPG.vars.RPG_TIMEOUT/2);
			}
		}, RPG.vars.RPG_TIMEOUT/2);
		return true;
	},
	checkDamage: (damage) => {
		for (let d of damage) {
			if (d != 0) return true;
		}
		return false;
	},
	updateDamage: (damage, party, enemy) => {
		let pmissed=false, emissed=false;
		if ((RPG.vars.RPG_ACTION == RPG.vars.RPG_ACTION_ATK) || 
			(RPG.vars.RPG_ACTION == RPG.vars.RPG_ACTION_SKL)) {
			if (RPG.methods.checkDamage(damage[0])) {
				let battler = RPG.methods.getBattlerFromIndex(RPG.Battlers[party][0], RPG.vars.RPG_PARTY);
				battler.stats.battle.cls_hp = Math.max(0, battler.stats.battle.cls_hp-damage[0][0]);
				battler.stats.battle.cls_sp = Math.max(0, battler.stats.battle.cls_sp-damage[0][1]);
				if (battler.stats.battle.cls_hp == 0)
					RPG.Battlers[party][1] = RPG.vars.RPG_INACTIVE;
				else if (damage[0][2] != 0)
					RPG.Battlers[party][1] = damage[0][2];
				if (RPG.callback && RPG.callback.showBattlerDamage)
					RPG.callback.showBattlerDamage(party, damage[0], 
						((battler.stats.battle.cls_hp == 0) || (damage[0][2] != 0)) ? RPG.Battlers[party][1] : RPG.vars.RPG_ACTIVE);
			}
			else pmissed = true;
			if (RPG.methods.checkDamage(damage[1])) {
				if (RPG.EBattlers[enemy][1] == RPG.vars.RPG_ENEMY) {
					RPG.EBattlers[enemy][3] = Math.max(0, RPG.EBattlers[enemy][3]-damage[1][0]);
					RPG.EBattlers[enemy][4] = Math.max(0, RPG.EBattlers[enemy][4]-damage[1][1]);				  
					if (RPG.EBattlers[enemy][3] == 0)
						RPG.EBattlers[enemy][2] = RPG.vars.RPG_INACTIVE;
					else if (damage[1][2] != 0)
						RPG.EBattlers[enemy][2] = damage[1][2];
				}
				else {
					let boss = RPG.methods.getBattlerFromIndex(RPG.EBattlers[enemy][0], RPG.vars.RPG_ENEMY_BOSS);
					boss.stats.battle.cls_hp = Math.max(0, boss.stats.battle.cls_hp-damage[1][0]);
					boss.stats.battle.cls_sp = Math.max(0, boss.stats.battle.cls_sp-damage[1][1]);
					if (boss.stats.battle.cls_hp == 0)
						RPG.EBattlers[enemy][2] = RPG.vars.RPG_INACTIVE;
					else if (damage[1][2] != 0)
						RPG.Battlers[enemy][2] = damage[1][2]; 
				}
				if (RPG.callback && RPG.callback.showEnemyDamage) {
					RPG.callback.showEnemyDamage(enemy, damage[1], 
						//((RPG.EBattlers[enemy][3] == 0) || (damage[1][2] != 0)) ? RPG.EBattlers[enemy][2] : RPG.vars.RPG_ACTIVE);
						((RPG.EBattlers[enemy][2] == RPG.vars.RPG_INACTIVE) || (damage[1][2] != 0)) ? RPG.EBattlers[enemy][2] : RPG.vars.RPG_ACTIVE);
					}
			}
			else emissed = true;

			if (pmissed) {
				if (RPG.vars.RPG_STATE == RPG.vars.RPG_ENEMY_ACTION) {
                    let name;
					if (RPG.EBattlers[enemy][1] == RPG.vars.RPG_ENEMY)
						name = RPG.Enemies[RPG.EBattlers[enemy][0]].name + enemy;
					else
						name = RPG.methods.getBattlerFromIndex(RPG.EBattlers[enemy][0],RPG.vars.RPG_ENEMY_BOSS).id;
					if (RPG.callback && RPG.callback.showBattleMsg)
						RPG.callback.showBattleMsg(name + RPG.vars.RPG_CONST_MSGS[17]);
					// charge skill even if enemy missed
					if (RPG.vars.RPG_ACTION == RPG.vars.RPG_ACTION_SKL) {
						//RPG.EBattlers[enemy][4] = Math.max(0, RPG.EBattlers[enemy][4]-damage[1][1]);				  
						if (RPG.callback && RPG.callback.showEnemyDamage) {
							RPG.callback.showEnemyDamage(enemy, damage[1], 
								((RPG.EBattlers[enemy][3] == 0) || (damage[1][2] != 0)) ? RPG.EBattlers[enemy][2] : RPG.vars.RPG_ACTIVE);
						}
					}
				}
			}
			if (emissed) {
				if (RPG.vars.RPG_STATE == RPG.vars.RPG_DO_ACTION) {
					let battler = RPG.methods.getBattlerFromIndex(RPG.Battlers[party][0], RPG.vars.RPG_PARTY);
					if (RPG.callback && RPG.callback.showBattleMsg)
						RPG.callback.showBattleMsg(battler.id+RPG.vars.RPG_CONST_MSGS[17]);			
					if (RPG.vars.RPG_ACTION == RPG.vars.RPG_ACTION_SKL) {
						//battler.stats.battle.cls_sp = Math.max(0, battler.stats.battle.cls_sp-damage[0][1])
						if (RPG.callback && RPG.callback.showBattlerDamage)
							RPG.callback.showBattlerDamage(party, damage[0], 
								((battler.stats.battle.cls_hp == 0) || (damage[0][2] != 0)) ? RPG.Battlers[party][1] : RPG.vars.RPG_ACTIVE);
					}
				}
			}
		}
		else if (RPG.vars.RPG_ACTION == RPG.vars.RPG_ACTION_ITM) {
			if (party != null) { // this is item applied to party
				let battler = RPG.methods.getBattlerFromIndex(RPG.Battlers[party][0], RPG.vars.RPG_PARTY);
				battler.stats.battle.cls_hp = Math.min(battler.stats.class.cls_hp, battler.stats.battle.cls_hp-damage[0]);
				battler.stats.battle.cls_sp = Math.min(battler.stats.class.cls_sp, battler.stats.battle.cls_sp-damage[1]);
				if (damage[2] != RPG.vars.RPG_ACTIVE) RPG.Battlers[party][1] = damage[2];

				if (RPG.callback && RPG.callback.showBattlerDamage)
					RPG.callback.showBattlerDamage(party, damage, 
						(damage[0][2] != 0) ? RPG.Battlers[party][1] : RPG.vars.RPG_ACTIVE);
			}
			else if (enemy != null) { // this is item applied to enemy
				if (RPG.EBattlers[enemy][1] == RPG.vars.RPG_ENEMY) {
					RPG.EBattlers[enemy][3] = Math.min(RPG.Enemies[RPG.EBattlers[enemy][0]].stats.cls_hp, RPG.EBattlers[enemy][3]-damage[0]);
					RPG.EBattlers[enemy][4] = Math.min(RPG.Enemies[RPG.EBattlers[enemy][0]].stats.cls_hp, RPG.EBattlers[enemy][4]-damage[1]);				  
					if (damage[1][2] != 0) RPG.EBattlers[enemy][2] = damage[2];
				}
				else {
					let boss = RPG.methods.getBattlerFromIndex(RPG.EBattlers[enemy][0], RPG.vars.RPG_ENEMY_BOSS);
					boss.stats.battle.cls_hp = Math.min(boss.stats.class.cls_hp, boss.stats.battle.cls_hp-damage[0]);
					boss.stats.battle.cls_sp = Math.min(boss.stats.class.cls_sp, boss.stats.battle.cls_sp-damage[1]);
					if (damage[2] != RPG.vars.RPG_ACTIVE) RPG.EBattlers[enemy][1] = damage[2];
				}

				if (RPG.callback && RPG.callback.showEnemyDamage) {
					RPG.callback.showEnemyDamage(enemy, damage, 
						(damage[1][2] != 0) ? RPG.EBattlers[enemy][2] : RPG.vars.RPG_ACTIVE);
				}
			}
		}
	},
	selectBattleItem: (index) => {
		let battler = RPG.methods.getBattlerFromIndex(RPG.Battlers[RPG.vars.RPG_ATTACKER%5][0], RPG.vars.RPG_PARTY);
		if (RPG.vars.RPG_STATE == RPG.vars.RPG_CHOOSE_SKILLS) {
			// TODO: for now all skills target individual, i.e. target="one"
			let list = RPG.methods.getBattlerNonpassiveSkills(RPG.Battlers[RPG.vars.RPG_ATTACKER%5][0], RPG.vars.RPG_PARTY);
			RPG.callback.showBattleMsg(battler.id+RPG.vars.RPG_CONST_MSGS[19]+list[index].name);
			RPG.vars.RPG_STATE = RPG.vars.RPG_CHOOSE_SKILL_TARGET;
			return true;
		}
		else if (RPG.vars.RPG_STATE == RPG.vars.RPG_CHOOSE_ITEMS) {
			// TODO: for now all items target individual, i.e. target="one"
			let list = RPG.methods.getInventoryList(RPG.vars.RPG_INVENTORY_TYPE_ITEMS, true);
			RPG.callback.showBattleMsg(battler.id+RPG.vars.RPG_CONST_MSGS[20]+list[index][0].name);
			RPG.vars.RPG_STATE = RPG.vars.RPG_CHOOSE_ITEM_TARGET;
			return true;
		}
		return false;
	},
	updateBattleExp: () => {
		// get total enemy experience points
		let points = 0;
		for (let battler of RPG.EBattlers) {
			if (battler[1] == RPG.vars.RPG_ENEMY)
				points += RPG.Enemies[battler[0]].exp;
			else if (battler[1] == RPG.vars.RPG_ENEMY_BOSS)
				points += RPG.Actors[battler[0]][6];
		}
		// surviving battlers get full points
		// non-surviving battlers get half points
		// not-participating battlers get quarter points
		let list = RPG.methods.getActive();
		for (let active of list) {
			let found = false;
			let exp = Helper.getValue(active.id+"_exp");;
			for (let battler of RPG.Battlers) {
				if (battler[0] == -1) continue;
				if (active.id == RPG.Actors[battler[0]][0]) {
					if (battler[1] != RPG.vars.RPG_INACTIVE)
						Helper.setValue(active.id+"_exp", exp+points); 
					else
						Helper.setValue(active.id+"_exp", exp+Math.round(0.5*points)); 
					found = true;
					break;
				}
			}
			if (!found) 
				Helper.setValue(active.id+"_exp", exp+Math.round(0.25*points)); 
		}
	},
	clearBattlerStatus: () => {
		for (let battler of RPG.Battlers) {
			if (battler[0] == -1) continue;
			// restore battle status to normal
			// TODO: other status such as POISONED?
			battler[1] = RPG.vars.RPG_ACTIVE;
			let actor = RPG.methods.getActorFromId(RPG.Actors[battler[0]][0]);
			actor.stats.battle.cls_def = actor.stats.class.cls_def;
			actor.stats.battle.cls_hp = Math.max(1, actor.stats.battle.cls_hp);
		}
	},
};

}); //require