import {Slider, ButtonOptions} from '../components/controls'
import {h} from 'picodom'
import cc from 'classcat'

const DEFAULTS = {
    octave: 4,
    oscillatorType: 'triangle',
    ampLevel: 0.3,
    sustainLevel: 0.6,
    attackTime: 0.02,
    decayTime: 0.04,
    releaseTime: 0.4,
    filterCutoff: 7600,
    filterQ: 10,
}

const OSCILLATOR_TYPES = ['sawtooth', 'square', 'triangle', 'sine']

const controlModule = ({initial, widget: Widget, params, name}) => ({
    state: {value: initial},
    actions: {
        set: (state, actions, value) => ({value})
    },
    views: {
        control: (state, actions, views, {onset}) => {
            const widgetProps = Object.assign(params, {
                value: state.value,
                set: x => {
                    actions.set(x)
                    onset && onset(x)
                }
            })
            return (
                <p>
                    <label>
                        <span class="label">{name + ':'}</span>
                        {Widget(widgetProps)}
                    </label>
                </p>
            )
        }
    }
})

export const oscillatorType = controlModule({
    name: 'Oscillator',
    initial: DEFAULTS.oscillatorType,
    widget: ButtonOptions,
    params: {options: OSCILLATOR_TYPES}
})

export const filterCutoff = controlModule({
    name: 'Cutoff',
    initial: DEFAULTS.filterCutoff,
    widget: Slider,
    params: { min: 60, max: 7600 }
})

export const octave = controlModule({
    name: 'Octave',
    initial: DEFAULTS.octave,
    widget: Slider,
    params: { min: 1, max: 6, step: 1 }
})

export const filterQ = controlModule({
    name: 'Resonance',
    initial: DEFAULTS.filterQ,
    widget: Slider,
    params: {max: 20},
})

export const attackTime = controlModule({
    name: 'Attack Time',
    initial: DEFAULTS.attackTime,
    widget: Slider,
    params: {max: 0.2},
})

export const decayTime = controlModule({
    name: 'Decay Time',
    initial: DEFAULTS.decayTime,
    widget: Slider,
    params: {max: 0.2}
})

export const releaseTime = controlModule({
    name: 'Release Time',
    initial: DEFAULTS.releaseTime,
    widget: Slider,
    params: {max: 0.8}
})

export const sustainLevel = controlModule({
    name: 'Sustain Level',
    initial: DEFAULTS.sustainLevel,
    widget: Slider,
    params: {max: 1.0},
})

export const ampLevel = controlModule({
    name: 'Amp Level',
    initial: DEFAULTS.ampLevel,
    widget: Slider,
    params: {max: 1.0},
})
