import React from 'react'
import './index.css'

const ModalButton = event => ({ route, label }, index) => {
  const className = ['action', index ? 'secondary' : 'primary'].join(' ')
  return route
    ? <a key={label}  className={className} href={route} onClick={event}>
        <button type='button'>{label}</button>
      </a>
    : <button key={label} className={className} type='button' onClick={event}>{label}</button>
}

export const Modal = ({ state, dispatch }) => {
  
  const { log } = state
  const { error } = log
  const event = event => dispatch.log({ error: error.slice(1) })

  return <section className='Modal' hidden={!error.length}>
    { error.length
      ? <ModalContent content={error[0]} event={event}/>
      : null
    }
  </section>

}

function ModalContent({ content, event }) {
  
  const { title, message, actions } = content
  const className = ['one', 'two'][(actions || ' ').length - 1]

  return <div>
    <h1>{title || 'Oops'}</h1>
    <p>{message || 'Er is iets misgegaan'}</p>
    <nav className={className}>{(actions || [{ label: 'OK' }]).map(ModalButton(event))}</nav>
  </div>

}



