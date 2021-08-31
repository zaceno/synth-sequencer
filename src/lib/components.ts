import { h, text, Action, ElementVNode } from 'hyperapp'

const withTargetNumericValue =
    <S>(action: Action<S, number>) =>
    (state: S, ev: Event): S | [Action<S, number>, number] =>
        ev.target ? [action, +(ev.target as HTMLInputElement).value] : state

export const label = <S>(txt: string): ElementVNode<S> =>
    h('span', { class: 'label' }, text(txt))

export type PushButtonProps<S, T> = {
    value: T
    current: T | null
    setter: Action<S, T>
}
export const pushButton = <S, T>(
    props: PushButtonProps<S, T>
): ElementVNode<S> =>
    h(
        'button',
        {
            class: { active: props.value === props.current },
            onclick: [props.setter, props.value],
        },
        text('' + props.value)
    )

export type PushButtonGroupProps<S, T> = {
    values: T[]
    current: T | null
    setter: Action<S, T>
}
export const pushButtonGroup = <S, T>({
    values,
    setter,
    current,
}: PushButtonGroupProps<S, T>): ElementVNode<S> =>
    h(
        'span',
        { class: 'buttongroup' },
        values.map((value) => pushButton<S, T>({ value, setter, current }))
    )

export type RangeProps<S> = {
    set: Action<S, number>
    value: number
    min?: number
    max?: number
    step?: number
}

export const range = <S>(props: RangeProps<S>): ElementVNode<S> =>
    h('input', {
        type: 'range',
        min: props.min || 0,
        max: props.max,
        step: props.step || 'any',
        value: props.value,
        oninput: withTargetNumericValue(props.set),
    })
