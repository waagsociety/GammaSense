(function () {
'use strict';

var meta = {
  name: "Making Sense"
};

var sensor = {
  samples: {
    low: 50,
    medium: 1000,
    high: 1000
  },
  interval: 250,
  treshold: 0
};

var video = {
  audio: false,
  video: {
    mandatory: {
      maxWidth: 640,
      maxHeight: 480
    }
  }
};

var config = {
  meta: meta,
  sensor: sensor,
  video: video
};

function merge(object, extension) {
  for (var key in extension) {
    object[key] = extension[key];
  }return object;
}

function createElement(type) {
  return document.createElement(type);
}

function drawImage(context, source) {
  context.drawImage(source, 0, 0);
  return context;
}

function getImageData(context, _ref) {
  var width = _ref.width,
      height = _ref.height;

  return context.getImageData(0, 0, width, height);
}

function getContext(dimension) {
  return function (canvas) {
    return canvas.getContext(dimension);
  };
}

var getContext2d = getContext('2d');

function createImageData(dimensions) {

  var canvas = merge(createElement('canvas'), dimensions);
  var context = getContext2d(canvas);
  return function (source) {
    return getImageData(drawImage(context, source), dimensions);
  };
}

function putImageData(canvas, imageData) {
  var context = getContext2d(canvas);
  context.putImageData(imageData, 0, 0);
  return context;
}

function cycle(interval) {

  return function (callback) {

    return function (video) {

      var initialised = callback(video) !== false;
      var trigger = initialised && start(iteration);

      function start(callback) {
        return setInterval(iteration, interval);
      }

      function iteration() {
        if (initialised === false || callback(video) === false) {
          video.srcObject.getVideoTracks().forEach(function (track) {
            return track.stop();
          });
          video.src = '';
          clearInterval(trigger);
        }
        initialised = true;
      }

      return null;
    };
  };
}

function luma(r, g, b) {
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

function analyse(imageData, filter) {

  var data = imageData.data;
  var length = data.length;
  var index = 0;

  var sample = {
    time: Date.now(),
    resolution: length / 4,
    gamma: 0
  };

  while (index < length) {

    var r = index++;
    var g = index++;
    var b = index++;
    var a = index++;

    var lumincance = luma(data[r], data[g], data[b]);
    var hasGammaRadiation = lumincance > 0;

    var filtered = filter(lumincance);
    data[r] = filtered[0];
    data[g] = filtered[1];
    data[b] = filtered[2];
    data[a] = filtered[3];

    sample.gamma += hasGammaRadiation;
  }

  return { imageData: imageData, sample: sample };
}

function monitor$1(process, filter) {

  return function (video) {

    var getImageData = createImageData({
      width: video.videoWidth,
      height: video.videoHeight
    });

    var imageData = getImageData(video);
    var data = analyse(imageData, filter);
    return process(data);
  };
}

function filter(treshold, method) {

  method = method || initial;

  return function (lumincance) {
    return lumincance >= treshold ? method(normalise(lumincance, treshold)) : [0, 0, 0, 255];
  };

  function normalise(lumincance, treshold) {
    var baseline = lumincance - treshold;
    var multiplier = 255 / (255 - treshold);
    return 0 | baseline * multiplier;
  }

  function initial(gamma) {
    return [255, 255, 255, 255];
  }
}

function sensor$1(interval, setup) {

  var video = createElement('video');
  var iterate = cycle(interval);

  return function (callback, filter) {

    var process = monitor$1(callback, filter);

    navigator.mediaDevices.getUserMedia(setup).then(function (stream) {
      video.srcObject = stream;
      video.onloadedmetadata = function (event) {
        return iterate(process)(video);
      };
    }).catch(console.warn);
  };
}

var measuring = false;
function monitor(circle) {

  var canvas = document.querySelector('#display');
  // const minute = 60 * 1000
  var length = circle.getTotalLength();

  var start = Date.now();
  circle.style.strokeDasharray = length;
  circle.style.strokeDashoffset = 0;

  var storage = [];
  var count = 0;
  var total = 0;

  return function (_ref) {
    var sample = _ref.sample,
        imageData = _ref.imageData;


    var duration = Date.now() - start;

    if (duration >= 60000) {
      console.log('reset', storage);
      storage.push({ start: start, count: count, total: total, gamma: total / count });
      start = Date.now();
      total = 0;
      count = 0;
    } else {
      circle.style.strokeDashoffset = -(duration / 1000 * (length / 30));
      total += sample.gamma;
      ++count;
    }

    var width = imageData.width,
        height = imageData.height;

    canvas.width = width;
    canvas.height = height;
    putImageData(canvas, imageData);

    return measuring;
  };
}

function radioactive(gamma) {
  var offset = 0 | gamma * 0.75;
  return [128 - offset, 255, 192 - offset, 255];
}

!function (element) {

  var start = element.querySelector('#measure-start');
  var stop = element.querySelector('#measure-stop');
  var countdown = element.querySelector('#countdown');

  var measure = sensor$1(250, config.video);

  start.addEventListener('click', function (event) {
    element.classList.toggle('is-active');
    measure(monitor(countdown), filter(2, radioactive));
    measuring = true;
  });

  stop.addEventListener('click', function (event) {
    element.classList.toggle('is-active');
    measuring = false;
  });
}(document.querySelector('#monitor'));

}());
