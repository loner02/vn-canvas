///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

///////////////////////////////////////////////////////////////////////////////
// Local Helpers
///////////////////////////////////////////////////////////////////////////////
// Helper function to load script on the fly
Helper.scriptLoad = function (id, callback) {
	try {
		var dummy = eval(id);
		callback();
	}
	catch (e) {
		for (var i in TOC) {
			if (TOC[i].match(id) != null) {
				require([TOC[i]], function() {
					callback();
				});
			}
		}
	}
	//return id;
}
// Helper function to check if valid actor from id
Helper.checkIfActor = (function (id) {
	for (var i in Stage.layers[1]) {
		if (Stage.layers[1][i].id == id)
			return true;
	}
	return false;
});
// Helper function to create balloon dialogs
Helper.createBalloon = (function (ctx, x, y, w, h, r, ptr) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	ctx.beginPath();
	ctx.moveTo(r, y);
	ctx.moveTo(x+r, y);
	ctx.lineTo(x+w/4-y/2,y);
	if (ptr) ctx.lineTo(x+w/4,0);
	ctx.lineTo(x+w/4+y/2,y);
	ctx.lineTo(x+w*3/4-y/2,y);
	if (!ptr) ctx.lineTo(x+w*3/4,0);
	ctx.lineTo(x+w*3/4+y/2,y);

	ctx.lineTo(w-r, y);
	ctx.quadraticCurveTo(w, y, w, y+r);
	ctx.lineTo(w, h-r);
	ctx.quadraticCurveTo(w, h, w-r, h);
	ctx.lineTo(x+r, h);
	ctx.quadraticCurveTo(x, h, x, h-r);
	ctx.lineTo(x, y+r);
	ctx.quadraticCurveTo(x, y, x+r, y);
	// Opera doesn't render arcTo correctly, so used quadratic instead
	/*ctx.arcTo(w, y, w, h, r);
	ctx.arcTo(w, h, x, h, r);
	ctx.arcTo(x, h, x, y, r);
	ctx.arcTo(x, y, w, y, r); */
	ctx.closePath();
});

