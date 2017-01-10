'use strict';

import grunt from 'grunt';
import gConfig from '../gulp-config';

/********************
 * Grunt ported tasks
 ********************/

grunt.initConfig(gConfig.pluginOpts.grunt.config);

grunt.loadNpmTasks('grunt-build-control');

const buildControlHeroku = (done) => {
  grunt.tasks(
    ['buildcontrol:heroku'],    //you can add more grunt tasks in this array
    {gruntfile: false}, //don't look for a Gruntfile - there is none. :-)
    function() {done();}
  );
};

const buildControlOpenShift = function(done) {
  grunt.tasks(
    ['buildcontrol:openshift'],    //you can add more grunt tasks in this array
    {gruntfile: false}, //don't look for a Gruntfile - there is none. :-)
    function() {done();}
  );
};

module.exports = {
  buildControlHeroku: buildControlHeroku,
  buildControlOpenShift: buildControlOpenShift,

};
