import {h} from 'picodom'
import cc from 'classcat'

export default {
    state: {
        on: false,
        note: null,
        voice: null,
    },
    actions: {
        start:   _ => ({on: true}),
        stop:    _ => ({on: false}),
        setNote: (state, actions, {note, voice}) => ({note, voice}),
    },
    views: {
        getVoice: state => {
            if (state.on) return state.voice
            else return null
        },

        attack: (state, actions, views, {note, voice}) => {
            if (!state.on) return
            if (note === state.note) return
            console.log('ATTACING', note, state.note, voice, state.voice)
            if (voice === state.voice) return
            return actions.setNote({note, voice})
        },
        release: (state, actions, views, {note, voice}) => {
            if (note !== state.note) return
            console.log('RELEASING', note)
            return actions.setNote({note: null, voice: null})
        },
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