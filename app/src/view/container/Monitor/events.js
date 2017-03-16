import { sensor } from '../../../model'

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
  
})