// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({9:[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],8:[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":9}],3:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      module.exports = {};
},{"_css_loader":8}],7:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;
exports.app = app;
function h(name, attributes) {
  var rest = [];
  var children = [];
  var length = arguments.length;

  while (length-- > 2) rest.push(arguments[length]);

  while (rest.length) {
    var node = rest.pop();
    if (node && node.pop) {
      for (length = node.length; length--;) {
        rest.push(node[length]);
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node);
    }
  }

  return typeof name === "function" ? name(attributes || {}, children) : {
    nodeName: name,
    attributes: attributes || {},
    children: children,
    key: attributes && attributes.key
  };
}

function app(state, actions, view, container) {
  var map = [].map;
  var rootElement = container && container.children[0] || null;
  var oldNode = rootElement && recycleElement(rootElement);
  var lifecycle = [];
  var skipRender;
  var isRecycling = true;
  var globalState = clone(state);
  var wiredActions = wireStateToActions([], globalState, clone(actions));

  scheduleRender();

  return wiredActions;

  function recycleElement(element) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function (element) {
        return element.nodeType === 3 // Node.TEXT_NODE
        ? element.nodeValue : recycleElement(element);
      })
    };
  }

  function resolveNode(node) {
    return typeof node === "function" ? resolveNode(node(globalState, wiredActions)) : node != null ? node : "";
  }

  function render() {
    skipRender = !skipRender;

    var node = resolveNode(view);

    if (container && !skipRender) {
      rootElement = patch(container, rootElement, oldNode, oldNode = node);
    }

    isRecycling = false;

    while (lifecycle.length) lifecycle.pop()();
  }

  function scheduleRender() {
    if (!skipRender) {
      skipRender = true;
      setTimeout(render);
    }
  }

  function clone(target, source) {
    var out = {};

    for (var i in target) out[i] = target[i];
    for (var i in source) out[i] = source[i];

    return out;
  }

  function setPartialState(path, value, source) {
    var target = {};
    if (path.length) {
      target[path[0]] = path.length > 1 ? setPartialState(path.slice(1), value, source[path[0]]) : value;
      return clone(source, target);
    }
    return value;
  }

  function getPartialState(path, source) {
    var i = 0;
    while (i < path.length) {
      source = source[path[i++]];
    }
    return source;
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function" ? function (key, action) {
        actions[key] = function (data) {
          var result = action(data);

          if (typeof result === "function") {
            result = result(getPartialState(path, globalState), actions);
          }

          if (result && result !== (state = getPartialState(path, globalState)) && !result.then // !isPromise
          ) {
              scheduleRender(globalState = setPartialState(path, clone(state, result), globalState));
            }

          return result;
        };
      }(key, actions[key]) : wireStateToActions(path.concat(key), state[key] = clone(state[key]), actions[key] = clone(actions[key]));
    }

    return actions;
  }

  function getKey(node) {
    return node ? node.key : null;
  }

  function eventListener(event) {
    return event.currentTarget.events[event.type](event);
  }

  function updateAttribute(element, name, value, oldValue, isSvg) {
    if (name === "key") {} else if (name === "style") {
      for (var i in clone(oldValue, value)) {
        var style = value == null || value[i] == null ? "" : value[i];
        if (i[0] === "-") {
          element[name].setProperty(i, style);
        } else {
          element[name][i] = style;
        }
      }
    } else {
      if (name[0] === "o" && name[1] === "n") {
        name = name.slice(2);

        if (element.events) {
          if (!oldValue) oldValue = element.events[name];
        } else {
          element.events = {};
        }

        element.events[name] = value;

        if (value) {
          if (!oldValue) {
            element.addEventListener(name, eventListener);
          }
        } else {
          element.removeEventListener(name, eventListener);
        }
      } else if (name in element && name !== "list" && name !== "type" && name !== "draggable" && name !== "spellcheck" && name !== "translate" && !isSvg) {
        element[name] = value == null ? "" : value;
      } else if (value != null && value !== false) {
        element.setAttribute(name, value);
      }

      if (value == null || value === false) {
        element.removeAttribute(name);
      }
    }
  }

  function createElement(node, isSvg) {
    var element = typeof node === "string" || typeof node === "number" ? document.createTextNode(node) : (isSvg = isSvg || node.nodeName === "svg") ? document.createElementNS("http://www.w3.org/2000/svg", node.nodeName) : document.createElement(node.nodeName);

    var attributes = node.attributes;
    if (attributes) {
      if (attributes.oncreate) {
        lifecycle.push(function () {
          attributes.oncreate(element);
        });
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i] = resolveNode(node.children[i]), isSvg));
      }

      for (var name in attributes) {
        updateAttribute(element, name, attributes[name], null, isSvg);
      }
    }

    return element;
  }

  function updateElement(element, oldAttributes, attributes, isSvg) {
    for (var name in clone(oldAttributes, attributes)) {
      if (attributes[name] !== (name === "value" || name === "checked" ? element[name] : oldAttributes[name])) {
        updateAttribute(element, name, attributes[name], oldAttributes[name], isSvg);
      }
    }

    var cb = isRecycling ? attributes.oncreate : attributes.onupdate;
    if (cb) {
      lifecycle.push(function () {
        cb(element, oldAttributes);
      });
    }
  }

  function removeChildren(element, node) {
    var attributes = node.attributes;
    if (attributes) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i]);
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element);
      }
    }
    return element;
  }

  function removeElement(parent, element, node) {
    function done() {
      parent.removeChild(removeChildren(element, node));
    }

    var cb = node.attributes && node.attributes.onremove;
    if (cb) {
      cb(element, done);
    } else {
      done();
    }
  }

  function patch(parent, element, oldNode, node, isSvg) {
    if (node === oldNode) {} else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
      var newElement = createElement(node, isSvg);
      parent.insertBefore(newElement, element);

      if (oldNode != null) {
        removeElement(parent, element, oldNode);
      }

      element = newElement;
    } else if (oldNode.nodeName == null) {
      element.nodeValue = node;
    } else {
      updateElement(element, oldNode.attributes, node.attributes, isSvg = isSvg || node.nodeName === "svg");

      var oldKeyed = {};
      var newKeyed = {};
      var oldElements = [];
      var oldChildren = oldNode.children;
      var children = node.children;

      for (var i = 0; i < oldChildren.length; i++) {
        oldElements[i] = element.childNodes[i];

        var oldKey = getKey(oldChildren[i]);
        if (oldKey != null) {
          oldKeyed[oldKey] = [oldElements[i], oldChildren[i]];
        }
      }

      var i = 0;
      var k = 0;

      while (k < children.length) {
        var oldKey = getKey(oldChildren[i]);
        var newKey = getKey(children[k] = resolveNode(children[k]));

        if (newKeyed[oldKey]) {
          i++;
          continue;
        }

        if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
          if (oldKey == null) {
            removeElement(element, oldElements[i], oldChildren[i]);
          }
          i++;
          continue;
        }

        if (newKey == null || isRecycling) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChildren[i], children[k], isSvg);
            k++;
          }
          i++;
        } else {
          var keyedNode = oldKeyed[newKey] || [];

          if (oldKey === newKey) {
            patch(element, keyedNode[0], keyedNode[1], children[k], isSvg);
            i++;
          } else if (keyedNode[0]) {
            patch(element, element.insertBefore(keyedNode[0], oldElements[i]), keyedNode[1], children[k], isSvg);
          } else {
            patch(element, oldElements[i], null, children[k], isSvg);
          }

          newKeyed[newKey] = children[k];
          k++;
        }
      }

      while (i < oldChildren.length) {
        if (getKey(oldChildren[i]) == null) {
          removeElement(element, oldElements[i], oldChildren[i]);
        }
        i++;
      }

      for (var i in oldKeyed) {
        if (!newKeyed[i]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
        }
      }
    }
    return element;
  }
}
},{}],5:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = combineModules;
function combineModules(tree) {
    var modules = {};

    for (var name in tree.modules || {}) {
        modules[name] = combineModules(tree.modules[name]);
    }

    var state = tree.state || {};
    var actions = tree.actions || {};

    for (var _name in modules) {
        state[_name] = modules[_name].state || {};
        actions[_name] = modules[_name].actions || {};
    }

    var view = function view(state, actions) {
        var subviews = {};
        for (var _name2 in modules) {
            if (!modules[_name2].view) continue;
            subviews[_name2] = modules[_name2].view(state[_name2], actions[_name2]);
        }
        return tree.view && tree.view(state, actions, subviews);
    };

    return { state: state, actions: actions, view: view };
}
},{}],10:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      module.exports = {
  "container": "main_container_2MJY_",
  "left": "main_left_37YCB",
  "right ": "main_right _2uDWc",
  "mainPanel": "main_mainPanel_3gYtz"
};
},{"_css_loader":8}],23:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cc;
function cc(classes, prefix) {
  var value;
  var className = "";
  var type = typeof classes;

  if (classes && type === "string" || type === "number") {
    return classes;
  }

  prefix = prefix || " ";

  if (Array.isArray(classes) && classes.length) {
    for (var i = 0, len = classes.length; i < len; i++) {
      if (value = cc(classes[i], prefix)) {
        className += (className && prefix) + value;
      }
    }
  } else {
    for (var i in classes) {
      if (classes.hasOwnProperty(i) && (value = classes[i])) {
        className += (className && prefix) + i + (typeof value === "object" ? cc(value, prefix + i) : "");
      }
    }
  }

  return className;
}
},{}],25:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      module.exports = {
  "keyboard": "keyboard_keyboard_3VA4j",
  "clav": "keyboard_clav_26Iqb",
  "black": "keyboard_black_3Cgo8",
  "pressed": "keyboard_pressed_1cGZj",
  "char": "keyboard_char_3m2iF"
};
},{"_css_loader":8}],19:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var SEQUENCER_LENGTH = exports.SEQUENCER_LENGTH = 256;
var SEQUENCER_INTERVAL = exports.SEQUENCER_INTERVAL = 100;
var NOTE_NAMES = exports.NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B', 'C'];
var KEYBOARD_KEYS = exports.KEYBOARD_KEYS = ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm', 'q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u', 'i'];

