import React from 'react'
import { route } from '../../../controller'
import { InformationIndex, InformationSection, InformationSupport } from '../'
import './index.css'

const { hash } = route
const sections = [
  {
    slug: 'introduction',
    title: "Introduction",
    paragraphs: [
      "Als je in de buurt van een kerncentrale woont, wil je graag op de hoogte blijven van eventueel verhoogde stralingsniveaus. Op dit moment zijn omwonenden voor deze informatie afhankelijk van instituten en overheden. Informatie over potentiële gevaren laat vaak lang op zich wachten. Wat zouden we in dit kader zelf kunnen doen met al in ons huis aanwezige apparatuur?", 
      "Met een smartphone, laptop of PC met webcam kun je in principe straling goed meten. Het beste werkt dit wanneer de camera wordt afgedekt met een stukje aluminiumfolie, wat weer vastgeplakt wordt met zwart tape. Camera’s en webcams kunnen hierdoor de Gammas-straling vastleggen en deze omzetten in een eenheid per minuut. Hiermee kunnen grote toenames worden vastgelegd en uitgezet op een kaart.", 
      "Momenteel wordt er hard gewerkt aan de ontwikkeling van dit experimentele platform. Waarden die worden gemeten zijn niet absoluut. Er wordt momenteel dan ook gekeken naar de kalibratie en gevoeligheid van verschillende camera's die worden gebruikt. Daarnaast is het goed om te weten dat de meting grote verschillen in kaart probeert te brengen, als een kanarie in de kolenmijn."
    ],
    references: [],
  },
  {
    slug: 'gamma-radiation-explained',
    title: "Gamma Radiation Explained",
  },
  {
    slug: 'measuring-gamma-radiation',
    title: "Measuring Gamma Radiation",
  },
  {
    slug: 'faq',
    title: "Frequently Asked Questions",
  },
  {
    slug: 'help',
    title: "Something Went Wrong",
  },
  {
    slug: 'support',
    title: "Supported Devices",
    component: InformationSupport,
  },
  {
    slug: 'contribute',
    title: "Get Involved",
  },
  {
    slug: 'privacy',
    title: "Privacy",
  },
  {
    slug: 'colophon',
    title: "Colophon",
  },
  {
    slug: 'credits',
    title: "Credits",
  },
]

export const Information = ({ state }) => {

  const { config, dialog } = state
  const { routes } = config
  
  const title = dialog('information', 'title')
  const hidden = !hash.match(routes.information)
  const slug = hash.list(0)
  const path = hash.list(1)

  return <section className='Information full primary panel' hidden={hidden}>

    <header>
      <button className='primary' type='button' onClick={hash.push()}>{dialog('action', 'done')}</button>
      <h1>{title}</h1>
    </header>

    <article className="content">

      <header>

        <h1>Instructions</h1>

      </header>

      <section>

        <h1>GammaSense</h1>

        <p>Measure Gamma Radiation using your laptop or smartphone.</p>

        <aside className="info">
          For now only <a target="_blank" href="https://www.google.com/chrome/">Google Chrome</a> on a computer or Android phone are supported measure gamma&nbsp;radiation.
        </aside>

      </section>

      <section>

        <h1>Prepare Your Camera</h1>

        <p>To get started, cover your (front-facing) camera using opaque black tape. Make sure the entire camera is covered with tape.</p>

        <aside className="info">
          If you have an indicator light near your camera, try to avoid covering it with tape as it may reflect light inwards.
        </aside>

      </section>

      <section>

        <h1>Start a Measurement</h1>

        <p>It takes one minute for a baseline value to be measured. Keep your measurement going for as long as possible once the baseline reading is completed. <s title="Coming soon...">After you’re done you can find the results back under the icon in the top right</s>.
        </p>

      </section>

      <button className="primary" type="button" onClick={hash.push()}>Got it</button>

    </article>
    
    <InformationIndex content={sections} routes={routes}/>

    <article hidden={!path}>
    {sections.map(function(item, index, sections) {
      const Component = item.component || InformationSection
      return <Component
        key={item.slug} 
        item={item} 
        path={path}
        back={{ slug, title }}
        next={sections[index + 1]} 
      />
    })}
    </article>

  </section>

}

// <article className="content">

//   <section>
//     <h1>GammaSense</h1>
//     <p>Measure Gamma Radiation using your laptop or smartphone.</p>
//     <aside className='info'>
//       For now <a target='_blank' href='https://www.google.com/chrome/'>Google Chrome</a> on a computer or Android phone are supported to do a measurement.
//     </aside>
//   </section>

//   <section>
//     <h1>Prepare Your Camera</h1>
//     <p>To get started, cover your (front-facing) camera using opaque black tape. Make sure the entire camera is covered with tape.</p>
//     <aside className='info'>
//       If you have an indicator light near your camera, try to avoid covering it with tape as it may reflect light inwards.
//     </aside>
//   </section>

//   <section>
//     <h1>Start a Measurement</h1>
//     <p>It takes one minute for a baseline value to be measured. Keep your measurement going for as long as possible once the baseline reading is completed. <s title='Coming soon...'>After you’re done you can find the results back under the icon in the top right</s>.</p> 
//   </section>

//   <button className='primary' type='button' onClick={hash.push()}>{dialog('action', 'confirm')}</button>

// </article>
