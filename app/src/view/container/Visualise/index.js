import React from 'react'
import { last, median } from 'ramda'
import { Graph } from '../../element/'
import './index.css'

function getMedianCPM(cycles, baseline) {
  return Math.round(median(cycles.map(cycle => cycle.countPerMinute)) - baseline)
}

function localeAmount(value) {
  return Math.round(value / 84).toLocaleString()
}

function localeLabel(name) {
  return <span>{name}</span>
}

export const Visualise = ({ sensor, dialog }) => {
  
  const { cycles } = sensor
  const { countPerMinute, baseline, peak } = last(cycles)
  
  return <section className="Visualise">
    
    <h1>{dialog('measurement', 'title')}</h1>

    <ul className='dashboard'>
      <li className='primary'>
        {localeAmount(countPerMinute - baseline)}
        {localeLabel(dialog('measurement', 'cpm'))}
      </li>
      <li className='secondary'>
        <ul>
          <li>{localeLabel(dialog('measurement', 'baseline'))} {localeAmount(baseline)}</li>
          <li>{localeLabel(dialog('measurement', 'peak'))} {localeAmount(peak)}</li>
          <li>{localeLabel(dialog('measurement', 'median'))} {localeAmount(getMedianCPM(cycles, baseline))}</li>
        </ul>
      </li>
    </ul>

    <Graph sensor={sensor}/>

  </section>
  
}
