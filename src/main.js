import {h} from 'hyperapp'
import css from './css/main.css'

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
        init: _ => (_, actions) => {
            actions.keyboard.init({
                onattack: note => {
                    actions.soundbank.attackCurrent(note)
                    actions.sequencer.setNote(note)        
                },
                onrelease: _ => {
                    actions.soundbank.releaseCurrent()
                    actions.sequencer.setNote(null)        
                },
            })

            actions.sequencer.init({
                onselectvoice: actions.soundbank.select,
                onattackvoice: actions.sequencerAttackVoice,
                onstop: actions.soundbank.stopAll,
            })

            actions.soundbank.init({
                onselect: actions.sequencer.selection.reset
            })
        },

        sequencerAttackVoice: ({note, voice}) => (state, actions) => {
            //let keyboard override what the sequencer plays:
            if (voice === state.soundbank.selected && state.keyboard.pressed) return 
            actions.soundbank.attack({voice, note})
        },
    },

    view: (state, actions, views) => (
        <div class={css.container}>
            <div class={css.left}>
                <div class={css.mainPanel}>
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