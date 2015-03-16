# Configuration File #

---

> Contains configuration options and any number of theme sets.

> For a sample, see configuration file template.
> More options to follow in future versions.

| **Themes Parameter** 	| **Description** |
|:----------------------|:----------------|
| `formStyle` |	The default styling for the canvas forms. |
| `formTipStyle` | The default styling for tool tips. |
| `formTipColor` | The default background color for tool tips. |
| `formElementBack`     | The default background color for non-image elements. |
| `boxFontStyle` | The default font styling for the dialog box. |
| `boxDimStyle` | The default solid or gradient fill for the dim-style dialog box. |
| `boxImageStyle` | The default image file for the image-back dialog box. |
| `boxTagStyle` | The default font styling for the actor name tag shown on the dialog box. |
| `boxMenuHilite` | The default highlight color for the menu (options) on the dialog box. |
| `balloonFillStyle` | The default fill style for the speech balloon. |
| `balloonStrokeStyle` | The default outline style for the speech balloon. |
| `automapMask` |The default fill color for hidden automap positions. |
| `automapPointer` | The default fill and stroke color for the automap pointer.|


| **Config Parameter** |	**Description** |
|:---------------------|:----------------|
| `themeList` 	| The listing for all supported themes. This configuration variable can <br>be used by dropdown elements in a form to display available <br>themes. Declare as name-theme pair.<br> (eg. <code>["Simplify", Theme1,]</code>) <br>
<tr><td> <code>activeTheme</code> 	</td><td> The currently active theme. </td></tr>
<tr><td> <code>volumeAudio</code> 	</td><td> The maximum volume for all audio sounds. </td></tr>
<tr><td> <code>volumeVideo</code> 	</td><td> The maximum volume for all videos. </td></tr>
<tr><td> <code>boxWidth</code> 	</td><td> The width of the default dialog box relative to viewport width. </td></tr>
<tr><td> <code>boxHeight</code> 	</td><td> The height of the default dialog box relative to viewport height. </td></tr>
<tr><td> <code>boxFullHeight</code> </td><td> The height of the full dialog box relative to viewport height. </td></tr>
<tr><td> <code>boxScrollSpeed</code> </td><td> The speed of the scrolling text relative to a preset speed. The higher<br> the value, the faster the scrolling. </td></tr>
<tr><td> <code>balloonWidth</code> 	</td><td> The width of the speech balloon relative to viewport width. </td></tr>
<tr><td> <code>balloonHeight</code> </td><td> The height of the speech balloon relative to viewport height. </td></tr>
<tr><td> <code>actorShowAvatar</code> </td><td>	Show the actor avatar on the dialog box. </td></tr>
<tr><td> <code>actorPerspective</code> </td><td>	Emulate depth perspective on mouse move. If you intend to make the<br> visual novel for mobile devices (eg. iPad or Android-based tablets), <br>you may want to disable this.</td></tr>
<tr><td> <code>actorYPosition</code> </td><td>	The vertical position of the actor sprite relative to viewport height. A<br> value of 1 pins the actor at viewport bottom. <br>If <code>actorPerspective</code> is on, a value > 1 is recommended. </td></tr>
<tr><td> <code>audioFormat</code> 	</td><td> The audio formats supported. </td></tr>
<tr><td> <code>movieSize</code> 	</td><td> The video size relative to the viewport.</td></tr>
<tr><td> <code>movieOnCanvas</code> 	</td><td> Plays video on canvas. So far, some mobile devices do not support<br> direct video file playing on canvas.</td></tr>
<tr><td> <code>movieFormat</code> 	</td><td> The video formats supported. </td></tr>
<tr><td> <code>transTime</code> 	</td><td> The approximate number of seconds for transitions. </td></tr>
<tr><td> <code>gameAllowMacro</code> 	</td><td> Allows custom game-specific javascript to execute. </td></tr>
<tr><td> <code>gameAllowPreload</code> 	</td><td> Allows game-specific resource preloading. </td></tr>
<tr><td> <code>gameAllowLookAhead</code> 	</td><td> As an alternative to specified or automatic preloading, this allows <br>"look ahead" to look for the next or most immediately needed <br>resources for preloading while the game is idle. </td></tr>
<tr><td> <code>gameNamedCheckpts</code> 	</td><td> Allows use of named checkpoints </td></tr>
<tr><td> <code>gameMatureFilter</code> 	</td><td> Filtering for mature content. </td></tr>
<tr><td> <code>gameBadWords</code> 	</td><td> In addition to manual filtering using "jump", this list the words that<br> are automatically filtered if gameMatureFilter is on. The word is <br>replaced by <code>gameAltWord</code>. </td></tr>
<tr><td> <code>gameAltWord</code> 	</td><td> The text to replace automatically filtered words. </td></tr></tbody></table>

