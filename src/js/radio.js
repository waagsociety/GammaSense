var localVideo;
var localCanvas;
var transformFunction;
var filterSelect;

// ConstrainLong      width;
// ConstrainLong      height;
// ConstrainDouble    aspectRatio;
// ConstrainDouble    frameRate;
// ConstrainDOMString facingMode;
// ConstrainDouble    volume;
// ConstrainLong      sampleRate;
// ConstrainLong      sampleSize;
// ConstrainBoolean   echoCancellation;
// ConstrainDouble    latency;
// ConstrainLong      channelCount;
// ConstrainDOMString deviceId;
// ConstrainDOMString groupId;

var qvgaConstraints = {
  audio: false,
  video: {width: {exact: 320}, height: {exact: 240}}
};

var vgaConstraints = {
  audio: false,
  video: {width: {exact: 640}, height: {exact: 480}}
};

var hdConstraints = {
  audio: false,
  video: {width: {exact: 1280}, height: {exact: 720}}
};

var fullHdConstraints = {
  audio: false,
  video: {width: {exact: 1920}, height: {exact: 1080}}
};

var minVGAConstraints = {
  audio: false,
  video: {
    mandatory: {
      maxWidth: 640,
      maxHeight: 480
    }
  }
};

var minHDConstraints = {
  audio: false,
  video: {
    mandatory: {
      minWidth: 1280,
      minHeight: 720,
      minFrameRate: 30
    },
    optional: [
      {
        minFrameRate: 60
      }
    ]
  }
};


var constraints = {
  audio: false,
  video: true
};

var initialize = function() {
  localVideo = document.getElementById("localVideo");
  localCanvas = document.getElementById("localCanvas");
  filterSelect = document.querySelector('select#filter');

  if (localCanvas.getContext) {
    try {
      navigator.getUserMedia(minVGAConstraints, onGotStream, onFailedStream);
      var blackwhitebtn = document.getElementById('blackwhitebtn');
      blackwhitebtn.addEventListener('click', blackwhiteHandler);
      var grayscalebtn = document.getElementById('grayscalebtn');
      grayscalebtn.addEventListener('click', grayscaleHandler);

      // transformFunction = poll;
      transformFunction = grayscale;
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

  var secPoll = document.getElementById("secondsin").value;

  var canvas = document.createElement('canvas');
  canvas.width  = w;
  canvas.height = h;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(localVideo, 0, 0, w, h);

  var inImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var inPixels = inImageData.data;

  localCanvas.width = w;
  localCanvas.height = h;
  localCanvas.className = filterSelect.value;

  var ctx2 = localCanvas.getContext('2d');
  ctx2.lineWidth = 2;
  ctx2.lineJoin = "round";
  ctx2.clearRect (0, 0, localCanvas.width,localCanvas.height);
  var outImageData = ctx2.getImageData(0, 0, localCanvas.width,localCanvas.height);

  transformFunction(inImageData,outImageData);

  /* draw detected area */

  ctx2.putImageData(outImageData, 0, 0);

  setTimeout(poll, secPoll * 1000);
};

var grayscale = function(inImageData,outImageData) {
   var inPixels = inImageData.data;


    for (var i = 0; i < inPixels.length; i += 4) {
      var avg = lumAvrg(inPixels[i], inPixels[i + 1], inPixels[i + 2]);
      outImageData.data[i]     = avg; // red
      outImageData.data[i + 1] = avg; // green
      outImageData.data[i + 2] = avg; // blue
      outImageData.data[i + 3] = inPixels[i + 3]; // alpha
    }
};

var lumAvrg = function(R,G,B) {
  return R * 0.2126 + G * 0.7152 + B * 0.0722;
};

var blackwhite = function(inImageData,outImageData) {
   var inPixels = inImageData.data;
   var threshold = document.getElementById("thresholdin").value;
   var counter = 0;

  for (var i = 0; i < inPixels.length; i += 4) {
      var avg = lumAvrg(inPixels[i], inPixels[i + 1], inPixels[i + 2]);
      if( avg > threshold){
        avg = 255;
        counter = counter + 1;
      }else{
        avg = 0;
      }
      outImageData.data[i]     = avg; // red
      outImageData.data[i + 1] = avg; // green
      outImageData.data[i + 2] = avg; // blue
      outImageData.data[i + 3] = inPixels[i + 3]; // alpha
      // outImageData.data[i + 3] = 255; // alpha
    }
    document.getElementById("nrpixel").innerHTML = counter + " / " + (inPixels.length/4);
};

var onGotStream = function(stream) {
  localVideo.style.opacity = 1;
  localVideo.srcObject = stream;

  filterSelect.onchange = function() {
    localVideo.className = filterSelect.value;
  };


  // localStream = stream;

  //trace("User has granted access to local media. url = " + url);
  setTimeout(poll, 1000);
};

var onFailedStream = function(error) {
  alert("Failed to get access to local media. Error code was " + error.code + ".");
  //trace_warning("Failed to get access to local media. Error code was " + error.code);
};

var blackwhiteHandler = function() {
  transformFunction = blackwhite;
  // alert("transform is: " + transformFunction.toString());
};

var grayscaleHandler = function() {
  transformFunction = grayscale;
  // alert("transform is: " + transformFunction.toString());
};


// setTimeout(initialize, 5);
