import { putImageData, getContext2d, getImageData } from '../../_'

export function visualise(canvas) {

  const { width, height } = canvas
  const context = getContext2d(canvas)
  const initialImageData = getImageData(context, { width, height })

  return function(imageData, continued) {

    const { width, height } = imageData
    canvas.width = width
    canvas.height = height
    
    continued
      ? putImageData(canvas, imageData)
      : putImageData(canvas, initialImageData)

    return continued

  }
}