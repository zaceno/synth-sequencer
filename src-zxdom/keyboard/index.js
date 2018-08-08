import {h, define, update} from 'zxdom'
import cc from 'classcat'
import css from './style.css'
import {KEYBOARD_KEYS, KEYBOARD_BLACK_KEYS} from '../const'


export default function ({onattack, onrelease}) {
    
    var pressed = null

    const attack = char => {
        const note = KEYBOARD_KEYS.indexOf(char)
        if (note === -1) return
        if (char === pressed) return
        pressed = char
        update(view)
        onattack(note)
    }

    const release = char => {
        const note = KEYBOARD_KEYS.indexOf(char)
        if (note === -1) return
        if (char !== pressed) return
        pressed = null
        update(view)
        onrelease(note)
    }

    const view = define(_ => (
        <div oncreate={el => {
            addEventListener('keydown', ev => attack(ev.key) && ev.preventDefault(true))
            addEventListener('keyup', ev => release(ev.key) && ev.preventDefault(true))
        }}class={css.keyboard} key="keyboard">
            {KEYBOARD_KEYS.map(char => (
            <div
                class={cc({
                    [css.clav]: true,
                    [css.black]: KEYBOARD_BLACK_KEYS.indexOf(char) >= 0,
                    [css.pressed]: char === pressed,
                })}
                onmousedown={ _ => attack(char) }
                onmouseup={ _ => release(char) }
            >
                <span class={css.char}>{char.toUpperCase()}</span>
            </div>
            ))}
        </div>
    ))

    return {Keyboard: view}
}

