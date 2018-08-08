import {h, mount} from 'zxdom'
import css from './style.css'
import Keyboard from './keyboard'
import Soundbank from './synth'
import Sequencer from './sequencer'

const sequencer = Sequencer()

const soundbank = Soundbank({
    onselect: x => console.log('SELECTED', x)
})

const keyboard = Keyboard({
    onattack: note => soundbank.attack(note),
    onrelease: note => soundbank.release(note)
})



mount((
    <div class={css.appLayout}>
        <div class={css.appLayoutLeft}>
            <div class={css.mainPanel}>
                <soundbank.Selector />
                <soundbank.ControlPanel />
            </div>
            <keyboard.Keyboard />
        </div>
        <div class={css.appLayoutRight}>
            <sequencer.Sequencer />
        </div>
    </div>

), document.body)