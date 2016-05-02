'use strict';

const util = require('util');
const fs = require('fs');
const themes = [];

themes['rainbow'] = require('./themes/rainbow');

var itv, ws281x, lastThemeName;

function init(_ws281x) {
  ws281x = _ws281x;
  stop();
}

function setTheme(name, count) {
  if (Object.keys(themes).indexOf(name) < 0) {
    return false;
  }
  lastThemeName = name;
  stop();
  ws281x.init(count);
  var pixelData = new Uint32Array(count);
  itv = setInterval(function () {
    pixelData = themes[name].getPixelData(count);
    ws281x.render(pixelData);
  }, 1000 / 30);
}

function stop() {
  clearInterval(itv);
}

function getLastThemeName() {
  return lastThemeName;
}


module.exports = {
  init: init,
  setTheme: setTheme,
  stop: stop,
  getLastThemeName: getLastThemeName
};
