import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import config from './config'
import store, { createStoreModel } from './model'
import App from './view'

const model = createStoreModel(store)
const Container = connect(model)(App)

ReactDOM.render(
  <Container store={store} config={config}/>,
  document.getElementById('root')
)
