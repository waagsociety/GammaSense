import { StatusButton } from '../../element'

export const Controls = ({ state, model }) => {
  const { status } = state.sensor
  return ['nav', { className: 'controls' },
    StatusButton(status),
  ]
}
