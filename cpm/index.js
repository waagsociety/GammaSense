function createElement(tagName, properties) {
  return Object.assign(document.createElement(tagName), properties)
}

const body = document.body

const sensor = createSensor({
  width: 480, 
  height: 320, 
  facingMode: 'user', 
  frameRate: 2,
})

function dispatch(canvas, callback) {
  
  const context = canvas.getContext('2d')
  const second = []
  const minute = []

  return function({ count, timestamp, frameRate }) {
    
    if (second.length >= frameRate) {
      minute.push(second.reduce(add))
      second.length = 0
    }

    if (minute.length >= 5) {
      callback(minute.reduce(add))
      minute.length = 0
    }
    console.log(count)
    second.push(count)

  }

  function add(a, b) {
    return a + b
  }
  
}

const canvas = createElement('canvas', { width: 480, height: 320 })
body.appendChild(canvas)

const start = createElement('button', {
  type: 'button',
  textContent: 'Start',
  onclick: event => sensor.start(dispatch(canvas, console.info), console.warn),
})

const stop = createElement('button', {
  type: 'button',
  textContent: 'Stop',
  onclick: event => sensor.stop(),
})

body.appendChild(start)
body.appendChild(stop)

