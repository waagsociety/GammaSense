import React from 'react'
import { last } from 'ramda'

export const Graph = ({ sensor }) => {

  const { samples, cycles } = sensor
  const { baseline, peak } = last(cycles)

  const { innerWidth: width, innerHeight: height } = window
  const viewBox = [0, 0, width, height].join(' ')

  const percentage = (height / 2) / peak
  const data = normalizeSampleData(samples, baseline, percentage)

  return <svg className='Graph' viewBox={viewBox} width={width} height={height}>
    <path width={width} height={height} d={createPath(data, width, height)}/>
  </svg>

}

function createPath(data, width, height) {
  
  const column = width / (data.length - 1)
  const center = height / 2

  return data.reduce(function(path, point, index) {
    return path + (index ? ' L' : 'M') + (index * column) + ',' + (center - data[index])
  }, '')

}

function normalizeSampleData(samples, baseline, percentage) {
  const data = []
  const length = samples.length
  let index = length - 60
  while (index < length) {
    data.push(index < 0 ? 0 : samples[index] * percentage)
    ++index
  }
  return data
}