var KEYBOARD_BLACK_KEYS = exports.KEYBOARD_BLACK_KEYS = ['s', 'd', 'g', 'h', 'j', '2', '3', '5', '6', '7'];

var SYNTH_DEFAULTS = exports.SYNTH_DEFAULTS = {
    octave: 4,
    oscillatorType: 'triangle',
    ampLevel: 0.3,
    sustainLevel: 0.6,
    attackTime: 0.02,
    decayTime: 0.04,
    releaseTime: 0.4,
    filterCutoff: 7600,
    filterQ: 10
};

var OSCILLATOR_TYPES = exports.OSCILLATOR_TYPES = ['sawtooth', 'square', 'triangle', 'sine'];

var TUNING_FREQ = exports.TUNING_FREQ = 440;
var TUNING_NOTE = exports.TUNING_NOTE = 69;
},{}],11:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperapp = require('hyperapp');

var _classcat = require('classcat');

var _classcat2 = _interopRequireDefault(_classcat);

var _keyboard = require('./css/keyboard.css');

var _keyboard2 = _interopRequireDefault(_keyboard);

var _const = require('./const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isBlack = function isBlack(char) {
    return _const.KEYBOARD_BLACK_KEYS.indexOf(char) > -1;
};

var _Keyboard = function _Keyboard(_ref) {
    var pressed = _ref.pressed,
        attack = _ref.attack,
        release = _ref.release;
    return (0, _hyperapp.h)(
        'div',
        { 'class': _keyboard2.default.keyboard, key: 'keyboard' },
        _const.KEYBOARD_KEYS.map(function (char) {
            var _ref2;

            return (0, _hyperapp.h)(
                'div',
                {
                    'class': (0, _classcat2.default)([_keyboard2.default.clav, (_ref2 = {}, _defineProperty(_ref2, _keyboard2.default.black, isBlack(char)), _defineProperty(_ref2, _keyboard2.default.pressed, char === pressed), _ref2)]),
                    onmousedown: function onmousedown(ev) {
                        return attack(char);
                    },
                    onmouseup: function onmouseup(ev) {
                        return release(char);
                    }
                },
                (0, _hyperapp.h)(
                    'span',
                    { 'class': _keyboard2.default.char },
                    char.toUpperCase()
                )
            );
        })
    );
};

