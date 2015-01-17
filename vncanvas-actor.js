///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";
require(["app/vncanvas-fx"]);

///////////////////////////////////////////////////////////////////////////////
// Local Helpers
///////////////////////////////////////////////////////////////////////////////
// Helper function to process actor
Helper.processActor = (function (chr, param) {
	if (param.sprite) {
		if (typeof param.sprite == 'string') {
			for (var i in chr.sprites) {
				if (chr.sprites[i].id == param.sprite) {
					if (chr.visible) {
						chr.prevSprite = chr.activeSprite;
						chr.alpha = 0;
					}
					chr.activeSprite = i;
					// update sprite dimensions here
					chr.spriteDim = new Vector2d(chr.sprites[i].src.width / chr.sprites[i].frames, 
												 chr.sprites[i].src.height);
					var dim = Math.ceil(chr.spriteDim.length());
					chr.context.canvas.setAttribute('width', dim);
					chr.context.canvas.setAttribute('height', dim);
					chr.origin = new Vector2d(dim/2, dim/2 + chr.spriteDim.vy/2);
					// update sprite alignment here
					if (chr.sprites[i].align == 'roof')
						chr.offset.vy = -Stage.canvas.height*(2*Config.actorYPosition-1) + chr.sprites[i].src.height;
					else if (chr.sprites[i].align == 'top')
						chr.offset.vy = -Stage.canvas.height*(Config.actorYPosition) + chr.sprites[i].src.height;
					else if (chr.sprites[i].align == 'center')
						chr.offset.vy = -Stage.canvas.height*(Config.actorYPosition-0.5) + chr.sprites[i].src.height*0.5;
					else if (chr.sprites[chr.activeSprite].align == 'bottom')
						chr.offset.vy = -Stage.canvas.height*(Config.actorYPosition-1);
					else
						chr.offset.vy = 0;
					// set timer to false to trigger animation
					if (chr.sprites[i].fps > 0) {
						chr.sprites[i].curRep = 0;
						chr.sprites[i].spTimerOn = false;
					}
					break;
				}
			}
		}
		else {
			if (chr.visible && (chr.activeSprite > -1)) {
				chr.prevSprite = chr.activeSprite;
				chr.alpha = 0;
			}
			//chr.AddSprite(param.sprite[0], param.sprite[1], param.sprite[2]);
			chr.AddSprite(param.sprite);
		}
	}
	//if (param.avatar) chr.AddAvatar(param.avatar);
	if (param.avatar != null) {
		if (typeof param.avatar == 'string') {
			if (param.avatar && !Helper.checkIfImage(param.avatar)) {
				for (var i in chr.avatars) {
					if (chr.avatars[i].id == param.avatar) {
						chr.avatars[i].curRep = 0;	// reset repetition to retrigger
						chr.avatars[i].avTimerOn = false;
						chr.AddAvatar(chr.avatars[i].src);
						break;
					}
				}
			}
			else {
				// for compatibility only
				chr.AddAvatar(param.avatar);
			}
		}
		else {
			var found = false;
			for (var i in chr.avatars) {
				if (chr.avatars[i].id == param.avatar[0]) {
					chr.avatars[i].src = param.avatar[1];
					chr.avatars[i].frames = (param.avatar[2] != null) ? param.avatar[2] : 1;
					chr.avatars[i].fps = (param.avatar[3] != null) ? param.avatar[3] : 0;
					chr.avatars[i].reps = (param.avatar[4] != null) ? param.avatar[4] : -1;
					chr.avatars[i].curRep = 0;	// reset repetition to retrigger
					chr.avatars[i].avTimerOn = false;
					found = true;
					break;
				}
			}
			if (!found) {
				chr.avatars.push({id:param.avatar[0], src:param.avatar[1],
								  frames:(param.avatar[2] != null) ? param.avatar[2] : 1,
								  fps:(param.avatar[3] != null) ? param.avatar[3] : 0,
								  reps:(param.avatar[4] != null) ? param.avatar[4] : -1,
								  avTimer:0, avTimerOn:false, curFrame:0, curRep:0});
			}
			chr.AddAvatar(param.avatar[1]);
		}
	}
	if (param.position) {
		var subs = param.position.split(' ');
		for (var i in subs) {
			if (subs[i].search(/(left|right|center|auto)/g) != -1) {
				chr.posMode = subs[i];
				if (subs[i] == 'left') {
					chr.pos.vx = (Stage.canvas.width/4)>>0;
					chr.target_pos.vx = chr.pos.vx;
				}
				if (subs[i] == 'right') {
					chr.pos.vx = (Stage.canvas.width*3/4)>>0;
					chr.target_pos.vx = chr.pos.vx;
				}
				if (subs[i] == 'center') {
					chr.pos.vx = (Stage.canvas.width/2)>>0;
					chr.target_pos.vx = chr.pos.vx;
				}
			}
		}
	}
	var suffix;
	if ((param.show == false) ||
		(param.remove == 'actor') ||
		(chr.sprites[chr.activeSprite].id == param.remove))
		suffix = '_out';
	else
		suffix = '_in';
	if (param.effect) {
		var effect = param.effect;
		if (Stage.animations[param.effect] != null) {
			effect = Stage.animations[param.effect][1];
			chr.transTime = (Stage.animations[param.effect][0] > 0) ? Stage.animations[param.effect][0] : 0.1;
			if (Stage.animations[param.effect].length > 2)
				Helper.queueAnimation('actor', param, Stage.animations[param.effect].slice(2));
		}
		chr.wait = true;
		if (param.effect.indexOf('nowait')!=-1) {
			chr.wait = false;
			effect = param.effect.replace('nowait','');
		}
		var fxarr = effect.split(' ');
		chr.effects = fxarr[0] + suffix;
		chr.prevFx = fxarr[0];
		if (fxarr.length > 1) chr.fxparam = fxarr.slice(1);
		if (TransEffects[fxarr[0]]['_init'])
			TransEffects[fxarr[0]]['_init'](chr, chr.fxparam);
	}
	else {
		chr.wait = true;
		chr.effects = chr.prevFx + suffix;
	}
	if (param.remove) {
		if (param.remove == 'actor')
			chr.pendingRemoval = true;
		else
			chr.RemoveSprite(param.remove);
	}
	if (param.time != null) 
		chr.transTime = (param.time>0) ? param.time : 0.1;
	if (param.nick)
		chr.nick = param.nick;
	if ((param.say) || (param.balloon)) {
		var cont = Helper.checkCurrentSpeaker(chr.nick, param.append);
		if (!param.balloon)
			Stage.layers[4][0].text = Helper.addTagToDialog(chr.nick, chr.color, param.say, cont);
		else
			Stage.layers[4][0].text = Helper.addTagToDialog(null, null, param.balloon, false);
		Stage.layers[4][0].avatar = (chr.avatar != null) ? chr.avatar : null;
		if (Stage.layers[4][0].avatar != null) {
			for (var i in chr.avatars) {
				if (Stage.layers[4][0].avatar.src.search(chr.avatars[i].src) != -1) {
					Stage.layers[4][0].avatarStruct = chr.avatars[i];
					break;
				}
			}
		}
		else
			Stage.layers[4][0].avatarStruct = null;
		
		Stage.layers[4][0].alpha = 1;
		Stage.layers[4][0].effects = "none";
		Stage.layers[4][0].scrollOffsetY = 0;
		Stage.layers[4][0].visible = true;
		Stage.layers[4][0].changed = true;
		Stage.layers[4][0].balloon = (param.balloon) ? param.id : null;
		
		if (Config.boxAutotype) {
			Stage.layers[4][0].autotype = true;
			Stage.layers[4][0].effects = "autotype";
		}
		if (param.voice)
			Helper.processAudio (Stage.sounds[3], param.voice, {voice:param.voice});
	}
});

