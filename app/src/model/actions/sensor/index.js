import config from '../../../config'

export const sensor = {

  monitor({ dispatch, active, getState }) {
    
    dispatch.sensor({ active })
    
    const samples = []
    // const cycles = [] // used to cache completed measurements

    config.sensor(({ sample, imageData }) => {
            
      const { active } = getState().sensor
      if (active) {
        
        samples.push(sample)
        const average = getAveragePercentage(samples)
        
        const measurement = { samples, average }
        dispatch.sensor({ measurement })

      }
      else dispatch.sensor({ measurement: null })
      
      return active

    })

  },

}

function getAveragePercentage(data) {
  let sum = 0
  const length = data.length
  for (let index = 0; index < length; ++index) {
    sum += data[index].percentage
  }
  return sum / length
}