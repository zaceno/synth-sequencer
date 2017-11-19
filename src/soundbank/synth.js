import {h} from 'picodom'
import cc from 'classcat'
import * as controls from './controls'


const TUNING_FREQ = 440;
const TUNING_NOTE = 69;


function noteToHz (note, octave) {
    return Math.exp ((octave * 12 + note  - TUNING_NOTE) * Math.log(2) / 12) * TUNING_FREQ;
}


export default {

   state: {
        audioContext: null,
        oscillatorNode: null,
        filterNode: null,
        envelopeNode: null,
        ampNode: null,
        playing: null,
    },
    
    sub: controls,

    actions: {
    
        init: (state, actions, ctx) => {
            const oscillator = ctx.createOscillator()
            oscillator.type = state.oscillatorType.value
            
            const filter = ctx.createBiquadFilter()
            filter.type = 'lowpass',
            filter.frequency.value = state.filterCutoff.value
            filter.Q.value = state.filterQ.value

            const envelope = ctx.createGain()
            envelope.gain.value = 0

            const amplifier = ctx.createGain()
            amplifier.gain.value = state.ampLevel.value

            oscillator.connect(filter)
            filter.connect(envelope)
            envelope.connect(amplifier)
            amplifier.connect(ctx.destination)
            oscillator.start()

            return {
                audioContext: ctx,
                oscillator,
                filter,
                envelope,
                amplifier,
            }
        },

        setNote: (state, actions, note) => ({playing: note})

    },


    views: {

        attack: (state, actions, views, note) => {
            if (state.playing === note) return
            actions.setNote(note)
            const freq = noteToHz(note, state.octave.value)
            var t = state.audioContext.currentTime
            state.oscillator.frequency.cancelScheduledValues(t)
            state.envelope.gain.cancelScheduledValues(t)
            t += 0.01
            state.oscillator.frequency.linearRampToValueAtTime(freq, t)
            state.envelope.gain.linearRampToValueAtTime(0, t)
            t += +state.attackTime.value
            state.envelope.gain.linearRampToValueAtTime(1, t)
            t += +state.decayTime.value
            state.envelope.gain.linearRampToValueAtTime(+state.sustainLevel.value, t)    
        },

        release: (state, actions, views, note) => {
            if (state.playing !== note) return
            actions.setNote(null)
            var t = state.audioContext.currentTime + 0.01
            state.envelope.gain.cancelScheduledValues(t)
            t += +state.releaseTime.value
            state.envelope.gain.linearRampToValueAtTime(0, t)
        },

        stop: (state, actions, {release}) => {
            if (state.playing === null) return
            release(state.playing)
        },

        onsave: state => ({
            oscillatorType: state.oscillatorType.value,
            octave:         state.octave.value,
            filterCutoff:   state.filterCutoff.value,
            filterQ:        state.filterQ.value,
            attackTime:     state.attackTime.value,
            decayTime:      state.decayTime.value,
            sustainLevel:   state.sustainLevel.value,
            releaseTime:    state.releaseTime.value,
            ampLevel:       state.ampLevel.value,
        }),

        onload: (state, actions, views, values) => {
            actions.oscillatorType.set(values.oscillatorType)
            actions.octave.set(values.octave)
            actions.filterCutoff.set(values.filterCutoff)
            actions.filterQ.set(values.filterQ)
            actions.attackTime.set(values.attackTime)
            actions.decayTime.set(values.decayTime)
            actions.sustainLevel.set(values.sustainLevel)
            actions.releaseTime.set(values.releaseTime)
            actions.ampLevel.set(values.ampLevel)

            state.oscillator.type = values.oscillatorType
            state.filter.frequency.value = values.filterCutoff
            state.filter.Q.value = values.filterQ
            state.amplifier.gain.value = values.ampLevel
        },

        panel: (state, actions, views) => (
            <synth-panel>
                <div class="col-1">
                    <views.oscillatorType.control onset={v => (state.oscillator.type = v)} />
                    <views.octave.control />
                    <views.filterCutoff.control onset={v => (state.filter.frequency.value = v)} />
                    <views.filterQ.control onset={v => (state.filter.Q.value = v)} />
                </div>
                <div class="col-2">
                    <views.attackTime.control />
                    <views.decayTime.control />
                    <views.sustainLevel.control />
                    <views.releaseTime.control />
                    <views.ampLevel.control onset={v => (state.amplifier.gain.value = v)} />
                </div>
            </synth-panel>
        )
    }
}