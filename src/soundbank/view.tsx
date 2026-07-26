import ButtonSet from "../lib/widgets/buttonset.tsx"
import { type SoundbankProps, VOICES, SelectVoice } from "./logic.ts"
export default <S,>({
  state,
  soundbank,
}: {
  state: S
  soundbank: SoundbankProps<S>
}) => (
  <ButtonSet
    options={VOICES}
    selected={soundbank.getState(state).current}
    onSelect={(_, voice) => [SelectVoice, { soundbank, voice }]}
    content={voice => <span>{voice}</span>}
  />
)
