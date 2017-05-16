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
  
  const { log, dialog } = state
  const { error } = log
  const item = error[0]
  
  if (item) {
    
    const event = event => dispatch.log({ error: error.slice(1) })
  
    const primary = dialog('action', 'confirm')
    const secondary = dialog('action', 'information')
    const route = item && item.route
    const actions = [{ label: primary }, { label: secondary, route }]

    return <section className='Modal' hidden={!error.length}>
      <ModalContent item={item} actions={actions} event={event}/>
    </section>


  }
  else return null

}

function ModalContent({ item, actions, event }) {
  
  const { content, route } = item
  const { title, message } = content
  const className = ['one', 'two'][(actions || ' ').length - 1]

  return <div>
    <h1>{title}</h1>
    <p>{message}</p>
    <nav className={className}>{actions.map(ModalButton(event, route))}</nav>
  </div>

}



