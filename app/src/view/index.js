import React from 'react'
import { Header, Monitor } from './container'

export default class App extends React.Component {

  // componentWillMount(x) {
  //   // console.log('x', this, x)
  // }

  render() {
    const { model } = this.props
    return <div>
      <Header {...model}/>
      <Monitor {...model}/>
    </div>
  }

}