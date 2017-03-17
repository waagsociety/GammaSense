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
const interval = 1000
const media = {
  audio: false,
  video: {
    mandatory: {
      maxWidth: 640,
      maxHeight: 480,
    },
  },
}

// location
const { origin, pathname, search } = location
const root = [origin, pathname, search].join('').replace(/\/$/, '')

const routes = {
  home: root + '#',
  information: root + '#informatie',
  history: root + '#mijn-metingen',
}

// console.log(root, routes, location)

export default {
  routes,
  sensor: sensor({ interval, media, filter, display }),
}