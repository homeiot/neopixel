'use strict';

const util = require('util');
const fs = require('fs');
const themes = [];

var itv, ws281x, colorName;

function init(_ws281x) {
  ws281x = _ws281x;
  stop();
}

function setColorWithRgb(r, g, b, count) {
  colorName = {
    r: r,
    g: g,
    b: b
  };
  ws281x.setBrightness(255);
  var pixelData = new Uint32Array(count);
  for (var i = 0; i < count; i++) {
    pixelData[i] = rgb2Int(r, g, b);
  }
  ws281x.render(pixelData);
}

function setColorWithHex(hex, count) {
  var rgb = hexToRGB(hex);
  if (rgb) {
    setColorWithRgb(rgb.r, rgb.g, rgb.b, count);
  }
}

function stop() {
  colorName = {
    r: 0,
    g: 0,
    b: 0
  };
}

function getColorName() {
  return colorName;
}

function hexToRGB(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  console.log('hex to rgb', hex, result);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
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


