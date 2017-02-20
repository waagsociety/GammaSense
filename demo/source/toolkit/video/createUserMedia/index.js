export function createUserMedia(video, setup) {
  
  navigator.getUserMedia(setup, play(video), console.error)

  function play(video) {
    return function(stream) {
      video.srcObject = stream
    }
  }

  return video

}