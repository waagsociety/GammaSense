import React from 'react'
import { route } from '../../../controller'
import './index.css'

import { HistoryList } from '../../element/'

const { hash } = route

export const History = ({ state }) => {

  const { sensor, config, dialog } = state
  const { history } = sensor
  const { routes } = config

  const hidden = !hash.match(routes.history)

  const content = history.length
    ? <HistoryList data={history} dialog={dialog}/>
    : <p>{dialog('history', 'empty')}</p> 

  return <section className='History secondary panel' hidden={hidden}>

    <header>
      <button className='secondary' type='button' onClick={hash.push()}>{dialog('action', 'done')}</button>
      <h1>{dialog('history', 'title')}</h1>
    </header>

    <section className='content'>{content}</section>

    <nav>
    </nav>

  </section>

}
