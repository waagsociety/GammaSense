
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

  return function(event) {
    
    active = true
    console.log('started')

    const media = sensor(function(sensorData, imageData) {
      
      const { data } = imageData
      const { resolution, count, channels, deveation } = sensorData
      const { m } = channels

      // console.log(count)
      // console.log(channels)
      // console.log(deveation)
      
      let index = -1
      while (++index < resolution) {        
        const pixel = index * 4
        const value = m[index]
        if (value) data[pixel + 1] = 255 - value
      }

      context.putImageData(imageData, 0, 0)
      return active

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

const Stop = document.createElement('button')
Stop.type = 'button'
Stop.textContent = 'Stop'
Stop.onclick = event => {
  console.log('stopped')
  active = false
}
document.body.appendChild(Stop)
