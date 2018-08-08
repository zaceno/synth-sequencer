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
})({3:[function(require,module,exports) {

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
TODO refactor tests to be more descriptive of the api and less "incrementally built up"

TODO: Optimize: textnodes are always inserted, then the old ones removed. If they're the same string we could leave them alone
TODO: Optimize: If keyed nodes move down, we will instead move *up* every subsequent nodes one step. COuld be optimized
by just building a list of moves, and notice that a series of up-moves of one, could be replaced by a single
down move (maybe?)
*/

function h(type, attributes, ...children) {
    attributes = attributes || {};
    children = [].concat(...[].concat(...children)).filter(c => c !== false && c != null);
    return typeof type === 'function' ? type(attributes, children) : { type, attributes, children };
}

function mount(vnode, container) {
    const el = make(vnode);
    container.innerHTML = '';
    container.appendChild(el);
    return el;
}

function define(func, data) {
    return { func, data };
}

function update(view, data) {
    view.data = data;
    view.instances = view.instances || []; //common pattern with makeInstance --> factor out
    view.instances.forEach(inst => patchInstance(inst.el, view, inst.attributes, inst.children));
}

//-------------

function make(vnode, svg) {
    if (vnode.func) return make(h(vnode));
    if (!vnode.type) return document.createTextNode(vnode);
    return (vnode.type.func ? makeInstance : makeElement)(vnode, svg);
}

function patch(el, oldnode, newnode) {
    if (oldnode.type && oldnode.type === newnode.type) {
        if (oldnode.type.func) {
            el = patchInstance(el, newnode.type, newnode.attributes, newnode.children);
        } else {
            el = patchElement(el, oldnode.attributes, oldnode.children, newnode.attributes, newnode.children);
        }
    } else {
        el = replace(el, oldnode, newnode);
    }
    return el;
}

function remove(el, oldvnode) {
    willRemove(el, oldvnode);
    el.parentNode && el.parentNode.removeChild(el);
    return true;
}

function replace(el, oldvnode, newvnode) {
    const newel = make(newvnode);
    willRemove(el, oldvnode);
    el.parentNode && el.parentNode.replaceChild(newel, el);
    return newel;
}

function willRemove(el, oldvnode) {
    if (!oldvnode.type) return false;
    if (oldvnode.type.func) return willRemoveInstance(el, oldvnode);
    return willRemoveElement(el, oldvnode);
}

//-------------

function makeInstance({ type, attributes, children }) {
    const vnode = vnodeForView(type, attributes, children);
    const el = make(vnode);
    type.instances = type.instances || [];
    type.instances.push({ el, vnode, attributes, children });
    return el;
}

function patchInstance(oldel, view, attributes, children) {
    function getKey(node) {
        const attr = node.attributes;
        return attr && attr.key ? attr.key : null;
    }
    const vnode = vnodeForView(view, attributes, children);
    const inst = getInstanceIndex(view, oldel);
    const oldvnode = view.instances[inst].vnode;
    const el = (getKey(oldvnode) === getKey(vnode) ? patch : replace)(oldel, oldvnode, vnode);
    view.instances.splice(inst, 1, { el, vnode, attributes, children });
    return el;
}

function willRemoveInstance(el, { type }) {
    const index = getInstanceIndex(type, el);
    const instance = type.instances[index];
    type.instances.splice(index, 1);
    return willRemove(el, instance.vnode);
}

function getInstanceIndex(type, el) {
    return seekIndex(type.instances, inst => inst.el === el);
}

function vnodeForView(type, attributes, children) {
    return type.func(Object.assign({}, attributes, type.data), children);
}

//-------------

function makeElement({ type, attributes, children }, svg = false) {
    svg = svg || type === 'svg';
    const el = svg ? document.createElementNS('http://www.w3.org/2000/svg', type) : document.createElement(type);
    updateAttributes(el, {}, attributes);
    children.forEach(chnode => el.appendChild(make(chnode, svg)));
    attributes.oncreate && attributes.oncreate(el);
    return el;
}

function patchElement(el, oldattr, oldch, newattr, newch) {
    updateAttributes(el, oldattr, newattr);
    patchChildren(el, oldch, newch);
    newattr.onupdate && newattr.onupdate(el);
    return el;
}

function willRemoveElement(el, { attributes, children }) {
    children.forEach((c, i) => willRemove(el.childNodes[i], c));
    return attributes.onremove && attributes.onremove(el, el.parentNode);
}

//-----------------

function patchChildren(parent, oldch, newch) {
    oldch = oldch.slice(); //copy, since we'll be mutating it further down.
    let n = 0;
    while (n < oldch.length && n < newch.length) {
        let o = seekNode(oldch, newch[n], n);
        if (o < 0) {
            parent.insertBefore(make(newch[n]), parent.childNodes[n]);
            oldch.splice(n, 0, '');
        } else {
            if (o != n) {
                parent.insertBefore(parent.childNodes[o], parent.childNodes[n]);
                oldch.splice(n, 0, oldch.splice(o, 1)[0]);
            }
            patch(parent.childNodes[n], oldch[n], newch[n]);
        }
        n++;
    }
    while (n < oldch.length) {
        const didRemove = remove(parent.childNodes[n], oldch[n]);
        if (!didRemove) n++;else oldch.splice(n, 1);
    }
    while (n < newch.length) parent.appendChild(make(newch[n++]));
}

function seekNode(list, node, start) {
    const sought = seekId(node);
    return seekIndex(list, item => seekId(item) === sought, start);
}

function seekId(node) {
    return node.type ? node.attributes.key || node.type : node;
}

function updateAttributes(el, oldattr, newattr) {
    Object.keys(oldattr).forEach(name => {
        if (newattr[name] == null) setAttribute(el, name);
    });
    Object.keys(newattr).forEach(name => {
        setAttribute(el, name, oldattr[name], newattr[name]);
    });
}

function setAttribute(el, name, oldval, val) {
    if (name === 'key' || name === 'value' || name === 'checked' || name.substr(0, 2) === 'on') {
        el[name] = val;
    } else if (val == null || val === false) {
        el.removeAttribute(name);
    } else if (oldval !== val) {
        el.setAttribute(name, val);
    }
}

//----------------

function seekIndex(list, fn, start = 0) {
    return list.reduce((found, item, index) => index < start || found > -1 || !fn(item) ? found : index, -1);
}

//----------------

exports.h = h;
exports.patch = patch;
exports.make = make;
exports.mount = mount;
exports.define = define;
exports.update = update;
},{}],12:[function(require,module,exports) {
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
},{}],11:[function(require,module,exports) {
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
},{"./bundle-url":12}],20:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      module.exports = {
  "appLayout": "style_appLayout_bpXxk",
  "appLayoutLeft": "style_appLayoutLeft_3xXzg",
  "appLayoutRight ": "style_appLayoutRight _3-0bH",
  "mainPanel": "style_mainPanel_3xjJH"
};
},{"_css_loader":11}],10:[function(require,module,exports) {
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
},{}],6:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      module.exports = {
  "keyboard": "style_keyboard_23elZ",
  "clav": "style_clav_3XbDW",
  "black": "style_black_DHM8A",
  "pressed": "style_pressed_2eMxS",
  "char": "style_char_GRgGj"
};
},{"_css_loader":11}],7:[function(require,module,exports) {
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

exports.default = function (_ref) {
    var onattack = _ref.onattack,
        onrelease = _ref.onrelease;


    var pressed = null;

    var attack = function attack(char) {
        var note = _const.KEYBOARD_KEYS.indexOf(char);
        if (note === -1) return;
        if (char === pressed) return;
        pressed = char;
        (0, _zxdom.update)(view);
        onattack(note);
    };

    var release = function release(char) {
        var note = _const.KEYBOARD_KEYS.indexOf(char);
        if (note === -1) return;
        if (char !== pressed) return;
        pressed = null;
        (0, _zxdom.update)(view);
        onrelease(note);
    };

    var view = (0, _zxdom.define)(function (_) {
        return (0, _zxdom.h)(
            'div',
            { oncreate: function oncreate(el) {
                    addEventListener('keydown', function (ev) {
                        return attack(ev.key) && ev.preventDefault(true);
                    });
                    addEventListener('keyup', function (ev) {
                        return release(ev.key) && ev.preventDefault(true);
                    });
                }, 'class': _style2.default.keyboard, key: 'keyboard' },
            _const.KEYBOARD_KEYS.map(function (char) {
                var _cc;

                return (0, _zxdom.h)(
                    'div',
                    {
                        'class': (0, _classcat2.default)((_cc = {}, _defineProperty(_cc, _style2.default.clav, true), _defineProperty(_cc, _style2.default.black, _const.KEYBOARD_BLACK_KEYS.indexOf(char) >= 0), _defineProperty(_cc, _style2.default.pressed, char === pressed), _cc)),
                        onmousedown: function onmousedown(_) {
                            return attack(char);
                        },
                        onmouseup: function onmouseup(_) {
                            return release(char);
                        }
                    },
                    (0, _zxdom.h)(
                        'span',
                        { 'class': _style2.default.char },
                        char.toUpperCase()
                    )
                );
            })
        );
    });

    return { Keyboard: view };
};

var _zxdom = require('zxdom');

var _classcat = require('classcat');

var _classcat2 = _interopRequireDefault(_classcat);

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

var _const = require('../const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
},{"zxdom":3,"classcat":10,"./style.css":6,"../const":7}],9:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = require('../const');

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

exports.default = Instrument;
},{"../const":7}],8:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      module.exports = {
  "synthPanel": "style_synthPanel_11Yt_",
  "label": "style_label_9desT",
  "col1": "style_col1_2uvLn",
  "col2": "style_col2_1wKtu"
};
},{"_css_loader":11}],17:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _zxdom = require('zxdom');

