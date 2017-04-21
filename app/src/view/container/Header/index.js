import React from 'react'
import { Icon } from '../../element/'
import { route } from '../../../controller'
import './index.css'

const { hash } = route

export const Header = ({ state }) => {
  
  const { routes } = state.config

  return <header className="Header">

    <button className="primary" type="button" onClick={hash.push(routes.information)}><Icon name='information'/></button>

    <button className="secondary" type="button" onClick={hash.push(routes.history, 'test')}><Icon name='list'/></button>

    <h1>GammaSense</h1>

  </header>

}