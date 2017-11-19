
var active = true
var registry = { mouseup: [], mousedown: [], mousemove: [] }

['mouseup', 'mousedown', 'mousemove'].map(type => window.addEventListener(type, ev => {
    registry[type].map(fn => fn(ev))
}))

const MouseEventComponent = type => ({then}) => {
    if (active) {
        registry = { mouseup: [], mousedown: [], mousemove: [] }
        active = false
    }
    registry[type].push(then)
}

export function activate () { active = true }
export const MouseMove = MouseEventComponent('mousemove')
export const MouseDown = MouseEventComponent('mousedown')
export const MouseUp   = MouseEventComponent('mouseup')

