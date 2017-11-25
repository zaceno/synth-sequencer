import {div, button} from './tags'
import cc from 'classcat'
import synth from './synth'

function initArray (length, fn) {
    const arr = []
    for(var i = 0; i < length; i ++) arr.push(fn(i))
    return arr
}
const indices = initArray(8, i => i)

export default ($, data, {onselect}) => {
    $.set({selected: 0})
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const synths = indices.map(i => $.sync(synth, ctx, data[i]))
    const getSelectedSynth = $.with(state => synths[state.selected])
    const select = i => {
        $.set({selected: i})
        onselect()
    }
    return {
        getSelected: $.with(state => state.selected),
        setSelected: i => $.set({selected: i}),
        getPersistentData: _ => synths.map(synth => synth.getPersistentData()),
        attackSelected: note => getSelectedSynth().attack(note),
        releaseSelected: note => getSelectedSynth().release(note),
        attack: (note, voice) => synths[voice].attack(note),
        release: (note, voice) => synths[voice].release(note),
        stopAll: _ => synths.forEach(s => s.stop()),
        selector: $.with(state =>
            div({class: 'voice-selector'}, synths.map((_, i) => 
                button({
                    onmousedown: _ => select(i),
                    class: cc({active: state.selected === i})
                }, 'Voice ' + (i + 1))
            ))
        ),
        panel: _ => getSelectedSynth().panel(),
    }
}