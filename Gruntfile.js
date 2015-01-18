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

    requirejs: {
      compile: {
        options: {
          appDir: "",
          baseUrl: 'src/js',
          name: 'rpanel',
          include: ["main"],
          optimize: "none",
          out: 'assets/js/app.js',
          skipModuleInsertion: true
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/js/*.js'],
        tasks: ['requirejs'],
        options: {
          spawn: false,
          interrupt: true
        }
      },
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
          "assets/css/rpanel.css": "src/less/rpanel.less"
        }
      },
      production: {
        options: {
          paths: ["src/less"],
          compress: true
        },
        files: {
          "assets/css/rpanel.css": "src/less/rpanel.less"
        }
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['requirejs', 'watch', 'less']);

};