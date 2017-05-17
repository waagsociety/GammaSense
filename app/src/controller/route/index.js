export const route = {
  hash: createRouter('hash', '#'),
  path: createRouter('path'),
}

function createRouter(kind, prefix) {

  return {
    push: pushRoute(kind, 'pushState', prefix),
    replace: pushRoute(kind, 'replaceState', prefix),
    match: matchRoute(kind, prefix),
    list: listRoute(kind, prefix),
    join: joinRoute(prefix),
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
    return function(...check) {      
      
      const path = splitLocation(kind, prefix)
      let length = check.length
      let match = path.length >= length
      
      if (match) while (length-- && match) {
        match = path[length] === check[length]
      }
      return match

    }
  }

  function joinRoute(prefix) {
    return function(...path) {
      return (prefix || '') + path.join('/')
    }
  }

  function listRoute(kind, prefix) {
    return function(index) {
      const path = splitLocation(kind, prefix)
      return index !== undefined ? path[index] : path
    }
  }

  function splitLocation(kind, prefix) {
    const path = location[kind]
    const pattern = new RegExp('^' + prefix)
    return path.replace(pattern, '').split(/\/+/g) || []
  }

  function join(array) {
    return array.join('/')
  }

}