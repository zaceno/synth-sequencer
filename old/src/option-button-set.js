import {h} from 'hyperapp'
import cc from 'classcat'
import Button from './button'

export default props => props.options.map(opt => (
    <Button
        active={opt.value === props.value}
        do={ev => props.set(opt.value)}
    >
        {opt.name}
    </Button>
))
