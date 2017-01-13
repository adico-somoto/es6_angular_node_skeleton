'use strict';

import gulp from 'gulp';
import through2 from 'through2';
import webpack from 'webpack-stream';
import path from 'path';
import makeWebpackConfig from '../webpack.make';
import gulpLoadPlugins from 'gulp-load-plugins';
import gConfig from '../gulp-config';

const plugins = gulpLoadPlugins();
const paths = gConfig.paths;
const serverPath = paths.server.base;
const clientPath = paths.client.base;
const distPath = paths.dist;
const clientDistPath = `${paths.dist}/${clientPath}`;
const clientImagePath = paths.client.images;
const clientAssetsPath = paths.client.assets;
const buildPath = paths.build;
const appsPath = `${clientDistPath}/apps`;
const revManifestPath = paths.client.revManifest;

const webpackDev = () => {
  const webpackDevConfig = makeWebpackConfig({ DEV: true });
  return gulp.src(webpackDevConfig.entry.app)
    .pipe(plugins.plumber())
    .pipe(webpack(webpackDevConfig))
    .pipe(gulp.dest(buildPath));
};

const webpackDist = () => {
  const webpackDistConfig = makeWebpackConfig({ BUILD: true });
  return gulp.src(webpackDistConfig.folders)
    .pipe(webpack(webpackDistConfig))
    .on('error', (err) => {
      console.dir(err);
      this.emit('end'); // Recover from errors
    })
    .pipe(gulp.dest(clientDistPath));
};

const webpackTest = () => {
  const webpackTestConfig = makeWebpackConfig({ TEST: true });
  return gulp.src(webpackTestConfig.folders)
    .pipe(webpack(webpackTestConfig))
    .pipe(gulp.dest(buildPath));
};

const webpackE2e = () => {
  const webpackE2eConfig = makeWebpackConfig({ E2E: true });
  return gulp.src(webpackE2eConfig.folders)
    .pipe(webpack(webpackE2eConfig))
    .pipe(gulp.dest(buildPath));
};

const buildImages = () => {
  return gulp.src(clientImagePath)
    .pipe(plugins.base(paths.client.appsBase))
    .pipe(plugins.imagemin([
      plugins.imagemin.optipng({ optimizationLevel: 5 }),
      plugins.imagemin.jpegtran({ progressive: true }),
      plugins.imagemin.gifsicle({ interlaced: true }),
      plugins.imagemin.svgo({ plugins: [{ removeViewBox: false }] })
    ]))
    .pipe(plugins.rev())
    .pipe(gulp.dest(`${appsPath}`))
    .pipe(plugins.rev.manifest(`${appsPath}/${paths.client.revManifest}`, {
      base: `${appsPath}`,
      merge: true
    }))
    .pipe(plugins.debug({minimal: false}))
    .pipe(gulp.dest(`${appsPath}`));
};

const revReplaceWebpack = () => {
  return gulp.src('dist/client/**/app.*.js')
    .pipe(plugins.revReplace({manifest: gulp.src(`${appsPath}/${revManifestPath}`)}))
    .pipe(gulp.dest('dist/client'));
};

const copyExtras = () => {
  return gulp.src([
    `${clientPath}/**/favicon.ico`,
    `${clientPath}/robots.txt`,
    `${clientPath}/.htaccess`
  ], { dot: true })
    .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
};

/**
 * turns 'boostrap/fonts/font.woff' into 'boostrap/font.woff'
 */
function flatten() {
  return through2.obj(function(file, enc, next) {
    if(!file.isDirectory()) {
      try {
        let dir = path.dirname(file.relative).split(path.sep)[0];
        let fileName = path.normalize(path.basename(file.path));
        file.path = path.join(file.base, path.join(dir, fileName));
        this.push(file);
      } catch(e) {
        this.emit('error', new Error(e));
      }
    }
    next();
  });
}

const copyFontsDev = () => {
  return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
    .pipe(flatten())
    .pipe(gulp.dest(`${clientPath}/assets/fonts`));
};

const copyFontsDist = () => {
  return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
    .pipe(flatten())
    .pipe(gulp.dest(`${clientDistPath}/assets/fonts`));
};

const copyAssets = () => {
  return gulp.src([clientAssetsPath, '!' + clientImagePath])
    .pipe(gulp.dest(`${appsPath}/assets`));
};

const copyServer = () => {
  return gulp.src([
    'package.json',
    'server/mockData/**/*'
  ], {cwdbase: true})
    .pipe(gulp.dest(distPath));
};

module.exports = {
  webpackDev: webpackDev,
  webpackDist: webpackDist,
  webpackTest: webpackTest,
  webpackE2e: webpackE2e,
  buildImages: buildImages,
  revReplaceWebpack: revReplaceWebpack,
  copyExtras: copyExtras,
  copyFontsDev: copyFontsDev,
  copyFontsDist: copyFontsDist,
  copyAssets: copyAssets,
  copyServer: copyServer,

};
