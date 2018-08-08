import Instrument from './instrument'
import {h, define, update} from 'zxdom'
import cc from 'classcat'
import {SYNTH_DEFAULTS, OSCILLATOR_TYPES} from '../const'
import css from './style.css'
import OptionButtonSet from '../option-buttons'

const Control = (props, children) => (
    <p>
        <span class={css.label}>{props.label}:</span>
        {children}
    </p>
)

const ControlSlider = props => (
    <Control label={props.label}>
        <input
            type="range"
            min={props.min || 0}
            max={props.max}
            step={props.step || 'any'}
            value={props.value}
            oninput={ev => props.set(+ev.currentTarget.value)}
        />
    </Control>
)

const ControlOptions = props => (
    <Control label={props.label}>
        <OptionButtonSet
            options={props.options.map(o => ({name: o, value: o}))}
            value={props.value}
            set={props.set}
        />
    </Control>
)

const ControlPanel = ({settings, set}) => {
    const controlProps = name => ({
        value: settings[name],
        set: x => set({[name]: x})
    })

    return (
        <div class={css.synthPanel}>
            <div class={css.col1}>
                <ControlSlider  label="Octave" {...controlProps('octave')} min={1} max={6} step={1} />
                <ControlOptions label="Oscillator" {...controlProps('oscillatorType')} options={OSCILLATOR_TYPES} />
                <ControlSlider  label="Cutoff" {...controlProps('filterCutoff')}   min={60} max={7600} />
                <ControlSlider  label="Resonance"  {...controlProps('filterQ')}        max={20} />
            </div>
            <div class={css.col2}>
                <ControlSlider label="Attack time"   {...controlProps('attackTime')}   max={0.2} />
                <ControlSlider label="Decay time"    {...controlProps('decayTime')}    max={0.2} />
                <ControlSlider label="Sustain level" {...controlProps('sustainLevel')} max={1.0} />
                <ControlSlider label="Release time"  {...controlProps('releaseTime')}  max={1.0} />
                <ControlSlider label="Gain"          {...controlProps('ampLevel')}     max={1.0} />
            </div>
        </div>
    )
}

export default class Synth{
    constructor () {
        this.instrument = new Instrument()
        this.settings = Object.assign({}, SYNTH_DEFAULTS)
        this.view = define(_ => ControlPanel({
            settings: this.settings,
            set: x => this.set(x)
        }))
    }
    get ControlPanel () { return this.view }
    set (props) {
        this.instrument.set(props)
        Object.assign(this.settings, props)
        update(this.view)
    }
    attack (note) { this.instrument.attack(note)}
    release (note) { this.instrument.release(note)}
}
