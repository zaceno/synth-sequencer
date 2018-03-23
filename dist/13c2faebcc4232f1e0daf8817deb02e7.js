// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
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

  // Override the current require with this new one
  return newRequire;
})({17:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;
exports.app = app;
function h(name, attributes /*, ...rest*/) {
  var node;
  var rest = [];
  var children = [];
  var length = arguments.length;

  while (length-- > 2) rest.push(arguments[length]);

  while (rest.length) {
    if ((node = rest.pop()) && node.pop /* Array? */) {
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
  var renderLock;
  var invokeLaterStack = [];
  var rootElement = container && container.children[0] || null;
  var oldNode = rootElement && toVNode(rootElement, [].map);
  var globalState = clone(state);
  var wiredActions = clone(actions);

  scheduleRender(wireStateToActions([], globalState, wiredActions));

  return wiredActions;

  function toVNode(element, map) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function (element) {
        return element.nodeType === 3 // Node.TEXT_NODE
        ? element.nodeValue : toVNode(element, map);
      })
    };
  }

  function render() {
    renderLock = !renderLock;

    var next = view(globalState, wiredActions);
    if (container && !renderLock) {
      rootElement = patch(container, rootElement, oldNode, oldNode = next);
    }

    while (next = invokeLaterStack.pop()) next();
  }

  function scheduleRender() {
    if (!renderLock) {
      renderLock = !renderLock;
      setTimeout(render);
    }
  }

  function clone(target, source) {
    var obj = {};

    for (var i in target) obj[i] = target[i];
    for (var i in source) obj[i] = source[i];

    return obj;
  }

  function set(path, value, source) {
    var target = {};
    if (path.length) {
      target[path[0]] = path.length > 1 ? set(path.slice(1), value, source[path[0]]) : value;
      return clone(source, target);
    }
    return value;
  }

  function get(path, source) {
    for (var i = 0; i < path.length; i++) {
      source = source[path[i]];
    }
    return source;
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function" ? function (key, action) {
        actions[key] = function (data) {
          if (typeof (data = action(data)) === "function") {
            data = data(get(path, globalState), actions);
          }

          if (data && data !== (state = get(path, globalState)) && !data.then // Promise
          ) {
              scheduleRender(globalState = set(path, clone(state, data), globalState));
            }

          return data;
        };
      }(key, actions[key]) : wireStateToActions(path.concat(key), state[key] = state[key] || {}, actions[key] = clone(actions[key]));
    }
  }

  function getKey(node) {
    return node ? node.key : null;
  }

  function setElementProp(element, name, value, isSVG, oldValue) {
    if (name === "key") {} else if (name === "style") {
      for (var i in clone(oldValue, value)) {
        element[name][i] = value == null || value[i] == null ? "" : value[i];
      }
    } else {
      if (typeof value === "function" || name in element && !isSVG) {
        element[name] = value == null ? "" : value;
      } else if (value != null && value !== false) {
        element.setAttribute(name, value);
      }

      if (value == null || value === false) {
        element.removeAttribute(name);
      }
    }
  }

  function createElement(node, isSVG) {
    var element = typeof node === "string" || typeof node === "number" ? document.createTextNode(node) : (isSVG = isSVG || node.nodeName === "svg") ? document.createElementNS("http://www.w3.org/2000/svg", node.nodeName) : document.createElement(node.nodeName);

    if (node.attributes) {
      if (node.attributes.oncreate) {
        invokeLaterStack.push(function () {
          node.attributes.oncreate(element);
        });
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i], isSVG));
      }

      for (var name in node.attributes) {
        setElementProp(element, name, node.attributes[name], isSVG);
      }
    }

    return element;
  }

  function updateElement(element, oldProps, attributes, isSVG) {
    for (var name in clone(oldProps, attributes)) {
      if (attributes[name] !== (name === "value" || name === "checked" ? element[name] : oldProps[name])) {
        setElementProp(element, name, attributes[name], isSVG, oldProps[name]);
      }
    }

    if (attributes.onupdate) {
      invokeLaterStack.push(function () {
        attributes.onupdate(element, oldProps);
      });
    }
  }

  function removeChildren(element, node, attributes) {
    if (attributes = node.attributes) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i]);
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element);
      }
    }
    return element;
  }

  function removeElement(parent, element, node, cb) {
    function done() {
      parent.removeChild(removeChildren(element, node));
    }

    if (node.attributes && (cb = node.attributes.onremove)) {
      cb(element, done);
    } else {
      done();
    }
  }

  function patch(parent, element, oldNode, node, isSVG, nextSibling) {
    if (node === oldNode) {} else if (oldNode == null) {
      element = parent.insertBefore(createElement(node, isSVG), element);
    } else if (node.nodeName && node.nodeName === oldNode.nodeName) {
      updateElement(element, oldNode.attributes, node.attributes, isSVG = isSVG || node.nodeName === "svg");

      var oldElements = [];
      var oldKeyed = {};
      var newKeyed = {};

      for (var i = 0; i < oldNode.children.length; i++) {
        oldElements[i] = element.childNodes[i];

        var oldChild = oldNode.children[i];
        var oldKey = getKey(oldChild);

        if (null != oldKey) {
          oldKeyed[oldKey] = [oldElements[i], oldChild];
        }
      }

      var i = 0;
      var j = 0;

      while (j < node.children.length) {
        var oldChild = oldNode.children[i];
        var newChild = node.children[j];

        var oldKey = getKey(oldChild);
        var newKey = getKey(newChild);

        if (newKeyed[oldKey]) {
          i++;
          continue;
        }

        if (newKey == null) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChild, newChild, isSVG);
            j++;
          }
          i++;
        } else {
          var recyledNode = oldKeyed[newKey] || [];

          if (oldKey === newKey) {
            patch(element, recyledNode[0], recyledNode[1], newChild, isSVG);
            i++;
          } else if (recyledNode[0]) {
            patch(element, element.insertBefore(recyledNode[0], oldElements[i]), recyledNode[1], newChild, isSVG);
          } else {
            patch(element, oldElements[i], null, newChild, isSVG);
          }

          j++;
          newKeyed[newKey] = newChild;
        }
      }

      while (i < oldNode.children.length) {
        var oldChild = oldNode.children[i];
        if (getKey(oldChild) == null) {
          removeElement(element, oldElements[i], oldChild);
        }
        i++;
      }

      for (var i in oldKeyed) {
        if (!newKeyed[oldKeyed[i][1].key]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
        }
      }
    } else if (node.nodeName === oldNode.nodeName) {
      element.nodeValue = node;
    } else {
      element = parent.insertBefore(createElement(node, isSVG), nextSibling = element);
      removeElement(parent, nextSibling, oldNode);
    }
    return element;
  }
}
},{}],7:[function(require,module,exports) {
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
},{}],14:[function(require,module,exports) {
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
},{"./bundle-url":14}],3:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":8}],18:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cat;
function cat(classes, prefix) {
  var value;
  var className = "";
  var type = typeof classes;

  if (classes && type === "string" || type === "number") {
    return classes;
  }

  prefix = prefix || " ";

  if (Array.isArray(classes) && classes.length) {
    for (var i = 0, len = classes.length; i < len; i++) {
      if (value = cat(classes[i], prefix)) {
        className += (className && prefix) + value;
      }
    }
  } else {
    for (var i in classes) {
      if (classes.hasOwnProperty(i) && (value = classes[i])) {
        className += (className && prefix) + i + (typeof value === "object" ? cat(value, prefix + i) : "");
      }
    }
  }

  return className;
}
},{}],9:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var SEQUENCER_LENGTH = exports.SEQUENCER_LENGTH = 32;
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
},{}],4:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperapp = require('hyperapp');

