import React from 'react'
import Graph from './Graph'
import './Visualise.css'

const samplesPerMinute = 60

const padGraphData = leftPad({ percentage: 0 }, samplesPerMinute)
const sliceTail60 = slice(0 - samplesPerMinute)

const accordeon = false
const limitSamples = accordeon ? sliceTail60 : padGraphData

const getPercentage = get('percentage')
const mapPercentage = map(getPercentage)

const getGraphData = pipe(limitSamples, mapPercentage)

export default function Visualise({ measurement }) {
  
  if (measurement) {
    
    const { innerWidth: width, innerHeight: height } = window
    const { samples, average } = measurement
    const count = samples.length

    const layers = [{
      label: "Samples",
      color: "#18C880",
      data: getGraphData(samples),
    }]

    const percentages = mapPercentage(samples)
    const spike = Math.max(...percentages)

    return <section className="Visualise">
      
      <h1>Average: {average.toFixed(2)}%</h1>
      
      <ul>
        <li>Spike: {spike.toFixed(2)}%</li>
        <li>Samples: {count}</li>
        <li>Cycles: {Math.floor(count / samplesPerMinute)}</li>
      </ul>

      <Graph width={width} height={height} layers={layers}/>

    </section>

  }
  
  else return null
  
}

function map(callback) {
  return array => array.map(callback)
}

function pipe(...methods) {
  return value => methods.reduce((value, callback) => callback(value), value)
}

function slice(a, b) {
  return value => value.slice(a, b)
}

function get() {

  const path = arguments
  const length = path.length
  
  function getProperty(object, key) {
    if (object && object !== true) return object[key]
  }

  return function(value) {
    let index = -1
    while (++index < length && value !== undefined) {
      value = getProperty(value, path[index])
    }
    return value
  }

}

function leftPad(padding, size) {
 
  return function(value) {
    
    const result = []
    const isNumber = typeof value === 'number' && !isNaN(value) && (value += '')
    const isContent = isNumber || typeof value === 'string'
    
    const slice = value.slice(0 - size)
    const length = value.length

    if (length < size) {
      for (let index = 0, remainder = size - length; index < remainder; ++index) {
        result[index] = padding
      }
    }
    
    return isContent
      ? result.concat(slice).join('')
      : result.concat(slice)
    
  }

}

