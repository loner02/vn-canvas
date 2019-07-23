///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";
//require(["app/vncanvas-img", "app/vncanvas-vars"]);

///////////////////////////////////////////////////////////////////////////////
// Local Helpers
///////////////////////////////////////////////////////////////////////////////
require(["app/vncanvas-base"], function() {
	// Helper function to display readable time
	Helper.convertTime = ((val) => {
		let sec = val % 60;
		let min = (val - sec) / 60;
		min %= 60;
		let hr = (val - sec - 60*min) / 3600;
		if (hr > 0)
			return (hr.toString() + ':' + ((min<10)?'0':'') + min.toString() + ':' + ((sec<10)?'0':'') + sec.toString());
		else
			return (min.toString() + ':' + ((sec<10)?'0':'') + sec.toString());
	});
	// Helper function to get control index given dialog id
    // WebGL changed: returns control, not index
	Helper.getControl = ((id) => {
        if (Stage.layers.gui.get("rb_"+id)) return Stage.layers.gui.get("rb_"+id);
        if (Stage.layers.gui.get("tb_"+id)) return Stage.layers.gui.get("tb_"+id);
        return Stage.layers.gui.get(id);
    });
    Helper.getControlById = ((id) => {
        return Stage.layers.gui.get(id);
    })
    // WebGL changed: returns array of keys
    Helper.getControlByType = ((type) => {
        let ctrlArray = new Array();
        for (let [key, control] of Stage.layers.gui) {
            if (control.type == type)
                ctrlArray.push(key);
        }
        return ctrlArray;
    });
    Helper.getControlByGroup = ((group) => {
        let ctrlArray = new Array();
        for (let [key, control] of Stage.layers.gui) {
            if (control.group == group)
                ctrlArray.push(key);
        }
        return ctrlArray;
    })
});

///////////////////////////////////////////////////////////////////////////////
// Canvas Form elements plug-ins
///////////////////////////////////////////////////////////////////////////////
// button - create a canvas button (layer 4), independent of cform
function button(param) {
    if (Stage.layers.gui[param.name]) return;
    let bt = null;
    if ((/toggle/i.test(param.name)) || (/tb_/i.test(param.name)))
        bt = new Toggle(param);
    else if ((/radio/i.test(param.name)) || (/rb_/i.test(param.name)))
        bt = new Radio(param);
    else
        bt = new Button(param);
    bt.saveparam = param;
    Stage.layers.gui.set(param.name, bt);
}
// picture - create a canvas form animated image (layer 4)
function picture(param) {
    if (Stage.layers.gui[param.name]) return;
    let pic = new Picture(param);
    pic.saveparam = param;
    Stage.layers.gui.set(param.name, pic);
}
// marquee - create a canvas form animated text (layer 4)
function marquee(param) {
    if (Stage.layers.gui[param.name]) return;
    let mq = null;
	if ((/timer/i.test(param.name)) || (/tm_/i.test(param.name)))
        mq = new Timer(param);
    else
        mq = new Marquee(param);
	mq.saveparam = param;
    Stage.layers.gui.set(param.name, mq);
}
// notepad - create a canvas form text area (layer 4)
function notepad(param) {
    if (Stage.layers.gui[param.name]) return;
    let txta = new Textarea(param);
    txta.saveparam = param;
    Stage.layers.gui.set(param.name, txta);
}
// timer - create a canvas form timer (layer 4)
// removed as of v.0.3.1, added stub for compatibility
function timer(param) {
	marquee(param);
}
// cfelement - create a custom cform element
function cfelement(param) {
    if (Stage.layers.gui[param.name]) return;
	let e = new Element(param);
	e.saveparam = param;
    Stage.layers.gui.set(param.name, e);
}

