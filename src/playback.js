import {h} from 'hyperapp'
import {SEQUENCER_INTERVAL, SEQUENCER_LENGTH} from './const'

export default _ => ({
    state: {
        playing: false,
        interval: null,
        row: null,
    },

    actions: {
        init: ({onplayrow, onstop}) => ({onplayrow, onstop}),
        setRow: row => ({row}),
        next: _ => (state, actions) => {
            var row = (state.row + 1) % SEQUENCER_LENGTH
            state.onplayrow(row)
            actions.setRow(row)
        },
        play: _ => (state, actions) => {
            if (state.interval) return
            actions.setRow((state.row || 0) - 1)
            return ({playing: true, interval: setInterval(actions.next, SEQUENCER_INTERVAL)})
        },
        stop: _ => (state, actions) => {
            state.interval && clearInterval(state.interval)
            state.onstop()
            return ({playing: false, interval: null})
        }
    },

    view: (state, actions) => ({
        PlayButton: _ => (
            <button
                onclick={actions.play}
                class={state.interval && 'active'}
            >
                Play
            </button>
        ),
        StopButton: _ => (
            <button
                onclick={actions.stop}
                onmousedown={ev => ev.currentTarget.classList.add('active')}
                onmouseup={ev => ev.currentTarget.classList.remove('active')}
            >
                Stop
            </button>
        ),
    })
})