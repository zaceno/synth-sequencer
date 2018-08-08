import Synth from './synth'
import {h, define, update} from 'zxdom'
import OptionButtonSet from '../option-buttons'

export default function (onselect) {

    const bank = {
        A: new Synth(),
        B: new Synth(),
        C: new Synth(),
        D: new Synth(),
        E: new Synth(),
        F: new Synth(),
        G: new Synth(),
        H: new Synth(),
    }

    var current = 'A'

    function select (synth) {
        current = synth
        update(Selector)
        update(ControlPanel)
        onselect(synth)
    }

    const ControlPanel = define(_ => h(bank[current].ControlPanel))

    const Selector = define(_ => (
        <div class="voice-selector">
            <OptionButtonSet
                options={'ABCDEFGH'.split('').map(n => ({name: `Voice ${n}`, value:n}))}
                set={select}
                value={current}
            />
        </div>
    ))

    function attack (note) {
        bank[current].attack(note)
    }
    function release (note) {
        bank[current].release(note)
    }
    
    return {attack, release, ControlPanel, Selector}
}
