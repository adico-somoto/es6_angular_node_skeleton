'use strict';

import _ from 'lodash';
import nodemon from 'nodemon';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import lazypipe from 'lazypipe';
import gConfig from '../gulp-config';

const plugins = gulpLoadPlugins();
const paths = gConfig.paths;
const serverPath = gConfig.paths.server.base;
const distPath = gConfig.paths.dist;
const serverScripts = paths.server.scripts;
const serverTestScripts = paths.server.test;

/********************
 * Helper functions
 ********************/

const onServerLog = (log) => {
  console.log(plugins.util.colors.white('[') +
    plugins.util.colors.yellow('nodemon') +
    plugins.util.colors.white('] ') +
    log.message);
};

const lintServerScripts = lazypipe()
  .pipe(plugins.eslint, `${serverPath}/.eslintrc`)
  .pipe(plugins.eslint.format);

const lintServerTestScripts = lazypipe()
  .pipe(plugins.eslint, {
    configFile: `${serverPath}/.eslintrc`,
    envs: [
      'node',
      'es6',
      'mocha'
    ]
  })
  .pipe(plugins.eslint.format);

const transpileServerExec = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel, {
    plugins: [
      'transform-class-properties',
      'transform-runtime'
    ]
  })
  .pipe(plugins.sourcemaps.write, '.');


const startServer = () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  const config = require(`../${serverPath}/config/environment`);
  nodemon(`-w ${serverPath} ${serverPath}`)
    .on('log', onServerLog);
};

const startServerProd = () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  const config = require(`../${distPath}/${serverPath}/config/environment`);
  nodemon(`-w ${distPath}/${serverPath} ${distPath}/${serverPath}`)
    .on('log', onServerLog);
};

const startInspector = () => {
  gulp.src([])
    .pipe(plugins.nodeInspector({
      debugPort: 5858
    }));
};

const startServerDebug = () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`../${serverPath}/config/environment`);
  nodemon(`-w ${serverPath} --debug=5858 --debug-brk ${serverPath}`)
    .on('log', onServerLog);
};

const lintServer = () => {
  return gulp.src(_.union(serverScripts, _.map(serverTestScripts, blob => '!' + blob)))
    .pipe(lintServerScripts());
};

const lintServerTest = () => {
  return gulp.src(serverTestScripts)
    .pipe(lintServerTestScripts());
};

const transpileServer = () => {
  return gulp.src(_.union(paths.server.scripts, paths.server.json, paths.server.dataJson))
    .pipe(transpileServerExec())
    .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
};

const watch = () => {
  var testFiles = _.union(paths.client.test, paths.server.test.unit, paths.server.test.integration);

  plugins.watch(_.union(paths.server.scripts, testFiles))
    .pipe(plugins.plumber())
    .pipe(lintServerScripts());

  plugins.watch(_.union(paths.server.test.unit, paths.server.test.integration))
    .pipe(plugins.plumber())
    .pipe(lintServerTestScripts());
};

module.exports = {
  startServer: startServer,
  startServerProd: startServerProd,
  startInspector: startInspector,
  startServerDebug: startServerDebug,
  lintServer: lintServer,
  lintServerTest: lintServerTest,
  transpileServer: transpileServer,
  watch: watch,

};
