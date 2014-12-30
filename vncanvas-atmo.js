///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

///////////////////////////////////////////////////////////////////////////////
// Local Helpers
///////////////////////////////////////////////////////////////////////////////
// Helper function to create pointer for automap
Helper.createPointer = (function (ctx, x, y, w, h, rot) {
	ctx.beginPath();
	if (rot == 0) {
		ctx.moveTo(x+0.5*w,y+0.1*h);
		ctx.lineTo(x+0.9*w,y+0.9*h);
		ctx.lineTo(x+0.5*w,y+0.75*h);
		ctx.lineTo(x+0.1*w,y+0.9*h);
	}
	if (rot == 1) {
		ctx.moveTo(x+0.9*w,y+0.5*h);
		ctx.lineTo(x+0.1*w,y+0.9*h);
		ctx.lineTo(x+0.25*w,y+0.5*h);
		ctx.lineTo(x+0.1*w,y+0.1*h);
	}
	if (rot == 2) {
		ctx.moveTo(x+0.5*w,y+0.9*h);
		ctx.lineTo(x+0.1*w,y+0.1*h);
		ctx.lineTo(x+0.5*w,y+0.25*h);
		ctx.lineTo(x+0.9*w,y+0.1*h);
	}
	if (rot == 3) {
		ctx.moveTo(x+0.1*w,y+0.5*h);
		ctx.lineTo(x+0.9*w,y+0.1*h);
		ctx.lineTo(x+0.75*w,y+0.5*h);
		ctx.lineTo(x+0.9*w,y+0.9*h);
	}
	ctx.closePath();
});
///////////////////////////////////////////////////////////////////////////////
// Atmosphere special effects plug-ins
///////////////////////////////////////////////////////////////////////////////
// atmosphere - create atmosphere effects (layer 3)
function atmosphere(param) {
	var arr_param = new Array();
	for (var prop in param) {
		if (param.hasOwnProperty(prop)) {
			arr_param.push(prop);
			arr_param.push(JSON.stringify(param[prop]));
		}
	}
	
	// for plugins compatibility, first parameter must identify type of atmo effect
	var type = arr_param[0]; //eval(arr_param[0]);
	arr_param[1] = eval(arr_param[1]);
	var action = 'start';
	if (arr_param[1].toString().search(/(start|stop)/g) != -1)
		action = arr_param[1];
		
	for (var i=0; i<Stage.layers[3].length; i++) {
		if (Stage.layers[3][i].type == type) {
			Stage.layers[3][i].action = (action) ? action : 'start';
			if (Stage.layers[3][i].action == 'start')
				Stage.layers[3][i].Init(type, param);
			return;
		}
	}
	var nextid = (Stage.layers[3].length > 0) ? 
				parseInt(Stage.layers[3][Stage.layers[3].length-1].context.canvas.id.substr(3))+1 : 0;
	var atm = new Atmosphere('atm'+nextid);
	//atm.Create('atm'+nextid);
	atm.Init(type, param);	
	Stage.layers[3].push(atm);
	atm = null;
}

