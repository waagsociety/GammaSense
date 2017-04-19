import React from 'react'
import './index.css'

import { Icon } from '../Icon/'

export const LocationToggle = ({ events, location }) => {
  
  const { requestLocation } = events
  const { support, loading, error } = location
  const disabled = !support || loading

  const className = classNames('LocationToggle icon', loading && 'loading', error && 'error')
  
  return <button className={className} type="button" onClick={requestLocation} disabled={disabled}>
    <Icon name='location'/> Get My Location
  </button>

}

function classNames(...list) {
  return list.filter(isString).join(' ')
}

function isString(value) {
  return typeof value === 'string'
}