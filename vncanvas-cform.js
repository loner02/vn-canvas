///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";
require(["app/vncanvas-img", "app/vncanvas-vars"]);

///////////////////////////////////////////////////////////////////////////////
// Local Helpers
///////////////////////////////////////////////////////////////////////////////
// Helper function to display readable time
Helper.convertTime = (function (val) {
	var sec = val % 60;
	var min = (val - sec) / 60;
	min %= 60;
	var hr = (val - sec - 60*min) / 3600;
	if (hr > 0)
		return (hr.toString() + ':' + ((min<10)?'0':'') + min.toString() + ':' + ((sec<10)?'0':'') + sec.toString());
	else
		return (min.toString() + ':' + ((sec<10)?'0':'') + sec.toString());
});

///////////////////////////////////////////////////////////////////////////////
// Canvas Form elements plug-ins
///////////////////////////////////////////////////////////////////////////////
// button - create a canvas button (layer 4), independent of cform
function button(param) {
	// check existing button w/ same id ?
	var bt = new ActiveImage();
	bt.saveparam = param;
	if (/toggle/i.test(param.name))
		CformElements['toggle']['_init'](bt, param);
	else
		CformElements['button']['_init'](bt, param);
	Stage.layers[4].push(bt);
	bt = null;
}
// timer - create a canvas form timer (layer 4)
// removed as of v.0.3.1, added stub for compatibility
function timer(param) {
	marquee(param);
}
// picture - create a canvas form animated image (layer 4)
function picture(param) {
	var pic = new ActiveImage();
	pic.saveparam = param;
	CformElements['picture']['_init'](pic, param);
	Stage.layers[4].push(pic);
	pic = null;
}
// marquee - create a canvas form animated text (layer 4)
function marquee(param) {
	var mq = new ActiveImage();
	mq.saveparam = param;
	if (/timer/i.test(param.name))
		CformElements['timer']['_init'](mq, param);
	else
		CformElements['marquee']['_init'](mq, param);
	Stage.layers[4].push(mq);
	mq = null;
}
// cfelement - create a custom cform element
function cfelement(param) {
	var element = new ActiveImage();
	element.type = param.type;
	element.saveparam = param;
	CformElements[param.type]['_init'](element, param);
	Stage.layers[4].push(element);
	element = null;
}
// form - container for canvas form elements such as buttons (layer 4)
function cform(param) {
	if (typeof param == "string") {	// TODO: check array count
		switch (param) {
			case 'close':
				var formid = Stage.formStack.pop();
				var idx = -1;
				var count = 0;
				for (var i in Stage.layers[4]) {
					if (Stage.layers[4][i].group == formid) {
						if (idx == -1) idx = i;
						count++;
						for (var j in Stage.layers[4][i].sprites) {
							if ((Stage.layers[4][i].sprites[j].constructor == HTMLImageElement) || 
								(Stage.layers[4][i].sprites[j].constructor == Image) ||
								(Stage.layers[4][i].sprites[j] instanceof HTMLImageElement) || 
								(Stage.layers[4][i].sprites[j] instanceof Image))
								Stage.layers[4][i].sprites[j] = null;
						}
					}
				}
				Stage.layers[4].splice(idx, count);
				break;
			case 'hide':
				var formid = Stage.formStack[Stage.formStack.length-1];
				for (var i in Stage.layers[4]) {
					if (Stage.layers[4][i].group == formid) {
						Stage.layers[4][i].visible = false;
						Stage.layers[4][i].inputFocus = false;
						Stage.layers[4][i].redraw = true;
						if (Stage.layers[4][i].aTimerOn) {
							Stage.layers[4][i].aTimerOn = false;
							clearTimeout(Stage.layers[4][i].aTimer);
						}
					}
				}
				break;
			case 'show':
				var formid = Stage.formStack[Stage.formStack.length-1];
				for (var i in Stage.layers[4]) {
					if (Stage.layers[4][i].group == formid) {
						Stage.layers[4][i].visible = true;
						//Stage.layers[4][i].inputFocus = true;
						Stage.layers[4][i].redraw = true;
					}
				}
				Stage.pause = true;
				break;
			case 'default':
				// revert back to default style
				Stage.formStyle.splice(0, Stage.formStyle.length);
				var subs = Helper.parseFontString(Config.formStyle);
				if (subs.length >= 4) {
					Stage.formStyle.push(subs.slice(0,3).join(' '));
					Stage.formStyle.push(subs.slice(3).join(' '));
				}
				else
					Stage.formStyle.push(param);
				break;
			default:
				for (var i in Stage.formStack) {
					if (Stage.formStack[i] == param) {
						// put on top of stack
						Stage.formStack.splice(i,1);
						Stage.formStack.push(param)
						// then show it
						for (var i in Stage.layers[4]) {
							if (Stage.layers[4][i].group == param) {
								Stage.layers[4][i].visible = true;
								//Stage.layers[4][i].inputFocus = true;
								Stage.layers[4][i].redraw = true;
							}
						}
						return;
					}
				}
				// else, assume this is a formStyle
				Stage.formStyle.splice(0, Stage.formStyle.length);
				var subs = Helper.parseFontString(param);
				if (subs.length >= 4) {
					Stage.formStyle.push(subs.slice(0,3).join(' '));
					Stage.formStyle.push(subs.slice(3).join(' '));
				}
				else
					Stage.formStyle.push(param);
				break;
		}
	}
	else {
		for (var i in Stage.formStack) {
			if (Stage.formStack[i] == param[0]) {
				// reenable form
				for (var j in Stage.layers[4]) {
					if (Stage.layers[4][j].group == param[0]) {
						Stage.layers[4][j].visible = true;
						//Stage.layers[4][j].inputFocus = true;
						Stage.layers[4][j].redraw = true;
					}
				}
				Stage.pause = param[1];
				return;
			}
		}
		// this is a new form
		Stage.formStack.push(param[0]);
		for (var i=2; i<param.length; i+=2) {
			param[i](param[i+1]);
			Stage.layers[4][Stage.layers[4].length-1].group = param[0];
		}
		Stage.pause = param[1];
	}
}