var _classcat = require('classcat');

var _classcat2 = _interopRequireDefault(_classcat);

var _const = require('./const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isBlack = function isBlack(char) {
    return _const.KEYBOARD_BLACK_KEYS.indexOf(char) > -1;
};

var noteForChar = function noteForChar(char) {
    var n = _const.KEYBOARD_KEYS.indexOf(char);
    return n > -1 ? n : null;
};

var _Keyboard = function _Keyboard(_ref) {
    var pressed = _ref.pressed,
        attack = _ref.attack,
        release = _ref.release;
    return (0, _hyperapp.h)(
        'div',
        { 'class': 'keyboard', key: 'keyboard' },
        _const.KEYBOARD_KEYS.map(function (char) {
            return (0, _hyperapp.h)(
                'div',
                {
                    'class': (0, _classcat2.default)(['clav', {
                        white: !isBlack(char),
                        black: isBlack(char),
                        pressed: char === pressed
                    }]),
                    onmousedown: function onmousedown(ev) {
                        return attack(char);
                    },
                    onmouseup: function onmouseup(ev) {
                        return release(char);
                    }
                },
                (0, _hyperapp.h)(
                    'span',
                    { 'class': 'char' },
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

        init: function init(_ref2) {
            var onattack = _ref2.onattack,
                onrelease = _ref2.onrelease;
            return function (state, actions) {
                addEventListener('keydown', function (ev) {
                    return actions.attack(ev.key) && ev.preventDefault(true);
                });
                addEventListener('keyup', function (ev) {
                    return actions.release(ev.key) && ev.preventDefault(true);
                });
                return {
                    onattack: onattack || function (_) {},
                    onrelease: onrelease || function (_) {}
                };
            };
        },

        attack: function attack(char) {
            return function (state) {
                var note = _const.KEYBOARD_KEYS.indexOf(char);
                if (note === -1) return;
                if (char === state.pressed) return;
                if (char !== state.pressed) state.onattack(note);
                return { pressed: char };
            };
        },

        release: function release(char) {
            return function (state) {
                var note = _const.KEYBOARD_KEYS.indexOf(char);
                if (note === -1) return;
                if (char !== state.pressed) return;
                if (char === state.pressed) state.onrelease(note);
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
},{"hyperapp":17,"classcat":18,"./const":9}],16:[function(require,module,exports) {
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
},{}],10:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.module = exports.applySelection = undefined;

var _decorator = require('./lib/decorator');

var _decorator2 = _interopRequireDefault(_decorator);

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
            end: null
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
                return { anchor: null };
            },
            reset: function reset(_) {
                return {
                    anchor: null,
                    column: null,
                    start: null,
                    end: null
                };
            }
        },

        view: function view(state, actions) {
            return {
                Decorator: (0, _decorator2.default)(function (_ref5) {
                    var row = _ref5.row,
                        col = _ref5.col;
                    return {
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
                        class: isSelected(state, row, col) ? 'selected' : ''
                    };
                })
            };
        }
    };
};
exports.module = _module;
},{"./lib/decorator":16}],11:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperapp = require('hyperapp');

