import React from 'react'

import { Icon } from '../../element/'
import './index.css'

export const Header = ({ store }) => 
  <header className="Header">
    <a href='./#informatie' title='Informatie'>
      <button className="primary" type="button"><Icon name='information'/></button>
    </a>
    <a href='./#mijn-metingen' title='Mijn Metingen'>
      <button className="secondary" type="button"><Icon name='list'/></button>
    </a>
    <h1>GammaSense</h1>
  </header>