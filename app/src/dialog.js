import { dialogue } from './controller'

export default dialogue.create({

  en: 'en_GB',
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
          message: "Check whether the camera is completely sealed with black tape.",
        },
        location: {
          title: "Your location could not be found",
          message: "Your location is required to start a measurement.",
        },
        support: {
          title: "Your measurement has failed",
          message: "Browser support [Error message]",
        },
      },
    },
    introduction: {
      title: "How to Get Started",
    },
    information: {
      title: "About",
    },
    history: {
      title: "My measurements",
      empty: "Nothing here...",
    },
    map: {
      error: {
        webGL: {
          title: "The map could not be loaded",
          message: "Your browser lacks support for webGL which is required to render the map.",
        },
      },
    },
    location: {
      request: "Get My Location",
      error: {
        permissions: {

        },
        unknown: {
          title: "Your location could not be found",
          message: "[Error message]",
        },
      }
    },
    action: {
      done: "Done",
      confirm: "Got it",
      information: "More information",
    },
  },

  nl: 'nl_NL',
  nl_NL: {
    measurement: {
      title: "Meting",
      start: "Start Meting",
      stop: "Stop Meting",
      cancel: "Anulleer Meting",
      initializing: "Meting voorbereiden...",
      median: "Mediaan",
      baseline: "Nulmeting",
      peak: "Piek",
      cpm: "CPM",
      error: {
        seal: {
          title: "De meting kon niet worden voltooid",
          message: "Controleer of de camera volledig wordt afgedekt met zwarte tape.",
        },
        location: {
          title: "Uw locatie kon niet worden bepaald",
          message: "Het is niet mogelijk een meting te doen zonder locatie-gegevens.",
        },
        support: {
          title: "Deze browser is ongeschikt om een meting doen",
          message: "Browser-ondersteuning [Foutmelding]",
        },
      },
    },
    introduction: {
      title: "Aan de slag",
    },
    information: {
      title: "Informatie",
    },
    history: {
      title: "Mijn metingen",
      empty: "Er zijn geen metingen gevonden...",
    },
    map: {
      error: {
        webGL: {
          title: "De kaart kon niet worden geladen",
          message: "Deze browser ondersteunt geen webGL, dit is vereist is om de kaart weer te geven.",
        },
      },
    },
    location: {
      request: "Get My Location",
      error: {
        unknown: {
          title: "Uw locatie kon niet worden bepaald",
          message: "Locatie [Foutmelding]",
        },
      }
    },
    action: {
      done: "Klaar",
      confirm: "Ik snap het",
      information: "Meer informatie",
    },
  },

})(navigator.language, 'en_GB')
