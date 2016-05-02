'use strict';

const util = require('util');
const fs = require('fs');
const themes = [];

themes['rainbow'] = require('./themes/rainbow');

var itv, ws281x, themeName = '';

function init(_ws281x) {
  ws281x = _ws281x;
  stop();
}

function setTheme(name, count) {
  if (Object.keys(themes).indexOf(name) < 0) {
    return false;
  }
  stop();
  themeName = name;
  ws281x.setBrightness(255);
  var offset = 0;
  itv = setInterval(function () {
    var pixelData = themes[name].getPixelData(count, offset);
    offset = (offset + 1) % 256;
    ws281x.render(pixelData);
  }, 1000 / 30);
  return true;
}

function stop() {
  themeName = '';
  clearInterval(itv);
}

function parse() {
  clearInterval(itv);
}

function getThemeName() {
  return themeName;
}


module.exports = {
  init: init,
  setTheme: setTheme,
  stop: stop,
  parse: parse,
  getThemeName: getThemeName
};
