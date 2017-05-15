import React from 'react'
import MapComponent from 'mapbox-gl-react'
import { geolocation } from '../../../controller/'
import './index.css'

import events from './events'
import { LocationToggle } from '../../element/'

const transferCoords = transfer('longitude', 'latitude')

export const Map = ({ state, dispatch }) => {

  const { requestLocation } = events(dispatch, window._MAPBOX_)
  const { location, config, session, dialog } = state
  const { mapbox } = config
  const { data } = location
  const { support } = session

  const coords = transferCoords(data && data.coords)
  const center = coords || mapbox.center

  return <section className='Map full content' hidden={state.sensor.active}>

    { support.webGL 
      ? <MapComponent id='MapBox' 
        accessToken={mapbox.accessToken}
        style={mapbox.style}
        center={center}
        zoom={mapbox.zoom}
        eventHandlers={{ 
          load: map => {

            window._MAPBOX_ = geolocation(dispatch, map)
            dispatch.location({ ready: true })

            // TEMP LOAD MAP DATA
            var data = null
            var xhr = new XMLHttpRequest()
            xhr.withCredentials = true
            xhr.addEventListener("readystatechange", function () {
              
              if (this.readyState === 4) {
                const response = JSON.parse(this.responseText)
                if (response.status === 'success') {
                  
                  const body = JSON.parse(response.body)
                  const features = body.reduce(function(result, item) {
                    return result.concat({
                      type: "Feature", 
                      properties: { "Primary ID": item.id_measure, }, 
                      geometry: JSON.parse(item.location),
                    })
                  }, [])

                  const data = {
                    type: "FeatureCollection",
                    features,
                  }

                  map.addSource("earthquakes", { data, type: "geojson" })

                  map.addLayer({
                      "id": "unclustered-points",
                      "type": "circle",
                      "source": "earthquakes",
                      "paint": {
                        "circle-color": 'rgba(255,255,255,0.25)',
                        "circle-radius": 20,
                        "circle-blur": 1
                      },
                      "filter": ["!=", "cluster", true]
                  }, 'waterway-label')

                }
              }
            })
            xhr.open('get', "https://gammasense.org/app/sensordata")
            xhr.setRequestHeader("cache-control", "no-cache")
            xhr.send(data)

          }
        }}
      />
      : <h1 style={{ margin: '4em 1em 0' }}>webGL is not supported</h1>
    }

    <LocationToggle events={{ requestLocation }} location={location} dialog={dialog}/>

  </section>

}

function transfer(...keys) {

  return function(object) {
    if (object) return keys.reduce(function(result, key, index) {
      result[index] = object[key]
      return result
    }, [])
  }

}
