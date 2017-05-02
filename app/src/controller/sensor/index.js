import { createElement } from '../_'
import { cycle } from './cycle'
import { monitor } from './monitor'

export { visualise } from './visualise'

export default function sensor({ interval, media, filter, display }) {
  
  const iterate = cycle(interval)

  return function(callback) {
    
    const video = createElement('video')
    const process = monitor(callback, filter, display)
  
    navigator.mediaDevices.getUserMedia(media)
      .then(function(stream) {       
        video.srcObject = stream
        video.onloadedmetadata = event => iterate(process)(video)
      })
      .catch(console.warn)
    
  }

}
