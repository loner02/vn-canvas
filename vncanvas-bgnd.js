///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";
require(["app/vncanvas-fx"]);

///////////////////////////////////////////////////////////////////////////////
// Local Helpers
///////////////////////////////////////////////////////////////////////////////
require(["app/vncanvas-base"], function() {
	// Helper function to process backdrop
	Helper.processBackdrop = ((obj, type, param) => {
		let nextid = 0;
		if (obj.size > 0) {
			// background/overlay layer has more than one element
			// to conserve memory, maintain only the previous and the incoming backdrop
            let prevObj = null;
            for (let[key, object] of obj.entries()) {
                if (obj.size > 1) {
                    Stage.glManager.free(object.image);
                    object.glSprite.destroy({children:true});
                    obj.delete(key);
                }
                else
                    prevObj = object;
            }
			if (!param.src && (param.show != false)) {
				// show the previous backdrop
				if (param.effect) {
					let effect = param.effect;
					if (Stage.animations[param.effect] != null) {
						effect = Stage.animations[param.effect][1];
						prevObj.transTime = (Stage.animations[param.effect][0] > 0) ? Stage.animations[param.effect][0] : 0.1;
						if (Stage.animations[param.effect].length > 2)
							Helper.queueAnimation(type, param, Stage.animations[param.effect].slice(2));
					}
					prevObj.wait = true;
					if (effect.includes('nowait')) {
						prevObj.wait = false;
						effect = effect.replace('nowait','');
					}
					let fxarr = effect.split(' ');
					prevObj.effects = fxarr[0] + '_in';
					if (fxarr.length>1) prevObj.fxparam = fxarr.slice(1);
					if (TransEffects[fxarr[0]]['_init'])
						TransEffects[fxarr[0]]['_init'](prevObj, prevObj.fxparam);
				}
				else {
					prevObj.effects = '_in';
					prevObj.wait = true;
				}
				if (param.time != null) 
					prevObj.transTime = (param.time>0) ? param.time : 0.1;
				prevObj.drawn = false;
				prevObj.update = false;
				return;
			}
			// do a reverse effect on the previous backdrop
			prevObj.effects = '_out';
			if (param.effect) {
				let effect = param.effect;
				if (Stage.animations[param.effect] != null) {
					// just use first animation in the set
					effect = Stage.animations[param.effect][1];
					prevObj.transTime = (Stage.animations[param.effect][0] > 0) ? Stage.animations[param.effect][0] : 0.1;
					//if (Stage.animations[param.effect].length > 2)
					//	Helper.queueAnimation(type, param, Stage.animations[param.effect].slice(2));
				}
				prevObj.wait = true;
				if (effect.includes('nowait')) {
					prevObj.wait = false;
					effect = effect.replace('nowait','');
				}
				let fxarr = effect.split(' ');
				prevObj.effects = fxarr[0] + '_out';
				if (fxarr.length>1) prevObj.fxparam = fxarr.slice(1);
				if (TransEffects[fxarr[0]]['_init'])
					TransEffects[fxarr[0]]['_init'](prevObj, prevObj.fxparam);
			}
			if (param.time != null) 
				prevObj.transTime = (param.time>0) ? param.time : 0.1;
			prevObj.drawn = false;
			prevObj.update = false;
			nextid = parseInt(prevObj.id.substr(3))+1;
			if ((!param.src) && (param.show == false)) {
				return;
			}
		}
		// add the new backdrop
        let bd = (type == 'scene') ? new Scene(nextid, param.src, param.objects) : new Overlay(nextid, param.src);
		if (param.effect) {
			let fxset = param.effect;
			if (Stage.animations[param.effect] != null) {
				fxset = Stage.animations[param.effect][1];
				bd.transTime = (Stage.animations[param.effect][0] > 0) ? Stage.animations[param.effect][0] : 0.1;
				if (Stage.animations[param.effect].length > 2)
					Helper.queueAnimation(type, param, Stage.animations[param.effect].slice(2));
			}
			if (fxset.includes('nowait')) {
				bd.wait = false;
				fxset = fxset.replace('nowait','');
			}
			let fxarr = fxset.split(' ');
			bd.effects = fxarr[0] + '_in';
			if (fxarr.length > 1) 
				bd.fxparam = fxarr.slice(1);
			else 
                bd.fxparam = (obj.size > 0);

            // BUG: at this point, backdrop may not yet have completed async loading.
			// So, dimensions dependent effects will have erroneous values
            // Except when graphics or texture previously loaded
            if (bd.isready && /*bd.glSprite &&*/ TransEffects[fxarr[0]]['_init'])
                TransEffects[fxarr[0]]['_init'](bd, bd.fxparam);
		}
		else 
			bd.effects = '_in';
		if (param.time != null) 
			bd.transTime = (param.time>0) ? param.time : 0.1;
		if (param.offset) {
			if (typeof (param.offset) == "string") {
				bd.scroll = (param.offset == 'scroll') ? true : false;
                bd.offset = new Vector2d(0,0);
            }
			else {
				bd.scroll = false;
				bd.offset = new Vector2d(param.offset[0],param.offset[1]);
			}
		}
		else {
			bd.scroll = false;
			bd.offset = new Vector2d(0,0);
		}
		if (param.filter) {
            bd.filter = new Set(); //Array();
            let filters = (typeof param.filter === 'string') ? [param.filter] : param.filter;
            for (let f of filters) {
                let fx = {filter:'', param:''};
                let farr = f.split(' ');
                fx.filter = farr[0];
                fx.param = (farr.length>1) ? farr.slice(1) : null;
                bd.filter.add(fx);
            }
			//if (bd.filterparam && (bd.filterparam[bd.filterparam.length-1] == 'run'))
			//	bd.filterrun = true;
		}
		else {
			bd.filter = null;
			//bd.filterrun = false;
		}
		obj.set(bd.id, bd);
	});
});

