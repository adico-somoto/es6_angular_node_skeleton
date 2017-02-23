/**
 * Main Server Process
 *
 * Note: All singelton services shared by all requests should be initiated
 * at this scope and injected to the requests as needed
 */

'use strict';

/* eslint-disable no-console */

// import express from 'express';
import Debug from 'debug';
import http from 'http';
import mongoose from 'mongoose';
import promiseMod from 'bluebird';
import config from './config/environment';
import app from './core/app';
import { app as appConfig } from './apps/pdf/config';
import Socket from './apps/pdf/core/socket';

const socketIoDebug = Debug('socketiolab:server');

// console.log('Wakeup');

// Set default node environment to development
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  // Register the Babel require hook
  /* eslint-disable import/no-extraneous-dependencies */
  require('babel-register'); // eslint-disable-line global-require
  /* eslint-enable import/no-extraneous-dependencies */
}

/**
 * Module dependencies.
 */

// console.log('Starting Server ...');

function printUsageToStdout() {
  console.log(`uptime: ${process.uptime()}`);
  console.log(`env:`);
  console.dir(process.env);
  console.log(`cwd: ${process.cwd()}`);
  console.log(`platform: ${process.platform}`);
  console.log(`cpu:`);
  console.dir(process.cpuUsage());
  console.log(`memory:`);
  console.dir(process.memoryUsage());
  console.log(`pid: ${process.pid}`);
  console.log(`versions:`);
  console.dir(process.versions);
}

process.on('uncaughtException', (err) => {
  console.error(`Caught exception: ${err}`);
  console.error(`Caught exception: ${err.stack}`);

  printUsageToStdout();
  process.exitCode = 1;
});

// Connect to MongoDB
mongoose.Promise = promiseMod;
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

// Populate databases with sample data
if (env === 'development' || env === 'test') {
  if (config.seedDB) {
    require('./config/seed'); // eslint-disable-line global-require
  }
}

// Setup server

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const iPort = parseInt(val, 10);

  if (isNaN(iPort)) {
    // named pipe
    return val;
  }

  if (iPort >= 0) {
    // port number
    return iPort;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(config.port || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
Socket.init(server);

// Using port 8090 for websocket
// & port 80 for http
// - its already configured in the NGINX likewise
server.listen(appConfig.socket_port);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe${addr}` : `port ${addr.port}`;
  socketIoDebug(`SocketIo Listening on ${bind}`);
  // console.log('SocketIo Listening on ' + bind + ' ...');
}

server.on('error', onError);
server.on('listening', onListening);

const socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client',
});

require('./config/socketio').default(socketio);
require('./config/express').default(app);
//require('./core/routes').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, () => {
    console.log(`Express server listening on ${config.port}, in ${app.get('env')} mode`);
  });
}

setImmediate(startServer);

/**
 * Listen on provided port, on all network interfaces.
 */

app.listen(port, () => {
  console.log(`HTTP Working on port ${port}`);
});
