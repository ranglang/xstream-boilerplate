import PIXI from 'pixi.js/bin/pixi.js'
import XStreamAdapter from '@cycle/xstream-adapter'
import xs from 'xstream'

export function makePixiDriver (el, width, height) {
  var renderer = PIXI.autoDetectRenderer(width, height)
  renderer.backgroundColor = 0x061639
  var stage = new PIXI.Container()
  var images = {}
  stage.interactive = true
  el.appendChild(renderer.view)

  PIXI.loader.add('images/birds_in_flight_902385.jpg').load(setup)

  function setup () {
    var cat = new PIXI.Sprite(
      PIXI.loader.resources['images/birds_in_flight_902385.jpg'].texture
    )
    stage.addChild(cat)
    renderer.render(stage)
  }

  let driver = function pixiDriver (sink$) {
    sink$.addListener({
      next: view => {
        view.images.forEach(image => {
          // console.log(image.id)
          // if (!images[image.id]) { // new
          //
          // }
          // else {
          //   stage.removeChild(images[image.id])
          //   // let container = stage.getChildByName(image.name)
          //   // if (stage.contains(container)) {
          //   //   stage.removeChild(container)
          //   // }
          // }

          PIXI.loader.add('images/' + image.path).load(setup())

          function setup () {
            var sprite = new PIXI.Sprite(
              PIXI.loader.resources['images/' + image.path].texture
            )
            sprite.x = 20
            sprite.y = 30
            images[image.id] = sprite
            stage.addChild(sprite)
          }
        })
        // view.graphics.forEach(graphic => {
        //   if (!views[graphic.id]) {
        //     views[graphic.id] = new PIXI.Graphics()
        //     stage.addChild(views[graphic.id])
        //   }
        //   else {
        //     views[graphic.id].clear()
        //   }
        //   let view = views[graphic.id]
        //
        //   let update = ({
        //     circle: updateCircle,
        //     rectangle: updateRectangle
        //   })[graphic.type]
        //
        //   if (!update) {
        //     throw new Error(`Invalid graphic type ${graphic.type}`)
        //   }
        //   update(view, graphic) // update view,and graphic
        // })
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

// function updateCircle (circle, graphic) {
//   circle.lineStyle(0)
//   circle.beginFill(graphic.fill, graphic.alpha)
//   circle.drawCircle(
//     Math.round(graphic.x),
//     Math.round(graphic.y),
//     Math.round(graphic.radius)
//   )
//   circle.endFill()
// }
//
// function updateRectangle (rectangle, graphic) {
//   rectangle.lineStyle(0)
//   rectangle.beginFill(graphic.fill, graphic.alpha)
//   rectangle.drawRect(graphic.x, graphic.y, graphic.width, graphic.height)
//   rectangle.endFill()
// }
