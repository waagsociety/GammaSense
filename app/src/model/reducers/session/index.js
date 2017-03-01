export default {
  id: null,
  support: {
    canvas: hasCanvasSupport(),
    webRTC: hasWebRTCSupport(),
  },
}

function hasCanvasSupport() {
  return typeof document.createElement('canvas').getContext === 'function'
}

function hasWebRTCSupport() {
  return !!navigator.getUserMedia
}