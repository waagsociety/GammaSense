import React from 'react'
import { events } from './events'

import { Visualise } from '../'
import { SensorToggle, BaselineProgress } from '../../element/'

export const Monitor = ({ state, dispatch }) => {
  
  const { sensor } = state
  const { active, cycles, samples } = sensor

  return  <section className="Monitor">
    { active
      ? cycles.length
        ? <Visualise sensor={sensor}/>
        : <BaselineProgress percentage={100 / (60 / samples.length)}/>
      : null
    }
    <SensorToggle events={events(dispatch)} state={state}/>
  </section>

}