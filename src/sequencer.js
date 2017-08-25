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

function isSelected ({voice, start, end}, xVoice, xTime) {
    return voice === xVoice && ((xTime >= start && xTime <= end) || (xTime <= start && xTime >= end))
}



module.exports = emit => ({
    state: {
        times: [...Array(NUM_TIMES).keys()].map(_ => [...Array(8).keys()].map(_ => null)),
        selection: {
            selecting: false,
            start: -1,
            end: -1,
            voice: -1
        },
        playing: {
            recordNote: null,
            record: false,
            interval: null,
            time: -1,
        }
    },
    actions: {
        startSelecting (state, actions, [time, voice]) {
            state.selection.selecting = true
            state.selection.start = time
            state.selection.voice = voice
            emit('sequencer:selectVoice', voice)
            state.selection.end = time
            return state
        },
        setSelection (state, actions, time) {
            if (state.selection.selecting) {
                state.selection.end = time
                return state
            }
        },
        stopSelecting (state, actions, time) {
            state.selection.selecting = false;
            return state
        },
        setNote (state, actions, note) {
            if (state.selection.start === -1) return
            const {start, end, voice} = state.selection
            const [from, to] = start < end ? [start, end] : [end, start] 
            for (var i = from; i <= to; i++) {
                state.times[i][voice] = note
            }
            state.selection.start = -1
            state.selection.end = -1
            return state
        },
        _setRecordedNote (state, actions) {
            if (state.playing.record && state.playing.recordNote !== null) {
                state.times[state.playing.time][emit('voices:selectedIndex?')] = state.playing.recordNote
                return state
            }
        },
        _recordAttackNote (state, actions, note) {
            if (state.playing.record) {
                state.playing.recordNote = note
                return state
            }
        },
        recordAttackNote (state, actions, note) {
            actions._recordAttackNote(note),
            actions._setRecordedNote()
        },
        recordReleaseNote (state, actions, note) {
            state.playing.recordNote = null
        },
        _nextNote (state, actions) {
            const currentTime = state.playing.time
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
            state.playing.time = nextTime
            return state
        },
        nextNote (state, actions) {
            actions._nextNote()
            actions._setRecordedNote()
        },
        startPlaying (state, actions, record) {
            if (state.playing.interval) return
            state.playing.interval = setInterval(actions.nextNote, TIMESTEP)
            state.playing.record = record || false
            return state
        },
        startRecording (state, actions) {
            actions.startPlaying(true)
        },
        stopPlaying (state, actions) {
            if (state.playing.interval) clearInterval(state.playing.interval)
            state.playing.interval = null
            state.playing.record = false
            emit('sequencer:stopped')
            return state
        },
        setSavedTimes (state, actions, times) {
            if (!times) return
            state.times = times
            return state
        },
        setTime (state, actions, time) {
            state.playing.time = time
            return state
        }
    },
    events:  {
        'load': (state, actions) => {
            window.addEventListener('mouseup', actions.stopSelecting),
            window.addEventListener('keydown', ev => {
                if (ev.keyCode === 32) actions.setNote(null)
            })
        },
        'keyboard:attackNote': [
            (state, actions, note) => {
                actions.setNote(note)
                return note
            },
            (state, actions, note) => {
                actions.recordAttackNote(note)
                return note
            }
        ],
        'keyboard:releaseNote':  [
            (state, actions, note) => actions.recordReleaseNote(note)
        ],
        'persist:getNotes': (state, actions) => state.times,
        'persist:setNotes': (state, actions, notes) => actions.setSavedTimes(notes), 
    },

    views: {

        sequencer: (state, actions) => html`
            <table class="sequencer">
                ${state.times.map((voices, time) => html`
                <tr>
                    <td class="time" onclick=${_ => actions.setTime(time)}>${time}</td>
                    ${voices.map((note, voice) => html`
                    <td
                        class=${
                            (isSelected(state.selection, voice, time) ? 'selected' : '') +
                            (state.playing.time === time ? ' playing' : '')
                        }
                        onmousedown=${ev => {
                            ev.preventDefault(true)
                            actions.startSelecting([time, voice])
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
        
        controller: (state, actions) => html`
            <span>
                <button class=${!!state.playing.record ? 'active' : ''} onmousedown=${actions.startRecording}>Rec</button>
                <button class=${!!state.playing.interval ? 'active' : ''} onmousedown=${actions.startPlaying}>Play</button>
                <button onmousedown=${actions.stopPlaying}>Stop</button>
                <button onmousedown=${_ => actions.setNote(null)}>X</button>
            </span>`,
    }
})