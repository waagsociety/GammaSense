import React from 'react'
import { last, median } from 'ramda'
import { Graph } from '../../element/'
import './index.css'

function getMedianCPM(cycles, baseline) {
  return median(cycles.map(cycle => cycle.countPerMinute)) - baseline
}

export const Visualise = ({ sensor }) => {
  
  const { samples, baseline, cycles } = sensor
  const { countPerMinute } = last(cycles)
  
  return <section className="Visualise">
    
    <h1>Meting</h1>

    <ul className='dashboard'>
      <li className='primary'>
        {(countPerMinute - baseline).toLocaleString()}
        <span>CPM</span>
      </li>
      <li className='secondary'>
        <ul>
          <li><span>Nulwaarde</span> {baseline.toLocaleString()}</li>
          <li><span>Metingen</span> {cycles.length}</li>
          <li><span>Mediaan CPM</span> {getMedianCPM(cycles, baseline).toLocaleString()}</li>
        </ul>
      </li>
    </ul>

    <Graph samples={samples}/>

  </section>
  
}
