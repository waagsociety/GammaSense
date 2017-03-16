import React from 'react'
import { map } from 'ramda'
import './index.css'

const mapActions = map(function({ label, event, route }) {
  
  const childNode = route 
    ? <a href={route}>{label}</a> 
    : label

  return <button key={label} className='action' type='button' onClick={event}>
    {childNode}
  </button>
      
})

export const Modal = ({ content, actions }) => {

  const { title, message } = content

  return <section className='Modal'>
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
      <nav className='actions'>{mapActions(actions)}</nav>
    </div>
  </section>

}