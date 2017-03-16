import React from 'react'
import { path } from 'ramda'
import { events } from './events'
import './index.css'

import { Visualise } from '../'
import { SensorToggle } from '../../element/'

const getError = path(['error'])

export const Monitor = ({ state, dispatch, getState }) => {

  const { measurement } = state.sensor
  const error = getError(measurement)
  console.log(error)

  return <section className="Monitor">
    <Visualise measurement={measurement}/>
    <SensorToggle events={events(dispatch, getState)} state={state}/>
  </section>

}