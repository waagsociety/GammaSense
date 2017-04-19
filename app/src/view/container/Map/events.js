import { geolocation } from '../../../controller'

export default dispatch => ({
  
  requestLocation: event => {
    geolocation(dispatch)
  },

  reset: event => {
    dispatch.location({ data: null, loading: false, error: null})
  },
  
})