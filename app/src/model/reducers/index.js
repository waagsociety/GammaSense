import { combineReducers } from 'redux'
import config from '../../config'
import dialog from '../../dialog'
import route from './route'
import sensor from './sensor'
import session from  './session'


export default createCombinedReducers({
  config,
  dialog,
  route,
  sensor,
  session,
})

// reducers
function createCombinedReducers(object) {
  const reducers = createReducers(object)
  return combineReducers(reducers)
}

function createReducers(object) {
  return Object.keys(object).reduce((result, key) => {
    result[key] = createReducer(key, object[key])
    return result
  }, {})
}

function createReducer(type, initial) {
  function reduce(state = initial, action) {
    return type === action.type
      ? Object.assign({}, state, action.data)
      : state
  }
  return reduce
}