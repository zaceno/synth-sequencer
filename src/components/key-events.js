var registry
var active = true;

['keyup', 'keydown', 'keypress'].map(type => window.addEventListener(type, ev => {
    ev.preventDefault(true)
    if (!registry[type][ev.key]) return
    registry[type][ev.key].map(fn => fn(ev))
}))

const KeyEventComponent = type => ({key, then}) => {
    if (active) {
        registry = {keyup: {}, keydown: {}, keypress: {}}
        active = false
    }
    registry[type][key] = registry[type][key] || []
    registry[type][key].push(then)
}

export function activate () { active = true }
export const KeyPress = KeyEventComponent('keypress')
export const KeyUp = KeyEventComponent('keyup')
export const KeyDown = KeyEventComponent('keydown')