///////////////////////////////////////////////////////////////////////////////
// Actors
///////////////////////////////////////////////////////////////////////////////
// actor - create and display character (layer 1)
function actor(param) {
	if (Stage.layers[1].length > 0) {
		// look for same id
		for (var i=0; i<Stage.layers[1].length; i++) {
			if (Stage.layers[1][i].id == param.id) {
				// update an existing actor
				Helper.processActor(Stage.layers[1][i], param);
				// check if a reorder is needed
				if (param.z_order) Stage.layers[1][i].z_order = param.z_order
				// done updating, do not trickle down
				Stage.layers[1][i].drawn = false;
				Stage.layers[1][i].update = false;
				if ((Stage.layers[1][i].visible && (Stage.layers[1][i].effects.indexOf('out')!=-1)) ||
					(!Stage.layers[1][i].visible && (Stage.layers[1][i].effects.indexOf('in')!=-1)) ||
					((param.position) && (param.position.search(/(left|right|center|auto)/g) != -1)))
					Stage.Transition(Stage.layers[1][i].transTime);	
				if (param.z_order && (Stage.layers[1][i].z_order != param.z_order)) {
					Stage.layers[1][i].z_order = param.z_order
					Stage.layers[1].sort(function(a,b){return a.z_order-b.z_order});
				}
				return;
			}
		}
	}
	// this is a new actor
	var chr = new Character(param.id, param.z_order ? param.z_order : 0);
	chr.nick = (param.nick) ? Helper.parseArg(param.nick) : param.id;
	chr.color = (param.color) ? param.color : Stage.layers[4][0].tagColor;
	Helper.processActor(chr, param);
	Stage.layers[1].push(chr);	
	Stage.layers[1].sort(function(a,b){return a.z_order-b.z_order});
	Stage.Transition(chr.transTime);
	chr = null;
}

