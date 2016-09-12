import 'normalize-css'

// Globals
import xs from 'xstream'

// Pages
import Landing from './Landing'
import Login from './Login'

// Components
import ComponentRouter from 'component/ComponentRouter'

const routes =
  {
    '/': Landing,
    '/login': Login
  }

export default function main (sources) {
  // sources.keyboard.ups().map(ev => ev.displayKey + ' was pressed').map(i => console.log(i))
  const page = ComponentRouter({...sources, routes$: xs.of(routes)})

  return {
    DOM: page.DOM,
    // Animation: makeAnimationDriver(),
    // Canvas: page.Canvas,
    // pixi: page.pixi,
    keyboard: page.keyboard,
    router: page.route$// return page's something
  }
}
