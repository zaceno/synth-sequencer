const {h} = require('hyperapp')
const hyperx = require('hyperx')
const html = hyperx(h, {attrToProp: false})
const {OSCILLATOR_TYPES, FILTER_TYPES} = require('./synth')

const Slider = ({value, set, min, max, step}) => html`
    <input
        type="range"
        min=${min || 0}
        max=${max}
        step=${step || "any"}
        value=${value}
        oninput=${ev => set(ev.currentTarget.value)}
    />`


const ButtonOptions = ({options, value, set}) => html`
    <span>
        ${options.map(o => html`
            <button
                class=${value === o ? 'active' :'' }
                onclick=${_ => set(o)}
            >
                ${o}
            </button>
        `)}
    </span>`


module.exports = emit => ({
    actions: {
        setProp: (state, _, [name, val]) => {
            const synth = emit('voices:selected?')
            synth[name] = val
            return state //cause update.
        }
    },
    views: {
        synthpanel: (state, actions) => {
            const synth = emit('voices:selected?')
            const PropSlider = (props) => Slider(Object.assign({
                set: v => actions.setProp([props.name, v]),
                value: synth[props.name]
            }, props))

            const PropButtons = (props) => ButtonOptions(Object.assign({
                set: v => actions.setProp([props.name, v]),
                value: synth[props.name]
            }, props))

            return html`<synth-panel>
                <div class="col-1">
                    <p>
                        <label>Oscillator:</label>
                        ${PropButtons({name: 'oscillatorType', options: OSCILLATOR_TYPES})}
                    </p>
                    <p>
                        <label>Octave:</label>
                        ${PropSlider({name: 'octave', min:1, max:6, step: 1})}
                    </p>
                    <p>
                        <label>Filter:</label>
                        ${PropButtons({name: 'filterType', options: FILTER_TYPES})}
                    </p>
                    <p>
                        <label>Cutoff</label>
                        ${PropSlider({name: 'filterCutoff', min: 60, max: 7600})}
                    </p>
                    <p>
                        <label>Resonance</label>
                        ${PropSlider({name: 'filterQ', max: 20})}
                    </p>
                </div>
                <div class="col-2">
                    <p>
                        <label>Attack Time:</label>
                        ${PropSlider({name: 'attackTime', max: 0.2})}
                    </p>
                    <p>
                        <label>Decay Time:</label>
                        ${PropSlider({name: 'decayTime', max: 0.2})}
                    </p>
                    <p>
                        <label>Release Time:</label>
                        ${PropSlider({name: 'releaseTime', max: 1.0})}
                    </p>
                    <p>
                        <label>Sustain Level:</label>
                        ${PropSlider({name: 'sustainLevel', max: 1.0})}
                    </p>
                    <p>
                        <label>Amp Level:</label>
                        ${PropSlider({name: 'ampLevel', max: 1.0})}
                    </p>
                </div>
            </synth-panel>`
        },
    }
})