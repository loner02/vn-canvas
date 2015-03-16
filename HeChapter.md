# Chapter File #

---

> Alright, time to get to writing the story script (not to be confused with javascript). The structure is similar to TOC, except that it's a bit more complex than adding filenames. First, assign a title to it (something descriptive of course, for your sake). Say we want to name it CHAP1.

```
CHAP1 = [
	// place contents here
];								
```

> Now to add items to the script, we use the keyword-value pairs which tells the engine what to display, show, or whatever action the keyword defines.

```
CHAP1 = [
	keyword1, param1,
	keyword2, param2,
	keyword3, param3,
	...
];								
```

> For example, the following displays a background image and plays a background music.

```
CHAP1 = [
	label, "CHAP1",
	scene, {image:"background_image.jpg"},
	audio, {bgm:"background_music"},
	...
];								
```

> _**Update:** If local saving is required, the first keyword-value pair should be a label identifying the script sequence, and should be equivalent to the script name. In this case, it is "CHAP1". See also "checkpoint" keyword._

> _**Update:** Due to version changes, it is highly recommended that the first keyword-value pair in any script sequence be a label._

> Now all we have to do is to save this to a file (e.g. story-chapter1.js), then make sure to add it to the TOC. The TOC doesn't have to be in chapter order, but it would be good practice to keep things organized.

```
    TOC = [
        "include/story-prelude.js",
        "include/story-chapter1.js",
        "include/story-chapter2.js",
        "include/story-chapter3.js",
        "include/story-chapter4.js"
    ];      
```

## Setting the Entry Point ##

> Lastly, remember Stage.script.Init() where we specify the entry point of the story? If we want CHAP1 to be the entry point, we set it as the argument of Stage.script.Init(). Note, no quotes, since we're passing the object itself, not a string.

```
    <script>
      window.onload = function() {
        Stage.Init("stage", 720, 480);
        Stage.script.Init(CHAP1);
      }
    </script>
```

## Switching from chapter-to-chapter using JUMPS ##

> If you have multiple chapter files, each with it's own story script, you can link them using [jumps](FlowJumps.md). Say for example we wanted to switch from CHAP1 to CHAP2, another chapter script, when the user (say) picked a choice; we could use jumps to switch to another chapter:

```
CHAP1 = [
         label, "prelude",
         ...
         jump, "CHAP2#start", //The JUMP command... note the hash sign.
         ...
];

CHAP2 = [
         label, "start" //<--JUMP will switch the control to this label of this chapter.
];
```