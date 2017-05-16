import React from 'react'
import { route } from '../../../controller'
import './index.css'

const { hash } = route

export const Information = ({ state }) => {

  const { config, dialog } = state
  const { routes } = config
  const hidden = !hash.match(routes.information)

  console.log(hash.match(routes.information, 'what-is-gammasense'))

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
        <li><a href='#about/help'>Something Went Wrong</a></li>
        <li><a href='#about/support'>Supported Devices</a></li>
        <li><a href='#about/privacy'>Privacy Statement</a></li>
        <li><a href='#about/colophon'>Colophon</a></li>
      </ul>

      <footer>
        <a className="logo" href="https://waag.org">
          <span>An initiative by</span>
          <img src='/logo.waag-society.jpg' target='_blank' width={320} height={135} role='presentation'/>
        </a>
      </footer>

    </nav>

    <article className="content">

      <section>
        <h1>GammaSense</h1>
        <p>Measure Gamma Radiation using your laptop or smartphone.</p>
        <aside className='info'>
          <img src='./chrome-logo.png' width='32' height='32' role='presentation'/>
          For now <a target='_blank' href='https://www.google.com/chrome/'>Google Chrome</a> on a computer or Android phone are supported to do a measurement.
        </aside>
      </section>

      <section>
        <h1>Prepare Your Camera</h1>
        <p>To get started, cover your (front-facing) camera using opaque black tape. Make sure the entire camera is covered with tape.</p>
        <aside className='info'>
          If you have an indicator light near your camera, try to avoid covering it with tape as it may reflect light inwards.
        </aside>
      </section>

      <section>
        <h1>Start a Measurement</h1>
        <p>It takes one minute for a baseline value to be measured. Keep your measurement going for as long as possible once the baseline reading is completed. <s title='Coming soon...'>After you’re done you can find the results back under the icon in the top right</s>.</p> 
      </section>

      <button className='primary' type='button' onClick={hash.push()}>{dialog('action', 'confirm')}</button>

    </article>

  </section>

}