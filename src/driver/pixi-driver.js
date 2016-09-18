import PIXI from 'pixi.js/bin/pixi.js'
import XStreamAdapter from '@cycle/xstream-adapter'
import xs from 'xstream'

PIXI.DisplayObjectContainer.prototype.contains = function (child)
{
  return (this.children.indexOf(child) !== -1)
}

export function makePixiDriver (el, width, height) {
  var renderer = PIXI.autoDetectRenderer(width, height)
  console.log(renderer.view)
  renderer.backgroundColor = 0x0000FF // 0x061639
  var stage = new PIXI.Container()
  stage.interactive = true
  el.appendChild(renderer.view)
  // (function () {
  // let image = new PIXI.Sprite(PIXI.Texture.from('images/bunny.png'))
  // image.interactive = true
  // // sprite.on('mousedown', onDown)
  // image.on('clickup', onDown)
  // image.on('mouseup', onDown)
  // image.on('touchstart', onDown)
  // image.on('touchend', onDown)
  // function onDown (eventData) {
  //   image.scale.x += 0.3
  //   image.scale.y += 0.3
  //   renderer.render(stage)
  // }
  // stage.addChild(image)
  //
  // let image1 = new PIXI.Sprite(PIXI.Texture.from('images/bunny.png'))
  // image1.x = 100
  // image1.y = 100
  // image1.interactive = true
  // // sprite.on('mousedown', onDown)
  // image1.on('clickup', onDown1)
  // image1.on('mouseup', onDown1)
  // image1.on('touchstart', onDown1)
  // image1.on('touchend', onDown1)
  // function onDown1 (eventData) {
  //   image1.scale.x += 0.3
  //   image1.scale.y += 0.3
  //   renderer.render(stage)
  // }
  // stage.addChild(image1)
  // renderer.render(stage)
  // })
  // var sprites = []
  // PIXI.loader.add('shop', 'images/bg-shop.png').load(setup)
  // function setup () {
  // }

  // const bunneyState = {
  //   sprite: bunney,
  //   x: 0,
  //   y: 0,
  //   width: 10,
  //   height: 20
  // }
  let driver = function pixiDriver (sink$) {
    sink$.addListener({
      next: view => {
        console.log('view.image.length: ' + view.images.length)
        view.images.forEach(data => {
          stage.addChild(data)
          // console.log('hi' + data)
        })

        //   console.log(data)
          // let sprite = data.sprite
          // sprite.position.x = data.x
          // sprite.position.y = data.y
          // sprite.width = data.width
          // sprite.height = data.height
          // stage.addChild(sprite)
          // if (!views[graphic.id]) {
          //   views[graphic.id] = new PIXI.Graphics()
          //   stage.addChild(views[graphic.id])
          // }
          // else {
          //   views[graphic.id].clear()
          // }
          // let view = views[graphic.id]
          //
          // let update = ({
          //   circle: updateCircle,
          //   rectangle: updateRectangle
          // })[graphic.type]
          //
          // if (!update) {
          //   throw new Error(`Invalid graphic type ${graphic.type}`)
          // }
          // update(view, graphic) // update view,and graphic
        // })
        renderer.render(stage)
        // if (image !== 'undefined') {
          // stage.addChild(image2)
        // }
        // stage.addChild(image)
        // renderer.render(stage)

        // renderer.render(stage)
        // console.log(view.image)
        // // view.image.map(image => {
        // stage.addChild(view.image)
        // view.image.x = 300
        // view.image.y = 300
        // console.log(stage.children.length)
        // renderer.render(stage)
        // })

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
