import React from 'react'
import { map, slice, path } from 'ramda'
import { Graph } from '../../element/'
import './index.css'

const samplesPerMinute = 60
const sliceSamples = slice(0 - samplesPerMinute, Infinity)

const getPercentage = path(['percentage'])
const getPercentageMap = map(getPercentage)

export const Visualise = ({ measurement }) => {
  
  if (measurement) {
    
    const { innerWidth: width, innerHeight: height } = window
    const { samples, average } = measurement
    const { length } = samples

    const percentages = getPercentageMap(samples)
  
    const layers = [{
      label: "Samples",
      color: "#18C880",
      data: sliceSamples(percentages),
    }]

    const spike = Math.max(...percentages)

    return <section className="Visualise">
      
      <h1>Metingen</h1>

      <ul>
        <li>Gemiddelde: {average.toFixed(2)}%</li>
        <li>Piek: {spike.toFixed(2)}%</li>
        <li>Metingen: {Math.floor(samples.length / 60)}</li>
        <li>Samples: {length}</li>
      </ul>

      <Graph width={width} height={height / 2} layers={layers}/>

    </section>

  }
  
  else return null
  
}
