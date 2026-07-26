import type { Action, Dispatchable } from "hyperapp"

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

type KeyChar = (typeof KEYBOARD_KEYS)[number]

const isKeyboardKey = (key: string): key is KeyChar =>
  KEYBOARD_KEYS.includes(key as KeyChar)

const noteForKey = (key: KeyChar) => KEYBOARD_KEYS.indexOf(key)

export type KeyboardProps<S> = {
  pressed: number | null
  onAttack: Action<S, number>
  onRelease: Action<S>
}

export const attack = <S>(
  state: S,
  { props, char }: { props: KeyboardProps<S>; char: string },
): Dispatchable<S> => {
  if (!isKeyboardKey(char)) return state
  return [props.onAttack, noteForKey(char)]
}

export const release = <S>(
  state: S,
  { props, char }: { props: KeyboardProps<S>; char: string },
): Dispatchable<S> => {
  if (!isKeyboardKey(char)) return state
  if (KEYBOARD_KEYS[props.pressed ?? -1] !== char) return state
  return props.onRelease
}
