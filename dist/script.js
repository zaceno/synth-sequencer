(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).partial=e()}}(function(){return function e(t,n,r){function o(f,s){if(!n[f]){if(!t[f]){var u="function"==typeof require&&require;if(!s&&u)return u(f,!0);if(i)return i(f,!0);var a=new Error("Cannot find module '"+f+"'");throw a.code="MODULE_NOT_FOUND",a}var c=n[f]={exports:{}};t[f][0].call(c.exports,function(e){var n=t[f][1][e];return o(n||e)},c,c.exports,e,t,n,r)}return n[f].exports}for(var i="function"==typeof require&&require,f=0;f<r.length;f++)o(r[f]);return o}({1:[function(e,t,n){const r=(e,t,n)=>r=>n({[e]:Object.assign(t[e],r)}),o=(e,t)=>(n,o,i)=>f=>{const s=t(n[e],o[e],i),u=r(e,n,f);return"function"==typeof s?s(u):u(s)},i=(e,t)=>{const n={};for(let r in t)n[r]=("function"==typeof t[r]?o:i)(e,t[r]);return n},f=(e,t)=>(n,r,o)=>t(n[e],r[e],o),s=(e,t)=>(n,r,o,...i)=>t(n[e],r[e],o[e],...i),u=e=>{const t={};return{events:{render:(e,n,r)=>(e,n)=>r(e,n,t),"partial:render":(e,n,[r,o])=>r(e,n,t,...o),"partial:register":(n,r,[o,i,f])=>{t[o]=t[o]||{},t[o][i]=((...t)=>e("partial:render",[f,t]))}}}};u.mixin=((e,t)=>n=>{const r=t(n),o={state:{[e]:{}},actions:{[e]:{}},events:{}};o.state[e]=r.state||{},o.actions[e]=i(e,r.actions||{});for(let t in r.events||{})"function"==typeof r.events[t]?o.events[t]=f(e,r.events[t]):o.events[t]=r.events[t].map(t=>f(e,t));for(let t in r.views||{})n("partial:register",[e,t,s(e,r.views[t])]);return o}),t.exports=u},{}]},{},[1])(1)});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.hyperapp={})}(this,function(e){"use strict";function n(e,n){var t,o=[];for(r=arguments.length;r-- >2;)a.push(arguments[r]);for(;a.length;)if(Array.isArray(t=a.pop()))for(r=t.length;r--;)a.push(t[r]);else null!=t&&!0!==t&&!1!==t&&("number"==typeof t&&(t+=""),o.push(t));return"string"==typeof e?{tag:e,data:n||{},children:o}:e(n,o)}function t(e){function n(e,t,r){Object.keys(t||[]).map(function(o){var u=t[o],f=r?r+"."+o:o;"function"==typeof u?e[o]=function(e){i("action",{name:f,data:e});var n=i("resolve",u(p,m,e));return"function"==typeof n?n(a):a(n)}:n(e[o]||(e[o]={}),u,f)})}function t(e){for(x=v(w,x,h,h=i("render",y)(p,m),g=!g);e=o.pop();)e()}function r(){y&&!g&&requestAnimationFrame(t,g=!g)}function a(e){return e&&(e=i("update",u(p,e)))&&r(p=e),p}function i(e,n){return(b[e]||[]).map(function(e){var t=e(p,m,n);null!=t&&(n=t)}),n}function u(e,n){var t={};for(var r in e)t[r]=e[r];for(var r in n)t[r]=n[r];return t}function f(e){if(e&&(e=e.data))return e.key}function c(e,n){if("string"==typeof e)var t=document.createTextNode(e);else{var t=(n=n||"svg"===e.tag)?document.createElementNS("http://www.w3.org/2000/svg",e.tag):document.createElement(e.tag);e.data&&e.data.oncreate&&o.push(function(){e.data.oncreate(t)});for(var r in e.data)l(t,r,e.data[r]);for(var r=0;r<e.children.length;)t.appendChild(c(e.children[r++],n))}return t}function l(e,n,t,r){if("key"===n);else if("style"===n)for(var a in u(r,t=t||{}))e.style[a]=t[a]||"";else{try{e[n]=t}catch(e){}"function"!=typeof t&&(t?e.setAttribute(n,t):e.removeAttribute(n))}}function d(e,n,t){for(var r in u(n,t)){var a=t[r],i="value"===r||"checked"===r?e[r]:n[r];a!==i&&l(e,r,a,i)}t&&t.onupdate&&o.push(function(){t.onupdate(e,n)})}function s(e,n,t){t&&t.onremove?t.onremove(n):e.removeChild(n)}function v(e,n,t,r,a,o){if(null==t)n=e.insertBefore(c(r,a),n);else if(null!=r.tag&&r.tag===t.tag){d(n,t.data,r.data),a=a||"svg"===r.tag;for(var i=r.children.length,u=t.children.length,l={},p=[],h={},g=0;g<u;g++){var y=p[g]=n.childNodes[g],m=t.children[g],b=f(m);null!=b&&(l[b]=[y,m])}for(var g=0,k=0;k<i;){var y=p[g],m=t.children[g],w=r.children[k],b=f(m);if(h[b])g++;else{var x=f(w),A=l[x]||[];null==x?(null==b&&(v(n,y,m,w,a),k++),g++):(b===x?(v(n,A[0],A[1],w,a),g++):A[0]?(n.insertBefore(A[0],y),v(n,A[0],A[1],w,a)):v(n,y,null,w,a),k++,h[x]=w)}}for(;g<u;){var m=t.children[g],b=f(m);null==b&&s(n,p[g],m.data),g++}for(var g in l){var A=l[g],j=A[1];h[j.data.key]||s(n,A[0],j.data)}}else n&&r!==n.nodeValue&&(n=e.insertBefore(c(r,a),o=n),s(e,o,t.data));return n}for(var p,h,g,y=e.view,m={},b={},k=e.mixins||[],w=e.root||document.body,x=w.children[0],A=0;A<=k.length;A++){var j=k[A]?k[A](i):e;Object.keys(j.events||[]).map(function(e){b[e]=(b[e]||[]).concat(j.events[e])}),n(m,j.actions),p=u(p,j.state)}return r((h=i("load",x))===x&&(h=x=null)),i}var r,a=[],o=[];e.h=n,e.app=t});

},{}],3:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],4:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        p.push([ VAR, xstate, arg ])
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else cur[1][key] = concat(cur[1][key], parts[i][1])
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else cur[1][key] = concat(cur[1][key], parts[i][2])
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)],[CLOSE])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && /\s/.test(c)) {
          res.push([OPEN, reg])
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":3}],5:[function(require,module,exports){
const {app, h} = require('hyperapp')
const hyperx = require('hyperx')
const html = hyperx(h, {attrToProp: false})
const partial = require('hyperapp-partial')

const emit = app({
    state: {},
    mixins: [
        partial,
        partial.mixin('input',        require('./input')),
        partial.mixin('synthcontrol', require('./synthcontrol')),
        partial.mixin('sequencer',    require('./sequencer')),
    ],
    events: {
        load (state, actions) {
            setTimeout(_ => {
                const data = localStorage.getItem('SYNTHDATA')
                if (!data) return
                const {voices, notes} = JSON.parse(data)
                if (voices) emit('persist:setVoices', voices)
                if (notes) emit('persist:setNotes', notes)
            }, 0)
        },
        update (state, actions) {
            setTimeout(_ => {
                localStorage.setItem('SYNTHDATA', JSON.stringify({
                    voices: emit('persist:getVoices'),
                    notes: emit('persist:getNotes')
                }))
            })
        }
    },
    view: (state, actions, views) => html`
        <app-layout>
            <app-layout-left>
                <main-panel>
                    ${views.sequencer.controls()}
                    ${views.synthcontrol.voices()}
                    ${views.synthcontrol.panel()}
                </main-panel>
                ${views.input.keyboard()}
            </app-layout-left>
            <app-layout-right>
                ${views.sequencer.grid()}
            </app-layout-right>
        </app-layout>`,
})


},{"./input":6,"./sequencer":7,"./synthcontrol":9,"hyperapp":2,"hyperapp-partial":1,"hyperx":4}],6:[function(require,module,exports){

const {h} = require('hyperapp')
const hyperx = require('hyperx')
const html = hyperx(h, {attrToProp: false})

const KEYBOARD_KEYS = ['Z','S','X','D','C','V','G','B','H','N','J','M','Q','2','W','3','E','R','5','T','6','Y','7','U','I']
const KEYBOARD_BLACK_KEYS = ['S', 'D', 'G', 'H', 'J', '2', '3', '5', '6', '7']

const isBlack  = function (char) {
    return KEYBOARD_BLACK_KEYS.indexOf(char) > -1
}

const noteForChar = function (char) {
    const n = KEYBOARD_KEYS.indexOf(char)
    return n > -1 ? n : null
}

module.exports = emit => ({
    state: {pressed: null},
    actions: {
        down (state, actions, char) {
            const note = noteForChar(char)
            if (note === null) return
            if (char === state.pressed) return
            state.pressed = char
            emit('input:attackNote', note)
            return state
        },
        up (state, actions, char) {
            const note = noteForChar(char)
            if (note === null) return
            if (char !== state.pressed) return
            state.pressed = null
            emit('input:releaseNote', note)
            return state
        }
    },
    events: {
        load (state, actions) {
            document.addEventListener('keydown', ev => {
                actions.down(String.fromCharCode(ev.keyCode))
            })
            document.addEventListener('keyup', ev => {
                actions.up(String.fromCharCode(ev.keyCode))
            })
        }
    },
    views: {
        keyboard: ({pressed}, {down, up}) => html`
            <keyboard>
                ${KEYBOARD_KEYS.map(char => html`
                <clav
                    class=${
                        (isBlack(char) ? 'black' : 'white') +
                        (pressed === char ? ' pressed' : '')
                    }
                    onmousedown=${_ => down(char)}
                    onmouseup=${_ => up(char)}
                >
                    <char>${char}</char>
                </clav>
                `)}
            </keyboard>`
    }
})
},{"hyperapp":2,"hyperx":4}],7:[function(require,module,exports){
const {h} = require('hyperapp')
const hyperx = require('hyperx')
const html = hyperx(h, {attrToProp: false})
const TIMESTEP = 100
const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const NUM_TIMES = 32

function noteName (note) {
    if (note === null) return ''
    return NOTE_NAMES[note]
}

function isSelected ({voice, start, end}, xVoice, xTime) {
    return voice === xVoice && ((xTime >= start && xTime <= end) || (xTime <= start && xTime >= end))
}



module.exports = emit => ({
    state: {
        mode: 'editing',
        times: [...Array(NUM_TIMES).keys()].map(_ => [...Array(8).keys()].map(_ => null)),
        selection: {
            selecting: false,
            start: -1,
            end: -1,
            voice: -1
        },
        playing: {
            recordNote: null,
            record: false,
            interval: null,
            time: -1,
        }
    },

    actions: {

        selection: {
            reset: (state, actions) => {
                state.selection.selecting = false
                state.selection.start = -1
                state.selection.end = -1
                state.selection.voice = -1
                return state
            },

            start: (state, actions, [time, voice]) => {
                if (state.mode !== 'editing') return
                state.selection.selecting = true
                state.selection.start = time
                state.selection.voice = voice
                emit('sequencer:selectVoice', voice)
                state.selection.end = time
                return state
            },

            stop: (state, actions, time) => {
                state.selection.selecting = false;
                return state
            },

            set: (state, actions, time) => {
                if (state.selection.selecting) {
                    state.selection.end = time
                    return state
                }
            },

            note: (state, actions, note) => update => {
                if (state.selection.start === -1) return
                const {start, end, voice} = state.selection
                const [from, to] = start < end ? [start, end] : [end, start] 
                for (var i = from; i <= to; i++) {
                    state.times[i][voice] = note
                }
                update(state)
                actions.selection.reset()
            }
        },
        _setRecordedNote (state, actions) {
            if (state.playing.record && state.playing.recordNote !== null) {
                state.times[state.playing.time][emit('voices:selectedIndex?')] = state.playing.recordNote
                return state
            }
        },
        _recordAttackNote (state, actions, note) {
            if (state.playing.record) {
                state.playing.recordNote = note
                return state
            }
        },
        recordAttackNote (state, actions, note) {
            actions._recordAttackNote(note),
            actions._setRecordedNote()
        },
        recordReleaseNote (state, actions, note) {
            state.playing.recordNote = null
        },
        _nextNote (state, actions) {
            const currentTime = state.playing.time
            const currentNotes = currentTime === -1 ? [...Array(8).keys()].map(_ => null) : state.times[currentTime]
            const nextTime = (currentTime + 1) % state.times.length
            const nextNotes = state.times[nextTime]
            for (var i = 0; i < 8; i ++) {
                if (currentNotes[i] !== nextNotes[i]) {
                    if (nextNotes[i] === null) {
                        emit('sequencer:releaseNote', {voice: i, note: currentNotes[i]})
                    } else {
                        emit('sequencer:attackNote', {voice: i, note: nextNotes[i]})
                    }
                }
            }
            state.playing.time = nextTime
            return state
        },
        nextNote (state, actions) {
            actions._nextNote()
            actions._setRecordedNote()
        },
        startPlaying (state, actions, record) {
            if (state.playing.interval) return
            state.playing.interval = setInterval(actions.nextNote, TIMESTEP)
            state.playing.record = record || false
            return state
        },
        startRecording (state, actions) {
            actions.startPlaying(true)
        },
        stopPlaying (state, actions) {
            if (state.playing.interval) clearInterval(state.playing.interval)
            state.playing.interval = null
            state.playing.record = false
            emit('sequencer:stopped')
            return state
        },
        setSavedTimes (state, actions, times) {
            if (!times) return
            state.times = times
            return state
        },
        setTime (state, actions, time) {
            state.playing.time = time
            return state
        }
    },
    events:  {
        'load': (state, actions) => {
            window.addEventListener('mouseup', ev => actions.selection.stop())
            window.addEventListener('keydown', ev => {
                if (ev.keyCode === 32) actions.note(null)
            })
        },
        'input:attackNote':  (state, actions, note) => {
            if (state.mode === 'editing') {
                actions.selection.note(note)
            }
            return note
        },
        'input:releaseNote':  [
            (state, actions, note) => actions.recordReleaseNote(note)
        ],
        'persist:getNotes': (state, actions) => state.times,
        'persist:setNotes': (state, actions, notes) => actions.setSavedTimes(notes), 
    },

    views: {

        grid: (state, actions) => html`
            <table class="sequencer">
                ${state.times.map((voices, time) => html`
                <tr>
                    <td class="time" onclick=${_ => actions.setTime(time)}>${time}</td>
                    ${voices.map((note, voice) => html`
                    <td
                        class=${
                            (isSelected(state.selection, voice, time) ? 'selected' : '') +
                            (state.playing.time === time ? ' playing' : '')
                        }
                        onmousedown=${ev => {
                            ev.preventDefault(true)
                            actions.selection.start([time, voice])
                        }}
                        onmouseover=${ev => {
                            ev.preventDefault(true)
                            actions.selection.set(time)
                        }}
                    >
                        ${noteName(note)}
                    </td>
                    `)}
                </tr>
                `)}
            </table>`,
        
        controls: (state, actions) => html`
            <span>
                <button class=${!!state.playing.record ? 'active' : ''} onmousedown=${actions.startRecording}>Rec</button>
                <button class=${!!state.playing.interval ? 'active' : ''} onmousedown=${actions.startPlaying}>Play</button>
                <button onmousedown=${actions.stopPlaying}>Stop</button>
                <button onmousedown=${_ => actions.setNote(null)}>X</button>
            </span>`,
    }
})

},{"hyperapp":2,"hyperx":4}],8:[function(require,module,exports){

const TUNING_FREQ = 440;
const TUNING_NOTE = 69;
const OSCILLATOR_TYPES = ['sawtooth', 'square', 'triangle', 'sine']
const FILTER_TYPES = ['bandpass', 'lowpass', 'highpass']  
const DEFAULTS = {
  octave: 4,
  oscillatorType: 'triangle',
  ampLevel: 0.3,
  sustainLevel: 0.6,
  attackTime: 0.02,
  decayTime: 0.04,
  releaseTime: 0.4,
  filterType: 'lowpass',
  filterCutoff: 7600,
  filterQ: 10,
}

function noteToHz (note, octave) {
  return Math.exp ((octave * 12 + note  - TUNING_NOTE) * Math.log(2) / 12) * TUNING_FREQ;
}


function fillDefaults(props) {
    props = props || {}
    return Object.assign({}, DEFAULTS, props)
}



class Synth {  
  constructor(audioContext, props) {
    props = fillDefaults(props)

    this._ctx = audioContext

    this._osc = this._ctx.createOscillator()
    this._osc.type = props.oscillatorType

    this._flt = this._ctx.createBiquadFilter()
    this._flt.type = props.filterType
    this._flt.frequency.value = props.filterCutoff
    this._flt.Q.value = props.filterQ

    this._env = this._ctx.createGain()
    this._env.gain.value = 0

    this._amp = this._ctx.createGain()
    this._amp.gain.value = props.ampLevel
    
    this._osc.connect(this._flt)
    this._flt.connect(this._env)
    this._env.connect(this._amp)
    this._amp.connect(this._ctx.destination)
    this._osc.start()

    this.octave = props.octave
    this.attackTime = props.attackTime
    this.decayTime = props.decayTime
    this.releaseTime = props.releaseTime
    this.sustainLevel = props.sustainLevel
    this._playing = false
  }
  
  get oscillatorType () { return this._osc.type }
  set oscillatorType (x) { this._osc.type = x }

  get ampLevel () { return this._amp.gain.value }
  set ampLevel (x) { this._amp.gain.value = x }

  get filterType () { return this._flt.type }
  set filterType (t) { this._flt.type = t }

  get filterCutoff () { return this._flt.frequency.value }
  set filterCutoff (v) { this._flt.frequency.value = v }

  get filterQ () { return this._flt.Q.value }
  set filterQ (v) { this._flt.Q.value = v }


  attack (note) {
    if (this._playing === note) return
    this._playing = note
    const freq = noteToHz(note, this.octave)
    var t = this._ctx.currentTime
    this._osc.frequency.cancelScheduledValues(t)
    this._env.gain.cancelScheduledValues(t)
    t += 0.01
    this._osc.frequency.linearRampToValueAtTime(freq, t)
    this._env.gain.linearRampToValueAtTime(0, t)
    t += +this.attackTime
    this._env.gain.linearRampToValueAtTime(1, t)
    t += +this.decayTime
    this._env.gain.linearRampToValueAtTime(+this.sustainLevel, t)
  }
  
  release (note) {
    if (this._playing !== note) return
    this._playing = null
    var t = this._ctx.currentTime + 0.01
    this._env.gain.cancelScheduledValues(t)
    t += +this.releaseTime
    this._env.gain.linearRampToValueAtTime(0, t)
  }
  
  stop () {
    if (this._playing === null) return
    this.release(this._playing)
  }
  
}


module.exports = {
    Synth,
    OSCILLATOR_TYPES,
    FILTER_TYPES
}
},{}],9:[function(require,module,exports){
const {h} = require('hyperapp')
const hyperx = require('hyperx')
const html = hyperx(h, {attrToProp: false})

const {Synth, OSCILLATOR_TYPES, FILTER_TYPES} = require('./synth')

const audioContext = new (window.AudioContext || window.webkitAudioContext)()

const Slider = ({value, set, min, max, step}) => html`
<input
    type="range"
    min=${min || 0}
    max=${max}
    step=${step || "any"}
    value=${value}
    oninput=${ev => set(ev.currentTarget.value)}
/>`


const ButtonOptions = ({options, value, set}) => html`
<span>
    ${options.map(o => html`
        <button
            class=${value === o ? 'active' :'' }
            onclick=${_ => set(o)}
        >
            ${o}
        </button>
    `)}
</span>`


const VOICE_PROPS = [
    'oscillatorType',
    'octave',
    'filterType',
    'filterCutoff',
    'filterQ',
    'attackTime',
    'decayTime',
    'releaseTime',
    'sustainLevel',
    'ampLevel',
]

module.exports = emit => ({
    state: {
        selectedVoice: 0,
        voices: [...Array(8).keys()].map(_ => new Synth(audioContext))
    },

    actions: {
        selectVoice: (state, actions, index) => ({selectedVoice: index}),

        stopAll: (state, actions) => {
            state.voices.forEach(synth => synth.stop())
        },

        setProp: (state, actions, [name, val]) => {
            state.voices[state.selectedVoice][name] = val
            return state //cause update.
        },

        attackNote: (state, actions, [voice, note]) => {
            state.voices[voice].attack(note)
        },

        releaseNote: (state, actions, [voice, note]) => {
            state.voices[voice].release(note)
        }
    },

    events: {
        'persist:getVoices': (state) => {
            return state.voices.map(voice => {
                const props = {}
                VOICE_PROPS.forEach(name => {
                    props[name] = voice[name]
                })
                return props
            })
        },
        'persist:setVoices': (state, actions, saved) => {
            saved.forEach((savedProps, i) => {
                VOICE_PROPS.forEach(propName => {
                    state.voices[i][propName] = savedProps[propName]
                })
            })
        },
        'sequencer:stopped': (state, actions) => {actions.stopAll()},
        'sequencer:selectVoice': (state, actions, voice) => {actions.selectVoice(voice)},
        'sequencer:attackNote': (state, actions, {voice, note}) => {actions.attackNote([voice, note])},
        'sequencer:releaseNote': (state, actions, {voice, note}) => {actions.releaseNote([voice, note])},
        'input:attackNote': (state, actions, note) => {actions.attackNote([state.selectedVoice, note])},
        'input:releaseNote': (state, actions, note) => {actions.releaseNote([state.selectedVoice, note])},
    },
    views: {

        voices: (state, actions) => html`
            <voice-selector>
                ${state.voices.map((v, i) => html`
                <button
                    class=${state.selectedVoice === i ? 'active' : ''}
                    onmousedown=${_ => actions.selectVoice(i)}
                >
                    Voice ${i + 1}
                </button>
                `)}
            </voice-selector>`,

        panel: (state, actions) => {
            const PropSlider = (props) => Slider(Object.assign({
                set: v => actions.setProp([props.name, v]),
                value: state.voices[state.selectedVoice][props.name]
            }, props))

            const PropButtons = (props) => ButtonOptions(Object.assign({
                set: v => actions.setProp([props.name, v]),
                value: state.voices[state.selectedVoice][props.name]
            }, props))

            return html`<synth-panel>
                <div class="col-1">
                    <p>
                        <label>Oscillator:</label>
                        ${PropButtons({name: 'oscillatorType', options: OSCILLATOR_TYPES})}
                    </p>
                    <p>
                        <label>Octave:</label>
                        ${PropSlider({name: 'octave', min:1, max:6, step: 1})}
                    </p>
                    <p>
                        <label>Filter:</label>
                        ${PropButtons({name: 'filterType', options: FILTER_TYPES})}
                    </p>
                    <p>
                        <label>Cutoff</label>
                        ${PropSlider({name: 'filterCutoff', min: 60, max: 7600})}
                    </p>
                    <p>
                        <label>Resonance</label>
                        ${PropSlider({name: 'filterQ', max: 20})}
                    </p>
                </div>
                <div class="col-2">
                    <p>
                        <label>Attack Time:</label>
                        ${PropSlider({name: 'attackTime', max: 0.2})}
                    </p>
                    <p>
                        <label>Decay Time:</label>
                        ${PropSlider({name: 'decayTime', max: 0.2})}
                    </p>
                    <p>
                        <label>Release Time:</label>
                        ${PropSlider({name: 'releaseTime', max: 1.0})}
                    </p>
                    <p>
                        <label>Sustain Level:</label>
                        ${PropSlider({name: 'sustainLevel', max: 1.0})}
                    </p>
                    <p>
                        <label>Amp Level:</label>
                        ${PropSlider({name: 'ampLevel', max: 1.0})}
                    </p>
                </div>
            </synth-panel>`
        },
    }
})
},{"./synth":8,"hyperapp":2,"hyperx":4}]},{},[5]);
