export function cycle(interval) {

  return function(callback) {
    
    return function(video) {
    
      let initialised = callback(video) !== false
      const trigger = initialised && start(iteration)
      
      function start(callback) {     
        return setInterval(iteration, interval)
      }

      function iteration() {
        console.log('iteration')
        if (initialised === false || callback(video) === false) {
          video.pause()
          video.srcObject.getVideoTracks().forEach(track => track.stop())
          video.src = ''
          clearInterval(trigger)
        }
        initialised = true
      }

      return null

    }

  }

}










