import React from 'react'
import './index.css'

export const Header = ({ store }) => 
  <header className="Header">
    <button className="primary" type="button">Information</button>
    <button className="secondary" type="button">Mijn metingen</button>
    <h1>GammaSense</h1>
  </header>