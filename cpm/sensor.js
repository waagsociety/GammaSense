function createSensor(videoOptions) {
  
  let active = false
  const { frameRate } = videoOptions
  const support = hasBrowserSupport()
  const options = { video: videoOptions, audio: false }
  
  function start(complete, failed) {
    
    if (!support) failed(getBrowserSupport())
    else if (!active) active = !!navigator.mediaDevices.getUserMedia(options)
      .then(createVideoStream)
      .then(captureVideoStream(complete))
      .catch(failed)
  }

  function stop() {
    active = false
  }

  function createVideoStream(stream) {

    return new Promise(function(resolve, reject) {

      const track = stream.getVideoTracks()[0]
      const video = createElement('video', {
        srcObject: stream,
        onloadeddata: event => resolve({ video, track }),
        onerror: event => reject({ video, track }),
      })

      video.play()

    })

  }

  function captureVideoStream(dispatch) {
    
    return function({ video, track }) {

      const { videoWidth, width, videoHeight: height } = video
      const canvas = createElement('canvas', { width, height })
      const context = canvas.getContext('2d')
      
      const frameTime = 1000 / frameRate
      console.log(width)
      const getImageData = renderImageData({ context, width, height })
      const getGammaData = renderGammaData({ frameRate, frameTime })

      const cycle = setInterval(iteration, frameTime)    

      function iteration() {
        const imageData = getImageData(video)
        const gammaData = getGammaData(imageData, frameRate)
        active = active && dispatch(gammaData) !== false
        if (!active) stop(track, cycle)
      }

      function stop(track, cycle) {
        clearInterval(cycle)
        track.stop()
        video.pause()
      }

    }

  }
  
  function renderGammaData({ frameRate, frameTime }) {

    return function(imageData, frameRate) {

      const timestamp = Date.now()
      const data = imageData.data
      const length = data.length
      let index = 0
      let count = 0

      while (index < length) {

        var r = index++
        var g = index++
        var b = index++
        index++

        count += (data[r] + data[g] + data[b]) > 0

      }

      return { count, timestamp, frameRate, frameTime }

    }    

  }

  function renderImageData({ context, width, height }) {
    return function(source) {
      context.drawImage(source, 0, 0, width, height)
      return context.getImageData(0, 0, width, height)
    }
  }

  function createElement(tagName, properties) {
    return Object.assign(document.createElement(tagName), properties)
  }

  function getBrowserSupport() {
    return {
      canvas: hasCanvasSupport(),
      video: hasVideoSupport(),
      media: hasMediaSupport(),
    }
  }

  function hasBrowserSupport() {
    return hasCanvasSupport() && hasVideoSupport() && hasMediaSupport()
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

  return { start, stop }

}