<h2>Configuration File Sample</h2>

<blockquote>Here is a sample configuration file (<code>demo_config.js</code>) used from the demo VN. Here, theme elements are created (<code>Theme1</code> and <code>Theme2</code>). The rest are all configuration proper.</blockquote>

<pre><code>// Globals for configuration<br>
Theme1 = {<br>
	formFontStyle:		"bold 16px 'Courier New' #404040",<br>
	formElementBack:	"#FFFFE0",<br>
	formTipColor:		"#FFFFE0",<br>
	formTipStyle:		"normal 12px sans-serif black",<br>
	<br>
	boxFontStyle:		"bold 16px 'Courier New' white",<br>
	boxDimStyle:		"#000000 #808080",<br>
	boxImageStyle:		null,<br>
	boxTagStyle:		"bold 18px Verdana #c8ffc8",<br>
	boxMenuHilite:		"#c08040",<br>
	<br>
	balloonFillStyle:	"#000000 #808080",<br>
	balloonStrokeStyle: "#FFFFFF",<br>
	<br>
	automapMask:		"C0C0C0",<br>
	automapPointer:		"#FF0000 #000000"<br>
}<br>
<br>
Theme2 = {<br>
	formFontStyle:		"normal 16px Arial #404040",<br>
	formElementBack:	"#FFFFE0",<br>
	formTipColor:		"#FFFFE0",<br>
	formTipStyle:		"normal 12px sans-serif red",<br>
	<br>
	boxFontStyle:		"bold 16px Verdana white",<br>
	boxDimStyle:		"#800000 #808080",<br>
	boxImageStyle:		"demo/box-image.png",<br>
	boxTagStyle:		"bold 18px Verdana #ff8000",<br>
	boxMenuHilite:		"#c08040",<br>
<br>
	balloonFillStyle:	"#800000 #808080",<br>
	balloonStrokeStyle: "#FF0000",<br>
<br>
	automapMask:		"C0C0C0",<br>
	automapPointer:		"#FF0000 #000000"<br>
}<br>
<br>
Config = {<br>
	// Themes<br>
	themeList:		["Simplify", Theme1, <br>
				"Radical", Theme2],<br>
	activeTheme:		Theme1,<br>
<br>
	// Volume<br>
	volumeAudio:		0.9,<br>
	volumeVideo:		0.9,<br>
	<br>
	// Script Box<br>
	boxWidth:			0.75,<br>
	boxHeight:			0.25,<br>
	boxFullHeight:		0.875,<br>
	boxScrollSpeed:		1.0,<br>
	balloonWidth:		0.5,<br>
	balloonHeight:		0.2,<br>
<br>
	// Actors<br>
	actorShowAvatar:	true,<br>
	actorPerspective:	true,<br>
	actorYPosition:		1.125,<br>
<br>
	// Audio<br>
	audioFormat:		["mp3", "ogg"],<br>
<br>
	// Movie<br>
	movieSize:			0.75,<br>
	movieOnCanvas:		true,<br>
	movieFormat:		["mp4", "ogv"],<br>
	<br>
	// Transitions<br>
	transTime:			1.0,<br>
	<br>
	// Gameplay<br>
	gameMatureFilter:	true,<br>
	gameBadWords:		["fuck", "wank", "shit", "pussy", "cunt", "dick"],<br>
	gameAltWord:		"****",<br>
	gameAllowMacro:		true,<br>
	gameAllowPreload:	true,<br>
	gameNamedCheckpts:	false,<br>
	gameAllowLookAhead: true,<br>
}<br>
<br>
<br>
</code></pre>