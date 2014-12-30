///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

///////////////////////////////////////////////////////////////////////////////
// Checkpoint - loads/saves at a given checkpoint
///////////////////////////////////////////////////////////////////////////////
function checkpoint(param) {
	if (!Helper.supportsLocalStorage()) return;
	
	var cmd = param;
	var chkpt = ''; 
	if (Config.gameNamedCheckpts) {
		if (typeof param == 'string') {
			cmd = param;
			chkpt = '_auto_';
		}
		else {
			for (var prop in param) {
				if (param.hasOwnProperty(prop)) {
					cmd = prop;
					chkpt = param[prop];
				}
			}
		}
	}
	if (cmd == "save") {
		if (!Config.gameNamedCheckpts) {
			//localStorage.clear(); 
			var pattern = "/_persist_/g";
			for (var prop in localStorage) {
				if (!prop.match(eval(pattern))) {
					localStorage.removeItem(prop);
				}
			}
		}
		else {
			if (chkpt != '') {
				var pattern = "/^"+chkpt+"/g";
				for (var prop in localStorage) {
					if (prop.match(eval(pattern))) {
						localStorage.removeItem(prop);
					}
				}
			}
		}
		// Store script entry point
		if (Stage.script.sequence[0] == label) {
			localStorage[chkpt+"sequence"] = Stage.script.sequence[1];
			localStorage[chkpt+"frame"] = Stage.script.frame;
		}
		else {
			localStorage[chkpt+"sequence"] = '';
			localStorage[chkpt+"frame"] = 0;
		}
		// Store jump stack
		localStorage[chkpt+"frameStack"] = JSON.stringify(Stage.script.frameStack);
		// Store layer 0
		localStorage[chkpt+"l0_count"] = Stage.layers[0].length;
		for (var i=0; i<Stage.layers[0].length; i++) {
			localStorage[chkpt+"l0_"+i+"_id"] = Stage.layers[0][i].context.canvas.id;
			if (typeof Stage.layers[0][i].image == 'string')
				localStorage[chkpt+"l0_"+i+"_src"] = Stage.layers[0][i].image;
			else
				localStorage[chkpt+"l0_"+i+"_src"] = Stage.layers[0][i].image.src;
			localStorage[chkpt+"l0_"+i+"_obj_count"] = Stage.layers[0][i].objects.length;
			for (var j=0; j<Stage.layers[0][i].objects.length; j++) {
				localStorage[chkpt+"l0_"+i+"_obj_"+j+"_src"] = Stage.layers[0][i].objects[j].img.src;
				localStorage[chkpt+"l0_"+i+"_obj_"+j+"_x"] = Stage.layers[0][i].objects[j].x;
				localStorage[chkpt+"l0_"+i+"_obj_"+j+"_y"] = Stage.layers[0][i].objects[j].y;
				localStorage[chkpt+"l0_"+i+"_obj_"+j+"_frames"] = Stage.layers[0][i].objects[j].frames;
				localStorage[chkpt+"l0_"+i+"_obj_"+j+"_fps"] = Stage.layers[0][i].objects[j].fps;
				localStorage[chkpt+"l0_"+i+"_obj_"+j+"_link"] = Stage.layers[0][i].objects[j].link;
			}
			localStorage[chkpt+"l0_"+i+"_alpha"] = Stage.layers[0][i].alpha;
			localStorage[chkpt+"l0_"+i+"_visible"] = Stage.layers[0][i].visible;
			localStorage[chkpt+"l0_"+i+"_effects"] = Stage.layers[0][i].effects;
			localStorage[chkpt+"l0_"+i+"_time"] = Stage.layers[0][i].transTime;
			localStorage[chkpt+"l0_"+i+"_orientation"] = Stage.layers[0][i].orientation;
			localStorage[chkpt+"l0_"+i+"_size"] = Stage.layers[0][i].size;
		}
		// Store layer 1
		localStorage[chkpt+"l1_count"] = Stage.layers[1].length;
		for (var i=0; i<Stage.layers[1].length; i++) {
			localStorage[chkpt+"l1_"+i+"_id"] = Stage.layers[1][i].id;
			localStorage[chkpt+"l1_"+i+"_nick"] = Stage.layers[1][i].nick;
			localStorage[chkpt+"l1_"+i+"_color"] = Stage.layers[1][i].color;
			localStorage[chkpt+"l1_"+i+"_zorder"] = Stage.layers[1][i].z_order;
			localStorage[chkpt+"l1_"+i+"_sprites_count"] = Stage.layers[1][i].sprites.length;
			for (var j=0; j<Stage.layers[1][i].sprites.length; j++) {
				localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_id"] = Stage.layers[1][i].sprites[j].id;
				localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_src"] = Stage.layers[1][i].sprites[j].src.src;			
				localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_align"] = Stage.layers[1][i].sprites[j].align;			
				localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_frames"] = Stage.layers[1][i].sprites[j].frames;			
				localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_fps"] = Stage.layers[1][i].sprites[j].fps;			
				localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_reps"] = Stage.layers[1][i].sprites[j].reps;			
			}
			localStorage[chkpt+"l1_"+i+"_offset_x"] = Stage.layers[1][i].offset.vx;
			localStorage[chkpt+"l1_"+i+"_offset_y"] = Stage.layers[1][i].offset.vy;
			if (Stage.layers[1][i].avatar != null)
				localStorage[chkpt+"l1_"+i+"_avatar"] = Stage.layers[1][i].avatar.src;
			else
				localStorage[chkpt+"l1_"+i+"_avatar"] = "undefined";
			if (Stage.layers[1][i].avatars != null)
				localStorage[chkpt+"l1_"+i+"_avatars"] = JSON.stringify(Stage.layers[1][i].avatars);
			else
				localStorage[chkpt+"l1_"+i+"_avatars"] = "undefined";
			localStorage[chkpt+"l1_"+i+"_active"] = Stage.layers[1][i].activeSprite;
			localStorage[chkpt+"l1_"+i+"_alpha"] = Stage.layers[1][i].alpha;
			if (Stage.layers[1][i].prevFx != '')
				localStorage[chkpt+"l1_"+i+"_effects"] = Stage.layers[1][i].prevFx;
			else
				localStorage[chkpt+"l1_"+i+"_effects"] = "undefined";
			localStorage[chkpt+"l1_"+i+"_time"] = Stage.layers[1][i].transTime;
			localStorage[chkpt+"l1_"+i+"_visible"] = Stage.layers[1][i].visible;
			localStorage[chkpt+"l1_"+i+"_pending"] = Stage.layers[1][i].pendingRemoval;
			localStorage[chkpt+"l1_"+i+"_posMode"] = Stage.layers[1][i].posMode;
			//localStorage[chkpt+"l1_"+i+"_fxparam"] = Stage.layers[1][i].fxparam;
			localStorage[chkpt+"l1_"+i+"_orientation"] = Stage.layers[1][i].orientation;
			localStorage[chkpt+"l1_"+i+"_size"] = Stage.layers[1][i].size;
			localStorage[chkpt+"l1_"+i+"_stats"] = JSON.stringify(Stage.layers[1][i].stats);
		}
		// Store layer 2
		localStorage[chkpt+"l2_count"] = Stage.layers[2].length;
		for (var i=0; i<Stage.layers[2].length; i++) {
			localStorage[chkpt+"l2_"+i+"_id"] = Stage.layers[2][i].context.canvas.id;
			if (typeof Stage.layers[2][i].image == 'string')
				localStorage[chkpt+"l2_"+i+"_src"] = Stage.layers[2][i].image;
			else
				localStorage[chkpt+"l2_"+i+"_src"] = Stage.layers[2][i].image.src;
			localStorage[chkpt+"l2_"+i+"_alpha"] = Stage.layers[2][i].alpha;
			localStorage[chkpt+"l2_"+i+"_visible"] = Stage.layers[2][i].visible;
			localStorage[chkpt+"l2_"+i+"_effects"] = Stage.layers[2][i].effects;
			localStorage[chkpt+"l2_"+i+"_time"] = Stage.layers[2][i].transTime;
			localStorage[chkpt+"l2_"+i+"_scroll"] = Stage.layers[2][i].scroll;
			localStorage[chkpt+"l2_"+i+"_offset_x"] = Stage.layers[2][i].offset.vx;
			localStorage[chkpt+"l2_"+i+"_offset_y"] = Stage.layers[2][i].offset.vy;
			localStorage[chkpt+"l2_"+i+"_orientation"] = Stage.layers[2][i].orientation;
			localStorage[chkpt+"l2_"+i+"_size"] = Stage.layers[2][i].size;
			localStorage[chkpt+"l2_"+i+"_frames"] = Stage.layers[2][i].ovFrames;
			localStorage[chkpt+"l2_"+i+"_fps"] = Stage.layers[2][i].ovFps;
		}
		// Store layer 3
		localStorage[chkpt+"l3_count"] = Stage.layers[3].length;
		for (var i=0; i<Stage.layers[3].length; i++) {
			localStorage[chkpt+"l3_"+i+"_id"] = Stage.layers[3][i].context.canvas.id;
			localStorage[chkpt+"l3_"+i+"_type"] = Stage.layers[3][i].type;
			localStorage[chkpt+"l3_"+i+"_action"] = Stage.layers[3][i].action;
			localStorage[chkpt+"l3_"+i+"_visible"] = Stage.layers[3][i].visible;
			localStorage[chkpt+"l3_"+i+"_param"] = JSON.stringify(Stage.layers[3][i].saveparam);
		}
		// Store layer 4
		localStorage[chkpt+"l4_count"] = Stage.layers[4].length;
		for (var i=0; i<Stage.layers[4].length; i++) {
			localStorage[chkpt+"l4_"+i+"_type"] = Stage.layers[4][i].type;
			if (Stage.layers[4][i].type == "box") {
				localStorage[chkpt+"l4_"+i+"_visible"] = Stage.layers[4][i].visible;
				localStorage[chkpt+"l4_"+i+"_text"] = Stage.layers[4][i].text;
				localStorage[chkpt+"l4_"+i+"_pos"] = Stage.layers[4][i].pos;
				localStorage[chkpt+"l4_"+i+"_back"] = Stage.layers[4][i].back;
				if (Stage.layers[4][i].src != null)
					localStorage[chkpt+"l4_"+i+"_src"] = Stage.layers[4][i].src;
				else
					localStorage[chkpt+"l4_"+i+"_src"] = "undefined";
				if (Stage.layers[4][i].psrc != '')
					localStorage[chkpt+"l4_"+i+"_prompt"] = Stage.layers[4][i].psrc;
				else
					localStorage[chkpt+"l4_"+i+"_prompt"] = "undefined";
				if (Stage.layers[4][i].avatar != null) {
					localStorage[chkpt+"l4_"+i+"_avatar"] = Stage.layers[4][i].avatar.src;
					localStorage[chkpt+"l4_"+i+"_avatarStruct"] = Stage.layers[4][i].avatarStruct;
				}
				else {
					localStorage[chkpt+"l4_"+i+"_avatar"] = "undefined";
					localStorage[chkpt+"l4_"+i+"_avatarStruct"] = "undefined";
				}
				if (Stage.layers[4][i].balloon != null)
					localStorage[chkpt+"l4_"+i+"_balloon"] = Stage.layers[4][i].balloon;
				else
					localStorage[chkpt+"l4_"+i+"_balloon"] = "undefined";
				localStorage[chkpt+"l4_"+i+"_cont"] = Stage.layers[4][i].cont;
				localStorage[chkpt+"l4_"+i+"_fontFamily"] = Stage.layers[4][i].fontFamily;
				localStorage[chkpt+"l4_"+i+"_fontSize"] = Stage.layers[4][i].fontSize;
				localStorage[chkpt+"l4_"+i+"_lineHeight"] = Stage.layers[4][i].lineHeight;
				localStorage[chkpt+"l4_"+i+"_fontWeight"] = Stage.layers[4][i].fontWeight;
				localStorage[chkpt+"l4_"+i+"_fontColor"] = Stage.layers[4][i].fontColor;
				localStorage[chkpt+"l4_"+i+"_tagFamily"] = Stage.layers[4][i].tagFamily;
				localStorage[chkpt+"l4_"+i+"_tagSize"] = Stage.layers[4][i].tagSize;
				localStorage[chkpt+"l4_"+i+"_tagWeight"] = Stage.layers[4][i].tagWeight;
				localStorage[chkpt+"l4_"+i+"_tagColor"] = Stage.layers[4][i].tagColor;
				localStorage[chkpt+"l4_"+i+"_timeout"] = Stage.layers[4][i].timeout;
				localStorage[chkpt+"l4_"+i+"_textAlign"] = Stage.layers[4][i].textAlign;
				localStorage[chkpt+"l4_"+i+"_offset_x"] = Stage.layers[4][i].textOffset.vx;
				localStorage[chkpt+"l4_"+i+"_offset_y"] = Stage.layers[4][i].textOffset.vy;
				localStorage[chkpt+"l4_"+i+"_inputFocus"] = Stage.layers[4][i].inputFocus;
				localStorage[chkpt+"l4_"+i+"_alpha"] = Stage.layers[4][i].alpha;
				localStorage[chkpt+"l4_"+i+"_effects"] = Stage.layers[4][i].effects;
				localStorage[chkpt+"l4_"+i+"_jumpTo_count"] = Stage.layers[4][i].jumpTo.length;
				for (var j=0; j<Stage.layers[4][i].jumpTo.length; j++) {
					localStorage[chkpt+"l4_"+i+"jumpTo"+j+"hotspot_x"] = Stage.layers[4][i].jumpTo[j].hotspot[0];
					localStorage[chkpt+"l4_"+i+"jumpTo"+j+"hotspot_y"] = Stage.layers[4][i].jumpTo[j].hotspot[1];
					localStorage[chkpt+"l4_"+i+"jumpTo"+j+"link"] = Stage.layers[4][i].jumpTo[j].link;
				}
			}
			else {
				localStorage[chkpt+"l4_"+i+"_type"] = Stage.layers[4][i].type;
				localStorage[chkpt+"l4_"+i+"_id"] = Stage.layers[4][i].id;
				if (Stage.layers[4][i].group != '')
					localStorage[chkpt+"l4_"+i+"_group"] = Stage.layers[4][i].group;
				else
					localStorage[chkpt+"l4_"+i+"_group"] = "undefined";
				localStorage[chkpt+"l4_"+i+"_param"] = JSON.stringify(Stage.layers[4][i].saveparam);			
				localStorage[chkpt+"l4_"+i+"_text"] = Stage.layers[4][i].text;
				localStorage[chkpt+"l4_"+i+"_visible"] = Stage.layers[4][i].visible;
				if ((Stage.layers[4][i].link != null) && (Stage.layers[4][i].link.length > 0)) {
					localStorage[chkpt+"l4_"+i+"_link_count"] = Stage.layers[4][i].link.length;
					for (var j=0; j<Stage.layers[4][i].link.length; j+=2) {
						localStorage[chkpt+"l4_"+i+"_link_"+j] = Stage.layers[4][i].link[j].toString().split(/[\s|(|)|{|}]/g, 2)[1];
						localStorage[chkpt+"l4_"+i+"_link_"+(j+1)] = JSON.stringify(Stage.layers[4][i].link[j+1]);
					}
				}
				else {
					localStorage[chkpt+"l4_"+i+"_link_count"] = 0;				
					//localStorage[chkpt+"l4_"+i+"_link_0"] = "undefined";
					//localStorage[chkpt+"l4_"+i+"_link_1"] = "undefined";
				}
			}
		}
		// Store sounds
		for (var i=0; i<4; i++) {
			localStorage[chkpt+"s"+i+"_count"] = Stage.sounds[i].length;
			for (var j=0; j<Stage.sounds[i].length; j++) {
				localStorage[chkpt+"s"+i+"_"+j+"_src"] = Stage.sounds[i][j].src;
				localStorage[chkpt+"s"+i+"_"+j+"_repeat"] = Stage.sounds[i][j].repeat;
				localStorage[chkpt+"s"+i+"_"+j+"_delay"] = Stage.sounds[i][j].delay;
				localStorage[chkpt+"s"+i+"_"+j+"_isStopping"] = Stage.sounds[i][j].isStopping;
				localStorage[chkpt+"s"+i+"_"+j+"_isPaused"] = Stage.sounds[i][j].isPaused;
			}
		}
		// Store video?? No need. Videos are non-persistent data anyway
		// Store user variables
		var uv_count = 0;
		for (var prop in Stage.variables) {
			if (Stage.variables.hasOwnProperty(prop)) {
				localStorage[chkpt+"uv"+uv_count+"_name"] = prop;
				localStorage[chkpt+"uv"+uv_count+"_value"] = JSON.stringify(Stage.variables[prop].Value());
				localStorage[chkpt+"uv"+uv_count+"_type"] = Stage.variables[prop].Type();
				if (Stage.variables[prop].persist) {
					localStorage[chkpt+"uv"+uv_count+"_persist"] =  true;
					localStorage["_persist_uv_"+prop] = JSON.stringify(Stage.variables[prop].Value());
				}
				else
					localStorage[chkpt+"uv"+uv_count+"_persist"] =  false;
				uv_count++;
			}
		}
		localStorage[chkpt+"uv_count"] = uv_count;
		// Store forms
		localStorage[chkpt+"forms_count"] = Stage.formStack.length;
		for (var i=0; i<Stage.formStack.length; i++) {
			localStorage[chkpt+"formStack_"+i] = Stage.formStack[i];
		}
		localStorage[chkpt+"forms_style_count"] = Stage.formStyle.length;
		for (var i=0; i<Stage.formStyle.length; i++) {
			localStorage[chkpt+"formStyle_"+i] = Stage.formStyle[i];
		}
		// Store animation sets
		var aset_count = 0;
		for (var prop in Stage.animations) {
			if (Stage.animations.hasOwnProperty(prop)) {
				localStorage[chkpt+"animation"+aset_count+"_name"] = prop;
				localStorage[chkpt+"animation"+aset_count+"_value"] = JSON.stringify(Stage.animations[prop]);
				aset_count++;
			}
		}
		localStorage[chkpt+"aset_count"] = aset_count;
		// Store config
		localStorage[chkpt+"Config"] = JSON.stringify(Config);
	}
	else if (cmd == "load") {
		var chkpt_exist = false;
		if (chkpt != '') {
			var pattern = "/^"+chkpt+"/g";
			for (var prop in localStorage) {
				if (prop.match(eval(pattern))) {
					chkpt_exist = true;
					break;
				}
			}
		}
		else chkpt_exist = true;
		if ((localStorage.length <= 0) || !chkpt_exist){
			alert ("No checkpoint data found!\nStarting a new game instead...");
			return;
		}
		// populate layer 0
		Stage.layers[0].splice(0, Stage.layers[0].length);
		for (var i=0; i<parseInt(localStorage[chkpt+"l0_count"]); i++) {
			var bg = new Backdrop();
			bg.type = 'scene';
			var obj = new Array();
			for (var j=0; j<parseInt(localStorage[chkpt+"l0_"+i+"_obj_count"]); j++) {
				var item = {src:'', x:0, y:0, frames:1, fps:0};
				item.src = localStorage[chkpt+"l0_"+i+"_obj_"+j+"_src"];
				item.x = parseInt(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_x"]);
				item.y = parseInt(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_y"]);
				item.frames = parseInt(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_frames"]);
				item.fps = parseInt(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_fps"]);
				item.link = localStorage[chkpt+"l0_"+i+"_obj_"+j+"_link"];
				obj.push(item);
			}
			bg.Create(localStorage[chkpt+"l0_"+i+"_id"], localStorage[chkpt+"l0_"+i+"_src"], obj);
			bg.effects = localStorage[chkpt+"l0_"+i+"_effects"];
			bg.alpha = parseFloat(localStorage[chkpt+"l0_"+i+"_alpha"]);
			bg.visible = (localStorage[chkpt+"l0_"+i+"_visible"] == "true");
			bg.transTime = parseFloat(localStorage[chkpt+"l0_"+i+"_time"]);
			bg.orientation = parseFloat(localStorage[chkpt+"l0_"+i+"_orientation"]);
			bg.rotation = parseFloat(localStorage[chkpt+"l0_"+i+"_orientation"]);
			bg.size = parseFloat(localStorage[chkpt+"l0_"+i+"_size"]);
			bg.scale = parseFloat(localStorage[chkpt+"l0_"+i+"_size"]);
			Stage.layers[0].push(bg);
			obj = null; bg = null;
		}
		// populate layer 1
		Stage.layers[1].splice(0, Stage.layers[1].length);
		for (var i=0; i<parseInt(localStorage[chkpt+"l1_count"]); i++) {
			var chr = new Character(localStorage[chkpt+"l1_"+i+"_id"]);
			//chr.type = 'actor';
			//chr.Create(localStorage[chkpt+"l1_"+i+"_id"]);
			chr.nick = localStorage[chkpt+"l1_"+i+"_nick"];
			chr.color = localStorage[chkpt+"l1_"+i+"_color"];
			chr.z_order = parseInt(localStorage[chkpt+"l1_"+i+"_zorder"]);
			for (var j=0; j<parseInt(localStorage[chkpt+"l1_"+i+"_sprites_count"]); j++) {
				var sprite = new Array(6);
				sprite[0] = localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_id"];
				sprite[1] = localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_src"];
				sprite[2] = localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_align"];
				sprite[3] = parseInt(localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_frames"]);
				sprite[4] = parseInt(localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_fps"]);
				sprite[5] = parseInt(localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_reps"]);
				chr.AddSprite(sprite);
				//chr.AddSprite(localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_id"], 
				//			  localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_src"],
				//			  localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_align"]);
			}
			if (localStorage[chkpt+"l1_"+i+"_avatar"] != "undefined")
				chr.AddAvatar(localStorage[chkpt+"l1_"+i+"_avatar"]);
			else 
				chr.AddAvatar('');
			if (localStorage[chkpt+"l1_"+i+"_avatars"] != "undefined")
				chr.avatars = JSON.parse(localStorage[chkpt+"l1_"+i+"_avatars"]);
			else 
				chr.avatars = [];
			chr.activeSprite = parseInt(localStorage[chkpt+"l1_"+i+"_active"]);
			chr.offset = new Vector2d(parseInt(localStorage[chkpt+"l1_"+i+"_offset_x"]), parseInt(localStorage[chkpt+"l1_"+i+"_offset_y"]))
			chr.alpha = parseFloat(localStorage[chkpt+"l1_"+i+"_alpha"]);
			//chr.effects = localStorage[chkpt+"l1_"+i+"_effects"];
			if (localStorage[chkpt+"l1_"+i+"_effects"] != "undefined")
				chr.prevFx = localStorage[chkpt+"l1_"+i+"_effects"];
			else
				chr.prevFx = 'done';
			chr.transTime = parseFloat(localStorage[chkpt+"l1_"+i+"_time"]);
			chr.visible = (localStorage[chkpt+"l1_"+i+"_visible"] == "true");
			chr.pendingRemoval = (localStorage[chkpt+"l1_"+i+"_pending"] == "true");
			chr.posMode = localStorage[chkpt+"l1_"+i+"_posMode"];
			//chr.fxparam = localStorage[chkpt+"l1_"+i+"_fxparam"];
			chr.orientation = parseFloat(localStorage[chkpt+"l1_"+i+"_orientation"]);
			chr.rotation = parseFloat(localStorage[chkpt+"l1_"+i+"_orientation"]);
			chr.size = parseFloat(localStorage[chkpt+"l1_"+i+"_size"]);
			chr.scale = parseFloat(localStorage[chkpt+"l1_"+i+"_size"]);
			chr.stats = JSON.parse(localStorage[chkpt+"l1_"+i+"_stats"]);
			Stage.layers[1].push(chr);
			chr = null;
		}
		// populate layer 2
		Stage.layers[2].splice(0, Stage.layers[2].length);
		for (var i=0; i<parseInt(localStorage[chkpt+"l2_count"]); i++) {
			var ovl = new Backdrop();
			ovl.type = 'overlay';
			ovl.Create(localStorage[chkpt+"l2_"+i+"_id"], localStorage[chkpt+"l2_"+i+"_src"], null);
			ovl.effects = localStorage[chkpt+"l2_"+i+"_effects"];
			ovl.alpha = parseFloat(localStorage[chkpt+"l2_"+i+"_alpha"]);
			ovl.visible = (localStorage[chkpt+"l2_"+i+"_visible"] == "true");
			ovl.transTime = parseFloat(localStorage[chkpt+"l2_"+i+"_time"]);
			ovl.scroll = (localStorage[chkpt+"l2_"+i+"_scroll"] == "true");
			ovl.offset = new Vector2d(parseInt(localStorage[chkpt+"l2_"+i+"_offset_x"]), parseInt(localStorage[chkpt+"l2_"+i+"_offset_y"]))
			ovl.orientation = parseFloat(localStorage[chkpt+"l2_"+i+"_orientation"]);
			ovl.rotation = parseFloat(localStorage[chkpt+"l2_"+i+"_orientation"]);
			ovl.size = parseFloat(localStorage[chkpt+"l2_"+i+"_size"]);
			ovl.scale = parseFloat(localStorage[chkpt+"l2_"+i+"_size"]);
			ovl.ovFrames = parseInt(localStorage[chkpt+"l2_"+i+"_frames"]);
			ovl.ovFps = parseInt(localStorage[chkpt+"l2_"+i+"_fps"]);
			//localStorage[chkpt+"l2_"+i+"_fps"] = Stage.layers[2][i].ovFps;
			Stage.layers[2].push(ovl);
			ovl = null;
		}
		// populate layer 3
		Stage.layers[3].splice(0, Stage.layers[3].length);
		for (var i=0; i<parseInt(localStorage[chkpt+"l3_count"]); i++) {
			var atm = new Atmosphere(localStorage[chkpt+"l3_"+i+"_id"]);
			var param = JSON.parse(localStorage[chkpt+"l3_"+i+"_param"]);
			//atm.Create(localStorage[chkpt+"l3_"+i+"_id"]);
			atm.Init(localStorage[chkpt+"l3_"+i+"_type"], param);
			atm.action = localStorage[chkpt+"l3_"+i+"_action"];
			atm.visible = (localStorage[chkpt+"l3_"+i+"_visible"] == "true");
			Stage.layers[3].push(atm);
			atm = null;
		}
		// populate layer 4
		Stage.layers[4].splice(0, Stage.layers[4].length);
		for (var i=0; i<parseInt(localStorage[chkpt+"l4_count"]); i++) {
			if (localStorage[chkpt+"l4_"+i+"_type"] == 'box') {
				var sb = new ScriptBox();
				sb.Create(Stage.canvas.width, Stage.canvas.height);
				sb.visible = (localStorage[chkpt+"l4_"+i+"_visible"] == "true");
				sb.text = localStorage[chkpt+"l4_"+i+"_text"];
				sb.pos = localStorage[chkpt+"l4_"+i+"_pos"];
				sb.back = localStorage[chkpt+"l4_"+i+"_back"];
				if (localStorage[chkpt+"l4_"+i+"_src"] != "undefined")
					sb.src = localStorage[chkpt+"l4_"+i+"_src"];
				else
					sb.src = null;
				if (localStorage[chkpt+"l4_"+i+"_prompt"] != "undefined") {
					sb.psrc = localStorage[chkpt+"l4_"+i+"_prompt"];
					sb.prompt.src = sb.psrc;
				}
				else 
					sb.psrc = '';
				if (localStorage[chkpt+"l4_"+i+"_avatar"] != "undefined") {
					for (var j in Stage.layers[1]) {
						if (Stage.layers[1][j].avatar && 
						   (Stage.layers[1][j].avatar.src.search(localStorage[chkpt+"l4_"+i+"_avatar"])!=-1)) {
							sb.avatar = Stage.layers[1][j].avatar;
							for (var k in Stage.layers[1][j].avatars) {
								if (Stage.layers[1][j].avatars[k].src == localStorage[chkpt+"l4_"+i+"_avatar"]) {
									sb.avatarStruct = JSON.parse(chkpt+"l4_"+i+"_avatarStruct");
									break;
								}
							}
							break;
						}
					}
				}
				else
					sb.avatar = null;
				if (localStorage[chkpt+"l4_"+i+"_balloon"] != "undefined")
					sb.balloon = localStorage[chkpt+"l4_"+i+"_balloon"];
				else
					sb.balloon = null;
				sb.cont = (localStorage[chkpt+"l4_"+i+"_cont"] == "true");
				sb.fontFamily = localStorage[chkpt+"l4_"+i+"_fontFamily"];
				sb.fontSize = localStorage[chkpt+"l4_"+i+"_fontSize"];
				sb.lineHeight = localStorage[chkpt+"l4_"+i+"_lineHeight"];
				sb.fontWeight = localStorage[chkpt+"l4_"+i+"_fontWeight"];
				sb.fontColor = localStorage[chkpt+"l4_"+i+"_fontColor"];
				sb.tagFamily = localStorage[chkpt+"l4_"+i+"_tagFamily"];
				sb.tagSize = localStorage[chkpt+"l4_"+i+"_tagSize"];
				sb.tagWeight = localStorage[chkpt+"l4_"+i+"_tagWeight"];
				sb.tagColor = localStorage[chkpt+"l4_"+i+"_tagColor"];
				sb.timeout = parseFloat(localStorage[chkpt+"l4_"+i+"_timeout"]);
				sb.textAlign = localStorage[chkpt+"l4_"+i+"_textAlign"];
				sb.textOffset.vx = parseInt(localStorage[chkpt+"l4_"+i+"_offset_x"]);
				sb.textOffset.vy = parseInt(localStorage[chkpt+"l4_"+i+"_offset_y"]);
				sb.inputFocus = (localStorage[chkpt+"l4_"+i+"_inputFocus"] == "true");
				sb.alpha = parseFloat(localStorage[chkpt+"l4_"+i+"_alpha"]);
				sb.effects = localStorage[chkpt+"l4_"+i+"_effects"];
				for (var j=0; j<parseInt(localStorage[chkpt+"l4_"+i+"_jumpTo_count"]); j++) {
					var menuItem = {hotspot:[], link:''};
					menuItem.link = localStorage[chkpt+"l4_"+i+"jumpTo"+j+"link"];
					menuItem.hotspot = [parseInt(localStorage[chkpt+"l4_"+i+"jumpTo"+j+"hotspot_x"]),
										parseInt(localStorage[chkpt+"l4_"+i+"jumpTo"+j+"hotspot_y"])];
					sb.jumpTo.push(menuItem);
				}			
				Stage.layers[4].push(sb);
				sb = null;
			}
			else {
				var element = new ActiveImage();
				var link = new Array();
				element.saveparam = JSON.parse(localStorage[chkpt+"l4_"+i+"_param"]);
				element.type = localStorage[chkpt+"l4_"+i+"_type"];
				CformElements[element.type]['_init'](element, element.saveparam);
				if (localStorage[chkpt+"l4_"+i+"_group"] != "undefined")
					element.group = localStorage[chkpt+"l4_"+i+"_group"];
				element.text = localStorage[chkpt+"l4_"+i+"_text"];
				element.visible = (localStorage[chkpt+"l4_"+i+"_visible"] == "true");
				for (var j=0; j<parseInt(localStorage[chkpt+"l4_"+i+"_link_count"]); j+=2) {
					link.push(eval(localStorage[chkpt+"l4_"+i+"_link_"+j]));
					link.push(JSON.parse(localStorage[chkpt+"l4_"+i+"_link_"+(j+1)]));
				}
				if (link.length > 0)
					element.link = link;
				else
					element.link = null;
				/*if ((localStorage[chkpt+"l4_"+i+"_link_0"] != "undefined") && 
					(localStorage[chkpt+"l4_"+i+"_link_1"] != "undefined")) {
					var link = new Array();
					link.push(eval(localStorage[chkpt+"l4_"+i+"_link_0"]));
					link.push(JSON.parse(localStorage[chkpt+"l4_"+i+"_link_1"]));
					element.link = link;
				}*/
				Stage.layers[4].push(element);
				element = null;
			}
		}
		// Populate sounds
		for (var i=0; i<4; i++) {
			Stage.sounds[i].splice(0, Stage.sounds[i].length);
			for (var j=0; j<parseInt(localStorage[chkpt+"s"+i+"_count"]); j++) {
				var s = new Sounds();
				s.src = localStorage[chkpt+"s"+i+"_"+j+"_src"];
				s.repeat = parseInt(localStorage[chkpt+"s"+i+"_"+j+"_repeat"]);
				s.delay = parseFloat(localStorage[chkpt+"s"+i+"_"+j+"_delay"]);
				s.isStopping = (localStorage[chkpt+"s"+i+"_"+j+"_isStopping"] == "true");
				s.isPaused = (localStorage[chkpt+"s"+i+"_"+j+"_isPaused"] == "true");
				Stage.sounds[i].push(s);
				s = null;
			}
		}
		// populate user variables
		Stage.variables = {};
		for (var i=0; i<parseInt(localStorage[chkpt+"uv_count"]); i++) {
			var uv = new UserVars();
			uv.Set(JSON.parse(localStorage[chkpt+"uv"+i+"_value"]),(localStorage[chkpt+"uv"+i+"_persist"] == "true"));
			Stage.variables[localStorage[chkpt+"uv"+i+"_name"]] = uv;
			uv = null;
		}
		// overwrite persistent user variables
		for (var prop in localStorage) {
			if (prop.match(/^_persist_uv_/g)) {
				var uv = new UserVars();
				uv.Set(JSON.parse(localStorage[prop]), true);
				Stage.variables[prop.replace(/^_persist_uv_/g,'')] = uv;
				uv = null;
			}
		}
		
		// populate form stack and style
		Stage.formStack.splice(0, Stage.formStack.length);
		for (var i=0; i<parseInt(localStorage[chkpt+"forms_count"]); i++) {
			Stage.formStack.push(localStorage[chkpt+"formStack_"+i]);
		}
		Stage.formStyle.splice(0, Stage.formStyle.length);
		for (var i=0; i<parseInt(localStorage[chkpt+"forms_style_count"]); i++) {
			Stage.formStyle.push(localStorage[chkpt+"formStyle_"+i]);
		}
		// populate animations
		Stage.animations = [];
		for (var i=0; i<parseInt(localStorage[chkpt+"aset_count"]); i++) {
			Stage.animations[localStorage[chkpt+"animation"+i+"_name"]] = JSON.parse(localStorage[chkpt+"animation"+i+"_value"]);
		}
		// populate Config
		Config = JSON.parse(localStorage[chkpt+"Config"]);
		Helper.configUpdate("activeTheme");
		
		// populate frameStack
		Stage.script.frameStack = JSON.parse(localStorage[chkpt+"frameStack"])
		// then jump to checkpoint location
		if (localStorage[chkpt+"sequence"] != '') {
			Helper.scriptLoad(localStorage[chkpt+"sequence"], function() {
				Stage.script.sequence = eval(localStorage[chkpt+"sequence"]);
			});
		}
		// Stage.script.sequence = eval(localStorage[chkpt+"sequence"]);
		Stage.script.frame = parseInt(localStorage[chkpt+"frame"]);
	}
	else if (cmd == 'clear') {
		if (chkpt != '') {
			var pattern = "/^"+chkpt+"/g";
			for (var prop in localStorage) {
				if (prop.match(eval(pattern))) {
					localStorage.removeItem(prop);
				}
			}
		}
	}
}

