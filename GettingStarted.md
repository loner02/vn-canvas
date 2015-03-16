<font size='5'>GETTING STARTED WITH vn-canvas!</font>

---



---

Wanna make your own visual novel with vn-canvas? This guide will show you the workings of a simple visual novel story that can be used as basis for your own working story!

# Requirements #
  * Of course, you need to download the [latest build](http://code.google.com/p/vn-canvas/downloads/list) of vn-canvas!
  * An HTML editor (Notepad or other substitute)
  * Some resources<sup>†</sup> (given in here, or make your own)
  * Your imagination<sup>††</sup> and a little patience!

<sup>†</sup> Resources of course are the images, sounds and videos for the game
<sup>††</sup> Since this is a tutorial, you could just copy these

# Let's Get Started! #
Now that we have the things needed, we can now extract the vn-canvas package (the ZIP file) to your folder of choice.
## Making the Project folder ##

> You can get started by copying the 'templates' folder and name it something else like 'Novel' or similar.

> The folder would contain the following...

| **FILE** | **What it is?** |
|:---------|:----------------|
|canvastext-0.4.1.mod.js|the modified `canvastext` javascript library|
|gpl-3.0.txt<br>lgpl-3.0.txt<table><thead><th>The licenses for this engine (GNU GPL & GNU Lesser GPL)</th></thead><tbody>
<tr><td>vncanvas-0.x.js<br>...</td><td>The vn-canvas engine! (We use the newest, greatest one, of course)</td></tr>
<tr><td>vnchapter.js</td><td>The default chapter file (which will be explained in a moment...)</td></tr>
<tr><td>vnconfig.js</td><td>A config file (also explained in a moment)</td></tr>
<tr><td>vnmod-rpg-0.x.js</td><td>The RPG add-on</td></tr>
<tr><td>vnplugins.js</td><td>Custom plugins! (see <a href='Plugins.md'>Plug-ins explained</a> for details)</td></tr>
<tr><td>vntemplate.html</td><td>The main HTML file! (our VN)</td></tr>
<tr><td>vntoc.js</td><td>The <a href='HeTOC.md'>table of contents file</a> (we will delve here in a bit...)</td></tr></tbody></table>

<blockquote>Inside the HTML file (by opening it on Notepad, or any other editor), we see bunch of HTML codes. Very complicated isn't it? Well, we can reduce that to chunks in order for you to understand (although this very complicated, this is actually straightforward HTML with the exception of <code>canvas</code> of course.):</blockquote>

<h3>Head</h3>
<pre><code>&lt;!DOCTYPE html&gt;<br>
&lt;html lang="en"&gt;<br>
  &lt;head&gt;<br>
    &lt;meta charset="utf-8" /&gt;<br>
    &lt;title&gt;Game Title&lt;/title&gt;<br>
    &lt;meta name="description" content="Description of the game." /&gt;<br>
    &lt;link rel="stylesheet" href="style.css" /&gt;<br>
  &lt;/head&gt;<br>
</code></pre>

<blockquote>You can edit the description and game title for your liking, for now, we can start with <code>"Sample VN"</code> as title. You can even remove the <code>description</code> meta if you want.</blockquote>

<blockquote>You can also use a CSS style sheet to customize the windows and stuff.</blockquote>

<h3>The canvas</h3>
<pre><code>  &lt;body&gt;<br>
    &lt;div style="text-align: center;"&gt;<br>
      &lt;canvas id="stage" width="720" height="480" style="border:1px solid black" oncontextmenu="return false;" onselectstart="return false;"&gt;<br>
        Your browser does not appear to support HTML5.  Try upgrading your browser to the latest version.&lt;br/&gt;<br>
        &lt;a href="http://www.microsoft.com/windows/internet-explorer/default.aspx"&gt;Microsoft Internet Explorer&lt;/a&gt;&lt;br/&gt;<br>
        &lt;a href="http://www.mozilla.com/firefox/"&gt;Mozilla Firefox&lt;/a&gt;&lt;br/&gt;<br>
        &lt;a href="http://www.google.com/chrome/"&gt;Google Chrome&lt;/a&gt;&lt;br/&gt;<br>
        &lt;a href="http://www.apple.com/safari/download/"&gt;Apple Safari&lt;/a&gt;&lt;br/&gt;<br>
        &lt;a href="http://www.google.com/chromeframe"&gt;Google Chrome Frame for Internet Explorer&lt;/a&gt;&lt;br/&gt;<br>
      &lt;/canvas&gt;<br>
    &lt;/div&gt;<br>
</code></pre>

<blockquote>This part is the <code>canvas</code> or the stage of our game - specifically this code:<br>
<pre><code>&lt;canvas id="stage" width="720" height="480" style="border:1px solid black" oncontextmenu="return false;" onselectstart="return false;"&gt;<br>
</code></pre>
It will create a rectangular box on your browser with the name of <code>"stage"</code> with the resolution of 720x480. If the browser that we use doesn't support HTML 5, it will show a disclaimer instead, telling the user to upgrade or change to another browser (most modern browsers though are now compatible with HTML 5.)</blockquote>

<h3>The scripts</h3>
<pre><code>    &lt;script src="vntoc.js"&gt;&lt;/script&gt;<br>
    &lt;script src="canvastext-0.4.1.mod.js"&gt;&lt;/script&gt;<br>
    &lt;script src="vncanvas-0.3.js"&gt;&lt;/script&gt;<br>
    &lt;script&gt;<br>
      window.onload = function() {<br>
        Stage.Init("stage", 720, 480);<br>
        Stage.script.Init(chapter1);<br>
      }<br>
    &lt;/script&gt;<br>
  &lt;/body&gt;<br>
&lt;/html&gt;<br>
</code></pre>

<blockquote>This is where everything gets cooking. This is the heart of our game. The javascript files are loaded here along with the code that indicates where is the <code>canvas</code> stage and what story script <i>label</i> that we start the game with. The <code>vntoc.js</code> is the "table of contents" file where it will load the config file and the chapter files. This needs to be declared in the HTML file ahead so that the files in the TOC will be recognized by our engine.</blockquote>

The TOC file is next in our agenda... so let's get going!<br>
<br>
<h1>Preparing the code</h1>

<h2>Making a table of content file</h2>

We need a table of content file to organize our little game. We make the javascript file <code>vntoc.js</code> in our 'Novel' folder. In the <code>vntoc.js</code> file, we place the <code>TOC</code> keyword and syntax.<br>
<br>
<pre><code>    TOC = [<br>
        // place contents here<br>
    ];            <br>
</code></pre>

We place our individual chapter javascript files in this TOC set (along with plugin and macros). This will be recognized by the engine as the content of our game which we can control. Arrangement of the chapters is not considered here as long as these are available for the engine to be utilized.<br>
<br>
Since we only have one table of contents file, we indicate it here like so:<br>
(don't forget the double-quotes)<br>
<br>
<pre><code>    TOC = [<br>
        "vnchapter.js"<br>
    ];            <br>
</code></pre>

<i>TO BE CONTINUED...</i>