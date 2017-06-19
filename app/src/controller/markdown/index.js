
export function markdown(data, index) {

  const collection = data.keys().reduce(function(collection, fileName) {

    const [locale, name] = fileName.match(/.\/([^.]+).*/)[1].split('/')
    if (locale && name) {
      const host = collection[locale] || (collection[locale] = {})
      host[name] = data(fileName)
    }
    return collection

  }, {})
  
  const store = Object.keys(collection).reduce(function(content, key) {
    content[key] = index.map(function(hash) {
      const host = collection[key]
      return resolveContent(host[hash], hash)
    })
    return content
  }, {})

  return function(locale) {
    return store[locale]
  }

}

function resolveContent(object, hash) {
  let html = ''
  const metadata = {}
  for (const key in object) if (object.hasOwnProperty(key)) {
    const value = object[key]
    key === '__content' 
      ? html = value
      : metadata[key] = value
  }
  return { hash, metadata, html }
}