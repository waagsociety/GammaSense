import React from 'react'
import './index.css'

export const InformationSection = ({ path, paragraphs }) =>
  <section id={path} className='InformationSection'>

    {(paragraphs || ["Nothing here"]).map(Paragraph)}

  </section>

function Paragraph(content) {
  return <p key={content}>{content}</p>
}