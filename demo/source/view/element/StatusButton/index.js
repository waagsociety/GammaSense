import { toggleStatus } from './events'
import { filterClassName } from './actions'

export const StatusButton = status => {
  
  const className = filterClassName('StatusButton', !status && 'prominent')
  const textContent = ["Start Meting", "Annuleer", "Stop Meting"]

  return ['button', { className, type: 'button', onclick: toggleStatus(status) }, 
    textContent[status]
  ]

}