var _const = require('./const');

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
                    onstop = _ref.onstop;
                return { onplayrow: onplayrow, onstop: onstop };
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
                        'button',
                        {
                            onclick: actions.play,
                            'class': state.interval && 'active'
                        },
                        'Play'
                    );
                },
                StopButton: function StopButton(_) {
                    return (0, _hyperapp.h)(
                        'button',
                        {
                            onclick: actions.stop,
                            onmousedown: function onmousedown(ev) {
                                return ev.currentTarget.classList.add('active');
                            },
                            onmouseup: function onmouseup(ev) {
                                return ev.currentTarget.classList.remove('active');
                            }
                        },
                        'Stop'
                    );
                }
            };
        }
    };
};
},{"hyperapp":17,"./const":9}],5:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperapp = require('hyperapp');

var _const = require('./const');

var _selection = require('./selection');

var _playback = require('./playback');

var _playback2 = _interopRequireDefault(_playback);

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
                onattackvoice = _ref.onattackvoice,
                onstop = _ref.onstop;
            return function (state, actions) {

                window.addEventListener('keydown', function (ev) {
                    if (ev.key !== ' ') return;
                    actions.setNote(null);
                });

                actions.selection.init({
                    onselectcolumn: function onselectcolumn(col) {
                        return onselectvoice('ABCDEFGH'[col]);
                    }
                });

                actions.playback.init({
                    onplayrow: actions.playRow,
                    onstop: onstop
                });
                return { onattackvoice: onattackvoice };
            };
        },

        setNote: function setNote(note) {
            return function (state, actions) {
                actions.selection.reset();
                return { notes: (0, _selection.applySelection)(state.selection, state.notes, note) };
            };
        },

        playRow: function playRow(row) {
            return function (state, actions) {
                state.notes[row].forEach(function (note, col) {
                    return state.onattackvoice('ABCDEFGH'[col], note);
                });
            };
        }
    },

    view: function view(state, actions, views) {
        return {
            Controls: function Controls(_) {
                return (0, _hyperapp.h)(
                    'span',
                    null,
                    (0, _hyperapp.h)(views.playback.PlayButton, null),
                    (0, _hyperapp.h)(views.playback.StopButton, null),
                    (0, _hyperapp.h)(
                        'button',
                        { onclick: function onclick(_) {
                                return actions.setNote(null);
                            } },
                        'X'
                    )
                );
            },
            Sequencer: function Sequencer(_) {
                return (0, _hyperapp.h)(
                    'table',
                    { 'class': 'sequencer' },
                    state.notes.map(function (vals, row) {
                        return (0, _hyperapp.h)(
                            'tr',
                            null,
                            (0, _hyperapp.h)(
                                'td',
                                { onclick: function onclick(_) {
                                        return actions.playback.setRow(row);
                                    }, 'class': "time" + (state.playback.row === row ? 'playing' : '') },
                                row
                            ),
                            vals.map(function (note, col) {
                                return (0, _hyperapp.h)(
                                    views.selection.Decorator,
                                    { row: row, col: col },
                                    (0, _hyperapp.h)(
                                        'td',
                                        { 'class': state.playback.row === row ? 'playing' : false },
                                        noteName(note)
                                    )
                                );
                            })
                        );
                    })
                );
            }
        };
    }
};
},{"hyperapp":17,"./const":9,"./selection":10,"./playback":11}],15:[function(require,module,exports) {
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
},{"./const":9}],13:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperapp = require('hyperapp');

