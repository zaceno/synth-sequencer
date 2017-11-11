import './style.less'
import {h} from 'hyperapp'
import cc from 'classcat'
import synth from './synth'

const indices = [...Array(8).keys()]

export default {
    modules: {
        0: synth,
        1: synth,
        2: synth,
        3: synth,
        4: synth,
        5: synth,
        6: synth,
        7: synth,
    },

    state: { selected: 0 },
    
    actions: {
        select: (state, actions, voice) => ({selected: voice}),
        
        init: (state, actions, voices) => {
            const ctx = new (window.AudioContext || window.webkitAudioContext)()
            indices.forEach(i => actions[i].init(ctx))
        },
    },
    
    views: {
        getSelected: state => state.selected,

        select: (state, actions, views, voice) => actions.select(voice),

        stopAll: (state, actions) => indices.map(i => actions[i].stop()),

        attack: (state, actions, views, note) => actions[state.selected].attack(note),

        release: (state, actions, views, note) => actions[state.selected].release(note),

        attackVoice: (state, actions, views, {note, voice}) => actions[voice].attack(note),

        releaseVoice: (state, actions, views, {note, voice}) => actions[voice].release(note),    

        onload: (state, actions, views, data) => indices.forEach(voice => views[voice].onload(data[voice])),

        onsave: (state, actions, views) => indices.map(voice => views[voice].onsave()),

        panel: (state, actions, views) => views[state.selected].panel(),
        
        selector: (state, actions, views) => (
            <voice-selector>
                {indices.map(i => (
                    <button
                        onmousedown={_ => actions.select(i)}
                        class={cc({active: state.selected === i})}
                    >
                        Voice {i + 1}
                    </button>
                ))}
            </voice-selector>
        ),
    }
}