export function filter(treshold, method) {
  
  method = method || initial

  return function(lumincance) {
    return lumincance >= treshold
      ? method(normalise(lumincance, treshold))
      : [0, 0, 0, 255]
  }

  function normalise(lumincance, treshold) {
    const baseline = lumincance - treshold
    const multiplier = 255 / (255 - treshold)
    return 0 | baseline * multiplier
  }

  function initial(gamma) {
    return [255, 255, 255, 255]
  }

}