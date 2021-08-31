import {h} from 'hyperapp'
import {SYNTH_DEFAULTS, OSCILLATOR_TYPES} from './const'
import voices from './voices'
import OptionButtonSet from './option-button-set'
import css from './css/synth.css'

const ctx = new (window.AudioContext || window.webkitAudioContext)()

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

export default voice => ({
    state: {
        ...SYNTH_DEFAULTS,
        current: null,
    },

    actions: {
        set: x => state => {
            voices.set(voice, x)
            return x
        },
        play: note => (state, actions) => {
            if (state.current === note) return
            if (note === null) {
                voices.release(voice)
            } else {
                voices.attack(voice, note)
            }
            return {current: note}
        },
        // release: _ => state => {
        //     if (state.current === null) return 
        //     voices.release(voice)
        //     return {current: null}
        // },
    },

    view: (state, actions, views) => {
        const controlProps = name => ({
            value: state[name],
            set: x => actions.set({[name]: x})
        })
        return {
            ControlPanel: _ => (
                <div class={css.synthPanel}>
                    <div class={css.col1}>
                        <ControlSlider  label="Octave"     {...controlProps('octave')}         min={1} max={6} step={1} />
                        <ControlOptions label="Oscillator" {...controlProps('oscillatorType')} options={OSCILLATOR_TYPES} />
                        <ControlSlider  label="Cutoff"     {...controlProps('filterCutoff')}   min={60} max={7600} />
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
    }
})
