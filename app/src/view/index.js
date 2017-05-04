import React from 'react'
import { route } from '../controller'
import { Header, History, Monitor, Information, Map, Modal } from './container/'

const { hash } = route
const errorLog = (dispatch, data) => message => 
  dispatch.log({ error: data.concat(message) })

export default class App extends React.Component {

  componentWillMount() {
    
    const { model } = this.props
    const { state, dispatch } = model
    const { session, config, log } = state
    const { support, navigator } = session
    const { routes } = config

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

    for (const key in navigator) {
      if (navigator[key]) document.body.classList.add(key)
    }

    const dispatchError = errorLog(dispatch, log.error)
    if (!support.webGL) dispatchError({
      title: "De kaart kon niet worden geladen",
      message: "Deze browser ondersteund geen webGL.",
    })

  }

  componentWillReceiveProps({ model }) {

    const { state, dispatch } = model
    const { sensor, location, log } = state
    const dispatchError = errorLog(dispatch, log.error)
    
    if (sensor.error) {
      dispatch.sensor({ measurement: null, error: false })
      dispatchError({
        title: "De meting kon niet worden voltooid",
        message: "Controleer of webcam goed afgedekt wordt met tape.",
        actions: [{ label: 'Ik snap het' }, { label: 'Meer informatie', route: '#informatie' }]
      })
    }

    if (location.error) {
      dispatch.location({ data: null, loading: false, error: null})
      dispatchError({
        title: "Uw locatie kon niet worden bepaald",
        message: "Het is helaas niet mogelijk een meting te doen zonder locatie-gegevens.",
        actions: [{ label: 'Ik snap het' }, { label: 'Meer informatie', route: '#informatie' }]
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