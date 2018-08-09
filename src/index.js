import './css/base.css'
import {app} from 'hyperapp'
import combineModules from './lib/combine-modules'
import main from './main'
const {state, actions, view} = combineModules(main)
const {init} = app(state, actions, view, document.body)
init()
