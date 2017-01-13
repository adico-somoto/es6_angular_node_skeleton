const pkg = require('./package.json');
const clientPath = 'client';
const serverPath = 'server';
const distPath = 'dist';

const paths = {
  client: {
    base: clientPath,
    appsBase: `${clientPath}/apps/`,
    assets: `${clientPath}/apps/*/assets/**/*`,
    images: `${clientPath}/apps/*/assets/images/**/*`,
    revManifest: `rev-manifest.json`,
    scripts: [
      `${clientPath}/apps/*/!(*.spec|*.mock).js`
    ],
    styles: [`${clientPath}/apps/*/{app,components}/**/*.scss`],
    mainStyle: `${clientPath}/apps/*/app/app.scss`,
    views: `${clientPath}/apps/*/{app,components}/**/*.html`,
    mainView: `${clientPath}/apps/*/index.html`,
    test: [`${clientPath}/{app,components}/**/*.{spec,mock}.js`],
    e2e: ['e2e/**/*.spec.js']
  },
  server: {
    base: serverPath,
    scripts: [
      `${serverPath}/**/!(*.spec|*.integration).js`,
      `!${serverPath}/config/local.env.sample.js`
    ],
    json: [`${serverPath}/**/*.json`],
    dataJson: [`!${serverPath}/mockData/*.json`],
    test: {
      integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
      unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js']
    }
  },
  karma: 'karma.conf.js',
  dist: distPath,
  build: '.tmp',
};

module.exports = {
  pkg: {
    name: pkg.name
  },
  pluginOpts: {
    browserSync: {
      port   : 1987,
      server : {
        baseDir: serverPath
      }
    },
    babel: {
      presets: [ 'es2015' ]
    },
    gSize: {
      showFiles: true
    },
    pug: {
      pretty: true,
      data  : {
        name       : pkg.name,
        description: pkg.description
      }
    },
    load: {
      rename: {
        'gulp-gh-pages'    : 'deploy',
        'gulp-util'        : 'gUtil',
        'gulp-cssnano'     : 'minify',
        'gulp-autoprefixer': 'prefix'
      }
    },
    prefix: [
      'last 3 versions',
      'Blackberry 10',
      'Android 3',
      'Android 4'
    ],
    rename: {
      suffix: '.min'
    },
    stylint: {
      reporter: 'stylint-stylish'
    },
    wrap: '(function() { <%= contents %> }());',
    grunt: {
      config: {
        buildcontrol: {
          options: {
            dir: distPath,
            commit: true,
            push: true,
            connectCommits: false,
            message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
          },
          heroku: {
            options: {
              remote: 'heroku',
              branch: 'master'
            }
          },
          openshift: {
            options: {
              remote: 'openshift',
              branch: 'master'
            }
          }
        }
      }
    },
  },
  paths: paths,
  old_paths: {
    base: serverPath,
    sources: {
      docs     : 'src/markup/*.pug',
      markup   : 'src/markup/**/*.pug',
      overwatch: `$(serverPath)/**/*.{html,js,css}`,
      scripts  : 'src/script/**/*.js',
      styles   : 'src/style/**/*.styl'
    },
    destinations: {
      dist: './dist',
      css : `${serverPath}/css/`,
      html: `${serverPath}/`,
      js  : `${serverPath}/js/`
    }
  }
};
