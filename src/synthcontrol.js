const {h} = require('hyperapp')
const hyperx = require('hyperx')
const html = hyperx(h, {attrToProp: false})

const {Synth, OSCILLATOR_TYPES, FILTER_TYPES} = require('./synth')

const audioContext = new (window.AudioContext || window.webkitAudioContext)()

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


const VOICE_PROPS = [
    'oscillatorType',
    'octave',
    'filterType',
    'filterCutoff',
    'filterQ',
    'attackTime',
    'decayTime',
    'releaseTime',
    'sustainLevel',
    'ampLevel',
]

module.exports = {
    state: {
        selectedVoice: 0,
        voices: [...Array(8).keys()].map(_ => new Synth(audioContext))
    },

    actions: {
        selectVoice: (state, actions, index) => ({selectedVoice: index}),

        stopAll: (state, actions) => {
            state.voices.forEach(synth => synth.stop())
        },

        setProp: (state, actions, [name, val]) => {
            state.voices[state.selectedVoice][name] = val
            return state //cause update.
        },

        attackNote: (state, actions, [voice, note]) => {
            state.voices[voice].attack(note)
        },

        releaseNote: (state, actions, [voice, note]) => {
            state.voices[voice].release(note)
        }
    },

    events: {
        'persist:getVoices': (state) => {
            return state.voices.map(voice => {
                const props = {}
                VOICE_PROPS.forEach(name => {
                    props[name] = voice[name]
                })
                return props
            })
        },
        'persist:setVoices': (state, actions, saved) => {
            saved.forEach((savedProps, i) => {
                VOICE_PROPS.forEach(propName => {
                    state.voices[i][propName] = savedProps[propName]
                })
            })
        },
        'sequencer:stopped': (state, actions) => {actions.stopAll()},
        'sequencer:selectVoice': (state, actions, voice) => {actions.selectVoice(voice)},
        'sequencer:attackNote': (state, actions, {voice, note}) => {actions.attackNote([voice, note])},
        'sequencer:releaseNote': (state, actions, {voice, note}) => {actions.releaseNote([voice, note])},
        'input:attackNote': (state, actions, note) => {actions.attackNote([state.selectedVoice, note])},
        'input:releaseNote': (state, actions, note) => {actions.releaseNote([state.selectedVoice, note])},
    },
    views: {

        voices: (state, actions) => html`
            <voice-selector>
                ${state.voices.map((v, i) => html`
                <button
                    class=${state.selectedVoice === i ? 'active' : ''}
                    onmousedown=${_ => actions.selectVoice(i)}
                >
                    Voice ${i + 1}
                </button>
                `)}
            </voice-selector>`,

        panel: (state, actions) => {
            const PropSlider = (props) => Slider(Object.assign({
                set: v => actions.setProp([props.name, v]),
                value: state.voices[state.selectedVoice][props.name]
            }, props))

            const PropButtons = (props) => ButtonOptions(Object.assign({
                set: v => actions.setProp([props.name, v]),
                value: state.voices[state.selectedVoice][props.name]
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
}