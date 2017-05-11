// import config from '../../../config'
// import { createSensor } from '../../../controller'
// import { mean, last, findIndex, comparator } from 'ramda'

// const x = createSensor(config.sensor)

// const transferCoords = transfer('longitude', 'latitude')
// const compareInitialized = comparator((a, b) => a.initialized > b.initialized)

export const sensor = {

  start(x) {
    console.log('x', x)
  },

  stop() {

  },

}



// function storeData({ cycles, baseline, initialized, session, samples }, { coords }) {

//   const lastCycle = last(cycles)
//   const location = transferCoords(coords)
  
//   const body = {
//     ts_device: (new Date()).toISOString(),
//     id_device: 1337,
//     id_measure: initialized,
//     measured_value: 1337,
//     mean_value: lastCycle.mean,
//     min_value: lastCycle.min,
//     max_value: lastCycle.max,
//     location,
//     baseline,
//   }

//   var xhr = new XMLHttpRequest()
//   xhr.withCredentials = true
//   xhr.addEventListener("readystatechange", function () {
//     // console.log(this.responseText)
//   })

//   xhr.open("POST", "https://gammasense.org:8090/add");
//   xhr.setRequestHeader("content-type", "application/json");
//   xhr.setRequestHeader("cache-control", "no-cache");

//   xhr.send(JSON.stringify(body))

//   return {
//     data: cycles,
//     summary: {
//       mean: mean(samples),
//       min: Math.min(...samples),
//       max: Math.max(...samples),
//     },
//     session,
//     baseline,
//     initialized, 
//     location,
//   }
// }

// function transfer(...keys) {

//   return function(object) {
//     if (object) return keys.reduce(function(result, key, index) {
//       result[index] = object[key]
//       return result
//     }, [])
//   }

// }
