import config from '../../../config'
import { mean, last, findIndex, eqProps, comparator } from 'ramda'

const { density } = config.monitor
const transferCoords = transfer('longitude', 'latitude')
const compareInitialized = comparator((a, b) => a.initialized > b.initialized)

export const sensor = {

  monitor({ dispatch, active, getState }) {
    
    dispatch.sensor({ active })

    const initialized = Date.now()
    const equalById = eqProps('initialized', initialized)

    const update = initialize({
      density,
      initialized,
      session: 'abcdef',
      baseline: null,
    })

    config.sensor(({ sample, imageData }) => {
      
      const state = getState()
      const { sensor, location } = state
      const { active, history } = sensor
      const { error } = sample

      const measurement = update(sample)
      const { samples, cycles } = measurement

      if (active) {
        if (cycles.length && samples.length % density === 0) {
          
          const entry = storeData(measurement, location.data)
          
          const index = findIndex(item => item.initialized === initialized, history)
          history[index < 0 ? history.length : index] = entry

          dispatch.sensor({ history: history.sort(compareInitialized) })

        }
        dispatch.sensor({ measurement, error, active: !error })
      }
      else dispatch.sensor({ measurement: null })
      
      return active

    })

  },

}

function storeData({ cycles, baseline, initialized, session, samples }, { coords }) {

  const lastCycle = last(cycles)
  const location = transferCoords(coords)
  
  const body = {
    ts_device: (new Date()).toISOString(),
    id_device: 1337,
    id_measure: initialized,
    measured_value: 1337,
    mean_value: lastCycle.mean,
    min_value: lastCycle.min,
    max_value: lastCycle.max,
    location,
    baseline,
  }

  var xhr = new XMLHttpRequest()
  xhr.withCredentials = true
  xhr.addEventListener("readystatechange", function () {
    console.log(this.responseText)
  })

  xhr.open("POST", "https://gammasense.org:8090/add");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("cache-control", "no-cache");

  xhr.send(JSON.stringify(body))

  return {
    data: cycles,
    summary: {
      mean: mean(samples),
      min: Math.min(...samples),
      max: Math.max(...samples),
    },
    session,
    baseline,
    initialized, 
    location,
  }
  
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