// Globals for configuration
var Config = {

	// Volume
	// 	value is 0 to 1; set 0 to mute
	volumeAudio:		0.9,
	volumeVideo:		0.9,
	
	// Canvas Form
	formStyle:			"bold 16px 'Courier New' #404040",
	
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
	// 	default box dimensions relative to viewport
	//		standard and full-height
	boxWidth:			0.75,
	boxHeight:			0.25,
	boxFullHeight:		0.875,
	
	// Actors
	// 	show actor avatar in script box	
	actorShowAvatar:	true,
	
	// Movie
	// 	relative to viewport, from 0 to 1
	movieSize:			0.75,

	// Transitions/Effects
	// 	duration in seconds
	// 	set to 0 for no transition times
	transTime:			1.0,
}