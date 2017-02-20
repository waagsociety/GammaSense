import { putImageData, toDataURL } from '../../../toolkit'

export function visualise(canvas) {  
  return function(imageData) {        
    const { width, height } = imageData
    canvas.width = width
    canvas.height = height
    putImageData(canvas, imageData)
  }
}