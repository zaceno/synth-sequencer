import {h} from 'hyperapp'
import cc from 'classcat'
import css from './css/keyboard.css'

import {KEYBOARD_KEYS, KEYBOARD_BLACK_KEYS} from './const'
const isBlack  = char =>  KEYBOARD_BLACK_KEYS.indexOf(char) > -1

const Keyboard = ({pressed, attack, release}) => (
    <div class={css.keyboard} key="keyboard">
        {KEYBOARD_KEYS.map(char => (
        <div
            class={cc([css.clav, {
                [css.black]: isBlack(char),
                [css.pressed]: char === pressed,
            }])}
            onmousedown={ ev => attack(char) }
            onmouseup={ ev => release(char) }
        >
            <span class={css.char}>{char.toUpperCase()}</span>
        </div>
        ))}
    </div>
)

export default {
    state: {
        pressed: null
    },

    actions: {
        
        init: ({onpress}) => (state, actions) => {
            addEventListener('keydown', ev => actions.attack(ev.key) && ev.preventDefault(true))
            addEventListener('keyup', ev => actions.release(ev.key) && ev.preventDefault(true))
            return {onpress}
        },
        
        attack: char => state => {
            const note = KEYBOARD_KEYS.indexOf(char)
            if (note === -1) return
            if (char === state.pressed) return
            state.onpress(note)
            return {pressed: char}
        },

        release: char => state => {
            const note = KEYBOARD_KEYS.indexOf(char)
            if (note === -1) return
            if (char !== state.pressed) return
            state.onpress(null)
            return {pressed: null}
        }
    },

    view: (state, actions) => ({
        Keyboard: _ => Keyboard({
            attack: actions.attack,
            release: actions.release,
            pressed: state.pressed,
        })
    })
}
