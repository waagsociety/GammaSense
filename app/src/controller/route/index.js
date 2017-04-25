export const route = {
  hash: createRouter('hash', '#'),
  path: createRouter('path'),
}

function createRouter(kind, prefix) {

  return {
    push: pushRoute(kind, 'pushState', prefix),
    replace: pushRoute(kind, 'replaceState', prefix),
    match: matchRoute(kind, prefix),
  }

  function pushRoute(kind, method, prefix) {

    prefix = prefix || ''
    return function(...path) {
      return event => {
        if (event) event.preventDefault()
        const { origin } = location
        const route = path.length ? prefix + join(path) : ''
        history[method](null, document.title, origin + '/' + route)
        window.onhashchange() // hack
      }
    }
  }

  function matchRoute(kind, prefix) {

    const prefixPattern = new RegExp('^' + prefix)
    
    return function(...check) {
      
      const actual = location[kind].replace(prefixPattern, '').split(/\/+/g) || []
      let length = check.length
      let match = actual.length >= length
      
      if (match) while (length-- && match) {
        match = actual[length] === check[length]
      }

      return match

    }

  }

  function join(array) {
    return array.join('/')
  }

}