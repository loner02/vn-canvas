<font size='5'> <b>Preloading</b> </font>

Using the function `preload`, you can immediately load some resources on the background to prevent slow down of the game. But this also depends on the player's bandwidth and rowser, therefore use preloading wisely.

# The `preload` function #

Preloads some image, audio and/or video resources.
Note: Requires enabling of `'gameAllowPreload'` in configuration file.

> A word about preloading:

> This engine is designed such that resources are loaded as needed. However, in some cases, the game developer might want to preload 'large' resources in order to further reduce lag time. To do this, the said resource must be preloaded way before they are to be used and while there is no considerable CPU/memory activities.
> While images are easily preloaded, audio and video elements are a bit more complicated. The engine uses the 'preload' attribute, but different browsers may have different implementations. Also, some platforms do not support preloading at all.
> In addition, it may also be a local setting whether the browser will use a cached resource or fetch it from a server. Even if the resources were preloaded, the browser may still choose to download from the server when it's time to access the resource. So, make sure to check local settings.
> An alternative would be to use a Cache Manifest, but that is beyond the scope of the engine.

## Syntax ##

| `preload, "auto"` | If 'auto' is given, the chapter script/sequence is searched from the current frame for preloadable<br> resources. Only 'scene', 'overlay' and 'actor' images, 'audio' and 'video' resources are supported,<br> as these are the most likely elements with 'large' resources. Use with caution. <br>
<tr><td> <code>preload, [list_of_resources]</code> </td><td> Use the given list to preload. </td></tr></tbody></table>

## Example ##

> Game resources are preloaded as shown.
```
chapter = [
	...
	/* 3 resources are preloaded */
	preload, ["image1.png", "audio1.ogg", "video1.mp4"],
	...
	/* resources within this 'chapter' are searched and preloaded */
	preload, "auto"
]
```