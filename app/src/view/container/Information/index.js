import React from 'react'
import { route } from '../../../controller'
import './index.css'

const { hash } = route

export const Information = ({ state }) => {

  const { config, dialog } = state
  const { routes } = config
  const hidden = !hash.match(routes.information)

  return <section className='Information full primary panel' hidden={hidden}>

    <header>
      <button className='primary' type='button' onClick={hash.push()}>{dialog('action', 'done')}</button>
      <h1>{dialog('information', 'title')}</h1>
    </header>

    <nav className='index'>
    
      <ul>
        <li><a href='#about/what-is-gammasense'>What is GammaSense?</a></li>
        <li><a href='#about/gamma-radiation-explained'>Gamma Radiation Explained</a></li>
        <li><a href='#about/measuring-gamma-radiation'>Measuring Gamma Radiation</a></li>
        <li><a href='#about/faq'>Frequently Asked Questions</a></li>
        <li><a href='#about/support'>Something Went Wrong</a></li>
        <li><a href='#about/devices'>Supported Devices</a></li>
        <li><a href='#about/privacy'>Privacy Statement</a></li>
        <li><a href='#about/colophon'>Colophon</a></li>
      </ul>

      <footer>
        <a className="logo" href="https://waag.org">
          <span>An initiative by</span>
          <img src='/logo.waag-society.jpg' target='_blank' width={320} heigth={135}/>
        </a>
      </footer>

    </nav>

    <article className="content">

      <header>
        <h1>Coming soon...</h1>
      </header>

    </article>

  </section>

}