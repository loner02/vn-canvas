# The Main HTML file #

---

Although the template already has an HTML file, you can make your own HTML file that can be customized to your liking.

_**Update:** If using 'form', stylesheets are necessary to layout the form._

The following will add a canvas element and insert the necessary scripts needed.

## The canvas Element ##

Now add a canvas element in the page content (between body and /body tags). This one adds a 720-by-480 canvas named "stage" centered on the browser. Modify the name and/or size to your preference.
```
    <div style="text-align: center;">
      <canvas id="stage" width="720" height="480" style="border:1px solid black" oncontextmenu="return false;" onselectstart="return false;">
        Your browser does not appear to support HTML5.  Try upgrading your browser to the latest version.<br/>
      </canvas>
    </div>
```

## The Javascript files ##
Below it, let's add the scripts. First, add your storyline's table of contents (more on this in the TOC section below). You can name the file whatever you like, it doesn't even have to be a **.js file. This one adds table of contents from "include/story-toc.js".**

```
    <script src="include/story-toc.js"></script>
```


Next, add the engine scripts. There are two scripts - one is a modified version of CanvasText, the other one is the core script itself.

```
    <script src="include/canvastext-0.4.1.mod.js"></script>
    <script src="include/vncanvas-0.3.js"></script>
```

## Initialize ##
Lastly, just above the closing body tag, add the following to initialize the stage and read the story script.
These are the only two javascript calls you'll ever need. `Stage.Init()` tells the engine to look for the canvas named "stage" (the one we named earlier) and informs it that the canvas is 720-by-480. `Stage.script.Init()` informs the engine of the story starting point.
```
    <script>
      window.onload = function() {
        Stage.Init("stage", 720, 480);
        Stage.script.Init(chapter1);
      }
    </script>
								
```