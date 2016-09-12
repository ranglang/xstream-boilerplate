import PIXI from 'pixi.js/bin/pixi.js'
import XStreamAdapter from '@cycle/xstream-adapter'
import xs from 'xstream'

export function makePixiDriver (el, width, height) {
  var renderer = PIXI.autoDetectRenderer(width, height)
  renderer.backgroundColor = 0x061639
  var stage = new PIXI.Container()
  // var images = {}
  var views = {}
  stage.interactive = true
  el.appendChild(renderer.view)
  // let loader = PIXI.loader // .load(setup)
  // loader.reset()
  // loader.add('images/birds_in_flight_902385.jpg').add('images/cat.png').load(setup)
  //
  // function setup () {
  //   let cat = new PIXI.Sprite(
  //     PIXI.loader.resources['images/birds_in_flight_902385.jpg'].texture
  //   )
  //   cat.name = 'cat'
  //   cat.visible = false
  //   stage.addChild(cat)
  //   renderer.render(stage)
  // }

  let driver = function pixiDriver (sink$) {
    sink$.addListener({
      next: view => {
        // view.images.forEach(image => {
        //   let sprite = PIXI.Sprite.from('cat')
        //   sprite.visible = true
        //   stage.addChild(sprite)
        // })
        view.graphics.forEach(graphic => {
          if (!views[graphic.id]) {
            views[graphic.id] = new PIXI.Graphics()
            stage.addChild(views[graphic.id])
          }
          else {
            views[graphic.id].clear()
          }
          let view = views[graphic.id]

          let update = ({
            circle: updateCircle,
            rectangle: updateRectangle
          })[graphic.type]

          if (!update) {
            throw new Error(`Invalid graphic type ${graphic.type}`)
          }
          update(view, graphic) // update view,and graphic
        })
        renderer.render(stage)
      },
      error: e => { throw e },
      complete: () => null
    })

    return xs.empty()
  }
  driver.streamAdapter = XStreamAdapter
  return driver
}

function updateCircle (circle, graphic) {
  circle.lineStyle(0)
  circle.beginFill(graphic.fill, graphic.alpha)
  circle.drawCircle(
    Math.round(graphic.x),
    Math.round(graphic.y),
    Math.round(graphic.radius)
  )
  circle.endFill()
}

function updateRectangle (rectangle, graphic) {
  rectangle.lineStyle(0)
  rectangle.beginFill(graphic.fill, graphic.alpha)
  rectangle.drawRect(graphic.x, graphic.y, graphic.width, graphic.height)
  rectangle.endFill()
}
