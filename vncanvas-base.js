///////////////////////////////////////////////////////////////////////////////
//  Visual Novel JAVASCRIPT Engine for HTML5 CANVAS by [lo'ner]              //
//  Author: oclabbao@yahoo.com, oclabbao@gmail.com                           //
//  Based on:                                                                //
//      Construct2 - HTML5 game creator (www.scirra.com)                     //
//      js-vine.js by J. David Eisenberg                                     //
//      enchant.js by Ubiquitous Entertainment Inc.                          //
//      Ren'Py Python VN engine (www.renpy.org)                              //
//  Requires:                                                                //
//      PixiJS (www.pixijs.com, github.com/pixijs/)                          //
//          - WebGL support, with Canvas 2D as fallback                      //
//      HowlerJS (www.howlerjs.com)                                          //
//          - Web Audio API, with HTML5 Audio as fallback                    //
//      RequireJS by Dojo Foundation (http://github.com/jrburke/requirejs)   //
//  Rationale:                                                               //
//      A generic engine, whether event or messaging based, is a bit bloated //
//      for visual novel use. Not only are visual novels notoriously heavy   //
//      on resources (images, media) which engines try to preload at start,  //
//      they also do not require most of the features offered by these       //
//      engines. Hence, this is an attempt to create an engine suitable for  //
//      web-based visual novels, leaving story-tellers with just the task of //
//      story telling. Of course, this is not limited to visual novels, but  //
//      can also be used for ad promotions, PPT-like presentations, etc.     //
//      Oh, did I mention that it's cross-platform on an HTML5-capable       //
//      browser, absolutely malware/adware/spyware free (go ahead, inspect   //
//      the code. bet you can't do that on a flash or server-side script),   //
//      can be used online/offline and, on top of that, FREE.                //
///////////////////////////////////////////////////////////////////////////////
/******************************************************************************
	Copyright © 2018 by OCLabbao a.k.a [lo'ner]

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to permit
    persons to whom the Software is furnished to do so, subject to the
    following conditions:

    The above copyright notice and this permission notice shall be included
    in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    USE OR OTHER DEALINGS IN THE SOFTWARE.
	
******************************************************************************/
/******************************************************************************
Revision history:
Version 0.8 Georgia
09.30.18 - Support forced WebGL or Canvas2D mode
         - Support button hover/click sounds
Version 0.7.5 Freja (interim release for WebGL port)
09.15.18 - Start port of RPG mod
05.05.18 - Port animated sprite and grid to PixiJS
05.02.18 - Port 'video' to PixiJS
04.28.18 - Port 'cform' to PixiJS
04.27.18 - Port 'atmosphere' to PixiJS
04.26.18 - Port 'audio' to howlerJS
04.20.18 - Port 'actor' to PixiJS
04.14.18 - Port 'box' and 'text' to PixiJS
         - do away with CanvasText
04.12.18 - Hack PixiJS to fix wordwrap bug
04.10.18 - Port 'scene' and 'overlay' to PixiJS
04.06.18 - Try: support for WebGL using PixiJS
         - Partial port code to ES5/ES6
         - Change main objects/functions to class
04.03.18 - Try: support for WebGL using three.js
Version 0.7 Fiona
03.10.18 - Support preloading of scripts as workaround for FF asynchronous load
03.02.18 - Support for walkable map
02.24.18 - Support for animated buttons
02.06.18 - Additional actor positions
         - Bugfix: checkpoint fix for actor position
         - Add balloon arrow position: 'up' or 'down'
         - Bugfix: access to array individual elements by reference
         - Add @ delimiter for stats: actor@stat
         - Support keyword 'pos' or 'position' for textbox location
         - Support conditional menu, i.e. display menu items accdg to condition
         - Bugfix: fix for textbox prompt image not created at runtime
         - Bugfix: fix "return" when coming from a "menu" jump 
Version 0.6 Elsa
01.01.17 - Add conditional menu
12.15.16 - Bugfix: processEffects breaks ghost effect
10.29.16 - Add checkpoint support for RPG mod
08.28.16 - Moved tooltip above cursor
07.05.16 - Bugfix: setting multiple uservars to null
07.01.16 - Support for actor horizontal/vertical flip using canvas scale
06.29.16 - Change button defaults to use Config.activeTheme settings
         - Support picture from user variables
06.22.16 - Bugfix: use === or !== when conparing with findStats return value
06.18.16 - Bugfix: fix 'return' jump to correct frame
         - Bugfix: fix regex search for string with operator
         - Bugfix: fix for actor transtions and missing sprites
         - Add support for active image scaling and hiding
         - Add support for getting cform control via id
         - Add support for button images via user variables
04.28.16 - Bugfix: fix move transitions based on actual image dimensions
04.27.16 - Bugfix: fix audio pause/resume on device initiated pause
		 - Add support for full body sprites
03.01.16 - Add support for canvas image filters
11.10.15 - Add option to pass previous stat value on update callback
11.03.15 - Bugfix: fix se repeat parameter on replay
10.28.15 - Bugfix: fix bgm stops on replay
		 - added individual sound volume adjustment at creation
		   - as offset from master volume setting
		 - prevent updates when window is minimized, see init.js
		   - stop audio play, for example
09.29.15 - better handling of touch events
		 - revamped menu to use buttons
		   - hard to select menu on small screens
		   - also makes it possible to have greater than 3 choices
		 - nodal dialog box no longer require a "loop cheat"
		 - Bugfix: fix input when a form is active
		 - TODO: video fix for cordova
09.22.15 - support for Apache Cordova
		   - only Android for now, checked with emulator only
		 - merged vncanvas-script with vncanvas-base
		   - remove asynchronous load issues
		   - script is essential to vncanvas anyway, not optional
Version 0.5 Diana
01.14.15 - support responsive template
		 - TODO: Firefox issues - requireJS fails on some version
12.30.14 - improved documentation
		 - organized folder structure
		 - speed up module loading:
		   - engine divided to modules
		   - story script load on demand
		   - support for requireJS
		 - support on-the-fly audio mute
Version 0.4 Chelsea
11.18.14 - add keyboard support (return, arrow keys)
11.11.14 - add autotype for text
06.02.14 - Bugfix: localStorage fix for IE, c/o CatNip
06.21.13 - Bugfix: parseFontString doesn't handle quoted single words
05.18.13 - updated vntemplate
		 - added config file checks to catch errors
04.12.13 - various bugfixes
03.10.13 - support for clickable "scene" objects
		 - support for change of actor "nick"
		 - Bugfix: actor reset changes position for non-auto actors
03.03.13 - "overlay" support for animated images
02.22.13 - support for "actor" shortcut
02.19.13 - "actor" support for animated avatars
		 - Bugfix: fix 'true' or 'false' string in dialog
02.17.13 - Bugfix: fix size and position of multiple sprites
02.10.13 - "actor" support for animated sprites
02.07.13 - "scene" support for animated objects
12.29.12 - "menu" supports user variable set
12.24.12 - Support _range attribute for actor stats
		 - Support '$' prepend on jump labels, to skip push on frame stack
12.01.12 - Prep for RPG MOD Pack
Version 0.3 Brenda
10.12.12 - Bugfix: touch devices reset fix (courtesy of Turker Yasa)
05.15.12 - Added 'random' generator for user variables
		 - Added a parameter to 'macro' calls
		 - Added multiple conditions for 'jump'
05.04.12 - Added auto-revealing map to 'tile' navigation
		 - Bugfix: local storage variable persist flag fix
04.23.12 - Optimized 'skip' text storage
		 - Bugfix: sprite reuse using tags
		 - Support multiple avatars reuse thru tags
		 - Added screen action 'fall'
04.22.12 - Added actor 'stats' plugin
04.17.12 - Added 'skip read text' function for quick replay
		 - Added toggle mode for 'button'
04.14.12 - Added lookAhead option to preload next resources while idle
		 - Converted 'timer' cform element to a generic text display element
		 - Bugfix: added actor 'voice' to auto preload
		 - Bugfix: added Config-defined format in auto preload
		 - Bugfix: repeat 'animation' fix
04.10.12 - Added 'map' and 'tile' navigation
04.06.12 - Added custom 'animation' set
		 - Added tryit editor for developers
		 - Bugfix on movement effects (broken due to 'nowait')
Version 0.2 Althea
03.06.12 - Added 'z_order' for actor
		 - Setting a variable to null deletes it
		 - Support persistent user variable
		 - Support multiple named 'checkpoints'
03.04.12 - Added screen actions 'shake', 'snap'
03.01.12 - Added speech 'balloon' in actor
		 - Added arrays in user variables
02.28.12 - Added 'voice' dub in-sync with dialog
		 - Added 'nowait' argument to effects
02.27.12 - Expand user variables for more active use
		 - Several bugfixes
02.24.12 - Recode 'cform' (to be plugin-ready)
		 - Bugfix on user variable checkpoint save
02.21.12 - Improved memory handling (avoid leaks ?)
		 - Modify Vector2d class
02.13.12 - Recode 'atmosphere' (to be plugin-ready)
02.12.12 - Recode effects (to be plugin-ready)
02.10.12 - Recode 'box', script, stage and 'button'
		 - Added 'preload'
		 - Selectable 'video-on-canvas' or 'video-element'
02.09.12 - Added vector2d class (in anticipation of some future features)
		 - Optimized 'particles' for performance
		 - Recode 'scene', 'overlay'
		 - Recode 'actor'
02.06.12 - Recode 'user variables'
		 - Recode 'audio', 'video'
		 - Recode 'form'
		 - Bug fix for iOS user inputs
02.05.12 - Recode for "cleaner" encapsulation thru functional inheritance
		 - Recode 'atmosphere'
Version 0.1 Preview
02.02.12 - Added atmosphere 'snow', 'rain' direction
01.31.12 - Updated cutscene/movie to play in canvas
		 - Optimized method encapsulation
01.28.12 - Bugfix for non-modal dialog while checkpoint loading
		 - Bugfix for cross-browser compatibility (re:image constructor)
		 - Added timer cform element
		 - Added animated picture cform element
01.25.12 - Added macro for custom javascript
01.12.12 - Updated scene and overlay to accept HTML color
		 - Updated button (cform) to accept HTML color
		 - Optimized memory footprint (a bit)
01.11.12 - Added word filter
		 - Added URL jump
		 - Simplified atmosphere, added cloud and beam
01.09.12 - Added themes
		 - Forms can be instantiated in-game
01.06.12 - Implemented text effects
01.04.12 - Bug fix: avatar, checkpoint
		 - Implemented additional actor effects
		 - Implemented additional overlay effects
		 - Implemented additional background effects
12.30.11 - Simplified 'audio'
12.29.11 - Added configuration file (just the basics)
12.28.11 - Added a subset of HTML forms
12.26.11 - Simplified 'set' and 'jump'
12.25.11 - Added actor avatar
		 - Updated checkpoint saves to include avatar and forms
12.24.11 - Added video for intros, cutscenes, endings
		 - Updated demo and docs
12.21.11 - Added canvas forms (buttons only... so far)
12.20.11 - Added basic saves using checkpoint
		 - Completed initial demo
12.08.11 - Added overlay and atmosphere basics
12.06.11 - Added actor basics
12.05.11 - Added script box, flow control using jump
12.01.11 - Basics for background image, music/sounds, flow control using wait
11.27.11 - File creation
******************************************************************************/
///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";
require(["lib/pixi.min"]);

