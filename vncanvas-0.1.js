///////////////////////////////////////////////////////////////////////////////
//  Visual Novel JAVASCRIPT for HTML5 CANVAS by [lo'ner]                     //
//  Author: oclabbao@yahoo.com, oclabbao@gmail.com                           //
//  Based on:                                                                //
//      Construct2 - HTML5 game creator (www.scirra.com)                     //
//      js-vine.js by J. David Eisenberg                                     //
//      enchant.js by Ubiquitous Entertainment Inc.                          //
//      Ren'Py Python VN engine (www.renpy.org)                              //
//  Requires:                                                                //
//      CanvasText by Pere Monfort Pàmies (www.pmphp.net, www.canvastext.com)//
//          - modded to support \n and hover in text                         //
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
	Copyright © 2011 by OCLabbao a.k.a [lo'ner]
	
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

// Generic/helper methods
var Helper = {
	// Function for adding an event listener
	addEvent: function (obj, evType, fn, useCapture) {
		if (obj.addEventListener) {
			obj.addEventListener(evType, fn, useCapture);
			return true;
		} else if (obj.attachEvent) {
			var r = obj.attachEvent("on" + evType, fn);
			return r;
		} else {
			alert("Handler could not be attached.");
		}
	},
	// Function for including external javascript files
	includeJs: function (jsFilePath) {
	    var js = document.createElement("script");
	    js.type = "text/javascript";
	    js.src = jsFilePath;
	    //document.getElementsByTagName('head')[0].appendChild(js);
		document.body.appendChild(js);
	},
	// Function to check support for localStorage
	supportsLocalStorage: function () {
	  try {
	    return 'localStorage' in window && window['localStorage'] !== null;
	  } catch(e){
	    return false;
	  }
	},
	// Helper function to search for user variable
	findVar: function (id) {
		for (var i in Stage.variables) {
			if (Stage.variables[i].Name() == id) {
				return i;
			}
		}
		return -1;
	},
	// Helper function to obtain value from stage or config variables
	getValue: function (id) {
		var idx = Helper.findVar(id);
		if (idx != -1)
			return Stage.variables[idx].Value();
		return eval("Config."+id);
	},
	// Helper function to set value to stage or config variables
	setValue: function (id, value) {
		var idx = Helper.findVar(id);
		if (idx != -1)
			Stage.variables[idx].value = value;
		
		if (typeof value == 'string') {
			eval("Config."+id +"=\""+value+"\"");
		}
		else
			eval("Config."+id +"="+value);
	},
	// Helper function to parse font string
	parseFontString: function (s) {
		var splitText = s.split(' ');
		// combine as needed
		var subs = new Array();
		var combine = false;
		var tempText = '';
		for (var i in splitText) {
			if (splitText[i].search("\'")!=-1) {
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
	for (var idx in Stage.videos) {
		var x = Stage.canvas.offsetLeft + (1-Config.movieSize)/2 * Stage.canvas.width;// - window.pageXOffset;
		var y = Stage.canvas.offsetTop + (1-Config.movieSize)/2 * Stage.canvas.height;// - window.pageYOffset;
		Stage.videos[idx].movie.setAttribute('style', 'position:absolute; left:'+x+'px; top:'+y+'px');
	}
	for (var i=0; i<document.forms.length; i++) {
		var x = Stage.canvas.offsetLeft;//- window.pageXOffset;
		var y = Stage.canvas.offsetTop; //- window.pageYOffset;
		document.forms[i].setAttribute('style', 'position:absolute; left:'+x+'px; top:'+y+'px;');
	}
});

// Script method callback/handlers
// label - marks a position in the script
function label(param) { /*alert(param);*/ }
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
// set - sets a user variable
function set(param) {
	var str_param = JSON.stringify(param);
	var arr_param = str_param.replace(/[{|}]/g,'').split(/[' '|:|,]/g);
	//alert(arr_param);
	for (var i=0; i<arr_param.length; i+=2) {
		arr_param[i] = eval(arr_param[i]);
		arr_param[i+1] = eval(arr_param[i+1]);
		var idx = Helper.findVar(arr_param[i]);
		if (idx != -1) {
			if (typeof arr_param[i+1] == 'string') {
				// if value is a reference to other variables
				var j = Helper.findVar(arr_param[i+1]);
				if (j != -1) {
					Stage.variables[idx].Set(arr_param[i], Stage.variables[j].Value());
				}
				else {
					// is it an expression with supported operator
					if (arr_param[i+1].search(/[+|-|*|%|\/]/g) != -1) {
						Stage.variables[idx].Set(arr_param[i], eval(Stage.variables[idx].Value() + arr_param[i+1]));
					}
					// or a simple string to set
					else {
						Stage.variables[idx].Set(arr_param[i], arr_param[i+1]);
					}
				}
			}
			else {
				Stage.variables[idx].Set(arr_param[i], arr_param[i+1]);
			}
		}
		else {
			var uv = new UserVars();
			if (typeof arr_param[i+1] == 'string') {
				// if value is a reference to other variables
				var j = Helper.findVar(arr_param[i+1]);
				if (j != -1) {
					uv.Set(arr_param[i], Stage.variables[j].Value());
				}
				else {
					// this is a new variable, don't expect operator elements
					uv.Set(arr_param[i], arr_param[i+1]);
				}
			}
			else {
				uv.Set(arr_param[i], arr_param[i+1]);
			}
			Stage.variables.push(uv);
		}
	}
}
// get - gets value of a user variable
function get(param) {
	var idx = Helper.findVar(param.name);
	if (idx != -1) {
		return Stage.variables[idx].Value();
	}
	return null;
}
// jump - continues execution at given label
function jump(param) {
	if (typeof param == 'string') {
		Stage.script.SetFrame(param);
	}
	else {
		var str_param = JSON.stringify(param);
		var arr_param = str_param.replace(/[{|}]/g,'').split(/[' '|:|,]/g);
		//alert(arr_param); // expects only 4 items
		for (var i=0; i<arr_param.length; i+=2) {
			arr_param[i] = eval(arr_param[i]);
			arr_param[i+1] = eval(arr_param[i+1]);
			if (arr_param[i] == 'label') continue;
			
			var idx = Helper.findVar(arr_param[i]);
			if (idx != -1) {
				if (Stage.variables[idx].type == 'number') {
					if (Stage.variables[idx].Value() >= arr_param[i+1])
						Stage.script.SetFrame(param.label);
				}
				else if (Stage.variables[idx].type == 'string') {
					if (Stage.variables[idx].Value() === arr_param[i+1])
						Stage.script.SetFrame(param.label);
				}
				else {
					if (Stage.variables[idx].Value() == arr_param[i+1])
						Stage.script.SetFrame(param.label);
				}
			}
		}
	}
}
// scene - displays a background (layer 0)
function scene(param) {
	var nextid = 0;
	if (Stage.layers[0].length > 0) {
		// background layer has more than one element
		// to conserve memory, maintain only the previous and the incoming backdrop
		while (Stage.layers[0].length > 1) {
			Stage.layers[0].shift();
			// TODO: does removing it from array enough to free memory?
		}
		// do a reverse effect on the previous backdrop
		// current effect is 'done'
		if (param.effect)
			Stage.layers[0][0].effects = param.effect + 'out';
		else 
			Stage.layers[0][0].effects = 'out';
		Stage.layers[0][0].drawn = false;
		Stage.layers[0][0].update = false;
		nextid = parseInt(Stage.layers[0][0].canvas.id.substr(2))+1;
	}
	// add the new background layer
	var bg = new Backdrop();
	var obj = new Array();
	if (param.objects) {
		// assumes multiples of 3
		for (var i=0; i<param.objects.length; i+=3) {
			var item = {src:'', x:0, y:0	};
			item.src = param.objects[i];
			item.x = param.objects[i+1];
			item.y = param.objects[i+2];
			obj.push(item);
		}
	}
	bg.Create('bg' + nextid, param.image, obj);
	if (param.effect) {
		bg.effects = param.effect + 'in';
		if ((param.effect == 'fade') && (Stage.layers[0].length > 0))
			bg.alpha = -1;
	}
	else 
		bg.effects = 'in';
	if (param.time != null) bg.transTime = (param.time>0) ? param.time : 0.01;
	Stage.layers[0].push(bg);
}
// actor - create and display character (layer 1)
function actor(param) {
	var idx = -1;
	if (Stage.layers[1].length > 0) {
		// look for same id
		for (var i=0; i<Stage.layers[1].length; i++) {
			if (Stage.layers[1][i].id == param.id) {
				idx = i;
				break;
			}
		}
		if (idx != -1) {
			// update an existing actor
			if (param.sprite) {
				if (typeof param.sprite == 'string') {
					for (var i in Stage.layers[1][idx].sprites) {
						if (Stage.layers[1][idx].sprites[i].id == param.sprite) {
							if (Stage.layers[1][idx].visible) {
								Stage.layers[1][idx].prevSprite = Stage.layers[1][idx].activeSprite;
								Stage.layers[1][idx].alpha = 0;
							}
							Stage.layers[1][idx].activeSprite = i;
							break;
						}
					}
				}
				else {
					// assumes array of length 2 to be added to list of sprites
					if (Stage.layers[1][idx].visible) {
						Stage.layers[1][idx].prevSprite = Stage.layers[1][idx].activeSprite;
						Stage.layers[1][idx].alpha = 0;
					}
					Stage.layers[1][idx].AddSprite(param.sprite[0], param.sprite[1]);
				}
			}
			if (param.avatar) {
				Stage.layers[1][idx].AddAvatar(param.avatar);
			}
			if (param.effect)
				Stage.layers[1][idx].effects = param.effect;
			else
				Stage.layers[1][idx].effects = Stage.layers[1][idx].prevFx;
			//if ((param.remove == true) || (param.show == false))
			if ((param.show == false) ||
				(param.remove == 'actor') || 
				(Stage.layers[1][idx].sprites[Stage.layers[1][idx].activeSprite].id == param.remove) )
				Stage.layers[1][idx].effects += 'out';
			else
				Stage.layers[1][idx].effects += 'in';
			if (param.remove) {
				if (param.remove == 'actor')
					Stage.layers[1][idx].pendingRemoval = true;
				else
					Stage.layers[1][idx].RemoveSprite(param.remove);
			}
				
			if (param.say) {
				var same_window = false;
				// get name of speaker
				var current_speaker = '';
				var startIdx = Stage.layers[4][0].text.indexOf(Stage.layers[4][0].tagFamily+";\'>");
				var endIdx = Stage.layers[4][0].text.indexOf("</style><br/>");
				if ((startIdx != -1) && (endIdx != -1)) {
					current_speaker = Stage.layers[4][0].text.substr(startIdx+Stage.layers[4][0].tagFamily.length+3, 
																     endIdx-startIdx-Stage.layers[4][0].tagFamily.length-3);
				}
				
				if ((current_speaker != Stage.layers[1][idx].nick) || (param.append == false)) {
					Stage.layers[4][0].cont = false;
					same_window = false;
				}
				else if (param.append == true) {
					Stage.layers[4][0].cont = true;
					same_window = true;
				}
				else {	// whatever value including undefined
					same_window = Stage.layers[4][0].cont;
				}
				if (same_window) {
					var dialog = '';
					dialog = "<style=\'font-weight:" + Stage.layers[4][0].tagWeight +
								";color:" + Stage.layers[1][idx].color + 
								";font-size:" + Stage.layers[4][0].tagSize +
								";font-family:" + Stage.layers[4][0].tagFamily +
								";\'>" + Stage.layers[1][idx].nick + "</style><br/>";
					// strip speaker name here if present
					var index = Stage.layers[4][0].text.indexOf("</style><br/>");
					if (index!=-1)
						dialog += Stage.layers[4][0].text.slice(index+13);
					else 
						dialog += Stage.layers[4][0].text;
					dialog += '\n' + param.say;
					Stage.layers[4][0].text = dialog;
				}
				else {
					var dialog = '';
					dialog = "<style=\'font-weight:" + Stage.layers[4][0].tagWeight +
								";color:" + Stage.layers[1][idx].color + 
								";font-size:" + Stage.layers[4][0].tagSize +
								";font-family:" + Stage.layers[4][0].tagFamily +
								";\'>" + Stage.layers[1][idx].nick + "</style><br/>";
					dialog += param.say;
					Stage.layers[4][0].text = dialog;
				}
				if (Stage.layers[1][idx].avatar != null)
					Stage.layers[4][0].avatar = Stage.layers[1][idx].avatar;
				else
					Stage.layers[4][0].avatar = null;
				Stage.layers[4][0].visible = true;
				Stage.layers[4][0].changed = true;
			}
			
			// done updating, do not trickle down
			Stage.layers[1][idx].drawn = false;
			Stage.layers[1][idx].update = false;
			if ((Stage.layers[1][idx].visible && (Stage.layers[1][idx].effects.indexOf('out')!=-1)) ||
				(!Stage.layers[1][idx].visible && (Stage.layers[1][idx].effects.indexOf('in')!=-1)))
				Stage.Transition('show_actor');
			return;
		}
	}
	// this is a new actor
	var chr = new Character();
	chr.Create(param.id);
	if (param.nick) 
		chr.nick = param.nick;
	else
		chr.nick = param.id;
	if (param.color)
		chr.color = param.color;
	else
		chr.color = Stage.layers[4][0].tagColor;
	if (param.type)
		chr.type = param.type;
	if (param.sprite) {
		// assumes length == 2
		chr.AddSprite(param.sprite[0], param.sprite[1]);
	}
	if (param.avatar) {
		chr.AddAvatar(param.avatar);
	}
	if (param.effect) {
		chr.effects = param.effect;
		chr.prevFx = param.effect;
		if (param.show == false)
			chr.effects += 'out';
		else
			chr.effects += 'in';
	}
	else {
		if (param.show == false)
			chr.effects = 'out';
		else
			chr.effects = 'in';
	}
	if (param.time != null) chr.transTime = (param.time>0) ? param.time : 0.01;
	if (param.say) {
		// new actor will have new dialog window, continue is ignored
		Stage.layers[4][0].cont = false;
		var dialog = '';
		dialog = "<style=\'font-weight:" + Stage.layers[4][0].tagWeight +
					";color:" + chr.color + 
					";font-size:" + Stage.layers[4][0].tagSize +
					";font-family:" + Stage.layers[4][0].tagFamily +
					";\'>" + chr.nick + "</style><br/>";
		dialog += param.say;
		Stage.layers[4][0].text = dialog;
		if (chr.avatar != null)
			Stage.layers[4][0].avatar = chr.avatar;
		else
			Stage.layers[4][0].avatar = null;
		Stage.layers[4][0].visible = true;
		Stage.layers[4][0].changed = true;
	}
	Stage.layers[1].push(chr);	
	Stage.Transition('show_actor');
}
// overlay - displays an overlay image (layer 2)
function overlay(param) {
	var nextid = 0;
	if (Stage.layers[2].length > 0) {
		// overlay layer has more than one element
		// to conserve memory, maintain only the previous and the incoming overlay
		while (Stage.layers[2].length > 1) {
			Stage.layers[2].shift();
		}
		// do a reverse effect on the previous overlay
		if (param.effect)
			Stage.layers[2][0].effects = param.effect + 'out';
		else 
			Stage.layers[2][0].effects = 'out';
		Stage.layers[2][0].drawn = false;
		Stage.layers[2][0].update = false;
		nextid = parseInt(Stage.layers[2][0].canvas.id.substr(3))+1;
		
		if ((!param.image) && (param.show == false)) {
			// just hiding the previous overlay
			return;
		}
	}
	// add the new overlay layer
	var ovl = new Backdrop();
	ovl.Create('ovl' + nextid, param.image, null);
	if (param.effect)
		ovl.effects = param.effect + 'in';
	else 
		ovl.effects = 'in';
	if (param.time != null) ovl.transTime = (param.time>0) ? param.time : 0.01;
	if (param.offset) {
		if (typeof (param.offset) == "string") {
			if (param.offset == "scroll")
				ovl.scroll = true;
			else
				ovl.scroll = false;
		}
		else {
			ovl.scroll = false;
			ovl.offset = param.offset;
		}
	}
	else {
		ovl.scroll = false;
		ovl.offset = [0, 0];
	}
	Stage.layers[2].push(ovl);
}
// atmosphere - create atmosphere effects (layer 3)
function atmosphere(param) {
	var idx = -1;
	var nextid = 0;
	if (Stage.layers[3].length > 0) {
		// look for existing fx
		for (var i=0; i<Stage.layers[3].length; i++ ) {
			if (Stage.layers[3][i].type == param.type) {
				idx = i;
				break;
			}
		}
		if (idx != -1) {
			if (param.action)
				Stage.layers[3][idx].action = param.action;
			else
				Stage.layers[3][idx].action = 'start';
			if (Stage.layers[3][idx].action == 'start') {
				if (param.count != null)
					Stage.layers[3][idx].Init(param.type, param.count);
				else
					Stage.layers[3][idx].Init(param.type, 0);
			}
			return;
		}
		nextid = parseInt(Stage.layers[3][Stage.layers[3].length-1].canvas.id.substr(3))+1;
	}
	// this is new fx type
	var atm = new Atmosphere();
	atm.Create('atm' + nextid);
	if (param.count != null)
		atm.Init(param.type, param.count);
	else
		atm.Init(param.type, 0);
	if (param.action) atm.action = param.action;
	Stage.layers[3].push(atm);
}
// box - configures script box (layer 4)
function box(param) {
	if (param.show == true)
		Stage.layers[4][0].visible = true;
	else {
		Stage.layers[4][0].visible = false;
		Stage.layers[4][0].text = '';
	}

	if (param.pos) Stage.layers[4][0].pos = param.pos;
	if (param.back) {
		if ((param.back == "none") || (param.back == "dim"))
			Stage.layers[4][0].back = param.back;
		else {
			Stage.layers[4][0].back = 'image';
			Stage.layers[4][0].src = param.back;
		}
	}
	if (param.prompt) {
		if (param.prompt == "none") {
			Stage.layers[4][0].psrc = '';
		}
		else {
			Stage.layers[4][0].isready = false;
			Stage.layers[4][0].psrc = param.prompt;
			Stage.layers[4][0].prompt.src = param.prompt;
		}
	}

	// assumes this function won't be called unless there are some changes somewhere
	Stage.layers[4][0].changed = true;
}
// text - display text in script box (layer 4)
function text(param) {
	if (typeof param == "string") {
		if (Stage.layers[4][0].cont) {
			Stage.layers[4][0].text += '\n' + param;
		}
		else {
			Stage.layers[4][0].text = param;
		}	
		//alert(Stage.layers[4][0].text);
	}
	else {
		if (param.font) { 
			var subs = Helper.parseFontString(param.font);
			
			if (subs.length > 0) Stage.layers[4][0].fontWeight = subs[0];
			if (subs.length > 1) {
				Stage.layers[4][0].fontSize = subs[1];
				Stage.layers[4][0].lineHeight = eval(subs[1].substring(0,subs[1].length-2)) + 4;
			}			
			if (subs.length > 2) Stage.layers[4][0].fontFamily = subs[2];
			if (subs.length > 3) Stage.layers[4][0].fontColor = subs[3];
		}
			
		var same_window = false;
		// get name of speaker
		var current_speaker = '';
		var new_speaker = '';
		var startIdx = Stage.layers[4][0].text.indexOf(Stage.layers[4][0].tagFamily+";\'>");
		var endIdx = Stage.layers[4][0].text.indexOf("</style><br/>");
		if ((startIdx != -1) && (endIdx != -1))
			current_speaker = Stage.layers[4][0].text.substr(startIdx+Stage.layers[4][0].tagFamily.length+3, 
															 endIdx-startIdx-Stage.layers[4][0].tagFamily.length-3);
		if (param.speaker) new_speaker = param.speaker;
		
		if ((current_speaker != new_speaker) || (param.append == false)) {
			Stage.layers[4][0].cont = false;
			same_window = false;
		}
		else if (param.append == true) {	
			Stage.layers[4][0].cont = true;
			same_window = true;
		}
		else {	// whatever value including undefined
			same_window = Stage.layers[4][0].cont;
		}
		if (same_window) {
			var dialog = '';
			if (param.speaker) {
				var nick = param.speaker;
				var color = Stage.layers[4][0].tagColor;
				for (var i in Stage.layers[1]) {
					if (Stage.layers[1][i].id == param.speaker) {
						nick = Stage.layers[1][i].nick;
						color = Stage.layers[1][i].color;
						break;
					}
				}
				dialog = "<style=\'font-weight:" + Stage.layers[4][0].tagWeight +
							";color:" + color + 
							";font-size:" + Stage.layers[4][0].tagSize +
							";font-family:" + Stage.layers[4][0].tagFamily +
							";\'>" + nick + "</style><br/>";
			}
			// strip speaker name here if present
			var idx = Stage.layers[4][0].text.indexOf("</style><br/>");
			if (idx!=-1)
				dialog += Stage.layers[4][0].text.slice(idx+13);
			else 
				dialog += Stage.layers[4][0].text;
			if (param.value)
				dialog += '\n' + param.value;
			Stage.layers[4][0].text = dialog;
			//if (param.value) Stage.layers[4][0].text += '\n' + param.value;
		}
		else {
			var dialog = '';
			if (param.speaker) {
				var nick = param.speaker;
				var color = Stage.layers[4][0].tagColor;
				for (var i in Stage.layers[1]) {
					if (Stage.layers[1][i].id == param.speaker) {
						nick = Stage.layers[1][i].nick;
						color = Stage.layers[1][i].color;
						break;
					}
				}
				dialog = "<style=\'font-weight:" + Stage.layers[4][0].tagWeight +
							";color:" + color + 
							";font-size:" + Stage.layers[4][0].tagSize +
							";font-family:" + Stage.layers[4][0].tagFamily +
							";\'>" + nick + "</style><br/>";
			}
			if (param.value)
				dialog += param.value;
			Stage.layers[4][0].text = dialog;
		}
		
		if (param.duration > 0) Stage.layers[4][0].timeout = param.duration;
		if (param.offset) {
			Stage.layers[4][0].textOffset.x = param.offset[0];
			Stage.layers[4][0].textOffset.y = param.offset[1];
		}
	}
	Stage.layers[4][0].avatar = null;
	Stage.layers[4][0].visible = true;
	Stage.layers[4][0].changed = true;
}
// menu - display choices in script box (layer 4)
function menu(param) {
	// param is an array of choice-jump pair
	if (Stage.layers[4][0].cont != true)
		Stage.layers[4][0].text = '';
	Stage.layers[4][0].text += param[0];	// prompt
	Stage.layers[4][0].jumpTo.splice(0,Stage.layers[4][0].jumpTo.length);
	for (var i=1; i< param.length; i+=2) {
		Stage.layers[4][0].text += "<br/><class=\'menu\'>" + param[i] + "</class>";
		var menuItem = {hotspot:[], link:param[i+1]};
		Stage.layers[4][0].jumpTo.push(menuItem);
		//Stage.layers[4][0].jumpTo.push(param[i+1])
	}
	Stage.layers[4][0].avatar = null;
	Stage.layers[4][0].visible = true;
	Stage.layers[4][0].changed = true;
	Stage.layers[4][0].inputFocus = true;
}
// button - create a canvas button (layer 4), independent of cform
function button(param) {
	// check existing button w/ same id
	/*
	for (var i in Stage.layers[4]) {
		if ((Stage.layers[4][i].type == "button") && 
			(Stage.layers[4][i].text == param.name)) {
			Stage.layers[4][i].inputFocus = true;
			return;
		}
	}
	*/
	// or new button
	var bt = new ActiveImage();
	var rect = {x:param.x, y:param.y, w:0, h:0};
	var obj = new Array();
	if (param.base) obj.push(param.base);
	if (param.hover) 
		obj.push(param.hover);
	else
		obj.push(param.base);
	if (param.click) 
		obj.push(param.click);
	else
		obj.push(param.base);
	bt.Create(param.name, rect, obj);
	if (param.link) bt.link = param.link;
	if (param.showText == false)
		bt.showText = false;
	Stage.layers[4].push(bt);
	//Stage.pause = true;
}
// form - container for canvas form elements such as buttons (layer 4)
function cform(param) {
	if (typeof param == "string") {	// TODO: check array count
		switch (param) {
			case 'close':
				var formid = Stage.formStack.pop();
				var idx = -1;
				var count = 0;
				for (var i in Stage.layers[4]) {
					if (Stage.layers[4][i].group == formid) {
						if (idx == -1) idx = i;
						count++;
					}
				}
				Stage.layers[4].splice(idx, count);
				break;
			case 'hide':
				var formid = Stage.formStack[Stage.formStack.length-1];
				for (var i in Stage.layers[4]) {
					if (Stage.layers[4][i].group == formid) {
						Stage.layers[4][i].visible = false;
						Stage.layers[4][i].inputFocus = false;
						Stage.layers[4][i].redraw = true;
					}
				}
				break;
			case 'show':
				var formid = Stage.formStack[Stage.formStack.length-1];
				for (var i in Stage.layers[4]) {
					if (Stage.layers[4][i].group == formid) {
						Stage.layers[4][i].visible = true;
						Stage.layers[4][i].inputFocus = true;
						Stage.layers[4][i].redraw = true;
					}
				}
				Stage.pause = true;
				break;
			case 'default':
				// revert back to default style
				Stage.formStyle.splice(0, Stage.formStyle.length);
				var subs = Helper.parseFontString(Config.formStyle);
				if (subs.length >= 4) {
					Stage.formStyle.push(subs.slice(0,3).join(' '));
					Stage.formStyle.push(subs.slice(3).join(' '));
				}
				else
					Stage.formStyle.push(param);
				break;
			default:
				for (var i in Stage.formStack) {
					if (Stage.formStack[i] == param) {
						// put on top of stack
						Stage.formStack.splice(i,1);
						Stage.formStack.push(param)
						// then show it
						for (var i in Stage.layers[4]) {
							if (Stage.layers[4][i].group == param) {
								Stage.layers[4][i].visible = true;
								Stage.layers[4][i].inputFocus = true;
								Stage.layers[4][i].redraw = true;
							}
						}
						return;
					}
				}
				// else, assume this is a formStyle
				Stage.formStyle.splice(0, Stage.formStyle.length);
				var subs = Helper.parseFontString(param);
				if (subs.length >= 4) {
					Stage.formStyle.push(subs.slice(0,3).join(' '));
					Stage.formStyle.push(subs.slice(3).join(' '));
				}
				else
					Stage.formStyle.push(param);
				break;
		}
	}
	else {
		for (var i in Stage.formStack) {
			if (Stage.formStack[i] == param[0]) {
				// reenable form
				for (var j in Stage.layers[4]) {
					if (Stage.layers[4][j].group == param[0]) {
						Stage.layers[4][j].visible = true;
						Stage.layers[4][j].inputFocus = true;
						Stage.layers[4][j].redraw = true;
					}
				}
				Stage.pause = true;
				return;
			}
		}
		// this is a new form
		Stage.formStack.push(param[0]);
		for (var i=1; i<param.length; i+=2) {
			param[i].call(this, param[i+1]);
			Stage.layers[4][Stage.layers[4].length-1].group = param[0];
		}
		Stage.pause = true;
	}
}
// audio - plays a sound
function audio(param) {
	/*
		To conserve memory:
		BGM - only one stored at a time; on new bgm, previous is removed
		BGS - can have multiple bgs playing; use "remove" to clear
		SE - can have multiple se; use "remove" to clear
	*/
	if (!document.createElement('audio').canPlayType) return;
	
	var mimeType = {"wav": "audio/wav",
					"ogg": 'audio/ogg;codecs="vorbis"',
					"mp3": "audio/mpeg"};

	if (param.bgm) {
		if ((Stage.sounds[0].length==0) || (Stage.sounds[0][0].src.search(param.bgm)==-1)) {
			var s = new Sounds();
			if (param.format) {
				s.src = null;
				for (var i in param.format) {
					if (s.audio.canPlayType(mimeType[param.format[i]]) != '') {
						s.src = param.bgm + '.' + param.format[i];
						break;
					}
				}
			}
			while (Stage.sounds[0].length > 0) {
				var old = Stage.sounds[0].shift();
				old.Stop(true);
			}
			s.delay = (param.delay > 0) ? param.delay : 0;
			Stage.sounds[0].push(s);
		}
		else {
			switch (param.action) {
				case "stop":
					Stage.sounds[0][0].Stop(false);
					break;
				case "pause":
					Stage.sounds[0][0].Pause();
					break;
				case "rewind":
					Stage.sounds[0][0].Rewind();
					break;
				case "play":
				default:
					Stage.sounds[0][0].Play(false);
					break;
			}
		}
	}
	if (param.bgs) {
		var index = -1;
		if (Stage.sounds[1].length > 0) {
			for (var i in Stage.sounds[1]) {
				if (Stage.sounds[1][i].src.search(param.bgs) != -1) {
					index = i;
					break;
				}
			}
		}
		if (index != -1) {
			switch (param.action) {
				case "stop":
					Stage.sounds[1][index].Stop(false);
					break;
				case "pause":
					Stage.sounds[1][index].Pause();
					break;
				case "rewind":
					Stage.sounds[1][index].Rewind();
					break;
				case "remove":
					Stage.sounds[1][index].Stop(true);
					Stage.sounds[1].splice(index, 1);
					break;
				case "play":
				default:
					Stage.sounds[1][index].Play(false);
					break;
			}
		}
		else {
			var s = new Sounds();
			if (param.format) {
				s.src = null;
				for (var i in param.format) {
					if (s.audio.canPlayType(mimeType[param.format[i]]) != '') {
						s.src = param.bgs + '.' + param.format[i];
						break;
					}
				}
			}
			s.repeat = -1;
			s.delay = (param.delay > 0) ? param.delay : 0;
			Stage.sounds[1].push(s);
		}
	}
	if (param.se) {
		var index = -1;
		if (Stage.sounds[2].length > 0) {
			for (var i in Stage.sounds[2]) {
				if (Stage.sounds[2][i].src.search(param.se) != -1) {
					index = i;
					break;
				}
			}
		}
		if (index != -1) {
			switch (param.action) {
				case "stop":
					Stage.sounds[2][index].Stop(false);
					break;
				case "pause":
					Stage.sounds[2][index].Pause();
					break;
				case "rewind":
					Stage.sounds[2][index].Rewind();
					break;
				case "remove":
					Stage.sounds[2][index].Stop(true);
					Stage.sounds[2].splice(index, 1);
					break;
				case "play":
				default:
					Stage.sounds[2][index].Play(false);
					break;
			}
		}
		else {
			var s = new Sounds();
			if (param.format) {
				s.src = null;
				for (var i in param.format) {
					if (s.audio.canPlayType(mimeType[param.format[i]]) != '') {
						s.src = param.se + '.' + param.format[i];
						break;
					}
				}
			}
			s.repeat = (param.repeat > 0) ? param.repeat : 0;
			s.delay = (param.delay > 0) ? param.delay : 0;
			Stage.sounds[2].push(s);
		}
	}
}
// video - plays a video (cutscene, etc.)
function video(param) {
	if (!document.createElement('video').canPlayType) return;
	
	var mimeType = {"mp4": 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
					"mpv": 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
					"ogg": 'video/ogg; codecs="theora, vorbis"',
					"ogv": 'video/ogg; codecs="theora, vorbis"',
					"webm": 'video/webm; codecs="vp8, vorbis"'};
				
	var v = new Movie();
	v.src = null;
	for (var i in param.format) {
		if (v.movie.canPlayType(mimeType[param.format[i]]) != '') {
			v.src = param.src + '.' + param.format[i];
			break;
		}
	}	
	Stage.videos.push(v);
	Stage.pause = true;
}
// default form elements
function input(param) {
	var element = document.createElement("input");
	element.name = param.name;
	element.id = param.name;
	if (param.placeholder) element.placeholder = param.placeholder;
	if (param.autofocus) element.autofocus = param.autofocus;
	if (param.bind) {
		element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	return element;
}
function input_label(param, tip) {
	var element = document.createElement("label");
	element.htmlFor = param;
	element.innerHTML = param;
	if (tip) element.title = tip;
		//element.innerHTML += '<span>'+tip+'</span>';
	return element;
}
function textarea(param) {
	var element = document.createElement("textarea");
	element.name = param.name;
	element.id = param.name;
	if (param.placeholder) element.placeholder = param.placeholder;
	if (param.autofocus) element.autofocus = param.autofocus;
	//if (param.rows != null) element.rows = param.rows;
	//if (param.cols != null) element.cols = param.cols;
	if (param.bind) {
		element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	return element;
}
function fieldset(param) {
	var element = document.createElement("fieldset");
	element.id = param;
	return element;
}
function select(param) {
	var element = document.createElement("select");
	element.name = param.name;
	element.id = param.name;
	for (var i=0; i<param.options.length; i+=2) {
		var opt = document.createElement("option");
		opt.innerText = param.options[i];
		opt.value = param.options[i+1];
		element.appendChild(opt);
		if (param.bind) {
			if (opt.value == Helper.getValue(param.bind)) 
				element.selectedIndex = i/2;
		}
	}
	if (param.bind) Stage.formBindings.push([param.name, param.bind]);
	return element;
}
function submit(param) {
	var element = document.createElement("input");
	element.type = "button";
	element.name = param.name;
	element.id = param.name;
	element.value = param.name;
	element.appendChild(document.createTextNode(param.name));
	Helper.addEvent(element, 'click', function(e) {
			if (e.which != 1) return;
			// update bindings here
			for (var idx in Stage.formBindings) {
				var items = document.getElementById(Stage.formBindings[idx][0]);
				//alert(items.type+" "+items.value+" "+items.checked);
				if (items.type == "radio") {
					if (items.checked == true) 
						Helper.setValue(Stage.formBindings[idx][1], items.value);
				}
				else if (items.type == "checkbox") {
					Helper.setValue(Stage.formBindings[idx][1], items.checked);
				}
				else if ((items.type == "range") || (items.type == "number")) {
					Helper.setValue(Stage.formBindings[idx][1], items.valueAsNumber);
				}
				else {
					Helper.setValue(Stage.formBindings[idx][1], items.value);
				}
			}
			// remove form here
			Stage.activeForm.parent.removeChild(Stage.activeForm.newForm);
			Stage.activeForm = null;
			Stage.pause = false;
        }, false);

	return element;
}
function checkbox(param) {
	var element = document.createElement("input");
	element.type = "checkbox";
	element.name = param.name;
	element.id = param.name;
	if (param.checked)
		element.checked = param.checked;
	else
		element.checked = false;
	if (param.bind) {
		element.checked = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	return element;
}
function radio(param) {
	var element = document.createElement("input");
	element.type = "radio";
	element.name = param.name;
	element.id = param.value;
	element.value = param.value;
	if (param.checked)
		element.checked = param.checked;
	else
		element.checked = false;
	if (param.bind) {
		element.checked = (element.value == Helper.getValue(param.bind));
		Stage.formBindings.push([param.value, param.bind]);
	}
	return element;
}
function spinbox(param) {
	var element = document.createElement("input");
	element.type = "number";
	element.name = param.name;
	element.id = param.name;
	if (param.min != null) element.min = param.min;
	if (param.max != null) element.max = param.max;
	if (param.step != null) element.step = param.step;
	if (param.value != null) element.value = param.value;
	if (param.bind) {
		element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	return element;
}
function slider(param) {
	var element = document.createElement("input");
	element.type = "range";
	element.name = param.name;
	element.id = param.name;
	if (param.min != null) element.min = param.min;
	if (param.max != null) element.max = param.max;
	if (param.step != null) element.step = param.step;
	if (param.value != null) element.value = param.value;
	if (param.bind) {
		element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	return element;
}
// form - create a default HTML form
function form(param) {
	var f = new Form();
	var fset = null;
	f.Create(param[0]);
	for (var i=1; i<param.length; i+=2) {
		// if this element is a fieldset, revert to default fieldset
		if (param[i] == fieldset)
			fset = null;
		
		// append element to active fieldset
		if ((param[i] == input) || 
			(param[i] == select) || 
			(param[i] == spinbox) ||
			(param[i] == slider) ||
			(param[i] == textarea)) {
			f.AddChild(input_label(param[i+1].name, param[i+1].tip), fset);
		}
		f.AddChild(param[i].call(this, param[i+1]), fset);	
		if (param[i] == checkbox) {
			f.AddChild(input_label(param[i+1].name, param[i+1].tip), fset);
		}
		if (param[i] == radio) {
			f.AddChild(input_label(param[i+1].value, param[i+1].tip), fset);
		}
		
		// if this element is a fieldset, attach succeeding elements to it
		if (param[i] == fieldset)
			fset = param[i+1];
	}

	Stage.activeForm = f;
	Stage.pause = true;
}
// message - display a message box
function message(param) {
	alert(param);
}
// checkpoint - loads/saves at a given checkpoint
function checkpoint(param) {
	if (!Helper.supportsLocalStorage()) return;

	if (param == "save") {
		localStorage.clear();
		// Store script entry point
		if (Stage.script.sequence[0] == label) {
			localStorage["sequence"] = Stage.script.sequence[1];
			localStorage["frame"] = Stage.script.frame;
		}
		else {
			localStorage["sequence"] = '';
			localStorage["frame"] = 0;
		}
		// Store layer 0
		localStorage["l0_count"] = Stage.layers[0].length;
		for (var i=0; i<Stage.layers[0].length; i++) {
			localStorage["l0_"+i+"_id"] = Stage.layers[0][i].canvas.id;
			localStorage["l0_"+i+"_src"] = Stage.layers[0][i].image.src;
			localStorage["l0_"+i+"_obj_count"] = Stage.layers[0][i].objects.length;
			for (var j=0; j<Stage.layers[0][i].objects.length; j++) {
				localStorage["l0_"+i+"_obj_"+j+"_src"] = Stage.layers[0][i].objects[j].img.src;
				localStorage["l0_"+i+"_obj_"+j+"_x"] = Stage.layers[0][i].objects[j].x;
				localStorage["l0_"+i+"_obj_"+j+"_y"] = Stage.layers[0][i].objects[j].y;
			}
			localStorage["l0_"+i+"_alpha"] = Stage.layers[0][i].alpha;
			localStorage["l0_"+i+"_effects"] = Stage.layers[0][i].effects;
			localStorage["l0_"+i+"_time"] = Stage.layers[0][i].transTime;
		}
		// Store layer 1
		localStorage["l1_count"] = Stage.layers[1].length;
		for (var i=0; i<Stage.layers[1].length; i++) {
			localStorage["l1_"+i+"_id"] = Stage.layers[1][i].id;
			localStorage["l1_"+i+"_nick"] = Stage.layers[1][i].nick;
			localStorage["l1_"+i+"_color"] = Stage.layers[1][i].color;
			localStorage["l1_"+i+"_spites_count"] = Stage.layers[1][i].sprites.length;
			for (var j=0; j<Stage.layers[1][i].sprites.length; j++) {
				localStorage["l1_"+i+"_sprites_"+j+"_id"] = Stage.layers[1][i].sprites[j].id;
				localStorage["l1_"+i+"_sprites_"+j+"_src"] = Stage.layers[1][i].sprites[j].src.src;			
			}
			if (Stage.layers[1][i].avatar != null)
				localStorage["l1_"+i+"_avatar"] = Stage.layers[1][i].avatar.src;
			else
				localStorage["l1_"+i+"_avatar"] = "undefined";
			localStorage["l1_"+i+"_active"] = Stage.layers[1][i].activeSprite;
			localStorage["l1_"+i+"_alpha"] = Stage.layers[1][i].alpha;
			localStorage["l1_"+i+"_effects"] = Stage.layers[1][i].prevFx;
			localStorage["l1_"+i+"_time"] = Stage.layers[1][i].transTime;
			localStorage["l1_"+i+"_visible"] = Stage.layers[1][i].visible;
			localStorage["l1_"+i+"_pending"] = Stage.layers[1][i].pendingRemoval;
		}
		// Store layer 2
		localStorage["l2_count"] = Stage.layers[2].length;
		for (var i=0; i<Stage.layers[2].length; i++) {
			localStorage["l2_"+i+"_id"] = Stage.layers[2][i].canvas.id;
			localStorage["l2_"+i+"_src"] = Stage.layers[2][i].image.src;
			localStorage["l2_"+i+"_alpha"] = Stage.layers[2][i].alpha;
			localStorage["l2_"+i+"_effects"] = Stage.layers[2][i].effects;
			localStorage["l2_"+i+"_time"] = Stage.layers[2][i].transTime;
			localStorage["l2_"+i+"_scroll"] = Stage.layers[2][i].scroll;
			localStorage["l2_"+i+"_offset_x"] = Stage.layers[2][i].offset[0];
			localStorage["l2_"+i+"_offset_y"] = Stage.layers[2][i].offset[1];
		}
		// Store layer 3
		localStorage["l3_count"] = Stage.layers[3].length;
		for (var i=0; i<Stage.layers[3].length; i++) {
			localStorage["l3_"+i+"_id"] = Stage.layers[3][i].canvas.id;
			localStorage["l3_"+i+"_type"] = Stage.layers[3][i].type;
			localStorage["l3_"+i+"_count"] = Stage.layers[3][i].numParticles;
			localStorage["l3_"+i+"_action"] = Stage.layers[3][i].action;
		}
		// Store layer 4
		localStorage["l4_count"] = Stage.layers[4].length;
		for (var i=0; i<Stage.layers[4].length; i++) {
			localStorage["l4_"+i+"_type"] = Stage.layers[4][i].type;
			if (Stage.layers[4][i].type == "box") {
				localStorage["l4_"+i+"_visible"] = Stage.layers[4][i].visible;
				localStorage["l4_"+i+"_text"] = Stage.layers[4][i].text;
				localStorage["l4_"+i+"_pos"] = Stage.layers[4][i].pos;
				localStorage["l4_"+i+"_back"] = Stage.layers[4][i].back;
				if (Stage.layers[4][i].src != '')
					localStorage["l4_"+i+"_src"] = Stage.layers[4][i].src;
				else
					localStorage["l4_"+i+"_src"] = "undefined";
				if (Stage.layers[4][i].psrc != '')
					localStorage["l4_"+i+"_prompt"] = Stage.layers[4][i].psrc;
				else
					localStorage["l4_"+i+"_prompt"] = "undefined";
				localStorage["l4_"+i+"_cont"] = Stage.layers[4][i].cont;
				localStorage["l4_"+i+"_fontFamily"] = Stage.layers[4][i].fontFamily;
				localStorage["l4_"+i+"_fontSize"] = Stage.layers[4][i].fontSize;
				localStorage["l4_"+i+"_lineHeight"] = Stage.layers[4][i].lineHeight;
				localStorage["l4_"+i+"_fontWeight"] = Stage.layers[4][i].fontWeight;
				localStorage["l4_"+i+"_fontColor"] = Stage.layers[4][i].fontColor;
				localStorage["l4_"+i+"_tagFamily"] = Stage.layers[4][i].tagFamily;
				localStorage["l4_"+i+"_tagSize"] = Stage.layers[4][i].tagSize;
				localStorage["l4_"+i+"_tagWeight"] = Stage.layers[4][i].tagWeight;
				localStorage["l4_"+i+"_tagColor"] = Stage.layers[4][i].tagColor;
				localStorage["l4_"+i+"_timeout"] = Stage.layers[4][i].timeout;
				localStorage["l4_"+i+"_offset_x"] = Stage.layers[4][i].textOffset.x;
				localStorage["l4_"+i+"_offset_y"] = Stage.layers[4][i].textOffset.y;
				localStorage["l4_"+i+"_inputFocus"] = Stage.layers[4][i].inputFocus;
				localStorage["l4_"+i+"_jumpTo_count"] = Stage.layers[4][i].jumpTo.length;
				for (var j=0; j<Stage.layers[4][i].jumpTo.length; j++) {
					localStorage["l4_"+i+"jumpTo"+j+"hotspot_x"] = Stage.layers[4][i].jumpTo[j].hotspot[0];
					localStorage["l4_"+i+"jumpTo"+j+"hotspot_y"] = Stage.layers[4][i].jumpTo[j].hotspot[1];
					localStorage["l4_"+i+"jumpTo"+j+"link"] = Stage.layers[4][i].jumpTo[j].link;
				}
			}
			if (Stage.layers[4][i].type == "button") {
				if (Stage.layers[4][i].group != '')
					localStorage["l4_"+i+"_group"] = Stage.layers[4][i].group;
				else
					localStorage["l4_"+i+"_group"] = "undefined";
				localStorage["l4_"+i+"_sprites_count"] = Stage.layers[4][i].sprites.length;
				for (var j=0; j<Stage.layers[4][i].sprites.length; j++) {
					localStorage["l4_"+i+"_sprites_"+j] = Stage.layers[4][i].sprites[j].src;
				}
				localStorage["l4_"+i+"_text"] = Stage.layers[4][i].text;
				localStorage["l4_"+i+"_link_0"] = Stage.layers[4][i].link[0].toString().split(/[' '|(|)|{|}]/g, 2)[1];
				localStorage["l4_"+i+"_link_1"] = JSON.stringify(Stage.layers[4][i].link[1]);
				localStorage["l4_"+i+"_visible"] = Stage.layers[4][i].visible;
				localStorage["l4_"+i+"_showText"] = Stage.layers[4][i].showText;
				localStorage["l4_"+i+"_rect_x"] = Stage.layers[4][i].rect.x;
				localStorage["l4_"+i+"_rect_y"] = Stage.layers[4][i].rect.y;
				localStorage["l4_"+i+"_rect_w"] = Stage.layers[4][i].rect.w;
				localStorage["l4_"+i+"_rect_h"] = Stage.layers[4][i].rect.h;
			}
			// TODO: other GUI types
		}
		// Store sounds
		for (var i=0; i<3; i++) {
			localStorage["s"+i+"_count"] = Stage.sounds[i].length;
			for (var j=0; j<Stage.sounds[i].length; j++) {
				localStorage["s"+i+"_"+j+"_src"] = Stage.sounds[i][j].src;
				localStorage["s"+i+"_"+j+"_repeat"] = Stage.sounds[i][j].repeat;
				localStorage["s"+i+"_"+j+"_delay"] = Stage.sounds[i][j].delay;
				localStorage["s"+i+"_"+j+"_isStopping"] = Stage.sounds[i][j].isStopping;
				localStorage["s"+i+"_"+j+"_isPaused"] = Stage.sounds[i][j].isPaused;
			}
		}
		// Store video?? No need. Videos are non-persistent data anyway
		// Store user variables
		localStorage["uv_count"] = Stage.variables.length;
		for (var i=0; i<Stage.variables.length; i++) {
			localStorage["uv"+i+"_name"] = Stage.variables[i].name;
			localStorage["uv"+i+"_value"] = Stage.variables[i].value;
			localStorage["uv"+i+"_type"] = Stage.variables[i].type;
		}
		// Store forms
		localStorage["forms_count"] = Stage.formStack.length;
		for (var i=0; i<Stage.formStack.length; i++) {
			localStorage["formStack_"+i] = Stage.formStack[i];
		}
		localStorage["forms_style_count"] = Stage.formStyle.length;
		for (var i=0; i<Stage.formStyle.length; i++) {
			localStorage["formStyle_"+i] = Stage.formStyle[i];
		}
		// Store config
		localStorage["Config"] = JSON.stringify(Config);
	}
	else if (param == "load") {
		if (localStorage.length <= 0) {
			alert ("No checkpoint data found!\nStarting a new game instead...");
			return;
		}
		// at this point, Stage.Init has been called with empty classes
		// populate layer 0
		Stage.layers[0].splice(0, Stage.layers[0].length);
		for (var i=0; i<parseInt(localStorage["l0_count"]); i++) {
			var bg = new Backdrop();
			var obj = new Array();
			for (var j=0; j<parseInt(localStorage["l0_"+i+"_obj_count"]); j++) {
				var item = {src:'', x:0, y:0};
				item.src = localStorage["l0_"+i+"_obj_"+j+"_src"];
				item.x = parseInt(localStorage["l0_"+i+"_obj_"+j+"_x"]);
				item.y = parseInt(localStorage["l0_"+i+"_obj_"+j+"_y"]);
				obj.push(item);
			}
			bg.Create(localStorage["l0_"+i+"_id"], localStorage["l0_"+i+"_src"], obj);
			bg.effects = localStorage["l0_"+i+"_effects"];
			bg.alpha = parseFloat(localStorage["l0_"+i+"_alpha"]);
			bg.transTime = parseFloat(localStorage["l0_"+i+"_time"]);
			Stage.layers[0].push(bg);
		}
		// populate layer 1
		Stage.layers[1].splice(0, Stage.layers[1].length);
		for (var i=0; i<parseInt(localStorage["l1_count"]); i++) {
			var chr = new Character();
			chr.Create(localStorage["l1_"+i+"_id"]);
			chr.nick = localStorage["l1_"+i+"_nick"];
			chr.color = localStorage["l1_"+i+"_color"];
			for (var j=0; j<parseInt(localStorage["l1_"+i+"_spites_count"]); j++) {
				chr.AddSprite(localStorage["l1_"+i+"_sprites_"+j+"_id"], localStorage["l1_"+i+"_sprites_"+j+"_src"]);
			}
			if (localStorage["l1_"+i+"_avatar"] != "undefined")
				chr.AddAvatar(localStorage["l1_"+i+"_avatar"]);
			else 
				chr.AddAvatar('');
			chr.activeSprite = parseInt(localStorage["l1_"+i+"_active"]);
			chr.alpha = parseFloat(localStorage["l1_"+i+"_alpha"]);
			//chr.effects = localStorage["l1_"+i+"_effects"];
			chr.prevFx = localStorage["l1_"+i+"_effects"];
			chr.transTime = parseFloat(localStorage["l1_"+i+"_time"]);
			chr.visible = (localStorage["l1_"+i+"_visible"] == "true");
			chr.pendingRemoval = (localStorage["l1_"+i+"_pending"] == "true");
			Stage.layers[1].push(chr);
		}
		// populate layer 2
		Stage.layers[2].splice(0, Stage.layers[2].length);
		for (var i=0; i<parseInt(localStorage["l2_count"]); i++) {
			var ovl = new Backdrop();
			ovl.Create(localStorage["l2_"+i+"_id"], localStorage["l2_"+i+"_src"], null);
			ovl.effects = localStorage["l2_"+i+"_effects"];
			ovl.alpha = parseFloat(localStorage["l2_"+i+"_alpha"]);
			ovl.transTime = parseFloat(localStorage["l2_"+i+"_time"]);
			ovl.scroll = (localStorage["l2_"+i+"_scroll"] == "true");
			ovl.offset = [parseInt(localStorage["l2_"+i+"_offset_x"]), parseInt(localStorage["l2_"+i+"_offset_y"])];
			Stage.layers[2].push(ovl);
		}
		// populate layer 3
		Stage.layers[3].splice(0, Stage.layers[3].length);
		for (var i=0; i<parseInt(localStorage["l3_count"]); i++) {
			var atm = new Atmosphere();
			atm.Create(localStorage["l3_"+i+"_id"]);
			atm.Init(localStorage["l3_"+i+"_type"], parseInt(localStorage["l3_"+i+"_count"]));
			atm.action = localStorage["l3_"+i+"_action"];
			Stage.layers[3].push(atm);
		}
		// populate layer 4
		Stage.layers[4].splice(0, Stage.layers[4].length);
		for (var i=0; i<parseInt(localStorage["l4_count"]); i++) {
			if (localStorage["l4_"+i+"_type"] == 'box') {
				var sb = new ScriptBox();
				sb.Create(Stage.canvas.width, Stage.canvas.height);
				sb.visible = (localStorage["l4_"+i+"_visible"] == "true");
				sb.text = localStorage["l4_"+i+"_text"];
				sb.pos = localStorage["l4_"+i+"_pos"];
				sb.back = localStorage["l4_"+i+"_back"];
				if (localStorage["l4_"+i+"_src"] != "undefined")
					sb.src = localStorage["l4_"+i+"_src"];
				else
					sb.src = '';
				if (localStorage["l4_"+i+"_prompt"] != "undefined") {
					sb.psrc = localStorage["l4_"+i+"_prompt"];
					sb.prompt.src = sb.psrc;
				}
				else 
					sb.psrc = '';
				sb.cont = localStorage["l4_"+i+"_cont"];
				sb.fontFamily = localStorage["l4_"+i+"_fontFamily"];
				sb.fontSize = localStorage["l4_"+i+"_fontSize"];
				sb.lineHeight = localStorage["l4_"+i+"_lineHeight"];
				sb.fontWeight = localStorage["l4_"+i+"_fontWeight"];
				sb.fontColor = localStorage["l4_"+i+"_fontColor"];
				sb.tagFamily = localStorage["l4_"+i+"_tagFamily"];
				sb.tagSize = localStorage["l4_"+i+"_tagSize"];
				sb.tagWeight = localStorage["l4_"+i+"_tagWeight"];
				sb.tagColor = localStorage["l4_"+i+"_tagColor"];
				sb.timeout = parseFloat(localStorage["l4_"+i+"_timeout"]);
				sb.textOffset.x = parseInt(localStorage["l4_"+i+"_offset_x"]);
				sb.textOffset.y = parseInt(localStorage["l4_"+i+"_offset_y"]);
				sb.inputFocus = (localStorage["l4_"+i+"_inputFocus"] == "true");
				for (var j=0; j<parseInt(localStorage["l4_"+i+"_jumpTo_count"]); j++) {
					var menuItem = {hotspot:[], link:''};
					menuItem.link = localStorage["l4_"+i+"jumpTo"+j+"link"];
					menuItem.hotspot = [parseInt(localStorage["l4_"+i+"jumpTo"+j+"hotspot_x"]),
											parseInt(localStorage["l4_"+i+"jumpTo"+j+"hotspot_y"])];
					sb.jumpTo.push(menuItem);
				}			
				Stage.layers[4].push(sb);
			}
			if (localStorage["l4_"+i+"_type"] == 'button') {
				var bt = new ActiveImage();
				var rect = {x:0, y:0, w:0, h:0};
				rect.x = parseInt(localStorage["l4_"+i+"_rect_x"]);
				rect.y = parseInt(localStorage["l4_"+i+"_rect_y"]);
				rect.w = parseInt(localStorage["l4_"+i+"_rect_w"]);
				rect.h = parseInt(localStorage["l4_"+i+"_rect_h"]);
				var obj = new Array();
				for (var j=0; j<parseInt(localStorage["l4_"+i+"_sprites_count"]); j++) {
					obj.push(localStorage["l4_"+i+"_sprites_"+j]);
				}
				bt.Create(localStorage["l4_"+i+"_text"], rect, obj);
						  
				bt.visible = (localStorage["l4_"+i+"_visible"] == "true");
				bt.inputFocus = bt.visible;
				bt.showText = (localStorage["l4_"+i+"_showText"] == "true");
				if (localStorage["l4_"+i+"_group"] != "undefined")
					bt.group = localStorage["l4_"+i+"_group"];
				else
					bt.group = '';
				// TODO: link
				var link = new Array();
				link.push(eval(localStorage["l4_"+i+"_link_0"]));
				link.push(JSON.parse(localStorage["l4_"+i+"_link_1"]));
				bt.link = link;
				Stage.layers[4].push(bt);
			}
			// TODO: other gui
		}
		// Populate sounds
		for (var i=0; i<3; i++) {
			Stage.sounds[i].splice(0, Stage.sounds[i].length);
			for (var j=0; j<parseInt(localStorage["s"+i+"_count"]); j++) {
				var s = new Sounds();
				s.src = localStorage["s"+i+"_"+j+"_src"];
				s.repeat = parseInt(localStorage["s"+i+"_"+j+"_repeat"]);
				s.delay = parseFloat(localStorage["s"+i+"_"+j+"_delay"]);
				s.isStopping = (localStorage["s"+i+"_"+j+"_isStopping"] == "true");
				s.isPaused = (localStorage["s"+i+"_"+j+"_isPaused"] == "true");
				Stage.sounds[i].push(s);
			}
		}
		// populate user variables
		Stage.variables.splice(0, Stage.variables.length);
		for (var i=0; i<parseInt(localStorage["uv_count"]); i++) {
			var uv = new UserVars();
			uv.name = localStorage["uv"+i+"_name"];
			uv.type = localStorage["uv"+i+"_type"];
			if (uv.type == "number")
				uv.value = parseFloat(localStorage["uv"+i+"_value"]);
			else if (uv.type == "boolean")
				uv.value = (localStorage["uv"+i+"_value"] == "true");
			else
				uv.value = localStorage["uv"+i+"_value"];
			Stage.variables.push(uv);
		}
		// populate form stack and style
		Stage.formStack.splice(0, Stage.formStack.length);
		for (var i=0; i<parseInt(localStorage["forms_count"]); i++) {
			Stage.formStack.push(localStorage["formStack_"+i]);
		}
		Stage.formStyle.splice(0, Stage.formStyle.length);
		for (var i=0; i<parseInt(localStorage["forms_style_count"]); i++) {
			Stage.formStyle.push(localStorage["formStyle_"+i]);
		}
		// populate Config
		Config = JSON.parse(localStorage["Config"]);
		
		// then jump to checkpoint location
		//alert (localStorage["sequence"] +" "+localStorage["frame"]);
		if (localStorage["sequence"] != '')
			Stage.script.sequence = eval(localStorage["sequence"]);
		Stage.script.frame = parseInt(localStorage["frame"]);
	}
}

// Stage elements
// User variables
function UserVars() {
	var uv = {
		name: 0,
		value: 0,
		type: 0,
		
		Set: function(n, v) {
			this.name = n;
			this.value = v;
			this.type = typeof v;
		},
		
		Value: function() {
			return this.value;
		},
		
		Name: function() {
			return this.name;
		}
	}
	return uv;
}
// Audio elements
function Sounds() {
	var snd = {
		src: 0,
		repeat: -1,
		delay: 0,
		audio: new Audio(),
		initd: false,
		isStopping: false,
		isPaused: false,
		
		Play: function(init) {
			if (init && this.initd) return;
			if ((this.audio != null) &&
				(this.src != null)) {
				if (init) {
					this.audio.src = this.src;
					// loop is buggy or not implemented in firefox, do a manual loop
					/*
					if (this.repeat < 0)
						this.audio.loop = true;
					else {
						Helper.addEvent(this.audio, 'ended', (function(self) {
							return function() {
								if (self.repeat > 0) {
									self.Play(false);
									self.repeat--;
								}
							}
				        })(this), false);					
					}
					*/
					Helper.addEvent(this.audio, 'ended', (function(self) {
						return function() {
							if (self.repeat > 0) {
								self.Play(false);
								self.repeat--;
							}
							else if (self.repeat < 0) {
								self.Play(false);
							}
							else {	// self.repeat == 0
								self.isPaused = true;
							}
						}
					})(this), false);
					this.audio.volume = (Config.volumeAudio != null) ? Config.volumeAudio : 1;
					if (!this.isPaused) {
						if (this.delay > 0)
							setTimeout((function(self) { return function () { self.audio.play(); }; })(this), this.delay * 1000);
						else
							this.audio.play();
					}
					this.initd = true;
				}
				else {
					this.audio.volume = (Config.volumeAudio != null) ? Config.volumeAudio : 1;
					this.isPaused = false;
					if (this.delay > 0)
						setTimeout((function(self) { return function () { self.audio.play(); }; })(this), this.delay * 1000);
					else
						this.audio.play();
				}
			}
		},
		
		Stop: function(immediate) {
			if ((this.audio != null) && 
				(this.initd)) {
				this.isStopping = true;
				if ((immediate) || (this.audio.volume <= 0)) {
					this.audio.pause();
					this.audio.currentTime = 0;
					this.isStopping = false;
					this.isPaused = true;
				}
				else {
					this.audio.volume = Math.max(0, this.audio.volume-Math.max(0.01, this.audio.volume/4));
				}
			}
		},
		
		Pause: function() {
			if ((this.audio != null) &&
				(this.initd)) {
				this.audio.pause();
				this.isPaused = true;
			}
		},
		
		Seek: function(pos) {
			if ((this.audio != null) && 
				(this.initd)) {
				this.audio.currentTime = pos;
			}
		},
		
		Rewind: function() {
			if ((this.audio != null) &&
				(this.initd)) {
				this.audio.currentTime = 0;
			}
		}
	}
	return snd;
}
// Video element
function Movie() {
	var vid = {
		src: 0,
		movie: document.createElement('video'),
		initd: false,
		isStopping: false,
		parent: 0,
		
		Play: function() {
			if (this.initd)	return;
			
			if ((this.movie != null) && 
				(this.src != null)) {
				
				Helper.addEvent(this.movie, 'ended', (function(self) {
					return function() {
						self.isStopping = true;
					}
				})(this), false);			
				Helper.addEvent(this.movie, 'mouseup', function(e) {
					if (e.which != 1) return;
					vid.isStopping = true;
		        }, false);
				Helper.addEvent(this.movie, 'touchend', function(e) {
					e.preventDefault();
					vid.isStopping = true;
				}, false);
				
				this.movie.src = this.src;
				var x = Stage.canvas.offsetLeft;// - window.pageXOffset;
				var y = Stage.canvas.offsetTop;// - window.pageYOffset;
				if (Config.movieSize) {
					this.movie.width = Config.movieSize * Stage.canvas.width;
					this.movie.height = Config.movieSize * Stage.canvas.height;
					x += (1.0-Config.movieSize)/2 * Stage.canvas.width;// - window.pageXOffset;
					y += (1.0-Config.movieSize)/2 * Stage.canvas.height;// - window.pageYOffset;
				}
				this.movie.setAttribute('style', 'position:absolute; left:'+x+'px; top:'+y+'px');
				this.initd = true;
				this.movie.autoplay = true;
				this.movie.volume = (Config.volumeVideo != null) ? Config.volumeVideo : 1;
				this.parent = Stage.canvas.parentElement;
				this.parent.appendChild(this.movie);
			}
		},
		
		Stop: function(init) {
			if ((this.movie != null) &&
				(this.initd)) {
				this.movie.pause();
				this.parent.removeChild(this.movie);
				Stage.pause = false;
			}
		}
	}
	return vid;
}
// Default form element
function Form() {
	var frm = {
		newForm: document.createElement("form"),
		newFieldset: document.createElement("fieldset"),
		id: 0,
		parent: 0,
		
		Create: function(id) {
			this.newForm.id = id;
			var x = Stage.canvas.offsetLeft;// - window.pageXOffset;
			var y = Stage.canvas.offsetTop; // - window.pageYOffset;
			this.newForm.setAttribute('style', 'position:absolute; left:'+x+'px; top:'+y+'px;');
			
			var newHeading = document.createElement("h1");
			newHeading.innerHTML = id;
			this.newForm.appendChild(newHeading);
			var newHr = document.createElement("hr");
			this.newForm.appendChild(newHr);
			
			this.newFieldset.id = "_fieldset_";
			this.newForm.appendChild(this.newFieldset);

			this.parent = Stage.canvas.parentElement;
			this.parent.appendChild(this.newForm);
			Stage.formBindings.splice(0, Stage.formBindings.length);
		},
		
		AddChild: function(element, fieldsetname) {
			if (fieldsetname != null)
				document.getElementById(fieldsetname).appendChild(element);
			else
				this.newFieldset.appendChild(element);
		}
	}
	return frm;
}
// Background/Overlay image
function Backdrop() {
	var bg = {
		canvas: 0,
		context: 0,
		image: 0,
		origin: {x:0, y:0},		// backdrop's origin is center
		isready: false,
		effects: 'none',
		alpha: 0,
		transTime: 1,	//#secs transition time
		redraw: true,
		drawn: false,
		update: false,
		objects: new Array(),
		loaded: 0,
		scroll: false,
		offset:[0,0],
		
		Create: function(id, file, obj) {
			this.canvas = document.createElement('canvas');
			this.canvas.id = escape(id);
			this.context = this.canvas.getContext('2d');

			if (obj) {
				this.loaded = obj.length + 1;	// total number of images to load
				if (obj.length>0) {
					for (var i in obj) {
						var item = {img:new Image(), x:obj[i].x, y:obj[i].y};
						item.img.onload = function() {
							bg.IsLoaded();
						}
						item.img.src = obj[i].src;
						this.objects.push(item);
					}
				}
			}
			else
				this.loaded = 1;
			this.image = new Image();
			this.image.onload = function() {
				bg.canvas.setAttribute('width', bg.image.width);
				bg.canvas.setAttribute('height', bg.image.height);
				bg.origin.x = bg.image.width/2;
				bg.origin.y = bg.image.height/2;
				//bg.isready = true;
				bg.IsLoaded();
			}
			this.image.src = file;
			
			// configure transition
			if (Config.transTime != null) {
				this.transTime = (Config.transTime > 0) ? Config.transTime : 0.01;
			}
			
			this.update = false;
			return this.canvas.id;
		},
		
		IsLoaded: function() {
			if (--this.loaded <= 0)
				this.isready = true;
		},
		
		Update: function(elapsed) {
			if (this.isready) {
				switch (this.effects) {
					case 'fadein':
					case 'dissolvein':
						if (this.alpha >= 1.0) {
							this.effects = 'done';
							this.drawn = true;
						}
						else {
							this.alpha += elapsed/(this.transTime * 1000);
						}
						this.redraw = true;
						break;
					case 'fadeout':
					case 'dissolveout':
						if (this.alpha <= 0.0) {
							this.effects = 'done';
							this.drawn = true;
						}
						else {
							this.alpha -= elapsed/(this.transTime * 1000);
						}
						this.redraw = true;
						break;
					case 'nonein':
					case 'in':
						this.alpha = 1.0;
						this.effects = 'done';
						this.drawn = true;
						this.redraw = true;
						break;
					case 'noneout':
					case 'out':
						this.alpha = 0.0;
						this.effects = 'done';
						this.drawn = true;
						this.redraw = true;
						break;
					case 'done':
					default:
						this.drawn = true;
						break;
				}
			}
			return this.update;
		},
		
		Draw: function() {
			if (!this.isready) return false;
			if (!this.redraw) return false;

			this.context.clearRect(0,0,this.canvas.width,this.canvas.height);		
			this.context.globalAlpha = Math.max(0, Math.min(1, this.alpha));		
			this.context.drawImage(this.image, 0, 0);
			if (this.objects.length > 0) {
				for (var i in this.objects)
					this.context.drawImage(this.objects[i].img, this.objects[i].x, this.objects[i].y)
			}
			this.redraw = false;
			if (this.drawn) this.update = true;
			return true;
		},	
	}
	return bg;
}
// Selectable/clickable image; use for buttons, imagemaps, etc.
function ActiveImage() {
	var act = {
		type: 'button',
		group: '',
		canvas: 0,
		context: 0,
		isready: false,
		redraw: true,
		drawn: false,
		update: false,
		sprites: new Array(),
		loaded: 0,
		inputFocus: true,
		text: '',
		link: '',
		origin: {x:0, y:0},
		rect: {x:0, y:0, w:0, h:0},
		state: '',
		prev_state: '',
		visible: true,
		showText: true,
		
		Create: function(id, rect, obj) {
			this.canvas = document.createElement('canvas');
			this.canvas.id = escape(id);
			this.context = this.canvas.getContext('2d');
			this.text = id;
			this.rect = rect;
			this.origin.x = this.rect.x;
			this.origin.y = this.rect.y;
			
			if (obj.length>0) {
				this.loaded = obj.length;
				for (var i in obj) {
					var item = new Image();
					item.onload = function() {
						act.IsLoaded();
					}
					item.src = obj[i];
					this.sprites.push(item);
				}
			}
		},
		IsLoaded: function() {
			if (--this.loaded <= 0) {
				this.isready = true;
				// all sprites are assumed same size, set canvas size here
				if (this.rect.w == 0) {
					this.canvas.setAttribute('width',this.sprites[0].width);
					this.rect.w = this.sprites[0].width;
				}
				if (this.rect.h == 0) {
					this.canvas.setAttribute('height',this.sprites[0].height);
					this.rect.h = this.sprites[0].height;
				}
			}
		},
		Update: function(elapsed) {
			if (this.isready) {
				if (this.prev_state != this.state) {
					this.prev_state = this.state;
					this.redraw = true;				
				}
				if (Stage.mouseClick && this.inputFocus && 
				   ((this.state == 'hover') || (this.state == 'clicked'))) {
					if (this.link != '') {
						// remove focus from groupmates
						for (var i in Stage.layers[4]) {
							if (Stage.layers[4][i].group == this.group)
								Stage.layers[4][i].inputFocus = false;
						}
						this.link[0].call(this, this.link[1]);
						Stage.pause = false;
					}
					this.redraw = true;
				}
			}
			return this.update;
		},
		Draw: function() {
			if (!this.isready) return false;
			if (!this.redraw) return false;

			this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
			if (this.visible) {
				if ((this.sprites.length>1) && (this.state=='hover'))
					this.context.drawImage(this.sprites[1],0,0);
				else if ((this.sprites.length>=3) && (this.state=='clicked')) 
					this.context.drawImage(this.sprites[2],0,0);
				else
					this.context.drawImage(this.sprites[0],0,0);
				if ((this.showText) && (this.text != '')) {
					this.context.textBaseline = 'middle';
					this.context.textAlign = 'center';
					if (Stage.formStyle.length > 0)
						this.context.font = Stage.formStyle[0];
					if (Stage.formStyle.length > 1)
						this.context.fillStyle = Stage.formStyle[1];
					this.context.fillText(this.text, this.rect.w/2,this.rect.h/2);
				}			
				if (this.link != '') {
					// create a detectable path
					this.context.beginPath();
					this.context.rect(this.rect.x,this.rect.y,this.rect.w,this.rect.h);
					this.context.closePath();
				}
			}
			
			this.redraw = false;
			this.update = true;
			return true;
		},
	}
	return act;
}
// Script box for dialogs
function ScriptBox() {
	var box = {
		type: 'box',				// identifies type of gui
		group: '',
		pos: 'bottom',		
		back: 'dim',
		src: 0,
		image: 0,
		canvas: 0,
		context: 0,
		canvasText: new CanvasText,
		visible: false,
		vpwidth: 0,
		vpheight: 0,
		redraw: true,
		update: false,
		origin: {x:0, y:0},			// gui origin is topleft
		dimStyle: new Array(),
		
		isready: true,				// flow control
		changed: true,
		cont: false,
		timeout: 0,
		jumpTo: new Array(),
		inputFocus: false,
		
		text: '',					// text display
		avatar: null,
		prompt: new Image(),
		psrc: '',
		menuHover: -1,
		
		fontFamily: 'Verdana',		// font properties
		fontColor: 'white',
		fontSize: '14px',
		fontWeight: 'normal',
		lineHeight: '18',
		textOffset: {x:10, y:20},
		tagFamily: 'Verdana',
		tagColor: '#c8ffc8',
		tagSize: '14px',
		tagWeight: 'bold',
		
		Create: function(w, h) {
			this.src = '';
			this.vpwidth = w;	// viewport dimensions
			this.vpheight = h;
			this.origin.x = this.vpwidth * (1-Config.boxWidth)/2; 	//1/8;
			this.origin.y = this.vpheight * (1-Config.boxHeight);	//3/4;
			
			// create a default script box: dim at bottom
			this.canvas = document.createElement('canvas');
			//this.canvas.id = 'sb_canvas';	// fixed id for script box
			this.context = this.canvas.getContext('2d');
			this.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
			this.canvas.setAttribute('height', this.vpheight * Config.boxHeight);
			
			// configure font style
			if (Config.boxFontStyle) { 
				var subs = Helper.parseFontString(Config.boxFontStyle);
				
				if (subs.length > 0) this.fontWeight = subs[0];
				if (subs.length > 1) {
					this.fontSize = subs[1];
					this.lineHeight = eval(subs[1].substring(0,subs[1].length-2)) + 4;
				}			
				if (subs.length > 2) this.fontFamily = subs[2].replace(/\'/g,'');
				if (subs.length > 3) this.fontColor = subs[3];
			}
			if (Config.boxTagStyle) {
				var subs = Helper.parseFontString(Config.boxTagStyle);
				
				if (subs.length > 0) this.tagWeight = subs[0];
				if (subs.length > 1) this.tagSize = subs[1];
				if (subs.length > 2) this.tagFamily = subs[2].replace(/\'/g,'');
				if (subs.length > 3) this.tagColor = subs[3];
			}

			// configure CanvasText
			this.canvasText.config({
		        canvas: this.canvas,
		        context: this.context,
		        fontFamily: this.fontFamily,
		        fontSize: this.fontSize,
		        fontWeight: this.fontWeight,
		        fontColor: this.fontColor,
		        lineHeight: this.lineHeight
		    });			
			this.canvasText.defineClass("menu", {
		        fontFamily: this.fontFamily,
		        fontSize: this.fontSize,
		        fontWeight: this.fontWeight,
		        fontColor: this.fontColor,
				fontStyle: "italic"
			});
			
			// create prompt images
			//this.isready = false;
			this.prompt.onload = function() {
					box.isready = true;
			}
			this.prompt.src = this.psrc;
			
			// configure dim style
			if (Config.boxDimStyle) {
				var subs = Config.boxDimStyle.split(' ');
				for (var idx in subs)
					this.dimStyle.push(subs[idx]);
			}
		},
		
		Update: function(elapsed) {
			if (this.changed) {
				switch (this.pos) {
					case 'bottom':
						this.origin.x = this.vpwidth * (1-Config.boxWidth)/2;
						this.origin.y = this.vpheight * (1-Config.boxHeight);
						this.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
						this.canvas.setAttribute('height', this.vpheight * Config.boxHeight);
						break;
					case 'center':
						this.origin.x = this.vpwidth * (1-Config.boxWidth)/2;
						this.origin.y = this.vpheight * (1-Config.boxHeight)/2;
						this.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
						this.canvas.setAttribute('height', this.vpheight * Config.boxHeight);
						break;
					case 'top':
						this.origin.x = this.vpwidth * (1-Config.boxWidth)/2;
						this.origin.y = 0;
						this.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
						this.canvas.setAttribute('height', this.vpheight * Config.boxHeight);
						break;
					case 'full':
						this.origin.x = this.vpwidth * (1-Config.boxWidth)/2;
						this.origin.y = this.vpheight * (1-Config.boxFullHeight)/2;
						this.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
						this.canvas.setAttribute('height', this.vpheight * Config.boxFullHeight)
						break;
				}
				switch (this.back) {
					case 'image':
						this.image = new Image();
						this.isready = false;
						this.image.onload = function() {
							box.isready = true;
						}
						this.image.src = this.src;
						this.update = false;
						break;
					case 'none':
					case 'dim':
					default:
						break;
				}
				
				this.canvasText.config({
			        canvas: this.canvas,
			        context: this.context,
			        fontFamily: this.fontFamily,
			        fontSize: this.fontSize,
			        fontWeight: this.fontWeight,
			        fontColor: this.fontColor,
			        lineHeight: this.lineHeight
			    });
				this.canvasText.updateCanvas(this.canvas);

				this.changed = false;
				this.redraw = true;
			}
			if (this.CheckHoverOnHotspot()) {
				this.redraw = true;
			}
			if (Stage.mouseClick && this.inputFocus && (this.menuHover != -1)) {
				Stage.script.SetFrame(this.jumpTo[this.menuHover].link);
				this.inputFocus = false;
				this.menuHover = -1;
				this.jumpTo.splice(0,this.jumpTo.length);
				this.visible = false;
				this.redraw = true;
			}
			return this.update;
		},
		
		Draw: function() {
			if (!this.isready) return false;
			if (!this.redraw) return false;
			
			//alert('ScriptBox.Draw()');
			this.context.clearRect(0,0,this.canvas.width,this.canvas.height);	
			//this.canvas.width = this.canvas.width;
			if (this.visible == true) {
				if (this.back == 'dim') {
					//alert("image dim");
					this.context.globalAlpha = 0.5;
					if (this.dimStyle.length > 1) {
						var grd=this.context.createLinearGradient(0,0,0,this.canvas.height);
						grd.addColorStop(0,this.dimStyle[1]);
						grd.addColorStop(1/this.canvas.height,this.dimStyle[0]);
						grd.addColorStop(1,this.dimStyle[1]);
						this.context.fillStyle=grd;
					} 
					else {
						this.context.fillStyle = this.dimStyle[0];
					}
					this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
				}
				if (this.back == 'image') {
					//alert("image back");
					this.context.globalAlpha = 1;		
					this.context.drawImage(this.image, 0, 0);
				}

				if (this.text != '') {
					// draw the text
					this.context.globalAlpha = 1;
					// draw the avatar if any
					var avatarOffsetX = 0;
					if (Config.actorShowAvatar == true) {
						if (this.avatar != null) {
							avatarOffsetX = this.avatar.width;
							this.context.drawImage(this.avatar, this.textOffset.x/2, (this.canvas.height - this.avatar.height)/2);
						}
					}
					var ret = this.canvasText.drawText({
						text:this.text,
						x: this.textOffset.x + avatarOffsetX,
						y: this.textOffset.y,
						boxWidth:this.canvas.width-2*this.textOffset.x - avatarOffsetX,
					});
					// draw the prompt icon
					if (typeof ret == "object") {
						//vncanvas doesn't use cache or return image, so this should be array
						if (ret.hotspot.length == 0) {
							if (this.psrc != '')
								this.context.drawImage(this.prompt, ret.endpt[0], ret.endpt[1] - this.prompt.height);
						}
						else {
							for(var i=0; i<ret.hotspot.length; i++) {
								this.jumpTo[i].hotspot = ret.hotspot[i];
							}
						}
					}
					// draw hover
					if (this.menuHover != -1) {
						this.context.globalAlpha = 0.25;						
						this.context.fillStyle = Config.boxMenuHilite;
						this.context.fillRect(5,this.jumpTo[this.menuHover].hotspot[1] - this.lineHeight + 4,
												this.canvas.width - 10,this.lineHeight);
					}
				}
				
				// Pauses script box
				Stage.pause = true;
				if (this.timeout > 0) {
					Stage.utimer = setTimeout(function() { 
						Stage.pause = false; 
						Stage.utimerOn = false;
						box.timeout = 0;
					}, this.timeout * 1000);
					Stage.utimerOn = true;
				}
			}
			else {
				Stage.pause = false;
			}
			this.update = true;
			this.redraw = false;
			return true;
		},
		
		CheckHoverOnHotspot: function() {
			if (Stage.mouseMove == false) return false;
			if (this.jumpTo.length == 0) return false;
			if (this.jumpTo[0].hotspot.length < 2) return false;
			if (Stage.coord.x < this.origin.x) return false;
			if (Stage.coord.x > this.origin.x + this.vpwidth * Config.boxWidth) return false;
			
			for (var i in this.jumpTo) {
				if (Stage.coord.y < this.origin.y + this.jumpTo[i].hotspot[1] - this.lineHeight) continue;
				if (Stage.coord.y > this.origin.y + this.jumpTo[i].hotspot[1]) continue;
				this.menuHover = i;
				return true;
			}
			return false;
		},
	}
	return box;
}
// Script element
function Script() {
	var scr = {
		sequence: 0,		// story board, composed of object-value pairs
		frame: 0,			// sequence counter
		
		Init: function(name) {
			this.sequence = name;
			this.frame = 0;
		},
		
		Update: function() {
			if (this.sequence.length > this.frame) {
				if (typeof(this.sequence[this.frame]) == "function") {
					this.sequence[this.frame].call(this, this.sequence[this.frame+1]);
				}
				this.frame += 2;
			}
			else if (this.sequence.length > 0) {
				/*alert("End of script!");*/
				Stage.update = false;
				Stage.pause = true;
			}
		},
		
		SetFrame: function(locator) {
			var idx = locator.indexOf('#',0);
			if (idx != -1) {
				this.sequence = eval(locator.substr(0,idx));
			}
			newlabel = locator.substr(idx+1, locator.length-idx-1 );
			for (var i=0; i<this.sequence.length; i+=2){
				if ((this.sequence[i] == label) && (this.sequence[i+1] == newlabel)) {
					this.frame = i;
					return true;
				}
			}
			return false;
		}
	}
	return scr;
}
// Actors
function Character() {
	var chr = {
		id: '',
		nick: '',
		color: 0,
		isready: false,
		redraw: true,
		drawn: false,
		update: false,
		sprites: new Array(),
		activeSprite: 0,
		prevSprite: -1,
		alpha: 0,
		transTime: 1,
		avatar: null,
		
		canvas: 0,
		context: 0,
		origin: {x:0, y:0},		// actor origin is bottom center
		pos: {x:-1, y:-1},		// relative to main canvas
		
		effects: 'none',
		prevFx: 'none',
		visible: true,
		pendingRemoval: false,
		activeSpriteRemoval: false,
		
		Create: function(id) {
			this.id = id;
			this.canvas = document.createElement('canvas');
			this.canvas.id = escape(id);
			this.context = this.canvas.getContext('2d');

			// configure transition
			if (Config.transTime != null) {
				this.transTime = (Config.transTime > 0) ? Config.transTime : 0.01;
			}
			this.isready = true;
			this.update = false;		
			return this.canvas.id;
		},
		
		AddSprite: function(tag, file) {
			var idx = -1;
			if (this.sprites.length > 1) {
				for (var i in this.sprites) {
					if (this.sprites[i].id == tag) {
						if (this.sprites[i].src.src.search(file) != -1) {
							// this is same sprite, just do nothing
							this.isready = true;
							this.update = false;
							this.activeSprite = i;
							return;
						}
						else {
							// this is same tag but different sprite
							// no reason why you should do this, but here it is anyway
							idx = i;
							break;
						}
					}
				}
			}
			this.isready = false;
			if (idx == -1) {
				var image = new Image();
				var newSprite = {id:tag, src:image};
				this.sprites.push(newSprite);
			} 
			else {
				var tmpSprite = this.sprites[i];
				this.sprites.splice(i, 1)
				this.sprites.push(tmpSprite);
			}
			
			this.sprites[this.sprites.length-1].src.onload = function() {
				chr.canvas.setAttribute('width', chr.sprites[chr.sprites.length-1].src.width);
				chr.canvas.setAttribute('height', chr.sprites[chr.sprites.length-1].src.height);
				chr.origin.x = chr.sprites[chr.sprites.length-1].src.width/2;
				chr.origin.y = chr.sprites[chr.sprites.length-1].src.height;
				chr.isready = true;
			}
			this.sprites[this.sprites.length-1].src.src = file;
			this.activeSprite = this.sprites.length-1;
			this.update = false;
		},
		
		RemoveSprite: function(tag) {
			if (this.sprites.length > 1) {
				for (var i in this.sprites) {
					if (this.sprites[i].id == tag) {
						// if i > activeSprite, just remove
						// if i < activeSprite, remove then set activeSprite+1
						// if i == activeSprite, wait until hidden
						if (i > this.activeSprite)
							this.sprites.splice(i, 1);
						else if (i < this.activeSprite) {
							this.sprites.splice(i, 1);
							this.activeSprite = Math.max(this.activeSprite-1, 0);						
						}
						else {
							this.activeSpriteRemoval = true;
						}
						break;
					}
				}
			}
		},
		
		AddAvatar: function(file) {
			this.isready = false;
			if (file != '') {
				this.avatar = new Image();
				this.avatar.src.onload = function() {
					chr.isready = true;
				}
				this.avatar.src = file;
				this.update = false;
			}
			else {
				this.avatar = null;
			}
		},
		
		Update: function(elapsed) {
			if (this.isready) {
				switch (this.effects) {
					case 'fadein':
					case 'dissolvein':
						this.visible = true;
						if (this.alpha >= 1.0) {
							this.effects = 'done';
							this.drawn = true;
						}
						else {
							this.alpha += elapsed/(this.transTime * 1000);
						}
						this.redraw = true;
						break;
					case 'fadeout':
					case 'dissolveout':
						if (this.alpha <= 0.0) {
							this.effects = 'done';
							this.drawn = true;
							this.visible = false;
						}
						else {
							this.alpha -= elapsed/(this.transTime * 1000);
						}
						this.redraw = true;
						break;
					case 'nonein':
					case 'in':
						this.alpha = 1.0;
						this.effects = 'done';
						this.drawn = true;
						this.redraw = true;
						this.visible = true;
						break;
					case 'noneout':
					case 'out':
						this.alpha = 0.0;
						this.effects = 'done';
						this.drawn = true;
						this.redraw = true;
						this.visible = false;
						break;
					case 'done':
					default:
						this.drawn = true;
						break;
				}
			}
			return this.update;
		},
		
		Draw: function() {
			if (!this.isready) return false;
			if (!this.redraw) return false;
			if (this.activeSprite > this.sprites.length-1) return false;

			this.context.clearRect(0,0,this.canvas.width,this.canvas.height);		
			if (this.prevSprite >= 0) {
				this.context.globalAlpha = Math.max(0, Math.min(1, 1-this.alpha));
				this.context.drawImage(this.sprites[this.prevSprite].src, 0, 0);
				if (1 - this.alpha <= 0) this.prevSprite = -1;
			}
			this.context.globalAlpha = Math.max(0, Math.min(1, this.alpha));
			this.context.drawImage(this.sprites[this.activeSprite].src, 0, 0);
			if (this.activeSpriteRemoval && (this.alpha <= 0)) {
				this.sprites.splice(this.activeSprite, 1);
				this.activeSprite = Math.max(this.activeSprite-1, 0);
				this.activeSpriteRemoval = false;
			}
					
			this.redraw = false;
			if (this.drawn) this.update = true;
			return true;
		}
	}
	return chr;
}
// Particles for atmosphere effects
function Particle() {
	var part = {
		x: 0,
		y: 0,
		xvel: 0,
		yvel: 0,
		viewh: 0,
		vieww: 0,
		
		Create: function(canvas) {
			this.vieww = canvas.width;
			this.viewh = canvas.height;
			this.Reset();
		},
		
		Reset: function() {
			this.x = Math.random() * 1.2 * this.vieww - 0.2 * this.vieww;
			//this.y = Math.random() * this.viewh;
			this.y = Math.random() * (-100);	// somewhere above the canvas
			this.yvel = Math.random() * 40 + 10;
			this.xvel = this.yvel * Math.tan(Math.PI/12);
		},
		
		Update: function(elapsed, reset) {		
			this.x += 2*this.xvel;
			this.y += 2*this.yvel;
			//this.yvel += 1;		// accelerate
			if ((this.x > this.vieww) || (this.y > this.viewh + 50)) {
				if (reset) 
					this.Reset();
				else 
					return false;
			}
			return true;
		},
		
		Draw: function(context) {
			context.beginPath();
			context.moveTo(this.x, this.y);
			context.lineTo(this.x - this.xvel, this.y - this.yvel);
			context.closePath();
			context.stroke();
		},
	}
	return part;
}
// Atmosphere special effects
function Atmosphere() {
	var atm = {
		canvas: 0,
		context: 0,
		type: '',
		isready: false,
		redraw: true,
		update: false,
		visible: true,
		alpha: 0.5,
		action: 'start',
		particles: new Array(),
		numParticles: 0,
		stopped: true,
		
		Create: function(id, type) {
			this.canvas = document.createElement('canvas');
			this.canvas.id = escape(id);
			this.context = this.canvas.getContext('2d');
			this.canvas.setAttribute('width', Stage.canvas.width);
			this.canvas.setAttribute('height', Stage.canvas.height);
		
			this.isready = true;
			this.update = false;		
			return this.canvas.id;
		},
		
		Init: function(type, param) {
			this.type = type;
			if (this.type == 'rain') {
				this.numParticles = param;
				for (var i=0; i<this.numParticles; i++) {
					this.particles[i] = new Particle();
					this.particles[i].Create(this.canvas);
				}
			}
		},

		Update: function(elapsed) {
			if (this.isready) {
				if (this.type == 'rain') {
					var running_draw = false;
					for (var i=0; i<this.numParticles; i++) {
						var ret = this.particles[i].Update(elapsed, (this.action=='start')?true:false);
						if (ret) running_draw = true;
					}
					this.redraw = running_draw;
					if (!this.redraw && (this.numParticles>0)) {
						// free some memory by clearing particles, we'll add later if needed again
						this.particles.splice(0, this.numParticles);
						this.numParticles = 0;
					}
					else if (!this.redraw && (this.numParticles<=0)) {
						this.update = true;
					}
				}
			}
			return this.update;
		},
		
		Draw: function() {
			if (!this.isready) return false;
			if (!this.redraw) return false;

			this.context.clearRect(0,0,this.canvas.width,this.canvas.height);		
			this.context.globalAlpha = Math.max(0, Math.min(1, this.alpha));
			if (this.type == 'rain') {
				this.context.lineWidth = "1";
				this.context.strokeStyle = "rgb(255, 255, 255)";
				for (var i=0; i<this.numParticles; i++) {
					this.particles[i].Draw(this.context);
				}
			}
					
			this.redraw = false;
			this.update = true;
			return true;
		}
	}
	return atm;
}
// Main Stage
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
	coord: {x:0, y:0},
	click: {x:0, y:0},
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
	
	/*	FPS count */
	fps: 0,
	curtime: 0,
	prevtime: 0,
	framecount: 0,
	
	/* camera movement */
	// use coord as cameraPos
	targetPos: {x:0, y:0},
	camVelocity: {x:0, y:0},
	prevPos: {x:0, y:0},
	camTime: 0,
	
	/* temporary static data */
	transTime: 0,

	/* 	Normally shouldn't need more than 5 layers,
		the higher the layer, the higher Z order
			- background = 0: backdrop layer
			- foreground = 1: actors in foreground (optionally more than one layer)
			- closeup	 = 2: actors in closeup
			- atmosphere = 3: atmospheric effects, e.g. lightning flash, dim/brighten, smoke, rain, etc.
			- interface  = 4: script box, buttons, ads
	*/
	layers: new Array(5),
	
	/*	User variables that the script can set/get
		useful for checking conditions, etc.
		this is an array of UserVars
	*/
	variables: new Array(),
	
	/*	Sounds to play, 3 types of sound
			- bgm = 0: background music
			- bgs = 1: background sound
			- se  = 2: sound effects
	*/
	sounds: new Array(3),
	
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
	
	Init: function(canvasId, width, height) {
		// DEBUG: for FPS monitoring
		this.fps = 0;
		this.prevtime = new Date().getTime();
		this.curtime = this.prevtime;
		this.framecount = 0;
	
		this.canvasid = canvasId;
		this.canvas = document.getElementById(canvasId);
		this.context = this.canvas.getContext('2d');
		this.canvas.setAttribute('width', width);
		this.canvas.setAttribute('height', height);
		this.coord.x = width/2;
		this.coord.y = height/2;
		
		// for camera integrator
		this.targetPos = this.coord;
		this.prevPos = this.coord;

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
			Stage.HandleEvents(e);
        }, false);
		Helper.addEvent(this.canvas, 'touchstart', function(e) {
			e.preventDefault();
			Stage.touchStart = true;
			Stage.HandleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'touchmove', function(e) {
			e.preventDefault();
			Stage.mouseMove = true;
			Stage.HandleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'touchend', function(e) {
			e.preventDefault();
			Stage.touchEnd = true;
			Stage.HandleEvents(e);
		}, false);
		
		// create the stage layers
		this.layers[0] = new Array(); 	//background
		this.layers[1] = new Array();	//foreground
		this.layers[2] = new Array();	//closeup
		this.layers[3] = new Array();	//atmosphere
		this.layers[4] = new Array();	//gui
		
		// auto create script box as first element in layers[4]
		var sb = new ScriptBox();
		sb.Create(width, height);
		this.layers[4].push(sb);
		
		// create the sounds playlist
		this.sounds[0] = new Array();
		this.sounds[1] = new Array();
		this.sounds[2] = new Array();
		
		// create the script
		this.script = new Script();
		
		// setup default forms theme
		if (Config.formFontStyle) {
			var subs = Helper.parseFontString(Config.formFontStyle);
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
		if (this.layers[4].length > 0) {
			for (var i in this.layers[4]) {
				if (this.layers[4][i].inputFocus) 
					this.inputFocus = false;
			}
		}

		// handle user inputs
		this.camTime += elapsed;
		if (this.camTime > 67) {
			this.coord = this.GetCameraPosition(elapsed, this.inputFocus);
			this.camTime -= 67;		// about 15fps
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
		if (this.update && !this.pause) {
			this.script.Update()
		}

		// play sounds if any
		for (var idx in this.sounds) {
			if (this.sounds[idx].length > 0) {
				for (var entry in this.sounds[idx]) {
					if (this.sounds[idx][entry].isStopping)
						this.sounds[idx][entry].Stop(false);
					else
						this.sounds[idx][entry].Play(true);
				}
			}
		}
		
		// play videos if any
		for (var idx in this.videos) {
			if (this.videos[idx].isStopping) {
				this.videos[idx].Stop();
				this.videos.pop();
			}
			else
				this.videos[idx].Play();
		}

		var running_update = true;
		for (var idx in this.layers) {
			if (this.layers[idx].length > 0) {
				for (var entry in this.layers[idx]) {
					if (!this.layers[idx][entry].Update(elapsed)) {
						running_update = false;
					}
				}
			}
		}
		this.update = running_update;
		if ((this.update) && (this.transTime > 0))
			this.transTime = Math.max(this.transTime-elapsed/1000, 0);
		
		// reset clicked, assumed processing done
		this.mouseClick = false;
		this.mouseMove = false;
	},
	
	Draw: function() {
		// TODO: clear entire stage first; manage for improved FPS
		if (this.redraw && ((this.layers[0].length > 0) || 
							(this.layers[1].length > 0) ||
							(this.layers[2].length > 0) ||
							(this.layers[3].length > 0) ||
							(this.layers[4].length > 0)	))
			this.context.clearRect(0,0,this.canvas.width,this.canvas.height);

		var running_draw = false;			
		// draw background here
		if (this.layers[0].length > 0) {
			for(var i in this.layers[0]) {
				var ret = this.layers[0][i].Draw();
				if (ret) running_draw = true;
				if (this.redraw) {
					this.context.drawImage(this.layers[0][i].canvas,
									   this.canvas.width/2 - this.layers[0][i].origin.x + this.AddDepth(0, this.canvas.width/2 - this.coord.x),
									   this.canvas.height/2 - this.layers[0][i].origin.y + this.AddDepth(0, this.canvas.height/2 - this.coord.y)/2);
				}
			}
		}
		
		// draw foreground here
		if (this.layers[1].length > 0) {
			// get number of visible actore
			var count = 1;
			for(var i in this.layers[1]) {
				if (this.layers[1][i].visible) count++;
			}
			// compute auto-positioning
			var spritepos = new Array();
			for (var i=1; i<count; i++) {
				if (i%2 == 0) {	// even
					spritepos.push((count-i/2)/count);
				}
				else {	// odd
					spritepos.push((Math.floor(i/2)+1)/count);
				}
			}
			// display actors
			for(var i in this.layers[1]) {
				var ret = this.layers[1][i].Draw();
				if (ret) running_draw = true;
				if (this.redraw) {
					if (this.layers[1][i].visible) {
						var positionX, positionY;
						var factor = spritepos.shift();
						if ((this.layers[1][i].pos.x<0) || (this.layers[1][i].pos.y<0) || (this.transTime <= 0)) {
							positionX = this.canvas.width*factor;
							positionY = this.canvas.height*9/8;
							this.layers[1][i].pos.x = positionX;
							this.layers[1][i].pos.y = positionY;
						}
						else {
							positionX = this.transTime * this.layers[1][i].pos.x + (1-this.transTime) * this.canvas.width*factor;
							positionY = this.transTime * this.layers[1][i].pos.y + (1-this.transTime) * this.canvas.height*9/8;
							running_draw = true;
						}
					
						this.context.drawImage(this.layers[1][i].canvas,
									   positionX - this.layers[1][i].origin.x + this.AddDepth(1, this.canvas.width/2 - this.coord.x),
									   positionY - this.layers[1][i].origin.y + this.AddDepth(1, this.canvas.height/2 - this.coord.y)/2);
					}
					else if (this.layers[1][i].pendingRemoval) {
						this.layers[1].splice(i, 1);
					}
				}
			}
		}
		
		// draw overlay/closeup here
		if (this.layers[2].length > 0) {
			for(var i in this.layers[2]) {
				var ret = this.layers[2][i].Draw();
				if (ret) running_draw = true;
				if (this.redraw) {
					if (this.layers[2][i].scroll)
						this.context.drawImage(this.layers[2][i].canvas,
										   (0.98*this.coord.x/this.canvas.width + 0.01)*(this.canvas.width-2*this.layers[2][i].origin.x),
										   (0.98*this.coord.y/this.canvas.height + 0.01)*(this.canvas.height-2*this.layers[2][i].origin.y));
					else
						this.context.drawImage(this.layers[2][i].canvas,
										   this.canvas.width/2 - this.layers[2][i].origin.x + this.layers[2][i].offset[0],
										   this.canvas.height/2 - this.layers[2][i].origin.y + this.layers[2][i].offset[1]);
				}
			}
		}
		
		// draw atmosphere effects here
		if (this.layers[3].length > 0) {
			for (var i in this.layers[3]) {
				var ret = this.layers[3][i].Draw();
				if (ret) running_draw = true;
				if (this.redraw) {
					this.context.drawImage(this.layers[3][i].canvas, 0, 0);
				}
			}
		}
		
		// draw gui here
		if (this.layers[4].length > 0) {
			for (var i in this.layers[4]) {
				var ret = this.layers[4][i].Draw();
				if (ret) running_draw = true;
				if (this.redraw) {
					this.context.drawImage(this.layers[4][i].canvas, this.layers[4][i].origin.x, this.layers[4][i].origin.y);
					//alert('Stage.Draw():' + ret + ' ' + this.redraw);
				}
			}
		}

		// update redraw variable
		this.redraw = running_draw;
	},
	
	HandleEvents: function(evt) {
		if (this.mouseOut) return;
		// all mouse and touch moves
		this.targetPos = this.GetMousePosition(this.canvas, evt) ||
						 this.GetTouchPosition(this.canvas, evt);
					 
		// mouse click / touch end
		if (this.mouseUp || this.touchEnd) {
			this.click = this.coord;
			this.mouseClick = true;
			this.mouseUp = false;
			this.touchEnd = false;
		}
		//else if (this.mouseMove || this.mouseDown || this.touchStart) {
		else if (this.mouseDown || this.touchStart) {
			for (var i in Stage.layers[4]) {
				if (Stage.layers[4][i].type == "button") {
					if (Stage.layers[4][i].context.isPointInPath(this.targetPos.x, this.targetPos.y)) {
						Stage.layers[4][i].state = 'clicked';
					}
					else
						Stage.layers[4][i].state = '';
				}
			}
		}
		else if (this.mouseMove) {
			for (var i in Stage.layers[4]) {
				if (Stage.layers[4][i].type == "button") {
					if (Stage.layers[4][i].context.isPointInPath(this.targetPos.x, this.targetPos.y)) {
						Stage.layers[4][i].state = 'hover';
					}
					else
						Stage.layers[4][i].state = '';
				}
			}
		}
	},
	
	AddDepth: function(layer, dist) {
		//if (!this.inputFocus) return 0;
		switch(layer) {
			case 0:		// this is background layer
				return 0.1 * dist;
			case 1:		// this is foreground layer
				return 0.2 * dist;
			case 2:		// this is overlay layer
				break;
			default:
				break;
		}
	},
	
	GetMousePosition: function(obj, event) {
		//Stage.coordX = event.pageX - obj.offsetLeft;
		//Stage.coordY = event.pageY - obj.offsetTop;
		var pos = {x:0, y:0};
		pos.x = event.clientX - obj.offsetLeft + window.pageXOffset;
		pos.y = event.clientY - obj.offsetTop + window.pageYOffset;
		pos.x = Math.max(0, Math.min(this.canvas.width, pos.x));
		pos.y = Math.max(0, Math.min(this.canvas.height, pos.y));
		return pos;
	},
	
	GetTouchPosition: function(obj, event) {
		var pos = {x:0, y:0};
		if (event.touches !== undefined && event.touches.length == 1) {
			pos.x = event.touches[0].clientX - obj.offsetLeft + window.pageXOffset;
			pos.y = event.touches[0].clientY - obj.offsetTop + window.pageYOffset;
			pos.x = Math.max(0, Math.min(this.canvas.width, pos.x));
			pos.y = Math.max(0, Math.min(this.canvas.height, pos.y));
			return pos;
        }
	},
	
	GetCameraPosition: function(elapsed, spring) {
		if (spring) {
			if ((Math.abs(this.coord.x-this.targetPos.x)<0.1) && (Math.abs(this.coord.y-this.targetPos.y)<0.1))
			{
				//this.camVelocity.x = 0;
				//this.camVelocity.y = 0;
				this.prevPos = this.targetPos;
				return this.targetPos;
			}
			// TODO: integrator issues in Opera, for now just do an easing position
			var camPos = {x:0, y:0};		
			camPos.x = (this.targetPos.x + this.coord.x)/2;
			camPos.y = (this.targetPos.y + this.coord.y)/2;
			this.prevPos = this.coord;
			
			/** //Euler integration
			var camPos = {x:0, y:0};		
			var forceX = -18 * (this.coord.x - this.targetPos.x) - 10 * this.camVelocity.x;
			var forceY = -18 * (this.coord.y - this.targetPos.y) - 10 * this.camVelocity.y;
			this.camVelocity.x += forceX * elapsed/1000;
			this.camVelocity.y += forceY * elapsed/1000;
			camPos.x = this.coord.x + this.camVelocity.x * elapsed/1000;
			camPos.y = this.coord.y + this.camVelocity.y * elapsed/1000;
			**/
			/** //Verlet integration
			var drag = 0.35;
			var camPos = {x:0, y:0};		
			var forceX = -5 * (this.coord.x - this.targetPos.x);
			var forceY = -5 * (this.coord.y - this.targetPos.y);
			camPos.x = (2 - drag) * this.coord.x -
					   (1 - drag) * this.prevPos.x +
					   (forceX) * (elapsed/1000) * (elapsed/1000);
			camPos.y = (2 - drag) * this.coord.y -
					   (1 - drag) * this.prevPos.y +
					   (forceY) * (elapsed/1000) * (elapsed/1000);
			this.prevPos = this.coord;
			**/
			return camPos;
		}	
		else {
			this.prevPos = this.targetPos;
			return this.targetPos;	
		}
	},
	
	CheckCamera: function() {
		if (Math.abs(this.camVelocity.x) > 0.1) return true;
		if (Math.abs(this.camVelocity.y) > 0.1) return true;
		if (Math.abs(this.coord.x-this.targetPos.x) > 0.1) return true;
		if (Math.abs(this.coord.x-this.targetPos.x) > 0.1) return true;
		return false;
	},
	
	Transition: function(type) {
		if (type == 'show_actor')
			this.transTime = (Config.transTime != null) ? Config.transTime : 0.01;
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
		
		if (window.jQuery) {
			// DEBUG:
			//$('#debug').html(this.timer);
			//$('#debug').html(elapsed);
			//$('#debug').html(Stage.coord.x +', '+ Stage.coord.y);
			//$('#debug').html(Stage.targetPos.x +', '+ Stage.targetPos.y);
			//$('#debug').html(eval(Stage.coord.x - Stage.targetPos.x) +', '+ eval(Stage.coord.y-Stage.targetPos.y));
			//$('#debug').html(Stage.click.x +', '+ Stage.click.y);
			//$('#debug').html(this.script.frame/2 + ' ' + this.update);
			$('#debug').html('FPS: '+ this.fps + ' Frame: ' + this.script.frame/2);
			//$('#debug').html(Stage.camVelocity.x +', '+Stage.camVelocity.y);
		}


		// update the stage
		this.Update(elapsed);
		
		// draw the stage
		this.Draw();

		/* 	Optional:
			For the update and draw methods, setup a timer with random timeout.
			This causes the update and draw to start/operate independently, like
				setTimeout(Stage.Update, 5*Math.random());
				setTimeout(Stage.Draw, 5*Math.random());
			TODO: check for possible implementation ???
		*/
		
		/* 	Optional: ???
			TODO: implement a message dispatcher for Update or Draw methods,
					calling the methods as needed instead of a successive call
		*/
			
		// setup next timer tick
		// usually, ticks should use setInterval, but if update() and draw() takes
		// a long time, the next tick might come before the functions have finished.
		// hence, instead of using flags to check for busy, just make sure the
		// functions have completed before scheduling the next pass
		//this.timer = setTimeout(function() { Stage.Tick(interval); }, interval);
		requestAnimFrame(function(){
			Stage.Tick(interval);
		});
	}
};

// ensure config is not null
var Config = {};
// finally, the script and config is loaded
for (var j in TOC) {
	Helper.includeJs(TOC[j]);
}