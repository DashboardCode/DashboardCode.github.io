// TODO: 1 how to transpile dependencies
// TODO: 2 how to polyfill

import { createPopper } from "@popperjs/core";
import { ModuleFactory as bsMultiSelectModuleFactory } from "@dashboardcode/bsmultiselect";
 
const multiSelectEnv = {window, createPopper};
const multiSelect = bsMultiSelectModuleFactory(multiSelectEnv).BsMultiSelect;

var element = document.querySelector("#bsMultiSelectOnDropdown");
var api = multiSelect(element); 

console.log(api) 

function testES2018(...args: Array<any>): boolean {
    return !args.some(
      (element) =>
        !(element && typeof element.getBoundingClientRect === 'function')
    );
}