import React from 'react'
// import { map } from 'ramda'
import './index.css'

const Button = ({ event, route, label }) => {

  const childNode = route
    ? <a href={route}>{label}</a> 
    : label

    console.log(route, label)

  return <button className='action' type='button' onClick={event}>
    {childNode}
  </button>
      
}

export const Modal = ({ content, actions }) => {

  const { title, message } = content
  const { primary, secondary } = actions

  return <section className='Modal'>
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
      <nav className='actions'>
        { secondary ? <Button event={secondary.event} route='#informatie' label={content.secondary} /> : null }
        { primary ? <Button event={primary.event} label={content.primary} /> : null }
      </nav>
    </div>
  </section>

}