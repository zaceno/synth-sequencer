import './style.less'
import zxState from 'zx-state'
import {patch} from 'picodom'
import {div} from './tags'
import Keyboard from './keyboard'
import Soundbank from './soundbank'
import Sequencer from './sequencer'

const main = $ => {
    const {voices, notes} = JSON.parse(localStorage.getItem('SYNTHDATA') || {})

    
    const soundbank = $.sync(Soundbank, voices, {
        onselect: _ => sequencer.resetSelection()
    })
    
    const keyboard  = $.sync(Keyboard, {
        onattack: note => {
            soundbank.attackSelected(note)
            sequencer.attack(note, soundbank.getSelected())
        },
        onrelease: note => {
            soundbank.releaseSelected(note)
            sequencer.release(note, soundbank.getSelected())
        }
    })
    
    const sequencer = $.sync(Sequencer, notes, {
        onselectVoice: i => soundbank.setSelected(i),
        onattack: (note, voice) => soundbank.attack(note, voice),
        onrelease: (note, voice) => soundbank.release(note, voice),
        getSelectedVoice: soundbank.getSelected,
        onstop: soundbank.stopAll,
    })

    return _ => {
        localStorage.setItem('SYNTHDATA', JSON.stringify({
            voices: soundbank.getPersistentData(),
            notes: sequencer.getPersistentData()
        }))    

        return div({class: 'app-layout'}, [
            div({class: 'app-layout-left'}, [
                div({class: 'main-panel'}, [
                    sequencer.controls(),
                    soundbank.selector(),
                    soundbank.panel()
                ]),
                keyboard()
            ]),
            div({class: 'app-layout-right'}, [
                sequencer.grid()
            ])
        ])
    }
}

//run:
var node
const view = zxState(main, _ => patch(node, (node = view())))
