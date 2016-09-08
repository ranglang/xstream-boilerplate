import 'es6-shim' // suppport more browsers
// External imports
import Cycle from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'
import {makeRouterDriver, supportsHistory} from 'cyclic-router'
import {createHistory, createHashHistory} from 'history'
import {makeCanvasDriver} from './driver/canvas-driver'
// import {makePixiDriver} from './driver/pixi-driver'

// Local imports
import main from 'page/main'

const history = supportsHistory()
  ? [createHistory(), {capture: true}]
  : [createHashHistory(), {capture: false}]

const drivers =
  {
    DOM: makeDOMDriver('#app', {transposition: false}),
    Canvas: makeCanvasDriver('#canvas', {width: 800, height: 600}),
    router: makeRouterDriver(...history)
    // pixi: makePixiDriver(document.getElementById('game'), 800, 600)
  }

Cycle.run(main, drivers)
