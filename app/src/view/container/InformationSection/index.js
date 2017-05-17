import React from 'react'
import './index.css'

export const InformationSection = ({ item, path, next }) =>
  <section id={item.path} className='InformationArticle' hidden={path !== item.slug}>

    <h1>{item.title}</h1>
    {(item.paragraphs || ["Nothing here"]).map(Paragraph)}

  </section>

function Paragraph(content) {
  return <p key={content}>{content}</p>
}