import React from 'react'
import { length } from 'ramda'
import './index.css'

export const SensorToggle = ({ state, events }) => {
  
  const { sensor, location } = state
  const { active, measurement } = sensor
  const { data, loading } = location
  const { prepare, start, stop } = events

  const initialEvent = data ? start : prepare
  const initialised = measurement && measurement.baseline != null
  
  return active
    ? <button className="SensorToggle" type="button" onClick={stop}>
        {initialised ? 'Stop meting' : 'Annuleer meting'}
      </button>
    : <button className="SensorToggle prominent start" type="button" onClick={initialEvent} disabled={loading}>
        {'Start meting'}
      </button>

}
