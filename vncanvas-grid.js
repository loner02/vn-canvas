///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

///////////////////////////////////////////////////////////////////////////////
// Cform Elements for creating walkable grid
///////////////////////////////////////////////////////////////////////////////
require(["app/vncanvas-cform"], function() {
    CformElements.gridBase = {
        _init: (obj, param) => {
			let rect = new Rect(param.x, param.y, (param.w)?param.w:0, (param.h)?param.h:0);
            let sprites = [param.base];
            obj.Create(param.name, rect, sprites);
            obj.size = param.size;
            obj.tile = new Vector2d(0,0);
            obj.showText = false;
            obj.update = false;
            obj.blocks = param.blocks;
            obj.move = new Vector2d(0,0);
            obj.origin = new Vector2d(0,0);
            obj.res = param.res;
        },
        _update: (obj, elapsed) => {
            // update grid size here, asynchronous init may not have completed yet
            if (obj.tile.equal(new Vector2d(0,0))) {
                obj.tile.vx = obj.rect.w/obj.size[0];
                obj.tile.vy = obj.rect.h/obj.size[1];
            }
            if (!obj.move.equal(new Vector2d(0,0))) {
                obj.origin.add(obj.move);
                obj.move.sub(obj.move);
                obj.rect.x = obj.origin.vx;
                obj.rect.y = obj.origin.vy;
                obj.redraw = true;
            }
        },
        _draw: (obj) => {
            obj.drawImageOrFill(obj.sprites[0]);            
        },
    };
    CformElements.trigger = {
        // trigger is like standard button with the following differences:
        //      button action is by click; trigger action is by actor sprite stepping on it, or by user defined button
        //      buttons are fixed in viewport, located in x,y viewport coordinates; trigger moves with the gridBase, located in x,y grid coordinates
        //      buttons may be clicked many times; triggers disappear or become inactive after performing action
        //      hidden buttons are inactive; triggers may be invisible but are still active
        _init: (obj, param) => {
            obj.gbase = Helper.getControl(param.gbase);
            // at this point, gbase.tile size hasn't been computed yet
            // put trigger in dummy location outside of viewport
            let rect = new Rect(-1000, -1000, 0, 0);
            let sprites = [param.base];
            if (param.hover) sprites.push(param.hover);
            else sprites.push(param.base);
            if (param.click) sprites.push(param.click);
            else sprites.push(param.base);
            obj.Create(param.name, rect, sprites);
            obj.location = param.position;
            obj.link = param.link;
            obj.action = param.action;

            obj.showText = false;
            obj.update = false;
            obj.stageDim = new Vector2d(0,0)
            obj.redraw = false;
            obj.move = new Vector2d(0,0);
            obj.origin = new Vector2d(0,0);
            obj.hover = false;
            obj.done = false;
        },
        _update: (obj, elapsed) => {
            // wait until gbase and movable has initialized
            if ((obj.gbase.tile.equal(new Vector2d(0,0))) /*|| (obj.rect.h == 0)*/)
                return;
            if ((obj.rect.x == -1000) && (obj.rect.y == -1000)) {
                obj.rect.x = obj.location[0]*obj.gbase.tile.vx;
                obj.rect.y = obj.location[1]*obj.gbase.tile.vy;
                obj.rect.w = obj.gbase.tile.vx;
                obj.rect.h = obj.gbase.tile.vy;
                obj.origin.set(obj.rect.x, obj.rect.y);     
                obj.stageDim = new Vector2d((Stage.canvas.width - Stage.canvas.width%obj.rect.w)/obj.gbase.tile.vx, 
                                            (Stage.canvas.height - Stage.canvas.height%obj.rect.h)/obj.gbase.tile.vy);
                obj.redraw = true;
            }
            if (!obj.move.equal(obj.gbase.origin)) {
                obj.move.sub(obj.gbase.origin);
                obj.origin.sub(obj.move);
                obj.move.copy(obj.gbase.origin);
                obj.rect.x = obj.origin.vx;
                obj.rect.y = obj.origin.vy;
                obj.redraw = true;
            }
        },
        _draw: (obj) => {
            if (obj.done)
                obj.drawImageOrFill(obj.sprites[2]);
            else if (obj.hover)
                obj.drawImageOrFill(obj.sprites[1]);            
            else
                obj.drawImageOrFill(obj.sprites[0]);            
        },
    };
    CformElements.movable = {
        _init: (obj, param) => {
            obj.gbase = Helper.getControl(param.gbase);
            // at this point, gbase.tile size hasn't been computed yet
            // put movable in dummy location outside of viewport
            let rect = new Rect(-1000, -1000, 0, 0);
            let sprites = param.sprites;
            obj.Create(param.name, rect, sprites);
            obj.showText = false;
            obj.update = false;
            obj.dir = new Vector2d(0,0); //0:idle, 1:S/E, -1:N/W
            obj.lastdir = 2;             //0:N, 1:E, 2:S, 3:W
            obj.spriteSet = 0;
            obj.speed = 1;
            obj.location = param.position;
            obj.stageDim = new Vector2d(0,0)
            obj.spriteHeight = 0;
            obj.res = new Vector2d(0,0);
            obj.origin = new Vector2d(0,0);
            
            obj.snapped = false;
            obj.snapPos = new Vector2d(0,0);
            
            obj.movFrames = 1;
            obj.movFps = 0;
            obj.movCurFrame = 0;
            
        },
        _update: (obj, elapsed) => {
            // wait until gbase and movable has initialized
            if ((obj.gbase.tile.equal(new Vector2d(0,0))) || (obj.rect.h == 0))
                return;
            if ((obj.rect.x == -1000) && (obj.rect.y == -1000)) {
                // get height of sprite in terms of tile size
                obj.spriteHeight = Math.ceil(obj.rect.h / obj.gbase.tile.vy);     // height shld be multiple of tile
                
                obj.rect.x = obj.location[0]*obj.gbase.tile.vx;
                obj.rect.y = (obj.location[1]-obj.spriteHeight+1)*obj.gbase.tile.vy;
                obj.origin.set(obj.rect.x, obj.rect.y);
                
                obj.stageDim = new Vector2d((Stage.canvas.width - Stage.canvas.width%obj.rect.w)/obj.gbase.tile.vx, 
                                            (Stage.canvas.height - Stage.canvas.height%obj.rect.h)/obj.gbase.tile.vy);
                obj.res.vx = obj.gbase.res/obj.gbase.tile.vx;
                obj.res.vy = obj.gbase.res/obj.gbase.tile.vy;
            }
            if ((Stage.keyPressed != 0) && (CformElements.movable.checkLocation(obj))) {
                CformElements.movable.resetTriggers(obj);
                obj.spriteSet = 1;
				switch (Stage.keyPressed) {
					case 37:	//left
                        obj.dir.vx = -1;
                        obj.lastdir = 3;
                        obj.origin.vx -= Math.ceil(obj.rect.w*obj.res.vx) * obj.speed;
                        break;
					case 38:	//up
                        obj.dir.vy = -1;
                        obj.lastdir = 0;
                        obj.origin.vy -= Math.ceil(obj.rect.w*obj.res.vy) * obj.speed;
                        break;
					case 39:	//right
                        obj.dir.vx = 1;
                        obj.lastdir = 1;
                        obj.origin.vx += Math.ceil(obj.rect.w*obj.res.vx) * obj.speed;
                        break;
					case 40:	//down
                        obj.dir.vy = 1;
                        obj.lastdir = 2;
                        obj.origin.vy += Math.ceil(obj.rect.w*obj.res.vy) * obj.speed;
						break;
					default:
                        obj.dir.set(0,0);
                        obj.lastdir = 2;
						break;
				}
                //obj.update = true;
                obj.redraw = true;
            }            
            else if (!obj.dir.equal(new Vector2d(0,0))) {
                // snap to nearest grid
                // TODO: when snapping adjacent to blocks, may allow passage thru blocked tiles
                let snapdir = new Vector2d((obj.origin.vx-obj.gbase.origin.vx)%obj.gbase.tile.vx, 
                                            (obj.origin.vy-obj.gbase.origin.vy)%obj.gbase.tile.vy);
                let freedir = CformElements.movable.checkSnap(obj);
                if (snapdir.vx != 0) {
                    if ((obj.origin.vx > 0) &&
                        (obj.origin.vx + obj.rect.w < (Stage.canvas.width - Stage.canvas.width%obj.rect.w)))
                        obj.origin.vx += obj.dir.vx * Math.ceil(obj.rect.w*obj.res.vx) * freedir.vx;
                    else
                        obj.gbase.move.vx = -1*obj.dir.vx * Math.ceil(obj.rect.w*obj.res.vx) * freedir.vx;
                }
                else 
                    obj.dir.vx = 0;
            
                if (snapdir.vy != 0) {
                    if ((obj.origin.vy > 0) &&
                        (obj.origin.vy + obj.rect.h < (Stage.canvas.height - Stage.canvas.height%obj.rect.h)))
                        obj.origin.vy += obj.dir.vy * Math.ceil(obj.rect.w*obj.res.vy) * freedir.vy;
                    else
                        obj.gbase.move.vy = -1*obj.dir.vy * Math.ceil(obj.rect.w*obj.res.vy) * freedir.vy; 
                }
                else 
                    obj.dir.vy = 0;
                obj.redraw = true;
            }
            else {
                CformElements.movable.checkTrigger(obj);
                obj.snapped = false;
                obj.spriteSet = 0;
                obj.movCurFrame = 0;
                obj.speed = 1;
            }
            obj.movFrames = obj.sprites[obj.spriteSet][1];
            obj.movFps = obj.sprites[obj.spriteSet][2];
            
            // update timer
            if (!obj.aTimerOn && (obj.movFps>0)) {
                obj.aTimer = setTimeout(() => {
                    obj.movCurFrame = (++obj.movCurFrame) % obj.movFrames;
                    obj.redraw = true;
                    if (obj.visible) obj.aTimerOn = false;
                }, 1000/obj.movFps);
                obj.aTimerOn = true;
            }
        },
        resetTriggers: (obj) => {
            let triggers = Helper.getControlByType("trigger");
            let curpos = new Vector2d(Math.round(obj.origin.vx/obj.gbase.tile.vx), Math.round(obj.origin.vy/obj.gbase.tile.vy)+obj.spriteHeight-1);
            let offset = new Vector2d(Math.round(obj.gbase.origin.vx/obj.gbase.tile.vx), Math.round(obj.gbase.origin.vy/obj.gbase.tile.vy));
            
            for (let t of triggers) {
                let ctrl = Stage.layers.gui.get(t);
                if (!ctrl.done && !((ctrl.location[0] == curpos.vx-offset.vx) && (ctrl.location[1] == curpos.vy-offset.vy))) {
                    ctrl.hover = false;
                    ctrl.redraw = true;
                }
            }
        },
        checkLocation: (obj) => {
            // keep movable inside visible grid
            // check for borders and blocks
            let curpos = new Vector2d(Math.round(obj.origin.vx/obj.gbase.tile.vx), Math.round(obj.origin.vy/obj.gbase.tile.vy)+obj.spriteHeight-1);
            let offset = new Vector2d(Math.round(obj.gbase.origin.vx/obj.gbase.tile.vx), Math.round(obj.gbase.origin.vy/obj.gbase.tile.vy));

            // check if current position has auto trigger
            let trigger = CformElements.movable.isTrigger(curpos.vx, curpos.vy, offset);
            if (trigger != -1) {
                //if (Stage.layers[4][trigger].action == "auto") {
                    Stage.layers.gui.get(trigger).hover = true;
                    Stage.layers.gui.get(trigger).redraw = true;
                    //obj.redraw = true
                    //return false;
                //}
            }
            let blocked = false;
            if (Stage.keyPressed == 37) {   //left
                for (let b of obj.gbase.blocks) {
                    if ((curpos.vx - 1 == b[0] + offset.vx) && 
                        (curpos.vy == b[1] + offset.vy)) {
                            blocked = true;
                            break;
                    }
                }
                if ((curpos.vx <= 0) || blocked) {
                    if ((obj.gbase.origin.vx < 0) && !blocked) {
                        obj.speed = 0;
                        obj.gbase.move = new Vector2d(Math.ceil(obj.rect.w*obj.res.vx),0);
                        return true;
                    }
                    else {
                        obj.lastdir = 3;
                        obj.redraw = true
                        return false;
                    }
                }
            }
            if (Stage.keyPressed == 38) {   // up
                for (let b of obj.gbase.blocks) {
                    if ((curpos.vy - 1 == b[1] + offset.vy) && 
                        (curpos.vx == b[0] + offset.vx)) {
                            blocked = true;
                            break;
                    }
                }
                if ((curpos.vy - obj.spriteHeight + 1 <= 0) || blocked) {
                    if ((obj.gbase.origin.vy < 0) && !blocked) {
                        obj.speed = 0;
                        obj.gbase.move = new Vector2d(0,Math.ceil(obj.rect.w*obj.res.vy));
                        return true;
                    }
                    else {
                        obj.lastdir = 0;
                        obj.redraw = true;
                        return false;
                    }
                }
            }
            if (Stage.keyPressed == 39) {   // right
                for (let b of obj.gbase.blocks) {
                    if ((curpos.vx + 1 == b[0] + offset.vx) && 
                        (curpos.vy == b[1] + offset.vy)) {
                            blocked = true;
                            break;
                    }
                }
                if ((curpos.vx + 1 >= obj.stageDim.vx) || blocked) {
                    if ((obj.gbase.origin.vx > Stage.canvas.width - obj.gbase.rect.w) && !blocked) { 
                        obj.speed = 0;
                        obj.gbase.move = new Vector2d(-1*Math.ceil(obj.rect.w*obj.res.vx),0);
                        return true;
                    }
                    else {
                        obj.lastdir = 1;
                        obj.redraw = true;
                        return false;
                    }
                }
            }
            if (Stage.keyPressed == 40) {   // down
                for (let b of obj.gbase.blocks) {
                    if ((curpos.vy + 1 == b[1] + offset.vy) && 
                        (curpos.vx == b[0] + offset.vx)) {
                            blocked = true;
                            break;
                    }
                }
                if ((curpos.vy + 1 >= obj.stageDim.vy) || blocked) {
                    if ((obj.gbase.origin.vy > Stage.canvas.height - obj.gbase.rect.h) && !blocked) {
                        obj.speed = 0;
                        obj.gbase.move = new Vector2d(0,-1*Math.ceil(obj.rect.w*obj.res.vy));
                        return true;
                    }
                    else {
                        obj.lastdir = 2;
                        obj.redraw = true;
                        return false;
                    }
                }
            }
            return true;
        },
        checkSnap: (obj) => {
            let free = new Vector2d(1,1);
            if (!obj.snapped) {
                obj.snapped = true;
                obj.snapPos.set(Math.round(obj.origin.vx/obj.gbase.tile.vx), Math.round(obj.origin.vy/obj.gbase.tile.vy)+obj.spriteHeight-1);
            }
            let curpos = new Vector2d(obj.snapPos.vx, obj.snapPos.vy);
            let offset = new Vector2d(Math.round(obj.gbase.origin.vx/obj.gbase.tile.vx), Math.round(obj.gbase.origin.vy/obj.gbase.tile.vy));
            
            /* obj.dir - Direction matrix
                -1,-1 |  0,-1 |  1,-1
                ---------------------
                -1,0  |  0,0  |  1,0
                ---------------------
                -1,1  |  0,1  |  1,1
            */
            // is snap direction blocked on next tile?
            let blocked = CformElements.movable.isBlocked(obj.gbase.blocks, curpos.vx + obj.dir.vx, curpos.vy + obj.dir.vy, offset);
            if (blocked) {
                if ((obj.dir.vx == 0) || (obj.dir.vy == 0)) {   // blockd but single direction, just continue
                    return free;
                }
                else {  // blocked and double direction or diagonal, find best tile to snap on
                    // check if x is blocked; TODO; preference on x direction
                    if (!CformElements.movable.isBlocked(obj.gbase.blocks, curpos.vx + obj.dir.vx, curpos.vy, offset)) {
                        free.set(1,-1);
                    }
                    // else check if y is blocked
                    else if (!CformElements.movable.isBlocked(obj.gbase.blocks, curpos.vx, curpos.vy + obj.dir.vy, offset)) {
                        free.set(-1,1);
                    }
                    // nowhere to snap to; reverse both direction
                    else {
                        free.set(-1,-1);
                    }
                    
                }
            }
            return free;
        },
        isBlocked: (blocks, x, y, offset) => {
            let blocked = false;
            for (let b in blocks) {
                if ((x == b[0] + offset.vx) &&
                    (y == b[1] + offset.vy)) {
                    blocked = true;
                    break;
                }
            }
            return blocked;
        },
        isTrigger: (x,y,offset) => {
            let triggers = Helper.getControlByType("trigger");
            for (let t of triggers) {
                let trigloc = Stage.layers.gui.get(t).location;
                if ((x == trigloc[0]+offset.vx) && (y == trigloc[1]+offset.vy) && !Stage.layers.gui.get(t).done) {
                    return t; //parseInt(t);
                }
            }
            return -1;
        },
        checkTrigger: (obj) => {
            CformElements.movable.resetTriggers(obj);
            
            let curpos = new Vector2d(Math.round(obj.origin.vx/obj.gbase.tile.vx), Math.round(obj.origin.vy/obj.gbase.tile.vy)+obj.spriteHeight-1);
            let offset = new Vector2d(Math.round(obj.gbase.origin.vx/obj.gbase.tile.vx), Math.round(obj.gbase.origin.vy/obj.gbase.tile.vy));

            let trigger = CformElements.movable.isTrigger(curpos.vx, curpos.vy, offset);
            if (trigger == -1) return;
            let ctrl = Stage.layers.gui.get(trigger);
            
            // auto is automatically hilited, while user needs button press
            ctrl.hover = true;
            ctrl.redraw = true;
            if (ctrl.action == "auto") {
                // perform actions
                let ret = ctrl.link[0](ctrl.link[1]);
                if (ret == true) Stage.pause = true;
                else Stage.pause = false;
                
                // cleanup trigger
                ctrl.hover = false;
                ctrl.done = true;
                ctrl.redraw = true;
                if ((show_msg != null) || (show_msg != undefined))
                    show_msg("Auto event triggered");
            }
        },
        _draw: (obj) => {
            obj.glSprite.texture = Stage.glManager.getTexture(obj.sprites[obj.spriteSet][0]);
            obj.glSprite.position.set(obj.origin.vx, obj.origin.vy);
        
            if (obj.movFps == 0) {
                obj.glSprite.texture.frame = new PIXI.Rectangle(0,obj.lastdir*obj.rect.h,obj.rect.w,obj.rect.h);
			}
			else {
                obj.glSprite.texture.frame = new PIXI.Rectangle(obj.movCurFrame*obj.rect.w,obj.lastdir*obj.rect.h,obj.rect.w,obj.rect.h);
			}
        },
    };
    CformElements.gridButton = {
        // gridButton is different from the default button in that a button activates at mouseUp/touchEnd
        //      while a gridButton activates at mouseDown/touchStart and deactivates at mouseUp/touchEnd
        //      it also takes two set of links, one for activation and one for deactivation
		_init: (obj, param) => {
			let rect = new Rect(param.x, param.y, (param.w)?param.w:0, (param.h)?param.h:0);
			let sprites = new Array();
			let ret = null;
			if (param.base)
				sprites.push(param.base);
            else 
                sprites.push(Config.activeTheme.menuBase);
			if (param.hover)
				sprites.push(param.hover);
            else 
                sprites.push(Config.activeTheme.menuHover);
			if (param.click)
				sprites.push(param.click);
            else 
                sprites.push(Config.activeTheme.menuClick);
			obj.Create(param.name, rect, sprites);
			if (param.link) obj.link = param.link;
            if (param.linkd) obj.linkd = param.linkd;
			if (param.showText == false) obj.showText = false;
			if (param.hidden != null) obj.hidden = param.hidden;
			if (obj.hidden) obj.visible = false;
		},
		_update: (obj, elapsed) => {
			if (obj.prev_state != obj.state) {
				obj.prev_state = obj.state;
				obj.redraw = true;	
				if ((obj.state == 'hover') || (obj.state == 'click'))
					obj.inputFocus = true;
				else
					obj.inputFocus = false;
			}
            if (obj.link[0] == null) {
                // this is an action button
                try {
                    if (Stage.mouseClick && obj.inputFocus) {
                        let spr = Helper.getControlByType("movable");
                        let sprite = Stage.layers.gui.get(spr[0]);  // only 1 moveable
                        
                        let curpos = new Vector2d(Math.round(sprite.origin.vx/sprite.gbase.tile.vx), 
                                                  Math.round(sprite.origin.vy/sprite.gbase.tile.vy)+sprite.spriteHeight-1);
                        let offset = new Vector2d(Math.round(sprite.gbase.origin.vx/sprite.gbase.tile.vx), 
                                                  Math.round(sprite.gbase.origin.vy/sprite.gbase.tile.vy));
                        let trigger = CformElements.movable.isTrigger(curpos.vx, curpos.vy, offset);
                        if (trigger != -1) {
                            let ctrl = Stage.layers.gui.get(trigger);
                            if (ctrl.action == "user") {
                                // perform actions
                                let ret = ctrl.link[0](ctrl.link[1]);
                                if (ret == true) Stage.pause = true;
                                else Stage.pause = false;
                                if ((show_msg != null) || (show_msg != undefined))
                                    show_msg("User event triggered");
                                
                                // cleanup trigger
                                ctrl.hover = false;
                                ctrl.done = true;
                                ctrl.redraw = true;
                            }
                        }
                    }
                } catch(e) {
                    // do nothing
                }
            }
            else {
                // this is a move button
                if ((Stage.mouseDown || Stage.touchStart) && obj.inputFocus) {
                    if (obj.link != null) {
                        let ret = obj.link[0](obj.link[1]);
                        Stage.pause = (ret == true);
                    }
                    obj.redraw = true;
                } 
                //if (Stage.mouseClick && obj.inputFocus) {
                if ((Stage.mouseUp || Stage.touchEnd || Stage.mouseClick) && obj.inputFocus) {
                    if (obj.linkd != null) {
                        var ret = obj.linkd[0](obj.linkd[1]);
                        Stage.pause = (ret == true);
                    }
                    obj.redraw = true;
                }
            }
		},
		_draw: (obj) => {
			if ((obj.sprites[1]) && (obj.state=='hover'))
				obj.drawImageOrFill(obj.sprites[1]);
			else if ((obj.sprites[2]) && (obj.state=='click'))
				obj.drawImageOrFill(obj.sprites[2]);
			else
				obj.drawImageOrFill(obj.sprites[0]);
		}
    };
    CformElements.alertBox = {
        _init: (obj, param) => {
            let rect = new Rect(param.x, param.y, param.w, param.h);
            let sprites = ["transparent", "rgba(192,192,192,0.5)"];	// hidden, shown
            obj.Create(param.name, rect, sprites);
            obj.showText = false;
            obj.aTimerOn = false;
        },
        _update: (obj, elapsed) => {
            if ((!obj.aTimerOn) && (obj.showText)) {
                obj.aTimer = setTimeout(() => {
                    obj.redraw = true;
                    obj.text = "";
                    obj.showText = false;
                    if (obj.visible) obj.aTimerOn = false;
                }, 2500);	
                obj.aTimerOn = true;
            }  
        },
        _draw: (obj) => {
            obj.drawImageOrFill(obj.showText?obj.sprites[1]:obj.sprites[0]);
        },
    };
});