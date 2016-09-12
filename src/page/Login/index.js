import xs from 'xstream'
import isolate from '@cycle/isolate'
import {ul, li} from '@cycle/dom'
import {rect, text} from '../../driver/canvas-driver' // text
// import fromEvent from 'xstream/extra/fromEvent'

import pairwise from 'xstream/extra/pairwise'
import {difference, sortBy} from 'lodash'// intersection

function intent (keydownSource) {
  return keydownSource
    .map(ev => ev.code.replace('Key', ''))
    .filter(str => str.length === 1)
}

function model (action$) {
  const initialState = ['A']
  return action$.startWith(initialState).fold((acc, key) => {
    const index = acc.indexOf(key)
    if (index === -1) {
      return acc.concat(key).sort()
    }
    const newAcc = acc.slice()
    newAcc.splice(index, 1)
    return newAcc
  }, [])
}

function determineDeltaPoints (state$) {
  return state$.compose(pairwise).map(([before, after]) => {
    const addedPoints = difference(after, before).map(key =>
      ({key, value: 0, target: 1})
    )
    const removedPoints = difference(before, after).map(key =>
      ({key, value: 1, target: 0})
    )
    const points = addedPoints.concat(removedPoints)
    return xs.fromArray(sortBy(points, 'key'))
  }).flatten()
}

function expandAsRenderingFrames (point$) {
  return point$.map(point =>
    xs.periodic(10).mapTo(point).take(100)
  ).flatten()
}

function calculateAnimationSteps (point$) {
  function incorporateNewPoint (oldPoints, newPoint) {
    const index = oldPoints.findIndex(point => point.key === newPoint.key)
    let points
    if (index === -1 && newPoint.target === 1) {
      points = oldPoints.concat(newPoint)
    } else {
      points = oldPoints.slice()
      points[index] = newPoint
    }
    return points
  }

  function progressEachPoint (oldPoints, newPoints) {
    return newPoints.map(newPoint => {
      const target = newPoint.target
      const oldPoint = oldPoints.find(p => p.key === newPoint.key)
      const value = oldPoint ? oldPoint.value : newPoint.value
      return {
        ...newPoint,
        value: (Math.abs(target - value) < 0.01) ? target : value + (target - value) * 0.05
      }
    })
  }

  return point$.fold((acc, point) => {
    const newAcc = incorporateNewPoint(acc, point)
    const progressedAcc = progressEachPoint(acc, newAcc)
    const sanitizedAcc = progressedAcc.filter(point =>
      !(point.target === 0 && point.value === 0)
    )
    const sortedAcc = sortBy(sanitizedAcc, 'key')
    return sortedAcc
  }, [])
}

function animate (state$) {
  return state$
    .compose(determineDeltaPoints)
    .compose(expandAsRenderingFrames)
    .compose(calculateAnimationSteps)
}

function view (state$) {
  const animatedState$ = animate(state$)
  const ulStyle = {padding: '0', listStyle: 'none', display: 'flex'}
  // const liStyle = {fontSize: '50px'}
  return animatedState$.map(animStates =>
    ul({style: ulStyle}, animStates.map(animState =>
      li({style: {fontSize: `${animState.value * 50}px`}}, animState.key)
    ))
  )
}

function main (sources) {
  const key$ = intent(sources.keyboard.ups()) // intent(sources.Keydown)
  const state$ = model(key$)
  const vtree$ = view(state$)
  return {
    DOM: vtree$,
    Canvas: xs.of(
        rect({draw: [{fill: 'skyblue'}]}, [
          renderGameOverSplash()
        ])
      ),
    pixi: xs.of({
      graphics: [
        {
          id: 'ball',
          type: 'circle',
          x: 300,
          y: 300,
          radius: 3,
          fill: 0xFFFFFF,
          alpha: 1
        }
      ]
    })
  }
}

// function intent (state) {
//   return sources.keyboard.ups().map(ev => Object.assign( {num: 1+ev.displayKey} ))
//
// }
//
// function startState () {
//   return {
//     num: 1
//   }
// }
//
// const view = ({state}) => {
//   return {
//     DOM: xs.of(
//       div({}, [
//         h1('.login', state.num)
//       ])),
//     Canvas: xs.of(
//         rect({draw: [{fill: 'skyblue'}]}, [
//           renderGameOverSplash()
//         ])
//       )
//   }
// }
//
function renderGameOverSplash () {
  const props = {
    x: 400,
    y: 300,
    font: '72pt Arial',
    textAlign: 'center',
    value: 'Game Over'
  }

  const subTextProps = {
    x: 0,
    y: 50,
    font: '25pt Arial',
    textAlign: 'center',
    fillStyle: 'red',
    value: 'Press Space to play again'
  }

  return (
    text(props, [
      text({value: 'Press Space to play again', ...subTextProps})
    ])
  )
}

function Login (sources) {
  return main(sources)
  // const initialState = startState()
  // const actions$ = intent(sources)
  // const state$ = xs.combine(actions$, initialState).map((action, state) => action(state))
  // return state$.map(view)
  // return {
  //   DOM: xs.of(
  //     div({}, [
  //       h1('.login', 'Login page')
  //     ])),
  //   Canvas: xs.of(
  //       rect({draw: [{fill: 'skyblue'}]}, [
  //         renderGameOverSplash()
  //       ])
  //     )
  // }
}

export default sources => isolate(Login)(sources)
