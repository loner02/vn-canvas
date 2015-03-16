<font size='5'> <b>Plug-ins Explained</b> </font>

---



---

> Plugins allow game-specific customization without modifying the engine.

> _**Note:** For advanced users. Javascript and canvas drawing knowledge required._<br>
<blockquote><i>Currently supports Transitions and Atmospheric effects, and Canvas Form elements.</i><br><br>
<i><b>Update:</b> Now supports character stats.</i></blockquote>

<h2>Atmospheric Effects</h2>

<blockquote>Want to define a custom atmospheric effect? Then add an atmospheric effect plug-in. First, start with a template code snippet.</blockquote>

<pre><code>    AtmoEffects.my_custom_atmo = {<br>
      _init: function(obj, param) {<br>
        // Place initialization here<br>
      },<br>
      _update: function(obj, elapsed) {<br>
        // Place update code here<br>
      },<br>
      _draw: function(obj) {<br>
        // Place draw code here<br>
      },<br>
    };<br>
</code></pre>


<ul><li><code>my_custom_atmo</code> is the name of your custom atmospheric effect.<br>
</li><li><code>_init</code> method is called once to perform specific initialization.<br>
</li><li><code>_update</code> method is called every frame.<br>
</li><li><code>_draw</code> method is called if a redraw is necessary.<br>
</li><li><code>obj</code> is a reference to the atmosphere object.<br>
</li><li><code>elapsed</code> is the amount of time in milliseconds since last update.<br>
</li><li><code>param</code> refers to the parameters as entered in the script line.</li></ul>

<blockquote>Before continuing, it is necessary to know the following variables common to all atmospheric effects. Your custom effect may use any of these variables. To access these variables, don't forget to use <code>'this'</code>.</blockquote>

<pre><code>    action:     usually 'start' or 'stop'<br>
    alpha:      the opacity of the drawn elements (from 0.0 or transparent to 1.0 or opaque).<br>
    context:    the canvas context to draw on to.<br>
    isready:    true means the effect has completed initialization. If loading images, for<br>
    		example, set this initially to false, then set it to true once the image has loaded.<br>
    redraw:     true means that a redraw is necessary. <br>
    saveparam:  custom object used for game saves. This will be used as the parameters when the<br>
    		effect is loaded during game load. By default, this is the same as the parameter when<br>
    		the effect is invoked in the scriptline.<br>
    type:       the type of effect (usually the effect name).<br>
    update:     false pauses update of the stage while the effect is drawing. Default is always true.<br>
    visible:    if false, effect is not drawn.<br>
</code></pre>


<blockquote>As an example, let's define a custom effect named 'sample_atmo_fx' that just displays an image. (The sample shown is a simplified code. For the default effects, see engine code.)</blockquote>

<pre><code>    AtmoEffects.sample_atmo_fx = {<br>
      _init: function(obj, param) {<br>
        obj.isready = false;<br>
        // define a new image element<br>
        obj.image = new Image();	<br>
        obj.src = param.sample_atmo_fx;<br>
        obj.image.onload = function() {<br>
          obj.isready = true;<br>
        };<br>
        obj.image.src = this.src;<br>
    	<br>
        // the effect is invoked with another parameter sample_arg<br>
        obj.sample_arg = param.sample_arg;<br>
      },<br>
      _update: function(obj, elapsed) {<br>
        if (obj.action == 'stop') {<br>
          // do some updates here to stop the effect<br>
          // if stopping made the effect invisible<br>
          obj.visible = false;<br>
        }<br>
        else {<br>
          // do some updates here to update the effect<br>
          obj.redraw = true;		// a redraw is needed<br>
        }<br>
      },<br>
      _draw: function(obj) {<br>
        // effect is drawn if isready and redraw are true<br>
        obj.context.drawImage(this.image, 0, 0);<br>
      },<br>
    };							<br>
</code></pre>

<blockquote>Finally to invoke the custom atmosphere, see 'atmosphere' keyword.</blockquote>

<pre><code>    chapter = [<br>
<br>
    	...<br>
    	/* the first parameter must be the atmosphere effect */<br>
    	atmosphere, {sample_atmo_fx:"image.png", sample_arg:dummy},<br>
    	...<br>
    ];<br>
</code></pre>


<h2>Transition Effects</h2>

<blockquote>Transition effects are used by actors, overlay and scene images. Unlike atmospheric effects, these are methods called within the Update() method of an object.<br>
First, start with a template code snippet.</blockquote>