///////////////////////////////////////////////////////////////////////////////
// Generic/helper methods
///////////////////////////////////////////////////////////////////////////////
var Helper = {
	// Function for adding an event listener
	_registry: null,
	initialise: () => {
		if (Helper._registry === null) {
			Helper._registry = [];
			Helper.addEvent(window, 'unload', Helper.cleanUp);
		}
	},
	cleanUp: () => {
		for (let i = 0; i < Helper._registry.length; i++) {
			let obj = Helper._registry[i].obj;
			let evType = Helper._registry[i].evType;
			let fn = Helper._registry[i].fn;
			let useCapture = Helper._registry[i].useCapture;
			if (obj.removeEventListener)
				obj.removeEventListener(evType, fn, useCapture);
			else if (obj.detachEvent)
				obj.detachEvent("on" + evType, fn);
		}
		Helper._registry = null;
        Stage.glManager.free('all');
        Stage.glScene.destroy(true);
	},
	addEvent: (obj, evType, fn, useCapture) => {
		Helper.initialise();
		if (typeof obj === 'string')
			obj = document.getElementById(obj);
		if ((obj === null) || (fn === null))
			return false;
		if (obj.addEventListener) {
			obj.addEventListener(evType, fn, useCapture);
			Helper._registry.push({obj: obj, evType: evType, fn: fn, useCapture: useCapture});
			return true;
		}
		if (obj.attachEvent) {
			let r = obj.attachEvent("on" + evType, fn);
			if (r) Helper._registry.push({obj: obj, evType: evType, fn: fn, useCapture: false});
			return r;
		}
		return false;
	},
	// Function for including external javascript files
	includeJs: (jsFilePath) => {
        let js = document.createElement("script");
        js.type = "text/javascript";
        js.src = jsFilePath;
        document.body.appendChild(js);
        js = null;
	},
	// Function to check support for localStorage
	supportsLocalStorage: () => {
		try {
			return 'localStorage' in window && window['localStorage'] != null && window['localStorage'] !== undefined;
		} 
		catch(e){
			return false; 
		}
	},
	findVar: (id) => {
        let ids = id.split(/[\[\]]/g);
        if (Stage.variables.get(ids[0]) != null) {
            if ((ids.length > 1) && (Stage.variables.get(ids[0]).type == 'object'))
                return Stage.variables.get(ids[0]).value[parseInt(ids[1])];
            else
                return Stage.variables.get(ids[0]).value;
        }
		return null;
	},
	// Helper function to obtain value from stage or config variables or actor stats
	getValue: (id) => {
		let ret = Helper.findStat(id);
		if (ret != null) return ret;
		ret = Helper.findVar(id);
		if (ret != null) return ret;
		return (Config[id]);
	},
	// Helper function to set value to stage or config variables
	setValue: (id, value) => {
		let ret = Helper.findStat(id);
		if (ret !== null) {
			let arr_str = id.split(/[_@]/g);
            let actor = Stage.layers.fg.get(arr_str[0]);
            if (actor) {
                let old = actor.stats[arr_str[1]];
                actor.stats[arr_str[1]] = value;
                if (Config.modRPG) {
                    if (RPG.Stats[arr_str[1]]['_update']) {
                        RPG.Stats[arr_str[1]]['_update'](actor, actor.stats);
                    }
                }
                else {
                    if (Stats[arr_str[1]]['_update']) {
                        try {
                            // compare with old stats if given
                            Stats[arr_str[1]]['_update'](actor, actor.stats, old);
                        }
                        catch (e) {
                            // make callback compatible with old versions
                            Stats[arr_str[1]]['_update'](actor, actor.stats);
                        }
                    }
                }
                // TODO: update inherited stats
            }
		}
		else {
            ret = Helper.findConfig(id);
			if (ret != null) {
				Config[id] = value;
				// a configuration variable has changed, reflect it back
				Helper.updateConfig(id);
				Stage.redraw = true;
            }
			else {
                // set user variable
                let v = Stage.variables.get(id);
                if (v) {
                    Stage.variables.get(id).value = value;
                    Stage.variables.get(id).persist = false;
                }
			}
		}
	},
	// Helper function to search for config variables
	findConfig: (id) => {
		if (Config[id] !== undefined)
			return Config[id];
		else if (Config.activeTheme[id] !== undefined)
			return Config.activeTheme[id];
		return null;
	},
	// Helper function to update game config
	updateConfig: (id) => {
		switch(id) {
			case "activeTheme": 
				if (Config.activeTheme === null) break;
				// formstyle
				if (Config.activeTheme.formFontStyle) {
					Stage.formStyle.splice(0, Stage.formStyle.length);
					let subs = Helper.parseFontString(Config.activeTheme.formFontStyle);
                    subs.forEach(s => {Stage.formStyle.push(s)});
				}
				// tooltips are automatically updated
				// script box
                let box = Stage.layers.gui.get("box");
				if (Config.activeTheme.boxFontStyle) { 
					let subs = Helper.parseFontString(Config.activeTheme.boxFontStyle);
					
					if (subs.length > 0) box.fontWeight = subs[0];
					if (subs.length > 1) {
						box.fontSize = subs[1];
						box.lineHeight = parseInt(subs[1]) + 4;
					}			
					if (subs.length > 2) box.fontFamily = subs[2].replace(/['|"]/g,'');
					if (subs.length > 3) box.fontColor = subs[3];
				}
				if (Config.activeTheme.boxTagStyle) {
					let subs = Helper.parseFontString(Config.activeTheme.boxTagStyle);
					
					if (subs.length > 0) box.tagWeight = subs[0];
					if (subs.length > 1) box.tagSize = subs[1];
					if (subs.length > 2) box.tagFamily = subs[2].replace(/['|"]/g,'');
					if (subs.length > 3) box.tagColor = subs[3];
				}
				if (Config.activeTheme.boxDimStyle) {
					let subs = Config.activeTheme.boxDimStyle.split(' ');
					box.dimStyle.splice(0,box.dimStyle.length);
					for (let s of subs)
						box.dimStyle.push(s);
				}
				box.src = (Config.activeTheme.boxImageStyle) ? Config.activeTheme.boxImageStyle : '';

				// balloon styling
				box.balloonStyle.splice(0,box.balloonStyle.length);
				if (Config.activeTheme.balloonStrokeStyle)
					box.balloonStyle.push(Config.activeTheme.balloonStrokeStyle);
				else
					box.balloonStyle.push('transparent');
				if (Config.activeTheme.balloonFillStyle) {
					let subs = Config.activeTheme.balloonFillStyle.split(' ');
					for (let s of subs)
						box.balloonStyle.push(s);
				}
				break;
			case "volumeAudio":
				if (Config.volumeAudio === null) break;
				if (typeof Config.volumeAudio == 'string') {
					let volume = parseFloat(Config.volumeAudio);
					if (isNaN(volume)) volume = 1.0;
					Config.volumeAudio = volume;
				}
                for (let s in this.sounds) {
                    if (this.sounds.hasOwnProperty(s)) {
                        for (let [key, sound] of this.sounds[s]) {
                            if (!sound.isPaused && !sound.isStopping)
                                sound.volume = Config.volumeAudio + sound.adjust;
                        }
                    }
                }
				break;
			case "volumeVideo":
				if (Config.volumeVideo === null) break;
				if (typeof Config.volumeVideo == 'string') {
					let volume = parseFloat(Config.volumeVideo);
					if (isNaN(volume)) volume = 1.0;
					Config.volumeVideo = volume;
				}
                for (let [key, vid] of Stage.videos.entries()) {
					if (!vid.isStopping) {
						vid.movie.volume = Config.volumeVideo;
					}
				}
				break;
		}
	},
	// Helper function to parse string arguments
	parseArg: (arg) => {
		// check if arg is a user variable
		let ret = Helper.findVar(arg);
		if (ret != null) return ret;
		// TODO: to speed up parsing, if stats and config are not required,
		// 	skip the next 4 lines
		ret = Helper.findStat(arg);
		if (ret != null) return ret;
		ret = Config[arg];
		if (ret != null) return ret;
		// check if arg is a number
		ret = parseFloat(arg)
		if (!isNaN(ret)) return ret;
		// check if boolean
		ret = arg.replace(/^\s+|\s+$/g, "").toLowerCase();
		if (ret === 'true') return true;
		if (ret === 'false') return false;
		// just return as is
		return arg;
	},
	// Helper function to parse font string
	parseFontString: (s) => {
		let splitText = s.split(' ');
		// combine as needed
		let subs = new Array();
		let combine = false;
		let tempText = '';
		for (let txt of splitText) {
			if (txt.search(/^['|"].*['|"]$/g)!=-1) {
				combine = false;
				subs.push(txt.replace(/^['|"]|['|"]$/g, ""));
			}
			else if (txt.search(/['|"]/g)!=-1) {
				if (combine == false) {
					combine = true;
					tempText = txt;
				}
				else {
					combine = false;
					tempText += " " + txt;
					subs.push(tempText);
				}
			}
			else {
				if (combine == true)
					tempText += " " + txt;
				else
					subs.push(txt);
			}
		}
		return subs;
	},    
	// Helper function to check for image file
	checkIfImage: (src) => {
		// crude way of checking if src is an image
		src = Helper.parseArg(src);
		return (/jpg|jpeg|bmp|png|gif|svg/i.test(src));
	},
	// Helper to interpolate object position
	interpolatePosition: (obj) => {
		if (Stage.transTime <= 0) {
			obj.pos.copy(obj.target_pos);
			obj.startpos = null;
		}
		else {
			if ((obj.startpos === undefined) || (obj.startpos === null))
				obj.startpos = new Vector2d(obj.pos.vx, obj.pos.vy);
            let normalizedTime = Stage.transTime/obj.transTime;
            if (obj.tween && typeof obj.tween === 'string') {
                let curvedTime = TransEffects.ease[obj.tween](normalizedTime);
                obj.pos.lerp(obj.target_pos, obj.startpos, curvedTime);
            }
            else {
                obj.pos.lerp(obj.target_pos, obj.startpos, normalizedTime);
            }
		}
	},
	// Helper function to get current speaker
	checkCurrentSpeaker: (name, append) => {
        let box = Stage.layers.gui.get("box");
		let current_speaker = box.glActorNick.text;
        box.glActorNick.text = name;
		let same_window = false;
		if ((current_speaker != name) || (append == false)) {
			box.cont = false;
			same_window = false;
		}
		else if (append == true) {
			box.cont = true;
			same_window = true;
		}
		else {	// whatever value including undefined
			same_window = box.cont;
		}
		return same_window;
	},
	// Helper function to add name tag, if any, to dialog
	addTagToDialog: (tag, tagcolor, text, append) => {
		let dialog = '';
        let box = Stage.layers.gui.get("box");
		box.autotypeCount = 0;
		if (append && (box.text.length>0)) {
            dialog += box.text + '\n';
			box.autotypeCount += dialog.length+2;
		}
		if (text != null) {
			let match = text.match(/#([^#|\s]+)#/g);
			for (let i in match)
				text = text.replace(match[i],Helper.parseArg(match[i].replace(/#/g,'')));
			dialog += Helper.parseArg(text).toString();
		}
		dialog = Helper.filterBadWords(dialog);
        box.autotypeLength = dialog.length;
        return dialog;
	},
	filterBadWords: (str) => {
		if (Config.gameMatureFilter) {
			let pattern = "/(^|\\n?|\\s*)("+Config.gameBadWords.join('|')+")($|\\n?|\\s*)/img";
			return str.replace(eval(pattern), Config.gameAltWord);
		}
		else
			return str;
	},    
	// Helper function to queue animation set in script lines
	queueAnimation: (type, param, aset) => {
		let newLines = new Array();
		for (let i=0; i<aset.length; i+=2) {
			if (type == 'scene') newLines.push(scene);
			if (type == 'overlay') newLines.push(overlay);
			if (type == 'actor') newLines.push(actor);
			let newParam = {};
			for (let prop in param) {
				if (param.hasOwnProperty(prop)) {
					if (prop.search(/(src|sprite|avatar|nick|color|say|balloon|append|remove|voice)/g) == -1)
						newParam[prop] = param[prop];
				}
			}
			newParam.time = aset[i];
			newParam.effect = aset[i+1];
			newLines.push(newParam);
		}
		Stage.script.insert(newLines);
	},
	// Helper function to check map adjacency
	checkMapAccess: function(mapname, locationid) {
		if (mapname == "") return true;
		if (Helper.findVar("_nav_loc")) {
			let ret = Helper.findVar(mapname+'#'+Stage.variables.get("_nav_loc").value);
			if ( ret != null) {
				for (let loc of ret)
					if (loc == locationid) return true;
				return false;
			}
		}
		return true;
	},    
	// Helper function to preload resources
	preloadResources: (seq, param) => {
		if ((seq == scene) || (seq == overlay)) {
            if ((param.src) && (typeof param.src == 'string')) {
                if (Helper.checkIfImage(param.src)) {
                    let newImage = new Image();
                    newImage.src = param.src;
                }						
            }
            else if (param.src) {
                if (Helper.checkIfImage(param.src[0])) {
                    let newImage = new Image();
                    newImage.src = param.src[0];
                }
            }
			if (param.objects) {
				for (let j=0; j<param.objects.length; ) {
					let newImage = new Image();
					newImage.src = param.objects[j];
					j += 3;
					if (param.objects[j] && (typeof param.objects[j] == 'number'))
						j += 2;
					if (param.objects[j] && (typeof param.objects[j] == 'string') && (!Helper.checkIfImage(param.objects[j])))
						j += 1;
				}
			}
		}
		if (seq == actor) {
			if (param.sprite) {
				if (typeof param.sprite != 'string') {
					let newImage = new Image();
					newImage.src = param.sprite[1];
				}
			}
			if (param.avatar) {
				if (typeof param.avatar != 'string') {
					let newImage = new Image();
					newImage.src = param.avatar[1];
				}
			}
			if (param.voice) {
				for (let j=0; j<Config.audioFormat.length; j++) {
					let newAudio = new Audio();
					newAudio.preload = 'auto';
					newAudio.autoplay = false;
					newAudio.src = param.voice + '.' + Config.audioFormat[j];
				}
			}
		}
		if (seq == audio) {
			let soundfile, soundformat;
			if (param.bgm) soundfile = (typeof param.bgm=='string')?param.bgm:param.bgm[1];
			if (param.bgs) soundfile = (typeof param.bgs=='string')?param.bgs:param.bgs[1];
			if (param.se) soundfile = (typeof param.se=='string')?param.se:param.se[1];
			if (param.format) soundformat = param.format;
			else soundformat = Config.audioFormat;
			for (let j=0; j<soundformat.length; j++) {
				let newAudio = new Audio();
				newAudio.preload = 'auto';
				newAudio.autoplay = false;
				newAudio.src = soundfile + '.' + soundformat[j];
			}
		}
		if (seq == video) {
			let videofile, videoformat;
			if (param.src) videofile = param.src;
			if (param.format) videoformat = param.format;
			else videoformat = Config.movieFormat;
			for (let j=0; j<videoformat.length; j++) {
				let newVideo = document.createElement('video');
				newVideo.preload = 'auto';
				newVideo.autoplay = false;
				newVideo.src = videofile + '.' + videoformat[j];
			}
		}
        if (seq == jump) {
            let str = '';
            if (typeof param == 'string')
                str = param.split('#');
            else
                str = param.label.split('#');
            if (str.length > 1) {
                let newseq = str.shift();
                Helper.loadScript(newseq, function() {
                    // just load, do nothing
                });
            }
        }
        if (seq == menu) {
            for (let s of param) {
                if (typeof s == 'string') {
                    let str = s.split('#');
                    if (str.length > 1) {
                        let newseq = str.shift();
                        Helper.loadScript(newseq, function() {
                            // just load, do nothing
                        });
                    }
                }
            }
        }
	},    
	// Helper function to skip previously read text for quick replay
	skipReadText: () => {
		if (Helper.findVar("_skip_text") != true) return false;
		if (!Stage.inputFocus) return false;
		if (!Helper.supportsLocalStorage()) return false;
		if ((Stage.script.sequence[0] != label) || (localStorage["_persist_skip_"+Stage.script.sequence[1]] === null))
			return false;
		let tmp = JSON.parse(localStorage["_persist_skip_"+Stage.script.sequence[1]]);
		for (let i=0; i<tmp.length; i+=2) {
			if ((Stage.script.frame >= tmp[i]) && (Stage.script.frame <= tmp[i+1]))
				return true;
		}
		return false;
	},
	// Helper function to look for actor stat
	findStat: (id) => {
		if (Stage.layers.fg.size > 0) {
			let arr_str = id.split(/[_@]/g);    // add @ delimiter
			if ((arr_str.length > 1) && (arr_str[0].length > 0)){
                if (Stage.layers.fg.get(arr_str[0]))
                    return Stage.layers.fg.get(arr_str[0]).stats[arr_str[1]];
            }
		}
		return null;
	},
	// Helper function to load script on the fly
	loadScript: (id, callback) => {
		try {
			let dummy = eval(id);
			callback();
		}
		catch (e) {
			for (let entry of TOC) {
				if (entry.match(id) != null) {
					require([entry], function() {
						callback();
					});
				}
			}
		}
		//return id;
	},
    // DEFUNCT: Helper function to load texture using framework loader
    loadTexture: (texture, init, callback) => {
        if (init) {
            Stage.glLoader
                .add(texture)
                .load((loader, resources) => {
                    callback(resources, init);
                })
                .on("progress", (loader, resource) => { console.log(`[PIXI]: loading: ${resource.url}`)});
        }
        else {
            callback(Stage.glLoader.resources, init);
        }
    },
	// Helper function to check if valid actor from id
	checkIfActor: (id) => {
        if (Stage.layers.fg.has(id)) return true;
        //if (Stage.layers[1].get(id)) return true;
		return false;
	},
    // Helper function to check for WebGL support
    checkWebGL: () => {
        //console.log(PIXI);
        return PIXI.utils.isWebGLSupported();
        /*try {
			let canvas = document.createElement( 'canvas' );
			return !!( window.WebGLRenderingContext && (
				canvas.getContext( 'webgl' ) ||
				canvas.getContext( 'experimental-webgl' ) )
			);
		} catch ( e ) {
			return false;
		}*/        
    }
}

// Function to determine optimal animation frame
//window.requestAnimFrame = (function(callback){
window.requestAnimFrame = ((callback) => {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback){
		window.setTimeout(callback, 1000 / 60);
	};
})();
// Helper function on window resize
window.onresize = (() => {
	//for (let i=0; i<document.forms.length; i++) {
    for (let f of document.forms) {
        let x = Stage.canvas.offsetLeft + (Stage.canvas.clientWidth-f.clientWidth)/2;
        let y = Stage.canvas.offsetTop + (Stage.canvas.clientHeight-f.clientHeight)/2;
		f.setAttribute('style', 'position:absolute; left:'+x+'px; top:'+y+'px;');
	}
});

///////////////////////////////////////////////////////////////////////////////
// Rect class
///////////////////////////////////////////////////////////////////////////////
class Rect {
    constructor(x=0, y=0, w=0, h=0) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
    }
    isPointInRect(x, y) {
        if (x < this._x) return false;
        if (x > this._x + this._w) return false;
        if (y < this._y) return false;
        if (y > this._y + this._h) return false;
        return true;
    }
    set x (val) { this._x = val; }
    get x ()    { return this._x; }
    set y (val) { this._y = val; }
    get y ()    { return this._y; }
    set w (val) { this._w = val; }
    get w ()    { return this._w; }
    set h (val) { this._h = val; }
    get h ()    { return this._h; }
}

///////////////////////////////////////////////////////////////////////////////
// 2D vector class
///////////////////////////////////////////////////////////////////////////////
class Vector2d {
    constructor(x=0, y=0) {
        this.vx = x;
        this.vy = y;
    }
    set(x, y) {
        this.vx = x;
        this.vy = y;
    }
    copy(vec2) {
        this.vx = vec2.vx;
        this.vy = vec2.vy;
    }
    scale(scale) {
        this.vx *= scale;
        this.vy *= scale;
    }
    add(vec2) {
        this.vx += vec2.vx;
        this.vy += vec2.vy;
    }
    sub(vec2) {
        this.vx -= vec2.vx;
        this.vy -= vec2.vy;
    }
    equal(vec2) {
        return ((this.vx == vec2.vx) && (this.vy == vec2.vy));
    }
    length() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }
    lengthSquared() {
        return this.vx * this.vx + vec.vy * vec.vy;
    }
    normalize() {
        let len = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (len) {
            this.vx /= len;
            this.vy /= len;
        }
        return len;
    }
    rotate(angle) {
        let vx = this.vx,
            vy = this.vy,
            cosVal = Math.cos(angle),
            sinVal = Math.sin(angle);
        this.vx = vx * cosVal - vy * sinVal;
        this.vy = vx * sinVal + vy * cosVal;
    }
    lerp(vec1, vec2, amt) {
        this.vx = (1-amt) * vec1.vx + (amt) * vec2.vx;
        this.vy = (1-amt) * vec1.vy + (amt) * vec2.vy;
    }
}
///////////////////////////////////////////////////////////////////////////////
// Resource manager: specifically for PIXI
// - implements resource queue, loader, unloader
///////////////////////////////////////////////////////////////////////////////
class ResourceManager {
    constructor() {
        this.queue = new Array();
        this.glLoader = PIXI.loader; //new PIXI.loaders.Loader();// 
        this.busy = false;
    }
    addQueue(resources, flag=true, callback=null) {
        let entry = {resources:new Set(), flag:true, callback:null};
        // check if resources already loaded
        for (let r of resources) {
            if (Helper.checkIfImage(r) && !this.hasLoaded(r)) {
                // check also if already in queue, do not duplicate
                //let found = false;
                //for (let item of this.queue) {
                //    if (item.resources.has(r)) found = true;
                //}
                //if (!found) entry.resources.add(r);
                entry.resources.add(r);
            }
            else if (Helper.checkIfVideo(r) && !this.hasLoaded(r)) {
                entry.resources.add(r);
            }
        }
        entry.flag = flag && (entry.resources.size>0);
        entry.callback = callback;
        if (!entry.flag) {
           if (entry.callback) 
                entry.callback(this.glLoader.resources, entry.flag);
        }
        else
            this.queue.push(entry);
    }
    hasLoaded(resource) {
        return (!!this.glLoader.resources[resource]);
    }
    getTexture(resource) {
        if (this.glLoader.resources[resource])
            return (this.glLoader.resources[resource]).texture;
        return null;
    }
    free(resource) {
        if (resource.toString() == 'all') {
            this.glLoader.destroy();
        }
        else {
            let r = resource;
            if (Helper.checkIfImage(r)) {
            }
            // TODO: how to remove texture from PIXI.loader
            //this.glLoader.resources[this.sprites[tag].src].texture.destroy();
            //PIXI.Texture.removeFromCache(this.sprites[tag].src);
        }
    }
    Update() {
        if (this.busy) return;
        if (this.queue.length == 0) return;
        this.busy = true;
     
        // shift() first item in queue and load
        let entry = this.queue.shift();
        // what if resource already loaded previously
        entry.resources.forEach(r => {
            if (this.hasLoaded(r)) entry.resources.delete(r);
        });
        if (entry.resources.size > 0) {
            this.glLoader
                .add(Array.from(entry.resources))
                .load((loader, resources) => {
                    if (entry.callback) entry.callback(resources, entry.flag);
                })
                .on("progress", (loader, resource) => { console.log(`[PIXI]: loading: ${resource.url}`)})
                .on("complete", () => { this.busy=false; });
        }
        else {
            if (entry.callback) entry.callback(this.glLoader.resources, !entry.flag);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// Script box and script handler for dialogs
///////////////////////////////////////////////////////////////////////////////
// box - configures script box (layer 4)
function box(param) {
    let box = Stage.layers.gui.get("box");
	if (param.show == true)
		box.visible = true;
	else {
		box.visible = false;
		box.text = '';
        box.glActorNick.text = '';
        box.avatar = '';
		box.balloon = null;
	}
	if (param.pos) box.pos = param.pos;
	else if (param.position) box.pos = param.position;
	if (param.back) {
		box.back = param.back;
		box.src = Config.activeTheme.boxImageStyle;
	}
	if (param.prompt) {
		if (param.prompt=='none') {
			box.psrc = '';
		}
        else if ((param.prompt=='config') || (param.prompt=='default')) {
            box.psrc = Config.activeTheme.boxTextPrompt;
        }
		else if (Helper.checkIfImage(param.prompt)) {
			box.isready = false;
			box.psrc = param.prompt;
        }
        else
            box.psrc = param.prompt;
	}
	if (param.align) 
		box.textAlign = param.align;

	// assumes this function won't be called unless there are some changes somewhere
	box.changed = true;
}
// text - display text in script box (layer 4)
function text(param) {
    let box = Stage.layers.gui.get("box");
	box.avatar = '';
	box.alpha = 1;
	box.effects = "none";
	box.scrollOffsetY = 0;
	box.balloon = null;
	box.autotype = false;	/* TODO: add to storage? */
	if (typeof param == "string") {
		//Stage.layers[4][0].text = Helper.addTagToDialog(null, null, param, Stage.layers[4][0].cont || Config.boxAppendOverride);		
		box.text = Helper.addTagToDialog(null, null, param, Helper.checkCurrentSpeaker(' ', Config.boxAppendOverride));		
		if (Config.boxAutotype) {
			box.autotype = true;
			box.effects = "autotype";
		}
	}
	else {
		if (param.font) { 
			let subs = Helper.parseFontString(param.font);
			if (subs.length > 0) box.fontWeight = subs[0];
			if (subs.length > 1) {
				box.fontSize = subs[1];
				box.lineHeight = parseInt(subs[1]) + 4;			
			}			
			if (subs.length > 2) box.fontFamily = subs[2];
			if (subs.length > 3) box.fontColor = subs[3];
		}
		if (param.align)
			box.textAlign = param.align;
		if (param.effect) {
			if (param.effect == "fade")
				box.alpha = 0;
			if (param.effect == "scroll")
				box.scrollOffsetY = box.size.vy;
			if (param.effect == "autotype")
				box.autotype = true;
			else if (param.effect == "noautotype")
				box.autotype = false;
			box.effects = param.effect;
		}
		else {
			if (Config.boxAutotype) {
				box.autotype = true;
				box.effects = "autotype";
			}
		}

		let nick = null;
		let color = '';
		if (param.speaker) {
			nick = param.speaker;
			color = box.tagColor;
            let actor = Stage.layers.fg.get(param.speaker);
            if (actor) {
					nick = actor.nick;
					color = actor.color;
					box.avatar = (actor.activeAvatar != '') ? actor.activeAvatar : '';
                    box.avatarStruct = (box.avatar != '') ? actor.avatars[actor.activeAvatar] : null;
            }
		}
		let same_window = Helper.checkCurrentSpeaker((param.speaker) ? param.speaker : ' ',  (param.append != undefined) ? param.append : Config.boxAppendOverride);
		box.text = Helper.addTagToDialog(nick, color, (param.value) ? param.value : null, same_window);		
		if (param.duration > 0) box.timeout = param.duration;
		if (param.offset) {
			box.textOffset.vx = param.offset[0];
			box.textOffset.vy = param.offset[1];
		}
		if (param.value && param.voice && Helper.processAudio)
			Helper.processAudio (Stage.sounds.vc, param.voice, {voice:param.voice});
	}
	box.visible = true;
	box.changed = true;
}
// menu - display choices in script box (layer 4)
function menu(param) {
    // automatically hide text box
    Stage.layers.gui.get('box').visible = false;
    Stage.layers.gui.get('box').text = '';
    Stage.layers.gui.get('box').balloon = null;
    
    // Dynamically create a cform with buttons for options
    let buttonX = Stage.canvas.width * (1-Config.boxWidth)/2;
    let buttonW = Stage.canvas.width * Config.boxWidth;
    let buttonH = Stage.canvas.height * Config.menuHeight;
    let buttonY = (Stage.canvas.height - ((param.length+1)/2 * buttonH))/2;
    let choices = [param[0], true, button,
                   {name:param[0], x:buttonX, y:buttonY, w:buttonW, h:buttonH, base:Config.activeTheme.menuPrompt}];
    let i=1, j=4;
    while (i<param.length) {
        if ((param.length>i+2) && (typeof param[i+2] != 'string')) {
            // this is a condition
            let arr_param = new Array();
            for (let prop in param[i+2]) {
                if (param[i+2].hasOwnProperty(prop)) {
                    arr_param.push(prop);
                    arr_param.push(JSON.stringify(param[i+2][prop]));
                }
            }
            let compare = false;
            for (let k=0; k<arr_param.length; k+=2) {
                arr_param[k+1] = eval(arr_param[k+1]);

                compare = false;
                let val = Helper.getValue(arr_param[k]);
                if (val != null) {
                    if (typeof val == 'number') {
                        if (val >= arr_param[k+1])
                            compare = true;
                    }
                    else if (typeof val == 'string') {
                        if (val === arr_param[k+1])
                            compare = true;
                    }
                    else {
                        if (val == arr_param[k+1])
                            compare = true;
                    }
                }
                if (compare == false) break;
            }
            if (compare == true) {
                choices[j] = button;
                choices[j+1] = {name:param[i], link:[menu_close,param[i+1]], 
                    x:buttonX, y:buttonY+buttonH*(j-2)/2, w:buttonW, h:buttonH, 
                    base:Config.activeTheme.menuBase, hover:Config.activeTheme.menuHover, click:Config.activeTheme.menuClick};
                j += 2;
            }
            i += 3;
        }
        else {
            choices[j] = button;
            choices[j+1] = {name:param[i], link:[menu_close,param[i+1]], 
                x:buttonX, y:buttonY+buttonH*(j-2)/2, w:buttonW, h:buttonH, 
                base:Config.activeTheme.menuBase, hover:Config.activeTheme.menuHover, click:Config.activeTheme.menuClick};
            i += 2;
            j += 2;
        }
    }
    cform(choices);
    // set focus to menu box
    //for (let [key, control] of Stage.layers.gui.entries()) {
    //    if (control.id == param[0])
    //        param.inputFocus = true;
    //}
}
function menu_close(param) {
	// causes default menu to close then jumps to label
	cform("close");
	if (typeof (param) == 'string') {
        // Bugfix: frame correction to set framestack pointer to "menu" not the "jump"
        Stage.script.frame -= 2;
		jump(param);
    }
	else	// assumes uservar setting
		set(param);
}

class ScriptBox {
    constructor() {
        //this.image = null;
        this.vpwidth = 0;
        this.vpheight = 0;
        this.redraw = true;
        this.update = false;
        this.fxupdate = false;
        this.balloon = false;
        this.curLineCount = 0;
        
        this.canvas = 0;
        this.ctx = 0;

        this.id = 'box';
        this.type = 'box';				// identifies type of gui
        this.group = '';
        this.pos = 'bottom';
        this.back = 'dim';
        this.src = '';
        this.dimStyle = new Array();
        this.balloonStyle = new Array();
        this.origin = new Vector2d(0,0);		// gui origin is topleft
        this.size = new Vector2d(0,0);          // WebGL new
            
        this.isready = true;				// flow control
        this.changed = true;
        this.cont = false;
        this.visible = false;
        this.inputFocus = false;
        this.timeout = 0;
        this.bpos = 'up';

        this.text = '';					// text display
        this.prompt = null;
        this.avatar = '';				// avatar kept for compatibility    // WebGl changed to activeAvatar
        this.avatarStruct = null;		// for avatar parameters
        this.psrc = (Config.activeTheme.boxTextPrompt) ? Config.activeTheme.boxTextPrompt : '';
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
        this.textOffset = new Vector2d(10, 10);
        this.textAlign = 'left';            // WebGL changed
        this.tagFamily = this.fontFamily;
        this.tagColor = '#c8ffc8';
        this.tagSize = this.fontSize;
        this.tagWeight = 'bold';

        this.glBack = null;     // WebGL new
        this.glBackImage = null;
        this.glText = null;
        this.glActorPic = null;
        this.glActorNick = null;
        this.glPrompt = null;
        this.glBox = null;
        this.glMask = null;
    }
    Create(w,h) {
        this.vpwidth = w;	// viewport dimensions
        this.vpheight = h;
        this.origin.vx = this.vpwidth * (1-Config.boxWidth)/2;
        this.origin.vy = this.vpheight * (1-Config.boxHeight);
        this.size.vx = this.vpwidth * Config.boxWidth;
        this.size.vy = this.vpheight * Config.boxHeight;

        this.glBox = new PIXI.Container();

        // default background is 'dim'
        this.glBack = new PIXI.Graphics();      // SB background
        this.glBack.beginFill(0xFFFFFF);
        this.glBack.drawRect(0, 0, this.size.vx, this.size.vy);
        this.glBack.endFill();
        this.glBack.position.set(this.origin.vx, this.origin.vy);
        this.glBack.alpha = 0.5;
        this.glBox.addChild(this.glBack);
                     
        this.glBackImage = new PIXI.Sprite();
        this.glBox.addChild(this.glBackImage);
        
        this.glMask = new PIXI.Graphics();
        this.glMask.beginFill(0xFFFFFF);
        this.glMask.drawRect(0, 0, this.size.vx, this.size.vy);
        this.glMask.endFill();
        this.glMask.position.set(this.origin.vx, this.origin.vy);
        this.glBox.addChild(this.glMask);

        this.glActorPic = new PIXI.Sprite();         // actor profile pic
        this.glBox.addChild(this.glActorPic);
        
        this.glActorNick = new PIXI.Text('');
        this.glActorNick.position.set(this.origin.vx, this.origin.vy);
        this.glActorNick.mask = this.glMask;
        this.glBox.addChild(this.glActorNick);
        
        this.glText = new PIXI.Text('');
        this.glText.position.set(this.origin.vx, this.origin.vy);
        this.glText.mask = this.glMask;
        this.glBox.addChild(this.glText);
        
        this.glPrompt = new PIXI.Sprite();      // SB prompt
        this.glPrompt.mask = this.glMask;
        this.glText.addChild(this.glPrompt);
        
        Stage.glSubScene[4].addChild(this.glBox);
    }
    Update(elapsed) {
        if (this.changed || this.fxupdate) {
            if (this.changed) {
                let style = new PIXI.TextStyle();
                style.fontFamily = this.fontFamily;
                style.fontSize = this.fontSize;
                style.fontStyle = this.fontWeight;
                style.fill = this.fontColor;
                style.wordWrap = true;
                style.wordWrapWidth = this.size.vx - 2*this.textOffset.vx;
                style.align = this.textAlign;
                this.glText.style = style;
                
                let tagStyle = new PIXI.TextStyle();
                tagStyle.fontFamily = this.tagFamily;
                tagStyle.fontSize = this.tagSize;
                tagStyle.fontStyle = this.tagWeight;
                tagStyle.fill = this.tagColor;
                this.glActorNick.style = tagStyle;

                switch (this.back) {
                    case 'image':
                        if (this.src != '') {
                            this.isready = false;
                            Stage.glManager.addQueue([this.src], true/*!Stage.glManager.hasLoaded(this.src)*/,
                                (resources, init) => {
                                    // set scriptbox to be the size of image
                                    let base = resources[this.src].texture;
                                    this.size.set(base.width, base.height);
                                    this.origin.vx = (this.vpwidth-base.width)/2
                                    switch (this.pos) {
                                        case 'bottom': this.origin.vy = this.vpheight - base.height; break;
                                        case 'top': this.origin.vy = 0; break;
                                        case 'center':
                                        case 'full': this.origin.vy = (this.vpheight - base.height)/2; break;
                                    }                                        
                                    this.glBackImage.texture = base;

                                    style.wordWrapWidth = this.size.vx - 2*this.textOffset.vx;
                                    this.glText.style = style;
                                    this.isready = true;                                        
                                }
                            );
                            this.update = false;
                        }
                        break;
                    case 'dim':
                    case 'none':
                        if (!this.balloon) {
                            this.origin.vx = this.vpwidth * (1-Config.boxWidth)/2;
                            this.size.vx = this.vpwidth * Config.boxWidth;
                            this.size.vy = this.vpheight * Config.boxHeight;
                            switch (this.pos) {
                                case 'bottom':
                                    this.origin.vy = this.vpheight * (1-Config.boxHeight);
                                    break;
                                case 'center':
                                    this.origin.vy = this.vpheight * (1-Config.boxHeight)/2;
                                    break;
                                case 'top':
                                    this.origin.vy = 0;
                                    break;
                                case 'full':
                                    this.origin.vy = this.vpheight * (1-Config.boxFullHeight)/2;
                                    this.size.vy = this.vpheight * Config.boxFullHeight;
                                    break;
                            }
                        }
                        else {
                            let xoffset=0, yoffset=0;
                            let actor = Stage.layers.fg.get(this.balloon);
                            if (actor) {
                                yoffset = this.vpheight * (1 - Config.balloonHeight)/2;
                                if (actor.pos.vx >= this.vpwidth/2)
                                    xoffset = actor.pos.vx - Config.balloonWidth * this.vpwidth * 0.75;
                                else
                                    xoffset = actor.pos.vx - Config.balloonWidth * this.vpwidth * 0.25;
                            }
                            this.origin.vx = xoffset;
                            this.origin.vy = yoffset;
                            this.size.vx = this.vpwidth * Config.balloonWidth;
                            this.size.vy = this.vpheight * Config.balloonHeight;
                            style.wordWrapWidth = this.size.vx - 2*this.textOffset.vx;
                            this.glText.style = style;
                        }
                        break;
                    default:
                        break;
                }
            }
            switch (this.effects) {
                case 'fade':
                    //console.log("fade:"+this.alpha);
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
                    //console.log("scroll:"+this.scrollOffsetY);
                    if ((Stage.mouseClick && this.fxupdate) || 
                        //(this.scrollOffsetY <= -(this.curLineCount+1) * this.lineHeight)) {
                        (this.scrollOffsetY <= -this.glText.height - this.textOffset.vy)) {
                        this.effects = 'none';
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
                        this.autotypeCount += Math.floor(Config.boxAutotypeSpeed*elapsed/16);
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
            if ((this.psrc != '') && (Helper.checkIfImage(this.psrc))) {
                this.isready = false;
                Stage.glManager.addQueue([this.psrc], true,
                    (resources, init) => {
                        let base = resources[this.psrc].texture;
                        this.glPrompt.texture = base;
                        this.isready = true;                                        
                    }
                );
                this.update = false;
            }

            this.changed = false;
            this.redraw = true;
        }
        if ((this.avatar != '') && (this.avatarStruct != null)) {
            this.glActorPic.texture = Stage.glManager.getTexture(this.avatarStruct.src);
            
            if ((!this.avatarStruct.avTimerOn) && (this.avatarStruct.fps>0)) {
                this.avatarStruct.avTimer = setTimeout(() => {
                    this.avatarStruct.curFrame = (++this.avatarStruct.curFrame) % this.avatarStruct.frames;
                    if (this.avatarStruct.curFrame == 0) this.avatarStruct.curRep++;
                    this.redraw = true;
                    if (this.visible) { 
                        if ((this.avatarStruct.reps < 0) || (this.avatarStruct.curRep < this.avatarStruct.reps))
                            this.avatarStruct.avTimerOn = false;
                    }
                }, 1000/this.avatarStruct.fps);
                this.avatarStruct.avTimerOn = true;
            }            
        }
        return this.update;
    }
    Draw() {
        if (!this.isready) return false;
        if (!this.redraw) return false;
 
        this.glBox.visible = this.visible;
        if (this.visible == true) {
            if (!this.balloon) {
                let avatarOffsetX = 0;
                if (Config.actorShowAvatar && (this.avatar != '')) {
                    this.glActorPic.anchor.set(this.avatarStruct.origin.vx, this.avatarStruct.origin.vy);
                    if (this.size.vy > this.avatarStruct.imageDim.vy)
                        this.glActorPic.position.y = this.origin.vy+this.size.vy-(this.size.vy - this.avatarStruct.imageDim.vy)/2;
                    else
                        this.glActorPic.position.y = this.origin.vy+this.size.vy-this.textOffset.vy;
                    this.glActorPic.position.x = this.origin.vx+this.textOffset.vx;
                    this.glActorPic.alpha = 1;
                    avatarOffsetX = this.avatarStruct.imageDim.vy+this.textOffset.vx;                   
                    this.glText.style.wordWrapWidth = this.size.vx-2*this.textOffset.vx-avatarOffsetX;

                    if (this.avatarStruct.fps > 0) {
                        let base = this.glActorPic.texture.baseTexture;
                        let framewidth = base.width/this.avatarStruct.frames;
                        this.glActorPic.texture.frame = new PIXI.Rectangle(this.avatarStruct.curFrame * framewidth, 0, framewidth, base.height);
                    }

                }
                else {
                    this.glActorPic.alpha = 0;
                    avatarOffsetX = 0;
                    this.glText.style.wordWrapWidth = this.size.vx-2*this.textOffset.vx;
                }
               
                if (this.textAlign == 'left') {
                    this.glText.anchor.set(0,0);
                    this.glText.position.x = this.origin.vx+this.textOffset.vx+avatarOffsetX;
                    this.glActorNick.anchor.set(0,0);
                    this.glActorNick.position.x = this.origin.vx+this.textOffset.vx+avatarOffsetX;
                }
                else if (this.textAlign == 'center') {
                    this.glText.anchor.set(0.5,0);
                    this.glText.position.x = this.origin.vx+this.size.vx/2+avatarOffsetX/2;
                    this.glActorNick.anchor.set(0.5,0);
                    this.glActorNick.position.x = this.origin.vx+this.size.vx/2+avatarOffsetX/2;
                }
                else if (this.textAlign == 'right') {
                    this.glText.anchor.set(1,0);
                    this.glText.position.x = this.origin.vx+this.size.vx-this.textOffset.vx;
                    this.glActorNick.anchor.set(1,0);
                    this.glActorNick.position.x = this.origin.vx+this.size.vx-this.textOffset.vx;
                }
                if ((this.glActorNick.text.replace(' ','') == '')) {
                    this.glActorNick.alpha = 0.0;
                    this.glText.position.y = this.origin.vy+this.textOffset.vy+this.scrollOffsetY;
                }
                else {
                    this.glActorNick.alpha = 1.0;
                    //this.glActorNick.position.x = this.origin.vx+this.textOffset.vx;
                    this.glActorNick.position.y = this.origin.vy+this.textOffset.vy/2;
                    this.glText.position.y = this.origin.vy+this.textOffset.vy+parseInt(this.tagSize.replace('px',''))+2;
                }
                this.glBack.position.x = this.glBackImage.position.x = this.glMask.position.x = this.origin.vx;
                this.glBack.position.y = this.glBackImage.position.y = this.glMask.position.y = this.origin.vy;
                this.glBack.width = this.glBackImage.width = this.glMask.width = this.size.vx;
                this.glBack.height = this.glBackImage.height = this.glMask.height = this.size.vy;
                this.glText.alpha = this.alpha;
                this.drawDialog();
            }
            else {
                this.glActorPic.alpha = 0;
                this.glActorNick.alpha = 0;
                this.glBackImage.alpha = 0;

                if (this.textAlign == 'left') {
                    this.glText.anchor.set(0,0);
                    this.glText.position.x = this.origin.vx+this.textOffset.vx;
                }
                else if (this.textAlign == 'center') {
                    this.glText.anchor.set(0.5,0);
                    this.glText.position.x = this.origin.vx+this.size.vx/2;
                }
                else if (this.textAlign == 'right') {
                    this.glText.anchor.set(1,0);
                    this.glText.position.x = this.origin.vx+this.size.vx-this.textOffset.vx;
                }
                this.glText.position.y = this.origin.vy+this.textOffset.vy+((this.bpos=='up')?this.lineHeight:0);
                
                this.glBack.position.x = this.glMask.position.x = this.origin.vx;
                this.glBack.position.y = this.origin.vy;
                this.glMask.position.y = this.origin.vy+((this.bpos=='up')?this.lineHeight:0);
                this.glBack.width = this.glMask.width = this.size.vx;
                this.glBack.height = this.size.vy;
                this.glMask.height = this.size.vy-this.lineHeight;
                this.glBack.scale.set(1,1);
                this.glText.alpha = this.alpha;
                this.drawDialog((Stage.layers.fg.get(this.balloon).pos.vx<this.vpwidth/2)?true:false,
                                (this.bpos=='up')?true:false);
            }
            if (this.back == 'none') {
                this.glBack.alpha = (!this.balloon) ? 0.0 : 0.5;
                this.glBackImage.alpha = 0.0;
            }
            else if (this.back == 'dim') {
                this.glBack.alpha = 0.5;
                //this.glBack.tint = w3color(this.dimStyle[0]).toVal();
                this.glBackImage.alpha = 0.0;
            }
            else {
                this.glBack.alpha = 0.0;
                this.glBackImage.alpha = 1.0;
            }
            this.glText.text = (!this.autotype) ? this.text : this.text.substr(0,this.autotypeCount);
            if ((this.text.length>0) && (this.glText.text.length >= this.text.length)) {
                // display end prompt here
                if (Helper.checkIfImage(this.psrc)) {
                    let metrics = PIXI.TextMetrics.measureText(this.text, this.glText.style);
                    this.glPrompt.alpha = 1;
                    this.glPrompt.position.set(metrics.lineWidths[metrics.lines.length-1]+5, 
                                               metrics.lineHeight*(metrics.lines.length-1));
                    let aspectratio = this.glPrompt.width/this.glPrompt.height;
                    this.glPrompt.height = metrics.lineHeight;
                    this.glPrompt.width = aspectratio * metrics.lineHeight;
                }
                else {
                    this.glText.text += this.psrc;
                    this.glPrompt.alpha = 0;
                }
            }
            else
                this.glPrompt.alpha = 0;

            // Pauses script box
            Stage.pause = true;
            if (!Stage.utimerOn && (this.timeout > 0)) {
                Stage.utimer = setTimeout(() => { 
                    Stage.pause = false; 
                    Stage.utimerOn = false;
                    this.timeout = 0;
                }, this.timeout * 1000);
                Stage.utimerOn = true;
            }
        }
        else {
            //Stage.pause = false;
        }
        if (!this.changed) this.update = true;
        this.redraw = false;
        return true;
    }
    drawDialog(left=true, up=false) {
        // TODO:check if need to change graphic
        //if (this.balloon && (this.glBack.lineWidth==2)) return;
        //if (!this.balloon && (this.glBack.lineWidth==0)) return;
    
        this.glBack.clear();
        if (!this.balloon) {
            if (this.dimStyle.length > 1) {
                let steps = Math.min(100, this.size.vy);
                let color1 = w3color(this.dimStyle[0]).toRgb();
                let color2 = w3color(this.dimStyle[1]).toRgb();
                let colorstep = {r:(color1.r-color2.r)/steps,
                                 g:(color1.g-color2.g)/steps,
                                 b:(color1.b-color2.b)/steps,
                                 a:(color1.a-color2.a)/steps};
                let newcolor = {r:0, g:0, b:0, a:1};
                for (let i=0; i<steps; i++) {
                    newcolor.r = ((color1.r-i*colorstep.r)&0xFF);
                    newcolor.g = ((color1.g-i*colorstep.g)&0xFF);
                    newcolor.b = ((color1.b-i*colorstep.b)&0xFF);
                    newcolor.a = color1.a-i*colorstep.a;
                    this.glBack.beginFill((newcolor.r<<16) + (newcolor.g<<8) + (newcolor.b<<0), newcolor.a);
                    this.glBack.drawRect(0, i*this.size.vy/steps, this.size.vx, this.size.vy/steps);
                    this.glBack.endFill();
                }
            }
            else {
                this.glBack.beginFill(w3color(this.dimStyle[0]).toVal());
                this.glBack.drawRect(0, 0, this.size.vx, this.size.vy);
                this.glBack.endFill();
            }
            this.glBack.position.set(this.origin.vx, this.origin.vy);
            //this.glBack.alpha = 0.5;
        }
        else {
            let x=0, y=this.lineHeight, r=10, w=this.size.vx, h=this.size.vy;
            this.glBack.beginFill(w3color(this.balloonStyle[1]).toVal(),(this.back=='none')?0:1);
            this.glBack.lineStyle(2,w3color(this.balloonStyle[0]).toVal(),1);
            //this.glBack.drawRoundedRect(0, 0, this.size.vx, this.size.vy);
            if (up) {
                this.glBack.moveTo(x+r, y);
                this.glBack.lineTo(w/3-y/2,y);
                if (left) this.glBack.lineTo(w/3,0);
                this.glBack.lineTo(w/3+y/2,y);
                this.glBack.lineTo(w*2/3-y/2,y);
                if (!left) this.glBack.lineTo(w*2/3,0);
                this.glBack.lineTo(w*2/3+y/2,y);
                this.glBack.lineTo(w-r, y);
                this.glBack.quadraticCurveTo(w, y, w, y+r);
                this.glBack.lineTo(w, h-r);
                this.glBack.quadraticCurveTo(w, h, w-r, h);
                this.glBack.lineTo(x+r, h);
                this.glBack.quadraticCurveTo(x, h, x, h-r);
                this.glBack.lineTo(x, y+r);
                this.glBack.quadraticCurveTo(x, y, x+r, y);
            }
            else {
                this.glBack.moveTo(r, 0);
                this.glBack.lineTo(w-r, 0);
                this.glBack.quadraticCurveTo(w, 0, w, 0+r);
                this.glBack.lineTo(w, h-y-r);
                this.glBack.quadraticCurveTo(w, h-y, w-r, h-y);

                //this.glBack.moveTo(x+r, y);
                this.glBack.lineTo(w*2/3+y/2,h-y);      
                if (!left) this.glBack.lineTo(w*2/3,h);
                this.glBack.lineTo(w*2/3-y/2,h-y);      
                this.glBack.lineTo(w/3+y/2,h-y);        
                if (left) this.glBack.lineTo(w/3,h);   
                this.glBack.lineTo(w/3-y/2,h-y);        

                this.glBack.lineTo(x+r, h-y);
                this.glBack.quadraticCurveTo(x, h-y, x, h-y-r);
                this.glBack.lineTo(x, 0+r);
                this.glBack.quadraticCurveTo(x, 0, x+r, 0);
            }           
            this.glBack.endFill();
            this.glBack.position.set(this.origin.vx, this.origin.vy);
            //this.glBack.alpha = 0.5;
        }
    }
}
class Script {
    constructor() {
        this.sequence = 0;		// story board, composed of object-value pairs
        this.frame = 0;			// sequence counter
        this.frameStack = new Array();
    }   
    Init(name) {
        if (typeof name === 'string') {
            Helper.loadScript(name, () => {
                Stage.script.sequence = eval(name);
            });
        }
        else {
            Stage.script.sequence = name;
        }
        this.frame = 0;
    }   
    Update() {
        if (Helper.supportsLocalStorage()) {
            if (Stage.script.sequence[0] == label) {
                let tmp = new Array();
                if  (localStorage["_persist_skip_"+Stage.script.sequence[1]] != null)
                    tmp = JSON.parse(localStorage["_persist_skip_"+Stage.script.sequence[1]]);
                if ((tmp.length == 0) || (tmp.length%2 == 1)) 
                    tmp.push(Stage.script.frame);
                else {
                    let found = false;
                    for (let i=0; i<tmp.length; i+=2) {
                        if ((Stage.script.frame >= tmp[i]) && (Stage.script.frame <= tmp[i+1]+2)) {
                            if (Stage.script.frame > tmp[i+1]) 
                                tmp.splice(i+1,1,Stage.script.frame);
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
            if (typeof(this.sequence[this.frame]) === 'function') {
                this.sequence[this.frame](this.sequence[this.frame+1]);
            }
            else if (typeof(this.sequence[this.frame]) === 'string') {
                // assumes an actor shortcut
                if (Helper.checkIfActor(this.sequence[this.frame])) {
                    if (typeof this.sequence[this.frame+1] === 'string') {
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
            //console.log("[VNC] End of script!");
            Stage.update = false;
            Stage.pause = true;
        }
    }
    setFrame(locator) {
        let str = locator.split('#');
        if (str.length > 1) {
            // jump to a new sequence#label
            let newseq = str.shift();
            
            // TODO: unload old sequence to free memory
            //var oldseq = this.sequence[1];
            //window[oldseq].splice(0, this.sequence.length);
            //window[oldseq] = null;
            
            Helper.loadScript(newseq, () => {
                Stage.script.sequence = eval(newseq);
                let newlabel = str.shift();
                for (let i=0; i<Stage.script.sequence.length; i+=2){
                    if ((Stage.script.sequence[i] == label) && (Stage.script.sequence[i+1] == newlabel)) {
                        Stage.script.frame = i;
                        return true;
                    }
                }
            });
        }
        else {
            // jump to new label
            let newlabel = str.shift();
            for (let i=0; i<this.sequence.length; i+=2){
                if ((this.sequence[i] == label) && (this.sequence[i+1] == newlabel)) {
                    this.frame = i;
                    return true;
                }
            }
        }
        return false;
    }
    pushFrame(hack=false) {
        let seq_name = '';
        if (this.sequence[0] == label)
            seq_name = this.sequence[1];
        // TODO: limit stack to 8 
        while (this.frameStack.length >= 8)
            this.frameStack.shift();
        //this.frameStack.push([seq_name, this.frame-2]);
        this.frameStack.push([seq_name, (!hack)?this.frame:this.frame-2]);    
    }
    popFrame() {
        if (this.frameStack.length > 0) {
            let ret_frame = this.frameStack.pop();
            this.sequence = eval(ret_frame[0]);
            this.frame = ret_frame[1];
        }
    }
    insert(newScript) {
        for (let i=0; i<newScript.length; i+=2) {
            if ((this.sequence[this.frame+2+i] == newScript[i]) &&
                (JSON.stringify(this.sequence[this.frame+3+i]) == JSON.stringify(newScript[i+1]))) {
                this.sequence.splice(this.frame+2+i,2);
            }
            this.sequence.splice(this.frame+2+i,0,newScript[i]);
            this.sequence.splice(this.frame+3+i,0,newScript[i+1]);
        }
    }
    remove(name, start=0, len=0) {
        if (name == this.sequence[1]) {  // required: first line of any script is "label, <scriptname>"
            // this is current sequence, handle frame correctly
            this.sequence.splice(start, len);
            if (this.frame >= start+len)
                this.frame -= len;
            
        }
        else {
            // this is not current sequence, we can splice freely
            let sequence = eval(name);
            sequence.splice(start, len);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// Main Stage
///////////////////////////////////////////////////////////////////////////////
var Stage = {
	canvasid: 0,
	canvas: 0,
	context: 0,
	redraw: 0,
	update: 0,
	pause: 0,
	script: 0,	
    
    sBox: 0,        // WebGL new

 	fps: 0,
	curtime: 0,
	prevtime: 0,
	framecount: 0,

	/* event handling */
	mouseMove: false,
	mouseClick: false,
	mouseUp: false,
	mouseDown: false,
	mouseOut: false,
	touchStart: false,
	touchEnd: false,
	keyDown: false,
	keyUp: false,
	keyChar: 0,
    keyPressed: 0,
    downTime: 0,
	eventProcessed: false,
    
	coord: new Vector2d(0,0),
    click: new Vector2d(0,0),
	targetPos: new Vector2d(0,0),

    capture: false,
	inputFocus: true,
	stageIdle: 0,
    lookAheadFrame: 0,
	transTime: 0,
    shake: 0,
    fall: 0,
	//activeForm: null,
	utimer: 0,
	utimerOn: false,

	/* 	Normally shouldn't need more than 5 layers,
		the higher the layer, the higher Z order
			- background = 0: backdrop layer
			- foreground = 1: actors in foreground (optionally more than one layer)
			- overlay	 = 2: actors in closeup, overlay image
			- atmosphere = 3: atmospheric effects, e.g. lightning flash, dim/brighten, smoke, rain, etc.
			- interface  = 4: script box, buttons, ads
	*/
	//layers: new Array(5),     // WebGL changed
    layers: {},
	/*	User variables that the script can set/get
		useful for checking conditions, etc.
	*/
	variables: new Map(),       // WebGL changed
	/*	Sounds to play, 3+1 types of sound
			- bgm = 0: background music
			- bgs = 1: background sound
			- se  = 2: sound effects
			- voice = 3: dialog vocals
	*/
	//sounds: new Array(4),     // WebGl changed
    sounds: {},
	/*	Custom defined animations
			- reusable for actor, scenes and overlays
	*/
	//animations: new Array(),    // WebGl changed
    animations: {},
	/* 	Videos to play, currently only one video at a time
			- for intros, cutscenes, etc.
	*/
	//videos: new Array(),
    videos: new Map(),                 // WebGl changed
	/* 	Forms can be used for user required input/configuration
			- top menu (for new game, continue or options)
			- options menu
	*/
	formStack: new Array(),     // WebGL changed
	formStyle: new Array(),
	formBindings: new Set(),    // WebGL changed
	activeForm: null,
    fromForm: false,
	isCordova: false,

    /* WebGL support 
    */
    isWebGL: false,
    glScene: 0,
    glRenderer: 0,
    glManager: 0,
    /*  Create one container per layer
    */
    glSubScene: new Array(6),   //+1 for video

    // ES6: Do not use fat arrow, as 'this' will refer to 'window'
    //      'this' must refer to Stage
	Init: function(id, width, height) {
 		this.canvasid = id;
		this.canvas = document.getElementById(id);
		this.canvas.setAttribute('width', width);
		this.canvas.setAttribute('height', height);
        
        this.isWebGL = Helper.checkWebGL();
        if ((Config.glRenderer == 'webgl') && this.isWebGL) {
            this.glRenderer = new PIXI.WebGLRenderer({width:width, height:height, view:this.canvas});
        }
        else if (Config.glRenderer == 'canvas') {
            this.glRenderer = new PIXI.CanvasRenderer({width:width, height:height, view:this.canvas});
        }
        else // (Config.glRenderer == 'auto')
            this.glRenderer = PIXI.autoDetectRenderer({width:width, height:height, view:this.canvas});
        this.glScene = new PIXI.Container();
        this.glManager = new ResourceManager();
        for (let i=0; i<6; i++) {
            this.glSubScene[i] = new PIXI.Container();     //one container per layer
            this.glScene.addChild(this.glSubScene[i]);
        }
        //if (this.isWebGL) { TODO }
        this.Splash();

 		this.coord = new Vector2d(width/2, height/2);
        this.targetPos.copy(this.coord);        
		// idle detection
		this.stageIdle = false;
        // add mouse/touch input events
        this.addListeners();
		// create the stage layers
		this.layers['bg'] = new Map(); 	//background
		this.layers['fg'] = new Map();     //foreground
		this.layers['ovl'] = new Map();	    //overlay
		this.layers['atm'] = new Map();	    //atmosphere
		this.layers['gui'] = new Map();	    //gui/hud
		// auto create script box as first element in layers[4]
		// FF/requireJS workaround: FF fails in asynchronous load
		let sb = new ScriptBox();
		sb.Create(width, height);
		this.layers['gui'].set("box", sb);
		Helper.updateConfig("activeTheme");
		// create the script
		this.script = new Script();
 		// create the sounds playlist
		this.sounds['bgm'] = new Map();
		this.sounds['bgs'] = new Map();
		this.sounds['se'] = new Map();
		this.sounds['vc'] = new Map();

		// check and wait if script is loaded
		// setup timer tick
		this.update = true;		// use this.update = false to wait when loading resources
		this.redraw = true;		// use this.redraw = false when redraw not necessary
        this.pause = false;		// use this.pause = true to wait with timer or user input
		this.Tick(1000/60);		// for 60fps
    },
    addListeners: function() {
		Helper.addEvent(this.canvas, 'mousemove', (e) => {
			//console.log("handleEvents: mousemove");
			this.mouseOut = false;
			this.mouseUp = false;
			this.mouseDown = false;
			this.mouseMove = true;
			this.handleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'mousedown', (e) => {
			//console.log("[VNC]: handleEvents: mousedown");
			e.preventDefault();
			if (e.which != 1) return;
			this.mouseDown = true;
            this.downTime = Date.now();
			this.handleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'mouseup', (e) => {
			//console.log("handleEvents: mouseup");
			if (e.which != 1) return;
			this.mouseUp = true;
			this.mouseDown = false;
			this.handleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'mouseover', (e) => {
			//console.log("handleEvents: mouseover");
			this.mouseOut = false;
			this.handleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'mouseout', (e) => {
			//console.log("handleEvents: mouseout");
			this.mouseOut = true;
			//Stage.handleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'touchstart', (e) => {
			//console.log("handleEvents: touchstart");
			e.preventDefault();
			this.mouseOut = false;
			this.touchStart = true;
            this.downTime = Date.now();
			this.handleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'touchmove', (e) => {
			//console.log("handleEvents: touchmove");
			e.preventDefault();
			this.mouseOut = false;
			this.mouseMove = true;
			this.handleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'touchend', (e) => {
			//console.log("handleEvents: touchend");
			e.preventDefault();
			this.mouseOut = false;
			this.touchEnd = true;
			this.handleEvents(e);
		}, false);
		// addEventListener to body for 'touchcancel' ?
		Helper.addEvent(document.body, 'touchcancel', (e) => {
			//console.log("handleEvents: touchcancel");
			this.mouseOut = true;
			this.touchStart = false;
			this.touchEnd = false;
		}, false);
		// add keyboard events: Return/Enter, arrow keys
		Helper.addEvent(this.canvas, 'keyup', (e) => {
			//console.log("handleEvents: keyup");
			this.keyUp = true;
			this.keyDown = false;
            this.keyPressed = 0;
			if (this.keyChar == 13) {
				// process Enter/Return
				this.handleEvents(e);
				this.keyChar = 0;
			}
		}, false);
		Helper.addEvent(this.canvas, 'keydown', (e) => {
            console.log("[VNC]: handleEvents: keydown "+e.keyCode);
			if (!this.mouseOut) {
				this.keyUp = false;
				this.keyDown = true;
				this.keyChar = e.keyCode;
				switch (e.keyCode) {
					case 37:	//left
					case 38:	//up
					case 39:	//right
					case 40:	//down
                        this.keyPressed = e.keyCode;
						this.handleEvents(e);
						break;
					default:
						break;
				}
			}
		}, false);
    },
	Update: function(elapsed) {
		// Note: set this.redraw to true if update needs a redraw
		//this.inputFocus = (this.activeForm === null);
        this.inputFocus = true;     // WebGL: removed standard forms
        for (let [key, control] of this.layers.gui) {
            if (control.inputFocus)
                this.inputFocus = false;
        }
        this.coord.copy(this.targetPos);

        // handle user inputs
   		if (this.mouseMove) {
			this.redraw = true;
		}
		if (this.mouseClick) {
            if (this.inputFocus)
                this.pause = false;	
            if (this.utimerOn) {
                this.utimerOn = false;
                clearTimeout(this.utimer);
                this.layers.gui.get('box').timeout = 0;
            }
		}
        
		// update the script
		//if (this.update && !this.pause) {
		if (!this.capture && this.script && this.update /*&& this.inputFocus*/) {
			if (!(this.pause &&	!Helper.skipReadText()))
				this.script.Update()
		}
        // update resource manager
        this.glManager.Update();

        // play sounds if any
        for (let s in this.sounds) {
            if (this.sounds.hasOwnProperty(s)) {
                for (let [key, sound] of this.sounds[s]) {
                    sound.mute = Helper.findVar('_mute_audio');
                    if (sound.isStopping)
                        sound.stop(false);
                    //else
                    //    sound.play(true);
                }
            }
        }
        // play videos if any
        for (let [key, vid] of this.videos.entries()) {
            vid.mute(Helper.findVar("_mute_audio"));
            if (vid.isStopping || this.mouseClick) {
                vid.stop();
                this.videos.delete(key);
            }
            else
                vid.play();
        }
        
		// update layers
		let running_update = true;
		for (let i in this.layers) {
            for (let [key, object] of this.layers[i].entries()) {
                if (!object.Update(elapsed)) {
                    running_update = false;
                }
            }
		}
		this.update = running_update;

		// update stage transition time
		if (this.transTime > 0) {
			this.transTime = Math.max(0, this.transTime - elapsed/1000);
            if (this.transTime<=0) {
                this.shake = 0;
                this.fall = 0;
            }
		}

		// reset clicked, assumed processing done
		if (this.eventProcessed) {
			this.mouseClick = false;
            this.mouseUp = false;
			this.mouseMove = false;
			this.touchStart = false;
			this.touchEnd = false;
			this.eventProcessed = false;
		}
    },
	Draw: function() {
		let running_draw = false;
		// draw background here
		//for (let scene of this.layers[0]) {
        for (let [key, scene] of this.layers.bg.entries()) {
            if (scene.Draw()) running_draw = true;
		}
		// draw foreground here
        if (this.layers.fg.size > 0) {
            for (let [key, actor] of this.layers.fg.entries()) {
                if (actor.Draw()) running_draw = true;
                if (this.redraw) {
                    if (actor.pendingRemoval) {
                        actor.glActor.destroy(true);
                        this.layers.fg.delete(key);
                    }
                }
            }
        }
		// draw overlay/closeup here
		for (let [key, overlay] of this.layers.ovl.entries()) {
            if (overlay.Draw()) running_draw = true;
 			if (this.redraw && overlay.visible) {
				if (overlay.scroll) {
                    let offsetX = this.canvas.width/2 - ((this.coord.vx/this.canvas.width)-0.5)*(-this.canvas.width+overlay.imageDim.vx);
                    let offsetY = this.canvas.height/2 - ((this.coord.vy/this.canvas.height)-0.5)*(-this.canvas.height+overlay.imageDim.vy);
                    overlay.glSprite.position.set(offsetX, offsetY);
                    running_draw = true;
                }
            }
		}
		// draw atmosphere effects here
		for (let [key, atmo] of this.layers.atm.entries()) {
            if (atmo.Draw()) running_draw = true;
		}		
		// draw gui here
        for (let [key, control] of this.layers.gui.entries()) {
            if (control.Draw()) running_draw = true;
            if (this.redraw && control.visible && (control.type != 'box')) {
                //if (!Helper.checkMapAccess(control.group, control.id))
                //    continue;
                if ((control.state=='hover') && control.tooltip && (this.transTime<=0))
                    control.showTooltip();
                else
                    if (control.hideTooltip) control.hideTooltip();
            }
        }
		// draw videos here
        for (let [key, video] of this.videos.entries()) {
            if (video.Draw()) running_draw = true;
        }
        
		// update redraw variable
		this.redraw = running_draw;

        if (this.redraw) {
            this.glScene.position.x = this.shake * this.transTime * Math.sin(this.transTime*10*Math.PI);
            this.glScene.position.y = this.fall * this.transTime * Math.sin(this.transTime*10*Math.PI);

            this.glRenderer.render(this.glScene);
        }
    },   
	handleEvents: function(evt) {
		if (this.mouseOut) { Stage.canvas.blur(); return; }
		// give focus to canvas element
		Stage.canvas.setAttribute('tabindex','0');
		Stage.canvas.focus();

		// all mouse and touch moves
		if (!this.keyDown && !this.keyUp)
			this.targetPos = (this.touchStart && !this.touchEnd) ? 
							this.getTouchPosition(this.canvas, evt) :
							this.getMousePosition(this.canvas, evt);

        // mouse click / touch end
		if (this.mouseUp || this.touchEnd || this.keyUp) {
			this.click.copy(this.coord);	// used only for debug
            if ((Math.abs(this.downTime - Date.now()) <= 200) && !this.mouseClick) {
                console.log("[VNC]: handleEvents: mouseclick");
                this.mouseClick = true;
                this.mouseUp = false;
                this.touchEnd = false;
                this.touchStart = false;
                this.keyUp = false;
            }
            
			for (let [key, controls] of Stage.layers.gui.entries()) {
                // TODO: buttons
                if (/*(controls.type == 'button') &&*/ (controls.link)) {
                    if (controls.rect.isPointInRect(this.targetPos.vx, this.targetPos.vy))
                        controls.state = 'hover';
                    else
                        controls.state = 'base';
                }
			}
        }
		else if (this.mouseDown || this.touchStart) {
			//if (!Stage.activeForm) {
				// TODO: check for clickable objects, only for top/last scene
				if (Stage.layers.bg.size>0) {
                    // TODO: objects
				}
				for (let [key, controls] of Stage.layers.gui.entries()) {
                    // TODO: buttons
                    if (/*(controls.type == 'button') &&*/ (controls.link)) {
                        if (controls.rect.isPointInRect(this.targetPos.vx, this.targetPos.vy))
                            controls.state = 'click';
                        else
                            controls.state = 'base';
                    }
				}
			//}
		}
		else if (this.mouseMove) {
			for (let [key, controls] of Stage.layers.gui.entries()) {
                // TODO: buttons
                if (/*(controls.type == 'button') &&*/ (controls.link)) {
                    if (controls.rect.isPointInRect(this.targetPos.vx, this.targetPos.vy))
                        controls.state = (controls.state != 'click') ? 'hover' : 'click';
                    else
                        controls.state = 'base';
                }
			}
		}
		else if (this.keyChar != 0) {
            // TODO: menu up/down
			this.keyChar = 0;
		}

		this.eventProcessed = true;
	},    
	getMousePosition: function(obj, event) {
		let pos = new Vector2d(event.pageX, event.pageY);
		pos.vx -= obj.offsetLeft + obj.offsetParent.offsetLeft;
		pos.vy -= obj.offsetTop + obj.offsetParent.offsetTop;
		// scale accdg to automatic responsive resizing
		let scale = obj.width/obj.clientWidth;
		pos.vx = Math.max(0, Math.min(obj.width, pos.vx*scale));
		pos.vy = Math.max(0, Math.min(obj.height, pos.vy*scale));
		try { return pos; }
		finally { pos = null; }
	},
	getTouchPosition: function(obj, event) {
		let pos = new Vector2d(0,0);
		if ((event.touches != null) && (event.touches != undefined)) {
			pos.vx = event.touches[0].pageX - obj.offsetLeft - obj.offsetParent.offsetLeft;
			pos.vy = event.touches[0].pageY - obj.offsetTop - obj.offsetParent.offsetTop;
		}
		else {
			pos.vx = event.targetTouches[0].pageX - obj.offsetLeft - obj.offsetParent.offsetLeft;
			pos.vy = event.targetTouches[0].pageY - obj.offsetTop - obj.offsetParent.offsetTop;
		}
		let scale = obj.width/obj.clientWidth;
		pos.vx = Math.max(0, Math.min(obj.width, pos.vx*scale));
		pos.vy = Math.max(0, Math.min(obj.height, pos.vy*scale));
		try { return pos; }
		finally { pos = null; }
	},
	Transition: function(time) {
		this.transTime = Math.max((time != null) ? time : Config.transTime, 0.1);
	},
	Tick: function(interval) {	
        // halt until splash screen is done
        if (!Stage.splashDone) {
            requestAnimFrame(function(){
                Stage.Tick(interval);
            });
            return;
        }

        let now = new Date().getTime();
		let elapsed = now - this.curtime;	// time since last update
		this.curtime = now;
		//now = null;
		this.framecount++;
		if (this.curtime - this.prevtime >= 1000) {
			this.prevtime = this.curtime;
			this.fps = this.framecount;
			this.framecount = 0;
            //console.log('[VNC] fps='+ this.fps);
		}
		
		// update the stage
		this.Update(elapsed);	
		// draw the stage
		this.Draw();
        
		// check for idle
		this.stageIdle = false;
		if (this.pause && (this.transTime <= 0) && (this.fps > 30)) {
			this.stageIdle = true;
			if (Config.gameAllowLookAhead && (this.script.frame > this.lookAheadFrame)) {
				// look for resources to preload
				for (let i=this.script.frame; i<this.script.sequence.length; i+=2) {
					if ((this.script.sequence[i] == actor) ||
						(this.script.sequence[i] == scene) ||
						(this.script.sequence[i] == overlay) ||
						(this.script.sequence[i] == audio) ||
						(this.script.sequence[i] == video)) {
						this.lookAheadFrame = i;
						setTimeout(function() {
							Helper.preloadResources(Stage.script.sequence[Stage.lookAheadFrame],
													Stage.script.sequence[Stage.lookAheadFrame+1]);
						}, 250);
						break;
					}
				}
			}
		}

		// setup next timer tick
        requestAnimFrame(() => {
			Stage.Tick(interval);
		});
    },
    Splash: function() {
        // display a 3-sec generated VNCANVAS logo at start of game
        // DO NOT REMOVE or BYPASS!
        let size = 1.0;
        if (Config.splashSize && (Config.splashSize>0.2))  size = Config.splashSize;
        
        let x = Stage.canvas.width/2;
        let y = Stage.canvas.height/2;

        let glSplash = new PIXI.Graphics();
        let fillcolor = w3color("rgb(241, 101, 41)");
        glSplash.beginFill(fillcolor.toVal(), 1);
        glSplash.drawCircle(x,y,96*size);
        glSplash.endFill();

        fillcolor = w3color("rgb(255, 255, 255)");
        glSplash.beginFill(fillcolor.toVal(), 1);
        glSplash.moveTo(x-86*size, y-42*size);
        glSplash.lineTo(x+86*size, y-42*size);
        glSplash.lineTo(x+88*size, y-38*size);
        glSplash.lineTo(x-88*size, y-38*size);
        glSplash.endFill();
        glSplash.beginFill(fillcolor.toVal(), 1);
        glSplash.moveTo(x-88*size, y+38*size);
        glSplash.lineTo(x+88*size, y+38*size);
        glSplash.lineTo(x+86*size, y+42*size);
        glSplash.lineTo(x-86*size, y+42*size);
        glSplash.endFill();
        
        glSplash.beginFill(fillcolor.toVal(), 1);
        glSplash.moveTo(x-90*size, y-30*size);
        glSplash.quadraticCurveTo(x-65*size, y+30*size, x-32*size, y+30*size);
        glSplash.lineTo(x-32*size, y-30*size);
        glSplash.lineTo(x-48*size, y-30*size);
        glSplash.lineTo(x-48*size, y+14*size);
        glSplash.quadraticCurveTo(x-65*size, y+10*size, x-90*size, y-30*size);
        glSplash.endFill();

        glSplash.beginFill(fillcolor.toVal(), 1);
        glSplash.moveTo(x-22*size, y-30*size);
        glSplash.lineTo(x-22*size, y+30*size);
        glSplash.lineTo(x-6*size, y+30*size);
        glSplash.lineTo(x-6*size, y-14*size);
        glSplash.quadraticCurveTo(x+11*size, y-15*size, x+36*size, y+30*size);
        glSplash.quadraticCurveTo(x+20*size, y-30*size, x-22*size, y-30*size);
        glSplash.endFill();

        glSplash.beginFill(fillcolor.toVal(), 1);
        glSplash.moveTo(x+26*size, y-30*size);
        glSplash.quadraticCurveTo(x+30*size, y+15*size, x+86*size, y+30*size);
        glSplash.quadraticCurveTo(x+45*size, y+10*size, x+42*size, y-14*size);
        glSplash.lineTo(x+86*size, y-14*size);
        glSplash.lineTo(x+86*size, y-30*size);
        //glSplash.lineTo(x+26*size, y-30*size);
        glSplash.endFill();

        let glSplashTexture = glSplash.generateCanvasTexture();
        let glSplashSprite = new PIXI.Sprite(glSplashTexture);
        glSplashSprite.anchor.set(0.5,0.5);
        glSplashSprite.position.set(x,y);

        //this.glScene.addChild(glSplash);
        this.glScene.addChild(glSplashSprite);
        this.glRenderer.render(this.glScene);
        Stage.splashDone = false;
        setTimeout(() => {
            this.glScene.removeChild(glSplashSprite);
            Stage.splashDone = true;
		}, (Config.splashDuration && (Config.splashDuration>1.0) ? Config.splashDuration*1000 : 3000));        
    },    
}

// ensure config and stats is not null
if ((Config === null) || (Config === undefined))
	var Config = {};
if ((Stats === null) || (Stats === undefined))
	var Stats = {};