exports.default = {
    state: {
        pressed: null
    },

    actions: {

        init: function init(_ref3) {
            var onpress = _ref3.onpress;
            return function (state, actions) {
                addEventListener('keydown', function (ev) {
                    return actions.attack(ev.key) && ev.preventDefault(true);
                });
                addEventListener('keyup', function (ev) {
                    return actions.release(ev.key) && ev.preventDefault(true);
                });
                return { onpress: onpress };
            };
        },

        attack: function attack(char) {
            return function (state) {
                var note = _const.KEYBOARD_KEYS.indexOf(char);
                if (note === -1) return;
                if (char === state.pressed) return;
                state.onpress(note);
                return { pressed: char };
            };
        },

        release: function release(char) {
            return function (state) {
                var note = _const.KEYBOARD_KEYS.indexOf(char);
                if (note === -1) return;
                if (char !== state.pressed) return;
                state.onpress(null);
                return { pressed: null };
            };
        }
    },

    view: function view(state, actions) {
        return {
            Keyboard: function Keyboard(_) {
                return _Keyboard({
                    attack: actions.attack,
                    release: actions.release,
                    pressed: state.pressed
                });
            }
        };
    }
};
},{"hyperapp":7,"classcat":23,"./css/keyboard.css":25,"./const":19}],29:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function stackHandlers(attr, name, handler) {
    var orig = attr[name];
    attr[name] = !orig ? handler : function () {
        orig.apply(undefined, arguments);
        fn.apply(undefined, arguments);
    };
}

exports.default = function (getDeco) {
    return function (attr, children) {
        var decorations = getDeco(attr);
        return children.map(function (child) {
            if (!child.attributes) return child;
            for (var name in decorations) {
                if (name === 'class') {
                    child.attributes.class = child.attributes.class + ' ' + decorations.class;
                } else if (name.substr(0, 2) === 'on') {
                    stackHandlers(child.attributes, name, decorations[name]);
                } else {
                    child.attributes[name] = decorations[name];
                }
            }
            return child;
        });
    };
};
},{}],28:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      module.exports = {
  "scrollContainer": "sequencer_scrollContainer_3ci3u",
  "sequencer": "sequencer_sequencer_EqxkS",
  "selected": "sequencer_selected_18jv1",
  "time": "sequencer_time_hwPCS",
  "playing": "sequencer_playing_19tq6"
};
},{"_css_loader":8}],26:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.module = exports.applySelection = undefined;

