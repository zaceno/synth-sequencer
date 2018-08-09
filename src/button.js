import {h} from 'hyperapp'
import css from './css/button.css'
import cc from 'classcat'
export default (props, children) => {
    let active = props.active
    delete props.active
    let cmd = props.do
    delete props.do
    return (
        <button
            {...props}
            class={cc({[css.active]: active})}
            onmousedown={cmd}
        >
            {children}
        </button>
    )
}
