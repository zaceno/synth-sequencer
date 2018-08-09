import {h} from 'hyperapp'
import {NOTE_NAMES, SEQUENCER_INTERVAL, SEQUENCER_LENGTH} from './const'
import {module as selection, applySelection} from './selection'
import playback from './playback'
import Button from './button'
import css from './css/sequencer.css'

const noteName = note => {
    return ((note === null) ? '' : NOTE_NAMES[note])
}



export default {
    modules: {
        selection: selection(),
        playback: playback(),
    },
    state: { notes: [...Array(SEQUENCER_LENGTH).keys()].map(_ => [...Array(8).keys()].map(_ => null)) },
    actions: {

        init: ({onselectvoice, onattackvoice, onstop}) => (state, actions) => {

            window.addEventListener('keydown', ev => {
                if (ev.key !== ' ') return
                actions.setNote(null)
            })

            actions.selection.init({
                onselectcolumn: col => onselectvoice('ABCDEFGH'[col])
            })

            actions.playback.init({
                onplayrow: actions.playRow,
                onstop,
            })
            return {onattackvoice}
        },

        setNote: note => (state, actions) => {
            actions.selection.reset()
            return { notes: applySelection(state.selection, state.notes, note) }
        },

        playRow: row => (state, actions) => {
            state.notes[row].forEach((note, col) => state.onattackvoice({voice: 'ABCDEFGH'[col], note}))
        },
    },

    view: (state, actions, views) => ({
        Controls: _ => (
            <span>
                <views.playback.PlayButton />
                <views.playback.StopButton />
                <Button onclick={_ => actions.setNote(null)}>X</Button>
            </span>
        ),
        Sequencer: _ => (
            <table class={css.sequencer}>
                {state.notes.map((vals, row) => (
                    <tr>
                        <td  onclick={_ => actions.playback.setRow(row)} class={css.time + (state.playback.row === row ? css.playing : '')}>{row}</td>
                        {vals.map((note, col) => (
                            <views.selection.Decorator row={row} col={col}>
                                <td class={state.playback.row === row ? css.playing : false}>{noteName(note)}</td>
                            </views.selection.Decorator>
                        ))}
                    </tr>
                ))}
            </table>
        )
    })
}
