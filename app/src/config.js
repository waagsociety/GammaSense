import sensor, { visualise } from './controller/sensor'

// sensor
function radioactive(gamma) {
  const offset = 0 | (gamma* 0.75)
  return gamma > 0
    ? [128 - offset, 255, 192 - offset, 255]
    : [4, 8, 16, 255]
}

const filter = radioactive
const display = visualise(document.querySelector('#display'))
const sampleTime = 1000 * 20
const interval = 1000
const density = sampleTime / interval

const media = {
  audio: false,
  video: {
    mandatory: {
      maxWidth: 640,
      maxHeight: 480,
    },
  },
}

// routes
const routes = {
  home: '#',
  measurement: '#meting',
  information: '#informatie',
  history: '#mijn-metingen',
}

// mapbox
const mapbox = {
  accessToken: 'pk.eyJ1IjoibmF0aGFud2FhZyIsImEiOiJjajFvcjF3c2YwMDIwMzNraGQ0cXp0N3pmIn0.AtMn7ThFay9qJkv_8I85eA',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [0,40],
  zoom: 2,
}

export default {
  mapbox,
  monitor: { interval, density },
  routes,
  sensor: sensor({ interval, media, filter, display }),
}