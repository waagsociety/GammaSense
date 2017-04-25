import React from 'react'
import { route } from '../controller'
import { Header, History, Monitor, Information, Map } from './container/'

const { hash } = route

export default class App extends React.Component {

  componentWillMount() {
    
    const { model } = this.props
    const { state, dispatch } = model
    const { session, config } = state
    const { support } = session
    const { routes } = config

    console.log(session)

    window.onhashchange = function(event) {
      dispatch.route({ hash: location.hash })
    }

    if (state.session.informed) hash.replace()()
    else {
      hash.replace(routes.information)()
      dispatch.session({ informed: true })
    }

    if (support.canvas && support.webRTC && support.geolocation) {
      dispatch.sensor({ support: true })
    }

    // console.log('dialog', model.state.dialog)

  }

  render() {

    const { model } = this.props
    return <div>
      <Header {...model}/>
      <Monitor {...model}/>
      <Map {...model}/>
      <Information {...model}/>
      <History {...model}/>
    </div>

  }

}