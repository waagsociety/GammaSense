import { createImageData } from '../../canvas'

export function handleUserMedia(video, callback) {

  video.addEventListener('loadedmetadata', handle)    
  function handle(event) {
    callback(video)
    video.removeEventListener('loadedmetadata', handle)

  }

}
