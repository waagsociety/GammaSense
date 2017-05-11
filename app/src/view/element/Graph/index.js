import React from 'react'

export const Graph = ({ samples }) => {

  const { innerWidth: width, innerHeight: height } = window
  
  const bleed = 4
  const viewBox = [0, 0, width, height].join(' ')  
  const pathProperties = { width, height, bleed } 

  const layers = [{
    label: "Samples",
    color: "#18C880",
    data: [0].concat(samples),
  }]

  const paths = layers.map(layer => {
    const { label, color, data } = layer
    const d = reduceToPath(data, pathProperties)
    return <path key={label} stroke={color} strokeWidth={bleed} d={d}/>
  })

  return ""
  return <svg className='Graph' viewBox={viewBox}>{paths}</svg>

}

// controller things
function reduceToPath(data, { width = 320, height = 240, bleed = 0 }) {

  height -= bleed

  const margin = bleed / 2
  const percent = height / 100
  const interval = width / (data.length - 1)

  return data.map((item, index) => {
    
    const kind = !!index ? 'L' : 'M'
    const x = interval * index || 0
    const y = height - (item * percent) + margin
    
    return [kind + x, y].join()

  }).join(' ')

}