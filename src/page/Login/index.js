import xs from 'xstream'
import isolate from '@cycle/isolate'
import {div, h1} from '@cycle/dom'
import {rect, text} from '../../driver/canvas-driver'

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
  return {
    DOM: xs.of(
      div({}, [
        h1('.login', 'Login page')
      ])),
    Canvas: xs.of(
      rect({draw: [{fill: 'skyblue'}]}, [
        renderGameOverSplash()
      ])
    )
  }
}

export default sources => isolate(Login)(sources)
