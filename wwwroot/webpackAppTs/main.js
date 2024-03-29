/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@popperjs/core/lib/createPopper.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/createPopper.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "popperGenerator": () => (/* binding */ popperGenerator),
/* harmony export */   "createPopper": () => (/* binding */ createPopper),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_13__["default"])
/* harmony export */ });
/* harmony import */ var _dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./dom-utils/getCompositeRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-utils/listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/orderModifiers.js */ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./utils/debounce.js */ "./node_modules/@popperjs/core/lib/utils/debounce.js");
/* harmony import */ var _utils_validateModifiers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/validateModifiers.js */ "./node_modules/@popperjs/core/lib/utils/validateModifiers.js");
/* harmony import */ var _utils_uniqueBy_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/uniqueBy.js */ "./node_modules/@popperjs/core/lib/utils/uniqueBy.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/mergeByName.js */ "./node_modules/@popperjs/core/lib/utils/mergeByName.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./enums.js */ "./node_modules/@popperjs/core/lib/enums.js");














var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: (0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(reference) ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference) : reference.contextElement ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference.contextElement) : [],
          popper: (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = (0,_utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__["default"])([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (true) {
          var modifiers = (0,_utils_uniqueBy_js__WEBPACK_IMPORTED_MODULE_4__["default"])([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          (0,_utils_validateModifiers_js__WEBPACK_IMPORTED_MODULE_5__["default"])(modifiers);

          if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.options.placement) === _enums_js__WEBPACK_IMPORTED_MODULE_7__.auto) {
            var flipModifier = state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });

            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
            }
          }

          var _getComputedStyle = (0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_8__["default"])(popper),
              marginTop = _getComputedStyle.marginTop,
              marginRight = _getComputedStyle.marginRight,
              marginBottom = _getComputedStyle.marginBottom,
              marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer


          if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
          }
        }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (true) {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: (0,_dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_9__["default"])(reference, (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(popper), state.options.strategy === 'fixed'),
          popper: (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_11__["default"])(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (true) {
            __debug_loops__ += 1;

            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_12__["default"])(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (true) {
        console.error(INVALID_ELEMENT_ERROR);
      }

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/contains.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/contains.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ contains)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBoundingClientRect)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

var round = Math.round;
function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
    // Fallback to 1 in case both values are `0`

    if (offsetWidth > 0) {
      scaleX = rect.width / offsetWidth || 1;
    }

    if (offsetHeight > 0) {
      scaleY = rect.height / offsetHeight || 1;
    }
  }

  return {
    width: round(rect.width / scaleX),
    height: round(rect.height / scaleY),
    top: round(rect.top / scaleY),
    right: round(rect.right / scaleX),
    bottom: round(rect.bottom / scaleY),
    left: round(rect.left / scaleX),
    x: round(rect.left / scaleX),
    y: round(rect.top / scaleY)
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getClippingRect)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getViewportRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js");
/* harmony import */ var _getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js");
/* harmony import */ var _listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");















function getInnerBoundingClientRect(element) {
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === _enums_js__WEBPACK_IMPORTED_MODULE_1__.viewport ? (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element)) : (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(clippingParent) ? getInnerBoundingClientRect(clippingParent) : (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = (0,_listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_8__["default"])(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__["default"])(element).position) >= 0;
  var clipperElement = canEscapeClipping && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(element) ? (0,_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(element) : element;

  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) && (0,_contains_js__WEBPACK_IMPORTED_MODULE_11__["default"])(clippingParent, clipperElement) && (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_12__["default"])(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.top, accRect.top);
    accRect.right = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getCompositeRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getNodeScroll_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getNodeScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");








function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = rect.width / element.offsetWidth || 1;
  var scaleY = rect.height / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(offsetParent);
  var offsetParentIsScaled = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(offsetParent) && isElementScaled(offsetParent);
  var documentElement = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent);
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_4__["default"])(documentElement)) {
      scroll = (0,_getNodeScroll_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent);
    }

    if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(offsetParent)) {
      offsets = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_6__["default"])(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getComputedStyle)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getComputedStyle(element) {
  return (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element).getComputedStyle(element);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentElement)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return (((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentRect)
/* harmony export */ });
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var winScroll = (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
  var y = -winScroll.scrollTop;

  if ((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(body || html).direction === 'rtl') {
    x += (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getHTMLElementScroll)
/* harmony export */ });
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getLayoutRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeName)
/* harmony export */ });
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeScroll)
/* harmony export */ });
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getHTMLElementScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js");




function getNodeScroll(node) {
  if (node === (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node) || !(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node)) {
    return (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node);
  } else {
    return (0,_getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node);
  }
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOffsetParent)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _isTableElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isTableElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");







function getTrueOffsetParent(element) {
  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
  (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  var isIE = navigator.userAgent.indexOf('Trident') !== -1;

  if (isIE && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = (0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element);

  while ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(currentNode) && ['html', 'body'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_3__["default"])(currentNode)) < 0) {
    var css = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_4__["default"])(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && (0,_isTableElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent) && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent) === 'html' || (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent) === 'body' && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getParentNode)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");



function getParentNode(element) {
  if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) // fallback

  );
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getScrollParent)
/* harmony export */ });
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node) && (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node)) {
    return node;
  }

  return getScrollParent((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getViewportRect)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");



function getViewportRect(element) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
  // can be obscured underneath it.
  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
  // if it isn't open, so if this isn't available, the popper will be detected
  // to overflow the bottom of the screen too early.

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
    // errors due to floating point numbers, so we need to check precision.
    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
    // Feature detection fails in mobile emulation mode in Chrome.
    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
    // 0.001
    // Fallback here: "Not Safari" userAgent

    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element),
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js":
/*!****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindow)
/* harmony export */ });
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScroll)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getWindowScroll(node) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScrollBarX)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)).left + (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).scrollLeft;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isElement": () => (/* binding */ isElement),
/* harmony export */   "isHTMLElement": () => (/* binding */ isHTMLElement),
/* harmony export */   "isShadowRoot": () => (/* binding */ isShadowRoot)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");


function isElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isScrollParent)
/* harmony export */ });
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isTableElement)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) >= 0;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js":
/*!************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listScrollParents)
/* harmony export */ });
/* harmony import */ var _getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = (0,_getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(target)));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/enums.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/enums.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "top": () => (/* binding */ top),
/* harmony export */   "bottom": () => (/* binding */ bottom),
/* harmony export */   "right": () => (/* binding */ right),
/* harmony export */   "left": () => (/* binding */ left),
/* harmony export */   "auto": () => (/* binding */ auto),
/* harmony export */   "basePlacements": () => (/* binding */ basePlacements),
/* harmony export */   "start": () => (/* binding */ start),
/* harmony export */   "end": () => (/* binding */ end),
/* harmony export */   "clippingParents": () => (/* binding */ clippingParents),
/* harmony export */   "viewport": () => (/* binding */ viewport),
/* harmony export */   "popper": () => (/* binding */ popper),
/* harmony export */   "reference": () => (/* binding */ reference),
/* harmony export */   "variationPlacements": () => (/* binding */ variationPlacements),
/* harmony export */   "placements": () => (/* binding */ placements),
/* harmony export */   "beforeRead": () => (/* binding */ beforeRead),
/* harmony export */   "read": () => (/* binding */ read),
/* harmony export */   "afterRead": () => (/* binding */ afterRead),
/* harmony export */   "beforeMain": () => (/* binding */ beforeMain),
/* harmony export */   "main": () => (/* binding */ main),
/* harmony export */   "afterMain": () => (/* binding */ afterMain),
/* harmony export */   "beforeWrite": () => (/* binding */ beforeWrite),
/* harmony export */   "write": () => (/* binding */ write),
/* harmony export */   "afterWrite": () => (/* binding */ afterWrite),
/* harmony export */   "modifierPhases": () => (/* binding */ modifierPhases)
/* harmony export */ });
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/arrow.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/arrow.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");









 // eslint-disable-next-line import/no-unused-modules

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return (0,_utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof padding !== 'number' ? padding : (0,_utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_2__.basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(state.placement);
  var axis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(basePlacement);
  var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_2__.left, _enums_js__WEBPACK_IMPORTED_MODULE_2__.right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])(arrowElement);
  var minProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.top : _enums_js__WEBPACK_IMPORTED_MODULE_2__.left;
  var maxProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_2__.right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_7__["default"])(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (true) {
    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_8__.isHTMLElement)(arrowElement)) {
      console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
    }
  }

  if (!(0,_dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.popper, arrowElement)) {
    if (true) {
      console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
    }

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mapToStyles": () => (/* binding */ mapToStyles),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)((0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(x * dpr) / dpr) || 0,
    y: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)((0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(y * dpr) / dpr) || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets;

  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
      _ref3$x = _ref3.x,
      x = _ref3$x === void 0 ? 0 : _ref3$x,
      _ref3$y = _ref3.y,
      y = _ref3$y === void 0 ? 0 : _ref3$y;

  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.left;
  var sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;
  var win = window;

  if (adaptive) {
    var offsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) {
      offsetParent = (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(popper);

      if ((0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.right) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom; // $FlowFixMe[prop-missing]

      y -= offsetParent[heightProp] - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.right; // $FlowFixMe[prop-missing]

      x -= offsetParent[widthProp] - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref4) {
  var state = _ref4.state,
      options = _ref4.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  if (true) {
    var transitionProperty = (0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper).transitionProperty || '';

    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
    }
  }

  var commonStyles = {
    placement: (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.placement),
    variation: (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__["default"])(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/flip.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/flip.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getOppositePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getOppositeVariationPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/computeAutoPlacement.js */ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto) {
    return [];
  }

  var oppositePlacement = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(placement);
  return [(0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement), oppositePlacement, (0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [(0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto ? (0,_utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);

    var isStartVariation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.start;
    var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.top, _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.right : _enums_js__WEBPACK_IMPORTED_MODULE_1__.left : isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    }

    var altVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/hide.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/hide.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyStyles": () => (/* reexport safe */ _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "arrow": () => (/* reexport safe */ _arrow_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "computeStyles": () => (/* reexport safe */ _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "eventListeners": () => (/* reexport safe */ _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "flip": () => (/* reexport safe */ _flip_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "hide": () => (/* reexport safe */ _hide_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "offset": () => (/* reexport safe */ _offset_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "popperOffsets": () => (/* reexport safe */ _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "preventOverflow": () => (/* reexport safe */ _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"])
/* harmony export */ });
/* harmony import */ var _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _arrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _flip_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _hide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");










/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/offset.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/offset.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "distanceAndSkiddingToXY": () => (/* binding */ distanceAndSkiddingToXY),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");


function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  var invertDistance = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");


function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = (0,_utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getAltAxis.js */ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.placement);
  var variation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement);
  var altAxis = (0,_utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__["default"])(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis || checkAltAxis) {
    var mainSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;
    var altSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = popperOffsets[mainAxis] + overflow[mainSide];
    var max = popperOffsets[mainAxis] - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : (0,_utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__["default"])(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
    var arrowOffsetParent = state.elements.arrow && (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
    var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;

    if (checkMainAxis) {
      var preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__["default"])(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(min, tetherMin) : min, offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(max, tetherMax) : max);
      popperOffsets[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset;
    }

    if (checkAltAxis) {
      var _mainSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;

      var _altSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;

      var _offset = popperOffsets[altAxis];

      var _min = _offset + overflow[_mainSide];

      var _max = _offset - overflow[_altSide];

      var _preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__["default"])(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(_min, tetherMin) : _min, _offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(_max, tetherMax) : _max);

      popperOffsets[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper-lite.js":
/*!********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper-lite.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPopper": () => (/* binding */ createPopper),
/* harmony export */   "popperGenerator": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator),
/* harmony export */   "defaultModifiers": () => (/* binding */ defaultModifiers),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_5__["default"])
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");





var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper.js":
/*!***************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPopper": () => (/* binding */ createPopper),
/* harmony export */   "popperGenerator": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator),
/* harmony export */   "defaultModifiers": () => (/* binding */ defaultModifiers),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   "createPopperLite": () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__.createPopper),
/* harmony export */   "applyStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.applyStyles),
/* harmony export */   "arrow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.arrow),
/* harmony export */   "computeStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.computeStyles),
/* harmony export */   "eventListeners": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.eventListeners),
/* harmony export */   "flip": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.flip),
/* harmony export */   "hide": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.hide),
/* harmony export */   "offset": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.offset),
/* harmony export */   "popperOffsets": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.popperOffsets),
/* harmony export */   "preventOverflow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.preventOverflow)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modifiers/preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
/* harmony import */ var _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modifiers/arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modifiers/hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");











var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__["default"], _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"], _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__["default"], _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



console.log("lib popper");

function areValidElementsPopper(...args) {
  return !args.some(
    (element) =>
      !(element && typeof element.getBoundingClientRect === 'function')
  );
}

const arr1 = [10, 20, 30];

// make a copy of arr1
const copy = [...arr1];

console.log(copy);    // → [10, 20, 30]

const arr2 = [40, 50];

// merge arr2 with arr1
const merge = [...arr1, ...arr2];

console.log(merge);


/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeAutoPlacement)
/* harmony export */ });
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements : _options$allowedAutoP;
  var variation = (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement);
  var placements = variation ? flipVariations ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements : _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements.filter(function (placement) {
    return (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === variation;
  }) : _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;

    if (true) {
      console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
    }
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = (0,_detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[(0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeOffsets.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeOffsets)
/* harmony export */ });
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? (0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) : null;
  var variation = placement ? (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? (0,_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/debounce.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/debounce.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ debounce)
/* harmony export */ });
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/detectOverflow.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ detectOverflow)
/* harmony export */ });
/* harmony import */ var _dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getClippingRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
/* harmony import */ var _rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = (0,_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(typeof padding !== 'number' ? padding : (0,_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements));
  var altContext = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference : _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = (0,_dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(element) ? element : element.contextElement || (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = (0,_dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.elements.reference);
  var popperOffsets = (0,_computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"])({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = (0,_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ expandToHashMap)
/* harmony export */ });
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/format.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/format.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ format)
/* harmony export */ });
function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [].concat(args).reduce(function (p, c) {
    return p.replace(/%s/, c);
  }, str);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getAltAxis.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getAltAxis)
/* harmony export */ });
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBasePlacement)
/* harmony export */ });

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getFreshSideObject)
/* harmony export */ });
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMainAxisFromPlacement)
/* harmony export */ });
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositePlacement)
/* harmony export */ });
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositeVariationPlacement)
/* harmony export */ });
var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getVariation.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getVariation.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getVariation)
/* harmony export */ });
function getVariation(placement) {
  return placement.split('-')[1];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/math.js":
/*!*******************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/math.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "max": () => (/* binding */ max),
/* harmony export */   "min": () => (/* binding */ min),
/* harmony export */   "round": () => (/* binding */ round)
/* harmony export */ });
var max = Math.max;
var min = Math.min;
var round = Math.round;

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergeByName.js":
/*!**************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergeByName.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeByName)
/* harmony export */ });
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergePaddingObject)
/* harmony export */ });
/* harmony import */ var _getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");

function mergePaddingObject(paddingObject) {
  return Object.assign({}, (0,_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), paddingObject);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/orderModifiers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ orderModifiers)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rectToClientRect)
/* harmony export */ });
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/uniqueBy.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/uniqueBy.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ uniqueBy)
/* harmony export */ });
function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);

    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/validateModifiers.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/validateModifiers.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ validateModifiers)
/* harmony export */ });
/* harmony import */ var _format_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./format.js */ "./node_modules/@popperjs/core/lib/utils/format.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");


var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    }).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }

          break;

        case 'phase':
          if (_enums_js__WEBPACK_IMPORTED_MODULE_1__.modifierPhases.indexOf(modifier.phase) < 0) {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + _enums_js__WEBPACK_IMPORTED_MODULE_1__.modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'effect':
          if (modifier.effect != null && typeof modifier.effect !== 'function') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'requires':
          if (modifier.requires != null && !Array.isArray(modifier.requires)) {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
          }

          break;

        case 'options':
        case 'data':
          break;

        default:
          console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
            return "\"" + s + "\"";
          }).join(', ') + "; but \"" + key + "\" was provided.");
      }

      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) {
          console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/within.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/within.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ within)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");

function within(min, value, max) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.max)(min, (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.min)(value, max));
}

/***/ }),

/***/ "./src/webpackAppTs/index.ts":
/*!***********************************!*\
  !*** ./src/webpackAppTs/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
/* harmony import */ var _dashboardcode_bsmultiselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dashboardcode/bsmultiselect */ "./node_modules/@dashboardcode/bsmultiselect/dist/js/BsMultiSelect.mjs");
// TODO: 1 how to transpile dependencies
// TODO: 2 how to polyfill


var multiSelectEnv = { window: window, createPopper: _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper };
var multiSelect = (0,_dashboardcode_bsmultiselect__WEBPACK_IMPORTED_MODULE_0__.ModuleFactory)(multiSelectEnv).BsMultiSelect;
var element = document.querySelector("#bsMultiSelectOnDropdown");
var api = multiSelect(element);
console.log(api);
function testES2018() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return !args.some(function (element) {
        return !(element && typeof element.getBoundingClientRect === 'function');
    });
}


/***/ }),

/***/ "./src/webpackAppTs/index.html":
/*!*************************************!*\
  !*** ./src/webpackAppTs/index.html ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "index.html";

/***/ }),

/***/ "./node_modules/@dashboardcode/bsmultiselect/dist/js/BsMultiSelect.mjs":
/*!*****************************************************************************!*\
  !*** ./node_modules/@dashboardcode/bsmultiselect/dist/js/BsMultiSelect.mjs ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bs4Plugin": () => (/* binding */ Bs4Plugin),
/* harmony export */   "Bs5Plugin": () => (/* binding */ Bs5Plugin),
/* harmony export */   "BsAppearancePlugin": () => (/* binding */ BsAppearancePlugin),
/* harmony export */   "BsMultiSelect": () => (/* binding */ legacyConstructor),
/* harmony export */   "ChoicesDynamicStylingPlugin": () => (/* binding */ ChoicesDynamicStylingPlugin),
/* harmony export */   "CreatePopperPlugin": () => (/* binding */ CreatePopperPlugin),
/* harmony export */   "CssPatchPlugin": () => (/* binding */ CssPatchPlugin),
/* harmony export */   "CustomChoiceStylingsPlugin": () => (/* binding */ CustomChoiceStylingsPlugin),
/* harmony export */   "CustomPickStylingsPlugin": () => (/* binding */ CustomPickStylingsPlugin),
/* harmony export */   "DisableComponentPlugin": () => (/* binding */ DisableComponentPlugin),
/* harmony export */   "DisabledOptionPlugin": () => (/* binding */ DisabledOptionPlugin),
/* harmony export */   "EventBinder": () => (/* binding */ EventBinder),
/* harmony export */   "FloatingLabelPlugin": () => (/* binding */ FloatingLabelPlugin),
/* harmony export */   "FormResetPlugin": () => (/* binding */ FormResetPlugin),
/* harmony export */   "FormRestoreOnBackwardPlugin": () => (/* binding */ FormRestoreOnBackwardPlugin),
/* harmony export */   "HiddenOptionAltPlugin": () => (/* binding */ HiddenOptionAltPlugin),
/* harmony export */   "HiddenOptionPlugin": () => (/* binding */ HiddenOptionPlugin),
/* harmony export */   "HighlightPlugin": () => (/* binding */ HighlightPlugin),
/* harmony export */   "JQueryMethodsPlugin": () => (/* binding */ JQueryMethodsPlugin),
/* harmony export */   "LabelForAttributePlugin": () => (/* binding */ LabelForAttributePlugin),
/* harmony export */   "ModuleFactory": () => (/* binding */ ModuleFactory),
/* harmony export */   "MultiSelectBuilder": () => (/* binding */ MultiSelectBuilder),
/* harmony export */   "ObjectValues": () => (/* binding */ ObjectValues),
/* harmony export */   "OptionsApiPlugin": () => (/* binding */ OptionsApiPlugin),
/* harmony export */   "PicksApiPlugin": () => (/* binding */ PicksApiPlugin),
/* harmony export */   "PicksPlugin": () => (/* binding */ PicksPlugin),
/* harmony export */   "PlaceholderPlugin": () => (/* binding */ PlaceholderPlugin),
/* harmony export */   "RtlPlugin": () => (/* binding */ RtlPlugin),
/* harmony export */   "SelectElementPlugin": () => (/* binding */ SelectElementPlugin),
/* harmony export */   "SelectedOptionPlugin": () => (/* binding */ SelectedOptionPlugin),
/* harmony export */   "UpdateAppearancePlugin": () => (/* binding */ UpdateAppearancePlugin),
/* harmony export */   "ValidationApiPlugin": () => (/* binding */ ValidationApiPlugin),
/* harmony export */   "WarningPlugin": () => (/* binding */ WarningPlugin),
/* harmony export */   "addStyling": () => (/* binding */ addStyling),
/* harmony export */   "composeSync": () => (/* binding */ composeSync),
/* harmony export */   "shallowClearClone": () => (/* binding */ shallowClearClone),
/* harmony export */   "toggleStyling": () => (/* binding */ toggleStyling)
/* harmony export */ });
/*!
  * BsMultiSelect v1.2.0-beta.16 (https://dashboardcode.github.io/BsMultiSelect/)
  * Copyright 2017-2021 Roman Pokrovskij (github user rpokrovskij)
  * Licensed under Apache 2 (https://github.com/DashboardCode/BsMultiSelect/blob/master/LICENSE)
  */
