import type { Action } from "hyperapp"
import keyboardSubscriptions from "../keyboard/subscriptions.ts"
import {
  type SoundBankState,
  type SoundbankProps,
  InitializeSoundbank,
  AttackCurrentInstrument,
  ReleaseCurrentInstrument,
} from "../soundbank/logic.ts"

export type State = {
  note: null | number
  soundbank: SoundBankState
}

export const soundbank: SoundbankProps<State> = {
  setState: (state, soundbank) => ({ ...state, soundbank }),
  getState: state => state.soundbank,
}

export const AttackNote: Action<State, number> = (state, note) => [
  { ...state, note: note },
  d => d(AttackCurrentInstrument, { soundbank, note }),
]

export const ReleaseNote: Action<State> = state => [
  { ...state, note: null },
  d => d(ReleaseCurrentInstrument, soundbank),
]

export const init: Action<State> = () => [
  { note: null } as State,
  d => d(InitializeSoundbank, soundbank),
]

export const subscriptions = (state: State) => [
  ...keyboardSubscriptions({
    pressed: state.note,
    onAttack: AttackNote,
    onRelease: ReleaseNote,
  }),
]
