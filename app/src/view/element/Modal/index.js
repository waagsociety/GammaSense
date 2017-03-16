import React from 'react'
import { unapply, pipe, join, reject, isNil } from 'ramda'
import './index.css'

const compactToString = pipe(reject(isNil), join(' '))
const createClassName = unapply(compactToString)

export const Modal = ({ title, message, kind }) => {
  const className = createClassName('Modal', kind)
  return <div className={className}>
    <h1>{title}</h1>
    <p>{message}</p>
  </div>
}