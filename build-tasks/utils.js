'use strict';

import del from 'del';
import http from 'http';
import gConfig from '../gulp-config';

const distPath = gConfig.paths.dist;

/********************
 * Helper functions
 ********************/
function checkAppReady(cb) {
  const port = gConfig.pluginOpts.browserSync.port;
  var options = {
    host: 'localhost',
    port: port
  };
  http
    .get(options, () => cb(true))
    .on('error', () => cb(false));
}

// Call page until first success
function whenServerReady(cb) {
  var serverReady = false;
  var appReadyInterval = setInterval(() =>
      checkAppReady((ready) => {
        if (!ready || serverReady) {
          return;
        }
        clearInterval(appReadyInterval);
        serverReady = true;
        cb();
      }),
    100);
}

const cleanTemp = () => del(['.tmp/**/*'], {dot: true});

const cleanDist = () => del([`${distPath}/!(.git*|.openshift|Procfile)**`], {dot: true});

const startClient = cb => {
  whenServerReady(() => {
    open('http://localhost:' + config.browserSyncPort);
    cb();
  });
};

module.exports = {
  cleanTemp: cleanTemp,
  cleanDist: cleanDist,
  startClient: startClient,

};
