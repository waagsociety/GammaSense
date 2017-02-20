import { createImageData } from '../../../toolkit'
import { analyse } from '../analyse'

export function monitor(process, filter) {
  
  return function(video) {

    const getImageData = createImageData({ 
      width:  video.videoWidth, 
      height: video.videoHeight
    })

    const imageData = getImageData(video)
    const data = analyse(imageData, filter)
    return process(data)

  }

}