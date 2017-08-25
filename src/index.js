const {app, h} = require('hyperapp')
const hyperx = require('hyperx')
const html = hyperx(h, {attrToProp: false})
const partial = require('hyperapp-partial')

const emit = app({
    state: {},
    mixins: [
        partial,
        partial.mixin('keyboard',   require('./keyboard')),
        partial.mixin('synthpanel', require('./synthpanel')),
        partial.mixin('voices',     require('./voices')),
        partial.mixin('sequencer',  require('./sequencer')),
    ],
    events: {
        load (state, actions) {
            setTimeout(_ => {
                const data = localStorage.getItem('SYNTHDATA')
                if (!data) return
                const {voices, notes} = JSON.parse(data)
                if (voices) emit('persist:setVoices', voices)
                if (notes) emit('persist:setNotes', notes)
            }, 0)
        },
        update (state, actions) {
            setTimeout(_ => {
                localStorage.setItem('SYNTHDATA', JSON.stringify({
                    voices: emit('persist:getVoices'),
                    notes: emit('persist:getNotes')
                }))
            })
        }
    },
    view: (state, actions, views) => html`
        <app-layout>
            <app-layout-left>
                <main-panel>
                    ${views.sequencer.controller()}
                    ${views.voices.voices()}
                    ${views.synthpanel.synthpanel()}
                </main-panel>
                ${views.keyboard.keyboard()}
            </app-layout-left>
            <app-layout-right>
                ${views.sequencer.sequencer()}
            </app-layout-right>
        </app-layout>`,
})