function Character(id, order) {
	this.type = 'actor';
	//this.context = 0;
	this.sprites = new Array();
	this.avatar = null;
	this.avatars = new Array();				// avatar array with tags
	//this.id = '';
	this.nick = '';
	this.color = 0;
	this.prevSprite = -1;
	this.activeSprite = -1;
	//this.isready = false;
	this.drawn = false;
	//this.update = false;
	this.redraw = true;
	this.visible = true;
	this.pendingRemoval = false;
	this.activeSpriteRemoval = false;
	this.stats = Helper.buildStats(id);

	this.origin = new Vector2d(0,0);		// actor origin is bottom center
	this.pos = new Vector2d(0,0);
	this.target_pos = new Vector2d(0,0);
	this.offset = new Vector2d(0,0);
	this.spriteDim = new Vector2d(0,0);
	this.posMode = 'auto';

	this.effects = 'done';
	this.prevFx = '';
	this.fxparam = '';
	this.alpha = 0;
	this.target_alpha = 0;
	this.rotation = 0;
	this.accum_rotation = 0;
	this.orientation = 0;
	this.scale = 1;
	this.size = 1;
	//this.transTime = 1;
	this.wait = true;

	this.id = id;
	this.z_order = order;
	var canvas = document.createElement('canvas');
	canvas.id = escape(id);
	this.context = canvas.getContext('2d');
	this.transTime = (Config.transTime > 0) ? Config.transTime : 0.1;
	this.isready = true;
	this.update = false;
	this.Reset(true);
	canvas = null;
	//return this.context.canvas.id;
}
//Character.prototype.AddSprite = function(tag, file, valign) {
Character.prototype.AddSprite = function(spriteArray) {
	var that = this;
	var idx = -1;
	var tag = spriteArray[0];
	var file = spriteArray[1];
	var valign = 'floor';
	var frames = 1;
	var fps = 0;
	var reps = -1;
	
	if (this.sprites.length > 1) {
		for (var i in this.sprites) {
			if (this.sprites[i].id == tag) {
				if (this.sprites[i].src.src.search(file) != -1) {
					// this is same sprite, set to active and update alignment
					this.isready = true;
					this.update = false;
					this.activeSprite = i;
					
					if (spriteArray[2]) {
						if (typeof spriteArray[2] == 'string') {
							this.sprites[this.activeSprite].align = spriteArray[2];
							if (spriteArray[3] != null) this.sprites[this.activeSprite].frames = spriteArray[3];
							if (spriteArray[4] != null) this.sprites[this.activeSprite].fps = spriteArray[4];
							if (spriteArray[5] != null) this.sprites[this.activeSprite].reps = spriteArray[5];
						}
						else {
							this.sprites[this.activeSprite].frames = spriteArray[2];
							if (spriteArray[3] != null) this.sprites[this.activeSprite].fps = spriteArray[3];
							if (spriteArray[4] != null) this.sprites[this.activeSprite].reps = spriteArray[4];
						}
					}
					if (this.sprites[this.activeSprite].align == 'roof')
						this.offset.vy = -Stage.canvas.height*(2*Config.actorYPosition-1) + this.sprites[this.activeSprite].src.height;
					else if (this.sprites[this.activeSprite].align == 'top')
						this.offset.vy = -Stage.canvas.height*(Config.actorYPosition) + this.sprites[this.activeSprite].src.height;
					else if (this.sprites[this.activeSprite].align == 'center')
						this.offset.vy = -Stage.canvas.height*(Config.actorYPosition-0.5) + this.sprites[this.activeSprite].src.height*0.5;
					else if (this.sprites[this.activeSprite].align == 'bottom')
						this.offset.vy = -Stage.canvas.height*(Config.actorYPosition-1);
					else
						this.offset.vy = 0;
					// update sprite dimensions here
					this.spriteDim = new Vector2d(this.sprites[this.activeSprite].src.width / this.sprites[this.activeSprite].frames, 
												 this.sprites[this.activeSprite].src.height);
					var dim = Math.ceil(this.spriteDim.length());
					this.context.canvas.setAttribute('width', dim);
					this.context.canvas.setAttribute('height', dim);
					this.origin = new Vector2d(dim/2, dim/2 + this.spriteDim.vy/2);
					// set timer to false to trigger animation
					if (this.sprites[this.activeSprite].fps > 0) { 
						this.sprites[this.activeSprite].curRep = 0;
						this.sprites[this.activeSprite].spTimerOn = false;
					}
					return;
				}
				else {
					// this is same tag but different sprite
					idx = i;
					break;
				}
			}
		}
	}
	this.isready = false;
	if (spriteArray[2]) {
		if (typeof spriteArray[2] == 'string') {
			valign = spriteArray[2];
			frames = (spriteArray[3] != null) ? spriteArray[3] : 1;
			fps = (spriteArray[4] != null) ? spriteArray[4] : 0;
			reps = (spriteArray[5] != null) ? spriteArray[5] : -1;
		}
		else {	// it's a number, set is as frames
			frames = (spriteArray[2] != null) ? spriteArray[2] : 1;
			fps = (spriteArray[3] != null) ? spriteArray[3] : 0;
			reps = (spriteArray[4] != null) ? spriteArray[4] : -1;
		}
	}

	if (idx == -1) {
		var image = new Image();
		var newSprite = {id:tag, src:image, align:valign,
						 frames:frames, fps:fps, reps:reps, 
						 spTimer:0, spTimerOn:false, curFrame:0, curRep:0};
		this.sprites.push(newSprite);
		image = null;
	} 
	else {
		var tmpSprite = this.sprites[i];
		this.sprites.splice(i, 1)
		tmpSprite.src = new Image();
		tmpSprite.align = valign;
		tmpSprite.frames = frames; 
		tmpSprite.fps = fps; 
		tmpSprite.reps = reps;
		this.sprites.push(tmpSprite);
		tmpSprite.src = null; tmpSprite = null;
	}
	Helper.addEvent(this.sprites[this.sprites.length-1].src, 'load', function() {
		// use larger canvas to support sprite rotation
		that.spriteDim = new Vector2d(that.sprites[that.sprites.length-1].src.width / that.sprites[that.sprites.length-1].frames, 
							 that.sprites[that.sprites.length-1].src.height);
		var dim = Math.ceil(that.spriteDim.length());
		that.context.canvas.setAttribute('width', dim);
		that.context.canvas.setAttribute('height', dim);
		that.origin = new Vector2d(dim/2, dim/2 + that.spriteDim.vy/2);
		if (that.sprites[that.sprites.length-1].align == 'roof')
			that.offset.vy = -Stage.canvas.height*(2*Config.actorYPosition-1) + that.sprites[that.sprites.length-1].src.height;
		else if (that.sprites[that.sprites.length-1].align == 'top')
			that.offset.vy = -Stage.canvas.height*(Config.actorYPosition) + that.sprites[that.sprites.length-1].src.height;
		else if (that.sprites[that.sprites.length-1].align == 'center')
			that.offset.vy = -Stage.canvas.height*(Config.actorYPosition-0.5) + that.sprites[that.sprites.length-1].src.height*0.5;
		else if (that.sprites[that.sprites.length-1].align == 'bottom')
			that.offset.vy = -Stage.canvas.height*(Config.actorYPosition-1);
		else
			that.offset.vy = 0;
		that.isready = true;
	}, false);
	this.sprites[this.sprites.length-1].src.src = Helper.parseArg(file);
	this.activeSprite = this.sprites.length-1;
	this.update = false;
}

