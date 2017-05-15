import { dialogue } from './controller'

export default dialogue.create({

  en_GB: {
    measurement: {
      title: "Measurement",
      start: "Start Measurement",
      stop: "Stop Measurement",
      cancel: "Cancel Measurement",
      initializing: "One moment please...",
      median: "Median",
      baseline: "Baseline",
      peak: "Peak",
      cpm: "CPM",
      error: {
        seal: {
          title: "Your measurement could not be completed",
          message: "Controleer of webcam volledig wordt afgedekt met tape.",
        },
        location: {
          title: "Your location could not be found",
          message: "Your location is required to perform a measurement",
        },
      },
    },
    information: {
      title: "About",
    },
    history: {
      title: "My measurements",
      empty: "Nothing here...",
    },
    map: {
      center: "Get My Location",
    },
    action: {
      done: "Done",
      confirm: "Got it",
      discover: "More information",
    },
  },

  nl_NL: {
    sensor: {
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
    sensor: {
      start: "Start Measurement",
      stop: "Stop Measurement",
      cancel: "Cancel Measurement",
      error: {
        title: "De meting kon niet worden voltooid",
        message: "Controleer of webcam goed afgedekt wordt met tape.",
      },
    },
  },

})(navigator.language, 'en_GB')
