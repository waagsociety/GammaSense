import { createElement, createUserMedia, handleUserMedia } from '../../toolkit'
import { cycle } from './cycle'
import { monitor } from './monitor'
export { filter } from './filter'

export default function sensor(interval, setup) {
  
  const video = createElement('video')
  const iterate = cycle(interval)

  return function(callback, filter) {
    
    const process = monitor(callback, filter)
  
    navigator.mediaDevices.getUserMedia(setup)
      .then(function(stream) {       
        video.srcObject = stream
        video.onloadedmetadata = event => iterate(process)(video)
      })
      .catch(console.warn)
    
  }

}