///////////////////////////////////////////////////////////////////////////////
// Background/Overlay image
///////////////////////////////////////////////////////////////////////////////
// overlay - displays an overlay image (layer 2)
function overlay(param) {
	//Stage.Transition(param.time);
	Helper.processBackdrop(Stage.layers.ovl, 'overlay', param);
    Stage.Transition(Array.from(Stage.layers.ovl.values()).pop().transTime);
}
// scene - displays a background (layer 0)
function scene(param) {
	Helper.processBackdrop(Stage.layers.bg, 'scene', param);
	Stage.Transition(param.time);
}

class Backdrop {
    constructor() {
        this.id = 0,        // WebGL new
        this.isready = false,

        this.type = '';
        this.image = 0;     // WebGL changed: now image filename
        this.objects = new Array();
        this.loadSet = new Set();    // WebGL new
        this.drawn = false;
        this.redraw = true;
        this.visible = true;
        this.update = false;

        this.glSprite = null;   // WebGL new

        this.effects = 'done';
        this.fxparam = '';
        this.alpha = 0;
        this.target_alpha = 1;
        this.rotation = 0;
        this.orientation = 0;
        this.scale = 1;
        this.size = 1;
        this.scroll = false;
        this.transTime = 1;
        this.wait = true;

        this.origin = new Vector2d(0,0);		// backdrop's origin is center
        this.pos = new Vector2d(0,0);
        this.target_pos = new Vector2d(0,0);
        this.offset = new Vector2d(0,0);
        this.imageDim = new Vector2d(0,0);

        this.ovFrames = 1;						// overlay support for multiple frames
        this.ovFps = 0;
        this.ovTimer = 0;						// overlay timer
        this.ovTimerOn = false;
        this.ovCurFrame = 0;

        this.filter = null;						// image filter // WebGL changed
        //this.filterparam = null;
        //this.filterrun = false;
    }
    Create(id, file, obj) {
        this.id = escape(id);

        if (typeof file === 'string') {
            this.image = Helper.parseArg(file);
            this.origin.set(Stage.canvas.width>>1, Stage.canvas.height>>1);
            this.pos.copy(this.origin);
            
            if (obj) {
                for (let o of obj) {
                    let item = {glObj:null, src:Helper.parseArg(o.src), x:o.x, y:o.y,                   // WebGL new
                                frames:o.frames, fps:o.fps, bdTimer:0, bdTimerOn:false, curFrame:0};
                    this.objects.push(item);
                }
            }
            if (Helper.checkIfImage(this.image)) {
                let texCount = this.toLoad();
                Stage.glManager.addQueue(this.loadSet, texCount>0, 
                    (resources, init) => {
                        this.glSprite = new PIXI.Sprite(resources[this.image].texture);
                        this.glSprite.anchor.set(0.5, 0.5);
                        this.glSprite.position.set(this.pos.vx, this.pos.vy);                 
                        this.imageDim.set(this.glSprite.width, this.glSprite.height);
                        
                        for (let o of this.objects) {
                            let base = resources[o.src].texture;
                            o.glObj = new PIXI.Sprite(base);
                            o.glObj.position.set (o.x - this.imageDim.vx/2, 
                                                  o.y - this.imageDim.vy/2);
                            if (o.fps > 0) {
                                let framewidth = base.width/o.frames;
                                o.glObj.texture.frame = new PIXI.Rectangle(0,0,framewidth,base.height);
                            }
                        }
                        
                        if ( init && (this.effects != 'done') && (this.effects != '_in')) {
                            let fx = this.effects.split('_');
                            if (TransEffects[fx[0]]['_init']) {
                                TransEffects[fx[0]]['_init'](this, this.fxparam);
                            }
                        }                           
                        this.isLoaded();
                    }
                );
            }
            else {
                // assume valid HTML color; fill Stage with color
                let col = w3color(this.image);
                this.glSprite = new PIXI.Graphics();
                this.glSprite.beginFill(col.toVal(), col.toRgb().a);
                this.glSprite.drawRect(0, 0, Stage.canvas.width,  Stage.canvas.height);
                this.glSprite.endFill();
                this.glSprite.position.set(0,0);
                // PIXI.graphics does not have anchor point, so ref from top-left alwayx

                this.imageDim.set(this.glSprite.width, this.glSprite.height);
                this.glSubScene.addChild(this.glSprite);
                if (!obj) this.isready = true;
                else {
                    // glImage is color, but with objects to load
                    let texCount = this.toLoad();
                    Stage.glManager.addQueue(this.loadSet, texCount>0, 
                        (resources, init) => {
                            for (let o of this.objects) {
                                let base = resources[o.src].texture;
                                o.glObj = new PIXI.Sprite(base);
                                o.glObj.position.set (o.x, o.y);
                                if (o.fps > 0) {
                                    let framewidth = base.width/o.frames;
                                    o.glObj.texture.frame = new PIXI.Rectangle(0,0,framewidth,base.height);
                                }
                            }
                            this.isLoaded();
                        }
                    );
                }
            }
        }
        else {
            // assumed array [filename, frames, fps]
            this.image = Helper.parseArg(file[0]);
            this.origin.set(Stage.canvas.width>>1, Stage.canvas.height>>1);
            this.pos.copy(this.origin);
            [, this.ovFrames=1, this.ovFps=0] = file;

            let texCount = this.toLoad();
            Stage.glManager.addQueue(this.loadSet, texCount>0, 
                (resources, init) => {
                    let base = resources[this.image].texture;
                    this.glSprite = new PIXI.Sprite(base);
                    this.glSprite.anchor.set(0.5, 0.5);
                    this.glSprite.position.set(this.pos.vx, this.pos.vy);                 
                    this.imageDim.set(this.glSprite.width, this.glSprite.height);
                    
                    let framewidth = base.width/this.ovFrames;
                    this.glSprite.texture.frame = new PIXI.Rectangle(0,0,framewidth,base.height);
                    
                    if (init && (this.effects != 'done') && (this.effects != '_in')) {
                        let fx = this.effects.split('_');
                        if (TransEffects[fx[0]]['_init']) {
                            TransEffects[fx[0]]['_init'](this, this.fxparam);
                        }
                    }                           
                    this.isLoaded();
                }
            );
        }
        // configure transition
        this.transTime = (Config.transTime > 0) ? Config.transTime : 0.1;
        this.update = false;
        this.Reset(true);
        return this.id;
    }
    isLoaded() {
        this.glSubScene.addChild(this.glSprite);
        this.isready = true;       
    }
    toLoad() {
        this.loadSet.clear();
        this.loadSet.add(this.image);
        for (let o of this.objects) {
            this.loadSet.add(o.src);
        }
        return this.loadSet.size;
    }
    Reset(init) {
        if ((init) || (!this.visible)) {
            this.target_pos = new Vector2d(this.origin.vx, this.origin.vy);
            this.pos.copy(this.target_pos);
        }
        this.visible = true;
        this.redraw = true;
    }
    Update(elapsed) {
        if (this.isready) { 
            Helper.processEffects(this, elapsed);
        }
        return this.update;
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
        
        this.glSprite.visible = this.visible;
        if (this.visible) {
            this.glSprite.alpha = Math.max(0, Math.min(1, this.alpha));
            if (this.glSprite.pluginName == 'sprite') {
                this.glSprite.position.set(this.pos.vx + this.offset.vx, this.pos.vy + this.offset.vy);
                this.glSprite.scale.set(this.scale, this.scale);
                this.glSprite.rotation = this.rotation * Math.PI/180;
                if (this.filter && (this.filter.size>0)) {
                    let filterset = new Array();
                    for (let f of this.filter.values()) {
                        let fx = Filters[f.filter](f.param);
                        if (f.filter.toLowerCase().includes('flip')) {
                            this.glSprite.scale.x *= fx[0];
                            this.glSprite.scale.y *= fx[1];
                        }
                        else {
                            if (fx != null) filterset.push(fx);
                        }
                    }
                    this.glSprite.filters = (filterset.length>0) ? filterset : null;
                }
                if (this.ovFps > 0) {
                    let base = this.glSprite.texture.baseTexture;
                    let framewidth = base.width/this.ovFrames;
                    this.glSprite.texture.frame = new PIXI.Rectangle(this.ovCurFrame * framewidth, 0, framewidth, base.height);
                }
            }
            for (let o of this.objects) {
                if (o.fps > 0) {
                    let base = o.glObj.texture.baseTexture;
                    let framewidth = base.width/o.frames;
                    o.glObj.texture.frame = new PIXI.Rectangle(o.curFrame * framewidth, 0, framewidth, base.height);
                }
            }
        }
    
        this.redraw = false;
        if (this.drawn) this.update = true;
        return true;
    }
}

