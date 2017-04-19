import React from 'react'
import { Header, History, Monitor, Information, Map } from './container/'
import { location } from '../controller/'

export default class App extends React.Component {

  componentDidMount() {
    
    const { model } = this.props
    const { routes } = model.state.config

    if (!model.state.session.informed) {
      location.href = routes.information
      model.dispatch.session({ informed: true })
    }

    console.log('dialog', model.state.dialog)

    window.onhashchange = function(event) {
      model.dispatch.route({ hash: location.hash })
    }

  }

  render() {

    const { model } = this.props
    // const { routes } = model.state.config

    return <div>
      <Header {...model}/>
      <Monitor {...model}/>
      <Map {...model}/>
      <Information {...model}/>
      <History {...model}/>
    </div>

  }

}