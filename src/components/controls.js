import {h} from 'hyperapp'
import cc from 'classcat'

export const ButtonOptions = ({options, value, set}) => h('span', {class: 'button-options'}, options.map(o => h('button', {
    class: cc({active: value === o}),
    onclick: ev => {
        ev.preventDefault(true)
        set(o)
    }
}, [o])))

export const Slider = ({value, set, min, max, step}) => h('input', {
    type: "range",
    min: min || 0,
    max: max,
    step: step || "any",
    value: value,
    oninput: ev => set(+ev.currentTarget.value),
})