///////////////////////////////////////////////////////////////////////////////
// Script box and script handler for dialogs
///////////////////////////////////////////////////////////////////////////////
// box - configures script box (layer 4)
function box(param) {
	if (param.show == true)
		Stage.layers[4][0].visible = true;
	else {
		Stage.layers[4][0].visible = false;
		Stage.layers[4][0].text = '';
		Stage.layers[4][0].balloon = null;
	}
	if (param.pos) Stage.layers[4][0].pos = param.pos;
	if (param.back) {
		Stage.layers[4][0].back = param.back;
		Stage.layers[4][0].src = Config.activeTheme.boxImageStyle;
	}
	if (param.prompt) {
		if (param.prompt == "none") {
			Stage.layers[4][0].psrc = '';
		}
		else {
			Stage.layers[4][0].isready = false;
			Stage.layers[4][0].psrc = param.prompt;
			Stage.layers[4][0].prompt.src = param.prompt;
		}
	}
	if (param.align) {
		Stage.layers[4][0].textAlign = param.align;
	}
	// assumes this function won't be called unless there are some changes somewhere
	Stage.layers[4][0].changed = true;
}
// text - display text in script box (layer 4)
function text(param) {
	Stage.layers[4][0].avatar = null;
	Stage.layers[4][0].alpha = 1;
	Stage.layers[4][0].effects = "none";
	Stage.layers[4][0].scrollOffsetY = 0;
	Stage.layers[4][0].balloon = null;
	Stage.layers[4][0].autotype = false;	/* TODO: add to storage? */
	if (typeof param == "string") {
		Stage.layers[4][0].text = Helper.addTagToDialog(null, null, param, Stage.layers[4][0].cont);		
		if (Config.boxAutotype) {
			Stage.layers[4][0].autotype = true;
			Stage.layers[4][0].effects = "autotype";
		}
	}
	else {
		if (param.font) { 
			var subs = Helper.parseFontString(param.font);
			
			if (subs.length > 0) Stage.layers[4][0].fontWeight = subs[0];
			if (subs.length > 1) {
				Stage.layers[4][0].fontSize = subs[1];
				Stage.layers[4][0].lineHeight = parseInt(subs[1]) + 4;			
			}			
			if (subs.length > 2) Stage.layers[4][0].fontFamily = subs[2];
			if (subs.length > 3) Stage.layers[4][0].fontColor = subs[3];
		}
		if (param.align)
			Stage.layers[4][0].textAlign = param.align;
		if (param.effect) {
			if (param.effect == "fade")
				Stage.layers[4][0].alpha = 0;
			if (param.effect == "scroll")
				Stage.layers[4][0].scrollOffsetY = Stage.layers[4][0].context.canvas.height;
			if (param.effect == "autotype")
				Stage.layers[4][0].autotype = true;
			else if (param.effect == "noautotype")
				Stage.layers[4][0].autotype = false;
			Stage.layers[4][0].effects = param.effect;
		}
		else {
			if (Config.boxAutotype) {
				Stage.layers[4][0].autotype = true;
				Stage.layers[4][0].effects = "autotype";
			}
		}

		var nick = null;
		var color = '';
		if (param.speaker) {
			nick = param.speaker;
			color = Stage.layers[4][0].tagColor;
			for (var i in Stage.layers[1]) {
				if (Stage.layers[1][i].id == param.speaker) {
					nick = Stage.layers[1][i].nick;
					color = Stage.layers[1][i].color;
					Stage.layers[4][0].avatar = (Stage.layers[1][i].avatar != null) ? Stage.layers[1][i].avatar : null;
					if (Stage.layers[4][0].avatar != null) {
						for (var j in Stage.layers[1][i].avatars) {
							if (Stage.layers[4][0].avatar.src.search(Stage.layers[1][i].avatars[j].src) != -1) {
								Stage.layers[4][0].avatarStruct = Stage.layers[1][i].avatars[j];
								break;
							}
						}
					}
					else
						Stage.layers[4][0].avatarStruct = null;
					break;
				}
			}
		}
		var same_window = Helper.checkCurrentSpeaker((param.speaker) ? param.speaker : '', param.append);
		Stage.layers[4][0].text = Helper.addTagToDialog(nick, color, 
														(param.value) ? param.value : null, same_window);		
		if (param.duration > 0) Stage.layers[4][0].timeout = param.duration;
		if (param.offset) {
			Stage.layers[4][0].textOffset.vx = param.offset[0];
			Stage.layers[4][0].textOffset.vy = param.offset[1];
		}
		if (param.value && param.voice)
			Helper.processAudio (Stage.sounds[3], param.voice, {voice:param.voice});
	}
	Stage.layers[4][0].visible = true;
	Stage.layers[4][0].changed = true;
}
// menu - display choices in script box (layer 4)
function menu(param) {
	// param is an array of choice-jump pair
	if (Stage.layers[4][0].cont != true)
		Stage.layers[4][0].text = '';
	Stage.layers[4][0].text += param[0];	// prompt
	Stage.layers[4][0].jumpTo.splice(0,Stage.layers[4][0].jumpTo.length);
	for (var i=1; i< param.length; i+=2) {
		Stage.layers[4][0].text += "<br/><class=\'menu\'>" + param[i] + "</class>";
		var menuItem = {hotspot:[], link:param[i+1]};
		Stage.layers[4][0].jumpTo.push(menuItem);
	}
	Stage.layers[4][0].avatar = null;
	Stage.layers[4][0].visible = true;
	Stage.layers[4][0].changed = true;
	Stage.layers[4][0].inputFocus = true;
	Stage.layers[4][0].balloon = null;
	if (Config.menuAutotype) {
		Stage.layers[4][0].autotype = true;
		Stage.layers[4][0].effects = "autotype";
	}
}

