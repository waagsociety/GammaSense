import React from 'react'
import './index.css'

export const Information = ({ state }) => {

  return <section className='Information full primary panel'>

    <header>
      <h1>Informatie</h1>
    </header>

    <article>

      <ol>
        <li>Dek je camera volledig af met tape dat licht blokkeert,</li>
        <li>klik “Start Meting” om te beginnen,</li>
        <li>wacht minimaal 1 minuut om een volledige meting te verrichten.</li>
      </ol>

    </article>

    <nav>
      <button><a href='./#'>Ik begrijp het</a></button>
    </nav>

  </section>

}