var _classcat = require('classcat');

var _classcat2 = _interopRequireDefault(_classcat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
    return props.options.map(function (opt) {
        return (0, _hyperapp.h)(
            'button',
            {
                'class': (0, _classcat2.default)({ active: opt.value === props.value }),
                onclick: function onclick(ev) {
                    return props.set(opt.value);
                }
            },
            opt.name
        );
    });
};
},{"hyperapp":17,"classcat":18}],12:[function(require,module,exports) {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ctx = new (window.AudioContext || window.webkitAudioContext)();

var Control = function Control(props, children) {
    return (0, _hyperapp.h)(
        'p',
        null,
        (0, _hyperapp.h)(
            'span',
            { 'class': 'label' },
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
            attack: function attack(note) {
                return function (state, actions) {
                    if (state.current === note) return;
                    if (note === null) {
                        actions.release();
                        return;
                    }
                    _voices2.default.attack(voice, note);
                    return { current: note };
                };
            },
            release: function release(_) {
                return function (state) {
                    if (state.current === null) return;
                    _voices2.default.release(voice);
                    return { current: null };
                };
            }
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
                        { 'class': 'synth-panel' },
                        (0, _hyperapp.h)(
                            'div',
                            { 'class': 'col-1' },
                            (0, _hyperapp.h)(ControlSlider, _extends({ label: 'Octave' }, controlProps('octave'), { min: 1, max: 6, step: 1 })),
                            (0, _hyperapp.h)(ControlOptions, _extends({ label: 'Oscillator' }, controlProps('oscillatorType'), { options: _const.OSCILLATOR_TYPES })),
                            (0, _hyperapp.h)(ControlSlider, _extends({ label: 'Cutoff' }, controlProps('filterCutoff'), { min: 60, max: 7600 })),
                            (0, _hyperapp.h)(ControlSlider, _extends({ label: 'Resonance' }, controlProps('filterQ'), { max: 20 }))
                        ),
                        (0, _hyperapp.h)(
                            'div',
                            { 'class': 'col-2' },
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
},{"hyperapp":17,"./const":9,"./voices":15,"./option-button-set":13}],6:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperapp = require('hyperapp');

var _synth = require('./synth');

var _synth2 = _interopRequireDefault(_synth);

var _optionButtonSet = require('./option-button-set');

var _optionButtonSet2 = _interopRequireDefault(_optionButtonSet);

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
        attack: function attack(_ref2) {
            var voice = _ref2.voice,
                note = _ref2.note;
            return function (_, actions) {
                return actions[voice].attack(note);
            };
        },
        attackCurrent: function attackCurrent(note) {
            return function (state, actions) {
                return actions[state.selected].attack(note);
            };
        },
        releaseCurrent: function releaseCurrent(note) {
            return function (state, actions) {
                return actions[state.selected].release();
            };
        },
        stopAll: function stopAll(_) {
            return function (_, actions) {
                'ABCDEFGH'.split('').forEach(function (v) {
                    return actions[v].release();
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
                    { 'class': 'voice-selector' },
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
},{"hyperapp":17,"./synth":12,"./option-button-set":13}],22:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hyperapp = require('hyperapp');

require('./style.less');

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
        r: function r(f) {
            return function (s) {
                return f(s);
            };
        },
        init: function init(_) {
            return function (_, actions) {
                actions.keyboard.init({
                    onattack: function onattack(note) {
                        return actions.r(function (state) {
                            actions.soundbank.attackCurrent(note);
                            actions.sequencer.setNote(note);
                        });
                    },
                    onrelease: function onrelease(note) {
                        return actions.r(function (state) {
                            actions.soundbank.releaseCurrent();
                            actions.sequencer.setNote(null);
                        });
                    }
                });

                actions.sequencer.init({
                    onselectvoice: actions.soundbank.select,
                    onattackvoice: function onattackvoice(voice, note) {
                        return actions.r(function (state) {
                            //let keyboard override what the sequencer plays:
                            if (voice === state.soundbank.selected && state.keyboard.pressed) return;
                            actions.soundbank.attack({ voice: voice, note: note });
                        });
                    },
                    onstop: actions.soundbank.stopAll
                });

                actions.soundbank.init({
                    onselect: actions.sequencer.selection.reset
                });
            };
        }
    },

    view: function view(state, actions, views) {
        return (0, _hyperapp.h)(
            'div',
            { 'class': 'app-layout' },
            (0, _hyperapp.h)(
                'div',
                { 'class': 'app-layout-left' },
                (0, _hyperapp.h)(
                    'div',
                    { 'class': 'main-panel' },
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
},{"hyperapp":17,"./style.less":3,"./keyboard":4,"./sequencer":5,"./soundbank":6}],2:[function(require,module,exports) {
'use strict';

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
},{"hyperapp":17,"./lib/combine-modules":7,"./main":22}],19:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '55986' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
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
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[19,2])
//# sourceMappingURL=/dist/13c2faebcc4232f1e0daf8817deb02e7.map