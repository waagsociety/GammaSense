import React from 'react'
import { route } from '../../../controller'
import './index.css'

const { hash } = route

export const Information = ({ state }) => {

  const { routes } = state.config
  const hidden = !hash.match(routes.information)

  return <section className='Information full primary panel' hidden={hidden}>

    <header>
      <h1>Instructies</h1>
    </header>

    <article className="content">

      <section>

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
          <button type='button' onClick={hash.push()}>Ik snap het</button>
        </nav>

      </section>

    </article>

   

  </section>

}