var _classcat = require('classcat');

var _classcat2 = _interopRequireDefault(_classcat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
    return props.options.map(function (opt) {
        return (0, _zxdom.h)(
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
},{"zxdom":3,"classcat":10}],16:[function(require,module,exports) {

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _instrument = require('./instrument');

var _instrument2 = _interopRequireDefault(_instrument);

var _zxdom = require('zxdom');

var _classcat = require('classcat');

var _classcat2 = _interopRequireDefault(_classcat);

var _const = require('../const');

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

var _optionButtons = require('../option-buttons');

var _optionButtons2 = _interopRequireDefault(_optionButtons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Control = function Control(props, children) {
    return (0, _zxdom.h)(
        'p',
        null,
        (0, _zxdom.h)(
            'span',
            { 'class': _style2.default.label },
            props.label,
            ':'
        ),
        children
    );
};

var ControlSlider = function ControlSlider(props) {
    return (0, _zxdom.h)(
        Control,
        { label: props.label },
        (0, _zxdom.h)('input', {
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
    return (0, _zxdom.h)(
        Control,
        { label: props.label },
        (0, _zxdom.h)(_optionButtons2.default, {
            options: props.options.map(function (o) {
                return { name: o, value: o };
            }),
            value: props.value,
            set: props.set
        })
    );
};

var ControlPanel = function ControlPanel(_ref) {
    var settings = _ref.settings,
        _set = _ref.set;

    var controlProps = function controlProps(name) {
        return {
            value: settings[name],
            set: function set(x) {
                return _set(_defineProperty({}, name, x));
            }
        };
    };

    return (0, _zxdom.h)(
        'div',
        { 'class': _style2.default.synthPanel },
        (0, _zxdom.h)(
            'div',
            { 'class': _style2.default.col1 },
            (0, _zxdom.h)(ControlSlider, _extends({ label: 'Octave' }, controlProps('octave'), { min: 1, max: 6, step: 1 })),
            (0, _zxdom.h)(ControlOptions, _extends({ label: 'Oscillator' }, controlProps('oscillatorType'), { options: _const.OSCILLATOR_TYPES })),
            (0, _zxdom.h)(ControlSlider, _extends({ label: 'Cutoff' }, controlProps('filterCutoff'), { min: 60, max: 7600 })),
            (0, _zxdom.h)(ControlSlider, _extends({ label: 'Resonance' }, controlProps('filterQ'), { max: 20 }))
        ),
        (0, _zxdom.h)(
            'div',
            { 'class': _style2.default.col2 },
            (0, _zxdom.h)(ControlSlider, _extends({ label: 'Attack time' }, controlProps('attackTime'), { max: 0.2 })),
            (0, _zxdom.h)(ControlSlider, _extends({ label: 'Decay time' }, controlProps('decayTime'), { max: 0.2 })),
            (0, _zxdom.h)(ControlSlider, _extends({ label: 'Sustain level' }, controlProps('sustainLevel'), { max: 1.0 })),
            (0, _zxdom.h)(ControlSlider, _extends({ label: 'Release time' }, controlProps('releaseTime'), { max: 1.0 })),
            (0, _zxdom.h)(ControlSlider, _extends({ label: 'Gain' }, controlProps('ampLevel'), { max: 1.0 }))
        )
    );
};

var Synth = function () {
    function Synth() {
        var _this = this;

        _classCallCheck(this, Synth);

        this.instrument = new _instrument2.default();
        this.settings = Object.assign({}, _const.SYNTH_DEFAULTS);
        this.view = (0, _zxdom.define)(function (_) {
            return ControlPanel({
                settings: _this.settings,
                set: function set(x) {
                    return _this.set(x);
                }
            });
        });
    }

    _createClass(Synth, [{
        key: 'set',
        value: function set(props) {
            this.instrument.set(props);
            Object.assign(this.settings, props);
            (0, _zxdom.update)(this.view);
        }
    }, {
        key: 'attack',
        value: function attack(note) {
            this.instrument.attack(note);
        }
    }, {
        key: 'release',
        value: function release(note) {
            this.instrument.release(note);
        }
    }, {
        key: 'ControlPanel',
        get: function get() {
            return this.view;
        }
    }]);

    return Synth;
}();

exports.default = Synth;
},{"./instrument":9,"zxdom":3,"classcat":10,"../const":7,"./style.css":8,"../option-buttons":17}],5:[function(require,module,exports) {

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (onselect) {

    var bank = {
        A: new _synth2.default(),
        B: new _synth2.default(),
        C: new _synth2.default(),
        D: new _synth2.default(),
        E: new _synth2.default(),
        F: new _synth2.default(),
        G: new _synth2.default(),
        H: new _synth2.default()
    };

    var current = 'A';

    function select(synth) {
        current = synth;
        (0, _zxdom.update)(Selector);
        (0, _zxdom.update)(ControlPanel);
        onselect(synth);
    }

    var ControlPanel = (0, _zxdom.define)(function (_) {
        return (0, _zxdom.h)(bank[current].ControlPanel);
    });

    var Selector = (0, _zxdom.define)(function (_) {
        return (0, _zxdom.h)(
            'div',
            { 'class': 'voice-selector' },
            (0, _zxdom.h)(_optionButtons2.default, {
                options: 'ABCDEFGH'.split('').map(function (n) {
                    return { name: 'Voice ' + n, value: n };
                }),
                set: select,
                value: current
            })
        );
    });

    function attack(note) {
        bank[current].attack(note);
    }
    function release(note) {
        bank[current].release(note);
    }

    return { attack: attack, release: release, ControlPanel: ControlPanel, Selector: Selector };
};

var _synth = require('./synth');

var _synth2 = _interopRequireDefault(_synth);

var _zxdom = require('zxdom');

var _optionButtons = require('../option-buttons');

var _optionButtons2 = _interopRequireDefault(_optionButtons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./synth":16,"zxdom":3,"../option-buttons":17}],19:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      module.exports = {
  "sequencer": "style_sequencer_3i1KO",
  "selected": "style_selected_3xfY1",
  "time": "style_time_oD4Lj",
  "playing": "style_playing_3JUq9"
};
},{"_css_loader":11}],18:[function(require,module,exports) {

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var notes = [].concat(_toConsumableArray(Array(_const.SEQUENCER_LENGTH).keys())).map(function (_) {
        return [].concat(_toConsumableArray(Array(8).keys())).map(function (_) {
            return null;
        });
    });

    var Sequencer = (0, _zxdom.define)(function (_) {
        return (0, _zxdom.h)(
            'table',
            { 'class': _style2.default.sequencer },
            notes.map(function (vals, row) {
                return (0, _zxdom.h)(
                    'tr',
                    null,
                    (0, _zxdom.h)(
                        'td',
                        { 'class': _style2.default.time },
                        row
                    ),
                    vals.map(function (note, col) {
                        return (0, _zxdom.h)(
                            'td',
                            null,
                            note === null ? '' : _const.NOTE_NAMES[note]
                        );
                    })
                );
            })
        );
    });

    return { Sequencer: Sequencer };
};

var _zxdom = require('zxdom');

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

var _const = require('../const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
},{"zxdom":3,"./style.css":19,"../const":7}],2:[function(require,module,exports) {
'use strict';

var _zxdom = require('zxdom');

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

var _keyboard = require('./keyboard');

var _keyboard2 = _interopRequireDefault(_keyboard);

var _synth = require('./synth');

var _synth2 = _interopRequireDefault(_synth);

var _sequencer = require('./sequencer');

var _sequencer2 = _interopRequireDefault(_sequencer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sequencer = (0, _sequencer2.default)();

var soundbank = (0, _synth2.default)({
    onselect: function onselect(x) {
        return console.log('SELECTED', x);
    }
});

var keyboard = (0, _keyboard2.default)({
    onattack: function onattack(note) {
        return soundbank.attack(note);
    },
    onrelease: function onrelease(note) {
        return soundbank.release(note);
    }
});

(0, _zxdom.mount)((0, _zxdom.h)(
    'div',
    { 'class': _style2.default.appLayout },
    (0, _zxdom.h)(
        'div',
        { 'class': _style2.default.appLayoutLeft },
        (0, _zxdom.h)(
            'div',
            { 'class': _style2.default.mainPanel },
            (0, _zxdom.h)(soundbank.Selector, null),
            (0, _zxdom.h)(soundbank.ControlPanel, null)
        ),
        (0, _zxdom.h)(keyboard.Keyboard, null)
    ),
    (0, _zxdom.h)(
        'div',
        { 'class': _style2.default.appLayoutRight },
        (0, _zxdom.h)(sequencer.Sequencer, null)
    )
), document.body);
},{"zxdom":3,"./style.css":20,"./keyboard":4,"./synth":5,"./sequencer":18}],13:[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '51238' + '/');
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
},{}]},{},[13,2], null)
//# sourceMappingURL=/src.7deb02e7.map