function findDirectChildByTagName(element, tagName) {
  let value = null;

  for (let i = 0; i < element.children.length; i++) {
    let tmp = element.children[i];

    if (tmp.tagName == tagName) {
      value = tmp;
      break;
    }
  }

  return value;
}
function closestByTagName(element, tagName) {
  return closest(element, e => e.tagName === tagName); // TODO support xhtml?  e.tagName.toUpperCase() ?
}
function closestByClassName(element, className) {
  return closest(element, e => e.classList.contains(className));
}
function closestByAttribute(element, attributeName, attribute) {
  return closest(element, e => e.getAttribute(attributeName) === attribute);
}
function containsAndSelf(node, otherNode) {
  return node === otherNode || node.contains(otherNode);
}
function getDataGuardedWithPrefix(element, prefix, name) {
  var tmp1 = element.getAttribute('data-' + prefix + '-' + name);

  if (tmp1) {
    return tmp1;
  } else {
    var tmp2 = element.getAttribute('data-' + name);
    if (tmp2) return tmp2;
  }

  return null;
}

function closest(element, predicate) {
  if (!element || !(element instanceof Element)) return null; // should be element, not document (TODO: check iframe)

  if (predicate(element)) return element;
  return closest(element.parentNode, predicate);
}

function siblingsAsArray(element) {
  var value = [];

  if (element.parentNode) {
    var children = element.parentNode.children;
    var l = element.parentNode.children.length;

    if (children.length > 1) {
      for (var i = 0; i < l; ++i) {
        var e = children[i];
        if (e != element) value.push(e);
      }
    }
  }

  return value;
}
function getIsRtl(element) {
  var isRtl = false;
  var e = closestByAttribute(element, "dir", "rtl");
  if (e) isRtl = true;
  return isRtl;
}
function EventBinder() {
  var list = [];
  return {
    bind(element, eventName, handler) {
      element.addEventListener(eventName, handler);
      list.push({
        element,
        eventName,
        handler
      });
    },

    unbind() {
      list.forEach(e => {
        let {
          element,
          eventName,
          handler
        } = e;
        element.removeEventListener(eventName, handler);
      });
    }

  };
}
function AttributeBackup() {
  var list = [];
  return {
    set(element, attributeName, attribute) {
      var currentAtribute = element.getAttribute(attributeName);
      list.push({
        element,
        currentAtribute,
        attribute
      });
      element.setAttribute(attributeName, attribute);
    },

    restore() {
      list.forEach(e => {
        let {
          element,
          attributeName,
          attribute
        } = e;
        if (attributeName) element.setAttribute(attributeName, attribute);else element.removeAttribute(attributeName);
      });
    }

  };
}
function EventLoopProlongableFlag(window) {
  var flag = false;
  var pr = null;
  return {
    get() {
      return flag;
    },

    set(timeout) {
      if (flag && pr) {
        window.clearTimeout(pr);
      }

      flag = true;
      pr = window.setTimeout(() => {
        flag = false;
        pr = null;
      }, timeout ? timeout : 0);
    }

  };
}
function ResetableFlag() {
  var flag = false;
  return {
    get() {
      return flag;
    },

    set() {
      flag = true;
    },

    reset() {
      flag = false;
    }

  };
}

function Bs5Plugin() {}

Bs5Plugin.plugDefaultConfig = defaults => {
  defaults.css = css$1;
  setDefaults$1(defaults);
};

function setDefaults$1(defaults) {
  defaults.useCssPatch = true;
  defaults.cssPatch = cssPatch$1;
  defaults.pickButtonHTML = '<button aria-label="Remove" tabIndex="-1" type="button"></button>';
  defaults.composeGetSize = composeGetSize$1;
  defaults.getDefaultLabel = getDefaultLabel$1;
}

function composeGetSize$1(selectElement) {
  let inputGroupElement = closestByClassName(selectElement, 'input-group');
  let getSize = null;

  if (inputGroupElement) {
    getSize = function () {
      var value = null;
      if (inputGroupElement.classList.contains('input-group-lg')) value = 'lg';else if (inputGroupElement.classList.contains('input-group-sm')) value = 'sm';
      return value;
    };
  } else {
    getSize = function () {
      var value = null;
      if (selectElement.classList.contains('form-select-lg') || selectElement.classList.contains('form-control-lg')) // changed for BS
        value = 'lg';else if (selectElement.classList.contains('form-select-sm') || selectElement.classList.contains('form-control-sm')) value = 'sm';
      return value;
    };
  }

  return getSize;
}

function getDefaultLabel$1(selectElement) {
  let value = null;
  let query = `label[for="${selectElement.id}"]`;
  let p1 = selectElement.parentElement;
  value = p1.querySelector(query); // label can be wrapped into col-auto

  if (!value) {
    let p2 = p1.parentElement;
    value = p2.querySelector(query);
  }

  return value;
}

const css$1 = {
  choices: 'dropdown-menu',
  // bs, in bsmultiselect.scss as div.dropdown-menu
  choicesList: '',
  // bs, in bsmultiselect.scss as div.dropdown-menu>ul (first child)
  choice_hover: 'hover',
  //  not bs, in scss as 'ul.dropdown-menu li.hover'
  choice_selected: 'selected',
  //  not bs,
  choice_disabled: 'disabled',
  //  not bs,
  picks: 'form-control',
  // bs, in scss 'ul.form-control'
  picks_focus: 'focus',
  // not bs, in scss 'ul.form-control.focus'
  picks_disabled: 'disabled',
  //  not bs, in scss 'ul.form-control.disabled'
  pick_disabled: '',
  pickFilter: '',
  filterInput: '',
  // used in pickContentGenerator
  pick: {
    classes: 'badge'
  },
  // bs
  pickContent: '',
  pickContent_disabled: 'disabled',
  // not bs, in scss 'ul.form-control li span.disabled'
  pickButton: 'btn-close',
  // bs
  // used in choiceContentGenerator
  // choice:  'dropdown-item', // it seems like hover should be managed manually since there should be keyboard support
  choiceCheckBox_disabled: 'disabled',
  //  not bs, in scss as 'ul.form-control li .custom-control-input.disabled ~ .custom-control-label'
  choiceContent: 'form-check',
  // bs d-flex required for rtl to align items
  choiceCheckBox: 'form-check-input',
  // bs
  choiceLabel: 'form-check-label',
  choiceLabel_disabled: '',
  label_floating_lifted: 'floating-lifted',
  picks_floating_lifted: 'floating-lifted',
  warning: 'alert-warning'
};
const cssPatch$1 = {
  choicesList: {
    listStyleType: 'none',
    paddingLeft: '0',
    paddingRight: '0',
    marginBottom: '0'
  },
  picks: {
    listStyleType: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    height: 'auto',
    marginBottom: '0',
    cursor: 'text'
  },
  choice: {
    classes: 'px-md-2 px-1',
    styles: {
      cursor: 'pointer'
    }
  },
  //choice_selected: 'selected',  //  remove,
  //choice_disabled: 'disabled',  //  remove,
  choice_hover: 'text-primary bg-light',
  choice_disabled_hover: 'bg-light',
  // actually 'disabled, not selected'
  filterInput: {
    border: '0px',
    height: 'auto',
    boxShadow: 'none',
    padding: '0',
    margin: '0',
    outline: 'none',
    backgroundColor: 'transparent',
    backgroundImage: 'none' // otherwise BS .was-validated set its image

  },
  filterInput_empty: 'form-control',
  // need for placeholder, TODO test form-control-plaintext
  // used in PicksDom
  picks_disabled: {
    backgroundColor: '#e9ecef'
  },
  picks_focus: {
    borderColor: '#80bdff',
    boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
  },
  picks_focus_valid: {
    borderColor: '',
    boxShadow: '0 0 0 0.2rem rgba(40, 167, 69, 0.25)'
  },
  picks_focus_invalid: {
    borderColor: '',
    boxShadow: '0 0 0 0.2rem rgba(220, 53, 69, 0.25)'
  },
  // used in BsAppearancePlugin
  picks_def: {
    minHeight: 'calc(2.25rem + 2px)'
  },
  picks_lg: {
    minHeight: 'calc(2.875rem + 2px)'
  },
  picks_sm: {
    minHeight: 'calc(1.8125rem + 2px)'
  },
  picks_floating_def: {
    minHeight: 'calc(3.5rem + 2px)'
  },
  // used in pickContentGenerator
  pick: {
    paddingLeft: '0',
    paddingRight: '.5rem',
    paddingInlineStart: '0',
    paddingInlineEnd: '0.5rem',
    color: 'var(--bs-dark)'
  },
  pickButton: {
    fontSize: '0.8em',
    float: "none",
    verticalAlign: "text-top"
  },
  pickContent_disabled: {
    opacity: '.65'
  },
  // used in choiceContentGenerator
  choiceContent: {
    justifyContent: 'flex-start',
    cursor: 'inherit'
  },
  // BS problem: without this on inline form menu items justified center
  choiceLabel: {
    color: 'inherit',
    cursor: 'inherit'
  },
  // otherwise BS .was-validated set its color
  choiceCheckBox: {
    color: 'inherit',
    cursor: 'inherit'
  },
  choiceLabel_disabled: {
    opacity: '.65'
  },
  // more flexible than {color: '#6c757d'}; note: avoid opacity on pickElement's border; TODO write to BS 
  // floating plugin
  label_floating_lifted: {
    opacity: '.65',
    transform: 'scale(.85) translateY(-.5rem) translateX(.15rem)'
  },
  picks_floating_lifted: {
    paddingTop: '1.625rem',
    paddingLeft: '0.8rem',
    paddingBottom: '0'
  },
  warning: {
    paddingLeft: '.25rem',
    paddingRight: '.25rem',
    zIndex: 4,
    fontSize: 'small',
    backgroundColor: 'var(--bs-warning)'
  } // zIndex=4  since the input-group zIndex=3

};

function Bs4Plugin() {}

Bs4Plugin.plugDefaultConfig = defaults => {
  defaults.css = css;
  setDefaults(defaults);
};

function setDefaults(defaults) {
  defaults.useCssPatch = true;
  defaults.cssPatch = cssPatch;
  defaults.pickButtonHTML = '<button aria-label="Remove" tabIndex="-1" type="button"><span aria-hidden="true">&times;</span></button>';
  defaults.composeGetSize = composeGetSize;
  defaults.getDefaultLabel = getDefaultLabel;
}

const css = {
  choices: 'dropdown-menu',
  // bs4, in bsmultiselect.scss as ul.dropdown-menu
  choicesList: '',
  // bs4, in bsmultiselect.scss as div.dropdown-menu>ul (first child)
  choice_hover: 'hover',
  //  not bs4, in scss as 'ul.dropdown-menu li.hover'
  choice_selected: '',
  choice_disabled: '',
  picks: 'form-control',
  // bs4, in scss 'ul.form-control'
  picks_focus: 'focus',
  // not bs4, in scss 'ul.form-control.focus'
  picks_disabled: 'disabled',
  //  not bs4, in scss 'ul.form-control.disabled'
  pick_disabled: '',
  pickFilter: '',
  filterInput: '',
  // used in pickContentGenerator
  pick: 'badge',
  // bs4
  pickContent: '',
  pickContent_disabled: 'disabled',
  // not bs4, in scss 'ul.form-control li span.disabled'
  pickButton: 'close',
  // bs4
  // used in choiceContentGenerator
  // choice:  'dropdown-item', // it seems like hover should be managed manually since there should be keyboard support
  choiceCheckBox_disabled: 'disabled',
  //  not bs4, in scss as 'ul.form-control li .custom-control-input.disabled ~ .custom-control-label'
  choiceContent: 'custom-control custom-checkbox d-flex',
  // bs4 d-flex required for rtl to align items
  choiceCheckBox: 'custom-control-input',
  // bs4
  choiceLabel: 'custom-control-label justify-content-start',
  choiceLabel_disabled: '',
  warning: 'alert-warning bg-warning'
};
const cssPatch = {
  choicesList: {
    listStyleType: 'none',
    paddingLeft: '0',
    paddingRight: '0',
    marginBottom: '0'
  },
  picks: {
    listStyleType: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    height: 'auto',
    marginBottom: '0',
    cursor: 'text'
  },
  choice: {
    classes: 'px-md-2 px-1',
    styles: {
      cursor: 'pointer'
    }
  },
  choice_hover: 'text-primary bg-light',
  choice_disabled_hover: 'bg-light',
  filterInput: {
    border: '0px',
    height: 'auto',
    boxShadow: 'none',
    padding: '0',
    margin: '0',
    outline: 'none',
    backgroundColor: 'transparent',
    backgroundImage: 'none' // otherwise BS .was-validated set its image

  },
  filterInput_empty: 'form-control',
  // need for placeholder, TODO test form-control-plaintext
  // used in PicksDom
  picks_disabled: {
    backgroundColor: '#e9ecef'
  },
  picks_focus: {
    borderColor: '#80bdff',
    boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
  },
  picks_focus_valid: {
    borderColor: '',
    boxShadow: '0 0 0 0.2rem rgba(40, 167, 69, 0.25)'
  },
  picks_focus_invalid: {
    borderColor: '',
    boxShadow: '0 0 0 0.2rem rgba(220, 53, 69, 0.25)'
  },
  // used in BsAppearancePlugin
  picks_def: {
    minHeight: 'calc(2.25rem + 2px)'
  },
  picks_lg: {
    minHeight: 'calc(2.875rem + 2px)'
  },
  picks_sm: {
    minHeight: 'calc(1.8125rem + 2px)'
  },
  // used in pickContentGenerator
  pick: {
    lineHeight: '1.5em',
    paddingLeft: '0',
    paddingRight: '.5rem',
    paddingInlineStart: '0',
    paddingInlineEnd: '0.5rem'
  },
  pickButton: {
    fontSize: '1.5em',
    lineHeight: '.9em',
    float: "none"
  },
  pickContent_disabled: {
    opacity: '.65'
  },
  // used in choiceContentGenerator
  choiceContent: {
    justifyContent: 'flex-start',
    cursor: 'inherit'
  },
  // BS problem: without this on inline form menu items justified center
  choiceLabel: {
    color: 'inherit',
    cursor: 'inherit'
  },
  // otherwise BS .was-validated set its color
  choiceCheckBox: {
    color: 'inherit',
    cursor: 'inherit'
  },
  choiceLabel_disabled: {
    opacity: '.65'
  },
  // more flexible than {color: '#6c757d'}; note: avoid opacity on pickElement's border; TODO write to BS4 
  warning: {
    paddingLeft: '.25rem',
    paddingRight: '.25rem',
    zIndex: 4,
    fontSize: 'small',
    backgroundColor: 'var(--bs-warning)'
  } // zIndex=4  since the input-group zIndex=3

};

function composeGetSize(selectElement) {
  let inputGroupElement = closestByClassName(selectElement, 'input-group');
  let getSize = null;

  if (inputGroupElement) {
    getSize = function () {
      var value = null;
      if (inputGroupElement.classList.contains('input-group-lg')) value = 'lg';else if (inputGroupElement.classList.contains('input-group-sm')) value = 'sm';
      return value;
    };
  } else {
    getSize = function () {
      var value = null;
      if (selectElement.classList.contains('custom-select-lg') || selectElement.classList.contains('form-control-lg')) value = 'lg';else if (selectElement.classList.contains('custom-select-sm') || selectElement.classList.contains('form-control-sm')) value = 'sm';
      return value;
    };
  }

  return getSize;
}

function getDefaultLabel(selectElement) {
  let value = null;
  let formGroup = closestByClassName(selectElement, 'form-group');
  if (formGroup) value = formGroup.querySelector(`label[for="${selectElement.id}"]`);
  return value;
}

function isBoolean(value) {
  return value === true || value === false;
}
function isString(value) {
  return value instanceof String || typeof value === 'string';
}
function extendIfUndefined(destination, source) {
  for (let property in source) if (destination[property] === undefined) destination[property] = source[property];
}
function shallowClearClone(source, ...sources) {
  // override previous, no null and undefined
  var destination = {};

  for (let property in source) {
    // TODO:  Object.assign (need polyfill for IE11)
    let v = source[property];
    if (!(v === null || v === undefined)) destination[property] = v;
  }

  if (sources) sources.forEach(s => {
    for (let property in s) {
      let v = s[property];
      if (!(v === null || v === undefined)) destination[property] = v;else if (destination.hasOwnProperty(property)) {
        delete destination[property];
      }
    }
  });
  return destination;
}

function forEachRecursion(f, e) {
  if (!e) return;
  let goOn = f(e.value);
  if (!(goOn === false)) forEachRecursion(f, e.prev);
}

function indexRecursion(index, e) {
  if (!e.prev) return index;
  indexRecursion(++index, e.prev);
}

function List() {
  var tail = null;
  var count = 0;
  return {
    add(e) {
      if (tail) {
        tail.next = {
          value: e,
          prev: tail,
          next: null
        };
        tail = tail.next;
      } else tail = {
        value: e,
        prev: null,
        next: null
      };

      count++;
      let node = tail;

      function remove() {
        if (node.prev) {
          node.prev.next = node.next;
        }

        if (node.next) {
          node.next.prev = node.prev;
        }

        if (tail == node) {
          tail = node.prev;
        }

        count--;
      }

      function index() {
        return indexRecursion(0, node);
      }

      return {
        remove,
        index
      };
    },

    forEach(f) {
      forEachRecursion(f, tail);
    },

    getTail() {
      return tail ? tail.value : null;
    },

    getCount() {
      return count;
    },

    isEmpty() {
      return count == 0;
    },

    reset() {
      tail = null;
      count = 0;
    }

  };
}
function DoublyLinkedList(getPrev, setPrev, getNext, setNext) {
  var head = null,
      tail = null;
  var count = 0;
  return {
    add(e, next) {
      if (!tail) {
        head = tail = e;
        setPrev(e, null);
        setNext(e, null);
      } else {
        if (!next) {
          setPrev(e, tail);
          setNext(e, null);
          setNext(tail, e);
          tail = e;
        } else {
          if (next === head) head = e;
          let prev = getPrev(next);
          setNext(e, next);
          setPrev(next, e);

          if (prev) {
            setPrev(e, prev);
            setNext(prev, e);
          } else {
            setPrev(e, null);
          }
        }
      }

      count++;
    },

    remove(e) {
      let next = getNext(e);
      let prev = getPrev(e);

      if (prev) {
        setNext(prev, next);
      }

      if (next) {
        setPrev(next, prev);
      }

      if (tail == e) {
        tail = prev;
      }

      if (head == e) {
        head = next;
      }

      count--;
    },

    getHead() {
      return head;
    },

    getTail() {
      return tail;
    },

    getCount() {
      return count;
    },

    isEmpty() {
      return count == 0;
    },

    reset() {
      tail = head = null;
      count = 0;
    }

  };
}
function ArrayFacade() {
  var list = [];
  return {
    push(e) {
      list.push(e);
    },

    add(e, key) {
      list.splice(key, 0, e);
    },

    get: key => list[key],
    getNext: (key, predicate) => {
      let count = list.length;
      let start = key + 1;

      if (key < count) {
        if (!predicate) return list[start];

        for (let i = start; i < count; i++) {
          let c = list[i];
          if (predicate(c)) return c;
        }
      }
    },

    remove(key) {
      var e = list[key];
      list.splice(key, 1);
      return e;
    },

    forLoop(f) {
      for (let i = 0; i < list.length; i++) {
        let e = list[i];
        f(e, i);
      }
    },

    getHead() {
      return list[0];
    },

    getCount() {
      return list.length;
    },

    isEmpty() {
      return list.length == 0;
    },

    reset() {
      list = [];
    }

  };
}
function composeSync(...functions) {
  return () => functions.forEach(f => {
    if (f) f();
  });
}
function defCall(...functions) {
  for (let f of functions) if (f) {
    if (f instanceof Function) {
      let tmp = f();
      if (tmp) return tmp;
    } else return f;
  }
}
function ObservableValue(value) {
  var list = List();
  return {
    getValue() {
      return value;
    },

    setValue(newValue) {
      value = newValue;
      list.forEach(f => f(newValue));
    },

    attach(f) {
      return list.add(f);
    },

    detachAll() {
      list.reset();
    }

  };
}
function ObservableLambda(func) {
  var list = List();
  var value = func();
  return {
    getValue() {
      return value;
    },

    call() {
      value = func();
      list.forEach(f => f(value));
    },

    attach(f) {
      return list.add(f);
    },

    detachAll() {
      list.reset();
    }

  };
}
function ObjectValues(object) {
  // Object.values(plugins) - problem for IE11; full impementation of polifill is mor complex, but for our purpose this is enough
  var arr = [];

  for (var key in object) {
    arr.push(object[key]);
  }

  return arr;
}

function addStyling(element, styling) {
  var backupStyling = {
    classes: [],
    styles: {}
  };

  if (styling) {
    var {
      classes,
      styles
    } = styling;
    classes.forEach(e => element.classList.add(e)); // todo use add(classes)

    backupStyling.classes = classes.slice();

    for (let property in styles) {
      backupStyling.styles[property] = element.style[property];
      element.style[property] = styles[property]; // todo use Object.assign (need polyfill for IE11)
    }
  }

  return backupStyling;
}

