
const TUNING_FREQ = 440;
const TUNING_NOTE = 69;
const OSCILLATOR_TYPES = ['sawtooth', 'square', 'triangle', 'sine']
const FILTER_TYPES = ['bandpass', 'lowpass', 'highpass']  
const DEFAULTS = {
  octave: 4,
  oscillatorType: 'triangle',
  ampLevel: 0.3,
  sustainLevel: 0.6,
  attackTime: 0.02,
  decayTime: 0.04,
  releaseTime: 0.4,
  filterType: 'lowpass',
  filterCutoff: 7600,
  filterQ: 10,
}

function noteToHz (note, octave) {
  return Math.exp ((octave * 12 + note  - TUNING_NOTE) * Math.log(2) / 12) * TUNING_FREQ;
}


function fillDefaults(props) {
    props = props || {}
    return Object.assign({}, DEFAULTS, props)
}



class Synth {  
  constructor(audioContext, props) {
    props = fillDefaults(props)

    this._ctx = audioContext

    this._osc = this._ctx.createOscillator()
    this._osc.type = props.oscillatorType

    this._flt = this._ctx.createBiquadFilter()
    this._flt.type = props.filterType
    this._flt.frequency.value = props.filterCutoff
    this._flt.Q.value = props.filterQ

    this._env = this._ctx.createGain()
    this._env.gain.value = 0

    this._amp = this._ctx.createGain()
    this._amp.gain.value = props.ampLevel
    
    this._osc.connect(this._flt)
    this._flt.connect(this._env)
    this._env.connect(this._amp)
    this._amp.connect(this._ctx.destination)
    this._osc.start()

    this.octave = props.octave
    this.attackTime = props.attackTime
    this.decayTime = props.decayTime
    this.releaseTime = props.releaseTime
    this.sustainLevel = props.sustainLevel
    this._playing = false
  }
  
  get oscillatorType () { return this._osc.type }
  set oscillatorType (x) { this._osc.type = x }

  get ampLevel () { return this._amp.gain.value }
  set ampLevel (x) { this._amp.gain.value = x }

  get filterType () { return this._flt.type }
  set filterType (t) { this._flt.type = t }

  get filterCutoff () { return this._flt.frequency.value }
  set filterCutoff (v) { this._flt.frequency.value = v }

  get filterQ () { return this._flt.Q.value }
  set filterQ (v) { this._flt.Q.value = v }


  attack (note) {
    if (this._playing === note) return
    this._playing = note
    const freq = noteToHz(note, this.octave)
    var t = this._ctx.currentTime
    this._osc.frequency.cancelScheduledValues(t)
    this._env.gain.cancelScheduledValues(t)
    t += 0.01
    this._osc.frequency.linearRampToValueAtTime(freq, t)
    this._env.gain.linearRampToValueAtTime(0, t)
    t += +this.attackTime
    this._env.gain.linearRampToValueAtTime(1, t)
    t += +this.decayTime
    this._env.gain.linearRampToValueAtTime(+this.sustainLevel, t)
  }
  
  release (note) {
    if (this._playing !== note) return
    this._playing = null
    var t = this._ctx.currentTime + 0.01
    this._env.gain.cancelScheduledValues(t)
    t += +this.releaseTime
    this._env.gain.linearRampToValueAtTime(0, t)
  }
  
  stop () {
    if (this._playing === null) return
    this.release(this._playing)
  }
  
}


module.exports = {
    Synth,
    OSCILLATOR_TYPES,
    FILTER_TYPES
}