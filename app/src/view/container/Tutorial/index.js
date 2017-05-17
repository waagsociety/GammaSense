import React from 'react'
import { route } from '../../../controller'
import './index.css'

const { hash } = route

export const Tutorial = ({ state }) => {

  const { config, dialog } = state
  const { routes } = config
  const hidden = !hash.match(routes.introduction)

  return <section className='Tutorial full primary panel' hidden={hidden}>

    <article className="content">

      <section>

        <header>
          <h1>{dialog('introduction', 'title')}</h1>
        </header>

        <ol>
          <li>Dek je camera volledig af met tape dat licht blokkeert.</li>
          <li>Klik “Start Meting” om te beginnen.</li>
          <li>Wacht minimaal 2 minuten om een volledige meting te verrichten.</li>
        </ol>

        <aside className='info'>
          <img src='./chrome-logo.png' width='32' height='32' role='presentation'/>
          Momenteel kan een meting alleen gedaan worden 
          in <a target='_blank' href='https://www.google.com/chrome/'>Google Chrome</a>.
        </aside>

        <nav>
          <button className='primary' type='button' onClick={hash.push()}>{dialog('action', 'confirm')}</button>
        </nav>

      </section>

    </article>

   

  </section>

}