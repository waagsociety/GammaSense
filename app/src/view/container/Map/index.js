import React from 'react'
import './index.css'

import events from './events'
import { Modal, LocationToggle } from '../../element/'

const errorContent = {
  title: "Uw locatie kon niet worden bepaald",
  message: "Oops.",
}

export const Map = ({ state, dispatch }) => {
  
  const { requestLocation, reset } = events(dispatch)
  const { location } = state
  const { error } = location

  const errorActions = {
    primary: { label: "Oké", event: reset },
  }

  return <section className='Map full content' hidden={state.sensor.active}>

    <div id='MapBox'></div>

    { error ? <Modal content={errorContent} {...errorActions}/> : null }

    <LocationToggle events={{ requestLocation }} location={location} />

  </section>

}