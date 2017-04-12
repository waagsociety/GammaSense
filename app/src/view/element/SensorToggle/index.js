import React from 'react'
import { length } from 'ramda'
import './index.css'

export const SensorToggle = ({ state, events }) => {
  
  const { sensor, dialog } = state
  const { active, cycles } = sensor
  const { start, stop } = events

  const initialised = !!length(cycles)
  
  return active
    ? <button className="SensorToggle" type="button" onClick={stop} disabled={initialised}>
        {initialised ? dialog.measure.stop : dialog.measure.cancel}
      </button>
    : <button className="SensorToggle prominent start" type="button" onClick={start}>
        {dialog.measure.start}
      </button>

}
