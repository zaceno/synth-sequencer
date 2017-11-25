import {div, span, button, table, tr, td} from './tags'
import cc from 'classcat'
import {SEQUENCER_LENGTH, NOTE_NAMES, SEQUENCER_INTERVAL} from './const'



function noteName (note) {
    if (note === null) return ''
    return NOTE_NAMES[note]
}

function  initArray (length, fn) {
    const arr = []
    for(var i = 0; i < length; i ++) arr.push(fn(i))
    return arr
}

function initGrid () {
    return initArray(SEQUENCER_LENGTH, _ => initArray(8, _ => null))
}

export default ($, notes, {onselectVoice, getSelectedVoice, onattack, onrelease, onstop}) => {
    $.set({
        grid: notes || initGrid(),
        selecting: false,
        selectionStart: null,
        selectionEnd: null,
        playing: false,
        playInterval: null,
        playRow: 0,
        recording: false,
        recordingNote: null,
    })

    addEventListener('mouseup', ev => { actions.stopSelecting() })
    addEventListener('keydown', ev => {
        if (ev.key !== ' ') return
        ev.preventDefault(true)
        actions.clearSelection()
    })    

    const actions = $.with({

        startSelecting (state, rowIndex, colIndex) {
            if (state.selecting) return
            onselectVoice(colIndex)
            $.set({
                selecting: true,
                selectionStart: rowIndex,
                selectionEnd: rowIndex,
            })
        },

        selectRow (state, rowIndex) {
            if (!state.selecting) return
            $.set({selectionEnd: rowIndex})
        },

        stopSelecting (state) {
            if (!state.selecting) return
            $.set({selecting: false})
        },

        resetSelection () {
            $.set({
                selecting: false,
                selectionStart: null,
                selectionEnd: null,
            })
        },
         
        isSelected (state, rowIndex, colIndex) {
            if (state.selectionStart === null) return false
            if (colIndex !== getSelectedVoice()) return false
            const from = state.selectionStart
            const to = state.selectionEnd
            const [start, end] = from <= to ? [from, to] : [to, from]
            return rowIndex >= start && rowIndex <= end
        },


        setNoteOnSelection (state, note) {
            if (state.selectionStart === null) return
            const newGrid = state.grid.map((row, rowIndex) => {
                return row.map((val, colIndex) => {
                    if (actions.isSelected(rowIndex, colIndex)) {
                        return note
                    } else {
                        return val
                    }
                })
            })
            $.set({ grid: newGrid }),
            actions.resetSelection()
        },

        clearSelection () {
            actions.setNoteOnSelection(null)
        },

        startPlayback (state) {
            if (state.playing) return
            $.set({
                playing: true,
                playInterval: setInterval(actions.playNext, SEQUENCER_INTERVAL)
            })
        },
        
        playNext (state) {
            const currentIndex = state.playRow
            const nextIndex = (state.playRow + 1) % SEQUENCER_LENGTH
            $.set({playRow: nextIndex})
            const currentRow = state.grid[nextIndex]
            const prevRow = state.grid[currentIndex]
            currentRow.forEach((note, voice) => {
                const prevNote = prevRow[voice]
                if (prevNote === null) {
                    if (note !== null) {
                        onattack(note, voice)
                    }
                } else if (note === null) {
                    onrelease(prevNote, voice)
                } else if (prevNote !== note) {
                    onattack(note, voice)
                }
            })
            if (state.recordingNote) {
                state.grid[currentIndex][getSelectedVoice()] = state.recordingNote
                $.set({grid: state.grid})
            }
        },

        setPlayTime (state, playTime) {
            $.set({playTime})
        },

        stopPlayback (state) {
            if (!state.playing) return
            clearInterval(state.playInterval)
            $.set({
                playing: false,
                playInterval: null,
                recording: false,
                recordingNote: null,
            })
            onstop()
        },

        startRecording (state) {
            actions.startPlayback()
            $.set({recording: true})
        },

        setRecordedNote (state, note) {
            if (!state.recording) return
            $.set({recordingNote: note})
        }
    })


    return $.with({

        resetSelection () {
            actions.resetSelection()
        },

        attack (_, note) {
            actions.setNoteOnSelection(note)
            actions.setRecordedNote(note)
        },

        release () {
            actions.setRecordedNote(null)
        },

        getPersistentData (state) {
            return state.grid
        },

        grid: state => table({class: 'sequencer'}, state.grid.map((row, rowIndex) =>
            tr([].concat(
                td({
                    class: cc(["time", {playing: state.playTime === rowIndex}]),
                    onclick: _ => actions.setPlayTime(rowIndex),
                }, rowIndex),
                row.map((note, colIndex) => 
                    td({
                        class: cc({
                            playing: state.playRow === rowIndex,
                            selected: actions.isSelected(rowIndex, colIndex),
                        }),
                        onmousedown: ev => {
                            ev.preventDefault(true)
                            actions.startSelecting(rowIndex, colIndex)
                        },
                        onmousemove: ev => {
                            ev.preventDefault(true)
                            actions.selectRow(rowIndex)
                        },
                    }, noteName(note))
                )
            ))
        )),

        controls: state => span([
            button({
                onmousedown: actions.startRecording,
                class: cc({active: state.recording}),
            }, 'Rec'),
            button({
                onmousedown: actions.startPlayback,
                class: cc({active: state.playing}),
            }, 'Play'),
            button({onmousedown: actions.stopPlayback}, 'Stop'),
            button({onmousedown: actions.clearSelection}, 'X'),
        ]),
    })
}