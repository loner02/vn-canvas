///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

///////////////////////////////////////////////////////////////////////////////
// Local Helpers
///////////////////////////////////////////////////////////////////////////////
// Helper function to check for audio file
Helper.checkIfAudio = (function(src) {
	src = Helper.parseArg(src);
	return (/mp3|m4a|ogg|oga|wav|webma/i.test(src));
});
// Helper function to check for video file
Helper.checkIfVideo = (function(src) {
	src = Helper.parseArg(src);
	return (/mp4|m4v|ogg|ogv|webm|webmv/i.test(src));
});

///////////////////////////////////////////////////////////////////////////////
// Script method callback/handlers
// Note: other commands are included in their respective stage elements
///////////////////////////////////////////////////////////////////////////////
// label - marks a position in the script
function label(param) { }
// message - display a message box
function message(param) { alert(param); }
// wait - pauses execution
function wait(param) {
	Stage.pause = true;
	if (param > 0) {
		Stage.utimer = setTimeout(function() { 
			Stage.pause = false; 
			Stage.utimerOn = false;
		}, param * 1000);
		Stage.utimerOn = true;
	}
}
// macro - execute a user function
function macro(param) {
	if (Config.gameAllowMacro) {
		if (typeof param == 'string')
			eval(param)();
		else {
			for (var prop in param) {
				if (param.hasOwnProperty(prop)) {
					eval(prop)(param[prop]);
				}
			}
		}
	}
}
// screen - do some screen actions
function screen(param) {
	for (var prop in param) {
		if (param.hasOwnProperty(prop)) {
			if (prop == 'shake') {
				Stage.shake = param.shake;
				Stage.Transition(param.duration ? param.duration: Config.transTime);
			}
			if (prop == 'fall') {
				Stage.fall = param.fall;
				Stage.Transition(param.duration ? param.duration: Config.transTime);
			}
			if (prop == 'snap') {
				var img = Stage.canvas.toDataURL("image/"+param.snap);
				window.open(img,'_blank','width='+Stage.canvas.width+',height='+Stage.canvas.height);
			}
		}
	}
	Stage.redraw = true;
}
// animation - define an animation set
function animation(param) {
	Stage.animations[param[0]] = param.slice(1);
}
// jump - continues execution at given label
function jump(param) {
	if (typeof param == 'string') {
		if (param == 'return') {
			Stage.script.PopFrame();
			Stage.pause = true;
		}
		else if (param.indexOf("http") != -1) {
			var newwin = window.open(param, '_blank');
			window.setTimeout('newwin.focus();', 250);
		}
		else if (param == 'pop') {
			Stage.script.frameStack.pop();
			Stage.pause = false;
			return;
		}
		else {
			if (param.indexOf('$') != 0)
				Stage.script.PushFrame();
			Stage.script.SetFrame(param.replace('$',''));
		}
	}
	else {
		if (param.label.indexOf('$') != 0)
			Stage.script.PushFrame();
		var arr_param = new Array();
		for (var prop in param) {
			if (param.hasOwnProperty(prop)) {
				arr_param.push(prop);
				arr_param.push(JSON.stringify(param[prop]));
			}
		}
		
		var compare = false;
		for (var i=0; i<arr_param.length; i+=2) {
			//arr_param[i] = eval(arr_param[i]);
			if (arr_param[i] == 'label') continue;
			arr_param[i+1] = eval(arr_param[i+1]);

			compare = false;
			var val = Helper.getValue(arr_param[i]);
			if (val != null) {
				if (typeof val == 'number') {
					if (val >= arr_param[i+1])
						compare = true;
				}
				else if (typeof val == 'string') {
					if (val === arr_param[i+1])
						compare = true;
				}
				else {
					if (val == arr_param[i+1])
						compare = true;
				}
			}
			if (compare == false) break;
		}
		if (compare == true)
			Stage.script.SetFrame(param.label.replace('$',''));
	}
	Stage.layers[4][0].jumpTo.splice(0,Stage.layers[4][0].jumpTo.length);
}
// tile - navigate scenes using tiles
function tile(param) {
	// create navigation user variables if non-existent
	if (Helper.findVar("_nav_loc") == null) {
		var uv = new UserVars();
		uv.Set("", false);
		Stage.variables["_nav_loc"] = uv;
	}
	if (Helper.findVar("_nav_dir") == null) {
		var uv = new UserVars();
		uv.Set(0, false);	//0:N, 1:E, 2:S, 3:W
		Stage.variables["_nav_dir"] = uv;
	}
	if (Helper.findVar("_nav_move") == null) {
		var uv = new UserVars();
		uv.Set("", false);	//stay or "", forward, left, back, right
		Stage.variables["_nav_move"] = uv;
	}
	
	Stage.variables["_nav_loc"].Set(param.id, false);
	if (Stage.variables["_nav_move"].Value() == "forward") {
		jump(param.link[Stage.variables["_nav_dir"].Value()]);
	}
	else if (Stage.variables["_nav_move"].Value() == "back") {
		jump(param.link[(Stage.variables["_nav_dir"].Value()+2)%4]);
	}
	else if (Stage.variables["_nav_move"].Value() == "left") {
		if (Stage.variables["_nav_dir"].Value() == 0)
			Stage.variables["_nav_dir"].Set(3, false);
		else
			Stage.variables["_nav_dir"].Set(Stage.variables["_nav_dir"].Value()-1, false);
		var sparam = {};
		sparam.src = param.wall[Stage.variables["_nav_dir"].Value()];
		sparam.effect = "dissolve";
		scene(sparam);
	}
	else if (Stage.variables["_nav_move"].Value() == "right") {
		Stage.variables["_nav_dir"].Set((Stage.variables["_nav_dir"].Value()+1)%4, false);
		var sparam = {};
		sparam.src = param.wall[Stage.variables["_nav_dir"].Value()];
		sparam.effect = "dissolve";
		scene(sparam);
	}
	else {
		var sparam = {};
		sparam.src = param.wall[Stage.variables["_nav_dir"].Value()];
		sparam.effect = "dissolve";
		scene(sparam);
	}
	Stage.variables["_nav_move"].Set("",false);
	
	if (param.map && (Helper.findVar("_nav_automap") != null)) {
		var val = Stage.variables["_nav_automap"].Value();
		val[param.map[0]][param.map[1]] = 1;
		Stage.variables["_nav_automap"].Set(val, false);
		
		if (Helper.findVar("_nav_pos") == null) {
			var uv = new UserVars();
			uv.Set(0, false);
			Stage.variables["_nav_pos"] = uv;
		}
		Stage.variables["_nav_pos"].Set(param.map, false);
		
		// force an automap redraw
		for (var i in Stage.layers[3]) {
			if (Stage.layers[3][i].type == 'minimap') {
				Stage.layers[3][i].redraw = true;
				break;
			}
		}
	}
}
// automap - display an auto-revealing map, to be used with tiles
function automap(param) {
	// automap uses atmo, tile uses scene
	if (typeof param == 'string') {
		var sparam = {};
		if (param == 'hide') sparam.minimap = 'stop';
		if (param == 'show') sparam.minimap = 'start';
		atmosphere(sparam);		
	}
	else {
		if (param.src) {
			if (Helper.findVar("_nav_automap") == null) {
				var uv = new UserVars();
				uv.Set(0, false);
				Stage.variables["_nav_automap"] = uv;
			}

			var val = new Array(param.size[0]);
			for (var i=0; i<val.length; i++) {
				val[i] = new Array(param.size[1]);
				for (var j=0; j<val[i].length; j++)
					val[i][j] = 0;
			}
			Stage.variables["_nav_automap"].Set(val, false);
			var sparam = {};
			sparam.minimap = param.src;
			sparam.offset = (param.offset) ? param.offset : new Array(0,0);
			sparam.size = param.size;
			atmosphere(sparam);
		}
	}
}
// map - define map adjacency
function map(param) {
	if (Helper.findVar("_nav_loc") == null) {
		var uv = new UserVars();
		uv.Set("", false);
		Stage.variables["_nav_loc"] = uv;
	}
	for (var prop in param) {
		if (param.hasOwnProperty(prop) && (prop != 'id')) {
			var uv = new UserVars();
			param[prop].push(prop);
			uv.Set(param[prop], false);
			Stage.variables[param.id+'#'+prop] = uv;
		}
	}
}
// preload - manually preload resources
function preload(param) {
	// TODO: here's a crude preload support
	if (Config.gameAllowPreload) {
		setTimeout(function() {
			if ((typeof param == 'string') && (param == 'auto')){
				var seq = Stage.script.sequence;
				for (var i=Stage.script.frame; i<seq.length; i+=2) {
					Helper.preloadResources(seq[i], seq[i+1]);
				}
				seq = null;
				return;
			}
			var preloadObj = new Array(param.length);
			for (var i=0; i<param.length; i++) {
				if (Helper.checkIfImage(param[i])) {
					preloadObj[i] = new Image();
					preloadObj[i].src = param[i];
				}
				if (Helper.checkIfAudio(param[i])) {
					preloadObj[i] = new Audio();
					preloadObj[i].preload = 'auto';
					preloadObj[i].autoplay = false;
					preloadObj[i].src = param[i];
				}
				if (Helper.checkIfVideo(param[i])) {
					preloadObj[i] = document.createElement('video');
					preloadObj[i].preload = 'auto';
					preloadObj[i].autoplay = false;
					preloadObj[i].src = param[i];
				}
				preloadObj[i] = null;
			}
			preloadObj = null;
		}, 250);
	}
}
