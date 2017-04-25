import React from 'react'
import { mean } from 'ramda'
import { Graph, BaselineProgress } from '../../element/'
import './index.css'

export const Visualise = ({ measurement, config }) => {
  
  if (measurement) {
    
    const { baseline, samples, cycles } = measurement
    const { density } = config.monitor
    const { innerWidth: width, innerHeight: height } = window
  
    const layers = [{
      label: "Samples",
      color: "#18C880",
      data: [0].concat(samples.slice(-density, Infinity)),
    }]

    return <section className="Visualise">
      
      <h1>Meting</h1>

      { baseline !== null 
        ? <div>
            <ul className='dashboard'>
              <li className='primary'>
                {cycles.length + 1}
                <span>{(samples.length % density) + 1}/{density}</span>
              </li>
              <li className='secondary'>
                <ul>
                  <li><span>Gemiddelde</span> {(mean(samples) || 0).toFixed(2)}%</li>
                  <li><span>Piek</span> {Math.max(...samples, 0).toFixed(2)}%</li>
                  <li><span>Nulwaarde</span> {baseline.toFixed(2)}%</li>
                </ul>
              </li>
            </ul>
            <Graph width={width} height={height / 2} layers={layers}/> 
          </div>
        : <BaselineProgress percentage={(100 / density) * (samples.length - 1)}/>
      }

    </section>

  }
  
  else return null
  
}
