import config from '../../../config'
import { map, path, pipe, mean } from 'ramda'
const getPercentage = path(['percentage'])
const getAveragePercentage = pipe(map(getPercentage), mean)

const { density } = config.monitor

export const sensor = {

  monitor({ dispatch, active, getState }) {
    
    dispatch.sensor({ active })
    
    const samples = []
    const cycles = []

    config.sensor(({ sample, imageData }) => {
      
      const { active } = getState().sensor
      const { length } = samples
      const completedCycle = length && (length % density) === 0

      if (active) {
        
        const { error } = sample
        samples.push(sample)
        
        const measurement = summarize(samples)
        if (completedCycle) {          
          cycles.push(summarize(samples.slice(0 - density)))
          console.log('completedCycle', cycles)
        }
        
        dispatch.sensor({ measurement, cycles, error, active: !error })

      }
      else {
        console.log(cycles.slice())
        dispatch.sensor({ measurement: null })
      }
      
      return active

    })

  },

}

function summarize(samples) {
  const time = Date.now()
  const amount = samples.length
  const average = getAveragePercentage(samples)
  return { time, samples, average, amount }
}