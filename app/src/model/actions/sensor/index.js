import config from '../../../config'
import { map, path, pipe, mean } from 'ramda'

const getPercentage = path(['percentage'])
const getAveragePercentage = pipe(map(getPercentage), mean)

export const sensor = {

  monitor({ dispatch, active, getState }) {
    
    dispatch.sensor({ active })
    
    const samples = []
    // const cycles = [] // used to cache completed measurements

    config.sensor(({ sample, imageData }) => {
      
      const { active } = getState().sensor

      if (active) {
        
        const { error } = sample
        samples.push(sample)
        const average = getAveragePercentage(samples)
        
        const measurement = { samples, average, error }
        
        dispatch.sensor({ measurement, active: !error })

      }
      else dispatch.sensor({ measurement: null })
      
      return active

    })

  },

}