import React from 'react'
import './index.css'

export const Icon = ({ name }) => {
  const __html = `<use xlink:href="#icon:${name}"/>`
  return <svg className='Icon' viewBox='0 0 32 32' dangerouslySetInnerHTML={{ __html }}></svg>
}
