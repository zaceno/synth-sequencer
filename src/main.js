import {h} from 'hyperapp'
import './style.less'

import keyboard from './keyboard'
import sequencer from './sequencer'
import soundbank from './soundbank'


export default {
    modules: {
        sequencer,
        keyboard,
        soundbank,
    },

    actions: {
        r: f => s => f(s),
        init: _ => (_, actions) => {
            actions.keyboard.init({
                onattack: note => actions.r(state => {
                    actions.soundbank.attackCurrent(note)
                    actions.sequencer.setNote(note)        
                }),
                onrelease: note => actions.r(state => {
                    actions.soundbank.releaseCurrent()
                    actions.sequencer.setNote(null)        
                }),
            })

            actions.sequencer.init({
                onselectvoice: actions.soundbank.select,
                onattackvoice: (voice, note) => actions.r(state => {
                    //let keyboard override what the sequencer plays:
                    if (voice === state.soundbank.selected && state.keyboard.pressed) return 
                    actions.soundbank.attack({voice, note})
                }),
                onstop: actions.soundbank.stopAll,
            })

            actions.soundbank.init({
                onselect: actions.sequencer.selection.reset
            })
        },
    },

    view: (state, actions, views) => (
        <div class="app-layout">
            <div class="app-layout-left">
                <div class="main-panel">
                    <views.sequencer.Controls />
                    <views.soundbank.Selector />
                    <views.soundbank.ControlPanel />
                </div>
                <views.keyboard.Keyboard />
            </div>
            <div class="app-layout-right">
                <views.sequencer.Sequencer />
            </div>
        </div>
    )
}