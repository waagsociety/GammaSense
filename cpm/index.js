
// initialize a sensor method
const sensor = initialize(analyzeImageData, { 
  video: {
    width: 480, 
    height: 320, 
    facingMode: 'user', 
    frameRate: 2,
  }, 
  audio:  false,
})

// event handler to start the sensor
function startSensor(canvas) {

  const context = canvas.getContext('2d')

  return function(event) {
  
    const media = sensor(function(imageData, data, error) {
      context.putImageData(imageData, 0, 0)
      return true
    })

    media.catch(console.error)

  }

}

const canvas = document.querySelector('canvas')

const Start = document.createElement('button')
Start.textContent = 'Start'
Start.onclick = startSensor(canvas)
document.body.appendChild(Start)
