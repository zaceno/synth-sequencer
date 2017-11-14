!function(){"use strict";function e(e){if(e||window){var n=document.createElement("style");return n.setAttribute("media","screen"),n.innerHTML=e,document.head.appendChild(n),e}}function n(e,n){for(var t,o=arguments,r=[],i=[],a=arguments.length;a-- >2;)r.push(o[a]);for(;r.length;)if(Array.isArray(t=r.pop()))for(a=t.length;a--;)r.push(t[a]);else null!=t&&!0!==t&&!1!==t&&i.push("number"==typeof t?t+="":t);return"string"==typeof e?{type:e,props:n||{},children:i}:e(n||{},i)}function t(e,n,t,o){return function(r,i){var a=o(e,n,t);return"function"==typeof a?a(r,i):a}}function o(e,n,r){var i={};for(var a in r||{})"function"==typeof r[a]?i[a]=t(e,n,i,r[a]):i[a]=o(e[a],n[a],r[a]);return i}function r(e,n){return n.map(function(n){return function(t){n(t[e])}})}function i(e){return e.partials=e.partials||{},e.state=e.state||{},e.actions=e.actions||{},e.views=e.views||{},e.init=[].concat(e.init||[]),Object.keys(e.partials).forEach(function(n){var t=i(e.partials[n]);e.state[n]=t.state,e.actions[n]=t.actions,e.views[n]=t.views,e.init=e.init.concat(r(n,t.init))}),e}function a(){p=!0}function u(){g=!0}function l(e,n){var t,o="",r=typeof e;if(e&&"string"===r||"number"===r)return e;if(n=n||" ",Array.isArray(e)&&e.length)for(var i=0,a=e.length;i<a;i++)(t=l(e[i],n))&&(o+=(o&&n)+t);else for(var i in e)e.hasOwnProperty(i)&&(t=e[i])&&(o+=(o&&n)+i+("object"==typeof t?l(t,n+i):""));return o}function c(e,n){return Math.exp((12*n+e-G)*Math.log(2)/12)*j}function s(e){return null===e?"":W[e]}e("body {\n  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;\n  font-size: 13px;\n}\napp-layout {\n  display: flex;\n}\napp-layout app-layout-left {\n  flex: 0 0 800px;\n}\napp-layout app-layout-right {\n  flex: 1 0 1px;\n}\nbutton {\n  font-weight: bold;\n  background-color: #444;\n  color: #fff;\n  border: 2px black solid;\n  height: 25px;\n  line-height: 15px;\n}\nbutton.active {\n  background-color: #e9931d;\n  color: #000;\n}\ninput[type=range]::-webkit-slider-runnable-track {\n  -webkit-appearance: none;\n  width: 300px;\n  height: 6px;\n  border-radius: 3px;\n  background-color: #e9931d;\n}\ninput[type=range]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  border: 1px #000 solid;\n  height: 15px;\n  width: 5px;\n  background: #444;\n}\nmain-panel {\n  display: block;\n  background: #ddd;\n}\n");var f,p=!0;["keyup","keydown","keypress"].map(function(e){return window.addEventListener(e,function(n){n.preventDefault(!0),f[e][n.key]&&f[e][n.key].map(function(e){return e(n)})})});var d,v=function(e){return function(n){var t=n.key,o=n.then;p&&(f={keyup:{},keydown:{},keypress:{}},p=!1),f[e][t]=f[e][t]||[],f[e][t].push(o)}},m=(v("keypress"),v("keyup")),y=v("keydown"),g=!0;["mouseup","mousedown","mousemove"].map(function(e){return window.addEventListener(e,function(n){d[e].map(function(e){return e(n)})})});var b=function(e){return function(n){var t=n.then;g&&(d={mouseup:[],mousedown:[],mousemove:[]},g=!1),d[e].push(t)}},h=(b("mousemove"),b("mousedown"),b("mouseup"));e("keyboard {\n  height: 200px;\n  width: 100%;\n  display: flex;\n  position: relative;\n}\nkeyboard clav {\n  position: relative;\n  flex: 1 0 auto;\n  width: 4.67%;\n  margin: 0;\n  padding: 0;\n  background-color: #fff;\n  height: 99%;\n  border-bottom-left-radius: 10px;\n  border-bottom-right-radius: 10px;\n  border: 1px #000 solid;\n  border-right: none;\n}\nkeyboard clav.pressed {\n  background-color: #e9931d;\n}\nkeyboard clav.black {\n  height: 60%;\n  width: 3%;\n  margin-left: -5%;\n  left: 2.5%;\n  z-index: 100;\n  background-color: #444;\n  color: #fff;\n}\nkeyboard clav.black.pressed {\n  background-color: #e9931d;\n}\nkeyboard clav char {\n  display: block;\n  position: absolute;\n  bottom: 10px;\n  width: 100%;\n  text-align: center;\n}\n");var k=["z","s","x","d","c","v","g","b","h","n","j","m","q","2","w","3","e","r","5","t","6","y","7","u","i"],w=["s","d","g","h","j","2","3","5","6","7"],T=function(e){return w.indexOf(e)>-1},x=function(e){var n=k.indexOf(e);return n>-1?n:null},C={state:{pressed:null},actions:{pressed:function(e){return function(e){return{pressed:e}}}},views:{keyboard:function(e,t){return function(o){var r=o.onattack,i=o.onrelease;return n("keyboard",null,k.map(function(o){var a=x(o),u=function(n){o===e.pressed&&(o===e.pressed&&i(a),t.pressed(null))},c=function(n){o!==e.pressed&&(o!==e.pressed&&r(a),t.pressed(o))};return n("clav",{onmousedown:c,onmouseup:u,class:l({white:!T(o),black:T(o),pressed:e.pressed===o})},n("char",null,o.toUpperCase()),n(m,{key:o,then:u}),n(y,{key:o,then:c}))}))}}}};e("synth-panel {\n  display: flex;\n  padding: 15px;\n  position: relative;\n}\nsynth-panel span.label {\n  display: inline-block;\n  width: 80px;\n}\nsynth-panel .col-1 {\n  width: 1px;\n  flex: 1 0 auto;\n}\nsynth-panel .col-2 {\n  width: 1px;\n  flex: 1 0 auto;\n}\nsynth-panel input[type=range] {\n  -webkit-appearance: none;\n  width: 200px;\n}\nsynth-panel input[type=range]::-webkit-slide-runnable-track {\n  -webkit-appearance: none;\n  height: 6px;\n  border-radius: 3px;\n  background-color: #e9931d;\n}\nsynth-panel input[type=range]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  border: 1px #000 solid;\n  height: 15px;\n  width: 8px;\n  border-radius: 2px;\n  margin-top: -4px;\n  background: #444;\n}\nvoice-selector {\n  display: block;\n  padding: 15px;\n  text-align: right;\n  border-bottom: 1px #555 solid;\n}\nvoice-selector button {\n  margin-left: 10px;\n}\n");var A=function(e){var t=e.value,o=e.set,r=e.min,i=e.max,a=e.step;return n("input",{type:"range",min:r||0,max:i,step:a||"any",value:t,oninput:function(e){return o(+e.currentTarget.value)}})},L={octave:4,oscillatorType:"triangle",ampLevel:.3,sustainLevel:.6,attackTime:.02,decayTime:.04,releaseTime:.4,filterCutoff:7600,filterQ:10},S=function(e){var t=e.initial,o=e.widget,r=e.params,i=e.name;return{state:{value:t},actions:{set:function(e){return function(e){return{value:e}}}},views:{control:function(e,t){return function(a){var u=a.onset,l=Object.assign(r,{value:e.value,set:function(e){t.set(e),u&&u(e)}});return n("p",null,n("label",null,n("span",{class:"label"},i+":"),o(l)))}}}}},V=S({name:"Oscillator",initial:L.oscillatorType,widget:function(e){var t=e.options,o=e.value,r=e.set;return n("span",{class:"button-options"},t.map(function(e){return n("button",{class:l({active:o===e}),onclick:function(n){n.preventDefault(!0),r(e)}},[e])}))},params:{options:["sawtooth","square","triangle","sine"]}}),N=S({name:"Cutoff",initial:L.filterCutoff,widget:A,params:{min:60,max:7600}}),q=S({name:"Octave",initial:L.octave,widget:A,params:{min:1,max:6,step:1}}),B=S({name:"Resonance",initial:L.filterQ,widget:A,params:{max:20}}),E=S({name:"Attack Time",initial:L.attackTime,widget:A,params:{max:.2}}),Q=S({name:"Decay Time",initial:L.decayTime,widget:A,params:{max:.2}}),O=S({name:"Release Time",initial:L.releaseTime,widget:A,params:{max:.8}}),R=S({name:"Sustain Level",initial:L.sustainLevel,widget:A,params:{max:1}}),D=S({name:"Amp Level",initial:L.ampLevel,widget:A,params:{max:1}}),j=440,G=69,M={state:{audioContext:null,oscillatorNode:null,filterNode:null,envelopeNode:null,ampNode:null,playing:null},partials:Object.freeze({oscillatorType:V,filterCutoff:N,octave:q,filterQ:B,attackTime:E,decayTime:Q,releaseTime:O,sustainLevel:R,ampLevel:D}),actions:{init:function(e){return function(n){var t=n.createOscillator();t.type=e.oscillatorType.value;var o=n.createBiquadFilter();o.type="lowpass",o.frequency.value=e.filterCutoff.value,o.Q.value=e.filterQ.value;var r=n.createGain();r.gain.value=0;var i=n.createGain();return i.gain.value=e.ampLevel.value,t.connect(o),o.connect(r),r.connect(i),i.connect(n.destination),t.start(),{audioContext:n,oscillator:t,filter:o,envelope:r,amplifier:i}}},setNote:function(e){return function(e){return{playing:e}}}},views:{attack:function(e,n){return function(t){if(e.playing!==t){n.setNote(t);var o=c(t,e.octave.value),r=e.audioContext.currentTime;e.oscillator.frequency.cancelScheduledValues(r),e.envelope.gain.cancelScheduledValues(r),r+=.01,e.oscillator.frequency.linearRampToValueAtTime(o,r),e.envelope.gain.linearRampToValueAtTime(0,r),r+=+e.attackTime.value,e.envelope.gain.linearRampToValueAtTime(1,r),r+=+e.decayTime.value,e.envelope.gain.linearRampToValueAtTime(+e.sustainLevel.value,r)}}},release:function(e,n){return function(t){if(e.playing===t){n.setNote(null);var o=e.audioContext.currentTime+.01;e.envelope.gain.cancelScheduledValues(o),o+=+e.releaseTime.value,e.envelope.gain.linearRampToValueAtTime(0,o)}}},stop:function(e,n,t){var o=t.release;null!==e.playing&&o(e.playing)},onsave:function(e){return{oscillatorType:e.oscillatorType.value,octave:e.octave.value,filterCutoff:e.filterCutoff.value,filterQ:e.filterQ.value,attackTime:e.attackTime.value,decayTime:e.decayTime.value,sustainLevel:e.sustainLevel.value,releaseTime:e.releaseTime.value,ampLevel:e.ampLevel.value}},onload:function(e,n){return function(t){n.oscillatorType.set(t.oscillatorType),n.octave.set(t.octave),n.filterCutoff.set(t.filterCutoff),n.filterQ.set(t.filterQ),n.attackTime.set(t.attackTime),n.decayTime.set(t.decayTime),n.sustainLevel.set(t.sustainLevel),n.releaseTime.set(t.releaseTime),n.ampLevel.set(t.ampLevel),e.oscillator.type=t.oscillatorType,e.filter.frequency.value=t.filterCutoff,e.filter.Q.value=t.filterQ,e.amplifier.gain.value=t.ampLevel}},panel:function(e,t,o){return n("synth-panel",null,n("div",{class:"col-1"},n(o.oscillatorType.control,{onset:function(n){return e.oscillator.type=n}}),n(o.octave.control,null),n(o.filterCutoff.control,{onset:function(n){return e.filter.frequency.value=n}}),n(o.filterQ.control,{onset:function(n){return e.filter.Q.value=n}})),n("div",{class:"col-2"},n(o.attackTime.control,null),n(o.decayTime.control,null),n(o.sustainLevel.control,null),n(o.releaseTime.control,null),n(o.ampLevel.control,{onset:function(n){return e.amplifier.gain.value=n}})))}}},P=function(e,n){for(var t=[],o=0;o<e;o++)t.push(n(o));return t},F=P(8,function(e){return e}),z={partials:{0:M,1:M,2:M,3:M,4:M,5:M,6:M,7:M},state:{selected:0},actions:{select:function(e){return function(e){return{selected:e}}}},init:function(e){var n=new(window.AudioContext||window.webkitAudioContext);F.forEach(function(t){return e[t].init(n)})},views:{getSelected:function(e){return e.selected},select:function(e,n){return function(e){return n.select(e)}},stopAll:function(e,n,t){return F.map(function(e){return t[e].stop()})},attack:function(e,n,t){return function(n){return t[e.selected].attack(n)}},release:function(e,n,t){return function(n){return t[e.selected].release(n)}},attackVoice:function(e,n,t){return function(e){var n=e.note,o=e.voice;return t[o].attack(n)}},releaseVoice:function(e,n,t){return function(e){var n=e.note,o=e.voice;return t[o].release(n)}},onload:function(e,n,t){return function(e){return F.forEach(function(n){return t[n].onload(e[n])})}},onsave:function(e,n,t){return F.map(function(e){return t[e].onsave()})},panel:function(e,n,t){return t[e.selected].panel()},selector:function(e,t,o){return n("voice-selector",null,F.map(function(o){return n("button",{onmousedown:function(e){return t.select(o)},class:l({active:e.selected===o})},"Voice ",o+1)}))}}};e("table.sequencer {\n  border-collapse: collapse;\n}\ntable.sequencer td {\n  border: 1px #ccc solid;\n  width: 50px;\n}\ntable.sequencer td.selected {\n  background: #e9931d;\n}\ntable.sequencer td.time {\n  background: #ccc;\n  text-align: right;\n}\ntable.sequencer td.playing {\n  background: #ddd;\n}\n");var I=32,W=["C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B","C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B","C"],H={partials:{selection:{state:{start:-1,end:-1,selecting:!1,on:!1,col:null},actions:{reset:function(e){return{on:!1,start:-1,end:-1,selecting:!1}},start:function(e){return function(e){var n=e.row;return{on:!0,selecting:!0,start:n,end:n,col:e.col}}},set:function(e){return function(n){var t=n.row;if(e.selecting)return{end:t}}},stop:function(e){return{selecting:!1}}},views:{map:function(e,n){return function(t){var o=t.value,r=t.grid;if(e.on){for(var i=e.start,a=e.end,u=i<a?[i,a]:[a,i],l=u[1],c=u[0];c<=l;c++)r[c][e.col]=o;return n.reset(),r}}},isSelected:function(e){return function(n){var t=n.row;return n.col===e.col&&(t>=e.start&&t<=e.end||t<=e.start&&t>=e.end)}},selectable:function(e,n,t){var o=t.isSelected;return function(e,t){var r=e.row,i=e.col,a=e.oncol;return t.map(function(e){return e.props.class=l([e.props.class,{selected:o({row:r,col:i})}]),e.props.onmousedown=function(e){e.preventDefault(!0),a(i),n.start({row:r,col:i})},e.props.onmousemove=function(e){e.preventDefault(!0),n.set({row:r})},e})}}}},recording:{state:{on:!1,note:null,voice:null},actions:{start:function(e){return{on:!0}},stop:function(e){return{on:!1}},setNote:function(e){return function(e){return{note:e.note,voice:e.voice}}}},views:{getVoice:function(e){return e.on?e.voice:null},attack:function(e,n){return function(t){var o=t.note,r=t.voice;if(e.on&&o!==e.note&&r!==e.voice)return n.setNote({note:o,voice:r})}},release:function(e,n){return function(t){if(t.note===e.note)return n.setNote({note:null,voice:null})}},start:function(e,n){return n.start()},stop:function(e,n){return n.stop()},recordButton:function(e,t){return function(o){var r=o.onstart;return n("button",{onmousedown:function(e){t.start(),r&&r()},class:l({active:e.on})},"Rec")}}}},playback:{state:{on:!1,interval:null,time:0,played:null},actions:{start:function(e,n){if(!e.on)return{on:!0,interval:setInterval(n.advance,100)}},stop:function(e,n){if(e.on)return e.interval&&clearInterval(e.interval),{on:!1,interval:null}},advance:function(e,n){return{time:(e.time+1)%I}},setTime:function(e){return function(e){return{time:e}}},setPlayed:function(e){return{played:e.time}}},views:{start:function(e,n){return n.start()},stop:function(e,n){return n.stop()},setTime:function(e,n){return function(e){return n.setTime(e)}},nowPlaying:function(e){return function(n){return n===e.time}},play:function(e,n){return function(t){var o=t.times,r=t.onattack,i=t.onrelease,a=t.recordingVoice;if(e.on&&e.played!==e.time){n.setPlayed();var u=o[e.time],l=o[(e.time+I-1)%I];u.forEach(function(e,n){n!==a&&e!==l[n]&&(null!==e?r({voice:n,note:e}):i({voice:n,note:l[n]}))})}}},startButton:function(e,t){return function(o){var r=o.onstart;return n("button",{onmousedown:function(n){e.on||(t.start(),r&&r())},class:l({active:e.on})},"Play")}},stopButton:function(e,t){return function(o){var r=o.onstop;return n("button",{onmousedown:function(n){e.on&&(t.stop(),r&&r())}},"Stop")}}}}},state:{times:P(I,function(e){return P(8,function(e){return null})})},actions:{setTimes:function(e){return function(e){return{times:e}}},setTimesWith:function(e,n){return function(t){var o=t.note,r=t.map;return n.setTimes(r({value:o,grid:e.times}))}},setRecordedNote:function(e,n){e.recording.on&&null!==e.recording.note&&(e.times[e.playback.time][e.recording.voice]=e.recording.note,n.setTimes(e.times))}},views:{attack:function(e,n,t){var o=t.selection,r=t.recording;return function(t){var i=t.note,a=t.voice;e.selection.on&&n.setTimesWith({note:i,map:o.selectionMap}),r.attack({note:i,voice:a})}},release:function(e,n,t){var o=t.recording;return function(e){var n=e.note,t=e.voice;o.release({note:n,voice:t})}},onsave:function(e){return e.times},onload:function(e,n){return function(e){return n.setTimes(e)}},grid:function(e,t,o){var r=o.playback,i=o.selection,a=o.recording;return function(o){var u=o.onattack,c=o.onrelease,f=o.onselectVoice;return n("table",{class:"sequencer",onupdate:function(n){r.play({times:e.times,onattack:u,onrelease:c,recordingVoice:a.getVoice()}),t.setRecordedNote()}},e.times.map(function(e,t){return n("tr",null,n("td",{class:"time",onclick:function(e){return r.setTime(t)}},t),e.map(function(e,o){return n(i.selectable,{row:t,col:o,oncol:f},n("td",{class:l({playing:r.nowPlaying(t)})},s(e)))}))}))}},controls:function(e,t,o){var r=o.playback,i=o.recording,a=o.selection;return function(e){var o=e.onstop;return n("span",null,n(h,{then:t.selection.stop}),n(y,{key:" ",then:function(e){t.setTimesWith({note:null,map:a.map})}}),n(i.recordButton,{onstart:r.start}),n(r.startButton,null),n(r.stopButton,{onstop:function(e){i.stop(),o&&o()}}),n("button",{onmousedown:function(e){t.setTimesWith({note:null,map:a.map})}},"X"))}}}};!function(e){return function(n,t){var r=i(n),a=r.view;r.view=function(e,n){return a(e,n,o(e,n,r.views))};var u=e(r,t);return r.init.forEach(function(e){e(u)}),u}}(function(e,t){function o(e,t){return e&&n(e.tagName.toLowerCase(),{},t.call(e.childNodes,function(e){return 3===e.nodeType?e.nodeValue:o(e,t)}))}function r(){e.view&&!b&&setTimeout(i,b=!b)}function i(n){for(b=!b,(n=e.view(w,T))&&!b&&(h=g(t,h,k,k=n));n=x.pop();)n()}function a(e,n,t,o){var r=t.modules;u(e,n,t.actions,o),c(e,t.state);for(var i in r)a(e[i]={},n[i]={},r[i],o.concat(i))}function u(e,n,t,o){Object.keys(t||{}).map(function(i){"function"==typeof t[i]?n[i]=function(a){var u=t[i](e=f(o,w),n);return"function"==typeof u&&(u=u(a)),u&&u!==e&&!u.then&&r(w=s(o,l(e,u),w)),u}:u(e[i]||(e[i]={}),n[i]={},t[i],o.concat(i))})}function l(e,n){return c(c({},e),n)}function c(e,n){for(var t in n)e[t]=n[t];return e}function s(e,n,t){var o={};return 0===e.length?n:(o[e[0]]=1<e.length?s(e.slice(1),n,t[e[0]]):n,l(t,o))}function f(e,n){for(var t=0;t<e.length;t++)n=n[e[t]];return n}function p(e,n){if("string"==typeof e)t=document.createTextNode(e);else{var t=(n=n||"svg"===e.type)?document.createElementNS("http://www.w3.org/2000/svg",e.type):document.createElement(e.type);for(e.props.oncreate&&x.push(function(){e.props.oncreate(t)}),o=0;o<e.children.length;o++)t.appendChild(p(e.children[o],n));for(var o in e.props)d(t,o,e.props[o])}return t}function d(e,n,t,o){if("key"===n);else if("style"===n)for(var n in l(o,t=t||{}))e.style[n]=t[n]||"";else{try{e[n]=null==t?"":t}catch(e){}"function"!=typeof t&&(null==t||!1===t?e.removeAttribute(n):e.setAttribute(n,t))}}function v(e,n,t){for(var o in l(n,t)){var r=t[o],i="value"===o||"checked"===o?e[o]:n[o];r!==i&&d(e,o,r,i)}t.onupdate&&x.push(function(){t.onupdate(e,n)})}function m(e,n,t){function o(){e.removeChild(n)}t&&t.onremove?t.onremove(n,o):o()}function y(e){if(e&&e.props)return e.props.key}function g(e,n,t,o,r,i){if(t===o);else if(null==t)n=e.insertBefore(p(o,r),n);else if(null!=o.type&&o.type===t.type){v(n,t.props,o.props),r=r||"svg"===o.type;for(var a=o.children.length,u=t.children.length,l={},c=[],s={},f=0;f<u;f++)b=c[f]=n.childNodes[f],null!=(x=y(h=t.children[f]))&&(l[x]=[b,h]);for(var f=0,d=0;d<a;){var b=c[f],h=t.children[f],k=o.children[d];if(s[x=y(h)])f++;else{var w=y(k),T=l[w]||[];null==w?(null==x&&(g(n,b,h,k,r),d++),f++):(x===w?(g(n,T[0],T[1],k,r),f++):T[0]?(n.insertBefore(T[0],b),g(n,T[0],T[1],k,r)):g(n,b,null,k,r),d++,s[w]=k)}}for(;f<u;){var x=y(h=t.children[f]);null==x&&m(n,c[f],h.props),f++}for(var f in l){var C=(T=l[f])[1];s[C.props.key]||m(n,T[0],C.props)}}else n&&o!==n.nodeValue&&("string"==typeof o&&"string"==typeof t?n.nodeValue=o:(n=e.insertBefore(p(o,r),i=n),m(e,i,t.props)));return n}var b,h=(t=t||document.body).children[0],k=o(h,[].map),w={},T={},x=[];return r(a(w,T,e,[])),T})({partials:{keyboard:C,soundbank:z,sequencer:H},views:{loadState:function(e,n,t){var o=localStorage.getItem("SYNTHDATA");if(o){var r=JSON.parse(o),i=r.voices,a=r.notes;i&&t.soundbank.onload(i),a&&t.sequencer.onload(a)}},saveState:function(e,n,t){localStorage.setItem("SYNTHDATA",JSON.stringify({voices:t.soundbank.onsave(),notes:t.sequencer.onsave()}))}},view:function(e,t,o){var r=o.loadState,i=o.saveState,l=o.keyboard,c=o.soundbank,s=o.sequencer;return n("app-layout",{oncreate:r,onupdate:function(e){i(),a(),u()}},n("app-layout-left",null,n("main-panel",null,n(s.controls,{onstop:c.stopAll}),n(c.selector,null),n(c.panel,null)),n(l.keyboard,{onattack:function(e){c.attack(e),s.attack({note:e,voice:c.getSelected()})},onrelease:function(e){c.release(e),s.release({note:e,voice:c.getSelected()})}})),n("app-layout-right",null,n(s.grid,{selectedVoice:c.getSelected(),onselectVoice:function(e){return c.select(e)},onattack:function(e){var n=e.note,t=e.voice;return c.attackVoice({note:n,voice:t})},onrelease:function(e){var n=e.note,t=e.voice;return c.releaseVoice({note:n,voice:t})}})))}})}();
