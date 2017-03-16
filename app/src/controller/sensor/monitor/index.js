import { createImageData } from '../../_'
import { analyse } from '../analyse'

export function monitor(callback, filter, display) {
  
  return function(video) {

    const getImageData = createImageData({ 
      width:  video.videoWidth, 
      height: video.videoHeight
    })

    const imageData = getImageData(video)
    
    const normalised = analyse(imageData, filter)
    const { sample } = normalised

    const continued = callback({ sample, imageData })

    display(normalised.imageData, continued)

    return continued

  }

}