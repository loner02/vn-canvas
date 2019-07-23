///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";
require(["app/vncanvas-vars"]);

///////////////////////////////////////////////////////////////////////////////
// Checkpoint - loads/saves at a given checkpoint
///////////////////////////////////////////////////////////////////////////////
require(["app/vncanvas-base"], function() {
    Helper.saveCheckpoint = ((chkpt) => {
        // Store script entry point
        if (Stage.script.sequence[0] == label) {
            localStorage[chkpt+'sequence'] = Stage.script.sequence[1];
            localStorage[chkpt+'frame'] = Stage.script.frame;
        }
        else {
            localStorage[chkpt+'sequence'] = '';
            localStorage[chkpt+'frame'] = 0;
        }
        // Store jump stack
        localStorage[chkpt+'frameStack'] = JSON.stringify(Stage.script.frameStack);
        // Store layer 0: background
        let layer = Stage.layers.bg, i=0;
        localStorage[chkpt+'l0_count'] = layer.size;
        for (let [key, scene] of layer.entries()) {
            localStorage[chkpt+'l0_'+i+'_id'] = scene.id;   // key
            localStorage[chkpt+'l0_'+i+'_src'] = scene.image;
            localStorage[chkpt+'l0_'+i+'_obj_count'] = scene.objects.length;
            for (let j=0; j<scene.objects.length; j++) {
                localStorage[chkpt+'l0_'+i+'_obj_'+j+'_src'] = scene.objects[j].src;
                localStorage[chkpt+'l0_'+i+'_obj_'+j+'_x'] = scene.objects[j].x;
                localStorage[chkpt+'l0_'+i+'_obj_'+j+'_y'] = scene.objects[j].y;
                localStorage[chkpt+'l0_'+i+'_obj_'+j+'_frames'] = scene.objects[j].frames;
                localStorage[chkpt+'l0_'+i+'_obj_'+j+'_fps'] = scene.objects[j].fps;
                localStorage[chkpt+'l0_'+i+'_obj_'+j+'_link'] = scene.objects[j].link;
            }
            localStorage[chkpt+'l0_'+i+'_alpha'] = scene.alpha;
            localStorage[chkpt+'l0_'+i+'_visible'] = scene.visible;
            localStorage[chkpt+'l0_'+i+'_effects'] = scene.effects;
            if (scene.filter)
                localStorage[chkpt+'l0_'+i+'_filter'] = JSON.stringify(Array.from(scene.filter));
            else
                localStorage[chkpt+'l0_'+i+'_filter'] = 'undefined';
            localStorage[chkpt+'l0_'+i+'_time'] = scene.transTime;
            localStorage[chkpt+'l0_'+i+'_orientation'] = scene.orientation;
            localStorage[chkpt+'l0_'+i+'_size'] = scene.scale;
            localStorage[chkpt+'l0_'+i+'_x'] = scene.pos.vx;
            localStorage[chkpt+'l0_'+i+'_y'] = scene.pos.vy;
            i++;
        }
        // Store layer 1: foreground
        layer = Stage.layers.fg;
        i = 0;
        localStorage[chkpt+'l1_count'] = layer.size;
        for (let [key, actor] of layer.entries()) {
            localStorage[chkpt+'l1_'+i+'_id'] = actor.id;   // key
            localStorage[chkpt+'l1_'+i+'_nick'] = actor.nick;
            localStorage[chkpt+'l1_'+i+'_color'] = actor.color;
            localStorage[chkpt+'l1_'+i+'_zorder'] = actor.z_order;
            localStorage[chkpt+'l1_'+i+'_sprites_count'] = Object.keys(actor.sprites).length;
            let j = 0;
            for (let prop in actor.sprites) {
                if (actor.sprites.hasOwnProperty(prop)) {
                    let s = actor.sprites[prop];
                    localStorage[chkpt+'l1_'+i+'_sprites_'+j+'_id'] = s.id; //k
                    localStorage[chkpt+'l1_'+i+'_sprites_'+j+'_src'] = s.src;
                    localStorage[chkpt+'l1_'+i+'_sprites_'+j+'_align'] = s.align;
                    localStorage[chkpt+'l1_'+i+'_sprites_'+j+'_frames'] = s.frames;
                    localStorage[chkpt+'l1_'+i+'_sprites_'+j+'_fps'] = s.fps;
                    localStorage[chkpt+'l1_'+i+'_sprites_'+j+'_reps'] = s.reps;
                    j++;
                }
            }
            localStorage[chkpt+'l1_'+i+'_active'] = actor.activeSprite;
            localStorage[chkpt+'l1_'+i+'_psprite'] = actor.pSprite;
            if (actor.avatars)
                localStorage[chkpt+'l1_'+i+'_avatars'] = JSON.stringify(actor.avatars);
            else
                localStorage[chkpt+'l1_'+i+'_avatars'] = 'undefined';
            localStorage[chkpt+'l1_'+i+'_avatar'] = actor.activeAvatar;
            localStorage[chkpt+'l1_'+i+'_alpha'] = actor.alpha;
            if (actor.prevFx != '')
                localStorage[chkpt+'l1_'+i+'_effects'] = actor.prevFx;
            else
                localStorage[chkpt+'l1_'+i+'_effects'] = 'undefined';
            localStorage[chkpt+'l1_'+i+'_offset_x'] = actor.offset.vx;
            localStorage[chkpt+'l1_'+i+'_offset_y'] = actor.offset.vy;
            localStorage[chkpt+'l1_'+i+'_time'] = actor.transTime;
            localStorage[chkpt+'l1_'+i+'_visible'] = actor.visible;
            localStorage[chkpt+'l1_'+i+'_pending'] = actor.pendingRemoval;
            localStorage[chkpt+'l1_'+i+'_posMode'] = actor.posMode;
            localStorage[chkpt+'l1_'+i+'_x'] = actor.pos.vx;
            localStorage[chkpt+'l1_'+i+'_y'] = actor.pos.vy;
            localStorage[chkpt+'l1_'+i+'_orientation'] = actor.orientation;
            localStorage[chkpt+'l1_'+i+'_size'] = actor.scale;
            localStorage[chkpt+'l1_'+i+'_zscale'] = actor.z_scale;
            if (actor.filter)
                localStorage[chkpt+'l1_'+i+'_filter'] = JSON.stringify(Array.from(actor.filter));
            else
            localStorage[chkpt+'l1_'+i+'_filter'] = 'undefined';
            localStorage[chkpt+'l1_'+i+'_stats'] = JSON.stringify(actor.stats);
            i++;
        }
        // Store layer 2: overlay
        layer = Stage.layers.ovl;
        i = 0;
        localStorage[chkpt+'l2_count'] = layer.size;
        for (let [key, overlay] of layer.entries()) {
            localStorage[chkpt+'l2_'+i+'_id'] = overlay.id;
            localStorage[chkpt+'l2_'+i+'_src'] = overlay.image;
            localStorage[chkpt+'l2_'+i+'_alpha'] = overlay.alpha;
            localStorage[chkpt+'l2_'+i+'_visible'] = overlay.visible;
            localStorage[chkpt+'l2_'+i+'_effects'] = overlay.effects;
            localStorage[chkpt+'l2_'+i+'_time'] = overlay.transTime;
            localStorage[chkpt+'l2_'+i+'_scroll'] = overlay.scroll;
            localStorage[chkpt+'l2_'+i+'_offset_x'] = overlay.offset.vx;
            localStorage[chkpt+'l2_'+i+'_offset_y'] = overlay.offset.vy;
            localStorage[chkpt+'l2_'+i+'_orientation'] = overlay.orientation;
            localStorage[chkpt+'l2_'+i+'_size'] = overlay.scale;
            localStorage[chkpt+'l2_'+i+'_x'] = overlay.pos.vx;
            localStorage[chkpt+'l2_'+i+'_y'] = overlay.pos.vy;
            localStorage[chkpt+'l2_'+i+'_frames'] = overlay.ovFrames;
            localStorage[chkpt+'l2_'+i+'_fps'] = overlay.ovFps;
            if (overlay.filter)
                localStorage[chkpt+'l2_'+i+'_filter'] = JSON.stringify(Array.from(overlay.filter));
            else
                localStorage[chkpt+'l2_'+i+'_filter'] = 'undefined';
            i++;
        }
        // Store layer 3: atmosphere
        layer = Stage.layers.atm;
        i = 0;
        localStorage[chkpt+'l3_count'] = layer.size;
        for (let [key, atmo] of layer.entries()) {
            localStorage[chkpt+'l3_'+i+'_id'] = atmo.id;
            localStorage[chkpt+'l3_'+i+'_type'] = atmo.type;
            localStorage[chkpt+'l3_'+i+'_action'] = atmo.action;
            localStorage[chkpt+'l3_'+i+'_visible'] = atmo.visible;
            localStorage[chkpt+'l3_'+i+'_param'] = JSON.stringify(atmo.saveparam);
            i++;
        }
        // Store layer 4: gui/controls
        layer = Stage.layers.gui;
        i = 0;
        localStorage[chkpt+'l4_count'] = layer.size;
        for (let [key, control] of layer.entries()) {
            localStorage[chkpt+'l4_'+i+'_type'] = control.type;
            localStorage[chkpt+'l4_'+i+'_id'] = control.id;
            localStorage[chkpt+'l4_'+i+'_text'] = control.text;
            localStorage[chkpt+'l4_'+i+'_visible'] = control.visible;
            if (control.type == 'box') {
                localStorage[chkpt+'l4_'+i+'_pos'] = control.pos;
                localStorage[chkpt+'l4_'+i+'_back'] = control.back;
                localStorage[chkpt+'l4_'+i+'_src'] = control.src;
                localStorage[chkpt+'l4_'+i+'_prompt'] = control.psrc;
                if (control.avatar != '') {
                    localStorage[chkpt+'l4_'+i+'_avatar'] = control.avatar;
                    localStorage[chkpt+'l4_'+i+'_avatarStruct'] = JSON.stringify(control.avatarStruct);
                }
                else {
                    localStorage[chkpt+'l4_'+i+'_avatar'] = 'undefined';
                    localStorage[chkpt+'l4_'+i+'_avatarStruct'] = 'undefined';
                }
                if (control.balloon) {
                    localStorage[chkpt+'l4_'+i+'_balloon'] = control.balloon;
                    localStorage[chkpt+'l4_'+i+'_bpos'] = control.bpos;
                }
                else 
                    localStorage[chkpt+'l4_'+i+'_balloon'] = 'undefined';
                localStorage[chkpt+'l4_'+i+'_cont'] = control.cont;
                localStorage[chkpt+'l4_'+i+'_fontFamily'] = control.fontFamily;
                localStorage[chkpt+'l4_'+i+'_fontSize'] = control.fontSize;
                localStorage[chkpt+'l4_'+i+'_lineHeight'] = control.lineHeight;
                localStorage[chkpt+'l4_'+i+'_fontWeight'] = control.fontWeight;
                localStorage[chkpt+'l4_'+i+'_fontColor'] = control.fontColor;
                localStorage[chkpt+'l4_'+i+'_tagFamily'] = control.tagFamily;
                localStorage[chkpt+'l4_'+i+'_tagSize'] = control.tagSize;
                localStorage[chkpt+'l4_'+i+'_tagWeight'] = control.tagWeight;
                localStorage[chkpt+'l4_'+i+'_tagColor'] = control.tagColor;
                localStorage[chkpt+'l4_'+i+'_dimStyle'] = JSON.stringify(control.dimStyle);
                localStorage[chkpt+'l4_'+i+'_balloonStyle'] = JSON.stringify(control.balloonStyle);
                localStorage[chkpt+'l4_'+i+'_timeout'] = control.timeout;
                localStorage[chkpt+'l4_'+i+'_textAlign'] = control.textAlign;
                localStorage[chkpt+'l4_'+i+'_offset_x'] = control.textOffset.vx;
                localStorage[chkpt+'l4_'+i+'_offset_y'] = control.textOffset.vy;
                localStorage[chkpt+'l4_'+i+'_inputFocus'] = control.inputFocus;
                localStorage[chkpt+'l4_'+i+'_alpha'] = control.alpha;
                localStorage[chkpt+'l4_'+i+'_effects'] = control.effects;
            }
            else {
                if (control.group != '')
                    localStorage[chkpt+'l4_'+i+'_group'] = control.group;
                else
                    localStorage[chkpt+'l4_'+i+'_group'] = 'undefined';
                localStorage[chkpt+'l4_'+i+'_param'] = JSON.stringify(control.saveparam);
                localStorage[chkpt+'l4_'+i+'_hidden'] = control.hidden;
                localStorage[chkpt+'l4_'+i+'_showText'] = control.showText;
                localStorage[chkpt+'l4_'+i+'_on'] = control.on;
                
                if ((control.link != null) && (control.link.length > 0)) {
                    localStorage[chkpt+'l4_'+i+'_link_count'] = control.link.length;
                    for (let j=0; j<control.link.length; ) {
                        localStorage[chkpt+'l4_'+i+'_link_'+j] = control.link[j].name;
                        localStorage[chkpt+'l4_'+i+'_link_'+(j+1)] = JSON.stringify(control.link[j+1]);
                        if ((control.link[j+2]) && (typeof control.link[j+2] == 'boolean')) {
                            localStorage[chkpt+'l4_'+i+'_link_'+(j+2)] = control.link[j+2];
                            j += 3;
                        }
                        else 
                            j += 2;
                    }
                }
                else 
                    localStorage[chkpt+'l4_'+i+'_link_count'] = 0;
                if ((control.linkd != null) && (control.linkd.length > 0)) {
                    localStorage[chkpt+'l4_'+i+'_linkd_count'] = control.linkd.length;
                    for (let j=0; j<control.linkd.length; ) {
                        localStorage[chkpt+'l4_'+i+'_linkd_'+j] = control.linkd[j].name;
                        localStorage[chkpt+'l4_'+i+'_linkd_'+(j+1)] = JSON.stringify(control.linkd[j+1]);
                        if ((control.linkd[j+2]) && (typeof control.linkd[j+2] == 'boolean')) {
                            localStorage[chkpt+'l4_'+i+'_linkd_'+(j+2)] = control.linkd[j+2];
                            j += 3;
                        }
                        else 
                            j += 2;
                    }
                }
                else 
                    localStorage[chkpt+'l4_'+i+'_linkd_count'] = 0;
            }
            i++;
        }
        // Store sounds: bgm, bgs, se, vc
        for (let i=0; i<4; i++) {
            if (i==0) layer = Stage.sounds.bgm;
            else if (i==1) layer = Stage.sounds.bgs;
            else if (i==2) layer = Stage.sounds.se;
            else layer = Stage.sounds.vc;
			localStorage[chkpt+"s"+i+"_count"] = layer.size;
            let j = 0;
            for (let [key, sound] of layer.entries()) {
                localStorage[chkpt+'s_'+i+'_'+j+'_src'] = sound.src;
                localStorage[chkpt+'s_'+i+'_'+j+'_repeat'] = sound._repeat;
                localStorage[chkpt+'s_'+i+'_'+j+'_delay'] = sound._delay;
                localStorage[chkpt+'s_'+i+'_'+j+'_isStopping'] = sound.isStopping;
                localStorage[chkpt+'s_'+i+'_'+j+'_isPaused'] = sound.isPaused;
                localStorage[chkpt+'s_'+i+'_'+j+'_adjust'] = sound._adjust;
                localStorage[chkpt+'s_'+i+'_'+j+'_rate'] = sound._rate;
                localStorage[chkpt+'s_'+i+'_'+j+'_stereo'] = sound._stereo;
                if (sound._tag != '') {
                    localStorage[chkpt+'s_'+i+'_'+j+'_tag'] = sound._tag;
                    localStorage[chkpt+'s_'+i+'_'+j+'_sprite'] = JSON.stringify(sound.audio._sprite);
                }
                else 
                    localStorage[chkpt+'s_'+i+'_'+j+'_tag'] = 'undefined';
                j++;
            }
        }
        // Store video? No need.
        // Store user variables
        localStorage[chkpt+'uv_count'] = Stage.variables.size;
        i = 0;
        for (let [key, vars] of Stage.variables.entries()) {
            localStorage[chkpt+'uv'+i+'_name'] = key;
            localStorage[chkpt+'uv'+i+'_value'] = JSON.stringify(vars.value);
            localStorage[chkpt+'uv'+i+'_type'] = vars.type;
            if (vars.persist) {
                localStorage[chkpt+'uv'+i+'_persist'] = true;
                localStorage['_persist_uv_'+key] = JSON.stringify(vars.value);
            }
            else
                localStorage[chkpt+'uv'+i+'_persist'] = false;
            i++;
        }
        // Store forms
        localStorage[chkpt+'forms_count'] = Stage.formStack.length;
        for (let i=0; i<Stage.formStack.length; i++) {
            localStorage[chkpt+'formStack_'+i] = JSON.stringify(Stage.formStack[i]);
        }
        localStorage[chkpt+'forms_style_count'] = Stage.formStyle.length;
        for (let i=0; i<Stage.formStyle.length; i++) {
            localStorage[chkpt+'formStyle_'+i] = Stage.formStyle[i];
        }
        // Store animation sets
        let aset_count = 0;
        for (let prop in Stage.animations) {
            if (Stage.animations.hasOwnProperty(prop)) {
				localStorage[chkpt+"animation"+aset_count+"_name"] = prop;
				localStorage[chkpt+"animation"+aset_count+"_value"] = JSON.stringify(Stage.animations[prop]);
				aset_count++;
            }
        }
        localStorage[chkpt+"aset_count"] = aset_count;
		// Store config
		localStorage[chkpt+"Config"] = JSON.stringify(Config);

		// MOD Storage
		if (Config.modRPG) {
			localStorage[chkpt+"rpg_actors"] = JSON.stringify(RPG.Actors);
			localStorage[chkpt+"rpg_inventory"] = JSON.stringify(RPG.Inventory);
			localStorage[chkpt+"rpg_quests"] = JSON.stringify(RPG.Quests);
			localStorage[chkpt+"rpg_vars"] = JSON.stringify(RPG.vars);
		}
    });
    Helper.loadCheckpoint = ((chkpt) => {
        // Populate layer 0
        Stage.layers.bg.clear();
        for (let i=0; i<parseInt(localStorage[chkpt+'l0_count']); i++) {
            let obj = new Array();
            for (let j=0; j<parseInt(localStorage[chkpt+'l0_'+i+'_obj_count']); j++) {
				obj.push(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_src"]);
                obj.push(parseInt(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_x"]));
                obj.push(parseInt(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_y"]));
                obj.push(parseInt(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_frames"]));
                obj.push(parseInt(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_fps"]));
                // TODO: obj.push(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_link"]);
            }
            let scene = new Scene(localStorage[chkpt+'l0_'+i+'_id'].replace('scn',''),
                               localStorage[chkpt+'l0_'+i+'_src'],
                               obj);
			scene.effects = localStorage[chkpt+"l0_"+i+"_effects"];
			scene.alpha = parseFloat(localStorage[chkpt+"l0_"+i+"_alpha"]);
			scene.visible = (localStorage[chkpt+"l0_"+i+"_visible"] == "true");
			scene.transTime = parseFloat(localStorage[chkpt+"l0_"+i+"_time"]);
			scene.orientation = parseFloat(localStorage[chkpt+"l0_"+i+"_orientation"]);
			scene.rotation = parseFloat(localStorage[chkpt+"l0_"+i+"_orientation"]);
			scene.size = parseFloat(localStorage[chkpt+"l0_"+i+"_size"]);
			scene.scale = parseFloat(localStorage[chkpt+"l0_"+i+"_size"]);
			scene.pos.vx = parseInt(localStorage[chkpt+"l0_"+i+"_x"]);
            scene.pos.vy = parseInt(localStorage[chkpt+"l0_"+i+"_y"]);
            scene.filter = null;
            if (localStorage[chkpt+"l0_"+i+"_filter"] != 'undefined') {
                let filterArray = JSON.parse(localStorage[chkpt+"l0_"+i+"_filter"]);
                if (filterArray && (filterArray.length > 0)) {
                    scene.filter = new Set();
                    filterArray.forEach(f => {scene.filter.add(f)});
                }
            }
            Stage.layers.bg.set(scene.id, scene);
        }
        // Populate layer 1
        Stage.layers.fg.clear();
        for (let i=0; i<parseInt(localStorage[chkpt+'l1_count']); i++) {
            let actor = new Character(localStorage[chkpt+'l1_'+i+'_id'],
                                      parseInt(localStorage[chkpt+'l1_'+i+'_zorder']));
            actor.nick = localStorage[chkpt+'l1_'+i+'_nick'];
            actor.color = localStorage[chkpt+'l1_'+i+'_color'];
            actor.size = parseFloat(localStorage[chkpt+'l1_'+i+'_size']);
            actor.scale = parseFloat(localStorage[chkpt+'l1_'+i+'_size']);
            actor.z_scale = parseFloat(localStorage[chkpt+'l1_'+i+'_zscale']);
            for (let j=0; j<parseInt(localStorage[chkpt+'l1_'+i+'_sprites_count']); j++) {
                let sprite = [localStorage[chkpt+'l1_'+i+'_sprites_'+j+'_id'],
                              localStorage[chkpt+'l1_'+i+'_sprites_'+j+'_src'],
                              localStorage[chkpt+'l1_'+i+'_sprites_'+j+'_align'],
                              parseInt(localStorage[chkpt+'l1_'+i+'_sprites_'+j+'_frames']),
                              parseInt(localStorage[chkpt+'l1_'+i+'_sprites_'+j+'_fps']),
                              parseInt(localStorage[chkpt+'l1_'+i+'_sprites_'+j+'_src'])];
                actor.addSprite(sprite);
            }
            actor.activeSprite = localStorage[chkpt+'l1_'+i+'_active'];
            actor.pSprite = localStorage[chkpt+'l1_'+i+'_psprite'];
            if (localStorage[chkpt+'l1_'+i+'_avatars'] != 'undefined')
                actor.avatars = JSON.parse(localStorage[chkpt+'l1_'+i+'_avatars']);
            else
                actor.avatars = {};
            actor.activeAvatar = localStorage[chkpt+'l1_'+i+'_avatar'];
            actor.offset = new Vector2d(parseInt(localStorage[chkpt+'l1_'+i+'_offset_x']),
                                        parseInt(localStorage[chkpt+'l1_'+i+'_offset_y']));
            actor.alpha = parseFloat(localStorage[chkpt+'l1_'+i+'_alpha']);
            if (actor.glSpriteA.texture.baseTexture.imageUrl == actor.sprites[actor.activeSprite].src) {
                actor.glSpriteA.alpha = actor.alpha;
                actor.glSpriteB.alpha = 0;
                actor.pSprite = 0;
            }
            else if (actor.glSpriteB.texture.baseTexture.imageUrl == actor.sprites[actor.activeSprite].src) {
                actor.glSpriteB.alpha = actor.alpha;
                actor.glSpriteA.alpha = 0;
                actor.pSprite = 1;
            }
            if (localStorage[chkpt+'l1_'+i+'_effects'] != 'undefined')
                actor.prevFx = localStorage[chkpt+'l1_'+i+'_effects'];
            else
                actor.prevFx = 'done';
            actor.transTime = parseFloat(localStorage[chkpt+'l1_'+i+'_time']);
            actor.visible = (localStorage[chkpt+'l1_'+i+'_visible'] == 'true');
            actor.pendingRemoval = (localStorage[chkpt+'l1_'+i+'_pending'] == 'true');
            actor.posMode = localStorage[chkpt+'l1_'+i+'_posMode'];
            actor.pos = new Vector2d(parseInt(localStorage[chkpt+'l1_'+i+'_x']),
                                     parseInt(localStorage[chkpt+'l1_'+i+'_y']));
            actor.target_pos.copy(actor.pos);
            actor.orientation = parseFloat(localStorage[chkpt+'l1_'+i+'_orientation']);
            actor.rotation = parseFloat(localStorage[chkpt+'l1_'+i+'_orientation']);
            actor.stats = JSON.parse(localStorage[chkpt+'l1_'+i+'_stats']);
            actor.filter = null;
            if (localStorage[chkpt+"l1_"+i+"_filter"] != 'undefined') {
                let filterArray = JSON.parse(localStorage[chkpt+"l1_"+i+"_filter"]);
                if (filterArray && (filterArray.length > 0)) {
                    actor.filter = new Set();
                    filterArray.forEach(f => {actor.filter.add(f)});
                }
            }
            Stage.layers.fg.set(actor.id, actor);
        }
        // Populate layer 2
        Stage.layers.ovl.clear();
        for (let i=0; i<parseInt(localStorage[chkpt+'l2_count']); i++) {
            let overlay = new Overlay(localStorage[chkpt+'l2_'+i+'_id'].replace('ovl',''),
                                  localStorage[chkpt+'l2_'+i+'_src'],
                                  null);
			overlay.effects = localStorage[chkpt+"l2_"+i+"_effects"];
			overlay.alpha = parseFloat(localStorage[chkpt+"l2_"+i+"_alpha"]);
			overlay.visible = (localStorage[chkpt+"l2_"+i+"_visible"] == "true");
			overlay.transTime = parseFloat(localStorage[chkpt+"l2_"+i+"_time"]);
			overlay.scroll = (localStorage[chkpt+"l2_"+i+"_scroll"] == "true");
            overlay.offset = new Vector2d(parseInt(localStorage[chkpt+"l2_"+i+"_offset_x"]),
                                      parseInt(localStorage[chkpt+"l2_"+i+"_offset_x"]));
			overlay.orientation = parseFloat(localStorage[chkpt+"l2_"+i+"_orientation"]);
			overlay.rotation = parseFloat(localStorage[chkpt+"l2_"+i+"_orientation"]);
			overlay.size = parseFloat(localStorage[chkpt+"l2_"+i+"_size"]);
			overlay.scale = parseFloat(localStorage[chkpt+"l2_"+i+"_size"]);
			overlay.pos.vx = parseInt(localStorage[chkpt+"l2_"+i+"_x"]);
			overlay.pos.vy = parseInt(localStorage[chkpt+"l2_"+i+"_y"]);
			overlay.ovFrames = parseInt(localStorage[chkpt+"l2_"+i+"_frames"]);
			overlay.ovFps = parseInt(localStorage[chkpt+"l2_"+i+"_fps"]);
            overlay.filter = null;
            if (localStorage[chkpt+"l2_"+i+"_filter"] != 'undefined') {
                let filterArray = JSON.parse(localStorage[chkpt+"l2_"+i+"_filter"]);
                if (filterArray && (filterArray.length > 0)) {
                    overlay.filter = new Set();
                    filterArray.forEach(f => {overlay.filter.add(f)});
                }
            }
            Stage.layers.ovl.set(overlay.id, overlay);
        }
        // Populate layer 3
        Stage.layers.atm.clear();
        for (let i=0; i<parseInt(localStorage[chkpt+'l3_count']); i++) {
            let type = localStorage[chkpt+"l3_"+i+"_type"],
                id = localStorage[chkpt+"l3_"+i+"_id"].replace('atm',''),
                param = JSON.parse(localStorage[chkpt+"l3_"+i+"_param"]),
                atmo = null;
            if (type == 'rain') atmo = new Rain(id);
            else if (type == 'snow') atmo = new Snow(id);
            else if (type == 'firefly') atmo = new Firefly(id);
            else if (type == 'cloud') atmo = new Cloud(id);
            else atmo = new AtmoExtras(id);
            atmo.Init(type, param);
            atmo.action = localStorage[chkpt+"l3_"+i+"_action"];
            atmo.visible =  (localStorage[chkpt+"l3_"+i+"_visible"] == "true");
            Stage.layers.atm.set(id, atmo);
        }
        // Populate layer 4
        Stage.layers.gui.clear();
        // TODO: count per cform group, determines frame skip duration
        // TODO: only non-modal dialogs are stored (e.g. HUD); menu and modal dialogs are not stored
        let formSet = new Map();
        for (let i=0; i<parseInt(localStorage[chkpt+'l4_count']); i++) {
            let type = localStorage[chkpt+'l4_'+i+'_type'];
            switch (type) {
                case 'box': 
                    {
                        let box = new ScriptBox();
                        box.Create(Stage.canvas.width, Stage.canvas.height);
                        box.visible = (localStorage[chkpt+'l4_'+i+'_visible'] == 'true');
                        box.text = localStorage[chkpt+'l4_'+i+'_text'];
                        box.pos = localStorage[chkpt+'l4_'+i+'_pos'];
                        box.back = localStorage[chkpt+'l4_'+i+'_back'];
                        box.src = localStorage[chkpt+'l4_'+i+'_src'];
                        // TODO: prompt
                        if (localStorage[chkpt+'l4_'+i+'_avatar'] != 'undefined') {
                            box.avatar = localStorage[chkpt+'l4_'+i+'_avatar'];
                            box.avatarStruct = JSON.parse(localStorage[chkpt+'l4_'+i+'_avatarStruct']);
                        }
                        else {
                            box.avatar = '';
                            box.avatarStruct = null;
                        }
                        if (localStorage[chkpt+'l4_'+i+'_balloon'] != 'undefined') {
                            box.balloon = localStorage[chkpt+'l4_'+i+'_balloon'];
                            box.bpos = localStorage[chkpt+'l4_'+i+'_bpos'];
                        }
                        else
                            box.balloon = null;
                        box.cont = (localStorage[chkpt+'l4_'+i+'_cont'] == 'true');
                        box.fontFamily = localStorage[chkpt+'l4_'+i+'_fontFamily'];
                        box.fontSize = localStorage[chkpt+'l4_'+i+'_fontSize'];
                        box.lineHeight = parseInt(localStorage[chkpt+'l4_'+i+'_lineHeight']);
                        box.fontWeight = localStorage[chkpt+'l4_'+i+'_fontWeight'];
                        box.fontColor = localStorage[chkpt+'l4_'+i+'_fontColor'];
                        box.tagFamily = localStorage[chkpt+'l4_'+i+'_tagFamily'];
                        box.tagSize = localStorage[chkpt+'l4_'+i+'_tagSize'];
                        box.tagWeight = localStorage[chkpt+'l4_'+i+'_tagWeight'];
                        box.tagColor = localStorage[chkpt+'l4_'+i+'_tagColor'];
                        box.dimStyle = JSON.parse(localStorage[chkpt+'l4_'+i+'_dimStyle']);
                        box.balloonStyle = JSON.parse(localStorage[chkpt+'l4_'+i+'_balloonStyle']);
                        box.timeout = parseFloat(localStorage[chkpt+'l4_'+i+'_timeout']);
                        box.textAlign = localStorage[chkpt+'l4_'+i+'_textAlign'];
                        box.textOffset.vx = parseInt(localStorage[chkpt+'l4_'+i+'_offset_x']);
                        box.textOffset.vy = parseInt(localStorage[chkpt+'l4_'+i+'_offset_y']);
                        box.inputFocus = (localStorage[chkpt+'l4_'+i+'_inputFocus'] == 'true');
                        box.alpha = parseFloat(localStorage[chkpt+'l4_'+i+'_alpha']);
                        box.effects = localStorage[chkpt+'l4_'+i+'_effects'];
                        Stage.layers.gui.set(box.id, box);    
                    }
                    break;
                case 'button':
                case 'toggle':
                case 'radio':
                    {
                        let control;
                        if (type == 'toggle')
                            control = new Toggle(JSON.parse(localStorage[chkpt+'l4_'+i+'_param']));
                        else if (type == 'radio')
                            control = new Radio(JSON.parse(localStorage[chkpt+'l4_'+i+'_param']));
                        else 
                            control = new Button(JSON.parse(localStorage[chkpt+'l4_'+i+'_param']));
                        if (localStorage[chkpt+'l4_'+i+'_group'] != 'undefined')
                            control.group = localStorage[chkpt+'l4_'+i+'_group'];
                        else 
                            control.group = '';
                        control.text = localStorage[chkpt+'l4_'+i+'_text']
                        control.hidden = (localStorage[chkpt+'l4_'+i+'_hidden'] == 'true');
                        control.showText = (localStorage[chkpt+'l4_'+i+'_showText'] == 'true');
                        control.on = (localStorage[chkpt+'l4_'+i+'_on'] == 'true');
                        //if (!control.hidden) control.visible = true;
                        control.link = new Array();
                        for (let j=0; j<parseInt(localStorage[chkpt+'l4_'+i+'_link_count']); ) {
                            control.link.push(eval(localStorage[chkpt+'l4_'+i+'_link_'+j]));
                            control.link.push(JSON.parse(localStorage[chkpt+'l4_'+i+'_link_'+(j+1)]));
                            if (localStorage[chkpt+'l4_'+i+'_link_'+(j+2)] && 
                                (typeof JSON.parse(localStorage[chkpt+'l4_'+i+'_link_'+(j+2)])=='boolean') ) {
                                    control.link.push(localStorage[chkpt+'l4_'+i+'_link_'+(j+2)]);
                                    j+=3;
                                }
                            else 
                                j+=2;
                        }
                        if (control.link.length == 0) control.link = null;
                        Stage.layers.gui.set(control.id, control);
                    }
                    break;
                case 'picture':
                    {
                        let control = new Picture(JSON.parse(localStorage[chkpt+'l4_'+i+'_param']));
                        if (localStorage[chkpt+'l4_'+i+'_group'] != 'undefined')
                            control.group = localStorage[chkpt+'l4_'+i+'_group'];
                        else 
                            control.group = '';
                        control.hidden = (localStorage[chkpt+'l4_'+i+'_hidden'] == true);
                        Stage.layers.gui.set(control.id, control);                        
                    }
                    break;
                case 'marquee':
                case 'timer':
                    {
                        let control;
                        if (type == 'marque')
                            control = new Marquee(JSON.parse(localStorage[chkpt+'l4_'+i+'_param']));
                        else
                            control = new Timer(JSON.parse(localStorage[chkpt+'l4_'+i+'_param']));
                        if (localStorage[chkpt+'l4_'+i+'_group'] != 'undefined')
                            control.group = localStorage[chkpt+'l4_'+i+'_group'];
                        else 
                            control.group = '';
                        control.hidden = (localStorage[chkpt+'l4_'+i+'_hidden'] == true);
                        control.link = new Array();
                        for (let j=0; j<parseInt(localStorage[chkpt+'l4_'+i+'_link_count']); ) {
                            control.link.push(eval(localStorage[chkpt+'l4_'+i+'_link_'+j]));
                            control.link.push(JSON.parse(localStorage[chkpt+'l4_'+i+'_link_'+(j+1)]));
                            if (localStorage[chkpt+'l4_'+i+'_link_'+(j+2)] && 
                                (typeof JSON.parse(localStorage[chkpt+'l4_'+i+'_link_'+(j+2)])=='boolean') ) {
                                    control.link.push(localStorage[chkpt+'l4_'+i+'_link_'+(j+2)]);
                                    j+=3;
                                }
                            else 
                                j+=2;
                        }
                        if (control.link.length == 0) control.link = null;
                        Stage.layers.gui.set(control.id, control);                        
                    }
                    break;
                case 'textarea':
                    {   
                        let control = new Textarea(JSON.parse(localStorage[chkpt+'l4_'+i+'_param']));
                        if (localStorage[chkpt+'l4_'+i+'_group'] != 'undefined')
                            control.group = localStorage[chkpt+'l4_'+i+'_group'];
                        else 
                            control.group = '';
                        control.text = localStorage[chkpt+'l4_'+i+'_text'];
                        control.offset = localStorage[chkpt+'l4_'+i+'_offset'];
                        control.hidden = (localStorage[chkpt+'l4_'+i+'_hidden'] == 'true');
                        control.showText = (localStorage[chkpt+'l4_'+i+'_showText'] == 'true');
                    }
                    break;
                default:
                    {
                        let control = new Element(JSON.parse(localStorage[chkpt+'l4_'+i+'_param']));
                        control.text = localStorage[chkpt+'l4_'+i+'_text']
                        control.hidden = (localStorage[chkpt+'l4_'+i+'_hidden'] == 'true');
                        control.showText = (localStorage[chkpt+'l4_'+i+'_showText'] == 'true');
                        Stage.layers.gui.set(control.id, control);                        
                        control.link = new Array();
                        for (let j=0; j<parseInt(localStorage[chkpt+'l4_'+i+'_link_count']); ) {
                            control.link.push(eval(localStorage[chkpt+'l4_'+i+'_link_'+j]));
                            control.link.push(JSON.parse(localStorage[chkpt+'l4_'+i+'_link_'+(j+1)]));
                            if (localStorage[chkpt+'l4_'+i+'_link_'+(j+2)] && 
                                (typeof JSON.parse(localStorage[chkpt+'l4_'+i+'_link_'+(j+2)])=='boolean') ) {
                                    control.link.push(localStorage[chkpt+'l4_'+i+'_link_'+(j+2)]);
                                    j+=3;
                                }
                            else 
                                j+=2;
                        }
                        if (control.link.length == 0) control.link = null;
                        control.linkd = new Array();
                        for (let j=0; j<parseInt(localStorage[chkpt+'l4_'+i+'_linkd_count']); ) {
                            control.linkd.push(eval(localStorage[chkpt+'l4_'+i+'_linkd_'+j]));
                            control.linkd.push(JSON.parse(localStorage[chkpt+'l4_'+i+'_linkd_'+(j+1)]));
                            if (localStorage[chkpt+'l4_'+i+'_linkd_'+(j+2)] && 
                                (typeof JSON.parse(localStorage[chkpt+'l4_'+i+'_linkd_'+(j+2)])=='boolean') ) {
                                    control.linkd.push(localStorage[chkpt+'l4_'+i+'_linkd_'+(j+2)]);
                                    j+=3;
                                }
                            else 
                                j+=2;
                        }
                        if (control.linkd.length == 0) control.linkd = null;
                    }
                    break;
            }
            if (!formSet.get(localStorage[chkpt+'l4_'+i+'_group'])) {
                formSet.set(localStorage[chkpt+'l4_'+i+'_group'], 1);
            }
            else {
                formSet.set(localStorage[chkpt+'l4_'+i+'_group'], 
                            formSet.get(localStorage[chkpt+'l4_'+i+'_group'])+1);
            }
        }
        // Populate sounds
        Stage.sounds.bgm.clear();
        Stage.sounds.bgs.clear();
        Stage.sounds.se.clear();
        Stage.sounds.vc.clear();
        Howler.unload();
        for (let i=0; i<4; i++) {
            let layer;
            if (i==0) layer = Stage.sounds.bgm;
            else if (i==1) layer = Stage.sounds.bgs;
            else if (i==2) layer = Stage.sounds.se;
            else layer = Stage.sounds.vc;
            for (let j=0; j<parseInt(localStorage[chkpt+"s"+i+"_count"]); j++) {
                let sndsrc = localStorage[chkpt+'s_'+i+'_'+j+'_src'].replace(/mp3|m4a|ogg|oga|wav|webm|weba|aac/g,'');
                let format = localStorage[chkpt+'s_'+i+'_'+j+'_src'].match(/mp3|m4a|ogg|oga|wav|webm|weba|aac/g);
                let sound = new Sounds(sndsrc.slice(0,sndsrc.length-1), format);
                sound._repeat = parseInt(localStorage[chkpt+'s_'+i+'_'+j+'_repeat']);
                sound._delay = parseInt(localStorage[chkpt+'s_'+i+'_'+j+'_delay']);
                sound.isStopping = (localStorage[chkpt+'s_'+i+'_'+j+'_isStopping'] == 'true');
                sound.isPaused = (localStorage[chkpt+'s_'+i+'_'+j+'_isPaused'] == 'true');
                sound._adjust = parseFloat(localStorage[chkpt+'s_'+i+'_'+j+'_adjust']);
                sound._rate = parseFloat(localStorage[chkpt+'s_'+i+'_'+j+'_rate']);
                sound._stereo = parseFloat(localStorage[chkpt+'s_'+i+'_'+j+'_stereo']);
                if ((i==2) && (localStorage[chkpt+'s_'+i+'_'+j+'_tag'] != 'undefined')) {
                    sound._tag = localStorage[chkpt+'s_'+i+'_'+j+'_tag'];
                    sound.audio._sprite = JSON.parse(localStorage[chkpt+'s_'+i+'_'+j+'_sprite']);
                    layer.set(sound._tag, sound);
                }
                else {
                    sound._tag = '';
                    layer.set(sound.src, sound);
                }
            }
        }
		// Populate user variables
		Stage.variables.clear();
		for (let i=0; i<parseInt(localStorage[chkpt+"uv_count"]); i++) {
			let vars = new UserVars();
			vars.Set(JSON.parse(localStorage[chkpt+"uv"+i+"_value"]),(localStorage[chkpt+"uv"+i+"_persist"] == "true"));
            Stage.variables.set(localStorage[chkpt+"uv"+i+"_name"],vars);
        }
		for (let prop in localStorage) {
			if (prop.match(/^_persist_uv_/g)) {
				let vars = new UserVars();
				vars.Set(JSON.parse(localStorage[prop]), true);
				Stage.variables.set(prop.replace(/^_persist_uv_/g,''), vars);
			}
		}
        
        // Populate form stack and style
		Stage.formStack.splice(0, Stage.formStack.length);
		for (let i=0; i<parseInt(localStorage[chkpt+"forms_count"]); i++) {
			Stage.formStack.push(JSON.parse(localStorage[chkpt+"formStack_"+i]));
		}
		Stage.formStyle.splice(0, Stage.formStyle.length);
		for (let i=0; i<parseInt(localStorage[chkpt+"forms_style_count"]); i++) {
			Stage.formStyle.push(localStorage[chkpt+"formStyle_"+i]);
		}
        // Populate animations
		Stage.animations = {};
		for (let i=0; i<parseInt(localStorage[chkpt+"aset_count"]); i++) {
			Stage.animations[localStorage[chkpt+"animation"+i+"_name"]] = JSON.parse(localStorage[chkpt+"animation"+i+"_value"]);
		}
        // Populare config
		Config = JSON.parse(localStorage[chkpt+"Config"]);
		Helper.updateConfig("activeTheme");
		if (Config.devCordova != "notCordova")
			Stage.isCordova = true;
        // Populate frameStack
        Stage.script.frameStack = JSON.parse(localStorage[chkpt+"frameStack"])
		// then jump to checkpoint location
		if (localStorage[chkpt+"sequence"] != '') {
			Helper.loadScript(localStorage[chkpt+"sequence"], () => {
				Stage.script.sequence = eval(localStorage[chkpt+"sequence"]);
                Stage.script.frame = parseInt(localStorage[chkpt+"frame"])+2;
                // TODO: checkpoint only support default (non-loaderWorkaround) option
            });
		}

        // Populate MODS
		if (Config.modRPG) {
			if (RPG == null) RPG = {};
			RPG.Actors = JSON.parse(localStorage[chkpt+"rpg_actors"]);			
			RPG.Inventory = JSON.parse(localStorage[chkpt+"rpg_inventory"]);			
			RPG.Quests = JSON.parse(localStorage[chkpt+"rpg_quests"]);			
			RPG.vars = JSON.parse(localStorage[chkpt+"rpg_vars"]);			
		}
        
    });
});

function checkpoint(param) {
    if (!Helper.supportsLocalStorage()) return;
    
    let cmd = param,
        chkpt = '';
    if (Config.gameNamedCheckpts) {
        if (typeof param == 'string') {
            cmd = param;
            chkpt = '_auto_';
        }
        else {
            for (let prop in param) {
                if (param.hasOwnProperty(prop)){
                    cmd = prop;
                    chkpt = param[prop];
                }
            }
        }
    }
    if (cmd == 'save') {
        if (!Config.gameNamedCheckpts) {
            let pattern = '/_persist_/g';
            for (let prop in localStorage) {
                if (!prop.match(eval(pattern)))
                    localStorage.removeItem(prop);
            }
        }
        else {
            if (chkpt != '') {
                let pattern = '/^'+chkpt+'/g';
                for (let prop in localStorage) {
                    if (prop.match(eval(pattern)))
                        localStorage.removeItem(prop);
                }
            }
        }
        Helper.saveCheckpoint(chkpt);        
    }
    else if (cmd == 'load') {
        let chkpt_exist = false;
        if (chkpt != '') {
			let pattern = "/^"+chkpt+"/g";
			for (let prop in localStorage) {
				if (prop.match(eval(pattern))) {
					chkpt_exist = true;
					break;
				}
			}
        }
        else {
			// check for checkpoint item
			if (!localStorage["Config"])
				chkpt_exist = false;
			else
				chkpt_exist = true;
        }
        if ((localStorage.length <= 0) || !chkpt_exist) {
            let msg = "[VNC]: No checkpoint data found!\nStarting a new game instead...";
            if (Stage.isCordova)
                try {
                    navigator.notification.alert(msg, function(){}, "vn-Canvas Alert");
                }
                catch(e) {
                    alert(msg);
                }
            else
                alert(msg);
            return;
        }
        // PixiJS must load every resource first in one batch
        let resArray = new Set();
        for (let prop in localStorage) {
            if (prop.includes('_src')) {
                resArray.add(localStorage[prop]);
            }
            if (prop.includes('avatars') && localStorage[prop].includes('src')) {
                let avatars = JSON.parse(localStorage[prop]);
                for (let a in avatars) {
                    if (avatars.hasOwnProperty(a)) {
                        resArray.add(avatars[a].src);
                    }
                }      
            }
            if (prop.includes('avatarStruct') && localStorage[prop].includes('src')) {
                resArray.add(JSON.parse(localStorage[prop]).src);
            }
            if (prop.includes('param')) {
                if (localStorage[prop].includes('base'))
                    resArray.add(JSON.parse(localStorage[prop]).base);
                if (localStorage[prop].includes('hover'))
                    resArray.add(JSON.parse(localStorage[prop]).hover);
                if (localStorage[prop].includes('click'))
                    resArray.add(JSON.parse(localStorage[prop]).click);
                if (localStorage[prop].includes('frames')) {
                    let frames = JSON.parse(localStorage[prop]).frames;
                    frames.forEach(f => { resArray.add(f); });
                }
            }
        }
        if (resArray.size>0) {
            let toLoad = new Array();
            resArray.forEach(r => {
                if (!Stage.glManager.hasLoaded(r)) {
                    if (Helper.checkIfImage(r)) toLoad.push(r);
                    if (Helper.checkIfAudio(r)) toLoad.push(r);
                }
            });
            if (toLoad.length > 0) {
                // directly load instead of going to update queue
                Stage.pause = true;
                Stage.glManager.glLoader
                    .add(toLoad)
                    .load((loader, resources) => {
                        Helper.loadCheckpoint(chkpt);
                        Stage.pause = false;
                    });
                    //.on("progress", (loader, resource) => { console.log(`[PIXI]: loading: ${resource.url}`)});
            }
            else {
                Helper.loadCheckpoint(chkpt);
                Stage.pause = false;
            }
        }
    }
    else if (cmd == 'clear') {
		if (chkpt != '') {
			let pattern = "/^"+chkpt+"/g";
			for (let prop in localStorage) {
				if (prop.match(eval(pattern))) {
					localStorage.removeItem(prop);
				}
			}
		}
    }
}