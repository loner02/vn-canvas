<font size='5'> <b>Macros Explained</b> </font>

Since vn-canvas is developed in javascript, macros can be made. These macros (little pieces of js code) can be developed to make game logic and minigames, among other things; thereby extending the engine into various uses.

# The `macro` function #

Execute a custom javascript. The custom javascript can be anything from simple game parameter computations to mini-games.

  * **Note:** For advanced users. Requires javascript knowledge.
  * Requires enabling of "gameAllowMacro" in configuration file.

## Syntax ##

| `macro, "function_name"` | Calls a javascript function given by "function\_name". |
|:-------------------------|:-------------------------------------------------------|
| `macro, {function_name:param}` | Update:Calls a javascript function given by "function\_name" and single argument "param".<br> "param" can be a number, string, boolean, array or object. It shall be passed to the macro call. </tbody></table>


<h2>Example ##

First, create a javascript function. This function computes the value of a user variable "var3" from the values of two other variables "var1" and "var2".

```
  
function demo_macro() {
	/* User variables are used since macro does not accept parameters. */
	/* To get value of a user variable, use 'Helper.getValue("variable_name")' */
	var tmp1 = Helper.getValue("var1");
	var tmp2 = Helper.getValue("var2");
	
	/* To set value of a user variable, use 'Helper.setValue("variable_name", value)' */
	Helper.setValue("var3", tmp1+2*tmp2);
	
	/* Note: Helper.getValue and Helper.setValue are predefined methods.
	   These methods do not check for existence, so make sure the user
	   variables are existing prior to access. */
}

function demo_macro_with_parameter(param) {
	/* param is passed here as exactly as defined in the macro call */
}
```

The above function can be added anywhere in the scripts. To be organized though, it is recommended that all macros be placed in one file, e.g. macros.js. Then, add this file to the TOC.

```
TOC = [
	"include/config.js",
	"include/macros.js",
	
	"include/story-prelude.js",
	"include/story-chapter1.js",
	"include/story-chapter2.js",
	"include/story-chapter3.js",
	"include/story-chapter4.js"
];
	
```

Finally to call the macro, just add it to the chapter scripts.

```
chapter = [
	...
	/* Initialize 3 user variables */
	set, {var1:1, var2:2, var3:0},
	/* Call macro */
	macro, "demo_macro",
	/* Result: var3 = 5 */
	...
	/* Call a macro with parameter */
	macro, {demo_macro_with_parameter:[0,1,2,3]},
]

```