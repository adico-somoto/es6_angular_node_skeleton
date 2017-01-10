// Generated on 2016-12-31 using generator-angular-fullstack 4.1.1
'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import fs  from 'fs';
import path from 'path';
import merge from 'merge-stream';
import server from './build-tasks/server';
import scripts from './build-tasks/scripts';
import style from './build-tasks/style';
import utilis from './build-tasks/utils';
import tests from './build-tasks/tests';
import packag from './build-tasks/package';
import deploy from './build-tasks/deploy';
import gConfig from './gulp-config';

const plugins = gulpLoadPlugins();
const serverPath = gConfig.paths.server.base;
const clientPath = gConfig.paths.client.base;
const distPath = gConfig.paths.dist;
const clientDistPath = `${gConfig.paths.dist}/${clientPath}`;
const clientImagePath = gConfig.paths.client.images;
const clientAssetsPath = gConfig.paths.client.assets;
const buildPath = gConfig.paths.build;
const appsPath = `${clientPath}/apps`;

/********************
 * Entry Points
 ********************/
gulp.task('build', ['run:build']);

gulp.task('serve', ['run:serve']);
gulp.task('serve:debug', ['run:serve:debug']);
gulp.task('serve:dist', ['run:serve:dist']);

gulp.task('test', ['run:test']);
gulp.task('test:server:coverage', ['run:test:server:coverage']);
gulp.task('test:e2e', ['run:test:e2e']);

/********************
 * Build / Package
 ********************/

gulp.task('run:build', cb => {
  runSequence(
    [
      'clean:dist',
      'clean:tmp'
    ],
    'inject',
    'transpile:server',
    [
      'build:images'
    ],
    [
      'copy:extras',
      'copy:assets',
      'copy:fonts:dist',
      'copy:server',
      'webpack:dist'
    ],
    'revReplaceWebpack',
    cb);
});

gulp.task('clean:tmp', utilis.cleanTemp);

gulp.task('clean:dist', utilis.cleanDist);

gulp.task('build:images', packag.buildImages);

gulp.task('revReplaceWebpack', packag.revReplaceWebpack);

gulp.task('copy:extras', packag.copyExtras);

gulp.task('copy:fonts:dev', packag.copyFontsDev);
gulp.task('copy:fonts:dist', packag.copyFontsDist);

gulp.task('copy:assets', packag.copyAssets);

gulp.task('copy:server', packag.copyServer);

/********************
 * Env
 ********************/

gulp.task('env:all', () => {
    let localConfig;
    try {
        localConfig = require(`./${serverPath}/config/local.env`);
    } catch (e) {
        localConfig = {};
    }
    plugins.env({
        vars: localConfig
    });
});
gulp.task('env:test', () => {
    plugins.env({
        vars: {NODE_ENV: 'test'}
    });
});
gulp.task('env:prod', () => {
    plugins.env({
        vars: {NODE_ENV: 'production'}
    });
});

/********************
 * Tasks
 ********************/

/********************
 * Style
 ********************/

gulp.task('inject', cb => {
    runSequence(['inject:scss'], cb);
});

gulp.task('inject:scss', style.injectScss);

gulp.task('styles', style.procStyle);

/********************
 * Package
 ********************/

gulp.task('webpack:dev', packag.webpackDev);

gulp.task('webpack:dist', packag.webpackDist);

gulp.task('webpack:test', packag.webpackTest);

gulp.task('webpack:e2e', packag.webpackE2e);

/********************
 * Script Files
 ********************/

gulp.task('transpile:server', server.transpileServer);

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));

gulp.task('lint:scripts:client', scripts.lintClient);

gulp.task('lint:scripts:server', server.lintServer);

gulp.task('lint:scripts:clientTest', scripts.lintClientTest);

gulp.task('lint:scripts:serverTest', server.lintServerTest);

gulp.task('jscs', scripts.jscs);

/********************
 * Run Client / Browser
 ********************/

gulp.task('start:client', utilis.startClient);

/********************
 * Run Server / Serve
 ********************/

gulp.task('start:server', server.startServer);

gulp.task('start:server:prod', server.startServerProd);

gulp.task('start:inspector', server.startInspector);

gulp.task('start:server:debug', server.startServerDebug);

gulp.task('watch', server.watch);

gulp.task('run:serve', cb => {
    runSequence(
        [
            'clean:tmp',
            'lint:scripts',
            'inject',
            'copy:fonts:dev',
            'env:all'
        ],
        // 'webpack:dev',
        ['start:server', 'start:client'],
        'watch',
        cb
    );
});

gulp.task('run:serve:debug', cb => {
    runSequence(
        [
            'clean:tmp',
            'lint:scripts',
            'inject',
            'copy:fonts:dev',
            'env:all'
        ],
        'webpack:dev',
        'start:inspector',
        ['start:server:debug', 'start:client'],
        'watch',
        cb
    );
});

gulp.task('run:serve:dist', cb => {
    runSequence(
        'build',
        'env:all',
        'env:prod',
        ['start:server:prod', 'start:client'],
        cb);
});

/********************
 * Tests
 ********************/

gulp.task('run:test', cb => {
    return runSequence('test:server', 'test:client', cb);
});

gulp.task('test:server', cb => {
    runSequence(
        'env:all',
        'env:test',
        'mocha:unit',
        'mocha:integration',
        cb);
});

gulp.task('mocha:unit', tests.mochaUnit);

gulp.task('mocha:integration', tests.mochaIntegration);

gulp.task('run:test:server:coverage', cb => {
  runSequence('coverage:pre',
              'env:all',
              'env:test',
              'coverage:unit',
              'coverage:integration',
              cb);
});

gulp.task('coverage:pre', tests.preCoverage);

gulp.task('coverage:unit', tests.unitCoverage);

gulp.task('coverage:integration', tests.integrationCoverage);

// Downloads the selenium webdriver
gulp.task('webdriver_update', tests.webDriverUpdate);

gulp.task('run:test:e2e', ['webpack:e2e', 'env:all', 'env:test', 'start:server', 'webdriver_update'], tests.e2eTest);

gulp.task('test:client', tests.clientTest);

/********************
 * Deploy
 ********************/
gulp.task('buildcontrol:heroku', deploy.buildControlHeroku);
gulp.task('buildcontrol:openshift', deploy.buildControlOpenShift);
