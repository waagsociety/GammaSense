import { merge } from '../../_'
import { createElement } from '../../document'
import { drawImage } from '../drawImage'
import { getImageData } from '../getImageData'
import { getContext2d } from '../getContext2d'

export function createImageData(dimensions) {

  const canvas = merge(createElement('canvas'), dimensions)
  const context = getContext2d(canvas)
  return function(source) {
    return getImageData(drawImage(context, source), dimensions)
  }

}