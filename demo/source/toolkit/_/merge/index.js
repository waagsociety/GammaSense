export function merge(object, extension) {
  for (const key in extension) object[key] = extension[key]
  return object
}