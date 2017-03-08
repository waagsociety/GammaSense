import React from 'react'
import ReactDOM from 'react-dom'
import { Monitor } from './index.js'

it('renders without crashing', _ => {
  const div = document.createElement('div')
  ReactDOM.render(<Monitor/>, div)
})
