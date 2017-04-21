export const route = {
  hash: createRouter('hash', '#'),
  path: createRouter('path'),
}

function createRouter(kind, prefix) {

  return {
    push: pushRoute(kind, prefix),
    replace: pushRoute(kind, prefix),
    match: matchRoute(kind, prefix),
  }

  function pushRoute(kind, prefix) {

    prefix = prefix || ''
    return function(...path) {
      return event => {
        if (event) event.preventDefault()
        location[kind] = prefix + path.join('/')
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

}