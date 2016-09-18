import xs from 'xstream'
import PIXI from 'pixi.js/bin/pixi.js'
import isolate from '@cycle/isolate'
import tween from 'xstream/extra/tween'
import {div, button} from '@cycle/dom'

import { fromSprite } from '../../driver/fromSprite'
function locationModal (data) {
  // const locationModalStyle = {
  //   left: `${Math.round(data.x)}px`,
  //   top: `${Math.round(data.y)}px`,
  //   width: `${Math.round(data.width)}px`,
  //   height: `${Math.round(data.height)}px`,
  //   position: 'absolute',
  //   alignItems: 'center',
  //   display: 'flex',
  //   flexDirection: 'column',
  //   backgroundColor: 'blue',
  //   paddingTop: '70px',
  //   border: 'none'
  // }
  return null
  // if (data.value === 'house') {
  //   return div()
  //   // return div({style: locationModalStyle},
  //   //   [img({props: {src: 'images/bg-shop.png'}})]
  //   // )
  // } else if (data.value === 'market') {
  //   return div({style: locationModalStyle},
  //     [img({props: {src: 'images/bg-shop.png'}})]
  //   )
  // } else {
  //   return null
  // }
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

  // bunney.on('clickup', function () {
  //   console.log('hhhhhhhhhhh')
  // })
  // bunney.on('clickup', onDown)
  bunney.on('mouseup', onDown)
  // bunney.on('touchstart', onDown)
  // bunney.on('touchend', onDown)
  function onDown (eventData) {
    console.log('...')
    // image.scale.x += 0.3
    // image.scale.y += 0.3
    // renderer.render(stage)
  }
  const bSprite$ = fromSprite(bunney, 'mouseup').mapTo(1)

  bSprite$.addListener({
    next: i => console.log(i),
    error: err => console.error(err),
    complete: () => console.log('completed')
  })

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
  }).flatten().startWith(
      // (.map(() => {
      startState1
      // })
  )

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
  return {
    DOM: vtree$,
    pixi: xs.of(
      { graphics: [
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
      image: bunney
        // var image = new PIXI.Sprite(PIXI.Texture.fromImage('images/bg-shop.png'))
      //  new PIXI.Sprite(PIXI.loader.resources['images/bg-shop.png'].texture)
    }
    )
  }
}

function Login (sources) {
  return main(sources)
}

export default sources => isolate(Login)(sources)
