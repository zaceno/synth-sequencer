const {app, h} = require('hyperapp')
const hyperx = require('hyperx')
const html = hyperx(h, {attrToProp: false})
const events = require('hyperapp-events')
const views = require('hyperapp-module-views')

events(views(app))({
    modules: {
        input: require('./input'),
        synthcontrol: require('./synthcontrol'),
        sequencer: require('./sequencer'),
    },
    actions: {
        persistState: (state, actions, _, emit) => {
            localStorage.setItem('SYNTHDATA', JSON.stringify({
                voices: emit('persist:getVoices'),
                notes: emit('persist:getNotes')
            }))
        },
        loadState: (state, actions, _, emit) => {
            const data = localStorage.getItem('SYNTHDATA')
            if (!data) return
            const {voices, notes} = JSON.parse(data)
            if (voices) emit('persist:setVoices', voices)
            if (notes) emit('persist:setNotes', notes)        
        },
    },
    view: (state, actions, views) => html`
        <app-layout oncreate=${actions.loadState} onupdate=${actions.persistState} >
            <app-layout-left>
                <main-panel>
                    ${views.sequencer.controls()}
                    ${views.synthcontrol.voices()}
                    ${views.synthcontrol.panel()}
                </main-panel>
                ${views.input.keyboard()}
            </app-layout-left>
            <app-layout-right>
                ${views.sequencer.grid()}
            </app-layout-right>
        </app-layout>`,
})

