import React from 'react'
import { events } from './events'

import { Visualise } from '../'
import { SensorToggle, BaselineProgress } from '../../element/'

export const Monitor = ({ state, dispatch }) => {
  
  const { sensor } = state
  const { active, cycles } = sensor

  return  <section className="Monitor">
    { active
      ? cycles.length
        ? <Visualise sensor={sensor}/>
        : <BaselineProgress percentage={10}/>
      : null
    }
    <SensorToggle events={events(dispatch)} state={state}/>
  </section>

}