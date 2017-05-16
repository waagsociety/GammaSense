import React from 'react'
import './index.css'

const ModalButton = ({ event, label }, index) => {
  const className = ['action', index ? 'secondary' : 'primary'].join(' ')
  return <button key={label} className={className} type='button' onClick={event}>{label}</button>
}

export const Modal = ({ state, dispatch }) => {
  
  const { log, dialog } = state
  const { error } = log
  const item = error[0]
  
  if (item) {
    
    const event = route => event => {
      if (route) route()
      dispatch.log({ error: error.slice(1) })
    }
    
    const { route } = item
    const primary = { label: dialog('action', 'confirm'), event: event() }
    const secondary = { label: dialog('action', 'information'), event: event(route) }

    return <section className='Modal' hidden={!error.length}>
      <ModalContent item={item} actions={[primary, secondary]}/>
    </section>


  }
  else return null

}

function ModalContent({ item, actions }) {
  
  const { content } = item
  const { title, message } = content
  const className = ['one', 'two'][(actions || ' ').length - 1]

  return <div>
    <h1>{title}</h1>
    <p>{message}</p>
    <nav className={className}>{actions.map(ModalButton)}</nav>
  </div>

}



