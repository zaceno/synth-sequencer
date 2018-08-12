import {h} from 'hyperapp'
import {SEQUENCER_INTERVAL, SEQUENCER_LENGTH} from './const'
import Button from './button'

export default _ => ({
    state: {
        playing: false,
        interval: null,
        row: null,
    },

    actions: {
        init: ({onplayrow, onstop, onstart}) => ({onplayrow, onstop, onstart}),
        setRow: row => ({row}),
        next: _ => (state, actions) => {
            var row = (state.row + 1) % SEQUENCER_LENGTH
            state.onplayrow(row)
            actions.setRow(row)
        },
        play: _ => (state, actions) => {
            if (state.interval) return
            state.onstart()
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
            <Button
                do={actions.play}
                active={state.interval}
            >
                Play
            </Button>
        ),
        StopButton: _ => (<Button do={actions.stop}>Stop</Button>),
    })
})