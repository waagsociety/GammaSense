export default {
  id: Date.now(),
  informed: null,
  baseline: null,
  support: {
    canvas: hasCanvasSupport(),
    webRTC: hasWebRTCSupport(),
    webGL: hasWebGLSupport(),
    geolocation: hasGeolocationSupport(),
  },
}

function hasCanvasSupport() {
  return typeof document.createElement('canvas').getContext === 'function'
}

function hasWebRTCSupport() {
  return !!navigator.getUserMedia
}

function hasGeolocationSupport() {
  return !!navigator.geolocation
}

function hasWebGLSupport() { 
  try{
    var canvas = document.createElement( 'canvas' )
    return !!(window.WebGLRenderingContext && (canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' )))
  }
  catch( e ) { 
    return false 
  }
}