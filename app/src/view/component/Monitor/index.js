import React from 'react'
import './index.css'

const on = dispatch => event => {
  dispatch.session({ id: Date.now() })
}

export const Monitor = ({ state, dispatch }) =>
  <section className="Monitor">
    <h1 onClick={on(dispatch)}>Model test: {state.session.id}</h1>
    <canvas></canvas>
  </section>