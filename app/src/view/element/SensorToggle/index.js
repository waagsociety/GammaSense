import React from 'react'
import './index.css'

export const SensorToggle = ({ state, events }) => {
  
  const { sensor } = state
  const { active } = sensor
  const { start, stop } = events
  
  return active
    ? <button className="SensorToggle" type="button" onClick={stop}>Stop Meting</button>
    : <button className="SensorToggle prominent" type="button" onClick={start}>Start Meting</button>

}
