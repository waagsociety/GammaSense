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

const transferCoords = transfer('longitude', 'latitude')

function handle(dispatch) {
  return {
    done: function(data) {
      dispatch.location({ data, loading: false })
      const zoom = window._MAPBOX_.getZoom()
      setTimeout(_ => window._MAPBOX_.flyTo({
        center: transferCoords(data.coords),
        zoom: Math.max(zoom, 12)
      }))
    },
    error: function(error) {
      dispatch.location({ error, loading: false })
    },
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