import { type ControlProps } from "./logic.ts"

const envelopePath = (
  attack: number,
  decay: number,
  sustain: number,
  release: number,
) =>
  `M 2 97 L ${Math.floor((attack * 394) / 1.5)} 3 l ${Math.floor(
    (decay * 394) / 1.5,
  )} ${Math.floor(97 - sustain * 97)} l ${Math.floor(
    394 - ((attack + decay + release) * 394) / 1.5,
  )} 0 L 396 97`

export default <S,>(props: ControlProps<S>) => (
  <svg
    class="controlpanel__envelope"
    viewBox="0 0 400 100"
    width="400"
    height="100"
  >
    <path
      d={envelopePath(
        props.settings.attackTime,
        props.settings.decayTime,
        props.settings.sustainLevel,
        props.settings.releaseTime,
      )}
    />
  </svg>
)
