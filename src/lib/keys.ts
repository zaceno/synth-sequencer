import { Dispatch, Dispatchable, Subscription } from 'hyperapp'

type KeySubOpts<S> = {
    key: string
    action: Dispatchable<S>
}

const _onkeydown = <S>(dispatch: Dispatch<S>, opts: KeySubOpts<S>) => {
    const handler = (ev: KeyboardEvent) => {
        if (ev.key === opts.key) dispatch(opts.action, ev)
    }
    window.addEventListener('keydown', handler)
    return () => {
        window.removeEventListener('keydown', handler)
    }
}

export const onkeydown = <S>(
    key: string,
    action: Dispatchable<S>
): Subscription<S, KeySubOpts<S>> => [_onkeydown, { key, action }]

const _onkeyup = <S>(dispatch: Dispatch<S>, opts: KeySubOpts<S>) => {
    const handler = (ev: KeyboardEvent) => {
        if (ev.key === opts.key) dispatch(opts.action, ev)
    }
    window.addEventListener('keyup', handler)
    return () => {
        window.removeEventListener('keyup', handler)
    }
}

export const onkeyup = <S>(
    key: string,
    action: Dispatchable<S>
): Subscription<S, KeySubOpts<S>> => [_onkeyup, { key, action }]
