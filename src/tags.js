import {h} from 'picodom'

function makeTagFn (name) {
    return (props, children) => {
        return (typeof props === 'object' && !Array.isArray(props))
        ? h(name, props, children)
        : h(name, {}, props)
    }
}

function tagFactory (str) {
    return str.replace(/\s/g, '').split(',').reduce((coll, name) => {
        coll[name] = makeTagFn(name)
        return coll
    },{})
}

const tags = `
    table,
    tr,
    td,
    span,
    button,
    div,
    label,
    p,
    input,
`

const {
    table,
    tr,
    td,
    span,
    button,
    div,
    label,
    p,
    input,
} = tagFactory(tags)

export {
    table,
    tr,
    td,
    span,
    button,
    div,
    label,
    p,
    input,    
}