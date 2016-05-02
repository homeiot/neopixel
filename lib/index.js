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
    //ws281x.reset();
  });

  server.get('/status', (req, res, next) => {
    console.log('get', '/status');
    res.send({
      theme: theme.getLastThemeName(),
      isRunning: true
    })
  });

  server.get('/version', (req, res, next) => {
    console.log('get', '/version');
    res.send({
      version: pkg.version
    });
  });

  server.listen(8080);
}



module.exports = {
  init: init
};
