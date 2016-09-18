import xs from 'xstream'
import PIXI from 'pixi.js/bin/pixi.js'
import isolate from '@cycle/isolate'
import tween from 'xstream/extra/tween'
import {div, button} from '@cycle/dom'

import { fromSpriteEvent } from '../../driver/fromSprite'
function locationModal (data) {
  return null
}

function loginModal (value) {
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
  let bunney = new PIXI.Sprite(PIXI.Texture.fromImage('images/bunny.png'))
  bunney.interactive = true

  let tweenY$ = tween({
    from: 0, to: 300, duration: 500, ease: tween.power3.easeOut
  })
  let tweenX$ = tween({
    from: 1024, to: 500, duration: 500, ease: tween.power3.easeInOut
  })
  let tweenW$ = tween({
    from: 0, to: 500, duration: 500, ease: tween.power3.easeIn
  })
  let tweenH$ = tween({
    from: 0, to: 300, duration: 500, ease: tween.power3.easeIn
  })

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

  const startState1 = {
    value: 'null',
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  const action2$ = xs.merge(houseModal$, marketModal$).fold((acc, x) => {
    if (acc === x) return 'null'
    else return x
  }, 'null').map(location => {
    if (location === 'null') {
      return xs.combine(tweenX$, tweenY$, tweenW$, tweenH$).map(data => ({
        value: location,
        x: data[0],
        y: data[1],
        width: data[2],
        height: data[3]
      }))
    } else {
      return xs.combine(tween1X$, tween1Y$, tween1W$, tween1H$).map(data => ({
        value: location,
        x: data[0],
        y: data[1],
        width: data[2],
        height: data[3]
      }))
    }
  }).flatten().startWith(startState1)

  const action$ = xs.combine(login$, action2$)

  const loginStyle = {fontSize: '36px', padding: '0', listStyle: 'none', display: 'flex', justifyContent: 'flex-end', width: '100%'}
  const btnStyle = {marginTop: '15px', marginRight: '50px', position: 'absolute'}
  const count$ = action$
  const vtree$ = count$.map(data =>
      div([
        div({style: loginStyle},
          [button('.login', {style: btnStyle}, 'Login')]
        ),
        loginModal(data[0]),
        div(
          [
            button('.house', 'house'),
            button('.market', 'market')
          ]
        ),
        locationModal(data[1])
      ])
    )

  const bunneyState = {
    sprite: bunney,
    x: 0,
    y: 0,
    width: 20,
    height: 20
  }

  const bSprite$ = fromSpriteEvent(bunney, 'mouseup').mapTo('mouseup').fold((x, a) => {
    return {
      sprite: x.sprite,
      x: x.x + 3,
      y: x.y + 3,
      width: x.width + 3,
      height: x.height + 3
    }
  }, bunneyState)
  // fromSprite(bunney, 'mouseup').mapTo('mouseup').fold((event, data) => {
  //   console.log('data: ' + data)
  //   return {
  //     sprite: data.sprite,
  //     x: data.x + 3,
  //     y: data.y + 3,
  //     width: 20,
  //     height: 20
  //   }
  // }).startWith(bunneyState)

  // bSprite$.addListener({
  //   next: i => console.log('iii:' + i),
  //   error: err => console.error(err),
  //   complete: () => console.log('completed')
  // })

  const pixitree$ = bSprite$.map(data => {
    console.log('...' + data)
    return { graphics: [
      {
        id: '22222',
        type: 'circle',
        x: 300,
        y: 300,
        radius: 50,
        fill: 0x333333,
        alpha: 1
      }
    ],
    images: [data]
    }
  }
  )

  return {
    DOM: vtree$,
    pixi: pixitree$
  }
}

function Login (sources) {
  return main(sources)
}

export default sources => isolate(Login)(sources)
