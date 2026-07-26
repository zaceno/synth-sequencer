import { onKeyUp, onKeyDown } from "../lib/keyboard-events"
import { attack, release, type KeyboardProps } from "./logic"
export default <S>(props: KeyboardProps<S>) => [
  onKeyUp((_, char) => [release, { props, char }]),
  onKeyDown((_, char) => [attack, { props, char }]),
]
