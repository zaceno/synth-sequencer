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
            actions.keyboard.init({onpress: actions.keyPress})
            actions.sequencer.init({
                onselectvoice: actions.soundbank.select,
                onplay: actions.sequencerPlay,
                onstop: actions.soundbank.stopAll,
            })
            actions.soundbank.init({
                onselect: actions.sequencer.selection.reset
            })
        },

        sequencerPlay: ({note, voice}) => (state, actions) => {
            if (state.keyboard.pressed && voice === state.soundbank.selected) return
            actions.soundbank.play({note, voice})
        },

        keyPress: (note) => (state, actions) => {
            let voice = state.soundbank.selected
            actions.soundbank.play({note, voice})
            actions.sequencer.attack({note, voice})
        }
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