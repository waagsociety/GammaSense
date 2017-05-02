import { luma } from '../luma'

export function analyse(imageData, filter) {

  const data = imageData.data
  const length = data.length
  let index = 0

  const time = Date.now()
  const resolution = length / 4
  let gamma = 0
  let color = 0

  while (index < length) {
    
    const r = index++
    const g = index++
    const b = index++
    const a = index++

    const lumincance = luma(data[r], data[g], data[b])
    const hasGammaRadiation = lumincance > 0
    
    color += data[r] !== data[g] && data[g] !== data[b]

    const filtered = filter(lumincance)
    data[r] = filtered[0]
    data[g] = filtered[1]
    data[b] = filtered[2]
    data[a] = filtered[3]

    gamma += hasGammaRadiation
    
  }

  const monochrome = (color / resolution) < 1 / 100
  const error = !monochrome && { monochrome }
  const percentage = (gamma / resolution) * 100
  const sample = { time, resolution, percentage, gamma, error }

  return { imageData, sample }

}