<pre><code>    TransEffects.my_custom_fx = {<br>
      _init: function(obj, param) {<br>
        // Place initialization here<br>
      },<br>
      _in: function(obj, elapsed) {<br>
        // Place show transition code here<br>
      },<br>
      _out: function(obj, elapsed) {<br>
        // Place hide transition code here<br>
      },<br>
    };<br>
</code></pre>


<ul><li><code>my_custom_fx</code> is the name of your custom transition effect.<br>
</li><li><code>_init</code> method is called once to perform specific initialization. This is optional.<br>
</li><li><code>_in</code> method is called every frame for showing transitions (such as fade-in).<br>
</li><li><code>_out</code> method is called every frame for hiding transitions (such as fade-out).<br>
</li><li><code>obj</code> is the object calling the transtion.<br>
</li><li><code>elapsed</code> is the time in milliseconds since last update.<br>
</li><li><code>param</code> is an array of parameters depending on the effect.</li></ul>

<blockquote>Before continuing, it is necessary to know the following variables common to applicable objects. Your custom effect may use any of these variables. These variables are passed thru the <code>'obj'</code>parameter.</blockquote>

<pre><code>    alpha:      the object's opacity (from 0.0 to 1.0)<br>
    drawn:      this indicates that the effect has finished drawing. Use this to control script updates.<br>
    		If set to true while the effect is ongoing, the next line of script is executed even when the<br>
    		transition is ongoing. If set to true at the end of transition, the next line of script is<br>
    		executed only at end of transition.<br>
    effects:    the active transition effect. Set this to 'done' once the effect is finished.<br>
    pos:        the object's vector position (x and y coordinates are pos.vx and pos.vy, respectively)<br>
    target_pos: the object's target vector position<br>
    redraw:     true means that a redraw is necessary.<br>
    rotation:   the object is rotated using this (default is 0).<br>
    scale:      the object is scaled using this (default is 1.0).<br>
    visible:    if false, the object is not drawn.<br>
    wait:       if true, wait for effect to complete before proceeding. See also 'drawn'.<br>
</code></pre>

<blockquote>As an example, let's define a custom effect named 'translate' that moves the object from its current position. (The sample below is a simplified version of actual translate effect. For more of the default effects, see engine code.)</blockquote>

<pre><code>    TransEffects.translate = {<br>
      _init: function(obj, param) {<br>
        //offset the target position based on parameter given<br>
        obj.target_pos.vx += parseFloat(param[0]);<br>
        obj.target_pos.vy += parseFloat(param[1]);<br>
      },<br>
      _in: function(obj, elapsed) {<br>
        //start the effect<br>
        obj.visible = true;<br>
        obj.redraw = true;<br>
        if (!obj.wait) obj.drawn = true;<br>
        obj.alpha = 1.0;<br>
        if (/* place end condition here */) {<br>
          obj.effects = 'done';<br>
          obj.drawn = true;<br>
        }<br>
        else {<br>
          // perform translation here<br>
        }<br>
      },<br>
      _out: function(obj, elapsed) {<br>
        //translate_out doesn't actually make sense<br>
        //just hide the object<br>
        obj.alpha = 0.0;<br>
        obj.visible = false;<br>
        obj.effects = 'done';<br>
        obj.drawn = true;<br>
        obj.redraw = true;<br>
      },<br>
    };<br>
</code></pre>

<blockquote>Finally to invoke the custom transition effect, see corresponding object keyword.</blockquote>

<pre><code>    chapter = [<br>
<br>
    	...<br>
    	/* this creates an overlay and moves it 100px to the right<br>
    	and down relative to current position (which is center<br>
    	by default */<br>
    	overlay, {src:"image.png", effect:"translate 100 100"},<br>
    	...<br>
    ];<br>
</code></pre>


<h2>Canvas Forms Elements</h2>

<blockquote>Canvas forms provide a way to implement graphical interface to the player. The engine supports 'button' (which can also be used as a simple label or a clickable image map), 'picture' and 'timer'. But not all games are the same. What if you need to add a custom element?<br>
First, start with a template code snippet. Note the similarity with AtmoEffects.</blockquote>

<pre><code>    CformElements.my_custom_element = {<br>
      _init: function(obj, param) {<br>
        // Place initialization here<br>
      },<br>
      _update: function(obj, elapsed) {<br>
        // Place update code here<br>
      },<br>
      _draw: function(obj) {<br>
        // Place draw code here<br>
      },<br>
    };<br>
</code></pre>


<ul><li><code>my_custom_fx</code> is the name of your custom cform element.<br>
</li><li><code>_init</code> method is called once to perform specific initialization.<br>
</li><li><code>_update</code> method is called every frame.<br>
</li><li><code>_draw</code> method is called if a redraw is necessary.<br>
</li><li><code>obj</code> is a reference to the cform element.<br>
</li><li><code>elapsed</code> is the time in milliseconds since last update.<br>
</li><li><code>param</code> refers to the parameters as entered in the script line.</li></ul>

