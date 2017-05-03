
let active = false

// initialize a sensor method
const sensor = initialize(analyzeImageData, { 
  video: {
    width: 480, 
    height: 320, 
    facingMode: 'user', 
    frameRate: 60,
  }, 
  audio:  false,
})

// event handler to start the sensor
function startSensor(canvas) {

  const context = canvas.getContext('2d')
  const currentData = context.getImageData(0, 0, 480, 320)

  return function(event) {
  
    const media = sensor(function(sensorData, imageData) {

      const length = imageData.width * imageData.height * 4
      let index = 0
      while (index < length) {
        
        const r = index++
        const g = index++
        const b = index++

        const mean = (imageData.data[r] + imageData.data[g] + imageData.data[b]) / 3
        if (mean) {
          imageData.data[r] = 60 - (mean / 4)
          imageData.data[g] = 255
          imageData.data[b] = 125 - (mean / 2)
        }

        index++

      }

      context.putImageData(imageData, 0, 0)
      return true

    })

    media.catch(console.error)

  }

}

const canvas = document.querySelector('canvas')

const Start = document.createElement('button')
Start.type = 'button'
Start.textContent = 'Start'
Start.onclick = startSensor(canvas)
document.body.appendChild(Start)
