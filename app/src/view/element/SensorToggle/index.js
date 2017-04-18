import React from 'react'
import { length, path } from 'ramda'
import './index.css'

const pathMeasureStart = path(['measure', 'start'])
const pathMeasureStop = path(['measure', 'stop'])
const pathMeasureCancel = path(['measure', 'cancel'])

export const SensorToggle = ({ state, events }) => {
  
  const { sensor, dialog } = state
  const { active, cycles } = sensor
  const { start, stop } = events

  const initialised = !!length(cycles)
  
  return active
    ? <button className="SensorToggle" type="button" onClick={stop} disabled={initialised}>
        {initialised ? pathMeasureStop(dialog) : pathMeasureCancel(dialog)}
      </button>
    : <button className="SensorToggle prominent start" type="button" onClick={start}>
        {pathMeasureStart(dialog)}
      </button>

}
