///////////////////////////////////////////////////////////////////////////////
//  Visual Novel JAVASCRIPT Engine for HTML5 CANVAS by [lo'ner]              //
//  RPG Mod Pack for VN-CANVAS                                               //
//  Author: oclabbao@yahoo.com, oclabbao@gmail.com                           //
//  Reference:                                                               //
//      RPGMakerXP/VX/VX-ACE                                                 //
//      RPG Javascript Library by Samuel Ronce (rpgjs.com)                   //
//  Requires:                                                                //
//      VN-CANVAS v0.4.x+                                                    //
//  Description:                                                             //
//      This is a mod pack for vn-canvas to have some RPG elements. Note,    //
//      visual novels are not RPG, and most visual novel players are not     //
//      RPG players (or even hardcore gamers). This is sort of a lite RPG    //
//      addon that gives vn-canvas RPG gameplay.                             //
//                                                                           //
//      This mod pack is organized into four sections:                       //
//          - initialization                                                 //
//          - game specific data (e.g. characters, items, etc.)              //
//          - user-modifiable section (e.g. stats, formulas, etc.)           //
//          - a do-not-modify section (rpg core script)                      //
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
	Copyright © 2012 by OCLabbao a.k.a [lo'ner]

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published 
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

******************************************************************************/
/******************************************************************************
Revision history:
Version 0.4 Chelsea
12.29.12 - RPG mod first installment: actors and stats
12.01.12 - Initial version, to be consistent with vn-canvas version
         - Define actor attributes
******************************************************************************/

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
Config.modRPG = true;					// this identifies the mod pack
var RPG = {};							// RPG base class
var Stats = null;						// prevent conflict with Stats here, optional

///////////////////////////////////////////////////////////////////////////////
// Game Specific Data Section: customize per game
///////////////////////////////////////////////////////////////////////////////
RPG.Actors = [
	//note: the order of attributes correspond to the order of RPG.Stats below
	//note: actor name must match actorID to inherit the stats
	//name, gender, level, class, level, exp, battle, active
	["Hero", 0, 1, 0, 0, 0, 1],
	["Heroine", 1, 1, 1, 0, 0, 1],
];
RPG.Class = [
	// base stats per class, can be affected by equipment and level/experience
	// type, hp_growth, sp_growth, atk_growth, def_growth, exp_growth, +other stats
	// use #level# to refer to actor level
	{id:0, name:"Warrior", cls_hp:"#level#*30+70", cls_sp:"#level#*5+20", cls_atk:"#level#*12+20", cls_def:"#level#*10+18", cls_exp:"#level#*20+#level#*(#level#-1)*21"} ,
	{id:1, name:"Mage", cls_hp:"#level#*20+30", cls_sp:"#level#*10+30", cls_atk:"#level#*15+10", cls_def:"#level#*5+15", cls_exp:"#level#*20+#level#*(#level#-1)*21"},
];
RPG.Resistance = [
	// base class resistances to attacks; higher value indicates higher resistance
	// can be used to scale/compute damage received in battles
	// can be affected by equipment
	// must be arranged in same order as RPG.Class
	// weak:0-25, normal:26-50, resist:51-75, strong:76-100
	// physical, magical, elemental (or expand like fire magic, water element, earth physical, whatever)
	{res_phy:60, res_magic:25, res_elem:50},	// for Warrior class
	{res_phy:20, res_magic:60, res_elem:30},	// for Mage class
];
RPG.Items = [];
RPG.Equipment = [];
RPG.Skill = [];
RPG.Party = [];
RPG.Enemies = [];

///////////////////////////////////////////////////////////////////////////////
// User Modifiable Section: common to RPG, modification is optional
///////////////////////////////////////////////////////////////////////////////
RPG.Stats = {
	gender: {
		_value: ["male", "female"],
	},
	level: {								// must be declared before any level-dependent stats
		_range: [1, 99],					// allow levels 1 to 99
		_update: function(obj, stat) {
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
	class: {
		_range: [0, 10],					// define up to n class types
		_inherit: [RPG.Class, RPG.Resistance, RPG.Equipment],
		_update: function(obj, stat) {
			// if class is updateable
		}
	},
	exp: {
		_range: [0, 999999],				// allow up to ridiculously large experience
		_update: function(obj, stat) {
			// check if experience enough for a level change here
			var cur_lvl = obj.stats.level;
			var max_exp = stat.class.cls_exp;
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
		_update: function(obj, stat) {
		},
	},
	active: {								// determines if actor is active
		_value: [false, true],
	}
};

// EXP - experience
/*
// EQP - equipment {weapon, shield, head, body, accessory}
RPG.Stats.eqp = {
	_value: [{weapon:0, shield:0, head:0, body:0, accessory:0}],
	_update: function(obj, stat) {
		// change of equipment, update actor stats here
	}
};
// Relationship
RPG.Stats.relationship = {
	_value: ["hate", "normal", "trust", "love"],
	_update: function(obj, stat) {
		// do something when relationship is updated (positive or negative)
	}
};
*/
// Define Class
// ATK - attack power
// DEF - defense power
// MATK - magic attack power
// MDEF - magif defense power
// AGI - agility
// LUK - luck

///////////////////////////////////////////////////////////////////////////////
// RPG Core Script
// CAUTION: DO NOT MODIFY beyond this line, unless you know what you're doing
///////////////////////////////////////////////////////////////////////////////
RPG.methods = {
	getActive: function() {
		var list = new Array();
		for (var i in RPG.Actors) {
			var actor = this.getActorFromId(RPG.Actors[i][0]);
			if (actor && actor.stats && actor.stats.active)
				list.push(actor);
		}
		return list;
	},
	//getActors: function() {
	//	var list = new Array();
	//	for (var i in Stage.layers[1]) {
	//		list.push(Stage.layers[1][i]);
	//	}
	//	return list;
	//},
	getActorFromId: function(id) {
		for (var i in Stage.layers[1]) {
			if (Stage.layers[1][i].id == id) {
				return Stage.layers[1][i];
			}
		}
	},
	getActorFromIndex: function(index) {
		var list = this.getActive();
		return list[index];
	},
	parseStats: function(stat, base) {
		if (typeof stat == 'string') {
			var match = stat.match(/#([^#|\s]+)#/g);
			if (match && match.length>0) {
				for (var i in match)
					stat = stat.replace(match[i],base[match[i].replace(/#/g,'')])
				return Math.round(eval(stat));
			}
		}
		return stat;
	},
	updateAttr: function(id, attr, value) {
		var obj = RPG.methods.getActorFromId(id);
		if ((typeof obj.stats[attr] == 'number') ||
			(typeof obj.stats[attr] == 'string') ||
			(typeof obj.stats[attr] == 'boolean'))
			Helper.setValue(id+'_'+attr, value);
		else {
			// this is an object that needs updating
			if (RPG.Stats[attr]._inherit) {
				var inherit = {};		// inheritable values are assumed objects
				var inherited_class = {};
				for (var i in RPG.Stats[attr]._inherit) {
					
						if (typeof RPG.Stats[attr]._inherit[i] == 'string') {
							var match = RPG.Stats[attr]._inherit[i].match(/#([^#|\s]+)#/g);
							if (match.length>0)
								inherited_class = obj.stats[match[0].replace(/#/g,'')];
						}
						else {
							inherited_class = RPG.Stats[attr]._inherit[i][value];
						}
						for (j in inherited_class) {
							if (inherited_class.hasOwnProperty(j))
								if (inherit[j])
									inherit[j] += RPG.methods.parseStats(inherited_class[j], obj.stats);
								else
									inherit[j] = RPG.methods.parseStats(inherited_class[j], obj.stats);
						}
				}
				Helper.setValue(id+'_'+attr, inherit);				
				inherit = null;
			}
		}
	},
	buildStats: function(id) {
		var newStats = {};
		for (var i=0; i<RPG.Actors.length; i++) {
			if (RPG.Actors[i][0] == id) {
				var j=0;
				for (prop in RPG.Stats) {
					if (RPG.Stats.hasOwnProperty(prop)) {
						j++;
						if (RPG.Stats[prop]._range) 
							if ((RPG.Actors[i][j] >= RPG.Stats[prop]._range[0]) && ((RPG.Actors[i][j] <= RPG.Stats[prop]._range[1]))) 
								newStats[prop] = RPG.Actors[i][j];
							else
								newStats[prop] = RPG.Stats[prop]._range[0];
						else if (RPG.Stats[prop]._value)
							newStats[prop] = RPG.Stats[prop]._value[RPG.Actors[i][j]];
						else
							newStats[prop] = 0;
						if (RPG.Stats[prop]._inherit) {
							var select = newStats[prop];
							var inherit = {};		// inheritable values are assumed objects
							var inherited_class = {};
							
							for (var k in RPG.Stats[prop]._inherit) {
								if (typeof RPG.Stats[prop]._inherit[k] == 'string') {
									var match = RPG.Stats[prop]._inherit[k].match(/#([^#|\s]+)#/g);
									if (match.length>0)
										inherited_class = newStats[match[0].replace(/#/g,'')];
								}
								else {
									inherited_class = RPG.Stats[prop]._inherit[k][select];
								}
								for (attr in inherited_class) {
									if (inherited_class.hasOwnProperty(attr))
										if (inherit[attr])
											inherit[attr] += RPG.methods.parseStats(inherited_class[attr], newStats);
										else
											inherit[attr] = RPG.methods.parseStats(inherited_class[attr], newStats);
								}
							}
							newStats[prop] = inherit;
							inherit = null;
							inherited_class = null;
						}
					}
				}
				break;
			}
		}
		return newStats;
	},
};