function removeStyling(element, styling) {
  if (styling) {
    var {
      classes,
      styles
    } = styling;
    classes.forEach(e => element.classList.remove(e)); // todo use remove(classes)

    for (let property in styles) element.style[property] = styles[property]; // todo use Object.assign (need polyfill for IE11)

  }
}

function toggleStyling(element, styling) {
  var backupStyling = {
    classes: [],
    styles: {}
  };
  var isOn = false;
  var isF = styling instanceof Function;
  return (value, force) => {
    if (value) {
      if (isOn === false) {
        backupStyling = addStyling(element, isF ? styling() : styling);
        isOn = true;
      } else if (force) {
        removeStyling(element, backupStyling);
        backupStyling = addStyling(element, isF ? styling() : styling);
      }
    } else {
      if (isOn === true || force === true) {
        removeStyling(element, backupStyling);
        isOn = false;
      }
    }
  };
}

function extendClasses(out, param, actionStr, actionArr, isRemoveEmptyClasses) {
  if (isString(param)) {
    if (param === "") {
      if (isRemoveEmptyClasses) {
        out.classes = [];
      }
    } else {
      let c = param.split(' ');
      out.classes = actionStr(c);
    }

    return true;
  } else if (param instanceof Array) {
    if (param.length == 0) {
      if (isRemoveEmptyClasses) {
        out.classes = [];
      }
    } else {
      out.classes = actionArr(param);
    }

    return true;
  }

  return false;
}

function extend(value, param, actionStr, actionArr, actionObj, isRemoveEmptyClasses) {
  var success = extendClasses(value, param, actionStr, actionArr, isRemoveEmptyClasses);

  if (success === false) {
    if (param instanceof Object) {
      var {
        classes,
        styles
      } = param;
      extendClasses(value, classes, actionStr, actionArr, isRemoveEmptyClasses);

      if (styles) {
        value.styles = actionObj(styles);
      } else if (!classes) {
        value.styles = actionObj(param);
      }
    }
  }
}

function Styling(param) {
  var value = {
    classes: [],
    styles: {}
  };

  if (param) {
    extend(value, param, a => a, a => a.slice(), o => shallowClearClone(o), true);
  }

  return Object.freeze(value);
}

function createStyling(isReplace, param, ...params) {
  var value = {
    classes: [],
    styles: {}
  };

  if (param) {
    extend(value, param, a => a, a => a.slice(), o => shallowClearClone(o), true);

    if (params) {
      var {
        classes,
        styles
      } = value;
      var extendInt = isReplace ? p => extend(value, p, s => s, a => a.slice(), o => shallowClearClone(styles, o), true) : p => extend(value, p, a => classes.concat(a), a => classes.concat(a), o => shallowClearClone(styles, o), false);
      params.forEach(p => extendInt(p));
    }
  }

  return Styling(value);
}

function createCss(stylings1, stylings2) {
  var destination = {};

  for (let property in stylings1) {
    let param1 = stylings1[property];
    let param2 = stylings2 ? stylings2[property] : undefined;
    if (param2 === undefined) destination[property] = Styling(param1);else {
      destination[property] = createStyling(true, param1, param2);
    }
  }

  if (stylings2) for (let property in stylings2) {
    if (!stylings1[property]) destination[property] = Styling(stylings2[property]);
  }
  return destination;
}
function extendCss(stylings1, stylings2) {
  for (let property in stylings2) {
    let param2 = stylings2[property];
    let param1 = stylings1[property];
    if (param1 === undefined) stylings1[property] = Styling(param2);else {
      stylings1[property] = createStyling(false, param1, param2);
    }
  }
}

function PluginManager(plugins, pluginData) {
  let instances = [];

  if (plugins) {
    for (let i = 0; i < plugins.length; i++) {
      let instance = plugins[i](pluginData);
      if (instance) instances.push(instance);
    }
  }

  let disposes = [];
  return {
    buildApi(api) {
      for (let i = 0; i < instances.length; i++) {
        let dispose = instances[i].buildApi?.(api);
        if (dispose) disposes.push(dispose);
      }
    },

    dispose() {
      for (let i = 0; i < disposes.length; i++) {
        disposes[i]();
      }

      disposes = null;

      for (let i = 0; i < instances.length; i++) {
        instances[i].dispose?.();
      }

      instances = null;
    }

  };
}
function plugDefaultConfig(constructors, defaults) {
  for (let i = 0; i < constructors.length; i++) {
    constructors[i].plugDefaultConfig?.(defaults);
  }
}
function plugMergeSettings(constructors, configuration, defaults, settings) {
  for (let i = 0; i < constructors.length; i++) {
    constructors[i].plugMergeSettings?.(configuration, defaults, settings);
  }
}
function plugStaticDom(constructors, aspects) {
  for (let i = 0; i < constructors.length; i++) {
    constructors[i].plugStaticDom?.(aspects);
  }
}

function PickDomFactory(css, componentPropertiesAspect, optionPropertiesAspect, pickButtonAspect) {
  return {
    create(pickElement, wrap, remove) {
      let eventBinder = EventBinder();
      let buttonHTML = pickButtonAspect.getButtonHTML();
      pickElement.innerHTML = '<span></span>' + buttonHTML;
      let pickContentElement = pickElement.querySelector('SPAN');
      let pickButtonElement = pickElement.querySelector('BUTTON');
      eventBinder.bind(pickButtonElement, "click", remove);
      addStyling(pickContentElement, css.pickContent);
      addStyling(pickButtonElement, css.pickButton);
      let disableToggle = toggleStyling(pickContentElement, css.pickContent_disabled);

      function updateData() {
        pickContentElement.textContent = optionPropertiesAspect.getText(wrap.option);
      }

      function updateDisabled() {
        disableToggle(wrap.isOptionDisabled);
      }

      function updateComponentDisabled() {
        pickButtonElement.disabled = componentPropertiesAspect.getDisabled();
      }

      return {
        pickDom: {
          pickContentElement,
          pickButtonElement
        },
        pickDomManagerHandlers: {
          updateData,
          updateDisabled,
          updateComponentDisabled
        },

        dispose() {
          eventBinder.unbind();
        }

      };
    }

  };
}

function ChoiceDomFactory(css, optionPropertiesAspect, highlightAspect) {
  var updateHighlightedInternal = function (wrap, choiceDom, element) {
    var text = optionPropertiesAspect.getText(wrap.option);
    var highlighter = highlightAspect.getHighlighter();
    if (highlighter) highlighter(element, choiceDom, text);else element.textContent = text;
  };

  var updateDataInternal = function (wrap, element) {
    element.textContent = optionPropertiesAspect.getText(wrap.option);
  }; //TODO move check which aspects availbale like wrap.hasOwnProperty("isOptionSelected") to there


  return {
    create(choiceElement, wrap, toggle) {
      let choiceDom = null;
      let choiceDomManagerHandlers = null;
      let eventBinder = EventBinder();
      eventBinder.bind(choiceElement, "click", toggle);

      if (wrap.hasOwnProperty("isOptionSelected")) {
        choiceElement.innerHTML = '<div><input formnovalidate type="checkbox"><label></label></div>';
        let choiceContentElement = choiceElement.querySelector('DIV');
        let choiceCheckBoxElement = choiceContentElement.querySelector('INPUT');
        let choiceLabelElement = choiceContentElement.querySelector('LABEL');
        addStyling(choiceContentElement, css.choiceContent);
        addStyling(choiceCheckBoxElement, css.choiceCheckBox);
        addStyling(choiceLabelElement, css.choiceLabel);
        choiceDom = {
          choiceElement,
          choiceContentElement,
          choiceCheckBoxElement,
          choiceLabelElement
        };
        let choiceSelectedToggle = toggleStyling(choiceElement, css.choice_selected);

        let updateSelected = function () {
          choiceSelectedToggle(wrap.isOptionSelected);
          choiceCheckBoxElement.checked = wrap.isOptionSelected;

          if (wrap.isOptionDisabled || wrap.choice.isHoverIn) {
            choiceHoverToggle(wrap.choice.isHoverIn, true);
          }
        };

        let choiceDisabledToggle = toggleStyling(choiceElement, css.choice_disabled);
        let choiceCheckBoxDisabledToggle = toggleStyling(choiceCheckBoxElement, css.choiceCheckBox_disabled);
        let choiceLabelDisabledToggle = toggleStyling(choiceLabelElement, css.choiceLabel_disabled);
        let choiceCursorDisabledToggle = toggleStyling(choiceElement, {
          classes: [],
          styles: {
            cursor: "default"
          }
        });

        let updateDisabled = function () {
          choiceDisabledToggle(wrap.isOptionDisabled);
          choiceCheckBoxDisabledToggle(wrap.isOptionDisabled);
          choiceLabelDisabledToggle(wrap.isOptionDisabled); // do not desable checkBox if option is selected! there should be possibility to unselect "disabled"

          let isCheckBoxDisabled = wrap.isOptionDisabled && !wrap.isOptionSelected;
          choiceCheckBoxElement.disabled = isCheckBoxDisabled;
          choiceCursorDisabledToggle(isCheckBoxDisabled);
        };

        let choiceHoverToggle = toggleStyling(choiceElement, () => {
          if (css.choice_disabled_hover && wrap.isOptionDisabled === true && wrap.isOptionSelected === false) return css.choice_disabled_hover;else return css.choice_hover;
        });

        let updateHoverIn = function () {
          choiceHoverToggle(wrap.choice.isHoverIn);
        };

        choiceDomManagerHandlers = {
          updateData: () => updateDataInternal(wrap, choiceLabelElement),
          updateHighlighted: () => updateHighlightedInternal(wrap, choiceDom, choiceLabelElement),
          updateHoverIn,
          updateDisabled,
          updateSelected
        };
      } else {
        let choiceHoverToggle = toggleStyling(choiceElement, () => wrap.isOptionDisabled && css.choice_disabled_hover ? css.choice_disabled_hover : css.choice_hover);

        let updateHoverIn = function () {
          choiceHoverToggle(wrap.choice.isHoverIn);
        };

        choiceElement.innerHTML = '<span></span>';
        let choiceContentElement = choiceElement.querySelector('SPAN');
        choiceDom = {
          choiceElement,
          choiceContentElement
        };
        choiceDomManagerHandlers = {
          updateData: () => updateDataInternal(wrap, choiceContentElement),
          updateHighlighted: () => updateHighlightedInternal(wrap, choiceDom, choiceElement),
          updateHoverIn
        };
      }

      return {
        choiceDom,
        choiceDomManagerHandlers,

        dispose() {
          eventBinder.unbind();
        }

      };
    }

  };
}

function CreateElementAspect(createElement) {
  return {
    createElement
  };
}
function StaticDomFactory(choicesDomFactory, createElementAspect) {
  return {
    create(css) {
      let choicesDom = choicesDomFactory.create(css);
      return {
        choicesDom,

        createStaticDom(element, containerClass) {
          function showError(message) {
            element.style.backgroundColor = 'red';
            element.style.color = 'white';
            throw new Error(message);
          }

          let containerElement, picksElement;
          let removableContainerClass = false;

          if (element.tagName == 'DIV') {
            containerElement = element;

            if (!containerElement.classList.contains(containerClass)) {
              containerElement.classList.add(containerClass);
              removableContainerClass = true;
            }

            picksElement = findDirectChildByTagName(containerElement, 'UL');
          } else if (element.tagName == 'UL') {
            picksElement = element;
            containerElement = closestByClassName(element, containerClass);

            if (!containerElement) {
              showError('BsMultiSelect: defined on UL but precedentant DIV for container not found; class=' + containerClass);
            }
          } else if (element.tagName == "INPUT") {
            showError('BsMultiSelect: INPUT element is not supported');
          }

          let isDisposablePicksElement = false;

          if (!picksElement) {
            picksElement = createElementAspect.createElement('UL');
            isDisposablePicksElement = true;
          }

          return {
            choicesDom,
            staticDom: {
              initialElement: element,
              containerElement,
              picksElement,
              isDisposablePicksElement
            },
            staticManager: {
              appendToContainer() {
                containerElement.appendChild(choicesDom.choicesElement);
                if (isDisposablePicksElement) containerElement.appendChild(picksElement);
              },

              dispose() {
                containerElement.removeChild(choicesDom.choicesElement);
                if (removableContainerClass) containerElement.classList.remove(containerClass);
                if (isDisposablePicksElement) containerElement.removeChild(picksElement);
              }

            }
          };
        }

      };
    }

  };
}

function PicksDom(picksElement, isDisposablePicksElement, createElementAspect, css) {
  var pickFilterElement = createElementAspect.createElement('LI');
  addStyling(picksElement, css.picks);
  addStyling(pickFilterElement, css.pickFilter);
  let disableToggleStyling = toggleStyling(picksElement, css.picks_disabled);
  let focusToggleStyling = toggleStyling(picksElement, css.picks_focus);
  let isFocusIn = false;
  return {
    picksElement,
    pickFilterElement,

    createPickElement() {
      var pickElement = createElementAspect.createElement('LI');
      addStyling(pickElement, css.pick);
      return {
        pickElement,
        attach: beforeElement => picksElement.insertBefore(pickElement, beforeElement ?? pickFilterElement),
        detach: () => picksElement.removeChild(pickElement)
      };
    },

    disable(isComponentDisabled) {
      disableToggleStyling(isComponentDisabled);
    },

    toggleFocusStyling() {
      focusToggleStyling(isFocusIn);
    },

    getIsFocusIn() {
      return isFocusIn;
    },

    setIsFocusIn(newIsFocusIn) {
      isFocusIn = newIsFocusIn;
    },

    dispose() {
      if (!isDisposablePicksElement) {
        disableToggleStyling(false);
        focusToggleStyling(false);
        if (pickFilterElement.parentNode) pickFilterElement.parentNode.removeChild(pickFilterElement);
      }
    }

  };
}

function FilterDom(isDisposablePicksElement, createElementAspect, css) {
  var filterInputElement = createElementAspect.createElement('INPUT');
  addStyling(filterInputElement, css.filterInput);
  filterInputElement.setAttribute("type", "search");
  filterInputElement.setAttribute("autocomplete", "off");
  var eventBinder = EventBinder();
  return {
    filterInputElement,

    isEmpty() {
      return filterInputElement.value ? false : true;
    },

    setEmpty() {
      filterInputElement.value = '';
    },

    getValue() {
      return filterInputElement.value;
    },

    setFocus() {
      filterInputElement.focus();
    },

    setWidth(text) {
      filterInputElement.style.width = text.length * 1.3 + 2 + "ch";
    },

    // TODO: check why I need this comparision? 
    setFocusIfNotTarget(target) {
      if (target != filterInputElement) filterInputElement.focus();
    },

    onInput(onFilterInputInput) {
      eventBinder.bind(filterInputElement, 'input', onFilterInputInput);
    },

    onFocusIn(onFocusIn) {
      eventBinder.bind(filterInputElement, 'focusin', onFocusIn);
    },

    onFocusOut(onFocusOut) {
      eventBinder.bind(filterInputElement, 'focusout', onFocusOut);
    },

    onKeyDown(onfilterInputKeyDown) {
      eventBinder.bind(filterInputElement, 'keydown', onfilterInputKeyDown);
    },

    onKeyUp(onFilterInputKeyUp) {
      eventBinder.bind(filterInputElement, 'keyup', onFilterInputKeyUp);
    },

    dispose() {
      eventBinder.unbind();

      if (!isDisposablePicksElement) {
        if (filterInputElement.parentNode) filterInputElement.parentNode.removeChild(filterInputElement);
      }
    }

  };
}

function ChoicesDomFactory(createElementAspect) {
  return {
    create(css) {
      var choicesElement = createElementAspect.createElement('DIV');
      var choicesListElement = createElementAspect.createElement('UL');
      choicesElement.appendChild(choicesListElement);
      choicesElement.style.display = 'none';
      addStyling(choicesElement, css.choices);
      addStyling(choicesListElement, css.choicesList);
      return {
        choicesElement,
        choicesListElement,

        createChoiceElement() {
          var choiceElement = createElementAspect.createElement('LI');
          addStyling(choiceElement, css.choice);
          return {
            choiceElement,
            setVisible: isVisible => choiceElement.style.display = isVisible ? 'block' : 'none',
            attach: beforeElement => choicesListElement.insertBefore(choiceElement, beforeElement),
            detach: () => choicesListElement.removeChild(choiceElement)
          };
        }

      };
    }

  };
}

function ChoicesVisibilityAspect(choicesElement) {
  return {
    isChoicesVisible() {
      return choicesElement.style.display != 'none';
    },

    setChoicesVisible(visible) {
      choicesElement.style.display = visible ? 'block' : 'none';
    },

    updatePopupLocation() {}

  };
}

function SpecialPicksEventsAspect() {
  return {
    backSpace(pick) {
      pick.setSelectedFalse();
    }

  };
}

function TriggerAspect(element, trigger) {
  return {
    trigger: eventName => {
      trigger(element, eventName);
    }
  };
}
function OnChangeAspect(triggerAspect, name) {
  return {
    onChange() {
      triggerAspect.trigger(name);
    }

  };
}
function ComponentPropertiesAspect(getDisabled) {
  return {
    getDisabled
  };
}

function OptionsAspect(options) {
  return {
    getOptions: () => options
  };
}
function OptionPropertiesAspect(getText) {
  if (!getText) {
    getText = option => option.text;
  }

  return {
    getText
  };
}

function ChoicesEnumerableAspect(countableChoicesList, getNext) {
  return {
    forEach(f) {
      let wrap = countableChoicesList.getHead();

      while (wrap) {
        f(wrap);
        wrap = getNext(wrap);
      }
    }

  };
}

function NavigateManager(list, getPrev, getNext) {
  return {
    navigate(down, wrap
    /* hoveredChoice */
    ) {
      if (down) {
        return wrap ? getNext(wrap) : list.getHead();
      } else {
        return wrap ? getPrev(wrap) : list.getTail();
      }
    },

    getCount() {
      return list.getCount();
    },

    getHead() {
      return list.getHead();
    }

  };
}
function FilterPredicateAspect() {
  return {
    filterPredicate: (wrap, text) => wrap.choice.searchText.indexOf(text) >= 0
  };
}
function FilterManagerAspect(emptyNavigateManager, filteredNavigateManager, filteredChoicesList, choicesEnumerableAspect, filterPredicateAspect) {
  let showEmptyFilter = true;
  let filterText = "";
  return {
    getNavigateManager() {
      return showEmptyFilter ? emptyNavigateManager : filteredNavigateManager;
    },

    processEmptyInput() {
      // redefined in PlaceholderPulgin, HighlightPlugin
      showEmptyFilter = true;
      filterText = "";
      choicesEnumerableAspect.forEach(wrap => {
        wrap.choice.setVisible(true);
      });
    },

    getFilter() {
      return filterText;
    },

    setFilter(text) {
      // redefined in  HighlightPlugin
      showEmptyFilter = false;
      filterText = text;
      filteredChoicesList.reset();
      choicesEnumerableAspect.forEach(wrap => {
        wrap.choice.filteredPrev = wrap.choice.filteredNext = null;
        var v = filterPredicateAspect.filterPredicate(wrap, text);
        if (v) filteredChoicesList.add(wrap);
        wrap.choice.setVisible(v);
      });
    }

  };
}

function BuildAndAttachChoiceAspect(buildChoiceAspect) {
  return {
    buildAndAttachChoice(wrap, getNextElement) {
      buildChoiceAspect.buildChoice(wrap);
      wrap.choice.choiceElementAttach(getNextElement?.());
    }

  };
}
function BuildChoiceAspect(choicesDom, choiceDomFactory, choiceClickAspect) {
  return {
    buildChoice(wrap) {
      var {
        choiceElement,
        setVisible,
        attach,
        detach
      } = choicesDom.createChoiceElement();
      wrap.choice.choiceElement = choiceElement;
      wrap.choice.choiceElementAttach = attach;
      wrap.choice.isChoiceElementAttached = true;
      let {
        dispose,
        choiceDom,
        choiceDomManagerHandlers
      } = choiceDomFactory.create(choiceElement, wrap, () => choiceClickAspect.choiceClick(wrap));
      wrap.choice.choiceDom = choiceDom;
      choiceDomManagerHandlers.updateData();
      if (choiceDomManagerHandlers.updateSelected) choiceDomManagerHandlers.updateSelected();
      if (choiceDomManagerHandlers.updateDisabled) choiceDomManagerHandlers.updateDisabled();
      wrap.choice.choiceDomManagerHandlers = choiceDomManagerHandlers;

      wrap.choice.remove = () => {
        detach();
      };

      wrap.choice.isFilteredIn = true;

      wrap.choice.setHoverIn = v => {
        wrap.choice.isHoverIn = v;
        choiceDomManagerHandlers.updateHoverIn();
      };

      wrap.choice.setVisible = v => {
        wrap.choice.isFilteredIn = v;
        setVisible(wrap.choice.isFilteredIn);
      };

      wrap.choice.dispose = () => {
        wrap.choice.choiceDomManagerHandlers = null;
        dispose();
        wrap.choice.choiceElement = null;
        wrap.choice.choiceDom = null;
        wrap.choice.choiceElementAttach = null;
        wrap.choice.isChoiceElementAttached = false;
        wrap.choice.remove = null; // not real data manipulation but internal state

        wrap.choice.setVisible = null; // TODO: refactor it there should be 3 types of not visibility: for hidden, for filtered out, for optgroup, for message item

        wrap.choice.setHoverIn = null;
        wrap.choice.dispose = null;
      };

      wrap.dispose = () => {
        wrap.choice.dispose();
        wrap.dispose = null;
      };
    }

  };
}

