import "core-js/stable";
import "regenerator-runtime/runtime";

import { createPopper } from "@popperjs/core";
import { ModuleFactory as bsMultiSelectModuleFactory } from "@dashboardcode/bsmultiselect";


const multiSelectEnv = {window, createPopper};
const multiSelect = bsMultiSelectModuleFactory(multiSelectEnv).BsMultiSelect;

var element = document.querySelector("#bsMultiSelectOnDropdown");
var api = multiSelect(element);

// test
// import 'normalize.css/normalize.css';

console.log(api)