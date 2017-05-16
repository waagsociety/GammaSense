import React from 'react'
import { route } from '../controller'
import { Header, History, Monitor, Information, Map, Modal } from './container/'

const { hash } = route

export default class App extends React.Component {

  componentWillMount() {
    
    const { model } = this.props
    const { state, dispatch } = model
    const { session, config, log, dialog } = state
    const { support, navigator } = session
    const { routes } = config

    window.onhashchange = function(event) {
      dispatch.route({ hash: location.hash })
    }

    if (state.session.informed) hash.replace()
    else {
      hash.replace(routes.information)
      dispatch.session({ informed: true })
    }

    for (const key in navigator) {
      if (navigator[key]) document.body.classList.add(key)
    }

    const dispatchError = errorLog(dispatch, log.error)
    if (!support.webGL) dispatchError({
      content: dialog('map', 'error', 'webGL'), 
      route: '#information/browser-support',
    })

  }

  componentWillReceiveProps({ model }) {

    const { state, dispatch } = model
    const { sensor, location, log, dialog } = state
    const dispatchError = errorLog(dispatch, log.error)
        
    if (sensor.error) {
      dispatch.sensor({ measurement: null, error: null })
      dispatchError({
        content: dialog('sensor', 'error', 'support'), 
        route: '#information/browser-support',
      })
    }

    if (location.error) {
      dispatch.location({ data: null, loading: false, error: null})
      dispatchError({
        content: dialog('location', 'error', 'unknown'), 
        route: '#information/location-data',
      })
    }
    
  }

  render() {
    const { model } = this.props
    return <div>
      <Header {...model}/>
      <Monitor {...model}/>
      <Map {...model}/>
      <Modal {...model}/>
      <Information {...model}/>
      <History {...model}/>
    </div>
  }

}

function errorLog(dispatch, data) {
  return item => dispatch.log({ error: data.concat(item) })
} 