import React from 'react'
import './index.css'

export const Header = ({ store }) => 
  <header className="Header">
    <a href='./#information' title='Informatie'><button className="primary" type="button">Information</button></a>
    <a href='./#mijn-metingen' title='Mijn Metingen'><button className="secondary" type="button">Mijn metingen</button></a>
    <h1>GammaSense</h1>
  </header>