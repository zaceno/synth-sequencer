import {h} from 'hyperapp'
import cc from 'classcat'
import {TIMESTEP, NUM_TIMES} from './const'

export default {
    state: {
        on: false,
        interval: null,
        time: 0,
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

        advance: (state, actions) => ({time: (state.time + 1) % NUM_TIMES}),

        setTime: (state, actions, time) => ({time}),
    },

    views: {

        start: (state, actions) => actions.start(),

        stop: (state, actions) => actions.stop(),

        setTime: (state, actions, views, time) => ({time}),

        nowPlaying: (state, actions, views, time) => time === state.time,

        play: (state, actions, views, {times, onattack, onrelease}) => {
            if (!state.on) return
            const notes = times[state.time]
            const prev = times[(state.time + NUM_TIMES - 1) % NUM_TIMES]
            notes.forEach((note, voice) => {
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