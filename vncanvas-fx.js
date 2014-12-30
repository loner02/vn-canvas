///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

///////////////////////////////////////////////////////////////////////////////
// Transition Effects plug-ins
///////////////////////////////////////////////////////////////////////////////
var TransEffects = {
	// effect completed
	done: {
		_in: function(obj, elapsed) {
			obj.drawn = true;
		}
	},
	// default/no effect
	none: {
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			obj.effects = 'done';
			obj.drawn = true;
		},
		_out: function(obj, elapsed) {
			obj.alpha = 0.0;
			obj.effects = 'done';
			obj.drawn = true;
			obj.redraw = true;
			obj.visible = false;
		}
	},
	// fade effect
	fade: {
		_init: function(obj, param) {
			if ((obj.effects.indexOf('_in')!=-1) && (param==true))
				obj.alpha = -1;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			if (obj.alpha >= obj.target_alpha) {
				obj.effects = 'done';
				obj.drawn = true;
			}
			else {
				obj.alpha += elapsed/(obj.transTime * 1000);
			}
			if (!obj.wait) obj.drawn = true;
		},
		_out: function(obj, elapsed) {
			if (obj.alpha <= 0.0) {
				obj.effects = 'done';
				obj.drawn = true;
				obj.visible = false;
			}
			else {
				obj.alpha -= elapsed/(obj.transTime * 1000);
			}
			obj.redraw = true;
			if (!obj.wait) obj.drawn = true;
		}
	},
	// ghost effect
	ghost: {
		_init: function(obj, param) {
			obj.target_alpha = 0.5;
		},
		_in: function(obj, elapsed) {
			TransEffects.fade._in(obj, elapsed);
		},
		_out: function(obj, elapsed) {
			TransEffects.fade._out(obj, elapsed);
		}
	},
	// dissolve effect
	dissolve: {
		_in: function(obj, elapsed) {
			TransEffects.fade._in(obj, elapsed);
		},
		_out: function(obj, elapsed) {
			TransEffects.fade._out(obj, elapsed);
		}
	},
	// scale effect
	scale: {
		_init: function(obj, param) {
			obj.size = Helper.parseArg(param[0]);//parseFloat(param[0]);
			obj.fxparam = obj.size;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			if (Math.abs(1-obj.scale/obj.fxparam) <= 0.01) {
				obj.effects = 'done';
				obj.drawn = true;
			}
			else
				obj.scale *= Math.exp(Math.log(obj.fxparam/obj.scale)*elapsed/(obj.transTime * 1000));
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene')
				TransEffects.none._in(obj, elapsed);
			else
				TransEffects.none._out(obj, elapsed);
		}
	},
	// rotate effect
	rotate: {
		_init: function(obj, param) {
			obj.fxparam = Helper.parseArg(param[0]);//parseFloat(param[0]);
			obj.orientation += obj.fxparam;
			obj.orientation %= 360;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			if (Math.abs(obj.accum_rotation - obj.fxparam) <= 0.1) {
				obj.effects = 'done';
				obj.rotation = 0;
				obj.accum_rotation = 0;
				obj.drawn = true;
			}
			else {
				obj.rotation = (obj.fxparam - obj.accum_rotation)* elapsed/(obj.transTime * 1000);
				obj.accum_rotation += obj.rotation;
			}		
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene')
				TransEffects.none._in(obj, elapsed);
			else
				TransEffects.none._out(obj, elapsed);
		}		
	},
	// translate effect
	translate: {
		_init: function(obj, param) {
			if (param && (param.length>1)) {
				obj.target_pos.vx += Helper.parseArg(param[0]);//parseFloat(param[0]);
				obj.target_pos.vy += Helper.parseArg(param[1]);//parseFloat(param[1]);
			}
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene')
				TransEffects.none._in(obj, elapsed);
			else
				TransEffects.none._out(obj, elapsed);
		}	
	},
	// movement effects
	left: {
		_init: function(obj, param) {
			if (obj.effects.indexOf('_in')!=-1)
				obj.pos.vx = -obj.context.canvas.width;
			else
				obj.target_pos.vx = -obj.context.canvas.width;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene') {
				TransEffects.none._in(obj, elapsed);
			}
			else {
				obj.redraw = true;
				if (!obj.wait) obj.drawn = true;
				Helper.interpolatePosition(obj);
				if (Stage.transTime <=0) {
					obj.effects = 'done';
					obj.drawn = true;
				}
			}
		}
	},
	right: {
		_init: function(obj, param) {
			if (obj.effects.indexOf('_in')!=-1)
				obj.pos.vx = Stage.canvas.width + obj.context.canvas.width;
			else
				obj.target_pos.vx = Stage.canvas.width + obj.context.canvas.width;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene') {
				TransEffects.none._in(obj, elapsed);
			}
			else {
				obj.redraw = true;
				if (!obj.wait) obj.drawn = true;
				Helper.interpolatePosition(obj);
				if (Stage.transTime <=0) {
					obj.effects = 'done';
					obj.drawn = true;
				}
			}
		}
	},
	bottom: {
		_init: function(obj, param) {
			if (obj.effects.indexOf('_in')!=-1)
				obj.pos.vy = Stage.canvas.height + obj.context.canvas.height;
			else
				obj.target_pos.vy = Stage.canvas.height + obj.context.canvas.height;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene') {
				TransEffects.none._in(obj, elapsed);
			}
			else {
				obj.redraw = true;
				if (!obj.wait) obj.drawn = true;
				Helper.interpolatePosition(obj);
				if (Stage.transTime <=0) {
					obj.effects = 'done';
					obj.drawn = true;
				}
			}
		}
	},
	top: {
		_init: function(obj, param) {
			if (obj.effects.indexOf('_in')!=-1)
				obj.pos.vy = -obj.context.canvas.height;
			else
				obj.target_pos.vy = -obj.context.canvas.height;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene') {
				TransEffects.none._in(obj, elapsed);
			}
			else {
				obj.redraw = true;
				if (!obj.wait) obj.drawn = true;
				Helper.interpolatePosition(obj);
				if (Stage.transTime <=0) {
					obj.effects = 'done';
					obj.drawn = true;
				}
			}
		}
	}
};
