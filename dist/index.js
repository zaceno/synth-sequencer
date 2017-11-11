(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function () {
'use strict';

function __$styleInject(css) {
  if(!(css || window)) {
    return;
  }

  var style = document.createElement('style');
  style.setAttribute('media', 'screen');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

__$styleInject("body {\n  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;\n  font-size: 13px;\n}\napp-layout {\n  display: flex;\n}\napp-layout app-layout-left {\n  flex: 0 0 800px;\n}\napp-layout app-layout-right {\n  flex: 1 0 1px;\n}\nbutton {\n  font-weight: bold;\n  background-color: #444;\n  color: #fff;\n  border: 2px black solid;\n  height: 25px;\n  line-height: 15px;\n}\nbutton.active {\n  background-color: #e9931d;\n  color: #000;\n}\ninput[type=range]::-webkit-slider-runnable-track {\n  -webkit-appearance: none;\n  width: 300px;\n  height: 6px;\n  border-radius: 3px;\n  background-color: #e9931d;\n}\ninput[type=range]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  border: 1px #000 solid;\n  height: 15px;\n  width: 5px;\n  background: #444;\n}\nmain-panel {\n  display: block;\n  background: #ddd;\n}\n");

var i;
var stack = [];

function h(type, props) {
  var arguments$1 = arguments;

  var node;
  var children = [];

  for (i = arguments.length; i-- > 2; ) {
    stack.push(arguments$1[i]);
  }

  while (stack.length) {
    if (Array.isArray((node = stack.pop()))) {
      for (i = node.length; i--; ) {
        stack.push(node[i]);
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(typeof node === "number" ? (node = node + "") : node);
    }
  }

  return typeof type === "string"
    ? { type: type, props: props || {}, children: children }
    : type(props || {}, children)
}

function app(props, container) {
  var root = (container = container || document.body).children[0];
  var node = toVNode(root, [].map);
  var callbacks = [];
  var skipRender;
  var globalState;
  var globalActions;

  repaint(flush(init(props, (globalState = {}), (globalActions = {}))));

  return globalActions

  function repaint() {
    if (props.view && !skipRender) {
      requestAnimationFrame(render, (skipRender = !skipRender));
    }
  }

  function render() {
    flush(
      (root = patchElement(
        container,
        root,
        node,
        (node = props.view(globalState, globalActions)),
        (skipRender = !skipRender)
      ))
    );
  }

  function flush(cb) {
    while ((cb = callbacks.pop())) { cb(); }
  }

  function toVNode(element, map) {
    return (
      element &&
      h(
        element.tagName.toLowerCase(),
        {},
        map.call(element.childNodes, function(element) {
          return element.nodeType === 3
            ? element.nodeValue
            : toVNode(element, map)
        })
      )
    )
  }

  function init(module, state, actions) {
    if (module.init) {
      callbacks.push(function() {
        module.init(state, actions);
      });
    }

    assign(state, module.state);

    initActions(state, actions, module.actions);

    for (var i in module.modules) {
      init(module.modules[i], (state[i] = {}), (actions[i] = {}));
    }
  }

  function initActions(state, actions, source) {
    Object.keys(source || {}).map(function(i) {
      if (typeof source[i] === "function") {
        actions[i] = function(data) {
          return typeof (data = source[i](state, actions, data)) === "function"
            ? data(update)
            : update(data)
        };
      } else {
        initActions(state[i] || (state[i] = {}), (actions[i] = {}), source[i]);
      }
    });

    function update(data) {
      return (
        typeof data === "function"
          ? update(data(state))
          : data && repaint(assign(state, data)),
        state
      )
    }
  }

  function assign(target, source) {
    for (var i in source) {
      target[i] = source[i];
    }
    return target
  }

  function merge(target, source) {
    return assign(assign({}, target), source)
  }

  function createElement(node, isSVG) {
    if (typeof node === "string") {
      var element = document.createTextNode(node);
    } else {
      var element = (isSVG = isSVG || node.type === "svg")
        ? document.createElementNS("http://www.w3.org/2000/svg", node.type)
        : document.createElement(node.type);

      if (node.props && node.props.oncreate) {
        callbacks.push(function() {
          node.props.oncreate(element);
        });
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i], isSVG));
      }

      for (var i in node.props) {
        setElementProp(element, i, node.props[i]);
      }
    }
    return element
  }

  function setElementProp(element, name, value, oldValue) {
    if (name === "key") {
    } else if (name === "style") {
      for (var name in merge(oldValue, (value = value || {}))) {
        element.style[name] = value[name] || "";
      }
    } else {
      try {
        element[name] = value;
      } catch (_) {}

      if (typeof value !== "function") {
        if (value) {
          element.setAttribute(name, value);
        } else {
          element.removeAttribute(name);
        }
      }
    }
  }

  function updateElement(element, oldProps, props) {
    for (var i in merge(oldProps, props)) {
      var value = props[i];
      var oldValue = i === "value" || i === "checked" ? element[i] : oldProps[i];

      if (value !== oldValue) {
        value !== oldValue && setElementProp(element, i, value, oldValue);
      }
    }

    if (props && props.onupdate) {
      callbacks.push(function() {
        props.onupdate(element, oldProps);
      });
    }
  }

  function removeElement(parent, element, props) {
    if (
      props &&
      props.onremove &&
      typeof (props = props.onremove(element)) === "function"
    ) {
      props(remove);
    } else {
      remove();
    }

    function remove() {
      parent.removeChild(element);
    }
  }

  function getKey(node) {
    if (node && node.props) {
      return node.props.key
    }
  }

  function patchElement(parent, element, oldNode, node, isSVG, nextSibling) {
    if (oldNode == null) {
      element = parent.insertBefore(createElement(node, isSVG), element);
    } else if (node.type != null && node.type === oldNode.type) {
      updateElement(element, oldNode.props, node.props);

      isSVG = isSVG || node.type === "svg";

      var len = node.children.length;
      var oldLen = oldNode.children.length;
      var oldKeyed = {};
      var oldElements = [];
      var keyed = {};

      for (var i = 0; i < oldLen; i++) {
        var oldElement = (oldElements[i] = element.childNodes[i]);
        var oldChild = oldNode.children[i];
        var oldKey = getKey(oldChild);

        if (null != oldKey) {
          oldKeyed[oldKey] = [oldElement, oldChild];
        }
      }

      var i = 0;
      var j = 0;

      while (j < len) {
        var oldElement = oldElements[i];
        var oldChild = oldNode.children[i];
        var newChild = node.children[j];

        var oldKey = getKey(oldChild);
        if (keyed[oldKey]) {
          i++;
          continue
        }

        var newKey = getKey(newChild);

        var keyedNode = oldKeyed[newKey] || [];

        if (null == newKey) {
          if (null == oldKey) {
            patchElement(element, oldElement, oldChild, newChild, isSVG);
            j++;
          }
          i++;
        } else {
          if (oldKey === newKey) {
            patchElement(element, keyedNode[0], keyedNode[1], newChild, isSVG);
            i++;
          } else if (keyedNode[0]) {
            element.insertBefore(keyedNode[0], oldElement);
            patchElement(element, keyedNode[0], keyedNode[1], newChild, isSVG);
          } else {
            patchElement(element, oldElement, null, newChild, isSVG);
          }

          j++;
          keyed[newKey] = newChild;
        }
      }

      while (i < oldLen) {
        var oldChild = oldNode.children[i];
        var oldKey = getKey(oldChild);
        if (null == oldKey) {
          removeElement(element, oldElements[i], oldChild.props);
        }
        i++;
      }

      for (var i in oldKeyed) {
        var keyedNode = oldKeyed[i];
        var reusableNode = keyedNode[1];
        if (!keyed[reusableNode.props.key]) {
          removeElement(element, keyedNode[0], reusableNode.props);
        }
      }
    } else if (element && node !== element.nodeValue) {
      if (typeof node === "string" && typeof oldNode === "string") {
        element.nodeValue = node;
      } else {
        element = parent.insertBefore(
          createElement(node, isSVG),
          (nextSibling = element)
        );
        removeElement(parent, nextSibling, oldNode.props);
      }
    }
    return element
  }
}

var views = function (app) {
    function wireView (state, actions, boundViews, fn) {
        return function (props, children) {
            return fn(state, actions, boundViews, props, children)
        }
    }
    
    function getWiredViews(state, actions, opts) {
        var views = {};
        for (var scope in opts.modules || {}) {
            views[scope] = getWiredViews(state[scope], actions[scope], opts.modules[scope]);
        }
        for (var name in opts.views || {}) {
            views[name] = wireView(state, actions, views, opts.views[name]);
        }
        return views
    }

    return function (opts, container) {
        var origView = opts.view;
        if (origView) {
            opts.view = function (state, actions) {
                return origView(state, actions, getWiredViews(state, actions, opts))
            };
        }
        return app(opts, container)
    }
};

__$styleInject("keyboard {\n  height: 200px;\n  width: 100%;\n  display: flex;\n  position: relative;\n}\nkeyboard clav {\n  position: relative;\n  flex: 1 0 auto;\n  width: 4.67%;\n  margin: 0;\n  padding: 0;\n  background-color: #fff;\n  height: 99%;\n  border-bottom-left-radius: 10px;\n  border-bottom-right-radius: 10px;\n  border: 1px #000 solid;\n  border-right: none;\n}\nkeyboard clav.pressed {\n  background-color: #e9931d;\n}\nkeyboard clav.black {\n  height: 60%;\n  width: 3%;\n  margin-left: -5%;\n  left: 2.5%;\n  z-index: 100;\n  background-color: #444;\n  color: #fff;\n}\nkeyboard clav.black.pressed {\n  background-color: #e9931d;\n}\nkeyboard clav char {\n  display: block;\n  position: absolute;\n  bottom: 10px;\n  width: 100%;\n  text-align: center;\n}\n");

function cat(classes, prefix) {
  var value;
  var className = "";
  var type = typeof classes;

  if ((classes && type === "string") || type === "number") {
    return classes
  }

  prefix = prefix || " ";

  if (Array.isArray(classes) && classes.length) {
    for (var i = 0, len = classes.length; i < len; i++) {
      if ((value = cat(classes[i], prefix))) {
        className += (className && prefix) + value;
      }
    }
  } else {
    for (var i in classes) {
      if (classes.hasOwnProperty(i) && (value = classes[i])) {
        className +=
          (className && prefix) +
          i +
          (typeof value === "object" ? cat(value, prefix + i) : "");
      }
    }
  }

  return className
}

/*

in event mode

render a component: 
  if in event mode: reset the registries and go to register mode
  if in register mode do nothing

when an event comes in
    if in registry mode, go to event mode.

*/
var listening = true;
var registry;

['keyup', 'keydown', 'keypress'].map(function (type) { return window.addEventListener(type, function (ev) {
    listening = true;
    if (!registry[type][ev.key]) { return }
    ev.preventDefault(true);
    registry[type][ev.key].map(function (fn) { return fn(ev); });
}); });

var KeyEventComponent = function (type) { return function (ref) {
    var key = ref.key;
    var then = ref.then;

    if (listening) {
        registry = { keyup: {}, keydown: {}, keypress: {} };
        listening = false;
    }
    registry[type][key] = registry[type][key] || [];
    registry[type][key].push(then);
}; };

var KeyPress = KeyEventComponent('keypress');
var KeyUp = KeyEventComponent('keyup');
var KeyDown = KeyEventComponent('keydown');

var KEYBOARD_KEYS = [
    'z','s','x','d','c','v',
    'g','b','h','n','j','m',
    'q','2','w','3','e','r',
    '5','t','6','y','7','u',
    'i'
];

var KEYBOARD_BLACK_KEYS = [
    's', 'd', 'g', 'h', 'j',
    '2', '3', '5', '6', '7'
];

var isBlack  = function (char) { return KEYBOARD_BLACK_KEYS.indexOf(char) > -1; };

var noteForChar = function (char) {
    var n = KEYBOARD_KEYS.indexOf(char);
    return n > -1 ? n : null
};

var keyboard = {

    state: {pressed: null},

    actions: {
        pressed: function (state, actions, pressed) { return ({pressed: pressed}); }
    },

    views: {
        keyboard: function (state, actions, views, props) {

            var clav = function (char) {

                var note = noteForChar(char);

                var onUp = function (_) {
                    if (char !== state.pressed) { return }
                    if (char === state.pressed) { props.onrelease(note); }
                    actions.pressed(null);
                };

                var onDown = function (_) {
                    if (props.char === state.pressed) { return }
                    if (char !== state.pressed) { props.onattack(note); }        
                    actions.pressed(char);
                };

                return (
                    h( 'clav', {
                        onmousedown: onDown, onmouseup: onUp, class: cat({
                            white: !isBlack(char),
                            black: isBlack(char),
                            pressed: state.pressed === char,
                        }) },
                        h( 'char', null, char.toUpperCase() ),
                        h( KeyUp, { key: char, then: onUp }),
                        h( KeyDown, { key: char, then: onDown })
                    )
                )
            };

            return h( 'keyboard', null, KEYBOARD_KEYS.map(clav) )
        }
    }
};

__$styleInject("synth-panel {\n  display: flex;\n  padding: 15px;\n  position: relative;\n}\nsynth-panel span.label {\n  display: inline-block;\n  width: 80px;\n}\nsynth-panel .col-1 {\n  width: 1px;\n  flex: 1 0 auto;\n}\nsynth-panel .col-2 {\n  width: 1px;\n  flex: 1 0 auto;\n}\nsynth-panel input[type=range] {\n  -webkit-appearance: none;\n  width: 200px;\n}\nsynth-panel input[type=range]::-webkit-slide-runnable-track {\n  -webkit-appearance: none;\n  height: 6px;\n  border-radius: 3px;\n  background-color: #e9931d;\n}\nsynth-panel input[type=range]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  border: 1px #000 solid;\n  height: 15px;\n  width: 8px;\n  border-radius: 2px;\n  margin-top: -4px;\n  background: #444;\n}\nvoice-selector {\n  display: block;\n  padding: 15px;\n  text-align: right;\n  border-bottom: 1px #555 solid;\n}\nvoice-selector button {\n  margin-left: 10px;\n}\n");

var ButtonOptions = function (ref) {
    var options = ref.options;
    var value = ref.value;
    var set = ref.set;

    return h('span', {class: 'button-options'}, options.map(function (o) { return h('button', {
    class: cat({active: value === o}),
    onclick: function (ev) {
        ev.preventDefault(true);
        set(o);
    }
}, [o]); }));
};

var Slider = function (ref) {
    var value = ref.value;
    var set = ref.set;
    var min = ref.min;
    var max = ref.max;
    var step = ref.step;

    return h('input', {
    type: "range",
    min: min || 0,
    max: max,
    step: step || "any",
    value: value,
    oninput: function (ev) { return set(ev.currentTarget.value); },
});
};

var DEFAULTS = {
    octave: 4,
    oscillatorType: 'triangle',
    ampLevel: 0.3,
    sustainLevel: 0.6,
    attackTime: 0.02,
    decayTime: 0.04,
    releaseTime: 0.4,
    filterCutoff: 7600,
    filterQ: 10,
};

var OSCILLATOR_TYPES = ['sawtooth', 'square', 'triangle', 'sine'];

var controlModule = function (ref) {
    var initial = ref.initial;
    var Widget = ref.widget;
    var params = ref.params;
    var name = ref.name;

    return ({
    state: {value: initial},
    actions: {
        set: function (_, __, value) { return ({value: value}); }
    },
    views: {
        control: function (state, actions, _, ref) {
            var onset = ref.onset;

            var widgetProps = Object.assign(params, {
                value: state.value,
                set: function (x) {
                    actions.set(x);
                    onset && onset(x);
                }
            });
            return (
                h( 'p', null,
                    h( 'label', null,
                        h( 'span', { class: "label" }, name + ':'),
                        Widget(widgetProps)
                    )
                )
            )
        }
    }
});
};

var oscillatorType = controlModule({
    name: 'Oscillator',
    initial: DEFAULTS.oscillatorType,
    widget: ButtonOptions,
    params: {options: OSCILLATOR_TYPES}
});

var filterCutoff = controlModule({
    name: 'Cutoff',
    initial: DEFAULTS.filterCutoff,
    widget: Slider,
    params: { min: 60, max: 7600 }
});

var octave = controlModule({
    name: 'Octave',
    initial: DEFAULTS.octave,
    widget: Slider,
    params: { min: 1, max: 6, step: 1 }
});

var filterQ = controlModule({
    name: 'Resonance',
    initial: DEFAULTS.filterQ,
    widget: Slider,
    params: {max: 20},
});

var attackTime = controlModule({
    name: 'Attack Time',
    initial: DEFAULTS.attackTime,
    widget: Slider,
    params: {max: 0.2},
});

var decayTime = controlModule({
    name: 'Decay Time',
    initial: DEFAULTS.decayTime,
    widget: Slider,
    params: {max: 0.2}
});

var releaseTime = controlModule({
    name: 'Release Time',
    initial: DEFAULTS.releaseTime,
    widget: Slider,
    params: {max: 0.2}
});

var sustainLevel = controlModule({
    name: 'Sustain Level',
    initial: DEFAULTS.sustainLevel,
    widget: Slider,
    params: {max: 1.0},
});

var ampLevel = controlModule({
    name: 'Amp Level',
    initial: DEFAULTS.ampLevel,
    widget: Slider,
    params: {max: 1.0},
});

var TUNING_FREQ = 440;
var TUNING_NOTE = 69;


function noteToHz (note, octave$$1) {
    return Math.exp ((octave$$1 * 12 + note  - TUNING_NOTE) * Math.log(2) / 12) * TUNING_FREQ;
}


var synth = {

   state: {
        audioContext: null,
        oscillatorNode: null,
        filterNode: null,
        envelopeNode: null,
        ampNode: null,
        playing: null,
    },
    
    modules: {
        oscillatorType: oscillatorType,
        octave: octave,
        filterCutoff: filterCutoff,
        filterQ: filterQ,
        attackTime: attackTime,
        releaseTime: releaseTime,
        decayTime: decayTime,
        sustainLevel: sustainLevel,
        ampLevel: ampLevel,
    },

    actions: {
    
        init: function (state, actions, ctx) {
            var oscillator = ctx.createOscillator();
            oscillator.type = state.oscillatorType.value;
            
            var filter = ctx.createBiquadFilter();
            filter.type = 'lowpass',
            filter.frequency.value = state.filterCutoff.value;
            filter.Q.value = state.filterQ.value;

            var envelope = ctx.createGain();
            envelope.gain.value = 0;

            var amplifier = ctx.createGain();
            amplifier.gain.value = state.ampLevel.value;

            oscillator.connect(filter);
            filter.connect(envelope);
            envelope.connect(amplifier);
            amplifier.connect(ctx.destination);
            oscillator.start();

            return {
                audioContext: ctx,
                oscillator: oscillator,
                filter: filter,
                envelope: envelope,
                amplifier: amplifier,
            }
        },

        attack: function (state, actions, note) {
            if (state.playing === note) { return }
            var freq = noteToHz(note, state.octave.value);
            var t = state.audioContext.currentTime;
            state.oscillator.frequency.cancelScheduledValues(t);
            state.envelope.gain.cancelScheduledValues(t);
            t += 0.01;
            state.oscillator.frequency.linearRampToValueAtTime(freq, t);
            state.envelope.gain.linearRampToValueAtTime(0, t);
            t += +state.attackTime.value;
            state.envelope.gain.linearRampToValueAtTime(1, t);
            t += +state.decayTime.value;
            state.envelope.gain.linearRampToValueAtTime(+state.sustainLevel.value, t);

            return {playing: note}
        },

        release: function (state, actions, note) {
            if (state.playing !== note) { return }
            var t = state.audioContext.currentTime + 0.01;
            state.envelope.gain.cancelScheduledValues(t);
            t += state.releaseTime.value;
            state.envelope.gain.linearRampToValueAtTime(0, t);
            return {playing: null}
        },

        stop: function (state, actions) {
            if (state.playing === null) { return }
            actions.release(state.playing);
        },

    },


    views: {

        onsave: function (state, actions) { return ({
            oscillatorType: state.oscillatorType.value,
            octave: state.octave.value,
            filterCutoff: state.filterCutoff.value,
            filterQ: state.filterQ.value,
            attackTime: state.attackTime.value,
            decayTime: state.decayTime.value,
            sustainLevel: state.sustainLevel.value,
            releaseTime: state.releaseTime.value,
            ampLevel: state.ampLevel.value,
        }); },

        onload: function (state, actions, views, values) {
            actions.oscillatorType.set(values.oscillatorType);
            actions.octave.set(values.octave);
            actions.filterCutoff.set(values.filterCutoff);
            actions.filterQ.set(values.filterQ);
            actions.attackTime.set(values.attackTime);
            actions.decayTime.set(values.decayTime);
            actions.sustainLevel.set(values.sustainLevel);
            actions.releaseTime.set(values.releaseTime);
            actions.ampLevel.set(values.ampLevel);

            state.oscillator.type = values.oscillatorType;
            state.filter.frequency.value = values.filterCutoff;
            state.filter.Q.value = values.filterQ;
            state.amplifier.gain.value = values.ampLevel;
        },

        panel: function (state, actions, views) { return h( 'synth-panel', null,
            h( 'div', { class: "col-1" },
                h( views.oscillatorType.control, { onset: function (v) { return (state.oscillator.type = v); } }),
                h( views.octave.control, null ),
                h( views.filterCutoff.control, { onset: function (v) { return (state.filter.frequency.value = v); } }),
                h( views.filterQ.control, { onset: function (v) { return (state.filter.Q.value = v); } })
            ),
            h( 'div', { class: "col-2" },
                h( views.attackTime.control, null ),
                h( views.decayTime.control, null ),
                h( views.sustainLevel.control, null ),
                h( views.releaseTime.control, null ),
                h( views.ampLevel.control, { onset: function (v) { return (state.amplifier.gain.value = v); } })
            )
        ); }
    }
};

var indices = [...Array(8).keys()];

var soundbank = {
    modules: {
        0: synth,
        1: synth,
        2: synth,
        3: synth,
        4: synth,
        5: synth,
        6: synth,
        7: synth,
    },

    state: { selected: 0 },
    
    actions: {
        select: function (state, actions, voice) { return ({selected: voice}); },
        
        init: function (state, actions, voices) {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            indices.forEach(function (i) { return actions[i].init(ctx); });
        },
    },
    
    views: {
        getSelected: function (state) { return state.selected; },

        select: function (state, actions, views, voice) { return actions.select(voice); },

        stopAll: function (state, actions) { return indices.map(function (i) { return actions[i].stop(); }); },

        attack: function (state, actions, views, note) { return actions[state.selected].attack(note); },

        release: function (state, actions, views, note) { return actions[state.selected].release(note); },

        attackVoice: function (state, actions, views, ref) {
            var note = ref.note;
            var voice = ref.voice;

            return actions[voice].attack(note);
},

        releaseVoice: function (state, actions, views, ref) {
            var note = ref.note;
            var voice = ref.voice;

            return actions[voice].release(note);
},    

        onload: function (state, actions, views, data) { return indices.forEach(function (voice) { return views[voice].onload(data[voice]); }); },

        onsave: function (state, actions, views) { return indices.map(function (voice) { return views[voice].onsave(); }); },

        panel: function (state, actions, views) { return views[state.selected].panel(); },
        
        selector: function (state, actions, views) { return (
            h( 'voice-selector', null,
                indices.map(function (i) { return (
                    h( 'button', {
                        onmousedown: function (_) { return actions.select(i); }, class: cat({active: state.selected === i}) }, "Voice ", i + 1
                    )
                ); })
            )
        ); },
    }
};

__$styleInject("table.sequencer {\n  border-collapse: collapse;\n}\ntable.sequencer td {\n  border: 1px #ccc solid;\n  width: 50px;\n}\ntable.sequencer td.selected {\n  background: #e9931d;\n}\ntable.sequencer td.time {\n  background: #ccc;\n  text-align: right;\n}\ntable.sequencer td.playing {\n  background: #ddd;\n}\n");

var listening$1 = true;
var registry$1;

['mouseup', 'mousedown', 'mousemove'].map(function (type) { return window.addEventListener(type, function (ev) {
    listening$1 = true;
    registry$1[type].map(function (fn) { return fn(ev); });
}); });

var MouseEventComponent = function (type) { return function (ref) {
    var then = ref.then;

    if (listening$1) {
        registry$1 = { mouseup: [], mousedown: [], mousemove: [] };
        listening$1 = false;
    }
    registry$1[type].push(then);
}; };

var MouseMove = MouseEventComponent('mousemove');
var MouseDown = MouseEventComponent('mousedown');
var MouseUp   = MouseEventComponent('mouseup');

var selection = {
    
    state: {
        start: -1,
        end: -1,
        selecting: false,
        col: null,
    },

    actions: {

        reset: function (_) { return ({
            start: -1,
            end: -1,
            selecting: false,
        }); },

        start: function (state, actions, ref) {
            var row = ref.row;
            var col = ref.col;

            return ({
            selecting: true,
            start: row,
            end: row,
            col: col,
        });
},

        set: function (state, actions, ref) {
            var row = ref.row;

            if (!state.selecting) { return }
            return ({end: row})
        },

        stop: function (state, actions) { return ({selecting: false}); },

    },

    views: {
        
        setNote: function (state, actions, views, ref) {
            var value = ref.value;
            var grid = ref.grid;

            if (state.start === -1) { return }
            var start = state.start;
            var end = state.end;
            var ref$1 = start < end ? [start, end] : [end, start];
            var from = ref$1[0];
            var to = ref$1[1]; 
            for (var i = from; i <= to; i++) {
                grid[i][state.col] = value;
            }
            actions.reset();
            return grid
        },

        isSelected: function (state, actions, views, ref) {
            var row = ref.row;
            var col = ref.col;

            return  (
                col === state.col &&
                (
                    ( row >= state.start && row <= state.end ) ||
                    ( row <= state.start && row >= state.end )
                )
            )
        },

        selectable: function (state, actions, views, ref, children) {
            var row = ref.row;
            var col = ref.col;
            var oncol = ref.oncol;

            return children.map(function (node) {
                node.props.class = cat([node.props.class, {
                    selected: views.isSelected({row: row, col: col})
                }]);
                node.props.onmousedown = function (ev) {
                    ev.preventDefault(true);
                    oncol(col);
                    actions.start({row: row, col: col});
                };
                node.props.onmousemove = function (ev) {
                    ev.preventDefault(true);
                    actions.set({row: row});
                };
                return node
            })
        },

        clearButton: function (state, actions, views, ref) {
            var grid = ref.grid;

            return [
            h( MouseUp, { then: actions.stop }),
            h( KeyDown, { key: " ", then: function (_) { return views.setNote({note: null, grid: grid}); } }),
            h( 'button', { onmousedown: function (_) { return views.setNote({note: null, grid: grid}); } }, "X"),
        ];
},

    }
};

var recording = {
    state: {
        on: false,
        note: null,
        voice: null,
    },
    actions: {
        start: function (_) { return ({on: true}); },
        stop: function (_) { return ({on: false}); },
        setNote: function (state, actions, ref) {
            var note = ref.note;
            var voice = ref.voice;

            return ({note: note, voice: voice});
},
        attack: function (state, actions, ref) {
            var note = ref.note;
            var voice = ref.voice;

            if (!state.on) { return }
            if (note === state.note) { return }
            if (voice === state.voice) { return }
            return {note: note, voice: voice}
        },
        release: function (state, actions, ref) {
            var note = ref.note;
            if (note !== state.note) { return }
            return {note: null, voice: null}
        }
    },
    views: {
        attack: function (state, actions, views, ref) {
            var note = ref.note;
            var voice = ref.voice;

            return actions.setNote({note: note, voice: voice});
},
        release: function (state, actions, views, ref) {
            return actions.setNote({note: null, voice: null});
},
        start: function (state, actions) { return actions.start(); },
        stop: function (state, actions) { return actions.stop(); },
        recordButton: function (state, actions, views, ref) {
            var onstart = ref.onstart;

            return (
            h( 'button', {
                onmousedown: function (_) {
                    actions.start();
                    onstart && onstart();
                }, class: cat({active: state.on}) }, "Rec")
        );
}
    }
};

var NUM_TIMES = 32;
var TIMESTEP = 100;
var NOTE_NAMES = [
    'C', 'C#', 'D', 'Eb',
    'E', 'F', 'F#', 'G',
    'Ab', 'A', 'Bb', 'B',
    'C', 'C#', 'D', 'Eb',
    'E', 'F', 'F#', 'G',
    'Ab', 'A', 'Bb', 'B',
    'C'
];

var playback = {
    state: {
        on: false,
        interval: null,
        time: 0,
    },

    actions: {
        
        start: function (state, actions) {
            if(state.on) { return }
            return ({
                on: true,
                interval: setInterval(actions.advance, TIMESTEP)
            })
        },
        
        stop: function (state, actions) {
            if (!state.on) { return }
            state.interval && clearInterval(state.interval);
            return ({ on: false, interval: null })
        },

        advance: function (state, actions) { return ({time: (state.time + 1) % NUM_TIMES}); },

        setTime: function (state, actions, time) { return ({time: time}); },
    },

    views: {

        start: function (state, actions) { return actions.start(); },

        stop: function (state, actions) { return actions.stop(); },

        setTime: function (state, actions, views, time) { return ({time: time}); },

        nowPlaying: function (state, actions, views, time) { return time === state.time; },

        play: function (state, actions, views, ref) {
            var times = ref.times;
            var onattack = ref.onattack;
            var onrelease = ref.onrelease;

            if (!state.on) { return }
            var notes = times[state.time];
            var prev = times[(state.time + NUM_TIMES - 1) % NUM_TIMES];
            notes.forEach(function (note, voice) {
                if (note === prev[voice]) { return }
                if (note !== null) {
                    onattack({voice: voice, note: note});
                } else {
                    onrelease({voice: voice, note: prev[voice]});
                }
            });
        },

        startButton: function (state, actions, views, ref) {
            var onstart = ref.onstart;

            return (
            h( 'button', {
                onmousedown: function (_) {
                    if (state.on) { return }
                    actions.start();
                    onstart && onstart();
                }, class: cat({active: state.on}) }, "Play")  
        );
},

        stopButton: function (state, actions, views, ref) {
            var onstop = ref.onstop;

            return (
            h( 'button', {
                onmousedown: function (_) {
                    if (!state.on) { return }
                    actions.stop();
                    onstop && onstop();
                } }, "Stop")
        );
},
    }
};

function noteName (note) {
    if (note === null) { return '' }
    return NOTE_NAMES[note]
}



var sequencer = {

    modules: {
        selection: selection,
        recording: recording,
        playback: playback,
    },

    state: {
        times: [...Array(NUM_TIMES).keys()].map(function (_) { return [...Array(8).keys()].map(function (_) { return null; }); }),
    },

    actions: {

        setTimes: function (state, actions, times) { if (times) { return {times: times} } },

        setRecordedNote: function (state, actions) {
            if (!state.recording.on) { return }
            if (state.recording.note === null) { return }
            state.times[state.playback.time][state.recording.voice] = state.recording.note;
            actions.setTimes(state.times);
        },
    },

    views: {

        attack: function (state, actions, ref, ref$1) {
            var selection$$1 = ref.selection;
            var recording$$1 = ref.recording;
            var note = ref$1.note;
            var voice = ref$1.voice;

            actions.setTimes(selection$$1.setNote({grid: state.times, value: note}));
            recording$$1.attack({note: note, voice: voice});
        },

        release: function (state, actions, ref, ref$1) {
            var recording$$1 = ref.recording;
            var note = ref$1.note;
            var voice = ref$1.voice;

            recording$$1.release({note: note, voice: voice});
        },

        onsave: function (ref) {
            var times = ref.times;

            return times;
},

        onload: function (state, actions, views, times) { return actions.setTimes(times); },

        grid: function (state, actions, ref, ref$1) {
            var playback$$1 = ref.playback;
            var selection$$1 = ref.selection;
            var onattack = ref$1.onattack;
            var onrelease = ref$1.onrelease;
            var onselectVoice = ref$1.onselectVoice;

            playback$$1.play({times: state.times, onattack: onattack, onrelease: onrelease});
            actions.setRecordedNote();
            return (
                h( 'table', { class: "sequencer" },
                state.times.map(function (voices, time) { return (
                    h( 'tr', null,
                        h( 'td', { class: "time", onclick: function (_) { return playback$$1.setTime(time); } }, time),
                        voices.map(function (note, voice) { return (
                            h( selection$$1.selectable, { row: time, col: voice, oncol: onselectVoice },
                                h( 'td', { class: cat({playing: playback$$1.nowPlaying(time)}) }, noteName(note))
                            )
                        ); })
                    )
                ); })
                )
            )
        },
        
        controls: function (state, actions, ref, ref$1) {
            var playback$$1 = ref.playback;
            var recording$$1 = ref.recording;
            var selection$$1 = ref.selection;
            var onstop = ref$1.onstop;

            return (
            h( 'span', null,
                h( recording$$1.recordButton, { onstart: playback$$1.start }),
                h( playback$$1.startButton, null ),
                h( playback$$1.stopButton, { onstop: function (_) {
                    recording$$1.stop();
                    onstop && onstop();
                } }),
                h( selection$$1.clearButton, { grid: state.times })
            )
        );
}
    }
};

views(app)({
    
    modules: {
        keyboard: keyboard,
        soundbank: soundbank,
        sequencer: sequencer
    },

    views: {
        loadState: function (state, actions, views$$1) {
            actions.soundbank.init();
            var data = localStorage.getItem('SYNTHDATA');
            if (!data) { return }
            var ref = JSON.parse(data);
            var voices = ref.voices;
            var notes = ref.notes;
            if (voices) { views$$1.soundbank.onload(voices); }
            if (notes) { views$$1.sequencer.onload(notes); }
        },

        saveState: function (state, actions, views$$1) {
            localStorage.setItem('SYNTHDATA', JSON.stringify({
                voices: views$$1.soundbank.onsave(),
                notes: views$$1.sequencer.onsave()
            }));
        }
    },

    view: function (state, actions, ref) {
        var loadState = ref.loadState;
        var saveState = ref.saveState;
        var keyboard$$1 = ref.keyboard;
        var soundbank$$1 = ref.soundbank;
        var sequencer$$1 = ref.sequencer;

        return (
        h( 'app-layout', { oncreate: loadState, onupdate: saveState },
            h( 'app-layout-left', null,
                h( 'main-panel', null,
                    h( sequencer$$1.controls, { onstop: soundbank$$1.stopAll }),
                    h( soundbank$$1.selector, null ),
                    h( soundbank$$1.panel, null )
                ),
                h( keyboard$$1.keyboard, { 
                    onattack: function (note) {
                        soundbank$$1.attack(note);
                        sequencer$$1.attack({note: note, voice: soundbank$$1.getSelected() });
                    }, onrelease: function (note) {
                        soundbank$$1.release(note);
                        sequencer$$1.release({note: note, voice: soundbank$$1.getSelected() });
                    } })
            ),
            h( 'app-layout-right', null,
                h( sequencer$$1.grid, {
                    selectedVoice: soundbank$$1.getSelected(), onselectVoice: function (i) { return soundbank$$1.select(i); }, onattack: function (ref) {
                        var note = ref.note;
                        var voice = ref.voice;

                        return soundbank$$1.attackVoice({note: note, voice: voice});
        }, onrelease: function (ref) {
                        var note = ref.note;
                        var voice = ref.voice;

                        return soundbank$$1.releaseVoice({note: note, voice: voice});
        } })
            )
        )
    );
},
});

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9oeXBlcmFwcC9zcmMvaC5qcyIsIi4uL25vZGVfbW9kdWxlcy9oeXBlcmFwcC9zcmMvYXBwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2h5cGVyYXBwLW1vZHVsZS12aWV3cy9zcmMvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvY2xhc3NjYXQvc3JjL2luZGV4LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMva2V5LWV2ZW50cy5qcyIsIi4uL3NyYy9rZXlib2FyZC9pbmRleC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2NvbnRyb2xzLmpzIiwiLi4vc3JjL3NvdW5kYmFuay9jb250cm9scy5qcyIsIi4uL3NyYy9zb3VuZGJhbmsvc3ludGguanMiLCIuLi9zcmMvc291bmRiYW5rL2luZGV4LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvbW91c2UtZXZlbnRzLmpzIiwiLi4vc3JjL3NlcXVlbmNlci9zZWxlY3Rpb24uanMiLCIuLi9zcmMvc2VxdWVuY2VyL3JlY29yZGluZy5qcyIsIi4uL3NyYy9zZXF1ZW5jZXIvY29uc3QuanMiLCIuLi9zcmMvc2VxdWVuY2VyL3BsYXliYWNrLmpzIiwiLi4vc3JjL3NlcXVlbmNlci9pbmRleC5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaVxudmFyIHN0YWNrID0gW11cblxuZXhwb3J0IGZ1bmN0aW9uIGgodHlwZSwgcHJvcHMpIHtcbiAgdmFyIG5vZGVcbiAgdmFyIGNoaWxkcmVuID0gW11cblxuICBmb3IgKGkgPSBhcmd1bWVudHMubGVuZ3RoOyBpLS0gPiAyOyApIHtcbiAgICBzdGFjay5wdXNoKGFyZ3VtZW50c1tpXSlcbiAgfVxuXG4gIHdoaWxlIChzdGFjay5sZW5ndGgpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSgobm9kZSA9IHN0YWNrLnBvcCgpKSkpIHtcbiAgICAgIGZvciAoaSA9IG5vZGUubGVuZ3RoOyBpLS07ICkge1xuICAgICAgICBzdGFjay5wdXNoKG5vZGVbaV0pXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlICE9IG51bGwgJiYgbm9kZSAhPT0gdHJ1ZSAmJiBub2RlICE9PSBmYWxzZSkge1xuICAgICAgY2hpbGRyZW4ucHVzaCh0eXBlb2Ygbm9kZSA9PT0gXCJudW1iZXJcIiA/IChub2RlID0gbm9kZSArIFwiXCIpIDogbm9kZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHlwZW9mIHR5cGUgPT09IFwic3RyaW5nXCJcbiAgICA/IHsgdHlwZTogdHlwZSwgcHJvcHM6IHByb3BzIHx8IHt9LCBjaGlsZHJlbjogY2hpbGRyZW4gfVxuICAgIDogdHlwZShwcm9wcyB8fCB7fSwgY2hpbGRyZW4pXG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcIi4vaFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBhcHAocHJvcHMsIGNvbnRhaW5lcikge1xuICB2YXIgcm9vdCA9IChjb250YWluZXIgPSBjb250YWluZXIgfHwgZG9jdW1lbnQuYm9keSkuY2hpbGRyZW5bMF1cbiAgdmFyIG5vZGUgPSB0b1ZOb2RlKHJvb3QsIFtdLm1hcClcbiAgdmFyIGNhbGxiYWNrcyA9IFtdXG4gIHZhciBza2lwUmVuZGVyXG4gIHZhciBnbG9iYWxTdGF0ZVxuICB2YXIgZ2xvYmFsQWN0aW9uc1xuXG4gIHJlcGFpbnQoZmx1c2goaW5pdChwcm9wcywgKGdsb2JhbFN0YXRlID0ge30pLCAoZ2xvYmFsQWN0aW9ucyA9IHt9KSkpKVxuXG4gIHJldHVybiBnbG9iYWxBY3Rpb25zXG5cbiAgZnVuY3Rpb24gcmVwYWludCgpIHtcbiAgICBpZiAocHJvcHMudmlldyAmJiAhc2tpcFJlbmRlcikge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlciwgKHNraXBSZW5kZXIgPSAhc2tpcFJlbmRlcikpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGZsdXNoKFxuICAgICAgKHJvb3QgPSBwYXRjaEVsZW1lbnQoXG4gICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgcm9vdCxcbiAgICAgICAgbm9kZSxcbiAgICAgICAgKG5vZGUgPSBwcm9wcy52aWV3KGdsb2JhbFN0YXRlLCBnbG9iYWxBY3Rpb25zKSksXG4gICAgICAgIChza2lwUmVuZGVyID0gIXNraXBSZW5kZXIpXG4gICAgICApKVxuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKGNiKSB7XG4gICAgd2hpbGUgKChjYiA9IGNhbGxiYWNrcy5wb3AoKSkpIGNiKClcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvVk5vZGUoZWxlbWVudCwgbWFwKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGVsZW1lbnQgJiZcbiAgICAgIGgoXG4gICAgICAgIGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICB7fSxcbiAgICAgICAgbWFwLmNhbGwoZWxlbWVudC5jaGlsZE5vZGVzLCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnQubm9kZVR5cGUgPT09IDNcbiAgICAgICAgICAgID8gZWxlbWVudC5ub2RlVmFsdWVcbiAgICAgICAgICAgIDogdG9WTm9kZShlbGVtZW50LCBtYXApXG4gICAgICAgIH0pXG4gICAgICApXG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdChtb2R1bGUsIHN0YXRlLCBhY3Rpb25zKSB7XG4gICAgaWYgKG1vZHVsZS5pbml0KSB7XG4gICAgICBjYWxsYmFja3MucHVzaChmdW5jdGlvbigpIHtcbiAgICAgICAgbW9kdWxlLmluaXQoc3RhdGUsIGFjdGlvbnMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGFzc2lnbihzdGF0ZSwgbW9kdWxlLnN0YXRlKVxuXG4gICAgaW5pdEFjdGlvbnMoc3RhdGUsIGFjdGlvbnMsIG1vZHVsZS5hY3Rpb25zKVxuXG4gICAgZm9yICh2YXIgaSBpbiBtb2R1bGUubW9kdWxlcykge1xuICAgICAgaW5pdChtb2R1bGUubW9kdWxlc1tpXSwgKHN0YXRlW2ldID0ge30pLCAoYWN0aW9uc1tpXSA9IHt9KSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbml0QWN0aW9ucyhzdGF0ZSwgYWN0aW9ucywgc291cmNlKSB7XG4gICAgT2JqZWN0LmtleXMoc291cmNlIHx8IHt9KS5tYXAoZnVuY3Rpb24oaSkge1xuICAgICAgaWYgKHR5cGVvZiBzb3VyY2VbaV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBhY3Rpb25zW2ldID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIHJldHVybiB0eXBlb2YgKGRhdGEgPSBzb3VyY2VbaV0oc3RhdGUsIGFjdGlvbnMsIGRhdGEpKSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICA/IGRhdGEodXBkYXRlKVxuICAgICAgICAgICAgOiB1cGRhdGUoZGF0YSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdEFjdGlvbnMoc3RhdGVbaV0gfHwgKHN0YXRlW2ldID0ge30pLCAoYWN0aW9uc1tpXSA9IHt9KSwgc291cmNlW2ldKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBmdW5jdGlvbiB1cGRhdGUoZGF0YSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdHlwZW9mIGRhdGEgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gdXBkYXRlKGRhdGEoc3RhdGUpKVxuICAgICAgICAgIDogZGF0YSAmJiByZXBhaW50KGFzc2lnbihzdGF0ZSwgZGF0YSkpLFxuICAgICAgICBzdGF0ZVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuICAgIGZvciAodmFyIGkgaW4gc291cmNlKSB7XG4gICAgICB0YXJnZXRbaV0gPSBzb3VyY2VbaV1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldFxuICB9XG5cbiAgZnVuY3Rpb24gbWVyZ2UodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICByZXR1cm4gYXNzaWduKGFzc2lnbih7fSwgdGFyZ2V0KSwgc291cmNlKVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudChub2RlLCBpc1NWRykge1xuICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShub2RlKVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZWxlbWVudCA9IChpc1NWRyA9IGlzU1ZHIHx8IG5vZGUudHlwZSA9PT0gXCJzdmdcIilcbiAgICAgICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBub2RlLnR5cGUpXG4gICAgICAgIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLnR5cGUpXG5cbiAgICAgIGlmIChub2RlLnByb3BzICYmIG5vZGUucHJvcHMub25jcmVhdGUpIHtcbiAgICAgICAgY2FsbGJhY2tzLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbm9kZS5wcm9wcy5vbmNyZWF0ZShlbGVtZW50KVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtZW50KG5vZGUuY2hpbGRyZW5baV0sIGlzU1ZHKSlcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSBpbiBub2RlLnByb3BzKSB7XG4gICAgICAgIHNldEVsZW1lbnRQcm9wKGVsZW1lbnQsIGksIG5vZGUucHJvcHNbaV0pXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFbGVtZW50UHJvcChlbGVtZW50LCBuYW1lLCB2YWx1ZSwgb2xkVmFsdWUpIHtcbiAgICBpZiAobmFtZSA9PT0gXCJrZXlcIikge1xuICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICBmb3IgKHZhciBuYW1lIGluIG1lcmdlKG9sZFZhbHVlLCAodmFsdWUgPSB2YWx1ZSB8fCB7fSkpKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGVbbmFtZV0gPSB2YWx1ZVtuYW1lXSB8fCBcIlwiXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGVsZW1lbnRbbmFtZV0gPSB2YWx1ZVxuICAgICAgfSBjYXRjaCAoXykge31cblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVFbGVtZW50KGVsZW1lbnQsIG9sZFByb3BzLCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgaW4gbWVyZ2Uob2xkUHJvcHMsIHByb3BzKSkge1xuICAgICAgdmFyIHZhbHVlID0gcHJvcHNbaV1cbiAgICAgIHZhciBvbGRWYWx1ZSA9IGkgPT09IFwidmFsdWVcIiB8fCBpID09PSBcImNoZWNrZWRcIiA/IGVsZW1lbnRbaV0gOiBvbGRQcm9wc1tpXVxuXG4gICAgICBpZiAodmFsdWUgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgIHZhbHVlICE9PSBvbGRWYWx1ZSAmJiBzZXRFbGVtZW50UHJvcChlbGVtZW50LCBpLCB2YWx1ZSwgb2xkVmFsdWUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb3BzICYmIHByb3BzLm9udXBkYXRlKSB7XG4gICAgICBjYWxsYmFja3MucHVzaChmdW5jdGlvbigpIHtcbiAgICAgICAgcHJvcHMub251cGRhdGUoZWxlbWVudCwgb2xkUHJvcHMpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQocGFyZW50LCBlbGVtZW50LCBwcm9wcykge1xuICAgIGlmIChcbiAgICAgIHByb3BzICYmXG4gICAgICBwcm9wcy5vbnJlbW92ZSAmJlxuICAgICAgdHlwZW9mIChwcm9wcyA9IHByb3BzLm9ucmVtb3ZlKGVsZW1lbnQpKSA9PT0gXCJmdW5jdGlvblwiXG4gICAgKSB7XG4gICAgICBwcm9wcyhyZW1vdmUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlbW92ZSgpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0S2V5KG5vZGUpIHtcbiAgICBpZiAobm9kZSAmJiBub2RlLnByb3BzKSB7XG4gICAgICByZXR1cm4gbm9kZS5wcm9wcy5rZXlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXRjaEVsZW1lbnQocGFyZW50LCBlbGVtZW50LCBvbGROb2RlLCBub2RlLCBpc1NWRywgbmV4dFNpYmxpbmcpIHtcbiAgICBpZiAob2xkTm9kZSA9PSBudWxsKSB7XG4gICAgICBlbGVtZW50ID0gcGFyZW50Lmluc2VydEJlZm9yZShjcmVhdGVFbGVtZW50KG5vZGUsIGlzU1ZHKSwgZWxlbWVudClcbiAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSAhPSBudWxsICYmIG5vZGUudHlwZSA9PT0gb2xkTm9kZS50eXBlKSB7XG4gICAgICB1cGRhdGVFbGVtZW50KGVsZW1lbnQsIG9sZE5vZGUucHJvcHMsIG5vZGUucHJvcHMpXG5cbiAgICAgIGlzU1ZHID0gaXNTVkcgfHwgbm9kZS50eXBlID09PSBcInN2Z1wiXG5cbiAgICAgIHZhciBsZW4gPSBub2RlLmNoaWxkcmVuLmxlbmd0aFxuICAgICAgdmFyIG9sZExlbiA9IG9sZE5vZGUuY2hpbGRyZW4ubGVuZ3RoXG4gICAgICB2YXIgb2xkS2V5ZWQgPSB7fVxuICAgICAgdmFyIG9sZEVsZW1lbnRzID0gW11cbiAgICAgIHZhciBrZXllZCA9IHt9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkTGVuOyBpKyspIHtcbiAgICAgICAgdmFyIG9sZEVsZW1lbnQgPSAob2xkRWxlbWVudHNbaV0gPSBlbGVtZW50LmNoaWxkTm9kZXNbaV0pXG4gICAgICAgIHZhciBvbGRDaGlsZCA9IG9sZE5vZGUuY2hpbGRyZW5baV1cbiAgICAgICAgdmFyIG9sZEtleSA9IGdldEtleShvbGRDaGlsZClcblxuICAgICAgICBpZiAobnVsbCAhPSBvbGRLZXkpIHtcbiAgICAgICAgICBvbGRLZXllZFtvbGRLZXldID0gW29sZEVsZW1lbnQsIG9sZENoaWxkXVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBpID0gMFxuICAgICAgdmFyIGogPSAwXG5cbiAgICAgIHdoaWxlIChqIDwgbGVuKSB7XG4gICAgICAgIHZhciBvbGRFbGVtZW50ID0gb2xkRWxlbWVudHNbaV1cbiAgICAgICAgdmFyIG9sZENoaWxkID0gb2xkTm9kZS5jaGlsZHJlbltpXVxuICAgICAgICB2YXIgbmV3Q2hpbGQgPSBub2RlLmNoaWxkcmVuW2pdXG5cbiAgICAgICAgdmFyIG9sZEtleSA9IGdldEtleShvbGRDaGlsZClcbiAgICAgICAgaWYgKGtleWVkW29sZEtleV0pIHtcbiAgICAgICAgICBpKytcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5ld0tleSA9IGdldEtleShuZXdDaGlsZClcblxuICAgICAgICB2YXIga2V5ZWROb2RlID0gb2xkS2V5ZWRbbmV3S2V5XSB8fCBbXVxuXG4gICAgICAgIGlmIChudWxsID09IG5ld0tleSkge1xuICAgICAgICAgIGlmIChudWxsID09IG9sZEtleSkge1xuICAgICAgICAgICAgcGF0Y2hFbGVtZW50KGVsZW1lbnQsIG9sZEVsZW1lbnQsIG9sZENoaWxkLCBuZXdDaGlsZCwgaXNTVkcpXG4gICAgICAgICAgICBqKytcbiAgICAgICAgICB9XG4gICAgICAgICAgaSsrXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9sZEtleSA9PT0gbmV3S2V5KSB7XG4gICAgICAgICAgICBwYXRjaEVsZW1lbnQoZWxlbWVudCwga2V5ZWROb2RlWzBdLCBrZXllZE5vZGVbMV0sIG5ld0NoaWxkLCBpc1NWRylcbiAgICAgICAgICAgIGkrK1xuICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ZWROb2RlWzBdKSB7XG4gICAgICAgICAgICBlbGVtZW50Lmluc2VydEJlZm9yZShrZXllZE5vZGVbMF0sIG9sZEVsZW1lbnQpXG4gICAgICAgICAgICBwYXRjaEVsZW1lbnQoZWxlbWVudCwga2V5ZWROb2RlWzBdLCBrZXllZE5vZGVbMV0sIG5ld0NoaWxkLCBpc1NWRylcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGF0Y2hFbGVtZW50KGVsZW1lbnQsIG9sZEVsZW1lbnQsIG51bGwsIG5ld0NoaWxkLCBpc1NWRylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBqKytcbiAgICAgICAgICBrZXllZFtuZXdLZXldID0gbmV3Q2hpbGRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB3aGlsZSAoaSA8IG9sZExlbikge1xuICAgICAgICB2YXIgb2xkQ2hpbGQgPSBvbGROb2RlLmNoaWxkcmVuW2ldXG4gICAgICAgIHZhciBvbGRLZXkgPSBnZXRLZXkob2xkQ2hpbGQpXG4gICAgICAgIGlmIChudWxsID09IG9sZEtleSkge1xuICAgICAgICAgIHJlbW92ZUVsZW1lbnQoZWxlbWVudCwgb2xkRWxlbWVudHNbaV0sIG9sZENoaWxkLnByb3BzKVxuICAgICAgICB9XG4gICAgICAgIGkrK1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpIGluIG9sZEtleWVkKSB7XG4gICAgICAgIHZhciBrZXllZE5vZGUgPSBvbGRLZXllZFtpXVxuICAgICAgICB2YXIgcmV1c2FibGVOb2RlID0ga2V5ZWROb2RlWzFdXG4gICAgICAgIGlmICgha2V5ZWRbcmV1c2FibGVOb2RlLnByb3BzLmtleV0pIHtcbiAgICAgICAgICByZW1vdmVFbGVtZW50KGVsZW1lbnQsIGtleWVkTm9kZVswXSwgcmV1c2FibGVOb2RlLnByb3BzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlbGVtZW50ICYmIG5vZGUgIT09IGVsZW1lbnQubm9kZVZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIG9sZE5vZGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgZWxlbWVudC5ub2RlVmFsdWUgPSBub2RlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50ID0gcGFyZW50Lmluc2VydEJlZm9yZShcbiAgICAgICAgICBjcmVhdGVFbGVtZW50KG5vZGUsIGlzU1ZHKSxcbiAgICAgICAgICAobmV4dFNpYmxpbmcgPSBlbGVtZW50KVxuICAgICAgICApXG4gICAgICAgIHJlbW92ZUVsZW1lbnQocGFyZW50LCBuZXh0U2libGluZywgb2xkTm9kZS5wcm9wcylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnRcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGFwcCkge1xuICAgIGZ1bmN0aW9uIHdpcmVWaWV3IChzdGF0ZSwgYWN0aW9ucywgYm91bmRWaWV3cywgZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChwcm9wcywgY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBmbihzdGF0ZSwgYWN0aW9ucywgYm91bmRWaWV3cywgcHJvcHMsIGNoaWxkcmVuKVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGdldFdpcmVkVmlld3Moc3RhdGUsIGFjdGlvbnMsIG9wdHMpIHtcbiAgICAgICAgdmFyIHZpZXdzID0ge31cbiAgICAgICAgZm9yICh2YXIgc2NvcGUgaW4gb3B0cy5tb2R1bGVzIHx8IHt9KSB7XG4gICAgICAgICAgICB2aWV3c1tzY29wZV0gPSBnZXRXaXJlZFZpZXdzKHN0YXRlW3Njb3BlXSwgYWN0aW9uc1tzY29wZV0sIG9wdHMubW9kdWxlc1tzY29wZV0pXG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBvcHRzLnZpZXdzIHx8IHt9KSB7XG4gICAgICAgICAgICB2aWV3c1tuYW1lXSA9IHdpcmVWaWV3KHN0YXRlLCBhY3Rpb25zLCB2aWV3cywgb3B0cy52aWV3c1tuYW1lXSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmlld3NcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG9wdHMsIGNvbnRhaW5lcikge1xuICAgICAgICB2YXIgb3JpZ1ZpZXcgPSBvcHRzLnZpZXdcbiAgICAgICAgaWYgKG9yaWdWaWV3KSB7XG4gICAgICAgICAgICBvcHRzLnZpZXcgPSBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ1ZpZXcoc3RhdGUsIGFjdGlvbnMsIGdldFdpcmVkVmlld3Moc3RhdGUsIGFjdGlvbnMsIG9wdHMpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcHAob3B0cywgY29udGFpbmVyKVxuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhdChjbGFzc2VzLCBwcmVmaXgpIHtcbiAgdmFyIHZhbHVlXG4gIHZhciBjbGFzc05hbWUgPSBcIlwiXG4gIHZhciB0eXBlID0gdHlwZW9mIGNsYXNzZXNcblxuICBpZiAoKGNsYXNzZXMgJiYgdHlwZSA9PT0gXCJzdHJpbmdcIikgfHwgdHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgIHJldHVybiBjbGFzc2VzXG4gIH1cblxuICBwcmVmaXggPSBwcmVmaXggfHwgXCIgXCJcblxuICBpZiAoQXJyYXkuaXNBcnJheShjbGFzc2VzKSAmJiBjbGFzc2VzLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjbGFzc2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoKHZhbHVlID0gY2F0KGNsYXNzZXNbaV0sIHByZWZpeCkpKSB7XG4gICAgICAgIGNsYXNzTmFtZSArPSAoY2xhc3NOYW1lICYmIHByZWZpeCkgKyB2YWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpIGluIGNsYXNzZXMpIHtcbiAgICAgIGlmIChjbGFzc2VzLmhhc093blByb3BlcnR5KGkpICYmICh2YWx1ZSA9IGNsYXNzZXNbaV0pKSB7XG4gICAgICAgIGNsYXNzTmFtZSArPVxuICAgICAgICAgIChjbGFzc05hbWUgJiYgcHJlZml4KSArXG4gICAgICAgICAgaSArXG4gICAgICAgICAgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiA/IGNhdCh2YWx1ZSwgcHJlZml4ICsgaSkgOiBcIlwiKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjbGFzc05hbWVcbn1cbiIsIi8qXG5cbmluIGV2ZW50IG1vZGVcblxucmVuZGVyIGEgY29tcG9uZW50OiBcbiAgaWYgaW4gZXZlbnQgbW9kZTogcmVzZXQgdGhlIHJlZ2lzdHJpZXMgYW5kIGdvIHRvIHJlZ2lzdGVyIG1vZGVcbiAgaWYgaW4gcmVnaXN0ZXIgbW9kZSBkbyBub3RoaW5nXG5cbndoZW4gYW4gZXZlbnQgY29tZXMgaW5cbiAgICBpZiBpbiByZWdpc3RyeSBtb2RlLCBnbyB0byBldmVudCBtb2RlLlxuXG4qL1xudmFyIGxpc3RlbmluZyA9IHRydWVcbnZhciByZWdpc3RyeVxuXG5bJ2tleXVwJywgJ2tleWRvd24nLCAna2V5cHJlc3MnXS5tYXAodHlwZSA9PiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBldiA9PiB7XG4gICAgbGlzdGVuaW5nID0gdHJ1ZVxuICAgIGlmICghcmVnaXN0cnlbdHlwZV1bZXYua2V5XSkgcmV0dXJuXG4gICAgZXYucHJldmVudERlZmF1bHQodHJ1ZSlcbiAgICByZWdpc3RyeVt0eXBlXVtldi5rZXldLm1hcChmbiA9PiBmbihldikpXG59KSlcblxuY29uc3QgS2V5RXZlbnRDb21wb25lbnQgPSB0eXBlID0+ICh7a2V5LCB0aGVufSkgPT4ge1xuICAgIGlmIChsaXN0ZW5pbmcpIHtcbiAgICAgICAgcmVnaXN0cnkgPSB7IGtleXVwOiB7fSwga2V5ZG93bjoge30sIGtleXByZXNzOiB7fSB9XG4gICAgICAgIGxpc3RlbmluZyA9IGZhbHNlXG4gICAgfVxuICAgIHJlZ2lzdHJ5W3R5cGVdW2tleV0gPSByZWdpc3RyeVt0eXBlXVtrZXldIHx8IFtdXG4gICAgcmVnaXN0cnlbdHlwZV1ba2V5XS5wdXNoKHRoZW4pXG59XG5cbmV4cG9ydCBjb25zdCBLZXlQcmVzcyA9IEtleUV2ZW50Q29tcG9uZW50KCdrZXlwcmVzcycpXG5leHBvcnQgY29uc3QgS2V5VXAgPSBLZXlFdmVudENvbXBvbmVudCgna2V5dXAnKVxuZXhwb3J0IGNvbnN0IEtleURvd24gPSBLZXlFdmVudENvbXBvbmVudCgna2V5ZG93bicpXG5cbiIsImltcG9ydCAnLi9zdHlsZS5sZXNzJ1xuaW1wb3J0IHtofSBmcm9tICdoeXBlcmFwcCdcbmltcG9ydCBjYyBmcm9tICdjbGFzc2NhdCdcbmltcG9ydCB7S2V5VXAsIEtleURvd259IGZyb20gJy4uL2NvbXBvbmVudHMva2V5LWV2ZW50cydcblxuY29uc3QgS0VZQk9BUkRfS0VZUyA9IFtcbiAgICAneicsJ3MnLCd4JywnZCcsJ2MnLCd2JyxcbiAgICAnZycsJ2InLCdoJywnbicsJ2onLCdtJyxcbiAgICAncScsJzInLCd3JywnMycsJ2UnLCdyJyxcbiAgICAnNScsJ3QnLCc2JywneScsJzcnLCd1JyxcbiAgICAnaSdcbl1cblxuY29uc3QgS0VZQk9BUkRfQkxBQ0tfS0VZUyA9IFtcbiAgICAncycsICdkJywgJ2cnLCAnaCcsICdqJyxcbiAgICAnMicsICczJywgJzUnLCAnNicsICc3J1xuXVxuXG5jb25zdCBpc0JsYWNrICA9IGNoYXIgPT4gIEtFWUJPQVJEX0JMQUNLX0tFWVMuaW5kZXhPZihjaGFyKSA+IC0xXG5cbmNvbnN0IG5vdGVGb3JDaGFyID0gZnVuY3Rpb24gKGNoYXIpIHtcbiAgICBjb25zdCBuID0gS0VZQk9BUkRfS0VZUy5pbmRleE9mKGNoYXIpXG4gICAgcmV0dXJuIG4gPiAtMSA/IG4gOiBudWxsXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICAgIHN0YXRlOiB7cHJlc3NlZDogbnVsbH0sXG5cbiAgICBhY3Rpb25zOiB7XG4gICAgICAgIHByZXNzZWQ6IChzdGF0ZSwgYWN0aW9ucywgcHJlc3NlZCkgPT4gKHtwcmVzc2VkfSlcbiAgICB9LFxuXG4gICAgdmlld3M6IHtcbiAgICAgICAga2V5Ym9hcmQ6IChzdGF0ZSwgYWN0aW9ucywgdmlld3MsIHByb3BzKSA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXYgPSBjaGFyID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG5vdGUgPSBub3RlRm9yQ2hhcihjaGFyKVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgb25VcCA9IF8gPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhciAhPT0gc3RhdGUucHJlc3NlZCkgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFyID09PSBzdGF0ZS5wcmVzc2VkKSBwcm9wcy5vbnJlbGVhc2Uobm90ZSlcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy5wcmVzc2VkKG51bGwpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgb25Eb3duID0gXyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wcy5jaGFyID09PSBzdGF0ZS5wcmVzc2VkKSByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXIgIT09IHN0YXRlLnByZXNzZWQpIHByb3BzLm9uYXR0YWNrKG5vdGUpICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy5wcmVzc2VkKGNoYXIpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgPGNsYXZcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ubW91c2Vkb3duPXtvbkRvd259XG4gICAgICAgICAgICAgICAgICAgICAgICBvbm1vdXNldXA9e29uVXB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz17Y2Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlOiAhaXNCbGFjayhjaGFyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFjazogaXNCbGFjayhjaGFyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVzc2VkOiBzdGF0ZS5wcmVzc2VkID09PSBjaGFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxjaGFyPntjaGFyLnRvVXBwZXJDYXNlKCl9PC9jaGFyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEtleVVwIGtleT17Y2hhcn0gdGhlbj17b25VcH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxLZXlEb3duIGtleT17Y2hhcn0gdGhlbj17b25Eb3dufSAvPlxuICAgICAgICAgICAgICAgICAgICA8L2NsYXY+XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gPGtleWJvYXJkPntLRVlCT0FSRF9LRVlTLm1hcChjbGF2KX08L2tleWJvYXJkPlxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7aH0gZnJvbSAnaHlwZXJhcHAnXG5pbXBvcnQgY2MgZnJvbSAnY2xhc3NjYXQnXG5cbmV4cG9ydCBjb25zdCBCdXR0b25PcHRpb25zID0gKHtvcHRpb25zLCB2YWx1ZSwgc2V0fSkgPT4gaCgnc3BhbicsIHtjbGFzczogJ2J1dHRvbi1vcHRpb25zJ30sIG9wdGlvbnMubWFwKG8gPT4gaCgnYnV0dG9uJywge1xuICAgIGNsYXNzOiBjYyh7YWN0aXZlOiB2YWx1ZSA9PT0gb30pLFxuICAgIG9uY2xpY2s6IGV2ID0+IHtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQodHJ1ZSlcbiAgICAgICAgc2V0KG8pXG4gICAgfVxufSwgW29dKSkpXG5cbmV4cG9ydCBjb25zdCBTbGlkZXIgPSAoe3ZhbHVlLCBzZXQsIG1pbiwgbWF4LCBzdGVwfSkgPT4gaCgnaW5wdXQnLCB7XG4gICAgdHlwZTogXCJyYW5nZVwiLFxuICAgIG1pbjogbWluIHx8IDAsXG4gICAgbWF4OiBtYXgsXG4gICAgc3RlcDogc3RlcCB8fCBcImFueVwiLFxuICAgIHZhbHVlOiB2YWx1ZSxcbiAgICBvbmlucHV0OiBldiA9PiBzZXQoZXYuY3VycmVudFRhcmdldC52YWx1ZSksXG59KVxuIiwiaW1wb3J0IHtTbGlkZXIsIEJ1dHRvbk9wdGlvbnN9IGZyb20gJy4uL2NvbXBvbmVudHMvY29udHJvbHMnXG5pbXBvcnQge2h9IGZyb20gJ2h5cGVyYXBwJ1xuaW1wb3J0IGNjIGZyb20gJ2NsYXNzY2F0J1xuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgICBvY3RhdmU6IDQsXG4gICAgb3NjaWxsYXRvclR5cGU6ICd0cmlhbmdsZScsXG4gICAgYW1wTGV2ZWw6IDAuMyxcbiAgICBzdXN0YWluTGV2ZWw6IDAuNixcbiAgICBhdHRhY2tUaW1lOiAwLjAyLFxuICAgIGRlY2F5VGltZTogMC4wNCxcbiAgICByZWxlYXNlVGltZTogMC40LFxuICAgIGZpbHRlckN1dG9mZjogNzYwMCxcbiAgICBmaWx0ZXJROiAxMCxcbn1cblxuY29uc3QgT1NDSUxMQVRPUl9UWVBFUyA9IFsnc2F3dG9vdGgnLCAnc3F1YXJlJywgJ3RyaWFuZ2xlJywgJ3NpbmUnXVxuXG5jb25zdCBjb250cm9sTW9kdWxlID0gKHtpbml0aWFsLCB3aWRnZXQ6IFdpZGdldCwgcGFyYW1zLCBuYW1lfSkgPT4gKHtcbiAgICBzdGF0ZToge3ZhbHVlOiBpbml0aWFsfSxcbiAgICBhY3Rpb25zOiB7XG4gICAgICAgIHNldDogKF8sIF9fLCB2YWx1ZSkgPT4gKHt2YWx1ZX0pXG4gICAgfSxcbiAgICB2aWV3czoge1xuICAgICAgICBjb250cm9sOiAoc3RhdGUsIGFjdGlvbnMsIF8sIHtvbnNldH0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHdpZGdldFByb3BzID0gT2JqZWN0LmFzc2lnbihwYXJhbXMsIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogc3RhdGUudmFsdWUsXG4gICAgICAgICAgICAgICAgc2V0OiB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy5zZXQoeClcbiAgICAgICAgICAgICAgICAgICAgb25zZXQgJiYgb25zZXQoeClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbFwiPntuYW1lICsgJzonfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtXaWRnZXQod2lkZ2V0UHJvcHMpfVxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIH1cbn0pXG5cbmV4cG9ydCBjb25zdCBvc2NpbGxhdG9yVHlwZSA9IGNvbnRyb2xNb2R1bGUoe1xuICAgIG5hbWU6ICdPc2NpbGxhdG9yJyxcbiAgICBpbml0aWFsOiBERUZBVUxUUy5vc2NpbGxhdG9yVHlwZSxcbiAgICB3aWRnZXQ6IEJ1dHRvbk9wdGlvbnMsXG4gICAgcGFyYW1zOiB7b3B0aW9uczogT1NDSUxMQVRPUl9UWVBFU31cbn0pXG5cbmV4cG9ydCBjb25zdCBmaWx0ZXJDdXRvZmYgPSBjb250cm9sTW9kdWxlKHtcbiAgICBuYW1lOiAnQ3V0b2ZmJyxcbiAgICBpbml0aWFsOiBERUZBVUxUUy5maWx0ZXJDdXRvZmYsXG4gICAgd2lkZ2V0OiBTbGlkZXIsXG4gICAgcGFyYW1zOiB7IG1pbjogNjAsIG1heDogNzYwMCB9XG59KVxuXG5leHBvcnQgY29uc3Qgb2N0YXZlID0gY29udHJvbE1vZHVsZSh7XG4gICAgbmFtZTogJ09jdGF2ZScsXG4gICAgaW5pdGlhbDogREVGQVVMVFMub2N0YXZlLFxuICAgIHdpZGdldDogU2xpZGVyLFxuICAgIHBhcmFtczogeyBtaW46IDEsIG1heDogNiwgc3RlcDogMSB9XG59KVxuXG5leHBvcnQgY29uc3QgZmlsdGVyUSA9IGNvbnRyb2xNb2R1bGUoe1xuICAgIG5hbWU6ICdSZXNvbmFuY2UnLFxuICAgIGluaXRpYWw6IERFRkFVTFRTLmZpbHRlclEsXG4gICAgd2lkZ2V0OiBTbGlkZXIsXG4gICAgcGFyYW1zOiB7bWF4OiAyMH0sXG59KVxuXG5leHBvcnQgY29uc3QgYXR0YWNrVGltZSA9IGNvbnRyb2xNb2R1bGUoe1xuICAgIG5hbWU6ICdBdHRhY2sgVGltZScsXG4gICAgaW5pdGlhbDogREVGQVVMVFMuYXR0YWNrVGltZSxcbiAgICB3aWRnZXQ6IFNsaWRlcixcbiAgICBwYXJhbXM6IHttYXg6IDAuMn0sXG59KVxuXG5leHBvcnQgY29uc3QgZGVjYXlUaW1lID0gY29udHJvbE1vZHVsZSh7XG4gICAgbmFtZTogJ0RlY2F5IFRpbWUnLFxuICAgIGluaXRpYWw6IERFRkFVTFRTLmRlY2F5VGltZSxcbiAgICB3aWRnZXQ6IFNsaWRlcixcbiAgICBwYXJhbXM6IHttYXg6IDAuMn1cbn0pXG5cbmV4cG9ydCBjb25zdCByZWxlYXNlVGltZSA9IGNvbnRyb2xNb2R1bGUoe1xuICAgIG5hbWU6ICdSZWxlYXNlIFRpbWUnLFxuICAgIGluaXRpYWw6IERFRkFVTFRTLnJlbGVhc2VUaW1lLFxuICAgIHdpZGdldDogU2xpZGVyLFxuICAgIHBhcmFtczoge21heDogMC4yfVxufSlcblxuZXhwb3J0IGNvbnN0IHN1c3RhaW5MZXZlbCA9IGNvbnRyb2xNb2R1bGUoe1xuICAgIG5hbWU6ICdTdXN0YWluIExldmVsJyxcbiAgICBpbml0aWFsOiBERUZBVUxUUy5zdXN0YWluTGV2ZWwsXG4gICAgd2lkZ2V0OiBTbGlkZXIsXG4gICAgcGFyYW1zOiB7bWF4OiAxLjB9LFxufSlcblxuZXhwb3J0IGNvbnN0IGFtcExldmVsID0gY29udHJvbE1vZHVsZSh7XG4gICAgbmFtZTogJ0FtcCBMZXZlbCcsXG4gICAgaW5pdGlhbDogREVGQVVMVFMuYW1wTGV2ZWwsXG4gICAgd2lkZ2V0OiBTbGlkZXIsXG4gICAgcGFyYW1zOiB7bWF4OiAxLjB9LFxufSlcbiIsImltcG9ydCB7aH0gZnJvbSAnaHlwZXJhcHAnXG5pbXBvcnQgY2MgZnJvbSAnY2xhc3NjYXQnXG5pbXBvcnQge1xuICAgIG9jdGF2ZSxcbiAgICBvc2NpbGxhdG9yVHlwZSxcbiAgICBhbXBMZXZlbCxcbiAgICBzdXN0YWluTGV2ZWwsXG4gICAgYXR0YWNrVGltZSxcbiAgICBkZWNheVRpbWUsXG4gICAgcmVsZWFzZVRpbWUsXG4gICAgZmlsdGVyQ3V0b2ZmLFxuICAgIGZpbHRlclEsXG59IGZyb20gJy4vY29udHJvbHMnXG5cblxuY29uc3QgVFVOSU5HX0ZSRVEgPSA0NDA7XG5jb25zdCBUVU5JTkdfTk9URSA9IDY5O1xuXG5cbmZ1bmN0aW9uIG5vdGVUb0h6IChub3RlLCBvY3RhdmUpIHtcbiAgICByZXR1cm4gTWF0aC5leHAgKChvY3RhdmUgKiAxMiArIG5vdGUgIC0gVFVOSU5HX05PVEUpICogTWF0aC5sb2coMikgLyAxMikgKiBUVU5JTkdfRlJFUTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgIHN0YXRlOiB7XG4gICAgICAgIGF1ZGlvQ29udGV4dDogbnVsbCxcbiAgICAgICAgb3NjaWxsYXRvck5vZGU6IG51bGwsXG4gICAgICAgIGZpbHRlck5vZGU6IG51bGwsXG4gICAgICAgIGVudmVsb3BlTm9kZTogbnVsbCxcbiAgICAgICAgYW1wTm9kZTogbnVsbCxcbiAgICAgICAgcGxheWluZzogbnVsbCxcbiAgICB9LFxuICAgIFxuICAgIG1vZHVsZXM6IHtcbiAgICAgICAgb3NjaWxsYXRvclR5cGUsXG4gICAgICAgIG9jdGF2ZSxcbiAgICAgICAgZmlsdGVyQ3V0b2ZmLFxuICAgICAgICBmaWx0ZXJRLFxuICAgICAgICBhdHRhY2tUaW1lLFxuICAgICAgICByZWxlYXNlVGltZSxcbiAgICAgICAgZGVjYXlUaW1lLFxuICAgICAgICBzdXN0YWluTGV2ZWwsXG4gICAgICAgIGFtcExldmVsLFxuICAgIH0sXG5cbiAgICBhY3Rpb25zOiB7XG4gICAgXG4gICAgICAgIGluaXQ6IChzdGF0ZSwgYWN0aW9ucywgY3R4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvc2NpbGxhdG9yID0gY3R4LmNyZWF0ZU9zY2lsbGF0b3IoKVxuICAgICAgICAgICAgb3NjaWxsYXRvci50eXBlID0gc3RhdGUub3NjaWxsYXRvclR5cGUudmFsdWVcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZmlsdGVyID0gY3R4LmNyZWF0ZUJpcXVhZEZpbHRlcigpXG4gICAgICAgICAgICBmaWx0ZXIudHlwZSA9ICdsb3dwYXNzJyxcbiAgICAgICAgICAgIGZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBzdGF0ZS5maWx0ZXJDdXRvZmYudmFsdWVcbiAgICAgICAgICAgIGZpbHRlci5RLnZhbHVlID0gc3RhdGUuZmlsdGVyUS52YWx1ZVxuXG4gICAgICAgICAgICBjb25zdCBlbnZlbG9wZSA9IGN0eC5jcmVhdGVHYWluKClcbiAgICAgICAgICAgIGVudmVsb3BlLmdhaW4udmFsdWUgPSAwXG5cbiAgICAgICAgICAgIGNvbnN0IGFtcGxpZmllciA9IGN0eC5jcmVhdGVHYWluKClcbiAgICAgICAgICAgIGFtcGxpZmllci5nYWluLnZhbHVlID0gc3RhdGUuYW1wTGV2ZWwudmFsdWVcblxuICAgICAgICAgICAgb3NjaWxsYXRvci5jb25uZWN0KGZpbHRlcilcbiAgICAgICAgICAgIGZpbHRlci5jb25uZWN0KGVudmVsb3BlKVxuICAgICAgICAgICAgZW52ZWxvcGUuY29ubmVjdChhbXBsaWZpZXIpXG4gICAgICAgICAgICBhbXBsaWZpZXIuY29ubmVjdChjdHguZGVzdGluYXRpb24pXG4gICAgICAgICAgICBvc2NpbGxhdG9yLnN0YXJ0KClcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBhdWRpb0NvbnRleHQ6IGN0eCxcbiAgICAgICAgICAgICAgICBvc2NpbGxhdG9yLFxuICAgICAgICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICAgICAgICBlbnZlbG9wZSxcbiAgICAgICAgICAgICAgICBhbXBsaWZpZXIsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXR0YWNrOiAoc3RhdGUsIGFjdGlvbnMsIG5vdGUpID0+IHtcbiAgICAgICAgICAgIGlmIChzdGF0ZS5wbGF5aW5nID09PSBub3RlKSByZXR1cm5cbiAgICAgICAgICAgIGNvbnN0IGZyZXEgPSBub3RlVG9Ieihub3RlLCBzdGF0ZS5vY3RhdmUudmFsdWUpXG4gICAgICAgICAgICB2YXIgdCA9IHN0YXRlLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZVxuICAgICAgICAgICAgc3RhdGUub3NjaWxsYXRvci5mcmVxdWVuY3kuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKHQpXG4gICAgICAgICAgICBzdGF0ZS5lbnZlbG9wZS5nYWluLmNhbmNlbFNjaGVkdWxlZFZhbHVlcyh0KVxuICAgICAgICAgICAgdCArPSAwLjAxXG4gICAgICAgICAgICBzdGF0ZS5vc2NpbGxhdG9yLmZyZXF1ZW5jeS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShmcmVxLCB0KVxuICAgICAgICAgICAgc3RhdGUuZW52ZWxvcGUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCB0KVxuICAgICAgICAgICAgdCArPSArc3RhdGUuYXR0YWNrVGltZS52YWx1ZVxuICAgICAgICAgICAgc3RhdGUuZW52ZWxvcGUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgxLCB0KVxuICAgICAgICAgICAgdCArPSArc3RhdGUuZGVjYXlUaW1lLnZhbHVlXG4gICAgICAgICAgICBzdGF0ZS5lbnZlbG9wZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKCtzdGF0ZS5zdXN0YWluTGV2ZWwudmFsdWUsIHQpXG5cbiAgICAgICAgICAgIHJldHVybiB7cGxheWluZzogbm90ZX1cbiAgICAgICAgfSxcblxuICAgICAgICByZWxlYXNlOiAoc3RhdGUsIGFjdGlvbnMsIG5vdGUpID0+IHtcbiAgICAgICAgICAgIGlmIChzdGF0ZS5wbGF5aW5nICE9PSBub3RlKSByZXR1cm5cbiAgICAgICAgICAgIHZhciB0ID0gc3RhdGUuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgMC4wMVxuICAgICAgICAgICAgc3RhdGUuZW52ZWxvcGUuZ2Fpbi5jYW5jZWxTY2hlZHVsZWRWYWx1ZXModClcbiAgICAgICAgICAgIHQgKz0gc3RhdGUucmVsZWFzZVRpbWUudmFsdWVcbiAgICAgICAgICAgIHN0YXRlLmVudmVsb3BlLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgdClcbiAgICAgICAgICAgIHJldHVybiB7cGxheWluZzogbnVsbH1cbiAgICAgICAgfSxcblxuICAgICAgICBzdG9wOiAoc3RhdGUsIGFjdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGlmIChzdGF0ZS5wbGF5aW5nID09PSBudWxsKSByZXR1cm5cbiAgICAgICAgICAgIGFjdGlvbnMucmVsZWFzZShzdGF0ZS5wbGF5aW5nKVxuICAgICAgICB9LFxuXG4gICAgfSxcblxuXG4gICAgdmlld3M6IHtcblxuICAgICAgICBvbnNhdmU6IChzdGF0ZSwgYWN0aW9ucykgPT4gKHtcbiAgICAgICAgICAgIG9zY2lsbGF0b3JUeXBlOiBzdGF0ZS5vc2NpbGxhdG9yVHlwZS52YWx1ZSxcbiAgICAgICAgICAgIG9jdGF2ZTogc3RhdGUub2N0YXZlLnZhbHVlLFxuICAgICAgICAgICAgZmlsdGVyQ3V0b2ZmOiBzdGF0ZS5maWx0ZXJDdXRvZmYudmFsdWUsXG4gICAgICAgICAgICBmaWx0ZXJROiBzdGF0ZS5maWx0ZXJRLnZhbHVlLFxuICAgICAgICAgICAgYXR0YWNrVGltZTogc3RhdGUuYXR0YWNrVGltZS52YWx1ZSxcbiAgICAgICAgICAgIGRlY2F5VGltZTogc3RhdGUuZGVjYXlUaW1lLnZhbHVlLFxuICAgICAgICAgICAgc3VzdGFpbkxldmVsOiBzdGF0ZS5zdXN0YWluTGV2ZWwudmFsdWUsXG4gICAgICAgICAgICByZWxlYXNlVGltZTogc3RhdGUucmVsZWFzZVRpbWUudmFsdWUsXG4gICAgICAgICAgICBhbXBMZXZlbDogc3RhdGUuYW1wTGV2ZWwudmFsdWUsXG4gICAgICAgIH0pLFxuXG4gICAgICAgIG9ubG9hZDogKHN0YXRlLCBhY3Rpb25zLCB2aWV3cywgdmFsdWVzKSA9PiB7XG4gICAgICAgICAgICBhY3Rpb25zLm9zY2lsbGF0b3JUeXBlLnNldCh2YWx1ZXMub3NjaWxsYXRvclR5cGUpXG4gICAgICAgICAgICBhY3Rpb25zLm9jdGF2ZS5zZXQodmFsdWVzLm9jdGF2ZSlcbiAgICAgICAgICAgIGFjdGlvbnMuZmlsdGVyQ3V0b2ZmLnNldCh2YWx1ZXMuZmlsdGVyQ3V0b2ZmKVxuICAgICAgICAgICAgYWN0aW9ucy5maWx0ZXJRLnNldCh2YWx1ZXMuZmlsdGVyUSlcbiAgICAgICAgICAgIGFjdGlvbnMuYXR0YWNrVGltZS5zZXQodmFsdWVzLmF0dGFja1RpbWUpXG4gICAgICAgICAgICBhY3Rpb25zLmRlY2F5VGltZS5zZXQodmFsdWVzLmRlY2F5VGltZSlcbiAgICAgICAgICAgIGFjdGlvbnMuc3VzdGFpbkxldmVsLnNldCh2YWx1ZXMuc3VzdGFpbkxldmVsKVxuICAgICAgICAgICAgYWN0aW9ucy5yZWxlYXNlVGltZS5zZXQodmFsdWVzLnJlbGVhc2VUaW1lKVxuICAgICAgICAgICAgYWN0aW9ucy5hbXBMZXZlbC5zZXQodmFsdWVzLmFtcExldmVsKVxuXG4gICAgICAgICAgICBzdGF0ZS5vc2NpbGxhdG9yLnR5cGUgPSB2YWx1ZXMub3NjaWxsYXRvclR5cGVcbiAgICAgICAgICAgIHN0YXRlLmZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSB2YWx1ZXMuZmlsdGVyQ3V0b2ZmXG4gICAgICAgICAgICBzdGF0ZS5maWx0ZXIuUS52YWx1ZSA9IHZhbHVlcy5maWx0ZXJRXG4gICAgICAgICAgICBzdGF0ZS5hbXBsaWZpZXIuZ2Fpbi52YWx1ZSA9IHZhbHVlcy5hbXBMZXZlbFxuICAgICAgICB9LFxuXG4gICAgICAgIHBhbmVsOiAoc3RhdGUsIGFjdGlvbnMsIHZpZXdzKSA9PiA8c3ludGgtcGFuZWw+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTFcIj5cbiAgICAgICAgICAgICAgICA8dmlld3Mub3NjaWxsYXRvclR5cGUuY29udHJvbCBvbnNldD17diA9PiAoc3RhdGUub3NjaWxsYXRvci50eXBlID0gdil9IC8+XG4gICAgICAgICAgICAgICAgPHZpZXdzLm9jdGF2ZS5jb250cm9sIC8+XG4gICAgICAgICAgICAgICAgPHZpZXdzLmZpbHRlckN1dG9mZi5jb250cm9sIG9uc2V0PXt2ID0+IChzdGF0ZS5maWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gdil9IC8+XG4gICAgICAgICAgICAgICAgPHZpZXdzLmZpbHRlclEuY29udHJvbCBvbnNldD17diA9PiAoc3RhdGUuZmlsdGVyLlEudmFsdWUgPSB2KX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0yXCI+XG4gICAgICAgICAgICAgICAgPHZpZXdzLmF0dGFja1RpbWUuY29udHJvbCAvPlxuICAgICAgICAgICAgICAgIDx2aWV3cy5kZWNheVRpbWUuY29udHJvbCAvPlxuICAgICAgICAgICAgICAgIDx2aWV3cy5zdXN0YWluTGV2ZWwuY29udHJvbCAvPlxuICAgICAgICAgICAgICAgIDx2aWV3cy5yZWxlYXNlVGltZS5jb250cm9sIC8+XG4gICAgICAgICAgICAgICAgPHZpZXdzLmFtcExldmVsLmNvbnRyb2wgb25zZXQ9e3YgPT4gKHN0YXRlLmFtcGxpZmllci5nYWluLnZhbHVlID0gdil9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zeW50aC1wYW5lbD5cbiAgICB9XG59IiwiaW1wb3J0ICcuL3N0eWxlLmxlc3MnXG5pbXBvcnQge2h9IGZyb20gJ2h5cGVyYXBwJ1xuaW1wb3J0IGNjIGZyb20gJ2NsYXNzY2F0J1xuaW1wb3J0IHN5bnRoIGZyb20gJy4vc3ludGgnXG5cbmNvbnN0IGluZGljZXMgPSBbLi4uQXJyYXkoOCkua2V5cygpXVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgbW9kdWxlczoge1xuICAgICAgICAwOiBzeW50aCxcbiAgICAgICAgMTogc3ludGgsXG4gICAgICAgIDI6IHN5bnRoLFxuICAgICAgICAzOiBzeW50aCxcbiAgICAgICAgNDogc3ludGgsXG4gICAgICAgIDU6IHN5bnRoLFxuICAgICAgICA2OiBzeW50aCxcbiAgICAgICAgNzogc3ludGgsXG4gICAgfSxcblxuICAgIHN0YXRlOiB7IHNlbGVjdGVkOiAwIH0sXG4gICAgXG4gICAgYWN0aW9uczoge1xuICAgICAgICBzZWxlY3Q6IChzdGF0ZSwgYWN0aW9ucywgdm9pY2UpID0+ICh7c2VsZWN0ZWQ6IHZvaWNlfSksXG4gICAgICAgIFxuICAgICAgICBpbml0OiAoc3RhdGUsIGFjdGlvbnMsIHZvaWNlcykgPT4ge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKClcbiAgICAgICAgICAgIGluZGljZXMuZm9yRWFjaChpID0+IGFjdGlvbnNbaV0uaW5pdChjdHgpKVxuICAgICAgICB9LFxuICAgIH0sXG4gICAgXG4gICAgdmlld3M6IHtcbiAgICAgICAgZ2V0U2VsZWN0ZWQ6IHN0YXRlID0+IHN0YXRlLnNlbGVjdGVkLFxuXG4gICAgICAgIHNlbGVjdDogKHN0YXRlLCBhY3Rpb25zLCB2aWV3cywgdm9pY2UpID0+IGFjdGlvbnMuc2VsZWN0KHZvaWNlKSxcblxuICAgICAgICBzdG9wQWxsOiAoc3RhdGUsIGFjdGlvbnMpID0+IGluZGljZXMubWFwKGkgPT4gYWN0aW9uc1tpXS5zdG9wKCkpLFxuXG4gICAgICAgIGF0dGFjazogKHN0YXRlLCBhY3Rpb25zLCB2aWV3cywgbm90ZSkgPT4gYWN0aW9uc1tzdGF0ZS5zZWxlY3RlZF0uYXR0YWNrKG5vdGUpLFxuXG4gICAgICAgIHJlbGVhc2U6IChzdGF0ZSwgYWN0aW9ucywgdmlld3MsIG5vdGUpID0+IGFjdGlvbnNbc3RhdGUuc2VsZWN0ZWRdLnJlbGVhc2Uobm90ZSksXG5cbiAgICAgICAgYXR0YWNrVm9pY2U6IChzdGF0ZSwgYWN0aW9ucywgdmlld3MsIHtub3RlLCB2b2ljZX0pID0+IGFjdGlvbnNbdm9pY2VdLmF0dGFjayhub3RlKSxcblxuICAgICAgICByZWxlYXNlVm9pY2U6IChzdGF0ZSwgYWN0aW9ucywgdmlld3MsIHtub3RlLCB2b2ljZX0pID0+IGFjdGlvbnNbdm9pY2VdLnJlbGVhc2Uobm90ZSksICAgIFxuXG4gICAgICAgIG9ubG9hZDogKHN0YXRlLCBhY3Rpb25zLCB2aWV3cywgZGF0YSkgPT4gaW5kaWNlcy5mb3JFYWNoKHZvaWNlID0+IHZpZXdzW3ZvaWNlXS5vbmxvYWQoZGF0YVt2b2ljZV0pKSxcblxuICAgICAgICBvbnNhdmU6IChzdGF0ZSwgYWN0aW9ucywgdmlld3MpID0+IGluZGljZXMubWFwKHZvaWNlID0+IHZpZXdzW3ZvaWNlXS5vbnNhdmUoKSksXG5cbiAgICAgICAgcGFuZWw6IChzdGF0ZSwgYWN0aW9ucywgdmlld3MpID0+IHZpZXdzW3N0YXRlLnNlbGVjdGVkXS5wYW5lbCgpLFxuICAgICAgICBcbiAgICAgICAgc2VsZWN0b3I6IChzdGF0ZSwgYWN0aW9ucywgdmlld3MpID0+IChcbiAgICAgICAgICAgIDx2b2ljZS1zZWxlY3Rvcj5cbiAgICAgICAgICAgICAgICB7aW5kaWNlcy5tYXAoaSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIG9ubW91c2Vkb3duPXtfID0+IGFjdGlvbnMuc2VsZWN0KGkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9e2NjKHthY3RpdmU6IHN0YXRlLnNlbGVjdGVkID09PSBpfSl9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIFZvaWNlIHtpICsgMX1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L3ZvaWNlLXNlbGVjdG9yPlxuICAgICAgICApLFxuICAgIH1cbn0iLCJcbnZhciBsaXN0ZW5pbmcgPSB0cnVlXG52YXIgcmVnaXN0cnlcblxuWydtb3VzZXVwJywgJ21vdXNlZG93bicsICdtb3VzZW1vdmUnXS5tYXAodHlwZSA9PiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBldiA9PiB7XG4gICAgbGlzdGVuaW5nID0gdHJ1ZVxuICAgIHJlZ2lzdHJ5W3R5cGVdLm1hcChmbiA9PiBmbihldikpXG59KSlcblxuY29uc3QgTW91c2VFdmVudENvbXBvbmVudCA9IHR5cGUgPT4gKHt0aGVufSkgPT4ge1xuICAgIGlmIChsaXN0ZW5pbmcpIHtcbiAgICAgICAgcmVnaXN0cnkgPSB7IG1vdXNldXA6IFtdLCBtb3VzZWRvd246IFtdLCBtb3VzZW1vdmU6IFtdIH1cbiAgICAgICAgbGlzdGVuaW5nID0gZmFsc2VcbiAgICB9XG4gICAgcmVnaXN0cnlbdHlwZV0ucHVzaCh0aGVuKVxufVxuXG5leHBvcnQgY29uc3QgTW91c2VNb3ZlID0gTW91c2VFdmVudENvbXBvbmVudCgnbW91c2Vtb3ZlJylcbmV4cG9ydCBjb25zdCBNb3VzZURvd24gPSBNb3VzZUV2ZW50Q29tcG9uZW50KCdtb3VzZWRvd24nKVxuZXhwb3J0IGNvbnN0IE1vdXNlVXAgICA9IE1vdXNlRXZlbnRDb21wb25lbnQoJ21vdXNldXAnKVxuXG4iLCJpbXBvcnQgY2MgZnJvbSAnY2xhc3NjYXQnXG5pbXBvcnQge2h9IGZyb20gJ2h5cGVyYXBwJ1xuaW1wb3J0IHtLZXlEb3dufSBmcm9tICcuLi9jb21wb25lbnRzL2tleS1ldmVudHMnXG5pbXBvcnQge01vdXNlVXB9IGZyb20gJy4uL2NvbXBvbmVudHMvbW91c2UtZXZlbnRzJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgXG4gICAgc3RhdGU6IHtcbiAgICAgICAgc3RhcnQ6IC0xLFxuICAgICAgICBlbmQ6IC0xLFxuICAgICAgICBzZWxlY3Rpbmc6IGZhbHNlLFxuICAgICAgICBjb2w6IG51bGwsXG4gICAgfSxcblxuICAgIGFjdGlvbnM6IHtcblxuICAgICAgICByZXNldDogXyA9PiAoe1xuICAgICAgICAgICAgc3RhcnQ6IC0xLFxuICAgICAgICAgICAgZW5kOiAtMSxcbiAgICAgICAgICAgIHNlbGVjdGluZzogZmFsc2UsXG4gICAgICAgIH0pLFxuXG4gICAgICAgIHN0YXJ0OiAoc3RhdGUsIGFjdGlvbnMsIHtyb3csIGNvbH0pID0+ICh7XG4gICAgICAgICAgICBzZWxlY3Rpbmc6IHRydWUsXG4gICAgICAgICAgICBzdGFydDogcm93LFxuICAgICAgICAgICAgZW5kOiByb3csXG4gICAgICAgICAgICBjb2wsXG4gICAgICAgIH0pLFxuXG4gICAgICAgIHNldDogKHN0YXRlLCBhY3Rpb25zLCB7cm93fSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFzdGF0ZS5zZWxlY3RpbmcpIHJldHVyblxuICAgICAgICAgICAgcmV0dXJuICh7ZW5kOiByb3d9KVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0b3A6IChzdGF0ZSwgYWN0aW9ucykgPT4gKHtzZWxlY3Rpbmc6IGZhbHNlfSksXG5cbiAgICB9LFxuXG4gICAgdmlld3M6IHtcbiAgICAgICAgXG4gICAgICAgIHNldE5vdGU6IChzdGF0ZSwgYWN0aW9ucywgdmlld3MsIHt2YWx1ZSwgZ3JpZH0pID0+IHtcbiAgICAgICAgICAgIGlmIChzdGF0ZS5zdGFydCA9PT0gLTEpIHJldHVyblxuICAgICAgICAgICAgY29uc3Qge3N0YXJ0LCBlbmR9ID0gc3RhdGVcbiAgICAgICAgICAgIGNvbnN0IFtmcm9tLCB0b10gPSBzdGFydCA8IGVuZCA/IFtzdGFydCwgZW5kXSA6IFtlbmQsIHN0YXJ0XSBcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBmcm9tOyBpIDw9IHRvOyBpKyspIHtcbiAgICAgICAgICAgICAgICBncmlkW2ldW3N0YXRlLmNvbF0gPSB2YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWN0aW9ucy5yZXNldCgpXG4gICAgICAgICAgICByZXR1cm4gZ3JpZFxuICAgICAgICB9LFxuXG4gICAgICAgIGlzU2VsZWN0ZWQ6IChzdGF0ZSwgYWN0aW9ucywgdmlld3MsIHtyb3csIGNvbH0pID0+wqB7XG4gICAgICAgICAgICByZXR1cm4gIChcbiAgICAgICAgICAgICAgICBjb2wgPT09IHN0YXRlLmNvbCAmJlxuICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICAgKCByb3cgPj0gc3RhdGUuc3RhcnQgJiYgcm93IDw9IHN0YXRlLmVuZCApIHx8XG4gICAgICAgICAgICAgICAgICAgICggcm93IDw9IHN0YXRlLnN0YXJ0ICYmIHJvdyA+PSBzdGF0ZS5lbmQgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgfSxcblxuICAgICAgICBzZWxlY3RhYmxlOiAoc3RhdGUsIGFjdGlvbnMsIHZpZXdzLCB7cm93LCBjb2wsIG9uY29sfSwgY2hpbGRyZW4pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZHJlbi5tYXAobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgbm9kZS5wcm9wcy5jbGFzcyA9IGNjKFtub2RlLnByb3BzLmNsYXNzLCB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkOiB2aWV3cy5pc1NlbGVjdGVkKHtyb3csIGNvbH0pXG4gICAgICAgICAgICAgICAgfV0pXG4gICAgICAgICAgICAgICAgbm9kZS5wcm9wcy5vbm1vdXNlZG93biA9IGV2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQodHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgb25jb2woY29sKVxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnN0YXJ0KHtyb3csIGNvbH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5vZGUucHJvcHMub25tb3VzZW1vdmUgPSBldiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KHRydWUpXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnMuc2V0KHtyb3d9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICBjbGVhckJ1dHRvbjogKHN0YXRlLCBhY3Rpb25zLCB2aWV3cywge2dyaWR9KSA9PiBbXG4gICAgICAgICAgICA8TW91c2VVcCB0aGVuPXthY3Rpb25zLnN0b3B9IC8+LFxuICAgICAgICAgICAgPEtleURvd24ga2V5PVwiIFwiIHRoZW49e18gPT4gdmlld3Muc2V0Tm90ZSh7bm90ZTogbnVsbCwgZ3JpZH0pfSAvPixcbiAgICAgICAgICAgIDxidXR0b24gb25tb3VzZWRvd249e18gPT4gdmlld3Muc2V0Tm90ZSh7bm90ZTogbnVsbCwgZ3JpZH0pfT5YPC9idXR0b24+LFxuICAgICAgICBdLFxuXG4gICAgfVxufVxuXG4gICAgIiwiaW1wb3J0IHtofSBmcm9tICdoeXBlcmFwcCdcbmltcG9ydCBjYyBmcm9tICdjbGFzc2NhdCdcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHN0YXRlOiB7XG4gICAgICAgIG9uOiBmYWxzZSxcbiAgICAgICAgbm90ZTogbnVsbCxcbiAgICAgICAgdm9pY2U6IG51bGwsXG4gICAgfSxcbiAgICBhY3Rpb25zOiB7XG4gICAgICAgIHN0YXJ0OiBfID0+ICh7b246IHRydWV9KSxcbiAgICAgICAgc3RvcDogXyA9PiAoe29uOiBmYWxzZX0pLFxuICAgICAgICBzZXROb3RlOiAoc3RhdGUsIGFjdGlvbnMsIHtub3RlLCB2b2ljZX0pID0+ICh7bm90ZSwgdm9pY2V9KSxcbiAgICAgICAgYXR0YWNrOiAoc3RhdGUsIGFjdGlvbnMsIHtub3RlLCB2b2ljZX0pID0+IHtcbiAgICAgICAgICAgIGlmICghc3RhdGUub24pIHJldHVyblxuICAgICAgICAgICAgaWYgKG5vdGUgPT09IHN0YXRlLm5vdGUpIHJldHVyblxuICAgICAgICAgICAgaWYgKHZvaWNlID09PSBzdGF0ZS52b2ljZSkgcmV0dXJuXG4gICAgICAgICAgICByZXR1cm4ge25vdGUsIHZvaWNlfVxuICAgICAgICB9LFxuICAgICAgICByZWxlYXNlOiAoc3RhdGUsIGFjdGlvbnMsIHtub3RlLCB2b2ljZX0pID0+IHtcbiAgICAgICAgICAgIGlmIChub3RlICE9PSBzdGF0ZS5ub3RlKSByZXR1cm5cbiAgICAgICAgICAgIHJldHVybiB7bm90ZTogbnVsbCwgdm9pY2U6IG51bGx9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHZpZXdzOiB7XG4gICAgICAgIGF0dGFjazogKHN0YXRlLCBhY3Rpb25zLCB2aWV3cywge25vdGUsIHZvaWNlfSkgPT4gYWN0aW9ucy5zZXROb3RlKHtub3RlLCB2b2ljZX0pLFxuICAgICAgICByZWxlYXNlOiAoc3RhdGUsIGFjdGlvbnMsIHZpZXdzLCB7bm90ZSwgdm9pY2V9KSA9PiBhY3Rpb25zLnNldE5vdGUoe25vdGU6IG51bGwsIHZvaWNlOiBudWxsfSksXG4gICAgICAgIHN0YXJ0OiAoc3RhdGUsIGFjdGlvbnMpID0+IGFjdGlvbnMuc3RhcnQoKSxcbiAgICAgICAgc3RvcDogKHN0YXRlLCBhY3Rpb25zKSA9PiBhY3Rpb25zLnN0b3AoKSxcbiAgICAgICAgcmVjb3JkQnV0dG9uOiAoc3RhdGUsIGFjdGlvbnMsIHZpZXdzLCB7b25zdGFydH0pID0+IChcbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBvbm1vdXNlZG93bj17XyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnMuc3RhcnQoKVxuICAgICAgICAgICAgICAgICAgICBvbnN0YXJ0ICYmIG9uc3RhcnQoKVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgY2xhc3M9e2NjKHthY3RpdmU6IHN0YXRlLm9ufSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgUmVjXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKVxuICAgIH1cbn0iLCJleHBvcnQgY29uc3QgTlVNX1RJTUVTID0gMzJcbmV4cG9ydCBjb25zdCBUSU1FU1RFUCA9IDEwMFxuZXhwb3J0IGNvbnN0IE5PVEVfTkFNRVMgPSBbXG4gICAgJ0MnLCAnQyMnLCAnRCcsICdFYicsXG4gICAgJ0UnLCAnRicsICdGIycsICdHJyxcbiAgICAnQWInLCAnQScsICdCYicsICdCJyxcbiAgICAnQycsICdDIycsICdEJywgJ0ViJyxcbiAgICAnRScsICdGJywgJ0YjJywgJ0cnLFxuICAgICdBYicsICdBJywgJ0JiJywgJ0InLFxuICAgICdDJ1xuXVxuXG4iLCJpbXBvcnQge2h9IGZyb20gJ2h5cGVyYXBwJ1xuaW1wb3J0IGNjIGZyb20gJ2NsYXNzY2F0J1xuaW1wb3J0IHtUSU1FU1RFUCwgTlVNX1RJTUVTfSBmcm9tICcuL2NvbnN0J1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgc3RhdGU6IHtcbiAgICAgICAgb246IGZhbHNlLFxuICAgICAgICBpbnRlcnZhbDogbnVsbCxcbiAgICAgICAgdGltZTogMCxcbiAgICB9LFxuXG4gICAgYWN0aW9uczoge1xuICAgICAgICBcbiAgICAgICAgc3RhcnQ6IChzdGF0ZSwgYWN0aW9ucykgPT4ge1xuICAgICAgICAgICAgaWYoc3RhdGUub24pIHJldHVyblxuICAgICAgICAgICAgcmV0dXJuICh7XG4gICAgICAgICAgICAgICAgb246IHRydWUsXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6IHNldEludGVydmFsKGFjdGlvbnMuYWR2YW5jZSwgVElNRVNURVApXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgc3RvcDogKHN0YXRlLCBhY3Rpb25zKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXN0YXRlLm9uKSByZXR1cm5cbiAgICAgICAgICAgIHN0YXRlLmludGVydmFsICYmIGNsZWFySW50ZXJ2YWwoc3RhdGUuaW50ZXJ2YWwpXG4gICAgICAgICAgICByZXR1cm4gKHsgb246IGZhbHNlLCBpbnRlcnZhbDogbnVsbCB9KVxuICAgICAgICB9LFxuXG4gICAgICAgIGFkdmFuY2U6IChzdGF0ZSwgYWN0aW9ucykgPT4gKHt0aW1lOiAoc3RhdGUudGltZSArIDEpICUgTlVNX1RJTUVTfSksXG5cbiAgICAgICAgc2V0VGltZTogKHN0YXRlLCBhY3Rpb25zLCB0aW1lKSA9PiAoe3RpbWV9KSxcbiAgICB9LFxuXG4gICAgdmlld3M6IHtcblxuICAgICAgICBzdGFydDogKHN0YXRlLCBhY3Rpb25zKSA9PiBhY3Rpb25zLnN0YXJ0KCksXG5cbiAgICAgICAgc3RvcDogKHN0YXRlLCBhY3Rpb25zKSA9PiBhY3Rpb25zLnN0b3AoKSxcblxuICAgICAgICBzZXRUaW1lOiAoc3RhdGUsIGFjdGlvbnMsIHZpZXdzLCB0aW1lKSA9PiAoe3RpbWV9KSxcblxuICAgICAgICBub3dQbGF5aW5nOiAoc3RhdGUsIGFjdGlvbnMsIHZpZXdzLCB0aW1lKSA9PiB0aW1lID09PSBzdGF0ZS50aW1lLFxuXG4gICAgICAgIHBsYXk6IChzdGF0ZSwgYWN0aW9ucywgdmlld3MsIHt0aW1lcywgb25hdHRhY2ssIG9ucmVsZWFzZX0pID0+IHtcbiAgICAgICAgICAgIGlmICghc3RhdGUub24pIHJldHVyblxuICAgICAgICAgICAgY29uc3Qgbm90ZXMgPSB0aW1lc1tzdGF0ZS50aW1lXVxuICAgICAgICAgICAgY29uc3QgcHJldiA9IHRpbWVzWyhzdGF0ZS50aW1lICsgTlVNX1RJTUVTIC0gMSkgJSBOVU1fVElNRVNdXG4gICAgICAgICAgICBub3Rlcy5mb3JFYWNoKChub3RlLCB2b2ljZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChub3RlID09PSBwcmV2W3ZvaWNlXSkgcmV0dXJuXG4gICAgICAgICAgICAgICAgaWYgKG5vdGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgb25hdHRhY2soe3ZvaWNlLCBub3RlfSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvbnJlbGVhc2Uoe3ZvaWNlLCBub3RlOiBwcmV2W3ZvaWNlXX0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICBzdGFydEJ1dHRvbjogKHN0YXRlLCBhY3Rpb25zLCB2aWV3cywge29uc3RhcnR9KSA9PiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25tb3VzZWRvd249e18gPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUub24pIHJldHVyblxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnN0YXJ0KClcbiAgICAgICAgICAgICAgICAgICAgb25zdGFydCAmJiBvbnN0YXJ0KClcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIGNsYXNzPXtjYyh7YWN0aXZlOiBzdGF0ZS5vbn0pfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIFBsYXlcbiAgICAgICAgICAgIDwvYnV0dG9uPiAgXG4gICAgICAgICksXG5cbiAgICAgICAgc3RvcEJ1dHRvbjogKHN0YXRlLCBhY3Rpb25zLCB2aWV3cywge29uc3RvcH0pID0+IChcbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBvbm1vdXNlZG93bj17XyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RhdGUub24pIHJldHVyblxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnN0b3AoKVxuICAgICAgICAgICAgICAgICAgICBvbnN0b3AgJiYgb25zdG9wKClcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIFN0b3BcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApLFxuICAgIH1cbn0iLCJpbXBvcnQgJy4vc3R5bGUubGVzcydcbmltcG9ydCB7aH0gZnJvbSAnaHlwZXJhcHAnXG5pbXBvcnQgY2MgZnJvbSAnY2xhc3NjYXQnXG5pbXBvcnQgc2VsZWN0aW9uIGZyb20gJy4vc2VsZWN0aW9uJ1xuaW1wb3J0IHJlY29yZGluZyBmcm9tICcuL3JlY29yZGluZydcbmltcG9ydCBwbGF5YmFjayBmcm9tICcuL3BsYXliYWNrJ1xuaW1wb3J0IHtOVU1fVElNRVMsIE5PVEVfTkFNRVN9IGZyb20gJy4vY29uc3QnXG5cbi8qXG5UT0RPOlxubW92ZSBzZXRSZWNvcmRlZE5vdGUsIHNldE5vdGVPblNlbGVjdGlvblxudGhlbiBtb3ZlIGJ1dHRvbnMgYW5kIHN0dWZmIHRvIHJlc3BlY3RpdmUgbW9kdWxlcy5cbihtZWFucyBtb3ZpbmcgYXR0YWNrIGFuZCByZWxlYXNlIHRvIHZpZXdzLCBwZXJoYXBzIGhhdmUgYXMgYSBnZW5lcmFsIHJ1bGUgdG8gb25seSBjYWxsIG90aGVyIG1vZHVsZXMgdmlld3NcbmluIHZpZXdzKVxuKi9cblxuXG5mdW5jdGlvbiBub3RlTmFtZSAobm90ZSkge1xuICAgIGlmIChub3RlID09PSBudWxsKSByZXR1cm4gJydcbiAgICByZXR1cm4gTk9URV9OQU1FU1tub3RlXVxufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgbW9kdWxlczoge1xuICAgICAgICBzZWxlY3Rpb24sXG4gICAgICAgIHJlY29yZGluZyxcbiAgICAgICAgcGxheWJhY2ssXG4gICAgfSxcblxuICAgIHN0YXRlOiB7XG4gICAgICAgIHRpbWVzOiBbLi4uQXJyYXkoTlVNX1RJTUVTKS5rZXlzKCldLm1hcChfID0+IFsuLi5BcnJheSg4KS5rZXlzKCldLm1hcChfID0+IG51bGwpKSxcbiAgICB9LFxuXG4gICAgYWN0aW9uczoge1xuXG4gICAgICAgIHNldFRpbWVzOiAoc3RhdGUsIGFjdGlvbnMsIHRpbWVzKSA9PiB7IGlmICh0aW1lcykgcmV0dXJuIHt0aW1lc30gfSxcblxuICAgICAgICBzZXRSZWNvcmRlZE5vdGU6IChzdGF0ZSwgYWN0aW9ucykgPT4ge1xuICAgICAgICAgICAgaWYgKCFzdGF0ZS5yZWNvcmRpbmcub24pIHJldHVyblxuICAgICAgICAgICAgaWYgKHN0YXRlLnJlY29yZGluZy5ub3RlID09PSBudWxsKSByZXR1cm5cbiAgICAgICAgICAgIHN0YXRlLnRpbWVzW3N0YXRlLnBsYXliYWNrLnRpbWVdW3N0YXRlLnJlY29yZGluZy52b2ljZV0gPSBzdGF0ZS5yZWNvcmRpbmcubm90ZVxuICAgICAgICAgICAgYWN0aW9ucy5zZXRUaW1lcyhzdGF0ZS50aW1lcylcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgdmlld3M6IHtcblxuICAgICAgICBhdHRhY2s6IChzdGF0ZSwgYWN0aW9ucywge3NlbGVjdGlvbiwgcmVjb3JkaW5nfSwge25vdGUsIHZvaWNlfSkgPT4ge1xuICAgICAgICAgICAgYWN0aW9ucy5zZXRUaW1lcyhzZWxlY3Rpb24uc2V0Tm90ZSh7Z3JpZDogc3RhdGUudGltZXMsIHZhbHVlOiBub3RlfSkpXG4gICAgICAgICAgICByZWNvcmRpbmcuYXR0YWNrKHtub3RlLCB2b2ljZX0pXG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVsZWFzZTogKHN0YXRlLCBhY3Rpb25zLCB7cmVjb3JkaW5nfSwge25vdGUsIHZvaWNlfSkgPT4ge1xuICAgICAgICAgICAgcmVjb3JkaW5nLnJlbGVhc2Uoe25vdGUsIHZvaWNlfSlcbiAgICAgICAgfSxcblxuICAgICAgICBvbnNhdmU6ICh7dGltZXN9KSA9PiB0aW1lcyxcblxuICAgICAgICBvbmxvYWQ6IChzdGF0ZSwgYWN0aW9ucywgdmlld3MsIHRpbWVzKSA9PiBhY3Rpb25zLnNldFRpbWVzKHRpbWVzKSxcblxuICAgICAgICBncmlkOiAoc3RhdGUsIGFjdGlvbnMsIHtwbGF5YmFjaywgc2VsZWN0aW9ufSwge29uYXR0YWNrLCBvbnJlbGVhc2UsIG9uc2VsZWN0Vm9pY2V9KSA9PiB7XG4gICAgICAgICAgICBwbGF5YmFjay5wbGF5KHt0aW1lczogc3RhdGUudGltZXMsIG9uYXR0YWNrLCBvbnJlbGVhc2V9KVxuICAgICAgICAgICAgYWN0aW9ucy5zZXRSZWNvcmRlZE5vdGUoKVxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJzZXF1ZW5jZXJcIj5cbiAgICAgICAgICAgICAgICB7c3RhdGUudGltZXMubWFwKCh2b2ljZXMsIHRpbWUpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwidGltZVwiIG9uY2xpY2s9e18gPT4gcGxheWJhY2suc2V0VGltZSh0aW1lKX0+e3RpbWV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt2b2ljZXMubWFwKChub3RlLCB2b2ljZSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3Rpb24uc2VsZWN0YWJsZSByb3c9e3RpbWV9IGNvbD17dm9pY2V9IG9uY29sPXtvbnNlbGVjdFZvaWNlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPXtjYyh7cGxheWluZzogcGxheWJhY2subm93UGxheWluZyh0aW1lKX0pfT57bm90ZU5hbWUobm90ZSl9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdGlvbi5zZWxlY3RhYmxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIClcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIGNvbnRyb2xzOiAoc3RhdGUsIGFjdGlvbnMsIHtwbGF5YmFjaywgcmVjb3JkaW5nLCBzZWxlY3Rpb259LCB7b25zdG9wfSkgPT4gKFxuICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgPHJlY29yZGluZy5yZWNvcmRCdXR0b24gb25zdGFydD17cGxheWJhY2suc3RhcnR9Lz5cbiAgICAgICAgICAgICAgICA8cGxheWJhY2suc3RhcnRCdXR0b24gLz5cbiAgICAgICAgICAgICAgICA8cGxheWJhY2suc3RvcEJ1dHRvbiBvbnN0b3A9e18gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWNvcmRpbmcuc3RvcCgpXG4gICAgICAgICAgICAgICAgICAgIG9uc3RvcCAmJiBvbnN0b3AoKVxuICAgICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICAgICAgPHNlbGVjdGlvbi5jbGVhckJ1dHRvbiBncmlkPXtzdGF0ZS50aW1lc30gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKVxuICAgIH1cbn1cbiIsImltcG9ydCAnLi9zdHlsZS5sZXNzJ1xuaW1wb3J0IHthcHAsIGh9IGZyb20gJ2h5cGVyYXBwJ1xuaW1wb3J0IHZpZXdzIGZyb20gJ2h5cGVyYXBwLW1vZHVsZS12aWV3cydcblxuaW1wb3J0IGtleWJvYXJkIGZyb20gJy4va2V5Ym9hcmQnXG5pbXBvcnQgc291bmRiYW5rIGZyb20gJy4vc291bmRiYW5rJ1xuaW1wb3J0IHNlcXVlbmNlciBmcm9tICcuL3NlcXVlbmNlcidcblxudmlld3MoYXBwKSh7XG4gICAgXG4gICAgbW9kdWxlczoge1xuICAgICAgICBrZXlib2FyZCxcbiAgICAgICAgc291bmRiYW5rLFxuICAgICAgICBzZXF1ZW5jZXJcbiAgICB9LFxuXG4gICAgdmlld3M6IHtcbiAgICAgICAgbG9hZFN0YXRlOiAoc3RhdGUsIGFjdGlvbnMsIHZpZXdzKSA9PiB7XG4gICAgICAgICAgICBhY3Rpb25zLnNvdW5kYmFuay5pbml0KClcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnU1lOVEhEQVRBJylcbiAgICAgICAgICAgIGlmICghZGF0YSkgcmV0dXJuXG4gICAgICAgICAgICBjb25zdCB7dm9pY2VzLCBub3Rlc30gPSBKU09OLnBhcnNlKGRhdGEpXG4gICAgICAgICAgICBpZiAodm9pY2VzKSB2aWV3cy5zb3VuZGJhbmsub25sb2FkKHZvaWNlcylcbiAgICAgICAgICAgIGlmIChub3Rlcykgdmlld3Muc2VxdWVuY2VyLm9ubG9hZChub3RlcylcbiAgICAgICAgfSxcblxuICAgICAgICBzYXZlU3RhdGU6IChzdGF0ZSwgYWN0aW9ucywgdmlld3MpID0+IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdTWU5USERBVEEnLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdm9pY2VzOiB2aWV3cy5zb3VuZGJhbmsub25zYXZlKCksXG4gICAgICAgICAgICAgICAgbm90ZXM6IHZpZXdzLnNlcXVlbmNlci5vbnNhdmUoKVxuICAgICAgICAgICAgfSkpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdmlldzogKHN0YXRlLCBhY3Rpb25zLCB7bG9hZFN0YXRlLCBzYXZlU3RhdGUsIGtleWJvYXJkLCBzb3VuZGJhbmssIHNlcXVlbmNlcn0pID0+IChcbiAgICAgICAgPGFwcC1sYXlvdXQgb25jcmVhdGU9e2xvYWRTdGF0ZX0gb251cGRhdGU9e3NhdmVTdGF0ZX0gPlxuICAgICAgICAgICAgPGFwcC1sYXlvdXQtbGVmdD5cbiAgICAgICAgICAgICAgICA8bWFpbi1wYW5lbD5cbiAgICAgICAgICAgICAgICAgICAgPHNlcXVlbmNlci5jb250cm9scyBvbnN0b3A9e3NvdW5kYmFuay5zdG9wQWxsfSAvPlxuICAgICAgICAgICAgICAgICAgICA8c291bmRiYW5rLnNlbGVjdG9yIC8+XG4gICAgICAgICAgICAgICAgICAgIDxzb3VuZGJhbmsucGFuZWwgLz5cbiAgICAgICAgICAgICAgICA8L21haW4tcGFuZWw+XG4gICAgICAgICAgICAgICAgPGtleWJvYXJkLmtleWJvYXJkIFxuICAgICAgICAgICAgICAgICAgICBvbmF0dGFjaz17bm90ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VuZGJhbmsuYXR0YWNrKG5vdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXF1ZW5jZXIuYXR0YWNrKHtub3RlLCB2b2ljZTogc291bmRiYW5rLmdldFNlbGVjdGVkKCkgfSlcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgb25yZWxlYXNlPXtub3RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kYmFuay5yZWxlYXNlKG5vdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXF1ZW5jZXIucmVsZWFzZSh7bm90ZSwgdm9pY2U6IHNvdW5kYmFuay5nZXRTZWxlY3RlZCgpIH0pXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvYXBwLWxheW91dC1sZWZ0PlxuICAgICAgICAgICAgPGFwcC1sYXlvdXQtcmlnaHQ+XG4gICAgICAgICAgICAgICAgPHNlcXVlbmNlci5ncmlkXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkVm9pY2U9e3NvdW5kYmFuay5nZXRTZWxlY3RlZCgpIH1cbiAgICAgICAgICAgICAgICAgICAgb25zZWxlY3RWb2ljZT17aSA9PiBzb3VuZGJhbmsuc2VsZWN0KGkpIH1cbiAgICAgICAgICAgICAgICAgICAgb25hdHRhY2s9eyh7bm90ZSwgdm9pY2V9KSA9PiBzb3VuZGJhbmsuYXR0YWNrVm9pY2Uoe25vdGUsIHZvaWNlfSl9XG4gICAgICAgICAgICAgICAgICAgIG9ucmVsZWFzZT17KHtub3RlLCB2b2ljZX0pID0+IHNvdW5kYmFuay5yZWxlYXNlVm9pY2Uoe25vdGUsIHZvaWNlfSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvYXBwLWxheW91dC1yaWdodD5cbiAgICAgICAgPC9hcHAtbGF5b3V0PlxuICAgICksXG59KVxuXG4iXSwibmFtZXMiOlsiYXJndW1lbnRzIiwiY29uc3QiLCJjYyIsIm9jdGF2ZSIsImxpc3RlbmluZyIsInJlZ2lzdHJ5Iiwic2VsZWN0aW9uIiwicmVjb3JkaW5nIiwicGxheWJhY2siLCJ2aWV3cyIsImtleWJvYXJkIiwic291bmRiYW5rIiwic2VxdWVuY2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJLEVBQUM7QUFDTCxJQUFJLEtBQUssR0FBRyxHQUFFOztBQUVkLEFBQU8sU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTs7O0VBQzdCLElBQUksS0FBSTtFQUNSLElBQUksUUFBUSxHQUFHLEdBQUU7O0VBRWpCLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJO0lBQ3BDLEtBQUssQ0FBQyxJQUFJLENBQUNBLFdBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQztHQUN6Qjs7RUFFRCxPQUFPLEtBQUssQ0FBQyxNQUFNLEVBQUU7SUFDbkIsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRTtNQUN2QyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJO1FBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDO09BQ3BCO0tBQ0YsTUFBTSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO01BQzFELFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxJQUFJLElBQUksRUFBQztLQUNwRTtHQUNGOztFQUVELE9BQU8sT0FBTyxJQUFJLEtBQUssUUFBUTtNQUMz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
