import { createImageData } from '../../_'
import { analyse } from '../analyse'

export function monitor(callback, filter, display) {
  
  return function(video) {

    const getImageData = createImageData({ 
      width:  video.videoWidth, 
      height: video.videoHeight
    })

    const { imageData, sample } = analyse(getImageData(video), filter)

    const continued = callback(sample)
    display(imageData, continued)
    return continued

  }

}