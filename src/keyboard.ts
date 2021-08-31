import { h, text, Action, Effect, Subscription } from 'hyperapp'
import { onkeyup, onkeydown } from './lib/keys'

export type State = string | null

const KEYS = [
    'z',
    's',
    'x',
    'd',
    'c',
    'v',
    'g',
    'b',
    'h',
    'n',
    'j',
    'm',
    'q',
    '2',
    'w',
    '3',
    'e',
    'r',
    '5',
    't',
    '6',
    'y',
    '7',
    'u',
    'i',
]

const BLACK = ['s', 'd', 'g', 'h', 'j', '2', '3', '5', '6', '7']

type WireProps<S> = {
    get: (state: S) => string | null
    set: (state: S, pressed: string | null) => S
    onattack: (x: number) => Effect<S>
    onrelease: () => Effect<S>
}

type Model<S> = {
    pressed: string | null
    Press: Action<S, string>
    Release: Action<S>
}

export const wire = <S>({ get, set, onattack, onrelease }: WireProps<S>) => {
    const Press: Action<S, string> = (state: S, key: string) => {
        let current = get(state)
        let pressed = KEYS.includes(key) ? key : null
        return [
            set(state, pressed),
            current && current !== pressed && onrelease(),
            pressed && current !== pressed && onattack(KEYS.indexOf(key)),
        ]
    }

    const Release: Action<S> = (state: S) => {
        let current = get(state)
        return [set(state, null), current && onrelease()]
    }

    return (state: S): Model<S> => ({
        pressed: get(state),
        Press,
        Release,
    })
}

export const view = <S>(model: Model<S>) =>
    h(
        'div',
        { class: 'keyboard' },
        KEYS.map(char =>
            h(
                'div',
                {
                    onmousedown: [model.Press, char],
                    onmouseup: model.Release,
                    class: {
                        key: true,
                        black: BLACK.includes(char),
                        pressed: char === model.pressed,
                    },
                },
                h('span', { class: 'char' }, text(char))
            )
        )
    )

export const subs = <S>(model: Model<S>) => [
    ...KEYS.map(char => onkeydown<S>(char, [model.Press, char])),
    !!model.pressed && onkeyup<S>(model.pressed, model.Release),
]

export const init = () => null