var _decorator = require('./lib/decorator');

var _decorator2 = _interopRequireDefault(_decorator);

var _sequencer = require('./css/sequencer.css');

var _sequencer2 = _interopRequireDefault(_sequencer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isSelected = function isSelected(state, row, col) {
    if (state.start === null) return false;
    var r = col === state.column && row >= state.start && row <= state.end;
    return r;
};

var applySelection = exports.applySelection = function applySelection(state, notes, note) {
    if (state.start === null) return notes;
    return notes.map(function (rowvals, row) {
        return rowvals.map(function (val, col) {
            return isSelected(state, row, col) ? note : val;
        });
    });
};

var _module = function _module(_) {
    return {

        state: {
            anchor: null,
            column: null,
            start: null,
            end: null,
            selecting: false,
            haveSelection: false
        },

        actions: {
            _set: function _set(x) {
                return x;
            },

            init: function init(_ref) {
                var onselectcolumn = _ref.onselectcolumn;
                return function (state, actions) {
                    actions._set({ onselectcolumn: onselectcolumn });
                    actions.reset();
                };
            },

            start: function start(_ref2) {
                var row = _ref2.row,
                    col = _ref2.col;
                return function (state) {
                    state.onselectcolumn(col);
                    return {
                        selecting: true,
                        haveSelection: true,
                        anchor: row,
                        column: col,
                        start: row,
                        end: row
                    };
                };
            },

            select: function select(_ref3) {
                var row = _ref3.row;
                return function (state) {
                    if (state.anchor === null) return;
                    return row < state.anchor ? { start: row, end: state.anchor } : { start: state.anchor, end: row };
                };
            },

            end: function end(_ref4) {
                var row = _ref4.row;
                return { anchor: null, selecting: false };
            },

            reset: function reset(_) {
                return {
                    anchor: null,
                    column: null,
                    start: null,
                    end: null,
                    selecting: false,
                    haveSelection: false
                };
            }
        },

        view: function view(state, actions) {
            return {
                Decorator: (0, _decorator2.default)(function (_ref5) {
                    var row = _ref5.row,
                        col = _ref5.col,
                        disabled = _ref5.disabled;
                    return !disabled ? {
                        onmousedown: function onmousedown(ev) {
                            ev.preventDefault(true);
                            actions.start({ row: row, col: col });
                        },
                        onmouseup: function onmouseup(ev) {
                            ev.preventDefault(true);
                            actions.end({ row: row, col: col });
                        },
                        onmouseover: function onmouseover(ev) {
                            ev.preventDefault(true);
                            actions.select({ row: row, col: col });
                        },
                        class: isSelected(state, row, col) ? _sequencer2.default.selected : ''
                    } : {};
                })
            };
        }
    };
};
exports.module = _module;
},{"./lib/decorator":29,"./css/sequencer.css":28}],24:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      module.exports = {
  "active": "button_active_75kSy"
};
},{"_css_loader":8}],22:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _hyperapp = require('hyperapp');

var _button = require('./css/button.css');

var _button2 = _interopRequireDefault(_button);

var _classcat = require('classcat');

var _classcat2 = _interopRequireDefault(_classcat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (props, children) {
    var active = props.active;
    delete props.active;
    var cmd = props.do;
    delete props.do;
    return (0, _hyperapp.h)(
        'button',
        _extends({}, props, {
            'class': (0, _classcat2.default)(_defineProperty({}, _button2.default.active, active)),
            onmousedown: cmd
        }),
        children
    );
};
},{"hyperapp":7,"./css/button.css":24,"classcat":23}],27:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperapp = require('hyperapp');

var _const = require('./const');

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_) {
    return {
        state: {
            playing: false,
            interval: null,
            row: null
        },

        actions: {
            init: function init(_ref) {
                var onplayrow = _ref.onplayrow,
                    onstop = _ref.onstop,
                    onstart = _ref.onstart;
                return { onplayrow: onplayrow, onstop: onstop, onstart: onstart };
            },
            setRow: function setRow(row) {
                return { row: row };
            },
            next: function next(_) {
                return function (state, actions) {
                    var row = (state.row + 1) % _const.SEQUENCER_LENGTH;
                    state.onplayrow(row);
                    actions.setRow(row);
                };
            },
            play: function play(_) {
                return function (state, actions) {
                    if (state.interval) return;
                    state.onstart();
                    actions.setRow((state.row || 0) - 1);
                    return { playing: true, interval: setInterval(actions.next, _const.SEQUENCER_INTERVAL) };
                };
            },
            stop: function stop(_) {
                return function (state, actions) {
                    state.interval && clearInterval(state.interval);
                    state.onstop();
                    return { playing: false, interval: null };
                };
            }
        },

        view: function view(state, actions) {
            return {
                PlayButton: function PlayButton(_) {
                    return (0, _hyperapp.h)(
                        _button2.default,
                        {
                            'do': actions.play,
                            active: state.interval
                        },
                        'Play'
                    );
                },
                StopButton: function StopButton(_) {
                    return (0, _hyperapp.h)(
                        _button2.default,
                        { 'do': actions.stop },
                        'Stop'
                    );
                }
            };
        }
    };
};
},{"hyperapp":7,"./const":19,"./button":22}],12:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperapp = require('hyperapp');

