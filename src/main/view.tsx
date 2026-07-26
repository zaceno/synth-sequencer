import { type State, soundbank, AttackNote, ReleaseNote } from "./logic.ts"
import {
  getSettingsForCurrent,
  SetSettingsForCurrent,
} from "../soundbank/logic.ts"
import Keyboard from "../keyboard/view.tsx"
import ControlPanel from "../controls/view.tsx"
import "./style.css"
import VoiceSelector from "../soundbank/view"

export default (state: State) => (
  <main id="root">
    <VoiceSelector state={state} soundbank={soundbank} />
    <ControlPanel
      settings={getSettingsForCurrent(state, soundbank)}
      setControls={(_, settings) => [
        SetSettingsForCurrent,
        { soundbank, settings },
      ]}
    />
    <Keyboard
      pressed={state.note}
      onAttack={AttackNote}
      onRelease={ReleaseNote}
    />
  </main>
)
