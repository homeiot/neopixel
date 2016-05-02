'use strict';

const restify = require('restify');
const ws281x = require('rpi-ws281x-native');
const count = require('./count');
const theme = require('./theme');
const pkg = require('../package.json');

process.on('SIGINT', function () {
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
});

function init () {
  var server = restify.createServer();

  count.init();
  theme.init(ws281x);

  server.get('/', (req, res, next) => {
    console.log('get', '/');
    res.send({
      name: neopixel,
      version: pkg.version,
      theme: theme.getLastThemeName(),
      isRunning: true
    });
  });

  server.get('/theme', (req, res, next) => {
    console.log('get', '/theme');
    res.send({
      theme: theme.getLastThemeName()
    });
  });

  server.put('/theme/:name', (req, res, next) => {
    console.log('put', '/theme/:name', req.params.name);
    if(theme.setTheme(req.params.name, count.getCount())) {
      res.status(200);
    } else {
      res.status(400);
    }
  });

  server.get('/count', (req, res, next) => {
    console.log('get', '/count');
    res.send({
      count: count.getCount()
    });
  });

  server.put('/count/:num', (req, res, next) => {
    console.log('put', '/count/:num', req.params.num);
    count.setCount(req.params.num);
    res.status(200);
  });

  server.put('/stop', (req, res, next) => {
    console.log('put', '/stop');
    res.status(200);
    theme.stop();
  });

  server.listen(8080);
}

module.exports = {
  init: init
};
