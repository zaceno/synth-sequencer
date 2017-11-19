import {h} from 'picodom'
import cc from 'classcat'
import {TIMESTEP, NUM_TIMES} from './const'

export default {
    state: {
        on: false,
        interval: null,
        time: 0,
        played: null
    },

    actions: {
        
        start: (state, actions) => {
            if(state.on) return
            return ({
                on: true,
                interval: setInterval(actions.advance, TIMESTEP)
            })
        },
        
        stop: (state, actions) => {
            if (!state.on) return
            state.interval && clearInterval(state.interval)
            return ({ on: false, interval: null })
        },

        advance: (state, actions) => {
            return ({time: (state.time + 1) % NUM_TIMES})
        },

        setTime: (state, actions, time) => ({time}),

        setPlayed: state => ({played: state.time}),
    },

    views: {

        start: (_, actions) => actions.start(),

        stop: (_, actions) => actions.stop(),

        setTime: (_, actions, views, time) => actions.setTime(time),

        nowPlaying: (state, actions, views, time) => time === state.time,

        play: (state, actions, views, {times, onattack, onrelease, recordingVoice}) => {
            if (!state.on) return
            if (state.played === state.time) return //make sure the below is only run once per step
            actions.setPlayed()
            const notes = times[state.time]
            const prev = times[(state.time + NUM_TIMES - 1) % NUM_TIMES]
            notes.forEach((note, voice) => {
                if (voice === recordingVoice) return
                if (note === prev[voice]) return
                if (note !== null) {
                    onattack({voice, note})
                } else {
                    onrelease({voice, note: prev[voice]})
                }
            })
        },

        startButton: (state, actions, views, {onstart}) => (
            <button
                onmousedown={_ => {
                    if (state.on) return
                    actions.start()
                    onstart && onstart()
                }}
                class={cc({active: state.on})}
            >
                Play
            </button>  
        ),

        stopButton: (state, actions, views, {onstop}) => (
            <button
                onmousedown={_ => {
                    if (!state.on) return
                    actions.stop()
                    onstop && onstop()
                }}
            >
                Stop
            </button>
        ),
    }
}