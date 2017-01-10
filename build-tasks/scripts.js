'use strict';

import _ from 'lodash';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import lazypipe from 'lazypipe';
import gConfig from '../gulp-config';

const plugins = gulpLoadPlugins();
const paths = gConfig.paths;
const distPath = paths.dist;
const clientPath = paths.client.base;
const clientScripts = paths.client.scripts;
const clientTestScripts = paths.client.test;
const serverPath = paths.server.base;
const serverScripts = paths.server.scripts;
const serverTestScripts = paths.server.test;

/********************
 * Reusable pipelines
 ********************/

const lintClientScripts = lazypipe()
  .pipe(plugins.eslint, `${clientPath}/.eslintrc`)
  .pipe(plugins.eslint.format);

const lintClientTestScripts = lazypipe()
  .pipe(plugins.eslint, {
    configFile: `${clientPath}/.eslintrc`,
    envs: [
      'browser',
      'es6',
      'mocha'
    ]
  })
  .pipe(plugins.eslint.format);

/* Exported Functions */

const lintClient = () => {
  return gulp.src(_.union(
    clientScripts,
    _.map(clientTestScripts, blob => '!' + blob)
  ))
    .pipe(lintClientScripts());
};

const lintClientTest = () => {
  return gulp.src(clientTestScripts)
    .pipe(lintClientScripts());
};

const jscs = () => {
  return gulp.src(_.union(paths.client.scripts, paths.server.scripts))
    .pipe(plugins.jscs())
    .pipe(plugins.jscs.reporter());
};

module.exports = {
  lintClient: lintClient,
  lintClientTest: lintClientTest,
  jscs: jscs,

};
