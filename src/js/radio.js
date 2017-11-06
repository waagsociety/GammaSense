var localVideo;
var localCanvas;
var transformFunction;
var filterSelect;
var buffer;
var started = false;
var countdown = 0;
var cpm = 0;
var elapsedMin = 0;
var storageMatrix = ["frameNR,index,R,G,B"];
var videoWidth = 1;
var videoHeight = 1;
var inputCanvasContext;
var outputCanvasContext;

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

      transformFunction = blackwhite;
    //trace("Requested access to local media");
    } catch (e) {
      alert("getUserMedia error " + e);
      //trace_e(e, "getUserMedia error");
    }
  } else {
    alert("Canvas is not suported, app cannot run");
  }
}

var onGotStream = function(stream) {
  localVideo.style.opacity = 1;
  localVideo.srcObject = stream;
  if (localVideo.videoWidth == 0 || localVideo.videoHeight == 0){
      setTimeout(GotValidVideo, 2000);
      return;
  }else{
    GotValidVideo();
  }
}

var GotValidVideo = function() {

  if (localVideo.videoWidth == 0 || localVideo.videoHeight == 0){
      setTimeout(GotValidVideo, 2000);
      return;
  }

  videoWidth = localVideo.videoWidth;
  videoHeight = localVideo.videoHeight;


  filterSelect.onchange = function() {
    localVideo.className = filterSelect.value;
  };

  var canvas = document.createElement('canvas');
  canvas.width  = videoWidth;
  canvas.height = videoHeight;
  inputCanvasContext = canvas.getContext('2d');

  localCanvas.width = videoWidth;
  localCanvas.height = videoHeight;
  localCanvas.className = filterSelect.value;

  outputCanvasContext = localCanvas.getContext('2d', {alpha: false});
  outputCanvasContext.lineWidth = 2;
  outputCanvasContext.lineJoin = "round";

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

var poll = function() {

  inputCanvasContext.drawImage(localVideo, 0, 0, videoWidth, videoHeight);

  var inImageData = inputCanvasContext.getImageData(0, 0, videoWidth, videoHeight);

  outputCanvasContext.clearRect (0, 0, videoWidth,videoHeight);
  var outImageData = outputCanvasContext.getImageData(0, 0, videoWidth,videoHeight);

  if ( ! started ){
    buffer = outImageData.data;
    started = true;
  }

  transformFunction(inImageData.data,outImageData);

  /* draw detected area */

  outputCanvasContext.putImageData(outImageData, 0, 0);

  countdown = countdown + 1;

  storeRawData(countdown,inImageData.data);

  var secPoll = document.getElementById("secondsin").value;

  if (countdown > (60 / secPoll) ){
    elapsedMin = elapsedMin + 1;
    document.getElementById("nrpixelsec").innerHTML = cpm + " / " + (inImageData.data.length/4);
    document.getElementById("elapsedmin").innerHTML = elapsedMin;

    saveCVS();

    cpm = 0;
    countdown = 0;
    storageMatrix = ["frameNR,index,R,G,B"];
  }


  setTimeout(poll, secPoll * 1000);
};


// save non-zero values to matrix
var storeRawData = function (frameNr, pixels){

  for (var i = 0; i < pixels.length; i += 4) {
    if( pixels[i] > 0 ||
        pixels[i+1] > 0 ||
        pixels[i+2] > 0
    ){
      storageMatrix.push("\n" + frameNr + "," + i + "," + pixels[i] + "," + pixels[i+1] + "," + pixels[i+2]);
    }
  }
};

// Save matrix to disk
var saveCVS = function(){

  var blob = new Blob([storageMatrix], {type: "text/csv;charset=utf-8"});
  saveAs(blob, "frameData" + new Date().toISOString() + ".csv");

};

// Possible averaging functions for thresholding
var lumaRGB = function(R,G,B) {
  return R * 0.2126 + G * 0.7152 + B * 0.0722;
};

var meanRGB = function(R,G,B) {
  return (R + G + B) / 3;
};

// transform values to greyscale
var grayscale = function(inPixels,outImageData) {

  for (var i = 0; i < inPixels.length; i += 4) {
    var avg = lumaRGB(inPixels[i], inPixels[i + 1], inPixels[i + 2]);
    outImageData.data[i]     = avg; // red
    outImageData.data[i + 1] = avg; // green
    outImageData.data[i + 2] = avg; // blue
    outImageData.data[i + 3] = inPixels[i + 3]; // alpha
  }
};

// transform values to black or white with threshold
var blackwhite = function(inPixels,outImageData) {

   var threshold = document.getElementById("thresholdin").value;
   var counter = 0;

  for (var i = 0; i < inPixels.length; i += 4) {
      var avg = lumaRGB(inPixels[i], inPixels[i + 1], inPixels[i + 2]);
      if( avg > threshold){
        counter = counter + 1;
        cpm = cpm + 1;
        outImageData.data[i]     = 255; // red
        outImageData.data[i + 1] = 255; // green
        outImageData.data[i + 2] = 255; // blue
      }else{
        outImageData.data[i]     = buffer[i]; // red
        outImageData.data[i + 1] = buffer[i + 1]; // green
        outImageData.data[i + 2] = buffer[i + 2]; // blue
      }

      outImageData.data[i + 3] = Math.max(inPixels[i + 3],buffer[i]); // alpha

      buffer[i] = outImageData.data[i];
      buffer[i + 1] = outImageData.data[i + 1];
      buffer[i + 2] = outImageData.data[i + 2];
      buffer[i + 3] = outImageData.data[i + 3];
      // outImageData.data[i + 3] = 255; // alpha
    }
    document.getElementById("nrpixel").innerHTML = counter + " / " + (inPixels.length/4);
};


// setTimeout(initialize, 5);
