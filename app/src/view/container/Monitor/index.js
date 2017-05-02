import React from 'react'
import { events } from './events'

import { Visualise } from '../'
import { SensorToggle } from '../../element/'

export const Monitor = ({ state, dispatch, getState }) => {

  const { sensor, config } = state
  const { measurement } = sensor
  
  return <section className="Monitor">
    <Visualise measurement={measurement} config={config}/>
    <SensorToggle events={events(dispatch, getState)} state={state}/>
  </section>

}