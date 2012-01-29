// Define as many themes as you like here
Theme1 = {
	// Canvas Form
	//	default form style
	formStyle:			"bold 16px 'Courier New' #404040",
	//	tooltip style
	formTipStyle:		"normal 12px sans-serif black",
	// 	tooltip background color
	formTipColor:		"#FFFFE0",
	//	element default background color
	formElementBack:	"#FFFFE0",

	// Script/Dialog Box
	// 	default font style
	boxFontStyle:		"normal 14px Verdana white",		
	//	dim box background
	// 		if only one color, solid fill
	// 		if two colors, gradient fill
	boxDimStyle:		"#808080 #000000",
	// 	name tag style	
	boxTagStyle:		"bold 14px Verdana #c8ffc8",
	// 	menu hilite color	
	boxMenuHilite:		"#404040",
}

// Globals for configuration
Config = {
	// Specify theme list
	//	add all defined themes in themeList
	//	declare as name-theme pair
	themeList:			["Default Theme", Theme1],
	//	specify a startup theme
	activeTheme:		Theme1,

	// Volume
	// 	value is 0 to 1; set 0 to mute
	volumeAudio:		0.9,
	volumeVideo:		0.9,
	
	// Script/Dialog Box
	//	note: allowing user to change box dimensions might
	//		affect dialog, eg. if user set box too small, 
	//		some dialogs might not show; hence, this is not
	//		added as part of configurable theme,  
	boxWidth:			0.75,
	boxHeight:			0.25,
	boxFullHeight:		0.875,
	//  scroll speed relative to a preset speed
	boxScrollSpeed:		1.0,
	
	// Actors
	// 	show actor avatar in script box	
	actorShowAvatar:	true,
	//	emulate depth perspective when mouse move
	actorPerspective:	true,
	//	actor vertical position
	//		<1.0 is above bottom level of viewport
	//		1.0 is at bottom level of viewport
	//		>1.0 may be needed if actorPerspective is true
	actorYPosition:		1.0
	
	// Movie
	// 	relative to viewport, from 0 to 1
	movieSize:			0.75,

	// Transitions/Effects
	// 	duration in seconds
	// 	set to 0 for no transition times
	transTime:			1.0,
	
	// Gameplay Settings
	// 	this setting filters mature content
	gameMatureFilter:	true,
	//	list of filtered words if gameMatureFilter is on
	gameBadWords:		["fuck", "wank", "shit", "pussy", "cunt", "dick"],
	//	replacement text for auto filtered words
	gameAltWord:		"****",
}