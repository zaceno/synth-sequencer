import type { Action, Subscription } from "hyperapp"
import { Instrument, type InstrumentSettings } from "./lib/instrument"
import { localStorageGetItem, localStorageSetItem } from "./lib/localstorage"
import { onKeyUp, onKeyDown } from "./lib/keyboard-events"

export const OSCILLATOR_TYPES = Instrument.OSCILLATOR_TYPES
export const VOICES = ["A", "B", "C", "D", "E", "F", "G", "H"] as const
const SOUNDBANK = Object.fromEntries(VOICES.map(v => [v, new Instrument()]))
export const KEYBOARD_KEYS = [
  "z",
  "s",
  "x",
  "d",
  "c",
  "v",
  "g",
  "b",
  "h",
  "n",
  "j",
  "m",
  "q",
  "2",
  "w",
  "3",
  "e",
  "r",
  "5",
  "t",
  "6",
  "y",
  "7",
  "u",
  "i",
] as const

export const KEYBOARD_BLACK_KEYS = new Set([
  "s",
  "d",
  "g",
  "h",
  "j",
  "2",
  "3",
  "5",
  "6",
  "7",
])

export type KeyChar = (typeof KEYBOARD_KEYS)[number]
export type Voice = (typeof VOICES)[number]
export type SoundBankSettings = { [K in Voice]: InstrumentSettings }

export type State = {
  currentVoice: Voice
  pressedKey: null | KeyChar
  settings: SoundBankSettings
}

export const SelectVoice: Action<State, Voice> = (state, voice) => ({
  ...state,
  currentVoice: voice,
})

export const isKeyboardKey = (char: string): char is KeyChar => {
  return KEYBOARD_KEYS.includes(char as KeyChar)
}

export const PressKey: Action<State, string> = (state, char) => {
  if (!isKeyboardKey(char)) return state
  return [
    { ...state, pressedKey: char },
    () => SOUNDBANK[state.currentVoice].attack(KEYBOARD_KEYS.indexOf(char)),
  ]
}

export const ReleaseKey: Action<State, string> = (state, char) => {
  if (!isKeyboardKey(char)) return state
  if (state.pressedKey !== char) return state
  return [
    { ...state, pressedKey: null },
    () => SOUNDBANK[state.currentVoice].release(),
  ]
}

export const init: Action<State> = () => [
  {
    currentVoice: "A",
    pressedKey: null,
    settings: Object.fromEntries(
      VOICES.map(v => [v, Instrument.defaultSettings]),
    ) as SoundBankSettings,
  },
  localStorageGetItem({
    key: "synthsettings",
    callback: OnLoadSettings,
  }),
]

const OnLoadSettings: Action<State, SoundBankSettings> = (state, settings) => [
  {
    ...state,
    settings,
  },
  ...VOICES.map(voice => () => SOUNDBANK[voice].set(settings[voice])),
]

export const subscriptions = (): Subscription<State>[] => [
  onKeyUp(ReleaseKey),
  onKeyDown(PressKey),
]

export const setAction =
  <N extends keyof InstrumentSettings>(
    name: N,
  ): Action<State, InstrumentSettings[N]> =>
  (state, value) => {
    const instrumentSettings: InstrumentSettings = {
      ...state.settings[state.currentVoice],
      [name]: value,
    }
    const newSettings = {
      ...state.settings,
      [state.currentVoice]: instrumentSettings,
    }
    return [
      { ...state, settings: newSettings },
      () => SOUNDBANK[state.currentVoice].set(instrumentSettings),
      localStorageSetItem({ key: "synthsettings", data: newSettings }),
    ]
  }
