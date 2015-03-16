# Revision History #

---

```
Version 0.5 "Diana"
01.14.15 - support responsive template
	 - TODO: Firefox issues - requireJS fails on some version
12.30.14 - improved documentation
	 - organized folder structure
	 - speed up module loading:
	   - engine divided to modules
	   - story script load on demand
	   - support for requireJS
	 - support on-the-fly audio mute
Version 0.4 "Chelsea"
05.18.13 - updated vntemplate
	 - added config file checks to catch errors
04.12.13 - various bugfixes
03.10.13 - support for clickable "scene" objects
	 - support for change of actor "nick"
	 - Bugfix: actor reset changes position for non-auto actors
03.03.13 - "overlay" support for animated images
02.22.13 - support for "actor" shortcut
02.19.13 - "actor" support for animated avatars
02.17.13 - Bugfix: fix size and position of multiple sprites
02.10.13 - "actor" support for animated sprites
02.07.13 - "scene" support for animated objects
12.29.12 - 'menu' supports user variable set
12.24.12 - Support _range attribute for actor stats
	 - Support '$' prepend on jump labels
12.01.12 - Prep for RPG MOD Pack
Version 0.3 "Brenda"
10.12.12 - Bugfix: touch devices reset fix (courtesy of Turker Yasa)
05.15.12 - Added 'random' generator for user variables
	 - Added a parameter to 'macro' calls
	 - Added multiple conditions for 'jump'
05.04.12 - Added auto-revealing map to 'tile' navigation
	 - Bugfix: local storage persist flag fix
04.23.12 - Optimized 'skip' text storage
	 - Bugfix: sprite reuse using tags
	 - Support multiple avatars reuse thru tags
	 - Added screen action 'fall'
04.22.12 - Added actor 'stats' plugin
04.17.12 - Added 'skip read text' function for quick replay
	 -   not thoroughly tested, use with caution
	 - Added toggle mode for 'button'
04.14.12 - Added lookAhead option to preload next resources while idle
	 - Converted 'timer' cform element to a generic text display element
	 - Bugfix: added actor 'voice' to auto preload
	 - Bugfix: added Config-defined format in auto preload
	 - Bugfix: repeat 'animation' fix
04.10.12 - Added 'map' and 'tile' navigation
04.06.12 - Added custom 'animation' set
	 - Added tryit editor for developers (in demo section)
	 - Bugfix on movement effects (broken due to 'nowait')
Version 0.2 "Althea"
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
Version 0.1 "Preview"
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
12.21.11 - Added cforms (buttons only... so far)
12.20.11 - Added basic saves using checkpoint
12.08.11 - Added overlay and atmosphere basics
12.06.11 - Added actor basics
12.05.11 - Added script box, flow control using jump
12.01.11 - Basics for background image, music/sounds, flow control using wait
11.27.11 - Initial creation
```