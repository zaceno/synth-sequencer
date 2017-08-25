
const {h} = require('hyperapp')
const hyperx = require('hyperx')
const html = hyperx(h, {attrToProp: false})

const KEYBOARD_KEYS = ['Z','S','X','D','C','V','G','B','H','N','J','M','Q','2','W','3','E','R','5','T','6','Y','7','U','I']
const KEYBOARD_BLACK_KEYS = ['S', 'D', 'G', 'H', 'J', '2', '3', '5', '6', '7']

const isBlack  = function (char) {
    return KEYBOARD_BLACK_KEYS.indexOf(char) > -1
}

const noteForChar = function (char) {
    const n = KEYBOARD_KEYS.indexOf(char)
    return n > -1 ? n : null
}

module.exports = emit => ({
    state: {pressed: null},
    actions: {
        down (state, actions, char) {
            const note = noteForChar(char)
            if (note === null) return
            if (char === state.pressed) return
            state.pressed = char
            emit('keyboard:attackNote', note)
            return state
        },
        up (state, actions, char) {
            const note = noteForChar(char)
            if (note === null) return
            if (char !== state.pressed) return
            state.pressed = null
            emit('keyboard:releaseNote', note)
            return state
        }
    },
    events: {
        load (state, actions) {
            document.addEventListener('keydown', ev => {
                actions.down(String.fromCharCode(ev.keyCode))
            })
            document.addEventListener('keyup', ev => {
                actions.up(String.fromCharCode(ev.keyCode))
            })
        }
    },
    views: {
        keyboard: ({pressed}, {down, up}) => html`
            <keyboard>
                ${KEYBOARD_KEYS.map(char => html`
                <clav
                    class=${
                        (isBlack(char) ? 'black' : 'white') +
                        (pressed === char ? ' pressed' : '')
                    }
                    onmousedown=${_ => down(char)}
                    onmouseup=${_ => up(char)}
                >
                    <char>${char}</char>
                </clav>
                `)}
            </keyboard>`
    }
})