export function getContext(dimension) {
  return function(canvas) {
    return canvas.getContext(dimension)
  }
}