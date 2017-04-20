import React from 'react'

export function HistoryList({ data }) {

  return <ul>
  {
    data.map(item => <li key={item.initialized}>
      <h1>{item.initialized}</h1>
      <ul>
        <li>Gemiddelde: {item.summary.mean.toFixed(2)}%</li>
        <li>Piek: {item.summary.max.toFixed(2)}%</li>
        <li>Nulmeting: {item.baseline.toFixed(2)}%</li>
      </ul>
    </li>)
  }
  </ul>

}