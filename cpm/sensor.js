function initialize(analize, options) {

  const support = getBrowserSupport()
  let active = false

  return function(callback) {

    if (!hasBrowerSupport(support)) return Promise.reject(support)
    else if (active) return Promise.resolve(active)
    else active = true

    return navigator.mediaDevices.getUserMedia(options)
      .then(createVideoStream)
      .then(handleVideoStream(analize, callback, options))
      .then(isActive => active = isActive)

  }

  function createVideoStream(stream) {

    const video = createElement('video')
    const track = stream.getVideoTracks()[0]

    return new Promise((resolve, reject) => {  
      video.srcObject = stream
      video.play()
      video.onplay  = event => resolve({ video, track })
      video.onerror = event => reject({ error, track })
      return video
    })

  }

  function handleVideoStream(analize, callback, options) {
  
    const { width, height, frameRate } = options.video
    const interval = 1000 / frameRate

    const canvas = createElement('canvas', { width, height })
    const context = canvas.getContext('2d')
    const toImageData = renderImageData(context)

    return function({ video, track }) {

      return new Promise(resolve => {
        
        function iteration() {
          
          const now = performance.now()
          const imageData = toImageData(video, width, height)
          const sensorData = analize(imageData)
          const { error } = sensorData

          if (callback(sensorData, imageData) && !error) {
            setTimeout(iteration, interval - (performance.now() - now))
          }
          else resolve(!!track.stop())

        }

        return iteration()

      })

    }

  }

  function renderImageData(context) {
    return function(source, width, height) {
      context.drawImage(source, 0, 0, width, height)
      return context.getImageData(0, 0, width, height)
    }
  }

  function createElement(tagName, properties) {
    return Object.assign(document.createElement(tagName), properties)
  }
  
  function hasBrowerSupport(support) {
    return !Object.keys(support).filter(key => !support[key]).length
  }

  function getBrowserSupport() {
    return {
      canvas: hasCanvasSupport(),
      video: hasVideoSupport(),
      media: hasMediaSupport(),
    }
  }

  function hasBrowerSupport() {
    const support = getBrowserSupport()
    return !Object.keys(support).filter(key => !support[key]).length
  }

  function hasVideoSupport() {
    const video = createElement('video')
    return typeof video.canPlayType === 'function'
  }

  function hasCanvasSupport() {
    const canvas = createElement('canvas')
    return typeof canvas.getContext === 'function'
  }

  function hasMediaSupport() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }

}