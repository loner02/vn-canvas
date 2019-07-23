///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";
require(["app/vncanvas-vars"]);

///////////////////////////////////////////////////////////////////////////////
// Local Helpers
///////////////////////////////////////////////////////////////////////////////
require(["app/vncanvas-base"], function() {
	// Helper function to check for audio file
	Helper.checkIfAudio = ((src) => {
		src = Helper.parseArg(src);
		return (/mp3|m4a|ogg|oga|wav|weba|webm|aac/i.test(src));
	});
	// Helper function to check for video file
	Helper.checkIfVideo = ((src) => {
		src = Helper.parseArg(src);
		return (/mp4|m4v|ogg|ogv|webm|webmv/i.test(src));
	});
	// Helper function to check for script file
    Helper.checkIfScript = ((src) => {
        src = Helper.parseArg(src);
        return (/js/i.test(src));
    });
});

///////////////////////////////////////////////////////////////////////////////
// Script method callback/handlers
// Note: other commands are included in their respective stage elements
///////////////////////////////////////////////////////////////////////////////
// label - marks a position in the script
function label(param) { }
// message - display a message box
function message(param) {
	let match = param.match(/#([^#|\s]+)#/g);
	for (let i in match)
		param = param.replace(match[i],Helper.parseArg(match[i].replace(/#/g,'')));
	if (Stage.isCordova)
		try {
            navigator.notification.alert(param, 
                function(){}, "vnCanvas Alert");
		}
		catch(e) {
			alert(param);
		}
	else
		//alert(param); 
        console.log(`[VNC]: Message: ${param}`);
    return true;
}
// wait - pauses execution
function wait(param) {
	Stage.pause = true;
	if (param > 0) {
		Stage.utimer = setTimeout(() => { 
			Stage.pause = false; 
			Stage.utimerOn = false;
		}, param * 1000);
		Stage.utimerOn = true;
	}
}
// macro - execute a user function
function macro(param) {
	if (Config.gameAllowMacro) {
		let ret = false;
		if (typeof param == 'string')
			ret = eval(param)();
		else {
			for (let prop in param) {
				if (param.hasOwnProperty(prop)) {
					ret = eval(prop)(param[prop]);
				}
			}
		}
		if (ret == true) return true;
        else return false;  // including undefined
	}
}
// animation - define an animation set
function animation(param) {
	Stage.animations[param[0]] = param.slice(1);
}
// jump - continues execution at given label
function jump(param, hack=false) {
	if (typeof param == 'string') {
		if (param == 'return') {
			Stage.script.popFrame();
			//Stage.pause = false;
			Stage.pause = Stage.fromForm ? true: false;    // was true
            Stage.fromForm = false;
		}
		else if (param.includes("http")) {
			var newwin = window.open(param, '_blank');
			window.setTimeout('newwin.focus();', 250);
		}
		else if (param == 'pop') {
			Stage.script.frameStack.pop();
			Stage.pause = false;
			return;
		}
		else {
			if (!param.includes('$'))
				Stage.script.pushFrame(hack);
			Stage.script.setFrame(param.replace('$',''));
		}
	}
	else {
		if (!param.label.includes('$'))
			Stage.script.pushFrame(hack);
		let arr_param = new Array();
		for (let prop in param) {
			if (param.hasOwnProperty(prop)) {
				arr_param.push(prop);
				arr_param.push(JSON.stringify(param[prop]));
			}
		}
		
		let compare = false;
		for (let i=0; i<arr_param.length; i+=2) {
			//arr_param[i] = eval(arr_param[i]);
			if (arr_param[i] == 'label') continue;
			arr_param[i+1] = eval(arr_param[i+1]);

			compare = false;
			let val = Helper.getValue(arr_param[i]);
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
			Stage.script.setFrame(param.label.replace('$',''));
	}
    return false;
}
// screen - do some screen actions
function screen(param) {
	for (let prop in param) {
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
                // TODO: PixiJS capture/extract
				var img = Stage.canvas.toDataURL("image/"+param.snap);
				window.open(img,'_blank','width='+Stage.canvas.width+',height='+Stage.canvas.height);
			}
		}
	}
	Stage.redraw = true;
}
// map - define map adjacency
function map(param) {
	if (Helper.findVar("_nav_loc") == null) {
		let uv = new UserVars();
		uv.Set("", false);
		Stage.variables.set("_nav_loc", uv);
	}
	for (let prop in param) {
		if (param.hasOwnProperty(prop) && (prop != 'id')) {
			let uv = new UserVars();
			param[prop].push(prop);
			uv.Set(param[prop], false);
			Stage.variables.set(param.id+'#'+prop, uv);
		}
	}
}
// preload - manually preload resources
function preload(param) {
	// TODO: here's a crude preload support
	if (Config.gameAllowPreload) {
		setTimeout(() => {
			if ((typeof param == 'string') && (param == 'auto')){
				let seq = Stage.script.sequence;
				for (let i=Stage.script.frame; i<seq.length; i+=2) {
					Helper.preloadResources(seq[i], seq[i+1]);
				}
				return;
			}
			let preloadObj = new Array(param.length);
			for (let i=0; i<param.length; i++) {
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
                if (Helper.checkIfScript(param[i])) {
                    Helper.scriptLoad(param[i].replace('.js',''), function() {
                        // just load in memory, do nothing
                    });
                }
				preloadObj[i] = null;
			}
		}, 250);
	}
}
