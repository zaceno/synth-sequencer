import type { Dispatch, Action } from "hyperapp"

type LocalStorageGetItemOptions<S, T extends object> = {
  key: string
  callback: Action<S, T>
}
const _localStorageGetItem = <S, T extends object>(
  dispatch: Dispatch<S>,
  options: LocalStorageGetItemOptions<S, T>,
) => {
  const data = localStorage.getItem(options.key)
  if (!data) return
  try {
    const parsed = JSON.parse(data) as T
    dispatch(options.callback, parsed)
  } catch {}
  return
}
export const localStorageGetItem = <S, T extends object>(
  options: LocalStorageGetItemOptions<S, T>,
) => [_localStorageGetItem, options] as const

type LocalStorageSetItemOptions<T extends object> = {
  key: string
  data: T
}
const _localStorageSetItem = <T extends object>(
  _: Dispatch<any>,
  options: LocalStorageSetItemOptions<T>,
) => {
  localStorage.setItem(options.key, JSON.stringify(options.data))
}
export const localStorageSetItem = <T extends object>(
  options: LocalStorageSetItemOptions<T>,
) => [_localStorageSetItem, options] as const
