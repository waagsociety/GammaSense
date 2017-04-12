import { dialogue } from './controller'

export default dialogue.create({
  en_GB: {
    measure: {
      start: "Start Measurement",
      stop: "Stop Measurement",
      cancel: "Cancel Measurement",
      error: {
        title: "Your measurement could not be completed",
        message: "Check if the webcam has been properly sealed with tape.",
        primary: "Try Again",
        secondary: "View Instructions",
      },
    },

  },
  nl_NL: {
    measure: {
      start: "Start Meting",
      stop: "Stop Meting",
      cancel: "Anulleer Meting",
      error: {
        title: "De meting kon niet worden voltooid",
        message: "Controleer of webcam goed afgedekt wordt met tape.",
        primary: "Probeer opnieuw",
        secondary: "Bekijk instructies",
      },
    },
  },
  de_DE: {
    measure: {
      start: "Start Measurement",
      stop: "Stop Measurement",
      cancel: "Cancel Measurement",
      error: {
        title: "De meting kon niet worden voltooid",
        message: "Controleer of webcam goed afgedekt wordt met tape.",
      },
    },
  },
})(navigator.language || 'en_GB')
