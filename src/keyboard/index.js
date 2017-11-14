import './style.less'
import {h} from 'hyperapp'
import cc from 'classcat'
import {KeyUp, KeyDown} from '../components/key-events'

const KEYBOARD_KEYS = [
    'z','s','x','d','c','v',
    'g','b','h','n','j','m',
    'q','2','w','3','e','r',
    '5','t','6','y','7','u',
    'i'
]

const KEYBOARD_BLACK_KEYS = [
    's', 'd', 'g', 'h', 'j',
    '2', '3', '5', '6', '7'
]

const isBlack  = char =>  KEYBOARD_BLACK_KEYS.indexOf(char) > -1

const noteForChar = function (char) {
    const n = KEYBOARD_KEYS.indexOf(char)
    return n > -1 ? n : null
}

export default {

    state: {pressed: null},

    actions: {
        pressed: _ => (pressed) => ({pressed})
    },

    views: {
        keyboard: (state, actions) =>({onattack, onrelease}) => {

            const clav = char => {

                const note = noteForChar(char)

                const onUp = _ => {
                    if (char !== state.pressed) return
                    if (char === state.pressed) onrelease(note)
                    actions.pressed(null)
                }

                const onDown = _ => {
                    if (char === state.pressed) return
                    if (char !== state.pressed) onattack(note)        
                    actions.pressed(char)
                }

                return (
                    <clav
                        onmousedown={onDown}
                        onmouseup={onUp}
                        class={cc({
                            white: !isBlack(char),
                            black: isBlack(char),
                            pressed: state.pressed === char,
                        })}
                    >
                        <char>{char.toUpperCase()}</char>
                        <KeyUp key={char} then={onUp} />
                        <KeyDown key={char} then={onDown} />
                    </clav>
                )
            }

            return <keyboard>{KEYBOARD_KEYS.map(clav)}</keyboard>
        }
    }
}