export function merge(object, extension) {
  for (const key in extension) {
    if (extension.hasOwnProperty(key)) {
      object[key] = extension[key]
    }
  }
  return object
}