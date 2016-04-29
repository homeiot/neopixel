'use strict';

const restify = require('restify');
const ws281x = require('rpi-ws281x-native');

var NUM_LEDS = parseInt(process.argv[2], 10) || 10;
var pixelData = new Uint32Array(NUM_LEDS);

var itv;


function init () {
  var server = restify.createServer();

  server.get('/rainbow', (req, res, next) => {
    res.send('rainbow');

    // ---- animation-loop
    clearInterval(itv);
    ws281x.reset();
    ws281x.init(NUM_LEDS);
    var offset = 0;
    itv = setInterval(function () {
      for (var i = 0; i < NUM_LEDS; i++) {
        pixelData[i] = colorwheel((offset + i) % 256);
      }

      offset = (offset + 1) % 256;
      ws281x.render(pixelData);
    }, 1000 / 30);

  });

  server.get('/stop', (req, res, next) => {
    res.send('stop');
    clearInterval(itv);
    ws281x.reset();
  });

  server.listen(8080);

}

// rainbow-colors, taken from http://goo.gl/Cs3H0v
function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

module.exports = {
  init: init
};
