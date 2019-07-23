///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

///////////////////////////////////////////////////////////////////////////////
// Local Helpers
///////////////////////////////////////////////////////////////////////////////
require(["app/vncanvas-base"], function() {
    // Helper function...
});

///////////////////////////////////////////////////////////////////////////////
// Atmosphere special effects plug-ins
///////////////////////////////////////////////////////////////////////////////
// atmosphere - create atmosphere effects (layer 3)
function atmosphere(param) {
    let arr_param = new Array();
    for (let prop in param) {
        if (param.hasOwnProperty(prop)) {
            arr_param.push(prop);
            arr_param.push(JSON.stringify(param[prop]));
        }
    }
	// for plugins compatibility, first parameter must identify type of atmo effect
    let type = arr_param[0];
    arr_param[1] = eval(arr_param[1]);
    let action = (arr_param[1].toString().search(/(start|stop)/g)!=-1) ? arr_param[1] : 'start';
    
    for (let [key, atm] of Stage.layers.atm.entries()) {
        if (atm.type == type) {
            atm.action = action;
            if (atm.action == 'start')
                atm.Init(type, param, true);
            return;
        }
    }
    let id = -1, atm = null;
    for (let k of Stage.layers.atm.keys())
        id = Math.max(id, k.substr(3));
    let nextid = 'atm' + parseInt(id+1);
    
    //let atm = new Atmosphere(nextid);
    if (type == 'rain') atm = new Rain(nextid);
    else if (type == 'snow') atm = new Snow(nextid);
    else if (type == 'firefly') atm = new Firefly(nextid);
    else if (type == 'cloud') atm = new Cloud(nextid);
    else atm = new AtmoExtras(nextid);
    
    atm.Init(type, param);
    Stage.layers.atm.set(nextid, atm);
}
///////////////////////////////////////////////////////////////////////////////
// Atmosphere Class
///////////////////////////////////////////////////////////////////////////////
class Atmosphere {
    constructor(id) {
        this.id = id;
        this.alpha = 0;
        this.redraw = true;
        this.type = '';
        this.visible = true;
        this.action = 'start';
        this.saveparam = {};
        this.isready = true;
        this.update = false;
        
        this.glAtmo = new PIXI.Container();
        this.glSubScene = Stage.glSubScene[3];
        this.glSubScene.addChild(this.glAtmo);
    }
    Init(type, param) {
        this.type = type;
        this.saveparam = param;
    }
    Update(elapsed) {
        if (!this.isready) return false;

        return this.update;
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
        
        this.redraw = false;
        this.update = true;
        return true;
    }
}
///////////////////////////////////////////////////////////////////////////////
// Rain Class
///////////////////////////////////////////////////////////////////////////////
class Rain extends Atmosphere {
    constructor(id) {
        super(id);
    }
    Init(type, param, reset=false) {
        super.Init(type, param);
        if (reset) this.glAtmo.removeChildren();
        //this.alpha = 0.5;
        this.numParticles = (typeof param.rain == 'number') ? param.rain : 0;
        this.direction = (param.direction != null) ? param.direction%360 : 90;
        this.particles = new Array(this.numParticles);
        for (let i=0; i<this.numParticles; i++) {
            this.particles[i] = new Particle();
            this.particles[i].create(Stage.canvas.width, Stage.canvas.height, this.direction, 1, 0.75,)

            let p = this.particles[i].glParticle;
            let w = (this.particles[i].size.vy>40) ? 1.5 : (this.particles[i].size.vy>20) ? 1 : 0.5;
            p.clear();
            p.beginFill(0,0);
            p.lineStyle(w,0xFFFFFF,2*w/3);
            p.moveTo(0,0);
            p.lineTo(-this.particles[i].size.vx,-this.particles[i].size.vy);
            //p.lineTo(-this.particles[i].size.vx,-this.particles[i].size.vy);
            p.endFill();
            this.glAtmo.addChild(p);
        }
        this.visible = true;
        this.saveparam.direction = this.direction;
    }
    Update(elapsed) {
        if (this.isready) {
            let running_draw = false;
            for (let i in this.particles) {
                let ret = this.particles[i].update(elapsed, (this.action=='start')?true:false);
                if (ret) running_draw = true;
            }
            this.redraw = running_draw;
            if (!this.redraw && (this.numParticles>0)) {
				// free some memory by clearing particles, we'll add later if needed again
                this.glAtmo.removeChildren();
                this.particles.splice(0, this.numParticles);
                this.numParticles = 0;
                this.visible = false;
            }
        }
        return super.Update(elapsed);
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
        
        this.glAtmo.visible = this.visible;
        if (this.visible) {
            for (let i in this.particles) {
                let p = this.particles[i].glParticle;
                p.position.set(this.particles[i].pos.vx, this.particles[i].pos.vy);
            }
        }
        return super.Draw();
    }
}
///////////////////////////////////////////////////////////////////////////////
// Snow Class
///////////////////////////////////////////////////////////////////////////////
class Snow extends Atmosphere {
    constructor(id) {
        super(id);
    }
    Init(type, param, reset=false) {
        super.Init(type, param);
        if (reset) this.glAtmo.removeChildren();
        //this.alpha = 0.5;
        this.numParticles = (typeof param.snow == 'number') ? param.snow : 0;
        this.direction = (param.direction != null) ? param.direction%360 : 90;
        this.particles = new Array(this.numParticles);
        for (let i=0; i<this.numParticles; i++) {
            this.particles[i] = new Particle();
            this.particles[i].create(Stage.canvas.width, Stage.canvas.height, this.direction, 0.35, 0.5,)

            // draw the graphic here to speed up updates
            let p = this.particles[i].glParticle;
            let r = (this.particles[i].size.vy>10) ? 1.5 : (this.particles[i].size.vy>5) ? 1 : 0.5;
            p.clear();
            p.beginFill(0xFFFFFF,2*r/3);
            p.drawCircle(0, 0, this.particles[i].size.vy);
            p.endFill();
            this.glAtmo.addChild(p);
        }
        this.visible = true;
        this.saveparam.direction = this.direction;
    }
    Update(elapsed) {
        if (this.isready) {
            let running_draw = false;
            for (let i in this.particles) {
                let ret = this.particles[i].update(elapsed, (this.action=='start')?true:false);
                if (ret) running_draw = true;
            }
            this.redraw = running_draw;
            if (!this.redraw && (this.numParticles>0)) {
				// free some memory by clearing particles, we'll add later if needed again
                this.glAtmo.removeChildren();
                this.particles.splice(0, this.numParticles);
                this.numParticles = 0;
                this.visible = false;
            }
        }
        return super.Update(elapsed);
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
        
        this.glAtmo.visible = this.visible;
        if (this.visible) {
            for (let i in this.particles) {
                let p = this.particles[i].glParticle;
                p.position.set(this.particles[i].pos.vx, this.particles[i].pos.vy);
            }
        }
        return super.Draw();
    }
}
///////////////////////////////////////////////////////////////////////////////
// Firefly Class
///////////////////////////////////////////////////////////////////////////////
class Firefly extends Atmosphere {
    constructor(id) {
        super(id);
    }
    Init(type, param, reset=false) {
        super.Init(type, param);
        if (reset) this.glAtmo.removeChildren();
        this.alpha = 1.0;
        this.settings = {ttl:200, xmax:2, ymax:1, rmax:10, rt:1, gravity:param.gravity?param.gravity:0, wind:param.wind?param.wind:0};
        this.numParticles = (typeof param.firefly == 'number') ? param.firefly : 0;
        this.particles = new Array(this.numParticles);

        for (let i=0; i<this.numParticles; i++) {
            this.particles[i] = new Particle();
            this.particles[i].create(Stage.canvas.width, Stage.canvas.height, 0, 1, 1,)
            this.particles[i].pos.vx = Math.random()*this.particles[i].vpwidth;
            this.particles[i].pos.vy = Math.random()*this.particles[i].vpheight;
            this.particles[i].vel.vx = this.settings.wind+(Math.random()*this.settings.xmax) * (Math.random() < 0.5 ? -1 : 1);
            this.particles[i].vel.vy = this.settings.gravity+(Math.random()*this.settings.ymax) * (Math.random() < 0.5 ? -1 : 1);

            this.particles[i].r = ((this.settings.rmax-1)*Math.random()) + 1;
            this.particles[i].hl = (this.settings.ttl)*(this.particles[i].r/this.settings.rmax);
            this.particles[i].rt = Math.random()*this.particles[i].hl;
            this.particles[i].drt = Math.random()+1;
            this.particles[i].stop = Math.random()*0.2+0.4;

            // draw the graphic here to speed up updates
            let p = this.particles[i].glParticle;
            p.clear();
            p.beginFill(0x4D6585,0.4);
            p.drawCircle(0, 0, this.particles[i].r);
            p.endFill();
            p.beginFill(0xA6B2C2,0.6);
            p.drawCircle(0, 0, this.particles[i].r*0.7);
            p.endFill();
            p.beginFill(0xFFFFFF,0.8);
            p.drawCircle(0, 0, this.particles[i].r*0.4);
            p.endFill();
            this.glAtmo.addChild(p);
        }
        this.visible = true;
        this.saveparam.direction = this.direction;
    }
    Update(elapsed) {
        if (this.isready) {
            let running_draw = false;
            for (let i in this.particles) {
                let ret = true;
                if ((this.particles[i].rt<=0) || (this.particles[i].rt>=this.particles[i].hl))
                    this.particles[i].drt = this.particles[i].drt*-1;
                this.particles[i].rt += this.particles[i].drt;
                this.particles[i].pos.add(this.particles[i].vel);
                if (this.particles[i].pos.vx > this.particles[i].vpwidth+50 || this.particles[i].pos.vx < -50 || 
                    this.particles[i].pos.vy > this.particles[i].vpheight+50 || this.particles[i].pos.vy < -50) { 
                    if (this.action == 'start') {
                        this.particles[i].pos.vx = Math.random()*this.particles[i].vpwidth;
                        this.particles[i].pos.vy = Math.random()*this.particles[i].vpheight;
                        this.particles[i].vel.vx = this.settings.wind+(Math.random()*this.settings.xmax) * (Math.random() < 0.5 ? -1 : 1);
                        this.particles[i].vel.vy = this.settings.gravity+(Math.random()*this.settings.ymax) * (Math.random() < 0.5 ? -1 : 1);
                    }
                    else ret=false;
                }
                if (ret) running_draw = true;
            }
            this.redraw = running_draw;
            if (!this.redraw && (this.numParticles>0)) {
				// free some memory by clearing particles, we'll add later if needed again
                this.glAtmo.removeChildren();
                this.particles.splice(0, this.numParticles);
                this.numParticles = 0;
                this.visible = false;
            }
        }
        return super.Update(elapsed);
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
        
        this.glAtmo.visible = this.visible;
        if (this.visible) {
            for (let i in this.particles) {
                this.alpha = 1-(this.particles[i].rt/this.particles[i].hl);
                let p = this.particles[i].glParticle;
                p.position.set(this.particles[i].pos.vx, this.particles[i].pos.vy);
                p.alpha = this.alpha;
            }
        }
        return super.Draw();
    }
}
///////////////////////////////////////////////////////////////////////////////
// Cloud Class
///////////////////////////////////////////////////////////////////////////////
class Cloud extends Atmosphere {
    constructor(id) {
        super(id);
        this.glSprite = null;
        // PIXI: tiling sprite does not accept no args, unlike PIXI.Sprite
        //this.glSprite = new PIXI.extras.TilingSprite();
        //this.glAtmo.addChild(this.glSprite);
    }
    Init(type, param, reset=false) {
        super.Init(type, param);
        if (reset) this.glAtmo.removeChildren();
        if (param.cloud.search(/(start|stop)/g) == -1)
            this.src = param.cloud;
        this.isready = false;
        this.alpha = 0;
        this.direction = null;
        this.pos = new Vector2d(0,0);
        this.imageDim = new Vector2d(0,0);
        Stage.glManager.addQueue([this.src], !this.isready,
            (resources, init) => {
                let base = resources[this.src].texture;
                this.imageDim.set(base.width, base.height);
                this.glSprite = new PIXI.extras.TilingSprite(base, Stage.canvas.width, Stage.canvas.height);
                this.glSprite.position.set(0,0);
                this.glAtmo.addChild(this.glSprite);
            
                this.isready = true;
                this.visible = true;
            }
        );
        if (param.direction != null) {
            this.direction = param.direction%360;
            this.dirVector = new Vector2d(1,0);
            this.dirVector.rotate(this.direction*Math.PI/180);
        }
        this.saveparam.cloud = this.src;
        this.saveparam.direction = this.direction;
    }
    Update(elapsed) {
        if (this.isready) {
            if (this.action == 'stop') {
                if (this.alpha > 0) {
                    this.alpha -= elapsed/(Config.transTime*1000);
                    this.redraw = true;
                }
                else {
                    Stage.glManager.free(this.src);
                    this.glAtmo.removeChild(this.glSprite);
                    this.visible = false;
                }
            }
            else {
                if (this.alpha < 1) {
                    this.alpha += elapsed/(Config.transTime*1000);
                    this.redraw = true;
                }
                // scroll it here
                if (this.direction != null) {
                    let vel = new Vector2d(this.dirVector.vx, this.dirVector.vy);
                    vel.scale(elapsed/(Config.transTime*32));
                    this.pos.add(vel);
                    this.redraw = true;
                }
                else {
                    this.pos.set(0,0);
                }
            }
        }
        return super.Update(elapsed);
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
        
        this.glAtmo.visible = this.visible;
        if (this.visible) {
            this.glSprite.tilePosition.set(this.pos.vx, this.pos.vy);
            this.glAtmo.alpha = this.alpha;
        }
        return super.Draw();
    }
}
///////////////////////////////////////////////////////////////////////////////
// Custom Atmosphere Class
///////////////////////////////////////////////////////////////////////////////
class AtmoExtras extends Atmosphere {
    constructor(id) {
        super(id);
        // AtmoExtras will have additional sprite for image displays
        this.glSprite = new PIXI.Sprite();
        this.glAtmo.addChild(this.glSprite);
    }
    Init(type, param, reset=false) {
        super.Init(type, param);
        AtmoEffects[this.type]._init(this, param);
    }
    Update(elapsed) {
        if (this.isready) {
            AtmoEffects[this.type]._update(this, elapsed);
        }
        return super.Update(elapsed);
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
        
        this.glAtmo.visible = this.visible;
        if (this.visible) {
            AtmoEffects[this.type]._draw(this);
        }
        return super.Draw();
    }
}
var AtmoEffects = {
    test00:{
        _init: (obj, param) => {
        },
        _update: (elapsed) => {
        },
        _draw: () => {
        }
    }
};

