import { add } from '../add'
import { reduce } from '../reduce'

export function average() {
  return reduce(add)(arguments) / arguments.length
}