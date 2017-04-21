const transferCoords = transfer('longitude', 'latitude')

export function geolocation(dispatch, map) {

  map = map || window._MAPBOX_

  function succes(data) {
    dispatch.location({ data, loading: false })
    map.flyTo({
      center: transferCoords(data.coords),
      zoom: Math.max(16, map.getZoom())
    })
  }

  function failed(error) {
    dispatch.location({ error, loading: false })
  }

  if (navigator.geolocation) {
    dispatch.location({ loading: true })
    navigator.geolocation.getCurrentPosition(succes, failed)
  }

  return map

}

function transfer(...keys) {

  return function(object) {
    if (object) return keys.reduce(function(result, key, index) {
      result[index] = object[key]
      return result
    }, [])
  }

}