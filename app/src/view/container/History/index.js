import React from 'react'
import { route } from '../../../controller'
import './index.css'

import { HistoryList } from '../../element/'

const { hash } = route

export const History = ({ state }) => {

  const { sensor, config } = state
  const { history } = sensor
  const { routes } = config

  const hidden = !hash.match(routes.history)

  const content = history.length
    ? <HistoryList data={history} />
    : <p>Je hebt nog geen meting gedaan.</p> 

  return <section className='History secondary panel' hidden={hidden}>

    <header>
      <h1>Mijn metingen</h1>
    </header>

    <section className='content'>{content}</section>

    <nav>
      <button type='button' onClick={hash.push()}>Sluit</button>
    </nav>

  </section>

}
