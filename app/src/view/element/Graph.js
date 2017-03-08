import React from 'react'

export default function Graph({ width, height, layers, strokeWidth = 4 }) {

  const viewBox = [0, 0, width, height].join(' ')
  const pathProperties = { width, height, bleed: strokeWidth } 

  const paths = layers.map(layer => {
    const { label, color, data } = layer
    const d = reduceToPath(data, pathProperties)
    return <path key={label} stroke={color} strokeWidth={strokeWidth} d={d}/>
  })

  return <svg className='Graph' viewBox={viewBox}>{paths}</svg>

}

// controller things
function reduceToPath(data, { width = 320, height = 240, bleed = 0 }) {

  height -= bleed

  const margin = bleed / 2
  const percent = height / 100
  const interval = width / (data.length - 1)
  const endPoint = 'h100 V' + (height + 100) + 'H0Z'

  return data.map((item, index) => {
    
    const kind = !!index ? 'L' : 'M'
    const x = interval * index || 0
    const y = height - (item * percent) + margin
    
    return [kind + x, y].join()

  }).concat(endPoint).join(' ')

}