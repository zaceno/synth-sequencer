import './style.less'
import initArray from '../init-array'
import {h} from 'hyperapp'
import cc from 'classcat'
import selection from './selection'
import recording from './recording'
import playback from './playback'
import {NUM_TIMES, NOTE_NAMES} from './const'
import {KeyDown} from '../components/key-events'
import {MouseUp} from '../components/mouse-events'


function noteName (note) {
    if (note === null) return ''
    return NOTE_NAMES[note]
}



function initGrid () {
    return initArray(NUM_TIMES, _ => initArray(8, _ => null))
}
export default {

    partials: {
        selection,
        recording,
        playback,
    },

    state: {
        times: initGrid(),
    },

    actions: {

        setTimes: state => times => ({times}),
        
        setTimesWith: (state, actions) => ({note, map}) =>
            actions.setTimes(map({value: note, grid: state.times})),

        setRecordedNote: (state, actions) => {
            if (!state.recording.on) return
            if (state.recording.note === null) return
            state.times[state.playback.time][state.recording.voice] = state.recording.note
            actions.setTimes(state.times)
        },
    },

    views: {

        attack: (state, actions, {selection, recording}) => ({note, voice}) => {
            if (state.selection.on) {
                actions.setTimesWith({note, map: selection.selectionMap})
            }
            recording.attack({note, voice})
        },

        release: (state, actions, {recording}) => ({note, voice}) => {
            recording.release({note, voice})
        },

        onsave: ({times}) => times,

        onload: (state, actions) => times => actions.setTimes(times),

        grid: (state, actions, {playback, selection, recording}) => ({onattack, onrelease, onselectVoice}) => (
            <table class="sequencer" onupdate={_ => {
                playback.play({
                    times: state.times,
                    onattack,
                    onrelease,
                    recordingVoice: recording.getVoice()
                })
                actions.setRecordedNote()
            }} >
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
        ),
        
        controls: (state, actions, {playback, recording, selection}) => ({onstop}) => (
            <span>
                <MouseUp then={actions.selection.stop} />
                <KeyDown key=" " then={_ => {
                    actions.setTimesWith({note: null, map: selection.map})
                }} />
                <recording.recordButton onstart={playback.start}/>
                <playback.startButton />
                <playback.stopButton onstop={_ => {
                    recording.stop()
                    onstop && onstop()
                }} />
                <button onmousedown={_ => {
                    actions.setTimesWith({note: null, map: selection.map})
                }}>X</button>
            </span>
        )
    }
}
