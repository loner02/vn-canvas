///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

///////////////////////////////////////////////////////////////////////////////
// Selectable/clickable image; use for buttons, imagemaps, etc.
///////////////////////////////////////////////////////////////////////////////
function ActiveImage() {
	this.isready = false,
	this.redraw = true,
	this.loaded = 0,
	this.update = false,
	this.prev_state = '',
	this.aTimer = 0,
	this.aTimerOn = false;

	this.type = 'button';
	this.id = '';
	this.group = '';
	this.context = 0;
	this.sprites = new Array();
	this.inputFocus = false;
	this.text = '';
	this.link = null;
	this.origin = new Vector2d(0,0);
	this.rect = new Rect(0, 0, 0, 0);
	this.visible = true;
	this.showText = true;
	this.align = 'center';
	this.state = '';
	this.tooltip = '';
	this.saveparam = {};
	
	this.fps = 0;
	this.timeout = 0;
	this.countup = 0;
}
ActiveImage.prototype.Create = function(id, rect, obj) {
	var that = this;
	var canvas = document.createElement('canvas');
	canvas.id = escape(id);
	this.id = id;
	this.context = canvas.getContext('2d');
	this.text = id;
	this.rect = rect;
	this.origin = new Vector2d(this.rect.x, this.rect.y);
	
	try {
		if (obj.length>0) {
			this.loaded = obj.length;
			for (var i in obj) {
				if (Helper.checkIfImage(obj[i])) {
					var item = new Image();
					Helper.addEvent(item, 'load', function() {
						that.IsLoaded();
					}, false);
					item.src = obj[i];
					this.sprites.push(item);
					this.rect.w = 0;
					this.rect.h = 0;
					item = null;
				}
				else {
					this.sprites.push(obj[i])
					this.IsLoaded();
				}
			}
		}
	} catch (e) {
		var item = Config.activeTheme.formElementBack;
		this.sprites.push(item);
		this.context.canvas.setAttribute('width',this.rect.w);
		this.context.canvas.setAttribute('height',this.rect.h);
		this.isready = true;
	}
	canvas = null;
},
ActiveImage.prototype.IsLoaded = function() {
	if (--this.loaded <= 0) {
		this.isready = true;
		// all sprites are assumed same size, set canvas size here
		var idx = 0;
		for (var i in this.sprites) {
			if ((this.sprites[i].constructor == HTMLImageElement) || (this.sprites[i].constructor == Image) ||
				(this.sprites[i] instanceof HTMLImageElement) || (this.sprites[i] instanceof Image)) {
				idx = i;
				break;
			}
		}
		if (this.rect.w == 0) {
			this.context.canvas.setAttribute('width',this.sprites[idx].width);
			this.rect.w = this.sprites[0].width;
		}
		else 
			this.context.canvas.setAttribute('width',this.rect.w);
		if (this.rect.h == 0) {
			this.context.canvas.setAttribute('height',this.sprites[idx].height);
			this.rect.h = this.sprites[0].height;
		}
		else 
			this.context.canvas.setAttribute('height',this.rect.h);
	}
}
ActiveImage.prototype.Update = function(elapsed) {
	var that = this;
	if (this.isready) {
		if (!this.visible)
			this.inputFocus = false;
		else
			CformElements[this.type]['_update'](this, elapsed);
	}
	return this.update;
}
ActiveImage.prototype.Draw = function() {
	if (!this.isready) return false;
	if (!this.redraw) return false;

	if (this.visible) {
		this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
		CformElements[this.type]['_draw'](this);
		if ((this.showText) && (this.text != '')) {
			this.context.textBaseline = 'middle';
			this.context.textAlign = this.align;
			if (Stage.formStyle.length > 0)
				this.context.font = Stage.formStyle[0];
			if (Stage.formStyle.length > 1)
				this.context.fillStyle = Stage.formStyle[1];
			if (this.align == 'left')
				this.context.fillText(this.text, 0,this.rect.h/2);
			else if (this.align == 'right')
				this.context.fillText(this.text, this.rect.w,this.rect.h/2);
			else
				this.context.fillText(this.text, this.rect.w/2,this.rect.h/2);
		}			
		if (this.link != null) {
			// create a detectable path
			this.context.beginPath();
			this.context.rect(this.rect.x,this.rect.y,this.rect.w,this.rect.h);
			this.context.closePath();
		}
	}
	this.redraw = false;
	this.update = true;
	return true;
}
ActiveImage.prototype.DrawImageOrFill = function(obj) {
	if ((obj.constructor == HTMLImageElement) || (obj.constructor == Image) ||
		(obj instanceof HTMLImageElement) || (obj instanceof Image))
		this.context.drawImage(obj,0,0);
	else {
		this.context.fillStyle = obj;
		this.context.fillRect(0,0,this.context.canvas.width,this.context.canvas.height);
	}
}
