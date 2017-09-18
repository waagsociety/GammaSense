---
title: Something went wrong
---

# Measurement
GammaSense uses the camera on your device—augmented with a piece of tape—to measure gamma radiation in your surroundings. An internet connection is required to send data from your measurement. Measurement data is reduced to keep the transfer-size to a minimum. No audio is captured and  images are not stored or sent anywhere.

## Your measurement has failed
Your browser does not appear to support techniques that are required to perform a measurement. These techniques include the recent WebRTC protocol (camera acccess), access to location data, html video (to render the camera data) and canvas (to intrepet the video data).

If your browser is up to date and capable of these techniques, it has likely to do with a lack of permissions that are required for a website to access the camera.

## Your measurement could not be completed
When performing a measurement the GammaSense algorhitm keeps track of inconsistencies in camera 

# Location
GammaSense can rougly read where you are when you do the measurement. This way the measurement can be placed on the map so that it can become valuable in a larger measurement network. Without location data it is not possible to perform the measurement as if now. Your location will not be used for any other means than to provide meta-data to a measurement.

## Your location could not be found
The browser requires an internet connection, and user permissions to use location data. If either of those are not present, a measurement is not possible.

# Map
GammaSense uses MapBox to render data gathered with former measurements accros the globe.

## The map could not be loaded
GammaSense data is rendered on a map using WebGL, a browser technique to efficiently render visualisations in an up to date browser. If you’re sure your browser is up to date there is a possibility that your device lacks the hardware to support WebGL. You should still be able to perform a measurement without any limitations.

