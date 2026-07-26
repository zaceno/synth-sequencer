import type { Action } from "hyperapp"
import { type InstrumentSettings, Instrument } from "../lib/instrument"

export const oscillatorTypes = Instrument.OSCILLATOR_TYPES

export type ControlProps<S> = {
  settings: InstrumentSettings
  setControls: Action<S, InstrumentSettings>
}

export const setAction =
  <S, N extends keyof InstrumentSettings>(
    props: ControlProps<S>,
    name: N,
  ): Action<S, InstrumentSettings[N]> =>
  (_, value) =>
    [props.setControls, { ...props.settings, [name]: value }]
