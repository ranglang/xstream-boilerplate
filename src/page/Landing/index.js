import xs from 'xstream'
import delay from 'xstream/extra/delay'

import isolate from '@cycle/isolate'
import {div, h1} from '@cycle/dom'

function Landing (sources) {
  // const imageStyle = {marginTop: '15px', marginRight: '50px'}
  const route$ = xs.of('/login')
    .compose(delay(3000))

  return {
    DOM: xs.of(
      div({}, [
        h1('.welcome', 'Cycle.js Diversity XStream Boilerplate!')
        // div('.backgounddiv',
        //   [img('.hello', {src: 'http://img0.imgtn.bdimg.com/it/u=3607045857,288679269&fm=21&gp=0.jpg', style: imageStyle, className: 'hello'})]
        // )
      ])
    ),
    route$
  }
}

export default sources => isolate(Landing)(sources)
