import {TUNING_NOTE, TUNING_FREQ, SYNTH_DEFAULTS} from '../const'

function noteToHz (note, octave) {
    return Math.exp ((octave * 12 + note  - TUNING_NOTE) * Math.log(2) / 12) * TUNING_FREQ;
}

const ctx = new (window.AudioContext || window.webkitAudioContext)()

export default class Instrument {
    
    constructor () {
        this.oscillator = ctx.createOscillator()
        this.filter = ctx.createBiquadFilter()
        this.envelope = ctx.createGain()
        this.amplifier = ctx.createGain()

        this.oscillator.connect(this.filter)
        this.filter.connect(this.envelope)
        this.envelope.connect(this.amplifier)
        this.amplifier.connect(ctx.destination)
        this.set(SYNTH_DEFAULTS)
        this.envelope.gain.value = 0;
        this.oscillator.start()
    }

    set (props) {
        if (props.oscillatorType) this.oscillator.type = props.oscillatorType
        if (props.filterCutoff)   this.filter.frequency.value = props.filterCutoff
        if (props.filterQ)        this.filter.Q.value = props.filterQ
        if (props.ampLevel)       this.amplifier.gain.value = props.ampLevel
        if (props.attackTime)     this.attackTime = props.attackTime
        if (props.decayTime)      this.decayTime = props.decayTime
        if (props.sustainLevel)   this.sustainLevel = props.sustainLevel
        if (props.octave)         this.octave = props.octave
        if (props.releaseTime)    this.releaseTime = props.releaseTime
    }

    attack (note) {
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

    release () { 
        var t = ctx.currentTime + 0.01
        this.envelope.gain.cancelScheduledValues(t)
        t += this.releaseTime
        this.envelope.gain.linearRampToValueAtTime(0, t)
    }
}
