///////////////////////////////////////////////////////////////////////////////
//  This is a set of Data structures for RPG Mod Pack of VN-CANVAS           //
//  Used by vnmod-rpg-0.8+.                                                  //
//                                                                           //
//  Customize per game                                                       //  
///////////////////////////////////////////////////////////////////////////////

// add here reference to where Config is defined
//require(["../../demo/demo-config"], function() {


///////////////////////////////////////////////////////////////////////////////
// Initialization: DO NOT REMOVE base classes, but feel free to add
///////////////////////////////////////////////////////////////////////////////
/*
[Stats] / gender
		/ level
        / class		  / name
					  / hp
					  / sp
					  / [place other stats here]
	    / exp
	    / eqp		  / weapon
					  / shield
					  / head
					  / body
					  / accessory
	    / relationship/ 
		/ battle	  / hp
		              / sp
					  / [place other stats here]
		/ active
*/

if ((Config === null) || (Config === undefined))
	var Config = {};
Config.modRPG = true;					// this identifies the mod pack
var RPG = {};							// RPG base class
var Stats = null;						// prevent conflict with Stats here, optional

///////////////////////////////////////////////////////////////////////////////
// Game Specific Data Section: customize per game
///////////////////////////////////////////////////////////////////////////////
RPG.Actors = [
	//note: the order of attributes correspond to the order of RPG.Stats below
	//note: actor name must match actorID to inherit the stats
	//note: define custom battle_sprite, so it'll be indendent of in-story sprites

	//name, 	gender,	level, eqp, skill, class, exp, battle, active, skillpts, battle_sprite
	["Hero", 	0, 		1, 	   1,	1,     0,     0,   0,      1,      0,		 "demo/dad01.png"],
	["Heroine",	1, 		1, 	   2,   0,     1,     0,   0,      1,      0,		 "demo/mom01.png"],
	
	// this is a level 3 boss with class=2; note active=0, exp is pts gained when boss defeated
	["Boss",	1,		3,	   0,   2,     2,     25,   0,     0,      0,		 "demo/vina02.png"],
];
RPG.Inventory = [
	// inventory list, tied with equipment and items
	// initial equipment and items owned should be listed here
	// this array will be updated in game as more items are gained
	// type: equipment=0, items=1

	// type, id, quantity, owner_list
	[0, 	1, 		1,		[]],
	[0, 	2, 		1,		[]],
	[0, 	5, 		1,		[]],
	[0, 	6, 		1,		[]],
	[0, 	8, 		2,		[]],
	[1, 	0, 		500,	[]],	// owner_list is don't-care for items
	[1, 	1, 		5,		[]],
	[1, 	2, 		3,		[]],
	[1, 	3, 		1,		[]],
];
RPG.Quests = [
	// this gives the status of current and completed quests
	// tied to quest list below, quests may have subquests
	// this array will be updated in game
	// note: active are quests still being pursued and have possibility of immediate completion
	//       inactive quests are quests that still have dependency for completion
	
	// id, active, completed 
	// [2, true,   false],
];
RPG.Battlers = [
	// this gives the battler formation as below
	//  0		- Back row, left
	//    1		- Front row, left
	//  2		- Back row, middle
	//    3		- Front row, right
	//  4		- Back row, right
	
	// index, status (-1:none, 0:active, 1:incapacitated)
	[-1, -1],
	[-1, -1],
	[-1, -1],
	[-1, -1],
	[-1, -1],	
];
RPG.EBattlers = [
	// similar to RPG.Battlers, but for enemies
	// note: hp, sp, def, atk are for tracking minions stats only
	//       boss' stats are included in boss' stats.battle
	// index, boss, status, hp, sp, def, atk
	[-1, -1, -1, -1, -1, -1, -1], 
	[-1, -1, -1, -1, -1, -1, -1], 
	[-1, -1, -1, -1, -1, -1, -1], 
	[-1, -1, -1, -1, -1, -1, -1], 
	[-1, -1, -1, -1, -1, -1, -1], 
]
RPG.Order = [
	// determine next 10 turns of battlers
	// type, index, name, speed
	// type: actor=0, minion=1, boss=2 
	// [-1, -1, "", -1],
]

