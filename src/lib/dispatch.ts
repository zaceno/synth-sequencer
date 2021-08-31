import { Dispatch, Dispatchable, Effect } from 'hyperapp'
const _dispatch = <S>(d: Dispatch<S>, x: Dispatchable<S>) => {
    d(x)
}
export default <S>(x: Dispatchable<S>): Effect<S, Dispatchable<S>> => [
    _dispatch,
    x,
]
