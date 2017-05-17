import React from 'react'
import { route } from '../../../controller'
const { hash } = route

export const InformationIndex = ({ content, routes }) =>
  <nav className='content index'>
  
    <ul>{content.map(ListItem(routes.information))}</ul>

    <footer>
      <a className="logo" href="https://waag.org" target='_blank'>
        <span>An initiative by</span>
        <img src='/logo.waag-society.jpg' width={320} height={135} role='presentation'/>
      </a>
    </footer>

  </nav>

function ListItem(root) {
  const active = hash.list(1)
  return ({ title, slug }) => <li key={slug}>
    <a className={active === slug ? 'active' : ''} href={hash.join(root, slug)}>{title}</a>
  </li>
}