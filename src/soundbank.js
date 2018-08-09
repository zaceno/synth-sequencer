import {h} from 'hyperapp'
import synth from './synth'
import OptionButtonSet from './option-button-set'
import css from './css/soundbank.css'

export default {
    modules: {
        A: synth('A'),
        B: synth('B'),
        C: synth('C'),
        D: synth('D'),
        E: synth('E'),
        F: synth('F'),
        G: synth('G'),
        H: synth('H'),
    },
    state: {selected: 'A'},
    actions: {
        init: ({onselect}) => ({onselect}),
        select: x => ({selected: x}),
        attack: ({voice, note}) => (_, actions) => actions[voice].attack(note),
        attackCurrent: note => (state, actions) => actions[state.selected].attack(note),
        releaseCurrent: note => (state, actions) => actions[state.selected].release(),
        stopAll: _ => (_, actions) => { 'ABCDEFGH'.split('').forEach(v => actions[v].release() ) }
    },
    view: (state, actions, views) => ({
        ControlPanel: views[state.selected].ControlPanel,
        Selector: _ => (
            <div class={css.voiceSelector}>
                <OptionButtonSet
                    options={'ABCDEFGH'.split('').map(n => ({name: `Voice ${n}`, value:n}))}
                    set={x => {
                        actions.select(x)
                        state.onselect(x)
                    }}
                    value={state.selected}
                />
            </div>
        ),
    })
}