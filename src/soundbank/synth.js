import {h} from 'hyperapp'
import cc from 'classcat'
import {
    octave,
    oscillatorType,
    ampLevel,
    sustainLevel,
    attackTime,
    decayTime,
    releaseTime,
    filterCutoff,
    filterQ,
} from './controls'


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
    
    modules: {
        oscillatorType,
        octave,
        filterCutoff,
        filterQ,
        attackTime,
        releaseTime,
        decayTime,
        sustainLevel,
        ampLevel,
    },

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

        attack: (state, actions, note) => {
            if (state.playing === note) return
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

            return {playing: note}
        },

        release: (state, actions, note) => {
            if (state.playing !== note) return
            var t = state.audioContext.currentTime + 0.01
            state.envelope.gain.cancelScheduledValues(t)
            t += state.releaseTime.value
            state.envelope.gain.linearRampToValueAtTime(0, t)
            return {playing: null}
        },

        stop: (state, actions) => {
            if (state.playing === null) return
            actions.release(state.playing)
        },

    },


    views: {

        onsave: (state, actions) => ({
            oscillatorType: state.oscillatorType.value,
            octave: state.octave.value,
            filterCutoff: state.filterCutoff.value,
            filterQ: state.filterQ.value,
            attackTime: state.attackTime.value,
            decayTime: state.decayTime.value,
            sustainLevel: state.sustainLevel.value,
            releaseTime: state.releaseTime.value,
            ampLevel: state.ampLevel.value,
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

        panel: (state, actions, views) => <synth-panel>
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
    }
}