function OptionAttachAspect(createWrapAspect, createChoiceBaseAspect, buildAndAttachChoiceAspect, wraps) {
  return {
    attach(option) {
      let wrap = createWrapAspect.createWrap(option);
      wrap.choice = createChoiceBaseAspect.createChoiceBase(option); // let optGroup = optGroupAspect.getOptionOptGroup(option);
      // if (prevOptGroup != optGroup){
      //     currentOptGroup = optGroup;
      //     var optGroupWrap = optGroupBuildAspect.wrapAndAttachOptGroupItem(option);
      // }
      // wrap.optGroup = currentOptGroup;

      wraps.push(wrap); // note: before attach because attach need it for navigation management

      buildAndAttachChoiceAspect.buildAndAttachChoice(wrap); //wraps.push(wrap);
    }

  };
}
function OptionsLoopAspect(optionsAspect, optionAttachAspect) {
  return {
    loop() {
      let options = optionsAspect.getOptions();

      for (let i = 0; i < options.length; i++) {
        let option = options[i];
        optionAttachAspect.attach(option);
      }
    }

  };
}

function UpdateDataAspect(choicesDom, wraps, picksList, optionsLoopAspect, resetLayoutAspect) {
  return {
    updateData() {
      // close drop down , remove filter
      resetLayoutAspect.resetLayout();
      choicesDom.choicesListElement.innerHTML = ""; // TODO: there should better "optimization"

      wraps.clear();
      picksList.forEach(pick => pick.dispose());
      picksList.reset();
      optionsLoopAspect.loop();
    }

  };
}
function UpdateAspect(updateDataAspect) {
  return {
    update() {
      updateDataAspect.updateData();
    }

  };
}

function IsChoiceSelectableAspect() {
  // TODO rename to IsSelectableByUserAspect ?
  return {
    isSelectable: wrap => true
  };
} // todo: remove?

function ChoiceClickAspect(optionToggleAspect, filterDom) {
  return {
    choiceClick: wrap => {
      optionToggleAspect.toggle(wrap);
      filterDom.setFocus();
    }
  };
} // // fullMatchAspect trySetWrapSelected(fullMatchWrap.option, composeUpdateSelected(fullMatchWrap, true), true);

function OptionToggleAspect(createPickHandlersAspect, addPickAspect
/*, setOptionSelectedAspect*/
) {
  return {
    toggle: wrap => {
      let pickHandlers = createPickHandlersAspect.createPickHandlers(wrap);
      addPickAspect.addPick(wrap, pickHandlers);
      return true; // TODO: process setOptionSelectedAspect
    }
  };
}
function AddPickAspect() {
  return {
    addPick(wrap, pickHandlers) {
      return pickHandlers.producePick();
    }

  };
}
function FullMatchAspect(createPickHandlersAspect, addPickAspect) {
  return {
    fullMatch(wrap) {
      let pickHandlers = createPickHandlersAspect.createPickHandlers(wrap);
      addPickAspect.addPick(wrap, pickHandlers);
      return true; // TODO: process setOptionSelectedAspect
    }

  };
}
function RemovePickAspect() {
  return {
    removePick(wrap, pick) {
      pick.dispose(); // overrided in SelectedOptionPlugin with trySetWrapSelected(wrap, false);
    }

  };
}
function ProducePickAspect(picksList, removePickAspect, buildPickAspect) {
  return {
    producePick(wrap, pickHandlers) {
      let pick = buildPickAspect.buildPick(wrap, event => pickHandlers.removeOnButton(event));

      let fixSelectedFalse = () => removePickAspect.removePick(wrap, pick);

      pickHandlers.removeOnButton = fixSelectedFalse;
      pick.pickElementAttach();
      let {
        remove: removeFromPicksList
      } = picksList.add(pick);
      pick.setSelectedFalse = fixSelectedFalse;
      pick.wrap = wrap;
      pick.dispose = composeSync(removeFromPicksList, () => {
        pick.setSelectedFalse = null;
        pick.wrap = null;
      }, pick.dispose);

      pickHandlers.removeAndDispose = () => pick.dispose();

      return pick;
    }

  };
} // redefined in MultiSelectInlineLayout to redefine handlers removeOnButton
// redefined in SelectedOptionPlugin to compose wrap.updateSelected

function CreatePickHandlersAspect(producePickAspect) {
  return {
    createPickHandlers(wrap) {
      let pickHandlers = {
        producePick: null,
        // not redefined directly, but redefined in addPickAspect
        removeAndDispose: null,
        // not redefined, 
        removeOnButton: null // redefined in MultiSelectInlineLayout

      };

      pickHandlers.producePick = () => producePickAspect.producePick(wrap, pickHandlers);

      return pickHandlers;
    }

  };
}
function CreateChoiceBaseAspect(optionPropertiesAspect) {
  return {
    createChoiceBase(option) {
      return {
        //updateDisabled:null,  
        //updateHidden:null,
        // navigation and filter support
        filteredPrev: null,
        filteredNext: null,
        searchText: optionPropertiesAspect.getText(option).toLowerCase().trim(),
        // TODO make an index abstraction
        // internal state handlers, so they do not have "update semantics"
        isHoverIn: false,
        isFilteredIn: false,
        setVisible: null,
        setHoverIn: null,
        // TODO: is it a really sense to have them there?
        isChoiceElementAttached: false,
        choiceElement: null,
        choiceDom: null,
        choiceElementAttach: null,
        itemPrev: null,
        itemNext: null,
        remove: null,
        dispose: null
      };
    }

  };
}
function CreateWrapAspect() {
  return {
    createWrap(option) {
      return {
        option: option
      };
    }

  };
}

function HoveredChoiceAspect() {
  let hoveredChoice = null;
  return {
    getHoveredChoice: () => hoveredChoice,
    setHoveredChoice: wrap => {
      hoveredChoice = wrap;
    },

    resetHoveredChoice() {
      if (hoveredChoice) {
        hoveredChoice.choice.setHoverIn(false);
        hoveredChoice = null;
      }
    }

  };
}
function NavigateAspect(hoveredChoiceAspect, navigate) {
  return {
    hoverIn(wrap) {
      hoveredChoiceAspect.resetHoveredChoice();
      hoveredChoiceAspect.setHoveredChoice(wrap);
      wrap.choice.setHoverIn(true);
    },

    navigate: down => navigate(down, hoveredChoiceAspect.getHoveredChoice())
  };
}

function Wraps(wrapsCollection, listFacade_reset, listFacade_remove, listFacade_add) {
  return {
    push: wrap => push(wrap, wrapsCollection, listFacade_add),
    insert: (key, wrap) => insert(key, wrap, wrapsCollection, listFacade_add),
    remove: key => {
      var wrap = wrapsCollection.remove(key);
      listFacade_remove(wrap);
      return wrap;
    },
    clear: () => {
      wrapsCollection.reset();
      listFacade_reset();
    },
    dispose: () => wrapsCollection.forLoop(wrap => wrap.dispose())
  };
}

function push(wrap, wrapsCollection, listFacade_add) {
  wrapsCollection.push(wrap);
  listFacade_add(wrap);
}

function insert(key, wrap, wrapsCollection, listFacade_add) {
  if (key >= wrapsCollection.getCount()) {
    push(wrap, wrapsCollection, listFacade_add);
  } else {
    wrapsCollection.add(wrap, key);
    listFacade_add(wrap, key);
  }
}

function PickButtonAspect(buttonHTML) {
  return {
    getButtonHTML: () => buttonHTML
  };
}

function BuildPickAspect(picksDom, pickDomFactory) {
  return {
    buildPick(wrap, removeOnButton) {
      let {
        pickElement,
        attach,
        detach
      } = picksDom.createPickElement();
      let {
        dispose,
        pickDom,
        pickDomManagerHandlers
      } = pickDomFactory.create(pickElement, wrap, removeOnButton);
      pickDomManagerHandlers.updateData();
      if (pickDomManagerHandlers.updateDisabled) pickDomManagerHandlers.updateDisabled();
      if (pickDomManagerHandlers.updateComponentDisabled) pickDomManagerHandlers.updateComponentDisabled();
      let pick = {
        pickDom,
        pickDomManagerHandlers,
        pickElementAttach: attach,
        dispose: () => {
          detach();
          dispose();
          pick.pickDomManagerHandlers = null;
          pick.pickDom = pickDom;
          pick.pickElementAttach = null;
          pick.dispose = null;
        }
      };
      return pick;
    }

  };
}

function InputAspect(filterDom, filterManagerAspect, fullMatchAspect) {
  return {
    // overrided in SelectedOptionPlugin
    processInput() {
      let filterInputValue = filterDom.getValue();
      let text = filterInputValue.trim();
      var isEmpty = false;
      if (text == '') isEmpty = true;else {
        filterManagerAspect.setFilter(text.toLowerCase());
      }

      if (!isEmpty) {
        if (filterManagerAspect.getNavigateManager().getCount() == 1) {
          // todo: move exact match to filterManager
          let fullMatchWrap = filterManagerAspect.getNavigateManager().getHead();
          let text = filterManagerAspect.getFilter();

          if (fullMatchWrap.choice.searchText == text) {
            let success = fullMatchAspect.fullMatch(fullMatchWrap);

            if (success) {
              filterDom.setEmpty();
              isEmpty = true;
            }
          }
        }
      }

      return {
        filterInputValue,
        isEmpty
      };
    }

  };
}

function ResetFilterListAspect(filterDom, filterManagerAspect) {
  return {
    forceResetFilter() {
      // over in PlaceholderPlugin
      filterDom.setEmpty();
      filterManagerAspect.processEmptyInput(); // over in PlaceholderPlugin
    }

  };
}
function ResetFilterAspect(filterDom, resetFilterListAspect) {
  return {
    resetFilter() {
      // call in OptionsApiPlugin
      if (!filterDom.isEmpty()) // call in Placeholder
        resetFilterListAspect.forceResetFilter(); // over in Placeholder
    }

  };
}
function FocusInAspect(picksDom) {
  return {
    setFocusIn(focus) {
      // call in OptionsApiPlugin
      picksDom.setIsFocusIn(focus); // unique call, call BsAppearancePlugin

      picksDom.toggleFocusStyling(); // over BsAppearancePlugin
    }

  };
}

function MultiSelectInlineLayout(aspects) {
  let {
    environment,
    filterDom,
    picksDom,
    choicesDom,
    choicesVisibilityAspect,
    hoveredChoiceAspect,
    navigateAspect,
    filterManagerAspect,
    focusInAspect,
    optionToggleAspect,
    createPickHandlersAspect,
    picksList,
    inputAspect,
    specialPicksEventsAspect,
    buildChoiceAspect,
    disableComponentAspect,
    resetLayoutAspect,
    placeholderStopInputAspect,
    warningAspect,
    configuration,
    createPopperAspect,
    rtlAspect,
    staticManager
  } = aspects;
  let picksElement = picksDom.picksElement;
  let choicesElement = choicesDom.choicesElement; // pop up layout, require createPopperPlugin

  let filterInputElement = filterDom.filterInputElement;
  let pop = createPopperAspect.createPopper(choicesElement, filterInputElement, true);
  staticManager.appendToContainer = composeSync(staticManager.appendToContainer, pop.init);
  var origBackSpace = specialPicksEventsAspect.backSpace;

  specialPicksEventsAspect.backSpace = pick => {
    origBackSpace(pick);
    pop.update();
  };

  if (rtlAspect) {
    let origUpdateRtl = rtlAspect.updateRtl;

    rtlAspect.updateRtl = isRtl => {
      origUpdateRtl(isRtl);
      pop.setRtl(isRtl);
    };
  }

  choicesVisibilityAspect.updatePopupLocation = composeSync(choicesVisibilityAspect.updatePopupLocation, function () {
    pop.update();
  });

  if (warningAspect) {
    let pop2 = createPopperAspect.createPopper(warningAspect.warningElement, filterInputElement, false);
    staticManager.appendToContainer = composeSync(staticManager.appendToContainer, pop2.init);

    if (rtlAspect) {
      let origUpdateRtl2 = rtlAspect.updateRtl;

      rtlAspect.updateRtl = isRtl => {
        origUpdateRtl2(isRtl);
        pop2.setRtl(isRtl);
      };
    }

    var origWarningAspectShow = warningAspect.show;

    warningAspect.show = msg => {
      pop2.update();
      origWarningAspectShow(msg);
    };

    pop.dispose = composeSync(pop.dispose, pop2.dispose);
  }

  var window = environment.window;
  var document = window.document;
  var eventLoopFlag = EventLoopProlongableFlag(window);
  var skipFocusout = false;

  function getSkipFocusout() {
    return skipFocusout;
  }

  function resetSkipFocusout() {
    skipFocusout = false;
  }

  function setSkipFocusout() {
    skipFocusout = true;
  }

  var skipoutMousedown = function () {
    setSkipFocusout();
  };

  var documentMouseup = function (event) {
    // if we would left without focus then "close the drop" do not remove focus border
    if (choicesElement == event.target) filterDom.setFocus(); // if click outside container - close dropdown
    else if (!containsAndSelf(choicesElement, event.target) && !containsAndSelf(picksElement, event.target)) {
      resetLayoutAspect.resetLayout();
      focusInAspect.setFocusIn(false);
    }
  };

  function showChoices() {
    if (!choicesVisibilityAspect.isChoicesVisible()) {
      choicesVisibilityAspect.updatePopupLocation();
      eventLoopFlag.set();
      choicesVisibilityAspect.setChoicesVisible(true); // TODO: move to scroll plugin

      choicesElement.scrollTop = 0; // add listeners that manages close dropdown on  click outside container

      choicesElement.addEventListener("mousedown", skipoutMousedown);
      document.addEventListener("mouseup", documentMouseup);
    }
  }

  function hideChoices() {
    resetMouseCandidateChoice();
    hoveredChoiceAspect.resetHoveredChoice();

    if (choicesVisibilityAspect.isChoicesVisible()) {
      // COOMENT OUT DEBUGGING popup layout
      choicesVisibilityAspect.setChoicesVisible(false);
      choicesElement.removeEventListener("mousedown", skipoutMousedown);
      document.removeEventListener("mouseup", documentMouseup);
    }
  }

  var preventDefaultClickEvent = null;
  var componentDisabledEventBinder = EventBinder(); // TODO: remove setTimeout: set on start of mouse event reset on end

  function skipoutAndResetMousedown() {
    skipoutMousedown();
    window.setTimeout(() => resetSkipFocusout());
  }

  picksElement.addEventListener("mousedown", skipoutAndResetMousedown);

  function clickToShowChoices(event) {
    filterDom.setFocusIfNotTarget(event.target);

    if (preventDefaultClickEvent != event) {
      if (choicesVisibilityAspect.isChoicesVisible()) {
        hideChoices();
      } else {
        if (filterManagerAspect.getNavigateManager().getCount() > 0) showChoices();
      }
    }

    preventDefaultClickEvent = null;
  }

  function processUncheck(uncheckOption, event) {
    // we can't remove item on "click" in the same loop iteration - it is unfrendly for 3PP event handlers (they will get detached element)
    // never remove elements in the same event iteration
    window.setTimeout(() => uncheckOption());
    preventDefaultClickEvent = event; // setPreventDefaultMultiSelectEvent
  } // function handleOnRemoveButton(onRemove, setSelectedFalse){
  //     // processRemoveButtonClick removes the item
  //     // what is a problem with calling 'remove' directly (not using  setTimeout('remove', 0)):
  //     // consider situation "MultiSelect" on DROPDOWN (that should be closed on the click outside dropdown)
  //     // therefore we aslo have document's click's handler where we decide to close or leave the DROPDOWN open.
  //     // because of the event's bubling process 'remove' runs first. 
  //     // that means the event's target element on which we click (the x button) will be removed from the DOM together with badge 
  //     // before we could analize is it belong to our dropdown or not.
  //     // important 1: we can't just the stop propogation using stopPropogate because click outside dropdown on the similar 
  //     // component that use stopPropogation will not close dropdown (error, dropdown should be closed)
  //     // important 2: we can't change the dropdown's event handler to leave dropdown open if event's target is null because of
  //     // the situation described above: click outside dropdown on the same component.
  //     // Alternatively it could be possible to use stopPropogate but together create custom click event setting new target 
  //     // that belomgs to DOM (e.g. panel)
  //     onRemove(event => {
  //         processUncheck(setSelectedFalse, event);
  //         hideChoices();
  //         resetFilterAspect.resetFilter(); 
  //     });
  // }


  function handleOnRemoveButton(setSelectedFalse) {
    return event => {
      processUncheck(setSelectedFalse, event);
      resetLayoutAspect.resetLayout();
    };
  }

  let mouseCandidateEventBinder = EventBinder();

  var resetMouseCandidateChoice = () => {
    mouseCandidateEventBinder.unbind();
  };

  var mouseOverToHoveredAndReset = wrap => {
    if (!wrap.choice.isHoverIn) navigateAspect.hoverIn(wrap);
    resetMouseCandidateChoice();
  };

  function adoptChoiceElement(wrap) {
    let choiceElement = wrap.choice.choiceElement; // in chrome it happens on "become visible" so we need to skip it, 
    // for IE11 and edge it doesn't happens, but for IE11 and Edge it doesn't happens on small 
    // mouse moves inside the item. 
    // https://stackoverflow.com/questions/59022563/browser-events-mouseover-doesnt-happen-when-you-make-element-visible-and-mous

    var onChoiceElementMouseover = () => {
      if (eventLoopFlag.get()) {
        resetMouseCandidateChoice();
        mouseCandidateEventBinder.bind(choiceElement, 'mousemove', () => mouseOverToHoveredAndReset(wrap));
        mouseCandidateEventBinder.bind(choiceElement, 'mousedown', () => mouseOverToHoveredAndReset(wrap));
      } else {
        if (!wrap.choice.isHoverIn) {
          // NOTE: mouseleave is not enough to guarantee remove hover styles in situations
          // when style was setuped without mouse (keyboard arrows)
          // therefore force reset manually (done inside hoverIn)
          navigateAspect.hoverIn(wrap);
        }
      }
    }; // note 1: mouseleave preferred to mouseout - which fires on each descendant
    // note 2: since I want add aditional info panels to the dropdown put mouseleave on dropdwon would not work


    var onChoiceElementMouseleave = () => {
      if (!eventLoopFlag.get()) {
        hoveredChoiceAspect.resetHoveredChoice();
      }
    };

    var overAndLeaveEventBinder = EventBinder();
    overAndLeaveEventBinder.bind(choiceElement, 'mouseover', onChoiceElementMouseover);
    overAndLeaveEventBinder.bind(choiceElement, 'mouseleave', onChoiceElementMouseleave);
    return overAndLeaveEventBinder.unbind;
  }

  filterDom.onFocusIn(() => focusInAspect.setFocusIn(true));
  filterDom.onFocusOut(() => {
    if (!getSkipFocusout()) {
      // skip initiated by mouse click (we manage it different way)
      resetLayoutAspect.resetLayout(); // if do not do this we will return to filtered list without text filter in input

      focusInAspect.setFocusIn(false);
    }

    resetSkipFocusout();
  }); // it can be initated by 3PP functionality
  // sample (1) BS functionality - input x button click - clears input
  // sample (2) BS functionality - esc keydown - clears input
  // and there could be difference in processing: (2) should hide the menu, then reset , when (1) should just reset without hiding.

  function afterInput() {
    let visibleCount = filterManagerAspect.getNavigateManager().getCount();

    if (visibleCount > 0) {
      if (warningAspect) {
        warningAspect.hide();
      }

      let panelIsVisble = choicesVisibilityAspect.isChoicesVisible();

      if (!panelIsVisble) {
        showChoices();
      }

      if (visibleCount == 1) {
        navigateAspect.hoverIn(filterManagerAspect.getNavigateManager().getHead());
      } else {
        if (panelIsVisble) hoveredChoiceAspect.resetHoveredChoice();
      }
    } else {
      if (choicesVisibilityAspect.isChoicesVisible()) {
        hideChoices();
      }

      if (warningAspect) {
        if (filterManagerAspect.getFilter()) warningAspect.show(configuration.noResultsWarning);else warningAspect.hide();
      }
    }
  }

  filterDom.onInput(() => {
    if (placeholderStopInputAspect && placeholderStopInputAspect.get()) {
      placeholderStopInputAspect.reset();
      return;
    }

    let {
      filterInputValue,
      isEmpty
    } = inputAspect.processInput();
    if (isEmpty) filterManagerAspect.processEmptyInput();else filterDom.setWidth(filterInputValue);
    eventLoopFlag.set(); // means disable mouse handlers that set hovered item; otherwise we will get "Hover On MouseEnter" when filter's changes should remove hover

    afterInput();
  });

  function keyDownArrow(down) {
    let wrap = navigateAspect.navigate(down);

    if (wrap) {
      // TODO: next line should be moved to planned  "HeightAndScroll" plugin, actual only for scrolling with keyDown functionality
      eventLoopFlag.set(400); // means disable mouse handlers that set hovered choice item; arrowDown can intiate scrolling when scrolling can itiate mouse leave on hovered item; this stops it

      navigateAspect.hoverIn(wrap); // !

      showChoices();
    }
  }

  function hoveredToSelected() {
    let hoveredWrap = hoveredChoiceAspect.getHoveredChoice();

    if (hoveredWrap) {
      let wasToggled = optionToggleAspect.toggle(hoveredWrap);

      if (wasToggled) {
        resetLayoutAspect.resetLayout();
      }
    }
  } // TODO: bind it more declarative way? (compact code)


  var onKeyDown = event => {
    let keyCode = event.which;
    var empty = filterDom.isEmpty();

    if ([13, 27 // '27-esc' there is "just in case", I can imagine that there are user agents that do UNDO
    ].indexOf(keyCode) >= 0 || keyCode == 9 && !empty //  otherwice there are no keyup (true at least for '9-tab'),
    ) {
      event.preventDefault(); // '13-enter'  - prevention against form's default button 
      // but doesn't help with bootsrap modal ESC or ENTER (close behaviour);
    }

    if ([38, 40].indexOf(keyCode) >= 0) event.preventDefault();

    if (keyCode == 8
    /*backspace*/
    ) {
      // NOTE: this will process backspace only if there are no text in the input field
      // If user will find this inconvinient, we will need to calculate something like this
      // let isBackspaceAtStartPoint = (this.filterInput.selectionStart == 0 && this.filterInput.selectionEnd == 0);
      if (empty) {
        let pick = picksList.getTail();

        if (pick) {
          specialPicksEventsAspect.backSpace(pick);
        }
      }
    } // ---------------------------------------------------------------------------------
    // NOTE: no preventDefault called in case of empty for 9-tab
    else if (keyCode == 9
    /*tab*/
    ) {
      // NOTE: no keydown for this (without preventDefaul after TAB keyup event will be targeted another element)  
      if (empty) {
        hideChoices(); // hideChoices inside (and no filter reset since it is empty) 
      }
    } else if (keyCode == 27
    /*esc*/
    ) {
      // NOTE: forbid the ESC to close the modal (in case the nonempty or dropdown is open)
      if (!empty || choicesVisibilityAspect.isChoicesVisible()) event.stopPropagation();
    } else if (keyCode == 38) {
      keyDownArrow(false); // up
    } else if (keyCode == 40) {
      keyDownArrow(true); // down
    }
  };

  var onKeyUp = event => {
    let keyCode = event.which; //var handler = keyUp[event.which/* key code */];
    //handler();    

    if (keyCode == 9) {
      if (choicesVisibilityAspect.isChoicesVisible()) {
        hoveredToSelected();
      }
    } else if (keyCode == 13) {
      if (choicesVisibilityAspect.isChoicesVisible()) {
        hoveredToSelected();
      } else {
        if (filterManagerAspect.getNavigateManager().getCount() > 0) {
          showChoices();
        }
      }
    } else if (keyCode == 27) {
      // escape
      // is it always empty (bs x can still it) 
      resetLayoutAspect.resetLayout();
    }
  };

  filterDom.onKeyDown(onKeyDown);
  filterDom.onKeyUp(onKeyUp);

  if (disableComponentAspect) {
    let origDisableComponent = disableComponentAspect.disableComponent;

    disableComponentAspect.disableComponent = isComponentDisabled => {
      origDisableComponent(isComponentDisabled);
      if (isComponentDisabled) componentDisabledEventBinder.unbind();else componentDisabledEventBinder.bind(picksElement, "click", clickToShowChoices);
    };
  }

  resetLayoutAspect.resetLayout = composeSync(hideChoices, () => {
    if (warningAspect) warningAspect.hide();
  }, resetLayoutAspect.resetLayout // resetFilter by default
  );
  let origCreatePickHandlers = createPickHandlersAspect.createPickHandlers;

  createPickHandlersAspect.createPickHandlers = wrap => {
    let pickHandlers = origCreatePickHandlers(wrap);
    pickHandlers.removeOnButton = handleOnRemoveButton(pickHandlers.removeOnButton);
    return pickHandlers;
  };

  let origBuildChoice = buildChoiceAspect.buildChoice;

  buildChoiceAspect.buildChoice = wrap => {
    origBuildChoice(wrap);
    let pickHandlers = createPickHandlersAspect.createPickHandlers(wrap);
    wrap.choice.remove = composeSync(wrap.choice.remove, () => {
      if (pickHandlers.removeAndDispose) {
        pickHandlers.removeAndDispose();
        pickHandlers.removeAndDispose = null;
      }
    });
    let unbindChoiceElement = adoptChoiceElement(wrap);
    wrap.choice.dispose = composeSync(unbindChoiceElement, wrap.choice.dispose);
  };

  return {
    dispose() {
      resetMouseCandidateChoice();
      picksElement.removeEventListener("mousedown", skipoutAndResetMousedown);
      componentDisabledEventBinder.unbind();
      pop.dispose();
    }

  };
}

