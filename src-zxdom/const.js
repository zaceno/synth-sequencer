
export const SEQUENCER_LENGTH = 32
export const SEQUENCER_INTERVAL = 100
export const NOTE_NAMES = [
    'C', 'C#', 'D', 'Eb',
    'E', 'F', 'F#', 'G',
    'Ab', 'A', 'Bb', 'B',
    'C', 'C#', 'D', 'Eb',
    'E', 'F', 'F#', 'G',
    'Ab', 'A', 'Bb', 'B',
    'C'
]
export const KEYBOARD_KEYS = [
    'z','s','x','d','c','v',
    'g','b','h','n','j','m',
    'q','2','w','3','e','r',
    '5','t','6','y','7','u',
    'i'
]

export const KEYBOARD_BLACK_KEYS = [
    's', 'd', 'g', 'h', 'j',
    '2', '3', '5', '6', '7'
]

export const SYNTH_DEFAULTS = {
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


export const OSCILLATOR_TYPES = ['sawtooth', 'square', 'triangle', 'sine']

export const TUNING_FREQ = 440;
export const TUNING_NOTE = 69;