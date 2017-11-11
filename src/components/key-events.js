/*

in event mode

render a component: 
  if in event mode: reset the registries and go to register mode
  if in register mode do nothing

when an event comes in
    if in registry mode, go to event mode.

*/
var listening = true
var registry

['keyup', 'keydown', 'keypress'].map(type => window.addEventListener(type, ev => {
    listening = true
    if (!registry[type][ev.key]) return
    ev.preventDefault(true)
    registry[type][ev.key].map(fn => fn(ev))
}))

const KeyEventComponent = type => ({key, then}) => {
    if (listening) {
        registry = { keyup: {}, keydown: {}, keypress: {} }
        listening = false
    }
    registry[type][key] = registry[type][key] || []
    registry[type][key].push(then)
}

export const KeyPress = KeyEventComponent('keypress')
export const KeyUp = KeyEventComponent('keyup')
export const KeyDown = KeyEventComponent('keydown')

