import React from 'react'
import { route } from '../../../controller'
import './index.css'

const { hash } = route

export const Tutorial = ({ state }) => {
  
  const { dialog, config } = state
  const { routes } = config
  const hidden = !hash.match(routes.instructions)
  
  return <article className='Tutorial content' hidden={hidden}>

    <section>
      <h1>Gammastraling meten</h1>
      <p>Meet Gammastraling met de camera van je computer of telefoon.</p>
      <aside className='info'>
        Momenteel wordt alleen <a target='_blank' href='https://www.google.com/chrome/'>Google Chrome</a> op een computer ondersteund om een meting te doen.
      </aside>
    </section>

    <section>
      <h1>Plak je camera af</h1>
      <p>Dek de camera aan de voorkant van je apparaat volledig af met zwarte tape dat licht blokkeert.</p>
    </section>

    <section>
      <h1>Doe een meting</h1>
      <p>Het duurt één minuut om een nulmeting te doen, dit wordt gebruikt om de verdere meting correct te interpreteren. Na een meting te hebben voltooid is deze (binnenkort) terug te vinden in het menu rechtsboven.</p> 
    </section>

    <button className='primary' type='button' onClick={hash.push()}>{dialog('action', 'confirm')}</button>

  </article>
}
