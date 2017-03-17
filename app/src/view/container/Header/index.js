import React from 'react'
import { Icon } from '../../element/'
import './index.css'

export const Header = ({ state }) => {
  
  const { routes } = state.config

  return <header className="Header">

    <a href={routes.information} title='Informatie'>
      <button className="primary" type="button"><Icon name='information'/></button>
    </a>

    <a href={routes.history} title='Mijn Metingen'>
      <button className="secondary" type="button"><Icon name='list'/></button>
    </a>

    <h1>GammaSense</h1>

  </header>

}