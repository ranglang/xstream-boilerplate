import {Stream} from 'xstream'

export function fromSpriteEvent (element, eventName) { // : Stream<Event>
  return Stream.create({ // <Producer<Event>>
    element: element,
    next: null,
    start: function start (listener) { // : Listener<Event>
      element.interactive = true
      this.next = function next (event) {
        console.log('event: ' + event)

        listener.next(event)
      }
      this.element.on(eventName, this.next)
    },
    stop: function stop () {
      // this.element.removeEventListener(eventName, this.next, useCapture);
    }
  })
}
