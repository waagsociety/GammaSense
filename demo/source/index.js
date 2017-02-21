import magritte from 'magritte'
import { config } from './config'
import { storeModel } from './model'
import { Controls, Header, Monitor } from './view'

import sensor, { filter } from './controllers/sensor'
import { putImageData } from './toolkit'

let measuring = false
function monitor(circle) {

  const canvas = document.querySelector('#display')
  // const minute = 60 * 1000
  const length = circle.getTotalLength()

  let start = Date.now()
  circle.style.strokeDasharray = length
  circle.style.strokeDashoffset = 0
  
  const storage = []
  let count = 0
  let total = 0

  return function({ sample, imageData }) {

    const duration = Date.now() - start

    if (duration >= 60000) {
      console.log('reset', storage)
      storage.push({ start, count, total, gamma: total / count })
      start = Date.now()
      total = 0
      count = 0
    }
    else {
      circle.style.strokeDashoffset = - ((duration / 1000) * (length / 30))
      total += sample.gamma
      ++count
    }
    
    const { width, height } = imageData
    canvas.width = width
    canvas.height = height
    putImageData(canvas, imageData)

    return measuring

  }
  
}

const heatmap = gamma => [255, 255 - gamma, 0, 255]
function radioactive(gamma) {
  const offset = 0 | (gamma* 0.75)
  return [128 - offset, 255, 192 - offset, 255]
}

const render = magritte('#app', Header, Monitor, Controls)

render(storeModel)

// !function(element) {
  
//   const start = element.querySelector('#measure-start')
//   const stop = element.querySelector('#measure-stop')
//   const countdown = element.querySelector('#countdown')

//   const measure = sensor(250, config.video)

//   start.addEventListener('click', function(event) {
//     element.classList.toggle('is-active')
//     measure(monitor(countdown), filter(2, radioactive))
//     measuring = true
//   })

//   stop.addEventListener('click', function(event) {
//     element.classList.toggle('is-active')
//     measuring = false
//   })

// }(document.querySelector('#monitor'))