function ScriptBox() {	
	this.image = null;
	this.vpwidth = 0;
	this.vpheight = 0;
	this.redraw = true;
	this.update = false;
	this.fxupdate = false;
	this.menuHover = -1;
	this.curLineCount = 0;

	this.type = 'box';				// identifies type of gui
	this.group = '';
	this.pos = 'bottom';
	this.back = 'dim';
	this.src = null;
	this.balloon = null;
	this.context = 0;
	this.canvasText = new CanvasText;
	this.dimStyle = new Array();
	this.balloonStyle = new Array();
	this.jumpTo = new Array();
	this.origin = new Vector2d(0,0);		// gui origin is topleft
		
	this.isready = true;				// flow control
	this.changed = true;
	this.cont = false;
	this.visible = false;
	this.inputFocus = false;
	this.timeout = 0;

	this.text = '';					// text display
	this.prompt = new Image();
	this.avatar = null;				// avatar kept for compatibility
	this.avatarStruct = null;		// for avatar parameters
	this.psrc = '';
	this.alpha = 1;
	this.effects = 'none';
	this.scrollOffsetY = 0;
	this.autotypeMax = 65536;
	this.autotypeCount = 0;
	this.autotypeLength = this.autotypeMax;

	this.fontFamily = 'Verdana';		// font properties
	this.fontColor = 'white';
	this.fontSize = '14px';
	this.fontWeight = 'normal';
	this.lineHeight = '18';
	this.textOffset = new Vector2d(10, 20);
	this.textAlign = 'start';
	this.tagFamily = this.fontFamily;
	this.tagColor = '#c8ffc8';
	this.tagSize = this.fontSize;
	this.tagWeight = 'bold';
}
ScriptBox.prototype.Create = function(w, h) {
	var that = this;
	this.src = '';
	this.vpwidth = w;	// viewport dimensions
	this.vpheight = h;
	this.origin.vx = this.vpwidth * (1-Config.boxWidth)/2;
	this.origin.vy = this.vpheight * (1-Config.boxHeight);
	
	// create a default script box: dim at bottom
	var canvas = document.createElement('canvas');
	this.context = canvas.getContext('2d');
	this.context.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
	this.context.canvas.setAttribute('height', this.vpheight * Config.boxHeight);
	// create prompt this.images
	if (this.psrc != '') {
		Helper.addEvent(this.prompt, 'load', function() {
			that.isready = true;
		}, false);
		this.prompt.src = this.psrc;
	}
	canvas = null;
}
ScriptBox.prototype.Update = function(elapsed) {
	var that = this;
	if (this.changed || this.fxupdate) {
		if (this.changed) {
			if (!this.balloon) {
				switch (this.pos) {
					case 'bottom':
						this.origin.vx = this.vpwidth * (1-Config.boxWidth)/2;
						this.origin.vy = this.vpheight * (1-Config.boxHeight);
						this.context.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
						this.context.canvas.setAttribute('height', this.vpheight * Config.boxHeight);
						break;
					case 'center':
						this.origin.vx = this.vpwidth * (1-Config.boxWidth)/2;
						this.origin.vy = this.vpheight * (1-Config.boxHeight)/2;
						this.context.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
						this.context.canvas.setAttribute('height', this.vpheight * Config.boxHeight);
						break;
					case 'top':
						this.origin.vx = this.vpwidth * (1-Config.boxWidth)/2;
						this.origin.vy = 0;
						this.context.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
						this.context.canvas.setAttribute('height', this.vpheight * Config.boxHeight);
						break;
					case 'full':
						this.origin.vx = this.vpwidth * (1-Config.boxWidth)/2;
						this.origin.vy = this.vpheight * (1-Config.boxFullHeight)/2;
						this.context.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
						this.context.canvas.setAttribute('height', this.vpheight * Config.boxFullHeight)
						break;
				}
			}
			else {
				var xoffset = 0, yoffset = 0;
				for (var i in Stage.layers[1]) {
					if (Stage.layers[1][i].id == this.balloon) {
						// TODO: race issue: when checkpoint loading, actor sprite haven't completed
						// loading yet when actor origin is used below, so set a default to half of 
						// viewport height instead of half of actor sprite
						if (Stage.layers[1][i].origin.vy <= 0)
							yoffset = this.vpheight * (1 - Config.balloonHeight)/2;
						else
							yoffset = Stage.layers[1][i].pos.vy - Stage.layers[1][i].origin.vy/2 
								  - Config.balloonHeight * this.vpheight * 0.5;
						if (Stage.layers[1][i].pos.vx >= this.vpwidth/2)
							xoffset = Stage.layers[1][i].pos.vx - Config.balloonWidth * this.vpwidth * 0.75;
						else
							xoffset = Stage.layers[1][i].pos.vx - Config.balloonWidth * this.vpwidth * 0.25;
						break;
					}
				}
				this.origin.vx = xoffset;
				this.origin.vy = yoffset;
				this.context.canvas.setAttribute('width', this.vpwidth * Config.balloonWidth);
				this.context.canvas.setAttribute('height', this.vpheight * Config.balloonHeight);
			}
			switch (this.back) {
				case 'image':
					if (this.src != null) {
						if ((this.image == null) || (this.image.src.search(this.src)==-1)) {
							this.image = new Image();
							this.isready = false;
							Helper.addEvent(this.image, 'load', function() {
								that.isready = true;
							}, false);
							this.image.src = this.src;
							this.update = false;
						}
					}
					break;
				case 'none':
				case 'dim':
				default:
					break;
			}
			this.canvasText.config({
				canvas: this.context.canvas,
				context: this.context,
				fontFamily: this.fontFamily,
				fontSize: this.fontSize,
				fontWeight: this.fontWeight,
				fontColor: this.fontColor,
				lineHeight: this.lineHeight
			});
			this.canvasText.updateCanvas(this.context.canvas);
		}
		switch (this.effects) {
			case 'fade':
				if (this.alpha >= 1) {
					this.effects = 'none';
				}
				else {
					this.alpha += elapsed/(Config.transTime * 1000);
					this.fxupdate = true;
				}
				this.update = false;
				break;
			case 'scroll':
				if (this.scrollOffsetY <= -(this.curLineCount+1) * this.lineHeight) {
					this.effects = 'none';
					//this.scrollOffsetY = 0;
					this.timeout = 0.1;	// setup timer once scroll is finished
				}
				else {
					this.scrollOffsetY -= Config.boxScrollSpeed * elapsed/(Config.transTime * 25);
					this.fxupdate = true;
					this.timeout = 0;	// disable timer if enabled
				}
				this.update = false;
				break;
			case 'autotype':
				if ((Stage.mouseClick && this.fxupdate) || 
					//(this.autotypeCount >= Math.max(this.autotypeLength,this.text.length))) {
					(this.autotypeCount >= this.autotypeLength)) {
					this.autotypeCount = 0;
					this.autotypeLength = this.autotypeMax;
					this.autotype = false;
					this.effects = 'none';
				}
				else {
					this.autotypeCount += Config.boxAutotypeSpeed*elapsed/16;
					this.fxupdate = true;
				}
				this.update = false;
				break;
			case 'noautotype':
				this.autotype = false;
			case 'none':
			default:
				this.fxupdate = false;
				break;
		}
		this.changed = false;
		this.redraw = true;
	}
	if (this.CheckHoverOnHotspot()) {
		this.redraw = true;
	}
	if ((this.avatar != null) && (this.avatarStruct != null)) {
		if ((!this.avatarStruct.avTimerOn) && (this.avatarStruct.fps>0)) {
			this.avatarStruct.avTimer = setTimeout(function() {
				that.avatarStruct.curFrame = (++that.avatarStruct.curFrame) % that.avatarStruct.frames;
				if (that.avatarStruct.curFrame == 0) that.avatarStruct.curRep++;
				that.redraw = true;
				if (that.visible) { 
					if ((that.avatarStruct.reps < 0) || (that.avatarStruct.curRep < that.avatarStruct.reps))
						that.avatarStruct.avTimerOn = false;
				}
			}, 1000/this.avatarStruct.fps);
			this.avatarStruct.avTimerOn = true;
		}
	}
	if (Stage.mouseClick && this.inputFocus && (this.menuHover != -1)) {
		if (typeof this.jumpTo[this.menuHover].link == 'string')
			Stage.script.SetFrame(this.jumpTo[this.menuHover].link);
		else {
			// this is an object, must be "set" command
			set(this.jumpTo[this.menuHover].link);
		}
		this.inputFocus = false;
		this.menuHover = -1;
		this.jumpTo.splice(0,this.jumpTo.length);
		this.visible = false;
		this.redraw = true;
	}
	return this.update;
}
ScriptBox.prototype.Draw = function() {
	if (!this.isready) return false;
	if (!this.redraw) return false;
	
	if (this.visible == true) {
		this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
		if (!this.balloon) {
			if (this.back == 'dim') {
				this.context.globalAlpha = 0.5;
				if (this.dimStyle.length > 1) {
					var grd=this.context.createLinearGradient(0,0,0,this.context.canvas.height);
					grd.addColorStop(0,this.dimStyle[1]);
					grd.addColorStop(1/this.context.canvas.height,this.dimStyle[0]);
					grd.addColorStop(1,this.dimStyle[1]);
					this.context.fillStyle=grd;
				} 
				else {
					this.context.fillStyle = this.dimStyle[0];
				}
				this.context.fillRect(0,0,this.context.canvas.width,this.context.canvas.height);
			}
			if ((this.back == 'image') && (this.src != null)) {
				this.context.globalAlpha = 1;		
				this.context.drawImage(this.image, 0, 0, this.context.canvas.width,this.context.canvas.height);
			}
		}
		else {
			this.context.globalAlpha = 0.5;
			this.context.lineWidth = 2;
			this.context.strokeStyle = this.balloonStyle[0];
			
			if (this.balloonStyle.length > 2) {
				var grd=this.context.createLinearGradient(0,0,0,this.context.canvas.height);
				grd.addColorStop(0,this.balloonStyle[1]);
				grd.addColorStop(1,this.balloonStyle[2]);
				this.context.fillStyle=grd;
			} 
			else if (this.balloonStyle.length > 1){
				this.context.fillStyle = this.balloonStyle[1];
			}
			
			var balloon_ptr = true;
			for (var i in Stage.layers[1]) {
				if (Stage.layers[1][i].id == this.balloon) {
					if (Stage.layers[1][i].pos.vx >= this.vpwidth/2)
						balloon_ptr = false;
					break;
				}
			}
			Helper.createBalloon(this.context,
								 0,this.lineHeight,this.context.canvas.width,this.context.canvas.height,
								 10,balloon_ptr);
			this.context.fill();
			this.context.stroke();
		}
		if (this.text != '') {
			this.context.globalAlpha = 1;
			// draw the avatar if any
			var avatarOffsetX = 0;
			if ((Config.actorShowAvatar == true) && (!this.balloon)){
				if (this.avatar != null) {
					if (this.avatarStruct.fps == 0) {
						avatarOffsetX = this.avatar.width;
						this.context.drawImage(this.avatar, 
											   (this.textOffset.vx/2)>>0, 
											   ((this.context.canvas.height - this.avatar.height)/2)>>0);
					}
					else {
						avatarOffsetX = this.avatar.width / this.avatarStruct.frames;
						this.context.drawImage(this.avatar,
									this.avatarStruct.curFrame * this.avatar.width / this.avatarStruct.frames,
									0, avatarOffsetX, this.avatar.height,
									(this.textOffset.vx/2)>>0,
									((this.context.canvas.height - this.avatar.height)/2)>>0,
									avatarOffsetX, this.avatar.height);
					}
				}
			}
			var ret = this.canvasText.drawText({
				text: this.text,
				x: this.textOffset.vx + avatarOffsetX,
				y: this.textOffset.vy + ((this.balloon) ? this.lineHeight : 0), // + this.scrollOffsetY,
				align: this.textAlign,
				alpha: this.alpha,
				boxWidth:this.context.canvas.width-2*this.textOffset.vx - avatarOffsetX,
				scroll: [(this.effects == 'scroll'), this.scrollOffsetY],
				autotype: [(this.effects == 'autotype'), this.autotypeCount]
			});
			this.autotypeLength = (this.autotype)?ret.length:this.autotypeMax;
			// draw the prompt icon
			if (typeof ret == "object") {
				//vncanvas doesn't use cache or return this.image
				this.curLineCount = ret.linecount;
				if (ret.hotspot.length == 0) {
					if ((this.effects == 'none') && (this.psrc != '') && (!this.balloon))
						this.context.drawImage(this.prompt, 
											   ret.endpt[0]>>0, 
											   (ret.endpt[1] - this.prompt.height)>>0);
				}
				else {
					for (var i=0; i<ret.hotspot.length; i++) {
						this.jumpTo[i].hotspot = ret.hotspot[i];
					}
				}
			}
			// draw hover
			if ((this.jumpTo.length > 0) && (this.menuHover != -1)) {
				this.context.save();
				this.context.globalAlpha = 0.25;
				this.context.fillStyle = Config.activeTheme.boxMenuHilite;
				this.context.fillRect(5,this.jumpTo[this.menuHover].hotspot[1] - this.lineHeight + 4,
										this.context.canvas.width - 10,this.lineHeight);
				this.context.restore();
			}
		}
		// Pauses script box
		Stage.pause = true;
		if (!Stage.utimerOn && (this.timeout > 0)) {
			Stage.utimer = setTimeout((function(self) { 
				return function() {
					Stage.pause = false; 
					Stage.utimerOn = false;
					self.timeout = 0;
				}
			})(this), this.timeout * 1000);
			Stage.utimerOn = true;
		}
	}
	else {
		Stage.pause = false;
	}
	if (!this.changed) this.update = true;
	this.redraw = false;
	return true;
}
ScriptBox.prototype.CheckHoverOnHotspot = function() {
	if (Stage.mouseMove == false) return false;
	if (this.jumpTo.length == 0) return false;
	if (this.jumpTo[0].hotspot.length < 2) return false;
	if (Stage.coord.vx < this.origin.vx) return false;
	if (Stage.coord.vx > this.origin.vx + this.vpwidth * Config.boxWidth) return false;
	
	for (var i in this.jumpTo) {
		if (Stage.coord.vy < this.origin.vy + this.jumpTo[i].hotspot[1] - this.lineHeight) continue;
		if (Stage.coord.vy > this.origin.vy + this.jumpTo[i].hotspot[1]) continue;
		this.menuHover = i;
		return true;
	}
	return false;
}
function Script() {
	this.sequence = 0;		// story board, composed of object-value pairs
	this.frame = 0;			// sequence counter
	this.frameStack = new Array();
}
Script.prototype.Init = function(name) {
	if (typeof name == 'string') {
		Helper.scriptLoad(name, function() {
			Stage.script.sequence = eval(name);
		});
	}
	else {
		Stage.script.sequence = name;
	}
	this.frame = 0;
}
Script.prototype.Update = function() {
	if (Helper.supportsLocalStorage()) {
		if (Stage.script.sequence[0] == label) {
			var tmp = new Array();
			if  (localStorage["_persist_skip_"+Stage.script.sequence[1]] != null)
				tmp = JSON.parse(localStorage["_persist_skip_"+Stage.script.sequence[1]]);
			if ((tmp.length == 0) || (tmp.length%2 == 1)) 
				tmp.push(Stage.script.frame);
			else {
				var found = false;
				for (var i=0; i<tmp.length; i+=2) {
					if ((Stage.script.frame >= tmp[i]) && (Stage.script.frame <= tmp[i+1]+2)) {
						if (Stage.script.frame > tmp[i+1]) tmp.splice(i+1,1,Stage.script.frame);
						found = true;
						break;
					}
				}
				if (!found) tmp.push(Stage.script.frame);
			}
			localStorage["_persist_skip_"+Stage.script.sequence[1]] = JSON.stringify(tmp);
			Stage.skipTextUpdated = true;
			tmp = null;
		}
	}
	if (this.sequence.length > this.frame) {
		if (typeof(this.sequence[this.frame]) == "function") {
			this.sequence[this.frame](this.sequence[this.frame+1]);
		}
		else if (typeof(this.sequence[this.frame]) == "string") {
			// assumes an actor shortcut
			if (Helper.checkIfActor(this.sequence[this.frame])) {
				if (typeof this.sequence[this.frame+1] == "string") {
					var param = {id:this.sequence[this.frame],
							     say:this.sequence[this.frame+1]};
				}
				else {
					var param = this.sequence[this.frame+1];
					param.id = this.sequence[this.frame];
				}
				actor(param);
				param = null;
			}
			
		}
		this.frame += 2;
	}
	else if (this.sequence.length > 0) {
		/*alert("End of script!"); */
		Stage.update = false;
		Stage.pause = true;
	}
}
Script.prototype.SetFrame = function(locator) {
	var str = locator.split('#');
	if (str.length > 1) {
		// jump to a new sequence#label
		var newseq = str.shift();
		
		// TODO: unload old sequence to free memory
		//var oldseq = this.sequence[1];
		//window[oldseq].splice(0, this.sequence.length);
		//window[oldseq] = null;
		
		Helper.scriptLoad(newseq, function() {
			Stage.script.sequence = eval(newseq);
			var newlabel = str.shift();
			for (var i=0; i<Stage.script.sequence.length; i+=2){
				if ((Stage.script.sequence[i] == label) && (Stage.script.sequence[i+1] == newlabel)) {
					Stage.script.frame = i;
					return true;
				}
			}
		});
	}
	else {
		// jump to new label
		var newlabel = str.shift();
		for (var i=0; i<this.sequence.length; i+=2){
			if ((this.sequence[i] == label) && (this.sequence[i+1] == newlabel)) {
				this.frame = i;
				return true;
			}
		}
	}
	return false;
}
Script.prototype.PushFrame = function() {
	var seq_name = '';
	if (this.sequence[0] == label)
		seq_name = this.sequence[1];
	// TODO: limit stack to 8 
	while (this.frameStack.length >= 8)
		this.frameStack.shift();
	this.frameStack.push([seq_name, this.frame-2]);
}
Script.prototype.PopFrame = function() {
	if (this.frameStack.length > 0) {
		var ret_frame = this.frameStack.pop();
		this.sequence = eval(ret_frame[0]);
		this.frame = ret_frame[1];
	}
}
Script.prototype.Insert = function(newScript) {
	for (var i=0; i<newScript.length; i+=2) {
		if ((this.sequence[this.frame+2+i] == newScript[i]) &&
			(JSON.stringify(this.sequence[this.frame+3+i]) == JSON.stringify(newScript[i+1]))) {
			this.sequence.splice(this.frame+2+i,2);
		}
		this.sequence.splice(this.frame+2+i,0,newScript[i]);
		this.sequence.splice(this.frame+3+i,0,newScript[i+1]);
	}
}
