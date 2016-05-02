'use strict';

const util = require('util');
const fs = require('fs');
const themes = [];

var itv, ws281x, colorName = '';

function init(_ws281x) {
  ws281x = _ws281x;
  stop();
}

function setColorWithRgb(r, g, b, count) {
  colorName = [r, g, b];
  ws281x.setBrightness(255);
  var pixelData = new Uint32Array(count);
  for (var i = 0; i < count; i++) {
    pixelData[i] = rgb2Int(r, g, b);
  }
  ws281x.render(pixelData);
}

function setColorWithHex(hex, count) {
  var rgb = hexToRGB(hex);
  setColorWithRgb(rgb[0], rgb[1], rgb[2], count);
}

function stop() {
  colorName = '';
}

function getColorName() {
  return colorName;
}

function hexToRGB(hex) {
  var r = hex >> 16;
  var g = hex >> 8 & 0xFF;
  var b = hex & 0xFF;
  return [r, g, b];
}

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

module.exports = {
  init: init,
  setColorWithRgb: setColorWithRgb,
  setColorWithHex: setColorWithHex,
  getColorName: getColorName
};


