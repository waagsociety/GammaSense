import React from 'react'
import './index.css'

export const Information = ({ state }) => {

  const { routes } = state.config
  const hidden = routes.information !== location.hash

  return <section className='Information full primary panel' hidden={hidden}>

    <header>
      <h1>Instructies</h1>
    </header>

    <article>

      <section>

        <ol>
          <li>Dek je camera volledig af met tape dat licht blokkeert,</li>
          <li>klik “Start Meting” om te beginnen,</li>
          <li>wacht minimaal 1 minuut om een volledige meting te verrichten.</li>
        </ol> 

        <nav>
          <button><a href={routes.home}>Ik begrijp het</a></button>
        </nav>

      </section>

    </article>

   

  </section>

}