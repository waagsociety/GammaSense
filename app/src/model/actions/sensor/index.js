import config from '../../../config'
import { map, path, pipe, mean } from 'ramda'

const getPercentage = path(['percentage'])
const getAveragePercentage = pipe(map(getPercentage), mean)

export const sensor = {

  monitor({ dispatch, active, getState }) {
    
    dispatch.sensor({ active })
    
    const samples = []
    const cycles = []

    config.sensor(({ sample, imageData }) => {
      
      const { active } = getState().sensor
      const { length } = samples
      const completedCycle = length  === 60

      if (active) {
        
        const { error } = sample
        samples.push(sample)
        const average = getAveragePercentage(samples)
        
        const measurement = { samples, average, error }
        if (completedCycle) {
          cycles.push(measurement)
          samples.length = 0
        }
        
        dispatch.sensor({ measurement, cycles, error, active: !error })

      }
      else {
        console.log(cycles)
        dispatch.sensor({ measurement: null })
      }
      
      return active

    })

  },

}