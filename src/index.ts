import { h, app, text, Dispatch, Effect } from 'hyperapp'
import * as Keyboard from './keyboard'
import { attack, release } from './lib/synth'
import dispatch from './lib/dispatch'
import * as Panel from './panel'

const multiFX = <S>(...fx: Effect<S>[]) => dispatch((s: S) => [s, ...fx])

type LogEffectOptions = { msg: any }
const _logEffect = (disp: Dispatch<any>, opts: LogEffectOptions) => {
    console.log('LOG', opts.msg)
}
const logEffect = (msg: any): Effect<any, LogEffectOptions> => [
    _logEffect,
    { msg },
]

type State = {
    keyboard: Keyboard.State
    panel: Panel.State
}

const keyboardModel = Keyboard.wire({
    get: (state: State) => state.keyboard,
    set: (state: State, keyboard: Keyboard.State) => ({ ...state, keyboard }),
    onattack: (note: number) =>
        multiFX(attack(note), logEffect('ATTACK' + note)),
    onrelease: () => multiFX(release(), logEffect('RELEASE')),
})

const panelModel = Panel.wire({
    get: (state: State) => state.panel,
    set: (state: State, panel: Panel.State) => ({ ...state, panel }),
})

app<State>({
    init: { keyboard: Keyboard.init(), panel: Panel.init() } as State,
    node: document.body,
    view: state =>
        h('body', {}, [
            Panel.view(panelModel(state)),
            Keyboard.view(keyboardModel(state)),
        ]),
    subscriptions: state => Keyboard.subs(keyboardModel(state)),
})
