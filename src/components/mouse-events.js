
var listening = true
var registry

['mouseup', 'mousedown', 'mousemove'].map(type => window.addEventListener(type, ev => {
    listening = true
    registry[type].map(fn => fn(ev))
}))

const MouseEventComponent = type => ({then}) => {
    if (listening) {
        registry = { mouseup: [], mousedown: [], mousemove: [] }
        listening = false
    }
    registry[type].push(then)
}

export const MouseMove = MouseEventComponent('mousemove')
export const MouseDown = MouseEventComponent('mousedown')
export const MouseUp   = MouseEventComponent('mouseup')

