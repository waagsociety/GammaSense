import { geolocation } from '../../../controller'

export default dispatch => ({
  
  requestLocation: event => {
    geolocation(dispatch)
  },

})