RPG.Class = [
	// base stats per class, can be affected by equipment and level/experience
	// type, hp_growth, sp_growth, atk_growth, def_growth, exp_growth, +other stats
	// use #level# to refer to actor level
	// for purposes of computations, let's limit stats (atk, def, str, agi) from 0 to 100 value only
	// all other stats (hp, sp, exp) have no limits
	{id:0, name:"Warrior", cls_hp:"#level#*30+70", cls_sp:"#level#*5+20", cls_atk:"#level#*2+10", 	cls_def:"#level#*2+9", cls_str:"#level#*2+10", cls_agi:"#level#*2+5", cls_exp:"#level#*20+#level#*(#level#-1)*21"} ,
	{id:1, name:"Mage", cls_hp:"#level#*20+30", cls_sp:"#level#*10+30", cls_atk:"#level#*3+5", cls_def:"#level#*1+7", cls_str:"#level#*1+6", cls_agi:"#level#*4+3", cls_exp:"#level#*20+#level#*(#level#-1)*21"},
	{id:2, name:"Villain", cls_hp:"#level#*25+25", cls_sp:"#level#*15+20",cls_atk:"#level#*2+5", cls_def:"#level#*1+5", cls_str:"#level#*1+4", cls_agi:"#level#*3+1", cls_exp:0},
];
RPG.Resistance = [
	// base class resistances to attacks; higher value indicates higher resistance
	// can be used to scale/compute damage received in battles
	// can be affected by equipment
	// must be arranged in same order as RPG.Class
	// weak:0-25, normal:26-50, resist:51-75, strong:76-100
	// physical, magical, elemental (or expand like fire magic, water element, earth physical, whatever)
	{res_phy:60, res_magic:20, res_elem:50},	// for Warrior class
	{res_phy:20, res_magic:50, res_elem:30},	// for Mage class
	{res_phy:10, res_magic:40, res_elem:40},	// for Villain class
];
RPG.Equipment = [
	// a list of equipment and how it affects actor stats
	// name: equipment id
	// type: all(-1), weapon(0), shield(1), head(2), body(3), accessory(4), feet(5)
	// class: actor class that can use equipment
	// cls_*, res_*: added to base class stat, must be index 3 and up (?)
	// attr: for weapons only; "long", "ranged", "normal" (default)
	//       only long or ranged weapon can attack back row (for all intents and purposes, long and ranged are equivalent)
	//		 unless front row of opponent is missing or has been decimated
	//		 e.g. dagger and short sword can only attack front row, arrow and spear can attack any row
	// note: no two-handed weapon yet, maybe later
	{id:0, name:"None", type:-1, weight:0, class:[0,1], description:""},			
	{id:1, name:"Sword", type:0, weight:2, attr:"long", class:[0], cls_atk:2, description:"A standard sword to defend yourself. Available at any WalMart branch.", cost:50},
	{id:2, name:"Staff", type:0, weight:1, attr:"long", class:[1], cls_atk:2, res_magic:20, description:"A staff embued with magic. Not to be confused with wands.", cost:200},
	{id:3, name:"Buckler", type:1, weight:1, class:[0], cls_def:5, cls_agi:-1, description:"A strong shield that looks like a tire's hubcap.", cost:40},
	{id:4, name:"Cap", type:2, weight:0, class:[0,1], cls_def:1, description:"Protection for the head. Usable also at baseball games.", cost:20},
	{id:5, name:"Plate", type:3, weight:1, class:[0], cls_def:2, cls_agi:-2, description:"Light body armor. Similar to a raincoat.", cost:50},
	{id:6, name:"Ring of Defense", type:4, weight:0, class:[1], cls_def:4, description:"A ring of invisible armor. Protection against imaginary weapons.", cost:100},
	{id:7, name:"Katana", type:0, weight:1, class:[0], cls_atk:4, description:"A premium Japanese-made sword. Buy at convenience stores nationwide.", cost: 100},
	{id:8, name:"Boots", type:5, weight:1, class:[0,1], cls_def:1, description:"A versatile all-terrain protection for the feet. Made in China.", cost: 20},
];
RPG.Items = [
	// a list of carry-able (not wearable) items that affects actor stats
	// Note: reserve id=0 for the money, this has special processing
	// btl_*: affects battle stats, e.g. potions
	// Note on signs: battle_stats (btl_hp, btl_sp) normally are for damages, so + means positive damage
	//     To be consistent, - means negative damage or restoration
	// Items ignore ranged attribute, so may be used even in back row
	{id:0, name:"Gold", weight:0, cap:0, description:"Your money. Exchangeable everywhere except at Gringotts."},
	{id:1, name:"Healing potion", weight:0, cap:1, cost:5, btl_hp:-20, target:"one", description:"Restores HP (+20). Cures warts."},
	{id:2, name:"Manna potion", weight:0, cap:1, cost:10, btl_sp:-10, target:"one", description:"Restores SP (+10). But not a broken heart."},
	{id:3, name:"Rejuvenation potion", weight:0, cap:1, cost:25, btl_hp:-20, btl_sp:-10, target:"one", description:"Restores HP (+20) and SP (+10). Good for breakfast too."},
];
RPG.Inn = [
	// a list of room types
	{id:0, name:"Single (1)", cap:1, description:"Room for one. Really private.", cost:50},
	{id:1, name:"Twin (2)", cap:2, description:"Room for two. Frenemies welcome.", cost:90},
	{id:2, name:"Double (2)", cap:2, description:"Room for two. Couples only.", cost:80},
	{id:3, name:"Suite (4+)", cap:4, description:"Room for four or more. Also for families.", cost:200},
	{id:4, name:"Penthouse (4+)", cap:4, description:"Room for four or more. Suite with a view.", cost:250},
]
RPG.Skills = [
	// a list of skillset per class
	// class: which actor class can use skill
	// type: skill level, not related to actor level; passive, beginner, novice, intermediate, expert, master
	// tree: dependency skill/s accdg to id
	// cls_*, res_*: skill effects that gets inherited permanently, usually passive
	// btl_*: affects battle stats, e.g. spells or attacks
	// pty_*: affects all/party stats, e.g. heal all
	// nmy_*: effects enemy stats, e.g. weaken
	// icon: optional, depends on icon_set
	// Note: skills ignore range attribute, so may be used even in back row
	{id:0, name:"None", class:[0,1], type:0, description:"Basic, no special skills"},	// default skillset
	{id:1, name:"Fighting", class:[0], type:0, tree:[0], cls_atk:"#level#", icon:11, description:"Improve fighting skills"},	// passives have no dependency
	{id:2, name:"Mind clear", class:[1], type:0, tree:[0], cls_sp:"#level#", icon:5, description:"Improve concentration when casting spells"},
	{id:3, name:"Slash", class:[0], type:1, tree:[1], btl_atk:5, btl_sp:5, icon:115, target:"one", attr:"phy", description:"Slash blade technique"},
	{id:4, name:"Burn", class:[1], type:1, tree:[2], btl_atk:5, btl_sp:7, icon:96, target:"one", attr:"elem", description:"Burn enemies"},
	{id:5, name:"Double-slash", class:[0], type:2, tree:[1,3], btl_atk:8, btl_sp:8, icon:131, attr:"phy", target:"one", description:"Slash twice in one turn"},
	{id:6, name:"Freeze", class:[1], type:1, tree:[2], btl_atk:5, btl_sp:7, icon:97, target:"one", attr:"elem", description:"Freeze enemies"},
];
RPG.QuestList = [
	{id:0, name:"Egg hunt", description:"Find the egg", hint:"Where do eggs come from?", requires:[1,2]},
	{id:1, name:"Chicken run", description:"Find the chicken", hint:"Where do chickens live?", requires:[2]},
	{id:2, name:"Farmville", description:"Find the chicken farm"},
	{id:3, name:"Another quest", description:"Placeholder for a quest"},
];
RPG.Enemies = [
	// a list of enemy members
	// There are two types of enemies: boss and minions (banana!)
	
	// Bosses are at RPG.Actors and are handled as regular actors except they do not 
	// receive EXP, so they do not level up like the heroes. Bosses need to be
	// created like regular actors. They can also be interacted with within the story.
	
	// The minions are here. Minions can be instantiated as needed and are infinite. 
	// Minions have no levels, just stats. Also sprites and avatars must be defined here.
	// Minions do not inherit stats of equipped items. The stats are absolute. Equipment just determine attack type, if available.
	{id:0, name:"Witch", stats:{cls_hp:50, cls_sp:40, cls_atk:10, cls_def:10, cls_str:5, cls_agi:6, res_magic:10}, eqp:[], skill:[4], exp:5, avatar:"demo/vina_avatar.png", sprite:"demo/vina03.png"},
	{id:1, name:"Wizard", stats:{cls_hp:50, cls_sp:50, cls_atk:15, cls_def:12, cls_str:6, cls_agi:4, res_magic:15}, eqp:[2], skill:[6], exp:7, avatar:"add_avatar_here", sprite:"add_battle_sprite_here"},	
];

