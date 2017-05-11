// import { sensor } from '../../../model'
import { geolocation, createSensor } from '../../../controller'

const sensor = createSensor({
  width: 480,
  heigth: 320,
  frameRate: 10,
})



export const events = (dispatch) => {

  const updateSensor = storeCPM(dispatch)
  return {

    start: event => {
      dispatch.sensor({ active: sensor.start(updateSensor) })
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
  
  let baseline = Infinity

  const frames = []
  const samples = []
  const cycles = []

  return function({ count, frameRate, width, heigth }) {
    
    frames.push(count)

    if (frames.length >= frameRate) {
      
      const countPerSecond = frames.reduce(add)      
      samples.push(countPerSecond)

      baseline = Math.min(countPerSecond * 60, baseline) 
      dispatch.sensor({ samples, active: true, baseline })

      frames.length = 0

      if (samples.length % 60 === 0) {

        const timestamp = Date.now()
        const countPerMinute = samples.slice(-60).reduce(add)

        cycles.push({ countPerMinute, frameRate, width, heigth, timestamp })

        dispatch.sensor({ cycles })
        // console.log('m', countPerMinute)

      }
    
    }

  }

  function add(a, b) {
    return a + b
  }
  
}