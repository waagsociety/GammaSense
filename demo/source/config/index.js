const meta = {
  name: "Making Sense"
}

const sensor = {
  samples: {
    low: 50,
    medium: 1000,
    high: 1000,
  },
  interval: 250,
  treshold: 0,
}

const video = {
  audio: false,
  video: {
    mandatory: {
      maxWidth: 640,
      maxHeight: 480,
    },
  },
}

export const config = {
  meta,
  sensor,
  video,
}