import { config } from './config'
import sensor, { filter } from './controllers/sensor'
import { putImageData } from './toolkit'

let measuring = false
function monitor(iterations) {
  
  const canvas = document.querySelector('#display')
  let count = 0

  return function({ sample, imageData }) {
    
    const { width, height } = imageData
    canvas.width = width
    canvas.height = height
    putImageData(canvas, imageData)

    return measuring

  }
  
}

function heatmap(gamma) {
  return [255, 255 - gamma, 0, 255]
}

function radioactive(gamma) {
  const offset = 0 | (gamma* 0.75)
  return [128 - offset, 255, 192 - offset, 255]
}


!function(element) {
  
  const start = element.querySelector('#measure-start')
  const stop = element.querySelector('#measure-stop')
  const measure = sensor(200, config.video)

  start.addEventListener('click', function(event) {
    element.classList.toggle('is-active')
    measure(monitor(1000), filter(2, radioactive))
    measuring = true
  })

  stop.addEventListener('click', function(event) {
    element.classList.toggle('is-active')
    measuring = false
  })

}(document.querySelector('#monitor'))


