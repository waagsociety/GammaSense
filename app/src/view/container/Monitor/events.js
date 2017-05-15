import { geolocation, createSensor } from '../../../controller'

const sensor = createSensor({
  width: 480,
  heigth: 320,
  frameRate: 2,
})

export const events = (dispatch) => {

  const updateSensor = storeCPM(dispatch)
  const onerror = error => dispatch.sensor({ error })

  return {

    start: event => {
      dispatch.sensor({ active: sensor.start(updateSensor, onerror) })
    },

    stop: event => {
      sensor.stop(dispatch.sensor)
      dispatch.sensor({ cycles: [], samples: [], baseline: 0,  active: false })
    },

    prepare: event => {
      geolocation(dispatch)
    },
  
  }

}

function storeCPM(dispatch) {
  
  const cycleRate = 60
  let baseline = Infinity
  let peak = 0

  const frames = []
  const samples = []
  const cycles = []

  return function({ count, frameRate, width, heigth }) {
    
    frames.push(count)
    if (frames.length >= frameRate) {
      
      const countPerSecond = frames.reduce(add)
      baseline = Math.min(countPerSecond * cycleRate, baseline)     
      frames.length = 0

      samples.push(countPerSecond)
      
      dispatch.sensor({ samples })

      if (samples.length % cycleRate === 0) {

        const timestamp = Date.now()
        const countPerMinute = samples.slice(-cycleRate).reduce(add)
        peak = Math.max(countPerMinute, peak)

        cycles.push({
          timestamp, 
          frameRate,
          countPerMinute, 
          baseline,
          peak,
          width, 
          heigth,
        })

        dispatch.sensor({ cycles })

      }
    
    }

  }

  function add(a, b) {
    return a + b
  }
  
}