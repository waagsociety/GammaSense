import React from 'react'
import { Header, Monitor } from './component'

export default ({ model }) =>
  <div>
    <Header {...model}/>
    <Monitor {...model}/>
  </div>