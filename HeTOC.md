# Table-of-Contents File #

---

> If you have a long story to tell, you'd normally want to split it into chapters or acts or even books. The TOC file you specified earlier tells the engine where to look for these chapters. (Note: the TOC keyword is required by the engine and should not be modified.)

```
    TOC = [
    	// place contents here
    ];								
```

> In the sample below, I have 5 chapters that I added into the table. Note that the filename is arbitrary and can be anything descriptive for you.

```
    TOC = [
    	"include/story-prelude.js",
    	"include/story-chapter1.js",
    	"include/story-chapter2.js",
    	"include/story-chapter3.js",
    	"include/story-chapter4.js"
    ];								
```

> Update: As of version 0.1.2, a global [configuration file](HeConfig.md) is supported. This basically sets game options, styling, and themes. By putting most configurable options and styling here, the script files are much cleaner. In order to load this configuration file, for lack of a better option, this has to be included in the TOC. See demo files for a sample configuration file.

```
    TOC = [
    	"include/config.js",
    	
    	"include/story-prelude.js",
    	"include/story-chapter1.js",
    	"include/story-chapter2.js",
    	"include/story-chapter3.js",
    	"include/story-chapter4.js"
    ];								
```

## Customization ##

> Every game is unique. Oftentimes, you'd need functionalities not present in the core engine. Or a modification of a standard method. You can do this thru macros and plug-ins.

> To keep your main script clean, it is recommended that you put all macros and plug-ins on a separate file. Then add this to the TOC.

> Update: As of version 0.4.0, you may also add modpacks to the TOC.:

```
TOC = [
	"include/config.js",
	"include/macros.js",
	"include/plugins.js",
	"include/modpack.js",
	
	"include/story-prelude.js",
	"include/story-chapter1.js",
	"include/story-chapter2.js",
	"include/story-chapter3.js",
	"include/story-chapter4.js"
];	
```