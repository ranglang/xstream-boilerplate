import {Stream} from 'xstream'
// import PIXI from 'pixi.js/bin/pixi.js'

export function fromSprite (element, eventName) { // : Stream<Event>
  return Stream.create({ // <Producer<Event>>
    element: element,
    next: null,
    start: function start (listener) { // : Listener<Event>
      this.next = function next (event) {
        listener.next(event)
      }
      this.element.on(eventName, this.next)
    },
    stop: function stop () {
      // this.element.removeEventListener(eventName, this.next, useCapture);
    }
  })
}
