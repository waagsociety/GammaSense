import { createStore } from 'redux'
import reducers from './reducers'

export default createStore(reducers)
export { sensor } from './actions'

export const createStoreModel = store => state => {
  
  const { getState } = store
  const dispatch = createDispatchModel(store.dispatch, state)
  const model = { 
    state,
    getState, 
    dispatch,
  }
  
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