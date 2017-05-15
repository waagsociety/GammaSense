import React from 'react'
import { last, median } from 'ramda'
import { Graph } from '../../element/'
import './index.css'

function getMedianCPM(cycles, baseline) {
  return Math.round(median(cycles.map(cycle => cycle.countPerMinute)) - baseline)
}

export const Visualise = ({ sensor }) => {
  
  const { cycles } = sensor
  const { countPerMinute, baseline, peak } = last(cycles)
  
  return <section className="Visualise">
    
    <h1>Meting</h1>

    <ul className='dashboard'>
      <li className='primary'>
        {(countPerMinute - baseline).toLocaleString('nl')}
        <span>CPM Meting {cycles.length}</span>
      </li>
      <li className='secondary'>
        <ul>
          <li><span>Nulwaarde</span> {baseline.toLocaleString('nl')}</li>
          <li><span>Piek CPM</span> {(peak - baseline).toLocaleString('nl')}</li>
          <li><span>Mediaan CPM</span> {getMedianCPM(cycles, baseline).toLocaleString('nl')}</li>
        </ul>
      </li>
    </ul>

    <Graph sensor={sensor}/>

  </section>
  
}
