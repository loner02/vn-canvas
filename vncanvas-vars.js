///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

///////////////////////////////////////////////////////////////////////////////
// User variables
///////////////////////////////////////////////////////////////////////////////
// set - sets a user variable
function set(param) {
    const map = new Map();
    Object.keys(param).forEach(key => {
       map.set(key, JSON.stringify(param[key])); 
    });
    let pmap = new Map(), persist = false;
    for (let [key, value] of map.entries()) {
        persist = (key.includes('$')) ? true: false;
        let k = key.replace(/^\$/g,'');
        pmap.set(k,eval(value));       
        let v = Helper.findStat(k);
        if (v != null) {
            let arr_str = k.split(/[_@]/g);
            let stats_obj;
            if (Config.modRPG) stats_obj = RPG.Stats[arr_str[1]];
            else stats_obj = Stats[arr_str[1]];
            
            let stat_type, stat=v;
			if (stats_obj._value) stat_type = typeof stats_obj._value[0];
			if (stats_obj._range) stat_type = typeof stats_obj._range[0];
			if (stat_type == 'number') {
				if (typeof pmap.get(k) == 'number')
					stat = pmap.get(k);
				else if (typeof pmap.get(k) == 'string') {
					if (pmap.get(k).search(/[+|\-|*|%|\/]/g) != -1)
						stat = eval(stat + pmap.get(k));
					else if (pmap.get(k) == 'random') {
						if (stats_obj._value) {
							let delta = stats_obj._value[1] - stats_obj._value[0] + 1;
							stat = Math.floor(Math.random()*delta) + stats_obj._value[0];
						}
						if (stats_obj._range) {
							let delta = stats_obj._range[1] - stats_obj._range[0] + 1;
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
				if (typeof pmap.get(k) == 'number')
					stat = (pmap.get(k)==0) ? stats_obj._value[0] : stats_obj._value[1];
				else if (typeof pmap.get(k) == 'string') {
					if (pmap.get(k).search(/!/g) != -1)
						stat = !stat;
				}
				else if (typeof pmap.get(k) == 'boolean')
					stat = pmap.get(k);
			}
			else if (stat_type == 'string') {
				if (typeof pmap.get(k) == 'number') {
					if ((pmap.get(k) >= 0) && (pmap.get(k) < stats_obj._value.length))
						stat = stats_obj._value[pmap.get(k)];
				}
				else if (typeof pmap.get(k) == 'string') {
					for (let j in stats_obj._value) {
						if (pmap.get(k) == stats_obj._value[j]) {
							stat = pmap.get(k);
							break;
						}
					}
				}
			}
			else {	// object type, just assign it
				stat = pmap.get(k);
			}
			Helper.setValue(k, stat);            
        }
        else if (Helper.findConfig(k) != null) {
            if (Config.activeTheme[k] !== undefined) {
                Config.activeTheme[k] = pmap.get(k);
                Helper.updateConfig('activeTheme');
            }
            else {
                Config[k] = pmap.get(k);
                Helper.updateConfig(k);
            }
            Stage.redraw = true;
        }
        else {
            v = Helper.findVar(k);
            if (v != null) {
                if (pmap.get(k) == null) {
                    if (Stage.variables.get(k).persist && Helper.supportsLocalStorage())
                        localStorage.removeItem("_persist_uv_"+k);
                    Stage.variables.delete(k);
                    continue;
                }
                if (Stage.variables.get(k).type == 'object') {
                    // assumes array, push new value
                    if (typeof pmap.get(k) == 'object') {
                        pmap.get(k).forEach(i => {
                            Stage.variables.get(k).value.push(i);
                        });
                    }
                    else
                        Stage.variables.get(k).value.push(pmap.get(k));
                    Stage.variables.get(k).persist = persist;
                }
                else {
                    if (typeof pmap.get(k) == 'string') {
                        let ref = Helper.findVar(pmap.get(k));
                        if (ref != null) {
                            Stage.variables.get(k).value = ref;
                        }
                        else {
                            // is it an expression with supported operator
                            if (pmap.get(k).search(/^[+|\-|*|%|\/]/g) != -1) {
                                Stage.variables.get(k).value = eval(Stage.variables.get(k).value + pmap.get(k));
                            }
                            else if (pmap.get(k).search(/^!/g) != -1) {
                                Stage.variables.get(k).value = !Stage.variables.get(k).value;
                            }
                            else if (pmap.get(k).search(/random/g) != -1) {
                                let arr_random = pmap.get(k).split(' ');
                                if (arr_random.length > 1)
                                    Stage.variables.get(k).value = Math.floor(Math.random()*(eval(arr_random[2])-eval(arr_random[1])+1)) + eval(arr_random[1]);
                                else
                                    Stage.variables.get(k).value = Math.random();
                            }
                            // or a simple string to set
                            else {
                                Stage.variables.get(k).value = pmap.get(k);
                            }
                        }
                        Stage.variables.get(k).persist = persist;
                    }
                    else {
                        Stage.variables.get(k).value = pmap.get(k);
                        Stage.variables.get(k).persist = persist;                    
                    }
                }
            }
            else {
                let uv = new UserVars();
                if (typeof pmap.get(k) == 'string') {
                    if (pmap.get(k).includes('random')) {
                        let arr_random = pmap.get(k).split(' ');
                        if (arr_random.length > 1)
                            uv.value = Math.floor(Math.random()*(eval(arr_random[2])-eval(arr_random[1])+1)) + eval(arr_random[1]);
                        else
                            uv.value = Math.random();
                    }
                    else {
                        let ref = Helper.findVar(pmap.get(k));
                        uv.value = (ref != null) ? ref : pmap.get(k);
                    }
                }
                else {
                    uv.value = pmap.get(k);
                }
                uv.persist = persist;
                Stage.variables.set(k,uv);
            }
            if (Stage.variables.get(k).persist && Helper.supportsLocalStorage())
                localStorage["_persist_uv_"+k] = JSON.stringify(Stage.variables.get(k).value);
        }
    }
    return true;
}
// get - gets value of a user variable
function get(param) {
	return Helper.findVar(param.name);
}

class UserVars {
    constructor() {
        this._value = 0;    // WebGL changed
        this._type = 0;
        this._persist = false;
    }
    get value ()   { return this._value; }
    get type ()    { return this._type; }
    get persist () { return this._persist; }
    set value (v) {
        this._value = v;
        this._type = typeof v;
        //this._persist = p;
    }
    set persist (p) {
        this._persist = p;
    }
    Set(v,p) {
        this.value = v;
        this.persist = p;
        
    }
}