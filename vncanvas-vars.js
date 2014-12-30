///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

///////////////////////////////////////////////////////////////////////////////
// User variables
///////////////////////////////////////////////////////////////////////////////
// set - sets a user variable
function set(param) {
	var arr_param = new Array();
	for (var prop in param) {
		if (param.hasOwnProperty(prop)) {
			arr_param.push(prop);
			arr_param.push(JSON.stringify(param[prop]));
		}
	}
	for (var i=0; i<arr_param.length; i+=2) {
		var persist = false;
		if (arr_param[i].indexOf('$') == 0) {
			arr_param[i] = arr_param[i].replace(/^\$/g,'');
			persist = true;
		}
		arr_param[i+1] = eval(arr_param[i+1]);
		var value = Helper.findStat(arr_param[i]);
		if (value != null) {
			/* set actor stat */
			var arr_str = arr_param[i].split('_');
			var stats_obj;
			if (Config.modRPG) stats_obj = RPG.Stats[arr_str[1]];
			else stats_obj = Stats[arr_str[1]];

			var stat = value;
			var stat_type;
			if (stats_obj._value) stat_type = typeof stats_obj._value[0];
			if (stats_obj._range) stat_type = typeof stats_obj._range[0];
			if (stat_type == 'number') {
				if (typeof arr_param[i+1] == 'number')
					stat = arr_param[i+1];
				else if (typeof arr_param[i+1] == 'string') {
					if (arr_param[i+1].search(/[+|\-|*|%|\/]/g) != -1)
						stat = eval(stat + arr_param[i+1]);
					else if (arr_param[i+1] == 'random') {
						if (stats_obj._value) {
							var delta = stats_obj._value[1] - stats_obj._value[0] + 1;
							stat = Math.floor(Math.random()*delta) + stats_obj._value[0];
						}
						if (stats_obj._range) {
							var delta = stats_obj._range[1] - stats_obj._range[0] + 1;
							stat = Math.floor(Math.random()*delta) + stats_obj._range[0];
						}
					}
				}
				if (stats_obj._value)
					stat = Math.max(stats_obj._value[0], Math.min(stats_obj._value[1], stat));
				if (stats_obj._range)
					stat = Math.max(stats_obj._range[0], Math.min(stats_obj._range[1], stat));
			}
			else if (stat_type == 'boolean') {
				if (typeof arr_param[i+1] == 'number')
					stat = (arr_param[i+1]==0) ? stats_obj._value[0] : stats_obj._value[1];
				else if (typeof arr_param[i+1] == 'string') {
					if (arr_param[i+1].search(/!/g) != -1)
						stat = !stat;
				}
				else if (typeof arr_param[i+1] == 'boolean')
					stat = arr_param[i+1];
			}
			else if (stat_type == 'string') {
				if (typeof arr_param[i+1] == 'number') {
					if ((arr_param[i+1] >= 0) && (arr_param[i+1] < stats_obj._value.length))
						stat = stats_obj._value[arr_param[i+1]];
				}
				else if (typeof arr_param[i+1] == 'string') {
					for (var j in stats_obj._value) {
						if (arr_param[i+1] == stats_obj._value[j]) {
							stat = arr_param[i+1];
							break;
						}
					}
				}
			}
			else {	// object type, just assign it
				stat = arr_param[i+1];
			}
			Helper.setValue(arr_param[i], stat);
			//for (var j in Stage.layers[1]) {
			//	if (Stage.layers[1][j].id == arr_str[0]) {
			//		Stage.layers[1][j].stats[arr_str[1]] = stat;
			//		break;
			//	}
			//}
		}
		else {
			/* set user variable */
			value = Helper.findVar(arr_param[i]);
			if (value != null) {
				if (arr_param[i+1] == null) {
					if (Stage.variables[arr_param[i]].Persist() && Helper.supportsLocalStorage())
						localStorage.removeItem("_persist_uv_"+arr_param[i]);
					delete(Stage.variables[arr_param[i]]);
					return;
				}
				if (Stage.variables[arr_param[i]].Type() == 'object') {
					// assumes array, just push new value
					Stage.variables[arr_param[i]].Value().push(arr_param[i+1]);
					Stage.variables[arr_param[i]].persist = persist;
				}
				else {
					if (typeof arr_param[i+1] == 'string') {
						// if value is a reference to other variables
						var ref = Helper.findVar(arr_param[i+1]);
						if (ref != null)
							Stage.variables[arr_param[i]].Set(ref, persist);
						else {
							// is it an expression with supported operator
							if (arr_param[i+1].search(/[+|\-|*|%|\/]/g) != -1)
								Stage.variables[arr_param[i]].Set(eval(Stage.variables[arr_param[i]].Value() + arr_param[i+1]), persist);
							else if (arr_param[i+1].search(/!/g) != -1)
								Stage.variables[arr_param[i]].Set(!Stage.variables[arr_param[i]].Value());
							// is it a random number
							else if (arr_param[i+1].search(/random/g) != -1) {
								var arr_random = arr_param[i+1].split(' ');
								if (arr_random.length > 1)
									Stage.variables[arr_param[i]].Set(Math.floor(Math.random()*(eval(arr_random[2])-eval(arr_random[1])+1)) + eval(arr_random[1]));
								else
									Stage.variables[arr_param[i]].Set(Math.random(), persist);
							}								
							// or a simple string to set
							else
								Stage.variables[arr_param[i]].Set(arr_param[i+1], persist);
						}
					}
					else {
						Stage.variables[arr_param[i]].Set(arr_param[i+1], persist);
					}
				}
			}
			else {
				var uv = new UserVars();
				if (typeof arr_param[i+1] == 'string') {
					if (arr_param[i+1].search(/random/g) != -1) {
						var arr_random = arr_param[i+1].split(' ');
						if (arr_random.length > 1)
							uv.Set(Math.floor(Math.random()*(eval(arr_random[2])-eval(arr_random[1])+1)) + eval(arr_random[1]));
						else
							uv.Set(Math.random(), persist);
					}
					else {
						var ref = Helper.findVar(arr_param[i+1]);
						uv.Set((ref != null) ? ref : arr_param[i+1], persist);
					}
				}
				else
					uv.Set(arr_param[i+1], persist);
				Stage.variables[arr_param[i]] = uv;
				uv = null;
			}	
			if (Stage.variables[arr_param[i]].Persist() && Helper.supportsLocalStorage())
				localStorage["_persist_uv_"+arr_param[i]] = JSON.stringify(Stage.variables[arr_param[i]].Value());
		}
	}
}
// get - gets value of a user variable
function get(param) {
	return Helper.findVar(param.name);
}

function UserVars() {
	this.value = 0;
	this.type = 0;
	this.persist = false;
}
UserVars.prototype.Set = function(v,p) {
	this.value = v;
	this.type = typeof v;
	if (p) this.persist = p;
}
UserVars.prototype.Value = function() {
	return this.value;
}
UserVars.prototype.Type = function() {
	return this.type;
}
UserVars.prototype.Persist = function() {
	return this.persist;
}
