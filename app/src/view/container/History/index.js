import React from 'react'
import { route } from '../../../controller'
import './index.css'

import { HistoryList } from '../../element/'

const { push } = route.hash

export const History = ({ state }) => {

  const { sensor, config } = state
  const { history } = sensor
  const { routes } = config
  const route = matchRoute(location.hash)
  const hidden = routes.history !== route[0]

  return <section className='History secondary panel' hidden={hidden}>

    <header>
      <h1>Mijn metingen</h1>
    </header>

    <section className='content'>

      {
        history.length
          ? <HistoryList data={history} />
          : <p>Hier worden afgeronde metingen (binnenkort) opgeslagen.</p>
      }
      

    </section>

    <nav>
      <button type='button' onClick={push(routes.home)}>Sluit</button>
    </nav>

  </section>

}

function matchRoute(path) {
  return location.hash.split(/\/+/g) || []
}