var _const = require('./const');

var _selection = require('./selection');

var _playback = require('./playback');

var _playback2 = _interopRequireDefault(_playback);

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

var _sequencer = require('./css/sequencer.css');

var _sequencer2 = _interopRequireDefault(_sequencer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var noteName = function noteName(note) {
    return note === null ? '' : _const.NOTE_NAMES[note];
};

exports.default = {
    modules: {
        selection: (0, _selection.module)(),
        playback: (0, _playback2.default)()
    },

    state: { notes: [].concat(_toConsumableArray(Array(_const.SEQUENCER_LENGTH).keys())).map(function (_) {
            return [].concat(_toConsumableArray(Array(8).keys())).map(function (_) {
                return null;
            });
        }) },

    actions: {

        init: function init(_ref) {
            var onselectvoice = _ref.onselectvoice,
                onplay = _ref.onplay,
                _onstop = _ref.onstop;
            return function (state, actions) {

                window.addEventListener('keydown', function (ev) {
                    if (ev.key !== ' ') return;
                    ev.preventDefault(true);
                    actions.controlPress();
                });

                actions.selection.init({
                    onselectcolumn: function onselectcolumn(col) {
                        return onselectvoice('ABCDEFGH'[col]);
                    }
                });

                actions.playback.init({
                    onstart: actions.selection.reset,
                    onplayrow: actions.playRow,
                    onstop: function onstop(_) {
                        actions.stopRecording();
                        _onstop();
                    }
                });
                return { onplay: onplay };
            };
        },

        controlPress: function controlPress(_) {
            return function (state, actions) {
                if (state.playback.playing) {
                    actions.playback.stop();
                } else if (state.selection.haveSelection) {
                    actions.setNoteOnSelection(null);
                } else {
                    actions.playback.play();
                }
            };
        },

        attack: function attack(_ref2) {
            var note = _ref2.note,
                voice = _ref2.voice;
            return function (state, actions) {
                if (state.selection.haveSelection) actions.setNoteOnSelection(note);
                if (state.recording) actions.recordNote({ note: note, voice: voice });
            };
        },

        release: function release(_) {
            return function (state, actions) {
                if (state.recording) {
                    return { recordingNote: null };
                }
            };
        },

        setNoteOnSelection: function setNoteOnSelection(note) {
            return function (state, actions) {
                var notes = (0, _selection.applySelection)(state.selection, state.notes, note);
                actions.selection.reset();
                return { notes: notes };
            };
        },

        playRow: function playRow(row) {
            return function (state, actions) {
                if (state.recordingNote) actions.setRecordedNote(state.recordingNote);
                state.notes[row].forEach(function (note, col) {
                    var voice = 'ABCDEFGH'[col];
                    if (state.recordingNote && state.recordingNote.voice === voice) return;
                    state.onplay({ voice: 'ABCDEFGH'[col], note: note });
                });
            };
        },
        startRecording: function startRecording(_) {
            return function (state, actions) {
                actions.playback.play();
                return { recording: true };
            };
        },

        stopRecording: function stopRecording(_) {
            return { recording: false, recordingNote: null };
        },

        recordNote: function recordNote(_ref3) {
            var note = _ref3.note,
                voice = _ref3.voice;
            return function (state, actions) {
                actions.setRecordedNote({ note: note, voice: voice });
                return { recordingNote: { note: note, voice: voice } };
            };
        },

        setRecordedNote: function setRecordedNote(_ref4) {
            var note = _ref4.note,
                voice = _ref4.voice;
            return function (state) {
                var notes = state.notes.map(function (arr, row) {
                    return arr.map(function (oldNote, col) {
                        if (row === state.playback.row && 'ABCDEFGH'[col] === voice) return note;
                        return oldNote;
                    });
                });
                return { notes: notes };
            };
        }

    },

    view: function view(state, actions, views) {
        return {
            Controls: function Controls(_) {
                return (0, _hyperapp.h)(
                    'span',
                    null,
                    (0, _hyperapp.h)(
                        _button2.default,
                        { 'do': actions.startRecording, active: state.recording },
                        'Rec'
                    ),
                    (0, _hyperapp.h)(views.playback.PlayButton, null),
                    (0, _hyperapp.h)(views.playback.StopButton, null),
                    (0, _hyperapp.h)(
                        _button2.default,
                        { 'do': function _do(_) {
                                return actions.setNote(null);
                            } },
                        'X'
                    )
                );
            },
            Sequencer: function Sequencer(_) {
                return (0, _hyperapp.h)(
                    'div',
                    { 'class': _sequencer2.default.scrollContainer },
                    (0, _hyperapp.h)(
                        'table',
                        { 'class': _sequencer2.default.sequencer },
                        state.notes.map(function (vals, row) {
                            return (0, _hyperapp.h)(
                                'tr',
                                { onupdate: function onupdate(el) {
                                        if (state.playback.playing && state.playback.row === row - 5) el.scrollIntoView(false);
                                    } },
                                (0, _hyperapp.h)(
                                    'td',
                                    { onclick: function onclick(_) {
                                            return actions.playback.setRow(row);
                                        }, 'class': _sequencer2.default.time + (state.playback.row === row ? _sequencer2.default.playing : '') },
                                    row
                                ),
                                vals.map(function (note, col) {
                                    return (0, _hyperapp.h)(
                                        views.selection.Decorator,
                                        { row: row, col: col, disabled: state.playback.playing },
                                        (0, _hyperapp.h)(
                                            'td',
                                            { 'class': state.playback.row === row ? _sequencer2.default.playing : false },
                                            noteName(note)
                                        )
                                    );
                                })
                            );
                        })
                    )
                );
            }
        };
    }
};
},{"hyperapp":7,"./const":19,"./selection":26,"./playback":27,"./button":22,"./css/sequencer.css":28}],20:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = require('./const');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function noteToHz(note, octave) {
    return Math.exp((octave * 12 + note - _const.TUNING_NOTE) * Math.log(2) / 12) * _const.TUNING_FREQ;
}
var ctx = new (window.AudioContext || window.webkitAudioContext)();