///////////////////////////////////////////////////////////////////////////////
// User Modifiable Section: common to RPG, modification is optional
///////////////////////////////////////////////////////////////////////////////
RPG.Stats = {
	gender: {
		_value: ["male", "female"],
	},
	level: {								// must be declared before any level-dependent stats
		_range: [1, 99],					// allow levels 1 to 99
		_update: (obj, stat) => {
			// on a change of level, increase other stats here
			RPG.methods.updateAttr(obj.id, "class", obj.stats.class.id);
			// battle stats may be updated depending on difficulty
			// easy: increase stats to maximum, e.g. fully healed
			// normal: difference from max is maintained
			// difficult: no change in stats
			// for now, this is the "easy" settings
			RPG.methods.updateAttr(obj.id, "battle", obj.stats.class.id);
		},
	},
	eqp: {
		// _value is a default set of equipment at actor creation
		// arranged as weapon, shield, head, body, accessory
		_value: [[0,0,0,0,0,0], [1,0,0,5,0,0], [2,0,0,0,6,0]],
		// reference array for equipment, stats.eqp is linked to RPG.Equipment
		_reference: RPG.Equipment,		
		_update: (obj, eqp) => {
			// update with eqp modifying stats
			RPG.methods.updateAttr(obj.id, "class", obj.stats.class.id);
			RPG.methods.updateAttr(obj.id, "battle", obj.stats.class.id);
		},
	},
	skill: {
		// _value is a default set of actor skills at actor creation
		_value: [[0], [1], [2,4,6]],
		_reference: RPG.Skills,
		_update: (obj, skill) => {
			// TODO: update with skill modifying stats
			// Passive skills affect class stats
			// Non-passive skills affect battle stats when used
			if (skill.type == 0)
				RPG.methods.updateAttr(obj.id, "class", obj.stats.class.id);
			//RPG.methods.updateAttr(obj.id, "battle", obj.stats.class.id);
		}	
	},
	class: {
		_range: [0, 10],					// define up to n class types
		_inherit: [RPG.Class, RPG.Resistance, "#eqp#", "#skill#"],
											// #eqp# - special string to inherit equipped items
											// #skill# - special string to inherit learned skills
		_update: (obj, stat) => {
			// if class is updateable
			// Note: class stats automatically updated via _inherit
		}
	},
	exp: {
		_range: [0, 999999],				// allow up to ridiculously large experience
		_update: (obj, stat) => {
			// check if experience enough for a level change here
			let cur_lvl = obj.stats.level;
			let max_exp = stat.class.cls_exp;
			while (stat.exp > max_exp) {
				RPG.methods.updateAttr(obj.id, "level", stat.level+1);
				max_exp = obj.stats.class.cls_exp;
			}
			if (RPG.callback) {
				if ((obj.stats.level > cur_lvl) && (RPG.callback.showMsg)) {
					RPG.callback.showMsg(obj.id+" is now Level "+obj.stats.level);
				}
			}
		}
	},
	battle: {								// battle stats
		_inherit: ["#class#"],				// #class# - special string to inherit base actor stats.class
											// use #string# to refer to actor.stats["string"]
		_update: (obj, stat) => {
			// do not let battle stats exceed class stats
			for (var prop in stat.class) {
				if (stat.class.hasOwnProperty(prop)) {
					if (prop.search(/(cls)/g) != -1)
						stat.battle[prop] = Math.min(stat.class[prop], Math.max(0, stat.battle[prop]));
					if (prop.search(/(res)/g) != -1)
						stat.battle[prop] = Math.min(100, Math.max(0, stat.battle[prop]));
				}
			}
		},
	},
	active: {								// determines if actor is active
		_value: [false, true],
	},
	skillpts: {
		_range: [0, 10],					// learn up to n skills at a time	
		_update: (obj, stat) => {
			if (RPG.callback && (RPG.callback.showMsg)) {
				RPG.callback.showMsg(obj.id+" has "+obj.stats.skillpts+" skill points to use.");
			}
		}
	},
};

