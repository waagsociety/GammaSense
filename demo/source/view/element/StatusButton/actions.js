export function filterClassName() {
  return filter(isString)(arguments).join(' ')
}

function filter(callback) {
  return function(data) {
    const result = []
    let count = 0
    for (let index = 0, { length } = data; index < length; ++index) {
      if (callback(data[index]) === true) result[count++] = data[index]
    }
    return result
  }
}

function isString(value) {
  return typeof value == 'string'
}