<blockquote>Before continuing, it is necessary to know the following variables common to cform elements. Your custom effect may use any of these variables. These variables are passed thru the <code>'obj'</code> parameter. Of course, you can also use custom variables if any.<br>
Note also that all cform elements belong to the ActiveImage class. The ActiveImage class handles the creation of the drawable elements, so you don't need to worry about it when making the custom element.</blockquote>

<pre><code>    type:       the type of element<br>
    link:       the link to follow or execute, if present<br>
    sprites:    array containing the image objects of the element<br>
    showText:   determines if the text of the element is displayed<br>
    timeout:    if element is timed, this sets the duration<br>
    redraw:     true means that a redraw is necessary.<br>
    saveparam:  custom object used for game saves. This will be used as the parameters when the<br>
    		cform element is loaded during game load. By default, this is the same as the <br>
    		parameter when the element is invoked in the scriptline.<br>
</code></pre>


<blockquote>In addition, you may need to know two methods of the ActiveImage class.<br>
<pre><code>    Create(id, rect, obj)     : handles creation of the cform element<br>
    			      : id is the identifier of the cform element<br>
    			      : rect is the dimensions of the cform element (see Rect class). <br>
                                If image based, w and h are ignored.<br>
    			      : obj is the array of image sprites or fillstyle for the cform <br>
                                element. <br>
    DrawImageOrFill(object)   : handles drawing or filling the cform element<br>
    			      : object is usually an element of the 'obj' array<br>
    								<br>
</code></pre></blockquote>

<blockquote>As an example, let's define a custom element named <code>'progressBar'</code> that reflects the value of a user variable. (see Timed Test for live demo)</blockquote>

<pre><code>    CformElements.progressBar = {<br>
      _init: function(obj, param) {<br>
        //create the progressBar appearance<br>
        var rect = {x:param.x, y:param.y, w:param.w, h:param.h};<br>
        var sprites = ['gray', 'orange'];<br>
        obj.Create(param.name, rect, sprites);<br>
        // note: param.name can now be accessed as obj.id<br>
        <br>
        // set user variable for the progress bar value<br>
        // user variable with id=param.name must be created beforehand<br>
        obj.timeout = param.timeout;<br>
        Helper.setValue(param.name, obj.timeout);<br>
        <br>
      },<br>
      _update: function(obj, elapsed) {<br>
        //create a 1 second timer<br>
        if (!obj.aTimerOn) {<br>
          this.aTimer = setTimeout(function() {<br>
            // decrement timeout counter<br>
            Helper.setValue(obj.id, Helper.getValue(obj.id)-1);<br>
            obj.redraw = true;<br>
            if (Helper.getValue(obj.id) &gt; 0)<br>
              obj.aTimerOn = false;<br>
          }, 1000 );<br>
          obj.aTimerOn = true;<br>
        }<br>
      },<br>
      _draw: function(obj) {<br>
        //draw progressBar back<br>
        obj.DrawImageOrFill(obj.sprites[0]);<br>
        // manually draw the progress bar since this is scaled<br>
        var scale = (obj.timeout - Helper.getValue(obj.id))/obj.timeout;<br>
        obj.context.fillStyle = obj.sprites[1];<br>
        obj.context.fillRect(0,0, scale*obj.context.canvas.width, obj.context.canvas.height);<br>
      },<br>
    };<br>
    								<br>
</code></pre>

<blockquote>Finally to invoke the custom canvas form element (inside a 'cform' call), use the 'cfelement' keyword. The only required parameters are 'type' which identifies the type of cform element and 'name' which is the id of the cform element. The rest depends on how we choose to implement the custom element.</blockquote>

<pre><code>    chapter = [<br>
    	...<br>
    	set, {Waiting:0},<br>
    	...<br>
    	cfelement, {type:"progressBar", <br>
    		    name:"Waiting", <br>
    		    x:260, y:300, w:200, h:20, <br>
    		    timeout:10},<br>
    	...<br>
    ];<br>
</code></pre>


<h2>Character Stats</h2>

<blockquote>Character stats add another dimension to your characters. If you're going for RPG-like characters, you may want to add stats like level, strength, agility, etc. If you want character inter-personal development, you may want to add stats like personality, relationship, etc.<br>
Since the options are limitless, this plug-in merely lets you define a base set of stats applicable to all actors you define in the game. How you'd use the stat in the game or how you let it grow or how you'd define a custom stat for a specific actor depends entirely up to you. You may need use of 'macro' or custom scripting.<br>
First, start with the stats attribute objects.</blockquote>

