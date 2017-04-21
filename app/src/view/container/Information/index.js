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

    <article>

      <section>

        <ol>
          <li>Dek je camera volledig af met tape dat licht blokkeert.</li>
          <li>Klik “Start Meting” om te beginnen.</li>
          <li>Wacht minimaal 2 minuten om een volledige meting te verrichten.</li>
        </ol> 

        <nav>
          <button type='button' onClick={hash.push()}>Ik begrijp het</button>
        </nav>

      </section>

    </article>

   

  </section>

}