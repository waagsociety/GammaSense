const analyzeImageData = function() {

  // Objects are pooled to keep memory usage in check
  const treshold = 0
  const cache = {
    deveation: { r: [], g: [], b: [] },
  }

  const channels = { r: [], g: [], b: [], m: [] }

  return function(imageData) {

    const data = imageData.data
    const resolution = data.length / 4
    const timestamp = Date.now()

    const count = { r: 0, g: 0, b: 0, m: 0 }
    const deveation = { r: 0, g: 0, b: 0 }
    
    let index = -1
    while (++index < resolution) {
      
      const base = index * 4
      const r = data[base]
      const g = data[base + 1]
      const b = data[base + 2]
      const m = (r + g + b) / 3

      // channels.r[index] = r
      // channels.g[index] = g
      // channels.b[index] = b
      channels.m[index] = m

      // count.r += (r > treshold)
      // count.g += (g > treshold)
      // count.b += (b > treshold)
      count.m += (m > treshold)
      
      // const min = Math.min(r, g, b)
      // cache.deveation.r[index] = min + r
      // cache.deveation.g[index] = min + g
      // cache.deveation.b[index] = min + b

    }

    // deveation.r = mean(cache.deveation.r)
    // deveation.g = mean(cache.deveation.g)
    // deveation.b = mean(cache.deveation.b)

    // console.log('monochrome count:', count.m)
    const error = null

    return { count, channels, deveation, resolution, timestamp, error }

  }

}()

function mean(array) {
  const length = array.length
  let index = -1
  let sum = 0
  while (++index < length) sum += array[index]
  return sum / length || 0
}