function ResetLayoutAspect(resetLayout) {
  return {
    resetLayout
  };
}

function LoadAspect(optionsLoopAspect) {
  return {
    load() {
      // redriven in AppearancePlugin, FormRestoreOnBackwardPlugin
      optionsLoopAspect.loop();
    }

  };
}

function CountableChoicesListInsertAspect(countableChoicesList, wrapsCollection) {
  return {
    countableChoicesListInsert(wrap, key) {
      let choiceNext = wrapsCollection.getNext(key);
      countableChoicesList.add(wrap, choiceNext);
    }

  };
}

function BsMultiSelect(element, environment, plugins, configuration, onInit) {
  var {
    window
  } = environment;
  environment.isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
  let {
    containerClass,
    css,
    getDisabled,
    options,
    getText
  } = configuration;
  let disposeAspect = {
    dispose() {}

  };
  let triggerAspect = TriggerAspect(element, environment.trigger);
  let onChangeAspect = OnChangeAspect(triggerAspect, 'dashboardcode.multiselect:change');
  let componentPropertiesAspect = ComponentPropertiesAspect(getDisabled ?? (() => false));
  let optionsAspect = OptionsAspect(options);
  let optionPropertiesAspect = OptionPropertiesAspect(getText);
  let isChoiceSelectableAspect = IsChoiceSelectableAspect();
  let createWrapAspect = CreateWrapAspect();
  let createChoiceBaseAspect = CreateChoiceBaseAspect(optionPropertiesAspect); //let rtlAspect = RtlAspect();
  //let setOptionSelectedAspect = SetOptionSelectedAspect(optionPropertiesAspect);

  let addPickAspect = AddPickAspect();
  let removePickAspect = RemovePickAspect();
  let createElementAspect = CreateElementAspect(name => window.document.createElement(name));
  let choicesDomFactory = ChoicesDomFactory(createElementAspect);
  let staticDomFactory = StaticDomFactory(choicesDomFactory, createElementAspect);
  let wrapsCollection = ArrayFacade();
  let countableChoicesList = DoublyLinkedList(wrap => wrap.choice.itemPrev, (warp, v) => warp.choice.itemPrev = v, wrap => wrap.choice.itemNext, (wrap, v) => wrap.choice.itemNext = v);
  let countableChoicesListInsertAspect = CountableChoicesListInsertAspect(countableChoicesList, wrapsCollection);
  let choicesEnumerableAspect = ChoicesEnumerableAspect(countableChoicesList, wrap => wrap.choice.itemNext);
  let filteredChoicesList = DoublyLinkedList(wrap => wrap.choice.filteredPrev, (wrap, v) => wrap.choice.filteredPrev = v, wrap => wrap.choice.filteredNext, (wrap, v) => wrap.choice.filteredNext = v);
  let emptyNavigateManager = NavigateManager(countableChoicesList, wrap => wrap.choice.itemPrev, wrap => wrap.choice.itemNext);
  let filteredNavigateManager = NavigateManager(filteredChoicesList, wrap => wrap.choice.filteredPrev, wrap => wrap.choice.filteredNext);
  let filterPredicateAspect = FilterPredicateAspect();
  let filterManagerAspect = FilterManagerAspect(emptyNavigateManager, filteredNavigateManager, filteredChoicesList, choicesEnumerableAspect, filterPredicateAspect);
  let hoveredChoiceAspect = HoveredChoiceAspect();
  let navigateAspect = NavigateAspect(hoveredChoiceAspect, (down, hoveredChoice) => filterManagerAspect.getNavigateManager().navigate(down, hoveredChoice));
  let picksList = List();
  let wraps = Wraps(wrapsCollection, () => countableChoicesList.reset(), w => countableChoicesList.remove(w), (w, key) => countableChoicesListInsertAspect.countableChoicesListInsert(w, key));
  let aspects = {
    environment,
    configuration,
    triggerAspect,
    onChangeAspect,
    componentPropertiesAspect,
    disposeAspect,
    countableChoicesList,
    countableChoicesListInsertAspect,
    optionsAspect,
    optionPropertiesAspect,
    createWrapAspect,
    createChoiceBaseAspect,
    isChoiceSelectableAspect,
    createElementAspect,
    choicesDomFactory,
    staticDomFactory,
    filterPredicateAspect,
    wrapsCollection,
    choicesEnumerableAspect,
    filteredChoicesList,
    filterManagerAspect,
    hoveredChoiceAspect,
    navigateAspect,
    picksList,
    wraps,
    addPickAspect,
    removePickAspect
  };
  plugStaticDom(plugins, aspects); // apply cssPatch to css, apply selectElement support;  

  let {
    choicesDom,
    createStaticDom
  } = staticDomFactory.create(css);
  let {
    staticDom,
    staticManager
  } = createStaticDom(element, containerClass); // after this we can use staticDom (means generated DOM elements) in plugin construtctor, what simplifies parameters passing a lot   
  // THINK: get filterDom, picksDom  from createStaticDom ?  But this would create excesive dublicate call in  selectElementPlugin

  let filterDom = FilterDom(staticDom.isDisposablePicksElement, createElementAspect, css);
  let picksDom = PicksDom(staticDom.picksElement, staticDom.isDisposablePicksElement, createElementAspect, css);
  let specialPicksEventsAspect = SpecialPicksEventsAspect();
  let choicesVisibilityAspect = ChoicesVisibilityAspect(choicesDom.choicesElement);
  let resetFilterListAspect = ResetFilterListAspect(filterDom, filterManagerAspect);
  let resetFilterAspect = ResetFilterAspect(filterDom, resetFilterListAspect);
  let focusInAspect = FocusInAspect(picksDom);
  let pickButtonAspect = PickButtonAspect(configuration.pickButtonHTML);
  let pickDomFactory = PickDomFactory(css, componentPropertiesAspect, optionPropertiesAspect, pickButtonAspect);
  let buildPickAspect = BuildPickAspect(picksDom, pickDomFactory);
  let producePickAspect = ProducePickAspect(picksList, removePickAspect, buildPickAspect);
  let createPickHandlersAspect = CreatePickHandlersAspect(producePickAspect);
  let optionToggleAspect = OptionToggleAspect(createPickHandlersAspect, addPickAspect);
  let fullMatchAspect = FullMatchAspect(createPickHandlersAspect, addPickAspect);
  let inputAspect = InputAspect(filterDom, filterManagerAspect, fullMatchAspect);
  let choiceClickAspect = ChoiceClickAspect(optionToggleAspect, filterDom);
  let choiceDomFactory = ChoiceDomFactory(css, optionPropertiesAspect, aspects.highlightAspect); // optional highlightAspect added by highlightPlugin

  let buildChoiceAspect = BuildChoiceAspect(choicesDom, choiceDomFactory, choiceClickAspect);
  let buildAndAttachChoiceAspect = BuildAndAttachChoiceAspect(buildChoiceAspect);
  let resetLayoutAspect = ResetLayoutAspect(() => resetFilterAspect.resetFilter());
  let optionAttachAspect = OptionAttachAspect(createWrapAspect, createChoiceBaseAspect, buildAndAttachChoiceAspect, wraps);
  let optionsLoopAspect = OptionsLoopAspect(optionsAspect, optionAttachAspect);
  let updateDataAspect = UpdateDataAspect(choicesDom, wraps, picksList, optionsLoopAspect, resetLayoutAspect);
  let updateAspect = UpdateAspect(updateDataAspect);
  let loadAspect = LoadAspect(optionsLoopAspect);
  extendIfUndefined(aspects, {
    staticDom,
    picksDom,
    choicesDom,
    filterDom,
    resetLayoutAspect,
    pickDomFactory,
    choiceDomFactory,
    choicesVisibilityAspect,
    staticManager,
    buildChoiceAspect,
    optionToggleAspect,
    choiceClickAspect,
    buildAndAttachChoiceAspect,
    optionsLoopAspect,
    optionAttachAspect,
    buildPickAspect,
    producePickAspect,
    createPickHandlersAspect,
    inputAspect,
    resetFilterListAspect,
    resetFilterAspect,
    specialPicksEventsAspect,
    resetLayoutAspect,
    focusInAspect,
    loadAspect,
    updateDataAspect,
    updateAspect,
    fullMatchAspect
  });
  let pluginManager = PluginManager(plugins, aspects);
  let multiSelectInlineLayout = MultiSelectInlineLayout(aspects);
  let api = {
    component: "BsMultiSelect.api"
  }; // key to use in memory leak analyzes

  pluginManager.buildApi(api); // after this we can pass aspects methods call without wrapping - there should be no more overridings. TODO freeze aspects?

  api.dispose = composeSync(resetLayoutAspect.resetLayout, () => {
    disposeAspect.dispose();
  }, pluginManager.dispose, () => {
    picksList.forEach(pick => pick.dispose());
  }, multiSelectInlineLayout.dispose, // TODO move to layout
  wraps.dispose, staticManager.dispose, picksDom.dispose, filterDom.dispose);

  api.updateData = () => {
    updateDataAspect.updateData();
  };

  api.update = () => {
    updateAspect.update();
  }; // TODO api.updateOption = (key) => {/* all updates: selected, disabled, hidden, text */}


  onInit?.(api, aspects);
  picksDom.pickFilterElement.appendChild(filterDom.filterInputElement);
  picksDom.picksElement.appendChild(picksDom.pickFilterElement);
  staticManager.appendToContainer();
  loadAspect.load();
  return api;
}

const transformStyles = [{
  old: 'selectedPanelDisabledBackgroundColor',
  opt: 'picks_disabled',
  style: "backgroundColor"
}, {
  old: 'selectedPanelFocusValidBoxShadow',
  opt: 'picks_focus_valid',
  style: "boxShadow"
}, {
  old: 'selectedPanelFocusInvalidBoxShadow',
  opt: 'picks_focus_invalid',
  style: "boxShadow"
}, {
  old: 'selectedPanelDefMinHeight',
  opt: 'picks_def',
  style: "minHeight"
}, {
  old: 'selectedPanelLgMinHeight',
  opt: 'picks_lg',
  style: "minHeight"
}, {
  old: 'selectedPanelSmMinHeight',
  opt: 'picks_sm',
  style: "minHeight"
}, {
  old: 'selectedItemContentDisabledOpacity',
  opt: 'choiceLabel_disabled',
  style: "opacity"
}];
const transformClasses = [{
  old: 'dropDownMenuClass',
  opt: 'choices'
}, {
  old: 'dropDownItemClass',
  opt: 'choice'
}, {
  old: 'dropDownItemHoverClass',
  opt: 'choice_hover'
}, {
  old: 'selectedPanelClass',
  opt: 'picks'
}, {
  old: 'selectedItemClass',
  opt: 'pick'
}, {
  old: 'removeSelectedItemButtonClass',
  opt: 'pickButton'
}, {
  old: 'filterInputItemClass',
  opt: 'pickFilter'
}, {
  old: 'filterInputClass',
  opt: 'filterInput'
}, {
  old: 'selectedPanelFocusClass',
  opt: 'picks_focus'
}, {
  old: 'selectedPanelDisabledClass',
  opt: 'picks_disabled'
}, {
  old: 'selectedItemContentDisabledClass',
  opt: 'pick_disabled'
}];
function adjustLegacySettings(settings) {
  if (!settings.css) settings.css = {};
  var css = settings.css;
  if (!settings.cssPatch) settings.cssPatch = {};
  var cssPatch = settings.cssPatch;

  if (settings.selectedPanelFocusBorderColor || settings.selectedPanelFocusBoxShadow) {
    console.log("DashboarCode.BsMultiSelect: selectedPanelFocusBorderColor and selectedPanelFocusBoxShadow are depricated, use - cssPatch:{picks_focus:{borderColor:'myValue', boxShadow:'myValue'}}");

    if (!cssPatch.picks_focus) {
      cssPatch.picks_focus = {
        boxShadow: settings.selectedPanelFocusBoxShadow,
        borderColor: settings.selectedPanelFocusBorderColor
      };
    }

    delete settings.selectedPanelFocusBorderColor;
    delete settings.selectedPanelFocusBoxShadow;
  }

  transformStyles.forEach(i => {
    if (settings[i.old]) {
      console.log(`DashboarCode.BsMultiSelect: ${i.old} is depricated, use - cssPatch:{${i.opt}:{${i.style}:'myValue'}}`);

      if (!settings[i.opt]) {
        let opt = {};
        opt[i.style] = settings[i.old];
        settings.cssPatch[i.opt] = opt;
      }

      delete settings[i.old];
    }
  });
  transformClasses.forEach(i => {
    if (settings[i.old]) {
      console.log(`DashboarCode.BsMultiSelect: ${i.old} is depricated, use - css:{${i.opt}:'myValue'}`);

      if (!css[i.opt]) {
        css[i.opt] = settings[i.old];
      }

      delete settings[i.old];
    }
  });

  if (settings.inputColor) {
    console.log("DashboarCode.BsMultiSelect: inputColor is depricated, remove parameter");
    delete settings.inputColor;
  }

  if (settings.useCss) {
    console.log("DashboarCode.BsMultiSelect: 'useCss: true' is depricated, use - 'useCssPatch: false'");

    if (!css.pick_disabled) {
      settings.useCssPatch = !settings.useCss;
    }

    delete settings.useCss;
  }

  if (settings.getIsValid || settings.getIsInValid) {
    throw "DashboarCode.BsMultiSelect: parameters getIsValid and getIsInValid are depricated and removed, use - getValidity that should return (true|false|null) ";
  }
}

function MultiSelectBuilder(environment, plugins) {
  const defaults = {
    containerClass: "dashboardcode-bsmultiselect"
  };

  let create = (element, options) => {
    if (options && options.plugins) console.log("DashboarCode.BsMultiSelect: 'options.plugins' is depricated, use - MultiSelectBuilder(environment, plugins) instead");
    let configuration = {};
    let buildConfiguration;

    if (options instanceof Function) {
      buildConfiguration = options;
      options = null;
    } else {
      buildConfiguration = options?.buildConfiguration;
    }

    if (options) {
      adjustLegacySettings(options);
    }

    configuration.css = createCss(defaults.css, options?.css);
    plugMergeSettings(plugins, configuration, defaults, options); // merge settings.cssPatch and defaults.cssPatch

    extendIfUndefined(configuration, options);
    extendIfUndefined(configuration, defaults);
    let onInit = buildConfiguration?.(element, configuration); // TODO: configuration should become an aspect

    let multiSelect = BsMultiSelect(element, environment, plugins, configuration, onInit); // onInit(api, aspects) - before load data

    return multiSelect;
  };

  plugDefaultConfig(plugins, defaults);
  return {
    create,
    defaultSettings: defaults
  };
}

function LabelForAttributePlugin(aspects) {
  var {
    staticDom,
    filterDom,
    getLabelElementAspect,
    configuration,
    loadAspect,
    disposeAspect
  } = aspects;
  var {
    containerClass
  } = configuration;
  var labelForAttributeAspect = LabelForAttributeAspect(staticDom, filterDom, containerClass, getLabelElementAspect, disposeAspect);
  aspects.labelForAttributeAspect = labelForAttributeAspect;
  loadAspect.load = composeSync(loadAspect.load, () => labelForAttributeAspect.update());
}

LabelForAttributePlugin.plugDefaultConfig = defaults => {
  defaults.label = null;
};

LabelForAttributePlugin.plugStaticDom = aspects => {
  aspects.getLabelElementAspect = GetLabelElementAspect(aspects.configuration.label);
};

function GetLabelElementAspect(label) {
  return {
    getLabelElement() {
      // overrided by BS Appearance Plugin
      defCall(label);
    }

  };
}

function LabelForAttributeAspect(staticDom, filterDom, containerClass, getLabelElementAspect, disposeAspect) {
  return {
    update() {
      let createInputId = null;
      let {
        selectElement,
        containerElement
      } = staticDom;
      let {
        filterInputElement
      } = filterDom;
      if (selectElement) createInputId = () => `${containerClass}-generated-input-${(selectElement.id ? selectElement.id : selectElement.name).toLowerCase()}-id`;else createInputId = () => `${containerClass}-generated-filter-${containerElement.id}`;
      let labelElement = getLabelElementAspect.getLabelElement();

      if (labelElement) {
        let backupedForAttribute = labelElement.getAttribute('for');
        var newId = createInputId();
        filterInputElement.setAttribute('id', newId);
        labelElement.setAttribute('for', newId);

        if (backupedForAttribute) {
          disposeAspect.dispose = composeSync(disposeAspect.dispose, () => labelElement.setAttribute('for', backupedForAttribute));
        }
      }
    }

  };
}

function RtlPlugin(aspects) {
  let {
    configuration,
    rtlAspect,
    staticDom
  } = aspects;
  let {
    isRtl
  } = configuration;
  let forceRtlOnContainer = false;
  if (isBoolean(isRtl)) forceRtlOnContainer = true;else isRtl = getIsRtl(staticDom.initialElement);
  var attributeBackup = AttributeBackup();

  if (forceRtlOnContainer) {
    attributeBackup.set(staticDom.containerElement, "dir", "rtl");
  } else if (staticDom.selectElement) {
    var dirAttributeValue = staticDom.selectElement.getAttribute("dir");

    if (dirAttributeValue) {
      attributeBackup.set(staticDom.containerElement, "dir", dirAttributeValue);
    }
  }

  return {
    buildApi(api) {
      // TODO: there is something wrong with this. may be should moved to specific plugin
      // sample of correct plugin - aspect pair is WarningPlugin: aspect is added on plugin constructor
      rtlAspect.updateRtl(isRtl);
    },

    dispose() {
      attributeBackup.restore();
    }

  };
}