var Instrument = function () {
    function Instrument() {
        _classCallCheck(this, Instrument);

        this.oscillator = ctx.createOscillator();
        this.filter = ctx.createBiquadFilter();
        this.envelope = ctx.createGain();
        this.amplifier = ctx.createGain();

        this.oscillator.connect(this.filter);
        this.filter.connect(this.envelope);
        this.envelope.connect(this.amplifier);
        this.amplifier.connect(ctx.destination);
        this.set(_const.SYNTH_DEFAULTS);
        this.envelope.gain.value = 0;
        this.oscillator.start();
    }

    _createClass(Instrument, [{
        key: 'set',
        value: function set(props) {
            if (props.oscillatorType) this.oscillator.type = props.oscillatorType;
            if (props.filterCutoff) this.filter.frequency.value = props.filterCutoff;
            if (props.filterQ) this.filter.Q.value = props.filterQ;
            if (props.ampLevel) this.amplifier.gain.value = props.ampLevel;
            if (props.attackTime) this.attackTime = props.attackTime;
            if (props.decayTime) this.decayTime = props.decayTime;
            if (props.sustainLevel) this.sustainLevel = props.sustainLevel;
            if (props.octave) this.octave = props.octave;
            if (props.releaseTime) this.releaseTime = props.releaseTime;
        }
    }, {
        key: 'attack',
        value: function attack(note) {
            var freq = noteToHz(note, this.octave);
            var t = ctx.currentTime;
            this.oscillator.frequency.cancelScheduledValues(t);
            this.envelope.gain.cancelScheduledValues(t);
            t += 0.01;
            this.oscillator.frequency.linearRampToValueAtTime(freq, t);
            this.envelope.gain.linearRampToValueAtTime(0, t);
            t += this.attackTime;
            this.envelope.gain.linearRampToValueAtTime(1, t);
            t += this.decayTime;
            this.envelope.gain.linearRampToValueAtTime(this.sustainLevel, t);
        }
    }, {
        key: 'release',
        value: function release() {
            var t = ctx.currentTime + 0.01;
            this.envelope.gain.cancelScheduledValues(t);
            t += this.releaseTime;
            this.envelope.gain.linearRampToValueAtTime(0, t);
        }
    }]);

    return Instrument;
}();

exports.default = {
    instruments: {
        'A': new Instrument(),
        'B': new Instrument(),
        'C': new Instrument(),
        'D': new Instrument(),
        'E': new Instrument(),
        'F': new Instrument(),
        'G': new Instrument(),
        'H': new Instrument()
    },
    attack: function attack(i, note) {
        this.instruments[i].attack(note);
    },
    release: function release(i) {
        this.instruments[i].release();
    },
    set: function set(i, props) {
        this.instruments[i].set(props);
    }
};
},{"./const":19}],18:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperapp = require('hyperapp');

var _classcat = require('classcat');

var _classcat2 = _interopRequireDefault(_classcat);

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
    return props.options.map(function (opt) {
        return (0, _hyperapp.h)(
            _button2.default,
            {
                active: opt.value === props.value,
                'do': function _do(ev) {
                    return props.set(opt.value);
                }
            },
            opt.name
        );
    });
};
},{"hyperapp":7,"classcat":23,"./button":22}],21:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      module.exports = {
  "synthPanel": "synth_synthPanel_3QCu4",
  "label": "synth_label_2Iuli",
  "col1": "synth_col1_3AQBe",
  "col2": "synth_col2_15qG3"
};
},{"_css_loader":8}],16:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _hyperapp = require('hyperapp');