class Scene extends Backdrop {
    constructor(id, src, objects) {
        super();
        this.type = 'scene';
        this.glSubScene = Stage.glSubScene[0];

		let obj = new Array();
		if (objects) {
			// assumes multiples of 3/5
			let count = 0;
			while (count < objects.length) {
				let item = {src:'', x:0, y:0, frames:1, fps:0, link:''};
				item.src = objects[count];
				item.x = objects[count+1];
				item.y = objects[count+2];
				count += 3;
				// adds entry for sprite frame animation if it exists, ignores it if it doesn't
				if (count < objects.length) {
					if (typeof objects[count] == 'number') {
						item.frames = objects[count];
						item.fps = objects[count+1];
						count += 2;
					}
				}
				// TODO: add entry for link
				obj.push(item);
			}
		}
		super.Create(`scn${id}`, src, (obj.length > 0) ? obj : null);
    }
    isLoaded() {
        for (let o of this.objects)
            this.glSprite.addChild(o.glObj);
        super.isLoaded();
    }
    Update(elapsed) {
        let ret = super.Update(elapsed);
        if (this.isready) { 
            for (let o of this.objects) {
                if ((!o.bdTimerOn) && (o.fps>0)) {
                    o.bdTimer = setTimeout(() => {
                        o.curFrame = (++o.curFrame) % o.frames;
                        this.redraw = true;
                        if (this.visible) o.bdTimerOn = false;
                    }, 1000/o.fps);
                    o.bdTimerOn = true;
                }
            }
        }
        return ret;
    }
}

class Overlay extends Backdrop {
    constructor(id, src) {
        super();
        this.type = 'overlay';
        this.glSubScene = Stage.glSubScene[2];
		super.Create(`ovl${id}`, src, null);
    }
    Update(elapsed) {
        let ret = super.Update(elapsed);
        if (this.isready) { 
            if (!this.ovTimerOn && (this.ovFps>0)) {
                this.ovTimer = setTimeout(() => {
                    this.ovCurFrame = (++this.ovCurFrame) % this.ovFrames;
                    this.redraw = true;
                    if (this.visible) this.ovTimerOn = false;
                }, 1000/this.ovFps);
                this.ovTimerOn = true;
            }
        }
        return ret;
    }
}
