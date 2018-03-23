import {h} from 'hyperapp'
import cc from 'classcat'

export default props => props.options.map(opt => (
    <button
        class={cc({active: opt.value === props.value})}
        onclick={ev => props.set(opt.value)}
    >
        {opt.name}
    </button>
))
