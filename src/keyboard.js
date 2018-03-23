import {h} from 'hyperapp'
import cc from 'classcat'
import {KEYBOARD_KEYS, KEYBOARD_BLACK_KEYS} from './const'
const isBlack  = char =>  KEYBOARD_BLACK_KEYS.indexOf(char) > -1

const noteForChar = function (char) {
    const n = KEYBOARD_KEYS.indexOf(char)
    return n > -1 ? n : null
}

const Keyboard = ({pressed, attack, release}) => (
    <div class="keyboard" key="keyboard">
        {KEYBOARD_KEYS.map(char => (
        <div
            class={cc(['clav', {
                white: !isBlack(char),
                black: isBlack(char),
                pressed: char === pressed,
            }])}
            onmousedown={ ev => attack(char) }
            onmouseup={ ev => release(char) }
        >
            <span class="char">{char.toUpperCase()}</span>
        </div>
        ))}
    </div>
)

export default {
    state: {
        pressed: null
    },

    actions: {
        
        init: ({onattack, onrelease}) => (state, actions) => {
            addEventListener('keydown', ev => actions.attack(ev.key) && ev.preventDefault(true))
            addEventListener('keyup', ev => actions.release(ev.key) && ev.preventDefault(true))
            return {
                onattack: onattack || (_ => {}),
                onrelease: onrelease || (_ => {}),
            }
        },
        
        attack: char => state => {
            const note = KEYBOARD_KEYS.indexOf(char)
            if (note === -1) return
            if (char === state.pressed) return
            if (char !== state.pressed) state.onattack(note)
            return {pressed: char}
        },

        release: char => state => {
            const note = KEYBOARD_KEYS.indexOf(char)
            if (note === -1) return
            if (char !== state.pressed) return
            if (char === state.pressed) state.onrelease(note)
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
