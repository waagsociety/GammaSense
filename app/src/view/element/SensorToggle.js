import React from 'react'

export default function SensorToggle({ state, events }) {
  
  const { sensor } = state
  const { active } = sensor
  const { start, stop } = events
  
  return active
    ? <button type="button" onClick={stop}>Stop Meting</button>
    : <button className="prominent" type="button" onClick={start}>Start Meting</button>

}