///////////////////////////////////////////////////////////////////////////////
// Particle Class
///////////////////////////////////////////////////////////////////////////////
class Particle {
    constructor() {
        this.pos = new Vector2d(0,0);
        this.vel = new Vector2d(0,0);
        this.size = new Vector2d(0,0);
        this.vpheight = 0;
        this.vpwidth = 0;
        this.dir = 0;
        
        this.glParticle = new PIXI.Graphics();
    }
    create(w, h, angle, vbase, sbase) {
        this.vpwidth = w;
        this.vpheight = h;
        this.dir = (90-angle)*Math.PI/180;

        // fix the size and velocity upon creation
        // to speed up reset and update
        this.vel.vy = Math.random() * 45 * vbase + 5;
        this.vel.vx = this.vel.vy * Math.tan(this.dir);
        this.size.copy(this.vel);
        this.vel.scale(2);
        this.size.scale(sbase);
        this.reset();
    }
    reset() {
        // randomize position only
        this.pos.vx = this.vpwidth * (2*Math.random() - 0.5);
        this.pos.vy = this.vpheight * (-1*Math.random());
    }
    update(elapsed, reset) {
        this.pos.add(this.vel);
        if (this.pos.vy > this.vpheight + 50) {
            if (reset) this.reset();
            else return false;
        }
        return true;
    }
}