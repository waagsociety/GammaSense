import React from 'react'
import './index.css'

export function BaselineProgress({ percentage }) {
  return <div className='BaselineProgress'>
    <h1>Even geduld a.u.b.</h1>
    <h2>{Math.round(percentage)}%</h2>
    <svg className='progress' viewBox='0 0 128 128'>
      <circle cx='64' cy='64' r='56'/>
    </svg>
  </div>
}