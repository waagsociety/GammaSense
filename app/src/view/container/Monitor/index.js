import React from 'react'
import { events } from './events'
import './index.css'

import SensorToggle from '../../element/SensorToggle'
import Visualise from '../../element/Visualise'

export const Monitor = ({ state, dispatch, getState }) => {

  const { measurement } = state.sensor
    
  return <section className="Monitor">
    <Visualise measurement={measurement}/>
    <SensorToggle events={events(dispatch, getState)} state={state}/>
  </section>

}