///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

///////////////////////////////////////////////////////////////////////////////
// Local Helpers
///////////////////////////////////////////////////////////////////////////////
// Helper function to process backdrop
Helper.processBackdrop = (function (obj, type, param) {
	var nextid = 0;
	if (obj.length > 0) {
		// background/overlay layer has more than one element
		// to conserve memory, maintain only the previous and the incoming backdrop
		while (obj.length > 1) {
			var object = obj.shift();
			object.image = null;
			object = null;
		}
		if (!param.src && (param.show != false)) {
			// show the previous overlay
			if (param.effect) {
				var effect = param.effect;
				if (Stage.animations[param.effect] != null) {
					effect = Stage.animations[param.effect][1];
					obj[0].transTime = (Stage.animations[param.effect][0] > 0) ? Stage.animations[param.effect][0] : 0.1;
					if (Stage.animations[param.effect].length > 2)
						Helper.queueAnimation(type, param, Stage.animations[param.effect].slice(2));
				}
				obj[0].wait = true;
				if (effect.indexOf('nowait')!=-1) {
					obj[0].wait = false;
					effect = effect.replace('nowait','');
				}
				var fxarr = effect.split(' ');
				obj[0].effects = fxarr[0] + '_in';
				if (fxarr.length>1) obj[0].fxparam = fxarr.slice(1);
				if (TransEffects[fxarr[0]]['_init'])
					TransEffects[fxarr[0]]['_init'](obj[0], obj[0].fxparam);
			}
			else {
				obj[0].effects = '_in';
				obj[0].wait = true;
			}
			if (param.time != null) 
				obj[0].transTime = (param.time>0) ? param.time : 0.1;
			obj[0].drawn = false;
			obj[0].update = false;
			return;
		}
		// do a reverse effect on the previous backdrop
		obj[0].effects = '_out';
		if (param.effect) {
			var effect = param.effect;
			if (Stage.animations[param.effect] != null) {
				// just use first animation in the set
				effect = Stage.animations[param.effect][1];
				obj[0].transTime = (Stage.animations[param.effect][0] > 0) ? Stage.animations[param.effect][0] : 0.1;
				//if (Stage.animations[param.effect].length > 2)
				//	Helper.queueAnimation(type, param, Stage.animations[param.effect].slice(2));
			}
			obj[0].wait = true;
			if (effect.indexOf('nowait')!=-1) {
				obj[0].wait = false;
				effect = effect.replace('nowait','');
			}
			var fxarr = effect.split(' ');
			obj[0].effects = fxarr[0] + '_out';
			if (fxarr.length>1) obj[0].fxparam = fxarr.slice(1);
			if (TransEffects[fxarr[0]]['_init'])
				TransEffects[fxarr[0]]['_init'](obj[0], obj[0].fxparam);
		}
		if (param.time != null) 
			obj[0].transTime = (param.time>0) ? param.time : 0.1;
		obj[0].drawn = false;
		obj[0].update = false;
		nextid = parseInt(obj[0].context.canvas.id.substr(2))+1;
		if ((!param.src) && (param.show == false)) {
			return;
		}
	}
	// add the new backdrop
	var bd = new Backdrop();
	bd.type = type;
	var objects = new Array();
	if (param.objects) {
		// assumes multiples of 3
		//for (var i=0; i<param.objects.length; i+=3) {
		var param_count = 0;
		while (param_count < param.objects.length) {
			var item = {src:'', x:0, y:0, frames:1, fps:0, link:''};	//fps=0 is static image
			item.src = param.objects[param_count];
			item.x = param.objects[param_count+1];
			item.y = param.objects[param_count+2];
			param_count += 3;
			// adds entry for sprite frame animation if it exists, ignores it if it doesn't
			if (param_count < param.objects.length) {
				if (typeof param.objects[param_count] == 'number') {
					item.frames = param.objects[param_count];
					item.fps = param.objects[param_count+1];
					param_count += 2;
				}
			}
			// adds entry for link
			if (param_count < param.objects.length) {
				if ((typeof param.objects[param_count] == 'string') &&
					(!Helper.checkIfImage(param.objects[param_count]))) {
					item.link = param.objects[param_count];
					param_count += 1;
				}
			}
			objects.push(item);
		}
	}
	bd.Create('bd' + nextid, param.src, (objects.length > 0) ? objects : null);
	if (param.effect) {
		var fxset = param.effect;
		if (Stage.animations[param.effect] != null) {
			fxset = Stage.animations[param.effect][1];
			bd.transTime = (Stage.animations[param.effect][0] > 0) ? Stage.animations[param.effect][0] : 0.1;
			if (Stage.animations[param.effect].length > 2)
				Helper.queueAnimation(type, param, Stage.animations[param.effect].slice(2));
		}
		if (fxset.indexOf('nowait')!=-1) {
			bd.wait = false;
			fxset = fxset.replace('nowait','');
		}
		var fxarr = fxset.split(' ');
		bd.effects = fxarr[0] + '_in';
		if (fxarr.length > 1) 
			bd.fxparam = fxarr.slice(1);
		else {
			if (type == 'scene')
				bd.fxparam = (Stage.layers[0].length > 0);
			else
				bd.fxparam = (Stage.layers[2].length > 0);
		}
		if (TransEffects[fxarr[0]]['_init'])
			TransEffects[fxarr[0]]['_init'](bd, bd.fxparam);
	}
	else 
		bd.effects = '_in';
	if (param.time != null) 
		bd.transTime = (param.time>0) ? param.time : 0.1;
	if (param.offset) {
		if (typeof (param.offset) == "string")
			bd.scroll = (param.offset == 'scroll') ? true : false;
		else {
			bd.scroll = false;
			bd.offset = new Vector2d(param.offset[0],param.offset[1]);
		}
	}
	else {
		bd.scroll = false;
		bd.offset = new Vector2d(0,0);
	}
	obj.push(bd);
	bd = null;
});

