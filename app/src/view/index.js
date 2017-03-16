import React from 'react'
import { Header, History, Monitor, Information } from './container/'

function Route({ component, hash, path }) {
  hash = hash === undefined || location.hash === hash
  path = path === undefined || location.pathname === path
  return hash && path ? component : null
}

export default class App extends React.Component {

  componentDidMount(x) {
    const { model } = this.props
    
    if (!model.state.session.informed) {
      location.hash = '#informatie'
      model.dispatch.session({ informed: true })
    }

    window.onhashchange = function(event) {
      model.dispatch.route({ hash: location.hash })
    }
  }

  render() {
    const { model } = this.props
    console.log(model.state.session.informed)
    return <div>
      <Header {...model}/>
      <Monitor {...model}/>
      <Route component={<Information {...model}/>} hash='#informatie'/>
      <Route component={<History {...model}/>} hash='#mijn-metingen'/>
    </div>
  }

}