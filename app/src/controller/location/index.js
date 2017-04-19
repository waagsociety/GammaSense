export function location() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(console.log)
  } else {
    console.log("Geolocation is not supported by this browser.")
  }
}