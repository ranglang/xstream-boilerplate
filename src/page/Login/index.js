import xs from 'xstream'
import isolate from '@cycle/isolate'
import tween from 'xstream/extra/tween'
import {div, button, img} from '@cycle/dom'
// import {rect, text} from '../../driver/canvas-driver' // text
// import fromEvent from 'xstream/extra/fromEvent'

// import pairwise from 'xstream/extra/pairwise'
// import {difference, sortBy} from 'lodash'// intersection

function loginModal (value) {
  console.log(value)
  const loginModalStyle = {
    left: `${Math.round(value.x)}px`,
    top: `${Math.round(value.y)}px`,
    width: `${Math.round(value.width)}px`,
    height: `${Math.round(value.height)}px`,
    position: 'absolute',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'blue',
    paddingTop: '70px',
    border: 'none'
  }
  return div(
    [
      button('.cancle', {style: loginModalStyle}, 'Cancle')
    ]
  )
}

function main (sources) {
  const startState = {
    value: 0,
    x: 1920,
    y: 0,
    width: 0,
    height: 0
  }

  const openModal$ = sources.DOM.select('.login').events('click').mapTo()
  const closeModal$ = sources.DOM.select('.cancle').events('click').mapTo()

  let tweenY$ = tween({
    from: 0, to: 300, duration: 500, ease: tween.power3.easeIn
  })

  let tweenX$ = tween({
    from: 1024, to: 500, duration: 500, ease: tween.power3.easeIn
  })

  let tweenW$ = tween({
    from: 0, to: 500, duration: 500, ease: tween.power3.easeIn
  })

  let tweenH$ = tween({
    from: 0, to: 300, duration: 500, ease: tween.power3.easeIn
  })

  // hello
  let tween1Y$ = tween({
    from: 300, to: 0, duration: 500, ease: tween.power3.easeIn
  })

  let tween1X$ = tween({
    from: 500, to: 1024, duration: 500, ease: tween.power3.easeIn
  })

  let tween1W$ = tween({
    from: 500, to: 0, duration: 500, ease: tween.power3.easeIn
  })

  let tween1H$ = tween({
    from: 300, to: 0, duration: 500, ease: tween.power3.easeIn
  })

  const tween1$ = xs.combine(tween1X$, tween1Y$, tween1W$, tween1H$)
    .map(data => ({
      value: 1,
      x: data[0],
      y: data[1],
      width: data[2],
      height: data[3]
    }))

  const tween$ = xs.combine(tweenX$, tweenY$, tweenW$, tweenH$)
    .map(data => ({
      value: 1,
      x: data[0],
      y: data[1],
      width: data[2],
      height: data[3]
    }))

  const open$ = openModal$.map(() => tween$).flatten() //
  const close$ = closeModal$.map(() => tween1$).flatten()

  const houseModal$ = sources.DOM.select('.house').events('click').mapTo('house')
  const marketModal$ = sources.DOM.select('.market').events('click').mapTo('market')

  const login$ = xs.merge(open$, close$).startWith(startState)

  const action2$ = xs.merge(houseModal$, marketModal$).fold((acc, x) => {
    if (acc === x) return 'null'
    else return x
  }, 'null')

  // const action1$ = xs.merge(openModal$, cancleModal$).fold((acc, x) => {
  //   if (x === 1) {
  //     return ({
  //       value: 1,
  //       x: 318,
  //       y: 195,
  //       width: 500,
  //       height: 300
  //     })
  //   } else {
  //     return {
  //       value: 0,
  //       x: 980,
  //       y: 1204,
  //       width: 0,
  //       height: 0
  //     }
  //   }
  // }, startState)

  const action$ = xs.combine(login$, action2$)

  const loginStyle = {fontSize: '36px', padding: '0', listStyle: 'none', display: 'flex', justifyContent: 'flex-end', width: '100%'}
  const btnStyle = {marginTop: '15px', marginRight: '50px', position: 'absolute'}

  const count$ = action$
  const vtree$ = count$.map(data =>
      div([
        div({style: loginStyle},
          [button('.login', {style: btnStyle}, 'Login')]
        ),
        // data[0].value > 0 ? loginModal(data[0]) : null,
        loginModal(data[0]),
        div(
          [
            button('.house', 'house'),
            button('.market', 'market')
          ]
        ),
        div('.backgounddiv',
          [img({props: {src: 'images/shop.png'}})]
        )
      ])
    )
  return {
    DOM: vtree$
  }
}

function Login (sources) {
  return main(sources)
}

export default sources => isolate(Login)(sources)
