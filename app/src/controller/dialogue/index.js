export const dialogue = function(cache, NULL, _length_, _start_, emptyString, _objectObject_) {

  _objectObject_ = emptyString + cache

  return {
    create: create,
    format: format,
    formatFrom: formatFrom,
    reciteFrom: reciteFrom,
  }

  function create(dictionary) {

    const content = Object.keys(dictionary).reduce(function(result, value) {
      result[normalizeLocaleKey(value)] = dictionary[value]
      return result
    }, {})

    return function() {
      return createLocaleContent(content, arguments)
    }

  }

  function formatFrom(dictionary) {
    const getContent = getFrom(dictionary)
    return function() {
      return format(getContent(arguments))
    }
  }

  function reciteFrom(dictionary) {
    const getContent = getFrom(dictionary)
    return function() {
      return getContent(arguments)
    }
  }

  
  // private methods
  function createLocaleContent(dictionary, locales) {

    locales = prepareLocales(locales)
    var storageKey = locales.join()
    var result = {}

    if (cache[storageKey]) {
      // console.log('cached')
      result = cache[storageKey]
    }
    else {
      // console.log('create')
      var index = locales[_length_]      
      while (index--) {
        var key = locales[index]
        deepAssign(result, dictionary[key] || {})
      }
    }

    return cache[storageKey] = result

  }

  function deepAssign(object, extension) {
    
    for (var key in extension) if (extension.hasOwnProperty(key)) {      
      
      var value = extension[key]
      if (isValidContent(value)) {
        object[key] = isPrimitive(object[key])
          ? value
          : deepAssign(object[key], value)
      }
      else {
        console.warn('Lingo expects a plain Object, string, or number as its contents.')
      }

    }

    return object

  }

  function isNil(value) {
    return value === undefined || value === NULL
  }

  function isValidContent(value) {
    return  !isNil(value) && /^string|number|object$/.test(typeof value)
  }

  function prepareLocales(data) {
    var result = []
    var length = data[_length_]
    var index = _start_
    while (++index < length) {
      var item = data[index]
      if (!isNil(item)) {
        result = result.concat(isPrimitive(item) ? normalizeLocaleKey(item) : prepareLocales(item))
      }
    }
    return result.filter(function(value) {
      return ~result.indexOf(value)
    })
  }

  function getFrom(value) {

    return function(path) {
      
      var result = value
      var length = (path || [])[_length_]
      var index = _start_

      while (++index < length && !isNil(result)) {
        var key = path[index]
        result = result[key]
      }

      return result

    }

  }

  function format(text) {
    
    text = (emptyString + text).split(/{{\s*|\s*}}/g)
    var size = text[_length_]

    return function(content) {
      
      // var data = content || {}
      // var last = data[_length_]
      var result = emptyString
      for (var index = 0; index < size; index += 2) {
        var value = content[text[index + 1]]
        result += text[index] + (!isNil(value) ? value : emptyString)
      }
      return result

    }
  }

  function normalizeLocaleKey(value) {
    return value.replace(/[^a-z]+/gi, '').toLowerCase()
  }

  // function each(callback) {
  //   return function(data, callback) {
  //     var continued = 1
  //     var length = data[_length_]
  //     var index = _start_
  //     while (++index < length && !!continued) {
  //       continued = callback(value)
  //     }
  //     return continued
  //   }
  // }

  function isPrimitive(value) {
    return isNil(value) || (typeof value !== 'object' && typeof value !== 'function')
  }

}({}, null, 'length', -1, '')
