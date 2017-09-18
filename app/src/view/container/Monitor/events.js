import { geolocation } from '../../../controller'
import gammaMonitor from 'gamma-monitor'

const monitor = gammaMonitor()

export const events = (dispatch) => {
  
  monitor
    .onStart(m => console.info('started', m))
    .onUpdate(m => {
      // console.log(JSON.stringify(m, null, 2))
      dispatch.sensor(m)
    })
    .onStop(m => {
      console.info(JSON.stringify(m, null, 2))
      dispatch.sensor(m)
    })
    .catch(error => dispatch.sensor({ error }))

  return {
    start: event => monitor.start(),
    stop: event => {
      monitor.stop()
    },
    prepare: event => {
      geolocation(dispatch)
    },
  }

}

// function storeCPM(dispatch) {
  
//   const cycleRate = 60
//   let baseline = Infinity
//   let peak = 0

//   const frames = []
//   const samples = []
//   const cycles = []

//   return function({ count, frameRate, width, heigth }) {
    
//     frames.push(count)
//     if (frames.length >= frameRate) {
      
//       const countPerSecond = frames.reduce(add)
//       baseline = Math.min(countPerSecond * cycleRate, baseline)     
//       frames.length = 0

//       samples.push(countPerSecond)
      
//       dispatch.sensor({ samples })

//       if (samples.length % cycleRate === 0) {

//         const timestamp = Date.now()
//         const countPerMinute = samples.slice(-cycleRate).reduce(add)
//         peak = Math.max(countPerMinute, peak)

//         cycles.push({
//           timestamp, 
//           frameRate,
//           countPerMinute, 
//           baseline,
//           peak,
//           width, 
//           heigth,
//         })

//         dispatch.sensor({ cycles })

//       }
    
//     }

//   }

//   function add(a, b) {
//     return a + b
//   }
  
// }