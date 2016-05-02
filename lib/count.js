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
  fs.writeFileSync(configFileName, JSON.stringify(cfg, null, 2));
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
