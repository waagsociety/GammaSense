import React from 'react'
import { Header, History, Monitor, Information } from './container/'

function Route({ component, href, hash, path }) {
  href = href === undefined || location.href === href
  hash = hash === undefined || location.hash === hash
  path = path === undefined || location.pathname === path 
  return href && hash && path ? component : null
}

export default class App extends React.Component {

  componentDidMount() {
    const { model } = this.props
    // const { routes } = model.state.config    
    if (!model.state.session.informed) {
      // location.href = routes.information
      model.dispatch.session({ informed: true })
    }

    window.onhashchange = function(event) {
      model.dispatch.route({ hash: location.hash })
    }
  }

  render() {

    const { model } = this.props
    const { routes } = model.state.config

    return <div>
      <Header {...model}/>
      <Monitor {...model}/>
      <Route component={<Information {...model}/>} href={routes.information}/>
      <Route component={<History {...model}/>} href={routes.history}/>
    </div>

  }

}