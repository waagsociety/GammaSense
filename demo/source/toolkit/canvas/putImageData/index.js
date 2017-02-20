import { getContext2d } from '../getContext2d'

export function putImageData(canvas, imageData) {
  const context = getContext2d(canvas)
  context.putImageData(imageData, 0, 0)
  return context
}