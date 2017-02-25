'use strict';

import gulp from 'gulp';
import through2 from 'through2';
//import webpack from 'webpack-stream';
import fs from 'fs';
import path from 'path';
import deepMergeMod from 'deep-merge';
import makeWebpackConfig from '../webpack.make';
import gulpLoadPlugins from 'gulp-load-plugins';
import gConfig from '../gulp-config';
import HtmlWebpackPlugin from 'html-webpack-plugin'; // installed via npm
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack'; // to access built-in plugins
import Q from 'q';

const extractCSS = new ExtractTextPlugin('[name].[chunkhash].css');
const extractLESS = new ExtractTextPlugin('/client/app/mo/[name].css');

const deepmerge = deepMergeMod((target, source, key) => {
  if(target instanceof Array) {
    return [].concat(target, source);
  }
  return source;
});

const plugins = gulpLoadPlugins();
const paths = gConfig.paths;
const serverPath = paths.server.base;
const clientPath = paths.client.base;
const distClientPath = clientPath.replace('src/', '');
const distPath = paths.dist;
const clientDistPath = `${paths.dist}/${distClientPath}`;
const clientImagePath = paths.client.images;
const clientAssetsPath = paths.client.assets;
const buildPath = paths.build;
const appsPath = `${clientDistPath}/apps`;
const revManifestPath = paths.client.revManifest;

// generic

const defaultConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {compact: false},
        //debug: isDebug,
      }, {
        test: /\.scss$/i,
        loader: extractCSS.extract(['css-loader', 'sass-loader']),
        //debug: isDebug,
      }, {
        test: /\.less$/i,
        loader: extractLESS.extract(['css-loader', 'less-loader']),
        //debug: isDebug,
      }, // {
      // test: /\.css$/,
      // exclude: /node_modules/,
      // loader: ExtractTextPlugin.extract(
      //   {
      //     fallbackLoader: 'style-loader',
      //     loader: 'css-loader?sourceMap',
      //     options: {modules: true},
      //   }),
      //},
      {
        // ASSET LOADER
        // Reference: https://github.com/webpack/file-loader
        // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf,
        // eot files to output
        // Rename the file using the asset hash
        // Pass along the updated reference to your code
        // You can add here any file extension you want to
        // get copied to your output
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([\?]?.*)$/,
        exclude: /node_modules/,
        loader: 'file-loader?name=client/apps/[path][name].[ext]&context=./src/client/apps/',
        //debug: isDebug,
      },
      {test: /\.ejs$/, loader: "blueimp-tmpl-loader"},
    ],
  },
  devtool: '#eval-source-map',
  plugins: [
    extractCSS,
    new ExtractTextPlugin({
      filename: 'bundle.css',
      disable: false,
      allChunks: true,
      //debug: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'], // Specify the common bundle's name.
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ],
};

/********************
 * Helpers
 ********************/
function getDefaultHtmlConfig(vanillaName) {
  'use strict';
  return {
    filename: '../views/index.ejs',
    template: require('html-webpack-template'),
    // template: '../views/index.ejs',
    templateContent: function(templateParams, compilation) {
      const tmpl = require('blueimp-tmpl');
      tmpl.cache['index'] = null;
      tmpl.load = function(id) {
        debugger;
        const filename = 'src/client/apps/' + vanillaName + '/views/' + id + '.ejs';
        console.log('Loading ' + filename);
        return fs.readFileSync(filename, 'utf8');
        tmpl.cache['index'] = null;
      };

      return tmpl('index', templateParams);
    },
    inject: false,
    // minify: {
    //   removeAttributeQuotes: true,
    //   collapseWhitespace: true,
    //   collapseInlineTagWhitespace: true,
    //   decodeEntities: true,
    //   html5: true,
    //   removeComments: true,
    //   removeRedundantAttributes: true,
    // },
    hash: true,
    cache: true,
    showErrors: true,
    xhtml: true,
  };
}

/********************
 * Helpers
 ********************/
function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory() && file.indexOf('shared') === -1;
    });
}

function config(overrides) {
  return deepmerge(defaultConfig, overrides || {});
}

function htmlConfig(vanillaName, overrides) {
  return deepmerge(getDefaultHtmlConfig(vanillaName), overrides || {});
}

function generateConfig(vanillaName, htmlPluginConfig) {
  'use strict';
  return config({
    context: path.resolve(__dirname, '../src/client/apps/'+vanillaName+'/static'),
    entry: {
      'app': './index.js',
      'vendor': require('../src/client/apps/' + vanillaName + '/build/vendor'),
    },
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, '../dist/client/apps/'+vanillaName+'/static'),
    },
    plugins: [
      new HtmlWebpackPlugin(htmlPluginConfig),
    ],
  });
}

function onBuild() {
  return function(err, stats) {
    if(err) {
      console.log('(frontend-build) Execution Failed!!!');
      console.log('Error', err);
    } else {
      console.log('(frontend-build) Execution Succeeded!!!');
      console.log(stats.toString());
    }
  };
}

function genWebpackWithConfig(frontendConfig, item) {
  'use strict';
  return function() {
    console.log('(frontend-build) Executing webpack for: ', item);
    webpack(frontendConfig).run(onBuild());
  };
}

const webpackDev = () => {
  const appsPath = `src/client/apps`;
  const folders = getFolders(appsPath);
  const defer = Q.defer();

  console.dir(folders);

  let webpackCompileList = folders.map(function(item) {
    'use strict';
    console.log('(frontend-build) Generating: ', item, __dirname);
    const appHtmlConfig = '../src/client/apps/' + item + '/build/html-config';
    let frontendConfig =
      generateConfig(item, htmlConfig(item, require(appHtmlConfig)));
    return Q.nfcall(genWebpackWithConfig(frontendConfig, item)());
  });

  Q.all(webpackCompileList, function(results) {
    'use strict';
    if(done) {
      done();
    }
    console.log('(frontend-build) Generation Complete');
    defer.resolve();
  });


  return defer.promise;

  //const webpackDevConfig = makeWebpackConfig({ DEV: true });
  //return gulp.src(webpackDevConfig.entry.app)
  //  .pipe(plugins.plumber())
  //  .pipe(webpack(webpackDevConfig))
  //  .pipe(gulp.dest(buildPath));
};

const webpackDist = () => {
  const folders = getFolders(`src/client/apps`);
  const defer = Q.defer();

  console.dir(folders);

  let webpackCompileList = folders.map(function(item) {
    'use strict';
    console.log('(frontend-build) Generating: ', item, __dirname);
    const appHtmlConfig = '../src/client/apps/' + item + '/build/html-config';
    let frontendConfig =
      generateConfig(item, htmlConfig(item, require(appHtmlConfig)));
    return Q.nfcall(genWebpackWithConfig(frontendConfig, item)());
  });

  Q.all(webpackCompileList, function(results) {
    'use strict';
    if(done) {
      done();
    }
    console.log('(frontend-build) Generation Complete');
    defer.resolve();
  });

  return defer.promise;
  // const webpackDistConfig = makeWebpackConfig({ BUILD: true });
  // return gulp.src(webpackDistConfig.folders)
  //   .pipe(webpack(webpackDistConfig))
  //   .on('error', (err) => {
  //     console.dir(err);
  //     this.emit('end'); // Recover from errors
  //   })
  //   .pipe(gulp.dest(clientDistPath));
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
  return gulp.src('../dist/client/**/app.*.js')
    .pipe(plugins.revReplace({manifest: gulp.src(`${appsPath}/${revManifestPath}`)}))
    .pipe(gulp.dest('../dist/client'));
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
  copyServer: copyServer
};
