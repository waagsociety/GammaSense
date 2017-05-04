
const canvas = document.querySelector('canvas')
const sensor = createSensor(canvas, 10, console.log)

// event handler to start the sensor
function createSensor(canvas, frameRate, callback) {

  let active = false
  const context = canvas.getContext('2d')
  const sensor = initialize(analyzeImageData, { 
    video: {
      width: 480, 
      height: 320, 
      facingMode: 'user', 
      frameRate: frameRate,
    },
    audio:  false,
  })

  return function(succes, failed) {

    function(event) {

      active = !active
      if (active) {

        const second = []
        const minute = []

        const media = sensor(function(sensorData, imageData) {
          
          const { data } = imageData
          const { resolution, count, channels, deveation } = sensorData
          const { m } = channels

          second.push(count.m)
          if (second.length >= frameRate) {
            const countPerSecond = second.reduce((a, b) => a + b, 0)
            minute.push(countPerSecond)
            second.length = 0
          }

          if (minute.length >= 60) {
            const countPerMinute = minute.reduce((a, b) => a + b, 0)
            success({ countPerMinute, timestamp: Date.now() })
            minute.length = 0
          }
          
          let index = -1
          while (++index < resolution) {        
            const pixel = index * 4
            const value = m[index]
            if (value) data[pixel + 1] = 255 - value
          }

          context.putImageData(imageData, 0, 0)

          return active

        })

        media.catch(failed || console.warn)

      }

      else console.log('stopped')

    }

  }

}

const Toggle = document.createElement('button')
Toggle.type = 'button'
Toggle.textContent = 'Start/Stop'
Toggle.onclick = sensor
document.body.appendChild(Toggle)
