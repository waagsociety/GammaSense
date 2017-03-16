import React from 'react'
import { Header, Monitor, SideBar } from './container/'

function Route({ component, hash, path }) {
  hash = hash === undefined || location.hash === hash
  path = path === undefined || location.pathname === path
  return hash && path ? component : null
}

const H1 = ({ state }) => {
  const { hash } = state.route
  return <h1>{hash}</h1>
}

export default class App extends React.Component {

  componentDidMount(x) {
    const { model } = this.props
    window.onhashchange = function(event) {
      model.dispatch.route({ hash: location.hash })
    }
  }

  render() {
    const { model } = this.props
    return <div>
      <Header {...model}/>
      <Monitor {...model}/>
      <Route component={<H1 {...model}/>} hash='#information'/>
      <Route component={<SideBar>afaf</SideBar>} hash='#mijn-metingen'/>
    </div>
  }

}