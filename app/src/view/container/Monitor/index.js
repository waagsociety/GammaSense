import React from 'react'
import { path } from 'ramda'
import { events } from './events'

import { Visualise } from '../'
import { Modal, SensorToggle } from '../../element/'

const getErrorContent = path(['measure', 'error'])

export const Monitor = ({ state, dispatch, getState }) => {

  const { sensor, dialog } = state
  const { measurement, error } = sensor
  const { start, stop, reset } = events(dispatch, getState)
  
  const actions = {
    primary: { event: reset, route: '#informatie' },
    secondary: { event: reset },
  }
  
  const feedback = error
    ? <Modal content={getErrorContent(dialog)} actions={actions}/> 
    : <Visualise measurement={measurement}/>

  return <section className="Monitor">
    {feedback}
    <SensorToggle events={{ start, stop }} state={state}/>
  </section>

}