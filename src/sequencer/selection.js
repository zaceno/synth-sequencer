import cc from 'classcat'
import {h} from 'hyperapp'
import {KeyDown} from '../components/key-events'
import {MouseUp} from '../components/mouse-events'

export default {
    
    state: {
        start: -1,
        end: -1,
        selecting: false,
        col: null,
    },

    actions: {

        reset: _ => ({
            start: -1,
            end: -1,
            selecting: false,
        }),

        start: (state, actions, {row, col}) => ({
            selecting: true,
            start: row,
            end: row,
            col,
        }),

        set: (state, actions, {row}) => {
            if (!state.selecting) return
            return ({end: row})
        },

        stop: (state, actions) => ({selecting: false}),

    },

    views: {
        
        setNote: (state, actions, views, {value, grid}) => {
            if (state.start === -1) return
            const {start, end} = state
            const [from, to] = start < end ? [start, end] : [end, start] 
            for (var i = from; i <= to; i++) {
                grid[i][state.col] = value
            }
            actions.reset()
            return grid
        },

        isSelected: (state, actions, views, {row, col}) => {
            return  (
                col === state.col &&
                (
                    ( row >= state.start && row <= state.end ) ||
                    ( row <= state.start && row >= state.end )
                )
            )
        },

        selectable: (state, actions, views, {row, col, oncol}, children) => {
            return children.map(node => {
                node.props.class = cc([node.props.class, {
                    selected: views.isSelected({row, col})
                }])
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

        clearButton: (state, actions, views, {grid}) => [
            <MouseUp then={actions.stop} />,
            <KeyDown key=" " then={_ => views.setNote({note: null, grid})} />,
            <button onmousedown={_ => views.setNote({note: null, grid})}>X</button>,
        ],

    }
}

    