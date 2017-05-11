
// routes
const routes = {
  measurement: 'meting',
  information: 'informatie',
  history: 'mijn-metingen',
}

// mapbox
const mapbox = {
  accessToken: 'pk.eyJ1IjoibmF0aGFud2FhZyIsImEiOiJjajFvcjF3c2YwMDIwMzNraGQ0cXp0N3pmIn0.AtMn7ThFay9qJkv_8I85eA',
  style: 'mapbox://styles/nathanwaag/cj1x9uw10000a2sqszy93p4hz',
  center: [0,40],
  zoom: 2,
}

export default {
  mapbox,
  routes,
  sensor: {
    width: 480, 
    height: 320,    
    frameRate: 2,
    facingMode: 'user', 
  },
}