RPG.vars = {
  RPG_ACTOR_SELECT: 0,
  RPG_WEAPON_SELECT: 0,
  RPG_ITEM_SELECT: 0,
  RPG_QUEST_SELECT: 0,
  RPG_BSKILL_SELECT: 0,
  RPG_INVENTORY_ITEMS: 6,
  RPG_INVENTORY_TYPE_EQUIP: 0,
  RPG_INVENTORY_TYPE_ITEMS: 1,
  RPG_QUEST_ITEMS: 12,
  RPG_STORE_ITEMS: 8,
  RPG_BATTLE_ITEMS: 6,
  RPG_STORE_QTY: [],		// cost, qty, id, type, available
  RPG_STORE_MSG: "",
  RPG_SELECTED: -1,
  RPG_CONST_MSGS: [
	"Transaction completed",					//0
	"Sell the listed items?",
	"You don't have items to sell",
	"There are no active characters",
	"Buy the listed items?",
	"You don't have enough gold",	  
	"Rent listed rooms?",
	"Enjoy your stay!",
	"What are you buying?",
	"Pick a room please",
	"You need more rooms",						//10
	"Please choose a skill to learn",
	" has already learned that skill",
	" does not have enough skill points",
	" has learned ",
	"You have chosen to escape. Penalty imposed.",
	" has chosen normal attack",	
	" missed the target",
	" has chosen to defend",
	" has chosen skill ",
	" chose to use ",						//20
	"You have won the battle",
	"You have lost the battle"
  ],
  RPG_SKILLS_X: 6,
  RPG_SKILLS_Y: 6,
  RPG_SKILL_SELECT: null,
  RPG_PARTY: 0,	
  RPG_ENEMY: 1,
  RPG_ENEMY_BOSS: 2,
  RPG_BATTLER_ICON: 50,
  RPG_TIMEOUT: 2500,
  
  RPG_ACTION_CANCEL: -1,
  RPG_ACTION_ATK: 0,
  RPG_ACTION_SKL: 1,
  RPG_ACTION_ITM: 2,
  RPG_ACTION_DEF: 3,
  
  RPG_IN_BATTLE: false,
  RPG_ACTION: -1,
  RPG_STATE: -1,
  RPG_BATTLE_END: 0,  
  RPG_BATTLE_START: 1,
  RPG_CHOOSE_ACTION: 2,
  RPG_CHOOSE_TARGET: 3,
  RPG_DO_ACTION: 4,
  RPG_BATTLE_SKIP: 5,
  RPG_ENEMY_ACTION: 6,
  RPG_CHOOSE_SKILLS: 7,
  RPG_CHOOSE_ITEMS: 8,
  
  RPG_ATTACKER: -1,
  RPG_TARGET: -1,
  
  // status
  RPG_ACTIVE: 0,
  RPG_INCAPACITATED: 1,
  RPG_INACTIVE: 1,		// not available for turn
  RPG_POISONED: 2,		// drains HP per turn
  RPG_STUNNED: 3,		// miss a turn
  RPG_DEFENSE: 4,		// enhanced defensive stance
  RPG_EDEFENSE_FACTOR: 1.5,
  
  // equipment type
  RPG_ALL: -1,
  RPG_WEAPON: 0,
  RPG_SHIELD: 1,
  RPG_HEAD: 2,
  RPG_BODY: 3,
  RPG_ACCESSORY: 4,
  RPG_FEET: 5,
  
  // skills type
  RPG_SKILL_PASSIVE: 0,
  RPG_SKILL_BEGINNER: 1,
  RPG_SKILL_NOVICE: 2,
  RPG_SKILL_INTERMEDIATE: 3,
  RPG_SKILL_EXPERT: 4,
  RPG_SKILL_MASTER: 5,
}


// Relationship
//RPG.Stats.relationship = {
//	_value: ["hate", "normal", "trust", "love"],
//	_update: function(obj, stat) {
//		// do something when relationship is updated (positive or negative)
//	}
//};

// Define Class
// ATK - attack power
// DEF - defense power
// MATK - magic attack power
// MDEF - magif defense power
// AGI - agility
// LUK - luck

//}); //require