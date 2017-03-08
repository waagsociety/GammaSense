export function reduce(callback, value) {
  
  const noInitialValue = value === undefined
  return function(data) {
    
    const length = data.length
    let index = noInitialValue - 1
    if (noInitialValue) value = data[0]
    if (length) {
      while (++index < length) value = callback(value, data[index])
    }
    return value

  }
}