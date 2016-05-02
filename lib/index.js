'use strict';

const restify = require('restify');
const ws281x = require('rpi-ws281x-native');
const count = require('./count');
const color = require('./color');
const theme = require('./theme');
const pkg = require('../package.json');

process.on('SIGINT', function () {
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
});

var isRunning = false;

function init () {
  var server = restify.createServer();

  count.init();
  ws281x.init(count.getCount());
  color.init(ws281x);
  theme.init(ws281x);

  server.get('/', (req, res, next) => {
    console.log('get', '/');
    res.send({
      name: pkg.name,
      version: pkg.version,
      theme: theme.getThemeName(),
      count: count.getCount(),
      color: color.getColorName(),
      isRunning: isRunning
    });
    next(false);
  });

  server.put('/theme/:name', (req, res, next) => {
    console.log('put', '/theme/:name', req.params.name);
    if (isRunning) {
      stop();
    }
    if(theme.setTheme(req.params.name, count.getCount())) {
      isRunning = 'theme';
      res.status(200);
    } else {
      res.status(400);
    }
    next(false);
  });

  server.put('/count/:num', (req, res, next) => {
    console.log('put', '/count/:num', req.params.num);
    if (count.setCount(req.params.num)) {
      ws281x.reset();
      ws281x.init(count.getCount());
      if (isRunning === 'theme') {
        theme.setTheme(theme.getThemeName(), count.getCount());
      } else if (isRunning === 'color') {
        var rgb = color.getColorName();
        color.setColorWithRgb(rgb.r, rgb.g, rgb.b, count.getCount());
      }
      res.status(200);
    } else {
      res.status(400);
    }
    next(false);
  });

  server.put('/color/:red/:green/:blue', (req, res, next) => {
    console.log('put', '/color/:red/:green/:blue', req.params);
    if (isRunning) {
      stop();
    }
    isRunning = 'color';
    color.setColorWithRgb(req.params.red, req.params.green, req.params.blue, count.getCount());
    next(false);
  });

  server.put('/color/:hex', (req, res, next) => {
    console.log('put', '/color/:hex', req.params.hex);
    if (isRunning) {
      stop();
    }
    isRunning = 'color';
    color.setColorWithHex(req.params.hex, count.getCount());
    next(false);
  });

  server.put('/stop', (req, res, next) => {
    console.log('put', '/stop');
    stop();
    res.status(200);
    next(false);
  });

  server.listen(8080);
  console.log('server is already started at port %s', 8080);
}

function stop() {
  if (isRunning === 'theme') {
    theme.stop();
  }
  ws281x.reset();
  ws281x.init(count.getCount());
  isRunning = false;
}

module.exports = {
  init: init
};