var AtmoEffects = {
	rain: {
		_init: function(obj, param) {
			obj.alpha = 0.5;
			obj.numParticles = (typeof param.rain == 'number') ? param.rain : 0;
			obj.direction = (param.direction != null) ? param.direction%360 : 90;
			obj.particles = new Array(obj.numParticles);
			for (var i=0; i<obj.numParticles; i++) {
				obj.particles[i] = new Particle();
				obj.particles[i].Create(obj.context.canvas,obj.direction,1,1);
			}
			obj.visible = true;
			// saves
			// numParticles is saved in param.rain
			obj.saveparam.direction = obj.direction;
		},
		_update: function(obj, elapsed) {
			var running_draw = false;
			for (var i=0; i<obj.numParticles; i++) {
				var ret = obj.particles[i].Update(elapsed, (obj.action=='start')?true:false);
				if (ret) running_draw = true;
			}
			obj.redraw = running_draw;
			if (!obj.redraw && (obj.numParticles>0)) {
				// free some memory by clearing particles, we'll add later if needed again
				obj.particles.splice(0, obj.numParticles);
				obj.numParticles = 0;
				obj.visible = false;
			}
			//else if (!obj.redraw && (obj.numParticles<=0)) {
			//	obj.update = true;
			//}
		},
		_draw: function(obj) {
			obj.context.lineWidth = "1";
			obj.context.strokeStyle = "rgb(255, 255, 255)";
			obj.context.beginPath();
			for (var i=0; i<obj.numParticles; i++) {
				obj.context.moveTo(obj.particles[i].pos.vx, obj.particles[i].pos.vy);
				obj.context.lineTo(obj.particles[i].pos.vx - obj.particles[i].size.vx, 
									obj.particles[i].pos.vy - obj.particles[i].size.vy);
			}
			obj.context.closePath();
			// do a per frame stroke or fill, instead of per particle
			obj.context.stroke();
		}
	},
	snow: {
		_init: function(obj, param) {
			obj.alpha = 0.5;
			obj.numParticles = (typeof param.snow == 'number') ? param.snow : 0;
			obj.direction = (param.direction != null) ? param.direction%360 : 90;
			obj.particles = new Array(obj.numParticles);
			for (var i=0; i<obj.numParticles; i++) {
				obj.particles[i] = new Particle();
				obj.particles[i].Create(obj.context.canvas,obj.direction,0.25,0.25);
			}
			obj.visible = true;
			// saves
			// numParticles is saved in param.snow
			obj.saveparam.direction = obj.direction;
		},
		_update: function(obj, elapsed) {
			var running_draw = false;
			for (var i=0; i<obj.numParticles; i++) {
				var ret = obj.particles[i].Update(elapsed, (obj.action=='start')?true:false);
				if (ret) running_draw = true;
			}
			obj.redraw = running_draw;
			if (!obj.redraw && (obj.numParticles>0)) {
				// free some memory by clearing particles, we'll add later if needed again
				obj.particles.splice(0, obj.numParticles);
				obj.numParticles = 0;
				obj.visible = false;
			}
			//else if (!obj.redraw && (obj.numParticles<=0)) {
			//	obj.update = true;
			//}
		},
		_draw: function(obj) {
			obj.context.lineWidth = "1";
			obj.context.strokeStyle = "rgb(255, 255, 255)";
			obj.context.fillStyle = 'white';
			obj.context.beginPath();
			for (var i=0; i<obj.numParticles; i++) {
				obj.context.moveTo(obj.particles[i].pos.vx, obj.particles[i].pos.vy);
				obj.context.arc(obj.particles[i].pos.vx, obj.particles[i].pos.vy, 
								obj.particles[i].size.vy, 0, 2*Math.PI);
			}
			obj.context.closePath();
			// do a per frame stroke or fill, instead of per particle
			obj.context.fill();
		}
	},
	cloud: {
		_init: function(obj, param) {
			if (param.cloud.search(/(start|stop)/g) == -1)
				obj.src = param.cloud;
			obj.isready = false;
			obj.alpha = 0;
			obj.image = new Image();
			Helper.addEvent(obj.image, 'load', function() {
				obj.isready = true;
				obj.visible = true;
			}, false);
			obj.image.src = obj.src;
			obj.direction = null;
			obj.pos = new Vector2d(0,0);
			if (param.direction != null) {
				obj.direction = param.direction % 360;
				obj.dirVector = new Vector2d(1,0);
				obj.dirVector.rotate(obj.direction * Math.PI/180);
			}
			// saves
			obj.saveparam.cloud = obj.src;
			obj.saveparam.direction = obj.direction;
		},
		_update: function(obj, elapsed) {
			if (obj.action == 'stop') {
				if (obj.alpha > 0) {
					obj.alpha -= elapsed/(Config.transTime * 1000)
					obj.redraw = true;
				}
				else {
					obj.image = null;
					obj.visible = false;
				}
			}
			else {
				if (obj.alpha < 1) {
					obj.alpha += elapsed/(Config.transTime * 1000);
					obj.redraw = true;
				}
				// scroll it here
				if (obj.direction != null) {
					var vel = new Vector2d(obj.dirVector.vx,obj.dirVector.vy);
					vel.scale(elapsed/(Config.transTime * 32));
					obj.pos.add(vel);
					if (obj.pos.vx < -obj.image.width) obj.pos.vx = 0;
					if (obj.pos.vx > 0) obj.pos.vx = -obj.image.width;
					if (obj.pos.vy < -obj.image.height) obj.pos.vy = 0;
					if (obj.pos.vy > 0) obj.pos.vy = -obj.image.height;
					obj.redraw = true;
				}
				else {
					obj.pos = new Vector2d(0,0);
				}
			}
		},
		_draw: function(obj) {
			var x = obj.pos.vx;
			var y = obj.pos.vy;
			while (x < obj.context.canvas.width) {
				while (y < obj.context.canvas.height) {
					obj.context.drawImage(obj.image, x, y);
					y += obj.image.height;
				}
				y = obj.pos.vy;
				x += obj.image.width;
			}
		}
	},
	beam: {
		_init: function(obj, param) {
			obj.pos = new Vector2d(0,0);
			obj.radius = (typeof param.beam == 'number') ? param.beam : 0;
			obj.mask = (param.mask) ? param.mask : 'black';
			obj.alpha = 0;
			obj.visible = true;
			// saves
			// radius is saved in param.beam
			obj.saveparam.mask = obj.mask;
		},
		_update: function(obj, elapsed) {
			if (obj.action == 'stop') {
				if (obj.alpha > 0) {
					obj.alpha -= elapsed/(Config.transTime * 1000)
					obj.redraw = true;
				}
				else {
					obj.visible = false;
				}
			}
			else {
				if (obj.alpha < 1) {
					obj.alpha += elapsed/(Config.transTime * 1000);
					obj.redraw = true;
				}
				if (!obj.pos.equal(Stage.coord)) {
					obj.pos.copy(Stage.coord);
					obj.redraw = true;
				}
			}
		},
		_draw: function(obj) {
			obj.context.fillStyle = obj.mask;
			obj.context.fillRect(0, 0, obj.context.canvas.width, obj.context.canvas.height);
			obj.context.save();
			obj.context.globalCompositeOperation = "destination-out";
			var grd = obj.context.createRadialGradient(Stage.coord.vx, Stage.coord.vy, 0,
														Stage.coord.vx, Stage.coord.vy, obj.radius);
			grd.addColorStop(0, 'rgba(0,0,0,1)');
			grd.addColorStop(0.6, 'rgba(0,0,0,0.8)');
			grd.addColorStop(1, 'rgba(0,0,0,0)');
			obj.context.fillStyle = grd;
			obj.context.beginPath();
			obj.context.arc(Stage.coord.vx, Stage.coord.vy, obj.radius, 0, 2*Math.PI);
			obj.context.closePath();
			obj.context.fill();
			obj.context.restore();
		}
	},
	minimap: {
		_init: function(obj, param) {
			if (param.minimap.search(/(start|stop)/g) == -1) {
				obj.src = param.minimap;
				obj.size = param.size;
				obj.pos = new Vector2d(param.offset[0], param.offset[1]);
				obj.alpha = 0;
			}
			obj.isready = false;
			obj.image = new Image();
			Helper.addEvent(obj.image, 'load', function() {
				obj.isready = true;
				obj.visible = true;
				obj.dimx = obj.image.width/obj.size[0];
				obj.dimy = obj.image.height/obj.size[1];
			}, false);
			obj.image.src = obj.src;
			// saves
			obj.saveparam.minimap = obj.src;
			// size saved in param
		},
		_update: function(obj, elapsed) {
			if (obj.action == 'stop') {
				if (obj.alpha > 0) {
					obj.alpha -= elapsed/(Config.transTime * 1000)
					obj.redraw = true;
				}
				else {
					obj.image = null;
					obj.visible = false;
				}
			}
			else {
				if (obj.alpha < 0.6) {
					obj.alpha += elapsed/(Config.transTime * 1000);
					obj.alpha = Math.min(0.6, obj.alpha);
					obj.redraw = true;
				}
			}
		},
		_draw: function(obj) {
			// draw map cover or image
			obj.context.save();
			obj.context.fillStyle = Config.activeTheme.automapMask;
			var val = Stage.variables["_nav_automap"].Value();
			for (var i=0; i<obj.size[0]; i++) {
				for (var j=0; j<obj.size[1]; j++) {
					if (!val[i][j])
						obj.context.fillRect(i*obj.dimx+obj.pos.vx, j*obj.dimy+obj.pos.vy, obj.dimx, obj.dimy);
					else
						obj.context.drawImage(obj.image, i*obj.dimx, j*obj.dimy, obj.dimx, obj.dimy,
											  i*obj.dimx+obj.pos.vx, j*obj.dimy+obj.pos.vy, obj.dimx, obj.dimy)
				}
			}
			obj.context.restore();
			if (Helper.findVar("_nav_pos") != null) {
				obj.context.save();
				var subs = Config.activeTheme.automapPointer.split(' ');
				obj.context.fillStyle = subs[0];
				obj.context.strokeStyle = subs[1];
				val = Stage.variables["_nav_pos"].Value();
				Helper.createPointer(obj.context, val[0]*obj.dimx+obj.pos.vx, val[1]*obj.dimy+obj.pos.vy, 
										obj.dimx, obj.dimy, Stage.variables["_nav_dir"].Value());
				obj.context.fill();
				obj.context.stroke();
				obj.context.restore();
			}
		}
	}
};
function Atmosphere(id) {
	this.alpha = 0;
	//this.isready = false;
	this.redraw = true;
	//this.update = false;
	//this.context = 0;
	this.type = '';
	this.visible = true;
	this.action = 'start';
	this.saveparam = {};

	var canvas = document.createElement('canvas');
	canvas.id = escape(id);
	this.context = canvas.getContext('2d');
	this.context.canvas.setAttribute('width', Stage.canvas.width);
	this.context.canvas.setAttribute('height', Stage.canvas.height);
	this.isready = true;
	this.update = false;
	canvas = null;
	//return this.context.canvas.id;
}
Atmosphere.prototype.Init = function(type, param) { 
	this.type = type;
	this.saveparam = param;
	AtmoEffects[this.type]['_init'](this, param);
}
Atmosphere.prototype.Update = function(elapsed) {
	if (this.isready) {
		AtmoEffects[this.type]['_update'](this, elapsed);
	}
	return this.update;
}
Atmosphere.prototype.Draw = function() {
	if (!this.isready) return false;
	if (!this.redraw) return false;
	if (this.visible) {
		this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
		this.context.globalAlpha = Math.max(0, Math.min(1, this.alpha));
		AtmoEffects[this.type]['_draw'](this);
	}	
	this.redraw = false;
	this.update = true;
	return true;
}
function Particle() {
	this.pos = new Vector2d(0,0);
	this.vel = new Vector2d(0,0);
	this.size = new Vector2d(0,0);
	this.viewh = 0;
	this.vieww = 0;
	this.dir = 0;
}
Particle.prototype.Create = function(canvas, angle, vbase, sbase) {
	this.vieww = canvas.width;
	this.viewh = canvas.height;
	this.dir = (90-angle)*Math.PI/180;

	// fix the size and velocity upon creation
	// to speed up reset and update
	this.vel.vy = Math.random() * 40 * vbase + 10;
	this.vel.vx = this.vel.vy * Math.tan(this.dir);
	this.size.copy(this.vel);
	this.vel.scale(2);
	this.size.scale(sbase);
	this.Reset();
}
Particle.prototype.Reset = function() {
	// randomize position only
	this.pos.vx = this.vieww * (2*Math.random() - 0.5);
	this.pos.vy = this.viewh * (-1*Math.random());
}
Particle.prototype.Update = function(elapsed, reset) {
	this.pos.add(this.vel);
	if (this.pos.vy > this.viewh + 50) {
		if (reset) 
			this.Reset();
		else 
			return false;
	}
	return true;
}
//Particle.prototype.Pos = function() { return this.pos; };
//Particle.prototype.Size = function() { return this.size; };
