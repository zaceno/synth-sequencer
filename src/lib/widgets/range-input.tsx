import type { ClassProp, Action } from "hyperapp"

export default <S,>({
  cls,
  min,
  max,
  step,
  value,
  setValue,
}: {
  cls?: ClassProp
  min?: number
  step?: number | "any"
  max: number
  value: number
  setValue: Action<S, number>
}) => (
  <input
    class={["range-input", cls]}
    type="range"
    min={min ?? 0}
    max={max}
    step={step ?? "any"}
    value={value}
    oninput={(_: S, ev) => [setValue, +(ev.target as HTMLInputElement).value]}
  />
)
