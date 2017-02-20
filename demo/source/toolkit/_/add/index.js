export function add(a, b) {
  
  function calculate(b) {
    return a + b
  }
  
  return b !== undefined
    ? calculate(b)
    : calculate

}