var _const = require('./const');

var _voices = require('./voices');

var _voices2 = _interopRequireDefault(_voices);

var _optionButtonSet = require('./option-button-set');

var _optionButtonSet2 = _interopRequireDefault(_optionButtonSet);

var _synth = require('./css/synth.css');

var _synth2 = _interopRequireDefault(_synth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ctx = new (window.AudioContext || window.webkitAudioContext)();

var Control = function Control(props, children) {
    return (0, _hyperapp.h)(
        'p',
        null,
        (0, _hyperapp.h)(
            'span',
            { 'class': _synth2.default.label },
            props.label,
            ':'
        ),
        children
    );
};

var ControlSlider = function ControlSlider(props) {
    return (0, _hyperapp.h)(
        Control,
        { label: props.label },
        (0, _hyperapp.h)('input', {
            type: 'range',
            min: props.min || 0,
            max: props.max,
            step: props.step || 'any',
            value: props.value,
            oninput: function oninput(ev) {
                return props.set(+ev.currentTarget.value);
            }
        })
    );
};

var ControlOptions = function ControlOptions(props) {
    return (0, _hyperapp.h)(
        Control,
        { label: props.label },
        (0, _hyperapp.h)(_optionButtonSet2.default, {
            options: props.options.map(function (o) {
                return { name: o, value: o };
            }),
            value: props.value,
            set: props.set
        })
    );
};

exports.default = function (voice) {
    return {
        state: _extends({}, _const.SYNTH_DEFAULTS, {
            current: null
        }),

        actions: {
            set: function set(x) {
                return function (state) {
                    _voices2.default.set(voice, x);
                    return x;
                };
            },
            play: function play(note) {
                return function (state, actions) {
                    if (state.current === note) return;
                    if (note === null) {
                        _voices2.default.release(voice);
                    } else {
                        _voices2.default.attack(voice, note);
                    }
                    return { current: note };
                };
            }
            // release: _ => state => {
            //     if (state.current === null) return 
            //     voices.release(voice)
            //     return {current: null}
            // },
        },

        view: function view(state, actions, views) {
            var controlProps = function controlProps(name) {
                return {
                    value: state[name],
                    set: function set(x) {
                        return actions.set(_defineProperty({}, name, x));
                    }
                };
            };
            return {
                ControlPanel: function ControlPanel(_) {
                    return (0, _hyperapp.h)(
                        'div',
                        { 'class': _synth2.default.synthPanel },
                        (0, _hyperapp.h)(
                            'div',
                            { 'class': _synth2.default.col1 },
                            (0, _hyperapp.h)(ControlSlider, _extends({ label: 'Octave' }, controlProps('octave'), { min: 1, max: 6, step: 1 })),
                            (0, _hyperapp.h)(ControlOptions, _extends({ label: 'Oscillator' }, controlProps('oscillatorType'), { options: _const.OSCILLATOR_TYPES })),
                            (0, _hyperapp.h)(ControlSlider, _extends({ label: 'Cutoff' }, controlProps('filterCutoff'), { min: 60, max: 7600 })),
                            (0, _hyperapp.h)(ControlSlider, _extends({ label: 'Resonance' }, controlProps('filterQ'), { max: 20 }))
                        ),
                        (0, _hyperapp.h)(
                            'div',
                            { 'class': _synth2.default.col2 },
                            (0, _hyperapp.h)(ControlSlider, _extends({ label: 'Attack time' }, controlProps('attackTime'), { max: 0.2 })),
                            (0, _hyperapp.h)(ControlSlider, _extends({ label: 'Decay time' }, controlProps('decayTime'), { max: 0.2 })),
                            (0, _hyperapp.h)(ControlSlider, _extends({ label: 'Sustain level' }, controlProps('sustainLevel'), { max: 1.0 })),
                            (0, _hyperapp.h)(ControlSlider, _extends({ label: 'Release time' }, controlProps('releaseTime'), { max: 1.0 })),
                            (0, _hyperapp.h)(ControlSlider, _extends({ label: 'Gain' }, controlProps('ampLevel'), { max: 1.0 }))
                        )
                    );
                }
            };
        }
    };
};
},{"hyperapp":7,"./const":19,"./voices":20,"./option-button-set":18,"./css/synth.css":21}],17:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      module.exports = {
  "voiceSelector": "soundbank_voiceSelector_1bdue"
};
},{"_css_loader":8}],13:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperapp = require('hyperapp');

var _synth = require('./synth');

var _synth2 = _interopRequireDefault(_synth);

var _optionButtonSet = require('./option-button-set');

var _optionButtonSet2 = _interopRequireDefault(_optionButtonSet);

var _soundbank = require('./css/soundbank.css');

