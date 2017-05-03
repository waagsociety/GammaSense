function analyzeImageData(imageData) {

  const { data } = imageData
  const timestamp = Date.now()

  const length = data.length
  const resolution = length / 4
  const deveation = [0,0,0]
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
      deveation[0] += min + r
      deveation[1] += min + g
      deveation[2] += min + b
    }

  }

  return {
    data: { hits, timestamp, deveation }, 
    error: false 
  }

}