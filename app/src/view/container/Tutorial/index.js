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

      <header>
        <h1>{dialog('instructions', 'title')}</h1>
      </header>

      <ol>
        <li>Dek je camera volledig af met tape dat licht blokkeert.</li>
        <li>Klik “Start Meting” om te beginnen.</li>
        <li>Wacht minimaal 2 minuten om een volledige meting te verrichten.</li>
      </ol>

      <aside className='info'>
        Momenteel kan een meting alleen gedaan worden 
        in <a target='_blank' href='https://www.google.com/chrome/'>Google Chrome</a>.
      </aside>

      <nav>
        <button className='primary' type='button' onClick={hash.push()}>{dialog('action', 'confirm')}</button>
      </nav>

    </section>

  </article>
}