// form - container for canvas form elements such as buttons (layer 4)
function cform(param) {
    if (typeof param == 'string') {
        let formid = null;
        switch (param) {
            case 'close':
                formid = Stage.formStack.pop();
                let count=0;
                for (let [key, control] of Stage.layers.gui.entries()) {
                    if (control.group == formid.group) {
                        for (let i in control.sprites) {
                            if (control.sprites.hasOwnProperty(i)) {
                                Stage.glManager.free(control.sprites[i]);
                            }
                        }
                        control.glImage.destroy();
                        Stage.layers.gui.delete(key);
                        count++;
                    }
                }
                if (loaderWorkaround) {
                    // remove sequence insert
                    if (count > 0) {
                        let sequence = eval(formid.sequence);
                        if (sequence != null) {
                            // sequence is in memory, verify cform elements inserted in sequence
                            let validate = false, start=0, found=0;
                            for (let i=0; i<sequence.length; i+=2) {
                                if ((sequence[i] == cform) && (sequence[i+1][0] == formid.group))
                                    start = i;
                                else if ((sequence[i] == menu) && (sequence[i+1][0] == formid.group))
                                    start = i;
                                else if ((sequence[i+1].group == formid.group) && (start>0))
                                    found++;
                            }
                            if ((start>0) && (found == count)) validate = true;
                            if (validate) {
                                //let lines = ((sequence[start]==cform) && (sequence[start+1][1]==false)) ? 2*count : 2*count+2;
                                let lines = 2*count+2;
                                Stage.script.remove(formid.sequence, start+2, lines);
                            }
                        }
                        else {
                            // sequence not present in memory
                            // therefore it should be loaded from file unmodified
                        }
                    }
                }
                break;
            case 'hide':
                formid = Stage.formStack[Stage.formStack.length-1];
                for (let [key, control] of Stage.layers.gui.entries()) {
                    if (control.group == formid.group) {
                        // hide only those visible
                        if (control.visible) control.hidden = true;
                        //control.hidden = true;
                        //control.visible = false;
                        control.inputFocus = false;
                        control.redraw = true;
                        if (control.aTimerOn) {
                            control.aTimerOn = false;
                            clearTimeout(control.aTimer);
                        }
                    }
                }
                break;
            case 'show':
                formid = Stage.formStack[Stage.formStack.length-1];
                for (let [key, control] of Stage.layers.gui.entries()) {
                    if (control.group == formid.group) {
                        // show only those hidden
                        if (control.hidden) control.hidden = false;
                        //control.hidden = false;
                        //control.visible = true;
                        //control.inputFocus = true;
                        if (control.id == '--dummy--')
                            control.inputFocus = true;
                        control.redraw = true;
                        if (control.callTimer)
                            control.callTimer();
                    }
                }
                break;
            case 'default':
				if (Config.activeTheme.formFontStyle) {
                    // revert back to default style
					Stage.formStyle.splice(0, Stage.formStyle.length);
					let subs = Helper.parseFontString(Config.activeTheme.formFontStyle);
                    subs.forEach(s => {Stage.formStyle.push(s)});
				}
                break;
            default:
                for (let i in Stage.formStack) {
                    if (Stage.formStack[i].group == param) {
                        // put on top of stack
                        let tmp = Stage.formStack.slice(i,1);
                        Stage.formStack.splice(i,1);
                        Stage.formStack.push(tmp);
                        // then show it
                        for (let [key, control] of Stage.layers.gui.entries()) {
                            if (control.group == param) {
                                if (control.hidden) control.hidden = false;
                                //control.hidden = false;
                                //control.visible = true;
                                //control.inputFocus = true;
                                if (control.id == '--dummy--')
                                    control.inputFocus = true;
                                control.redraw = true;
                            }
                        }
                        return;
                    }
                }
                // else assume this is a formStyle
                Stage.formStyle.splice(0, Stage.formStyle.length);
                let subs = Helper.parseFontString(param);
                subs.forEach(s => {Stage.formStyle.push(s)});
                break;
        }
    }
    else {
        for (let i in Stage.formStack) {
            if (Stage.formStack[i].group == param[0]) {
                let skip = 0;
                for (let [key, control] of Stage.layers.gui.entries()) {
                    if (control.group == param[0]) {
                        // TODO: fix this!!
                        //control.visible = !control.hidden ? true : false;
                        control.visible = !control.hidden;
                        if (!Config.modRPG)
                            control.hidden = false;
                        // control.inputFocus = true;
                        if (control.id == '--dummy--')
                            control.inputFocus = true;
                        control.redraw = true;
                        skip += 2;
                    }
                }
                Stage.pause = param[1];
                if (loaderWorkaround)
                    Stage.script.frame += skip + (param[1]?2:0);
                return;
            }
        }
        let form = {group:param[0], sequence:Stage.script.sequence[1]};
        Stage.formStack.push(form);
        // TODO: PIXI bug: loader can't handle subsequent calls
        // - Default: preload all resources before showing form
        // - Workaround: change cform element calls to sequence insert
        //let loaderWorkaround = false;
        if (loaderWorkaround) {
            let newLines = new Array();
            for (let i=2; i<param.length; i+=2) {
                newLines.push(param[i]);
                param[i+1].group = param[0];
                newLines.push(param[i+1]);
            }
            if (param[1] == true) { // modal form
                // add hidden button that will take the input focus
                newLines.push(button);
                newLines.push({name:"--dummy--", x:0, y:0, w:1, h:1, base:'transparent', showText:false, group:param[0],
                                focus:true, state:'base'});
                // and pause the stage
                newLines.push(wait);
                newLines.push(0);
            }
            Stage.script.insert(newLines);
        }
        else {
            // preload all resources first
            let resArray = new Set();
            for (let i=2; i<param.length; i+=2) {
                if (param[i+1].base) resArray.add(param[i+1].base);
                if (param[i+1].hover) resArray.add(param[i+1].hover);
                if (param[i+1].click) resArray.add(param[i+1].click);
                if (param[i+1].frames) 
                    param[i+1].frames.forEach(f => { resArray.add(f); });
            }
            if (resArray.size > 0) {
                let toLoad = new Array();
                resArray.forEach(r => {
                    if (!Stage.glManager.hasLoaded(r)) {
                        if (Helper.checkIfImage(r)) toLoad.push(r);
                    }
                });
                //if (toLoad.length > 0) {
                    // directly load instead of going to update queue
                    Stage.pause = true;
                    Stage.glManager.glLoader
                        .add(toLoad)
                        .load((loader, resources) => {
                            for (let i=2; i<param.length; i+=2) {
                                param[i+1].group = param[0];
                                param[i](param[i+1]);
                            }
                            if (param[1]) {
                                button({name:'--dummy--', x:0, y:0, w:1, h:1, base:"rgba(0,0,0,0)", showText:false, group:param[0]});
                                Helper.getControl('--dummy--').inputFocus = true;
                            }
                            Stage.pause = param[1];
                        });
                        //.on("progress", (loader, resource) => { console.log(`[PIXI]: loading: ${resource.url}`)});
                //}
                    
            }
            else {
                // no resources to preload
                for (let i=2; i<param.length; i+=2) {
                    param[i+1].group = param[0];
                    param[i](param[i+1]);
                }
                if (param[1]) {
                    button({name:'--dummy--', x:0, y:0, w:1, h:1, base:"rgba(0,0,0,0)", showText:false, group:param[0]});
                    Helper.getControl('--dummy--').inputFocus = true;
                }
                Stage.pause = param[1];
            }
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
// Selectable/clickable image; base class for buttons, imagemaps, etc.
///////////////////////////////////////////////////////////////////////////////
class ActiveImage {
    constructor() {
        this.isready = false,
        this.redraw = true,
        //this.loaded = 0,
        this.update = false,

        this.type = '';
        this.id = '';
        this.group = '';
        this.sprites = {};
        this.inputFocus = false;
        this.link = null;
        this.rect = new Rect(0, 0, 0, 0);
        this.visible = true;
        this.state = '';
        this.prev_state = '',
        this.saveparam = {};
        
        this.fps = 0;
        this.timeout = 0;
        //this.countup = 0;
        this.aTimer = 0;
        this.aTimerOn = false;
      
        this.hidden = false;
        this.scale = [1,1];
        
        this.glImage = new PIXI.Container();            // WebGL new
        this.glBack = new PIXI.Graphics();
        this.glSprite = new PIXI.Sprite();              // Graphics or Sprite
        this.glImage.addChild(this.glBack);
        this.glImage.addChild(this.glSprite);
        this.glSubScene = Stage.glSubScene[4];
        this.loadSet = new Set();
    }
    Create(id, rect, objects) {
        this.id = id;
        let ret = Helper.findVar(id);
        this.text = ret ? ret : id;
        this.rect = rect;
        
        // obj can be any mix of images and/or colors
        this.sprites = objects;
        let texCount = this.toLoad(objects);
        Stage.glManager.addQueue(this.loadSet, texCount>0, 
            (resources, init) => {
                this.isLoaded(resources, init);
            }
        );
    }
    toLoad(objects) {
        this.loadSet.clear();
        for (let i in objects) {
            if (objects.hasOwnProperty(i)) {
                if ((typeof objects[i] == 'string') /*&& Helper.checkIfImage(objects[i])*/)
                    this.loadSet.add(objects[i]);
                else //assume [image, frame, fps]
                    this.loadSet.add(objects[i][0]);
            }
        }
        return this.loadSet.size;
    }
    isLoaded(resources, init) {
        // look for image in sprite set and set default size
        for (let i in this.sprites) {
            if (this.sprites.hasOwnProperty(i)) {
                if ((typeof this.sprites[i] == 'string') && Helper.checkIfImage(this.sprites[i])) {
                    let base = resources[this.sprites[i]].texture;
                    this.rect.w = base.width;
                    this.rect.h = base.height;
                    break;  // assume all sprites of same size
                }
                else if ((typeof this.sprites[i][0] == 'string') && Helper.checkIfImage(this.sprites[i][0])) {
                    //assume [image, frame, fps], spriteset of 4 directions
                    let base = resources[this.sprites[i][0]].texture;
                    this.rect.w = base.width/this.sprites[i][1];
                    this.rect.h = base.height/4;
                    break;  // assume all sprites of same size
                }
                else {
                    // not an image
                    // rect already sets size
                }
            }
        }
        
        this.glSubScene.addChild(this.glImage);
        this.isready = true;       
    }
    Update(elapsed) {
        //if (this.hidden) this.visible = false;
        this.visible = !this.hidden;
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
// Button class
///////////////////////////////////////////////////////////////////////////////
class Button extends ActiveImage {
    constructor(param) {
        super();
        this.type = 'button';
        this.text = '';
        this.showText = true;
        this.align = 'center';
        this.tooltip = '';
        this.on = false;

        this.glText = new PIXI.Text();
        this.glTip = new PIXI.Graphics();
        this.glTipText = new PIXI.Text();
        this.glTip.addChild(this.glTipText);
        this.glImage.addChild(this.glText);
        this.glImage.addChild(this.glTip);
        
        let rect = new Rect(param.x, param.y, (param.w)?param.w:0, (param.h)?param.h:0);
        let sprites = {};
        let ret = null;
        if (param.base) {
            ret = Helper.findVar(param.base);
            if (ret) sprites["base"] = ret;
            else sprites["base"] = param.base;
        }
        else sprites["base"] = Config.activeTheme.menuBase;
        if (param.hover) {
            ret = Helper.findVar(param.hover);
            if (ret) sprites["hover"] = ret;
            else sprites["hover"] = param.hover;
        }
        else sprites["hover"] = Config.activeTheme.menuHover;
        if (param.click) {
            ret = Helper.findVar(param.click);
            if (ret) sprites["click"] = ret;
            else sprites["click"] = param.click;
        } 
        else sprites["click"] = Config.activeTheme.menuClick;
        
        super.Create(param.name, rect, sprites);

        if (param.group) this.group = param.group;
        if (param.link) this.link = param.link;
        if (param.showText == false) this.showText = false;
        if (param.align) this.align = param.align;
        if (param.tip) this.tooltip = param.tip;
        if (param.hidden) this.hidden = param.hidden;
        if (param.scale) this.scale = param.scale;
        if (this.hidden) this.visible = false;
        
        // hidden parameters
        if (param.focus) this.inputFocus = param.focus;
        if (param.state) { 
            this.prev_state = param.state;
            this.state = param.state;
        }
    }
    isLoaded(resources, init) {
        this.state = 'base';
        super.isLoaded(resources, init);
    }
    showTooltip() {
        let style = new PIXI.TextStyle();
        let subs = Helper.parseFontString(Config.activeTheme.formTipStyle);
        [style.fontStyle, style.fontSize, style.fontFamily, style.fill] = subs;
        this.glTipText.style = style;
        this.glTipText.text = this.tooltip;
        this.glTipText.position.x = 5;
        
        let w = this.glTipText.width+10, h = parseInt(subs[1])+4, 
            x = Math.min(Stage.coord.vx, Stage.canvas.width - w - 5),
            y = Math.max(Stage.coord.vy-12, 2*h + 5);
        this.glTip.clear();
        let col = w3color(Config.activeTheme.formTipColor);
        this.glTip.beginFill(col.toVal(), col.toRgb().a);
        this.glTip.drawRect(0, 0, w,  h);
        this.glTip.endFill();
        this.glTip.position.set(x,y);
        this.glTip.alpha = 1.0;
        this.redraw = true;
    }
    hideTooltip() {
        this.glTip.alpha = 0.0;
        this.redraw = true;
    }
    setText() {
        let ret = Helper.findVar(this.id);
        //this.text = ret ? ret : this.id;
        if (ret) this.text = ret;
    }
    checkClicked() {
        if (Stage.mouseClick && this.inputFocus) {
            if (this.link != null) {
                let ret = this.link[0](this.link[1], (this.link[2]?this.link[2]:false));
                //Stage.pause = (this.link && (this.link[0] == set)) || (ret == true);
                Stage.pause = (ret == true);
            }
        }
    }
    setTexture(texture) {
        if (Helper.checkIfImage(texture)) {
            this.glSprite.texture = Stage.glManager.getTexture(texture);
            this.glBack.alpha = 0.0;
            this.glSprite.alpha = 1.0;
        }
        else {
            this.glBack.clear();
            // support button as border
            if (texture == 'border') {
                let x=0, y=0, r=5, w=this.rect.w, h=this.rect.h;
                let col = w3color(Config.activeTheme.menuHover);
                this.glBack.beginFill(col.toVal(), 0);
                this.glBack.lineStyle(2,col.toVal(),1);
                //this.glBack.drawRoundedRect(0, 0, this.rect.w, this.rect.h);
                this.glBack.moveTo(x+r, y);
                this.glBack.lineTo(w-r, y);
                this.glBack.quadraticCurveTo(w, y, w, y+r);
                this.glBack.lineTo(w, h-r);
                this.glBack.quadraticCurveTo(w, h, w-r, h);
                this.glBack.lineTo(x+r, h);
                this.glBack.quadraticCurveTo(x, h, x, h-r);
                this.glBack.lineTo(x, y+r);
                this.glBack.quadraticCurveTo(x, y, x+r, y);
                this.glBack.endFill();
            }
            else {
                let col = w3color(texture);
                this.glBack.beginFill(col.toVal(), col.toRgb().a);
                this.glBack.drawRect(0, 0, this.rect.w,  this.rect.h);
                this.glBack.endFill();
            }
            this.glBack.position.set(0,0);
            this.glBack.alpha = 1.0;
            this.glSprite.alpha = 0.0;
        }
    }
    Update(elapsed) {
        if (!this.visible)
            this.inputFocus = false;
        else {
            if (Helper.checkMapAccess(this.group, this.id)) {
                if (this.prev_state != this.state) {
                    // TODO: there is a change of state here, play indicative sound
                    if ((this.prev_state=='base') && (this.state=='hover')) {
                        //play hover entry sound once
                        if (Config.activeTheme.seHover) audio({se:Config.activeTheme.seHover});
                        //console.log('[VNC]: play hover entry');
                    }
                    else if (this.state=='click') {
                        //play click sound once
                        if (Config.activeTheme.seClick) audio({se:Config.activeTheme.seClick});
                        console.log('[VNC]: play click once');
                    }
                    this.prev_state = this.state;
                    this.redraw = true;
                    if ((this.state=='hover') || (this.state=='click')) {
                        this.inputFocus = true;
                        if (this.tooltip != '') Stage.Transition(1.0);
                    }
                    else if (!this.id.includes('--dummy--'))
                        this.inputFocus = false;
                    this.setTexture(this.sprites[this.state]);
                }
                if (this.showText) {
                    this.setText();
                    if (this.text != this.glText.text) {
                        let style = new PIXI.TextStyle();
                        [style.fontStyle, style.fontSize, style.fontFamily, style.fill] = Stage.formStyle;
                        style.align = this.textAlign;
                        this.glText.style = style;
                        this.glText.text = this.text;

                        this.glText.alpha = 1.0;
                        this.glText.anchor.set(0,0.5);
                    }
                }
                else
                    this.glText.alpha = 0.0;
                this.checkClicked();
            }
        }
        return super.Update(elapsed);
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
        
        this.glImage.visible = this.visible;
        if (this.visible) {
            this.glBack.position.set(this.rect.x, this.rect.y);
            this.glBack.scale.set(this.scale[0], this.scale[1]);
            this.glSprite.position.set(this.rect.x, this.rect.y);
            this.glSprite.scale.set(this.scale[0], this.scale[1]);
            if (this.align == 'center') {
                this.glText.anchor.x = 0.5;
                this.glText.position.set(this.rect.x+this.rect.w/2, this.rect.y+this.rect.h/2);
            }
            else if (this.align == 'right') {
                this.glText.anchor.x = 1.0;
                this.glText.position.set(this.rect.x+this.rect.w, this.rect.y+this.rect.h/2);
            }
            else{
                this.glText.anchor.x = 0;
                this.glText.position.set(this.rect.x, this.rect.y+this.rect.h/2);
            }
        }
        return super.Draw();
    }
}
///////////////////////////////////////////////////////////////////////////////
// Toggle class
///////////////////////////////////////////////////////////////////////////////
class Toggle extends Button {
    constructor(param) {
        super(param);
        this.type = 'toggle';
        let name = this.id.replace(/toggle/i,'').replace(/tb_/i,'');
        let ret = Helper.findVar(name);
        this.text = ret ? ret : name;
        this.on = (param.on !== undefined)? param.on : false;
        this.reset = (param.reset) ? param.reset : false;
    }
    setText() {
        let name = this.id.replace(/toggle/i,'').replace(/tb_/i,'');
        let ret = Helper.findVar(name);
        //this.text = ret ? ret : name;
        if (ret) this.text = ret;
    }
    checkClicked() {
        if ((Stage.mouseClick && this.inputFocus) || 
            (this.reset && this.on)) {
            if ((this.link != null) && !this.reset) {
                let ret = this.link[0](this.link[1], (this.link[2]?this.link[2]:false));
                //Stage.pause = (this.link && (this.link[0] == set)) || (ret == true);
                Stage.pause = (ret == true);
            }
            // swap base and click images
            let base = this.sprites['base'];
            let click = this.sprites['click'];
            this.sprites['base'] = click;
            this.sprites['click'] = base;
            if (this.on) this.reset = false;
            this.on = !this.on;
            this.setTexture(this.sprites[this.state]);
            this.redraw = true;
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
// Radio class
///////////////////////////////////////////////////////////////////////////////
class Radio extends Button {
    constructor(param) {
        super(param);
        this.type = 'radio';
        let name = this.id.replace(/radio/i,'').replace(/rb_/i,'');
        let ret = Helper.findVar(name);
        this.text = ret ? ret : name;
        this.on = (param.on !== undefined)? param.on : false;
        this.reset = false;
    }
    setText() {
        let name = this.id.replace(/radio/i,'').replace(/rb_/i,'');
        let ret = Helper.findVar(name);
        //this.text = ret ? ret : name;
        if (ret) this.text = ret;
    }
    checkClicked() {
        if ((Stage.mouseClick && this.inputFocus) || 
            this.reset) {
            if ((this.link != null) && !this.reset) {
                let ret = this.link[0](this.link[1], (this.link[2]?this.link[2]:false));
                //Stage.pause = (this.link && (this.link[0] == set)) || (ret == true);
                Stage.pause = (ret == true);
            }
            // swap base and click images
            if (!this.reset || this.on) {
                let base = this.sprites['base'];
                let click = this.sprites['click'];
                this.sprites['base'] = click;
                this.sprites['click'] = base;
                this.on = !this.on;
                this.setTexture(this.sprites[this.state]);
                this.redraw = true;
            }
            
            if (!this.reset) {
                for (let [key, control] of Stage.layers.gui) {
                    if ((control.type == 'radio') && (control.group = this.group))
                        if ((control.id != this.id) && control.on) {
                            control.reset = true;
                            control.prev_state = ''; // invalidate
                        }
                }
            }
            this.reset = false;
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
// Picture class
///////////////////////////////////////////////////////////////////////////////
class Picture extends ActiveImage {
    constructor(param) {
        super();
        this.type = 'picture';
        this.showText = false;
        this.tooltip = '';
        this.fps = (param.fps>0) ? param.fps : 1;
        this.count = -1;

        let rect = new Rect(param.x, param.y, 0, 0);
        let sprites = {};
        let ret = null;
        for (let i in param.frames) {
            ret = Helper.findVar(param.frames[i]);
            if (ret != null) sprites[i] = ret;
            else sprites[i] = param.frames[i];
        }
        
        super.Create(param.name, rect, sprites);
        if (param.scale) this.scale = param.scale;
        this.glBack.alpha = 0;
        this.glSprite.alpha = 1.0;
        if (param.group) this.group = param.group;
    }
    callTimer() {
        let len = Object.keys(this.sprites).length;
        this.aTimer = setTimeout(() => {
            this.count = (++this.count) % len;
            this.glSprite.texture = Stage.glManager.getTexture(this.sprites[this.count]);
            this.redraw = true;
            if (this.visible) this.aTimerOn = false;
        }, 1000/this.fps);
        this.aTimerOn = true;
    }
    Update(elapsed) {
        if (this.isready) {
            if (!this.visible)
                this.inputFocus = false;
            else {
                if (Object.keys(this.sprites).length > 1) {
                    if (!this.aTimerOn)
                        this.callTimer();
                }
                else {
                    this.glSprite.texture = Stage.glManager.getTexture(this.sprites[0]);
                    this.redraw = true;
                }
            }
        }
        return super.Update(elapsed);
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
        
        this.glImage.visible = this.visible;
        if (this.visible) {
            this.glSprite.position.set(this.rect.x, this.rect.y);
        }
        return super.Draw();
    }
}
///////////////////////////////////////////////////////////////////////////////
// Marquee class
///////////////////////////////////////////////////////////////////////////////
class Marquee extends ActiveImage {
    constructor(param) {
        super();
        this.type = 'marquee';
        this.fps = (param.fps>1) ? param.fps : 1;
        this.count = -1;
        this.align = (param.align) ? param.align : 'center';
        
        let rect = new Rect(param.x, param.y, param.w, param.h);
        super.Create(param.name, rect, null);
        this.sprites = {};
        for (let i in param.frames)
            this.sprites[i] = param.frames[i];
        
        this.glText = new PIXI.Text();
        this.glImage.addChild(this.glText);
        this.glSprite.alpha = 0;

        let style = new PIXI.TextStyle();
        [style.fontStyle, style.fontSize, style.fontFamily, style.fill] = Stage.formStyle;
        style.align = this.align;
        this.glText.style = style;

        this.glBack.clear();
        let col = w3color(Config.activeTheme.menuBase);
        this.glBack.beginFill(col.toVal(), col.toRgb().a);
        this.glBack.drawRect(0, 0, this.rect.w,  this.rect.h);
        this.glBack.endFill();
        this.glBack.position.set(0,0);
        this.glBack.alpha = 1.0;
        if (param.group) this.group = param.group;
    }
    callTimer() {
        let len = Object.keys(this.sprites).length;
        this.aTimer = setTimeout(() => {
            this.count = (++this.count) % len;
            this.glText.text = this.sprites[this.count];
            this.redraw = true;
            if (this.visible) this.aTimerOn = false;
        }, 1000/this.fps);
        this.aTimerOn = true;
    }
    Update(elapsed) {
        if (this.isready) {
            if (!this.visible)
                this.inputFocus = false;
            else {
                let len = Object.keys(this.sprites).length;
                if (!this.aTimerOn && (len > 1)) {
                    this.callTimer();
                }
            }
        }
        return super.Update(elapsed);
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
        
        this.glImage.visible = this.visible;
        if (this.visible) {
            this.glBack.position.set(this.rect.x, this.rect.y);
            if (this.align == 'center') {
                this.glText.anchor.set(0.5,0.5);
                this.glText.position.set(this.rect.x+this.rect.w/2, this.rect.y+(this.rect.h>>1));
            }
            else if (this.align == 'right') {
                this.glText.anchor.set(1.0,0.5);
                this.glText.position.set(this.rect.x+this.rect.w, this.rect.y+(this.rect.h>>1));
            }
            else{
                this.glText.anchor.set(0.0,0.5);
                this.glText.position.set(this.rect.x, this.rect.y+(this.rect.h>>1));
            }
        }
        return super.Draw();
    }
}
///////////////////////////////////////////////////////////////////////////////
// Timer class
///////////////////////////////////////////////////////////////////////////////
class Timer extends ActiveImage {
    constructor(param) {
        super();
        this.type = 'timer';
        this.fps = 1;
        if (param.timeout) this.timeout = param.timeout;
        if (param.link) this.link = param.link;
        this.align = (param.align) ? param.align : 'center';
        this.count = !(this.timeout > 0);
        
        let rect = new Rect(param.x, param.y, param.w, param.h);
        super.Create(param.name, rect, null);
        // create a user variable named param.name
        let val = Helper.findVar(escape(param.name));
        if (val != null)
            Stage.variables.get(escape(param.name)).value = this.timeout;
        else {
            let uv = new UserVars();
            uv.value = this.timeout;
            uv.persist = false;
            Stage.variables.set(escape(param.name), uv);
        }
        
        this.glText = new PIXI.Text();
        this.glImage.addChild(this.glText);
        this.glSprite.alpha = 0;

        let style = new PIXI.TextStyle();
        [style.fontStyle, style.fontSize, style.fontFamily, style.fill] = Stage.formStyle;
        style.align = this.align;
        this.glText.style = style;

        this.glBack.clear();
        let col = w3color(Config.activeTheme.menuBase);
        this.glBack.beginFill(col.toVal(), col.toRgb().a);
        this.glBack.drawRect(0, 0, this.rect.w,  this.rect.h);
        this.glBack.endFill();
        this.glBack.position.set(0,0);
        this.glBack.alpha = 1.0;
        if (param.group) this.group = param.group;
    }
    callTimer() {
        this.aTimer = setTimeout(() => {
            let counter = Stage.variables.get(this.id);
            counter.value = (this.count) ? counter.value+1 : counter.value-1;
            this.glText.text = Helper.convertTime(counter.value);
            this.redraw = true;
            
            if (!this.count) {
                if (counter.value > 0) {
                    if (this.visible) this.aTimerOn = false;
                }
                else {
                    if (this.link != null) {
                        this.link[0](this.link[1]);
                        Stage.pause = false;
                    }
                }
            }
            else {
                if (this.visible) this.aTimerOn = false;
            }
        }, 1000/this.fps);
        this.aTimerOn = true;
    }
    Update(elapsed) {
        if (this.isready) {
            if (!this.visible)
                this.inputFocus = false;
            else {
                if (!this.aTimerOn) {
                    this.callTimer();
                }
            }
        }
        return super.Update(elapsed);
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
        
        this.glImage.visible = this.visible;
        if (this.visible) {
            this.glBack.position.set(this.rect.x, this.rect.y);
            if (this.align == 'center') {
                this.glText.anchor.set(0.5,0.5);
                this.glText.position.set(this.rect.x+this.rect.w/2, this.rect.y+(this.rect.h>>1));
            }
            else if (this.align == 'right') {
                this.glText.anchor.set(1.0,0.5);
                this.glText.position.set(this.rect.x+this.rect.w, this.rect.y+(this.rect.h>>1));
            }
            else{
                this.glText.anchor.set(0.0,0.5);
                this.glText.position.set(this.rect.x, this.rect.y+(this.rect.h>>1));
            }
        }
        return super.Draw();
    }
}
///////////////////////////////////////////////////////////////////////////////
// WIP: TextArea class
///////////////////////////////////////////////////////////////////////////////
class Textarea extends Button {
    constructor(param) {
        super(param);
        this.type = 'textarea';
        if (param.text) this.text = param.text;
        this.offset = (param.offset) ? param.offset : 0;
    }
    Update(elapsed) {
        let ret = super.Update(elapsed);
        if (this.visible && this.showText) {
            this.glText.style.wordWrap = true;
            this.glText.style.wordWrapWidth = this.rect.w;
        }
        return ret;
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;

        let ret = super.Draw();
        this.glText.anchor.y = 0;
        this.glText.position.y = this.rect.y+this.offset;
        this.glText.position.x = this.rect.x+5;
        return ret;
    }
}
///////////////////////////////////////////////////////////////////////////////
// Custom form element class
///////////////////////////////////////////////////////////////////////////////
class Element extends ActiveImage {
    constructor(param) {
        super();
        this.type = param.type;
        this.glFrames = new PIXI.Container();
        CformElements[this.type]._init(this, param);

        // default ActiveImage class does not have text
        // add one here for cfelement to be more flexible (hidden by default)
        this.showText = (param.showText) ? param.showText:false;
        this.align = param.align ? param.align : 'center';
        this.text = param.name;
        this.scale = [1,1];

        this.glImage.addChild(this.glFrames);

        this.glMask = new PIXI.Graphics();
        this.glMask.beginFill(0xFFFFFF);
        this.glMask.drawRect(0, 0, this.rect.w, this.rect.h);
        this.glMask.endFill();
        this.glMask.position.set(this.rect.x, this.rect.y);
        this.glImage.addChild(this.glMask);

        this.glText = new PIXI.Text();
        this.glText.mask = this.glMask;
        this.glImage.addChild(this.glText);
        let style = new PIXI.TextStyle();
        [style.fontStyle, style.fontSize, style.fontFamily, style.fill] = Stage.formStyle;
        style.align = this.align;
        this.glText.style = style;
        if (param.group) this.group = param.group;
    }
    Create(id, rect, obj) {
        let sprites = {};
        for (let i in obj)
            sprites[i] = obj[i];
        super.Create(id, rect, sprites);
    }
    isLoaded(resources, init) {
        super.isLoaded(resources, init);
    }
    Update(elapsed) {
        if (this.isready) {
            if (!this.visible)
                this.inputFocus = false;
            else
                CformElements[this.type]._update(this, elapsed);
                // TODO: reposition and resize update
        }
        return super.Update(elapsed);
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
        //if (this.visible == this.hidden)
        //    this.visible = !this.hidden;
            
        this.glImage.visible = this.visible;
        if (this.visible) {
            CformElements[this.type]._draw(this);
            if (this.showText && (this.text != '')) {
                this.glText.alpha = 1;
                this.glText.text = this.text;
                if (this.align == 'center') {
                    this.glText.anchor.set(0.5,0.5);
                    this.glText.position.set(this.rect.x+this.rect.w/2, this.rect.y+(this.rect.h>>1));
                }
                else if (this.align == 'right') {
                    this.glText.anchor.set(1.0,0.5);
                    this.glText.position.set(this.rect.x+this.rect.w, this.rect.y+(this.rect.h>>1));
                }
                else{
                    this.glText.anchor.set(0.0,0.5);
                    this.glText.position.set(this.rect.x, this.rect.y+(this.rect.h>>1));
                }
            }
            else {
                this.glText.alpha = 0;
            }
            // TODO: link
        }
        return super.Draw();
    }
    getObjectCount() {
        let count = 0;
        for (let i in this.sprites)
            if (this.sprites.hasOwnProperty(i)) count++;
        return count;
    }
    getObject(index) {
        return this.glFrames.getChildAt(index);
    }
    drawObject(index, rect) {
        let obj = this.glFrames.getChildAt(index);
        obj.alpha = 1.0;
        obj.position.set(rect.x, rect.y);
        obj.width = rect.w;
        obj.height = rect.h;
    }
    addObjectsToFrames() {
        if (!this.isready) return false;
        for (let i in this.sprites) {
            if (this.sprites.hasOwnProperty(i)) {
                if (Helper.checkIfImage(this.sprites[i])) {
                    let s = new PIXI.Sprite();
                    s.texture = Stage.glManager.getTexture(this.sprites[i]);
                    this.glFrames.addChild(s);
                }
                else {
                    let s = new PIXI.Graphics();
                    let col = w3color(this.sprites[i]);
                    s.beginFill(col.toVal(), col.toRgb().a);
                    s.drawRect(0, 0, this.rect.w,  this.rect.h);
                    s.endFill();
                    this.glFrames.addChild(s);
                }
            }
        }
        return true;
    }
    drawImageOrFill(texture, size = 1) {
        if (Helper.checkIfImage(texture)) {
            this.glSprite.texture = Stage.glManager.getTexture(texture);
            this.glBack.alpha = 0.0;
            this.glSprite.alpha = 1.0;
            this.glSprite.position.set(this.rect.x, this.rect.y);
            this.glSprite.width = size*this.scale[0]*this.rect.w;
            this.glSprite.height = size*this.scale[1]*this.rect.h;
            this.glMask.position.set(this.rect.x, this.rect.y);
            this.glMask.width = size*this.scale[0]*this.rect.w;
            this.glMask.height = size*this.scale[1]*this.rect.h;
        }
        else {
            this.glBack.clear();
            let col = w3color(texture);
            this.glBack.beginFill(col.toVal(), col.toRgb().a);
            this.glBack.drawRect(0, 0, this.rect.w,  this.rect.h);
            this.glBack.endFill();
            //this.glBack.position.set(0,0);
            this.glBack.alpha = 1.0;
            this.glBack.position.set(this.rect.x, this.rect.y);
            this.glBack.width = size*this.scale[0]*this.rect.w;
            this.glBack.height = size*this.scale[1]*this.rect.h;
            this.glMask.position.set(this.rect.x, this.rect.y);
            this.glMask.width = size*this.scale[0]*this.rect.w;
            this.glMask.height = size*this.scale[1]*this.rect.h;
            this.glSprite.alpha = 0.0;
        }
    }
}

var CformElements = {};
var loaderWorkaround = false;   // don't use PixiJS loader workaround