var _soundbank2 = _interopRequireDefault(_soundbank);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    modules: {
        A: (0, _synth2.default)('A'),
        B: (0, _synth2.default)('B'),
        C: (0, _synth2.default)('C'),
        D: (0, _synth2.default)('D'),
        E: (0, _synth2.default)('E'),
        F: (0, _synth2.default)('F'),
        G: (0, _synth2.default)('G'),
        H: (0, _synth2.default)('H')
    },
    state: { selected: 'A' },
    actions: {
        init: function init(_ref) {
            var onselect = _ref.onselect;
            return { onselect: onselect };
        },
        select: function select(x) {
            return { selected: x };
        },
        play: function play(_ref2) {
            var voice = _ref2.voice,
                note = _ref2.note;
            return function (_, actions) {
                actions[voice].play(note);
            };
        },
        stopAll: function stopAll(_) {
            return function (_, actions) {
                return 'ABCDEFGH'.split('').forEach(function (v) {
                    return actions[v].play(null);
                });
            };
        }
    },
    view: function view(state, actions, views) {
        return {
            ControlPanel: views[state.selected].ControlPanel,
            Selector: function Selector(_) {
                return (0, _hyperapp.h)(
                    'div',
                    { 'class': _soundbank2.default.voiceSelector },
                    (0, _hyperapp.h)(_optionButtonSet2.default, {
                        options: 'ABCDEFGH'.split('').map(function (n) {
                            return { name: 'Voice ' + n, value: n };
                        }),
                        set: function set(x) {
                            actions.select(x);
                            state.onselect(x);
                        },
                        value: state.selected
                    })
                );
            }
        };
    }
};
},{"hyperapp":7,"./synth":16,"./option-button-set":18,"./css/soundbank.css":17}],4:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperapp = require('hyperapp');

var _main = require('./css/main.css');

var _main2 = _interopRequireDefault(_main);

var _keyboard = require('./keyboard');

var _keyboard2 = _interopRequireDefault(_keyboard);

var _sequencer = require('./sequencer');

var _sequencer2 = _interopRequireDefault(_sequencer);

var _soundbank = require('./soundbank');

var _soundbank2 = _interopRequireDefault(_soundbank);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    modules: {
        sequencer: _sequencer2.default,
        keyboard: _keyboard2.default,
        soundbank: _soundbank2.default
    },

    actions: {
        init: function init(_) {
            return function (_, actions) {
                actions.keyboard.init({ onpress: actions.keyPress });
                actions.sequencer.init({
                    onselectvoice: actions.soundbank.select,
                    onplay: actions.sequencerPlay,
                    onstop: actions.soundbank.stopAll
                });
                actions.soundbank.init({
                    onselect: actions.sequencer.selection.reset
                });
            };
        },

        sequencerPlay: function sequencerPlay(_ref) {
            var note = _ref.note,
                voice = _ref.voice;
            return function (state, actions) {
                if (state.keyboard.pressed && voice === state.soundbank.selected) return;
                actions.soundbank.play({ note: note, voice: voice });
            };
        },

        keyPress: function keyPress(note) {
            return function (state, actions) {
                var voice = state.soundbank.selected;
                actions.soundbank.play({ note: note, voice: voice });
                actions.sequencer.attack({ note: note, voice: voice });
            };
        }
    },

    view: function view(state, actions, views) {
        return (0, _hyperapp.h)(
            'div',
            { 'class': _main2.default.container },
            (0, _hyperapp.h)(
                'div',
                { 'class': _main2.default.left },
                (0, _hyperapp.h)(
                    'div',
                    { 'class': _main2.default.mainPanel },
                    (0, _hyperapp.h)(views.sequencer.Controls, null),
                    (0, _hyperapp.h)(views.soundbank.Selector, null),
                    (0, _hyperapp.h)(views.soundbank.ControlPanel, null)
                ),
                (0, _hyperapp.h)(views.keyboard.Keyboard, null)
            ),
            (0, _hyperapp.h)(
                'div',
                { 'class': 'app-layout-right' },
                (0, _hyperapp.h)(views.sequencer.Sequencer, null)
            )
        );
    }
};
},{"hyperapp":7,"./css/main.css":10,"./keyboard":11,"./sequencer":12,"./soundbank":13}],2:[function(require,module,exports) {
'use strict';

require('./css/base.css');

var _hyperapp = require('hyperapp');

var _combineModules2 = require('./lib/combine-modules');

var _combineModules3 = _interopRequireDefault(_combineModules2);

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _combineModules = (0, _combineModules3.default)(_main2.default),
    state = _combineModules.state,
    actions = _combineModules.actions,
    view = _combineModules.view;

var _app = (0, _hyperapp.app)(state, actions, view, document.body),
    init = _app.init;

init();
},{"./css/base.css":3,"hyperapp":7,"./lib/combine-modules":5,"./main":4}],30:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '55976' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
      // Clear the console after HMR
      console.clear();
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[30,2], null)
//# sourceMappingURL=/src.7deb02e7.map