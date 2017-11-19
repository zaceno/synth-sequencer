import cc from 'classcat'
import {h} from 'picodom'

export default {
    
    state: {
        start: -1,
        end: -1,
        selecting: false,
        on: false,        
        col: null,
    },

    actions: {

        reset: _ => ({
            on: false,
            start: -1,
            end: -1,
            selecting: false,
        }),

        start: (state, actions, {row, col}) => ({
            on: true,
            selecting: true,
            start: row,
            end: row,
            col,
        }),

        set: (state, actions, {row}) => {
            if (!state.selecting) return
            return ({end: row})
        },

        stop: _ => ({selecting: false}),

    },

    views: {
        
        map: (state, actions, views, {value, grid}) => {
            if (!state.on) return
            const {start, end} = state
            const [from, to] = start < end ? [start, end] : [end, start] 
            for (var i = from; i <= to; i++) {
                grid[i][state.col] = value
            }
            actions.reset()
            return grid
        },

        isSelected: (state, actions, views, {row, col}) => (
            col === state.col &&
            (
                ( row >= state.start && row <= state.end ) ||
                ( row <= state.start && row >= state.end )
            )
        ),

        selectable: (state, actions, {isSelected}, {row, col, oncol}, children) => {
            return children.map(node => {
                node.props.class = cc([node.props.class, {selected: isSelected({row, col}) }])
                node.props.onmousedown = ev => {
                    ev.preventDefault(true)
                    oncol(col)
                    actions.start({row, col})
                }
                node.props.onmousemove = ev => {
                    ev.preventDefault(true)
                    actions.set({row})
                }
                return node
            })
        },
    }
}

    