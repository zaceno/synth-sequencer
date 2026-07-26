import type { Dispatchable } from "hyperapp"
import { Instrument, type InstrumentSettings } from "../lib/instrument"
import {
  localStorageGetItem,
  localStorageSetItem,
} from "../lib/localstorage.ts"

export const VOICES = ["A", "B", "C", "D", "E", "F", "G", "H"] as const
type Voice = (typeof VOICES)[number]

//this is the singleton bank of audionodes we will interact with.
const SOUNDBANK = Object.fromEntries(VOICES.map(v => [v, new Instrument()]))

export type { InstrumentSettings }
type SoundBankSettings = { [K in Voice]: InstrumentSettings }

export type SoundBankState = {
  settings: SoundBankSettings
  current: Voice
}

export type SoundbankProps<S> = {
  setState: (state: S, local: SoundBankState) => S
  getState: (state: S) => SoundBankState
}

export const InitializeSoundbank = <S>(
  state: S,
  props: SoundbankProps<S>,
): Dispatchable<S> => {
  const current = VOICES[0]
  const settings = Object.fromEntries(
    VOICES.map(v => [v, Instrument.defaultSettings]),
  ) as SoundBankSettings
  return [
    props.setState(state, { current, settings }),
    localStorageGetItem({
      key: "synthsettings",
      callback: <S>(_: S, data: object) => [OnLoadSettings, { props, data }],
    }),
  ]
}

const OnLoadSettings = <S>(
  state: S,
  { props, data }: { props: SoundbankProps<S>; data: object },
): Dispatchable<S> => {
  const { current } = props.getState(state)
  const settings = data as SoundBankSettings
  return [
    props.setState(state, { current, settings }),
    ...VOICES.map(voice => () => SOUNDBANK[voice].set(settings[voice])),
  ]
}

export const SelectVoice = <S>(
  state: S,
  { soundbank, voice }: { soundbank: SoundbankProps<S>; voice: Voice },
): Dispatchable<S> =>
  soundbank.setState(state, { ...soundbank.getState(state), current: voice })

export const SetSettingsForCurrent = <S>(
  state: S,
  {
    soundbank,
    settings,
  }: { soundbank: SoundbankProps<S>; settings: InstrumentSettings },
): Dispatchable<S> => {
  const soundbankState = soundbank.getState(state)
  const current = soundbankState.current
  const allSettings = {
    ...soundbankState.settings,
    [current]: settings,
  }
  return [
    soundbank.setState(state, {
      current,
      settings: allSettings,
    }),
    () => SOUNDBANK[current].set(settings),
    localStorageSetItem({ key: "synthsettings", data: allSettings }),
  ]
}

export const getSettingsForCurrent = <S>(
  state: S,
  props: SoundbankProps<S>,
) => {
  const { current, settings } = props.getState(state)
  return settings[current]
}

export const AttackCurrentInstrument = <S>(
  state: S,
  { soundbank, note }: { soundbank: SoundbankProps<S>; note: number },
): Dispatchable<S> => [
  state,
  () => SOUNDBANK[soundbank.getState(state).current].attack(note),
]

export const ReleaseCurrentInstrument = <S>(
  state: S,
  soundbank: SoundbankProps<S>,
): Dispatchable<S> => [
  state,
  () => SOUNDBANK[soundbank.getState(state).current].release(),
]
