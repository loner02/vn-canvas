///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";
require(["app/vncanvas-fx"]);

///////////////////////////////////////////////////////////////////////////////
// Local Helpers
///////////////////////////////////////////////////////////////////////////////
require(["app/vncanvas-base"], function() {
	// Helper function to process actor
	Helper.processActor = ((obj, param) => {
		if (param.sprite) {
			if (typeof param.sprite == 'string') {
                if (obj.sprites[param.sprite]) {
                    if (obj.visible) {
                        obj.prevSprite = obj.activeSprite;
                        obj.alpha = 0;
                    }
                    obj.activeSprite = param.sprite;
                    
                    let sparr = new Array();
                    sparr.push(obj.activeSprite);
                    sparr.push(obj.sprites[obj.activeSprite].src);
                    sparr.push(obj.sprites[obj.activeSprite].align);
                    if (obj.sprites[obj.activeSprite].fps > 0) {
                        sparr.push(obj.sprites[obj.activeSprite].frames);
                        sparr.push(obj.sprites[obj.activeSprite].fps);
                        sparr.push(obj.sprites[obj.activeSprite].reps);
                        obj.sprites[obj.activeSprite].curRep = 0;
                        obj.sprites[obj.activeSprite].spTimerOn = false;
                    }                    
                    obj.addSprite(sparr);
                }
			}
			else {
				if (obj.visible && (obj.activeSprite != '')) {
					obj.prevSprite = obj.activeSprite;
					obj.alpha = 0;
				}
				obj.addSprite(param.sprite);
			}
		}
		if (param.avatar != null) {
			if (typeof param.avatar == 'string') {  // tag only
                if (obj.avatars[param.avatar]) {
                    obj.activeAvatar = param.avatar;
                    let avarr = new Array();
                    avarr.push(obj.activeAvatar);
                    avarr.push(obj.avatars[obj.activeAvatar].src);
                    if (obj.avatars[obj.activeAvatar].fps > 0) {
                        avarr.push(obj.avatars[obj.activeAvatar].frames);
                        avarr.push(obj.avatars[obj.activeAvatar].fps);
                        avarr.push(obj.avatars[obj.activeSprite].reps);
                        obj.avatars[obj.activeAvatar].curRep = 0;
                        obj.avatars[obj.activeAvatar].avTimerOn = false;
                    }                    
                    obj.addAvatar(avarr);
                }
                else {
                    obj.addAvatar([param.avatar]);
                }
            }
            else {
				obj.addAvatar(param.avatar);                
            }
		}
		if (param.position) {
            //for (let pos of param.position.split(' ')) {
			//	if (pos.search(/(left|right|center|auto|leftedge|rightedge|leftthird|rightthird)/g) != -1) {
					obj.posMode = param.position;
                    obj.pos.vx = Helper.positionActor(param.position);
                    obj.target_pos.vx = obj.pos.vx;
			//	}
            //}
		}
        obj.filter = null;
		if (param.filter) {
            obj.filter = new Set(); //Array();
            let filters = (typeof param.filter === 'string') ? [param.filter] : param.filter;
            for (let f of filters) {
                let fx = {filter:'', param:''};
                let farr = f.split(' ');
                fx.filter = farr[0];
                fx.param = (farr.length>1) ? farr.slice(1) : null;
                obj.filter.add(fx);
            }
			//if (chr.filterparam != null)
			//	if (chr.filterparam[chr.filterparam.length-1] == 'run')
			//		chr.filterrun = true;
		}
		let suffix;
		if ((param.show == false) ||
			(param.remove == 'actor') ||
			(obj.sprites[obj.activeSprite].id == param.remove))
			suffix = '_out';
		else
			suffix = '_in';
		if (param.effect) {
			let effect = param.effect;
			if (Stage.animations[param.effect] != null) {
				effect = Stage.animations[param.effect][1];
				obj.transTime = (Stage.animations[param.effect][0] > 0) ? Stage.animations[param.effect][0] : 0.1;
				if (Stage.animations[param.effect].length > 2)
					Helper.queueAnimation('actor', param, Stage.animations[param.effect].slice(2));
			}
			obj.wait = true;
			if (param.effect.includes('nowait')) {
				obj.wait = false;
				effect = param.effect.replace('nowait','');
			}
			let fxarr = effect.split(' ');
			obj.effects = fxarr[0] + suffix;
			obj.prevFx = fxarr[0];
			if (fxarr.length > 1) obj.fxparam = fxarr.slice(1);
            else obj.param = (obj.size>0);
			// BUG: at this point, sprite may not yet have completed async loading.
			// So, dimensions-based effects will have erroneous values
			if (obj.isready && (TransEffects[fxarr[0]]['_init']) /*&& (suffix=='_out')*/)
				TransEffects[fxarr[0]]['_init'](obj, obj.fxparam);
		}
		else {
			obj.wait = true;
			obj.effects = obj.prevFx + suffix;
            // BUG: effects initiated even if only a dialog update
            if (!Helper.checkIfDialog(param))
                if (TransEffects[obj.prevFx] != null) {
                    if ((TransEffects[obj.prevFx]['_init'])/* && (suffix=='_out')*/)
                        TransEffects[obj.prevFx]['_init'](obj, obj.fxparam);
                }
		}
		if (param.remove) {
			if (param.remove == 'actor')
				obj.pendingRemoval = true;
			else
				obj.removeSprite(param.remove);
		}
		if (param.time != null) 
            obj.transTime = (param.time>0) ? param.time : 0.1;
        if (param.origin) {
            obj.origin.vx = param.origin[0];
            obj.origin.vy = param.origin[1];
        }
	});
	// Helper function to process actor
    Helper.positionActor = ((posMode) => {
        if (typeof posMode == 'number')
            return (Stage.canvas.width*posMode)>>0;
        switch (posMode) {
            case 'left': return (Stage.canvas.width/4)>>0;
            case 'right': return (Stage.canvas.width*3/4)>>0;
            case 'leftedge': return 0;
            case 'rightedge': return Stage.canvas.width;
            case 'leftthird': return (Stage.canvas.width/3)>>0;
            case 'rightthird': return (Stage.canvas.width*2/3)>>0;
            case 'center': return (Stage.canvas.width/2)>>0;
            case 'auto':
            default: return (Stage.canvas.width/2)>>0;
        }
    });
	// Helper function to process dialog
	Helper.processDialog = ((obj, param) => {
		if (param.nick)
			obj.nick = Helper.parseArg(param.nick);
		if ((param.say) || (param.balloon)) {
            let box = Stage.layers.gui.get("box");
            let cont = Helper.checkCurrentSpeaker(obj.nick, (param.append != undefined) ? param.append : Config.boxAppendOverride);
			if (!param.balloon) {
				box.text = Helper.addTagToDialog(obj.nick, obj.color, param.say, cont);
                box.tagColor = w3color(obj.color).toHexString();
            }
			else {
				box.text = Helper.addTagToDialog(null, null, param.balloon, false);
				box.bpos = (param.bpos != null) ? param.bpos : 'up';
            }
			box.avatar = (obj.activeAvatar != '') ? obj.activeAvatar : '';
            box.avatarStruct = (box.avatar != '') ? obj.avatars[obj.activeAvatar] : null;
		
			box.alpha = 1;
			box.effects = "none";
			box.scrollOffsetY = 0;
			box.visible = true;
			box.changed = true;
			box.balloon = (param.balloon) ? param.id : null;
            
			if (Config.boxAutotype) {
				box.autotype = true;
				box.effects = "autotype";
			}
			if (param.voice && Helper.processAudio)
				Helper.processAudio (Stage.sounds.vc, param.voice, {voice:param.voice});
		}
    });
	// Helper function to check if a dialog-only update
    // TODO: just a workaround, FIXME
    Helper.checkIfDialog = ((param) => {
        // cases:
        //  'name', 'text' (same as actor, {id:'id', say:'text'})
        //  'name', {say:'text'} (same as actor, {id:'id', say:'text'})
        //  'name', {balloon:'text'} (same as actor, {id:'id', balloon:'text'})
        //  'name', {say:'text', voice:'audio'}
        //  'name', {balloon:'text', voice:'audio'}
        //  'name', {say:'text', append:boolean}
        //  'name', {say:'text', append:boolean, voice:'audio'}
        
        let args = new Set(Object.keys(param));
        let allowed = 1;
        if (args.has('nick') && (args.size==++allowed)) return true;
        if (args.has('avatar') && (args.size==++allowed)) return true;
        if (args.has('say') || args.has('balloon')) {
            if ((args.size==allowed+1) ||
               ((args.size==allowed+2) && (args.has('voice') || args.has('append'))) ||
               ((args.size==allowed+3) && (args.has('voice') && args.has('append'))))
               return true;
        }
        return false;
    });
    Helper.sortActors = (() => {
        let actarr = new Array();
        for (let[key, actor] of Stage.layers.fg.entries()) {
            let obj = {id:'', z:0};
            obj.id = key;
            obj.z = actor.z_order;
            actarr.push(obj);
        }
        actarr.sort((a,b) => {return a.z-b.z});
        // reorder glSubScene[1]
        Stage.glSubScene[1].removeChildren();
        for (let actor of actarr) {
            Stage.glSubScene[1].addChild(Stage.layers.fg.get(actor.id).glActor);
        }
    });
	// Helper function to build default stats for a character
	Helper.buildStats = ((id) => {
		if (Config.modRPG) {
			return RPG.methods.buildStats(id);
		}
		else if (Stats){
			let newStats = {};
			for (let prop in Stats) {
				if (Stats.hasOwnProperty(prop)) {
					newStats[prop] = Stats[prop]._value[0];
					if (Stats[prop]._inherit) {
						newStats[Stats[prop]._inherit[Stats[prop]._value[0]].type] = {};
						for (attr in Stats[prop]._inherit[Stats[prop]._value[0]]) {
							if (attr == "type") continue;
							newStats[Stats[prop]._inherit[Stats[prop]._value[0]].type][attr] =
								Stats[prop]._inherit[Stats[prop]._value[0]][attr]._value[0];
						}
					}
				}
			}
			return newStats;
		}
		return null;
	});    
});

