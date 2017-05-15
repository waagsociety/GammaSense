import React from 'react'
import { events } from './events'

import { Visualise } from '../'
import { SensorToggle, BaselineProgress } from '../../element/'

export const Monitor = ({ state, dispatch }) => {
  
  const { sensor, dialog } = state
  const { active, cycles, samples } = sensor

  return  <section className="Monitor">
    { active
      ? cycles.length
        ? <Visualise sensor={sensor} dialog={dialog}/>
        : <BaselineProgress percentage={100 / (60 / samples.length)} dialog={dialog}/>
      : null
    }
    <SensorToggle events={events(dispatch)} state={state}/>
  </section>

}