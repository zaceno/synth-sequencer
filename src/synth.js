import {span, input, button, div, p} from './tags'
import cc from 'classcat'
import {SYNTH_DEFAULTS, OSCILLATOR_TYPES, TUNING_NOTE, TUNING_FREQ} from './const'

function noteToHz (note, octave) {
    return Math.exp ((octave * 12 + note  - TUNING_NOTE) * Math.log(2) / 12) * TUNING_FREQ;
}

const Control = ({label}, children) => p([].concat(
    span({class: 'label'}, label),
    children
))

const Slider = ({label, value, set, min, max, step}) => Control({label},[
    input({
        type: 'range',
        min: min || 0,
        max: max,
        step: step || 'any',
        value,
        oninput: ev => set(ev.currentTarget.value)
    })
])

const Options = ({value, set, options, label}) =>  Control({label}, span(options.map(o =>
    button({
        class: cc({active: value === o }),
        onclick: _ => set(o)
    }, o)
)))


export default ($, ctx, data) => {
    $.set(data || SYNTH_DEFAULTS)
    $.set({playing: null}) //not playing any note at start

    //set up audio nodes
    const oscillator = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const envelope = ctx.createGain()
    const amplifier = ctx.createGain()
    oscillator.connect(filter)
    filter.connect(envelope)
    envelope.connect(amplifier)
    amplifier.connect(ctx.destination)
    
    //set paramaters on audio Nodes
    filter.type = 'lowpass'
    envelope.gain.value = 0
    oscillator.start()
    $.with(state => {
        oscillator.type = state.oscillatorType
        filter.frequency.value = state.filterCutoff
        filter.Q.value = state.filterQ
        amplifier.gain.value = state.ampLevel
    })()

    //define control widgets for the audio parameters:
    const controls = $.with((defs => Object.keys(defs).reduce((controls, key) => {
        const [widget, opts, onset] = defs[key]
        controls[key] = state => widget(Object.assign(opts, {
                value: state[key],
                set: x => {
                    $.set({[key]: x})
                    onset && onset(x)
                }
        }))
        return controls
    }, {}))({
        octave:         [Slider,  { label: 'Octave',        min: 1, max: 6, step: 1}],
        attackTime:     [Slider,  { label: 'Attack Time',   max: 0.2}],
        decayTime:      [Slider,  { label: 'Decay Time',    max: 0.2 }],
        sustainLevel:   [Slider,  { label: 'Sustain Level', max: 1.0}],
        releaseTime:    [Slider,  { label: 'Release Time',  max: 0.2 }],
        oscillatorType: [Options, { label: 'Oscillator',    options: OSCILLATOR_TYPES }, x => oscillator.type = x],
        filterCutoff:   [Slider,  { label: 'Cutoff',        min: 60, max: 7600}, x => filter.frequency.value = x],
        filterQ:        [Slider,  { label: 'Resonance',     max: 20}, x => filter.Q.value = x],
        ampLevel:       [Slider,  { label: 'Gain',          max: 1.0 }, x => amplifier.gain.value = x]
    }))

    const exposed = $.with({

        attack: (state, note) => {
            if (state.playing === note) return
            $.set({playing: note})
            const freq = noteToHz(note, state.octave)
            var t = ctx.currentTime
            oscillator.frequency.cancelScheduledValues(t)
            envelope.gain.cancelScheduledValues(t)
            t += 0.01
            oscillator.frequency.linearRampToValueAtTime(freq, t)
            envelope.gain.linearRampToValueAtTime(0, t)
            t += +state.attackTime
            envelope.gain.linearRampToValueAtTime(1, t)
            t += +state.decayTime
            envelope.gain.linearRampToValueAtTime(+state.sustainLevel, t)    
        },

        release: (state, note) => {
            if (state.playing !== note) return
            $.set({playing: null})
            var t = ctx.currentTime + 0.01
            envelope.gain.cancelScheduledValues(t)
            t += +state.releaseTime
            envelope.gain.linearRampToValueAtTime(0, t)
        },

        stop: state => exposed.release(state.playing),

        getPersistentData: state => state,

        panel: (state, actions, views) => div({class: 'synth-panel'}, [
            div({class: 'col-1'}, [
                controls.oscillatorType(),
                controls.octave(),
                controls.filterCutoff(),
                controls.filterQ()
            ]),
            div({class: 'col-2'}, [
                controls.attackTime(),
                controls.decayTime(),
                controls.sustainLevel(),
                controls.releaseTime(),
                controls.ampLevel()
            ])
        ])
    })
    return exposed
}