Character.prototype.RemoveSprite = function(tag) {
	if (this.sprites.length > 1) {
		for (var i in this.sprites) {
			if (this.sprites[i].id == tag) {
				// if i > activeSprite, just remove
				// if i < activeSprite, remove then set activeSprite+1
				// if i == activeSprite, wait until hidden
				if (i > this.activeSprite) {
					this.sprites[i].src = null;
					this.sprites.splice(i, 1);
				}
				else if (i < this.activeSprite) {
					this.sprites[i].src = null;
					this.sprites.splice(i, 1);
					this.activeSprite = Math.max(this.activeSprite-1, 0);
				}
				else {
					this.activeSpriteRemoval = true;
				}
				break;
			}
		}
	}
}
Character.prototype.AddAvatar = function(file) {
	var that = this;
	if (file != '') {
		this.isready = false;
		this.avatar = new Image();
		Helper.addEvent(this.avatar, 'load', function() {
			that.isready = true;
		}, false);
		this.avatar.src = Helper.parseArg(file);
		this.update = false;
	}
	else {
		this.avatar = null;
	}
}
Character.prototype.Reset = function (init) {
	if (init || !this.visible) {
		// start auto at center, else no change current pos
		if (this.posMode == 'auto') {
			this.target_pos = new Vector2d(Stage.canvas.width/2, 
								Stage.canvas.height*Config.actorYPosition);
		}
		this.pos.copy(this.target_pos);
	}
	this.visible = true;
	this.redraw = true;
}
Character.prototype.Update = function(elapsed) {
	var that = this;
	if (this.isready) {
		Helper.processEffects(this, elapsed);
		if ((!this.sprites[this.activeSprite].spTimerOn) && (this.sprites[this.activeSprite].fps>0)) {
			this.sprites[this.activeSprite].spTimer = setTimeout(function() {
				that.sprites[that.activeSprite].curFrame = (++that.sprites[that.activeSprite].curFrame) % that.sprites[that.activeSprite].frames;
				if (that.sprites[that.activeSprite].curFrame == 0) that.sprites[that.activeSprite].curRep++;
				that.redraw = true;
				if (that.visible) {
					if ((that.sprites[that.activeSprite].reps < 0) || (that.sprites[that.activeSprite].curRep < that.sprites[that.activeSprite].reps))
						that.sprites[that.activeSprite].spTimerOn = false;
				}
			}, 1000/this.sprites[this.activeSprite].fps);
			this.sprites[this.activeSprite].spTimerOn = true;
		}
	}	
	return this.update;
}
Character.prototype.Draw = function() {
	if (!this.isready) return false;
	if (!this.redraw) return false;
	if (this.activeSprite > this.sprites.length-1) return false;
	
	if (this.visible) {
		this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
		if (this.prevSprite >= 0) {
			this.context.globalAlpha = Math.max(0, Math.min(1, this.target_alpha-this.alpha));
			this.context.drawImage(this.sprites[this.prevSprite].src, 
								((this.context.canvas.width - this.spriteDim.vx)/2)>>0,
								((this.context.canvas.height - this.spriteDim.vy)/2)>>0);
			if (this.target_alpha - this.alpha <= 0) this.prevSprite = -1;
		}
		this.context.globalAlpha = Math.max(0, Math.min(1, this.alpha));
		if (this.rotation != 0) {
			this.context.translate(this.context.canvas.width/2, this.context.canvas.height/2);
			this.context.rotate(this.rotation * Math.PI/180);
			this.context.translate(-this.context.canvas.width/2, -this.context.canvas.height/2);
			this.rotation = 0.0;
		}
		if (this.sprites[this.activeSprite].fps == 0) {
			this.context.drawImage(this.sprites[this.activeSprite].src,
					   ((this.context.canvas.width - this.spriteDim.vx)/2)>>0,
					   ((this.context.canvas.height - this.spriteDim.vy)/2)>>0);
		}
		else {
			this.context.drawImage(this.sprites[this.activeSprite].src,
						this.sprites[this.activeSprite].curFrame * this.sprites[this.activeSprite].src.width / this.sprites[this.activeSprite].frames,
						0, this.sprites[this.activeSprite].src.width / this.sprites[this.activeSprite].frames, this.sprites[this.activeSprite].src.height,
					    ((this.context.canvas.width - this.spriteDim.vx)/2)>>0,
					    ((this.context.canvas.height - this.spriteDim.vy)/2)>>0,
					    this.sprites[this.activeSprite].src.width / this.sprites[this.activeSprite].frames, this.sprites[this.activeSprite].src.height);
		}
		if (this.activeSpriteRemoval && (this.alpha <= 0)) {
			this.sprites[this.activeSprite].src = null;
			this.sprites.splice(this.activeSprite, 1);
			this.activeSprite = Math.max(this.activeSprite-1, 0);
			this.activeSpriteRemoval = false;
		}
	}
	this.redraw = false;
	if (this.drawn) this.update = true;
	return true;
}
