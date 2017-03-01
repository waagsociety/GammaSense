import { combineReducers } from 'redux'
import sensor from './sensor'
import session from  './session'

const reducers = createCombinedReducers({
  sensor,
  session,
})

export default reducers

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