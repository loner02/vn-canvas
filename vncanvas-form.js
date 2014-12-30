///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

///////////////////////////////////////////////////////////////////////////////
// Default form elements
///////////////////////////////////////////////////////////////////////////////
// default form elements (sibling layer)
function input(param) {
	var element = document.createElement("input");
	element.name = param.name;
	element.id = param.name;
	if (param.placeholder) element.placeholder = param.placeholder;
	if (param.autofocus) element.autofocus = param.autofocus;
	if (param.bind) {
		if (Helper.getValue(param.bind) != '')
			element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}
function input_label(param, tip) {
	var element = document.createElement("label");
	element.htmlFor = param;
	element.innerHTML = param;
	if (tip) element.title = tip;
	try { return element; }
	finally { element = null; }
}
function textarea(param) {
	var element = document.createElement("textarea");
	element.name = param.name;
	element.id = param.name;
	if (param.placeholder) element.placeholder = param.placeholder;
	if (param.autofocus) element.autofocus = param.autofocus;
	//if (param.rows != null) element.rows = param.rows;
	//if (param.cols != null) element.cols = param.cols;
	if (param.bind) {
		if (Helper.getValue(param.bind) != '')
			element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}
function fieldset(param) {
	var element = document.createElement("fieldset");
	element.id = param;
	try { return element; }
	finally { element = null; }
}
function select(param) {
	var element = document.createElement("select");
	element.name = param.name;
	element.id = param.name;
	
	var opts = (typeof param.options == 'string') ? Helper.getValue(param.options) : param.options;
	for (var i=0; i<opts.length; i+=2) {
		var opt = document.createElement("option");
		opt.innerHTML = opts[i];
		opt.value = JSON.stringify(opts[i+1]);
		element.appendChild(opt);
		if (param.bind) {
			if (opt.value == JSON.stringify(Helper.getValue(param.bind)))
				element.selectedIndex = i/2;
		}
	}	
	if (param.bind) Stage.formBindings.push([param.name, param.bind]);
	try { return element; }
	finally { element = null; }
}
function submit(param) {
	var element = document.createElement("input");
	element.type = "button";
	element.name = param.name;
	element.id = param.name;
	element.value = param.name;
	element.appendChild(document.createTextNode(param.name));
	Helper.addEvent(element, 'click', function(e) {
			if (e.which != 1) return;
			// update bindings here
			for (var idx in Stage.formBindings) {
				var items = document.getElementById(Stage.formBindings[idx][0]);
				if (items.type == "radio") {
					if (items.checked == true) 
						//Helper.setValue(Stage.formBindings[idx][1], JSON.stringify(items.value));
						Helper.setValue(Stage.formBindings[idx][1], items.value.toString());
				}
				else if (items.type == "checkbox") {
					Helper.setValue(Stage.formBindings[idx][1], items.checked);
				}
				else if ((items.type == "range") || (items.type == "number")) {
					Helper.setValue(Stage.formBindings[idx][1], items.valueAsNumber);
				}
				else if ((items.type == "text") || (items.type == "textarea")) {
					//Helper.setValue(Stage.formBindings[idx][1], JSON.stringify(items.value));
					Helper.setValue(Stage.formBindings[idx][1], items.value.toString());
				}
				else if (items.type == "select-one") {
					Helper.setValue(Stage.formBindings[idx][1], JSON.parse(items.value));
				}
				else {
					Helper.setValue(Stage.formBindings[idx][1], items.value);
				}
				items = null;
			}
			// remove form here
			Stage.activeForm.parent.removeChild(Stage.activeForm.newForm);
			Stage.activeForm = null;
			Stage.pause = false;
		}, false);
	try { return element; }
	finally { element = null; }
}
function checkbox(param) {
	var element = document.createElement("input");
	element.type = "checkbox";
	element.name = param.name;
	element.id = param.name;
	element.checked = (param.checked) ? param.checked : false;
	if (param.bind) {
		element.checked = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}
function radio(param) {
	var element = document.createElement("input");
	element.type = "radio";
	element.name = param.name;
	element.id = param.value;
	element.value = param.value;
	element.checked = (param.checked) ? param.checked : false;
	if (param.bind) {
		element.checked = (element.value == Helper.getValue(param.bind));
		Stage.formBindings.push([param.value, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}
function spinbox(param) {
	var element = document.createElement("input");
	element.type = "number";
	element.name = param.name;
	element.id = param.name;
	if (param.min != null) element.min = param.min;
	if (param.max != null) element.max = param.max;
	if (param.step != null) element.step = param.step;
	if (param.value != null) element.value = param.value;
	if (param.bind) {
		element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}
function slider(param) {
	var element = document.createElement("input");
	element.type = "range";
	element.name = param.name;
	element.id = param.name;
	if (param.min != null) element.min = param.min;
	if (param.max != null) element.max = param.max;
	if (param.step != null) element.step = param.step;
	if (param.value != null) element.value = param.value;
	if (param.bind) {
		element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}

// form - create a default HTML form
function form(param) {
	var f = new Form(param[0]);
	var fset = null;
	//f.Create(param[0]);
	for (var i=1; i<param.length; i+=2) {
		// if this element is a fieldset, revert to default fieldset
		if (param[i] == fieldset)
			fset = null;
		// append element to active fieldset
		if ((param[i] == input) || 
			(param[i] == select) || 
			(param[i] == spinbox) ||
			(param[i] == slider) ||
			(param[i] == textarea)) {
			f.AddChild(input_label(param[i+1].name, param[i+1].tip), fset);
		}
		f.AddChild(param[i](param[i+1]), fset);	
		if (param[i] == checkbox) {
			f.AddChild(input_label(param[i+1].name, param[i+1].tip), fset);
		}
		if (param[i] == radio) {
			f.AddChild(input_label(param[i+1].value, param[i+1].tip), fset);
		}
		// if this element is a fieldset, attach succeeding elements to it
		if (param[i] == fieldset)
			fset = param[i+1];
	}
	Stage.activeForm = f;
	Stage.pause = true;
	f = null;
}

function Form(id) {
	this.newForm = document.createElement("form");
	this.newFieldset = document.createElement("fieldset");
	//this.parent = 0;
		
	this.newForm.id = id;
	var x = Stage.canvas.offsetLeft;
	var y = Stage.canvas.offsetTop;
	this.newForm.setAttribute('style', 'position:absolute; left:'+x+'px; top:'+y+'px;');
	
	var newHeading = document.createElement("h1");
	newHeading.innerHTML = id;
	this.newForm.appendChild(newHeading);
	var newHr = document.createElement("hr");
	this.newForm.appendChild(newHr);
	this.newFieldset.id = "_fieldset_";
	this.newForm.appendChild(this.newFieldset);

	this.parent = Stage.canvas.parentElement;
	this.parent.appendChild(this.newForm);
	Stage.formBindings.splice(0, Stage.formBindings.length);
}
Form.prototype.AddChild = function(element, fieldsetname) {
	if (fieldsetname != null)
		document.getElementById(fieldsetname).appendChild(element);
	else
		this.newFieldset.appendChild(element);
}
