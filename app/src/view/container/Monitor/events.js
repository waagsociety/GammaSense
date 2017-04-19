import { sensor } from '../../../model'
import { geolocation } from '../../../controller'

export const events = (dispatch, getState) => ({
  
  start: event => {
    console.log('start')
    sensor.monitor({ dispatch, active: true, getState })
  },

  stop: event => {
    console.log('stop')
    sensor.monitor({ dispatch, active: false, getState })
  },

  reset: event => {
    dispatch.sensor({ measurement: null, error: false })
  },

  prepare: event => {
    geolocation(dispatch)
  },
  
})