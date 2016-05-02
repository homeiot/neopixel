'use strict';

const restify = require('restify');
const ws281x = require('rpi-ws281x-native');
const count = require('./count');
const theme = require('./theme');
const pkg = require('../package.json');

function init () {
  var server = restify.createServer();

  count.init();
  theme.init(ws281x);

  server.get('/theme', (req, res, next) => {
    res.send({
      theme: theme.getLastThemeName()
    });
  });

  server.put('/theme/:name', (req, res, next) => {
    theme.setTheme(req.params.name, count.getCount());
    res.status(200);
  });

  server.get('/count', (req, res, next) => {
    res.send({
      count: count.getCount()
    });
  });

  server.put('/count/:num', (req, res, next) => {
    count.setCount(req.params.num);
    res.status(200);
  });

  server.put('/stop', (req, res, next) => {
    res.status(200);
    theme.stop();
    ws281x.reset();
  });

  server.get('/status', (req, res, next) => {
    res.send({
      theme: theme.getLastThemeName(),
      isRunning: true
    })
  });

  server.get('/version', (req, res, next) => {
    version: pkg.version
  });

  server.listen(8080);

}



module.exports = {
  init: init
};
