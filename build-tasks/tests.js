'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import lazypipe from 'lazypipe';
import {Server as KarmaServer} from 'karma';
import {protractor, webdriver_update} from 'gulp-protractor';
import {Instrumenter} from 'isparta';
import gConfig from '../gulp-config';

const plugins = gulpLoadPlugins();
const serverPath = gConfig.paths.server.base;
const distPath = gConfig.paths.dist;

/********************
 * Reusable pipelines
 ********************/

let mocha = lazypipe()
  .pipe(plugins.mocha, {
    reporter: 'spec',
    timeout: 5000,
    require: [
      './mocha.conf'
    ]
  });

let istanbul = lazypipe()
  .pipe(plugins.istanbul.writeReports)
  .pipe(plugins.istanbulEnforcer, {
    thresholds: {
      global: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 80
      }
    },
    coverageDirectory: './coverage',
    rootDirectory : ''
  });

const mochaUnit = () => {
  return gulp.src(paths.server.test.unit)
    .pipe(mocha());
};

const mochaIntegration = () => {
  return gulp.src(paths.server.test.integration)
    .pipe(mocha());
};

const preCoverage = () => {
  return gulp.src(paths.server.scripts)
  // Covering files
    .pipe(plugins.istanbul({
      instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
      includeUntested: true
    }))
    // Force `require` to return covered files
    .pipe(plugins.istanbul.hookRequire());
};

const unitCoverage = () => {
  return gulp.src(paths.server.test.unit)
    .pipe(mocha())
    .pipe(istanbul());
  // Creating the reports after tests ran
};

const integrationCoverage = () => {
  return gulp.src(paths.server.test.integration)
    .pipe(mocha())
    .pipe(istanbul());
  // Creating the reports after tests ran
};

const e2eTest = cb => {
  gulp.src(paths.client.e2e)
    .pipe(protractor({
      configFile: 'protractor.conf.js',
    }))
    .on('error', e => { throw e })
    .on('end', () => { process.exit() });
};

const clientTest = done => {
  new KarmaServer({
    configFile: `${__dirname}/${paths.karma}`,
    singleRun: true
  }, err => {
    done(err);
    process.exit(err);
  }).start();
};

const webDriverUpdate = webdriver_update;

module.exports = {
  mochaUnit: mochaUnit,
  mochaIntegration: mochaIntegration,
  preCoverage: preCoverage,
  unitCoverage: unitCoverage,
  integrationCoverage: integrationCoverage,
  e2eTest: e2eTest,
  clientTest: clientTest,
  webDriverUpdate: webDriverUpdate,

};
