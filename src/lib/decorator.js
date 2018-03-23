function stackHandlers (attr, name, handler) {
    let orig = attr[name]
    attr[name] = (!orig ? handler : (...args) => {
        orig(...args)
        fn(...args)
    })
}

export default getDeco => (attr, children) => {
    const decorations = getDeco(attr)
    return children.map(child => {
        if (!child.attributes) return child
        for (let name in decorations) {
            if (name === 'class') {
                child.attributes.class = child.attributes.class + ' ' + decorations.class
            } else if (name.substr(0, 2) === 'on') {
                stackHandlers(child.attributes, name, decorations[name])
            } else {
                child.attributes[name] = decorations[name]
            }
        }
        return child
    })
}