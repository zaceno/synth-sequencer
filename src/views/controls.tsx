import RangeInput from "../lib/widgets/range-input"
import ButtonSet from "../lib/widgets/buttonset"
import {
  OSCILLATOR_TYPES,
  type SoundBankSettings,
  type Voice,
  setAction,
} from "../main"

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

const Control = (props: { label: string }, content: JSX.Element) => (
  <div class="controlpanel__control">
    <h4 class="controlpanel__label">{props.label}</h4>
    {content}
  </div>
)

type ControlsProps = {
  settings: SoundBankSettings
  current: Voice
}

export default (props: ControlsProps) => (
  <div class="controlpanel">
    <div class="controlpanel__left">
      <Control label="Oscillator">
        <ButtonSet
          cls="oscillators"
          options={OSCILLATOR_TYPES}
          selected={props.settings[props.current].oscillatorType}
          content={option => oscillatorIcons[option]}
          onSelect={setAction("oscillatorType")}
        />
      </Control>

      <Control label="Cutoff">
        <RangeInput
          min={60}
          max={7600}
          step="any"
          value={props.settings[props.current].filterCutoff}
          setValue={setAction("filterCutoff")}
        />
      </Control>

      <Control label="Resonance">
        <RangeInput
          max={30}
          step="any"
          value={props.settings[props.current].filterQ}
          setValue={setAction("filterQ")}
        />
      </Control>

      <Control label="Octave">
        <RangeInput
          min={1}
          max={6}
          step={1}
          value={props.settings[props.current].octave}
          setValue={setAction("octave")}
        />
      </Control>

      <Control label="gain">
        <RangeInput
          value={props.settings[props.current].ampLevel}
          setValue={setAction("ampLevel")}
          max={1}
        />
      </Control>
    </div>

    <div class="controlpanel__right">
      <Control label="envelope">
        <svg
          class="controlpanel__envelope"
          viewBox="0 0 400 100"
          width="400"
          height="100"
        >
          <path
            d={envelopePath(
              props.settings[props.current].attackTime,
              props.settings[props.current].decayTime,
              props.settings[props.current].sustainLevel,
              props.settings[props.current].releaseTime,
            )}
          />
        </svg>
      </Control>

      <Control label="Attack">
        <RangeInput
          min={0.0}
          max={0.2}
          step="any"
          value={props.settings[props.current].attackTime}
          setValue={setAction("attackTime")}
        />
      </Control>

      <Control label="Decay">
        <RangeInput
          min={0.0}
          max={0.2}
          step="any"
          value={props.settings[props.current].decayTime}
          setValue={setAction("decayTime")}
        />
      </Control>

      <Control label="sustain">
        <RangeInput
          min={0.0}
          max={1.1}
          step="any"
          value={props.settings[props.current].sustainLevel}
          setValue={setAction("sustainLevel")}
        />
      </Control>

      <Control label="release">
        <RangeInput
          min={0}
          max={1}
          step="any"
          value={props.settings[props.current].releaseTime}
          setValue={setAction("releaseTime")}
        />
      </Control>
    </div>
  </div>
)