///////////////////////////////////////////////////////////////////////////////
// Background/Overlay image
///////////////////////////////////////////////////////////////////////////////
// overlay - displays an overlay image (layer 2)
function overlay(param) {
	//Stage.Transition(param.time);
	Helper.processBackdrop(Stage.layers[2], 'overlay', param);
	Stage.Transition(Stage.layers[2][Stage.layers[2].length-1].transTime);
}
// scene - displays a background (layer 0)
function scene(param) {
	Helper.processBackdrop(Stage.layers[0], 'scene', param);
	Stage.Transition(param.time);
}

function Backdrop() {
	this.isready = false,
	this.loaded = 1;

	this.type = '';
	this.context = 0;
	this.image = 0;
	this.objects = new Array();
	this.drawn = false;
	this.redraw = true;
	this.visible = true;
	this.update = false;
		
	this.effects = 'done';
	this.fxparam = '';
	this.alpha = 0;
	this.target_alpha = 1;
	this.rotation = 0;
	this.accum_rotation = 0;
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
	this.backdropDim = new Vector2d(0,0);
	
	this.ovFrames = 1;						// overlay support for multiple frames
	this.ovFps = 0;
	this.ovTimer = 0;						// overlay timer
	this.ovTimerOn = false;
	this.ovCurFrame = 0;
}
Backdrop.prototype.Create = function(id, file, obj) {
	var that = this;
	var canvas = document.createElement('canvas');
	canvas.id = escape(id);
	this.context =  canvas.getContext('2d');

	if (obj) {
		this.loaded += obj.length;	// total number of images to load
		for (var i in obj) {
			var item = {img:new Image(), x:obj[i].x, y:obj[i].y, frames:obj[i].frames, fps:obj[i].fps,
						bdTimer:0, bdTimerOn:false, curFrame:0, link:obj[i].link, rect:new Rect()};	
						// each object needs to have its own timer
			Helper.addEvent(item.img, 'load', function() {
				that.IsLoaded();
			}, false);
			item.img.src = Helper.parseArg(obj[i].src);
			this.objects.push(item);
			item = null;
		}
	}
	if (typeof file == 'string') {
		if (Helper.checkIfImage(file)) {
			this.image = new Image();
			Helper.addEvent(this.image, 'load', function() {
				// use larger canvas to support sprite rotation
				that.backdropDim = new Vector2d(that.image.width, that.image.height);
				var dim = Math.ceil(that.backdropDim.length());
				that.context.canvas.setAttribute('width', dim);
				that.context.canvas.setAttribute('height', dim);
				that.origin = new Vector2d(dim/2, dim/2);
				that.IsLoaded();
			}, false);
			this.image.src = Helper.parseArg(file);
		}
		else {
			// assume valid HTML color
			this.image = file;
			this.context.canvas.setAttribute('width', 1.1*Stage.canvas.width);
			this.context.canvas.setAttribute('height', 1.1*Stage.canvas.height);
			this.origin = new Vector2d(this.context.canvas.width>>1, this.context.canvas.height>>1);
			this.isready = true;
		}
	}
	else {
		// assumed array [filename, frames, fps]
		if (Helper.checkIfImage(file[0])) {
			this.image = new Image();
			this.ovFrames = file[1] != null ? file[1] : 1;
			this.ovFps = file[2] != null ? file[2] : 0;
			Helper.addEvent(this.image, 'load', function() {
				that.backdropDim = new Vector2d(that.image.width / that.ovFrames, that.image.height);
				var dim = Math.ceil(that.backdropDim.length());
				that.context.canvas.setAttribute('width', dim);
				that.context.canvas.setAttribute('height', dim);
				that.origin = new Vector2d(dim/2, dim/2);
				that.IsLoaded();
			}, false);
			this.image.src = Helper.parseArg(file[0]);
		}
	}
	// configure transition
	this.transTime = (Config.transTime > 0) ? Config.transTime : 0.1;
	this.update = false;
	this.Reset(true);
	canvas = null;
	return this.context.canvas.id;
}		
Backdrop.prototype.IsLoaded = function() {
	if (--this.loaded <= 0) {
		for (var i in this.objects) {
			this.objects[i].rect.x = (this.objects[i].x + (this.context.canvas.width - this.backdropDim.vx)/2)>>0;
			this.objects[i].rect.y = (this.objects[i].y + (this.context.canvas.height - this.backdropDim.vy)/2)>>0;
			this.objects[i].rect.w = this.objects[i].img.width / this.objects[i].frames;
			this.objects[i].rect.h = this.objects[i].img.height;
		}
		this.isready = true;
	}
}
Backdrop.prototype.Reset = function(init) {
	if ((init) || (!this.visible)) {
		this.target_pos = new Vector2d(Stage.canvas.width>>1, Stage.canvas.height>>1);
		this.pos.copy(this.target_pos);
	}
	this.visible = true;
	this.redraw = true;
}
Backdrop.prototype.Update = function(elapsed) {
	var that = this;
	if (this.isready) { 
		Helper.processEffects(this, elapsed);
		// update overlay timers
		if (!this.ovTimerOn && (this.ovFps>0)) {
			this.ovTimer = setTimeout(function() {
				that.ovCurFrame = (++that.ovCurFrame) % that.ovFrames;
				that.redraw = true;
				if (that.visible) that.ovTimerOn = false;
			}, 1000/this.ovFps);
			this.ovTimerOn = true;
		}
		// update object timers
		if (this.objects.length>0) {
			for (var i in this.objects) {
				if ((!this.objects[i].bdTimerOn) && (this.objects[i].fps>0)) {
					this.objects[i].bdTimer = setTimeout(function() {
						that.objects[i].curFrame = (++that.objects[i].curFrame) % that.objects[i].frames;
						that.redraw = true;
						if (that.visible) that.objects[i].bdTimerOn = false;
					}, 1000/this.objects[i].fps);
					this.objects[i].bdTimerOn = true;
				}
			}
		}
	}
	return this.update;
}
Backdrop.prototype.Draw = function() {
	if (!this.isready) return false;
	if (!this.redraw) return false;
	
	if (this.visible) {
		this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
		this.context.globalAlpha = Math.max(0, Math.min(1, this.alpha));
		if (this.rotation != 0) {
			this.context.translate(this.context.canvas.width/2, this.context.canvas.height/2);
			this.context.rotate(this.rotation * Math.PI/180);
			this.context.translate(-this.context.canvas.width/2, -this.context.canvas.height/2);
			this.rotation = 0.0;
		}
		if ((this.image.constructor == HTMLImageElement) || (this.image.constructor == Image) ||
			(this.image instanceof HTMLImageElement) || (this.image instanceof Image)) {
			if (this.ovFps == 0) {
				this.context.drawImage(this.image, 
					((this.context.canvas.width - this.backdropDim.vx)/2)>>0,
					((this.context.canvas.height - this.backdropDim.vy)/2)>>0);
			}
			else {
				this.context.drawImage(this.image,
					this.ovCurFrame * this.image.width / this.ovFrames,
					0, this.image.width / this.ovFrames, this.image.height,
					((this.context.canvas.width - this.backdropDim.vx)/2)>>0,
					((this.context.canvas.height - this.backdropDim.vy)/2)>>0,
					this.image.width / this.ovFrames, this.image.height);
			}
		}
		else {
			this.context.fillStyle = this.image;
			this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);		
		}
		if (this.objects.length > 0) {
			for (var i in this.objects) {
				if (this.objects[i].fps == 0) {
					this.context.drawImage(this.objects[i].img, 
						(this.objects[i].x + (this.context.canvas.width - this.backdropDim.vx)/2)>>0,
						(this.objects[i].y + (this.context.canvas.height - this.backdropDim.vy)/2)>>0);
				}
				else {
					this.context.drawImage(this.objects[i].img,
						this.objects[i].curFrame * this.objects[i].img.width / this.objects[i].frames,
						0, this.objects[i].img.width / this.objects[i].frames, this.objects[i].img.height,
						(this.objects[i].x + (this.context.canvas.width - this.backdropDim.vx)/2)>>0,
						(this.objects[i].y + (this.context.canvas.height - this.backdropDim.vy)/2)>>0,
						this.objects[i].img.width / this.objects[i].frames, this.objects[i].img.height);
				}
				// create detectable path
				/*if (this.objects[i].link != "") {
					this.context.beginPath();
					var rect = new Rect((this.objects[i].x + (this.context.canvas.width - this.backdropDim.vx)/2)>>0,
									 (this.objects[i].y + (this.context.canvas.height - this.backdropDim.vy)/2)>>0,
									 this.objects[i].img.width / this.objects[i].frames,
									 this.objects[i].img.height);
					this.context.rect(rect.x, rect.y, rect.w, rect.h);
					this.context.closePath();
					this.context.stroke();
				}*/				
			}
		}
	}
	this.redraw = false;
	if (this.drawn) this.update = true;
	return true;
}
