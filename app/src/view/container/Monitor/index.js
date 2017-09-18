import React from 'react'
import { events } from './events'

import { Visualise } from '../'
import { SensorToggle, BaselineProgress } from '../../element/'

export const Monitor = ({ state, dispatch }) => {
  
  const { sensor, dialog } = state
  const { active, minutes, progress } = sensor

  return  <section className="Monitor">
    { active
      ? minutes.length
        ? <Visualise sensor={sensor} dialog={dialog}/>
        : <BaselineProgress percentage={progress * 60} dialog={dialog}/>
      : null
    }
    <SensorToggle events={events(dispatch)} state={state}/>
  </section>

}