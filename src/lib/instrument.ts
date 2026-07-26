let ctx = new AudioContext()

/*
  ----
  AudioContext needs user interaction to be 
  allowed to run. Hence this snippet:
*/
async function unlockAudio() {
  if (ctx.state !== "running") {
    await ctx.resume()
  }
}
window.addEventListener("pointerdown", unlockAudio, { once: true })
window.addEventListener("keydown", unlockAudio, { once: true })
/* ---- */

export type OscillatorType = (typeof Instrument.OSCILLATOR_TYPES)[number]

export type InstrumentSettings = {
  octave: number
  oscillatorType: OscillatorType
  ampLevel: number
  sustainLevel: number
  attackTime: number
  decayTime: number
  releaseTime: number
  filterCutoff: number
  filterQ: number
}

export class Instrument {
  static TUNING_FREQ = 440 as const
  static TUNING_NOTE = 69 as const
  static OSCILLATOR_TYPES = ["sawtooth", "square", "triangle", "sine"] as const

  static defaultSettings: InstrumentSettings = {
    octave: 4,
    oscillatorType: "triangle",
    ampLevel: 0.3,
    sustainLevel: 0.6,
    attackTime: 0.02,
    decayTime: 0.04,
    releaseTime: 0.4,
    filterCutoff: 7600,
    filterQ: 10,
  }

  #oscillator: OscillatorNode
  #filter: BiquadFilterNode
  #envelope: GainNode
  #amplifier: GainNode

  #attackTime!: number
  #decayTime!: number
  #sustainLevel!: number
  #releaseTime!: number
  #octave!: number

  constructor(settings?: InstrumentSettings) {
    this.#oscillator = ctx.createOscillator()
    this.#filter = ctx.createBiquadFilter()
    this.#envelope = ctx.createGain()
    this.#amplifier = ctx.createGain()

    this.#oscillator.connect(this.#filter)
    this.#filter.connect(this.#envelope)
    this.#envelope.connect(this.#amplifier)
    this.#amplifier.connect(ctx.destination)

    this.#set(settings)

    this.#envelope.gain.value = 0
    this.#oscillator.start()
  }

  #set(settings?: InstrumentSettings) {
    settings = settings ?? Instrument.defaultSettings
    this.#octave
    this.#oscillator.type = settings.oscillatorType
    this.#filter.frequency.value = settings.filterCutoff
    this.#filter.Q.value = settings.filterQ
    this.#amplifier.gain.value = settings.ampLevel
    this.#attackTime = settings.attackTime
    this.#decayTime = settings.decayTime
    this.#sustainLevel = settings.sustainLevel
    this.#releaseTime = settings.releaseTime
    this.#octave = settings.octave
  }

  #noteToHz(note: number) {
    return (
      Math.exp(
        ((this.#octave * 12 + note - Instrument.TUNING_NOTE) * Math.log(2)) /
          12,
      ) * Instrument.TUNING_FREQ
    )
  }

  set(settings: InstrumentSettings) {
    this.#set(settings)
  }

  attack(note: number) {
    const freq = this.#noteToHz(note)
    var t = ctx.currentTime
    this.#oscillator.frequency.cancelScheduledValues(t)
    this.#envelope.gain.cancelScheduledValues(t)
    t += 0.01
    this.#oscillator.frequency.linearRampToValueAtTime(freq, t)
    this.#envelope.gain.linearRampToValueAtTime(0, t)
    t += this.#attackTime
    this.#envelope.gain.linearRampToValueAtTime(1, t)
    t += this.#decayTime
    this.#envelope.gain.linearRampToValueAtTime(this.#sustainLevel, t)
  }

  release() {
    var t = ctx.currentTime + 0.01
    this.#envelope.gain.cancelScheduledValues(t)
    t += this.#releaseTime
    this.#envelope.gain.linearRampToValueAtTime(0, t)
  }
}
