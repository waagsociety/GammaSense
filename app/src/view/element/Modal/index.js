import React from 'react'
// import { map } from 'ramda'
import './index.css'

const Button = ({ event, route, label }) => {

  const childNode = route
    ? <a href={route}>{label}</a> 
    : label

  return <button className='action' type='button' onClick={event}>
    {childNode}
  </button>
      
}

export const Modal = ({ content, primary, secondary }) => {

  const { title, message } = content

  return <section className='Modal'>
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
      <nav className='actions'>
        { secondary ? <Button event={secondary.event} route='#informatie' label={secondary.label} /> : null }
        { primary ? <Button event={primary.event} label={primary.label} /> : null }
      </nav>
    </div>
  </section>

}