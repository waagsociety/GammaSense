import React from 'react'
import { route } from '../../../controller'
import './index.css'

const { hash } = route

export const InformationIndex = ({ content, dialog, routes }) =>
  <nav className='InformationIndex content'>

    <ul>{content.map(ListItem(routes.information))}</ul>

    <footer>
      <button className='primary' type='button' onClick={hash.push(routes.instructions)}>
        {dialog('instructions', 'title')}
      </button>
    </footer>

  </nav>

function ListItem(root) {
  const active = hash.list(1)
  return ({ title, path }) => <li key={path}>
    <a className={active === path ? 'active' : ''} href={hash.join(root, path)}>{title}</a>
  </li>
}