RtlPlugin.plugStaticDom = aspects => {
  aspects.rtlAspect = RtlAspect();
};

function RtlAspect() {
  return {
    updateRtl() {}

  };
}

function FormResetPlugin(aspects) {
  var {
    staticDom,
    updateDataAspect,
    environment
  } = aspects;
  var eventBuilder = EventBinder();

  if (staticDom.selectElement) {
    var form = closestByTagName(staticDom.selectElement, 'FORM');

    if (form) {
      eventBuilder.bind(form, 'reset', () => environment.window.setTimeout(() => updateDataAspect.updateData()));
    }
  }

  return {
    dispose() {
      eventBuilder.unbind();
    }

  };
}

function createValidity(valueMissing, customError) {
  return Object.freeze({
    valueMissing,
    customError,
    valid: !(valueMissing || customError)
  });
}

function ValidityApi(visibleElement, isValueMissingObservable, valueMissingMessage, onValid, trigger) {
  var customValidationMessage = "";
  var validationMessage = "";
  var validity = null;
  var willValidate = true;

  function setMessage(valueMissing, customError) {
    validity = createValidity(valueMissing, customError);
    validationMessage = customError ? customValidationMessage : valueMissing ? valueMissingMessage : "";
    visibleElement.setCustomValidity(validationMessage);
    onValid(validity.valid);
  }

  setMessage(isValueMissingObservable.getValue(), false);
  isValueMissingObservable.attach(value => {
    setMessage(value, validity.customError);
  });

  var checkValidity = () => {
    if (!validity.valid) trigger('dashboardcode.multiselect:invalid');
    return validity.valid;
  };

  return {
    validationMessage,
    willValidate,
    validity,

    setCustomValidity(message) {
      customValidationMessage = message;
      setMessage(validity.valueMissing, customValidationMessage ? true : false);
    },

    checkValidity,

    reportValidity() {
      visibleElement.reportValidity();
      return checkValidity();
    }

  };
}

const defValueMissingMessage = 'Please select an item in the list';
function ValidationApiPlugin(pluginData) {
  var {
    configuration,
    triggerAspect,
    onChangeAspect,
    optionsAspect,
    staticDom,
    filterDom,
    updateDataAspect
  } = pluginData; // TODO: required could be a function

  let {
    getIsValueMissing,
    valueMissingMessage,
    required,
    getValueRequired
  } = configuration;
  if (!isBoolean(required)) required = getValueRequired();
  valueMissingMessage = defCall(valueMissingMessage, () => getDataGuardedWithPrefix(staticDom.initialElement, "bsmultiselect", "value-missing-message"), defValueMissingMessage);

  if (!getIsValueMissing) {
    getIsValueMissing = () => {
      let count = 0;
      let optionsArray = optionsAspect.getOptions();

      for (var i = 0; i < optionsArray.length; i++) {
        if (optionsArray[i].selected) count++;
      }

      return count === 0;
    };
  }

  var isValueMissingObservable = ObservableLambda(() => required && getIsValueMissing());
  var validationApiObservable = ObservableValue(!isValueMissingObservable.getValue());
  onChangeAspect.onChange = composeSync(isValueMissingObservable.call, onChangeAspect.onChange);
  updateDataAspect.updateData = composeSync(isValueMissingObservable.call, updateDataAspect.updateData);
  pluginData.validationApiPluginData = {
    validationApiObservable
  };
  var validationApi = ValidityApi(filterDom.filterInputElement, isValueMissingObservable, valueMissingMessage, isValid => validationApiObservable.setValue(isValid), triggerAspect.trigger);
  return {
    buildApi(api) {
      api.validationApi = validationApi;
    },

    dispose() {
      isValueMissingObservable.detachAll();
      validationApiObservable.detachAll();
    }

  };
}

ValidationApiPlugin.plugDefaultConfig = defaults => {
  defaults.getValueRequired = function () {
    return false;
  };

  defaults.valueMissingMessage = '';
};

function BsAppearancePlugin(pluginData) {
  let {
    configuration,
    validationApiPluginData,
    picksDom,
    staticDom,
    getLabelElementAspect,
    updateAppearanceAspect,
    componentPropertiesAspect,
    floatingLabelAspect
  } = pluginData;
  let {
    getValidity,
    getSize,
    useCssPatch,
    css,
    composeGetSize,
    getDefaultLabel
  } = configuration;
  let selectElement = staticDom.selectElement;
  let initialElement = staticDom.initialElement;
  let isFloatingLabel = false;

  if (floatingLabelAspect) {
    isFloatingLabel = closestByClassName(initialElement, 'form-floating');

    floatingLabelAspect.isFloatingLabel = () => isFloatingLabel;
  }

  if (getLabelElementAspect) {
    let origGetLabelElementAspect = getLabelElementAspect.getLabelElement;

    getLabelElementAspect.getLabelElement = () => {
      var e = origGetLabelElementAspect();
      if (e) return e;else {
        if (selectElement) {
          let labelElement = getDefaultLabel(selectElement);
          return labelElement;
        }
      }
    };
  }

  if (staticDom.selectElement) {
    if (!getValidity) getValidity = composeGetValidity(selectElement);
    if (!getSize) getSize = composeGetSize(selectElement);
  } else {
    if (!getValidity) getValidity = () => null;
    if (!getSize) getSize = () => null;
  }

  componentPropertiesAspect.getSize = getSize;
  componentPropertiesAspect.getValidity = getValidity;
  var updateSize;

  if (!useCssPatch) {
    updateSize = () => updateSizeForAdapter(picksDom.picksElement, getSize);
  } else {
    let {
      picks_lg,
      picks_sm,
      picks_def,
      picks_floating_def
    } = css;
    if (isFloatingLabel) picks_lg = picks_sm = picks_def = picks_floating_def;

    updateSize = () => updateSizeJsForAdapter(picksDom.picksElement, picks_lg, picks_sm, picks_def, getSize);
  }

  if (useCssPatch) {
    var origToggleFocusStyling = picksDom.toggleFocusStyling;

    picksDom.toggleFocusStyling = () => {
      var validity = validationObservable.getValue();
      var isFocusIn = picksDom.getIsFocusIn();
      origToggleFocusStyling(isFocusIn);

      if (isFocusIn) {
        if (validity === false) {
          // but not toggle events (I know it will be done in future)
          picksDom.setIsFocusIn(isFocusIn);
          addStyling(picksDom.picksElement, css.picks_focus_invalid);
        } else if (validity === true) {
          // but not toggle events (I know it will be done in future)
          picksDom.setIsFocusIn(isFocusIn);
          addStyling(picksDom.picksElement, css.picks_focus_valid);
        }
      }
    };
  }

  var getWasValidated = () => {
    var wasValidatedElement = closestByClassName(staticDom.initialElement, 'was-validated');
    return wasValidatedElement ? true : false;
  };

  var wasUpdatedObservable = ObservableLambda(() => getWasValidated());
  var getManualValidationObservable = ObservableLambda(() => getValidity());
  let validationApiObservable = validationApiPluginData?.validationApiObservable;
  var validationObservable = ObservableLambda(() => wasUpdatedObservable.getValue() ? validationApiObservable.getValue() : getManualValidationObservable.getValue());
  validationObservable.attach(value => {
    var {
      validMessages,
      invalidMessages
    } = getMessagesElements(staticDom.containerElement);
    updateValidity(picksDom.picksElement, validMessages, invalidMessages, value);
    picksDom.toggleFocusStyling();
  });
  wasUpdatedObservable.attach(() => validationObservable.call());
  if (validationApiObservable) validationApiObservable.attach(() => validationObservable.call());
  getManualValidationObservable.attach(() => validationObservable.call());
  updateAppearanceAspect.updateAppearance = composeSync(updateAppearanceAspect.updateAppearance, updateSize, validationObservable.call, getManualValidationObservable.call);
  return {
    buildApi(api) {
      api.updateSize = updateSize;

      api.updateValidity = () => getManualValidationObservable.call();

      api.updateWasValidated = () => wasUpdatedObservable.call();
    },

    dispose() {
      wasUpdatedObservable.detachAll();
      validationObservable.detachAll();
      getManualValidationObservable.detachAll();
    }

  };
}

function updateValidity(picksElement, validMessages, invalidMessages, validity) {
  if (validity === false) {
    picksElement.classList.add('is-invalid');
    picksElement.classList.remove('is-valid');
    invalidMessages.map(e => e.style.display = 'block');
    validMessages.map(e => e.style.display = 'none');
  } else if (validity === true) {
    picksElement.classList.remove('is-invalid');
    picksElement.classList.add('is-valid');
    invalidMessages.map(e => e.style.display = 'none');
    validMessages.map(e => e.style.display = 'block');
  } else {
    picksElement.classList.remove('is-invalid');
    picksElement.classList.remove('is-valid');
    invalidMessages.map(e => e.style.display = '');
    validMessages.map(e => e.style.display = '');
  }
}

function updateSizeClasses(picksElement, size) {
  if (size == "lg") {
    picksElement.classList.add('form-control-lg');
    picksElement.classList.remove('form-control-sm');
  } else if (size == "sm") {
    picksElement.classList.remove('form-control-lg');
    picksElement.classList.add('form-control-sm');
  } else {
    picksElement.classList.remove('form-control-lg');
    picksElement.classList.remove('form-control-sm');
  }
}

function updateSizeJsPicks(picksElement, picksLgStyling, picksSmStyling, picksDefStyling, size) {
  if (size == "lg") {
    addStyling(picksElement, picksLgStyling);
  } else if (size == "sm") {
    addStyling(picksElement, picksSmStyling);
  } else {
    addStyling(picksElement, picksDefStyling);
  }
}

function updateSizeJs(picksElement, picksLgStyling, picksSmStyling, picksDefStyling, size) {
  updateSizeClasses(picksElement, size);
  updateSizeJsPicks(picksElement, picksLgStyling, picksSmStyling, picksDefStyling, size);
}

function updateSizeForAdapter(picksElement, getSize) {
  updateSizeClasses(picksElement, getSize());
}

function updateSizeJsForAdapter(picksElement, picksLgStyling, picksSmStyling, picksDefStyling, getSize) {
  updateSizeJs(picksElement, picksLgStyling, picksSmStyling, picksDefStyling, getSize());
}

function getMessagesElements(containerElement) {
  var siblings = siblingsAsArray(containerElement);
  var invalidMessages = siblings.filter(e => e.classList.contains('invalid-feedback') || e.classList.contains('invalid-tooltip'));
  var validMessages = siblings.filter(e => e.classList.contains('valid-feedback') || e.classList.contains('valid-tooltip'));
  return {
    validMessages,
    invalidMessages
  };
}

function composeGetValidity(selectElement) {
  var getValidity = () => selectElement.classList.contains('is-invalid') ? false : selectElement.classList.contains('is-valid') ? true : null;

  return getValidity;
}

function HiddenOptionPlugin(aspects) {
  let {
    configuration,
    createWrapAspect,
    isChoiceSelectableAspect,
    wrapsCollection,
    buildChoiceAspect,
    buildAndAttachChoiceAspect,
    countableChoicesListInsertAspect,
    countableChoicesList
  } = aspects;

  countableChoicesListInsertAspect.countableChoicesListInsert = (wrap, key) => {
    if (!wrap.isOptionHidden) {
      let choiceNext = wrapsCollection.getNext(key, c => !c.isOptionHidden);
      countableChoicesList.add(wrap, choiceNext);
    }
  };

  let origBuildAndAttachChoice = buildAndAttachChoiceAspect.buildAndAttachChoice;

  buildAndAttachChoiceAspect.buildAndAttachChoice = (wrap, getNextElement) => {
    if (wrap.isOptionHidden) {
      buildHiddenChoice(wrap);
    } else {
      origBuildAndAttachChoice(wrap, getNextElement);
    }
  };

  var origIsSelectable = isChoiceSelectableAspect.isSelectable;

  isChoiceSelectableAspect.isSelectable = wrap => origIsSelectable(wrap) && !wrap.isOptionHidden;

  let {
    getIsOptionHidden,
    options
  } = configuration;

  if (options) {
    if (!getIsOptionHidden) getIsOptionHidden = option => option.hidden === undefined ? false : option.hidden;
  } else {
    if (!getIsOptionHidden) getIsOptionHidden = option => {
      return option.hidden;
    };
  }

  var origCreateWrap = createWrapAspect.createWrap;

  createWrapAspect.createWrap = option => {
    let wrap = origCreateWrap(option);
    wrap.isOptionHidden = getIsOptionHidden(option);
    return wrap;
  };

  return {
    buildApi(api) {
      let getNextNonHidden = key => wrapsCollection.getNext(key, c => !c.isOptionHidden);

      api.updateOptionsHidden = () => wrapsCollection.forLoop((wrap, key) => updateChoiceHidden$1(wrap, key, getNextNonHidden, countableChoicesList, getIsOptionHidden, buildChoiceAspect));

      api.updateOptionHidden = key => updateChoiceHidden$1(wrapsCollection.get(key), key, getNextNonHidden, countableChoicesList, getIsOptionHidden, buildChoiceAspect); // TODO create updateHidden ? 
      // it is too complex since we need to find the next non hidden, when this depends on key 
      // there should be the backreference "wrap -> index" invited before
      // api.updateOptionHidden  = (key) => wrapsCollection.get(key).updateHidden();

    }

  };
}

function buildHiddenChoice(wrap) {
  wrap.updateSelected = () => void 0;

  wrap.choice.isChoiceElementAttached = false;
  wrap.choice.choiceElement = null;
  wrap.choice.choiceElementAttach = null;
  wrap.choice.setVisible = null;
  wrap.choice.setHoverIn = null;
  wrap.choice.remove = null;

  wrap.choice.dispose = () => {
    wrap.choice.dispose = null;
  };

  wrap.dispose = () => {
    wrap.choice.dispose();
    wrap.dispose = null;
  };
}

function updateChoiceHidden$1(wrap, key, getNextNonHidden, countableChoicesList, getIsOptionHidden, buildChoiceAspect) {
  let newIsOptionHidden = getIsOptionHidden(wrap.option);

  if (newIsOptionHidden != wrap.isOptionHidden) {
    wrap.isOptionHidden = newIsOptionHidden;

    if (wrap.isOptionHidden) {
      countableChoicesList.remove(wrap);
      wrap.choice.remove();
      buildHiddenChoice(wrap);
    } else {
      let nextChoice = getNextNonHidden(key);
      countableChoicesList.add(wrap, nextChoice);
      buildChoiceAspect.buildChoice(wrap);
      wrap.choice.choiceElementAttach(nextChoice?.choice.choiceElement);
    }
  }
}

function HiddenOptionAltPlugin(pluginData) {
  let {
    configuration,
    createWrapAspect,
    isChoiceSelectableAspect,
    wrapsCollection,
    buildAndAttachChoiceAspect,
    countableChoicesListInsertAspect,
    countableChoicesList
  } = pluginData;

  countableChoicesListInsertAspect.countableChoicesListInsert = (wrap, key) => {
    if (!wrap.isOptionHidden) {
      let choiceNext = wrapsCollection.getNext(key, c => !c.isOptionHidden);
      countableChoicesList.add(wrap, choiceNext);
    }
  };

  let origBuildAndAttachChoice = buildAndAttachChoiceAspect.buildAndAttachChoice;

  buildAndAttachChoiceAspect.buildAndAttachChoice = (wrap, getNextElement) => {
    origBuildAndAttachChoice(wrap, getNextElement);
    wrap.choice.setVisible(!wrap.isOptionHidden);
  };

  var origIsSelectable = isChoiceSelectableAspect.isSelectable;

  isChoiceSelectableAspect.isSelectable = wrap => origIsSelectable(wrap) && !wrap.isOptionHidden;

  let {
    getIsOptionHidden,
    options
  } = configuration;

  if (options) {
    if (!getIsOptionHidden) getIsOptionHidden = option => option.hidden === undefined ? false : option.hidden;
  } else {
    if (!getIsOptionHidden) getIsOptionHidden = option => {
      return option.hidden;
    };
  }

  var origCreateWrap = createWrapAspect.createWrap;

  createWrapAspect.createWrap = option => {
    let wrap = origCreateWrap(option);
    wrap.isOptionHidden = getIsOptionHidden(option);
    return wrap;
  };

  return {
    buildApi(api) {
      let getNextNonHidden = key => wrapsCollection.getNext(key, c => !c.isOptionHidden);

      api.updateOptionsHidden = () => wrapsCollection.forLoop((wrap, key) => updateChoiceHidden(wrap, key, getNextNonHidden, countableChoicesList, getIsOptionHidden));

      api.updateOptionHidden = key => updateChoiceHidden(wrapsCollection.get(key), key, getNextNonHidden, countableChoicesList, getIsOptionHidden);
    }

  };
}

function updateChoiceHidden(wrap, key, getNextNonHidden, countableChoicesList, getIsOptionHidden) {
  let newIsOptionHidden = getIsOptionHidden(wrap.option);

  if (newIsOptionHidden != wrap.isOptionHidden) {
    wrap.isOptionHidden = newIsOptionHidden;
    if (wrap.isOptionHidden) countableChoicesList.remove(wrap);else {
      let nextChoice = getNextNonHidden(key); // TODO: should not rely on element but do

      countableChoicesList.add(wrap, nextChoice);
    }
    wrap.choice.setVisible(!wrap.isOptionHidden);
  }
}

function CssPatchPlugin() {}

CssPatchPlugin.plugMergeSettings = (configuration, defaults, settings) => {
  let cssPatch = settings?.cssPatch;
  if (isBoolean(cssPatch)) throw new Error("BsMultiSelect: 'cssPatch' was used instead of 'useCssPatch'"); // often type of error

  configuration.cssPatch = createCss(defaults.cssPatch, cssPatch); // replace classes, merge styles
};

CssPatchPlugin.plugStaticDom = configurationPluginData => {
  let {
    configuration
  } = configurationPluginData;
  if (configuration.useCssPatch) extendCss(configuration.css, configuration.cssPatch);
};

function PlaceholderPlugin(aspects) {
  let {
    configuration,
    staticManager,
    picksList,
    picksDom,
    filterDom,
    staticDom,
    updateDataAspect,
    resetFilterListAspect,
    filterManagerAspect,
    environment
  } = aspects;
  let isIE11 = environment.isIE11;
  let {
    placeholder,
    css
  } = configuration;
  let {
    picksElement
  } = picksDom;
  let filterInputElement = filterDom.filterInputElement;

  function setPlaceholder(placeholder) {
    filterInputElement.placeholder = placeholder;
  }

  if (isIE11) {
    var ignoreNextInputResetableFlag = ResetableFlag();
    let placeholderStopInputAspect = PlaceholderStopInputAspect(ignoreNextInputResetableFlag);
    var setPlaceholderOrig = setPlaceholder;

    setPlaceholder = function (placeholder) {
      ignoreNextInputResetableFlag.set();
      setPlaceholderOrig(placeholder);
    };

    aspects.placeholderStopInputAspect = placeholderStopInputAspect;
  }

  if (!placeholder) {
    placeholder = getDataGuardedWithPrefix(staticDom.initialElement, "bsmultiselect", "placeholder");
  }

  function setEmptyInputWidth(isVisible) {
    if (isVisible) filterInputElement.style.width = '100%';else filterInputElement.style.width = '2ch';
  }

  var emptyToggleStyling = toggleStyling(filterInputElement, css.filterInput_empty);

  function showPlacehodler(isVisible) {
    if (isVisible) {
      setPlaceholder(placeholder ? placeholder : '');
      picksElement.style.display = 'block';
    } else {
      setPlaceholder('');
      picksElement.style.display = 'flex';
    }

    emptyToggleStyling(isVisible);
    setEmptyInputWidth(isVisible);
  }

  showPlacehodler(true);

  function setDisabled(isComponentDisabled) {
    filterInputElement.disabled = isComponentDisabled;
  }

  let isEmpty = () => picksList.isEmpty() && filterDom.isEmpty();

  function updatePlacehodlerVisibility() {
    showPlacehodler(isEmpty());
  }

  function updateEmptyInputWidth() {
    setEmptyInputWidth(isEmpty());
  }
  let origDisable = picksDom.disable;

  picksDom.disable = isComponentDisabled => {
    setDisabled(isComponentDisabled);
    origDisable(isComponentDisabled);
  };

  staticManager.appendToContainer = composeSync(staticManager.appendToContainer, updateEmptyInputWidth);
  filterManagerAspect.processEmptyInput = composeSync(updateEmptyInputWidth, filterManagerAspect.processEmptyInput);
  resetFilterListAspect.forceResetFilter = composeSync(resetFilterListAspect.forceResetFilter, updatePlacehodlerVisibility);
  let origAdd = picksList.add;

  picksList.add = pick => {
    let returnValue = origAdd(pick);

    if (picksList.getCount() == 1) {
      // make flex
      if (filterDom.isEmpty()) {
        setPlaceholder('');
        picksElement.style.display = 'flex';
        emptyToggleStyling(false);
        filterInputElement.style.width = '2ch';
      } else {
        picksElement.style.display = 'flex';
      }
    }

    pick.dispose = composeSync(pick.dispose, function () {
      if (isEmpty()) {
        showPlacehodler(true);
      }
    });
    return returnValue;
  };

  updateDataAspect.updateData = composeSync(updateDataAspect.updateData, updatePlacehodlerVisibility);
} // ie11 support

