export const toggleStatus = status => ({ model }) => {
  model.sensor.status(!status ? 1 : null)
}
