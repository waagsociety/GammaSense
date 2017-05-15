import React from 'react'
import './index.css'

export function HistoryList({ data, dialog }) {

  return <ul className='HistoryList'>
  {
    data.map(item => <li key={item.initialized} className='item'>
      <h1>{new Date(item.initialized).toLocaleString()}</h1>
      <ul>
        <li>{dialog('cpm', 'mediam')}: {item.summary.mean.toFixed(2)}%</li>
        <li>{dialog('cpm', 'peak')}: {item.summary.max.toFixed(2)}%</li>
        <li>{dialog('cpm', 'baseline')}: {item.baseline.toFixed(2)}%</li>
      </ul>
    </li>)
  }
  </ul>

}