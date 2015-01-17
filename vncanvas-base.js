///////////////////////////////////////////////////////////////////////////////
//  Visual Novel JAVASCRIPT Engine for HTML5 CANVAS by [lo'ner]              //
//  Author: oclabbao@yahoo.com, oclabbao@gmail.com                           //
//  Based on:                                                                //
//      Construct2 - HTML5 game creator (www.scirra.com)                     //
//      js-vine.js by J. David Eisenberg                                     //
//      enchant.js by Ubiquitous Entertainment Inc.                          //
//      Ren'Py Python VN engine (www.renpy.org)                              //
//  Requires:                                                                //
//      CanvasText by Pere Monfort Pàmies (www.pmphp.net, www.canvastext.com)//
//          - modded to support \n, hover and scroll in text                 //
//      RequireJS by Dojo Foundation (http://github.com/jrburke/requirejs)   //
//      [Optional] JQuery by John Resig (jquery.com)                         //
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
	Copyright © 2015 by OCLabbao a.k.a [lo'ner]

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published 
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

******************************************************************************/
/******************************************************************************
Revision history:
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
//require(["app/vncanvas-vars"]);

///////////////////////////////////////////////////////////////////////////////
// Generic/helper methods
///////////////////////////////////////////////////////////////////////////////
var Helper = {
	// Function for adding an event listener
	_registry: null,
	initialise: function () {
		if (this._registry == null) {
			this._registry = [];
			Helper.addEvent(window, 'unload', this.cleanUp);
		}
	},
	cleanUp: function () {
		for (var i = 0; i < Helper._registry.length; i++) {
			var obj = Helper._registry[i].obj;
			var evType = Helper._registry[i].evType;
			var fn = Helper._registry[i].fn;
			var useCapture = Helper._registry[i].useCapture;
			if (obj.removeEventListener)
				obj.removeEventListener(evType, fn, useCapture);
			else if (obj.detachEvent)
				obj.detachEvent("on" + evType, fn);
		}
		Helper._registry = null;
	},
	addEvent: function (obj, evType, fn, useCapture) {
		this.initialise();
		if (typeof obj == 'string')
			obj = document.getElementById(obj);
		if ((obj == null) || (fn == null))
			return false;
		if (obj.addEventListener) {
			obj.addEventListener(evType, fn, useCapture);
			this._registry.push({obj: obj, evType: evType, fn: fn, useCapture: useCapture});
			return true;
		}
		if (obj.attachEvent) {
			var r = obj.attachEvent("on" + evType, fn);
			if (r) this._registry.push({obj: obj, evType: evType, fn: fn, useCapture: false});
			return r;
		}
		return false;
	},
	// Function for including external javascript files
	includeJs: function (jsFilePath) {
		//try {
		//	require([jsFilePath]);
		//} 
		//catch(e) {
			var js = document.createElement("script");
			js.type = "text/javascript";
			js.src = jsFilePath;
			//document.getElementsByTagName('head')[0].appendChild(js);
			document.body.appendChild(js);
			js = null;
		//}
	},
	// Function to check support for localStorage
	supportsLocalStorage: function () {
		try {
			return 'localStorage' in window && window['localStorage'] != null && window['localStorage'] !== undefined;
		} 
		catch(e){
			return false; 
		}
	},
	// Helper function to search for user variable
	findVar: function (id) {
		if (Stage.variables[id] != null)
			return Stage.variables[id].Value();
		return null;
	},
	// Helper function to obtain value from stage or config variables or actor stats
	getValue: function (id) {
		var ret = Helper.findStat(id);
		if (ret != null) return ret;
		ret = Helper.findVar(id);
		if (ret != null) return ret;
		return (Config[id]);
	},
	// Helper function to set value to stage or config variables
	setValue: function (id, value) {
		var ret = Helper.findStat(id);
		if (ret != null) {
			var arr_str = id.split('_');
			for (var j in Stage.layers[1]) {
				if (Stage.layers[1][j].id == arr_str[0]) {
					Stage.layers[1][j].stats[arr_str[1]] = value;
					if (Config.modRPG) {
						if (RPG.Stats[arr_str[1]]['_update']) {
							RPG.Stats[arr_str[1]]['_update'](Stage.layers[1][j], Stage.layers[1][j].stats);
						}
					}
					else {
						if (Stats[arr_str[1]]['_update']) {
							Stats[arr_str[1]]['_update'](Stage.layers[1][j], Stage.layers[1][j].stats);
						}
					}
					// TODO: update inherited stats
					break;
				}
			}
		}
		else {
			ret = Helper.findVar(id);
			if (ret != null)
				Stage.variables[id].Set(value, false);
			else {
				Config[id] = value;
				// a configuration variable has changed, reflect it back
				Helper.configUpdate(id);
				Stage.redraw = true;
			}
		}
	},
	// Helper function to update game config
	configUpdate: function (id) {
		switch(id) {
			case "activeTheme": 
				if (Config.activeTheme == null) break;
				// formstyle
				if (Config.activeTheme.formFontStyle) {
					Stage.formStyle.splice(0, Stage.formStyle.length);
					var subs = Helper.parseFontString(Config.activeTheme.formFontStyle);
					if (subs.length >= 4) {
						Stage.formStyle.push(subs.slice(0,3).join(' '));
						Stage.formStyle.push(subs.slice(3).join(' '));
					}
					else
						Stage.formStyle.push(param);
				}
				// tooltips are automatically updated
				// script box
				if (Config.activeTheme.boxFontStyle) { 
					var subs = Helper.parseFontString(Config.activeTheme.boxFontStyle);
					
					if (subs.length > 0) Stage.layers[4][0].fontWeight = subs[0];
					if (subs.length > 1) {
						Stage.layers[4][0].fontSize = subs[1];
						Stage.layers[4][0].lineHeight = parseInt(subs[1]) + 4;
					}			
					if (subs.length > 2) Stage.layers[4][0].fontFamily = subs[2].replace(/['|"]/g,'');
					if (subs.length > 3) Stage.layers[4][0].fontColor = subs[3];
				}
				if (Config.activeTheme.boxTagStyle) {
					var subs = Helper.parseFontString(Config.activeTheme.boxTagStyle);
					
					if (subs.length > 0) Stage.layers[4][0].tagWeight = subs[0];
					if (subs.length > 1) Stage.layers[4][0].tagSize = subs[1];
					if (subs.length > 2) Stage.layers[4][0].tagFamily = subs[2].replace(/['|"]/g,'');
					if (subs.length > 3) Stage.layers[4][0].tagColor = subs[3];
				}
				if (Config.activeTheme.boxDimStyle) {
					var subs = Config.activeTheme.boxDimStyle.split(' ');
					Stage.layers[4][0].dimStyle.splice(0,Stage.layers[4][0].dimStyle.length);
					for (var idx in subs)
						Stage.layers[4][0].dimStyle.push(subs[idx]);
				}
				if (Config.activeTheme.boxImageStyle)
					Stage.layers[4][0].src = Config.activeTheme.boxImageStyle;
				else
					Stage.layers[4][0].src = null;
				// balloon styling
				Stage.layers[4][0].balloonStyle.splice(0,Stage.layers[4][0].balloonStyle.length);
				if (Config.activeTheme.balloonStrokeStyle)
					Stage.layers[4][0].balloonStyle.push(Config.activeTheme.balloonStrokeStyle);
				else
					Stage.layers[4][0].balloonStyle.push('transparent');
				if (Config.activeTheme.balloonFillStyle) {
					var subs = Config.activeTheme.balloonFillStyle.split(' ');
					for (var idx in subs)
						Stage.layers[4][0].balloonStyle.push(subs[idx]);
				}
				// configure CanvasText
				Stage.layers[4][0].canvasText.config({
					canvas: Stage.layers[4][0].context.canvas,
					context: Stage.layers[4][0].context,
					fontFamily: Stage.layers[4][0].fontFamily,
					fontSize: Stage.layers[4][0].fontSize,
					fontWeight: Stage.layers[4][0].fontWeight,
					fontColor: Stage.layers[4][0].fontColor,
					lineHeight: Stage.layers[4][0].lineHeight
				});
				Stage.layers[4][0].canvasText.defineClass("menu", {
					fontFamily: Stage.layers[4][0].fontFamily,
					fontSize: Stage.layers[4][0].fontSize,
					fontWeight: Stage.layers[4][0].fontWeight,
					fontColor: Stage.layers[4][0].fontColor,
					fontStyle: "italic"
				});
				break;
			case "volumeAudio":
				if (Config.volumeAudio == null) break;
				if (typeof Config.volumeAudio == 'string') {
					var volume = parseFloat(Config.volumeAudio);
					if (isNaN(volume)) volume = 1.0;
					Config.volumeAudio = volume;
				}
				for (var idx in Stage.sounds) {
					for (var entry in Stage.sounds[idx]) {
						if ((!Stage.sounds[idx][entry].isPaused) && (!Stage.sounds[idx][entry].isStopping))
							Stage.sounds[idx][entry].audio.volume = Config.volumeAudio;
					}
				}
				break;
			case "volumeVideo":
				if (Config.volumeVideo == null) break;
				if (typeof Config.volumeVideo == 'string') {
					var volume = parseFloat(Config.volumeVideo);
					if (isNaN(volume)) volume = 1.0;
					Config.volumeVideo = volume;
				}
				for (var idx in Stage.videos) {
					if (!Stage.videos[idx].isStopping) {
						this.videos[idx].movie.volume = Config.volumeVideo;
					}
				}
				break;
		}
	},
	// Helper function to parse string arguments
	parseArg: function (arg) {
		// check if arg is a user variable
		var ret = Helper.findVar(arg);
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
	parseFontString: function (s) {
		var splitText = s.split(' ');
		// combine as needed
		var subs = new Array();
		var combine = false;
		var tempText = '';
		for (var i in splitText) {
			if (splitText[i].search(/^['|"].*['|"]$/g)!=-1) {
				combine = false;
				subs.push(splitText[i].replace(/^['|"]|['|"]$/g, ""));
			}
			else if (splitText[i].search(/['|"]/g)!=-1) {
				if (combine == false) {
					combine = true;
					tempText = splitText[i];
				}
				else {
					combine = false;
					tempText += " " + splitText[i];
					subs.push(tempText);
				}
			}
			else {
				if (combine == true)
					tempText += " " + splitText[i];
				else
					subs.push(splitText[i]);
			}
		}
		return subs;
	},
	// Helper function to check for image file
	checkIfImage: function(src) {
		// crude way of checking if src is an image
		src = Helper.parseArg(src);
		return (/jpg|jpeg|bmp|png|gif|svg/i.test(src));
	},
	// Helper function to process audio
	processAudio: function (obj, src, param) {
		var mimeType = {"wav": 'audio/wav',
						"ogg": 'audio/ogg;codecs="vorbis"',
						"oga": 'audio/ogg;codecs="vorbis"',
						"mp3": 'audio/mpeg',
						"m4a": 'audio/mp4;codecs="mp4a.40.2"',
						"aac": "audio/aac",
						"webma": 'audio/webm; codecs="vorbis"'};			
		var index = -1;
		src = Helper.parseArg(src);
		for (var i in obj) {
			if (obj[i].src.search(src) != -1) {
				index = i;
				break;
			}
		}
		if (index != -1) {
			switch (param.action) {
				case "stop":
					obj[index].Stop(false);
					break;
				case "pause":
					obj[index].Pause();
					break;
				case "rewind":
					obj[index].Rewind();
					break;
				case "remove":
					if (param.bgs || param.se) {
						obj[index].Stop(true);
						obj[index].audio = null;
						obj.splice(index, 1);
					}
					break;
				case "play":
				default:
					obj[index].Play(false);
					break;
			}
		}
		else {
			try {
				var s = new Sounds();
				s.src = null;
				var soundformat = (param.format) ? param.format : Config.audioFormat;
				for (var i in soundformat) {
					//if (s.audio.canPlayType(mimeType[soundformat[i]]) != '') {
					//if (!!s.audio.canPlayType(mimeType[soundformat[i]])) {
					// workaround, only allow 'probably'; 'maybe' oftentimes fail
					if (s.audio.canPlayType(mimeType[soundformat[i]]).toLowerCase() == 'probably') {			
						s.src = src + '.' + soundformat[i];
						break;
					}
				}
				if (s.src != null) {
					if ((param.bgm) || (param.voice)){
						while (obj.length > 0) {
							var old = obj.shift();
							old.Stop(true);
							old.audio = null;
						}
					}
					if ((param.se) || (param.voice))
						s.repeat = (param.repeat > 0) ? param.repeat : 0;
					else
						s.repeat = -1;
					s.delay = (param.delay > 0) ? param.delay : 0;
					s.Mute(Helper.findVar("_mute_audio"));	// initialize muted property
					obj.push(s);
				}
				s = null;
			}
			catch (e) {
			}
		}
	},
	// Helper function to process effects
	processEffects: function (obj, elapsed) {
		if (obj.effects.indexOf('done')!=-1) {
			obj.drawn = true;
			return;
		}
		var fxarr = obj.effects.split('_');
		if (fxarr[0] == '') fxarr[0] = 'none';
		if (fxarr.length == 1) fxarr.push('in');
		
		obj.target_alpha = 1.0;
		TransEffects[fxarr[0]]['_'+fxarr[1]](obj, elapsed);
	},
	// Helper function to draw visual elements
	drawElements: function(obj, order) {
		if (!obj.visible) return false;

		Stage.context.save();
		Stage.context.translate(obj.pos.vx - obj.scale * obj.origin.vx + obj.offset.vx,
								obj.pos.vy - obj.scale * obj.origin.vy + obj.offset.vy);
		Stage.context.scale(obj.scale, obj.scale);
		Stage.context.drawImage(obj.context.canvas,
								Stage.AddDepth(order/10, Stage.canvas.width/2 - Stage.coord.vx) + 
								Stage.shake * Stage.transTime * Math.sin(Stage.transTime*10*Math.PI),
								Stage.AddDepth(order/10, Stage.canvas.height/2 - Stage.coord.vy)/2 +
								Stage.fall * Stage.transTime * Math.sin(Stage.transTime*10*Math.PI),
								obj.context.canvas.width,
								obj.context.canvas.height);	
		Stage.context.restore();
		return (Stage.transTime>0);
	},
	// Helper to interpolate object position
	interpolatePosition: function(obj) {
		if (Stage.transTime <= 0) {
			obj.pos.copy(obj.target_pos);
			obj.startpos = null;
		}
		else {
			if ((obj.startpos == undefined) || (obj.startpos == null))
				obj.startpos = new Vector2d(obj.pos.vx, obj.pos.vy);
			obj.pos.lerp(obj.target_pos, obj.startpos, Stage.transTime/obj.transTime);
		}
	},
	// Helper function to get current speaker
	checkCurrentSpeaker: function(name, append) {
		var current_speaker = '';
		var startIdx = Stage.layers[4][0].text.indexOf(Stage.layers[4][0].tagFamily+";\'>");
		var endIdx = Stage.layers[4][0].text.indexOf("</style><br/>");
		if ((startIdx != -1) && (endIdx != -1)) {
			current_speaker = Stage.layers[4][0].text.substr(startIdx+Stage.layers[4][0].tagFamily.length+3, 
															 endIdx-startIdx-Stage.layers[4][0].tagFamily.length-3);
		}
		//return current_speaker;
		var same_window = false;
		if ((current_speaker != name) || (append == false)) {
			Stage.layers[4][0].cont = false;
			same_window = false;
		}
		else if (append == true) {
			Stage.layers[4][0].cont = true;
			same_window = true;
		}
		else {	// whatever value including undefined
			same_window = Stage.layers[4][0].cont;
		}
		return same_window;
	},
	// Helper function to add name tag, if any, to dialog
	addTagToDialog: function(tag, tagcolor, text, append) {
		var dialog = '';
		Stage.layers[4][0].autotypeCount = 0;
		if (tag != null) {
			dialog = "<style=\'font-weight:" + Stage.layers[4][0].tagWeight +
						";color:" + tagcolor + 
						";font-size:" + Stage.layers[4][0].tagSize +
						";font-family:" + Stage.layers[4][0].tagFamily +
						";\'>" + tag + "</style><br/>";
			Stage.layers[4][0].autotypeCount = tag.length;
		}
		if (append) {
			// strip speaker name here if present
			var index = Stage.layers[4][0].text.indexOf("</style><br/>");
			var buf = "";
			if (index!=-1)
				buf = Stage.layers[4][0].text.slice(index+13);
			else 
				buf = Stage.layers[4][0].text;
			dialog += buf + '\n';
			Stage.layers[4][0].autotypeCount += buf.length+2;
		}
		if (text != null) {
			var match = text.match(/#([^#|\s]+)#/g);
			for (var i in match)
				text = text.replace(match[i],Helper.parseArg(match[i].replace(/#/g,'')));
			dialog += Helper.parseArg(text).toString().replace(/\n/g,"<br/>");
		}		
		return Helper.filterBadWords(dialog);
	},
	// Helper function to show tooltip on forms
	showTooltip: function(tip) {
		Stage.context.save();
		Stage.context.fillStyle = Config.activeTheme.formTipColor;
		Stage.context.shadowColor = 'black';
		Stage.context.shadowBlur = 2;

		var subs = Helper.parseFontString(Config.activeTheme.formTipStyle);
		Stage.context.font = subs.slice(0,3).join(' ');
		var w = Stage.context.measureText(tip).width;
		var h = parseInt(subs[1]);
		var x = Math.min(Stage.coord.vx, Stage.canvas.width - w - 5);
		var y = Math.min(Stage.coord.vy, Stage.canvas.height - 2*h - 5);
		Stage.context.fillRect(x-5, y-5+h, w+10, h+10);
		//Stage.context.strokeRect(x-5, y-5+h, w+10, h+10);
		
		Stage.context.shadowBlur = 0;
		Stage.context.fillStyle = subs.slice(3).join(' ');
		Stage.context.textBaseline = 'top';
		Stage.context.fillText(tip, x, y + h);
		Stage.context.restore();
	},
	// Helper function to filter words, if enabled
	filterBadWords: function (str) {
		if (Config.gameMatureFilter) {
			var pattern = "/(^|\\n?|\\s*)("+Config.gameBadWords.join('|')+")($|\\n?|\\s*)/img";
			return str.replace(eval(pattern), Config.gameAltWord);
		}
		else
			return str;
	},
	// Helper function to queue animation set in script lines
	queueAnimation: function (type, param, aset) {
		var newLines = new Array();
		for (var i=0; i<aset.length; i+=2) {
			if (type == 'scene') newLines.push(scene);
			if (type == 'overlay') newLines.push(overlay);
			if (type == 'actor') newLines.push(actor);
			var newParam = {};
			for (var prop in param) {
				if (param.hasOwnProperty(prop)) {
					if (prop.search(/(src|sprite|avatar|nick|color|say|balloon|append|remove|voice)/g) == -1)
						newParam[prop] = param[prop];
				}
			}
			newParam.time = aset[i];
			newParam.effect = aset[i+1];
			newLines.push(newParam);
		}
		Stage.script.Insert(newLines);
	},
	// Helper function to check map adjacency
	checkMapAccess: function(mapname, locationid) {
		if (this.findVar("_nav_loc") != null) {
			var ret = this.findVar(mapname+'#'+Stage.variables["_nav_loc"].Value());
			if ( ret != null) {
				for (var i in ret)
					if (ret[i] == locationid) return true;
				return false;
			}
		}
		return true;
	},
	// Helper function to preload resources
	preloadResources: function(seq, param) {
		if ((seq == scene) || (seq == overlay)) {
			if ((param.src) && (Helper.checkIfImage(param.src))) {
				var newImage = new Image();
				newImage.src = param.src;
				newImage = null;
			}						
			if (param.objects) {
				for (var j=0; j<param.objects.length; ) {
					var newImage = new Image();
					newImage.src = param.objects[j];
					newImage = null;
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
					var newImage = new Image();
					newImage.src = param.sprite[1];
					newImage = null;
				}
			}
			if (param.avatar) {
				if (typeof param.avatar == 'string') {
					if (Helper.checkIfImage(param.avatar)) {
						var newImage = new Image();
						newImage.src = param.avatar;
						newImage = null;
					}
				}
				else {
					var newImage = new Image();
					newImage.src = param.avatar[1];
					newImage = null;
				}
			}
			if (param.voice) {
				for (var j=0; j<Config.audioFormat.length; j++) {
					var newAudio = new Audio();
					newAudio.preload = 'auto';
					newAudio.autoplay = false;
					newAudio.src = param.voice + '.' + Config.audioFormat[j];
					newAudio = null;
				}
			}
		}
		if (seq == audio) {
			var soundfile, soundformat;
			if (param.bgm) soundfile = param.bgm;
			if (param.bgs) soundfile = param.bgs;
			if (param.se) soundfile = param.se;
			if (param.format) soundformat = param.format;
			else soundformat = Config.audioFormat;
			for (var j=0; j<soundformat.length; j++) {
				var newAudio = new Audio();
				newAudio.preload = 'auto';
				newAudio.autoplay = false;
				newAudio.src = soundfile + '.' + soundformat[j];
				newAudio = null;
			}
		}
		if (seq == video) {
			var videofile, videoformat;
			if (param.src) videofile = param.src;
			if (param.format) videoformat = param.format;
			else videoformat = Config.movieFormat;
			for (var j=0; j<videoformat.length; j++) {
				var newVideo = document.createElement('video');
				newVideo.preload = 'auto';
				newVideo.autoplay = false;
				newVideo.src = videofile + '.' + videoformat[j];
				newVideo = null;
			}
		}
	},
	// Helper function to skip previously read text for quick replay
	skipReadText: function() {
		if (this.findVar("_skip_text") != true) return false;
		if (!Stage.inputFocus) return false;
		if (!this.supportsLocalStorage()) return false;
		if ((Stage.script.sequence[0] != label) || (localStorage["_persist_skip_"+Stage.script.sequence[1]] == null))
			return false;
		var tmp = JSON.parse(localStorage["_persist_skip_"+Stage.script.sequence[1]]);
		for (var i=0; i<tmp.length; i+=2) {
			if ((Stage.script.frame >= tmp[i]) && (Stage.script.frame <= tmp[i+1]))
				return true;
		}
		return false;
	},
	// Helper function to build default stats for a character
	buildStats: function(id) {
		if (Config.modRPG) {
			return RPG.methods.buildStats(id);
		}
		else if (Stats){
			var newStats = {};
			for (var prop in Stats) {
				if (Stats.hasOwnProperty(prop)) {
					newStats[prop] = Stats[prop]._value[0];
					if (Stats[prop]._inherit) {
						newStats[Stats[prop]._inherit[Stats[prop]._value[0]].type] = {};
						for (attr in Stats[prop]._inherit[Stats[prop]._value[0]]) {
							if (attr == "type") continue;
							newStats[Stats[prop]._inherit[Stats[prop]._value[0]].type][attr] =
								Stats[prop]._inherit[Stats[prop]._value[0]][attr]._value[0];
						}
					}
				}
			}
			return newStats;
		}
		return null;
	},
	// Helper function to look for actor stat
	findStat: function (id) {
		if (Stage.layers[1].length > 0) {
			var arr_str = id.split('_');
			if ((arr_str.length > 1) && (arr_str[0].length > 0)){
				for (var i in Stage.layers[1]) {
					if (Stage.layers[1][i].id == arr_str[0])
						return Stage.layers[1][i].stats[arr_str[1]];
				}
			}
		}
		return null;
	}
}
// Function to determine optimal animation frame
window.requestAnimFrame = (function(callback){
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
window.onresize = (function(){
	if (!Config.movieOnCanvas) {
		for (var idx in Stage.videos) {
			var x = Stage.canvas.offsetLeft + (1-Config.movieSize)/2 * Stage.canvas.width;
			var y = Stage.canvas.offsetTop + (1-Config.movieSize)/2 * Stage.canvas.height;
			Stage.videos[idx].movie.setAttribute('style', 'position:absolute; left:'+x+'px; top:'+y+'px');
		}
	}
	for (var i=0; i<document.forms.length; i++) {
		var x = Stage.canvas.offsetLeft;
		var y = Stage.canvas.offsetTop;
		document.forms[i].setAttribute('style', 'position:absolute; left:'+x+'px; top:'+y+'px;');
	}
});

///////////////////////////////////////////////////////////////////////////////
// Rect class
///////////////////////////////////////////////////////////////////////////////
function Rect(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
};
Rect.prototype.isPointInRect = function (x, y) {
	if (x < this.x) return false;
	if (x > this.x + this.w) return false;
	if (y < this.y) return false;
	if (y > this.y + this.h) return false;
	return true;
};
///////////////////////////////////////////////////////////////////////////////
// 2D vector class
///////////////////////////////////////////////////////////////////////////////
function Vector2d(x, y) {
	this.vx = x;
	this.vy = y;
};
Vector2d.prototype.copy = function (vec2) {
	this.vx = vec2.vx;
	this.vy = vec2.vy;
};
Vector2d.prototype.scale = function (scale) {
	this.vx *= scale;
	this.vy *= scale;
};
Vector2d.prototype.add = function (vec2) {
	this.vx += vec2.vx;
	this.vy += vec2.vy;
};
Vector2d.prototype.sub = function (vec2) {
	this.vx -= vec2.vx;
	this.vy -= vec2.vy;
};
Vector2d.prototype.equal = function (vec2) {
	return ((this.vx == vec2.vx) && (this.vy == vec2.vy));
};
Vector2d.prototype.length = function () {
	return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
};
Vector2d.prototype.lengthSquared = function () {
	return this.vx * this.vx + vec.vy * vec.vy;
},
Vector2d.prototype.normalize = function () {
	var len = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
	if (len) {
		this.vx /= len;
		this.vy /= len;
	}
	return len;
};
Vector2d.prototype.rotate = function (angle) {
	var vx = this.vx,
		vy = this.vy,
		cosVal = Math.cos(angle),
		sinVal = Math.sin(angle);
		this.vx = vx * cosVal - vy * sinVal;
		this.vy = vx * sinVal + vy * cosVal;
};
Vector2d.prototype.lerp = function (vec1, vec2, amt) {
	this.vx = (1-amt) * vec1.vx + (amt) * vec2.vx;
	this.vy = (1-amt) * vec1.vy + (amt) * vec2.vy;
};

///////////////////////////////////////////////////////////////////////////////
// Main Stage
///////////////////////////////////////////////////////////////////////////////
var Stage = {
	canvasid: 0,
	canvas: 0,
	context: 0,
	timer: 0,
	redraw: 0,
	update: 0,
	pause: 0,
	script: 0,	
	/* user inputs */
	coord: new Vector2d(0,0),
	click: new Vector2d(0,0),
	utimer: 0,
	utimerOn: false,
	inputFocus: true,
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
	/*	FPS count */
	fps: 0,
	curtime: 0,
	prevtime: 0,
	framecount: 0,
	/* camera movement */
	targetPos: new Vector2d(0,0),
	prevPos: new Vector2d(0,0),
	camTime: 0,
	/* temporary data */
	transTime: 0,
	spritePos: new Array(8),
	shake: 0,
	fall:0,
	stageIdle: 0,
	lookAheadFrame: 0,
	skipTextUpdated: 0,
	/* 	Normally shouldn't need more than 5 layers,
		the higher the layer, the higher Z order
			- background = 0: backdrop layer
			- foreground = 1: actors in foreground (optionally more than one layer)
			- closeup	 = 2: actors in closeup, overlay image
			- atmosphere = 3: atmospheric effects, e.g. lightning flash, dim/brighten, smoke, rain, etc.
			- interface  = 4: script box, buttons, ads
	*/
	layers: new Array(5),
	/*	User variables that the script can set/get
		useful for checking conditions, etc.
	*/
	variables: {},
	/*	Sounds to play, 3+1 types of sound
			- bgm = 0: background music
			- bgs = 1: background sound
			- se  = 2: sound effects
			- voice = 3: dialog vocals
	*/
	sounds: new Array(4),
	//audioContext : new (window.AudioContext || window.webkitAudioContext)(),
	/*	Custom defined animations
			- reusable for actor, scenes and overlays
	*/
	animations: new Array(),
	/* 	Videos to play, currently only one video at a time
			- for intros, cutscenes, etc.
	*/
	videos: new Array(),
	/* 	Forms can be used for user required input/configuration
			- top menu (for new game, continue or options)
			- options menu
	*/
	formStack: new Array(),
	formStyle: new Array(),
	formBindings: new Array(),
	activeForm: null,
	
	Init: function(id, width, height) {
		// DEBUG: for FPS monitoring
		this.fps = 0;
		this.prevtime = new Date().getTime();
		this.curtime = this.prevtime;
		this.framecount = 0;
		
		this.canvasid = id;
		this.canvas = document.getElementById(id);
		this.context = this.canvas.getContext('2d');
		this.canvas.setAttribute('width', width);
		this.canvas.setAttribute('height', height);
		this.coord = new Vector2d(width/2, height/2);
		// for camera integrator
		this.targetPos.copy(this.coord);
		this.prevPos.copy(this.coord);
		// idle detection
		this.stageIdle = false;
		// add event listeners here for user inputs
		Helper.addEvent(this.canvas, 'mousemove', function(e) {
			Stage.mouseOut = false;
			Stage.mouseUp = false;
			Stage.mouseDown = false;
			Stage.mouseMove = true;
			Stage.HandleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'mousedown', function(e) {
			if (e.which != 1) return;
			Stage.mouseDown = true;
			Stage.HandleEvents(e);
		}, false);
		//Helper.addEvent(this.canvas, 'click', function(e) {
		Helper.addEvent(this.canvas, 'mouseup', function(e) {
			if (e.which != 1) return;
			Stage.mouseUp = true;
			Stage.mouseDown = false;
			Stage.HandleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'mouseover', function(e) {
			Stage.mouseOut = false;
			Stage.HandleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'mouseout', function(e) {
			Stage.mouseOut = true;
			//Stage.HandleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'touchstart', function(e) {
			e.preventDefault();
			Stage.mouseOut = false;
			Stage.touchStart = true;
			Stage.HandleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'touchmove', function(e) {
			e.preventDefault();
			Stage.mouseOut = false;
			Stage.mouseMove = true;
			Stage.HandleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'touchend', function(e) {
			e.preventDefault();
			Stage.mouseOut = false;
			Stage.touchEnd = true;
			Stage.HandleEvents(e);
		}, false);
		// addEventListener to body for 'touchcancel' ?
		Helper.addEvent(document.body, 'touchcancel', function(e) {
			Stage.mouseOut = true;
			Stage.touchStart = false;
			Stage.touchEnd = false;
		}, false);
		// add keyboard events: Return/Enter, arrow keys
		Helper.addEvent(this.canvas, 'keyup', function(e) {
			Stage.keyUp = true;
			Stage.keyDown = false;
			if (Stage.keyChar == 13) {
				// process Enter/Return
				Stage.HandleEvents(e);
				Stage.keyChar = 0;
			}
		}, false);
		Helper.addEvent(this.canvas, 'keydown', function (e) {
			if (!Stage.mouseOut) {
				Stage.keyUp = false;
				Stage.keyDown = true;
				Stage.keyChar = e.keyCode;
				switch (e.keyCode) {
					case 37:	//left
					case 38:	//up
					case 39:	//right
					case 40:	//down
						Stage.HandleEvents(e);
						break;
					default:
						break;
				}
			}
		}, false);
		
		// create the stage layers
		this.layers[0] = new Array(); 	//background
		this.layers[1] = new Array();	//foreground
		this.layers[2] = new Array();	//closeup
		this.layers[3] = new Array();	//atmosphere
		this.layers[4] = new Array();	//gui
		// create an auto-position lookup table, up to 8 simultaneous characters
		// which is more than enough, else stage will look crowded
		for (var j=0; j<8; j++) {
			var table = new Array();
			for (var i=1; i<j+2; i++) {
				if (i%2 == 0) // even
					table.push((Stage.canvas.width*(j+2-i/2)/(j+2))>>0);
				else // odd
					table.push((Stage.canvas.width*(((i/2)>>0)+1)/(j+2))>>0);
			}
			this.spritePos[j] = table;
			table = null;
		}
		// auto create script box as first element in layers[4]
		// FF/requireJS workaround: FF fails in asynchronous load
		var sb = new ScriptBox();
		sb.Create(width, height);
		this.layers[4].push(sb);
		Helper.configUpdate("activeTheme");
		sb = null;
		// create the sounds playlist
		this.sounds[0] = new Array();
		this.sounds[1] = new Array();
		this.sounds[2] = new Array();
		this.sounds[3] = new Array();
		// create the script
		this.script = new Script();
		// setup default forms theme
		if (Config.activeTheme && Config.activeTheme.formFontStyle) {
			var subs = Helper.parseFontString(Config.activeTheme.formFontStyle);
			this.formStyle.splice(0, this.formStyle.length);
			if (subs.length >= 4) {
				this.formStyle.push(subs.slice(0,3).join(' '));
				this.formStyle.push(subs.slice(3).join(' '));
			}
			else
				this.formStyle.push(param);
		}
		// setup timer tick
		this.update = true;		// use this.update = false to wait when loading resources
		this.redraw = true;		// use this.redraw = false when redraw not necessary
		this.pause = false;		// use this.pause = true to wait with timer or user input
		this.Tick(1000/60);			// for 60fps
	},
	Update: function(elapsed) {
		// Note: set this.redraw to true if update needs a redraw
		this.inputFocus = (this.activeForm == null);
		for (var i in this.layers[4]) {
			if (this.layers[4][i].inputFocus) 
				this.inputFocus = false;
		}
		// handle user inputs
		this.camTime += elapsed;
		if (this.camTime > 40) {
			this.coord = this.GetCameraPosition(elapsed, this.inputFocus);
			this.camTime -= 40;		// about 25fps
		}
		if (this.mouseMove || this.CheckCamera()) {
			this.redraw = true;
		}
		if (this.mouseClick) {
			if (this.inputFocus)
				this.pause = false;	
			if (this.utimerOn) {
				this.utimerOn = false;
				clearTimeout(this.utimer);
				// TODO: cancel all  that uses this timer
				this.layers[4][0].timeout = 0;
			}
		}
		// update the script
		//if (this.update && !this.pause) {
		if (this.update) {
			if (!(this.pause &&	!Helper.skipReadText()))
				this.script.Update()
		}
		// play sounds if any
		for (var idx in this.sounds) {
			for (var entry in this.sounds[idx]) {
				this.sounds[idx][entry].Mute(Helper.findVar("_mute_audio"));
				if (this.sounds[idx][entry].isStopping)
					this.sounds[idx][entry].Stop(false);
				else
					this.sounds[idx][entry].Play(true);
			}
		}
		// play videos if any
		for (var idx in this.videos) {
			this.videos[idx].Mute(Helper.findVar("_mute_audio"));
			if ((this.videos[idx].isStopping) ||
				(this.mouseClick && Config.movieOnCanvas)){
				this.videos[idx].Stop();
				this.videos.pop();
			}
			else
				this.videos[idx].Play();
		}
		// update layers
		var running_update = true;
		for (var idx in this.layers) {
			for (var entry in this.layers[idx]) {
				if (!this.layers[idx][entry].Update(elapsed)) {
					running_update = false;
				}
			}
		}
		this.update = running_update;
		// update stage transition time
		if (/*(this.update) &&*/ (this.transTime > 0)) {
			this.transTime = Math.max(0, this.transTime - elapsed/1000);
			if (this.transTime <=0) {
				this.shake = 0;
				this.fall = 0;
			}
		}
		// reset clicked, assumed processing done
		this.mouseClick = false;
		this.mouseMove = false;
		this.touchStart = false;
		this.touchEnd = false;
	},	
	Draw: function() {
		// TODO: clear entire stage first; manage for improved FPS
		if (this.redraw && ((this.layers[0].length > 0) || 
							(this.layers[1].length > 0) ||
							(this.layers[2].length > 0) ||
							(this.layers[3].length > 0) ||
							(this.layers[4].length > 1)	))
			this.context.clearRect(0,0,this.canvas.width,this.canvas.height);

		var running_draw = false;
		// draw background here
		for (var i in this.layers[0]) {
			if (this.layers[0][i].Draw()) running_draw = true;
			if (this.redraw) {
				if (Helper.drawElements(this.layers[0][i], 0)) 
					running_draw = true;
			}
		}
		// draw foreground here
		if (this.layers[1].length > 0) {
			// get number of visible && auto-position actors
			var count = 0;
			for (var i in this.layers[1]) {
				if ((this.layers[1][i].visible) && (this.layers[1][i].posMode == 'auto')) count++;
			}						
			// display actors
			var j=0;
			for (var i in this.layers[1]) {
				if (this.layers[1][i].Draw()) running_draw = true;
				if (this.redraw) {
					if (this.layers[1][i].visible) {
						if (this.layers[1][i].posMode == 'auto') {
							this.layers[1][i].target_pos.vx = this.spritePos[count-1][j++];
							Helper.interpolatePosition(this.layers[1][i]);
						}
						if (Helper.drawElements(this.layers[1][i],10 + this.layers[1][i].z_order))
							running_draw = true;
					}
					else if (this.layers[1][i].pendingRemoval) {
						// free up sprites and avatar
						for (var j in this.layers[1][i].sprites)
							this.layers[1][i].sprites[j].src = null;
						this.layers[1][i].avatar = null;
						this.layers[1].splice(i, 1);
					}
				}
			}
		}		
		// draw overlay/closeup here
		for (var i in this.layers[2]) {
			if (this.layers[2][i].Draw()) running_draw = true;
			if (this.redraw && this.layers[2][i].visible) {
				if (this.layers[2][i].scroll) {
					this.context.save();
					this.context.translate((-this.layers[2][i].scale*(this.layers[2][i].context.canvas.width-this.layers[2][i].backdropDim.vx)/2 
											-(this.layers[2][i].scale*this.layers[2][i].backdropDim.vx-this.canvas.width)*(this.coord.vx/this.canvas.width))>>0,
										   (-this.layers[2][i].scale*(this.layers[2][i].context.canvas.height-this.layers[2][i].backdropDim.vy)/2
											-(this.layers[2][i].scale*this.layers[2][i].backdropDim.vy-this.canvas.height)*(this.coord.vy/this.canvas.height))>>0);
					this.context.scale(this.layers[2][i].scale, this.layers[2][i].scale);
					this.context.drawImage(this.layers[2][i].context.canvas, 0, 0,
											this.layers[2][i].context.canvas.width,
											this.layers[2][i].context.canvas.height);
					this.context.restore();
				}
				else {
					if (Helper.drawElements(this.layers[2][i], 20)) 
						running_draw = true;
				}
			}
		}
		// draw atmosphere effects here
		for (var i in this.layers[3]) {
			if (this.layers[3][i].Draw()) running_draw = true;
			if (this.redraw && this.layers[3][i].visible) {
				this.context.drawImage(this.layers[3][i].context.canvas, 0, 0);
			}
		}		
		// draw gui here
		if (this.layers[4].length > 0) {
			for (var i in this.layers[4]) {
				if (this.layers[4][i].Draw()) running_draw = true;
				if (this.redraw && this.layers[4][i].visible) {
					this.context.drawImage(this.layers[4][i].context.canvas, 
										   this.layers[4][i].origin.vx>>0, 
										   this.layers[4][i].origin.vy>>0);
				}
			}
			// draw tooltips if any
			for (var i in this.layers[4]) {
				if (this.redraw && this.layers[4][i].visible) {
					if (!Helper.checkMapAccess(this.layers[4][i].group, this.layers[4][i].id))
						continue;
					if ((this.layers[4][i].state == 'hover') && (this.layers[4][i].tooltip)){
						if (this.transTime <= 0)
							Helper.showTooltip(this.layers[4][i].tooltip);
					}
				}
			}
		}
		// draw videos here
		if (Config.movieOnCanvas) {
			for (var i in this.videos) {
				this.context.drawImage(this.videos[i].movie,
									   this.videos[i].pos.vx,
									   this.videos[i].pos.vy,
									   this.videos[i].movie.width, 
									   this.videos[i].movie.height);
			}
		}
		// update redraw variable
		this.redraw = running_draw;
	},
	HandleEvents: function(evt) {
		if (this.mouseOut) { Stage.canvas.blur(); return; }
		// give focus to canvas element
		Stage.canvas.setAttribute('tabindex','0');
		Stage.canvas.focus();
		// all mouse and touch moves
		if (!this.keyDown && !this.keyUp)
			this.targetPos = (this.touchStart) ? this.GetTouchPosition(this.canvas, evt) :
												 this.GetMousePosition(this.canvas, evt);
		// mouse click / touch end
		if (this.mouseUp || this.touchEnd || this.keyUp) {
			this.click.copy(this.coord);	// used only for debug
			this.mouseClick = true;
			this.mouseUp = false;
			this.touchEnd = false;
			this.touchStart = false;
			this.keyUp = false;
		}
		else if (this.mouseDown || this.touchStart) {
			// TODO: check for clickable objects, only for top/last scene
			if (Stage.layers[0].length>0) {
				for (var i=0; i<Stage.layers[0][Stage.layers[0].length-1].objects.length; i++) {
					if (Stage.layers[0][Stage.layers[0].length-1].objects[i].link != '') {
						// translate clicked position relative to backdrop absolute coordinates
						var position = new Vector2d(
							this.targetPos.vx + ((Stage.layers[0][Stage.layers[0].length-1].context.canvas.width - Stage.canvas.width)/2) - Stage.AddDepth(0, Stage.canvas.width/2 - Stage.coord.vx),
							this.targetPos.vy + ((Stage.layers[0][Stage.layers[0].length-1].context.canvas.height - Stage.canvas.height)/2) - Stage.AddDepth(0, Stage.canvas.height/2 - Stage.coord.vy)/2);
						if (Stage.layers[0][Stage.layers[0].length-1].objects[i].rect.isPointInRect(position.vx, position.vy)) {
							jump(Stage.layers[0][Stage.layers[0].length-1].objects[i].link);
						}
					}
				}
			}
			for (var i in Stage.layers[4]) {
				//if (Stage.layers[4][i].type == "button") {
				if ((Stage.layers[4][i].link != undefined) && (Stage.layers[4][i].link != null)) {
					if (Stage.layers[4][i].context.isPointInPath(this.targetPos.vx, this.targetPos.vy))
						Stage.layers[4][i].state = 'clicked';
					else
						Stage.layers[4][i].state = '';
				}
			}
		}
		else if (this.mouseMove) {
			for (var i in Stage.layers[4]) {
				//if (Stage.layers[4][i].type == "button") {
				if ((Stage.layers[4][i].link != undefined) && (Stage.layers[4][i].link != null)) {
					if (Stage.layers[4][i].context.isPointInPath(this.targetPos.vx, this.targetPos.vy))
						Stage.layers[4][i].state = 'hover';
					else
						Stage.layers[4][i].state = '';
				}
			}
		}
		else if (this.keyChar != 0) {
			//alert('keycode: '+evt.keyCode);
			if (Stage.layers[4][0].jumpTo.length > 0) {	// we're on a menu choice
				if (this.keyChar == 38) 
					Stage.layers[4][0].menuHover = Math.max(0, Stage.layers[4][0].menuHover-1);
				if (this.keyChar == 40)
					Stage.layers[4][0].menuHover = Math.min(Stage.layers[4][0].jumpTo.length-1, Stage.layers[4][0].menuHover+1);
				Stage.layers[4][0].redraw = true;
			}
			this.keyChar = 0;
		}
	},
	AddDepth: function(order, dist) {
		if (!Config.actorPerspective) return 0;
		if (order >= 2) return 0;
		// process only background and foreground layers
		return ((order+1) * 0.1 * dist);
	},
	GetMousePosition: function(obj, event) {
		var pos = new Vector2d(event.pageX, event.pageY);
		pos.vx -= obj.offsetLeft + obj.offsetParent.offsetLeft;
		pos.vy -= obj.offsetTop + obj.offsetParent.offsetTop;
		// scale accdg to automatic responsive resizing
		var scale = obj.width/obj.clientWidth;
		pos.vx = Math.max(0, Math.min(obj.width, pos.vx*scale));
		pos.vy = Math.max(0, Math.min(obj.height, pos.vy*scale));
		try { return pos; }
		finally { pos = null; }
	},
	GetTouchPosition: function(obj, event) {
		var pos = new Vector2d(0,0);
		if (event.targetTouches != null) {
			pos.vx = event.targetTouches[0].pageX - obj.offsetLeft - obj.offsetParent.offsetLeft;
			pos.vy = event.targetTouches[0].pageY - obj.offsetTop - obj.offsetParent.offsetTop;
		}
		else {
			pos.vx = event.touches[0].pageX - obj.offsetLeft - obj.offsetParent.offsetLeft;
			pos.vy = event.touches[0].pageY - obj.offsetTop - obj.offsetParent.offsetTop;
		}
		var scale = obj.width/obj.clientWidth;
		pos.vx = Math.max(0, Math.min(obj.width, pos.vx*scale));
		pos.vy = Math.max(0, Math.min(obj.height, pos.vy*scale));
		try { return pos; }
		finally { pos = null; }
	},
	GetCameraPosition: function(elapsed, spring) {
		if (spring) {
			var camPos = new Vector2d(this.coord.vx, this.coord.vy);
			camPos.sub(this.targetPos);
			if (camPos.length() < 0.1) {
				this.prevPos.copy(this.targetPos);
				return this.targetPos;
			}
			camPos.copy(this.targetPos);
			camPos.add(this.coord);
			camPos.scale(0.5);
			this.prevPos.copy(this.coord);		
			try { return camPos; }
			finally { camPos = null; }
		}	
		else {
			this.prevPos.copy(this.targetPos);
			return this.targetPos;	
		}
	},
	CheckCamera: function() {
		var vec = new Vector2d(this.coord.vx, this.coord.vy);
		vec.sub(this.targetPos);
		if (vec.length() > 0.1) return true;
		return false;
	},
	Transition: function(time) {
		this.transTime = Math.max((time != null) ? time : Config.transTime, 0.1);
	},
	Tick: function(interval) {	
		var now = new Date().getTime();
		var elapsed = now - this.curtime;	// time since last update
		this.curtime = now;
		this.framecount++;
		if (this.curtime - this.prevtime >= 1000) {
			this.prevtime = this.curtime;
			this.fps = this.framecount;
			this.framecount = 0;
		}
		now = null;
		
		if (window.jQuery) {
			// DEBUG:
			//$('#debug').html(Stage.coord.vx +', '+ Stage.coord.vy +' : '+Stage.targetPos.vx +', '+ Stage.targetPos.vy);
			//$('#debug').html(Stage.targetPos.vx +','+ Stage.targetPos.vy +' : '+Stage.click.vx +','+ Stage.click.vy+' : '+
			//Stage.AddDepth(0, Stage.canvas.width/2 - Stage.coord.vx)+','+Stage.AddDepth(0, Stage.canvas.height/2 - Stage.coord.vy)/2);
			//$('#debug').html(eval(Stage.coord.vx - Stage.targetPos.vx) +', '+ eval(Stage.coord.vy-Stage.targetPos.vy));
			//$('#debug').html(Stage.click.vx +', '+ Stage.click.vy);
			//$('#debug').html(this.script.frame/2 + ' ' + this.update);
			//if (Helper.findVar("_nav_loc") != null)
			//	$('#debug').html(this.variables["_nav_loc"].Value()+' '+this.variables["_nav_dir"].Value());
			//$('#debug').html('FPS: '+ this.fps + ' Frame: ' + this.script.frame/2 + ' Idle: ' + this.stageIdle + ' Autotype: ' + Stage.layers[4][0].autotypeCount);
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
				for (var i=this.script.frame; i<this.script.sequence.length; i+=2) {
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
			if (this.skipTextUpdated && Helper.supportsLocalStorage() && 
			   ((Stage.script.sequence[0] == label) && (localStorage["_persist_skip_"+Stage.script.sequence[1]] != null))) {
				var skip_array = JSON.parse(localStorage["_persist_skip_"+Stage.script.sequence[1]]);
				var opt_array = [];
				for (var i=0; i<skip_array.length; i+=2) {
					if (opt_array.length == 0) {
						opt_array.push(skip_array[i]);
						opt_array.push(skip_array[i+1]);
					}
					else {
						var found = false;
						for (var j=0; j<opt_array.length; j+=2) {
							if ((skip_array[i] >= opt_array[j]) && (skip_array[i] <= opt_array[j+1]+2)) {
								if ((skip_array[i+1] > opt_array[j+1]))
									opt_array[j+1] = skip_array[i+1];
								found = true;
								break;
							}
						}
						if (!found) {
							opt_array.push(skip_array[i]);
							opt_array.push(skip_array[i+1]);
						}
					}
				}
				opt_array.sort(function(a,b){return a-b});
				localStorage["_persist_skip_"+Stage.script.sequence[1]] = JSON.stringify(opt_array);
				this.skipTextUpdated = false;
				opt_array = null; skip_array = null;
			}
		}
		// setup next timer tick
		requestAnimFrame(function(){
			Stage.Tick(interval);
		});
	}
}

// ensure config and stats is not null
var Config = {};
var Stats = {};

