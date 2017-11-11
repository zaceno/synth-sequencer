import {h} from 'hyperapp'
import cc from 'classcat'

export default {
    state: {
        on: false,
        note: null,
        voice: null,
    },
    actions: {
        start: _ => ({on: true}),
        stop: _ => ({on: false}),
        setNote: (state, actions, {note, voice}) => ({note, voice}),
        attack: (state, actions, {note, voice}) => {
            if (!state.on) return
            if (note === state.note) return
            if (voice === state.voice) return
            return {note, voice}
        },
        release: (state, actions, {note, voice}) => {
            if (note !== state.note) return
            return {note: null, voice: null}
        }
    },
    views: {
        attack: (state, actions, views, {note, voice}) => actions.setNote({note, voice}),
        release: (state, actions, views, {note, voice}) => actions.setNote({note: null, voice: null}),
        start: (state, actions) => actions.start(),
        stop: (state, actions) => actions.stop(),
        recordButton: (state, actions, views, {onstart}) => (
            <button
                onmousedown={_ => {
                    actions.start()
                    onstart && onstart()
                }}
                class={cc({active: state.on})}
            >
                Rec
            </button>
        )
    }
}