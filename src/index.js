import { createPopper } from "@popperjs/core";
import { ModuleFactory as bsMultiSelectModuleFactory } from "@dashboardcode/bsmultiselect";

const multiSelectEnv = {window, createPopper};
const multiSelect = bsMultiSelectModuleFactory(multiSelectEnv).BsMultiSelect;

$(() => {
  $("select[multiple]").each((_i, select) => {
    multiSelect(select);
  });
});

// test
//import 'normalize.css/normalize.css';

console.log("index")