<pre><code>    Stats.attribute = {<br>
      _value: [],<br>
      _update: function(obj, stat) {<br>
      },<br>
    };							<br>
</code></pre>

<ul><li>The <code>'_value'</code> array specifies the list of allowable values.<br>
</li><li>If the attribute is numerical, specify a min-max range.<br>
</li><li>If the attribute is boolean, specify true or false.<br>
</li><li>If the attribute is string, enumerate the string values.<br>
</li><li>The first entry is the default value of the attribute.<br>
<pre><code>    Stats.attrNumber = {<br>
      _value: [0, 100],<br>
      _update: function(obj, stat) {<br>
      },<br>
    };<br>
    Stats.attrBoolean = {<br>
      _value: [true, false],<br>
      _update: function(obj, stat) {<br>
      },<br>
    };<br>
    Stats.attrString = {<br>
      _value: ["string1", "string2", "string3"],<br>
      _update: function(obj, stat) {<br>
      },<br>
    };<br>
    								<br>
</code></pre></li></ul>

<blockquote>Of course, you might want to use more descriptive attribute names.</blockquote>

<blockquote>Oftentimes, stats are not unrelated, i.e. one stat affects the others. For example, increasing character's strength may mean loss of agility, or increase in affection to one actor may mean a decrease to other actors. To support this, use the optional <code>'_update'</code> method to add these custom functionality.</blockquote>

<pre><code>    Stats.attrNumber1 = {<br>
      _value: [0, 100],<br>
      _update: function(obj, stat) {<br>
        /* obj is the actor object */<br>
        /* stat is the actor's attributes */<br>
        if (stat.attrNumber1 &gt; 50)<br>
          stat.attrNumber2 -= 10;<br>
        /* make sure though that attrNumber2 value is still valid */<br>
      },<br>
    };<br>
    								<br>
</code></pre>

<blockquote>When you create your actors, these stats will be automatically created for the character using the default values. There's no need to explicitly create/set the attributes, unless it is different from the default.</blockquote>

<pre><code>    chapter = [<br>
    	...<br>
    	actor, {id:"actor1", sprite:["normal", "images/actor1-normal.png"], ... },<br>
    	/* the stats are automatically added at this point */<br>
    	...<br>
    ];<br>
</code></pre>


<blockquote>To set or update a character stat, use <code>'set'</code> as you would use for a user variable. The name of the variable, in this case, is <code>'actorId_attrName'</code>. Unlike user variables though, character stats are checked with the <code>Stats</code> object if valid (e.g. within range, string value is an element of the enumeration, etc.). Also, except for numerical attributes, the element index may be specified instead of the value (e.g. to set <code>attrString</code> to <code>'string3'</code>, you can specify <code>'attrString:2'</code> to set to element at index 2).</blockquote>

<pre><code>    chapter = [<br>
    	...<br>
    	actor, {id:"actor1", sprite:["normal", "images/actor1-normal.png"], ... },<br>
    	/* the stats are automatically added at this point */<br>
    	...<br>
    	/* this adds 1 to attrNumber for actor1<br>
    	set, {actor1_attrNumber:"+1"},<br>
    	...<br>
    ];<br>
    								<br>
</code></pre>

<blockquote><i><b>Update:</b> You may use <code>"random"</code> for numerical attributes, but there's no need to specify a min-max range. The value is automatically computed using the <code>'_value'</code> range specified for the attribute.</i></blockquote>

<blockquote>To use actor stats for flow control, you can use conditional <code>'jump'</code> just as you would a user variable.</blockquote>

<pre><code>    chapter = [<br>
    	...<br>
    	jump, {actor1_attrNumber:10, label:"go_to_level10"},<br>
    	/* attrNumber is less than 10 here */<br>
    	...<br>
    	label, "go_to_level10",<br>
    	/* attrNumber is greater than or equal to 10 here */<br>
    	...<br>
    ];<br>
</code></pre>

<h2>Final Note</h2>

<blockquote>As with macros, it is recommended that all plug-ins be placed in one file, then added in TOC.</blockquote>

<pre><code>    TOC = [<br>
    	"include/config.js",<br>
    	"include/plugins.js",<br>
    	<br>
    	"include/story-prelude.js",<br>
    	"include/story-chapter1.js",<br>
    	"include/story-chapter2.js",<br>
    	"include/story-chapter3.js",<br>
    	"include/story-chapter4.js"<br>
    ];<br>
</code></pre>