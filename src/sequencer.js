const {h} = require('hyperapp')
const hyperx = require('hyperx')
const html = hyperx(h, {attrToProp: false})
const TIMESTEP = 100
const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const NUM_TIMES = 32

function noteName (note) {
    if (note === null) return ''
    return NOTE_NAMES[note]
}

function isSelected ({voice, selStart, selEnd}, xVoice, xTime) {
    return voice === xVoice && ((xTime >= selStart && xTime <= selEnd) || (xTime <= selStart && xTime >= selEnd))
}



module.exports = {
    state: {
        mode: 'editing',
        times: [...Array(NUM_TIMES).keys()].map(_ => [...Array(8).keys()].map(_ => null)),
        selecting: false,
        selStart: -1,
        selEnd: -1,
        voice: -1,
        recordNote: null,
        record: false,
        interval: null,
        time: -1,
    },

    actions: {

        resetSelection: (state, actions) => ({
            selecting: false,
            selStart: -1,
            selEnd: -1,
            voice: -1
        }),

        startSelection: (state, actions, [time, voice], emit) => update => {
            if (state.mode !== 'editing') return
            update({
                selecting: true,
                selStart: time,
                voice: voice,
                selEnd: time,
            })
            emit('sequencer:selectVoice', voice)
        },

        stopSelection: (state, actions, time) => ({selecting: false}),

        setSelection: (state, actions, time) => update => {
            if (!state.selecting) return
            update({selEnd: time})
        },

        setNoteOnSelection: (state, actions, note) => update => {
            if (state.selStart === -1) return
            const {selStart, selEnd, voice} = state
            const [from, to] = selStart < selEnd ? [selStart, selEnd] : [selEnd, selStart] 
            for (var i = from; i <= to; i++) {
                state.times[i][voice] = note
            }
            update(state)
            actions.resetSelection()
        },

        _setRecordedNote (state, actions, data, emit) {
            if (state.record && state.recordNote !== null) {
                state.times[state.time][emit('voices:selectedIndex?')] = state.recordNote
                return state
            }
        },

        _recordAttackNote (state, actions, note) {
            if (state.record) {
                state.recordNote = note
                return state
            }
        },
        recordAttackNote (state, actions, note) {
            actions._recordAttackNote(note),
            actions._setRecordedNote()
        },
        recordReleaseNote (state, actions, note) {
            state.recordNote = null
        },
        _nextNote (state, actions, data, emit) {
            const currentTime = state.time
            const currentNotes = currentTime === -1 ? [...Array(8).keys()].map(_ => null) : state.times[currentTime]
            const nextTime = (currentTime + 1) % state.times.length
            const nextNotes = state.times[nextTime]
            for (var i = 0; i < 8; i ++) {
                if (currentNotes[i] !== nextNotes[i]) {
                    if (nextNotes[i] === null) {
                        emit('sequencer:releaseNote', {voice: i, note: currentNotes[i]})
                    } else {
                        emit('sequencer:attackNote', {voice: i, note: nextNotes[i]})
                    }
                }
            }
            state.time = nextTime
            return state
        },
        nextNote (state, actions) {
            actions._nextNote()
            actions._setRecordedNote()
        },
        startPlaying (state, actions, record) {
            if (state.interval) return
            state.interval = setInterval(actions.nextNote, TIMESTEP)
            state.record = record || false
            return state
        },
        startRecording (state, actions) {
            actions.startPlaying(true)
        },
        stopPlaying (state, actions, data, emit) {
            if (state.interval) clearInterval(state.interval)
            state.interval = null
            state.record = false
            emit('sequencer:stopped')
            return state
        },
        setSavedTimes (state, actions, times) {
            if (!times) return
            state.times = times
            return state
        },
        setTime (state, actions, time) {
            state.time = time
            return state
        }
    },
    init (state, actions) {
        window.addEventListener('mouseup', ev => actions.stopSelection())
        window.addEventListener('keydown', ev => {
            if (ev.keyCode === 32) actions.note(null)
        })
    },
    events:  {
        'input:attackNote':  (state, actions, note) => {
            if (state.mode === 'editing') {
                actions.setNoteOnSelection(note)
            }
            return note
        },
        'input:releaseNote':  [
            (state, actions, note) => actions.recordReleaseNote(note)
        ],
        'persist:getNotes': (state, actions) => state.times,
        'persist:setNotes': (state, actions, notes) => actions.setSavedTimes(notes), 
    },

    views: {

        grid: (state, actions) => html`
            <table class="sequencer">
                ${state.times.map((voices, time) => html`
                <tr>
                    <td class="time" onclick=${_ => actions.setTime(time)}>${time}</td>
                    ${voices.map((note, voice) => html`
                    <td
                        class=${
                            (isSelected(state, voice, time) ? 'selected' : '') +
                            (state.time === time ? ' playing' : '')
                        }
                        onmousedown=${ev => {
                            ev.preventDefault(true)
                            actions.startSelection([time, voice])
                        }}
                        onmouseover=${ev => {
                            ev.preventDefault(true)
                            actions.setSelection(time)
                        }}
                    >
                        ${noteName(note)}
                    </td>
                    `)}
                </tr>
                `)}
            </table>`,
        
        controls: (state, actions) => html`
            <span>
                <button class=${!!state.record ? 'active' : ''} onmousedown=${actions.startRecording}>Rec</button>
                <button class=${!!state.interval ? 'active' : ''} onmousedown=${actions.startPlaying}>Play</button>
                <button onmousedown=${actions.stopPlaying}>Stop</button>
                <button onmousedown=${_ => actions.setNote(null)}>X</button>
            </span>`,
    }
}
