import ButtonSet from "../lib/widgets/buttonset.tsx"
import { type ControlProps, oscillatorTypes, setAction } from "./logic.ts"

const oscillatorIcons = {
  sawtooth: (
    <svg class="controlpanel__icon" viewBox="0 0 64 64" width="64" height="64">
      <path d="M4 48 L22 16 V48 L40 16 V48 L60 16" />
    </svg>
  ),

  sine: (
    <svg class="controlpanel__icon" viewBox="0 0 64 64" width="64" height="64">
      <path d="M4 32 C12 12, 20 12, 28 32 S44 52, 60 32" />
    </svg>
  ),

  square: (
    <svg class="controlpanel__icon" viewBox="0 0 64 64" width="64" height="64">
      <path d="M4 48 H18 V16 H32 V48 H46 V16 H60" />
    </svg>
  ),

  triangle: (
    <svg class="controlpanel__icon" viewBox="0 0 64 64" width="64" height="64">
      <path d="M4 48 L18 16 L32 48 L46 16 L60 48" />
    </svg>
  ),
}

export default <S,>(props: ControlProps<S>) => (
  <ButtonSet
    cls="oscillators"
    options={oscillatorTypes}
    selected={props.settings.oscillatorType}
    content={option => oscillatorIcons[option]}
    onSelect={setAction(props, "oscillatorType")}
  />
)
