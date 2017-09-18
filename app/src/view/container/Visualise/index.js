import React from 'react'
// import { last, median } from 'ramda'
// import { Graph } from '../../element/'
import './index.css'

// function getMedianCPM(cycles, baseline) {
//   return Math.round(median(cycles.map(cycle => cycle.countPerMinute)) - baseline)
// }

function localeAmount(value) {
  return Math.round(value).toLocaleString()
}

function localeLabel(name) {
  return <span>{name}</span>
}

export const Visualise = ({ sensor, dialog }) => {
    
  return <section className="Visualise">
    
    <h1>{dialog('measurement', 'title')}</h1>

    <ul className='dashboard'>
      <li className='primary'>
        {localeAmount(sensor.countPerMinute)}
        {localeLabel(dialog('measurement', 'cpm'))}
      </li>
    </ul>

  </section>
  
}
