import { config } from './config'
import sensor, { filter } from './controllers/sensor'
import { putImageData, average } from './toolkit'

let measuring = false
function monitor(canvas, svg) {

  const sampleTime = 60000

  const circle = svg.querySelector('circle')
  const text = svg.querySelector('text')
  const length = circle.getTotalLength()

  let start = Date.now()
  circle.style.strokeDasharray = length
  circle.style.strokeDashoffset = 0
  
  const storage = []
  const samples = []
  let count = 0
  let total = 0

  return function({ sample, imageData }) {

    const duration = Date.now() - start

    if (duration >= sampleTime) {
      const gamma = total / count
      const onePercent = sample.resolution / 100
      samples.push(gamma / onePercent)
      text.textContent = Math.round(average(...samples) * 100) / 100
      storage.push({ start, count, total, gamma })
      start = Date.now()
      total = 0
      count = 0
    }
    else {
      circle.style.strokeDashoffset = - ((duration / 1000) * (length / ((sampleTime / 1000) / 2)))
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

function heatmap(gamma) {
  return [255, 255 - gamma, 0, 255]
}

function radioactive(gamma) {
  const offset = 0 | (gamma* 0.75)
  return [128 - offset, 255, 192 - offset, 255]
}

!function(element) {
  
  const canvas = element.querySelector('canvas')
  const svg = element.querySelector('svg')

  const start = element.querySelector('#measure-start')
  const stop = element.querySelector('#measure-stop')

  const measure = sensor(250, config.video)

  start.addEventListener('click', function(event) {
    element.classList.toggle('is-active')
    measure(monitor(canvas, svg), filter(2, radioactive))
    measuring = true
  })

  stop.addEventListener('click', function(event) {
    element.classList.toggle('is-active')
    measuring = false
  })

}(document.querySelector('#monitor'))


