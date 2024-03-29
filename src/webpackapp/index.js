import "core-js/stable";
import "regenerator-runtime/runtime";

import { createPopper } from "@popperjs/core";
import { ModuleFactory as bsMultiSelectModuleFactory } from "@dashboardcode/bsmultiselect";

const multiSelectEnv = {window, createPopper};
const multiSelect = bsMultiSelectModuleFactory(multiSelectEnv).BsMultiSelect;

var element = document.querySelector("#bsMultiSelectOnDropdown");
var api = multiSelect(element);

function areValidElementsIndex(...args) {
    return !args.some(
      (element) =>
        !(element && typeof element.getBoundingClientRect === 'function')
    );
}

console.log(api)