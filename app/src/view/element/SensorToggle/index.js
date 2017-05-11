import React from 'react'
import './index.css'

export const SensorToggle = ({ state, events }) => {
  
  const { sensor, location } = state
  const { active, measurement } = sensor
  const { data, loading } = location
  const { prepare, start, stop } = events

  const initialEvent = data || true ? start : prepare
  const initialised = measurement && measurement.baseline != null
  
  return active
    ? <button className="SensorToggle" type="button" onClick={stop}>
        {initialised ? 'Stop meting' : 'Annuleer meting'}
      </button>
    : <button className="SensorToggle prominent start" type="button" onClick={initialEvent} disabled={false && loading}>
        {'Start meting'}
      </button>

}
