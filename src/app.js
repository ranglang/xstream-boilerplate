import 'es6-shim' // suppport more browsers
// External imports
import Cycle from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'
import {makeRouterDriver, supportsHistory} from 'cyclic-router'
import {createHistory, createHashHistory} from 'history'
import {makeCanvasDriver} from './driver/canvas-driver'
import { makePixiDriver } from './driver/pixi-driver'

// import {makeAnimationDriver} from 'cycle-animation-driver';
import { makeKeyboardDriver } from 'cycle-keyboard'

// Local imports
import main from 'page/main'

const history = supportsHistory()
  ? [createHistory(), {capture: true}]
  : [createHashHistory(), {capture: false}]

// function makeKeysDriver () {
//   const keydown$ = Observable.fromEvent(document, 'keydown');
//
//   function isKey (key) {
//     if (typeof key !== 'number') {
//       key = keycode(key);
//     }
//
//     return (event) => {
//       return event.keyCode === key;
//     };
//   }
//
//   return function keysDriver () {
//     return {
//       pressed: (key) => keydown$.filter(isKey(key))
//     };
//   };
// }

const drivers =
  {
    DOM: makeDOMDriver('#app', {transposition: false}),
    Canvas: makeCanvasDriver('#canvas', {width: 800, height: 600}),
    keyboard: makeKeyboardDriver(),
    pixi: makePixiDriver(document.getElementById('game'), 800, 600),
    router: makeRouterDriver(...history)
  }

Cycle.run(main, drivers)
