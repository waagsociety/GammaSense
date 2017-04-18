import React from 'react'
import './index.css'

import { LocationToggle } from '../../element/'

export const Map = ({ state }) => {

  return <section className='Map full content' hidden={state.sensor.active}>

    <div id='MapBox'></div>

    <LocationToggle events={{}} state={state} />

  </section>

}