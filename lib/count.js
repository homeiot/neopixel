'use strict';

const util = require('util');
const fs = require('fs');
const path = require('path');

var cfg;
var configFileName = path.join(__dirname, '../config.json');

function init() {
  _loadConfig();
}

function setCount(n) {
  n = parseInt(n, 10);
  if (util.isNumber(n)) {
    cfg.count = n;
    _saveConfig();
    return true;
  } else {
    return false;
  }
}

function getCount() {
  return cfg.count;
}

function _saveConfig() {
  fs.writeFile(configFileName, JSON.stringify(cfg, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + configFileName);
    }
  });
  _loadConfig();
}

function _loadConfig() {
  cfg = JSON.parse(fs.readFileSync(configFileName, 'utf8'));
}

module.exports = {
  init: init,
  setCount: setCount,
  getCount: getCount
};
