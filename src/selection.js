import decorator from './lib/decorator'
import css from './css/sequencer.css'

const isSelected = (state, row, col) => {
    if (state.start === null) return false
    var r = (col === state.column && row >= state.start && row <= state.end)
    return r
}

export const applySelection = (state, notes, note) => {
    if (state.start === null) return notes
    return notes.map((rowvals, row) =>
        rowvals.map((val, col) =>
            isSelected(state, row, col) ? note : val
        )
    )
}

export const module = _ => ({

    state: {
        anchor: null,
        column: null,
        start: null,
        end: null,
        selecting: false,
        haveSelection: false,
    },

    actions: {
        _set: x => x,

        init: ({onselectcolumn}) => (state, actions) => {
            actions._set({onselectcolumn})
            actions.reset()
        },

        start: ({row, col}) => state => {
            state.onselectcolumn(col)
            return {
                selecting: true,
                haveSelection: true,
                anchor: row,
                column: col,
                start: row,
                end: row,
            }
        },

        select: ({row}) => state => {
            if (state.anchor === null) return
            return (row < state.anchor )
            ? {start: row, end:state.anchor}
            : {start: state.anchor, end: row}
        },

        end: ({row}) => ({anchor: null, selecting: false}),

        reset: _ => ({
            anchor: null,
            column: null,
            start: null,
            end: null,
            selecting: false,
            haveSelection: false
        })
    },

    view: (state, actions) => ({
        Decorator: decorator(({row, col, disabled}) => (!disabled ?  {
            onmousedown: ev => {
                ev.preventDefault(true)
                actions.start({row, col})
            },
            onmouseup: ev => {
                ev.preventDefault(true)
                actions.end({row, col})
            },
            onmouseover: ev => {
                ev.preventDefault(true)
                actions.select({row, col})
            },
            class: isSelected(state, row, col) ? css.selected : ''
        } : {}))
    })
})
