import React from 'react'
import { clamp } from 'ramda'
import { route } from '../../../controller'
import { InformationIndex, InformationSection } from '../'
import './index.css'

const { hash } = route
const clampIndex = clamp(0, Infinity)

export const Information = ({ state }) => {

  const { config, dialog, content } = state
  const { routes } = config
  const sections = content('en')
  
  const title = dialog('information', 'title')
  const hidden = !hash.match(routes.information)

  const root = hash.list(0)
  const path = hash.list(1)
  const index = clampIndex(sections.findIndex(item => item.hash === path))
  const item = sections[index]

  return <section className='Information' hidden={hidden}>

    <header>
      <button className='primary' type='button' onClick={hash.push()}>{dialog('action', 'done')}</button>
      <h1>{title}</h1>
    </header>
    
    <article className='InformationArticle' hidden={!path}>

      <header className='x'>
        <button className='back' type='button' onClick={hash.push(root)}>{title}</button>
        <h1>{item.metadata.title}</h1>
      </header>

      <div>{InformationSection(item)}</div>

    </article>

    <InformationIndex content={sections} routes={routes} dialog={dialog}/>

  </section>

}
