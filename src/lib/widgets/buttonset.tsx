import type { Action, ClassProp } from "hyperapp"
export default <S, O extends readonly string[]>({
  options,
  cls,
  content,
  selected,
  onSelect,
}: {
  cls?: ClassProp
  options: O
  selected: O[number]
  content: (option: O[number]) => JSX.Element
  onSelect: Action<S, O[number]>
}) => (
  <div class={["buttonset", cls]}>
    {options.map(option => (
      <button
        onmousedown={[onSelect, option]}
        class={[{ "buttonset--selected": selected === option }]}
        type="button"
      >
        {content(option)}
      </button>
    ))}
  </div>
)
