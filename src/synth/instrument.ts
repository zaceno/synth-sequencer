//@ts-ignore
const ctx = new (window.AudioContext || window.webkitAudioContext)()

const TUNING_FREQ = 440
const TUNING_NOTE = 69

function noteToHz(note: number, octave: number) {
    return (
        Math.exp(((octave * 12 + note - TUNING_NOTE) * Math.log(2)) / 12) *
        TUNING_FREQ
    )
}

export type InstrumentSettings = {
    octave: number
    attackTime: number
    decayTime: number
    releaseTime: number
    sustainLevel: number
    oscillatorType: Exclude<OscillatorType, 'custom'>
    filterCutoff: number
    filterQ: number
    ampLevel: number
}

export const instrumentDefaults: InstrumentSettings = {
    octave: 4,
    attackTime: 0.02,
    decayTime: 0.04,
    releaseTime: 0.4,
    sustainLevel: 0.6,
    oscillatorType: 'triangle',
    filterCutoff: 7600,
    filterQ: 10,
    ampLevel: 0.3,
}

export class Instrument {
    oscillator: OscillatorNode
    filter: BiquadFilterNode
    envelope: GainNode
    amplifier: GainNode

    octave: InstrumentSettings['octave'] = instrumentDefaults.octave
    attackTime: InstrumentSettings['attackTime'] = instrumentDefaults.attackTime
    decayTime: InstrumentSettings['decayTime'] = instrumentDefaults.decayTime
    releaseTime: InstrumentSettings['releaseTime'] =
        instrumentDefaults.releaseTime
    sustainLevel: InstrumentSettings['sustainLevel'] =
        instrumentDefaults.sustainLevel

    constructor() {
        this.oscillator = ctx.createOscillator()
        this.filter = ctx.createBiquadFilter()
        this.amplifier = ctx.createGain()

        this.settings = instrumentDefaults

        this.envelope = ctx.createGain()
        this.oscillator.connect(this.filter)
        this.filter.connect(this.envelope)
        this.envelope.connect(this.amplifier)
        this.amplifier.connect(ctx.destination)
        this.envelope.gain.value = 0
        this.oscillator.start()
    }

    get oscillatorType() {
        return this.oscillator.type as InstrumentSettings['oscillatorType']
    }
    set oscillatorType(t: InstrumentSettings['oscillatorType']) {
        this.oscillator.type = t
    }
    get filterCutoff() {
        return this.filter.frequency.value
    }
    set filterCutoff(x: InstrumentSettings['filterCutoff']) {
        this.filter.frequency.value = x
    }
    get filterQ() {
        return this.filter.Q.value
    }
    set filterQ(x: InstrumentSettings['filterQ']) {
        this.filter.Q.value = x
    }
    get ampLevel() {
        return this.amplifier.gain.value
    }
    set ampLevel(x: InstrumentSettings['ampLevel']) {
        this.amplifier.gain.value = x
    }
    get settings() {
        return {
            octave: this.octave,
            attackTime: this.attackTime,
            decayTime: this.decayTime,
            releaseTime: this.releaseTime,
            sustainLevel: this.sustainLevel,
            oscillatorType: this.oscillatorType,
            filterCutoff: this.filterCutoff,
            filterQ: this.filterQ,
            ampLevel: this.ampLevel,
        }
    }

    set settings(x: Partial<InstrumentSettings>) {
        let y = { ...instrumentDefaults, ...x }
        this.octave = y.octave
        this.attackTime = y.attackTime
        this.ampLevel = y.ampLevel
        this.releaseTime = y.releaseTime
        this.sustainLevel = y.sustainLevel
        this.oscillatorType = y.oscillatorType
        this.filterCutoff = y.filterCutoff
        this.filterQ = y.filterQ
    }

    attack(note: number) {
        const freq = noteToHz(note, this.octave)
        var t = ctx.currentTime
        this.oscillator.frequency.cancelScheduledValues(t)
        this.envelope.gain.cancelScheduledValues(t)
        t += 0.01
        this.oscillator.frequency.linearRampToValueAtTime(freq, t)
        this.envelope.gain.linearRampToValueAtTime(0, t)
        t += this.attackTime
        this.envelope.gain.linearRampToValueAtTime(1, t)
        t += this.decayTime
        this.envelope.gain.linearRampToValueAtTime(this.sustainLevel, t)
    }

    release() {
        var t = ctx.currentTime + 0.01
        this.envelope.gain.cancelScheduledValues(t)
        t += this.releaseTime
        this.envelope.gain.linearRampToValueAtTime(0, t)
    }
}
