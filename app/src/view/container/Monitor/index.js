import React from 'react'
import { path } from 'ramda'

import dialog from '../../../dialog'
import { events } from './events'

import { Visualise } from '../'
import { Modal, SensorToggle } from '../../element/'

const getErrorContent = path(['monitor', 'error'])

export const Monitor = ({ state, dispatch, getState }) => {

  const { measurement, error } = state.sensor
  const { start, stop, reset } = events(dispatch, getState)
  
  const actions = [
    { label: "Leest instructies", event: reset, route: '#informatie' },
    { label: "Probeer opnieuw", event: reset },
  ]
  
  const feedback = error
    ? <Modal content={getErrorContent(dialog)} actions={actions}/> 
    : <Visualise measurement={measurement}/>

  return <section className="Monitor">
    {feedback}
    <SensorToggle events={{ start, stop }} state={state}/>
  </section>

}