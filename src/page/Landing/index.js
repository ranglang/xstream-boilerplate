import xs from 'xstream'
import delay from 'xstream/extra/delay'

import isolate from '@cycle/isolate'
import {div, h1, img} from '@cycle/dom'

function Landing (sources) {
  // const imageStyle = {marginTop: '15px', marginRight: '50px'}
  const route$ = xs.of('/login')
    .compose(delay(3000))

  return {
    DOM: xs.of(
      div({}, [
        img({props: {src: 'http://dummyimage.com/400x600/4ac/fff/'}}),
        h1('.welcome', 'Cycle.js Diversity XStream Boilerplate!'),
        div('.backgounddiv',
          img({src: 'images/shop.png'})
        )
      ])
    ),
    route$
  }
}

export default sources => isolate(Landing)(sources)
