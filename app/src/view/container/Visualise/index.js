import React from 'react'
import { Graph, BaselineProgress } from '../../element/'
import './index.css'

export const Visualise = ({ measurement, config }) => {
  
  if (measurement) {
    
    const { baseline, samples } = measurement
    const { density } = config.monitor
    const { innerWidth: width, innerHeight: height } = window
  
    const layers = [{
      label: "Samples",
      color: "#18C880",
      data: [0].concat(samples.slice(-density, Infinity)),
    }]

    return <section className="Visualise">
      
      <h1>Metingen</h1>

      { baseline 
        ? <Graph width={width} height={height / 2} layers={layers}/> 
        : <BaselineProgress percentage={(100 / density) * (samples.length - 1)}/>
      }

    </section>

  }
  
  else return null
  
}


// <ul>
//   <li>Gemiddelde: {average.toFixed(2)}%</li>
//   <li>Piek: {spike.toFixed(2)}%</li>
//   <li>Metingen: {Math.floor(samples.length / 60)}</li>
//   <li>Samples: {length}</li>
// </ul>