///////////////////////////////////////////////////////////////////////////////
// Actors
///////////////////////////////////////////////////////////////////////////////
// actor - create and display character (layer 1)
function actor(param) {
    if (Stage.layers.fg.size > 0) {
		// look for same id
        let actor = Stage.layers.fg.get(param.id);
        if (actor) {
            let sorted = false;
    		if ((param.z_order != undefined) && (actor.z_order != param.z_order)) {
    			actor.z_order = param.z_order
    			sorted = true;
    		}
            // update an existing actor
            Helper.processActor(actor, param);
            Helper.processDialog(actor, param);
    		if (sorted) Helper.sortActors();
            
            // done updating, do not trickle down
            actor.drawn = actor.update = false;
            if ((actor.visible && (actor.effects.includes('out'))) ||
                (/*!actor.visible && */(actor.effects.includes('in'))) ||
                ((param.position) && (param.position.search(/(left|right|center|auto|leftedge|rightedge|leftthird|rightthird)/g) != -1)))
                Stage.Transition(actor.transTime);	
            return;
         }
	}
	// this is a new actor
	let chr = new Character(param.id, param.z_order ? param.z_order : 0);
	chr.nick = (param.nick) ? Helper.parseArg(param.nick) : param.id;
	chr.color = (param.color) ? param.color : Stage.layers.gui.get("box").tagColor;
    Helper.processActor(chr, param);
    Helper.processDialog(chr, param);
    Stage.layers.fg.set(param.id, chr);
    Helper.sortActors();
	Stage.Transition(chr.transTime);
}