function PlaceholderStopInputAspect(resetableFlag) {
  return {
    get() {
      return resetableFlag.get();
    },

    reset() {
      return resetableFlag.reset();
    }

  };
}

function JQueryMethodsPlugin(aspects) {
  let {
    staticDom,
    choicesDom,
    filterDom,
    picksList,
    picksDom
  } = aspects;
  return {
    buildApi(api) {
      api.getContainer = () => staticDom.containerElement;

      api.getChoices = () => choicesDom.choicesElement;

      api.getChoicesList = () => choicesDom.choicesListElement;

      api.getFilterInput = () => filterDom.filterInputElement;

      api.getPicks = () => picksDom.picksElement;

      api.picksCount = () => picksList.getCount();
    }

  };
}

function OptionsApiPlugin(pluginData) {
  let {
    buildAndAttachChoiceAspect,
    wraps,
    wrapsCollection,
    createWrapAspect,
    createChoiceBaseAspect,
    optionsAspect,
    resetLayoutAspect
  } = pluginData;
  return {
    buildApi(api) {
      api.updateOptionAdded = key => {
        // TODO: generalize index as key 
        let options = optionsAspect.getOptions();
        let option = options[key];
        let wrap = createWrapAspect.createWrap(option);
        wrap.choice = createChoiceBaseAspect.createChoiceBase(option);
        wraps.insert(key, wrap);

        let nextChoice = () => wrapsCollection.getNext(key, c => c.choice.choiceElement);

        buildAndAttachChoiceAspect.buildAndAttachChoice(wrap, () => nextChoice()?.choice.choiceElement);
      };

      api.updateOptionRemoved = key => {
        // TODO: generalize index as key 
        resetLayoutAspect.resetLayout(); // always hide 1st, then reset filter

        var wrap = wraps.remove(key);
        wrap.choice.remove?.();
        wrap.dispose?.();
      };
    }

  };
}

function FormRestoreOnBackwardPlugin(aspects) {
  let {
    staticDom,
    environment,
    loadAspect,
    updateOptionsSelectedAspect
  } = aspects;
  let window = environment.window;

  if (staticDom.selectElement && updateOptionsSelectedAspect) {
    loadAspect.load = composeSync(loadAspect.load, function () {
      // support browser's "step backward" and form's values restore
      if (window.document.readyState != "complete") {
        window.setTimeout(function () {
          updateOptionsSelectedAspect.updateOptionsSelected(); // there are no need to add more updates as api.updateWasValidated() because backward never trigger .was-validate
          // also backward never set the state to invalid
        });
      }
    });
  }
}

function SelectElementPlugin(aspects) {
  var {
    loadAspect,
    environment
  } = aspects;
  var document = environment.window.document;
  var origLoadAspectLoop = loadAspect.loop;

  loadAspect.loop = function () {
    // browsers can change select value as part of "autocomplete" (IE11) at load time
    // or "show preserved on go back" (Chrome) after page is loaded but before "ready" event;
    // mote: they never "restore" selected-disabled options.
    // TODO: make the FROM Validation for 'selected-disabled' easy.
    if (document.readyState != 'loading') {
      origLoadAspectLoop();
    } else {
      var domContentLoadedHandler = function () {
        origLoadAspectLoop();
        document.removeEventListener("DOMContentLoaded", domContentLoadedHandler);
      };

      document.addEventListener('DOMContentLoaded', domContentLoadedHandler); // IE9+
    }
  };
}

SelectElementPlugin.plugStaticDom = aspects => {
  let {
    configuration,
    staticDomFactory,
    createElementAspect,
    componentPropertiesAspect,
    onChangeAspect,
    triggerAspect,
    optionsAspect,
    optGroupAspect,
    disposeAspect
  } = aspects;
  let origStaticDomFactoryCreate = staticDomFactory.create;

  staticDomFactory.create = css => {
    let {
      choicesDom,
      createStaticDom: origCreateStaticDom
    } = origStaticDomFactoryCreate(css);
    let {
      choicesElement
    } = choicesDom;
    return {
      choicesDom,

      createStaticDom(element, containerClass) {
        let selectElement = null;
        let containerElement = null;
        let picksElement = null;

        if (element.tagName == 'SELECT') {
          selectElement = element;

          if (containerClass) {
            containerElement = closestByClassName(selectElement, containerClass);
            if (containerElement) picksElement = findDirectChildByTagName(containerElement, 'UL');
          }
        } else if (element.tagName == 'DIV') {
          selectElement = findDirectChildByTagName(element, 'SELECT');

          if (selectElement) {
            if (containerClass) {
              containerElement = closestByClassName(element, containerClass);
              if (containerElement) picksElement = findDirectChildByTagName(containerElement, 'UL');
            }
          } else {
            return origCreateStaticDom(element, containerClass);
          }
        }

        let disposableContainerElement = false;

        if (!containerElement) {
          containerElement = createElementAspect.createElement('DIV');
          containerElement.classList.add(containerClass);
          disposableContainerElement = true;
        }

        let isDisposablePicksElement = false;

        if (!picksElement) {
          picksElement = createElementAspect.createElement('UL');
          isDisposablePicksElement = true;
        }

        if (selectElement) {
          var backupDisplay = selectElement.style.display;
          selectElement.style.display = 'none';
          var backupedRequired = selectElement.required;

          configuration.getValueRequired = function () {
            return backupedRequired;
          };

          if (selectElement.required === true) selectElement.required = false;
          let {
            getDisabled
          } = configuration;

          if (!getDisabled) {
            var fieldsetElement = closestByTagName(selectElement, 'FIELDSET');

            if (fieldsetElement) {
              componentPropertiesAspect.getDisabled = () => selectElement.disabled || fieldsetElement.disabled;
            } else {
              componentPropertiesAspect.getDisabled = () => selectElement.disabled;
            }
          }

          onChangeAspect.onChange = composeSync(() => triggerAspect.trigger('change'), onChangeAspect.onChange);

          optionsAspect.getOptions = () => selectElement.options;

          if (optGroupAspect) {
            optGroupAspect.getOptionOptGroup = option => option.parentNode;

            optGroupAspect.getOptGroupText = optGroup => optGroup.label;

            optGroupAspect.getOptGroupId = optGroup => optGroup.id;
          }

          disposeAspect.dispose = composeSync(disposeAspect.dispose, () => {
            selectElement.required = backupedRequired;
            selectElement.style.display = backupDisplay;
          });
        }

        return {
          staticDom: {
            initialElement: element,
            containerElement,
            picksElement,
            isDisposablePicksElement,
            selectElement
          },
          staticManager: {
            appendToContainer() {
              if (disposableContainerElement) {
                selectElement.parentNode.insertBefore(containerElement, selectElement.nextSibling);
                containerElement.appendChild(choicesElement);
              } else {
                selectElement.parentNode.insertBefore(choicesElement, selectElement.nextSibling);
              }

              if (isDisposablePicksElement) containerElement.appendChild(picksElement);
            },

            dispose() {
              choicesElement.parentNode.removeChild(choicesElement);
              if (disposableContainerElement) selectElement.parentNode.removeChild(containerElement);
              if (isDisposablePicksElement) containerElement.removeChild(picksElement);
            }

          }
        };
      }

    };
  };
};

// plugin should overdrive them : call setWrapSelected and etc
// therefore there should new component API methods
// addOptionPick(key) -> call addPick(pick) which returns removePick() 
// SetOptionSelectedAspect, OptionToggleAspect should be moved there 
// OptionToggleAspect overrided in DisabledOptionPlugin
// wrap.isOptionSelected ,  wrap.updateSelected

function SelectedOptionPlugin(aspects) {
  let {
    configuration,
    wrapsCollection,
    updateOptionsSelectedAspect,
    createWrapAspect,
    buildChoiceAspect,
    removePickAspect,
    resetLayoutAspect,
    picksList,
    isChoiceSelectableAspect,
    optionToggleAspect,

    /*inputAspect, filterDom, filterManagerAspect,*/
    createPickHandlersAspect,
    addPickAspect,
    fullMatchAspect,
    onChangeAspect,
    filterPredicateAspect
  } = aspects;
  let {
    getSelected: getIsOptionSelected,
    setSelected: setIsOptionSelected
  } = configuration;
  let origFilterPredicate = filterPredicateAspect.filterPredicate;

  filterPredicateAspect.filterPredicate = (wrap, text) => !wrap.isOptionSelected && origFilterPredicate(wrap, text);

  let origBuildChoice = buildChoiceAspect.buildChoice;

  buildChoiceAspect.buildChoice = wrap => {
    origBuildChoice(wrap);

    wrap.updateSelected = () => {
      wrap.choice.choiceDomManagerHandlers.updateSelected();
      onChangeAspect.onChange();
    };

    wrap.dispose = composeSync(() => {
      wrap.updateSelected = null;
    }, wrap.dispose);
  }; // TODO: test this instead of wrap.updateSelected
  // function updateSelected(wrap){
  //     if (wrap.pick){
  //         if (wrap.isOptionSelected)
  //             pickHandlers.producePick();
  //         else {
  //             pickHandlers.removeAndDispose();
  //             pickHandlers.removeAndDispose=null;
  //         }
  //     }
  //     wrap.choice.choiceDomManagerHandlers.updateSelected();
  //     onChangeAspect.onChange();
  // }


  function composeUpdateSelected(wrap, booleanValue) {
    return () => {
      wrap.isOptionSelected = booleanValue;
      wrap.updateSelected();
    };
  }

  function trySetWrapSelected(option, updateSelected, booleanValue) {
    //  wrap.option
    let success = false;
    var confirmed = setIsOptionSelected(option, booleanValue);

    if (!(confirmed === false)) {
      updateSelected();
      success = true;
    }

    return success;
  }

  let origCreateWrap = createWrapAspect.createWrap;

  createWrapAspect.createWrap = option => {
    let wrap = origCreateWrap(option);
    wrap.isOptionSelected = getIsOptionSelected(option);
    wrap.updateSelected = null; // can it be combined ?

    return wrap;
  };

  optionToggleAspect.toggle; // TODO: improve design, no replace

  optionToggleAspect.toggle = wrap => {
    return trySetWrapSelected(wrap.option, composeUpdateSelected(wrap, !wrap.isOptionSelected), !wrap.isOptionSelected);
  };

  fullMatchAspect.fullMatch;

  fullMatchAspect.fullMatch = wrap => {
    return trySetWrapSelected(wrap.option, composeUpdateSelected(wrap, true), true);
  };

  removePickAspect.removePick; // TODO: improve design, no replace

  removePickAspect.removePick = (wrap, pick) => {
    // TODO: try remove pick
    return trySetWrapSelected(wrap.option, composeUpdateSelected(wrap, false), false);
  };

  let origCreatePickHandlers = createPickHandlersAspect.createPickHandlers;

  createPickHandlersAspect.createPickHandlers = wrap => {
    let pickHandlers = origCreatePickHandlers(wrap);
    wrap.updateSelected = composeSync(() => {
      if (wrap.isOptionSelected) {
        let pick = pickHandlers.producePick();
        wrap.pick = pick;
        pick.dispose = composeSync(pick.dispose, () => {
          wrap.pick = null;
        });
      } else {
        pickHandlers.removeAndDispose();
        pickHandlers.removeAndDispose = null;
      }
    }, wrap.updateSelected);
    addPickAspect.addPick(wrap, pickHandlers);
    return pickHandlers;
  };

  let origAddPick = addPickAspect.addPick;

  addPickAspect.addPick = (wrap, pickHandlers) => {
    if (wrap.isOptionSelected) {
      let pick = origAddPick(wrap, pickHandlers);
      wrap.pick = pick;
      pick.dispose = composeSync(pick.dispose, () => {
        wrap.pick = null;
      });
      return pick;
    }
  };

  return {
    buildApi(api) {
      api.selectAll = () => {
        resetLayoutAspect.resetLayout(); // always hide 1st

        wrapsCollection.forLoop(wrap => {
          if (isChoiceSelectableAspect.isSelectable(wrap) && !wrap.isOptionSelected) trySetWrapSelected(wrap.option, composeUpdateSelected(wrap, true), true);
        });
      };

      api.deselectAll = () => {
        resetLayoutAspect.resetLayout(); // always hide 1st

        picksList.forEach(pick => pick.setSelectedFalse());
      };

      api.setOptionSelected = (key, value) => {
        let wrap = wrapsCollection.get(key);
        return trySetWrapSelected(wrap.option, composeUpdateSelected(wrap, value), value);
      }; // used in FormRestoreOnBackwardPlugin


      api.updateOptionsSelected = () => updateOptionsSelectedAspect.updateOptionsSelected();

      api.updateOptionSelected = key => updateChoiceSelected(wrapsCollection.get(key), getIsOptionSelected);
    }

  };
}

SelectedOptionPlugin.plugStaticDom = aspects => {
  let {
    configuration,
    wrapsCollection
  } = aspects;
  let {
    getSelected: getIsOptionSelected,
    setSelected: setIsOptionSelected,
    options
  } = configuration;

  if (options) {
    if (!setIsOptionSelected) {
      setIsOptionSelected = (option, value) => {
        option.selected = value;
      };
    }

    if (!getIsOptionSelected) getIsOptionSelected = option => option.selected;
  } else {
    // selectElement
    if (!getIsOptionSelected) {
      getIsOptionSelected = option => option.selected;
    }

    if (!setIsOptionSelected) {
      setIsOptionSelected = (option, value) => {
        option.selected = value;
      }; // NOTE: adding this (setAttribute) break Chrome's html form reset functionality:
      // if (value) option.setAttribute('selected','');
      // else option.removeAttribute('selected');

    }
  }

  configuration.getSelected = getIsOptionSelected;
  configuration.setSelected = setIsOptionSelected;
  aspects.updateOptionsSelectedAspect = UpdateOptionsSelectedAspect(wrapsCollection, getIsOptionSelected);
};

function UpdateOptionsSelectedAspect(wrapsCollection, getIsOptionSelected) {
  return {
    updateOptionsSelected() {
      wrapsCollection.forLoop(wrap => updateChoiceSelected(wrap, getIsOptionSelected));
    }

  };
}

function updateChoiceSelected(wrap, getIsOptionSelected) {
  let newIsSelected = getIsOptionSelected(wrap.option);

  if (newIsSelected != wrap.isOptionSelected) {
    wrap.isOptionSelected = newIsSelected;
    wrap.updateSelected?.(); // some hidden oesn't have element (and need to be updated)
  }
}

function DisabledOptionPlugin(pluginData) {
  let {
    configuration,
    isChoiceSelectableAspect,
    createWrapAspect,
    buildChoiceAspect,
    filterPredicateAspect,
    wrapsCollection,
    optionToggleAspect,
    buildPickAspect
  } = pluginData;
  let {
    getIsOptionDisabled,
    options
  } = configuration;

  if (options) {
    if (!getIsOptionDisabled) getIsOptionDisabled = option => option.disabled === undefined ? false : option.disabled;
  } else {
    // selectElement
    if (!getIsOptionDisabled) getIsOptionDisabled = option => option.disabled;
  } // TODO check this instead of wrap.updateDisabled
  // function updateDisabled(wrap){
  //     wrap?.choice?.choiceDomManagerHandlers?.updateDisabled?.();
  //     wrap?.pick?.pickDomManagerHandlers?.updateDisabled?.();
  // }


  let origCreateWrap = createWrapAspect.createWrap;

  createWrapAspect.createWrap = option => {
    let wrap = origCreateWrap(option);
    wrap.isOptionDisabled = getIsOptionDisabled(option); // TODO: remove usage wrap.isOptionDisabled

    wrap.updateDisabled = null;
    return wrap;
  };

  let origToggle = optionToggleAspect.toggle;

  optionToggleAspect.toggle = wrap => {
    let success = false;

    if (wrap.isOptionSelected !== undefined) {
      if (wrap.isOptionSelected || !wrap.isOptionDisabled) // TODO: declare dependency on SelectedOptionPlugin
        success = origToggle(wrap);
    } else {
      if (!wrap.isOptionDisabled) {
        success = origToggle(wrap);
      }
    }

    return success;
  };

  let origIsSelectable = isChoiceSelectableAspect.isSelectable;

  isChoiceSelectableAspect.isSelectable = wrap => {
    return origIsSelectable(wrap) && !wrap.isOptionDisabled;
  };

  let origFilterPredicate = filterPredicateAspect.filterPredicate;

  filterPredicateAspect.filterPredicate = (wrap, text) => {
    return !wrap.isOptionDisabled && origFilterPredicate(wrap, text);
  };

  let origBuildChoice = buildChoiceAspect.buildChoice;

  buildChoiceAspect.buildChoice = wrap => {
    origBuildChoice(wrap);
    wrap.updateDisabled = wrap.choice.choiceDomManagerHandlers.updateDisabled;
    wrap.choice.dispose = composeSync(() => {
      wrap.updateDisabled = null;
    }, wrap.choice.dispose);
  };

  let origBuildPick = buildPickAspect.buildPick;

  buildPickAspect.buildPick = (wrap, removeOnButton) => {
    let pick = origBuildPick(wrap, removeOnButton);

    pick.updateDisabled = () => pick.pickDomManagerHandlers.updateDisabled();

    pick.dispose = composeSync(pick.dispose, () => {
      pick.updateDisabled = null;
    });
    let choiceUpdateDisabledBackup = wrap.updateDisabled;
    wrap.updateDisabled = composeSync(choiceUpdateDisabledBackup, pick.updateDisabled); // add pickDisabled

    pick.dispose = composeSync(pick.dispose, () => {
      wrap.updateDisabled = choiceUpdateDisabledBackup; // remove pickDisabled

      wrap.updateDisabled(); // make "true disabled" without it checkbox only looks disabled
    });
    return pick;
  };

  return {
    buildApi(api) {
      api.updateOptionsDisabled = () => wrapsCollection.forLoop(wrap => updateChoiceDisabled(wrap, getIsOptionDisabled));

      api.updateOptionDisabled = key => updateChoiceDisabled(wrapsCollection.get(key), getIsOptionDisabled);
    }

  };
}

function updateChoiceDisabled(wrap, getIsOptionDisabled) {
  let newIsDisabled = getIsOptionDisabled(wrap.option);

  if (newIsDisabled != wrap.isOptionDisabled) {
    wrap.isOptionDisabled = newIsDisabled;
    wrap.updateDisabled?.(); // some hidden oesn't have element (and need to be updated)
  }
}

function PicksApiPlugin(pluginData) {
  let {
    picksList,
    createWrapAspect,
    createPickHandlersAspect,
    addPickAspect
  } = pluginData;
  return {
    buildApi(api) {
      api.forEachPeak = f => picksList.forEach(wrap => f(wrap.option)); // TODO: getHeadPeak


      api.getTailPeak = () => picksList.getTail()?.option;

      api.countPeaks = () => picksList.getCount();

      api.isEmptyPeaks = () => picksList.isEmpty();

      api.addPick = option => {
        let wrap = createWrapAspect.createWrap(option); // TODO should be moved to specific plugins

        wrap.updateDisabled = () => {};

        wrap.updateHidden = () => {};

        let pickHandlers = createPickHandlersAspect.createPickHandlers(wrap);
        addPickAspect.addPick(wrap, pickHandlers);
      };
    }

  };
}

function PicksPlugin(aspects) {
  /*
  if (!addOptionPicked){
      addOptionPicked = (option, index, value) => {
          if (value)
              picks.push(option);
          else
              picks.splice(index, 1);
          return true;
      };
  }
    function trySetWrapSelected(option, updateSelected, booleanValue){
      let success = false;
      var confirmed = setIsOptionSelected(option, booleanValue);
      if (!(confirmed===false)) {
          updateSelected();
          success = true;
      }
      return success;
  }
    let origProcessInput = inputAspect.processInput;
  inputAspect.processInput = () => {
      let origResult = origProcessInput();
      if (!origResult.isEmpty)
      {
          if ( filterManagerAspect.getNavigateManager().getCount() == 1)
          {
              // todo: move exact match to filterManager
              let fullMatchWrap =  filterManagerAspect.getNavigateManager().getHead();
              let text = filterManagerAspect.getFilter();
              if (fullMatchWrap.choice.searchText == text)
              {
                  let success = trySetWrapSelected(fullMatchWrap, true);
                  if (success) {
                      filterDom.setEmpty();
                      origResult.isEmpty = true;
                  }
              }
          }
      }
      return origResult;
  }*/
}

PicksPlugin.plugStaticDom = aspects => {
  let {
    configuration,
    picksList
  } = aspects;
  let {
    picks
  } = configuration;

  if (picks) {
    let {
      add: origAdd,
      reset: origReset
    } = picksList;

    picksList.add = e => {
      let {
        remove,
        index
      } = origAdd(e);
      picks.push(e);
      return {
        remove: composeSync(remove, () => void picks.splice(index(), 1)),
        index
      };
    };

    picksList.reset = () => {
      origReset();
      picks.length = 0;
    };
  }
};

