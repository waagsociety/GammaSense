// import { sensor } from '../../../model'

export default dispatch => ({
  
  requestLocation: event => {

    if (navigator.geolocation) {
      const { done, error } = handle(dispatch)
      dispatch.location({ loading: true })
      navigator.geolocation.getCurrentPosition(done, error)
    } else {
      console.log("Geolocation is not supported by this browser.")
    }

  },

  reset: event => {
    dispatch.location({ data: null, loading: false, error: null})
  },
  
})

function handle(dispatch) {
  return {
    done: function(data) {
      dispatch.location({ data, loading: false })
    },
    error: function(error) {
      dispatch.location({ error, loading: false })
    },
  }
}