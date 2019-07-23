///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";
require(["app/vncanvas-base"], function() {
	// Helper function to process effects
	Helper.processEffects = ((obj, elapsed) => {
		if (obj.effects.includes('done')) {
			obj.drawn = true;
			return;
		}
		let fxarr = obj.effects.split('_');
		if (fxarr[0] == '') fxarr[0] = 'none';
		if (fxarr.length == 1) fxarr.push('in');
		
		//obj.target_alpha = 1.0;		// BUG: breaks ghost
		if (fxarr[0] != 'ghost') obj.target_alpha = 1.0;
		TransEffects[fxarr[0]]['_'+fxarr[1]](obj, elapsed);
	});
});


///////////////////////////////////////////////////////////////////////////////
// Transition Effects plug-ins
///////////////////////////////////////////////////////////////////////////////
var TransEffects = {
	offset: 10,   
	// effect completed
	done: {
		_in: (obj, elapsed) => {
			obj.drawn = true;
		}
	},
	// default/no effect
	none: {
		_in: (obj, elapsed) => {
			obj.Reset(false);
			obj.alpha = 1.0;
			obj.effects = 'done';
			obj.drawn = true;
		},
		_out: (obj, elapsed) => {
			obj.alpha = 0.0;
			obj.effects = 'done';
			obj.drawn = true;
			obj.redraw = true;
			obj.visible = false;
		}
	},
	// fade effect
	fade: {
		_init: (obj, param) => {
            obj.Reset(obj.type=='actor');
			if ((obj.effects.includes('_in')) && (param==true))
				obj.alpha = -1;
		},
		_in: (obj, elapsed) => {
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
		_out: (obj, elapsed) => {
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
		_init: (obj, param) => {
            obj.Reset(obj.type=='actor');
			obj.target_alpha = 0.5;
		},
		_in: (obj, elapsed) => {
			TransEffects.fade._in(obj, elapsed);
		},
		_out: (obj, elapsed) => {
			TransEffects.fade._out(obj, elapsed);
		}
	},
	// dissolve effect
	dissolve: {
		_init: (obj, param) => {
            obj.Reset(obj.type=='actor');
			if (obj.effects.includes('_in'))
                obj.alpha = 0;
		},
		_in: (obj, elapsed) => {
			TransEffects.fade._in(obj, elapsed);
		},
		_out: (obj, elapsed) => {
			TransEffects.fade._out(obj, elapsed);
		}
	},
	// TODO:tile/scroll effect
	/*tile: {
		_init: (obj, param) => {
            obj.Reset(obj.type=='actor');
            obj.alpha = 1;
		},
		_in: (obj, elapsed) => {
			obj.Reset(false);
		},
		_out: (obj, elapsed) => {
		}
	},*/
	// movement effects
	left: {
		_init: (obj, param) => {
            obj.Reset(obj.type=='actor');
            //if (obj.type=='actor') obj.pos.vy = Stage.canvas.height;
            if (param && ((param.length > 1) || (param == 'pan'))) {
                // assumes direction-pan-tween
                if (obj.effects.includes('_in')) {
                    obj.pos.vx = -obj.imageDim.vx/2 + Stage.canvas.width -TransEffects.offset;
                    obj.target_pos.vx = obj.imageDim.vx/2;
                }
                else
                    obj.target_pos.vx = -obj.imageDim.vx/2 + Stage.canvas.width -TransEffects.offset;
                obj.tween = (param.length>1) ? param[1] : 'linear';
            }
            else {
                if (obj.effects.includes('_in')) {
                    obj.pos.vx = -obj.imageDim.vx/2 -TransEffects.offset;
                    //if (obj.type != 'actor')        // actor follows 'position'
                    //    obj.target_pos.vx = Stage.canvas.width/2;
                }
                else
                    obj.target_pos.vx = -obj.imageDim.vx/2 -TransEffects.offset;
                obj.tween = (param) ? param : 'linear';
            }
            //console.log('left init '+obj.pos.vx+' '+obj.target_pos.vx);
		},
		_in: (obj, elapsed) => {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
            //console.log('left in '+obj.pos.vx+' '+Stage.transTime);
		},
		_out: (obj, elapsed) => {
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
                    obj.visible = false;
				}
			}
            //console.log('left out '+obj.pos.vx+' '+Stage.transTime);
		}
	},
	right: {
		_init: (obj, param) => {
            obj.Reset(obj.type=='actor');
            if (param && ((param.length > 1) || (param == 'pan'))) {
                // assumes direction-pan-tween
                if (obj.effects.includes('_in')) {
                    obj.target_pos.vx = -obj.imageDim.vx/2 + Stage.canvas.width;
                    obj.pos.vx = obj.imageDim.vx/2 +TransEffects.offset;
                }
                else
                    obj.target_pos.vx = obj.imageDim.vx/2 +TransEffects.offset;
                obj.tween = (param.length>1) ? param[1] : 'linear';
            }
            else {
                if (obj.effects.includes('_in')) {
                    obj.pos.vx = Stage.canvas.width + obj.imageDim.vx/2 +TransEffects.offset;
                    //if (obj.type != 'actor')        // actor follows 'position'
                    //  obj.target_pos.vx = Stage.canvas.width/2;
                }
                else
                    obj.target_pos.vx = Stage.canvas.width + obj.imageDim.vx/2 +TransEffects.offset;
                obj.tween = (param) ? param : 'linear';
            }
            //console.log('right init '+obj.pos.vx+' '+obj.target_pos.vx);
		},
		_in: (obj, elapsed) => {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
            //console.log('right in '+obj.pos.vx+' '+obj.pos.vy+' '+obj.target_pos.vx);
		},
		_out: (obj, elapsed) => {
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
                    obj.visible = false;
				}
			}
            //console.log('right out '+obj.pos.vx+' '+obj.pos.vy+' '+obj.target_pos.vx);
		}
	},
	bottom: {
		_init: (obj, param) => {
            obj.Reset(obj.type=='actor');
            if (param && ((param.length > 1) || (param == 'pan'))) {
                // assumes direction-pan-tween
                if (obj.effects.includes('_in')) {
                    obj.target_pos.vy = -obj.imageDim.vy/2 + Stage.canvas.height;
                    obj.pos.vy = obj.imageDim.vy/2 +TransEffects.offset;
                }
                else
                    obj.target_pos.vy = obj.imageDim.vy/2 +TransEffects.offset;
                obj.tween = (param.length>1) ? param[1] : 'linear';
            }
            else {
                if (obj.effects.includes('_in')) {
                    obj.pos.vy = Stage.canvas.height + obj.imageDim.vy/2 +TransEffects.offset;
                    //if (obj.type == 'actor')
                    //    obj.target_pos.vy = Stage.canvas.height;    // actor anchor is (0.5,1.0)
                    //else
                    //    obj.target_pos.vy = Stage.canvas.height/2;  // others are (0.5,0,5)
                }
                else
                    obj.target_pos.vy = Stage.canvas.height + obj.imageDim.vy/2 +TransEffects.offset;
                obj.tween = (param) ? param : 'linear';
            }
            //console.log('bottom init '+obj.id+' '+obj.pos.vx+' '+obj.pos.vy+' '+obj.target_pos.vy);
		},
		_in: (obj, elapsed) => {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
            //console.log('bottom in '+obj.pos.vx+' '+obj.pos.vy+' '+obj.target_pos.vy);
            
		},
		_out: (obj, elapsed) => {
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
                    obj.visible = false;
				}
			}
		}
	},
	top: {
		_init: (obj, param) => {
            obj.Reset(obj.type=='actor');
            if (param && ((param.length > 1) || (param == 'pan'))) {
                // assumes direction-pan-tween
                if (obj.effects.includes('_in')) {
                    obj.pos.vy = -obj.imageDim.vy/2 + Stage.canvas.height -TransEffects.offset;
                    obj.target_pos.vy = obj.imageDim.vy/2;
                }
                else
                    obj.target_pos.vy = -obj.imageDim.vy/2 + Stage.canvas.height -TransEffects.offset;
                obj.tween = (param.length>1) ? param[1] : 'linear';
            }
            else {
                if (obj.effects.includes('_in')) {
                    obj.pos.vy = -obj.imageDim.vy/2 -TransEffects.offset;
                    //if (obj.type == 'actor')
                    //    obj.target_pos.vy = Stage.canvas.height;    // actor anchor is (0.5,1.0)
                    //else
                    //    obj.target_pos.vy = Stage.canvas.height/2;  // others are (0.5,0,5)
                }
                else
                    obj.target_pos.vy = -obj.imageDim.vy/2 -TransEffects.offset;
                obj.tween = (param) ? param : 'linear';
            }
		},
		_in: (obj, elapsed) => {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
		},
		_out: (obj, elapsed) => {
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
                    obj.visible = false;
				}
			}
		}
	},
	// scale effect
	scale: {
		_init: (obj, param) => {
			obj.size = Helper.parseArg(param[0]);
			obj.fxparam = obj.size;
		},
		_in: (obj, elapsed) => {
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
		_out: (obj, elapsed) => {
			if (obj.type == 'scene')
				TransEffects.none._in(obj, elapsed);
			else
				TransEffects.none._out(obj, elapsed);
		}
	},
	// rotate effect
	rotate: {
		_init: (obj, param) => {
			obj.fxparam = Helper.parseArg(param[0]);
			obj.orientation += obj.fxparam;
			obj.orientation %= 360;
			obj.rstart = obj.rotation;
		},
		_in: (obj, elapsed) => {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			if (Math.abs(obj.rotation - obj.orientation) <= 0.1) {
				obj.effects = 'done';
				//obj.rotation = 0;
				obj.drawn = true;
			}
			else {
				//obj.rotation += (obj.orientation - obj.rotation)* elapsed/(obj.transTime * 1000);
				obj.rotation += (obj.orientation - obj.rstart)* elapsed/(obj.transTime * 1000);
			}		
		},
		_out: (obj, elapsed) => {
			if (obj.type == 'scene')
				TransEffects.none._in(obj, elapsed);
			else
				TransEffects.none._out(obj, elapsed);
		}		
	},
	// translate effect
	translate: {
		_init: (obj, param) => {
            //console.log("translate: "+obj.target_pos.vx+" "+obj.target_pos.vy )
			if (param && (param.length>1)) {
				obj.target_pos.vx += Helper.parseArg(param[0]);
				obj.target_pos.vy += Helper.parseArg(param[1]);
            //console.log("translate: "+obj.target_pos.vx+" "+obj.target_pos.vy )
			}
		},
		_in: (obj, elapsed) => {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
            //console.log("translate: "+obj.pos.vx+" "+obj.pos.vy )
		},
		_out: (obj, elapsed) => {
			if (obj.type == 'scene')
				TransEffects.none._in(obj, elapsed);
			else
				TransEffects.none._out(obj, elapsed);
		}	
	},
	zoom: {
		_init: (obj, param) => {
            let scaleX = Stage.canvas.width/obj.imageDim.vx;
            let scaleY = Stage.canvas.height/obj.imageDim.vy;
            obj.size = Math.max(scaleX, scaleY);
            if (param == 'out') {
                obj.fxparam = obj.size;
            }
            else {
                obj.scale = Math.max(scaleX, scaleY);
                obj.fxparam = 1.0;
            }
		},
		_in: (obj, elapsed) => {
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
		_out: (obj, elapsed) => {
			if (obj.type == 'scene')
				TransEffects.none._in(obj, elapsed);
			else
				TransEffects.none._out(obj, elapsed);
		}
	},
	zoomin: {
		_init: (obj, param) => {
            TransEffects.zoom._init(obj, 'in');
		},
		_in: (obj, elapsed) => {
            TransEffects.zoom._in(obj, elapsed);
		},
		_out: (obj, elapsed) => {
            TransEffects.zoom._out(obj, elapsed);
		}
	},    		
	zoomout: {
		_init: (obj, param) => {
            TransEffects.zoom._init(obj, 'out');
		},
		_in: (obj, elapsed) => {
            TransEffects.zoom._in(obj, elapsed);
		},
		_out: (obj, elapsed) => {
            TransEffects.zoom._out(obj, elapsed);
		}
	},
    
    // internal fx Helpers
    // ease: based on charm.js for PIXI
    ease: {                                 // WebGL new
        linear: (x) => {
            return x;
        },
        smoothstep: (x) => {
            return x * x * (3 - 2 * x);
        },
        smoothstepSquared: (x) => {
            return Math.pow((x * x * (3 - 2 * x)), 2);
        },
        smoothstepCubed: (x) => {
            return Math.pow((x * x * (3 - 2 * x)), 3);
        },
        deceleration: (x) => {
            return x * x;
        },
        decelerationCubed: (x) => {
            return Math.pow(x * x, 3);
        },
        acceleration: (x) => {
            return 1 - Math.pow(1 - x, 2);
        },
        accelerationCubed: (x) => {
            return 1 - Math.pow(1 - x, 3);
        },
    }
};

///////////////////////////////////////////////////////////////////////////////
// Filter Effects plug-ins
///////////////////////////////////////////////////////////////////////////////
var Filters = {
	offset: 0,
    blur: (args) => {
        let f = new PIXI.filters.BlurFilter();
        if (args) {
            if (args.length == 1)
                f.blur = parseInt(args[0]);
            else {
                f.blurX = parseInt(args[0]);
                f.blurY = parseInt(args[1]);
            }
        }
        return f;
    },
    gaussianBlur: (args) => {
        return Filters.blur(args);
    },
    grayscale: (args) => {
        let f = new PIXI.filters.ColorMatrixFilter();
        let v = 0.5;
        if (args) v = Math.max(0, Math.min(1, parseFloat(args[0])));
        f.greyscale(v, false);
        return f;
    },
    greyscale: (args) => {
        return Filters.grayscale(args);
    },
    sepia: (args) => {
        let f = new PIXI.filters.ColorMatrixFilter();
        f.sepia(false);
        return f;  
    },
    invert: (args) => {
        let f = new PIXI.filters.ColorMatrixFilter();
        f.negative(false);
        return f;  
    },
    negative: (args) => {
        return Filters.invert(args);
    },
    saturate: (args) => {
        let f = new PIXI.filters.ColorMatrixFilter();
        let v = 0;
        if (args) v = Math.max(0, Math.min(1, parseFloat(args[0])));
        f.saturate(v, false);
        return f;
    },
    brightness: (args) => {
        let f = new PIXI.filters.ColorMatrixFilter();
        let v = 1;
        if (args) v = Math.max(0, Math.min(1, parseFloat(args[0])));
        f.brightness(v, false);
        return f;
    },
    // TODO: flip is a cheat that uses the sprite's scale instead of pixel manipulation
    flip: (args) => {
        let v = [1,1];
        let f = args[0].toLowerCase();
        if (f.includes('x')) v[0] = -1;
        if (f.includes('y')) v[1] = -1;
        return v;
    },
    horizontalFlip: (args) => {
        return Filters.flip('x');
    },
    verticalFlip: (args) => {
        return Filters.flip('y');
    },
    
    // TODO: blank filters
    luminance: (args) => {
        return null;
    },
    threshold: (args) => {
        return null;
    },
    sharpen: (args) => {
        return null;
    },
    laplace: (args) => {
        return null;
    },
    none: (args) => {
        return null;
    },
    
    // TODO: create custom PIXI filters
    alpha: (args) => {     // WebGL new
        let f = new PIXI.filters.AlphaFilter();
        let v = 1;
        if (args) v = Math.max(0, Math.min(1, parseFloat(args[0])));
        f.alpha = v;
        return f;
    },
};