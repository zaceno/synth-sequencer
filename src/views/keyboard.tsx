import {
  type KeyChar,
  KEYBOARD_BLACK_KEYS,
  KEYBOARD_KEYS,
  PressKey,
  ReleaseKey,
} from "../main"

type KeyboardProps = { pressed: KeyChar | null }
export default (props: KeyboardProps) => (
  <div class="keyboard">
    {KEYBOARD_KEYS.map(char => (
      <div
        class={{
          keyboard__key: true,
          "keyboard__key--black": KEYBOARD_BLACK_KEYS.has(char),
          "keyboard__key--pressed": char === props.pressed,
        }}
        onpointerdown={[PressKey, char]}
        onpointerup={[ReleaseKey, char]}
      >
        <span class="keyboard__char">{char.toUpperCase()}</span>
      </div>
    ))}
  </div>
)
