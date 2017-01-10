'use strict';

import _ from 'lodash';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import gConfig from '../gulp-config';

const plugins = gulpLoadPlugins();
const serverPath = gConfig.paths.server.base;
const clientPath = gConfig.paths.client.base;
const distPath = gConfig.paths.dist;
const clientMainStyle = gConfig.paths.client.mainStyle;
const clientStyles = gConfig.paths.client.styles;

const injectScss = () => {
  return gulp.src(clientMainStyle)
    .pipe(plugins.inject(
      gulp.src(_.union(clientStyles, ['!' + clientMainStyle]), {read: false})
        .pipe(plugins.sort()),
      {
        transform: (filepath) => {
          let newPath = filepath
            .replace(`/${clientPath}/apps/`, '')
            .replace(/[^/]*\/app/, '')
            .replace(/[^/]*\/components\//, '../components/')
            .replace(/_(.*).scss/, (match, p1, offset, string) => p1)
            .replace('.scss', '');
          return `@import '${newPath}';`;
        }
      }))
    .pipe(gulp.dest(`${clientPath}/apps`));
};

const procStyle = () => {
  return gulp.src(paths.client.mainStyle)
    .pipe(styles())
    .pipe(gulp.dest('.tmp/app'));
};

module.exports = {
  injectScss: injectScss,
  procStyle: procStyle,

};
