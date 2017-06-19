import React from 'react'
import './index.css'

export const InformationSection = item =>
  <section 
    id={item.path} 
    className='InformationSection'
    dangerouslySetInnerHTML={{ __html: item.html }}
  ></section>

// function Paragraph(content) {
//   return <p key={content}>{content}</p>
// }