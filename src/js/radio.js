var localVideo;
var localCanvas;

var initialize = function() {
  localVideo = document.getElementById("localVideo");
  localCanvas = document.getElementById("localCanvas");
  if (localCanvas.getContext) {
    try {
      navigator.getUserMedia({video:true}, onGotStream, onFailedStream);
    //trace("Requested access to local media");
    } catch (e) {
      alert("getUserMedia error " + e);
      //trace_e(e, "getUserMedia error");
    }
  } else {
    alert("Canvas is not suported, app cannot run");
  }
}

var poll = function() {
  var w = localVideo.videoWidth;
  var h = localVideo.videoHeight;

  var canvas = document.createElement('canvas');
  canvas.width  = w;
  canvas.height = h;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(localVideo, 0, 0, w, h);

  var inImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var inPixels = inImageData.data;

  localCanvas.width = localVideo.clientWidth;
  localCanvas.height = localVideo.clientHeight;

  var ctx2 = localCanvas.getContext('2d');
  ctx2.lineWidth = 2;
  ctx2.lineJoin = "round";
  ctx2.clearRect (0, 0, localCanvas.width,localCanvas.height);
  var outImageData = ctx2.getImageData(0, 0, localCanvas.width,localCanvas.height);
  grayscale(inImageData,outImageData);

  /* draw detected area */

  ctx2.putImageData(outImageData, 0, 0);

  setTimeout(poll, 1000);
}

var grayscale = function(inImageData,outImageData) {
   var inPixels = inImageData.data;


    for (var i = 0; i < inPixels.length; i += 4) {
      var avg = (inPixels[i] + inPixels[i + 1] + inPixels[i + 2]) / 3;
      outImageData.data[i]     = avg; // red
      outImageData.data[i + 1] = avg; // green
      outImageData.data[i + 2] = avg; // blue
      outImageData.data[i + 3] = inPixels[i + 3]; // blue
    }
};

var onGotStream = function(stream) {
  localVideo.style.opacity = 1;
  localVideo.srcObject = stream;
  // localStream = stream;

  //trace("User has granted access to local media. url = " + url);
  setTimeout(poll, 2000);
}

var onFailedStream = function(error) {
  alert("Failed to get access to local media. Error code was " + error.code + ".");
  //trace_warning("Failed to get access to local media. Error code was " + error.code);
}

// setTimeout(initialize, 5);