var CformElements = {
	button: {
		_init: function (obj, param) {
			var rect = new Rect(param.x, param.y, (param.w)?param.w:0, (param.h)?param.h:0);
			var sprites = new Array();
			if (param.base) sprites.push(param.base);
			sprites.push((param.hover)?param.hover:param.base);
			sprites.push((param.click)?param.click:param.base);
			obj.Create(param.name, rect, sprites);
			if (param.link) obj.link = param.link;
			if (param.showText == false) obj.showText = false;
			if (param.align) obj.align = param.align;
			if (param.tip) obj.tooltip = param.tip;
		},
		_update: function (obj, elapsed) {
			if (!Helper.checkMapAccess(obj.group, obj.id)) return;
			if (obj.prev_state != obj.state) {
				obj.prev_state = obj.state;
				obj.redraw = true;	
				if ((obj.state == 'hover') || (obj.state == 'clicked')) {
					obj.inputFocus = true;
					if (obj.tooltip != '') Stage.Transition(1.0);
				}
				else
					obj.inputFocus = false;
			}
			if (Stage.mouseClick && obj.inputFocus) {
				if (obj.link != null) {
					obj.link[0](obj.link[1]);
					Stage.pause = false;
				}
				obj.redraw = true;
			}
		},
		_draw: function (obj) {
			if (!Helper.checkMapAccess(obj.group, obj.id)) return;
			if ((obj.sprites.length>1) && (obj.state=='hover'))
				obj.DrawImageOrFill(obj.sprites[1]);
			else if ((obj.sprites.length>2) && (obj.state=='clicked'))
				obj.DrawImageOrFill(obj.sprites[2]);
			else
				obj.DrawImageOrFill(obj.sprites[0]);
		}
	},
	toggle: {
		_init: function (obj, param) {
			obj.type = "toggle";
			CformElements.button._init(obj, param);
		},
		_update: function (obj, elapsed) {
			if (!Helper.checkMapAccess(obj.group, obj.id)) return;
			if (obj.prev_state != obj.state) {
				obj.prev_state = obj.state;
				obj.redraw = true;	
				if ((obj.state == 'hover') || (obj.state == 'clicked')) {
					obj.inputFocus = true;
					if (obj.tooltip != '') Stage.Transition(1.0);
				}
				else
					obj.inputFocus = false;
			}
			if (Stage.mouseClick && obj.inputFocus) {
				if (obj.link != null) {
					obj.link[0](obj.link[1]);
					Stage.pause = false;
				}
				/* swap base and click images */
				var newbase = obj.sprites.pop();
				var newclick = obj.sprites.shift();
				obj.sprites.unshift(newbase);
				obj.sprites.push(newclick);
				newbase = null; newclick = null;
				obj.redraw = true;
			}
		},
		_draw: function (obj) {
			CformElements.button._draw(obj);
		}
	},
	picture: {
		_init: function (obj, param) {
			obj.type = "picture";
			obj.fps = (param.fps > 1) ? param.fps : 1;
			var rect = new Rect(param.x, param.y, 0, 0);
			var sprites = new Array();
			for (var i in param.frames) 
				sprites.push(param.frames[i]);
			obj.Create(param.name, rect, sprites);
			obj.showText = false;
		},
		_update: function (obj, elapsed) {
			if ((!obj.aTimerOn) && (obj.sprites.length > 1)) {
				obj.aTimer = setTimeout(function() {
					obj.countup = (++obj.countup) % obj.sprites.length;
					obj.redraw = true;
					if (obj.visible) obj.aTimerOn = false;
				}, 1000/obj.fps);
				obj.aTimerOn = true;
			}
		},
		_draw: function (obj) {
			obj.DrawImageOrFill(obj.sprites[obj.countup]);
		}
	},
	timer: {
		_init: function (obj, param) {
			obj.type = "timer";
			obj.fps = 1;
			if (param.timeout) obj.timeout = param.timeout;
			if (param.link) obj.link = param.link;
			var rect = new Rect(param.x, param.y, param.w, param.h);
			obj.Create(param.name, rect, null);

			obj.text = Helper.convertTime(obj.timeout);
			// create a user variable named param.name
			var val = Helper.findVar(escape(param.name));
			if (val != null) {
				Stage.variables[escape(param.name)].Set(obj.timeout, false);
			}
			else {
				var uv = new UserVars();
				uv.Set(obj.timeout, false);
				Stage.variables[escape(param.name)] = uv;
			}
			obj.countup = !(obj.timeout > 0);
		},
		_update: function (obj, elapsed) {
			if (!obj.aTimerOn) {
				this.aTimer = setTimeout(function() {
					if (obj.countup)
						Helper.setValue(obj.id, Helper.getValue(obj.id)+1);
					else
						Helper.setValue(obj.id, Helper.getValue(obj.id)-1);
					obj.text = Helper.convertTime(Helper.getValue(obj.id));
					obj.redraw = true;
					if (!obj.countup) {
						if (Helper.getValue(obj.id) > 0) {
							if (obj.visible) obj.aTimerOn = false;
						}
						else {
							if (obj.link != null) {
								obj.link[0](obj.link[1]);
								Stage.pause = false;
							}
						}
					}
					else {
						if (obj.visible) obj.aTimerOn = false;
					}
				}, 1000/obj.fps );
				obj.aTimerOn = true;
			}
		},
		_draw: function (obj) {
			obj.DrawImageOrFill(obj.sprites[0]);
		}
	},
	marquee: {
		_init: function (obj, param) {
			obj.type = "marquee";
			obj.fps = (param.fps > 1) ? param.fps : 1;
			if (param.timeout) obj.timeout = param.timeout;
			if (param.link) obj.link = param.link;
			var rect = new Rect(param.x, param.y, param.w, param.h);
			obj.Create(param.name, rect, null);

			// add the text to sprites array
			for (var i in param.frames) 
				obj.sprites.push(param.frames[i]);
			obj.text = param.frames[0];
		},
		_update: function (obj, elapsed) {
			if ((!obj.aTimerOn) && (obj.sprites.length > 2)) {
				obj.aTimer = setTimeout(function() {
					obj.countup++;
					obj.countup %= obj.sprites.length-1;
					obj.redraw = true;
					obj.text = obj.sprites[obj.countup+1];
					if (obj.visible) obj.aTimerOn = false;
				}, 1000/obj.fps);
				obj.aTimerOn = true;
			}
		},
		_draw: function (obj) {
			obj.DrawImageOrFill(obj.sprites[0]);
		}
	}
};
