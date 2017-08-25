const {h} = require('hyperapp')
const hyperx = require('hyperx')
const html = hyperx(h, {attrToProp: false})

const {Synth} = require('./synth')
const audioContext = new (window.AudioContext || window.webkitAudioContext)()

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

module.exports = emit => ({
    state: {
        selected: 0,
        list: [...Array(8).keys()].map(_ => new Synth(audioContext))
    },
    actions: {
        select: (_, __, index) => ({selected: index})
    },
    events: {
        'persist:getVoices': ({list}) => {
            return list.map(voice => {
                const props = {}
                VOICE_PROPS.forEach(name => {
                    props[name] = voice[name]
                })
                return props
            })
        },
        'persist:setVoices': ({list}, actions, saved) => {
            console.log(saved)
            saved.forEach((savedProps, i) => {
                VOICE_PROPS.forEach(propName => {
                    list[i][propName] = savedProps[propName]
                })
            })
        },
        'voices:selectedIndex?': ({selected}) => selected,
        'voices:selected?': ({list, selected}) => list[selected],
        'sequencer:stopped': ({list}) => list.forEach(voice => voice.stop()),
        'sequencer:selectVoice': (state, actions, voice) => actions.select(voice),
        'sequencer:attackNote': ({list}, _, {voice, note}) => list[voice].attack(note),
        'sequencer:releaseNote': ({list}, _, {voice, note}) => list[voice].release(note),
        'keyboard:attackNote': ({list, selected}, _, note) => list[selected].attack(note),
        'keyboard:releaseNote': ({list, selected}, _, note) => list[selected].release(note),
    },
    views: {
        voices: ({list, selected}, {select}) => html`
            <voice-selector>
                ${list.map((v, i) => html`
                <button
                    class=${selected === i ? 'active' : ''}
                    onmousedown=${_ => select(i)}
                >
                    Voice ${i + 1}
                </button>
                `)}
            </voice-selector>`,
    }
})