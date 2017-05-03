function analyzeImageData(imageData) {

  const { data } = imageData
  const timestamp = Date.now()

  const length = data.length
  const deveation = { r: [], g: [], b: [] }
  const hits = []
  
  let index = 0
  while (index < length) {
    
    const r = data[index++]
    const g = data[index++]
    const b = data[index++]
    index++ // skip alpha

    hits.push((r + g + b) / 3)
    if (r !== g || g !== b) {
      const min = Math.min(r, g, b)
      deveation.r.push(min + r)
      deveation.g.push(min + g)
      deveation.b.push(min + b)
    }

  }

  deveation.r = mean(deveation.r)
  deveation.g = mean(deveation.b)
  deveation.b = mean(deveation.b)

  const error = null

  return { hits, deveation, timestamp, error }

}

function mean(array) {
  const length = array.length
  let index = -1
  let sum = 0
  while (++index < length) sum += array[index]
  return sum / length || 0
}