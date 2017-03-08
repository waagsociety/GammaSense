export function getImageData(context, { width, height }) {
  return context.getImageData(0, 0, width, height)
}