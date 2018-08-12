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

        init: ({onselectvoice, onplay, onstop}) => (state, actions) => {

            window.addEventListener('keydown', ev => {
                if (ev.key !== ' ') return
                ev.preventDefault(true)
                actions.controlPress()
            })

            actions.selection.init({
                onselectcolumn: col => onselectvoice('ABCDEFGH'[col])
            })

            actions.playback.init({
                onstart: actions.selection.reset,
                onplayrow: actions.playRow,
                onstop: _ => {
                    actions.stopRecording()
                    onstop()
                },
            })
            return {onplay}
        },

        controlPress: _ => (state, actions) => {
            if (state.playback.playing) {
                actions.playback.stop()
            } else if (state.selection.haveSelection) {
                actions.setNoteOnSelection(null)
            } else {
                actions.playback.play()
            }
        },

        attack: ({note, voice}) => (state, actions) => {
            if (state.selection.haveSelection) actions.setNoteOnSelection(note)
            if (state.recording) actions.recordNote({note, voice})
        },

        release: _ => (state, actions) => {
            if (state.recording) {
                return {recordingNote: null}
            }
        },

        setNoteOnSelection: note => (state, actions) => {
            const notes = applySelection(state.selection, state.notes, note)
            actions.selection.reset()
            return { notes }
        },

        playRow: row => (state, actions) => {
            if (state.recordingNote) actions.setRecordedNote(state.recordingNote)
            state.notes[row].forEach((note, col) => {
                const voice = 'ABCDEFGH'[col]
                if (state.recordingNote && state.recordingNote.voice === voice) return
                state.onplay({voice: 'ABCDEFGH'[col], note})
            })
        },
        startRecording: _ => (state, actions) => {
            actions.playback.play()
            return {recording: true}
        },

        stopRecording: _ => ({recording: false, recordingNote: null}),

        recordNote: ({note, voice}) => (state, actions) => {
            actions.setRecordedNote({note, voice})
            return {recordingNote: {note, voice}}
        },

        setRecordedNote: ({note, voice}) => (state) => {
            const notes = state.notes.map((arr, row) => arr.map((oldNote, col) => {
                if (row === state.playback.row && 'ABCDEFGH'[col] === voice) return note
                return oldNote
            }))
            return {notes}
        },


    },

    view: (state, actions, views) => ({
        Controls: _ => (
            <span>
                <Button do={actions.startRecording} active={state.recording}>Rec</Button>
                <views.playback.PlayButton />
                <views.playback.StopButton />
                <Button do={_ => actions.setNote(null)}>X</Button>
            </span>
        ),
        Sequencer: _ => (
            <div class={css.scrollContainer}>
                <table class={css.sequencer}>
                    {state.notes.map((vals, row) => (
                        <tr onupdate={el => {
                            if (state.playback.playing && state.playback.row === row-5) el.scrollIntoView(false)
                        }}>
                            <td  onclick={_ => actions.playback.setRow(row)} class={css.time + (state.playback.row === row ? css.playing : '')}>{row}</td>
                            {vals.map((note, col) => (
                                <views.selection.Decorator row={row} col={col} disabled={state.playback.playing}>
                                    <td class={state.playback.row === row ? css.playing : false}>{noteName(note)}</td>
                                </views.selection.Decorator>
                            ))}
                        </tr>
                    ))}
                </table>
            </div>
        )
    })
}
