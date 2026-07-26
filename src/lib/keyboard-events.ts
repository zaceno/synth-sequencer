import type { Action, Dispatch } from "hyperapp"

type OnKeyDownOptions<S> = {
  handler: Action<S, string>
}
const _onKeyDown = <S>(dispatch: Dispatch<S>, options: OnKeyDownOptions<S>) => {
  const handler = (ev: KeyboardEvent) => {
    if (ev.repeat) return
    dispatch(options.handler, ev.key)
  }
  window.addEventListener("keydown", handler)
  return () => {
    window.removeEventListener("keydown", handler)
  }
}

export const onKeyDown = <S>(handler: Action<S, string>) =>
  [_onKeyDown, { handler }] as const

type OnKeyUpOptions<S> = { handler: Action<S, string> }

const _onKeyUp = <S>(dispatch: Dispatch<S>, options: OnKeyUpOptions<S>) => {
  const handler = (ev: KeyboardEvent) => {
    dispatch(options.handler, ev.key)
  }
  window.addEventListener("keyup", handler)
  return () => {
    window.removeEventListener("keyup", handler)
  }
}

export const onKeyUp = <S>(handler: Action<S, string>) =>
  [_onKeyUp, { handler }] as const
