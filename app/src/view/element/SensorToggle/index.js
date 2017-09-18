import React from 'react'
import './index.css'

export const SensorToggle = ({ state, events }) => {
  
  const { sensor, location, dialog } = state
  const { active, minutes } = sensor
  const { data, loading } = location
  const { prepare, start, stop } = events
  const initialEvent = data ? start : prepare
  
  return active
    ? <button className="SensorToggle" type="button" onClick={stop}>
        { minutes.length ? dialog('measurement', 'stop') : dialog('measurement', 'cancel') }
      </button>
    : <button className="SensorToggle prominent start" type="button" onClick={initialEvent} disabled={loading}>
        {dialog('measurement', 'start')}
      </button>

}
