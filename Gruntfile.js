/*
 * grunt-contrib-requirejs
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Tyler Kellen, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      styles: {
        files: ['src/less/**'],
        tasks: ['less'],
        options: {
          spawn: true,
          interrupt: true
        }
      }
    },
    less: {
      development: {
        options: {
          paths: ["src/less"]
        },
        files: {
          "assets/css/rpanel.css": "src/less/rpanel.less",
          "assets/css/demo.css": "src/less/demo.less"
        }
      },
      production: {
        options: {
          paths: ["src/less"],
          compress: true
        },
        files: {
          "assets/css/rpanel.css": "src/less/rpanel.less",
          "assets/css/demo.css": "src/less/demo.less"
        }
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['watch', 'less']);

};