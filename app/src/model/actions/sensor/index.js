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
          
          const entry = storeData(measurement, samples, location.data)
          
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

  const data = last(cycles)
  const location = transferCoords(coords)
  
  const body = {
    session,
    data,
    baseline,
    initialized, 
    location,
  }

  const summary = {
    mean: mean(samples),
    min: Math.min(...samples),
    max: Math.max(...samples),
  }

  return Object.assign(body, { data: cycles, summary })
  
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