import ButtonSet from "../lib/widgets/buttonset"
import { VOICES, SelectVoice, type Voice } from "../main"

type SoundbankProps = { current: Voice }
export default (props: SoundbankProps) => (
  <ButtonSet
    options={VOICES}
    selected={props.current}
    onSelect={SelectVoice}
    content={voice => <span>{voice}</span>}
  />
)
