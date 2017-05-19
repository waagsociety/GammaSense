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
    title: "Wat is GammaSense?",
    paragraphs: [
      "Als je in de buurt van een kerncentrale woont, wil je graag op de hoogte blijven van eventueel verhoogde stralingsniveaus. Op dit moment zijn omwonenden voor deze informatie afhankelijk van instituten en overheden. Informatie over potentiële gevaren laat vaak lang op zich wachten. Wat zouden we in dit kader zelf kunnen doen met al in ons huis aanwezige apparatuur?", 
      "Met een smartphone, laptop of PC met webcam kun je in principe straling goed meten. Het beste werkt dit wanneer de camera wordt afgedekt met een stukje aluminiumfolie, wat weer vastgeplakt wordt met zwart tape. Camera’s en webcams kunnen hierdoor de Gammas-straling vastleggen en deze omzetten in een eenheid per minuut. Hiermee kunnen grote toenames worden vastgelegd en uitgezet op een kaart.", 
      "Momenteel wordt er hard gewerkt aan de ontwikkeling van dit experimentele platform. Waarden die worden gemeten zijn niet absoluut. Er wordt momenteel dan ook gekeken naar de kalibratie en gevoeligheid van verschillende camera's die worden gebruikt. Daarnaast is het goed om te weten dat de meting grote verschillen in kaart probeert te brengen, als een kanarie in de kolenmijn."
    ],
    references: [],
  },
  {
    path: 'gamma-radiation-explained',
    title: " Wat is Gammastraling?",
    paragraphs: [
      "Gammastraling (γ-straling) is onzichtbare elektromagnetische straling met een hogere energie dan ultraviolet licht en röntgenstraling.",
      "Gammastralen zijn net zoals bijvoorbeeld licht en radiogolven een vorm van elektromagnetische straling. Ze bestaan dus uit trillende elektrische en magnetische velden. Het verschil tussen al deze vormen van elektromagnetische straling zit in de frequentie van deze trillingen, of in de energie of golflengte die gekoppeld zijn aan de frequentie.",
      "De energie van gammastralen is zo groot dat, wanneer ze door een materiaal passeren, chemische bindingen kunnen breken en elektronen uit atomen kunnen losmaken. Men zegt ook wel dat gammastraling ‘ioniserend’ is. Dit kan zowel nuttig als gevaarlijk zijn.",
      "Als het menselijk lichaam wordt blootgesteld aan een te grote hoeveelheid gammastraling, dan zullen er chemische bindingen in de molecules van onze cellen worden afgebroken, waardoor de levende weefsels worden beschadigd. Dit is uiteraard gevaarlijk. Op plaatsen waar gammastraling wordt geproduceerd, bijvoorbeeld in kerncentrales, moeten daarom de nodige beschermingsmaatregelen worden getroffen.",
      "Maar gammastralen kunnen ook micro-organismen zoals bacteriën en schimmels doden. Zo kan een een dokter je bij een botinfectie bestralen met gammastralen om zo de infectie te vernietigen. Gammastraling wordt ook gebruikt om medische hulpmiddelen zoals injectienaalden te desinfecteren. Soms worden ook groenten en fruit bestraald om ongewenste micro-organismen te doden, waardoor deze langer vers blijven."
    ],
  },
  {
    path: 'measuring-gamma-radiation',
    title: "Hoe meet ik Gammastraling?",
    paragraphs: [
      "De klassieke manier van het meten van nucleaire straling is met een zogenaamde Geiger-Muller buis. In deze vacuum buis botsen kleine deeltjes op geioniseerde gasmoleculen. De techniek eromheen bepaald hoe vaak per minuut dat gebeurt. Met een webcam is het ook mogelijk om te tellen hoe vaak per minuut er deeltjes worden gezien die botsen met het lichtgevoelige deel van de camera. In feite wordt dus dezelfde maat bepaald, alleen ligt de gevoeligheid van een webcam een heel stuk lager vergeleken met traditionele meetapparatuur. Dit nadeel is te ondervangen door te zorgen voor veel meer meetpunten, waardoor wetenschappers op basis van deze veelheid van onbetrouwbare data, in het geval van voldoende dichtheid toch met een hogere betrouwbaarheid uitspraken kunnen doen over de werkelijke straling vergeleken met de klassieke situatie van weinig, maar zeer betrouwbare meetpunten."
    ],
  },
  {
    path: 'help',
    title: "Wat betekent locatiebepaling?",
    paragraphs: [
      "Als het goed is kan de applicatie uitlezen waar je de meting doet. Op die manier kan de meting op de kaart worden gezet zodat deze van waarde kan worden in een groter meetnetwerk. Vind je het vervelend om je locatie te delen, dan is het helaas niet mogelijk om de meting goed uit te kunnen voeren."
    ],
  },
  {
    path: 'support',
    title: "Wat is CPM?",
    paragraphs: [
      "CPM is een afkorting die staat voor Counts Per Minute: het aantal deeltjes dat per minuut is waargenomen. CPM is een standaard-maat die dient als input om te bepalen in welke mate iemand wordt blootgesteld aan straling."
    ],
  },
  {
    path: 'contribute',
    title: "Wat betekent de waarde in beeld?",
     paragraphs: ["Binnenkort meer..."],
  },
  {
    path: 'colophon',
    title: "Making Sense & Waag Society",
    paragraphs: [
      "Making Sense is een Europees programma dat via pilots in drie steden (Pristina, Barcelona & Amsterdam) methodes ontwikkelt om burgers te betrekken bij het meten van hun omgeving. In samenwerking met verschillende officiële meetinstituten, ontwerpers, developers en eindgebruikers onderzoekt Making Sense de mogelijkheden voor- en experimenteert in bottom-up citizen science. Kijk voor meer informatie over deze pilots en methodes op www.making-sense.eu",
      "Waag Society, de Nederlands parner binnen Making Sense, is een instituut voor kunst, wetenschap en technologie. Waag Society verkent opkomende technologieën en geeft kunst en cultuur een doorslaggevende rol bij het ontwerpen van betekenisvolle toepassingen. Het gaat daarbij niet alleen meer om internet, maar ook om biotechnologie en cognitieve wetenschappen. www.waag.org",
      "Een belangrijk onderdeel van Waag Society is haar Smart Citizens Lab. In dit lab verkennen we de tools en applicaties waarmee je zelf de wereld om je heen in kaart kunt brengen. Wanneer kun je bijvoorbeeld het best een duik nemen in de grachten, wat is de ‘gezondste’ route naar je werk, en hoe staat het écht met de geluidsoverlast in jouw woonwijk? In de afgelopen jaren zijn diverse open hardware tools beschikbaar gekomen en online data platforms ontwikkeld waarmee burgers de mogelijkheid hebben gekregen om zélf hun omgeving te meten en actie te ondernemen. Door het gezamenlijk meten van de omgeving krijgen mensen meer inzicht in de effecten van hun leefstijl op het ecosysteem en worden ze geïnspireerd tot een duurzamer gedrag. www.waag.org/smartcitizens",
    ],
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

    <header>
      <button className='primary' type='button' onClick={hash.push()}>{dialog('action', 'done')}</button>
      <h1>{title}</h1>
    </header>
    
    <article className='InformationArticle' hidden={!path}>

      <header className='x'>
        <button className='back' type='button' onClick={hash.push(root)}>{title}</button>
        <h1>{item.title}</h1>
      </header>

      <div>{InformationSection(item)}</div>

    </article>

    <InformationIndex content={sections} routes={routes} dialog={dialog}/>

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