class Character {
    constructor(id, order) {
        this.type = 'actor';
        this.sprites = {};                      // WebGL changed to object
        //this.avatar = null;                   // WebGL changed to actveAvatar
        this.avatars = {};				        // WebGL changed to object
        this.nick = '';
        this.color = 0;
        this.prevSprite = '';                   // WebGL changed
        this.activeSprite = '';                 // WebGL changed
        this.activeAvatar = '';                 // WebGL changed
        this.pendingRemoval = false;
        this.activeSpriteRemoval = false;
        this.stats = Helper.buildStats(id);

        this.origin = new Vector2d(0.5, 1.0);		// actor origin is bottom center
        this.pos = new Vector2d(0,0);
        this.target_pos = new Vector2d(0,0);
        this.offset = new Vector2d(0,0);        // WebGL changed
        this.imageDim = new Vector2d(0,0);
        this.posMode = 'auto';

        this.effects = 'done';
        this.prevFx = '';
        this.fxparam = '';
        this.alpha = 0;
        this.target_alpha = 0;
        this.rotation = 0;
        //this.accum_rotation = 0;              // WebGL changed
        this.orientation = 0;
        this.scale = 1;
        this.size = 1;
        this.wait = true;

        this.id = id;
        this.align = 'floor';
        this.z_order = order;
        this.z_scale = 1.0;
        this.transTime = (Config.transTime > 0) ? Config.transTime : 0.1;
        this.isready = true;
        this.update = false;
        this.drawn = false;
        this.redraw = true;
        this.visible = true;
        this.Reset(true);
        
        this.filter = null;						// image filter // WebGL changed
        //this.filterparam = null;
        //this.filterrun = false;

        this.pSprite = 0;
        this.glActor = new PIXI.Container();    // WebGL new
        this.glActor.name = this.id;
        this.glSpriteA = new PIXI.Sprite();
        this.glSpriteB = new PIXI.Sprite();
        this.glAvatar = new PIXI.Sprite();
        this.glActor.addChild(this.glSpriteA);
        this.glActor.addChild(this.glSpriteB);
        this.glActor.addChild(this.glAvatar);
        Stage.glSubScene[1].addChild(this.glActor);
    }
    Reset(init) {
        //if (init || !this.visible) {  // TODO
        if (init) {
            this.target_pos = new Vector2d(Helper.positionActor(this.posMode), Stage.canvas.height);
            this.pos.copy(this.target_pos);
            //this.offset.set(0,0);
        }
        this.visible = true;
        this.redraw = true;
    }
    addSprite(spriteArray) {
        let tag = spriteArray[0],
            file = spriteArray[1],
            valign = 'floor',
            frames = 1,
            fps = 0,
            reps = -1;

        if (spriteArray[2]) {
            if (typeof spriteArray[2] == 'string') {
                [, , valign, frames=1, fps=0, reps=-1] = spriteArray;
            }
            else {	// it's a number, set is as frames
                [, , frames=1, fps=0, reps=-1] = spriteArray;
            }
        }
        
        this.isready = false;
        if ((this.activeSprite != '') && this.sprites[tag]) {
            if (this.sprites[tag].src == Helper.parseArg(file)) {
                // same tag/same sprite
                this.isready = true;
            }
            else {  // same tag/new sprite
                this.sprites[tag].src = Helper.parseArg(file);
                this.pSprite = (++this.pSprite)%2;
            }
            this.sprites[tag].align = valign;
            this.sprites[tag].frames = frames;
            this.sprites[tag].fps = fps;
            this.sprites[tag].reps = reps;
            this.pSprite = (++this.pSprite)%2;
}
        else {
            // this is new tag/sprite
            let newSprite = {id:tag, src:Helper.parseArg(file), align:valign,       //WebGL changed
                             frames:frames, fps:fps, reps:reps, 
                             spTimer:0, spTimerOn:false, curFrame:0, curRep:0};
            this.sprites[tag] = newSprite;
            this.pSprite = (++this.pSprite)%2;
        }
        this.activeSprite = tag;

        Stage.glManager.addQueue([this.sprites[this.activeSprite].src],
            /*!Stage.glManager.hasLoaded(this.sprites[this.activeSprite].src) &&*/ !this.isReady,
            (resources, init) => {
                let base = resources[this.sprites[this.activeSprite].src].texture;
                this.imageDim.set(base.width/this.sprites[this.activeSprite].frames, base.height);
                //this.origin.set(0.5, 1.0);
                if (Config.actorFullBody) {
                    //this.offset.vy = this.imageDim.vy/2;
                    this.offset.vy = (-Stage.canvas.height + this.imageDim.vy) * ((this.z_order + Config.actorRange)/Config.actorRange);
                    this.offset.vy += this.z_order*Config.actorPersOffset;

                    let s = this.imageDim.vy * ((this.z_order + Config.actorRange)/Config.actorRange);
                    let c = Stage.canvas.height * (-this.z_order/Config.actorRange);
                    this.z_scale = (s + c)/this.imageDim.vy;
                }
                else {
                    let align = this.sprites[this.activeSprite].align;
                    switch (align) {
                        case 'roof': this.offset.vy = this.imageDim.vy+Stage.canvas.height*(Config.actorYPosition-2); break;
                        case 'top': this.offset.vy = this.imageDim.vy-Stage.canvas.height; break;
                        case 'center': this.offset.vy = (this.imageDim.vy-Stage.canvas.height)/2; break;
                        case 'floor': this.offset.vy = Stage.canvas.height*(Config.actorYPosition-1); break;
                        case 'bottom':
                        default: this.offset.vy = 0;
                    }
                }
                if (this.pSprite == 0) {
                    this.glSpriteA.texture = base;
                    this.glSpriteA.texture.frame = new PIXI.Rectangle(0,0,this.imageDim.vx,base.height);
                }
                else {
                    this.glSpriteB.texture = base;
                    this.glSpriteB.texture.frame = new PIXI.Rectangle(0,0,this.imageDim.vx,base.height);
                }
                
                if (init && (this.effects != 'done') && (this.effects != '_in') && (this.effects != '_out')) {
                    let fx = this.effects.split('_');
                    if (TransEffects[fx[0]]['_init']) {
                        TransEffects[fx[0]]['_init'](this, this.fxparam);
                    }
                }
                this.isready = true;                                        
            }
        );
        this.update = false;
    }
    removeSprite(tag) {
        // Do not remove last sprite of an actor
        if (Object.keys(this.sprites).length <= 1) return;
        
        if (this.sprites[tag]) {
            if (this.activeSprite == tag) {
                this.activeSpriteRemoval = true;
                // force actor to fade away
                this.effects = "fade_out";
            }
            else {
                Stage.glManager.free(this.sprites[tag].src);
                delete(this.sprites[tag]);
            }
        }
    }
    addAvatar(avatarArray) {
        let [tag, file, frames=1, fps=0, reps=-1] = avatarArray;
        if (tag == '') {
            this.activeAvatar = '';
            return;
        }
        this.isready = false;
        Stage.layers.gui.get("box").isready = false;
        if ((this.activeAvatar != '') && this.avatars[tag]) {
            if (this.avatars[tag].src == Helper.parseArg(file)) {
                // same tag/same avatar
                this.isready = true;
            }
            else { // same tag/new avatar
                this.avatars[tag] = Helper.parseArg(file);
            }
            this.avatars[tag].frames = frames;
            this.avatars[tag].fps = fps;
            this.avatars[tag].reps = reps;
            this.avatars[tag].curRep = 0;
            this.avatars[tag].avTimerOn = false;
        }
        else {
            // new tag/new avatar
            let newAvatar = {id:tag, src:Helper.parseArg(file),
                             frames:frames, fps:fps, reps:reps,
                             avTimer:0, avTimerOn:false, curFrame:0, curRep:0};
            this.avatars[tag] = newAvatar;
        }
        //this.activeAvatar = '';

        Stage.glManager.addQueue([this.avatars[tag].src],
            !this.isReady,
            (resources, init) => {
                let base = resources[this.avatars[tag].src].texture;
                this.avatars[tag].imageDim = new Vector2d();
                this.avatars[tag].origin = new Vector2d();
                this.avatars[tag].imageDim.set(base.width/this.avatars[tag].frames,base.height);
                this.avatars[tag].origin.set(0, 1.0);       // anchor at bottom-left
                this.activeAvatar = tag;
                this.isready = true;                                        
                
                let box = Stage.layers.gui.get("box");
                box.avatar = this.activeAvatar;
                box.avatarStruct = (box.avatar != '') ? this.avatars[this.activeAvatar] : null;
                box.isready = true;
            }
        );
        this.update = false;
    }
    Update(elapsed) {
        if (this.isready) {
            if (this.activeSprite != '') {
                Helper.processEffects(this, elapsed);
                if ((!this.sprites[this.activeSprite].spTimerOn) && (this.sprites[this.activeSprite].fps>0)) {
                    this.sprites[this.activeSprite].spTimer = setTimeout(() => {
                        this.sprites[this.activeSprite].curFrame = (++this.sprites[this.activeSprite].curFrame) % this.sprites[this.activeSprite].frames;
                        if (this.sprites[this.activeSprite].curFrame == 0) this.sprites[this.activeSprite].curRep++;
                        this.redraw = true;
                        if (this.visible) {
                            if ((this.sprites[this.activeSprite].reps < 0) || (this.sprites[this.activeSprite].curRep < this.sprites[this.activeSprite].reps))
                                this.sprites[this.activeSprite].spTimerOn = false;
                        }
                    }, 1000/this.sprites[this.activeSprite].fps);
                    this.sprites[this.activeSprite].spTimerOn = true;
                }
                /*
                if (this.filterrun)
                    this.redraw = true;		// forever run filter
                */
            }
        }	
        return this.update;
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
        if (this.activeSprite == '') return false;
        
        this.glActor.visible = this.visible;
        if (this.visible) {
            if ((this.prevSprite != '') && this.sprites[this.prevSprite] && !this.activeSpriteRemoval) {
                // activeSprite is on the way out, do not mix previous sprite
                if (!this.effects.includes('_out')) {
                    let sprite = (this.pSprite==0) ? this.glSpriteB : this.glSpriteA;
                    sprite.alpha = Math.max(0, Math.min(1, this.target_alpha - this.alpha));                    
                }
                else {
                    this.prevSprite = '';
                }
            }
            if ((this.activeSprite != '') && this.sprites[this.activeSprite]) {
                let sprite = (this.pSprite==0) ? this.glSpriteA : this.glSpriteB;
                sprite.position.set(this.pos.vx+this.offset.vx, this.pos.vy+this.offset.vy);
                sprite.anchor.set(this.origin.vx, this.origin.vy);
                sprite.alpha = Math.max(0, Math.min(1, this.alpha));                    
                sprite.scale.set(this.scale*this.z_scale, this.scale*this.z_scale);
                sprite.rotation = this.rotation * Math.PI/180;
                if (this.filter && (this.filter.size>0)) {
                    let filterset = new Array();
                    for (let f of this.filter.values()) {
                        let fx = Filters[f.filter](f.param);
                        if (f.filter.toLowerCase().includes('flip')) {
                            sprite.scale.x *= fx[0];
                            sprite.scale.y *= fx[1];
                            // recalculate Y position
                            if (fx[1] == -1) sprite.position.y -= this.scale*this.imageDim.vy;
                        }
                        else {
                            if (fx != null) filterset.push(fx);
                        }
                    }
                    sprite.filters = (filterset.length>0) ? filterset : null;
                }
                if (this.sprites[this.activeSprite].fps > 0) {
                    let base = sprite.texture.baseTexture;
                    let framewidth = base.width/this.sprites[this.activeSprite].frames;
                    sprite.texture.frame = new PIXI.Rectangle(this.sprites[this.activeSprite].curFrame * framewidth, 0, framewidth, base.height);
                }
            }
            if (this.activeSpriteRemoval && (this.alpha <= 0)) {
                Stage.glManager.free(this.sprites[this.activeSprite].src);
                delete(this.sprites[this.activeSprite]);
                this.activeSprite = this.prevSprite;
                this.prevSprite = '';
                this.pSprite = (++this.pSprite)%2;
                this.activeSpriteRemoval = false;
            }
        }
        this.redraw = false;
        if (this.drawn) this.update = true;
        return true;
    }
}