import {div, span} from './tags'
import cc from 'classcat'
import {KEYBOARD_KEYS, KEYBOARD_BLACK_KEYS} from './const'


const isBlack  = char =>  KEYBOARD_BLACK_KEYS.indexOf(char) > -1

const noteForChar = function (char) {
    const n = KEYBOARD_KEYS.indexOf(char)
    return n > -1 ? n : null
}

export default ($, {onattack, onrelease}) => {

    $.set({pressed: null})

    const actions = $.with({
        attack: (state, char) => {
            const note = KEYBOARD_KEYS.indexOf(char)
            if (note === -1) return false
            if (char === state.pressed) return true
            if (char !== state.pressed) onattack(note)
            $.set({pressed: char})
            return true
        },
        release: (state, char) => {
            const note = KEYBOARD_KEYS.indexOf(char)
            if (note === -1) return false
            if (char !== state.pressed) return true
            if (char === state.pressed) onrelease(note)
            $.set({pressed: null})
            return true
        }
    })

    addEventListener('keydown', ev => actions.attack(ev.key) && ev.preventDefault(true))
    addEventListener('keyup', ev => actions.release(ev.key) && ev.preventDefault(true))

    return $.with(state =>
        div({class:'keyboard'}, KEYBOARD_KEYS.map(char =>
            div({
                class: cc(['clav', {
                    white: !isBlack(char),
                    black: isBlack(char),
                    pressed: char === state.pressed
                }]),
                onmousedown: _ => actions.attack(char),
                onmouseup: _ => actions.release(char),
            }, span({class: 'char'}, char.toUpperCase()))
        ))
    )
}