///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

///////////////////////////////////////////////////////////////////////////////
// Default form elements
///////////////////////////////////////////////////////////////////////////////
// default form elements (sibling layer)
function cancel(param) {
	let element = document.createElement("input");
	element.type = "button";
	element.name = param.name;
	element.id = param.name;
	element.value = param.name;
	element.appendChild(document.createTextNode(param.name));
	Helper.addEvent(element, 'click', ((e) => {
			if (e.which != 1) return;
			// just remove form here
			Stage.activeForm.parent.removeChild(Stage.activeForm.newForm);
			Stage.activeForm = null;
            Stage.fromForm = true;
			Stage.capture = false;
		}), false);
	try { return element; }
	finally { element = null; }
}
function checkbox(param) {
	let element = document.createElement("input");
	element.type = "checkbox";
	element.name = param.name;
	element.id = param.name;
	element.checked = (param.checked) ? param.checked : false;
	if (param.bind) {
		element.checked = Helper.getValue(param.bind);
		Stage.formBindings.add([param.name, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}
function fieldset(param) {
	let element = document.createElement("fieldset");
	element.id = param;
	try { return element; }
	finally { element = null; }
}
function input(param) {
	let element = document.createElement("input");
	element.name = param.name;
	element.id = param.name;
	if (param.placeholder) element.placeholder = param.placeholder;
	if (param.autofocus) element.autofocus = param.autofocus;
	if (param.bind) {
		if (Helper.getValue(param.bind) != '')
			element.value = Helper.getValue(param.bind);
		Stage.formBindings.add([param.name, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}
function input_label(param, tip) {
	let element = document.createElement("label");
	element.htmlFor = param;
	element.innerHTML = param;
	if (tip) element.title = tip;
	try { return element; }
	finally { element = null; }
}
function radio(param) {
	let element = document.createElement("input");
	element.type = "radio";
	element.name = param.name;
	element.id = param.value;
	element.value = param.value;
	element.checked = (param.checked) ? param.checked : false;
	if (param.bind) {
		element.checked = (element.value == Helper.getValue(param.bind));
		Stage.formBindings.add([param.value, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}
function select(param) {
	let element = document.createElement("select");
	element.name = param.name;
	element.id = param.name;
	
	let opts = (typeof param.options == 'string') ? Helper.getValue(param.options) : param.options;
	for (let i=0; i<opts.length; i+=2) {
		let opt = document.createElement("option");
		opt.innerHTML = opts[i];
		opt.value = JSON.stringify(opts[i+1]);
		element.appendChild(opt);
		if (param.bind) {
			if (opt.value == JSON.stringify(Helper.getValue(param.bind)))
				element.selectedIndex = i/2;
		}
	}	
	if (param.bind) Stage.formBindings.add([param.name, param.bind]);
	try { return element; }
	finally { element = null; }
}
function slider(param) {
	let element = document.createElement("input");
	element.type = "range";
	element.name = param.name;
	element.id = param.name;
	if (param.min != null) element.min = param.min;
	if (param.max != null) element.max = param.max;
	if (param.step != null) element.step = param.step;
	if (param.value != null) element.value = param.value;
	if (param.bind) {
		element.value = Helper.getValue(param.bind);
		Stage.formBindings.add([param.name, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}
function spinbox(param) {
	let element = document.createElement("input");
	element.type = "number";
	element.name = param.name;
	element.id = param.name;
	if (param.min != null) element.min = param.min;
	if (param.max != null) element.max = param.max;
	if (param.step != null) element.step = param.step;
	if (param.value != null) element.value = param.value;
	if (param.bind) {
		element.value = Helper.getValue(param.bind);
		Stage.formBindings.add([param.name, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}
function submit(param) {
	let element = document.createElement("input");
	element.type = "button";
	element.name = param.name;
	element.id = param.name;
	element.value = param.name;
	element.appendChild(document.createTextNode(param.name));
	Helper.addEvent(element, 'click', ((e) => {
			if (e.which != 1) return;
            // update bindings here
            Stage.formBindings.forEach(element => {
                let item = document.getElementById(element[0]);
                if (item.type == 'radio') {
                    if (item.checked == true)
                        Helper.setValue(element[1], item.value.toString());
                }
                else if (item.type == 'checkbox') {
                    Helper.setValue(element[1], item.checked);
                }
                else if ((item.type == 'range') || (item.type == 'number')) {
                    Helper.setValue(element[1], item.valueAsNumber);
                }
                else if ((item.type == 'text') || (item.type == 'textarea')) {
                    Helper.setValue(element[1], item.value.toString());
                }
                else if (item.type == 'select-one') {
                    Helper.setValue(element[1], JSON.parse(item.value));
                }
                else {
                    Helper.setValue(element[1], item.value);
                }
            });
			// remove form here
			Stage.activeForm.parent.removeChild(Stage.activeForm.newForm);
			Stage.activeForm = null;
            Stage.fromForm = true;
			Stage.capture = false;
		}), false);
	try { return element; }
	finally { element = null; }
}
function textarea(param) {
	let element = document.createElement("textarea");
	element.name = param.name;
	element.id = param.name;
	element.readOnly = (param.readOnly ? param.readOnly : false);
	if (param.placeholder) element.placeholder = param.placeholder;
	if (param.autofocus) element.autofocus = param.autofocus;
	//if (param.rows != null) element.rows = param.rows;
	//if (param.cols != null) element.cols = param.cols;
	if (param.bind) {
		if (Helper.getValue(param.bind) != '')
			element.value = Helper.getValue(param.bind);
		Stage.formBindings.add([param.name, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}

// form - create a default HTML form
function form(param) {
    let f = new Form(param[0]);
    let fset = null;

    for (let i=1; i<param.length; i+=2) {
		// if this element is a fieldset, revert to default fieldset
		if (param[i] == fieldset)
			fset = null;
        // append element to active fieldset
		if ((param[i] == input) || 
			(param[i] == select) || 
			(param[i] == spinbox) ||
			(param[i] == slider) ||
			(param[i] == textarea)) {
				if (!param[i+1].noLabel)
                    f.addChild(input_label(param[i+1].name, param[i+1].tip), fset);
		}
        f.addChild(param[i](param[i+1]), fset);	
		if (param[i] == checkbox) {
            //f.addChild(param[i](param[i+1]), fset);	
			f.addChild(input_label(param[i+1].name, param[i+1].tip), fset);
        }
		if (param[i] == radio) {
            //f.addChild(param[i](param[i+1]), fset);	
			f.addChild(input_label(param[i+1].value, param[i+1].tip), fset);
		}
		// if this element is a fieldset, attach succeeding elements to it
		if (param[i] == fieldset)
			fset = param[i+1];
    }

    Stage.activeForm = f;
	Stage.capture = true;
}

class Form {
    constructor(id) {
        this.newForm = document.createElement('form');
        this.newFieldSet = document.createElement('fieldset');

        this.newForm.id = id;
        let newHeading = document.createElement('h1');
        newHeading.innerHTML = id;
        this.newForm.appendChild(newHeading);
        let newHr = document.createElement('hr');
        this.newForm.appendChild(newHr);
        this.newFieldSet.id = '_fieldset_';
        this.newForm.appendChild(this.newFieldSet);

        this.parent = Stage.canvas.parentElement;
        this.parent.appendChild(this.newForm);
        let x = Stage.canvas.offsetLeft + (Stage.canvas.clientWidth-this.newForm.clientWidth)/2;
        let y = Stage.canvas.offsetTop + (Stage.canvas.clientHeight-this.newForm.clientHeight)/2;
        this.newForm.setAttribute('style', 'position:absolute; left:'+x+'px; top:'+y+'px');
        Stage.formBindings.clear();
    }
    addChild(element, fieldsetname=null) {
        if (fieldsetname)
            document.getElementById(fieldsetname).appendChild(element);
        else
            this.newFieldSet.appendChild(element);
    }
}