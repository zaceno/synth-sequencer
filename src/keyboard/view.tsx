import "./style.css"
import { type KeyboardProps, KEYBOARD_KEYS, attack, release } from "./logic"

const KEYBOARD_BLACK_KEYS = new Set([
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

export default <S,>(props: KeyboardProps<S>) => (
  <div class="keyboard">
    {KEYBOARD_KEYS.map(char => (
      <div
        class={{
          keyboard__key: true,
          "keyboard__key--black": KEYBOARD_BLACK_KEYS.has(char),
          "keyboard__key--pressed": char === KEYBOARD_KEYS[props.pressed ?? -1],
        }}
        onpointerdown={[attack, { props, char }]}
        onpointerup={[release, { props, char }]}
      >
        <span class="keyboard__char">{char.toUpperCase()}</span>
      </div>
    ))}
  </div>
)
