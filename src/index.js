import './style.less'
import zxState from 'zx-state'
import {h, patch} from 'picodom'
import {activate as activateKeyEvents} from './components/key-events'
import {activate as activateMouseEvents} from './components/mouse-events'
import keyboard from './keyboard'
import soundbank from './soundbank'
import sequencer from './sequencer'

const appDef = {
    sub: {
        keyboard,
        soundbank,
        sequencer
    },

    views: {
        loadState: (state, actions, views) => {
            const data = localStorage.getItem('SYNTHDATA')
            if (!data) return
            const {voices, notes} = JSON.parse(data)
            if (voices) views.soundbank.onload(voices)
            if (notes) views.sequencer.onload(notes)
        },

        saveState: (state, actions, views) => {
            localStorage.setItem('SYNTHDATA', JSON.stringify({
                voices: views.soundbank.onsave(),
                notes: views.sequencer.onsave()
            }))
        },

        main: (state, actions, {loadState, saveState, keyboard, soundbank, sequencer}) => (
            <app-layout>
                <app-layout-left>
                    <main-panel>
                        <sequencer.controls onstop={soundbank.stopAll} />
                        <soundbank.selector />
                        <soundbank.panel />
                    </main-panel>
                    <keyboard.keyboard 
                        onattack={note => {
                            soundbank.attack(note)
                            sequencer.attack({note, voice: soundbank.getSelected() })
                        }}
                        onrelease={note => {
                            soundbank.release(note)
                            sequencer.release({note, voice: soundbank.getSelected() })
                        }}
                    />
                </app-layout-left>
                <app-layout-right>
                    <sequencer.grid
                        selectedVoice={soundbank.getSelected() }
                        onselectVoice={i => soundbank.select(i) }
                        onattack={({note, voice}) => soundbank.attackVoice({note, voice})}
                        onrelease={({note, voice}) => soundbank.releaseVoice({note, voice})}
                    />
                </app-layout-right>
            </app-layout>
        )
    },
}

const onupdate = (_ => {
    var node
    return _ => {
        activateKeyEvents()
        activateMouseEvents()
        patch(node, (node = views.main()))
    }
})()

const init = _ => {
    actions.soundbank.init()
    views.loadState()
}

const {actions, views} = zxState(appDef, onupdate)
init()