function CreatePopperPlugin(aspects) {
  let {
    environment
  } = aspects;
  let {
    createPopper,
    Popper,
    globalPopper
  } = environment;
  let createModifiersVX = null;
  let createPopperVX = null;

  if (Popper) {
    // V2
    createPopperVX = createPopper = function (createPopperConstructor) {
      return function (anchorElement, element, popperConfiguration) {
        return new createPopperConstructor(anchorElement, element, popperConfiguration);
      };
    }(Popper);
    createModifiersVX = CreateModifiersV1;
  } else if (createPopper) {
    createPopperVX = createPopper;
    createModifiersVX = CreateModifiersV2;
  } else if (globalPopper) {
    if (globalPopper.createPopper) {
      createPopperVX = globalPopper.createPopper;
      createModifiersVX = CreateModifiersV2;
    } else {
      createPopperVX = createPopper = function (createPopperConstructor) {
        return function (anchorElement, element, popperConfiguration) {
          return new createPopperConstructor(anchorElement, element, popperConfiguration);
        };
      }(globalPopper);

      createModifiersVX = CreateModifiersV1;
    }
  } else {
    throw new Error("BsMultiSelect: Popper component (https://popper.js.org) is required");
  }

  aspects.createPopperAspect = CreatePopperAspect(createPopperVX, createModifiersVX);
}

function CreateModifiersV1(preventOverflow) {
  return {
    preventOverflow: {
      enabled: preventOverflow
    },
    hide: {
      enabled: false
    },
    flip: {
      enabled: false
    }
  };
}

function CreateModifiersV2(preventOverflow) {
  var modifiers = [{
    name: 'flip',
    options: {
      fallbackPlacements: ['bottom']
    }
  }];

  if (preventOverflow) {
    modifiers.push({
      name: 'preventOverflow'
    });
  }

  return modifiers;
}

function CreatePopperAspect(createPopperVX, createModifiersVX) {
  return {
    createPopper(element, anchorElement, preventOverflow) {
      let modifiers = createModifiersVX(preventOverflow);
      let popperConfiguration = {
        placement: 'bottom-start',
        modifiers: modifiers
      };
      let popper = null;
      return {
        init() {
          popper = createPopperVX(anchorElement, element, popperConfiguration);
        },

        update() {
          popper.update(); // become async in popper 2; use forceUpdate if sync is needed? 
        },

        setRtl(isRtl) {
          if (isRtl) {
            popperConfiguration.placement = 'bottom-end';
          }
        },

        dispose() {
          popper.destroy();
        }

      };
    }

  };
}

function FloatingLabelPlugin(pluginData) {
  let {
    configuration,
    picksList,
    picksDom,
    filterDom,
    staticDom,
    updateDataAspect,
    resetFilterListAspect,
    floatingLabelAspect
  } = pluginData;
  let {
    css,
    getDefaultLabel
  } = configuration;
  let initialElement = staticDom.initialElement;

  if (floatingLabelAspect.isFloatingLabel()) {
    let labelElement = getDefaultLabel(initialElement);
    let picksElement = picksDom.picksElement;
    var liftToggleStyling1 = toggleStyling(labelElement, css.label_floating_lifted);
    var liftToggleStyling2 = toggleStyling(picksElement, css.picks_floating_lifted);

    function liftedLabel(isEmpty) {
      liftToggleStyling1(isEmpty);
      liftToggleStyling2(isEmpty);
    }

    let isEmpty = () => picksList.isEmpty() && filterDom.isEmpty() && !picksDom.getIsFocusIn();

    function updateLiftedLabel() {
      liftedLabel(!isEmpty());
    }
    updateLiftedLabel();
    resetFilterListAspect.forceResetFilter = composeSync(resetFilterListAspect.forceResetFilter, updateLiftedLabel);
    let origAdd = picksList.add;

    picksList.add = pick => {
      let returnValue = origAdd(pick);
      if (picksList.getCount() == 1) updateLiftedLabel();
      pick.dispose = composeSync(pick.dispose, () => {
        if (picksList.getCount() == 0) updateLiftedLabel();
      });
      return returnValue;
    };

    var origToggleFocusStyling = picksDom.toggleFocusStyling;

    picksDom.toggleFocusStyling = () => {
      var isFocusIn = picksDom.getIsFocusIn();
      origToggleFocusStyling(isFocusIn);
      updateLiftedLabel();
    };

    updateDataAspect.updateData = composeSync(updateDataAspect.updateData, updateLiftedLabel);
  }
}

FloatingLabelPlugin.plugStaticDom = aspects => {
  aspects.floatingLabelAspect = FloatingLabelAspect();
};

function FloatingLabelAspect() {
  return {
    isFloatingLabel() {}

  };
}

// aka auto height and scrolling
function ChoicesDynamicStylingPlugin(aspects) {
  let {
    configuration
  } = aspects;

  if (configuration.useChoicesDynamicStyling) {
    let {
      choicesVisibilityAspect,
      specialPicksEventsAspect
    } = aspects;
    var origSetChoicesVisible = choicesVisibilityAspect.setChoicesVisible;

    aspects.choicesVisibilityAspect.setChoicesVisible = function (visible) {
      if (visible) choicesDynamicStyling(aspects);
      origSetChoicesVisible(visible);
    };

    var origBackSpace = specialPicksEventsAspect.backSpace;

    specialPicksEventsAspect.backSpace = pick => {
      origBackSpace(pick);
      choicesDynamicStyling(aspects);
    };
  }
}

function choicesDynamicStyling(aspects) {
  let {
    configuration,
    environment,
    choicesDom,
    navigateAspect
  } = aspects;
  let window = environment.window;
  let choicesElement = choicesDom.choicesElement;
  let minimalChoicesDynamicStylingMaxHeight = configuration.minimalChoicesDynamicStylingMaxHeight; //find height of the browser window

  var g = window.document.getElementsByTagName('body')[0],
      e = window.document.documentElement,
      y = window.innerHeight || e.clientHeight || g.clientHeight; //find position of choicesElement, if it's at the bottom of the page make the choicesElement shorter

  var pos = choicesElement.parentNode.getBoundingClientRect();
  var new_y = y - pos.top; //calculate multi select max-height

  var msHeight = Math.max(minimalChoicesDynamicStylingMaxHeight, Math.round(new_y * 0.85)); // Michalek: 0.85 is empiric value, without it list was longer than footer height ; TODO: propose better way
  //add css height value

  choicesElement.style.setProperty("max-height", msHeight + "px");
  choicesElement.style.setProperty("overflow-y", "auto");

  if (!choicesDom.ChoicesDynamicStylingPlugin_scrollHandle) {
    choicesDom.ChoicesDynamicStylingPlugin_scrollHandle = true;
    var origNavigateAspectNavigate = navigateAspect.navigate;

    navigateAspect.navigate = function (down) {
      var wrap = origNavigateAspectNavigate(down);
      if (wrap != null && wrap.choice != null && wrap.choice.choiceElement != null) wrap.choice.choiceElement.scrollIntoView(false); // alignTo false -  scroll to the top bottom of dropdown first
      // TODO: BUG if mouse left on the dropdow scroll to bottom and one after doesn't work properly

      return wrap;
    };
  }
}

ChoicesDynamicStylingPlugin.plugDefaultConfig = defaults => {
  defaults.useChoicesDynamicStyling = false;
  defaults.choicesDynamicStyling = choicesDynamicStyling;
  defaults.minimalChoicesDynamicStylingMaxHeight = 20;
};

const defNoResultsWarningMessage = 'No results found';
function WarningPlugin(pluginData) {
  let {
    configuration,
    choicesDom,
    createElementAspect,
    staticManager
  } = pluginData;
  let {
    css
  } = configuration;
  if (configuration.isNoResultsWarningEnabled) pluginData.warningAspect = WarningAspect(choicesDom, createElementAspect, staticManager, css);
}

WarningPlugin.plugDefaultConfig = defaults => {
  defaults.noResultsWarning = defNoResultsWarningMessage;
  defaults.isNoResultsWarningEnabled = false;
};

function WarningAspect(choicesDom, createElementAspect, staticManager, css) {
  let choicesElement = choicesDom.choicesElement;
  var warningElement = createElementAspect.createElement('DIV');
  var origAppendToContainer = staticManager.appendToContainer;

  staticManager.appendToContainer = function () {
    origAppendToContainer();
    choicesElement.parentNode.insertBefore(warningElement, choicesElement.nextSibling); // insert after
  };

  warningElement.style.display = 'none';
  addStyling(warningElement, css.warning);
  return {
    warningElement,

    show(message) {
      warningElement.style.display = 'block';
      warningElement.innerHTML = message;
    },

    hide() {
      warningElement.style.display = 'none';
      warningElement.innerHTML = "";
    }

  };
}

function HighlightPlugin(aspects) {
  let {
    highlightAspect,
    filterManagerAspect,
    buildChoiceAspect
  } = aspects;

  if (highlightAspect) {
    let origProcessEmptyInput = filterManagerAspect.processEmptyInput;

    filterManagerAspect.processEmptyInput = function () {
      highlightAspect.reset();
      origProcessEmptyInput();
    };

    let origSetFilter = filterManagerAspect.setFilter;

    filterManagerAspect.setFilter = function (text) {
      highlightAspect.set(text);
      origSetFilter(text);
    };

    let origBuildChoice = buildChoiceAspect.buildChoice;

    buildChoiceAspect.buildChoice = function (wrap) {
      origBuildChoice(wrap);
      let origSetVisible = wrap.choice.setVisible;

      wrap.choice.setVisible = function (v) {
        origSetVisible(v);
        wrap.choice.choiceDomManagerHandlers.updateHighlighted();
      };
    };
  }
}

HighlightPlugin.plugStaticDom = aspects => {
  if (aspects.configuration.useHighlighting) aspects.highlightAspect = HighlightAspect();
};

HighlightPlugin.plugDefaultConfig = defaults => {
  defaults.useHighlighting = false;
};

function HighlightAspect() {
  let highlighter = null;
  return {
    getHighlighter() {
      return highlighter;
    },

    set(filter) {
      var guarded = filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var regex = new RegExp("(" + guarded + ")", "gi");

      highlighter = function (e, choiceDom, text) {
        // TODO replace with
        // var pos = text.indexOf(filter);
        e.innerHTML = text.replace(regex, "<u>$1</u>"); // TODO to method
        // var nodes = e.querySelectorAll('u');
        // var array = Array.prototype.slice.call(nodes);
        // if (choiceDom.highlightedElements)
        //     choiceDom.highlightedElements.concat(array);
        // else
        //     choiceDom.highlightedElements = array;
      };
    },

    reset() {
      highlighter = null;
    }

  };
}

function CustomChoiceStylingsPlugin(apsects) {
  let {
    configuration,
    choiceDomFactory
  } = apsects;
  let customChoiceStylings = configuration.customChoiceStylings;
  CustomChoiceStylingsPluginF(customChoiceStylings, choiceDomFactory);
}

CustomChoiceStylingsPlugin.plugDefaultConfig = defaults => {
  defaults.customChoiceStylings = null;
};

function CustomChoiceStylingsPluginF(customChoiceStylings, choiceDomFactory) {
  let customChoiceStylingsAspect = CustomChoiceStylingsAspect(customChoiceStylings);
  let origChoiceDomFactoryCreate = choiceDomFactory.create;

  choiceDomFactory.create = function (choiceElement, wrap, toggle) {
    var o = origChoiceDomFactoryCreate(choiceElement, wrap, toggle);
    customChoiceStylingsAspect.customize(wrap, o.choiceDom, o.choiceDomManagerHandlers);
    return o;
  };
}
function CustomChoiceStylingsAspect(customChoiceStylings) {
  return {
    customize(wrap, choiceDom, choiceDomManagerHandlers) {
      if (customChoiceStylings) {
        var handlers = customChoiceStylings(choiceDom, wrap.option);

        if (handlers) {
          function customChoiceStylingsClosure(custom) {
            return function () {
              custom({
                isOptionSelected: wrap.isOptionSelected,
                isOptionDisabled: wrap.isOptionDisabled,
                isHoverIn: wrap.choice.isHoverIn //isHighlighted: wrap.choice.isHighlighted  // TODO isHighlighted should be developed

              });
            };
          }

          if (choiceDomManagerHandlers.updateHoverIn && handlers.updateHoverIn) choiceDomManagerHandlers.updateHoverIn = composeSync(choiceDomManagerHandlers.updateHoverIn, customChoiceStylingsClosure(handlers.updateHoverIn));
          if (choiceDomManagerHandlers.updateSelected && handlers.updateSelected) choiceDomManagerHandlers.updateSelected = composeSync(choiceDomManagerHandlers.updateSelected, customChoiceStylingsClosure(handlers.updateSelected));
          if (choiceDomManagerHandlers.updateDisabled && handlers.updateDisabled) choiceDomManagerHandlers.updateDisabled = composeSync(choiceDomManagerHandlers.updateDisabled, customChoiceStylingsClosure(handlers.updateDisabled));
          if (choiceDomManagerHandlers.updateHighlighted && handlers.updateHighlighted) choiceDomManagerHandlers.updateHighlighted = composeSync(choiceDomManagerHandlers.updateHighlighted, customChoiceStylingsClosure(handlers.updateHighlighted));
        }
      }
    }

  };
}

function CustomPickStylingsPlugin(aspects) {
  let {
    componentPropertiesAspect,
    configuration,
    pickDomFactory
  } = aspects;
  let customPickStylings = configuration.customPickStylings;
  CustomPickStylingsPluginF(componentPropertiesAspect, pickDomFactory, customPickStylings);
}

CustomPickStylingsPlugin.plugDefaultConfig = defaults => {
  defaults.customPickStylings = null;
};

function CustomPickStylingsPluginF(componentPropertiesAspect, pickDomFactory, customPickStylings) {
  let customPickStylingsAspect = CustomPickStylingsAspect(componentPropertiesAspect, customPickStylings);
  let origPickDomFactoryCreate = pickDomFactory.create;

  pickDomFactory.create = function (pickElement, wrap, removeOnButton) {
    var o = origPickDomFactoryCreate(pickElement, wrap, removeOnButton);
    customPickStylingsAspect.customize(wrap, o.pickDom, o.pickDomManagerHandlers);
    return o;
  };
}

function CustomPickStylingsAspect(componentPropertiesAspect, customPickStylings) {
  return {
    customize(wrap, pickDom, pickDomManagerHandlers) {
      if (customPickStylings) {
        var handlers = customPickStylings(pickDom, wrap.option);

        if (handlers) {
          function customPickStylingsClosure(custom) {
            return function () {
              custom({
                isOptionDisabled: wrap.isOptionDisabled,
                isComponentDisabled: componentPropertiesAspect.getDisabled()
              });
            };
          }

          if (pickDomManagerHandlers.updateDisabled && handlers.updateDisabled) pickDomManagerHandlers.updateDisabled = composeSync(pickDomManagerHandlers.updateDisabled, customPickStylingsClosure(handlers.updateDisabled));
          if (pickDomManagerHandlers.updateComponentDisabled && handlers.updateComponentDisabled) pickDomManagerHandlers.updateComponentDisabled = composeSync(pickDomManagerHandlers.updateComponentDisabled, customPickStylingsClosure(handlers.updateComponentDisabled));
        }
      }
    }

  };
}

function UpdateAppearancePlugin(aspects) {
  var {
    updateAppearanceAspect,
    updateAspect,
    loadAspect
  } = aspects;
  updateAspect.update = composeSync(updateAspect.update, () => updateAppearanceAspect.updateAppearance());
  loadAspect.load = composeSync(loadAspect.load, () => updateAppearanceAspect.updateAppearance());
  return {
    buildApi(api) {
      api.updateAppearance = () => updateAppearanceAspect.updateAppearance();
    }

  };
}

UpdateAppearancePlugin.plugStaticDom = aspects => {
  aspects.updateAppearanceAspect = UpdateAppearanceAspect();
};

function UpdateAppearanceAspect() {
  return {
    updateAppearance() {}

  };
}

function DisableComponentPlugin(aspects) {
  var {
    updateAppearanceAspect,
    picksList,
    picksDom,
    componentPropertiesAspect
  } = aspects;
  var disableComponentAspect = DisableComponentAspect(picksList, picksDom);
  aspects.disableComponentAspect = disableComponentAspect;
  let isComponentDisabled; // state! 

  function updateDisabled() {
    let newIsComponentDisabled = componentPropertiesAspect.getDisabled();

    if (isComponentDisabled !== newIsComponentDisabled) {
      isComponentDisabled = newIsComponentDisabled;
      disableComponentAspect.disableComponent(newIsComponentDisabled);
    }
  }

  updateAppearanceAspect.updateAppearance = composeSync(updateAppearanceAspect.updateAppearance, updateDisabled);
  return {
    buildApi(api) {
      api.updateDisabled = updateDisabled;
    }

  };
}

function DisableComponentAspect(picksList, picksDom) {
  return {
    disableComponent(isComponentDisabled) {
      picksList.forEach(pick => pick.pickDomManagerHandlers.updateComponentDisabled());
      picksDom.disable(isComponentDisabled);
    }

  };
}

let multiSelectPlugins = {
  CssPatchPlugin,
  SelectElementPlugin,
  LabelForAttributePlugin,
  HiddenOptionPlugin,
  ValidationApiPlugin,
  UpdateAppearancePlugin,
  BsAppearancePlugin,
  DisableComponentPlugin,
  FormResetPlugin,
  CreatePopperPlugin,
  WarningPlugin,
  RtlPlugin,
  PlaceholderPlugin,
  FloatingLabelPlugin,
  OptionsApiPlugin,
  JQueryMethodsPlugin,
  SelectedOptionPlugin,
  FormRestoreOnBackwardPlugin,
  DisabledOptionPlugin,
  PicksApiPlugin,
  HighlightPlugin,
  ChoicesDynamicStylingPlugin,
  CustomPickStylingsPlugin,
  CustomChoiceStylingsPlugin
};
let picksPlugins = {
  CssPatchPlugin,
  PicksPlugin,
  LabelForAttributePlugin,
  ValidationApiPlugin,
  UpdateAppearancePlugin,
  BsAppearancePlugin,
  DisableComponentPlugin,
  CreatePopperPlugin,
  WarningPlugin,
  RtlPlugin,
  PlaceholderPlugin,
  FloatingLabelPlugin,
  OptionsApiPlugin,
  JQueryMethodsPlugin,
  PicksApiPlugin,
  HighlightPlugin,
  ChoicesDynamicStylingPlugin,
  CustomPickStylingsPlugin,
  CustomChoiceStylingsPlugin
};
let allPlugins = shallowClearClone(multiSelectPlugins, {
  PicksPlugin
}); // var defaultConfig = {
//     plugins: multiSelectPlugins
// }
// var picksConfig = {
//     plugins: picksPlugins
// }
// export function createConfig(arg){
//     return config;
// }

let utilities = {
  composeSync,
  EventBinder,
  addStyling,
  toggleStyling
};

function ModuleFactory$1(environment, customizationPlugins) {
  if (!environment.trigger) environment.trigger = (e, name) => e.dispatchEvent(new environment.window.Event(name));
  let pluginsArray = ObjectValues(shallowClearClone(customizationPlugins, multiSelectPlugins));
  let {
    create: BsMultiSelect,
    BsMultiSelectDefault
  } = MultiSelectBuilder(environment, pluginsArray);
  BsMultiSelect.Default = BsMultiSelectDefault;
  let picksPluginsArray = ObjectValues(shallowClearClone(customizationPlugins, picksPlugins));
  let {
    create: BsPicks,
    BsPicksDefault
  } = MultiSelectBuilder(environment, picksPluginsArray);
  BsPicks.Default = BsPicksDefault;
  return {
    BsMultiSelect,
    BsPicks,
    MultiSelectTools: {
      MultiSelectBuilder,
      plugins: shallowClearClone(customizationPlugins, allPlugins),
      utilities
    }
  };
} // TEST
// function areValidElements(...args) {
//     const result = Object.values(obj);
//     return !args.some(
//       (element) =>
//         !(element && typeof element.getBoundingClientRect === 'function')
//     );
// }
// function ModuleFactory(environment) {
//     if (!environment.trigger)
//         environment.trigger = (e, name) => e.dispatchEvent(new environment.window.Event(name))
//     let pluginsArray = ObjectValues(shallowClearClone({Bs5Plugin}, multiSelectPlugins));
//     let {create: BsMultiSelect, BsMultiSelectDefault} = MultiSelectBuilder(environment, pluginsArray) 
//     BsMultiSelect.Default = BsMultiSelectDefault;
//     let picksPluginsArray = ObjectValues(shallowClearClone({Bs5Plugin}, picksPlugins));
//     let {create: BsPicks, BsPicksDefault} = MultiSelectBuilder(environment, picksPluginsArray) 
//     BsPicks.Default = BsPicksDefault;
//     return {
//         BsMultiSelect,
//         BsPicks,
//         MultiSelectTools: {MultiSelectBuilder, plugins: shallowClearClone({Bs5Plugin}, allPlugins), utilities} 
//     }
// }

function ModuleFactory(environment) {
  return ModuleFactory$1(environment, {
    Bs5Plugin
  });
}

function legacyConstructor(element, environment, settings) {
  console.log("DashboarCode.BsMultiSelect: 'BsMultiSelect' is depricated, use - ModuleFactory(environment).BsMultiSelect(element, settings)");
  var {
    BsMultiSelect
  } = ModuleFactory(environment);
  var bsMultiSelect = BsMultiSelect(element, settings);
  return bsMultiSelect;
}


//# sourceMappingURL=BsMultiSelect.mjs.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("./src/webpackAppTs/index.ts");
/******/ 	// This entry module doesn't tell about it's top-level declarations so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/webpackAppTs/index.html");
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map