import xs from 'xstream'
import isolate from '@cycle/isolate'
import {div, button, img} from '@cycle/dom'
// import {rect, text} from '../../driver/canvas-driver' // text
// import fromEvent from 'xstream/extra/fromEvent'

// import pairwise from 'xstream/extra/pairwise'
// import {difference, sortBy} from 'lodash'// intersection

const loginModal =
  div(
    ['loginModal',
      button('.cancle', 'Cancle')
    ]
  )

function main (sources) {
  const openModal$ = sources.DOM.select('.login').events('click').mapTo(1)
  const cancleModal$ = sources.DOM.select('.cancle').events('click').mapTo(0)

  const houseModal$ = sources.DOM.select('.house').events('click').mapTo('house')
  const marketModal$ = sources.DOM.select('.market').events('click').mapTo('market')

  const action2$ = xs.merge(houseModal$, marketModal$).fold((acc, x) => {
    if (acc === x) return 'null'
    else return x
  }, 'null')

  const action1$ = xs.merge(openModal$, cancleModal$).startWith(0)

  const action$ = xs.combine(action1$, action2$)

  const loginStyle = {fontSize: '36px', padding: '0', listStyle: 'none', display: 'flex', justifyContent: 'flex-end', width: '100%'}
  const btnStyle = {marginTop: '15px', marginRight: '50px', position: 'absolute'}

  const count$ = action$
  const vtree$ = count$.map(data =>
      div([
        div({style: loginStyle},
          [button('.login', {style: btnStyle}, 'Login')]
        ),
        data[0] > 0 ? loginModal : null,
        // p('Counter: ' + data[0] + 'Location: ' + data[1]),
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
