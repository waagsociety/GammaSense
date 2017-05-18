import React from 'react'
import { clamp } from 'ramda'
import { route } from '../../../controller'
import { InformationIndex, InformationSection } from '../'
import './index.css'


const { hash } = route
const clampIndex = clamp(0, Infinity)
const sections = [
  {
    path: 'introduction',
    title: "Introduction",
    paragraphs: [
      "Als je in de buurt van een kerncentrale woont, wil je graag op de hoogte blijven van eventueel verhoogde stralingsniveaus. Op dit moment zijn omwonenden voor deze informatie afhankelijk van instituten en overheden. Informatie over potentiële gevaren laat vaak lang op zich wachten. Wat zouden we in dit kader zelf kunnen doen met al in ons huis aanwezige apparatuur?", 
      "Met een smartphone, laptop of PC met webcam kun je in principe straling goed meten. Het beste werkt dit wanneer de camera wordt afgedekt met een stukje aluminiumfolie, wat weer vastgeplakt wordt met zwart tape. Camera’s en webcams kunnen hierdoor de Gammas-straling vastleggen en deze omzetten in een eenheid per minuut. Hiermee kunnen grote toenames worden vastgelegd en uitgezet op een kaart.", 
      "Momenteel wordt er hard gewerkt aan de ontwikkeling van dit experimentele platform. Waarden die worden gemeten zijn niet absoluut. Er wordt momenteel dan ook gekeken naar de kalibratie en gevoeligheid van verschillende camera's die worden gebruikt. Daarnaast is het goed om te weten dat de meting grote verschillen in kaart probeert te brengen, als een kanarie in de kolenmijn."
    ],
    references: [],
  },
  {
    path: 'gamma-radiation-explained',
    title: "Gamma Radiation Explained",
    paragraphs: [
      "Gammastraling (γ-straling) is onzichtbare elektromagnetische straling met een hogere energie dan ultraviolet licht en röntgenstraling.",
      "Gammastralen zijn net zoals bijvoorbeeld licht en radiogolven een vorm van elektromagnetische straling. Ze bestaan dus uit trillende elektrische en magnetische velden. Het verschil tussen al deze vormen van elektromagnetische straling zit in de frequentie van deze trillingen, of in de energie of golflengte die gekoppeld zijn aan de frequentie.",
      "De energie van gammastralen is zo groot dat, wanneer ze door een materiaal passeren, chemische bindingen kunnen breken en elektronen uit atomen kunnen losmaken. Men zegt ook wel dat gammastraling ‘ioniserend’ is. Dit kan zowel nuttig als gevaarlijk zijn.",
      "Als het menselijk lichaam wordt blootgesteld aan een te grote hoeveelheid gammastraling, dan zullen er chemische bindingen in de molecules van onze cellen worden afgebroken, waardoor de levende weefsels worden beschadigd. Dit is uiteraard gevaarlijk. Op plaatsen waar gammastraling wordt geproduceerd, bijvoorbeeld in kerncentrales, moeten daarom de nodige beschermingsmaatregelen worden getroffen.",
      "Maar gammastralen kunnen ook micro-organismen zoals bacteriën en schimmels doden. Zo kan een een dokter je bij een botinfectie bestralen met gammastralen om zo de infectie te vernietigen. Gammastraling wordt ook gebruikt om medische hulpmiddelen zoals injectienaalden te desinfecteren. Soms worden ook groenten en fruit bestraald om ongewenste micro-organismen te doden, waardoor deze langer vers blijven."
    ]
  },
  {
    path: 'measuring-gamma-radiation',
    title: "Measuring Gamma Radiation",
  },
  // {
  //   path: 'faq',
  //   title: "Frequently Asked Questions",
  // },
  {
    path: 'help',
    title: "Something Went Wrong",
  },
  {
    path: 'support',
    title: "Supported Devices",
  },
  {
    path: 'contribute',
    title: "Get Involved",
  },
  {
    path: 'privacy',
    title: "Privacy",
  },
  {
    path: 'colophon',
    title: "Colophon",
  },
  {
    path: 'credits',
    title: "Credits",
  },
]

export const Information = ({ state }) => {

  const { config, dialog } = state
  const { routes } = config
  
  const title = dialog('information', 'title')
  const hidden = !hash.match(routes.information)

  const root = hash.list(0)
  const path = hash.list(1)
  const index = clampIndex(sections.findIndex(item => item.path === path))
  const item = sections[index]

  return <section className='Information' hidden={hidden}>

    <header className='x'>
      <button className='primary' type='button' onClick={hash.push()}>{dialog('action', 'done')}</button>
      <h1>{title}</h1>
    </header>
    
    <article className='InformationArticle' hidden={!path}>

      <header className='x'>
        <button type='button' onClick={hash.push(root)}>{title}</button>
        <h1>{item.title}</h1>
      </header>
      
      {InformationSection(item)}

    </article>

    <InformationIndex content={sections} routes={routes}/>

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
