import { createImageData } from '../../_'
import { analyse } from '../analyse'

export function monitor(callback, filter, display) {
  
  return function(video) {

    const getImageData = createImageData({ 
      width:  video.videoWidth, 
      height: video.videoHeight
    })

    const imageData = getImageData(video)
    const { data, sample } = analyse(imageData, filter)

    const continued = callback(sample)
    // display(imageData, continued, data)
    return continued

  }

}