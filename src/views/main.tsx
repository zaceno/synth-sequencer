import { type State } from "../main"
import Keyboard from "./keyboard"
import Soundbank from "./soundbank"
import Controls from "./controls"

export default (state: State) => (
  <main id="root">
    <Soundbank current={state.currentVoice} />

    <Controls settings={state.settings} current={state.currentVoice} />

    <Keyboard pressed={state.pressedKey} />
  </main>
)
