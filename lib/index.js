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

var isRunning = false;

function init () {
  var server = restify.createServer();

  count.init();
  ws281x.init(count.getCount());
  theme.init(ws281x);

  server.get('/', (req, res, next) => {
    console.log('get', '/');
    res.send({
      name: pkg.name,
      version: pkg.version,
      theme: theme.getThemeName(),
      count: count.getCount(),
      isRunning: isRunning
    });
  });

  server.get('/theme', (req, res, next) => {
    console.log('get', '/theme');
    res.send({
      theme: theme.getThemeName()
    });
  });

  server.put('/theme/:name', (req, res, next) => {
    console.log('put', '/theme/:name', req.params.name);
    if(theme.setTheme(req.params.name, count.getCount())) {
      isRunning = 'theme';
      res.status(200);
    } else {
      res.status(400);
    }
  });

  server.put('/count/:num', (req, res, next) => {
    console.log('put', '/count/:num', req.params.num);
    if (count.setCount(req.params.num)) {
      ws281x.reset();
      ws281x.init(count.getCount());
      if (isRunning === 'theme') {
        setTimeout(function () {
          console.log('theme.getThemeName(), count.getCount())', theme.getThemeName(), count.getCount());
          theme.setTheme(theme.getThemeName(), count.getCount());
        }, 10);
      }
      res.status(200);
    } else {
      res.status(400);
    }
  });

  server.put('/stop', (req, res, next) => {
    console.log('put', '/stop');
    res.status(200);
    stop();
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
