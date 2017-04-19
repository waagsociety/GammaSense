import React from 'react'
import { events } from './events'

import { Visualise } from '../'
import { Modal, SensorToggle } from '../../element/'

const errorContent = {
  title: "De meting kon niet worden voltooid",
  message: "Controleer of webcam goed afgedekt wordt met tape.",
}

export const Monitor = ({ state, dispatch, getState }) => {

  const { sensor, config } = state
  const { measurement, error } = sensor
  const { prepare, start, stop, reset } = events(dispatch, getState)
  
  const errorActions = {
    primary: { label: "Ik begrijp het", event: reset, route: '#informatie' },
    secondary: { label: "Bekijk instructies", event: reset },
  }
  
  const feedback = error
    ? <Modal content={errorContent} {...errorActions}/>
    : <Visualise measurement={measurement} config={config}/>

  return <section className="Monitor">
    {feedback}
    <SensorToggle events={{ prepare, start, stop }} state={state}/>
  </section>

}