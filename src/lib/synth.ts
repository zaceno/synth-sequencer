import { Instrument, InstrumentSettings, instrumentDefaults } from '../synth/'
import { Effect, Action, Dispatch } from 'hyperapp'

const instrument = new Instrument()

const _attack = (_: any, note: number) => {
    instrument.attack(note)
}
const _release = (_: any, x: any) => {
    instrument.release()
}
const _set = (_: any, settings: InstrumentSettings) => {
    instrument.settings = settings
}
const _get = <S>(
    dispatch: Dispatch<S>,
    action: Action<S, InstrumentSettings>
) => {
    dispatch(action, instrument.settings)
}
export const setSettings = <S>(
    settings: InstrumentSettings
): Effect<any, InstrumentSettings> => [_set, settings]
export const attack = (note: number): Effect<any, number> => [_attack, note]
export const release = (): Effect<any, any> => [_release, null]
export const getSettings = <S>(
    action: Action<S, InstrumentSettings>
): Effect<S, Action<S, InstrumentSettings>> => [_get, action]

export { instrumentDefaults, InstrumentSettings }
