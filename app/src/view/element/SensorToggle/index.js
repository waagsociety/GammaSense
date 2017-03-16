import React from 'react'

export const SensorToggle = ({ state, events }) => {
  
  const { sensor } = state
  const { active } = sensor
  console.log(active)
  const { start, stop } = events
  
  return active
    ? <button type="button" onClick={stop}>Stop Meting</button>
    : <button className="prominent" type="button" onClick={start}>Start Meting</button>

}
