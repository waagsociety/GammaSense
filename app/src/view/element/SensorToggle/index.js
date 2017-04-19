import React from 'react'
import { length } from 'ramda'
import './index.css'

export const SensorToggle = ({ state, events }) => {
  
  const { sensor } = state
  const { active, measurement } = sensor
  const { start, stop } = events

  const initialised = measurement && !!length(measurement.cycles)
  
  return active
    ? <button className="SensorToggle" type="button" onClick={stop}>
        {initialised ? 'Stop meting' : 'Annuleer meting'}
      </button>
    : <button className="SensorToggle prominent start" type="button" onClick={start}>
        {'Start meting'}
      </button>

}
