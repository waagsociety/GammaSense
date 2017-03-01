import { createStore } from 'redux'
import reducers from './reducers'

export default createStore(reducers)

export const createStoreModel = store => state => {
  
  const dispatch = createDispatchModel(store.dispatch, state)
  const model = { state, dispatch }
  
  return { model }

}

function createDispatchModel(dispatch, object) {
  return Object.keys(object).reduce((result, key) => {
    result[key] = createModelDispatcher(key, dispatch)
    return result
  }, {})
}

function createModelDispatcher(type, dispatch) {
  return data => dispatch({ type, data })
}