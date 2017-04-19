import config from '../../../config'
import { mean } from 'ramda'

const { density } = config.monitor

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
      
      const { active } = getState().sensor
      const { error } = sample

      const measurement = update(sample)
      const { samples, cycles } = measurement

      if (active) {        
        if (cycles.length && samples.length % density === 0) {
          console.log(cycles)
        }
        dispatch.sensor({ measurement, error, active: !error })
      }
      else {
        console.log(cycles)
        dispatch.sensor({ measurement: null })
      }
      
      return active

    })

  },

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

// function summarize(samples) {
//   const time = Date.now()
//   const amount = samples.length
//   const average = getAveragePercentage(samples)
//   return { time, samples, average, amount }
// }