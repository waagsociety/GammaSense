document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
(function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

function getType(value) {
  return typeof value === "undefined" ? "undefined" : _typeof(value);
}

var name = 'Magritte';

var _Object$1 = Object;
var _Array = Array;
var _document = typeof document != 'undefined' ? document : {};
var _isNaN = isNaN;
var _console = console;
var warn = _console.warn;
var error$1 = _console.error;
var functionType = getType(getType);
var booleanType = getType(!0);
var objectType = getType({});
var stringType = getType('');
var numberType = getType(0);

var listKind = 'list';
var booleanKind = 'a ' + booleanType;
var arrayKind = 'an Array';
var contentKind = 'a ' + stringType + ' or ' + numberType;
var modelValues = ['null', contentKind, booleanKind, 'or ' + arrayKind].join(', ');

var _undefined = undefined;
var _null = null;
var _true = true;

var emptyObject = {};

var w3Domain = 'http://www.w3.org/';
var svgNameSpace = w3Domain + '2000/svg';
var xlinkNameSpace = w3Domain + '1999/xlink';

var _pattern_ = 'p';
var _methods_ = 'm';

var assign = _Object$1.assign;

function concat(array, addition) {
  return array.concat(addition);
}

function createPropertyHandlers(cache) {

  return function (object) {
    var methods = assign(cache[_methods_] || {}, object);
    cache[_methods_] = methods;
    cache[_pattern_] = new RegExp('^' + _Object$1.keys(methods).join('|'));
    return cache;
  };
}

var freeze = _Object$1.freeze;

function freezeModelToState(model) {
  var state = {};
  for (var key in model) {
    var value = model[key];
    state[key] = getType(value) == functionType ? value.next : freezeModelToState(value);
  }
  return freeze(state);
}

var isArray = _Array.isArray;

function isBoolean(value) {
  return getType(value) == booleanType;
}

function isContent(value) {
  var type = getType(value);
  return value === _null || type == stringType || type == numberType && !_isNaN(value);
}

function getStoreContentKind(value, type) {
  type = getType(value);
  if (isBoolean(value)) type = booleanKind;else if (isContent(value)) type = contentKind;else if (isArray(value)) type = arrayKind;
  return type;
}

function isPlainObject(value) {
  return getType(value) != stringType && value == '[object Object]';
}

function slice(value, start, end) {
  return [].slice.call(value, start, end);
}

var _testStoreContent;

var testStoreContent = (_testStoreContent = {}, defineProperty(_testStoreContent, arrayKind, isArray), defineProperty(_testStoreContent, contentKind, isContent), defineProperty(_testStoreContent, booleanKind, isBoolean), _testStoreContent);

function toLowerCase(value) {
  return value.toLowerCase(value);
}

var cache = {};

function compose() {
  var base = slice(arguments);
  return function () {
    return concat(base, slice(arguments));
  };
}

function element() {
  return arguments;
}

var handleAttributes = createPropertyHandlers({});

function jsx$1(tag, attributes, children) {

  if (children) {
    var firstChild = children[0];
    if (getType(firstChild[0]) != stringType) children = firstChild;
  }

  return concat([tag, attributes], children);
}

// Public API methods

function resolveChild(content, abstract, store, type, name$$1) {

  type = getType(content);
  while (type == functionType) {
    name$$1 = content.name;
    content = content(store);
    type = getType(content);
  }

  if (content === _true) {
    name$$1 = content.name;
    content = abstract.content;
    type = content.type;
  }

  if (type != booleanType) {
    if (content == _null) content = _null;else if (type == stringType || type == numberType) type = contentKind;else if (getType(content[0]) == stringType) type = listKind;
  }

  return [content, type, name$$1];
}

//
function createStore(component, state, selector) {

  var time = void 0; // global timestamo
  var model = createStoreModel(state);

  return component({ state: freezeModelToState(model), model: model });

  function createStoreModel(value, host, key, path) {

    var structure = {};

    // plain Objects defined the structure of the model
    if (isPlainObject(value)) {
      for (var _key in value) {
        structure[_key] = createStoreModel(value[_key], structure, _key, (path || 'model') + '.' + _key);
      }
      return structure;
    }
    // other types of values are considered content
    else {
        var _ret = function () {

          var kind = getStoreContentKind(value);
          if (testStoreContent[kind]) {
            var dispatch = function dispatch(value) {

              var last = structure.next;

              // resolve callback into value using the current value
              while (getType(value) == functionType) {
                value = value(last);
              } // reset the state of the value if ‘next’ equals null
              if (value === _null) value = structure.null;

              // proceed to typechecking otherwise
              if (value !== _undefined && value !== last) {

                // update the view if next has the proper content kind...
                if (testStoreContent[kind](value)) {

                  var object = host[key];
                  time = Date.now(); // update the store time

                  assign(object, { next: value, last: last, time: time });
                  assign(structure, object);

                  return component({ state: freezeModelToState(model), model: model });
                }
                // ...or log a warning otherwise
                else contentWarning(value, path, kind);
              }
            };

            var hasChanged = function hasChanged(deep) {
              return structure.time === time;
            };

            assign(structure, {
              next: value,
              last: _undefined,
              null: kind == arrayKind ? [] : value,
              time: time,
              path: path,
              kind: kind,
              hasChanged: hasChanged
            });

            return {
              v: assign(dispatch, structure)
            };
          } else contentWarning(value, path, modelValues);
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
  }
}

function contentWarning(value, path, expected) {
  warn(name + ': invalid model value. (In \'' + path + '(value)\', value is "' + value + '" where ' + expected + ' was expected)');
}

function setAttribute(node, key, value, namespace) {
  if (value == _null || value === false) {
    namespace ? node.removeAttributeNS(namespace, key) : node.removeAttribute(key);
  } else {
    if (value === true) value = '';
    namespace ? node.setAttributeNS(namespace, key, value) : node.setAttribute(key, value);
  }
}

var attributeHandlers = handleAttributes({
  aria: function aria(node, key, value, store) {
    key = toLowerCase(key.replace(/([a-z])([A-Z])/g, '$1-$2'));
    setAttribute(node, key, value);
  },
  data: function data(node, key, value, store) {
    key = toLowerCase(key[4]) + key.substr(5);
    node.dataset[key] = value;
  },
  on: function on(node, key, value, store) {
    node[key] = handle;
    function handle(event) {
      value(assign(store, { event: event }));
    }
  },

  viewBox: setAttribute,

  xlink: function xlink(node, key, value) {
    key = toLowerCase(key.replace(/([a-z])([A-Z])/g, '$1:$2'));
    setAttribute(node, key, value, xlinkNameSpace);
  }
});

function createElement(type, namespace) {

  return namespace ? _document.createElementNS(namespace, type) : _document.createElement(type);
}

function renderContent(parent, content, abstract, store) {

  var createNode = !abstract.node || abstract.type;
  var node = createNode ? _document.createTextNode(content) : abstract.node;

  if (abstract && abstract.type) parent.replaceChild(node, abstract.node);else if (createNode) parent.appendChild(node);else if (abstract.content !== content) node.nodeValue = content;

  return { node: node, content: content };
}

function renderAttributes(node, content, abstract, store, namespace) {

  abstract = abstract || emptyObject;
  for (var key in content) {

    var value = content[key];
    if (value !== abstract[key]) {
      if (attributeHandlers[_pattern_].test(key)) {
        var match = key.match(attributeHandlers[_pattern_])[0];
        attributeHandlers[_methods_][match](node, key, value, store);
      } else if (namespace) setAttribute(node, key, value);else node[key] = value;
    }
  }

  return content;
}

var mount = _document.createEvent('Event').initEvent('mount', true, true);

function renderElement(parent, template, abstract, store, name$$1, namespace) {

  var type = abstract.node === parent ? _null : template[0];
  if (type === 'svg') namespace = svgNameSpace;

  var createNode = abstract.name !== name$$1 || abstract.type !== type;
  var node = createNode ? createElement(type, namespace) : abstract.node;
  var vdom = createNode ? [type] : abstract.vdom;
  var attributes = {};

  // render element children
  var length = template.length;
  var index = !!type - 1;
  while (++index < length) {

    var child = vdom[index] || emptyObject;

    var resolved = resolveChild(template[index], child, store);
    var content = resolved[0];
    var _type = resolved[1];
    var _name = resolved[2];

    if (_type == contentKind) {
      vdom[index] = renderContent(node, content, child, store);
    } else if (_type == listKind) {
      vdom[index] = renderElement(node, content, child, store, _name, namespace);
    } else if (_type == objectType) {
      vdom[index] = _null;
      if (content == _null) {
        var childNode = child.node;
        if (childNode) node.removeChild(childNode);
      } else assign(attributes, content);
    } else vdom[index] = child;
  }

  // render element attributes
  assign(attributes, renderAttributes(node, attributes, abstract.attributes, store, namespace));

  // add/remove children
  if (createNode) parent.appendChild(node);else while (index < vdom.length) {
    var _child = vdom[index];
    if (_child.node) node.removeChild(_child.node);
    index++;
  }
  vdom.length = length;

  // experimental: trigger custom lifecycle events
  if (createNode && attributes['onmount']) {
    node.addEventListener('mount', attributes['onmount'], false);
    node.dispatchEvent(mount);
  }

  return { node: node, type: type, name: name$$1, vdom: vdom, attributes: attributes };
}

var render$1 = function (node, selector, template, abstract) {

  return function (store) {
    cache[selector] = store;
    abstract = renderElement(node, template, abstract, store);
    return store;
  };
};

function factory(selector) {

  var template = slice(arguments, 1);
  var node = _document.querySelector(selector);

  if (selector in cache) error$1(name + ': selector must be unique. (In \'magritte(selector), selector \'' + selector + '\' is used before)');else cache[selector] = {};

  return node ? function (state) {

    node.innerHTML = ""; // todo: create abstract DOM from node.childNodes  
    var component = render$1(node, selector, template, {
      node: node,
      type: null,
      vdom: [],
      attributes: {}
    });

    return createStore(component, state).model;
  } : error$1(name + ': root element does not exist. (In \'magritte(selector), selector \'' + selector + '\' does not match any document element)');
}

var index = assign(factory, { cache: cache, compose: compose, element: element, handleAttributes: handleAttributes, jsx: jsx$1 });

var index_1$1 = index;

var storeModel = {
  session: 1,
  sensor: {
    status: 0,
    history: [],
    queue: []
  }
};

var toggleStatus = function toggleStatus(status) {
  return function (_ref) {
    var model = _ref.model;

    model.sensor.status(!status ? 1 : null);
  };
};

function filterClassName() {
  return filter(isString)(arguments).join(' ');
}

function filter(callback) {
  return function (data) {
    var result = [];
    var count = 0;
    for (var index = 0, length = data.length; index < length; ++index) {
      if (callback(data[index]) === true) result[count++] = data[index];
    }
    return result;
  };
}

function isString(value) {
  return typeof value == 'string';
}

var StatusButton = function StatusButton(status) {

  var className = filterClassName('StatusButton', !status && 'prominent');
  var textContent = ["Start Meting", "Annuleer", "Stop Meting"];

  return ['button', { className: className, type: 'button', onclick: toggleStatus(status) }, textContent[status]];
};

var Controls = function Controls(_ref) {
  var state = _ref.state,
      model = _ref.model;
  var status = state.sensor.status;

  return ['nav', { className: 'controls' }, StatusButton(status)];
};

var Header = ['header', { className: 'container' }, ['h1', "RadioSense"]];

var Monitor = function Monitor(_ref) {
  var state = _ref.state,
      model = _ref.model;

  return ['section', { className: 'monitor' }, ['h1', "Monitor"], ['canvas']];
};

function merge(object, extension) {
  for (var key in extension) {
    object[key] = extension[key];
  }return object;
}

function createElement$1(type) {
  return document.createElement(type);
}

function drawImage(context, source) {
  context.drawImage(source, 0, 0);
  return context;
}

function getImageData(context, _ref) {
  var width = _ref.width,
      height = _ref.height;

  return context.getImageData(0, 0, width, height);
}

function getContext(dimension) {
  return function (canvas) {
    return canvas.getContext(dimension);
  };
}

var getContext2d = getContext('2d');

function createImageData(dimensions) {

  var canvas = merge(createElement$1('canvas'), dimensions);
  var context = getContext2d(canvas);
  return function (source) {
    return getImageData(drawImage(context, source), dimensions);
  };
}

function putImageData(canvas, imageData) {
  var context = getContext2d(canvas);
  context.putImageData(imageData, 0, 0);
  return context;
}

function cycle(interval) {

  return function (callback) {

    return function (video) {

      var initialised = callback(video) !== false;
      var trigger = initialised && start(iteration);

      function start(callback) {
        return setInterval(iteration, interval);
      }

      function iteration() {
        if (initialised === false || callback(video) === false) {
          video.srcObject.getVideoTracks().forEach(function (track) {
            return track.stop();
          });
          video.src = '';
          clearInterval(trigger);
        }
        initialised = true;
      }

      return null;
    };
  };
}

function luma(r, g, b) {
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

function analyse(imageData, filter) {

  var data = imageData.data;
  var length = data.length;
  var index = 0;

  var sample = {
    time: Date.now(),
    resolution: length / 4,
    gamma: 0
  };

  while (index < length) {

    var r = index++;
    var g = index++;
    var b = index++;
    var a = index++;

    var lumincance = luma(data[r], data[g], data[b]);
    var hasGammaRadiation = lumincance > 0;

    var filtered = filter(lumincance);
    data[r] = filtered[0];
    data[g] = filtered[1];
    data[b] = filtered[2];
    data[a] = filtered[3];

    sample.gamma += hasGammaRadiation;
  }

  return { imageData: imageData, sample: sample };
}

function monitor$1(process, filter) {

  return function (video) {

    var getImageData = createImageData({
      width: video.videoWidth,
      height: video.videoHeight
    });

    var imageData = getImageData(video);
    var data = analyse(imageData, filter);
    return process(data);
  };
}

var measuring = false;
var render = index_1$1('#app', Header, Monitor, Controls);

render(storeModel);

// !function(element) {

//   const start = element.querySelector('#measure-start')
//   const stop = element.querySelector('#measure-stop')
//   const countdown = element.querySelector('#countdown')

//   const measure = sensor(250, config.video)

//   start.addEventListener('click', function(event) {
//     element.classList.toggle('is-active')
//     measure(monitor(countdown), filter(2, radioactive))
//     measuring = true
//   })

//   stop.addEventListener('click', function(event) {
//     element.classList.toggle('is-active')
//     measuring = false
//   })

// }(document.querySelector('#monitor'))

}());
