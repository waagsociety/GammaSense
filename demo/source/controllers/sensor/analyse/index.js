import { luma } from '../luma'

export function analyse(imageData, filter) {

  const data = imageData.data
  const length = data.length
  let index = 0

  const sample = {
    time: Date.now(),
    resolution: length / 4,
    distribution: Array(255).fill(0),
    gamma: 0,
  }

  while (index < length) {
    
    const r = index++
    const g = index++
    const b = index++
    const a = index++

    const lumincance = luma(data[r], data[g], data[b])
    const hasGammaRadiation = lumincance > 0

    const filtered = filter(lumincance)
    data[r] = filtered[0]
    data[g] = filtered[1]
    data[b] = filtered[2]
    data[a] = filtered[3]

    sample.gamma += hasGammaRadiation
    sample.distribution[0 | lumincance] += 1

  }

  return { imageData, sample }

}
