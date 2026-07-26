import "./style.css"
import { type ControlProps, setAction } from "./logic.ts"
import Envelope from "./envelope.tsx"
import Oscillators from "./osciillators.tsx"
import RangeInput from "../lib/widgets/range-input.tsx"

const Control = (props: { label: string }, content: JSX.Element) => (
  <div class="controlpanel__control">
    <h4 class="controlpanel__label">{props.label}</h4>
    {content}
  </div>
)

export default <S,>(props: ControlProps<S>) => (
  <div class="controlpanel">
    <div class="controlpanel__left">
      <Control label="Oscillator">
        <Oscillators {...props} />
      </Control>

      <Control label="Cutoff">
        <RangeInput
          min={60}
          max={7600}
          step="any"
          value={props.settings.filterCutoff}
          setValue={setAction(props, "filterCutoff")}
        />
      </Control>

      <Control label="Resonance">
        <RangeInput
          max={30}
          step="any"
          value={props.settings.filterQ}
          setValue={setAction(props, "filterQ")}
        />
      </Control>

      <Control label="Octave">
        <RangeInput
          min={1}
          max={6}
          step={1}
          value={props.settings.octave}
          setValue={setAction(props, "octave")}
        />
      </Control>

      <Control label="gain">
        <RangeInput
          value={props.settings.ampLevel}
          setValue={setAction(props, "ampLevel")}
          max={1}
        />
      </Control>
    </div>

    <div class="controlpanel__right">
      <Control label="envelope">
        <Envelope {...props} />
      </Control>

      <Control label="Attack">
        <RangeInput
          min={0.0}
          max={0.2}
          step="any"
          value={props.settings.attackTime}
          setValue={setAction(props, "attackTime")}
        />
      </Control>

      <Control label="Decay">
        <RangeInput
          min={0.0}
          max={0.2}
          step="any"
          value={props.settings.decayTime}
          setValue={setAction(props, "decayTime")}
        />
      </Control>

      <Control label="sustain">
        <RangeInput
          min={0.0}
          max={1.1}
          step="any"
          value={props.settings.sustainLevel}
          setValue={setAction(props, "sustainLevel")}
        />
      </Control>

      <Control label="release">
        <RangeInput
          min={0}
          max={1}
          step="any"
          value={props.settings.releaseTime}
          setValue={setAction(props, "releaseTime")}
        />
      </Control>
    </div>
  </div>
)
