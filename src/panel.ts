import { h, Action } from 'hyperapp'
import { range, RangeProps, pushButtonGroup, label } from './lib/components'
import {
    InstrumentSettings,
    instrumentDefaults,
    setSettings,
} from './lib/synth'

export const init = () => ({ ...instrumentDefaults })

type WireProps<S> = {
    get: (state: S) => InstrumentSettings
    set: (s: S, x: InstrumentSettings) => S
}

export type State = InstrumentSettings

type Model<S> = State & {
    SetAttackTime: Action<S, number>
    SetDecayTime: Action<S, number>
    SetSustainLevel: Action<S, number>
    SetReleaseTime: Action<S, number>
    SetFilterCutoff: Action<S, number>
    SetFilterQ: Action<S, number>
    SetOctave: Action<S, number>
    SetAmpLevel: Action<S, number>
    SetOscillatorType: Action<S, Omit<OscillatorType, 'custom'>>
}

export const wire = <S>({ get, set }: WireProps<S>) => {
    const setAction =
        <X>(name: keyof InstrumentSettings): Action<S, X> =>
        (state: S, value: X) => {
            let settings = { ...get(state), [name]: value }
            return [set(state, settings), setSettings(settings)]
        }
    const SetAttackTime = setAction<number>('attackTime')
    const SetDecayTime = setAction<number>('decayTime')
    const SetSustainLevel = setAction<number>('sustainLevel')
    const SetReleaseTime = setAction<number>('releaseTime')
    const SetFilterCutoff = setAction<number>('filterCutoff')
    const SetFilterQ = setAction<number>('filterQ')
    const SetOctave = setAction<number>('octave')
    const SetAmpLevel = setAction<number>('ampLevel')
    const SetOscillatorType =
        setAction<Omit<OscillatorType, 'custom'>>('oscillatorType')

    return (state: S): Model<S> => ({
        ...get(state),
        SetAttackTime,
        SetDecayTime,
        SetSustainLevel,
        SetReleaseTime,
        SetFilterCutoff,
        SetFilterQ,
        SetOctave,
        SetAmpLevel,
        SetOscillatorType,
    })
}

const oscillatorTypeControl = <S>(model: Model<S>) =>
    h('p', {}, [
        label<S>('Oscillator'),
        pushButtonGroup<S, InstrumentSettings['oscillatorType']>({
            values: ['sawtooth', 'triangle', 'square', 'sine'],
            current: model.oscillatorType,
            setter: model.SetOscillatorType,
        }),
    ])

const sliderControl = <S>(props: RangeProps<S> & { label: string }) =>
    h<S>('p', {}, [label(props.label), range(props)])

const cutoffControl = <S>(model: Model<S>) =>
    sliderControl({
        label: 'Cutoff',
        min: 60,
        max: 7600,
        value: model.filterCutoff,
        set: model.SetFilterCutoff,
    })

const octaveControl = <S>(model: Model<S>) =>
    sliderControl({
        label: 'Octave',
        min: 1,
        max: 6,
        step: 1,
        value: model.octave,
        set: model.SetOctave,
    })

const resonanceControl = <S>(model: Model<S>) =>
    sliderControl({
        label: 'Resonance',
        max: 20,
        value: model.filterQ,
        set: model.SetFilterQ,
    })

const attackTimeControl = <S>(model: Model<S>) =>
    sliderControl({
        label: 'Attack time',
        max: 0.2,
        value: model.attackTime,
        set: model.SetAttackTime,
    })

const decayTimeContol = <S>(model: Model<S>) =>
    sliderControl({
        label: 'Decay time',
        max: 0.2,
        value: model.decayTime,
        set: model.SetDecayTime,
    })

const sustainLevelControl = <S>(model: Model<S>) =>
    sliderControl({
        label: 'Sustain level',
        max: 1.0,
        value: model.sustainLevel,
        set: model.SetSustainLevel,
    })

const releaseTimeControl = <S>(model: Model<S>) =>
    sliderControl({
        label: 'Release time',
        max: 1.0,
        value: model.releaseTime,
        set: model.SetReleaseTime,
    })

const gainControl = <S>(model: Model<S>) =>
    sliderControl({
        label: 'Gain',
        max: 1.0,
        value: model.ampLevel,
        set: model.SetAmpLevel,
    })

export const view = <S>(model: Model<S>) =>
    h('div', { class: 'panel' }, [
        h('div', { class: 'col1' }, [
            octaveControl(model),
            oscillatorTypeControl(model),
            cutoffControl(model),
            resonanceControl(model),
        ]),
        h('div', { class: 'col2' }, [
            attackTimeControl(model),
            decayTimeContol(model),
            sustainLevelControl(model),
            releaseTimeControl(model),
            gainControl(model),
        ]),
    ])
