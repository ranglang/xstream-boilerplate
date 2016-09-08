import dropRepeats from 'xstream/extra/dropRepeats'
import isolate from '@cycle/isolate'
import {div} from '@cycle/dom'
import {eqProps} from 'ramda'

import {requireSources, mergeFlatten} from 'util/index'
import {text} from '../../driver/canvas-driver'

const canvas = renderGameOverSplash()
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

const equalPaths = eqProps('path')
const loading = div('.loading', 'Loading...')

const callComponent = sources => ({path, value}) => {
  const component = value({...sources, router: sources.router.path(path)})
  return {
    ...component,
    DOM: component.DOM.startWith(loading),
    Canvas: component.DOM.startWith(canvas)
  }
}

function ComponentRouter (sources) {
  requireSources('ComponentRouter', sources, 'routes$')

  const component$ = sources.routes$
    .map(routes => sources.router.define(routes)).flatten()
    .compose(dropRepeats(equalPaths)) // dont render the same page twice in a row
    .map(callComponent(sources))
    .remember()

  return {
    pluck: key => mergeFlatten(key, [component$]),
    DOM: mergeFlatten('DOM', [component$]),
    Canvas: mergeFlatten('Canvas', [component$]),
    route$: mergeFlatten('route$', [component$])
  }
}

export default sources => isolate(ComponentRouter)(sources)
