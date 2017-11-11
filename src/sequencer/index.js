import './style.less'
import {h} from 'hyperapp'
import cc from 'classcat'
import selection from './selection'
import recording from './recording'
import playback from './playback'
import {NUM_TIMES, NOTE_NAMES} from './const'

/*
TODO:
move setRecordedNote, setNoteOnSelection
then move buttons and stuff to respective modules.
(means moving attack and release to views, perhaps have as a general rule to only call other modules views
in views)
*/


function noteName (note) {
    if (note === null) return ''
    return NOTE_NAMES[note]
}



export default {

    modules: {
        selection,
        recording,
        playback,
    },

    state: {
        times: [...Array(NUM_TIMES).keys()].map(_ => [...Array(8).keys()].map(_ => null)),
    },

    actions: {

        setTimes: (state, actions, times) => { if (times) return {times} },

        setRecordedNote: (state, actions) => {
            if (!state.recording.on) return
            if (state.recording.note === null) return
            state.times[state.playback.time][state.recording.voice] = state.recording.note
            actions.setTimes(state.times)
        },
    },

    views: {

        attack: (state, actions, {selection, recording}, {note, voice}) => {
            actions.setTimes(selection.setNote({grid: state.times, value: note}))
            recording.attack({note, voice})
        },

        release: (state, actions, {recording}, {note, voice}) => {
            recording.release({note, voice})
        },

        onsave: ({times}) => times,

        onload: (state, actions, views, times) => actions.setTimes(times),

        grid: (state, actions, {playback, selection}, {onattack, onrelease, onselectVoice}) => {
            playback.play({times: state.times, onattack, onrelease})
            actions.setRecordedNote()
            return (
                <table class="sequencer">
                {state.times.map((voices, time) => (
                    <tr>
                        <td class="time" onclick={_ => playback.setTime(time)}>{time}</td>
                        {voices.map((note, voice) => (
                            <selection.selectable row={time} col={voice} oncol={onselectVoice}>
                                <td class={cc({playing: playback.nowPlaying(time)})}>{noteName(note)}</td>
                            </selection.selectable>
                        ))}
                    </tr>
                ))}
                </table>
            )
        },
        
        controls: (state, actions, {playback, recording, selection}, {onstop}) => (
            <span>
                <recording.recordButton onstart={playback.start}/>
                <playback.startButton />
                <playback.stopButton onstop={_ => {
                    recording.stop()
                    onstop && onstop()
                }} />
                <selection.clearButton grid={state.times} />
            </span>
        )
    }
}
