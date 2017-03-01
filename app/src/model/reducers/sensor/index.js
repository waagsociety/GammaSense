const initial = {
  active: false,
  history: [],
}

export function sensor(state = initial, { type, data }) {
  
  const update = type === 'sensor'
    ? Object.assign({}, state, data)
    : state

  return update

}

export default {
  active: false,
  history: [],
}