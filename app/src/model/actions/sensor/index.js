import config from '../../../config'
import { mean, last } from 'ramda'

const { density } = config.monitor
const transferCoords = transfer('longitude', 'latitude')

export const sensor = {

  monitor({ dispatch, active, getState }) {
    
    dispatch.sensor({ active })

    const update = initialize({
      density,
      baseline: null,
      initialized: Date.now(),
      session: 'abcdef',
    })

    config.sensor(({ sample, imageData }) => {
      
      const state = getState()
      const { sensor, location } = state
      const { active } = sensor
      const { error } = sample

      const measurement = update(sample)
      const { samples, cycles } = measurement

      if (active) {        
        if (cycles.length && samples.length % density === 0) {
          storeData(measurement, location.data)
        }
        dispatch.sensor({ measurement, error, active: !error })
      }
      else dispatch.sensor({ measurement: null })
      
      return active

    })

  },

}

function storeData({ cycles, baseline, initialized, session }, { coords }) {

  const cycle = last(cycles)
  const location = transferCoords(coords)
  
  const x = JSON.stringify({ 
    session, 
    cycle, 
    baseline, 
    initialized, 
    location, session 
  })

  console.log(x)
  
}

function initialize(metadata) {

  const { density } = metadata
  const samples = []
  const cycles = []
  
  const result = Object.assign(metadata, { samples, cycles })

  return function(sample) {
    
    const count = samples.push(sample.percentage)

    if (count % density === 0) {
      if (typeof result.baseline === 'number') {
        const data = samples.slice(-density, Infinity)
        cycles.push(summarizeSamples(data, metadata))
      }
      else result.baseline = mean(samples.splice(0, density))
    }

    return result

  }

}

function summarizeSamples(data, { session, initialized, baseline }) {
  
  return { 
    time: Date.now(),
    mean: mean(data),
    min: Math.min(...data),
    max: Math.max(...data), 
  }

}

function transfer(...keys) {

  return function(object) {
    if (object) return keys.reduce(function(result, key, index) {
      result[index] = object[key]
      return result
    }, [])
  }

}