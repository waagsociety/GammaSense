import React from 'react'
import './index.css'

import { Icon } from '../Icon/'

export const LocationToggle = ({ events, location, dialog }) => {
  
  const { requestLocation } = events
  const { support, loading, ready } = location
  const disabled = !ready || !support || loading

  const className = classNames('LocationToggle icon', loading && 'loading')
  
  return <button className={className} type="button" onClick={requestLocation} disabled={disabled}>
    <Icon name='location'/> {dialog('location', 'request')}
  </button>

}

function classNames(...list) {
  return list.filter(isString).join(' ')
}

function isString(value) {
  return typeof value === 'string'
}