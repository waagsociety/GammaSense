export const route = {
  hash: createRouter('hash'),
  path: createRouter('path'),
}

function createRouter(kind) {

  function handler(path) {
    return function(event) {
      event.preventDefault()
      location[kind] = path
    }
  }

  return {
    push: handler,
    replace: handler,
  }
}